import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { CreditCard, Smartphone, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentStepProps {
  tier: string;
  tierName: string;
  price: number;
  companyName: string;
  onPaymentComplete: (paymentDetails: {
    method: 'manual' | 'stitch' | 'payfast';
    reference: string;
    amount: number;
  }) => void;
  onBack: () => void;
}

export function PaymentStep({ tier, tierName, price, companyName, onPaymentComplete, onBack }: PaymentStepProps) {
  const [selectedMethod, setSelectedMethod] = useState<'manual' | 'stitch' | 'payfast' | null>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // FREE tier shouldn't reach here, but just in case
  if (tier === 'FREE' || price === 0) {
    onPaymentComplete({
      method: 'manual',
      reference: 'FREE_TIER',
      amount: 0
    });
    return null;
  }

  const handleManualPayment = () => {
    if (!paymentReference.trim()) {
      alert('Please enter your payment reference number');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      onPaymentComplete({
        method: 'manual',   // ← DB CHECK constraint requires 'manual' not 'bank_transfer'
        reference: paymentReference.trim(),
        amount: price
      });
      setIsProcessing(false);
    }, 1000);
  };

  const handleStitchPayment = () => {
    setIsProcessing(true);
    
    // Simulate Stitch payment flow
    setTimeout(() => {
      const mockReference = `STITCH-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
      
      // Success notification
      toast.success(`Stitch payment successful!\n\nReference: ${mockReference}\n\nYour payment has been automatically verified.`);
      
      onPaymentComplete({
        method: 'stitch',
        reference: mockReference,
        amount: price
      });
      setIsProcessing(false);
    }, 2000);
  };

  const handlePayFastPayment = () => {
    setIsProcessing(true);
    
    // Simulate PayFast payment flow
    setTimeout(() => {
      const mockReference = `PAYFAST-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
      
      // Success notification
      toast.success(`PayFast payment successful!\n\nReference: ${mockReference}\n\nYour payment has been automatically verified.`);
      
      onPaymentComplete({
        method: 'payfast',
        reference: mockReference,
        amount: price
      });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Payment</h2>
        <p className="text-slate-600">
          Complete your payment for <strong>{tierName}</strong> tier to proceed with your application.
        </p>
      </div>

      {/* Payment Summary */}
      <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-600">Selected Tier</p>
              <p className="text-2xl font-bold text-slate-900">{tierName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Amount Due</p>
              <p className="text-3xl font-bold text-blue-600">R{price.toLocaleString()}</p>
              <p className="text-xs text-slate-500">per month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      {!selectedMethod && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose Payment Method</h3>

          {/* Manual Payment */}
          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all hover:shadow-md"
            onClick={() => setSelectedMethod('manual')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <CardTitle className="text-lg">Manual Bank Transfer</CardTitle>
                  <CardDescription>
                    Pay via EFT/Bank transfer and submit proof of payment
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Available
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Stitch Payment — coming soon */}
          <Card className="opacity-50 grayscale cursor-not-allowed border border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Smartphone className="h-8 w-8 text-gray-400" />
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-400">Stitch Instant EFT</CardTitle>
                  <CardDescription>Coming soon</CardDescription>
                </div>
                <Badge variant="outline" className="bg-gray-100 text-gray-400 border-gray-200">
                  Coming Soon
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* PayFast Payment — coming soon */}
          <Card className="opacity-50 grayscale cursor-not-allowed border border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-gray-400" />
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-400">PayFast</CardTitle>
                  <CardDescription>Coming soon</CardDescription>
                </div>
                <Badge variant="outline" className="bg-gray-100 text-gray-400 border-gray-200">
                  Coming Soon
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              Back to Details
            </Button>
          </div>
        </div>
      )}

      {/* Manual Payment Details */}
      {selectedMethod === 'manual' && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <CardTitle>Manual Bank Transfer</CardTitle>
            </div>
            <CardDescription>
              Please transfer the exact amount to the bank details below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bank Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-slate-900">Qilly Banking Details</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-600">Bank Name</p>
                  <p className="font-semibold">First National Bank (FNB)</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Account Type</p>
                  <p className="font-semibold">Business Cheque</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Account Number</p>
                  <p className="font-semibold text-blue-600">6285 0987 432</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Branch Code</p>
                  <p className="font-semibold">250 655</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-600">Account Holder</p>
                  <p className="font-semibold">Qilly (Pty) Ltd</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-600">Reference (Use this exactly)</p>
                  <p className="font-semibold text-lg text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                    {companyName.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 15)}-{tierName.toUpperCase()}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-600">Amount to Pay</p>
                  <p className="font-semibold text-2xl text-green-600">R{price.toLocaleString()}.00</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <strong>Important:</strong> Please use the exact reference above so we can match your payment.
                </div>
              </div>
            </div>

            {/* Payment Reference Input */}
            <div className="space-y-2">
              <Label htmlFor="paymentRef">Payment Reference / Proof of Payment Number</Label>
              <Input
                id="paymentRef"
                type="text"
                placeholder="e.g., FNB12345678 or your bank reference number"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                required
              />
              <p className="text-xs text-slate-500">
                Enter your bank's transaction reference or proof of payment number. Our admin will verify this.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Next Steps
              </h5>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Make payment to the bank details above</li>
                <li>Enter your payment reference number below</li>
                <li>Click "Submit Application"</li>
                <li>Our admin will verify your payment (usually within 24 hours)</li>
                <li>You'll receive login access once approved</li>
              </ol>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedMethod(null)}
                disabled={isProcessing}
              >
                Choose Different Method
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleManualPayment}
                disabled={isProcessing || !paymentReference.trim()}
              >
                {isProcessing ? 'Processing...' : 'Submit Application with Payment Details'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stitch Payment */}
      {selectedMethod === 'stitch' && (
        <Card className="border-2 border-purple-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-purple-600" />
              <CardTitle>Stitch Instant EFT - Simulated Payment</CardTitle>
            </div>
            <CardDescription>
              Instant bank transfer with automatic verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Simulated Stitch UI */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-purple-900">Payment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700">Merchant</span>
                  <span className="font-semibold">Qilly (Pty) Ltd</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700">Subscription</span>
                  <span className="font-semibold">{tierName} Tier</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700">Amount</span>
                  <span className="font-semibold text-lg text-purple-600">R{price.toLocaleString()}.00</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded p-3 flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <strong>Auto-Verified:</strong> Stitch payments are instantly verified. No admin approval needed for payment!
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h5 className="font-semibold text-blue-900 mb-2">How it works:</h5>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Click "Pay Now" below</li>
                <li>Payment processed instantly (simulated)</li>
                <li>Payment automatically verified ✓</li>
                <li>Admin approves contractor status only</li>
                <li>You'll receive login access once contractor approved</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSelectedMethod(null)} disabled={isProcessing}>
                Back
              </Button>
              <Button 
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                onClick={handleStitchPayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing Payment...' : `Pay R${price.toLocaleString()} Now (Simulated)`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PayFast Payment */}
      {selectedMethod === 'payfast' && (
        <Card className="border-2 border-emerald-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-emerald-600" />
              <CardTitle>PayFast Card Payment - Simulated Payment</CardTitle>
            </div>
            <CardDescription>
              Pay securely with credit/debit card with automatic verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Simulated PayFast UI */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-emerald-900">Payment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-700">Merchant</span>
                  <span className="font-semibold">Qilly (Pty) Ltd</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-700">Subscription</span>
                  <span className="font-semibold">{tierName} Tier</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-700">Amount</span>
                  <span className="font-semibold text-lg text-emerald-600">R{price.toLocaleString()}.00</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded p-3 flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <strong>Auto-Verified:</strong> PayFast payments are instantly verified. No admin approval needed for payment!
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h5 className="font-semibold text-blue-900 mb-2">How it works:</h5>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Click "Pay Now" below</li>
                <li>Enter card details (simulated)</li>
                <li>Payment processed instantly ✓</li>
                <li>Payment automatically verified ✓</li>
                <li>Admin approves contractor status only</li>
                <li>You'll receive login access once contractor approved</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSelectedMethod(null)} disabled={isProcessing}>
                Back
              </Button>
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handlePayFastPayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing Payment...' : `Pay R${price.toLocaleString()} Now (Simulated)`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}