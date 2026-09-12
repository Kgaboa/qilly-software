# 📸 Step-by-Step: Disable Email Confirmations in Supabase

## 🎯 Goal
Bypass email verification to avoid rate limits during testing

## ⏱️ Time: 2 Minutes

---

## 📋 Step-by-Step Instructions

### Step 1: Open Supabase Dashboard

**Navigate to:**
```
https://supabase.com/dashboard
```

**Then:**
- Log in if needed
- You should see your projects

---

### Step 2: Select Your Project

**Look for project:**
```
Project Name: (your Qilly project)
Project ID: zzdzrlglivtpawtitvgu
```

**Click on it** to open the project dashboard

---

### Step 3: Open Authentication Settings

**Left Sidebar:**
1. Look for **"Authentication"** icon (🔐)
2. Click **"Authentication"**

You should now see the Authentication dashboard.

---

### Step 4: Go to Settings Tab

**Top Navigation Tabs:**
```
Users | Configuration | Settings | ...
```

**Click:** **"Settings"** tab

---

### Step 5: Find Email Auth Section

**Scroll down** the Settings page until you see:

```
┌─────────────────────────────────────┐
│  Email Auth                         │
├─────────────────────────────────────┤
│                                     │
│  Enable email confirmations         │
│  [ Toggle Switch ]  ← FIND THIS     │
│                                     │
│  When enabled, users must confirm   │
│  their email before signing in      │
│                                     │
└─────────────────────────────────────┘
```

---

### Step 6: Disable Email Confirmations

**Look for:**
```
Enable email confirmations
[ Toggle Switch ]
```

**Current State:** Probably **ON** (blue/enabled)

**Action:** **Click the toggle** to turn it **OFF** (gray/disabled)

**After clicking:**
- Toggle should turn gray
- Label might say "Disabled"

---

### Step 7: Save Changes

**Bottom of the page:**
- Look for **"Save"** button
- It might be highlighted (indicating unsaved changes)

**Click:** **"Save"** button

**Wait for:**
- Success message (usually green toast)
- "Settings saved successfully" or similar

---

### Step 8: Verify Change

**Check that:**
- Toggle is **OFF** (gray)
- No "unsaved changes" warning
- Page shows saved state

---

### Step 9: Test Signup

**Now go back to your app:**

1. **Refresh** your browser (F5 or Cmd+R)
2. Go to **Contractor Registration**
3. Fill out the form
4. Use **ANY email** (doesn't matter anymore):
   - `test@test.com`
   - `anything@example.com`
   - `qilly-works@test.com`
5. Click **"Register as Contractor"**

**Expected Result:**
```
✅ Signup succeeds immediately
✅ No email verification needed
✅ User appears in database
✅ No rate limit errors!
```

---

## 🔍 Full Path Summary

```
Supabase Dashboard
  └─ Select Project: zzdzrlglivtpawtitvgu
      └─ Click: Authentication (left sidebar)
          └─ Click: Settings (top tab)
              └─ Scroll to: Email Auth
                  └─ Toggle OFF: Enable email confirmations
                      └─ Click: Save
                          └─ Done! ✅
```

---

## 📊 What This Does

### Before (Email Confirmations ON)
```
User signs up
  ↓
Email sent to user ← Rate limited! 3 emails/hour
  ↓
User clicks link
  ↓
Account confirmed
  ↓
User can login
```

### After (Email Confirmations OFF)
```
User signs up
  ↓
Account created immediately ✅
  ↓
User can login right away ✅
  ↓
No emails sent (no rate limit!) ✅
```

---

## ⚠️ Important Warnings

### DO:
- ✅ Use this for testing/development
- ✅ Turn it back ON before production
- ✅ Test your signup flow thoroughly
- ✅ Use fake emails during testing

### DON'T:
- ❌ Leave this disabled in production
- ❌ Use this for real user signups
- ❌ Share project with disabled confirmations
- ❌ Forget to re-enable it later

---

## 🔄 Re-Enable Email Confirmations Later

**When you're done testing:**

1. Go back to: **Authentication → Settings**
2. Find: **Enable email confirmations**
3. Toggle: **ON** (blue)
4. Click: **Save**

**Done!** Email confirmations are back on.

---

## ✅ Success Indicators

After disabling:

- [ ] Toggle shows **OFF** (gray)
- [ ] Saved successfully
- [ ] Refreshed app
- [ ] Signup works immediately
- [ ] No email sent
- [ ] No rate limit error
- [ ] User in database

---

## 🆘 Troubleshooting

### Toggle not visible?
- Check you're in correct project
- Look under "Email Auth" section
- Try scrolling more

### Can't find Settings tab?
- Make sure you clicked "Authentication" first
- Look for tabs at top: Users | Configuration | **Settings**

### Changes not saving?
- Check for error messages
- Try refreshing dashboard
- Check your permissions (need admin access)

### Still getting rate limit after disabling?
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Wait 5 minutes
- Check toggle is actually OFF

---

## 🎯 After This Fix

You can now:
- ✅ Test contractor signup unlimited times
- ✅ Use any email (no verification needed)
- ✅ No rate limit errors
- ✅ Immediate account creation
- ✅ Continue building your app

---

## 📞 Quick Reference

**Your Project ID:** `zzdzrlglivtpawtitvgu`

**Setting Location:**
```
Authentication → Settings → Email Auth → Enable email confirmations
```

**Action:** Toggle **OFF**

**Time:** 2 minutes

**Difficulty:** ⭐ Easy

---

**Go do this now and your signup will work!** 🚀
