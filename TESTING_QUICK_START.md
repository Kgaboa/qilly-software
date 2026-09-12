# 🚀 Quick Start: Testing Subscription Features

## The Problem You Had
> "What happens after EFT payment? How do I test subscription features after free trial is blocked?"

## The Solution
**New "Dev Tools" Tab in Admin Dashboard** - Your testing command center!

---

## ⚡ FASTEST Way to Test (30 seconds)

### Option 1: Instant Subscription Activation
```
1. Login as admin (admin@qilly.com / admin123)
2. Click "Dev Tools" tab
3. Select tier (Professional/Enterprise/Custom)
4. Click "Activate [TIER] Now"
5. Done! Process unlimited BOQs
```

### Option 2: Test Free Trial Block
```
1. In Dev Tools → Click "Reset My Trial"
2. Logout, login as regular user
3. Upload 1 BOQ → Works ✅
4. Try 2nd BOQ → BLOCKED ❌ → Upgrade modal appears
5. Back to Dev Tools → Activate subscription
6. Now unlimited BOQs ✅
```

---

## 🏦 What Happens After Each Payment Method?

### EFT (Bank Transfer)
```
USER SIDE:
├─ Select EFT payment
├─ Get unique reference: QILLY-2026-USER-12345678
├─ See bank details (FNB account)
├─ Download invoice PDF
└─ Make bank transfer (user does this offline)

ADMIN SIDE:
├─ Go to Admin → "Payments" tab
├─ See pending invoice in table
├─ Verify payment received in bank
├─ Click "Verify & Activate"
└─ Subscription activated immediately

RESULT:
├─ user.subscription_tier = "professional"
├─ user.subscription_status = "active"
├─ user.paid_status = true
├─ user.boq_count = 0 (reset)
└─ Unlimited BOQ processing ✅
```

### Stitch / PayFast (Instant)
```
USER SIDE:
├─ Select Stitch or PayFast
├─ Complete simulated payment
└─ Instant success message

RESULT:
└─ Subscription activated IMMEDIATELY (no admin needed)
```

### Contact Sales
```
USER SIDE:
├─ Select "Contact Sales"
├─ Fill optional message
└─ Submit request

ADMIN SIDE:
├─ Go to Admin → "Payments" → "Sales Requests" tab
├─ See request with customer details
├─ Can mark as: Contacted / Declined / Converted
└─ If Converted → Subscription activated

RESULT:
└─ When admin marks "Converted" → Subscription active
```

---

## 🧪 Complete Testing Scenarios

### Scenario 1: Test Free Trial Block → EFT Payment → Admin Verification

**Step 1: Setup**
```bash
Admin Dashboard → Dev Tools → Reset My Trial
Logout → Login as regular user (demo@test.com)
```

**Step 2: Test Free Trial**
```bash
Dashboard → Upload BOQ → Process ✅ (1st BOQ works)
Try 2nd BOQ → BLOCKED ❌
Upgrade Modal appears with 4 payment options
```

**Step 3: Choose EFT Payment**
```bash
Select "Bank EFT" tab
See reference number: QILLY-2026-DEMOTE-87654321
Click "Copy" to copy reference
Click "Download Invoice PDF"
```

**Step 4: Admin Verification**
```bash
Logout → Login as admin (admin@qilly.com)
Admin Dashboard → "Payments" tab
See pending invoice in table
Click "View" → "Verify & Activate"
```

**Step 5: Test Success**
```bash
Logout → Login as user again
Upload multiple BOQs → All work ✅
Check badge → "Professional" tier shown
```

### Scenario 2: Instant Testing (Skip Payment Flow)

**For immediate testing:**
```bash
Admin → Dev Tools
Select: Professional + Monthly
Click: "Activate Professional Now"
Process unlimited BOQs immediately ✅
```

**Test different tiers:**
```bash
Professional → Test unlimited BOQs
Enterprise → Test advanced features
Custom → Test white-label features
```

**Reset when done:**
```bash
Dev Tools → "Reset My Trial"
Back to free tier with 1 free BOQ
```

---

## 📊 Where Everything is Stored

```javascript
// All data in localStorage:

localStorage.getItem('demo_users')
// Current user's subscription status, BOQ count, tier

localStorage.getItem('pending_invoices')
// EFT invoices awaiting admin verification

localStorage.getItem('upgrade_requests')
// Contact sales requests

localStorage.getItem('stitch_payments')
// Stitch payment history

localStorage.getItem('payfast_payments')
// PayFast payment history
```

---

## 🎯 Key Admin Dashboard Tabs

### 1. **Payments** (NEW!)
- **EFT Payments**: Verify bank transfers
- **Sales Requests**: Manage contact sales requests
- Stats: Pending, Verified, Revenue

### 2. **Dev Tools** (NEW!)
- **Current User Quick Actions**
  - Reset trial
  - Activate subscription
  - Simulate BOQ usage
  - View user info
  
- **Manage Specific User**
  - Reset any user's trial
  - Activate subscription for any email
  
- **Payment Data**
  - Clear all payment history
  - Clear all users (danger!)

### 3. **Subs Test**
- Advanced subscription testing
- Generate random test data
- Simulate payments, renewals, cancellations

---

## 💡 Testing Tips

### Quick Subscription Testing:
```bash
# Want to test Professional tier features?
Dev Tools → Activate Professional → Test immediately

# Want to test trial block?
Dev Tools → Reset Trial → Try 2nd BOQ

# Want to test EFT verification?
Select EFT → Admin → Payments → Verify

# Want to see all users?
Dev Tools → "List All Users" → Check console
```

### Simulate Different BOQ Counts:
```bash
Dev Tools → Simulate BOQ Usage
- Set to 0: Fresh account
- Set to 1: At trial limit
- Set to 5: Active user
- Set to 10: Heavy user
```

### Test Multiple Users:
```bash
# User 1: Free trial
Email: demo@test.com
Dev Tools → Reset Trial

# User 2: Professional
Email: pro@test.com (register new)
Dev Tools → Activate Professional

# User 3: Enterprise
Email: ent@test.com (register new)
Dev Tools → Activate Enterprise
```

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                   NEW USER REGISTERS                │
│         subscription_tier: "free"                   │
│         boq_count: 0                                │
│         paid_status: false                          │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│            PROCESS 1st BOQ → SUCCESS ✅             │
│         boq_count: 1                                │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│      TRY 2nd BOQ → BLOCKED ❌                       │
│      "Free trial used. Please upgrade."             │
│      Upgrade Modal appears                          │
└───────────────────┬─────────────────────────────────┘
                    │
         ┌──────────┼──────────┬──────────┐
         │          │          │          │
         ▼          ▼          ▼          ▼
    ┌─────┐   ┌────────┐  ┌────────┐ ┌────────┐
    │ EFT │   │Stitch  │  │PayFast │ │Contact │
    │     │   │        │  │        │ │ Sales  │
    └─────┘   └────────┘  └────────┘ └────────┘
       │           │          │          │
       ▼           ▼          ▼          ▼
  Admin       Instant    Instant    Sales Team
  Verifies    Active     Active     Converts
       │           │          │          │
       └───────────┴──────────┴──────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│         SUBSCRIPTION ACTIVATED ✅                   │
│         subscription_tier: "professional"           │
│         subscription_status: "active"               │
│         paid_status: true                           │
│         boq_count: 0 (reset)                        │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│         UNLIMITED BOQ PROCESSING ✅                 │
│         All tier features unlocked                  │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Summary

### What happens after EFT payment?
1. Invoice created with unique reference
2. Saved to `pending_invoices` in localStorage
3. Admin sees it in **"Payments"** tab
4. Admin verifies and clicks **"Verify & Activate"**
5. User subscription instantly activated
6. User can process unlimited BOQs

### How to test after free trial blocked?
**FASTEST**: `Admin → Dev Tools → Activate Subscription`

**COMPLETE FLOW**: 
1. `Dev Tools → Reset Trial`
2. Process 1 BOQ (works)
3. Try 2nd BOQ (blocked)
4. Select payment method
5. `Admin → Payments → Verify` (for EFT)
6. Process unlimited BOQs

**KEY TOOL**: **Developer Tools tab** - Your testing command center!

---

## 🎓 Need Help?

```bash
# View current user data:
Dev Tools → "View Current User" → Check console

# See all users:
Dev Tools → "List All Users" → Check console

# Reset everything:
Dev Tools → "Clear All Users" → Start fresh

# Check payment data:
Admin → Payments → See all invoices and requests
```

**Everything is reversible and safe in demo mode!**
