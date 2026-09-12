# Transport Cost Calculation Fix

## 🐛 Issue Identified

The **Transport Card** was showing **0% of total** because the total transport cost calculation was incorrect.

### Root Cause:

In `/src/app/components/RegionalPricedBillView.tsx` at line 85-87, the transport cost calculation was:

```javascript
const totalTransportCost = pricedItems.reduce((sum, item) => {
  return sum + (parseFloat(item.transportCost) || 0);
}, 0);
```

**Problem:** `item.transportCost` is the **per-unit** transport cost, but it was being summed **without multiplying by quantity**.

This meant:
- If an item had a transport cost of R5.00/unit and quantity of 100
- The old code added R5.00 to the total (wrong!)
- Should have added R500.00 (R5.00 × 100 units)

---

## ✅ Fix Applied

**File:** `/src/app/components/RegionalPricedBillView.tsx`  
**Line:** 85-87

**OLD CODE:**
```javascript
const totalTransportCost = pricedItems.reduce((sum, item) => {
  return sum + (parseFloat(item.transportCost) || 0);
}, 0);
```

**NEW CODE:**
```javascript
const totalTransportCost = pricedItems.reduce((sum, item) => {
  return sum + ((parseFloat(item.transportCost) || 0) * (parseFloat(item.quantity) || 0));
}, 0);
```

**Change:** Now correctly multiplies `transportCost × quantity` for each line item before summing.

---

## 📊 Impact

### **What's Fixed:**

1. **Transport Card** (Summary at top)
   - Now shows correct total transport cost
   - Percentage of total will be accurate (e.g., "8.5% of total" instead of "0%")

2. **Excel Export** - "Project Info" sheet
   - Total Transport Cost now accurate

3. **PDF Export** 
   - Transport Cost summary box shows correct amount

4. **CSV Export**
   - Summary section shows correct transport total

5. **Transport Cost Included** info card
   - Shows accurate "R[amount] in delivery costs calculated automatically"

### **What Remains Correct:**

- ✅ **Grand Total** - unchanged, already used `item.totalPrice` (which includes transport)
- ✅ **TOTAL CARRIED FORWARD** rows - use `categorySubtotals` which sum `item.totalPrice`
- ✅ **Individual line items** - display correctly (they show per-unit costs)
- ✅ **Regional Savings** - unaffected

---

## 🧪 Example Calculation

### Before Fix:

**BOQ with 3 items:**
| Item | Transport/Unit | Quantity | What Was Added to Total |
|------|---------------|----------|------------------------|
| 1    | R5.00         | 100      | R5.00 ❌               |
| 2    | R12.50        | 50       | R12.50 ❌              |
| 3    | R3.00         | 200      | R3.00 ❌               |
| **Total** | | | **R20.50** ❌ |

**Displayed:** "R20.50 (0% of total)" - clearly wrong!

### After Fix:

**BOQ with 3 items:**
| Item | Transport/Unit | Quantity | What's Added to Total |
|------|---------------|----------|-----------------------|
| 1    | R5.00         | 100      | R500.00 ✅            |
| 2    | R12.50        | 50       | R625.00 ✅            |
| 3    | R3.00         | 200      | R600.00 ✅            |
| **Total** | | | **R1,725.00** ✅ |

**Displayed:** "R1,725.00 (8.5% of total)" - correct! ✅

---

## 🔍 Verification Checklist

To verify the fix is working:

1. **Upload a BOQ** with multiple items
2. **Check Transport Card:**
   - Should show a meaningful amount (not tiny/zero)
   - Percentage should be 5-15% typically (varies by project)
3. **Download Excel:**
   - Open "Project Info" sheet
   - Check "Total Transport Cost" matches the card
4. **Download PDF:**
   - Check "TRANSPORT COST" summary box
   - Should match the web interface
5. **Check Grand Total:**
   - Should remain the same as before (no change expected)

---

## 💡 Why This Wasn't Noticed Earlier

The bug was subtle because:

1. **Grand Total was always correct** - it uses `item.totalPrice` which already includes transport × quantity
2. **Line items looked fine** - they show per-unit costs correctly
3. **Only the aggregate transport total** was wrong
4. The transport card showing "0% of total" could have been mistaken for "low transport costs" rather than a calculation bug

---

## 📝 Technical Notes

### Data Structure Clarification:

From `RegionalPricedBillItem` interface:
```typescript
interface RegionalPricedBillItem {
  code: string;
  name: string;
  quantity: string;        // e.g., "100"
  unit: string;            // e.g., "m³"
  baseUnitPrice: string;   // PER UNIT (e.g., "45.00")
  transportCost: string;   // PER UNIT (e.g., "5.00")
  landedUnitPrice: string; // PER UNIT (base + transport)
  additionalFees: string;  // PER UNIT (CIDB, profit, etc.)
  finalUnitPrice: string;  // PER UNIT (all costs included)
  totalPrice: string;      // TOTAL FOR LINE ITEM (finalUnitPrice × quantity)
  // ... other fields
}
```

**Key Point:** Most price fields are **per-unit**. Only `totalPrice` is the full line item total.

### Other Calculations That Are Correct:

```javascript
// ✅ Grand Total - uses totalPrice (already multiplied)
const grandTotal = pricedItems.reduce((sum, item) => {
  return sum + (parseFloat(item.totalPrice) || 0);
}, 0);

// ✅ Savings - already uses total savings per line item
const totalOptimizedSavings = pricedItems.reduce((sum, item) => {
  return sum + (parseFloat(item.savingsVsDistantSupplier || '0') || 0);
}, 0);

// ✅ Profit - breakdown already contains total amounts
const totalProfitAmount = pricedItems.reduce((sum, item) => {
  if (item.additionalFeesBreakdown?.profitMargin) {
    return sum + item.additionalFeesBreakdown.profitMargin;
  }
  return sum;
}, 0);
```

---

## ✅ Status

**Fix Status:** ✅ Complete  
**Testing Required:** Manual verification with real BOQ data  
**Breaking Changes:** None  
**Migration Needed:** None  

**Impact:** Positive - users will now see accurate transport cost totals and percentages!

---

**Fixed Date:** February 8, 2026  
**Fixed By:** AI Assistant
