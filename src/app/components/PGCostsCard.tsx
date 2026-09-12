import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Package, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import type { ComplianceCosts } from '@/utils/complianceCalculations';
import type { SubscriptionTier } from '@/utils/tierAccess';

interface PGCostsCardProps {
  complianceCosts: ComplianceCosts | null;
  grandTotal: number;
  showPGCosts: boolean;
  onToggle: () => void;
  contractorTier?: SubscriptionTier;
}

export function PGCostsCard({ complianceCosts, grandTotal, showPGCosts, onToggle, contractorTier = 'free' }: PGCostsCardProps) {
  if (!complianceCosts) {
    return null;
  }

  // Helper function to encrypt amounts for FREE tier
  const formatAmount = (amount: number) => {
    if (contractorTier === 'free') {
      return 'R ●●●●●●';
    }
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Helper function to encrypt percentages for FREE tier
  const formatPercentage = (value: number) => {
    if (contractorTier === 'free') {
      return '●●●%';
    }
    return `${value.toFixed(1)}%`;
  };

  return (
    <Card className="mt-4 border-2 border-amber-300">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Package className="w-5 h-5" />
              Preliminaries & General (P&G)
              {contractorTier === 'free' && <Lock className="w-4 h-4 text-amber-600" />}
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Project overhead costs - separate from regulatory compliance fees
              {contractorTier === 'free' && (
                <span className="block text-amber-700 font-semibold mt-1">
                  🔒 Locked in Training Mode
                </span>
              )}
            </CardDescription>
          </div>
          {!showPGCosts && (
            <div className="flex items-center gap-3 mr-3">
              <div className="text-right">
                <p className="text-xs text-amber-700 font-medium">Total P&G:</p>
                <p className="text-lg font-bold text-amber-600">
                  {formatAmount(complianceCosts.preliminaries.total)}
                </p>
                <p className="text-xs text-amber-600">
                  {formatPercentage((complianceCosts.preliminaries.total / grandTotal) * 100)}
                </p>
              </div>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (contractorTier !== 'free') {
                onToggle();
              }
            }}
            className={contractorTier === 'free' ? 'flex-shrink-0 opacity-50 cursor-not-allowed' : 'flex-shrink-0'}
            disabled={contractorTier === 'free'}
          >
            {showPGCosts ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
            {showPGCosts ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </CardHeader>
      {showPGCosts && (
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Summary */}
            <Card className="border-amber-200 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">P&G Summary</CardTitle>
                <CardDescription className="text-xs">
                  Project overhead costs (not compliance fees)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-bold text-amber-900">Total P&G:</span>
                    <span className="text-lg font-bold text-amber-600">
                      {formatAmount(complianceCosts.preliminaries.total)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Approx. {formatPercentage((complianceCosts.preliminaries.total / grandTotal) * 100)} of delivery total
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Breakdown */}
            <Card className="border-amber-200 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">P&G Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Site Establishment (2.5%):</span>
                    <span className="font-medium">
                      {formatAmount(complianceCosts.preliminaries.siteEstablishment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temporary Services (1.75%):</span>
                    <span className="font-medium">
                      {formatAmount(complianceCosts.preliminaries.temporaryServices)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time-Related (3.5%):</span>
                    <span className="font-medium">
                      {formatAmount(complianceCosts.preliminaries.timeRelated)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Health & Safety (0.75%):</span>
                    <span className="font-medium">
                      {formatAmount(complianceCosts.preliminaries.healthAndSafety)}
                    </span>
                  </div>
                  <div className="pt-2 border-t flex justify-between font-semibold text-amber-900">
                    <span>Total P&G:</span>
                    <span>
                      {formatAmount(complianceCosts.preliminaries.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Details */}
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-sm font-semibold mb-2 text-amber-900">What are Preliminaries & General (P&G)?</h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              P&G costs are <strong>project overhead expenses</strong> required to facilitate construction, 
              not regulatory compliance fees. These include site establishment, temporary services (water, electricity), 
              time-related costs (site management, security), and health & safety equipment.
            </p>
            <p className="text-xs text-gray-600 mt-2">
              <strong>Reference:</strong> ASAQS guidelines & JBCC Standard Conditions of Contract
            </p>
            <p className="text-xs text-amber-700 mt-2 font-medium">
              ℹ️ P&G costs are added to the Overall BOQ Total separately from Compliance Costs
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}