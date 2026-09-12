# ⚡ Quick Database Setup - 5 Minute Guide

## 🎯 Problem
You're seeing: **"You do not have access to this project"**

## 💡 Solution
The project ID in your code is a demo placeholder. You need YOUR OWN Supabase project.

---

## 🚀 5-Minute Setup

### **Step 1: Create Supabase Account** (1 min)
```
1. Go to: https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub/Google/Email
```

### **Step 2: Create Project** (2 min)
```
1. Click "New Project"
2. Name: "Qilly"
3. Password: [SAVE THIS PASSWORD!]
4. Region: South Africa or Europe
5. Click "Create new project"
6. Wait 2-3 minutes ⏳
```

### **Step 3: Get Credentials** (1 min)
```
1. Click Settings (⚙️) → API
2. Copy:
   - Project URL: https://xxxxx.supabase.co
   - Project ID: xxxxx (the part before .supabase.co)
   - anon public key: eyJhbGc...
```

### **Step 4: Update Qilly** (30 sec)
```
Open: /src/utils/supabase/info.ts

Replace:
export const projectId = "tjajhzepupsmunewfvag";
export const publicAnonKey = "eyJhbGciOiJ...old...";

With YOUR credentials:
export const projectId = "YOUR_PROJECT_ID";
export const publicAnonKey = "YOUR_ANON_KEY";
```

### **Step 5: Create Tables** (30 sec)
```
1. In Supabase: SQL Editor → New Query
2. Copy ALL contents from: /SUPABASE_SETUP_COMPLETE.sql
3. Paste and click "Run"
4. Wait for "Success" ✅
```

---

## ✅ Done!

Your Qilly database is ready! 

**Test it:**
1. Login to Admin Dashboard
2. Click "Database Inspector" tab
3. You should see: "✅ Connected to Database"

---

## 📁 Files You Need

1. **Setup Script**: `/SUPABASE_SETUP_COMPLETE.sql` - Run this in Supabase SQL Editor
2. **Detailed Guide**: `/SETUP_YOUR_SUPABASE.md` - Full step-by-step instructions
3. **Update This File**: `/src/utils/supabase/info.ts` - Add your credentials here

---

## 🔗 Your Dashboard URL

After setup, bookmark this URL (replace with YOUR project ID):
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID
```

---

## 🆘 Still Having Issues?

**Common Issues:**

1. **"You do not have access"**
   - Make sure you updated `/src/utils/supabase/info.ts` with YOUR credentials
   - Not the demo ones!

2. **"Demo Mode - Not Connected"**
   - Restart your dev server after updating credentials
   - Check credentials are correct

3. **"Table does not exist"**
   - Run `/SUPABASE_SETUP_COMPLETE.sql` in Supabase SQL Editor
   - Verify tables appear in Table Editor

---

## 🎓 What You're Setting Up

**5 Database Tables:**
- `users` - User accounts
- `bills` - Bill of Quantities
- `bill_items` - BOQ line items
- `suppliers` - Supplier directory
- `supplier_products` - Product catalog

**Security:**
- Row Level Security (RLS) enabled
- Users can only see their own data
- Full encryption at rest

**Features:**
- Database Inspector in Admin Dashboard
- Direct Supabase access
- SQL query editor
- Visual schema browser

---

Need more details? See: `/SETUP_YOUR_SUPABASE.md`
