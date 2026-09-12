# 🚧 Staging Environment Testing Guide

## Overview
This guide explains how to perform staging environment testing while in demo mode, and how to progress from demo → staging → production.

---

## 🎯 Understanding the Environments

### **Demo Mode** (Current State) 🎮
```
Purpose: Local development and rapid testing
Database: localStorage
Features: ALL tabs visible (10 tabs)
Security: Low (all testing tools visible)
Use Case: Building features, rapid iteration
```

### **Development Mode** 🔧  
```
Purpose: Local development with real APIs
Database: localhost or dev database
Features: ALL tabs visible (10 tabs)
Security: Low (all testing tools visible)
Use Case: Building and testing with real backend
```

### **Staging Mode** 🚧
```
Purpose: Pre-production testing
Database: Staging database (real data structure, test data)
Features: 9 tabs visible (Dev Tools HIDDEN)
Security: Medium (testing tabs visible, no bypass tools)
Use Case: Final testing before production deployment
```

### **Production Mode** 🚀
```
Purpose: Live customer-facing application
Database: Production database (real customer data)
Features: 6 tabs visible (only business-critical)
Security: High (all testing tools hidden)
Use Case: Real business operations
```

---

## 📊 Tab Visibility Matrix

```
┌───────────────┬──────┬──────┬─────────┬────────────┐
│      Tab      │ Demo │ Dev  │ Staging │ Production │
├───────────────┼──────┼──────┼─────────┼────────────┤
│ Suppliers     │  ✅  │  ✅  │   ✅    │     ✅     │
│ Database      │  ✅  │  ✅  │   ✅    │     ❌     │
│ Billing       │  ✅  │  ✅  │   ✅    │     ✅     │
│ Payments      │  ✅  │  ✅  │   ✅    │     ✅     │
│ Subs Test     │  ✅  │  ✅  │   ✅    │     ❌     │
│ Engagement    │  ✅  │  ✅  │   ✅    │     ✅     │
│ Proposal      │  ✅  │  ✅  │   ✅    │     ✅     │
│ Deploy        │  ✅  │  ✅  │   ✅    │     ✅     │
│ Testing       │  ✅  │  ✅  │   ✅    │     ❌     │
│ Dev Tools     │  ✅  │  ✅  │   ❌    │     ❌     │
└───────────────┴──────┴──────┴─────────┴────────────┘

Total Tabs:     10      10        9            6
```

---

## 🔄 How to Switch Environments in Demo Mode

Since you're currently in demo mode (Figma Make environment), you can simulate different environments using our Environment Switcher.

### Method 1: Using Console Commands (Quick)

```javascript
// In browser console (F12)

// Switch to Staging mode
localStorage.setItem('qilly_environment', 'staging');
location.reload();

// Switch to Production mode
localStorage.setItem('qilly_environment', 'production');
location.reload();

// Switch to Development mode
localStorage.setItem('qilly_environment', 'development');
location.reload();

// Back to Demo mode
localStorage.setItem('qilly_environment', 'demo');
location.reload();

// Or clear override (returns to auto-detect)
localStorage.removeItem('qilly_environment');
location.reload();
```

### Method 2: Using URL Parameter (Temporary)

```
// Add ?env=staging to URL
https://your-app-url.com?env=staging

// Add ?env=production to URL
https://your-app-url.com?env=production

// Add ?env=development to URL
https://your-app-url.com?env=development

// Add ?env=demo to URL (default)
https://your-app-url.com?env=demo
```

### Method 3: Using Admin Dashboard (New!)

```
1. Login as admin (admin@qilly.com / admin123)
2. Go to "Settings" tab (NEW - add EnvironmentSwitcher)
3. Click environment card
4. System will reload with new environment
```

---

## 🧪 Complete Staging Testing Workflow

### Step 1: Switch to Staging Mode

```javascript
// Console
localStorage.setItem('qilly_environment', 'staging');
location.reload();
```

**What Changes:**
- ✅ Dev Tools tab disappears
- ✅ Testing tabs still visible (Subs Test, Testing)
- ✅ Database tab still visible (but should use staging DB in real deployment)
- ❌ Can't bypass payments anymore (Dev Tools hidden)

### Step 2: Test Without Dev Tools

**Simulate Real Admin Workflow:**

```
1. User Registration Flow
   - Register new user
   - Process 1 free BOQ
   - Get blocked on 2nd BOQ
   - See upgrade modal
   - CANNOT use Dev Tools to bypass ❌

2. EFT Payment Flow
   - Select EFT payment
   - Get invoice reference
   - Admin → Payments → Verify
   - Subscription activated ✅

3. Sales Request Flow
   - Contact Sales request
   - Admin → Payments → Sales Requests
   - Convert & Activate
   - Subscription activated ✅

4. Instant Payments
   - Test Stitch payment
   - Test PayFast payment
   - Immediate activation ✅
```

### Step 3: Use Testing Tabs for Verification

Even though Dev Tools is hidden in staging, you still have:

**Subs Test Tab:**
```
✅ Generate random test suppliers
✅ Simulate payment scenarios
✅ Test renewal cycles
✅ Export analytics
✅ Verify subscription logic
```

**Testing Tab:**
```
✅ View testing guidelines
✅ Check compliance workflows
✅ Review test scenarios
```

**Database Tab:**
```
✅ Inspect data structures
✅ Verify records created
✅ Check payment logs
✅ Validate user states
```

### Step 4: Test Production-Like Security

**What You CANNOT Do in Staging:**
```
❌ Use Dev Tools to activate subscriptions
❌ Reset trials with one click
❌ Bypass payment flows
❌ Simulate BOQ counts instantly
```

**What You MUST Do:**
```
✅ Go through actual payment verification
✅ Use admin panel to verify EFT payments
✅ Test sales request conversion
✅ Use Subs Test tab for controlled testing
```

### Step 5: Switch to Production Mode

```javascript
// Console
localStorage.setItem('qilly_environment', 'production');
location.reload();
```

**What Changes:**
- ❌ Dev Tools hidden
- ❌ Subs Test hidden
- ❌ Testing tab hidden
- ❌ Database tab hidden (security)
- ✅ Only 6 core business tabs visible

**Final Production Test:**
```
1. Verify UI looks correct
2. Test supplier management
3. Test payment verification
4. Ensure no testing tools visible
5. Confirm admin workflows work
```

---

## 🎮 Staging Testing Scenarios

### Scenario 1: New User Journey (No Dev Tools)

```
GOAL: Test complete user journey without bypass tools

1. Switch to Staging:
   localStorage.setItem('qilly_environment', 'staging');
   location.reload();

2. Register as new user:
   Email: staging-test@qilly.com
   Name: Staging Test User

3. Process first BOQ:
   ✅ Should work (free trial)

4. Try second BOQ:
   ❌ Blocked with upgrade modal
   ❌ CANNOT use Dev Tools (hidden)

5. Select EFT payment:
   ✅ Get invoice reference
   ✅ Download PDF

6. Login as admin:
   ✅ Go to Payments tab
   ✅ See pending invoice
   ✅ Click "Verify & Activate"

7. Login as user:
   ✅ Process unlimited BOQs
   ✅ Subscription active

PASS: User journey works without Dev Tools bypass ✅
```

### Scenario 2: Test Data Generation with Subs Test

```
GOAL: Generate test data without Dev Tools

1. In Staging mode (Subs Test still visible)

2. Admin → Subs Test tab

3. Generate Random Suppliers:
   - Click "Generate Random Suppliers"
   - Create 10 test suppliers
   - Mix of all tiers and statuses

4. Simulate Subscription Events:
   - Test payment success
   - Test payment failures
   - Test renewals
   - Test cancellations

5. Export Analytics:
   - Download CSV report
   - Verify data accuracy

PASS: Can create test data without Dev Tools ✅
```

### Scenario 3: Admin Payment Verification

```
GOAL: Test admin workflows in staging

1. Create multiple test users (manually register)

2. Each user triggers upgrade modal

3. Some choose EFT, some choose Contact Sales

4. Admin → Payments tab:
   ✅ See all pending invoices
   ✅ Verify some, reject some
   ✅ Manage sales requests
   ✅ Convert some, decline some

5. Verify users get activated:
   ✅ Check Database tab
   ✅ Verify subscription_status = 'active'
   ✅ Verify paid_status = true

PASS: Admin workflows function correctly ✅
```

### Scenario 4: Subscription Feature Testing

```
GOAL: Test subscription features without instant activation

1. Staging mode (no Dev Tools)

2. Professional Tier Testing:
   - Register user → Process 1 BOQ → Blocked
   - EFT payment → Admin verifies
   - Test: Unlimited BOQs ✅
   - Test: All provinces ✅
   - Test: Compliance calculator ✅

3. Enterprise Tier Testing:
   - Register user → Trigger upgrade
   - Contact Sales → Admin converts
   - Test: All Professional features ✅
   - Test: Priority processing ✅
   - Test: Advanced analytics ✅

4. Custom Tier Testing:
   - Register user → Trigger upgrade
   - Contact Sales → Admin converts
   - Test: All Enterprise features ✅
   - Test: White-label ✅
   - Test: Custom integrations ✅

PASS: All tier features work ✅
```

---

## 🔐 Security Testing in Each Environment

### Demo/Dev Mode Security:
```
✅ Dev Tools visible (intentional for development)
✅ Console logging enabled
✅ Debug mode active
⚠️  NOT for production use
```

### Staging Mode Security:
```
✅ Dev Tools HIDDEN (can't bypass payments)
✅ Testing tabs visible (controlled testing)
✅ Database inspection available
⚠️  Simulates production security
```

### Production Mode Security:
```
✅ Dev Tools REMOVED
✅ Testing tabs REMOVED
✅ Database tab REMOVED
✅ Only business-critical features
✅ Maximum security
```

---

## 📋 Pre-Production Checklist

Before switching from Staging to Production:

### Data Validation:
- [ ] All test payment flows work
- [ ] EFT verification process tested
- [ ] Sales request conversion tested
- [ ] Subscription activation confirmed
- [ ] User trial blocking verified

### UI/UX Validation:
- [ ] No testing tabs visible in Production mode
- [ ] Admin workflows clear and functional
- [ ] Payment verification UI intuitive
- [ ] No debug information leaking

### Security Validation:
- [ ] Dev Tools completely hidden
- [ ] Cannot bypass payment flows
- [ ] Admin authentication secure
- [ ] No localStorage vulnerabilities

### Performance Validation:
- [ ] Page load times acceptable
- [ ] Database queries optimized
- [ ] Payment processing smooth
- [ ] No console errors

---

## 🚀 Deployment Path

```
┌─────────────────────────────────────────────┐
│            DEVELOPMENT PHASE                │
│   Environment: Demo / Development           │
│   Database: localStorage / localhost        │
│   Testing: Dev Tools + Testing Tabs         │
│   Duration: Feature development             │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│             STAGING PHASE                   │
│   Environment: Staging                      │
│   Database: Staging DB (test data)          │
│   Testing: Testing Tabs only (no Dev Tools)│
│   Duration: 1-2 weeks                       │
│   Actions:                                  │
│   • Test all payment flows                  │
│   • Test admin workflows                    │
│   • Generate test data via Subs Test        │
│   • Verify no Dev Tools access              │
│   • Performance testing                     │
│   • Security audit                          │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│           PRODUCTION DEPLOYMENT             │
│   Environment: Production                   │
│   Database: Production DB (real data)       │
│   Testing: None (tools hidden)              │
│   Monitoring: Analytics, error tracking     │
│   Actions:                                  │
│   • Deploy with production config           │
│   • Only 6 tabs visible                     │
│   • Monitor real user behavior              │
│   • Support real payments                   │
└─────────────────────────────────────────────┘
```

---

## 💡 Best Practices

### In Demo/Dev:
```
✅ Use Dev Tools freely for rapid testing
✅ Use console logging
✅ Experiment with features
✅ Break things and learn
```

### In Staging:
```
✅ Test like a real user (no Dev Tools shortcuts)
✅ Use Subs Test for controlled test data
✅ Verify admin workflows end-to-end
✅ Document any issues found
❌ Don't bypass payment flows
❌ Don't use shortcuts
```

### In Production:
```
✅ Monitor real user behavior
✅ Use analytics dashboards
✅ Support real customers
✅ Handle real payments
❌ No testing tools available
❌ No shortcuts or bypasses
```

---

## 🆘 Troubleshooting

### "I'm in Staging but still see Dev Tools"
```
Solution:
localStorage.removeItem('qilly_environment');
localStorage.setItem('qilly_environment', 'staging');
location.reload();
```

### "I need to test but Dev Tools is hidden"
```
Solution 1: Use Subs Test tab (still visible in Staging)
Solution 2: Switch back to Demo mode:
  localStorage.setItem('qilly_environment', 'demo');
  location.reload();
```

### "How do I reset trial in Staging?"
```
You can't use Dev Tools, but you can:
1. Use Subs Test → Generate new test user
2. Or manually update in Database tab
3. Or switch back to Demo mode temporarily
```

### "How do I activate subscription in Staging?"
```
Use the REAL flow:
1. User selects payment method
2. For EFT: Admin verifies in Payments tab
3. For Sales: Admin converts in Payments tab
4. For instant: Auto-activated
```

---

## ✅ Summary

### How to test staging in demo mode:
1. **Switch environment:** `localStorage.setItem('qilly_environment', 'staging')`
2. **Reload page:** Dev Tools disappears
3. **Test workflows:** Use real payment flows (no shortcuts)
4. **Use testing tabs:** Subs Test, Testing, Database still available
5. **Verify security:** Confirm no payment bypasses possible

### Key Differences:
```
Demo:    All tools → Rapid testing
Staging: Testing tabs only → Real workflows
Production: Core tabs only → Business operations
```

### You CAN test in staging mode because:
✅ Testing tabs still visible (Subs Test, Testing)
✅ Database tab still visible (data inspection)
✅ Real workflows must be followed (no shortcuts)
✅ Simulates production security (Dev Tools hidden)

**Perfect for final testing before production! 🚀**
