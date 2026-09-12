# 🗄️ Supabase Database Setup for Qilly

This guide helps you set up the Supabase database structure for your Qilly Construction Bill Pricing System.

---

## 📋 Required Tables

Your Supabase project needs these tables to function properly:

### 1. **users** - User Accounts & Trial Management

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trial_bills_remaining INTEGER DEFAULT 3,
  is_premium BOOLEAN DEFAULT FALSE,
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  full_name TEXT,
  company_name TEXT,
  phone TEXT
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

---

### 2. **bills** - Bill of Quantities Records

```sql
CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  bill_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'draft', -- draft, priced, completed
  total_cost DECIMAL(12, 2),
  currency TEXT DEFAULT 'ZAR',
  notes TEXT,
  uploaded_via TEXT DEFAULT 'manual' -- manual, csv
);

-- Enable Row Level Security
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own bills
CREATE POLICY "Users can view own bills" ON bills
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own bills
CREATE POLICY "Users can insert own bills" ON bills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own bills
CREATE POLICY "Users can update own bills" ON bills
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own bills
CREATE POLICY "Users can delete own bills" ON bills
  FOR DELETE USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_bills_user_id ON bills(user_id);
CREATE INDEX idx_bills_created_at ON bills(created_at DESC);
```

---

### 3. **bill_items** - Individual Line Items in Bills

```sql
CREATE TABLE bill_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  item_number TEXT,
  description TEXT NOT NULL,
  unit TEXT NOT NULL, -- m3, m2, kg, ton, each, etc.
  quantity DECIMAL(12, 3) NOT NULL,
  unit_price DECIMAL(12, 2),
  total_price DECIMAL(12, 2),
  supplier_name TEXT,
  supplier_id TEXT,
  category TEXT, -- building_materials, steel_metal, concrete, etc.
  notes TEXT,
  formula TEXT, -- If calculated via formula
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see items from their own bills
CREATE POLICY "Users can view own bill items" ON bill_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bills 
      WHERE bills.id = bill_items.bill_id 
      AND bills.user_id = auth.uid()
    )
  );

-- Policy: Users can insert items to their own bills
CREATE POLICY "Users can insert own bill items" ON bill_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM bills 
      WHERE bills.id = bill_items.bill_id 
      AND bills.user_id = auth.uid()
    )
  );

-- Policy: Users can update items in their own bills
CREATE POLICY "Users can update own bill items" ON bill_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM bills 
      WHERE bills.id = bill_items.bill_id 
      AND bills.user_id = auth.uid()
    )
  );

-- Policy: Users can delete items from their own bills
CREATE POLICY "Users can delete own bill items" ON bill_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM bills 
      WHERE bills.id = bill_items.bill_id 
      AND bills.user_id = auth.uid()
    )
  );

-- Index for faster queries
CREATE INDEX idx_bill_items_bill_id ON bill_items(bill_id);
```

---

### 4. **suppliers** - Supplier Catalog (Optional - if storing in DB)

```sql
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read suppliers (public data)
CREATE POLICY "Anyone can view active suppliers" ON suppliers
  FOR SELECT USING (is_active = TRUE);

-- Index for faster queries
CREATE INDEX idx_suppliers_category ON suppliers(category);
CREATE INDEX idx_suppliers_active ON suppliers(is_active);
```

---

### 5. **supplier_products** - Product Catalog (Optional)

```sql
CREATE TABLE supplier_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  product_code TEXT,
  description TEXT NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  category TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read available products
CREATE POLICY "Anyone can view available products" ON supplier_products
  FOR SELECT USING (is_available = TRUE);

-- Index for faster queries
CREATE INDEX idx_supplier_products_supplier_id ON supplier_products(supplier_id);
CREATE INDEX idx_supplier_products_category ON supplier_products(category);
```

---

## 🔐 Authentication Setup

### Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional):
   - Confirmation email
   - Magic link email
   - Password recovery email

### Configure URL Settings

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://assuretechsolutions.co.za`
3. Add **Redirect URLs**:
   ```
   https://assuretechsolutions.co.za/**
   https://www.assuretechsolutions.co.za/**
   http://localhost:5173/** (for local development)
   ```

---

## 🔄 Database Functions (Optional but Recommended)

### Function: Decrement Trial Bills

```sql
CREATE OR REPLACE FUNCTION decrement_trial_bills(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  remaining INTEGER;
BEGIN
  UPDATE users 
  SET trial_bills_remaining = trial_bills_remaining - 1
  WHERE id = user_uuid
  AND trial_bills_remaining > 0
  RETURNING trial_bills_remaining INTO remaining;
  
  RETURN remaining;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Function: Check User Can Create Bill

```sql
CREATE OR REPLACE FUNCTION can_create_bill(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_premium BOOLEAN;
  trials_left INTEGER;
BEGIN
  SELECT users.is_premium, users.trial_bills_remaining
  INTO is_premium, trials_left
  FROM users
  WHERE id = user_uuid;
  
  RETURN (is_premium = TRUE) OR (trials_left > 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 📊 Sample Data for Testing

### Insert Sample Suppliers

```sql
INSERT INTO suppliers (name, category, website) VALUES
  ('Buco', 'building_materials', 'https://www.buco.co.za'),
  ('Builders Warehouse', 'building_materials', 'https://www.builders.co.za'),
  ('Macsteel', 'steel_metal', 'https://www.macsteel.co.za'),
  ('Lafarge', 'concrete_aggregates', 'https://www.lafarge.co.za'),
  ('PPC', 'concrete_aggregates', 'https://www.ppc.co.za'),
  ('Raumix', 'concrete_aggregates', 'https://www.raumix.co.za');
```

### Insert Sample User (for testing)

```sql
-- Note: This creates a user in the database, but authentication 
-- should go through Supabase Auth, not direct insertion
INSERT INTO users (id, email, trial_bills_remaining, full_name) VALUES
  (gen_random_uuid(), 'test@example.com', 3, 'Test User');
```

---

## 🚀 Quick Setup via Supabase Dashboard

### Method 1: SQL Editor

1. Go to **SQL Editor** in Supabase Dashboard
2. Create a new query
3. Copy and paste each table creation SQL above
4. Click **Run** for each table

### Method 2: Table Editor (Manual)

1. Go to **Table Editor**
2. Click **"Create a new table"**
3. Add columns manually based on schemas above
4. Enable RLS and add policies via **Authentication** → **Policies**

---

## 🔒 Security Best Practices

### Row Level Security (RLS)

✅ **Always enable RLS** on tables containing user data:
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

✅ **Create policies** to restrict access:
- Users can only see their own data
- Users cannot see other users' bills or items

### API Keys

- ✅ Use **anon/public key** for frontend (safe to expose)
- ❌ Never expose **service role key** (keep secret, server-side only)

---

## 📈 Monitoring & Maintenance

### Enable Realtime (Optional)

If you want real-time updates:
1. Go to **Database** → **Replication**
2. Enable replication for tables: `bills`, `bill_items`

### Backups

Supabase automatically backs up your database daily.

**Manual backup:**
1. Go to **Settings** → **Database**
2. Download database backup

---

## 🧪 Testing Your Setup

### Test Authentication

```javascript
// In your app
import { supabase } from './utils/supabase';

// Sign up test
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'securepassword123'
});
```

### Test Database Insert

```javascript
// Insert a bill
const { data, error } = await supabase
  .from('bills')
  .insert({
    project_name: 'Test Project',
    bill_number: 'BOQ-001'
  });
```

### Test RLS Policies

Try to:
1. Login as User A
2. Try to access User B's bills (should fail)
3. Verify you can only see your own data

---

## 🆘 Troubleshooting

### "Row Level Security policy violation"
- ✅ Ensure RLS policies are created
- ✅ Check user is authenticated
- ✅ Verify policy conditions are correct

### "relation does not exist"
- ✅ Ensure tables are created
- ✅ Check table names match code
- ✅ Run SQL in correct project

### Authentication not working
- ✅ Check redirect URLs include your domain
- ✅ Verify email provider is enabled
- ✅ Check environment variables are correct

---

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security
- **SQL Editor:** https://supabase.com/docs/guides/database/overview

---

## ✅ Setup Checklist

- [ ] All tables created
- [ ] RLS enabled on all tables
- [ ] RLS policies created
- [ ] Email authentication enabled
- [ ] Redirect URLs configured
- [ ] Sample data inserted (optional)
- [ ] Database functions created (optional)
- [ ] Tested authentication
- [ ] Tested data insertion
- [ ] Tested RLS policies

---

**Your Supabase database is now ready for production!** 🎉