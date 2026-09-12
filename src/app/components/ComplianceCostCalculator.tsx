import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  TrendingUp,
  Download,
  Info
} from 'lucide-react';
import {
  calculateAllComplianceCosts,
  applyProvincialAdjustments,
  type ComplianceCosts,
  type ProjectParameters
} from '@/utils/complianceCalculations';
import type { SubscriptionTier } from '@/utils/tierAccess';

interface ComplianceCostCalculatorProps {
  projectParameters: ProjectParameters;
  onCostsCalculated?: (costs: ComplianceCosts) => void;
  contractorTier?: SubscriptionTier;
}

export function ComplianceCostCalculator({ 
  projectParameters,
  onCostsCalculated,
  contractorTier = 'free'
}: ComplianceCostCalculatorProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // ✅ NEW: Check if user is on FREE tier
  const isFreeTier = contractorTier === 'free';
  
  // Calculate compliance costs (memoized to prevent recalculation on every render)
  const costs = useMemo(() => {
    const baseCosts = calculateAllComplianceCosts(projectParameters);
    return applyProvincialAdjustments(baseCosts, projectParameters.province);
  }, [projectParameters]);

  // Notify parent component when costs change
  useEffect(() => {
    if (onCostsCalculated) {
      onCostsCalculated(costs);
    }
  }, [costs, onCostsCalculated]);

  const formatCurrency = (amount: number) => {
    // ✅ NEW: Encrypt for FREE tier
    if (isFreeTier) return 'R ●●●●●●';
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercentage = (percentage: number) => {
    // ✅ NEW: Encrypt for FREE tier
    if (isFreeTier) return '●●●%';
    return `${percentage.toFixed(2)}%`;
  };

  const totalPercentage = (costs.total / projectParameters.projectValue) * 100;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-[#00b4d8] border-2 bg-gradient-to-r from-[#00b4d8]/5 to-[#0077b6]/5">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#00b4d8]" />
                Compliance Cost Calculator
              </CardTitle>
              <CardDescription className="mt-0.5 text-[10px]">
                Automated calculation of mandatory SA construction compliance costs
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-white text-[10px] px-2 py-0.5">
              <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
              85-95%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div className="bg-white p-2.5 rounded-lg border">
              <p className="text-[10px] text-gray-600">Total Compliance Costs</p>
              <p className="text-xl font-bold text-[#00b4d8]">{formatCurrency(costs.total)}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">
                {formatPercentage(totalPercentage)} of project value
              </p>
            </div>
            <div className="bg-white p-2.5 rounded-lg border">
              <p className="text-[10px] text-gray-600">Project Value</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(projectParameters.projectValue)}
              </p>
              <p className="text-[9px] text-gray-500 mt-0.5">
                {projectParameters.numberOfUnits ? `${projectParameters.numberOfUnits} units` : 'Commercial project'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CIDB Compliance Warning */}
      {!costs.cidb.isCompliant && (
        <Card className="border-red-500 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              CIDB Compliance Warning
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1.5">
              {costs.cidb.warnings.map((warning, idx) => (
                <p key={idx} className="text-xs text-red-600">
                  {warning}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Breakdown Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* NHBRC */}
        <Card className="col-span-1">
          <CardHeader className="pb-1.5 pt-2.5 px-2.5">
            <CardTitle className="text-[10px] font-medium flex items-center justify-between">
              <span>NHBRC</span>
              <CheckCircle className="h-2.5 w-2.5 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2.5 pb-2.5 pt-0">
            <p className="text-sm font-bold text-[#00b4d8]">{formatCurrency(costs.nhbrc.total)}</p>
            <div className="mt-1.5 space-y-0.5 text-[9px] text-gray-600">
              <div className="flex justify-between">
                <span>Enrollment:</span>
                <span className="font-medium">{formatCurrency(costs.nhbrc.enrollmentFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Inspections:</span>
                <span className="font-medium">{formatCurrency(costs.nhbrc.inspectionFees)}</span>
              </div>
              <div className="flex justify-between">
                <span>Insurance:</span>
                <span className="font-medium">{formatCurrency(costs.nhbrc.defectsInsurance)}</span>
              </div>
            </div>
            <p className="text-[8px] text-gray-500 mt-1 leading-tight">
              Housing Consumers Protection
            </p>
          </CardContent>
        </Card>

        {/* CIDB */}
        <Card className="col-span-1">
          <CardHeader className="pb-1.5 pt-2.5 px-2.5">
            <CardTitle className="text-[10px] font-medium flex items-center justify-between">
              <span>CIDB</span>
              {costs.cidb.isCompliant ? (
                <CheckCircle className="h-2.5 w-2.5 text-green-600" />
              ) : (
                <AlertTriangle className="h-2.5 w-2.5 text-red-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2.5 pb-2.5 pt-0">
            <p className="text-sm font-bold text-[#00b4d8]">{formatCurrency(costs.cidb.total)}</p>
            <div className="mt-1.5 space-y-0.5 text-[9px] text-gray-600">
              <div className="flex justify-between">
                <span>Grade:</span>
                <span className="font-medium">{costs.cidb.requiredGrade}</span>
              </div>
              <div className="flex justify-between">
                <span>Registration:</span>
                <span className="font-medium">{formatCurrency(costs.cidb.registrationFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Annual:</span>
                <span className="font-medium">{formatCurrency(costs.cidb.annualFee)}</span>
              </div>
            </div>
            <p className="text-[8px] text-gray-500 mt-1 leading-tight">
              CIDB Act 38 of 2000
            </p>
          </CardContent>
        </Card>

        {/* Statutory Labour */}
        <Card className="col-span-1">
          <CardHeader className="pb-1.5 pt-2.5 px-2.5">
            <CardTitle className="text-[10px] font-medium flex items-center justify-between">
              <span>Labour</span>
              <CheckCircle className="h-2.5 w-2.5 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2.5 pb-2.5 pt-0">
            <p className="text-sm font-bold text-[#00b4d8]">{formatCurrency(costs.statutory.total)}</p>
            <div className="mt-1.5 space-y-0.5 text-[9px] text-gray-600">
              <div className="flex justify-between">
                <span>UIF:</span>
                <span className="font-medium">{formatCurrency(costs.statutory.uif)}</span>
              </div>
              <div className="flex justify-between">
                <span>SDL:</span>
                <span className="font-medium">{formatCurrency(costs.statutory.sdl)}</span>
              </div>
              <div className="flex justify-between">
                <span>COIDA:</span>
                <span className="font-medium">{formatCurrency(costs.statutory.coida)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pension:</span>
                <span className="font-medium">{formatCurrency(costs.statutory.pensionFund)}</span>
              </div>
            </div>
            <p className="text-[8px] text-gray-500 mt-1 leading-tight">
              {formatPercentage(costs.statutory.percentageOfLabour)} of labour
            </p>
          </CardContent>
        </Card>

        {/* Quality Testing */}
        <Card className="col-span-1">
          <CardHeader className="pb-1.5 pt-2.5 px-2.5">
            <CardTitle className="text-[10px] font-medium flex items-center justify-between">
              <span>Testing</span>
              <CheckCircle className="h-2.5 w-2.5 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2.5 pb-2.5 pt-0">
            <p className="text-sm font-bold text-[#00b4d8]">{formatCurrency(costs.testing.total)}</p>
            <div className="mt-1.5 space-y-0.5 text-[9px] text-gray-600">
              <div className="flex justify-between">
                <span>Concrete:</span>
                <span className="font-medium">{formatCurrency(costs.testing.concreteTests)}</span>
              </div>
              <div className="flex justify-between">
                <span>Soil:</span>
                <span className="font-medium">{formatCurrency(costs.testing.soilTests)}</span>
              </div>
              <div className="flex justify-between">
                <span>Bricks:</span>
                <span className="font-medium">{formatCurrency(costs.testing.brickTests)}</span>
              </div>
              <div className="flex justify-between">
                <span>Geotech:</span>
                <span className="font-medium">{formatCurrency(costs.testing.geotechnical)}</span>
              </div>
            </div>
            <p className="text-[8px] text-gray-500 mt-1 leading-tight">
              SANS 2001, 227, 634
            </p>
          </CardContent>
        </Card>

        {/* BBBEE */}
        <Card className="col-span-1">
          <CardHeader className="pb-1.5 pt-2.5 px-2.5">
            <CardTitle className="text-[10px] font-medium flex items-center justify-between">
              <span>BBBEE</span>
              <CheckCircle className="h-2.5 w-2.5 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2.5 pb-2.5 pt-0">
            <p className="text-sm font-bold text-[#00b4d8]">{formatCurrency(costs.bbbee.total)}</p>
            <div className="mt-1.5 space-y-0.5 text-[9px] text-gray-600">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium">{costs.bbbee.verificationType}</span>
              </div>
              <div className="flex justify-between">
                <span>Verify:</span>
                <span className="font-medium">{formatCurrency(costs.bbbee.verificationFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Consult:</span>
                <span className="font-medium">{formatCurrency(costs.bbbee.consultantFees)}</span>
              </div>
            </div>
            <p className="text-[8px] text-gray-500 mt-1 leading-tight">
              BBBEE Act 53 of 2003
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Toggle Details Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="gap-2 text-xs"
        >
          <FileText className="h-3 w-3" />
          {showDetails ? 'Hide' : 'Show'} Detailed Breakdown
        </Button>
      </div>

      {/* Detailed Breakdown */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detailed Compliance Cost Breakdown
            </CardTitle>
            <CardDescription>
              Itemized costs with regulatory references
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Testing Schedule */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-[#00b4d8]" />
                  Quality Testing Schedule
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2 border">Test Type</th>
                        <th className="text-left p-2 border">Standard</th>
                        <th className="text-left p-2 border">Frequency</th>
                        <th className="text-right p-2 border">Tests</th>
                        <th className="text-right p-2 border">Cost/Test</th>
                        <th className="text-right p-2 border">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costs.testing.testingSchedule.map((test, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 border">{test.testType}</td>
                          <td className="p-2 border font-mono text-xs">{test.standard}</td>
                          <td className="p-2 border text-xs">{test.frequency}</td>
                          <td className="p-2 border text-right">{test.estimatedTests}</td>
                          <td className="p-2 border text-right">{formatCurrency(test.costPerTest)}</td>
                          <td className="p-2 border text-right font-medium">{formatCurrency(test.totalCost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Complete Cost Breakdown */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-[#00b4d8]" />
                  Complete Cost Breakdown with Regulations
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2 border">Category</th>
                        <th className="text-left p-2 border">Item</th>
                        <th className="text-right p-2 border">Amount</th>
                        <th className="text-right p-2 border">% of Project</th>
                        <th className="text-left p-2 border">Regulation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costs.breakdown.map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-2 border font-medium">{item.category}</td>
                          <td className="p-2 border">{item.subcategory}</td>
                          <td className="p-2 border text-right font-medium">{formatCurrency(item.amount)}</td>
                          <td className="p-2 border text-right">{formatPercentage(item.percentage)}</td>
                          <td className="p-2 border text-xs text-gray-600">{item.regulation}</td>
                        </tr>
                      ))}
                      <tr className="bg-[#00b4d8]/10 font-bold">
                        <td className="p-2 border" colSpan={2}>TOTAL COMPLIANCE COSTS</td>
                        <td className="p-2 border text-right">{formatCurrency(costs.total)}</td>
                        <td className="p-2 border text-right">{formatPercentage(totalPercentage)}</td>
                        <td className="p-2 border"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Sources */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-semibold mb-2 text-sm">Data Sources & Accuracy</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✓ NHBRC: Official fee schedules (2024/2025)</li>
                  <li>✓ CIDB: Contractor grading matrix (public domain)</li>
                  <li>✓ Department of Labour: Statutory contribution rates (UIF, SDL, COIDA)</li>
                  <li>✓ SABS/Testing Labs: Industry-standard testing rates</li>
                  <li>✓ SANAS: BBBEE verification agency fees (2024)</li>
                  <li>✓ ASAQS: Preliminaries guidelines</li>
                  <li>✓ Provincial adjustments: Based on regional cost variations</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2 italic">
                  Accuracy: 85-95% (sufficient for tender budgeting). Fee schedules updated quarterly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Button */}
      <div className="flex justify-end">
        <Button 
          className="gap-2"
          onClick={() => {
            // TODO: Implement PDF export
            alert('PDF export feature coming soon');
          }}
        >
          <Download className="h-4 w-4" />
          Export Compliance Report (PDF)
        </Button>
      </div>
    </div>
  );
}