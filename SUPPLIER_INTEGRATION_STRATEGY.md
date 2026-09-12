# 🔌 Qilly Supplier Integration Strategy
## Complete Integration Methods: API, Scraping, Email, CSV & More

---

## 🎯 Integration Philosophy

**Qilly allows ALL types of supplier integrations** to achieve 100% market coverage across South Africa's 9 provinces.

### Core Principle
> "Every supplier integration method has value - from premium APIs to manual CSV uploads"

---

## 📊 Integration Types (Ranked by Preference)

### ⭐ Tier 1: Real-Time Automated (Best)

#### 1. **Supplier API Integration** ✅
- **Description:** Direct REST/GraphQL API connection to supplier systems
- **Frequency:** Real-time / Near real-time
- **Accuracy:** 95-100%
- **Setup Time:** 2-4 weeks
- **Cost:** Usually FREE (partnership) or subscription-based

**Best For:**
- Large national suppliers (Buco, Builders Warehouse, Macsteel)
- Suppliers with existing APIs
- High-volume price updates

**Technical Requirements:**
```javascript
// Example API Integration
const fetchBucoPrice = async (itemCode) => {
  const response = await fetch('https://api.buco.co.za/v1/pricing', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${BUCO_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      itemCode: itemCode,
      quantity: 1,
      location: 'GP-JOHANNESBURG'
    })
  });
  return response.json();
};
```

**Advantages:**
- ✅ Real-time pricing
- ✅ Automatic stock availability
- ✅ Branch-specific pricing
- ✅ No rate limiting issues
- ✅ Official partnership potential

**Disadvantages:**
- ❌ Requires supplier cooperation
- ❌ API key management
- ❌ API versioning changes
- ❌ Potential costs

---

#### 2. **Web Scraping (Automated)** ⚡
- **Description:** Automated extraction of pricing data from supplier websites
- **Frequency:** Hourly / Daily updates
- **Accuracy:** 85-95%
- **Setup Time:** 1-2 weeks per supplier
- **Cost:** FREE (except hosting)

**Best For:**
- Suppliers without APIs
- Suppliers with public pricing pages
- Medium-volume data collection

**Technical Requirements:**
```javascript
// Example Web Scraper (Puppeteer)
const scrapePlasconPricing = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://www.plascon.co.za/products');
  
  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.product-card')).map(card => ({
      name: card.querySelector('.product-name').textContent,
      price: parseFloat(card.querySelector('.price').textContent.replace('R', '')),
      unit: card.querySelector('.unit').textContent,
      available: card.querySelector('.stock').textContent === 'In Stock'
    }));
  });
  
  await browser.close();
  return products;
};
```

**Advantages:**
- ✅ No API needed
- ✅ Full control over data collection
- ✅ Can scrape competitor data
- ✅ FREE (no API costs)

**Disadvantages:**
- ❌ Website structure changes break scrapers
- ❌ Risk of IP blocking
- ❌ Legal gray area (check T&Cs)
- ❌ Maintenance required

**Best Practices:**
1. Respect robots.txt
2. Use rate limiting (1 request per 3-5 seconds)
3. Rotate user agents
4. Cache results to minimize requests
5. Monitor for structure changes

---

### ⭐ Tier 2: Batch Automated (Good)

#### 3. **Email Price Lists** 📧
- **Description:** Automated parsing of supplier email price lists
- **Frequency:** Daily / Weekly
- **Accuracy:** 90-98%
- **Setup Time:** 1 week
- **Cost:** FREE

**Best For:**
- Suppliers who send regular price updates
- Local/regional suppliers
- Suppliers without digital infrastructure

**Technical Requirements:**
```javascript
// Example Email Parser (Gmail API)
const parseSupplierEmail = async (emailId) => {
  const gmail = google.gmail({ version: 'v1', auth });
  const message = await gmail.users.messages.get({ userId: 'me', id: emailId });
  
  // Extract attachments (Excel/CSV)
  const attachments = message.data.payload.parts
    .filter(part => part.filename.endsWith('.xlsx') || part.filename.endsWith('.csv'));
  
  for (const attachment of attachments) {
    const data = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId: emailId,
      id: attachment.body.attachmentId
    });
    
    // Parse Excel/CSV file
    const buffer = Buffer.from(data.data.data, 'base64');
    const workbook = XLSX.read(buffer);
    const products = parseWorksheet(workbook.Sheets[workbook.SheetNames[0]]);
    
    return products;
  }
};
```

**Advantages:**
- ✅ Official supplier data
- ✅ No website scraping needed
- ✅ Suppliers already send these
- ✅ Batch updates efficient

**Disadvantages:**
- ❌ Not real-time
- ❌ Email parsing complexity
- ❌ Various Excel/CSV formats
- ❌ Manual email account management

---

#### 4. **CSV/Excel Upload** 📊
- **Description:** Manual or automated CSV/Excel file uploads
- **Frequency:** On-demand / Weekly
- **Accuracy:** 95-100%
- **Setup Time:** 1 day
- **Cost:** FREE

**Best For:**
- One-time bulk uploads
- Suppliers who provide data files
- Historical data import
- Testing and validation

**Technical Implementation:**
```javascript
// CSV Upload Handler
const handleCSVUpload = async (file) => {
  const workbook = XLSX.readFile(file);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  const products = data.map(row => ({
    itemName: row['Product Name'] || row['Item'],
    unitPrice: parseFloat(row['Price'] || row['Unit Price']),
    unit: row['Unit'] || row['UOM'],
    supplier: row['Supplier'],
    available: row['Stock'] === 'Yes' || row['Available'] === 'TRUE',
    category: row['Category'],
    lastUpdated: new Date().toISOString()
  }));
  
  // Validate and save to database
  await bulkInsertProducts(products);
  
  return { success: true, count: products.length };
};
```

**Advantages:**
- ✅ Simple and reliable
- ✅ No technical complexity
- ✅ 100% data accuracy
- ✅ Easy to validate

**Disadvantages:**
- ❌ Manual process
- ❌ Not automated
- ❌ Requires file standardization
- ❌ Human error possible

---

### ⭐ Tier 3: Semi-Automated (Acceptable)

#### 5. **PDF Price Lists** 📄
- **Description:** OCR/PDF parsing of supplier catalogs
- **Frequency:** Monthly / Quarterly
- **Accuracy:** 70-85%
- **Setup Time:** 2-3 weeks
- **Cost:** LOW (OCR API costs)

**Best For:**
- Suppliers with PDF catalogs only
- Printed catalogs (OCR)
- Legacy supplier data

**Technical Requirements:**
```javascript
// PDF Parser with OCR
const parsePDFPriceList = async (pdfPath) => {
  // Extract text from PDF
  const pdfData = await pdf(fs.readFileSync(pdfPath));
  const text = pdfData.text;
  
  // Regex patterns for common pricing formats
  const patterns = [
    /(\w+[\w\s]+)\s+R\s*([\d,]+\.?\d*)\s+per\s+(\w+)/gi,
    /Item:\s*(.+)\s+Price:\s*R([\d,]+\.?\d*)\s+Unit:\s*(\w+)/gi
  ];
  
  const products = [];
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      products.push({
        itemName: match[1].trim(),
        unitPrice: parseFloat(match[2].replace(',', '')),
        unit: match[3].toLowerCase()
      });
    }
  });
  
  return products;
};
```

**Advantages:**
- ✅ Works with legacy systems
- ✅ No supplier tech required
- ✅ Can handle scanned documents

**Disadvantages:**
- ❌ OCR accuracy issues
- ❌ Complex formatting
- ❌ Manual validation needed
- ❌ Time-consuming

---

#### 6. **WhatsApp/Telegram Bots** 💬
- **Description:** Automated price requests via messaging apps
- **Frequency:** On-demand
- **Accuracy:** 80-90%
- **Setup Time:** 1 week
- **Cost:** FREE (WhatsApp Business API)

**Best For:**
- Small local suppliers
- Suppliers without websites
- Quick price checks
- Regional suppliers

**Technical Implementation:**
```javascript
// WhatsApp Business API Integration
const requestPriceViaWhatsApp = async (supplierPhone, itemCode) => {
  const message = `Hi, can you please send me the current price for ${itemCode}?`;
  
  await whatsappClient.messages.create({
    from: 'whatsapp:+27XXXXXXXXX',
    to: `whatsapp:${supplierPhone}`,
    body: message
  });
  
  // Listen for response
  whatsappClient.on('message', async (msg) => {
    if (msg.from === `whatsapp:${supplierPhone}`) {
      // Parse price from message
      const priceMatch = msg.body.match(/R\s*([\d,]+\.?\d*)/);
      if (priceMatch) {
        const price = parseFloat(priceMatch[1].replace(',', ''));
        return { itemCode, price, unit: 'unit' };
      }
    }
  });
};
```

**Advantages:**
- ✅ Reaches non-digital suppliers
- ✅ Quick responses
- ✅ Personal relationships
- ✅ Works on mobile

**Disadvantages:**
- ❌ Manual responses
- ❌ Inconsistent formatting
- ❌ Not scalable
- ❌ Requires parsing logic

---

### ⭐ Tier 4: Manual (Backup)

#### 7. **Phone Calls / Fax** ☎️
- **Description:** Manual phone-based price requests
- **Frequency:** As needed
- **Accuracy:** 60-80%
- **Setup Time:** Immediate
- **Cost:** Call/Fax costs

**Best For:**
- Very small suppliers
- Emergency price checks
- Specialized items
- Rural suppliers

**Process:**
1. Operator calls supplier
2. Requests pricing for specific items
3. Manually enters data into system
4. Validates and saves

**Advantages:**
- ✅ Works for anyone
- ✅ No technical requirements
- ✅ Personal service

**Disadvantages:**
- ❌ Very time-consuming
- ❌ Human error prone
- ❌ Not scalable
- ❌ Expensive at scale

---

#### 8. **Manual Web Entry** 🖱️
- **Description:** Admin manually enters prices from supplier websites
- **Frequency:** As needed
- **Accuracy:** 90-95%
- **Setup Time:** Immediate
- **Cost:** FREE (labor cost)

**Best For:**
- Initial supplier setup
- Rare/specialized items
- Data validation
- Small catalogs (<50 items)

**Admin Interface:**
```javascript
// Admin Manual Entry Form
<form onSubmit={handleManualEntry}>
  <Input label="Supplier" value={supplier} onChange={setSupplier} />
  <Input label="Item Name" value={itemName} onChange={setItemName} />
  <Input label="Price" type="number" value={price} onChange={setPrice} />
  <Select label="Unit" options={['unit', 'bag', 'ton', 'm3', 'meter']} />
  <Checkbox label="In Stock" checked={available} onChange={setAvailable} />
  <Button type="submit">Add Item</Button>
</form>
```

**Advantages:**
- ✅ 100% flexible
- ✅ Works for any supplier
- ✅ No technical setup

**Disadvantages:**
- ❌ Extremely time-consuming
- ❌ Human errors
- ❌ Not scalable beyond 50-100 items

---

## 🚀 Recommended Integration Strategy

### Phase 1: Tier 1 Suppliers (60% Coverage)
**Focus:** Top 20 national suppliers with APIs or scrapeable websites

| Supplier | Method | Priority | Timeline |
|----------|--------|----------|----------|
| Builders Warehouse | API | Critical | Week 1 |
| Buco | API | Critical | Week 1 |
| Build It | Scraping | High | Week 2 |
| Cashbuild | Scraping | High | Week 2 |
| Macsteel | API | Critical | Week 3 |
| PPC Cement | API | Critical | Week 3 |
| AfriSam | API | High | Week 4 |
| Lafarge | API | High | Week 4 |
| Dulux | Scraping | Medium | Week 5 |
| Plascon | Scraping | Medium | Week 5 |

### Phase 2: Tier 2 Suppliers (30% Coverage)
**Focus:** Regional suppliers with email price lists

- Set up email parsing for 30-40 suppliers
- Weekly batch updates
- CSV upload portal for suppliers

### Phase 3: Tier 3 Suppliers (8% Coverage)
**Focus:** Small local suppliers

- WhatsApp/SMS integration
- PDF catalog uploads
- Manual entry when needed

### Phase 4: Long Tail (2% Coverage)
**Focus:** Specialized/niche suppliers

- Manual entry on-demand
- Phone-based pricing
- Infrequent updates

---

## 🛡️ Legal & Compliance

### Web Scraping Guidelines

**Legal Considerations:**
1. ✅ Check supplier Terms of Service
2. ✅ Review robots.txt file
3. ✅ Respect rate limiting
4. ✅ Don't bypass authentication
5. ✅ Cache data to reduce requests

**Ethical Scraping:**
```javascript
// Rate-limited scraper
const rateLimitedFetch = async (url) => {
  await sleep(3000); // 3 second delay
  return fetch(url, {
    headers: {
      'User-Agent': 'Qilly Price Aggregator Bot/1.0 (+https://qilly.co.za/bot)'
    }
  });
};
```

### POPIA Compliance
- ✅ Only collect publicly available pricing
- ✅ No personal data scraping
- ✅ Clear data usage policies
- ✅ Supplier opt-out mechanism

---

## 📊 Integration Monitoring

### Health Dashboard Metrics

```javascript
// Integration Status Monitoring
const integrationHealth = {
  API: {
    total: 15,
    online: 14,
    offline: 1,
    lastUpdate: '2 minutes ago',
    errorRate: 0.05
  },
  Scraping: {
    total: 25,
    active: 23,
    failing: 2,
    lastUpdate: '15 minutes ago',
    successRate: 0.92
  },
  Email: {
    total: 30,
    lastReceived: '3 hours ago',
    pending: 5,
    processed: 25
  },
  Manual: {
    total: 8,
    lastUpdate: '2 days ago'
  }
};
```

### Alert System
- 🔴 **Critical:** API down for >30 minutes
- 🟡 **Warning:** Scraper failing for >24 hours
- 🟢 **Info:** New email price list received

---

## 🔧 Technical Implementation Plan

### Database Schema

```sql
CREATE TABLE supplier_integrations (
  id UUID PRIMARY KEY,
  supplier_name VARCHAR(255) NOT NULL,
  integration_type VARCHAR(50) CHECK (integration_type IN (
    'API', 'SCRAPING', 'EMAIL', 'CSV', 'PDF', 
    'WHATSAPP', 'MANUAL', 'PHONE'
  )),
  status VARCHAR(20) CHECK (status IN ('ACTIVE', 'INACTIVE', 'FAILING')),
  config JSONB, -- API keys, scraper settings, email filters, etc.
  last_sync_at TIMESTAMP,
  next_sync_at TIMESTAMP,
  sync_frequency INTERVAL, -- e.g., '1 hour', '1 day'
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE supplier_price_history (
  id UUID PRIMARY KEY,
  integration_id UUID REFERENCES supplier_integrations(id),
  item_code VARCHAR(255),
  item_name VARCHAR(500),
  unit_price DECIMAL(10,2),
  unit VARCHAR(50),
  available BOOLEAN,
  province VARCHAR(50),
  municipality VARCHAR(100),
  branch_name VARCHAR(255),
  source_data JSONB, -- Raw data from integration
  collected_at TIMESTAMP DEFAULT NOW()
);
```

### Cron Jobs Schedule

```javascript
// Integration Sync Schedule
const cronSchedule = {
  'API': '*/5 * * * *',      // Every 5 minutes
  'SCRAPING': '0 */2 * * *',  // Every 2 hours
  'EMAIL': '0 */6 * * *',     // Every 6 hours
  'CSV': 'manual',            // On-demand
  'MANUAL': 'manual'          // On-demand
};
```

---

## ✅ Summary: 68 Suppliers, Multiple Integration Methods

### Current Status (Development Mode)

| Method | Suppliers | Coverage | Status |
|--------|-----------|----------|--------|
| Demo Data | 68 | 100% (dev) | ✅ Complete |
| API Ready | 0 | 0% | 🔜 Phase 1 |
| Scraping Ready | 0 | 0% | 🔜 Phase 1 |
| Email Parser | 0 | 0% | 🔜 Phase 2 |
| CSV Upload | 1 (Admin) | Manual | ✅ Available |
| Manual Entry | 1 (Admin) | Manual | ✅ Available |

### Production Roadmap

**Q1 2026:** Tier 1 Integration (15 suppliers via API + Scraping)
**Q2 2026:** Tier 2 Integration (30 suppliers via Email + CSV)
**Q3 2026:** Tier 3 Integration (15 suppliers via WhatsApp + PDF)
**Q4 2026:** Long Tail (8 suppliers via Manual + Phone)

**Total:** 68 suppliers with 100% coverage by end of 2026!

---

## 🎯 Next Steps

1. **Create Integration Priority List** - Rank suppliers by volume
2. **Contact Top Suppliers** - Request API access or data partnerships
3. **Build Scraper Infrastructure** - Set up Puppeteer/Playwright scrapers
4. **Email Parser Service** - Gmail API integration for price lists
5. **CSV Upload Portal** - Supplier self-service data upload
6. **Monitoring Dashboard** - Real-time integration health tracking

**Qilly supports ALL integration methods to achieve complete market coverage! 🚀**
