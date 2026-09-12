/**
 * Mock Labor Rates Database
 * Based on BuildAid 2025/2026 industry standards
 * 
 * Used when Supabase labor_rates table is not available
 */

export interface MockLaborRate {
  id: string;
  category: string; // Changed from trade_category to match DB schema
  description: string;
  unit: string;
  labor_rate: number;
  equipment_rate: number;
  composite_rate: number;
  material_rate?: number;
  labor_percentage?: number;
  crew_size?: number;
  output_per_day?: number;
  skill_level?: string;
  province?: string;
  source?: string;
  page_reference?: string;
  notes?: string;
}

export const mockLaborRates: MockLaborRate[] = [
  // ============================================================================
  // EARTHWORKS (Section D)
  // ============================================================================
  {
    id: 'lbr_001',
    category: 'earthworks',
    description: 'Excavation soft soil manual',
    unit: 'm³',
    labor_rate: 196.00,
    equipment_rate: 24.50,
    composite_rate: 220.50,
    crew_size: 3,
    output_per_day: 15,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'BuildAid 2025 p.52 §D4.2',
    notes: 'Hand excavation in soft material, depth up to 1.5m'
  },
  {
    id: 'lbr_002',
    category: 'earthworks',
    description: 'Excavation soft soil machine',
    unit: 'm³',
    labor_rate: 45.00,
    equipment_rate: 85.00,
    composite_rate: 130.00,
    crew_size: 2,
    output_per_day: 80,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'BuildAid 2025 p.52 §D4.2',
    notes: 'Machine excavation using TLB or excavator'
  },
  {
    id: 'lbr_003',
    category: 'earthworks',
    description: 'Excavation hard material manual',
    unit: 'm³',
    labor_rate: 294.00,
    equipment_rate: 36.75,
    composite_rate: 330.75,
    crew_size: 4,
    output_per_day: 8,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'BuildAid 2025 p.54 §D4.3',
    notes: 'Hand excavation in hard material or clay'
  },
  {
    id: 'lbr_004',
    category: 'earthworks',
    description: 'Excavation rock',
    unit: 'm³',
    labor_rate: 156.00,
    equipment_rate: 244.00,
    composite_rate: 400.00,
    crew_size: 3,
    output_per_day: 12,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section D4.4',
    notes: 'Rock excavation with pneumatic equipment'
  },
  {
    id: 'lbr_005',
    category: 'earthworks',
    description: 'Backfill selected material',
    unit: 'm³',
    labor_rate: 74.00,
    equipment_rate: 18.50,
    composite_rate: 92.50,
    crew_size: 3,
    output_per_day: 25,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section D5.1',
    notes: 'Backfilling with selected excavated material'
  },
  {
    id: 'lbr_006',
    category: 'earthworks',
    description: 'Backfill imported material',
    unit: 'm³',
    labor_rate: 68.00,
    equipment_rate: 17.00,
    composite_rate: 85.00,
    material_rate: 120.00,
    crew_size: 3,
    output_per_day: 30,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section D5.2',
    notes: 'Backfilling with imported fill material'
  },
  {
    id: 'lbr_007',
    category: 'earthworks',
    description: 'Compact subgrade',
    unit: 'm²',
    labor_rate: 16.00,
    equipment_rate: 12.80,
    composite_rate: 28.80,
    crew_size: 2,
    output_per_day: 200,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section D6.1',
    notes: 'Compaction of subgrade to 93% MOD AASHTO'
  },
  {
    id: 'lbr_008',
    category: 'earthworks',
    description: 'Compact fill layers',
    unit: 'm³',
    labor_rate: 42.00,
    equipment_rate: 33.60,
    composite_rate: 75.60,
    crew_size: 2,
    output_per_day: 60,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section D6.2',
    notes: 'Compaction of fill in 150mm layers'
  },

  // ============================================================================
  // CONCRETE WORK (Section B)
  // ============================================================================
  {
    id: 'lbr_009',
    category: 'concrete',
    description: 'Concrete 15MPa blinding',
    unit: 'm³',
    labor_rate: 171.00,
    equipment_rate: 114.00,
    composite_rate: 285.00,
    material_rate: 850.00,
    crew_size: 4,
    output_per_day: 20,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section B1.1',
    notes: 'Blinding concrete placement and finishing'
  },
  {
    id: 'lbr_010',
    category: 'concrete',
    description: 'Concrete 25MPa foundations',
    unit: 'm³',
    labor_rate: 216.00,
    equipment_rate: 144.00,
    composite_rate: 360.00,
    material_rate: 1250.00,
    crew_size: 5,
    output_per_day: 18,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section B1.3',
    notes: 'Foundation concrete placement and finishing'
  },
  {
    id: 'lbr_011',
    category: 'concrete',
    description: 'Concrete 30MPa slabs',
    unit: 'm³',
    labor_rate: 243.00,
    equipment_rate: 162.00,
    composite_rate: 405.00,
    material_rate: 1300.00,
    crew_size: 6,
    output_per_day: 16,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section B1.4',
    notes: 'Slab concrete placement, power floating and finishing'
  },
  {
    id: 'lbr_012',
    category: 'concrete',
    description: 'Concrete 40MPa structural',
    unit: 'm³',
    labor_rate: 297.00,
    equipment_rate: 198.00,
    composite_rate: 495.00,
    material_rate: 1450.00,
    crew_size: 6,
    output_per_day: 14,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section B1.5',
    notes: 'Structural concrete for columns and beams'
  },

  // ============================================================================
  // REINFORCEMENT (Section E)
  // ============================================================================
  {
    id: 'lbr_013',
    category: 'reinforcement',
    description: 'Reinforcement Y12 bars',
    unit: 'kg',
    labor_rate: 9.63,
    equipment_rate: 0.88,
    composite_rate: 10.51,
    material_rate: 14.50,
    crew_size: 3,
    output_per_day: 850,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section E1.2',
    notes: 'Cutting, bending and fixing Y12 reinforcement bars'
  },
  {
    id: 'lbr_014',
    category: 'reinforcement',
    description: 'Reinforcement Y16 bars',
    unit: 'kg',
    labor_rate: 10.18,
    equipment_rate: 0.93,
    composite_rate: 11.11,
    material_rate: 16.20,
    crew_size: 3,
    output_per_day: 800,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section E1.3',
    notes: 'Cutting, bending and fixing Y16 reinforcement bars'
  },
  {
    id: 'lbr_015',
    category: 'reinforcement',
    description: 'Reinforcement Y20 bars',
    unit: 'kg',
    labor_rate: 10.73,
    equipment_rate: 0.98,
    composite_rate: 11.71,
    material_rate: 18.50,
    crew_size: 4,
    output_per_day: 750,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section E1.4',
    notes: 'Cutting, bending and fixing Y20 reinforcement bars'
  },
  {
    id: 'lbr_016',
    category: 'reinforcement',
    description: 'Reinforcement mesh',
    unit: 'm²',
    labor_rate: 38.50,
    equipment_rate: 3.50,
    composite_rate: 42.00,
    material_rate: 65.00,
    crew_size: 2,
    output_per_day: 150,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section E1.5',
    notes: 'Laying and fixing reinforcement mesh'
  },

  // ============================================================================
  // BRICKWORK & BLOCKWORK (Section F)
  // ============================================================================
  {
    id: 'lbr_017',
    category: 'brickwork',
    description: 'Face brickwork 220mm face brick',
    unit: 'm²',
    labor_rate: 346.50,
    equipment_rate: 66.00,
    composite_rate: 412.50,
    material_rate: 520.00,
    crew_size: 3,
    output_per_day: 12,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section F1.2',
    notes: 'Face brickwork in stretcher bond with mortar'
  },
  {
    id: 'lbr_018',
    category: 'brickwork',
    description: 'Commons brickwork 110mm',
    unit: 'm²',
    labor_rate: 224.40,
    equipment_rate: 42.80,
    composite_rate: 267.20,
    material_rate: 340.00,
    crew_size: 3,
    output_per_day: 16,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section F1.3',
    notes: 'Commons brickwork single skin with mortar'
  },
  {
    id: 'lbr_019',
    category: 'brickwork',
    description: 'Blockwork 140mm hollow',
    unit: 'm²',
    labor_rate: 178.20,
    equipment_rate: 34.00,
    composite_rate: 212.20,
    material_rate: 280.00,
    crew_size: 3,
    output_per_day: 18,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section F2.1',
    notes: 'Hollow concrete blockwork with mortar'
  },
  {
    id: 'lbr_020',
    category: 'brickwork',
    description: 'Blockwork 190mm solid',
    unit: 'm²',
    labor_rate: 198.00,
    equipment_rate: 37.80,
    composite_rate: 235.80,
    material_rate: 320.00,
    crew_size: 3,
    output_per_day: 15,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section F2.2',
    notes: 'Solid concrete blockwork with mortar'
  },

  // ============================================================================
  // ROOFING (Section G)
  // ============================================================================
  {
    id: 'lbr_021',
    category: 'roofing',
    description: 'Roof trusses timber',
    unit: 'm²',
    labor_rate: 126.00,
    equipment_rate: 42.00,
    composite_rate: 168.00,
    material_rate: 450.00,
    crew_size: 4,
    output_per_day: 35,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section G1.1',
    notes: 'Installing timber roof trusses'
  },
  {
    id: 'lbr_022',
    category: 'roofing',
    description: 'Roof tiles concrete',
    unit: 'm²',
    labor_rate: 118.00,
    equipment_rate: 29.50,
    composite_rate: 147.50,
    material_rate: 185.00,
    crew_size: 3,
    output_per_day: 45,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section G2.1',
    notes: 'Laying concrete roof tiles on battens'
  },
  {
    id: 'lbr_023',
    category: 'roofing',
    description: 'Roof sheeting IBR',
    unit: 'm²',
    labor_rate: 96.00,
    equipment_rate: 24.00,
    composite_rate: 120.00,
    material_rate: 145.00,
    crew_size: 3,
    output_per_day: 60,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section G2.2',
    notes: 'Installing IBR roof sheeting'
  },
  {
    id: 'lbr_024',
    category: 'roofing',
    description: 'Gutters and downpipes',
    unit: 'm',
    labor_rate: 42.00,
    equipment_rate: 10.50,
    composite_rate: 52.50,
    material_rate: 85.00,
    crew_size: 2,
    output_per_day: 45,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section G3.1',
    notes: 'Installing gutters and downpipes'
  },

  // ============================================================================
  // WINDOWS & DOORS (Section H)
  // ============================================================================
  {
    id: 'lbr_025',
    category: 'windows',
    description: 'Window aluminum sliding 1200x1200',
    unit: 'nr',
    labor_rate: 740.00,
    equipment_rate: 185.00,
    composite_rate: 925.00,
    material_rate: 2450.00,
    crew_size: 2,
    output_per_day: 6,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section H1.1',
    notes: 'Supply and install aluminum sliding window'
  },
  {
    id: 'lbr_026',
    category: 'windows',
    description: 'Window steel 900x900',
    unit: 'nr',
    labor_rate: 580.00,
    equipment_rate: 145.00,
    composite_rate: 725.00,
    material_rate: 1850.00,
    crew_size: 2,
    output_per_day: 8,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section H1.2',
    notes: 'Supply and install steel window'
  },
  {
    id: 'lbr_027',
    category: 'doors',
    description: 'Door solid core 813x2032',
    unit: 'nr',
    labor_rate: 500.00,
    equipment_rate: 125.00,
    composite_rate: 625.00,
    material_rate: 1450.00,
    crew_size: 2,
    output_per_day: 6,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section H2.1',
    notes: 'Supply and install solid core door with frame'
  },
  {
    id: 'lbr_028',
    category: 'doors',
    description: 'Door hollow core 813x2032',
    unit: 'nr',
    labor_rate: 420.00,
    equipment_rate: 105.00,
    composite_rate: 525.00,
    material_rate: 950.00,
    crew_size: 2,
    output_per_day: 8,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section H2.2',
    notes: 'Supply and install hollow core door with frame'
  },

  // ============================================================================
  // PLASTERING & FINISHES (Section J)
  // ============================================================================
  {
    id: 'lbr_029',
    category: 'plastering',
    description: 'Plaster cement 12mm',
    unit: 'm²',
    labor_rate: 96.00,
    equipment_rate: 12.00,
    composite_rate: 108.00,
    material_rate: 45.00,
    crew_size: 3,
    output_per_day: 35,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section J1.1',
    notes: 'Cement plaster 12mm thick to walls'
  },
  {
    id: 'lbr_030',
    category: 'plastering',
    description: 'Plaster ceiling 6mm',
    unit: 'm²',
    labor_rate: 84.00,
    equipment_rate: 10.50,
    composite_rate: 94.50,
    material_rate: 38.00,
    crew_size: 3,
    output_per_day: 40,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section J1.2',
    notes: 'Ceiling plaster 6mm thick'
  },
  {
    id: 'lbr_031',
    category: 'painting',
    description: 'Paint emulsion walls 2 coats',
    unit: 'm²',
    labor_rate: 42.00,
    equipment_rate: 5.25,
    composite_rate: 47.25,
    material_rate: 18.00,
    crew_size: 2,
    output_per_day: 120,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section J2.1',
    notes: 'Emulsion paint 2 coats to internal walls'
  },
  {
    id: 'lbr_032',
    category: 'painting',
    description: 'Paint enamel woodwork 2 coats',
    unit: 'm²',
    labor_rate: 68.00,
    equipment_rate: 8.50,
    composite_rate: 76.50,
    material_rate: 35.00,
    crew_size: 2,
    output_per_day: 60,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section J2.2',
    notes: 'Enamel paint 2 coats to doors and windows'
  },

  // ============================================================================
  // FLOORING & TILING (Section K)
  // ============================================================================
  {
    id: 'lbr_033',
    category: 'flooring',
    description: 'Floor screed 50mm',
    unit: 'm²',
    labor_rate: 78.00,
    equipment_rate: 19.50,
    composite_rate: 97.50,
    material_rate: 65.00,
    crew_size: 3,
    output_per_day: 45,
    skill_level: 'Semi-skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section K1.1',
    notes: 'Cement screed 50mm thick to floors'
  },
  {
    id: 'lbr_034',
    category: 'tiling',
    description: 'Floor tiles 300x300',
    unit: 'm²',
    labor_rate: 168.00,
    equipment_rate: 21.00,
    composite_rate: 189.00,
    material_rate: 185.00,
    crew_size: 2,
    output_per_day: 18,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section K2.1',
    notes: 'Ceramic floor tiles 300x300mm with adhesive'
  },
  {
    id: 'lbr_035',
    category: 'tiling',
    description: 'Wall tiles 200x200',
    unit: 'm²',
    labor_rate: 198.00,
    equipment_rate: 24.75,
    composite_rate: 222.75,
    material_rate: 165.00,
    crew_size: 2,
    output_per_day: 15,
    skill_level: 'Skilled',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section K2.2',
    notes: 'Ceramic wall tiles 200x200mm with adhesive'
  },

  // ============================================================================
  // P&G PROFESSIONAL SERVICES (Section A)
  // ============================================================================
  {
    id: 'lbr_036',
    category: 'professional',
    description: 'Health and safety file',
    unit: 'sum',
    labor_rate: 5000.00,
    equipment_rate: 0.00,
    composite_rate: 5000.00,
    crew_size: 1,
    skill_level: 'Professional',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section A1.5',
    notes: 'Compilation and submission of health and safety file'
  },
  {
    id: 'lbr_037',
    category: 'professional',
    description: 'As-built drawings',
    unit: 'sum',
    labor_rate: 8500.00,
    equipment_rate: 0.00,
    composite_rate: 8500.00,
    crew_size: 1,
    skill_level: 'Professional',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section A1.7',
    notes: 'Preparation and submission of as-built drawings'
  },
  {
    id: 'lbr_038',
    category: 'professional',
    description: 'Site supervision',
    unit: 'month',
    labor_rate: 35000.00,
    equipment_rate: 0.00,
    composite_rate: 35000.00,
    crew_size: 1,
    skill_level: 'Professional',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section A2.3',
    notes: 'Site supervision and project management per month'
  },
  {
    id: 'lbr_039',
    category: 'professional',
    description: 'Quantity surveyor fees',
    unit: '%',
    labor_rate: 3.50,
    equipment_rate: 0.00,
    composite_rate: 3.50,
    crew_size: 1,
    skill_level: 'Professional',
    source: 'BuildAid 2025/2026',
    page_reference: 'Section A2.1',
    notes: 'QS professional fees as percentage of contract value'
  },
];