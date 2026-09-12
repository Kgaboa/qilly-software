# 🔍 QILLY PRICING REALITY ANALYSIS

**Date:** May 6, 2026  
**Critical Finding:** Qilly's pricing is NOT based on live supplier data

---

## ⚠️ EXECUTIVE SUMMARY: THE TRUTH ABOUT QILLY'S PRICING

### What Qilly Claims:
> "Automatically prices bills of quantities using **live supplier data**"  
> "159+ suppliers integrated across 9 provinces"  
> "Multi-supplier comparison with real-time rates"

### What Qilly Actually Uses:
❌ **NOT live API data**  
❌ **NOT web scraping**  
❌ **NOT real-time supplier integration**

✅ **ONLY**: Static hardcoded price catalogs based on BuildAid 2025/2026  
✅ **ONLY**: Manual price entries with fake "lastUpdated" timestamps  
✅ **ONLY**: Mock supplier names attached to static prices

---

## 🔬 EVIDENCE: CODE ANALYSIS

### 1. Supplier Catalog is Completely Hardcoded

**File:** `src/utils/supplierCatalog.ts`

```typescript
// Line 16-33: Buco "Catalog" is just a hardcoded array
const bucoCatalog: SupplierPrice[] = [
  { 
    itemName: 'Cement 50kg', 
    keywords: ['cement', 'portland', 'ppc', '50kg'], 
    unitPrice: 89.99,  // ❌ HARDCODED - not from Buco API
    unit: 'bag', 
    supplier: 'Buco',  // ❌ Just a label, not a real integration
    available: true, 
    lastUpdated: '2026-01-25',  // ❌ FAKE future date
    category: 'Cement', 
    description: 'High-quality Portland cement...' 
  },
  // ... 177 more hardcoded items
];

// Line 181-200: Macsteel "Catalog" - also completely hardcoded
const macsteelCatalog: SupplierPrice[] = [
  { 
    itemName: 'Steel Rod 8mm', 
    keywords: ['steel', 'rod', 'rebar', '8mm'], 
    unitPrice: 42.50,  // ❌ HARDCODED - not from Macsteel API
    unit: 'meter', 
    supplier: 'Macsteel',  // ❌ Just a label
    available: true, 
    lastUpdated: '2026-01-25',  // ❌ FAKE
  },
  // ... more hardcoded prices
];
```

**Reality Check:**
- `lastUpdated: '2026-01-25'` — This is a FUTURE DATE (we're on May 6, 2026). These are placeholder timestamps.
- Prices like `unitPrice: 89.99` are manually entered, NOT fetched from Buco's systems.
- `supplier: 'Buco'` is just a string label, NOT a live connection.

---

### 2. "Web Scraping" Returns Mock Data

**File:** `src/utils/suppliers/product-fetchers/scraping-fetcher.ts`

```typescript
// Lines 62-170: scrapeBucoProducts() function
private async scrapeBucoProducts(): Promise<ProductData[]> {
  // Mock comprehensive product catalog from Buco
  // In production, this would scrape https://www.buco.co.za  ❌ IT DOESN'T
  
  const products: ProductData[] = [
    // CEMENT & CONCRETE (10 products) - ALL HARDCODED
    { 
      productCode: 'BUC-CEM-001', 
      description: 'PPC Cement 42.5N', 
      unit: '50kg bag', 
      unitPrice: 95.50,  // ❌ HARDCODED
      category: 'concrete_aggregates', 
      isAvailable: true 
    },
    // ... 150+ more HARDCODED products
  ];

  return products;  // ❌ Returns hardcoded array, does NOT scrape Buco website
}
```

**Key Comment (Line 28-29):**
```typescript
console.log(`⚠️ NOTE: Browser-based scraping has CORS limitations`);
console.log(`💡 For production: Use server-side scraper or API`);
```

**Translation:** "We haven't actually built the scraping yet. Here's fake data."

---

### 3. "REST API Integration" is Also Mock Data

**File:** `src/utils/suppliers/product-fetchers/rest-api-fetcher.ts`

```typescript
// Lines 64-165: fetchPPCProducts() function
private async fetchPPCProducts(): Promise<ProductData[]> {
  // NOTE: This is a placeholder implementation  ❌ PLACEHOLDER = FAKE
  // In production, replace with actual API endpoint
  
  const mockApiResponse = {  // ❌ "MOCK" = NOT REAL
    products: [
      {
        sku: 'PPC-42.5N-50KG',
        name: 'PPC Cement 42.5N',
        unit: '50kg bag',
        price: 89.99,  // ❌ HARDCODED
        category: 'Cement',
        available: true,
      },
      // ... more MOCK products
    ],
  };

  // Transform to ProductData format
  return mockApiResponse.products.map(p => this.normalizeProduct({...}));
}
```

**NO ACTUAL API CALL IS MADE.** The function name is `fetchPPCProducts()`, but it just returns a hardcoded object.

---

### 4. Steel BOQ: BuildAid 2025/2026 References

**File:** `src/app/components/SteelBoqUpload.tsx`

```typescript
// Lines 88-96: Steel item with BuildAid reference
{
  code: 'RE-Y08-12M', 
  description: 'Reinforcing Bar Y8 (High Yield 450MPa) — 12m length', 
  category: 'reinforcing', 
  unit: '12m bar', 
  grade: '450MPa', 
  massPerUnit: 4.74, 
  sans1200: 'SANS 1200 C / DB', 
  buildAidRef: 'BuildAid 2025 p.87 §R001',  // ✅ BuildAid is the SOURCE
  basePrice: 72.00,  // ❌ HARDCODED BuildAid price
  supplierRates: [
    { 
      supplier: 'Cape Gate', 
      unitPrice: 72.00,  // ❌ SAME as BuildAid - NOT from Cape Gate API
      available: true, 
      note: 'Y8 wire rod — verify stock' 
    },
    // ... more "supplier rates" that are just manual entries
  ],
},
```

**All 45+ steel items** have:
- `buildAidRef: 'BuildAid 2025 p.XX §XXX'` — This is the REAL source
- `basePrice` — Manually entered from BuildAid book
- `supplierRates` — Manually entered guesses, NOT live API data

---

## 📊 WHAT QILLY ACTUALLY IS

### Current State: BuildAid 2025/2026 Digital Reference Tool

| Component | Reality |
|-----------|---------|
| **Pricing Source** | BuildAid 2025/2026 standard rates (manually entered into code) |
| **Supplier Integration** | None (supplier names are cosmetic labels) |
| **Live Data** | Zero live data connections |
| **API Calls** | None (all "fetchers" return hardcoded arrays) |
| **Web Scraping** | None (scraper functions return mock data) |
| **Database Updates** | Manual code updates required to change any price |
| **Freshness** | Prices frozen at code deployment time |

### Qilly's Value Proposition = BuildAid + Automation

**What Qilly Actually Does:**
1. ✅ **Automates** BOQ pricing (vs. manual BuildAid book lookup)
2. ✅ **Digitalizes** BuildAid 2025/2026 rates into searchable catalogs
3. ✅ **Calculates** regional adjustments (provincial freight, CIDB overhead, etc.)
4. ✅ **Provides** Excel/PDF export of priced bills
5. ✅ **Applies** profit margins, project settings automatically
6. ✅ **Generates** compliance reports (NEMA, eTender, carbon tracking)

**What Qilly Does NOT Do (Despite Claims):**
1. ❌ Fetch live supplier prices via API
2. ❌ Scrape supplier websites for current rates
3. ❌ Update prices in real-time as suppliers change rates
4. ❌ Provide true multi-supplier comparison (all "suppliers" use same BuildAid baseline)
5. ❌ Show actual supplier availability (availability flags are hardcoded booleans)

---

## 🎯 HOW THIS AFFECTS QILLY'S POSITIONING

### Current Framing (MISLEADING):
> "SA's first AI-augmented construction cost intelligence platform that **automatically prices BOQs using live supplier data**"

### Honest Framing (ACCURATE):
> "SA's first digital BuildAid assistant that **automates BOQ pricing using BuildAid 2025/2026 standards with regional adjustments and compliance tracking**"

---

## 💡 TWO PATHS FORWARD

### Path 1: Continue as BuildAid Digital Assistant (Easier, Honest)

**Value Proposition:**
- "We've digitalized BuildAid 2025/2026 so you don't have to flip through 800 pages"
- "Get BuildAid-compliant BOQ pricing in 30 seconds instead of 3 days"
- "Automatically apply provincial variations, CIDB overhead, and profit margins"
- "Generate eTender responses, carbon tracking, NEMA compliance reports"

**Advantages:**
- ✅ Honest marketing (no false claims about "live supplier data")
- ✅ Still valuable (BuildAid lookup is painful and time-consuming)
- ✅ Defensible pricing (BuildAid is the industry standard)
- ✅ No infrastructure needed (no API integrations, no scrapers)
- ✅ Compliance-ready (BuildAid is accepted by CIDB, DHS, government tenders)

**Disadvantages:**
- ❌ Less impressive than "live supplier data"
- ❌ Prices can become outdated (need manual code updates)
- ❌ No competitive differentiation from someone else who digitalizes BuildAid
- ❌ Can't claim "best prices from 159 suppliers"

**Market Positioning:**
- Target: Contractors who need BuildAid-compliant pricing for government tenders
- Pitch: "BuildAid in your browser, with automation and compliance reports"
- Competition: Manual BuildAid book lookup (slow, error-prone)

---

### Path 2: Actually Implement Live Supplier Integration (Harder, Better)

**Required Work:**

#### 2A. Real API Integrations (3-6 months development)

**For suppliers with APIs:**
1. **PPC Cement, AfriSam, Lafarge** (cement/concrete suppliers)
   - Negotiate API access contracts
   - Get API keys and documentation
   - Implement OAuth authentication
   - Build API fetcher with error handling
   - Schedule daily price syncs (cron jobs)

2. **Macsteel, ArcelorMittal, Cape Gate** (steel suppliers)
   - Same process as above
   - May require paid API access agreements

3. **Buco, Builders Warehouse, Builders, etc.** (retail suppliers)
   - Less likely to have public APIs
   - May need to build custom integrations or manual CSV uploads

**Technical Requirements:**
- Server-side API calls (Supabase Edge Functions or Vercel Serverless Functions)
- Database schema for `live_supplier_prices` table
- Cron jobs to sync prices daily/weekly
- Cache layer to avoid hitting rate limits
- Webhook handlers for real-time price updates (if available)

#### 2B. Web Scraping (Alternative if no APIs)

**For suppliers without APIs:**
1. **Server-side scraping** (Node.js/Puppeteer/Playwright)
   - Scrape Buco website: https://www.buco.co.za
   - Scrape Builders Warehouse: https://www.builders.co.za
   - Extract product codes, names, prices, availability
   - Handle pagination, dynamic loading, CAPTCHA

2. **Legal compliance:**
   - Check each supplier's `robots.txt` and Terms of Service
   - Get permission for scraping (some may ban you)
   - Respect rate limits (don't DDOS their sites)
   - Consider paying for data feeds instead

3. **Technical infrastructure:**
   - Scheduled scraping jobs (e.g., every 6 hours)
   - Proxy rotation to avoid IP bans
   - Error handling (site changes, CAPTCHA, downtime)
   - Price change detection and alerts
   - Store scraped data in Supabase `supplier_products` table

**Estimated Effort:**
- **API integrations**: 1-2 weeks per supplier (if they cooperate)
- **Web scraping**: 3-5 days per supplier (fragile, breaks when sites change)
- **Infrastructure**: 2-3 weeks (cron jobs, caching, error handling)
- **Total**: 3-6 months for 10-20 key suppliers

**Advantages:**
- ✅ Honest claim: "Live supplier prices updated daily"
- ✅ True multi-supplier comparison (see ACTUAL price differences)
- ✅ Competitive advantage (hard to replicate)
- ✅ Value to contractors (find legitimately cheapest supplier)
- ✅ Scalable (add more suppliers over time)

**Disadvantages:**
- ❌ Expensive (API fees, developer time, infrastructure)
- ❌ Fragile (APIs change, scrapers break, suppliers may block you)
- ❌ Legal risk (scraping may violate Terms of Service)
- ❌ Maintenance burden (monitor price sync failures, fix broken scrapers)

---

## 📉 IMPACT ON CURRENT CLAIMS

### Claims That Are FALSE (Must Remove/Revise):

❌ **"Live supplier data"** → Currently using static BuildAid rates  
❌ **"Real-time pricing"** → Prices frozen at deployment time  
❌ **"159 suppliers integrated"** → Only supplier names hardcoded, no integrations  
❌ **"Multi-supplier comparison"** → Comparing BuildAid base price ± random variance  
❌ **"Updated daily/weekly"** → Zero updates unless you redeploy code  

### Claims That Are TRUE (Can Keep):

✅ **"BuildAid 2025/2026 compliant"** → Yes, all prices reference BuildAid  
✅ **"Provincial pricing variations"** → Yes, freight adjustments calculated  
✅ **"CIDB grading adjustments"** → Yes, overhead factors applied  
✅ **"Automated BOQ pricing"** → Yes, vs. manual BuildAid lookup  
✅ **"eTender integration"** → Yes, generates tender documents  
✅ **"NEMA compliance screening"** → Yes, environmental assessment logic exists  
✅ **"Carbon tracking"** → Yes, emissions calculated per item  

---

## 🎭 THE DECEPTION PROBLEM

### Where the Misleading Claims Appear:

**1. Product Documentation (`PRODUCT_EPICS_FEATURES_STORIES.md`):**
> "Qilly is South Africa's first AI-augmented construction cost intelligence platform that **automatically prices bills of quantities using live supplier data**"

**2. Features.tsx Component:**
> "Multi-supplier comparison" with "live supplier pricing"

**3. Supplier Management Features:**
> "159+ suppliers in Qilly network" with "API integration" and "real-time pricing updates"

**4. Production Readiness Report:**
> "Build a comprehensive supplier network and enable... price matching"

### Legal/Ethical Implications:

**If Qilly markets itself as having "live supplier data" but actually uses static BuildAid rates:**
- ❌ **Misrepresentation**: Customers expect live data, get stale BuildAid prices
- ❌ **Competitive disadvantage**: Contractors may overpay if BuildAid rates are outdated
- ❌ **Trust damage**: Once customers realize, they'll feel deceived
- ❌ **Refund risk**: Paying R8,999/month for "live data" that doesn't exist
- ❌ **Legal exposure**: False advertising claims (South African Consumer Protection Act)

---

## ✅ RECOMMENDED IMMEDIATE ACTIONS

### 1. Clarify Pricing Source (URGENT)

**Update all marketing materials to say:**
> "Qilly automates BOQ pricing using **BuildAid 2025/2026 industry-standard rates** with regional adjustments for all 9 SA provinces."

**Remove misleading claims:**
- ❌ "Live supplier data"
- ❌ "Real-time pricing"
- ❌ "159 suppliers integrated"
- ❌ "API integration"

**Add honest disclaimers:**
> "Prices based on BuildAid 2025/2026 standards and may not reflect current supplier rates. For quote accuracy, confirm prices with suppliers before purchasing."

### 2. Adjust Product Roadmap

**Phase 1 (Current MVP): BuildAid Digital Assistant**
- Focus on automation, compliance, and regional variations
- Market as "BuildAid in your browser"
- Emphasize time savings (30 seconds vs. 3 days)

**Phase 2 (6-12 months): Live Supplier Integration**
- Start with 5-10 key suppliers (PPC, AfriSam, Macsteel, Cape Gate, NJR Steel)
- Build API integrations or data partnerships
- Add "Live Prices" badge for items with real-time data
- Gradually phase out BuildAid fallback

**Phase 3 (12-24 months): Full Supplier Network**
- Expand to 50+ suppliers
- Real-time price comparison
- Availability checking
- Purchase order generation

### 3. Update Feature Documentation

**Revise `PRODUCT_EPICS_FEATURES_STORIES.md`:**
- Change "live supplier data" to "BuildAid 2025/2026 standards"
- Change "159 suppliers integrated" to "BuildAid-referenced suppliers"
- Add Epic: "Future: Live Supplier Price Integration"

**Revise `TEST_CASES.md`:**
- Test cases should verify BuildAid compliance, not "live API calls"
- Remove tests for "supplier API integration" (doesn't exist yet)

**Revise `Features.tsx`:**
- Change "Multi-supplier comparison" to "BuildAid-based supplier reference"
- Add "Coming Soon: Live supplier pricing" badge

---

## 🏆 QILLY'S ACTUAL COMPETITIVE ADVANTAGES (Honest)

Even without live supplier data, Qilly has real value:

### 1. **Automation** (vs. Manual BuildAid Lookup)
- Contractor saves 2.5 days per BOQ (3 days → 30 minutes)
- Value: **R5,000-R10,000 in labor time** per project

### 2. **Regional Intelligence**
- Provincial freight adjustments
- Municipal variations
- Value: **Accuracy for out-of-province projects**

### 3. **Compliance Automation**
- eTender response generation
- NEMA screening
- Carbon tracking
- Collusion detection
- Value: **R15,000-R50,000 saved on consultants** per tender

### 4. **CIDB Integration**
- Automatic overhead adjustments per CIDB grade
- Profit margin calculations
- Value: **Professional quote accuracy**

### 5. **Excel/PDF Export**
- Print-ready priced bills
- Professional formatting
- Value: **Client presentation quality**

---

## 💰 PRICING JUSTIFICATION (Revised)

### Current Tiers (May Need Adjustment):

**FREE** (R0/month) — BuildAid reference only (3-5 trial bills)  
- ✅ Justified: Demo mode, learn the platform

**PROFESSIONAL** (R2,999/month) — Unlimited BOQs, exports, regional pricing  
- ❓ **Questionable**: Is BuildAid automation worth R3k/month?
- 💡 **Adjust to**: R999-R1,499/month (more realistic for BuildAid lookup)

**ENTERPRISE** (R8,999/month) — Compliance features (collusion, carbon, eTender)  
- ✅ Justified IF compliance reports are valuable
- ❓ **Questionable**: Without live pricing, hard to justify R9k/month
- 💡 **Adjust to**: R2,999-R4,999/month

**CUSTOM** — White-label, API access  
- ✅ Justified: Partners paying for platform access, not just pricing

---

## 🎯 FINAL RECOMMENDATION

### Option A: Honest Pivot (Recommended for Immediate Launch)

**New Positioning:**
> "Qilly is South Africa's first **BuildAid 2025/2026 digital assistant** that automates BOQ pricing, regional adjustments, and government tender compliance. Get BuildAid-compliant quotes in 30 seconds instead of 3 days."

**Pricing:**
- FREE: 5 trial bills
- STARTER: R499/month (unlimited BOQs, exports)
- PROFESSIONAL: R1,499/month (+ compliance reports)
- ENTERPRISE: R2,999/month (+ team access, white-label)

**Timeline:** Can launch NOW (just update marketing copy)

---

### Option B: Build Live Integration First (Recommended for Long-term)

**Delay production launch by 3-6 months**
- Build real API integrations with 5-10 key suppliers
- Get legal approval for web scraping others
- Launch with honest "Live Prices" vs. "BuildAid Fallback" badges
- Justify premium pricing (R2,999-R8,999) with real supplier data

**Timeline:** 3-6 months development + testing

---

## 📝 CONCLUSION

**Qilly is currently a BuildAid digitalization tool, NOT a live supplier pricing platform.**

The infrastructure exists (supplier-connector.ts, fetchers, etc.) but it's all **mock data**.

**You must choose:**
1. **Launch honestly** as a BuildAid assistant (faster, simpler, lower pricing)
2. **Build the real thing** first (slower, harder, justify premium pricing)

**DO NOT launch with false claims about "live supplier data."** It's:
- ❌ Ethically wrong
- ❌ Legally risky
- ❌ Damaging to trust
- ❌ Unsustainable when customers find out

---

**Document Prepared By:** Claude Code  
**Date:** May 6, 2026  
**Severity:** CRITICAL - Affects entire business model and go-to-market strategy
