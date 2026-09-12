import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { CreditCard, CheckCircle, Lock, AlertCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface PayFastPaymentProps {
  amount: number;
  tier: string;
  cycle: string;
  userId: string;
  userEmail: string;
  userName: string;
  onSuccess: () => void;
}

export function PayFastPayment({ 
  amount, 
  tier, 
  cycle, 
  userId, 
  userEmail, 
  userName,
  onSuccess 
}: PayFastPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: userName
  });

  const handlePayFastPayment = async () => {
    setIsProcessing(true);
    
    try {
      // In production, this would integrate with PayFast API
      // See /PAYFAST_INTEGRATION_GUIDE.md for full implementation
      
      // const payfast = new PayFastService();
      // const payment = await payfast.createPayment({
      //   amount,
      //   item_name: `${tier} Subscription - ${cycle}`,
      //   email_address: userEmail,
      //   custom_str1: userId,
      //   return_url: `${window.location.origin}/payment-success`,
      //   cancel_url: `${window.location.origin}/payment-cancelled`,
      //   notify_url: `${API_URL}/webhooks/payfast`
      // });
      // window.location.href = payment.checkoutUrl;

      // DEMO MODE: Simulate PayFast flow
      toast.info('Connecting to PayFast secure payment gateway...');
      
      setTimeout(() => {
        toast.info('💳 Processing card payment (Demo mode)');
        
        // Validate card number (basic demo validation)
        const cleanCardNumber = cardDetails.cardNumber.replace(/\s/g, '');
        if (cleanCardNumber.length < 13) {
          toast.error('Please enter a valid card number');
          setIsProcessing(false);
          return;
        }

        // Simulate payment processing
        setTimeout(() => {
          // Save payment record
          const payments = JSON.parse(localStorage.getItem('payfast_payments') || '[]');
          const transactionFee = (amount * 0.029) + 2; // 2.9% + R2
          payments.push({
            id: `PF-${Date.now()}`,
            userId,
            userEmail,
            userName,
            amount,
            tier,
            cycle,
            status: 'completed',
            paymentMethod: 'payfast',
            transactionFee,
            cardLast4: cleanCardNumber.slice(-4),
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString()
          });
          localStorage.setItem('payfast_payments', JSON.stringify(payments));

          // Update user subscription
          const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
          const userIndex = users.findIndex((u: any) => u.id === userId || u.email === userEmail);
          if (userIndex >= 0) {
            users[userIndex].subscription_tier = tier;
            users[userIndex].subscription_status = 'active';
            users[userIndex].subscription_cycle = cycle;
            users[userIndex].paid_status = true;
            users[userIndex].trial_used = false; // Reset trial
            users[userIndex].next_billing_date = new Date(
              Date.now() + (cycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
            ).toISOString();
            users[userIndex].last_payment_date = new Date().toISOString();
            users[userIndex].payment_method = 'payfast';
            users[userIndex].payfast_token = `token_${Date.now()}`;
            localStorage.setItem('demo_users', JSON.stringify(users));
          }

          toast.success('Payment successful! Your subscription is now active.');
          onSuccess();
        }, 2000);
      }, 1000);
      
    } catch (error) {
      console.error('PayFast payment error:', error);
      toast.error('Payment failed. Please try again or use another payment method.');
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <Card className="border-2 border-purple-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-purple-600" />
              Pay with Credit/Debit Card
            </CardTitle>
            <CardDescription>
              Secure payment • International cards accepted • Recurring billing
            </CardDescription>
          </div>
          <Badge className="bg-purple-500 text-white px-3 py-1">
            2.9% + R2
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Amount */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Amount</div>
            <div className="text-4xl font-bold text-purple-600">
              R {amount.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <div className="text-gray-600">
                Subscription: R{amount.toLocaleString()}
              </div>
              <div className="text-purple-600">
                + R{((amount * 0.029) + 2).toFixed(2)} fee
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan • {cycle.charAt(0).toUpperCase() + cycle.slice(1)} Billing
            </div>
          </div>

          {/* Card Details Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardHolder">Cardholder Name</Label>
              <Input
                id="cardHolder"
                value={cardDetails.cardHolder}
                onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({ 
                    ...cardDetails, 
                    cardNumber: formatCardNumber(e.target.value) 
                  })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="mt-1 pl-4 pr-12"
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={(e) => setCardDetails({ 
                    ...cardDetails, 
                    expiryDate: formatExpiryDate(e.target.value) 
                  })}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <div className="relative">
                  <Input
                    id="cvv"
                    type="password"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ 
                      ...cardDetails, 
                      cvv: e.target.value.replace(/\D/g, '').substring(0, 3)
                    })}
                    placeholder="123"
                    maxLength={3}
                    className="mt-1"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold">PCI DSS Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold">256-bit SSL</span>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              PayFast Benefits
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>All major credit and debit cards accepted</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Automatic recurring billing - no need to re-enter details</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Instant activation - start using immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>International cards supported</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Secure card storage for future payments</span>
              </li>
            </ul>
          </div>

          {/* Pay Button */}
          <Button 
            onClick={handlePayFastPayment}
            disabled={isProcessing || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Pay R{amount.toLocaleString()} Securely
              </>
            )}
          </Button>

          {/* Demo Notice */}
          <Alert className="bg-amber-50 border-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <AlertDescription className="text-xs text-amber-800">
              <strong>Demo Mode:</strong> This is a demonstration. In production, you would be 
              redirected to PayFast's secure hosted payment page where you enter your card details. 
              PayFast handles all card processing securely - we never see or store your card details.
              For testing, enter any card number with at least 13 digits.
            </AlertDescription>
          </Alert>

          {/* Accepted Cards */}
          <div>
            <div className="text-xs text-gray-600 mb-2 text-center">Accepted Payment Methods</div>
            <div className="flex items-center justify-center gap-3">
              {['Visa', 'Mastercard', 'Maestro', 'Amex'].map((card) => (
                <div key={card} className="px-3 py-2 bg-white border rounded text-xs font-semibold text-gray-700">
                  {card}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-gray-500 text-center pt-4 border-t">
            Powered by PayFast • South Africa's leading payment gateway • Your card details are never stored on our servers
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
