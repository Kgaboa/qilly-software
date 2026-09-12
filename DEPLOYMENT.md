# 🚀 Qilly Deployment Guide - Vercel to assuretechsolutions.co.za

This guide will walk you through deploying your Qilly Construction Bill Pricing System to Vercel with your custom domain.

## 📋 Pre-Deployment Checklist

- [ ] Code is ready and tested locally
- [ ] Supabase project is set up
- [ ] You have your Supabase URL and Anon Key
- [ ] You own the domain `assuretechsolutions.co.za`
- [ ] You have access to your domain's DNS settings

---

## 🔧 Step 1: Prepare Your Code

### 1.1 Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - Qilly v1.0"
```

---

## 🚀 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com) and sign up/login**
   - Use GitHub to sign in for easier integration

2. **Click "Add New Project"**

3. **Import Git Repository**
   - Click "Import" next to your GitHub repository
   - If you don't see it, click "Adjust GitHub App Permissions"

4. **Configure Project Settings:**
   
   - **Project Name**: `qilly-billing`
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

5. **Add Environment Variables** ⚠️ CRITICAL STEP:
   
   Click "Environment Variables" and add these:

   ```
   Name: VITE_SUPABASE_URL
   Value: https://your-project-id.supabase.co
   
   Name: VITE_SUPABASE_ANON_KEY
   Value: your-supabase-anon-key-here
   ```

   **Where to find these values:**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to Settings → API
   - Copy **Project URL** and **anon/public key**

6. **Click "Deploy"**
   - Wait 2-3 minutes for the build to complete
   - You'll see a success screen with a URL like `qilly-billing.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```
   - Follow the email verification link

3. **Deploy to Production:**
   ```bash
   vercel --prod
   ```
   
   Answer the prompts:
   - **Set up and deploy?** → Y
   - **Which scope?** → Select your account
   - **Link to existing project?** → N
   - **Project name?** → qilly-billing
   - **In which directory is your code located?** → ./
   - **Want to modify settings?** → N

4. **Add Environment Variables:**
   ```bash
   vercel env add VITE_SUPABASE_URL production
   # Paste your Supabase URL when prompted
   
   vercel env add VITE_SUPABASE_ANON_KEY production
   # Paste your Supabase anon key when prompted
   ```

5. **Redeploy with Environment Variables:**
   ```bash
   vercel --prod
   ```

---

## 🌐 Step 3: Configure Custom Domain (assuretechsolutions.co.za)

### 3.1 Add Domain in Vercel

1. **Go to Vercel Dashboard**
   - Select your `qilly-billing` project
   - Click **Settings** → **Domains**

2. **Add Your Domain**
   - Click "Add" button
   - Enter: `assuretechsolutions.co.za`
   - Click "Add"

3. **Add WWW Subdomain**
   - Click "Add" again
   - Enter: `www.assuretechsolutions.co.za`
   - Click "Add"
   - Set redirect from `www` to root domain (or vice versa)

### 3.2 Configure DNS Records

Vercel will show you the DNS records to add. Go to your domain registrar (where you bought `assuretechsolutions.co.za`) and update the DNS settings.

#### For Root Domain (assuretechsolutions.co.za):

```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

#### For WWW Subdomain (www.assuretechsolutions.co.za):

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

#### Alternative DNS Configuration:

If your DNS provider doesn't support ANAME/ALIAS records for root domain, use these A records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: A
Name: @
Value: 76.76.19.19
```

### 3.3 Wait for DNS Propagation

- **Typical time**: 15-30 minutes
- **Maximum time**: Up to 48 hours
- **Check status**: Use [dnschecker.org](https://dnschecker.org) to verify

### 3.4 Verify SSL Certificate

1. Go back to Vercel Dashboard → Settings → Domains
2. Wait for "SSL Certificate" to show ✓ (usually automatic)
3. If it fails, click "Refresh" or "Regenerate Certificate"

---

## 🗄️ Step 4: Configure Supabase for Production

### 4.1 Update Authentication Settings

1. **Go to Supabase Dashboard**
   - Navigate to: Authentication → URL Configuration

2. **Update Site URL:**
   ```
   https://assuretechsolutions.co.za
   ```

3. **Add Redirect URLs:**
   ```
   https://assuretechsolutions.co.za
   https://assuretechsolutions.co.za/**
   https://www.assuretechsolutions.co.za
   https://www.assuretechsolutions.co.za/**
   ```

4. **Click "Save"**

### 4.2 Configure CORS (if needed)

1. Go to Settings → API
2. Under "API Settings", ensure your domain is allowed
3. Add `https://assuretechsolutions.co.za` to allowed origins if there's a CORS configuration

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Checklist

Visit your site and verify:

- [ ] Site loads at `https://assuretechsolutions.co.za`
- [ ] SSL certificate is valid (🔒 padlock in browser)
- [ ] Login/Signup works correctly
- [ ] Supabase authentication functions
- [ ] Bill upload works
- [ ] Pricing engine processes bills
- [ ] PDF download works
- [ ] All navigation works (no 404 errors on refresh)
- [ ] Mobile responsive design works
- [ ] All 31 suppliers display correctly

### 5.2 Test User Flow

1. **Sign up** with a test email
2. **Login** to the dashboard
3. **Upload a bill** (manual or CSV)
4. **Run pricing engine**
5. **View priced bill**
6. **Download PDF**
7. **Check bill history**

### 5.3 Performance Check

- Test loading speed: [pagespeed.web.dev](https://pagespeed.web.dev)
- Verify mobile performance
- Check browser console for errors

---

## 🔄 Step 6: Continuous Deployment (Automatic Updates)

Once set up, Vercel automatically redeploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main

# Vercel automatically builds and deploys! 🎉
```

---

## 🛠️ Common Issues & Solutions

### Issue: 404 Error on Page Refresh

**Solution**: Ensure `vercel.json` has the rewrite rule (already included):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Issue: "Module not found" errors

**Solution**: Redeploy after ensuring all dependencies are in `package.json`:
```bash
git add package.json
git commit -m "Update dependencies"
git push origin main
```

### Issue: Environment variables not working

**Solutions**:
1. Ensure variables start with `VITE_` prefix
2. Redeploy after adding environment variables
3. Check they're set for "Production" environment in Vercel
4. Hard-refresh browser (Ctrl+Shift+R) to clear cache

### Issue: Supabase authentication fails

**Solutions**:
1. Verify redirect URLs in Supabase dashboard
2. Check CORS settings in Supabase
3. Ensure environment variables are correct
4. Check browser console for specific error messages

### Issue: Custom domain not working

**Solutions**:
1. Wait longer for DNS propagation (up to 48 hours)
2. Verify DNS records are correct at your registrar
3. Use [dnschecker.org](https://dnschecker.org) to check propagation
4. Try flushing local DNS cache:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac
   sudo dscacheutil -flushcache
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

### Issue: Build fails on Vercel

**Solutions**:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Test build locally: `npm run build`
4. Check for TypeScript errors
5. Verify Node.js version compatibility

---

## 📊 Monitoring & Maintenance

### View Deployment Logs

```bash
# Using Vercel CLI
vercel logs

# Or view in Vercel Dashboard → Deployments → [Select deployment] → Logs
```

### Rollback to Previous Version

In Vercel Dashboard:
1. Go to Deployments
2. Find a working deployment
3. Click "..." → "Promote to Production"

### Update Environment Variables

```bash
# Using CLI
vercel env add VARIABLE_NAME production

# Or via Dashboard: Settings → Environment Variables
```

---

## 🎉 Success!

Your Qilly Construction Bill Pricing System should now be live at:
- **https://assuretechsolutions.co.za**
- **https://www.assuretechsolutions.co.za**

### Next Steps:

1. ✅ Set up monitoring (Vercel Analytics is built-in)
2. ✅ Add Google Analytics (optional)
3. ✅ Set up error tracking with Sentry (optional)
4. ✅ Create backup strategy for Supabase data
5. ✅ Document API endpoints
6. ✅ Set up staging environment (optional)

---

## 📞 Support

If you encounter issues:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Review build logs in Vercel dashboard
- Check browser console for frontend errors

---

**Deployment prepared by Figma Make** ✨
**Last updated: January 26, 2026**