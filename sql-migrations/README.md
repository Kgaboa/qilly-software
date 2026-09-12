# SQL Migrations for Qilly

## 📁 Migration Files

### 001_labor_rates_table.sql
**Purpose**: Create labor_rates table and seed with 39 BuildAid 2025/2026 standard rates

**Run in**:
1. Development: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
2. SIT: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/sql/new

**What it does**:
- Creates labor_rates table with proper schema
- Adds 39 labor rates covering all construction categories
- Sets up RLS policies for security
- Creates performance indexes
- Includes verification queries

### VERIFY_SYNC.sql
**Purpose**: Verify both databases have identical data

**Run in**: Both Development and SIT databases

**What it checks**:
- Row counts match
- Categories distribution matches
- Skill levels distribution matches
- Rate ranges match
- No duplicate codes
- Table structure matches
- RLS policies match
- Indexes match
- Data checksum matches

---

## 🚀 How to Use

### Step 1: Run Migration in Development
```sql
-- In Development database SQL editor
-- Copy entire contents of 001_labor_rates_table.sql
-- Click "Run"
```

### Step 2: Verify Development
```sql
-- In Development database SQL editor
-- Copy entire contents of VERIFY_SYNC.sql
-- Click "Run"
-- Save results
```

### Step 3: Run Migration in SIT
```sql
-- In SIT database SQL editor
-- Copy entire contents of 001_labor_rates_table.sql
-- Click "Run"
```

### Step 4: Verify SIT
```sql
-- In SIT database SQL editor
-- Copy entire contents of VERIFY_SYNC.sql
-- Click "Run"
-- Compare results with Development
```

### Step 5: Compare Results
Both databases should show:
- Total labor rates: **39**
- Categories: **11** (EARTHWORKS, CONCRETE, MASONRY, PLUMBING, ELECTRICAL, CARPENTRY, ROOFING, PAINTING, MANAGEMENT, GENERAL, EQUIPMENT)
- Skill levels: **3** (skilled, semi_skilled, unskilled)
- Min rate: **R150.00**
- Max rate: **R550.00**
- **Same data checksum**

---

## 🎯 Labor Rates Breakdown

### By Category
| Category | Count | Rate Range |
|----------|-------|------------|
| EARTHWORKS | 5 | R180 - R450 |
| CONCRETE | 6 | R200 - R380 |
| MASONRY | 5 | R190 - R380 |
| PLUMBING | 4 | R220 - R450 |
| ELECTRICAL | 4 | R230 - R480 |
| CARPENTRY | 4 | R210 - R360 |
| ROOFING | 3 | R200 - R360 |
| PAINTING | 2 | R180 - R300 |
| MANAGEMENT | 2 | R480 - R550 |
| GENERAL | 2 | R150 - R165 |
| EQUIPMENT | 3 | R360 - R520 |

### By Skill Level
| Skill Level | Count | Avg Rate |
|-------------|-------|----------|
| Skilled | 23 | R385 |
| Semi-skilled | 8 | R263 |
| Unskilled | 8 | R181 |

---

## 🔒 Security

All labor_rates have:
- **RLS enabled**: Row Level Security active
- **Read access**: All authenticated users
- **Write access**: Service role only
- **Audit trail**: created_at and updated_at timestamps

---

## 📊 Sample Labor Rates

### Top 5 Highest Rates
1. Site Supervisor - R550/hour
2. Crane Operator - R520/hour
3. Master Electrician - R480/hour
4. Foreman - R480/hour
5. Master Plumber - R450/hour

### Top 5 Lowest Rates
1. Site Cleaner - R150/hour
2. General Laborer - R165/hour
3. Painter Helper - R180/hour
4. Earthworks Laborer - R180/hour
5. Masonry Helper - R190/hour

---

## 🐛 Troubleshooting

### Migration Fails
- Check you have service_role permissions
- Verify no existing labor_rates table conflicts
- Check Supabase project status

### Verification Shows Mismatches
- Re-run migration in affected database
- Check for manual data modifications
- Verify you're looking at correct database

### "No labor rates found" Error in App
1. Check which environment app is using (top-right switcher)
2. Verify migration was run in that environment
3. Run: `SELECT COUNT(*) FROM labor_rates;`
4. Should return 39

---

## 📝 Adding New Migrations

When creating new migrations:

1. **Create file**: `/sql-migrations/002_your_migration.sql`
2. **Test in Development first**
3. **Verify with VERIFY_SYNC.sql**
4. **Run in SIT**
5. **Verify again**
6. **Update this README**

### Migration Template
```sql
-- ================================================================
-- QILLY MIGRATION: [Description]
-- ================================================================
-- Run in BOTH databases:
-- 1. Development: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
-- 2. SIT: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/sql/new
-- ================================================================

-- Your SQL here

-- ================================================================
-- VERIFICATION
-- ================================================================

-- Verification queries here
```

---

## ✅ Pre-Deployment Checklist

Before Monday presentation:

- [ ] Migration 001 run in Development
- [ ] Migration 001 verified in Development
- [ ] Migration 001 run in SIT
- [ ] Migration 001 verified in SIT
- [ ] Data checksums match between environments
- [ ] App tested in Development environment
- [ ] App tested in SIT environment
- [ ] No "No labor rates found" errors
- [ ] All 9 provinces pricing works

---

**Last Updated**: March 4, 2026  
**Databases**: Development (zzdzrlglivtpawtitvgu) & SIT (kcptusoevqapcvptlgkd)
