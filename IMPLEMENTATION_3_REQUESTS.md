# 🛠️ QILLY: 3 IMPLEMENTATION REQUESTS
## Complete Technical Guide & Test Scenarios

**Date:** March 9, 2026  
**Purpose:** Add CIDB grades, test payments, create test scenarios

---

## 📋 REQUEST 1: ADD ALL CIDB GRADE CLASSES TO CONTRACTOR REGISTRATION FORM

### **CURRENT STATE:**
The contractor registration form (`/src/app/components/ContractorSignup.tsx`) currently only has **CE (Civil Engineering)** grades:

```typescript
const cidbGrades = [
  'Grade 1 CE',
  'Grade 2 CE',
  'Grade 3 CE',
  'Grade 4 CE',
  'Grade 5 CE',
  'Grade 6 CE',
  'Grade 7 CE',
  'Grade 8 CE',
  'Grade 9 CE',
];
```

### **REQUIRED: ALL 20 CIDB GRADE CLASSES**

According to the CIDB Regulations and your image, there are **20 contractor grade classes**:

| Code | Full Name | Description |
|------|-----------|-------------|
| **GB** | General Building | Building construction, houses, offices |
| **CE** | Civil Engineering | Roads, bridges, infrastructure |
| **EB** | Electrical Engineering | Electrical installations, power |
| **EP** | Electrical Engineering (Specialised) | Specialized electrical work |
| **ME** | Mechanical Engineering | HVAC, mechanical systems |
| **SB** | Specialist Building | Specialist building work |
| **SC** | Specialist Civil | Specialist civil engineering |
| **SD** | Specialist Demolition | Demolition work |
| **SE** | Specialist Electrical | Specialist electrical |
| **SF** | Specialist Fire | Fire protection systems |
| **SG** | Specialist Geotechnical | Geotechnical engineering |
| **SH** | Specialist Highways | Highway construction |
| **SI** | Specialist Industrial | Industrial construction |
| **SJ** | Specialist Joinery | Joinery and carpentry |
| **SK** | Specialist Kitchens | Kitchen installations |
| **SL** | Specialist Landscaping | Landscaping and gardens |
| **SM** | Specialist Mechanical | Specialist mechanical |
| **SN** | Specialist Steel | Steel structures |
| **SO** | Specialist Offshore | Offshore construction |
| **SQ** | Specialist Quantity Surveying | QS consulting |

**Grades per class:** 1-9 (e.g., GB1, GB2, ... GB9)

### **IMPLEMENTATION:**

I'll update the ContractorSignup.tsx file to include all CIDB grade classes with proper grouping.

**Updated Code:**

```typescript
const cidbGrades = [
  // General Building (GB) - Most Common
  { value: 'GB1', label: 'GB1 - General Building (Grade 1)' },
  { value: 'GB2', label: 'GB2 - General Building (Grade 2)' },
  { value: 'GB3', label: 'GB3 - General Building (Grade 3)' },
  { value: 'GB4', label: 'GB4 - General Building (Grade 4)' },
  { value: 'GB5', label: 'GB5 - General Building (Grade 5)' },
  { value: 'GB6', label: 'GB6 - General Building (Grade 6)' },
  { value: 'GB7', label: 'GB7 - General Building (Grade 7)' },
  { value: 'GB8', label: 'GB8 - General Building (Grade 8)' },
  { value: 'GB9', label: 'GB9 - General Building (Grade 9)' },
  
  // Civil Engineering (CE)
  { value: 'CE1', label: 'CE1 - Civil Engineering (Grade 1)' },
  { value: 'CE2', label: 'CE2 - Civil Engineering (Grade 2)' },
  { value: 'CE3', label: 'CE3 - Civil Engineering (Grade 3)' },
  { value: 'CE4', label: 'CE4 - Civil Engineering (Grade 4)' },
  { value: 'CE5', label: 'CE5 - Civil Engineering (Grade 5)' },
  { value: 'CE6', label: 'CE6 - Civil Engineering (Grade 6)' },
  { value: 'CE7', label: 'CE7 - Civil Engineering (Grade 7)' },
  { value: 'CE8', label: 'CE8 - Civil Engineering (Grade 8)' },
  { value: 'CE9', label: 'CE9 - Civil Engineering (Grade 9)' },
  
  // Electrical Engineering (EB)
  { value: 'EB1', label: 'EB1 - Electrical Engineering (Grade 1)' },
  { value: 'EB2', label: 'EB2 - Electrical Engineering (Grade 2)' },
  { value: 'EB3', label: 'EB3 - Electrical Engineering (Grade 3)' },
  { value: 'EB4', label: 'EB4 - Electrical Engineering (Grade 4)' },
  { value: 'EB5', label: 'EB5 - Electrical Engineering (Grade 5)' },
  { value: 'EB6', label: 'EB6 - Electrical Engineering (Grade 6)' },
  { value: 'EB7', label: 'EB7 - Electrical Engineering (Grade 7)' },
  { value: 'EB8', label: 'EB8 - Electrical Engineering (Grade 8)' },
  { value: 'EB9', label: 'EB9 - Electrical Engineering (Grade 9)' },
  
  // Electrical Engineering Specialised (EP)
  { value: 'EP1', label: 'EP1 - Electrical Specialised (Grade 1)' },
  { value: 'EP2', label: 'EP2 - Electrical Specialised (Grade 2)' },
  { value: 'EP3', label: 'EP3 - Electrical Specialised (Grade 3)' },
  { value: 'EP4', label: 'EP4 - Electrical Specialised (Grade 4)' },
  { value: 'EP5', label: 'EP5 - Electrical Specialised (Grade 5)' },
  { value: 'EP6', label: 'EP6 - Electrical Specialised (Grade 6)' },
  { value: 'EP7', label: 'EP7 - Electrical Specialised (Grade 7)' },
  { value: 'EP8', label: 'EP8 - Electrical Specialised (Grade 8)' },
  { value: 'EP9', label: 'EP9 - Electrical Specialised (Grade 9)' },
  
  // Mechanical Engineering (ME)
  { value: 'ME1', label: 'ME1 - Mechanical Engineering (Grade 1)' },
  { value: 'ME2', label: 'ME2 - Mechanical Engineering (Grade 2)' },
  { value: 'ME3', label: 'ME3 - Mechanical Engineering (Grade 3)' },
  { value: 'ME4', label: 'ME4 - Mechanical Engineering (Grade 4)' },
  { value: 'ME5', label: 'ME5 - Mechanical Engineering (Grade 5)' },
  { value: 'ME6', label: 'ME6 - Mechanical Engineering (Grade 6)' },
  { value: 'ME7', label: 'ME7 - Mechanical Engineering (Grade 7)' },
  { value: 'ME8', label: 'ME8 - Mechanical Engineering (Grade 8)' },
  { value: 'ME9', label: 'ME9 - Mechanical Engineering (Grade 9)' },
  
  // Specialist Classes (Grades 1-7 typically)
  { value: 'SB1', label: 'SB1 - Specialist Building (Grade 1)' },
  { value: 'SB2', label: 'SB2 - Specialist Building (Grade 2)' },
  { value: 'SB3', label: 'SB3 - Specialist Building (Grade 3)' },
  { value: 'SB4', label: 'SB4 - Specialist Building (Grade 4)' },
  { value: 'SB5', label: 'SB5 - Specialist Building (Grade 5)' },
  { value: 'SB6', label: 'SB6 - Specialist Building (Grade 6)' },
  { value: 'SB7', label: 'SB7 - Specialist Building (Grade 7)' },
  
  { value: 'SC1', label: 'SC1 - Specialist Civil (Grade 1)' },
  { value: 'SC2', label: 'SC2 - Specialist Civil (Grade 2)' },
  { value: 'SC3', label: 'SC3 - Specialist Civil (Grade 3)' },
  { value: 'SC4', label: 'SC4 - Specialist Civil (Grade 4)' },
  { value: 'SC5', label: 'SC5 - Specialist Civil (Grade 5)' },
  { value: 'SC6', label: 'SC6 - Specialist Civil (Grade 6)' },
  { value: 'SC7', label: 'SC7 - Specialist Civil (Grade 7)' },
  
  { value: 'SD1', label: 'SD1 - Specialist Demolition (Grade 1)' },
  { value: 'SD2', label: 'SD2 - Specialist Demolition (Grade 2)' },
  { value: 'SD3', label: 'SD3 - Specialist Demolition (Grade 3)' },
  { value: 'SD4', label: 'SD4 - Specialist Demolition (Grade 4)' },
  { value: 'SD5', label: 'SD5 - Specialist Demolition (Grade 5)' },
  { value: 'SD6', label: 'SD6 - Specialist Demolition (Grade 6)' },
  { value: 'SD7', label: 'SD7 - Specialist Demolition (Grade 7)' },
  
  { value: 'SE1', label: 'SE1 - Specialist Electrical (Grade 1)' },
  { value: 'SE2', label: 'SE2 - Specialist Electrical (Grade 2)' },
  { value: 'SE3', label: 'SE3 - Specialist Electrical (Grade 3)' },
  { value: 'SE4', label: 'SE4 - Specialist Electrical (Grade 4)' },
  { value: 'SE5', label: 'SE5 - Specialist Electrical (Grade 5)' },
  { value: 'SE6', label: 'SE6 - Specialist Electrical (Grade 6)' },
  { value: 'SE7', label: 'SE7 - Specialist Electrical (Grade 7)' },
  
  // Add all other specialist classes (SF, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SQ)
  // ... (continues with all 20 classes × 7-9 grades each = ~160 options)
];
```

**Better UX: Grouped Dropdown with Sections**

Instead of one long list, group by class for better usability.

---

## 💳 REQUEST 2: HOW TO TEST PAYMENT INTEGRATION AND TRIAL USAGE

### **CURRENT PAYMENT INTEGRATIONS:**

Qilly currently has **5 payment methods** implemented:

1. **PayFast** (`/src/app/components/payments/PayFastPayment.tsx`)
2. **Stitch Payments** (`/src/app/components/payments/StitchPayment.tsx`)
3. **EFT Payment** (`/src/app/components/payments/EFTPayment.tsx`)
4. **Manual Upgrade** (`/src/app/components/payments/ManualUpgrade.tsx`)
5. **Subscription Upgrade Modal** (`/src/app/components/payments/SubscriptionUpgradeModal.tsx`)

---

### **TESTING PAYMENT INTEGRATION: STEP-BY-STEP GUIDE**

#### **🔧 SETUP: Enable Test/Sandbox Mode**

**1. PayFast Test Environment:**
- PayFast URL: `https://sandbox.payfast.co.za` (test) vs `https://www.payfast.co.za` (prod)
- Test Merchant ID: `10000100`
- Test Merchant Key: `46f0cd694581a`
- Test credentials from: https://developers.payfast.co.za/docs#step_1_sign_up_for_sandbox

**2. Stitch Payments Test Environment:**
- Stitch API URL: `https://api.stitch.money/graphql` (prod) or test endpoint
- Test Client ID & Secret from Stitch developer portal
- Use test bank accounts (won't charge real money)

**3. Environment Variables:**

Create `/src/.env.local` (NOT committed to Git):

```bash
# PayFast Configuration
NEXT_PUBLIC_PAYFAST_MERCHANT_ID=10000100
NEXT_PUBLIC_PAYFAST_MERCHANT_KEY=46f0cd694581a
NEXT_PUBLIC_PAYFAST_MODE=sandbox  # Switch to 'live' for production

# Stitch Payments
NEXT_PUBLIC_STITCH_CLIENT_ID=test_client_id_here
NEXT_PUBLIC_STITCH_CLIENT_SECRET=test_secret_here
NEXT_PUBLIC_STITCH_MODE=test  # Switch to 'production' for live

# App Environment
NEXT_PUBLIC_ENVIRONMENT=development  # development | sit | uat | production
```

**4. Update Payment Components to Use Environment Variables:**

Example for PayFast:

```typescript
const PAYFAST_CONFIG = {
  merchantId: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '10000100',
  merchantKey: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY || '46f0cd694581a',
  mode: process.env.NEXT_PUBLIC_PAYFAST_MODE || 'sandbox',
  url: process.env.NEXT_PUBLIC_PAYFAST_MODE === 'live' 
    ? 'https://www.payfast.co.za/eng/process' 
    : 'https://sandbox.payfast.co.za/eng/process'
};
```

---

### **TESTING TRIAL USAGE:**

#### **Trial Logic Location:**
- **File:** `/src/app/components/BillUpload.tsx`
- **Line:** ~783 (Trial usage check)

**Current Trial Logic:**

```typescript
// Check if contractor has used trial
const trialUsed = contractorData?.trial_used || false;

if (trialUsed && !contractorData?.paid_status) {
  // Show "Free Trial Used" message
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Free Trial Used</h3>
          <p className="text-gray-600 mb-4">
            You've used your free trial pricing. Upgrade to a paid account to continue pricing bills.
          </p>
          <Button onClick={() => setShowUpgradeModal(true)}>
            Upgrade to Paid Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### **TEST SCENARIOS FOR TRIAL & PAYMENT:**

#### **Scenario 1: Test Free Trial (New Contractor)**

**Steps:**
1. Register new contractor account
2. Verify `trial_used = false` in Supabase `contractors` table
3. Price first BOQ → Should succeed
4. Check database: `trial_used` should update to `true`
5. Try to price second BOQ → Should show "Free Trial Used" message

**Database Query to Reset Trial:**
```sql
UPDATE contractors 
SET trial_used = false 
WHERE email = 'test@example.com';
```

---

#### **Scenario 2: Test PayFast Payment (Sandbox)**

**Steps:**
1. Use trial until blocked
2. Click "Upgrade to Paid Account"
3. Select "Professional" tier
4. Choose "PayFast" payment method
5. Redirected to PayFast sandbox (`https://sandbox.payfast.co.za`)
6. **Use PayFast Test Card:**
   - Card Number: `4000 0000 0000 0002` (test Visa)
   - Expiry: Any future date (e.g., `12/25`)
   - CVV: Any 3 digits (e.g., `123`)
7. Complete payment
8. PayFast redirects back to Qilly
9. **Verify in Supabase:**
   - `contractors.paid_status = true`
   - `contractors.subscription_status = 'active'`
   - `contractors.subscription_tier = 'professional'`

**Test Credit Cards (PayFast Sandbox):**
| Card Number | Type | Result |
|-------------|------|--------|
| `4000 0000 0000 0002` | Visa | Success |
| `5200 0000 0000 1096` | Mastercard | Success |
| `4000 0000 0000 0010` | Visa | Declined |

---

#### **Scenario 3: Test Stitch Payments (Test Bank)**

**Steps:**
1. Same setup as PayFast scenario
2. Select "Stitch Payments" method
3. Redirected to Stitch payment flow
4. **Use Stitch Test Bank Login:**
   - Bank: Select "Test Bank" (if available)
   - Username: `test_user`
   - Password: `test_password`
   - OTP: `123456` (test OTP always works)
5. Approve payment
6. Verify database update

---

#### **Scenario 4: Test EFT Manual Payment**

**Steps:**
1. Select "EFT/Bank Transfer" method
2. System displays banking details:
   ```
   Bank: FNB
   Account Name: Qilly (Pty) Ltd
   Account Number: 62812345678
   Branch Code: 250655
   Reference: CONT-{contractor_id}
   ```
3. Contractor does manual EFT
4. **Admin manually approves payment:**
   - Navigate to Admin Dashboard
   - Find contractor in "Pending Payments" list
   - Click "Approve Payment"
   - System updates `paid_status = true`

---

#### **Scenario 5: Test Subscription Expiry & Renewal**

**Steps:**
1. Set contractor's `next_billing_date` to past date:
   ```sql
   UPDATE contractors 
   SET next_billing_date = '2026-01-01' 
   WHERE email = 'test@example.com';
   ```
2. Try to price BOQ
3. Should show "Subscription Expired" message
4. Click "Renew Subscription"
5. Process payment
6. Verify `next_billing_date` updated to +1 month/year

---

### **PAYMENT TESTING CHECKLIST:**

| Feature | Test Status | Expected Result |
|---------|-------------|-----------------|
| ✅ New contractor gets free trial | ⬜ | `trial_used = false`, can price 1 BOQ |
| ✅ Trial blocks after 1 usage | ⬜ | Shows "Free Trial Used" message |
| ✅ PayFast sandbox payment | ⬜ | `paid_status = true` after payment |
| ✅ Stitch test payment | ⬜ | `paid_status = true` after payment |
| ✅ EFT manual approval | ⬜ | Admin can approve, status updates |
| ✅ Subscription expiry | ⬜ | Blocks pricing when expired |
| ✅ Subscription renewal | ⬜ | Payment extends `next_billing_date` |
| ✅ Tier upgrade (Pro → Enterprise) | ⬜ | Tier updates, price difference charged |
| ✅ Billing cycle switch (Monthly → Annual) | ⬜ | Price difference charged/refunded |
| ✅ Payment failure handling | ⬜ | Shows error, doesn't update status |

---

## 🧪 REQUEST 3: TEST SCENARIOS FOR PROFESSIONAL, ENTERPRISE, CUSTOM TIERS

### **CURRENT SUBSCRIPTION TIERS:**

| Tier | Monthly Price | Annual Price | Features |
|------|---------------|--------------|----------|
| **Professional** | R499 | R4,990 (17% savings) | 10 BOQs/month, Basic support, 9-province pricing |
| **Enterprise** | R1,299 | R12,990 (17% savings) | 50 BOQs/month, Priority support, Green building, Custom reports |
| **Custom** | Contact sales | Contact sales | Unlimited BOQs, Dedicated support, API access, White-label |

**Source:** `/src/app/components/ContractorPricingTiers.tsx`

---

### **COMPREHENSIVE TEST SCENARIOS BY TIER:**

---

## 🔹 TIER 1: PROFESSIONAL PLAN (R499/month)

### **Test Scenario 1.1: BOQ Limit Enforcement**

**Given:** Contractor on Professional plan (10 BOQs/month limit)  
**When:** Contractor prices their 11th BOQ in the same month  
**Then:** System should block and show "Monthly Limit Reached"

**Test Steps:**
1. Create test contractor with `subscription_tier = 'professional'`
2. Price 10 BOQs successfully
3. On 11th BOQ attempt → Show upgrade prompt:
   ```
   "You've reached your 10 BOQs/month limit.
   Upgrade to Enterprise for 50 BOQs/month or Custom for unlimited."
   ```
4. Verify database: `bills` table has 10 records for this contractor this month

**Expected Result:** ❌ Blocked after 10 BOQs

**Database Query to Check:**
```sql
SELECT COUNT(*) as boq_count
FROM bills
WHERE contractor_id = 'test-contractor-id'
  AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW());
-- Should return 10 for Professional tier
```

---

### **Test Scenario 1.2: Basic Support Access**

**Given:** Professional tier contractor  
**When:** Contractor clicks "Support" button  
**Then:** Email form opens (basic email support only, no live chat)

**Test Steps:**
1. Login as Professional contractor
2. Navigate to Support section
3. Verify:
   - ✅ Email support form available
   - ❌ Live chat NOT available
   - ❌ Priority support NOT available
   - ❌ Dedicated account manager NOT available

**Expected Result:** Email-only support

---

### **Test Scenario 1.3: 9-Province Pricing**

**Given:** Professional tier contractor  
**When:** Uploading BOQ and selecting project province  
**Then:** All 9 provinces available

**Test Steps:**
1. Upload BOQ
2. Check province dropdown shows:
   - Gauteng, Western Cape, KwaZulu-Natal, Eastern Cape, Free State
   - Limpopo, Mpumalanga, North West, Northern Cape
3. Price BOQ for each province
4. Verify provincial pricing multipliers applied correctly

**Expected Result:** ✅ All 9 provinces available

---

### **Test Scenario 1.4: Standard Reports Only**

**Given:** Professional tier contractor  
**When:** Viewing priced BOQ  
**Then:** Only standard PDF report available (no custom formats)

**Test Steps:**
1. Price BOQ
2. Click "Download Report"
3. Verify:
   - ✅ Standard PDF download
   - ✅ eTender submission
   - ❌ Excel export NOT available (Enterprise feature)
   - ❌ Custom branded report NOT available (Custom feature)

**Expected Result:** Standard PDF only

---

### **Test Scenario 1.5: Green Building Features (NOT Available)**

**Given:** Professional tier contractor  
**When:** Viewing dashboard  
**Then:** Green building tab is hidden/disabled

**Test Steps:**
1. Login as Professional contractor
2. Navigate to dashboard
3. Verify:
   - ❌ "Green Building" tab NOT visible
   - ❌ Carbon tracking NOT available
   - ❌ Eco-certified suppliers NOT highlighted

**Expected Result:** Green features hidden

---

## 🔹 TIER 2: ENTERPRISE PLAN (R1,299/month)

### **Test Scenario 2.1: Higher BOQ Limit (50/month)**

**Given:** Enterprise contractor (50 BOQs/month)  
**When:** Pricing 50th BOQ  
**Then:** Should succeed  
**When:** Pricing 51st BOQ  
**Then:** Should block and suggest Custom tier

**Test Steps:**
1. Create Enterprise contractor
2. Price 50 BOQs in same month
3. On 51st attempt → Show:
   ```
   "You've reached your 50 BOQs/month limit.
   Upgrade to Custom for unlimited BOQs."
   ```

**Expected Result:** ✅ 50 BOQs allowed, ❌ blocked at 51

---

### **Test Scenario 2.2: Priority Support Access**

**Given:** Enterprise contractor  
**When:** Clicking "Support"  
**Then:** Live chat available + email

**Test Steps:**
1. Login as Enterprise contractor
2. Navigate to Support
3. Verify:
   - ✅ Live chat available (Intercom/Tawk.to widget)
   - ✅ Email support
   - ✅ 4-hour response SLA guarantee
   - ❌ Dedicated account manager NOT available (Custom only)

**Expected Result:** Live chat + email

---

### **Test Scenario 2.3: Green Building Dashboard**

**Given:** Enterprise contractor  
**When:** Accessing dashboard  
**Then:** Green Building tab visible and functional

**Test Steps:**
1. Login as Enterprise contractor
2. Navigate to "Green Building" tab
3. Verify features:
   - ✅ Carbon footprint tracking per BOQ item
   - ✅ DHS Green Score calculation
   - ✅ Eco-certified supplier highlighting
   - ✅ Green materials toggle (apply eco alternatives)
   - ✅ Cost premium analysis (R/tCO₂e saved)

**Expected Result:** Full green building access

---

### **Test Scenario 2.4: Custom Reports (Excel Export)**

**Given:** Enterprise contractor  
**When:** Downloading priced BOQ  
**Then:** Multiple format options available

**Test Steps:**
1. Price BOQ
2. Click "Download Report"
3. Verify options:
   - ✅ PDF (standard)
   - ✅ Excel (XLSX) export with all supplier quotes
   - ✅ eTender XML submission
   - ❌ White-labeled PDF NOT available (Custom only)

**Expected Result:** PDF + Excel + XML

---

### **Test Scenario 2.5: Advanced Analytics**

**Given:** Enterprise contractor  
**When:** Viewing dashboard  
**Then:** Advanced analytics charts visible

**Test Steps:**
1. Navigate to Dashboard
2. Verify charts:
   - ✅ Monthly BOQ pricing trends (line chart)
   - ✅ Cost breakdown by category (pie chart)
   - ✅ Supplier usage distribution (bar chart)
   - ✅ Provincial cost comparison (heatmap)

**Expected Result:** Advanced charts visible

---

## 🔹 TIER 3: CUSTOM PLAN (Contact Sales)

### **Test Scenario 3.1: Unlimited BOQs**

**Given:** Custom contractor  
**When:** Pricing 1000th BOQ in a month  
**Then:** No limits, continues working

**Test Steps:**
1. Create Custom contractor
2. Simulate pricing 100+ BOQs in one month
3. Verify no "limit reached" message ever shows
4. Database check:
   ```sql
   SELECT COUNT(*) FROM bills WHERE contractor_id = 'custom-id';
   -- Can be any number (no limit)
   ```

**Expected Result:** ✅ Unlimited

---

### **Test Scenario 3.2: Dedicated Account Manager**

**Given:** Custom contractor  
**When:** Logging in  
**Then:** Account manager contact info displayed

**Test Steps:**
1. Login as Custom contractor
2. Verify dashboard shows:
   - Account Manager: "Sarah Nkosi"
   - Direct Phone: +27 11 123 4567
   - Email: sarah@qilly.co.za
   - WhatsApp: Available
3. Click "Contact Manager" → Opens WhatsApp or phone call

**Expected Result:** Personalized support

---

### **Test Scenario 3.3: API Access**

**Given:** Custom contractor  
**When:** Accessing API docs  
**Then:** API keys and documentation available

**Test Steps:**
1. Navigate to "API Access" tab (Custom tier only)
2. Verify:
   - ✅ API key generation button
   - ✅ API documentation link
   - ✅ Webhook configuration
   - ✅ Rate limits: Unlimited
3. Generate test API key
4. Make test API call:
   ```bash
   curl https://api.qilly.co.za/v1/price-boq \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -d @boq.json
   ```

**Expected Result:** API access functional

---

### **Test Scenario 3.4: White-Label Reports**

**Given:** Custom contractor  
**When:** Downloading BOQ report  
**Then:** Report uses contractor's branding

**Test Steps:**
1. Upload contractor logo and brand colors in settings
2. Price BOQ
3. Download PDF report
4. Verify:
   - ✅ Contractor logo in header (not Qilly logo)
   - ✅ Brand colors applied (not Qilly blue)
   - ✅ Company name on cover page
   - ✅ Custom footer text

**Expected Result:** Branded PDF

---

### **Test Scenario 3.5: Custom Integrations**

**Given:** Custom contractor  
**When:** Accessing Integrations tab  
**Then:** Custom integrations available

**Test Steps:**
1. Navigate to "Integrations" (Custom tier only)
2. Verify available integrations:
   - ✅ SAP integration (push BOQs to SAP)
   - ✅ Microsoft Dynamics integration
   - ✅ Custom ERP integration (webhook-based)
   - ✅ Power BI connector (export data to Power BI)

**Expected Result:** Enterprise integrations available

---

## 📊 TIER COMPARISON TEST MATRIX

| Feature | Professional | Enterprise | Custom | How to Test |
|---------|-------------|------------|--------|-------------|
| **BOQ Limit** | 10/month | 50/month | Unlimited | Price BOQs until blocked |
| **Support** | Email only | Live chat + Email | Dedicated manager | Check support options |
| **Green Building** | ❌ | ✅ | ✅ | Access Green Dashboard |
| **Excel Export** | ❌ | ✅ | ✅ | Download report options |
| **White-Label** | ❌ | ❌ | ✅ | Upload logo, check PDF |
| **API Access** | ❌ | ❌ | ✅ | Generate API key |
| **Custom Integrations** | ❌ | ❌ | ✅ | Check Integrations tab |
| **Analytics** | Basic | Advanced | Advanced + Custom | View Dashboard charts |
| **Price (Monthly)** | R499 | R1,299 | Custom | Check billing |

---

## 🔄 TIER UPGRADE/DOWNGRADE TEST SCENARIOS

### **Test Scenario 4.1: Upgrade from Professional to Enterprise**

**Steps:**
1. Login as Professional contractor
2. Click "Upgrade Plan"
3. Select "Enterprise"
4. Pay price difference (R1,299 - R499 = R800 pro-rated)
5. Payment succeeds
6. Verify database:
   ```sql
   UPDATE contractors 
   SET subscription_tier = 'enterprise',
       next_billing_date = NOW() + INTERVAL '1 month'
   WHERE id = 'contractor-id';
   ```
7. Verify features:
   - ✅ BOQ limit now 50 (was 10)
   - ✅ Green Building tab now visible
   - ✅ Excel export now available

**Expected Result:** Immediate feature upgrade

---

### **Test Scenario 4.2: Downgrade from Enterprise to Professional**

**Steps:**
1. Login as Enterprise contractor
2. Click "Change Plan"
3. Select "Professional"
4. System warns:
   ```
   "Warning: You'll lose access to:
   - Green Building features
   - Excel export
   - Live chat support
   - BOQ limit will reduce to 10/month
   
   Are you sure?"
   ```
5. Confirm downgrade
6. **No refund** for current month (only applies next billing cycle)
7. Verify:
   - `subscription_tier = 'enterprise'` (until next billing date)
   - `pending_tier_change = 'professional'`
   - On next billing date → tier changes to Professional

**Expected Result:** Downgrade scheduled for next billing cycle

---

### **Test Scenario 4.3: Switch Billing Cycle (Monthly → Annual)**

**Steps:**
1. Professional Monthly contractor (R499/month)
2. Click "Switch to Annual Billing"
3. System calculates:
   ```
   Annual price: R4,990 (save R998/year = 17%)
   Already paid for this month: R499
   Credit: R499
   Due now: R4,990 - R499 = R4,491
   ```
4. Process payment of R4,491
5. Verify:
   - `billing_cycle = 'annual'`
   - `next_billing_date = NOW() + INTERVAL '1 year'`

**Expected Result:** Billing cycle changed, pro-rated

---

## 🧪 COMPLETE TEST SUITE CHECKLIST

### **Phase 1: Basic Functionality (All Tiers)**
- [ ] Contractor can register
- [ ] Email verification works
- [ ] Login successful
- [ ] Dashboard loads
- [ ] BOQ upload works
- [ ] BOQ pricing succeeds
- [ ] PDF download works
- [ ] Logout successful

### **Phase 2: Trial & Payment**
- [ ] Free trial allows 1 BOQ
- [ ] Trial blocks after 1 usage
- [ ] Upgrade modal shows
- [ ] PayFast sandbox payment succeeds
- [ ] Stitch test payment succeeds
- [ ] EFT manual approval works
- [ ] Subscription status updates

### **Phase 3: Professional Tier**
- [ ] BOQ limit enforced (10/month)
- [ ] Green Building tab hidden
- [ ] Excel export unavailable
- [ ] Basic support only (email)
- [ ] Standard PDF download works

### **Phase 4: Enterprise Tier**
- [ ] BOQ limit enforced (50/month)
- [ ] Green Building tab visible
- [ ] Carbon tracking functional
- [ ] Excel export works
- [ ] Live chat available
- [ ] Advanced analytics visible

### **Phase 5: Custom Tier**
- [ ] Unlimited BOQs (no limit)
- [ ] API key generation works
- [ ] API calls succeed
- [ ] White-label branding applied
- [ ] Dedicated manager info shows
- [ ] Custom integrations available

### **Phase 6: Upgrades/Downgrades**
- [ ] Upgrade Pro → Enterprise works
- [ ] Downgrade Enterprise → Pro works
- [ ] Monthly → Annual billing switch works
- [ ] Annual → Monthly billing switch works
- [ ] Pro-rated charges calculated correctly

### **Phase 7: Edge Cases**
- [ ] Expired subscription blocks access
- [ ] Renewal payment extends subscription
- [ ] Payment failure doesn't grant access
- [ ] Duplicate payment prevented
- [ ] Concurrent login prevented (if enforced)

---

## 🚀 AUTOMATED TEST SCRIPT (Pseudo-code)

```javascript
// Professional Tier Test
describe('Professional Tier', () => {
  it('should block after 10 BOQs', async () => {
    const contractor = await createTestContractor({ tier: 'professional' });
    
    // Price 10 BOQs
    for (let i = 0; i < 10; i++) {
      const result = await priceBOQ(contractor.id);
      expect(result.success).toBe(true);
    }
    
    // 11th BOQ should be blocked
    const blocked = await priceBOQ(contractor.id);
    expect(blocked.success).toBe(false);
    expect(blocked.error).toContain('Monthly limit reached');
  });
});

// Enterprise Tier Test
describe('Enterprise Tier', () => {
  it('should have green building access', async () => {
    const contractor = await createTestContractor({ tier: 'enterprise' });
    const dashboard = await getDashboard(contractor.id);
    
    expect(dashboard.tabs).toContain('Green Building');
    expect(dashboard.greenBuildingEnabled).toBe(true);
  });
});

// Payment Test
describe('PayFast Payment', () => {
  it('should activate account after payment', async () => {
    const contractor = await createTestContractor({ paid_status: false });
    
    const payment = await processPayFastPayment({
      contractor_id: contractor.id,
      amount: 499,
      card: '4000000000000002', // Test card
    });
    
    expect(payment.success).toBe(true);
    
    const updated = await getContractor(contractor.id);
    expect(updated.paid_status).toBe(true);
    expect(updated.subscription_status).toBe('active');
  });
});
```

---

**Ready to implement? Let me know and I'll update the code files! 🚀**
