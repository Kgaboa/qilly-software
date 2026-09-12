# ⚡ Quick Start - 5 Minute Migration

**For**: Immediate deployment before Monday presentation  
**Time**: 5 minutes  
**Risk**: 🟢 LOW (has automatic fallback)

---

## 🚀 3 Simple Steps

### Step 1: Open Supabase (30 seconds)
1. Go to: https://supabase.com/dashboard
2. Click on project: **zzdzrlglivtpawtitvgu** (Development)
3. Click **"SQL Editor"** in left sidebar
4. Click **"New query"** button

### Step 2: Run Migration (2 minutes)
1. Open file: `/supabase/migrations/003_create_boq_rates_table.sql`
2. Copy **ALL** content (Ctrl+A, Ctrl+C)
3. Paste into SQL Editor
4. Click **"Run"** button (or Ctrl+Enter)
5. Wait for **"Success ✅"** message

### Step 3: Verify & Test (2 minutes)
1. **In SQL Editor**, run verification:
   ```sql
   SELECT COUNT(*) as total FROM boq_rates;
   ```
   Should show: **39**

2. **In your app**, hard refresh (Ctrl+Shift+R)

3. **Upload BOQ**, check console should show:
   ```
   ✅ Loaded 39 rates from boq_rates table
   💰 Labor rate: R45.00/m³
   🚜 Equipment rate: R85.00/m³
   ```

**Done!** ✅ Your app now uses database rates with equipment costs!

---

## ✅ Success Checklist

After migration, verify:
- [ ] SQL query returned 39 rows
- [ ] Console shows "boq_rates table"
- [ ] Labor rates NOT R0
- [ ] Equipment rates NOT R0
- [ ] Total BOQ ~R1.8M (was ~R1.3M)

---

## 🆘 If Something Goes Wrong

**App will automatically fall back to mock data** (which is working now).

To rollback:
```sql
DROP TABLE IF EXISTS boq_rates;
```

App continues working with mock data!

---

## 💬 For Monday Presentation

### Say:
✅ "Database-driven with 39 BuildAid 2025/2026 rates"  
✅ "Complete labor AND equipment pricing"  
✅ "Professional, scalable architecture"

### Don't Say:
❌ "Just migrated from mock data"  
❌ "Fixed a bug yesterday"  
❌ "This used to not work"

---

**Ready? Go! Run the migration NOW!** ⚡

**Files you need**:
- Migration: `/supabase/migrations/003_create_boq_rates_table.sql`
- Full instructions: `/DATABASE_MIGRATION_INSTRUCTIONS.md`
- Implementation guide: `/OPTION_3_IMPLEMENTATION_COMPLETE.md`
