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
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Package,
  Rocket,
  DollarSign,
  Users,
  BarChart3,
  Globe,
  Shield,
  LogIn,
} from 'lucide-react';
import { toast } from 'sonner';

interface PublicPartnerPortalProps {
  onBack: () => void;
  onPartnerLogin: () => void;
}

export function PublicPartnerPortal({ onBack, onPartnerLogin }: PublicPartnerPortalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [partnerType, setPartnerType] = useState<'construction' | 'software' | null>(null);

  const handlePartnerApplication = (type: 'construction' | 'software') => {
    setPartnerType(type);
    setActiveTab('apply');
    toast.success(`Partner application started for ${type === 'construction' ? 'Construction Firm' : 'Software Company'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Handshake className="h-10 w-10 text-blue-600" />
              Qilly Partner Program
            </h1>
            <p className="text-gray-600 mt-2">
              Join Qilly's partner ecosystem - Construction firms & Software platforms
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={onPartnerLogin} variant="outline" className="gap-2">
              <LogIn className="h-4 w-4" />
              Already a Partner? Login
            </Button>
            <Button onClick={onBack} variant="outline">
              Back to Home
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">
              <Target className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="apply">
              <Rocket className="h-4 w-4 mr-2" />
              Apply Now
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Construction Firm Partnership */}
              <Card className="border-2 border-blue-200 hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Building2 className="h-7 w-7 text-blue-600" />
                    Private Construction Firms
                  </CardTitle>
                  <CardDescription className="text-base">
                    Partner with Qilly to eliminate 85-95% of your QS fees
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Cost Savings</p>
                        <p className="text-sm text-gray-600">Save R500K - R2M annually on QS professional fees</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Faster Bidding</p>
                        <p className="text-sm text-gray-600">Generate accurate BOQs in under 5 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Partner Pricing</p>
                        <p className="text-sm text-gray-600">Exclusive 30% discount on Enterprise tier</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Priority Support</p>
                        <p className="text-sm text-gray-600">Dedicated account manager + 24/7 support</p>
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-900">ROI Example</AlertTitle>
                    <AlertDescription className="text-blue-800">
                      <strong>Murray & Roberts case study:</strong><br />
                      Annual QS fees: R1.8M → Qilly cost: R180K = <strong className="text-blue-900">R1.62M saved/year</strong>
                    </AlertDescription>
                  </Alert>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                    onClick={() => handlePartnerApplication('construction')}
                  >
                    Apply as Construction Partner
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Software Platform Partnership */}
              <Card className="border-2 border-purple-200 hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Code className="h-7 w-7 text-purple-600" />
                    Software Platforms (White-Label)
                  </CardTitle>
                  <CardDescription className="text-base">
                    Integrate Qilly's BOQ engine into your construction software
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">White-Label Solution</p>
                        <p className="text-sm text-gray-600">Full branding customization for your platform</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">RESTful API Access</p>
                        <p className="text-sm text-gray-600">Complete API documentation + SDKs (React, Node.js)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Revenue Sharing</p>
                        <p className="text-sm text-gray-600">Earn 30-40% commission on all transactions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Ideal For</p>
                        <p className="text-sm text-gray-600">Procore, Buildsmart SA, project management platforms</p>
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-purple-50 border-purple-200">
                    <Package className="h-4 w-4 text-purple-600" />
                    <AlertTitle className="text-purple-900">Target Partners</AlertTitle>
                    <AlertDescription className="text-purple-800 text-sm">
                      • <strong>Procore</strong> - Construction management software<br />
                      • <strong>Buildsmart SA</strong> - South African construction platform<br />
                      • <strong>Viewpoint</strong> / <strong>e-Builder</strong> / Custom ERP systems
                    </AlertDescription>
                  </Alert>

                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700" 
                    size="lg"
                    onClick={() => handlePartnerApplication('software')}
                  >
                    Apply as Software Partner
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Partner Program Benefits</CardTitle>
                <CardDescription>What you get as a Qilly partner</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: DollarSign,
                      title: 'Revenue Opportunities',
                      desc: 'Earn through cost savings (construction) or revenue share (software)',
                      color: 'text-green-600',
                      bg: 'bg-green-50',
                    },
                    {
                      icon: Zap,
                      title: 'Fast Integration',
                      desc: 'Go live in 2-4 weeks with comprehensive onboarding support',
                      color: 'text-orange-600',
                      bg: 'bg-orange-50',
                    },
                    {
                      icon: Shield,
                      title: 'Enterprise Security',
                      desc: 'SOC 2 compliant, POPIA-ready, enterprise-grade infrastructure',
                      color: 'text-blue-600',
                      bg: 'bg-blue-50',
                    },
                    {
                      icon: Users,
                      title: 'Dedicated Support',
                      desc: 'Technical account manager, priority support, training resources',
                      color: 'text-purple-600',
                      bg: 'bg-purple-50',
                    },
                    {
                      icon: BarChart3,
                      title: 'Analytics Dashboard',
                      desc: 'Real-time usage analytics, revenue tracking, customer insights',
                      color: 'text-cyan-600',
                      bg: 'bg-cyan-50',
                    },
                    {
                      icon: Globe,
                      title: 'Market Reach',
                      desc: 'Access to South African construction market + co-marketing',
                      color: 'text-pink-600',
                      bg: 'bg-pink-50',
                    },
                  ].map((benefit) => (
                    <div key={benefit.title} className={`p-4 ${benefit.bg} rounded-lg border`}>
                      <benefit.icon className={`h-8 w-8 ${benefit.color} mb-3`} />
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold">Ready to Partner with Qilly?</h2>
                  <p className="text-blue-100 text-lg">
                    Join leading construction firms and software platforms transforming BOQ pricing
                  </p>
                  <div className="flex gap-4 justify-center pt-4">
                    <Button 
                      size="lg" 
                      className="bg-white text-blue-600 hover:bg-gray-100"
                      onClick={() => setActiveTab('apply')}
                    >
                      Apply Now
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white text-white hover:bg-white/10"
                      onClick={onPartnerLogin}
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      Partner Login
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Apply Now Tab */}
          <TabsContent value="apply" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Partner Application</CardTitle>
                <CardDescription>
                  {partnerType === 'construction' 
                    ? 'Apply to join as a Private Construction Firm partner' 
                    : partnerType === 'software'
                    ? 'Apply to integrate Qilly as a White-Label SaaS partner'
                    : 'Select a partner type to begin'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!partnerType && (
                  <div className="text-center py-12">
                    <Handshake className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6">Please select a partner type from the Overview tab</p>
                    <Button onClick={() => setActiveTab('overview')}>
                      Go to Overview
                    </Button>
                  </div>
                )}

                {partnerType === 'construction' && (
                  <div className="space-y-4">
                    <Alert>
                      <Building2 className="h-4 w-4" />
                      <AlertTitle>Construction Firm Partnership</AlertTitle>
                      <AlertDescription>
                        Complete this form to start your partnership application. Our team will contact you within 24-48 hours to set up your Custom tier account.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Company Name *</Label>
                        <Input id="company" placeholder="e.g., Murray & Roberts" />
                      </div>
                      <div>
                        <Label htmlFor="contact">Contact Person *</Label>
                        <Input id="contact" placeholder="Full Name" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="contact@company.co.za" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" placeholder="+27 XX XXX XXXX" />
                      </div>
                      <div>
                        <Label htmlFor="cidb">CIDB Grading</Label>
                        <Input id="cidb" placeholder="e.g., GB9CE" />
                      </div>
                      <div>
                        <Label htmlFor="annual-projects">Annual Projects</Label>
                        <Input id="annual-projects" type="number" placeholder="e.g., 25" />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="annual-qs-fees">Annual QS Fees Spent</Label>
                        <Input id="annual-qs-fees" placeholder="e.g., R1,500,000" />
                        <p className="text-xs text-gray-500 mt-1">This helps us calculate your potential savings</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="project-types">Primary Project Types</Label>
                        <Input id="project-types" placeholder="e.g., Road Construction, Housing Development" />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="message">Additional Information</Label>
                        <textarea 
                          id="message" 
                          className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Tell us about your requirements, expected volume, etc."
                        />
                      </div>
                    </div>

                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-900">What Happens Next?</AlertTitle>
                      <AlertDescription className="text-green-800 text-sm">
                        1. We review your application (24-48 hours)<br />
                        2. Our team contacts you to discuss partnership details<br />
                        3. We create your Custom tier account with login credentials<br />
                        4. You receive an email with your partner portal access
                      </AlertDescription>
                    </Alert>

                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={() => toast.success('Partnership application submitted! We will contact you within 24-48 hours with your account credentials.')}
                    >
                      Submit Partnership Application
                    </Button>
                  </div>
                )}

                {partnerType === 'software' && (
                  <div className="space-y-4">
                    <Alert>
                      <Code className="h-4 w-4" />
                      <AlertTitle>Software Platform Partnership</AlertTitle>
                      <AlertDescription>
                        Join our white-label partner program. We'll provide API access, documentation, and integration support.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sw-company">Company / Platform Name *</Label>
                        <Input id="sw-company" placeholder="e.g., Procore, Buildsmart SA" />
                      </div>
                      <div>
                        <Label htmlFor="sw-contact">Contact Person *</Label>
                        <Input id="sw-contact" placeholder="Full Name" />
                      </div>
                      <div>
                        <Label htmlFor="sw-email">Email Address *</Label>
                        <Input id="sw-email" type="email" placeholder="partner@platform.com" />
                      </div>
                      <div>
                        <Label htmlFor="sw-phone">Phone Number *</Label>
                        <Input id="sw-phone" placeholder="+27 XX XXX XXXX" />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="platform-type">Platform Type</Label>
                        <Input id="platform-type" placeholder="e.g., Construction Management Software, ERP, Project Management" />
                      </div>
                      <div>
                        <Label htmlFor="user-base">Current User Base</Label>
                        <Input id="user-base" type="number" placeholder="e.g., 500" />
                      </div>
                      <div>
                        <Label htmlFor="integration-timeline">Desired Integration Timeline</Label>
                        <Input id="integration-timeline" placeholder="e.g., Q2 2026" />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="tech-stack">Technology Stack</Label>
                        <Input id="tech-stack" placeholder="e.g., React, Node.js, AWS" />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="sw-message">Integration Requirements</Label>
                        <textarea 
                          id="sw-message" 
                          className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Describe your integration needs, expected API usage, white-label requirements, etc."
                        />
                      </div>
                    </div>

                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-900">What Happens Next?</AlertTitle>
                      <AlertDescription className="text-green-800 text-sm">
                        1. Our integration team reviews your application (24 hours)<br />
                        2. We schedule a technical discovery call<br />
                        3. We create your Custom tier account with API credentials<br />
                        4. You receive partner portal access + API documentation
                      </AlertDescription>
                    </Alert>

                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={() => toast.success('White-label partnership application submitted! Our integration team will reach out within 24 hours with your credentials.')}
                    >
                      Submit White-Label Application
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
