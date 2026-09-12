# 🔧 Figma Make Environment Configuration

**Status:** ✅ **CONFIGURED - Defaults to DEVELOPMENT**

## Current Configuration

### Figma Make Default Environment: DEVELOPMENT 🔧

Your Figma Make instance is **already configured** to point to the **development environment** by default. This is the correct setup for testing before deploying to SIT.

## Environment Hierarchy

The app checks for environment settings in this priority order:

1. **localStorage override** (manual switch via Environment Switcher)
   - Persists across page refreshes
   - Can be set via Admin Dashboard → Dev Tools → Environment Switcher

2. **URL parameter** (`?env=sit`)
   - Temporary override for current session
   - Example: `https://your-app.com?env=sit`

3. **VITE_ENVIRONMENT variable** (Vercel deployment)
   - Set in Vercel project settings
   - Used for deployed environments (SIT, UAT, Preprod, Production)

4. **Build mode** (`vite --mode sit`)
   - For local testing of different environments
   - Scripts available in package.json

5. **Vite DEV mode** (localhost development)
   - Automatically set when running `npm run dev`

6. **DEFAULT: 'development'** ← **Figma Make starts here**
   - Fallback when no environment is specified
   - This is your current state

## Available Environments

| Environment | Icon | Database | Dev Tools | Testing Tabs | Use Case |
|-------------|------|----------|-----------|--------------|----------|
| **Development** | 🔧 | Dev (zzdzrlglivtpawtitvgu) | ✅ Visible | ✅ Visible | Figma Make default |
| **SIT** | 🔍 | SIT (kcptusoevqapcvptlgkd) | ❌ Hidden | ✅ Visible | First deployment |
| **UAT** | 🧪 | UAT | ❌ Hidden | ✅ Visible | User acceptance |
| **Preprod** | 🔬 | Preprod | ❌ Hidden | ✅ Visible | Final staging |
| **Production** | 🚀 | Production | ❌ Hidden | ❌ Hidden | Live environment |
| **Demo** | 🎮 | localStorage | ✅ Visible | ✅ Visible | Offline demo |

## How to Switch Environments

### Method 1: Environment Switcher (Recommended)
1. Log in to Admin Dashboard using `admin@qilly.co.za` / `QillyAdmin2026!`
2. Go to **Dev Tools** tab
3. Find **Environment Switcher** section
4. Click on the environment you want (e.g., "SIT")
5. Page will reload automatically

### Method 2: URL Parameter (Quick Test)
Add `?env=sit` to your Figma Make URL:
```
https://figma.com/...?env=sit
```

### Method 3: Browser Console (Developer)
Open browser console (F12) and run:
```javascript
localStorage.setItem('qilly_environment', 'sit');
location.reload();
```

### Method 4: Clear Override (Return to Default)
```javascript
localStorage.removeItem('qilly_environment');
location.reload();
```

## Database Connections by Environment

### Development (Current Default)
```
Project: zzdzrlglivtpawtitvgu
URL: https://zzdzrlglivtpawtitvgu.supabase.co
Database: Development database with test data
Purpose: Figma Make testing and development
```

### SIT (System Integration Testing)
```
Project: kcptusoevqapcvptlgkd
URL: https://kcptusoevqapcvptlgkd.supabase.co
Database: Dedicated SIT database
Purpose: First deployment tier, integration testing
Deployment: https://sit.qilly.co.za
```

### UAT (User Acceptance Testing)
```
Database: Dedicated UAT database
Purpose: Customer preview and validation
Deployment: https://uat.qilly.co.za
```

### Preprod (Pre-Production)
```
Database: Production replica
Purpose: Final validation before go-live
Deployment: https://preprod.qilly.co.za
```

### Production
```
Database: Live production database
Purpose: Real customers and data
Deployment: https://qilly.co.za
```

## Testing Before SIT Deployment

Your current Figma Make setup is **perfect** for testing before SIT deployment:

✅ **Development environment is active by default**
✅ Connects to development database (zzdzrlglivtpawtitvgu)
✅ All dev tools and testing tabs visible
✅ Full debugging enabled
✅ Can easily switch to SIT for final testing

## Pre-Deployment Checklist

Before deploying to SIT on Monday:

- [ ] Test all features in Development environment (Figma Make)
- [ ] Verify supplier sync works with development database
- [ ] Test BOQ pricing calculations
- [ ] Verify admin dashboard functionality
- [ ] Optional: Switch to SIT environment in Figma Make to preview SIT experience
- [ ] Clear localStorage before final deployment: `localStorage.clear()`

## Deployment to SIT

When you're ready to deploy to Vercel SIT:

1. **Deploy to Vercel** (SIT project)
   ```bash
   vercel --prod
   ```

2. **Set environment variable in Vercel:**
   - Go to Vercel project settings
   - Environment Variables
   - Add: `VITE_ENVIRONMENT = sit`
   - Scope: Production

3. **Redeploy** for changes to take effect

4. **Verify SIT environment** at https://sit.qilly.co.za
   - Check console logs for "Using SIT environment"
   - Verify Dev Tools tab is hidden
   - Confirm connection to SIT database (kcptusoevqapcvptlgkd)

## Troubleshooting

### Environment not switching?
1. Check browser console for environment detection logs
2. Clear localStorage: `localStorage.clear()`
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. Check for URL parameters that might override

### Still showing wrong database?
1. Check which environment is active in console logs
2. Verify localStorage: `localStorage.getItem('qilly_environment')`
3. Check Admin Dashboard → Environment Switcher for current status

### Dev Tools not showing?
1. Confirm you're in Development or Demo environment
2. Dev Tools are intentionally hidden in SIT, UAT, Preprod, and Production

## Quick Commands

```javascript
// Check current environment
console.log(localStorage.getItem('qilly_environment'));

// Switch to SIT
localStorage.setItem('qilly_environment', 'sit');
location.reload();

// Switch to Development (default)
localStorage.setItem('qilly_environment', 'development');
location.reload();

// Return to auto-detection
localStorage.removeItem('qilly_environment');
location.reload();

// Clear all overrides
localStorage.clear();
location.reload();
```

## Monday Investor Presentation Plan

### Current State (Thursday - Figma Make)
- ✅ Development environment active
- ✅ All features working
- ✅ Development database connected
- ✅ Full testing capability

### Before Monday Deployment
1. **Test everything in Figma Make (Development)**
   - Test supplier creation and sync
   - Verify BOQ pricing with all 98% coverage
   - Test compliance calculations
   - Verify provincial pricing

2. **Optional: Preview SIT mode**
   - Switch to SIT environment in Figma Make
   - Verify Dev Tools are hidden
   - Confirm expected behavior

3. **Deploy to Vercel SIT**
   - Follow deployment guide
   - Set VITE_ENVIRONMENT=sit
   - Test at https://sit.qilly.co.za

### Monday Presentation
- ✅ Live demo at https://sit.qilly.co.za
- ✅ Connected to SIT database
- ✅ Professional appearance (Dev Tools hidden)
- ✅ All testing tabs available for demo
- ✅ Real Supabase integration working

## Files Modified

1. `/src/utils/environment.ts` - Enhanced documentation
2. `/src/app/components/EnvironmentBanner.tsx` - Updated to include all environments
3. `/FIGMA_MAKE_ENVIRONMENT_SETUP.md` - This guide

## Summary

🎯 **Your Figma Make is already configured correctly!**

- **Current:** Development environment (perfect for testing)
- **Database:** Development (zzdzrlglivtpawtitvgu)
- **Next Step:** Test thoroughly, then deploy to SIT for Monday
- **No changes needed** - environment system is working as designed

The default Development environment is exactly what you need for Figma Make testing before deploying to SIT for your Monday presentation.
