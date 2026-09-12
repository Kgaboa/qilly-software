# Qilly Inflation Projection Feature - Implementation & Client Communication Guide

## 📊 IMPORTANT: Current Data Status

⚠️ **The inflation rates currently shown (8.2%, 7.1%, 6.8%) are EXAMPLE DATA ONLY.**

Before launching this feature to production, you MUST replace these with verified actual data from official sources.

---

## 1. Where to Get REAL Inflation Data

### Official Sources for South African Construction Material Inflation

#### **A. Statistics South Africa (Stats SA)** ⭐ PRIMARY SOURCE
- **Website:** www.statssa.gov.za
- **Report:** Producer Price Index (PPI) - Construction Materials
- **Frequency:** Published monthly
- **What to look for:**
  - PPI for "Building and other construction materials"
  - Year-on-year percentage change
  - Subcategories: Cement, steel, bricks, timber, hardware
- **How to access:**
  1. Go to statssa.gov.za
  2. Navigate to: Publications → Price Statistics → PPI
  3. Download latest PPI report (PDF)
  4. Look for Table: "PPI - Construction materials (year-on-year % change)"

#### **B. South African Reserve Bank (SARB)**
- **Website:** www.resbank.co.za
- **Database:** Economic Data Portal
- **What to look for:**
  - Construction cost indices
  - Building material price inflation
- **How to access:**
  1. Visit resbank.co.za
  2. Go to: Research & Publications → Economic & Financial Data
  3. Search: "construction material prices"

#### **C. Bureau for Economic Research (BER)**
- **Organization:** University of Stellenbosch
- **Reports:** Quarterly building cost indices
- **Website:** www.ber.ac.za
- **Contact:** Subscribe to their construction sector reports (paid)

#### **D. Association of South African Quantity Surveyors (ASAQS)**
- **Website:** www.asaqs.co.za
- **Resources:** Construction cost escalation data
- **Regional data:** Price variations by province

#### **E. Major Supplier Annual Reports**
- **PPC Limited:** Cement price trends (www.ppc.co.za → Investor Relations)
- **ArcelorMittal SA:** Steel pricing (www.arcelormittalsa.com)
- **Lafarge South Africa:** Concrete & aggregates pricing
- **Why:** These companies announce price increases publicly in financial reports

---

## 2. How the Feature Works (Technical)

### Calculation Method

```javascript
// Current Price
currentPrice = R8,057,338.72

// 6 Months Projection (half-year inflation)
price6Months = currentPrice × (1 + (inflationRate / 100) × 0.5)
// Example: R8,057,338.72 × (1 + 0.075 × 0.5) = R8,359,165.32

// 12 Months Projection (full year inflation)
price12Months = currentPrice × (1 + (inflationRate / 100))
// Example: R8,057,338.72 × (1 + 0.075) = R8,661,639.12
```

### Customizable Rate
- Default: 7.5% annual inflation
- Range: 0% - 20%
- Users can adjust based on their market intelligence or risk tolerance

---

## 3. How to Explain This to Clients

### **Scenario 1: Client Asks "Where do these numbers come from?"**

**Your Response:**

"Great question! Our inflation projections are based on official data from Statistics South Africa (Stats SA), specifically their Producer Price Index for construction materials. 

We track historical trends from the South African Reserve Bank and industry reports from quantity surveyor associations. The rates you see (currently showing 7.5% as an example) reflect the average annual price increases for construction materials over the past 3-5 years.

However, these are **estimates**, not guarantees. Actual prices depend on:
- Exchange rate fluctuations (Rand/Dollar)
- Global commodity prices (steel, fuel)
- Eskom electricity tariff increases
- Supply chain disruptions
- Specific supplier contracts

We update our baseline rates quarterly to reflect current market conditions, and you can adjust the percentage if you have specific market intelligence or prefer a more conservative/aggressive assumption."

---

### **Scenario 2: Client Asks "Why should I care about future prices?"**

**Your Response:**

"This feature helps you with **financial planning and risk management** in three key ways:

**1. Budget Planning**
- If your project starts in 6 months, today's prices won't apply
- Historical data shows SA construction materials rise 6-10% annually
- You need to budget the actual amount you'll pay, not today's price

**2. Decision Making**
- Should you buy materials now and store them?
- Should you negotiate a price lock-in with suppliers?
- Is it worth delaying the project, considering price increases?

**3. Client Communication**
- If you're a contractor, you can show clients why delaying increases costs
- Justifies contingency reserves in your tender
- Protects you from margin erosion if prices spike

**Example:** 
Your current BOQ is R8 million. If you start in 6 months with 7.5% inflation, you'll actually need ~R8.3 million - that's R300,000 more! Without planning for this, your profit margin disappears or you go over budget."

---

### **Scenario 3: Client Asks "How accurate are these predictions?"**

**Your Response (Be Honest):**

"These projections are **directional estimates**, not guarantees. Here's how to think about accuracy:

**What's Reliable:**
- ✅ Historical inflation trends (6-10% for SA construction materials is well-documented)
- ✅ Structural factors (energy costs, exchange rates) that drive inflation
- ✅ Relative comparison: delaying costs more than starting now

**What's Uncertain:**
- ❌ Exact percentage for future months (could be 5% or 12% depending on events)
- ❌ Timing of supplier price increases (they don't increase smoothly monthly)
- ❌ Black swan events (e.g., global pandemic, major currency crash)

**Our Recommendation:**
1. Use these projections for **budgeting and planning**
2. Add an extra 2-3% **contingency buffer** for safety
3. Get **fresh quotes from suppliers** 30 days before you purchase
4. Consider **price lock-in agreements** with key suppliers for large orders

Think of it like weather forecasts: we can reliably say 'it will be warmer in summer than winter,' but we can't guarantee the exact temperature on August 15th. Similarly, we can reliably say prices will be higher in 12 months, but the exact percentage may vary."

---

## 4. Material-Specific Inflation Rates

Different materials inflate at different rates. Update these based on real data:

### Current Example Ranges (REPLACE WITH REAL DATA):

| Material Category | Typical Annual Inflation | Why? |
|------------------|------------------------|------|
| **Bulk Materials** | 8-10% | Energy-intensive production (cement kilns), imported (fuel for transport), heavy (high transport costs) |
| **Steel & Metal** | 8-12% | Priced in USD, global commodity, energy-intensive manufacturing |
| **Bricks & Blocks** | 6-8% | Local production reduces currency impact, but energy costs still high |
| **Timber** | 7-9% | Imported timber = currency exposure, local = moderate inflation |
| **Hardware & Fittings** | 5-7% | Smaller items, less transport cost impact, some local manufacturing |
| **Paint & Coatings** | 6-8% | Chemical inputs (often imported), moderate transport costs |

**Where to get material-specific rates:**
- Stats SA publishes PPI subcategories for different construction materials
- Individual supplier price increase announcements (check their websites/reports)

---

## 5. Legal & Compliance Considerations

### **⚠️ Disclaimer Requirement**

ALWAYS include a disclaimer when showing inflation projections:

**Minimum Disclaimer Text:**
"These projections are estimates based on historical trends and current economic conditions. Actual future prices may vary due to market volatility, exchange rates, global commodity prices, and other economic factors. We recommend obtaining updated quotes from suppliers before committing to purchases."

**Why this matters:**
- You're not a financial advisor or economist
- Clients might make business decisions based on your projections
- If projections are wildly wrong, you need legal protection
- Shows professionalism and transparency

### **What NOT to Say:**
- ❌ "Prices will definitely increase by 7.5%"
- ❌ "This is guaranteed accurate"
- ❌ "You should definitely buy now based on this"
- ❌ "We have inside information from suppliers"

### **What TO Say:**
- ✅ "Based on historical trends, we estimate..."
- ✅ "Stats SA data suggests construction materials typically increase..."
- ✅ "This helps with planning, but please verify with suppliers"
- ✅ "We recommend adding contingency for price volatility"

---

## 6. Updating the Code with Real Data

### Step 1: Research Current Actual Rates

Visit Stats SA website and compile:
- 2023 actual inflation: _____% (REPLACE)
- 2024 actual inflation: _____% (REPLACE)
- 2025 actual inflation: _____% (REPLACE)
- 2026 estimated: _____% (REPLACE)

### Step 2: Update the Component

Open `/src/app/components/RegionalPricedBillView.tsx` and find lines 803-816:

```typescript
<div className="bg-gray-50 p-3 rounded">
  <div className="text-gray-600 mb-1">2023</div>
  <div className="text-lg font-bold text-gray-900">8.2%</div>  // ← CHANGE THIS
  <div className="text-gray-500">Steel & cement spike</div>    // ← CHANGE THIS
</div>
```

Replace with your researched data.

### Step 3: Update Default Inflation Rate

Line 51 sets the default:
```typescript
const [customInflationRate, setCustomInflationRate] = useState<number>(7.5);
```

Change `7.5` to your researched 2026 estimate.

### Step 4: Update Material-Specific Ranges

Lines 713-725 show material-specific inflation. Update these based on Stats SA subcategory data.

---

## 7. Marketing This Feature to Clients

### **Value Propositions:**

**For Contractors:**
- "Protect your profit margins from material cost increases"
- "Justify contingency pricing to clients with data-backed projections"
- "Make informed decisions about material procurement timing"

**For Project Managers:**
- "Budget accurately for projects starting in the future"
- "Show stakeholders the cost of project delays"
- "Plan cash flow with realistic cost projections"

**For Quantity Surveyors:**
- "Add professional inflation analysis to your BOQs"
- "Backed by Stats SA and SARB official data"
- "Adjust assumptions to match your market intelligence"

### **How to Position It:**

"Qilly is the only construction BOQ system in South Africa that includes forward-looking price projections based on official inflation data. While other systems just show today's prices, we help you plan for the real costs you'll face when your project actually starts."

---

## 8. Best Practices for Clients

### Teach your clients to:

1. **Always Add Contingency**
   - Even with inflation projections, add 2-3% buffer
   - Protects against volatility

2. **Get Fresh Quotes**
   - Use Qilly projections for planning
   - Get supplier quotes 30 days before purchase for execution

3. **Consider Price Lock-Ins**
   - For large orders, negotiate fixed prices with suppliers
   - Especially valuable when inflation is high

4. **Monitor Exchange Rates**
   - If Rand weakens significantly, imported materials spike
   - Watch USD/ZAR for early warning

5. **Review Quarterly**
   - Construction inflation changes quarter to quarter
   - Re-run Qilly projections every 3 months for long-term projects

---

## 9. FAQ for Your Sales/Support Team

**Q: Is this feature free?**
A: Yes, included with all Qilly subscriptions.

**Q: Can clients change the inflation rate?**
A: Yes, they can adjust from 0-20% based on their assumptions.

**Q: How often do you update the historical data?**
A: Quarterly, when Stats SA releases new PPI reports.

**Q: What if a client makes a business decision based on wrong projections?**
A: We include a disclaimer that these are estimates. Always recommend they verify with suppliers.

**Q: Can we show projections beyond 12 months?**
A: Currently limited to 6 and 12 months. Long-term projections (2-3 years) are too uncertain.

**Q: Do you factor in specific supplier contracts?**
A: No, this is macro-level inflation. If clients have locked-in pricing with suppliers, they should override the rate to 0%.

---

## 10. Roadmap Enhancements (Future)

Consider adding in future versions:

1. **Material-Specific Inflation**
   - Apply different rates to cement vs steel vs bricks
   - More accurate projections

2. **Regional Variation**
   - Western Cape vs Gauteng inflation differences
   - Coastal vs inland logistics costs

3. **Confidence Intervals**
   - Show "best case 5%, worst case 10%, likely 7.5%"
   - More sophisticated risk analysis

4. **Historical Comparison**
   - Show how accurate past projections were
   - Build client trust

5. **Supplier Price Feeds**
   - Real-time updates from Buco, Macsteel, etc.
   - Actual prices instead of estimates

---

## 11. Summary Checklist

Before launching to production:

- [ ] Research actual inflation rates from Stats SA
- [ ] Update lines 803-816 with real historical data
- [ ] Update default rate (line 51) with current estimate
- [ ] Update material-specific ranges (lines 713-725)
- [ ] Add "last updated" date to the disclaimer
- [ ] Train sales/support team on how to explain feature
- [ ] Add FAQ to website/help docs
- [ ] Test calculations with various inflation rates
- [ ] Legal review of disclaimer text
- [ ] Set calendar reminder to update quarterly

---

## 12. Contact for Data Sources

**Statistics South Africa:**
- Email: info@statssa.gov.za
- Phone: 012 310 8911
- Request: "Latest PPI data for construction materials"

**South African Reserve Bank:**
- Data queries: statistics@resbank.co.za
- Request: "Historical construction cost indices"

**Bureau for Economic Research:**
- Website: www.ber.ac.za
- Subscriptions: Subscribe to construction sector reports

---

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Next Review:** May 2026 (Quarterly)  

**Maintained by:** Qilly Development Team  
**For questions:** Contact your technical lead

---

## Appendix: Sample Client Email Template

```
Subject: NEW: Future Price Projections Feature in Qilly 📈

Hi [Client Name],

We're excited to announce a new feature in Qilly that helps you plan for future construction material costs!

**What's New:**
Qilly now shows you estimated BOQ costs at 6 and 12 months in the future, based on South African construction material inflation trends.

**Why This Matters:**
Construction materials typically increase 6-10% annually in South Africa. If your project starts in 6 months, today's prices won't apply - you need to budget for future costs.

**How It Works:**
1. Upload and price your BOQ as normal
2. Click "Show Projections" in the new Inflation section
3. See your BOQ costs projected forward with adjustable inflation rates
4. Based on official Stats SA and SARB data

**Try It Now:**
Log into Qilly and price any BOQ to see the new feature in action!

Questions? Just reply to this email.

Best regards,
The Qilly Team
```

---

**END OF GUIDE**
