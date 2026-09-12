# ⚠️ URGENT: Fix Supplier API Database Error

## Problem
You're seeing this error in the Supplier API tab:
```
Error: Could not find the table 'public.suppliers' in the schema cache (PGRST205)
```

This means the `suppliers` and `supplier_products` tables haven't been created in your Supabase database yet.

---

## ✅ Quick Fix (2 Minutes)

### Step 1: Open Supabase SQL Editor
Click this link to open your Supabase SQL Editor:
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
```
(Replace YOUR_PROJECT_ID with your actual project ID from localStorage)

### Step 2: Copy the FIXED SQL Script
Open this file in your project:
```
/SUPABASE_SETUP_FIXED.sql
```

**Important:** Use the `FIXED` version, NOT the original `SUPABASE_SETUP_COMPLETE.sql`!

The FIXED version:
- ✅ Handles existing tables safely (uses `CREATE TABLE IF NOT EXISTS`)
- ✅ Won't cause "relation already exists" errors
- ✅ Can be run multiple times without breaking anything

### Step 3: Run the Script
1. Copy the **entire contents** of `/SUPABASE_SETUP_FIXED.sql`
2. Paste into the Supabase SQL Editor
3. Click the **"Run"** button
4. You should see: **"Success. No rows returned"**

### Step 4: Verify in Qilly
1. Return to the Qilly Admin Dashboard
2. Go to the **"Supplier API"** tab
3. Click **"Try Again"** on the error message
4. The error should be gone! ✅

---

## 📋 What Gets Created

Running the script creates these database tables:

| Table Name | Purpose | Records |
|------------|---------|---------|
| `users` | User accounts and profiles | Skipped (already exists) |
| `bills` | BOQ projects and bills | Skipped if exists |
| `bill_items` | Line items in bills | Skipped if exists |
| **`suppliers`** ⭐ | **Supplier directory** | **6 SA suppliers** |
| **`supplier_products`** ⭐ | **Product catalog for pricing** | **Empty (ready for sync)** |
| `subscriptions` | Payment tracking | Skipped if exists |

Plus:
- ✅ Row-level security (RLS) policies
- ✅ Database indexes for performance
- ✅ Helper functions for trial management

---

## 🌍 Sample Suppliers Added

The script automatically adds these 6 South African suppliers:

1. **Buco** - Building materials
2. **Builders Warehouse** - Building materials
3. **Macsteel** - Steel and metal products
4. **Lafarge** - Concrete and aggregates
5. **PPC** - Cement and concrete products
6. **Raumix** - Concrete and aggregates

---

## 🔧 After Setup: Test the System

### 1. Verify Tables Exist
Go to Admin Dashboard → **Database** tab → Click **"Check Setup Status"**

You should see:
```
✅ 6/6 tables created successfully
```

### 2. Test Supplier Sync
Go to Admin Dashboard → **Supplier API** tab → **Sync Products** tab

Click **"Sync Now"** on any supplier to populate sample product data.

### 3. Test Price Optimization
Go to Admin Dashboard → **Supplier API** tab → **Test Pricing** tab

Try searching for:
- Product: "Cement 42.5N"
- Unit: "50kg bag"
- Quantity: 100
- Province: Gauteng

Click **"Find Best Prices"** to see price comparison across suppliers.

---

## ❓ Troubleshooting

### Error: "relation 'users' already exists"
**Solution:** Use `/SUPABASE_SETUP_FIXED.sql` instead of the original script. The FIXED version handles existing tables safely.

### Error: "permission denied for schema public"
**Solution:** Make sure you're logged into the correct Supabase project. Check that your Supabase connection credentials are correct in the Admin Dashboard → Database tab.

### Error: "table still not found after running script"
**Solution:** 
1. Refresh your Supabase dashboard
2. Go to Supabase → Table Editor → verify `suppliers` table exists
3. In Qilly, click "Try Again" on the error message
4. If still failing, check Supabase logs for errors

### Script runs but suppliers tab still shows error
**Solution:**
1. Check Supabase → Table Editor → verify `suppliers` table has 6 rows
2. Check RLS policies are enabled: Supabase → Authentication → Policies
3. Try clicking "Try Again" in the Supplier API tab
4. Check browser console for detailed error messages

---

## 🚀 Next Steps After Fix

Once the database is set up:

1. **Sync Sample Product Data**
   - Go to Supplier API → Sync Products
   - Sync at least one supplier (e.g., Buco or PPC)

2. **Test Payment Gateways**
   - Go to Pay Gateway tab
   - Test the 5 SA payment providers

3. **Create a Test BOQ**
   - Go to main Qilly app
   - Create a new bill
   - Add items and see supplier pricing in action

4. **Configure for Production**
   - Replace sample data with real supplier API credentials
   - Set up actual payment gateway accounts
   - Configure SANS 1200 compliance rules

---

## 📞 Still Having Issues?

If you're still experiencing problems after following these steps:

1. Check the browser console (F12) for detailed error messages
2. Check Supabase logs: Supabase Dashboard → Logs → Database
3. Verify your Supabase project is in the Development environment
4. Make sure your Supabase API keys are correctly configured

The error messages in the console will help identify exactly what's wrong.
