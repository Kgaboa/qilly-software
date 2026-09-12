import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Zap, CheckCircle, Building2, Smartphone, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { updateContractorSubscription } from '@/utils/database/contractors';

interface StitchPaymentProps {
  amount: number;
  tier: string;
  cycle: string;
  userId: string;
  userEmail: string;
  userName: string;
  onSuccess: () => void;
}

export function StitchPayment({ 
  amount, 
  tier, 
  cycle, 
  userId, 
  userEmail, 
  userName,
  onSuccess 
}: StitchPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStitchPayment = async () => {
    setIsProcessing(true);
    
    try {
      // In production, this would call Stitch API
      // const stitchService = new StitchPaymentService();
      // const { url } = await stitchService.createPaymentRequest({
      //   amount,
      //   reference: `QILLY-${userId.substring(0, 8)}`,
      //   supplierId: userId
      // });
      // window.location.href = url;

      // DEMO MODE: Simulate Stitch payment flow
      toast.info('Opening Stitch payment portal...');
      
      // Simulate redirect delay
      setTimeout(() => {
        toast.info('🏦 Select your bank to continue (Demo mode)');
        
        // In demo, auto-approve after 2 seconds
        setTimeout(async () => {
          try {
            // Save payment record (for audit trail)
            const payments = JSON.parse(localStorage.getItem('stitch_payments') || '[]');
            payments.push({
              id: `STITCH-${Date.now()}`,
              userId,
              userEmail,
              userName,
              amount,
              tier,
              cycle,
              status: 'completed',
              paymentMethod: 'stitch',
              transactionFee: 2, // Stitch flat fee
              createdAt: new Date().toISOString(),
              completedAt: new Date().toISOString()
            });
            localStorage.setItem('stitch_payments', JSON.stringify(payments));

            // ✅ UPDATE CONTRACTOR IN SUPABASE DATABASE (NOT localStorage!)
            const nextBillingDate = new Date(
              Date.now() + (cycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
            ).toISOString();

            const success = await updateContractorSubscription(userEmail, {
              subscription_tier: tier as any,
              subscription_status: 'active',
              subscription_cycle: cycle as 'monthly' | 'annual',
              paid_status: true,
              boq_count: 0, // Reset BOQ count
              last_payment_date: new Date().toISOString(),
              next_billing_date: nextBillingDate,
              payment_method: 'stitch'
            });

            if (!success) {
              toast.error('Database update failed. Please contact support.');
              setIsProcessing(false);
              return;
            }

            // Also update localStorage demo_users for backward compatibility
            const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
            const userIndex = users.findIndex((u: any) => u.id === userId || u.email === userEmail);
            if (userIndex >= 0) {
              users[userIndex].subscription_tier = tier;
              users[userIndex].subscription_status = 'active';
              users[userIndex].subscription_cycle = cycle;
              users[userIndex].paid_status = true;
              users[userIndex].trial_used = false; // Reset trial
              users[userIndex].next_billing_date = nextBillingDate;
              users[userIndex].last_payment_date = new Date().toISOString();
              users[userIndex].payment_method = 'stitch';
              localStorage.setItem('demo_users', JSON.stringify(users));
            }

            console.log('✅ Stitch payment processed! Database updated for:', userEmail);
            toast.success('💳 Payment successful! Your subscription is now active in DATABASE.');
            setIsProcessing(false);
            onSuccess();
          } catch (error) {
            console.error('Error updating database:', error);
            toast.error('Payment received but database update failed. Please contact support.');
            setIsProcessing(false);
          }
        }, 2000);
      }, 1000);
      
    } catch (error) {
      console.error('Stitch payment error:', error);
      toast.error('Payment failed. Please try again or use another payment method.');
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-2 border-blue-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-600" />
              Pay with Stitch Instant Banking
            </CardTitle>
            <CardDescription>
              Instant confirmation • Bank-grade security • No card needed
            </CardDescription>
          </div>
          <Badge className="bg-blue-500 text-white text-lg px-4 py-2">
            Only R2 fee
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Amount */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">You'll Pay</div>
            <div className="text-4xl font-bold text-blue-600">
              R {amount.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-sm text-gray-600">
                Subscription: R{amount.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600">+ R2 fee</div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan • {cycle.charAt(0).toUpperCase() + cycle.slice(1)} Billing
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              How Stitch Instant Banking Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Click "Pay Now with Stitch" below</li>
              <li>Select your bank (FNB, Standard Bank, ABSA, Nedbank, Capitec, etc.)</li>
              <li>Log in using your existing internet banking credentials</li>
              <li>Approve the payment in your banking app</li>
              <li>Done! Instant confirmation and account activation</li>
            </ol>
          </div>

          {/* Supported Banks */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Supported Banks</h3>
            <div className="grid grid-cols-3 gap-3">
              {['FNB', 'Standard Bank', 'ABSA', 'Nedbank', 'Capitec', 'Discovery'].map((bank) => (
                <div key={bank} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">{bank}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">+ 20 more South African banks</p>
          </div>

          {/* Security Notice */}
          <Alert className="bg-green-50 border-green-300">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-sm text-green-800">
              <strong>Bank-grade security:</strong> Stitch uses OAuth2.0 authentication. 
              We never see or store your banking credentials. Your payment is processed directly 
              through your bank's secure systems.
            </AlertDescription>
          </Alert>

          {/* Pay Button */}
          <Button 
            onClick={handleStitchPayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Pay Now with Stitch (R{(amount + 2).toLocaleString()})
              </>
            )}
          </Button>

          {/* Benefits Grid */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                <Smartphone className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-xs text-gray-600 mt-1">Mobile Friendly</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                <Zap className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-xs text-gray-600 mt-1">Instant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                <CheckCircle className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-xs text-gray-600 mt-1">Secure</div>
            </div>
          </div>

          {/* Demo Notice */}
          <Alert className="bg-amber-50 border-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <AlertDescription className="text-xs text-amber-800">
              <strong>Demo Mode:</strong> This is a demonstration. In production, you would be 
              redirected to Stitch's secure payment portal where you select your bank and approve 
              the payment. The payment would be instant with immediate subscription activation.
            </AlertDescription>
          </Alert>

          {/* Footer */}
          <div className="text-xs text-gray-500 text-center pt-4 border-t">
            Powered by Stitch • A South African fintech company • POPIA compliant
          </div>
        </div>
      </CardContent>
    </Card>
  );
}