# Qilly Testing Guide & Test Cases
## Comprehensive Testing Specification for QA Team

**Document Version:** 1.0  
**Date:** March 2, 2026  
**Purpose:** Complete testing guide with test cases, scenarios, and acceptance criteria  
**Audience:** QA Testers, Product Team, Development Team

---

## 📋 Table of Contents

1. [Testing Overview](#testing-overview)
2. [Test Environments](#test-environments)
3. [Testing Types](#testing-types)
4. [Test Case Format](#test-case-format)
5. [Test Execution Guidelines](#test-execution-guidelines)
6. [Module 1: Authentication & Authorization](#module-1-authentication--authorization)
7. [Module 2: BOQ Upload & Processing](#module-2-boq-upload--processing)
8. [Module 3: Pricing Engine](#module-3-pricing-engine)
9. [Module 4: Regional Optimization](#module-4-regional-optimization)
10. [Module 5: Compliance Checking](#module-5-compliance-checking)
11. [Module 6: Supplier Management](#module-6-supplier-management)
12. [Module 7: Contractor Management](#module-7-contractor-management)
13. [Module 8: Admin Dashboard](#module-8-admin-dashboard)
14. [Module 9: Export & Reporting](#module-9-export--reporting)
15. [Module 10: Payment Integration](#module-10-payment-integration)
16. [Module 11: Multi-Environment](#module-11-multi-environment)
17. [Cross-Browser Testing](#cross-browser-testing)
18. [Performance Testing](#performance-testing)
19. [Security Testing](#security-testing)
20. [Bug Reporting Template](#bug-reporting-template)
21. [Test Metrics & KPIs](#test-metrics--kpis)

---

## Testing Overview

### Testing Objectives

1. **Functional Correctness:** All features work as specified
2. **Data Accuracy:** BOQ pricing calculations are 100% accurate
3. **User Experience:** Smooth, intuitive workflows
4. **Security:** No unauthorized access or data leaks
5. **Performance:** Fast response times (<3 seconds for pricing)
6. **Cross-Browser Compatibility:** Works on Chrome, Firefox, Safari, Edge
7. **Regulatory Compliance:** POPIA, SANS 1200, NHBRC standards met

---

### Testing Pyramid

```
                    /\
                   /  \  E2E Tests (10%)
                  /____\  
                 /      \  
                /________\ Integration Tests (30%)
               /          \
              /____________\ Unit Tests (60%)
```

**Distribution:**
- **Unit Tests:** 60% (developer-run, automated)
- **Integration Tests:** 30% (QA + developer, automated)
- **E2E Tests:** 10% (QA manual + automated, critical paths)

---

## Test Environments

### Environment Matrix

| Environment | URL | Database | Purpose | Tester Access |
|-------------|-----|----------|---------|---------------|
| **DEV** | http://localhost:5173 | Supabase DEV | Development, unit testing | Developers only |
| **SIT** | https://qilly-sit.vercel.app | Supabase SIT | System Integration Testing | QA Team |
| **UAT** | https://qilly-uat.vercel.app | Supabase UAT | User Acceptance Testing | QA + Pilot Users |
| **PREPROD** | https://qilly-preprod.vercel.app | Supabase PREPROD | Pre-production validation | QA Lead + Product Owner |
| **PROD** | https://qilly.co.za | Supabase PROD | Live production | End Users (No testing!) |

### Environment Rules

1. ✅ **Always test in SIT first**
2. ✅ **UAT for client/stakeholder demos**
3. ✅ **PREPROD for final validation before release**
4. ❌ **NEVER test with real data in SIT/UAT**
5. ❌ **NEVER run destructive tests in PROD**

---

## Testing Types

### 1. Functional Testing
**Purpose:** Verify features work per specifications  
**When:** Every sprint, after new feature development  
**Tools:** Manual testing, Playwright (automated)

### 2. Regression Testing
**Purpose:** Ensure existing features still work after changes  
**When:** Before every deployment  
**Tools:** Automated test suite (Playwright, Jest)

### 3. Integration Testing
**Purpose:** Verify modules work together correctly  
**When:** After API changes, database updates  
**Tools:** Postman (API), Playwright (UI + backend)

### 4. User Acceptance Testing (UAT)
**Purpose:** Validate with real users (government, contractors)  
**When:** End of sprint, before production release  
**Tools:** UAT environment, user feedback forms

### 5. Performance Testing
**Purpose:** Ensure fast response times and scalability  
**When:** Before major releases  
**Tools:** Lighthouse, JMeter, k6

### 6. Security Testing
**Purpose:** Identify vulnerabilities  
**When:** Quarterly, before PROD releases  
**Tools:** OWASP ZAP, Burp Suite, manual penetration testing

### 7. Usability Testing
**Purpose:** Ensure intuitive UX  
**When:** Before major UI changes  
**Tools:** User observation, heatmaps (Hotjar)

---

## Test Case Format

### Template

```
TEST CASE ID: TC-[Module]-[Feature]-[Number]
TITLE: [Clear, action-oriented title]
MODULE: [Authentication | BOQ Upload | Pricing | etc.]
PRIORITY: [Critical | High | Medium | Low]
TYPE: [Functional | Integration | Regression | Performance | Security]

PRECONDITIONS:
- [List all setup requirements]
- [User state, data needed, etc.]

TEST STEPS:
1. [Action 1]
2. [Action 2]
3. [Action 3]

EXPECTED RESULTS:
- [What should happen after each step]
- [Final expected outcome]

TEST DATA:
- [Specific data to use]
- [File names, user credentials, etc.]

POSTCONDITIONS:
- [Cleanup required]
- [State after test]

NOTES:
- [Any special considerations]
- [Known issues to ignore]
```

### Example Test Case

```
TEST CASE ID: TC-AUTH-LOGIN-001
TITLE: Government User Login with Valid Credentials
MODULE: Authentication
PRIORITY: Critical
TYPE: Functional

PRECONDITIONS:
- User registered with email: test@dhs.gov.za
- Password: Test@123
- User email verified
- SIT environment active

TEST STEPS:
1. Navigate to https://qilly-sit.vercel.app
2. Click "Login" button
3. Enter email: test@dhs.gov.za
4. Enter password: Test@123
5. Click "Sign In" button

EXPECTED RESULTS:
- Step 1: Landing page loads, "Login" button visible
- Step 2: Login form appears
- Step 3: Email field accepts input
- Step 4: Password field masks input
- Step 5: User redirected to Main Dashboard within 2 seconds
- Dashboard shows user name in top-right corner
- Success toast message: "Successfully logged in!"

TEST DATA:
Email: test@dhs.gov.za
Password: Test@123

POSTCONDITIONS:
- User session active (sessionStorage has accessToken)
- User can navigate dashboard

NOTES:
- If login fails, check Supabase SIT database for user existence
- Clear browser cache if issues persist
```

---

## Module 1: Authentication & Authorization

### Test Suite: AUTH-001 - Government User Registration

#### TC-AUTH-REG-001: Register with Valid Government Email
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- SIT environment
- Email not previously registered

**Test Steps:**
1. Navigate to Qilly SIT
2. Click "Sign Up" button
3. Fill form:
   - Full Name: John Doe
   - Email: john.doe@dhs.gov.za
   - Department: Department of Human Settlements
   - Password: SecurePass@123
   - Confirm Password: SecurePass@123
4. Check "I accept Terms & Conditions"
5. Click "Register"

**Expected Results:**
- Form validates all fields
- Success message: "Registration successful! Check your email to verify."
- Redirected to "Check Email" page
- Verification email sent to john.doe@dhs.gov.za
- User record created in Supabase `auth.users` table

**Test Data:**
```
Name: John Doe
Email: john.doe@dhs.gov.za
Department: Department of Human Settlements
Password: SecurePass@123
```

---

#### TC-AUTH-REG-002: Register with Invalid Email (Not .gov.za)
**Priority:** High  
**Type:** Negative Testing

**Preconditions:**
- SIT environment

**Test Steps:**
1. Navigate to Qilly SIT
2. Click "Sign Up"
3. Enter email: john.doe@gmail.com
4. Fill remaining fields
5. Click "Register"

**Expected Results:**
- Error message: "Please use a valid government email (.gov.za)"
- Registration blocked
- Form not submitted

---

#### TC-AUTH-REG-003: Register with Weak Password
**Priority:** Medium  
**Type:** Validation Testing

**Test Steps:**
1. Navigate to Qilly SIT
2. Click "Sign Up"
3. Enter password: "12345"
4. Observe password strength indicator

**Expected Results:**
- Strength indicator shows "Weak" (red)
- Tooltip shows requirements: "Min 8 chars, 1 uppercase, 1 number"
- "Register" button disabled until password meets criteria

---

### Test Suite: AUTH-002 - Government User Login

#### TC-AUTH-LOGIN-001: Login with Valid Credentials
(See example above)

---

#### TC-AUTH-LOGIN-002: Login with Invalid Password
**Priority:** High  
**Type:** Negative Testing

**Preconditions:**
- User exists: test@dhs.gov.za

**Test Steps:**
1. Navigate to Qilly SIT
2. Click "Login"
3. Enter email: test@dhs.gov.za
4. Enter password: WrongPassword123
5. Click "Sign In"

**Expected Results:**
- Error message: "Invalid email or password"
- User remains on login page
- No dashboard access
- No session token created

---

#### TC-AUTH-LOGIN-003: Session Persistence
**Priority:** High  
**Type:** Integration Testing

**Test Steps:**
1. Login with valid credentials
2. Close browser tab
3. Reopen Qilly SIT in new tab
4. Observe dashboard

**Expected Results:**
- User automatically logged in (session persists)
- Dashboard loads without login prompt
- Session expires after 24 hours

---

### Test Suite: AUTH-003 - Password Reset

#### TC-AUTH-RESET-001: Reset Password Flow
**Priority:** High  
**Type:** Functional

**Test Steps:**
1. Click "Forgot Password" on login page
2. Enter email: test@dhs.gov.za
3. Click "Send Reset Link"
4. Check email inbox
5. Click reset link in email
6. Enter new password: NewPass@456
7. Confirm new password
8. Click "Reset Password"
9. Return to login page
10. Login with new password

**Expected Results:**
- Step 3: Success message "Reset link sent to your email"
- Step 4: Email received within 1 minute
- Step 5: Redirected to password reset page
- Step 8: Success message "Password updated successfully"
- Step 10: Login succeeds with new password

---

### Test Suite: AUTH-004 - Contractor Registration

#### TC-AUTH-CONT-001: Contractor Registration with All Required Fields
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- Valid CIDB certificate (PDF)
- Valid Tax Clearance certificate (PDF)

**Test Steps:**
1. Click "Contractor Signup"
2. Fill form:
   - Company Name: ABC Contractors (Pty) Ltd
   - CIDB Number: CIDB1234567/A
   - CIDB Grade: 5GB
   - Contact Person: Jane Smith
   - Email: jane@abccontractors.co.za
   - Phone: 0821234567
   - Address: 123 Main Road, Johannesburg
   - Provinces: Select Gauteng, Western Cape
   - Annual Turnover: R50,000,000
   - BBBEE Level: Level 2
3. Upload Tax Clearance (PDF, 2MB)
4. Upload CIDB Certificate (PDF, 1.5MB)
5. Accept Terms
6. Click "Submit Application"

**Expected Results:**
- All fields validate correctly
- File uploads succeed
- Success message: "Application submitted. Admin will review within 24 hours."
- Record created in `contractors` table with status="pending"
- Admin receives email notification

**Test Data:**
```
Company: ABC Contractors (Pty) Ltd
CIDB: CIDB1234567/A
Grade: 5GB
Email: jane@abccontractors.co.za
Files: tax_clearance.pdf, cidb_cert.pdf (in test_data folder)
```

---

#### TC-AUTH-CONT-002: Contractor Registration - Missing CIDB Certificate
**Priority:** High  
**Type:** Negative Testing

**Test Steps:**
1. Fill contractor signup form
2. Skip CIDB certificate upload
3. Click "Submit Application"

**Expected Results:**
- Error message: "CIDB Certificate is required"
- Form submission blocked
- File upload field highlighted in red

---

### Test Suite: AUTH-005 - Contractor Approval Workflow

#### TC-AUTH-CONT-003: Admin Approves Contractor
**Priority:** Critical  
**Type:** Integration Testing

**Preconditions:**
- Admin logged in
- Contractor application pending (from TC-AUTH-CONT-001)

**Test Steps:**
1. Admin navigates to "Contractors" tab
2. Pending contractors list shows ABC Contractors
3. Click "View Details"
4. Review application details
5. Download and verify Tax Clearance
6. Download and verify CIDB Certificate
7. Click "Approve" button
8. Confirm approval
9. Logout as admin
10. Login as contractor (jane@abccontractors.co.za)

**Expected Results:**
- Step 2: Orange badge shows "Pending"
- Step 3: Modal displays all contractor details
- Step 5-6: Files downloadable and viewable
- Step 8: Status updated to "approved"
- Step 8: Email sent to contractor: "Your application has been approved"
- Step 10: Contractor can access dashboard and template library

---

#### TC-AUTH-CONT-004: Admin Rejects Contractor
**Priority:** High  
**Type:** Integration Testing

**Test Steps:**
1. Admin views pending contractor
2. Click "Reject"
3. Enter reason: "Invalid CIDB certificate"
4. Confirm rejection
5. Contractor receives email
6. Contractor attempts to login

**Expected Results:**
- Step 4: Status updated to "rejected"
- Step 5: Email contains rejection reason
- Step 6: Login fails with message "Your application was rejected. Reason: Invalid CIDB certificate"

---

## Module 2: BOQ Upload & Processing

### Test Suite: BOQ-001 - Excel Upload

#### TC-BOQ-UPLOAD-001: Upload Valid Excel BOQ
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- User logged in
- Sample BOQ file: `test_data/sample_boq_rdp_100units.xlsx`

**Test Steps:**
1. Navigate to Main Dashboard
2. Drag and drop `sample_boq_rdp_100units.xlsx` into upload area
3. Observe file processing
4. Review preview table

**Expected Results:**
- Step 2: File name displays "sample_boq_rdp_100units.xlsx"
- Step 2: File size shows (e.g., "2.3 MB")
- Step 3: Loading spinner appears for <2 seconds
- Step 4: Preview table shows first 10 rows
- Step 4: Columns auto-detected: Item No, Description, Unit, Quantity
- Step 4: "Continue to Pricing" button enabled

**Test Data:**
File: `test_data/sample_boq_rdp_100units.xlsx`
Rows: 150 items
Columns: Item No | Description | Unit | Quantity

---

#### TC-BOQ-UPLOAD-002: Upload Invalid File Type
**Priority:** High  
**Type:** Negative Testing

**Test Steps:**
1. Drag and drop `test_data/image.png` into upload area

**Expected Results:**
- Error message: "Invalid file type. Please upload .xlsx, .xls, or .csv"
- File rejected
- Upload area remains empty

---

#### TC-BOQ-UPLOAD-003: Upload Oversized File (>10MB)
**Priority:** Medium  
**Type:** Boundary Testing

**Test Steps:**
1. Drag and drop `test_data/large_boq_15mb.xlsx` into upload area

**Expected Results:**
- Error message: "File too large. Maximum size is 10MB."
- File rejected

---

### Test Suite: BOQ-002 - Column Detection

#### TC-BOQ-PARSE-001: Auto-Detect Standard Columns
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- BOQ file with headers: "Item No", "Description", "Unit", "Qty"

**Test Steps:**
1. Upload BOQ file
2. System parses and displays preview

**Expected Results:**
- System correctly maps:
  - "Item No" → Item Number column
  - "Description" → Description column
  - "Unit" → Unit column
  - "Qty" → Quantity column (recognizes "Qty" as "Quantity")
- Preview table shows correct data alignment

---

#### TC-BOQ-PARSE-002: Handle Variations in Column Names
**Priority:** High  
**Type:** Functional

**Test Steps:**
1. Upload BOQ with headers: "Item Number", "Descr", "UOM", "Quantity"

**Expected Results:**
- System intelligently maps:
  - "Item Number" → Item No
  - "Descr" → Description
  - "UOM" → Unit
  - "Quantity" → Quantity
- All data correctly parsed

---

#### TC-BOQ-PARSE-003: Missing Required Column (Description)
**Priority:** High  
**Type:** Negative Testing

**Test Steps:**
1. Upload BOQ file missing "Description" column

**Expected Results:**
- Error message: "Required column 'Description' not found. Please check your file."
- Upload process halted
- User can cancel and re-upload correct file

---

### Test Suite: BOQ-003 - Data Validation

#### TC-BOQ-VALID-001: Validate Numeric Quantities
**Priority:** Critical  
**Type:** Validation Testing

**Preconditions:**
- BOQ with row containing Quantity = "ABC" (text instead of number)

**Test Steps:**
1. Upload BOQ file
2. System validates data

**Expected Results:**
- Error summary: "1 row has invalid data"
- Row highlighted in preview table (red border)
- Tooltip shows: "Quantity must be a number"
- User can choose "Skip Invalid Rows" or "Cancel"

---

#### TC-BOQ-VALID-002: Validate Positive Quantities
**Priority:** High  
**Type:** Boundary Testing

**Test Steps:**
1. Upload BOQ with Quantity = -10

**Expected Results:**
- Error: "Quantity must be greater than 0"
- Row flagged as invalid

---

#### TC-BOQ-VALID-003: Validate Unit Recognition
**Priority:** Medium  
**Type:** Validation Testing

**Test Steps:**
1. Upload BOQ with unrecognized unit: "xyz"

**Expected Results:**
- Warning: "Unrecognized unit 'xyz'. Please verify."
- Row flagged for review (yellow highlight)
- User can manually map unit or skip

---

## Module 3: Pricing Engine

### Test Suite: PRICE-001 - Product Matching

#### TC-PRICE-MATCH-001: Match Exact Description
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- Supplier database has product: "Common Brick 222x106x73mm"
- BOQ item: "Common Brick 222x106x73mm"

**Test Steps:**
1. Upload BOQ with exact match item
2. Click "Price BOQ"
3. Review matched products

**Expected Results:**
- System finds exact match
- Confidence score: 100%
- Product auto-selected
- No manual intervention needed

---

#### TC-PRICE-MATCH-002: Fuzzy Match with Synonyms
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- BOQ item: "Clay brickwork 220mm"
- Supplier product: "Common Clay Brick 222mm"

**Test Steps:**
1. Upload BOQ
2. System performs fuzzy matching

**Expected Results:**
- System recognizes "brickwork" = "brick"
- System matches "220mm" ≈ "222mm" (close enough)
- Confidence score: 85%
- Product auto-selected
- User can override if needed

---

#### TC-PRICE-MATCH-003: Brand Detection
**Priority:** High  
**Type:** Functional

**Preconditions:**
- BOQ item: "Sika waterproofing compound 20L"
- Suppliers: Sika (brand), BuildIt (generic)

**Test Steps:**
1. Upload BOQ
2. System detects brand

**Expected Results:**
- System identifies "Sika" as brand keyword
- System filters products to Sika supplier only
- Correct Sika product matched
- Competitor products excluded

---

#### TC-PRICE-MATCH-004: No Match Found
**Priority:** Medium  
**Type:** Edge Case Testing

**Preconditions:**
- BOQ item: "Custom imported specialty widget"
- No matching products in database

**Test Steps:**
1. Upload BOQ
2. System attempts matching

**Expected Results:**
- Confidence score: <50%
- System uses default rate from labor library
- Warning shown: "No supplier match found. Using standard rate."
- User can manually search and select product

---

### Test Suite: PRICE-002 - Composite Rate Calculation

#### TC-PRICE-CALC-001: Material Cost Calculation
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- Product: Common Brick, Unit Price: R1.50/brick
- BOQ Quantity: 10,000 bricks

**Test Steps:**
1. Upload BOQ
2. System calculates material cost

**Expected Results:**
- Material Cost = R1.50 × 10,000 = R15,000
- Calculation displayed in breakdown
- No errors

**Formula:** `Material Cost = Unit Price × Quantity`

---

#### TC-PRICE-CALC-002: Labor Cost Calculation
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- BOQ item: "Excavation in soft soil"
- Labor rate: R280/m³
- Quantity: 500 m³

**Test Steps:**
1. Upload BOQ
2. System applies labor rate

**Expected Results:**
- Labor Cost = R280 × 500 = R140,000
- Labor category: "Plant Operator"
- Cost included in total

**Formula:** `Labor Cost = Labor Rate × Quantity × Hours per Unit`

---

#### TC-PRICE-CALC-003: Equipment Cost Calculation
**Priority:** High  
**Type:** Functional

**Preconditions:**
- BOQ item: "Concrete pouring 30MPa"
- Equipment: Concrete mixer, R450/day
- Estimated usage: 3 days

**Test Steps:**
1. Upload BOQ
2. System calculates equipment cost

**Expected Results:**
- Equipment Cost = R450 × 3 = R1,350
- Equipment supplier: XYZ Equipment Hire
- Cost added to total

---

#### TC-PRICE-CALC-004: Overheads & Profit (15%)
**Priority:** High  
**Type:** Functional

**Preconditions:**
- Subtotal (Material + Labor + Equipment): R500,000
- OH&P: 15%

**Test Steps:**
1. System calculates total cost

**Expected Results:**
- OH&P = R500,000 × 0.15 = R75,000
- Total Cost = R500,000 + R75,000 = R575,000
- Breakdown shows OH&P separately

**Formula:** `Total = Subtotal × (1 + OH&P%)`

---

#### TC-PRICE-CALC-005: Total Project Cost Accuracy
**Priority:** Critical  
**Type:** Integration Testing

**Preconditions:**
- Sample BOQ: 100-unit RDP housing project

**Test Steps:**
1. Upload `test_data/rdp_100units_verified.xlsx`
2. Click "Price BOQ"
3. Compare total with manual calculation

**Expected Results:**
- System total matches manual calculation (±0.1%)
- All line items correctly priced
- No rounding errors
- Breakdown sums to total

**Test Data:**
Expected Total: R30,120,000 (verified by QS)

---

### Test Suite: PRICE-003 - Bulk Discounts

#### TC-PRICE-DISC-001: Apply Bulk Discount for Large Quantities
**Priority:** Medium  
**Type:** Functional

**Preconditions:**
- Product: Cement 50kg bags
- Unit Price: R85/bag
- Discount Tier: 5% off for >1,000 bags
- BOQ Quantity: 1,500 bags

**Test Steps:**
1. Upload BOQ
2. System applies discount

**Expected Results:**
- Base Cost: R85 × 1,500 = R127,500
- Discount: 5% = R6,375
- Final Cost: R121,125
- Breakdown shows: "Bulk discount applied: -R6,375"

---

## Module 4: Regional Optimization

### Test Suite: REGION-001 - Provincial Pricing

#### TC-REGION-PROV-001: Apply Gauteng Base Pricing (1.0x)
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- Project Province: Gauteng (GP)
- Material base price: R10,000

**Test Steps:**
1. Select Province: Gauteng
2. Upload BOQ
3. Review pricing

**Expected Results:**
- Provincial Factor: 1.0x
- Material Cost: R10,000 (no adjustment)
- Dashboard shows: "Province: Gauteng (Base Pricing)"

---

#### TC-REGION-PROV-002: Apply Limpopo Remote Pricing (1.15x)
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- Project Province: Limpopo (LP)
- Material base price: R10,000

**Test Steps:**
1. Select Province: Limpopo
2. Upload BOQ
3. Review pricing

**Expected Results:**
- Provincial Factor: 1.15x
- Material Cost: R10,000 × 1.15 = R11,500
- Dashboard shows: "Province: Limpopo (Remote Pricing +15%)"
- Tooltip explains: "Remote province adjustment due to transport and supply chain costs"

---

#### TC-REGION-PROV-003: Compare Pricing Across All 9 Provinces
**Priority:** High  
**Type:** Comparative Testing

**Test Steps:**
1. Upload same BOQ
2. Price for Gauteng → Note total
3. Change to Western Cape → Note total
4. Repeat for all 9 provinces
5. Generate comparison report

**Expected Results:**
- Gauteng: R30,000,000 (base)
- Western Cape: R30,000,000 (base)
- KwaZulu-Natal: R30,000,000 (base)
- Eastern Cape: R32,400,000 (+8%)
- Free State: R32,400,000 (+8%)
- North West: R32,400,000 (+8%)
- Limpopo: R34,500,000 (+15%)
- Mpumalanga: R34,500,000 (+15%)
- Northern Cape: R34,500,000 (+15%)

**Test Data:**
BOQ: 100-unit RDP housing

---

### Test Suite: REGION-002 - Transport Cost Calculation

#### TC-REGION-TRANS-001: Local Supplier (0-50km) - Minimum Charge
**Priority:** High  
**Type:** Functional

**Preconditions:**
- Project Location: Soweto, Gauteng (-26.2041, 28.0473)
- Supplier: Builders Warehouse Soweto (-26.2215, 28.0654)
- Distance: 2.5 km

**Test Steps:**
1. Select project location: Soweto
2. Upload BOQ
3. System calculates transport

**Expected Results:**
- Distance: 2.5 km
- Transport Calculation: Minimum charge applies
- Transport Cost: R350 (minimum, even though distance is short)
- Breakdown shows: "Delivery: R350 (Local)"

---

#### TC-REGION-TRANS-002: Medium Distance Supplier (50-200km)
**Priority:** High  
**Type:** Functional

**Preconditions:**
- Project Location: Polokwane, Limpopo (-23.9045, 29.4689)
- Supplier: Cashbuild Pretoria (-25.7479, 28.2293)
- Distance: ~280 km

**Test Steps:**
1. Select project location: Polokwane
2. Upload BOQ with cement (heavy material, 5 tons)
3. System calculates transport

**Expected Results:**
- Distance: 280 km
- Formula: (280km × R20/km × 1.5 weight factor) / 10 ton capacity
- Transport Cost: R840
- Breakdown shows: "Delivery from Pretoria: R840 (280 km)"

---

#### TC-REGION-TRANS-003: Nearest Supplier Recommendation
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- Project Location: Cape Town
- Product: Common Brick
- Suppliers: 
  - Supplier A (Cape Town): 5 km away, R1.50/brick + R350 transport
  - Supplier B (Stellenbosch): 50 km away, R1.40/brick + R650 transport
- Quantity: 10,000 bricks

**Test Steps:**
1. Select Cape Town as location
2. Upload BOQ with 10,000 bricks
3. Review supplier recommendations

**Expected Results:**
- System calculates landed cost:
  - Supplier A: (R1.50 × 10,000) + R350 = R15,350
  - Supplier B: (R1.40 × 10,000) + R650 = R14,650
- System recommends Supplier B (cheaper total despite higher transport)
- Green badge: "Best Value (Including Delivery)"
- User can override and select Supplier A if preferred

---

### Test Suite: REGION-003 - Municipality Integration

#### TC-REGION-MUN-001: Municipality Dropdown Filters by Province
**Priority:** Medium  
**Type:** Functional

**Test Steps:**
1. Select Province: Gauteng
2. Click Municipality dropdown

**Expected Results:**
- Dropdown shows only Gauteng municipalities:
  - City of Johannesburg
  - City of Tshwane (Pretoria)
  - Ekurhuleni
  - Sedibeng
  - West Rand
- Other provinces' municipalities not shown

---

#### TC-REGION-MUN-002: GPS Auto-Populated from Municipality
**Priority:** Medium  
**Type:** Integration Testing

**Test Steps:**
1. Select Province: Western Cape
2. Select Municipality: City of Cape Town
3. Observe GPS coordinates

**Expected Results:**
- GPS auto-filled: -33.9249, 18.4241 (Cape Town CBD)
- User can manually override if needed
- Coordinates used for supplier distance calculation

---

## Module 5: Compliance Checking

### Test Suite: COMPLY-001 - SANS 1200 Validation

#### TC-COMPLY-SANS-001: Auto-Match SANS Codes
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- BOQ item: "Excavation in soft soil to reduce level"
- SANS code: SANS 1200 D: Earthworks

**Test Steps:**
1. Upload BOQ
2. System performs SANS matching

**Expected Results:**
- System identifies keywords: "Excavation", "soft soil"
- SANS code assigned: "SANS 1200 D: Earthworks"
- Compliance badge: ✅ SANS Compliant
- No manual intervention needed

---

#### TC-COMPLY-SANS-002: Flag Non-Compliant Items
**Priority:** High  
**Type:** Negative Testing

**Test Steps:**
1. Upload BOQ with item: "Custom widget installation"
2. System searches SANS database

**Expected Results:**
- No SANS match found
- Warning badge: ⚠️ SANS Code Not Found
- Tooltip: "Please manually verify compliance"
- User can assign SANS code manually

---

### Test Suite: COMPLY-002 - NHBRC Fee Calculation

#### TC-COMPLY-NHBRC-001: Calculate NHBRC Fee for RDP Housing
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- Project Type: RDP Housing
- Project Value: R30,000,000
- Units: 100

**Test Steps:**
1. Upload RDP BOQ
2. System detects project type
3. System calculates NHBRC fee

**Expected Results:**
- Formula: (R30,000,000 × 1.5%) + (R250 × 100 units)
- Calculation: R450,000 + R25,000 = R475,000
- Fee displayed in "Compliance Costs" section
- Breakdown shows: "NHBRC Enrollment: R475,000"

---

#### TC-COMPLY-NHBRC-002: NHBRC Fee Cap at R2 Million
**Priority:** Medium  
**Type:** Boundary Testing

**Preconditions:**
- Project Value: R200,000,000 (large project)

**Test Steps:**
1. Upload BOQ
2. System calculates NHBRC fee

**Expected Results:**
- Raw calculation: R200M × 1.5% = R3,000,000
- System applies cap: R2,000,000
- Message: "NHBRC fee capped at maximum R2,000,000"

---

### Test Suite: COMPLY-003 - BBBEE Tracking

#### TC-COMPLY-BBBEE-001: Display Supplier BBBEE Levels
**Priority:** High  
**Type:** Functional

**Preconditions:**
- BOQ uses 3 suppliers:
  - Supplier A: Level 2 (R10M spend)
  - Supplier B: Level 5 (R5M spend)
  - Supplier C: Level 8 (R2M spend)

**Test Steps:**
1. Upload and price BOQ
2. Review BBBEE summary

**Expected Results:**
- Total Spend: R17M
- Level 1-4 Spend: R10M (58.8%)
- Level 5-6 Spend: R5M (29.4%)
- Level 7-8 Spend: R2M (11.8%)
- Green badge: "58.8% Level 1-4 Spend ✅"
- Breakdown shows each supplier with BBBEE badge color:
  - Supplier A: Green badge
  - Supplier B: Yellow badge
  - Supplier C: Red badge

---

#### TC-COMPLY-BBBEE-002: Warning for Low BBBEE Compliance
**Priority:** Medium  
**Type:** Validation Testing

**Test Steps:**
1. Upload BOQ where <50% spend is Level 1-4

**Expected Results:**
- Warning message: "⚠️ Only 45% spend with Level 1-4 suppliers. Target is 50%+."
- Suggestions shown: "Consider alternative suppliers to improve BBBEE score"
- Report still generated (not blocking, just advisory)

---

## Module 6: Supplier Management

### Test Suite: SUPPLIER-001 - Supplier Registration

#### TC-SUPPLIER-REG-001: Complete Supplier Registration
**Priority:** Critical  
**Type:** Functional

**Test Steps:**
1. Navigate to Supplier Signup
2. Fill form:
   - Company: BuildMaster Supplies (Pty) Ltd
   - Registration: 2015/123456/07
   - Contact: Sarah Johnson
   - Email: sarah@buildmaster.co.za
   - Phone: 0117891234
   - Address: 45 Industrial Road, Johannesburg
   - Province: Gauteng
   - Category: Cement & Aggregates, Steel & Reinforcement
   - API Access: Yes
   - API Endpoint: https://api.buildmaster.co.za/products
   - API Key: [masked]
3. Accept Terms
4. Submit

**Expected Results:**
- All validations pass
- Status set to "pending"
- Admin email notification sent
- Confirmation message: "Application submitted. We'll contact you within 48 hours."
- Record in `suppliers` table

---

### Test Suite: SUPPLIER-002 - Product Catalog Upload

#### TC-SUPPLIER-CAT-001: Upload Product Catalog via Excel
**Priority:** High  
**Type:** Functional

**Preconditions:**
- Supplier approved and logged in
- Excel template: `test_data/product_catalog_template.xlsx` filled

**Test Steps:**
1. Supplier dashboard → "Manage Products"
2. Click "Upload Catalog"
3. Download Excel template
4. Fill template with 50 products
5. Upload filled template
6. Review import summary

**Expected Results:**
- Template downloaded successfully
- All 50 products validated:
  - Product names not blank
  - Prices > 0
  - Units recognized
- Import success: "50 products imported"
- Products immediately searchable in pricing engine

---

#### TC-SUPPLIER-CAT-002: API Product Sync
**Priority:** High  
**Type:** Integration Testing

**Preconditions:**
- Supplier has API configured
- Mock API responds with 100 products

**Test Steps:**
1. Admin → "Suppliers" → Select supplier
2. Click "Test API Connection"
3. Review API response
4. Click "Schedule Sync: Daily"
5. Manually trigger sync
6. Wait 30 seconds
7. Check product count

**Expected Results:**
- API test shows: "✅ Connection successful. 100 products found."
- Sync scheduled
- Manual sync completes in <30 seconds
- Product count increases by 100
- Sync log shows: "Last sync: Just now. 100 products updated."

---

### Test Suite: SUPPLIER-003 - Supplier Performance

#### TC-SUPPLIER-PERF-001: Track Supplier Usage
**Priority:** Medium  
**Type:** Analytics Testing

**Preconditions:**
- 10 BOQs priced in past month
- Supplier A used in 8 BOQs (80%)
- Supplier B used in 2 BOQs (20%)

**Test Steps:**
1. Admin → "Supplier Analytics"
2. Review usage table

**Expected Results:**
- Table shows:
  - Supplier A: 8 uses, R5M total value, 75% competitiveness
  - Supplier B: 2 uses, R1M total value, 50% competitiveness
- Chart shows top suppliers by usage
- Exportable to PDF

---

## Module 7: Contractor Management

### Test Suite: CONTRACTOR-001 - Template Library Access

#### TC-CONTRACTOR-TPL-001: Filter Templates by CIDB Grade
**Priority:** High  
**Type:** Functional

**Preconditions:**
- Contractor logged in
- CIDB Grade: 3CE (up to R2M projects)

**Test Steps:**
1. Navigate to Template Library
2. Browse available templates

**Expected Results:**
- Templates shown:
  - ✅ Basic RDP Housing (Grade 1-4)
  - ✅ Small Municipal Buildings (Grade 1-4)
  - ❌ Large Infrastructure (Grade 5-9) - grayed out
  - ❌ Commercial Complexes (Grade 7-9) - grayed out
- Tooltip on unavailable templates: "Requires CIDB Grade 5+"

---

#### TC-CONTRACTOR-TPL-002: Customize Template BOQ
**Priority:** Critical  
**Type:** Functional

**Test Steps:**
1. Select "RDP 50 Units" template
2. Click "Use Template"
3. Editable table loads
4. Change Quantity of Item 5 from 100 to 150
5. Add new row: "Custom ceramic tiles"
6. Delete row 20
7. Click "Recalculate Pricing"

**Expected Results:**
- Template loads in <2 seconds
- Quantity change allowed
- New row added at bottom
- Row 20 deleted
- Pricing recalculates within 3 seconds
- New total reflects changes
- Original template unchanged (session-only edits)

---

### Test Suite: CONTRACTOR-002 - Subscription Management

#### TC-CONTRACTOR-SUB-001: View Subscription Usage
**Priority:** High  
**Type:** Functional

**Preconditions:**
- Contractor subscribed to Professional Plan (20 BOQs/month)
- Used 15 BOQs this month

**Test Steps:**
1. Navigate to "My Subscription"
2. Review usage dashboard

**Expected Results:**
- Current Plan: Professional (R1,499/month)
- Usage: 15 / 20 BOQs (75%)
- Progress bar shows 75% filled
- Next Billing Date: [15 days from now]
- BOQs Remaining: 5
- Invoice history table shows past payments

---

#### TC-CONTRACTOR-SUB-002: Upgrade Subscription
**Priority:** Medium  
**Type:** Integration Testing

**Test Steps:**
1. Current Plan: Starter (R499/month, 5 BOQs)
2. Click "Upgrade Plan"
3. Select Professional (R1,499/month, 20 BOQs)
4. Confirm upgrade
5. Process payment (mock PayFast)
6. Return to dashboard

**Expected Results:**
- Prorated charge calculated: (30 - 15 days used) × (R1,499 - R499) / 30 = R500
- Payment modal shows: "Pay R500 for upgrade (prorated)"
- Payment succeeds
- Plan immediately updated
- BOQ limit increases from 5 to 20
- Email confirmation sent

---

## Module 8: Admin Dashboard

### Test Suite: ADMIN-001 - User Management

#### TC-ADMIN-USER-001: View All Users
**Priority:** High  
**Type:** Functional

**Preconditions:**
- Admin logged in
- Database has 50 users

**Test Steps:**
1. Navigate to "Users" tab
2. Review user table

**Expected Results:**
- Table shows all 50 users
- Columns: Name, Email, Role, Status, Registration Date
- Pagination: 25 users per page
- Search bar functional
- Sortable columns

---

#### TC-ADMIN-USER-002: Suspend User
**Priority:** Medium  
**Type:** Functional

**Test Steps:**
1. Select user: test@dhs.gov.za
2. Click "Suspend"
3. Enter reason: "Policy violation"
4. Confirm
5. Logout as admin
6. Attempt to login as test@dhs.gov.za

**Expected Results:**
- User status updated to "suspended"
- Login fails with message: "Your account has been suspended. Contact admin."
- Audit log records suspension

---

### Test Suite: ADMIN-002 - Database Inspector

#### TC-ADMIN-DB-001: Browse Database Tables
**Priority:** Medium  
**Type:** Functional

**Test Steps:**
1. Navigate to "Database" tab
2. Select table: "contractors"
3. Review records

**Expected Results:**
- Dropdown lists all tables
- "contractors" table shows all records
- Columns displayed correctly
- Pagination works
- Search filters records

---

#### TC-ADMIN-DB-002: Edit Record
**Priority:** Low  
**Type:** Functional

**Test Steps:**
1. Select table: "contractors"
2. Click "Edit" on row 3
3. Change CIDB Grade from 5GB to 6GB
4. Save changes

**Expected Results:**
- Edit modal opens
- Field editable
- Save updates database
- Success toast: "Record updated"
- Audit log records change

---

## Module 9: Export & Reporting

### Test Suite: EXPORT-001 - PDF Export

#### TC-EXPORT-PDF-001: Generate BOQ PDF Report
**Priority:** Critical  
**Type:** Functional

**Preconditions:**
- BOQ priced successfully

**Test Steps:**
1. Click "Export to PDF"
2. Wait for generation
3. Download PDF
4. Open PDF

**Expected Results:**
- Generation completes in <5 seconds
- PDF downloads as `BOQ_RDP100Units_2026-03-02.pdf`
- PDF contains:
  - Government header
  - Project details
  - Itemized BOQ table (all rows)
  - Subtotals
  - Total project cost (bold, highlighted)
  - Compliance summary
  - BBBEE breakdown
  - Audit trail
- Formatting: A4, proper margins, readable fonts
- File size: <2MB

---

#### TC-EXPORT-PDF-002: PDF Table Pagination
**Priority:** Medium  
**Type:** Functional

**Preconditions:**
- BOQ with 200 items (spans multiple pages)

**Test Steps:**
1. Export to PDF
2. Open PDF
3. Review pagination

**Expected Results:**
- Table splits across pages correctly
- Headers repeat on each page
- No cut-off rows
- Page numbers shown: "Page 1 of 5"

---

### Test Suite: EXPORT-002 - Excel Export

#### TC-EXPORT-XLS-001: Generate Excel with Formulas
**Priority:** Critical  
**Type:** Functional

**Test Steps:**
1. Click "Export to Excel"
2. Download file
3. Open in Microsoft Excel
4. Change Quantity in row 5
5. Observe Total recalculate

**Expected Results:**
- File downloads as `BOQ_RDP100Units_2026-03-02.xlsx`
- Multiple sheets: Summary, BOQ, Materials, Labor, Compliance
- Formulas active (e.g., `=E5*F5` for Amount)
- Changing quantity updates total automatically
- Formatted with colors, borders

---

#### TC-EXPORT-XLS-002: Excel Charts
**Priority:** Low  
**Type:** Visual Testing

**Test Steps:**
1. Export to Excel
2. Navigate to "Summary" sheet

**Expected Results:**
- Donut chart shows cost breakdown
- Bar chart shows BBBEE distribution
- Charts update if data changed

---

### Test Suite: EXPORT-003 - Compliance Documents

#### TC-EXPORT-COMPLY-001: Generate NHBRC Enrollment Form
**Priority:** High  
**Type:** Functional

**Test Steps:**
1. Click "Generate Compliance Docs"
2. Select "NHBRC Enrollment Form"
3. Download PDF

**Expected Results:**
- PDF contains pre-filled form:
  - Project Name: [auto-filled]
  - Project Address: [auto-filled]
  - Project Value: R30,000,000
  - NHBRC Fee: R475,000
- Instructions for submission included
- Downloadable as `NHBRC_Enrollment_RDP100Units.pdf`

---

## Module 10: Payment Integration

### Test Suite: PAYMENT-001 - PayFast Integration

#### TC-PAYMENT-PF-001: Successful PayFast Payment
**Priority:** Critical  
**Type:** Integration Testing

**Preconditions:**
- PayFast sandbox mode enabled
- Contractor subscribing to Professional Plan (R1,499/month)

**Test Steps:**
1. Click "Subscribe Now"
2. Select "Pay with PayFast"
3. Redirected to PayFast sandbox
4. Enter test card details:
   - Card: 4000 0000 0000 0002
   - Expiry: 12/25
   - CVV: 123
5. Click "Pay"
6. PayFast sends IPN to Qilly
7. Redirected back to Qilly

**Expected Results:**
- Redirect to PayFast successful
- Payment processed
- IPN validated by Qilly
- Subscription activated
- User redirected to dashboard
- Success message: "Payment successful! Your subscription is active."
- Receipt emailed

---

#### TC-PAYMENT-PF-002: Failed PayFast Payment
**Priority:** High  
**Type:** Negative Testing

**Test Steps:**
1. Initiate PayFast payment
2. Use declined test card: 4000 0000 0000 0069
3. Attempt payment

**Expected Results:**
- PayFast shows: "Payment declined"
- User returned to Qilly
- Error message: "Payment failed. Please try again or use a different payment method."
- Subscription NOT activated
- No charge applied

---

### Test Suite: PAYMENT-002 - EFT Payment

#### TC-PAYMENT-EFT-001: EFT Payment Upload Proof
**Priority:** High  
**Type:** Functional

**Test Steps:**
1. Select "Pay via EFT"
2. View banking details
3. Copy reference number: CONT123_INV456
4. Upload proof of payment (PDF)
5. Submit

**Expected Results:**
- Banking details displayed correctly
- Reference number unique per invoice
- File upload succeeds
- Status set to "payment pending"
- Admin notified
- User sees: "Payment proof uploaded. Admin will verify within 24 hours."

---

#### TC-PAYMENT-EFT-002: Admin Verify EFT Payment
**Priority:** High  
**Type:** Functional

**Test Steps:**
1. Admin → "Payments" tab
2. Pending payments show CONT123_INV456
3. Click "View Proof"
4. Download and verify PDF
5. Click "Confirm Payment"

**Expected Results:**
- Proof of payment viewable
- "Confirm Payment" button enabled
- Payment status updated to "verified"
- Subscription activated
- User receives email: "Payment verified. Your subscription is active."

---

## Module 11: Multi-Environment

### Test Suite: ENV-001 - Environment Detection

#### TC-ENV-DETECT-001: Verify SIT Environment
**Priority:** Critical  
**Type:** Configuration Testing

**Test Steps:**
1. Navigate to https://qilly-sit.vercel.app
2. Open browser console
3. Check environment logs

**Expected Results:**
- Console shows: "🧪 ENVIRONMENT: SIT"
- Environment badge shows: "🧪 SIT" (orange)
- Database connection: Supabase SIT project
- No real payment processing (sandbox only)

---

#### TC-ENV-DETECT-002: Verify UAT Environment
**Priority:** High  
**Type:** Configuration Testing

**Test Steps:**
1. Navigate to https://qilly-uat.vercel.app
2. Check environment

**Expected Results:**
- Console shows: "🧑‍💻 ENVIRONMENT: UAT"
- Badge: "🧑‍💻 UAT" (blue)
- Database: Supabase UAT
- Test data only

---

#### TC-ENV-DETECT-003: Production Has No Badge (for regular users)
**Priority:** High  
**Type:** Configuration Testing

**Test Steps:**
1. Navigate to production (when live)
2. Login as regular user (non-admin)
3. Check for environment badge

**Expected Results:**
- No environment badge visible
- Clean UI for end users
- Admin users still see badge

---

### Test Suite: ENV-002 - Environment Switcher (Admin)

#### TC-ENV-SWITCH-001: Admin Switch to UAT
**Priority:** Medium  
**Type:** Functional

**Preconditions:**
- Admin logged in to SIT

**Test Steps:**
1. Navigate to Admin Dashboard
2. Open "Environment Switcher"
3. Select "UAT"
4. Confirm switch
5. Page reloads

**Expected Results:**
- Warning shown: "⚠️ Switching to UAT. Database will change."
- localStorage updated: `qilly_environment = "uat"`
- Page reloads
- Environment badge now shows "UAT"
- Database queries go to UAT Supabase

---

## Cross-Browser Testing

### Browsers to Test

1. **Google Chrome** (latest, Windows/Mac)
2. **Mozilla Firefox** (latest, Windows/Mac)
3. **Safari** (latest, Mac/iOS)
4. **Microsoft Edge** (latest, Windows)
5. **Mobile Chrome** (Android)
6. **Mobile Safari** (iOS)

### Test Matrix

| Feature | Chrome | Firefox | Safari | Edge | Mobile Chrome | Mobile Safari |
|---------|--------|---------|--------|------|---------------|---------------|
| Login | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| BOQ Upload | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ |
| Pricing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| PDF Export | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |
| Payment | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Legend:**
- ✅ Fully functional
- ⚠️ Minor UI issues (non-blocking)
- ❌ Broken (blocking issue)

---

## Performance Testing

### Load Time Benchmarks

| Page/Action | Target | Acceptable | Slow |
|-------------|--------|------------|------|
| **Initial Load** | <2s | <3s | >3s |
| **Login** | <1s | <2s | >2s |
| **BOQ Upload** | <3s | <5s | >5s |
| **Pricing Calculation** | <2s | <3s | >3s |
| **PDF Export** | <3s | <5s | >5s |
| **Dashboard Render** | <1s | <2s | >2s |

### Performance Test Cases

#### TC-PERF-001: Large BOQ Processing
**Objective:** Ensure system handles large BOQs efficiently

**Test Steps:**
1. Upload BOQ with 500 items
2. Measure processing time

**Expected Results:**
- Parsing: <5 seconds
- Pricing: <10 seconds
- Total: <15 seconds
- No browser freeze

---

#### TC-PERF-002: Concurrent Users
**Objective:** Test multi-user load

**Test Steps:**
1. Simulate 50 concurrent users
2. Each uploads and prices BOQ
3. Measure response times

**Expected Results:**
- All requests complete successfully
- Average response time: <5 seconds
- No timeouts
- No errors

**Tools:** JMeter, k6

---

## Security Testing

### Security Test Cases

#### TC-SEC-001: SQL Injection Prevention
**Priority:** Critical  
**Type:** Security Testing

**Test Steps:**
1. Login form → Enter email: `' OR '1'='1`
2. Attempt login

**Expected Results:**
- Login fails
- No database error exposed
- Input sanitized
- Logs security attempt

---

#### TC-SEC-002: XSS Prevention
**Priority:** Critical  
**Type:** Security Testing

**Test Steps:**
1. Contractor registration → Company Name: `<script>alert('XSS')</script>`
2. Submit form
3. Admin views contractor details

**Expected Results:**
- Script not executed
- Input escaped and displayed as text
- No alert popup

---

#### TC-SEC-003: Unauthorized API Access
**Priority:** Critical  
**Type:** Security Testing

**Test Steps:**
1. Logout from Qilly
2. Use browser console to call API: `fetch('/api/contractors')`

**Expected Results:**
- API returns 401 Unauthorized
- No data leaked
- Session required

---

#### TC-SEC-004: POPIA Compliance - Data Export
**Priority:** High  
**Type:** Compliance Testing

**Test Steps:**
1. User requests data export ("Right to Access")
2. Admin generates user data export

**Expected Results:**
- All user data exportable
- Includes: Profile, BOQs, Payments, Activity logs
- Delivered in machine-readable format (JSON/CSV)
- Complies with POPIA requirements

---

## Bug Reporting Template

### Bug Report Format

```
BUG ID: BUG-[Module]-[Number]
TITLE: [Clear, concise title]
SEVERITY: [Critical | High | Medium | Low]
PRIORITY: [P0 | P1 | P2 | P3]
ENVIRONMENT: [SIT | UAT | PREPROD | PROD]
BROWSER: [Chrome 120, Firefox 115, etc.]

DESCRIPTION:
[What is broken? What did you expect vs what happened?]

STEPS TO REPRODUCE:
1. [Step 1]
2. [Step 2]
3. [Step 3]

EXPECTED RESULT:
[What should happen]

ACTUAL RESULT:
[What actually happened]

SCREENSHOTS/VIDEOS:
[Attach or link]

CONSOLE ERRORS:
[Copy-paste any browser console errors]

TEST DATA USED:
[Files, credentials, etc.]

WORKAROUND:
[If available]

ADDITIONAL NOTES:
[Anything else helpful]
```

### Severity Levels

- **Critical:** System crash, data loss, security breach, blocking issue
- **High:** Major feature broken, significant UX issue
- **Medium:** Minor feature broken, cosmetic issue
- **Low:** Typo, minor UI glitch

### Example Bug Report

```
BUG ID: BUG-BOQ-012
TITLE: BOQ Upload Fails for Files Over 5MB
SEVERITY: High
PRIORITY: P1
ENVIRONMENT: SIT
BROWSER: Chrome 122.0.6261.94

DESCRIPTION:
When uploading a BOQ file larger than 5MB, the upload progress bar freezes at 50% and never completes. No error message is shown.

STEPS TO REPRODUCE:
1. Login to SIT as test@dhs.gov.za
2. Navigate to Main Dashboard
3. Drag and drop file: test_data/large_boq_7mb.xlsx
4. Observe upload progress

EXPECTED RESULT:
- Upload completes successfully
- File processed and preview shown

ACTUAL RESULT:
- Progress bar freezes at 50%
- No error message
- After 2 minutes, page becomes unresponsive

SCREENSHOTS:
[screenshot_upload_freeze.png]

CONSOLE ERRORS:
```
Error: Request Entity Too Large
    at uploadBOQ (BillUpload.tsx:145)
```

TEST DATA USED:
File: test_data/large_boq_7mb.xlsx (7.2 MB)

WORKAROUND:
Split BOQ into smaller files (<5MB each)

ADDITIONAL NOTES:
Documentation states 10MB limit, but error occurs at 5MB. Possible Vercel upload limit?
```

---

## Test Metrics & KPIs

### Test Coverage

**Target:** ≥90% feature coverage

**Calculation:**
```
Test Coverage = (Features Tested / Total Features) × 100%
```

### Defect Metrics

**Track:**
- Total bugs found
- Bugs by severity
- Bugs by module
- Open vs Closed bugs
- Average time to fix

### Pass/Fail Rate

**Target:** ≥95% pass rate before release

**Calculation:**
```
Pass Rate = (Test Cases Passed / Total Test Cases Executed) × 100%
```

### Test Execution Report (Weekly)

| Module | Total Tests | Passed | Failed | Blocked | Pass Rate |
|--------|-------------|--------|--------|---------|-----------|
| Authentication | 25 | 24 | 1 | 0 | 96% |
| BOQ Upload | 18 | 17 | 1 | 0 | 94% |
| Pricing | 30 | 28 | 2 | 0 | 93% |
| Regional | 15 | 15 | 0 | 0 | 100% |
| Compliance | 12 | 11 | 1 | 0 | 92% |
| **TOTAL** | **100** | **95** | **5** | **0** | **95%** |

---

## Test Execution Guidelines

### Daily Testing Routine

1. **Morning:** Run automated regression suite on SIT
2. **During Development:** Test new features as they're deployed
3. **Afternoon:** Manual exploratory testing
4. **End of Day:** Update test case results, log bugs

### Sprint Testing Workflow

**Week 1:**
- Review user stories and acceptance criteria
- Write test cases for new features
- Set up test data

**Week 2:**
- Execute functional tests
- Execute integration tests
- Exploratory testing

**Week 3 (Pre-release):**
- Regression testing
- Performance testing
- Security testing
- UAT with stakeholders

**Week 4 (Release):**
- Final smoke tests on PREPROD
- Production deployment
- Post-deployment verification

---

## Test Data Management

### Test Accounts

**Government Users (SIT):**
- test1@dhs.gov.za / Pass@123
- test2@gauteng.gov.za / Pass@123

**Contractors (SIT):**
- contractor1@testco.co.za / Pass@123 (Approved, Grade 5)
- contractor2@testco.co.za / Pass@123 (Pending)

**Suppliers (SIT):**
- supplier1@testbuild.co.za / Pass@123 (Approved)

**Admin (SIT):**
- admin@qilly.co.za / AdminPass@123

### Test Files

Located in `test_data/` folder:

- `sample_boq_rdp_100units.xlsx` - Standard RDP BOQ
- `sample_boq_invalid_columns.xlsx` - Missing columns
- `sample_boq_invalid_quantities.xlsx` - Text in quantity fields
- `large_boq_500items.xlsx` - Performance testing
- `product_catalog_template.xlsx` - Supplier catalog template
- `tax_clearance.pdf` - Mock tax clearance cert
- `cidb_cert.pdf` - Mock CIDB certificate

---

## Appendix: Testing Tools

### Recommended Tools

1. **Manual Testing:** Browser DevTools, Screenshots
2. **Automation:** Playwright, Cypress
3. **API Testing:** Postman, Insomnia
4. **Performance:** Lighthouse, GTmetrix, WebPageTest
5. **Load Testing:** JMeter, k6
6. **Security:** OWASP ZAP, Burp Suite
7. **Bug Tracking:** Jira, Azure DevOps, GitHub Issues
8. **Test Management:** TestRail, Zephyr, Excel

---

**End of Testing Guide**

*For questions or clarifications, contact QA Lead or Product Owner.*
