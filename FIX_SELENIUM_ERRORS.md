# 🚨 SELENIUM ERRORS - QUICK FIX GUIDE

## Your Errors Explained

### ✅ GOOD NEWS: Those scary errors are harmless!

```
ERROR:google_apis\gcm\engine\registration_request.cc:290]
ERROR:google_apis\gcm\engine\connection_factory_impl.cc:483]
ERROR:net\socket\ssl_client_socket_impl.cc:918]
```

**These are just Chrome internal warnings - NOT your problem!**

They're Google Cloud Messaging (GCM) errors that Chrome outputs. They don't affect Selenium tests at all.

---

## 🎯 Real Problem: Tests Are Timing Out

### The actual issue:
Your tests show "ERROR" because they **can't find UI elements** on the page.

### Most likely cause:
**Your Qilly app isn't running** at the URL the tests are trying to access.

---

## ✅ 3-STEP FIX (Try This First!)

### Step 1: Make Sure Qilly App is Running

#### Option A: Testing Locally
```bash
# Terminal 1: Start Qilly
cd /path/to/qilly
npm install  # if first time
npm run dev

# Wait until you see:
# ➜  Local:   http://localhost:5173/

# Test in browser: Open http://localhost:5173
# You should see Qilly login page
```

#### Option B: Testing Against Vercel
```bash
# 1. Deploy to Vercel from Figma Make (if not done)
# 2. Get your URL (e.g., https://qilly-abc123.vercel.app)
# 3. Test in browser: Should load Qilly app
```

---

### Step 2: Set Correct URL

```bash
# For local testing:
export QILLY_BASE_URL=http://localhost:5173

# For Vercel testing:
export QILLY_BASE_URL=https://your-app.vercel.app

# Windows users:
set QILLY_BASE_URL=http://localhost:5173

# Verify it's set:
echo $QILLY_BASE_URL
```

---

### Step 3: Download Updated Test Files

The updated `qilly_regression_suite.py` has:
- ✅ Chrome warnings suppressed
- ✅ Longer timeout (30 seconds instead of 15)
- ✅ Better error messages
- ✅ Screenshots on errors
- ✅ Diagnostic helpers

**Get it from your Figma Make project:**
1. Open `/selenium_tests/qilly_regression_suite.py`
2. Copy all content
3. Paste into your local version (overwrite old file)

**Also get the diagnostic tool:**
1. Copy `/selenium_tests/diagnose_setup.py` from Figma Make
2. Paste locally

---

## 🔍 Run Diagnostic First

Before running full tests, run the diagnostic:

```bash
cd selenium_tests

# Make sure QILLY_BASE_URL is set:
export QILLY_BASE_URL=http://localhost:5173

# Run diagnostic:
python diagnose_setup.py
```

**This will:**
- ✅ Check Chrome/ChromeDriver are working
- ✅ Verify connection to your app
- ✅ Test if login form exists
- ✅ Try a test login
- ✅ Take screenshots you can review

**Expected output:**
```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║       🔍 QILLY SELENIUM SETUP DIAGNOSTIC TOOL                        ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝

==================================================
  1. Checking Environment Variables
==================================================
✓ QILLY_BASE_URL: http://localhost:5173

==================================================
  2. Checking Chrome Browser & Driver
==================================================
✅ Chrome and ChromeDriver are working!
   Chrome Version: 122.0.6261.129
   ChromeDriver Version: 122.0.6261.94

==================================================
  3. Checking Connection to Qilly App
==================================================
Connecting to: http://localhost:5173
✅ Successfully connected!
   Page Title: Qilly - Construction Billing
   Current URL: http://localhost:5173/
   📸 Screenshot saved: diagnostic_screenshot.png

==================================================
  4. Checking Login Form Elements
==================================================
✅ Found email input field
✅ Found password input field
✅ Found login button
📸 Screenshot saved: diagnostic_login_form.png

==================================================
  5. Testing Admin Login Flow
==================================================
Attempting login with admin@test.com / Admin123!
✓ Entered email
✓ Entered password
✓ Clicked login button
✅ Login appears successful!
   Current URL: http://localhost:5173/dashboard
📸 Screenshots saved:
   - diagnostic_before_login.png
   - diagnostic_after_login.png

🎉 Diagnostic complete!
```

---

## 🚀 If Diagnostic Passes, Run Full Tests

```bash
# Set URL (if not already set):
export QILLY_BASE_URL=http://localhost:5173

# Run all tests:
python qilly_regression_suite.py

# Or with pytest (better output):
pytest qilly_regression_suite.py -v

# Generate HTML report:
pytest qilly_regression_suite.py --html=demo.html --self-contained-html
```

---

## 🐛 If Diagnostic Fails

### Error: "Cannot connect to Qilly app"

**Cause:** App not running or wrong URL

**Fix:**
```bash
# 1. Verify app is running:
npm run dev

# 2. Test in browser:
# Open http://localhost:5173
# Should see login page

# 3. Set URL correctly:
export QILLY_BASE_URL=http://localhost:5173

# 4. Try diagnostic again:
python diagnose_setup.py
```

---

### Error: "Email field not found"

**Cause:** Login form structure doesn't match test expectations

**Fix:**
1. Open `diagnostic_login_form.png` screenshot
2. Check if login form is visible
3. If form looks different, you may need to update test selectors
4. Or your app might not have seeded the test users yet

---

### Error: "ChromeDriver not found"

**Cause:** Selenium can't find ChromeDriver

**Fix:**
```bash
pip uninstall selenium
pip install selenium==4.16.0
pip install webdriver-manager==4.0.1

# webdriver-manager auto-downloads correct ChromeDriver
```

---

## 📋 Complete Checklist

Before running tests, verify:

- [ ] **Qilly app is running** (npm run dev OR deployed to Vercel)
- [ ] **Browser can access the URL** (test manually first)
- [ ] **QILLY_BASE_URL is set** (`echo $QILLY_BASE_URL`)
- [ ] **Requirements installed** (`pip install -r requirements.txt`)
- [ ] **Chrome is installed**
- [ ] **You're in selenium_tests/ directory**

---

## 🎯 For Tuesday's eTender Demo

### Monday Night: Get Tests Working

```bash
# 1. Deploy Qilly to Vercel (from Figma Make)
Click "Deploy" → "Deploy to Vercel"

# 2. Get Selenium files on your computer
# Copy 3 files from Figma Make:
- qilly_regression_suite.py
- diagnose_setup.py
- requirements.txt

# 3. Setup
cd selenium_tests
pip install -r requirements.txt

# 4. Set URL to your Vercel deployment
export QILLY_BASE_URL=https://your-app.vercel.app

# 5. Run diagnostic
python diagnose_setup.py

# 6. If diagnostic passes, run full tests
pytest qilly_regression_suite.py --html=etender_demo.html
```

### Tuesday Morning: Verify Before Meeting

```bash
# Quick test to make sure everything still works:
export QILLY_BASE_URL=https://your-app.vercel.app
pytest qilly_regression_suite.py::TestAuthenticationFlows::test_01_admin_login -v

# If that passes, generate fresh report:
pytest qilly_regression_suite.py --html=etender_presentation.html
```

### During eTender Meeting:

**Safe Option:** Show pre-generated HTML report
- Open `etender_presentation.html`
- Walk through the 13 test cases
- Show screenshots folder

**Brave Option:** Run one quick live test
```bash
pytest qilly_regression_suite.py::TestAuthenticationFlows::test_01_admin_login -v
```
- Takes ~15 seconds
- eTender team watches automated login
- Very impressive!

---

## 💡 Pro Tips

### Tip 1: Test Against Vercel (Easier)
Testing against your deployed Vercel app is simpler than local:
- No need to run `npm run dev`
- App is already live and stable
- Same URL every time

### Tip 2: Start With One Test
Don't run all 13 tests when debugging:
```bash
# Just test admin login:
pytest qilly_regression_suite.py::TestAuthenticationFlows::test_01_admin_login -v -s
```

### Tip 3: Watch the Browser
Disable headless mode to see what's happening:
```python
# In qilly_regression_suite.py, line 26:
# Comment out this line:
# options.add_argument('--headless')
```

---

## 🎉 Expected Results (When Working)

```
🌐 Testing against: http://localhost:5173

test_01_admin_login ...
🔐 Testing Admin Login...
✅ Clicked login button
📸 Screenshot saved: screenshots/admin_login_success_20260316_143022.png
✅ Admin login successful
ok

test_02_partner_login ...
🤝 Testing Partner Login...
✅ Clicked Partner Program button
✅ Clicked login link
📸 Screenshot saved: screenshots/partner_login_success_20260316_143045.png
✅ Partner login successful
ok

...

========================================
🎯 QILLY REGRESSION TEST SUITE - RESULTS
========================================
Tests Run: 13
✅ Passed: 13
❌ Failed: 0
⚠️  Errors: 0
========================================
```

---

## 📞 Still Having Issues?

### Quick Decision Tree:

**Can you open http://localhost:5173 in Chrome and see Qilly?**
- **NO** → Run `npm run dev` first
- **YES** → Continue...

**Did you set QILLY_BASE_URL?**
- **NO** → `export QILLY_BASE_URL=http://localhost:5173`
- **YES** → Continue...

**Did you install requirements.txt?**
- **NO** → `pip install -r requirements.txt`
- **YES** → Continue...

**Run diagnostic:**
```bash
python diagnose_setup.py
```

**Check the screenshots** it generates to see exactly what's happening.

---

## 📦 Files You Need

From Figma Make `/selenium_tests/`:
1. ✅ `qilly_regression_suite.py` (main test suite - UPDATED)
2. ✅ `diagnose_setup.py` (diagnostic tool - NEW)
3. ✅ `requirements.txt` (Python dependencies)
4. ✅ `README.md` (full documentation)

From Figma Make root `/`:
5. ✅ `SELENIUM_TROUBLESHOOTING.md` (detailed troubleshooting)
6. ✅ `FIX_SELENIUM_ERRORS.md` (this file)

---

**Bottom Line:**
1. Make sure app is running
2. Set QILLY_BASE_URL correctly
3. Run diagnose_setup.py
4. If diagnostic passes, tests will work!

**You've got this! 🚀**

---

**Created:** March 16, 2026  
**For:** Fixing Selenium test errors before eTender presentation  
**Time to fix:** ~15 minutes
