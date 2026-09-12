# PayFast Integration Guide for Qilly

## Complete step-by-step guide to integrate PayFast subscription billing

---

## Table of Contents
1. [Setup PayFast Account](#1-setup-payfast-account)
2. [Install Dependencies](#2-install-dependencies)
3. [Environment Variables](#3-environment-variables)
4. [Database Schema](#4-database-schema)
5. [PayFast Subscription Component](#5-payfast-subscription-component)
6. [Webhook Handler](#6-webhook-handler)
7. [Subscription Management](#7-subscription-management)
8. [Testing](#8-testing)

---

## 1. Setup PayFast Account

### Step 1: Register
1. Go to https://www.payfast.co.za
2. Click "Sign Up"
3. Choose **Business Account**
4. Complete registration with company details

### Step 2: Verify Business
- Upload business documents (CK/CIPC registration)
- Verify bank account
- Complete FICA requirements

### Step 3: Get API Credentials
1. Login to PayFast Dashboard
2. Go to **Settings** → **Integration**
3. Copy credentials:
   - **Merchant ID**: `10000100`
   - **Merchant Key**: `46f0cd694581a`
   - **Passphrase**: (create secure passphrase)

### Step 4: Enable Subscriptions
1. Go to **Settings** → **Subscriptions**
2. Enable **Recurring Billing**
3. Set **Subscription settings**:
   - Enable ad hoc payments: ✅
   - Email notifications: ✅
   - Subscription notifications: ✅

---

## 2. Install Dependencies

```bash
npm install crypto-js axios
```

---

## 3. Environment Variables

Create `.env.local`:

```env
# PayFast Credentials (SANDBOX)
VITE_PAYFAST_MERCHANT_ID=10000100
VITE_PAYFAST_MERCHANT_KEY=46f0cd694581a
VITE_PAYFAST_PASSPHRASE=your-secure-passphrase

# PayFast URLs
VITE_PAYFAST_URL=https://sandbox.payfast.co.za/eng/process
VITE_PAYFAST_RETURN_URL=https://yourdomain.com/payment/success
VITE_PAYFAST_CANCEL_URL=https://yourdomain.com/payment/cancel
VITE_PAYFAST_NOTIFY_URL=https://yourdomain.com/api/payfast/webhook

# Production (switch when going live)
# VITE_PAYFAST_URL=https://www.payfast.co.za/eng/process
```

---

## 4. Database Schema

Add to your Supabase `subscriptions` table:

```sql
-- Add PayFast columns
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS payfast_token TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS payfast_subscription_id TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMPTZ;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS failed_payment_count INTEGER DEFAULT 0;

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  payfast_payment_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ZAR',
  status TEXT NOT NULL, -- 'pending', 'success', 'failed', 'refunded'
  payment_method TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscription_events table (audit trail)
CREATE TABLE IF NOT EXISTS subscription_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'subscription_created', 'payment_success', 'payment_failed', 'subscription_cancelled'
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. PayFast Subscription Component

Create `/src/utils/payfast.ts`:

```typescript
import CryptoJS from 'crypto-js';

interface PayFastData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  email_address: string;
  cell_number: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description: string;
  subscription_type: '1'; // 1 = Subscription
  billing_date: string; // YYYY-MM-DD
  recurring_amount: string;
  frequency: '3' | '4' | '5' | '6'; // 3=Monthly, 4=Quarterly, 5=Biannually, 6=Annual
  cycles: '0'; // 0 = until cancelled
  passphrase?: string;
}

export class PayFastService {
  private merchantId: string;
  private merchantKey: string;
  private passphrase: string;
  private payfastUrl: string;

  constructor() {
    this.merchantId = import.meta.env.VITE_PAYFAST_MERCHANT_ID;
    this.merchantKey = import.meta.env.VITE_PAYFAST_MERCHANT_KEY;
    this.passphrase = import.meta.env.VITE_PAYFAST_PASSPHRASE;
    this.payfastUrl = import.meta.env.VITE_PAYFAST_URL;
  }

  /**
   * Generate signature for PayFast request
   */
  private generateSignature(data: Record<string, string>): string {
    // Create parameter string
    const paramString = Object.keys(data)
      .sort()
      .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
      .join('&');

    // Add passphrase if provided
    const signatureString = this.passphrase 
      ? `${paramString}&passphrase=${encodeURIComponent(this.passphrase)}`
      : paramString;

    // Generate MD5 signature
    return CryptoJS.MD5(signatureString).toString();
  }

  /**
   * Create subscription payment form data
   */
  createSubscription(params: {
    supplierId: string;
    tier: 'professional' | 'enterprise' | 'custom';
    billingCycle: 'monthly' | 'annual';
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }): { url: string; data: PayFastData & { signature: string } } {
    // Pricing
    const pricing = {
      professional: { monthly: 1999, annual: 19990 },
      enterprise: { monthly: 4999, annual: 49990 },
      custom: { monthly: 9999, annual: 99990 }
    };

    const amount = pricing[params.tier][params.billingCycle];
    const frequency = params.billingCycle === 'monthly' ? '3' : '6';

    // Calculate billing date (first of next month)
    const billingDate = new Date();
    billingDate.setMonth(billingDate.getMonth() + 1);
    billingDate.setDate(1);

    const data: PayFastData = {
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      return_url: import.meta.env.VITE_PAYFAST_RETURN_URL,
      cancel_url: import.meta.env.VITE_PAYFAST_CANCEL_URL,
      notify_url: import.meta.env.VITE_PAYFAST_NOTIFY_URL,
      name_first: params.customerName,
      email_address: params.customerEmail,
      cell_number: params.customerPhone,
      m_payment_id: params.supplierId,
      amount: amount.toFixed(2),
      item_name: `Qilly ${params.tier.charAt(0).toUpperCase() + params.tier.slice(1)} Subscription`,
      item_description: `${params.billingCycle.charAt(0).toUpperCase() + params.billingCycle.slice(1)} billing - R${amount}`,
      subscription_type: '1',
      billing_date: billingDate.toISOString().split('T')[0],
      recurring_amount: amount.toFixed(2),
      frequency,
      cycles: '0' // Infinite until cancelled
    };

    // Generate signature
    const signature = this.generateSignature(data as any);

    return {
      url: this.payfastUrl,
      data: { ...data, signature }
    };
  }

  /**
   * Verify webhook signature
   */
  verifySignature(postData: Record<string, string>, signature: string): boolean {
    const generatedSignature = this.generateSignature(postData);
    return generatedSignature === signature;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(token: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.payfast.co.za/subscriptions/' + token + '/cancel', {
        method: 'PUT',
        headers: {
          'merchant-id': this.merchantId,
          'version': 'v1',
          'timestamp': new Date().toISOString(),
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Cancel subscription error:', error);
      return false;
    }
  }

  /**
   * Fetch subscription details
   */
  async getSubscriptionDetails(token: string): Promise<any> {
    try {
      const response = await fetch(`https://api.payfast.co.za/subscriptions/${token}/fetch`, {
        method: 'GET',
        headers: {
          'merchant-id': this.merchantId,
          'version': 'v1',
          'timestamp': new Date().toISOString(),
        }
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Fetch subscription error:', error);
      return null;
    }
  }
}

export const payfastService = new PayFastService();
```

---

## 6. PayFast Payment Component

Create `/src/app/components/PayFastCheckout.tsx`:

```typescript
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { payfastService } from '@/utils/payfast';
import { toast } from 'sonner';
import { CreditCard, Loader2 } from 'lucide-react';

interface PayFastCheckoutProps {
  supplierId: string;
  tier: 'professional' | 'enterprise' | 'custom';
  billingCycle: 'monthly' | 'annual';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export function PayFastCheckout({
  supplierId,
  tier,
  billingCycle,
  customerName,
  customerEmail,
  customerPhone
}: PayFastCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);

    try {
      // Generate PayFast form data
      const { url, data } = payfastService.createSubscription({
        supplierId,
        tier,
        billingCycle,
        customerName,
        customerEmail,
        customerPhone
      });

      // Create form and submit
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;

      Object.entries(data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      toast.success('Redirecting to PayFast...');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment');
      setIsProcessing(false);
    }
  };

  const pricing = {
    professional: { monthly: 1999, annual: 19990 },
    enterprise: { monthly: 4999, annual: 49990 },
    custom: { monthly: 9999, annual: 99990 }
  };

  const amount = pricing[tier][billingCycle];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>Secure payment powered by PayFast</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Subscription:</span>
              <span className="text-lg">
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Billing:</span>
              <span className="text-lg capitalize">{billingCycle}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-blue-200">
              <span className="font-bold text-lg">Total:</span>
              <span className="font-bold text-2xl text-blue-600">
                R {amount.toLocaleString()}
              </span>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Pay with PayFast
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Secure payment powered by PayFast. You'll be redirected to complete payment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 7. Webhook Handler

Create `/src/app/api/payfast/webhook/route.ts` (if using Next.js) or backend endpoint:

```typescript
import { supabase } from '@/utils/supabase';
import { payfastService } from '@/utils/payfast';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    // Verify signature
    const signature = data.signature;
    delete data.signature;

    if (!payfastService.verifySignature(data, signature)) {
      return new Response('Invalid signature', { status: 400 });
    }

    const {
      payment_status,
      m_payment_id, // supplier_id
      amount_gross,
      token,
      billing_date
    } = data;

    // Update subscription in database
    if (payment_status === 'COMPLETE') {
      // Successful payment
      const nextBilling = new Date(billing_date);
      nextBilling.setMonth(nextBilling.getMonth() + 1);

      await supabase
        .from('suppliers')
        .update({
          subscription_status: 'active',
          payfast_token: token,
          last_payment_date: new Date().toISOString(),
          next_billing_date: nextBilling.toISOString(),
          failed_payment_count: 0
        })
        .eq('id', m_payment_id);

      // Record payment
      await supabase
        .from('payments')
        .insert({
          supplier_id: m_payment_id,
          payfast_payment_id: data.pf_payment_id,
          amount: parseFloat(amount_gross),
          status: 'success',
          payment_method: 'PayFast',
          description: 'Subscription payment'
        });

      // Log event
      await supabase
        .from('subscription_events')
        .insert({
          supplier_id: m_payment_id,
          event_type: 'payment_success',
          event_data: data
        });

      // TODO: Send success email

    } else {
      // Failed payment
      await supabase
        .from('suppliers')
        .update({
          subscription_status: 'past_due',
          failed_payment_count: supabase.raw('failed_payment_count + 1')
        })
        .eq('id', m_payment_id);

      // Record failed payment
      await supabase
        .from('payments')
        .insert({
          supplier_id: m_payment_id,
          amount: parseFloat(amount_gross),
          status: 'failed',
          payment_method: 'PayFast',
          description: 'Failed subscription payment'
        });

      // Log event
      await supabase
        .from('subscription_events')
        .insert({
          supplier_id: m_payment_id,
          event_type: 'payment_failed',
          event_data: data
        });

      // TODO: Send failed payment email
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Error', { status: 500 });
  }
}
```

---

## 8. Testing

### Sandbox Testing

PayFast provides test credentials:

```
Merchant ID: 10000100
Merchant Key: 46f0cd694581a
```

### Test Cards

**Successful Payment:**
- Card Number: `4000 0000 0000 0002`
- CVV: `123`
- Expiry: Any future date

**Failed Payment:**
- Card Number: `4000 0000 0000 0341`
- CVV: `123`
- Expiry: Any future date

### Test Workflow

1. Create subscription with test credentials
2. Complete payment with test card
3. PayFast redirects to return_url
4. Webhook fires to notify_url
5. Check database for updated subscription

---

## 9. Production Checklist

Before going live:

- [ ] Replace sandbox credentials with production credentials
- [ ] Update `VITE_PAYFAST_URL` to production URL
- [ ] Set up SSL certificate (HTTPS required)
- [ ] Configure webhook URL (must be publicly accessible)
- [ ] Test webhook with PayFast's webhook tester
- [ ] Implement email notifications (success/failure)
- [ ] Set up monitoring for failed webhooks
- [ ] Create admin dashboard for subscription management
- [ ] Implement cancellation flow
- [ ] Add refund handling
- [ ] Set up dunning management (retry failed payments)
- [ ] Configure VAT handling (15% for SA)
- [ ] Create customer portal for subscription management

---

## 10. Advanced Features

### Proration on Upgrade

```typescript
async function upgradeSubscription(
  supplierId: string,
  currentTier: string,
  newTier: string
) {
  // Calculate proration
  const { data: supplier } = await supabase
    .from('suppliers')
    .select('next_billing_date, subscription_tier, billing_cycle')
    .eq('id', supplierId)
    .single();

  const daysRemaining = Math.ceil(
    (new Date(supplier.next_billing_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const currentPrice = pricing[currentTier][supplier.billing_cycle];
  const newPrice = pricing[newTier][supplier.billing_cycle];

  const unusedCredit = (currentPrice / 30) * daysRemaining;
  const newCharge = (newPrice / 30) * daysRemaining;
  const prorationAmount = newCharge - unusedCredit;

  // Charge prorated amount via PayFast ad hoc
  // Then update subscription tier
}
```

### Dunning Management

```typescript
// Run daily cron job
async function retryFailedPayments() {
  const { data: pastDue } = await supabase
    .from('suppliers')
    .select('*')
    .eq('subscription_status', 'past_due')
    .lt('failed_payment_count', 3); // Max 3 retries

  for (const supplier of pastDue) {
    // Attempt to charge via PayFast ad hoc payment
    // If successful, update status
    // If failed, increment failed_payment_count
    // If failed_payment_count >= 3, cancel subscription
  }
}
```

---

## Support

- **PayFast Documentation:** https://developers.payfast.co.za
- **PayFast Support:** support@payfast.co.za
- **PayFast Phone:** 0861 729 3278

---

## Summary

This guide provides everything needed to integrate PayFast subscription billing into Qilly. The implementation includes:

✅ Subscription creation
✅ Webhook handling  
✅ Payment tracking
✅ Database integration
✅ Audit logging
✅ Test environment

**Next Steps:**
1. Set up PayFast account
2. Add environment variables
3. Create database tables
4. Implement PayFastCheckout component
5. Set up webhook endpoint
6. Test in sandbox
7. Go live! 🚀
