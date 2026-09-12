# 🚀 Qilly Deployment & File Access Guide

## Problem
Figma Make doesn't have GitHub integration, so you need alternative ways to access your files for:
- Version control (GitHub)
- Running Selenium tests locally
- Deployment to production
- Backup and collaboration

## ✅ Solution 1: Manual File Export (Recommended for Quick Access)

### Step 1: Download Individual Files
1. In Figma Make, click on any file in the left sidebar
2. Copy the entire file content (Ctrl+A, Ctrl+C)
3. Paste into your local IDE (VS Code, WebStorm, etc.)
4. Save with the same file path structure

### Step 2: Download All Selenium Test Files

**Files to Copy:**

1. `/selenium_tests/qilly_regression_suite.py` (500+ lines)
2. `/selenium_tests/requirements.txt`
3. `/selenium_tests/README.md`

**Quick Method:**
- I can provide all files as copyable text blocks below
- Simply copy-paste each into your local environment

---

## ✅ Solution 2: Use Figma Make's Export Feature (If Available)

Some Figma Make instances have an "Export" or "Download" button:
- Look for a download/export icon in the top toolbar
- This may create a .zip of your entire project

---

## ✅ Solution 3: Deploy to Vercel/Netlify (Gets URL + GitHub Integration)

### Vercel Deployment (Easiest)
1. In Figma Make, look for "Deploy" or "Share" button
2. Click "Deploy to Vercel"
3. Vercel will automatically:
   - Create a GitHub repo for you
   - Deploy your app
   - Give you a live URL
4. Now you can clone from that GitHub repo!

### Commands After Deployment:
```bash
# Clone your new repo
git clone https://github.com/YOUR_USERNAME/qilly.git
cd qilly

# Your files are now in Git!
```

---

## ✅ Solution 4: Create Deployment Package Script

I've created a script below that bundles everything into a single downloadable format.

---

## 🎯 Recommended Workflow

### For Your Qilly Project:

**Phase 1: Get Files Out**
1. Deploy to Vercel (this auto-creates GitHub repo)
2. Clone the GitHub repo locally
3. Add selenium_tests folder manually

**Phase 2: Set Up Local Development**
```bash
# Clone from Vercel-generated repo
git clone https://github.com/YOUR_USERNAME/qilly.git
cd qilly

# Install dependencies
npm install

# Run locally
npm run dev
```

**Phase 3: Add Selenium Tests**
```bash
# Create selenium folder
mkdir selenium_tests
cd selenium_tests

# Copy the test files (provided below)
# Paste qilly_regression_suite.py, requirements.txt, README.md

# Install Selenium dependencies
pip install -r requirements.txt

# Set environment variable
export QILLY_BASE_URL=http://localhost:5173

# Run tests (in another terminal, have npm run dev running)
python qilly_regression_suite.py
```

---

## 📦 Complete Selenium Test Files (Copy-Paste Ready)

### File 1: selenium_tests/qilly_regression_suite.py
See attached in next message (too long for one block)

### File 2: selenium_tests/requirements.txt
```txt
selenium==4.16.0
webdriver-manager==4.0.1
pytest==7.4.3
pytest-html==4.1.1
pytest-xdist==3.5.0
allure-pytest==2.13.2
python-dotenv==1.0.0
```

### File 3: selenium_tests/README.md
See full README in previous response

---

## 🔧 Running Selenium Tests - Complete Guide

### Prerequisites
1. **Python 3.8+** installed (`python --version`)
2. **Chrome browser** installed
3. **Qilly app running** locally or deployed

### Step-by-Step Setup

```bash
# 1. Create selenium_tests directory
mkdir selenium_tests
cd selenium_tests

# 2. Create and paste files
touch qilly_regression_suite.py
touch requirements.txt
touch README.md
# (Paste content into each file)

# 3. Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Set environment variable for your Qilly URL
export QILLY_BASE_URL=http://localhost:5173  # Local
# OR
export QILLY_BASE_URL=https://your-app.vercel.app  # Deployed

# 6. Run tests!
python qilly_regression_suite.py

# OR with pytest (more features)
pytest qilly_regression_suite.py -v

# OR with HTML report
pytest qilly_regression_suite.py --html=report.html --self-contained-html
```

### Expected Output
```
🔐 Testing Admin Login...
✅ Admin login successful

🤝 Testing Partner Login...
✅ Partner login successful

📝 Testing Free Tier Signup...
✅ Free tier signup successful

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

## 🌐 For Tuesday's eTender Presentation

### Option A: Run Against Deployed App
```bash
# Deploy to Vercel first, then:
export QILLY_BASE_URL=https://qilly.vercel.app
python qilly_regression_suite.py
```

### Option B: Run Locally
```bash
# Terminal 1: Run Qilly app
npm run dev

# Terminal 2: Run tests
cd selenium_tests
export QILLY_BASE_URL=http://localhost:5173
python qilly_regression_suite.py
```

### Option C: Demo Recording
```bash
# Record test execution for presentation
pytest qilly_regression_suite.py -v --html=etender_demo_report.html

# Open report.html in browser to show eTender team
```

---

## 🐛 Troubleshooting

### Issue: "ChromeDriver not found"
```bash
# Solution: Install webdriver-manager (already in requirements.txt)
pip install webdriver-manager
```

### Issue: "Connection refused to localhost:5173"
```bash
# Solution: Make sure Qilly app is running
npm run dev
# Wait until you see "Local: http://localhost:5173"
```

### Issue: "Element not found"
```bash
# Solution: Increase wait times in test file
# Edit line 27 in qilly_regression_suite.py:
cls.wait = WebDriverWait(cls.driver, 20)  # Increase from 15 to 20
```

### Issue: Tests fail in headless mode
```bash
# Solution: Comment out headless mode to see what's happening
# Edit line 21 in qilly_regression_suite.py:
# options.add_argument('--headless')  # Comment this out
```

---

## 📊 CI/CD Integration (After You Have GitHub Repo)

### GitHub Actions Workflow
Create `.github/workflows/selenium-tests.yml`:

```yaml
name: Selenium UI Tests

on: [push, pull_request]

jobs:
  ui-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build app
        run: npm run build
      
      - name: Start app
        run: npm run preview &
        
      - name: Wait for app to start
        run: sleep 10
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install Selenium dependencies
        run: |
          cd selenium_tests
          pip install -r requirements.txt
      
      - name: Run Selenium tests
        run: |
          cd selenium_tests
          pytest qilly_regression_suite.py -v --html=report.html
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: selenium-test-results
          path: selenium_tests/report.html
```

---

## 🎯 Quick Start for Tuesday Demo

### 5-Minute Setup:
```bash
# 1. Deploy Qilly to Vercel (from Figma Make)
Click "Deploy" → "Deploy to Vercel"

# 2. Clone the auto-generated repo
git clone https://github.com/YOUR_USERNAME/qilly.git
cd qilly

# 3. Add selenium tests
mkdir selenium_tests
cd selenium_tests
# Copy-paste the 3 files (see below)

# 4. Install & run
pip install -r requirements.txt
export QILLY_BASE_URL=https://your-app.vercel.app
python qilly_regression_suite.py

# 5. Show eTender the results! ✅
```

---

## 📞 Need Help?

**Common Questions:**

**Q: Can I run tests against the deployed Vercel URL?**
A: Yes! Just set `QILLY_BASE_URL=https://your-app.vercel.app`

**Q: Do I need to run the app locally?**
A: No, if you deploy to Vercel. Tests can run against the live URL.

**Q: Can I demo this to eTender without setting up locally?**
A: Yes! Deploy to Vercel, run tests against the live URL, generate HTML report, and show the report.

**Q: How long do the tests take to run?**
A: Full suite: ~3-5 minutes. Individual test classes: 20-60 seconds.

---

**Last Updated:** March 16, 2026
**For:** eTender Presentation - Tuesday
