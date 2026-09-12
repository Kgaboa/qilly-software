import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Label } from '@/app/components/ui/label';
import { 
  Building2, 
  Zap, 
  CreditCard, 
  CheckCircle, 
  TrendingDown,
  Sparkles,
  Shield,
  Clock,
  DollarSign
} from 'lucide-react';
import { EFTPayment } from './EFTPayment';
import { StitchPayment } from './StitchPayment';
import { PayFastPayment } from './PayFastPayment';
import { ManualUpgrade } from './ManualUpgrade';
import { toast } from 'sonner';

// ✅ Updated 2026-03-13: 4-tier comparison (FREE, PROFESSIONAL R2,999, ENTERPRISE R8,999, CUSTOM)
interface SubscriptionUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
  userId: string;
  userEmail: string;
  userName: string;
  currentTier?: 'free' | 'professional' | 'enterprise' | 'custom'; // Current subscription tier
  defaultTier?: 'professional' | 'enterprise' | 'custom'; // Optional default tier to pre-select
  subscriptionStartDate?: string; // ISO date string for subscription start
  lastPaymentDate?: string; // ISO date string for last payment
}

export function SubscriptionUpgradeModal({ 
  isOpen, 
  onClose, 
  onUpgradeSuccess,
  userId,
  userEmail,
  userName,
  currentTier = 'free', // Default to free if not specified
  defaultTier = 'professional', // Default to professional if not specified
  subscriptionStartDate,
  lastPaymentDate
}: SubscriptionUpgradeModalProps) {
  const [selectedTier, setSelectedTier] = useState<'professional' | 'enterprise' | 'custom'>(defaultTier);
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPayment, setSelectedPayment] = useState<'eft' | 'stitch' | 'payfast' | 'manual'>('eft');

  // Reset to defaultTier when modal opens or defaultTier changes
  useEffect(() => {
    if (isOpen) {
      setSelectedTier(defaultTier);
    }
  }, [isOpen, defaultTier]);

  // ✅ PRORATED PRICING CALCULATION
  const calculateProratedPrice = (newTierPrice: number): { 
    fullPrice: number; 
    credit: number; 
    proratedPrice: number; 
    daysRemaining: number;
    daysInMonth: number;
  } => {
    // Only prorate for monthly subscriptions
    if (selectedCycle !== 'monthly') {
      return { 
        fullPrice: newTierPrice, 
        credit: 0, 
        proratedPrice: newTierPrice,
        daysRemaining: 0,
        daysInMonth: 30
      };
    }

    // Get current tier price
    const tierPrices: Record<string, number> = {
      free: 0,
      professional: 2999,
      enterprise: 8999,
      custom: 0
    };
    
    const currentTierPrice = tierPrices[currentTier] || 0;
    
    // If no current payment or free tier, no credit
    if (currentTierPrice === 0 || !lastPaymentDate) {
      return { 
        fullPrice: newTierPrice, 
        credit: 0, 
        proratedPrice: newTierPrice,
        daysRemaining: 0,
        daysInMonth: 30
      };
    }

    // Calculate days remaining in current billing cycle
    const paymentDate = new Date(lastPaymentDate);
    const today = new Date();
    
    // Get the next billing date (1 month from last payment)
    const nextBillingDate = new Date(paymentDate);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    
    // Calculate days in current billing cycle
    const daysInCycle = Math.round((nextBillingDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate days used and days remaining
    const daysUsed = Math.max(0, Math.round((today.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, Math.round((nextBillingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate credit from current subscription
    const credit = Math.round((daysRemaining / daysInCycle) * currentTierPrice);
    
    // Calculate prorated price for new tier (pay for remaining days only)
    const proratedNewTierCost = Math.round((daysRemaining / daysInCycle) * newTierPrice);
    
    // Final amount = prorated new tier cost - credit
    const proratedPrice = Math.max(0, proratedNewTierCost - credit);
    
    return {
      fullPrice: newTierPrice,
      credit,
      proratedPrice,
      daysRemaining,
      daysInMonth: daysInCycle
    };
  };

  const tiers = {
    free: {
      name: 'FREE',
      monthlyPrice: 0,
      annualPrice: 0,
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
      icon: Sparkles,
      color: 'gray',
      badge: 'CURRENT PLAN',
      disabled: true
    },
    professional: {
      name: 'Professional',
      monthlyPrice: 2999,
      annualPrice: 28790, // 20% discount (2999 * 12 * 0.8)
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
      icon: Sparkles,
      color: 'blue',
      badge: 'MOST POPULAR'
    },
    enterprise: {
      name: 'Enterprise',
      monthlyPrice: 8999,
      annualPrice: 86390, // 20% discount (8999 * 12 * 0.8)
      features: [
        '✅ Everything in Professional',
        '✅ 30 BOQs per month',
        '✅ 15 templates',
        '✅ Green building features',
        '✅ Carbon tracking per BOQ item',
        '✅ Green materials database',
        '✅ Environmental dashboard',
        '✅ Future price projections',
        '✅ Advanced compliance documents',
        '✅ Collusion detection',
        '✅ eTender integration',
        '✅ API access',
        '✅ Unlimited project history',
        ' 5 concurrent users',
        '✅ Priority support'
      ],
      icon: Building2,
      color: 'purple',
      badge: 'FOR DHS CONTRACTS'
    },
    custom: {
      name: 'Custom',
      monthlyPrice: 0, // Contact sales
      annualPrice: 0, // Contact sales
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
      icon: Shield,
      color: 'amber',
      badge: 'CONTACT SALES'
    }
  };

  const getCurrentPrice = () => {
    const tier = tiers[selectedTier];
    const basePrice = selectedCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
    
    // Apply prorated pricing for monthly upgrades
    if (selectedCycle === 'monthly' && currentTier !== 'free' && basePrice > 0) {
      const prorated = calculateProratedPrice(basePrice);
      return prorated.proratedPrice;
    }
    
    return basePrice;
  };

  const getFullPrice = () => {
    const tier = tiers[selectedTier];
    return selectedCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
  };

  const getProratedDetails = () => {
    if (selectedCycle === 'monthly' && currentTier !== 'free') {
      const tier = tiers[selectedTier];
      const basePrice = tier.monthlyPrice;
      if (basePrice > 0) {
        return calculateProratedPrice(basePrice);
      }
    }
    return null;
  };

  const getSavings = () => {
    if (selectedCycle === 'annual') {
      const tier = tiers[selectedTier];
      const monthlyCost = tier.monthlyPrice * 12;
      return monthlyCost - tier.annualPrice;
    }
    return 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#00b4d8]" />
            Upgrade Your Plan
          </DialogTitle>
          <DialogDescription>
            Contact us to activate your subscription and get full access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <p className="text-sm text-blue-900 font-medium">
              Our team will set up your account and confirm pricing within 24 hours.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:billing@qilly.co.za?subject=Subscription%20Upgrade%20Request"
                className="flex items-center gap-2 w-full bg-[#00b4d8] hover:bg-[#0077b6] text-white text-sm font-semibold px-4 py-2.5 rounded-md transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                Email billing@qilly.co.za
              </a>
              <a
                href="tel:+27837582645"
                className="flex items-center gap-2 w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-md transition-colors"
              >
                <Shield className="w-4 h-4 text-gray-500" />
                Call +27 83 758 2645
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
            <div className="bg-gray-50 rounded p-2">
              <div className="font-bold text-gray-800">Professional</div>
              <div>R2,999/mo</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="font-bold text-gray-800">Enterprise</div>
              <div>R8,999/mo</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="font-bold text-gray-800">Custom</div>
              <div>Contact us</div>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 text-center">
            Annual billing available — save 2 months&apos; fees.
          </p>
        </div>

        <div className="flex justify-end pt-1">
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Keep the original return below this line — replaced for customer preview
function _OriginalReturn_Disabled() {
  return (
    <Dialog open={false} onOpenChange={() => {}}>
      <DialogContent className="!max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-600" />
            Choose Your Tier
          </DialogTitle>
          <DialogDescription className="text-base">
            Compare plans and upgrade to unlock live pricing, compliance documents, and more. Annual billing saves you 2 months!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Billing Cycle Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-4 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setSelectedCycle('monthly')}
                className={`px-6 py-2 rounded-md transition-all ${
                  selectedCycle === 'monthly'
                    ? 'bg-white shadow-md font-semibold'
                    : 'text-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedCycle('annual')}
                className={`px-6 py-2 rounded-md transition-all flex items-center gap-2 ${
                  selectedCycle === 'annual'
                    ? 'bg-white shadow-md font-semibold'
                    : 'text-gray-600'
                }`}
              >
                Annual
                <Badge className="bg-green-500 text-white">Save 2 months!</Badge>
              </button>
            </div>
          </div>

          {/* Tier Selection Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            {(Object.keys(tiers) as Array<keyof typeof tiers>).map((tierKey) => {
              const tier = tiers[tierKey];
              const isSelected = selectedTier === tierKey;
              const isCurrent = tierKey === currentTier;
              const Icon = tier.icon;
              const price = selectedCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
              
              // Determine if this tier should be disabled (current tier or lower)
              const tierHierarchy = { free: 0, professional: 1, enterprise: 2, custom: 3 };
              const currentTierLevel = tierHierarchy[currentTier];
              const thisTierLevel = tierHierarchy[tierKey];
              const isDisabled = thisTierLevel <= currentTierLevel;

              return (
                <Card
                  key={tierKey}
                  className={`transition-all ${
                    isDisabled
                      ? 'border-2 border-gray-300 bg-gray-50 opacity-75 cursor-not-allowed'
                      : isSelected
                      ? `border-2 border-${tier.color}-500 shadow-lg cursor-pointer`
                      : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                  }`}
                  onClick={() => !isDisabled && setSelectedTier(tierKey as 'professional' | 'enterprise' | 'custom')}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-8 h-8 ${isDisabled ? 'text-gray-400' : `text-${tier.color}-600`}`} />
                      {isCurrent && (
                        <Badge className="bg-green-600 text-white text-xs">CURRENT PLAN</Badge>
                      )}
                      {!isCurrent && isDisabled && tierKey === 'free' && (
                        <Badge className="bg-gray-500 text-white text-xs">FREE TIER</Badge>
                      )}
                      {!isDisabled && isSelected && (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                      {!isDisabled && !isSelected && tier.badge && (
                        <Badge className={`bg-${tier.color}-500 text-white text-xs`}>{tier.badge}</Badge>
                      )}
                    </div>
                    <CardTitle className={`text-xl ${isDisabled ? 'text-gray-500' : ''}`}>
                      {tier.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold mb-1 ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                      {tierKey === 'custom' ? 'Contact Sales' : `R${price.toLocaleString()}`}
                    </div>
                    <div className={`text-sm mb-2 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
                      {tierKey === 'custom' ? 'Custom pricing' : selectedCycle === 'monthly' ? 'per month' : 'per year'}
                    </div>
                    {selectedCycle === 'annual' && tier.monthlyPrice > 0 && (
                      <div className="text-xs text-green-600 font-semibold mb-4">
                        Save R{(tier.monthlyPrice * 12 - tier.annualPrice).toLocaleString()}
                      </div>
                    )}
                    
                    <ul className="space-y-2 mt-4 max-h-64 overflow-y-auto">
                      {tier.features.map((feature, idx) => {
                        const isRestricted = feature.startsWith('❌');
                        return (
                          <li key={idx} className="flex items-start gap-2 text-xs">
                            {isRestricted ? (
                              <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                            ) : (
                              <CheckCircle className={`w-3 h-3 mt-0.5 flex-shrink-0 ${isDisabled ? 'text-gray-400' : 'text-green-600'}`} />
                            )}
                            <span className={isRestricted ? 'text-gray-500 line-through' : isDisabled ? 'text-gray-600' : ''}>
                              {feature.replace('✅ ', '').replace('❌ ', '')}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Prorated Pricing Display */}
          {getProratedDetails() && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Prorated Upgrade Pricing (This Month Only)</h4>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Days Remaining in Cycle</div>
                    <div className="font-bold text-blue-900">{getProratedDetails()!.daysRemaining} of {getProratedDetails()!.daysInMonth} days</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Credit from {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}</div>
                    <div className="font-bold text-green-600">-R{getProratedDetails()!.credit.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">You Pay Today</div>
                    <div className="font-bold text-blue-900 text-xl">R{getProratedDetails()!.proratedPrice.toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2 border-t pt-2">
                  <strong>How it works:</strong> You've already paid R{getProratedDetails()!.fullPrice - getProratedDetails()!.proratedPrice + getProratedDetails()!.credit} for your {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} tier this month. 
                  We'll credit you R{getProratedDetails()!.credit.toLocaleString()} for the remaining {getProratedDetails()!.daysRemaining} days, 
                  and charge you only R{getProratedDetails()!.proratedPrice.toLocaleString()} to upgrade to {tiers[selectedTier].name} for the rest of this billing cycle. 
                  Next month, you'll pay the full R{getFullPrice().toLocaleString()}.
                </div>
              </div>
            </div>
          )}

          {/* Savings Display */}
          {selectedCycle === 'annual' && (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2">
                <TrendingDown className="w-5 h-5 text-green-600" />
                <span className="text-green-900 font-semibold">
                  Annual billing saves you R{getSavings().toLocaleString()} per year!
                </span>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Choose Payment Method
            </h3>

            <Tabs value={selectedPayment} onValueChange={(v) => setSelectedPayment(v as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="eft" className="flex flex-col items-center gap-1 py-3">
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs">Bank EFT</span>
                  <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700">
                    FREE
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="stitch" className="flex flex-col items-center gap-1 py-3">
                  <Zap className="w-5 h-5" />
                  <span className="text-xs">Instant Pay</span>
                  <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700">
                    R2 fee
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="payfast" className="flex flex-col items-center gap-1 py-3">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Card</span>
                  <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700">
                    2.9%
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex flex-col items-center gap-1 py-3">
                  <Clock className="w-5 h-5" />
                  <span className="text-xs">Contact Sales</span>
                  <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700">
                    Custom
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="eft" className="mt-6">
                <EFTPayment
                  amount={getCurrentPrice()}
                  tier={selectedTier}
                  cycle={selectedCycle}
                  userId={userId}
                  userEmail={userEmail}
                  userName={userName}
                  onSuccess={onUpgradeSuccess}
                />
              </TabsContent>

              <TabsContent value="stitch" className="mt-6">
                <StitchPayment
                  amount={getCurrentPrice()}
                  tier={selectedTier}
                  cycle={selectedCycle}
                  userId={userId}
                  userEmail={userEmail}
                  userName={userName}
                  onSuccess={onUpgradeSuccess}
                />
              </TabsContent>

              <TabsContent value="payfast" className="mt-6">
                <PayFastPayment
                  amount={getCurrentPrice()}
                  tier={selectedTier}
                  cycle={selectedCycle}
                  userId={userId}
                  userEmail={userEmail}
                  userName={userName}
                  onSuccess={onUpgradeSuccess}
                />
              </TabsContent>

              <TabsContent value="manual" className="mt-6">
                <ManualUpgrade
                  amount={getCurrentPrice()}
                  tier={selectedTier}
                  cycle={selectedCycle}
                  userId={userId}
                  userEmail={userEmail}
                  userName={userName}
                  onSuccess={() => {
                    toast.success('Sales team notified! We\'ll contact you within 24 hours.');
                    onClose();
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Feature Comparison Footer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-semibold">100% Accuracy</div>
                  <div className="text-gray-600 text-xs">Live supplier data from all 9 provinces</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-semibold">Under 5 Minutes</div>
                  <div className="text-gray-600 text-xs">Instant automated pricing</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-semibold">Full Compliance</div>
                  <div className="text-gray-600 text-xs">SANS 1200, NBR, BBBEE tracking</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}