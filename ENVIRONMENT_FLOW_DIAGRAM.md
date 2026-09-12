# 🔄 Environment Flow Diagram

## Current State: Figma Make

```
┌────────────────────────────────────────────────────────────┐
│                      FIGMA MAKE                            │
│                    (Current State)                         │
│                                                            │
│  1. User opens Qilly in Figma Make                        │
│  2. App checks environment in priority order:             │
│                                                            │
│     ❌ localStorage override?      → Not set              │
│     ❌ URL parameter (?env=sit)?   → Not set              │
│     ❌ VITE_ENVIRONMENT?           → Not set              │
│     ❌ Build mode?                 → Not special          │
│     ✅ Vite DEV mode OR Default    → DEVELOPMENT          │
│                                                            │
│  3. Result: DEVELOPMENT environment 🔧                     │
│  4. Connects to: zzdzrlglivtpawtitvgu database            │
│  5. Shows: All tabs including Dev Tools                   │
│                                                            │
│  Console Output:                                           │
│  🔧 Defaulting to DEVELOPMENT environment                 │
│  💡 Use Environment Switcher or ?env=sit to switch        │
└────────────────────────────────────────────────────────────┘
```

---

## Monday: Vercel SIT Deployment

```
┌────────────────────────────────────────────────────────────┐
│                    VERCEL SIT                              │
│                 (After Deployment)                         │
│                                                            │
│  1. User opens https://sit.qilly.co.za                    │
│  2. App checks environment in priority order:             │
│                                                            │
│     ❌ localStorage override?      → Not set              │
│     ❌ URL parameter (?env=sit)?   → Not set              │
│     ✅ VITE_ENVIRONMENT?           → sit (SET IN VERCEL)  │
│                                                            │
│  3. Result: SIT environment 🔍                             │
│  4. Connects to: kcptusoevqapcvptlgkd database            │
│  5. Shows: Testing tabs (NO Dev Tools - professional!)    │
│                                                            │
│  Console Output:                                           │
│  🌍 Using environment from VITE_ENVIRONMENT: SIT          │
└────────────────────────────────────────────────────────────┘
```

---

## Environment Detection Priority

```
┌─────────────────────────────────────────────────────────────┐
│  ENVIRONMENT DETECTION PRIORITY (Highest to Lowest)         │
└─────────────────────────────────────────────────────────────┘

  1️⃣  localStorage.getItem('qilly_environment')
       ┌─────────────────────────────────────┐
       │ Set via: Environment Switcher UI    │
       │ Use case: Manual testing/switching  │
       │ Persistence: Until cleared          │
       └─────────────────────────────────────┘
              ↓ (if not set)

  2️⃣  URL Parameter (?env=sit)
       ┌─────────────────────────────────────┐
       │ Set via: Adding ?env=sit to URL     │
       │ Use case: Quick preview             │
       │ Persistence: Current session only   │
       └─────────────────────────────────────┘
              ↓ (if not set)

  3️⃣  import.meta.env.VITE_ENVIRONMENT
       ┌─────────────────────────────────────┐
       │ Set via: Vercel env variables       │
       │ Use case: Deployed environments     │
       │ Persistence: Per deployment         │
       └─────────────────────────────────────┘
              ↓ (if not set)

  4️⃣  import.meta.env.MODE (build mode)
       ┌─────────────────────────────────────┐
       │ Set via: vite --mode sit            │
       │ Use case: Local testing             │
       │ Persistence: Current build          │
       └─────────────────────────────────────┘
              ↓ (if not set)

  5️⃣  import.meta.env.DEV (Vite dev mode)
       ┌─────────────────────────────────────┐
       │ Set via: Automatic (npm run dev)    │
       │ Use case: Local development         │
       │ Persistence: Dev server only        │
       └─────────────────────────────────────┘
              ↓ (if not set)

  6️⃣  DEFAULT: 'development'
       ┌─────────────────────────────────────┐
       │ FIGMA MAKE LANDS HERE               │
       │ Use case: Fallback for testing      │
       │ Persistence: Always available       │
       └─────────────────────────────────────┘
```

---

## Environment Feature Matrix

```
┌──────────────┬──────┬──────────┬──────────┬──────────┬──────────┐
│ Environment  │ Icon │ Dev      │ Testing  │ Database │ Use Case │
│              │      │ Tools    │ Tabs     │          │          │
├──────────────┼──────┼──────────┼──────────┼──────────┼──────────┤
│ Development  │  🔧  │ ✅       │ ✅       │ DEV      │ Figma    │
│              │      │ Visible  │ Visible  │ zzd...   │ Make     │
├──────────────┼──────┼──────────┼──────────┼──────────┼──────────┤
│ SIT          │  🔍  │ ❌       │ ✅       │ SIT      │ Monday   │
│              │      │ Hidden   │ Visible  │ kcp...   │ Demo     │
├──────────────┼──────┼──────────┼──────────┼──────────┼──────────┤
│ UAT          │  🧪  │ ❌       │ ✅       │ UAT      │ Customer │
│              │      │ Hidden   │ Visible  │ TBD      │ Preview  │
├──────────────┼──────┼──────────┼──────────┼──────────┼──────────┤
│ Preprod      │  🔬  │ ❌       │ ✅       │ Preprod  │ Final    │
│              │      │ Hidden   │ Visible  │ TBD      │ Staging  │
├──────────────┼──────┼──────────┼──────────┼──────────┼──────────┤
│ Production   │  🚀  │ ❌       │ ❌       │ PROD     │ Live     │
│              │      │ Hidden   │ Hidden   │ TBD      │ Env      │
├──────────────┼──────┼──────────┼──────────┼──────────┼──────────┤
│ Demo         │  🎮  │ ✅       │ ✅       │ localStorage│ Offline│
│              │      │ Visible  │ Visible  │ (none)   │ Mode     │
└──────────────┴──────┴──────────┴──────────┴──────────┴──────────┘
```

---

## Deployment Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                   DEPLOYMENT PIPELINE                       │
└─────────────────────────────────────────────────────────────┘

  📝 DEVELOPMENT (Figma Make)
       │
       │  [Testing & Building]
       │  - Local development
       │  - Feature testing
       │  - Bug fixes
       │
       ↓
  🔍 SIT (System Integration Testing)
       │  https://sit.qilly.co.za
       │
       │  [Integration Testing]
       │  - API integrations
       │  - Database connections
       │  - Monday investor demo ← YOU ARE HERE
       │
       ↓
  🧪 UAT (User Acceptance Testing)
       │  https://uat.qilly.co.za
       │
       │  [User Validation]
       │  - Customer preview
       │  - Stakeholder review
       │  - Acceptance criteria
       │
       ↓
  🔬 PREPROD (Pre-Production)
       │  https://preprod.qilly.co.za
       │
       │  [Final Validation]
       │  - Production replica
       │  - Performance testing
       │  - Final sign-off
       │
       ↓
  🚀 PRODUCTION (Live)
       │  https://qilly.co.za
       │
       │  [Live Environment]
       │  - Real customers
       │  - Real data
       │  - Monitored 24/7
```

---

## Switching Environments Visually

```
┌─────────────────────────────────────────────────────────────┐
│              HOW TO SWITCH ENVIRONMENTS                     │
└─────────────────────────────────────────────────────────────┘

METHOD 1: Environment Switcher UI
┌──────────────────────────────────────┐
│ Admin Dashboard                      │
│  └─ Dev Tools Tab                    │
│      └─ Environment Switcher         │
│          ├─ [Development] 🔧         │ ← Click to switch
│          ├─ [SIT] 🔍                 │ ← Click to switch
│          ├─ [UAT] 🧪                 │ ← Click to switch
│          ├─ [Preprod] 🔬             │ ← Click to switch
│          ├─ [Production] 🚀          │ ← Click to switch
│          └─ [Demo] 🎮                │ ← Click to switch
└──────────────────────────────────────┘
      ↓
  Page reloads automatically
  New environment active


METHOD 2: URL Parameter
┌──────────────────────────────────────┐
│ Current URL:                         │
│ https://figma.com/.../qilly          │
│                                      │
│ Add parameter:                       │
│ https://figma.com/.../qilly?env=sit  │
└──────────────────────────────────────┘
      ↓
  Environment switches to SIT
  (temporary - current session only)


METHOD 3: Browser Console
┌──────────────────────────────────────┐
│ 1. Press F12 (open DevTools)         │
│ 2. Go to Console tab                 │
│ 3. Run command:                      │
│    localStorage.setItem(             │
│      'qilly_environment', 'sit'      │
│    );                                │
│ 4. Reload: location.reload();        │
└──────────────────────────────────────┘
      ↓
  Environment switches to SIT
  (persists until cleared)
```

---

## Database Connection Flow

```
┌─────────────────────────────────────────────────────────────┐
│           DATABASE CONNECTION BY ENVIRONMENT                │
└─────────────────────────────────────────────────────────────┘

DEVELOPMENT 🔧
  ├─ Supabase Project: zzdzrlglivtpawtitvgu
  ├─ URL: https://zzdzrlglivtpawtitvgu.supabase.co
  ├─ Tables: suppliers, products, bills, contractors
  ├─ Purpose: Development testing
  └─ Access: Admin (admin@qilly.co.za)

SIT 🔍
  ├─ Supabase Project: kcptusoevqapcvptlgkd
  ├─ URL: https://kcptusoevqapcvptlgkd.supabase.co
  ├─ Tables: suppliers, products, bills, contractors
  ├─ Purpose: Integration testing & Monday demo
  └─ Access: Admin (admin@qilly.co.za)

UAT 🧪
  ├─ Supabase Project: TBD
  ├─ URL: TBD
  ├─ Tables: suppliers, products, bills, contractors
  ├─ Purpose: User acceptance testing
  └─ Access: Admin + Customer accounts

PREPROD 🔬
  ├─ Supabase Project: TBD
  ├─ URL: TBD
  ├─ Tables: Full production replica
  ├─ Purpose: Final validation
  └─ Access: Admin + Test accounts

PRODUCTION 🚀
  ├─ Supabase Project: TBD
  ├─ URL: TBD
  ├─ Tables: Full production schema
  ├─ Purpose: Live environment
  └─ Access: Admin + Real users
```

---

## Monday Demo Flow

```
┌─────────────────────────────────────────────────────────────┐
│              MONDAY INVESTOR DEMO FLOW                      │
└─────────────────────────────────────────────────────────────┘

BEFORE PRESENTATION:
  ┌────────────────────────────────────┐
  │ 1. Deploy to Vercel                │
  │    $ vercel --prod                 │
  └────────────────────────────────────┘
           ↓
  ┌────────────────────────────────────┐
  │ 2. Set Environment Variable        │
  │    VITE_ENVIRONMENT = sit          │
  └────────────────────────────────────┘
           ↓
  ┌────────────────────────────────────┐
  │ 3. Verify at sit.qilly.co.za       │
  │    ✅ SIT environment active       │
  │    ✅ Dev Tools hidden             │
  │    ✅ Database: kcptusoevqapcvptl  │
  └────────────────────────────────────┘


DURING PRESENTATION:
  ┌────────────────────────────────────┐
  │ 1. Open https://sit.qilly.co.za    │
  └────────────────────────────────────┘
           ↓
  ┌────────────────────────────────────┐
  │ 2. Login as Admin                  │
  │    admin@qilly.co.za               │
  └────────────────────────────────────┘
           ↓
  ┌────────────────────────────────────┐
  │ 3. Show Admin Dashboard            │
  │    - Clean interface               │
  │    - No Dev Tools (professional)   │
  │    - Testing tabs visible          │
  └────────────────────────────────────┘
           ↓
  ┌────────────────────────────────────┐
  │ 4. Demonstrate Features            │
  │    - Supplier management           │
  │    - BOQ upload & pricing          │
  │    - Provincial optimization       │
  │    - 98% coverage                  │
  └────────────────────────────────────┘
           ↓
  ┌────────────────────────────────────┐
  │ 5. Show Compliance Features        │
  │    - SANS 1200                     │
  │    - NHBRC                         │
  │    - POPIA compliance              │
  └────────────────────────────────────┘
           ↓
  ┌────────────────────────────────────┐
  │ 6. Export Professional BOQ         │
  │    - Excel format                  │
  │    - Complete pricing              │
  │    - Ready for tender              │
  └────────────────────────────────────┘


INVESTOR SEES:
  ✅ Live, working application
  ✅ Professional interface (no dev tools)
  ✅ Real database integration
  ✅ 98% BOQ coverage demonstrated
  ✅ Provincial pricing optimization
  ✅ Compliance features
  ✅ Ready for R25M investment
```

---

## Summary Visual

```
╔═══════════════════════════════════════════════════════════╗
║                     QUICK SUMMARY                         ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  NOW (Figma Make):                                        ║
║  ├─ Environment: Development 🔧                           ║
║  ├─ Database: zzdzrlglivtpawtitvgu                        ║
║  ├─ Dev Tools: ✅ Visible                                 ║
║  └─ Purpose: Testing before SIT deployment                ║
║                                                           ║
║  MONDAY (After Deployment):                               ║
║  ├─ Environment: SIT 🔍                                   ║
║  ├─ Database: kcptusoevqapcvptlgkd                        ║
║  ├─ Dev Tools: ❌ Hidden (professional)                   ║
║  └─ Purpose: Investor demo at sit.qilly.co.za             ║
║                                                           ║
║  STATUS: ✅ READY FOR MONDAY PRESENTATION                 ║
╚═══════════════════════════════════════════════════════════╝
```

---

**Created:** March 5, 2026  
**Purpose:** Visual guide to environment configuration  
**Status:** Complete and ready for deployment
