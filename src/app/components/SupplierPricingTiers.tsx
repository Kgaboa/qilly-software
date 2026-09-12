import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Check,
  X,
  CreditCard,
  Zap,
  Crown,
  Star,
  TrendingUp,
  Shield,
  BarChart3,
  Smartphone,
  Users,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  priceAnnual: number;
  description: string;
  icon: React.ReactNode;
  color: string;
  popular?: boolean;
  features: string[];
  limitations?: string[];
}

interface SupplierPricingTiersProps {
  onTierSelect?: (tierId: string) => void;
  showROI?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceAnnual: 0,
    description: 'Get started with basic listing',
    icon: <Zap className="w-6 h-6" />,
    color: 'bg-slate-500',
    features: [
      'Basic product catalog (up to 50 products)',
      'Standard search visibility',
      'Manual price updates (weekly)',
      'Basic analytics (monthly summary)',
      'Email support (48-hour response)'
    ],
    limitations: [
      'Listed after Premium suppliers',
      'No API integration',
      'No real-time updates',
      'No compliance data',
      'No priority placement'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 2500,
    priceAnnual: 27000,
    description: 'Most popular for growing suppliers',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'bg-blue-500',
    popular: true,
    features: [
      'Unlimited product listings',
      'API Integration (v1.0 REST API)',
      'Real-time price updates',
      'Higher search ranking',
      'Regional province filtering',
      'Advanced analytics dashboard',
      'Daily quote request tracking',
      'Product popularity reports',
      'Regional demand insights',
      'Phone + email support (24-hour)',
      'Quarterly business review calls'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 7500,
    priceAnnual: 81000,
    description: 'For government contracts & DHS projects',
    icon: <Crown className="w-6 h-6" />,
    color: 'bg-purple-500',
    features: [
      'Everything in Professional, PLUS:',
      'API v2.0 - Government Compliance',
      'SANS 1200 compliance data',
      'NBR alignment tracking',
      'AGRÉMENT certification integration',
      'BBBEE status verification',
      'POPIA compliance features',
      'Anti-corruption verification',
      'PRIORITY on DHS government projects',
      'Premium Badge on supplier profile',
      'Dedicated account manager',
      'White-label export options',
      'Custom reporting & data exports',
      'Priority phone support (4-hour)',
      'Monthly optimization consulting'
    ]
  },
  {
    id: 'custom',
    name: 'Custom',
    price: 15000,
    priceAnnual: 162000,
    description: 'Strategic partnerships & national chains',
    icon: <Star className="w-6 h-6" />,
    color: 'bg-amber-500',
    features: [
      'Everything in Enterprise, PLUS:',
      'Multi-location management',
      'Custom API endpoints & webhooks',
      'Direct ERP/inventory integration',
      'Co-branded marketing materials',
      'Exclusive partnership agreements',
      'Featured supplier status',
      'Revenue sharing opportunities',
      'Joint go-to-market initiatives',
      'Dedicated technical team',
      'Custom SLA agreements'
    ]
  }
];

export function SupplierPricingTiers({ onTierSelect, showROI }: SupplierPricingTiersProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const formatPrice = (monthly: number, annual: number) => {
    if (monthly === 0) return 'Free';
    const price = billingCycle === 'monthly' ? monthly : Math.round(annual / 12);
    return `R${price.toLocaleString()}/mo`;
  };

  const calculateSavings = (monthly: number, annual: number) => {
    if (monthly === 0) return null;
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - annual;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { savings, percentage };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="bg-blue-100 text-blue-700 border-blue-300">
          <Sparkles className="w-3 h-3 mr-1" />
          Supplier Partnership Pricing
        </Badge>
        <h1 className="text-4xl font-bold text-slate-900">
          Choose Your Partnership Level
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Access South Africa's fastest-growing construction procurement platform. 
          Reach 50-100 active contractors pricing 100-500 BOQs monthly.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center items-center gap-4">
        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            billingCycle === 'annual' ? 'bg-blue-500' : 'bg-slate-300'
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
              billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-500'}`}>
          Annual
        </span>
        {billingCycle === 'annual' && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            Save 10%
          </Badge>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingTiers.map((tier) => {
          const savings = calculateSavings(tier.price, tier.priceAnnual);
          
          return (
            <Card
              key={tier.id}
              className={`relative transition-all hover:shadow-xl ${
                tier.popular ? 'border-2 border-blue-500 shadow-lg' : ''
              } ${selectedTier === tier.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">
                    <Award className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 ${tier.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  {tier.icon}
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-sm mt-2">
                  {tier.description}
                </CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-slate-900">
                    {formatPrice(tier.price, tier.priceAnnual)}
                  </div>
                  {billingCycle === 'annual' && tier.price > 0 && (
                    <div className="text-sm text-slate-600 mt-1">
                      R{tier.priceAnnual.toLocaleString()} billed annually
                    </div>
                  )}
                  {savings && billingCycle === 'annual' && (
                    <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-300">
                      Save R{savings.savings.toLocaleString()} ({savings.percentage}%)
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations (for Free tier) */}
                {tier.limitations && (
                  <div className="pt-4 border-t space-y-2">
                    {tier.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  className={`w-full mt-4 ${
                    tier.popular
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : tier.id === 'enterprise'
                      ? 'bg-purple-500 hover:bg-purple-600'
                      : tier.id === 'custom'
                      ? 'bg-amber-500 hover:bg-amber-600'
                      : ''
                  }`}
                  variant={tier.id === 'free' ? 'outline' : 'default'}
                  onClick={() => {
                    setSelectedTier(tier.id);
                    if (onTierSelect) onTierSelect(tier.id);
                  }}
                >
                  {tier.id === 'free' && 'Start Free'}
                  {tier.id === 'professional' && 'Upgrade to Professional'}
                  {tier.id === 'enterprise' && 'Go Enterprise'}
                  {tier.id === 'custom' && 'Contact Sales'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ROI Calculator */}
      {showROI && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-green-600" />
              Return on Investment (ROI)
            </CardTitle>
            <CardDescription>See how quickly you'll recover your investment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Professional ROI */}
              <div className="bg-white rounded-lg p-6 border border-blue-200">
                <h4 className="font-semibold text-lg mb-3 text-blue-900">Professional Tier ROI</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Monthly Cost:</span>
                    <span className="font-semibold">R2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Quote Requests/Month:</span>
                    <span className="font-semibold">100-500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Win Rate (2%):</span>
                    <span className="font-semibold">2-10 projects</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Avg Project Value:</span>
                    <span className="font-semibold">R50,000</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-slate-900 font-semibold">Monthly Revenue:</span>
                    <span className="font-bold text-green-600">R100,000</span>
                  </div>
                  <div className="bg-green-50 rounded p-3 text-center">
                    <p className="font-bold text-2xl text-green-700">40x ROI</p>
                    <p className="text-xs text-green-600 mt-1">Break-even: 1 small project/month</p>
                  </div>
                </div>
              </div>

              {/* Enterprise ROI */}
              <div className="bg-white rounded-lg p-6 border border-purple-200">
                <h4 className="font-semibold text-lg mb-3 text-purple-900">Enterprise Tier ROI</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Annual Cost:</span>
                    <span className="font-semibold">R90,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">DHS Projects Access:</span>
                    <span className="font-semibold">R10M-R43M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Project Margin (3%):</span>
                    <span className="font-semibold">R300K-R1.3M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Projects Needed:</span>
                    <span className="font-semibold">Just 1 per year</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-slate-900 font-semibold">Annual Profit:</span>
                    <span className="font-bold text-green-600">R300,000+</span>
                  </div>
                  <div className="bg-purple-50 rounded p-3 text-center">
                    <p className="font-bold text-2xl text-purple-700">3.3x ROI</p>
                    <p className="text-xs text-purple-600 mt-1">Break-even: 1 DHS project/year</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Feature Comparison</CardTitle>
          <CardDescription>Compare all features across tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="features">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="api">API Access</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Feature</th>
                      <th className="text-center py-3 px-4 font-semibold">Free</th>
                      <th className="text-center py-3 px-4 font-semibold">Professional</th>
                      <th className="text-center py-3 px-4 font-semibold">Enterprise</th>
                      <th className="text-center py-3 px-4 font-semibold">Custom</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-3 px-4">Product Listings</td>
                      <td className="text-center py-3 px-4">50</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Search Ranking</td>
                      <td className="text-center py-3 px-4">Standard</td>
                      <td className="text-center py-3 px-4">Priority</td>
                      <td className="text-center py-3 px-4">Premium</td>
                      <td className="text-center py-3 px-4">Featured</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Real-time Updates</td>
                      <td className="text-center py-3 px-4"><X className="w-4 h-4 text-red-400 inline" /></td>
                      <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 inline" /></td>
                      <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 inline" /></td>
                      <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 inline" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Analytics Dashboard</td>
                      <td className="text-center py-3 px-4">Basic</td>
                      <td className="text-center py-3 px-4">Advanced</td>
                      <td className="text-center py-3 px-4">Advanced</td>
                      <td className="text-center py-3 px-4">Custom</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Compliance Features</td>
                      <td className="text-center py-3 px-4"><X className="w-4 h-4 text-red-400 inline" /></td>
                      <td className="text-center py-3 px-4"><X className="w-4 h-4 text-red-400 inline" /></td>
                      <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 inline" /></td>
                      <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 inline" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Account Manager</td>
                      <td className="text-center py-3 px-4"><X className="w-4 h-4 text-red-400 inline" /></td>
                      <td className="text-center py-3 px-4"><X className="w-4 h-4 text-red-400 inline" /></td>
                      <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 inline" /></td>
                      <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 inline" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="support" className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Free Tier Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Email support</p>
                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 48-hour response time</p>
                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Help center access</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Professional Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Email + phone support</p>
                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 24-hour response time</p>
                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Quarterly business reviews</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Enterprise Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Priority phone support</p>
                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 4-hour response time</p>
                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Dedicated account manager</p>
                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Monthly consulting</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Custom Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 24/7 support availability</p>
                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Dedicated technical team</p>
                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Custom SLA agreements</p>
                    <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> On-site training</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="api" className="mt-6">
              <div className="space-y-4">
                <Card className="border-slate-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2">Free Tier</h4>
                    <p className="text-sm text-slate-600">No API access. Manual price updates via CSV upload.</p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2 text-blue-900">Professional Tier - API v1.0</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>✓ REST API endpoints</li>
                      <li>✓ Real-time price updates</li>
                      <li>✓ Product catalog management</li>
                      <li>✓ Basic authentication (API key)</li>
                      <li>✓ Rate limit: 1,000 requests/hour</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-purple-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2 text-purple-900">Enterprise Tier - API v2.0</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>✓ All v1.0 features</li>
                      <li>✓ Government compliance endpoints</li>
                      <li>✓ SANS 1200, NBR, AGRÉMENT data</li>
                      <li>✓ BBBEE status integration</li>
                      <li>✓ POPIA compliance features</li>
                      <li>✓ Rate limit: 5,000 requests/hour</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-amber-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2 text-amber-900">Custom Tier - Custom API</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>✓ All v2.0 features</li>
                      <li>✓ Custom endpoints & webhooks</li>
                      <li>✓ Direct ERP integration</li>
                      <li>✓ White-label API</li>
                      <li>✓ Unlimited rate limits</li>
                      <li>✓ Dedicated technical support</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Can I switch tiers anytime?</h4>
            <p className="text-sm text-slate-600">
              Yes! You can upgrade anytime. Downgrades take effect at the end of your billing period.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
            <p className="text-sm text-slate-600">
              Credit/debit card (Stripe), EFT/bank transfer, debit order, and 30-day invoices for Enterprise+ clients.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Is there a setup fee?</h4>
            <p className="text-sm text-slate-600">
              No setup fees for Free and Professional tiers. Enterprise and Custom may include onboarding services.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">What happens if payment fails?</h4>
            <p className="text-sm text-slate-600">
              You get a 7-day grace period with email reminders. After that, your account automatically downgrades to Free tier.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA Footer */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="pt-8 pb-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Partner with Qilly?</h3>
          <p className="mb-6 text-blue-100 max-w-2xl mx-auto">
            Join 50+ suppliers already growing their business on South Africa's fastest construction procurement platform.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <CreditCard className="w-4 h-4 mr-2" />
              Contact Sales
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}