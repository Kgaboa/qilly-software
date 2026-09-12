# Provincial Pricing Factors - Database Setup

## Overview

This directory contains the SQL schema and migration scripts for the **Provincial Pricing Factors** system in Qilly. The system stores base pricing indices/multipliers for all 9 South African provinces, enabling accurate regional price optimization based on transportation costs, supplier density, and market dynamics.

## Database Schema

### Table: `provincial_price_multipliers`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `province_code` | VARCHAR(2) | Two-letter province code (WC, GP, KZN, etc.) - UNIQUE |
| `province_name` | VARCHAR(50) | Full name of the province |
| `pricing_factor` | NUMERIC(4,2) | Multiplier applied to base prices (0.5 to 2.0) |
| `description` | TEXT | Explanation of the pricing factor |
| `created_at` | TIMESTAMPTZ | Timestamp when record was created |
| `updated_at` | TIMESTAMPTZ | Timestamp when record was last updated |

### Pricing Factor Logic

- **Base Pricing (1.0x)**: Western Cape (WC), Gauteng (GP), KwaZulu-Natal (KZN)
  - Major supply hubs with direct port access
  - Highest supplier competition
  - Lower transportation costs

- **Regional Adjustments (1.06x - 1.15x)**: Eastern Cape, Free State, Limpopo, Mpumalanga, Northern Cape, North West
  - Additional transportation distances
  - Fuel and logistics costs
  - Lower supplier competition
  - Regional market dynamics

## Setup Instructions

### 1. Create the Table

Run the SQL migration script in your Supabase SQL Editor:

```bash
# Copy the contents of provincial_pricing_factors.sql
# Paste into Supabase SQL Editor
# Execute the query
```

Or use the Supabase CLI:

```bash
supabase db push
```

### 2. Verify the Data

Check that all 9 provinces have been inserted:

```sql
SELECT province_code, province_name, pricing_factor 
FROM provincial_price_multipliers 
ORDER BY province_code;
```

Expected result: 9 rows (WC, GP, KZN, EC, FS, LP, MP, NC, NW)

### 3. Update the Frontend

The Provincial Pricing Page (`/src/app/pages/ProvincialPricingPage.tsx`) will automatically:
- Fetch pricing factors from the database on page load
- Fall back to hardcoded values if database is unavailable
- Display status badges indicating data source (Database vs. Fallback)

## Usage in Code

### Fetching Provincial Pricing Factors

```typescript
import { fetchProvincialPricingFactors } from '@/utils/databaseProvincialPricing';

const factors = await fetchProvincialPricingFactors();
// Returns array of ProvincialPricingFactor objects
```

### Fetching a Specific Province

```typescript
import { fetchProvincialPricingFactor } from '@/utils/databaseProvincialPricing';

const gpFactor = await fetchProvincialPricingFactor('GP');
// Returns single ProvincialPricingFactor object or null
```

### Updating a Pricing Factor

```typescript
import { updateProvincialPricingFactor } from '@/utils/databaseProvincialPricing';

await updateProvincialPricingFactor('NC', {
  pricing_factor: 1.16,
  description: 'Updated: Kimberley area - increased transport costs'
});
```

## Data Integrity

### Constraints

- `province_code` must be UNIQUE
- `pricing_factor` must be between 0.5 and 2.0
- All fields are NOT NULL

### Automatic Updates

- `updated_at` timestamp is automatically updated on any record change
- Trigger: `set_provincial_pricing_factors_updated_at`

## Current Provincial Factors (February 2026)

| Code | Province | Factor | Adjustment | Description |
|------|----------|--------|------------|-------------|
| WC | Western Cape | 1.00 | Base Rate | Cape Town metro - major supply hub |
| GP | Gauteng | 1.00 | Base Rate | Johannesburg/Pretoria metro - major supply hub |
| KZN | KwaZulu-Natal | 1.00 | Base Rate | Durban metro - major supply hub |
| EC | Eastern Cape | 1.08 | +8% | Port Elizabeth/East London - moderate transport |
| FS | Free State | 1.06 | +6% | Bloemfontein area - moderate transport |
| LP | Limpopo | 1.12 | +12% | Polokwane area - higher transport costs |
| MP | Mpumalanga | 1.07 | +7% | Nelspruit/Witbank area - moderate transport |
| NC | Northern Cape | 1.15 | +15% | Kimberley area - remote, higher transport |
| NW | North West | 1.09 | +9% | Rustenburg/Mahikeng - moderate to higher transport |

## Maintenance

### Updating Factors

Provincial pricing factors should be reviewed and updated quarterly based on:
- Fuel price changes
- Transportation cost fluctuations
- Market dynamics
- Supplier density changes

### Audit Trail

All changes are tracked via `updated_at` timestamp. For full audit history, consider adding an audit log table.

## Integration with Qilly

The provincial pricing factors integrate with:
- **BOQ Pricing Engine**: Applies factors to supplier base prices
- **Regional Pricing System**: Optimizes prices across all 9 provinces
- **Landed Cost Calculation**: Base price + Transport cost per province
- **Best Price Algorithm**: Finds optimal supplier per province

## Support

For questions or issues with the provincial pricing system:
- Check the Supabase logs for database errors
- Verify the table exists: `SELECT * FROM provincial_price_multipliers LIMIT 1;`
- Ensure RLS (Row Level Security) policies allow reads
- Contact the development team for factor updates