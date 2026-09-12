-- =====================================================
-- QILLY MULTI-USER & ORGANIZATION SCHEMA
-- =====================================================
-- Run this in Supabase SQL Editor for project: zzdzrlglivtpawtitvgu
-- This enables multi-user functionality for Enterprise tier
-- =====================================================

-- 1. ORGANIZATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free',
  max_users INTEGER DEFAULT 1,
  white_label_enabled BOOLEAN DEFAULT false,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#6366f1',
  custom_domain TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_organizations_owner_email ON organizations(owner_email);
CREATE INDEX IF NOT EXISTS idx_organizations_custom_domain ON organizations(custom_domain);

-- 2. UPDATE CONTRACTORS TABLE
-- =====================================================
-- Add organization_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE contractors ADD COLUMN organization_id UUID REFERENCES organizations(id);
  END IF;

  -- Add payment and subscription columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'last_payment_date'
  ) THEN
    ALTER TABLE contractors ADD COLUMN last_payment_date TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'next_billing_date'
  ) THEN
    ALTER TABLE contractors ADD COLUMN next_billing_date TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE contractors ADD COLUMN payment_method TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'subscription_cycle'
  ) THEN
    ALTER TABLE contractors ADD COLUMN subscription_cycle TEXT DEFAULT 'monthly';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE contractors ADD COLUMN subscription_status TEXT DEFAULT 'trial';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'paid_status'
  ) THEN
    ALTER TABLE contractors ADD COLUMN paid_status BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'boq_count'
  ) THEN
    ALTER TABLE contractors ADD COLUMN boq_count INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'boq_limit'
  ) THEN
    ALTER TABLE contractors ADD COLUMN boq_limit INTEGER DEFAULT 999999;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE contractors ADD COLUMN company_name TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'contact_person'
  ) THEN
    ALTER TABLE contractors ADD COLUMN contact_person TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'phone'
  ) THEN
    ALTER TABLE contractors ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'cidb_grade'
  ) THEN
    ALTER TABLE contractors ADD COLUMN cidb_grade TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE contractors ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE contractors ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Add index for organization lookups
CREATE INDEX IF NOT EXISTS idx_contractors_organization_id ON contractors(organization_id);
CREATE INDEX IF NOT EXISTS idx_contractors_subscription_tier ON contractors(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_contractors_subscription_status ON contractors(subscription_status);
CREATE INDEX IF NOT EXISTS idx_contractors_paid_status ON contractors(paid_status);
CREATE INDEX IF NOT EXISTS idx_contractors_next_billing_date ON contractors(next_billing_date);

-- 3. TEAM MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer', -- owner, admin, project_manager, viewer
  invited_by TEXT NOT NULL,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_team_member_per_org UNIQUE (email, organization_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_team_members_organization_id ON team_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON team_members(is_active);

-- 4. TEAM INVITATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer',
  invited_by TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(token);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_organization_id ON team_invitations(organization_id);

-- 5. UPDATE BILLS TABLE FOR MULTI-USER
-- =====================================================
-- Add collaboration columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bills' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE bills ADD COLUMN created_by TEXT;
    ALTER TABLE bills ADD COLUMN organization_id UUID REFERENCES organizations(id);
    ALTER TABLE bills ADD COLUMN last_modified_by TEXT;
    ALTER TABLE bills ADD COLUMN last_modified_at TIMESTAMPTZ;
    ALTER TABLE bills ADD COLUMN locked_by TEXT;
    ALTER TABLE bills ADD COLUMN locked_at TIMESTAMPTZ;
  END IF;
END $$;

-- Add indexes for BOQ collaboration
CREATE INDEX IF NOT EXISTS idx_bills_organization_id ON bills(organization_id);
CREATE INDEX IF NOT EXISTS idx_bills_created_by ON bills(created_by);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- IMPORTANT: These policies are simplified to avoid infinite recursion
-- We use contractors table as the source of truth for organization_id

-- Enable RLS on organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own organization
-- Note: PostgreSQL doesn't support IF NOT EXISTS for policies, so we drop first
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  USING (
    owner_email = current_setting('request.jwt.claims', true)::json->>'email'
  );

-- Enable RLS on team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policy: Team members can see their team
-- FIXED: Avoid self-reference to prevent infinite recursion
DROP POLICY IF EXISTS "Users can view their team members" ON team_members;
CREATE POLICY "Users can view their team members"
  ON team_members FOR SELECT
  USING (
    -- User can see members of their own organization (via contractors table)
    organization_id IN (
      SELECT organization_id FROM contractors
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
    -- Or if they're the owner
    OR organization_id IN (
      SELECT id FROM organizations
      WHERE owner_email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Enable RLS on bills
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their organization's BOQs
-- FIXED: Use contractors table to avoid recursion through team_members
DROP POLICY IF EXISTS "Users can view organization BOQs" ON bills;
CREATE POLICY "Users can view organization BOQs"
  ON bills FOR SELECT
  USING (
    -- User can see BOQs from their organization (via contractors table)
    organization_id IN (
      SELECT organization_id FROM contractors
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
    -- Or if they're the owner
    OR organization_id IN (
      SELECT id FROM organizations
      WHERE owner_email = current_setting('request.jwt.claims', true)::json->>'email'
    )
    -- Or if they created it
    OR created_by = current_setting('request.jwt.claims', true)::json->>'email'
  );

-- Policy: Users can INSERT bills into their organization
DROP POLICY IF EXISTS "Users can create organization BOQs" ON bills;
CREATE POLICY "Users can create organization BOQs"
  ON bills FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM contractors
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
    OR organization_id IN (
      SELECT id FROM organizations
      WHERE owner_email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Policy: Users can UPDATE their organization's bills
DROP POLICY IF EXISTS "Users can update organization BOQs" ON bills;
CREATE POLICY "Users can update organization BOQs"
  ON bills FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM contractors
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
    OR created_by = current_setting('request.jwt.claims', true)::json->>'email'
  );

-- Policy: Users can DELETE their organization's bills
DROP POLICY IF EXISTS "Users can delete organization BOQs" ON bills;
CREATE POLICY "Users can delete organization BOQs"
  ON bills FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM contractors
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
    OR created_by = current_setting('request.jwt.claims', true)::json->>'email'
  );

-- 7. HELPER FUNCTIONS
-- =====================================================

-- Function to get max users for a tier
CREATE OR REPLACE FUNCTION get_max_users_for_tier(tier TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE tier
    WHEN 'free' THEN 1
    WHEN 'professional' THEN 1
    WHEN 'enterprise' THEN 5
    WHEN 'custom' THEN 999
    ELSE 1
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to update organization max_users when tier changes
CREATE OR REPLACE FUNCTION update_organization_max_users()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier THEN
    UPDATE organizations
    SET 
      max_users = get_max_users_for_tier(NEW.subscription_tier),
      subscription_tier = NEW.subscription_tier,
      updated_at = NOW()
    WHERE id = NEW.organization_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update organization when contractor tier changes
DROP TRIGGER IF EXISTS contractor_tier_change ON contractors;
CREATE TRIGGER contractor_tier_change
  AFTER UPDATE ON contractors
  FOR EACH ROW
  WHEN (NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier)
  EXECUTE FUNCTION update_organization_max_users();

-- 8. SEED DATA (OPTIONAL - for testing)
-- =====================================================
-- This creates a default organization for existing contractors

-- Comment out for production, uncomment for testing:
/*
INSERT INTO organizations (name, owner_email, subscription_tier, max_users)
SELECT 
  COALESCE(company_name, email) as name,
  email as owner_email,
  subscription_tier,
  get_max_users_for_tier(subscription_tier) as max_users
FROM contractors
WHERE organization_id IS NULL
ON CONFLICT DO NOTHING;

-- Link contractors to their organizations
UPDATE contractors c
SET organization_id = o.id
FROM organizations o
WHERE c.email = o.owner_email
  AND c.organization_id IS NULL;
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the schema was created correctly:

-- Check tables exist:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('organizations', 'team_members', 'team_invitations')
ORDER BY table_name;

-- Check RLS policies:
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('organizations', 'team_members', 'bills')
ORDER BY tablename, policyname;

-- Count existing data:
SELECT 
  (SELECT COUNT(*) FROM organizations) as organizations,
  (SELECT COUNT(*) FROM team_members) as team_members,
  (SELECT COUNT(*) FROM team_invitations) as invitations;