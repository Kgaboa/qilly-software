-- Performance indexes for scalability
-- Run this in Supabase SQL Editor (Development and SIT databases)

-- Contractors table
CREATE INDEX IF NOT EXISTS idx_contractors_email ON contractors(email);
CREATE INDEX IF NOT EXISTS idx_contractors_status ON contractors(status);
CREATE INDEX IF NOT EXISTS idx_contractors_tier ON contractors(tier);
CREATE INDEX IF NOT EXISTS idx_contractors_user_id ON contractors(user_id);

-- Users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Bills table
CREATE INDEX IF NOT EXISTS idx_bills_contractor_id ON bills(contractor_id);
CREATE INDEX IF NOT EXISTS idx_bills_created_at ON bills(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bills_contractor_created ON bills(contractor_id, created_at DESC);

-- Suppliers table
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);

-- Supplier products table
CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier_id ON supplier_products(supplier_id);

-- Restrict exec_sql RPC to service_role only (prevents arbitrary SQL from authenticated users)
-- Run this after confirming exec_sql function exists:
-- REVOKE EXECUTE ON FUNCTION exec_sql(text) FROM authenticated;
-- REVOKE EXECUTE ON FUNCTION exec_sql(text) FROM anon;
