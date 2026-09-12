# Four-Tier Payment System Implementation Plan

## 🎯 Requirements Summary

### Four Tiers:
1. **FREE** - R0 - All features + Free training, No payment, Admin approval only
2. **PROFESSIONAL** - R2,999/month - 10 BOQs/month, Limited support, No eTender/collusion
3. **ENTERPRISE** - R8,999/month - Unlimited BOQs, All features + eTender + collusion, 24hr email support
4. **CUSTOM** - Contact us - Unlimited BOQs, All features, 24hr call+email support

### Sign-Up Flow:
```
Step 1: Company Details Form
Step 2: Tier Selection ✨ NEW
Step 3: Review & Submit
Step 4: Admin Contractor Approval
Step 5: Admin Payment Approval (for paid tiers)
Step 6: Contractor Can Login
```

### Access Control Rules:
- **FREE tier:** `contractor_approved = true` → Can login
- **Paid tiers:** `contractor_approved = true AND payment_verified = true` → Can login
- **Manual payment approval:** Only after contractor is approved
- **No payment approval without contractor approval first**

---

## 📊 Database Schema Updates

### contractors table - ADD these columns:

```sql
-- Add selected_tier column
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS selected_tier TEXT DEFAULT 'FREE' CHECK (selected_tier IN ('FREE', 'PROFESSIONAL', 'ENTERPRISE', 'CUSTOM'));

-- Add payment_status column  
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'not_required' CHECK (payment_status IN ('not_required', 'pending', 'verified', 'failed'));

-- Add payment_verified boolean
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT false;

-- Add payment_method column
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('manual', 'payfast', 'stitch', 'none'));

-- Add payment_verified_at timestamp
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMPTZ;

-- Add payment_verified_by (admin user ID)
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS payment_verified_by UUID REFERENCES auth.users(id);

-- Add boq_count for tracking (Professional tier limit)
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS boq_count INTEGER DEFAULT 0;

-- Add boq_limit for Professional tier
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS boq_limit INTEGER DEFAULT NULL; -- NULL = unlimited

-- Add monthly_boq_reset_date for Professional tier
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS monthly_boq_reset_date TIMESTAMPTZ;

-- Add notes column for admin
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS payment_notes TEXT;

-- Update existing contractors to have correct defaults
UPDATE contractors 
SET selected_tier = 'FREE', 
    payment_status = 'not_required', 
    payment_verified = true,
    subscription_tier = 'FREE'
WHERE selected_tier IS NULL;
```

### Create payment_approvals audit table:

```sql
CREATE TABLE IF NOT EXISTS payment_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES auth.users(id),
  payment_method TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'verified', 'failed')),
  amount DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payment_approvals ENABLE ROW LEVEL SECURITY;

-- Admin can view all
CREATE POLICY "Admins can view all payment approvals"
ON payment_approvals FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Admin can insert/update
CREATE POLICY "Admins can manage payment approvals"
ON payment_approvals FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);
```

---

## 🔧 Code Changes Required

### 1. ContractorSignup.tsx

Add state for multi-step flow:

```typescript
const [step, setStep] = useState<'details' | 'tier' | 'review'>('details');
const [selectedTier, setSelectedTier] = useState<'FREE' | 'PROFESSIONAL' | 'ENTERPRISE' | 'CUSTOM'>('FREE');
```

Update the handleSubmit to include selected_tier:

```typescript
const contractorData = {
  // ... existing fields ...
  selected_tier: selectedTier,
  subscription_tier: selectedTier,
  payment_status: selectedTier === 'FREE' ? 'not_required' : 'pending',
  payment_verified: selectedTier === 'FREE' ? true : false,
  boq_limit: selectedTier === 'PROFESSIONAL' ? 10 : null, // 10 for Professional, unlimited for others
  monthly_boq_reset_date: selectedTier === 'PROFESSIONAL' ? getNextMonthDate() : null,
  // ... rest of fields ...
};
```

Add render logic for steps:

```typescript
return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack}>← Back to Login</Button>
          <Badge className="bg-blue-100 text-blue-700">
            Step {step === 'details' ? '1' : step === 'tier' ? '2' : '3'} of 3
          </Badge>
        </div>
        <CardTitle className="text-3xl flex items-center gap-2">
          <Hammer className="w-8 h-8 text-blue-600" />
          Contractor Registration
        </CardTitle>
        <CardDescription>
          {step === 'details' && 'Enter your company details'}
          {step === 'tier' && 'Choose your subscription tier'}
          {step === 'review' && 'Review and submit your application'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === 'details' && (
          <CompanyDetailsForm
            data={signupData}
            onChange={setSignupData}
            onNext={() => setStep('tier')}
          />
        )}
        
        {step === 'tier' && (
          <TierSelectionStep
            selectedTier={selectedTier}
            onSelectTier={setSelectedTier}
            onNext={() => setStep('review')}
            onBack={() => setStep('details')}
          />
        )}
        
        {step === 'review' && (
          <ReviewStep
            data={signupData}
            selectedTier={selectedTier}
            onSubmit={handleSubmit}
            onBack={() => setStep('tier')}
            isLoading={isLoading}
          />
        )}
      </CardContent>
    </Card>
  </div>
);
```

### 2. AdminDashboard.tsx - Two-Step Approval

Update contractor details dialog to show two-step approval:

```typescript
{selectedContractor && selectedContractor.status === 'approved' && !selectedContractor.payment_verified && selectedContractor.selected_tier !== 'FREE' && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 space-y-4">
    <div className="flex items-center gap-2 text-yellow-800">
      <AlertCircle className="w-5 h-5" />
      <span className="font-semibold">Payment Verification Pending</span>
    </div>
    <p className="text-sm text-yellow-700">
      Contractor approved. Please verify payment before granting access.
    </p>
    
    {/* Payment Verification Form */}
    <div className="space-y-3">
      <div>
        <Label>Payment Method</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Manual Payment (EFT/Cash)</SelectItem>
            <SelectItem value="payfast">PayFast</SelectItem>
            <SelectItem value="stitch">Stitch</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Payment Notes (Optional)</Label>
        <Input
          placeholder="e.g., Reference number, date received..."
          value={paymentNotes}
          onChange={(e) => setPaymentNotes(e.target.value)}
        />
      </div>
      
      <Button
        onClick={handleApprovePayment}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Verify Payment & Activate Account
      </Button>
    </div>
  </div>
)}
```

Add approval functions:

```typescript
const handleApproveContractor = async (contractor: any) => {
  try {
    // Step 1: Approve contractor
    const { error } = await supabase
      .from('contractors')
      .update({ 
        status: 'approved',
        approved_at: new Date().toISOString()
      })
      .eq('id', contractor.id);

    if (error) throw error;

    toast.success(
      `${contractor.company_name} has been approved!` +
      (contractor.selected_tier !== 'FREE' 
        ? ' Please verify payment to activate account.' 
        : ' They can now login.')
    );
    
    // If FREE tier, they can login immediately
    // If paid tier, show payment verification form
    loadContractors();
  } catch (err) {
    console.error('Error approving contractor:', err);
    toast.error('Failed to approve contractor');
  }
};

const handleApprovePayment = async (contractor: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Update contractor with payment verification
    const { error: updateError } = await supabase
      .from('contractors')
      .update({ 
        payment_status: 'verified',
        payment_verified: true,
        payment_verified_at: new Date().toISOString(),
        payment_verified_by: user?.id,
        payment_method: paymentMethod,
        payment_notes: paymentNotes || null
      })
      .eq('id', contractor.id);

    if (updateError) throw updateError;

    // Log payment approval
    const { error: logError } = await supabase
      .from('payment_approvals')
      .insert({
        contractor_id: contractor.id,
        approved_by: user?.id,
        payment_method: paymentMethod,
        payment_status: 'verified',
        amount: getTierPrice(contractor.selected_tier),
        notes: paymentNotes || null
      });

    if (logError) console.error('Failed to log payment approval:', logError);

    toast.success(`Payment verified! ${contractor.company_name} can now login.`);
    setShowContractorDialog(false);
    loadContractors();
  } catch (err) {
    console.error('Error approving payment:', err);
    toast.error('Failed to verify payment');
  }
};

const getTierPrice = (tier: string) => {
  switch (tier) {
    case 'PROFESSIONAL': return 2999.00;
    case 'ENTERPRISE': return 8999.00;
    case 'CUSTOM': return 0.00; // Custom pricing
    default: return 0.00;
  }
};
```

### 3. Login Logic - Check Both Approvals

In your login handler:

```typescript
// Check contractor approval
if (contractor.status !== 'approved') {
  toast.error('Your account is pending admin approval. Please check back later.');
  return;
}

// Check payment verification for paid tiers
if (contractor.selected_tier !== 'FREE' && !contractor.payment_verified) {
  toast.error('Your payment is pending verification. Please contact support at support@qilly.co.za');
  return;
}

// All checks passed - allow login
setUser(contractor);
```

### 4. BOQ Generation Limits (Professional Tier)

Add limit check in MainDashboard.tsx:

```typescript
const canGenerateBOQ = () => {
  if (!contractorData) return true; // Operators unlimited
  
  const tier = contractorData.selected_tier;
  
  if (tier === 'FREE' || tier === 'ENTERPRISE' || tier === 'CUSTOM') {
    return true; // Unlimited
  }
  
  if (tier === 'PROFESSIONAL') {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const resetMonth = contractorData.monthly_boq_reset_date?.slice(0, 7);
    
    // Reset counter if new month
    if (currentMonth !== resetMonth) {
      return true; // Will reset on first BOQ of new month
    }
    
    // Check limit
    const boqCount = contractorData.boq_count || 0;
    const boqLimit = contractorData.boq_limit || 10;
    
    if (boqCount >= boqLimit) {
      toast.error(`Professional tier limit reached: ${boqLimit} BOQs per month. Upgrade to Enterprise for unlimited.`);
      return false;
    }
    
    return true;
  }
  
  return true;
};

// Before generating BOQ:
if (!canGenerateBOQ()) {
  return;
}

// After successful BOQ generation:
if (contractorData?.selected_tier === 'PROFESSIONAL') {
  // Increment counter
  const currentMonth = new Date().toISOString().slice(0, 7);
  const resetMonth = contractorData.monthly_boq_reset_date?.slice(0, 7);
  
  const newCount = currentMonth !== resetMonth ? 1 : (contractorData.boq_count || 0) + 1;
  const newResetDate = currentMonth !== resetMonth ? getNextMonthDate() : contractorData.monthly_boq_reset_date;
  
  await supabase
    .from('contractors')
    .update({ 
      boq_count: newCount,
      monthly_boq_reset_date: newResetDate
    })
    .eq('id', contractorData.id);
}
```

---

## 🎯 Testing Checklist

### Test FREE Tier:
- [ ] Sign up → Select FREE → Submit
- [ ] Admin approves contractor
- [ ] Contractor can login immediately (no payment check)
- [ ] Can generate unlimited BOQs

### Test PROFESSIONAL Tier:
- [ ] Sign up → Select PROFESSIONAL → Submit
- [ ] Admin approves contractor
- [ ] Contractor CANNOT login yet
- [ ] Admin verifies payment → Contractor can now login
- [ ] Can generate up to 10 BOQs per month
- [ ] Counter resets next month

### Test ENTERPRISE Tier:
- [ ] Sign up → Select ENTERPRISE → Submit
- [ ] Admin approves contractor
- [ ] Contractor CANNOT login yet
- [ ] Admin verifies payment → Contractor can now login
- [ ] Can generate unlimited BOQs
- [ ] Has eTender integration
- [ ] Has collusion detection

### Test CUSTOM Tier:
- [ ] Sign up → Select CUSTOM → Submit
- [ ] Shows "Contact us" message
- [ ] Admin approves contractor
- [ ] Admin contacts contractor for custom pricing
- [ ] Admin verifies payment → Contractor can now login

### Test Admin Workflow:
- [ ] Cannot approve payment without contractor approval
- [ ] Two-step approval UI works correctly
- [ ] Payment approval creates audit log entry
- [ ] Contractors table shows payment status correctly

---

## 📅 Implementation Timeline

### Phase 1 (2 hours):
- [ ] Add database columns
- [ ] Create payment_approvals table
- [ ] Test database changes

### Phase 2 (3 hours):
- [ ] Update ContractorSignup with tier selection
- [ ] Add multi-step form logic
- [ ] Test sign-up flow

### Phase 3 (2 hours):
- [ ] Update AdminDashboard with two-step approval
- [ ] Add payment verification UI
- [ ] Test admin workflow

### Phase 4 (1 hour):
- [ ] Update login logic with payment checks
- [ ] Add BOQ limit logic for Professional tier
- [ ] Test access control

### Phase 5 (1 hour):
- [ ] End-to-end testing
- [ ] Bug fixes
- [ ] Documentation

**Total: ~9 hours**

---

## 🚀 Quick Start for Tuesday

**Minimum Viable Implementation for Demo:**

1. Add `selected_tier` column to database
2. Update sign-up to show tier selection
3. Update admin approval message
4. Show tier badge on contractor dashboard

**Skip for now (post-Tuesday):**
- Payment verification workflow
- BOQ limits
- Payment audit logging

This gives you the **visual experience** for Tuesday while keeping the **full implementation** for after the demo!
