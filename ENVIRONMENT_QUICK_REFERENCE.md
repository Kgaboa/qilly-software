# 🎯 Qilly Environment Quick Reference Card

---

## 📊 **Environment Matrix**

| Environment | URL | Database | Build Command | Purpose |
|-------------|-----|----------|---------------|---------|
| **Development** | `localhost:5173` | qilly-dev | `npm run dev` | Local development |
| **SIT** | `sit.qilly.co.za` | qilly-sit | `npm run build:sit` | Integration testing |
| **UAT** | `uat.qilly.co.za` | qilly-uat | `npm run build:uat` | User acceptance |
| **Preprod** | `preprod.qilly.co.za` | qilly-preprod | `npm run build:preprod` | Final QA |
| **Production** | `qilly.co.za` | qilly-production | `npm run build:prod` | Live system |

---

## 🚀 **Quick Deploy Commands**

```bash
# SIT
npm run build:sit && vercel --prod

# UAT
npm run build:uat && vercel --prod

# Preprod
npm run build:preprod && vercel --prod

# Production
npm run build:prod && vercel --prod
```

---

## 📋 **Supabase Projects Status**

```
✅ qilly-dev       (Singapore) - Already created
✅ qilly-sit       (Singapore) - Already created
⏳ qilly-uat       (Singapore) - To be created
⏳ qilly-preprod   (Singapore) - To be created
⏳ qilly-production (EU-West)  - To be created
```

---

## 🌐 **DNS Records (HostAfrica)**

```
Type: CNAME  | Name: sit     | Value: cname.vercel-dns.com  | ✅ Configured
Type: CNAME  | Name: uat     | Value: cname.vercel-dns.com  | ✅ Configured
Type: CNAME  | Name: preprod | Value: cname.vercel-dns.com  | ✅ Configured
Type: A      | Name: @       | Value: 76.76.21.21           | ✅ Configured
```

---

## 🔑 **Environment Variables Needed (Vercel)**

Each Vercel project needs these variables:

```
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key-from-supabase]
```

**Where to find:**
Supabase Dashboard → Project Settings → API

---

## ✅ **Deployment Sequence**

```
1. Create Supabase project
2. Update .env file with credentials
3. Run build command (e.g., npm run build:sit)
4. Deploy to Vercel (vercel --prod)
5. Add environment variables in Vercel
6. Connect custom domain in Vercel
7. Wait for DNS propagation (15-30 min)
8. Test the URL
```

---

## 🎨 **Environment Badges**

Each environment shows a different badge:

```
🔧 Development  - Blue    - Full dev tools
🔍 SIT          - Gray    - Integration testing  
🧪 UAT          - Orange  - User acceptance
🔬 Preprod      - Cyan    - Final QA
🚀 Production   - Green   - Live system
```

---

## 💰 **Costs**

```
Domain (qilly.co.za):    ~R20/month (already paid annually)
Vercel (all 4):          FREE
Supabase (all 4):        FREE
SSL Certificates:        FREE
Total Monthly:           ~R20
```

---

## 📞 **Quick Links**

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **HostAfrica Client:** https://my.hostafrica.com
- **DNS Checker:** https://dnschecker.org

---

## 🆘 **Quick Fixes**

### Wrong environment showing?
```javascript
localStorage.removeItem('qilly_environment');
window.location.reload();
```

### Check current environment:
```javascript
// Open browser console (F12)
import { getCurrentEnvironment } from './src/utils/environment';
console.log(getCurrentEnvironment());
```

### Verify build mode:
```bash
# Check package.json scripts to confirm mode flags
cat package.json | grep "build:"
```

---

## ✅ **Today's Tasks**

- [ ] Create qilly-uat Supabase project
- [ ] Create qilly-preprod Supabase project  
- [ ] Create qilly-production Supabase project
- [ ] Update .env.uat with credentials
- [ ] Update .env.preprod with credentials
- [ ] Update .env.production with credentials
- [ ] Deploy SIT: `npm run build:sit && vercel --prod`
- [ ] Connect sit.qilly.co.za in Vercel
- [ ] Test SIT environment
- [ ] Repeat for UAT, Preprod, Production

---

**Remember:** All environments are FREE on current tier! 🎉
