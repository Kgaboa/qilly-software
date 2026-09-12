import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';

interface ContractorPricingTiersProps {
  onTierSelect: (tierId: string, billingCycle: 'monthly' | 'annual') => void;
}

export function ContractorPricingTiers({ onTierSelect }: ContractorPricingTiersProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const tiers = [
    {
      id: 'professional',
      name: 'Professional',
      icon: Star,
      description: 'Perfect for small to medium contractors',
      monthlyPrice: 2999,
      annualPrice: 29990,
      savings: 6000,
      boqQuota: '10 BOQs/month',
      features: [
        '10 BOQs per month',
        '10 standard BOQ templates',
        'Real-time supplier pricing (live)',
        'Excel & PDF export (no watermark)',
        'Multi-supplier comparison (3+ quotes)',
        'Compliance cost calculator (NHBRC, CIDB)',
        'P&G costs calculator',
        'Regional pricing (9 provinces)',
        'Profit margin calculator (5-20%)',
        'SANS 1200 compliance validation',
        'BBBEE tracking (basic)',
        'Tender response generator (basic)',
        'Project history (6 months)',
        '1 user account',
        'Email + chat support'
      ],
      popular: false,
      color: 'blue'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Zap,
      description: 'Full-featured solution + eTender integration',
      monthlyPrice: 8999,
      annualPrice: 89990,
      savings: 18000,
      boqQuota: '30 BOQs/month',
      features: [
        'Everything in Professional, plus:',
        '30 BOQs per month',
        '15+ advanced BOQ templates',
        '🌿 Green Building & Carbon Tracking',
        '🌿 Green Material Alternatives',
        '🌿 Environmental Compliance Dashboard',
        '📈 Future Price Projections (6 & 12 months)',
        '🛡️ Collusion Detection',
        '🔗 eTender Integration',
        'Advanced compliance documents (NHBRC, AGRÉMENT)',
        'BBBEE tracking & reporting (advanced)',
        'Unlimited project history',
        'API access (limited)',
        '5 user accounts',
        'Priority support (24h response)'
      ],
      popular: true,
      color: 'purple'
    },
    {
      id: 'custom',
      name: 'Custom',
      icon: Crown,
      description: 'Enterprise-grade + white-label solution',
      monthlyPrice: null,
      annualPrice: null,
      savings: null,
      boqQuota: 'Unlimited BOQs',
      features: [
        'Everything in Enterprise, plus:',
        'Unlimited BOQs',
        'Custom BOQ templates',
        'White-label solution',
        'Multi-company management',
        'Dedicated account manager',
        'Custom integrations',
        'Unlimited users',
        'Custom compliance workflows',
        'On-premise deployment option',
        'SLA guarantees (99.9% uptime)',
        '24/7 priority support',
        'Custom reporting & analytics',
        'Training & onboarding'
      ],
      popular: false,
      color: 'amber'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-3">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center rounded-lg border-2 border-gray-200 p-0.5 bg-white">
          <button
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              billingCycle === 'annual'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setBillingCycle('annual')}
          >
            Annual
            <span className="ml-1.5 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards - Ultra Compact */}
      <div className="grid md:grid-cols-3 gap-3">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          const price = billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
          const savings = tier.savings;

          return (
            <Card
              key={tier.id}
              className={`relative ${
                tier.popular
                  ? 'border-purple-500 border-2 shadow-md'
                  : 'border-gray-200 hover:border-blue-300'
              } transition-all`}
            >
              {tier.popular && (
                <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-2 py-0 text-[10px]">
                    Popular
                  </Badge>
                </div>
              )}

              <CardHeader className={`bg-gradient-to-br py-2 ${
                tier.color === 'blue' ? 'from-blue-50 to-cyan-50' :
                tier.color === 'purple' ? 'from-purple-50 to-pink-50' :
                'from-amber-50 to-orange-50'
              }`}>
                <div className="flex items-center justify-between mb-0.5">
                  <Icon className={`w-5 h-5 ${
                    tier.color === 'blue' ? 'text-blue-600' :
                    tier.color === 'purple' ? 'text-purple-600' :
                    'text-amber-600'
                  }`} />
                </div>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <CardDescription className="text-[10px] leading-tight">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-3 pb-3">
                {/* Price */}
                <div className="mb-3">
                  {price !== null ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">{formatPrice(price)}</span>
                        <span className="text-gray-500 text-xs">
                          /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </div>
                      {billingCycle === 'annual' && savings && (
                        <p className="text-[10px] text-green-600 font-medium mt-0.5">
                          Save {formatPrice(savings)}/yr
                        </p>
                      )}
                    </>
                  ) : (
                    <div>
                      <span className="text-2xl font-bold">Custom</span>
                      <p className="text-[10px] text-gray-500 mt-0.5">Contact sales</p>
                    </div>
                  )}
                </div>

                {/* Features - Very Compact with scroll */}
                <div className="space-y-1.5 mb-3 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-1.5">
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                        tier.color === 'blue' ? 'text-blue-600' :
                        tier.color === 'purple' ? 'text-purple-600' :
                        'text-amber-600'
                      }`} />
                      <span className={`text-[10px] leading-snug ${
                        feature.startsWith('Everything') ? 'font-semibold' : ''
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full ${
                    tier.popular
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : tier.color === 'blue'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  } text-white h-8 text-xs`}
                  onClick={() => onTierSelect(tier.id, billingCycle)}
                >
                  {tier.id === 'custom' ? 'Contact Sales' : 'Select Plan'}
                </Button>

                {tier.id !== 'custom' && (
                  <p className="text-[10px] text-center text-gray-500 mt-1.5">
                    14-day free trial
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Value Propositions - Ultra Compact */}
      <div className="grid md:grid-cols-3 gap-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <h4 className="font-semibold text-blue-900 mb-0.5 text-xs">⚡ 5-Min BOQs</h4>
          <p className="text-[10px] text-blue-800 leading-tight">
            Generate BOQs in 5 mins vs 2-3 days
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-2">
          <h4 className="font-semibold text-green-900 mb-0.5 text-xs">💯 Accurate</h4>
          <p className="text-[10px] text-green-800 leading-tight">
            Live data from 96 SA brands
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
          <h4 className="font-semibold text-purple-900 mb-0.5 text-xs">✅ Compliant</h4>
          <p className="text-[10px] text-purple-800 leading-tight">
            SANS 1200, NHBRC, BBBEE ready
          </p>
        </div>
      </div>
    </div>
  );
}