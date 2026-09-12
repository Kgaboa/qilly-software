# 🎯 Qilly Subscription Testing Guide

## Your Questions Answered

### ❓ "What happens after the EFT payment?"

**Short Answer**: Invoice created → Admin verifies in "Payments" tab → Subscription activated

**Detailed Flow**:
```
1. User selects EFT payment
   └─ Unique reference generated: QILLY-2026-USER-12345678
   └─ Bank details displayed
   └─ Invoice PDF available
   └─ Invoice saved to localStorage

2. User makes actual bank transfer (offline)
   └─ Using their banking app/branch
   └─ Using the reference number

3. Admin checks bank account (offline)
   └─ Verifies transfer received
   └─ Amount matches invoice

4. Admin logs into Qilly Admin Dashboard
   └─ Goes to "Payments" tab
   └─ Sees pending invoice
   └─ Clicks "Verify & Activate"

5. System activates subscription
   ├─ user.subscription_tier = "professional"
   ├─ user.subscription_status = "active"
   ├─ user.paid_status = true
   ├─ user.boq_count = 0 (reset for unlimited)
   └─ user.payment_method = "eft"

6. User can now process unlimited BOQs
```

---

### ❓ "How do I test the subscription tests after free trial is blocked?"

**Short Answer**: Use the new "Dev Tools" tab in Admin Dashboard

**3 Quick Methods**:

#### Method 1: Instant Activation (15 seconds)
```
Admin → Dev Tools → Select tier → "Activate Now" → Done!
```

#### Method 2: Reset Trial (30 seconds)
```
Admin → Dev Tools → "Reset My Trial" → Try 2nd BOQ → Blocked → Test upgrade flow
```

#### Method 3: Full EFT Flow (2 minutes)
```
Reset Trial → Trigger block → Select EFT → Admin → Payments → Verify → Active
```

---

## 🆕 New Features Added

### 1. Payment Verification Panel
**Location**: Admin Dashboard → "Payments" tab

**Features**:
- ✅ View all pending EFT invoices
- ✅ Verify and activate subscriptions
- ✅ Reject payments with reasons
- ✅ Download invoice PDFs
- ✅ Manage sales requests
- ✅ Mark requests as contacted/converted/declined
- ✅ Real-time stats dashboard

**Use Case**: Admin verifies bank transfers and activates subscriptions

---

### 2. Developer Tools
**Location**: Admin Dashboard → "Dev Tools" tab

**Features**:

#### Current User Quick Actions
- ✅ **Reset Free Trial** - Set BOQ count to 0, revert to free tier
- ✅ **Activate Subscription** - Instantly activate any tier (Professional/Enterprise/Custom)
- ✅ **Simulate BOQ Usage** - Set BOQ count to 0, 1, 5, or 10
- ✅ **View Current User** - See all user data in console/alert

#### Manage Specific User
- ✅ Reset trial for any user by email
- ✅ Activate subscription for any user by email
- ✅ List all users in console

#### Data Management
- ✅ Clear all payment data (invoices, requests, history)
- ⚠️ Clear all users (danger zone)

**Use Case**: Testing and development without going through full flows

---

## 📊 Testing Workflows

### Workflow 1: Test Free Trial Enforcement
```bash
Goal: Verify users are blocked after 1 free BOQ

Steps:
1. Admin → Dev Tools → "Reset My Trial"
2. Logout, login as regular user
3. Upload BOQ #1 → Should work ✅
4. Try to upload BOQ #2 → Should be blocked ❌
5. Verify upgrade modal appears ✅

Expected Result:
- After 1 BOQ: User blocked
- Modal shows: "Free trial used. Upgrade to continue."
- 3 subscription tiers visible
- 4 payment methods available
```

### Workflow 2: Test EFT Payment Verification
```bash
Goal: Test complete EFT payment flow

Steps:
1. Admin → Dev Tools → "Reset My Trial"
2. Logout, login as user
3. Process 1 BOQ, try 2nd BOQ → Blocked
4. Select "Bank EFT" payment method
5. Note the reference number shown
6. Logout, login as admin
7. Admin → Payments tab
8. Find the pending invoice
9. Click "View" then "Verify & Activate"
10. Logout, login as user
11. Try processing multiple BOQs

Expected Result:
- Invoice visible in admin panel ✅
- After verification: subscription active ✅
- User can process unlimited BOQs ✅
- Badge shows "Professional" tier ✅
```

### Workflow 3: Test Instant Activation
```bash
Goal: Test subscription features immediately

Steps:
1. Admin → Dev Tools
2. Select tier: "Professional"
3. Select cycle: "Monthly"
4. Click "Activate Professional Now"
5. Dashboard → Upload multiple BOQs

Expected Result:
- Immediate activation (no payment flow)
- BOQ count reset to 0
- Unlimited processing enabled
- Tier badge updated
```

### Workflow 4: Test Sales Request Flow
```bash
Goal: Test contact sales workflow

Steps:
1. Reset trial, trigger upgrade modal
2. Select "Contact Sales" tab
3. Fill in message: "Need pricing for 10 users"
4. Submit request
5. Login as admin
6. Admin → Payments → Sales Requests tab
7. See the request
8. Click "Manage"
9. Mark as "Converted & Activate"
10. Login as user
11. Process BOQs

Expected Result:
- Request visible in admin panel ✅
- After conversion: subscription active ✅
- User has unlimited access ✅
```

---

## 🎮 Interactive Testing Scenarios

### Scenario: New User Journey
```
PERSONA: New contractor testing Qilly

1. Register account (demo@contractor.com)
   → Tier: Free, BOQ count: 0

2. Upload first BOQ (small project)
   → Success! BOQ priced in 2 minutes
   → BOQ count: 1

3. Upload second BOQ (another project)
   → BLOCKED! Upgrade modal appears
   → See all 3 tiers and pricing

4. Compare payment methods:
   - EFT: R0 fee, 1-2 days
   - Stitch: R2 fee, instant
   - PayFast: 2.9% fee, instant
   - Contact Sales: Custom pricing

5. Choose EFT payment
   → Download invoice
   → Make bank transfer
   → Wait for verification

6. Admin verifies payment
   → Subscription activated
   → Email confirmation sent (simulated)

7. Return to dashboard
   → Process unlimited BOQs
   → All features unlocked
```

### Scenario: Testing Different Tiers
```
GOAL: Compare Professional vs Enterprise features

Test 1 - Professional Tier:
1. Dev Tools → Activate Professional
2. Test features:
   ✓ Unlimited BOQ pricing
   ✓ All 9 provinces
   ✓ Regional optimization
   ✓ Compliance calculator
   ✓ Email support

Test 2 - Enterprise Tier:
1. Dev Tools → Activate Enterprise
2. Test features:
   ✓ All Professional features
   ✓ Priority processing
   ✓ Advanced analytics
   ✓ Custom compliance rules
   ✓ API access
   ✓ Priority support

Test 3 - Custom Tier:
1. Dev Tools → Activate Custom
2. Test features:
   ✓ All Enterprise features
   ✓ White-label solution
   ✓ Custom integrations
   ✓ On-premise deployment
   ✓ 24/7 support
```

---

## 🔍 Verification Checklist

### Free Trial Blocking ✅
- [ ] User can process 1 free BOQ
- [ ] 2nd BOQ attempt is blocked
- [ ] Upgrade modal appears
- [ ] Modal shows all 3 tiers
- [ ] Modal shows all 4 payment methods
- [ ] Pricing displayed correctly

### EFT Payment Flow ✅
- [ ] Unique reference number generated
- [ ] Bank details displayed correctly
- [ ] Invoice PDF downloadable
- [ ] Invoice appears in admin panel
- [ ] Admin can verify payment
- [ ] Subscription activates after verification
- [ ] User gets unlimited access

### Instant Payments ✅
- [ ] Stitch payment processes immediately
- [ ] PayFast payment processes immediately
- [ ] Subscription activates instantly
- [ ] No admin verification needed
- [ ] User redirected to dashboard

### Sales Requests ✅
- [ ] Request form submits successfully
- [ ] Request appears in admin panel
- [ ] Admin can mark as contacted
- [ ] Admin can mark as converted
- [ ] Conversion activates subscription
- [ ] Admin can add notes

### Developer Tools ✅
- [ ] Reset trial works
- [ ] Activate subscription works
- [ ] BOQ simulation works
- [ ] View user info works
- [ ] Manage specific user works
- [ ] Clear payment data works

---

## 📁 Data Structure Reference

### User Object (in localStorage)
```javascript
{
  id: "user_123",
  email: "user@example.com",
  name: "John Doe",
  
  // Subscription fields
  subscription_tier: "professional", // free | professional | enterprise | custom
  subscription_status: "active",     // trial | active | cancelled | past_due
  subscription_cycle: "monthly",     // monthly | annual
  paid_status: true,                 // true | false
  boq_count: 0,                      // Number of BOQs processed
  
  // Payment tracking
  payment_method: "eft",             // eft | stitch | payfast | manual
  last_payment_date: "2026-02-19T...",
  next_billing_date: "2026-03-19T...",
  
  created_at: "2026-01-15T..."
}
```

### Invoice Object (EFT payments)
```javascript
{
  id: "INV-12345678",
  reference: "QILLY-2026-USER-12345678",
  userId: "user_123",
  userEmail: "user@example.com",
  userName: "John Doe",
  amount: 1999,
  tier: "professional",
  cycle: "monthly",
  status: "pending",              // pending | verified | rejected
  createdAt: "2026-02-19T...",
  dueDate: "2026-02-26T...",      // 7 days later
  verifiedAt: null,               // Set when admin verifies
  verifiedBy: null,               // Admin email
  rejectionReason: null           // If rejected
}
```

### Upgrade Request Object (Contact Sales)
```javascript
{
  id: "REQ-12345678",
  userId: "user_123",
  userEmail: "user@example.com",
  userName: "John Doe",
  tier: "enterprise",
  cycle: "annual",
  amount: 49990,
  message: "Need pricing for 10 users in our department",
  status: "pending",              // pending | contacted | converted | declined
  createdAt: "2026-02-19T...",
  notes: null                     // Admin notes
}
```

---

## 🎓 Common Testing Questions

### Q: How do I reset everything and start fresh?
**A**: 
```bash
Admin → Dev Tools → "Delete All Users" (danger zone)
Then clear browser cache and re-register
```

### Q: Can I test with multiple users at once?
**A**: 
```bash
Yes! Register multiple emails, then use Dev Tools 
"Manage Specific User" to set different tiers for each
```

### Q: What's the fastest way to test subscription features?
**A**: 
```bash
Admin → Dev Tools → Activate Professional → Test immediately
```

### Q: How do I verify the free trial block is working?
**A**: 
```bash
Dev Tools → Reset Trial → Process 1 BOQ → Try 2nd → Should block
```

### Q: Can I test annual vs monthly billing?
**A**: 
```bash
Dev Tools → Select "Annual" cycle → Activate
Check next_billing_date is 365 days later
```

### Q: How do I simulate a rejected payment?
**A**: 
```bash
User creates EFT invoice → Admin → Payments → 
Select invoice → Enter rejection reason → "Reject Payment"
```

---

## 🚀 Pro Tips

### Speed Up Testing
```bash
# Create keyboard shortcuts (browser extension)
Ctrl+Shift+R → Reset Trial
Ctrl+Shift+A → Activate Professional
Ctrl+Shift+U → View User Info
```

### Test in Parallel
```bash
# Browser Window 1: Regular user
Process BOQs, test features

# Browser Window 2: Admin panel
Verify payments, check analytics

# Browser Window 3: Different user
Test different tier/features
```

### Automate Testing
```javascript
// Console command to activate subscription
const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
const email = sessionStorage.getItem('demo_email');
const user = users.find(u => u.email === email);
user.subscription_tier = 'professional';
user.paid_status = true;
user.boq_count = 0;
localStorage.setItem('demo_users', JSON.stringify(users));
console.log('Activated!');
```

---

## 📞 Support

### If Something Goes Wrong

**Issue**: Can't see pending invoices
**Fix**: 
```bash
console.log(localStorage.getItem('pending_invoices'))
Dev Tools → Clear Payment Data → Try again
```

**Issue**: Subscription not activating
**Fix**: 
```bash
Check user object in console
Verify paid_status and subscription_tier
Use Dev Tools → Activate manually
```

**Issue**: Trial reset not working
**Fix**: 
```bash
View Current User to check BOQ count
Manually set: Simulate BOQ Usage → 0
Or clear users and re-register
```

---

## ✅ Final Checklist

Before deploying to production:
- [ ] All payment methods tested
- [ ] EFT verification flow tested
- [ ] Free trial enforcement tested
- [ ] All 3 tiers tested
- [ ] Monthly and annual cycles tested
- [ ] Sales request flow tested
- [ ] Admin panel access tested
- [ ] Invoice PDF generation tested
- [ ] Email notifications reviewed (currently simulated)
- [ ] Security: Admin login protected
- [ ] Data persistence: localStorage working
- [ ] Cross-browser testing completed
- [ ] Mobile responsive testing completed

---

## 🎯 Summary

### What happens after EFT payment?
**Invoice created → Admin verifies in Payments tab → Subscription activated → Unlimited BOQs**

### How to test after free trial blocked?
**Use Dev Tools to instantly activate subscription OR test full payment flow**

### Key Tools:
1. **Payments Tab** - Verify EFT payments, manage sales requests
2. **Dev Tools Tab** - Reset trials, activate subscriptions, simulate usage
3. **Subs Test Tab** - Advanced subscription analytics and testing

**Everything is ready for testing! 🚀**
