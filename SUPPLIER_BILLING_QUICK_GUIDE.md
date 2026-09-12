# 💰 How Qilly Bills Suppliers - Quick Guide

## 🎯 Answer: Freemium + Tiered Subscription Model

Qilly charges suppliers based on a **4-tier subscription model** with monthly or annual billing.

---

## 💵 Pricing Tiers

### **1. FREE Tier** - R0/month
- Basic product catalog (50 products)
- Manual price updates
- Standard search visibility
- **Target:** Small suppliers, testing platform

### **2. PROFESSIONAL Tier** - R2,500/month
- Unlimited products
- API integration
- Real-time price updates
- Priority search ranking
- Advanced analytics
- **Target:** Growing suppliers (Buco, Builders branches)

### **3. ENTERPRISE Tier** - R7,500/month
- Government compliance API
- SANS 1200, NBR, AGRÉMENT, BBBEE
- Priority on DHS projects (R10M-R43M)
- Dedicated account manager
- **Target:** Large suppliers, government contractors

### **4. CUSTOM Tier** - R15,000+/month (negotiated)
- Multi-location management
- Custom ERP integration
- Strategic partnerships
- Co-branded marketing
- **Target:** National chains (Cashbuild, PPC, Lafarge)

---

## 💳 How Billing Works

### **Payment Methods:**
- Credit/debit card (Stripe/PayFast)
- EFT/bank transfer
- Debit order (recurring)
- Invoice with 30-day terms (Enterprise+)

### **Billing Cycle:**
- **Monthly:** Billed on signup anniversary
- **Annual:** Pay upfront, save 10%
- **Grace Period:** 7 days for failed payments
- **Auto-downgrade:** To Free tier after grace period

### **Example:**
```
Day 1:  Supplier signs up → Free tier
Day 1:  Upgrades to Professional → R2,500 charged
Day 30: Renewal → R2,500 charged
Day 60: Renewal → R2,500 charged
```

---

## 📊 Why Suppliers Would Pay

### **Professional Tier ROI (R2,500/month):**
- Access to 50-100 contractors
- 100-500 quote requests/month
- Win just 2% = 2-10 projects
- Average R50,000/project = **R100,000 revenue**
- **Cost:** R2,500 → **ROI: 40x**
- **Break-even:** Just 1 small project/month

### **Enterprise Tier ROI (R7,500/month):**
- Priority access to DHS projects
- 1 DHS project/year at R10M × 3% margin = **R300,000 profit**
- **Cost:** R90,000/year → **ROI: 3.3x**
- **Break-even:** 1 medium DHS project pays for 3+ years

---

## 📈 Revenue Projections

### **Year 2 (50 suppliers):**
```
Free:         15 suppliers × R0      = R0
Professional: 25 suppliers × R2,500  = R62,500/month
Enterprise:   8 suppliers  × R7,500  = R60,000/month
Custom:       2 suppliers  × R25,000 = R50,000/month
                                       ─────────────
                            TOTAL:     R172,500/month
                                       R2.07M/year
```

### **Year 3 (300 suppliers):**
```
R1,087,500/month = R13.05M/year
```

---

## 🚀 Implementation Status

**Current:** ⚠️ **NOT IMPLEMENTED**
- No supplier billing system exists yet
- Suppliers currently signup for free
- No payment processing

**Next Steps:**
1. **Phase 1 (Month 1-2):** Manual billing (EFT + invoices)
2. **Phase 2 (Month 3-4):** Automated Stripe/PayFast billing
3. **Phase 3 (Month 5-6):** Enterprise tier + compliance API

**Launch Strategy:**
- **Year 1:** All suppliers FREE (build catalog)
- **Year 2:** Introduce paid tiers
- **Year 3:** Full pricing in effect

---

## 🎨 Visual Component Created

**New File:** `/src/app/components/SupplierPricingTiers.tsx`

A complete React component showing:
- ✅ All 4 pricing tiers with features
- ✅ Monthly/annual billing toggle
- ✅ ROI calculator for each tier
- ✅ Feature comparison table
- ✅ Support level breakdown
- ✅ API access details
- ✅ FAQ section

**To Use:**
```tsx
import { SupplierPricingTiers } from './components/SupplierPricingTiers';

<SupplierPricingTiers />
```

---

## 📁 Documentation Created

1. **`/SUPPLIER_BILLING_STRATEGY.md`** - Complete 50-page strategy document
2. **`/src/app/components/SupplierPricingTiers.tsx`** - Interactive pricing component
3. **`/SUPPLIER_BILLING_QUICK_GUIDE.md`** - This summary document

---

## 🔑 Key Decisions

**Recommended Model:** Freemium + Tiered Subscriptions

**Why This Model:**
- ✅ Low barrier to entry (free tier)
- ✅ Clear upgrade path
- ✅ Predictable revenue
- ✅ Scales with supplier value
- ✅ Aligns with customer pricing model

**Alternative Models:**
- Commission-based (2-5% of sales)
- Hybrid (base fee + commission)
- Lead generation (per quote fee)

---

## 💡 Quick Comparison

| Tier | Price | Best For | Key Feature |
|------|-------|----------|-------------|
| **Free** | R0 | Testing | Basic listing |
| **Professional** | R2,500/mo | Growing | API + Analytics |
| **Enterprise** | R7,500/mo | Government | Compliance API |
| **Custom** | R15K+/mo | Chains | ERP integration |

---

## ✅ Summary

**How Qilly Bills Suppliers:**
1. **Free tier** to attract suppliers
2. **R2,500/month Professional** for API access
3. **R7,500/month Enterprise** for government projects
4. **Custom pricing** for strategic partners

**Payment:** Monthly or annual (10% discount)  
**Method:** Card, EFT, or invoice  
**Implementation:** Coming in Year 2

---

**See full details:** `/SUPPLIER_BILLING_STRATEGY.md`  
**Interactive component:** `/src/app/components/SupplierPricingTiers.tsx`
