# 🔍 Environment Check - Figma Make Instance

## Current Environment Detection

This Figma Make environment is currently set to **default to DEVELOPMENT** mode.

### How Environment is Determined

The environment detection follows this priority order:

1. **localStorage override** - `localStorage.getItem('qilly_environment')`
2. **URL parameter** - `?env=development` or `?env=sit`
3. **VITE_ENVIRONMENT** - Environment variable (not set in Figma Make)
4. **Build mode** - Defaults to `development` in dev builds

### Current Configuration

| Setting | Value | Status |
|---------|-------|--------|
| **Default Environment** | `development` | ✅ Correct |
| **Target Database** | `zzdzrlglivtpawtitvgu` | ✅ Development DB |
| **Database URL** | https://zzdzrlglivtpawtitvgu.supabase.co | ✅ Active |
| **Environment Switcher** | Top-right corner | ✅ Available |

---

## ✅ Verified Setup

### This Figma Make Environment:
- ✅ Points to **Development database** by default
- ✅ Has Environment Switcher UI for manual switching
- ✅ Can switch to SIT using `?env=sit` URL parameter
- ✅ Can override using localStorage: `localStorage.setItem('qilly_environment', 'sit')`

### Your Deployment Strategy (CONFIRMED):

```
┌─────────────────────────────────────────────────────────┐
│  STEP 1: Test in Figma Make (Development)              │
│  - Uses: zzdzrlglivtpawtitvgu database                 │
│  - Run SQL migration 001_labor_rates_table.sql          │
│  - Test all features work                               │
│  - Verify no errors                                     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 2: Deploy to SIT Environment                     │
│  - Uses: kcptusoevqapcvptlgkd database                 │
│  - Run SAME SQL migration in SIT database               │
│  - Switch environment: ?env=sit                         │
│  - Test again in SIT                                    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 3: Verify Sync                                   │
│  - Run VERIFY_SYNC.sql in both databases                │
│  - Compare results                                      │
│  - Both should show: 39 labor rates                     │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 SQL Migration Checklist

### Development Database (zzdzrlglivtpawtitvgu)

**Database URL**: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new

#### Step 1: Run Migration
- [ ] Open SQL editor in Development database
- [ ] Copy entire `/sql-migrations/001_labor_rates_table.sql`
- [ ] Paste and click "Run"
- [ ] Verify: "39 rows inserted"

#### Step 2: Verify
- [ ] Run: `SELECT COUNT(*) FROM labor_rates;`
- [ ] Expected: **39**
- [ ] Run: `SELECT * FROM labor_rates LIMIT 5;`
- [ ] Should see labor rates with proper schema

#### Step 3: Test in Figma Make
- [ ] App should default to Development environment
- [ ] Check top-right: Should show "DEVELOPMENT"
- [ ] Upload a BOQ file
- [ ] Generate pricing
- [ ] Verify no "No labor rates found" errors
- [ ] Check that labor costs are applied correctly

---

### SIT Database (kcptusoevqapcvptlgkd)

**Database URL**: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/sql/new

#### Step 1: Run SAME Migration
- [ ] Open SQL editor in SIT database
- [ ] Copy entire `/sql-migrations/001_labor_rates_table.sql`
- [ ] Paste and click "Run"
- [ ] Verify: "39 rows inserted"

#### Step 2: Verify
- [ ] Run: `SELECT COUNT(*) FROM labor_rates;`
- [ ] Expected: **39**
- [ ] Run: `SELECT * FROM labor_rates LIMIT 5;`
- [ ] Should match Development database

#### Step 3: Test in SIT Mode
- [ ] Add `?env=sit` to URL OR
- [ ] Click "SIT" in Environment Switcher (top-right)
- [ ] Verify top-right shows "SIT"
- [ ] Upload a BOQ file
- [ ] Generate pricing
- [ ] Verify no errors
- [ ] Check that labor costs are applied correctly

---

## 🔄 Quick Switch Commands

### Switch to Development
```javascript
// In browser console:
localStorage.setItem('qilly_environment', 'development');
location.reload();
```

### Switch to SIT
```javascript
// In browser console:
localStorage.setItem('qilly_environment', 'sit');
location.reload();
```

### Check Current Environment
```javascript
// In browser console:
console.log('Current environment:', localStorage.getItem('qilly_environment') || 'development (default)');
```

### Clear Environment Override
```javascript
// In browser console:
localStorage.removeItem('qilly_environment');
location.reload();
// Will default back to 'development'
```

---

## ✅ What You Confirmed

Based on your message, you want to:

1. ✅ **Test first in Development mode** - This environment points to `zzdzrlglivtpawtitvgu` by default
2. ✅ **Deploy to SIT when ready** - Switch to SIT database using environment switcher
3. ✅ **Run SQL in BOTH databases** - Keep them synchronized

---

## 🎯 Next Immediate Steps

### 1. Run Migration in Development Database (NOW)

```sql
-- Open: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
-- Copy entire contents of: /sql-migrations/001_labor_rates_table.sql
-- Paste and Run
```

### 2. Test in This Figma Make Environment (NOW)

- App is already pointing to Development database
- Upload a BOQ file
- Generate pricing
- Verify labor rates are applied

### 3. Run Migration in SIT Database (AFTER TESTING)

```sql
-- Open: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/sql/new
-- Copy SAME file: /sql-migrations/001_labor_rates_table.sql
-- Paste and Run
```

### 4. Test in SIT Mode (AFTER SIT MIGRATION)

- Add `?env=sit` to URL or use Environment Switcher
- Test same workflow
- Verify everything works in SIT too

---

## 📊 Expected Results

After running migrations in both databases, you should see:

| Metric | Development | SIT | Status |
|--------|-------------|-----|--------|
| Total labor rates | 39 | 39 | ✅ Must match |
| Categories | 11 | 11 | ✅ Must match |
| Min rate | R150.00 | R150.00 | ✅ Must match |
| Max rate | R550.00 | R550.00 | ✅ Must match |
| Data checksum | [hash] | [hash] | ✅ Must match |

Use `/sql-migrations/VERIFY_SYNC.sql` to check these metrics.

---

## 🚨 Important Notes

1. **This Figma Make environment defaults to Development** - No action needed
2. **Development database is empty** - You MUST run the SQL migration first
3. **SIT database is also empty** - You MUST run the migration there too
4. **Both databases must have same data** - For consistency across environments
5. **Environment Switcher is available** - Top-right corner of app for easy switching

---

**Last Updated**: March 4, 2026  
**Figma Make Environment**: Development (default)  
**Development Database**: zzdzrlglivtpawtitvgu ✅  
**SIT Database**: kcptusoevqapcvptlgkd ✅  
**Status**: Ready for SQL migration deployment
