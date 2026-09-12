# 🎯 Qilly Setup - Quick Reference Card

**Print this page and keep it on your desk!**

---

## ⚡ 30-Second Start

**Linux/Mac:**
```bash
chmod +x scripts/setup-environments.sh
./scripts/setup-environments.sh
```

**Windows:**
```cmd
scripts\setup-environments.bat
```

Then follow on-screen instructions.

---

## 📊 Your 4 Environments

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| 💻 **Development** | `develop` | `localhost:3000` | Local coding |
| 🧪 **SIT** | `sit` | `qilly-git-sit.vercel.app` | QA testing |
| 📦 **Staging** | `staging` | `qilly-git-staging.vercel.app` | Pre-prod validation |
| 🚀 **Production** | `main` | `qilly.vercel.app` | Live users |

---

## 🔄 Daily Workflow

### Develop Feature
```bash
git checkout develop
git checkout -b feature/name
# ... code ...
git add .
git commit -m "feat: description"
git push origin feature/name
# Create PR on GitHub
```

### Deploy to SIT
```bash
git checkout sit
git merge develop
git push origin sit
```

### Deploy to Staging
```bash
git checkout staging
git merge sit
git push origin staging
```

### Deploy to Production
```bash
git checkout main
git merge staging
git push origin main
```

---

## 🏥 Health Checks

```bash
# Local
curl localhost:3000/api/health

# SIT
curl https://qilly-git-sit-*.vercel.app/api/health

# Production
curl https://qilly-*.vercel.app/api/health
```

Expected: `{"status":"healthy"}`

---

## 💰 Cost

| Tier | Monthly | What You Get |
|------|---------|--------------|
| **Free** | **R0** | ✅ 4 environments<br>✅ 500MB database<br>✅ Unlimited builds |
| **Pro** | **R1,800** | ✅ 99.9% SLA<br>✅ 8GB database<br>✅ Priority support |

---

## 🆘 Quick Fixes

**Script won't run:**
```bash
chmod +x scripts/setup-environments.sh
```

**Database error:**
```bash
# Restart Supabase project
# Verify API keys in .env files
```

**Deployment failed:**
```bash
# Check Vercel logs
# Verify environment variables
# Redeploy from dashboard
```

---

## 📚 Documentation

| Need | File |
|------|------|
| **Setup now** | `START_HERE_SETUP.md` |
| **Commands** | `COMMAND_REFERENCE.md` |
| **Detailed guide** | `SETUP_SCRIPT_WALKTHROUGH.md` |
| **Present to exec** | `PRESENTATION_SLIDES.md` |
| **Full docs** | `DOCUMENTATION_INDEX.md` |

---

## 🎯 Key URLs

**Supabase:** https://app.supabase.com  
**Vercel:** https://vercel.com  
**GitHub:** https://github.com/your-org/qilly

---

## ✅ Success Checklist

- [ ] Setup script completed
- [ ] 4 Supabase projects created
- [ ] All branches pushed to GitHub
- [ ] Vercel connected
- [ ] All environments deployed
- [ ] Health checks passing

---

## 🚀 Next Steps

1. ✅ Run setup script
2. ✅ Create Supabase projects
3. ✅ Push to GitHub
4. ✅ Deploy to Vercel
5. ✅ Test all environments
6. 🎉 Start building!

---

**Questions?** → `/DOCUMENTATION_INDEX.md`

**Need help?** → `/START_HERE_SETUP.md`

**Ready to present?** → `/PRESENTATION_SLIDES.md`

---

# Qilly - Build the Future! 🚀

**Cost:** R0 to start | **Time:** 30-60 min | **Outcome:** Production-ready

---

*Print this card and keep it handy during setup!*