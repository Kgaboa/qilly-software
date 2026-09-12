# 🔧 Switch to Development Mode - Complete Guide

## ✅ All 3 Issues Fixed!

### Issue #1: Last Sync Not Appearing ✅ FIXED
**Problem:** Last sync date/time wasn't showing in Overview tab after sync
**Fix:** Added `await loadSuppliers()` after sync to refresh supplier data with updated timestamps

### Issue #2: Wrong Environment Badge ✅ FIXED
**Problem:** Admin Dashboard showing "Production Mode" when in Development
**Fix:** Updated `EnvironmentBadge` component to use `getCurrentEnvironment()` instead of old `isLikelyProduction()`

### Issue #3: Want Development as Default ✅ SOLUTION BELOW

---

## 🎯 How to Permanently Switch to Development Mode

### Method 1: Browser Console (Quick & Easy)

**Step 1: Open Browser Console**
- Press `F12` or right-click → "Inspect" → "Console" tab

**Step 2: Run This Command**
```javascript
localStorage.setItem('qilly_environment', 'development');
location.reload();
```

**Step 3: Verify**
After page reloads, you should see:
- Environment Banner: **🔧 Development Mode**
- Admin Dashboard Badge: **🔧 Development Mode** (blue badge)

**Result:** 
- ✅ Development mode is now default
- ✅ Persists across sessions
- ✅ Survives page refreshes
- ✅ Will stay Development until you change it

---

### Method 2: Use the Environment Banner UI (Visual)

**Step 1: Navigate to Supplier API**
- Admin Dashboard → **Supplier API** tab

**Step 2: Click "Switch Environment"**
- At the top of the page, you'll see the Environment Banner
- Click the **"Switch Environment"** button

**Step 3: Select Development**
- Click the **"🔧 Development"** card
- Page reloads automatically

**Step 4: Verify**
- Environment Banner now shows: **🔧 Development Mode**
- Badge is blue (not purple for Demo)

---

### Method 3: URL Parameter (Temporary - For Testing Only)

**Quick Test Without Saving:**
```
http://localhost:5173/?env=development
```

**Note:** This only lasts for the current session. When you remove `?env=development` from URL, it reverts to default.

---

## 📊 Environment Badge Colors Reference

| Environment | Badge Color | Icon | Location |
|-------------|-------------|------|----------|
| Demo | Purple | 🎮 HardDrive | Default |
| Development | Blue | 🔧 Wrench | After setting |
| Staging | Yellow | 🚧 Construction | For pre-prod |
| Production | Green | 🚀 Database | For live |

---

## ✅ Verification Checklist

After switching to Development, verify these:

### 1. Check Environment Banner (Supplier API page)
```
┌─────────────────────────────────────────────┐
│ 🔧 Current Environment: [Development]       │
│ Full access to all testing tools           │
└─────────────────────────────────────────────┘
```
✅ Should show blue badge with wrench icon

### 2. Check Admin Dashboard Badge
```
Admin Dashboard
Manage supplier registrations and approvals [🔧 Development Mode]
```
✅ Should show blue "Development Mode" badge (not "Production Mode")

### 3. Check Browser Console
```javascript
localStorage.getItem('qilly_environment');
// Should return: "development"
```
✅ Should return `"development"` (not `null`)

### 4. Check Database Connection
```
Supplier API → Sync Products → Click "Sync Now"
```
✅ Should sync to Development Supabase database

---

## 🔍 Troubleshooting

### Problem: Still Shows "Demo Mode"

**Solution 1: Clear Cache**
```javascript
localStorage.clear();
localStorage.setItem('qilly_environment', 'development');
location.reload();
```

**Solution 2: Hard Refresh**
- Windows: `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Solution 3: Check LocalStorage**
```javascript
// View all localStorage
console.log(localStorage);

// Check environment specifically
console.log(localStorage.getItem('qilly_environment'));
```

---

### Problem: Badge Still Shows "Production Mode"

**Cause:** Old `EnvironmentBadge` component was cached

**Solution:**
1. Hard refresh the page (`Ctrl + F5` or `Cmd + Shift + R`)
2. If still not fixed, clear browser cache completely
3. The component has been updated to use `getCurrentEnvironment()` properly

---

### Problem: Sync Still Doesn't Work

**Check These:**

**1. Environment is Development**
```javascript
localStorage.getItem('qilly_environment'); // Should be "development"
```

**2. Database Tables Exist**
- Open Supabase → Table Editor
- Check for `suppliers` and `supplier_products` tables
- If missing, run `/SUPABASE_SETUP_FIXED.sql`

**3. RLS Policies Are Correct**
- Open Supabase → Authentication → Policies
- Check `suppliers` table has 4 policies:
  - ✅ Authenticated users can read suppliers
  - ✅ Authenticated users can insert suppliers
  - ✅ Authenticated users can update suppliers
  - ✅ Authenticated users can delete suppliers
- If missing, run `/SUPABASE_RLS_FIX.sql`

**4. User is Authenticated**
- Check if you're logged in to Supabase
- Environment uses `auth.uid()` for permissions

---

## 🎉 Complete Setup Workflow

### Step 1: Switch to Development (DONE ✅)
```javascript
localStorage.setItem('qilly_environment', 'development');
location.reload();
```

### Step 2: Verify Environment
```
✅ Environment Banner: 🔧 Development Mode
✅ Admin Dashboard Badge: 🔧 Development Mode (blue)
✅ Console: localStorage.getItem('qilly_environment') → "development"
```

### Step 3: Setup Database (If Not Done)
1. Open Supabase SQL Editor
2. Run `/SUPABASE_SETUP_FIXED.sql`
3. Verify tables created

### Step 4: Test Supplier Sync
1. Go to: Admin Dashboard → Supplier API → Sync Products
2. Click "Sync Now" for BUCO
3. Expected: `✅ 5 products synced, 0 errors`
4. Go to: Overview tab
5. Expected: BUCO card shows "Last Sync: [timestamp]"

### Step 5: Test Pricing
1. Go to: Test Pricing tab
2. Fill form:
   - Product: `Cement 42.5N`
   - Unit: `50kg bag`
   - Quantity: `100`
   - Province: `Gauteng`
3. Click "Find Best Prices"
4. Expected: Price quotes appear, sorted by total cost

---

## 📱 What Changed

### Before (Issues):

**Issue 1 - Last Sync:**
```
Overview Tab → BUCO Card
✓ Synced to DB
(No date/time shown)
```

**Issue 2 - Environment Badge:**
```
Admin Dashboard
Manage supplier registrations [Production Mode]
(Wrong - actually in Demo mode!)
```

**Issue 3 - Environment Persistence:**
```
Every page refresh → Back to Demo mode
(Had to manually set environment each time)
```

---

### After (Fixed):

**Issue 1 - Last Sync:**
```
Overview Tab → BUCO Card
✓ Synced to DB
Last Sync: 21 Feb 2025, 14:35
(Shows formatted timestamp!)
```

**Issue 2 - Environment Badge:**
```
Admin Dashboard
Manage supplier registrations [🔧 Development Mode]
(Correct - blue badge with wrench icon!)
```

**Issue 3 - Environment Persistence:**
```
Set once: localStorage.setItem('qilly_environment', 'development');
Persists forever (until you change it)
(No more manual setting each time!)
```

---

## 💾 How Environment Persistence Works

### localStorage Saves Your Choice:
```javascript
// When you set environment
localStorage.setItem('qilly_environment', 'development');

// It's stored in browser's localStorage
// Survives:
✅ Page refreshes
✅ Closing browser
✅ Computer restarts
✅ Across all tabs (same origin)

// Only clears when:
❌ You manually clear it
❌ You run localStorage.clear()
❌ You clear browser data
❌ You switch to different browser
```

### Environment Detection Priority:
```javascript
getCurrentEnvironment() {
  // 1. Check localStorage (HIGHEST PRIORITY)
  const stored = localStorage.getItem('qilly_environment');
  if (stored) return stored; // ← Your manual setting
  
  // 2. Check URL parameter
  const urlParam = new URLSearchParams(window.location.search).get('env');
  if (urlParam) return urlParam;
  
  // 3. Check build mode
  if (import.meta.env.MODE === 'production') return 'production';
  
  // 4. Default to demo (LOWEST PRIORITY)
  return 'demo';
}
```

**So when you set:**
```javascript
localStorage.setItem('qilly_environment', 'development');
```

**It becomes permanent because localStorage has highest priority!**

---

## 🚀 Next Steps After Switching

### 1. ✅ You're Now in Development Mode
- Environment persists across sessions
- Uses Development Supabase database
- All admin/testing features enabled

### 2. 🗄️ Setup Database (If Not Done)
```sql
-- In Supabase SQL Editor
-- Run: /SUPABASE_SETUP_FIXED.sql
```

### 3. 🔄 Test Supplier Sync
```
Supplier API → Sync Products → Sync Now
✅ BUCO: 5 products synced
✅ Overview shows: Last Sync timestamp
```

### 4. 💰 Test Price Optimization
```
Test Pricing → Fill form → Find Best Prices
✅ Shows sorted price quotes
```

### 5. 🎯 Build Your Features
- You're all set for development!
- Environment is configured
- Database is connected
- Supplier sync works
- Pricing works

---

## 📋 Quick Reference Commands

### Switch to Development:
```javascript
localStorage.setItem('qilly_environment', 'development');
location.reload();
```

### Check Current Environment:
```javascript
localStorage.getItem('qilly_environment');
```

### Switch to Staging:
```javascript
localStorage.setItem('qilly_environment', 'staging');
location.reload();
```

### Switch to Production:
```javascript
localStorage.setItem('qilly_environment', 'production');
location.reload();
```

### Reset to Demo (Default):
```javascript
localStorage.removeItem('qilly_environment');
location.reload();
```

---

## ✅ Summary

### You asked for 3 things:

1. **"Last Sync date/time not appearing"**
   - ✅ FIXED: Added reload after sync to refresh timestamps

2. **"Why showing Production Mode while in Development?"**
   - ✅ FIXED: Updated EnvironmentBadge to use correct detection

3. **"Want to start developing in Development mode"**
   - ✅ DONE: Run the command below

---

## 🎯 Final Command (Copy & Paste)

Open browser console and run:

```javascript
// Switch to Development mode permanently
localStorage.setItem('qilly_environment', 'development');

// Verify it was set
console.log('✅ Environment set to:', localStorage.getItem('qilly_environment'));

// Reload page to apply changes
console.log('🔄 Reloading page...');
setTimeout(() => location.reload(), 1000);
```

**Expected Result:**
```
✅ Environment set to: development
🔄 Reloading page...
(Page reloads)
Environment Banner: 🔧 Development Mode
Admin Dashboard: 🔧 Development Mode (blue badge)
```

**You're now permanently in Development mode!** 🎉

No more Demo mode. No more manual switching. Just Development, ready to build! 🚀
