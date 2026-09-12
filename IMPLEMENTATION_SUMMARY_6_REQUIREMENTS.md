# ✅ ALL 6 REQUIREMENTS COMPLETED

## Summary of Changes

All 6 requirements have been successfully implemented:

### ✅ 1. Add contractor annual turnover to the top corner contractor card
**File:** `/src/app/components/Dashboard.tsx` (lines 404-431)

**What was added:**
- New line showing company annual turnover in the contractor profile card
- Displays turnover with BBBEE classification:
  - "Under R10M (EME)" for turnover = 0
  - "R15M (QSE)" for turnover between R10M-R50M
  - "R75M (Generic)" for turnover over R50M

**Example display:**
```
💰 Turnover: R15M (QSE)
```

---

### ✅ 2. Create a separate (Preliminaries & General) card that will auto-display the P&G totals in a collapsible state
**Files Created:** 
- `/src/app/components/PGCostsCard.tsx` (new component)

**Files Modified:**
- `/src/app/components/RegionalPricedBillView.tsx` (added import and component usage)

**What was added:**
- Standalone P&G card with amber/yellow theme (separate from compliance costs)
- Auto-displays by default (showPGCosts = true)
- Collapsible with expand/collapse button
- Shows:
  - Total P&G cost
  - Percentage of delivery total
  - Breakdown of 4 components (Site Establishment, Temporary Services, Time-Related, Health & Safety)
  - Educational section explaining what P&G costs are
  - Reference to ASAQS & JBCC standards

---

### ✅ 3. Remove the P&G card out of the South African Construction Compliance Costs card
**File:** `/src/app/components/ComplianceCostCalculator.tsx` (lines 281-316)

**What was changed:**
- Removed the P&G mini-card from the compliance costs grid
- Added comment explaining P&G costs are now in separate card
- Updated compliance costs to ONLY show:
  - NHBRC
  - CIDB
  - Statutory Labour
  - Testing
  - BBBEE
- Compliance total now correctly excludes P&G

**Before:** 6 cards (NHBRC, CIDB, Labour, Testing, BBBEE, **P&G**)  
**After:** 5 cards (NHBRC, CIDB, Labour, Testing, BBBEE) - P&G removed ✅

---

### ✅ 4. Add the P&G totals to the Overall BOQ Total card in BOQ Summary
**File:** `/src/app/components/RegionalPricedBillView.tsx` (lines 402-403, 418-419)

**What was changed:**
- Updated description text in BOQ Summary cards
- Changed from "Delivery + Compliance" to "Delivery + Compliance + P&G"
- Both the small summary card and large collapsed card updated

**Before:**
```
Delivery + Compliance
```

**After:**
```
Delivery + Compliance + P&G
```

---

### ✅ 5. Update Overall BOQ Total in BOQ regional Priced BOQ view (UI)
**File:** `/src/app/components/RegionalPricedBillView.tsx` (line 276, lines 492-494)

**What was changed:**
- Updated the Overall BOQ Total calculation formula
- Updated "Compliance Costs Hidden" badge text

**Calculation Formula:**
```typescript
// OLD (Wrong):
const overallBOQTotal = grandTotal + (complianceCosts?.total || 0);

// NEW (Correct):
const overallBOQTotal = grandTotal + (complianceCosts?.total || 0) + (complianceCosts?.preliminaries.total || 0);
```

**Badge text:**
```typescript
// OLD:
<Badge>Total Compliance Costs</Badge>

// NEW:
<Badge>Total Compliance Costs (excl. P&G)</Badge>
```

---

### ✅ 6. Update the Overall BOQ Total to excel and pdf priced BOQ documents
**File:** `/src/utils/exportBOQ.ts`

**What was changed:**

#### Interface Update (lines 6-21):
```typescript
interface ExportOptions {
  // ... other fields
  complianceCosts?: number; // Total compliance costs (NHBRC, CIDB, Statutory, Testing, BBBEE - excl. P&G)
  pgCosts?: number; // NEW: Preliminaries & General costs (site overhead, not compliance)
}
```

#### Excel Export (lines 27, 149-158):
```typescript
// Function signature updated
export function exportToExcel(options: ExportOptions): void {
  const { ..., complianceCosts = 0, pgCosts = 0 } = options;
  
// Summary section updated
['Grand Total (Delivery)', grandTotal],
['Total Transport Cost', totalTransportCost],
['Total Compliance Costs (excl. P&G)', complianceCosts], // Updated label
['Preliminaries & General (P&G)', pgCosts], // NEW LINE
['Overall BOQ Total', grandTotal + complianceCosts + pgCosts], // Updated calculation
```

#### PDF Export (lines 197, 368-386):
```typescript
// Function signature updated
export function exportToPDF(options: ExportOptions): void {
  const { ..., complianceCosts = 0, pgCosts = 0 } = options;

// Overall BOQ Total box updated
const overallBOQTotal = grandTotal + complianceCosts + pgCosts; // Updated calculation
doc.text('OVERALL BOQ TOTAL (Delivery + Compliance + P&G)', ...); // Updated label
```

#### RegionalPricedBillView Export Calls (lines 788-815):
```typescript
// Both Excel and PDF export calls updated to pass P&G costs
exportToExcel({
  pricedItems,
  projectSettings,
  grandTotal,
  totalTransportCost,
  totalSavings: totalOptimizedSavings,
  inflationRate: customInflationRate,
  complianceCosts: effectiveComplianceCosts?.total || 0,
  pgCosts: effectiveComplianceCosts?.preliminaries.total || 0 // NEW
})

exportToPDF({
  pricedItems,
  projectSettings,
  grandTotal,
  totalTransportCost,
  totalSavings: totalOptimizedSavings,
  inflationRate: customInflationRate,
  complianceCosts: effectiveComplianceCosts?.total || 0,
  pgCosts: effectiveComplianceCosts?.preliminaries.total || 0 // NEW
})
```

---

## File Summary

### Files Created:
1. `/src/app/components/PGCostsCard.tsx` - New standalone P&G cost card component

### Files Modified:
1. `/src/app/components/Dashboard.tsx` - Added annual turnover display in contractor card
2. `/src/app/components/RegionalPricedBillView.tsx` - Added P&G card, updated calculations, updated export calls
3. `/src/app/components/ComplianceCostCalculator.tsx` - Removed P&G card from compliance costs grid
4. `/src/utils/exportBOQ.ts` - Updated Excel and PDF exports to include P&G costs separately

---

## Expected Results

### Overall BOQ Total Calculation (Correct):

```
Grand Total (Delivery): R598,939.66
  ↳ Materials + Transport + Additional Fees

+ Compliance Costs (Regulatory): R42,000
  ↳ NHBRC + CIDB + Statutory + Testing + BBBEE

+ P&G (Project Overhead): R51,000
  ↳ Site Establishment + Temp Services + Time-Related + H&S

= Overall BOQ Total: R691,939.66 ✅
```

### UI Changes:
1. ✅ Contractor card now shows turnover (e.g., "💰 Turnover: R15M (QSE)")
2. ✅ Separate amber P&G card with full breakdown
3. ✅ Compliance Cost Calculator shows 5 cards (P&G removed)
4. ✅ BOQ Summary cards show "Delivery + Compliance + P&G"
5. ✅ Overall BOQ Total correctly calculates: Delivery + Compliance + P&G

### Export Changes:
1. ✅ Excel exports show separate rows for Compliance and P&G
2. ✅ PDF exports show Overall BOQ Total = Delivery + Compliance + P&G
3. ✅ Both exports correctly label compliance as "(excl. P&G)"

---

## Testing Checklist

- [ ] Verify contractor card shows annual turnover
- [ ] Verify P&G card displays separately from Compliance Costs
- [ ] Verify Compliance Cost Calculator no longer shows P&G card
- [ ] Verify BOQ Summary shows "Delivery + Compliance + P&G"
- [ ] Verify Overall BOQ Total = Grand Total + Compliance + P&G
- [ ] Export to Excel and verify P&G is listed separately
- [ ] Export to PDF and verify Overall BOQ Total includes P&G
- [ ] Verify all monetary values are correctly formatted

---

## Related Previous Changes

This builds on the previous fixes:
- Compliance costs now correctly exclude P&G (from previous session)
- Annual turnover field added to contractor registration (from previous session)
- Database migration file created for annual_turnover column (from previous session)

All 6 requirements have been successfully implemented! ✅
