# 🏗️ Qilly Multi-Environment Architecture

## 📊 **Environment Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                    QILLY ENVIRONMENTS                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│     DEV      │    │     SIT      │    │     PROD     │
│  (Local)     │    │  (Testing)   │    │   (Live)     │
└──────────────┘    └──────────────┘    └──────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  qilly-dev   │    │  qilly-sit   │    │ qilly-prod   │
│  Singapore   │    │  Singapore   │    │    TBD       │
│   ✅ Active  │    │  ✅ Active   │    │  ⏳ Pending  │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 🔄 **Deployment Flow**

```
┌─────────────────────────────────────────────────────────────┐
│                   DEVELOPMENT WORKFLOW                       │
└─────────────────────────────────────────────────────────────┘

    Developer              Integration Team         End Users
        │                         │                     │
        ▼                         │                     │
  ┌──────────┐                   │                     │
  │   DEV    │                   │                     │
  │ Localhost│                   │                     │
  └──────────┘                   │                     │
        │                         │                     │
   Code Ready                     │                     │
        │                         │                     │
        ▼                         │                     │
  ┌──────────┐                   │                     │
  │   GIT    │                   │                     │
  │  develop │                   │                     │
  └──────────┘                   │                     │
        │                         │                     │
   Merge to SIT                   │                     │
        │                         │                     │
        ▼                         ▼                     │
  ┌──────────────────────────────────┐                │
  │           SIT/STAGING            │                │
  │  https://qilly-sit.vercel.app    │                │
  │   Integration & QA Testing       │                │
  └──────────────────────────────────┘                │
        │                                               │
  Tests Pass                                            │
        │                                               │
        ▼                                               │
  ┌──────────┐                                         │
  │   GIT    │                                         │
  │   main   │                                         │
  └──────────┘                                         │
        │                                               │
  Deploy to Prod                                        │
        │                                               │
        ▼                                               ▼
  ┌──────────────────────────────────────────────────────┐
  │              PRODUCTION (Future)                     │
  │         https://qilly.co.za (example)                │
  │              Live Customer Use                       │
  └──────────────────────────────────────────────────────┘
```

---

## 🗄️ **Database Isolation**

```
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│       qilly-dev          │  ← Your local development
│  zzdzrlglivtpawtitvgu    │
├──────────────────────────┤
│ • Development data       │
│ • Test contractors       │
│ • Sample BOQs            │
│ • Rapid changes          │
└──────────────────────────┘

         ⬇️ ISOLATED ⬇️

┌──────────────────────────┐
│       qilly-sit          │  ← Integration testing
│  kcptusoevqapcvptlgkd    │
├──────────────────────────┤
│ • Test data only         │
│ • Integration tests      │
│ • QA verification        │
│ • Stable for testing     │
└──────────────────────────┘

         ⬇️ ISOLATED ⬇️

┌──────────────────────────┐
│      qilly-prod          │  ← Future production
│        TBD               │
├──────────────────────────┤
│ • Real customer data     │
│ • Live BOQs              │
│ • Production suppliers   │
│ • PROTECTED              │
└──────────────────────────┘

✅ Each environment has its OWN database
✅ Changes in DEV don't affect SIT or PROD
✅ Can reset SIT anytime without affecting DEV
```

---

## 🚀 **Deployment Targets**

```
┌─────────────────────────────────────────────────────────────┐
│                    HOSTING STRATEGY                          │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│   LOCAL DEVELOPMENT      │
│    npm run dev           │
│    localhost:5173        │
│    Uses: qilly-dev       │
└──────────────────────────┘

┌──────────────────────────┐
│   SIT DEPLOYMENT         │
│    Vercel (Singapore)    │
│    qilly-sit.vercel.app  │
│    Uses: qilly-sit       │
└──────────────────────────┘

┌──────────────────────────┐
│   PRODUCTION (Future)    │
│    Vercel (Global)       │
│    www.qilly.co.za       │
│    Uses: qilly-prod      │
└──────────────────────────┘
```

---

## 🔧 **Build Commands**

```
┌─────────────────────────────────────────────────────────────┐
│                  ENVIRONMENT COMMANDS                        │
└─────────────────────────────────────────────────────────────┘

┌───────────────┬──────────────────┬────────────────────────┐
│ Environment   │ Run Locally      │ Build for Deploy       │
├───────────────┼──────────────────┼────────────────────────┤
│ DEV           │ npm run dev      │ npm run build          │
│ SIT           │ npm run dev:sit  │ npm run build:sit      │
│ PROD          │ npm run dev:prod │ npm run build:prod     │
└───────────────┴──────────────────┴────────────────────────┘
```

---

## 🔐 **Security & Access Control**

```
┌─────────────────────────────────────────────────────────────┐
│                    ACCESS CONTROL                            │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│       DEV Access         │
├──────────────────────────┤
│ ✅ Kgabo (full access)   │
│ ✅ Developers (read)     │
└──────────────────────────┘

┌──────────────────────────┐
│       SIT Access         │
├──────────────────────────┤
│ ✅ Integration teams     │
│ ✅ QA testers            │
│ ✅ Stakeholders (view)   │
└──────────────────────────┘

┌──────────────────────────┐
│      PROD Access         │
├──────────────────────────┤
│ ✅ Admin only (Kgabo)    │
│ ❌ No direct DB access   │
│ ✅ Monitoring only       │
└──────────────────────────┘
```

---

## 📊 **Data Flow**

```
┌─────────────────────────────────────────────────────────────┐
│              USER REQUEST FLOW (SIT Example)                 │
└─────────────────────────────────────────────────────────────┘

Tester Browser
      │
      │ 1. Visit URL
      ▼
┌─────────────────┐
│  Vercel CDN     │
│  (Singapore)    │
└─────────────────┘
      │
      │ 2. Load React App
      ▼
┌─────────────────┐
│  React Frontend │
│  (SIT Build)    │
└─────────────────┘
      │
      │ 3. API Calls
      ▼
┌─────────────────┐
│  Supabase       │
│  qilly-sit      │
│  (Singapore)    │
└─────────────────┘
      │
      │ 4. Query Database
      ▼
┌─────────────────┐
│  PostgreSQL     │
│  SIT Database   │
└─────────────────┘
      │
      │ 5. Return Data
      ▼
    Tester
```

---

## 🎯 **Environment Switching**

The app has a built-in environment switcher:

```
┌─────────────────────────────────────────────────────────────┐
│          ENVIRONMENT SWITCHER (In App)                       │
└─────────────────────────────────────────────────────────────┘

Top-Right of App:
┌────────────────────────┐
│  🏗️ Environment: SIT   │
└────────────────────────┘
         │
    Click to change
         │
         ▼
┌────────────────────────┐
│ 📝 Demo                │ ← No real database
│ 🔧 Development         │ ← qilly-dev
│ 🏗️ Staging (SIT)       │ ← qilly-sit ✅ YOU ARE HERE
│ 🚀 Production          │ ← Not configured yet
└────────────────────────┘

✅ Switches Supabase connection automatically
✅ Changes saved to localStorage
✅ Visual indicator shows current environment
```

---

## 📋 **Configuration Files**

```
┌─────────────────────────────────────────────────────────────┐
│              KEY CONFIGURATION FILES                         │
└─────────────────────────────────────────────────────────────┘

/src/utils/supabase/info.ts
├─ Development credentials
├─ SIT credentials
└─ Production credentials (future)

/package.json
├─ npm run dev
├─ npm run dev:sit  ✅ NEW
└─ npm run build:sit  ✅ NEW

/vercel-sit.json
└─ SIT deployment config

/.gitignore
└─ Protect sensitive files
```

---

## ✅ **What's Working Now**

```
✅ Development Environment (qilly-dev)
   └─ Local development on localhost:5173

✅ SIT Environment (qilly-sit)
   ├─ Supabase project created
   ├─ Code configuration complete
   ├─ Build scripts ready
   └─ ⏳ Waiting for: Database setup & Vercel deployment

⏳ Production Environment (future)
   └─ Not configured yet
```

---

## 🎯 **Next Actions**

```
1. Set up SIT database
   ├─ Go to Supabase dashboard
   ├─ Run COMPLETE_DATABASE_SETUP.sql
   └─ Disable email confirmations

2. Deploy to Vercel
   ├─ npm run build:sit
   ├─ vercel --prod
   └─ Get deployment URL

3. Share with team
   └─ Send URL + testing instructions
```

---

**Architecture Version:** 1.0  
**Last Updated:** February 26, 2026  
**Environments:** DEV ✅ | SIT ✅ | PROD ⏳
