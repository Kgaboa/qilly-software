-- =====================================================
-- FIX: Add role column to existing users table
-- =====================================================

-- Step 1: Add role column if it doesn't exist
DO $$ 
BEGIN
  -- Check if role column exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    -- Add the role column
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
    RAISE NOTICE 'Added role column to users table';
  ELSE
    RAISE NOTICE 'Role column already exists';
  END IF;
END $$;

-- Step 2: Add constraint to role column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_role_check'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'supplier', 'contractor', 'user'));
    RAISE NOTICE 'Added role check constraint';
  END IF;
END $$;

-- Step 3: Set role to NOT NULL (after we populate it)
-- We'll do this after inserting data

-- Step 4: Now populate the roles based on metadata
UPDATE users u
SET role = CASE 
  WHEN u.email = 'admin@qilly.co.za' THEN 'admin'
  WHEN (SELECT raw_user_meta_data->>'user_type' FROM auth.users WHERE id = u.id) = 'contractor' THEN 'contractor'
  WHEN (SELECT raw_user_meta_data->>'user_type' FROM auth.users WHERE id = u.id) = 'supplier' THEN 'supplier'
  ELSE 'user'
END;

-- Step 5: Insert any auth users that don't exist in users table yet
INSERT INTO users (id, email, role, created_at)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'admin@qilly.co.za' THEN 'admin'
    WHEN au.raw_user_meta_data->>'user_type' = 'contractor' THEN 'contractor'
    WHEN au.raw_user_meta_data->>'user_type' = 'supplier' THEN 'supplier'
    ELSE 'user'
  END as role,
  au.created_at
FROM auth.users au
WHERE au.deleted_at IS NULL
AND NOT EXISTS (SELECT 1 FROM users WHERE users.id = au.id)
ON CONFLICT (id) DO NOTHING;

-- Step 6: Now make role NOT NULL
ALTER TABLE users ALTER COLUMN role SET NOT NULL;

-- Step 7: Verify
SELECT 
  '✅ VERIFICATION' as status,
  role,
  COUNT(*) as count
FROM users
GROUP BY role
ORDER BY 
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'supplier' THEN 2
    WHEN 'contractor' THEN 3
    ELSE 4
  END;

-- Show details
SELECT 
  email,
  role,
  created_at
FROM users
ORDER BY 
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'supplier' THEN 2
    WHEN 'contractor' THEN 3
    ELSE 4
  END,
  email;
