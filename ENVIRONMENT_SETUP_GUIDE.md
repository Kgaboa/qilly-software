# 🌍 Environment Setup Guide for Supplier Sync

## Quick Answer to Your Question

**Q: Do I have to confirm the environment mode first, or does sync assume Development mode?**

**A:** The sync **automatically detects** the environment using this priority:

```
1. localStorage override (`qilly_environment`) ← Highest priority
2. URL parameter (?env=development)
3. Build mode (import.meta.env.MODE)
4. Default: 'demo' ← Lowest priority
```

**By default**, you're in **DEMO mode** (which doesn't use a real database).

**To sync to Development database, you must SET the environment to 'development' first!**

---

## 🎯 Current Default Behavior

### When You First Open Qilly:
- **Environment:** `demo` (default)
- **Database:** None (localStorage only)
- **Supplier Sync:** Won't work (no database to sync to)

### Priority System:
```javascript
getCurrentEnvironment() checks:
1. localStorage.getItem('qilly_environment')  ← Manual override
2. URL param: ?env=development                ← Temporary override
3. import.meta.env.MODE                       ← Build-time setting
4. Default: 'demo'                            ← Fallback
```

---

## ✅ How to Set Up for Supplier Sync

### Method 1: Browser Console (Recommended for Testing)

**Step 1: Open Browser Console**
- Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)

**Step 2: Run This Command:**
```javascript
localStorage.setItem('qilly_environment', 'development');
location.reload();
```

**Result:**
- Environment is now **Development**
- Uses **Development Supabase database**
- Supplier sync will work!

---

### Method 2: URL Parameter (Temporary - No Reload Required)

**Step 1: Add to URL**
```
http://localhost:5173/?env=development
```

**Result:**
- Temporarily sets environment to Development
- Lasts only for this session
- Resets to default when you refresh without `?env=` param

---

### Method 3: Create Environment Selector UI (Permanent Solution)

I can add an environment selector to the Admin Dashboard that lets you switch environments with a button click.

---

## 🔍 How to Check Current Environment

### Option 1: Browser Console
```javascript
localStorage.getItem('qilly_environment')
// Returns: 'development' | 'staging' | 'production' | null (demo)
```

### Option 2: Check Tab Visibility
- **Supplier API tab visible** = Development/Demo mode
- **Only basic tabs visible** = Production mode

---

## 🗄️ Environment-Specific Database Connections

Each environment connects to a **different Supabase database**:

| Environment | Database | Purpose |
|-------------|----------|---------|
| **Demo** | None (localStorage) | UI testing without backend |
| **Development** | Dev Supabase Database | Testing supplier sync, BOQs, etc. |
| **Staging** | Staging Supabase Database | Pre-production testing |
| **Production** | Production Supabase Database | Live user data |

---

## 📋 Complete Workflow for Supplier Sync Testing

### ✅ Step-by-Step Guide

#### **Step 1: Connect to Supabase (If Not Done)**

1. Click **"Connect Database"** in Admin Dashboard
2. Select **"Development"** environment
3. Enter Supabase credentials:
   - Project URL
   - Anon Key
4. Click **"Connect"**

**Result:** Development database connected

---

#### **Step 2: Set Environment to Development**

**Option A - Browser Console (Quick):**
```javascript
localStorage.setItem('qilly_environment', 'development');
location.reload();
```

**Option B - URL Parameter:**
Navigate to: `http://localhost:5173/?env=development`

**How to Verify:**
- Open browser console
- Run: `localStorage.getItem('qilly_environment')`
- Should return: `"development"`

---

#### **Step 3: Create Database Tables**

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard
   - Select your Development project
   - Click **"SQL Editor"** in sidebar
   - Click **"New query"**

2. **Run SQL Script:**
   - Copy contents of `/SUPABASE_SETUP_FIXED.sql`
   - Paste into SQL Editor
   - Click **"Run"**

**Result:** Tables created (`suppliers`, `supplier_products`, etc.)

---

#### **Step 4: Sync Supplier Products**

1. **Navigate:** Admin Dashboard → **Supplier API** → **Sync Products** tab
2. **Click "Sync Now"** for each supplier:
   - BUCO → ✅ 5 products synced
   - Builders Warehouse → ✅ 4 products synced
   - PPC → ✅ 2 products synced
   - Lafarge → ✅ 2 products synced

**How It Works:**
```javascript
// When you click "Sync Now", this happens:
syncSupplierProducts() 
  → getClient() 
  → getSupabaseClient(getCurrentEnvironment())
  → getCurrentEnvironment() returns 'development'
  → Connects to Development database
  → Uploads products to supplier_products table
```

**Result:** Products synced to **Development database**

---

#### **Step 5: Verify Sync**

1. **Check Overview Tab:**
   - Navigate to: Admin Dashboard → Supplier API → **Overview**
   - Each supplier card should show:
     - ✅ Status: "Synced to DB"
     - ✅ Last Sync: "21 Feb 2025, 14:32"

2. **Check Supabase Database:**
   - Open: https://supabase.com/dashboard
   - Go to: **Table Editor** → `suppliers`
   - You should see: BUCO, Builders Warehouse, PPC, Lafarge
   - Go to: **Table Editor** → `supplier_products`
   - You should see: 13 products total

**Result:** Data confirmed in Development database

---

#### **Step 6: Test Pricing (Find Best Prices)**

1. **Navigate:** Admin Dashboard → Supplier API → **Test Pricing** tab
2. **Fill Form:**
   - Product Description: `Cement 42.5N`
   - Unit: `50kg bag`
   - Quantity: `100`
   - Province: `Gauteng`
3. **Click:** 🔍 **Find Best Prices**

**How It Works:**
```javascript
// When you click "Find Best Prices", this happens:
getBestPrice() 
  → searchSupplierProducts()
  → getClient()
  → getSupabaseClient(getCurrentEnvironment())
  → getCurrentEnvironment() returns 'development'
  → Searches Development database
  → Returns price quotes
```

**Result:** Price quotes displayed (sorted by total cost)

---

## 🚨 Common Issues & Solutions

### Issue 1: "Table doesn't exist" Error

**Cause:** Database tables not created yet

**Solution:**
1. Open Supabase SQL Editor
2. Run `/SUPABASE_SETUP_FIXED.sql`
3. Click "Try Again" in error message

---

### Issue 2: No Products Found When Testing Pricing

**Cause:** Suppliers not synced yet (database is empty)

**Solution:**
1. Go to: Supplier API → **Sync Products** tab
2. Click "Sync Now" for at least 2 suppliers
3. Go back to: **Test Pricing** tab
4. Try searching again

---

### Issue 3: "Demo mode - Supabase not configured" Error

**Cause:** Environment is set to 'demo' (no database connection)

**Solution:**
```javascript
// Set environment to Development
localStorage.setItem('qilly_environment', 'development');
location.reload();
```

---

### Issue 4: Not Sure Which Environment I'm In

**Check:**
```javascript
// Open browser console and run:
localStorage.getItem('qilly_environment');

// Returns:
// null or undefined → Demo mode (default)
// "development" → Development mode
// "staging" → Staging mode
// "production" → Production mode
```

---

## 🎨 Visual Environment Indicator (Feature Request)

Currently, there's **no UI indicator** showing which environment you're in.

**Would you like me to add:**

1. **Environment Badge** in Admin Dashboard header:
   ```
   ┌─────────────────────────────────────┐
   │ Admin Dashboard        [🔧 Development] │
   └─────────────────────────────────────┘
   ```

2. **Environment Selector** with dropdown:
   ```
   Environment: [Development ▼]
   Options:
   - 🎮 Demo (localStorage)
   - 🔧 Development (Dev DB)
   - 🚧 Staging (Staging DB)
   - 🚀 Production (Prod DB)
   ```

3. **Environment Warning** on Supplier API tab:
   ```
   ⚠️ Current Environment: Demo
   Supplier sync requires Development mode.
   [Switch to Development]
   ```

---

## 📊 Environment Comparison

| Feature | Demo | Development | Staging | Production |
|---------|------|-------------|---------|------------|
| **Database** | localStorage | Dev Supabase | Staging Supabase | Prod Supabase |
| **Supplier Sync** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Test Pricing** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Admin Dashboard** | ✅ Full | ✅ Full | ⚠️ Limited | ❌ No |
| **Subscription Testing** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **Debug Logs** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |

---

## ✅ Summary: Answer to Your Question

### **Question:**
> Do I have to confirm the environment mode first, or does sync assume Development mode using the database?

### **Answer:**
**You MUST set the environment to 'development' first!**

**Default:** Demo mode (no database)

**To Use Supplier Sync:**

**Quick Method (Browser Console):**
```javascript
localStorage.setItem('qilly_environment', 'development');
location.reload();
```

**After Setting:**
- ✅ Environment is Development
- ✅ Uses Development Supabase database
- ✅ Supplier sync works
- ✅ Test pricing works

**Verification:**
```javascript
localStorage.getItem('qilly_environment');
// Should return: "development"
```

---

## 🚀 Recommended Enhancement

I suggest adding an **Environment Selector** to the Supplier Integration component:

```tsx
┌──────────────────────────────────────────────┐
│ Supplier Integration                         │
├──────────────────────────────────────────────┤
│ ⚠️ Current Environment: Demo                 │
│                                              │
│ Supplier sync requires a database connection.│
│ Please select an environment:                │
│                                              │
│ ○ Demo (localStorage only)                   │
│ ● Development (Dev Database) ← Recommended   │
│ ○ Staging (Staging Database)                 │
│ ○ Production (Production Database)           │
│                                              │
│ [Switch to Development]                      │
└──────────────────────────────────────────────┘
```

**Would you like me to implement this?**

This would:
1. ✅ Show current environment clearly
2. ✅ Let users switch with one click
3. ✅ Warn when in Demo mode (no database)
4. ✅ Prevent confusion about which database is being used

---

## 🎯 Final Checklist

Before testing Supplier Sync:

- [ ] Set environment to 'development'
  ```javascript
  localStorage.setItem('qilly_environment', 'development');
  location.reload();
  ```

- [ ] Verify environment
  ```javascript
  localStorage.getItem('qilly_environment'); // Should return "development"
  ```

- [ ] Connect to Supabase (if not done)
  - Admin Dashboard → Database Connection
  - Select "Development" environment
  - Enter credentials

- [ ] Create database tables
  - Run `/SUPABASE_SETUP_FIXED.sql` in Supabase

- [ ] Sync suppliers
  - Admin Dashboard → Supplier API → Sync Products
  - Click "Sync Now" for BUCO, Builders Warehouse, PPC, Lafarge

- [ ] Test pricing
  - Admin Dashboard → Supplier API → Test Pricing
  - Enter product details
  - Click "Find Best Prices"

**All steps complete?** You're ready to use Supplier Sync! 🚀
