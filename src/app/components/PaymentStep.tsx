import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Building2, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const [paymentReference, setPaymentReference] = useState('');
  const [touched, setTouched] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (tier === 'FREE' || price === 0) {
    onPaymentComplete({ method: 'manual', reference: 'FREE_TIER', amount: 0 });
    return null;
  }

  const referenceError = touched && !paymentReference.trim();

  const handleSubmit = () => {
    setTouched(true);
    if (!paymentReference.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      onPaymentComplete({ method: 'manual', reference: paymentReference.trim(), amount: price });
      setIsProcessing(false);
    }, 1000);
  };

  const reference = `${companyName.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 15)}-${tierName.toUpperCase()}`;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">EFT Payment</h2>
        <p className="text-slate-600">
          Transfer the amount below to our bank account and enter your payment reference to complete your application.
        </p>
      </div>

      {/* Summary */}
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

      {/* Bank Details */}
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <CardTitle>Qilly Banking Details</CardTitle>
          </div>
          <CardDescription>Please transfer the exact amount using the reference below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-600">Bank Name</p>
                <p className="font-semibold">Standard Bank</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Branch</p>
                <p className="font-semibold">All Branches</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Account Number</p>
                <p className="font-semibold text-blue-600">1026 1862 306</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Branch Code</p>
                <p className="font-semibold">00051001</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-600">Account Holder</p>
                <p className="font-semibold">Assure Tech Solution</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-600">Payment Reference (use this exactly)</p>
                <p className="font-semibold text-lg text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                  {reference}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-600">Amount to Pay</p>
                <p className="font-semibold text-2xl text-green-600">R{price.toLocaleString()}.00</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Use the exact reference above so we can match your payment.
              </p>
            </div>
          </div>

          {/* Reference input */}
          <div className="space-y-2">
            <Label htmlFor="paymentRef" className="flex items-center gap-1">
              Your Bank Transaction Reference
              <span className="text-red-500 font-bold">*</span>
            </Label>
            <Input
              id="paymentRef"
              type="text"
              placeholder="e.g., STD12345678"
              value={paymentReference}
              onChange={(e) => { setPaymentReference(e.target.value); setTouched(true); }}
              onBlur={() => setTouched(true)}
              required
              className={referenceError ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {referenceError ? (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Payment reference is required before submitting your application.
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Enter your bank's transaction reference number. Our admin will verify this within 24 hours.
              </p>
            )}
          </div>

          {/* Next steps */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Next Steps
            </h5>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Make the EFT payment to the bank details above</li>
              <li>Enter your bank transaction reference number</li>
              <li>Click "Submit Application"</li>
              <li>Our admin will verify your payment within 24 hours</li>
              <li>You'll receive login access once approved</li>
            </ol>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onBack} disabled={isProcessing}>
              Back
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Submit Application with Payment Details'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}