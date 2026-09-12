# 🚨 URGENT: EDGE FUNCTION 401 FIX

**ROOT CAUSE IDENTIFIED:**

The edge function is using `SERVICE_ROLE_KEY` client to validate user access tokens, which **DOESN'T WORK**!

```typescript
// ❌ WRONG (current code):
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const { data: { user }, error } = await supabase.auth.getUser(accessToken);
// This fails because service role client can't validate user tokens!
```

---

## 🔧 THE FIX

**You need to add `SUPABASE_ANON_KEY` to the edge function environment variables!**

### **STEP 1: Get your Anon Key**

1. Go to: https://app.supabase.com/project/kcptusoevqapcvptlgkd/settings/api
2. Copy the **anon/public** key (NOT the service_role key)
3. It should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...`

---

### **STEP 2: Add Environment Variable**

**Option A: Via Supabase Dashboard**

1. Go to: https://app.supabase.com/project/kcptusoevqapcvptlgkd/settings/functions
2. Click on "server" function
3. Click "Settings" tab
4. Add environment variable:
   - Name: `SUPABASE_ANON_KEY`
   - Value: `<paste your anon key here>`
5. Click "Save"
6. Re-deploy the function

**Option B: Via CLI**

```bash
# Set the secret
supabase secrets set SUPABASE_ANON_KEY=your_anon_key_here --project-ref kcptusoevqapcvptlgkd

# Re-deploy
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd
```

---

## ⚡ ALTERNATIVE QUICK FIX (NO ENV VAR NEEDED)

**If you can't add env vars right now, use this simpler fix:**

Replace lines 198-211 in `/supabase/functions/server/index.ts` with:

```typescript
app.post("/make-server-9db710f3/process-bill", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: "Authorization header required" }, 401);
    }

    const accessToken = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Validate token by making a simple Supabase Auth API call
    const tokenValidationUrl = `${Deno.env.get('SUPABASE_URL')}/auth/v1/user`;
    const tokenValidationResponse = await fetch(tokenValidationUrl, {
      headers: {
        'Authorization': authHeader,
        'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      }
    });
    
    if (!tokenValidationResponse.ok) {
      console.log(`Token validation failed: ${tokenValidationResponse.status}`);
      return c.json({ error: "Unauthorized - Invalid or expired token" }, 401);
    }
    
    const user = await tokenValidationResponse.json();
    if (!user || !user.id) {
      console.log('Token validation response missing user data');
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user data from KV store
    const supabase = getSupabaseClient();
    const userData = await kv.get(`user:${user.id}`);
```

This bypasses the Supabase JS client and directly calls the Auth API.

---

## 🚀 DEPLOY NOW!

**Once you update the code:**

```bash
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd
```

**Test:**
```
https://qilly-sit.vercel.app
```

---

## ✅ VERIFICATION

**After deployment, the 401 error should be GONE!**

**Console should show:**
```
✅ POST /process-bill → 200 OK
✅ Bill processed successfully
```

**NO MORE:**
```
❌ POST /process-bill → 401 Unauthorized
```

---

## 📝 FILES TO UPDATE

1. `/supabase/functions/server/index.ts` - Use alternative fix above
2. Deploy edge function
3. Test in SIT

**TIME TO FIX:** 5 minutes

---

## 🎯 WHY THIS WORKS

**The Problem:**
- `SERVICE_ROLE_KEY` client can't validate user JWTs
- User access tokens need to be validated with the anon key OR via Auth API

**The Solution:**
- Call Supabase Auth API directly with the user's token
- Auth API validates the token and returns user data
- No need for anon key in code!

---

## ⚡ COPY-PASTE FIX

**Replace the `/make-server-9db710f3/process-bill` POST handler:**

```typescript
app.post("/make-server-9db710f3/process-bill", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: "Authorization header required" }, 401);
    }

    const accessToken = authHeader.substring(7);
    
    // Validate token via Supabase Auth API
    const authApiUrl = `${Deno.env.get('SUPABASE_URL')}/auth/v1/user`;
    const authResponse = await fetch(authApiUrl, {
      headers: {
        'Authorization': authHeader,
        'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      }
    });
    
    if (!authResponse.ok) {
      console.log(`Auth failed: ${authResponse.status} - ${await authResponse.text()}`);
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const user = await authResponse.json();
    if (!user || !user.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user data from KV store
    const supabase = getSupabaseClient();
    const userData = await kv.get(`user:${user.id}`);
    
    // Check if user has available pricing attempts
    if (!userData || (!userData.paid_status && userData.trial_used)) {
      return c.json({ error: "Free trial already used. Please upgrade to continue." }, 403);
    }

    const body = await c.req.json();
    const { billData, projectSettings } = body;

    if (!billData || !Array.isArray(billData)) {
      return c.json({ error: "Valid bill data required" }, 400);
    }

    console.log('✅ User authenticated:', user.email);
    console.log('Processing bill with project settings:', projectSettings);

    // ... rest of the processing code stays the same ...
```

---

**DO THIS NOW AND REDEPLOY!** 🚀
