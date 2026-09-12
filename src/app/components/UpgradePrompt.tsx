import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Lock, Zap, Crown, ArrowRight } from 'lucide-react';
import type { SubscriptionTier } from '@/utils/tierAccess';

interface UpgradePromptProps {
  currentTier: SubscriptionTier;
  requiredTier: SubscriptionTier;
  featureName: string;
  featureDescription?: string;
  icon?: React.ReactNode;
  onUpgrade?: () => void;
}

export function UpgradePrompt({
  currentTier,
  requiredTier,
  featureName,
  featureDescription,
  icon,
  onUpgrade,
}: UpgradePromptProps) {
  const tierInfo = {
    professional: {
      name: 'PROFESSIONAL',
      price: 'R2,999/month',
      color: 'blue',
      icon: <Zap className="w-5 h-5" />,
    },
    enterprise: {
      name: 'ENTERPRISE',
      price: 'R8,999/month',
      color: 'purple',
      icon: <Zap className="w-5 h-5" />,
    },
    custom: {
      name: 'CUSTOM',
      price: 'Contact Sales',
      color: 'amber',
      icon: <Crown className="w-5 h-5" />,
    },
  };

  const targetTier = tierInfo[requiredTier as keyof typeof tierInfo];
  if (!targetTier) return null;

  return (
    <Card className={`border-2 border-${targetTier.color}-200 bg-gradient-to-br from-${targetTier.color}-50 to-white`}>
      <CardContent className="py-3 px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Feature Info */}
          <div className="flex items-center gap-3 flex-1">
            <div className={`p-2 bg-${targetTier.color}-100 rounded-lg`}>
              <Lock className={`w-4 h-4 text-${targetTier.color}-600`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">{featureName}</span>
                <Badge className={`bg-${targetTier.color}-600 text-white text-[10px] px-2 py-0.5`}>
                  {targetTier.name}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                {featureDescription || `Available in ${targetTier.name} tier`}
              </p>
            </div>
          </div>

          {/* Right: Price & Upgrade Button */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className={`text-lg font-bold text-${targetTier.color}-600`}>{targetTier.price}</div>
              <div className="text-[10px] text-gray-500">per month</div>
            </div>
            <Button
              onClick={onUpgrade}
              size="sm"
              className={`bg-${targetTier.color}-600 hover:bg-${targetTier.color}-700 text-white`}
            >
              {requiredTier === 'custom' ? 'Contact Sales' : 'Upgrade'}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Inline upgrade badge (for buttons)
 */
export function UpgradeBadge({ requiredTier }: { requiredTier: SubscriptionTier }) {
  const tierInfo = {
    professional: { name: 'PRO', color: 'blue' },
    enterprise: { name: 'ENT', color: 'purple' },
    custom: { name: 'CUSTOM', color: 'amber' },
  };

  const tier = tierInfo[requiredTier as keyof typeof tierInfo];
  if (!tier) return null;

  return (
    <Badge className={`ml-2 bg-${tier.color}-600 text-white text-[10px] px-1.5 py-0`}>
      <Lock className="w-2.5 h-2.5 mr-0.5" />
      {tier.name}
    </Badge>
  );
}