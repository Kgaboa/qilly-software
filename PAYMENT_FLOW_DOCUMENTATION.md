# Qilly Payment & Subscription Flow Documentation

## Overview
This document explains what happens after each payment method is selected and how to test subscription features after the free trial is blocked.

---

## 🏦 Payment Methods & Flow

### 1. **EFT (Bank Transfer) Payment**

#### User Experience:
1. User selects EFT payment in the Subscription Upgrade Modal
2. System displays:
   - Unique payment reference number (e.g., `QILLY-2026-USERID-12345678`)
   - Bank account details (FNB account)
   - Payment amount and due date (7 days)
   - Copy buttons for reference and account number
   - Download Invoice PDF button

3. User makes bank transfer using:
   - Their online banking
   - Physical bank branch
   - **CRITICAL**: Must use the exact reference number shown

#### What Happens Behind the Scenes:
```javascript
// Invoice created and saved to localStorage
{
  id: "INV-12345678",
  reference: "QILLY-2026-USERID-12345678",
  userId: "user123",
  userEmail: "user@example.com",
  userName: "John Doe",
  amount: 1999,
  tier: "professional",
  cycle: "monthly",
  status: "pending",
  createdAt: "2026-02-19T...",
  dueDate: "2026-02-26T..."  // 7 days later
}

// Saved to: localStorage.getItem('pending_invoices')
```

#### Admin Verification Process:
1. Admin logs into Admin Dashboard
2. Navigates to **"Payments"** tab
3. Sees all pending EFT payments in a table
4. Admin reviews the payment:
   - Checks their bank account for matching transfer
   - Verifies reference number matches
   - Verifies amount is correct
5. Admin clicks **"Verify & Activate"** button

#### What Happens When Admin Verifies:
```javascript
// 1. Invoice status updated to 'verified'
invoice.status = 'verified'
invoice.verifiedAt = new Date().toISOString()
invoice.verifiedBy = 'admin@qilly.com'

// 2. User subscription activated in demo_users
user.subscription_tier = 'professional'  // or whichever tier
user.subscription_status = 'active'
user.subscription_cycle = 'monthly'
user.paid_status = true
user.boq_count = 0  // Reset to unlimited usage
user.payment_method = 'eft'
user.next_billing_date = [30 or 365 days from now]
user.last_payment_date = new Date().toISOString()

// 3. Confirmation email sent (simulated in demo)
// 4. User can now process unlimited BOQs
```

#### Timeline:
- Payment: Instant (user makes transfer)
- Verification: 1-2 business days (manual admin process)
- Activation: Instant (once admin verifies)

---

### 2. **Stitch (Instant Pay)**

#### User Experience:
1. User selects Stitch payment
2. Clicks "Pay with Stitch"
3. Simulated instant payment window appears
4. Payment processed immediately
5. Success message shown

#### What Happens:
```javascript
// Payment recorded instantly
payment = {
  id: "stitch_" + Date.now(),
  userId: userId,
  amount: amount,
  tier: tier,
  cycle: cycle,
  status: 'success',
  method: 'stitch',
  timestamp: new Date().toISOString()
}

// User subscription activated IMMEDIATELY
user.subscription_tier = tier
user.subscription_status = 'active'
user.paid_status = true
user.boq_count = 0
// ... etc

// Saved to: localStorage.getItem('stitch_payments')
```

#### Timeline:
- Payment: Instant
- Verification: Automatic
- Activation: Instant

---

### 3. **PayFast (Credit/Debit Card)**

#### User Experience:
1. User selects PayFast payment
2. Enters card details in simulated form
3. Processes payment
4. Success message shown

#### What Happens:
```javascript
// Similar to Stitch - instant activation
payment = {
  id: "payfast_" + Date.now(),
  userId: userId,
  amount: amount,
  tier: tier,
  cycle: cycle,
  status: 'success',
  method: 'payfast',
  timestamp: new Date().toISOString()
}

// User subscription activated IMMEDIATELY
user.subscription_tier = tier
user.subscription_status = 'active'
user.paid_status = true
// ... etc

// Saved to: localStorage.getItem('payfast_payments')
```

#### Timeline:
- Payment: Instant
- Verification: Automatic
- Activation: Instant

---

### 4. **Manual/Contact Sales**

#### User Experience:
1. User selects "Contact Sales"
2. Fills in optional message
3. Submits request
4. Toast: "Request sent! Our sales team will contact you within 24 hours"

#### What Happens:
```javascript
// Request saved for sales team
request = {
  id: "REQ-12345678",
  userId: userId,
  userEmail: userEmail,
  userName: userName,
  tier: tier,
  cycle: cycle,
  amount: amount,
  message: "Need pricing for 10 users...",
  status: 'pending',
  createdAt: new Date().toISOString()
}

// Saved to: localStorage.getItem('upgrade_requests')
```

#### Admin Sales Process:
1. Admin sees request in **"Payments" > "Sales Requests"** tab
2. Admin can:
   - Mark as "Contacted" (sales team reached out)
   - Mark as "Declined" (not interested)
   - **Mark as "Converted & Activate"** (deal closed)

#### When Admin Converts:
```javascript
// User subscription activated
user.subscription_tier = tier
user.subscription_status = 'active'
user.paid_status = true
user.boq_count = 0
user.payment_method = 'manual'
// ... etc
```

#### Timeline:
- Request: Instant
- Sales Contact: 1-24 hours
- Activation: When admin marks as "Converted"

---

## 🧪 Testing Subscription Features After Free Trial Block

### Problem:
After processing your 1 free BOQ, you're blocked from processing more. How do you test the subscription features without going through full payment flows?

### Solution: Use Developer Tools

---

## 📋 Complete Testing Workflow

### **Step 1: Access Developer Tools**
1. Login as Admin (`admin@qilly.com` / `admin123`)
2. Navigate to **"Dev Tools"** tab
3. You'll see the Developer Tools dashboard

---

### **Step 2: Test Free Trial Blocking**

#### Reset Your Trial:
1. In "Current User Quick Actions" section
2. Click **"Reset My Trial (Set BOQ Count = 0)"**
3. Your trial is now reset

#### Test the Block:
1. Logout from admin, login as regular user
2. Upload and process 1 BOQ → Should work ✅
3. Try to upload another BOQ → Should be blocked ❌
4. Upgrade modal should appear with subscription options

---

### **Step 3: Test Subscription Features**

You have 3 options:

#### **Option A: Instant Activation (Fastest)**
1. In Developer Tools → "Current User Quick Actions"
2. Select tier: Professional, Enterprise, or Custom
3. Select cycle: Monthly or Annual
4. Click **"Activate [TIER] Now"**
5. Done! You now have unlimited BOQ processing

#### **Option B: Test EFT Payment Flow**
1. Reset trial (if needed)
2. Trigger upgrade modal by trying to process 2nd BOQ
3. Select **EFT payment** method
4. Note the reference number shown
5. Switch to Admin account
6. Go to **"Payments"** tab
7. See your pending invoice
8. Click **"Verify & Activate"**
9. Switch back to user account
10. You can now process unlimited BOQs

#### **Option C: Test Instant Payment (Stitch/PayFast)**
1. Reset trial (if needed)
2. Trigger upgrade modal
3. Select **Stitch** or **PayFast**
4. Complete simulated payment
5. Instantly activated - process unlimited BOQs

---

### **Step 4: Test Different Scenarios**

#### Simulate BOQ Usage:
```
Developer Tools → "Simulate BOQ Usage"
- Set to 0 BOQs: Test fresh account
- Set to 1 BOQ: Test trial limit
- Set to 5 BOQs: Test active subscription
- Set to 10 BOQs: Test heavy usage
```

#### Manage Specific Users:
```
Developer Tools → "Manage Specific User"
1. Enter user email
2. Select tier and cycle
3. Click "Activate Subscription"
```

#### View User Info:
```
Developer Tools → "View Current User"
- See BOQ count
- See subscription tier
- See paid status
- See all user data
```

---

## 🔄 Testing Multiple Subscription Tiers

### Test Professional Tier:
```
1. Developer Tools → Activate "Professional" tier
2. Features to test:
   - Unlimited BOQ pricing ✓
   - All 9 provinces ✓
   - Regional optimization ✓
   - Compliance calculator ✓
```

### Test Enterprise Tier:
```
1. Developer Tools → Activate "Enterprise" tier
2. Features to test:
   - All Professional features ✓
   - Priority processing ✓
   - Advanced analytics ✓
   - API access ✓
```

### Test Custom/DHS Tier:
```
1. Developer Tools → Activate "Custom" tier
2. Features to test:
   - All Enterprise features ✓
   - White-label solution ✓
   - Custom integrations ✓
   - SLA guarantees ✓
```

---

## 🎯 Complete Test Scenarios

### **Scenario 1: New User Journey**
```
1. Register new account
2. Process 1 free BOQ ✓
3. Try 2nd BOQ → Blocked with upgrade modal ❌
4. Select EFT payment
5. View invoice details
6. Admin verifies payment
7. Process unlimited BOQs ✓
```

### **Scenario 2: Quick Testing**
```
1. Dev Tools → Reset Trial
2. Dev Tools → Activate Professional
3. Process multiple BOQs ✓
4. Test features ✓
5. Dev Tools → Reset Trial when done
```

### **Scenario 3: Payment Method Testing**
```
1. Test EFT: Manual admin verification
2. Test Stitch: Instant activation
3. Test PayFast: Instant activation
4. Test Manual: Sales team workflow
5. Compare experiences
```

### **Scenario 4: Subscription Testing Dashboard**
```
1. Admin → "Subs Test" tab
2. Generate random test suppliers
3. Simulate payments, renewals, cancellations
4. Test billing cycles
5. Export analytics
```

---

## 📊 Data Storage Locations

All data is stored in `localStorage`:

```javascript
// Users
localStorage.getItem('demo_users')

// EFT Invoices (pending verification)
localStorage.getItem('pending_invoices')

// Sales Requests
localStorage.getItem('upgrade_requests')

// Stitch Payments
localStorage.getItem('stitch_payments')

// PayFast Payments  
localStorage.getItem('payfast_payments')

// Test Suppliers (Subscription Testing)
localStorage.getItem('test_suppliers')
```

---

## 🛠️ Developer Tools Features

### Quick Actions:
- ✅ View Current User Info
- ✅ List All Users
- ✅ Reset Free Trial
- ✅ Activate Subscription (any tier)
- ✅ Simulate BOQ Usage (set count)

### User Management:
- ✅ Manage any user by email
- ✅ Reset trial for specific user
- ✅ Activate subscription for specific user

### Data Management:
- ✅ Clear all payment data
- ⚠️ Clear all users (DANGER)

---

## 🔐 Admin Payment Verification Panel

### Features:
1. **EFT Payments Tab:**
   - View all pending invoices
   - See customer details, reference, amount
   - Verify and activate subscriptions
   - Reject payments with reason
   - Download invoice PDFs
   - Filter by status (pending/verified/rejected)
   - Search by reference/name/email

2. **Sales Requests Tab:**
   - View all contact sales requests
   - See customer message and requirements
   - Mark as contacted/converted/declined
   - Add admin notes
   - Activate subscription on conversion

3. **Stats Dashboard:**
   - Pending payments count
   - Sales requests count
   - Verified today count
   - Total revenue

---

## 🚀 Quick Reference Commands

### Reset Everything:
```
1. Dev Tools → Clear All Users (if needed)
2. Dev Tools → Clear Payment Data
3. Re-register as new user
```

### Test Subscription Features Now:
```
1. Dev Tools → Activate Professional → Monthly
2. Start testing immediately
```

### Return to Free Trial:
```
1. Dev Tools → Reset My Trial
2. BOQ count = 0, tier = free
```

---

## ⚠️ Important Notes

1. **Demo Mode Only**: All features work in localStorage, no real payments
2. **Persistence**: Data persists until you clear localStorage
3. **Multi-User**: Each email is a separate user with separate trial/subscription
4. **Admin Access**: Admin account can manage all users and payments
5. **Testing Safe**: All actions are reversible via Dev Tools

---

## 📞 Support & Questions

If you encounter issues:
1. Check browser console for errors
2. Verify localStorage has data
3. Try clearing and re-creating data
4. Use Dev Tools to reset state

---

## Summary

### **What happens after EFT payment?**
- Invoice created and saved to pending_invoices
- Admin sees it in Payments tab
- Admin verifies payment manually
- Subscription activated immediately after verification
- User gets unlimited BOQ access

### **How to test after free trial blocked?**
- Use Developer Tools → "Activate Subscription" (instant)
- Or test full EFT flow (Admin → Payments → Verify)
- Or use Stitch/PayFast (instant activation)
- Reset trial anytime to test again

**Key Tool: Developer Tools Tab in Admin Dashboard**
- Instant subscription activation
- Trial reset
- BOQ count simulation
- User management
- Testing made easy!
