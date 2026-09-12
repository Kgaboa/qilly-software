-- ============================================================================
-- Migration: Create boq_rates table with complete labor and equipment rates
-- Date: 2026-03-04
-- Purpose: Replace hourly labor_rates with per-unit BOQ pricing rates
-- Based on: BuildAid 2025/2026 industry standards
-- ============================================================================

-- Drop existing table if it exists (for clean reinstall)
DROP TABLE IF EXISTS boq_rates;

-- Create the new boq_rates table
CREATE TABLE boq_rates (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  labor_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  equipment_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  composite_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  material_rate DECIMAL(10,2),
  labor_percentage DECIMAL(5,2),
  crew_size INTEGER,
  output_per_day DECIMAL(10,2),
  skill_level VARCHAR(50),
  province_code VARCHAR(10) DEFAULT 'ALL',
  source TEXT DEFAULT 'BuildAid 2025/2026',
  page_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast searching
CREATE INDEX idx_boq_rates_category ON boq_rates(category);
CREATE INDEX idx_boq_rates_unit ON boq_rates(unit);
CREATE INDEX idx_boq_rates_description ON boq_rates USING gin(to_tsvector('english', description));
CREATE INDEX idx_boq_rates_province ON boq_rates(province_code);

-- Enable Row Level Security (RLS)
ALTER TABLE boq_rates ENABLE ROW LEVEL Security;

-- Create policy to allow all authenticated users to read boq_rates
CREATE POLICY "Allow authenticated users to read boq_rates"
  ON boq_rates
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow service role to insert/update (for migrations)
CREATE POLICY "Allow service role full access to boq_rates"
  ON boq_rates
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- Populate with BuildAid 2025/2026 rates
-- ============================================================================

-- EARTHWORKS (Section D)
INSERT INTO boq_rates (code, description, category, unit, labor_rate, equipment_rate, composite_rate, crew_size, output_per_day, skill_level, page_reference, notes) VALUES
('lbr_001', 'Excavation soft soil manual', 'earthworks', 'm³', 196.00, 24.50, 220.50, 3, 15, 'Semi-skilled', 'Section D4.2', 'Hand excavation in soft material, depth up to 1.5m'),
('lbr_002', 'Excavation soft soil machine', 'earthworks', 'm³', 45.00, 85.00, 130.00, 2, 80, 'Skilled', 'Section D4.2', 'Machine excavation using TLB or excavator'),
('lbr_003', 'Excavation hard material manual', 'earthworks', 'm³', 294.00, 36.75, 330.75, 4, 8, 'Semi-skilled', 'Section D4.3', 'Hand excavation in hard material or clay'),
('lbr_004', 'Excavation rock', 'earthworks', 'm³', 156.00, 244.00, 400.00, 3, 12, 'Skilled', 'Section D4.4', 'Rock excavation with pneumatic equipment'),
('lbr_005', 'Backfill selected material', 'earthworks', 'm³', 74.00, 18.50, 92.50, 3, 25, 'Semi-skilled', 'Section D5.1', 'Backfilling with selected excavated material'),
('lbr_006', 'Backfill imported material', 'earthworks', 'm³', 68.00, 17.00, 85.00, 3, 30, 'Semi-skilled', 'Section D5.2', 'Backfilling with imported fill material'),
('lbr_007', 'Compact subgrade', 'earthworks', 'm²', 16.00, 12.80, 28.80, 2, 200, 'Semi-skilled', 'Section D6.1', 'Compaction of subgrade to 93% MOD AASHTO'),
('lbr_008', 'Compact fill layers', 'earthworks', 'm³', 42.00, 33.60, 75.60, 2, 60, 'Semi-skilled', 'Section D6.2', 'Compaction of fill in 150mm layers');

-- CONCRETE WORK (Section B)
INSERT INTO boq_rates (code, description, category, unit, labor_rate, equipment_rate, composite_rate, material_rate, crew_size, output_per_day, skill_level, page_reference, notes) VALUES
('lbr_009', 'Concrete 15MPa blinding', 'concrete', 'm³', 171.00, 114.00, 285.00, 850.00, 4, 20, 'Semi-skilled', 'Section B1.1', 'Blinding concrete placement and finishing'),
('lbr_010', 'Concrete 25MPa foundations', 'concrete', 'm³', 216.00, 144.00, 360.00, 1250.00, 5, 18, 'Semi-skilled', 'Section B1.3', 'Foundation concrete placement and finishing'),
('lbr_011', 'Concrete 30MPa slabs', 'concrete', 'm³', 243.00, 162.00, 405.00, 1300.00, 6, 16, 'Skilled', 'Section B1.4', 'Slab concrete placement, power floating and finishing'),
('lbr_012', 'Concrete 40MPa structural', 'concrete', 'm³', 297.00, 198.00, 495.00, 1450.00, 6, 14, 'Skilled', 'Section B1.5', 'Structural concrete for columns and beams');

-- REINFORCEMENT (Section E)
INSERT INTO boq_rates (code, description, category, unit, labor_rate, equipment_rate, composite_rate, material_rate, crew_size, output_per_day, skill_level, page_reference, notes) VALUES
('lbr_013', 'Reinforcement Y12 bars', 'reinforcement', 'kg', 9.63, 0.88, 10.51, 14.50, 3, 850, 'Skilled', 'Section E1.2', 'Cutting, bending and fixing Y12 reinforcement bars'),
('lbr_014', 'Reinforcement Y16 bars', 'reinforcement', 'kg', 10.18, 0.93, 11.11, 16.20, 3, 800, 'Skilled', 'Section E1.3', 'Cutting, bending and fixing Y16 reinforcement bars'),
('lbr_015', 'Reinforcement Y20 bars', 'reinforcement', 'kg', 10.73, 0.98, 11.71, 18.50, 4, 750, 'Skilled', 'Section E1.4', 'Cutting, bending and fixing Y20 reinforcement bars'),
('lbr_016', 'Reinforcement mesh', 'reinforcement', 'm²', 38.50, 3.50, 42.00, 65.00, 2, 150, 'Semi-skilled', 'Section E1.5', 'Laying and fixing reinforcement mesh');

-- BRICKWORK & BLOCKWORK (Section F)
INSERT INTO boq_rates (code, description, category, unit, labor_rate, equipment_rate, composite_rate, material_rate, crew_size, output_per_day, skill_level, page_reference, notes) VALUES
('lbr_017', 'Face brickwork 220mm face brick', 'brickwork', 'm²', 346.50, 66.00, 412.50, 520.00, 3, 12, 'Skilled', 'Section F1.2', 'Face brickwork in stretcher bond with mortar'),
('lbr_018', 'Commons brickwork 110mm', 'brickwork', 'm²', 224.40, 42.80, 267.20, 340.00, 3, 16, 'Semi-skilled', 'Section F1.3', 'Commons brickwork single skin with mortar'),
('lbr_019', 'Blockwork 140mm hollow', 'brickwork', 'm²', 178.20, 34.00, 212.20, 280.00, 3, 18, 'Semi-skilled', 'Section F2.1', 'Hollow concrete blockwork with mortar'),
('lbr_020', 'Blockwork 190mm solid', 'brickwork', 'm²', 198.00, 37.80, 235.80, 320.00, 3, 15, 'Semi-skilled', 'Section F2.2', 'Solid concrete blockwork with mortar');

-- ROOFING (Section G)
INSERT INTO boq_rates (code, description, category, unit, labor_rate, equipment_rate, composite_rate, material_rate, crew_size, output_per_day, skill_level, page_reference, notes) VALUES
('lbr_021', 'Roof trusses timber', 'roofing', 'm²', 126.00, 42.00, 168.00, 450.00, 4, 35, 'Skilled', 'Section G1.1', 'Installing timber roof trusses'),
('lbr_022', 'Roof tiles concrete', 'roofing', 'm²', 118.00, 29.50, 147.50, 185.00, 3, 45, 'Skilled', 'Section G2.1', 'Laying concrete roof tiles on battens'),
('lbr_023', 'Roof sheeting IBR', 'roofing', 'm²', 96.00, 24.00, 120.00, 145.00, 3, 60, 'Skilled', 'Section G2.2', 'Installing IBR roof sheeting'),
('lbr_024', 'Gutters and downpipes', 'roofing', 'm', 42.00, 10.50, 52.50, 85.00, 2, 45, 'Semi-skilled', 'Section G3.1', 'Installing gutters and downpipes');

-- WINDOWS & DOORS (Section H)
INSERT INTO boq_rates (code, description, category, unit, labor_rate, equipment_rate, composite_rate, material_rate, crew_size, output_per_day, skill_level, page_reference, notes) VALUES
('lbr_025', 'Window aluminum sliding 1200x1200', 'windows', 'nr', 740.00, 185.00, 925.00, 2450.00, 2, 6, 'Skilled', 'Section H1.1', 'Supply and install aluminum sliding window'),
('lbr_026', 'Window steel 900x900', 'windows', 'nr', 580.00, 145.00, 725.00, 1850.00, 2, 8, 'Skilled', 'Section H1.2', 'Supply and install steel window'),
('lbr_027', 'Door solid core 813x2032', 'doors', 'nr', 500.00, 125.00, 625.00, 1450.00, 2, 6, 'Skilled', 'Section H2.1', 'Supply and install solid core door with frame'),
('lbr_028', 'Door hollow core 813x2032', 'doors', 'nr', 420.00, 105.00, 525.00, 950.00, 2, 8, 'Semi-skilled', 'Section H2.2', 'Supply and install hollow core door with frame');

-- PLASTERING & FINISHES (Section J)
INSERT INTO boq_rates (code, description, category, unit, labor_rate, equipment_rate, composite_rate, material_rate, crew_size, output_per_day, skill_level, page_reference, notes) VALUES
('lbr_029', 'Plaster cement 12mm', 'plastering', 'm²', 96.00, 12.00, 108.00, 45.00, 3, 35, 'Skilled', 'Section J1.1', 'Cement plaster 12mm thick to walls'),
('lbr_030', 'Plaster ceiling 6mm', 'plastering', 'm²', 84.00, 10.50, 94.50, 38.00, 3, 40, 'Skilled', 'Section J1.2', 'Ceiling plaster 6mm thick'),
('lbr_031', 'Paint emulsion walls 2 coats', 'painting', 'm²', 42.00, 5.25, 47.25, 18.00, 2, 120, 'Semi-skilled', 'Section J2.1', 'Emulsion paint 2 coats to internal walls'),
('lbr_032', 'Paint enamel woodwork 2 coats', 'painting', 'm²', 68.00, 8.50, 76.50, 35.00, 2, 60, 'Skilled', 'Section J2.2', 'Enamel paint 2 coats to doors and windows');

-- FLOORING & TILING (Section K)
INSERT INTO boq_rates (code, description, category, unit, labor_rate, equipment_rate, composite_rate, material_rate, crew_size, output_per_day, skill_level, page_reference, notes) VALUES
('lbr_033', 'Floor screed 50mm', 'flooring', 'm²', 78.00, 19.50, 97.50, 65.00, 3, 45, 'Semi-skilled', 'Section K1.1', 'Cement screed 50mm thick to floors'),
('lbr_034', 'Floor tiles 300x300', 'tiling', 'm²', 168.00, 21.00, 189.00, 185.00, 2, 18, 'Skilled', 'Section K2.1', 'Ceramic floor tiles 300x300mm with adhesive'),
('lbr_035', 'Wall tiles 200x200', 'tiling', 'm²', 198.00, 24.75, 222.75, 165.00, 2, 15, 'Skilled', 'Section K2.2', 'Ceramic wall tiles 200x200mm with adhesive');

-- PROFESSIONAL SERVICES (Section A)
INSERT INTO boq_rates (code, description, category, unit, labor_rate, equipment_rate, composite_rate, crew_size, skill_level, page_reference, notes) VALUES
('lbr_036', 'Health and safety file', 'professional', 'sum', 5000.00, 0.00, 5000.00, 1, 'Professional', 'Section A1.5', 'Compilation and submission of health and safety file'),
('lbr_037', 'As-built drawings', 'professional', 'sum', 8500.00, 0.00, 8500.00, 1, 'Professional', 'Section A1.7', 'Preparation and submission of as-built drawings'),
('lbr_038', 'Site supervision', 'professional', 'month', 35000.00, 0.00, 35000.00, 1, 'Professional', 'Section A2.3', 'Site supervision and project management per month'),
('lbr_039', 'Quantity surveyor fees', 'professional', '%', 3.50, 0.00, 3.50, 1, 'Professional', 'Section A2.1', 'QS professional fees as percentage of contract value');

-- ============================================================================
-- Verification queries
-- ============================================================================

-- Count total rates
-- SELECT COUNT(*) as total_rates FROM boq_rates;

-- Show rates by category
-- SELECT category, COUNT(*) as count FROM boq_rates GROUP BY category ORDER BY category;

-- Show sample earthworks rates
-- SELECT code, description, unit, labor_rate, equipment_rate, composite_rate 
-- FROM boq_rates 
-- WHERE category = 'earthworks' 
-- ORDER BY code;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE boq_rates IS 'BOQ pricing rates with labor and equipment costs per unit based on BuildAid 2025/2026 standards';
COMMENT ON COLUMN boq_rates.code IS 'Unique rate code (e.g., lbr_001)';
COMMENT ON COLUMN boq_rates.description IS 'BOQ task description for matching';
COMMENT ON COLUMN boq_rates.category IS 'Trade category (earthworks, concrete, brickwork, etc.)';
COMMENT ON COLUMN boq_rates.unit IS 'BOQ unit of measurement (m³, m², nr, kg, etc.)';
COMMENT ON COLUMN boq_rates.labor_rate IS 'Labor cost per unit in ZAR';
COMMENT ON COLUMN boq_rates.equipment_rate IS 'Equipment hire cost per unit in ZAR';
COMMENT ON COLUMN boq_rates.composite_rate IS 'Total labor + equipment cost per unit in ZAR';
COMMENT ON COLUMN boq_rates.material_rate IS 'Optional material cost per unit in ZAR';
COMMENT ON COLUMN boq_rates.crew_size IS 'Number of workers in crew';
COMMENT ON COLUMN boq_rates.output_per_day IS 'Production rate (units completed per 8-hour day)';
COMMENT ON COLUMN boq_rates.province_code IS 'Province code (GP, WC, etc.) or ALL for national rates';
COMMENT ON COLUMN boq_rates.source IS 'Data source reference (BuildAid 2025/2026)';
COMMENT ON COLUMN boq_rates.page_reference IS 'BuildAid section/page reference';

-- ============================================================================
-- Success!
-- ============================================================================
-- Total rates inserted: 39
-- Categories: earthworks(8), concrete(4), reinforcement(4), brickwork(4), 
--             roofing(4), windows(2), doors(2), plastering(2), painting(2), 
--             flooring(1), tiling(2), professional(4)
-- ============================================================================
