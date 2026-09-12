# 🔧 FIX SIT DATABASE SCHEMA - Quick Guide

**Date:** February 27, 2026  
**Status:** 🟡 ACTION REQUIRED

---

## ✅ **Good News First!**

The environment fix worked! Your SIT deployment is now correctly calling the SIT database:

```
✅ Before: https://qilly-sit.vercel.app → zzdzrlglivtpawtitvgu (Development DB) ❌
✅ After:  https://qilly-sit.vercel.app → kcptusoevqapcvptlgkd (SIT DB) ✅
```

---

## ❌ **But 2 Database Issues Found**

### **Error 1: Missing Column**
```
Could not find the 'project_settings' column of 'bills' in the schema cache
```

### **Error 2: Users Table Issue**
```
GET .../users?select=id&id=eq.c36eb0dd... 406 (Not Acceptable)
```

---

## 🚀 **How to Fix (5 Minutes)**

### **Step 1: Open SIT Supabase Dashboard**

1. Go to: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd
2. Click **"SQL Editor"** in left sidebar
3. Click **"New query"**

### **Step 2: Copy & Run SQL Script**

1. Open the file: `/SIT_DATABASE_SCHEMA_FIX.sql` (created in this repo)
2. Copy ALL the SQL code
3. Paste into Supabase SQL Editor
4. Click **"Run"** (or press Ctrl+Enter)

### **Step 3: Verify Success**

You should see at bottom:
```
✅ SIT Database schema updated successfully!
```

### **Step 4: Test BOQ Upload Again**

1. Go back to https://qilly-sit.vercel.app
2. Upload a BOQ
3. Check console logs - should show:
   ```
   ✅ Bill saved to Supabase successfully!
   ```

---

## 📋 **What the SQL Script Does**

1. ✅ Adds `project_settings` column to `bills` table
2. ✅ Creates `users` table if missing
3. ✅ Fixes RLS policies for `users`, `bills`, and `bill_items`
4. ✅ Creates performance indexes
5. ✅ Verifies all tables exist

---

## 🔍 **Expected Console Logs After Fix**

### **Before (❌ Error):**
```
❌ Error saving bill to Supabase: "Could not find the 'project_settings' column..."
GET .../users... 406 (Not Acceptable)
```

### **After (✅ Success):**
```
✅ Bill saved to Supabase successfully!
💾 Bill ID: bill_abc123
📊 19 items saved
```

---

## ⚠️ **Bonus Issue Found: Infinite Render Loop**

Your `RegionalPricedBillView` component is re-rendering 40+ times:

```
🕐 RegionalPricedBillView received processingTime: 1302.59... (repeated 40+ times)
💰 BOQ Totals Calculation... (repeated 40+ times)
```

This is a React performance issue - would you like me to fix this too?

---

## 📞 **Need Help?**

If you get any errors when running the SQL:
1. Copy the full error message
2. Share it with me
3. I'll create a custom fix

---

## ✅ **Checklist**

- [ ] Open SIT Supabase SQL Editor
- [ ] Copy SQL from `/SIT_DATABASE_SCHEMA_FIX.sql`
- [ ] Run the SQL script
- [ ] Verify success message
- [ ] Test BOQ upload again
- [ ] Check console logs for "✅ Bill saved"

---

**Ready to run the fix?** Just follow Step 1 above! 🚀
