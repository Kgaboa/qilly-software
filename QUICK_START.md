# 🚀 Quick Start Guide - Qilly Deployment

**Estimated Time: 15-20 minutes**

This is a streamlined guide to get your Qilly Construction Bill Pricing System live on **assuretechsolutions.co.za** as quickly as possible.

---

## ⚡ Super Quick Deployment (5 Steps)

### 1️⃣ Get Your Supabase Credentials (2 minutes)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create one)
3. Click **Settings** → **API**
4. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

📝 **Save these somewhere safe - you'll need them in Step 4**

---

### 2️⃣ Push Code to GitHub (3 minutes)

```bash
# In your project folder, run these commands:
git init
git add .
git commit -m "Initial commit"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/qilly-billing.git
git branch -M main
git push -u origin main
```

✅ **Code is now on GitHub!**

---

### 3️⃣ Deploy to Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up with GitHub"** (or login)
3. Click **"Add New Project"**
4. Click **"Import"** next to your `qilly-billing` repository
5. Vercel auto-detects settings - just click **"Deploy"**

⏳ **Wait 2-3 minutes for build to complete**

---

### 4️⃣ Add Environment Variables (2 minutes)

**CRITICAL STEP - Site won't work without this!**

In Vercel (while deployment is building):

1. Go to **Settings** → **Environment Variables**
2. Add Variable #1:
   ```
   Name: VITE_SUPABASE_URL
   Value: [Paste your Supabase URL from Step 1]
   Environment: Production
   ```
3. Add Variable #2:
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: [Paste your Supabase anon key from Step 1]
   Environment: Production
   ```
4. Click **"Save"**

**Then redeploy:**
- Go to **Deployments** tab
- Click **"..."** on latest deployment
- Click **"Redeploy"**

✅ **Your site now works at `your-project.vercel.app`**

---

### 5️⃣ Connect Custom Domain (5 minutes setup + wait time)

#### A. Add Domain in Vercel

1. In Vercel, go to **Settings** → **Domains**
2. Type: `assuretechsolutions.co.za` and click **Add**
3. Type: `www.assuretechsolutions.co.za` and click **Add**

Vercel will show you DNS records to add.

#### B. Update DNS at Your Domain Registrar

Log into where you bought `assuretechsolutions.co.za` and add:

**Record 1:**
```
Type: A
Name: @ (or leave blank for root)
Value: 76.76.21.21
```

**Record 2:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Save the changes.**

#### C. Wait for DNS (15-30 minutes usually)

- DNS takes time to propagate worldwide
- Check status: [dnschecker.org](https://dnschecker.org)
- Vercel auto-provisions SSL when DNS is ready

✅ **Done! Your site will be live at https://assuretechsolutions.co.za**

---

## 🗄️ Don't Forget: Configure Supabase

After your domain is live, update Supabase:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Set **Site URL** to: `https://assuretechsolutions.co.za`
5. Add **Redirect URLs**:
   ```
   https://assuretechsolutions.co.za/**
   https://www.assuretechsolutions.co.za/**
   ```
6. Click **Save**

✅ **Authentication now works on your custom domain!**

---

## ✅ Verify Everything Works

Visit **https://assuretechsolutions.co.za** and test:

- [ ] Site loads (no errors)
- [ ] Logo appears (no white background)
- [ ] Blue brand colors everywhere
- [ ] Sign up works
- [ ] Login works
- [ ] Upload a bill
- [ ] Pricing engine runs
- [ ] Download PDF works

---

## 🎉 You're Live!

**Congratulations!** Your Qilly Construction Bill Pricing System is now deployed.

### What Happens Next?

**Automatic Updates:**
Every time you push code to GitHub, Vercel auto-deploys:
```bash
git add .
git commit -m "Made some updates"
git push origin main
# Vercel automatically rebuilds and deploys!
```

**Monitoring:**
- View analytics in Vercel Dashboard
- Check error logs: Vercel Dashboard → Deployments → Logs

---

## 🆘 Having Issues?

### Site not loading after deployment?
- Check you added environment variables (Step 4)
- Redeploy after adding variables

### Login not working?
- Update Supabase redirect URLs (see Supabase section above)
- Check environment variables are correct

### Custom domain not working?
- Wait longer (DNS can take up to 48 hours, usually 30 minutes)
- Verify DNS records at your registrar
- Check [dnschecker.org](https://dnschecker.org)

### Build failed?
- Check error in Vercel Deployment logs
- Run `npm run build` locally to test
- Ensure all dependencies are in package.json

---

## 📚 Need More Details?

See the full guides:
- **DEPLOYMENT.md** - Complete step-by-step guide
- **DEPLOYMENT_CHECKLIST.md** - Comprehensive testing checklist
- **README.md** - Project documentation

---

## 🔗 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **DNS Checker:** https://dnschecker.org
- **Your Site:** https://assuretechsolutions.co.za

---

**Good luck with your deployment! 🚀**

Need help? Check the detailed guides or Vercel/Supabase documentation.