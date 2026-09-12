# 🔄 Sync Architecture: Configuration vs Execution

## 📊 Quick Answer

| Feature | Purpose | When Used | Environment |
|---------|---------|-----------|-------------|
| **Manage API** | **Configuration** - Set up HOW to get data | Setup & ongoing config changes | Production & Testing |
| **Sync Products** | **Execution** - Manually trigger data fetch NOW | Testing, debugging, emergency updates | Testing & Ad-hoc |
| **Sync Frequency** (REST) | **Automation** - How often REST API auto-syncs | After configuration is saved | Production (background) |
| **Scraping Schedule** (Scraping) | **Automation** - How often scraper auto-runs | After configuration is saved | Production (background) |

---

## 🎯 The Core Difference

### **Manage API** = Setup (One-Time or Occasional)
**What it does:** Configure HOW Qilly will fetch data from suppliers

**Actions:**
- Set API credentials
- Configure CSS selectors
- Map CSV columns
- Create manual product forms
- **Test configurations**
- **Save configurations**

**When to use:**
- Initial supplier setup
- Changing integration method (e.g., manual → REST API)
- Updating API credentials
- Modifying scraping selectors
- Monthly/quarterly configuration reviews

**Analogy:** Setting up your washing machine's cycle settings (temperature, spin speed, duration)

---

### **Sync Products** = Execution (Frequent/Manual)
**What it does:** Fetch data NOW using the saved configuration

**Actions:**
- Click "Sync Now" button
- Immediately fetch products from ALL suppliers
- Update prices in database
- See real-time sync status
- View success/error counts

**When to use:**
- Testing new configurations
- Debugging sync issues
- Emergency price updates
- Before generating BOQs
- Verifying supplier data

**Analogy:** Pressing "Start" on your washing machine to run a cycle NOW

---

## 🔧 Detailed Breakdown

### 1️⃣ **Manage API** (Configuration Tab)

**Location:** Admin Dashboard → Supplier API → **API Management** tab → Click "Manage API" button

**Purpose:** **CONFIGURE** the integration method for each supplier

#### What You Configure:

**REST API Tab:**
- ✅ API Base URL (where to call)
- ✅ Authentication type (how to authenticate)
- ✅ API credentials (keys/tokens)
- ✅ Endpoints (which routes to call)
- ✅ **Sync Frequency** (how often to auto-sync)

**Web Scraping Tab:**
- ✅ Target URL (which page to scrape)
- ✅ CSS Selectors (how to extract data)
- ✅ **Scraping Schedule** (how often to auto-scrape)

**Manual Upload Tab:**
- ✅ Product entry forms (manual data entry)
- ✅ Product list management

**CSV Import Tab:**
- ✅ File upload settings
- ✅ Column mapping (which columns map to which fields)

#### Key Actions:
- **Test Connection** (REST API) - Validates credentials
- **Test Scraper** (Web Scraping) - Validates selectors
- **Save Configuration** - Stores settings in database

#### Output:
- Configuration saved to database
- Automated sync jobs scheduled (if frequency/schedule set)
- Integration ready to use

---

### 2️⃣ **Sync Products** (Execution Tab)

**Location:** Admin Dashboard → Supplier API → **Sync Products** tab

**Purpose:** **EXECUTE** data synchronization NOW using saved configurations

#### What You Do:

**Manual Trigger:**
1. Click **"Sync Now"** button
2. System fetches data from ALL configured suppliers
3. Real-time status updates show progress
4. Results display success/error counts

**What Happens Behind the Scenes:**
```
For each supplier:
1. Load saved configuration from database
2. Execute sync based on API type:
   - REST API: Call endpoints with credentials
   - Scraping: Run scraper with selectors
   - Manual: Use manually entered products
   - CSV: Use imported CSV data
3. Update products in database
4. Return success/error count
```

#### Key Actions:
- **Sync Now** - Immediate manual sync
- **View Status** - See sync progress
- **Check Results** - Success/error counts per supplier

#### Output:
- Products updated in database
- Prices refreshed
- Sync status displayed
- Ready for BOQ generation

---

## ⏰ Sync Frequency vs Scraping Schedule vs Sync Now

### **Sync Frequency** (REST API - Automated)

**What it is:** How often the system AUTOMATICALLY calls the supplier's REST API

**Options:**
- 5 minutes (very frequent)
- 15 minutes
- 30 minutes
- **1 hour (recommended)** ← Most common
- Daily

**When it runs:** **Automatically in the background** after you save the REST API configuration

**Example:**
```
You configure Dulux REST API:
- Base URL: https://api.dulux.co.za/v1
- Sync Frequency: 1 hour
- Save configuration

Result:
→ Every hour, Qilly automatically:
  1. Calls Dulux API
  2. Fetches latest products/prices
  3. Updates database
  4. No manual intervention needed
```

**Use Case:**
- Large suppliers with frequently changing prices
- Real-time pricing critical applications
- High-volume product catalogs
- Professional API integrations

---

### **Scraping Schedule** (Web Scraping - Automated)

**What it is:** How often the system AUTOMATICALLY scrapes the supplier's website

**Options:**
- Hourly (may get blocked by anti-scraping)
- **Daily (recommended)** ← Most common
- Weekly
- Manual only

**When it runs:** **Automatically in the background** after you save the scraping configuration

**Example:**
```
You configure Cashbuild scraping:
- Target URL: https://www.cashbuild.co.za/products
- CSS Selectors: .product-title, .product-price
- Schedule: Daily @ 2:00 AM
- Save configuration

Result:
→ Every day at 2:00 AM, Qilly automatically:
  1. Visits Cashbuild website
  2. Extracts product data using selectors
  3. Updates database
  4. No manual intervention needed
```

**Use Case:**
- Retail chains with online catalogs
- Suppliers without APIs
- Price monitoring
- Overnight updates (avoid traffic)

**Why Daily vs Hourly:**
- **Daily:** Avoids anti-scraping detection, respects website
- **Hourly:** May trigger rate limiting, CAPTCHA, IP blocking

---

### **Sync Now Button** (Manual Trigger)

**What it is:** Immediately sync ALL suppliers RIGHT NOW (manual override)

**When it runs:** **Only when you click the button**

**Example:**
```
You're about to generate a BOQ at 3:30 PM:
- Last auto-sync was at 2:00 PM (1.5 hours ago)
- You want the LATEST prices
- Click "Sync Now" button

Result:
→ Immediately syncs all 96 suppliers:
  1. REST APIs are called
  2. Websites are scraped
  3. Manual products are loaded
  4. CSV data is refreshed
  5. Database updated
  6. Ready for BOQ with latest prices
```

**Use Case:**
- Testing new configurations
- Emergency price updates
- Before important BOQ generation
- Debugging sync issues
- Verifying supplier data

---

## 🏗️ Production vs Testing

### **Manage API** = **Configuration** (Production & Testing)

**Production Use:**
- Set up supplier integrations
- Configure API credentials (real production keys)
- Schedule automated syncs
- Save configurations for long-term use

**Testing Use:**
- Test API connections before going live
- Validate scraping selectors
- Try different sync frequencies
- Debug configuration issues

**Is it for production?** ✅ YES - This is where you configure production settings

---

### **Sync Products** = **Execution** (Testing & Ad-Hoc)

**Testing Use (Primary):**
- Test if configuration works
- Verify data is fetched correctly
- Debug sync errors
- Check product counts
- Validate pricing data

**Production Use (Ad-Hoc):**
- Emergency price updates (e.g., supplier just sent new prices)
- Before critical BOQ generation (ensure latest data)
- Manual override of scheduled syncs
- Force refresh when needed

**Is it for testing?** ✅ PRIMARILY - But also useful for production ad-hoc syncs

---

## 🔄 Complete Workflow Example

### Scenario: Setting Up Dulux (REST API)

#### **Phase 1: Configuration (Manage API)**

1. **Navigate:** Admin Dashboard → Supplier API → API Management
2. **Find Dulux:** Scroll to Dulux supplier
3. **Click "Manage API":** Modal opens
4. **Configure REST API:**
   - Base URL: `https://api.dulux.co.za/v1`
   - Auth Type: `API Key`
   - API Key: `dk_live_prod_xxxxxxxxxx`
   - Products Endpoint: `/api/products`
   - Pricing Endpoint: `/api/prices`
   - **Sync Frequency: 1 hour** ← Automated sync every hour
5. **Test Connection:** Click button → ✅ Success!
6. **Save Configuration:** Click "Save API Configuration"
7. **Close Modal**

**Result:**
- Configuration saved to database
- Automated sync scheduled (every 1 hour)
- Dulux integration is LIVE

---

#### **Phase 2: Testing (Sync Products)**

1. **Navigate:** Admin Dashboard → Supplier API → Sync Products
2. **Click "Sync Now":** Manual trigger
3. **Watch Status:** Real-time sync progress
4. **Check Results:**
   - Dulux: ✅ 245 products synced, 0 errors
   - PPC: ✅ 89 products synced, 0 errors
   - AfriSam: ✅ 156 products synced, 0 errors
   - (etc. for all 96 suppliers)

**Result:**
- All products updated in database
- Latest prices fetched
- Ready for BOQ generation

---

#### **Phase 3: Production (Automated)**

**Hour 1 (1:00 PM):**
- Automated sync runs (Dulux API called automatically)
- 245 products updated
- No manual intervention

**Hour 2 (2:00 PM):**
- Automated sync runs again
- Prices updated (some changed)
- No manual intervention

**Hour 3 (3:00 PM):**
- Automated sync runs again
- Latest prices in database
- No manual intervention

**Emergency (3:30 PM):**
- Dulux just released new paint line
- You click "Sync Now" (manual override)
- New products immediately appear
- Generate BOQ with latest catalog

---

## 📊 Comparison Table

| Aspect | Manage API | Sync Products | Auto-Sync (Frequency/Schedule) |
|--------|------------|---------------|--------------------------------|
| **Type** | Configuration | Execution | Automation |
| **Frequency** | Once per setup (occasional edits) | Ad-hoc (as needed) | Scheduled (hourly/daily) |
| **User Action** | Click "Manage API" → Configure → Save | Click "Sync Now" | None (runs automatically) |
| **When It Runs** | When you configure | When you click button | Every X hours/days |
| **Purpose** | Set up HOW to get data | Get data NOW | Keep data fresh automatically |
| **Environment** | Production & Testing | Testing & Ad-hoc production | Production background |
| **Manual vs Auto** | Manual (user-initiated) | Manual (user-initiated) | **Automatic (system-initiated)** |
| **Typical Use** | Initial setup, config changes | Testing, emergency updates | Ongoing production syncs |

---

## 🎯 Real-World Analogy

### **Manage API** = Programming Your Smart Thermostat
- You set the temperature schedule
- You configure WiFi settings
- You set automation rules
- **You do this ONCE or occasionally**

### **Auto-Sync (Frequency/Schedule)** = Thermostat Running on Schedule
- Every day at 6:00 AM, heat to 22°C (automated)
- Every day at 10:00 PM, cool to 18°C (automated)
- **Runs automatically based on your configuration**

### **Sync Products (Sync Now)** = Manual Override Button
- You come home early and it's cold
- Press "Heat Now" to immediately warm up
- **You do this when needed (ad-hoc)**

---

## 🔑 Key Takeaways

### 1. **Manage API** (Configuration)
- ✅ Configure HOW to get data
- ✅ Set credentials, endpoints, selectors
- ✅ Configure automation schedules
- ✅ Test before saving
- ✅ One-time setup (occasional edits)
- ✅ **Production configuration tool**

### 2. **Sync Products** (Manual Execution)
- ✅ Execute sync NOW
- ✅ Test configurations
- ✅ Emergency updates
- ✅ Ad-hoc data refresh
- ✅ **Testing & debugging tool** (also used for production ad-hoc syncs)

### 3. **Sync Frequency** (REST API Automation)
- ✅ How often REST API auto-syncs
- ✅ Runs in background (every X hours)
- ✅ No manual intervention
- ✅ **Production automation** (after configuration saved)

### 4. **Scraping Schedule** (Web Scraping Automation)
- ✅ How often website auto-scrapes
- ✅ Runs in background (daily/weekly)
- ✅ No manual intervention
- ✅ **Production automation** (after configuration saved)

---

## 💡 When to Use What

### **Initial Setup:**
1. **Manage API** → Configure integration
2. **Sync Products** → Test configuration
3. Auto-sync starts running automatically

### **Daily Production:**
1. Auto-sync runs in background (no action needed)
2. Products stay fresh automatically

### **Emergency Update:**
1. **Sync Products** → Click "Sync Now"
2. Immediate data refresh

### **Configuration Change:**
1. **Manage API** → Update settings
2. **Sync Products** → Test new settings
3. Auto-sync continues with new settings

---

## ✅ Summary

**Question:** Is Manage API for Production while Sync Products for Testing?

**Answer:**

- **Manage API** = **Production Configuration Tool**
  - Set up how data is fetched
  - Configure automation schedules
  - Used for both production setup and testing configurations

- **Sync Products** = **Testing & Ad-Hoc Execution Tool**
  - Primarily for testing configurations
  - Also used for production emergency/manual syncs
  - Not the primary production sync method

- **Auto-Sync (Frequency/Schedule)** = **Production Automation**
  - The REAL production sync mechanism
  - Runs automatically in background
  - Configured via Manage API, executed automatically

**Think of it this way:**
- **Manage API** = Set up the system (configuration)
- **Auto-Sync** = System runs automatically (production)
- **Sync Products** = Manual override (testing/emergencies)

**All three work together to create a complete supplier data synchronization system!** 🚀
