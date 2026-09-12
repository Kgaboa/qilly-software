# 🔧 SQL Troubleshooting Guide - Provincial Pricing Setup

## ❌ **Common Errors & Fixes**

---

### **Error 1: "syntax error at or near 'NOT'"**

**Full Error:**
```
ERROR: 42601: syntax error at or near "NOT"
LINE 43: CREATE POLICY IF NOT EXISTS "Anyone can view price multipliers"
```

**Cause:**
PostgreSQL doesn't support `IF NOT EXISTS` with `CREATE POLICY`

**Fix:**
✅ **Use the SIMPLE version:**
```sql
-- Run: /EFFICIENT_PROVINCIAL_PRICING_SIMPLE.sql
-- This uses DROP POLICY IF EXISTS first, then CREATE POLICY
```

**The simple version does:**
```sql
-- 1. Drop old policy if it exists
DROP POLICY IF EXISTS "Anyone can view price multipliers" ON provincial_price_multipliers;

-- 2. Create new policy
CREATE POLICY "Anyone can view price multipliers" 
  ON provincial_price_multipliers FOR SELECT 
  USING (true);
```

---

### **Error 2: "table suppliers does not exist"**

**Full Error:**
```
ERROR: relation "suppliers" does not exist
```

**Cause:**
The base tables haven't been created yet

**Fix:**
✅ **Run the base setup first:**
```sql
-- 1. Run this FIRST: /SUPABASE_SETUP_FIXED.sql
-- 2. Then run: /EFFICIENT_PROVINCIAL_PRICING_SIMPLE.sql
```

**Order matters:**
1. Base tables (suppliers, supplier_products, etc.)
2. Provincial pricing enhancement

---

### **Error 3: "column operating_provinces already exists"**

**Full Error:**
```
ERROR: column "operating_provinces" of relation "suppliers" already exists
```

**Cause:**
You've already run the script before

**Fix:**
✅ **This is safe to ignore!** The script uses `ADD COLUMN IF NOT EXISTS`, so it won't break anything.

Or you can remove that line and run again:
```sql
-- Comment out or remove:
-- ALTER TABLE suppliers 
-- ADD COLUMN IF NOT EXISTS operating_provinces TEXT[] DEFAULT '{}';
```

---

### **Error 4: "policy already exists"**

**Full Error:**
```
ERROR: policy "Anyone can view price multipliers" for table "provincial_price_multipliers" already exists
```

**Cause:**
Running the script multiple times

**Fix:**
✅ **Use the SIMPLE version** - it drops old policies first:
```sql
DROP POLICY IF EXISTS "Anyone can view price multipliers" ON provincial_price_multipliers;
CREATE POLICY "Anyone can view price multipliers" ...
```

---

### **Error 5: "permission denied for table"**

**Full Error:**
```
ERROR: permission denied for table provincial_price_multipliers
```

**Cause:**
RLS is enabled but you're not authenticated

**Fix:**
✅ **Grant anon access:**
```sql
-- Already in the script:
GRANT SELECT ON supplier_products_provincial TO anon;
```

Or disable RLS temporarily for testing:
```sql
ALTER TABLE provincial_price_multipliers DISABLE ROW LEVEL SECURITY;
```

---

### **Error 6: "function get_provincial_price already exists"**

**Full Error:**
```
ERROR: function "get_provincial_price" already exists with same argument types
```

**Cause:**
Running script multiple times

**Fix:**
✅ **Use `CREATE OR REPLACE FUNCTION`** (already in the script):
```sql
CREATE OR REPLACE FUNCTION get_provincial_price(...) -- Safe to run multiple times
```

---

## ✅ **Recommended Script to Use**

### **🎯 Use This One:**
```
/EFFICIENT_PROVINCIAL_PRICING_SIMPLE.sql
```

**Why?**
- ✅ No syntax errors
- ✅ Handles existing policies
- ✅ Safe to run multiple times
- ✅ Clean and simple
- ✅ Includes verification queries

### **⚠️ Don't Use:**
```
/ADD_PROVINCE_TO_PRODUCTS.sql  ← OLD INEFFICIENT APPROACH
```

---

## 🚀 **Step-by-Step Setup (Error-Free)**

### **Step 1: Verify Base Tables Exist**
```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('suppliers', 'supplier_products');

-- Expected: 2 rows
-- If empty, run /SUPABASE_SETUP_FIXED.sql first!
```

### **Step 2: Run Provincial Pricing Setup**
```sql
-- Copy and paste entire contents of:
-- /EFFICIENT_PROVINCIAL_PRICING_SIMPLE.sql

-- Click "Run"
```

### **Step 3: Verify Success**
```sql
-- Check multipliers table
SELECT COUNT(*) FROM provincial_price_multipliers;
-- Expected: 9 (one per province)

-- Check function exists
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'get_provincial_price';
-- Expected: 1 row

-- Check view exists
SELECT table_name 
FROM information_schema.views 
WHERE table_name = 'supplier_products_provincial';
-- Expected: 1 row

-- Check operating_provinces column
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'suppliers' 
AND column_name = 'operating_provinces';
-- Expected: 1 row
```

### **Step 4: Test Provincial Pricing**
```sql
-- Sync a supplier first (Admin Dashboard → Sync Products)
-- Then test the view:

SELECT 
  supplier_name,
  description,
  base_price,
  province_code,
  major_city,
  multiplier,
  provincial_price,
  (provincial_price - base_price) as markup
FROM supplier_products_provincial
WHERE supplier_name = 'BUCO'
ORDER BY description, province_code;

-- Expected: Products with different prices per province
```

---

## 🆘 **Still Getting Errors?**

### **Nuclear Option: Complete Reset**

```sql
-- ⚠️ WARNING: This deletes ALL data!
-- Only use if you're stuck and need to start fresh

-- 1. Drop everything provincial pricing related
DROP VIEW IF EXISTS supplier_products_provincial CASCADE;
DROP FUNCTION IF EXISTS get_provincial_price(DECIMAL, TEXT) CASCADE;
DROP TABLE IF EXISTS provincial_price_multipliers CASCADE;
ALTER TABLE suppliers DROP COLUMN IF EXISTS operating_provinces;

-- 2. Now run the simple script
-- /EFFICIENT_PROVINCIAL_PRICING_SIMPLE.sql
```

---

## 📋 **Checklist Before Running**

- [ ] Base tables exist (suppliers, supplier_products)
- [ ] You're in Supabase SQL Editor
- [ ] Using `/EFFICIENT_PROVINCIAL_PRICING_SIMPLE.sql` (not the old one)
- [ ] Copied ENTIRE file contents
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run" button

---

## ✅ **Expected Success Output**

```
NOTICE: ✅ SUCCESS! Provincial pricing system installed!

NOTICE: 📊 Next steps:
NOTICE: 1. Go to Admin Dashboard → Supplier API → Sync Products
NOTICE: 2. Click "Sync All Suppliers"
NOTICE: 3. Base products will be stored efficiently
NOTICE: 4. Provincial prices calculated automatically via view

NOTICE: 💾 Storage efficiency: 90% reduction!
NOTICE: 🚀 Ready to use!

Success. No rows returned
```

---

## 🎯 **Quick Reference**

| File | Purpose | Status |
|------|---------|--------|
| `/SUPABASE_SETUP_FIXED.sql` | Base tables | ✅ Run FIRST |
| `/EFFICIENT_PROVINCIAL_PRICING_SIMPLE.sql` | Provincial pricing | ✅ Run SECOND |
| `/EFFICIENT_PROVINCIAL_PRICING.sql` | Original (had bug) | ⚠️ NOW FIXED |
| `/ADD_PROVINCE_TO_PRODUCTS.sql` | Old inefficient approach | ❌ DON'T USE |

---

## 💡 **Pro Tips**

1. **Always check base tables first** - Most errors come from missing suppliers/supplier_products tables
2. **Use the SIMPLE version** - It's tested and error-free
3. **Read the output** - Supabase shows helpful error messages
4. **Copy ENTIRE file** - Don't copy just part of the script
5. **Check verification queries** - They confirm everything worked

---

**You should now be error-free! 🎉**
