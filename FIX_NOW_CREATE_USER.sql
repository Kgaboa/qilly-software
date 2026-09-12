-- =====================================================
-- INSTANT FIX: Create Admin User Record
-- Run this NOW to fix the "User not found" warning
-- =====================================================

-- This creates the missing user record in the users table
-- so you can login immediately without waiting for auto-creation

DO $$
DECLARE
  admin_user_id UUID;
  admin_email TEXT := 'admin@qilly.co.za';
BEGIN
  -- Get the admin user's ID from auth.users
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = admin_email;

  -- Check if user exists in auth.users
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Admin user not found in auth.users! Run /SETUP_ADMIN_USER_COMPLETE.sql first.';
  END IF;

  RAISE NOTICE '✅ Found admin user in auth.users: %', admin_user_id;

  -- Insert into users table (or update if exists)
  INSERT INTO users (id, email, role, created_at)
  VALUES (
    admin_user_id,
    admin_email,
    'admin',
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    role = 'admin',
    email = EXCLUDED.email;

  RAISE NOTICE '✅ Admin user created/updated in users table';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ SUCCESS! Now refresh your app and login again.';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

-- Verify the user was created
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT 'VERIFICATION' as status;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;

SELECT 
  u.id,
  u.email,
  u.role,
  au.email_confirmed_at IS NOT NULL as email_confirmed,
  'Auth: ✅ | Users: ✅ | Role: ✅' as status
FROM users u
JOIN auth.users au ON au.id = u.id
WHERE u.email = 'admin@qilly.co.za';

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT '✅ Admin user is ready!' as result;
SELECT '📝 Next: Refresh app (F5) and login' as next_step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
