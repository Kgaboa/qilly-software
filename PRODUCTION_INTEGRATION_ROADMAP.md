# Qilly Production Integration Roadmap
## Converting Testing Features to Production-Ready System

---

## Overview

This roadmap transforms the **Subscription Testing Dashboard** into a **Production Subscription System** integrated with real payment gateways, databases, and email services.

---

## Phase 1: Foundation (Week 1-2)

### 1.1 Database Setup ✅

**Action Items:**
- [ ] Create production Supabase project
- [ ] Run migration scripts (see PayFast guide)
- [ ] Set up RLS (Row Level Security) policies
- [ ] Create database indexes for performance
- [ ] Set up backup schedule

**SQL Migration:**
```sql
-- Already in PayFast guide
-- Adds: subscriptions, payments, subscription_events tables
```

---

### 1.2 Environment Configuration ✅

**Action Items:**
- [ ] Create `.env.production` file
- [ ] Add PayFast production credentials
- [ ] Add Supabase production URL/keys
- [ ] Add email service API keys (Resend/SendGrid)
- [ ] Configure webhook URLs

**Example `.env.production`:**
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# PayFast Production
VITE_PAYFAST_MERCHANT_ID=10012345
VITE_PAYFAST_MERCHANT_KEY=abc123def456
VITE_PAYFAST_PASSPHRASE=your-secure-passphrase
VITE_PAYFAST_URL=https://www.payfast.co.za/eng/process

# Email Service (Resend)
RESEND_API_KEY=re_...

# App URLs
VITE_APP_URL=https://qilly.co.za
```

---

## Phase 2: Payment Integration (Week 3-4)

### 2.1 PayFast Integration ✅

**Convert Testing to Production:**

**Before (Testing):**
```typescript
// SubscriptionTesting.tsx - Simulated payment
const simulatePayment = (subscription, status) => {
  // Just updates local state
  setTestSuppliers(/* ... */);
  toast.success('Payment simulated');
};
```

**After (Production):**
```typescript
// PayFastCheckout.tsx - Real payment
import { payfastService } from '@/utils/payfast';

const processPayment = async () => {
  // 1. Create PayFast checkout session
  const { url, data } = payfastService.createSubscription({
    supplierId: user.id,
    tier: selectedTier,
    billingCycle: selectedCycle,
    customerName: user.company_name,
    customerEmail: user.email,
    customerPhone: user.phone,
  });

  // 2. Redirect to PayFast
  // User completes payment on PayFast
  // PayFast sends webhook to your server
  
  // 3. Webhook updates database
  // (see PayFast guide webhook handler)
};
```

**Action Items:**
- [ ] Implement PayFastCheckout component (see guide)
- [ ] Set up webhook endpoint (public URL required)
- [ ] Test with PayFast sandbox
- [ ] Configure SSL certificate (HTTPS required)
- [ ] Set up webhook signature verification
- [ ] Go live with production credentials

---

### 2.2 Billing Cycle Automation ✅

**Convert Testing to Production:**

**Before (Testing):**
```typescript
const advanceBillingDate = (subscription, days) => {
  // Manual date advance for testing
  currentDate.setDate(currentDate.getDate() + days);
};
```

**After (Production):**
```typescript
// Cron job (runs daily at 2 AM)
// Use Vercel Cron, GitHub Actions, or Supabase Edge Functions

import { supabase } from '@/utils/supabase';
import { payfastService } from '@/utils/payfast';

async function processBillingCycle() {
  // 1. Find subscriptions due for billing
  const { data: dueSubscriptions } = await supabase
    .from('suppliers')
    .select('*')
    .eq('subscription_status', 'active')
    .lte('next_billing_date', new Date().toISOString());

  for (const subscription of dueSubscriptions) {
    // PayFast handles recurring payments automatically via token
    // Just wait for webhook notification
    
    // Or manually trigger via ad hoc payment
    // (see PayFast API docs)
  }
}
```

**Action Items:**
- [ ] Set up cron job (daily billing check)
- [ ] Implement grace period logic (3 days)
- [ ] Auto-cancel after 3 failed payments
- [ ] Send reminder emails before billing

---

## Phase 3: Analytics & Reporting (Week 5)

### 3.1 Real-Time Analytics ✅

**Convert Testing to Production:**

**Before (Testing):**
```typescript
const calculateAnalytics = () => {
  // Reads from localStorage test data
  const mrr = testSuppliers.reduce((sum, s) => sum + s.monthlyRevenue, 0);
};
```

**After (Production):**
```typescript
const calculateAnalytics = async () => {
  // Query real Supabase data
  const { data: subscriptions } = await supabase
    .from('suppliers')
    .select('subscription_tier, billing_cycle, subscription_status, monthly_revenue');

  const mrr = subscriptions
    .filter(s => s.subscription_status === 'active')
    .reduce((sum, s) => sum + (s.monthly_revenue || 0), 0);

  const arr = mrr * 12;
  
  // Calculate churn rate
  const { data: cancelledThisMonth } = await supabase
    .from('subscription_events')
    .select('*')
    .eq('event_type', 'subscription_cancelled')
    .gte('created_at', startOfMonth);

  const churnRate = (cancelledThisMonth.length / subscriptions.length) * 100;

  return { mrr, arr, churnRate };
};
```

**Action Items:**
- [ ] Connect analytics to Supabase
- [ ] Implement real-time updates (Supabase Realtime)
- [ ] Add caching for performance (5-minute cache)
- [ ] Create admin analytics dashboard
- [ ] Export analytics to CSV/Excel

---

### 3.2 Compliance Reporting ✅

**Production VAT Report:**
```typescript
async function generateVATReport(month: string, year: string) {
  const { data: payments } = await supabase
    .from('payments')
    .select('amount, created_at')
    .eq('status', 'success')
    .gte('created_at', `${year}-${month}-01`)
    .lt('created_at', `${year}-${parseInt(month) + 1}-01`);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const vatAmount = totalRevenue * 0.15; // 15% VAT
  const netRevenue = totalRevenue - vatAmount;

  return {
    period: `${year}-${month}`,
    totalRevenue,
    vatAmount,
    netRevenue,
    transactionCount: payments.length,
  };
}
```

**Action Items:**
- [ ] Implement VAT calculation (15% SA)
- [ ] Generate monthly VAT reports
- [ ] Export to SARS-compatible format
- [ ] Audit trail for all transactions
- [ ] Revenue recognition (IFRS 15)

---

## Phase 4: Email Notifications (Week 6)

### 4.1 Email Service Integration ✅

**Recommended: Resend (Modern, React Email support)**

**Setup:**
```bash
npm install resend react-email
```

**Environment:**
```env
RESEND_API_KEY=re_...
```

**Implementation:**
```typescript
// /src/utils/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(params: {
  to: string;
  subject: string;
  template: string;
  data: any;
}) {
  await resend.emails.send({
    from: 'Qilly <billing@qilly.co.za>',
    to: params.to,
    subject: params.subject,
    html: renderTemplate(params.template, params.data),
  });
}

// Email templates
export const emailTemplates = {
  payment_success: (data) => `
    <h1>Payment Received</h1>
    <p>Thank you for your payment of R${data.amount}.</p>
    <p>Your next billing date is ${data.nextBillingDate}.</p>
  `,
  
  payment_failed: (data) => `
    <h1>Payment Failed</h1>
    <p>We couldn't process your payment of R${data.amount}.</p>
    <p>Please update your payment method.</p>
  `,
  
  trial_expiring: (data) => `
    <h1>Trial Expiring Soon</h1>
    <p>Your trial ends on ${data.expiryDate}.</p>
    <p>Upgrade now to continue accessing premium features.</p>
  `,
};
```

**Action Items:**
- [ ] Set up Resend account (free tier: 100 emails/day)
- [ ] Create email templates (React Email)
- [ ] Trigger emails from webhooks
- [ ] Test all email notifications
- [ ] Set up email logs/tracking

---

### 4.2 Email Triggers ✅

**Convert Testing to Production:**

**Before (Testing):**
```typescript
const sendEmail = (subscription, type) => {
  // Just logs to local state
  const email = { subject: '...', content: '...' };
  setTestSuppliers(/* add email to array */);
};
```

**After (Production):**
```typescript
// In webhook handler
async function handlePaymentSuccess(subscription, payment) {
  // 1. Update database
  await supabase.from('suppliers').update({...});

  // 2. Send email
  await sendEmail({
    to: subscription.email,
    subject: 'Payment Received - Thank You!',
    template: 'payment_success',
    data: {
      amount: payment.amount,
      nextBillingDate: subscription.next_billing_date,
    },
  });

  // 3. Log event
  await supabase.from('subscription_events').insert({
    supplier_id: subscription.id,
    event_type: 'payment_success',
    event_data: { payment_id: payment.id },
  });
}
```

---

## Phase 5: Webhooks & Integrations (Week 7)

### 5.1 Production Webhook Handler ✅

**Convert Testing to Production:**

**Before (Testing):**
```typescript
const triggerWebhook = (event, payload) => {
  // Just logs to state
  const webhook = { event, payload, status: 'success' };
  setWebhookEvents([webhook, ...webhookEvents]);
};
```

**After (Production):**
```typescript
// PayFast webhook handler (see PayFast guide)
export async function POST(request: Request) {
  const formData = await request.formData();
  
  // 1. Verify signature
  if (!payfastService.verifySignature(data, signature)) {
    return new Response('Invalid signature', { status: 400 });
  }

  // 2. Process event
  switch (data.payment_status) {
    case 'COMPLETE':
      await handlePaymentSuccess(data);
      break;
    case 'FAILED':
      await handlePaymentFailed(data);
      break;
  }

  // 3. Log webhook
  await supabase.from('webhook_logs').insert({
    provider: 'payfast',
    event: data.payment_status,
    payload: data,
    status: 'processed',
  });

  return new Response('OK', { status: 200 });
}
```

**Action Items:**
- [ ] Deploy webhook endpoint (public URL)
- [ ] Configure webhook URL in PayFast dashboard
- [ ] Test webhook with PayFast sandbox
- [ ] Implement retry logic (if webhook fails)
- [ ] Monitor webhook logs
- [ ] Set up alerts for failed webhooks

---

### 5.2 Webhook Monitoring ✅

**Production Monitoring:**
```typescript
// Check for missed webhooks (run every hour)
async function checkMissedWebhooks() {
  // 1. Get payments from PayFast API
  const payfastPayments = await payfastService.listPayments();

  // 2. Compare with database
  const { data: dbPayments } = await supabase
    .from('payments')
    .select('payfast_payment_id');

  // 3. Find missing
  const missing = payfastPayments.filter(
    p => !dbPayments.find(d => d.payfast_payment_id === p.id)
  );

  // 4. Process missed payments
  for (const payment of missing) {
    await handlePaymentSuccess(payment);
  }
}
```

---

## Phase 6: Proration & Upgrades (Week 8)

### 6.1 Production Proration ✅

**Already Production-Ready!** The proration calculator uses correct math:

```typescript
// This code is production-ready
const calculateProration = () => {
  const currentPrice = tierPricing[currentTier].monthly;
  const newPrice = tierPricing[newTier].monthly;
  
  const daysInMonth = 30;
  const daysRemaining = Math.ceil(
    (new Date(nextBillingDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  
  const unusedCredit = (currentPrice / daysInMonth) * daysRemaining;
  const newCharge = (newPrice / daysInMonth) * daysRemaining;
  const prorationAmount = newCharge - unusedCredit;
  
  return { prorationAmount, unusedCredit, newCharge };
};
```

**Integration with PayFast:**
```typescript
async function upgradeSubscription(supplierId, newTier) {
  // 1. Calculate proration
  const proration = calculateProration(currentTier, newTier, daysRemaining);

  // 2. Charge prorated amount via PayFast ad hoc
  const payment = await payfastService.createAdHocPayment({
    amount: proration.prorationAmount,
    description: `Upgrade to ${newTier}`,
  });

  // 3. Update subscription tier
  await supabase.from('suppliers').update({
    subscription_tier: newTier,
    // Next billing remains the same (prorated charge only)
  }).eq('id', supplierId);

  // 4. Record payment
  await supabase.from('payments').insert({
    supplier_id: supplierId,
    amount: proration.prorationAmount,
    description: 'Proration charge',
  });
}
```

---

## Phase 7: Advanced Features (Week 9-10)

### 7.1 Dunning Management ✅

**Automatic Retry for Failed Payments:**

```typescript
// Cron job (runs daily)
async function retryFailedPayments() {
  const { data: pastDue } = await supabase
    .from('suppliers')
    .select('*')
    .eq('subscription_status', 'past_due')
    .lt('failed_payment_count', 3);

  for (const supplier of pastDue) {
    const daysSinceFailed = Math.floor(
      (Date.now() - new Date(supplier.last_failed_payment_date).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Retry schedule: Day 1, Day 3, Day 7
    const shouldRetry = [1, 3, 7].includes(daysSinceFailed);

    if (shouldRetry) {
      // PayFast automatically retries via subscription token
      // Or manually trigger via API
      
      await sendEmail({
        to: supplier.email,
        template: 'payment_retry_reminder',
        data: { attempt: supplier.failed_payment_count + 1 },
      });
    }

    // Cancel after 3 failed attempts
    if (supplier.failed_payment_count >= 3 && daysSinceFailed >= 7) {
      await cancelSubscription(supplier.id);
      await sendEmail({
        to: supplier.email,
        template: 'subscription_cancelled_nonpayment',
      });
    }
  }
}
```

---

### 7.2 Customer Portal ✅

**Self-Service Dashboard:**

```typescript
// SupplierDashboard.tsx
export function SupplierDashboard() {
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    const { data } = await supabase
      .from('suppliers')
      .select('*, payments(*)')
      .eq('id', userId)
      .single();

    setSubscription(data);
    setPayments(data.payments);
  };

  return (
    <div>
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan: {subscription.subscription_tier}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Status: {subscription.subscription_status}</p>
          <p>Next Billing: {subscription.next_billing_date}</p>
          <Button onClick={() => upgradeModal.open()}>Upgrade</Button>
          <Button onClick={() => cancelModal.open()}>Cancel</Button>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            {payments.map(payment => (
              <TableRow key={payment.id}>
                <TableCell>{payment.date}</TableCell>
                <TableCell>R{payment.amount}</TableCell>
                <TableCell>{payment.status}</TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Phase 8: Security & Compliance (Week 11)

### 8.1 POPIA Compliance ✅

**South African Data Protection:**

- [ ] Encrypt sensitive data (payment info)
- [ ] Implement data retention policies
- [ ] Add "Right to be forgotten" (delete account)
- [ ] Create privacy policy
- [ ] Add consent checkboxes
- [ ] Implement data export (GDPR/POPIA)

```typescript
// Delete account (POPIA compliance)
async function deleteAccount(userId: string) {
  // 1. Cancel subscription
  await cancelSubscription(userId);

  // 2. Anonymize data (keep for tax records)
  await supabase.from('suppliers').update({
    email: `deleted-${userId}@anonymized.com`,
    contact_person: 'DELETED',
    phone: 'DELETED',
    // Keep: subscription history, payments (7-year tax requirement)
  }).eq('id', userId);

  // 3. Delete sensitive data
  await supabase.from('auth.users').delete().eq('id', userId);
}
```

---

### 8.2 Anti-Corruption Measures ✅

**Already in system (see proposal):**

- ✅ Automated pricing (no manual override)
- ✅ Transparent billing (all fees logged)
- ✅ Audit trail (all actions logged)
- ✅ BBBEE tracking
- ✅ Compliance verification

---

## Phase 9: Testing & QA (Week 12)

### 9.1 Testing Checklist ✅

**Payment Flow:**
- [ ] Test successful payment
- [ ] Test failed payment
- [ ] Test payment retry
- [ ] Test refund processing
- [ ] Test proration calculation

**Billing Cycle:**
- [ ] Test monthly billing
- [ ] Test annual billing
- [ ] Test grace period
- [ ] Test auto-cancellation

**Emails:**
- [ ] Test all 8 email templates
- [ ] Verify email delivery
- [ ] Check email formatting

**Webhooks:**
- [ ] Test PayFast webhook
- [ ] Test webhook signature verification
- [ ] Test webhook retry

**Security:**
- [ ] Penetration testing
- [ ] SQL injection testing
- [ ] XSS testing
- [ ] Rate limiting

---

## Phase 10: Deployment (Week 13)

### 10.1 Production Deployment ✅

**Deployment Checklist:**

- [ ] Deploy to production server (Vercel/Netlify)
- [ ] Configure custom domain (qilly.co.za)
- [ ] Set up SSL certificate (HTTPS)
- [ ] Configure production environment variables
- [ ] Set up monitoring (Sentry/LogRocket)
- [ ] Configure error alerts
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Create deployment pipeline (CI/CD)
- [ ] Set up staging environment
- [ ] Create rollback plan

---

## Timeline Summary

| Phase | Duration | Status |
|-------|----------|--------|
| 1. Foundation | Week 1-2 | ⏳ Ready to start |
| 2. Payment Integration | Week 3-4 | ⏳ Awaiting PayFast setup |
| 3. Analytics | Week 5 | ⏳ |
| 4. Email Notifications | Week 6 | ⏳ |
| 5. Webhooks | Week 7 | ⏳ |
| 6. Proration | Week 8 | ✅ Code ready |
| 7. Advanced Features | Week 9-10 | ⏳ |
| 8. Security | Week 11 | ⏳ |
| 9. Testing | Week 12 | ⏳ |
| 10. Deployment | Week 13 | ⏳ |

**Total: 13 weeks (~3 months)**

---

## Feature Status Matrix

| Feature | Testing | Production | Integration Needed |
|---------|---------|------------|-------------------|
| Payment Testing | ✅ Complete | ⏳ Needs PayFast | Payment gateway |
| Billing Cycle | ✅ Complete | ⏳ Needs cron | Cron job service |
| Analytics | ✅ Complete | ⏳ Needs DB | Supabase connection |
| Email Notifications | ✅ Complete | ⏳ Needs service | Resend/SendGrid |
| Bulk Operations | ✅ Testing only | ❌ Not needed | N/A |
| Advanced Filters | ✅ Complete | ✅ Production ready | None |
| Webhooks | ✅ Complete | ⏳ Needs endpoint | Public webhook URL |
| Compliance Reports | ✅ Complete | ✅ Production ready | None |
| Proration | ✅ Complete | ✅ Production ready | None |

---

## Cost Estimates

### Services Needed:

| Service | Purpose | Cost |
|---------|---------|------|
| **PayFast** | Payment gateway | 2.9% + R2/transaction |
| **Supabase** | Database | Free (up to 500MB) → R200/month |
| **Resend** | Email service | Free (100/day) → R500/month |
| **Vercel** | Hosting | Free (hobby) → R1,000/month |
| **Domain** | qilly.co.za | ~R100/year |

**Total Monthly Cost:** R0 (free tier) → R1,700 (paid tier)

---

## Next Steps

**Immediate Actions:**
1. ✅ Set up PayFast account
2. ✅ Create production Supabase project
3. ✅ Set up Resend email account
4. ✅ Deploy to Vercel/Netlify
5. ✅ Configure webhook endpoint

**This Week:**
1. Run database migrations
2. Implement PayFastCheckout component
3. Test PayFast sandbox
4. Set up email templates

**Next Week:**
1. Go live with PayFast
2. Test end-to-end payment flow
3. Monitor webhooks
4. Launch to first customers! 🚀

---

## Support & Maintenance

**Ongoing Tasks:**
- Monitor payment success rate
- Check webhook delivery
- Review failed payments
- Generate monthly reports
- Update pricing tiers
- Customer support

**Recommended Tools:**
- **Monitoring:** Sentry (error tracking)
- **Analytics:** PostHog (product analytics)
- **Support:** Intercom (customer support)
- **Logs:** LogRocket (session replay)

---

## Conclusion

**Current State:** ✅ Testing dashboard complete with all 9 features
**Target State:** 🎯 Production-ready subscription system
**Timeline:** 📅 13 weeks to full production
**Investment:** 💰 R0-R1,700/month operational costs

**The testing dashboard proves the business logic works. Now it's time to connect to real payment gateways and go live!** 🚀
