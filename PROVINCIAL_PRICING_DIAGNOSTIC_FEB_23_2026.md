# Provincial Pricing Diagnostic Report
**Date:** February 23, 2026

## Question 1: Are Hardcoded Provincial Values Same as Database Values?

### ✅ ANSWER: YES - They are IDENTICAL

#### Hardcoded Values (from `/src/utils/provincialPricing.ts`):
```typescript
const provinces: Province[] = [
  { code: 'WC',  name: 'Western Cape',    factor: 1.0,  description: 'Cape Town metro area - major supply hub' },
  { code: 'GP',  name: 'Gauteng',         factor: 1.0,  description: 'Johannesburg/Pretoria metro - major supply hub' },
  { code: 'KZN', name: 'KwaZulu-Natal',   factor: 1.0,  description: 'Durban metro area - major supply hub' },
  { code: 'EC',  name: 'Eastern Cape',    factor: 1.08, description: 'Port Elizabeth/East London - moderate transport costs' },
  { code: 'FS',  name: 'Free State',      factor: 1.06, description: 'Bloemfontein area - moderate transport costs' },
  { code: 'LP',  name: 'Limpopo',         factor: 1.12, description: 'Polokwane area - higher transport costs' },
  { code: 'MP',  name: 'Mpumalanga',      factor: 1.07, description: 'Nelspruit/Witbank area - moderate transport costs' },
  { code: 'NC',  name: 'Northern Cape',   factor: 1.15, description: 'Kimberley area - remote location, higher transport costs' },
  { code: 'NW',  name: 'North West',      factor: 1.09, description: 'Rustenburg/Mahikeng area - moderate to higher transport costs' }
];
```

#### Database Values (from `/src/utils/sql/provincial_pricing_factors.sql`):
```sql
INSERT INTO provincial_price_multipliers (province_code, province_name, pricing_factor, description) VALUES
  ('WC',  'Western Cape',    1.00, 'Cape Town metro area - major supply hub'),
  ('GP',  'Gauteng',         1.00, 'Johannesburg/Pretoria metro - major supply hub'),
  ('KZN', 'KwaZulu-Natal',   1.00, 'Durban metro area - major supply hub'),
  ('EC',  'Eastern Cape',    1.08, 'Port Elizabeth/East London - moderate transport costs'),
  ('FS',  'Free State',      1.06, 'Bloemfontein area - moderate transport costs'),
  ('LP',  'Limpopo',         1.12, 'Polokwane area - higher transport costs'),
  ('MP',  'Mpumalanga',      1.07, 'Nelspruit/Witbank area - moderate transport costs'),
  ('NC',  'Northern Cape',   1.15, 'Kimberley area - remote location, higher transport costs'),
  ('NW',  'North West',      1.09, 'Rustenburg/Mahikeng area - moderate to higher transport costs');
```

#### Comparison Table:

| Province | Code | Hardcoded Factor | Database Factor | Match? |
|----------|------|------------------|-----------------|--------|
| Western Cape | WC | 1.00 | 1.00 | ✅ YES |
| Gauteng | GP | 1.00 | 1.00 | ✅ YES |
| KwaZulu-Natal | KZN | 1.00 | 1.00 | ✅ YES |
| Eastern Cape | EC | 1.08 | 1.08 | ✅ YES |
| Free State | FS | 1.06 | 1.06 | ✅ YES |
| Limpopo | LP | 1.12 | 1.12 | ✅ YES |
| Mpumalanga | MP | 1.07 | 1.07 | ✅ YES |
| Northern Cape | NC | 1.15 | 1.15 | ✅ YES |
| North West | NW | 1.09 | 1.09 | ✅ YES |

### Conclusion:
**100% match** - All 9 provinces have identical factors in both hardcoded fallback and database.

---

## Question 2: Why Provincial Pricing Display Doesn't Match Database Multipliers

### Possible Causes:

#### 1. Database Table Not Created or Populated
**Status Check Required:**
- Navigate to Supabase → Table Editor
- Verify `provincial_price_multipliers` table exists
- Verify it has 9 rows of data
- Run SQL: `SELECT COUNT(*) FROM provincial_price_multipliers;` (should return 9)

**Solution if missing:**
```bash
# Run this SQL in Supabase SQL Editor:
/src/utils/sql/provincial_pricing_factors.sql
```

#### 2. RLS (Row Level Security) Blocking Access
**Status Check Required:**
- Check if RLS policies exist for `provincial_price_multipliers`
- Run SQL: 
```sql
SELECT * FROM provincial_price_multipliers;
```
- If you get "permission denied" or 0 rows, RLS is blocking

**Solution:**
```sql
-- Enable RLS
ALTER TABLE provincial_price_multipliers ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Anyone can view price multipliers" ON provincial_price_multipliers;
CREATE POLICY "Anyone can view price multipliers" 
  ON provincial_price_multipliers FOR SELECT 
  USING (true);
```

#### 3. UI Not Refreshing After Data Load
**Current Implementation Analysis:**

Looking at `/src/app/pages/ProvincialPricingPage.tsx`:

```typescript
// Line 23-40: Loads factors on mount
useEffect(() => {
  const loadProvincialFactors = async () => {
    setIsLoadingFactors(true);
    const factors = await fetchProvincialPricingFactors();
    setProvincialFactors(factors);
    setIsLoadingFactors(false);
    
    if (factors.length > 0) {
      console.log(`✅ Provincial Pricing: Using ${factors.length} pricing factors from Supabase database`);
    } else {
      console.warn('⚠️ No pricing factors in database, falling back to hardcoded values');
      setUseDatabaseFactors(false);
    }
  };

  loadProvincialFactors();
}, []);

// Line 43-50: Determines which factors to use
const allProvinces = useDatabaseFactors && provincialFactors.length > 0
  ? provincialFactors.map(f => ({
      code: f.province_code,
      name: f.province_name,
      factor: f.pricing_factor,
      description: f.description
    }))
  : provinces; // fallback to hardcoded

// Line 266: Applies the factor to pricing
const provincialPrice = item.unitPrice * (selectedProvinceData?.factor || 1.0);
```

**The code logic is CORRECT** ✅

#### 4. Badge Shows Database But Prices Use Fallback
**Investigation Needed:**

The page shows TWO badges:
1. **Products Badge** (line 122-131): Shows if using database products or catalog fallback
2. **Factors Badge** (line 137-146): Shows if using database factors or hardcoded fallback

**These are INDEPENDENT:**
- You can have database factors but fallback products
- You can have database products but fallback factors
- The pricing calculation uses whichever source is active

---

## Diagnostic Steps to Run

### Step 1: Check Browser Console
Open the Provincial Pricing page and check console for:
```
✅ Provincial Pricing: Using 9 pricing factors from Supabase database
✅ Loaded 9 provincial pricing factors from Supabase database
```

If you see:
```
⚠️ No pricing factors in database, falling back to hardcoded values
```
Then the database table is empty or RLS is blocking access.

### Step 2: Check Database in Supabase
1. Go to Supabase Dashboard → SQL Editor
2. Run:
```sql
-- Check if table exists and has data
SELECT 
  province_code,
  province_name,
  pricing_factor,
  description
FROM provincial_price_multipliers
ORDER BY province_code;
```

Expected result: 9 rows

### Step 3: Check RLS Policies
```sql
-- Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'provincial_price_multipliers';

-- Check policies
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'provincial_price_multipliers';
```

Expected: `rowsecurity = true` and at least one SELECT policy

### Step 4: Test Database Fetch Directly
In browser console on the Provincial Pricing page:
```javascript
// Test database connection
const { data, error } = await window.supabase
  .from('provincial_price_multipliers')
  .select('*');

console.log('Data:', data);
console.log('Error:', error);
```

---

## How to Verify Pricing is Working Correctly

### Example Calculation Walkthrough:

**Base Item:** Cement (Supplier: PPC) - R150.00/bag in Gauteng (GP)

**Expected Provincial Prices:**
- **WC** (1.00): R150.00 × 1.00 = **R150.00** (no change)
- **GP** (1.00): R150.00 × 1.00 = **R150.00** (no change)
- **KZN** (1.00): R150.00 × 1.00 = **R150.00** (no change)
- **EC** (1.08): R150.00 × 1.08 = **R162.00** (+R12.00 / +8%)
- **FS** (1.06): R150.00 × 1.06 = **R159.00** (+R9.00 / +6%)
- **LP** (1.12): R150.00 × 1.12 = **R168.00** (+R18.00 / +12%)
- **MP** (1.07): R150.00 × 1.07 = **R160.50** (+R10.50 / +7%)
- **NC** (1.15): R150.00 × 1.15 = **R172.50** (+R22.50 / +15%)
- **NW** (1.09): R150.00 × 1.09 = **R163.50** (+R13.50 / +9%)

### How to Test:
1. Go to Provincial Pricing page
2. Select a province (e.g., Northern Cape - NC)
3. Find an item with a known GP price
4. Verify the provincial price = GP price × factor
5. Check the "Diff" column shows the correct difference

---

## Current Status Summary

### ✅ What's Working:
1. **Code Logic**: The pricing calculation formula is correct
2. **Fallback System**: If database fails, hardcoded values work (and they're identical!)
3. **UI Indicators**: Badges show which data source is active
4. **Factor Consistency**: Database and hardcoded factors are 100% identical

### ⚠️ What Needs Verification:
1. **Database Population**: Confirm `provincial_price_multipliers` table has 9 rows
2. **RLS Policies**: Confirm anonymous users can read the table
3. **UI State**: Confirm prices recalculate when factors load from database

### 🔧 What to Check Next:
1. Open browser console on Provincial Pricing page
2. Look for the success/warning messages about database factors
3. If using fallback, check Supabase to see if data exists
4. If data exists but UI shows fallback, check RLS policies

---

## Quick Fix Commands

### If Database Table Missing:
```sql
-- Run the full setup script
-- Copy/paste contents of: /src/utils/sql/provincial_pricing_factors.sql
```

### If RLS Blocking:
```sql
ALTER TABLE provincial_price_multipliers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view price multipliers" ON provincial_price_multipliers;
CREATE POLICY "Anyone can view price multipliers" 
  ON provincial_price_multipliers FOR SELECT 
  USING (true);
```

### If Data Correct But UI Not Updating:
1. Hard refresh the page (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache
3. Check browser console for errors

---

## Expected Behavior

When everything is working correctly:

1. **On Page Load:**
   - Console shows: "✅ Loaded 9 provincial pricing factors from Supabase database"
   - Badge shows: "DB Factors (9)" in green
   
2. **When Selecting Province:**
   - Province details card shows correct factor
   - Price adjustment shows correct percentage
   - All items show calculated provincial price
   - Diff column shows correct price difference
   
3. **Pricing Table:**
   - GP Price column shows base price
   - [Selected Province] Price column shows base × factor
   - Diff column shows the increase amount
   - Footer totals reflect all calculations

---

## Next Steps

Please provide:
1. Screenshot of the browser console when on Provincial Pricing page
2. Screenshot of Supabase Table Editor showing `provincial_price_multipliers` table
3. Screenshot of the badges on the Provincial Pricing page
4. Example of an item where the pricing doesn't match expectations

This will help pinpoint the exact issue!
