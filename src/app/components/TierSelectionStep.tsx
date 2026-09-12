import React from 'react';
import { Zap, Building2, Crown, GraduationCap, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface TierSelectionStepProps {
  onSelectTier?: (tierId: string, tierName: string, price: number) => void;
  onTierSelect?: (tierId: string, tierName: string, price: number) => void;
  onBack?: () => void;
}

export function TierSelectionStep({ onSelectTier, onTierSelect, onBack }: TierSelectionStepProps) {
  const handleTierSelect = onSelectTier || onTierSelect || (() => {});

  const tiers = [
    {
      id: 'FREE',
      name: 'Free',
      price: 'R0',
      priceMonthly: 0,
      icon: <GraduationCap className="h-4 w-4" />,
      live: [
        '5 templates (training only)',
        'Unlimited training BOQs',
        'BOQ structure view',
        'Email support',
      ],
      locked: ['Live pricing', 'Excel/PDF export', 'Compliance docs'],
      cta: 'Start Free',
      active: false,
    },
    {
      id: 'PROFESSIONAL',
      name: 'Professional',
      price: 'R2,999',
      priceMonthly: 2999,
      icon: <Building2 className="h-4 w-4" />,
      live: [
        '10 BOQs/month',
        'Live pricing & supplier comparison',
        '10 templates · PDF & Excel export',
        'Regional pricing · P&G costs',
        'Compliance docs · 6mo history',
        'Email + Chat support',
      ],
      locked: [],
      cta: 'Coming Soon',
      active: false,
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      price: 'R8,999',
      priceMonthly: 8999,
      icon: <Zap className="h-4 w-4" />,
      live: [
        '30 BOQs/month',
        'Everything in Professional',
        '15 templates',
        'Advanced compliance documents',
        'Unlimited project history',
        '5 concurrent users',
        'Priority support',
      ],
      soon: [
        'Green building & carbon tracking',
        'Collusion detection',
        'eTender integration',
        'API access',
      ],
      cta: 'Select Enterprise',
      active: true,
    },
    {
      id: 'CUSTOM',
      name: 'Custom',
      price: 'Contact Sales',
      priceMonthly: 0,
      icon: <Crown className="h-4 w-4" />,
      live: [
        'Unlimited BOQs & templates',
        'White-label solution',
        'Custom integrations',
        'Multi-company & unlimited users',
        'SLA guarantees · 24/7 support',
        'Dedicated account manager',
      ],
      locked: [],
      cta: 'Coming Soon',
      active: false,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Back + Header row */}
      <div className="flex items-center gap-4 mb-4">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-1 text-slate-500 shrink-0">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Choose Your Tier</h2>
          <p className="text-xs text-slate-500">Enterprise is the only tier currently available for new registrations.</p>
        </div>
      </div>

      {/* Tier grid — 4 columns, compact cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative rounded-xl border flex flex-col transition-all duration-200 ${
              tier.active
                ? 'border-2 border-blue-500 bg-blue-50 shadow-md'
                : 'border border-slate-200 bg-white opacity-60'
            }`}
          >
            {/* Active badge */}
            {tier.active && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-blue-600 text-white text-[10px] px-2 py-0.5 shadow">
                  ⭐ ACTIVE
                </Badge>
              </div>
            )}

            {/* Card header */}
            <div className={`px-3 pt-5 pb-2 rounded-t-xl ${tier.active ? 'bg-blue-600' : 'bg-slate-100'}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={tier.active ? 'text-white' : 'text-slate-500'}>{tier.icon}</span>
                <span className={`font-bold text-sm ${tier.active ? 'text-white' : 'text-slate-700'}`}>{tier.name}</span>
              </div>
              <div className={`text-lg font-extrabold leading-none ${tier.active ? 'text-white' : 'text-slate-800'}`}>
                {tier.price}
              </div>
              {tier.priceMonthly > 0 && (
                <div className={`text-[10px] ${tier.active ? 'text-blue-100' : 'text-slate-400'}`}>/month</div>
              )}
            </div>

            {/* Features */}
            <div className="px-3 py-2 flex-1 space-y-1">
              {tier.live.map((f, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <CheckCircle className={`h-3 w-3 mt-0.5 shrink-0 ${tier.active ? 'text-blue-500' : 'text-slate-400'}`} />
                  <span className="text-[11px] leading-snug text-slate-700">{f}</span>
                </div>
              ))}
              {tier.soon && tier.soon.length > 0 && (
                <>
                  <div className="border-t border-dashed border-blue-200 my-1" />
                  {tier.soon.map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <Clock className="h-3 w-3 mt-0.5 shrink-0 text-amber-400" />
                      <span className="text-[11px] leading-snug text-slate-400 italic">{f}</span>
                    </div>
                  ))}
                </>
              )}
              {tier.locked && tier.locked.length > 0 && (
                <>
                  <div className="border-t border-dashed border-slate-200 my-1" />
                  {tier.locked.map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-[10px] mt-0.5 shrink-0 text-slate-300">✗</span>
                      <span className="text-[11px] leading-snug text-slate-300 line-through">{f}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* CTA */}
            <div className="px-3 pb-3 pt-1">
              <Button
                size="sm"
                onClick={() => tier.active && handleTierSelect(tier.id, tier.name, tier.priceMonthly)}
                disabled={!tier.active}
                className={`w-full text-xs h-8 ${
                  tier.active
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {tier.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-400 mt-3">
        All paid tiers require admin approval after EFT payment verification.
      </p>
    </div>
  );
}