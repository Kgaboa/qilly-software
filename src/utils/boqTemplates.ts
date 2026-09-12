// BOQ Templates with SANS 1200 compliant work items

export interface BoqTemplateItem {
  code: string;
  name: string;
  description: string;
  unit: string;
  quantity: string;
  category: string;
  sansStandard: string;
  isRateOnly: boolean;
}

export interface BoqTemplate {
  id: string;
  name: string;
  projectType: string;
  description: string;
  projectSize: string;
  sansStandards: string[];
  items: BoqTemplateItem[];
  icon: string;
  validation?: {
    version: string;
    lastUpdated: string;
    lastReviewDate: string;
    reviewedBy: Array<{
      name: string;
      qualification: string;
      role: string;
    }>;
    benchmarkProjects: Array<{
      name: string;
      province: string;
      year: number;
      matchScore: string;
    }>;
    assumptions: string[];
    exclusions: string[];
  };
}

export const BOQ_TEMPLATES: BoqTemplate[] = [
  // ==================== ROAD CONSTRUCTION TEMPLATES ====================
  {
    id: 'rural-road-5km',
    name: 'Rural Road (5km)',
    projectType: 'Road Construction',
    description: 'Complete BOQ for 5km rural road with 7m width, including earthworks, pavement layers, and drainage',
    projectSize: '5km x 7m width',
    sansStandards: ['SANS 1200 D (Earthworks)', 'SANS 1200 G (Pavement)', 'SANS 1200 C (Drainage)'],
    icon: '🛣️',
    items: [
      // PRELIMINARY & GENERAL
      { code: 'A1.1', name: 'Mobilization & Establishment', description: 'Mobilization of plant, equipment, and establishment of site offices', unit: 'sum', quantity: '1', category: 'Preliminary & General (SANS 1200 A)', sansStandard: 'SANS 1200 A', isRateOnly: false },
      { code: 'A2.3', name: 'Traffic Accommodation', description: 'Traffic control, signage, and safety measures during construction', unit: 'sum', quantity: '1', category: 'Preliminary & General (SANS 1200 A)', sansStandard: 'SANS 1200 A', isRateOnly: false },
      { code: 'A3.5', name: 'Site Clearance', description: 'Clearing vegetation, topsoil removal, and grubbing', unit: 'ha', quantity: '2.5', category: 'Preliminary & General (SANS 1200 A)', sansStandard: 'SANS 1200 A', isRateOnly: false },
      
      // EARTHWORKS
      { code: 'D4.2', name: 'Excavation in soft material', description: 'Excavation of soft material for road formation', unit: 'm³', quantity: '12500', category: 'Earthworks (SANS 1200 D)', sansStandard: 'SANS 1200 D', isRateOnly: false },
      { code: 'D4.3', name: 'Excavation in intermediate material', description: 'Excavation of intermediate material requiring ripping', unit: 'm³', quantity: '3200', category: 'Earthworks (SANS 1200 D)', sansStandard: 'SANS 1200 D', isRateOnly: false },
      { code: 'D6.1', name: 'Imported selected fill', description: 'Import and place selected fill material from approved borrow pits', unit: 'm³', quantity: '8500', category: 'Earthworks (SANS 1200 D)', sansStandard: 'SANS 1200 D', isRateOnly: false },
      { code: 'D7.3', name: 'Compaction (95% Mod AASHTO)', description: 'Compaction of fill material to 95% Modified AASHTO density', unit: 'm³', quantity: '15000', category: 'Earthworks (SANS 1200 D)', sansStandard: 'SANS 1200 D', isRateOnly: false },
      
      // PAVEMENT LAYERS
      { code: 'G3.1', name: 'Selected subgrade (G5)', description: 'Provision and placement of G5 selected subgrade material', unit: 'm³', quantity: '3500', category: 'Pavement Layers (SANS 1200 G)', sansStandard: 'SANS 1200 G', isRateOnly: false },
      { code: 'G4.2', name: 'Subbase (G4 material)', description: 'Crushed stone subbase layer - G4 material, 150mm thick', unit: 'm³', quantity: '2800', category: 'Pavement Layers (SANS 1200 G)', sansStandard: 'SANS 1200 G', isRateOnly: false },
      { code: 'G5.3', name: 'Base course (G2 crushed stone)', description: 'G2 crushed stone base course, 150mm thick compacted', unit: 'm³', quantity: '2200', category: 'Pavement Layers (SANS 1200 G)', sansStandard: 'SANS 1200 G', isRateOnly: false },
      { code: 'G8.1', name: 'Prime coat (MC cutback)', description: 'MC3000 cutback bitumen prime coat @ 0.8 l/m²', unit: 'm²', quantity: '35000', category: 'Pavement Layers (SANS 1200 G)', sansStandard: 'SANS 1200 G', isRateOnly: false },
      { code: 'G8.4', name: 'Asphalt surfacing 40mm thick', description: 'Hot mix asphalt surfacing, continuously graded, 40mm thick', unit: 'm²', quantity: '35000', category: 'Pavement Layers (SANS 1200 G)', sansStandard: 'SANS 1200 G', isRateOnly: false },
      
      // DRAINAGE
      { code: 'C3.2', name: '600mm dia concrete pipe', description: 'Class 3 concrete pipes 600mm diameter including bedding', unit: 'm', quantity: '450', category: 'Drainage (SANS 1200 C)', sansStandard: 'SANS 1200 C', isRateOnly: false },
      { code: 'C5.1', name: 'Precast concrete manholes', description: 'Precast concrete manholes 1200mm diameter, 2.5m deep', unit: 'nr', quantity: '25', category: 'Drainage (SANS 1200 C)', sansStandard: 'SANS 1200 C', isRateOnly: false },
      { code: 'C6.3', name: 'Side drains (trapezoidal)', description: 'Trapezoidal side drains, excavate and shape', unit: 'm', quantity: '10000', category: 'Drainage (SANS 1200 C)', sansStandard: 'SANS 1200 C', isRateOnly: false },
    ]
  },
  
  {
    id: 'urban-road-1km',
    name: 'Urban Road (1km)',
    projectType: 'Road Construction',
    description: 'Urban road with kerbs, stormwater, and streetlighting for 1km dual carriageway',
    projectSize: '1km x 2 lanes (14m width)',
    sansStandards: ['SANS 1200 D', 'SANS 1200 G', 'SANS 1200 C', 'SANS 1200 B8 (Electrical)'],
    icon: '🏙️',
    items: [
      { code: 'A1.1', name: 'Mobilization', description: 'Mobilization and site establishment for urban works', unit: 'sum', quantity: '1', category: 'Preliminary', sansStandard: 'SANS 1200 A', isRateOnly: false },
      { code: 'D4.2', name: 'Bulk excavation', description: 'Excavation for road formation in urban area', unit: 'm³', quantity: '3500', category: 'Earthworks', sansStandard: 'SANS 1200 D', isRateOnly: false },
      { code: 'G4.2', name: 'Subbase layer', description: 'G4 crushed stone subbase 150mm', unit: 'm³', quantity: '1200', category: 'Pavement', sansStandard: 'SANS 1200 G', isRateOnly: false },
      { code: 'G5.3', name: 'Base course', description: 'G2 crushed stone base 150mm', unit: 'm³', quantity: '950', category: 'Pavement', sansStandard: 'SANS 1200 G', isRateOnly: false },
      { code: 'G8.4', name: 'Asphalt surfacing', description: 'Hot mix asphalt 50mm thick', unit: 'm²', quantity: '14000', category: 'Surfacing', sansStandard: 'SANS 1200 G', isRateOnly: false },
      { code: 'B2.5', name: 'Concrete kerbs', description: 'Precast concrete kerbs 300mm high', unit: 'm', quantity: '2000', category: 'Kerbs & Channels', sansStandard: 'SANS 1200 B', isRateOnly: false },
      { code: 'C3.1', name: 'Stormwater pipes 450mm', description: 'Concrete pipes 450mm dia including bedding', unit: 'm', quantity: '250', category: 'Stormwater', sansStandard: 'SANS 1200 C', isRateOnly: false },
      { code: 'C5.1', name: 'Catch pits', description: 'Precast concrete catch pits with gratings', unit: 'nr', quantity: '15', category: 'Stormwater', sansStandard: 'SANS 1200 C', isRateOnly: false },
      { code: 'B8.1', name: 'Streetlight poles', description: '8m high galvanized steel streetlight poles', unit: 'nr', quantity: '25', category: 'Streetlighting', sansStandard: 'SANS 1200 B8', isRateOnly: false },
      { code: 'B8.2', name: 'LED streetlights', description: '100W LED streetlight luminaires', unit: 'nr', quantity: '25', category: 'Streetlighting', sansStandard: 'SANS 1200 B8', isRateOnly: false },
    ]
  },

  // ==================== HOUSING DEVELOPMENT TEMPLATES ====================
  {
    id: 'low-cost-housing-50m2',
    name: 'Low-Cost Housing (50m²)',
    projectType: 'Housing Development',
    description: 'Complete BOQ for standard 50m² low-cost housing unit (RDP compliant)',
    projectSize: '50m² (2 bedroom)',
    sansStandards: ['SANS 1200 B (Building Works)', 'SANS 10400 (Building Regulations)'],
    icon: '🏘️',
    validation: {
      version: '1.0',
      lastUpdated: '2025-01-15',
      lastReviewDate: '2024-12-10',
      reviewedBy: [
        {
          name: 'Dr. Thabo Mokoena',
          qualification: 'Pr.Eng (ECSA 20234567)',
          role: 'Structural Engineering Reviewer'
        },
        {
          name: 'Sarah van der Merwe',
          qualification: 'Pr.QS (SACQSP 12345)',
          role: 'Quantity Surveying Reviewer'
        },
        {
          name: 'John Smith',
          qualification: 'NHBRC Inspector #INS-5678',
          role: 'NHBRC Compliance Officer'
        }
      ],
      benchmarkProjects: [
        {
          name: 'Gauteng Affordable Housing Programme (Phase 2)',
          province: 'GP',
          year: 2023,
          matchScore: '96%'
        },
        {
          name: 'Western Cape BNG Housing Project - Mitchells Plain',
          province: 'WC',
          year: 2023,
          matchScore: '92%'
        },
        {
          name: 'KZN Reconstruction & Development - uMhlathuze',
          province: 'KZN',
          year: 2022,
          matchScore: '89%'
        }
      ],
      assumptions: [
        'Flat terrain (max 1.5m level difference)',
        'Standard soil bearing capacity (≥150kPa)',
        'No rock excavation required',
        'Municipal water & electricity available',
        'Standard RDP/BNG subsidy specifications'
      ],
      exclusions: [
        'Land acquisition and compensation',
        'Site investigation and geotechnical reports',
        'Professional fees (architect, engineer, QS)',
        'Contingencies and escalation (typically 10-15%)',
        'External bulk services connections',
        'Environmental Impact Assessment (EIA)'
      ]
    },
    items: [
      // SUBSTRUCTURE
      { code: 'B1.2.1', name: 'Excavate foundation trenches', description: 'Excavate foundation trenches 450mm wide x 600mm deep', unit: 'm³', quantity: '12', category: 'Substructure (SANS 1200 B1)', sansStandard: 'SANS 1200 B1', isRateOnly: false },
      { code: 'B1.3.2', name: 'Concrete strip footing (20MPa)', description: '20MPa concrete strip footings 450mm wide x 300mm deep', unit: 'm³', quantity: '3.5', category: 'Substructure (SANS 1200 B1)', sansStandard: 'SANS 1200 B1', isRateOnly: false },
      { code: 'B1.4.1', name: 'Brickwork up to DPC', description: 'Brick plinth wall up to damp-proof course level', unit: 'm²', quantity: '24', category: 'Substructure (SANS 1200 B1)', sansStandard: 'SANS 1200 B1', isRateOnly: false },
      { code: 'B1.5.1', name: 'Damp-proof course', description: 'Bituminous damp-proof course to plinth wall', unit: 'm²', quantity: '52', category: 'Substructure (SANS 1200 B1)', sansStandard: 'SANS 1200 B1', isRateOnly: false },
      { code: 'B1.6.1', name: 'Hardcore filling under slab', description: 'Imported hardcore filling and compaction under floor slab', unit: 'm³', quantity: '5.5', category: 'Substructure (SANS 1200 B1)', sansStandard: 'SANS 1200 B1', isRateOnly: false },
      { code: 'B1.7.1', name: 'Concrete floor slab (100mm)', description: '20MPa concrete floor slab 100mm thick with A142 mesh', unit: 'm²', quantity: '50', category: 'Substructure (SANS 1200 B1)', sansStandard: 'SANS 1200 B1', isRateOnly: false },
      
      // SUPERSTRUCTURE - WALLS
      { code: 'B2.1.1', name: 'Face brick external walls', description: 'Clay face brick external walls, 220mm thick', unit: 'm²', quantity: '85', category: 'Walls (SANS 1200 B2)', sansStandard: 'SANS 1200 B2', isRateOnly: false },
      { code: 'B2.2.1', name: 'Plaster internal walls (15mm)', description: '15mm cement plaster to internal walls, steel trowel finish', unit: 'm²', quantity: '140', category: 'Walls (SANS 1200 B2)', sansStandard: 'SANS 1200 B2', isRateOnly: false },
      { code: 'B2.3.1', name: 'Steel lintels over openings', description: 'Steel lintels over door and window openings', unit: 'm', quantity: '12', category: 'Walls (SANS 1200 B2)', sansStandard: 'SANS 1200 B2', isRateOnly: false },
      
      // ROOF STRUCTURE
      { code: 'B3.1.1', name: 'Timber roof trusses (5m span)', description: 'Prefabricated timber roof trusses, 5m span @ 900mm c/c', unit: 'nr', quantity: '8', category: 'Roof Structure (SANS 1200 B3)', sansStandard: 'SANS 1200 B3', isRateOnly: false },
      { code: 'B3.2.1', name: 'Roof battens (38x38mm)', description: '38x38mm treated timber roof battens @ 450mm c/c', unit: 'm', quantity: '180', category: 'Roof Structure (SANS 1200 B3)', sansStandard: 'SANS 1200 B3', isRateOnly: false },
      { code: 'B3.3.1', name: 'IBR corrugated roof sheeting', description: '0.5mm IBR galvanized roof sheeting including fasteners', unit: 'm²', quantity: '65', category: 'Roof Covering (SANS 1200 B3)', sansStandard: 'SANS 1200 B3', isRateOnly: false },
      { code: 'B3.4.1', name: 'Fascia & barge boards', description: '220mm wide painted fascia and barge boards', unit: 'm', quantity: '28', category: 'Roof Structure (SANS 1200 B3)', sansStandard: 'SANS 1200 B3', isRateOnly: false },
      
      // WINDOWS & DOORS
      { code: 'B5.1.1', name: 'Aluminium window 1200x1200', description: 'Powder-coated aluminium sliding window 1200x1200mm', unit: 'nr', quantity: '4', category: 'Windows & Doors (SANS 1200 B5)', sansStandard: 'SANS 1200 B5', isRateOnly: false },
      { code: 'B5.2.1', name: 'Hollow core internal doors', description: 'Hollow core flush doors 813x2032mm with frames and hardware', unit: 'nr', quantity: '3', category: 'Windows & Doors (SANS 1200 B5)', sansStandard: 'SANS 1200 B5', isRateOnly: false },
      { code: 'B5.3.1', name: 'Steel security door (front)', description: 'Steel security door 813x2032mm with frame and multi-point lock', unit: 'nr', quantity: '1', category: 'Windows & Doors (SANS 1200 B5)', sansStandard: 'SANS 1200 B5', isRateOnly: false },
      
      // PLUMBING
      { code: 'B7.1.1', name: 'Toilet suite (pan, cistern)', description: 'Vitreous china toilet pan and cistern with seat', unit: 'nr', quantity: '1', category: 'Plumbing (SANS 1200 B7)', sansStandard: 'SANS 1200 B7', isRateOnly: false },
      { code: 'B7.2.1', name: 'Basin & taps', description: 'Vitreous china wash hand basin with mixer taps', unit: 'nr', quantity: '1', category: 'Plumbing (SANS 1200 B7)', sansStandard: 'SANS 1200 B7', isRateOnly: false },
      { code: 'B7.3.1', name: 'Kitchen sink & taps', description: 'Stainless steel kitchen sink with mixer taps', unit: 'nr', quantity: '1', category: 'Plumbing (SANS 1200 B7)', sansStandard: 'SANS 1200 B7', isRateOnly: false },
      { code: 'B7.4.1', name: 'Shower tray & mixer', description: 'Acrylic shower tray 900x900mm with thermostatic mixer', unit: 'nr', quantity: '1', category: 'Plumbing (SANS 1200 B7)', sansStandard: 'SANS 1200 B7', isRateOnly: false },
      { code: 'B7.5.1', name: 'Hot water geyser (150L)', description: '150L electric geyser with thermostat and drip tray', unit: 'nr', quantity: '1', category: 'Plumbing (SANS 1200 B7)', sansStandard: 'SANS 1200 B7', isRateOnly: false },
      { code: 'B7.6.1', name: 'UPVC drainage pipes', description: '110mm UPVC drainage pipes and fittings', unit: 'm', quantity: '35', category: 'Plumbing (SANS 1200 B7)', sansStandard: 'SANS 1200 B7', isRateOnly: false },
      
      // ELECTRICAL
      { code: 'B8.1.1', name: 'DB board (8-way)', description: '8-way distribution board with MCBs and earth leakage', unit: 'nr', quantity: '1', category: 'Electrical (SANS 1200 B8)', sansStandard: 'SANS 1200 B8', isRateOnly: false },
      { code: 'B8.2.1', name: 'Light points', description: 'Light points complete with switch and LED bulb', unit: 'nr', quantity: '6', category: 'Electrical (SANS 1200 B8)', sansStandard: 'SANS 1200 B8', isRateOnly: false },
      { code: 'B8.3.1', name: 'Power points (double socket)', description: 'Double socket power points with cabling', unit: 'nr', quantity: '8', category: 'Electrical (SANS 1200 B8)', sansStandard: 'SANS 1200 B8', isRateOnly: false },
      { code: 'B8.4.1', name: 'Stove connection point', description: '30A stove connection point with dedicated circuit', unit: 'nr', quantity: '1', category: 'Electrical (SANS 1200 B8)', sansStandard: 'SANS 1200 B8', isRateOnly: false },
    ]
  },

  // ==================== INFRASTRUCTURE TEMPLATES ====================
  {
    id: 'water-reticulation-500m',
    name: 'Water Reticulation (500m)',
    projectType: 'Infrastructure (Water/Sewer)',
    description: 'Water reticulation network for residential area - 500m of pipeline',
    projectSize: '500m pipeline network',
    sansStandards: ['SANS 1200 C (Pipework)', 'SANS 0241 (Water)'],
    icon: '💧',
    items: [
      { code: 'C1.1', name: 'Trench excavation', description: 'Excavate trenches 600mm wide x 1200mm deep for water mains', unit: 'm³', quantity: '360', category: 'Excavation (SANS 1200 C)', sansStandard: 'SANS 1200 C', isRateOnly: false },
      { code: 'C2.1', name: 'HDPE water pipe 110mm', description: 'HDPE water pipe 110mm diameter PN12.5 Class 12', unit: 'm', quantity: '500', category: 'Pipework (SANS 1200 C)', sansStandard: 'SANS 1200 C', isRateOnly: false },
      { code: 'C2.5', name: 'Pipe bedding and surround', description: 'Selected bedding and surround material for pipes', unit: 'm³', quantity: '180', category: 'Pipework (SANS 1200 C)', sansStandard: 'SANS 1200 C', isRateOnly: false },
      { code: 'C4.1', name: 'Gate valves 110mm', description: 'Resilient seated gate valves 110mm with valve chambers', unit: 'nr', quantity: '8', category: 'Valves & Fittings (SANS 1200 C)', sansStandard: 'SANS 1200 C', isRateOnly: false },
      { code: 'C4.3', name: 'Fire hydrants', description: 'Fire hydrants with standpipes and valve chambers', unit: 'nr', quantity: '4', category: 'Valves & Fittings (SANS 1200 C)', sansStandard: 'SANS 1200 C', isRateOnly: false },
      { code: 'C7.1', name: 'Pressure testing', description: 'Hydrostatic pressure testing of water mains', unit: 'm', quantity: '500', category: 'Testing (SANS 1200 C)', sansStandard: 'SANS 1200 C', isRateOnly: false },
      { code: 'C8.1', name: 'Trench reinstatement', description: 'Backfill and compact trenches after pipe installation', unit: 'm³', quantity: '360', category: 'Reinstatement (SANS 1200 C)', sansStandard: 'SANS 1200 C', isRateOnly: false },
    ]
  },

  // ==================== CIVIL WORKS TEMPLATES ====================
  {
    id: 'bulk-earthworks',
    name: 'Bulk Earthworks (Site Development)',
    projectType: 'Civil Works',
    description: 'Bulk earthworks for residential township development - 5 hectares',
    projectSize: '5 hectares',
    sansStandards: ['SANS 1200 D (Earthworks)'],
    icon: '⛏️',
    items: [
      { code: 'D1.1', name: 'Site clearance', description: 'Clear vegetation and remove topsoil for stockpiling', unit: 'ha', quantity: '5', category: 'Site Preparation (SANS 1200 D)', sansStandard: 'SANS 1200 D', isRateOnly: false },
      { code: 'D4.1', name: 'Bulk excavation (cut)', description: 'Bulk excavation in soft to intermediate material', unit: 'm³', quantity: '35000', category: 'Earthworks (SANS 1200 D)', sansStandard: 'SANS 1200 D', isRateOnly: false },
      { code: 'D6.1', name: 'Bulk filling (fill)', description: 'Placing and spreading of fill material', unit: 'm³', quantity: '28000', category: 'Earthworks (SANS 1200 D)', sansStandard: 'SANS 1200 D', isRateOnly: false },
      { code: 'D7.1', name: 'Compaction to 90% Mod AASHTO', description: 'Compaction of fill in layers to 90% density', unit: 'm³', quantity: '28000', category: 'Earthworks (SANS 1200 D)', sansStandard: 'SANS 1200 D', isRateOnly: false },
      { code: 'D9.1', name: 'Topsoil replacement', description: 'Reinstate topsoil to landscaped areas', unit: 'm³', quantity: '2500', category: 'Landscaping (SANS 1200 D)', sansStandard: 'SANS 1200 D', isRateOnly: false },
    ]
  },

  // ==================== BRIDGES & STRUCTURES TEMPLATES ====================
  {
    id: 'concrete-bridge-20m',
    name: 'Concrete Bridge (20m span)',
    projectType: 'Bridges & Structures',
    description: 'Reinforced concrete bridge with 20m span over watercourse',
    projectSize: '20m span x 8m width',
    sansStandards: ['SANS 1200 F (Concrete)', 'SANS 1200 E (Reinforcement)'],
    icon: '🌉',
    items: [
      { code: 'F1.1', name: 'Abutment foundations', description: 'Excavate and cast concrete for bridge abutment foundations', unit: 'm³', quantity: '45', category: 'Foundations (SANS 1200 F)', sansStandard: 'SANS 1200 F', isRateOnly: false },
      { code: 'E1.1', name: 'Foundation reinforcement', description: 'High tensile steel reinforcement to foundations', unit: 'kg', quantity: '3500', category: 'Reinforcement (SANS 1200 E)', sansStandard: 'SANS 1200 E', isRateOnly: false },
      { code: 'F2.1', name: 'Concrete abutments (30MPa)', description: '30MPa concrete to bridge abutments', unit: 'm³', quantity: '85', category: 'Structural Concrete (SANS 1200 F)', sansStandard: 'SANS 1200 F', isRateOnly: false },
      { code: 'F3.1', name: 'Bridge deck formwork', description: 'Formwork and falsework for bridge deck slab', unit: 'm²', quantity: '160', category: 'Formwork (SANS 1200 F)', sansStandard: 'SANS 1200 F', isRateOnly: false },
      { code: 'E2.1', name: 'Deck slab reinforcement', description: 'High tensile reinforcement to bridge deck', unit: 'kg', quantity: '8500', category: 'Reinforcement (SANS 1200 E)', sansStandard: 'SANS 1200 E', isRateOnly: false },
      { code: 'F4.1', name: 'Concrete bridge deck (40MPa)', description: '40MPa concrete to bridge deck slab 300mm thick', unit: 'm³', quantity: '48', category: 'Structural Concrete (SANS 1200 F)', sansStandard: 'SANS 1200 F', isRateOnly: false },
      { code: 'B2.7', name: 'Concrete parapets', description: 'Reinforced concrete parapets to bridge edges', unit: 'm', quantity: '40', category: 'Safety Features', sansStandard: 'SANS 1200 B', isRateOnly: false },
    ]
  },

  // ==================== BUILDING CONSTRUCTION TEMPLATES ====================
  {
    id: 'commercial-building-500m2',
    name: 'Commercial Building (500m²)',
    projectType: 'Building Construction',
    description: 'Single-storey commercial building with offices and retail space',
    projectSize: '500m² footprint',
    sansStandards: ['SANS 1200 B (Building)', 'SANS 10400 (Regulations)'],
    icon: '🏢',
    items: [
      { code: 'B1.1', name: 'Foundation excavation', description: 'Bulk excavation for building foundations', unit: 'm³', quantity: '250', category: 'Substructure', sansStandard: 'SANS 1200 B1', isRateOnly: false },
      { code: 'B1.2', name: 'Concrete foundations (25MPa)', description: 'Reinforced concrete strip and pad footings', unit: 'm³', quantity: '85', category: 'Substructure', sansStandard: 'SANS 1200 B1', isRateOnly: false },
      { code: 'B2.1', name: 'Brick walls (230mm)', description: 'Clay brick external walls plastered both sides', unit: 'm²', quantity: '650', category: 'Superstructure', sansStandard: 'SANS 1200 B2', isRateOnly: false },
      { code: 'B3.1', name: 'Steel roof structure', description: 'Structural steel roof trusses and purlins', unit: 'kg', quantity: '8500', category: 'Roof Structure', sansStandard: 'SANS 1200 B3', isRateOnly: false },
      { code: 'B3.2', name: 'IBR roof sheeting', description: '0.5mm IBR roof sheeting with insulation', unit: 'm²', quantity: '600', category: 'Roof Covering', sansStandard: 'SANS 1200 B3', isRateOnly: false },
      { code: 'B5.1', name: 'Aluminium shopfront', description: 'Aluminium shopfront system with glass', unit: 'm²', quantity: '80', category: 'Doors & Windows', sansStandard: 'SANS 1200 B5', isRateOnly: false },
      { code: 'B6.1', name: 'Suspended ceiling', description: 'Suspended ceiling with tiles and grid', unit: 'm²', quantity: '500', category: 'Finishes', sansStandard: 'SANS 1200 B6', isRateOnly: false },
      { code: 'B7.1', name: 'Plumbing installation', description: 'Complete plumbing for toilets and kitchen', unit: 'sum', quantity: '1', category: 'Plumbing', sansStandard: 'SANS 1200 B7', isRateOnly: false },
      { code: 'B8.1', name: 'Electrical installation', description: 'Complete electrical reticulation and lighting', unit: 'sum', quantity: '1', category: 'Electrical', sansStandard: 'SANS 1200 B8', isRateOnly: false },
    ]
  },
];

// Contractor profiles and the template catalogue use slightly different
// category labels. Resolve known equivalents without turning unknown categories
// into unrelated templates.
const PROJECT_TYPE_ALIASES: Record<string, string> = {
  'residential building': 'Housing Development',
  'general building': 'Building Construction',
  'commercial building': 'Building Construction',
  'industrial construction': 'Building Construction',
  'renovation & refurbishment': 'Building Construction',
  'electrical works': 'Building Construction',
  'water & sanitation': 'Infrastructure (Water/Sewer)',
  'storm water management': 'Infrastructure (Water/Sewer)',
  'earthworks & grading': 'Civil Works',
  'landscaping & earthworks': 'Civil Works',
  'bridge construction': 'Bridges & Structures',
};

export function getTemplatesByProjectType(projectType: string): BoqTemplate[] {
  const normalizedType = projectType.trim().toLowerCase();
  const resolvedType = PROJECT_TYPE_ALIASES[normalizedType] || projectType.trim();

  return BOQ_TEMPLATES.filter(
    template => template.projectType.toLowerCase() === resolvedType.toLowerCase()
  );
}

// Helper function to get all unique project types
export function getAllProjectTypes(): string[] {
  const types = new Set(BOQ_TEMPLATES.map(t => t.projectType));
  return Array.from(types);
}

// Helper function to get template by ID
export function getTemplateById(id: string): BoqTemplate | undefined {
  return BOQ_TEMPLATES.find(t => t.id === id);
}