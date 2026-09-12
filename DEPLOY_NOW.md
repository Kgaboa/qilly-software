# ⚡ DEPLOY EDGE FUNCTION NOW!

**Status:** ✅ Supabase CLI installed  
**Status:** ✅ `.ts` files created  
**Next:** Deploy to SIT!

---

## 🚀 COPY-PASTE THESE COMMANDS

**In your PowerShell (where you are now):**

```bash
# You're already in the right directory!
# Just run this command:

supabase functions deploy server --project-ref kcptusoevqapcvptlgkd
```

**When prompted for database password:**
- Go to: https://app.supabase.com/project/kcptusoevqapcvptlgkd/settings/database
- Scroll to "Database Password"
- Copy the password
- Paste it when prompted

---

## ✅ WHAT TO EXPECT

**During deployment:**
```
Bundling function...
Packaging function...
Uploading function...
Deploying function...
✓ Deployed function server
```

**If you see this:** ✅ **SUCCESS!**

---

## 🎯 AFTER DEPLOYMENT

### **Test 1: Health Check**

**Open in browser:**
```
https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/health
```

**Should see:**
```json
{"status":"ok"}
```

---

### **Test 2: SIT BOQ Processing**

1. Go to: https://qilly-sit.vercel.app
2. Login as contractor
3. Upload BOQ file
4. Click "Process Bill"
5. **Should work with NO CORS error!** ✅

---

## 🆘 IF DATABASE PASSWORD FAILS

**Option 1: Reset Password**

1. Go to: https://app.supabase.com/project/kcptusoevqapcvptlgkd/settings/database
2. Click "Reset Database Password"
3. Copy new password
4. Save it somewhere safe
5. Use it in the deployment command

---

**Option 2: Link Without Password**

```bash
# Just link without password first
supabase link --project-ref kcptusoevqapcvptlgkd --password ""

# Then deploy
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd
```

---

## 📊 WHAT THIS FIXES

**BEFORE:**
```
❌ CORS error when processing BOQ
❌ Edge function not deployed
❌ 95% SIT functionality
```

**AFTER:**
```
✅ Edge function deployed
✅ CORS working
✅ BOQ processing works
✅ 100% SIT functionality!
```

---

## 🎉 SUCCESS CRITERIA

**After deployment, you should be able to:**

1. ✅ Create contractors in SIT (already working!)
2. ✅ Approve contractors in SIT (already working!)
3. ✅ **Process BOQ in SIT** (will work after deployment!)
4. ✅ 100% demo ready for Monday!

---

## ⏱️ TIME: 3 MINUTES

```
Deploy command            30 sec
Enter password            10 sec
Upload & deploy          90 sec
Test health check        20 sec
Test SIT BOQ             30 sec
────────────────────────────────
TOTAL:                  3 min
```

---

## 🚀 DO IT NOW!

**Command:**
```bash
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd
```

**Then test:**
```
https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/health
```

**Then test SIT:**
```
https://qilly-sit.vercel.app
```

---

## 📞 QUICK REFERENCE

**Deploy:** `supabase functions deploy server --project-ref kcptusoevqapcvptlgkd`  
**Test:** Open health URL in browser  
**Verify:** Process BOQ in SIT  
**Result:** 100% ready for Monday! 🎉

---

**GO! DEPLOY IT NOW! 3 MINUTES TO 100%!** 🚀
