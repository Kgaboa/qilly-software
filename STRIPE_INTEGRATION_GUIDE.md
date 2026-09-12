# Stripe Integration Guide for Qilly (Optional - International)

## Complete guide for Stripe subscription billing with React

---

## Table of Contents
1. [Setup Stripe Account](#1-setup-stripe-account)
2. [Install Dependencies](#2-install-dependencies)
3. [Environment Variables](#3-environment-variables)
4. [Database Schema](#4-database-schema)
5. [Stripe Subscription Component](#5-stripe-subscription-component)
6. [Webhook Handler](#6-webhook-handler)
7. [Customer Portal](#7-customer-portal)
8. [Testing](#8-testing)

---

## 1. Setup Stripe Account

### Step 1: Register
1. Go to https://stripe.com
2. Click "Start now"
3. Complete registration

### Step 2: Verify Business
1. Complete business verification
2. Add bank account details
3. Set up payout schedule

### Step 3: Get API Keys
1. Go to **Developers** → **API Keys**
2. Copy keys:
   - **Publishable key:** `pk_test_...` (public, safe for frontend)
   - **Secret key:** `sk_test_...` (private, backend only)

### Step 4: Create Products
1. Go to **Products** → **Add Product**
2. Create 3 products:

**Professional:**
- Name: Qilly Professional
- Price: R1,999/month or R19,990/year
- Recurring: Monthly/Annual

**Enterprise:**
- Name: Qilly Enterprise  
- Price: R4,999/month or R49,990/year
- Recurring: Monthly/Annual

**Custom:**
- Name: Qilly Custom
- Price: R9,999/month or R99,990/year
- Recurring: Monthly/Annual

3. Copy **Price IDs** (e.g., `price_1Abc2DefGhi3Jkl`)

---

## 2. Install Dependencies

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js stripe
```

---

## 3. Environment Variables

Create `.env.local`:

```env
# Stripe Keys (TEST MODE)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs
VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_1Abc...
VITE_STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_1Def...
VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_1Ghi...
VITE_STRIPE_PRICE_ENTERPRISE_ANNUAL=price_1Jkl...
VITE_STRIPE_PRICE_CUSTOM_MONTHLY=price_1Mno...
VITE_STRIPE_PRICE_CUSTOM_ANNUAL=price_1Pqr...

# URLs
VITE_APP_URL=http://localhost:5173
```

**Production:**
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51...
STRIPE_SECRET_KEY=sk_live_51...
```

---

## 4. Database Schema

Already covered in PayFast guide - same schema works for both!

---

## 5. Stripe Service

Create `/src/utils/stripe.ts`:

```typescript
import Stripe from 'stripe';

// Initialize Stripe (backend only - use server-side rendering or API routes)
export const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

// Price mapping
export const stripePrices = {
  professional: {
    monthly: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY,
    annual: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL_ANNUAL,
  },
  enterprise: {
    monthly: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY,
    annual: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE_ANNUAL,
  },
  custom: {
    monthly: import.meta.env.VITE_STRIPE_PRICE_CUSTOM_MONTHLY,
    annual: import.meta.env.VITE_STRIPE_PRICE_CUSTOM_ANNUAL,
  },
};

export class StripeService {
  /**
   * Create checkout session for subscription
   */
  async createCheckoutSession(params: {
    supplierId: string;
    tier: 'professional' | 'enterprise' | 'custom';
    billingCycle: 'monthly' | 'annual';
    customerEmail: string;
    customerName: string;
  }): Promise<{ sessionId: string; url: string }> {
    const priceId = stripePrices[params.tier][params.billingCycle];

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: params.customerEmail,
      client_reference_id: params.supplierId,
      metadata: {
        supplier_id: params.supplierId,
        tier: params.tier,
        billing_cycle: params.billingCycle,
      },
      success_url: `${import.meta.env.VITE_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${import.meta.env.VITE_APP_URL}/payment/cancel`,
      subscription_data: {
        metadata: {
          supplier_id: params.supplierId,
          tier: params.tier,
        },
      },
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  }

  /**
   * Create customer portal session (for managing subscription)
   */
  async createPortalSession(customerId: string): Promise<{ url: string }> {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${import.meta.env.VITE_APP_URL}/dashboard`,
    });

    return { url: session.url };
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await stripe.subscriptions.cancel(subscriptionId);
      return true;
    } catch (error) {
      console.error('Cancel subscription error:', error);
      return false;
    }
  }

  /**
   * Update subscription (upgrade/downgrade with proration)
   */
  async updateSubscription(params: {
    subscriptionId: string;
    newTier: 'professional' | 'enterprise' | 'custom';
    billingCycle: 'monthly' | 'annual';
  }): Promise<Stripe.Subscription> {
    const subscription = await stripe.subscriptions.retrieve(params.subscriptionId);
    const newPriceId = stripePrices[params.newTier][params.billingCycle];

    const updated = await stripe.subscriptions.update(params.subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'always_invoice', // Stripe handles proration automatically!
      metadata: {
        tier: params.newTier,
      },
    });

    return updated;
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      return await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      console.error('Get subscription error:', error);
      return null;
    }
  }

  /**
   * List customer subscriptions
   */
  async listCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
    });

    return subscriptions.data;
  }
}

export const stripeService = new StripeService();
```

---

## 6. Stripe Checkout Component

Create `/src/app/components/StripeCheckout.tsx`:

```typescript
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { toast } from 'sonner';
import { CreditCard, Loader2 } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface StripeCheckoutProps {
  supplierId: string;
  tier: 'professional' | 'enterprise' | 'custom';
  billingCycle: 'monthly' | 'annual';
  customerName: string;
  customerEmail: string;
}

export function StripeCheckout({
  supplierId,
  tier,
  billingCycle,
  customerName,
  customerEmail,
}: StripeCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      // Call your backend API to create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId,
          tier,
          billingCycle,
          customerEmail,
          customerName,
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout');
      setIsProcessing(false);
    }
  };

  const pricing = {
    professional: { monthly: 1999, annual: 19990 },
    enterprise: { monthly: 4999, annual: 49990 },
    custom: { monthly: 9999, annual: 99990 },
  };

  const amount = pricing[tier][billingCycle];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>Secure payment powered by Stripe</CardDescription>
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
            onClick={handleCheckout}
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
                Pay with Stripe
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Secure payment powered by Stripe. You'll be redirected to complete payment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 7. API Routes (Backend)

### Create Checkout Session

Create `/api/stripe/create-checkout-session`:

```typescript
import { stripeService } from '@/utils/stripe';

export async function POST(request: Request) {
  try {
    const { supplierId, tier, billingCycle, customerEmail, customerName } = await request.json();

    const session = await stripeService.createCheckoutSession({
      supplierId,
      tier,
      billingCycle,
      customerEmail,
      customerName,
    });

    return Response.json({ sessionId: session.sessionId });
  } catch (error) {
    console.error('Create checkout error:', error);
    return Response.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
```

### Webhook Handler

Create `/api/stripe/webhook`:

```typescript
import { stripe } from '@/utils/stripe';
import { supabase } from '@/utils/supabase';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      import.meta.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return new Response('Invalid signature', { status: 400 });
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Retrieve subscription
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      
      // Update database
      await supabase
        .from('suppliers')
        .update({
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          subscription_status: 'active',
          subscription_start_date: new Date().toISOString(),
          next_billing_date: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('id', session.metadata!.supplier_id);

      // Record payment
      await supabase.from('payments').insert({
        supplier_id: session.metadata!.supplier_id,
        stripe_payment_intent_id: session.payment_intent,
        amount: session.amount_total! / 100,
        status: 'success',
        payment_method: 'Stripe',
        description: 'Initial subscription payment',
      });

      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      
      // Record successful payment
      await supabase.from('payments').insert({
        stripe_payment_intent_id: invoice.payment_intent,
        amount: invoice.amount_paid / 100,
        status: 'success',
        payment_method: 'Stripe',
        description: 'Subscription renewal',
      });

      // Update last payment date
      await supabase
        .from('suppliers')
        .update({
          last_payment_date: new Date().toISOString(),
          failed_payment_count: 0,
        })
        .eq('stripe_customer_id', invoice.customer);

      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      
      // Record failed payment
      await supabase.from('payments').insert({
        amount: invoice.amount_due / 100,
        status: 'failed',
        payment_method: 'Stripe',
        description: 'Failed subscription payment',
      });

      // Update subscription status
      await supabase
        .from('suppliers')
        .update({
          subscription_status: 'past_due',
          failed_payment_count: supabase.raw('failed_payment_count + 1'),
        })
        .eq('stripe_customer_id', invoice.customer);

      // TODO: Send failed payment email

      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Mark subscription as cancelled
      await supabase
        .from('suppliers')
        .update({
          subscription_status: 'cancelled',
        })
        .eq('stripe_subscription_id', subscription.id);

      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Update subscription details
      await supabase
        .from('suppliers')
        .update({
          subscription_status: subscription.status,
          next_billing_date: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);

      break;
    }
  }

  return new Response('OK', { status: 200 });
}
```

---

## 8. Customer Portal (Self-Service)

Stripe provides a hosted customer portal for managing subscriptions!

```typescript
// In your dashboard component
import { Button } from '@/app/components/ui/button';

export function SubscriptionManagement({ stripeCustomerId }: { stripeCustomerId: string }) {
  const handleManageSubscription = async () => {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId: stripeCustomerId }),
    });

    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <Button onClick={handleManageSubscription}>
      Manage Subscription
    </Button>
  );
}
```

**Customer Portal Features (FREE with Stripe):**
- ✅ Update payment method
- ✅ View invoices
- ✅ Download receipts
- ✅ Upgrade/downgrade plan
- ✅ Cancel subscription
- ✅ View payment history

---

## 9. Testing

### Test Mode

Stripe provides extensive test cards:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- CVV: Any 3 digits
- Expiry: Any future date
- ZIP: Any 5 digits

**Failed Payment:**
- Card: `4000 0000 0000 0341` (declined)

**3D Secure (requires authentication):**
- Card: `4000 0025 0000 3155`

### Test Webhooks Locally

Install Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This gives you a webhook secret for testing.

---

## 10. Advantages Over PayFast

### ✅ Built-in Features (No Code Needed):
- **Automatic Proration** - Stripe calculates proration automatically
- **Smart Retry Logic** - ML-based retry for failed payments
- **Customer Portal** - Hosted portal (no need to build)
- **Automatic Invoices** - PDF invoices sent automatically
- **Revenue Recognition** - IFRS 15 compliant
- **Fraud Detection** - Stripe Radar (ML fraud prevention)
- **Tax Calculation** - Stripe Tax (automatic VAT)
- **Dunning Management** - Automatic retry schedule

### ⚠️ Disadvantages for Qilly:
- Higher fees for SA customers
- Slower payouts to SA accounts
- Less "local preference" for government procurement

---

## 11. Production Checklist

- [ ] Switch to live API keys
- [ ] Add webhook endpoint to Stripe dashboard
- [ ] Configure webhook events to listen for
- [ ] Set up tax settings (15% VAT for SA)
- [ ] Configure customer portal settings
- [ ] Set up email notifications
- [ ] Enable Stripe Radar (fraud prevention)
- [ ] Configure payout schedule
- [ ] Add business details to Stripe account
- [ ] Test live webhooks

---

## 12. Stripe vs PayFast Summary

| Feature | Stripe | PayFast |
|---------|--------|---------|
| **Setup** | ⭐⭐⭐⭐⭐ Super easy | ⭐⭐⭐ Medium |
| **Local Preference** | ❌ US company | ✅ SA company |
| **Proration** | ✅ Automatic | ⚠️ Manual |
| **Customer Portal** | ✅ Included | ❌ Build yourself |
| **Failed Payment Retry** | ✅ Smart ML | ⚠️ Manual |
| **Invoicing** | ✅ Automatic PDF | ⚠️ Manual |
| **Tax Handling** | ✅ Stripe Tax | ⚠️ Manual |
| **SA Payout Speed** | ⚠️ 7-14 days | ✅ 2-3 days |
| **Government Procurement** | ❌ Lower score | ✅ BBBEE points |

---

## Recommendation

**For Qilly DHS Project: Start with PayFast**

**Add Stripe only if:**
- Expanding internationally
- Need advanced automation
- Customer portal is critical
- Have international customers

**Best of Both Worlds:**
```typescript
// Detect user location and route to appropriate gateway
const gateway = userCountry === 'ZA' ? 'payfast' : 'stripe';
```

---

## Support

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Support:** Chat in dashboard
- **Stripe Discord:** https://stripe.com/discord

---

This Stripe integration provides **enterprise-grade subscription billing** with minimal code, but PayFast remains the recommended choice for Qilly's government-focused South African deployment. 🇿🇦
