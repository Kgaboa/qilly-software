# 🔧 FIX: Provincial Pricing Warning

## ⚠️ Current Error

```
⚠️ No provincial pricing factors found in database. Using fallback data.
```

## ✅ Quick Fix (2 minutes)

### **Option 1: Copy-Paste SQL (Fastest)**

1. **Copy this entire SQL block:**

```sql
-- Create table if not exists
CREATE TABLE IF NOT EXISTS provincial_price_multipliers (
  province_code TEXT PRIMARY KEY,
  province_name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  multiplier DECIMAL(4, 2) NOT NULL DEFAULT 1.00,
  major_city TEXT NOT NULL,
  logistics_notes TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE provincial_price_multipliers ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS provincial_price_multipliers_select ON provincial_price_multipliers;
  DROP POLICY IF EXISTS provincial_price_multipliers_insert ON provincial_price_multipliers;
  DROP POLICY IF EXISTS provincial_price_multipliers_update ON provincial_price_multipliers;

  CREATE POLICY provincial_price_multipliers_select 
    ON provincial_price_multipliers FOR SELECT 
    TO public 
    USING (true);

  CREATE POLICY provincial_price_multipliers_insert 
    ON provincial_price_multipliers FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

  CREATE POLICY provincial_price_multipliers_update 
    ON provincial_price_multipliers FOR UPDATE 
    TO authenticated 
    USING (true)
    WITH CHECK (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Insert all 9 SA provinces
INSERT INTO provincial_price_multipliers (province_code, province_name, short_name, multiplier, major_city, logistics_notes)
VALUES
  ('gauteng', 'Gauteng', 'GP', 1.00, 'Johannesburg', 'Base pricing - manufacturing hub, central distribution'),
  ('western-cape', 'Western Cape', 'WC', 1.05, 'Cape Town', '+5% - Distance from GP, coastal logistics'),
  ('kwazulu-natal', 'KwaZulu-Natal', 'KZN', 1.03, 'Durban', '+3% - Coastal port access, good infrastructure'),
  ('eastern-cape', 'Eastern Cape', 'EC', 1.08, 'Port Elizabeth', '+8% - Distance + rural logistics challenges'),
  ('limpopo', 'Limpopo', 'LP', 1.06, 'Polokwane', '+6% - Rural delivery, lower volume'),
  ('mpumalanga', 'Mpumalanga', 'MP', 1.04, 'Nelspruit', '+4% - Proximity to Gauteng, moderate volume'),
  ('north-west', 'North West', 'NW', 1.07, 'Rustenburg', '+7% - Mining region, scattered demand'),
  ('free-state', 'Free State', 'FS', 1.05, 'Bloemfontein', '+5% - Central location but lower volume'),
  ('northern-cape', 'Northern Cape', 'NC', 1.12, 'Kimberley', '+12% - Most remote, very low volume')
ON CONFLICT (province_code) 
DO UPDATE SET
  province_name = EXCLUDED.province_name,
  short_name = EXCLUDED.short_name,
  multiplier = EXCLUDED.multiplier,
  major_city = EXCLUDED.major_city,
  logistics_notes = EXCLUDED.logistics_notes,
  last_updated = NOW();

-- Verify
SELECT COUNT(*) as total_provinces FROM provincial_price_multipliers;
```

2. **Go to Supabase:**
   - Open your Supabase project: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu
   - Click "SQL Editor" in left sidebar
   - Click "New Query"
   - Paste the SQL above
   - Click "Run" (or press Cmd+Enter / Ctrl+Enter)

3. **Expected Output:**
   ```
   total_provinces
   ---------------
   9
   ```

4. **Refresh your app** - warning should be gone! ✅

---

### **Option 2: Run SQL File**

If you prefer to use the SQL file:

1. **Open Supabase SQL Editor**
2. **Click "New Query"**
3. **Copy contents from:** `/src/utils/sql/insert_provincial_pricing.sql`
4. **Paste and Run**

---

## 🎯 What This Does

**Creates table with correct schema:**
- `province_code` (TEXT) - e.g., 'gauteng', 'western-cape'
- `province_name` (TEXT) - e.g., 'Gauteng', 'Western Cape'
- `short_name` (TEXT) - e.g., 'GP', 'WC'
- `multiplier` (DECIMAL) - e.g., 1.00, 1.05
- `major_city` (TEXT) - e.g., 'Johannesburg', 'Cape Town'
- `logistics_notes` (TEXT) - e.g., 'Base pricing - manufacturing hub'
- `last_updated` (TIMESTAMP)

**Inserts all 9 South African provinces:**
1. Gauteng (GP) - 1.00x (base price)
2. KwaZulu-Natal (KZN) - 1.03x (+3%)
3. Mpumalanga (MP) - 1.04x (+4%)
4. Western Cape (WC) - 1.05x (+5%)
5. Free State (FS) - 1.05x (+5%)
6. Limpopo (LP) - 1.06x (+6%)
7. North West (NW) - 1.07x (+7%)
8. Eastern Cape (EC) - 1.08x (+8%)
9. Northern Cape (NC) - 1.12x (+12%)

---

## ✅ Verification

After running the SQL, verify it worked:

```sql
-- Should return 9 rows
SELECT 
  province_code,
  province_name,
  short_name,
  multiplier,
  major_city
FROM provincial_price_multipliers
ORDER BY multiplier;
```

**Expected Output:**
```
province_code    | province_name     | short_name | multiplier | major_city
-----------------|-------------------|------------|------------|------------------
gauteng          | Gauteng           | GP         | 1.00       | Johannesburg
kwazulu-natal    | KwaZulu-Natal     | KZN        | 1.03       | Durban
mpumalanga       | Mpumalanga        | MP         | 1.04       | Nelspruit
western-cape     | Western Cape      | WC         | 1.05       | Cape Town
free-state       | Free State        | FS         | 1.05       | Bloemfontein
limpopo          | Limpopo           | LP         | 1.06       | Polokwane
north-west       | North West        | NW         | 1.07       | Rustenburg
eastern-cape     | Eastern Cape      | EC         | 1.08       | Port Elizabeth
northern-cape    | Northern Cape     | NC         | 1.12       | Kimberley
```

---

## 🎉 Result

After running the SQL:

**BEFORE:**
```
⚠️ No provincial pricing factors found in database. Using fallback data.
```

**AFTER:**
```
✅ Loaded 9 provincial pricing factors from Supabase database
```

---

## 📊 How Provincial Pricing Works

When a user creates a BOQ in Qilly:

1. **User selects province:** e.g., "Western Cape"
2. **System fetches base price:** e.g., Cement = R120 in Gauteng
3. **System applies multiplier:** R120 × 1.05 (WC multiplier) = **R126**
4. **BOQ shows provincial price:** R126 for Cement in Western Cape

This accounts for transportation costs, logistics, and market dynamics across South Africa's 9 provinces!

---

## 🔍 Troubleshooting

**If you still see the warning after running SQL:**

1. **Check if rows inserted:**
   ```sql
   SELECT COUNT(*) FROM provincial_price_multipliers;
   ```
   Should return `9`

2. **Check if RLS policies exist:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'provincial_price_multipliers';
   ```
   Should show 3 policies (select, insert, update)

3. **Clear browser cache and refresh**

4. **Check Supabase connection in app:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for "✅ Loaded 9 provincial pricing factors from Supabase database"

---

## 📁 Related Files

- **SQL Script:** `/src/utils/sql/insert_provincial_pricing.sql`
- **TypeScript Code:** `/src/utils/databaseProvincialPricing.ts`
- **Full Schema:** `/EFFICIENT_PROVINCIAL_PRICING.sql`

---

**Status:** ✅ Ready to fix  
**Time Required:** 2 minutes  
**Impact:** Removes warning + enables accurate provincial pricing across all 9 SA provinces
