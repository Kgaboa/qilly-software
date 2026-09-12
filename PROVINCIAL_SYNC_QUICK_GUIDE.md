# ⚡ Provincial Sync - Quick Reference

## ✅ **YES! Auto-Creates Provincial Products**

---

## 🎯 **One Click = All Provinces**

```
Click "Sync Now" on BUCO
    ↓
System generates:
  - Cement in Johannesburg (GP): R95.50
  - Cement in Cape Town (WC): R100.28
  - Cement in Durban (KZN): R98.37
  - Cement in Port Elizabeth (EC): R103.14
  - Cement in Polokwane (LIM): R101.23
  - Cement in Nelspruit (MPU): R99.32
  - Cement in Rustenburg (NW): R102.19
  - Cement in Bloemfontein (FS): R100.28
    ↓
40 products created (5 products × 8 provinces)
```

---

## 📊 **Provincial Multipliers**

| Province | Price | Why? |
|----------|-------|------|
| **GP** | Base (1.00×) | Manufacturing hub |
| **WC** | +5% | Distance, coastal |
| **KZN** | +3% | Port access |
| **EC** | +8% | Remote + logistics |
| **LIM** | +6% | Rural delivery |
| **MPU** | +4% | Near Gauteng |
| **NW** | +7% | Mining region |
| **FS** | +5% | Central location |
| **NC** | +12% | Most remote! |

---

## 🚀 **Setup (2 Minutes)**

### **Step 1: Add Province Columns**
Run in Supabase SQL Editor:
```sql
ALTER TABLE supplier_products 
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

ALTER TABLE supplier_products 
ADD CONSTRAINT supplier_products_supplier_province_unique 
UNIQUE (supplier_id, product_code, province);
```

### **Step 2: Sync All**
- Go to: **Supplier API → Sync Products**
- Click: **"Sync All Suppliers"**
- Result: **~114 provincial products created!**

### **Step 3: Test**
- Go to: **Test Pricing**
- Search: "Cement 42.5N" in **Limpopo**
- See: Provincial pricing from all suppliers

---

## 📈 **Example: BUCO Sync**

| Action | Products Created |
|--------|------------------|
| **Before Sync** | 0 |
| **Click "Sync Now"** | ... |
| **After Sync** | 40 (5 products × 8 provinces) |

**Each product has:**
- ✅ Province (gauteng, western-cape, etc.)
- ✅ City (Johannesburg, Cape Town, etc.)
- ✅ Provincial price (multiplier applied)

---

## 💰 **Price Search Flow**

```
User: "Cement 42.5N in Western Cape"
    ↓
System: Query WHERE province = 'western-cape'
    ↓
Results:
  🏆 PPC Cape Town: R98.28
  🥈 BUCO Cape Town: R100.28
  🥉 BW Cape Town: R101.85
```

✅ **Only shows Western Cape pricing!**

---

## 📦 **Sync All Results**

| Supplier | Products | Provinces | Total |
|----------|----------|-----------|-------|
| BUCO | 5 | 8 | 40 |
| Builders Warehouse | 4 | 8 | 32 |
| PPC | 2 | 9 | 18 |
| Lafarge | 2 | 5 | 10 |
| Macsteel | 2 | 3 | 6 |
| Raumix | 2 | 4 | 8 |
| **TOTAL** | **17** | **-** | **114** |

---

## ✅ **Verification**

```sql
-- Check provincial products
SELECT 
  s.name,
  COUNT(*) as products,
  COUNT(DISTINCT province) as provinces
FROM supplier_products sp
JOIN suppliers s ON sp.supplier_id = s.id
GROUP BY s.name;

-- Expected:
-- BUCO: 40 products, 8 provinces
-- PPC: 18 products, 9 provinces
-- etc.
```

---

## 🎯 **Bottom Line**

**Q:** Does sync create provincial products?  
**A:** ✅ **YES! Automatically!**

**Q:** How many products per sync?  
**A:** **Base Products × Provinces Operated In**

**Q:** Do prices vary by province?  
**A:** ✅ **YES! Based on transport/logistics**

**Q:** Manual work required?  
**A:** ❌ **NONE! Fully automated!**

---

**You're all set for provincial pricing!** 🚀
