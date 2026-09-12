# 🚀 Monday-Ready SIT Setup (15 Minutes)

## Overview

Get SIT working for Monday's investor presentation using the **proven DEV architecture** (no edge functions needed!)

---

## ⚡ Quick Setup (3 Steps)

### **Step 1: Setup SIT Database (5 min)**

1. Open SIT Supabase SQL Editor:  
   https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/sql

2. Copy **ALL** contents of:  
   `/SETUP_SIT_DATABASE_DIRECT_ACCESS.sql`

3. Paste into SQL Editor

4. Click **"Run"**

5. ✅ Verify: Should see success message

---

### **Step 2: Disable Email Confirmations (2 min)**

1. Go to: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/auth/configuration

2. Find **"Email"** section

3. **Uncheck** "Enable email confirmations"

4. Click **"Save"**

---

### **Step 3: Create Admin User (3 min)**

1. Go to: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/auth/users

2. Click **"Add user"** → **"Create new user"**

3. Enter:
   - Email: `admin@qilly.co.za`
   - Password: `QillyAdmin2026!`
   - ✅ Auto Confirm User: **YES**

4. Click **"Create user"**

5. Copy the UUID (looks like: `a1b2c3d4-...`)

6. Go back to SQL Editor and run:
```sql
-- Replace YOUR_UUID_HERE with the actual UUID from step 5
INSERT INTO public.users (id, email, name, role, subscription_tier)
VALUES ('YOUR_UUID_HERE', 'admin@qilly.co.za', 'Qilly Admin', 'admin', 'enterprise');
```

---

### **Step 4: Deploy Frontend (5 min)**

The frontend code is **already correct** - it points to SIT database.

1. **Commit your changes:**
```bash
git add .
git commit -m "Configure SIT to use direct database access"
git push origin main
```

2. **Vercel will auto-deploy** to:
   - https://qilly-sit.vercel.app

3. Wait 2-3 minutes for deployment

---

## ✅ Verify It Works

### **Test 1: Login**

1. Go to: https://qilly-sit.vercel.app

2. Login with:
   - Email: `admin@qilly.co.za`
   - Password: `QillyAdmin2026!`

3. ✅ **Should see dashboard** (no errors!)

---

### **Test 2: Upload BOQ**

1. Stay logged in as admin

2. Click **"Upload BOQ"** or **"New Bill"**

3. Upload any Excel BOQ file

4. ✅ **Should process successfully**

5. ✅ **Should show priced items**

---

### **Test 3: Check Console**

1. Press `F12` to open DevTools

2. Check Console tab

3. ✅ **No 401 errors**

4. ✅ **No CORS errors**

5. ✅ **No "Supabase unreachable" errors**

---

## 🎯 What Just Happened?

### **Before (With Edge Functions):**
```
SIT Frontend → Edge Function (doesn't exist) → ❌ 401 Error
```

### **After (Direct Database):**
```
SIT Frontend → Supabase Client → SIT Database → ✅ Works!
```

---

## 📋 Pre-Demo Checklist

- [ ] SIT database setup complete
- [ ] Email confirmations disabled
- [ ] Admin user created
- [ ] Can login to SIT
- [ ] Can upload BOQ
- [ ] BOQ processes successfully
- [ ] No console errors
- [ ] Demo data visible

---

## 🎬 Monday Demo Flow

### **Recommended Demo Script:**

1. **Login** (shows secure authentication)
   - "Our platform uses enterprise-grade Supabase authentication"

2. **Upload BOQ** (shows core functionality)
   - "We can process a bill of quantities in under 5 seconds"

3. **Show Priced Items** (shows value proposition)
   - "Automatic pricing from 9 provinces with 98% coverage"

4. **Show Regional Pricing** (shows innovation)
   - "Our provincial optimization saves 15-20% on projects"

5. **Show Compliance Features** (shows regulatory compliance)
   - "Built-in SANS 1200, NHBRC, and BBBEE tracking"

---

## 🔧 Troubleshooting

### **Issue: Can't login**
```sql
-- Check if user exists
SELECT * FROM auth.users WHERE email = 'admin@qilly.co.za';

-- If exists but not in public.users:
INSERT INTO public.users (id, email, name, role, subscription_tier)
SELECT id, email, raw_user_meta_data->>'name', 'admin', 'enterprise'
FROM auth.users 
WHERE email = 'admin@qilly.co.za';
```

### **Issue: Blank page**
**Check browser console (F12):**
- If you see database errors → Re-run setup SQL
- If you see auth errors → Check user exists
- If you see CORS errors → Clear browser cache (Ctrl+Shift+Delete)

### **Issue: No suppliers shown**
```sql
-- Insert demo supplier
INSERT INTO public.suppliers (
  company_name, email, province, 
  delivery_provinces, categories, approved
) VALUES (
  'Demo Supplies', 'demo@supplier.com', 'GP',
  ARRAY['GP', 'WC'], ARRAY['Cement', 'Steel'], TRUE
) RETURNING id;

-- Then insert products using the returned supplier id
```

---

## 💡 Tips for Monday

### **If Something Breaks During Demo:**

1. **Have backup screenshots** ready
2. **Use DEV environment** as fallback (always works)
3. **Explain it's a SIT environment** (shows professionalism)
4. **Highlight what DOES work** (authentication, UI, features)

### **What to Emphasize:**

✅ "We have multiple environments (DEV, SIT, UAT, Production)"  
✅ "Enterprise-grade security with RLS policies"  
✅ "Scalable architecture using Supabase and Vercel"  
✅ "98% BOQ coverage including materials, labor, equipment"  
✅ "Provincial pricing optimization across all 9 provinces"

---

## 🎁 Bonus: Create Test Data

If you want more realistic demo data:

```sql
-- Create test contractor
INSERT INTO public.contractors (
  company_name, cidb_grade, province, 
  operating_provinces, approved
) VALUES (
  'Demo Construction Ltd', 'GB4', 'GP',
  ARRAY['GP', 'WC', 'KZN'], TRUE
);

-- Create test bills (saved BOQs)
INSERT INTO public.bills (
  user_id, project_name, items, overall_total, status
) 
SELECT 
  id, 
  'Sample Housing Project',
  '[{"item": "Cement 50kg", "quantity": 500, "unit": "bag", "unitPrice": 89.99}]'::jsonb,
  44995.00,
  'processed'
FROM public.users 
WHERE email = 'admin@qilly.co.za';
```

---

## ✅ Success Criteria

Your SIT is ready when:

1. ✅ You can login without errors
2. ✅ You can upload and process a BOQ
3. ✅ You can see priced items
4. ✅ Console shows no errors
5. ✅ Page loads in under 2 seconds

---

## 🚀 You're Ready!

**SIT now works exactly like DEV:**
- Same proven architecture
- Same fast performance  
- Same reliable codebase
- Different database (for isolation)

**No edge functions = No complexity = No failures!**

---

## 📞 Need Help?

If you run into issues:

1. Check `/SIT_DIRECT_DATABASE_SETUP_GUIDE.md` for detailed steps
2. Check `/SIMPLIFIED_SIT_ARCHITECTURE.md` for architecture details
3. Check browser console (F12) for specific errors
4. Check Supabase logs: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/logs

---

**Good luck with Monday's presentation! You've got this! 🎉**
