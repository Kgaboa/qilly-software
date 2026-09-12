# 🔄 SIT vs DEV: Environment Setup Comparison

## 📊 ENVIRONMENT OVERVIEW

| Environment | Project ID | URL | Status |
|-------------|------------|-----|--------|
| **Development** | zzdzrlglivtpawtitvgu | Local/Dev build | ✅ Working |
| **SIT** | kcptusoevqapcvptlgkd | https://qilly-sit.vercel.app | ❌ Needs setup |

---

## 🔍 CURRENT STATE

### Development Environment ✅
```
✅ Admin user exists
✅ Test contractors and suppliers
✅ RLS policies configured
✅ Authentication working
✅ Can view suppliers/contractors
```

### SIT Environment ❌
```
❌ HTTP 406 errors
❌ CORS blocking edge functions
❌ Missing RLS policies (likely)
❌ Missing test data (likely)
❌ User not in users table
```

---

## 🎯 WHAT NEEDS TO BE DONE

**The problem:** You set up DEV but never ran the same setup in SIT!

**The solution:** Run the same SQL scripts in SIT that you ran in DEV.

---

## 📋 SETUP COMPARISON

### What You Did in DEV (Working)

1. ✅ Created admin user in `auth.users`
2. ✅ Created admin user in `users` table with `role = 'admin'`
3. ✅ Created RLS policies for suppliers/contractors
4. ✅ Added test suppliers and contractors
5. ✅ Tested and verified login works

### What You Need to Do in SIT (To Do)

1. ❌ Create admin user in `auth.users` (SIT database)
2. ❌ Create admin user in `users` table with `role = 'admin'`
3. ❌ Create RLS policies for suppliers/contractors
4. ❌ Add test suppliers and contractors
5. ❌ Configure CORS for edge functions
6. ❌ Test and verify login works

**✨ Good news:** You can do all of this by running ONE SQL file!

---

## ⚡ QUICK FIX

### Step 1: Switch to SIT in Supabase

```
1. Go to https://app.supabase.com
2. Top left: Click project dropdown
3. Select: SIT (kcptusoevqapcvptlgkd)
4. Verify URL shows: kcptusoevqapcvptlgkd
```

### Step 2: Run Setup Script

```
1. Click: SQL Editor (left sidebar)
2. Click: New Query
3. Copy: ALL of /SETUP_ADMIN_USER_COMPLETE.sql
4. Paste into editor
5. Click: RUN
6. Wait for success messages
```

### Step 3: Configure CORS

```
1. Click: Edge Functions (left sidebar)
2. Find: server/make-server-9db710f3
3. Click: Settings
4. Add origin: https://qilly-sit.vercel.app
5. Click: Save
```

### Step 4: Test

```
1. Go to: https://qilly-sit.vercel.app
2. Press F12 (open console)
3. Login as admin
4. Verify: No 406 errors, no CORS errors
```

---

## 🔍 VERIFICATION QUERIES

### Check SIT Status Before Fix

```sql
-- Run in SIT Supabase SQL Editor

-- Check if admin exists
SELECT 
  'Admin User' as check,
  COUNT(*) FILTER (WHERE email = 'admin@qilly.co.za') as count
FROM auth.users;

-- Check if user in users table
SELECT 
  'Users Table' as check,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE role = 'admin') as admin_users
FROM users;

-- Check if test data exists
SELECT 
  'Test Data' as check,
  (SELECT COUNT(*) FROM suppliers) as suppliers,
  (SELECT COUNT(*) FROM contractors) as contractors;

-- Check RLS policies
SELECT 
  'RLS Policies' as check,
  COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN ('suppliers', 'contractors');
```

**Expected BEFORE fix:**
- Admin: 0 or exists but not in users table
- Users: 0 or missing admin
- Suppliers: 0
- Contractors: 0
- Policies: 0 or incomplete

**Expected AFTER fix:**
- Admin: 1 (in both auth.users and users)
- Users: At least 1 (admin)
- Suppliers: 5
- Contractors: 5
- Policies: 6+ (multiple per table)

---

## 🆚 SIDE-BY-SIDE COMPARISON

### Database Tables

| Table | DEV Status | SIT Status | Action Needed |
|-------|------------|------------|---------------|
| auth.users | ✅ Has admin | ❓ Check | Create admin |
| users | ✅ Has admin | ❌ Missing | Create admin record |
| suppliers | ✅ Has data | ❌ Empty | Add test data |
| contractors | ✅ Has data | ❌ Empty | Add test data |
| bills | ✅ Configured | ❓ Check | Verify |
| bill_items | ✅ Configured | ❓ Check | Verify |

### RLS Policies

| Policy Type | DEV Status | SIT Status | Action Needed |
|-------------|------------|------------|---------------|
| Supplier view (own) | ✅ Exists | ❌ Missing | Create |
| Supplier view (admin) | ✅ Exists | ❌ Missing | Create |
| Contractor view (own) | ✅ Exists | ❌ Missing | Create |
| Contractor view (admin) | ✅ Exists | ❌ Missing | Create |
| User policies | ✅ Exists | ❌ Missing | Create |

### Edge Functions

| Function | DEV Status | SIT Status | Action Needed |
|----------|------------|------------|---------------|
| Deployment | ✅ Deployed | ❓ Check | Deploy if missing |
| CORS config | ✅ Working | ❌ Blocked | Configure CORS |
| Reachable | ✅ Yes | ❌ No | Fix CORS |

---

## 📝 DETAILED ACTION PLAN

### Action 1: Setup Database (1 minute)

**File:** `/SETUP_ADMIN_USER_COMPLETE.sql`

**What it does:**
1. Creates admin user in auth.users (email + password)
2. Creates admin record in users table (role = 'admin')
3. Creates RLS policies for all tables
4. Adds 5 test suppliers (various provinces)
5. Adds 5 test contractors (various provinces)
6. Sets up proper access control

**Where to run:** SIT Supabase SQL Editor

---

### Action 2: Configure CORS (30 seconds)

**Method A: Via Dashboard**
1. Supabase → Edge Functions
2. Select function
3. Settings → CORS
4. Add: `https://qilly-sit.vercel.app`

**Method B: Update Function Code**
```typescript
// Add to edge function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Return in response
return new Response(data, { headers: corsHeaders });
```

---

### Action 3: Verify Deployment (30 seconds)

**Check if edge function is deployed:**
```bash
supabase functions list --project-ref kcptusoevqapcvptlgkd
```

**If missing, deploy:**
```bash
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd
```

---

## 🎯 COMMON MISTAKES TO AVOID

### ❌ Mistake 1: Running SQL in Wrong Environment
```
Wrong: Running in DEV when you need SIT
Right: Switch to SIT first, THEN run SQL
```

### ❌ Mistake 2: Forgetting CORS
```
Wrong: Setup database but forget edge function CORS
Right: Do BOTH - database setup AND CORS config
```

### ❌ Mistake 3: Not Verifying
```
Wrong: Run SQL and assume it worked
Right: Run verification queries to confirm
```

### ❌ Mistake 4: Mixed Environments
```
Wrong: Admin in DEV, trying to login in SIT
Right: Create admin separately in EACH environment
```

---

## 💡 UNDERSTANDING ENVIRONMENTS

### Why Separate Environments?

**Development:**
- For testing and development
- Can break things without consequences
- Test new features here first

**SIT (System Integration Testing):**
- For pre-production testing
- More stable than DEV
- Should mirror production setup
- Used for demos and stakeholder testing

**Production (Future):**
- Live system with real users
- Most secure and stable
- Never test here!

### Why They Need Separate Setup

Each environment has its own:
- Database (separate Supabase project)
- Users (separate auth tables)
- Data (separate records)
- Edge functions (separate deployments)

**You can't share data between environments!**

---

## 🚀 QUICK REFERENCE CARD

### SIT Setup Checklist

```
□ Switch to SIT in Supabase (kcptusoevqapcvptlgkd)
□ Run /SETUP_ADMIN_USER_COMPLETE.sql
□ Verify admin exists in users table
□ Verify test data (suppliers/contractors)
□ Configure edge function CORS
□ Deploy edge functions if missing
□ Test on https://qilly-sit.vercel.app
□ Verify no 406 errors
□ Verify no CORS errors
□ Login works successfully
```

### Time Estimates

| Task | Time |
|------|------|
| Switch to SIT | 10 seconds |
| Run SQL script | 1 minute |
| Configure CORS | 30 seconds |
| Test | 1 minute |
| **TOTAL** | **~3 minutes** |

---

## 🎉 AFTER SETUP

Once SIT is set up properly, you'll have:

### ✅ Working SIT Environment

```
✅ Admin login works
✅ Suppliers visible
✅ Contractors visible  
✅ No HTTP 406 errors
✅ No CORS errors
✅ Edge functions working
✅ Ready for demo!
```

### ✅ Both Environments Working

```
Development (zzdzrlglivtpawtitvgu)
  ✅ Admin: admin@qilly.co.za
  ✅ Test data: 5 suppliers, 5 contractors
  ✅ For development and testing

SIT (kcptusoevqapcvptlgkd)  
  ✅ Admin: admin@qilly.co.za
  ✅ Test data: 5 suppliers, 5 contractors
  ✅ For demos and integration testing
```

---

## 📞 HELP & RESOURCES

**Quick guides:**
- `/FIX_SIT_NOW.md` - Quick action guide
- `/FIX_SIT_ENVIRONMENT_ERRORS.md` - Detailed explanation
- `/FIX_HTTP_406_SIT.sql` - Fix 406 errors only

**Setup files:**
- `/SETUP_ADMIN_USER_COMPLETE.sql` - Complete setup

**Verification:**
- `/DO_THIS_RIGHT_NOW.md` - Immediate action

---

**Bottom line:** Run the same setup in SIT that you ran in DEV! 🚀
