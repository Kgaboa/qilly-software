# 🚀 SIT Direct Database Setup Guide

## Overview

**Goal:** Set up SIT to work exactly like DEV using direct Supabase client access (NO edge functions needed!)

**Architecture:**
```
Frontend (SIT) → Supabase Client → SIT Database Tables
```

---

## ✅ Step-by-Step Setup (10 minutes)

### **Step 1: Run Database Setup SQL**

1. Go to SIT Supabase SQL Editor:
   https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/sql

2. Copy contents of `/SETUP_SIT_DATABASE_DIRECT_ACCESS.sql`

3. Paste into SQL Editor

4. Click **"Run"**

5. ✅ Verify output shows all tables created

---

### **Step 2: Disable Email Confirmations (For Testing)**

1. Go to SIT Supabase Authentication Settings:
   https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/auth/users

2. Click **"Configuration"** → **"Email"**

3. **Disable "Enable email confirmations"**

4. Click **"Save"**

---

### **Step 3: Create Admin User**

**Option A - Via Supabase Dashboard (Easiest):**

1. Go to: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/auth/users

2. Click **"Add user"** → **"Create new user"**

3. Fill in:
   - Email: `admin@qilly.co.za`
   - Password: `QillyAdmin2026!`
   - Auto Confirm User: ✅ **YES**

4. Click **"Create user"**

5. Copy the user's UUID

6. Run this SQL to set admin role:
```sql
-- Replace USER_UUID with the actual UUID from step 5
INSERT INTO public.users (id, email, name, role, subscription_tier)
VALUES ('USER_UUID', 'admin@qilly.co.za', 'Qilly Admin', 'admin', 'enterprise')
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', subscription_tier = 'enterprise';
```

**Option B - Via Signup Flow:**

1. Go to: https://qilly-sit.vercel.app
2. Click "Sign Up"
3. Use: `admin@qilly.co.za` / `QillyAdmin2026!`
4. Run the SQL above to upgrade to admin

---

### **Step 4: Create Test Contractor User**

1. Go to: https://qilly-sit.vercel.app

2. Sign up with:
   - Email: `contractor@test.com`
   - Password: `Test123!`
   - Name: `Test Contractor`

3. Fill in contractor profile

4. Login as admin and approve the contractor

---

### **Step 5: Verify Setup**

Run this verification SQL:

```sql
-- Check all tables exist and RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'contractors', 'suppliers', 'products', 'bills')
ORDER BY tablename;

-- Check users exist
SELECT id, email, role, subscription_tier FROM public.users;

-- Check suppliers exist
SELECT id, company_name, approved FROM public.suppliers;

-- Check products exist
SELECT id, name, category, base_price FROM public.products;
```

---

## 🧪 Test the Setup

### **Test 1: Login**

1. Go to: https://qilly-sit.vercel.app
2. Login with: `admin@qilly.co.za` / `QillyAdmin2026!`
3. ✅ Should see dashboard

### **Test 2: BOQ Upload**

1. Upload a sample BOQ
2. ✅ Should process with mock data (demo mode)
3. ✅ No 401 errors
4. ✅ No CORS errors

### **Test 3: Contractor Signup**

1. Logout
2. Sign up as new contractor
3. Fill in profile
4. ✅ Should save to database

### **Test 4: Admin Approval**

1. Login as admin
2. Go to Admin Dashboard
3. ✅ Should see pending contractors
4. Approve contractor
5. ✅ Status should update

---

## 📊 What's Different from Edge Functions?

| Feature | Direct Database (SIT) | Edge Functions |
|---------|----------------------|----------------|
| **BOQ Processing** | Client-side pricing engine with mock suppliers | Server-side with real supplier APIs |
| **User Auth** | Supabase Auth (same) | Supabase Auth (same) |
| **Data Storage** | PostgreSQL tables | KV store + PostgreSQL |
| **Performance** | ✅ Fast (no cold starts) | ⚠️ Slower (cold starts) |
| **Complexity** | ✅ Simple | ⚠️ Complex |
| **Debugging** | ✅ Easy (direct SQL) | ⚠️ Hard (function logs) |
| **Cost** | ✅ Lower | ⚠️ Higher (function invocations) |

---

## 🔧 How It Works

### **DEV Mode (What you've been using):**
```typescript
// Frontend calls mock pricing engine
import { priceBill } from './pricingEngine';

const result = priceBill(billData, projectSettings);
// Uses hardcoded supplier prices
// No database queries needed for pricing
```

### **SIT Mode (Same as DEV):**
```typescript
// Exact same code!
import { priceBill } from './pricingEngine';

const result = priceBill(billData, projectSettings);
// Uses hardcoded supplier prices
// Database used ONLY for:
// - User authentication
// - Saving contractor profiles
// - Saving bills history
// - Storing suppliers (for future real pricing)
```

---

## 🎯 When to Use Real Supplier Pricing?

For your **Monday investor demo**, you have two options:

### **Option 1: Keep Mock Pricing (Recommended for Demo)**
- ✅ Instant results
- ✅ Predictable demo
- ✅ No supplier API dependencies
- ✅ Works offline

### **Option 2: Use Real Suppliers (For Production)**
- Add real suppliers to `public.suppliers` table
- Add real products to `public.products` table
- Update pricing engine to query database
- No edge functions needed!

---

## 🚨 Troubleshooting

### **Issue: Blank Page**
**Cause:** Database tables don't exist  
**Fix:** Run `/SETUP_SIT_DATABASE_DIRECT_ACCESS.sql`

### **Issue: 401 Unauthorized**
**Cause:** RLS policies blocking access  
**Fix:** Check user exists in `public.users` table with correct role

### **Issue: Can't login**
**Cause:** Email confirmations enabled  
**Fix:** Disable in Auth settings

### **Issue: No suppliers shown**
**Cause:** No approved suppliers in database  
**Fix:** Run demo data insertion or create suppliers manually

---

## ✅ Success Checklist

- [ ] SIT database tables created
- [ ] RLS policies enabled
- [ ] Email confirmations disabled
- [ ] Admin user created (`admin@qilly.co.za`)
- [ ] Test contractor created
- [ ] Demo supplier data inserted
- [ ] Can login to SIT
- [ ] Can upload BOQ
- [ ] Can view processed bill
- [ ] No console errors

---

## 🎉 You're Ready!

Once all checkboxes are ticked:
- ✅ SIT works exactly like DEV
- ✅ No edge functions needed
- ✅ Direct database access
- ✅ Fast and simple
- ✅ Ready for Monday demo

---

## 📝 Next Steps After Monday

1. **Add Real Suppliers:**
   - Manual entry via Admin Dashboard
   - CSV import
   - API integration

2. **Connect Real Pricing:**
   - Query `public.products` table
   - Apply provincial factors
   - Use CIDB grades

3. **Add Payment Gateway:**
   - PayFast integration
   - Subscription management
   - Invoice generation

4. **Deploy to Production:**
   - Same architecture
   - Just change environment flag
   - Point to production database

---

**Remember:** The beauty of this approach is it's the same proven architecture you've been using in DEV. No surprises! 🚀
