# 🚀 Quick Environment Reference Card

**Created:** March 5, 2026  
**For:** Monday Investor Presentation Prep

---

## 🎯 ONE-LINE ANSWER

**Your Figma Make already defaults to DEVELOPMENT environment - no changes needed!**

---

## 🔍 Current State

```
Figma Make → Development 🔧 → Dev Database (zzdzrlglivtpawtitvgu)
```

---

## 🔄 Quick Switch Commands

### Switch to SIT (Preview Monday's Demo)
```javascript
localStorage.setItem('qilly_environment', 'sit');
location.reload();
```

### Back to Development (Default)
```javascript
localStorage.setItem('qilly_environment', 'development');
location.reload();
```

### Clear All Overrides
```javascript
localStorage.clear();
location.reload();
```

---

## 📊 Environment Comparison

| Env | Icon | Database | Dev Tools | Use Case |
|-----|------|----------|-----------|----------|
| **Development** | 🔧 | DEV (zzd...) | ✅ | Figma Make (NOW) |
| **SIT** | 🔍 | SIT (kcp...) | ❌ | Monday Demo |
| **Production** | 🚀 | PROD | ❌ | Live (Future) |

---

## ⚡ Monday Deployment (3 Steps)

### 1. Deploy to Vercel
```bash
vercel --prod
```

### 2. Set Environment Variable
```
Vercel → Settings → Environment Variables
Name:  VITE_ENVIRONMENT
Value: sit
```

### 3. Verify at https://sit.qilly.co.za
- Check console: "Using SIT environment"
- Dev Tools tab should be HIDDEN
- Database: kcptusoevqapcvptlgkd

---

## 🎯 Demo Checklist

- [ ] Login works (admin@qilly.co.za / QillyAdmin2026!)
- [ ] Suppliers visible
- [ ] BOQ upload works
- [ ] Pricing shows 98% coverage
- [ ] Provincial pricing (9 provinces)
- [ ] Export to Excel works
- [ ] Dev Tools tab HIDDEN (professional)

---

## 🔗 Related Docs

- **Full Guide:** `/FIGMA_MAKE_ENVIRONMENT_SETUP.md`
- **Confirmation:** `/ENVIRONMENT_CONFIRMATION.md`
- **Code:** `/src/utils/environment.ts`

---

## 🆘 Troubleshooting

### Environment not switching?
```javascript
// Check current
console.log(localStorage.getItem('qilly_environment'));

// Force clear
localStorage.clear();
location.reload();
```

### Wrong database?
- Check console for environment detection logs
- Look for: "Using [ENV] environment"
- Verify Supabase URL in console

---

## 📞 Quick Contact Info

- **Admin Login:** admin@qilly.co.za / QillyAdmin2026!
- **Dev DB:** zzdzrlglivtpawtitvgu.supabase.co
- **SIT DB:** kcptusoevqapcvptlgkd.supabase.co

---

**Status: ✅ READY FOR MONDAY**
