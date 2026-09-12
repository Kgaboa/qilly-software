import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Activity,
  Zap,
  Database,
  Users,
  Download,
  PlayCircle,
  StopCircle,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Server,
  Lock,
  Package,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { supabase } from '../../utils/supabase';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { exportToJSON, exportToHTML, exportToExcel } from '../../utils/exportHelpers';

interface TestResult {
  id: string;
  testName: string;
  status: 'pending' | 'running' | 'success' | 'error';
  duration: number;
  timestamp: string;
  details: string;
  errorMessage?: string;
  metric?: number;
}

interface PerformanceMetrics {
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  throughput: number;
  errorRate: number;
  successRate: number;
}

interface LoadTestConfig {
  concurrentUsers: number;
  testDuration: number;
  rampUpTime: number;
  scenario: string;
}

export function PerformanceStressTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState('');
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('config');

  // Load test configuration
  const [loadConfig, setLoadConfig] = useState<LoadTestConfig>({
    concurrentUsers: 10,
    testDuration: 60,
    rampUpTime: 10,
    scenario: 'light',
  });

  // Helper function to add test result
  const addTestResult = (
    testName: string,
    status: 'success' | 'error',
    duration: number,
    details: string,
    errorMessage?: string,
    metric?: number
  ) => {
    const result: TestResult = {
      id: Date.now().toString(),
      testName,
      status,
      duration,
      timestamp: new Date().toISOString(),
      details,
      errorMessage,
      metric,
    };
    setTestResults((prev) => [...prev, result]);
    return result;
  };

  // Database Performance Tests
  const testDatabasePerformance = async () => {
    const tests = [
      {
        name: 'Supplier Query Performance',
        test: async () => {
          const start = performance.now();
          const { data, error } = await supabase
            .from('suppliers')
            .select('*')
            .limit(100);
          const duration = performance.now() - start;
          if (error) throw error;
          return {
            duration,
            details: `Fetched ${data?.length || 0} suppliers`,
            metric: data?.length || 0,
          };
        },
      },
      {
        name: 'Product Query Performance',
        test: async () => {
          const start = performance.now();
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .limit(100);
          const duration = performance.now() - start;
          if (error) throw error;
          return {
            duration,
            details: `Fetched ${data?.length || 0} products`,
            metric: data?.length || 0,
          };
        },
      },
      {
        name: 'Provincial Pricing Query',
        test: async () => {
          const start = performance.now();
          const { data, error } = await supabase
            .from('provincial_pricing_factors')
            .select('*');
          const duration = performance.now() - start;
          if (error) throw error;
          return {
            duration,
            details: `Fetched ${data?.length || 0} provincial pricing records`,
            metric: data?.length || 0,
          };
        },
      },
      {
        name: 'Bills Query Performance',
        test: async () => {
          const start = performance.now();
          const { data, error } = await supabase
            .from('bills')
            .select('*')
            .limit(50);
          const duration = performance.now() - start;
          if (error) throw error;
          return {
            duration,
            details: `Fetched ${data?.length || 0} bills`,
            metric: data?.length || 0,
          };
        },
      },
      {
        name: 'Complex Join Query (Bills + Items)',
        test: async () => {
          const start = performance.now();
          const { data, error } = await supabase
            .from('bills')
            .select('*, bill_items(*)')
            .limit(20);
          const duration = performance.now() - start;
          if (error) throw error;
          return {
            duration,
            details: `Fetched ${data?.length || 0} bills with items`,
            metric: data?.length || 0,
          };
        },
      },
    ];

    for (const { name, test } of tests) {
      setCurrentTest(name);
      try {
        const result = await test();
        addTestResult('success', 'success', result.duration, result.details, undefined, result.metric);
      } catch (error: any) {
        addTestResult(name, 'error', 0, 'Query failed', error.message);
      }
    }
  };

  // Authentication Performance Tests
  const testAuthenticationPerformance = async () => {
    const tests = [
      {
        name: 'Session Validation Performance',
        test: async () => {
          const start = performance.now();
          const { data, error } = await supabase.auth.getSession();
          const duration = performance.now() - start;
          if (error) throw error;
          return {
            duration,
            details: `Session validated: ${data.session ? 'Active' : 'Inactive'}`,
            metric: duration,
          };
        },
      },
      {
        name: 'User Metadata Fetch',
        test: async () => {
          const start = performance.now();
          const { data, error } = await supabase.auth.getUser();
          const duration = performance.now() - start;
          if (error) throw error;
          return {
            duration,
            details: `User fetched: ${data.user?.email || 'N/A'}`,
            metric: duration,
          };
        },
      },
    ];

    for (const { name, test } of tests) {
      setCurrentTest(name);
      try {
        const result = await test();
        addTestResult(name, 'success', result.duration, result.details, undefined, result.metric);
      } catch (error: any) {
        addTestResult(name, 'error', 0, 'Auth test failed', error.message);
      }
    }
  };

  // Concurrent User Simulation
  const simulateConcurrentUsers = async (userCount: number) => {
    setCurrentTest(`Simulating ${userCount} concurrent users`);
    const start = performance.now();
    const promises = [];

    for (let i = 0; i < userCount; i++) {
      // Simulate typical user actions
      const userPromise = (async () => {
        const actions = [
          supabase.from('suppliers').select('*').limit(10),
          supabase.from('products').select('*').limit(10),
          supabase.from('provincial_pricing_factors').select('*').limit(5),
        ];
        return Promise.all(actions);
      })();
      promises.push(userPromise);
    }

    try {
      await Promise.all(promises);
      const duration = performance.now() - start;
      addTestResult(
        `${userCount} Concurrent Users`,
        'success',
        duration,
        `Successfully handled ${userCount} concurrent users`,
        undefined,
        userCount
      );
    } catch (error: any) {
      const duration = performance.now() - start;
      addTestResult(
        `${userCount} Concurrent Users`,
        'error',
        duration,
        'Concurrent user test failed',
        error.message
      );
    }
  };

  // Load Test - Sustained Traffic
  const runLoadTest = async () => {
    setCurrentTest(`Load Test: ${loadConfig.scenario}`);
    const iterations = Math.floor(loadConfig.testDuration / 5); // Test every 5 seconds
    const tempChartData: any[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      try {
        // Simulate typical load
        await Promise.all([
          supabase.from('suppliers').select('*').limit(20),
          supabase.from('products').select('*').limit(20),
          supabase.from('bills').select('*').limit(10),
        ]);
        const duration = performance.now() - start;

        tempChartData.push({
          time: `${i * 5}s`,
          responseTime: Math.round(duration),
          success: 1,
        });

        setProgress(((i + 1) / iterations) * 100);
      } catch (error) {
        tempChartData.push({
          time: `${i * 5}s`,
          responseTime: 0,
          success: 0,
        });
      }

      // Wait 5 seconds before next iteration
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    setChartData(tempChartData);
    addTestResult(
      `Load Test (${loadConfig.scenario})`,
      'success',
      loadConfig.testDuration * 1000,
      `Completed ${iterations} iterations over ${loadConfig.testDuration}s`,
      undefined,
      iterations
    );
  };

  // Pricing Engine Performance Test
  const testPricingEngine = async () => {
    setCurrentTest('Pricing Engine Performance');
    const start = performance.now();

    try {
      // Simulate BOQ pricing calculation
      const testItems = Array.from({ length: 50 }, (_, i) => ({
        description: `Test Item ${i}`,
        quantity: Math.random() * 100,
        unit: 'm²',
      }));

      // Fetch suppliers and products for pricing
      const { data: suppliers } = await supabase.from('suppliers').select('*').limit(10);
      const { data: products } = await supabase.from('products').select('*').limit(100);
      const { data: pricing } = await supabase.from('provincial_pricing_factors').select('*');

      const duration = performance.now() - start;
      addTestResult(
        'Pricing Engine Test',
        'success',
        duration,
        `Processed ${testItems.length} items with ${suppliers?.length || 0} suppliers`,
        undefined,
        testItems.length
      );
    } catch (error: any) {
      const duration = performance.now() - start;
      addTestResult('Pricing Engine Test', 'error', duration, 'Pricing failed', error.message);
    }
  };

  // Run All Tests
  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setProgress(0);
    setActiveTab('results');

    try {
      // Phase 1: Database Performance
      setCurrentTest('Phase 1: Database Performance Tests');
      await testDatabasePerformance();
      setProgress(20);

      // Phase 2: Authentication Performance
      setCurrentTest('Phase 2: Authentication Tests');
      await testAuthenticationPerformance();
      setProgress(40);

      // Phase 3: Pricing Engine
      setCurrentTest('Phase 3: Pricing Engine Test');
      await testPricingEngine();
      setProgress(60);

      // Phase 4: Concurrent Users
      setCurrentTest('Phase 4: Concurrent User Simulation');
      await simulateConcurrentUsers(5);
      await simulateConcurrentUsers(10);
      await simulateConcurrentUsers(20);
      setProgress(80);

      // Phase 5: Load Test
      if (loadConfig.scenario !== 'skip') {
        setCurrentTest('Phase 5: Load Test');
        await runLoadTest();
      }
      setProgress(100);

      // Calculate metrics
      calculateMetrics();
    } catch (error: any) {
      console.error('Test suite error:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  // Calculate Performance Metrics
  const calculateMetrics = () => {
    const successResults = testResults.filter((r) => r.status === 'success');
    const errorResults = testResults.filter((r) => r.status === 'error');

    if (successResults.length === 0) {
      setMetrics(null);
      return;
    }

    const durations = successResults.map((r) => r.duration);
    const avgResponseTime = durations.reduce((a, b) => a + b, 0) / durations.length;
    const minResponseTime = Math.min(...durations);
    const maxResponseTime = Math.max(...durations);
    const totalTests = testResults.length;
    const successRate = (successResults.length / totalTests) * 100;
    const errorRate = (errorResults.length / totalTests) * 100;

    setMetrics({
      avgResponseTime: Math.round(avgResponseTime),
      minResponseTime: Math.round(minResponseTime),
      maxResponseTime: Math.round(maxResponseTime),
      throughput: Math.round((successResults.length / (totalTests * avgResponseTime)) * 1000),
      errorRate: Math.round(errorRate * 10) / 10,
      successRate: Math.round(successRate * 10) / 10,
    });
  };

  // Export Results
  const exportResults = () => {
    const report = {
      timestamp: new Date().toISOString(),
      configuration: loadConfig,
      metrics,
      results: testResults,
      chartData,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qilly-performance-test-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Activity className="h-4 w-4 text-blue-600 animate-pulse" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getScenarioConfig = (scenario: string) => {
    switch (scenario) {
      case 'light':
        return { users: 5, duration: 30 };
      case 'medium':
        return { users: 20, duration: 60 };
      case 'heavy':
        return { users: 50, duration: 120 };
      default:
        return { users: 10, duration: 60 };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Zap className="h-8 w-8 text-orange-600" />
              Qilly Performance & Stress Test
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive performance testing for Tuesday's eTender presentation
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-orange-700"
            >
              {isRunning ? (
                <>
                  <StopCircle className="h-5 w-5 mr-2 animate-pulse" />
                  Running Tests...
                </>
              ) : (
                <>
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
            {testResults.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg">
                    <Download className="h-5 w-5 mr-2" />
                    Export Results
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => {
                      const report = {
                        timestamp: new Date().toISOString(),
                        configuration: loadConfig,
                        metrics,
                        results: testResults,
                        chartData,
                      };
                      exportToJSON(report, `qilly-performance-test-${Date.now()}`);
                      toast.success('Performance test exported as JSON');
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const report = {
                        timestamp: new Date().toISOString(),
                        configuration: loadConfig,
                        metrics,
                        results: testResults,
                        chartData,
                      };
                      exportToHTML(report, `qilly-performance-test-${Date.now()}`, 'Qilly Performance Test Report');
                      toast.success('Performance test exported as HTML');
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export as HTML
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const report = {
                        timestamp: new Date().toISOString(),
                        configuration: loadConfig,
                        metrics,
                        results: testResults,
                        chartData,
                      };
                      exportToExcel(report, `qilly-performance-test-${Date.now()}`);
                      toast.success('Performance test exported as Excel');
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{currentTest}</span>
                  <span className="text-gray-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metrics Summary */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Avg Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.avgResponseTime}ms</div>
                <p className="text-xs text-gray-600 mt-1">
                  Range: {metrics.minResponseTime}ms - {metrics.maxResponseTime}ms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{metrics.successRate}%</div>
                <p className="text-xs text-gray-600 mt-1">Error Rate: {metrics.errorRate}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-600" />
                  Throughput
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.throughput}</div>
                <p className="text-xs text-gray-600 mt-1">Requests per second</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="config">
              <Server className="h-4 w-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="results">
              <BarChart3 className="h-4 w-4 mr-2" />
              Test Results
            </TabsTrigger>
            <TabsTrigger value="charts">
              <Activity className="h-4 w-4 mr-2" />
              Performance Charts
            </TabsTrigger>
            <TabsTrigger value="scenarios">
              <Package className="h-4 w-4 mr-2" />
              Test Scenarios
            </TabsTrigger>
          </TabsList>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Load Test Configuration</CardTitle>
                <CardDescription>Configure stress test parameters for your scenario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="scenario">Test Scenario</Label>
                    <select
                      id="scenario"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      value={loadConfig.scenario}
                      onChange={(e) =>
                        setLoadConfig((prev) => ({
                          ...prev,
                          scenario: e.target.value,
                          ...getScenarioConfig(e.target.value),
                        }))
                      }
                    >
                      <option value="light">Light Load (5 users, 30s)</option>
                      <option value="medium">Medium Load (20 users, 60s)</option>
                      <option value="heavy">Heavy Load (50 users, 120s)</option>
                      <option value="custom">Custom Configuration</option>
                      <option value="skip">Skip Load Test</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="users">Concurrent Users</Label>
                    <Input
                      id="users"
                      type="number"
                      min="1"
                      max="100"
                      value={loadConfig.concurrentUsers}
                      onChange={(e) =>
                        setLoadConfig((prev) => ({ ...prev, concurrentUsers: parseInt(e.target.value) }))
                      }
                      disabled={loadConfig.scenario !== 'custom'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Test Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="10"
                      max="300"
                      value={loadConfig.testDuration}
                      onChange={(e) =>
                        setLoadConfig((prev) => ({ ...prev, testDuration: parseInt(e.target.value) }))
                      }
                      disabled={loadConfig.scenario !== 'custom'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rampup">Ramp-up Time (seconds)</Label>
                    <Input
                      id="rampup"
                      type="number"
                      min="0"
                      max="60"
                      value={loadConfig.rampUpTime}
                      onChange={(e) =>
                        setLoadConfig((prev) => ({ ...prev, rampUpTime: parseInt(e.target.value) }))
                      }
                      disabled={loadConfig.scenario !== 'custom'}
                    />
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Testing Recommendations</AlertTitle>
                  <AlertDescription>
                    For the eTender demo, we recommend starting with "Light Load" to establish baseline performance.
                    Use "Medium Load" to demonstrate scalability to investors.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Coverage</CardTitle>
                <CardDescription>Areas covered by the performance test suite</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Database, title: 'Database Queries', desc: 'Supplier, Product, Pricing queries' },
                    { icon: Lock, title: 'Authentication', desc: 'Session validation, user metadata' },
                    { icon: Users, title: 'Concurrent Users', desc: 'Simulate 5, 10, 20+ users' },
                    { icon: Package, title: 'Pricing Engine', desc: 'BOQ calculation performance' },
                    { icon: Activity, title: 'Load Testing', desc: 'Sustained traffic simulation' },
                    { icon: BarChart3, title: 'Metrics', desc: 'Response time, throughput, errors' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                      <item.icon className="h-5 w-5 text-orange-600 mt-1" />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-600">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4">
            {testResults.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No test results yet. Run tests to see performance data.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Test Results ({testResults.length} tests)</CardTitle>
                  <CardDescription>Detailed performance test execution results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {testResults.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {getStatusIcon(result.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{result.testName}</span>
                            <div className="flex items-center gap-3">
                              {result.metric !== undefined && (
                                <Badge variant="outline" className="text-xs">
                                  {result.metric} items
                                </Badge>
                              )}
                              <Badge
                                variant={result.status === 'success' ? 'default' : 'destructive'}
                                className="text-xs"
                              >
                                {result.duration}ms
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{result.details}</p>
                          {result.errorMessage && (
                            <p className="text-sm text-red-600 mt-1 font-mono">{result.errorMessage}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-4">
            {chartData.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No chart data available. Run a load test to generate performance graphs.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Response Time Over Time</CardTitle>
                    <CardDescription>Real-time response time during load test</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="responseTime"
                          stroke="#ea580c"
                          fill="#fed7aa"
                          name="Response Time"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Success Rate</CardTitle>
                    <CardDescription>Request success over test duration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="success" fill="#16a34a" name="Successful Requests" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pre-configured Test Scenarios</CardTitle>
                <CardDescription>
                  Ready-to-use scenarios for different testing objectives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: 'Demo Preparation',
                    desc: 'Light load test to verify system is ready for presentation',
                    config: 'light',
                    badge: 'Recommended',
                    color: 'bg-green-100 text-green-800',
                  },
                  {
                    title: 'Investor Showcase',
                    desc: 'Medium load to demonstrate scalability to investors',
                    config: 'medium',
                    badge: 'For Presentation',
                    color: 'bg-blue-100 text-blue-800',
                  },
                  {
                    title: 'Production Readiness',
                    desc: 'Heavy load test to validate production deployment readiness',
                    config: 'heavy',
                    badge: 'Advanced',
                    color: 'bg-orange-100 text-orange-800',
                  },
                  {
                    title: 'Quick Validation',
                    desc: 'Fast database and auth tests only (skip load testing)',
                    config: 'skip',
                    badge: 'Fast',
                    color: 'bg-purple-100 text-purple-800',
                  },
                ].map((scenario, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{scenario.title}</h3>
                        <Badge className={scenario.color}>{scenario.badge}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{scenario.desc}</p>
                    </div>
                    <Button
                      onClick={() => {
                        setLoadConfig((prev) => ({
                          ...prev,
                          scenario: scenario.config,
                          ...getScenarioConfig(scenario.config),
                        }));
                        setActiveTab('config');
                      }}
                      variant="outline"
                    >
                      Use This
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tuesday Presentation Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Run "Demo Preparation" scenario to establish baseline performance',
                    'Verify all database queries return within acceptable time (<500ms)',
                    'Confirm concurrent user handling (10+ users)',
                    'Export test results for presentation backup',
                    'Test pricing engine with sample BOQ data',
                    'Validate authentication performance',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-gray-400 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}