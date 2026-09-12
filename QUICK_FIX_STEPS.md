# 🚀 QUICK FIX - Admin Can't See Suppliers/Contractors

## Problem
✅ App connected to `zzdzrlglivtpawtitvgu`  
❌ Admin sees **0 suppliers** and **0 contractors**

## Cause
The `users` table is missing the `role` column, preventing admin access via RLS policies.

## Good News! 
You already have 17 users in the database:
- ✅ `admin@qilly.co.za` exists
- ✅ 4 suppliers (with `user_type: supplier` in metadata)
- ✅ 10 contractors (with `user_type: contractor` in metadata)
- ✅ 1 regular user

## 2-Step Fix (3 minutes)

### 1️⃣ Open Supabase SQL Editor
- Go to: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new

### 2️⃣ Run Setup Script
- Open `/COMPLETE_FIX_WITH_EXISTING_USERS.sql` from this project
- Copy **ALL** the SQL code (entire file)
- Paste into Supabase SQL Editor
- Click **Run** (F5 or green play button)

### 3️⃣ Verify Success
You should see verification output showing:
```
✅ Users by Role:
   admin: 1 (admin@qilly.co.za)
   supplier: 4 
   contractor: 10
   user: 1

✅ Suppliers: 5+ total (4 approved, 1 pending)
✅ Contractors: 5+ total (4 approved, 1 pending)
✅ RLS Policies: Created for all tables
✅ Sample data displayed
```

### 4️⃣ Test in Figma Make
- Refresh your Figma Make preview
- Login with: `admin@qilly.co.za` / `QillyAdmin2026!`
- Console should show:
  ```
  ✅ Loaded suppliers from Supabase: 5
  ✅ Loaded contractors from Supabase: 5
  ```

## What the Script Does

### Part 1: Maps Your Existing 17 Users
- Reads `user_type` from `raw_user_meta_data`
- Creates `users` table with `role` column
- Maps:
  - `admin@qilly.co.za` → role: `admin`
  - `user_type: supplier` → role: `supplier`
  - `user_type: contractor` → role: `contractor`
  - Everyone else → role: `user`

### Part 2: Creates Tables
- `suppliers` table with South African fields (CIPC, VAT, BEE, provinces)
- `contractors` table with NHBRC numbers
- Both with RLS enabled

### Part 3: Sets Up RLS Policies
- Admin can view/edit ALL suppliers and contractors
- Suppliers can only view/edit their own data
- Contractors can only view/edit their own data

### Part 4: Adds Realistic Test Data
5 suppliers with:
- BuildMart Suppliers (Pty) Ltd - GP/WC/KZN - Level 2 BEE
- Cape Concrete & Aggregates CC - WC/NC - Level 3 BEE
- Durban Steel Supplies - KZN - Level 4 BEE (Pending)
- Joburg Building Materials - GP/NW/MP - Level 1 BEE
- Free State Cement & Sand - FS/NC - Level 2 BEE

5 contractors with:
- ABC Construction (Pty) Ltd - GP/WC - Level 1 BEE - NHBRC123456
- Eastern Cape Builders CC - EC/KZN - Level 2 BEE - NHBRC789012
- Northern Projects - LP/MP - Level 3 BEE (Pending) - NHBRC345678
- Gauteng Housing Solutions - GP - Level 1 BEE - NHBRC901234
- Western Cape Contractors CC - WC/NC - Level 4 BEE - NHBRC012345

## Existing Users That Will Be Mapped

From your `/src/imports/user-data.json`:

### Admin (1)
- **admin@qilly.co.za** → `role: admin`

### Suppliers (4)
- supplier@gmail.com → `role: supplier`
- newsupplier@gmail.com → `role: supplier`
- newsupplier2@gmail.com → `role: supplier`
- newsupplier3@gmail.com → `role: supplier`

### Contractors (10)
- kgabo3@gmail.com → `role: contractor`
- kgabo@qilly.com → `role: contractor`
- ceekwy@gmail.com → `role: contractor`
- marco@gmail.com → `role: contractor`
- sekgwari@qilly.co.za → `role: contractor`
- professional@gmail.com → `role: contractor`
- kgabo@gmail.com → `role: contractor`
- kgabonew@gmail.com → `role: contractor`
- thabo@gmail.com → `role: contractor`
- kgaboa@gmail.com → `role: contractor`

### Regular Users (1)
- test123@gmail.com → `role: user` (no user_type in metadata)

## Troubleshooting

### Error: "duplicate key value violates unique constraint"
✅ **This is fine!** The script uses `ON CONFLICT` to handle existing data. The important tables are already created.

### Still seeing 0 results?
1. **Clear browser cache:**
```javascript
// Run in browser console (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

2. **Verify admin role:**
```sql
-- Run in Supabase SQL Editor
SELECT email, role FROM users WHERE email = 'admin@qilly.co.za';
-- Should return: admin@qilly.co.za | admin
```

3. **Verify data exists:**
```sql
SELECT COUNT(*) FROM suppliers;
SELECT COUNT(*) FROM contractors;
-- Should return 5+ for each
```

### Error: "relation 'users' does not exist"
The script creates it - just run the entire script.

### Want to reset everything?
```sql
-- WARNING: This deletes all data!
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS contractors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Then run /COMPLETE_FIX_WITH_EXISTING_USERS.sql again
```

## For Monday's Investor Demo

Once this is working, you'll have:
- ✅ 17 mapped users with correct roles
- ✅ 5 test suppliers across all major provinces
- ✅ 5 test contractors with NHBRC numbers
- ✅ Admin dashboard fully functional
- ✅ Realistic South African company data

Need more realistic mock data for the presentation? Let me know! 🎯
