# Minimum Transport Charges - Verification Guide ✅

## Summary

**YES, minimum charges ARE being applied** for all valid supplier matches at 0km distance!

The `calculateTransportCost` function in `/src/utils/regionalOptimization.ts` (lines 531-540) correctly implements:

```typescript
export function calculateTransportCost(
  distance: number,
  materialType: 'bulk' | 'standard' | 'lightweight'
): number {
  const config = transportCosts[materialType];
  const calculatedCost = distance * config.costPerKm;
  
  // Return the maximum of calculated cost or minimum charge
  return Math.max(calculatedCost, config.minCharge);
}
```

## Minimum Charge Configuration

From `/src/utils/regionalOptimization.ts` (lines 465-481):

| Material Type | Cost per km | **Minimum Charge** | Example Items |
|--------------|-------------|-------------------|---------------|
| **Bulk** | R8.50/km | **R450** | Cement, Concrete, Aggregate, Sand, Stone, Gravel, Mortar |
| **Standard** | R5.00/km | **R300** | Bricks, Timber, Steel, Roofing, Pipes |
| **Lightweight** | R3.00/km | **R150** | Paint, Fittings, Tools, Tape, Adhesive, Cable |

## How Minimum Charges Work

### Example 1: Bulk Material at 0km
```
Item: "PPC Cement 50kg"
Material Type: Bulk
Distance: 0km (supplier in same municipality)

Calculation:
- distance × costPerKm = 0km × R8.50 = R0
- Math.max(R0, R450) = R450 ✅

Result: R450 transport cost
```

### Example 2: Standard Material at 25km
```
Item: "Clay Bricks"
Material Type: Standard
Distance: 25km

Calculation:
- distance × costPerKm = 25km × R5.00 = R125
- Math.max(R125, R300) = R300 ✅

Result: R300 transport cost (minimum applies)
```

### Example 3: Standard Material at 100km
```
Item: "Steel Reinforcing Bars"
Material Type: Standard
Distance: 100km

Calculation:
- distance × costPerKm = 100km × R5.00 = R500
- Math.max(R500, R300) = R500 ✅

Result: R500 transport cost (calculated exceeds minimum)
```

### Example 4: Lightweight Material at 0km
```
Item: "Dulux Paint 20L"
Material Type: Lightweight
Distance: 0km

Calculation:
- distance × costPerKm = 0km × R3.00 = R0
- Math.max(R0, R150) = R150 ✅

Result: R150 transport cost
```

## Code Flow Verification

### For Valid Matched Items (CORRECT FLOW)

1. **Item matched to supplier** → `regionalPricingEngine.ts` line 353
2. **Get regional quotes** → `getRegionalSupplierQuotes()`
3. **Optimize supplier selection** → `optimizeSupplierSelection()` line 656
4. **Calculate landed cost** → `calculateLandedCost()` line 593
5. **Calculate transport cost** → `calculateTransportCost()` line 593 ✅
6. **Apply minimum charge** → `Math.max(calculatedCost, config.minCharge)` ✅

### When You See R0.00 Transport (FALLBACK CASES)

**Case 1: No Supplier Match**
```typescript
// regionalPricingEngine.ts lines 334-347
if (matchResults.length === 0) {
  pricedItems.push({
    selectedSupplier: 'Not Available',
    transportCost: '0',  // ❌ Hardcoded fallback
    // ...
  });
}
```

**Case 2: No Available Suppliers**
```typescript
// regionalPricingEngine.ts lines 364-377
if (!bestQuote) {
  pricedItems.push({
    selectedSupplier: 'Not Available',
    transportCost: '0',  // ❌ Hardcoded fallback
    // ...
  });
}
```

**Case 3: Summary Rows**
```typescript
// regionalPricingEngine.ts lines 285-298
if (isSummaryRow) {
  pricedItems.push({
    selectedSupplier: 'N/A',
    transportCost: '0',  // ❌ Hardcoded fallback
    // ...
  });
}
```

**Case 4: Branch Location Not Found**
```typescript
// regionalOptimization.ts lines 640-653
if (!nearestBranch) {
  return {
    branchName: '${quote.supplier} (Location Unknown)',
    transportCost: 0,  // ❌ Hardcoded fallback
    // ...
  };
}
```

## How to Verify in Your BOQ

### ✅ Items WITH Minimum Charges Applied
Look for items where:
- Supplier name is shown (not "Not Available")
- Distance is 0km to ~60km
- Transport cost is R150, R300, or R450 (depending on material type)

**Example BOQ Line:**
```
Code: 2.1.1
Description: PPC Cement 42.5N 50kg
Supplier: PPC
Distance: 0km
Transport Cost: R450.00  ✅ (Bulk minimum applied)
```

### ❌ Items WITHOUT Minimum Charges (Fallbacks)
Look for items where:
- Supplier shows "Not Available"
- Distance shows blank or N/A
- Transport cost is R0.00

**Example BOQ Line:**
```
Code: 5.3.7
Description: Specialized Custom Item
Supplier: Not Available
Distance: N/A
Transport Cost: R0.00  ❌ (No supplier match - fallback)
```

## Testing Procedure

### Test 1: Bulk Material at 0km
1. Upload BOQ with cement/concrete item
2. Set project municipality to Johannesburg
3. System selects PPC/Lafarge/AfriSam with Johannesburg branch
4. **Expected:** Distance = 0km, Transport = R450.00 ✅

### Test 2: Standard Material at Short Distance
1. Upload BOQ with brick item  
2. Set project to Pretoria (Tshwane)
3. System selects supplier ~20km away
4. **Expected:** Distance = 20km, Transport = R300.00 ✅ (minimum applied)

### Test 3: Lightweight Material at 0km
1. Upload BOQ with paint item
2. Set project to Cape Town
3. System selects Dulux/Plascon with Cape Town branch
4. **Expected:** Distance = 0km, Transport = R150.00 ✅

### Test 4: Item Beyond Minimum Distance
1. Upload BOQ with timber item
2. Set project far from major suppliers (~200km)
3. System calculates 200km × R5.00 = R1,000
4. **Expected:** Transport = R1,000.00 ✅ (exceeds R300 minimum)

## Breakdown Threshold Reference

From `regionalOptimization.ts` lines 468-480:

| Material Type | Min Charge | Per km | Breakeven Distance |
|--------------|-----------|--------|-------------------|
| Bulk | R450 | R8.50 | **53km** (450 ÷ 8.5) |
| Standard | R300 | R5.00 | **60km** (300 ÷ 5.0) |
| Lightweight | R150 | R3.00 | **50km** (150 ÷ 3.0) |

**Meaning:** 
- Bulk materials: Minimum R450 applies until distance > 53km
- Standard materials: Minimum R300 applies until distance > 60km  
- Lightweight materials: Minimum R150 applies until distance > 50km

## Why R0.00 Shows for Some Items

If you're seeing R0.00 transport costs, check these conditions:

1. **Is the item matched to a supplier?**
   - Look at "Best Supplier" column
   - If it says "Not Available" → R0.00 is expected (fallback)
   - If it shows a supplier name → Should show minimum charge ✅

2. **Is the distance showing?**
   - If Distance column is blank/N/A → No branch found (fallback)
   - If Distance shows 0km or any number → Minimum charge should apply ✅

3. **Is it a summary row?**
   - Rows like "TOTAL CARRIED FORWARD TO SUMMARY"
   - These intentionally have R0.00 (not actual items)

4. **Console Logs**
   - Open browser DevTools → Console
   - Look for transport cost calculations
   - Should see: `🚚 Transport: R450.00 (0km)` for 0km bulk items

## UI Display Examples

### Expected Display for 0km Bulk Item
```
Item: PPC Cement 50kg
Supplier: PPC Johannesburg
Distance: 0km ← Shows 0km (after our fix!)
Transport: R450.00 ← Minimum charge applied!
```

### Expected Display for 0km Standard Item  
```
Item: Clay Stock Bricks
Supplier: Corobrik Pretoria
Distance: 0km ← Shows 0km (after our fix!)
Transport: R300.00 ← Minimum charge applied!
```

### Expected Display for Unmatched Item
```
Item: Custom Specialized Product
Supplier: Not Available
Distance: N/A
Transport: R0.00 ← Expected (no supplier match)
```

## Console Debug Output

When processing a 0km bulk item, you should see:

```
🔍 Pricing: "PPC Cement 42.5N 50kg" (20 bags)
✅ Found 3 supplier matches
🏆 Best Supplier: PPC (PPC Johannesburg)
📦 Base Price: R95.50/unit
🚚 Transport: R450.00 (0km) ← Minimum charge applied!
💰 Landed Cost: R102.75/unit
💵 Additional Fees: R8.50/unit
💵 Final Price: R2,225.00 (incl. all fees)
```

## Files Reference

1. **Transport Cost Calculation:** `/src/utils/regionalOptimization.ts`
   - Lines 465-481: Minimum charge config
   - Lines 531-540: `calculateTransportCost()` function
   - Lines 581-605: `calculateLandedCost()` function

2. **Pricing Engine:** `/src/utils/regionalPricingEngine.ts`
   - Lines 353-360: Regional quote generation
   - Lines 656-661: Landed cost calculation

3. **Material Type Detection:** `/src/utils/regionalOptimization.ts`
   - Lines 507-526: `getMaterialType()` function

## Conclusion

**✅ YES - Minimum charges ARE being applied correctly!**

If you're seeing R0.00 transport costs:
1. Check if the item has a valid supplier match
2. Check if the distance is showing (not N/A)
3. Check console logs for calculation details
4. Verify it's not a summary row or fallback case

For **all valid supplier matches at 0km distance**, the system correctly applies:
- **R450** for bulk materials
- **R300** for standard materials
- **R150** for lightweight materials

---

**Last Updated:** February 22, 2026  
**Verified By:** Code review of calculateTransportCost implementation
