# Qilly Pricing Breakdown Structure

## Complete Price Calculation Flow

For every BOQ item, Qilly calculates the final price through a transparent 4-stage process:

### **Stage 1: Base Price** (Supplier's Price)
- Raw supplier unit price from catalog
- Adjusted for provincial pricing factors
- Example: R85.00/bag

### **Stage 2: + Transport Cost** (Distance-Based Delivery)
- Calculated based on:
  - Distance from nearest supplier branch to project site (km)
  - Material type (Bulk/Standard/Lightweight)
  - Quantity ordered
- Example: R9.00/bag (5km × R8.50/km ÷ 50 bags = R9/bag)

**= Landed Cost (Base + Transport)**
- Example: R94.00/bag

### **Stage 3: + Additional Fees** (Project-Specific Multipliers)
Includes 4 components:
1. **CIDB Overhead** (2-10% based on grading)
   - GB1: 2% | GB2: 3% | GB3: 4% | GB4: 5% | GB5: 6%
   - GB6: 7% | GB7: 8% | GB8: 9% | GB9: 10%
   
2. **Duration Adjustment** (+5% to -3% based on project length)
   - ≤1 month: +5% (mobilization premium)
   - ≤3 months: +3%
   - ≤6 months: +1%
   - ≤12 months: 0%
   - ≤18 months: -1%
   - ≤24 months: -2%
   - >24 months: -3% (economies of scale)

3. **Machinery Factor** (-5% or +3%)
   - Owned machinery: -5% (cost savings)
   - Rented machinery: +3% (rental premium)

4. **Profit Margin** (10-25%, user-selected)
   - Typical: 15%
   - Applies to (Base + Transport + CIDB + Duration + Machinery)

- Example: R23.50/bag (25% additional on R94 landed cost)

### **Stage 4: Final Unit Price**
**Final Unit Price = Landed Cost + Additional Fees**
- Example: R117.50/bag

### **Total Price = Final Unit Price × Quantity**
- Example: R5,875.00 (R117.50 × 50 bags)

---

## Example Calculation Breakdown

### Project: 50 bags of cement in Johannesburg

```
Base Price:              R85.00/bag     (Supplier: Buco Johannesburg)
+ Transport:            +R9.00/bag     (5km delivery)
─────────────────────────────────────
= Landed Cost:           R94.00/bag

Additional Fees Breakdown:
• CIDB Overhead (GB4):   +R4.70/bag    (5% of R94)
• Duration (6 months):   +R0.99/bag    (1% of R94.70)
• Machinery (rented):    +R2.88/bag    (3% of R95.69)
• Profit Margin (15%):   +R14.93/bag   (15% of R98.57)
─────────────────────────────────────
Total Additional Fees:   +R23.50/bag

─────────────────────────────────────
FINAL UNIT PRICE:        R117.50/bag
× Quantity:              × 50 bags
═════════════════════════════════════
TOTAL PRICE:             R5,875.00
```

---

## Priced BOQ Table Columns

| Column | Description | Example | Color Code |
|--------|-------------|---------|------------|
| **Base Price** | Supplier's unit price | R85.00 | Black |
| **Transport** | Delivery cost per unit | +R9.00 | Orange |
| **Additional** | Fees (CIDB + Duration + Machinery + Profit) | +R23.50 | Purple |
| **Unit Price** | Final price per unit | R117.50 | Black (bold) |
| **Total Price** | Final unit price × quantity | R5,875.00 | Blue (bold) |

---

## CSV Download Format

The downloadable CSV includes all pricing stages:

```csv
"Item No","Description","Quantity","Unit","Supplier","Base Price","Transport Cost","Landed Cost","Additional Fees","Unit Price (Final)","Total Price","Distance (km)"
"1","Cement 42.5N - 50kg bag","50","bag","Buco","R85.00","R9.00","R94.00","R23.50","R117.50","R5,875.00","5km"
```

---

## Transparency Benefits

### For Contractors:
✅ **See exactly where every rand goes**
- Base supplier price
- Delivery cost impact
- Project overhead and markup breakdown

✅ **Make informed decisions**
- Compare base price vs. total landed cost
- Understand how distance affects total cost
- See profit margin impact

✅ **Justify pricing to clients**
- Detailed cost breakdown in reports
- Professional transparency
- Defendable pricing structure

### For Qilly:
✅ **Build trust through transparency**
- No hidden fees
- Clear calculation methodology
- Auditable pricing

✅ **Competitive differentiation**
- Most detailed pricing breakdown in SA construction
- Educational for contractors
- Professional presentation

---

## Technical Implementation

### Data Structure
```typescript
interface RegionalPricedBillItem {
  // Basic item info
  code: string;
  name: string;
  quantity: string;
  unit: string;
  
  // Pricing stages
  baseUnitPrice: string;           // Stage 1
  transportCost: string;            // Stage 2
  landedUnitPrice: string;          // Stage 1 + 2
  additionalFees: string;           // Stage 3
  finalUnitPrice: string;           // Final (all stages)
  totalPrice: string;               // finalUnitPrice × quantity
  
  // Additional details
  additionalFeesBreakdown?: {
    cidbOverhead: number;
    durationAdjustment: number;
    machineryAdjustment: number;
    profitMargin: number;
    totalAdditional: number;
    totalAdditionalAmount: number;
  };
  
  selectedSupplier: string;
  distance?: number;
  // ... other fields
}
```

### Calculation Order
```typescript
1. basePrice = getSupplierPrice(item, province)
2. transportCost = calculateTransport(distance, materialType, quantity)
3. landedCost = basePrice × quantity + transportCost
4. cidbFee = landedCost × cidbFactor
5. durationAdjustment = (landedCost + cidbFee) × durationFactor
6. machineryAdjustment = (landedCost + cidbFee + duration) × machineryFactor
7. profitMargin = (landedCost + all adjustments) × profitMarginPercent
8. finalPrice = landedCost + cidbFee + duration + machinery + profit
```

---

## Future Enhancements

### Phase 2: Interactive Breakdown
- Click "Additional Fees" to see popup with detailed breakdown
- Show percentage contribution of each component
- Visual pie chart of cost composition

### Phase 3: Scenario Comparison
- "What if" calculator for different profit margins
- Compare pricing with different CIDB gradings
- Show cost impact of project duration changes

### Phase 4: Historical Tracking
- Track price changes over time
- Show margin trends
- Alert on unusual fee increases

---

**Last Updated:** February 6, 2026
**Version:** 1.0
**Status:** ✅ Implemented - Additional Fees Column Active
