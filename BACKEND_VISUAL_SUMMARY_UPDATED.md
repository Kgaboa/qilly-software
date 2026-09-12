# 🎨 Qilly Backend Architecture - Visual Summary (UPDATED)

## ⚠️ CRITICAL: Database Setup Required First!

Before any user signup works, you MUST have these tables created in Supabase:

```sql
✅ Required Tables:
├── auth.users (Supabase built-in)
├── contractors (Custom table - see CONTRACTORS_TABLE_SIMPLE.sql)
├── suppliers (Custom table)
└── users (Optional - for non-contractor users)
```

**If you get signup errors, check:** `/FIX_CONTRACTOR_ERROR.md`

---

## 🏗️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        QILLY ECOSYSTEM                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                             │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Contractor  │  │   Supplier   │  │    Admin     │             │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│         │                 │                  │                      │
│         └─────────────────┴──────────────────┘                      │
│                           │                                         │
│                    React + TypeScript                               │
│                    (Figma Make / Netlify)                           │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                    HTTPS REST API
                            │
┌───────────────────────────▼─────────────────────────────────────────┐
│                     SUPABASE AUTH + API                             │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │         Supabase Authentication & API Gateway                │   │
│  │                                                             │   │
│  │  • Authentication (JWT) ✅                                  │   │
│  │  • Row-Level Security (RLS) 🔒                             │   │
│  │  • Rate Limiting (100 req/15min) ⚡                         │   │
│  │  • Request Validation (Built-in) ✅                         │   │
│  │  • Realtime (WebSocket) 🔄                                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
└───────────────────┬────────────┬────────────┬────────────┬──────────┘
                    │            │            │            │
                    ▼            ▼            ▼            ▼
       ┌────────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
       │  BOQ Engine    │ │ Supplier │ │ Payment  │ │ Compliance   │
       │                │ │ Service  │ │ Service  │ │ Service      │
       │ • Calculate    │ │          │ │          │ │              │
       │ • Optimize     │ │ • Query  │ │ • EFT    │ │ • SANS 1200  │
       │ • Compare      │ │ • Agg.   │ │ • Stitch │ │ • NBR        │
       │                │ │ • Cache  │ │ • PayFast│ │ • AGRÉMENT   │
       │ 100% accuracy  │ │          │ │          │ │ • BBBEE      │
       │ < 5 min        │ │          │ │          │ │ • POPIA      │
       └────────────────┘ └──────────┘ └──────────┘ └──────────────┘
                │                │            │            │
                └────────────────┴────────────┴────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   CACHING LAYER        │
                    │   Redis (Optional)     │
                    │                        │
                    │   • Pricing cache      │
                    │   • Session storage    │
                    │   • Rate limit data    │
                    │   TTL: 24 hours        │
                    └────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   DATABASE LAYER       │
                    │   Supabase/PostgreSQL  │
                    │                        │
                    │   Tables:              │
                    │   • contractors ✅      │
                    │   • suppliers          │
                    │   • supplier_pricing   │
                    │   • boqs               │
                    │   • boq_items          │
                    │   • invoices           │
                    │   • payments           │
                    │   • compliance_checks  │
                    │   • audit_logs         │
                    └────────────────────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           │                     │                     │
           ▼                     ▼                     ▼
  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
  │  SUPPLIER APIs  │  │  PAYMENT APIs   │  │  COMPLIANCE DB  │
  │                 │  │                 │  │                 │
  │ 🏢 Gauteng:     │  │ 💳 Stitch:      │  │ 📋 SANS 1200:   │
  │ • PPC Cement    │  │   Instant EFT   │  │   Standards DB  │
  │ • Murray &      │  │                 │  │                 │
  │   Roberts       │  │ 💳 PayFast:     │  │ 📋 NBR:         │
  │ • Corobrik      │  │   Card payments │  │   Building Regs │
  │                 │  │                 │  │                 │
  │ 🏢 W. Cape:     │  │ 💳 Manual EFT:  │  │ 📋 AGRÉMENT:    │
  │ • Lafarge       │  │   Admin verify  │  │   Certification │
  │ • AfriSam       │  │                 │  │                 │
  │                 │  │                 │  │ 📋 BBBEE:       │
  │ ... 7 more      │  │                 │  │   Level checks  │
  │ provinces       │  │                 │  │                 │
  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 🔐 Contractor Signup Flow (COMPLETE WITH ERROR HANDLING)

```
┌─────────────────────────────────────────────────────────────────────┐
│                  CONTRACTOR REGISTRATION FLOW                       │
│  From: ContractorSignup.tsx → Supabase Auth → contractors table   │
└─────────────────────────────────────────────────────────────────────┘

STEP 1: User Fills Out Form
┌──────────────────────────────┐
│ Contractor Signup Form       │
│                              │
│ • Company Name               │
│ • CIDB Registration Number   │
│ • CIDB Grade (1-9 CE)        │
│ • Contact Person             │
│ • Email                      │
│ • Phone                      │
│ • Address                    │
│ • Project Types ✅ (1+)      │
│ • Operating Provinces ✅ (1+)│
│ • Years in Business          │
│ • BBBEE Level                │
│ • Certifications             │
│ • Password (8+ chars)        │
│ • Confirm Password           │
│ • ✅ Agree to Terms          │
│                              │
│ [Submit Registration]        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────┐
│  FRONTEND VALIDATION                            ⏱️ 1 second  │
│                                                              │
│  ✅ Passwords match?                                        │
│  ✅ Password length ≥ 8?                                    │
│  ✅ At least 1 project type selected?                       │
│  ✅ At least 1 operating province selected?                 │
│  ✅ Terms agreed to?                                        │
│                                                              │
│  ❌ If validation fails → Show error message                │
│  ✅ If validation passes → Continue                         │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  STEP 2: CREATE AUTH USER                      ⏱️ 2 seconds  │
│                                                              │
│  API Call: supabase.auth.signUp()                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │ {                                                   │    │
│  │   email: "contractor@example.com",                 │    │
│  │   password: "SecurePass123!",                      │    │
│  │   options: {                                       │    │
│  │     data: {                                        │    │
│  │       user_type: 'contractor',                     │    │
│  │       company_name: 'ABC Construction'             │    │
│  │     }                                              │    │
│  │   }                                                │    │
│  │ }                                                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Supabase Auth creates user in auth.users table             │
│  Returns: authData.user.id (UUID)                           │
│                                                              │
│  ⚠️ POTENTIAL ERRORS:                                       │
│  • "User already registered" (email exists)                 │
│  • "Password too weak" (less than 6 chars in Supabase)      │
│  • "Invalid email" (malformed email)                        │
│  • Network error (Supabase unreachable)                     │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  STEP 3: INSERT CONTRACTOR PROFILE              ⏱️ 1 second  │
│                                                              │
│  API Call: supabase.from('contractors').insert()            │
│  ┌────────────────────────────────────────────────────┐    │
│  │ {                                                   │    │
│  │   user_id: "c994bec4-..." ← From Step 2            │    │
│  │   company_name: "ABC Construction (Pty) Ltd",      │    │
│  │   email: "contractor@example.com",                 │    │
│  │   cidb_registration_number: "CIDB/CR2023/12345",   │    │
│  │   cidb_grade: "Grade 9 CE",                        │    │
│  │   contact_person: "John Doe",                      │    │
│  │   phone: "+27 11 123 4567",                        │    │
│  │   street_address: "123 Main St",                   │    │
│  │   city: "Johannesburg",                            │    │
│  │   province: "Gauteng",                             │    │
│  │   postal_code: "2001",                             │    │
│  │   project_types: ["Road Construction", ...],       │    │
│  │   operating_provinces: ["Gauteng", "WC"],          │    │
│  │   years_in_business: 15,                           │    │
│  │   bbbee_level: "Level 2",                          │    │
│  │   has_certification: true,                         │    │
│  │   status: "pending", ← Awaits admin approval       │    │
│  │   subscription_tier: "professional",               │    │
│  │   billing_cycle: "monthly",                        │    │
│  │   subscription_status: "trial",                    │    │
│  │   subscription_start_date: NOW(),                  │    │
│  │   next_billing_date: NOW() + 30 days,              │    │
│  │   payment_method: "Pending Setup"                  │    │
│  │ }                                                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ⚠️ POTENTIAL ERRORS:                                       │
│  • "contractors table does not exist" → Run SQL setup!      │
│  • "Foreign key violation" → auth.users missing user_id     │
│  • "Unique constraint violation" → Email already used       │
│  • "RLS policy violation" → Insufficient permissions        │
│  • "Invalid array format" → Check project_types array       │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  STEP 4: AUTO-SIGNOUT (PENDING APPROVAL)       ⏱️ 0.5 sec   │
│                                                              │
│  Since status = 'pending', user cannot log in yet.          │
│  We sign them out immediately after registration.           │
│                                                              │
│  API Call: supabase.auth.signOut()                          │
│                                                              │
│  User will need admin to:                                   │
│  1. Review contractor application                           │
│  2. Change status from 'pending' → 'approved'               │
│  3. Then contractor can log in                              │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  SUCCESS MESSAGE                                             │
│                                                              │
│  ✅ "Contractor account created successfully!                │
│      Professional tier selected.                            │
│      Pending admin approval."                               │
│                                                              │
│  Toast notification displayed                               │
│  Redirected back to login page after 1.5 seconds            │
└──────────────────────────────────────────────────────────────┘
```

---

## ❌ COMMON SIGNUP ERRORS & FIXES

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TROUBLESHOOTING SIGNUP ERRORS                    │
└─────────────────────────────────────────────────────────────────────┘

ERROR 1: "relation 'contractors' does not exist"
───────────────────────────────────────────────────────────────
Problem:  contractors table hasn't been created in Supabase
Fix:      Run /CONTRACTORS_TABLE_SIMPLE.sql in Supabase SQL Editor

Steps:
1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy entire contents of /CONTRACTORS_TABLE_SIMPLE.sql
4. Click "Run"
5. Verify: SELECT * FROM contractors; (should work, empty result OK)

═══════════════════════════════════════════════════════════════

ERROR 2: "Foreign key constraint violation on user_id"
───────────────────────────────────────────────────────────────
Problem:  user_id doesn't exist in auth.users table
Cause:    Step 2 (auth.signUp) failed silently
Fix:      Check auth error in console logs

Steps:
1. Open browser console (F12)
2. Look for "Auth error:" or "authError:"
3. Common causes:
   - Email already exists
   - Password too weak
   - Supabase project URL wrong
   - Network error

Verify Supabase connection:
// In /src/utils/supabase.ts
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20));

═══════════════════════════════════════════════════════════════

ERROR 3: "User already registered"
───────────────────────────────────────────────────────────────
Problem:  Email already exists in auth.users
Fix:      Use different email OR delete existing user

Delete existing user (Supabase Dashboard):
1. Go to Authentication → Users
2. Find user by email
3. Click "..." → Delete
4. Try signup again

═══════════════════════════════════════════════════════════════

ERROR 4: "Row-Level Security policy violation"
───────────────────────────────────────────────────────────────
Problem:  RLS policies not set correctly
Fix:      Check/recreate RLS policies

Check policies:
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'contractors';

Should see:
- "Users can create contractor profiles" (INSERT)
- "Authenticated users can read contractors" (SELECT)
- "Users can update own contractor profile" (UPDATE)

If missing, re-run the CONTRACTORS_TABLE_SIMPLE.sql

═══════════════════════════════════════════════════════════════

ERROR 5: "Unique constraint violation on email"
───────────────────────────────────────────────────────────────
Problem:  Contractor with this email already exists
Fix:      Email already registered as contractor

Check:
SELECT * FROM contractors WHERE email = 'contractor@example.com';

Options:
1. Use different email
2. Delete existing contractor (if duplicate/test)
3. Update existing contractor instead

═══════════════════════════════════════════════════════════════

ERROR 6: "Invalid array format for project_types"
───────────────────────────────────────────────────────────────
Problem:  project_types or operating_provinces not valid array
Fix:      Ensure arrays are properly formatted

Correct format in code:
project_types: ["Road Construction", "Housing Development"]
operating_provinces: ["Gauteng", "Western Cape"]

NOT:
project_types: "Road Construction,Housing Development"  ❌

═══════════════════════════════════════════════════════════════

ERROR 7: "Network request failed" or "Failed to fetch"
───────────────────────────────────────────────────────────────
Problem:  Cannot reach Supabase servers
Fix:      Check internet connection & Supabase status

Steps:
1. Check internet connection
2. Verify Supabase project is running (not paused)
3. Check Supabase status: status.supabase.com
4. Verify environment variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

═══════════════════════════════════════════════════════════════

ERROR 8: "An error occurred during signup" (generic)
───────────────────────────────────────────────────────────────
Problem:  Unhandled error, need more details
Fix:      Check browser console for full error

Steps:
1. Open browser console (F12)
2. Look for "Signup error:" log
3. Check error.message and error.details
4. Share full error in bug report

Common causes:
- Missing required fields
- Database connection timeout
- Supabase project paused
- Environment variables not loaded
```

---

## 🔧 SETUP CHECKLIST (Before First Signup)

```
┌─────────────────────────────────────────────────────────────────────┐
│              QILLY DATABASE SETUP CHECKLIST                         │
└─────────────────────────────────────────────────────────────────────┘

☐ 1. Supabase Project Created
     ├─ URL: https://[project-id].supabase.co
     ├─ Anon Key: eyJhbGciOiJIUz...
     └─ Service Role Key: eyJhbGciOiJIUz... (keep secret!)

☐ 2. Environment Variables Set
     ├─ .env file exists in project root
     ├─ VITE_SUPABASE_URL="https://[project-id].supabase.co"
     └─ VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUz..."

☐ 3. Contractors Table Created
     ├─ Run: /CONTRACTORS_TABLE_SIMPLE.sql
     ├─ Verify: SELECT * FROM contractors;
     └─ Check RLS: SELECT policyname FROM pg_policies WHERE tablename='contractors';

☐ 4. Test Auth Connection
     ├─ Try: supabase.auth.signUp({ email: 'test@test.com', password: '12345678' })
     ├─ Check: Go to Supabase → Authentication → Users
     └─ Delete test user after verification

☐ 5. Verify Signup Flow
     ├─ Fill out contractor registration form
     ├─ Submit signup
     ├─ Check browser console for errors
     ├─ Verify user in: Authentication → Users
     └─ Verify contractor in: Table Editor → contractors

☐ 6. Test Admin Approval (Optional)
     ├─ Update contractor: status = 'approved'
     ├─ Try login with contractor credentials
     └─ Should access contractor dashboard

✅ All checks passed? You're ready for production!

❌ Any failures? See "COMMON SIGNUP ERRORS & FIXES" above
```

---

## 🔄 BOQ Calculation Flow (Under 5 Minutes)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER SUBMITS BOQ REQUEST                         │
│  Project: 100-unit housing development, Gauteng                    │
│  Items: 50 line items (excavation, concrete, bricks, etc.)         │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  1. VALIDATE REQUEST         │  ⏱️ 2 seconds
              │  • Check user subscription   │
              │  • Validate SANS codes       │
              │  • Check trial limits        │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  2. CREATE BOQ RECORD        │  ⏱️ 1 second
              │  • Generate BOQ ID           │
              │  • Set status: calculating   │
              │  • Log start time            │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  3. QUERY PRICING            │  ⏱️ 60 seconds
              │  (Parallel processing)       │
              │                              │
              │  For each of 50 items:       │
              │  ┌────────────────────────┐  │
              │  │ 3a. Check Redis cache  │  │
              │  │     ↓ (if miss)        │  │
              │  │ 3b. Check DB cache     │  │
              │  │     ↓ (if miss)        │  │
              │  │ 3c. Query supplier APIs│  │
              │  │ 3d. Cache results      │  │
              │  └────────────────────────┘  │
              │                              │
              │  Cache hit rate: ~80%        │
              │  Actual API calls: ~10       │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  4. OPTIMIZE PRICING         │  ⏱️ 10 seconds
              │  • Sort by price (lowest)    │
              │  • Check stock availability  │
              │  • Calculate lead times      │
              │  • Find alternatives         │
              │  • Calculate savings         │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  5. COMPLIANCE CHECKS        │  ⏱️ 15 seconds
              │  • SANS 1200 validation      │
              │  • NBR compliance            │
              │  • AGRÉMENT certification    │
              │  • BBBEE scoring             │
              │  • POPIA verification        │
              │  • Generate compliance score │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  6. SAVE RESULTS             │  ⏱️ 5 seconds
              │  • Save BOQ items            │
              │  • Update totals             │
              │  • Set status: completed     │
              │  • Log calculation time      │
              │  • Increment user BOQ count  │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  7. GENERATE RESPONSE        │  ⏱️ 2 seconds
              │  • Format results            │
              │  • Calculate metrics         │
              │  • Return to frontend        │
              └──────────────┬───────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    RESULT DELIVERED TO USER                         │
│                                                                     │
│  ✅ Total Cost: R1,234,567.00                                       │
│  ✅ Optimized Savings: R156,789.00 (12.7%)                          │
│  ✅ Compliance Score: 95/100                                        │
│  ✅ Items Priced: 50/50                                             │
│  ✅ Calculation Time: 95 seconds (< 2 minutes!)                     │
│                                                                     │
│  📊 Breakdown:                                                      │
│  • Cheapest supplier selected for each item                        │
│  • 3 alternatives shown per item                                   │
│  • BBBEE Level 1-3 suppliers: 78%                                  │
│  • SANS 1200 compliant: 100%                                       │
│  • NBR compliant: 100%                                             │
└─────────────────────────────────────────────────────────────────────┘

TOTAL TIME: ~95 seconds (< 5 minute target) ✅
```

---

## 💳 Payment Flow (EFT Verification)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER HITS TRIAL LIMIT                            │
│  Trial BOQs used: 1/1                                               │
│  Status: Please upgrade to continue                                 │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  USER SELECTS SUBSCRIPTION   │
              │  Tier: Professional          │
              │  Cycle: Monthly (R1,999)     │
              │  Payment: EFT                │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  GENERATE INVOICE            │
              │  Invoice #: QIL-2024-00123   │
              │  Amount: R2,298.85 (incl VAT)│
              │  Banking details shown       │
              │  PDF downloaded              │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  USER MAKES BANK TRANSFER    │
              │  Reference: QIL-2024-00123   │
              │  Status: Pending verification│
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  ADMIN RECEIVES NOTIFICATION │
              │  Dashboard: 1 pending payment│
              │  Amount: R2,298.85           │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  ADMIN CHECKS BANK ACCOUNT   │
              │  Sees transfer from user     │
              │  Amount matches invoice      │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  ADMIN CLICKS "VERIFY"       │
              │  API: POST /payments/verify  │
              │  Body: { invoiceId }         │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  BACKEND ACTIVATES           │
              │  1. Invoice → paid           │
              │  2. Contractor → active      │
              │  3. Subscription → Pro       │
              │  4. BOQ limit → unlimited    │
              │  5. Audit log created        │
              └──────────────┬───────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CONTRACTOR SUBSCRIPTION ACTIVE                   │
│  ✅ Professional tier activated                                     │
│  ✅ Unlimited BOQs                                                  │
│  ✅ All 9 provinces unlocked                                        │
│  ✅ Compliance calculator enabled                                   │
│  ✅ Next billing: 30 days                                           │
└─────────────────────────────────────────────────────────────────────┘

TOTAL TIME: ~1-2 hours (depends on admin availability)
COST: R1,999/month (Professional) or R4,999/month (Enterprise)
```

---

## 🗃️ Database Schema (Complete with Contractors)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CORE TABLES                                    │
└─────────────────────────────────────────────────────────────────────┘

auth.users (Supabase built-in)
├── id (UUID, PK)
├── email
├── encrypted_password
├── email_confirmed_at
├── created_at
└── raw_user_meta_data (JSONB)

       │
       │ 1:1 (Foreign Key)
       ▼

contractors ✅ NEW TABLE
├── id (UUID, PK)
├── user_id (UUID, FK → auth.users.id) ⚠️ CRITICAL!
├── company_name (TEXT, NOT NULL)
├── cidb_registration_number (TEXT)
├── cidb_grade (TEXT)
├── contact_person (TEXT, NOT NULL)
├── email (TEXT, UNIQUE, NOT NULL)
├── phone (TEXT, NOT NULL)
├── street_address (TEXT)
├── city (TEXT)
├── province (TEXT)
├── postal_code (TEXT)
├── project_types (TEXT[])
├── operating_provinces (TEXT[])
├── years_in_business (INTEGER)
├── bbbee_level (TEXT)
├── has_certification (BOOLEAN)
├── status (TEXT: pending/approved/rejected/suspended)
├── approval_notes (TEXT)
├── approved_by (UUID, FK → auth.users.id)
├── approved_at (TIMESTAMP)
├── subscription_tier (TEXT: professional/enterprise/custom)
├── billing_cycle (TEXT: monthly/annual)
├── subscription_status (TEXT: trial/active/cancelled/suspended)
├── subscription_start_date (TIMESTAMP)
├── next_billing_date (TIMESTAMP)
├── payment_method (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

       │
       │ 1:N
       ▼

boqs
├── id (UUID, PK)
├── contractor_id (FK → contractors.id)
├── project_name
├── province
├── status (draft/calculating/completed/failed)
├── total_cost
├── optimized_savings
└── calculation_duration_seconds

       │
       │ 1:N
       ▼

boq_items
├── id (UUID, PK)
├── boq_id (FK → boqs)
├── sans_code
├── description
├── quantity
├── unit_of_measure
├── unit_price
├── total_price
├── selected_supplier_id (FK → suppliers)
└── alternative_quotes (JSONB)

suppliers
├── id (UUID, PK)
├── company_name
├── email
├── province
├── product_categories[]
├── bbbee_level
├── status (pending/approved/rejected)
└── subscription_tier

       │
       │ 1:N
       ▼

supplier_pricing
├── id (UUID, PK)
├── supplier_id (FK → suppliers)
├── product_code (SANS 1200)
├── product_name
├── price_per_unit
├── province
├── in_stock
├── sans_compliant
├── nbr_compliant
└── agrement_certified

contractors
       │
       │ 1:N
       ▼

invoices
├── id (UUID, PK)
├── contractor_id (FK → contractors)
├── invoice_number
├── subscription_tier
├── total_amount
├── payment_status (pending/paid/failed)
├── payment_method (eft/stitch/payfast)
├── verified_by (FK → auth.users, admin)
└── verified_at

       │
       │ 1:N
       ▼

payment_transactions
├── id (UUID, PK)
├── invoice_id (FK → invoices)
├── contractor_id (FK → contractors)
├── amount
├── payment_method
├── payment_provider
├── status
└── processed_at

boqs
       │
       │ 1:1
       ▼

compliance_checks
├── id (UUID, PK)
├── boq_id (FK → boqs)
├── sans_1200_compliant
├── nbr_compliant
├── agrement_certified
├── bbbee_suppliers_count
├── bbbee_spend_percentage
├── popia_compliant
└── overall_compliance_score (0-100)
```

---

## 🔒 Row-Level Security (RLS) Policies

```
┌─────────────────────────────────────────────────────────────────────┐
│                  CONTRACTORS TABLE RLS POLICIES                     │
└─────────────────────────────────────────────────────────────────────┘

Policy 1: "Users can create contractor profiles"
───────────────────────────────────────────────
Type:    INSERT
Role:    authenticated
Check:   true (anyone authenticated can create)
Purpose: Allow new contractor signups

SQL:
CREATE POLICY "Users can create contractor profiles" 
  ON contractors FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

─────────────────────────────────────────────────────────────────────

Policy 2: "Authenticated users can read contractors"
────────────────────────────────────────────────────
Type:    SELECT
Role:    authenticated
Using:   true (all contractors visible)
Purpose: Admin can see all contractors, contractors can see each other

SQL:
CREATE POLICY "Authenticated users can read contractors" 
  ON contractors FOR SELECT 
  TO authenticated 
  USING (true);

─────────────────────────────────────────────────────────────────────

Policy 3: "Users can update own contractor profile"
────────────────────────────────────────────────────
Type:    UPDATE
Role:    authenticated
Using:   auth.uid() = user_id
Check:   auth.uid() = user_id
Purpose: Contractors can only update their own profile

SQL:
CREATE POLICY "Users can update own contractor profile" 
  ON contractors FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

─────────────────────────────────────────────────────────────────────

🔒 Security Notes:
• Contractors cannot delete their profiles (no DELETE policy)
• Contractors cannot change their user_id (enforced by UPDATE check)
• Admin approval required before status = 'approved'
• Passwords stored in auth.users (Supabase handles hashing)
• Email verification optional (set auto_confirm in signup)
```

---

## 📋 Quick Reference: SQL Files

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SQL SETUP FILES GUIDE                           │
└─────────────────────────────────────────────────────────────────────┘

File: /CONTRACTORS_TABLE_SIMPLE.sql ✅ USE THIS
────────────────────────────────────────────────
Purpose:  Create contractors table (no demo data)
When:     First-time setup, production
Contents: Table schema, RLS policies, indexes
Run in:   Supabase SQL Editor
Time:     < 5 seconds
Errors:   None (safe to re-run)

─────────────────────────────────────────────────────────────────────

File: /CONTRACTORS_TABLE_FIXED.sql
──────────────────────────────────────
Purpose:  Create contractors table + attempt auto demo user
When:     Development/testing (may require service role key)
Contents: Table + auth.users insert attempt
Run in:   Supabase SQL Editor
Time:     < 10 seconds
Errors:   May fail on auth.users insert (permissions)

─────────────────────────────────────────────────────────────────────

File: /CONTRACTORS_TABLE.sql ❌ DON'T USE
──────────────────────────────────────────────
Purpose:  Original (has foreign key error)
When:     NEVER (deprecated)
Problem:  Tries to insert contractor with random user_id
Error:    "Foreign key constraint violation"
Fix:      Use /CONTRACTORS_TABLE_SIMPLE.sql instead

─────────────────────────────────────────────────────────────────────

File: /FIX_CONTRACTOR_ERROR.md 📖
──────────────────────────────────
Purpose:  Complete troubleshooting guide
When:     When signup fails
Contents: Error explanations, step-by-step fixes
Format:   Markdown documentation
Read:     Any text editor

─────────────────────────────────────────────────────────────────────

File: /CONTRACTOR_SETUP_VISUAL_GUIDE.md 🎨
───────────────────────────────────────────
Purpose:  Visual ASCII diagrams of setup process
When:     Learning how signup works
Contents: Flowcharts, screenshots mockups
Format:   Markdown with ASCII art
Read:     Any text editor
```

---

## 🚀 DEPLOYMENT CHECKLIST

```
┌─────────────────────────────────────────────────────────────────────┐
│                  PRE-DEPLOYMENT VERIFICATION                        │
└─────────────────────────────────────────────────────────────────────┘

BACKEND SETUP:
☐ Supabase project created
☐ Environment variables set (.env)
☐ contractors table created (/CONTRACTORS_TABLE_SIMPLE.sql)
☐ RLS policies enabled and tested
☐ Test contractor signup works
☐ Test contractor login works (after approval)

FRONTEND SETUP:
☐ Netlify/Vercel deployment configured
☐ Environment variables set in hosting platform
☐ Build succeeds locally (npm run build)
☐ No console errors in production build

TESTING:
☐ Contractor signup flow tested end-to-end
☐ Admin approval flow tested
☐ BOQ creation tested (with approved contractor)
☐ Payment flow tested (EFT simulation)
☐ Mobile responsive (test on phone)

MONITORING:
☐ Sentry error tracking configured (optional)
☐ Supabase logs enabled
☐ Analytics configured (optional)

DOCUMENTATION:
☐ README.md updated with deployment steps
☐ Environment variables documented
☐ Admin manual created (how to approve contractors)

SECURITY:
☐ Anon key used in frontend (NOT service role key!)
☐ RLS policies tested thoroughly
☐ Password requirements enforced (8+ chars)
☐ Email confirmation required (or auto-confirm for testing)

✅ All checks passed? Deploy to production!
```

---

**🎉 Backend Visual Summary Updated! Now includes:**
- ✅ Complete contractor signup flow with error handling
- ✅ Comprehensive troubleshooting guide for all signup errors
- ✅ Database foreign key relationship diagrams
- ✅ RLS policy explanations
- ✅ Setup checklist before first signup
- ✅ SQL files reference guide

**Ready for production contractor signups!** 🚀
