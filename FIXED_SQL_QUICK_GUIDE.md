# 🔧 Fixed SQL Script - Quick Guide

**Issue:** Type mismatch error with original SQL script  
**Solution:** Use the updated script that checks existing schema first

---

## ⚠️ **What Went Wrong**

**Error:**
```
foreign key constraint "products_supplier_id_fkey" cannot be implemented
Key columns "supplier_id" and "id" are of incompatible types: text and uuid
```

**Cause:**  
The SIT database already has tables with different types than the script expected.

**Fix:**  
Use `/SIT_DATABASE_SCHEMA_FIX_V2.sql` instead - it checks existing schema first!

---

## ✅ **How to Fix (5 Minutes)**

### **Step 1: Open SIT Supabase**
🔗 https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd

### **Step 2: Go to SQL Editor**
Click "SQL Editor" → "New query"

### **Step 3: Copy NEW Script**
Open **`/SIT_DATABASE_SCHEMA_FIX_V2.sql`** (the V2 version!)

### **Step 4: Paste & Run**
Paste the SQL → Click "Run" (or Ctrl+Enter)

### **Step 5: Check Results**
You should see multiple result sets showing:
```
✅ Added project_settings column to bills table
📋 Bills Table Columns
👥 Users Table (user_count: 0 or more)
🔒 RLS Status (all Enabled)
🔐 RLS Policies (showing all policies)
✅ SIT Database schema updated successfully!
```

### **Step 6: Test**
Upload a BOQ at https://qilly-sit.vercel.app

---

## ✅ **What V2 Script Does Differently**

1. **Checks if project_settings exists** before adding it
2. **Skips suppliers/products tables** (they already exist)
3. **Only updates RLS policies** for users, bills, bill_items
4. **Shows verification results** to confirm success

---

## 🎯 **Expected Console Logs After Fix**

When you upload a BOQ, you should see:

```bash
# Environment Detection
🌍 Using environment from VITE_ENVIRONMENT: SIT

# BOQ Processing  
✅ Regional Pricing Complete: 19 items priced

# Database Save (this was failing before)
💾 Saving bill to Supabase with project settings...
✅ Bill saved to Supabase successfully!

# Totals (appears ONCE, not 40+ times)
💰 BOQ Totals Calculation:
  Total on Delivery: R 3,012,127.63
  ✅ Difference: 0.00
```

---

## 🆘 **If You Still Get Errors**

### **Error: "column already exists"**
**Solution:** This is OK! The script checks and skips if column exists.

### **Error: "table does not exist"**
**Solution:** Share which table is missing, I'll create a custom fix.

### **Error: "permission denied"**
**Solution:** You might not be the owner. Check project ownership in Supabase.

---

## 📋 **Quick Checklist**

- [ ] Use **V2 script** (not the original)
- [ ] Copy entire script (scroll to end!)
- [ ] Run in SIT project (kcptusoevqapcvptlgkd)
- [ ] Check verification results
- [ ] Test BOQ upload
- [ ] Verify no console errors

---

## 📄 **Files to Use**

| File | Use This? |
|------|-----------|
| `/SIT_DATABASE_SCHEMA_FIX.sql` | ❌ DO NOT USE (has type error) |
| `/SIT_DATABASE_SCHEMA_FIX_V2.sql` | ✅ USE THIS ONE! |

---

**Ready?** Start at Step 1 above! ⬆️

---

## 💡 **Why This Happened**

Your SIT database already had tables created (probably from a previous setup), but with different column types than the script expected. The V2 script now works with your existing schema instead of trying to recreate it.

---

**Status:** Ready to run! Use V2 script 🚀
