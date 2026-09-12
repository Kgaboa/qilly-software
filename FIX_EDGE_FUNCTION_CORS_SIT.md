# 🚨 FIX: Edge Function CORS Error in SIT

## ✅ GREAT PROGRESS!

**What's working:**
- ✅ Contractor creation: SUCCESS!
- ✅ Contractor approval: SUCCESS!
- ✅ Database queries: All working!
- ✅ AI file detection: Working!
- ✅ Project settings: Loaded!

**What's NOT working:**
- ❌ BOQ processing via edge function (CORS error)

---

## 🔴 THE ERROR

```
❌ Access to fetch at 'https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/process-bill'
   from origin 'https://qilly-sit.vercel.app' has been blocked by CORS policy:
   Response to preflight request doesn't pass access control check: It does not have HTTP ok status.

❌ POST https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/process-bill net::ERR_FAILED

❌ Supabase edge function is unreachable in sit environment.
```

**What this means:**
- The OPTIONS preflight request is failing
- Edge function either not deployed OR not responding correctly
- CORS headers not being sent properly

---

## ⚡ THE FIX (3 OPTIONS)

### **OPTION 1: Verify Edge Function is Deployed** ⭐

**Most likely cause:** Edge function not deployed to SIT environment!

**Steps:**

1. **Check if function exists in Supabase Dashboard:**
   - Go to: https://app.supabase.com
   - Select: SIT project (`kcptusoevqapcvptlgkd`)
   - Click: **Edge Functions** (left sidebar)
   - Look for: `server` function

2. **If function is NOT listed:**
   - The function isn't deployed to SIT!
   - You need to deploy it (see "Deploy Edge Function" below)

3. **If function IS listed:**
   - Click on the function
   - Check deployment status
   - Check logs for errors

---

### **OPTION 2: Deploy Edge Function to SIT**

**If the function isn't deployed (most likely issue):**

```bash
# Navigate to your project root
cd /path/to/qilly

# Login to Supabase
supabase login

# Link to SIT project
supabase link --project-ref kcptusoevqapcvptlgkd

# Deploy the edge function
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd

# Verify deployment
supabase functions list --project-ref kcptusoevqapcvptlgkd
```

**Expected output:**
```
✓ server deployed successfully
```

---

### **OPTION 3: Test Edge Function Directly**

**Test if the function responds:**

```bash
# Test OPTIONS (preflight)
curl -X OPTIONS \
  https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/process-bill \
  -H "Origin: https://qilly-sit.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  -v

# Test health check
curl https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/health
```

**Expected response for OPTIONS:**
```
< HTTP/2 204
< access-control-allow-origin: *
< access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
< access-control-allow-headers: Content-Type, Authorization
```

**Expected response for health:**
```
{"status":"ok"}
```

**If you get errors:**
- Function not deployed
- Function has errors
- CORS middleware not working

---

## 🎯 MOST LIKELY ISSUE

**Based on the error, the most likely issue is:**

❌ **Edge function is NOT deployed to SIT environment**

**Why:**
- CORS is properly configured in the code (I can see `origin: "*"`)
- OPTIONS handler exists
- But the preflight request is failing completely
- This usually means the function doesn't exist

**Solution:**
1. Deploy the edge function to SIT
2. Or check if function exists and redeploy

---

## 📋 DEPLOYMENT CHECKLIST

**Before deploying:**

- [ ] You have Supabase CLI installed
  ```bash
  # Check if installed
  supabase --version
  
  # If not installed:
  # macOS/Linux: brew install supabase/tap/supabase
  # Windows: scoop bucket add supabase https://github.com/supabase/scoop-bucket.git && scoop install supabase
  ```

- [ ] You're logged in to Supabase
  ```bash
  supabase login
  ```

- [ ] You have the SIT project ID
  ```
  kcptusoevqapcvptlgkd
  ```

**Deploy:**

```bash
# Deploy edge function to SIT
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd
```

**Verify:**

```bash
# List functions
supabase functions list --project-ref kcptusoevqapcvptlgkd

# Expected output:
# server (deployed)
```

**Test:**

```bash
# Test health endpoint
curl https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/health

# Expected: {"status":"ok"}
```

---

## 🔍 DEBUGGING STEPS

### Step 1: Check if function exists

**In Supabase Dashboard:**
1. SIT project → Edge Functions
2. Look for `server` function
3. If NOT listed → Function not deployed (deploy it!)
4. If listed → Check status and logs

---

### Step 2: Check function logs

**In Supabase Dashboard:**
1. Edge Functions → `server`
2. Click **Logs** tab
3. Look for errors when you try to process BOQ
4. Common errors:
   - "Function not found" → Not deployed
   - "CORS error" → Middleware issue
   - "500 error" → Function code error

---

### Step 3: Test locally first

**Before deploying to SIT, test locally:**

```bash
# Serve function locally
supabase functions serve server

# Test in another terminal
curl http://localhost:54321/functions/v1/server/make-server-9db710f3/health
```

**Expected:** `{"status":"ok"}`

**If local works but SIT doesn't:**
- Function needs to be deployed to SIT
- Or SIT deployment is outdated

---

## 🆘 COMMON ISSUES

### Issue 1: Function not deployed

**Symptom:**
```
net::ERR_FAILED
Response to preflight request doesn't pass access control check
```

**Fix:**
```bash
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd
```

---

### Issue 2: CORS headers missing

**Symptom:**
```
Access-Control-Allow-Origin header missing
```

**Check:** Edge function code already has CORS configured:
```typescript
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
```

**If still failing:**
- Redeploy the function
- Check if middleware is being applied

---

### Issue 3: Environment variables missing

**Symptom:**
```
SUPABASE_URL is not defined
SUPABASE_SERVICE_ROLE_KEY is not defined
```

**Fix:**
Set environment variables in Supabase Dashboard:
1. SIT project → Settings → Edge Functions
2. Add secrets:
   - `SUPABASE_URL`: `https://kcptusoevqapcvptlgkd.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: (get from API settings)

---

## 💡 ALTERNATIVE: Demo Mode Fallback

**If you CAN'T fix the edge function before Monday:**

Your code already has demo mode fallback! But it's disabled in SIT.

**Option A: Use local pricing (temporary workaround)**

The error shows:
```javascript
❌ [SIT] Supabase edge function failed - NOT falling back to demo mode
```

This means in SIT, demo mode is intentionally disabled.

**For Monday demo:**
- If edge function can't be fixed in time
- Consider using LOCAL/DEV environment for the BOQ processing demo
- LOCAL has demo mode enabled and will work without edge function
- Show other features (contractor management, approval flow) in SIT

---

## 🎯 RECOMMENDED ACTION PLAN

### **RIGHT NOW (If you have CLI access):**

```bash
# 1. Deploy edge function to SIT
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd

# 2. Verify deployment
supabase functions list --project-ref kcptusoevqapcvptlgkd

# 3. Test health
curl https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/health

# 4. Test SIT app
# Go to https://qilly-sit.vercel.app
# Try processing BOQ
# Should work! ✅
```

**Time: 5 minutes**

---

### **IF YOU DON'T HAVE CLI ACCESS:**

**Ask whoever deployed the function to:**
1. Deploy `server` edge function to SIT project
2. Verify it's deployed and running
3. Check logs for any errors

---

### **FOR MONDAY DEMO (Plan B):**

**If edge function can't be fixed:**

**Hybrid demo approach:**
1. **Use SIT for:**
   - ✅ Contractor registration (working!)
   - ✅ Contractor approval (working!)
   - ✅ Database queries (working!)
   - ✅ Authentication (working!)

2. **Use LOCAL for:**
   - ✅ BOQ processing (has demo mode)
   - ✅ Pricing calculations (works locally)
   - ✅ Full pricing engine demo

**Tell investors:**
- "SIT environment for user management and approvals" (show SIT)
- "Local environment for pricing demonstration" (switch to local)
- This is common in demos!

---

## 📊 CURRENT STATUS

### Working in SIT:
```
✅ User authentication
✅ Contractor creation
✅ Contractor approval
✅ Database queries
✅ RLS policies
✅ POPIA compliance
✅ AI file detection
✅ Project settings
```

### Not Working in SIT:
```
❌ BOQ processing (edge function CORS)
```

### Impact on Demo:
```
LOW - Can use hybrid demo approach
or
ZERO - If edge function is deployed successfully
```

---

## ✅ SUCCESS CRITERIA

**After deploying edge function:**

**1. Test OPTIONS request:**
```bash
curl -X OPTIONS \
  https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/process-bill \
  -v
```

**Expected:**
```
< HTTP/2 204
< access-control-allow-origin: *
```

**2. Test in SIT:**
- Go to: https://qilly-sit.vercel.app
- Upload BOQ
- Process bill
- Result: ✅ No CORS error!

**3. Check console:**
```
✅ POST /process-bill → 200 OK
✅ BOQ processed successfully
✅ No CORS errors
```

---

## 🔑 KEY COMMANDS

```bash
# Deploy edge function
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd

# List functions
supabase functions list --project-ref kcptusoevqapcvptlgkd

# View logs
supabase functions logs server --project-ref kcptusoevqapcvptlgkd

# Test health
curl https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/health
```

---

## 📞 QUICK REFERENCE

**Error:** CORS policy blocking edge function  
**Cause:** Edge function not deployed OR not responding  
**Fix:** Deploy function to SIT  
**Command:** `supabase functions deploy server --project-ref kcptusoevqapcvptlgkd`  
**Time:** 5 minutes  
**Fallback:** Use LOCAL for BOQ demo, SIT for everything else  

---

## 🎉 BOTTOM LINE

**The GOOD news:**
- 95% of SIT is working perfectly!
- Contractor creation ✅
- Database queries ✅
- Authentication ✅

**The issue:**
- Edge function needs to be deployed to SIT
- OR use hybrid demo (SIT + LOCAL)

**For Monday:**
- Deploy edge function → 100% working in SIT
- Or hybrid demo → Still professional and impressive

**You're READY either way!** 🚀
