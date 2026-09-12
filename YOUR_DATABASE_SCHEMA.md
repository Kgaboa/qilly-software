# 📊 YOUR ACTUAL DATABASE SCHEMA
**Table:** `provincial_price_multipliers`  
**Source:** `/EFFICIENT_PROVINCIAL_PRICING.sql`

---

## Column Structure

```sql
CREATE TABLE provincial_price_multipliers (
  province_code   TEXT PRIMARY KEY,          -- 'gauteng', 'western-cape', etc.
  province_name   TEXT NOT NULL,             -- 'Gauteng', 'Western Cape'
  short_name      TEXT NOT NULL,             -- 'GP', 'WC', 'KZN' ← UI uses this!
  multiplier      DECIMAL(4, 2) NOT NULL,    -- 1.00, 1.05, 1.03 ← Pricing factor!
  major_city      TEXT NOT NULL,             -- 'Johannesburg', 'Cape Town'
  logistics_notes TEXT,                      -- Description of pricing
  last_updated    TIMESTAMP WITH TIME ZONE   -- When last modified
);
```

---

## Sample Data

| province_code   | short_name | province_name     | multiplier | major_city    | logistics_notes                    |
|-----------------|------------|-------------------|------------|---------------|------------------------------------|
| gauteng         | GP         | Gauteng           | 1.00       | Johannesburg  | Base pricing - manufacturing hub   |
| western-cape    | WC         | Western Cape      | 1.05       | Cape Town     | +5% - Distance from GP             |
| kwazulu-natal   | KZN        | KwaZulu-Natal     | 1.03       | Durban        | +3% - Coastal port access          |
| mpumalanga      | MP         | Mpumalanga        | 1.04       | Nelspruit     | +4% - Proximity to Gauteng         |
| free-state      | FS         | Free State        | 1.05       | Bloemfontein  | +5% - Central location             |
| limpopo         | LIM        | Limpopo           | 1.06       | Polokwane     | +6% - Rural delivery               |
| north-west      | NW         | North West        | 1.07       | Rustenburg    | +7% - Mining region                |
| eastern-cape    | EC         | Eastern Cape      | 1.08       | Port Elizabeth| +8% - Distance + rural logistics   |
| northern-cape   | NC         | Northern Cape     | 1.12       | Kimberley     | +12% - Most remote                 |

---

## How Your UI Uses This Data

### Query in TypeScript:
```typescript
const { data } = await supabase
  .from('provincial_price_multipliers')
  .select('*')
  .order('short_name');
```

### Mapping to UI:
```typescript
const allProvinces = data.map(f => ({
  code: f.short_name,           // 'GP', 'WC', 'KZN' for dropdowns
  name: f.province_name,         // 'Gauteng' for display
  factor: f.multiplier,          // 1.00, 1.05 for calculations
  description: f.logistics_notes // Description text
}));
```

### Price Calculation:
```typescript
const provincialPrice = basePrice * multiplier;

// Example:
// Base cement price in GP: R150.00
// WC multiplier: 1.05
// WC price: R150.00 × 1.05 = R157.50
```

---

## Important Columns Explained

### `province_code` (Primary Key)
- **Value:** Lowercase full name with hyphens
- **Examples:** 'gauteng', 'western-cape', 'kwazulu-natal'
- **Used for:** Database uniqueness, internal references
- **NOT used for:** UI display (too long)

### `short_name` ✨ Most Important for UI!
- **Value:** 2-letter province code (uppercase)
- **Examples:** 'GP', 'WC', 'KZN', 'MP'
- **Used for:** Dropdowns, selectors, compact display
- **This is what users see and select!**

### `multiplier` ✨ Core Pricing Value!
- **Value:** Decimal number (4 digits, 2 decimal places)
- **Range:** 1.00 to 1.15 (with CHECK constraint 0.5-2.0)
- **1.00 = Base pricing** (no adjustment)
- **1.05 = 5% increase** (+5% for transport/logistics)
- **1.12 = 12% increase** (remote provinces)

### `logistics_notes`
- **Value:** Text explanation of why this multiplier
- **Used for:** Displaying to users why prices differ
- **Examples:**
  - "Base pricing - manufacturing hub"
  - "+5% - Distance from GP, coastal logistics"
  - "+12% - Most remote, very low volume"

---

## Query Examples

### Get all provinces for dropdown:
```sql
SELECT short_name, province_name, multiplier
FROM provincial_price_multipliers
ORDER BY short_name;
```

### Get specific province (by UI code):
```sql
SELECT * FROM provincial_price_multipliers
WHERE short_name = 'GP';
```

### Calculate provincial price:
```sql
SELECT 
  short_name,
  province_name,
  150.00 AS gp_base_price,
  ROUND(150.00 * multiplier, 2) AS provincial_price,
  ROUND((150.00 * multiplier) - 150.00, 2) AS additional_cost
FROM provincial_price_multipliers
ORDER BY multiplier;
```

### Show only adjusted provinces:
```sql
SELECT short_name, province_name, multiplier,
  '+' || ROUND((multiplier - 1.0) * 100, 1) || '%' AS adjustment
FROM provincial_price_multipliers
WHERE multiplier > 1.0
ORDER BY multiplier;
```

---

## Update a Multiplier

```sql
UPDATE provincial_price_multipliers
SET 
  multiplier = 1.06,
  logistics_notes = '+6% - Updated logistics costs',
  last_updated = NOW()
WHERE short_name = 'WC';
```

---

## Verify Your Data

Run this to see your current setup:
```sql
SELECT 
  short_name AS code,
  province_name AS name,
  multiplier,
  CASE 
    WHEN multiplier = 1.0 THEN 'Base Rate ✓'
    ELSE '+' || ROUND((multiplier - 1.0) * 100, 1) || '%'
  END AS adjustment,
  major_city,
  logistics_notes
FROM provincial_price_multipliers
ORDER BY multiplier, short_name;
```

Expected output:
```
GP   Gauteng           1.00  Base Rate ✓     Johannesburg    Base pricing...
KZN  KwaZulu-Natal     1.03  +3%             Durban          +3% - Coastal...
MP   Mpumalanga        1.04  +4%             Nelspruit       +4% - Proximity...
WC   Western Cape      1.05  +5%             Cape Town       +5% - Distance...
...etc
```

---

## Key Differences from Old Schema

### OLD (provincial_pricing_factors.sql):
```sql
province_code   VARCHAR(2)      -- 'GP', 'WC'
pricing_factor  NUMERIC         -- 1.00, 1.05
description     TEXT
```

### NEW (EFFICIENT_PROVINCIAL_PRICING.sql) ✅ What you have:
```sql
province_code   TEXT            -- 'gauteng', 'western-cape'
short_name      TEXT            -- 'GP', 'WC' ← This replaced province_code!
multiplier      DECIMAL(4,2)    -- 1.00, 1.05 ← This replaced pricing_factor!
logistics_notes TEXT            -- ← This replaced description!
```

---

## TypeScript Interface (Correct)

```typescript
export interface ProvincialPricingFactor {
  province_code: string;       // 'gauteng', 'western-cape'
  province_name: string;        // 'Gauteng', 'Western Cape'
  short_name: string;           // 'GP', 'WC' ← UI uses this!
  multiplier: number;           // 1.00, 1.05 ← Pricing uses this!
  major_city: string;           // 'Johannesburg', 'Cape Town'
  logistics_notes: string | null; // Description
  last_updated: string;         // ISO timestamp
}
```

---

## 🎯 Remember

1. **UI Selection:** Uses `short_name` (GP, WC, KZN)
2. **Pricing Calc:** Uses `multiplier` (1.00, 1.05, 1.03)
3. **Description:** Uses `logistics_notes`
4. **Primary Key:** Is `province_code` (gauteng, western-cape)

Your database is using the **EFFICIENT** schema, which is actually better because:
- ✅ More descriptive province codes (full names)
- ✅ Separate short codes for UI (`short_name`)
- ✅ Better naming (`multiplier` vs `pricing_factor`)
- ✅ More metadata (major_city, logistics_notes)

---

**📚 For implementation details:** `/SCHEMA_MISMATCH_FIXED.md`  
**🚀 For quick steps:** `/QUICK_SUMMARY_SCHEMA_FIX.md`
