# 🧪 Pre-Deployment Testing Checklist

Run these tests **BEFORE** deploying to production to ensure everything works correctly.

---

## 🖥️ Local Environment Setup

### Step 1: Install Dependencies

```bash
npm install
# or
pnpm install
```

**Expected result:** ✅ All packages install without errors

---

### Step 2: Create Local Environment File

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### Step 3: Run Development Server

```bash
npm run dev
```

**Expected result:** 
- ✅ Server starts on http://localhost:5173
- ✅ No console errors
- ✅ Site loads in browser

---

## 🎨 Visual/UI Testing

Open http://localhost:5173 and verify:

### Branding
- [ ] Qilly logo displays correctly
- [ ] Logo has blue background (no white)
- [ ] Primary color is blue (#00b4d8)
- [ ] All brand colors consistent
- [ ] Buttons have blue hover states

### Layout
- [ ] No horizontal scrolling
- [ ] All text is readable
- [ ] Proper spacing and alignment
- [ ] Cards and sections properly styled
- [ ] Footer displays (if applicable)

### Responsive Design
Test these viewport sizes:

**Desktop (1920px):**
- [ ] Layout looks professional
- [ ] All elements visible
- [ ] Proper spacing

**Laptop (1366px):**
- [ ] Layout adapts correctly
- [ ] No overlapping elements
- [ ] Readable text

**Tablet (768px):**
- [ ] Mobile menu appears (if applicable)
- [ ] Cards stack properly
- [ ] Buttons are tap-friendly

**Mobile (375px):**
- [ ] Fully responsive
- [ ] Text readable without zooming
- [ ] Easy navigation
- [ ] No horizontal scroll

---

## 🔐 Authentication Testing

### Sign Up Flow
1. [ ] Click "Sign Up" tab
2. [ ] Enter email and password
3. [ ] Submit form
4. [ ] **Expected:** User account created in Supabase
5. [ ] **Expected:** Redirected to dashboard
6. [ ] **Expected:** Trial bills = 3

**Check Supabase:**
- [ ] User appears in Authentication → Users
- [ ] User record in `users` table with trial_bills_remaining = 3

### Login Flow
1. [ ] Click "Login" tab
2. [ ] Enter email and password
3. [ ] Submit form
4. [ ] **Expected:** Successfully logged in
5. [ ] **Expected:** Dashboard loads with user data

### Logout Flow
1. [ ] Click logout button
2. [ ] **Expected:** Logged out
3. [ ] **Expected:** Redirected to login page
4. [ ] **Expected:** Cannot access dashboard

### Session Persistence
1. [ ] Login
2. [ ] Refresh page (F5)
3. [ ] **Expected:** Still logged in
4. [ ] **Expected:** Session maintained

---

## 📄 Bill Upload Testing

### Manual Bill Creation
1. [ ] Navigate to "Upload Bill" section
2. [ ] Enter project name: "Test Project 1"
3. [ ] Enter bill number: "BOQ-001"
4. [ ] Add line items:
   - Description: "Concrete 25MPa"
   - Unit: "m3"
   - Quantity: "10"
5. [ ] Click "Save" or "Process"
6. [ ] **Expected:** Bill created successfully
7. [ ] **Expected:** Bill appears in Bill History

**Check Supabase:**
- [ ] Bill record in `bills` table
- [ ] Bill items in `bill_items` table

### CSV Upload (if implemented)
1. [ ] Prepare test CSV file
2. [ ] Upload CSV
3. [ ] **Expected:** Data parsed correctly
4. [ ] **Expected:** Bill created with all items
5. [ ] **Expected:** No errors in console

---

## 🏷️ Pricing Engine Testing

### Auto-Pricing
1. [ ] Upload or create a bill
2. [ ] Click "Price Bill" or equivalent
3. [ ] **Expected:** Pricing starts
4. [ ] **Expected:** Progress indicator shows (if implemented)
5. [ ] **Expected:** Items matched to suppliers
6. [ ] **Expected:** Prices calculated
7. [ ] **Expected:** Total cost displayed

### Supplier Comparison
1. [ ] View priced bill
2. [ ] **Expected:** Multiple supplier options shown
3. [ ] **Expected:** Prices compared
4. [ ] **Expected:** Best price highlighted (if implemented)
5. [ ] **Expected:** All 31+ suppliers accessible

### Cost Optimization
1. [ ] Check for optimization suggestions
2. [ ] **Expected:** Alternative suppliers suggested
3. [ ] **Expected:** Cost savings calculated
4. [ ] **Expected:** Recommendations make sense

---

## 📊 Priced Bill View Testing

### Data Display
1. [ ] Open a priced bill
2. [ ] **Expected:** All data displays correctly:
   - [ ] Project name
   - [ ] Bill number
   - [ ] Line items
   - [ ] Quantities
   - [ ] Unit prices
   - [ ] Total prices
   - [ ] Grand total

### Table Functionality
- [ ] Headers clearly labeled
- [ ] Data aligned properly
- [ ] Scrollable if needed (no horizontal scroll on mobile)
- [ ] Responsive on all devices

---

## 📥 PDF Download Testing

### Generate PDF
1. [ ] Click "Download PDF" button
2. [ ] **Expected:** PDF generates without errors
3. [ ] **Expected:** PDF downloads to device
4. [ ] **Expected:** Filename is meaningful (e.g., "bill_BOQ-001.pdf")

### PDF Content
Open downloaded PDF and verify:
- [ ] Company logo/name present
- [ ] All bill data included
- [ ] Tables formatted correctly
- [ ] Readable text
- [ ] Professional appearance
- [ ] Correct totals

---

## 📜 Bill History Testing

### View History
1. [ ] Navigate to Bill History
2. [ ] **Expected:** All user's bills listed
3. [ ] **Expected:** Most recent first (if sorted)
4. [ ] **Expected:** Key info displayed (name, date, cost)

### Access Previous Bills
1. [ ] Click on a bill from history
2. [ ] **Expected:** Bill details load
3. [ ] **Expected:** Can view/download again
4. [ ] **Expected:** Data unchanged

---

## 🎁 Trial System Testing

### Trial Bills Counter
1. [ ] Create new account (should have 3 trials)
2. [ ] Create first bill
3. [ ] **Expected:** Trial counter: 2 remaining
4. [ ] Create second bill
5. [ ] **Expected:** Trial counter: 1 remaining
6. [ ] Create third bill
7. [ ] **Expected:** Trial counter: 0 remaining

### Trial Limit Enforcement
1. [ ] With 0 trials remaining
2. [ ] Try to create another bill
3. [ ] **Expected:** Warning/block message
4. [ ] **Expected:** Upgrade prompt shown
5. [ ] **Expected:** Cannot create more bills

---

## 🏢 Supplier Catalog Testing

### View Suppliers
1. [ ] Navigate to Suppliers section (if accessible)
2. [ ] **Expected:** All 31+ suppliers listed
3. [ ] **Expected:** Organized by category:
   - [ ] Building Materials
   - [ ] Steel & Metal
   - [ ] Concrete & Aggregates
   - [ ] And others

### Supplier Categories
Verify these suppliers appear:
- [ ] Buco
- [ ] Builders Warehouse
- [ ] Macsteel
- [ ] Lafarge
- [ ] PPC
- [ ] Raumix
- [ ] (28+ more suppliers)

---

## 🔍 Error Handling Testing

### Network Errors
1. [ ] Disconnect internet
2. [ ] Try to login
3. [ ] **Expected:** Proper error message
4. [ ] **Expected:** No app crash

### Invalid Data
1. [ ] Try to create bill with:
   - [ ] Empty project name
   - [ ] Negative quantity
   - [ ] Invalid characters
2. [ ] **Expected:** Validation errors shown
3. [ ] **Expected:** Helpful error messages

### Authentication Errors
1. [ ] Try to login with wrong password
2. [ ] **Expected:** "Invalid credentials" message
3. [ ] Try to access dashboard when logged out
4. [ ] **Expected:** Redirected to login

---

## 🚀 Build Testing

### Production Build
```bash
npm run build
```

**Expected results:**
- [ ] ✅ Build completes successfully
- [ ] ✅ No TypeScript errors
- [ ] ✅ No build warnings (or only minor ones)
- [ ] ✅ `dist` folder created
- [ ] ✅ Files properly optimized

### Preview Production Build
```bash
npm run preview
```

**Expected results:**
- [ ] ✅ Preview server starts
- [ ] ✅ Site works same as dev mode
- [ ] ✅ All features functional
- [ ] ✅ No console errors

---

## 🌐 Browser Compatibility

Test on these browsers:

### Chrome
- [ ] All features work
- [ ] UI renders correctly
- [ ] No console errors

### Firefox
- [ ] All features work
- [ ] UI renders correctly
- [ ] No console errors

### Safari (Mac/iOS)
- [ ] All features work
- [ ] UI renders correctly
- [ ] No console errors

### Edge
- [ ] All features work
- [ ] UI renders correctly
- [ ] No console errors

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet

---

## ⚡ Performance Testing

### Load Speed
- [ ] Homepage loads in < 3 seconds
- [ ] Dashboard loads in < 3 seconds
- [ ] Smooth navigation (no lag)

### Console Check
Open browser DevTools → Console:
- [ ] No red errors
- [ ] No critical warnings
- [ ] Network requests successful

### Network Tab
- [ ] All assets load (no 404s)
- [ ] Images load correctly
- [ ] API calls succeed

---

## 🔒 Security Testing

### Environment Variables
- [ ] `.env` file exists locally
- [ ] `.env` is in `.gitignore`
- [ ] No API keys in frontend code
- [ ] Supabase keys are `VITE_` prefixed

### Authentication
- [ ] Cannot access dashboard when logged out
- [ ] Cannot view other users' bills
- [ ] Session expires appropriately

---

## ✅ Final Pre-Deployment Checklist

Before deploying, confirm:

### Code Quality
- [ ] No TODO comments left in critical code
- [ ] No console.log() statements in production code
- [ ] No hardcoded credentials
- [ ] All imports working
- [ ] No unused files

### Git Repository
- [ ] All changes committed
- [ ] Meaningful commit messages
- [ ] .gitignore properly configured
- [ ] No sensitive data in commits

### Documentation
- [ ] README.md is accurate
- [ ] Environment variables documented
- [ ] Deployment guides reviewed

### Supabase
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] Authentication configured
- [ ] Test data inserted (optional)

---

## 🎯 Testing Summary

### Critical Tests (Must Pass)
- ✅ Authentication works
- ✅ Bills can be created
- ✅ Pricing engine runs
- ✅ PDF download works
- ✅ Production build succeeds
- ✅ No console errors

### Important Tests (Should Pass)
- ✅ All suppliers display
- ✅ Trial system enforced
- ✅ Bill history works
- ✅ Responsive on mobile
- ✅ Multiple browsers work

### Nice-to-Have Tests
- ✅ CSV upload (if implemented)
- ✅ Advanced features
- ✅ Edge cases handled

---

## 🐛 Found Issues?

### Debugging Steps:
1. Check browser console for errors
2. Check Supabase logs
3. Verify environment variables
4. Check network tab for failed requests
5. Review Supabase RLS policies
6. Test with fresh user account

---

## ✨ Ready for Deployment?

If all critical and important tests pass, you're ready to deploy! 🚀

**Next step:** Choose your deployment guide:
- **QUICK_START.md** - Fast deployment
- **DEPLOYMENT.md** - Detailed guide
- **DEPLOYMENT_CHECKLIST.md** - Checklist approach

---

**Testing completed:** __________

**Tester:** __________

**All tests passed:** ☐ YES  ☐ NO (fix issues first)

**Ready to deploy:** ☐ YES  ☐ NO

---

Good luck with your deployment! 🎉