# 🎯 Qilly User Roles Analysis & Registration Strategy

## 📊 **Who Uses Qilly? (User Segments)**

### **PRIMARY USERS: BOQ Generators** 🏗️
**These users GENERATE bills of quantities - they are your main customers:**

| User Type | What They Do | Need BOQ Generation? | Need Pricing Data? |
|-----------|--------------|---------------------|-------------------|
| **Contractors** | Build projects, submit tenders | ✅ YES | ✅ YES |
| **Developers/Operators** | Develop properties, manage construction | ✅ YES | ✅ YES |
| **Quantity Surveyors** | Professional BOQ creation | ✅ YES | ✅ YES |
| **Civil Engineers** | Design & cost infrastructure | ✅ YES | ✅ YES |
| **Project Managers** | Manage construction budgets | ✅ YES | ✅ YES |
| **Dept. of Human Settlements** | Government housing projects | ✅ YES | ✅ YES |

**→ THEY PAY TO USE QILLY (subscription revenue)**
**→ THEY NEED: BOQ generation, pricing accuracy, compliance tools**

---

### **SECONDARY USERS: Suppliers** 🏪
**These users PROVIDE pricing data - they are data providers:**

| User Type | What They Do | Need BOQ Generation? | Need Pricing Data? |
|-----------|--------------|---------------------|-------------------|
| **Suppliers** (BUCO, Builders, etc.) | Sell construction materials | ❌ NO | ✅ Provide it |
| **Manufacturers** | Make construction products | ❌ NO | ✅ Provide it |

**→ THEY PROVIDE DATA (supplier partnership model)**
**→ THEY NEED: Product catalog management, API integration, visibility to contractors**

---

## ❌ **CURRENT PROBLEM: Missing User Type**

### **What Exists Today:**
```
✅ Register as Supplier (SupplierSignup.tsx)
   → For suppliers like BUCO, Builders Warehouse
   → Can manage products, set prices, view analytics
   
✅ Regular Signup (AuthForm.tsx)
   → Creates basic user account
   → But NO role selection (contractor vs supplier vs QS)
   → Everyone gets same generic account
   
✅ Demo User
   → Skip registration entirely
   → Test the system
```

### **What's MISSING:**
```
❌ Register as Contractor/Developer
   → NO dedicated registration flow
   → NO contractor-specific fields (CIDB registration, project types, regions)
   → NO subscription tier selection for contractors
   → NO company profile for contractors
   
❌ Register as Quantity Surveyor
   → NO QS-specific registration
   → NO professional registration number
   → NO SACQSP membership verification
   
❌ Role Selection
   → Regular signup doesn't ask: "Are you a contractor, supplier, or QS?"
   → No way to differentiate user types
```

---

## 🚨 **KEY INSIGHT**

**Question:** *"Who is most likely to use Qilly to generate BOQs?"*

**Answer:** **CONTRACTORS, DEVELOPERS, QUANTITY SURVEYORS** - NOT suppliers!

**Question:** *"Does 'Register as Supplier' feature accommodate both of them?"*

**Answer:** **NO!** Current registration only accommodates suppliers. Contractors/developers (the actual BOQ users) have no proper registration path.

---

## ✅ **RECOMMENDED SOLUTION: Dual Registration System**

### **Option A: Separate Registration Flows (RECOMMENDED)**

```
Landing Page
    │
    ├─→ Register as Contractor/Developer ⭐ NEW
    │      • Company details (CIDB registration, project types)
    │      • Operating provinces
    │      • Subscription tier (Professional, Enterprise, Custom)
    │      • Payment method
    │      • Creates: contractor profile in contractors table
    │
    ├─→ Register as Supplier ✅ EXISTS
    │      • Company details (product categories, BBBEE)
    │      • Subscription tier (Free, Professional, Enterprise)
    │      • Creates: supplier profile in suppliers table
    │
    ├─→ Register as Quantity Surveyor ⭐ NEW
    │      • Professional details (SACQSP number, firm name)
    │      • Operating provinces
    │      • Subscription tier
    │      • Creates: qs profile in quantity_surveyors table
    │
    └─→ Continue as Demo User ✅ EXISTS
           • No registration, explore features
```

**Why this approach?**
✅ Clear user segmentation
✅ Role-specific onboarding
✅ Different data collected per role
✅ Different subscription tiers per role
✅ Better analytics (track contractors vs suppliers separately)

---

### **Option B: Unified Registration with Role Selection**

```
Register Now
    │
    ├─→ Step 1: Select Your Role
    │      • I'm a Contractor/Developer
    │      • I'm a Supplier/Manufacturer
    │      • I'm a Quantity Surveyor
    │      • I'm a Government Agency
    │
    └─→ Step 2: Role-Specific Form
           • If contractor: show contractor fields
           • If supplier: show supplier fields
           • If QS: show QS fields
```

**Why this approach?**
✅ Single entry point
✅ Simpler navigation
⚠️ More complex form logic
⚠️ Risk of user confusion

---

## 📋 **Database Schema Changes Needed**

### **Current Tables:**
```sql
✅ suppliers (exists)
   - user_id, company_name, product_categories, etc.
   - For suppliers like BUCO

✅ auth.users (Supabase Auth - exists)
   - id, email, user_metadata
```

### **New Tables Needed:**

```sql
⭐ contractors (NEW)
   - id uuid PRIMARY KEY
   - user_id uuid REFERENCES auth.users (unique)
   - company_name text NOT NULL
   - cidb_registration_number text
   - cidb_grade text (e.g., "Grade 9 CE")
   - contact_person text NOT NULL
   - email text NOT NULL
   - phone text NOT NULL
   - street_address text
   - city text
   - province text
   - postal_code text
   - project_types text[] (e.g., ['Roads', 'Housing', 'Infrastructure'])
   - operating_provinces text[]
   - years_in_business integer
   - bbbee_level text
   - status text DEFAULT 'pending' (pending/approved/rejected/suspended)
   
   -- Subscription
   - subscription_tier text (professional/enterprise/custom)
   - billing_cycle text (monthly/annual)
   - subscription_status text (trial/active/cancelled)
   - subscription_start_date timestamp
   - next_billing_date timestamp
   - payment_method text
   
   - created_at timestamp DEFAULT NOW()
   - updated_at timestamp DEFAULT NOW()

⭐ quantity_surveyors (NEW - Optional, can start with contractors table)
   - id uuid PRIMARY KEY
   - user_id uuid REFERENCES auth.users (unique)
   - full_name text NOT NULL
   - firm_name text
   - sacqsp_number text (Professional registration)
   - email text NOT NULL
   - phone text NOT NULL
   - operating_provinces text[]
   - years_experience integer
   - status text DEFAULT 'pending'
   
   -- Subscription
   - subscription_tier text
   - billing_cycle text
   - subscription_status text
   
   - created_at timestamp DEFAULT NOW()
```

---

## 🎨 **UI/UX Changes Needed**

### **1. Update Landing/Auth Page**

**File:** `/src/app/App.tsx`

**Current:**
```tsx
<Button onClick={onSupplierSignup}>
  <Building2 className="w-4 h-4 mr-2" />
  Register as Supplier
</Button>
```

**New:**
```tsx
<div className="grid md:grid-cols-2 gap-4">
  {/* Primary CTA - Contractors are main users */}
  <Button 
    onClick={onContractorSignup} 
    className="bg-blue-600 hover:bg-blue-700"
  >
    <Hammer className="w-4 h-4 mr-2" />
    Register as Contractor
  </Button>
  
  {/* Secondary CTA - Suppliers are data providers */}
  <Button 
    onClick={onSupplierSignup}
    variant="outline"
  >
    <Building2 className="w-4 h-4 mr-2" />
    Register as Supplier
  </Button>
</div>

<Button 
  onClick={onQSSignup}
  variant="ghost"
  className="text-sm"
>
  I'm a Quantity Surveyor
</Button>
```

---

### **2. Create Contractor Registration Component**

**New File:** `/src/app/components/ContractorSignup.tsx`

```tsx
export function ContractorSignup({ onSuccess, onBack }: ContractorSignupProps) {
  const [signupData, setSignupData] = useState({
    companyName: '',
    cidbRegistrationNumber: '',
    cidbGrade: '',
    contactPerson: '',
    email: '',
    phone: '',
    // Address
    streetAddress: '',
    city: '',
    province: '',
    postalCode: '',
    // Business
    projectTypes: [] as string[], // ['Roads', 'Housing', 'Infrastructure']
    operatingProvinces: [] as string[],
    yearsInBusiness: '',
    bbbeeLevel: '',
    // Account
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const projectTypes = [
    'Road Construction',
    'Housing Development',
    'Infrastructure (Water/Sewer)',
    'Civil Works',
    'Bridges & Structures',
    'Earthworks',
    'Storm Water',
    'Other'
  ];

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

  // Similar signup flow to SupplierSignup but saves to contractors table
  const handleSignup = async (e: React.FormEvent) => {
    // 1. Create auth user
    // 2. Insert into contractors table
    // 3. Status = pending (needs admin approval)
  };

  // Form with contractor-specific fields...
}
```

**Key Differences from Supplier Signup:**
- CIDB registration number (mandatory for SA contractors)
- CIDB grade (contractor capability level)
- Project types (what kind of work they do)
- Operating provinces (where they work)
- Different subscription tiers (focused on BOQ generation, not product management)

---

### **3. Update Admin Dashboard**

**File:** `/src/app/components/AdminDashboard.tsx`

**Add new tabs:**
```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="contractor-applications">
      <Hammer className="w-4 h-4 mr-2" />
      Contractor Applications
    </TabsTrigger>
    
    <TabsTrigger value="supplier-applications">
      <Building2 className="w-4 h-4 mr-2" />
      Supplier Applications
    </TabsTrigger>
    
    <TabsTrigger value="qs-applications">
      <FileText className="w-4 h-4 mr-2" />
      QS Applications
    </TabsTrigger>
  </TabsList>

  <TabsContent value="contractor-applications">
    {/* Show contractors table, approve/reject */}
  </TabsContent>
  
  <TabsContent value="supplier-applications">
    {/* Existing supplier management */}
  </TabsContent>
</Tabs>
```

---

## 💰 **Business Model Implications**

### **Contractors (Primary Revenue):**
```
✅ THEY PAY for Qilly subscription
   • Professional: R2,999/month
   • Enterprise: R8,999/month
   • Custom: R15,000+/month

✅ Revenue Model: SaaS subscription
✅ Value Proposition: 
   • Generate BOQs in 5 minutes (vs 2-3 days)
   • 100% pricing accuracy
   • Compliance with SANS 1200
   • Win more tenders

✅ Target: 1,000+ contractors across 9 provinces
```

### **Suppliers (Partnership Model):**
```
✅ THEY PROVIDE pricing data
   • Free tier: Basic listing
   • Professional: R999/month (advanced analytics)
   • Enterprise: R4,999/month (API integration)

✅ Revenue Model: Freemium + data partnership
✅ Value Proposition:
   • Visibility to 1,000+ contractors
   • Real-time product updates
   • Sales analytics
   • Lead generation

✅ Target: 50-100 major suppliers
```

### **Quantity Surveyors (Professional Tier):**
```
✅ THEY PAY for professional tools
   • Professional: R4,999/month
   • Enterprise: R12,999/month

✅ Revenue Model: Professional SaaS
✅ Value Proposition:
   • Professional BOQ templates
   • Compliance checking
   • Client collaboration tools
   • Project portfolio management

✅ Target: 500+ QS firms
```

---

## 🎯 **Implementation Priority**

### **Phase 1: Immediate (This Week)**
1. ✅ **Create `contractors` table** in Supabase
2. ✅ **Build `ContractorSignup.tsx` component**
3. ✅ **Add contractor registration button** to landing page
4. ✅ **Update Admin Dashboard** to show contractor applications

### **Phase 2: Short-term (Next 2 Weeks)**
1. ⭐ **Create Contractor Dashboard** (separate from supplier dashboard)
   - Generate BOQs
   - View pricing
   - Manage projects
   - Subscription billing
2. ⭐ **Differentiate login flow** based on user type
   - Contractor logs in → Contractor Dashboard
   - Supplier logs in → Supplier Dashboard
   - Admin logs in → Admin Dashboard

### **Phase 3: Medium-term (Next Month)**
1. 📊 **Add Quantity Surveyor registration** (if demand exists)
2. 📊 **Create QS-specific features** (professional templates, SACQSP integration)

---

## 📝 **SQL Migration: Create Contractors Table**

```sql
-- File: /CONTRACTORS_TABLE.sql

-- ============================================
-- CREATE contractors table
-- ============================================
CREATE TABLE IF NOT EXISTS contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Company Information
  company_name TEXT NOT NULL,
  cidb_registration_number TEXT, -- Construction Industry Development Board
  cidb_grade TEXT, -- e.g., "Grade 9 CE"
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  
  -- Address
  street_address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  
  -- Business Details
  project_types TEXT[] DEFAULT '{}', -- ['Roads', 'Housing', 'Infrastructure']
  operating_provinces TEXT[] DEFAULT '{}', -- Provinces where they operate
  years_in_business INTEGER DEFAULT 0,
  bbbee_level TEXT,
  has_certification BOOLEAN DEFAULT FALSE,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  approval_notes TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Subscription
  subscription_tier TEXT DEFAULT 'professional' CHECK (subscription_tier IN ('professional', 'enterprise', 'custom')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual')),
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'suspended')),
  subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_billing_date TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- Policy: Users can create their own contractor profile
CREATE POLICY "Users can create contractor profiles" 
  ON contractors FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Policy: Users can read all contractors (for admin dashboard)
CREATE POLICY "Authenticated users can read contractors" 
  ON contractors FOR SELECT 
  TO authenticated 
  USING (true);

-- Policy: Users can update their own contractor profile
CREATE POLICY "Users can update own contractor profile" 
  ON contractors FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX idx_contractors_user_id ON contractors(user_id);
CREATE INDEX idx_contractors_email ON contractors(email);
CREATE INDEX idx_contractors_status ON contractors(status);
CREATE INDEX idx_contractors_province ON contractors(province);
CREATE INDEX idx_contractors_operating_provinces ON contractors USING GIN (operating_provinces);

-- ============================================
-- Verification
-- ============================================
SELECT 'contractors table created successfully!' as status;
```

---

## 🎉 **Summary & Recommendation**

### **Current State:**
❌ Only "Register as Supplier" exists
❌ Contractors (main BOQ users) have no dedicated registration
❌ No way to differentiate user types
❌ Generic signup doesn't capture contractor-specific data (CIDB, project types)

### **Recommended Solution:**
✅ **Add "Register as Contractor" button** (primary CTA)
✅ **Create `ContractorSignup.tsx` component** (similar to SupplierSignup)
✅ **Create `contractors` table** in Supabase
✅ **Update Admin Dashboard** to manage contractor applications
✅ **Differentiate dashboards** by user type

### **Why This Matters:**
🎯 **Contractors are your paying customers** - they generate BOQs and pay subscriptions
🎯 **Suppliers are data providers** - they supply pricing but may not pay as much
🎯 **Proper segmentation** = better onboarding, better retention, better analytics

### **Next Steps:**
1. Run `/CONTRACTORS_TABLE.sql` in Supabase
2. Create `/src/app/components/ContractorSignup.tsx`
3. Add contractor registration button to App.tsx
4. Update Admin Dashboard to show contractor applications

**Want me to build the contractor registration flow?** 🚀
