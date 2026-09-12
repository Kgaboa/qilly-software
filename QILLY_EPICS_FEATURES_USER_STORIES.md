# Qilly Product Backlog: Epics, Features & User Stories
## Complete Agile Development Specification

**Document Version:** 1.0  
**Date:** March 2, 2026  
**Purpose:** Comprehensive product backlog for all Qilly dashboards and features  
**Methodology:** Agile/Scrum with Epics → Features → User Stories hierarchy

---

## 📋 Table of Contents

1. [Epic Overview](#epic-overview)
2. [Epic 1: User Authentication & Authorization](#epic-1-user-authentication--authorization)
3. [Epic 2: BOQ Upload & Processing](#epic-2-boq-upload--processing)
4. [Epic 3: Pricing Engine & Calculation](#epic-3-pricing-engine--calculation)
5. [Epic 4: Regional & Provincial Optimization](#epic-4-regional--provincial-optimization)
6. [Epic 5: Compliance & Regulatory](#epic-5-compliance--regulatory)
7. [Epic 6: Supplier Management](#epic-6-supplier-management)
8. [Epic 7: Contractor Management](#epic-7-contractor-management)
9. [Epic 8: Admin Dashboard & Operations](#epic-8-admin-dashboard--operations)
10. [Epic 9: Reporting & Export](#epic-9-reporting--export)
11. [Epic 10: Payment & Subscription](#epic-10-payment--subscription)
12. [Epic 11: Multi-Environment Management](#epic-11-multi-environment-management)
13. [Story Point Estimation Guide](#story-point-estimation-guide)
14. [Acceptance Criteria Templates](#acceptance-criteria-templates)

---

## Epic Overview

### Epic Hierarchy

```
EPIC (High-level business capability)
├── FEATURE (User-facing functionality)
│   ├── USER STORY (Specific user need)
│   │   ├── Acceptance Criteria
│   │   ├── Story Points
│   │   └── Dependencies
```

### Priority Levels
- **P0 (Critical):** Must have for launch
- **P1 (High):** Essential for full functionality
- **P2 (Medium):** Important but can be phased
- **P3 (Low):** Nice to have, future enhancement

---

## Epic 1: User Authentication & Authorization

**Epic ID:** E-001  
**Epic Statement:** As a Qilly platform, I need to securely authenticate and authorize different user types (government users, contractors, suppliers, admins) so that each user has appropriate access to their relevant features and data.  
**Business Value:** Security, data protection, role-based access control  
**Priority:** P0 (Critical)

---

### Feature 1.1: Government User Authentication

**Feature ID:** F-001-001  
**Description:** Government users can register, log in, and access their dashboard

#### User Story 1.1.1: Government User Registration
**Story ID:** US-001-001-001  
**As a:** Government procurement officer  
**I want to:** Register for a Qilly account using my official government email  
**So that:** I can access BOQ pricing services

**Acceptance Criteria:**
- [ ] User can access registration form from landing page
- [ ] System validates email format (must be government domain: .gov.za)
- [ ] System requires: Full Name, Email, Department, Password (min 8 chars, 1 uppercase, 1 number)
- [ ] Password strength indicator visible
- [ ] Terms & Conditions checkbox required
- [ ] Email verification sent after registration
- [ ] User redirected to "Check your email" page
- [ ] Error messages displayed for invalid inputs

**Story Points:** 5  
**Priority:** P0  
**Dependencies:** None  
**Technical Notes:** Use Supabase Auth, integrate POPIA compliance consent

---

#### User Story 1.1.2: Government User Login
**Story ID:** US-001-001-002  
**As a:** Registered government user  
**I want to:** Log in to my Qilly account  
**So that:** I can access my dashboard and price BOQs

**Acceptance Criteria:**
- [ ] User can access login form
- [ ] System accepts email and password
- [ ] System validates credentials against Supabase Auth
- [ ] Successful login redirects to Main Dashboard
- [ ] Failed login shows error: "Invalid email or password"
- [ ] "Forgot Password" link visible
- [ ] Session persists (user stays logged in for 24 hours)
- [ ] Logout button available on dashboard

**Story Points:** 3  
**Priority:** P0  
**Dependencies:** US-001-001-001  
**Technical Notes:** Use sessionStorage for token persistence

---

#### User Story 1.1.3: Password Reset
**Story ID:** US-001-001-003  
**As a:** Government user who forgot password  
**I want to:** Reset my password via email  
**So that:** I can regain access to my account

**Acceptance Criteria:**
- [ ] "Forgot Password" link on login page
- [ ] User enters email address
- [ ] System sends password reset email
- [ ] Email contains secure reset link (expires in 1 hour)
- [ ] User can set new password
- [ ] Password strength validation applied
- [ ] Success message shown
- [ ] User redirected to login page

**Story Points:** 5  
**Priority:** P1  
**Dependencies:** US-001-001-002  
**Technical Notes:** Use Supabase password reset flow

---

### Feature 1.2: Contractor Authentication

**Feature ID:** F-001-002  
**Description:** Contractors can register, await approval, and access contractor-specific features

#### User Story 1.2.1: Contractor Registration
**Story ID:** US-001-002-001  
**As a:** Construction contractor  
**I want to:** Register for a contractor account  
**So that:** I can access BOQ templates and pricing tools

**Acceptance Criteria:**
- [ ] Contractor signup form accessible from main auth page
- [ ] Required fields: Company Name, CIDB Number, CIDB Grade, Contact Person, Email, Phone, Physical Address, Operating Provinces (multi-select), Annual Turnover, BBBEE Level, Tax Clearance, CIDB Certificate upload
- [ ] System validates CIDB number format (e.g., CIDB1234567/A)
- [ ] File upload for Tax Clearance Certificate (PDF, max 5MB)
- [ ] File upload for CIDB Certificate (PDF, max 5MB)
- [ ] Multi-select for Operating Provinces (all 9 provinces)
- [ ] Status automatically set to "pending" after submission
- [ ] Confirmation message: "Application submitted. Admin will review within 24 hours."
- [ ] Email notification sent to admin
- [ ] Data stored in Supabase `contractors` table

**Story Points:** 8  
**Priority:** P0  
**Dependencies:** None  
**Technical Notes:** File uploads to Supabase Storage, RLS policies for security

---

#### User Story 1.2.2: Contractor Approval Workflow
**Story ID:** US-001-002-002  
**As an:** Admin  
**I want to:** Review and approve/reject contractor applications  
**So that:** Only verified contractors access the platform

**Acceptance Criteria:**
- [ ] Admin sees "Contractors" tab in Admin Dashboard
- [ ] Pending contractors highlighted with orange badge
- [ ] Admin can view contractor details (company info, CIDB cert, tax clearance)
- [ ] Admin can download uploaded certificates
- [ ] Admin can click "Approve" or "Reject" with reason
- [ ] Status updated to "approved" or "rejected" in database
- [ ] Email notification sent to contractor
- [ ] Approved contractors can log in and access features
- [ ] Rejected contractors see rejection message on login attempt

**Story Points:** 8  
**Priority:** P0  
**Dependencies:** US-001-002-001  
**Technical Notes:** Email templates for approval/rejection

---

### Feature 1.3: Supplier Authentication

**Feature ID:** F-001-003  
**Description:** Suppliers can register and manage their product catalogs

#### User Story 1.3.1: Supplier Registration
**Story ID:** US-001-003-001  
**As a:** Building materials supplier  
**I want to:** Register my company on Qilly  
**So that:** My products appear in BOQ pricing calculations

**Acceptance Criteria:**
- [ ] Supplier signup form accessible
- [ ] Required fields: Company Name, Registration Number, Contact Person, Email, Phone, Physical Address, Province, Category (Cement/Aggregates/Steel/Timber/etc.), API Access (Yes/No), Website URL
- [ ] Multi-select for product categories
- [ ] Optional API endpoint URL field
- [ ] Optional API key field (masked input)
- [ ] Terms of Service acceptance
- [ ] Status set to "pending"
- [ ] Admin notification email sent
- [ ] Confirmation message displayed

**Story Points:** 8  
**Priority:** P1  
**Dependencies:** None  
**Technical Notes:** Secure API key storage with encryption

---

#### User Story 1.3.2: Supplier Approval & API Setup
**Story ID:** US-001-003-002  
**As an:** Admin  
**I want to:** Approve suppliers and configure their API integration  
**So that:** Their products sync correctly into Qilly

**Acceptance Criteria:**
- [ ] Admin sees "Suppliers" tab
- [ ] Pending suppliers visible
- [ ] Admin can view supplier details
- [ ] Admin can test API connection (if provided)
- [ ] Admin can approve/reject with reason
- [ ] Approved suppliers receive login credentials
- [ ] API sync scheduled (if API enabled)
- [ ] Manual catalog upload option (if no API)

**Story Points:** 13  
**Priority:** P1  
**Dependencies:** US-001-003-001  
**Technical Notes:** API testing framework, error handling

---

### Feature 1.4: Admin Authentication

**Feature ID:** F-001-004  
**Description:** Super admin access for platform management

#### User Story 1.4.1: Admin Login
**Story ID:** US-001-004-001  
**As a:** Qilly platform administrator  
**I want to:** Log in to the admin dashboard  
**So that:** I can manage users, suppliers, and system settings

**Acceptance Criteria:**
- [ ] "Admin Login" link on main auth page
- [ ] Separate admin login form
- [ ] Admin credentials validated (hardcoded or from secure admin table)
- [ ] MFA option available (future enhancement)
- [ ] Successful login shows Admin Dashboard
- [ ] Session tracked separately from user sessions
- [ ] Logout clears admin session

**Story Points:** 5  
**Priority:** P0  
**Dependencies:** None  
**Technical Notes:** Admin users stored in secure `admins` table with hashed passwords

---

## Epic 2: BOQ Upload & Processing

**Epic ID:** E-002  
**Epic Statement:** As a government user, I need to upload BOQ files in various formats and have them automatically parsed and validated so that I can proceed to pricing.  
**Business Value:** Core functionality, ease of use, accuracy  
**Priority:** P0 (Critical)

---

### Feature 2.1: Excel BOQ Upload

**Feature ID:** F-002-001  
**Description:** Users can drag-and-drop or browse to upload Excel BOQ files

#### User Story 2.1.1: Excel File Upload
**Story ID:** US-002-001-001  
**As a:** Government user  
**I want to:** Upload my Excel BOQ file  
**So that:** The system can process and price it

**Acceptance Criteria:**
- [ ] Upload area visible on Main Dashboard
- [ ] Drag-and-drop functionality works
- [ ] "Browse Files" button available
- [ ] Accepted formats: .xlsx, .xls, .csv
- [ ] File size limit: 10MB
- [ ] File name displayed after selection
- [ ] "Remove" button to clear selection
- [ ] Error message for invalid file types
- [ ] Error message for oversized files
- [ ] Loading indicator during upload

**Story Points:** 5  
**Priority:** P0  
**Dependencies:** US-001-001-002 (user must be logged in)  
**Technical Notes:** Use `xlsx` library for parsing

---

#### User Story 2.1.2: BOQ Parsing & Column Detection
**Story ID:** US-002-001-002  
**As a:** System  
**I want to:** Automatically detect BOQ columns (Item No, Description, Unit, Quantity)  
**So that:** Users don't need to manually map columns

**Acceptance Criteria:**
- [ ] System reads Excel file using `xlsx` library
- [ ] System searches for column headers: "Item", "Description", "Unit", "Quantity", "Rate", "Amount"
- [ ] System handles variations: "Item No", "Item Number", "Qty", "UOM"
- [ ] System displays preview table (first 10 rows)
- [ ] User can confirm or manually adjust column mapping
- [ ] System validates: at least "Description" and "Quantity" present
- [ ] Error message if required columns missing
- [ ] "Continue to Pricing" button enabled after validation

**Story Points:** 8  
**Priority:** P0  
**Dependencies:** US-002-001-001  
**Technical Notes:** Case-insensitive matching, trim whitespace

---

#### User Story 2.1.3: Data Validation & Error Handling
**Story ID:** US-002-001-003  
**As a:** System  
**I want to:** Validate BOQ data for errors  
**So that:** Pricing calculations are accurate

**Acceptance Criteria:**
- [ ] Validate Quantity: must be numeric, > 0
- [ ] Validate Unit: must be recognized (m², m³, m, kg, no, etc.)
- [ ] Flag blank descriptions
- [ ] Flag negative quantities
- [ ] Show error summary: "3 rows have invalid data"
- [ ] Highlight invalid rows in preview table
- [ ] User can choose: "Skip invalid rows" or "Cancel and fix file"
- [ ] System proceeds only with valid rows

**Story Points:** 8  
**Priority:** P1  
**Dependencies:** US-002-001-002  
**Technical Notes:** Unit conversion library for different unit formats

---

### Feature 2.2: BOQ Template Library

**Feature ID:** F-002-002  
**Description:** Pre-built templates for common project types

#### User Story 2.2.1: Browse Template Library
**Story ID:** US-002-002-001  
**As a:** Government user  
**I want to:** Browse pre-built BOQ templates  
**So that:** I can quickly start a project without uploading

**Acceptance Criteria:**
- [ ] "Template Library" tab on Main Dashboard
- [ ] Templates displayed as cards with icons
- [ ] Categories: RDP Housing, Social Housing, Roads, Water & Sanitation, Schools, Clinics, Municipal Buildings
- [ ] Each card shows: Template name, Project type, Item count, Preview button
- [ ] Search bar to filter templates
- [ ] "Use This Template" button
- [ ] Template loaded into pricing engine

**Story Points:** 8  
**Priority:** P1  
**Dependencies:** US-001-001-002  
**Technical Notes:** Templates stored in `/src/utils/boqTemplates.ts`

---

#### User Story 2.2.2: Template Customization
**Story ID:** US-002-002-002  
**As a:** Government user  
**I want to:** Customize a template before pricing  
**So that:** It matches my specific project requirements

**Acceptance Criteria:**
- [ ] After selecting template, user sees editable table
- [ ] User can modify quantities
- [ ] User can add/remove rows
- [ ] User can adjust project location
- [ ] Changes auto-save to session
- [ ] "Price BOQ" button re-calculates with changes
- [ ] "Reset to Default" button available

**Story Points:** 13  
**Priority:** P2  
**Dependencies:** US-002-002-001  
**Technical Notes:** State management for edits

---

## Epic 3: Pricing Engine & Calculation

**Epic ID:** E-003  
**Epic Statement:** As a system, I need to match BOQ items to supplier products, calculate composite rates (material + labor + equipment), and generate accurate total costs so that users receive reliable pricing.  
**Business Value:** Core value proposition, accuracy, speed  
**Priority:** P0 (Critical)

---

### Feature 3.1: Product Matching

**Feature ID:** F-003-001  
**Description:** AI-powered matching of BOQ descriptions to supplier products

#### User Story 3.1.1: Fuzzy Matching Algorithm
**Story ID:** US-003-001-001  
**As a:** System  
**I want to:** Match BOQ item descriptions to supplier products using AI/fuzzy logic  
**So that:** Pricing is automatic and accurate

**Acceptance Criteria:**
- [ ] System extracts keywords from BOQ description
- [ ] System searches supplier database for matches
- [ ] Levenshtein distance algorithm applied
- [ ] Synonym dictionary used (e.g., "brickwork" → "clay brick", "masonry")
- [ ] Brand detection (e.g., "Sika waterproofing" → filter to Sika products)
- [ ] Confidence score calculated (0-100%)
- [ ] Matches above 70% auto-selected
- [ ] Matches 50-70% flagged for user review
- [ ] No matches (<50%) → use default rate from labor library

**Story Points:** 21  
**Priority:** P0  
**Dependencies:** Supplier database populated  
**Technical Notes:** Algorithm in `/src/utils/matching/enhancedItemMatcher.ts`

---

#### User Story 3.1.2: Manual Override
**Story ID:** US-003-001-002  
**As a:** Government user  
**I want to:** Manually select a different product if auto-match is incorrect  
**So that:** I have control over pricing accuracy

**Acceptance Criteria:**
- [ ] Each matched item shows "Change Product" button
- [ ] Clicking opens product selector modal
- [ ] Modal shows all products in same category
- [ ] User can search products
- [ ] User can filter by supplier
- [ ] Selecting new product recalculates pricing
- [ ] Override logged in audit trail

**Story Points:** 8  
**Priority:** P1  
**Dependencies:** US-003-001-001  
**Technical Notes:** Update `processedBill` state reactively

---

### Feature 3.2: Composite Rate Calculation

**Feature ID:** F-003-002  
**Description:** Calculate material + labor + equipment + overheads

#### User Story 3.2.1: Material Cost Calculation
**Story ID:** US-003-002-001  
**As a:** System  
**I want to:** Calculate material cost from supplier pricing  
**So that:** Material component is accurate

**Acceptance Criteria:**
- [ ] System retrieves matched product unit price
- [ ] System multiplies: Unit Price × Quantity
- [ ] System applies any bulk discounts (if quantity > threshold)
- [ ] System adds transport cost (calculated separately)
- [ ] Material cost stored per item

**Story Points:** 5  
**Priority:** P0  
**Dependencies:** US-003-001-001  
**Technical Notes:** Discount tiers from supplier catalog

---

#### User Story 3.2.2: Labor Cost Calculation
**Story ID:** US-003-002-002  
**As a:** System  
**I want to:** Apply labor rates from BuildAid/industry standards  
**So that:** Labor costs are realistic

**Acceptance Criteria:**
- [ ] System matches BOQ item to labor category (e.g., "Excavation" → "Plant Operator")
- [ ] System retrieves labor rate from labor_rates table or mock data
- [ ] System calculates: Labor Rate × Quantity × Hours per Unit
- [ ] Different rates for skilled/unskilled labor
- [ ] Provincial variations applied (higher labor rates in metros)
- [ ] Labor cost stored per item

**Story Points:** 8  
**Priority:** P0  
**Dependencies:** Labor rates library implemented  
**Technical Notes:** 144 labor rates in `/src/lib/boq/laborRates.ts`

---

#### User Story 3.2.3: Equipment Cost Calculation
**Story ID:** US-003-002-003  
**As a:** System  
**I want to:** Calculate equipment hire/usage costs  
**So that:** Total cost includes machinery

**Acceptance Criteria:**
- [ ] System identifies equipment-heavy items (excavation, concrete, piling)
- [ ] System retrieves equipment rates from equipment hire suppliers
- [ ] System calculates: Equipment Rate × Usage Time
- [ ] Equipment cost stored per item
- [ ] Zero equipment cost for manual tasks (bricklaying, painting)

**Story Points:** 8  
**Priority:** P1  
**Dependencies:** Equipment hire supplier data  
**Technical Notes:** 8 equipment hire suppliers integrated

---

#### User Story 3.2.4: Overheads & Profit (OH&P)
**Story ID:** US-003-002-004  
**As a:** System  
**I want to:** Apply contractor overheads and profit margin  
**So that:** Pricing reflects market reality

**Acceptance Criteria:**
- [ ] System applies 10-15% OH&P to total cost
- [ ] OH&P percentage configurable in project settings
- [ ] Different OH&P for different project types (RDP: 10%, Commercial: 15%)
- [ ] OH&P shown separately in breakdown
- [ ] User can adjust OH&P percentage

**Story Points:** 5  
**Priority:** P1  
**Dependencies:** US-003-002-001, US-003-002-002, US-003-002-003  
**Technical Notes:** Default OH&P stored in project settings

---

### Feature 3.3: Total Cost Summary

**Feature ID:** F-003-003  
**Description:** Aggregate all costs and display total project cost

#### User Story 3.3.1: Cost Breakdown Display
**Story ID:** US-003-003-001  
**As a:** Government user  
**I want to:** See a detailed cost breakdown  
**So that:** I understand where costs come from

**Acceptance Criteria:**
- [ ] Dashboard shows summary cards:
  - Total Project Cost (large, prominent)
  - Materials Subtotal
  - Labor Subtotal
  - Equipment Subtotal
  - Overheads & Profit
  - Compliance Costs (NHBRC, etc.)
- [ ] Each card shows percentage of total
- [ ] Cards clickable to expand details
- [ ] Donut chart visualization of breakdown
- [ ] Export breakdown to Excel/PDF

**Story Points:** 8  
**Priority:** P0  
**Dependencies:** US-003-002-004  
**Technical Notes:** Use Recharts for visualization

---

## Epic 4: Regional & Provincial Optimization

**Epic ID:** E-004  
**Epic Statement:** As a government user, I need BOQ pricing optimized for my specific province and municipality, including transport costs from nearest suppliers, so that I get the most competitive local pricing.  
**Business Value:** Cost savings, regional equity, supplier diversity  
**Priority:** P0 (Critical)

---

### Feature 4.1: Provincial Pricing Factors

**Feature ID:** F-004-001  
**Description:** Apply province-specific price adjustments

#### User Story 4.1.1: Province Selection
**Story ID:** US-004-001-001  
**As a:** Government user  
**I want to:** Select my project province  
**So that:** Pricing reflects local market conditions

**Acceptance Criteria:**
- [ ] "Project Location" dropdown on upload page
- [ ] All 9 provinces listed: GP, WC, KZN, EC, LP, MP, NC, NW, FS
- [ ] Default to user's province (from profile)
- [ ] Province selection affects all calculations
- [ ] Province displayed in results summary

**Story Points:** 3  
**Priority:** P0  
**Dependencies:** User logged in  
**Technical Notes:** Province codes standardized

---

#### User Story 4.1.2: Provincial Price Factors
**Story ID:** US-004-001-002  
**As a:** System  
**I want to:** Apply province-specific price multipliers  
**So that:** Pricing reflects regional variations

**Acceptance Criteria:**
- [ ] Base provinces (1.0x): GP, WC, KZN
- [ ] Moderate provinces (1.08x): EC, FS, NW
- [ ] Remote provinces (1.15x): LP, MP, NC
- [ ] Factors applied to material costs only
- [ ] Labor and equipment use separate factors
- [ ] Factors stored in database table `provincial_pricing_factors`
- [ ] Admin can adjust factors

**Story Points:** 8  
**Priority:** P0  
**Dependencies:** US-004-001-001  
**Technical Notes:** SQL in `/src/utils/sql/provincial_pricing_factors.sql`

---

### Feature 4.2: Transport Cost Optimization

**Feature ID:** F-004-002  
**Description:** Calculate and minimize transport costs based on supplier distance

#### User Story 4.2.1: Distance Calculation
**Story ID:** US-004-002-001  
**As a:** System  
**I want to:** Calculate distance from project site to each supplier  
**So that:** I can determine transport costs

**Acceptance Criteria:**
- [ ] System uses GPS coordinates (lat/long) for project site
- [ ] System retrieves supplier branch coordinates from database
- [ ] Haversine formula calculates straight-line distance
- [ ] Distance converted to road distance (multiply by 1.2)
- [ ] Distance displayed in kilometers

**Story Points:** 8  
**Priority:** P1  
**Dependencies:** Supplier branches with GPS coordinates  
**Technical Notes:** Algorithm in `/src/utils/regionalOptimization.ts`

---

#### User Story 4.2.2: Transport Cost Calculation
**Story ID:** US-004-002-002  
**As a:** System  
**I want to:** Calculate transport cost based on distance, volume, and fuel price  
**So that:** Total landed cost includes delivery

**Acceptance Criteria:**
- [ ] Formula: (Distance × Fuel Rate × Volume Factor) / Load Capacity
- [ ] Fuel rate: R20/km (configurable)
- [ ] Volume factor based on product weight/bulk
- [ ] Load capacity: 10 tons (standard truck)
- [ ] Minimum charge: R350 (even for local delivery)
- [ ] Transport cost added to material cost
- [ ] Breakdown shows: "Material: R10,000 + Transport: R1,200 = R11,200"

**Story Points:** 13  
**Priority:** P1  
**Dependencies:** US-004-002-001  
**Technical Notes:** Transport cost formula validated against industry standards

---

#### User Story 4.2.3: Nearest Supplier Recommendation
**Story ID:** US-004-002-003  
**As a:** Government user  
**I want to:** See which supplier is nearest for each item  
**So that:** I minimize transport costs

**Acceptance Criteria:**
- [ ] System sorts suppliers by distance (nearest first)
- [ ] System highlights "Nearest Supplier" badge
- [ ] System shows alternative suppliers with higher transport costs
- [ ] User can switch to alternative supplier if preferred
- [ ] Total cost updates with transport recalculation
- [ ] Audit trail logs supplier selection changes

**Story Points:** 8  
**Priority:** P2  
**Dependencies:** US-004-002-002  
**Technical Notes:** Visual indicator (green badge) for optimal choice

---

### Feature 4.3: Municipality Integration

**Feature ID:** F-004-003  
**Description:** Pre-populate municipality data for project location

#### User Story 4.3.1: Municipality Dropdown
**Story ID:** US-004-003-001  
**As a:** Government user  
**I want to:** Select my municipality from a dropdown  
**So that:** Location is accurate and granular

**Acceptance Criteria:**
- [ ] After selecting province, municipality dropdown populates
- [ ] Municipalities filtered by selected province
- [ ] All 257 SA municipalities available
- [ ] Search functionality in dropdown
- [ ] GPS coordinates auto-assigned based on municipality
- [ ] User can override with custom GPS if needed

**Story Points:** 8  
**Priority:** P1  
**Dependencies:** US-004-001-001  
**Technical Notes:** Municipality data in `/src/utils/regionalOptimization.ts`

---

## Epic 5: Compliance & Regulatory

**Epic ID:** E-005  
**Epic Statement:** As a government department, I need automatic compliance checking against SANS 1200, NBR, AGRÉMENT, NHBRC, and CIDB standards so that all BOQs meet regulatory requirements.  
**Business Value:** Risk mitigation, legal compliance, audit readiness  
**Priority:** P0 (Critical)

---

### Feature 5.1: SANS 1200 Compliance

**Feature ID:** F-005-001  
**Description:** Validate BOQ items against SANS 1200 standards

#### User Story 5.1.1: SANS Code Matching
**Story ID:** US-005-001-001  
**As a:** System  
**I want to:** Match each BOQ item to its SANS 1200 code  
**So that:** Compliance is automatically verified

**Acceptance Criteria:**
- [ ] System searches BOQ description for SANS keywords
- [ ] System assigns SANS code (e.g., "SANS 1200 DB: Brickwork")
- [ ] System flags items without SANS match
- [ ] User can manually assign SANS code
- [ ] Compliance status shown: ✅ Compliant or ⚠️ Needs Review
- [ ] Compliance report generated

**Story Points:** 13  
**Priority:** P0  
**Dependencies:** SANS 1200 database  
**Technical Notes:** SANS codes stored in reference table

---

### Feature 5.2: NHBRC Fee Calculation

**Feature ID:** F-005-002  
**Description:** Calculate mandatory NHBRC enrollment fees for housing projects

#### User Story 5.2.1: NHBRC Fee Auto-Calculation
**Story ID:** US-005-002-001  
**As a:** System  
**I want to:** Automatically calculate NHBRC fees based on project value  
**So that:** Government budgets include compliance costs

**Acceptance Criteria:**
- [ ] System detects housing project type (RDP, Social Housing, FLISP)
- [ ] System applies NHBRC formula: (Project Value × 1.5%) + R250 per unit
- [ ] Minimum fee: R5,000
- [ ] Maximum fee: R2 million
- [ ] Fee added to "Compliance Costs" section
- [ ] Breakdown shows: "NHBRC Enrollment: R45,000"
- [ ] User can view NHBRC fee schedule

**Story Points:** 8  
**Priority:** P0  
**Dependencies:** Project type identification  
**Technical Notes:** Algorithm in `/src/utils/complianceCalculations.ts`

---

### Feature 5.3: BBBEE Tracking

**Feature ID:** F-005-003  
**Description:** Track BBBEE levels of all suppliers and calculate spend

#### User Story 5.3.1: Supplier BBBEE Display
**Story ID:** US-005-003-001  
**As a:** Government user  
**I want to:** See BBBEE levels of all suppliers in my BOQ  
**So that:** I can meet transformation targets

**Acceptance Criteria:**
- [ ] Each supplier shows BBBEE level (1-8 or Non-Compliant)
- [ ] BBBEE badge color-coded: Green (1-4), Yellow (5-6), Red (7-8)
- [ ] Summary card shows: "68% spend with Level 1-4 suppliers"
- [ ] Breakdown by BBBEE level
- [ ] Warning if <50% spend with Level 1-4
- [ ] Export BBBEE report for tender documentation

**Story Points:** 8  
**Priority:** P1  
**Dependencies:** Supplier BBBEE data in database  
**Technical Notes:** BBBEE levels updated quarterly

---

## Epic 6: Supplier Management

**Epic ID:** E-006  
**Epic Statement:** As a Qilly admin, I need to manage supplier registrations, API integrations, product catalogs, and pricing data so that the platform has accurate, up-to-date supplier information.  
**Business Value:** Data accuracy, supplier diversity, platform credibility  
**Priority:** P1 (High)

---

### Feature 6.1: Supplier Registration & Approval

**Feature ID:** F-006-001  
**Description:** Suppliers apply and get approved by admin

*(User Stories already covered in Epic 1, Feature 1.3)*

---

### Feature 6.2: Supplier Product Catalog Management

**Feature ID:** F-006-002  
**Description:** Manage supplier product listings, prices, and stock

#### User Story 6.2.1: Manual Product Upload
**Story ID:** US-006-002-001  
**As a:** Supplier  
**I want to:** Manually upload my product catalog via Excel  
**So that:** My products appear in Qilly pricing

**Acceptance Criteria:**
- [ ] Supplier dashboard has "Upload Catalog" button
- [ ] Excel template provided (Product Name, SKU, Category, Unit, Price, Stock Status)
- [ ] Supplier uploads filled template
- [ ] System validates data (price > 0, unit recognized)
- [ ] System imports products to `supplier_products` table
- [ ] Confirmation message: "450 products imported successfully"
- [ ] Products immediately available in pricing engine

**Story Points:** 13  
**Priority:** P1  
**Dependencies:** Supplier approved  
**Technical Notes:** Excel parsing with `xlsx` library

---

#### User Story 6.2.2: API-Based Product Sync
**Story ID:** US-006-002-002  
**As an:** Admin  
**I want to:** Schedule automatic product syncs from supplier APIs  
**So that:** Product data is always current

**Acceptance Criteria:**
- [ ] Admin configures API endpoint and authentication
- [ ] System tests API connection
- [ ] Successful test enables "Schedule Sync" option
- [ ] Admin sets sync frequency (daily, weekly, on-demand)
- [ ] System calls API at scheduled time
- [ ] System maps API response to standard product schema
- [ ] System updates prices, stock status
- [ ] Sync log shows: "Last sync: 2 hours ago, 1,234 products updated"
- [ ] Errors logged and admin notified

**Story Points:** 21  
**Priority:** P1  
**Dependencies:** Supplier API documentation  
**Technical Notes:** API fetcher in `/src/utils/suppliers/product-fetchers/`

---

### Feature 6.3: Supplier Performance Analytics

**Feature ID:** F-006-003  
**Description:** Track supplier usage, pricing competitiveness, and reliability

#### User Story 6.3.1: Supplier Usage Dashboard
**Story ID:** US-006-003-001  
**As an:** Admin  
**I want to:** See which suppliers are most used in BOQ pricing  
**So that:** I understand supplier value and can optimize partnerships

**Acceptance Criteria:**
- [ ] Admin dashboard shows "Supplier Analytics" tab
- [ ] Table lists all suppliers with metrics:
  - Times used in BOQs
  - Total value priced
  - Average competitiveness (% times cheapest)
  - Last sync date
- [ ] Sortable by each metric
- [ ] Chart shows top 10 suppliers by usage
- [ ] Export analytics to PDF

**Story Points:** 13  
**Priority:** P2  
**Dependencies:** BOQ pricing data logged  
**Technical Notes:** Analytics calculated from pricing history

---

## Epic 7: Contractor Management

**Epic ID:** E-007  
**Epic Statement:** As a contractor, I need to access BOQ templates, customize them for my projects, and download priced BOQs so that I can submit accurate tenders.  
**Business Value:** Market expansion, contractor enablement, recurring revenue  
**Priority:** P1 (High)

---

### Feature 7.1: Contractor Dashboard

**Feature ID:** F-007-001  
**Description:** Contractor-specific dashboard with templates and pricing tools

#### User Story 7.1.1: Contractor Template Library Access
**Story ID:** US-007-001-001  
**As an:** Approved contractor  
**I want to:** Access BOQ templates relevant to my CIDB grade  
**So that:** I can prepare tenders for projects I'm qualified for

**Acceptance Criteria:**
- [ ] After login, contractor sees Template Library
- [ ] Templates filtered by CIDB grade:
  - Grade 1 (up to R200k): Basic templates only
  - Grade 9 (unlimited): All templates
- [ ] Templates show complexity indicator
- [ ] Contractor can preview template
- [ ] "Use Template" button loads editable BOQ
- [ ] Customization auto-saves

**Story Points:** 13  
**Priority:** P1  
**Dependencies:** US-001-002-002 (contractor approved)  
**Technical Notes:** Template access controlled by CIDB grade

---

#### User Story 7.1.2: Contractor BOQ Customization
**Story ID:** US-007-001-002  
**As a:** Contractor  
**I want to:** Customize template quantities and add/remove items  
**So that:** BOQ matches my specific project

**Acceptance Criteria:**
- [ ] Editable table view of BOQ
- [ ] Contractor can change quantities
- [ ] Contractor can add rows with custom descriptions
- [ ] Contractor can delete rows
- [ ] "Recalculate Pricing" button updates totals
- [ ] Changes stored in session (not in global templates)
- [ ] Warning if major deviations from template (>30% cost change)

**Story Points:** 13  
**Priority:** P1  
**Dependencies:** US-007-001-001  
**Technical Notes:** Session-based state management

---

### Feature 7.2: Contractor Pricing Tiers

**Feature ID:** F-007-002  
**Description:** Subscription-based pricing for contractor access

#### User Story 7.2.1: View Pricing Tiers
**Story ID:** US-007-002-001  
**As a:** Contractor  
**I want to:** See pricing tiers and features  
**So that:** I can choose the right plan

**Acceptance Criteria:**
- [ ] Pricing page shows 4 tiers:
  - **Starter** (R499/month): 5 BOQs/month, Grade 1-3 projects
  - **Professional** (R1,499/month): 20 BOQs/month, Grade 1-6 projects
  - **Enterprise** (R4,999/month): Unlimited BOQs, Grade 1-9 projects
  - **Custom** (Contact sales): Multi-user, API access
- [ ] Each tier shows features list
- [ ] "Select Plan" button for each tier
- [ ] Free 14-day trial available
- [ ] Comparison table highlights differences

**Story Points:** 8  
**Priority:** P1  
**Dependencies:** None  
**Technical Notes:** Tiers in `/src/app/components/ContractorPricingTiers.tsx`

---

#### User Story 7.2.2: Subscription Upgrade/Downgrade
**Story ID:** US-007-002-002  
**As a:** Contractor  
**I want to:** Upgrade or downgrade my subscription  
**So that:** I pay only for what I need

**Acceptance Criteria:**
- [ ] "Manage Subscription" button in contractor dashboard
- [ ] Modal shows current plan and usage
- [ ] Upgrade options available
- [ ] Downgrade allowed (effective next billing cycle)
- [ ] Prorated billing calculated
- [ ] Payment processed via PayFast/EFT
- [ ] Confirmation email sent
- [ ] New plan features immediately active (upgrade) or scheduled (downgrade)

**Story Points:** 13  
**Priority:** P2  
**Dependencies:** Payment integration  
**Technical Notes:** Subscription management in Supabase `subscriptions` table

---

## Epic 8: Admin Dashboard & Operations

**Epic ID:** E-008  
**Epic Statement:** As a Qilly admin, I need comprehensive tools to manage users, suppliers, contractors, database, billing, and system settings so that the platform operates smoothly.  
**Business Value:** Operational efficiency, system health, scalability  
**Priority:** P0 (Critical)

---

### Feature 8.1: User Management

**Feature ID:** F-008-001  
**Description:** View, approve, suspend, and delete users

#### User Story 8.1.1: View All Users
**Story ID:** US-008-001-001  
**As an:** Admin  
**I want to:** View all registered users  
**So that:** I can monitor platform adoption

**Acceptance Criteria:**
- [ ] "Users" tab in Admin Dashboard
- [ ] Table shows: Name, Email, Role (Government/Contractor/Supplier), Status, Registration Date
- [ ] Total user count displayed
- [ ] Pagination (50 users per page)
- [ ] Search by name or email
- [ ] Filter by role and status
- [ ] Click user row to view details

**Story Points:** 8  
**Priority:** P1  
**Dependencies:** Admin login  
**Technical Notes:** Query Supabase `auth.users` table

---

#### User Story 8.1.2: Suspend/Reactivate Users
**Story ID:** US-008-001-002  
**As an:** Admin  
**I want to:** Suspend or reactivate user accounts  
**So that:** I can manage access for policy violations

**Acceptance Criteria:**
- [ ] "Suspend" button on user detail page
- [ ] Admin enters suspension reason
- [ ] User status set to "suspended"
- [ ] Suspended users cannot log in (error message shown)
- [ ] Admin can reactivate with "Reactivate" button
- [ ] Audit log records suspension/reactivation

**Story Points:** 8  
**Priority:** P2  
**Dependencies:** US-008-001-001  
**Technical Notes:** Update Supabase Auth user metadata

---

### Feature 8.2: Database Inspector

**Feature ID:** F-008-002  
**Description:** Real-time view of database tables and records

#### User Story 8.2.1: Table Browser
**Story ID:** US-008-002-001  
**As an:** Admin  
**I want to:** Browse database tables  
**So that:** I can inspect data without SQL

**Acceptance Criteria:**
- [ ] "Database" tab in Admin Dashboard
- [ ] Dropdown lists all tables: users, contractors, suppliers, products, bills, etc.
- [ ] Selecting table shows record count
- [ ] Table data displayed in paginated grid
- [ ] Search and filter within table
- [ ] Export table to CSV

**Story Points:** 13  
**Priority:** P1  
**Dependencies:** Admin login  
**Technical Notes:** Component in `/src/app/components/DatabaseInspector.tsx`

---

#### User Story 8.2.2: Record Edit/Delete
**Story ID:** US-008-002-002  
**As an:** Admin  
**I want to:** Edit or delete records directly  
**So that:** I can fix data issues quickly

**Acceptance Criteria:**
- [ ] "Edit" button on each row
- [ ] Modal shows editable form
- [ ] Field validation applied
- [ ] "Save" updates record in database
- [ ] "Delete" button with confirmation dialog
- [ ] Audit log records changes
- [ ] Success/error toast notifications

**Story Points:** 13  
**Priority:** P2  
**Dependencies:** US-008-002-001  
**Technical Notes:** Direct Supabase RPC calls

---

### Feature 8.3: Billing & Payments Management

**Feature ID:** F-008-003  
**Description:** Track subscriptions, payments, and invoices

#### User Story 8.3.1: Subscription Overview
**Story ID:** US-008-003-001  
**As an:** Admin  
**I want to:** See all active subscriptions  
**So that:** I can monitor revenue and plan capacity

**Acceptance Criteria:**
- [ ] "Billing" tab in Admin Dashboard
- [ ] Summary cards:
  - Total Active Subscriptions
  - Monthly Recurring Revenue (MRR)
  - Churn Rate
  - Average Revenue Per User (ARPU)
- [ ] Table lists all subscriptions: User, Plan, Status, Next Billing Date, Amount
- [ ] Filter by plan tier
- [ ] Search by user
- [ ] Export to Excel

**Story Points:** 13  
**Priority:** P1  
**Dependencies:** Payment integration  
**Technical Notes:** Query `subscriptions` and `payments` tables

---

### Feature 8.4: System Settings

**Feature ID:** F-008-004  
**Description:** Configure platform-wide settings

#### User Story 8.4.1: Provincial Pricing Factor Configuration
**Story ID:** US-008-004-001  
**As an:** Admin  
**I want to:** Adjust provincial price multipliers  
**So that:** Pricing reflects current market conditions

**Acceptance Criteria:**
- [ ] "Settings" tab → "Provincial Pricing"
- [ ] Table shows all 9 provinces with current factors
- [ ] Admin can edit factor value (0.8x - 1.5x range)
- [ ] "Save Changes" button
- [ ] Changes effective immediately for new BOQ pricing
- [ ] Audit log records factor changes
- [ ] Confirmation message: "Provincial factors updated"

**Story Points:** 8  
**Priority:** P1  
**Dependencies:** Admin login  
**Technical Notes:** Update `provincial_pricing_factors` table

---

## Epic 9: Reporting & Export

**Epic ID:** E-009  
**Epic Statement:** As a government user, I need to export BOQ pricing results to PDF, Excel, and Word formats with government-compliant formatting so that I can use them in tender documentation.  
**Business Value:** Usability, audit compliance, procurement workflow  
**Priority:** P0 (Critical)

---

### Feature 9.1: PDF Export

**Feature ID:** F-009-001  
**Description:** Generate government-formatted PDF reports

#### User Story 9.1.1: BOQ PDF Export
**Story ID:** US-009-001-001  
**As a:** Government user  
**I want to:** Export priced BOQ as PDF  
**So that:** I can include it in tender documentation

**Acceptance Criteria:**
- [ ] "Export to PDF" button on results page
- [ ] PDF includes:
  - Government department header
  - Project details (name, location, date)
  - Itemized BOQ table (Item No, Description, Unit, Qty, Rate, Amount)
  - Subtotals by section
  - Total project cost (prominent)
  - Compliance summary
  - BBBEE breakdown
  - Audit trail (who priced, when)
- [ ] PDF formatted per government standards (A4, margins, fonts)
- [ ] Download as `BOQ_ProjectName_Date.pdf`
- [ ] Generation takes <5 seconds

**Story Points:** 13  
**Priority:** P0  
**Dependencies:** Pricing completed  
**Technical Notes:** Use `jspdf` and `jspdf-autotable`

---

### Feature 9.2: Excel Export

**Feature ID:** F-009-002  
**Description:** Export detailed pricing breakdowns to Excel

#### User Story 9.2.1: Excel Export with Formulas
**Story ID:** US-009-002-001  
**As a:** Government user  
**I want to:** Export BOQ to Excel with live formulas  
**So that:** I can make adjustments in Excel

**Acceptance Criteria:**
- [ ] "Export to Excel" button
- [ ] Excel file includes multiple sheets:
  - **Summary**: Total cost, breakdown, charts
  - **BOQ**: Itemized pricing with formulas
  - **Materials**: Material costs by supplier
  - **Labor**: Labor breakdown
  - **Compliance**: NHBRC, SANS, BBBEE details
- [ ] Formulas active (user can change quantity → total recalculates)
- [ ] Formatted with colors, borders, headers
- [ ] Download as `BOQ_ProjectName_Date.xlsx`

**Story Points:** 13  
**Priority:** P0  
**Dependencies:** Pricing completed  
**Technical Notes:** Use `xlsx` library

---

### Feature 9.3: Compliance Documents

**Feature ID:** F-009-003  
**Description:** Generate compliance certificates and reports

#### User Story 9.3.1: NHBRC Enrollment Form
**Story ID:** US-009-003-001  
**As a:** Government user  
**I want to:** Generate pre-filled NHBRC enrollment form  
**So that:** I can submit it with tender

**Acceptance Criteria:**
- [ ] "Generate Compliance Docs" button
- [ ] System generates NHBRC enrollment form (PDF)
- [ ] Pre-filled with project details
- [ ] Fee amount calculated and shown
- [ ] Instructions for submission included
- [ ] Download as `NHBRC_Enrollment_ProjectName.pdf`

**Story Points:** 13  
**Priority:** P1  
**Dependencies:** NHBRC fee calculation  
**Technical Notes:** Use `docx` library, convert to PDF

---

## Epic 10: Payment & Subscription

**Epic ID:** E-010  
**Epic Statement:** As a contractor or supplier, I need to subscribe and pay for platform access via multiple payment methods so that I can use Qilly services.  
**Business Value:** Revenue generation, cash flow, scalability  
**Priority:** P1 (High)

---

### Feature 10.1: Payment Gateway Integration

**Feature ID:** F-010-001  
**Description:** Integrate PayFast, EFT, and manual payment options

#### User Story 10.1.1: PayFast Payment
**Story ID:** US-010-001-001  
**As a:** Contractor  
**I want to:** Pay subscription via PayFast  
**So that:** I can use credit card/instant EFT

**Acceptance Criteria:**
- [ ] "Subscribe" button redirects to payment modal
- [ ] Payment modal shows PayFast option
- [ ] User clicks "Pay with PayFast"
- [ ] Redirects to PayFast payment page
- [ ] User completes payment
- [ ] PayFast sends IPN (Instant Payment Notification) to Qilly
- [ ] Qilly validates payment signature
- [ ] Subscription activated
- [ ] User redirected to dashboard with success message
- [ ] Receipt emailed

**Story Points:** 21  
**Priority:** P1  
**Dependencies:** PayFast merchant account  
**Technical Notes:** IPN handler in `/src/utils/payments/payment-processor.ts`

---

#### User Story 10.1.2: EFT Payment
**Story ID:** US-010-001-002  
**As a:** Contractor  
**I want to:** Pay via bank transfer (EFT)  
**So that:** I can avoid card fees

**Acceptance Criteria:**
- [ ] "Pay via EFT" option in payment modal
- [ ] System displays banking details:
  - Bank: FNB
  - Account Name: Qilly (Pty) Ltd
  - Account Number: 1234567890
  - Reference: USER123_INVOICE456
- [ ] User copies details
- [ ] System generates invoice (PDF)
- [ ] User uploads proof of payment
- [ ] Admin verifies payment in "Payments" tab
- [ ] Admin clicks "Confirm Payment"
- [ ] Subscription activated
- [ ] User notified via email

**Story Points:** 13  
**Priority:** P1  
**Dependencies:** Admin payment verification workflow  
**Technical Notes:** Manual verification required (2-24 hours)

---

### Feature 10.2: Subscription Management

**Feature ID:** F-010-002  
**Description:** Users manage subscriptions (upgrade, cancel, view invoices)

#### User Story 10.2.1: View Subscription Details
**Story ID:** US-010-002-001  
**As a:** Subscribed user  
**I want to:** View my subscription status  
**So that:** I know my plan, billing date, and usage

**Acceptance Criteria:**
- [ ] "My Subscription" tab in user dashboard
- [ ] Display: Current Plan, Monthly Cost, Next Billing Date, BOQs Used This Month, BOQs Remaining
- [ ] Progress bar shows usage (e.g., "15 of 20 BOQs used")
- [ ] Warning if nearing limit: "5 BOQs remaining"
- [ ] "Upgrade Plan" button
- [ ] "Cancel Subscription" button
- [ ] Invoice history table

**Story Points:** 8  
**Priority:** P1  
**Dependencies:** Active subscription  
**Technical Notes:** Query `subscriptions` table

---

#### User Story 10.2.2: Cancel Subscription
**Story ID:** US-010-002-002  
**As a:** Subscribed user  
**I want to:** Cancel my subscription  
**So that:** I stop recurring payments

**Acceptance Criteria:**
- [ ] "Cancel Subscription" button
- [ ] Confirmation dialog: "Are you sure? Your subscription will remain active until [End Date]."
- [ ] Optional cancellation reason (dropdown)
- [ ] User confirms cancellation
- [ ] Subscription status set to "cancelled"
- [ ] Access continues until end of current billing period
- [ ] No further charges
- [ ] Cancellation email sent
- [ ] User can reactivate anytime

**Story Points:** 8  
**Priority:** P2  
**Dependencies:** US-010-002-001  
**Technical Notes:** Soft delete (don't delete record, set status)

---

## Epic 11: Multi-Environment Management

**Epic ID:** E-011  
**Epic Statement:** As a developer/admin, I need separate environments (DEV, SIT, UAT, PREPROD, PROD) with distinct databases and configurations so that development doesn't affect production.  
**Business Value:** Stability, testing isolation, deployment safety  
**Priority:** P0 (Critical)

---

### Feature 11.1: Environment Switching

**Feature ID:** F-011-001  
**Description:** Visual indicators and controls for environment awareness

#### User Story 11.1.1: Environment Badge
**Story ID:** US-011-001-001  
**As a:** User (any role)  
**I want to:** See which environment I'm using  
**So that:** I don't accidentally use production for testing

**Acceptance Criteria:**
- [ ] Badge visible in top-right corner
- [ ] Badge shows environment name:
  - 🖥️ DEV (gray)
  - 🧪 SIT (orange)
  - 🧑‍💻 UAT (blue)
  - 🚀 PREPROD (yellow)
  - ✅ PROD (green, no badge for users)
- [ ] Badge not visible to regular users in PROD
- [ ] Admin always sees badge
- [ ] Tooltip on hover explains environment

**Story Points:** 5  
**Priority:** P0  
**Dependencies:** Environment detection logic  
**Technical Notes:** Component in `/src/app/components/EnvironmentBadge.tsx`

---

#### User Story 11.1.2: Environment Switcher (Admin Only)
**Story ID:** US-011-001-002  
**As an:** Admin  
**I want to:** Switch between environments without redeploying  
**So that:** I can test different environments quickly

**Acceptance Criteria:**
- [ ] Admin sees "Environment Switcher" in Admin Dashboard
- [ ] Dropdown lists: DEV, SIT, UAT, PREPROD, PROD
- [ ] Selecting environment updates localStorage override
- [ ] Database connection switches to selected environment
- [ ] Warning shown when switching to PROD
- [ ] Page reloads to apply changes
- [ ] Banner shows: "⚠️ Environment override active: UAT"

**Story Points:** 8  
**Priority:** P1  
**Dependencies:** Multi-environment config  
**Technical Notes:** Component in `/src/app/components/EnvironmentSwitcher.tsx`

---

### Feature 11.2: Environment-Specific Configs

**Feature ID:** F-011-002  
**Description:** Each environment has unique database, API keys, features

#### User Story 11.2.1: Separate Supabase Projects
**Story ID:** US-011-002-001  
**As a:** System  
**I want to:** Connect to different Supabase projects per environment  
**So that:** Test data doesn't pollute production

**Acceptance Criteria:**
- [ ] `.env.development`: Supabase DEV project
- [ ] `.env.sit`: Supabase SIT project
- [ ] `.env.uat`: Supabase UAT project
- [ ] `.env.preprod`: Supabase PREPROD project
- [ ] `.env.production`: Supabase PROD project
- [ ] Each environment isolated (no data cross-contamination)
- [ ] Environment variable validation on startup
- [ ] Error if Supabase URL missing

**Story Points:** 8  
**Priority:** P0  
**Dependencies:** Supabase projects created  
**Technical Notes:** Config in `/src/utils/environment.ts`

---

---

## Story Point Estimation Guide

### Fibonacci Scale

- **1 Point:** Trivial change (update text, fix typo)
- **3 Points:** Simple feature (add button, basic validation)
- **5 Points:** Moderate feature (form with 5 fields, simple API call)
- **8 Points:** Complex feature (multi-step wizard, data transformation)
- **13 Points:** Very complex (payment integration, advanced algorithm)
- **21 Points:** Epic-level complexity (consider splitting into smaller stories)

### Estimation Factors

1. **Complexity:** How hard is the logic?
2. **Unknowns:** Do we know how to build this?
3. **Dependencies:** How many other systems involved?
4. **Testing:** How much testing required?

---

## Acceptance Criteria Templates

### Template 1: User-Facing Feature
```
Given [context]
When [action]
Then [expected result]

Example:
Given I am a logged-in government user
When I upload a BOQ Excel file
Then the system displays a preview table with the first 10 rows
```

### Template 2: System Behavior
```
- [ ] System does X when Y happens
- [ ] System validates Z
- [ ] Error message shown if invalid
- [ ] Success message shown if valid
```

### Template 3: Admin Feature
```
- [ ] Admin can access [feature]
- [ ] Admin can perform [action]
- [ ] Changes persist in database
- [ ] Audit trail logged
- [ ] User notified (if applicable)
```

---

## Prioritization Matrix

| Priority | Criteria | Example |
|----------|----------|---------|
| **P0 (Critical)** | Must have for MVP, blocking other features | User authentication, BOQ upload, pricing engine |
| **P1 (High)** | Core functionality, needed for launch | Compliance checks, provincial pricing, exports |
| **P2 (Medium)** | Important but can launch without | Advanced analytics, contractor tier upgrades |
| **P3 (Low)** | Nice to have, future enhancement | AI-powered insights, mobile app |

---

## Definition of Done (DoD)

A story is "Done" when:

- [ ] Code written and reviewed
- [ ] Unit tests passed (>80% coverage)
- [ ] Integration tests passed
- [ ] Acceptance criteria met
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] Deployed to SIT environment
- [ ] Product Owner approved

---

## Sprint Planning Template

**Sprint Goal:** [What are we trying to achieve this sprint?]  
**Sprint Duration:** 2 weeks  
**Team Capacity:** [Total story points available]  

**Selected Stories:**
1. US-XXX-XXX-XXX (5 points) - [Description]
2. US-XXX-XXX-XXX (8 points) - [Description]
3. US-XXX-XXX-XXX (13 points) - [Description]

**Total Points:** 26  
**Team Velocity:** 25-30 points/sprint  
**Confidence:** Medium

---

## Notes for Product Owner

1. **Story Breakdown:** If a story is >13 points, consider splitting it
2. **Dependencies:** Track dependencies in project management tool (Jira, Azure DevOps)
3. **User Feedback:** After each sprint, gather feedback from pilot users
4. **Backlog Grooming:** Review and re-prioritize backlog every 2 weeks
5. **Technical Debt:** Allocate 20% of sprint capacity to tech debt and bug fixes

---

**End of Product Backlog**

*This document will be continuously updated as new features are identified and existing stories refined.*
