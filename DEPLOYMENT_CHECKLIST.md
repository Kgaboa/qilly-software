# 📝 Qilly Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## ✅ Pre-Deployment (Complete these BEFORE deploying)

### Code Preparation
- [ ] All code is committed to Git
- [ ] Project builds successfully locally (`npm run build`)
- [ ] No console errors during development
- [ ] All features tested and working
- [ ] `.gitignore` file is configured

### Supabase Setup
- [ ] Supabase project created
- [ ] Database tables created (users, bills, bill_items, suppliers)
- [ ] Row Level Security (RLS) policies configured
- [ ] Authentication enabled
- [ ] You have your Supabase URL ready
- [ ] You have your Supabase Anon Key ready

### Domain Setup
- [ ] You own `assuretechsolutions.co.za`
- [ ] You have access to domain DNS settings
- [ ] You know where to update DNS records (registrar portal)

---

## 🚀 Deployment Steps

### Step 1: GitHub Setup
- [ ] GitHub account created
- [ ] New repository created on GitHub
- [ ] Local Git repository initialized
- [ ] Code pushed to GitHub (`git push origin main`)

### Step 2: Vercel Account
- [ ] Vercel account created at [vercel.com](https://vercel.com)
- [ ] Logged in with GitHub account (recommended)

### Step 3: Import Project to Vercel
- [ ] Clicked "Add New Project" in Vercel
- [ ] GitHub repository imported
- [ ] Framework detected as "Vite"
- [ ] Build settings confirmed:
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
  - [ ] Install Command: `npm install`

### Step 4: Environment Variables
- [ ] Added `VITE_SUPABASE_URL` in Vercel
- [ ] Added `VITE_SUPABASE_ANON_KEY` in Vercel
- [ ] Variables set for "Production" environment
- [ ] Values double-checked for accuracy

### Step 5: Initial Deployment
- [ ] Clicked "Deploy" button
- [ ] Deployment completed successfully (no errors)
- [ ] Visited temporary Vercel URL (e.g., `qili-billing.vercel.app`)
- [ ] Site loads correctly
- [ ] Login/authentication works

---

## 🌐 Custom Domain Configuration

### Step 6: Add Domain in Vercel
- [ ] Went to Settings → Domains in Vercel
- [ ] Added `assuretechsolutions.co.za`
- [ ] Added `www.assuretechsolutions.co.za`
- [ ] Noted DNS records provided by Vercel

### Step 7: Update DNS Records
- [ ] Logged into domain registrar
- [ ] Added A record for root domain (@):
  ```
  Type: A
  Name: @
  Value: 76.76.21.21
  ```
- [ ] Added CNAME record for www:
  ```
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  ```
- [ ] Saved DNS changes

### Step 8: Wait for DNS Propagation
- [ ] Waited 15-30 minutes
- [ ] Checked DNS propagation at [dnschecker.org](https://dnschecker.org)
- [ ] DNS records propagated globally

### Step 9: Verify SSL Certificate
- [ ] SSL certificate automatically provisioned by Vercel
- [ ] Green padlock appears in browser
- [ ] Site accessible via HTTPS

---

## 🗄️ Supabase Production Configuration

### Step 10: Update Supabase Settings
- [ ] Logged into Supabase dashboard
- [ ] Went to Authentication → URL Configuration
- [ ] Updated Site URL to: `https://assuretechsolutions.co.za`
- [ ] Added Redirect URLs:
  - [ ] `https://assuretechsolutions.co.za/**`
  - [ ] `https://www.assuretechsolutions.co.za/**`
- [ ] Saved changes

### Step 11: Test Supabase Connection
- [ ] Authentication works on production site
- [ ] User registration works
- [ ] User login works
- [ ] Data reads from database
- [ ] Data writes to database

---

## ✅ Post-Deployment Testing

### Step 12: Functionality Testing
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Logo displays correctly (no white background)
- [ ] Brand colors (#00b4d8) appear throughout
- [ ] Button hovers work with brand colors

### Step 13: Authentication Flow
- [ ] Sign up with new account
- [ ] Receive verification email (if configured)
- [ ] Login with credentials
- [ ] Logout works
- [ ] Session persists across page refresh

### Step 14: Core Features
- [ ] Dashboard loads with user data
- [ ] Bill upload (manual) works
- [ ] Bill upload (CSV) works
- [ ] Pricing engine processes bills
- [ ] Priced bill displays correctly
- [ ] PDF download works
- [ ] Bill history shows past bills
- [ ] Supplier catalog loads (31 suppliers)
- [ ] Cost optimization suggestions appear

### Step 15: Responsive Design
- [ ] Desktop view works (1920px+)
- [ ] Laptop view works (1366px)
- [ ] Tablet view works (768px)
- [ ] Mobile view works (375px)
- [ ] No horizontal scrolling issues
- [ ] All buttons clickable on mobile

### Step 16: Performance Testing
- [ ] Page loads in under 3 seconds
- [ ] No console errors in browser
- [ ] No 404 errors
- [ ] Images load correctly
- [ ] Smooth navigation between pages

### Step 17: Browser Testing
- [ ] Chrome works
- [ ] Firefox works
- [ ] Safari works
- [ ] Edge works
- [ ] Mobile browsers work

---

## 🔒 Security Checklist

- [ ] Environment variables not exposed in frontend code
- [ ] Supabase RLS policies protect user data
- [ ] HTTPS enforced (no HTTP access)
- [ ] API keys secured
- [ ] No sensitive data in client-side code

---

## 📊 Monitoring Setup

- [ ] Vercel Analytics reviewed (built-in)
- [ ] Error logging working
- [ ] Performance metrics baseline established
- [ ] Set up alerts for downtime (optional)

---

## 📝 Documentation

- [ ] README.md updated with production URL
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Team members informed of deployment
- [ ] Backup/rollback plan documented

---

## 🎉 Launch Checklist

### Final Pre-Launch
- [ ] All features working 100%
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Mobile experience polished
- [ ] Content reviewed (no typos)
- [ ] Legal pages in place (if required)

### Go Live
- [ ] Announced launch internally
- [ ] Monitoring dashboard open
- [ ] Ready to respond to issues
- [ ] Backup plan ready

### Post-Launch (First 24 Hours)
- [ ] Monitor error logs
- [ ] Check user feedback
- [ ] Monitor performance metrics
- [ ] Test all critical user paths
- [ ] Verify database backups

---

## 🆘 Emergency Contacts

**Vercel Support:** https://vercel.com/support  
**Supabase Support:** https://supabase.com/support  
**DNS Issues:** Contact your domain registrar

---

## 🔄 Continuous Deployment

After initial deployment, updates are automatic:

```bash
git add .
git commit -m "Your update message"
git push origin main
# Vercel automatically redeploys!
```

- [ ] Team understands auto-deployment process
- [ ] Git workflow established
- [ ] Staging environment setup (optional)

---

## ✨ Success Criteria

Your deployment is successful when:

1. ✅ Site accessible at https://assuretechsolutions.co.za
2. ✅ SSL certificate valid
3. ✅ All core features working
4. ✅ Authentication functional
5. ✅ Mobile responsive
6. ✅ No console errors
7. ✅ Fast load times (< 3 seconds)
8. ✅ Database connected and working

---

**Deployment Date:** _________________

**Deployed By:** _________________

**Vercel Project URL:** _________________

**Production URL:** https://assuretechsolutions.co.za

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

---

**🎉 Congratulations on your deployment!** 🎉