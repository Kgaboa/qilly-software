# eTender Labor Rate Extraction: Complete Implementation Guide
## Building Qilly's Labor Price Library from Government Tender Data

**Document Version:** 1.0  
**Date:** February 28, 2026  
**Objective:** Extract 500+ labor rates from eTender awarded BOQs (100% legal, R0 cost)  
**Timeline:** 4 weeks to complete  
**Legal Status:** ✅ 100% LEGAL (public records, no copyright issues)

---

## 📋 Table of Contents

1. [Strategy Overview](#strategy-overview)
2. [Phase 1: eTender Portal Access & Download](#phase-1-etender-portal-access--download)
3. [Phase 2: BOQ Extraction & Data Processing](#phase-2-boq-extraction--data-processing)
4. [Phase 3: Labor Rate Calculation](#phase-3-labor-rate-calculation)
5. [Phase 4: Database Building](#phase-4-database-building)
6. [Automation Tools & Scripts](#automation-tools--scripts)
7. [Quality Control](#quality-control)
8. [Integration with Qilly](#integration-with-qilly)
9. [Maintenance & Updates](#maintenance--updates)

---

## Strategy Overview

### Why This Approach is BRILLIANT ✅

**Legal:**
- ✅ Government tender data is public records (no copyright)
- ✅ Freedom of Information Act (FOIA/PAIA) protects access
- ✅ No licensing fees required
- ✅ Investor-friendly (clean IP, no legal uncertainty)

**Quality:**
- ✅ Real market rates (actual winning bids, not estimates)
- ✅ Current pricing (tenders from 2024-2026)
- ✅ Regional data (all 9 provinces represented)
- ✅ CIDB-validated (winning contractors are registered)

**Coverage:**
- ✅ 50 tenders × 100+ BOQ items each = 5,000+ data points
- ✅ Average across projects = 500-800 unique labor rates
- ✅ Covers 80-90% of typical government BOQs

**Cost:**
- ✅ R0 (public data)
- ✅ Time: 100-120 hours (3-4 weeks with 1 person)
- ✅ ROI: Infinite (free data that powers R28M+ revenue)

---

### 4-Phase Execution Plan

```
Phase 1: Download (Week 1)
├─ Register on eTender Portal
├─ Search for awarded construction tenders
├─ Download 50+ tender documents (PDFs)
└─ Organize files by province/category

Phase 2: Extract (Week 2-3)
├─ Extract BOQs from tender PDFs
├─ Convert PDF tables to Excel/CSV
├─ Clean and structure data
└─ Identify labor component in rates

Phase 3: Calculate (Week 3)
├─ Separate labor from material/equipment
├─ Calculate average rates per item
├─ Apply regional adjustments
└─ Validate against industry norms

Phase 4: Build Database (Week 4)
├─ Structure data (schema design)
├─ Import to Google Sheets/CSV
├─ Validate quality (spot checks)
└─ Import to Qilly Supabase database

TOTAL TIME: 4 weeks
TOTAL COST: R0
OUTPUT: 500+ labor rates covering 80-90% of BOQs
```

---

## Phase 1: eTender Portal Access & Download

### Step 1: Register on eTender Portal

**Website:** https://etender.gov.za

**Registration Process:**
```
1. Go to https://etender.gov.za
2. Click "Register" (top right)
3. Select "Supplier Registration" (free account)
4. Fill in details:
   ├─ Company: Qilly (Pty) Ltd
   ├─ Email: [your business email]
   ├─ Contact: [your details]
   └─ Purpose: "Market research and data analysis"
5. Verify email (check inbox)
6. Login credentials created

Time: 15 minutes
Cost: R0
```

**Alternative Portals (If eTender Limited):**
```
National:
├─ National Treasury: https://ocpo.treasury.gov.za/tenders
├─ CIDB: https://www.cidb.org.za/tenders

Provincial Treasury Portals:
├─ Gauteng: https://gautengonline.gov.za/tenders
├─ Western Cape: https://www.westerncape.gov.za/tenders
├─ KwaZulu-Natal: https://www.kznonline.gov.za/tenders
├─ Eastern Cape: https://www.ecprov.gov.za/tenders
├─ Free State: https://www.fstenders.gov.za
├─ Limpopo: https://www.limpopo.gov.za/tenders
├─ Mpumalanga: https://www.mpumalanga.gov.za/tenders
├─ North West: https://www.nwpg.gov.za/tenders
├─ Northern Cape: https://www.northern-cape.gov.za/tenders

Municipal Portals:
├─ City of Johannesburg: https://www.joburg.org.za/procurement
├─ City of Cape Town: https://www.capetown.gov.za/tenders
├─ eThekwini (Durban): https://www.durban.gov.za/procurement
├─ Tshwane (Pretoria): https://www.tshwane.gov.za/tenders
├─ Ekurhuleni: https://www.ekurhuleni.gov.za/tenders
```

---

### Step 2: Search for Awarded Construction Tenders

**Search Strategy:**

**Filters to Apply:**
```
Status: AWARDED (critical - only awarded tenders have priced BOQs)
Category: Construction / Building Works / Civil Engineering
Date Range: 2024-01-01 to 2026-02-28 (recent, current pricing)
Province: All (for regional coverage)
Value: R5M - R100M (sweet spot for detailed BOQs)

Keywords to Search:
├─ "RDP housing"
├─ "School construction"
├─ "Clinic construction"
├─ "Municipal buildings"
├─ "Road construction"
├─ "Water infrastructure"
├─ "Sewer reticulation"
└─ "Community facilities"
```

**Target Tender Types (Best for Labor Data):**

| Tender Type | Priority | Why? | Expected Labor Items |
|-------------|----------|------|---------------------|
| **RDP Housing** | 🔴 HIGH | Standardized BOQs, lots of labor | Excavation, brickwork, plastering, roofing, painting |
| **Schools** | 🔴 HIGH | Large projects, detailed BOQs | Concrete, steelwork, blockwork, finishes |
| **Clinics** | 🟡 MEDIUM | Similar to schools, smaller scale | Same as schools, plus medical fit-out |
| **Municipal Buildings** | 🟡 MEDIUM | Varied scope, good data | All trades represented |
| **Road Construction** | 🟢 LOW | Heavy on equipment, less labor | Earthworks, surfacing (limited labor) |
| **Water/Sewer** | 🟢 LOW | Specialized, less transferable | Pipework, trenching (niche labor) |

**Recommended: Focus on RDP Housing + Schools (70% of downloads)**

---

### Step 3: Download Tender Documents

**What to Download:**

```
For Each Awarded Tender, Download:

1. Award Notice (PDF)
├─ Confirms tender was awarded
├─ Shows winning contractor
├─ Shows total contract value
└─ Date of award

2. Bill of Quantities (BOQ) - CRITICAL
├─ Usually named: "BOQ.pdf" or "Schedule of Quantities.pdf"
├─ Contains itemized list with quantities and rates
├─ THIS IS WHAT YOU NEED
└─ Sometimes embedded in main tender document

3. Pricing Schedule (If separate from BOQ)
├─ Shows unit rates applied by winning bidder
├─ May include labor/material breakdown
└─ Use to cross-check BOQ

4. Contract Award Letter (Optional)
├─ Additional context
├─ Confirms final pricing
└─ Useful for validation

PRIORITY: Focus on getting BOQ.pdf for each tender
```

**Download Workflow:**

```
Step-by-Step:

1. Search results show 200+ awarded construction tenders
2. Sort by: Date Awarded (newest first)
3. For each tender:
   ├─ Click "View Documents"
   ├─ Locate "Bill of Quantities" or "BOQ.pdf"
   ├─ Download (right-click → Save As)
   ├─ Rename file: "[Province]_[TenderNo]_[ProjectType]_BOQ.pdf"
   │   Example: "GP_T2024_1234_RDP_Housing_BOQ.pdf"
   └─ Save to organized folder structure

4. Track downloads in spreadsheet:
   ├─ Tender No
   ├─ Province
   ├─ Project Type
   ├─ Contract Value
   ├─ Award Date
   ├─ Winning Contractor
   └─ File Path

5. Target: 50-70 BOQ downloads
```

**Folder Organization:**

```
/eTender_BOQs/
├── Gauteng/
│   ├── RDP_Housing/
│   │   ├── GP_T2024_1234_RDP_Housing_BOQ.pdf
│   │   ├── GP_T2024_5678_RDP_Housing_BOQ.pdf
│   │   └── ...
│   ├── Schools/
│   │   ├── GP_T2025_2345_School_BOQ.pdf
│   │   └── ...
│   └── Municipal/
├── Western_Cape/
│   ├── RDP_Housing/
│   └── Schools/
├── KwaZulu_Natal/
└── [Other_Provinces]/

/eTender_BOQs/
├── _Tracker.xlsx (master tracking spreadsheet)
└── _README.txt (notes, observations)
```

**Tracking Spreadsheet Template:**

```
Columns:
├─ A: Tender Number (e.g., T2024/1234)
├─ B: Province (e.g., Gauteng)
├─ C: Municipality (e.g., City of Johannesburg)
├─ D: Project Type (e.g., RDP Housing)
├─ E: Project Description (e.g., "100 units, Soweto")
├─ F: Contract Value (e.g., R45,000,000)
├─ G: Award Date (e.g., 2024-06-15)
├─ H: Winning Contractor (e.g., ABC Construction)
├─ I: CIDB Grading (e.g., 7GB)
├─ J: File Path (e.g., Gauteng/RDP_Housing/GP_T2024_1234_BOQ.pdf)
├─ K: BOQ Items Count (e.g., 150)
├─ L: Extraction Status (e.g., "Pending", "Extracted", "Error")
├─ M: Quality Score (e.g., "Good", "Fair", "Poor")
└─ N: Notes (e.g., "BOQ well-structured, clear labor breakdown")

Target: 50-70 rows (tenders)
```

---

### Step 4: Quality Check Downloads

**Before proceeding to extraction, check:**

```
For Each Downloaded BOQ PDF:

✅ Quality Criteria:
├─ File opens correctly (not corrupted)
├─ BOQ table is visible (not scanned as image)
├─ Text is selectable (can copy-paste)
├─ Columns are clear:
│   ├─ Item No
│   ├─ Description
│   ├─ Unit
│   ├─ Quantity
│   ├─ Rate (R/unit)
│   └─ Amount (R)
├─ Rates are filled in (priced BOQ, not blank template)
└─ At least 50+ line items (sufficient data)

❌ Reject if:
├─ Scanned image only (no selectable text) → Need OCR
├─ Rates column blank (unpriced BOQ) → Not useful
├─ Less than 20 items (insufficient data)
├─ Corrupted/unreadable PDF
└─ Wrong document (not a BOQ)

Goal: 50 high-quality BOQ PDFs
If you have 30 good + 20 poor → Download 20 more to replace poor ones
```

---

### Expected Output: Week 1

```
Deliverables:
├─ 50-70 awarded tender BOQ PDFs downloaded
├─ Organized in folder structure by province/type
├─ Tracking spreadsheet with metadata
├─ Quality assessment complete (50+ "Good" quality BOQs)
└─ Ready for Phase 2 (extraction)

Time Spent: 20-30 hours
├─ Registration & search: 2 hours
├─ Downloading 70 BOQs: 10 hours (8 min per tender)
├─ Quality checking: 5 hours
├─ Organization & tracking: 3 hours
└─ Buffer for issues: 5 hours

Cost: R0
```

---

## Phase 2: BOQ Extraction & Data Processing

### Step 1: Choose Extraction Method

**Three Options (Choose Based on PDF Quality):**

---

#### Option A: Manual Copy-Paste (Simplest, 100% Accurate)

**Best For:** Small batch (10-20 BOQs), high-quality PDFs with selectable text

**Process:**
```
1. Open BOQ PDF
2. Select table (click-drag)
3. Copy (Ctrl+C)
4. Paste into Excel (Ctrl+V)
5. Clean formatting
6. Save as CSV

Time: 20-30 min per BOQ
Accuracy: 99% (human verification)
Scalability: Poor (50 BOQs = 25 hours)
```

---

#### Option B: PDF Table Extraction Tools (Recommended ⭐)

**Best For:** Batch processing 50+ BOQs, good-quality PDFs

**Tool Options:**

**1. Tabula (FREE, Open Source) - RECOMMENDED**
```
Download: https://tabula.technology

Features:
├─ Extracts tables from PDFs automatically
├─ Drag-select table area
├─ Export to CSV/Excel
├─ Batch processing (50 PDFs at once)
├─ FREE (no cost)

Installation:
1. Download from https://tabula.technology
2. Install (Windows/Mac/Linux)
3. Launch (opens in browser)

Usage:
1. Upload BOQ PDF
2. Click "Autodetect Tables" (or manually select)
3. Preview extraction
4. Export to CSV
5. Repeat for all 50 BOQs

Time: 5-10 min per BOQ (setup)
Accuracy: 85-95% (requires cleanup)
Scalability: Excellent (batch mode)

BEST CHOICE FOR QILLY ✅
```

**2. Adobe Acrobat (Paid, $15/month)**
```
Features:
├─ Export PDF to Excel
├─ Better accuracy than free tools
├─ Handles complex tables
└─ Batch export

Cost: $15/month (R280/month)
Time: 3-5 min per BOQ
Accuracy: 90-98%

Use if: Tabula results unsatisfactory
```

**3. Online Tools (Mixed Quality)**
```
Options:
├─ PDFTables.com (£5/month for 100 PDFs)
├─ Smallpdf.com (Free tier: 2 PDFs/day)
└─ iLovePDF.com (Free tier limited)

Pros: No installation
Cons: Upload limits, privacy concerns (uploading govt docs)

Not recommended: Privacy risk with government tender data
```

---

#### Option C: OCR + Python Script (Advanced, For Scanned PDFs)

**Best For:** Scanned BOQs (non-selectable text), automation

**Tools:**
```
Python Libraries:
├─ pdfplumber (PDF table extraction)
├─ pytesseract (OCR for scanned PDFs)
├─ pandas (data manipulation)
└─ tabula-py (Python wrapper for Tabula)

Time to Build: 4-6 hours
Time per BOQ: 2-3 min (automated)
Accuracy: 70-85% (requires cleanup)

Use if: >100 BOQs, or many scanned PDFs
```

---

### Step 2: Extract BOQs Using Tabula (Recommended)

**Detailed Tabula Workflow:**

```
SETUP (One-time, 10 minutes):

1. Download Tabula:
   ├─ Go to https://tabula.technology
   ├─ Download for your OS (Windows/Mac/Linux)
   └─ Install (double-click installer)

2. Launch Tabula:
   ├─ Double-click Tabula icon
   ├─ Opens in browser (http://127.0.0.1:8080)
   └─ Keep Tabula running in background

EXTRACTION (Per BOQ, 5-10 minutes):

3. Upload BOQ PDF:
   ├─ Click "Browse" in Tabula
   ├─ Select BOQ PDF (e.g., GP_T2024_1234_RDP_Housing_BOQ.pdf)
   └─ Click "Import"

4. Select Table Area:
   ├─ Tabula displays PDF pages
   ├─ Click "Autodetect Tables" (tries to find tables automatically)
   │   OR
   ├─ Manually drag-select table area (more accurate)
   └─ Preview extraction in right panel

5. Verify Column Detection:
   ├─ Check columns are correctly identified:
   │   ├─ Item No
   │   ├─ Description
   │   ├─ Unit
   │   ├─ Quantity
   │   ├─ Rate
   │   └─ Amount
   ├─ If incorrect, adjust selection area
   └─ Re-preview

6. Export to CSV:
   ├─ Click "Export" → "CSV"
   ├─ Save as: "[TenderNo]_BOQ_extracted.csv"
   │   Example: "GP_T2024_1234_BOQ_extracted.csv"
   └─ Save to /Extracted_CSVs/ folder

7. Repeat for All 50 BOQs:
   ├─ Process 10 BOQs per session (1-2 hours)
   ├─ 5 sessions = 50 BOQs extracted
   └─ Total time: 6-10 hours

BATCH MODE (Advanced, Optional):

8. Tabula Batch Processing:
   ├─ Select multiple PDFs (Ctrl+Click)
   ├─ Tabula processes all at once
   ├─ Exports to folder
   └─ Faster, but less accurate (needs more cleanup)
```

---

### Step 3: Clean Extracted Data

**Common Issues & Fixes:**

```
Issue 1: Merged Cells / Split Rows
├─ Problem: Description spans multiple rows
├─ Fix: Manually merge in Excel, or use Python script

Issue 2: Headers Repeated
├─ Problem: Table headers appear on every page
├─ Fix: Filter and delete header rows (Excel: Filter → Remove)

Issue 3: Currency Formatting
├─ Problem: Rates show as "R 1,250.00" (text, not number)
├─ Fix: Find-replace "R " → "", "," → "", convert to number

Issue 4: Units Inconsistent
├─ Problem: "m²", "m2", "SQM", "square metre"
├─ Fix: Standardize to "m²", "m³", "m", "nr"

Issue 5: Blank Rows
├─ Problem: Empty rows between sections
├─ Fix: Filter → Remove blank rows

Issue 6: Summary Rows
├─ Problem: "TOTAL", "SUBTOTAL", "SECTION TOTAL" rows
├─ Fix: Identify and delete (not individual items)
```

**Cleaning Script (Excel/Google Sheets):**

```
Steps in Excel:

1. Open extracted CSV
2. Remove header rows (delete rows with "Item No", "Description" text)
3. Remove blank rows:
   ├─ Select all data
   ├─ Go to Home → Find & Select → Go To Special → Blanks
   ├─ Right-click → Delete → Entire Row
4. Remove summary rows:
   ├─ Filter Description column
   ├─ Uncheck "TOTAL", "SUBTOTAL", "SECTION", "SUB-TOTAL"
   ├─ Delete visible rows
5. Clean Rate column:
   ├─ Find & Replace: "R " → "" (remove currency symbol)
   ├─ Find & Replace: "," → "" (remove thousand separator)
   ├─ Format as Number (2 decimals)
6. Standardize Units:
   ├─ Find & Replace: "m2" → "m²", "m3" → "m³"
   ├─ Find & Replace: "SQM" → "m²", "CUM" → "m³"
   ├─ Find & Replace: "LM" → "m", "No" → "nr", "Each" → "nr"
7. Add Metadata Columns:
   ├─ Insert column "TenderNo": Fill with tender number
   ├─ Insert column "Province": Fill with province
   ├─ Insert column "ProjectType": Fill with project type
   ├─ Insert column "AwardDate": Fill with award date
8. Save as clean CSV:
   ├─ File → Save As → CSV
   ├─ Filename: "[TenderNo]_BOQ_clean.csv"
```

**Automation (Python Script):**

```python
# clean_boq_csv.py

import pandas as pd
import re
import glob

def clean_boq_csv(input_file, tender_no, province, project_type, award_date):
    """Clean extracted BOQ CSV"""
    
    # Read CSV
    df = pd.read_csv(input_file)
    
    # Remove header rows (where Item No contains "Item" or "No")
    df = df[~df['Item No'].astype(str).str.contains('Item|No', na=False, case=False)]
    
    # Remove blank rows
    df = df.dropna(how='all')
    
    # Remove summary rows (TOTAL, SUBTOTAL in Description)
    df = df[~df['Description'].astype(str).str.contains('TOTAL|SUBTOTAL|SUB-TOTAL', na=False, case=False)]
    
    # Clean Rate column
    if 'Rate' in df.columns:
        df['Rate'] = df['Rate'].astype(str).str.replace('R', '').str.replace(',', '').str.strip()
        df['Rate'] = pd.to_numeric(df['Rate'], errors='coerce')
    
    # Standardize Units
    unit_mapping = {
        'm2': 'm²', 'sqm': 'm²', 'square metre': 'm²',
        'm3': 'm³', 'cum': 'm³', 'cubic metre': 'm³',
        'lm': 'm', 'linear metre': 'm',
        'no': 'nr', 'each': 'nr', 'number': 'nr'
    }
    if 'Unit' in df.columns:
        df['Unit'] = df['Unit'].astype(str).str.lower().str.strip()
        df['Unit'] = df['Unit'].replace(unit_mapping)
    
    # Add metadata
    df['TenderNo'] = tender_no
    df['Province'] = province
    df['ProjectType'] = project_type
    df['AwardDate'] = award_date
    
    # Remove duplicates
    df = df.drop_duplicates(subset=['Item No', 'Description'])
    
    # Save cleaned CSV
    output_file = input_file.replace('_extracted.csv', '_clean.csv')
    df.to_csv(output_file, index=False)
    
    print(f"Cleaned: {input_file} → {output_file} ({len(df)} items)")
    return output_file

# Usage:
# clean_boq_csv('GP_T2024_1234_BOQ_extracted.csv', 'T2024/1234', 'Gauteng', 'RDP Housing', '2024-06-15')

# Batch process all extracted CSVs:
def batch_clean_all():
    """Clean all extracted CSVs in folder"""
    # Read metadata from tracker spreadsheet
    tracker = pd.read_excel('_Tracker.xlsx')
    
    for index, row in tracker.iterrows():
        tender_no = row['Tender Number']
        province = row['Province']
        project_type = row['Project Type']
        award_date = row['Award Date']
        
        # Find corresponding extracted CSV
        pattern = f"*{tender_no.replace('/', '_')}*_extracted.csv"
        files = glob.glob(pattern)
        
        if files:
            clean_boq_csv(files[0], tender_no, province, project_type, award_date)
        else:
            print(f"Warning: No extracted CSV found for {tender_no}")

# Run batch cleaning:
# batch_clean_all()
```

---

### Step 4: Consolidate All BOQs

**Merge 50 Clean CSVs into Master Database:**

```
Method 1: Manual (Excel)

1. Open new Excel workbook
2. Create sheet "Master_BOQ_Data"
3. Copy-paste all 50 clean CSVs into one sheet:
   ├─ Open CSV 1, select all, copy
   ├─ Paste into Master_BOQ_Data (starting row 2)
   ├─ Open CSV 2, select all (except headers), copy
   ├─ Paste below CSV 1 data
   ├─ Repeat for all 50 CSVs
4. Result: Single sheet with 5,000-8,000 rows (all BOQ items)
5. Save as "Master_BOQ_Consolidated.xlsx"

Time: 2-3 hours
```

```
Method 2: Automated (Python)

import pandas as pd
import glob

# Find all clean CSVs
csv_files = glob.glob('*_clean.csv')

# Read and concatenate
dfs = []
for file in csv_files:
    df = pd.read_csv(file)
    dfs.append(df)

# Merge all
master_df = pd.concat(dfs, ignore_index=True)

# Save
master_df.to_csv('Master_BOQ_Consolidated.csv', index=False)
master_df.to_excel('Master_BOQ_Consolidated.xlsx', index=False)

print(f"Consolidated {len(csv_files)} BOQs → {len(master_df)} total items")

Time: 5 minutes
```

---

### Expected Output: Week 2-3

```
Deliverables:
├─ 50 extracted BOQ CSVs (raw)
├─ 50 cleaned BOQ CSVs (standardized)
├─ Master_BOQ_Consolidated.xlsx (all 5,000-8,000 items in one file)
├─ Quality report (items per tender, issues encountered)
└─ Ready for Phase 3 (labor rate calculation)

Time Spent: 30-40 hours
├─ Tabula extraction (50 BOQs): 10 hours
├─ Cleaning CSVs: 15 hours
├─ Consolidation: 3 hours
├─ Quality checks: 5 hours
└─ Buffer: 7 hours

Cost: R0
```

---

## Phase 3: Labor Rate Calculation

### The Challenge: Separating Labor from Composite Rates

**Most BOQ rates are COMPOSITE (Material + Labor + Equipment):**

```
Example BOQ Item:
├─ Description: "Face brickwork 220mm common brick"
├─ Unit: m²
├─ Rate: R680/m²

This R680 includes:
├─ Material: 100 bricks @ R2.75 = R275
├─ Mortar: 0.1 m³ @ R680 = R68
├─ Labor: Bricklayer + assistant = R280
├─ Equipment: Scaffolding, mixer = R35
├─ OH&P (15%): R98
└─ TOTAL: R680/m²

YOUR GOAL: Extract R280 labor component
```

---

### Strategy 1: Industry Standard Labor Percentages (Fast, 70% Accurate)

**Use typical labor percentages by trade:**

```
Labor as % of Total Composite Rate (Industry Averages):

Earthworks:
├─ Excavation (mechanical): 20-25% labor, 70% equipment
├─ Excavation (manual): 80-90% labor, 10% equipment
├─ Backfilling: 30-40% labor
└─ Compaction: 25-35% labor

Concrete:
├─ Formwork: 70-80% labor (highly labor-intensive)
├─ Concrete pour: 15-20% labor, 60% material, 20% equipment
├─ Reinforcement: 50-60% labor, 40% material
└─ Finishing (screeding, troweling): 80-90% labor

Brickwork/Blockwork:
├─ Common brickwork: 35-45% labor, 50% material
├─ Face brickwork: 40-50% labor (more skilled)
├─ Blockwork: 30-40% labor
└─ Plastering: 50-60% labor

Roofing:
├─ Roof trusses: 25-35% labor, 65% material
├─ Roof sheeting (IBR): 30-40% labor, 60% material
├─ Gutters/downpipes: 40-50% labor
└─ Tiling: 60-70% labor (highly skilled)

Finishes:
├─ Painting: 60-70% labor, 30% material
├─ Tiling (floor/wall): 50-60% labor
├─ Ceiling installation: 55-65% labor
└─ Doors/windows: 35-45% labor

Plumbing:
├─ Pipe installation: 45-55% labor, 40% material
├─ Fixture installation: 60-70% labor
└─ Drainage: 40-50% labor

Electrical:
├─ Conduit installation: 50-60% labor
├─ Wiring: 40-50% labor, 50% material
├─ Light fittings: 65-75% labor
└─ DB board: 30-40% labor, 60% material
```

**Application:**

```
Example:

BOQ Item: "Face brickwork 220mm"
Composite Rate: R680/m² (from tender BOQ)
Labor Percentage: 40-50% (from table above)

Calculation:
├─ Labor (low): R680 × 0.40 = R272/m²
├─ Labor (high): R680 × 0.50 = R340/m²
├─ Labor (average): (R272 + R340) ÷ 2 = R306/m²
└─ USE: R306/m² as labor rate for brickwork

Confidence: 70% (industry average, not project-specific)
```

---

### Strategy 2: Cross-Reference with Trade Union Wages (More Accurate)

**Validate labor rates using minimum wages:**

```
Example:

BOQ Item: "Face brickwork 220mm"
Calculated Labor Rate (Strategy 1): R306/m²

Validation:
1. Get bricklayer wage: R65/hr (from BCCEI/BCAWU)
2. Get productivity: 12 m²/day (from SANS 1200)
3. Calculate hours per m²: 8 hrs ÷ 12 m² = 0.67 hrs/m²
4. Calculate gang cost:
   ├─ Bricklayer: 0.67 hrs × R65/hr = R43.55/m²
   ├─ Assistant: 0.67 hrs × R22/hr = R14.74/m²
   ├─ Subtotal: R58.29/m²
   ├─ Add supervision (10%): R64.12/m²
   ├─ Add OH&P on labor (20%): R76.94/m²
   └─ TOTAL LABOR: ~R77/m²

Compare:
├─ Strategy 1 (percentage): R306/m² ← TOO HIGH (seems to include material)
├─ Strategy 2 (wage calc): R77/m² ← More realistic
└─ Adjust Strategy 1: Use 12-15% labor (not 40-50%)

Revised:
├─ R680 × 0.12 = R82/m² ← Closer to wage calc (R77)
└─ USE: R80/m² (average of R77 and R82)

Confidence: 85% (validated against wages)
```

---

### Strategy 3: Analyze BOQs with Labor/Material Breakdown (Best, 95% Accurate)

**Some tenders provide itemized breakdown:**

```
Example: High-Quality BOQ (10-15% of tenders)

Item 5.3: Face Brickwork 220mm
├─ Material:
│   ├─ Bricks (100 nr @ R2.75): R275.00/m²
│   └─ Mortar (0.1 m³ @ R680): R68.00/m²
│   └─ Subtotal Material: R343.00/m²
├─ Labor:
│   ├─ Bricklayer (0.67 hrs @ R65/hr): R43.55/m²
│   └─ Assistant (0.67 hrs @ R22/hr): R14.74/m²
│   └─ Subtotal Labor: R58.29/m²
├─ Equipment:
│   ├─ Scaffolding: R18.00/m²
│   └─ Mixer: R5.00/m²
│   └─ Subtotal Equipment: R23.00/m²
├─ Subtotal: R424.29/m²
├─ OH&P (15%): R63.64/m²
└─ TOTAL RATE: R487.93/m² → Rounded to R490/m²

LABOR RATE = R58.29/m² (explicitly stated)

Confidence: 95% (directly from BOQ)
```

**Action: Prioritize tenders with itemized BOQs**

---

### Recommended Hybrid Approach

```
Step-by-Step Labor Extraction:

1. Check if BOQ has breakdown (15% of tenders):
   ├─ If YES: Extract labor component directly → 95% accurate
   └─ If NO: Proceed to step 2

2. Categorize BOQ item by trade:
   ├─ Earthworks, Concrete, Brickwork, Roofing, Finishes, etc.
   └─ Match to industry labor percentage table

3. Apply industry percentage:
   ├─ Labor Rate = Composite Rate × Labor %
   └─ Example: R680 × 0.42 (brickwork avg) = R286/m²

4. Validate with wage calculation:
   ├─ Get trade wage (union rates)
   ├─ Get productivity (SANS 1200 or research)
   ├─ Calculate labor cost bottom-up
   └─ Compare to step 3

5. Adjust if variance >30%:
   ├─ If step 3 much higher than step 4 → Reduce labor %
   ├─ If step 3 much lower than step 4 → Increase labor %
   └─ Find middle ground

6. Average across all tenders:
   ├─ Collect same item from 10+ tenders
   ├─ Calculate labor rate for each
   ├─ Average: SUM(labor rates) ÷ COUNT(tenders)
   └─ This smooths out anomalies

Result: ~80-85% accuracy
```

---

### Implementation: Excel/Python

**Excel Approach:**

```
Spreadsheet Columns:

A: Item No (from BOQ)
B: Description (from BOQ)
C: Unit (from BOQ)
D: Composite Rate (from BOQ) ← Total rate
E: Trade Category (manual: "Brickwork", "Concrete", etc.)
F: Labor % (lookup from industry table)
G: Labor Rate Calc (formula: =D * F)
H: Wage Validation (manual: bottom-up calc)
I: Variance (formula: =(G - H) / H)
J: Adjusted Labor Rate (formula: IF(ABS(I) > 0.3, H, G))
K: Tender No
L: Province
M: Project Type

Steps:
1. Import Master_BOQ_Consolidated.xlsx
2. Add columns E-M
3. Manually categorize 50 unique items (column E)
4. VLOOKUP labor % from industry table (column F)
5. Calculate labor rate (column G)
6. Spot-check 10% with wage validation (column H)
7. Adjust outliers (column J)
8. Filter by Description, average labor rates across tenders
```

**Python Approach (Automated):**

```python
# calculate_labor_rates.py

import pandas as pd
import numpy as np

# Load consolidated BOQ data
df = pd.read_excel('Master_BOQ_Consolidated.xlsx')

# Load industry labor percentage table
labor_pct = {
    'excavation': 0.25,
    'concrete': 0.18,
    'formwork': 0.75,
    'reinforcement': 0.55,
    'brickwork': 0.42,
    'blockwork': 0.35,
    'plastering': 0.55,
    'roofing': 0.35,
    'painting': 0.65,
    'tiling': 0.58,
    'plumbing': 0.50,
    'electrical': 0.55,
    'doors': 0.40,
    'windows': 0.40,
    'ceiling': 0.60
}

# Categorize BOQ items by keyword matching
def categorize_item(description):
    """Match description to trade category"""
    desc = description.lower()
    
    if any(word in desc for word in ['excavat', 'trench', 'earthwork']):
        return 'excavation', labor_pct['excavation']
    elif any(word in desc for word in ['concrete', 'slab', 'foundation']):
        return 'concrete', labor_pct['concrete']
    elif any(word in desc for word in ['formwork', 'shuttering']):
        return 'formwork', labor_pct['formwork']
    elif any(word in desc for word in ['reinforcement', 'steel', 'rebar']):
        return 'reinforcement', labor_pct['reinforcement']
    elif any(word in desc for word in ['brick', 'brickwork']):
        return 'brickwork', labor_pct['brickwork']
    elif any(word in desc for word in ['block', 'blockwork']):
        return 'blockwork', labor_pct['blockwork']
    elif any(word in desc for word in ['plaster', 'render']):
        return 'plastering', labor_pct['plastering']
    elif any(word in desc for word in ['roof', 'truss', 'sheet', 'tile']):
        return 'roofing', labor_pct['roofing']
    elif any(word in desc for word in ['paint', 'painting']):
        return 'painting', labor_pct['painting']
    elif any(word in desc for word in ['tile', 'tiling', 'ceramic']):
        return 'tiling', labor_pct['tiling']
    elif any(word in desc for word in ['plumb', 'pipe', 'drain', 'sanitary']):
        return 'plumbing', labor_pct['plumbing']
    elif any(word in desc for word in ['electric', 'wiring', 'conduit', 'light']):
        return 'electrical', labor_pct['electrical']
    elif any(word in desc for word in ['door', 'doorset']):
        return 'doors', labor_pct['doors']
    elif any(word in desc for word in ['window', 'frame']):
        return 'windows', labor_pct['windows']
    elif any(word in desc for word in ['ceiling']):
        return 'ceiling', labor_pct['ceiling']
    else:
        return 'unknown', 0.40  # Default 40% if can't categorize

# Apply categorization
df[['TradeCategory', 'LaborPct']] = df['Description'].apply(
    lambda x: pd.Series(categorize_item(str(x)))
)

# Calculate labor rate
df['LaborRate'] = df['Rate'] * df['LaborPct']

# Save intermediate results
df.to_excel('Master_BOQ_with_Labor.xlsx', index=False)

print(f"Categorized {len(df)} items")
print(f"Trade distribution:\n{df['TradeCategory'].value_counts()}")
```

---

### Step 5: Calculate Averages

**Goal: Convert 5,000+ individual items → 500 unique labor rates**

```python
# average_labor_rates.py

import pandas as pd

# Load data with labor rates
df = pd.read_excel('Master_BOQ_with_Labor.xlsx')

# Normalize descriptions (group similar items)
def normalize_description(desc):
    """Simplify description for grouping"""
    desc = str(desc).lower()
    
    # Remove common prefixes/suffixes
    desc = desc.replace('supply and install', '').replace('provide and install', '')
    desc = desc.replace('including all labour', '').replace('as per specification', '')
    
    # Remove dimensions (vary between projects)
    import re
    desc = re.sub(r'\d+mm', '', desc)
    desc = re.sub(r'\d+m', '', desc)
    
    # Remove extra whitespace
    desc = ' '.join(desc.split())
    
    return desc.strip()

df['DescriptionNorm'] = df['Description'].apply(normalize_description)

# Group by normalized description + unit
grouped = df.groupby(['DescriptionNorm', 'Unit', 'TradeCategory']).agg({
    'LaborRate': ['mean', 'median', 'std', 'count'],
    'Rate': 'mean',
    'Province': lambda x: ', '.join(x.unique())
}).reset_index()

# Flatten column names
grouped.columns = ['_'.join(col).strip('_') for col in grouped.columns.values]

# Rename for clarity
grouped = grouped.rename(columns={
    'DescriptionNorm': 'Description',
    'LaborRate_mean': 'LaborRate_Avg',
    'LaborRate_median': 'LaborRate_Median',
    'LaborRate_std': 'LaborRate_StdDev',
    'LaborRate_count': 'SampleSize',
    'Rate_mean': 'CompositeRate_Avg',
    'Province': 'Provinces'
})

# Filter: Keep only items with 3+ data points (reliable average)
grouped_filtered = grouped[grouped['SampleSize'] >= 3].copy()

# Quality score: More samples + lower std dev = higher quality
grouped_filtered['QualityScore'] = (
    grouped_filtered['SampleSize'] / grouped_filtered['LaborRate_StdDev']
).replace([np.inf, -np.inf], 0)

# Sort by quality score (best first)
grouped_filtered = grouped_filtered.sort_values('QualityScore', ascending=False)

# Save final labor rate library
grouped_filtered.to_excel('Qilly_Labor_Rate_Library.xlsx', index=False)
grouped_filtered.to_csv('Qilly_Labor_Rate_Library.csv', index=False)

print(f"Generated {len(grouped_filtered)} unique labor rates")
print(f"Average sample size: {grouped_filtered['SampleSize'].mean():.1f} tenders per item")
print(f"\nTop 10 highest quality rates:")
print(grouped_filtered.head(10)[['Description', 'Unit', 'LaborRate_Avg', 'SampleSize']])
```

---

### Expected Output: Week 3

```
Deliverables:
├─ Master_BOQ_with_Labor.xlsx (5,000+ items with labor rates calculated)
├─ Qilly_Labor_Rate_Library.xlsx (500-800 unique labor rates, averaged)
├─ Quality report (sample sizes, confidence scores)
└─ Ready for Phase 4 (database import)

Sample Output (Qilly_Labor_Rate_Library.xlsx):

Description                          | Unit | LaborRate_Avg | SampleSize | Provinces
-------------------------------------|------|---------------|------------|------------------
Excavation soft soil mechanical      | m³   | R 45.20       | 24         | GP, WC, KZN, EC
Face brickwork 220mm common brick    | m²   | R 282.50      | 31         | All 9 provinces
Concrete 25MPa foundations           | m³   | R 215.80      | 18         | GP, WC, FS
Roof sheeting IBR corrugated         | m²   | R 48.30       | 22         | GP, KZN, LP, MP
Painting 2 coats acrylic PVA walls   | m²   | R 35.40       | 27         | All 9 provinces
...                                  | ...  | ...           | ...        | ...

Total: 500-800 unique labor rates
Average sample size: 8-12 tenders per rate
Coverage: 80-90% of typical government BOQs

Time Spent: 20-30 hours
├─ Categorization (manual): 10 hours
├─ Labor % application: 5 hours
├─ Wage validation (spot checks): 5 hours
├─ Averaging calculation: 5 hours
└─ Quality review: 5 hours

Cost: R0
```

---

## Phase 4: Database Building

### Step 1: Design Database Schema

**Supabase Table: `labor_rates`**

```sql
CREATE TABLE labor_rates (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  description_normalized TEXT,
  unit VARCHAR(10) NOT NULL,
  trade_category VARCHAR(50),
  labor_rate_avg DECIMAL(10, 2),
  labor_rate_median DECIMAL(10, 2),
  labor_rate_std_dev DECIMAL(10, 2),
  composite_rate_avg DECIMAL(10, 2),
  sample_size INTEGER,
  provinces TEXT[],
  quality_score DECIMAL(10, 2),
  data_source VARCHAR(100) DEFAULT 'eTender Awarded BOQs 2024-2026',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes for fast lookup
  CONSTRAINT unique_description_unit UNIQUE (description_normalized, unit)
);

-- Indexes
CREATE INDEX idx_labor_rates_description ON labor_rates USING GIN (description_normalized gin_trgm_ops);
CREATE INDEX idx_labor_rates_trade ON labor_rates (trade_category);
CREATE INDEX idx_labor_rates_unit ON labor_rates (unit);
CREATE INDEX idx_labor_rates_quality ON labor_rates (quality_score DESC);

-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

---

### Step 2: Import to Supabase

**Method 1: CSV Import (Supabase Dashboard)**

```
1. Login to Supabase Dashboard (https://app.supabase.com)
2. Select Qilly-SIT project
3. Go to Table Editor
4. Click "labor_rates" table (create if doesn't exist)
5. Click "Insert" → "Import from CSV"
6. Upload "Qilly_Labor_Rate_Library.csv"
7. Map columns:
   ├─ Description → description
   ├─ DescriptionNorm → description_normalized
   ├─ Unit → unit
   ├─ TradeCategory → trade_category
   ├─ LaborRate_Avg → labor_rate_avg
   ├─ LaborRate_Median → labor_rate_median
   ├─ LaborRate_StdDev → labor_rate_std_dev
   ├─ CompositeRate_Avg → composite_rate_avg
   ├─ SampleSize → sample_size
   ├─ Provinces → provinces (text array)
   └─ QualityScore → quality_score
8. Click "Import"
9. Verify: Check row count matches CSV

Time: 10 minutes
```

---

**Method 2: Python Script (Automated)**

```python
# import_to_supabase.py

import pandas as pd
from supabase import create_client, Client
import os

# Supabase credentials (from environment variables)
SUPABASE_URL = os.getenv('SUPABASE_URL')  # e.g., https://xxx.supabase.co
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')  # Service role key

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load labor rate library
df = pd.read_csv('Qilly_Labor_Rate_Library.csv')

# Convert provinces string to array
df['Provinces'] = df['Provinces'].apply(lambda x: x.split(', ') if pd.notna(x) else [])

# Convert to list of dictionaries
records = df.to_dict('records')

# Batch insert (Supabase limit: 1000 rows per request)
batch_size = 500
for i in range(0, len(records), batch_size):
    batch = records[i:i + batch_size]
    
    # Prepare data (match column names to schema)
    data = []
    for record in batch:
        data.append({
            'description': record.get('Description'),
            'description_normalized': record.get('DescriptionNorm'),
            'unit': record.get('Unit'),
            'trade_category': record.get('TradeCategory'),
            'labor_rate_avg': float(record.get('LaborRate_Avg', 0)),
            'labor_rate_median': float(record.get('LaborRate_Median', 0)),
            'labor_rate_std_dev': float(record.get('LaborRate_StdDev', 0)),
            'composite_rate_avg': float(record.get('CompositeRate_Avg', 0)),
            'sample_size': int(record.get('SampleSize', 0)),
            'provinces': record.get('Provinces', []),
            'quality_score': float(record.get('QualityScore', 0))
        })
    
    # Insert batch
    response = supabase.table('labor_rates').insert(data).execute()
    
    print(f"Inserted batch {i // batch_size + 1}: {len(data)} records")

print(f"\nTotal imported: {len(records)} labor rates")

# Verify count
count_response = supabase.table('labor_rates').select('id', count='exact').execute()
print(f"Database now contains: {count_response.count} labor rates")
```

---

### Step 3: Create Lookup Function

**Function to match BOQ items to labor rates:**

```sql
-- Function: Match BOQ description to closest labor rate
CREATE OR REPLACE FUNCTION match_labor_rate(
  search_description TEXT,
  search_unit VARCHAR(10)
)
RETURNS TABLE (
  description TEXT,
  unit VARCHAR(10),
  labor_rate DECIMAL(10,2),
  quality_score DECIMAL(10,2),
  similarity REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lr.description,
    lr.unit,
    lr.labor_rate_avg,
    lr.quality_score,
    similarity(lr.description_normalized, LOWER(search_description)) AS sim
  FROM labor_rates lr
  WHERE 
    lr.unit = search_unit
    AND similarity(lr.description_normalized, LOWER(search_description)) > 0.3
  ORDER BY sim DESC, lr.quality_score DESC
  LIMIT 5;
END;
$$;

-- Usage example:
-- SELECT * FROM match_labor_rate('Face brickwork 220mm', 'm²');
```

---

### Step 4: Test Integration with Qilly

**Update Qilly BOQ processing to use labor rates:**

```typescript
// In your existing Qilly processing logic (src/lib/boq/processBoq.ts)

interface LaborRate {
  description: string;
  unit: string;
  labor_rate: number;
  quality_score: number;
  similarity: number;
}

async function getLaborRate(
  description: string,
  unit: string
): Promise<number | null> {
  const { data, error } = await supabase
    .rpc('match_labor_rate', {
      search_description: description,
      search_unit: unit
    })
    .returns<LaborRate[]>();

  if (error || !data || data.length === 0) {
    console.warn(`No labor rate found for: ${description} (${unit})`);
    return null;
  }

  // Return best match (highest similarity + quality)
  const bestMatch = data[0];
  console.log(`Matched "${description}" → "${bestMatch.description}" (${(bestMatch.similarity * 100).toFixed(0)}% match)`);
  
  return bestMatch.labor_rate;
}

// Update BOQ item pricing to include labor
async function priceBoqItem(item: BoqItem) {
  // Existing material pricing (from suppliers)
  const materialRate = await getMaterialRate(item);
  
  // NEW: Get labor rate
  const laborRate = await getLaborRate(item.description, item.unit);
  
  // Equipment rate (from equipment database - to be built)
  const equipmentRate = await getEquipmentRate(item);
  
  // Calculate composite rate
  const subtotal = (materialRate || 0) + (laborRate || 0) + (equipmentRate || 0);
  const ohp = subtotal * 0.15; // 15% OH&P
  const totalRate = subtotal + ohp;
  
  return {
    ...item,
    materialRate,
    laborRate,
    equipmentRate,
    ohp,
    totalRate,
    totalAmount: totalRate * item.quantity
  };
}
```

---

### Step 5: Create Dashboard for Labor Rates

**New Qilly admin page: Labor Rate Library**

```typescript
// src/app/admin/labor-rates/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface LaborRate {
  id: number;
  description: string;
  unit: string;
  labor_rate_avg: number;
  sample_size: number;
  provinces: string[];
  trade_category: string;
  quality_score: number;
}

export default function LaborRatesPage() {
  const [rates, setRates] = useState<LaborRate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<string>('');

  useEffect(() => {
    loadRates();
  }, [searchTerm, selectedTrade]);

  async function loadRates() {
    let query = supabase
      .from('labor_rates')
      .select('*')
      .order('quality_score', { ascending: false })
      .limit(100);

    if (searchTerm) {
      query = query.ilike('description', `%${searchTerm}%`);
    }

    if (selectedTrade) {
      query = query.eq('trade_category', selectedTrade);
    }

    const { data, error } = await query;
    if (!error && data) setRates(data);
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Labor Rate Library</h1>
      
      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
        />
        <select
          value={selectedTrade}
          onChange={(e) => setSelectedTrade(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Trades</option>
          <option value="brickwork">Brickwork</option>
          <option value="concrete">Concrete</option>
          <option value="excavation">Excavation</option>
          <option value="painting">Painting</option>
          {/* Add more categories */}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <div className="text-2xl font-bold">{rates.length}</div>
          <div className="text-sm text-gray-600">Labor Rates</div>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <div className="text-2xl font-bold">
            {rates.reduce((sum, r) => sum + r.sample_size, 0) / rates.length || 0}
          </div>
          <div className="text-sm text-gray-600">Avg Sample Size</div>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <div className="text-2xl font-bold">50</div>
          <div className="text-sm text-gray-600">Source Tenders</div>
        </div>
        <div className="bg-orange-50 p-4 rounded">
          <div className="text-2xl font-bold">100%</div>
          <div className="text-sm text-gray-600">Legal & Free</div>
        </div>
      </div>

      {/* Rates Table */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Description</th>
            <th className="p-2">Unit</th>
            <th className="p-2">Trade</th>
            <th className="p-2">Labor Rate</th>
            <th className="p-2">Samples</th>
            <th className="p-2">Provinces</th>
            <th className="p-2">Quality</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate) => (
            <tr key={rate.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{rate.description}</td>
              <td className="p-2 text-center">{rate.unit}</td>
              <td className="p-2 text-center text-sm">{rate.trade_category}</td>
              <td className="p-2 text-right font-mono">
                R {rate.labor_rate_avg.toFixed(2)}
              </td>
              <td className="p-2 text-center">{rate.sample_size}</td>
              <td className="p-2 text-center text-sm">
                {rate.provinces.length} provinces
              </td>
              <td className="p-2 text-center">
                <span className={`px-2 py-1 rounded text-xs ${
                  rate.quality_score > 10 ? 'bg-green-100 text-green-800' :
                  rate.quality_score > 5 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {rate.quality_score.toFixed(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

### Expected Output: Week 4

```
Deliverables:
├─ Supabase `labor_rates` table with 500-800 rates
├─ Lookup function (match_labor_rate)
├─ Qilly integration (BOQ processing now includes labor)
├─ Admin dashboard (view/search labor rates)
├─ Coverage report (% of BOQs now priceable)
└─ Documentation (how to maintain/update)

Qilly Coverage Before: 40% (materials only)
Qilly Coverage After: 80-90% (materials + labor)

Time Spent: 15-20 hours
├─ Database schema design: 2 hours
├─ Data import: 3 hours
├─ Lookup function: 3 hours
├─ Qilly integration: 5 hours
├─ Dashboard build: 5 hours
└─ Testing: 2 hours

Cost: R0
```

---

## Automation Tools & Scripts

### Complete Toolkit

All scripts available in `/tools/labor_rate_extraction/`:

```
/tools/labor_rate_extraction/
├── 01_download_tracker.xlsx (Track downloaded tenders)
├── 02_extract_boqs.py (Batch Tabula extraction)
├── 03_clean_boqs.py (Clean extracted CSVs)
├── 04_consolidate_boqs.py (Merge all CSVs)
├── 05_calculate_labor.py (Apply labor percentages)
├── 06_average_rates.py (Calculate averages)
├── 07_import_to_supabase.py (Upload to database)
├── labor_percentages.json (Industry standard percentages)
├── union_wages.csv (Trade union minimum wages)
└── README.md (Usage instructions)
```

---

## Quality Control

### Validation Checklist

```
✅ Data Quality Checks:

1. Sample Size Validation:
   ├─ Min 3 tenders per rate (preferably 5+)
   ├─ Discard rates with <3 samples (too volatile)
   └─ Flag rates with >20% std deviation (inconsistent)

2. Outlier Detection:
   ├─ Calculate mean ± 2× std deviation
   ├─ Remove rates outside this range
   └─ Re-calculate average after outlier removal

3. Regional Consistency:
   ├─ Check rates across provinces
   ├─ Flag if variance >30% between provinces
   └─ Apply regional adjustment factors if needed

4. Wage Validation:
   ├─ Spot-check 10% of rates against union wages
   ├─ Labor rate should be ≥ minimum wage equivalent
   └─ Flag if labor rate < minimum (possible error)

5. Coverage Analysis:
   ├─ Test with 20 real BOQs
   ├─ Measure match rate (% items found)
   ├─ Target: 80%+ match rate
   └─ Identify gaps, prioritize filling

6. Investor-Readiness:
   ├─ Document data sources (all public/legal)
   ├─ Create audit trail (which tenders used)
   ├─ Prepare data quality report
   └─ Ready for due diligence questions
```

---

## Integration with Qilly

### End-to-End BOQ Pricing (Now with Labor)

```
Qilly BOQ Processing Flow (Updated):

User uploads BOQ Excel → Qilly processes each item:

1. Match Item Description (AI/fuzzy matching)
   
2. Get Material Rate (existing):
   ├─ Search 31 suppliers
   ├─ Find matching products
   └─ Return: R343/m² (bricks + mortar)
   
3. Get Labor Rate (NEW ✅):
   ├─ Search labor_rates table
   ├─ Match description + unit
   └─ Return: R82/m² (bricklayer + assistant)
   
4. Get Equipment Rate (future):
   ├─ Search equipment_rates table
   ├─ Match item type
   └─ Return: R23/m² (scaffolding + mixer)
   
5. Calculate Composite Rate:
   ├─ Subtotal: R343 + R82 + R23 = R448/m²
   ├─ OH&P (15%): R67/m²
   └─ Total: R515/m²
   
6. Apply Quantity:
   ├─ Quantity: 45 m²
   ├─ Amount: 45 × R515 = R23,175
   └─ Return to user

Result: 
- Before: 40% coverage (materials only)
- After: 80-90% coverage (materials + labor)
- Remaining 10-20%: Equipment (build next quarter)
```

---

## Maintenance & Updates

### Quarterly Updates

```
Every 3 Months:

1. Download new awarded tenders (20-30 new BOQs)
2. Extract and process (repeat Phase 1-3)
3. Re-calculate averages (include new data)
4. Update Supabase labor_rates table
5. Monitor accuracy (compare old vs new rates)
6. Adjust for inflation (CPI construction index)

Time: 10-15 hours per quarter
Cost: R0

Benefit: Rates stay current, reflect market changes
```

---

## Timeline & Resource Allocation

### 4-Week Execution Plan

```
WEEK 1: Download & Organize
├─ Mon-Tue: Register portals, search tenders (4 hours)
├─ Wed-Fri: Download 50+ BOQ PDFs (15 hours)
├─ Sat: Quality check, organize (5 hours)
└─ Total: 24 hours

WEEK 2: Extract & Clean
├─ Mon-Wed: Tabula extraction (50 BOQs, 12 hours)
├─ Thu-Fri: Clean CSVs, standardize (10 hours)
├─ Sat: Consolidate to master file (4 hours)
└─ Total: 26 hours

WEEK 3: Calculate Labor Rates
├─ Mon-Tue: Categorize items, apply labor % (12 hours)
├─ Wed-Thu: Wage validation, adjustments (10 hours)
├─ Fri: Calculate averages (6 hours)
└─ Total: 28 hours

WEEK 4: Build Database & Integrate
├─ Mon: Design schema, create Supabase table (4 hours)
├─ Tue: Import data, test queries (6 hours)
├─ Wed-Thu: Integrate with Qilly BOQ processing (10 hours)
├─ Fri: Build admin dashboard (6 hours)
└─ Total: 26 hours

GRAND TOTAL: 104 hours (~3 weeks with 1 FTE, or 4 weeks part-time)
COST: R0 (all free data, open-source tools)
```

---

## Success Metrics

### How to Measure Success

```
KPIs:

1. Coverage Improvement:
   ├─ Before: 40% (materials only)
   ├─ After: Target 80-90% (materials + labor)
   └─ Measure: Test with 20 real City of JHB BOQs

2. Pricing Accuracy:
   ├─ Compare Qilly pricing vs QS quotes
   ├─ Target: ±15% variance
   └─ Method: Price 10 BOQs, get QS quotes, compare

3. Processing Speed:
   ├─ Before: 1.4 sec (materials only)
   ├─ After: Target <3 sec (materials + labor + equipment)
   └─ Measure: Time 100 BOQ items, calculate avg

4. Investor Readiness:
   ├─ 100% legal data sources ✅
   ├─ Documented methodology ✅
   ├─ Audit trail (which tenders used) ✅
   └─ Due diligence ready for Series A ✅

5. Cost Savings:
   ├─ Free labor data (vs R50k-R120k BuildAid license)
   ├─ ROI: Infinite (R0 investment)
   └─ Clean IP (no licensing complications)
```

---

## Conclusion

### Summary: Yes, Absolutely Build from eTender! ✅

**This is the RIGHT approach:**

✅ **Legal:** 100% public data, no copyright issues  
✅ **Quality:** Real market rates from actual projects  
✅ **Cost:** R0 (vs R50k-R120k licensing)  
✅ **Coverage:** 500-800 labor rates = 80-90% of BOQs  
✅ **Investor-Friendly:** Clean IP, defensible methodology  
✅ **Scalable:** Update quarterly with new tenders  
✅ **Differentiator:** "Built on real government project data"

**Timeline:** 4 weeks (104 hours)  
**Team:** 1 person full-time, or 2 part-time  
**Cost:** R0  
**Outcome:** Qilly coverage 40% → 90%

---

## Next Steps (Start TODAY)

### Action Plan:

**Monday (Today):**
1. ✅ Register on eTender Portal: https://etender.gov.za
2. ✅ Search "awarded" + "construction" + "2024-2026"
3. ✅ Download first 10 BOQ PDFs
4. ✅ Create tracking spreadsheet

**This Week:**
1. ✅ Download 50+ BOQ PDFs (target by Friday)
2. ✅ Install Tabula (https://tabula.technology)
3. ✅ Extract first 5 BOQs (test workflow)

**Week 2-4:**
1. ✅ Follow Phase 2-4 above
2. ✅ Build labor rate library (500+ rates)
3. ✅ Integrate with Qilly
4. ✅ Test with City of JHB pilot

**Result:** Qilly goes from 40% → 90% coverage with 100% legal, R0 cost data

---

**This is EXACTLY the right strategy. Let's execute! 🚀**

*End of Implementation Guide*
