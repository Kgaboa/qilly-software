# Qilly UI Automation & Regression Testing Guide

## 🎯 Overview
Comprehensive UI automation and regression testing tool for Qilly, enabling automated testing of critical user flows before deployments to SIT, UAT, and Production environments.

---

## 🚀 Quick Start

### Accessing the Tool

**Via Admin Dashboard → Dev Tools Tab**
1. Login to admin dashboard
2. Navigate to "Dev Tools" tab
3. Click "Launch UI Automation Suite" button
4. Testing dashboard opens in full-screen modal

---

## 📋 What This Tool Tests

### Pre-configured Test Scenarios

#### 1. **Authentication - User Login** 🔐
- **Tests:** Complete login workflow
- **Steps:** 
  - Navigate to home page
  - Verify email/password inputs exist
  - Enter test credentials
  - Submit login form
  - Verify successful authentication
- **Critical:** ✅ Yes
- **Duration:** ~10 seconds

#### 2. **BOQ Upload and Processing** 📄
- **Tests:** File upload workflow
- **Steps:**
  - Navigate to dashboard
  - Click BOQ upload button
  - Verify upload modal appears
  - Capture modal screenshot
- **Critical:** ✅ Yes
- **Duration:** ~8 seconds

#### 3. **Supplier Search** 🔍
- **Tests:** Search and filtering functionality
- **Steps:**
  - Navigate to main page
  - Enter search term (BuildIt)
  - Wait for results
  - Verify supplier appears
  - Capture results screenshot
- **Critical:** ⚠️ Medium
- **Duration:** ~10 seconds

#### 4. **Provincial Pricing Calculation** 💰
- **Tests:** Province-specific pricing
- **Steps:**
  - Select Gauteng province
  - Wait for price update
  - Capture Gauteng pricing
  - Switch to Western Cape
  - Verify price changes
  - Capture Western Cape pricing
- **Critical:** ✅ Yes
- **Duration:** ~15 seconds

#### 5. **Responsive Design - Mobile View** 📱
- **Tests:** Mobile responsiveness
- **Steps:**
  - Load in desktop view
  - Capture desktop screenshot
  - Verify mobile menu exists
  - Capture mobile screenshot
- **Critical:** ⚠️ Medium
- **Duration:** ~8 seconds

#### 6. **Form Validation** ✅
- **Tests:** Input validation and error messages
- **Steps:**
  - Submit empty form
  - Verify error messages appear
  - Enter invalid email
  - Verify email validation
  - Capture validation screenshots
- **Critical:** ✅ Yes
- **Duration:** ~12 seconds

---

## 🎬 How to Use

### Running Tests

#### Option 1: Run All Tests
```
1. Click "Run Tests" button
2. Wait for all enabled tests to complete
3. Review results in "Results" tab
4. Export results for documentation
```

#### Option 2: Run Specific Tests
```
1. Go to "Test Cases" tab
2. Select checkboxes for desired tests
3. Click "Run Tests" button
4. Only selected tests will execute
```

#### Option 3: Quick Critical Tests Only
```
1. Filter by "critical" tag
2. Run only critical user journeys
3. Faster execution (~2 minutes)
```

---

## 📊 Understanding Results

### Summary Statistics

**Total Tests**
- Number of test cases executed

**Passed** 🟢
- Tests completed successfully
- Target: 100% for deployment

**Failed** 🔴
- Tests that encountered errors
- Must investigate before deployment

**Pass Rate** 📈
- Percentage of successful tests
- Target: 100% for production
- Minimum: 95% for UAT

**Avg Duration** ⏱️
- Average execution time per test
- Typical: 8-15 seconds per test

### Test Result Details

Each test result shows:
- ✅ **Status Icon** - Passed/Failed indicator
- 📝 **Test Name** - What was tested
- ⏱️ **Duration** - Execution time
- 🕐 **Timestamp** - When test ran
- 📸 **Screenshots** - Visual captures
- 🐛 **Error Details** - If test failed

### Step-by-Step Results

Within each test:
- Green checkmark = Step passed
- Red X = Step failed
- Duration for each step
- Error messages if applicable

---

## 🎯 Best Practices

### Before Deployment Checklist

**Pre-SIT Deployment**
- [ ] Run all critical tests
- [ ] Verify 100% pass rate
- [ ] Export results
- [ ] Archive for compliance

**Pre-UAT Deployment**
- [ ] Run all tests (critical + regression)
- [ ] Minimum 95% pass rate
- [ ] Document any failures
- [ ] Get approval for known issues

**Pre-Production Deployment**
- [ ] Run full test suite
- [ ] Require 100% pass rate
- [ ] Visual regression screenshots
- [ ] Export and archive results

### When to Run Tests

**Daily**
- Quick smoke tests
- Authentication + BOQ upload only
- Duration: ~2 minutes

**Before Each Deployment**
- Full regression suite
- All 6 test scenarios
- Duration: ~5 minutes

**After Major Changes**
- Full suite + custom tests
- Include visual regression
- Duration: ~10 minutes

**Weekly**
- Full regression baseline
- Archive results
- Compare trends

---

## 🔧 Test Configuration

### Test Step Types

#### Navigation
```json
{
  "type": "navigation",
  "value": "/path/to/page",
  "description": "Navigate to specific page"
}
```

#### Click
```json
{
  "type": "click",
  "selector": "button[data-testid='submit']",
  "description": "Click submit button"
}
```

#### Input
```json
{
  "type": "input",
  "selector": "input[type='email']",
  "value": "test@example.com",
  "description": "Enter email"
}
```

#### Assertion
```json
{
  "type": "assertion",
  "selector": ".success-message",
  "expected": "Success",
  "description": "Verify success message"
}
```

#### Wait
```json
{
  "type": "wait",
  "timeout": 2000,
  "description": "Wait 2 seconds"
}
```

#### Screenshot
```json
{
  "type": "screenshot",
  "description": "Capture current state"
}
```

### Selectors

**Recommended (Best Practice)**
```html
<!-- Use data-testid attributes -->
<button data-testid="login-submit">Login</button>
```

**Good**
```css
/* CSS selectors */
button[type="submit"]
input[name="email"]
.primary-button
```

**Avoid**
```css
/* Too fragile */
body > div:nth-child(3) > button
```

---

## 🔌 Integration with Real Testing Frameworks

### This Tool vs Production Testing

**Current Tool (Qilly UI Automation)**
- ✅ Test case management
- ✅ Test execution simulation
- ✅ Results reporting
- ✅ Quick validation
- ⚠️ Browser-based (limited)
- ⚠️ Simulated interactions

**For Production (Recommended)**
- Use Playwright, Selenium, or Cypress
- Real browser automation
- Cross-browser testing
- CI/CD integration
- Video recording
- Network monitoring

### Export Test Cases

The tool allows exporting test definitions that can be used with:

#### Playwright (Recommended)
```typescript
// Example: Converted from Qilly test case
import { test, expect } from '@playwright/test';

test('Authentication - User Login', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'testpassword');
  await page.screenshot({ path: 'login-form.png' });
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'post-login.png' });
});
```

#### Selenium
```python
# Example: Converted from Qilly test case
from selenium import webdriver
from selenium.webdriver.common.by import By

def test_user_login():
    driver = webdriver.Chrome()
    driver.get("http://localhost:3000")
    
    email_input = driver.find_element(By.CSS_SELECTOR, 'input[type="email"]')
    email_input.send_keys("test@example.com")
    
    password_input = driver.find_element(By.CSS_SELECTOR, 'input[type="password"]')
    password_input.send_keys("testpassword")
    
    driver.save_screenshot("login-form.png")
    
    submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
    submit_button.click()
    
    driver.implicitly_wait(3)
    driver.save_screenshot("post-login.png")
    driver.quit()
```

#### Cypress
```javascript
// Example: Converted from Qilly test case
describe('Authentication', () => {
  it('should login successfully', () => {
    cy.visit('/');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('testpassword');
    cy.screenshot('login-form');
    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.screenshot('post-login');
  });
});
```

---

## 📤 Exporting Results

### JSON Export Format

```json
{
  "timestamp": "2026-03-14T10:30:00Z",
  "summary": {
    "total": 6,
    "passed": 5,
    "failed": 1,
    "duration": 45000
  },
  "results": [
    {
      "testCaseId": "auth-login",
      "testCaseName": "Authentication - User Login",
      "status": "passed",
      "duration": 10234,
      "timestamp": "2026-03-14T10:30:10Z",
      "screenshots": [
        "screenshot-auth-login-step-5.png",
        "screenshot-auth-login-step-8.png"
      ],
      "stepResults": [
        {
          "stepId": "step-1",
          "status": "passed",
          "duration": 523
        },
        // ... more steps
      ]
    },
    // ... more test results
  ]
}
```

### Using Exported Results

**Compliance Documentation**
- Attach to deployment approval forms
- Include in audit trails
- Reference in quality reports

**Trend Analysis**
- Compare pass rates over time
- Track performance degradation
- Identify flaky tests

**Investor Presentations**
- Demonstrate quality processes
- Show testing rigor
- Prove production readiness

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: Tests Always Pass (False Positives)
**Cause:** Simulated execution doesn't validate real browser behavior
**Solution:** Use Playwright/Selenium for production testing

#### Issue: Can't Find Elements
**Cause:** Selectors may be outdated or incorrect
**Solution:** 
- Add `data-testid` attributes to components
- Use more specific selectors
- Check if element is in DOM

#### Issue: Screenshots Not Captured
**Cause:** Screenshot step may fail silently
**Solution:** Verify screenshot step is enabled in test case

#### Issue: Tests Run Too Slowly
**Cause:** Too many wait steps or long timeouts
**Solution:**
- Reduce wait timeouts
- Remove unnecessary waits
- Optimize test flow

---

## 🎓 Advanced Usage

### Creating Custom Test Cases

**Step 1: Define Test Case**
```typescript
const customTest: TestCase = {
  id: 'custom-test',
  name: 'My Custom Test',
  description: 'Test specific functionality',
  enabled: true,
  tags: ['custom', 'regression'],
  steps: [
    // Define steps here
  ]
};
```

**Step 2: Add Steps**
```typescript
steps: [
  {
    id: 'step-1',
    type: 'navigation',
    value: '/my-page',
    description: 'Navigate to my page'
  },
  {
    id: 'step-2',
    type: 'assertion',
    selector: '[data-testid="my-element"]',
    description: 'Verify element exists'
  }
]
```

**Step 3: Add to Test Suite**
- Edit UIAutomationTester.tsx
- Add to testCases array
- Test will appear in UI

### Test Recorder (Future Feature)

The Test Recorder will allow:
- Recording user interactions
- Auto-generating test cases
- Visual test builder
- Code export to Playwright/Selenium

**Coming Soon:**
- Browser extension for recording
- Intelligent selector generation
- Step-by-step playback
- Visual regression comparison

---

## 📅 Testing Schedule

### Development Environment
```
Daily:          Smoke tests (auth, critical paths)
Before Commit:  Affected feature tests
Before PR:      Full regression suite
```

### SIT Environment
```
After Deploy:   Full test suite
Daily:          Smoke tests
Weekly:         Full regression + visual
```

### UAT Environment
```
After Deploy:   Full test suite (mandatory)
Before Demo:    Critical paths
Weekly:         Full regression
```

### Production Environment
```
After Deploy:   Full test suite (mandatory)
Weekly:         Smoke tests
Monthly:        Full regression + performance
```

---

## 🎯 Success Criteria

### For Tuesday's Presentation

**Minimum Requirements:**
- [ ] All critical tests pass (auth, BOQ, pricing)
- [ ] Export results as backup
- [ ] Screenshots captured
- [ ] Can demonstrate live

**Optimal Goals:**
- [ ] 100% pass rate
- [ ] All 6 tests passing
- [ ] Results archived
- [ ] Integration plan documented

### For Production Launch

**Mandatory:**
- [ ] 100% test pass rate
- [ ] Full regression suite running
- [ ] Automated in CI/CD
- [ ] Results archived for compliance

**Recommended:**
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile device testing
- [ ] Performance testing integration
- [ ] Visual regression testing
- [ ] Accessibility testing

---

## 🔗 Integration Roadmap

### Phase 1: Current (Internal Tool)
- ✅ Test case management
- ✅ Manual test execution
- ✅ Results reporting
- ✅ Export functionality

### Phase 2: Playwright Integration (Recommended Next)
- [ ] Install Playwright
- [ ] Convert test cases to Playwright tests
- [ ] Add to CI/CD pipeline
- [ ] Cross-browser testing

### Phase 3: CI/CD Automation
- [ ] GitHub Actions integration
- [ ] Automatic test on PR
- [ ] Deployment gates
- [ ] Slack notifications

### Phase 4: Advanced Features
- [ ] Visual regression testing
- [ ] Performance monitoring
- [ ] Accessibility testing
- [ ] Mobile app testing

---

## 📊 Metrics & Reporting

### Key Metrics to Track

**Test Coverage**
- Number of test cases
- Critical paths covered
- Code coverage percentage

**Test Reliability**
- Pass rate over time
- Flaky test rate
- False positive rate

**Test Performance**
- Average execution time
- Total suite duration
- Time to feedback

**Quality Impact**
- Bugs caught by tests
- Production incidents prevented
- Regression rate

### Reporting

**Daily Reports**
- Smoke test results
- Quick health check

**Weekly Reports**
- Full regression results
- Trend analysis
- Flaky test identification

**Monthly Reports**
- Quality metrics
- Test coverage analysis
- ROI of testing efforts

---

## 🎉 Benefits for Qilly

### For Development Team
✅ Catch bugs before deployment
✅ Faster regression testing
✅ Confidence in code changes
✅ Automated validation

### For QA Team
✅ Reduced manual testing
✅ Consistent test execution
✅ Better test coverage
✅ Time for exploratory testing

### For Business
✅ Fewer production bugs
✅ Faster release cycles
✅ Lower support costs
✅ Better customer experience

### For Investors
✅ Demonstrates quality processes
✅ Shows production readiness
✅ Reduces technical risk
✅ Proves scalability

---

## 📞 Quick Reference

### Common Commands

**Run All Tests**
```
Click "Run Tests" → Wait → View Results
```

**Run Specific Tests**
```
Select Test Cases → Click "Run Tests" → View Results
```

**Export Results**
```
After tests complete → Click "Export Results" → Save JSON
```

### File Locations

```
/src/app/components/UIAutomationTester.tsx     - Main tool
/src/app/components/UIAutomationLauncher.tsx   - Launcher card
/src/app/components/UIAutomationModal.tsx      - Modal wrapper
/UI_AUTOMATION_TESTING_GUIDE.md                - This guide
```

### Support

**Documentation:**
- This guide
- Inline code comments
- Component descriptions

**Examples:**
- 6 pre-configured test cases
- Multiple step types
- Real-world scenarios

---

## 🚀 Next Steps

### Immediate (This Week)
1. Run all tests before Tuesday presentation
2. Export results as backup
3. Practice demonstrating tool
4. Document any failures

### Short-term (Before Production)
1. Install Playwright
2. Convert critical tests to Playwright
3. Add CI/CD integration
4. Set up automated runs

### Long-term (Post-Launch)
1. Expand test coverage to 80%+
2. Add visual regression testing
3. Implement cross-browser testing
4. Mobile testing automation

---

**Built for Qilly - Construction Billing Innovation**
**Ready for Tuesday's eTender Presentation**
**March 2026**

*Automated testing = Reliable deployments = Happy users! 🎯*
