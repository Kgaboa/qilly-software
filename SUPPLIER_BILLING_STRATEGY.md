# 🏢 Qilly Supplier Billing Strategy

## Executive Summary

This document outlines the complete billing strategy for how Qilly would charge suppliers for access to the platform, including multiple pricing models, billing cycles, and implementation approach.

---

## 📊 Current State

**Status:** ⚠️ **Not Yet Implemented**

The current Qilly system includes:
- ✅ Customer pricing (contractors pay R2,500-R200,000/month)
- ✅ Supplier signup form (collects supplier information)
- ✅ Supplier database structure
- ❌ **NO supplier billing system**
- ❌ **NO supplier subscription tiers**
- ❌ **NO payment processing for suppliers**

---

## 💡 Recommended Supplier Pricing Model

### **Option 1: Freemium + Premium Tiers** (RECOMMENDED)

This model balances growth (free tier attracts suppliers) with revenue (premium features generate income).

#### **Tier 1: FREE (Basic Listing)**

**Price:** R0/month

**What Suppliers Get:**
- ✅ Basic product catalog listing (up to 50 products)
- ✅ Standard search visibility
- ✅ Manual price updates (weekly batch upload)
- ✅ Basic analytics (monthly summary)
- ✅ Email support (48-hour response time)

**Limitations:**
- ⚠️ Listed after Premium suppliers in search results
- ⚠️ No API integration
- ⚠️ No real-time price updates
- ⚠️ No compliance data display
- ⚠️ No priority placement in regional searches

**Target:** Small suppliers, new market entrants, testing the platform

---

#### **Tier 2: PROFESSIONAL** (Most Popular)

**Price:** **R2,500/month** or **R27,000/year** (save 10%)

**Everything in FREE, PLUS:**
- ✅ Unlimited product listings
- ✅ API Integration (v1.0 - Basic REST API)
- ✅ Real-time price updates
- ✅ **Higher search ranking** (appear above Free tier)
- ✅ Regional province filtering
- ✅ Advanced analytics dashboard
  - Daily quote requests
  - Product popularity reports
  - Regional demand insights
- ✅ Phone + email support (24-hour response)
- ✅ Quarterly business review calls

**Target:** Medium-sized suppliers (Buco, Builders Warehouse branches)

---

#### **Tier 3: ENTERPRISE (DHS-Compliant)**

**Price:** **R7,500/month** or **R81,000/year** (save 10%)

**Everything in PROFESSIONAL, PLUS:**
- ✅ **API v2.0 - Government Compliance Integration**
  - SANS 1200 compliance data
  - NBR (National Building Regulations) alignment
  - AGRÉMENT certification tracking
  - BBBEE status verification
  - POPIA compliance features
  - Anti-corruption verification
- ✅ **PRIORITY PLACEMENT** on all DHS government projects
- ✅ **Premium Badge** displayed on supplier profile
- ✅ Dedicated account manager
- ✅ White-label export options
- ✅ Custom reporting & data exports
- ✅ Priority phone support (4-hour response)
- ✅ Monthly optimization consulting

**Target:** Large suppliers targeting government contracts (R10M-R43M annual DHS projects)

---

#### **Tier 4: CUSTOM / STRATEGIC PARTNERS**

**Price:** Custom pricing (typically R15,000-R50,000/month)

**Everything in ENTERPRISE, PLUS:**
- ✅ Multi-location management (franchises, branches across provinces)
- ✅ Custom API endpoints and webhooks
- ✅ Direct ERP/inventory system integration
- ✅ Co-branded marketing materials
- ✅ Exclusive partnership agreements
- ✅ Featured supplier status
- ✅ Revenue sharing opportunities
- ✅ Joint go-to-market initiatives

**Target:** National chains (Cashbuild, Builders, PPC, Lafarge), strategic partners

---

## 📈 Alternative Pricing Models

### **Option 2: Commission-Based Model**

Instead of flat monthly fees, charge suppliers a commission on sales.

**Structure:**
- **FREE to Join** - No upfront cost
- **2-5% Commission** on all sales generated through Qilly platform
- Tiered commission rates:
  - 5% for basic suppliers
  - 3% for suppliers with API integration
  - 2% for enterprise compliance partners

**Pros:**
- ✅ Low barrier to entry (free to join)
- ✅ Suppliers only pay when they get sales
- ✅ Aligns Qilly's incentives with supplier success
- ✅ Scales automatically with platform growth

**Cons:**
- ❌ Requires order tracking system
- ❌ Complex payment processing
- ❌ Potential disputes over attribution
- ❌ Lower predictable revenue for Qilly

---

### **Option 3: Hybrid Model** (Subscription + Commission)

Combine monthly fees with transaction-based pricing.

**Structure:**
- **R1,000/month Base Fee** (covers platform access)
- **+ 1% Transaction Fee** on all sales through platform
- Or: Suppliers can pay R5,000/month with 0% transaction fee

**Example:**
- Supplier makes R500,000 in monthly sales via Qilly
- Option A: R1,000 + (R500K × 1%) = R6,000/month
- Option B: R5,000 flat fee (no commission)

---

### **Option 4: Lead Generation Model**

Charge per qualified quote request.

**Structure:**
- **R50-R200 per quote request** delivered to supplier
- Tiered pricing:
  - R200/lead for project > R1M
  - R100/lead for project R100K-R1M
  - R50/lead for project < R100K

**Monthly Caps:**
- Starter: R2,500/month (max 25 leads)
- Professional: R7,500/month (max 75 leads)
- Enterprise: R15,000/month (unlimited leads)

---

## 💳 Billing & Payment Implementation

### **Payment Methods**

1. **Credit/Debit Card** (Stripe or PayFast integration)
2. **EFT/Bank Transfer** (manual reconciliation for large suppliers)
3. **Debit Order** (recurring monthly payments)
4. **Invoice + Payment Terms** (30-day terms for enterprise clients)

### **Billing Cycle**

- **Monthly:** Default option, billed on signup date anniversary
- **Annual:** 10% discount, billed once per year
- **Quarterly:** 5% discount (optional for Professional+)

### **Payment Schedule**

```
Day 1:  Supplier signs up → Account created (Free tier)
Day 1:  Upgrade to Professional → R2,500 charged immediately
Day 30: First renewal → R2,500 charged (monthly subscription)
Day 60: Second renewal → R2,500 charged
...
```

### **Grace Periods & Downgrades**

- **7-day grace period** for failed payments
- **Email reminders** at Day 3 and Day 7
- **Auto-downgrade to Free tier** after 7 days (no account deletion)
- **Products remain visible** but lose premium features

---

## 🏦 Database Structure for Supplier Billing

### **New Table: `supplier_subscriptions`**

```sql
CREATE TABLE supplier_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  tier TEXT NOT NULL, -- 'free', 'professional', 'enterprise', 'custom'
  status TEXT NOT NULL, -- 'active', 'past_due', 'cancelled', 'trial'
  
  -- Pricing
  monthly_price DECIMAL(10, 2) NOT NULL,
  billing_cycle TEXT DEFAULT 'monthly', -- 'monthly', 'annual', 'quarterly'
  
  -- Dates
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  
  -- Payment
  payment_method TEXT, -- 'card', 'eft', 'debit_order', 'invoice'
  last_payment_date TIMESTAMP WITH TIME ZONE,
  next_payment_date TIMESTAMP WITH TIME ZONE,
  
  -- Stripe/PayFast Integration
  external_subscription_id TEXT, -- Stripe subscription ID
  external_customer_id TEXT, -- Stripe customer ID
  
  -- Features
  api_access BOOLEAN DEFAULT FALSE,
  compliance_features BOOLEAN DEFAULT FALSE,
  max_products INTEGER DEFAULT 50,
  priority_ranking BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **New Table: `supplier_invoices`**

```sql
CREATE TABLE supplier_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES supplier_subscriptions(id),
  
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  
  amount DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  
  status TEXT NOT NULL, -- 'pending', 'paid', 'overdue', 'cancelled'
  paid_date TIMESTAMP WITH TIME ZONE,
  
  payment_method TEXT,
  payment_reference TEXT,
  
  line_items JSONB, -- Detailed breakdown
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **New Table: `supplier_payments`**

```sql
CREATE TABLE supplier_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES supplier_invoices(id),
  subscription_id UUID REFERENCES supplier_subscriptions(id),
  
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'ZAR',
  
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
  
  -- External payment provider data
  external_payment_id TEXT, -- Stripe payment intent ID
  external_charge_id TEXT,
  
  payment_date TIMESTAMP WITH TIME ZONE,
  
  metadata JSONB, -- Additional payment details
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 📊 Revenue Projections

### **Year 1 Supplier Revenue**

Assumptions:
- 50 suppliers signed up by end of Year 1
- Distribution: 30% Free, 50% Professional, 15% Enterprise, 5% Custom

**Breakdown:**
```
Free Tier:        15 suppliers × R0       = R0
Professional:     25 suppliers × R2,500   = R62,500/month
Enterprise:       8 suppliers  × R7,500   = R60,000/month
Custom:           2 suppliers  × R25,000  = R50,000/month
                                           ─────────────
                                TOTAL:     R172,500/month
                                           R2.07M/year
```

### **Year 3 Supplier Revenue (Scaled)**

Assumptions:
- 300 suppliers on platform
- Distribution: 40% Free, 40% Professional, 15% Enterprise, 5% Custom

**Breakdown:**
```
Free Tier:        120 suppliers × R0       = R0
Professional:     120 suppliers × R2,500   = R300,000/month
Enterprise:       45 suppliers  × R7,500   = R337,500/month
Custom:           15 suppliers  × R30,000  = R450,000/month
                                            ─────────────
                                 TOTAL:     R1,087,500/month
                                            R13.05M/year
```

---

## 🎯 Value Proposition for Each Tier

### **Why Suppliers Would Pay:**

#### **Professional Tier (R2,500/month) Value:**

**Cost:** R2,500/month (R30,000/year)

**Value Delivered:**
- Access to 50-100 construction companies using Qilly (Year 2)
- Each company prices 2-5 BOQs/month = 100-500 quote requests/month
- If supplier wins just 2% of quotes at R50,000 average = R100,000/month in sales
- **ROI:** R100,000 revenue from R2,500 investment = **40x return**

**Break-even:** Just 1 small project win per month pays for entire year

---

#### **Enterprise Tier (R7,500/month) Value:**

**Cost:** R7,500/month (R90,000/year)

**Value Delivered:**
- Priority access to DHS housing projects (R10M-R43M annually)
- If supplier wins just 1 DHS project per year at 3% margin:
  - R10M project × 3% = R300,000 profit
  - Cost: R90,000/year
  - **ROI:** R300,000 profit from R90,000 investment = **3.3x return**

**Break-even:** Just 1 medium DHS project per year pays for 3+ years

---

## 🚀 Implementation Roadmap

### **Phase 1: Basic Subscription System (Month 1-2)**

**Features:**
- Free tier (default for all suppliers)
- Professional tier upgrade option
- Manual payment processing (EFT + email invoice)
- Basic tier detection in search results

**Deliverables:**
- Supplier subscription management in Admin Dashboard
- Invoice generation
- Payment tracking spreadsheet

---

### **Phase 2: Automated Billing (Month 3-4)**

**Features:**
- Stripe/PayFast integration
- Automated recurring billing
- Payment failure handling
- Auto-downgrade logic

**Deliverables:**
- Automated monthly invoicing
- Credit card payment processing
- Supplier billing portal

---

### **Phase 3: Enterprise Features (Month 5-6)**

**Features:**
- Enterprise tier with compliance API
- Custom tier with negotiations
- Revenue analytics dashboard
- Supplier success metrics

**Deliverables:**
- API v2.0 with compliance features
- Enterprise onboarding workflow
- Custom contract management

---

## ✅ Recommended Approach

### **Start with Freemium Model:**

1. **Year 1:** Free for all suppliers (growth focus)
   - Goal: Get 50-100 suppliers on platform
   - Build supplier catalog and data
   - Prove value to contractors

2. **Year 2:** Introduce Professional tier
   - Grandfather existing suppliers (12 months free Professional)
   - New suppliers: Free or R2,500/month
   - Goal: 30% conversion to paid

3. **Year 3:** Launch Enterprise tier
   - Target large suppliers and government contractors
   - Goal: 15-20% of suppliers on Enterprise

---

## 💰 Total Revenue Model

### **Combined Revenue (Suppliers + Contractors)**

**Year 2 Projections:**

**From Contractors:**
- 75 active companies × R15,000 avg/month = R1.125M/month

**From Suppliers:**
- 100 suppliers, 40% paid = 40 paid suppliers
- 30 Professional (R2,500) + 10 Enterprise (R7,500) = R150K/month

**Total Year 2 Revenue:** ~R1.3M/month (R15.6M/year)

---

## 📋 Key Decisions Needed

### **Questions to Answer:**

1. **Primary Model:**
   - [ ] Freemium (Free + R2,500 + R7,500)?
   - [ ] Commission-based (2-5% of sales)?
   - [ ] Hybrid (base fee + commission)?

2. **Free Tier:**
   - [ ] Offer free tier forever?
   - [ ] Time-limited free trial (3 months)?
   - [ ] Freemium with feature restrictions?

3. **Payment Processing:**
   - [ ] Start with Stripe (international)?
   - [ ] Use PayFast (SA-specific)?
   - [ ] Accept manual EFT only (Year 1)?

4. **Billing Start Date:**
   - [ ] Immediate (suppliers pay from Day 1)?
   - [ ] After 6 months (free beta period)?
   - [ ] After 50 contractors onboarded?

---

## 📊 Recommended Implementation

### **Our Recommendation: Freemium + Tiered Subscriptions**

**Tier Structure:**
```
FREE:         R0/month    (Basic listing, manual updates)
PROFESSIONAL: R2,500/month (API, analytics, priority ranking)
ENTERPRISE:   R7,500/month (Compliance, DHS priority, account manager)
CUSTOM:       Negotiated   (White-label, multi-location, strategic partnerships)
```

**Billing:**
- Stripe for card payments
- Manual EFT for large suppliers
- Monthly billing cycle (annual discount available)
- 7-day grace period, then auto-downgrade

**Launch Strategy:**
- Year 1: All suppliers FREE (build catalog)
- Year 2: Introduce paid tiers (grandfather existing suppliers)
- Year 3: Full pricing in effect

**Revenue Target:**
- Year 2: R1.8M from suppliers
- Year 3: R13M from suppliers
- Year 5: R30M from suppliers

---

## 🎯 Next Steps

1. **Validate pricing** with pilot suppliers (survey 10-20 suppliers)
2. **Build MVP billing system** (manual invoicing first)
3. **Integrate Stripe/PayFast** (automated billing)
4. **Create supplier billing portal** (self-service upgrades)
5. **Launch with free tier** (focus on growth)
6. **Introduce paid tiers in Year 2** (revenue focus)

---

## 📞 Questions?

Contact Qilly billing team for:
- Custom enterprise pricing
- Volume discounts
- Partnership opportunities
- Payment plan arrangements

---

**Document Version:** 1.0  
**Last Updated:** February 16, 2026  
**Status:** Proposed Strategy - Awaiting Approval
