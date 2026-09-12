# 🔧 ENVIRONMENT MODE CONFIGURATION GUIDE

## ✅ **CHANGES IMPLEMENTED**

### **1. Development Mode is Now DEFAULT** ⭐
- Changed from: `demo` mode (localStorage)
- Changed to: `development` mode (Supabase database)
- **All flows now use Supabase by default**

### **2. Demo Mode Disabled in Admin Dashboard**
- ✅ Suppliers: Now fetch from Supabase (not localStorage)
- ✅ Contractors: Now fetch from Supabase (not localStorage)  
- ✅ Approve/Reject: Updates Supabase (not localStorage)
- ❌ Demo localStorage removed from admin flows

### **3. Real Database Integration Active**
- All user registrations → Supabase `contractors` table
- All supplier registrations → Supabase `suppliers` table
- All approve/reject actions → Supabase updates
- Real-time data synchronization

---

## 🎯 CURRENT ENVIRONMENT: DEVELOPMENT

### **What This Means:**

```
Environment: DEVELOPMENT 🔧
├─ Database: Supabase (REAL)
├─ Demo Mode: DISABLED
├─ Testing Tabs: VISIBLE
├─ Dev Tools: VISIBLE
├─ Debug Logs: ENABLED
└─ Feature Flags: All testing features ON
```

### **Features Enabled in Development:**

| Feature | Development | Staging | Production |
|---------|-------------|---------|------------|
| **Real Database** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Dev Tools Tab** | ✅ Visible | ❌ Hidden | ❌ Hidden |
| **Testing Tabs** | ✅ Visible | ✅ Visible | ❌ Hidden |
| **Debug Logs** | ✅ Enabled | ✅ Enabled | ❌ Disabled |
| **Demo Mode** | ❌ Disabled | ❌ Disabled | ❌ Disabled |
| **Error Details** | ✅ Full | ✅ Full | ❌ Limited |
| **Admin Override** | ✅ Yes | ✅ Yes | ❌ No |

---

## 🔄 HOW TO SWITCH ENVIRONMENTS

### **Method 1: Using Environment Switcher (UI)**

1. **Login to Admin Dashboard**
   - Email: `admin@qilly.com`
   - Password: `admin123`

2. **Go to Settings Tab**
   - Click on "Settings" tab at the top

3. **Use Environment Switcher**
   - You'll see the EnvironmentSwitcher component
   - Select environment: Development | Staging | Production | Demo
   - Click "Switch Environment"
   - Page automatically reloads

### **Method 2: Using Browser Console**

```javascript
// Switch to Development (default - recommended)
localStorage.setItem('qilly_environment', 'development');
location.reload();

// Switch to Staging (for pre-production testing)
localStorage.setItem('qilly_environment', 'staging');
location.reload();

// Switch to Production (for live deployment)
localStorage.setItem('qilly_environment', 'production');
location.reload();

// Switch to Demo (localStorage - NOT RECOMMENDED)
localStorage.setItem('qilly_environment', 'demo');
location.reload();

// Clear override (returns to default: development)
localStorage.removeItem('qilly_environment');
location.reload();
```

### **Method 3: Using URL Parameter**

```
Development:
https://your-app.com/?env=development

Staging:
https://your-app.com/?env=staging

Production:
https://your-app.com/?env=production

Demo (localStorage):
https://your-app.com/?env=demo
```

### **Method 4: Check Current Environment**

```javascript
// In browser console
const env = localStorage.getItem('qilly_environment') || 'development';
console.log('Current Environment:', env);
```

---

## 📊 ENVIRONMENT COMPARISON

### **🔧 DEVELOPMENT MODE** (Current Default)

```
Purpose: Active development and testing
Database: Supabase (real database)
Data Persistence: YES
Feature Flags:
  ✅ Show all testing tabs
  ✅ Show developer tools
  ✅ Enable debug logging
  ✅ Show error details
  ✅ Admin override enabled
  ✅ Real database operations

Use When:
  - Building new features
  - Testing database integration
  - Debugging issues
  - Creating test data
  - Approving registrations
```

### **🚧 STAGING MODE**

```
Purpose: Pre-production testing
Database: Supabase staging database (or same as dev)
Data Persistence: YES
Feature Flags:
  ✅ Show testing tabs
  ❌ Hide developer tools
  ✅ Enable debug logging
  ✅ Show error details
  ✅ Admin override enabled
  ✅ Real database operations

Use When:
  - Final testing before production
  - QA/UAT testing
  - Client demos
  - Performance testing
  - Data migration testing
```

### **🚀 PRODUCTION MODE**

```
Purpose: Live production environment
Database: Supabase production database
Data Persistence: YES
Feature Flags:
  ❌ Hide testing tabs
  ❌ Hide developer tools
  ❌ Minimal debug logging
  ❌ Limited error details
  ❌ Admin override disabled
  ✅ Real database operations (production data)

Use When:
  - Live deployment
  - Real users accessing system
  - Production data processing
  - Customer-facing operations
```

### **🎮 DEMO MODE** (Legacy - NOT RECOMMENDED)

```
Purpose: Offline demos without database
Database: localStorage ONLY (no Supabase)
Data Persistence: Browser only (cleared on refresh)
Feature Flags:
  ✅ Show testing tabs
  ✅ Show developer tools
  ✅ Enable debug logging
  ❌ NO real database operations

Use When:
  - Offline demonstrations
  - No internet connection
  - Quick UI testing
  - NOT recommended for development!

⚠️ WARNING: Demo mode no longer used by default!
⚠️ Use Development mode for all testing with Supabase
```

---

## 🎯 RECOMMENDED WORKFLOW

### **Development Phase (Now):**

```
1. Environment: DEVELOPMENT ✅ (Current)
2. Database: Supabase Development
3. Testing: All features enabled
4. Approvals: Admin can approve contractors/suppliers
5. Data: Real database, can be reset/cleared
```

### **Testing Phase (Future):**

```
1. Environment: STAGING
2. Database: Supabase Staging (clone of production schema)
3. Testing: Pre-production testing
4. Approvals: Full workflow testing
5. Data: Test data that mimics production
```

### **Production Deployment (Future):**

```
1. Environment: PRODUCTION
2. Database: Supabase Production
3. Testing: None (production data only)
4. Approvals: Live customer approvals
5. Data: Real customer data
```

---

## ✅ VERIFICATION CHECKLIST

### **How to Verify You're in Development Mode:**

1. **Check Environment Badge**
   - Open Admin Dashboard
   - Look for environment badge (top right)
   - Should show: "🔧 Development"

2. **Check Console**
   ```javascript
   // Open browser console (F12)
   // You should see:
   console.log(localStorage.getItem('qilly_environment')); 
   // Returns: "development" or null (means development by default)
   ```

3. **Check Database Queries**
   ```
   Open browser console
   Look for logs like:
   "✅ Loaded contractors from Supabase"
   "✅ Loaded suppliers from Supabase"
   
   NOT:
   "Loaded suppliers from localStorage" (this was demo mode)
   ```

4. **Check Tabs Visibility**
   ```
   Admin Dashboard should show:
   ✅ Suppliers tab
   ✅ Contractors tab
   ✅ Database tab (visible in dev mode)
   ✅ Dev Tools tab (visible in dev mode)
   ✅ Testing tab (visible in dev mode)
   ```

5. **Test Data Persistence**
   ```
   1. Register a test contractor
   2. Refresh the page (F5)
   3. Check Admin Dashboard → Contractors tab
   4. Contractor should still be there ✅
   
   If in demo mode (localStorage):
   - Data would be gone after refresh ❌
   ```

---

## 🔧 TROUBLESHOOTING

### **Problem: Still seeing localStorage data**

**Solution:**
```javascript
// Clear all localStorage
localStorage.clear();

// Set to development
localStorage.setItem('qilly_environment', 'development');

// Reload
location.reload();
```

### **Problem: Contractors not showing in Admin Dashboard**

**Solution:**
```
1. Check you're in Development mode
2. Go to Admin Dashboard
3. Click "Contractors" tab
4. Should fetch from Supabase (not localStorage)
5. Check console for "✅ Loaded contractors from Supabase"
```

### **Problem: Environment badge not showing**

**Solution:**
```
1. Hard refresh: Ctrl + Shift + R
2. Clear cache
3. Check EnvironmentBadge component is imported
4. Should show "🔧 Development" in Admin Dashboard
```

### **Problem: Can't switch to Staging/Production**

**Solution:**
```javascript
// Force switch using console
localStorage.setItem('qilly_environment', 'staging');
location.reload();

// Or use Environment Switcher in Settings tab
```

---

## 📝 ENVIRONMENT CONFIGURATION FILE

Location: `/src/utils/environment.ts`

```typescript
// Default environment (changed from 'demo' to 'development')
export function getCurrentEnvironment(): Environment {
  // Priority order:
  // 1. localStorage override
  // 2. URL parameter
  // 3. Build environment variable
  // 4. DEFAULT: 'development' ⭐ (changed from 'demo')
  
  return 'development';
}
```

**Key Changes Made:**
- Line 45: Changed default from `'demo'` to `'development'`
- This affects ALL flows unless overridden
- Enables Supabase database by default
- Disables localStorage demo mode

---

## 🎯 SUMMARY

### **What Changed:**

| Before | After |
|--------|-------|
| Default: Demo mode (localStorage) | Default: Development mode (Supabase) |
| Suppliers: localStorage | Suppliers: Supabase database ✅ |
| Contractors: localStorage fallback | Contractors: Supabase database ✅ |
| Approve/Reject: localStorage | Approve/Reject: Supabase ✅ |
| Data persistence: Browser only | Data persistence: Real database ✅ |

### **How to Switch:**

1. **Development** (default) - Use for all testing
2. **Staging** - Use for pre-production testing  
3. **Production** - Use for live deployment
4. **Demo** - Legacy mode (not recommended)

### **Current Status:**

```
✅ Development mode is DEFAULT
✅ All flows use Supabase
✅ Demo mode disabled in admin
✅ Contractors visible in Admin Dashboard
✅ Real-time database sync
✅ Environment switcher available in Settings
```

---

## 🚀 NEXT STEPS

### **For Continued Development:**

1. **Stay in Development Mode** ✅
   - Already configured as default
   - Uses Supabase for all operations
   - Full debugging and testing tools

2. **Test Contractor Approvals:**
   - Register contractors
   - View in Admin Dashboard → Contractors tab
   - Approve/Reject
   - Verify updates persist in Supabase

3. **When Ready for Staging:**
   ```javascript
   localStorage.setItem('qilly_environment', 'staging');
   location.reload();
   ```

4. **When Ready for Production:**
   ```javascript
   localStorage.setItem('qilly_environment', 'production');
   location.reload();
   ```

---

## 📞 QUICK REFERENCE

### **Check Current Environment:**
```javascript
localStorage.getItem('qilly_environment') || 'development'
```

### **Switch to Development:**
```javascript
localStorage.setItem('qilly_environment', 'development');
location.reload();
```

### **Switch to Staging:**
```javascript
localStorage.setItem('qilly_environment', 'staging');
location.reload();
```

### **Switch to Production:**
```javascript
localStorage.setItem('qilly_environment', 'production');
location.reload();
```

### **Reset to Default (Development):**
```javascript
localStorage.removeItem('qilly_environment');
location.reload();
```

---

**🎉 Development mode is now the default! All flows use Supabase database. Demo mode is disabled to avoid confusion.**
