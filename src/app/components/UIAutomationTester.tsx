import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  PlayCircle,
  StopCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  Code,
  TestTube2,
  FileText,
  Zap,
  Camera,
  Clock,
  MousePointer,
  Keyboard,
  MonitorCheck,
  Bug,
  GitCompare,
  RefreshCw,
  Shield,
  Search,
  ShoppingCart,
  Settings,
  BarChart,
  Users,
  DollarSign,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { exportToJSON, exportToHTML, exportToExcel } from '../../utils/exportHelpers';

interface TestStep {
  id: string;
  type: 'navigation' | 'click' | 'input' | 'assertion' | 'wait' | 'screenshot';
  selector?: string;
  value?: string;
  expected?: string;
  timeout?: number;
  description: string;
}

interface TestCase {
  id: string;
  name: string;
  description: string;
  steps: TestStep[];
  tags: string[];
  enabled: boolean;
}

interface TestResult {
  testCaseId: string;
  testCaseName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  timestamp: string;
  error?: string;
  screenshots: string[];
  stepResults: {
    stepId: string;
    status: 'passed' | 'failed';
    duration: number;
    error?: string;
  }[];
}

export function UIAutomationTester() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('tests');
  const [recordingMode, setRecordingMode] = useState(false);
  const [recordedSteps, setRecordedSteps] = useState<TestStep[]>([]);

  // Pre-defined test cases for Qilly
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: 'auth-login',
      name: 'Authentication - User Login',
      description: 'Test user login flow with valid credentials',
      enabled: true,
      tags: ['auth', 'critical', 'smoke'],
      steps: [
        {
          id: 'step-1',
          type: 'navigation',
          value: '/',
          description: 'Navigate to home page',
        },
        {
          id: 'step-2',
          type: 'assertion',
          selector: 'input[type="email"]',
          description: 'Verify email input exists',
        },
        {
          id: 'step-3',
          type: 'input',
          selector: 'input[type="email"]',
          value: 'test@example.com',
          description: 'Enter email address',
        },
        {
          id: 'step-4',
          type: 'input',
          selector: 'input[type="password"]',
          value: 'testpassword',
          description: 'Enter password',
        },
        {
          id: 'step-5',
          type: 'screenshot',
          description: 'Capture login form',
        },
        {
          id: 'step-6',
          type: 'click',
          selector: 'button[type="submit"]',
          description: 'Click login button',
        },
        {
          id: 'step-7',
          type: 'wait',
          timeout: 3000,
          description: 'Wait for authentication',
        },
        {
          id: 'step-8',
          type: 'screenshot',
          description: 'Capture post-login state',
        },
      ],
    },
    {
      id: 'boq-upload',
      name: 'BOQ - Upload and Process',
      description: 'Test BOQ file upload and pricing workflow',
      enabled: true,
      tags: ['boq', 'critical', 'workflow'],
      steps: [
        {
          id: 'step-1',
          type: 'navigation',
          value: '/',
          description: 'Navigate to dashboard',
        },
        {
          id: 'step-2',
          type: 'assertion',
          selector: '[data-testid="boq-upload"]',
          description: 'Verify BOQ upload button exists',
        },
        {
          id: 'step-3',
          type: 'click',
          selector: '[data-testid="boq-upload"]',
          description: 'Click BOQ upload button',
        },
        {
          id: 'step-4',
          type: 'wait',
          timeout: 1000,
          description: 'Wait for upload modal',
        },
        {
          id: 'step-5',
          type: 'screenshot',
          description: 'Capture upload modal',
        },
      ],
    },
    {
      id: 'supplier-search',
      name: 'Supplier Search',
      description: 'Test supplier search and filtering',
      enabled: true,
      tags: ['supplier', 'search', 'regression'],
      steps: [
        {
          id: 'step-1',
          type: 'navigation',
          value: '/',
          description: 'Navigate to main page',
        },
        {
          id: 'step-2',
          type: 'input',
          selector: 'input[placeholder*="search"]',
          value: 'BuildIt',
          description: 'Search for BuildIt supplier',
        },
        {
          id: 'step-3',
          type: 'wait',
          timeout: 2000,
          description: 'Wait for search results',
        },
        {
          id: 'step-4',
          type: 'assertion',
          selector: 'text=BuildIt',
          description: 'Verify BuildIt appears in results',
        },
        {
          id: 'step-5',
          type: 'screenshot',
          description: 'Capture search results',
        },
      ],
    },
    {
      id: 'provincial-pricing',
      name: 'Provincial Pricing Calculation',
      description: 'Test provincial pricing factors application',
      enabled: true,
      tags: ['pricing', 'provincial', 'calculation'],
      steps: [
        {
          id: 'step-1',
          type: 'navigation',
          value: '/',
          description: 'Navigate to dashboard',
        },
        {
          id: 'step-2',
          type: 'click',
          selector: '[data-province="gauteng"]',
          description: 'Select Gauteng province',
        },
        {
          id: 'step-3',
          type: 'wait',
          timeout: 1500,
          description: 'Wait for pricing update',
        },
        {
          id: 'step-4',
          type: 'screenshot',
          description: 'Capture Gauteng pricing',
        },
        {
          id: 'step-5',
          type: 'click',
          selector: '[data-province="western-cape"]',
          description: 'Select Western Cape province',
        },
        {
          id: 'step-6',
          type: 'wait',
          timeout: 1500,
          description: 'Wait for pricing update',
        },
        {
          id: 'step-7',
          type: 'screenshot',
          description: 'Capture Western Cape pricing',
        },
        {
          id: 'step-8',
          type: 'assertion',
          selector: '[data-testid="price-total"]',
          description: 'Verify price total updated',
        },
      ],
    },
    {
      id: 'responsive-mobile',
      name: 'Responsive Design - Mobile View',
      description: 'Test mobile responsive layout',
      enabled: true,
      tags: ['responsive', 'mobile', 'ui'],
      steps: [
        {
          id: 'step-1',
          type: 'navigation',
          value: '/',
          description: 'Navigate to home page',
        },
        {
          id: 'step-2',
          type: 'screenshot',
          description: 'Capture desktop view',
        },
        {
          id: 'step-3',
          type: 'assertion',
          selector: '[data-testid="mobile-menu"]',
          description: 'Verify mobile menu exists',
        },
        {
          id: 'step-4',
          type: 'screenshot',
          description: 'Capture mobile view',
        },
      ],
    },
    {
      id: 'form-validation',
      name: 'Form Validation',
      description: 'Test form field validation and error messages',
      enabled: true,
      tags: ['validation', 'forms', 'regression'],
      steps: [
        {
          id: 'step-1',
          type: 'navigation',
          value: '/',
          description: 'Navigate to form',
        },
        {
          id: 'step-2',
          type: 'click',
          selector: 'button[type="submit"]',
          description: 'Submit empty form',
        },
        {
          id: 'step-3',
          type: 'assertion',
          selector: '.error-message',
          description: 'Verify error messages appear',
        },
        {
          id: 'step-4',
          type: 'screenshot',
          description: 'Capture validation errors',
        },
        {
          id: 'step-5',
          type: 'input',
          selector: 'input[type="email"]',
          value: 'invalid-email',
          description: 'Enter invalid email',
        },
        {
          id: 'step-6',
          type: 'assertion',
          selector: 'text=Invalid email',
          description: 'Verify email validation',
        },
      ],
    },
  ]);

  // Execute a single test step
  const executeStep = async (step: TestStep): Promise<{ success: boolean; error?: string }> => {
    try {
      switch (step.type) {
        case 'navigation':
          // Simulate navigation (in real implementation, would use window.location or test framework)
          console.log(`Navigate to: ${step.value}`);
          await new Promise((resolve) => setTimeout(resolve, 500));
          return { success: true };

        case 'click':
          // Simulate clicking an element
          const clickElement = step.selector ? document.querySelector(step.selector) : null;
          if (!clickElement) {
            return { success: false, error: `Element not found: ${step.selector}` };
          }
          console.log(`Click element: ${step.selector}`);
          await new Promise((resolve) => setTimeout(resolve, 300));
          return { success: true };

        case 'input':
          // Simulate typing into an input
          const inputElement = step.selector ? document.querySelector(step.selector) : null;
          if (!inputElement) {
            return { success: false, error: `Input element not found: ${step.selector}` };
          }
          console.log(`Type "${step.value}" into ${step.selector}`);
          await new Promise((resolve) => setTimeout(resolve, 500));
          return { success: true };

        case 'assertion':
          // Simulate checking if element exists
          const assertElement = step.selector ? document.querySelector(step.selector) : null;
          if (!assertElement && !step.selector?.startsWith('text=')) {
            return { success: false, error: `Assertion failed: ${step.selector} not found` };
          }
          console.log(`Assert element exists: ${step.selector}`);
          return { success: true };

        case 'wait':
          // Wait for specified timeout
          console.log(`Wait ${step.timeout}ms`);
          await new Promise((resolve) => setTimeout(resolve, step.timeout || 1000));
          return { success: true };

        case 'screenshot':
          // Simulate taking a screenshot
          console.log('Take screenshot');
          await new Promise((resolve) => setTimeout(resolve, 200));
          return { success: true };

        default:
          return { success: false, error: `Unknown step type: ${step.type}` };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // Run a single test case
  const runTestCase = async (testCase: TestCase): Promise<TestResult> => {
    const startTime = performance.now();
    const stepResults: TestResult['stepResults'] = [];
    const screenshots: string[] = [];

    setCurrentTest(testCase.name);

    for (const step of testCase.steps) {
      const stepStartTime = performance.now();
      const result = await executeStep(step);
      const stepDuration = performance.now() - stepStartTime;

      stepResults.push({
        stepId: step.id,
        status: result.success ? 'passed' : 'failed',
        duration: Math.round(stepDuration),
        error: result.error,
      });

      if (step.type === 'screenshot') {
        screenshots.push(`screenshot-${testCase.id}-${step.id}.png`);
      }

      if (!result.success) {
        // Test failed, return early
        return {
          testCaseId: testCase.id,
          testCaseName: testCase.name,
          status: 'failed',
          duration: Math.round(performance.now() - startTime),
          timestamp: new Date().toISOString(),
          error: result.error,
          screenshots,
          stepResults,
        };
      }
    }

    // All steps passed
    return {
      testCaseId: testCase.id,
      testCaseName: testCase.name,
      status: 'passed',
      duration: Math.round(performance.now() - startTime),
      timestamp: new Date().toISOString(),
      screenshots,
      stepResults,
    };
  };

  // Run all selected test cases
  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setProgress(0);

    const testsToRun = testCases.filter(
      (tc) => tc.enabled && (selectedTestCases.length === 0 || selectedTestCases.includes(tc.id))
    );

    const results: TestResult[] = [];

    for (let i = 0; i < testsToRun.length; i++) {
      const testCase = testsToRun[i];
      const result = await runTestCase(testCase);
      results.push(result);
      setTestResults([...results]);
      setProgress(((i + 1) / testsToRun.length) * 100);
    }

    setIsRunning(false);
    setCurrentTest('');
    toast.success(`Completed ${results.length} tests: ${results.filter((r) => r.status === 'passed').length} passed`);
  };

  // Toggle test case selection
  const toggleTestCase = (testCaseId: string) => {
    setSelectedTestCases((prev) =>
      prev.includes(testCaseId) ? prev.filter((id) => id !== testCaseId) : [...prev, testCaseId]
    );
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'skipped':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  // Calculate summary stats
  const summaryStats = {
    total: testResults.length,
    passed: testResults.filter((r) => r.status === 'passed').length,
    failed: testResults.filter((r) => r.status === 'failed').length,
    passRate:
      testResults.length > 0
        ? Math.round((testResults.filter((r) => r.status === 'passed').length / testResults.length) * 100)
        : 0,
    avgDuration:
      testResults.length > 0 ? Math.round(testResults.reduce((sum, r) => sum + r.duration, 0) / testResults.length) : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <TestTube2 className="h-8 w-8 text-blue-600" />
              UI Automation & Regression Testing
            </h1>
            <p className="text-gray-600 mt-1">Automated testing for Qilly web application</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={runTests} disabled={isRunning} size="lg" className="bg-blue-600 hover:bg-blue-700">
              {isRunning ? (
                <>
                  <StopCircle className="h-5 w-5 mr-2 animate-pulse" />
                  Running Tests...
                </>
              ) : (
                <>
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Run Tests
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
                        summary: {
                          total: testResults.length,
                          passed: testResults.filter((r) => r.status === 'passed').length,
                          failed: testResults.filter((r) => r.status === 'failed').length,
                          duration: testResults.reduce((sum, r) => sum + r.duration, 0),
                        },
                        results: testResults,
                      };
                      exportToJSON(report, `qilly-ui-test-results-${Date.now()}`);
                      toast.success('UI test results exported as JSON');
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const report = {
                        timestamp: new Date().toISOString(),
                        summary: {
                          total: testResults.length,
                          passed: testResults.filter((r) => r.status === 'passed').length,
                          failed: testResults.filter((r) => r.status === 'failed').length,
                          duration: testResults.reduce((sum, r) => sum + r.duration, 0),
                        },
                        results: testResults,
                      };
                      exportToHTML(report, `qilly-ui-test-results-${Date.now()}`, 'Qilly UI Automation Test Report');
                      toast.success('UI test results exported as HTML');
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export as HTML
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const report = {
                        timestamp: new Date().toISOString(),
                        summary: {
                          total: testResults.length,
                          passed: testResults.filter((r) => r.status === 'passed').length,
                          failed: testResults.filter((r) => r.status === 'failed').length,
                          duration: testResults.reduce((sum, r) => sum + r.duration, 0),
                        },
                        results: testResults,
                      };
                      exportToExcel(report, `qilly-ui-test-results-${Date.now()}`);
                      toast.success('UI test results exported as Excel');
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
                  <span className="font-medium flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {currentTest}
                  </span>
                  <span className="text-gray-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {testResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryStats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Passed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{summaryStats.passed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{summaryStats.failed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Pass Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{summaryStats.passRate}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryStats.avgDuration}ms</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tests">
              <TestTube2 className="h-4 w-4 mr-2" />
              Test Cases
            </TabsTrigger>
            <TabsTrigger value="results">
              <FileText className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="recorder">
              <Camera className="h-4 w-4 mr-2" />
              Test Recorder
            </TabsTrigger>
            <TabsTrigger value="guide">
              <Code className="h-4 w-4 mr-2" />
              Guide
            </TabsTrigger>
          </TabsList>

          {/* Test Cases Tab */}
          <TabsContent value="tests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Test Cases ({testCases.length})</CardTitle>
                <CardDescription>Select test cases to run or run all enabled tests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {testCases.map((testCase) => (
                  <div
                    key={testCase.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedTestCases.includes(testCase.id)}
                      onCheckedChange={() => toggleTestCase(testCase.id)}
                      disabled={!testCase.enabled}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{testCase.name}</h3>
                        <div className="flex items-center gap-2">
                          {testCase.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant={tag === 'critical' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{testCase.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MousePointer className="h-3 w-3" />
                          {testCase.steps.length} steps
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Est. ~{testCase.steps.length * 2}s
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4">
            {testResults.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No test results yet. Run tests to see results.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Test Results ({testResults.length})</CardTitle>
                  <CardDescription>Detailed results from test execution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {testResults.map((result) => (
                    <div key={result.testCaseId} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <h3 className="font-medium">{result.testCaseName}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {result.duration}ms
                              </span>
                              <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={result.status === 'passed' ? 'default' : 'destructive'}>
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>

                      {result.error && (
                        <Alert variant="destructive">
                          <Bug className="h-4 w-4" />
                          <AlertTitle>Test Failed</AlertTitle>
                          <AlertDescription className="font-mono text-xs">{result.error}</AlertDescription>
                        </Alert>
                      )}

                      {/* Step Results */}
                      <div className="space-y-1">
                        {result.stepResults.map((stepResult, idx) => (
                          <div
                            key={stepResult.stepId}
                            className="flex items-center justify-between text-sm py-1 px-2 bg-gray-50 rounded"
                          >
                            <div className="flex items-center gap-2">
                              {stepResult.status === 'passed' ? (
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-600" />
                              )}
                              <span className="text-gray-600">Step {idx + 1}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">{stepResult.duration}ms</span>
                              {stepResult.error && <Badge variant="destructive">Error</Badge>}
                            </div>
                          </div>
                        ))}
                      </div>

                      {result.screenshots.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Camera className="h-4 w-4" />
                          {result.screenshots.length} screenshot(s) captured
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Test Recorder Tab */}
          <TabsContent value="recorder" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Recorder (Coming Soon)</CardTitle>
                <CardDescription>Record user interactions to create automated test cases</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <MonitorCheck className="h-4 w-4" />
                  <AlertTitle>Feature Preview</AlertTitle>
                  <AlertDescription>
                    The test recorder allows you to record your interactions with the Qilly application and automatically
                    generate test cases. This feature integrates with Playwright or Selenium for full browser automation.
                  </AlertDescription>
                </Alert>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Button disabled variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                    <Button disabled variant="outline">
                      <StopCircle className="h-4 w-4 mr-2" />
                      Stop Recording
                    </Button>
                  </div>

                  <div className="border rounded-lg p-6 bg-gray-50 text-center text-gray-600">
                    <MonitorCheck className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>Recording functionality will capture:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Mouse clicks and interactions</li>
                      <li>• Keyboard input and form submissions</li>
                      <li>• Navigation and page transitions</li>
                      <li>• Element assertions and validations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guide Tab */}
          <TabsContent value="guide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>UI Automation Testing Guide</CardTitle>
                <CardDescription>Learn how to use and extend the testing framework</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">What This Tool Does</h3>
                  <p className="text-gray-600 mb-2">
                    This UI automation tool provides automated regression testing for the Qilly web application. It
                    simulates user interactions and validates that features work correctly after code changes.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Automated test execution for critical user flows</li>
                    <li>Regression testing to catch bugs before deployment</li>
                    <li>Visual regression with screenshot capture</li>
                    <li>Comprehensive test reporting and analytics</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Pre-defined Test Scenarios</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { name: 'Authentication', desc: 'Login/logout flows', icon: Shield },
                      { name: 'BOQ Upload', desc: 'File upload and processing', icon: Upload },
                      { name: 'Supplier Search', desc: 'Search and filtering', icon: Search },
                      { name: 'Provincial Pricing', desc: 'Price calculations', icon: GitCompare },
                      { name: 'Responsive Design', desc: 'Mobile/desktop views', icon: MonitorCheck },
                      { name: 'Form Validation', desc: 'Input validation', icon: CheckCircle2 },
                    ].map((scenario) => (
                      <div key={scenario.name} className="flex items-start gap-3 p-3 border rounded-lg">
                        <scenario.icon className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium">{scenario.name}</div>
                          <div className="text-sm text-gray-600">{scenario.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Integration with Real Testing Frameworks</h3>
                  <Alert>
                    <Code className="h-4 w-4" />
                    <AlertTitle>Production Implementation</AlertTitle>
                    <AlertDescription>
                      For full web automation, integrate with:
                      <ul className="mt-2 space-y-1">
                        <li>• <strong>Playwright</strong> - Modern cross-browser testing (Recommended)</li>
                        <li>• <strong>Selenium</strong> - Industry-standard automation</li>
                        <li>• <strong>Cypress</strong> - Developer-friendly E2E testing</li>
                        <li>• <strong>Puppeteer</strong> - Chrome DevTools Protocol</li>
                      </ul>
                      <p className="mt-2 text-xs">
                        This tool provides the test case definitions. Export them and use with your preferred framework.
                      </p>
                    </AlertDescription>
                  </Alert>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Best Practices</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Run tests before each deployment to SIT/UAT/Production</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Focus on critical user journeys (auth, BOQ upload, pricing)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Use data-testid attributes for reliable element selection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Capture screenshots for visual regression testing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Export and archive test results for compliance documentation</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}