import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { 
  Building2, 
  CreditCard, 
  Smartphone, 
  Landmark,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Zap,
  Shield,
  Clock,
  DollarSign
} from 'lucide-react';

export function PaymentMethodComparison() {
  const [customers, setCustomers] = useState(100);
  const [avgTransaction, setAvgTransaction] = useState(1999);
  const [transactionsPerYear, setTransactionsPerYear] = useState(12);

  const methods = [
    {
      name: 'Bank EFT (Manual)',
      icon: Building2,
      fee: 0,
      type: 'flat',
      setupTime: '1 day',
      setupCost: 0,
      pros: ['Zero fees', 'Government preferred', 'Audit trail', 'POPIA compliant'],
      cons: ['1-2 day delay', 'Manual reconciliation', 'Requires unique reference'],
      dhs: 5,
      color: 'bg-green-500',
      recommended: true
    },
    {
      name: 'Stitch Open Banking',
      icon: Zap,
      fee: 2,
      type: 'flat',
      setupTime: '3 days',
      setupCost: 0,
      pros: ['R2 flat fee', 'Instant confirmation', 'SA company', 'No card needed'],
      cons: ['Requires internet banking', 'Bank login needed'],
      dhs: 5,
      color: 'bg-blue-500',
      recommended: true
    },
    {
      name: 'Debit Orders',
      icon: Landmark,
      fee: 1,
      type: 'percentage',
      setupTime: '2 weeks',
      setupCost: 500,
      pros: ['Automatic renewals', '3x cheaper than PayFast', 'High success rate'],
      cons: ['Requires mandate', 'Can be disputed', '2-week approval'],
      dhs: 5,
      color: 'bg-purple-500',
      recommended: true
    },
    {
      name: 'SnapScan/Zapper',
      icon: Smartphone,
      fee: 2.5,
      type: 'percentage',
      setupTime: '1 day',
      setupCost: 0,
      pros: ['Mobile-first', 'QR code', 'Instant', 'No hardware'],
      cons: ['2.5% fee', 'Limited to mobile', 'Not for large amounts'],
      dhs: 3,
      color: 'bg-orange-500',
      recommended: false
    },
    {
      name: 'PayFast',
      icon: CreditCard,
      fee: 2.9,
      type: 'percentage',
      additionalFee: 2,
      setupTime: '1 week',
      setupCost: 0,
      pros: ['Cards accepted', 'International', 'Subscription management'],
      cons: ['Highest fees', '2.9% + R2', 'Longer payouts'],
      dhs: 4,
      color: 'bg-red-500',
      recommended: false
    },
  ];

  const calculateCosts = (method: typeof methods[0]) => {
    const totalTransactions = customers * transactionsPerYear;
    const totalRevenue = totalTransactions * avgTransaction;

    let fees = 0;
    if (method.type === 'flat') {
      fees = totalTransactions * method.fee;
    } else {
      fees = (totalRevenue * method.fee / 100) + (method.additionalFee ? totalTransactions * method.additionalFee : 0);
    }

    const netRevenue = totalRevenue - fees - method.setupCost;
    const feePercentage = (fees / totalRevenue) * 100;

    return {
      totalRevenue,
      fees,
      netRevenue,
      feePercentage,
      setupCost: method.setupCost
    };
  };

  const payfastCosts = calculateCosts(methods.find(m => m.name === 'PayFast')!);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            Payment Method Cost Comparison
          </CardTitle>
          <CardDescription>
            Compare transaction fees and find the most cost-effective solution for Qilly
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Calculator Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label>Number of Customers</Label>
              <Input
                type="number"
                value={customers}
                onChange={(e) => setCustomers(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Avg Transaction Amount (R)</Label>
              <Input
                type="number"
                value={avgTransaction}
                onChange={(e) => setAvgTransaction(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Transactions per Year</Label>
              <Input
                type="number"
                value={transactionsPerYear}
                onChange={(e) => setTransactionsPerYear(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Annual Revenue</div>
              <div className="text-2xl font-bold text-blue-600">
                R{((customers * transactionsPerYear * avgTransaction) / 1000000).toFixed(2)}M
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Transactions</div>
              <div className="text-2xl font-bold text-green-600">
                {(customers * transactionsPerYear).toLocaleString()}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Avg Transaction</div>
              <div className="text-2xl font-bold text-purple-600">
                R{avgTransaction.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Method Comparison */}
          <div className="space-y-4">
            {methods.map((method) => {
              const costs = calculateCosts(method);
              const savings = payfastCosts.fees - costs.fees;
              const savingsPercentage = ((savings / payfastCosts.fees) * 100);

              return (
                <Card key={method.name} className={method.recommended ? 'border-2 border-green-500' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${method.color} bg-opacity-10`}>
                          <method.icon className={`w-6 h-6 ${method.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            {method.name}
                            {method.recommended && (
                              <Badge className="bg-green-500 text-white">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Recommended
                              </Badge>
                            )}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-600">
                              {method.type === 'flat' ? `R${method.fee} per transaction` : `${method.fee}%${method.additionalFee ? ' + R' + method.additionalFee : ''}`}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {method.setupTime}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-sm flex items-center gap-1">
                              {'⭐'.repeat(method.dhs)}
                              <span className="text-xs text-gray-500">DHS Score</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          R{(costs.fees / 1000).toFixed(1)}K
                        </div>
                        <div className="text-xs text-gray-500">annual fees</div>
                        {savings > 0 && (
                          <Badge className="mt-2 bg-green-100 text-green-700">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            Save R{(savings / 1000).toFixed(1)}K ({savingsPercentage.toFixed(0)}%)
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg text-sm">
                      <div>
                        <div className="text-gray-600 text-xs mb-1">Setup Cost</div>
                        <div className="font-semibold">R{costs.setupCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs mb-1">Annual Fees</div>
                        <div className="font-semibold text-red-600">-R{(costs.fees / 1000).toFixed(1)}K</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs mb-1">Fee %</div>
                        <div className="font-semibold">{costs.feePercentage.toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs mb-1">Net Revenue</div>
                        <div className="font-semibold text-green-600">R{(costs.netRevenue / 1000000).toFixed(2)}M</div>
                      </div>
                    </div>

                    {/* Pros & Cons */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Pros
                        </h4>
                        <ul className="space-y-1">
                          {method.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span className="text-gray-700">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          Cons
                        </h4>
                        <ul className="space-y-1">
                          {method.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-orange-600 mt-0.5">⚠</span>
                              <span className="text-gray-700">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* DHS Impact Analysis */}
          <Card className="mt-6 border-2 border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Impact on DHS Proposal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-green-900 mb-2">Cost Savings Analysis</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Using PayFast Only:</div>
                      <div className="text-xl font-bold text-red-600">
                        R{(payfastCosts.fees / 1000).toFixed(1)}K/year in fees
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Using Bank EFT (80%) + Stitch (20%):</div>
                      <div className="text-xl font-bold text-green-600">
                        R{((customers * transactionsPerYear * 0.2 * 2) / 1000).toFixed(1)}K/year in fees
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white rounded border-2 border-green-300">
                    <div className="text-sm text-gray-700 mb-1">5-Year Savings:</div>
                    <div className="text-3xl font-bold text-green-600">
                      R{((payfastCosts.fees * 5 - (customers * transactionsPerYear * 0.2 * 2 * 5)) / 1000000).toFixed(2)}M
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      = {Math.floor((payfastCosts.fees * 5 - (customers * transactionsPerYear * 0.2 * 2 * 5)) / 90000)} additional houses @ R90K each
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-900 mb-2">Recommended Strategy for DHS</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      <strong>Primary: Bank EFT (FREE)</strong>
                      <p className="ml-6 text-gray-700">For government departments and large enterprises. Zero fees show fiscal responsibility.</p>
                    </li>
                    <li>
                      <strong>Secondary: Stitch Open Banking (R2)</strong>
                      <p className="ml-6 text-gray-700">For customers wanting instant confirmation. 97% cheaper than PayFast.</p>
                    </li>
                    <li>
                      <strong>Recurring: Debit Orders (1%)</strong>
                      <p className="ml-6 text-gray-700">For automated monthly collections. 66% cheaper than PayFast.</p>
                    </li>
                    <li>
                      <strong>Fallback: PayFast (2.9%)</strong>
                      <p className="ml-6 text-gray-700">For customers who prefer credit cards or international payments.</p>
                    </li>
                  </ol>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-bold text-purple-900 mb-2">DHS Evaluation Impact</h3>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="bg-white p-3 rounded">
                      <div className="font-semibold text-purple-700">Cost Optimization</div>
                      <div className="text-2xl font-bold">⭐⭐⭐⭐⭐</div>
                      <div className="text-xs text-gray-600">Maximizes taxpayer value</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-semibold text-purple-700">BBBEE Alignment</div>
                      <div className="text-2xl font-bold">⭐⭐⭐⭐⭐</div>
                      <div className="text-xs text-gray-600">Supports SA companies</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-semibold text-purple-700">Innovation</div>
                      <div className="text-2xl font-bold">⭐⭐⭐⭐⭐</div>
                      <div className="text-xs text-gray-600">Modern payment tech</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
