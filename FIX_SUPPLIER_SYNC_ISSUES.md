# 🔧 FIX: Supplier Sync Issues

## 📋 **ISSUES IDENTIFIED**

### **ISSUE #1: Suppliers with websites marked as 'manual'**

**Affected Suppliers:**
- ✅ AEROLITE (https://www.aerolite.co.za) - Currently: `apiType: 'manual'` ❌
- ✅ GYPROC (https://www.gyproc.co.za) - Currently: `apiType: 'manual'` ❌
- ✅ CHAMBERLAIN STEEL (https://www.chamberlain.co.za) - Currently: `apiType: 'manual'` ❌
- ✅ NPC-CIMPOR (https://www.npc-cimpor.co.za) - Currently: `apiType: 'manual'` ❌

**Problem:** These suppliers have websites with product catalogs, but are set to 'manual' sync type, so they don't auto-sync.

**Should be:** `apiType: 'scraping'` ✅

---

### **ISSUE #2: REST/Scraping suppliers not syncing**

**Affected Suppliers:**
- ❌ Lafarge Cement - `apiType: 'scraping'` but NO scraper implementation
- ❌ PPC Cement - `apiType: 'scraping'` but NO scraper implementation  
- ❌ Raumix - `apiType: 'scraping'` but NO scraper implementation
- ❌ ABB - `apiType: 'rest'` but NO REST fetcher implementation

**Problem:** Suppliers are marked as REST/scraping, but the fetchers only have implementations for:
- ✅ Buco (scraping)
- ✅ Builders Warehouse (scraping)
- ✅ Macsteel (scraping)
- ✅ PPC Cement (REST API - but wrong type in config!)
- ✅ AfriSam (REST API)
- ✅ Corobrik (REST API)

**Root Cause:** Mismatch between `SUPPLIER_CONFIGS` apiType and actual fetcher implementations.

---

## ✅ **SOLUTION**

I'll create a comprehensive fix that:

1. **Changes apiType for suppliers with websites** from 'manual' to 'scraping'
2. **Adds scraper implementations** for all scraping-type suppliers
3. **Fixes PPC config** (should be 'rest' not 'scraping')
4. **Adds REST implementations** for ABB and other REST suppliers
5. **Updates sync to use new fetchers** instead of sample data

---

## 🔧 **IMPLEMENTATION**

### **Part 1: Fix Supplier Configurations**

Update `/src/utils/suppliers/supplier-connector.ts`:

```typescript
// AEROLITE - Change to scraping
{
  id: 'aerolite',
  name: 'AEROLITE',
  category: 'building_materials',
  apiType: 'scraping', // ✅ Changed from 'manual'
  website: 'https://www.aerolite.co.za',
  provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
  isActive: true,
},

// GYPROC - Change to scraping
{
  id: 'gyproc',
  name: 'GYPROC',
  category: 'building_materials',
  apiType: 'scraping', // ✅ Changed from 'manual'
  website: 'https://www.gyproc.co.za',
  provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
  isActive: true,
},

// CHAMBERLAIN STEEL - Change to scraping
{
  id: 'chamberlain',
  name: 'CHAMBERLAIN STEEL',
  category: 'steel_metal',
  apiType: 'scraping', // ✅ Changed from 'manual'
  website: 'https://www.chamberlain.co.za',
  provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
  isActive: true,
},

// NPC-CIMPOR - Change to scraping
{
  id: 'npc-cimpor',
  name: 'NPC-CIMPOR',
  category: 'concrete_aggregates',
  apiType: 'scraping', // ✅ Changed from 'manual'
  website: 'https://www.npc-cimpor.co.za',
  provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
  isActive: true,
},

// PPC - Fix to REST (has API endpoint)
{
  id: 'ppc-cement', // ✅ Changed ID to match fetcher
  name: 'PPC Cement',
  category: 'concrete_aggregates',
  apiType: 'rest', // ✅ Changed from 'scraping' to 'rest'
  website: 'https://www.ppc.co.za',
  provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'northern-cape', 'free-state'],
  isActive: true,
},
```

---

### **Part 2: Add Scraper Implementations**

Add to `/src/utils/suppliers/product-fetchers/scraping-fetcher.ts`:

```typescript
switch (this.supplierId) {
  case 'buco':
    products = await this.scrapeBucoProducts();
    break;
  case 'builders-warehouse':
    products = await this.scrapeBuildersProducts();
    break;
  case 'macsteel':
    products = await this.scrapeMacsteelProducts();
    break;
    
  // NEW SCRAPERS
  case 'lafarge':
    products = await this.scrapeLafargeProducts();
    break;
  case 'ppc':
    products = await this.scrapePPCProducts();
    break;
  case 'raumix':
    products = await this.scrapeRaumixProducts();
    break;
  case 'aerolite':
    products = await this.scrapeAeroliteProducts();
    break;
  case 'gyproc':
    products = await this.scrapeGyprocProducts();
    break;
  case 'chamberlain':
    products = await this.scrapeChamberlainProducts();
    break;
  case 'npc-cimpor':
    products = await this.scrapeNPCProducts();
    break;
    
  default:
    products = await this.scrapeGenericWebsite();
}
```

---

### **Part 3: Add REST API Implementations**

Add to `/src/utils/suppliers/product-fetchers/rest-api-fetcher.ts`:

```typescript
switch (this.supplierId) {
  case 'ppc-cement':
    products = await this.fetchPPCProducts();
    break;
  case 'afrisam':
    products = await this.fetchAfrisamProducts();
    break;
  case 'corobrik':
    products = await this.fetchCorobrikProducts();
    break;
    
  // NEW REST APIs
  case 'abb':
    products = await this.fetchABBProducts();
    break;
  case 'schneider':
    products = await this.fetchSchneiderProducts();
    break;
    
  default:
    products = await this.fetchGenericAPIProducts();
}
```

---

### **Part 4: Update Sync to Use New Fetchers**

Update `/src/app/components/SupplierIntegration.tsx`:

```typescript
const handleSync = async (supplierId: string) => {
  setLoading(true);
  
  try {
    // Use the new comprehensive product fetchers
    const result = await fetchSupplierProducts(supplierId);
    
    if (result.success && result.products.length > 0) {
      // Sync products to database
      const syncResult = await syncSupplierProducts(supplierId, result.products);
      setSyncStatus(prev => ({
        ...prev,
        [supplierId]: syncResult
      }));
      
      toast.success(`✅ Synced ${result.totalProducts} products from ${result.supplierName}`);
    } else {
      toast.error(`❌ No products fetched: ${result.errors.join(', ')}`);
    }
    
    await loadSuppliers();
  } catch (error) {
    console.error('Sync error:', error);
    toast.error('Sync failed. Check console for details.');
  }
  
  setLoading(false);
};
```

---

## 📊 **COMPARISON: Before vs After**

### **BEFORE (Current State):**

```
AEROLITE:           manual    → ❌ No auto-sync
GYPROC:             manual    → ❌ No auto-sync
CHAMBERLAIN STEEL:  manual    → ❌ No auto-sync
NPC-CIMPOR:         manual    → ❌ No auto-sync

Lafarge:            scraping  → ❌ No scraper implementation
PPC:                scraping  → ❌ Wrong type (should be REST)
Raumix:             scraping  → ❌ No scraper implementation
ABB:                rest      → ❌ No REST implementation

Sync All → Only syncs: Buco, Builders Warehouse, Macsteel
         → Uses sample data, not real products
```

### **AFTER (Fixed):**

```
AEROLITE:           scraping  → ✅ Auto-sync with scraper
GYPROC:             scraping  → ✅ Auto-sync with scraper
CHAMBERLAIN STEEL:  scraping  → ✅ Auto-sync with scraper
NPC-CIMPOR:         scraping  → ✅ Auto-sync with scraper

Lafarge:            scraping  → ✅ Scraper implementation added
PPC:                rest      → ✅ REST API fetcher (correct type)
Raumix:             scraping  → ✅ Scraper implementation added
ABB:                rest      → ✅ REST API implementation added

Sync All → Syncs ALL REST & Scraping suppliers
         → Uses real product fetchers (200+ products per supplier)
```

---

## 🎯 **EXPECTED RESULTS**

After applying the fixes:

### **Sync All will process:**

**REST API Suppliers (using REST fetchers):**
- ✅ PPC Cement (10+ products)
- ✅ AfriSam (12+ products)
- ✅ Corobrik (8+ products)
- ✅ ABB (electrical products)

**Scraping Suppliers (using web scrapers):**
- ✅ Buco (200+ products)
- ✅ Builders Warehouse (150+ products)
- ✅ Macsteel (50+ steel products)
- ✅ Lafarge (cement products)
- ✅ Raumix (concrete products)
- ✅ AEROLITE (insulation products)
- ✅ GYPROC (drywall/ceiling products)
- ✅ CHAMBERLAIN STEEL (steel products)
- ✅ NPC-CIMPOR (cement products)

**Manual Suppliers (skipped by auto-sync):**
- ⏭️ BUILDERS
- ⏭️ BUILDERS DEPOT
- ⏭️ BILT
- ⏭️ TALISMAN
- ⏭️ etc. (require manual CSV upload or entry)

### **Total Products After Sync:**

- 🎯 **15+ suppliers** auto-syncing
- 🎯 **1,000+ products** in database
- 🎯 **All 9 product categories** covered
- 🎯 **All 9 provinces** with pricing

---

## 📝 **QUICK REFERENCE: Supplier Types**

### **REST API (Has API endpoint):**
```
✅ Should sync automatically
✅ Fast and reliable
✅ Structured data

Examples:
- PPC Cement (cement API)
- AfriSam (cement/aggregate API)
- Corobrik (brick/paving API)
- ABB (electrical products API)
```

### **Scraping (Has website, no API):**
```
✅ Should sync automatically
⚠️ Slower than REST
⚠️ May need updates if website changes

Examples:
- Buco (e-commerce site)
- Builders Warehouse (e-commerce site)
- Lafarge (product catalog)
- AEROLITE (product catalog)
```

### **Manual (No API, complex site, or B2B only):**
```
❌ Cannot auto-sync
📄 Upload CSV
⌨️ Manual entry
📧 Request data from supplier

Examples:
- BUILDERS DEPOT (B2B only)
- TALISMAN (custom quotes)
- CIVIL LAB (testing services)
```

---

## ✅ **ACTION REQUIRED**

To apply these fixes, I need to:

1. **Update supplier-connector.ts** - Change apiType for AEROLITE, GYPROC, CHAMBERLAIN, NPC-CIMPOR, and PPC
2. **Add scraper implementations** - For Lafarge, Raumix, Aerolite, Gyproc, Chamberlain, NPC-Cimpor
3. **Add REST implementations** - For ABB and other REST suppliers
4. **Update SupplierIntegration.tsx** - Use new fetchers instead of sample data

**Should I proceed with these changes?**

This will enable:
- ✅ 10+ additional suppliers auto-syncing
- ✅ 1,000+ real products instead of 50 samples
- ✅ Comprehensive product coverage across all categories
