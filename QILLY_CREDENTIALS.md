# 🔐 Qilly System Credentials Reference

## 👨‍💼 Admin Access

### **Admin Dashboard Login**

**Access URL:**
```
/admin (in your Qilly app)
```

**Credentials:**
```
Email:    admin@qilly.com
Password: QillyAdmin2024!
```

**What Admin Can Do:**
- ✅ View and manage supplier applications
- ✅ Approve/reject supplier registrations
- ✅ Access Database Inspector
- ✅ View all supplier details and certifications
- ✅ Monitor system activity

**Quick Login:**
- Click the **"Use Admin Credentials"** button on the login page
- Credentials will auto-fill

---

## 👷 Operator Access

**Note:** The current Qilly system uses **Admin-level access only**.

If you need operator-level access with limited permissions:
- **Status**: Not currently implemented
- **Alternative**: All system management is through Admin account
- **Future**: Can be added if needed with specific role-based permissions

---

## 🗄️ Database Access

### **Supabase Dashboard**

**Current Setup:**
```
Project ID:  tjajhzepupsmunewfvag (DEMO PLACEHOLDER - NOT WORKING)
Status:      Demo mode only
```

**To Get Working Database Access:**
1. Create your own Supabase project at https://supabase.com
2. Update `/src/utils/supabase/info.ts` with YOUR credentials
3. See `/QUICK_DATABASE_SETUP.md` for full instructions

**Your Dashboard URL** (after setup):
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID
```

**Database Credentials** (after setup):
```
Host:     db.YOUR_PROJECT_ID.supabase.co
Port:     5432 (direct) or 6543 (pooler)
Database: postgres
User:     postgres
Password: [Your database password set during project creation]
```

---

## 🧪 Test Users / Demo Access

### **Regular User Access**

The system currently operates in **demo mode** using localStorage:
- No authentication required for main Qilly features
- Bill upload and pricing works without login
- Supplier signup works without authentication

### **For Production with Supabase:**

After setting up Supabase, you can create test users:

**Via Supabase Dashboard:**
1. Go to Authentication → Users
2. Click "Add User"
3. Create test accounts

**Via Supabase Auth API:**
```javascript
// Sign up a new user
const { data, error } = await supabase.auth.signUp({
  email: 'testuser@example.com',
  password: 'TestPass123!'
});
```

---

## 🔑 Quick Reference

| Access Level | Email | Password | Access |
|--------------|-------|----------|--------|
| **Admin** | admin@qilly.com | QillyAdmin2024! | Full system access |
| **Database** | - | - | See setup guide |
| **Regular User** | - | - | Demo mode (no auth) |

---

## 🛡️ Security Notes

### **Current Setup (Demo Mode):**
- ⚠️ Simple credential check (email + password)
- ⚠️ Stored in sessionStorage
- ⚠️ No encryption or token-based auth
- ⚠️ Suitable for development/demo only

### **For Production:**
You should implement:
- ✅ Supabase Authentication
- ✅ JWT tokens
- ✅ Password hashing
- ✅ Multi-factor authentication (MFA)
- ✅ Role-based access control (RBAC)

**To Implement Supabase Auth:**
1. Enable Email authentication in Supabase Dashboard
2. Update AdminLogin.tsx to use Supabase auth
3. Replace simple credential check with:
   ```typescript
   const { data, error } = await supabase.auth.signInWithPassword({
     email: loginData.email,
     password: loginData.password,
   });
   ```

---

## 📝 Changing Admin Credentials

### **Current System (Code-based):**

To change admin credentials:

1. **Edit**: `/src/app/components/AdminLogin.tsx`
2. **Find** (around line 22-23):
   ```typescript
   const ADMIN_EMAIL = 'admin@qilly.com';
   const ADMIN_PASSWORD = 'QillyAdmin2024!';
   ```
3. **Change to**:
   ```typescript
   const ADMIN_EMAIL = 'your-new-email@domain.com';
   const ADMIN_PASSWORD = 'YourNewPassword123!';
   ```

### **Recommended (Production):**

Store credentials in environment variables:

1. **Create** `.env` file:
   ```env
   VITE_ADMIN_EMAIL=admin@qilly.com
   VITE_ADMIN_PASSWORD=QillyAdmin2024!
   ```

2. **Update** `AdminLogin.tsx`:
   ```typescript
   const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
   const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
   ```

3. **Add** `.env` to `.gitignore` (so it's not committed to version control)

---

## 🚨 Important Security Warnings

### ⚠️ For Production Deployment:

1. **Never commit credentials to Git**
   - Use environment variables
   - Add `.env` to `.gitignore`

2. **Never expose admin password in frontend code**
   - Move authentication to backend/Supabase
   - Use secure auth tokens

3. **Enable HTTPS**
   - All production deployments must use SSL/TLS
   - Credentials should never be transmitted over HTTP

4. **Implement Supabase Auth**
   - Replace simple credential check
   - Use Supabase's built-in authentication
   - Enable Row Level Security (RLS)

5. **Regular password changes**
   - Change default passwords immediately
   - Use strong, unique passwords
   - Enable MFA where possible

---

## 📚 Related Documentation

- **Database Setup**: `/QUICK_DATABASE_SETUP.md`
- **Supabase Guide**: `/SETUP_YOUR_SUPABASE.md`
- **Admin Dashboard**: Access via `/admin` route
- **Database Inspector**: Admin Dashboard → "Database Inspector" tab

---

## 🔄 Access Workflow

### **For Admin:**
1. Navigate to `/admin` in your Qilly app
2. Click "Use Admin Credentials" button (or enter manually)
3. Click "Login"
4. Access Admin Dashboard with two tabs:
   - Supplier Management
   - Database Inspector

### **For Database:**
1. Complete Supabase setup (see `/QUICK_DATABASE_SETUP.md`)
2. Use Database Inspector in Admin Dashboard, OR
3. Access Supabase dashboard directly via browser

### **For Regular Users:**
1. Currently no authentication required
2. Upload BOQs and get pricing directly
3. After Supabase setup, can implement user registration/login

---

## ✅ Summary

**Current Credentials:**
- ✅ Admin: `admin@qilly.com` / `QillyAdmin2024!`
- ⚠️ Database: Demo mode only - setup required
- ℹ️ Operator: Not implemented (use Admin access)

**Next Steps:**
1. Use admin credentials to access Admin Dashboard
2. Set up your own Supabase database (see `/QUICK_DATABASE_SETUP.md`)
3. For production: Implement proper Supabase authentication

---

**Last Updated**: February 16, 2026  
**Security Level**: Development/Demo  
**Production Ready**: ⚠️ Requires Supabase auth implementation
