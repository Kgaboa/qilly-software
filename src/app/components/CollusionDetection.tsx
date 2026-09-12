import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, BarChart3, Info, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import type { RegionalPricedBillItem } from '@/utils/regionalPricingEngine';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

interface CollusionDetectionProps {
  pricedItems: RegionalPricedBillItem[];
  grandTotal: number;
  overallBOQTotal: number;
  projectSettings?: {
    province?: string;
    municipality?: string;
  };
}

interface MockSubmission {
  contractor: string;
  cidbGrade: string;
  totalPrice: number;
  deviation: number;
  similarityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  flags: string[];
}

export function CollusionDetection({
  pricedItems,
  grandTotal,
  overallBOQTotal,
  projectSettings
}: CollusionDetectionProps) {
  const [analysisRun, setAnalysisRun] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // COLLAPSED BY DEFAULT

  // Generate mock comparative submissions based on current BOQ
  const mockSubmissions = useMemo((): MockSubmission[] => {
    const marketAverage = overallBOQTotal;
    
    return [
      {
        contractor: 'Your Submission (Qilly)',
        cidbGrade: 'GB3',
        totalPrice: overallBOQTotal,
        deviation: 0,
        similarityScore: 100,
        riskLevel: 'low' as const,
        flags: ['✅ Baseline submission']
      },
      {
        contractor: 'BuildCo Construction (Pty) Ltd',
        cidbGrade: 'GB4',
        totalPrice: marketAverage * 0.98,
        deviation: -2.0,
        similarityScore: 23,
        riskLevel: 'low' as const,
        flags: ['✅ Normal variance', '✅ Different suppliers']
      },
      {
        contractor: 'Solid Foundations JV',
        cidbGrade: 'GB3',
        totalPrice: marketAverage * 1.03,
        deviation: 3.0,
        similarityScore: 19,
        riskLevel: 'low' as const,
        flags: ['✅ Regional pricing differences']
      },
      {
        contractor: 'Supreme Builders CC',
        cidbGrade: 'GB2',
        totalPrice: marketAverage * 0.999,
        deviation: -0.1,
        similarityScore: 87,
        riskLevel: 'high' as const,
        flags: [
          '⚠️ 87% price similarity (>80% threshold)',
          '⚠️ Identical unit prices on 12 items',
          '⚠️ Same transport costs pattern',
          '🚨 POSSIBLE COLLUSION'
        ]
      },
      {
        contractor: 'Premier Construction Group',
        cidbGrade: 'GB3',
        totalPrice: marketAverage * 1.15,
        deviation: 15.0,
        similarityScore: 31,
        riskLevel: 'low' as const,
        flags: ['✅ Premium supplier selection', '✅ Higher grade materials']
      },
      {
        contractor: 'Metro Build Solutions',
        cidbGrade: 'GB3',
        totalPrice: marketAverage * 0.9995,
        deviation: -0.05,
        similarityScore: 91,
        riskLevel: 'high' as const,
        flags: [
          '⚠️ 91% price similarity (>80% threshold)',
          '⚠️ Nearly identical BOQ structure',
          '⚠️ Matching rounding patterns',
          '🚨 POSSIBLE COLLUSION'
        ]
      },
      {
        contractor: 'Heritage Contractors',
        cidbGrade: 'GB4',
        totalPrice: marketAverage * 1.07,
        deviation: 7.0,
        similarityScore: 28,
        riskLevel: 'low' as const,
        flags: ['✅ Different supplier network']
      },
      {
        contractor: 'Elite Development Corp',
        cidbGrade: 'GB3',
        totalPrice: marketAverage * 0.95,
        deviation: -5.0,
        similarityScore: 42,
        riskLevel: 'medium' as const,
        flags: [
          '⚠️ 42% similarity (borderline)',
          '✅ Some common suppliers (normal for region)',
          'ℹ️ Monitor for patterns'
        ]
      }
    ];
  }, [overallBOQTotal]);

  const analysis = useMemo(() => {
    const highRiskCount = mockSubmissions.filter(s => s.riskLevel === 'high').length;
    const mediumRiskCount = mockSubmissions.filter(s => s.riskLevel === 'medium').length;
    const avgDeviation = mockSubmissions.reduce((sum, s) => sum + Math.abs(s.deviation), 0) / mockSubmissions.length;
    const avgSimilarity = mockSubmissions.filter(s => s.contractor !== 'Your Submission (Qilly)').reduce((sum, s) => sum + s.similarityScore, 0) / (mockSubmissions.length - 1);
    
    return {
      totalSubmissions: mockSubmissions.length,
      highRiskCount,
      mediumRiskCount,
      avgDeviation: avgDeviation.toFixed(2),
      avgSimilarity: avgSimilarity.toFixed(1),
      marketAverage: overallBOQTotal,
      priceRange: {
        min: Math.min(...mockSubmissions.map(s => s.totalPrice)),
        max: Math.max(...mockSubmissions.map(s => s.totalPrice))
      }
    };
  }, [mockSubmissions, overallBOQTotal]);

  const handleRunAnalysis = async () => {
    setAnalysisRun(true);
  };

  return (
    <Card className="border border-orange-300 bg-gradient-to-br from-orange-50 to-red-50">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-orange-900 text-sm">
              <Shield className="w-4 h-4" />
              Collusion Detection: Multi-Submission Analysis
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              Statistical validation against tender submissions to identify price manipulation
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-orange-600 text-white border-orange-700 px-2 py-0.5 text-[9px]">
              <Shield className="w-3 h-3 mr-1" />
              Anti-Fraud
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-orange-700 hover:text-orange-900 h-7"
            >
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
      <CardContent className="pt-2">
        {!analysisRun ? (
          <div>
            {/* Feature Overview */}
            <div className="bg-white border border-orange-200 rounded p-2 mb-3">
              <h4 className="text-xs font-bold text-orange-900 mb-2">🔍 How Collusion Detection Works:</h4>
              <div className="space-y-1 text-xs text-gray-700">
                <div className="flex items-start gap-1">
                  <span className="text-orange-600 font-bold text-[10px]">1.</span>
                  <div>
                    <strong>Price Similarity:</strong> Detects suspiciously similar pricing (&gt;80% threshold)
                  </div>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-orange-600 font-bold text-[10px]">2.</span>
                  <div>
                    <strong>Outlier Detection:</strong> Identifies abnormal market deviations
                  </div>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-orange-600 font-bold text-[10px]">3.</span>
                  <div>
                    <strong>Pattern Recognition:</strong> Detects matching unit prices & supplier overlap
                  </div>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-orange-600 font-bold text-[10px]">4.</span>
                  <div>
                    <strong>Risk Scoring:</strong> Flags high-risk submissions for tender authority review (compliance with Competition Act 89 of 1998)
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4 mb-4 border border-orange-300">
              <h4 className="text-sm font-bold text-orange-900 mb-2">✅ Benefits for Tender Authorities & Contractors:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-orange-800">
                <div className="flex items-start gap-1">
                  <span className="text-orange-600">•</span>
                  <span><strong>Protect Public Funds:</strong> Detect cartel behavior before award</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-orange-600">•</span>
                  <span><strong>Level Playing Field:</strong> Fair competition for all contractors</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-orange-600">•</span>
                  <span><strong>Legal Compliance:</strong> Competition Act 89 of 1998 enforcement</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-orange-600">•</span>
                  <span><strong>Audit Trail:</strong> Full transparency for investigations</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-orange-600">•</span>
                  <span><strong>Save 15-30%:</strong> Eliminate inflated collusive pricing</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-orange-600">•</span>
                  <span><strong>Instant Analysis:</strong> Real-time detection vs manual review (weeks)</span>
                </div>
              </div>
            </div>

            {/* eTender Integration Note */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-orange-800">
                <strong className="text-orange-900">🔗 eTender Integration Required:</strong> This analysis requires access to:
              </p>
              <ul className="text-xs text-orange-700 mt-2 space-y-1 ml-4">
                <li>• Anonymized submission data from eTender portal (after tender closing)</li>
                <li>• Industry benchmarks & regional pricing databases</li>
                <li>• Historical tender patterns for this municipality/province</li>
                <li>• Competition Commission watchlist (known cartel participants)</li>
              </ul>
              <p className="text-xs text-orange-800 mt-2">
                <strong>Privacy:</strong> Individual contractor identities are protected. Only tender authorities see flagged submissions.
              </p>
            </div>

            {/* Run Analysis Button */}
            <Button
              onClick={handleRunAnalysis}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Run Collusion Detection Analysis (Demo with Mock Data)
            </Button>
          </div>
        ) : (
          <div>
            {/* Analysis Summary */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{analysis.totalSubmissions}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 border-2 border-red-300">
                <p className="text-xs text-red-700">High Risk (Flagged)</p>
                <p className="text-2xl font-bold text-red-600">{analysis.highRiskCount}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                <p className="text-xs text-orange-700">Medium Risk</p>
                <p className="text-2xl font-bold text-orange-600">{analysis.mediumRiskCount}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-xs text-green-700">Avg Similarity</p>
                <p className="text-2xl font-bold text-green-600">{analysis.avgSimilarity}%</p>
              </div>
            </div>

            {/* Risk Alert */}
            {analysis.highRiskCount > 0 && (
              <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-red-900 text-sm">⚠️ COLLUSION RISK DETECTED</h4>
                    <p className="text-sm text-red-800 mt-1">
                      {analysis.highRiskCount} submission(s) show suspicious pricing patterns consistent with possible bid rigging or price fixing.
                    </p>
                    <p className="text-xs text-red-700 mt-2">
                      <strong>Action Required:</strong> Tender authority should investigate flagged submissions. Refer to Competition Commission if collusion is confirmed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Market Analysis */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <h4 className="text-sm font-bold text-blue-900 mb-2">📊 Market Benchmark Analysis</h4>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-blue-700">Market Average:</span>
                  <p className="font-bold text-blue-900">R{analysis.marketAverage.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}</p>
                </div>
                <div>
                  <span className="text-blue-700">Price Range:</span>
                  <p className="font-bold text-blue-900">
                    R{analysis.priceRange.min.toLocaleString('en-ZA', { minimumFractionDigits: 0 })} - 
                    R{analysis.priceRange.max.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <span className="text-blue-700">Avg Deviation:</span>
                  <p className="font-bold text-blue-900">{analysis.avgDeviation}%</p>
                </div>
              </div>
            </div>

            {/* Toggle Details */}
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-gray-900">Submission Comparison Table</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    Show Details
                  </>
                )}
              </Button>
            </div>

            {/* Submissions Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="font-bold">Contractor</TableHead>
                    <TableHead className="font-bold">CIDB</TableHead>
                    <TableHead className="font-bold text-right">Total Price</TableHead>
                    <TableHead className="font-bold text-right">Deviation</TableHead>
                    <TableHead className="font-bold text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="flex items-center gap-1">
                              Similarity
                              <Info className="w-3 h-3" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">
                              Price similarity score vs your submission. &gt;80% triggers collusion alert.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead className="font-bold">Risk</TableHead>
                    {showDetails && <TableHead className="font-bold">Analysis Flags</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSubmissions.map((submission, index) => (
                    <TableRow 
                      key={index}
                      className={
                        submission.riskLevel === 'high' ? 'bg-red-50 border-l-4 border-red-500' :
                        submission.riskLevel === 'medium' ? 'bg-orange-50 border-l-4 border-orange-400' :
                        submission.contractor.includes('Your Submission') ? 'bg-blue-50 border-l-4 border-blue-500' :
                        ''
                      }
                    >
                      <TableCell className="font-medium text-sm">
                        {submission.contractor}
                        {submission.contractor.includes('Your Submission') && (
                          <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-700 border-blue-300 text-xs">
                            You
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{submission.cidbGrade}</TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        R{submission.totalPrice.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        <span className={submission.deviation > 0 ? 'text-red-600' : 'text-green-600'}>
                          {submission.deviation > 0 ? '+' : ''}{submission.deviation.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        <span className={submission.similarityScore > 80 ? 'text-red-600 font-bold' : 'text-gray-900'}>
                          {submission.similarityScore}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {submission.riskLevel === 'high' && (
                          <Badge className="bg-red-600 text-white">HIGH RISK</Badge>
                        )}
                        {submission.riskLevel === 'medium' && (
                          <Badge className="bg-orange-500 text-white">MEDIUM</Badge>
                        )}
                        {submission.riskLevel === 'low' && (
                          <Badge className="bg-green-600 text-white">LOW</Badge>
                        )}
                      </TableCell>
                      {showDetails && (
                        <TableCell>
                          <div className="space-y-1">
                            {submission.flags.map((flag, i) => (
                              <div key={i} className="text-xs">
                                {flag}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Recommendation */}
            <div className="mt-4 bg-gray-50 border border-gray-300 rounded-lg p-3">
              <h4 className="text-sm font-bold text-gray-900 mb-2">📋 Tender Authority Recommendations:</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• <strong>Investigate:</strong> Review detailed BOQs of flagged high-risk submissions for identical pricing patterns</li>
                <li>• <strong>Interview:</strong> Request supplier invoices and quotations from contractors with &gt;80% similarity scores</li>
                <li>• <strong>Cross-Reference:</strong> Check if flagged contractors share directors, addresses, or bank accounts</li>
                <li>• <strong>Report:</strong> If collusion is confirmed, report to Competition Commission (penalties up to 10% of annual turnover)</li>
                <li>• <strong>Award Fairly:</strong> Consider disqualifying collusive bids and awarding to legitimate submissions</li>
              </ul>
            </div>

            {/* Reset Analysis */}
            <Button
              onClick={() => setAnalysisRun(false)}
              variant="outline"
              className="w-full mt-4 border-orange-400 text-orange-700 hover:bg-orange-50"
            >
              Run New Analysis
            </Button>
          </div>
        )}
      </CardContent>
      )}
    </Card>
  );
}