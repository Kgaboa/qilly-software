# 📋 QILLY PRODUCT EPICS, FEATURES & USER STORIES

**Product:** Qilly (Pty) Ltd - South African Construction Billing Intelligence Platform  
**Date:** May 6, 2026  
**Version:** 1.0  
**Standard:** BuildAid 2025/2026, POPIA Compliant

---

## TABLE OF CONTENTS

1. [Product Overview](#product-overview)
2. [Epic 1: User Onboarding & Authentication](#epic-1-user-onboarding--authentication)
3. [Epic 2: BOQ Processing & Pricing](#epic-2-boq-processing--pricing)
4. [Epic 3: Supplier Management](#epic-3-supplier-management)
5. [Epic 4: Payment & Subscriptions](#epic-4-payment--subscriptions)
6. [Epic 5: Compliance & Regulations](#epic-5-compliance--regulations)
7. [Epic 6: Analytics & Reporting](#epic-6-analytics--reporting)
8. [Epic 7: Team & Collaboration](#epic-7-team--collaboration)
9. [Epic 8: Partner Integration](#epic-8-partner-integration)
10. [Epic 9: Admin & Platform Management](#epic-9-admin--platform-management)
11. [Epic 10: Green Building & Sustainability](#epic-10-green-building--sustainability)

---

## PRODUCT OVERVIEW

### Vision Statement
Qilly is South Africa's first AI-augmented construction cost intelligence platform that automatically prices bills of quantities using live supplier data, based on BuildAid 2025/2026 standards.

### Target Users
- **Contractors** (CIDB registered, GB1-GB9, CE, EB, ME grades)
- **Suppliers** (Building materials, steel, concrete, electrical, etc.)
- **Admins** (Platform operators, compliance officers)
- **Partners** (Software integrators, white-label clients)

### Key Value Propositions
1. **Time Savings**: Automate BOQ pricing (3 days → 30 minutes)
2. **Cost Optimization**: Multi-supplier comparison saves 15-25% on materials
3. **Compliance**: 6 major compliance domains covered (POPIA, NEMA, Competition Act, etc.)
4. **Accuracy**: BuildAid 2025/2026 standards + live supplier rates
5. **Regional Intelligence**: Provincial and municipal pricing variations

---

---

## EPIC 1: USER ONBOARDING & AUTHENTICATION

**Business Goal:** Streamline user registration and ensure POPIA-compliant authentication for all user types.

---

### Feature 1.1: Contractor Registration

**User Story 1.1.1: Register as CIDB Contractor**
```
AS A construction contractor with CIDB registration
I WANT TO sign up for Qilly with my company details
SO THAT I can access BOQ pricing services
```

**Acceptance Criteria:**
- ✓ Multi-step form with progress indicator
- ✓ CIDB class selection (GB, CE, EB, ME, SB, SC, SD, SE, SF, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SP, SQ)
- ✓ CIDB grade selection (1-9)
- ✓ Province and municipality selection
- ✓ Project types multi-select (Residential, Commercial, Industrial, Infrastructure, etc.)
- ✓ BBBEE level input (1-8, Non-compliant, Exempt Micro Enterprise)
- ✓ Annual turnover for EME/QSE classification
- ✓ Password strength validation (8+ chars, uppercase, lowercase, number, special char)
- ✓ POPIA consent checkboxes (Privacy Policy + Terms of Service)
- ✓ Consent timestamp logged to audit table
- ✓ Account status set to "pending" until admin approval

**Component:** `ContractorSignup.tsx`  
**Database:** `contractors` table

---

**User Story 1.1.2: Contractor Chooses Subscription Tier**
```
AS A contractor during signup
I WANT TO choose between FREE, PROFESSIONAL, ENTERPRISE, or CUSTOM tiers
SO THAT I get the features I need at a price I can afford
```

**Acceptance Criteria:**
- ✓ Pricing cards display features comparison
- ✓ FREE: 3-5 trial bills, template access only
- ✓ PROFESSIONAL: R2,999/month, unlimited BOQ uploads
- ✓ ENTERPRISE: R8,999/month, collusion detection, carbon tracking
- ✓ CUSTOM: White-label, API access, custom pricing
- ✓ Tier selection stored in `subscription_tier` field
- ✓ Billing cycle selection (monthly/annual)
- ✓ Next billing date calculated

**Component:** `ContractorPricingTiers.tsx`, `TierSelectionStep.tsx`

---

**User Story 1.1.3: Contractor Submits Payment**
```
AS A contractor who selected a paid tier
I WANT TO choose my payment method (Manual EFT, Stitch, PayFast)
SO THAT I can activate my account
```

**Acceptance Criteria:**
- ✓ Three payment options displayed with descriptions
- ✓ Manual EFT: Generates unique payment reference
- ✓ Stitch: Redirects to bank authentication
- ✓ PayFast: Credit card form integration
- ✓ Payment method saved to `payment_method` field
- ✓ Payment amount saved to `payment_amount` field
- ✓ Manual EFT sets `payment_approved = false` (requires admin verification)
- ✓ Stitch/PayFast auto-approves on successful transaction

**Component:** `PaymentStep.tsx`, `payments/EFTPayment.tsx`, `payments/StitchPayment.tsx`, `payments/PayFastPayment.tsx`

---

### Feature 1.2: Supplier Registration

**User Story 1.2.1: Register as Supplier**
```
AS A building materials supplier
I WANT TO register my company and product categories
SO THAT contractors can receive my pricing in their BOQs
```

**Acceptance Criteria:**
- ✓ Company registration number, VAT number, BBBEE level
- ✓ Product category multi-select (Building Materials, Steel, Cement, Electrical, etc.)
- ✓ Service area (province) selection
- ✓ Years in business input
- ✓ Certification status checkbox
- ✓ Supplier pricing tier selection (FREE, PROFESSIONAL, ENTERPRISE)
- ✓ Account status set to "pending"
- ✓ POPIA consent tracking

**Component:** `SupplierSignup.tsx`  
**Database:** `suppliers` table

---

### Feature 1.3: Authentication & Login

**User Story 1.3.1: Login with Email & Password**
```
AS A registered user
I WANT TO log in with my email and password
SO THAT I can access my dashboard
```

**Acceptance Criteria:**
- ✓ Email validation (valid format)
- ✓ Password validation
- ✓ Supabase authentication integration
- ✓ Role detection (contractor vs. regular user)
- ✓ Redirect to appropriate dashboard
- ✓ Error messages for invalid credentials
- ✓ "Forgot Password" link functional

**Component:** `AuthForm.tsx`

---

**User Story 1.3.2: Contractor Login with Payment Gate**
```
AS A contractor with pending payment verification
I WANT TO see a clear message about my payment status
SO THAT I know why my account is not yet active
```

**Acceptance Criteria:**
- ✓ Check `contractors.payment_approved` field
- ✓ If `false`, display: "Your payment is being verified. Please wait for admin approval."
- ✓ Block access to dashboard until approved
- ✓ Provide admin contact information
- ✓ Show estimated verification time (24-48 hours for manual EFT)

**Component:** `AuthForm.tsx` lines 182-211

---

**User Story 1.3.3: Admin Login**
```
AS A platform administrator
I WANT TO log in securely with admin credentials
SO THAT I can manage contractors, suppliers, and platform settings
```

**Acceptance Criteria:**
- ✓ Separate admin login screen
- ✓ Admin email/password authentication via Supabase
- ✓ Role verification (check `user_profiles.role = 'admin'`)
- ✓ Redirect to AdminDashboard on success
- ✓ Session tracking for security audit

**Component:** `AdminLogin.tsx`

---

**User Story 1.3.4: Partner Login**
```
AS A partner (Procore, BuildSmart, etc.)
I WANT TO log in to my partner portal
SO THAT I can configure white-label settings and view analytics
```

**Acceptance Criteria:**
- ✓ Partner email/password authentication
- ✓ Redirect to PartnerPortal on success
- ✓ Session stored in sessionStorage
- ✓ Demo credentials available for testing (dev mode only)

**Component:** `PartnerLogin.tsx`

---

### Feature 1.4: POPIA Compliance & Consent Tracking

**User Story 1.4.1: Consent to Privacy Policy**
```
AS A new user during signup
I WANT TO be presented with the Privacy Policy and give explicit consent
SO THAT my data processing is POPIA-compliant
```

**Acceptance Criteria:**
- ✓ Privacy Policy link displayed prominently
- ✓ Checkbox: "I consent to the Privacy Policy"
- ✓ Checkbox: "I consent to the Terms of Service"
- ✓ Both checkboxes MUST be checked to proceed
- ✓ Consent timestamp logged to `consent_audit_log` table
- ✓ Policy version stored (v1.0)
- ✓ User can view full policy in modal or separate page

**Component:** `AuthForm.tsx` (v2.0 POPIA compliance)  
**Database:** `consent_audit_log` table

---

---

## EPIC 2: BOQ PROCESSING & PRICING

**Business Goal:** Automate BOQ pricing using live supplier data with regional variations and BuildAid 2025/2026 standards.

---

### Feature 2.1: Standard BOQ Upload

**User Story 2.1.1: Upload BOQ via Excel/CSV**
```
AS A contractor
I WANT TO upload my BOQ from an Excel or CSV file
SO THAT I don't have to manually enter hundreds of line items
```

**Acceptance Criteria:**
- ✓ File upload accepts .xlsx, .xls, .csv formats
- ✓ Parse file and extract columns: Code, Description, Quantity, Unit
- ✓ Validate data types (quantity must be numeric)
- ✓ Display preview table before processing
- ✓ Allow editing of parsed items
- ✓ Error handling for malformed files
- ✓ Provide downloadable Excel template

**Component:** `BillUpload.tsx`  
**Processing:** `utils/pricingEngine.ts`

---

**User Story 2.1.2: Manually Enter BOQ Items**
```
AS A contractor with a small project
I WANT TO manually enter BOQ line items one by one
SO THAT I can price a quick quote without preparing a spreadsheet
```

**Acceptance Criteria:**
- ✓ "Add Item" button creates new row
- ✓ Input fields: Code, Description, Quantity, Unit
- ✓ Unit dropdown with common options (m, m², m³, kg, tonne, each, etc.)
- ✓ Delete item button
- ✓ Validation: Description and quantity required
- ✓ Real-time form validation

**Component:** `BillUpload.tsx` manual entry mode

---

**User Story 2.1.3: Select Project Settings**
```
AS A contractor
I WANT TO specify my project location and settings
SO THAT pricing reflects regional variations and project-specific costs
```

**Acceptance Criteria:**
- ✓ Province dropdown (9 provinces)
- ✓ Municipality dropdown (populated based on province)
- ✓ Profit margin percentage slider (0-50%)
- ✓ CIDB grading auto-filled from contractor profile
- ✓ Project duration input (months)
- ✓ Machinery type selection (Heavy, Standard, Light)
- ✓ Settings stored with bill for future reference

**Component:** `BillUpload.tsx` project settings form

---

**User Story 2.1.4: Process BOQ and Receive Priced Bill**
```
AS A contractor
I WANT TO submit my BOQ for processing
SO THAT I receive a complete priced bill with supplier information
```

**Acceptance Criteria:**
- ✓ "Process Bill" button triggers API call
- ✓ Loading indicator during processing
- ✓ API endpoint: `/api/processBill`
- ✓ Response includes: billId, items with prices, suppliers, totals
- ✓ Processing time displayed
- ✓ VAT calculation (15%)
- ✓ Grand total (ex VAT + inc VAT)
- ✓ Supplier name matched to each item
- ✓ Bill saved to Supabase `bills` and `bill_items` tables

**Component:** `BillUpload.tsx`, `RegionalPricedBillView.tsx`  
**API:** `/src/app/api/processBill/route.ts`

---

### Feature 2.2: Steel BOQ Specialized Pricing

**User Story 2.2.1: Access Steel BOQ Tab**
```
AS A contractor working on structural projects
I WANT TO access a specialized steel BOQ pricing tool
SO THAT I get accurate pricing for reinforcing bars, beams, and structural steel
```

**Acceptance Criteria:**
- ✓ "Steel BOQ" tab visible in MainDashboard
- ✓ Tab contains: Steel Catalogue, Upload, BOQ Table, Steel Vision
- ✓ BuildAid 2025/2026 + SANS 1200 DF standards applied
- ✓ Steel catalogue with 45+ items across 8 categories

**Component:** `SteelBoqUpload.tsx`

---

**User Story 2.2.2: Browse Steel Catalogue**
```
AS A contractor
I WANT TO browse a catalog of steel products with specifications
SO THAT I can select the correct grade and section for my project
```

**Acceptance Criteria:**
- ✓ Categories: Reinforcing, Structural Sections, Hollow Sections, Angles, Flat Products, Roofing/Cladding, Mesh & Wire, Fasteners
- ✓ Each item shows: Code, Description, Grade (S275, S355, 450MPa, etc.), Unit, Base Price
- ✓ Supplier rates displayed (ArcelorMittal, Cape Gate, BRC, Macsteel, NJR)
- ✓ SANS 1200 reference and BuildAid page reference
- ✓ Search and filter by category
- ✓ Mass per unit displayed for tonnage calculations

**Component:** `SteelBoqUpload.tsx` - Catalogue Tab

---

**User Story 2.2.3: Upload Steel BOQ**
```
AS A contractor
I WANT TO upload a steel BOQ or use the Excel template
SO THAT I can quickly price structural steel projects
```

**Acceptance Criteria:**
- ✓ Excel template download button
- ✓ Template includes: Item Code, Description, Grade, Quantity, Unit
- ✓ Step-by-step import instructions
- ✓ File validation and preview
- ✓ Auto-matching to steel catalogue items
- ✓ Manual item entry option

**Component:** `SteelBoqUpload.tsx` - Upload Tab

---

**User Story 2.2.4: View Priced Steel BOQ**
```
AS A contractor
I WANT TO see my steel BOQ with pricing, mass calculations, and supplier comparison
SO THAT I can make informed purchasing decisions
```

**Acceptance Criteria:**
- ✓ Line items with: Code, Description, Category, Grade, Quantity, Unit
- ✓ Unit rate (best supplier) highlighted
- ✓ Total ex VAT and inc VAT per item
- ✓ Mass calculations (kg and tonnes)
- ✓ Provincial freight adjustments applied
- ✓ Supplier comparison (see all supplier rates)
- ✓ Best supplier badge
- ✓ SANS 1200 and BuildAid references
- ✓ Export to Excel/PDF

**Component:** `SteelPricedBillView.tsx`

---

**User Story 2.2.5: Tier-Gated Steel Features**
```
AS AN Enterprise tier contractor
I WANT TO access inflation projections and compliance costs in my steel BOQ
SO THAT I can plan my budget and meet regulatory requirements
```

**Acceptance Criteria:**
- ✓ FREE tier: View-only steel catalogue, encrypted pricing
- ✓ PROFESSIONAL tier: Full pricing, multi-supplier comparison, Excel export
- ✓ ENTERPRISE tier: All PROFESSIONAL features + inflation projections + compliance cost calculator
- ✓ Tier badge displayed on each feature
- ✓ Upgrade prompt for locked features

**Component:** `SteelPricedBillView.tsx` - Tier access logic

---

### Feature 2.3: BOQ Template Library

**User Story 2.3.1: Browse Project Templates**
```
AS A FREE tier contractor
I WANT TO browse pre-built BOQ templates for common project types
SO THAT I can learn standard pricing without uploading custom BOQs
```

**Acceptance Criteria:**
- ✓ Templates filtered by contractor's project types
- ✓ Categories: Road Construction, Housing, Infrastructure, Civil Works, Bridges, Buildings
- ✓ Each template shows: Project name, description, estimated value, line item count
- ✓ Preview line items before loading
- ✓ Load template into BOQ processing form
- ✓ User can modify quantities

**Component:** `BoqTemplateLibrary.tsx`

---

**User Story 2.3.2: Auto-Fill Contractor Settings**
```
AS A contractor
I WANT TO have my company details pre-filled in templates
SO THAT I save time on data entry
```

**Acceptance Criteria:**
- ✓ Contractor name, CIDB grade auto-filled
- ✓ Default province set from contractor profile
- ✓ Default municipality suggested
- ✓ User can override pre-filled settings
- ✓ Settings saved with bill

**Component:** `MainDashboard.tsx` integration with `BoqTemplateLibrary.tsx`

---

### Feature 2.4: Drawing Upload (AI-Powered - Dev Mode)

**User Story 2.4.1: Upload Architectural Drawings**
```
AS A contractor in development environment
I WANT TO upload architectural drawings (PDF/PNG/JPG)
SO THAT AI can extract BOQ items automatically
```

**Acceptance Criteria:**
- ✓ Feature visible only in development/demo environments
- ✓ File upload accepts PNG, JPG, PDF
- ✓ AI extraction using Tesseract.js or similar OCR
- ✓ Identified items: Description, estimated quantity, unit
- ✓ Confidence score per item
- ✓ User can edit extracted items before processing
- ✓ Error handling for low-quality images

**Component:** `DrawingUpload.tsx`  
**Feature Flag:** `showAIUpload` (dev/demo only)

---

### Feature 2.5: Bill History & Project Tracking

**User Story 2.5.1: View Past Bills**
```
AS A contractor
I WANT TO see a history of all my processed BOQs
SO THAT I can reference past projects and compare pricing over time
```

**Acceptance Criteria:**
- ✓ Table with columns: Project Name, Date, Total, Status
- ✓ Sort by date (newest first)
- ✓ Filter by date range
- ✓ Search by project name
- ✓ Click row to view full bill details
- ✓ Re-export past bills to Excel/PDF

**Component:** `BillHistory.tsx`  
**Database:** `bills` table with `contractor_id` foreign key

---

---

## EPIC 3: SUPPLIER MANAGEMENT

**Business Goal:** Build a comprehensive supplier network and enable efficient supplier onboarding, product management, and price matching.

---

### Feature 3.1: Supplier Onboarding

**User Story 3.1.1: Register as Supplier** (covered in Epic 1.2.1)

---

**User Story 3.1.2: Admin Approves Supplier**
```
AS AN admin
I WANT TO review pending supplier applications
SO THAT I can verify their credentials before allowing them into the network
```

**Acceptance Criteria:**
- ✓ "Suppliers" tab in AdminDashboard shows pending suppliers
- ✓ Display: Company name, email, product categories, BBBEE level, registration date
- ✓ "Approve" button sets `status = 'approved'`, `approved_at = NOW()`
- ✓ "Reject" button sets `status = 'rejected'`, `rejected_at = NOW()`
- ✓ Rejection reason input field
- ✓ Email notification sent to supplier on approval/rejection

**Component:** `AdminDashboard.tsx` - Suppliers Tab

---

### Feature 3.2: Supplier Product Catalog Management

**User Story 3.2.1: Supplier Adds Products**
```
AS AN approved supplier
I WANT TO add my products with codes, descriptions, and pricing
SO THAT contractors can see my offerings in their BOQs
```

**Acceptance Criteria:**
- ✓ Product form: Code, Description, Unit, Unit Price, Category
- ✓ Availability toggle (in stock / out of stock)
- ✓ Bulk upload via Excel
- ✓ Product saved to `supplier_products` table
- ✓ Foreign key: `supplier_id` references `suppliers.id`
- ✓ Indexing on category and description for fast search

**Component:** `SupplierAPIManager.tsx`, `CatalogManager.tsx`  
**Database:** `supplier_products` table

---

**User Story 3.2.2: Supplier Updates Pricing**
```
AS A supplier
I WANT TO update my product pricing in real-time
SO THAT contractors always receive my latest rates
```

**Acceptance Criteria:**
- ✓ Edit product form
- ✓ Price update reflected immediately in pricing engine
- ✓ Update timestamp: `last_updated = NOW()`
- ✓ Price history tracking (optional for analytics)

**Component:** `SupplierAPIManager.tsx`

---

### Feature 3.3: Supplier Search & Comparison

**User Story 3.3.1: Search for Suppliers**
```
AS A contractor
I WANT TO search for suppliers by product category or company name
SO THAT I can find the right suppliers for my project
```

**Acceptance Criteria:**
- ✓ Search bar with autocomplete
- ✓ Filter by: Product category, Province, BBBEE level
- ✓ Sort by: Name, Rating, Price
- ✓ Display: Company name, categories, province, contact info
- ✓ Click to view supplier profile

**Component:** `SupplierSearch.tsx`, `Suppliers.tsx`

---

**User Story 3.3.2: Compare Supplier Rates**
```
AS A contractor viewing a priced BOQ
I WANT TO see pricing from multiple suppliers for each item
SO THAT I can choose the best value
```

**Acceptance Criteria:**
- ✓ "Compare Suppliers" button on each BOQ line item
- ✓ Modal displays: Supplier name, unit price, availability, notes
- ✓ Highlight best price (lowest)
- ✓ User can select alternative supplier
- ✓ Recalculate total with selected supplier

**Component:** `RegionalPricedBillView.tsx`, `SteelPricedBillView.tsx`

---

### Feature 3.4: Supplier Network Coverage

**User Story 3.4.1: View Supplier Coverage by Category**
```
AS AN admin
I WANT TO see which product categories have supplier coverage
SO THAT I can prioritize supplier recruitment
```

**Acceptance Criteria:**
- ✓ Coverage report: Category A-Q with supplier count
- ✓ Phase tracking: Phase 1 (complete), Phase 2 (in progress), Phase 3 (planned)
- ✓ Supplier names listed per category
- ✓ Gap analysis: Categories with < 3 suppliers
- ✓ Export to Excel

**Component:** `SupplierCoverageCompliance.tsx`

---

### Feature 3.5: Supplier Engagement

**User Story 3.5.1: Admin Communicates with Suppliers**
```
AS AN admin
I WANT TO send bulk communications to suppliers
SO THAT I can request pricing updates or announce platform changes
```

**Acceptance Criteria:**
- ✓ Email template builder
- ✓ Recipient selection (all suppliers, by category, by province)
- ✓ Personalization tokens (company name, contact person)
- ✓ Send log for tracking
- ✓ Response tracking (optional)

**Component:** `SupplierEngagement.tsx`

---

---

## EPIC 4: PAYMENT & SUBSCRIPTIONS

**Business Goal:** Enable seamless payment processing, subscription management, and tier-based access control.

---

### Feature 4.1: Subscription Tier Selection (covered in Epic 1.1.2)

---

### Feature 4.2: Payment Processing

**User Story 4.2.1: Pay via Manual EFT**
```
AS A contractor who prefers bank transfer
I WANT TO receive bank details and a unique payment reference
SO THAT I can pay via EFT and have my payment verified
```

**Acceptance Criteria:**
- ✓ Display Qilly bank account details (Bank, Account Number, Branch Code)
- ✓ Generate unique payment reference: `QILLY-{contractorId}-{timestamp}`
- ✓ Payment reference stored in `payment_reference` field
- ✓ Payment amount stored in `payment_amount` field
- ✓ Instructions: "Use reference EXACTLY as shown"
- ✓ Status: "Payment pending verification"
- ✓ Email confirmation with payment details

**Component:** `PaymentStep.tsx`, `payments/EFTPayment.tsx`

---

**User Story 4.2.2: Pay via Stitch (Auto-Debit)**
```
AS A contractor who wants instant approval
I WANT TO pay via Stitch bank authentication
SO THAT my account is activated immediately
```

**Acceptance Criteria:**
- ✓ Redirect to Stitch authentication flow
- ✓ User selects bank and authenticates
- ✓ Debit authorization granted
- ✓ Payment processed automatically
- ✓ On success: `payment_approved = true`, `status = 'approved'`
- ✓ Redirect to MainDashboard with success message

**Component:** `payments/StitchPayment.tsx`  
**Integration:** Stitch API

---

**User Story 4.2.3: Pay via PayFast (Credit Card)**
```
AS A contractor with a credit card
I WANT TO pay via PayFast
SO THAT my account is activated immediately
```

**Acceptance Criteria:**
- ✓ Credit card form (card number, expiry, CVV)
- ✓ PCI-compliant iframe or redirect to PayFast
- ✓ Payment processing
- ✓ On success: `payment_approved = true`, `status = 'approved'`
- ✓ Receipt emailed to contractor
- ✓ Redirect to MainDashboard

**Component:** `payments/PayFastPayment.tsx`  
**Integration:** PayFast API

---

### Feature 4.3: Payment Verification (Admin)

**User Story 4.3.1: Verify Manual EFT Payment**
```
AS AN admin
I WANT TO verify manual EFT payments against bank statements
SO THAT I can approve contractor accounts once payment is confirmed
```

**Acceptance Criteria:**
- ✓ "Payments" tab in AdminDashboard
- ✓ Table shows: Contractor name, payment reference, amount, date submitted, status
- ✓ Filter: Pending, Verified, Rejected
- ✓ "Verify & Approve" button
- ✓ On verify: `payment_approved = true`, `status = 'approved'`, `approved_at = NOW()`
- ✓ Contractor can now log in
- ✓ Email notification sent to contractor

**Component:** `PaymentVerification.tsx` (AdminDashboard)

---

**User Story 4.3.2: Audit Payment History**
```
AS AN admin
I WANT TO view all payment transactions with audit trail
SO THAT I can track revenue and resolve disputes
```

**Acceptance Criteria:**
- ✓ Payment audit log table
- ✓ Columns: Date, Contractor, Amount, Method, Status, Verified By, Verified At
- ✓ Export to CSV
- ✓ Date range filter
- ✓ Search by contractor name or reference

**Component:** `PaymentAudit.tsx`

---

### Feature 4.4: Tier-Based Access Control

**User Story 4.4.1: FREE Tier Trial Management**
```
AS A FREE tier contractor
I WANT TO see how many trial bills I have remaining
SO THAT I know when I need to upgrade
```

**Acceptance Criteria:**
- ✓ `trial_bills_remaining` field in `users` table (default 3-5)
- ✓ Decrement on each BOQ processing
- ✓ Toast notification: "X free bills remaining"
- ✓ When 0: "Trial complete - Upgrade to continue"
- ✓ Upgrade modal appears
- ✓ Cannot process more BOQs until upgraded

**Component:** `MainDashboard.tsx`, `BillUpload.tsx`  
**Logic:** `utils/tierAccess.ts`

---

**User Story 4.4.2: Block BOQ Upload for FREE Tier**
```
AS A FREE tier contractor
I WANT TO see a message that custom BOQ upload is not available on my tier
SO THAT I understand I need to upgrade or use templates
```

**Acceptance Criteria:**
- ✓ Check `contractorData.subscription_tier`
- ✓ If FREE and `canUploadBOQ = false`: Hide upload tab
- ✓ Display message: "Upgrade to PROFESSIONAL to upload custom BOQs"
- ✓ "Upgrade Now" button opens SubscriptionUpgradeModal
- ✓ Template library remains accessible

**Component:** `MainDashboard.tsx`  
**Logic:** `utils/tierAccess.ts` → `getTierFeatures()`

---

**User Story 4.4.3: Unlock Enterprise Features**
```
AS AN ENTERPRISE tier contractor
I WANT TO access collusion detection, carbon tracking, and compliance costs
SO THAT I can meet regulatory requirements and win government tenders
```

**Acceptance Criteria:**
- ✓ Collusion detection tab visible
- ✓ Carbon tracking visible in BOQ results
- ✓ Compliance cost calculator visible
- ✓ eTender full integration enabled
- ✓ Team management for 5+ users enabled
- ✓ Tier badge displayed on each feature

**Component:** `RegionalPricedBillView.tsx`, `SteelPricedBillView.tsx`, `CollusionDetection.tsx`

---

### Feature 4.5: Subscription Upgrades

**User Story 4.5.1: Upgrade to Higher Tier**
```
AS A contractor
I WANT TO upgrade from FREE to PROFESSIONAL or ENTERPRISE
SO THAT I can access more features
```

**Acceptance Criteria:**
- ✓ "Upgrade" button in dashboard header
- ✓ SubscriptionUpgradeModal shows tier comparison
- ✓ Select new tier
- ✓ Select payment method
- ✓ Process payment
- ✓ On success: Update `subscription_tier`, `subscription_start_date`, `next_billing_date`
- ✓ Refresh dashboard to show new features
- ✓ Confirmation email sent

**Component:** `payments/SubscriptionUpgradeModal.tsx`

---

---

## EPIC 5: COMPLIANCE & REGULATIONS

**Business Goal:** Ensure Qilly helps contractors meet 6 major South African compliance requirements for government tenders.

---

### Feature 5.1: Green Building & Carbon Tracking

**User Story 5.1.1: View Carbon Emissions per BOQ**
```
AS AN ENTERPRISE tier contractor
I WANT TO see the carbon emissions (tCO2e) for my BOQ
SO THAT I can meet DHS Green Building Initiative requirements
```

**Acceptance Criteria:**
- ✓ Carbon emissions calculated per item
- ✓ Total emissions displayed in dashboard
- ✓ Comparison to standard (non-green) baseline
- ✓ Carbon reduction percentage
- ✓ Tree equivalency metric (e.g., "Equivalent to 120 trees planted")
- ✓ Green score (A+, A, A-, B+, B, B-, C, D)
- ✓ Eco-friendly alternative suggestions

**Component:** `GreenDashboard.tsx`, `EnvironmentalComplianceDashboard.tsx`  
**Database:** Carbon factors stored in pricing engine

---

**User Story 5.1.2: Generate Sustainability Report**
```
AS A contractor
I WANT TO export a sustainability report for my project
SO THAT I can submit it to DHS for green building compliance
```

**Acceptance Criteria:**
- ✓ PDF export with: Project details, carbon emissions, green score, alternatives
- ✓ Branded report with Qilly logo
- ✓ Compliance statement
- ✓ Recommendations section
- ✓ Date and reference number

**Component:** `GreenDashboard.tsx` export function

---

### Feature 5.2: eTender Integration

**User Story 5.2.1: Generate eTender Response Package**
```
AS A PROFESSIONAL tier contractor
I WANT TO generate a complete eTender response document
SO THAT I can submit government tender applications faster
```

**Acceptance Criteria:**
- ✓ Auto-populate contractor credentials (CIDB, BBBEE, etc.)
- ✓ Generate pricing schedule from BOQ
- ✓ Include company profile and track record
- ✓ Add compliance declarations
- ✓ Format according to eTender templates
- ✓ PDF export with watermark
- ✓ Professional tier: Basic template
- ✓ Enterprise tier: Full customization + multi-project submissions

**Component:** `TenderResponseGenerator.tsx`, `ETenderInvestorBrief.tsx`

---

**User Story 5.2.2: View eTender Executive Summary**
```
AS AN admin
I WANT TO view an executive summary of Qilly's eTender integration capabilities
SO THAT I can pitch this feature to partners and investors
```

**Acceptance Criteria:**
- ✓ Summary document with: Market opportunity, Qilly value proposition, eTender workflow
- ✓ Revenue model (subscription fees + partner revenue share)
- ✓ Growth projections
- ✓ Competitive advantage analysis
- ✓ PDF export for investor meetings

**Component:** `ETenderExecutiveSummary.tsx`

---

### Feature 5.3: Collusion Detection

**User Story 5.3.1: Analyze BOQ for Bid Rigging**
```
AS AN ENTERPRISE tier contractor
I WANT TO run collusion detection on multiple quotes
SO THAT I can ensure my procurement process complies with the Competition Act
```

**Acceptance Criteria:**
- ✓ Upload 3+ quotes for same project
- ✓ Statistical analysis: Price clustering, identical pricing patterns, bid rotation indicators
- ✓ Risk score (Low, Medium, High)
- ✓ Red flags highlighted (e.g., "3 suppliers quoted identical prices for 80% of items")
- ✓ Compliance report for audit trail
- ✓ Recommendations: "Consider re-tendering" or "Seek additional quotes"

**Component:** `CollusionDetection.tsx`  
**Algorithm:** Price variance analysis, pattern detection

---

### Feature 5.4: Environmental Compliance Assessment

**User Story 5.4.1: Screen Project for NEMA Requirements**
```
AS A contractor
I WANT TO know if my project triggers NEMA environmental authorization requirements
SO THAT I can apply for the necessary approvals before starting work
```

**Acceptance Criteria:**
- ✓ Project details input: Type, size, location, activities
- ✓ Check against NEMA listed activities
- ✓ Output: "Requires Basic Assessment" or "Requires Full EIA" or "No authorization needed"
- ✓ Trigger identification (e.g., "Excavation > 5,000 m³ triggers Activity 19")
- ✓ Mitigation recommendations
- ✓ Specialist referral if needed
- ✓ Export compliance report

**Component:** `EnvironmentalComplianceDashboard.tsx`, `EnvironmentalComplianceModule.tsx`

---

### Feature 5.5: Compliance Cost Calculator

**User Story 5.5.1: Estimate Compliance Costs**
```
AS AN ENTERPRISE tier contractor
I WANT TO see a breakdown of compliance costs for my project
SO THAT I can budget accurately and avoid surprises
```

**Acceptance Criteria:**
- ✓ Cost categories: Safety compliance, Environmental mitigation, Legal/admin, Insurance & bonding, Certifications
- ✓ Percentage of total project cost
- ✓ Line-by-line breakdown
- ✓ Based on project type, size, and location
- ✓ Editable assumptions
- ✓ Export to Excel

**Component:** `ComplianceCostCalculator.tsx`

---

### Feature 5.6: Supplier Legal Audit

**User Story 5.6.1: View Supplier Legal Compliance Status**
```
AS AN admin
I WANT TO audit all 159 suppliers for legal compliance
SO THAT I can ensure Qilly only lists legitimate, compliant suppliers
```

**Acceptance Criteria:**
- ✓ Compliance checks: BBBEE level, Tax clearance, CIDB registration, Insurance, Safety certifications
- ✓ Supplier count: 159 total
- ✓ Steel suppliers: 59
- ✓ Compliance status per supplier (Compliant, Pending, Non-compliant)
- ✓ Risk rating (Low, Medium, High)
- ✓ Document verification tracking
- ✓ Export audit report

**Component:** `SupplierLegalAudit.tsx`

---

---

## EPIC 6: ANALYTICS & REPORTING

**Business Goal:** Provide actionable insights to contractors, suppliers, admins, and partners through analytics and reporting.

---

### Feature 6.1: Contractor Analytics

**User Story 6.1.1: View Bill Processing Statistics**
```
AS A contractor
I WANT TO see how many BOQs I've processed this month
SO THAT I can track my usage and ROI
```

**Acceptance Criteria:**
- ✓ Dashboard widget: "Bills Processed This Month"
- ✓ Total value of all bills
- ✓ Average savings per bill (vs. manual pricing)
- ✓ Most common project types
- ✓ Time saved (estimated)

**Component:** `MainDashboard.tsx` stats section

---

### Feature 6.2: Admin Analytics

**User Story 6.2.1: View Platform Metrics**
```
AS AN admin
I WANT TO see key platform metrics on my dashboard
SO THAT I can monitor growth and performance
```

**Acceptance Criteria:**
- ✓ Total contractors (approved, pending, rejected)
- ✓ Total suppliers (approved, pending, rejected)
- ✓ BOQs processed (today, this week, this month)
- ✓ Revenue (MTD, YTD)
- ✓ Active users (daily, monthly)
- ✓ Subscription tier breakdown
- ✓ Payment method distribution

**Component:** `AdminDashboard.tsx` stats cards

---

### Feature 6.3: Partner Analytics

**User Story 6.3.1: Track Partner Revenue**
```
AS A partner (white-label client)
I WANT TO see my revenue share and user metrics
SO THAT I can assess the partnership ROI
```

**Acceptance Criteria:**
- ✓ Revenue this month (MTD)
- ✓ Revenue share percentage
- ✓ Active users on white-label platform
- ✓ BOQs processed via API
- ✓ Customer breakdown by tier (FREE, PROF, ENT)
- ✓ API usage metrics (requests, rate limits)
- ✓ Export to CSV

**Component:** `PartnerPortal.tsx` analytics section

---

### Feature 6.4: Proposal & Pitch Generation

**User Story 6.4.1: Generate Investor Pitch Deck**
```
AS AN admin
I WANT TO generate a professional investor pitch deck
SO THAT I can raise capital or pitch to partners
```

**Acceptance Criteria:**
- ✓ 12-slide PowerPoint deck
- ✓ Sections: Problem, Solution, Market, Product, Traction, Team, Financials, Ask
- ✓ Qilly branding
- ✓ Data pulled from platform metrics
- ✓ Editable slides
- ✓ Export to PPTX

**Component:** `InvestorPitchDeckGenerator.tsx`

---

**User Story 6.4.2: Generate Business Proposal**
```
AS AN admin
I WANT TO generate a business proposal for a potential partner
SO THAT I can win white-label deals
```

**Acceptance Criteria:**
- ✓ Word document (DOCX)
- ✓ Sections: Executive Summary, About Qilly, Partnership Model, Revenue Share, Implementation, Support
- ✓ Customizable partner name and details
- ✓ Financial projections
- ✓ Export to DOCX

**Component:** `QillyProposalGenerator.tsx`, `ProposalPage.tsx`

---

---

## EPIC 7: TEAM & COLLABORATION

**Business Goal:** Enable multi-user access for Enterprise contractors to collaborate on BOQs.

---

### Feature 7.1: Team Management

**User Story 7.1.1: Add Team Members**
```
AS AN ENTERPRISE tier contractor
I WANT TO add team members to my account
SO THAT multiple estimators can work on BOQs simultaneously
```

**Acceptance Criteria:**
- ✓ "Team Management" tab in MainDashboard (Enterprise only)
- ✓ "Add Member" button
- ✓ Input: Name, email, role (Admin, Estimator, Viewer)
- ✓ Send invitation email
- ✓ Member creates password and logs in
- ✓ Shared access to contractor's bills and templates
- ✓ Tier limits enforced (Professional: 2 users, Enterprise: 5+ users)

**Component:** `TeamManagement.tsx`  
**Database:** `team_members` table (foreign key to `contractors.id`)

---

**User Story 7.1.2: Manage Team Permissions**
```
AS A contractor account admin
I WANT TO set permissions for each team member
SO THAT I can control who can approve bills or change settings
```

**Acceptance Criteria:**
- ✓ Roles: Admin (full access), Estimator (create/edit bills), Viewer (read-only)
- ✓ Edit role from team management page
- ✓ Remove team member
- ✓ Permission enforcement on all operations

**Component:** `TeamManagement.tsx`

---

---

## EPIC 8: PARTNER INTEGRATION

**Business Goal:** Enable construction software partners to integrate Qilly via white-label and API.

---

### Feature 8.1: Partner Portal & Configuration

**User Story 8.1.1: Configure White-Label Settings**
```
AS A partner (Procore, BuildSmart, etc.)
I WANT TO configure my white-label instance of Qilly
SO THAT my customers see my branding
```

**Acceptance Criteria:**
- ✓ Custom domain input (e.g., pricing.procore.com)
- ✓ Brand color picker (primary, secondary, accent)
- ✓ Logo upload
- ✓ Support email input
- ✓ Revenue share percentage display (20-40%)
- ✓ Preview white-label instance
- ✓ Save configuration

**Component:** `PartnerPortal.tsx` - White-Label Config section

---

### Feature 8.2: API Integration

**User Story 8.2.1: Generate API Key**
```
AS A partner developer
I WANT TO generate an API key
SO THAT I can integrate Qilly BOQ pricing into my software
```

**Acceptance Criteria:**
- ✓ "Generate API Key" button
- ✓ API key displayed (one-time only, cannot be retrieved again)
- ✓ Regenerate key option (invalidates old key)
- ✓ API key stored securely (hashed)
- ✓ Rate limits assigned based on tier (PROF: 100 req/min, ENT: 500 req/min, CUSTOM: unlimited)

**Component:** `PartnerPortal.tsx` - API Integration section

---

**User Story 8.2.2: View API Documentation**
```
AS A partner developer
I WANT TO view API documentation and code samples
SO THAT I can integrate quickly
```

**Acceptance Criteria:**
- ✓ RESTful API endpoints documented
- ✓ Example requests and responses
- ✓ Authentication guide (Bearer token)
- ✓ Rate limit information
- ✓ Webhook documentation
- ✓ Node.js SDK code samples (`npm install @qilly/sdk`)
- ✓ Error code reference

**Component:** `PartnerPortal.tsx` - API Docs section

---

**User Story 8.2.3: Configure Webhooks**
```
AS A partner
I WANT TO set up webhooks for BOQ events
SO THAT I can be notified when BOQs are uploaded, priced, or exported
```

**Acceptance Criteria:**
- ✓ Webhook URL input
- ✓ Event selection: `boq.uploaded`, `boq.priced`, `boq.exported`, `payment.completed`
- ✓ Test webhook button
- ✓ Webhook logs (delivery status, response code)
- ✓ Retry logic on failure

**Component:** `PartnerPortal.tsx` - Webhooks section

---

---

## EPIC 9: ADMIN & PLATFORM MANAGEMENT

**Business Goal:** Provide admins with tools to manage users, monitor platform health, and maintain compliance.

---

### Feature 9.1: Contractor Approval

**User Story 9.1.1: Review Pending Contractors** (covered in Epic 1)

**User Story 9.1.2: Verify CIDB Registration**
```
AS AN admin
I WANT TO verify a contractor's CIDB registration number
SO THAT I ensure only legitimate contractors use the platform
```

**Acceptance Criteria:**
- ✓ Contractor table shows CIDB class and grade
- ✓ Manual verification against CIDB database (external link)
- ✓ Flag contractors with invalid/expired CIDB
- ✓ Reject option with reason: "Invalid CIDB registration"
- ✓ Notification sent to contractor

**Component:** `AdminDashboard.tsx` - Contractors tab

---

### Feature 9.2: Supplier Approval (covered in Epic 3.1.2)

---

### Feature 9.3: Database Management

**User Story 9.3.1: Inspect Database Tables**
```
AS AN admin
I WANT TO browse database tables and records
SO THAT I can troubleshoot issues and verify data integrity
```

**Acceptance Criteria:**
- ✓ Table list: users, contractors, suppliers, bills, bill_items, supplier_products, subscriptions
- ✓ Select table to view records
- ✓ Pagination (50 records per page)
- ✓ Search within table
- ✓ Export table to CSV
- ✓ View record details (modal)

**Component:** `DatabaseInspector.tsx`

---

**User Story 9.3.2: Set Up Database Schema**
```
AS AN admin during initial deployment
I WANT TO run database setup scripts
SO THAT all tables, indexes, and policies are created correctly
```

**Acceptance Criteria:**
- ✓ "Database Setup" tab in AdminDashboard (dev/staging only)
- ✓ Run migration script buttons
- ✓ Scripts: Create tables, Add RLS policies, Create indexes, Seed data
- ✓ Success/failure feedback
- ✓ Rollback option
- ✓ SQL script preview

**Component:** `DatabaseSetup.tsx`  
**SQL Scripts:** `/supabase/migrations/`

---

### Feature 9.4: User Session Management

**User Story 9.4.1: View Active Sessions**
```
AS AN admin
I WANT TO see all active user sessions
SO THAT I can monitor platform usage and identify suspicious activity
```

**Acceptance Criteria:**
- ✓ Session list: User email, login time, IP address, device
- ✓ Sort by login time (newest first)
- ✓ Filter by user type (contractor, supplier, admin)
- ✓ "Force Logout" button
- ✓ Session security audit log

**Component:** `UserSessionViewer.tsx`

---

### Feature 9.5: Performance Testing

**User Story 9.5.1: Run Stress Tests**
```
AS AN admin
I WANT TO run performance stress tests
SO THAT I can ensure the platform can handle peak load
```

**Acceptance Criteria:**
- ✓ Performance test launcher
- ✓ Test scenarios: BOQ upload, pricing calculation, concurrent users
- ✓ Load simulation: 10, 50, 100, 500 concurrent users
- ✓ Metrics: Response time, error rate, throughput
- ✓ Results dashboard with charts
- ✓ Export results to PDF

**Component:** `PerformanceTestLauncher.tsx`, `PerformanceStressTest.tsx`

---

### Feature 9.6: UI Automation Testing

**User Story 9.6.1: Run Automated UI Tests**
```
AS AN admin or QA engineer
I WANT TO run automated UI tests
SO THAT I can verify all user flows work correctly after deployments
```

**Acceptance Criteria:**
- ✓ Test suite: Login, BOQ upload, BOQ processing, payment, signup flows
- ✓ Automated form filling
- ✓ Element visibility checks
- ✓ Navigation tests
- ✓ Results: Pass/Fail per test
- ✓ Screenshot capture on failure
- ✓ Export test report

**Component:** `UIAutomationLauncher.tsx`, `UIAutomationTester.tsx`

---

### Feature 9.7: Deployment Resources

**User Story 9.7.1: Access Deployment Documentation**
```
AS A DevOps engineer
I WANT TO access deployment guides and architecture documentation
SO THAT I can deploy Qilly to production correctly
```

**Acceptance Criteria:**
- ✓ Deployment checklist (pre-deployment, deployment, post-deployment)
- ✓ Architecture diagram (10-page PDF)
- ✓ Environment variable guide
- ✓ Supabase setup instructions
- ✓ Vercel configuration guide
- ✓ DNS and domain setup
- ✓ Troubleshooting guide

**Component:** `DeploymentResources.tsx`  
**Docs:** `/DEPLOYMENT_CHECKLIST.md`, `/DEPLOYMENT.md`

---

### Feature 9.8: Capital Raising Tools

**User Story 9.8.1: Access DHS Funding Proposal**
```
AS AN admin preparing for fundraising
I WANT TO view the DHS funding proposal
SO THAT I can understand how Qilly aligns with government priorities
```

**Acceptance Criteria:**
- ✓ Capital Raising Guide page
- ✓ Sections: DHS program overview, Qilly value proposition, funding ask, use of funds, ROI projections
- ✓ 5-year financial model
- ✓ Export to PDF for investor meetings

**Component:** `CapitalRaisingGuide.tsx`

---

---

## EPIC 10: GREEN BUILDING & SUSTAINABILITY

**Business Goal:** Position Qilly as a leader in sustainable construction cost management by providing carbon tracking and green building compliance features.

---

### Feature 10.1: Carbon Emissions Tracking (covered in Epic 5.1)

---

### Feature 10.2: Green Dashboard

**User Story 10.2.1: View Green Building Metrics**
```
AS A contractor focused on sustainability
I WANT TO see a dedicated green building dashboard
SO THAT I can track my environmental impact across all projects
```

**Acceptance Criteria:**
- ✓ Dashboard cards: Total carbon saved, Green score average, Projects with eco-alternatives
- ✓ Charts: Carbon trend over time, Green vs. standard projects
- ✓ Leaderboard: Top green projects
- ✓ DHS Green Building Initiative compliance badge
- ✓ Export sustainability report

**Component:** `GreenDashboard.tsx`

---

### Feature 10.3: Eco-Friendly Material Suggestions

**User Story 10.3.1: Receive Green Alternatives**
```
AS A contractor
I WANT TO see eco-friendly alternatives for my BOQ items
SO THAT I can reduce my project's carbon footprint
```

**Acceptance Criteria:**
- ✓ For each BOQ item, suggest green alternative (e.g., recycled aggregate instead of virgin aggregate)
- ✓ Show carbon savings (tCO2e)
- ✓ Show price difference (% more or less expensive)
- ✓ "Use Alternative" button swaps item
- ✓ Recalculate total with green alternatives

**Component:** `RegionalPricedBillView.tsx`, `GreenDashboard.tsx`

---

---

## SUMMARY: EPIC OVERVIEW

| Epic | Features | User Stories | Priority | Status |
|------|----------|--------------|----------|--------|
| 1. Onboarding & Auth | 4 | 13 | P0 | ✅ Complete |
| 2. BOQ Processing | 5 | 14 | P0 | ✅ Complete |
| 3. Supplier Management | 5 | 8 | P0 | ✅ Complete |
| 4. Payment & Subscriptions | 5 | 9 | P0 | ✅ Complete |
| 5. Compliance | 6 | 8 | P1 | ✅ Complete |
| 6. Analytics & Reporting | 4 | 4 | P1 | ✅ Complete |
| 7. Team & Collaboration | 1 | 2 | P2 | ✅ Complete |
| 8. Partner Integration | 2 | 4 | P2 | ✅ Complete |
| 9. Admin & Platform Mgmt | 8 | 10 | P1 | ✅ Complete |
| 10. Green Building | 3 | 3 | P1 | ✅ Complete |
| **TOTAL** | **43** | **75** | — | **100%** |

---

## PRIORITIZATION FRAMEWORK

**P0 (Must Have - Launch Blockers):**
- User authentication and registration
- BOQ upload and pricing
- Supplier network and matching
- Payment processing
- Basic compliance (POPIA)

**P1 (Should Have - Launch Soon After):**
- Full compliance suite (eTender, collusion, environmental)
- Analytics and reporting
- Admin management tools
- Green building features

**P2 (Nice to Have - Post-Launch):**
- Team collaboration
- Partner white-label
- Advanced analytics
- AI drawing extraction

---

## VERSION HISTORY

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-05-06 | Initial comprehensive documentation | Claude Code |

---

**Next Steps:**
1. Review and validate all user stories with stakeholders
2. Create detailed test cases (see TEST_CASES.md)
3. Prioritize backlog for security fixes (see PRODUCTION_READINESS_REPORT.md)
4. Define acceptance testing criteria
5. Plan sprint iterations

---

*Document maintained by Qilly Product Team*  
*For questions: product@qilly.co.za*
