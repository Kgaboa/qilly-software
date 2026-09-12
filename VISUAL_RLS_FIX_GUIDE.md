# 🎯 VISUAL GUIDE: Fix RLS Error in 60 Seconds

## 🚨 The Error You're Seeing

```
Error upserting supplier: {
  "code": "42501",
  "message": "new row violates row-level security policy for table \"suppliers\""
}
```

---

## ✅ FASTEST FIX (Copy & Paste)

### **📍 Step 1: Open Supabase Dashboard**

```
🌐 Go to: https://supabase.com/dashboard
```

**What you'll see:**
```
┌─────────────────────────────────────────┐
│ Supabase Dashboard                      │
├─────────────────────────────────────────┤
│ Projects:                               │
│  • qilly-development  ← Click this      │
│  • qilly-production                     │
└─────────────────────────────────────────┘
```

**👉 Click your Development project**

---

### **📍 Step 2: Open SQL Editor**

**Left Sidebar:**
```
┌─────────────────┐
│ 🏠 Home         │
│ 🗄️  Table Editor│
│ 📝 SQL Editor   │ ← Click this
│ 🔐 Auth         │
│ 📊 Storage      │
└─────────────────┘
```

**👉 Click "SQL Editor"**

---

### **📍 Step 3: Create New Query**

**Top Right:**
```
┌────────────────────────────────┐
│ SQL Editor                     │
│                  [+ New query] │ ← Click this
└────────────────────────────────┘
```

**👉 Click "+ New query"**

---

### **📍 Step 4: Paste This SQL**

**Copy this EXACT code:**

```sql
-- SIMPLE FIX: Disable RLS for development
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_products DISABLE ROW LEVEL SECURITY;
```

**Paste into the SQL Editor:**
```
┌──────────────────────────────────────────────┐
│ Untitled query                    [Run] ← Click│
├──────────────────────────────────────────────┤
│ ALTER TABLE suppliers DISABLE ROW LEVEL...   │
│ ALTER TABLE supplier_products DISABLE...     │
│                                              │
│                                              │
└──────────────────────────────────────────────┘
```

**👉 Paste the SQL code**

---

### **📍 Step 5: Click RUN**

**Top Right Button:**
```
┌──────────────────────────────────────────────┐
│ Untitled query              [▶ Run] ← Click  │
└──────────────────────────────────────────────┘
```

**👉 Click "Run" or press `Ctrl+Enter` / `Cmd+Enter`**

---

### **📍 Step 6: Verify Success**

**Expected Result:**
```
┌──────────────────────────────────────────────┐
│ ✅ Success. No rows returned                 │
└──────────────────────────────────────────────┘
```

**If you see this → SUCCESS! ✅**

---

### **📍 Step 7: Test in Qilly**

1. **Go back to Qilly app**
2. **Navigate:** Admin Dashboard → Supplier API → Sync Products
3. **Click:** "Sync Now" for BUCO

**Expected Result:**
```
┌──────────────────────────────────────────────┐
│ BUCO                            [Sync Now]   │
│ Will scrape product catalog                  │
│ ✅ 5 products synced, 0 errors               │
└──────────────────────────────────────────────┘
```

**✅ No more RLS error!**

---

## 🎉 DONE!

**Total time:** ~60 seconds

**What you did:**
- Opened Supabase SQL Editor
- Disabled Row-Level Security on 2 tables
- Tested supplier sync

**Result:**
- ✅ RLS error is gone
- ✅ Supplier sync works
- ✅ Can insert/update supplier data

---

## 🔍 Alternative: Full SQL Script

If you haven't set up the database yet, run the complete setup:

### **Instead of Step 4, do this:**

1. **Open file:** `/SUPABASE_SETUP_FIXED.sql` (in your project)
2. **Copy:** Entire file contents (all 400+ lines)
3. **Paste:** Into Supabase SQL Editor
4. **Click:** Run
5. **Then run:** The RLS disable commands above

---

## 📊 Visual Verification

### **Check 1: RLS Status**

**Run this query in Supabase:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('suppliers', 'supplier_products');
```

**Expected result:**
```
┌──────────────────┬─────────────┐
│ tablename        │ rowsecurity │
├──────────────────┼─────────────┤
│ suppliers        │ f           │ ← 'f' means disabled ✅
│ supplier_products│ f           │ ← 'f' means disabled ✅
└──────────────────┴─────────────┘
```

**✅ Both should show 'f' (false = disabled)**

---

### **Check 2: Tables Exist**

**Navigate in Supabase:**
```
Supabase Dashboard → Table Editor (left sidebar)
```

**You should see:**
```
┌─────────────────────┐
│ Tables              │
├─────────────────────┤
│ ✅ bill_items       │
│ ✅ bills            │
│ ✅ supplier_products│ ← This one
│ ✅ suppliers        │ ← This one
│ ✅ subscriptions    │
│ ✅ users            │
└─────────────────────┘
```

---

### **Check 3: Sync Works**

**In Qilly app:**
```
Admin Dashboard → Supplier API → Sync Products

BUCO                          [Sync Now] ← Click
✅ 5 products synced, 0 errors           ← Success!

Builders Warehouse            [Sync Now] ← Click
✅ 4 products synced, 0 errors           ← Success!

PPC                           [Sync Now] ← Click
✅ 2 products synced, 0 errors           ← Success!
```

**✅ All should sync without errors**

---

### **Check 4: Data in Database**

**Supabase → Table Editor → suppliers:**
```
┌──────────┬──────────────────┬─────────┬───────────┐
│ name     │ category         │ active  │ last_sync │
├──────────┼──────────────────┼─────────┼───────────┤
│ BUCO     │ building_materials│ true   │ 21 Feb... │ ✅
│ Builders │ building_materials│ true   │ 21 Feb... │ ✅
│ PPC      │ concrete_aggregates│ true  │ 21 Feb... │ ✅
└──────────┴──────────────────┴─────────┴───────────┘
```

**Supabase → Table Editor → supplier_products:**
```
┌─────────────┬────────────────┬──────────┬───────┐
│ supplier_id │ description    │ unit_price│ unit │
├─────────────┼────────────────┼──────────┼───────┤
│ [BUCO-ID]   │ Cement 42.5N   │ 95.50    │ 50kg  │ ✅
│ [BUCO-ID]   │ Building Sand  │ 285.00   │ m3    │ ✅
│ [BUCO-ID]   │ Steel Bar Y12  │ 115.75   │ 6m    │ ✅
│ ...         │ ...            │ ...      │ ...   │
└─────────────┴────────────────┴──────────┴───────┘
```

**✅ Should see products for each supplier**

---

## 🎨 Visual Workflow

```
┌─────────────────────────────────────────────────┐
│ 1. Open Supabase Dashboard                     │
│    https://supabase.com/dashboard              │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 2. Select Development Project                  │
│    [qilly-development]                         │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 3. Click SQL Editor (left sidebar)             │
│    📝 SQL Editor                               │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 4. Click "+ New query"                         │
│    [+ New query]                               │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 5. Paste SQL:                                  │
│    ALTER TABLE suppliers DISABLE ROW LEVEL...  │
│    ALTER TABLE supplier_products DISABLE...    │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 6. Click "Run" button                          │
│    [▶ Run]                                     │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 7. See success message                         │
│    ✅ Success. No rows returned                │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 8. Test in Qilly                               │
│    Supplier API → Sync Now → ✅ Success!      │
└─────────────────────────────────────────────────┘
```

---

## 🚨 Troubleshooting

### **Error: "relation 'suppliers' does not exist"**

**Means:** Tables not created yet

**Fix:**
1. Copy entire `/SUPABASE_SETUP_FIXED.sql`
2. Paste into Supabase SQL Editor
3. Click Run
4. Then run the RLS disable commands

---

### **Error: "permission denied"**

**Means:** Wrong Supabase project or wrong account

**Fix:**
1. Make sure you're logged into correct Supabase account
2. Make sure you selected the Development project
3. Try refreshing Supabase dashboard

---

### **Success message but sync still fails**

**Means:** Browser cache issue

**Fix:**
1. Hard refresh Qilly app: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Try sync again

---

### **Want to re-enable RLS later?**

**For production, run:**
```sql
-- Re-enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;

-- Add proper policies (see /SUPABASE_RLS_FIX.sql for complete policies)
CREATE POLICY "..." ON suppliers FOR SELECT ...
CREATE POLICY "..." ON suppliers FOR INSERT ...
-- etc.
```

---

## ✅ Summary

**The Problem:**
- RLS blocks INSERT/UPDATE operations
- Default policies only allow SELECT (read)

**The Solution:**
- Disable RLS for development
- 2 simple SQL commands
- Takes 60 seconds

**The Result:**
- ✅ Supplier sync works
- ✅ No more RLS errors
- ✅ Can insert/update data

**Ready to build!** 🚀
