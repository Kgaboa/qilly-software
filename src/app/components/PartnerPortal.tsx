import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  Building2,
  Handshake,
  Code,
  Palette,
  Globe,
  BarChart3,
  DollarSign,
  Users,
  Settings,
  Key,
  Shield,
  FileCode,
  Link,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Package,
  Rocket,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

interface PartnerPortalProps {
  onBack?: () => void;
}

export function PartnerPortal({ onBack }: PartnerPortalProps) {
  const [activeTab, setActiveTab] = useState('api');
  const [partnerType, setPartnerType] = useState<'construction' | 'software' | null>(null);
  const [whiteLabelConfig, setWhiteLabelConfig] = useState({
    companyName: '',
    domain: '',
    primaryColor: '#00b4d8',
    logoUrl: '',
    supportEmail: '',
    revenueShare: 30,
  });

  const handlePartnerApplication = (type: 'construction' | 'software') => {
    setPartnerType(type);
    setActiveTab('onboarding');
    toast.success(`Partner application started for ${type === 'construction' ? 'Construction Firm' : 'Software Company'}`);
  };

  const downloadAPIDocumentation = async () => {
    try {
      toast.info('Generating API Documentation...');

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Title Page
            new Paragraph({
              text: 'Qilly API Documentation',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: 'Partner Integration Guide',
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: 'Version 1.0 | March 2026',
              alignment: AlignmentType.CENTER,
              spacing: { after: 800 },
            }),

            // Introduction
            new Paragraph({
              text: 'Introduction',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: 'Welcome to Qilly\'s API documentation. This guide provides comprehensive information for integrating Qilly\'s BOQ pricing engine into your construction management platform or ERP system.',
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: 'API Base URL: https://api.qilly.co.za/v1',
              spacing: { after: 400 },
            }),

            // Authentication
            new Paragraph({
              text: 'Authentication',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: 'All API requests require authentication using an API key. Include your key in the Authorization header:',
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: 'Authorization: Bearer YOUR_API_KEY',
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: 'API keys can be generated from the Partner Portal dashboard. We provide both Production and Sandbox keys for testing.',
              spacing: { after: 400 },
            }),

            // API Endpoints Section
            new Paragraph({
              text: 'API Endpoints',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),

            // 1. Upload BOQ
            new Paragraph({
              text: '1. Upload BOQ Document',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              text: 'POST /api/v1/boq/upload',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Uploads and processes a BOQ document. Supports PDF, Excel, and CSV formats.',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Request (multipart/form-data):',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '{\n  "file": <binary>,\n  "project_name": "N1 Highway Extension",\n  "project_type": "road_construction"\n}',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Response:',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '{\n  "boq_id": "boq_abc123",\n  "status": "processing",\n  "project_name": "N1 Highway Extension",\n  "items_count": 245\n}',
              spacing: { after: 300 },
            }),

            // 2. Get BOQ Details
            new Paragraph({
              text: '2. Retrieve BOQ Details',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              text: 'GET /api/v1/boq/:id',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Retrieves detailed information about a specific BOQ, including all line items and current pricing status.',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Response:',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '{\n  "boq_id": "boq_abc123",\n  "project_name": "N1 Highway Extension",\n  "status": "completed",\n  "items": [\n    {\n      "item_id": "001",\n      "description": "Concrete Grade 25/19",\n      "quantity": 150,\n      "unit": "m3",\n      "unit_price": 1250.00,\n      "total": 187500.00\n    }\n  ],\n  "total_amount": 4567890.50\n}',
              spacing: { after: 300 },
            }),

            // 3. Price BOQ
            new Paragraph({
              text: '3. Auto-Price BOQ',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              text: 'POST /api/v1/boq/:id/price',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Automatically prices a BOQ using live South African supplier data. This is Qilly\'s core feature.',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Request:',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '{\n  "pricing_strategy": "competitive",\n  "location": "Gauteng",\n  "include_carbon_tracking": true\n}',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Response:',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '{\n  "boq_id": "boq_abc123",\n  "status": "priced",\n  "total_amount": 4567890.50,\n  "supplier_count": 12,\n  "carbon_footprint": 245.6,\n  "processing_time": "3.2s"\n}',
              spacing: { after: 300 },
            }),

            // 4. Get Suppliers
            new Paragraph({
              text: '4. List Suppliers',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              text: 'GET /api/v1/suppliers',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Retrieves list of available suppliers and their current rates.',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Query Parameters: ?material_type=concrete&location=gauteng',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Response:',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '{\n  "suppliers": [\n    {\n      "supplier_id": "sup_123",\n      "name": "Lafarge Cement",\n      "materials": ["concrete", "cement"],\n      "locations": ["gauteng", "western_cape"],\n      "rating": 4.8\n    }\n  ]\n}',
              spacing: { after: 300 },
            }),

            // 5. Export BOQ
            new Paragraph({
              text: '5. Export BOQ',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              text: 'POST /api/v1/export/:format',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Exports a priced BOQ in PDF, Excel, or CSV format.',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Supported formats: pdf, excel, csv',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Request:',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '{\n  "boq_id": "boq_abc123",\n  "include_carbon_report": true,\n  "company_branding": true\n}',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Response: Binary file download',
              spacing: { after: 400 },
            }),

            // Webhooks
            new Paragraph({
              text: 'Webhooks',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: 'Qilly supports real-time webhooks for key events. Configure your webhook URL in the Partner Portal.',
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: 'Supported Events:',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '• boq.uploaded - BOQ document successfully uploaded\n• boq.priced - BOQ pricing completed\n• boq.exported - BOQ export generated\n• payment.completed - Subscription payment processed',
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: 'Webhook Payload Example:',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '{\n  "event": "boq.priced",\n  "boq_id": "boq_abc123",\n  "timestamp": "2026-03-15T10:30:00Z",\n  "data": {\n    "total_amount": 4567890.50,\n    "status": "completed"\n  }\n}',
              spacing: { after: 400 },
            }),

            // SDKs
            new Paragraph({
              text: 'SDK Libraries',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: 'Node.js / JavaScript SDK',
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'npm install @qilly/sdk',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'import Qilly from \'@qilly/sdk\';\n\nconst qilly = new Qilly({\n  apiKey: \'YOUR_API_KEY\'\n});\n\n// Upload BOQ\nconst boq = await qilly.boq.upload({\n  file: fileBuffer,\n  project_name: \'My Project\'\n});\n\n// Price BOQ\nconst priced = await qilly.boq.price(boq.boq_id, {\n  pricing_strategy: \'competitive\'\n});',
              spacing: { after: 300 },
            }),

            // Rate Limits
            new Paragraph({
              text: 'Rate Limits',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: 'API rate limits vary by subscription tier:',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '• Professional: 100 requests/minute\n• Enterprise: 500 requests/minute\n• Custom/White-Label: Unlimited',
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: 'Rate limit headers are included in all responses:\nX-RateLimit-Limit: 500\nX-RateLimit-Remaining: 487\nX-RateLimit-Reset: 1647345600',
              spacing: { after: 400 },
            }),

            // Support
            new Paragraph({
              text: 'Support & Resources',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: 'Partner Portal: https://qilly.co.za/partners',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'API Status: https://status.qilly.co.za',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Partner Support: partners@qilly.co.za',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Technical Support: api@qilly.co.za',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'Phone: +27 11 123 4567 (Mon-Fri 8AM-6PM SAST)',
              spacing: { after: 400 },
            }),

            // Footer
            new Paragraph({
              text: '© 2026 Qilly - Construction Billing System',
              alignment: AlignmentType.CENTER,
              spacing: { before: 800 },
            }),
            new Paragraph({
              text: 'All rights reserved. Confidential and proprietary.',
              alignment: AlignmentType.CENTER,
            }),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'Qilly_API_Documentation_v1.0.docx');
      toast.success('API Documentation downloaded successfully!');
    } catch (error) {
      console.error('Error generating documentation:', error);
      toast.error('Failed to generate documentation. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Handshake className="h-10 w-10 text-blue-600" />
              Partner Portal & White-Label SaaS
            </h1>
            <p className="text-gray-600 mt-2">
              Join Qilly's partner ecosystem - Construction firms & Software platforms
            </p>
          </div>
          {onBack && (
            <Button onClick={onBack} variant="outline">
              Back to Dashboard
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="white-label">
              <Palette className="h-4 w-4 mr-2" />
              White-Label Config
            </TabsTrigger>
            <TabsTrigger value="api">
              <Code className="h-4 w-4 mr-2" />
              API & Integration
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics & Revenue
            </TabsTrigger>
          </TabsList>

          {/* White-Label Config Tab */}
          <TabsContent value="white-label" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">White-Label Configuration</CardTitle>
                <CardDescription>Customize Qilly to match your brand identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="wl-company">Your Company Name</Label>
                      <Input 
                        id="wl-company" 
                        value={whiteLabelConfig.companyName}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, companyName: e.target.value})}
                        placeholder="e.g., Procore BOQ Pricing" 
                      />
                    </div>

                    <div>
                      <Label htmlFor="wl-domain">Custom Domain</Label>
                      <Input 
                        id="wl-domain" 
                        value={whiteLabelConfig.domain}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, domain: e.target.value})}
                        placeholder="e.g., boq.procore.com" 
                      />
                      <p className="text-xs text-gray-500 mt-1">We'll provide DNS configuration instructions</p>
                    </div>

                    <div>
                      <Label htmlFor="wl-color">Primary Brand Color</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="wl-color" 
                          type="color"
                          value={whiteLabelConfig.primaryColor}
                          onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, primaryColor: e.target.value})}
                          className="w-20 h-10"
                        />
                        <Input 
                          value={whiteLabelConfig.primaryColor}
                          onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, primaryColor: e.target.value})}
                          placeholder="#00b4d8"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="wl-logo">Logo URL</Label>
                      <Input 
                        id="wl-logo" 
                        value={whiteLabelConfig.logoUrl}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, logoUrl: e.target.value})}
                        placeholder="https://yoursite.com/logo.png" 
                      />
                    </div>

                    <div>
                      <Label htmlFor="wl-email">Support Email</Label>
                      <Input 
                        id="wl-email" 
                        type="email"
                        value={whiteLabelConfig.supportEmail}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, supportEmail: e.target.value})}
                        placeholder="support@yourcompany.com" 
                      />
                    </div>

                    <div>
                      <Label htmlFor="wl-revenue">Revenue Share (%)</Label>
                      <Input 
                        id="wl-revenue" 
                        type="number"
                        value={whiteLabelConfig.revenueShare}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, revenueShare: parseInt(e.target.value)})}
                        min="20"
                        max="40"
                      />
                      <p className="text-xs text-gray-500 mt-1">Typically 30% for standard partners, 40% for high-volume partners</p>
                    </div>
                  </div>

                  {/* Preview Panel */}
                  <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                    <h3 className="font-semibold text-lg mb-4">Live Preview</h3>
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      {/* Header Preview */}
                      <div 
                        className="p-4 text-white flex items-center justify-between"
                        style={{ backgroundColor: whiteLabelConfig.primaryColor }}
                      >
                        <div className="flex items-center gap-2">
                          {whiteLabelConfig.logoUrl ? (
                            <img src={whiteLabelConfig.logoUrl} alt="Logo" className="h-8" />
                          ) : (
                            <div className="bg-white/20 px-3 py-1 rounded">
                              <span className="font-bold">{whiteLabelConfig.companyName || 'Your Brand'}</span>
                            </div>
                          )}
                        </div>
                        <Badge className="bg-white/20">Enterprise</Badge>
                      </div>

                      {/* Content Preview */}
                      <div className="p-4 space-y-3">
                        <h4 className="font-semibold">BOQ Pricing Engine</h4>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <Button 
                          className="w-full mt-4"
                          style={{ backgroundColor: whiteLabelConfig.primaryColor }}
                        >
                          Upload BOQ
                        </Button>
                      </div>

                      {/* Footer Preview */}
                      <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-600 text-center">
                        Support: {whiteLabelConfig.supportEmail || 'support@yourcompany.com'}
                      </div>
                    </div>

                    <Alert className="mt-4">
                      <Palette className="h-4 w-4" />
                      <AlertTitle>Customization Options</AlertTitle>
                      <AlertDescription className="text-xs">
                        • Custom domain with SSL<br />
                        • Full brand color customization<br />
                        • Logo integration<br />
                        • Custom support email<br />
                        • White-labeled emails & invoices
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Save as Draft</Button>
                  <Button onClick={() => toast.success('White-label configuration saved! Our team will review and activate within 48 hours.')}>
                    Submit Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API & Integration Tab */}
          <TabsContent value="api" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Credentials
                  </CardTitle>
                  <CardDescription>Generate and manage your API keys</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Production API Key</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value="qilly_prod_xxxxxxxxxxxxxxxxxxxxx" readOnly className="font-mono text-sm" />
                      <Button variant="outline" size="sm">Copy</Button>
                    </div>
                  </div>
                  <div>
                    <Label>Sandbox API Key</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value="qilly_test_xxxxxxxxxxxxxxxxxxxxx" readOnly className="font-mono text-sm" />
                      <Button variant="outline" size="sm">Copy</Button>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">Generate New API Key</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="h-5 w-5" />
                    Quick Start
                  </CardTitle>
                  <CardDescription>Get started in minutes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded border font-mono text-xs">
                    <div className="text-gray-600"># Install Qilly SDK</div>
                    <div>npm install @qilly/sdk</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border font-mono text-xs">
                    <div className="text-gray-600">// Initialize</div>
                    <div>import Qilly from '@qilly/sdk';</div>
                    <div>const qilly = new Qilly(&#123;</div>
                    <div className="pl-4">apiKey: 'YOUR_API_KEY'</div>
                    <div>&#125;);</div>
                  </div>
                  <Button className="w-full" variant="outline" onClick={downloadAPIDocumentation}>
                    <Link className="h-4 w-4 mr-2" />
                    View Full Documentation
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>RESTful API for BOQ pricing and management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { method: 'POST', endpoint: '/api/v1/boq/upload', desc: 'Upload and process BOQ document' },
                    { method: 'GET', endpoint: '/api/v1/boq/:id', desc: 'Retrieve BOQ details and pricing' },
                    { method: 'POST', endpoint: '/api/v1/boq/:id/price', desc: 'Auto-price BOQ using live supplier data' },
                    { method: 'GET', endpoint: '/api/v1/suppliers', desc: 'List available suppliers and rates' },
                    { method: 'POST', endpoint: '/api/v1/export/:format', desc: 'Export BOQ (PDF, Excel, CSV)' },
                  ].map((api) => (
                    <div key={api.endpoint} className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
                      <Badge variant={api.method === 'POST' ? 'default' : 'secondary'} className="font-mono text-xs">
                        {api.method}
                      </Badge>
                      <code className="flex-1 text-sm">{api.endpoint}</code>
                      <span className="text-xs text-gray-600">{api.desc}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" size="lg" onClick={downloadAPIDocumentation}>
                    <Download className="h-5 w-5 mr-2" />
                    Download Complete API Documentation (Word)
                  </Button>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Comprehensive 10-page Word document with all endpoints, authentication, webhooks, SDKs, and examples
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Webhooks
                </CardTitle>
                <CardDescription>Real-time event notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="webhook-url">Webhook Endpoint URL</Label>
                  <Input id="webhook-url" placeholder="https://yourapp.com/webhooks/qilly" className="mt-1" />
                </div>
                <div className="space-y-2">
                  <Label>Subscribe to Events:</Label>
                  <div className="space-y-2">
                    {['boq.uploaded', 'boq.priced', 'boq.exported', 'payment.completed'].map((event) => (
                      <label key={event} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <code className="text-sm">{event}</code>
                      </label>
                    ))}
                  </div>
                </div>
                <Button>Save Webhook Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics & Revenue Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Total Revenue (MTD)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">R 125,480</div>
                  <p className="text-xs text-gray-500 mt-1">+23% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">847</div>
                  <p className="text-xs text-gray-500 mt-1">342 new this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">BOQs Processed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">1,234</div>
                  <p className="text-xs text-gray-500 mt-1">156 in last 7 days</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Your earnings by subscription tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { tier: 'Enterprise (R8,999)', count: 28, revenue: 'R 75,600', share: '60%' },
                    { tier: 'Professional (R2,999)', count: 89, revenue: 'R 39,990', share: '32%' },
                    { tier: 'Custom/White-Label', count: 3, revenue: 'R 9,890', share: '8%' },
                  ].map((item) => (
                    <div key={item.tier} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-semibold">{item.tier}</p>
                        <p className="text-sm text-gray-600">{item.count} active subscriptions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{item.revenue}</p>
                        <p className="text-xs text-gray-500">{item.share} of total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Customers</CardTitle>
                <CardDescription>Highest value accounts using your integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'ABC Construction Ltd', plan: 'Enterprise', boqs: 45, value: 'R 8,999' },
                    { name: 'BuildCo SA', plan: 'Professional', boqs: 23, value: 'R 2,999' },
                    { name: 'Metro Contractors', plan: 'Enterprise', boqs: 38, value: 'R 8,999' },
                  ].map((customer, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.boqs} BOQs this month</p>
                      </div>
                      <div className="text-right">
                        <Badge>{customer.plan}</Badge>
                        <p className="text-sm font-semibold mt-1">{customer.value}/mo</p>
                      </div>
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