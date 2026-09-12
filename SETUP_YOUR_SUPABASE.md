# 🚀 Setup Your Own Supabase Database for Qilly

## ❌ Current Issue
You're seeing "You do not have access to this project" because the project ID `tjajhzepupsmunewfvag` in your code is a **demo placeholder**, not a real Supabase project you own.

## ✅ Solution: Create Your Own Supabase Project

Follow these steps to set up your own Qilly database:

---

## 📋 Step 1: Create Supabase Project (5 minutes)

### 1.1 Sign Up / Login
- Go to: **https://supabase.com**
- Click **"Start your project"** or **"Sign In"**
- Sign up with GitHub, Google, or Email

### 1.2 Create New Project
1. Click **"New Project"** button
2. Fill in the form:
   ```
   Name: Qilly Production
   Database Password: [CREATE A STRONG PASSWORD - SAVE IT!]
   Region: South Africa (Cape Town) or Europe (Frankfurt)
   Pricing Plan: Free (or Pro if you prefer)
   ```
3. Click **"Create new project"**
4. ⏳ Wait 2-3 minutes for provisioning

---

## 📋 Step 2: Get Your Credentials (2 minutes)

### 2.1 Find Your Project Settings
1. In your new Supabase project, click the **Settings icon** (⚙️) in the sidebar
2. Click **"API"** in the settings menu

### 2.2 Copy These Values

You'll see two important credentials:

**A) Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```
- Copy the `xxxxxxxxxxxxx` part (this is your **Project ID**)

**B) API Keys:**
Under "Project API keys", find the `anon` `public` key:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```
- Copy the entire key (this is your **Public Anon Key**)

### 2.3 Save These Values
Write them down or save in a secure location:
```
Project ID: _______________________
Anon Key: _______________________
Database Password: _______________________
```

---

## 📋 Step 3: Update Your Qilly App (1 minute)

### 3.1 Update Configuration File

Open the file: `/src/utils/supabase/info.ts`

Replace the placeholder values with YOUR credentials:

**BEFORE (current):**
```typescript
export const projectId = "tjajhzepupsmunewfvag"; // ❌ Demo placeholder
export const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // ❌ Demo placeholder
```

**AFTER (your credentials):**
```typescript
export const projectId = "YOUR_PROJECT_ID_HERE"; // ✅ Your actual project ID
export const publicAnonKey = "YOUR_ANON_KEY_HERE"; // ✅ Your actual anon key
```

### 3.2 Example
If your Project URL is `https://abc123xyz.supabase.co`, then:
```typescript
export const projectId = "abc123xyz";
export const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM3h5eiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjg5MTAwMjg0LCJleHAiOjIwMDQ2NzYyODR9.xxxxx";
```

---

## 📋 Step 4: Create Database Tables (5 minutes)

### 4.1 Open SQL Editor
1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**

### 4.2 Run Setup Script
1. Open the file: `/SUPABASE_SETUP_COMPLETE.sql` (I just created it for you)
2. **Copy the ENTIRE contents** of that file
3. **Paste into the SQL Editor** in Supabase
4. Click **"Run"** (or press Ctrl/Cmd + Enter)
5. Wait for "Success. No rows returned" message

This will create:
- ✅ 5 tables (users, bills, bill_items, suppliers, supplier_products)
- ✅ All indexes for performance
- ✅ All Row Level Security (RLS) policies
- ✅ Helper functions
- ✅ Sample supplier data

### 4.3 Verify Tables
Run this query to verify:
```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

You should see:
```
bill_items
bills
supplier_products
suppliers
users
```

---

## 📋 Step 5: Configure Authentication (3 minutes)

### 5.1 Enable Email Authentication
1. Go to **Authentication** → **Providers** in sidebar
2. Find **Email** provider
3. Toggle it **ON** (should be enabled by default)
4. Click **"Save"**

### 5.2 Configure Redirect URLs
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: 
   ```
   https://your-qilly-domain.com
   ```
   (or `http://localhost:5173` for local development)

3. Add **Redirect URLs**:
   ```
   https://your-qilly-domain.com/**
   http://localhost:5173/**
   ```

4. Click **"Save"**

---

## 📋 Step 6: Test Connection (2 minutes)

### 6.1 Test in Your App
1. **Restart your development server** (if running)
2. **Open your Qilly app**
3. **Login to Admin Dashboard**
4. **Click "Database Inspector" tab**
5. You should see: **"✅ Connected to Database"** (green indicator)

### 6.2 Test in Supabase Dashboard
1. Go to **Table Editor** in Supabase
2. Click on **"users"** table
3. You should see the empty table with all columns

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] Supabase project created
- [ ] Project credentials copied
- [ ] `/src/utils/supabase/info.ts` updated with your credentials
- [ ] SQL script run successfully in Supabase
- [ ] All 5 tables visible in Table Editor
- [ ] Email authentication enabled
- [ ] Redirect URLs configured
- [ ] Database Inspector shows "Connected to Database"
- [ ] Can access Supabase dashboard without errors

---

## 🔗 Your Personal Supabase Dashboard URL

After setup, your dashboard URL will be:
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with the project ID you copied in Step 2.

**Bookmark this URL for easy access!**

---

## 🆘 Troubleshooting

### "You do not have access to this project"
- ✅ Make sure you're logged into Supabase with the correct account
- ✅ Verify you're using YOUR project ID, not the demo placeholder

### "Failed to load database schema"
- ✅ Check that `/src/utils/supabase/info.ts` has correct credentials
- ✅ Verify your Supabase project is active (not paused)
- ✅ Check internet connection

### "Row Level Security policy violation"
- ✅ Make sure you ran the complete SQL script
- ✅ Check RLS policies were created in Table Editor → Policies

### Tables not showing up
- ✅ Verify SQL script ran without errors
- ✅ Check in Table Editor that tables exist
- ✅ Refresh your browser

---

## 💡 Next Steps After Setup

### 1. **Test the Database Inspector**
   - Login to Admin Dashboard
   - Click "Database Inspector" tab
   - Explore your database structure

### 2. **Add Your First User**
   - Use Supabase Authentication to sign up
   - Or insert directly via SQL Editor

### 3. **Import Supplier Data**
   - Use the Supplier Signup form
   - Or bulk import via CSV in Table Editor

### 4. **Create Your First Bill**
   - Upload a BOQ via the Bill Upload feature
   - Test the pricing engine

### 5. **Monitor Performance**
   - Check Database → Performance in Supabase
   - Review query performance metrics

---

## 📞 Need Help?

If you get stuck:

1. **Check Supabase Logs**: Database → Logs in dashboard
2. **Review Browser Console**: Press F12 → Console tab
3. **Supabase Documentation**: https://supabase.com/docs
4. **Supabase Discord**: https://discord.supabase.com

---

## 🎉 You're All Set!

Once you complete these steps, you'll have:

✅ Your own Supabase database for Qilly  
✅ All tables and security policies configured  
✅ Database Inspector working in Admin Dashboard  
✅ Direct access to Supabase dashboard  
✅ Full control over your database

**Time to start using Qilly with your own database!** 🚀
