# Pricing Engine Fix: Remove Suppliers/Transport from Non-Material Items

**Date:** March 3, 2026  
**Critical Issue:** Qilly is incorrectly applying supplier pricing and transport costs to:
- Earthworks (should be labor + equipment only)
- P&G Professional Services (should be fee-based only)
- Labor-only items (should be labor rates only)

**Fix:** Use new `itemCategorization.ts` to determine which items get supplier/transport pricing

---

## Files to Modify

### 1. `/src/utils/pricingEngine.ts`

**Add imports at top:**

```typescript
import { allSupplierCatalogs, getAllSuppliers, type SupplierPrice } from './supplierCatalog';
import { calculateProvincialPrice, getProvinceByCode } from './provincialPricing';
import { enhancedSearchCatalog, type MatchResult } from './matching';
import { matchLaborRate, type LaborPricing } from '@/lib/boq/laborRates'; // ADD THIS
import { categorizeItem, type ItemCategorization } from './itemCategorization'; // ADD THIS
```

**Replace the main `priceBill` function (starting around line 250) with:**

```typescript
/**
 * Main pricing engine function
 * Processes an unpriced bill and returns a fully priced bill with supplier comparisons
 * Now uses item categorization to determine pricing method
 */
export function priceBill(unpricedItems: BillItem[], projectSettings?: ProjectSettings): PricedBillItem[] {
  const pricedItems: PricedBillItem[] = [];
  const allProvinces = ['GP', 'WC', 'KZN', 'EC', 'FS', 'MP', 'NW', 'LP', 'NC']; // All SA provinces
  
  console.log(`🔍 Pricing ${unpricedItems.length} items using intelligent categorization...`);
  
  for (const item of unpricedItems) {
    console.log(`\n📦 Processing: "${item.name}" (${item.quantity} ${item.unit})`);
    
    // ========================================================================
    // STEP 1: CATEGORIZE THE ITEM
    // ========================================================================
    const categorization = categorizeItem(item.code, item.name, item.unit);
    console.log(`  📊 Category: ${categorization.category}`);
    console.log(`  ℹ️  ${categorization.reason}`);
    console.log(`  ✓ Supplier: ${categorization.hasSupplier ? 'YES' : 'NO'}`);
    console.log(`  ✓ Transport: ${categorization.hasTransport ? 'YES' : 'NO'}`);
    console.log(`  ✓ Labor: ${categorization.hasLaborComponent ? 'YES' : 'NO'}`);
    console.log(`  ✓ Equipment: ${categorization.hasEquipmentComponent ? 'YES' : 'NO'}`);
    
    // ========================================================================
    // STEP 2: CHECK FOR SUMMARY ROWS
    // ========================================================================
    const itemNameLower = item.name.toLowerCase().trim();
    const isSummaryRow = itemNameLower.includes('total carried forward to summary') || 
                         itemNameLower.includes('total carried to summary') ||
                         itemNameLower.includes('carried forward to summary');
    
    if (isSummaryRow) {
      console.log(`  📋 SUMMARY ROW - will calculate after all items priced`);
      pricedItems.push({
        ...item,
        supplierPrices: [],
        selectedSupplier: 'Summary',
        selectedProvince: undefined,
        unitPrice: '0.00',
        totalPrice: '0.00',
      });
      continue;
    }
    
    // ========================================================================
    // STEP 3: VALIDATE QUANTITY
    // ========================================================================
    const quantityStr = item.quantity?.trim();
    if (!quantityStr || quantityStr === '') {
      console.log('  ⚠️  No quantity - skipping pricing');
      pricedItems.push({
        ...item,
        supplierPrices: [],
        selectedSupplier: 'N/A',
        selectedProvince: undefined,
        unitPrice: '0.00',
        totalPrice: '0.00',
      });
      continue;
    }
    
    const quantity = parseFloat(quantityStr) || 0;
    if (quantity === 0 && !item.isRateOnly) {
      console.log('  ⚠️  Zero quantity - skipping pricing');
      pricedItems.push({
        ...item,
        supplierPrices: [],
        selectedSupplier: 'N/A',
        selectedProvince: undefined,
        unitPrice: '0.00',
        totalPrice: '0.00',
      });
      continue;
    }
    
    // ========================================================================
    // STEP 4: PRICE BASED ON CATEGORY
    // ========================================================================
    
    // -------------------------------------------------------------------------
    // EARTHWORKS: Labor + Equipment (NO suppliers, NO transport)
    // -------------------------------------------------------------------------
    if (categorization.category === 'EARTHWORKS') {
      console.log(`  ⛏️  EARTHWORKS pricing (labor + equipment, NO suppliers)`);
      
      try {
        const laborPricing = await matchLaborRate(item.name, item.unit, quantity);
        
        if (laborPricing.matched) {
          const totalPrice = laborPricing.totalRate * quantity;
          
          console.log(`  ✅ Labor rate: R${laborPricing.laborRate.toFixed(2)}`);
          console.log(`  ✅ Equipment rate: R${laborPricing.equipmentRate.toFixed(2)}`);
          console.log(`  ✅ Total rate: R${laborPricing.totalRate.toFixed(2)}`);
          console.log(`  ✅ Total price: R${totalPrice.toFixed(2)} (${quantity} ${item.unit})`);
          
          pricedItems.push({
            ...item,
            supplierPrices: [], // NO SUPPLIERS!
            selectedSupplier: `Labor Rate (${laborPricing.tradeCategory})`,
            selectedProvince: undefined, // NO PROVINCE!
            unitPrice: laborPricing.totalRate.toFixed(2),
            totalPrice: totalPrice.toFixed(2),
          });
          continue;
        } else {
          console.log(`  ⚠️  No labor rate found - using default earthworks rate`);
          const defaultRate = 255; // R255/m³ default for earthworks
          const totalPrice = defaultRate * quantity;
          
          pricedItems.push({
            ...item,
            supplierPrices: [],
            selectedSupplier: 'Default Labor Rate',
            selectedProvince: undefined,
            unitPrice: defaultRate.toFixed(2),
            totalPrice: totalPrice.toFixed(2),
          });
          continue;
        }
      } catch (error) {
        console.error(`  ❌ Error fetching labor rate:`, error);
        // Fallback to default
        const defaultRate = 255;
        const totalPrice = defaultRate * quantity;
        pricedItems.push({
          ...item,
          supplierPrices: [],
          selectedSupplier: 'Default Labor Rate',
          selectedProvince: undefined,
          unitPrice: defaultRate.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
        });
        continue;
      }
    }
    
    // -------------------------------------------------------------------------
    // P&G PROFESSIONAL SERVICES: Fee-based (NO suppliers, NO transport)
    // -------------------------------------------------------------------------
    if (categorization.category === 'PG_PROFESSIONAL') {
      console.log(`  👔 P&G PROFESSIONAL pricing (fee-based, NO suppliers)`);
      
      // Try to match labor rate for professional services
      try {
        const laborPricing = await matchLaborRate(item.name, item.unit, quantity);
        
        if (laborPricing.matched) {
          const totalPrice = laborPricing.totalRate * quantity;
          
          console.log(`  ✅ Professional fee rate: R${laborPricing.totalRate.toFixed(2)}`);
          console.log(`  ✅ Total fee: R${totalPrice.toFixed(2)}`);
          
          pricedItems.push({
            ...item,
            supplierPrices: [], // NO SUPPLIERS!
            selectedSupplier: `Professional Fee`,
            selectedProvince: undefined,
            unitPrice: laborPricing.totalRate.toFixed(2),
            totalPrice: totalPrice.toFixed(2),
          });
          continue;
        } else {
          // Fallback: Estimate professional fee as percentage of construction cost
          console.log(`  ⚠️  No professional fee found - using default`);
          const defaultFee = 5000; // R5,000 default
          const totalPrice = defaultFee * quantity;
          
          pricedItems.push({
            ...item,
            supplierPrices: [],
            selectedSupplier: 'Professional Fee (Estimated)',
            selectedProvince: undefined,
            unitPrice: defaultFee.toFixed(2),
            totalPrice: totalPrice.toFixed(2),
          });
          continue;
        }
      } catch (error) {
        console.error(`  ❌ Error fetching professional fee:`, error);
        const defaultFee = 5000;
        const totalPrice = defaultFee * quantity;
        pricedItems.push({
          ...item,
          supplierPrices: [],
          selectedSupplier: 'Professional Fee (Estimated)',
          selectedProvince: undefined,
          unitPrice: defaultFee.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
        });
        continue;
      }
    }
    
    // -------------------------------------------------------------------------
    // P&G OVERHEAD: Percentage-based (NO suppliers, NO transport, NO labor)
    // -------------------------------------------------------------------------
    if (categorization.category === 'PG_OVERHEAD') {
      console.log(`  🏗️  P&G OVERHEAD pricing (percentage-based, NO suppliers)`);
      
      // P&G overhead is calculated as percentage of construction cost
      // For now, use a default value (will be calculated in compliance module)
      const defaultOverhead = 25000; // R25,000 default
      const totalPrice = defaultOverhead * quantity;
      
      pricedItems.push({
        ...item,
        supplierPrices: [], // NO SUPPLIERS!
        selectedSupplier: 'P&G Overhead',
        selectedProvince: undefined,
        unitPrice: defaultOverhead.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
      });
      continue;
    }
    
    // -------------------------------------------------------------------------
    // PURE LABOR: Labor rate only (NO suppliers, NO transport)
    // -------------------------------------------------------------------------
    if (categorization.category === 'LABOR') {
      console.log(`  👷 PURE LABOR pricing (labor rate only, NO suppliers)`);
      
      try {
        const laborPricing = await matchLaborRate(item.name, item.unit, quantity);
        
        if (laborPricing.matched) {
          const totalPrice = laborPricing.laborRate * quantity; // Labor only, no equipment
          
          console.log(`  ✅ Labor rate: R${laborPricing.laborRate.toFixed(2)}`);
          console.log(`  ✅ Total: R${totalPrice.toFixed(2)}`);
          
          pricedItems.push({
            ...item,
            supplierPrices: [], // NO SUPPLIERS!
            selectedSupplier: `Labor Only (${laborPricing.tradeCategory})`,
            selectedProvince: undefined,
            unitPrice: laborPricing.laborRate.toFixed(2),
            totalPrice: totalPrice.toFixed(2),
          });
          continue;
        } else {
          console.log(`  ⚠️  No labor rate found - using default`);
          const defaultRate = 200; // R200/unit default
          const totalPrice = defaultRate * quantity;
          
          pricedItems.push({
            ...item,
            supplierPrices: [],
            selectedSupplier: 'Default Labor Rate',
            selectedProvince: undefined,
            unitPrice: defaultRate.toFixed(2),
            totalPrice: totalPrice.toFixed(2),
          });
          continue;
        }
      } catch (error) {
        console.error(`  ❌ Error fetching labor rate:`, error);
        const defaultRate = 200;
        const totalPrice = defaultRate * quantity;
        pricedItems.push({
          ...item,
          supplierPrices: [],
          selectedSupplier: 'Default Labor Rate',
          selectedProvince: undefined,
          unitPrice: defaultRate.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
        });
        continue;
      }
    }
    
    // -------------------------------------------------------------------------
    // EQUIPMENT RENTAL: Rental rate only (NO suppliers, NO transport)
    // -------------------------------------------------------------------------
    if (categorization.category === 'EQUIPMENT') {
      console.log(`  🏗️  EQUIPMENT RENTAL pricing (rental rate only, NO suppliers)`);
      
      try {
        const laborPricing = await matchLaborRate(item.name, item.unit, quantity);
        
        if (laborPricing.matched && laborPricing.equipmentRate > 0) {
          const totalPrice = laborPricing.equipmentRate * quantity;
          
          console.log(`  ✅ Equipment rental rate: R${laborPricing.equipmentRate.toFixed(2)}`);
          console.log(`  ✅ Total: R${totalPrice.toFixed(2)}`);
          
          pricedItems.push({
            ...item,
            supplierPrices: [], // NO SUPPLIERS!
            selectedSupplier: `Equipment Rental`,
            selectedProvince: undefined,
            unitPrice: laborPricing.equipmentRate.toFixed(2),
            totalPrice: totalPrice.toFixed(2),
          });
          continue;
        } else {
          console.log(`  ⚠️  No equipment rate found - using default`);
          const defaultRate = 500; // R500/day default
          const totalPrice = defaultRate * quantity;
          
          pricedItems.push({
            ...item,
            supplierPrices: [],
            selectedSupplier: 'Equipment Rental (Estimated)',
            selectedProvince: undefined,
            unitPrice: defaultRate.toFixed(2),
            totalPrice: totalPrice.toFixed(2),
          });
          continue;
        }
      } catch (error) {
        console.error(`  ❌ Error fetching equipment rate:`, error);
        const defaultRate = 500;
        const totalPrice = defaultRate * quantity;
        pricedItems.push({
          ...item,
          supplierPrices: [],
          selectedSupplier: 'Equipment Rental (Estimated)',
          selectedProvince: undefined,
          unitPrice: defaultRate.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
        });
        continue;
      }
    }
    
    // -------------------------------------------------------------------------
    // MATERIALS: Supplier + Transport (ONLY category that uses suppliers!)
    // -------------------------------------------------------------------------
    if (categorization.category === 'MATERIAL' || categorization.category === 'MIXED') {
      console.log(`  📦 MATERIAL pricing (supplier + transport)`);
      
      // Search for item across all supplier catalogs
      console.log(`  🔎 Searching supplier catalogs...`);
      const matchedItems = searchSupplierCatalogs(item);
      console.log(`  ✓ Found ${matchedItems.length} potential matches`);
      
      if (matchedItems.length > 0) {
        // Get quotes from all suppliers across all provinces
        let bestQuote: SupplierQuote | null = null;
        let bestProvince = 'GP';
        let bestTotalPrice = Infinity;
        
        console.log(`  💰 Comparing prices across all 9 provinces...`);
        
        for (const province of allProvinces) {
          const provincialQuotes = getSupplierQuotesWithProvince(item, matchedItems, province);
          const bestProvinceQuote = selectBestSupplier(provincialQuotes);
          
          if (bestProvinceQuote) {
            const totalPrice = parseFloat(bestProvinceQuote.totalPrice);
            if (totalPrice < bestTotalPrice) {
              bestTotalPrice = totalPrice;
              bestQuote = bestProvinceQuote;
              bestProvince = province;
            }
          }
        }
        
        // Get all quotes for display (using best province)
        const supplierQuotes = getSupplierQuotesWithProvince(item, matchedItems, bestProvince);
        
        if (bestQuote) {
          console.log(`  ✅ BEST PRICE: ${bestQuote.supplier} in ${bestProvince} @ R${bestQuote.totalPrice}`);
          
          // If MIXED category, also add labor component
          if (categorization.category === 'MIXED') {
            console.log(`  👷 Adding labor component for mixed item...`);
            
            try {
              const laborPricing = await matchLaborRate(item.name, item.unit, quantity);
              
              if (laborPricing.matched) {
                const materialCost = parseFloat(bestQuote.totalPrice);
                const laborCost = laborPricing.laborRate * quantity;
                const totalCost = materialCost + laborCost;
                
                console.log(`  ✅ Material cost: R${materialCost.toFixed(2)}`);
                console.log(`  ✅ Labor cost: R${laborCost.toFixed(2)}`);
                console.log(`  ✅ Total cost: R${totalCost.toFixed(2)}`);
                
                pricedItems.push({
                  ...item,
                  supplierPrices: supplierQuotes,
                  selectedSupplier: `${bestQuote.supplier} + Labor`,
                  selectedProvince: bestProvince,
                  unitPrice: (materialCost / quantity + laborPricing.laborRate).toFixed(2),
                  totalPrice: totalCost.toFixed(2),
                });
                continue;
              }
            } catch (error) {
              console.warn(`  ⚠️  Could not fetch labor rate for mixed item, using material only`);
            }
          }
          
          // Pure material or mixed without labor match
          pricedItems.push({
            ...item,
            supplierPrices: supplierQuotes,
            selectedSupplier: bestQuote.supplier,
            selectedProvince: bestProvince,
            unitPrice: bestQuote.unitPrice,
            totalPrice: bestQuote.totalPrice,
          });
          continue;
        }
      }
      
      // Material not found in suppliers - flag as not available
      console.log(`  ❌ NOT AVAILABLE in supplier catalogs`);
      pricedItems.push({
        ...item,
        supplierPrices: [],
        selectedSupplier: 'Not Available',
        selectedProvince: undefined,
        unitPrice: '0.00',
        totalPrice: '0.00',
      });
      continue;
    }
    
    // -------------------------------------------------------------------------
    // SPECIAL ITEMS: P/S, PC, L/S, % (handled separately)
    // -------------------------------------------------------------------------
    if (categorization.category === 'SPECIAL') {
      console.log(`  ⭐ SPECIAL item type - using special handling`);
      
      // For now, mark as requiring manual input
      pricedItems.push({
        ...item,
        supplierPrices: [],
        selectedSupplier: 'Requires Manual Input',
        selectedProvince: undefined,
        unitPrice: '0.00',
        totalPrice: '0.00',
      });
      continue;
    }
    
    // -------------------------------------------------------------------------
    // UNKNOWN: Default fallback (shouldn't reach here)
    // -------------------------------------------------------------------------
    console.log(`  ⚠️  UNKNOWN category - defaulting to supplier search`);
    const matchedItems = searchSupplierCatalogs(item);
    
    if (matchedItems.length > 0) {
      // Try supplier pricing as fallback
      let bestQuote: SupplierQuote | null = null;
      let bestProvince = 'GP';
      let bestTotalPrice = Infinity;
      
      for (const province of allProvinces) {
        const provincialQuotes = getSupplierQuotesWithProvince(item, matchedItems, province);
        const bestProvinceQuote = selectBestSupplier(provincialQuotes);
        
        if (bestProvinceQuote) {
          const totalPrice = parseFloat(bestProvinceQuote.totalPrice);
          if (totalPrice < bestTotalPrice) {
            bestTotalPrice = totalPrice;
            bestQuote = bestProvinceQuote;
            bestProvince = province;
          }
        }
      }
      
      const supplierQuotes = getSupplierQuotesWithProvince(item, matchedItems, bestProvince);
      
      if (bestQuote) {
        pricedItems.push({
          ...item,
          supplierPrices: supplierQuotes,
          selectedSupplier: bestQuote.supplier,
          selectedProvince: bestProvince,
          unitPrice: bestQuote.unitPrice,
          totalPrice: bestQuote.totalPrice,
        });
        continue;
      }
    }
    
    // Absolute fallback
    pricedItems.push({
      ...item,
      supplierPrices: [],
      selectedSupplier: 'Not Available',
      selectedProvince: undefined,
      unitPrice: '0.00',
      totalPrice: '0.00',
    });
  }
  
  // Post-processing for summary rows and percentage items (keep existing logic)
  // ... (rest of existing post-processing code)
  
  return pricedItems;
}
```

---

## Testing Checklist

After implementing this fix, test the following:

### ✅ Test 1: Earthworks (Section D)
```
Item: D4.2 - Excavation in soft material
Expected:
  ✅ NO supplier selected
  ✅ NO transport cost
  ✅ Uses labor rate + equipment rate
  ✅ Unit price = R255/m³ (or from labor_rates table)
```

### ✅ Test 2: P&G Professional Services
```
Item: A1.5 - Submission of health and safety file
Expected:
  ✅ NO supplier selected
  ✅ NO transport cost
  ✅ Uses professional fee rate
  ✅ Unit price = fee-based (not material-based)
```

### ✅ Test 3: Pure Materials
```
Item: B1.3 - Concrete 25MPa
Expected:
  ✅ Supplier selected (e.g., AfriSam)
  ✅ Transport cost calculated
  ✅ Province shown (e.g., GP)
  ✅ Unit price includes transport
```

### ✅ Test 4: Mixed Items
```
Item: B2.1 - Face brick external walls 220mm (supply and install)
Expected:
  ✅ Supplier selected for bricks
  ✅ Transport cost for bricks
  ✅ PLUS labor cost for laying
  ✅ Unit price = material + labor
```

---

## Summary

**What This Fix Does:**
1. ✅ **Removes suppliers/transport from earthworks** (Section D) - now uses labor + equipment rates
2. ✅ **Removes suppliers/transport from P&G professional services** - now uses fee-based pricing
3. ✅ **Removes suppliers/transport from pure labor items** - now uses labor rates only
4. ✅ **Removes suppliers/transport from equipment rental** - now uses rental rates only
5. ✅ **ONLY applies suppliers/transport to actual material items**

**Impact:**
- ✅ More accurate pricing (no fake "supplier" for earthworks)
- ✅ Clearer categorization (user knows why item was priced that way)
- ✅ Faster processing (don't search suppliers for non-material items)
- ✅ Better compliance with construction industry standards

**Next Steps:**
1. Implement the `itemCategorization.ts` file (already done ✅)
2. Update `pricingEngine.ts` with the new logic (see code above)
3. Test all 4 scenarios
4. Deploy to SIT environment
5. Validate with real BOQs
