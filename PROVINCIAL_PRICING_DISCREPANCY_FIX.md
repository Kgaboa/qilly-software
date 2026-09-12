# 🚨 PROVINCIAL PRICING DISCREPANCY FOUND & FIX
**Date:** February 23, 2026

## ❌ THE PROBLEM

You have **TWO DIFFERENT SQL scripts** with **CONFLICTING VALUES**:

### Script 1: `/src/utils/sql/provincial_pricing_factors.sql`
**3 Base Provinces (WC, GP, KZN all = 1.0)**
```sql
('WC',  'Western Cape',    1.00, 'Cape Town metro area - major supply hub'),
('GP',  'Gauteng',         1.00, 'Johannesburg/Pretoria metro - major supply hub'),
('KZN', 'KwaZulu-Natal',   1.00, 'Durban metro area - major supply hub'),
```

### Script 2: `/EFFICIENT_PROVINCIAL_PRICING.sql`
**1 Base Province (Only GP = 1.0, WC and KZN have adjustments)**
```sql
('gauteng',        'Gauteng',         'GP',  1.00, ...),
('western-cape',   'Western Cape',    'WC',  1.05, '+5% - Distance from GP, coastal logistics'),
('kwazulu-natal',  'KwaZulu-Natal',   'KZN', 1.03, '+3% - Coastal port access, good infrastructure'),
```

## 🔍 WHICH ONE IS CORRECT?

Based on South African construction industry reality:

### ✅ **Script 2 (`/EFFICIENT_PROVINCIAL_PRICING.sql`) is MORE ACCURATE**

**Why?**
1. **Gauteng (GP) is the TRUE base** - Johannesburg is the manufacturing and distribution hub
2. **Cape Town (WC)** - Despite having a port, still needs transport from GP manufacturers (+5%)
3. **Durban (KZN)** - Port city but many materials still come from GP manufacturing (+3%)

### Real-world pricing logic:
- Most construction materials are manufactured in Gauteng
- Even coastal cities import from GP or pay similar prices due to:
  - Manufacturer concentration in GP
  - Transport costs from other provinces
  - Import logistics through ports vs inland distribution

## ✅ RECOMMENDED FIX

Update hardcoded values to match the more accurate approach (GP only as base):

| Province | Current (Wrong) | Correct | Change |
|----------|----------------|---------|--------|
| WC | 1.00 | 1.05 | +5% |
| GP | 1.00 | 1.00 | No change |
| KZN | 1.00 | 1.03 | +3% |
| EC | 1.08 | 1.08 | No change |
| FS | 1.06 | 1.05 | -1% |
| LP | 1.12 | 1.06 | -6% |
| MP | 1.07 | 1.04 | -3% |
| NC | 1.15 | 1.12 | -3% |
| NW | 1.09 | 1.07 | -2% |

## 📋 ACTION PLAN

### Option A: Update to GP-Only Base (RECOMMENDED)
This is more realistic and aligns with industry practice.

### Option B: Keep 3-Base System
Less realistic but simpler if you prefer coastal cities as equals to GP.

---

## 🎯 I'LL FIX IT NOW

Which approach do you want?
1. **GP-only base** (more accurate, realistic)
2. **3-base system** (simpler, treats WC/GP/KZN as equals)

Let me know and I'll update all files to be consistent!
