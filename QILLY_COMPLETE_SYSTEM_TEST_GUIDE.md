# Qilly - Complete System Testing Guide
## Version 1.0 | February 2026

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Pre-Testing Setup](#pre-testing-setup)
3. [Core Features Testing](#core-features-testing)
4. [Compliance Calculator Testing](#compliance-calculator-testing)
5. [Regional Pricing Testing](#regional-pricing-testing)
6. [Supplier Management Testing](#supplier-management-testing)
7. [Admin Dashboard Testing](#admin-dashboard-testing)
8. [Export Functions Testing](#export-functions-testing)
9. [Performance Testing](#performance-testing)
10. [Security & Compliance Testing](#security-compliance-testing)
11. [Test Results Documentation](#test-results-documentation)

---

## 1. Introduction

### Purpose
This document provides comprehensive testing guidelines for all Qilly system features, ensuring production readiness for DHS deployment.

### Scope
- **User Roles:** DHS Buyers, Suppliers, Administrators
- **Environments:** Demo Mode (localStorage) and Production Mode (Supabase)
- **Platforms:** Desktop (Chrome, Firefox, Edge), Mobile (iOS Safari, Android Chrome), Tablet (iPad, Android)

### Testing Standards
- ✅ **Accuracy Target:** 85-95% for pricing calculations
- ✅ **Performance Target:** <5 seconds for BOQ processing
- ✅ **Availability Target:** 99.5% uptime
- ✅ **Compliance:** SANS 1200, NBR, CIDB, NHBRC, BBBEE, POPIA

---

## 2. Pre-Testing Setup

### Environment Preparation

#### **Demo Mode Setup (No Supabase Required)**
```
1. Open Chrome browser (latest version)
2. Navigate to Qilly application URL
3. Press F12 → Console tab
4. Verify no errors on load
5. Check localStorage for demo data:
   - localStorage.getItem('demo_suppliers')
   - localStorage.getItem('demo_processed_boqs')
```

#### **Production Mode Setup (Supabase Connected)**
```
1. Ensure Supabase project is connected
2. Verify environment variables:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
3. Check database tables exist:
   - suppliers
   - processed_boqs
   - compliance_costs
4. Verify RLS (Row Level Security) policies active
```

### Test Data Requirements

#### **Sample BOQ Data (Small Project - 20 Units)**
```
Item Code | Description | Qty | Unit
----------|-------------|-----|-----
A.1.1.1 | Excavation in soft soil | 50 | m³
A.1.2.3 | Backfilling with selected material | 30 | m³
B.2.3.4 | Ready-mix concrete 25MPa | 40 | m³
C.3.2.1 | Face bricks | 30000 | nr
D.4.1.2 | Steel reinforcement Y12 | 3000 | kg
E.5.3.1 | Roof tiles concrete | 1000 | m²
F.6.1.1 | Aluminum windows 1200x1200 | 40 | nr
G.7.1.2 | 110mm PVC sewer pipes | 300 | m
```

**Expected Results:**
- Project Value: ~R3M - R3.5M
- Processing Time: 2-4 seconds
- Compliance Costs: ~R120K - R140K (4-5%)

#### **Sample BOQ Data (Medium Project - 100 Units)**
```
[Use 5x quantities from small project]
Expected Project Value: ~R15M - R18M
Expected Compliance Costs: ~R600K - R750K
```

#### **Sample BOQ Data (Large Project - 500 Units)**
```
[Use 25x quantities from small project]
Expected Project Value: ~R75M - R90M
Expected Compliance Costs: ~R3M - R3.75M
```

---

## 3. Core Features Testing

### 3.1 BOQ Upload & Processing

#### **Test Case 3.1.1: Manual BOQ Entry**

**Objective:** Verify manual table entry works correctly

**Steps:**
1. Navigate to Dashboard
2. Click "+ Add Row" button
3. Enter test data:
   - Item Code: A.1.1.1
   - Description: Excavation in soft soil
   - Quantity: 100
   - Unit: m³
4. Add 5 more rows with different items
5. Fill in Project Settings:
   - Province: Gauteng (GP)
   - Municipality: Johannesburg (JHB)
   - Profit Margin: 15%
   - CIDB Grading: GB4
   - Duration: 6 months
   - Machinery: Rented
6. Click "Process Bill of Quantities"

**Expected Results:**
- ✅ All rows save correctly (no data loss)
- ✅ Validation errors show for empty required fields
- ✅ Processing completes in <5 seconds
- ✅ Redirects to results page
- ✅ All entered items display in pricing table

**Pass/Fail Criteria:**
- PASS: All 5 items processed with prices shown
- FAIL: Any item missing, incorrect quantities, or errors

---

#### **Test Case 3.1.2: CSV/Excel Upload**

**Objective:** Verify file upload parsing works

**Steps:**
1. Create CSV file with BOQ data (use template format)
2. Navigate to Dashboard
3. Click "Upload CSV/Excel" button
4. Select test CSV file
5. Verify preview table shows correct data
6. Click "Import"
7. Process BOQ

**Expected Results:**
- ✅ CSV parsed correctly (all rows imported)
- ✅ Item codes, descriptions, quantities match source file
- ✅ Units recognized correctly (m³, m², kg, etc.)
- ✅ No duplicate rows created
- ✅ Processing completes successfully

**Test Data:** See `/test-data/sample-boq.csv`

---

#### **Test Case 3.1.3: Large BOQ Performance**

**Objective:** Test system handles 500+ line items

**Steps:**
1. Upload BOQ with 500+ items (use `/test-data/large-boq-500-items.csv`)
2. Start timer when clicking "Process"
3. Monitor browser console for errors
4. Wait for processing to complete
5. Record completion time

**Expected Results:**
- ✅ Processing time: <30 seconds (500 items)
- ✅ No browser freeze/hang
- ✅ All items priced correctly
- ✅ Memory usage <500MB (check Chrome Task Manager)
- ✅ No console errors

**Performance Benchmarks:**
- 100 items: <5 seconds
- 250 items: <15 seconds
- 500 items: <30 seconds
- 1000 items: <60 seconds

---

### 3.2 Regional Pricing Engine

#### **Test Case 3.2.1: Provincial Cost Variations**

**Objective:** Verify regional multipliers applied correctly

**Steps:**
1. Process same BOQ in all 9 provinces:
   - Gauteng (GP) - baseline 1.0x
   - Western Cape (WC) - 1.05x
   - KwaZulu-Natal (KZN) - 0.95x
   - Eastern Cape (EC) - 0.85x
   - Limpopo (LP) - 0.80x
   - Mpumalanga (MP) - 0.88x
   - North West (NW) - 0.85x
   - Free State (FS) - 0.87x
   - Northern Cape (NC) - 0.90x

2. Record total project costs for each province
3. Calculate % differences from Gauteng baseline

**Expected Results (for R10M Gauteng baseline):**

| Province | Multiplier | Expected Total | % Difference |
|----------|------------|----------------|--------------|
| Gauteng | 1.0 | R10,000,000 | 0% |
| Western Cape | 1.05 | R10,500,000 | +5% |
| KwaZulu-Natal | 0.95 | R9,500,000 | -5% |
| Eastern Cape | 0.85 | R8,500,000 | -15% |
| Limpopo | 0.80 | R8,000,000 | -20% |
| Mpumalanga | 0.88 | R8,800,000 | -12% |
| North West | 0.85 | R8,500,000 | -15% |
| Free State | 0.87 | R8,700,000 | -13% |
| Northern Cape | 0.90 | R9,000,000 | -10% |

**Pass Criteria:** Costs within ±2% of expected multiplier

---

#### **Test Case 3.2.2: Municipality Selection**

**Objective:** Verify municipality dropdown shows correct options per province

**Steps:**
1. Select each province in Project Settings
2. Open Municipality dropdown
3. Verify municipalities listed match province
4. Test search/filter functionality

**Expected Results:**
- ✅ Gauteng: Shows JHB, Pretoria, Ekurhuleni, etc.
- ✅ Western Cape: Shows Cape Town, Stellenbosch, etc.
- ✅ KZN: Shows Durban, Pietermaritzburg, etc.
- ✅ Search "Durban" filters correctly
- ✅ No municipalities from wrong province shown

---

#### **Test Case 3.2.3: Supplier Distance Calculations**

**Objective:** Test transport cost accuracy based on distance

**Steps:**
1. Process BOQ with Gauteng/Johannesburg project
2. Expand supplier details for bulk materials (concrete, bricks)
3. Record supplier distances and transport costs
4. Verify calculations:
   - Concrete (bulk): R15-R25/m³ per km
   - Bricks (bulk): R12-R20/1000 bricks per km
   - Steel (standard): R8-R12/ton per km

**Test Scenarios:**

| Material | Distance | Expected Transport Cost/Unit |
|----------|----------|------------------------------|
| Concrete 25MPa | 15km | R225-R375/m³ |
| Concrete 25MPa | 50km | R750-R1,250/m³ |
| Concrete 25MPa | 100km | R1,500-R2,500/m³ |
| Face bricks | 20km | R240-R400/1000 bricks |
| Steel Y12 | 30km | R240-R360/ton |

**Expected Results:**
- ✅ Closer suppliers ranked higher
- ✅ Transport costs reasonable (not zero, not excessive)
- ✅ "Savings vs Distant Supplier" calculated correctly
- ✅ Landed cost = base price + transport + fees

---

### 3.3 Pricing Accuracy Validation

#### **Test Case 3.3.1: Comparison with Manual QS Estimate**

**Objective:** Validate Qilly pricing against professional Quantity Surveyor estimate

**Steps:**
1. Obtain manual QS estimate for reference project
2. Process same BOQ in Qilly
3. Compare line-by-line pricing
4. Calculate overall variance percentage

**Reference BOQ:** 50-unit RDP housing project (use DHS standard design)

**Comparison Template:**

| Item | QS Manual | Qilly | Variance | Within 85-95%? |
|------|-----------|-------|----------|----------------|
| Excavation | R45,000 | R43,500 | -3.3% | ✅ |
| Concrete | R280,000 | R295,000 | +5.4% | ✅ |
| Brickwork | R520,000 | R498,000 | -4.2% | ✅ |
| ... | ... | ... | ... | ... |
| **TOTAL** | **R3,200,000** | **R3,150,000** | **-1.6%** | **✅** |

**Pass Criteria:**
- ✅ Line items within ±15% variance
- ✅ Total project within ±10% variance
- ✅ Overall accuracy 85-95%

---

## 4. Compliance Calculator Testing

### 4.1 NHBRC Compliance

#### **Test Case 4.1.1: Enrollment Fee Calculation**

**Objective:** Verify NHBRC enrollment fees correct per unit

**Steps:**
1. Process housing BOQ with known unit count
2. Scroll to Compliance Cost Calculator
3. Expand NHBRC section
4. Verify enrollment fee = R850 × units

**Test Data:**

| Project | Units | Expected Enrollment Fee |
|---------|-------|------------------------|
| Small | 20 | R17,000 |
| Medium | 100 | R85,000 |
| Large | 500 | R425,000 |

**Expected Results:**
- ✅ Fee scales linearly with units
- ✅ Calculation matches official NHBRC 2024/2025 schedule
- ✅ Breakdown shows: enrollment + inspections + insurance

---

#### **Test Case 4.1.2: Inspection Fees**

**Steps:**
1. Verify inspection fees = R2,250 × units
2. Check breakdown shows:
   - Foundation inspection
   - Damp-proof course
   - Roof structure
   - Plumbing
   - Electrical
   - Final completion

**Test Data:**

| Units | Expected Inspection Fees |
|-------|-------------------------|
| 20 | R45,000 |
| 100 | R225,000 |
| 500 | R1,125,000 |

---

#### **Test Case 4.1.3: Defects Insurance**

**Steps:**
1. Verify insurance = R1,800 × units
2. Check 5-year structural defects coverage included

**Test Data:**

| Units | Expected Insurance Premium |
|-------|---------------------------|
| 20 | R36,000 |
| 100 | R180,000 |
| 500 | R900,000 |

---

### 4.2 CIDB Compliance Validation

#### **Test Case 4.2.1: Contractor Grade Matching**

**Objective:** Verify CIDB grade requirements match project value

**Steps:**
1. Process BOQ worth R500,000 with GB1 contractor
2. Check: ✅ Green checkmark (GB1 max R200K - SHOULD FAIL)
3. Process BOQ worth R500,000 with GB2 contractor
4. Check: ✅ Green checkmark (GB2 max R650K - SHOULD PASS)

**Test Matrix:**

| Project Value | Contractor Grade | Max Allowed | Should Show |
|---------------|------------------|-------------|-------------|
| R150,000 | GB1 | R200,000 | ✅ Green |
| R500,000 | GB1 | R200,000 | ❌ Red warning |
| R500,000 | GB2 | R650,000 | ✅ Green |
| R1,500,000 | GB2 | R650,000 | ❌ Red warning |
| R1,500,000 | GB3 | R2,000,000 | ✅ Green |
| R5,000,000 | GB3 | R2,000,000 | ❌ Red warning |
| R5,000,000 | GB4 | R6,500,000 | ✅ Green |
| R15,000,000 | GB4 | R6,500,000 | ❌ Red warning |
| R15,000,000 | GB5 | R20,000,000 | ✅ Green |
| R50,000,000 | GB5 | R20,000,000 | ❌ Red warning |

**Expected Red Warning Message:**
```
⚠️ CIDB Compliance Warning
Contractor grade GB3 insufficient for R5,000,000 project
Required minimum: GB4
This bid will be rejected as non-compliant
```

**Pass Criteria:**
- ✅ All warnings trigger correctly
- ✅ All compliant grades show green
- ✅ Correct minimum grade displayed

---

#### **Test Case 4.2.2: CIDB Registration Fees**

**Objective:** Verify CIDB fees match official schedule

**Test Data:**

| Grade | Registration Fee | Annual Fee | Total Year 1 |
|-------|------------------|------------|--------------|
| GB1 | R500 | R500 | R1,000 |
| GB2 | R750 | R750 | R1,500 |
| GB3 | R1,000 | R1,000 | R2,000 |
| GB4 | R1,500 | R1,500 | R3,000 |
| GB5 | R2,500 | R2,500 | R5,000 |
| GB6 | R4,000 | R4,000 | R8,000 |
| GB7 | R6,500 | R6,500 | R13,000 |
| GB8 | R10,000 | R10,000 | R20,000 |
| GB9 | R15,000 | R15,000 | R30,000 |

**Steps:**
1. Process BOQs with each contractor grade
2. Verify CIDB cost breakdown matches table above
3. Check registration + annual = total shown

---

### 4.3 Statutory Labour Costs

#### **Test Case 4.3.1: UIF, SDL, COIDA, Pension Calculations**

**Objective:** Verify statutory percentages correct

**Steps:**
1. Process R10M project (35% labour = R3.5M labour cost)
2. Check Statutory Labour Costs breakdown:
   - UIF (1%): R35,000
   - SDL (1%): R35,000
   - COIDA (1.75%): R61,250
   - Pension (10%): R350,000
   - **Total: R481,250 (13.75% of R3.5M)**

**Test Matrix:**

| Project Value | Labour (35%) | UIF (1%) | SDL (1%) | COIDA (1.75%) | Pension (10%) | Total |
|---------------|--------------|----------|----------|---------------|---------------|-------|
| R1,000,000 | R350,000 | R3,500 | R3,500 | R6,125 | R35,000 | R48,125 |
| R5,000,000 | R1,750,000 | R17,500 | R17,500 | R30,625 | R175,000 | R240,625 |
| R10,000,000 | R3,500,000 | R35,000 | R35,000 | R61,250 | R350,000 | R481,250 |
| R20,000,000 | R7,000,000 | R70,000 | R70,000 | R122,500 | R700,000 | R962,500 |

**Expected Results:**
- ✅ Percentages fixed nationwide (not affected by province)
- ✅ Calculations accurate to Rand
- ✅ References shown: UIF Act, Skills Development Act, COIDA, Pension Funds Act

---

### 4.4 Quality Testing Schedule

#### **Test Case 4.4.1: Concrete Testing (SANS 5861-1)**

**Objective:** Verify concrete testing frequency and costs

**Steps:**
1. Process BOQ with 100m³ concrete
2. Check testing schedule shows:
   - **Frequency:** 1 test per 50m³
   - **Tests Required:** 2 (100 ÷ 50)
   - **Cost per Test:** R450 (cube compression)
   - **Total:** R900

**Test Matrix:**

| Concrete Volume | Frequency | Tests Required | Cost/Test | Total Cost |
|----------------|-----------|----------------|-----------|------------|
| 50m³ | 1 per 50m³ | 1 | R450 | R450 |
| 100m³ | 1 per 50m³ | 2 | R450 | R900 |
| 250m³ | 1 per 50m³ | 5 | R450 | R2,250 |
| 500m³ | 1 per 50m³ | 10 | R450 | R4,500 |

**Expected Results:**
- ✅ SANS 5861-1 standard cited
- ✅ Slump test + compression test included
- ✅ 7-day and 28-day testing specified

---

#### **Test Case 4.4.2: Soil Testing (SANS 3001)**

**Objective:** Verify geotechnical testing costs

**Steps:**
1. Process housing BOQ
2. Check soil testing breakdown:
   - Trial pits: R12,000 (6 pits × R2,000)
   - Laboratory tests: R8,500 (5 samples)
   - Compaction tests: R5,000 (5 locations)
   - **Total: R25,500**

---

#### **Test Case 4.4.3: Brick Testing (SANS 227)**

**Objective:** Verify masonry unit testing

**Steps:**
1. Process BOQ with 100,000 bricks
2. Check brick testing:
   - **Frequency:** 1 test per 20,000 bricks
   - **Tests Required:** 5
   - **Cost per Test:** R1,300
   - **Total:** R6,500

---

### 4.5 BBBEE Verification

#### **Test Case 4.5.1: Verification Type (EME/QSE/Generic)**

**Objective:** Verify correct BBBEE category assigned

**Steps:**
1. Test with different company turnovers:
   - <R10M: EME (Exempted Micro Enterprise)
   - R10M-R50M: QSE (Qualifying Small Enterprise)
   - >R50M: Generic Enterprise

**Test Matrix:**

| Turnover | BBBEE Type | Verification Fee | Consultant Fee | Total |
|----------|------------|------------------|----------------|-------|
| R5M | EME | R3,500 | R8,000 | R11,500 |
| R15M | QSE | R8,500 | R15,000 | R23,500 |
| R75M | Generic | R25,000 | R45,000 | R70,000 |

**Expected Results:**
- ✅ Correct type assigned based on turnover
- ✅ SANAS-accredited agency fees shown
- ✅ Annual renewal noted (valid 12 months)

---

### 4.6 Preliminaries & General

#### **Test Case 4.6.1: Site Establishment Costs**

**Objective:** Verify site setup costs calculated

**Steps:**
1. Process R10M project
2. Check Preliminaries breakdown:
   - Site Establishment: 2.5% of project = R250,000
   - Temporary Services: 1.5% = R150,000
   - Time-Related (6mo): R85,000
   - Health & Safety: 0.75% = R75,000
   - **Total: R560,000 (5.6%)**

**Expected Components:**
- ✅ Site offices/toilets
- ✅ Water, electricity, fencing
- ✅ Scaffolding, hoarding
- ✅ Site security
- ✅ Safety officer, first aid

---

### 4.7 Provincial Adjustments

#### **Test Case 4.7.1: Testing Costs by Province**

**Objective:** Verify testing costs vary by province

**Steps:**
1. Process same BOQ in Gauteng vs Limpopo
2. Compare testing costs (should differ)
3. Compare statutory costs (should NOT differ - fixed by law)

**Expected Results:**

| Category | Gauteng (1.0x) | Limpopo (0.8x) | Should Vary? |
|----------|----------------|----------------|--------------|
| Concrete Testing | R4,500 | R3,600 | ✅ Yes |
| Soil Testing | R25,500 | R20,400 | ✅ Yes |
| NHBRC | R270,000 | R270,000 | ❌ No (fixed) |
| CIDB | R2,500 | R2,500 | ❌ No (fixed) |
| Statutory (UIF/SDL) | R48,125 | R48,125 | ❌ No (fixed by law) |
| BBBEE | R23,500 | R23,500 | ❌ No (fixed) |

---

## 5. Regional Pricing Testing

### 5.1 Supplier Selection Algorithm

#### **Test Case 5.1.1: Best Value Selection**

**Objective:** Verify "best value" supplier selected (not just cheapest)

**Steps:**
1. Process BOQ with multiple supplier options
2. Check selected supplier considers:
   - Base price
   - Transport cost
   - Distance
   - Supplier reliability (if available)
   - BBBEE status (if Enterprise tier)

**Formula:**
```
Final Score = (Base Price + Transport Cost) × Distance Factor × BBBEE Bonus
```

**Expected Results:**
- ✅ Sometimes selects slightly more expensive supplier if closer (lower transport)
- ✅ Landed cost (base + transport + fees) shown clearly
- ✅ "Savings vs Distant Supplier" calculated

---

### 5.2 Transport Cost Validation

#### **Test Case 5.2.1: Bulk Materials (High Transport Sensitivity)**

**Objective:** Verify bulk materials prioritize nearby suppliers

**Steps:**
1. Process BOQ with concrete/bricks
2. Expand supplier details
3. Verify suppliers sorted by total cost (not just base price)

**Example:**
```
Concrete 25MPa (100m³):

Supplier A: R1,200/m³ base, 15km = R1,425/m³ landed
Supplier B: R1,150/m³ base, 80km = R1,750/m³ landed
✅ Selected: Supplier A (lower landed cost despite higher base)
```

---

### 5.3 Multi-Supplier Quotes

#### **Test Case 5.3.1: Alternative Quotes Display**

**Objective:** Verify users can see alternative supplier options

**Steps:**
1. Process BOQ
2. Click on item row to expand
3. Check "Alternative Suppliers" section shows:
   - At least 2-3 alternative suppliers
   - Their prices, distances, landed costs
   - "Select This Supplier" button functional

**Expected Results:**
- ✅ Alternatives ranked by landed cost (best first)
- ✅ Can switch supplier and see totals update
- ✅ Transport cost differences highlighted

---

## 6. Supplier Management Testing

### 6.1 Supplier Registration

#### **Test Case 6.1.1: New Supplier Signup**

**Objective:** Verify supplier can register successfully

**Steps:**
1. Click "Supplier Login/Signup"
2. Select pricing tier (Free/Professional/Enterprise)
3. Fill in registration form:
   - Company name: Test Suppliers Ltd
   - Registration number: 2024/123456/07
   - VAT number: 4123456789
   - Contact person: John Doe
   - Email: john@testsuppliers.co.za
   - Phone: 011 234 5678
   - Province: Gauteng
   - Product categories: Concrete, Bricks, Steel
4. Upload compliance documents (if Enterprise tier)
5. Submit registration

**Expected Results:**
- ✅ Form validation works (required fields, email format, phone format)
- ✅ VAT number validated (10 digits)
- ✅ Registration number format checked
- ✅ Success message shown
- ✅ Supplier stored in database (or localStorage in demo)
- ✅ Status = "Pending" (awaiting admin approval)

---

#### **Test Case 6.1.2: Duplicate Registration Prevention**

**Steps:**
1. Register supplier with email: duplicate@test.co.za
2. Try registering again with same email
3. Check error message shown

**Expected Results:**
- ✅ Error: "Email already registered"
- ✅ Does not create duplicate entry

---

### 6.2 Supplier Product Catalog

#### **Test Case 6.2.1: Add Products to Catalog**

**Objective:** Verify supplier can add products

**Steps:**
1. Login as approved supplier
2. Navigate to "My Products"
3. Click "Add Product"
4. Fill in product details:
   - Product name: Ready-mix Concrete 25MPa
   - Category: Concrete
   - Unit price: R1,250/m³
   - Unit: m³
   - SANS specification: SANS 5861-1
   - Availability: In stock
   - Lead time: 3 days
5. Save product

**Expected Results:**
- ✅ Product added to catalog
- ✅ Price updates reflected in BOQ processing
- ✅ Product searchable by DHS users

---

#### **Test Case 6.2.2: Bulk Price Upload (CSV)**

**Steps:**
1. Download price list template
2. Fill with 50+ products
3. Upload CSV via "Bulk Upload" button
4. Verify all products imported correctly

**Expected Results:**
- ✅ CSV parsed correctly
- ✅ All 50+ products added
- ✅ Prices formatted correctly (R currency)
- ✅ Duplicate products flagged (not imported twice)

---

### 6.3 Supplier Tier Management

#### **Test Case 6.3.1: Free Tier Limitations**

**Objective:** Verify Free tier restrictions enforced

**Steps:**
1. Register as Free tier supplier
2. Try to add 51st product (limit = 50)
3. Check error message
4. Try to enable API integration
5. Check feature locked

**Expected Results:**
- ✅ Cannot add >50 products
- ✅ API integration disabled
- ✅ "Upgrade to Professional" prompt shown
- ✅ No SANS/BBBEE compliance badges visible

---

#### **Test Case 6.3.2: Enterprise Tier Features**

**Steps:**
1. Upgrade supplier to Enterprise tier
2. Verify features unlocked:
   - ✅ Unlimited products
   - ✅ API integration enabled
   - ✅ SANS 1200 compliance badge visible
   - ✅ BBBEE status displayed on profile
   - ✅ Priority listing in DHS searches
   - ✅ Dedicated account manager assigned

---

## 7. Admin Dashboard Testing

### 7.1 Supplier Approval Workflow

#### **Test Case 7.1.1: Approve Pending Supplier**

**Objective:** Verify admin can approve suppliers

**Steps:**
1. Login as admin
2. Navigate to "Suppliers" tab
3. Filter by status: Pending
4. Click on pending supplier
5. Review details:
   - Company registration valid?
   - VAT number correct?
   - Compliance documents uploaded (if Enterprise)?
6. Click "Approve"
7. Add approval notes: "Verified documents - approved"
8. Confirm approval

**Expected Results:**
- ✅ Status changes to "Approved"
- ✅ Supplier notified via email
- ✅ Supplier can now login and add products
- ✅ Approval timestamp recorded

---

#### **Test Case 7.1.2: Reject Non-Compliant Supplier**

**Steps:**
1. Select pending supplier with issues
2. Click "Reject"
3. Select rejection reason:
   - ❌ Invalid registration number
   - ❌ Missing compliance documents
   - ❌ Fraudulent information
4. Add rejection notes
5. Confirm rejection

**Expected Results:**
- ✅ Status = "Rejected"
- ✅ Supplier notified with reason
- ✅ Cannot login or add products
- ✅ Can re-apply after 30 days (if corrected)

---

### 7.2 Database Inspection

#### **Test Case 7.2.1: View Suppliers Table**

**Steps:**
1. Navigate to "Database" tab
2. Select table: "suppliers"
3. View records
4. Check columns displayed:
   - id, company_name, email, status, tier, created_at
5. Apply filters (e.g., status = approved)

**Expected Results:**
- ✅ All suppliers listed
- ✅ Data displays correctly (no null fields where required)
- ✅ Filters work
- ✅ Can sort by columns

---

#### **Test Case 7.2.2: View Processed BOQs Table**

**Steps:**
1. Select table: "processed_boqs"
2. View recent BOQ submissions
3. Check:
   - Project value
   - Province
   - Compliance costs
   - Processing timestamp

**Expected Results:**
- ✅ All processed BOQs logged
- ✅ Compliance costs captured
- ✅ Can export to CSV

---

### 7.3 Billing & ROI Analytics

#### **Test Case 7.3.1: Revenue Tracking**

**Steps:**
1. Navigate to "Billing & ROI" tab
2. View SupplierPricingTiers component
3. Check revenue projections:
   - Free tier: R0/month × suppliers
   - Professional: R2,500/month × suppliers
   - Enterprise: R7,500/month × suppliers
   - Custom: R15,000/month × suppliers

**Expected Results:**
- ✅ Monthly recurring revenue (MRR) calculated
- ✅ Annual recurring revenue (ARR) shown
- ✅ Breakdown by tier displayed

---

## 8. Export Functions Testing

### 8.1 Excel Export

#### **Test Case 8.1.1: Export Priced BOQ to Excel**

**Objective:** Verify Excel export includes all data

**Steps:**
1. Process a BOQ
2. Click "Export" → "Excel (.xlsx)"
3. Download file
4. Open in Microsoft Excel / LibreOffice Calc
5. Verify sheets:
   - **Sheet 1: Priced BOQ** (item code, description, qty, unit, prices)
   - **Sheet 2: Compliance Costs** (6 categories breakdown)
   - **Sheet 3: Summary** (totals, savings, project info)

**Expected Results:**
- ✅ All BOQ items present
- ✅ Formulas preserved (e.g., =B2*C2 for totals)
- ✅ Compliance costs detailed
- ✅ Provincial pricing info included
- ✅ File opens without errors

---

### 8.2 PDF Export

#### **Test Case 8.2.1: Export Professional Report**

**Steps:**
1. Click "Export" → "PDF Report"
2. Download PDF
3. Open in Adobe Reader / Chrome
4. Verify sections:
   - Cover page (project name, date, Qilly logo)
   - Executive summary
   - Detailed BOQ (table format)
   - Compliance costs breakdown
   - Regional pricing analysis
   - Footer (page numbers, watermark)

**Expected Results:**
- ✅ Professional formatting (DHS-ready)
- ✅ All tables fit on pages (no cut-off)
- ✅ Charts/graphs display correctly
- ✅ Qilly branding visible
- ✅ File size <5MB

---

### 8.3 CSV Export

#### **Test Case 8.3.1: Export for External Systems**

**Steps:**
1. Click "Export" → "CSV"
2. Download file
3. Open in Excel / text editor
4. Verify CSV format correct:
   - Comma-separated
   - Header row present
   - Quotes around text fields
   - Numbers not quoted

**Expected Results:**
- ✅ Valid CSV (RFC 4180 compliant)
- ✅ Can import into SAP/ERP systems
- ✅ Special characters handled (é, ñ, etc.)

---

## 9. Performance Testing

### 9.1 Load Testing

#### **Test Case 9.1.1: Concurrent Users**

**Objective:** Test system under 50 simultaneous users

**Steps:**
1. Use load testing tool (e.g., k6, JMeter)
2. Simulate 50 users processing BOQs simultaneously
3. Monitor:
   - Response times
   - Error rates
   - Server CPU/memory
   - Database connections

**Expected Results:**
- ✅ Average response time <3 seconds
- ✅ 95th percentile <5 seconds
- ✅ Error rate <0.1%
- ✅ No database connection pool exhaustion

---

### 9.2 Stress Testing

#### **Test Case 9.2.1: Maximum Capacity**

**Steps:**
1. Gradually increase concurrent users: 10, 25, 50, 100, 200
2. Find breaking point where errors >5%
3. Document maximum stable capacity

**Expected Results:**
- ✅ Supports 100+ concurrent users
- ✅ Graceful degradation (slower, not crashed)
- ✅ Auto-recovery after load spike

---

## 10. Security & Compliance Testing

### 10.1 Data Privacy (POPIA Compliance)

#### **Test Case 10.1.1: Personal Data Handling**

**Objective:** Verify POPIA compliance

**Steps:**
1. Register as supplier (collect personal data)
2. Verify consent checkboxes:
   - ✅ Terms of service
   - ✅ Privacy policy
   - ✅ Marketing communications (optional)
3. Check data storage:
   - Personal data encrypted at rest (if Supabase)
   - No sensitive data in browser console logs
   - No data shared with third parties without consent

**Expected Results:**
- ✅ Explicit consent obtained
- ✅ Privacy policy accessible
- ✅ User can request data deletion
- ✅ Audit trail of consent captured

---

### 10.2 Authentication Security

#### **Test Case 10.2.1: Password Strength**

**Steps:**
1. Try registering with weak password: "123456"
2. Check error: "Password must be 8+ characters, uppercase, lowercase, number"
3. Register with strong password: "Qilly@2026!"
4. Verify accepted

**Expected Results:**
- ✅ Weak passwords rejected
- ✅ Password hashed (never stored plaintext)
- ✅ Login lockout after 5 failed attempts

---

### 10.3 SQL Injection Testing

#### **Test Case 10.3.1: Input Sanitization**

**Steps:**
1. Try SQL injection in search field: `' OR '1'='1`
2. Try in BOQ item description: `"; DROP TABLE suppliers; --`
3. Verify no database queries executed

**Expected Results:**
- ✅ Inputs sanitized
- ✅ Parameterized queries used (no string concatenation)
- ✅ No error messages revealing database structure

---

## 11. Test Results Documentation

### 11.1 Test Report Template

```
QILLY SYSTEM TEST REPORT
Date: [YYYY-MM-DD]
Tester: [Name]
Environment: [Demo / Production]
Browser: [Chrome 120 / Firefox 115 / Safari 17]

SUMMARY:
- Total Test Cases: 75
- Passed: 72 (96%)
- Failed: 2 (3%)
- Blocked: 1 (1%)

CRITICAL FAILURES:
1. [Test Case ID] - [Description] - [Impact]

MINOR ISSUES:
1. [Test Case ID] - [Description] - [Workaround]

RECOMMENDATIONS:
1. Fix critical failures before DHS demo
2. Optimize BOQ processing speed (currently 6s, target <5s)
3. Add more supplier data for realistic testing

SIGN-OFF:
Tester: ________________  Date: __________
QA Lead: _______________  Date: __________
Project Manager: _______ Date: __________
```

---

### 11.2 Defect Report Template

```
DEFECT REPORT #001

Title: [Brief description]
Severity: [Critical / High / Medium / Low]
Priority: [P1 / P2 / P3 / P4]
Status: [New / In Progress / Fixed / Closed]

Environment:
- Browser: Chrome 120
- OS: Windows 11
- Mode: Demo

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshot: [Attach]
Console Log: [Attach]

Assigned To: [Developer name]
Reporter: [Tester name]
Date Reported: [YYYY-MM-DD]
```

---

## 12. Appendices

### Appendix A: Test Data Files

- `/test-data/sample-boq-20-units.csv` - Small housing project
- `/test-data/sample-boq-100-units.csv` - Medium housing project
- `/test-data/sample-boq-500-units.csv` - Large housing project
- `/test-data/sample-boq-commercial.csv` - Office building
- `/test-data/supplier-price-list-template.csv` - Bulk upload template

### Appendix B: Compliance References

- **NHBRC:** https://www.nhbrc.org.za/fee-schedule-2024/
- **CIDB:** https://www.cidb.org.za/contractor-grading/
- **SANS Standards:** https://www.sabs.co.za
- **BBBEE Codes:** DTI Gazette 2019
- **POPIA:** Information Regulator SA

### Appendix C: Contact Information

**Qilly Support:**
- Email: support@qilly.co.za
- Phone: 010 900 1234
- Hours: Mon-Fri 08:00-17:00 SAST

**DHS Contact:**
- Project Manager: [Name]
- Email: [email]
- Phone: [phone]

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-18 | Qilly QA Team | Initial release - comprehensive test guide for all features |

---

**END OF DOCUMENT**
