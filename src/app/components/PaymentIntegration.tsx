/**
 * Payment Integration Component
 * Admin interface for testing payment gateways and managing subscriptions
 */

import { useState } from 'react';
import {
  PAYMENT_GATEWAYS,
  SUBSCRIPTION_PLANS,
  processPayment,
  activateSubscription,
  type PaymentGateway,
  type SubscriptionPlan,
} from '../../utils/payments/payment-processor';

export function PaymentIntegration() {
  const [activeTab, setActiveTab] = useState<'gateways' | 'plans' | 'test-payment'>('gateways');
  
  // Test payment state
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('starter');
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('payfast');
  const [testUserId, setTestUserId] = useState('test-user-123');
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const handleTestPayment = async () => {
    setProcessing(true);
    setPaymentResult(null);

    const plan = SUBSCRIPTION_PLANS[selectedPlan];
    
    try {
      const result = await processPayment({
        userId: testUserId,
        plan: selectedPlan,
        gateway: selectedGateway,
        amount: plan.price,
        currency: plan.currency,
        returnUrl: window.location.href + '?payment=success',
        cancelUrl: window.location.href + '?payment=cancelled',
        metadata: {
          planName: plan.name,
          testMode: true,
        },
      });

      setPaymentResult(result);

      // Auto-activate for manual EFT (in real app, would require verification)
      if (result.success && result.subscriptionId && selectedGateway === 'manual-eft') {
        setTimeout(async () => {
          await activateSubscription(result.subscriptionId!, 'MANUAL-EFT-TEST-' + Date.now());
          setPaymentResult({
            ...result,
            activated: true,
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentResult({
        success: false,
        error: 'Payment processing failed',
      });
    }

    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Integration</h2>
        <p className="text-gray-600">
          Manage payment gateways and test subscription processing
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('gateways')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'gateways'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          💳 Payment Gateways
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'plans'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          📦 Subscription Plans
        </button>
        <button
          onClick={() => setActiveTab('test-payment')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'test-payment'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          🧪 Test Payment
        </button>
      </div>

      {/* Payment Gateways Tab */}
      {activeTab === 'gateways' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🇿🇦 South African Payment Gateways</h4>
            <p className="text-sm text-blue-800">
              Qilly supports multiple payment gateways optimized for South African businesses.
              All gateways are in test mode for development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(PAYMENT_GATEWAYS).map(gateway => (
              <div
                key={gateway.id}
                className={`border-2 rounded-lg p-6 ${
                  gateway.isActive
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{gateway.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{gateway.description}</p>
                  </div>
                  {gateway.isActive ? (
                    <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
                      ✓ ACTIVE
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-400 text-white rounded-full text-xs font-semibold">
                      INACTIVE
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Transaction Fee</div>
                      <div className="font-semibold">{gateway.transactionFee}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Monthly Fee</div>
                      <div className="font-semibold">{gateway.monthlyFee}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Setup Complexity</div>
                    <div className="flex gap-1">
                      {[1, 2, 3].map(level => (
                        <div
                          key={level}
                          className={`h-2 w-full rounded ${
                            level <= (gateway.setupComplexity === 'easy' ? 1 : gateway.setupComplexity === 'medium' ? 2 : 3)
                              ? 'bg-blue-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 capitalize">
                      {gateway.setupComplexity}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-2">Supported Methods</div>
                    <div className="flex flex-wrap gap-1">
                      {gateway.supportedMethods.map(method => (
                        <span
                          key={method}
                          className="px-2 py-1 bg-white border rounded text-xs"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>

                  {gateway.testMode && (
                    <div className="mt-3 px-3 py-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
                      🧪 Test Mode Enabled
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscription Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">📦 Subscription Tiers</h4>
            <p className="text-sm text-purple-800">
              Qilly offers 4 subscription tiers designed for different business sizes,
              from small contractors to large government departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(SUBSCRIPTION_PLANS).map(plan => (
              <div
                key={plan.id}
                className={`border-2 rounded-lg p-6 ${
                  plan.id === 'professional'
                    ? 'border-purple-500 bg-purple-50 relative'
                    : 'border-gray-200'
                }`}
              >
                {plan.id === 'professional' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-gray-900">
                    R{plan.price}
                  </div>
                  <div className="text-sm text-gray-600">per month</div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bills per month:</span>
                    <span className="font-semibold">
                      {plan.billsPerMonth === -1 ? 'Unlimited' : plan.billsPerMonth}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max users:</span>
                    <span className="font-semibold">
                      {plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Support:</span>
                    <span className="font-semibold">{plan.supportLevel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Payment Tab */}
      {activeTab === 'test-payment' && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">🧪 Test Payment Processing</h4>
            <p className="text-sm text-green-800">
              Test the complete payment flow from plan selection to subscription activation.
              All payments are in test mode and will not charge real money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Configuration */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Test User ID</label>
                <input
                  type="text"
                  value={testUserId}
                  onChange={(e) => setTestUserId(e.target.value)}
                  placeholder="test-user-123"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-600 mt-1">
                  In production, this would be the authenticated user's ID
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subscription Plan</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value as SubscriptionPlan)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(SUBSCRIPTION_PLANS).map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - R{plan.price}/month
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Gateway</label>
                <select
                  value={selectedGateway}
                  onChange={(e) => setSelectedGateway(e.target.value as PaymentGateway)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(PAYMENT_GATEWAYS)
                    .filter(gw => gw.isActive)
                    .map(gateway => (
                      <option key={gateway.id} value={gateway.id}>
                        {gateway.name} ({gateway.transactionFee})
                      </option>
                    ))}
                </select>
              </div>

              <button
                onClick={handleTestPayment}
                disabled={processing}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                {processing ? 'Processing...' : '💳 Process Test Payment'}
              </button>
            </div>

            {/* Payment Summary */}
            <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
              <h4 className="font-semibold text-lg mb-4">Payment Summary</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold">{SUBSCRIPTION_PLANS[selectedPlan].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">
                    R{SUBSCRIPTION_PLANS[selectedPlan].price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gateway:</span>
                  <span className="font-semibold">{PAYMENT_GATEWAYS[selectedGateway].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction Fee:</span>
                  <span className="font-semibold">{PAYMENT_GATEWAYS[selectedGateway].transactionFee}</span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-green-600">
                      R{SUBSCRIPTION_PLANS[selectedPlan].price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Result */}
          {paymentResult && (
            <div className={`border-2 rounded-lg p-6 ${
              paymentResult.success
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`text-3xl ${paymentResult.success ? 'text-green-600' : 'text-red-600'}`}>
                  {paymentResult.success ? '✅' : '❌'}
                </div>
                <div>
                  <h4 className="font-bold text-lg">
                    {paymentResult.success ? 'Payment Successful!' : 'Payment Failed'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {paymentResult.success
                      ? 'Subscription created successfully'
                      : paymentResult.error || 'Unknown error occurred'}
                  </p>
                </div>
              </div>

              {paymentResult.success && (
                <div className="space-y-2 text-sm">
                  {paymentResult.subscriptionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subscription ID:</span>
                      <code className="bg-white px-2 py-1 rounded text-xs">
                        {paymentResult.subscriptionId}
                      </code>
                    </div>
                  )}
                  {paymentResult.paymentUrl && (
                    <div>
                      <div className="text-gray-600 mb-1">Payment URL:</div>
                      <a
                        href={paymentResult.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs break-all"
                      >
                        {paymentResult.paymentUrl}
                      </a>
                      <p className="text-xs text-gray-600 mt-2">
                        In production, user would be redirected to this URL to complete payment
                      </p>
                    </div>
                  )}
                  {paymentResult.activated && (
                    <div className="mt-3 px-3 py-2 bg-green-600 text-white rounded">
                      ✓ Subscription activated and user upgraded to premium
                    </div>
                  )}
                  {!paymentResult.paymentUrl && !paymentResult.activated && (
                    <div className="mt-3 px-3 py-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800">
                      ⏳ Awaiting payment verification (Manual EFT)
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Gateway-Specific Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Gateway Notes</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>PayFast:</strong> Redirects to sandbox payment page. Use test card: 4000 0000 0000 0002</p>
              <p><strong>Yoco:</strong> Opens popup checkout. Test mode returns mock success.</p>
              <p><strong>Ozow:</strong> Instant EFT simulation. Mock bank selection page.</p>
              <p><strong>Manual EFT:</strong> Creates pending subscription. Auto-activates after 1 second for testing.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
