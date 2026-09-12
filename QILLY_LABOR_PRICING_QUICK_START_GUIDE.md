# Qilly: Labor Pricing - Quick Start Guide
## How to Add BuildAid Rates in 3 Steps (This Week!)

**Date:** February 28, 2026  
**Status:** URGENT - Start Immediately  
**Impact:** Unlocks R5.7B market opportunity

---

## 🚨 Why This Is Critical

**Current Qilly:** Prices 40% of BOQ items (materials only)  
**With Labor Pricing:** Prices 98% of BOQ items (complete solution)

**Impact:**
- ✅ Eliminates R5.7 billion in professional fees (not just R2B)
- ✅ Becomes true QS replacement
- ✅ Defensible competitive moat (2.5-year head start vs competitors)
- ✅ Increases Year 1 revenue from R12M → R28M (+133%)

---

## 🎯 3 Steps to Get Started (This Week)

### Step 1: Request BuildAid License (TODAY)

**Action:** Email BuildAid Publications

**Email Template:**
```
To: info@buildaid.co.za
CC: sales@buildaid.co.za
Subject: Commercial Data License Inquiry - Qilly Construction Platform

Dear BuildAid Team,

I am writing on behalf of Qilly (Pty) Ltd, a construction procurement 
technology company that automates Bill of Quantities pricing for 
government and private sector projects.

We are developing a comprehensive BOQ pricing platform and would like 
to integrate BuildAid's industry-standard rates into our system.

Request:
We are interested in licensing BuildAid's pricing data (labor rates, 
equipment rates, and composite rates) for commercial use within our 
platform.

Could you please provide:
1. Availability of BuildAid data in digital format (CSV, JSON, SQL, or API)
2. Commercial licensing terms and pricing
3. Update frequency and support options
4. Sample data for evaluation

About Qilly:
- Currently processing R50M+ in BOQs monthly
- Contracted with City of Johannesburg
- Letter of Intent from Department of Human Settlements
- Expanding to all 9 SA provinces

We believe a partnership would benefit both parties:
- BuildAid: Industry standard validated through technology
- Qilly: Credible, accurate pricing data for our platform

I'm available for a call this week to discuss further.

Best regards,
[Your Name]
Co-Founder & [CEO/CTO]
Qilly (Pty) Ltd

Email: [your email]
Phone: +27 [your number]
Website: https://qilly.co.za
```

**Expected Response Time:** 3-7 business days

**Pricing Expectation:**
- Low: R50,000/year
- Medium: R120,000/year
- High: R200,000/year

**Decision Rule:**
- If <R200k/year → **LICENSE IT** ✅ (best ROI)
- If >R200k/year → Evaluate alternatives

---

### Step 2: Scan Your BuildAid Book (TONIGHT)

**While waiting for BuildAid's response, scan the hardcopy as backup**

**Option A: Use Smartphone (Free, 2 hours)**
1. Download: **Google Drive** app (has built-in scanner)
2. Open Google Drive → Tap "+" → Select "Scan"
3. Scan each page:
   - ✅ Good lighting (daylight or bright room)
   - ✅ Flat surface (place book on table, hold phone steady)
   - ✅ Auto-crop enabled
   - ✅ High quality (600 DPI if option available)
4. Save as PDF: "BuildAid_2025_2026_Section_[Name].pdf"
5. Upload to Google Drive folder: "Qilly - BuildAid Data"
6. Share folder with team (penny@qilly.co.za, zanele@qilly.co.za)

**Time:** ~2 hours for 500 pages  
**Cost:** R0

**Option B: Professional Scanning (R500, same-day)**
1. Take book to **Minuteman Press** or **PostNet** (any major shopping center)
2. Request: "Scan to PDF, 600 DPI, color"
3. Cost: ~R1/page × 500 pages = R500
4. Receive PDF via email or USB
5. Upload to Google Drive

**Time:** 1 hour (drop-off + pickup)  
**Cost:** R500

**Recommended: Option A (tonight), Option B (if book too thick/time-constrained)**

---

### Step 3: Run OCR Extraction (TOMORROW)

**Use AWS Textract for accurate table extraction**

**Setup (15 minutes):**
```
1. Create AWS Account:
   - Go to: aws.amazon.com
   - Click "Create an AWS Account"
   - Enter: Email, password, company name (Qilly)
   - Payment: Credit card (will charge ~$50-$150 for full book)

2. Navigate to AWS Textract:
   - Search: "Textract" in AWS Console
   - Select: "Amazon Textract"

3. Upload Scanned PDF:
   - Click: "Analyze Document"
   - Upload: BuildAid_2025_2026_Section_Earthworks.pdf
   - Select: "Tables" checkbox ✅ (IMPORTANT)
   - Click: "Analyze"

4. Wait for Processing:
   - Small section (50 pages): ~5 minutes
   - Full book (500 pages): ~30-60 minutes

5. Download Results:
   - Format: JSON (recommended) or CSV
   - Save to: Google Drive "Qilly - BuildAid Data/OCR Output"
```

**Expected Output (JSON format):**
```json
{
  "page": 102,
  "tables": [
    {
      "rows": [
        {
          "cells": [
            {"text": "EXC.SOFT.1.5"},
            {"text": "Excavation in soft soil, depth 0.5-1.5m, mechanical"},
            {"text": "m³"},
            {"text": "245.00"},
            {"text": "Labor: R85, Equipment: R140, OH&P: R20"}
          ]
        }
      ]
    }
  ]
}
```

**Time:** 1 hour (setup) + 1 hour (processing)  
**Cost:** ~$50-$150 (AWS charges)

---

## 📊 What to Extract (Priority Order)

**Focus on high-frequency BOQ items first (80/20 rule)**

### Priority 1: EARTHWORKS (Pages 95-120 in typical BuildAid)
```
Items to extract:
├─ Excavation (soft soil, rock, etc.)
├─ Backfilling
├─ Compaction
└─ Disposal of excavated material

Why first: Appears in 95% of construction BOQs
```

### Priority 2: CONCRETE WORKS (Pages 180-250)
```
Items to extract:
├─ Formwork (foundations, columns, beams, slabs)
├─ Concrete placement (25MPa, 30MPa, 40MPa)
├─ Finishing (power float, trowel finish)
└─ Curing

Why second: Appears in 90% of structural BOQs
```

### Priority 3: BRICKWORK & BLOCKWORK (Pages 240-280)
```
Items to extract:
├─ Face brickwork (110mm, 220mm)
├─ Common brickwork
├─ Blockwork (solid, hollow)
└─ Mortar for brickwork

Why third: Appears in 85% of building BOQs
```

### Priority 4: FINISHES (Pages 450-520)
```
Items to extract:
├─ Plastering (walls, ceilings)
├─ Screeding (floor screed)
├─ Painting (emulsion, enamel, exterior)
└─ Tiling (wall tiles, floor tiles)

Why fourth: Appears in 80% of building BOQs
```

### Priority 5: PLUMBING, ELECTRICAL, ROOFING (Remaining sections)

**Strategy:** Extract Priority 1-4 this week (covers 80% of BOQs), continue with rest next week.

---

## 🗄️ Data Structure to Build

**Create this Google Sheet while waiting for OCR results:**

### Sheet 1: "Labor Rates"

| BuildAid Code | Description | Unit | Skilled Trade | Skilled Hours | Skilled Rate/hr | Unskilled Hours | Unskilled Rate/hr | Total Labor Rate | Province | Page # |
|---------------|-------------|------|---------------|---------------|-----------------|-----------------|-------------------|------------------|----------|--------|
| BRK.220.FACE | Face brickwork 220mm thick | m² | Bricklayer | 3.2 | R65 | 3.2 | R22 | R280 | GP | 247 |
| EXC.SOFT.1.5 | Excavation soft soil <1.5m | m³ | Excavator operator | 0.05 | R85 | 0 | R0 | R85 | GP | 102 |

### Sheet 2: "Equipment Rates"

| BuildAid Code | Description | Unit | Equipment Type | Hire Rate | Operator Included | Fuel Cost | Total Equipment Rate | Province | Page # |
|---------------|-------------|------|----------------|-----------|-------------------|-----------|----------------------|----------|--------|
| EXC.5T | Excavator 5-ton tracked | hour | Excavator | R350 | Yes | R90 | R440 | GP | 815 |
| SCAFFOLD.STD | Scaffolding standard | m² | Temp works | R18 | No | R0 | R18 | GP | 892 |

### Sheet 3: "Composite Rates"

| BuildAid Code | Description | Unit | Material Rate | Labor Rate | Equipment Rate | OH&P % | Total Rate | Province | SANS Code | Page # |
|---------------|-------------|------|---------------|------------|----------------|--------|------------|----------|-----------|--------|
| BRK.220.FACE | Face brickwork 220mm thick incl pointing | m² | R340 | R280 | R35 | 15% | R680 | GP | SANS 1200 HB | 247 |
| EXC.SOFT.1.5 | Excavation soft soil mech <1.5m | m³ | R0 | R85 | R140 | 15% | R245 | GP | SANS 1200 EA | 102 |

**Google Sheets Template:** [Link will be created and shared]

---

## 💰 Budget Summary

| Item | Cost | When |
|------|------|------|
| **BuildAid License** (if available) | R50k-R200k/year | After quote received |
| **Professional Scanning** (if needed) | R500 | Optional |
| **AWS Textract** (OCR) | $50-$150 (~R1,000-R3,000) | This week |
| **IP Lawyer Consultation** | R5,000-R10,000 | Next week |
| **Developer Time** (8 weeks) | R320,000 | Months 2-3 |
| **TOTAL (with license)** | **R376k-R543k** | Over 3 months |
| **TOTAL (without license)** | **R176k-R343k** | Over 3 months |

**ROI:** R420M NPV over 5 years = **77,000% return**

---

## ⚖️ Legal Considerations (Quick Version)

**Q: Can we legally use BuildAid data?**

**A: Three options:**

**Option 1: LICENSE ✅ (BEST)**
- Contact BuildAid, pay annual fee (R50k-R200k)
- Legally compliant, no risk
- **Recommended if <R200k/year**

**Option 2: TRANSFORMATIVE USE ⚠️ (RISKY)**
- Use BuildAid as reference, apply Qilly algorithms
- Legal gray area, may still infringe copyright
- **Requires IP lawyer opinion (R5k-R10k)**
- Only if BuildAid declines licensing

**Option 3: BUILD OWN LIBRARY ✅ (SLOW)**
- Hire QS to build proprietary rates
- 6-12 months, R800k-R1.5M cost
- **Long-term strategy, not MVP**

**Decision Tree:**
```
Contact BuildAid → Quote <R200k? → YES → LICENSE IT ✅
                                 ↓
                                 NO
                                 ↓
Quote >R200k or declined? → Consult IP Lawyer → Transformative Use ⚠️
                                              ↓
                          Long-term: Build proprietary library ✅
```

---

## 📅 Timeline (Week by Week)

### Week 1 (This Week)
- **Mon:** Email BuildAid for license quote ✅
- **Tue:** Scan BuildAid book (Google Drive Scan app) ✅
- **Wed:** Run AWS Textract OCR ✅
- **Thu:** Start manual data entry (Priority 1: Earthworks) ✅
- **Fri:** Create Google Sheets template with 50 rates ✅

### Week 2 (Next Week)
- **Mon:** Follow up with BuildAid if no response
- **Tue:** Consult IP lawyer (R5k-R10k, 2-hour session)
- **Wed:** Make licensing decision (go/no-go)
- **Thu-Fri:** Continue data extraction (Priority 2: Concrete)

### Week 3-4 (If Licensed or Proceeding)
- Create Supabase database tables
- Import cleaned data
- Build API endpoints

### Week 5-8 (Development)
- Build composite rate calculator
- Integrate with existing material pricing
- Test with real BOQs
- Beta launch

### Week 9 (Launch)
- Demo to Dept of Human Settlements
- Update investor pitch
- Close R25M Series A

---

## 🎯 Success Metrics

**By End of Week 1:**
- ✅ BuildAid contacted (email sent)
- ✅ Book scanned (PDF in Google Drive)
- ✅ OCR completed (JSON output)
- ✅ 50+ rates manually entered in Google Sheets

**By End of Week 2:**
- ✅ Licensing decision made
- ✅ Legal opinion obtained (if needed)
- ✅ 200+ rates extracted

**By End of Month 2:**
- ✅ Database schema created
- ✅ 1,000+ rates imported
- ✅ API endpoints working

**By End of Month 3:**
- ✅ Complete BOQ pricing live in SIT
- ✅ Tested with 50 real BOQs
- ✅ Accuracy: ±15% vs QS quotes

---

## 🚀 Immediate Actions (Do This Today)

### Action 1: Send BuildAid Email (10 minutes)
→ Copy email template above  
→ Send to: info@buildaid.co.za  
→ CC: sales@buildaid.co.za  
→ BCC: zanele@qilly.co.za (for tracking)

### Action 2: Scan First Section (30 minutes)
→ Download Google Drive app  
→ Scan pages 95-120 (Earthworks section)  
→ Save as: "BuildAid_Earthworks.pdf"  
→ Upload to shared folder

### Action 3: Set Up AWS Account (15 minutes)
→ Go to: aws.amazon.com  
→ Create account (use company email)  
→ Add payment method  
→ Navigate to Textract service

### Action 4: Schedule Team Meeting (5 minutes)
→ Friday this week (1 hour)  
→ Agenda: "Labor Pricing Strategy - BuildAid Integration"  
→ Attendees: Penny, Zanele, Lead Developer  
→ Prepare: Show scanned pages, OCR demo, discuss licensing

---

## ❓ FAQ

**Q: What if BuildAid says no to licensing?**  
A: Proceed with transformative use (after IP lawyer review) or start building proprietary library long-term.

**Q: How accurate is OCR?**  
A: AWS Textract: 95-98% accurate for printed tables. Expect 2-5% manual corrections needed.

**Q: Can we start with just a few sections?**  
A: Yes! Prioritize Earthworks + Concrete + Brickwork (covers 80% of BOQs). Expand later.

**Q: What if we can't afford R200k/year license?**  
A: Extract only high-frequency items manually (~500 rates), use for MVP. Scale with revenue.

**Q: Is this legal without a license?**  
A: Risky. Get IP lawyer opinion (R5k-R10k). Document transformative methodology. Proceed with caution.

---

## 📞 Support

**Questions on this guide:**  
Email: penny@qilly.co.za or zanele@qilly.co.za

**Technical issues (AWS, OCR):**  
Email: tech@qilly.co.za

**Legal questions:**  
Email: legal@qilly.co.za (after IP lawyer consultation)

---

## ✅ Checklist (Print This)

**This Week:**
- [ ] Email BuildAid for license quote (TODAY)
- [ ] Scan BuildAid book - Earthworks section (TONIGHT)
- [ ] Set up AWS Textract account (TOMORROW)
- [ ] Run OCR on Earthworks section (TOMORROW)
- [ ] Create Google Sheets template (THU)
- [ ] Manually enter 50 high-priority rates (FRI)
- [ ] Schedule team meeting for Friday (TODAY)

**Next Week:**
- [ ] Follow up with BuildAid (if no response)
- [ ] Consult IP lawyer (R5k-R10k)
- [ ] Make licensing decision
- [ ] Continue data extraction (Priority 2: Concrete)
- [ ] Plan database schema with developers

**Month 2:**
- [ ] Build Supabase tables
- [ ] Import cleaned data
- [ ] Develop composite rate calculator
- [ ] Test with 10 sample BOQs

**Month 3:**
- [ ] Beta launch to City of JHB
- [ ] Demo to Dept of Human Settlements
- [ ] Update investor pitch: "Complete BOQ pricing ✅"
- [ ] Close R25M Series A

---

**🔥 Bottom Line: This is the most important feature Qilly will build.**

**Start today. Email BuildAid now. Scan the book tonight. This is the difference between a R500M company and a R4.9B company.**

**Let's go! 🚀**
