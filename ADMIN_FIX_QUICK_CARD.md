# 🎯 ADMIN FIX - Quick Reference Card

**Print this or keep it open during setup!**

---

## 🚨 THE PROBLEM
Admin login was **hardcoded** (no database auth) → RLS policies blocked data access → Can't see suppliers/contractors

---

## ✅ THE FIX (Choose One)

### **OPTION 1: Full Fix** (Recommended - 1 minute)
```bash
1. Supabase Dashboard → SQL Editor
2. Run: /SETUP_ADMIN_USER_COMPLETE.sql
3. Refresh app (F5)
4. Login: admin@qilly.co.za / QillyAdmin2026!
✅ Done!
```

### **OPTION 2: Test First** (Verify data exists)
```bash
1. Run: /DISABLE_RLS_FOR_TESTING.sql
2. Login with any credentials
3. Can you see data? → YES = auth issue, NO = data issue
4. Run: /ENABLE_RLS_AFTER_TESTING.sql
5. Run: /SETUP_ADMIN_USER_COMPLETE.sql
✅ Done!
```

---

## 📋 SUCCESS CHECKLIST
- [ ] Login works with admin@qilly.co.za
- [ ] See "Welcome back, Admin!" notification
- [ ] Suppliers tab shows 5 suppliers
- [ ] Contractors tab shows 5 contractors
- [ ] No console errors

---

## 🆘 QUICK TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| "Invalid credentials" | Re-run SETUP_ADMIN_USER_COMPLETE.sql |
| "Access denied" | Check: `SELECT role FROM users WHERE email = 'admin@qilly.co.za'` |
| No suppliers | Re-run setup script OR check `SELECT COUNT(*) FROM suppliers` |
| Wrong environment | Settings → Reset to Default Environment |

---

## 📞 VERIFICATION COMMANDS

```sql
-- Check admin exists
SELECT id, email FROM auth.users WHERE email = 'admin@qilly.co.za';

-- Check admin role
SELECT role FROM users WHERE email = 'admin@qilly.co.za';

-- Check data
SELECT COUNT(*) FROM suppliers;
SELECT COUNT(*) FROM contractors;
```

---

## 🔑 DEFAULT CREDENTIALS
```
Email: admin@qilly.co.za
Password: QillyAdmin2026!
```

---

## 📚 FULL DOCS
- START_HERE_ADMIN_FIX.md - Overview
- QUICK_START_ADMIN_FIX.md - 3-step guide
- TESTING_WORKFLOW_RLS.md - RLS testing
- ADMIN_AUTH_FIX_COMPLETE.md - Full troubleshooting

---

## ⏱️ TIME ESTIMATES
- Option 1: ~1 minute
- Option 2: ~2 minutes
- Reading docs: 2-10 minutes

---

**Status: ✅ Ready for Monday demo!**
