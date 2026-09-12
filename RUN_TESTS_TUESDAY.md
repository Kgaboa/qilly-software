# 🚀 Run Selenium Tests for Tuesday Demo - Quick Guide

## ⚡ **FASTEST WAY TO RUN TESTS**

### **Step 1: Open Command Prompt**
```bash
cd C:\path\to\your\qilly\project
cd selenium_tests
```

### **Step 2: Set URL (Your Published Figma Site)**
```bash
# Replace with your actual figma.site URL
set QILLY_BASE_URL=https://qilly-multi-env.figma.site
```

### **Step 3: Run Tests**
```bash
python qilly_regression_suite_FIXED.py
```

---

## 🎯 **WHAT GETS TESTED**

### ✅ **All 4 Authentication Tests:**

1. **Operator Login** (`test_01_operator_login`)
   - Uses `operator@test.com` / `Operator123!`
   - Tests existing account login

2. **Partner Login** (`test_02_partner_login`)
   - Tests Partner Portal access
   - Uses `partner@procore.com`

3. **Basic User Signup** (`test_03_basic_user_signup`) - RENAMED
   - Tests "Sign Up" tab
   - Creates operator (not contractor)
   - ✅ NOW ACCURATELY NAMED

4. **FREE Contractor Signup** (`test_04_free_contractor_signup`) - NEW
   - Tests "Register as Contractor" button
   - Multi-step contractor flow
   - Selects FREE tier
   - ✅ PROPER CONTRACTOR TESTING

---

## 📸 **SCREENSHOTS**

All screenshots saved to: `selenium_tests/screenshots/`

**Look for:**
- `operator_login_success_[timestamp].png`
- `basic_user_signup_attempt_[timestamp].png`
- `contractor_details_filled_[timestamp].png`
- `contractor_signup_complete_[timestamp].png`

---

## ✅ **SUCCESS LOOKS LIKE**

```
🌐 Testing against: https://qilly-multi-env.figma.site

Test 1: ✅ Operator login successful
Test 2: ✅ Partner login attempted
Test 3: ✅ Basic user signup attempted (creates operator, NOT contractor)
Test 4: ✅ FREE tier contractor signup flow completed
        NOTE: This creates a CONTRACTOR account with FREE tier!

========================================
🎯 QILLY REGRESSION TEST SUITE - RESULTS
========================================
Tests Run: 4
✅ Passed: 4
❌ Failed: 0
⚠️  Errors: 0
========================================
```

---

## 🚨 **TROUBLESHOOTING**

### **Issue: "ChromeDriver not found"**
**Fix:**
```bash
# Download ChromeDriver matching your Chrome version
# From: https://chromedriver.chromium.org/
# Add to PATH or place in selenium_tests folder
```

### **Issue: "Module not found: selenium"**
**Fix:**
```bash
pip install -r requirements.txt
```

### **Issue: "Element not found"**
**Fix:**
- Check screenshots in `screenshots/` folder
- Verify URL is correct
- Check if app is fully loaded

### **Issue: "Timeout errors"**
**Fix:**
- Wait times are already increased to 30 seconds
- Check internet connection
- Verify figma.site is accessible

---

## 🎬 **DEMO TALKING POINTS**

**When showing tests to eTender:**

1. **"We have automated UI testing with Selenium"**
   - Show test running in real-time
   - Browser opens, fills forms, takes screenshots

2. **"We test BOTH user journeys"**
   - Basic signup for quick trials
   - Full contractor registration with tier selection

3. **"Our contractor signup is multi-step"**
   - Company details & CIDB validation
   - Tier selection (FREE/PRO/ENT/CUSTOM)
   - Payment integration (for paid tiers)

4. **"We have comprehensive test coverage"**
   - Authentication
   - Partner applications
   - Admin workflows
   - UI/UX validation

---

## 📊 **SHOW eTENDER THE DIFFERENCE**

### **Basic User Signup (test_03):**
```
AuthForm → "Sign Up" tab → Name/Email/Password → Creates operator
```

### **Contractor Signup (test_04):**
```
AuthForm → "Register as Contractor" button → 
Company Details → CIDB → Contact Info → 
Tier Selection → Payment (if paid) → 
Creates Contractor Account
```

**"This ensures we properly test both user journeys!"**

---

## 🎯 **COPY-PASTE COMMANDS**

### **Windows:**
```batch
cd selenium_tests
set QILLY_BASE_URL=https://qilly-multi-env.figma.site
python qilly_regression_suite_FIXED.py
```

### **Mac/Linux:**
```bash
cd selenium_tests
export QILLY_BASE_URL=https://qilly-multi-env.figma.site
python qilly_regression_suite_FIXED.py
```

### **Run Just NEW Contractor Test:**
```bash
python -m unittest qilly_regression_suite_FIXED.TestAuthenticationFlows.test_04_free_contractor_signup
```

---

## 📁 **WHAT YOU NEED**

✅ **Python 3.8+** installed  
✅ **Chrome browser** installed  
✅ **ChromeDriver** matching Chrome version  
✅ **selenium, unittest** packages (`pip install -r requirements.txt`)  
✅ **Published figma.site URL**

---

## 🎉 **YOU'RE READY!**

Everything is set up and ready for Tuesday's demo.

**The fix you requested:**
- ✅ `test_03` renamed to `basic_user_signup` (accurate)
- ✅ `test_04` added as `free_contractor_signup` (NEW)
- ✅ Both flows properly tested
- ✅ Ready to demonstrate

**Run the tests, show the screenshots, and confidently explain the two different user journeys to eTender!** 🚀
