# Four-Tier System Implementation Guide

## 🎯 Overview

Implementing a 4-tier subscription system with two-step admin approval:
1. **Contractor Sign-up** → Selects tier, enters details, submits
2. **Admin Approval Step 1** → Admin approves contractor (legitimacy check)
3. **Admin Approval Step 2** → Admin approves/verifies payment (PAID tiers only)
4. **Contractor Login** → FREE can login after Step 1, PAID needs Step 1 + Step 2

---

## 📊 Four Tiers

### 1. FREE Tier
- **Price:** R0/month
- **BOQs:** Unlimited
- **Features:** All core features + Free training
- **Support:** Email (48-72hr)
- **Payment:** No payment required
- **Approval:** Contractor approval only (no payment approval needed)

### 2. PROFESSIONAL Tier
- **Price:** R2,999/month
- **BOQs:** 10 per month
- **Features:** All core features (no eTender, no collusion)
- **Support:** Priority email (24hr)
- **Payment:** Required (manual/Stitch/PayFast)
- **Approval:** Contractor approval + Payment approval

### 3. ENTERPRISE Tier
- **Price:** R8,999/month
- **BOQs:** Unlimited
- **Features:** All features + eTender + Collusion detection
- **Support:** 24h email support
- **Payment:** Required (manual/Stitch/PayFast)
- **Approval:** Contractor approval + Payment approval

### 4. CUSTOM Tier
- **Price:** Custom pricing (set by admin)
- **BOQs:** Unlimited
- **Features:** Everything Qilly can offer
- **Support:** 24h call & email support
- **Payment:** Required (manual/custom arrangement)
- **Approval:** Contractor approval + Payment approval

---

## 🔄 Sign-up & Approval Flow

### Step 1: Contractor Sign-up
```
1. Contractor visits sign-up page
2. Sees tier selection cards (FREE, PROFESSIONAL, ENTERPRISE, CUSTOM)
3. Clicks tier → Enters company details
4. Submits application
5. System creates contractor record with:
   - status: 'pending'
   - subscription_tier: selected tier
   - payment_approved: FALSE (for paid tiers), TRUE (for FREE)
6. Contractor sees: "Application submitted! Awaiting admin approval."
```

### Step 2: Admin Contractor Approval
```
1. Admin logs in → Contractors tab
2. Sees pending contractor with tier badge
3. Reviews company details
4. Clicks "Approve Contractor"
5. System updates:
   - status: 'approved'
   - approved_at: timestamp
6. For FREE tier:
   - Contractor can login immediately ✅
   - Toast: "Contractor approved! They can login with FREE tier."
7. For PAID tiers (PROFESSIONAL/ENTERPRISE/CUSTOM):
   - Contractor CANNOT login yet ❌
   - Admin sees "Payment Pending" badge
   - Toast: "Contractor approved! Please verify payment to enable login."
```

### Step 3: Admin Payment Approval (PAID tiers only)
```
1. Admin sees approved contractor with "Payment Pending" badge
2. Admin clicks "Verify Payment"
3. Modal shows:
   - Tier: PROFESSIONAL
   - Price: R2,999/month
   - Payment method: [Manual/Stitch/PayFast]
   - Payment reference: [Input field]
4. Admin enters payment details and confirms
5. System updates:
   - payment_approved: TRUE
   - payment_approved_at: timestamp
   - payment_approved_by: admin user ID
   - payment_method: selected method
   - payment_reference: reference number
6. Contractor can now login ✅
7. Toast: "Payment verified! Contractor can now access the platform."
```

### Step 4: Contractor Login
```
1. Contractor attempts login
2. System checks:
   a. Is contractor approved? (status === 'approved')
   b. Is tier FREE?
      - Yes: Allow login ✅
      - No: Check payment_approved
        - TRUE: Allow login ✅
        - FALSE: Show error "Payment pending - contact admin" ❌
3. Contractor accesses dashboard
```

---

## 🗄️ Database Changes

### Run Migration SQL First!
```bash
File: /FOUR_TIER_DATABASE_MIGRATION.sql
Run in: Supabase SQL Editor
Time: ~2 minutes
```

### New Columns in `contractors` table:
```sql
payment_approved         BOOLEAN      -- TRUE if payment verified by admin
payment_approved_at      TIMESTAMPTZ  -- When payment was approved
payment_approved_by      TEXT         -- Admin user ID who approved
payment_method           TEXT         -- 'manual', 'stitch', 'payfast', 'free'
payment_reference        TEXT         -- Payment tracking reference
monthly_boq_limit        INTEGER      -- 10 for Professional, NULL for others
boqs_generated_this_month INTEGER     -- Counter for monthly limit
current_month_start      TIMESTAMPTZ  -- Start of billing month
```

### New Table: `pricing_tiers`
```sql
id              TEXT PRIMARY KEY  -- 'FREE', 'PROFESSIONAL', 'ENTERPRISE', 'CUSTOM'
name            TEXT              -- Display name
price_monthly   DECIMAL           -- Monthly price
price_annual    DECIMAL           -- Annual price (optional)
boq_limit       INTEGER           -- Monthly BOQ limit (NULL = unlimited)
features        JSONB             -- Feature set
```

---

## 💻 Code Changes Required

### 1. ContractorSignup.tsx
**Add tier selection step:**
```typescript
// Before company details form, show TierSelectionStep
const [selectedTier, setSelectedTier] = useState<string>('FREE');
const [tierPrice, setTierPrice] = useState<number>(0);

// Step 1: Tier Selection
<TierSelectionStep 
  onSelectTier={(tierId, tierName, price) => {
    setSelectedTier(tierId);
    setTierPrice(price);
    setCurrentStep('details'); // Move to company details
  }}
/>

// Step 2: Company Details
// (existing form)

// On submit, include tier:
subscription_tier: selectedTier,
payment_approved: selectedTier === 'FREE' ? true : false
```

### 2. AdminDashboard.tsx - Contractors Tab
**Add two-step approval UI:**

```typescript
// Show contractor status badge
const getContractorStatusBadge = (contractor: any) => {
  if (contractor.status === 'pending') {
    return <Badge variant="outline" className="bg-yellow-50">Pending Review</Badge>;
  }
  
  if (contractor.status === 'approved') {
    // FREE tier - fully approved
    if (contractor.subscription_tier === 'FREE') {
      return <Badge variant="outline" className="bg-green-50">✅ Active</Badge>;
    }
    
    // PAID tier - check payment approval
    if (contractor.payment_approved) {
      return <Badge variant="outline" className="bg-green-50">✅ Active</Badge>;
    } else {
      return <Badge variant="outline" className="bg-orange-50">⏳ Payment Pending</Badge>;
    }
  }
  
  return <Badge variant="outline" className="bg-red-50">Rejected</Badge>;
};

// Contractor approval handler
const handleApproveContractor = async (contractor: any) => {
  // Update contractor status
  await supabase
    .from('contractors')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('id', contractor.id);
  
  // Show appropriate message
  if (contractor.subscription_tier === 'FREE') {
    toast.success(`${contractor.company_name} approved! They can login now.`);
  } else {
    toast.success(`${contractor.company_name} approved! Please verify payment to enable login.`);
    // Show payment verification modal
    setShowPaymentVerificationModal(true);
    setSelectedContractor(contractor);
  }
};

// Payment approval handler
const handleApprovePayment = async (contractor: any, paymentDetails: any) => {
  await supabase
    .from('contractors')
    .update({
      payment_approved: true,
      payment_approved_at: new Date().toISOString(),
      payment_approved_by: adminUser.id,
      payment_method: paymentDetails.method,
      payment_reference: paymentDetails.reference
    })
    .eq('id', contractor.id);
  
  toast.success(`Payment verified! ${contractor.company_name} can now login.`);
};
```

### 3. Login Check (MainDashboard.tsx or auth logic)
**Update login validation:**

```typescript
// In contractor login flow
const validateContractorLogin = async (contractorData: any) => {
  // Check 1: Is contractor approved?
  if (contractorData.status !== 'approved') {
    toast.error('Your application is pending admin approval.');
    return false;
  }
  
  // Check 2: If FREE tier, allow login
  if (contractorData.subscription_tier === 'FREE') {
    return true; // ✅ FREE tier can login after approval
  }
  
  // Check 3: If PAID tier, check payment approval
  if (!contractorData.payment_approved) {
    toast.error('Payment verification pending. Please contact admin.');
    return false; // ❌ PAID tier needs payment approval
  }
  
  return true; // ✅ All checks passed
};
```

### 4. Monthly BOQ Limit Check (for PROFESSIONAL tier)
**Add BOQ counter logic:**

```typescript
// Before generating BOQ
const checkBoqLimit = async (contractorId: string) => {
  const { data: contractor } = await supabase
    .from('contractors')
    .select('subscription_tier, monthly_boq_limit, boqs_generated_this_month, current_month_start')
    .eq('id', contractorId)
    .single();
  
  // No limit for FREE, ENTERPRISE, CUSTOM
  if (!contractor.monthly_boq_limit) {
    return true; // Unlimited
  }
  
  // Check if new month (reset counter)
  const monthStart = new Date(contractor.current_month_start);
  const now = new Date();
  if (now.getMonth() !== monthStart.getMonth() || now.getFullYear() !== monthStart.getFullYear()) {
    // Reset counter for new month
    await supabase
      .from('contractors')
      .update({
        boqs_generated_this_month: 0,
        current_month_start: new Date().toISOString()
      })
      .eq('id', contractorId);
    
    return true; // New month, proceed
  }
  
  // Check limit
  if (contractor.boqs_generated_this_month >= contractor.monthly_boq_limit) {
    toast.error(`Monthly limit reached (${contractor.monthly_boq_limit} BOQs). Upgrade to continue.`);
    return false; // ❌ Limit exceeded
  }
  
  // Increment counter
  await supabase
    .from('contractors')
    .update({
      boqs_generated_this_month: contractor.boqs_generated_this_month + 1
    })
    .eq('id', contractorId);
  
  const remaining = contractor.monthly_boq_limit - contractor.boqs_generated_this_month - 1;
  toast.success(`BOQ generated! ${remaining} BOQs remaining this month.`);
  
  return true; // ✅ Within limit
};
```

---

## ✅ Testing Checklist

### Test FREE Tier:
- [ ] Sign up with FREE tier
- [ ] Admin approves contractor
- [ ] Contractor can login immediately
- [ ] Generate unlimited BOQs
- [ ] No payment approval required

### Test PROFESSIONAL Tier:
- [ ] Sign up with PROFESSIONAL tier
- [ ] Admin approves contractor
- [ ] Contractor CANNOT login yet (payment pending)
- [ ] Admin verifies payment
- [ ] Contractor can now login
- [ ] Generate 10 BOQs
- [ ] 11th BOQ shows limit error
- [ ] Next month, counter resets

### Test ENTERPRISE Tier:
- [ ] Sign up with ENTERPRISE tier
- [ ] Admin approves contractor
- [ ] Admin verifies payment
- [ ] Contractor can login
- [ ] Generate unlimited BOQs
- [ ] eTender integration visible
- [ ] Collusion detection enabled

### Test CUSTOM Tier:
- [ ] Sign up with CUSTOM tier
- [ ] Admin approves contractor
- [ ] Admin verifies payment (custom arrangement)
- [ ] Contractor can login
- [ ] All features available

### Test Error Cases:
- [ ] Try login before contractor approval → Error
- [ ] Try login with approved contractor but no payment (PAID tier) → Error
- [ ] Try payment approval without contractor approval → Blocked
- [ ] Try exceeding monthly limit (PROFESSIONAL) → Error

---

## 🚀 Deployment Sequence

### Pre-deployment (5 minutes):
1. Run `/FOUR_TIER_DATABASE_MIGRATION.sql` in Supabase
2. Verify new columns exist
3. Verify pricing_tiers table created

### Deployment (30 minutes):
1. Update `ContractorSignup.tsx` - Add tier selection
2. Update `AdminDashboard.tsx` - Add two-step approval
3. Update login validation logic
4. Add BOQ limit checks
5. Test thoroughly

### Post-deployment (10 minutes):
1. Create test contractor for each tier
2. Test full approval flow
3. Verify login restrictions work
4. Test BOQ limit for PROFESSIONAL tier

---

## 📝 Admin Training

### For Tuesday Demo:
**Tell admins:**
1. "New contractors now select a tier during sign-up"
2. "FREE tier: Approve contractor → They can login"
3. "PAID tiers: Approve contractor → Verify payment → They can login"
4. "Look for 'Payment Pending' badge after approving paid tiers"
5. "PROFESSIONAL tier has 10 BOQs/month limit"

---

## 🎯 Next Steps After Tuesday

If eTender approves:
1. Integrate Stitch/PayFast auto-payment
2. Add payment webhook handlers
3. Add automatic payment verification for successful payments
4. Add monthly billing reminders
5. Add upgrade/downgrade functionality
6. Add usage analytics per tier

---

**Ready to implement!** Start with database migration, then update components one by one.
