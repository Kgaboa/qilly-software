import React from 'react';
import { Check, Zap, Building2, Crown, GraduationCap, Sparkles, Phone, Mail, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

// ✅ Updated 2026-03-13: 4-tier comparison with accurate features (FREE, PROFESSIONAL R2,999, ENTERPRISE R8,999, CUSTOM)
interface Tier {
  id: string;
  name: string;
  price: string;
  priceMonthly: number;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
  features: string[];
  cta: string;
  badge?: string;
  highlighted?: boolean;
}

interface TierSelectionStepProps {
  onSelectTier?: (tierId: string, tierName: string, price: number) => void;
  onTierSelect?: (tierId: string, tierName: string, price: number) => void;
  onBack?: () => void;
}

export function TierSelectionStep({ onSelectTier, onTierSelect, onBack }: TierSelectionStepProps) {
  // Support both prop names for backwards compatibility
  const handleTierSelect = onSelectTier || onTierSelect || (() => {});
  
  const tiers: Tier[] = [
    {
      id: 'FREE',
      name: 'Free',
      price: 'R0',
      priceMonthly: 0,
      description: 'Training & Evaluation Platform',
      icon: <GraduationCap className="h-6 w-6" />,
      badge: '🎓 Unlimited Training BOQs',
      features: [
        '✅ Template library (5 templates, 1 per project type)',
        '✅ Unlimited training BOQs',
        '✅ View BOQ structure (pricing encrypted)',
        '✅ Email support',
        '❌ All pricing: R ●●●●●●',
        '❌ All percentages: ●●●%',
        '❌ Custom BOQ upload (templates only)',
        '❌ Item Matching (completely blocked)',
        '❌ Excel export',
        '❌ Project history',
        '❌ Basic compliance calculator',
        '❌ Green building features',
        '❌ Tender response generation',
        '❌ Future price projections',
        '❌ Collusion detection'
      ],
      cta: 'Start Free Training'
    },
    {
      id: 'PROFESSIONAL',
      name: 'Professional',
      price: 'R2,999',
      priceMonthly: 2999,
      description: 'Essential features for individual contractors',
      icon: <Building2 className="h-6 w-6" />,
      badge: '💼 10 BOQs/month',
      features: [
        '✅ 10 BOQs per month',
        '✅ Custom BOQ upload (Excel/CSV)',
        '✅ Live pricing (all amounts visible)',
        '✅ 10 templates',
        '✅ PDF export (no watermark)',
        '✅ Excel export',
        '✅ Real-time pricing',
        '✅ Multi-supplier comparison',
        '✅ Regional pricing',
        '✅ Full compliance calculator',
        '✅ Compliance documents',
        '✅ P&G costs',
        '✅ Tender response generator (PDF)',
        '✅ 6 months project history',
        '✅ Email + Chat support',
        '❌ Green building features',
        '❌ Carbon tracking',
        '❌ Collusion detection',
        '❌ eTender integration'
      ],
      cta: 'Select Professional'
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      price: 'R8,999',
      priceMonthly: 8999,
      description: 'Government contracts with carbon tracking',
      icon: <Zap className="h-6 w-6" />,
      badge: '🏛️ For DHS Contracts',
      popular: true,
      highlighted: true,
      features: [
        '✅ Everything in Professional',
        '✅ 30 BOQs per month',
        '✅ 15 templates',
        '✅ 🌿 Green building features',
        '✅ 🌿 Carbon tracking per BOQ item',
        '✅ 🌿 Green materials database',
        '✅ 🌿 Environmental dashboard',
        '✅ 📈 Future price projections',
        '✅ 📋 Advanced compliance documents',
        '✅ 🛡️ Collusion detection',
        '✅ 🔗 eTender integration',
        '✅ 🔌 API access',
        '✅ Unlimited project history',
        '✅ 5 concurrent users',
        '✅ Priority support'
      ],
      cta: 'Select Enterprise'
    },
    {
      id: 'CUSTOM',
      name: 'Custom',
      price: 'Contact Sales',
      priceMonthly: 0,
      description: 'White-label + unlimited everything',
      icon: <Crown className="h-6 w-6" />,
      badge: '👑 White Glove Service',
      features: [
        '✅ Everything in Enterprise',
        '✅ Unlimited BOQs',
        '✅ Unlimited templates',
        '✅ Custom templates',
        '✅ White-label solution',
        '✅ Custom integrations',
        '✅ On-premise deployment',
        '✅ Multi-company support',
        '✅ SLA guarantees',
        '✅ Unlimited users',
        '✅ 24/7 support',
        '✅ Dedicated account manager',
        '✅ Custom training'
      ],
      cta: 'Contact Sales'
    }
  ];

  return (
    <div className="w-full">
      {/* Back Button */}
      {onBack && (
        <div className="mb-6 max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign-up
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Choose Your Tier</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Select the tier that best fits your needs. Start with FREE (training mode) or choose a paid tier for live pricing.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span className="text-sm text-purple-800 font-medium">
            Green Building & Carbon Tracking available in ENTERPRISE tier only
          </span>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={`relative flex flex-col transition-all duration-300 ${
              tier.id === 'ENTERPRISE'
                ? 'border-2 border-blue-500 shadow-lg scale-105 hover:shadow-xl'
                : 'border border-gray-200 opacity-50 grayscale cursor-not-allowed'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">
                  MOST POPULAR
                </Badge>
              </div>
            )}

            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-blue-600">
                  {tier.icon}
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                </div>
              </div>
              
              {tier.badge && (
                <Badge variant="outline" className="mb-2 w-fit text-xs bg-emerald-50 border-emerald-200 text-emerald-700">
                  {tier.badge}
                </Badge>
              )}

              <div className="mb-2">
                <span className="text-3xl font-bold text-slate-900">{tier.price}</span>
                {tier.priceMonthly > 0 && (
                  <span className="text-sm text-slate-600">/month</span>
                )}
              </div>

              <CardDescription className="text-sm">
                {tier.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {/* Features List */}
              <ul className="space-y-2 mb-6 flex-1">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5">{feature.startsWith('✅') || feature.startsWith('❌') ? '' : '•'}</span>
                    <span className={feature.startsWith('❌') ? 'text-slate-400' : 'text-slate-700'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                onClick={() => tier.id === 'ENTERPRISE' && handleTierSelect(tier.id, tier.name, tier.priceMonthly)}
                disabled={tier.id !== 'ENTERPRISE'}
                className={`w-full ${
                  tier.id === 'ENTERPRISE'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed opacity-60'
                }`}
              >
                {tier.id === 'ENTERPRISE' ? tier.cta : 'Coming Soon'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support Information */}
      <div className="mt-8 grid md:grid-cols-4 gap-4 max-w-7xl mx-auto">
        <Card className="bg-slate-50">
          <CardContent className="pt-4 text-center">
            <Mail className="h-6 w-6 mx-auto mb-2 text-slate-600" />
            <p className="text-xs font-semibold text-slate-900">Email Support</p>
            <p className="text-xs text-slate-600">All tiers</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-50">
          <CardContent className="pt-4 text-center">
            <GraduationCap className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
            <p className="text-xs font-semibold text-slate-900">Free Training</p>
            <p className="text-xs text-slate-600">FREE & Enterprise+</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-50">
          <CardContent className="pt-4 text-center">
            <Zap className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-xs font-semibold text-slate-900">eTender Integration</p>
            <p className="text-xs text-slate-600">Enterprise & Custom only</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-50">
          <CardContent className="pt-4 text-center">
            <Phone className="h-6 w-6 mx-auto mb-2 text-amber-600" />
            <p className="text-xs font-semibold text-slate-900">24h Call Support</p>
            <p className="text-xs text-slate-600">Custom tier only</p>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500">
          All paid tiers require admin approval after payment verification.
        </p>
      </div>
    </div>
  );
}