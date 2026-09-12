# 🏗️ Simplified SIT Architecture (No Edge Functions)

## Architecture Decision

**We're using the proven DEV approach for SIT:**

```
┌─────────────────────────────────────────────────────────────┐
│                     QILLY SIT ENVIRONMENT                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌─────────────────────────────┐
│  Frontend (SIT)  │────────▶│  Supabase Client Library    │
│  Vercel Hosted   │         │  (@supabase/supabase-js)    │
└──────────────────┘         └─────────────────────────────┘
                                        │
                                        ▼
                            ┌───────────────────────┐
                            │  SIT Supabase Project │
                            │  kcptusoevqapcvptlgkd │
                            └───────────────────────┘
                                        │
                ┌───────────────────────┼───────────────────────┐
                ▼                       ▼                       ▼
        ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
        │ Supabase Auth│      │  PostgreSQL  │      │  Storage     │
        │   (Built-in) │      │   Database   │      │  (Files)     │
        └──────────────┘      └──────────────┘      └──────────────┘
                                      │
                        ┌─────────────┼─────────────┐
                        ▼             ▼             ▼
                   ┌────────┐   ┌──────────┐  ┌──────────┐
                   │ users  │   │suppliers │  │products  │
                   └────────┘   └──────────┘  └──────────┘
                        ▼             ▼             ▼
                   ┌────────┐   ┌──────────┐  ┌──────────┐
                   │ bills  │   │contractors│ │branches │
                   └────────┘   └──────────┘  └──────────┘
```

---

## Why This Approach?

### ✅ **Advantages**

| Benefit | Impact |
|---------|--------|
| **Proven Architecture** | Already working in DEV for months |
| **Simpler Code** | No serverless function complexity |
| **Faster Performance** | No cold start delays |
| **Easier Debugging** | Direct SQL queries, no function logs |
| **Lower Cost** | No function invocation fees |
| **Same Codebase** | DEV and SIT use identical code |
| **Less Risk** | No new dependencies to fail |

### ⚠️ **Trade-offs**

| Limitation | Workaround |
|------------|------------|
| Pricing logic runs client-side | Mock suppliers work for demo |
| No server-side validation | RLS policies provide security |
| Limited to Supabase features | Enough for 90% of use cases |

---

## Data Flow

### **1. User Authentication**
```
User Login → Supabase Auth → JWT Token → RLS Policies
```

### **2. BOQ Processing**
```
Upload BOQ → Parse Excel → Mock Pricing Engine → Save to bills table
```

### **3. Contractor Management**
```
Signup → Create auth.user → Insert contractors table → Admin approval
```

### **4. Supplier Management**
```
Admin → Insert suppliers table → Add products → Approve supplier
```

---

## Database Schema

### **Core Tables**

```sql
users
├── id (UUID, PK, FK to auth.users)
├── email (TEXT)
├── role (contractor|supplier|admin)
└── subscription_tier (free|basic|professional|enterprise)

contractors
├── id (UUID, PK)
├── user_id (UUID, FK to users)
├── company_name (TEXT)
├── cidb_grade (TEXT)
└── approved (BOOLEAN)

suppliers
├── id (UUID, PK)
├── user_id (UUID, FK to users)
├── company_name (TEXT)
├── categories (TEXT[])
└── approved (BOOLEAN)

products
├── id (UUID, PK)
├── supplier_id (UUID, FK to suppliers)
├── name (TEXT)
├── base_price (NUMERIC)
└── province (TEXT)

bills
├── id (UUID, PK)
├── user_id (UUID, FK to users)
├── items (JSONB)
├── overall_total (NUMERIC)
└── project_settings (JSONB)
```

---

## Security Model

### **Row Level Security (RLS)**

Every table has RLS enabled with policies:

```sql
-- Example: contractors table
✅ Users can view own profile
✅ Users can update own profile
✅ Admins can view all profiles
❌ Users cannot view other user profiles
❌ Users cannot modify admin settings
```

### **Authentication Flow**

```
1. User signs up → auth.users created
2. Trigger creates users table entry
3. User logs in → JWT token issued
4. All API calls include JWT
5. RLS policies check JWT claims
6. Access granted/denied
```

---

## Environment Configuration

### **DEV Environment**
```typescript
projectUrl: 'https://zzdzrlglivtpawtitvgu.supabase.co'
projectId: 'zzdzrlglivtpawtitvgu'
anonKey: 'eyJhbGciOiJIUz...' // DEV anon key
```

### **SIT Environment**
```typescript
projectUrl: 'https://kcptusoevqapcvptlgkd.supabase.co'
projectId: 'kcptusoevqapcvptlgkd'
anonKey: 'eyJhbGciOiJIUz...' // SIT anon key
```

**That's it!** No edge function URLs, no custom endpoints, no CORS configuration needed.

---

## API Layer

### **How API Calls Work**

```typescript
// /src/utils/api.ts

// DEV/SIT use direct Supabase client
import { supabase } from './supabase/client';

// Get user profile
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();

// Save bill
const { data, error } = await supabase
  .from('bills')
  .insert({
    user_id: userId,
    items: billItems,
    overall_total: total
  });
```

**No fetch() calls to edge functions!**  
**No CORS issues!**  
**No 401 errors!**

---

## BOQ Processing Flow

### **Client-Side Processing**

```typescript
// 1. Upload Excel file
const workbook = XLSX.read(file);

// 2. Parse BOQ items
const items = parseExcelToBoq(workbook);

// 3. Apply mock pricing (no database query)
const pricedItems = items.map(item => ({
  ...item,
  unitPrice: getMockPrice(item),
  totalPrice: quantity * getMockPrice(item)
}));

// 4. Save to database
await supabase.from('bills').insert({
  user_id: userId,
  items: pricedItems,
  overall_total: calculateTotal(pricedItems)
});
```

**No edge function involved!**

---

## Deployment Workflow

### **Frontend Deployment**

```bash
# 1. Build with SIT environment
VITE_ENVIRONMENT=sit npm run build

# 2. Deploy to Vercel
vercel --prod
```

### **Database Deployment**

```bash
# 1. Run migration SQL
# Go to Supabase SQL Editor
# Paste /SETUP_SIT_DATABASE_DIRECT_ACCESS.sql
# Click "Run"

# Done! No edge function deployment needed.
```

---

## Comparison: Edge Functions vs Direct Client

### **Edge Functions Approach (NOT USED)**

```typescript
// ❌ Complex approach
Frontend 
  → fetch('/functions/v1/server/process-bill')
    → Edge Function validates JWT
      → Edge Function queries database
        → Edge Function runs pricing logic
          → Returns result
```

**Problems:**
- Cold start delays (2-3 seconds)
- CORS configuration needed
- Function deployment required
- More points of failure
- Harder to debug

### **Direct Client Approach (WHAT WE USE)**

```typescript
// ✅ Simple approach
Frontend 
  → Supabase Client queries database
    → RLS validates JWT automatically
      → Returns result
```

**Benefits:**
- Instant response
- No CORS issues
- No deployment steps
- Fewer points of failure
- Easy to debug

---

## Testing Strategy

### **Unit Tests**
- Mock Supabase client
- Test pricing engine logic
- Test Excel parsing

### **Integration Tests**
- Test with real Supabase client
- Test RLS policies
- Test authentication flow

### **E2E Tests**
- Test full BOQ upload flow
- Test contractor signup
- Test admin approval

---

## Monitoring

### **Supabase Dashboard**

- **Auth:** Monitor user signups/logins
- **Database:** Query performance metrics
- **Logs:** View real-time query logs
- **API:** Track API usage

### **Vercel Analytics**

- Frontend performance
- User sessions
- Error tracking
- Build status

---

## Cost Comparison

### **Edge Functions (NOT USED)**
```
$25/month for 2M function invocations
+ $0.18 per GB compute time
+ Cold start delays
= $25-100/month
```

### **Direct Client (WHAT WE USE)**
```
Included in Supabase Pro plan ($25/month)
+ No additional costs
+ No cold starts
= $25/month total
```

**Savings: Up to $75/month**

---

## Migration Path (Future)

If you ever need edge functions later:

### **When to Add Edge Functions**

1. **Real-time supplier pricing** via external APIs
2. **Complex calculations** that shouldn't run client-side
3. **Webhook processing** from third parties
4. **Scheduled jobs** (e.g., nightly price updates)

### **How to Migrate**

1. Keep existing direct database access
2. Add edge functions for new features only
3. Gradually move logic as needed
4. Both approaches can coexist

---

## ✅ Architecture Decision Summary

| Aspect | Decision | Reason |
|--------|----------|--------|
| **Auth** | Supabase Auth | Built-in, proven |
| **Database** | PostgreSQL | Relational data model |
| **API** | Direct Client | Simpler, faster |
| **BOQ Processing** | Client-side | Demo mode sufficient |
| **Security** | RLS Policies | Supabase best practice |
| **Deployment** | Vercel + Supabase | Zero config |

---

## 🎯 Result

**SIT works exactly like DEV:**
- ✅ Same codebase
- ✅ Same architecture  
- ✅ Same performance
- ✅ Just different database

**No edge functions = No complexity!** 🚀
