# 🧪 QILLY COMPREHENSIVE TEST CASES

**Product:** Qilly (Pty) Ltd  
**Date:** May 6, 2026  
**Version:** 1.0  
**Test Environment:** Development, SIT, UAT, Production

---

## TABLE OF CONTENTS

1. [Test Overview](#test-overview)
2. [Authentication & Onboarding Tests](#authentication--onboarding-tests)
3. [BOQ Processing Tests](#boq-processing-tests)
4. [Payment & Subscription Tests](#payment--subscription-tests)
5. [Supplier Management Tests](#supplier-management-tests)
6. [Compliance Feature Tests](#compliance-feature-tests)
7. [Admin Dashboard Tests](#admin-dashboard-tests)
8. [Security Tests](#security-tests)
9. [Performance Tests](#performance-tests)
10. [Integration Tests](#integration-tests)
11. [User Acceptance Tests (UAT)](#user-acceptance-tests-uat)

---

## TEST OVERVIEW

### Test Levels
- **Unit Testing**: Individual functions and components (Not currently implemented - recommended)
- **Integration Testing**: API endpoints, database operations, third-party integrations
- **Functional Testing**: User flows and feature functionality
- **Security Testing**: Authentication, authorization, data protection
- **Performance Testing**: Load testing, stress testing, response times
- **User Acceptance Testing**: End-to-end business scenarios

### Test Data Requirements
- **Test Contractors**: 10+ with varying CIDB grades, provinces, tiers
- **Test Suppliers**: 20+ across all product categories
- **Test BOQs**: Small (10 items), Medium (50 items), Large (200+ items)
- **Test Payments**: Manual EFT, Stitch, PayFast scenarios
- **Test Provinces**: All 9 SA provinces
- **Test Municipalities**: At least 3 per province

### Test Environments
1. **Development**: Local testing, all features enabled, mock data allowed
2. **SIT**: System Integration Testing, real Supabase, limited test data
3. **UAT**: User Acceptance Testing, production-like, real supplier data
4. **Production**: Live environment, real users, real transactions

---

---

## AUTHENTICATION & ONBOARDING TESTS

### TC-AUTH-001: Contractor Registration - Happy Path
**Epic:** User Onboarding & Authentication  
**Feature:** Contractor Registration  
**Priority:** P0 (Critical)

**Preconditions:**
- User is on the AuthForm page
- "Sign Up" tab is active
- Valid email not already registered

**Test Steps:**
1. Click "Contractor Signup" button
2. Fill in Company Information:
   - Company Name: "Test Construction Co"
   - CIDB Registration: "GB1234567"
   - CIDB Class: "GB" (General Building)
   - CIDB Grade: "6"
3. Fill in Contact Information:
   - Contact Person: "John Doe"
   - Email: "john.doe+test@example.com"
   - Phone: "0821234567"
4. Fill in Address:
   - Street: "123 Test Street"
   - City: "Johannesburg"
   - Province: "Gauteng"
   - Postal Code: "2000"
5. Fill in Business Details:
   - Project Types: Select "Residential Building", "Commercial Building"
   - Operating Provinces: Select "Gauteng", "Western Cape"
   - Years in Business: "5"
   - Annual Turnover: "R5,000,000"
   - BBBEE Level: "4"
6. Create Account:
   - Password: "SecurePass123!"
   - Confirm Password: "SecurePass123!"
7. Check both POPIA consent boxes
8. Click "Next" to proceed to tier selection
9. Select "PROFESSIONAL" tier
10. Select payment method: "Manual EFT"
11. Note down payment reference
12. Click "Complete Registration"

**Expected Results:**
- ✓ All form fields validate correctly
- ✓ Password strength indicator shows "Strong"
- ✓ CIDB grade dropdown populated correctly
- ✓ Province dropdown shows all 9 provinces
- ✓ Payment reference generated: "QILLY-{id}-{timestamp}"
- ✓ Account created with `status = 'pending'`
- ✓ `payment_approved = false`
- ✓ Consent logged to `consent_audit_log` table
- ✓ Confirmation message displayed
- ✓ User redirected to "Payment Pending" screen
- ✓ Email sent with payment details

**Database Verification:**
```sql
SELECT * FROM contractors WHERE email = 'john.doe+test@example.com';
-- Verify: status = 'pending', payment_approved = false, subscription_tier = 'professional'

SELECT * FROM consent_audit_log WHERE user_email = 'john.doe+test@example.com';
-- Verify: consent_given = true, policy_version = '1.0'
```

**Component:** `ContractorSignup.tsx`

---

### TC-AUTH-002: Contractor Registration - Validation Errors
**Priority:** P0

**Test Steps:**
1. Navigate to Contractor Signup
2. Leave all fields empty
3. Click "Next"

**Expected Results:**
- ✓ Error messages displayed for all required fields
- ✓ "Company Name is required"
- ✓ "CIDB Registration is required"
- ✓ "Email is required"
- ✓ "Password is required"
- ✓ Form does not submit
- ✓ Focus moves to first error field

---

### TC-AUTH-003: Contractor Registration - Weak Password
**Priority:** P0

**Test Steps:**
1. Fill all fields correctly except password
2. Enter password: "weak"
3. Attempt to submit

**Expected Results:**
- ✓ Password strength indicator shows "Weak" or "Too Short"
- ✓ Error message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
- ✓ Form does not submit
- ✓ Password field highlighted in red

---

### TC-AUTH-004: Contractor Registration - Duplicate Email
**Priority:** P0

**Preconditions:**
- Email "existing@example.com" already registered

**Test Steps:**
1. Fill registration form with email "existing@example.com"
2. Submit form

**Expected Results:**
- ✓ Error message: "This email is already registered. Please use the Login tab or try a different email."
- ✓ Form does not submit
- ✓ Suggest user tries to log in instead

---

### TC-AUTH-005: Contractor Registration - POPIA Consent Not Given
**Priority:** P0

**Test Steps:**
1. Fill all fields correctly
2. Leave POPIA consent checkboxes unchecked
3. Click "Next"

**Expected Results:**
- ✓ Error message: "You must consent to the Privacy Policy and Terms of Service to proceed"
- ✓ Form does not advance to tier selection
- ✓ Checkboxes highlighted

---

### TC-AUTH-006: Contractor Login - Approved Contractor
**Priority:** P0

**Preconditions:**
- Contractor registered and approved (`status = 'approved'`, `payment_approved = true`)

**Test Steps:**
1. Navigate to login page
2. Enter email: "approved@example.com"
3. Enter password: "SecurePass123!"
4. Click "Login"

**Expected Results:**
- ✓ Authentication successful via Supabase
- ✓ User role detected as "contractor"
- ✓ Redirected to MainDashboard
- ✓ Access token stored in sessionStorage
- ✓ Contractor data loaded (company name, tier, etc.)
- ✓ Dashboard shows: "Welcome back, [Company Name]"
- ✓ Tier badge displayed (PROFESSIONAL, ENTERPRISE, etc.)

**Component:** `AuthForm.tsx`

---

### TC-AUTH-007: Contractor Login - Payment Pending
**Priority:** P0

**Preconditions:**
- Contractor registered but payment not approved (`status = 'pending'`, `payment_approved = false`)

**Test Steps:**
1. Navigate to login page
2. Enter credentials for pending contractor
3. Click "Login"

**Expected Results:**
- ✓ Authentication successful (Supabase login works)
- ✓ Payment gate triggered
- ✓ Message displayed: "Your payment is being verified. Please wait for admin approval. Estimated time: 24-48 hours for manual EFT."
- ✓ Contact information shown: "Contact admin@qilly.co.za for assistance"
- ✓ User NOT redirected to dashboard
- ✓ "Logout" button available

**Component:** `AuthForm.tsx` lines 182-211

---

### TC-AUTH-008: Contractor Login - Invalid Credentials
**Priority:** P0

**Test Steps:**
1. Enter email: "test@example.com"
2. Enter wrong password: "WrongPass123"
3. Click "Login"

**Expected Results:**
- ✓ Error message: "Invalid email or password"
- ✓ User remains on login screen
- ✓ Password field cleared
- ✓ Error styling applied to form

---

### TC-AUTH-009: Admin Login
**Priority:** P0

**Preconditions:**
- Admin account exists in Supabase with `role = 'admin'`

**Test Steps:**
1. Navigate to main login page
2. Click "Admin Login" link
3. Enter admin email and password
4. Click "Login"

**Expected Results:**
- ✓ Redirected to AdminDashboard
- ✓ `sessionStorage.admin_logged_in = 'true'`
- ✓ Admin tabs visible (Suppliers, Contractors, Database, Billing, etc.)
- ✓ Contractor/supplier approval queue displayed

**Component:** `AdminLogin.tsx`

**⚠️ SECURITY WARNING:** Currently hardcoded admin credentials in `AdminLogin.tsx:24-25`. MUST BE REMOVED before production!

---

### TC-AUTH-010: Supplier Registration
**Priority:** P0

**Test Steps:**
1. Navigate to AuthForm
2. Click "Supplier Signup"
3. Fill in:
   - Company Name: "Test Suppliers (Pty) Ltd"
   - Registration Number: "2020/123456/07"
   - VAT Number: "4123456789"
   - Contact Person: "Jane Smith"
   - Email: "jane@testsuppliers.co.za"
   - Phone: "0113456789"
   - Address: Complete address
   - Product Categories: Select "Building Materials", "Steel & Reinforcement"
   - Province: "Gauteng"
   - Years in Business: "10"
   - BBBEE Level: "2"
   - Certification: Check "Yes"
4. Select tier: "PROFESSIONAL"
5. Billing cycle: "Monthly"
6. Check POPIA consents
7. Click "Register"

**Expected Results:**
- ✓ Supplier account created with `status = 'pending'`
- ✓ Success message: "Registration submitted! Your account is pending approval."
- ✓ Redirected to login screen
- ✓ Confirmation email sent
- ✓ Record saved to `suppliers` table

**Component:** `SupplierSignup.tsx`

---

### TC-AUTH-011: Partner Login
**Priority:** P1

**Test Steps:**
1. Navigate to AuthForm
2. Click "Partner Portal"
3. Click "Partner Login"
4. Enter partner credentials (or demo: "partner@procore.com" / "Demo1234!")
5. Click "Login"

**Expected Results:**
- ✓ Redirected to PartnerPortal
- ✓ `sessionStorage.partner_logged_in = 'true'`
- ✓ White-label config tab visible
- ✓ API integration tab visible
- ✓ Analytics dashboard visible

**Component:** `PartnerLogin.tsx`

**⚠️ SECURITY WARNING:** Demo credentials hardcoded in `PartnerLogin.tsx:29-30`. MUST BE REMOVED in production!

---

### TC-AUTH-012: Logout Flow
**Priority:** P0

**Test Steps:**
1. Log in as any user type (contractor, admin, partner)
2. Click "Logout" button

**Expected Results:**
- ✓ sessionStorage cleared (`access_token`, `admin_logged_in`, `demo_mode`, `user_type`)
- ✓ Supabase session ended
- ✓ Redirected to login page
- ✓ Attempting to access dashboard redirects back to login
- ✓ Back button does not restore session

**Component:** `App.tsx` `handleLogout()` function

---

---

## BOQ PROCESSING TESTS

### TC-BOQ-001: Manual BOQ Entry - Small Project
**Priority:** P0

**Preconditions:**
- Logged in as PROFESSIONAL tier contractor
- On MainDashboard, "Upload" tab

**Test Steps:**
1. Click "Manual Entry" mode
2. Click "Add Item"
3. Enter:
   - Code: "A001"
   - Description: "Excavation for foundations in soft soil"
   - Quantity: "150"
   - Unit: Select "m³"
4. Click "Add Item" again
5. Enter:
   - Code: "B002"
   - Description: "Concrete foundation mix 30 MPa"
   - Quantity: "25"
   - Unit: "m³"
6. Click "Add Item" again
7. Enter:
   - Code: "C003"
   - Description: "Steel reinforcing bars Y16"
   - Quantity: "2.5"
   - Unit: "tonne"
8. Fill Project Settings:
   - Province: "Gauteng"
   - Municipality: "City of Johannesburg"
   - Profit Margin: "15%"
   - Duration: "3 months"
   - Machinery: "Standard"
9. Click "Process Bill"

**Expected Results:**
- ✓ Loading indicator displayed
- ✓ API call to `/api/processBill` successful (status 200)
- ✓ Processing time < 5 seconds
- ✓ Response includes:
  - `billId` generated
  - 3 line items with prices
  - Supplier matched to each item
  - Unit rate, quantity, total (ex VAT, inc VAT)
  - VAT 15% calculated correctly
  - Grand total (ex + inc)
- ✓ Bill saved to `bills` table
- ✓ 3 records saved to `bill_items` table
- ✓ View switched to "Result" (RegionalPricedBillView)
- ✓ All 3 items displayed in table
- ✓ Totals calculated correctly
- ✓ Export buttons visible (Excel, PDF)

**Database Verification:**
```sql
SELECT * FROM bills WHERE contractor_id = [test_contractor_id] ORDER BY created_at DESC LIMIT 1;
-- Verify: 3 items, totals match, province = 'Gauteng'

SELECT * FROM bill_items WHERE bill_id = [billId];
-- Verify: 3 records, quantities and unit rates present
```

**Component:** `BillUpload.tsx`, `RegionalPricedBillView.tsx`

---

### TC-BOQ-002: Excel Upload - Medium Project
**Priority:** P0

**Preconditions:**
- PROFESSIONAL tier contractor
- Excel file with 50 line items prepared

**Test Data:** `test_boq_50_items.xlsx`
- Columns: Code, Description, Quantity, Unit
- 50 rows of construction items

**Test Steps:**
1. Navigate to "Upload" tab
2. Click "Upload Excel/CSV"
3. Select `test_boq_50_items.xlsx`
4. Wait for file parsing
5. Review preview table (shows 10 of 50 items)
6. Click "Confirm & Process"
7. Fill project settings (Gauteng, Johannesburg, 15%, 6 months, Heavy machinery)
8. Click "Process Bill"

**Expected Results:**
- ✓ File parsed successfully (all 50 items)
- ✓ Preview shows correct data
- ✓ Validation passes (no errors)
- ✓ Processing time < 15 seconds
- ✓ All 50 items priced
- ✓ Supplier matched to each item (or "No supplier found" message)
- ✓ Grand total calculated
- ✓ Bill saved with 50 bill_items records

**Performance Check:**
- Processing time should be < 15 seconds for 50 items
- If > 15 seconds, investigate pricing engine performance

**Component:** `BillUpload.tsx`

---

### TC-BOQ-003: Excel Upload - Invalid File Format
**Priority:** P0

**Test Data:** `invalid_file.txt` (text file renamed to .xlsx)

**Test Steps:**
1. Attempt to upload `invalid_file.txt`

**Expected Results:**
- ✓ Error message: "Invalid file format. Please upload .xlsx, .xls, or .csv"
- ✓ File rejected before parsing
- ✓ No API call made

---

### TC-BOQ-004: Excel Upload - Missing Required Columns
**Priority:** P0

**Test Data:** Excel file with only "Description" column (missing Quantity, Unit)

**Test Steps:**
1. Upload Excel with missing columns

**Expected Results:**
- ✓ Parse attempt
- ✓ Error message: "Required columns missing: Quantity, Unit"
- ✓ User prompted to fix file and re-upload
- ✓ Template download link provided

---

### TC-BOQ-005: Steel BOQ - Catalogue Browse
**Priority:** P1

**Preconditions:**
- Logged in as PROFESSIONAL tier contractor

**Test Steps:**
1. Navigate to "Steel BOQ" tab
2. Click "Catalogue" sub-tab
3. Expand "Reinforcing" category
4. Expand "Structural Sections" category
5. Search for "Y12"
6. Click on item "RE-Y12-12M"

**Expected Results:**
- ✓ Steel BOQ tab visible
- ✓ 8 categories displayed:
  - Reinforcing
  - Structural Sections
  - Hollow Sections
  - Angles
  - Flat Products
  - Roofing/Cladding
  - Mesh & Wire
  - Fasteners & Accessories
- ✓ Reinforcing category shows 10+ items
- ✓ Search filters results to Y12, Y10, etc.
- ✓ Item details shown:
  - Code: RE-Y12-12M
  - Description: "Reinforcing Bar Y12 (High Yield 450MPa) — 12m length"
  - Grade: 450MPa
  - Unit: 12m bar
  - Base Price: R148.00 (Gauteng base)
  - Supplier rates: Cape Gate, ArcelorMittal, BRC
- ✓ SANS 1200 reference: "SANS 1200 C / DB"
- ✓ BuildAid reference: "BuildAid 2025 p.87 §R003"

**Component:** `SteelBoqUpload.tsx` - Catalogue tab

---

### TC-BOQ-006: Steel BOQ - Excel Template Download
**Priority:** P1

**Test Steps:**
1. Navigate to Steel BOQ > Upload tab
2. Click "Download Excel Template"

**Expected Results:**
- ✓ Excel file downloaded: `Qilly_Steel_BOQ_Template.xlsx`
- ✓ File contains:
  - Column headers: Item Code, Description, Grade, Quantity, Unit, Notes
  - Example row 1: RE-Y10-12M, Y10 Reinforcing Bar, 450MPa, 100, 12m bar
  - Example row 2: ST-UC305, 305x305 UC, S275, 5, tonne
  - Instructions sheet with step-by-step import guide
- ✓ File opens correctly in Excel

**Component:** `SteelBoqUpload.tsx` - Upload tab

---

### TC-BOQ-007: Steel BOQ - Upload & Price
**Priority:** P1

**Test Data:** Completed steel BOQ Excel with 10 items

**Test Steps:**
1. Upload steel BOQ Excel file
2. Preview parsed items
3. Select province: "Western Cape"
4. Click "Price Steel BOQ"

**Expected Results:**
- ✓ All 10 items parsed
- ✓ Items matched to steel catalogue
- ✓ Unit rates displayed
- ✓ Best supplier highlighted
- ✓ Provincial freight adjustment applied (+8% for Western Cape)
- ✓ Mass calculations (kg and tonnes) shown
- ✓ Total ex VAT and inc VAT calculated
- ✓ Redirected to SteelPricedBillView

**Component:** `SteelBoqUpload.tsx`, `SteelPricedBillView.tsx`

---

### TC-BOQ-008: Template Library - Load Template
**Priority:** P0

**Preconditions:**
- FREE tier contractor (can only use templates, cannot upload)

**Test Steps:**
1. Navigate to MainDashboard
2. Default view should be "Template Library" (FREE tier restriction)
3. Browse templates
4. Select template: "2-Storey Residential House (BuildAid Standard)"
5. Click "Load Template"
6. Review pre-filled items
7. Modify quantity for item #5: Change from 50 m² to 75 m²
8. Select province: "KwaZulu-Natal"
9. Click "Process Bill"

**Expected Results:**
- ✓ Template library is default view for FREE tier
- ✓ "Upload" tab is disabled/hidden for FREE tier
- ✓ Template loads with ~30 line items
- ✓ Contractor details auto-filled (name, CIDB grade, province)
- ✓ Quantities are editable
- ✓ Processing succeeds
- ✓ Trial bills counter decremented: "2 free bills remaining"
- ✓ Toast notification shown

**Component:** `BoqTemplateLibrary.tsx`, `MainDashboard.tsx`

---

### TC-BOQ-009: FREE Tier - Trial Limit Reached
**Priority:** P0

**Preconditions:**
- FREE tier contractor with `trial_bills_remaining = 0`

**Test Steps:**
1. Load a template
2. Attempt to process bill

**Expected Results:**
- ✓ Error message: "Trial complete - Upgrade to continue"
- ✓ Upgrade modal appears
- ✓ Processing blocked
- ✓ "Upgrade Now" button displayed
- ✓ User can view pricing tiers

**Component:** `BillUpload.tsx`, `SubscriptionUpgradeModal.tsx`

---

### TC-BOQ-010: Bill History - View Past Bills
**Priority:** P1

**Preconditions:**
- Contractor has processed 5+ bills previously

**Test Steps:**
1. Navigate to "History" tab
2. View bill list
3. Sort by "Date" (descending)
4. Click on most recent bill

**Expected Results:**
- ✓ Table shows all 5+ bills
- ✓ Columns: Project Name, Date, Total (inc VAT), Status
- ✓ Bills sorted newest first
- ✓ Click opens full bill details (RegionalPricedBillView)
- ✓ Export buttons available
- ✓ User can re-download PDF/Excel

**Component:** `BillHistory.tsx`

---

### TC-BOQ-011: Regional Pricing - Provincial Variations
**Priority:** P1

**Test Data:** Same 10-item BOQ processed in 3 different provinces

**Test Steps:**
1. Process BOQ with province "Gauteng" (baseline)
2. Note total cost
3. Process same BOQ with province "Western Cape"
4. Note total cost
5. Process same BOQ with province "Limpopo"
6. Note total cost
7. Compare totals

**Expected Results:**
- ✓ Gauteng total: R100,000 (baseline)
- ✓ Western Cape total: ~R108,000 (+8% freight)
- ✓ Limpopo total: ~R110,000 (+10% freight + remote area surcharge)
- ✓ Provincial adjustments applied correctly
- ✓ Breakdown shows freight component

**Component:** `utils/regionalOptimization.ts`, `RegionalPricedBillView.tsx`

---

### TC-BOQ-012: Drawing Upload - AI Extraction (Dev Mode Only)
**Priority:** P2

**Preconditions:**
- Development environment (`showAIUpload = true`)

**Test Data:** Architectural drawing PDF with clear BOQ items

**Test Steps:**
1. Navigate to "Drawing" tab (visible in dev mode)
2. Upload architectural drawing PDF
3. Wait for AI extraction
4. Review extracted items
5. Edit item #3 (description incorrect)
6. Confirm and process

**Expected Results:**
- ✓ PDF uploaded successfully
- ✓ OCR extraction completed (Tesseract.js)
- ✓ Items displayed with confidence scores
- ✓ User can edit descriptions
- ✓ Processing succeeds after edits
- ✓ Feature NOT visible in production

**Component:** `DrawingUpload.tsx`  
**Feature Flag:** `showAIUpload`

---

---

## PAYMENT & SUBSCRIPTION TESTS

### TC-PAY-001: Manual EFT Payment - Contractor Submits
**Priority:** P0

**Preconditions:**
- New contractor registration
- Selected PROFESSIONAL tier
- Chose "Manual EFT" payment method

**Test Steps:**
1. Complete contractor signup
2. Note payment reference (e.g., "QILLY-abc123-1683456789")
3. Note bank details displayed
4. Confirm submission

**Expected Results:**
- ✓ Unique payment reference generated
- ✓ Bank account details displayed:
  - Bank: FNB / Standard Bank / Nedbank (whichever Qilly uses)
  - Account Number: [Account #]
  - Branch Code: [Branch code]
  - Account Type: Business Cheque
  - Reference: QILLY-abc123-1683456789
- ✓ `payment_method = 'manual'` or `'bank_transfer'`
- ✓ `payment_reference` saved
- ✓ `payment_amount = 2999.00` (PROFESSIONAL monthly)
- ✓ `payment_approved = false`
- ✓ Confirmation email sent with payment details
- ✓ Message: "Your account will be activated once payment is verified (24-48 hours)"

**Database Verification:**
```sql
SELECT payment_method, payment_reference, payment_amount, payment_approved, status
FROM contractors WHERE email = '[test email]';
-- Verify: payment_approved = false, status = 'pending'
```

**Component:** `PaymentStep.tsx`, `payments/EFTPayment.tsx`

---

### TC-PAY-002: Admin Verifies Manual EFT
**Priority:** P0

**Preconditions:**
- Contractor submitted manual EFT payment
- Admin has bank statement showing payment received

**Test Steps:**
1. Log in as admin
2. Navigate to "Payments" tab
3. Filter: "Pending"
4. Locate contractor with matching payment reference
5. Verify amount matches
6. Click "Verify & Approve EFT"

**Expected Results:**
- ✓ Table shows pending payment with:
  - Contractor name
  - Payment reference
  - Amount
  - Date submitted
  - Status: "Pending"
- ✓ Click "Verify & Approve"
- ✓ Confirmation prompt: "Confirm payment of R2,999 received for [Company Name]?"
- ✓ Click "Confirm"
- ✓ `payment_approved = true`
- ✓ `status = 'approved'`
- ✓ `approved_at = NOW()`
- ✓ Email sent to contractor: "Your payment has been verified. You can now log in."
- ✓ Row removed from pending list

**Database Verification:**
```sql
SELECT payment_approved, status, approved_at FROM contractors WHERE id = '[contractor id]';
-- Verify: payment_approved = true, status = 'approved', approved_at IS NOT NULL
```

**Component:** `PaymentVerification.tsx` (AdminDashboard)

---

### TC-PAY-003: Stitch Auto-Debit - Success
**Priority:** P0

**Preconditions:**
- New contractor registration
- Selected PROFESSIONAL tier
- Chose "Stitch" payment method

**Test Steps:**
1. Click "Pay with Stitch"
2. Redirect to Stitch authentication
3. Select bank: "Standard Bank"
4. Enter bank credentials (test account)
5. Authorize debit of R2,999
6. Return to Qilly

**Expected Results:**
- ✓ Redirect to Stitch flow
- ✓ Bank authentication successful
- ✓ Debit authorized
- ✓ Payment processed immediately
- ✓ Return to Qilly with success callback
- ✓ `payment_method = 'stitch'`
- ✓ `payment_approved = true` (auto-approved)
- ✓ `status = 'approved'`
- ✓ `approved_at = NOW()`
- ✓ Redirect to MainDashboard
- ✓ Success message: "Payment successful! Welcome to Qilly Professional."
- ✓ Receipt emailed to contractor

**Component:** `payments/StitchPayment.tsx`  
**Integration:** Stitch API

---

### TC-PAY-004: PayFast Credit Card - Success
**Priority:** P0

**Preconditions:**
- New contractor registration
- Selected ENTERPRISE tier (R8,999/month)
- Chose "PayFast" payment method

**Test Steps:**
1. Click "Pay with PayFast"
2. Enter test credit card details:
   - Card Number: 4000 0000 0000 0002 (test card)
   - Expiry: 12/28
   - CVV: 123
   - Name: John Doe
3. Click "Pay R8,999"
4. Wait for processing

**Expected Results:**
- ✓ Redirect to PayFast payment page or iframe
- ✓ Card details entered
- ✓ Payment processed successfully
- ✓ Return to Qilly with success
- ✓ `payment_method = 'payfast'`
- ✓ `payment_approved = true` (auto-approved)
- ✓ `status = 'approved'`
- ✓ `subscription_tier = 'enterprise'`
- ✓ Redirect to MainDashboard
- ✓ Enterprise features unlocked
- ✓ Receipt emailed

**Component:** `payments/PayFastPayment.tsx`  
**Integration:** PayFast API

---

### TC-PAY-005: PayFast Credit Card - Declined
**Priority:** P1

**Test Steps:**
1. Same as TC-PAY-004 but use declined test card: 4000 0000 0000 0127
2. Attempt payment

**Expected Results:**
- ✓ Payment declined by PayFast
- ✓ Error message: "Payment declined. Please check your card details or try a different payment method."
- ✓ User returned to payment step
- ✓ Account NOT approved (`payment_approved = false`)
- ✓ User can retry with different card or method

---

### TC-PAY-006: Tier Upgrade - FREE to PROFESSIONAL
**Priority:** P1

**Preconditions:**
- Logged in as FREE tier contractor
- Trial bills remaining: 0

**Test Steps:**
1. Attempt to process a bill
2. Upgrade modal appears
3. Click "Upgrade to PROFESSIONAL"
4. Review features comparison
5. Select payment method: "Stitch"
6. Complete payment
7. Redirect to dashboard

**Expected Results:**
- ✓ Upgrade modal shows tier comparison
- ✓ Highlights: "Unlimited BOQ uploads", "Live supplier pricing"
- ✓ Price: R2,999/month
- ✓ Payment processed successfully
- ✓ `subscription_tier` updated from 'free' to 'professional'
- ✓ `subscription_start_date = NOW()`
- ✓ `next_billing_date` calculated (30 days from now)
- ✓ `trial_bills_remaining` reset or removed
- ✓ Dashboard refreshes
- ✓ "Upload" tab now visible
- ✓ Template library still accessible
- ✓ Can upload custom BOQs

**Database Verification:**
```sql
SELECT subscription_tier, subscription_start_date, next_billing_date, trial_bills_remaining
FROM contractors WHERE id = '[contractor id]';
-- Verify tier upgraded, dates set correctly
```

**Component:** `payments/SubscriptionUpgradeModal.tsx`

---

### TC-PAY-007: Billing Cycle - Monthly vs Annual
**Priority:** P2

**Test Steps:**
1. During supplier signup, select "Annual" billing cycle
2. Select PROFESSIONAL tier (R2,999/month)
3. Note payment amount

**Expected Results:**
- ✓ Annual price displayed: R2,999 × 12 × 0.9 = R32,389 (10% discount)
- ✓ `billing_cycle = 'annual'`
- ✓ `next_billing_date` = 365 days from now (not 30 days)
- ✓ Discount applied and shown

---

### TC-PAY-008: Payment Audit - Admin Review
**Priority:** P1

**Preconditions:**
- 10+ payment transactions in system (mix of manual, Stitch, PayFast)

**Test Steps:**
1. Log in as admin
2. Navigate to "Billing" > "Payment Audit"
3. Filter by date range: Last 30 days
4. Export to CSV

**Expected Results:**
- ✓ Table shows all transactions
- ✓ Columns: Date, Contractor, Amount, Method, Status, Verified By, Verified At
- ✓ Can sort by any column
- ✓ Filter by status: All, Pending, Verified, Rejected
- ✓ Search by contractor name or payment reference
- ✓ CSV export downloads successfully
- ✓ CSV contains all visible rows

**Component:** `PaymentAudit.tsx`

---

---

## SUPPLIER MANAGEMENT TESTS

### TC-SUP-001: Admin Approves Supplier
**Priority:** P0

**Preconditions:**
- Supplier registered with `status = 'pending'`

**Test Steps:**
1. Log in as admin
2. Navigate to "Suppliers" tab
3. Filter: "Pending"
4. Locate pending supplier: "Test Suppliers (Pty) Ltd"
5. Review details:
   - Product categories: Building Materials, Steel
   - BBBEE Level: 2
   - Registration Number: 2020/123456/07
6. Click "Approve"

**Expected Results:**
- ✓ Confirmation prompt: "Approve Test Suppliers (Pty) Ltd?"
- ✓ Click "Confirm"
- ✓ `status = 'approved'`
- ✓ `approved_at = NOW()`
- ✓ Email sent to supplier: "Your supplier account has been approved. You can now log in and add products."
- ✓ Supplier removed from "Pending" list
- ✓ Supplier appears in "Approved" list

**Database Verification:**
```sql
SELECT status, approved_at FROM suppliers WHERE email = 'jane@testsuppliers.co.za';
-- Verify: status = 'approved', approved_at IS NOT NULL
```

**Component:** `AdminDashboard.tsx` - Suppliers tab

---

### TC-SUP-002: Admin Rejects Supplier
**Priority:** P1

**Test Steps:**
1. Navigate to Suppliers > Pending
2. Select supplier
3. Click "Reject"
4. Enter rejection reason: "Invalid BBBEE certificate"
5. Confirm

**Expected Results:**
- ✓ Rejection reason input field appears
- ✓ `status = 'rejected'`
- ✓ `rejected_at = NOW()`
- ✓ `rejection_reason = 'Invalid BBBEE certificate'`
- ✓ Email sent to supplier with rejection reason
- ✓ Supplier can re-apply after correcting issues

---

### TC-SUP-003: Supplier Adds Products
**Priority:** P1

**Preconditions:**
- Approved supplier logged in
- Supplier has PROFESSIONAL tier (up to 50 products)

**Test Steps:**
1. Navigate to Supplier Dashboard (not yet implemented - use admin tools)
2. Navigate to "Products" section (via SupplierAPIManager or CatalogManager)
3. Click "Add Product"
4. Fill in:
   - Code: "CEM-42.5N"
   - Description: "Portland Cement 42.5N - 50kg bag"
   - Unit: "bag"
   - Unit Price: "125.00"
   - Category: "Cement & Concrete"
   - Availability: Checked (in stock)
5. Click "Save Product"

**Expected Results:**
- ✓ Product saved to `supplier_products` table
- ✓ `supplier_id` = current supplier's ID
- ✓ `is_available = true`
- ✓ `created_at = NOW()`
- ✓ Success message: "Product added successfully"
- ✓ Product appears in supplier's product list
- ✓ Product now available in pricing engine for contractors

**Database Verification:**
```sql
SELECT * FROM supplier_products WHERE supplier_id = '[supplier id]' AND product_code = 'CEM-42.5N';
-- Verify: product_code, unit_price, category correct
```

**Component:** `SupplierAPIManager.tsx`, `CatalogManager.tsx`

---

### TC-SUP-004: Supplier Updates Product Pricing
**Priority:** P1

**Preconditions:**
- Supplier has product "CEM-42.5N" with unit price R125.00

**Test Steps:**
1. Navigate to Products list
2. Click "Edit" on "CEM-42.5N"
3. Change unit price from R125.00 to R132.00
4. Click "Update"

**Expected Results:**
- ✓ `unit_price = 132.00`
- ✓ `last_updated = NOW()`
- ✓ Success message displayed
- ✓ Immediate effect in pricing engine (new BOQs use R132.00)

**Component:** `SupplierAPIManager.tsx`

---

### TC-SUP-005: Supplier Product Limit - Tier Enforcement
**Priority:** P1

**Preconditions:**
- Supplier has FREE tier (max 5 products)
- Supplier has already added 5 products

**Test Steps:**
1. Attempt to add 6th product
2. Fill form and click "Save"

**Expected Results:**
- ✓ Error message: "FREE tier limit reached. You have 5/5 products. Upgrade to PROFESSIONAL to add up to 50 products."
- ✓ Product NOT saved
- ✓ Upgrade prompt displayed

---

### TC-SUP-006: Supplier Search - By Category
**Priority:** P1

**Preconditions:**
- 20+ suppliers in database across multiple categories

**Test Steps:**
1. Log in as contractor
2. Navigate to "Suppliers" page (Suppliers.tsx or SupplierSearch.tsx)
3. Filter by category: "Steel & Reinforcement"
4. View results

**Expected Results:**
- ✓ Results show only suppliers with "Steel & Reinforcement" in their product_categories
- ✓ Supplier count displayed (e.g., "12 suppliers found")
- ✓ Each result shows:
  - Company name
  - Province
  - BBBEE level
  - Years in business
  - "View Products" button

**Component:** `SupplierSearch.tsx`, `Suppliers.tsx`

---

### TC-SUP-007: Supplier Comparison - Multi-Supplier Rates
**Priority:** P1

**Preconditions:**
- Priced BOQ with item matched to 3+ suppliers

**Test Steps:**
1. View priced BOQ (RegionalPricedBillView or SteelPricedBillView)
2. Click "Compare Suppliers" on line item #5
3. View comparison modal

**Expected Results:**
- ✓ Modal shows 3+ suppliers for that item
- ✓ Columns: Supplier Name, Unit Price, Availability, Notes
- ✓ Best price highlighted (lowest)
- ✓ User can select alternative supplier
- ✓ Click "Select [Supplier Name]"
- ✓ Bill recalculated with new supplier
- ✓ Total updated

**Component:** `RegionalPricedBillView.tsx` supplier comparison feature

---

### TC-SUP-008: Supplier Coverage Report
**Priority:** P2

**Preconditions:**
- Logged in as admin

**Test Steps:**
1. Navigate to AdminDashboard > "Legal Audit" tab (or "Coverage" tab)
2. View Supplier Coverage Compliance report
3. Review categories A-Q

**Expected Results:**
- ✓ Report shows all categories (A: Structural Steel, B: Reinforcing, ..., Q: Landscaping)
- ✓ Supplier count per category
- ✓ Phase status (Phase 1: Complete, Phase 2: In Progress, Phase 3: Planned)
- ✓ Supplier names listed per category
- ✓ Gap analysis: Categories with < 3 suppliers highlighted
- ✓ Total supplier count: 159

**Component:** `SupplierCoverageCompliance.tsx`

---

### TC-SUP-009: Supplier Legal Audit - All 159 Suppliers
**Priority:** P2

**Test Steps:**
1. Navigate to AdminDashboard > "Legal Audit" tab
2. View SupplierLegalAudit component
3. Review compliance data for all 159 suppliers

**Expected Results:**
- ✓ Table lists all 159 suppliers
- ✓ Columns: Company Name, BBBEE Level, Tax Clearance, CIDB Registration, Insurance, Certifications, Risk Rating
- ✓ Compliance status: Compliant / Pending / Non-compliant
- ✓ Steel suppliers (59) clearly identified
- ✓ Export to Excel functional

**Component:** `SupplierLegalAudit.tsx`

---

---

## COMPLIANCE FEATURE TESTS

### TC-COMP-001: Green Building - Carbon Tracking
**Priority:** P1

**Preconditions:**
- ENTERPRISE tier contractor
- Processed BOQ with 20 items

**Test Steps:**
1. Navigate to "Green Building" dashboard
2. Select recent BOQ
3. View carbon emissions report

**Expected Results:**
- ✓ Total carbon emissions displayed (e.g., "45.2 tCO2e")
- ✓ Baseline comparison: "Standard project: 58.7 tCO2e"
- ✓ Reduction percentage: "23% reduction"
- ✓ Tree equivalency: "Equivalent to 180 trees planted"
- ✓ Green score: "A-" (or B+, A, etc.)
- ✓ Eco-friendly alternatives suggested for high-carbon items
- ✓ Export sustainability report to PDF

**Component:** `GreenDashboard.tsx`, `EnvironmentalComplianceDashboard.tsx`

---

### TC-COMP-002: Green Building - Eco-Friendly Alternatives
**Priority:** P1

**Test Steps:**
1. View priced BOQ
2. Item #8: "Concrete aggregate (virgin)"
3. Click "View Green Alternatives"

**Expected Results:**
- ✓ Alternative displayed: "Recycled concrete aggregate"
- ✓ Carbon savings: "3.2 tCO2e saved"
- ✓ Price comparison: "+5% cost" or "-2% cost"
- ✓ "Use Alternative" button
- ✓ Click button → item swapped
- ✓ Bill recalculated with green alternative
- ✓ Green score updated

**Component:** `RegionalPricedBillView.tsx`, `GreenDashboard.tsx`

---

### TC-COMP-003: eTender - Generate Response Package
**Priority:** P1

**Preconditions:**
- PROFESSIONAL tier contractor
- Completed BOQ for government tender

**Test Steps:**
1. Navigate to eTender integration
2. Select BOQ: "Province Road Upgrade Project"
3. Click "Generate eTender Response"
4. Auto-fill contractor credentials
5. Add project references
6. Generate PDF

**Expected Results:**
- ✓ Document includes:
  - Cover page with company logo
  - Executive summary
  - Company profile (CIDB, BBBEE, track record)
  - Pricing schedule (from BOQ)
  - Compliance declarations
  - Environmental impact statement
  - References
- ✓ PDF export successful
- ✓ Professional tier: Basic template (limited customization)
- ✓ Enterprise tier: Full customization

**Component:** `TenderResponseGenerator.tsx`, `ETenderInvestorBrief.tsx`

---

### TC-COMP-004: Collusion Detection - Bid Rigging Analysis
**Priority:** P1

**Preconditions:**
- ENTERPRISE tier contractor
- 3 quotes for same project uploaded

**Test Data:**
- Quote 1: Total R500,000
- Quote 2: Total R502,000 (suspicious: very close to Quote 1)
- Quote 3: Total R620,000

**Test Steps:**
1. Navigate to Collusion Detection
2. Upload Quote 1, Quote 2, Quote 3
3. Click "Analyze"

**Expected Results:**
- ✓ Statistical analysis completed
- ✓ Risk score: "High" (due to Quote 1 and Quote 2 similarity)
- ✓ Red flags:
  - "Quote 1 and Quote 2 differ by only 0.4%"
  - "80% of line items have identical pricing between Quote 1 and Quote 2"
  - "Possible bid rigging pattern detected"
- ✓ Recommendation: "Consider re-tendering or seeking additional quotes"
- ✓ Compliance report generated for audit trail
- ✓ Export to PDF

**Component:** `CollusionDetection.tsx`

---

### TC-COMP-005: Environmental Compliance - NEMA Screening
**Priority:** P1

**Test Data:**
- Project type: "Road Construction"
- Size: "Excavation 12,000 m³"
- Location: "Near river (50m)"

**Test Steps:**
1. Navigate to Environmental Compliance Assessment
2. Enter project details
3. Click "Screen for NEMA Requirements"

**Expected Results:**
- ✓ Analysis completed
- ✓ Trigger identified: "Excavation > 5,000 m³ triggers NEMA Activity 19"
- ✓ Additional trigger: "Construction within 100m of watercourse triggers Activity 12"
- ✓ Assessment required: "Full Environmental Impact Assessment (EIA)"
- ✓ Mitigation recommendations:
  - Sediment control measures
  - Water quality monitoring
  - Biodiversity assessment
- ✓ Specialist referral: "Environmental Practitioner required"
- ✓ Export compliance report to PDF

**Component:** `EnvironmentalComplianceDashboard.tsx`, `EnvironmentalComplianceModule.tsx`

---

### TC-COMP-006: Compliance Cost Calculator
**Priority:** P1

**Preconditions:**
- ENTERPRISE tier contractor
- BOQ total: R2,000,000 (ex VAT)

**Test Steps:**
1. View priced BOQ
2. Scroll to "Compliance Costs" section
3. Review breakdown

**Expected Results:**
- ✓ Cost categories displayed:
  - Safety compliance: R80,000 (4%)
  - Environmental mitigation: R60,000 (3%)
  - Legal/administrative: R20,000 (1%)
  - Insurance & bonding: R40,000 (2%)
  - Certifications & training: R15,000 (0.75%)
- ✓ Total compliance cost: R215,000 (10.75% of project)
- ✓ Breakdown per category
- ✓ Editable assumptions (user can adjust percentages)
- ✓ Export to Excel

**Component:** `ComplianceCostCalculator.tsx`

---

---

## ADMIN DASHBOARD TESTS

### TC-ADM-001: Admin Dashboard - View Metrics
**Priority:** P1

**Preconditions:**
- Logged in as admin
- Database has 50 contractors, 30 suppliers, 200 bills processed

**Test Steps:**
1. View AdminDashboard landing page
2. Review stats cards

**Expected Results:**
- ✓ Stats cards display:
  - Total Suppliers: 30 (10 pending, 20 approved, 0 rejected)
  - Total Contractors: 50 (5 pending, 43 approved, 2 rejected)
  - BOQs Processed This Month: 120
  - Revenue MTD: R134,955 (45 × R2,999)
- ✓ All numbers match database counts
- ✓ Cards update in real-time (or on page refresh)

**Component:** `AdminDashboard.tsx` stats section

---

### TC-ADM-002: Database Inspector - Browse Tables
**Priority:** P1

**Test Steps:**
1. Navigate to AdminDashboard > "Database" tab
2. Select table: "contractors"
3. View records
4. Search for "Test Construction Co"
5. Export to CSV

**Expected Results:**
- ✓ Table list displayed (users, contractors, suppliers, bills, bill_items, etc.)
- ✓ Contractors table loads 50 records (pagination: 50 per page)
- ✓ Columns: id, company_name, email, cidb_grade, status, subscription_tier, created_at
- ✓ Search filters results to matching rows
- ✓ Click "Export CSV" downloads file with all records
- ✓ CSV opens correctly in Excel

**Component:** `DatabaseInspector.tsx`

---

### TC-ADM-003: Database Setup - Run Migrations
**Priority:** P0 (for deployment)

**Preconditions:**
- Fresh Supabase project (no tables created yet)
- Logged in as admin in development/staging environment

**Test Steps:**
1. Navigate to AdminDashboard > "Database Setup" tab (dev/staging only)
2. Click "Run Migration: 01_INITIALIZE_ALL_TABLES.sql"
3. Wait for completion
4. Verify success
5. Click "Run Migration: 003_create_boq_rates_table.sql"
6. Verify success

**Expected Results:**
- ✓ Migration scripts execute successfully
- ✓ Tables created: users, contractors, suppliers, bills, bill_items, supplier_products, boq_rates, consent_audit_log
- ✓ Indexes created
- ✓ RLS policies created (if included in migration)
- ✓ Success message: "Migration completed successfully"
- ✓ Tables visible in DatabaseInspector

**Component:** `DatabaseSetup.tsx`  
**SQL Scripts:** `/supabase/migrations/`

**⚠️ Note:** This tab should ONLY be visible in dev/staging environments, NOT in production.

---

### TC-ADM-004: User Session Viewer
**Priority:** P2

**Test Steps:**
1. Have 5+ users logged in simultaneously
2. Navigate to AdminDashboard > "User Session" tab
3. View active sessions

**Expected Results:**
- ✓ Table shows all active sessions
- ✓ Columns: User Email, Login Time, IP Address, Device, Status
- ✓ Sort by login time (newest first)
- ✓ Filter by user type (contractor, supplier, admin)
- ✓ "Force Logout" button per session
- ✓ Click "Force Logout" → user session terminated

**Component:** `UserSessionViewer.tsx`

---

### TC-ADM-005: Performance Stress Test
**Priority:** P2

**Test Steps:**
1. Navigate to AdminDashboard > "Testing" tab
2. Click "Launch Performance Test"
3. Select scenario: "BOQ Processing - 100 concurrent users"
4. Click "Start Test"
5. Wait for completion (2-5 minutes)
6. View results

**Expected Results:**
- ✓ Test runs successfully
- ✓ Simulates 100 concurrent BOQ processing requests
- ✓ Results displayed:
  - Average response time: < 3 seconds
  - Error rate: < 1%
  - Throughput: 30+ requests/second
- ✓ Charts: Response time over time, error rate, throughput
- ✓ Export results to PDF

**Component:** `PerformanceTestLauncher.tsx`, `PerformanceStressTest.tsx`

---

### TC-ADM-006: UI Automation Test Suite
**Priority:** P2

**Test Steps:**
1. Navigate to AdminDashboard > "Testing" > "UI Automation"
2. Click "Run All Tests"
3. Wait for completion

**Expected Results:**
- ✓ Test suite runs:
  - Login flow
  - Contractor signup flow
  - BOQ upload flow
  - Payment flow
  - Bill history navigation
- ✓ Results: X/Y tests passed
- ✓ Failed tests show screenshots
- ✓ Export test report (HTML or PDF)

**Component:** `UIAutomationLauncher.tsx`, `UIAutomationTester.tsx`

---

---

## SECURITY TESTS

### TC-SEC-001: SQL Injection - BOQ Item Description
**Priority:** P0

**Test Steps:**
1. Manual BOQ entry
2. Description field: Enter `'; DROP TABLE bills; --`
3. Quantity: 10
4. Unit: m³
5. Process bill

**Expected Results:**
- ✓ Input sanitized (Supabase parameterized queries)
- ✓ Bill processes normally
- ✓ `bills` table NOT dropped
- ✓ Description saved as literal string: `'; DROP TABLE bills; --`
- ✓ No SQL injection successful

**Security Check:** Supabase uses parameterized queries by default, but verify escaping is correct.

---

### TC-SEC-002: XSS - Contractor Company Name
**Priority:** P0

**Test Steps:**
1. Register contractor with company name: `<script>alert('XSS')</script>`
2. Complete registration
3. Log in as admin
4. View contractor list

**Expected Results:**
- ✓ Company name saved as-is in database
- ✓ When displayed in admin dashboard, script NOT executed
- ✓ HTML escaped: `&lt;script&gt;alert('XSS')&lt;/script&gt;`
- ✓ No alert shown
- ✓ React rendering automatically escapes HTML

**Security Check:** React escapes by default, but verify no `dangerouslySetInnerHTML` used incorrectly.

---

### TC-SEC-003: Authentication Bypass - Direct URL Access
**Priority:** P0

**Test Steps:**
1. Log out (clear sessionStorage)
2. Manually navigate to `/` and wait for redirect to MainDashboard
3. Attempt to access MainDashboard without authentication

**Expected Results:**
- ✓ User NOT authenticated (no access token)
- ✓ Redirected to login page
- ✓ Error message: "Please log in to continue"
- ✓ Cannot access dashboard without valid session

**Component:** `App.tsx` authentication check

---

### TC-SEC-004: Authorization - Non-Admin Accessing Admin Dashboard
**Priority:** P0

**Test Steps:**
1. Log in as contractor (not admin)
2. Attempt to navigate to AdminDashboard via direct URL manipulation or browser dev tools

**Expected Results:**
- ✓ Access denied
- ✓ Redirected to MainDashboard or login page
- ✓ Error message: "Unauthorized access"

**⚠️ CRITICAL:** Currently, admin access is controlled client-side via `sessionStorage.admin_logged_in`. This is INSECURE and must be replaced with server-side role verification (RLS policies or Edge Function checks).

---

### TC-SEC-005: Password Strength Enforcement
**Priority:** P0

**Test Data:**
- Weak passwords: "12345678", "password", "abcdefgh"

**Test Steps:**
1. Attempt to register with weak password: "12345678"

**Expected Results:**
- ✓ Error: "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
- ✓ Password strength indicator: "Weak"
- ✓ Registration blocked

**Test Steps:**
2. Use strong password: "SecurePass123!"

**Expected Results:**
- ✓ Password accepted
- ✓ Strength indicator: "Strong"
- ✓ Registration proceeds

**Component:** `ContractorSignup.tsx`, `SupplierSignup.tsx`, `AuthForm.tsx`

---

### TC-SEC-006: POPIA Consent - Audit Trail
**Priority:** P0

**Test Steps:**
1. Register new contractor
2. Check both POPIA consent boxes
3. Complete registration
4. Query database

**Expected Results:**
```sql
SELECT * FROM consent_audit_log WHERE user_email = '[test email]' ORDER BY created_at DESC;
```
- ✓ 2 records created:
  - `consent_type = 'privacy'`, `consent_given = true`, `policy_version = '1.0'`, `created_at = NOW()`
  - `consent_type = 'terms'`, `consent_given = true`, `policy_version = '1.0'`, `created_at = NOW()`
- ✓ Consent timestamp matches registration time
- ✓ Audit trail permanent (no deletion allowed)

**Component:** `AuthForm.tsx`  
**Database:** `consent_audit_log` table

---

### TC-SEC-007: Sensitive Data Encryption - Payment Details
**Priority:** P0

**Test Steps:**
1. Submit manual EFT payment with reference "QILLY-test123-1683456789"
2. Query database

**Expected Results:**
```sql
SELECT payment_reference, payment_method, payment_amount FROM contractors WHERE email = '[test email]';
```
- ✓ `payment_reference` stored as-is (not sensitive, but unique)
- ✓ No credit card numbers stored (if PayFast used, only transaction ID)
- ✓ Bank details NOT stored (only reference)
- ✓ Supabase connection uses SSL/TLS

**Security Check:** Ensure no PII or financial data stored in plain text unnecessarily.

---

### TC-SEC-008: Session Timeout
**Priority:** P1

**Test Steps:**
1. Log in as contractor
2. Leave browser idle for 30 minutes
3. Attempt to process a BOQ

**Expected Results:**
- ✓ Supabase session expired (default: 60 minutes)
- ✓ API call fails with 401 Unauthorized
- ✓ User redirected to login page
- ✓ Error message: "Session expired. Please log in again."

**Component:** Supabase auth session management

---

### TC-SEC-009: Rate Limiting - API Abuse Prevention
**Priority:** P1

**Test Steps:**
1. Use API to process 100 BOQs in 1 minute (via script)

**Expected Results:**
- ✓ Rate limit enforced (if implemented)
- ✓ After X requests, further requests return 429 Too Many Requests
- ✓ Error message: "Rate limit exceeded. Please try again later."
- ✓ Normal usage resumes after cooldown period

**⚠️ Note:** Rate limiting may not be implemented yet. Recommended to add via Vercel Edge Functions or Supabase Edge Functions.

---

### TC-SEC-010: Hardcoded Credentials Check
**Priority:** P0 (CRITICAL FOR PRODUCTION)

**Test Steps:**
1. Code review of all source files
2. Search for:
   - "admin@qilly.co.za" / "QillyAdmin2026!"
   - "partner@procore.com" / "Demo1234!"
   - "operator@test.com"
   - Any hardcoded API keys

**Expected Results:**
- ✓ NO hardcoded credentials in source code
- ✓ All credentials moved to environment variables
- ✓ Demo credentials ONLY in dev/staging environments (feature flags)

**⚠️ CRITICAL BLOCKER:** See `CRITICAL_SECURITY_FIXES_REQUIRED.md` for details. This MUST be fixed before production.

---

---

## PERFORMANCE TESTS

### TC-PERF-001: BOQ Processing - Small (10 items)
**Priority:** P1

**Test Steps:**
1. Upload 10-item BOQ
2. Click "Process Bill"
3. Measure processing time

**Expected Results:**
- ✓ Processing time: < 2 seconds
- ✓ API response status: 200 OK
- ✓ All items priced
- ✓ No errors

**Performance Metric:** Target: < 2 seconds for 10 items

---

### TC-PERF-002: BOQ Processing - Medium (50 items)
**Priority:** P1

**Test Steps:**
1. Upload 50-item BOQ
2. Process

**Expected Results:**
- ✓ Processing time: < 5 seconds
- ✓ All 50 items priced
- ✓ No timeout errors

**Performance Metric:** Target: < 5 seconds for 50 items

---

### TC-PERF-003: BOQ Processing - Large (200 items)
**Priority:** P1

**Test Steps:**
1. Upload 200-item BOQ
2. Process

**Expected Results:**
- ✓ Processing time: < 15 seconds
- ✓ All 200 items priced
- ✓ No memory issues
- ✓ No timeout (API timeout set to 30 seconds)

**Performance Metric:** Target: < 15 seconds for 200 items

**Note:** If processing time exceeds target, investigate:
- Database query optimization (indexes on `supplier_products` table)
- Pricing algorithm efficiency
- Batch processing for large BOQs

---

### TC-PERF-004: Concurrent Users - Load Test
**Priority:** P2

**Test Setup:**
- 50 simulated users
- Each user processes a 20-item BOQ

**Test Steps:**
1. Use PerformanceStressTest tool or external tool (k6, JMeter)
2. Simulate 50 concurrent users
3. Each user uploads and processes a BOQ
4. Measure response times and error rates

**Expected Results:**
- ✓ Average response time: < 5 seconds
- ✓ 95th percentile: < 8 seconds
- ✓ Error rate: < 2%
- ✓ No database connection pool exhaustion
- ✓ No server crashes

**Performance Metrics:**
- Throughput: 10+ requests/second
- Database connections: < 80% pool utilization

---

### TC-PERF-005: Database Query Performance - Bill History
**Priority:** P1

**Preconditions:**
- Contractor has 100+ bills in history

**Test Steps:**
1. Navigate to "History" tab
2. Measure page load time

**Expected Results:**
- ✓ Page loads in < 2 seconds
- ✓ Bills loaded from database (paginated: 50 per page)
- ✓ No full table scan

**Database Check:**
```sql
EXPLAIN ANALYZE SELECT * FROM bills WHERE contractor_id = '[id]' ORDER BY created_at DESC LIMIT 50;
-- Verify: Uses index on contractor_id and created_at
```

---

### TC-PERF-006: Excel Export - Large BOQ
**Priority:** P1

**Test Steps:**
1. Priced BOQ with 200 items
2. Click "Export to Excel"
3. Measure time to download

**Expected Results:**
- ✓ Export completes in < 3 seconds
- ✓ Excel file size: < 500 KB
- ✓ File opens correctly in Excel
- ✓ All 200 items present

---

### TC-PERF-007: PDF Export - Large BOQ
**Priority:** P1

**Test Steps:**
1. Priced BOQ with 200 items
2. Click "Export to PDF"
3. Measure time to generate

**Expected Results:**
- ✓ PDF generation: < 5 seconds
- ✓ PDF file size: < 2 MB
- ✓ PDF opens correctly
- ✓ All items formatted correctly

**Component:** Uses `jspdf` and `jspdf-autotable` libraries

---

---

## INTEGRATION TESTS

### TC-INT-001: Supabase Authentication Integration
**Priority:** P0

**Test Steps:**
1. Sign up new user via AuthForm
2. Verify user created in Supabase Auth

**Expected Results:**
- ✓ API call to `supabase.auth.signUp()` successful
- ✓ User record created in Supabase Auth (auth.users table)
- ✓ User email sent for verification (if email confirmation enabled)
- ✓ User can log in with credentials

**Integration:** Supabase Auth API

---

### TC-INT-002: Supabase Database - Insert Contractor
**Priority:** P0

**Test Steps:**
1. Complete contractor registration
2. Query Supabase database

**Expected Results:**
```sql
SELECT * FROM contractors WHERE email = '[test email]';
```
- ✓ Record exists
- ✓ All fields populated correctly
- ✓ Foreign key to auth.users via user_id (if configured)

**Integration:** Supabase PostgreSQL database

---

### TC-INT-003: Supabase RLS Policies - Contractor Data Access
**Priority:** P0

**Preconditions:**
- RLS enabled on `contractors` table
- Policy: Contractors can only read their own record

**Test Steps:**
1. Log in as Contractor A
2. Attempt to query all contractors

**Expected Results:**
```javascript
const { data, error } = await supabase.from('contractors').select('*');
```
- ✓ Returns ONLY Contractor A's record
- ✓ Other contractors' records NOT visible
- ✓ RLS policy enforced

**⚠️ CRITICAL:** RLS policies MUST be implemented before production! Currently missing.

---

### TC-INT-004: Stitch Payment Integration - Success Flow
**Priority:** P0

**Test Steps:**
1. Select Stitch payment
2. Authenticate with test bank
3. Authorize debit
4. Return to Qilly

**Expected Results:**
- ✓ Redirect to Stitch URL
- ✓ Bank authentication successful
- ✓ Debit authorized
- ✓ Callback to Qilly with success payload
- ✓ Payment marked as approved
- ✓ Contractor account activated

**Integration:** Stitch API (https://stitch.money)

---

### TC-INT-005: PayFast Payment Integration - Success Flow
**Priority:** P0

**Test Steps:**
1. Select PayFast payment
2. Enter test credit card
3. Complete payment

**Expected Results:**
- ✓ Redirect to PayFast payment page
- ✓ Card charged successfully
- ✓ Return URL callback to Qilly
- ✓ Payment verified via PayFast API
- ✓ Contractor account activated

**Integration:** PayFast API (https://www.payfast.co.za)

---

### TC-INT-006: Email Notifications - SMTP Integration
**Priority:** P1

**Test Steps:**
1. Register new contractor
2. Check email inbox

**Expected Results:**
- ✓ Email received: "Welcome to Qilly"
- ✓ Contains: Payment instructions, login link, support contact
- ✓ Email sent from: noreply@qilly.co.za (or configured domain)
- ✓ Email deliverability: No spam folder

**Integration:** Email service (SendGrid, AWS SES, or Supabase Auth emails)

---

### TC-INT-007: eTender API Integration (if applicable)
**Priority:** P2

**Test Steps:**
1. Generate eTender response
2. Submit to eTender portal (if API exists)

**Expected Results:**
- ✓ Document formatted correctly
- ✓ API call successful (if integration implemented)
- ✓ Response saved to eTender system

**Note:** eTender integration may be document generation only (no API), in which case this is a manual upload test.

---

---

## USER ACCEPTANCE TESTS (UAT)

### UAT-001: Contractor End-to-End - From Signup to Priced BOQ
**User Persona:** John Doe, GB6 contractor, 5 years experience, Gauteng-based

**Scenario:**
John wants to price a residential building project for a client in Johannesburg.

**Test Steps:**
1. **Signup:**
   - John navigates to qilly.co.za
   - Clicks "Sign Up" > "Contractor Signup"
   - Fills in company details (CIDB GB6, Gauteng, Residential projects)
   - Selects PROFESSIONAL tier
   - Chooses Stitch payment
   - Completes payment (R2,999)
   - Receives email confirmation

2. **Login:**
   - John logs in with email/password
   - Lands on MainDashboard

3. **Upload BOQ:**
   - Clicks "Upload" tab
   - Uploads Excel file: "Residential_2Storey_BuildAid.xlsx" (35 items)
   - Previews items
   - Confirms

4. **Set Project Settings:**
   - Province: Gauteng
   - Municipality: City of Johannesburg
   - Profit Margin: 12%
   - Duration: 4 months
   - Machinery: Standard

5. **Process:**
   - Clicks "Process Bill"
   - Waits 3-5 seconds
   - Views priced bill

6. **Review Results:**
   - Reviews line items with pricing
   - Checks total: R1,245,000 (ex VAT)
   - Compares suppliers for item #12 (cement)
   - Selects alternative supplier with better price

7. **Export:**
   - Exports to Excel
   - Downloads PDF for client presentation
   - Saves bill to history

8. **Follow-up:**
   - Next week, John returns
   - Navigates to "History"
   - Re-downloads PDF for client meeting

**Expected Outcome:**
- ✓ John successfully registered and paid
- ✓ BOQ processed accurately
- ✓ Supplier comparison worked
- ✓ Exports generated correctly
- ✓ Bill saved for future reference
- ✓ Overall experience: Smooth, fast, professional

**Success Criteria:**
- Total time from signup to priced BOQ: < 15 minutes
- No errors encountered
- User satisfaction: 9/10 or higher

---

### UAT-002: Supplier End-to-End - From Signup to Product Listing
**User Persona:** Jane Smith, Building Materials Supplier, 10 years in business, Gauteng

**Scenario:**
Jane wants to list her products on Qilly so contractors can see her pricing.

**Test Steps:**
1. **Signup:**
   - Jane clicks "Supplier Signup"
   - Fills in company details (registration #, VAT, BBBEE Level 2)
   - Selects product categories: Building Materials, Steel
   - Selects PROFESSIONAL tier (50 products)
   - Completes payment (Stitch)

2. **Approval Wait:**
   - Jane receives email: "Account pending approval"
   - Admin approves within 24 hours
   - Jane receives email: "Account approved"

3. **Login & Add Products:**
   - Jane logs in
   - Navigates to Products (SupplierAPIManager or equivalent)
   - Adds 10 products:
     - Cement 42.5N - 50kg bag: R125/bag
     - Brick - Clay stock: R2.50/each
     - Sand - Building (1 ton bag): R450/bag
     - ... (7 more products)

4. **Update Pricing:**
   - Next month, cement price increases
   - Jane edits "Cement 42.5N" to R132/bag
   - Saves

5. **Contractor Uses Jane's Products:**
   - Contractor processes BOQ
   - Jane's cement product matched to BOQ item
   - Jane's price (R132) appears in priced bill

**Expected Outcome:**
- ✓ Jane registered and approved
- ✓ Products listed successfully
- ✓ Pricing updates reflected immediately
- ✓ Contractors can see Jane's products in BOQ results
- ✓ Jane gains visibility in contractor network

**Success Criteria:**
- Signup to first product listed: < 1 hour (including admin approval)
- Pricing update reflected in < 1 minute
- User satisfaction: 8/10 or higher

---

### UAT-003: Admin End-to-End - Managing Platform
**User Persona:** Sarah, Qilly platform administrator

**Scenario:**
Sarah manages daily operations: approving contractors and suppliers, verifying payments, monitoring platform health.

**Test Steps:**
1. **Morning Review:**
   - Sarah logs in to AdminDashboard
   - Reviews stats:
     - 3 pending contractors
     - 2 pending suppliers
     - 5 manual EFT payments to verify
     - 87 BOQs processed yesterday

2. **Approve Contractors:**
   - Opens "Contractors" tab
   - Filters "Pending"
   - Reviews CIDB registrations
   - Approves 2 contractors, rejects 1 (invalid CIDB)

3. **Verify Payments:**
   - Opens "Payments" tab
   - Checks bank statement
   - Verifies payment reference matches
   - Clicks "Verify & Approve EFT" for 5 payments

4. **Approve Suppliers:**
   - Opens "Suppliers" tab
   - Reviews BBBEE certificates
   - Approves 2 suppliers

5. **Database Check:**
   - Opens "Database" tab
   - Inspects `bills` table to verify yesterday's activity
   - Exports contractors list to CSV for reporting

6. **End of Day:**
   - Reviews platform metrics
   - All approvals complete
   - Logs out

**Expected Outcome:**
- ✓ Sarah efficiently manages approvals and verifications
- ✓ All pending items processed
- ✓ Platform running smoothly
- ✓ No backlogs

**Success Criteria:**
- Daily admin tasks completed in < 1 hour
- No errors during approvals
- User satisfaction: 9/10 or higher

---

---

## TEST SUMMARY & COVERAGE

### Test Coverage by Epic

| Epic | Unit Tests | Integration Tests | Functional Tests | Security Tests | UAT | Total |
|------|------------|-------------------|------------------|----------------|-----|-------|
| 1. Onboarding & Auth | 0 | 3 (TC-INT-001 to 003) | 12 (TC-AUTH-001 to 012) | 6 (TC-SEC-001 to 006) | 2 (UAT-001, 002) | 23 |
| 2. BOQ Processing | 0 | 0 | 12 (TC-BOQ-001 to 012) | 1 (TC-SEC-001) | 1 (UAT-001) | 14 |
| 3. Supplier Management | 0 | 1 (TC-INT-002) | 9 (TC-SUP-001 to 009) | 0 | 1 (UAT-002) | 11 |
| 4. Payment & Subscriptions | 0 | 2 (TC-INT-004, 005) | 8 (TC-PAY-001 to 008) | 1 (TC-SEC-007) | 0 | 11 |
| 5. Compliance | 0 | 1 (TC-INT-007) | 6 (TC-COMP-001 to 006) | 0 | 0 | 7 |
| 6. Analytics & Reporting | 0 | 0 | 0 | 0 | 0 | 0 |
| 7. Team & Collaboration | 0 | 0 | 0 | 0 | 0 | 0 |
| 8. Partner Integration | 0 | 0 | 0 | 0 | 0 | 0 |
| 9. Admin & Platform | 0 | 0 | 6 (TC-ADM-001 to 006) | 1 (TC-SEC-004) | 1 (UAT-003) | 8 |
| 10. Green Building | 0 | 0 | 3 (included in TC-COMP) | 0 | 0 | 3 |
| **Performance** | 0 | 0 | 7 (TC-PERF-001 to 007) | 0 | 0 | 7 |
| **TOTAL** | **0** | **7** | **56** | **9** | **4** | **76** |

### Test Execution Status

| Environment | Tests Executed | Tests Passed | Tests Failed | Pass Rate | Last Run |
|-------------|----------------|--------------|--------------|-----------|----------|
| Development | 0 | 0 | 0 | 0% | Not run |
| SIT | 0 | 0 | 0 | 0% | Not run |
| UAT | 0 | 0 | 0 | 0% | Not run |
| Production | 0 | 0 | 0 | 0% | N/A |

**⚠️ NOTE:** All tests documented but NOT YET EXECUTED. Test execution should begin immediately after critical security fixes are completed.

---

## TEST EXECUTION RECOMMENDATIONS

### Phase 1: Critical Path Testing (Before Production)
**Priority:** P0  
**Duration:** 2-3 days

Execute these tests FIRST (must pass before launch):
- ✅ TC-AUTH-001, 006, 007, 008 (Authentication)
- ✅ TC-BOQ-001, 002 (BOQ Processing)
- ✅ TC-PAY-001, 002, 003, 004 (Payment)
- ✅ TC-SEC-001 to TC-SEC-010 (ALL Security Tests)
- ✅ UAT-001, UAT-002 (End-to-end user flows)

### Phase 2: Feature Completeness Testing
**Priority:** P1  
**Duration:** 3-5 days

After Phase 1 passes:
- ✅ All BOQ tests (TC-BOQ-003 to 012)
- ✅ Supplier management tests (TC-SUP-001 to 009)
- ✅ Compliance tests (TC-COMP-001 to 006)
- ✅ Admin tests (TC-ADM-001 to 006)
- ✅ Performance tests (TC-PERF-001 to 007)

### Phase 3: Integration & Advanced Features
**Priority:** P2  
**Duration:** 2-3 days

After Phase 2 passes:
- ✅ All integration tests (TC-INT-001 to 007)
- ✅ Partner integration tests (when implemented)
- ✅ Team management tests (when implemented)
- ✅ Advanced analytics tests (when implemented)

### Phase 4: Regression Testing (Ongoing)
**Frequency:** Before each deployment

Re-run critical path tests (Phase 1) before every production deployment to ensure no regressions.

---

## AUTOMATED TESTING RECOMMENDATIONS

### Immediate Actions (Post-Security-Fix)
1. **Set up unit testing framework** (Jest + React Testing Library)
2. **Write unit tests for:**
   - Pricing engine logic (`utils/pricingEngine.ts`)
   - Tier access control (`utils/tierAccess.ts`)
   - Regional pricing calculations (`utils/regionalOptimization.ts`)
3. **Set up E2E testing** (Playwright or Cypress)
4. **Automate critical paths:**
   - Contractor signup → login → BOQ upload → pricing
   - Admin login → contractor approval
   - Payment flows

### Long-term Test Automation Strategy
1. **Unit Tests:** 80% code coverage target
2. **Integration Tests:** All API endpoints covered
3. **E2E Tests:** 10+ critical user journeys automated
4. **Performance Tests:** Automated load testing in CI/CD
5. **Security Tests:** OWASP ZAP or similar in CI/CD

---

## TEST DATA MANAGEMENT

### Test Data Sets Required
1. **Contractors:**
   - 10 contractors across all CIDB grades (GB1-9, CE, EB, ME)
   - 3 contractors per tier (FREE, PROF, ENT, CUSTOM)
   - Mix of provinces

2. **Suppliers:**
   - 20 suppliers across all product categories
   - Mix of tiers and provinces
   - Test supplier products in `supplier_products` table

3. **BOQs:**
   - Small: 10 items (residential)
   - Medium: 50 items (commercial)
   - Large: 200+ items (infrastructure)
   - Steel BOQ: 30 items (structural project)

4. **Payments:**
   - Manual EFT (pending, verified, rejected)
   - Stitch (success, failure)
   - PayFast (success, declined)

### Test Data Reset
Before each test cycle (SIT, UAT):
1. Clear test data from previous runs
2. Re-seed with fresh test data
3. Verify foreign key constraints
4. Reset auto-increment IDs (optional)

---

## BUG TRACKING & REPORTING

### Bug Severity Levels
- **CRITICAL (P0):** Blocks production deployment (e.g., security vulnerabilities, data loss)
- **HIGH (P1):** Major feature broken, workaround exists (e.g., payment processing fails intermittently)
- **MEDIUM (P2):** Minor feature broken, does not block usage (e.g., export button styling)
- **LOW (P3):** Cosmetic issue, enhancement (e.g., typo in help text)

### Bug Report Template
```
**Bug ID:** BUG-XXX
**Test Case:** TC-XXX-XXX
**Severity:** CRITICAL / HIGH / MEDIUM / LOW
**Environment:** Development / SIT / UAT / Production
**User Role:** Contractor / Supplier / Admin / Partner

**Summary:** [One-line description]

**Steps to Reproduce:**
1. ...
2. ...
3. ...

**Expected Result:** ...

**Actual Result:** ...

**Screenshot/Video:** [Attach if applicable]

**Database State:** [SQL query result if relevant]

**Console Errors:** [Browser console errors]

**Workaround:** [If any]

**Priority:** [P0, P1, P2, P3]

**Assigned To:** [Developer name]

**Status:** Open / In Progress / Fixed / Verified / Closed
```

---

## SIGN-OFF CRITERIA

### SIT Sign-Off (System Integration Testing)
- ✅ All P0 tests passed
- ✅ All P1 tests passed
- ✅ 0 CRITICAL or HIGH bugs open
- ✅ Performance metrics met (response time < 5s for medium BOQ)
- ✅ Integration tests passed (Supabase, Stitch, PayFast)

### UAT Sign-Off (User Acceptance Testing)
- ✅ All UAT scenarios passed
- ✅ User satisfaction > 8/10
- ✅ Business stakeholders approve
- ✅ 0 CRITICAL bugs
- ✅ HIGH bugs addressed or documented as known issues

### Production Go-Live Sign-Off
- ✅ All security tests passed
- ✅ ALL critical security fixes implemented (see CRITICAL_SECURITY_FIXES_REQUIRED.md)
- ✅ RLS policies implemented and tested
- ✅ Performance stress tests passed
- ✅ Disaster recovery plan in place
- ✅ Monitoring and alerting configured
- ✅ Support team trained
- ✅ Rollback plan documented

**Sign-Off Approvers:**
- [ ] QA Lead
- [ ] Security Lead
- [ ] Product Owner
- [ ] CTO / Technical Lead
- [ ] CEO / Business Owner

---

## APPENDIX: TEST ENVIRONMENT SETUP

### Development Environment
- Local Vite dev server
- Local Supabase instance (or shared dev Supabase)
- Test payment methods (Stitch/PayFast sandbox)
- Feature flags: All features enabled
- Demo mode: Enabled

### SIT Environment
- Deployed to Vercel (staging domain)
- Dedicated Supabase project (SIT)
- Test payment methods (sandbox)
- Feature flags: Production-like
- Demo mode: Disabled

### UAT Environment
- Deployed to Vercel (uat.qilly.co.za)
- Production Supabase project (with test data)
- Real payment methods (small amounts)
- Feature flags: Production
- Demo mode: Disabled

### Production Environment
- Deployed to Vercel (assuretechsolutions.co.za or qilly.co.za)
- Production Supabase project
- Real payment methods
- Feature flags: Production
- Demo mode: Disabled
- Monitoring: Sentry, Vercel Analytics

---

**Document Version:** 1.0  
**Last Updated:** May 6, 2026  
**Maintained By:** Qilly QA Team  
**Next Review:** After security fixes and Phase 1 test execution

---

*For questions or test execution support: qa@qilly.co.za*
