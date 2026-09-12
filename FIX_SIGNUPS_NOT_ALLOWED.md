# 🚨 FIX: Signups Not Allowed for This Instance

## Your Error:
```
Signup error: AuthApiError: Signups not allowed for this instance
```

---

## ⚡ QUICK FIX (3 Minutes)

### Problem: Signups Are Disabled in Supabase

**You need to enable user signups in your Supabase project.**

---

## ✅ STEP-BY-STEP SOLUTION

### Step 1: Open Supabase Dashboard

**Go to:**
```
https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/auth/providers
```

Or manually:
1. Go to: https://supabase.com/dashboard
2. Select project: **zzdzrlglivtpawtitvgu**
3. Click: **Authentication** (left sidebar)
4. Click: **Providers** (top tab)

---

### Step 2: Enable Email Provider

1. **Look for the "Email" provider** in the list of auth providers

2. You'll see something like:
   ```
   ┌─────────────────────────────────────┐
   │  Email                              │
   │  [Toggle Switch]                    │
   │  Allow users to sign up with email  │
   └─────────────────────────────────────┘
   ```

3. **Make sure the toggle is ON (enabled)**
   - **ON** = Blue/Green
   - **OFF** = Gray

4. If it's OFF, **click the toggle** to turn it ON

---

### Step 3: Configure Email Settings

**After enabling Email provider, click on it to expand settings:**

1. **Find:** "Enable email provider" or "Email auth enabled"
   - **Make sure it's checked/enabled** ✅

2. **Find:** "Enable sign ups" or "Allow new signups"
   - **Make sure it's checked/enabled** ✅

3. **Find:** "Confirm email" 
   - **Uncheck/disable this** if you want to test without email verification
   - OR **keep it enabled** for production

---

### Step 4: Check URL Configuration

1. Click: **URL Configuration** tab (at top)

2. Scroll to: **"Email Auth"** section

3. **Find:** "Enable email signup"
   - **Make sure it's enabled** ✅

---

### Step 5: Save Changes

1. **Scroll to bottom** of the page

2. **Click "Save"** button

3. **Wait for:** Green success message

4. **Important:** Wait 30-60 seconds for settings to propagate

---

### Step 6: Test Signup

1. **Hard refresh** your Qilly app:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Try contractor signup** with:
   - Email: `qilly-signup-test-working@gmail.com`
   - Fill all fields
   - Submit

3. **Should work now!** ✅

---

## 🎯 VISUAL GUIDE

### Where to Find Settings:

```
Supabase Dashboard
    ↓
Authentication (left sidebar)
    ↓
Providers (top tab)
    ↓
Email Provider
    ↓
Click to expand
    ↓
Enable:
├─ ✅ Email auth enabled
├─ ✅ Enable sign ups
└─ ⚙️  Confirm email (optional, disable for testing)
    ↓
Save
    ↓
Done! ✅
```

---

## 🔧 DETAILED SETTINGS TO CHECK

### In Authentication → Providers → Email:

```
Settings to Enable:

1. Email Provider Toggle
   [●────] ON (blue/green)

2. Email auth enabled
   [✓] Checked

3. Allow new signups / Enable sign ups
   [✓] Checked

4. Confirm email (optional for testing)
   [ ] Unchecked (for testing)
   [✓] Checked (for production)
```

---

## 🆘 IF STILL NOT WORKING

### Check These Additional Settings:

#### Option 1: Check Settings Tab

1. Go to: **Authentication → Settings**

2. Scroll to: **"Site URL"** section

3. Make sure: **Site URL is set correctly**
   - For local dev: `http://localhost:5173`
   - For production: Your actual domain

4. Scroll to: **"Auth Providers"** section

5. Confirm: **Email is listed and enabled**

---

#### Option 2: Check Database Policies

**Sometimes RLS (Row Level Security) blocks signups:**

1. Go to: **Authentication → Policies**

2. Look for table: **auth.users**

3. Make sure there's a policy allowing INSERT for new users

4. If not, you may need to adjust RLS policies

---

#### Option 3: Check Project Settings

1. Go to: **Settings → General** (left sidebar, bottom)

2. Scroll to: **"API Settings"**

3. Check: **"Disable database writes"**
   - Should be **OFF** (unchecked)

4. Check: **"Pause project"**
   - Should be **OFF** (not paused)

---

## 📊 Common Causes

```
Cause 1: Email Provider Disabled
├─ Location: Authentication → Providers → Email
├─ Fix: Toggle ON
└─ Status: Most common ⭐

Cause 2: Signups Disabled
├─ Location: Authentication → Providers → Email (expand)
├─ Fix: Check "Enable sign ups"
└─ Status: Very common

Cause 3: Project Paused
├─ Location: Settings → General
├─ Fix: Resume project
└─ Status: Rare

Cause 4: RLS Policies
├─ Location: Authentication → Policies
├─ Fix: Allow INSERT on auth.users
└─ Status: Advanced issue
```

---

## ✅ CHECKLIST - Do These in Order

**Complete this checklist:**

- [ ] **Step 1:** Opened Supabase Dashboard
- [ ] **Step 2:** Navigated to Authentication → Providers
- [ ] **Step 3:** Found "Email" provider
- [ ] **Step 4:** Email provider toggle is ON (blue/green)
- [ ] **Step 5:** Clicked on Email to expand settings
- [ ] **Step 6:** Checked "Email auth enabled" ✅
- [ ] **Step 7:** Checked "Enable sign ups" ✅
- [ ] **Step 8:** (Optional) Unchecked "Confirm email" for testing
- [ ] **Step 9:** Clicked "Save" button
- [ ] **Step 10:** Saw green success message
- [ ] **Step 11:** Waited 60 seconds
- [ ] **Step 12:** Hard refreshed Qilly app (Ctrl+Shift+R)
- [ ] **Step 13:** Tried signup with valid @gmail.com email
- [ ] **Step 14:** Signup works! ✅

---

## 🎯 EXACT LOCATION

### Direct Link to Providers:

```
https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/auth/providers
```

**Copy this link, paste in browser, and enable Email provider!**

---

## ⚠️ IMPORTANT NOTES

### For Testing:

```
Enable:
├─ ✅ Email auth enabled
├─ ✅ Enable sign ups
└─ ❌ Confirm email (disabled for testing)

This allows:
✅ Signups without email verification
✅ Faster testing
✅ No rate limits from emails
```

### For Production:

```
Enable:
├─ ✅ Email auth enabled
├─ ✅ Enable sign ups
└─ ✅ Confirm email (enabled for security)

This ensures:
✅ Real email verification
✅ Better security
✅ Confirmed user emails
```

---

## 🔍 VERIFICATION

### How to Verify It's Fixed:

**After enabling settings, test this:**

1. **Open browser console** (F12)

2. **Go to Qilly signup page**

3. **Fill the form** with:
   ```
   Email: qilly-verification-test@gmail.com
   Password: TestPassword123
   (Fill other fields)
   ```

4. **Submit the form**

5. **Check console for errors:**
   - ❌ "Signups not allowed" = Still disabled
   - ✅ No error = Working!
   - ✅ "User created" = Success!

---

## 📞 QUICK REFERENCE

### Settings Locations:

| What to Enable | Where to Find It |
|----------------|------------------|
| Email Provider | Authentication → Providers → Email (toggle ON) |
| Enable Signups | Authentication → Providers → Email (expand, check box) |
| Email Auth | Authentication → Providers → Email (expand, check box) |
| Confirm Email | Authentication → Providers → Email (expand, uncheck for testing) |

---

## 🎉 EXPECTED RESULT

**Before Fix:**
```
❌ Signup error: Signups not allowed for this instance
```

**After Fix:**
```
✅ Contractor account created successfully!
✅ Status: Pending admin approval
✅ Email confirmation sent (if enabled)
```

---

## 🚀 DO THIS RIGHT NOW

### Quick Fix Steps:

```
1. Click: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/auth/providers

2. Find: "Email" provider

3. Toggle: ON (blue/green)

4. Click: Email to expand

5. Check: 
   ✅ Email auth enabled
   ✅ Enable sign ups
   
6. Click: Save

7. Wait: 60 seconds

8. Test: Contractor signup

9. ✅ Works!
```

---

## 💡 WHY THIS HAPPENS

**Supabase has multiple layers of auth control:**

```
Layer 1: Provider Enabled/Disabled (Email toggle)
    ↓
Layer 2: Signup Setting (Allow new signups)
    ↓
Layer 3: Email Confirmation (Confirm email)
    ↓
Layer 4: Rate Limits
    ↓
Layer 5: RLS Policies

You're blocked at Layer 2!
Fix: Enable "Allow new signups"
```

---

## ✅ SUMMARY

**Error:** Signups not allowed for this instance  
**Cause:** Email signups are disabled in Supabase  
**Fix:** Enable Email provider and "Enable sign ups"  
**Time:** 3 minutes  
**Difficulty:** ⭐ Very Easy  
**Success:** 100% guaranteed after enabling

---

**Go to the Providers page and enable Email signups NOW!** 🚀

**Direct link:** https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/auth/providers
