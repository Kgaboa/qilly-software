# ✅ Both "Choose Your Tier" Pages Updated

**Date:** 2026-03-13  
**Status:** ✅ COMPLETE  

---

## 🎯 ISSUE RESOLVED

There were **TWO** different "Choose Your Tier" pages with inconsistent sizing and features:

1. **SubscriptionUpgradeModal** - For existing users upgrading (was too small, max-w-6xl)
2. **TierSelectionStep** - For new contractor signups (larger, had outdated features)

**Both are now synchronized with:**
- ✅ Same feature lists
- ✅ Same pricing (FREE R0, PROFESSIONAL R2,999, ENTERPRISE R8,999, CUSTOM Contact Sales)
- ✅ Same sizing (max-w-7xl for both)
- ✅ Accurate restrictions clearly marked

---

## 📊 UPDATED COMPONENTS

### 1. **SubscriptionUpgradeModal** (`/src/app/components/payments/SubscriptionUpgradeModal.tsx`)

**Changes:**
- ✅ Width increased from `max-w-6xl` to `max-w-7xl`
- ✅ All tier features updated to match accurate requirements
- ✅ FREE tier added as non-selectable comparison card
- ✅ 4-column grid layout

**Usage:** Triggered by "Upgrade" button in MainDashboard for existing FREE tier users

---

### 2. **TierSelectionStep** (`/src/app/components/TierSelectionStep.tsx`)

**Changes:**
- ✅ All tier features updated to match SubscriptionUpgradeModal
- ✅ Pricing updated (PROFESSIONAL R2,999, ENTERPRISE R8,999)
- ✅ Feature descriptions standardized
- ✅ Already uses max-w-7xl (no change needed)

**Usage:** Triggered by "Sign up as Contractor" button for new users

---

## 📋 SYNCHRONIZED FEATURES

### 🆓 FREE TIER
**Both Pages Show:**
- ✅ Template library (5 templates, 1 per project type)
- ✅ Unlimited training BOQs
- ✅ View BOQ structure (pricing encrypted)
- ✅ Email support
- ❌ All pricing: R ●●●●●●
- ❌ All percentages: ●●●%
- ❌ Custom BOQ upload (templates only)
- ❌ Item Matching (completely blocked)
- ❌ Excel export
- ❌ Project history
- ❌ Basic compliance calculator
- ❌ Green building features
- ❌ Tender response generation
- ❌ Future price projections
- ❌ Collusion detection

---

### 💼 PROFESSIONAL TIER
**Both Pages Show:**
- ✅ 10 BOQs per month
- ✅ Custom BOQ upload (Excel/CSV)
- ✅ Live pricing (all amounts visible)
- ✅ 10 templates
- ✅ PDF export (no watermark)
- ✅ Excel export
- ✅ Real-time pricing
- ✅ Multi-supplier comparison
- ✅ Regional pricing
- ✅ Full compliance calculator
- ✅ Compliance documents
- ✅ P&G costs
- ✅ Tender response generator (PDF)
- ✅ 6 months project history
- ✅ Email + Chat support
- ❌ Green building features
- ❌ Carbon tracking
- ❌ Collusion detection
- ❌ eTender integration

**Price:** R2,999/month

---

### 🏛️ ENTERPRISE TIER
**Both Pages Show:**
- ✅ Everything in Professional
- ✅ 30 BOQs per month
- ✅ 15 templates
- ✅ 🌿 Green building features
- ✅ 🌿 Carbon tracking per BOQ item
- ✅ 🌿 Green materials database
- ✅ 🌿 Environmental dashboard
- ✅ 📈 Future price projections
- ✅ 📋 Advanced compliance documents
- ✅ 🛡️ Collusion detection
- ✅ 🔗 eTender integration
- ✅ 🔌 API access
- ✅ Unlimited project history
- ✅ 5 concurrent users
- ✅ Priority support

**Price:** R8,999/month  
**Badge:** "For DHS Contracts"

---

### 🎨 CUSTOM TIER
**Both Pages Show:**
- ✅ Everything in Enterprise
- ✅ Unlimited BOQs
- ✅ Unlimited templates
- ✅ Custom templates
- ✅ White-label solution
- ✅ Custom integrations
- ✅ On-premise deployment
- ✅ Multi-company support
- ✅ SLA guarantees
- ✅ Unlimited users
- ✅ 24/7 support
- ✅ Dedicated account manager
- ✅ Custom training

**Price:** Contact Sales

---

## 🎨 VISUAL CONSISTENCY

### Modal Width
- **Before:** SubscriptionUpgradeModal = `max-w-6xl`, TierSelectionStep = `max-w-7xl` (inconsistent)
- **After:** Both = `max-w-7xl` ✅

### Grid Layout
- Both use 4-column grid: `grid md:grid-cols-4 gap-4`

### Badges
- **FREE:** "CURRENT PLAN" (upgrade modal) / "🎓 Unlimited Training BOQs" (signup)
- **PROFESSIONAL:** "MOST POPULAR" (upgrade) / "💼 10 BOQs/month" (signup)
- **ENTERPRISE:** "FOR DHS CONTRACTS" / "🏛️ For DHS Contracts" (both)
- **CUSTOM:** "CONTACT SALES" / "👑 White Glove Service" (both)

### Feature Display
- Both use ✅ for allowed features
- Both use ❌ with strikethrough for restricted features
- Both have scrollable feature lists (`max-h-64 overflow-y-auto` in upgrade modal)

---

## 🔄 USER FLOWS

### Flow 1: New Contractor Signup
```
User clicks "Sign up as Contractor"
    ↓
TierSelectionStep displayed (max-w-7xl)
    ↓
User sees 4 tiers with accurate features
    ↓
Selects tier → Continues to details form
```

### Flow 2: Existing FREE Tier Contractor Upgrade
```
FREE tier contractor logs in
    ↓
Sees training mode banner
    ↓
Clicks "Upgrade" button
    ↓
SubscriptionUpgradeModal opens (max-w-7xl)
    ↓
User sees 4 tiers (FREE grayed out as "CURRENT PLAN")
    ↓
Selects paid tier → Payment options
```

---

## ✅ CONSISTENCY CHECKLIST

- [x] Both pages show identical feature lists
- [x] Both pages use same pricing (R0, R2,999, R8,999, Contact Sales)
- [x] Both pages have same modal width (max-w-7xl)
- [x] Both pages use 4-column grid layout
- [x] Both pages highlight ENTERPRISE tier for DHS
- [x] Both pages clearly mark restricted features with ❌
- [x] Both pages emphasize green building in ENTERPRISE
- [x] Both pages show "Contact Sales" for CUSTOM tier

---

## 🚀 READY FOR PRESENTATION

**Status:** ✅ Production Ready

Both "Choose Your Tier" pages are now:
- Synchronized in features
- Consistent in sizing
- Accurate in restrictions
- Ready for Tuesday's investor presentation

The upgrade path is clear:
- New contractors see full tier comparison during signup
- Existing FREE tier users see same comparison when upgrading
- Both flows emphasize ENTERPRISE tier for DHS contracts with carbon tracking

---

## 📁 FILES MODIFIED

1. `/src/app/components/payments/SubscriptionUpgradeModal.tsx`
   - Width: max-w-6xl → max-w-7xl
   - Features: Updated all 4 tiers
   - FREE tier: Added as non-selectable comparison

2. `/src/app/components/TierSelectionStep.tsx`
   - Features: Updated all 4 tiers
   - Pricing: Updated to R2,999 and R8,999
   - Descriptions: Standardized across tiers

---

**Last Updated:** 2026-03-13  
**Investor Presentation:** Tuesday with eTender  
**Contact:** support@qilly.co.za
