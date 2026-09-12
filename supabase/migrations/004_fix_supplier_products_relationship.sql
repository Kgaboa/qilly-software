-- Fix Foreign Key Relationship between suppliers and supplier_products
-- Run this in Supabase SQL Editor to fix the "Could not find a relationship" error

-- Step 1: Check if supplier_products table exists, if not create it
CREATE TABLE IF NOT EXISTS public.supplier_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id UUID NOT NULL,
    product_code TEXT NOT NULL,
    description TEXT NOT NULL,
    unit TEXT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    category TEXT,
    is_available BOOLEAN DEFAULT true,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 2: Drop existing foreign key if it exists (with wrong name)
ALTER TABLE public.supplier_products 
DROP CONSTRAINT IF EXISTS supplier_products_supplier_id_fkey;

ALTER TABLE public.supplier_products 
DROP CONSTRAINT IF EXISTS fk_supplier_products_supplier;

-- Step 3: Add proper foreign key constraint with ON DELETE CASCADE
ALTER TABLE public.supplier_products
ADD CONSTRAINT supplier_products_supplier_id_fkey 
FOREIGN KEY (supplier_id) 
REFERENCES public.suppliers(id) 
ON DELETE CASCADE;

-- Step 4: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier_id 
ON public.supplier_products(supplier_id);

CREATE INDEX IF NOT EXISTS idx_supplier_products_category 
ON public.supplier_products(category);

CREATE INDEX IF NOT EXISTS idx_supplier_products_description 
ON public.supplier_products USING gin(to_tsvector('english', description));

CREATE INDEX IF NOT EXISTS idx_supplier_products_available 
ON public.supplier_products(is_available);

-- Step 5: Enable RLS (Row Level Security)
ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.supplier_products;
CREATE POLICY "Enable read access for all users" 
ON public.supplier_products FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.supplier_products;
CREATE POLICY "Enable insert for authenticated users only" 
ON public.supplier_products FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.supplier_products;
CREATE POLICY "Enable update for authenticated users only" 
ON public.supplier_products FOR UPDATE 
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.supplier_products;
CREATE POLICY "Enable delete for authenticated users only" 
ON public.supplier_products FOR DELETE 
USING (auth.role() = 'authenticated');

-- Step 7: Grant necessary permissions
GRANT SELECT ON public.supplier_products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.supplier_products TO authenticated;

-- Step 8: Refresh the schema cache (this helps Supabase recognize the relationship)
NOTIFY pgrst, 'reload schema';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Foreign key relationship between suppliers and supplier_products has been fixed!';
    RAISE NOTICE '✅ Indexes created for performance optimization';
    RAISE NOTICE '✅ RLS policies enabled';
    RAISE NOTICE 'You can now query: suppliers.select("*, supplier_products(*)")';
END $$;
