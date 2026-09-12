# 🔄 Four-Tier System Flows

## Visual Flow Diagrams

---

## 📊 Tier Comparison Table

| Feature | FREE | PROFESSIONAL | ENTERPRISE | CUSTOM |
|---------|------|--------------|------------|--------|
| **Price** | R0 | R2,999/month | R8,999/month | Custom |
| **BOQs** | Unlimited | 10/month | Unlimited | Unlimited |
| **Training** | ✅ Free | ❌ | ✅ Included | ✅ Included |
| **Support** | Email (48-72h) | Email (24h) | Email (24h) | Call + Email (24h) |
| **eTender** | ❌ | ❌ | ✅ | ✅ |
| **Collusion** | ❌ | ❌ | ✅ | ✅ |
| **Carbon Tracking** | ✅ | ✅ | ✅ | ✅ |
| **Payment** | None | Required | Required | Required |
| **Approval Steps** | 1 (Contractor) | 2 (Contractor + Payment) | 2 (Contractor + Payment) | 2 (Contractor + Payment) |

---

## 🔄 Flow 1: FREE Tier Sign-up to Login

```
┌─────────────────────────────────────────────────────────────┐
│                    FREE TIER FLOW                            │
└─────────────────────────────────────────────────────────────┘

Step 1: CONTRACTOR SIGN-UP
┌──────────────────────┐
│ Contractor visits    │
│ sign-up page         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Sees 4 tier cards    │
│ Clicks "FREE"        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Fills company        │
│ details form         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Submits application  │
│                      │
│ Database:            │
│ - status: pending    │
│ - tier: FREE         │
│ - payment_approved:  │
│   TRUE (automatic)   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Shows message:       │
│ "Awaiting admin      │
│  approval"           │
└──────────────────────┘

Step 2: ADMIN APPROVAL
┌──────────────────────┐
│ Admin logs in        │
│ Contractors tab      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Sees contractor      │
│ Status: "Pending"    │
│ Tier: FREE           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Reviews details      │
│ Clicks "Approve"     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Database:            │
│ - status: approved   │
│ - approved_at: now   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Toast:               │
│ "Contractor approved!│
│  They can login with │
│  FREE tier"          │
└──────────────────────┘

Step 3: CONTRACTOR LOGIN
┌──────────────────────┐
│ Contractor attempts  │
│ login                │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ System checks:       │
│ ✅ Status: approved  │
│ ✅ Tier: FREE        │
│ (no payment check)   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ ✅ LOGIN SUCCESS     │
│ Access dashboard     │
│ Generate unlimited   │
│ BOQs                 │
└──────────────────────┘
```

---

## 🔄 Flow 2: PAID Tier Sign-up to Login

```
┌─────────────────────────────────────────────────────────────┐
│         PROFESSIONAL/ENTERPRISE/CUSTOM TIER FLOW            │
└─────────────────────────────────────────────────────────────┘

Step 1: CONTRACTOR SIGN-UP
┌──────────────────────┐
│ Contractor visits    │
│ sign-up page         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Sees 4 tier cards    │
│ Clicks "PROFESSIONAL"│
│ (R2,999/month)       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Fills company        │
│ details form         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Submits application  │
│                      │
│ Database:            │
│ - status: pending    │
│ - tier: PROFESSIONAL │
│ - payment_approved:  │
│   FALSE              │
│ - monthly_boq_limit: │
│   10                 │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Shows message:       │
│ "Awaiting admin      │
│  approval. Payment   │
│  verification needed"│
└──────────────────────┘

Step 2A: ADMIN CONTRACTOR APPROVAL
┌──────────────────────┐
│ Admin logs in        │
│ Contractors tab      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Sees contractor      │
│ Status: "Pending"    │
│ Tier: PROFESSIONAL   │
│ (R2,999/month)       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Reviews details      │
│ Clicks "Approve"     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Database:            │
│ - status: approved   │
│ - approved_at: now   │
│ - payment_approved:  │
│   still FALSE        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Toast:               │
│ "Contractor approved!│
│  ⚠️ Please verify   │
│  payment (R2,999)    │
│  to enable login"    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Status badge changes:│
│ "⚠️ Payment Pending" │
└──────────────────────┘

Step 2B: ADMIN PAYMENT APPROVAL
┌──────────────────────┐
│ Admin clicks         │
│ "Verify Payment"     │
│ button               │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Modal shows:         │
│ - Tier: PROFESSIONAL │
│ - Price: R2,999/month│
│ - Method: [dropdown] │
│ - Reference: [input] │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Admin enters:        │
│ - Method: "manual"   │
│ - Ref: "PAY001"      │
│ Clicks "Confirm"     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Database:            │
│ - payment_approved:  │
│   TRUE               │
│ - payment_method:    │
│   "manual"           │
│ - payment_reference: │
│   "PAY001"           │
│ - payment_approved_  │
│   at: now            │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Toast:               │
│ "✅ Payment verified!│
│  Contractor can now  │
│  login"              │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Status badge:        │
│ "✅ Active"          │
└──────────────────────┘

Step 3: CONTRACTOR LOGIN ATTEMPT (Before Payment)
┌──────────────────────┐
│ Contractor tries     │
│ to login             │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ System checks:       │
│ ✅ Status: approved  │
│ ❌ Payment: FALSE    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ ❌ LOGIN BLOCKED     │
│ Error: "Payment      │
│ verification pending │
│ Contact admin"       │
└──────────────────────┘

Step 4: CONTRACTOR LOGIN (After Payment)
┌──────────────────────┐
│ Contractor tries     │
│ to login (after      │
│ payment verified)    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ System checks:       │
│ ✅ Status: approved  │
│ ✅ Payment: TRUE     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ ✅ LOGIN SUCCESS     │
│ Access dashboard     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ PROFESSIONAL:        │
│ - Generate 10 BOQs/  │
│   month              │
│ - 11th shows error   │
│                      │
│ ENTERPRISE/CUSTOM:   │
│ - Unlimited BOQs     │
│ - All features       │
└──────────────────────┘
```

---

## 🔄 Flow 3: Monthly BOQ Limit (PROFESSIONAL)

```
┌─────────────────────────────────────────────────────────────┐
│           PROFESSIONAL TIER BOQ LIMIT FLOW                  │
└─────────────────────────────────────────────────────────────┘

Month 1 - March 2026
┌──────────────────────┐
│ Generate BOQ #1      │
│                      │
│ Database:            │
│ - boqs_generated:    │
│   0 → 1              │
│ - limit: 10          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Toast: "BOQ generated│
│ 9 remaining this     │
│ month"               │
└──────────────────────┘
           │
           ▼
     [Generate more...]
           │
           ▼
┌──────────────────────┐
│ Generate BOQ #10     │
│                      │
│ Database:            │
│ - boqs_generated:    │
│   9 → 10             │
│ - limit: 10          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Toast: "BOQ generated│
│ 0 remaining this     │
│ month. Upgrade to    │
│ ENTERPRISE for more" │
└──────────────────────┘
           │
           ▼
┌──────────────────────┐
│ Try BOQ #11          │
│                      │
│ System checks:       │
│ - generated: 10      │
│ - limit: 10          │
│ - 10 >= 10? YES      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ ❌ BLOCKED           │
│ Error: "Monthly limit│
│ reached (10 BOQs).   │
│ Upgrade to ENTERPRISE│
│ for unlimited"       │
└──────────────────────┘

Month 2 - April 2026
┌──────────────────────┐
│ Generate BOQ         │
│                      │
│ System detects:      │
│ - current_month_start│
│   = March 1          │
│ - now = April 5      │
│ - Different month!   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Auto-reset:          │
│ - boqs_generated:    │
│   10 → 0             │
│ - current_month_start│
│   = April 1          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ ✅ Generate BOQ #1   │
│ (new month)          │
│                      │
│ Toast: "BOQ generated│
│ 9 remaining this     │
│ month"               │
└──────────────────────┘
```

---

## 🔄 Flow 4: Admin Two-Step Approval UI

```
┌─────────────────────────────────────────────────────────────┐
│              ADMIN DASHBOARD - CONTRACTORS TAB              │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Contractors Table                                            │
├──────────────┬───────────┬────────────┬──────────────────────┤
│ Company      │ Tier      │ Status     │ Actions              │
├──────────────┼───────────┼────────────┼──────────────────────┤
│ ABC Ltd      │ FREE      │ ⏳ Pending │ [View] [Approve]     │
├──────────────┼───────────┼────────────┼──────────────────────┤
│ XYZ Co       │ PRO       │ ⏳ Pending │ [View] [Approve]     │
│              │ R2,999    │            │                      │
├──────────────┼───────────┼────────────┼──────────────────────┤
│ DEF Corp     │ ENT       │ ⚠️ Payment │ [View] [Verify       │
│              │ R8,999    │ Pending    │  Payment]            │
├──────────────┼───────────┼────────────┼──────────────────────┤
│ GHI Pty      │ FREE      │ ✅ Active  │ [View]               │
└──────────────┴───────────┴────────────┴──────────────────────┘

Click "Approve" on ABC Ltd (FREE):
┌─────────────────────────────────────────┐
│ Contractor Approved! ✅                 │
│                                         │
│ ABC Ltd can now login with FREE tier    │
│ access and free training.               │
│                                         │
│ No payment verification needed.         │
└─────────────────────────────────────────┘

Click "Approve" on XYZ Co (PROFESSIONAL):
┌─────────────────────────────────────────┐
│ Contractor Approved! ⚠️                 │
│                                         │
│ XYZ Co approved!                        │
│                                         │
│ ⚠️ Please verify payment (PROFESSIONAL: │
│    R2,999/month) to enable login.       │
│                                         │
│ Status changed to "Payment Pending"     │
└─────────────────────────────────────────┘

Click "Verify Payment" on DEF Corp (ENTERPRISE):
┌─────────────────────────────────────────┐
│ Verify Payment - DEF Corp               │
│                                         │
│ Tier: ENTERPRISE                        │
│ Price: R8,999/month                     │
│                                         │
│ Payment Method:                         │
│ [Manual ▼] [Stitch] [PayFast]          │
│                                         │
│ Payment Reference:                      │
│ [PAY-ENT-001_____________]              │
│                                         │
│ [Cancel]  [Verify Payment]              │
└─────────────────────────────────────────┘

After verification:
┌─────────────────────────────────────────┐
│ Payment Verified! ✅                    │
│                                         │
│ DEF Corp can now login and access all   │
│ ENTERPRISE features.                    │
└─────────────────────────────────────────┘
```

---

## 📋 Admin Checklist

### When approving contractor:

**FREE Tier:**
- [ ] Review company legitimacy
- [ ] Click "Approve Contractor"
- [ ] Contractor can login immediately
- ✅ Done (1 step)

**PAID Tier (Professional/Enterprise/Custom):**
- [ ] Review company legitimacy
- [ ] Click "Approve Contractor"
- [ ] Wait for payment (or check bank/payment gateway)
- [ ] Click "Verify Payment"
- [ ] Enter payment method & reference
- [ ] Contractor can now login
- ✅ Done (2 steps)

### Validation Rules:
1. ❌ Cannot approve payment without contractor approval
2. ✅ FREE tier auto-approves payment (no admin action needed)
3. ✅ PAID tiers must have manual payment verification
4. ✅ Contractor cannot login until BOTH approvals done (PAID tiers)

---

## 🎯 For Tuesday Demo

**Show eTender this flow:**

1. **Sign-up** → "See our 4 tiers, FREE with training!"
2. **Select ENTERPRISE** → "R8,999/month with eTender integration"
3. **Admin Dashboard** → "Two-step approval for quality control"
4. **Approve Contractor** → "Verified company legitimacy"
5. **Verify Payment** → "Payment confirmed via [method]"
6. **Contractor Login** → "Full access to all features"
7. **Generate BOQ** → "Unlimited BOQs with carbon tracking"

**Key talking points:**
- ✅ Quality control (admin approval)
- ✅ Payment verification (no fraud)
- ✅ FREE tier for SME development
- ✅ Clear upgrade path
- ✅ eTender integration (Enterprise+)
- ✅ Carbon tracking (all tiers)

---

**Ready for implementation!** Follow `/QUICK_START_FOUR_TIERS.md` for step-by-step code changes.
