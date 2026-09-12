# Fix: Limpopo Missing from Provincial Pricing Factors

## Issue
Kgabo Contractor's operating provinces are Gauteng (GP), Western Cape (WC), and Limpopo (LP), but Limpopo was not appearing in the Provincial Pricing Factors table.

## Root Cause
The database SQL file (`EFFICIENT_PROVINCIAL_PRICING.sql`) had incorrect province short codes:
- **Limpopo**: Used `'LIM'` instead of `'LP'`
- **Mpumalanga**: Used `'MPU'` instead of `'MP'`

The rest of the codebase (hardcoded fallback data and province mapping) uses the correct standard codes `'LP'` and `'MP'`, causing a mismatch.

## Fix Applied
Updated `/EFFICIENT_PROVINCIAL_PRICING.sql` line 81-82:

### Before:
```sql
('limpopo', 'Limpopo', 'LIM', 1.06, 'Polokwane', '+6% - Rural delivery, lower volume'),
('mpumalanga', 'Mpumalanga', 'MPU', 1.04, 'Nelspruit', '+4% - Proximity to Gauteng, moderate volume'),
```

### After:
```sql
('limpopo', 'Limpopo', 'LP', 1.06, 'Polokwane', '+6% - Rural delivery, lower volume'),
('mpumalanga', 'Mpumalanga', 'MP', 1.04, 'Nelspruit', '+4% - Proximity to Gauteng, moderate volume'),
```

## Action Required
You need to run the updated SQL in your Supabase database to fix the existing data:

1. Go to your Supabase Dashboard → SQL Editor
2. Run this update query:

```sql
-- Update Limpopo short_name from LIM to LP
UPDATE provincial_price_multipliers 
SET short_name = 'LP', last_updated = NOW() 
WHERE province_code = 'limpopo';

-- Update Mpumalanga short_name from MPU to MP
UPDATE provincial_price_multipliers 
SET short_name = 'MP', last_updated = NOW() 
WHERE province_code = 'mpumalanga';

-- Verify the updates
SELECT province_code, province_name, short_name, multiplier 
FROM provincial_price_multipliers 
ORDER BY short_name;
```

## Expected Result
After running the update, you should see all 9 provinces with correct codes:
- EC (Eastern Cape) - 1.08x
- FS (Free State) - 1.05x
- GP (Gauteng) - 1.00x
- KZN (KwaZulu-Natal) - 1.03x
- **LP (Limpopo)** - 1.06x ✅ Fixed
- **MP (Mpumalanga)** - 1.04x ✅ Fixed
- NC (Northern Cape) - 1.12x
- NW (North West) - 1.07x
- WC (Western Cape) - 1.05x

## Verification
After updating the database, refresh the Provincial Pricing page and verify:
1. Limpopo (LP) appears in the Provincial Pricing Factors table
2. Kgabo Contractor can see all three operating provinces: GP, WC, and LP
3. All provinces use the standard 2-letter codes

## Files Changed
- `/EFFICIENT_PROVINCIAL_PRICING.sql` - Fixed province short codes

## Related Files (No Changes Needed)
- `/src/utils/provincialPricing.ts` - Already using correct 'LP' and 'MP' codes
- `/src/app/pages/ProvincialPricingPage.tsx` - Province mapping already correct
- `/src/utils/databaseProvincialPricing.ts` - Fetches data correctly, now will match
