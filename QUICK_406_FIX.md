# ⚡ QUICK FIX: HTTP 406 Error Still Happening

## **Problem:**
Script ran ✅ but contractor@gmail.com still shows demo@operator.com ❌

## **Cause:**
Code queries by `email`, but RLS policy only checks `user_id`

---

## **5-SECOND FIX:**

### **Run This SQL:**

```sql
DROP POLICY IF EXISTS "Contractors can read own data" ON public.contractors;

CREATE POLICY "Contractors can read own data"
ON public.contractors FOR SELECT TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);
```

**Or use file:** `/FIX_CONTRACTOR_RLS_BY_EMAIL.sql`

---

## **Steps:**

1. **Supabase SQL Editor:**
   https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new

2. **Copy & Paste** the SQL above

3. **Run** ▶️

4. **Clear browser cache** (Ctrl+Shift+Delete)

5. **Login** as contractor@gmail.com

---

## **Expected Result:**

✅ No more HTTP 406 errors  
✅ Contractor dashboard loads  
✅ No demo@operator.com card

---

## **Why This Works:**

The policy now allows **BOTH**:
- Queries by `user_id` ✅
- Queries by `email` ✅

Before it only allowed `user_id`, blocking the email queries.

---

**Just run the SQL and you're done! 🚀**
