# 👤 User Session & Account Management Guide

## ✅ New Feature: User Session Tab

I've added a **User Session** tab to your Admin Dashboard that shows:

- Currently logged-in user details
- Subscription tier and status
- BOQ count and usage stats
- Payment status
- Quick action buttons to upgrade or reset users
- List of all users in localStorage
- Ability to switch between users for testing
- Technical details (sessionStorage and localStorage data)

---

## 📍 Where to Find It

**Admin Dashboard → User Session tab**

This tab is **only visible in Development/Demo/Staging** environments (hidden in Production).

---

## 🔍 About demo@operator.com

### Current Behavior

The `demo@operator.com` user is **NOT automatically activated to Professional**. Here's why:

1. **Demo accounts start as Free Trial** by default
2. **Users must manually upgrade** via payment or admin activation
3. **This simulates real-world behavior** where users need to pay to upgrade

### Demo User Default State

```javascript
{
  email: "demo@operator.com",
  subscription_tier: "free",          // NOT professional
  subscription_status: "trial",       // Trial status
  paid_status: false,                 // Not paid
  boq_count: 0,                       // 0 BOQs used
  // ... other fields
}
```

---

## 🚀 How to Activate demo@operator.com to Professional

You have **3 methods** to upgrade the demo user:

### Method 1: User Session Tab (Easiest ⭐)

1. Go to **Admin Dashboard → User Session** tab
2. You'll see the currently logged-in user (demo@operator.com)
3. Click the **"Upgrade to Professional"** button
4. ✅ Done! User is now Professional with:
   - subscription_tier: `professional`
   - subscription_status: `active`
   - paid_status: `true`
   - subscription_expires_at: 1 year from now
   - Unlimited BOQs

### Method 2: Dev Tools Tab

1. Go to **Admin Dashboard → Dev Tools** tab
2. Scroll to **"Manual Subscription Activation"** section
3. Enter email: `demo@operator.com`
4. Select tier: `Professional`
5. Click **"Activate Subscription"**
6. ✅ User upgraded!

### Method 3: Payment Verification Tab

1. Go to **Admin Dashboard → Payments** tab
2. Create a manual invoice for demo@operator.com
3. Mark the invoice as **"Paid"**
4. System will automatically activate Professional subscription

---

## 🧪 Testing Different User States

### Test Scenario 1: Free Trial User

```javascript
// Current default state for demo@operator.com
{
  subscription_tier: "free",
  subscription_status: "trial",
  boq_count: 0,          // Can create 3 free BOQs
  paid_status: false
}
```

**What to test:**
- Create 1st BOQ → Success (2 remaining)
- Create 2nd BOQ → Success (1 remaining)
- Create 3rd BOQ → Success (0 remaining)
- Create 4th BOQ → **BLOCKED** (must upgrade)

### Test Scenario 2: Professional User (After Upgrade)

```javascript
{
  subscription_tier: "professional",
  subscription_status: "active",
  boq_count: 0,          // Unlimited BOQs
  paid_status: true,
  subscription_expires_at: "2027-02-20T..."  // 1 year from now
}
```

**What to test:**
- Create unlimited BOQs → Always success
- Access to premium features
- No trial limitations

### Test Scenario 3: Expired Subscription

```javascript
{
  subscription_tier: "professional",
  subscription_status: "expired",
  paid_status: false,
  subscription_expires_at: "2025-01-01T..."  // Past date
}
```

**What to test:**
- System blocks access until renewal
- User sees "renew subscription" prompt

---

## 🔄 How to Switch Between Test States

### Using User Session Tab

1. **Upgrade to Professional:**
   - Click "Upgrade to Professional" button
   
2. **Reset to Trial:**
   - Click "Reset to Trial" button
   - Confirms before resetting

3. **Refresh Session:**
   - Click "Refresh" button to reload user data

### Using Dev Tools Tab

1. **Reset Trial:**
   - Click "Reset Trial for Current User"
   - Sets boq_count to 0
   - Sets status back to trial

2. **Simulate BOQ Usage:**
   - Enter number of BOQs (e.g., 2)
   - Click "Simulate Usage"
   - Adds that many BOQs to the count

---

## 👥 Managing Multiple Test Users

### Switch Between Users

The **User Session** tab shows all users in localStorage:

1. See list of all test users
2. Each user shows their tier and status
3. Click "Switch" button to log in as that user
4. Test different subscription scenarios

### Create Additional Test Users

1. Log out of current session
2. Create new account with different email
3. Each user can have different tiers:
   - `user1@test.com` → Free trial
   - `user2@test.com` → Professional
   - `user3@test.com` → Enterprise

---

## 🛠️ Troubleshooting

### "Cannot locate active logged user"

**Problem:** User Session tab shows "No User Logged In"

**Causes:**
- sessionStorage `demo_email` is empty
- User never logged in
- Session was cleared

**Fix:**
1. Go to User Session tab
2. Check "Found X users in local storage" section
3. Click "Switch to this user" on any user
4. Or log out and log back in

### "User not activated after payment"

**Problem:** Paid via Payment Gateway but still shows "trial"

**Fix:**
1. Go to **Payments** tab
2. Find the invoice/payment
3. Click "Verify Payment" or "Activate"
4. OR manually upgrade via User Session tab

### "BOQ count not updating"

**Problem:** Created BOQ but count still shows 0

**Fix:**
1. Go to User Session tab
2. Click "Refresh" button
3. Check if boq_count updated
4. If not, check browser console for errors

---

## 📊 User Data Structure

### Complete User Object

```typescript
interface UserData {
  email: string;                      // User email
  subscription_tier?: string;         // 'free' | 'professional' | 'enterprise'
  subscription_status?: string;       // 'trial' | 'active' | 'expired' | 'cancelled'
  boq_count?: number;                 // Number of BOQs created
  paid_status?: boolean;              // true if user has paid
  payment_method?: string;            // 'eft' | 'card' | 'manual_activation'
  subscription_expires_at?: string;   // ISO date string
  created_at?: string;                // ISO date string
  // ... other fields
}
```

### Storage Locations

1. **sessionStorage (`demo_email`):**
   - Stores currently logged-in user's email
   - Cleared when browser tab closes
   - Used to identify active session

2. **localStorage (`demo_users`):**
   - Array of all user accounts
   - Persists across browser sessions
   - Contains full user objects

---

## 🎯 Recommended Testing Workflow

### For Testing Subscriptions

1. Start with **free trial** (default)
2. Create 3 BOQs to exhaust trial
3. See upgrade prompt
4. Upgrade to Professional via User Session tab
5. Verify unlimited BOQs work

### For Testing Payments

1. Create invoice via Payments tab
2. Process payment via Payment Gateway tab
3. Verify user upgraded automatically
4. Check User Session tab shows "Paid" status

### For Testing Supplier Features

1. Upgrade user to Professional first (free users may have limited access)
2. Go to Supplier API tab
3. Test price comparisons with unlimited BOQs

---

## 🔐 Security Notes

**This is DEMO/DEV mode only!**

- All data stored in browser localStorage
- No real authentication
- No server-side validation
- **DO NOT use in production** as-is

**For Production:**
- Replace with real Supabase authentication
- Use server-side subscription management
- Validate payments with payment gateway webhooks
- Store user data in Supabase database, not localStorage

---

## 📞 Quick Reference

| Action | Location | Button/Feature |
|--------|----------|----------------|
| View current user | User Session tab | Shows logged-in user details |
| Upgrade to Professional | User Session tab | "Upgrade to Professional" button |
| Reset to trial | User Session tab | "Reset to Trial" button |
| Switch users | User Session tab | "Switch" button (bottom section) |
| View all users | User Session tab | Lists all localStorage users |
| Manual activation | Dev Tools tab | "Manual Subscription Activation" |
| Payment activation | Payments tab | Verify/activate invoices |
| Simulate BOQ usage | Dev Tools tab | "Simulate BOQ Usage" |

---

## ✅ Summary

- ❌ `demo@operator.com` **does NOT** auto-activate to Professional
- ✅ You must **manually upgrade** via User Session tab
- ✅ **User Session tab** is now available in Admin Dashboard
- ✅ Provides **full visibility** into user status
- ✅ **Quick actions** to upgrade/reset users for testing
- ✅ Can **switch between multiple test users**
- ✅ Shows **technical details** for debugging

This gives you complete control over testing different subscription scenarios!
