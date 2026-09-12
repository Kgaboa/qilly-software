# Payment Gateway Comparison for Qilly (South Africa)

## Executive Summary

**Recommendation:** Use **PayFast as primary** for South African customers, with **Stripe as optional** for international expansion.

---

## Detailed Comparison

### PayFast 🇿🇦 (RECOMMENDED FOR SA)

#### ✅ Advantages
- **Made for South Africa** - Local company, local support
- **Best Local Payment Methods:**
  - All South African banks (EFT, Instant EFT)
  - Credit/Debit cards (Visa, Mastercard)
  - eBucks, Mobicred, Payflex (buy now, pay later)
  - SCode (cellphone payments)
- **Lower Fees for SA Transactions:**
  - 2.9% + R2.00 per transaction (similar to Stripe)
  - No international conversion fees for ZAR
- **Compliance:**
  - POPIA compliant (Protection of Personal Information Act)
  - PCI DSS Level 1 certified
  - South African banking regulations
- **Settlement:**
  - Fast payouts to SA bank accounts (2-3 business days)
  - ZAR settlements (no forex risk)
- **Local Support:**
  - South African-based support team
  - Understands local business needs
  - Easy integration documentation

#### ⚠️ Limitations
- Primarily South Africa focused (limited international reach)
- No automatic subscription management (you manage recurring billing)
- Less advanced features than Stripe (no ML fraud detection)

#### 💰 Pricing
- **2.9% + R2.00** per successful transaction
- **No setup fees**
- **No monthly fees**
- **No hidden costs**

#### 🔧 Best For
- ✅ South African Department of Human Settlements project
- ✅ Local construction companies
- ✅ Government/municipal payments
- ✅ BBBEE compliance tracking
- ✅ ZAR-only transactions

---

### Stripe 🌍 (OPTIONAL FOR INTERNATIONAL)

#### ✅ Advantages
- **Global Reach** - Accept payments from 135+ currencies
- **Advanced Features:**
  - Built-in subscription management (Stripe Billing)
  - Automatic proration calculations
  - Smart retry logic for failed payments
  - ML-powered fraud detection (Stripe Radar)
  - Revenue recognition (Stripe Revenue Recognition)
- **Developer Experience:**
  - Excellent documentation
  - Pre-built React components (Stripe Elements)
  - Webhooks for all events
  - Test mode with realistic test cards
- **International Payments:**
  - Multi-currency support
  - Automatic currency conversion
  - Global card networks
- **Compliance:**
  - PCI DSS Level 1
  - SCA (Strong Customer Authentication) for Europe
  - Local payment methods worldwide

#### ⚠️ Limitations
- **Higher Costs for SA:**
  - 2.9% + R2.00 (same base rate)
  - **+2% international card fee** (if customer uses non-SA card)
  - **+1% currency conversion** (if accepting USD/EUR)
- **Payout Delays:**
  - 7-14 days to South African bank accounts
  - Longer verification process for SA businesses
- **Support:**
  - Email/chat only (no SA phone support)
  - Time zone differences

#### 💰 Pricing (South Africa)
- **2.9% + R2.00** (SA cards)
- **4.9% + R2.00** (International cards)
- **+1%** (currency conversion if needed)
- **No setup/monthly fees**

#### 🔧 Best For
- ✅ International expansion
- ✅ Multi-currency support
- ✅ Advanced subscription automation
- ✅ Global construction projects
- ✅ Scaling beyond South Africa

---

## Recommended Setup for Qilly

### Phase 1: Launch (South Africa Only)
```
Primary: PayFast
- Handle all SA Department of Settlements payments
- Government/municipal subscriptions
- Local construction companies
- BBBEE verified suppliers
```

### Phase 2: International Expansion
```
Primary: PayFast (SA customers)
Secondary: Stripe (International customers)
- Detect user location
- Route SA users → PayFast
- Route international users → Stripe
```

---

## Feature Comparison

| Feature | PayFast | Stripe |
|---------|---------|--------|
| **Recurring Billing** | Manual (you build) | Automatic (Stripe Billing) |
| **Subscription Management** | Manual | Automatic |
| **Proration** | Manual calculation | Automatic |
| **Failed Payment Retry** | Manual | Smart retry (ML-based) |
| **Webhooks** | ✅ Yes | ✅ Yes (more events) |
| **Test Environment** | ✅ Sandbox mode | ✅ Test mode |
| **Dashboard** | Basic | Advanced analytics |
| **Invoicing** | Manual | Automatic PDF invoices |
| **Tax (VAT) Handling** | Manual | Automatic (Stripe Tax) |
| **Customer Portal** | Build yourself | Hosted portal included |
| **Refunds** | Manual | API + Dashboard |
| **Dunning Management** | Build yourself | Smart retry logic |
| **Revenue Recognition** | Manual | Automatic (IFRS 15) |

---

## Integration Complexity

### PayFast: ⭐⭐⭐ (Medium)
- Simple form-based integration
- Webhook notifications
- **You build:** Subscription logic, proration, retry logic

### Stripe: ⭐⭐⭐⭐⭐ (Easy with advanced features)
- React components included
- Subscription API handles everything
- **Pre-built:** Proration, retries, customer portal

---

## Final Recommendation

### For Qilly's DHS Project:

**Start with PayFast:**
1. ✅ Aligns with government procurement (local preference)
2. ✅ BBBEE compliance (South African company)
3. ✅ Better for ZAR transactions (no forex fees)
4. ✅ Faster payouts to SA accounts
5. ✅ Local support for government queries

**Add Stripe Later (Optional):**
- When expanding to international construction projects
- If needing advanced automation (customer portal, smart retries)
- For multi-currency support

---

## Cost Comparison Example

### Scenario: R1,999/month Professional subscription

**PayFast (SA customer with SA card):**
```
Transaction: R1,999
Fee: R1,999 × 2.9% + R2.00 = R60.00
You receive: R1,939.00
```

**Stripe (SA customer with SA card):**
```
Transaction: R1,999
Fee: R1,999 × 2.9% + R2.00 = R60.00
You receive: R1,939.00
(Same cost, but 7-14 day payout vs 2-3 days)
```

**Stripe (International customer with US card):**
```
Transaction: R1,999
Fee: R1,999 × 4.9% + R2.00 = R99.95
You receive: R1,899.05
(Higher fee, but enables international sales)
```

---

## Government Procurement Compliance

### PayFast Advantages for DHS Project:
- ✅ **South African company** (BBBEE points)
- ✅ **Local Economic Development** preference
- ✅ **POPIA compliant** (SA data protection)
- ✅ **Government-approved** payment gateway
- ✅ **Already used by SA government departments**

### Stripe Considerations:
- ⚠️ US-based company (may affect procurement scoring)
- ⚠️ Data processed internationally (POPIA considerations)
- ✅ Still compliant, but less "local preference" points

---

## Implementation Roadmap

### Month 1-3: PayFast Integration
- Implement subscription billing
- Build custom proration logic
- Set up webhook handling
- Create manual retry system

### Month 4-6: Stripe Integration (Optional)
- Add Stripe for international customers
- Use Stripe Billing for automation
- Route users based on location
- Maintain PayFast as primary for SA

### Month 7+: Optimization
- Compare conversion rates
- Analyze fee structures
- Optimize based on customer data

---

## Decision Matrix

Choose **PayFast** if:
- ✅ 90%+ customers are in South Africa
- ✅ Government/public sector project
- ✅ BBBEE compliance matters
- ✅ Need local support
- ✅ Want faster ZAR payouts

Choose **Stripe** if:
- ✅ International customer base
- ✅ Need multi-currency support
- ✅ Want full automation (less dev work)
- ✅ Need advanced fraud detection
- ✅ Scaling globally

Choose **Both** if:
- ✅ SA primary market, international growth planned
- ✅ Want best of both worlds
- ✅ Can manage dual integration

---

## Conclusion

**For the Qilly DHS funding proposal: PayFast is the strategic choice.**

It demonstrates:
- 🇿🇦 Support for local business
- 💼 Government procurement alignment  
- 🏆 BBBEE compliance
- 💰 Cost optimization (faster payouts)
- 📞 Local support infrastructure

**Add Stripe later** if international expansion becomes a priority.
