-- Provincial Pricing Factors - Demo/Test Data Seeding Script
-- This script demonstrates how provincial pricing factors affect actual product prices
-- Run this after creating the provincial_price_multipliers table

-- Display all provincial pricing factors
SELECT 
  province_code,
  province_name,
  pricing_factor,
  CASE 
    WHEN pricing_factor = 1.0 THEN 'Base Rate'
    ELSE '+' || ROUND((pricing_factor - 1.0) * 100, 1) || '%'
  END as adjustment,
  description
FROM provincial_price_multipliers
ORDER BY province_code;

-- Example: Calculate provincial prices for a sample product (Cement 50kg bag)
-- Base price in Gauteng (GP): R85.00

WITH base_product AS (
  SELECT 
    'Cement 50kg Bag' as product_name,
    'PPC' as supplier,
    85.00 as base_price_gp
)
SELECT 
  ppf.province_code,
  ppf.province_name,
  ppf.pricing_factor,
  bp.base_price_gp,
  ROUND(bp.base_price_gp * ppf.pricing_factor, 2) as provincial_price,
  ROUND((bp.base_price_gp * ppf.pricing_factor) - bp.base_price_gp, 2) as price_difference,
  CASE 
    WHEN ppf.pricing_factor = 1.0 THEN 'Base Rate'
    ELSE '+' || ROUND((ppf.pricing_factor - 1.0) * 100, 1) || '%'
  END as adjustment_percentage
FROM provincial_price_multipliers ppf
CROSS JOIN base_product bp
ORDER BY ppf.province_code;

-- Example: Calculate total cost difference for a project across provinces
-- Project requires 1000 bags of cement

WITH base_product AS (
  SELECT 
    'Cement 50kg Bag' as product_name,
    'PPC' as supplier,
    85.00 as base_price_gp,
    1000 as quantity
)
SELECT 
  ppf.province_code,
  ppf.province_name,
  bp.quantity,
  ROUND(bp.base_price_gp * ppf.pricing_factor, 2) as unit_price,
  ROUND(bp.quantity * bp.base_price_gp * ppf.pricing_factor, 2) as total_cost,
  ROUND((bp.quantity * bp.base_price_gp * ppf.pricing_factor) - (bp.quantity * bp.base_price_gp), 2) as cost_difference_vs_gp,
  CASE 
    WHEN ppf.pricing_factor = 1.0 THEN 'Base Pricing'
    ELSE 'Regional Adjustment'
  END as pricing_type
FROM provincial_price_multipliers ppf
CROSS JOIN base_product bp
ORDER BY total_cost;

-- Summary statistics across all provinces
SELECT 
  COUNT(*) as total_provinces,
  COUNT(CASE WHEN pricing_factor = 1.0 THEN 1 END) as base_pricing_provinces,
  COUNT(CASE WHEN pricing_factor > 1.0 THEN 1 END) as regional_adjustment_provinces,
  ROUND(AVG(pricing_factor), 3) as average_factor,
  ROUND(MIN(pricing_factor), 2) as lowest_factor,
  ROUND(MAX(pricing_factor), 2) as highest_factor,
  ROUND((MAX(pricing_factor) - MIN(pricing_factor)) * 100, 1) as max_price_spread_percent
FROM provincial_price_multipliers;

-- List provinces by pricing tier
SELECT 
  CASE 
    WHEN pricing_factor = 1.0 THEN 'Base Pricing (1.0x)'
    WHEN pricing_factor > 1.0 AND pricing_factor <= 1.08 THEN 'Low Adjustment (1.01-1.08x)'
    WHEN pricing_factor > 1.08 AND pricing_factor <= 1.12 THEN 'Moderate Adjustment (1.09-1.12x)'
    ELSE 'High Adjustment (>1.12x)'
  END as pricing_tier,
  COUNT(*) as province_count,
  STRING_AGG(province_code, ', ' ORDER BY province_code) as provinces,
  ROUND(AVG(pricing_factor), 3) as avg_factor_in_tier
FROM provincial_price_multipliers
GROUP BY 
  CASE 
    WHEN pricing_factor = 1.0 THEN 'Base Pricing (1.0x)'
    WHEN pricing_factor > 1.0 AND pricing_factor <= 1.08 THEN 'Low Adjustment (1.01-1.08x)'
    WHEN pricing_factor > 1.08 AND pricing_factor <= 1.12 THEN 'Moderate Adjustment (1.09-1.12x)'
    ELSE 'High Adjustment (>1.12x)'
  END
ORDER BY avg_factor_in_tier;

-- Cost comparison: Building a house in different provinces
-- Sample BOQ items with Gauteng base prices

WITH sample_boq AS (
  SELECT item, base_price_gp, quantity, unit FROM (VALUES
    ('Cement 50kg Bag', 85.00, 500, 'bag'),
    ('Bricks (per 1000)', 1250.00, 15, '1000'),
    ('Sand (per m3)', 180.00, 25, 'm3'),
    ('Steel Reinforcement (per ton)', 12500.00, 3, 'ton'),
    ('Roof Tiles (per m2)', 145.00, 120, 'm2')
  ) AS t(item, base_price_gp, quantity, unit)
)
SELECT 
  ppf.province_code,
  ppf.province_name,
  SUM(boq.quantity * boq.base_price_gp) as gp_total_cost,
  SUM(boq.quantity * boq.base_price_gp * ppf.pricing_factor) as provincial_total_cost,
  ROUND(SUM(boq.quantity * boq.base_price_gp * ppf.pricing_factor) - SUM(boq.quantity * boq.base_price_gp), 2) as additional_cost,
  ROUND(((SUM(boq.quantity * boq.base_price_gp * ppf.pricing_factor) / SUM(boq.quantity * boq.base_price_gp)) - 1) * 100, 1) || '%' as cost_increase_percent
FROM provincial_price_multipliers ppf
CROSS JOIN sample_boq boq
GROUP BY ppf.province_code, ppf.province_name, ppf.pricing_factor
ORDER BY provincial_total_cost;

-- Validation checks
-- Ensure all province codes are correct and factors are in valid range

SELECT 
  'Validation: Province Codes' as check_name,
  CASE 
    WHEN COUNT(DISTINCT province_code) = 9 THEN 'PASS ✓'
    ELSE 'FAIL ✗ - Expected 9 provinces, found ' || COUNT(DISTINCT province_code)
  END as result
FROM provincial_price_multipliers

UNION ALL

SELECT 
  'Validation: Pricing Factor Range' as check_name,
  CASE 
    WHEN MIN(pricing_factor) >= 0.5 AND MAX(pricing_factor) <= 2.0 THEN 'PASS ✓'
    ELSE 'FAIL ✗ - Factors out of range (0.5-2.0)'
  END as result
FROM provincial_price_multipliers

UNION ALL

SELECT 
  'Validation: No Duplicates' as check_name,
  CASE 
    WHEN COUNT(*) = COUNT(DISTINCT province_code) THEN 'PASS ✓'
    ELSE 'FAIL ✗ - Duplicate province codes found'
  END as result
FROM provincial_price_multipliers

UNION ALL

SELECT 
  'Validation: Updated Timestamps' as check_name,
  CASE 
    WHEN COUNT(*) = COUNT(CASE WHEN updated_at IS NOT NULL THEN 1 END) THEN 'PASS ✓'
    ELSE 'FAIL ✗ - Missing updated_at timestamps'
  END as result
FROM provincial_price_multipliers;

-- Show most recent updates
SELECT 
  province_code,
  province_name,
  pricing_factor,
  updated_at,
  AGE(NOW(), updated_at) as time_since_update
FROM provincial_price_multipliers
ORDER BY updated_at DESC
LIMIT 5;