# Fix Supplier Products Relationship Error

## Problem
You're seeing this error:
```
Error fetching suppliers with products: {
  "code": "PGRST200",
  "message": "Could not find a relationship between 'suppliers' and 'supplier_products' in the schema cache"
}
```

## Solution

### Option 1: Run SQL Migration (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and paste the entire contents of:**
   ```
   /supabase/migrations/004_fix_supplier_products_relationship.sql
   ```

4. **Run the query**
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - Wait for "Success" message

5. **Verify**
   - You should see: ✅ Foreign key relationship between suppliers and supplier_products has been fixed!

### Option 2: Code Fallback (Automatic)

The code now automatically falls back to a manual join method if the foreign key relationship doesn't exist. You should see:
```
⚠️ Foreign key relationship not found. Using fallback method...
```

This will work but is less efficient than having the proper foreign key.

## What the Migration Does

1. ✅ Creates `supplier_products` table (if doesn't exist)
2. ✅ Adds proper foreign key constraint: `supplier_products.supplier_id → suppliers.id`
3. ✅ Creates performance indexes on:
   - `supplier_id`
   - `category`
   - `description` (full-text search)
   - `is_available`
4. ✅ Enables Row Level Security (RLS)
5. ✅ Adds RLS policies for read/write access
6. ✅ Grants permissions to anon and authenticated users
7. ✅ Refreshes Supabase schema cache

## After Running Migration

The error will disappear and you'll see:
```
✅ Loaded X suppliers with products from database
```

## Troubleshooting

### Still seeing errors after running migration?

1. **Check if tables exist:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('suppliers', 'supplier_products');
   ```

2. **Check if foreign key exists:**
   ```sql
   SELECT
     tc.table_name, 
     tc.constraint_name, 
     kcu.column_name,
     ccu.table_name AS foreign_table_name,
     ccu.column_name AS foreign_column_name 
   FROM information_schema.table_constraints AS tc 
   JOIN information_schema.key_column_usage AS kcu
     ON tc.constraint_name = kcu.constraint_name
   JOIN information_schema.constraint_column_usage AS ccu
     ON ccu.constraint_name = tc.constraint_name
   WHERE tc.constraint_type = 'FOREIGN KEY' 
   AND tc.table_name='supplier_products';
   ```

3. **Manually refresh schema cache:**
   ```sql
   NOTIFY pgrst, 'reload schema';
   ```

### Need to start fresh?

If you want to recreate everything:
```sql
DROP TABLE IF EXISTS public.supplier_products CASCADE;
-- Then run the migration again
```

## Related Files

- Migration: `/supabase/migrations/004_fix_supplier_products_relationship.sql`
- Code: `/src/utils/databaseProducts.ts` (has automatic fallback)

## Support

If you continue having issues:
1. Check Supabase logs in Dashboard → Logs
2. Verify your Supabase project is not paused
3. Check that RLS policies allow your user to read data
4. Try the fallback method (it should work automatically)
