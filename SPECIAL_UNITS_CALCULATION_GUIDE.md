# 🧮 **QILLY SPECIAL UNITS CALCULATION GUIDE**

## Overview
Qilly handles special BOQ unit types that are common in South African construction billing. This document explains how each unit type is calculated.

---

## **1. PERCENTAGE (%) - NOT YET IMPLEMENTED**

### **What is it?**
Percentage-based items are calculated as a percentage of other items or sections.

### **Common Examples:**
- General site overheads (10% of total)
- Preliminary & General items (12.5% of works)
- Contingencies (5% of subtotal)
- Professional fees (8% of construction cost)
- Contractor's profit (15% of total)

### **How it SHOULD be calculated:**

```typescript
// Example: "Preliminaries and General - 12.5%"
// Unit: %
// Quantity: 12.5
// Base Amount: Sum of all measured work items

const measuredWorksTotal = calculateSectionTotal('Measured Works'); // R1,000,000
const percentageValue = 12.5;
const calculatedAmount = measuredWorksTotal * (percentageValue / 100);
// Result: R1,000,000 × 0.125 = R125,000
```

### **Current Qilly Behavior:**
❌ **NOT IMPLEMENTED** - Percentage units are treated as regular units and priced incorrectly.

### **Recommended Fix:**
```typescript
// In regionalPricingEngine.ts, add:

function handlePercentageUnit(item: BillItem, context: PricingContext): number {
  const unit = item.unit.toLowerCase().trim();
  
  if (unit === '%' || unit === 'percentage' || unit === 'percent') {
    // Get base amount (either from previous section total or specified in description)
    const percentageValue = parseFloat(item.quantity);
    
    // Parse description for base reference
    // e.g., "Preliminaries (12.5% of measured works)"
    const baseAmount = findBaseAmount(item, context);
    
    if (!baseAmount) {
      console.warn(`⚠️ Percentage item "${item.name}" has no base amount - using zero`);
      return 0;
    }
    
    const calculatedAmount = baseAmount * (percentageValue / 100);
    console.log(`   📊 PERCENTAGE CALCULATION:`);
    console.log(`      Base Amount: R${formatNumber(baseAmount)}`);
    console.log(`      Percentage: ${percentageValue}%`);
    console.log(`      Calculated: R${formatNumber(calculatedAmount)}`);
    
    return calculatedAmount;
  }
  
  return null; // Not a percentage unit
}

function findBaseAmount(item: BillItem, context: PricingContext): number {
  // Look for section totals in context
  // Parse item description for references like "of measured works", "of subtotal", etc.
  
  // Example logic:
  const description = item.description?.toLowerCase() || item.name.toLowerCase();
  
  if (description.includes('of measured works')) {
    return context.measuredWorksTotal || 0;
  }
  
  if (description.includes('of subtotal') || description.includes('of total')) {
    return context.currentSectionSubtotal || 0;
  }
  
  // Default: use running total up to this point
  return context.runningTotal || 0;
}
```

---

## **2. PROVISIONAL SUM (prov / prov sum) - PARTIALLY IMPLEMENTED**

### **What is it?**
A provisional sum is a fixed amount set aside for work that cannot be accurately measured at tender stage.

### **Common Examples:**
- "Provisional sum for rock excavation - prov sum" → R50,000
- "Electrical reticulation (prov) - prov" → R120,000
- "Testing and commissioning - provisional" → R35,000

### **How it is calculated:**

```typescript
// Example: "Rock excavation (provisional sum)"
// Unit: prov / prov sum / provisional sum
// Quantity: ALWAYS 1 (auto-set by Qilly)
// Rate: The provisional amount itself

const provisionalAmount = parseFloat(item.rate || item.description.match(/R\s*([\d,]+)/)?.[1]?.replace(/,/g, '') || '0');
const quantity = 1; // Always 1
const totalCost = provisionalAmount × quantity;
// Result: R50,000 × 1 = R50,000
```

### **Current Qilly Behavior:**
✅ **PARTIALLY IMPLEMENTED**

**What works:**
- Auto-sets quantity to 1 when unit is "prov", "prov sum", or "provisional sum"
- Recognizes the unit type during Excel upload

**What's missing:**
- Does NOT extract the provisional amount from the rate column
- Tries to price it like a material item (which fails)
- Returns R0 instead of the provisional amount

### **Current Implementation:**
```typescript
// In BillUpload.tsx (line 248-256)
if (field === 'unit') {
  const unitLower = value.toLowerCase().trim();
  const isPCSum = unitLower.includes('prime cost') || unitLower.includes('pc sum') || unitLower === 'pc';
  const isProvisionalSum = unitLower.includes('provisional sum') || unitLower === 'provisional sum' || unitLower === 'prov';
  
  if (isLumpSum || isPCSum || isProvisionalSum) {
    newItems[index].quantity = '1'; // ✅ Auto-set quantity to 1
  }
}
```

### **Recommended Fix:**
```typescript
// In regionalPricingEngine.ts, add special handling:

function handleProvisionalSum(item: BillItem): RegionalPricedBillItem | null {
  const unit = item.unit.toLowerCase().trim();
  
  if (unit === 'prov' || unit === 'prov sum' || unit.includes('provisional sum') || unit === 'provisional') {
    // Extract provisional amount from rate or description
    let provisionalAmount = 0;
    
    // First, try to get from rate field (if Excel has it)
    if (item.rate) {
      provisionalAmount = parseFloat(item.rate.toString().replace(/[R,\s]/g, ''));
    }
    
    // If no rate, try to extract from description
    if (!provisionalAmount && item.description) {
      const match = item.description.match(/R\s*([\d,]+)/);
      if (match) {
        provisionalAmount = parseFloat(match[1].replace(/,/g, ''));
      }
    }
    
    console.log(`   💰 PROVISIONAL SUM DETECTED`);
    console.log(`      Amount: R${formatNumber(provisionalAmount)}`);
    console.log(`      Quantity: 1 (fixed)`);
    
    return {
      ...item,
      quantity: '1',
      supplierPrices: [],
      selectedSupplier: 'Provisional Sum',
      baseUnitPrice: provisionalAmount.toFixed(2),
      transportCost: '0',
      transportCostPerUnit: '0',
      landedUnitPrice: provisionalAmount.toFixed(2),
      additionalFees: '0',
      finalUnitPrice: provisionalAmount.toFixed(2),
      totalPrice: provisionalAmount.toFixed(2),
      materialCost: provisionalAmount.toFixed(2),
      laborCost: '0',
      equipmentCost: '0',
    };
  }
  
  return null; // Not a provisional sum
}
```

---

## **3. PRIME COST SUM (PC / PC sum / prime cost) - PARTIALLY IMPLEMENTED**

### **What is it?**
A prime cost sum is a fixed amount allocated for materials/work to be supplied by a nominated supplier or specialist.

### **Common Examples:**
- "Floor tiles (PC sum) - pc" → R85,000
- "Sanitary fittings (prime cost) - pc sum" → R45,000
- "Electrical fixtures (PC) - pc" → R120,000

### **How it is calculated:**

```typescript
// Example: "Floor tiles (PC sum) - R85,000"
// Unit: pc / pc sum / prime cost
// Quantity: ALWAYS 1 (auto-set by Qilly)
// Rate: The prime cost amount

const primeCostAmount = parseFloat(item.rate || '0');
const quantity = 1; // Always 1
const totalCost = primeCostAmount × quantity;
// Result: R85,000 × 1 = R85,000

// IMPORTANT: Contractor may add handling/installation fee (10-15%)
const handlingFee = primeCostAmount * 0.10; // 10%
const totalWithFees = totalCost + handlingFee;
// Result: R85,000 + R8,500 = R93,500
```

### **Current Qilly Behavior:**
✅ **PARTIALLY IMPLEMENTED** (same as provisional sum)

**What works:**
- Auto-sets quantity to 1 when unit is "pc", "pc sum", or "prime cost"

**What's missing:**
- Does NOT extract the PC amount from the rate column
- Does NOT add contractor's handling/installation fee
- Returns R0 instead of the PC amount + fees

### **Recommended Fix:**
```typescript
function handlePrimeCostSum(item: BillItem, projectSettings: ProjectSettings): RegionalPricedBillItem | null {
  const unit = item.unit.toLowerCase().trim();
  
  if (unit === 'pc' || unit === 'pc sum' || unit.includes('prime cost')) {
    // Extract PC amount
    let pcAmount = 0;
    
    if (item.rate) {
      pcAmount = parseFloat(item.rate.toString().replace(/[R,\s]/g, ''));
    }
    
    if (!pcAmount && item.description) {
      const match = item.description.match(/R\s*([\d,]+)/);
      if (match) {
        pcAmount = parseFloat(match[1].replace(/,/g, ''));
      }
    }
    
    // Add contractor's handling fee (10% standard)
    const handlingFeePercentage = 10;
    const handlingFee = pcAmount * (handlingFeePercentage / 100);
    const totalWithFees = pcAmount + handlingFee;
    
    console.log(`   🏷️ PRIME COST SUM DETECTED`);
    console.log(`      PC Amount: R${formatNumber(pcAmount)}`);
    console.log(`      Handling Fee (${handlingFeePercentage}%): R${formatNumber(handlingFee)}`);
    console.log(`      Total: R${formatNumber(totalWithFees)}`);
    
    return {
      ...item,
      quantity: '1',
      supplierPrices: [],
      selectedSupplier: 'Prime Cost Sum',
      baseUnitPrice: pcAmount.toFixed(2),
      transportCost: '0',
      transportCostPerUnit: '0',
      landedUnitPrice: pcAmount.toFixed(2),
      additionalFees: handlingFee.toFixed(2),
      additionalFeesBreakdown: {
        handlingFee: handlingFeePercentage,
        totalAdditional: handlingFeePercentage,
        totalAdditionalAmount: handlingFee,
      },
      finalUnitPrice: totalWithFees.toFixed(2),
      totalPrice: totalWithFees.toFixed(2),
      materialCost: pcAmount.toFixed(2),
      laborCost: '0',
      equipmentCost: '0',
    };
  }
  
  return null;
}
```

---

## **4. UNKNOWN UNIT (?) - CURRENTLY HANDLED AS NORMAL**

### **What is it?**
Sometimes BOQ items have "?" as the unit when the quantity surveyor hasn't finalized the measurement unit yet.

### **Common Examples:**
- "Provisional item for unforeseen groundworks - ?" → Unit unknown
- "Allow for additional testing - ?" → To be confirmed

### **How it should be handled:**

```typescript
// Example: "Unforeseen groundworks - ?"
// Unit: ?
// Quantity: Should be in description or rate column
// Rate: Should be a lump sum amount

const unknownUnitAmount = parseFloat(item.rate || '0');
const totalCost = unknownUnitAmount;
// Result: Use the rate as-is
```

### **Current Qilly Behavior:**
⚠️ **TREATED AS REGULAR UNIT**
- Tries to price it like a material
- Usually fails and returns R0

### **Recommended Fix:**
```typescript
function handleUnknownUnit(item: BillItem): RegionalPricedBillItem | null {
  const unit = item.unit.trim();
  
  if (unit === '?' || unit === 'unknown' || unit === 'tbd' || unit === 'tbc') {
    // Try to extract amount from rate
    let amount = 0;
    
    if (item.rate) {
      amount = parseFloat(item.rate.toString().replace(/[R,\s]/g, ''));
    }
    
    if (!amount) {
      console.warn(`⚠️ Unknown unit item "${item.name}" has no rate - using zero`);
    }
    
    console.log(`   ❓ UNKNOWN UNIT DETECTED`);
    console.log(`      Using rate as lump sum: R${formatNumber(amount)}`);
    
    return {
      ...item,
      quantity: '1',
      unit: 'sum',
      supplierPrices: [],
      selectedSupplier: 'Unknown Unit (Lump Sum)',
      baseUnitPrice: amount.toFixed(2),
      transportCost: '0',
      transportCostPerUnit: '0',
      landedUnitPrice: amount.toFixed(2),
      additionalFees: '0',
      finalUnitPrice: amount.toFixed(2),
      totalPrice: amount.toFixed(2),
      materialCost: amount.toFixed(2),
      laborCost: '0',
      equipmentCost: '0',
    };
  }
  
  return null;
}
```

---

## **5. IMPLEMENTATION PRIORITY**

### **Phase 1: Critical (For Monday Investor Demo)**
✅ **Already working:**
- Lump sum (sum, ls, lump sum)
- Regular units (m³, m², kg, nr, m, etc.)

🔧 **MUST FIX before Monday:**
1. **Provisional Sum (prov)** - Extract rate from Excel
2. **Prime Cost (pc)** - Extract rate from Excel + add 10% handling fee

### **Phase 2: Important (Post-Investor Demo)**
3. **Percentage (%)** - Calculate based on section totals
4. **Unknown Unit (?)** - Treat as lump sum using rate

---

## **6. UPDATED PRICING ENGINE FLOW**

```typescript
// In regionalPricingEngine.ts

export function priceRegionalBill(...): RegionalPricedBillItem[] {
  const pricedItems: RegionalPricedBillItem[] = [];
  
  for (const item of unpricedItems) {
    // Step 1: Check for special units FIRST
    let specialItem = null;
    
    // Check provisional sum
    specialItem = handleProvisionalSum(item);
    if (specialItem) {
      pricedItems.push(specialItem);
      continue;
    }
    
    // Check prime cost sum
    specialItem = handlePrimeCostSum(item, projectSettings);
    if (specialItem) {
      pricedItems.push(specialItem);
      continue;
    }
    
    // Check percentage
    specialItem = handlePercentageUnit(item, context);
    if (specialItem) {
      pricedItems.push(specialItem);
      continue;
    }
    
    // Check unknown unit
    specialItem = handleUnknownUnit(item);
    if (specialItem) {
      pricedItems.push(specialItem);
      continue;
    }
    
    // Step 2: If not a special unit, use normal material pricing
    const normalPricedItem = priceNormalItem(item, projectSettings, context);
    pricedItems.push(normalPricedItem);
  }
  
  return pricedItems;
}
```

---

## **7. EXCEL UPLOAD CHANGES NEEDED**

To support these special units, the Excel parser needs to capture the RATE column:

```typescript
// In BillUpload.tsx (Excel parsing section)

// Update BillItem interface
export interface BillItem {
  code: string;
  name: string;
  description: string;
  quantity: string;
  unit: string;
  rate?: string; // ← ADD THIS FIELD
  isRateOnly?: boolean;
}

// Update Excel parsing to capture rate column
const rate = columnMap.rate !== -1 ? String(row[columnMap.rate] || '') : '';

const item: BillItem = {
  code: itemNo,
  name: description,
  description: description,
  quantity: qty,
  unit: unit,
  rate: rate, // ← CAPTURE RATE
  isRateOnly: isRateOnly,
};
```

---

## **8. TESTING EXAMPLES**

### **Test BOQ with Special Units:**

| Item No | Description | Qty | Unit | Rate | Expected Result |
|---------|-------------|-----|------|------|-----------------|
| 1.1 | Excavation in soft soil | 500 | m³ | - | R245/m³ (from suppliers) |
| 1.2 | Provisional sum for rock excavation | 1 | prov sum | R50,000 | R50,000 (fixed) |
| 2.1 | Face brickwork | 1000 | m² | - | R680/m² (from suppliers) |
| 2.2 | Sanitary fittings (PC sum) | 1 | pc | R85,000 | R93,500 (R85k + 10% handling) |
| 3.1 | Electrical reticulation | 1 | prov | R120,000 | R120,000 (fixed) |
| 4.1 | Preliminaries & General | 12.5 | % | - | 12.5% of measured works |
| 5.1 | Unforeseen works | 1 | ? | R25,000 | R25,000 (lump sum) |

### **Expected Grand Total:**
```
Materials (items 1.1, 2.1):     R802,500
Provisional Sums (1.2, 3.1):   R170,000
Prime Cost (2.2):               R93,500
Percentage (4.1):               ~R133,250 (12.5% of R1,066,000)
Unknown (5.1):                  R25,000
--------------------------------------
SUBTOTAL:                       R1,224,250
+ Profit (15%):                 R183,638
+ VAT (15%):                    R211,183
--------------------------------------
GRAND TOTAL:                    R1,619,071
```

---

## **✅ SUMMARY FOR INVESTOR PRESENTATION**

### **What Qilly Currently Does Well:**
✅ Regular units (m³, m², kg, nr, m, etc.)
✅ Lump sums (sum, ls, lump sum)
✅ Auto-detects special units and sets quantity to 1

### **What Needs Urgent Fix (Before Monday):**
🔧 Extract rate from Excel for prov/pc items
🔧 Add 10% handling fee for PC sums
🔧 Display special units correctly in results table

### **Future Enhancements:**
📈 Percentage-based calculations
📈 Unknown unit handling
📈 Context-aware base amount detection

---

**End of Special Units Calculation Guide**
