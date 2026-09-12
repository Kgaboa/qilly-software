# 🚀 SUPPLIERS QUICK REFERENCE

## ⚡ **QUICK ANSWERS**

### **Q1: Do suppliers need to register before sync?**
**A: NO! Sync auto-creates them.** ✅

### **Q2: What are the 6 suppliers in the database?**
**A: Product suppliers (Buco, Macsteel, etc.) auto-created by sync.** ✅

---

## 📊 **TWO TYPES OF SUPPLIERS**

### **Type 1: Product Suppliers (The 6 you're seeing)**

```
WHAT: Material suppliers (Buco, Builders, Macsteel)
HOW CREATED: Auto-created by API sync ⚡
APPROVAL: Not needed ✅
PURPOSE: Provide pricing data for BOQs
TABLE: suppliers (with operating_provinces, last_sync)
VISIBLE IN: Admin Dashboard → "Supplier API" tab
LOGIN: No (they don't use Qilly)

Examples:
  • Buco (Building Materials)
  • Builders Warehouse (Building Materials)
  • Macsteel (Steel)
  • PPC Cement (Cement)
  • AfriSam (Cement)
  • [Check database for 6th one]
```

### **Type 2: Customer Suppliers (Need approval)**

```
WHAT: Construction companies wanting to USE Qilly
HOW CREATED: Manual signup form 📝
APPROVAL: Admin must approve ⚠️
PURPOSE: Use Qilly to generate BOQs
TABLE: suppliers (with status, user_id, subscription_tier)
VISIBLE IN: Admin Dashboard → "Suppliers" tab
LOGIN: Yes (they use Qilly)

Examples:
  • ABC Construction (signs up)
  • XYZ Builders (signs up)
  • Status: pending → admin approves
```

---

## 🔄 **HOW SYNC WORKS**

```
Click "Sync All":
  ↓
1. Check SUPPLIER_CONFIGS (96 suppliers)
  ↓
2. Filter: scraping/REST API only
  ↓
3. For each supplier:
   • UPSERT supplier record (auto-create)
   • Generate sample products
   • Insert products into database
   • Update last_sync timestamp
  ↓
4. Done! ✅ 6 suppliers + 150 products synced
```

**Key Point:** No manual registration needed! It's all automatic.

---

## 🎯 **HOW TO CHECK YOUR 6 SUPPLIERS**

### **Method 1: Admin Dashboard**
```
1. Login to Admin Dashboard
2. Click "Supplier API" tab
3. Look at supplier list
4. Green checkmarks = synced ✅
5. See names + last sync time
```

### **Method 2: Supabase SQL**
```sql
SELECT 
  name,
  category,
  operating_provinces,
  last_sync
FROM suppliers
WHERE is_active = true
ORDER BY name;
```

### **Method 3: Check Products**
```sql
SELECT 
  s.name as supplier_name,
  COUNT(*) as product_count
FROM supplier_products sp
JOIN suppliers s ON s.id = sp.supplier_id
GROUP BY s.name
ORDER BY product_count DESC;
```

---

## 📋 **LIKELY YOUR 6 SUPPLIERS**

Based on sync priority, you probably have:

```
✅ Buco (Building Materials, 8 provinces)
✅ Builders Warehouse (Building Materials, 8 provinces)
✅ Macsteel (Steel & Metal, 3 provinces)
✅ PPC Cement (Cement, 9 provinces)
✅ AfriSam (Cement, 9 provinces)
✅ [One more - check your database]
```

---

## 🔧 **HOW TO SYNC MORE SUPPLIERS**

### **Want more than 6?**

**Option 1: Sync All (Recommended)**
```
Admin Dashboard → Supplier API → Click "Sync All"
Result: 10-20 suppliers synced
```

**Option 2: Sync Individual**
```
Admin Dashboard → Supplier API → Find supplier → Click "Sync"
Result: That supplier synced
```

---

## ⚠️ **COMMON CONFUSION**

### **Why are there TWO "Suppliers" tabs?**

```
Tab 1: "Suppliers" 
  → Customer suppliers (need approval)
  → Manual signups
  → Status: pending/approved
  → You approve them ✅

Tab 2: "Supplier API"
  → Product suppliers (auto-synced)
  → API integrations
  → Status: active
  → Already working ✅
```

---

## ✅ **SUMMARY**

| Question | Answer |
|----------|--------|
| Do suppliers need to register first? | **NO** - Sync auto-creates them |
| What are the 6 suppliers? | Product suppliers (Buco, Macsteel, etc.) |
| How were they created? | Automatically by sync process |
| Do they need approval? | **NO** - Auto-activated |
| Are they Qilly customers? | **NO** - They provide pricing data |
| Can I sync more? | **YES** - Click "Sync All" anytime |

---

## 🎯 **VERIFICATION CHECKLIST**

- [ ] Login to Admin Dashboard
- [ ] Go to "Supplier API" tab
- [ ] See 6 suppliers with green checkmarks ✅
- [ ] Check last_sync timestamps
- [ ] Go to Supabase → suppliers table
- [ ] Count rows: Should be 6
- [ ] Check supplier_products table
- [ ] Should see 100-300+ products

---

**Bottom Line:** The 6 suppliers are material suppliers (Buco, Builders, Macsteel, etc.) that were automatically created when you synced. They don't need approval - they're ready to provide pricing data! 🎉
