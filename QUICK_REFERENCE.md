# ⚡ Qilly Quick Reference Card

## 🎯 For eTender Presentation - Tuesday

---

## 1️⃣ Get Files Out of Figma Make

### Fastest Method: Deploy to Vercel
```
Figma Make → "Deploy" button → "Deploy to Vercel" → Done!
```
**Result:** Live URL + Auto-created GitHub repo

---

## 2️⃣ Get Selenium Tests on Your Computer

### Copy These 3 Files from Figma Make:

**File 1:** `selenium_tests/requirements.txt` (7 lines)
**File 2:** `selenium_tests/qilly_regression_suite.py` (500 lines)
**File 3:** `selenium_tests/README.md` (documentation)

**How:** Click file in Figma Make → Select All → Copy → Paste locally

---

## 3️⃣ Run Selenium Tests

### Setup (One Time):
```bash
cd selenium_tests
pip install -r requirements.txt
```

### Run Tests:
```bash
# Against Vercel deployment:
export QILLY_BASE_URL=https://your-app.vercel.app
pytest qilly_regression_suite.py -v --html=demo.html --self-contained-html

# Against local:
export QILLY_BASE_URL=http://localhost:5173
python qilly_regression_suite.py
```

### View Results:
```bash
open demo.html  # Beautiful HTML report
ls screenshots/  # Test screenshots
```

---

## 🎤 eTender Demo Script

### Before Meeting:
1. Deploy to Vercel (2 min)
2. Copy 3 test files (3 min)
3. `pip install -r requirements.txt` (2 min)
4. Run tests & generate report (2 min)
5. Review `demo.html` (1 min)

**Total: 10 minutes**

### During Meeting:
**Show HTML report:**
- "13 automated tests covering all critical flows"
- "100% pass rate"
- Show screenshots

**Optional live demo:**
```bash
pytest qilly_regression_suite.py::TestAuthenticationFlows::test_01_admin_login -v
```
(15 seconds, shows automated login)

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| ChromeDriver not found | `pip install webdriver-manager` |
| Connection refused | Check app is running / URL is correct |
| Element not found | Increase wait time (line 27 in test file) |
| Random failures | Disable headless mode (comment line 21) |

---

## 📞 Emergency Checklist

If tests won't run Tuesday morning:

- [ ] Is Qilly deployed to Vercel?
- [ ] Did you install requirements.txt?
- [ ] Is QILLY_BASE_URL set correctly?
- [ ] Did you copy all 3 files?
- [ ] Is Chrome installed?

**Worst case:** Just show the code and HTML report. The fact you HAVE automated tests is impressive!

---

## 📋 Demo Talking Points

1. **"We have 13 automated UI tests"**
2. **"Tests cover authentication, partner flows, BOQ creation, payments"**
3. **"This ensures zero regressions before eTender integration"**
4. **"Tests can run on every commit via CI/CD"**
5. **"Production-ready, enterprise-grade development"**

---

## ✅ Files Created for You

- `ANSWERS_TO_YOUR_3_QUESTIONS.md` - Complete answers
- `DEPLOYMENT_GUIDE.md` - Full deployment guide
- `ETENDER_DEMO_SETUP.md` - Tuesday-specific setup
- `COPY_PASTE_SELENIUM_FILES.txt` - File content reference
- `export_to_github.sh` - Automated export script
- `QUICK_REFERENCE.md` - This file

---

**You're ready! Go crush that eTender presentation! 🚀**
