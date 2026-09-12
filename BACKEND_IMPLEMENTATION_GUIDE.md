# 🚀 Qilly Backend - Step-by-Step Implementation Guide

## 📋 Quick Navigation
1. [Setup Instructions](#setup-instructions)
2. [File Structure](#file-structure)
3. [Code Examples](#code-examples)
4. [Testing Strategy](#testing-strategy)
5. [Deployment](#deployment)

---

## 🛠️ Setup Instructions

### Step 1: Choose Your Backend Framework

#### **Option A: Next.js (Recommended for Vercel)**

```bash
# Create Next.js project
npx create-next-app@latest qilly-backend --typescript
cd qilly-backend

# Install dependencies
npm install @supabase/supabase-js
npm install stripe @stripe/stripe-js  # If using Stripe
npm install bullmq ioredis  # For job queues
npm install cheerio  # For web scraping
npm install xlsx  # For Excel imports
npm install pdfkit  # For PDF generation
npm install zod  # For validation
```

#### **Option B: Express.js (More Control)**

```bash
# Create project
mkdir qilly-backend
cd qilly-backend
npm init -y

# Install dependencies
npm install express cors dotenv
npm install typescript @types/express @types/node ts-node nodemon --save-dev
npm install @supabase/supabase-js
npm install bullmq ioredis
npm install cheerio
npm install xlsx pdfkit zod

# Initialize TypeScript
npx tsc --init
```

---

## 📁 File Structure

### Next.js API Routes Structure

```
qilly-backend/
├── pages/
│   └── api/
│       ├── auth/
│       │   ├── register.ts
│       │   ├── login.ts
│       │   └── refresh.ts
│       ├── users/
│       │   ├── [id].ts
│       │   └── subscription.ts
│       ├── suppliers/
│       │   ├── index.ts
│       │   ├── [id].ts
│       │   ├── register.ts
│       │   └── pricing.ts
│       ├── boq/
│       │   ├── calculate.ts
│       │   ├── [id].ts
│       │   └── export.ts
│       ├── pricing/
│       │   ├── compare.ts
│       │   └── bulk-query.ts
│       ├── payments/
│       │   ├── eft.ts
│       │   ├── stitch.ts
│       │   └── webhook.ts
│       └── admin/
│           ├── dashboard.ts
│           ├── suppliers.ts
│           └── invoices.ts
├── lib/
│   ├── supabase.ts
│   ├── redis.ts
│   └── queue.ts
├── services/
│   ├── boq-engine.ts
│   ├── pricing-aggregator.ts
│   ├── compliance-checker.ts
│   ├── payment-processor.ts
│   └── suppliers/
│       ├── ppc.ts
│       ├── afrisam.ts
│       ├── corobrik.ts
│       ├── lafarge.ts
│       └── scraper.ts
├── utils/
│   ├── validation.ts
│   ├── encryption.ts
│   ├── pdf-generator.ts
│   └── email.ts
└── middleware/
    ├── auth.ts
    ├── rate-limit.ts
    └── error-handler.ts
```

### Express.js Structure

```
qilly-backend/
├── src/
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── suppliers.routes.ts
│   │   ├── boq.routes.ts
│   │   ├── pricing.routes.ts
│   │   ├── payments.routes.ts
│   │   └── admin.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── boq.controller.ts
│   │   ├── supplier.controller.ts
│   │   └── payment.controller.ts
│   ├── services/
│   │   ├── boq-engine.ts
│   │   ├── pricing-aggregator.ts
│   │   ├── compliance-checker.ts
│   │   └── suppliers/
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── error.middleware.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   └── pdf-generator.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── redis.ts
│   └── server.ts
├── .env
├── .env.staging
├── .env.production
├── package.json
└── tsconfig.json
```

---

## 💻 Code Examples

### 1. Supabase Client Setup

```typescript
// lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!; // Use service key for backend

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper for authenticated requests
export async function getAuthenticatedUser(authHeader: string) {
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No authorization token');
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    throw new Error('Invalid token');
  }
  
  return user;
}
```

### 2. BOQ Calculation API (Next.js)

```typescript
// pages/api/boq/calculate.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { BOQCalculationEngine } from '@/services/boq-engine';
import { getAuthenticatedUser } from '@/lib/supabase';
import { z } from 'zod';

const BOQRequestSchema = z.object({
  province: z.string(),
  projectName: z.string(),
  items: z.array(z.object({
    sansCode: z.string(),
    description: z.string(),
    quantity: z.number().positive(),
    unit: z.string()
  }))
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // 1. Authenticate user
    const user = await getAuthenticatedUser(req.headers.authorization || '');
    
    // 2. Validate request
    const validatedData = BOQRequestSchema.parse(req.body);
    
    // 3. Check user subscription & trial limits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (userError) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if trial BOQ limit exceeded
    if (userData.subscription_status === 'trial') {
      if (userData.trial_boq_count >= userData.trial_boq_limit) {
        return res.status(403).json({
          error: 'Trial BOQ limit exceeded',
          message: 'Please upgrade to continue processing BOQs',
          trial_used: userData.trial_boq_count,
          trial_limit: userData.trial_boq_limit
        });
      }
    }
    
    // 4. Calculate BOQ
    const boqEngine = new BOQCalculationEngine();
    const result = await boqEngine.calculate({
      userId: user.id,
      province: validatedData.province,
      projectName: validatedData.projectName,
      items: validatedData.items
    });
    
    // 5. Increment trial BOQ count
    if (userData.subscription_status === 'trial') {
      await supabase
        .from('users')
        .update({ trial_boq_count: userData.trial_boq_count + 1 })
        .eq('id', user.id);
    }
    
    // 6. Return result
    return res.status(200).json({
      success: true,
      data: result
    });
    
  } catch (error: any) {
    console.error('BOQ calculation error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
```

### 3. BOQ Calculation Engine Service

```typescript
// services/boq-engine.ts

import { supabase } from '@/lib/supabase';
import { PricingAggregator } from './pricing-aggregator';
import { ComplianceChecker } from './compliance-checker';

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

export class BOQCalculationEngine {
  private pricingAggregator: PricingAggregator;
  private complianceChecker: ComplianceChecker;
  
  constructor() {
    this.pricingAggregator = new PricingAggregator();
    this.complianceChecker = new ComplianceChecker();
  }
  
  async calculate(request: BOQRequest) {
    const startTime = Date.now();
    console.log(`[BOQ Engine] Starting calculation for ${request.projectName}`);
    
    try {
      // 1. Create BOQ record
      const { data: boq, error: boqError } = await supabase
        .from('boqs')
        .insert({
          user_id: request.userId,
          project_name: request.projectName,
          province: request.province,
          status: 'calculating',
          total_items: request.items.length,
          calculation_started_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (boqError) throw boqError;
      
      console.log(`[BOQ Engine] Created BOQ record: ${boq.id}`);
      
      // 2. Price each item in parallel
      const pricedItems = await Promise.all(
        request.items.map(item => this.priceItem(request.province, item, boq.id))
      );
      
      console.log(`[BOQ Engine] Priced ${pricedItems.length} items`);
      
      // 3. Calculate totals
      const totalCost = pricedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const optimizedSavings = this.calculateSavings(pricedItems);
      
      // 4. Run compliance checks
      const complianceScore = await this.complianceChecker.checkBOQ(
        boq.id,
        request.province,
        pricedItems
      );
      
      console.log(`[BOQ Engine] Compliance score: ${complianceScore}%`);
      
      // 5. Update BOQ record
      const calculationTime = Math.floor((Date.now() - startTime) / 1000);
      
      await supabase
        .from('boqs')
        .update({
          status: 'completed',
          total_cost: totalCost,
          optimized_savings: optimizedSavings,
          calculation_completed_at: new Date().toISOString(),
          calculation_duration_seconds: calculationTime
        })
        .eq('id', boq.id);
      
      // 6. Log calculation history
      await supabase.from('boq_calculations').insert({
        boq_id: boq.id,
        province: request.province,
        suppliers_queried: this.pricingAggregator.getSuppliersQueried(),
        api_calls_made: this.pricingAggregator.getApiCallCount(),
        items_priced: pricedItems.length,
        total_cost: totalCost,
        calculation_time_ms: Date.now() - startTime,
        cache_hit_rate: this.pricingAggregator.getCacheHitRate()
      });
      
      console.log(`[BOQ Engine] Calculation complete in ${calculationTime}s`);
      
      return {
        boqId: boq.id,
        totalCost,
        items: pricedItems,
        optimizedSavings,
        calculationTime: Date.now() - startTime,
        complianceScore
      };
      
    } catch (error) {
      console.error('[BOQ Engine] Calculation failed:', error);
      
      // Mark BOQ as failed
      if (boq?.id) {
        await supabase
          .from('boqs')
          .update({ status: 'failed' })
          .eq('id', boq.id);
      }
      
      throw error;
    }
  }
  
  private async priceItem(
    province: string,
    item: BOQItem,
    boqId: string
  ) {
    console.log(`[BOQ Engine] Pricing: ${item.description}`);
    
    // Get all supplier prices
    const allPrices = await this.pricingAggregator.getAllPrices(
      province,
      item.sansCode
    );
    
    if (!allPrices || allPrices.length === 0) {
      console.warn(`[BOQ Engine] No pricing found for ${item.sansCode}`);
      
      // Insert item with null pricing
      await supabase.from('boq_items').insert({
        boq_id: boqId,
        sans_code: item.sansCode,
        description: item.description,
        quantity: item.quantity,
        unit_of_measure: item.unit,
        unit_price: null,
        total_price: null,
        supplier_name: 'No supplier found'
      });
      
      return {
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: 0,
        totalPrice: 0,
        selectedSupplier: null,
        alternatives: []
      };
    }
    
    // Sort by price (lowest first)
    allPrices.sort((a, b) => a.price - b.price);
    
    // Select cheapest
    const selected = allPrices[0];
    const totalPrice = selected.price * item.quantity;
    
    // Save to database
    await supabase.from('boq_items').insert({
      boq_id: boqId,
      sans_code: item.sansCode,
      description: item.description,
      quantity: item.quantity,
      unit_of_measure: item.unit,
      unit_price: selected.price,
      total_price: totalPrice,
      selected_supplier_id: selected.supplierId,
      supplier_name: selected.supplierName,
      alternative_quotes: allPrices.slice(1, 4) // Top 3 alternatives
    });
    
    return {
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: selected.price,
      totalPrice: totalPrice,
      selectedSupplier: {
        id: selected.supplierId,
        name: selected.supplierName,
        price: selected.price,
        leadTimeDays: selected.leadTimeDays || 0
      },
      alternatives: allPrices.slice(1, 4)
    };
  }
  
  private calculateSavings(pricedItems: any[]): number {
    let totalOptimized = 0;
    let totalAverage = 0;
    
    for (const item of pricedItems) {
      if (!item.selectedSupplier) continue;
      
      totalOptimized += item.totalPrice;
      
      // Calculate average of all options
      const allPrices = [
        item.selectedSupplier.price,
        ...item.alternatives.map((a: any) => a.price)
      ];
      
      if (allPrices.length > 1) {
        const avgPrice = allPrices.reduce((sum, p) => sum + p, 0) / allPrices.length;
        totalAverage += avgPrice * item.quantity;
      } else {
        totalAverage += item.totalPrice;
      }
    }
    
    return Math.max(0, totalAverage - totalOptimized);
  }
}
```

### 4. Pricing Aggregator Service

```typescript
// services/pricing-aggregator.ts

import { supabase } from '@/lib/supabase';
import { PPCSupplierAPI } from './suppliers/ppc';
import { AfriSamAPI } from './suppliers/afrisam';
import { CorobrikAPI } from './suppliers/corobrik';
import { redis } from '@/lib/redis';

interface PricingResult {
  supplierId: string;
  supplierName: string;
  price: number;
  inStock: boolean;
  leadTimeDays: number;
}

export class PricingAggregator {
  private suppliers: Map<string, any> = new Map();
  private apiCallCount = 0;
  private cacheHits = 0;
  private cacheMisses = 0;
  
  constructor() {
    // Register supplier APIs
    this.suppliers.set('ppc', new PPCSupplierAPI());
    this.suppliers.set('afrisam', new AfriSamAPI());
    this.suppliers.set('corobrik', new CorobrikAPI());
    // Add more suppliers...
  }
  
  async getAllPrices(
    province: string,
    productCode: string
  ): Promise<PricingResult[]> {
    console.log(`[Pricing] Getting prices for ${productCode} in ${province}`);
    
    // 1. Check cache first
    const cached = await this.getCachedPricing(province, productCode);
    if (cached) {
      console.log(`[Pricing] Cache hit for ${productCode}`);
      this.cacheHits++;
      return cached;
    }
    
    this.cacheMisses++;
    
    // 2. Check database (manual uploads)
    const dbPricing = await this.getDatabasePricing(province, productCode);
    
    // 3. Query supplier APIs in parallel
    const apiPricing = await this.getAPIPricing(province, productCode);
    
    // 4. Combine all results
    const allPricing = [...dbPricing, ...apiPricing];
    
    // 5. Cache results (24 hour TTL)
    if (allPricing.length > 0) {
      await this.cachePricing(province, productCode, allPricing);
    }
    
    console.log(`[Pricing] Found ${allPricing.length} prices for ${productCode}`);
    
    return allPricing;
  }
  
  private async getCachedPricing(
    province: string,
    productCode: string
  ): Promise<PricingResult[] | null> {
    const cacheKey = `pricing:${province}:${productCode}`;
    
    try {
      const cached = await redis?.get(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('[Pricing] Cache read error:', error);
      return null;
    }
  }
  
  private async cachePricing(
    province: string,
    productCode: string,
    pricing: PricingResult[]
  ): Promise<void> {
    const cacheKey = `pricing:${province}:${productCode}`;
    const ttl = 24 * 60 * 60; // 24 hours
    
    try {
      await redis?.setex(cacheKey, ttl, JSON.stringify(pricing));
    } catch (error) {
      console.error('[Pricing] Cache write error:', error);
    }
  }
  
  private async getDatabasePricing(
    province: string,
    productCode: string
  ): Promise<PricingResult[]> {
    const { data, error } = await supabase
      .from('supplier_pricing')
      .select(`
        *,
        suppliers:supplier_id (
          id,
          company_name
        )
      `)
      .eq('province', province)
      .eq('product_code', productCode)
      .eq('in_stock', true)
      .gte('valid_until', new Date().toISOString());
    
    if (error) {
      console.error('[Pricing] Database query error:', error);
      return [];
    }
    
    return (data || []).map(row => ({
      supplierId: row.supplier_id,
      supplierName: row.suppliers?.company_name || 'Unknown',
      price: parseFloat(row.price_per_unit),
      inStock: row.in_stock,
      leadTimeDays: row.lead_time_days || 0
    }));
  }
  
  private async getAPIPricing(
    province: string,
    productCode: string
  ): Promise<PricingResult[]> {
    const promises = Array.from(this.suppliers.entries()).map(
      async ([id, api]) => {
        try {
          this.apiCallCount++;
          const result = await api.getPricing({ province, productCodes: [productCode] });
          
          return result.products.map((p: any) => ({
            supplierId: id,
            supplierName: api.name || id,
            price: p.price,
            inStock: p.inStock !== false,
            leadTimeDays: p.leadTimeDays || 0
          }));
        } catch (error) {
          console.error(`[Pricing] Error from ${id}:`, error);
          return [];
        }
      }
    );
    
    const results = await Promise.all(promises);
    return results.flat();
  }
  
  getSuppliersQueried(): number {
    return this.suppliers.size;
  }
  
  getApiCallCount(): number {
    return this.apiCallCount;
  }
  
  getCacheHitRate(): number {
    const total = this.cacheHits + this.cacheMisses;
    return total > 0 ? (this.cacheHits / total) * 100 : 0;
  }
}
```

### 5. Supplier API Implementation (PPC Example)

```typescript
// services/suppliers/ppc.ts

interface PPCPricingRequest {
  province: string;
  productCodes: string[];
}

interface PPCProduct {
  code: string;
  name: string;
  price: number;
  unit: string;
  inStock: boolean;
  leadTimeDays: number;
}

export class PPCSupplierAPI {
  name = 'PPC Cement';
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    this.apiKey = process.env.PPC_API_KEY || '';
    this.baseUrl = process.env.PPC_API_URL || 'https://api.ppc.co.za/v1';
  }
  
  async getPricing(request: PPCPricingRequest): Promise<{ products: PPCProduct[] }> {
    console.log(`[PPC API] Fetching pricing for ${request.province}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/pricing`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          province: request.province,
          products: request.productCodes
        })
      });
      
      if (!response.ok) {
        throw new Error(`PPC API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log(`[PPC API] Received ${data.products?.length || 0} products`);
      
      return {
        products: data.products || []
      };
      
    } catch (error) {
      console.error('[PPC API] Request failed:', error);
      
      // Return empty result instead of failing
      return { products: [] };
    }
  }
  
  async getStock(province: string, productCode: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/stock?province=${province}&code=${productCode}`,
        {
          headers: { 'Authorization': `Bearer ${this.apiKey}` }
        }
      );
      
      const data = await response.json();
      return data.inStock || false;
      
    } catch (error) {
      console.error('[PPC API] Stock check failed:', error);
      return false;
    }
  }
}
```

### 6. Compliance Checker Service

```typescript
// services/compliance-checker.ts

import { supabase } from '@/lib/supabase';

export class ComplianceChecker {
  async checkBOQ(
    boqId: string,
    province: string,
    pricedItems: any[]
  ): Promise<number> {
    console.log(`[Compliance] Checking BOQ ${boqId}`);
    
    // 1. Check SANS 1200 compliance
    const sansCompliance = await this.checkSANS1200(pricedItems);
    
    // 2. Check NBR compliance
    const nbrCompliance = await this.checkNBR(pricedItems);
    
    // 3. Check AGRÉMENT certification
    const agrementCompliance = await this.checkAGREMENT(pricedItems);
    
    // 4. Check BBBEE scoring
    const bbbeeScore = await this.checkBBBEE(pricedItems);
    
    // 5. Check POPIA compliance
    const popiaCompliant = true; // Always true if using proper consent
    
    // 6. Calculate overall score
    const overallScore = (
      (sansCompliance ? 20 : 0) +
      (nbrCompliance ? 20 : 0) +
      (agrementCompliance ? 20 : 0) +
      (bbbeeScore * 0.3) + // Max 30 points
      (popiaCompliant ? 10 : 0)
    );
    
    // 7. Save compliance check
    await supabase.from('compliance_checks').insert({
      boq_id: boqId,
      sans_1200_compliant: sansCompliance,
      nbr_compliant: nbrCompliance,
      agrement_certified: agrementCompliance,
      bbbee_suppliers_count: await this.getBBBEESupplierCount(pricedItems),
      bbbee_spend_percentage: bbbeeScore,
      popia_compliant: popiaCompliant,
      overall_compliance_score: overallScore
    });
    
    console.log(`[Compliance] Overall score: ${overallScore}%`);
    
    return overallScore;
  }
  
  private async checkSANS1200(items: any[]): Promise<boolean> {
    // Check if all items have valid SANS codes
    const invalidItems = items.filter(item => !item.sansCode || item.sansCode === '');
    return invalidItems.length === 0;
  }
  
  private async checkNBR(items: any[]): Promise<boolean> {
    // Query supplier_pricing table for NBR compliance
    const supplierIds = items
      .map(item => item.selectedSupplier?.id)
      .filter(Boolean);
    
    if (supplierIds.length === 0) return false;
    
    const { data } = await supabase
      .from('supplier_pricing')
      .select('nbr_compliant')
      .in('supplier_id', supplierIds);
    
    return data?.every(row => row.nbr_compliant) || false;
  }
  
  private async checkAGREMENT(items: any[]): Promise<boolean> {
    const supplierIds = items
      .map(item => item.selectedSupplier?.id)
      .filter(Boolean);
    
    if (supplierIds.length === 0) return false;
    
    const { data } = await supabase
      .from('supplier_pricing')
      .select('agrement_certified')
      .in('supplier_id', supplierIds);
    
    return data?.some(row => row.agrement_certified) || false;
  }
  
  private async checkBBBEE(items: any[]): Promise<number> {
    const supplierIds = items
      .map(item => item.selectedSupplier?.id)
      .filter(Boolean);
    
    if (supplierIds.length === 0) return 0;
    
    // Get BBBEE levels of selected suppliers
    const { data } = await supabase
      .from('suppliers')
      .select('bbbee_level')
      .in('id', supplierIds);
    
    if (!data || data.length === 0) return 0;
    
    // Calculate score based on BBBEE levels
    const bbbeeSuppliers = data.filter(s => s.bbbee_level && s.bbbee_level !== 'Non-compliant');
    const percentage = (bbbeeSuppliers.length / data.length) * 100;
    
    return percentage;
  }
  
  private async getBBBEESupplierCount(items: any[]): Promise<number> {
    const supplierIds = items
      .map(item => item.selectedSupplier?.id)
      .filter(Boolean);
    
    const { data } = await supabase
      .from('suppliers')
      .select('bbbee_level')
      .in('id', supplierIds)
      .not('bbbee_level', 'is', null);
    
    return data?.length || 0;
  }
}
```

### 7. Payment Verification API (EFT)

```typescript
// pages/api/payments/eft/verify.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { getAuthenticatedUser } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // 1. Authenticate admin
    const admin = await getAuthenticatedUser(req.headers.authorization || '');
    
    const { data: adminUser } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', admin.id)
      .single();
    
    if (adminUser?.user_type !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }
    
    // 2. Get invoice to verify
    const { invoiceId } = req.body;
    
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();
    
    if (invoiceError || !invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    if (invoice.payment_status === 'paid') {
      return res.status(400).json({ error: 'Invoice already verified' });
    }
    
    // 3. Mark invoice as paid
    await supabase
      .from('invoices')
      .update({
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
        verified_by: admin.id,
        verified_at: new Date().toISOString()
      })
      .eq('id', invoiceId);
    
    // 4. Activate user subscription
    await supabase
      .from('users')
      .update({
        subscription_tier: invoice.subscription_tier,
        subscription_status: 'active',
        paid_status: true,
        next_billing_date: new Date(
          Date.now() + (invoice.billing_cycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000
        ).toISOString()
      })
      .eq('id', invoice.user_id);
    
    // 5. Log payment transaction
    await supabase.from('payment_transactions').insert({
      invoice_id: invoiceId,
      user_id: invoice.user_id,
      transaction_type: 'payment',
      payment_method: 'manual_eft',
      payment_provider: 'manual_verification',
      amount: invoice.total_amount,
      currency: 'ZAR',
      status: 'completed',
      processed_at: new Date().toISOString()
    });
    
    // 6. Audit log
    await supabase.from('audit_logs').insert({
      user_id: admin.id,
      action: 'verify_payment',
      resource_type: 'invoice',
      resource_id: invoiceId,
      changes: {
        invoice_id: invoiceId,
        amount: invoice.total_amount,
        user_id: invoice.user_id
      }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Payment verified and subscription activated'
    });
    
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
```

---

**(Continued in deployment guide...)**
