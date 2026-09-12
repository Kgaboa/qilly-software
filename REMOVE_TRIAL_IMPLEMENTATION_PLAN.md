# Implementation Plan: Remove Trial Billing, Add Payment at Sign-Up

## 🎯 New Business Model

### Before (Current - Complex):
```
Sign Up → Admin Approval → 3 Free Trial BOQs → Trial Expires → Upgrade Prompt → Payment
```

### After (New - Simple):
```
Sign Up → Choose Tier → Payment (if paid tier) → Admin Approval → Full Access
```

## 💰 New Tier Structure

### FREE Tier
- **Price:** R0/month
- **Includes:** 
  - ✅ Free training sessions
  - ✅ Access to basic features
  - ✅ Limited to X BOQs per month (configurable)
  - ✅ Community support
- **No Payment Required**

### BASIC Tier
- **Price:** R500/month
- **Includes:**
  - ✅ Everything in FREE
  - ✅ Unlimited BOQs
  - ✅ Email support
  - ✅ Export to Excel/PDF

### PROFESSIONAL Tier
- **Price:** R1,500/month
- **Includes:**
  - ✅ Everything in BASIC
  - ✅ Priority support
  - ✅ Advanced analytics
  - ✅ Carbon tracking
  - ✅ Multi-user access (up to 5 users)

### ENTERPRISE Tier
- **Price:** Custom pricing
- **Includes:**
  - ✅ Everything in PROFESSIONAL
  - ✅ Dedicated account manager
  - ✅ Custom integrations
  - ✅ Unlimited users
  - ✅ SLA guarantees
  - ✅ On-premise deployment option

---

## 📋 Implementation Checklist

### Phase 1: Remove Trial Billing Logic

#### ✅ Database Changes
- [ ] Remove `trial_bills_remaining` column from contractors table
- [ ] Remove `trial_used` references from code
- [ ] Update contractors to have clear `subscription_tier` and `subscription_status`

#### ✅ Code Changes - Remove Trial Logic
Files to update:
1. `/src/app/components/MainDashboard.tsx`
   - Remove trial counter decrement logic
   - Remove trial expiry warnings
   - Remove trial badge display
   - Remove trial check before BOQ generation

2. `/src/utils/api.ts`
   - Remove trial counter checks
   - Remove trial decrement logic
   - Remove trial expiry error messages

3. `/src/app/components/AdminDashboard.tsx`
   - Remove trial references in approval flow

4. `/src/app/components/payments/StitchPayment.tsx`
   - Remove `trial_used` reset logic

5. `/src/app/components/payments/PayFastPayment.tsx`
   - Remove `trial_used` reset logic

### Phase 2: Add Payment Tier Selection at Sign-Up

#### ✅ New Sign-Up Flow
1. **Step 1:** Business Information (existing)
2. **Step 2:** Select Tier → NEW!
   - Show tier comparison table
   - FREE tier = No payment
   - Paid tiers = Proceed to payment
3. **Step 3:** Payment (only for paid tiers) → NEW!
   - Stitch or PayFast integration
   - Skip if FREE tier
4. **Step 4:** Confirmation
   - FREE: "Account created! Free training included."
   - PAID: "Payment successful! Full access after admin approval."

#### ✅ Files to Create/Update

**New Component:** `/src/app/components/TierSelectionStep.tsx`
```tsx
- Displays tier comparison cards
- Highlights benefits per tier
- "Select FREE" button → Skip payment, create account
- "Select BASIC/PRO/ENTERPRISE" → Go to payment step
```

**Update:** `/src/app/components/ContractorSignup.tsx`
```tsx
- Add tier selection step after business info
- Add payment step for paid tiers
- Update contractor record with selected tier
- Set subscription_status based on tier:
  - FREE → 'active' immediately
  - PAID → 'active' after payment confirmation
```

**New Component:** `/src/app/components/TierComparisonTable.tsx`
```tsx
- Beautiful tier comparison
- Feature checkmarks
- Price display
- "Popular" badge on Professional tier
- Call-to-action buttons
```

### Phase 3: Update Dashboard Access Logic

#### ✅ Access Control Based on Tier

**FREE Tier Users:**
- Can generate up to X BOQs per month (configurable limit)
- See "Upgrade" CTA in dashboard
- Access to training materials

**PAID Tier Users:**
- Unlimited BOQ generation
- No upgrade prompts
- Full feature access based on tier

---

## 🗄️ Database Schema Changes

### SQL Script to Remove Trial Columns

```sql
-- ================================================
-- REMOVE TRIAL BILLING COLUMNS
-- ================================================

-- Step 1: Remove trial_bills_remaining from contractors (if exists)
ALTER TABLE public.contractors 
DROP COLUMN IF EXISTS trial_bills_remaining;

-- Step 2: Remove trial_bills_remaining from users (if exists)
ALTER TABLE public.users 
DROP COLUMN IF EXISTS trial_bills_remaining;

-- Step 3: Update all FREE tier contractors to 'active' status
UPDATE public.contractors
SET subscription_status = 'active'
WHERE subscription_tier = 'FREE' 
  AND subscription_status = 'trial';

-- Step 4: Remove 'free_trial' tier, convert to 'FREE'
UPDATE public.contractors
SET subscription_tier = 'FREE'
WHERE subscription_tier IN ('free_trial', 'trial');

-- Step 5: Verify changes
SELECT 
  subscription_tier,
  subscription_status,
  COUNT(*) as contractor_count
FROM public.contractors
GROUP BY subscription_tier, subscription_status
ORDER BY subscription_tier;
```

### New Subscription Tier Values

```sql
-- Valid subscription_tier values:
'FREE'          -- Free tier with training
'BASIC'         -- R500/month
'PROFESSIONAL'  -- R1,500/month
'ENTERPRISE'    -- Custom pricing

-- Valid subscription_status values:
'active'        -- Subscription is active (FREE or paid)
'cancelled'     -- User cancelled subscription
'expired'       -- Payment failed or subscription lapsed
'pending'       -- Awaiting payment confirmation
```

---

## 🎨 UI/UX Changes

### Sign-Up Flow

**Before:**
```
1. Fill form
2. Submit
3. Wait for approval
4. Login → 3 free trials
5. Use trials → upgrade prompt
```

**After:**
```
1. Fill business info
2. Choose tier (FREE or PAID)
   ├─ FREE: Continue to confirmation
   └─ PAID: Go to payment
3. Payment (if paid tier)
4. Confirmation with tier benefits
5. Wait for admin approval
6. Login → Full access based on tier
```

### Dashboard Changes

**Remove:**
- ❌ Trial counter badge
- ❌ "X free bills remaining" message
- ❌ "Trial complete" warnings
- ❌ Trial decrement logic

**Add:**
- ✅ Current tier badge (FREE/BASIC/PRO/ENTERPRISE)
- ✅ "Upgrade" button (for FREE tier only)
- ✅ Monthly BOQ usage counter (for FREE tier)
- ✅ "Training Resources" section (FREE tier)

---

## 📊 Benefits for Tuesday Presentation

### Why This is Better for eTender Demo:

1. **Clearer Value Proposition**
   - "Free training included" is more valuable than "3 free trials"
   - Shows commitment to customer success

2. **Simpler User Journey**
   - No confusion about trial limits
   - Users know exactly what they're getting upfront

3. **Better Revenue Model**
   - Captures payment intent early
   - Reduces friction in conversion funnel

4. **Professional Positioning**
   - "Free training" sounds more enterprise-ready
   - Aligns with DHS's focus on capacity building

5. **Easier to Demo**
   - No need to explain trial mechanics
   - Focus on features, not limits

---

## 🚀 Implementation Priority (for Tuesday)

### CRITICAL (Must Have):
1. ✅ Remove trial counter from dashboard UI
2. ✅ Add tier selection step to sign-up
3. ✅ Update database to remove trial columns
4. ✅ Test FREE tier sign-up flow
5. ✅ Update admin approval to respect tiers

### IMPORTANT (Should Have):
6. ✅ Create tier comparison table
7. ✅ Add payment integration for paid tiers
8. ✅ Update access control logic
9. ✅ Add "Upgrade" CTA in dashboard

### NICE TO HAVE (Can Wait):
10. ⏳ Monthly BOQ usage limits for FREE tier
11. ⏳ Training resources section
12. ⏳ Enterprise tier custom pricing flow

---

## 🧪 Testing Checklist

### Before Tuesday:
- [ ] FREE tier sign-up works end-to-end
- [ ] BASIC tier sign-up → payment → approval works
- [ ] No trial counter appears in dashboard
- [ ] Admin can see contractor's selected tier
- [ ] BOQ generation works for all tiers
- [ ] No errors in console about trial_bills_remaining

---

## 💬 Messaging for eTender

### Pitch Points:
- "We've removed trial complexity in favor of **free training**"
- "Contractors choose their tier upfront for **transparency**"
- "FREE tier includes **comprehensive training** from our team"
- "Aligns with DHS's focus on **SME development and capacity building**"
- "Simple, clear pricing - no hidden limits or surprise upgrades"

---

Ready to implement? Let's start with Phase 1!
