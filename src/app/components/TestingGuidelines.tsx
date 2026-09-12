import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { 
  FileText, 
  Download, 
  BookOpen, 
  CheckCircle, 
  AlertCircle,
  FileCheck,
  ClipboardList,
  Shield,
  Zap,
  Database,
  Users,
  TrendingUp,
  Presentation
} from 'lucide-react';
import { 
  exportTestingGuideToPPT, 
  exportTestingGuideToWord,
  loadMarkdownFile 
} from '@/utils/exportTestingDocuments';
import { toast } from 'sonner';

export function TestingGuidelines() {
  const [activeGuide, setActiveGuide] = useState<'overview' | 'compliance' | 'complete'>('overview');
  const [complianceGuideContent, setComplianceGuideContent] = useState<string>('');
  const [systemGuideContent, setSystemGuideContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    setIsLoading(true);
    try {
      console.log('📚 Loading testing guides...');
      const compliance = await loadMarkdownFile('COMPLIANCE_CALCULATOR_TESTING_GUIDE.md');
      const system = await loadMarkdownFile('QILLY_COMPLETE_SYSTEM_TEST_GUIDE.md');
      
      console.log('✅ Compliance guide loaded:', compliance.length, 'characters');
      console.log('✅ System guide loaded:', system.length, 'characters');
      
      setComplianceGuideContent(compliance);
      setSystemGuideContent(system);
    } catch (error) {
      console.error('❌ Error loading guides:', error);
      setComplianceGuideContent('# Error Loading Guide\n\nFailed to load the testing guide. Please ensure the markdown files exist in the /public folder.');
      setSystemGuideContent('# Error Loading Guide\n\nFailed to load the testing guide. Please ensure the markdown files exist in the /public folder.');
      toast.error('Failed to load testing guides');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadComplianceGuide = async () => {
    try {
      console.log('📥 Starting Compliance Guide Word download...');
      console.log('📝 Content length:', complianceGuideContent.length);
      console.log('📝 Content preview:', complianceGuideContent.substring(0, 200));
      
      if (!complianceGuideContent || complianceGuideContent.length === 0) {
        toast.error('No content available. Please wait for the guide to load.');
        return;
      }
      
      toast.loading('Generating Word document...');
      await exportTestingGuideToWord(
        complianceGuideContent,
        'Qilly_Compliance_Calculator_Testing_Guide.docx',
        'Compliance Calculator Testing Guide'
      );
      toast.dismiss();
      toast.success('Compliance Testing Guide downloaded!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to download guide');
      console.error('Download error:', error);
    }
  };

  const handleDownloadSystemGuide = async () => {
    try {
      console.log('📥 Starting System Guide Word download...');
      console.log('📝 Content length:', systemGuideContent.length);
      console.log('📝 Content preview:', systemGuideContent.substring(0, 200));
      
      if (!systemGuideContent || systemGuideContent.length === 0) {
        toast.error('No content available. Please wait for the guide to load.');
        return;
      }
      
      toast.loading('Generating Word document...');
      await exportTestingGuideToWord(
        systemGuideContent,
        'Qilly_Complete_System_Test_Guide.docx',
        'Complete System Test Guide'
      );
      toast.dismiss();
      toast.success('Complete System Test Guide downloaded!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to download guide');
      console.error('Download error:', error);
    }
  };

  const handleDownloadComplianceGuidePPT = async () => {
    try {
      console.log('📥 Starting Compliance Guide PPT download...');
      console.log('📝 Content length:', complianceGuideContent.length);
      console.log('📝 Content preview:', complianceGuideContent.substring(0, 200));
      
      if (!complianceGuideContent || complianceGuideContent.length === 0) {
        toast.error('No content available. Please wait for the guide to load.');
        return;
      }
      
      toast.loading('Generating PowerPoint presentation...');
      await exportTestingGuideToPPT(
        complianceGuideContent,
        'Qilly_Compliance_Calculator_Testing_Guide.pptx',
        'Compliance Calculator Testing Guide'
      );
      toast.dismiss();
      toast.success('Compliance Testing Guide presentation downloaded!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to download presentation');
      console.error('Download error:', error);
    }
  };

  const handleDownloadSystemGuidePPT = async () => {
    try {
      console.log('📥 Starting System Guide PPT download...');
      console.log('📝 Content length:', systemGuideContent.length);
      console.log('📝 Content preview:', systemGuideContent.substring(0, 200));
      
      if (!systemGuideContent || systemGuideContent.length === 0) {
        toast.error('No content available. Please wait for the guide to load.');
        return;
      }
      
      toast.loading('Generating PowerPoint presentation...');
      await exportTestingGuideToPPT(
        systemGuideContent,
        'Qilly_Complete_System_Test_Guide.pptx',
        'Complete System Test Guide'
      );
      toast.dismiss();
      toast.success('Complete System Test Guide presentation downloaded!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to download presentation');
      console.error('Download error:', error);
    }
  };

  const testingCategories = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Compliance Calculator',
      description: 'NHBRC, CIDB, Statutory, Testing, BBBEE, Preliminaries',
      tests: 25,
      color: 'text-[#00b4d8]',
      bgColor: 'bg-[#00b4d8]/10'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Regional Pricing',
      description: 'Provincial multipliers, supplier selection, transport costs',
      tests: 18,
      color: 'text-[#0077b6]',
      bgColor: 'bg-[#0077b6]/10'
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: 'BOQ Processing',
      description: 'Upload, parsing, validation, accuracy',
      tests: 12,
      color: 'text-[#023e8a]',
      bgColor: 'bg-[#023e8a]/10'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Supplier Management',
      description: 'Registration, product catalog, tier features',
      tests: 15,
      color: 'text-[#03045e]',
      bgColor: 'bg-[#03045e]/10'
    },
    {
      icon: <FileCheck className="w-5 h-5" />,
      title: 'Export Functions',
      description: 'Excel, PDF exports',
      tests: 8,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Performance & Security',
      description: 'Load testing, POPIA compliance, authentication',
      tests: 10,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const quickLinks = [
    { name: 'Pre-Testing Setup', section: '2' },
    { name: 'Core Features Testing', section: '3' },
    { name: 'Compliance Calculator', section: '4' },
    { name: 'Regional Pricing', section: '5' },
    { name: 'Supplier Management', section: '6' },
    { name: 'Admin Dashboard', section: '7' },
    { name: 'Export Functions', section: '8' },
    { name: 'Performance Testing', section: '9' },
    { name: 'Security & Compliance', section: '10' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-[#00b4d8] border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-[#00b4d8]" />
                Testing Guidelines & Documentation
              </CardTitle>
              <CardDescription className="mt-2">
                Comprehensive testing guides for all Qilly features - Production-ready for DHS deployment
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              <CheckCircle className="w-3 h-3 mr-1" />
              Production Ready
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Test Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#00b4d8]">88</p>
            <p className="text-xs text-gray-500 mt-1">Across all modules</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Test Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#0077b6]">6</p>
            <p className="text-xs text-gray-500 mt-1">Major feature areas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Documentation Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#023e8a]">45+</p>
            <p className="text-xs text-gray-500 mt-1">Detailed instructions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Expected Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">95%+</p>
            <p className="text-xs text-gray-500 mt-1">Production quality</p>
          </CardContent>
        </Card>
      </div>

      {/* Testing Categories Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#00b4d8]" />
          Testing Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testingCategories.map((category, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${category.bgColor}`}>
                    <div className={category.color}>
                      {category.icon}
                    </div>
                  </div>
                  <Badge variant="outline">{category.tests} tests</Badge>
                </div>
                <CardTitle className="text-sm font-semibold mt-3">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeGuide} onValueChange={(value) => setActiveGuide(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <FileText className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <Shield className="w-4 h-4 mr-2" />
            Compliance Calculator
          </TabsTrigger>
          <TabsTrigger value="complete">
            <BookOpen className="w-4 h-4 mr-2" />
            Complete System
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Testing Documentation Overview
              </CardTitle>
              <CardDescription>
                Qilly provides comprehensive testing documentation to ensure production readiness
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 text-[#00b4d8]">Available Testing Guides</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-[#00b4d8]/5 rounded-lg border border-[#00b4d8]/20">
                    <Shield className="w-5 h-5 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm">Compliance Calculator Testing Guide</h5>
                      <p className="text-xs text-gray-600 mt-1">
                        Focused guide for testing the Compliance Cost Calculator module - NHBRC, CIDB, 
                        Statutory Labour, Quality Testing, BBBEE, and Preliminaries calculations.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">25 Test Cases</Badge>
                        <Badge variant="outline" className="text-xs">12 Pages</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[#0077b6]/5 rounded-lg border border-[#0077b6]/20">
                    <BookOpen className="w-5 h-5 text-[#0077b6] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm">Complete System Test Guide</h5>
                      <p className="text-xs text-gray-600 mt-1">
                        Comprehensive guide covering ALL Qilly features - BOQ processing, regional pricing, 
                        supplier management, admin dashboard, exports, performance, and security testing.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">88 Test Cases</Badge>
                        <Badge variant="outline" className="text-xs">45+ Pages</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-[#00b4d8]">Quick Navigation</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {quickLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded border">
                      <span className="font-mono text-[#00b4d8] font-semibold">{link.section}</span>
                      <span className="text-gray-700">{link.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-sm text-amber-900">Before You Begin Testing</h5>
                    <ul className="text-xs text-amber-800 mt-2 space-y-1 list-disc list-inside">
                      <li>Ensure demo mode is working (check localStorage for test data)</li>
                      <li>Download both testing guides for offline reference</li>
                      <li>Prepare sample BOQ data (20, 100, 500 unit projects)</li>
                      <li>Verify browser console shows no errors on page load</li>
                      <li>Have a spreadsheet ready to record test results</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Calculator Tab */}
        <TabsContent value="compliance" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#00b4d8]" />
                    Compliance Calculator Testing Guide
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Specialized guide for testing South African construction compliance cost calculations
                  </CardDescription>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleDownloadComplianceGuide} className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Word Doc
                  </Button>
                  <Button onClick={handleDownloadComplianceGuidePPT} className="gap-2">
                    <Presentation className="w-4 h-4" />
                    Download PPT
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700 font-semibold">NHBRC Testing</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">6</p>
                    <p className="text-xs text-green-600">Test cases</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 font-semibold">CIDB Validation</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">8</p>
                    <p className="text-xs text-blue-600">Test cases</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-700 font-semibold">Statutory Labour</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">4</p>
                    <p className="text-xs text-purple-600">Test cases</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-xs text-orange-700 font-semibold">Quality Testing</p>
                    <p className="text-2xl font-bold text-orange-600 mt-1">5</p>
                    <p className="text-xs text-orange-600">Test cases</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-xs text-indigo-700 font-semibold">BBBEE Verification</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">3</p>
                    <p className="text-xs text-indigo-600">Test cases</p>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <p className="text-xs text-teal-700 font-semibold">Preliminaries</p>
                    <p className="text-2xl font-bold text-teal-600 mt-1">4</p>
                    <p className="text-xs text-teal-600">Test cases</p>
                  </div>
                </div>

                <div className="bg-[#00b4d8]/5 border border-[#00b4d8]/20 rounded-lg p-4">
                  <h5 className="font-semibold text-sm mb-3">What's Included in This Guide</h5>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                      <span>Quick 5-minute test for basic validation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                      <span>Realistic 100-unit RDP housing project test</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                      <span>Provincial variation testing (all 9 provinces)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                      <span>CIDB non-compliance detection (red warnings)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                      <span>Validation against manual QS estimates (85-95% accuracy target)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                      <span>Troubleshooting guide for common issues</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-sm mb-2">Document Preview</h5>
                  <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b4d8] mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600">Loading guide...</p>
                        </div>
                      </div>
                    ) : complianceGuideContent.length > 0 ? (
                      <pre className="text-xs whitespace-pre-wrap font-mono">
                        {complianceGuideContent.substring(0, 2000)}...
                        {'\n\n'}
                        <span className="text-[#00b4d8] font-semibold">
                          [ Download full document to read complete guide ]
                        </span>
                      </pre>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No content available</p>
                        <p className="text-xs text-gray-500 mt-1">Check console for errors</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Complete System Tab */}
        <TabsContent value="complete" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#0077b6]" />
                    Complete System Test Guide
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Comprehensive testing documentation for all Qilly features and modules
                  </CardDescription>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleDownloadSystemGuide} className="gap-2" variant="default">
                    <Download className="w-4 h-4" />
                    Download Word Doc
                  </Button>
                  <Button onClick={handleDownloadSystemGuidePPT} className="gap-2" variant="default">
                    <Presentation className="w-4 h-4" />
                    Download PPT
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {testingCategories.map((category, idx) => (
                    <div key={idx} className={`p-4 ${category.bgColor} rounded-lg border border-gray-200`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={category.color}>{category.icon}</div>
                        <p className="text-xs font-semibold">{category.title}</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{category.tests}</p>
                      <p className="text-xs text-gray-600">Test cases</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#0077b6]/5 border border-[#0077b6]/20 rounded-lg p-4">
                  <h5 className="font-semibold text-sm mb-3">Complete Guide Contents (12 Sections)</h5>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-[#0077b6] font-semibold">1.</span>
                        <span>Introduction & Testing Standards</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-[#0077b6] font-semibold">2.</span>
                        <span>Pre-Testing Setup (Demo & Production)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-[#0077b6] font-semibold">3.</span>
                        <span>Core Features Testing (BOQ Upload, Processing)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-[#0077b6] font-semibold">4.</span>
                        <span>Compliance Calculator Testing (25 Test Cases)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-[#0077b6] font-semibold">5.</span>
                        <span>Regional Pricing Testing (9 Provinces)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-[#0077b6] font-semibold">6.</span>
                        <span>Supplier Management Testing</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-[#0077b6] font-semibold">7.</span>
                        <span>Admin Dashboard Testing</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-[#0077b6] font-semibold">8.</span>
                        <span>Export Functions (Excel, PDF)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-[#0077b6] font-semibold">9.</span>
                        <span>Performance Testing (Load, Stress)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-[#0077b6] font-semibold">10.</span>
                        <span>Security & POPIA Compliance</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-[#0077b6] font-semibold">11.</span>
                        <span>Test Results Documentation Templates</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-[#0077b6] font-semibold">12.</span>
                        <span>Appendices (Test Data, References)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-sm text-green-900">Production-Ready Testing</h5>
                      <p className="text-xs text-green-800 mt-1">
                        This comprehensive guide includes everything needed for DHS deployment validation:
                        accuracy validation matrices, performance benchmarks, security checklists, 
                        test result templates, and defect reporting procedures.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-sm mb-2">Document Preview</h5>
                  <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b4d8] mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600">Loading guide...</p>
                        </div>
                      </div>
                    ) : systemGuideContent.length > 0 ? (
                      <pre className="text-xs whitespace-pre-wrap font-mono">
                        {systemGuideContent.substring(0, 3000)}...
                        {'\n\n'}
                        <span className="text-[#0077b6] font-semibold">
                          [ Download full document to read complete 45+ page guide ]
                        </span>
                      </pre>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No content available</p>
                        <p className="text-xs text-gray-500 mt-1">Check console for errors</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Download Actions Footer */}
      <Card className="bg-gradient-to-r from-[#00b4d8]/10 to-[#0077b6]/10 border-[#00b4d8]">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-lg">Ready to Test Qilly?</h4>
              <p className="text-sm text-gray-600 mt-1">
                Download both testing guides for comprehensive offline reference during DHS pilot
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleDownloadComplianceGuide} variant="outline" className="gap-2">
                <Shield className="w-4 h-4" />
                Compliance Guide
              </Button>
              <Button onClick={handleDownloadSystemGuide} className="gap-2">
                <BookOpen className="w-4 h-4" />
                Complete System Guide
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}