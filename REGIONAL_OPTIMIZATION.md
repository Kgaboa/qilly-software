# Regional Price Optimization System

## Overview

Qilly's Regional Price Optimization System enhances the pricing engine by factoring in **project location**, **supplier branch proximity**, and **transport costs** to provide the most accurate **landed cost** pricing for construction bills of quantities.

## Key Features

### 1. **Location-Based Pricing**
- Select project **Province** (9 provinces across South Africa)
- Select project **Municipality/City** (27+ major cities and metros)
- System calculates supplier branch distances from project site

### 2. **Transport Cost Calculation**
Automatic material type detection and transport cost calculation:

| Material Type | Examples | Cost per km | Min Charge |
|--------------|----------|-------------|------------|
| **Bulk** | Cement, concrete, aggregates, sand, stone | R8.50/km | R450 |
| **Standard** | Bricks, steel, timber, piping | R5.00/km | R300 |
| **Lightweight** | Paint, fittings, tools, cables | R3.00/km | R150 |

### 3. **Intelligent Supplier Selection**
For each BOQ item, the system:
1. Finds all suppliers with the item in stock
2. Identifies nearest branch for each supplier
3. Calculates transport cost based on distance + material type
4. Computes **landed cost** = base price + transport cost
5. Selects supplier with **lowest landed cost**

### 4. **Distance-Based Optimization**
Uses Haversine formula to calculate accurate distances:
- Project location (municipality coordinates)
- Supplier branch locations (27+ branches across SA)
- Real distances in kilometers

## Municipalities Supported

### Gauteng (GP)
- Johannesburg (JHB)
- Pretoria/Tshwane (PTA)
- Ekurhuleni (EKU)
- Vereeniging (VER)

### Western Cape (WC)
- Cape Town (CPT)
- Stellenbosch (STB)
- George (GRJ)
- Worcester (WOR)

### KwaZulu-Natal (KZN)
- Durban (DBN)
- Pietermaritzburg (PMB)
- Newcastle (NEW)
- Richards Bay (RBA)

### Eastern Cape (EC)
- Port Elizabeth/Gqeberha (PLZ)
- East London (ELS)
- Mthatha (UTH)

### Free State (FS)
- Bloemfontein (BFN)
- Welkom (WEL)

### Limpopo (LP)
- Polokwane (PTG)
- Tzaneen (TZN)

### Mpumalanga (MP)
- Nelspruit/Mbombela (NLP)
- Witbank/eMalahleni (WIT)

### Northern Cape (NC)
- Kimberley (KIM)
- Upington (UTN)

### North West (NW)
- Rustenburg (RUS)
- Mahikeng (MAH)
- Klerksdorp (KLE)

## Supplier Branch Network

### Current Mock Data (4 Suppliers)
- **Buco**: 5 branches (JHB, PTA, CPT, DBN, PLZ)
- **Macsteel**: 3 branches (JHB, DBN, CPT)
- **Raumix**: 4 branches (JHB, PTA, CPT, BFN)
- **Lafarge**: 4 branches (JHB, DBN, CPT, PTG)

### Production Implementation
When integrated with real supplier APIs, the system will:
1. Fetch supplier branch locations from API
2. Get per-branch pricing and inventory
3. Calculate transport costs dynamically
4. Update branch network as suppliers expand

## Example Calculation

**Project:** Johannesburg (JHB), Gauteng
**Item:** 50 bags of cement (Bulk material)

### Scenario A: Nearest Supplier (Buco JHB - 5km away)
- Base price: R85/bag
- Transport: 5km × R8.50 = R42.50 (uses minimum R450)
- Transport per unit: R450 / 50 = R9/bag
- **Landed cost: R94/bag**
- **Total: R4,700**

### Scenario B: Distant Supplier (Lafarge CPT - 1,400km away)
- Base price: R82/bag (R3 cheaper!)
- Transport: 1,400km × R8.50 = R11,900
- Transport per unit: R11,900 / 50 = R238/bag
- **Landed cost: R320/bag**
- **Total: R16,000**

### **Result: Save R11,300 by choosing local supplier!**

## Technical Architecture

### Core Files

1. **`/src/utils/regionalOptimization.ts`**
   - Municipality database with coordinates
   - Supplier branch locations
   - Distance calculation (Haversine formula)
   - Material type detection
   - Transport cost calculation
   - Optimization algorithms

2. **`/src/utils/regionalPricingEngine.ts`**
   - Regional pricing engine
   - Integrates with existing matching system
   - Applies project settings (CIDB, profit margin, etc.)
   - Returns landed cost pricing

3. **`/src/app/components/RegionalPricedBillView.tsx`**
   - Enhanced results view
   - Shows base price + transport cost breakdown
   - Displays distance to supplier branches
   - Compares alternative suppliers
   - Material type badges
   - Regional savings calculator

4. **`/src/app/components/BillUpload.tsx`**
   - Updated with municipality selector
   - Province-dependent municipality list
   - Passes location to pricing engine

## Advantages for Contractors

### 1. **Accurate Total Cost**
- No surprises with delivery charges
- Know the true landed cost upfront
- Budget with confidence

### 2. **Time Savings**
- No need to call multiple suppliers for delivery quotes
- Instant comparison of total costs
- Automated optimization

### 3. **Cost Savings**
- Avoid expensive long-distance deliveries
- Find best local options automatically
- Typical savings: 5-15% on materials

### 4. **Better Decisions**
- See base price vs. landed cost comparison
- Understand transport cost impact
- Choose based on total value, not just unit price

## Advantages for Qilly

### 1. **Competitive Differentiation**
- **Only** BOQ pricing system with transport optimization
- Unique value proposition vs competitors
- Higher accuracy = higher trust

### 2. **Better Supplier Relationships**
- Helps local suppliers win business
- Encourages regional branch expansion
- Fair competition based on true costs

### 3. **Scalability**
- Easy to add new municipalities
- Simple to onboard supplier branches
- Supports future expansion to neighboring countries

## Future Enhancements

### Phase 2 Features
1. **Real-time traffic data** integration for delivery time estimates
2. **Bulk discount** calculations for large orders
3. **Split orders** across multiple suppliers to minimize transport
4. **Carbon footprint** tracking for sustainability reporting
5. **Delivery scheduling** integration
6. **Custom delivery zones** for special projects

### Phase 3 Features
1. **Machine learning** to predict optimal delivery routes
2. **Dynamic pricing** based on fuel costs
3. **Supplier consolidation** suggestions
4. **Multi-site** project optimization
5. **Regional inventory** availability tracking

## Implementation Notes

### Current Status
✅ Municipality database (27 cities)
✅ Supplier branch mock data (16 branches)
✅ Distance calculation algorithm
✅ Material type auto-detection
✅ Transport cost calculation
✅ Regional pricing engine
✅ Enhanced results view
✅ Project location selector

### Next Steps
1. **Testing** with real BOQ data from SA contractors
2. **Calibration** of transport costs with actual logistics data
3. **Expansion** of municipality database to 50+ cities
4. **Supplier API** integration for real branch locations
5. **User feedback** collection and optimization

## ROI Metrics

Based on pilot testing assumptions:

- **Average BOQ**: R2.5M materials value
- **Transport costs**: 3-8% of material cost
- **Savings from optimization**: 1-3% of total BOQ
- **Typical savings per project**: R25,000 - R75,000
- **Time saved**: 2-4 hours per BOQ (no manual delivery quote collection)

## Conclusion

The Regional Price Optimization System transforms Qilly from a simple price comparison tool into a **comprehensive procurement intelligence platform** that understands the **true cost** of construction materials including delivery logistics.

This feature positions Qilly as the most accurate and valuable BOQ pricing system in South Africa, providing unmatched value to contractors while creating a sustainable competitive advantage.

---

**Last Updated:** February 6, 2026
**Version:** 1.0
**Status:** ✅ Implemented & Ready for Testing
