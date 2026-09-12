# 🚀 Quick Start: Four-Tier System

## ⏱️ Time to Implement: 1 hour

---

## Step 1: Database (5 minutes)

```bash
1. Open Supabase SQL Editor
2. Copy entire content of: /FOUR_TIER_DATABASE_MIGRATION.sql
3. Paste and run
4. Verify: Check contractors table has new columns
```

**New columns added:**
- `payment_approved` - Is payment verified?
- `payment_approved_at` - When?
- `payment_approved_by` - By whom?
- `monthly_boq_limit` - 10 for Professional, NULL for others
- `boqs_generated_this_month` - Counter

---

## Step 2: Update ContractorSignup.tsx (15 minutes)

**What to add:**

1. **Import TierSelectionStep:**
```typescript
import { TierSelectionStep } from './TierSelectionStep';
```

2. **Add state:**
```typescript
const [currentStep, setCurrentStep] = useState<'tier' | 'details'>('tier');
const [selectedTier, setSelectedTier] = useState<string>('FREE');
const [tierPrice, setTierPrice] = useState<number>(0);
```

3. **Add tier selection step BEFORE company details:**
```typescript
{currentStep === 'tier' && (
  <TierSelectionStep 
    onSelectTier={(tierId, tierName, price) => {
      setSelectedTier(tierId);
      setTierPrice(price);
      setCurrentStep('details');
    }}
  />
)}

{currentStep === 'details' && (
  /* Existing company details form */
)}
```

4. **Update form submission to include tier:**
```typescript
const contractorData = {
  // ... existing fields ...
  subscription_tier: selectedTier,
  // FREE tier is auto-approved for payment, PAID tiers need admin approval
};
```

5. **Update success message:**
```typescript
if (selectedTier === 'FREE') {
  toast.success('Application submitted! FREE tier selected. Pending admin approval.');
} else {
  toast.success(`Application submitted! ${selectedTier} tier selected (R${tierPrice}/month). Admin will verify payment after approval.`);
}
```

---

## Step 3: Update AdminDashboard.tsx (20 minutes)

### A. Add contractor status badge function:

```typescript
const getContractorFullStatus = (contractor: any) => {
  // Pending review
  if (contractor.status === 'pending') {
    return {
      badge: <Badge className="bg-yellow-100 text-yellow-800">⏳ Pending Review</Badge>,
      canApprove: true,
      canApprovePayment: false
    };
  }
  
  // Rejected
  if (contractor.status === 'rejected') {
    return {
      badge: <Badge className="bg-red-100 text-red-800">❌ Rejected</Badge>,
      canApprove: false,
      canApprovePayment: false
    };
  }
  
  // Approved - FREE tier (no payment needed)
  if (contractor.status === 'approved' && contractor.subscription_tier === 'FREE') {
    return {
      badge: <Badge className="bg-green-100 text-green-800">✅ Active (FREE)</Badge>,
      canApprove: false,
      canApprovePayment: false
    };
  }
  
  // Approved - PAID tier - Payment approved
  if (contractor.status === 'approved' && contractor.payment_approved) {
    return {
      badge: <Badge className="bg-green-100 text-green-800">✅ Active ({contractor.subscription_tier})</Badge>,
      canApprove: false,
      canApprovePayment: false
    };
  }
  
  // Approved - PAID tier - Payment pending
  if (contractor.status === 'approved' && !contractor.payment_approved) {
    return {
      badge: <Badge className="bg-orange-100 text-orange-800">⚠️ Payment Pending</Badge>,
      canApprove: false,
      canApprovePayment: true // Show "Verify Payment" button
    };
  }
};
```

### B. Update contractor approval handler:

```typescript
const handleApproveContractor = async (contractor: any) => {
  try {
    // Approve contractor
    const { error } = await supabase
      .from('contractors')
      .update({ 
        status: 'approved',
        approved_at: new Date().toISOString()
      })
      .eq('id', contractor.id);

    if (error) throw error;

    // Different messages based on tier
    if (contractor.subscription_tier === 'FREE') {
      toast.success(`✅ ${contractor.company_name} approved! They can login with FREE tier access and free training.`);
    } else {
      toast.success(`✅ ${contractor.company_name} approved! ⚠️ Please verify payment (${contractor.subscription_tier}: R${getPriceForTier(contractor.subscription_tier)}/month) to enable login.`);
    }

    setShowContractorDialog(false);
    loadContractors(); // Reload
  } catch (err) {
    console.error('Error approving contractor:', err);
    toast.error('Failed to approve contractor');
  }
};
```

### C. Add payment approval handler:

```typescript
const handleApprovePayment = async (contractor: any) => {
  // Show payment verification modal
  const paymentMethod = prompt('Payment method (manual/stitch/payfast):');
  const paymentReference = prompt('Payment reference number:');
  
  if (!paymentMethod || !paymentReference) {
    toast.error('Payment details required');
    return;
  }
  
  try {
    const { error } = await supabase
      .from('contractors')
      .update({
        payment_approved: true,
        payment_approved_at: new Date().toISOString(),
        payment_approved_by: 'admin@qilly.co.za', // TODO: Get from auth
        payment_method: paymentMethod,
        payment_reference: paymentReference
      })
      .eq('id', contractor.id);
    
    if (error) throw error;
    
    toast.success(`✅ Payment verified! ${contractor.company_name} can now login.`);
    loadContractors(); // Reload
  } catch (err) {
    console.error('Error approving payment:', err);
    toast.error('Failed to approve payment');
  }
};

const getPriceForTier = (tier: string) => {
  switch(tier) {
    case 'PROFESSIONAL': return '2,999';
    case 'ENTERPRISE': return '8,999';
    case 'CUSTOM': return 'Custom';
    default: return '0';
  }
};
```

### D. Update contractor details dialog to show payment status:

```typescript
{/* In contractor dialog, after status badge */}
{selectedContractor.status === 'approved' && selectedContractor.subscription_tier !== 'FREE' && (
  <div className="mt-4">
    <Label>Payment Status</Label>
    {selectedContractor.payment_approved ? (
      <div className="bg-green-50 border border-green-200 rounded p-3 mt-2">
        <p className="text-sm text-green-800">
          ✅ Payment Verified
        </p>
        <p className="text-xs text-green-600 mt-1">
          Method: {selectedContractor.payment_method}<br/>
          Reference: {selectedContractor.payment_reference}<br/>
          Verified: {new Date(selectedContractor.payment_approved_at).toLocaleString()}
        </p>
      </div>
    ) : (
      <div className="bg-orange-50 border border-orange-200 rounded p-3 mt-2">
        <p className="text-sm text-orange-800">
          ⚠️ Payment Pending Verification
        </p>
        <Button 
          onClick={() => handleApprovePayment(selectedContractor)}
          className="mt-2 w-full bg-blue-600"
        >
          Verify Payment
        </Button>
      </div>
    )}
  </div>
)}
```

---

## Step 4: Update Login Validation (10 minutes)

**In MainDashboard.tsx or auth logic:**

```typescript
// After fetching contractor data on login
if (contractorData) {
  // Check 1: Contractor approved?
  if (contractorData.status !== 'approved') {
    toast.error('Your application is pending admin approval.');
    await supabase.auth.signOut();
    return;
  }
  
  // Check 2: If PAID tier, payment approved?
  if (contractorData.subscription_tier !== 'FREE' && !contractorData.payment_approved) {
    toast.error('Payment verification pending. Please contact admin at admin@qilly.co.za');
    await supabase.auth.signOut();
    return;
  }
  
  // All good - proceed with login
  console.log('✅ Login validated for:', contractorData.subscription_tier);
}
```

---

## Step 5: Add Monthly BOQ Limit Check (10 minutes)

**In BOQ generation logic:**

```typescript
const checkMonthlyLimit = async (contractorId: string) => {
  const { data: contractor } = await supabase
    .from('contractors')
    .select('subscription_tier, monthly_boq_limit, boqs_generated_this_month, current_month_start')
    .eq('id', contractorId)
    .single();
  
  // Unlimited tiers
  if (!contractor.monthly_boq_limit) {
    return true;
  }
  
  // Check if new month - reset counter
  const monthStart = new Date(contractor.current_month_start);
  const now = new Date();
  if (now.getMonth() !== monthStart.getMonth()) {
    await supabase
      .from('contractors')
      .update({ 
        boqs_generated_this_month: 1, 
        current_month_start: now.toISOString() 
      })
      .eq('id', contractorId);
    return true;
  }
  
  // Check limit
  if (contractor.boqs_generated_this_month >= contractor.monthly_boq_limit) {
    toast.error(`Monthly limit reached (${contractor.monthly_boq_limit} BOQs). Upgrade to ENTERPRISE for unlimited BOQs.`);
    return false;
  }
  
  // Increment
  await supabase
    .from('contractors')
    .update({ 
      boqs_generated_this_month: contractor.boqs_generated_this_month + 1 
    })
    .eq('id', contractorId);
  
  const remaining = contractor.monthly_boq_limit - contractor.boqs_generated_this_month - 1;
  toast.success(`BOQ generated! ${remaining} remaining this month.`);
  return true;
};

// Use before generating BOQ
if (contractorData) {
  const canGenerate = await checkMonthlyLimit(contractorData.id);
  if (!canGenerate) return;
  // ... proceed with BOQ generation
}
```

---

## 🧪 Quick Test (10 minutes)

### Test FREE Tier:
```bash
1. Sign up → Select FREE tier
2. Admin approve contractor
3. Login → Should work ✅
4. Generate BOQs → Unlimited ✅
```

### Test PROFESSIONAL Tier:
```bash
1. Sign up → Select PROFESSIONAL tier
2. Admin approve contractor
3. Try login → Should fail with "Payment pending" ❌
4. Admin verify payment
5. Login → Should work ✅
6. Generate 10 BOQs → Success
7. Try 11th → Should fail ❌
```

---

## 📋 Summary

**What you built:**
- ✅ 4-tier selection (FREE, PROFESSIONAL, ENTERPRISE, CUSTOM)
- ✅ Two-step admin approval (contractor → payment)
- ✅ Login restrictions (FREE after approval, PAID after payment)
- ✅ Monthly BOQ limits (10 for PROFESSIONAL)
- ✅ Payment tracking and verification

**Files modified:**
1. `/FOUR_TIER_DATABASE_MIGRATION.sql` - Database changes
2. `/src/app/components/TierSelectionStep.tsx` - Tier selection UI
3. `/src/app/components/ContractorSignup.tsx` - Add tier selection step
4. `/src/app/components/AdminDashboard.tsx` - Two-step approval
5. `/src/app/components/MainDashboard.tsx` - Login validation & BOQ limits

**Ready for Tuesday demo!** 🎉
