# 🎯 QUICK FIX - DATABASE ERROR

## ❌ THE ERROR
```
ERROR: relation "project_settings" does not exist
ERROR: relation "contractors" does not exist  
```

## ✅ THE FIX (2 MINUTES)

### Step 1: Open Supabase
```
https://supabase.com/dashboard
→ Select Qilly Project
→ SQL Editor
→ + New Query
```

### Step 2: Run Setup
```
→ Open: /COMPLETE_DATABASE_SETUP.sql
→ Copy ALL (Ctrl+A, Ctrl+C)
→ Paste in SQL Editor (Ctrl+V)
→ Click "Run" (Ctrl+Enter)
→ Wait 10 seconds
```

### Step 3: Verify
```
✅ 8 tables created
✅ 30 RLS policies created
✅ Indexes created
✅ Triggers created
```

## 📋 WHAT'S CREATED

| Table | Purpose | Policies |
|-------|---------|----------|
| users | User profiles | 3 |
| bills | BOQ projects | 4 |
| bill_items | Line items | 4 |
| **project_settings** ⭐ | Project config | 4 |
| **contractors** ⭐ | Contractor profiles | 4 |
| suppliers | Supplier directory | 4 |
| supplier_products | Product catalog | 4 |
| subscriptions | Payments | 3 |

**Total: 8 tables, 30 policies**

## 🧪 TEST IT

1. **Contractor Signup**
   - Create new contractor account
   - No RLS errors ✅

2. **BOQ Upload**
   - Upload BOQ file
   - Saves to database ✅

3. **Project Settings**
   - Select province/municipality
   - Persists after refresh ✅

## 📚 FILES

**Use:** `/COMPLETE_DATABASE_SETUP.sql`

**Read:** 
- `/START_HERE_FIX_DATABASE.md`
- `/DATABASE_SETUP_COMPLETE_SUMMARY.md`

**Ignore:** 
- ~~SUPABASE_SETUP_FIXED.sql~~
- ~~FIX_BILLS_USER_ID_ERROR.sql~~

---

## 🆘 STILL BROKEN?

Run this verification:
```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

Should show all 8 tables. If not, run setup again.

---

**✅ ONE FILE. ONE RUN. DONE.**
