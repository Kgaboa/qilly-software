# ✅ Deployment Checklist - Quick Reference

## 🎯 You've Already Pushed to Dev Branch - Here's What's Next:

---

## ⚡ QUICK ANSWER

**If you have Vercel or Netlify connected:**
1. ✅ Your push to dev already triggered automatic deployment
2. 🕒 Wait 2-3 minutes
3. 🌐 Check dashboard:
   - Vercel: https://vercel.com/dashboard
   - Netlify: https://app.netlify.com
4. ✅ Your dev site will be live at your preview URL

**If you DON'T have Vercel/Netlify yet:**
- Follow the "First-Time Setup" in `/DEPLOY_AFTER_MANUAL_PUSH.md`
- Takes ~5 minutes to set up
- Then every future push auto-deploys!

---

## 📋 Step-by-Step: What Happens After Your Git Push

```
✅ YOU COMPLETED:
git add .
git commit -m "message"
git push origin dev
└─► Code is now in remote dev branch

⏳ HAPPENING NOW (AUTOMATIC):
🔄 Vercel/Netlify detects your push
🔄 Runs: npm install
🔄 Runs: npm run build
🔄 Deploys to dev URL
└─► Wait 2-3 minutes

🧪 YOUR TURN (TEST):
□ Visit dev URL
□ Login to Admin Dashboard
□ Click Partners tab (NEW badge)
□ Test all 5 Partner Portal tabs
□ Test export functionality
□ Test tier upgrade buttons
□ Check console for errors

🚀 BEFORE TUESDAY DEMO:
□ Dev tested and working
□ Merge to main: git checkout main → git merge dev → git push origin main
□ Production auto-deploys
□ Site live at qilly.co.za
□ Ready for investor presentation!
```

---

## 🔍 How to Check Deployment Status

### Vercel:
1. Go to: https://vercel.com/dashboard
2. Click: Your "Qilly" project
3. View: "Deployments" tab
4. Look for: Latest deployment from `dev` branch
5. Status:
   - 🟡 **Building** = In progress
   - 🟢 **Ready** = Success! Click to view
   - 🔴 **Error** = Check logs

### Netlify:
1. Go to: https://app.netlify.com
2. Click: Your Qilly site
3. View: "Deploys" tab
4. Look for: Latest deploy from `dev` branch
5. Status:
   - 🟡 **Building** = In progress
   - 🟢 **Published** = Success! Click URL
   - 🔴 **Failed** = Check logs

---

## 🌐 Your Dev URLs

**Vercel (most common):**
- `https://qilly-git-dev-yourname.vercel.app`
- Or: `https://dev.qilly.co.za` (if custom domain set up)

**Netlify:**
- `https://dev--qilly.netlify.app`
- Or: `https://dev.qilly.co.za` (if custom domain set up)

---

## ✅ Testing Checklist (After Deployment is Ready)

### 1. Basic Functionality
- [ ] Site loads without errors
- [ ] Login page accessible
- [ ] Can login with test credentials
- [ ] Dashboard loads correctly
- [ ] No console errors (F12 → Console tab)

### 2. Partner Portal Features (NEW)
- [ ] Admin Dashboard → Partners tab visible
- [ ] Partners tab has purple-blue "NEW" badge
- [ ] **Overview tab**: Shows partnership benefits
- [ ] **Onboarding tab**: Application forms present
- [ ] **White-Label Config tab**: Live preview works
- [ ] **API & Integration tab**: Code examples visible
- [ ] **Analytics tab**: Revenue dashboard displays

### 3. Export Functionality (NEW)
- [ ] Admin → Dev Tools → Performance Testing
- [ ] Export dropdown visible (3 dots menu)
- [ ] Can select JSON export
- [ ] Can select HTML export
- [ ] Can select Excel export
- [ ] Admin → UI Automation → Same export options

### 4. Tier Upgrade Buttons (NEW)
- [ ] Login as FREE tier user
- [ ] "Upgrade to Pro" button visible under tier badge
- [ ] Login as PROFESSIONAL tier user
- [ ] "Upgrade to Enterprise" button visible
- [ ] Login as ENTERPRISE tier user
- [ ] No upgrade button (already top tier)

### 5. Database & Authentication
- [ ] Supabase connection working
- [ ] User data loads correctly
- [ ] Can create/edit/delete items
- [ ] Session persists after refresh
- [ ] Logout works correctly

### 6. Environment Configuration
- [ ] AI Upload feature is HIDDEN (important for demo!)
- [ ] Environment shows "Development" or "SIT"
- [ ] Test payment gateway (sandbox mode)

**Check in browser console:**
```javascript
console.log(import.meta.env.VITE_ENVIRONMENT);
// Should show: "development"

console.log(import.meta.env.VITE_SHOW_AI_UPLOAD);
// Should show: false or undefined (hidden for demo)
```

---

## 🚨 Quick Troubleshooting

### Problem: Deployment Failed
**Check:**
1. Build logs in Vercel/Netlify dashboard
2. Look for errors (missing packages, syntax errors)

**Fix:**
```bash
# Test build locally
npm run build

# If it works locally, check environment variables in deployment platform
```

### Problem: Environment Variables Not Working
**Fix:**
1. Vercel: Project Settings → Environment Variables
2. Add: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, etc.
3. Select "Preview" for dev branch
4. Redeploy: `git commit --allow-empty -m "Redeploy" && git push origin dev`

### Problem: Old Version Showing
**Fix:**
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear cache: DevTools → Right-click refresh → "Empty cache and hard reload"

### Problem: No Deployment Triggered
**Fix:**
1. Check Git integration in Vercel/Netlify settings
2. Verify "All branches" or "dev" is enabled for deploys
3. Manual trigger: Click "Deploy" button in dashboard

---

## 🚀 Production Deployment (Before Tuesday Demo)

Once dev is tested and everything works:

```bash
# Step 1: Switch to main branch
git checkout main

# Step 2: Merge dev branch
git merge dev

# Step 3: Push to production
git push origin main
```

**Result:**
- ✅ Automatic production deployment
- ✅ Live at: `https://qilly.co.za`
- ✅ Takes ~2-3 minutes
- ✅ Ready for eTender demo!

---

## 📊 Pre-Demo Production Checklist

Before Tuesday's investor presentation:

### Code Quality:
- [ ] All features tested on dev environment
- [ ] No console errors or warnings
- [ ] Build succeeds without errors
- [ ] All tests passing (if you have tests)

### Features Working:
- [ ] Partner Portal fully functional
- [ ] White-label configuration works
- [ ] API documentation accessible
- [ ] Export functionality (JSON, HTML, Excel)
- [ ] Tier upgrade flow works
- [ ] Analytics dashboard displays data

### Security & Privacy:
- [ ] AI Upload feature HIDDEN (VITE_SHOW_AI_UPLOAD=false)
- [ ] Admin credentials secured
- [ ] Environment variables set correctly
- [ ] Payment gateway in test/sandbox mode
- [ ] No sensitive data exposed in frontend

### Performance:
- [ ] Page load time < 3 seconds
- [ ] No performance bottlenecks
- [ ] Database queries optimized
- [ ] Images optimized

### Data & Content:
- [ ] Demo data seeded in database
- [ ] Realistic mock data for BOQs
- [ ] Supplier data populated
- [ ] Test user accounts created

### Backup & Recovery:
- [ ] Database backup taken
- [ ] Rollback plan ready
- [ ] Previous stable version noted
- [ ] Emergency contact list ready

---

## 📞 Quick Links

### Dashboards:
- **Vercel:** https://vercel.com/dashboard
- **Netlify:** https://app.netlify.com
- **Supabase:** https://app.supabase.com

### Documentation:
- **Full Deployment Guide:** `/DEPLOYMENT_GUIDE_DEV_BRANCH.md`
- **After Manual Push:** `/DEPLOY_AFTER_MANUAL_PUSH.md`
- **Quick Deploy:** `/QUICK_DEPLOY.md`
- **Partner Portal Docs:** `/PARTNER_PORTAL_INTEGRATION_COMPLETE.md`

### Scripts:
- **Linux/Mac:** Run `./DEPLOY_NOW.sh`
- **Windows:** Run `DEPLOY_NOW.bat`

---

## ⏱️ Timeline

**NOW (0 min):**
✅ Code pushed to dev branch

**NOW → 3 min:**
🔄 Automatic build & deployment

**3 min → 15 min:**
🧪 Testing on dev environment

**15 min → 30 min:**
✅ Verification complete

**Before Tuesday:**
🚀 Merge to main → Production deploy

**Tuesday:**
🎉 eTender investor presentation!

---

## 💡 Pro Tips

1. **Monitor Real-Time:**
   - Open Vercel/Netlify dashboard
   - Watch build logs live
   - See exactly what's happening

2. **Test Immediately:**
   - Don't wait until Tuesday
   - Test thoroughly on dev
   - Fix issues now, not during demo

3. **Have Backup:**
   - Know your previous stable commit
   - Can rollback if needed: `git reset --hard <commit-hash>`

4. **Practice Demo:**
   - Walk through Partner Portal flow
   - Practice export functionality
   - Time your presentation

5. **Prepare Talking Points:**
   - Private sector revenue model
   - Construction firm savings (85-95%)
   - White-label partnerships (30-40% revenue share)
   - Fast deployment (2-4 weeks)

---

## 🎯 Summary

### Status: ✅ CODE PUSHED TO DEV BRANCH

### Next Steps:
1. ⏰ Wait 2-3 minutes for auto-deployment
2. 🌐 Check Vercel/Netlify dashboard
3. 🧪 Test all features on dev URL
4. ✅ Verify everything works
5. 🚀 Merge to main before Tuesday

### Your Dev Deployment URLs:
- Check your Vercel or Netlify dashboard for the exact URL
- Usually: `qilly-git-dev.vercel.app` or `dev--qilly.netlify.app`

### For Tuesday Demo:
- Test on dev environment today
- Merge to production Monday night
- Demo on live production site Tuesday
- Have backup plan ready

---

**🎉 You're Ready! Your deployment is processing now. Check your dashboard! 🚀**

---

## 🆘 Need Help?

1. **Check build logs** in Vercel/Netlify dashboard
2. **Test locally first:** `npm run build`
3. **Review documentation:** `/DEPLOY_AFTER_MANUAL_PUSH.md`
4. **Verify environment variables** in deployment platform
5. **Hard refresh browser** if old version showing

---

**Last Updated:** After Partner Portal integration  
**Environment:** Dev branch deployment  
**Target:** Tuesday eTender investor demo  
**Status:** 🟢 Ready for deployment testing
