# Qilly Compliance Cost Calculator - Testing Guide & Feature Access

## 🎯 Quick Answer: Which Tier Gets Compliance Features?

### **For DHS/Government Users (Buyers):**
✅ **ALL FEATURES ARE FREE** - Including Compliance Cost Calculator
- The Compliance Cost Calculator is a **CORE QILLY FEATURE** for all government/DHS users
- No payment required - fully accessible in demo mode
- Automatically displayed when processing any BOQ

### **For Suppliers (Sellers):**
Compliance features depend on subscription tier:

| Feature | Free | Professional | Enterprise | Custom |
|---------|------|--------------|------------|--------|
| **Compliance Cost Calculator Display** | ✅ View Only | ✅ View Only | ✅ View Only | ✅ View Only |
| **SANS 1200 Compliance Data** | ❌ | ❌ | ✅ | ✅ |
| **NBR Alignment Tracking** | ❌ | ❌ | ✅ | ✅ |
| **AGRÉMENT Certification Integration** | ❌ | ❌ | ✅ | ✅ |
| **BBBEE Status Verification** | ❌ | ❌ | ✅ | ✅ |
| **POPIA Compliance Features** | ❌ | ❌ | ✅ | ✅ |
| **Anti-Corruption Verification** | ❌ | ❌ | ✅ | ✅ |
| **Priority on DHS Projects** | ❌ | ❌ | ✅ | ✅ |

**Bottom Line for DHS:** You get EVERYTHING for free as a government buyer. Supplier tiers only affect what suppliers can advertise/prove about their products.

---

## 📋 How to Test the Compliance Cost Calculator

### **Method 1: Quick Test (5 minutes)**

#### **Step 1: Navigate to the Dashboard**
1. Open the Qilly app
2. You should see the main dashboard with "Upload Bill of Quantities" section

#### **Step 2: Create a Sample BOQ**
Use the manual entry table to create a simple test BOQ:

| Item Code | Description | Quantity | Unit |
|-----------|-------------|----------|------|
| A.1.1.1 | Excavation in soft soil | 100 | m³ |
| B.2.3.4 | Ready-mix concrete 25MPa | 50 | m³ |
| C.3.2.1 | Face bricks | 10000 | nr |
| D.4.1.2 | Steel reinforcement Y12 | 500 | kg |
| E.5.3.1 | Roof tiles concrete | 500 | m² |

#### **Step 3: Configure Project Settings**
In the "Project Settings" section, enter:
- **Province:** Gauteng (GP)
- **Municipality:** Johannesburg (JHB)
- **Profit Margin:** 15%
- **CIDB Grading:** GB4
- **Project Duration:** 6 months
- **Machinery:** Rented

#### **Step 4: Process the BOQ**
1. Click "Process Bill of Quantities"
2. Wait ~3-5 seconds for processing
3. You'll be redirected to the results page

#### **Step 5: View Compliance Costs**
1. Scroll down past the BOQ pricing table
2. You should see: **"South African Construction Compliance Costs"**
3. Click to expand/view the Compliance Cost Calculator

#### **Expected Results:**
✅ **6 Compliance Categories Displayed:**
1. NHBRC Compliance (green checkmark)
2. CIDB Registration (green checkmark or red warning if contractor grade insufficient)
3. Statutory Labour Costs (green checkmark)
4. Quality Testing (green checkmark)
5. BBBEE Verification (green checkmark)
6. Preliminaries & General (green checkmark)

✅ **Total Compliance Costs:** Should show Rands amount + percentage of project value

✅ **Detailed Breakdown Available:** Click "Show Detailed Breakdown" to see:
- Quality testing schedule (table with SANS standards)
- Complete cost breakdown with regulations cited
- Data sources & accuracy disclaimer

---

### **Method 2: Realistic DHS Housing Project Test (15 minutes)**

#### **Test Scenario:** 100-Unit RDP Housing Project

**Step 1: Upload Sample BOQ**
Create a more comprehensive BOQ representing a real housing project:

```
A. EARTHWORKS
A.1.1.1 | Excavation in soft soil | 500 | m³
A.1.2.3 | Backfilling with selected material | 300 | m³
A.1.3.2 | Compaction of subgrade | 2000 | m²

B. CONCRETE WORK
B.2.1.1 | Blinding concrete 10MPa | 50 | m³
B.2.3.4 | Ready-mix concrete 25MPa (foundations) | 200 | m³
B.2.3.5 | Ready-mix concrete 30MPa (slabs) | 300 | m³

C. BRICKWORK
C.3.2.1 | Face bricks | 150000 | nr
C.3.2.5 | Common bricks (internal) | 80000 | nr
C.3.4.1 | Mortar for brickwork | 100 | m³

D. STEEL REINFORCEMENT
D.4.1.2 | Steel reinforcement Y12 | 15000 | kg
D.4.1.3 | Steel reinforcement Y16 | 8000 | kg

E. ROOFING
E.5.3.1 | Roof tiles concrete | 5000 | m²
E.5.4.2 | Roof trusses (timber) | 100 | lump sum

F. WINDOWS & DOORS
F.6.1.1 | Aluminum windows 1200x1200 | 200 | nr
F.6.2.3 | Wooden doors 813x2032 | 300 | nr

G. PLUMBING
G.7.1.2 | 110mm PVC sewer pipes | 1500 | m
G.7.2.4 | Hot water cylinders 150L | 100 | nr

H. ELECTRICAL
H.8.1.3 | Distribution boards 8-way | 100 | nr
H.8.2.5 | Electrical wiring complete | 100 | lump sum
```

**Step 2: Project Settings**
- **Province:** Eastern Cape (EC) ← Test provincial pricing adjustments
- **Municipality:** Nelson Mandela Bay (NMB)
- **Profit Margin:** 12% ← Lower for government projects
- **CIDB Grading:** GB5 ← Higher grade for larger project
- **Duration:** 12 months
- **Machinery:** Rented

**Step 3: Process & Analyze**

**Expected Results for 100-Unit Project:**
- **BOQ Total:** ~R15M - R18M (depending on suppliers)
- **Compliance Costs:** ~R600K - R750K (4-5% of project)

**Breakdown:**
1. **NHBRC:** R240K - R280K (100 units × enrollment + inspections + insurance)
2. **CIDB:** R2,500 (GB5 registration + annual)
3. **Statutory Labour:** R120K - R150K (13.75% of ~R1M labour)
4. **Quality Testing:** R60K - R80K (concrete, soil, bricks, geotechnical)
5. **BBBEE:** R20K - R25K (QSE verification)
6. **Preliminaries:** R160K - R215K (site setup + 12-month services)

**Step 4: Validate CIDB Compliance**
- ✅ If contractor is GB5: Green checkmark, all compliant
- ⚠️ If contractor is GB3: Red warning "Contractor grade GB3 insufficient for R15M project - Required minimum: GB5"

---

### **Method 3: Test Provincial Variations (Advanced)**

**Test the same BOQ in different provinces to see cost multipliers:**

| Province | Multiplier | Expected Compliance Cost (for R15M project) |
|----------|------------|---------------------------------------------|
| **Gauteng** | 1.0 | R650K (baseline) |
| **Western Cape** | 1.05 | R682K (+5%) |
| **KwaZulu-Natal** | 0.95 | R617K (-5%) |
| **Eastern Cape** | 0.85 | R552K (-15%) |
| **Limpopo** | 0.80 | R520K (-20%) |

**How to Test:**
1. Process the same BOQ 3 times
2. Change only the province setting each time
3. Compare compliance costs - should see differences in Testing & Preliminaries categories
4. Statutory rates (UIF, SDL, COIDA) should NOT change (they're fixed by law)

---

### **Method 4: Test CIDB Non-Compliance Detection**

**Purpose:** Verify that Qilly prevents irregular expenditure by flagging unqualified contractors

**Test Cases:**

#### **Case 1: Contractor Too Small**
- **Project Value:** R15M
- **Contractor Grade:** GB3 (max R2M)
- **Expected Result:** 🚨 RED WARNING
  - "Contractor grade GB3 insufficient for R15,000,000 project"
  - "Required minimum: GB5"
  - "This bid will be rejected as non-compliant"

#### **Case 2: Borderline Compliance**
- **Project Value:** R1.9M
- **Contractor Grade:** GB3 (max R2M)
- **Expected Result:** ✅ GREEN - Compliant (within threshold)

#### **Case 3: Large Project**
- **Project Value:** R100M
- **Contractor Grade:** GB7 (max R200M)
- **Expected Result:** ✅ GREEN - Compliant

**How to Test:**
1. Upload same BOQ
2. Change **CIDB Grading** in project settings
3. Process and check for red warnings in Compliance Cost Calculator

---

## 🔍 What to Look For (Quality Checklist)

### ✅ **Visual Checks:**
- [ ] Compliance Cost Calculator displays automatically (no errors)
- [ ] All 6 category cards visible (NHBRC, CIDB, Statutory, Testing, BBBEE, P&G)
- [ ] Each card shows breakdown (enrollment, fees, percentages)
- [ ] CIDB shows green checkmark OR red warning (context-dependent)
- [ ] Total compliance costs displayed (Rands + % of project)
- [ ] "Show Detailed Breakdown" button works
- [ ] Testing schedule table displays with SANS standards
- [ ] Regulations cited (Act numbers) in breakdown table
- [ ] Data sources disclaimer visible at bottom

### ✅ **Calculation Checks:**
- [ ] NHBRC costs scale with number of units (if housing project)
- [ ] CIDB grade correctly matched to project value
- [ ] Statutory costs = 13.75% of labour (check math)
- [ ] Testing costs reasonable (not zero, not excessive)
- [ ] BBBEE costs match company turnover tier (EME/QSE/Generic)
- [ ] Preliminaries scale with project duration and value
- [ ] Total = sum of all 6 categories (verify math)

### ✅ **Provincial Adjustment Checks:**
- [ ] Testing costs vary by province
- [ ] Preliminaries vary by province
- [ ] Statutory costs DO NOT vary (they're fixed by law)
- [ ] NHBRC/CIDB fees DO NOT vary (same nationwide)

### ✅ **Error Handling Checks:**
- [ ] No console errors (check browser DevTools)
- [ ] No TypeScript errors (check terminal)
- [ ] Loads in demo mode (localStorage)
- [ ] Loads in production mode (Supabase connected)
- [ ] Works on mobile (responsive design)

---

## 🐛 Troubleshooting

### **Issue: Compliance Calculator Not Showing**

**Possible Causes:**
1. ❌ BOQ not processed yet (must click "Process Bill of Quantities" first)
2. ❌ Scrolled too far down (calculator is below BOQ pricing table)
3. ❌ Accidentally clicked "Hide Compliance Costs" button

**Solution:**
- Process a BOQ
- Scroll to bottom of results page
- Click "Show Compliance Costs" button if hidden

---

### **Issue: CIDB Always Shows Green (No Red Warnings)**

**Possible Causes:**
1. ❌ Contractor grade not set in project settings
2. ❌ Contractor grade too high for test (try GB1 or GB2 with R10M project)

**Solution:**
- Set CIDB Grading to **GB2** (max R650K)
- Create a BOQ worth **R5M+**
- Process → Should show red warning

---

### **Issue: Compliance Costs Seem Too High/Low**

**Validation:**
- **NHBRC:** R850-R1,200 per unit + R2,250 inspections + R1,800 insurance = R4,850/unit for RDP
- **Statutory:** 13.75% of labour (typically 35% of project value)
- **Testing:** ~0.5-1% of project value
- **Preliminaries:** 15-25% of project value (varies by duration)

**If costs still seem wrong:**
- Check browser console for calculation errors
- Verify project parameters (value, units, duration)
- Compare to manual QS estimate (should be 85-95% match)

---

### **Issue: Provincial Multipliers Not Working**

**Test:**
1. Process BOQ in **Gauteng** → Note compliance total
2. Process same BOQ in **Limpopo** → Should be ~20% lower
3. If same cost → Check console for errors

**Expected Behavior:**
- Only **Testing** and **Preliminaries** should change
- NHBRC, CIDB, Statutory, BBBEE should stay constant

---

## 📊 Sample Test Results (For Validation)

### **Test Project: 100-Unit RDP Housing (R15M)**

**Province:** Gauteng  
**Duration:** 12 months  
**CIDB:** GB5  

**Expected Compliance Breakdown:**

```
NHBRC Compliance:         R 270,000  (1.80%)
├─ Enrollment:             R  85,000  (R850 × 100 units)
├─ Inspections:            R 225,000  (R2,250 × 100 units)
└─ Insurance:              R 180,000  (R1,800 × 100 units)

CIDB Registration:         R   2,500  (0.02%)
├─ Registration Fee:       R   2,500  (GB5)
└─ Annual Fee:             R   2,500  (GB5)

Statutory Labour:          R 131,250  (0.88%)
├─ UIF (1%):               R   9,450
├─ SDL (1%):               R   9,450
├─ COIDA (1.75%):          R  16,537
└─ Pension (10%):          R  94,500

Quality Testing:           R  68,400  (0.46%)
├─ Concrete Tests:         R  28,350
├─ Soil Tests:             R  25,500
├─ Brick Tests:            R   6,500
└─ Geotechnical:           R  15,000

BBBEE Verification:        R  23,500  (0.16%)
├─ QSE Verification:       R   8,500
└─ Consultant Fees:        R  15,000

Preliminaries & General:   R 214,500  (1.43%)
├─ Site Establishment:     R  37,500
├─ Temporary Services:     R  26,250
├─ Time-Related (12mo):    R 102,000
└─ Health & Safety:        R  11,250

─────────────────────────────────────
TOTAL COMPLIANCE COSTS:    R 710,150  (4.73% of R15M)
```

**If your test shows costs within ±10% of these values, the calculator is working correctly! ✅**

---

## 🎯 Supplier Tier Testing (For Suppliers)

### **How Suppliers See Compliance Features:**

#### **Free Tier Suppliers:**
- ✅ Can see their products in BOQ results
- ✅ Can see compliance costs calculated (view only)
- ❌ Cannot advertise SANS 1200 compliance
- ❌ No BBBEE verification badge
- ❌ Not prioritized for DHS projects

**Test:** Sign up as Free supplier → Check if "SANS 1200 Compliant" badge visible on product (should be hidden)

---

#### **Professional Tier Suppliers:**
- ✅ All Free features
- ✅ API integration for real-time pricing
- ✅ Advanced analytics
- ❌ Still no compliance certifications visible
- ❌ Not prioritized for DHS projects

**Test:** Upgrade to Professional → Check if DHS priority badge appears (should NOT)

---

#### **Enterprise Tier Suppliers:**
- ✅ All Professional features
- ✅ **SANS 1200 compliance badge** visible
- ✅ **BBBEE verification** displayed
- ✅ **PRIORITY on DHS projects** (listed first in supplier selection)
- ✅ Can submit compliance certificates

**Test:** Upgrade to Enterprise → Check if:
1. "SANS 1200 Compliant" badge appears on products ✅
2. BBBEE level displayed on profile ✅
3. "DHS Priority Supplier" badge visible ✅
4. Products appear first in search results ✅

---

#### **Custom Tier Suppliers:**
- ✅ All Enterprise features
- ✅ Multi-location management (for national chains like Builders Warehouse)
- ✅ Custom API endpoints
- ✅ Featured supplier status
- ✅ Co-branded marketing with DHS

**Test:** Check if supplier can manage multiple branch locations (Johannesburg, Cape Town, Durban branches separately)

---

## 💡 Key Testing Tips

### **For DHS/Government Testing:**
1. ✅ **You don't need to sign up as a supplier** - just use the system as-is
2. ✅ **All compliance features work in demo mode** (no Supabase needed)
3. ✅ **Test with realistic housing projects** (50-200 units, R10M-R40M)
4. ✅ **Try different provinces** to see regional cost optimization
5. ✅ **Test CIDB validation** with intentionally low contractor grades

### **For Supplier Testing:**
1. ✅ Sign up for **Free tier first** → See what's hidden
2. ✅ View sample BOQ results → Notice lack of compliance badges
3. ✅ Upgrade to **Enterprise** → See compliance features unlock
4. ✅ Compare search ranking (Enterprise = top of list, Free = bottom)

### **For Developer Testing:**
1. ✅ Check browser console (F12) for errors
2. ✅ Verify calculations manually (use calculator to spot-check)
3. ✅ Test on mobile (responsive design critical for DHS field staff)
4. ✅ Test both localStorage and Supabase modes
5. ✅ Clear localStorage → Verify data persists (demo mode)

---

## 📞 What to Report if You Find Issues

### **Format for Bug Reports:**

```
ISSUE: [Brief description]

STEPS TO REPRODUCE:
1. [Step 1]
2. [Step 2]
3. [Step 3]

EXPECTED BEHAVIOR:
[What should happen]

ACTUAL BEHAVIOR:
[What actually happened]

ENVIRONMENT:
- Browser: [Chrome/Firefox/Safari]
- Mode: [Demo/Production]
- Province: [Which province tested]
- Project Value: [R amount]
- Screenshot: [Attach if possible]
```

### **Priority Levels:**

**🔴 CRITICAL (Fix Immediately):**
- Compliance calculator crashes/doesn't load
- Calculations completely wrong (>20% error)
- CIDB validation not flagging non-compliant contractors

**🟡 HIGH (Fix Within 24 Hours):**
- Provincial multipliers not applying correctly
- CIDB warnings showing when contractor IS compliant
- Testing schedule table not displaying

**🟢 MEDIUM (Fix Within 1 Week):**
- Minor calculation discrepancies (<10% error)
- UI alignment issues
- Mobile responsiveness issues

**⚪ LOW (Fix When Convenient):**
- Text formatting
- Icon color issues
- Non-critical UX improvements

---

## ✅ Final Checklist Before DHS Demo

### **Pre-Demo Setup (30 minutes before):**
- [ ] Test with 3 different BOQs (small, medium, large)
- [ ] Verify all 6 compliance categories display
- [ ] Test CIDB non-compliance warning (intentionally use low grade)
- [ ] Check mobile view (DHS officials may use tablets/phones)
- [ ] Clear browser cache (ensure fresh start)
- [ ] Have backup BOQ ready (in case of issues)

### **During Demo:**
- [ ] Start with simple 20-unit project (quick win)
- [ ] Show CIDB validation (change contractor grade live)
- [ ] Expand detailed breakdown (show SANS standards)
- [ ] Highlight provincial cost differences (Gauteng vs Limpopo)
- [ ] Export to Excel (show compliance costs in spreadsheet)

### **Post-Demo:**
- [ ] Collect feedback on accuracy (compare to manual QS estimate)
- [ ] Note any requested features (e.g., custom compliance reports)
- [ ] Follow up with PDF export of compliance breakdown

---

## 🎉 Success Criteria

**Your testing is successful if:**

✅ Compliance calculator displays for every BOQ processed  
✅ All 6 categories show costs (no zeros or blanks)  
✅ CIDB correctly flags non-compliant contractors  
✅ Costs are within 85-95% of manual QS estimates  
✅ Provincial variations work (±20% between Gauteng and Limpopo)  
✅ No console errors or crashes  
✅ Works on mobile and desktop  
✅ Works in both demo and production modes  

**If all ✅ → Ready for DHS pilot! 🚀**
