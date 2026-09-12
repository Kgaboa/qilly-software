-- POPIA Compliance: Consent Tracking Migration
-- Created: 2026-03-05
-- Purpose: Add consent fields and audit logging for POPIA compliance

-- Create consent audit log table for tracking all consent actions
CREATE TABLE IF NOT EXISTS consent_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,  -- 'privacy' or 'terms'
  consent_given BOOLEAN NOT NULL,
  policy_version TEXT NOT NULL DEFAULT '1.0',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_consent_audit_user_id ON consent_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_audit_created_at ON consent_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_consent_audit_type ON consent_audit_log(consent_type);

-- Add RLS policies for consent_audit_log
ALTER TABLE consent_audit_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own consent history
CREATE POLICY "Users can view their own consent history"
ON consent_audit_log
FOR SELECT
USING (auth.uid() = user_id);

-- System can insert consent records (anyone can log consent during signup)
CREATE POLICY "System can insert consent records"
ON consent_audit_log
FOR INSERT
WITH CHECK (true);

-- Admins can view all consent records
CREATE POLICY "Admins can view all consent records"
ON consent_audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'admin@qilly.co.za'
  )
);

-- Add POPIA consent fields to contractors table
ALTER TABLE contractors
ADD COLUMN IF NOT EXISTS popia_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS popia_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS popia_consent_version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS terms_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS terms_consent_version TEXT DEFAULT '1.0';

-- Add POPIA consent fields to suppliers table
ALTER TABLE suppliers
ADD COLUMN IF NOT EXISTS popia_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS popia_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS popia_consent_version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS terms_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS terms_consent_version TEXT DEFAULT '1.0';

-- Create function to get latest consent status for a user
CREATE OR REPLACE FUNCTION get_user_consent_status(user_uuid UUID)
RETURNS TABLE (
  privacy_consent BOOLEAN,
  privacy_consent_date TIMESTAMPTZ,
  terms_consent BOOLEAN,
  terms_consent_date TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    MAX(CASE WHEN consent_type = 'privacy' AND consent_given = true THEN true ELSE false END) as privacy_consent,
    MAX(CASE WHEN consent_type = 'privacy' THEN created_at END) as privacy_consent_date,
    MAX(CASE WHEN consent_type = 'terms' AND consent_given = true THEN true ELSE false END) as terms_consent,
    MAX(CASE WHEN consent_type = 'terms' THEN created_at END) as terms_consent_date
  FROM consent_audit_log
  WHERE user_id = user_uuid
  GROUP BY user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_user_consent_status(UUID) TO authenticated;

-- Comment on table and columns for documentation
COMMENT ON TABLE consent_audit_log IS 'POPIA compliance: Tracks all user consent actions for privacy policy and terms of service';
COMMENT ON COLUMN consent_audit_log.user_id IS 'Reference to auth.users table';
COMMENT ON COLUMN consent_audit_log.consent_type IS 'Type of consent: privacy or terms';
COMMENT ON COLUMN consent_audit_log.consent_given IS 'Whether consent was given (true) or withdrawn (false)';
COMMENT ON COLUMN consent_audit_log.policy_version IS 'Version of the policy at time of consent (e.g., 1.0, 1.1)';
COMMENT ON COLUMN consent_audit_log.ip_address IS 'IP address of user at time of consent (optional, for audit trail)';
COMMENT ON COLUMN consent_audit_log.user_agent IS 'Browser user agent at time of consent (optional, for audit trail)';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ POPIA consent tracking tables and policies created successfully';
  RAISE NOTICE '✅ Contractors and suppliers tables updated with consent fields';
  RAISE NOTICE '✅ RLS policies enabled for data protection';
END $$;
