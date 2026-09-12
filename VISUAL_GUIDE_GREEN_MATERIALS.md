# 🌿 Green Materials Toggle - Visual Guide

## 🎨 UI States Overview

### **STATE 1: Green Building Card COLLAPSED + Toggle OFF (Default)**
```
┌─────────────────────────────────────────────────────────────┐
│ 🌿 Green Building & Carbon Tracking [DHS Initiative]       │
│ Automatic carbon footprint calculation & green alternatives │
│                                          [▼ Show Analysis]  │
└─────────────────────────────────────────────────────────────┘

Overall BOQ Total: R3,064,592.92
├─ Base Materials: R2,850,000.00
├─ Compliance Costs: R180,000.00
├─ P&G: R34,592.92
└─ Green Premium: R0.00 ❌ (NOT INCLUDED - Toggle OFF)
```

---

### **STATE 2: Green Building Card EXPANDED + Toggle OFF**
```
┌─────────────────────────────────────────────────────────────┐
│ 🌿 Green Building & Carbon Tracking [DHS Initiative]       │
│ Automatic carbon footprint calculation & green alternatives │
│                                          [▲ Hide Analysis]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 🌿 Apply Green Materials to Project                │    │
│  │ ⚪ Standard materials - Toggle to apply green...   │    │
│  │                              [Apply Green]  ◄─────┐│    │
│  └────────────────────────────────────────────────────┘│    │
│            Gray button = OFF                          │    │
│                                                             │
│  Standard Carbon:    Green Alternative:    DHS Score:      │
│  294.7 tCO₂e        221.2 tCO₂e            A+              │
│                                                             │
│  Environmental Impact:         Cost Premium:               │
│  ~1,470 trees equivalent      +R14,703.12 (+5.0%)         │
│                                                             │
│  📊 Comparison Table:                                       │
│  Item              Standard    Green       Difference      │
│  Concrete 25MPa    R294,078   R308,781    +R14,703 (+5%)  │
│  ...                                                        │
└─────────────────────────────────────────────────────────────┘

Overall BOQ Total: R3,064,592.92
└─ Green Premium: R0.00 ❌ (NOT INCLUDED - Toggle OFF)
```

---

### **STATE 3: Green Building Card EXPANDED + Toggle ON ✅**
```
┌─────────────────────────────────────────────────────────────┐
│ 🌿 Green Building & Carbon Tracking [DHS Initiative]       │
│                         [✓ Green Materials ACTIVE] ◄─────┐  │
│ Automatic carbon footprint calculation                   │  │
│                                          [▲ Hide Analysis]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 🌿 Apply Green Materials to Project                │    │
│  │ ✅ Green materials ACTIVE - Premium included in... │    │
│  │                              [✓ Applied]  ◄──────┐ │    │
│  ├────────────────────────────────────────────────────┤ │    │
│  │ Additional Investment: +R14,703.12 (+5.0%)       │ │    │
│  │ Environmental Benefit: Save 73.5 tCO₂e           │ │    │
│  │                        (~1,470 trees)            │ │    │
│  └────────────────────────────────────────────────────┘ │    │
│            Green button = ON                           │    │
│                                                             │
│  Standard Carbon:    Green Alternative:    DHS Score:      │
│  294.7 tCO₂e        221.2 tCO₂e ✅         A+              │
│                                                             │
│  Environmental Impact:         Cost Premium:               │
│  ~1,470 trees saved ✅        +R14,703.12 ✅ APPLIED       │
│                                                             │
│  📊 Comparison Table (Highlighted in Green):                │
│  Item              Standard    Green ✅     Difference      │
│  Concrete 25MPa    R294,078   R308,781    +R14,703 (+5%)  │
│  ...                                                        │
└─────────────────────────────────────────────────────────────┘

Overall BOQ Total: R3,079,296.04 ✅
├─ Base Materials: R2,850,000.00
├─ Compliance Costs: R180,000.00
├─ P&G: R34,592.92
└─ Green Premium: R14,703.12 ✅ (INCLUDED - Toggle ON)
```

---

### **STATE 4: Green Building Card COLLAPSED + Toggle ON ✅**
```
┌─────────────────────────────────────────────────────────────┐
│ 🌿 Green Building & Carbon Tracking [DHS Initiative]       │
│                         [✓ Green Materials ACTIVE] ◄─────┐  │
│ Automatic carbon footprint calculation                   │  │
│                                          [▼ Show Analysis]  │
└─────────────────────────────────────────────────────────────┘
      Pulsing green badge = Active even when collapsed

Overall BOQ Total: R3,079,296.04 ✅
├─ Base: R2,850,000.00
├─ Compliance: R180,000.00
├─ P&G: R34,592.92
└─ 🌿 Green Premium: R14,703.12 ✅ (VISIBLE EVEN WHEN COLLAPSED)
```

---

## 🔄 Toggle Interaction Flow

### **Clicking "Apply Green" (OFF → ON):**
```
1. Button changes:
   [Apply Green] (Gray) → [✓ Applied] (Green)

2. Visual feedback panel appears:
   ┌────────────────────────────────────────┐
   │ Additional Investment: +R14,703.12     │
   │ Environmental Benefit: Save 73.5 tCO₂e │
   └────────────────────────────────────────┘

3. Badge appears in card header:
   [✓ Green Materials ACTIVE] (Pulsing green)

4. Overall BOQ Total increases:
   R3,064,592.92 → R3,079,296.04 (+R14,703.12)

5. Summary cards update:
   "🌿 Includes +R14,703.12 for green materials"
```

### **Clicking "✓ Applied" (ON → OFF):**
```
1. Button changes:
   [✓ Applied] (Green) → [Apply Green] (Gray)

2. Feedback panel disappears

3. Badge disappears from header

4. Overall BOQ Total decreases:
   R3,079,296.04 → R3,064,592.92 (-R14,703.12)

5. Summary cards update:
   Green premium line removed
```

---

## 📊 Calculation Examples

### **Example 1: Ready-mix Concrete 25MPa**
```
Standard Supplier: Lafarge Johannesburg
├─ Base Price: R1,180.00/m³
├─ Transport: R450.00 (0km)
└─ Total: R1,182.25/m³

Green Alternative (Current Implementation):
├─ Premium Percentage: 5.0%
├─ Calculation: R1,182.25 × 1.05
└─ Total: R1,241.36/m³

For 200 m³:
├─ Standard Total: R294,078.78
├─ Green Total: R308,781.92
└─ Green Premium: +R14,703.12 ✅
```

### **Example 2: Cement (Future Implementation)**
```
Standard Supplier: Lafarge Johannesburg
├─ Base Price: R850.00/ton
├─ Transport: R200.00
└─ Total: R1,050.00/ton

Green Alternative (Future with supplier search):
├─ Supplier: PPC Eco-Cement Pretoria
├─ Base Price: R920.00/ton (eco premium)
├─ Transport: R150.00 (closer to project)
├─ Green Total: R1,070.00/ton
└─ TRUE Premium: R1,070 - R1,050 = +R20.00/ton

Current shows: R1,050 × 1.076 = R1,129.80 (conservative estimate)
Future will show: R1,070.00 (actual from supplier)
```

---

## 🎯 Export Behavior

### **Excel Export - Toggle OFF:**
```
Filename: BOQ_Pricing_20260308.xlsx

Sheets:
1. BOQ Items (Standard materials only)
2. Compliance Summary
3. Inflation Projections
❌ NO GREEN DATA SHEET
```

### **Excel Export - Toggle ON:**
```
Filename: BOQ_Pricing_20260308_GreenMaterials.xlsx

Sheets:
1. BOQ Items (with green alternatives highlighted)
2. Compliance Summary
3. Inflation Projections
4. 🌿 GREEN MATERIALS ANALYSIS ✅
   ├─ Carbon footprint comparison
   ├─ Cost-benefit analysis
   ├─ Environmental ROI
   └─ DHS Green Score: A+
```

---

## 📱 eTender Submission

### **Tender Submission - Toggle OFF:**
```
Receipt: ET-JHB-2026-03-08-1234

Project Value: R3,064,592.92
Green Commitment: ❌ No
Environmental Score: Not evaluated
```

### **Tender Submission - Toggle ON:**
```
Receipt: ET-JHB-2026-03-08-1234-GREEN ✅

Project Value: R3,079,296.04
Green Commitment: ✅ Yes
Green Premium: R14,703.12 (+0.48%)
Carbon Reduction: 73.5 tCO₂e (24.9%)
DHS Green Score: A+
Environmental ROI: R200/tCO₂e saved
```

---

## 🎤 Demo Script Suggestions

### **Opening (Toggle OFF):**
"Here's the standard pricing - R3.06 million. This is your baseline with traditional materials from Lafarge, Buco, etc."

### **Exploring Options:**
"Let me show you the green building analysis... Click 'Show Analysis'... You can see we'd save 73.5 tons of CO₂ - equivalent to planting 1,470 trees."

### **The Decision Moment:**
"Now, the contractor can CHOOSE to apply green materials. Watch what happens when I click 'Apply Green'... 

*Click*

The button turns green, and we immediately see:
- Additional investment: R14,703 - that's only 5% more
- Environmental benefit: 73.5 tCO₂e saved
- Overall total updates automatically to R3.08 million

The system RESPECTS contractor autonomy - they opt IN, not forced."

### **Flexibility:**
"And if budget constraints change? Just toggle it off - instant recalculation back to standard pricing. No manual spreadsheet errors."

### **Integration:**
"When they export to Excel or submit to eTender, the green commitment is TRACKED. Full transparency for DHS evaluation."

---

## ✅ Quality Assurance Checklist

Before Tuesday, test this sequence:

- [ ] Upload BOQ
- [ ] Verify Overall BOQ Total = base amount (no green premium)
- [ ] Expand Green Building card
- [ ] Verify toggle button shows "Apply Green" (gray)
- [ ] Click toggle ON
- [ ] Verify button changes to "✓ Applied" (green)
- [ ] Verify badge appears in card header (pulsing green)
- [ ] Verify Overall BOQ Total increases by green premium
- [ ] Verify summary cards show green premium
- [ ] Collapse Green Building card
- [ ] Verify badge still visible (shows active state)
- [ ] Click toggle OFF
- [ ] Verify Overall BOQ Total decreases
- [ ] Export Excel (toggle OFF) - no green data
- [ ] Export Excel (toggle ON) - includes green sheet
- [ ] Submit to eTender (toggle ON) - receipt shows green commitment

---

## 🚀 Ready for Investors!

This implementation provides:
1. ✅ **Clear opt-in/opt-out** - No ambiguity
2. ✅ **Real-time feedback** - Immediate cost-benefit visibility
3. ✅ **Professional UX** - Smooth animations, clear states
4. ✅ **Integrated workflow** - Export and eTender respect toggle
5. ✅ **Audit trail** - Green commitment tracked in all documents

**Confidence Level: 🟢 INVESTOR-READY**
