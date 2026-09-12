-- Qilly Labor Rates Table - Emergency Schema
-- Run this in Supabase SQL Editor NOW

-- Create labor_rates table
CREATE TABLE IF NOT EXISTS labor_rates (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  description_normalized TEXT,
  unit VARCHAR(10) NOT NULL,
  trade_category VARCHAR(50),
  
  -- BuildAid composite rate (includes material + labor + equipment)
  composite_rate DECIMAL(10, 2),
  
  -- Extracted labor component
  labor_rate DECIMAL(10, 2),
  labor_percentage DECIMAL(5, 2), -- e.g., 0.42 for 42%
  
  -- Optional components (for reference)
  material_rate DECIMAL(10, 2),
  equipment_rate DECIMAL(10, 2),
  
  -- Metadata
  source VARCHAR(100) DEFAULT 'BuildAid 2025/2026',
  page_reference VARCHAR(50), -- e.g., "p.156"
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_item UNIQUE (description_normalized, unit)
);

-- Create indexes for fast lookup
CREATE INDEX idx_labor_description ON labor_rates USING GIN (to_tsvector('english', description));
CREATE INDEX idx_labor_normalized ON labor_rates (description_normalized);
CREATE INDEX idx_labor_trade ON labor_rates (trade_category);
CREATE INDEX idx_labor_unit ON labor_rates (unit);

-- Enable full-text search extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_labor_trgm ON labor_rates USING GIN (description_normalized gin_trgm_ops);

-- Function: Fuzzy match BOQ item to labor rate
CREATE OR REPLACE FUNCTION match_labor_rate(
  search_description TEXT,
  search_unit VARCHAR(10),
  threshold REAL DEFAULT 0.3
)
RETURNS TABLE (
  id INTEGER,
  description TEXT,
  unit VARCHAR(10),
  labor_rate DECIMAL(10,2),
  composite_rate DECIMAL(10,2),
  similarity_score REAL,
  trade_category VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lr.id,
    lr.description,
    lr.unit,
    lr.labor_rate,
    lr.composite_rate,
    similarity(lr.description_normalized, LOWER(search_description)) AS sim_score,
    lr.trade_category
  FROM labor_rates lr
  WHERE 
    lr.unit = search_unit
    AND similarity(lr.description_normalized, LOWER(search_description)) > threshold
  ORDER BY sim_score DESC
  LIMIT 5;
END;
$$;

-- Test data (5 sample rates to verify it works)
INSERT INTO labor_rates (
  description, 
  description_normalized, 
  unit, 
  trade_category, 
  composite_rate, 
  labor_percentage,
  labor_rate,
  source
) VALUES
  ('Excavation in soft soil, manual', 'excavation soft soil manual', 'm³', 'earthworks', 245.00, 0.80, 196.00, 'BuildAid 2025/2026'),
  ('Face brickwork 220mm common brick', 'face brickwork 220mm common brick', 'm²', 'brickwork', 680.00, 0.42, 285.60, 'BuildAid 2025/2026'),
  ('Concrete 25MPa foundations', 'concrete 25mpa foundations', 'm³', 'concrete', 1200.00, 0.18, 216.00, 'BuildAid 2025/2026'),
  ('Roof sheeting IBR corrugated', 'roof sheeting ibr corrugated', 'm²', 'roofing', 138.00, 0.35, 48.30, 'BuildAid 2025/2026'),
  ('Painting acrylic PVA walls 2-coat', 'painting acrylic pva walls 2 coat', 'm²', 'finishes', 55.00, 0.65, 35.75, 'BuildAid 2025/2026');

-- Verify
SELECT * FROM labor_rates;

-- Test fuzzy matching
SELECT * FROM match_labor_rate('brickwork 220mm', 'm²', 0.3);

-- Should return the brickwork rate with high similarity score
