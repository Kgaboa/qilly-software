# 🔧 Vercel Environment Variable Debug Guide

## 🐛 **THE PROBLEM:**

You're seeing this in console:
```
🚀 Using PRODUCTION environment
🔧 Using DEVELOPMENT environment
```

This happens because:
1. **Vite build mode** is `production` (normal for Vercel builds)
2. **VITE_ENVIRONMENT** variable is not being read correctly
3. Falls back to development because production config is not enabled

---

## ✅ **THE FIX:**

### **Step 1: Verify Vercel Environment Variable**

1. **Go to:** https://vercel.com/assure-tech-solution/qilly/settings/environment-variables

2. **Check if you have:**
   - Variable name: `VITE_ENVIRONMENT`
   - Value: `sit`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

3. **If it's missing or wrong:**
   - Click "Add New"
   - Name: `VITE_ENVIRONMENT`
   - Value: `sit`
   - Check ALL three: Production, Preview, Development
   - Click "Save"

4. **IMPORTANT:** After changing environment variables, you MUST redeploy!

---

### **Step 2: Check Current Environment Variables**

**In the deployed app console (F12):**

```javascript
// Run this to see what Vite can see at RUNTIME:
console.log('VITE_ENVIRONMENT:', import.meta.env.VITE_ENVIRONMENT);
console.log('MODE:', import.meta.env.MODE);
console.log('All env vars:', import.meta.env);
```

**Expected output for SIT:**
```javascript
VITE_ENVIRONMENT: "sit"
MODE: "production"  // This is normal! Vite always builds in production mode
```

**If VITE_ENVIRONMENT is undefined:**
- Environment variable is not set in Vercel
- OR it's not prefixed with `VITE_` (Vite only exposes VITE_* vars to client)

---

### **Step 3: Redeploy After Setting Environment Variable**

After adding/changing `VITE_ENVIRONMENT` in Vercel:

1. **Go to:** https://vercel.com/assure-tech-solution/qilly/deployments

2. **Click the "..." menu** on the latest deployment

3. **Click "Redeploy"**

4. **Wait for deployment to complete**

5. **Test again** - should now show "Using SIT environment"

---

## 🧪 **ALTERNATIVE: Use Vercel System Environment Variable**

Vercel provides a built-in variable `VERCEL_ENV` that tells you which environment you're in:

**Values:**
- `production` - When deployed to production (qilly.co.za)
- `preview` - When deployed to preview URL (sit.qilly.co.za or Vercel preview)
- `development` - When running locally

**We can map this to our environments:**

```typescript
// In environment.ts
const vercelEnv = import.meta.env.VERCEL_ENV;
if (vercelEnv === 'preview') {
  // Map preview deployments to SIT
  return 'sit';
}
```

But this requires code changes. Let's try the simple fix first (VITE_ENVIRONMENT).

---

## 🎯 **RECOMMENDED APPROACH:**

### **For Each Deployment:**

| URL | VITE_ENVIRONMENT | Vercel Branch | Purpose |
|-----|------------------|---------------|---------|
| `https://qilly-2ctfxlfcx-assure-tech-solution.vercel.app` | `sit` | `main` | SIT Testing |
| `https://sit.qilly.co.za` | `sit` | `main` | SIT Testing (custom domain) |
| `https://uat.qilly.co.za` | `uat` | `uat` | UAT Testing |
| `https://preprod.qilly.co.za` | `preprod` | `preprod` | Pre-Production |
| `https://qilly.co.za` | `production` | `production` | Production |

---

## 📋 **CURRENT ISSUE CHECKLIST:**

- [ ] VITE_ENVIRONMENT is set in Vercel
- [ ] VITE_ENVIRONMENT value is exactly `sit` (lowercase)
- [ ] Environment variable is checked for all three: Production, Preview, Development
- [ ] Redeployed after setting environment variable
- [ ] Cleared browser cache after redeploy
- [ ] Checked console for `import.meta.env.VITE_ENVIRONMENT`

---

## 🔍 **IF STILL NOT WORKING:**

If after setting VITE_ENVIRONMENT=sit and redeploying you still see "PRODUCTION" → "DEVELOPMENT":

1. **Check the build logs in Vercel:**
   - Go to: https://vercel.com/assure-tech-solution/qilly/deployments
   - Click latest deployment
   - Check "Building" logs
   - Look for environment variable values

2. **Verify Vite can access it:**
   - In your deployed app console: `console.log(import.meta.env)`
   - Should show VITE_ENVIRONMENT: "sit"

3. **If VITE_ENVIRONMENT is still undefined:**
   - The variable might need to be in a `.env` file
   - OR Vercel might not be injecting it correctly
   - Try using `VERCEL_ENV` instead

---

## 💡 **QUICK TEST:**

After setting VITE_ENVIRONMENT and redeploying:

**Visit:** https://qilly-2ctfxlfcx-assure-tech-solution.vercel.app

**Press F12 and run:**
```javascript
localStorage.clear();
location.reload();
```

**Expected console output:**
```
🌍 Using environment from VITE_ENVIRONMENT: SIT
✅ Supabase client created for sit environment
📊 Project URL: https://kcptusoevqapcvptlgkd.supabase.co
```

---

## 🚀 **NEXT STEPS:**

1. ✅ Set VITE_ENVIRONMENT=sit in Vercel
2. ✅ Redeploy
3. ✅ Clear localStorage in browser
4. ✅ Test contractor signup again
5. ✅ Admin dashboard should show SIT environment
6. ✅ Should see 1 contractor

---

**The fix is simple: Just set the environment variable and redeploy!** 🎯
