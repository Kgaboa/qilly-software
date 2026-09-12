# 🏗️ Qilly Backend Architecture - Complete Implementation Plan

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Supplier API Integration](#supplier-api-integration)
6. [BOQ Calculation Engine](#boq-calculation-engine)
7. [Payment Processing](#payment-processing)
8. [Compliance Tracking](#compliance-tracking)
9. [File Structure](#file-structure)
10. [Deployment Strategy](#deployment-strategy)
11. [Code Examples](#code-examples)

---

## 🎯 Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│   React + TypeScript (Figma Make / Vercel deployment)          │
│   - User Registration                                           │
│   - BOQ Input Interface                                         │
│   - Subscription Management                                     │
│   - Admin Dashboard                                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS REST API
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      API GATEWAY                                │
│   Next.js API Routes / Express.js Server                       │
│   - Authentication (JWT)                                        │
│   - Rate Limiting                                               │
│   - Request Validation                                          │
│   - Error Handling                                              │
└────────────┬────────────┬───────────────┬─────────────┬─────────┘
             │            │               │             │
             ▼            ▼               ▼             ▼
    ┌────────────┐ ┌─────────────┐ ┌──────────┐ ┌─────────────┐
    │   BOQ      │ │  Supplier   │ │ Payment  │ │ Compliance  │
    │  Engine    │ │ Integration │ │ Service  │ │   Service   │
    └──────┬─────┘ └──────┬──────┘ └────┬─────┘ └──────┬──────┘
           │              │              │              │
           └──────────────┴──────────────┴──────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   SUPABASE DATABASE  │
              │  - PostgreSQL        │
              │  - Real-time sync    │
              │  - Authentication    │
              │  - Storage (Files)   │
              └──────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌───────────────┐ ┌─────────────┐ ┌──────────────┐
│   EXTERNAL    │ │   PAYMENT   │ │  COMPLIANCE  │
│   SUPPLIER    │ │   GATEWAYS  │ │  DATABASES   │
│     APIs      │ │             │ │              │
│               │ │             │ │              │
│ • PPC Cement  │ │ • Stitch    │ │ • SANS 1200  │
│ • Murray &    │ │ • PayFast   │ │ • NBR        │
│   Roberts     │ │ • EFT       │ │ • AGRÉMENT   │
│ • Lafarge     │ │             │ │ • BBBEE      │
│ • Corobrik    │ │             │ │              │
│ • AfriSam     │ │             │ │              │
│ (All 9        │ │             │ │              │
│  provinces)   │ │             │ │              │
└───────────────┘ └─────────────┘ └──────────────┘
```

---

## 🛠️ Technology Stack

### Backend Framework (Recommended: Next.js)
```javascript
Why Next.js?
✅ API Routes built-in (no separate backend server needed)
✅ Easy Vercel deployment (same platform as frontend)
✅ TypeScript support
✅ Serverless functions (scales automatically)
✅ Edge runtime for global low latency
```

### Alternative: Express.js
```javascript
Why Express?
✅ More control over server configuration
✅ Rich middleware ecosystem
✅ Can deploy to any cloud provider
✅ Better for complex business logic
```

### Database: Supabase (PostgreSQL)
```javascript
Why Supabase?
✅ PostgreSQL (industry standard, ACID compliant)
✅ Built-in authentication
✅ Real-time subscriptions
✅ Row-level security (RLS)
✅ File storage
✅ Auto-generated REST API
✅ Free tier: 500MB database, 1GB file storage
```

### Caching: Redis (Optional but Recommended)
```javascript
Why Redis?
✅ Cache supplier pricing (reduce API calls)
✅ Session management
✅ Rate limiting
✅ Real-time analytics
```

### Message Queue: Bull/BullMQ (Optional)
```javascript
Why Queue?
✅ Process large BOQ calculations asynchronously
✅ Retry failed supplier API calls
✅ Send email notifications
✅ Generate PDF invoices in background
```

---

## 🗄️ Database Schema

### Complete Supabase Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================
-- USERS & AUTHENTICATION
-- ===========================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  user_type TEXT CHECK (user_type IN ('customer', 'supplier', 'admin')) DEFAULT 'customer',
  
  -- Subscription fields
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'professional', 'enterprise', 'custom')) DEFAULT 'free',
  subscription_status TEXT CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'expired')) DEFAULT 'trial',
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual')) DEFAULT 'monthly',
  
  -- Trial & usage tracking
  trial_boq_count INTEGER DEFAULT 0,
  trial_boq_limit INTEGER DEFAULT 1,
  trial_expires_at TIMESTAMP,
  
  -- Payment tracking
  paid_status BOOLEAN DEFAULT false,
  next_billing_date TIMESTAMP,
  payment_method TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User preferences
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  default_province TEXT,
  preferred_suppliers JSONB, -- Array of preferred supplier IDs
  notification_settings JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===========================
-- SUPPLIERS
-- ===========================

CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Company information
  company_name TEXT NOT NULL,
  registration_number TEXT UNIQUE,
  vat_number TEXT,
  years_in_business INTEGER,
  
  -- Contact information
  contact_person TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  
  -- Address
  street_address TEXT,
  city TEXT,
  province TEXT NOT NULL,
  postal_code TEXT,
  
  -- Business details
  product_categories TEXT[], -- Array of categories
  bbbee_level TEXT,
  has_certification BOOLEAN DEFAULT false,
  certification_details JSONB,
  
  -- Subscription
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'professional', 'enterprise', 'custom')) DEFAULT 'free',
  subscription_status TEXT CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'expired')) DEFAULT 'trial',
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual')) DEFAULT 'monthly',
  paid_status BOOLEAN DEFAULT false,
  next_billing_date TIMESTAMP,
  
  -- Approval workflow
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP,
  approval_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Supplier API credentials (encrypted)
CREATE TABLE supplier_api_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  api_name TEXT NOT NULL, -- 'ppc', 'murray_roberts', etc.
  api_key_encrypted TEXT, -- Encrypted API key
  api_endpoint TEXT,
  rate_limit INTEGER, -- Requests per minute
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Supplier pricing catalog
CREATE TABLE supplier_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  
  -- Product details
  product_code TEXT NOT NULL, -- SANS 1200 code
  product_name TEXT NOT NULL,
  product_category TEXT,
  unit_of_measure TEXT, -- m3, m2, kg, etc.
  
  -- Pricing
  price_per_unit DECIMAL(10, 2) NOT NULL,
  province TEXT NOT NULL,
  
  -- Availability
  in_stock BOOLEAN DEFAULT true,
  lead_time_days INTEGER,
  minimum_order_quantity DECIMAL(10, 2),
  
  -- Compliance
  sans_compliant BOOLEAN DEFAULT false,
  nbr_compliant BOOLEAN DEFAULT false,
  agrement_certified BOOLEAN DEFAULT false,
  
  -- Metadata
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===========================
-- BOQ (Bill of Quantities)
-- ===========================

CREATE TABLE boqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- BOQ details
  project_name TEXT NOT NULL,
  project_description TEXT,
  province TEXT NOT NULL,
  
  -- Calculation status
  status TEXT CHECK (status IN ('draft', 'calculating', 'completed', 'failed')) DEFAULT 'draft',
  calculation_started_at TIMESTAMP,
  calculation_completed_at TIMESTAMP,
  calculation_duration_seconds INTEGER,
  
  -- Totals
  total_cost DECIMAL(12, 2),
  total_items INTEGER,
  optimized_savings DECIMAL(12, 2), -- Savings from regional optimization
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- BOQ line items
CREATE TABLE boq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boq_id UUID REFERENCES boqs(id) ON DELETE CASCADE,
  
  -- Item details
  sans_code TEXT, -- SANS 1200 code
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_of_measure TEXT NOT NULL,
  
  -- Pricing (calculated)
  unit_price DECIMAL(10, 2),
  total_price DECIMAL(12, 2),
  
  -- Selected supplier
  selected_supplier_id UUID REFERENCES suppliers(id),
  supplier_name TEXT,
  
  -- Alternatives (for comparison)
  alternative_quotes JSONB, -- Array of {supplier_id, price, lead_time}
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- BOQ calculation history
CREATE TABLE boq_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boq_id UUID REFERENCES boqs(id) ON DELETE CASCADE,
  
  -- Calculation details
  province TEXT NOT NULL,
  suppliers_queried INTEGER,
  api_calls_made INTEGER,
  items_priced INTEGER,
  
  -- Results
  total_cost DECIMAL(12, 2),
  lowest_cost_option DECIMAL(12, 2),
  highest_cost_option DECIMAL(12, 2),
  average_cost DECIMAL(12, 2),
  
  -- Performance
  calculation_time_ms INTEGER,
  cache_hit_rate DECIMAL(5, 2), -- Percentage of cached pricing used
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===========================
-- PAYMENTS & INVOICES
-- ===========================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Invoice details
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_type TEXT CHECK (invoice_type IN ('subscription', 'boq', 'one_time')) DEFAULT 'subscription',
  
  -- Subscription details (if applicable)
  subscription_tier TEXT,
  billing_cycle TEXT,
  billing_period_start DATE,
  billing_period_end DATE,
  
  -- Amounts
  subtotal DECIMAL(10, 2) NOT NULL,
  vat_amount DECIMAL(10, 2),
  total_amount DECIMAL(10, 2) NOT NULL,
  
  -- Payment
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method TEXT, -- 'eft', 'stitch', 'payfast', 'contact_sales'
  payment_reference TEXT, -- Bank reference or payment gateway ID
  
  -- Dates
  issued_at TIMESTAMP DEFAULT NOW(),
  due_date TIMESTAMP,
  paid_at TIMESTAMP,
  
  -- Admin verification (for EFT)
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  verification_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Transaction details
  transaction_type TEXT CHECK (transaction_type IN ('payment', 'refund', 'chargeback')),
  payment_method TEXT,
  payment_provider TEXT, -- 'stitch', 'payfast', 'manual_eft'
  
  -- Amounts
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'ZAR',
  
  -- Status
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  
  -- Provider details
  provider_transaction_id TEXT,
  provider_response JSONB,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);

-- Sales requests (from "Contact Sales")
CREATE TABLE sales_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Request details
  requested_tier TEXT,
  company_name TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  
  -- Status
  status TEXT CHECK (status IN ('pending', 'contacted', 'converted', 'declined')) DEFAULT 'pending',
  
  -- Admin handling
  assigned_to UUID REFERENCES users(id),
  contacted_at TIMESTAMP,
  converted_at TIMESTAMP,
  declined_at TIMESTAMP,
  admin_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===========================
-- COMPLIANCE TRACKING
-- ===========================

CREATE TABLE compliance_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boq_id UUID REFERENCES boqs(id) ON DELETE CASCADE,
  
  -- Compliance standards
  sans_1200_compliant BOOLEAN DEFAULT false,
  nbr_compliant BOOLEAN DEFAULT false,
  agrement_certified BOOLEAN DEFAULT false,
  
  -- BBBEE tracking
  bbbee_suppliers_count INTEGER,
  bbbee_spend_percentage DECIMAL(5, 2),
  bbbee_level_average TEXT,
  
  -- POPIA compliance
  popia_compliant BOOLEAN DEFAULT true,
  data_processing_consent BOOLEAN DEFAULT false,
  
  -- Anti-corruption
  corruption_risk_score DECIMAL(3, 2), -- 0.00 to 1.00
  flagged_suppliers TEXT[], -- Array of supplier IDs with concerns
  
  -- Results
  overall_compliance_score DECIMAL(5, 2), -- 0-100
  compliance_report JSONB,
  
  -- Metadata
  checked_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Compliance violations
CREATE TABLE compliance_violations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boq_id UUID REFERENCES boqs(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  
  -- Violation details
  violation_type TEXT, -- 'sans', 'nbr', 'agrement', 'bbbee', 'popia', 'corruption'
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT,
  
  -- Resolution
  status TEXT CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')) DEFAULT 'open',
  resolution_notes TEXT,
  resolved_at TIMESTAMP,
  
  -- Metadata
  detected_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===========================
-- CACHING & PERFORMANCE
-- ===========================

-- Pricing cache (to reduce supplier API calls)
CREATE TABLE pricing_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Cache key
  supplier_name TEXT NOT NULL,
  province TEXT NOT NULL,
  product_code TEXT NOT NULL,
  
  -- Cached data
  price_per_unit DECIMAL(10, 2) NOT NULL,
  in_stock BOOLEAN,
  lead_time_days INTEGER,
  
  -- Cache metadata
  cached_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL, -- TTL: 24 hours typical
  hit_count INTEGER DEFAULT 0,
  
  UNIQUE(supplier_name, province, product_code)
);

-- API rate limiting
CREATE TABLE api_rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Rate limit tracking
  endpoint TEXT NOT NULL,
  requests_count INTEGER DEFAULT 0,
  window_start TIMESTAMP DEFAULT NOW(),
  window_end TIMESTAMP,
  
  -- Limits
  max_requests INTEGER, -- Based on subscription tier
  
  UNIQUE(user_id, endpoint, window_start)
);

-- ===========================
-- AUDIT LOGS
-- ===========================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Who
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_role TEXT,
  
  -- What
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'approve', 'reject', etc.
  resource_type TEXT NOT NULL, -- 'supplier', 'boq', 'invoice', etc.
  resource_id UUID,
  
  -- Details
  changes JSONB, -- Before/after state
  ip_address INET,
  user_agent TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===========================
-- INDEXES FOR PERFORMANCE
-- ===========================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_users_user_type ON users(user_type);

-- Suppliers
CREATE INDEX idx_suppliers_province ON suppliers(province);
CREATE INDEX idx_suppliers_status ON suppliers(status);
CREATE INDEX idx_suppliers_email ON suppliers(email);
CREATE INDEX idx_suppliers_categories ON suppliers USING GIN(product_categories);

-- Supplier pricing
CREATE INDEX idx_supplier_pricing_province ON supplier_pricing(province);
CREATE INDEX idx_supplier_pricing_product_code ON supplier_pricing(product_code);
CREATE INDEX idx_supplier_pricing_supplier_province ON supplier_pricing(supplier_id, province);

-- BOQs
CREATE INDEX idx_boqs_user_id ON boqs(user_id);
CREATE INDEX idx_boqs_status ON boqs(status);
CREATE INDEX idx_boqs_created_at ON boqs(created_at DESC);

-- BOQ items
CREATE INDEX idx_boq_items_boq_id ON boq_items(boq_id);
CREATE INDEX idx_boq_items_sans_code ON boq_items(sans_code);

-- Invoices
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_payment_status ON invoices(payment_status);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);

-- Payment transactions
CREATE INDEX idx_payment_transactions_invoice_id ON payment_transactions(invoice_id);
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);

-- Pricing cache
CREATE INDEX idx_pricing_cache_lookup ON pricing_cache(supplier_name, province, product_code);
CREATE INDEX idx_pricing_cache_expires_at ON pricing_cache(expires_at);

-- Audit logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ===========================
-- ROW LEVEL SECURITY (RLS)
-- ===========================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE boqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Suppliers can view/edit their own data
CREATE POLICY "Suppliers can view own data" ON suppliers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Suppliers can update own data" ON suppliers
  FOR UPDATE USING (user_id = auth.uid());

-- Users can view their own BOQs
CREATE POLICY "Users can view own BOQs" ON boqs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create BOQs" ON boqs
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admins can view everything (create admin role policy)
CREATE POLICY "Admins can view all" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin'
    )
  );
```

---

## 🔌 API Endpoints

### Complete REST API Design

```
BASE URL (Staging): https://staging-api.qilly.co.za/api
BASE URL (Production): https://api.qilly.co.za/api
```

### 1. Authentication & Users

```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh-token
GET    /auth/me

POST   /users/register
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
GET    /users/:id/subscription
PUT    /users/:id/subscription
```

### 2. Suppliers

```
POST   /suppliers/register
GET    /suppliers
GET    /suppliers/:id
PUT    /suppliers/:id
DELETE /suppliers/:id
POST   /suppliers/:id/approve
POST   /suppliers/:id/reject

GET    /suppliers/:id/pricing
POST   /suppliers/:id/pricing
PUT    /suppliers/pricing/:pricingId
DELETE /suppliers/pricing/:pricingId

GET    /suppliers/by-province/:province
GET    /suppliers/by-category/:category
```

### 3. BOQ Calculation (CORE)

```
POST   /boq/calculate
  Body: {
    userId: UUID,
    province: string,
    projectName: string,
    items: [
      {
        sansCode: string,
        description: string,
        quantity: number,
        unit: string
      }
    ]
  }
  Response: {
    boqId: UUID,
    totalCost: number,
    items: [
      {
        description: string,
        quantity: number,
        unitPrice: number,
        totalPrice: number,
        selectedSupplier: {
          id: UUID,
          name: string,
          price: number
        },
        alternatives: [...]
      }
    ],
    optimizedSavings: number,
    calculationTime: number,
    complianceScore: number
  }

GET    /boq/:id
GET    /boq/user/:userId
PUT    /boq/:id
DELETE /boq/:id
GET    /boq/:id/pdf
POST   /boq/:id/export
```

### 4. Pricing

```
GET    /pricing/suppliers
  Query: ?province=Gauteng&productCode=SANS1200-DB.1
  
GET    /pricing/compare
  Query: ?province=Gauteng&productCodes=DB.1,DB.2,DB.3
  
POST   /pricing/bulk-query
  Body: {
    province: string,
    productCodes: string[]
  }
  
GET    /pricing/cache/stats
DELETE /pricing/cache/clear
```

### 5. Payments & Invoices

```
POST   /invoices/create
GET    /invoices/:id
GET    /invoices/user/:userId
PUT    /invoices/:id/verify (Admin only)
PUT    /invoices/:id/pay

POST   /payments/eft/initiate
POST   /payments/stitch/initiate
POST   /payments/payfast/initiate
POST   /payments/webhook/stitch
POST   /payments/webhook/payfast

GET    /sales-requests
POST   /sales-requests
PUT    /sales-requests/:id/convert (Admin)
PUT    /sales-requests/:id/decline (Admin)
```

### 6. Compliance

```
GET    /compliance/check/:boqId
GET    /compliance/sans-1200
GET    /compliance/nbr
GET    /compliance/agrement
GET    /compliance/bbbee/:boqId
POST   /compliance/report/:boqId
```

### 7. Admin

```
GET    /admin/dashboard/stats
GET    /admin/suppliers/pending
PUT    /admin/suppliers/:id/approve
PUT    /admin/suppliers/:id/reject

GET    /admin/users
GET    /admin/invoices/pending
GET    /admin/audit-logs

POST   /admin/suppliers/:id/api-credentials
```

---

## 🔗 Supplier API Integration

### Strategy for All 9 Provinces

#### **1. South African Building Material Suppliers**

```javascript
// Major suppliers to integrate:

const SUPPLIERS_BY_PROVINCE = {
  "Gauteng": [
    { name: "PPC Cement", api: "https://api.ppc.co.za", coverage: "national" },
    { name: "Murray & Roberts", api: "https://api.murrayroberts.co.za" },
    { name: "Corobrik", api: "https://api.corobrik.co.za" },
    { name: "AfriSam", api: "https://api.afrisam.co.za", coverage: "national" },
    { name: "Lafarge", api: "https://api.lafarge.co.za", coverage: "national" },
    { name: "Builders Warehouse", type: "scraper" }, // No API, web scraping
  ],
  
  "Western Cape": [
    { name: "PPC Cement", api: "https://api.ppc.co.za" },
    { name: "Lafarge", api: "https://api.lafarge.co.za" },
    { name: "Corobrik", api: "https://api.corobrik.co.za" },
    { name: "Cashbuild", type: "scraper" },
  ],
  
  "KwaZulu-Natal": [
    { name: "PPC Cement", api: "https://api.ppc.co.za" },
    { name: "Corobrik", api: "https://api.corobrik.co.za" },
    { name: "AfriSam", api: "https://api.afrisam.co.za" },
  ],
  
  // ... continue for all 9 provinces
  "Eastern Cape": [...],
  "Free State": [...],
  "Limpopo": [...],
  "Mpumalanga": [...],
  "North West": [...],
  "Northern Cape": [...]
};
```

#### **2. API Integration Patterns**

**Pattern A: Direct REST API (Best)**
```typescript
// services/suppliers/ppc.ts

interface PPCPricingRequest {
  province: string;
  productCodes: string[];
}

interface PPCPricingResponse {
  products: Array<{
    code: string;
    name: string;
    price: number;
    unit: string;
    inStock: boolean;
    leadTimeDays: number;
  }>;
}

export class PPCSupplierAPI {
  private apiKey: string;
  private baseUrl = 'https://api.ppc.co.za/v1';
  
  async getPricing(request: PPCPricingRequest): Promise<PPCPricingResponse> {
    const response = await fetch(`${this.baseUrl}/pricing`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    
    return response.json();
  }
  
  async getStock(province: string, productCode: string): Promise<boolean> {
    const response = await fetch(
      `${this.baseUrl}/stock?province=${province}&code=${productCode}`,
      {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      }
    );
    
    const data = await response.json();
    return data.inStock;
  }
}
```

**Pattern B: Web Scraping (Fallback)**
```typescript
// services/suppliers/scraper.ts

import * as cheerio from 'cheerio';

export class BuildersWarehouseScraper {
  private baseUrl = 'https://www.builders.co.za';
  
  async getPricing(province: string, productName: string): Promise<number> {
    // Scrape product page
    const url = `${this.baseUrl}/search?q=${encodeURIComponent(productName)}`;
    const response = await fetch(url);
    const html = await response.text();
    
    // Parse HTML
    const $ = cheerio.load(html);
    const priceElement = $('.product-price').first();
    const priceText = priceElement.text().replace(/[R,\s]/g, '');
    
    return parseFloat(priceText);
  }
}
```

**Pattern C: CSV/Excel Import (Manual Fallback)**
```typescript
// For suppliers without APIs, admin uploads pricing sheets weekly

export class ManualPricingImporter {
  async importPricingSheet(
    supplierId: string,
    filePath: string,
    province: string
  ): Promise<void> {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    for (const row of data) {
      await supabase.from('supplier_pricing').insert({
        supplier_id: supplierId,
        product_code: row.code,
        product_name: row.name,
        price_per_unit: row.price,
        province: province,
        valid_from: new Date(),
        valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });
    }
  }
}
```

#### **3. Aggregated Pricing Service**

```typescript
// services/pricing-aggregator.ts

export class PricingAggregator {
  private suppliers: Map<string, SupplierAPI> = new Map();
  
  constructor() {
    // Register all supplier APIs
    this.suppliers.set('ppc', new PPCSupplierAPI());
    this.suppliers.set('afrisam', new AfriSamAPI());
    this.suppliers.set('corobrik', new CorobrikAPI());
    // ... etc
  }
  
  async getLowestPrice(
    province: string,
    productCode: string
  ): Promise<{
    price: number;
    supplierId: string;
    supplierName: string;
    inStock: boolean;
    leadTimeDays: number;
  }> {
    const promises = Array.from(this.suppliers.entries()).map(
      async ([id, api]) => {
        try {
          const pricing = await api.getPricing({ province, productCodes: [productCode] });
          return {
            supplierId: id,
            ...pricing.products[0]
          };
        } catch (error) {
          console.error(`Error fetching from ${id}:`, error);
          return null;
        }
      }
    );
    
    const results = (await Promise.all(promises)).filter(r => r !== null);
    
    // Find lowest price
    return results.reduce((lowest, current) => 
      current.price < lowest.price ? current : lowest
    );
  }
  
  async getAllPrices(
    province: string,
    productCode: string
  ): Promise<Array<any>> {
    // Returns all supplier prices for comparison
    const promises = Array.from(this.suppliers.values()).map(
      api => api.getPricing({ province, productCodes: [productCode] })
    );
    
    const results = await Promise.allSettled(promises);
    
    return results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);
  }
}
```

---

## ⚙️ BOQ Calculation Engine

### Core Algorithm

```typescript
// services/boq-engine.ts

interface BOQItem {
  sansCode: string;
  description: string;
  quantity: number;
  unit: string;
}

interface BOQRequest {
  userId: string;
  province: string;
  projectName: string;
  items: BOQItem[];
}

interface BOQResult {
  boqId: string;
  totalCost: number;
  items: Array<{
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    selectedSupplier: {
      id: string;
      name: string;
      price: number;
      leadTimeDays: number;
    };
    alternatives: Array<any>;
  }>;
  optimizedSavings: number;
  calculationTime: number;
  complianceScore: number;
}

export class BOQCalculationEngine {
  private pricingAggregator: PricingAggregator;
  private complianceChecker: ComplianceChecker;
  
  async calculate(request: BOQRequest): Promise<BOQResult> {
    const startTime = Date.now();
    
    // 1. Create BOQ record
    const boq = await this.createBOQRecord(request);
    
    // 2. Price each item
    const pricedItems = await Promise.all(
      request.items.map(item => this.priceItem(request.province, item))
    );
    
    // 3. Calculate totals
    const totalCost = pricedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // 4. Calculate savings (compare cheapest vs average)
    const optimizedSavings = this.calculateSavings(pricedItems);
    
    // 5. Check compliance
    const complianceScore = await this.complianceChecker.checkBOQ(boq.id);
    
    // 6. Update BOQ record
    await this.updateBOQRecord(boq.id, {
      status: 'completed',
      total_cost: totalCost,
      optimized_savings: optimizedSavings,
      calculation_duration_seconds: Math.floor((Date.now() - startTime) / 1000)
    });
    
    return {
      boqId: boq.id,
      totalCost,
      items: pricedItems,
      optimizedSavings,
      calculationTime: Date.now() - startTime,
      complianceScore
    };
  }
  
  private async priceItem(
    province: string,
    item: BOQItem
  ): Promise<any> {
    // Get all supplier prices for this item
    const allPrices = await this.pricingAggregator.getAllPrices(
      province,
      item.sansCode
    );
    
    if (allPrices.length === 0) {
      throw new Error(`No pricing found for ${item.sansCode} in ${province}`);
    }
    
    // Sort by price (lowest first)
    allPrices.sort((a, b) => a.price - b.price);
    
    // Select cheapest
    const selectedSupplier = allPrices[0];
    
    return {
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: selectedSupplier.price,
      totalPrice: selectedSupplier.price * item.quantity,
      selectedSupplier: {
        id: selectedSupplier.supplierId,
        name: selectedSupplier.supplierName,
        price: selectedSupplier.price,
        leadTimeDays: selectedSupplier.leadTimeDays
      },
      alternatives: allPrices.slice(1, 4) // Top 3 alternatives
    };
  }
  
  private calculateSavings(pricedItems: any[]): number {
    let totalOptimized = 0;
    let totalAverage = 0;
    
    for (const item of pricedItems) {
      totalOptimized += item.totalPrice; // Cheapest option
      
      // Calculate average of all alternatives
      const allPrices = [
        item.selectedSupplier.price,
        ...item.alternatives.map((a: any) => a.price)
      ];
      const avgPrice = allPrices.reduce((sum, p) => sum + p, 0) / allPrices.length;
      totalAverage += avgPrice * item.quantity;
    }
    
    return totalAverage - totalOptimized;
  }
}
```

---

**(Continued in next file...)**
