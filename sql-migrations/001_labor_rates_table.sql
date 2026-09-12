-- ================================================================
-- QILLY LABOR RATES TABLE MIGRATION
-- ================================================================
-- Run this script in BOTH databases:
-- 1. Development: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
-- 2. SIT: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/sql/new
-- ================================================================

-- Drop existing table if exists (careful in production!)
DROP TABLE IF EXISTS labor_rates CASCADE;

-- Create labor_rates table
CREATE TABLE labor_rates (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  base_rate DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  skill_level VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_labor_rates_code ON labor_rates(code);
CREATE INDEX idx_labor_rates_category ON labor_rates(category);
CREATE INDEX idx_labor_rates_skill_level ON labor_rates(skill_level);

-- Enable Row Level Security (RLS)
ALTER TABLE labor_rates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to authenticated users
CREATE POLICY "Allow read access to labor rates" 
ON labor_rates FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow insert/update/delete for service role only
CREATE POLICY "Allow full access to service role" 
ON labor_rates FOR ALL 
TO service_role 
USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_labor_rates_updated_at 
BEFORE UPDATE ON labor_rates 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- SEED DATA - 39 Labor Rates (BuildAid 2025/2026 Standards)
-- ================================================================

INSERT INTO labor_rates (code, description, category, base_rate, unit, skill_level, metadata) VALUES
-- EARTHWORKS LABOR
('LAB_EXCAVATOR_OPS', 'Excavator Operator - Earthworks', 'EARTHWORKS', 450.00, 'hour', 'skilled', '{"equipment_required": true, "certification": "required"}'),
('LAB_EARTHWORKS_GEN', 'General Earthworks Laborer', 'EARTHWORKS', 180.00, 'hour', 'unskilled', '{"supervision_required": true}'),
('LAB_DOZER_OPS', 'Bulldozer Operator', 'EARTHWORKS', 420.00, 'hour', 'skilled', '{"equipment_required": true, "certification": "required"}'),
('LAB_GRADER_OPS', 'Grader Operator', 'EARTHWORKS', 400.00, 'hour', 'skilled', '{"equipment_required": true}'),
('LAB_COMPACTION_OPS', 'Compaction Equipment Operator', 'EARTHWORKS', 350.00, 'hour', 'semi_skilled', '{"equipment_required": true}'),

-- CONCRETE LABOR
('LAB_CONCRETE_FINISHER', 'Concrete Finisher', 'CONCRETE', 320.00, 'hour', 'skilled', '{"trade": "concrete", "years_experience": 3}'),
('LAB_CONCRETE_PLACER', 'Concrete Placer', 'CONCRETE', 280.00, 'hour', 'semi_skilled', '{"trade": "concrete"}'),
('LAB_FORMWORK_CARP', 'Formwork Carpenter', 'CONCRETE', 350.00, 'hour', 'skilled', '{"trade": "carpentry", "specialization": "formwork"}'),
('LAB_STEEL_FIXER', 'Steel Fixer/Reinforcement', 'CONCRETE', 340.00, 'hour', 'skilled', '{"trade": "steel_fixing", "certification": "preferred"}'),
('LAB_CONCRETE_PUMP_OPS', 'Concrete Pump Operator', 'CONCRETE', 380.00, 'hour', 'skilled', '{"equipment_required": true, "certification": "required"}'),
('LAB_CONCRETE_GEN', 'General Concrete Laborer', 'CONCRETE', 200.00, 'hour', 'unskilled', '{"supervision_required": true}'),

-- MASONRY LABOR
('LAB_BRICKLAYER', 'Bricklayer', 'MASONRY', 330.00, 'hour', 'skilled', '{"trade": "masonry", "years_experience": 2}'),
('LAB_BLOCKLAYER', 'Blocklayer', 'MASONRY', 310.00, 'hour', 'skilled', '{"trade": "masonry"}'),
('LAB_MASONRY_HELPER', 'Masonry Helper/Laborer', 'MASONRY', 190.00, 'hour', 'unskilled', '{"supervision_required": true}'),
('LAB_STONEMASON', 'Stonemason', 'MASONRY', 380.00, 'hour', 'skilled', '{"trade": "stonemasonry", "specialization": true}'),
('LAB_PLASTERER', 'Plasterer', 'MASONRY', 320.00, 'hour', 'skilled', '{"trade": "plastering"}'),

-- PLUMBING LABOR
('LAB_PLUMBER_MASTER', 'Master Plumber', 'PLUMBING', 450.00, 'hour', 'skilled', '{"certification": "required", "license": "required"}'),
('LAB_PLUMBER_JOURNEY', 'Journeyman Plumber', 'PLUMBING', 360.00, 'hour', 'skilled', '{"certification": "preferred"}'),
('LAB_PLUMBER_HELPER', 'Plumber Helper', 'PLUMBING', 220.00, 'hour', 'semi_skilled', '{"supervision_required": true}'),
('LAB_PIPEFITTER', 'Pipefitter', 'PLUMBING', 370.00, 'hour', 'skilled', '{"trade": "pipefitting"}'),

-- ELECTRICAL LABOR
('LAB_ELECTRICIAN_MASTER', 'Master Electrician', 'ELECTRICAL', 480.00, 'hour', 'skilled', '{"certification": "required", "license": "required"}'),
('LAB_ELECTRICIAN_JOURNEY', 'Journeyman Electrician', 'ELECTRICAL', 380.00, 'hour', 'skilled', '{"certification": "required"}'),
('LAB_ELECTRICIAN_HELPER', 'Electrician Helper', 'ELECTRICAL', 230.00, 'hour', 'semi_skilled', '{"supervision_required": true}'),
('LAB_CABLE_INSTALLER', 'Cable Installer/Technician', 'ELECTRICAL', 290.00, 'hour', 'semi_skilled', '{"specialization": "low_voltage"}'),

-- CARPENTRY LABOR
('LAB_CARPENTER_FINISH', 'Finish Carpenter', 'CARPENTRY', 360.00, 'hour', 'skilled', '{"trade": "carpentry", "specialization": "finishing"}'),
('LAB_CARPENTER_ROUGH', 'Rough Carpenter', 'CARPENTRY', 330.00, 'hour', 'skilled', '{"trade": "carpentry"}'),
('LAB_CARPENTER_HELPER', 'Carpenter Helper', 'CARPENTRY', 210.00, 'hour', 'semi_skilled', '{"supervision_required": true}'),
('LAB_JOINER', 'Joiner', 'CARPENTRY', 350.00, 'hour', 'skilled', '{"trade": "joinery"}'),

-- ROOFING LABOR
('LAB_ROOFER_SKILLED', 'Skilled Roofer', 'ROOFING', 340.00, 'hour', 'skilled', '{"trade": "roofing", "safety_training": "required"}'),
('LAB_ROOFER_HELPER', 'Roofer Helper', 'ROOFING', 200.00, 'hour', 'semi_skilled', '{"safety_training": "required"}'),
('LAB_WATERPROOFER', 'Waterproofing Specialist', 'ROOFING', 360.00, 'hour', 'skilled', '{"specialization": "waterproofing"}'),

-- PAINTING & FINISHING
('LAB_PAINTER_SKILLED', 'Skilled Painter', 'PAINTING', 300.00, 'hour', 'skilled', '{"trade": "painting"}'),
('LAB_PAINTER_HELPER', 'Painter Helper', 'PAINTING', 180.00, 'hour', 'unskilled', '{"supervision_required": true}'),

-- GENERAL & SITE MANAGEMENT
('LAB_SITE_SUPERVISOR', 'Site Supervisor', 'MANAGEMENT', 550.00, 'hour', 'skilled', '{"management": true, "years_experience": 5}'),
('LAB_FOREMAN', 'Foreman', 'MANAGEMENT', 480.00, 'hour', 'skilled', '{"management": true, "years_experience": 3}'),
('LAB_GENERAL_LABORER', 'General Laborer', 'GENERAL', 165.00, 'hour', 'unskilled', '{"supervision_required": true}'),
('LAB_SITE_CLEANER', 'Site Cleaner', 'GENERAL', 150.00, 'hour', 'unskilled', '{"supervision_required": false}'),

-- SPECIALIZED EQUIPMENT
('LAB_CRANE_OPS', 'Crane Operator', 'EQUIPMENT', 520.00, 'hour', 'skilled', '{"equipment_required": true, "certification": "required", "license": "required"}'),
('LAB_TLB_OPS', 'TLB Operator', 'EQUIPMENT', 400.00, 'hour', 'skilled', '{"equipment_required": true, "certification": "required"}'),
('LAB_ROLLER_OPS', 'Roller Operator', 'EQUIPMENT', 360.00, 'hour', 'skilled', '{"equipment_required": true}');

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Count total labor rates
-- Expected: 39 rows
SELECT COUNT(*) as total_labor_rates FROM labor_rates;

-- Check categories
SELECT category, COUNT(*) as rate_count 
FROM labor_rates 
GROUP BY category 
ORDER BY category;

-- Verify skill levels
SELECT skill_level, COUNT(*) as count 
FROM labor_rates 
GROUP BY skill_level 
ORDER BY skill_level;

-- Sample rates by category
SELECT category, code, description, base_rate, unit, skill_level
FROM labor_rates
ORDER BY category, base_rate DESC;

-- Check for duplicates (should return 0)
SELECT code, COUNT(*) 
FROM labor_rates 
GROUP BY code 
HAVING COUNT(*) > 1;

COMMENT ON TABLE labor_rates IS 'Labor rates database for Qilly BOQ pricing engine - BuildAid 2025/2026 standards';
