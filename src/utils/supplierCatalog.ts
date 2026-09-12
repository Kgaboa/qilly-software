// Comprehensive supplier catalog with live pricing data

export interface SupplierPrice {
  itemName: string;
  keywords: string[]; // Keywords for matching (from description)
  unitPrice: number;
  unit: string;
  supplier: string;
  available: boolean;
  lastUpdated: string;
  category: string;
  description: string;
  buildAidRef?: string; // BuildAid 2025/2026 reference (page & section)
  sansCode?: string; // SANS 1200 standard code
}

// Buco Supplier Catalog (BuildAid 2025/2026 Referenced)
const bucoCatalog: SupplierPrice[] = [
  // Cement & Concrete
  { itemName: 'Cement 50kg', keywords: ['cement', 'portland', 'ppc', '50kg'], unitPrice: 89.99, unit: 'bag', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Cement', description: 'High-quality Portland cement for various construction projects.', buildAidRef: 'BuildAid 2025 p.42 §M001', sansCode: 'SANS 1200 F' },
  { itemName: 'Surebuild Cement 50kg', keywords: ['cement', 'surebuild', 'portland', '50kg'], unitPrice: 85.50, unit: 'bag', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Cement', description: 'Surebuild cement for reliable construction needs.', buildAidRef: 'BuildAid 2025 p.42 §M002', sansCode: 'SANS 1200 F' },
  { itemName: 'PPC Cement', keywords: ['ppc', 'cement', 'portland'], unitPrice: 92.00, unit: 'bag', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Cement', description: 'Premier Portland cement for superior construction performance.', buildAidRef: 'BuildAid 2025 p.42 §M001', sansCode: 'SANS 1200 F' },
  { itemName: 'Ready Mix Concrete', keywords: ['concrete', 'ready mix', 'premix'], unitPrice: 1250.00, unit: 'm3', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Concrete', description: 'Ready mix concrete for quick and efficient construction.', buildAidRef: 'BuildAid 2025 p.45 §F003', sansCode: 'SANS 1200 F' },

  // Bricks & Blocks
  { itemName: 'Clay Brick', keywords: ['brick', 'clay', 'standard', 'building'], unitPrice: 2.85, unit: 'unit', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Bricks & Blocks', description: 'Standard clay brick for building walls and structures.', buildAidRef: 'BuildAid 2025 p.52 §B101', sansCode: 'SANS 1200 B2' },
  { itemName: 'Concrete Block', keywords: ['block', 'concrete', 'hollow'], unitPrice: 12.50, unit: 'unit', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Bricks & Blocks', description: 'Hollow concrete block for load-bearing walls.', buildAidRef: 'BuildAid 2025 p.54 §B105', sansCode: 'SANS 1200 B2' },
  { itemName: 'Stock Brick', keywords: ['stock', 'brick', 'face'], unitPrice: 3.20, unit: 'unit', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Bricks & Blocks', description: 'Face brick for decorative and aesthetic purposes.', buildAidRef: 'BuildAid 2025 p.52 §B102', sansCode: 'SANS 1200 B2' },

  // Sand & Aggregates
  { itemName: 'Building Sand', keywords: ['sand', 'building', 'plaster', 'fine'], unitPrice: 450.00, unit: 'ton', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Sand & Aggregates', description: 'Fine building sand for plastering and concrete mixing.', buildAidRef: 'BuildAid 2025 p.48 §A201', sansCode: 'SANS 1200 D' },
  { itemName: 'River Sand', keywords: ['sand', 'river', 'fine'], unitPrice: 480.00, unit: 'ton', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Sand & Aggregates', description: 'Fine river sand for concrete mixing and construction.', buildAidRef: 'BuildAid 2025 p.48 §A202', sansCode: 'SANS 1200 D' },
  { itemName: 'Crusher Stone 19mm', keywords: ['stone', 'crusher', 'aggregate', '19mm'], unitPrice: 350.00, unit: 'ton', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Sand & Aggregates', description: '19mm crusher stone for concrete mixing and construction.', buildAidRef: 'BuildAid 2025 p.49 §A205', sansCode: 'SANS 1200 D/G' },
  { itemName: 'Crusher Dust', keywords: ['crusher', 'dust', 'stone dust'], unitPrice: 320.00, unit: 'ton', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Sand & Aggregates', description: 'Crusher dust for concrete mixing and construction.', buildAidRef: 'BuildAid 2025 p.49 §A206', sansCode: 'SANS 1200 D' },

  // Timber
  { itemName: 'Pine Timber 38x114mm', keywords: ['timber', 'pine', 'wood', '38x114'], unitPrice: 58.50, unit: 'meter', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Timber', description: 'Pine timber for structural and decorative purposes.', buildAidRef: 'BuildAid 2025 p.78 §T301', sansCode: 'SANS 1200 B3' },
  { itemName: 'Treated Pine Pole', keywords: ['pole', 'treated', 'pine', 'timber'], unitPrice: 125.00, unit: 'meter', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Timber', description: 'Treated pine pole for outdoor and structural applications.', buildAidRef: 'BuildAid 2025 p.79 §T305', sansCode: 'SANS 1200 B3' },

  // Steel & Reinforcement
  { itemName: 'Steel Rod 8mm', keywords: ['steel', 'rod', 'rebar', 'reinforcement', '8mm'], unitPrice: 45.00, unit: 'meter', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Steel & Reinforcement', description: '8mm steel rod for reinforcement in concrete structures.', buildAidRef: 'BuildAid 2025 p.87 §R001', sansCode: 'SANS 1200 E' },
  { itemName: 'Steel Rod 10mm', keywords: ['steel', 'rod', 'rebar', 'reinforcement', '10mm'], unitPrice: 65.00, unit: 'meter', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Steel & Reinforcement', description: '10mm steel rod for reinforcement in concrete structures.', buildAidRef: 'BuildAid 2025 p.87 §R002', sansCode: 'SANS 1200 E' },
  { itemName: 'Steel Rod 12mm', keywords: ['steel', 'rod', 'rebar', 'reinforcement', '12mm'], unitPrice: 85.00, unit: 'meter', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Steel & Reinforcement', description: '12mm steel rod for reinforcement in concrete structures.', buildAidRef: 'BuildAid 2025 p.87 §R003', sansCode: 'SANS 1200 E' },
  { itemName: 'Steel Rod 16mm', keywords: ['steel', 'rod', 'rebar', 'reinforcement', '16mm'], unitPrice: 125.00, unit: 'meter', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Steel & Reinforcement', description: '16mm steel rod for reinforcement in concrete structures.', buildAidRef: 'BuildAid 2025 p.88 §R005', sansCode: 'SANS 1200 E' },

  // Plumbing
  { itemName: 'PVC Pipe 110mm', keywords: ['pvc', 'pipe', '110mm', 'drain'], unitPrice: 145.00, unit: 'meter', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Plumbing', description: '110mm PVC pipe for drainage systems.', buildAidRef: 'BuildAid 2025 p.95 §P201', sansCode: 'SANS 1200 C' },
  { itemName: 'Copper Pipe 15mm', keywords: ['copper', 'pipe', '15mm'], unitPrice: 95.00, unit: 'meter', supplier: 'Buco', available: true, lastUpdated: '2026-01-25', category: 'Plumbing', description: '15mm copper pipe for plumbing systems.', buildAidRef: 'BuildAid 2025 p.96 §P205', sansCode: 'SANS 1200 B7' },
  
  // Project Management & Compliance
  { itemName: 'Monitoring of compliance with and reporting on the EMP', keywords: ['monitoring', 'compliance', 'emp', 'environmental'], unitPrice: 8500.00, unit: 'month', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Environmental Management Plan monitoring and reporting services.', buildAidRef: 'BuildAid 2025 p.12 §A105', sansCode: 'SANS 1200 A' },
  { itemName: 'Submission of a Scheme 2 Initial Programme', keywords: ['scheme', 'programme', 'initial', 'submission'], unitPrice: 12000.00, unit: 'sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Preparation and submission of Scheme 2 Initial Programme.', buildAidRef: 'BuildAid 2025 p.15 §A108', sansCode: 'SANS 1200 A' },
  { itemName: 'Submission of a Scheme 2 Full Programme', keywords: ['scheme', 'programme', 'full', 'submission'], unitPrice: 25000.00, unit: 'sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Preparation and submission of Scheme 2 Full Programme.', buildAidRef: 'BuildAid 2025 p.15 §A109', sansCode: 'SANS 1200 A' },
  { itemName: 'Reviewing and updating a Scheme 2 programme every month', keywords: ['scheme', 'programme', 'review', 'update', 'monthly'], unitPrice: 6500.00, unit: 'month', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Monthly review and update of Scheme 2 programme.' },
  { itemName: 'Preparation and submission of all information and reports specified in the Contract Documentation', keywords: ['reports', 'contract', 'documentation', 'submission'], unitPrice: 15000.00, unit: 'month', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Preparation and submission of contract reports and documentation.' },
  { itemName: 'Collection of rubbish / litter', keywords: ['rubbish', 'litter', 'collection', 'cleaning'], unitPrice: 3500.00, unit: 'month', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Site Maintenance', description: 'Regular collection of rubbish and litter from site.' },
  { itemName: 'Other road maintenance work ordered by the Engineer', keywords: ['road', 'maintenance', 'engineer', 'work'], unitPrice: 45000.00, unit: 'provisional sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Road Maintenance', description: 'Additional road maintenance work as ordered by the Engineer.' },
  { itemName: 'Handling cost, profit and all other charges in respect of item C1.2.3.11', keywords: ['handling', 'cost', 'profit', 'charges'], unitPrice: 5000.00, unit: 'sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Financial', description: 'Handling costs, profit and other charges for item C1.2.3.11.' },
  { itemName: 'Liaison with the routine road maintenance of a supplier', keywords: ['liaison', 'road', 'maintenance', 'supplier'], unitPrice: 4500.00, unit: 'month', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Coordination', description: 'Coordination with supplier for routine road maintenance.' },
  { itemName: 'Stakeholder liaison', keywords: ['stakeholder', 'liaison', 'engagement'], unitPrice: 7000.00, unit: 'month', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Coordination', description: 'Stakeholder engagement and liaison services.' },
  { itemName: 'Safety', keywords: ['safety', 'health', 'occupational'], unitPrice: 9500.00, unit: 'month', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Health & Safety', description: 'General safety management and compliance.' },
  { itemName: 'Stakeholder liaison about Health and safety plan', keywords: ['stakeholder', 'health', 'safety', 'plan', 'liaison'], unitPrice: 5500.00, unit: 'month', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Health & Safety', description: 'Stakeholder engagement regarding health and safety plans.' },
  { itemName: 'Implementation of Stakeholder liaison health and safety plan', keywords: ['implementation', 'stakeholder', 'health', 'safety', 'plan'], unitPrice: 8000.00, unit: 'month', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Health & Safety', description: 'Implementation of stakeholder liaison health and safety plan.' },
  
  // Labour & Daywork
  { itemName: 'Personnel Daywork', keywords: ['personnel', 'daywork', 'staff'], unitPrice: 850.00, unit: 'day', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'General personnel daywork services.', buildAidRef: 'BuildAid 2025 p.125 §L401', sansCode: 'SANS 1200 A' },
  { itemName: 'Unskilled labourer Daywork', keywords: ['unskilled', 'labourer', 'daywork', 'labour'], unitPrice: 350.00, unit: 'day', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Unskilled labourer daywork rate.', buildAidRef: 'BuildAid 2025 p.122 §L101', sansCode: 'SANS 1200 A' },
  { itemName: 'Semi-skilled labourer Daywork', keywords: ['semi-skilled', 'labourer', 'daywork', 'labour'], unitPrice: 500.00, unit: 'day', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Semi-skilled labourer daywork rate.', buildAidRef: 'BuildAid 2025 p.122 §L102', sansCode: 'SANS 1200 A' },
  { itemName: 'Skilled labourer Daywork', keywords: ['skilled', 'labourer', 'daywork', 'labour'], unitPrice: 750.00, unit: 'day', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Skilled labourer daywork rate.', buildAidRef: 'BuildAid 2025 p.123 §L103', sansCode: 'SANS 1200 A' },
  { itemName: 'Foreman Daywork', keywords: ['foreman', 'daywork', 'supervisor'], unitPrice: 1200.00, unit: 'day', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Foreman daywork rate.', buildAidRef: 'BuildAid 2025 p.124 §L105', sansCode: 'SANS 1200 A' },
  
  // Procurement & Disposal
  { itemName: 'Procurement of materials', keywords: ['procurement', 'materials', 'purchasing'], unitPrice: 35000.00, unit: 'provisional sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Procurement', description: 'Procurement of materials as required.' },
  { itemName: 'Supplier handling of handling costs, profit and all other charges of Procurement of materials', keywords: ['handling', 'procurement', 'costs', 'profit'], unitPrice: 7500.00, unit: 'sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Financial', description: 'Handling costs and profit for material procurement.' },
  { itemName: 'Disposal of non-useable assets', keywords: ['disposal', 'assets', 'waste'], unitPrice: 15000.00, unit: 'sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Disposal', description: 'Disposal of non-useable assets.' },
  { itemName: 'Disposal of non-useable assets identified in the Contract Documentation at time of tender', keywords: ['disposal', 'assets', 'contract', 'tender'], unitPrice: 12000.00, unit: 'sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Disposal', description: 'Disposal of assets identified at tender time.' },
  { itemName: 'Existing road studs', keywords: ['road', 'studs', 'existing'], unitPrice: 25.00, unit: 'unit', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Road Materials', description: 'Existing road studs for road marking.' },
  { itemName: 'Disposal of non-useable assets not identified at time of tender', keywords: ['disposal', 'assets', 'not', 'identified', 'tender'], unitPrice: 18000.00, unit: 'sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Disposal', description: 'Disposal of assets not identified at tender time.' },
  { itemName: 'Handling cost, profit and all other charges in respect of item C1.2.9.2', keywords: ['handling', 'cost', 'profit', 'charges', 'c1.2.9.2'], unitPrice: 6000.00, unit: 'sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Financial', description: 'Handling costs and profit for item C1.2.9.2.' },
  
  // Dispute Resolution
  { itemName: 'Dispute Adjudication Board (DAB)', keywords: ['dispute', 'adjudication', 'board', 'dab'], unitPrice: 50000.00, unit: 'provisional sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Legal & Compliance', description: 'Dispute Adjudication Board services.' },
  { itemName: 'Employer\'s contribution to DAB (50%)', keywords: ['employer', 'contribution', 'dab', 'dispute'], unitPrice: 25000.00, unit: 'provisional sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-26', category: 'Legal & Compliance', description: 'Employer contribution to Dispute Adjudication Board (50%).' },
  
  // Office and Site Establishment
  { itemName: 'Offices and conference room', keywords: ['office', 'conference', 'room', 'site', 'establishment'], unitPrice: 45000.00, unit: 'lump sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Site Establishment', description: 'Office and conference room setup for site management.' },
  { itemName: 'Ablution unit (equipment as specified)', keywords: ['ablution', 'unit', 'toilet', 'sanitation'], unitPrice: 18000.00, unit: 'unit', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Site Establishment', description: 'Ablution unit with equipment as specified.' },
  { itemName: 'Notice boards', keywords: ['notice', 'board', 'signage', 'area'], unitPrice: 350.00, unit: 'm²', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Site Establishment', description: 'Notice boards for site communication.' },
  { itemName: 'White boards', keywords: ['white', 'board', 'whiteboard', 'area'], unitPrice: 420.00, unit: 'm²', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Site Establishment', description: 'White boards for meetings and planning.' },
  { itemName: 'Office chair', keywords: ['office', 'chair', 'furniture', 'number'], unitPrice: 1850.00, unit: 'no', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Site Establishment', description: 'Office chair for site offices.' },
  { itemName: 'Office desk with 3 drawers (at least one lockable drawer)', keywords: ['office', 'desk', 'drawer', 'lockable', 'furniture'], unitPrice: 4500.00, unit: 'no', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Site Establishment', description: 'Office desk with 3 drawers including lockable drawer.' },
  { itemName: 'Conference table', keywords: ['conference', 'table', 'meeting', 'furniture'], unitPrice: 8500.00, unit: 'no', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Site Establishment', description: 'Conference table for meetings.' },
  { itemName: 'Fire extinguisher 9.0 kg, dry powder type', keywords: ['fire', 'extinguisher', '9kg', 'dry', 'powder', 'safety'], unitPrice: 850.00, unit: 'no', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Safety Equipment', description: 'Fire extinguisher 9.0 kg dry powder type.' },
  { itemName: 'Rain gauge', keywords: ['rain', 'gauge', 'weather', 'monitoring'], unitPrice: 320.00, unit: 'no', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Site Equipment', description: 'Rain gauge for weather monitoring.' },
  { itemName: 'Cell phones costs, including pro-rata rentals, for calls made in connection with contract administration', keywords: ['cell', 'phone', 'mobile', 'communication', 'rental'], unitPrice: 1200.00, unit: 'month', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Prime Cost', description: 'Cell phone costs and rentals for contract administration.' },
  { itemName: 'The provision of internet connectivity and WiFi data for Engineer\'s site staff', keywords: ['internet', 'wifi', 'connectivity', 'data'], unitPrice: 2500.00, unit: 'month', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Prime Cost', description: 'Internet connectivity and WiFi for site staff.' },
  { itemName: 'The provision of paper and ink for a combination colour printer/copier/scanner', keywords: ['paper', 'ink', 'printer', 'copier', 'scanner'], unitPrice: 1800.00, unit: 'month', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Prime Cost', description: 'Paper and ink for printer/copier/scanner.' },
  { itemName: 'The provision of a complete 220/250 volt single phase electrical power installation', keywords: ['electrical', 'power', 'installation', '220', '250', 'volt', 'single', 'phase'], unitPrice: 35000.00, unit: 'lump sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Prime Cost', description: 'Complete 220/250 volt single phase electrical power installation.' },
  { itemName: 'Fixed costs', keywords: ['fixed', 'costs', 'site', 'offices'], unitPrice: 25000.00, unit: 'lump sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Site Services', description: 'Fixed costs for site offices and facilities.' },
  { itemName: 'Running costs', keywords: ['running', 'costs', 'site', 'offices'], unitPrice: 8000.00, unit: 'month', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Site Services', description: 'Running costs for site offices and facilities.' },
  { itemName: 'Provision of security guards / watchmen and an armed response service at the Engineer\'s site offices and laboratories', keywords: ['security', 'guards', 'watchmen', 'armed', 'response'], unitPrice: 15000.00, unit: 'month', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Site Security', description: 'Security guards and armed response service.' },
  { itemName: 'Provision of computers for the Engineers stuff', keywords: ['computer', 'engineers', 'staff', 'equipment'], unitPrice: 18000.00, unit: 'pc sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Equipment', description: 'Provision of computers for engineers staff.' },
  { itemName: 'Provision of survey equipment', keywords: ['survey', 'equipment', 'surveying', 'tools'], unitPrice: 35000.00, unit: 'pc sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Equipment', description: 'Provision of survey equipment.' },
  
  // Concrete Kerbing (SABS 927)
  { itemName: 'Mountable kerbing (SABS 927 fg 7)', keywords: ['mountable', 'kerbing', 'kerb', 'sabs', '927', 'fg7', 'fg', '7', 'figure', 'concrete', 'curb'], unitPrice: 185.00, unit: 'm', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Concrete Kerbing', description: 'Mountable concrete kerbing SABS 927 figure 7.' },
  { itemName: 'Barrier kerbing (SABS 927 fg 1)', keywords: ['barrier', 'kerbing', 'kerb', 'sabs', '927', 'fg1', 'fg', '1', 'figure', 'concrete', 'curb'], unitPrice: 195.00, unit: 'm', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Concrete Kerbing', description: 'Barrier concrete kerbing SABS 927 figure 1.' },
  { itemName: 'Layerworks kerbing (SABS 927 fg 3)', keywords: ['layerworks', 'kerbing', 'kerb', 'sabs', '927', 'fg3', 'fg', '3', 'figure', 'concrete', 'curb', 'layer', 'works'], unitPrice: 175.00, unit: 'm', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Concrete Kerbing', description: 'Layerworks concrete kerbing SABS 927 figure 3.' },
  
  // Drainage
  { itemName: 'Precast concrete channel units', keywords: ['precast', 'concrete', 'channel', 'units', 'drainage', 'storm', 'water', 'stormwater'], unitPrice: 280.00, unit: 'm', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Drainage', description: 'Precast concrete channel units for drainage systems.' },
  { itemName: 'Concrete pipe 300mm class 2', keywords: ['concrete', 'pipe', '300mm', '300', 'class2', 'class', '2', 'drainage', 'storm', 'water'], unitPrice: 320.00, unit: 'm', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Drainage', description: '300mm class 2 concrete drainage pipe.' },
  { itemName: 'Concrete pipe 450mm class 2', keywords: ['concrete', 'pipe', '450mm', '450', 'class2', 'class', '2', 'drainage', 'storm', 'water'], unitPrice: 485.00, unit: 'm', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Drainage', description: '450mm class 2 concrete drainage pipe.' },
  { itemName: 'Concrete pipe 600mm class 2', keywords: ['concrete', 'pipe', '600mm', '600', 'class2', 'class', '2', 'drainage', 'storm', 'water'], unitPrice: 620.00, unit: 'm', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Drainage', description: '600mm class 2 concrete drainage pipe.' },
  { itemName: 'Catch pit with cover (900x900mm)', keywords: ['catch', 'pit', 'cover', 'drainage', 'manhole', '900mm'], unitPrice: 3200.00, unit: 'unit', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Drainage', description: 'Concrete catch pit with cover, 900mm x 900mm.' },
  { itemName: 'Manhole with cover (1200mm diameter)', keywords: ['manhole', 'cover', 'drainage', '1200mm', 'diameter'], unitPrice: 4500.00, unit: 'unit', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Drainage', description: 'Concrete manhole with cover, 1200mm diameter.' },
  
  // Services & Utilities
  { itemName: 'Water meter chamber', keywords: ['water', 'meter', 'chamber', 'utilities', 'precast', 'box'], unitPrice: 2800.00, unit: 'unit', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Services', description: 'Precast water meter chamber.' },
  { itemName: 'Valve chamber', keywords: ['valve', 'chamber', 'utilities', 'water', 'precast', 'box'], unitPrice: 2500.00, unit: 'unit', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Services', description: 'Precast valve chamber for water services.' },
  { itemName: 'HDPE pipe 63mm PN12.5', keywords: ['hdpe', 'pipe', '63mm', '63', 'pn12.5', 'pn', '12.5', 'water', 'polyethylene'], unitPrice: 95.00, unit: 'm', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Services', description: '63mm HDPE pipe PN12.5 for water reticulation.' },
  { itemName: 'HDPE pipe 110mm PN10', keywords: ['hdpe', 'pipe', '110mm', '110', 'pn10', 'pn', '10', 'water', 'polyethylene'], unitPrice: 185.00, unit: 'm', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Services', description: '110mm HDPE pipe PN10 for water reticulation.' },
  
  // Reinforcement
  { itemName: 'Fabric reinforcement mesh (Ref 193)', keywords: ['fabric', 'reinforcement', 'mesh', 'ref193', 'ref', '193', 'steel', 'wire'], unitPrice: 85.00, unit: 'm2', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Steel & Reinforcement', description: 'Fabric reinforcement mesh reference 193.' },
  { itemName: 'Fabric reinforcement mesh (Ref 283)', keywords: ['fabric', 'reinforcement', 'mesh', 'ref283', 'ref', '283', 'steel', 'wire'], unitPrice: 95.00, unit: 'm2', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Steel & Reinforcement', description: 'Fabric reinforcement mesh reference 283.' },
  { itemName: 'Steel reinforcing bars Y8', keywords: ['steel', 'reinforcing', 'bars', 'y8', 'y', '8', 'rebar', '8mm', 'reinforcement'], unitPrice: 12.50, unit: 'kg', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Steel & Reinforcement', description: 'Steel reinforcing bars Y8 (8mm diameter).' },
  { itemName: 'Steel reinforcing bars Y10', keywords: ['steel', 'reinforcing', 'bars', 'y10', 'y', '10', 'rebar', '10mm', 'reinforcement'], unitPrice: 13.00, unit: 'kg', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Steel & Reinforcement', description: 'Steel reinforcing bars Y10 (10mm diameter).' },
  { itemName: 'Steel reinforcing bars Y12', keywords: ['steel', 'reinforcing', 'bars', 'y12', 'y', '12', 'rebar', '12mm', 'reinforcement'], unitPrice: 13.50, unit: 'kg', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Steel & Reinforcement', description: 'Steel reinforcing bars Y12 (12mm diameter).' },
  
  // Demolition
  { itemName: 'Demolition of existing concrete structures', keywords: ['demolition', 'concrete', 'structures', 'breaking', 'removal'], unitPrice: 850.00, unit: 'm3', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Demolition', description: 'Demolition and removal of existing concrete structures.' },
  { itemName: 'Removal of existing kerbing', keywords: ['removal', 'kerbing', 'kerb', 'demolition'], unitPrice: 45.00, unit: 'm', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Demolition', description: 'Removal of existing concrete kerbing.' },
  { itemName: 'Removal of existing stormwater pipes', keywords: ['removal', 'stormwater', 'pipes', 'drainage', 'demolition'], unitPrice: 120.00, unit: 'm', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Demolition', description: 'Removal of existing stormwater pipes.' },
  
  // Brickwork
  { itemName: 'Face brickwork (220mm thick)', keywords: ['face', 'brickwork', '220mm', 'thick', 'wall'], unitPrice: 680.00, unit: 'm2', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Bricks & Blocks', description: 'Face brickwork 220mm thick wall construction.' },
  { itemName: 'Commons brickwork (110mm thick)', keywords: ['commons', 'brickwork', '110mm', 'thick', 'wall'], unitPrice: 420.00, unit: 'm2', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Bricks & Blocks', description: 'Commons brickwork 110mm thick wall construction.' },
  { itemName: 'Concrete blockwork (140mm thick)', keywords: ['concrete', 'blockwork', '140mm', 'thick', 'wall'], unitPrice: 380.00, unit: 'm2', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Bricks & Blocks', description: 'Concrete blockwork 140mm thick wall construction.' },
  
  // Excavation & Earthworks
  { itemName: 'Excavation for trenches (hand)', keywords: ['excavation', 'trenches', 'hand', 'digging', 'manual'], unitPrice: 280.00, unit: 'm3', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Excavation', description: 'Manual excavation for trenches and foundations.' },
  { itemName: 'Excavation for trenches (machine)', keywords: ['excavation', 'trenches', 'machine', 'mechanical', 'tlb'], unitPrice: 150.00, unit: 'm3', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Excavation', description: 'Machine excavation for trenches using TLB.' },
  { itemName: 'Bedding for pipes (selected material)', keywords: ['bedding', 'pipes', 'selected', 'material', 'sand'], unitPrice: 180.00, unit: 'm3', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Excavation', description: 'Selected material bedding for pipe installations.' },
  { itemName: 'Backfilling and compaction', keywords: ['backfilling', 'compaction', 'fill', 'compacting'], unitPrice: 120.00, unit: 'm3', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Excavation', description: 'Backfilling and compaction of excavations.' },
  
  // Plant & Equipment Hire
  { itemName: '10m3 Tippers', keywords: ['10m3', 'tippers', 'tipper', 'truck', 'dump', 'dumper', 'transport', 'haulage'], unitPrice: 850.00, unit: 'hour', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Plant Hire', description: '10m3 tipper truck hire per hour for material transport.' },
  { itemName: 'Waterpump (Capacity 50,000 liter/hr medium)', keywords: ['waterpump', 'water', 'pump', '50000', '50', '000', 'liter', 'litre', 'hr', 'hour', 'medium', 'capacity', 'dewatering'], unitPrice: 450.00, unit: 'hour', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Plant Hire', description: 'Water pump with 50,000 liter/hr capacity for dewatering and water transfer.' },
  
  // Vehicles
  { itemName: 'Light delivery vehicle', keywords: ['light', 'delivery', 'vehicle', 'ldv', 'bakkie', 'van', 'transport'], unitPrice: 12.50, unit: 'km', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Vehicles', description: 'Light delivery vehicle hire per kilometer.' },
  { itemName: 'Flatbed truck', keywords: ['flatbed', 'flat', 'bed', 'truck', 'transport', 'lorry'], unitPrice: 18.50, unit: 'km', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Vehicles', description: 'Flatbed truck hire per kilometer for material transport.' },
  
  // Materials Procurement & Handling
  { itemName: 'Procurement of materials', keywords: ['procurement', 'materials', 'supply', 'purchase', 'provision', 'prov', 'sum'], unitPrice: 25000.00, unit: 'Prov Sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Materials', description: 'Provisional sum for procurement of construction materials.' },
  { itemName: 'Contractor\'s handling costs, profit and all other charges (materials)', keywords: ['contractor', 'handling', 'costs', 'profit', 'charges', 'percentage', 'markup', 'c1.2.8.4'], unitPrice: 15.00, unit: '%', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Materials', description: 'Contractor handling costs, profit and charges percentage for materials.' },
  
  // Community Participation
  { itemName: 'Cost for community Participation (CLO)', keywords: ['community', 'participation', 'clo', 'liaison', 'officer', 'engagement', 'pc', 'sum', 'psc1.2.10'], unitPrice: 45000.00, unit: 'PC Sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Community Participation', description: 'Prime cost sum for Community Liaison Officer and participation activities.' },
  { itemName: 'Handling costs and profit (community participation)', keywords: ['handling', 'costs', 'profit', 'community', 'participation', 'percentage', 'psc1.2.10'], unitPrice: 12.50, unit: '%', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Community Participation', description: 'Handling costs and profit percentage for community participation.' },
  
  // Student Remuneration
  { itemName: 'Remuneration for a student', keywords: ['remuneration', 'student', 'payment', 'salary', 'stipend', 'pc', 'sum', 'psc1.2.11'], unitPrice: 35000.00, unit: 'PC Sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Student Programme', description: 'Prime cost sum for student remuneration and training.' },
  { itemName: 'Handling costs and profit (student remuneration)', keywords: ['handling', 'costs', 'profit', 'student', 'remuneration', 'percentage', 'psc1.2.11'], unitPrice: 10.00, unit: '%', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Student Programme', description: 'Handling costs and profit percentage for student remuneration.' },
  
  // Environmental Control Officer
  { itemName: 'Direct payment of ECO Agent', keywords: ['eco', 'environmental', 'control', 'officer', 'agent', 'direct', 'payment', 'pc', 'sum', 'psc1.2.12'], unitPrice: 65000.00, unit: 'PC Sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Environmental', description: 'Prime cost sum for Environmental Control Officer direct payment.' },
  { itemName: 'Contractor\'s handling costs, profit and charges (ECO)', keywords: ['contractor', 'handling', 'costs', 'profit', 'charges', 'eco', 'environmental', 'percentage', 'pc1.2.10'], unitPrice: 12.00, unit: '%', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Environmental', description: 'Contractor handling costs, profit and charges percentage for ECO.' },
  
  // Occupational Health and Safety
  { itemName: 'Direct payment of OHS Agent', keywords: ['ohs', 'occupational', 'health', 'safety', 'agent', 'direct', 'payment', 'pc', 'sum', 'psc1.2.13'], unitPrice: 55000.00, unit: 'PC Sum', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Health & Safety', description: 'Prime cost sum for Occupational Health and Safety Agent direct payment.' },
  { itemName: 'Contractor\'s handling costs, profit and charges (OHS)', keywords: ['contractor', 'handling', 'costs', 'profit', 'charges', 'ohs', 'health', 'safety', 'percentage', 'pc1.2.11'], unitPrice: 10.00, unit: '%', supplier: 'Buco', available: true, lastUpdated: '2026-01-27', category: 'Health & Safety', description: 'Contractor handling costs, profit and charges percentage for OHS.' },
  
  // Signage & Site Boards
  { itemName: 'Contract sign boards', keywords: ['contract', 'sign', 'boards', 'signage', 'site', 'information', 'notice'], unitPrice: 439.66, unit: 'm²', supplier: 'Buco', available: true, lastUpdated: '2026-02-04', category: 'Signage', description: 'Contract sign boards for site information and contractor details.' },
  { itemName: 'Project information boards', keywords: ['project', 'information', 'boards', 'signage', 'site', 'notice'], unitPrice: 485.00, unit: 'm²', supplier: 'Buco', available: true, lastUpdated: '2026-02-04', category: 'Signage', description: 'Project information boards for site details and specifications.' },
  { itemName: 'Safety signage boards', keywords: ['safety', 'signage', 'boards', 'warning', 'danger', 'site'], unitPrice: 320.00, unit: 'm²', supplier: 'Buco', available: true, lastUpdated: '2026-02-04', category: 'Signage', description: 'Safety signage boards for site hazard warnings.' },
  { itemName: 'Directional signage', keywords: ['directional', 'signage', 'arrows', 'wayfinding', 'site'], unitPrice: 280.00, unit: 'm²', supplier: 'Buco', available: true, lastUpdated: '2026-02-04', category: 'Signage', description: 'Directional signage for site navigation.' },
];

// Macsteel Supplier Catalog
const macsteelCatalog: SupplierPrice[] = [
  // Steel Products
  { itemName: 'Steel Rod 8mm', keywords: ['steel', 'rod', 'rebar', 'reinforcement', '8mm'], unitPrice: 42.50, unit: 'meter', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-25', category: 'Steel & Reinforcement', description: '8mm steel rod for reinforcement in concrete structures.' },
  { itemName: 'Steel Rod 10mm', keywords: ['steel', 'rod', 'rebar', 'reinforcement', '10mm'], unitPrice: 62.00, unit: 'meter', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-25', category: 'Steel & Reinforcement', description: '10mm steel rod for reinforcement in concrete structures.' },
  { itemName: 'Steel Rod 12mm', keywords: ['steel', 'rod', 'rebar', 'reinforcement', '12mm'], unitPrice: 82.00, unit: 'meter', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-25', category: 'Steel & Reinforcement', description: '12mm steel rod for reinforcement in concrete structures.' },
  { itemName: 'Steel Rod 16mm', keywords: ['steel', 'rod', 'rebar', 'reinforcement', '16mm'], unitPrice: 120.00, unit: 'meter', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-25', category: 'Steel & Reinforcement', description: '16mm steel rod for reinforcement in concrete structures.' },
  { itemName: 'Steel Rod 20mm', keywords: ['steel', 'rod', 'rebar', 'reinforcement', '20mm'], unitPrice: 165.00, unit: 'meter', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-25', category: 'Steel & Reinforcement', description: '20mm steel rod for reinforcement in concrete structures.' },
  { itemName: 'Steel Mesh A142', keywords: ['mesh', 'steel', 'reinforcement', 'a142'], unitPrice: 180.00, unit: 'm2', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-25', category: 'Steel & Reinforcement', description: 'Steel mesh A142 for reinforcement in concrete structures.' },
  { itemName: 'Steel Mesh A193', keywords: ['mesh', 'steel', 'reinforcement', 'a193'], unitPrice: 220.00, unit: 'm2', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-25', category: 'Steel & Reinforcement', description: 'Steel mesh A193 for reinforcement in concrete structures.' },
  { itemName: 'Steel Beam IPE200', keywords: ['beam', 'steel', 'ipe', 'i-beam', '200'], unitPrice: 2850.00, unit: 'ton', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-25', category: 'Steel Products', description: 'Steel beam IPE200 for structural applications.' },
  { itemName: 'Steel Channel 100mm', keywords: ['channel', 'steel', '100mm'], unitPrice: 2650.00, unit: 'ton', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-25', category: 'Steel Products', description: 'Steel channel 100mm for structural applications.' },
  { itemName: 'Steel Plate 10mm', keywords: ['plate', 'steel', 'sheet', '10mm'], unitPrice: 3200.00, unit: 'ton', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-25', category: 'Steel Products', description: 'Steel plate 10mm for various applications.' },
  
  // Project Management & Compliance
  { itemName: 'Monitoring of compliance with and reporting on the EMP', keywords: ['monitoring', 'compliance', 'emp', 'environmental'], unitPrice: 7800.00, unit: 'month', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Environmental Management Plan monitoring and reporting services.' },
  { itemName: 'Submission of a Scheme 2 Initial Programme', keywords: ['scheme', 'programme', 'initial', 'submission'], unitPrice: 11500.00, unit: 'sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Preparation and submission of Scheme 2 Initial Programme.' },
  { itemName: 'Submission of a Scheme 2 Full Programme', keywords: ['scheme', 'programme', 'full', 'submission'], unitPrice: 23500.00, unit: 'sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Preparation and submission of Scheme 2 Full Programme.' },
  { itemName: 'Reviewing and updating a Scheme 2 programme every month', keywords: ['scheme', 'programme', 'review', 'update', 'monthly'], unitPrice: 6200.00, unit: 'month', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Monthly review and update of Scheme 2 programme.' },
  { itemName: 'Preparation and submission of all information and reports specified in the Contract Documentation', keywords: ['reports', 'contract', 'documentation', 'submission'], unitPrice: 14200.00, unit: 'month', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Preparation and submission of contract reports and documentation.' },
  { itemName: 'Collection of rubbish / litter', keywords: ['rubbish', 'litter', 'collection', 'cleaning'], unitPrice: 3200.00, unit: 'month', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Site Maintenance', description: 'Regular collection of rubbish and litter from site.' },
  { itemName: 'Other road maintenance work ordered by the Engineer', keywords: ['road', 'maintenance', 'engineer', 'work'], unitPrice: 42000.00, unit: 'provisional sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Road Maintenance', description: 'Additional road maintenance work as ordered by the Engineer.' },
  { itemName: 'Handling cost, profit and all other charges in respect of item C1.2.3.11', keywords: ['handling', 'cost', 'profit', 'charges'], unitPrice: 4700.00, unit: 'sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Financial', description: 'Handling costs, profit and other charges for item C1.2.3.11.' },
  { itemName: 'Liaison with the routine road maintenance of a supplier', keywords: ['liaison', 'road', 'maintenance', 'supplier'], unitPrice: 4200.00, unit: 'month', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Coordination', description: 'Coordination with supplier for routine road maintenance.' },
  { itemName: 'Stakeholder liaison', keywords: ['stakeholder', 'liaison', 'engagement'], unitPrice: 6700.00, unit: 'month', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Coordination', description: 'Stakeholder engagement and liaison services.' },
  { itemName: 'Safety', keywords: ['safety', 'health', 'occupational'], unitPrice: 9000.00, unit: 'month', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Health & Safety', description: 'General safety management and compliance.' },
  { itemName: 'Stakeholder liaison about Health and safety plan', keywords: ['stakeholder', 'health', 'safety', 'plan', 'liaison'], unitPrice: 5200.00, unit: 'month', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Health & Safety', description: 'Stakeholder engagement regarding health and safety plans.' },
  { itemName: 'Implementation of Stakeholder liaison health and safety plan', keywords: ['implementation', 'stakeholder', 'health', 'safety', 'plan'], unitPrice: 7500.00, unit: 'month', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Health & Safety', description: 'Implementation of stakeholder liaison health and safety plan.' },
  
  // Labour & Daywork
  { itemName: 'Personnel Daywork', keywords: ['personnel', 'daywork', 'staff'], unitPrice: 820.00, unit: 'day', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'General personnel daywork services.' },
  { itemName: 'Unskilled labourer Daywork', keywords: ['unskilled', 'labourer', 'daywork', 'labour'], unitPrice: 330.00, unit: 'day', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Unskilled labourer daywork rate.' },
  { itemName: 'Semi-skilled labourer Daywork', keywords: ['semi-skilled', 'labourer', 'daywork', 'labour'], unitPrice: 480.00, unit: 'day', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Semi-skilled labourer daywork rate.' },
  { itemName: 'Skilled labourer Daywork', keywords: ['skilled', 'labourer', 'daywork', 'labour'], unitPrice: 720.00, unit: 'day', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Skilled labourer daywork rate.' },
  { itemName: 'Foreman Daywork', keywords: ['foreman', 'daywork', 'supervisor'], unitPrice: 1150.00, unit: 'day', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Foreman daywork rate.' },
  
  // Procurement & Disposal
  { itemName: 'Procurement of materials', keywords: ['procurement', 'materials', 'purchasing'], unitPrice: 32000.00, unit: 'provisional sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Procurement', description: 'Procurement of materials as required.' },
  { itemName: 'Supplier handling of handling costs, profit and all other charges of Procurement of materials', keywords: ['handling', 'procurement', 'costs', 'profit'], unitPrice: 7200.00, unit: 'sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Financial', description: 'Handling costs and profit for material procurement.' },
  { itemName: 'Disposal of non-useable assets', keywords: ['disposal', 'assets', 'waste'], unitPrice: 14200.00, unit: 'sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Disposal', description: 'Disposal of non-useable assets.' },
  { itemName: 'Disposal of non-useable assets identified in the Contract Documentation at time of tender', keywords: ['disposal', 'assets', 'contract', 'tender'], unitPrice: 11500.00, unit: 'sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Disposal', description: 'Disposal of assets identified at tender time.' },
  { itemName: 'Existing road studs', keywords: ['road', 'studs', 'existing'], unitPrice: 23.50, unit: 'unit', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Road Materials', description: 'Existing road studs for road marking.' },
  { itemName: 'Disposal of non-useable assets not identified at time of tender', keywords: ['disposal', 'assets', 'not', 'identified', 'tender'], unitPrice: 17000.00, unit: 'sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Disposal', description: 'Disposal of assets not identified at tender time.' },
  { itemName: 'Handling cost, profit and all other charges in respect of item C1.2.9.2', keywords: ['handling', 'cost', 'profit', 'charges', 'c1.2.9.2'], unitPrice: 5700.00, unit: 'sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Financial', description: 'Handling costs and profit for item C1.2.9.2.' },
  
  // Dispute Resolution
  { itemName: 'Dispute Adjudication Board (DAB)', keywords: ['dispute', 'adjudication', 'board', 'dab'], unitPrice: 48000.00, unit: 'provisional sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Legal & Compliance', description: 'Dispute Adjudication Board services.' },
  { itemName: 'Employer\'s contribution to DAB (50%)', keywords: ['employer', 'contribution', 'dab', 'dispute'], unitPrice: 24000.00, unit: 'provisional sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-26', category: 'Legal & Compliance', description: 'Employer contribution to Dispute Adjudication Board (50%).' },
  
  // Materials Procurement & Handling
  { itemName: 'Procurement of materials', keywords: ['procurement', 'materials', 'supply', 'purchase', 'provision', 'prov', 'sum'], unitPrice: 23500.00, unit: 'Prov Sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-27', category: 'Materials', description: 'Provisional sum for procurement of construction materials.' },
  { itemName: 'Contractor\'s handling costs, profit and all other charges (materials)', keywords: ['contractor', 'handling', 'costs', 'profit', 'charges', 'percentage', 'markup', 'c1.2.8.4'], unitPrice: 14.50, unit: '%', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-27', category: 'Materials', description: 'Contractor handling costs, profit and charges percentage for materials.' },
  
  // Community Participation
  { itemName: 'Cost for community Participation (CLO)', keywords: ['community', 'participation', 'clo', 'liaison', 'officer', 'engagement', 'pc', 'sum', 'psc1.2.10'], unitPrice: 42000.00, unit: 'PC Sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-27', category: 'Community Participation', description: 'Prime cost sum for Community Liaison Officer and participation activities.' },
  { itemName: 'Handling costs and profit (community participation)', keywords: ['handling', 'costs', 'profit', 'community', 'participation', 'percentage', 'psc1.2.10'], unitPrice: 11.50, unit: '%', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-27', category: 'Community Participation', description: 'Handling costs and profit percentage for community participation.' },
  
  // Student Remuneration
  { itemName: 'Remuneration for a student', keywords: ['remuneration', 'student', 'payment', 'salary', 'stipend', 'pc', 'sum', 'psc1.2.11'], unitPrice: 33000.00, unit: 'PC Sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-27', category: 'Student Programme', description: 'Prime cost sum for student remuneration and training.' },
  { itemName: 'Handling costs and profit (student remuneration)', keywords: ['handling', 'costs', 'profit', 'student', 'remuneration', 'percentage', 'psc1.2.11'], unitPrice: 9.50, unit: '%', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-27', category: 'Student Programme', description: 'Handling costs and profit percentage for student remuneration.' },
  
  // Environmental Control Officer
  { itemName: 'Direct payment of ECO Agent', keywords: ['eco', 'environmental', 'control', 'officer', 'agent', 'direct', 'payment', 'pc', 'sum', 'psc1.2.12'], unitPrice: 62000.00, unit: 'PC Sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-27', category: 'Environmental', description: 'Prime cost sum for Environmental Control Officer direct payment.' },
  { itemName: 'Contractor\'s handling costs, profit and charges (ECO)', keywords: ['contractor', 'handling', 'costs', 'profit', 'charges', 'eco', 'environmental', 'percentage', 'pc1.2.10'], unitPrice: 11.50, unit: '%', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-27', category: 'Environmental', description: 'Contractor handling costs, profit and charges percentage for ECO.' },
  
  // Occupational Health and Safety
  { itemName: 'Direct payment of OHS Agent', keywords: ['ohs', 'occupational', 'health', 'safety', 'agent', 'direct', 'payment', 'pc', 'sum', 'psc1.2.13'], unitPrice: 52000.00, unit: 'PC Sum', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-27', category: 'Health & Safety', description: 'Prime cost sum for Occupational Health and Safety Agent direct payment.' },
  { itemName: 'Contractor\'s handling costs, profit and charges (OHS)', keywords: ['contractor', 'handling', 'costs', 'profit', 'charges', 'ohs', 'health', 'safety', 'percentage', 'pc1.2.11'], unitPrice: 9.50, unit: '%', supplier: 'Macsteel', available: true, lastUpdated: '2026-01-27', category: 'Health & Safety', description: 'Contractor handling costs, profit and charges percentage for OHS.' },
];

// Lafarge Supplier Catalog
const lafargeCatalog: SupplierPrice[] = [
  // Cement
  { itemName: 'Cement 50kg', keywords: ['cement', 'portland', 'ppc', '50kg'], unitPrice: 87.50, unit: 'bag', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-25', category: 'Cement', description: 'High-quality Portland cement for various construction projects.' },
  { itemName: 'PPC Cement', keywords: ['ppc', 'cement', 'portland'], unitPrice: 88.99, unit: 'bag', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-25', category: 'Cement', description: 'Premier Portland cement for superior construction performance.' },
  { itemName: 'Surebuild Cement 50kg', keywords: ['cement', 'surebuild', 'portland', '50kg'], unitPrice: 84.00, unit: 'bag', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-25', category: 'Cement', description: 'Surebuild cement for reliable construction needs.' },
  
  // Concrete
  { itemName: 'Ready Mix Concrete', keywords: ['concrete', 'ready mix', 'premix'], unitPrice: 1180.00, unit: 'm3', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-25', category: 'Concrete', description: 'Ready mix concrete for quick and efficient construction.' },
  { itemName: 'Concrete 20MPa', keywords: ['concrete', '20mpa', 'ready mix'], unitPrice: 1150.00, unit: 'm3', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-25', category: 'Concrete', description: '20MPa concrete for various construction projects.' },
  { itemName: 'Concrete 30MPa', keywords: ['concrete', '30mpa', 'ready mix'], unitPrice: 1280.00, unit: 'm3', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-25', category: 'Concrete', description: '30MPa concrete for various construction projects.' },
  { itemName: 'Concrete 40MPa', keywords: ['concrete', '40mpa', 'ready mix'], unitPrice: 1450.00, unit: 'm3', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-25', category: 'Concrete', description: '40MPa concrete for various construction projects.' },
  
  // Aggregates
  { itemName: 'Crusher Stone 19mm', keywords: ['stone', 'crusher', 'aggregate', '19mm'], unitPrice: 340.00, unit: 'ton', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-25', category: 'Sand & Aggregates', description: '19mm crusher stone for concrete mixing and construction.' },
  { itemName: 'Crusher Stone 13mm', keywords: ['stone', 'crusher', 'aggregate', '13mm'], unitPrice: 345.00, unit: 'ton', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-25', category: 'Sand & Aggregates', description: '13mm crusher stone for concrete mixing and construction.' },
  
  // Project Management & Compliance
  { itemName: 'Monitoring of compliance with and reporting on the EMP', keywords: ['monitoring', 'compliance', 'emp', 'environmental'], unitPrice: 9200.00, unit: 'month', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Environmental Management Plan monitoring and reporting services.' },
  { itemName: 'Submission of a Scheme 2 Initial Programme', keywords: ['scheme', 'programme', 'initial', 'submission'], unitPrice: 13000.00, unit: 'sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Preparation and submission of Scheme 2 Initial Programme.' },
  { itemName: 'Submission of a Scheme 2 Full Programme', keywords: ['scheme', 'programme', 'full', 'submission'], unitPrice: 27000.00, unit: 'sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Preparation and submission of Scheme 2 Full Programme.' },
  { itemName: 'Reviewing and updating a Scheme 2 programme every month', keywords: ['scheme', 'programme', 'review', 'update', 'monthly'], unitPrice: 7000.00, unit: 'month', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Monthly review and update of Scheme 2 programme.' },
  { itemName: 'Preparation and submission of all information and reports specified in the Contract Documentation', keywords: ['reports', 'contract', 'documentation', 'submission'], unitPrice: 16000.00, unit: 'month', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Preparation and submission of contract reports and documentation.' },
  { itemName: 'Collection of rubbish / litter', keywords: ['rubbish', 'litter', 'collection', 'cleaning'], unitPrice: 3800.00, unit: 'month', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Site Maintenance', description: 'Regular collection of rubbish and litter from site.' },
  { itemName: 'Other road maintenance work ordered by the Engineer', keywords: ['road', 'maintenance', 'engineer', 'work'], unitPrice: 48000.00, unit: 'provisional sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Road Maintenance', description: 'Additional road maintenance work as ordered by the Engineer.' },
  { itemName: 'Handling cost, profit and all other charges in respect of item C1.2.3.11', keywords: ['handling', 'cost', 'profit', 'charges'], unitPrice: 5400.00, unit: 'sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Financial', description: 'Handling costs, profit and other charges for item C1.2.3.11.' },
  { itemName: 'Liaison with the routine road maintenance of a supplier', keywords: ['liaison', 'road', 'maintenance', 'supplier'], unitPrice: 4800.00, unit: 'month', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Coordination', description: 'Coordination with supplier for routine road maintenance.' },
  { itemName: 'Stakeholder liaison', keywords: ['stakeholder', 'liaison', 'engagement'], unitPrice: 7500.00, unit: 'month', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Coordination', description: 'Stakeholder engagement and liaison services.' },
  { itemName: 'Safety', keywords: ['safety', 'health', 'occupational'], unitPrice: 10000.00, unit: 'month', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Health & Safety', description: 'General safety management and compliance.' },
  { itemName: 'Stakeholder liaison about Health and safety plan', keywords: ['stakeholder', 'health', 'safety', 'plan', 'liaison'], unitPrice: 5800.00, unit: 'month', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Health & Safety', description: 'Stakeholder engagement regarding health and safety plans.' },
  { itemName: 'Implementation of Stakeholder liaison health and safety plan', keywords: ['implementation', 'stakeholder', 'health', 'safety', 'plan'], unitPrice: 8500.00, unit: 'month', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Health & Safety', description: 'Implementation of stakeholder liaison health and safety plan.' },
  
  // Labour & Daywork
  { itemName: 'Personnel Daywork', keywords: ['personnel', 'daywork', 'staff'], unitPrice: 900.00, unit: 'day', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'General personnel daywork services.' },
  { itemName: 'Unskilled labourer Daywork', keywords: ['unskilled', 'labourer', 'daywork', 'labour'], unitPrice: 370.00, unit: 'day', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Unskilled labourer daywork rate.' },
  { itemName: 'Semi-skilled labourer Daywork', keywords: ['semi-skilled', 'labourer', 'daywork', 'labour'], unitPrice: 520.00, unit: 'day', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Semi-skilled labourer daywork rate.' },
  { itemName: 'Skilled labourer Daywork', keywords: ['skilled', 'labourer', 'daywork', 'labour'], unitPrice: 780.00, unit: 'day', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Skilled labourer daywork rate.' },
  { itemName: 'Foreman Daywork', keywords: ['foreman', 'daywork', 'supervisor'], unitPrice: 1250.00, unit: 'day', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Foreman daywork rate.' },
  
  // Procurement & Disposal
  { itemName: 'Procurement of materials', keywords: ['procurement', 'materials', 'purchasing'], unitPrice: 38000.00, unit: 'provisional sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Procurement', description: 'Procurement of materials as required.' },
  { itemName: 'Supplier handling of handling costs, profit and all other charges of Procurement of materials', keywords: ['handling', 'procurement', 'costs', 'profit'], unitPrice: 7800.00, unit: 'sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Financial', description: 'Handling costs and profit for material procurement.' },
  { itemName: 'Disposal of non-useable assets', keywords: ['disposal', 'assets', 'waste'], unitPrice: 16000.00, unit: 'sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Disposal', description: 'Disposal of non-useable assets.' },
  { itemName: 'Disposal of non-useable assets identified in the Contract Documentation at time of tender', keywords: ['disposal', 'assets', 'contract', 'tender'], unitPrice: 13000.00, unit: 'sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Disposal', description: 'Disposal of assets identified at tender time.' },
  { itemName: 'Existing road studs', keywords: ['road', 'studs', 'existing'], unitPrice: 27.00, unit: 'unit', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Road Materials', description: 'Existing road studs for road marking.' },
  { itemName: 'Disposal of non-useable assets not identified at time of tender', keywords: ['disposal', 'assets', 'not', 'identified', 'tender'], unitPrice: 19000.00, unit: 'sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Disposal', description: 'Disposal of assets not identified at tender time.' },
  { itemName: 'Handling cost, profit and all other charges in respect of item C1.2.9.2', keywords: ['handling', 'cost', 'profit', 'charges', 'c1.2.9.2'], unitPrice: 6500.00, unit: 'sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Financial', description: 'Handling costs and profit for item C1.2.9.2.' },
  
  // Dispute Resolution
  { itemName: 'Dispute Adjudication Board (DAB)', keywords: ['dispute', 'adjudication', 'board', 'dab'], unitPrice: 55000.00, unit: 'provisional sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Legal & Compliance', description: 'Dispute Adjudication Board services.' },
  { itemName: 'Employer\'s contribution to DAB (50%)', keywords: ['employer', 'contribution', 'dab', 'dispute'], unitPrice: 27500.00, unit: 'provisional sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-26', category: 'Legal & Compliance', description: 'Employer contribution to Dispute Adjudication Board (50%).' },
  
  // Plant & Equipment Hire
  { itemName: '10m3 Tippers', keywords: ['10m3', 'tippers', 'tipper', 'truck', 'dump', 'dumper', 'transport', 'haulage'], unitPrice: 870.00, unit: 'hour', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-27', category: 'Plant Hire', description: '10m3 tipper truck hire per hour for material transport.' },
  { itemName: 'Waterpump (Capacity 50,000 liter/hr medium)', keywords: ['waterpump', 'water', 'pump', '50000', '50', '000', 'liter', 'litre', 'hr', 'hour', 'medium', 'capacity', 'dewatering'], unitPrice: 460.00, unit: 'hour', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-27', category: 'Plant Hire', description: 'Water pump with 50,000 liter/hr capacity for dewatering and water transfer.' },
  
  // Vehicles
  { itemName: 'Light delivery vehicle', keywords: ['light', 'delivery', 'vehicle', 'ldv', 'bakkie', 'van', 'transport'], unitPrice: 13.00, unit: 'km', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-27', category: 'Vehicles', description: 'Light delivery vehicle hire per kilometer.' },
  { itemName: 'Flatbed truck', keywords: ['flatbed', 'flat', 'bed', 'truck', 'transport', 'lorry'], unitPrice: 19.00, unit: 'km', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-27', category: 'Vehicles', description: 'Flatbed truck hire per kilometer for material transport.' },
  
  // Materials Procurement & Handling
  { itemName: 'Procurement of materials', keywords: ['procurement', 'materials', 'supply', 'purchase', 'provision', 'prov', 'sum'], unitPrice: 26000.00, unit: 'Prov Sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-27', category: 'Materials', description: 'Provisional sum for procurement of construction materials.' },
  { itemName: 'Contractor\'s handling costs, profit and all other charges (materials)', keywords: ['contractor', 'handling', 'costs', 'profit', 'charges', 'percentage', 'markup', 'c1.2.8.4'], unitPrice: 15.50, unit: '%', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-27', category: 'Materials', description: 'Contractor handling costs, profit and charges percentage for materials.' },
  
  // Community Participation
  { itemName: 'Cost for community Participation (CLO)', keywords: ['community', 'participation', 'clo', 'liaison', 'officer', 'engagement', 'pc', 'sum', 'psc1.2.10'], unitPrice: 47000.00, unit: 'PC Sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-27', category: 'Community Participation', description: 'Prime cost sum for Community Liaison Officer and participation activities.' },
  { itemName: 'Handling costs and profit (community participation)', keywords: ['handling', 'costs', 'profit', 'community', 'participation', 'percentage', 'psc1.2.10'], unitPrice: 13.00, unit: '%', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-27', category: 'Community Participation', description: 'Handling costs and profit percentage for community participation.' },
  
  // Student Remuneration
  { itemName: 'Remuneration for a student', keywords: ['remuneration', 'student', 'payment', 'salary', 'stipend', 'pc', 'sum', 'psc1.2.11'], unitPrice: 37000.00, unit: 'PC Sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-27', category: 'Student Programme', description: 'Prime cost sum for student remuneration and training.' },
  { itemName: 'Handling costs and profit (student remuneration)', keywords: ['handling', 'costs', 'profit', 'student', 'remuneration', 'percentage', 'psc1.2.11'], unitPrice: 11.00, unit: '%', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-27', category: 'Student Programme', description: 'Handling costs and profit percentage for student remuneration.' },
  
  // Environmental Control Officer
  { itemName: 'Direct payment of ECO Agent', keywords: ['eco', 'environmental', 'control', 'officer', 'agent', 'direct', 'payment', 'pc', 'sum', 'psc1.2.12'], unitPrice: 68000.00, unit: 'PC Sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-27', category: 'Environmental', description: 'Prime cost sum for Environmental Control Officer direct payment.' },
  { itemName: 'Contractor\'s handling costs, profit and charges (ECO)', keywords: ['contractor', 'handling', 'costs', 'profit', 'charges', 'eco', 'environmental', 'percentage', 'pc1.2.10'], unitPrice: 12.50, unit: '%', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-27', category: 'Environmental', description: 'Contractor handling costs, profit and charges percentage for ECO.' },
  
  // Occupational Health and Safety
  { itemName: 'Direct payment of OHS Agent', keywords: ['ohs', 'occupational', 'health', 'safety', 'agent', 'direct', 'payment', 'pc', 'sum', 'psc1.2.13'], unitPrice: 58000.00, unit: 'PC Sum', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-27', category: 'Health & Safety', description: 'Prime cost sum for Occupational Health and Safety Agent direct payment.' },
  { itemName: 'Contractor\'s handling costs, profit and charges (OHS)', keywords: ['contractor', 'handling', 'costs', 'profit', 'charges', 'ohs', 'health', 'safety', 'percentage', 'pc1.2.11'], unitPrice: 11.00, unit: '%', supplier: 'Lafarge', available: true, lastUpdated: '2026-01-27', category: 'Health & Safety', description: 'Contractor handling costs, profit and charges percentage for OHS.' },
];

// Raumix Supplier Catalog
const raumixCatalog: SupplierPrice[] = [
  // Cement
  { itemName: 'Cement 50kg', keywords: ['cement', 'portland', 'ppc', '50kg'], unitPrice: 86.99, unit: 'bag', supplier: 'Raumix', available: true, lastUpdated: '2026-01-25', category: 'Cement', description: 'High-quality Portland cement for various construction projects.' },
  { itemName: 'PPC Cement', keywords: ['ppc', 'cement', 'portland'], unitPrice: 90.50, unit: 'bag', supplier: 'Raumix', available: true, lastUpdated: '2026-01-25', category: 'Cement', description: 'Premier Portland cement for superior construction performance.' },
  
  // Concrete
  { itemName: 'Ready Mix Concrete', keywords: ['concrete', 'ready mix', 'premix'], unitPrice: 1200.00, unit: 'm3', supplier: 'Raumix', available: true, lastUpdated: '2026-01-25', category: 'Concrete', description: 'Ready mix concrete for quick and efficient construction.' },
  { itemName: 'Concrete 25MPa', keywords: ['concrete', '25mpa', 'ready mix'], unitPrice: 1220.00, unit: 'm3', supplier: 'Raumix', available: true, lastUpdated: '2026-01-25', category: 'Concrete', description: '25MPa concrete for various construction projects.' },
  
  // Sand
  { itemName: 'Building Sand', keywords: ['sand', 'building', 'plaster', 'fine'], unitPrice: 420.00, unit: 'ton', supplier: 'Raumix', available: true, lastUpdated: '2026-01-25', category: 'Sand & Aggregates', description: 'Fine building sand for plastering and concrete mixing.' },
  { itemName: 'Plaster Sand', keywords: ['sand', 'plaster', 'fine'], unitPrice: 430.00, unit: 'ton', supplier: 'Raumix', available: true, lastUpdated: '2026-01-25', category: 'Sand & Aggregates', description: 'Fine plaster sand for plastering and concrete mixing.' },
  
  // Bricks
  { itemName: 'Clay Brick', keywords: ['brick', 'clay', 'standard', 'building'], unitPrice: 2.75, unit: 'unit', supplier: 'Raumix', available: true, lastUpdated: '2026-01-25', category: 'Bricks & Blocks', description: 'Standard clay brick for building walls and structures.' },
  { itemName: 'Concrete Block', keywords: ['block', 'concrete', 'hollow'], unitPrice: 11.90, unit: 'unit', supplier: 'Raumix', available: true, lastUpdated: '2026-01-25', category: 'Bricks & Blocks', description: 'Hollow concrete block for load-bearing walls.' },
  
  // Project Management & Compliance  
  { itemName: 'Monitoring of compliance with and reporting on the EMP', keywords: ['monitoring', 'compliance', 'emp', 'environmental'], unitPrice: 8200.00, unit: 'month', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Environmental Management Plan monitoring and reporting services.' },
  { itemName: 'Submission of a Scheme 2 Initial Programme', keywords: ['scheme', 'programme', 'initial', 'submission'], unitPrice: 11800.00, unit: 'sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Preparation and submission of Scheme 2 Initial Programme.' },
  { itemName: 'Submission of a Scheme 2 Full Programme', keywords: ['scheme', 'programme', 'full', 'submission'], unitPrice: 24500.00, unit: 'sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Preparation and submission of Scheme 2 Full Programme.' },
  { itemName: 'Reviewing and updating a Scheme 2 programme every month', keywords: ['scheme', 'programme', 'review', 'update', 'monthly'], unitPrice: 6300.00, unit: 'month', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Monthly review and update of Scheme 2 programme.' },
  { itemName: 'Preparation and submission of all information and reports specified in the Contract Documentation', keywords: ['reports', 'contract', 'documentation', 'submission'], unitPrice: 14500.00, unit: 'month', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Project Management', description: 'Preparation and submission of contract reports and documentation.' },
  { itemName: 'Collection of rubbish / litter', keywords: ['rubbish', 'litter', 'collection', 'cleaning'], unitPrice: 3300.00, unit: 'month', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Site Maintenance', description: 'Regular collection of rubbish and litter from site.' },
  { itemName: 'Other road maintenance work ordered by the Engineer', keywords: ['road', 'maintenance', 'engineer', 'work'], unitPrice: 43500.00, unit: 'provisional sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Road Maintenance', description: 'Additional road maintenance work as ordered by the Engineer.' },
  { itemName: 'Handling cost, profit and all other charges in respect of item C1.2.3.11', keywords: ['handling', 'cost', 'profit', 'charges'], unitPrice: 4900.00, unit: 'sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Financial', description: 'Handling costs, profit and other charges for item C1.2.3.11.' },
  { itemName: 'Liaison with the routine road maintenance of a supplier', keywords: ['liaison', 'road', 'maintenance', 'supplier'], unitPrice: 4400.00, unit: 'month', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Coordination', description: 'Coordination with supplier for routine road maintenance.' },
  { itemName: 'Stakeholder liaison', keywords: ['stakeholder', 'liaison', 'engagement'], unitPrice: 6900.00, unit: 'month', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Coordination', description: 'Stakeholder engagement and liaison services.' },
  { itemName: 'Safety', keywords: ['safety', 'health', 'occupational'], unitPrice: 9200.00, unit: 'month', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Health & Safety', description: 'General safety management and compliance.' },
  { itemName: 'Stakeholder liaison about Health and safety plan', keywords: ['stakeholder', 'health', 'safety', 'plan', 'liaison'], unitPrice: 5400.00, unit: 'month', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Health & Safety', description: 'Stakeholder engagement regarding health and safety plans.' },
  { itemName: 'Implementation of Stakeholder liaison health and safety plan', keywords: ['implementation', 'stakeholder', 'health', 'safety', 'plan'], unitPrice: 7800.00, unit: 'month', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Health & Safety', description: 'Implementation of stakeholder liaison health and safety plan.' },
  
  // Labour & Daywork
  { itemName: 'Personnel Daywork', keywords: ['personnel', 'daywork', 'staff'], unitPrice: 840.00, unit: 'day', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'General personnel daywork services.' },
  { itemName: 'Unskilled labourer Daywork', keywords: ['unskilled', 'labourer', 'daywork', 'labour'], unitPrice: 340.00, unit: 'day', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Unskilled labourer daywork rate.' },
  { itemName: 'Semi-skilled labourer Daywork', keywords: ['semi-skilled', 'labourer', 'daywork', 'labour'], unitPrice: 490.00, unit: 'day', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Semi-skilled labourer daywork rate.' },
  { itemName: 'Skilled labourer Daywork', keywords: ['skilled', 'labourer', 'daywork', 'labour'], unitPrice: 740.00, unit: 'day', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Skilled labourer daywork rate.' },
  { itemName: 'Foreman Daywork', keywords: ['foreman', 'daywork', 'supervisor'], unitPrice: 1180.00, unit: 'day', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Labour', description: 'Foreman daywork rate.' },
  
  // Procurement & Disposal
  { itemName: 'Procurement of materials', keywords: ['procurement', 'materials', 'purchasing'], unitPrice: 33500.00, unit: 'provisional sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Procurement', description: 'Procurement of materials as required.' },
  { itemName: 'Supplier handling of handling costs, profit and all other charges of Procurement of materials', keywords: ['handling', 'procurement', 'costs', 'profit'], unitPrice: 7300.00, unit: 'sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Financial', description: 'Handling costs and profit for material procurement.' },
  { itemName: 'Disposal of non-useable assets', keywords: ['disposal', 'assets', 'waste'], unitPrice: 14500.00, unit: 'sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Disposal', description: 'Disposal of non-useable assets.' },
  { itemName: 'Disposal of non-useable assets identified in the Contract Documentation at time of tender', keywords: ['disposal', 'assets', 'contract', 'tender'], unitPrice: 11800.00, unit: 'sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Disposal', description: 'Disposal of assets identified at tender time.' },
  { itemName: 'Existing road studs', keywords: ['road', 'studs', 'existing'], unitPrice: 24.50, unit: 'unit', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Road Materials', description: 'Existing road studs for road marking.' },
  { itemName: 'Disposal of non-useable assets not identified at time of tender', keywords: ['disposal', 'assets', 'not', 'identified', 'tender'], unitPrice: 17500.00, unit: 'sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Disposal', description: 'Disposal of assets not identified at tender time.' },
  { itemName: 'Handling cost, profit and all other charges in respect of item C1.2.9.2', keywords: ['handling', 'cost', 'profit', 'charges', 'c1.2.9.2'], unitPrice: 5900.00, unit: 'sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Financial', description: 'Handling costs and profit for item C1.2.9.2.' },
  
  // Dispute Resolution
  { itemName: 'Dispute Adjudication Board (DAB)', keywords: ['dispute', 'adjudication', 'board', 'dab'], unitPrice: 49500.00, unit: 'provisional sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Legal & Compliance', description: 'Dispute Adjudication Board services.' },
  { itemName: 'Employer\'s contribution to DAB (50%)', keywords: ['employer', 'contribution', 'dab', 'dispute'], unitPrice: 24750.00, unit: 'provisional sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-26', category: 'Legal & Compliance', description: 'Employer contribution to Dispute Adjudication Board (50%).' },
  
  // Plant & Equipment Hire
  { itemName: '10m3 Tippers', keywords: ['10m3', 'tippers', 'tipper', 'truck', 'dump', 'dumper', 'transport', 'haulage'], unitPrice: 830.00, unit: 'hour', supplier: 'Raumix', available: true, lastUpdated: '2026-01-27', category: 'Plant Hire', description: '10m3 tipper truck hire per hour for material transport.' },
  { itemName: 'Waterpump (Capacity 50,000 liter/hr medium)', keywords: ['waterpump', 'water', 'pump', '50000', '50', '000', 'liter', 'litre', 'hr', 'hour', 'medium', 'capacity', 'dewatering'], unitPrice: 440.00, unit: 'hour', supplier: 'Raumix', available: true, lastUpdated: '2026-01-27', category: 'Plant Hire', description: 'Water pump with 50,000 liter/hr capacity for dewatering and water transfer.' },
  
  // Vehicles
  { itemName: 'Light delivery vehicle', keywords: ['light', 'delivery', 'vehicle', 'ldv', 'bakkie', 'van', 'transport'], unitPrice: 12.25, unit: 'km', supplier: 'Raumix', available: true, lastUpdated: '2026-01-27', category: 'Vehicles', description: 'Light delivery vehicle hire per kilometer.' },
  { itemName: 'Flatbed truck', keywords: ['flatbed', 'flat', 'bed', 'truck', 'transport', 'lorry'], unitPrice: 18.25, unit: 'km', supplier: 'Raumix', available: true, lastUpdated: '2026-01-27', category: 'Vehicles', description: 'Flatbed truck hire per kilometer for material transport.' },
  
  // Materials Procurement & Handling
  { itemName: 'Procurement of materials', keywords: ['procurement', 'materials', 'supply', 'purchase', 'provision', 'prov', 'sum'], unitPrice: 24500.00, unit: 'Prov Sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-27', category: 'Materials', description: 'Provisional sum for procurement of construction materials.' },
  { itemName: 'Contractor\'s handling costs, profit and all other charges (materials)', keywords: ['contractor', 'handling', 'costs', 'profit', 'charges', 'percentage', 'markup', 'c1.2.8.4'], unitPrice: 14.75, unit: '%', supplier: 'Raumix', available: true, lastUpdated: '2026-01-27', category: 'Materials', description: 'Contractor handling costs, profit and charges percentage for materials.' },
  
  // Community Participation
  { itemName: 'Cost for community Participation (CLO)', keywords: ['community', 'participation', 'clo', 'liaison', 'officer', 'engagement', 'pc', 'sum', 'psc1.2.10'], unitPrice: 43500.00, unit: 'PC Sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-27', category: 'Community Participation', description: 'Prime cost sum for Community Liaison Officer and participation activities.' },
  { itemName: 'Handling costs and profit (community participation)', keywords: ['handling', 'costs', 'profit', 'community', 'participation', 'percentage', 'psc1.2.10'], unitPrice: 12.00, unit: '%', supplier: 'Raumix', available: true, lastUpdated: '2026-01-27', category: 'Community Participation', description: 'Handling costs and profit percentage for community participation.' },
  
  // Student Remuneration
  { itemName: 'Remuneration for a student', keywords: ['remuneration', 'student', 'payment', 'salary', 'stipend', 'pc', 'sum', 'psc1.2.11'], unitPrice: 34500.00, unit: 'PC Sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-27', category: 'Student Programme', description: 'Prime cost sum for student remuneration and training.' },
  { itemName: 'Handling costs and profit (student remuneration)', keywords: ['handling', 'costs', 'profit', 'student', 'remuneration', 'percentage', 'psc1.2.11'], unitPrice: 9.75, unit: '%', supplier: 'Raumix', available: true, lastUpdated: '2026-01-27', category: 'Student Programme', description: 'Handling costs and profit percentage for student remuneration.' },
  
  // Environmental Control Officer
  { itemName: 'Direct payment of ECO Agent', keywords: ['eco', 'environmental', 'control', 'officer', 'agent', 'direct', 'payment', 'pc', 'sum', 'psc1.2.12'], unitPrice: 63500.00, unit: 'PC Sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-27', category: 'Environmental', description: 'Prime cost sum for Environmental Control Officer direct payment.' },
  { itemName: 'Contractor\'s handling costs, profit and charges (ECO)', keywords: ['contractor', 'handling', 'costs', 'profit', 'charges', 'eco', 'environmental', 'percentage', 'pc1.2.10'], unitPrice: 11.75, unit: '%', supplier: 'Raumix', available: true, lastUpdated: '2026-01-27', category: 'Environmental', description: 'Contractor handling costs, profit and charges percentage for ECO.' },
  
  // Occupational Health and Safety
  { itemName: 'Direct payment of OHS Agent', keywords: ['ohs', 'occupational', 'health', 'safety', 'agent', 'direct', 'payment', 'pc', 'sum', 'psc1.2.13'], unitPrice: 53500.00, unit: 'PC Sum', supplier: 'Raumix', available: true, lastUpdated: '2026-01-27', category: 'Health & Safety', description: 'Prime cost sum for Occupational Health and Safety Agent direct payment.' },
  { itemName: 'Contractor\'s handling costs, profit and charges (OHS)', keywords: ['contractor', 'handling', 'costs', 'profit', 'charges', 'ohs', 'health', 'safety', 'percentage', 'pc1.2.11'], unitPrice: 9.75, unit: '%', supplier: 'Raumix', available: true, lastUpdated: '2026-01-27', category: 'Health & Safety', description: 'Contractor handling costs, profit and charges percentage for OHS.' },
];

// ===== NEW SUPPLIERS =====

// KSB - Water Equipment
const ksbCatalog: SupplierPrice[] = [
  { itemName: 'Centrifugal Pump 50mm', keywords: ['pump', 'centrifugal', '50mm', 'water'], unitPrice: 12500.00, unit: 'unit', supplier: 'KSB', available: true, lastUpdated: '2026-01-26', category: 'Water Equipment', description: 'High-efficiency centrifugal pump for water supply systems.' },
  { itemName: 'Gate Valve 100mm', keywords: ['valve', 'gate', '100mm', 'water'], unitPrice: 2850.00, unit: 'unit', supplier: 'KSB', available: true, lastUpdated: '2026-01-26', category: 'Water Fittings', description: 'Gate valve for water control systems.' },
];

// ZENZELE - Water Pipes
const zenzeleCatalog: SupplierPrice[] = [
  { itemName: 'HDPE Pipe 110mm', keywords: ['hdpe', 'pipe', '110mm', 'water'], unitPrice: 185.00, unit: 'meter', supplier: 'ZENZELE', available: true, lastUpdated: '2026-01-26', category: 'Water Pipes', description: 'High-density polyethylene pipe for water distribution.' },
  { itemName: 'Water Tank 5000L', keywords: ['tank', 'water', 'storage', '5000'], unitPrice: 8500.00, unit: 'unit', supplier: 'ZENZELE', available: true, lastUpdated: '2026-01-26', category: 'Water Storage', description: '5000L water storage tank.' },
];

// AVK - Water Valves
const avkCatalog: SupplierPrice[] = [
  { itemName: 'Gate Valve 80mm', keywords: ['valve', 'gate', '80mm', 'water'], unitPrice: 2650.00, unit: 'unit', supplier: 'AVK', available: true, lastUpdated: '2026-01-26', category: 'Water Fittings', description: 'Resilient seated gate valve for water networks.' },
  { itemName: 'Hydrant Valve 100mm', keywords: ['hydrant', 'valve', '100mm', 'fire'], unitPrice: 3850.00, unit: 'unit', supplier: 'AVK', available: true, lastUpdated: '2026-01-26', category: 'Water Fittings', description: 'Fire hydrant valve for emergency water supply.' },
];

// SIZABANTU - Water Infrastructure
const sizabantuCatalog: SupplierPrice[] = [
  { itemName: 'uPVC Pipe 110mm Class 12', keywords: ['upvc', 'pipe', '110mm', 'water'], unitPrice: 165.00, unit: 'meter', supplier: 'SIZABANTU', available: true, lastUpdated: '2026-01-26', category: 'Water Pipes', description: 'uPVC pressure pipe for water distribution.' },
  { itemName: 'DI Pipe 150mm', keywords: ['ductile', 'iron', 'pipe', '150mm', 'water'], unitPrice: 650.00, unit: 'meter', supplier: 'SIZABANTU', available: true, lastUpdated: '2026-01-26', category: 'Water Pipes', description: 'Ductile iron pipe for water distribution.' },
];

// STEWARDS&LLODS - Precast Concrete
const stewardsllodsCatalog: SupplierPrice[] = [
  { itemName: 'Concrete Pipe 450mm', keywords: ['concrete', 'pipe', '450mm', 'sewer'], unitPrice: 385.00, unit: 'meter', supplier: 'STEWARDS&LLODS', available: true, lastUpdated: '2026-01-26', category: 'Water Infrastructure', description: 'Reinforced concrete pipe for sewer systems.' },
  { itemName: 'Precast Manhole 1200mm', keywords: ['manhole', 'precast', '1200mm', 'chamber'], unitPrice: 4500.00, unit: 'unit', supplier: 'STEWARDS&LLODS', available: true, lastUpdated: '2026-01-26', category: 'Water Infrastructure', description: 'Precast concrete manhole chamber.' },
];

// MARLEY - Drainage Products
const marleyCatalog: SupplierPrice[] = [
  { itemName: 'uPVC Gutter 150mm', keywords: ['gutter', 'upvc', '150mm', 'rainwater'], unitPrice: 95.00, unit: 'meter', supplier: 'MARLEY', available: true, lastUpdated: '2026-01-26', category: 'Drainage', description: 'uPVC rainwater gutter for roof drainage.' },
  { itemName: 'PVC Sewer Pipe 110mm', keywords: ['pvc', 'pipe', '110mm', 'sewer'], unitPrice: 135.00, unit: 'meter', supplier: 'MARLEY', available: true, lastUpdated: '2026-01-26', category: 'Drainage', description: 'PVC sewer pipe for drainage systems.' },
];

// EAST COAST - Asphalt & Road Surfacing
const eastCoastCatalog: SupplierPrice[] = [
  { itemName: 'Asphalt Mix AC20', keywords: ['asphalt', 'mix', 'ac20', 'surfacing'], unitPrice: 850.00, unit: 'ton', supplier: 'EAST COAST', available: true, lastUpdated: '2026-01-26', category: 'Road Surfacing', description: 'AC20 asphalt mix for road surfacing.' },
  { itemName: 'Tack Coat Bitumen', keywords: ['tack', 'coat', 'bitumen', 'emulsion'], unitPrice: 45.00, unit: 'liter', supplier: 'EAST COAST', available: true, lastUpdated: '2026-01-26', category: 'Road Materials', description: 'Bitumen tack coat for asphalt bonding.' },
];

// MUCH PLANT - Plant Hire
const muchPlantCatalog: SupplierPrice[] = [
  { itemName: 'Excavator Hire with Operator', keywords: ['excavator', 'hire', 'plant', 'operator'], unitPrice: 1850.00, unit: 'day', supplier: 'MUCH PLANT', available: true, lastUpdated: '2026-01-26', category: 'Plant Hire', description: 'Excavator hire with qualified operator.' },
  { itemName: 'Grader Hire with Operator', keywords: ['grader', 'hire', 'plant', 'operator'], unitPrice: 2500.00, unit: 'day', supplier: 'MUCH PLANT', available: true, lastUpdated: '2026-01-26', category: 'Plant Hire', description: 'Motor grader hire with operator.' },
  
  // Plant & Equipment Hire
  { itemName: '10m3 Tippers', keywords: ['10m3', 'tippers', 'tipper', 'truck', 'dump', 'dumper', 'transport', 'haulage'], unitPrice: 800.00, unit: 'hour', supplier: 'MUCH PLANT', available: true, lastUpdated: '2026-01-27', category: 'Plant Hire', description: '10m3 tipper truck hire per hour for material transport.' },
  { itemName: 'Waterpump (Capacity 50,000 liter/hr medium)', keywords: ['waterpump', 'water', 'pump', '50000', '50', '000', 'liter', 'litre', 'hr', 'hour', 'medium', 'capacity', 'dewatering'], unitPrice: 420.00, unit: 'hour', supplier: 'MUCH PLANT', available: true, lastUpdated: '2026-01-27', category: 'Plant Hire', description: 'Water pump with 50,000 liter/hr capacity for dewatering and water transfer.' },
  
  // Vehicles
  { itemName: 'Light delivery vehicle', keywords: ['light', 'delivery', 'vehicle', 'ldv', 'bakkie', 'van', 'transport'], unitPrice: 11.50, unit: 'km', supplier: 'MUCH PLANT', available: true, lastUpdated: '2026-01-27', category: 'Vehicles', description: 'Light delivery vehicle hire per kilometer.' },
  { itemName: 'Flatbed truck', keywords: ['flatbed', 'flat', 'bed', 'truck', 'transport', 'lorry'], unitPrice: 17.50, unit: 'km', supplier: 'MUCH PLANT', available: true, lastUpdated: '2026-01-27', category: 'Vehicles', description: 'Flatbed truck hire per kilometer for material transport.' },
];

// POLOKWANE SURFACING - Road Surface Treatments
const polokwaneSurfacingCatalog: SupplierPrice[] = [
  { itemName: 'Cold Mix Asphalt', keywords: ['cold', 'mix', 'asphalt', 'patching'], unitPrice: 950.00, unit: 'ton', supplier: 'POLOKWANE SURFACING', available: true, lastUpdated: '2026-01-26', category: 'Road Surfacing', description: 'Cold mix asphalt for road repairs.' },
  { itemName: 'Slurry Seal Application', keywords: ['slurry', 'seal', 'surfacing', 'road'], unitPrice: 65.00, unit: 'm2', supplier: 'POLOKWANE SURFACING', available: true, lastUpdated: '2026-01-26', category: 'Road Surfacing', description: 'Slurry seal surface treatment.' },
];

// BOSUN - Road Furniture
const bosunCatalog: SupplierPrice[] = [
  { itemName: 'Road Stud Reflective', keywords: ['road', 'stud', 'reflective', 'cat eye'], unitPrice: 35.00, unit: 'unit', supplier: 'BOSUN', available: true, lastUpdated: '2026-01-26', category: 'Road Furniture', description: 'Reflective road stud for lane marking.' },
  { itemName: 'Guard Rail W-Beam', keywords: ['guard', 'rail', 'barrier', 'beam'], unitPrice: 450.00, unit: 'meter', supplier: 'BOSUN', available: true, lastUpdated: '2026-01-26', category: 'Road Safety', description: 'W-beam guard rail for road safety.' },
];

// ACTOM - Electrical Equipment
const actomCatalog: SupplierPrice[] = [
  { itemName: 'Transformer 500kVA', keywords: ['transformer', '500kva', 'electrical', 'power'], unitPrice: 185000.00, unit: 'unit', supplier: 'ACTOM', available: true, lastUpdated: '2026-01-26', category: 'Electrical Equipment', description: '500kVA distribution transformer.' },
  { itemName: 'Electric Motor 15kW', keywords: ['motor', 'electric', '15kw', 'industrial'], unitPrice: 18500.00, unit: 'unit', supplier: 'ACTOM', available: true, lastUpdated: '2026-01-26', category: 'Motors', description: '15kW three-phase electric motor.' },
];

// ABADERE - Street Lighting
const abadereCatalog: SupplierPrice[] = [
  { itemName: 'Steel Lighting Pole 8m', keywords: ['lighting', 'pole', 'steel', '8m', 'street'], unitPrice: 4500.00, unit: 'unit', supplier: 'ABADERE', available: true, lastUpdated: '2026-01-26', category: 'Street Lighting', description: '8m galvanized steel lighting pole.' },
  { itemName: 'LED Street Light 60W', keywords: ['led', 'street', 'light', '60w', 'luminaire'], unitPrice: 2850.00, unit: 'unit', supplier: 'ABADERE', available: true, lastUpdated: '2026-01-26', category: 'Street Lighting', description: '60W LED street light luminaire.' },
];

// ARB - Electrical Cables
const arbCatalog: SupplierPrice[] = [
  { itemName: 'XLPE Cable 4x16mm', keywords: ['cable', 'xlpe', '4x16', 'electrical'], unitPrice: 95.00, unit: 'meter', supplier: 'ARB', available: true, lastUpdated: '2026-01-26', category: 'Cables', description: 'XLPE insulated 4-core 16mm cable.' },
  { itemName: 'Armoured Cable 4x70mm', keywords: ['cable', 'armoured', '4x70', 'swa'], unitPrice: 385.00, unit: 'meter', supplier: 'ARB', available: true, lastUpdated: '2026-01-26', category: 'Cables', description: 'Steel wire armoured 4-core 70mm cable.' },
];

// VOLTEX - Electrical Distribution
const voltexCatalog: SupplierPrice[] = [
  { itemName: 'Distribution Board 12-Way', keywords: ['distribution', 'board', '12', 'way', 'db'], unitPrice: 1850.00, unit: 'unit', supplier: 'VOLTEX', available: true, lastUpdated: '2026-01-26', category: 'Electrical Equipment', description: '12-way distribution board.' },
  { itemName: 'MCB 20A Single Pole', keywords: ['mcb', 'breaker', '20a', 'single'], unitPrice: 65.00, unit: 'unit', supplier: 'VOLTEX', available: true, lastUpdated: '2026-01-26', category: 'Electrical Components', description: '20A single pole miniature circuit breaker.' },
];

// POWER EQUIPMENT - Power Generation
const powerEquipmentCatalog: SupplierPrice[] = [
  { itemName: 'Generator 20kVA Diesel', keywords: ['generator', '20kva', 'diesel', 'genset'], unitPrice: 65000.00, unit: 'unit', supplier: 'POWER EQUIPMENT', available: true, lastUpdated: '2026-01-26', category: 'Power Generation', description: '20kVA diesel generator set.' },
  { itemName: 'Solar Panel 350W', keywords: ['solar', 'panel', 'pv', '350w'], unitPrice: 2500.00, unit: 'unit', supplier: 'POWER EQUIPMENT', available: true, lastUpdated: '2026-01-26', category: 'Renewable Energy', description: '350W monocrystalline solar panel.' },
];

// AERMART - Pneumatic Equipment
const aermartCatalog: SupplierPrice[] = [
  { itemName: 'Air Compressor 100L', keywords: ['compressor', 'air', '100l', 'portable'], unitPrice: 8500.00, unit: 'unit', supplier: 'AERMART', available: true, lastUpdated: '2026-01-26', category: 'Pneumatic Equipment', description: '100L portable air compressor.' },
  { itemName: 'Pneumatic Drill', keywords: ['pneumatic', 'drill', 'air', 'tool'], unitPrice: 2850.00, unit: 'unit', supplier: 'AERMART', available: true, lastUpdated: '2026-01-26', category: 'Pneumatic Tools', description: 'Pneumatic drilling machine.' },
];

// BUILDERS - Building Materials
const buildersCatalog: SupplierPrice[] = [
  { itemName: 'Cement 50kg', keywords: ['cement', 'portland', 'ppc', '50kg'], unitPrice: 87.50, unit: 'bag', supplier: 'BUILDERS', available: true, lastUpdated: '2026-01-26', category: 'Cement', description: 'Portland cement 50kg for construction.' },
  { itemName: 'Clay Brick NFP', keywords: ['brick', 'clay', 'nfp', 'building'], unitPrice: 2.75, unit: 'unit', supplier: 'BUILDERS', available: true, lastUpdated: '2026-01-26', category: 'Bricks & Blocks', description: 'No frog clay brick for building.' },
];

// LEROY MERLIN - Tiles & Finishes
const leroyMerlinCatalog: SupplierPrice[] = [
  { itemName: 'Ceramic Tiles Floor 300x300mm', keywords: ['tiles', 'ceramic', 'floor', '300'], unitPrice: 125.00, unit: 'm2', supplier: 'LEROY MERLIN', available: true, lastUpdated: '2026-01-26', category: 'Tiles', description: '300x300mm ceramic floor tiles.' },
  { itemName: 'Paint Interior White 20L', keywords: ['paint', 'interior', 'white', '20l'], unitPrice: 650.00, unit: 'unit', supplier: 'LEROY MERLIN', available: true, lastUpdated: '2026-01-26', category: 'Paint', description: '20L interior white paint.' },
];

// TIMBER CITY - Timber Products
const timberCityCatalog: SupplierPrice[] = [
  { itemName: 'Pine Timber 38x114mm', keywords: ['timber', 'pine', 'wood', '38x114'], unitPrice: 55.00, unit: 'meter', supplier: 'TIMBER CITY', available: true, lastUpdated: '2026-01-26', category: 'Timber', description: 'Pine structural timber 38x114mm.' },
  { itemName: 'Plywood 18mm Marine', keywords: ['plywood', '18mm', 'marine', 'board'], unitPrice: 850.00, unit: 'sheet', supplier: 'TIMBER CITY', available: true, lastUpdated: '2026-01-26', category: 'Boards', description: '18mm marine plywood sheet.' },
];

// ATLAS PLANT - Construction Equipment
const atlasPlantCatalog: SupplierPrice[] = [
  { itemName: 'Concrete Mixer 260L', keywords: ['mixer', 'concrete', '260l', 'cement'], unitPrice: 8500.00, unit: 'unit', supplier: 'ATLAS PLANT', available: true, lastUpdated: '2026-01-26', category: 'Construction Equipment', description: '260L electric concrete mixer.' },
  { itemName: 'Scaffolding Standard 1.8m', keywords: ['scaffolding', 'standard', '1.8m', 'vertical'], unitPrice: 185.00, unit: 'unit', supplier: 'ATLAS PLANT', available: true, lastUpdated: '2026-01-26', category: 'Scaffolding', description: '1.8m scaffolding standard vertical.' },
  
  // Plant & Equipment Hire
  { itemName: '10m3 Tippers', keywords: ['10m3', 'tippers', 'tipper', 'truck', 'dump', 'dumper', 'transport', 'haulage'], unitPrice: 820.00, unit: 'hour', supplier: 'ATLAS PLANT', available: true, lastUpdated: '2026-01-27', category: 'Plant Hire', description: '10m3 tipper truck hire per hour for material transport.' },
  { itemName: 'Waterpump (Capacity 50,000 liter/hr medium)', keywords: ['waterpump', 'water', 'pump', '50000', '50', '000', 'liter', 'litre', 'hr', 'hour', 'medium', 'capacity', 'dewatering'], unitPrice: 435.00, unit: 'hour', supplier: 'ATLAS PLANT', available: true, lastUpdated: '2026-01-27', category: 'Plant Hire', description: 'Water pump with 50,000 liter/hr capacity for dewatering and water transfer.' },
  
  // Vehicles
  { itemName: 'Light delivery vehicle', keywords: ['light', 'delivery', 'vehicle', 'ldv', 'bakkie', 'van', 'transport'], unitPrice: 12.00, unit: 'km', supplier: 'ATLAS PLANT', available: true, lastUpdated: '2026-01-27', category: 'Vehicles', description: 'Light delivery vehicle hire per kilometer.' },
  { itemName: 'Flatbed truck', keywords: ['flatbed', 'flat', 'bed', 'truck', 'transport', 'lorry'], unitPrice: 18.00, unit: 'km', supplier: 'ATLAS PLANT', available: true, lastUpdated: '2026-01-27', category: 'Vehicles', description: 'Flatbed truck hire per kilometer for material transport.' },
];

// TALISMAN - Doors & Windows
const talismanCatalog: SupplierPrice[] = [
  { itemName: 'Door Internal Hollow Core', keywords: ['door', 'internal', 'hollow', 'core'], unitPrice: 650.00, unit: 'unit', supplier: 'TALISMAN', available: true, lastUpdated: '2026-01-26', category: 'Doors & Windows', description: 'Hollow core internal door.' },
  { itemName: 'Window Aluminium Sliding 1.2x1.2m', keywords: ['window', 'aluminium', 'sliding', '1.2'], unitPrice: 1850.00, unit: 'unit', supplier: 'TALISMAN', available: true, lastUpdated: '2026-01-26', category: 'Doors & Windows', description: '1.2x1.2m aluminium sliding window.' },
];

// INFRASET - Civils Products
const infrasetCatalog: SupplierPrice[] = [
  { itemName: 'Concrete Kerb K12', keywords: ['kerb', 'concrete', 'k12', 'precast'], unitPrice: 95.00, unit: 'meter', supplier: 'INFRASET', available: true, lastUpdated: '2026-01-26', category: 'Civils Products', description: 'Precast concrete kerb K12.' },
  { itemName: 'Paving Block 80mm Grey', keywords: ['paving', 'block', '80mm', 'grey'], unitPrice: 285.00, unit: 'm2', supplier: 'INFRASET', available: true, lastUpdated: '2026-01-26', category: 'Paving', description: '80mm grey concrete paving blocks.' },
];

// TECHNI CRETE - Precast Structures
const techniCreteCatalog: SupplierPrice[] = [
  { itemName: 'Retaining Wall Block', keywords: ['retaining', 'wall', 'block', 'concrete'], unitPrice: 125.00, unit: 'unit', supplier: 'TECHNI CRETE', available: true, lastUpdated: '2026-01-26', category: 'Civils Products', description: 'Interlocking retaining wall block.' },
  { itemName: 'Culvert Box 1200x1200mm', keywords: ['culvert', 'box', '1200', 'precast'], unitPrice: 8500.00, unit: 'meter', supplier: 'TECHNI CRETE', available: true, lastUpdated: '2026-01-26', category: 'Civils Products', description: '1200x1200mm precast box culvert.' },
];

// NJR STEEL - Steel & Reinforcement
const njrSteelCatalog: SupplierPrice[] = [
  { itemName: 'Steel Rod 8mm Y12', keywords: ['steel', 'rod', 'rebar', '8mm', 'y12'], unitPrice: 41.50, unit: 'meter', supplier: 'NJR STEEL', available: true, lastUpdated: '2026-01-26', category: 'Steel & Reinforcement', description: '8mm (Y12) steel reinforcement bar.' },
  { itemName: 'Steel Fabric Mesh D193', keywords: ['mesh', 'steel', 'fabric', 'd193'], unitPrice: 210.00, unit: 'm2', supplier: 'NJR STEEL', available: true, lastUpdated: '2026-01-26', category: 'Steel & Reinforcement', description: 'D193 steel fabric mesh for reinforcement.' },
];

// RSC - Roofing Sheets
const rscCatalog: SupplierPrice[] = [
  { itemName: 'IBR Roof Sheet 0.5mm', keywords: ['ibr', 'roof', 'sheet', '0.5mm', 'corrugated'], unitPrice: 125.00, unit: 'meter', supplier: 'RSC', available: true, lastUpdated: '2026-01-26', category: 'Roofing', description: '0.5mm IBR corrugated roof sheet.' },
  { itemName: 'Colorbond Roof Sheet', keywords: ['colorbond', 'roof', 'sheet', 'coated'], unitPrice: 185.00, unit: 'meter', supplier: 'RSC', available: true, lastUpdated: '2026-01-26', category: 'Roofing', description: 'Colorbond coated roof sheet.' },
];

// GLOBAL ROOFING - Structural Steel & Roofing
const globalRoofingCatalog: SupplierPrice[] = [
  { itemName: 'Steel Truss 6m Span', keywords: ['truss', 'steel', '6m', 'roof', 'span'], unitPrice: 2850.00, unit: 'unit', supplier: 'GLOBAL ROOFING', available: true, lastUpdated: '2026-01-26', category: 'Structural Steel', description: '6m span steel roof truss.' },
  { itemName: 'Gutter Aluminium 150mm', keywords: ['gutter', 'aluminium', '150mm', 'seamless'], unitPrice: 125.00, unit: 'meter', supplier: 'GLOBAL ROOFING', available: true, lastUpdated: '2026-01-26', category: 'Roofing Accessories', description: '150mm seamless aluminium gutter.' },
];

// NEW SUPPLIERS FROM SPREADSHEET

// SEKUNALO - Water Infrastructure
const sekunaloCatalog: SupplierPrice[] = [
  { itemName: 'PVC Pipe 110mm', keywords: ['pvc', 'pipe', '110mm', 'water', 'drainage'], unitPrice: 138.00, unit: 'meter', supplier: 'SEKUNALO', available: true, lastUpdated: '2026-01-27', category: 'Water Infrastructure', description: '110mm PVC pipe for water and drainage systems.' },
  { itemName: 'Water Meter 15mm', keywords: ['water', 'meter', '15mm', 'flow'], unitPrice: 450.00, unit: 'unit', supplier: 'SEKUNALO', available: true, lastUpdated: '2026-01-27', category: 'Water Infrastructure', description: '15mm residential water flow meter.' },
  { itemName: 'Water Storage Tank 5000L', keywords: ['water', 'storage', 'tank', '5000l', 'jojo'], unitPrice: 8500.00, unit: 'unit', supplier: 'SEKUNALO', available: true, lastUpdated: '2026-01-27', category: 'Water Infrastructure', description: '5000L water storage tank.' },
];

// STRUANDALE - Water Treatment
const struandaleCatalog: SupplierPrice[] = [
  { itemName: 'Water Pump 1.5kW', keywords: ['water', 'pump', '1.5kw', 'submersible'], unitPrice: 3850.00, unit: 'unit', supplier: 'STRUANDALE', available: true, lastUpdated: '2026-01-27', category: 'Water Treatment', description: '1.5kW submersible water pump.' },
  { itemName: 'Water Filter System', keywords: ['water', 'filter', 'treatment', 'purification'], unitPrice: 12500.00, unit: 'unit', supplier: 'STRUANDALE', available: true, lastUpdated: '2026-01-27', category: 'Water Treatment', description: 'Complete water filtration system.' },
  { itemName: 'Pressure Valve 25mm', keywords: ['pressure', 'valve', '25mm', 'water'], unitPrice: 285.00, unit: 'unit', supplier: 'STRUANDALE', available: true, lastUpdated: '2026-01-27', category: 'Water Treatment', description: '25mm pressure control valve.' },
];

// LLOCS - Water Management
const llocsCatalog: SupplierPrice[] = [
  { itemName: 'Manhole Cover 600mm', keywords: ['manhole', 'cover', '600mm', 'cast', 'iron'], unitPrice: 1250.00, unit: 'unit', supplier: 'LLOCS', available: true, lastUpdated: '2026-01-27', category: 'Water Management', description: '600mm cast iron manhole cover.' },
  { itemName: 'Drainage Channel 1m', keywords: ['drainage', 'channel', 'trench', 'grating'], unitPrice: 485.00, unit: 'meter', supplier: 'LLOCS', available: true, lastUpdated: '2026-01-27', category: 'Water Management', description: '1 meter drainage channel with grating.' },
  { itemName: 'Gully Trap', keywords: ['gully', 'trap', 'drainage', 'waste'], unitPrice: 125.00, unit: 'unit', supplier: 'LLOCS', available: true, lastUpdated: '2026-01-27', category: 'Water Management', description: 'Standard gully trap for waste water.' },
];

// POLYFRAME - Polymer Water Systems
const polyframeCatalog: SupplierPrice[] = [
  { itemName: 'Polyframe Water Tank 10000L', keywords: ['polyframe', 'water', 'tank', '10000l', 'polymer'], unitPrice: 15500.00, unit: 'unit', supplier: 'POLYFRAME', available: true, lastUpdated: '2026-01-27', category: 'Water Storage', description: '10000L polymer water storage tank.' },
  { itemName: 'HDPE Pipe 63mm', keywords: ['hdpe', 'pipe', '63mm', 'polyethylene'], unitPrice: 125.00, unit: 'meter', supplier: 'POLYFRAME', available: true, lastUpdated: '2026-01-27', category: 'Water Storage', description: '63mm HDPE water pipe.' },
  { itemName: 'Pipe Fittings Set', keywords: ['pipe', 'fittings', 'connectors', 'joints'], unitPrice: 850.00, unit: 'set', supplier: 'POLYFRAME', available: true, lastUpdated: '2026-01-27', category: 'Water Storage', description: 'Complete set of pipe fittings and connectors.' },
];

// EAST COAST FENCING - Asphalt & Road Surfacing
const eastCoastFencingCatalog: SupplierPrice[] = [
  { itemName: 'Hot Mix Asphalt', keywords: ['asphalt', 'hot', 'mix', 'paving', 'road'], unitPrice: 1850.00, unit: 'ton', supplier: 'EAST COAST FENCING', available: true, lastUpdated: '2026-01-27', category: 'Road Surfacing', description: 'Hot mix asphalt for road paving.' },
  { itemName: 'Road Base Material', keywords: ['road', 'base', 'material', 'gravel', 'foundation'], unitPrice: 380.00, unit: 'ton', supplier: 'EAST COAST FENCING', available: true, lastUpdated: '2026-01-27', category: 'Road Surfacing', description: 'Road base foundation material.' },
  { itemName: 'Bitumen Emulsion', keywords: ['bitumen', 'emulsion', 'tack', 'coat'], unitPrice: 45.00, unit: 'liter', supplier: 'EAST COAST FENCING', available: true, lastUpdated: '2026-01-27', category: 'Road Surfacing', description: 'Bitumen emulsion for tack coat.' },
];

// SHERRERD ROAD SIGNS - Road Signage
const sherrerdRoadSignsCatalog: SupplierPrice[] = [
  { itemName: 'Road Sign Standard 900mm', keywords: ['road', 'sign', '900mm', 'traffic', 'standard'], unitPrice: 1250.00, unit: 'unit', supplier: 'SHERRERD ROAD SIGNS', available: true, lastUpdated: '2026-01-27', category: 'Road Signage', description: '900mm standard road traffic sign.' },
  { itemName: 'Road Marking Paint White', keywords: ['road', 'marking', 'paint', 'white', 'thermoplastic'], unitPrice: 125.00, unit: 'liter', supplier: 'SHERRERD ROAD SIGNS', available: true, lastUpdated: '2026-01-27', category: 'Road Signage', description: 'White thermoplastic road marking paint.' },
  { itemName: 'Road Studs Reflective', keywords: ['road', 'studs', 'reflective', 'cat', 'eyes'], unitPrice: 22.50, unit: 'unit', supplier: 'SHERRERD ROAD SIGNS', available: true, lastUpdated: '2026-01-27', category: 'Road Signage', description: 'Reflective road studs (cat eyes).' },
  { itemName: 'Sign Post Galvanised 3m', keywords: ['sign', 'post', 'galvanised', '3m', 'pole'], unitPrice: 485.00, unit: 'unit', supplier: 'SHERRERD ROAD SIGNS', available: true, lastUpdated: '2026-01-27', category: 'Road Signage', description: '3m galvanised sign post.' },
];

// VYL-TEX - Electrical Cables & Power
const vylTexCatalog: SupplierPrice[] = [
  { itemName: 'Power Cable 4mm² PVC', keywords: ['power', 'cable', '4mm', 'pvc', 'electrical'], unitPrice: 18.50, unit: 'meter', supplier: 'VYL-TEX', available: true, lastUpdated: '2026-01-27', category: 'Electrical Cables', description: '4mm² PVC insulated power cable.' },
  { itemName: 'Armoured Cable 16mm²', keywords: ['armoured', 'cable', '16mm', 'swa'], unitPrice: 95.00, unit: 'meter', supplier: 'VYL-TEX', available: true, lastUpdated: '2026-01-27', category: 'Electrical Cables', description: '16mm² steel wire armoured cable.' },
  { itemName: 'Cable Tray 300mm', keywords: ['cable', 'tray', '300mm', 'ladder', 'support'], unitPrice: 285.00, unit: 'meter', supplier: 'VYL-TEX', available: true, lastUpdated: '2026-01-27', category: 'Electrical Cables', description: '300mm cable ladder tray.' },
];

// AERMATT - Pneumatic Equipment
const aermattCatalog: SupplierPrice[] = [
  { itemName: 'Air Compressor 50L', keywords: ['air', 'compressor', '50l', 'pneumatic'], unitPrice: 4850.00, unit: 'unit', supplier: 'AERMATT', available: true, lastUpdated: '2026-01-27', category: 'Pneumatic Equipment', description: '50L portable air compressor.' },
  { itemName: 'Pneumatic Drill', keywords: ['pneumatic', 'drill', 'air', 'tool'], unitPrice: 1250.00, unit: 'unit', supplier: 'AERMATT', available: true, lastUpdated: '2026-01-27', category: 'Pneumatic Equipment', description: 'Heavy duty pneumatic drill.' },
  { itemName: 'Air Hose 15m', keywords: ['air', 'hose', '15m', 'compressed'], unitPrice: 385.00, unit: 'unit', supplier: 'AERMATT', available: true, lastUpdated: '2026-01-27', category: 'Pneumatic Equipment', description: '15m compressed air hose.' },
];

// AGUENIE - Electrical Lighting
const aguenieCatalog: SupplierPrice[] = [
  { itemName: 'LED Street Light 100W', keywords: ['led', 'street', 'light', '100w', 'solar'], unitPrice: 2850.00, unit: 'unit', supplier: 'AGUENIE', available: true, lastUpdated: '2026-01-27', category: 'Electrical Lighting', description: '100W LED street light fixture.' },
  { itemName: 'Lighting Pole 6m', keywords: ['lighting', 'pole', '6m', 'galvanised', 'street'], unitPrice: 3250.00, unit: 'unit', supplier: 'AGUENIE', available: true, lastUpdated: '2026-01-27', category: 'Electrical Lighting', description: '6m galvanised lighting pole.' },
  { itemName: 'Floodlight 200W LED', keywords: ['floodlight', '200w', 'led', 'security'], unitPrice: 1850.00, unit: 'unit', supplier: 'AGUENIE', available: true, lastUpdated: '2026-01-27', category: 'Electrical Lighting', description: '200W LED security floodlight.' },
];

// A3M - Mechanical & Electrical Components
const a3mCatalog: SupplierPrice[] = [
  { itemName: 'Circuit Breaker 63A', keywords: ['circuit', 'breaker', '63a', 'mcb'], unitPrice: 485.00, unit: 'unit', supplier: 'A3M', available: true, lastUpdated: '2026-01-27', category: 'Electrical Components', description: '63A miniature circuit breaker.' },
  { itemName: 'Distribution Board 12 Way', keywords: ['distribution', 'board', '12', 'way', 'db'], unitPrice: 1250.00, unit: 'unit', supplier: 'A3M', available: true, lastUpdated: '2026-01-27', category: 'Electrical Components', description: '12 way distribution board.' },
  { itemName: 'Cable Gland 25mm', keywords: ['cable', 'gland', '25mm', 'brass'], unitPrice: 45.00, unit: 'unit', supplier: 'A3M', available: true, lastUpdated: '2026-01-27', category: 'Electrical Components', description: '25mm brass cable gland.' },
];

// BUILDERS DEPOT - Building Materials
const buildersDepotCatalog: SupplierPrice[] = [
  { itemName: 'Cement 50kg PPC', keywords: ['cement', '50kg', 'ppc', 'portland'], unitPrice: 88.50, unit: 'bag', supplier: 'BUILDERS DEPOT', available: true, lastUpdated: '2026-01-27', category: 'Cement', description: '50kg PPC cement bag.' },
  { itemName: 'Building Sand', keywords: ['building', 'sand', 'plaster', 'fine'], unitPrice: 445.00, unit: 'ton', supplier: 'BUILDERS DEPOT', available: true, lastUpdated: '2026-01-27', category: 'Sand & Aggregates', description: 'Fine building sand for construction.' },
  { itemName: 'Clay Brick', keywords: ['clay', 'brick', 'building', 'standard'], unitPrice: 2.75, unit: 'unit', supplier: 'BUILDERS DEPOT', available: true, lastUpdated: '2026-01-27', category: 'Bricks & Blocks', description: 'Standard clay building brick.' },
  { itemName: 'Concrete Block 140mm', keywords: ['concrete', 'block', '140mm', 'hollow'], unitPrice: 11.50, unit: 'unit', supplier: 'BUILDERS DEPOT', available: true, lastUpdated: '2026-01-27', category: 'Bricks & Blocks', description: '140mm hollow concrete block.' },
];

// BILT - Construction Blocks
const biltCatalog: SupplierPrice[] = [
  { itemName: 'Bilt Block 190mm', keywords: ['bilt', 'block', '190mm', 'concrete'], unitPrice: 13.50, unit: 'unit', supplier: 'BILT', available: true, lastUpdated: '2026-01-27', category: 'Bricks & Blocks', description: '190mm Bilt concrete block.' },
  { itemName: 'Maxi Brick', keywords: ['maxi', 'brick', 'bilt', 'lightweight'], unitPrice: 3.85, unit: 'unit', supplier: 'BILT', available: true, lastUpdated: '2026-01-27', category: 'Bricks & Blocks', description: 'Lightweight maxi brick.' },
  { itemName: 'Paving Brick 200x100mm', keywords: ['paving', 'brick', '200x100', 'interlock'], unitPrice: 4.50, unit: 'unit', supplier: 'BILT', available: true, lastUpdated: '2026-01-27', category: 'Paving', description: '200x100mm interlocking paving brick.' },
];

// JVR STEEL - Steel Reinforcement (Updated from NJR STEEL)
const jvrSteelCatalog: SupplierPrice[] = [
  { itemName: 'Steel Rod 8mm', keywords: ['steel', 'rod', 'rebar', '8mm', 'reinforcement'], unitPrice: 43.00, unit: 'meter', supplier: 'JVR STEEL', available: true, lastUpdated: '2026-01-27', category: 'Steel & Reinforcement', description: '8mm steel reinforcement rod.' },
  { itemName: 'Steel Rod 10mm', keywords: ['steel', 'rod', 'rebar', '10mm', 'reinforcement'], unitPrice: 63.50, unit: 'meter', supplier: 'JVR STEEL', available: true, lastUpdated: '2026-01-27', category: 'Steel & Reinforcement', description: '10mm steel reinforcement rod.' },
  { itemName: 'Steel Rod 12mm', keywords: ['steel', 'rod', 'rebar', '12mm', 'reinforcement'], unitPrice: 83.50, unit: 'meter', supplier: 'JVR STEEL', available: true, lastUpdated: '2026-01-27', category: 'Steel & Reinforcement', description: '12mm steel reinforcement rod.' },
  { itemName: 'Steel Mesh D193', keywords: ['steel', 'mesh', 'd193', 'reinforcement', 'fabric'], unitPrice: 215.00, unit: 'm2', supplier: 'JVR STEEL', available: true, lastUpdated: '2026-01-27', category: 'Steel & Reinforcement', description: 'D193 steel reinforcement mesh.' },
];

// RSC GLOBAL - Roofing & Structural Systems
const rscGlobalCatalog: SupplierPrice[] = [
  { itemName: 'IBR Roof Sheet 0.5mm', keywords: ['ibr', 'roof', 'sheet', '0.5mm', 'corrugated'], unitPrice: 128.00, unit: 'meter', supplier: 'RSC GLOBAL', available: true, lastUpdated: '2026-01-27', category: 'Roofing', description: '0.5mm IBR corrugated roof sheet.' },
  { itemName: 'Chromadek Roof Sheet 0.4mm', keywords: ['chromadek', 'roof', 'sheet', '0.4mm'], unitPrice: 145.00, unit: 'meter', supplier: 'RSC GLOBAL', available: true, lastUpdated: '2026-01-27', category: 'Roofing', description: '0.4mm Chromadek roof sheet.' },
  { itemName: 'Roof Truss 6m Span', keywords: ['roof', 'truss', '6m', 'steel', 'span'], unitPrice: 2950.00, unit: 'unit', supplier: 'RSC GLOBAL', available: true, lastUpdated: '2026-01-27', category: 'Structural Steel', description: '6m span steel roof truss.' },
  { itemName: 'Roof Flashing', keywords: ['roof', 'flashing', 'edge', 'trim'], unitPrice: 85.00, unit: 'meter', supplier: 'RSC GLOBAL', available: true, lastUpdated: '2026-01-27', category: 'Roofing', description: 'Roof edge flashing and trim.' },
];

// CORRSHINE - Corrugated Roofing
const corrshineCatalog: SupplierPrice[] = [
  { itemName: 'Corrugated Iron Sheet 0.5mm', keywords: ['corrugated', 'iron', 'sheet', '0.5mm', 'roof'], unitPrice: 115.00, unit: 'meter', supplier: 'CORRSHINE', available: true, lastUpdated: '2026-01-27', category: 'Roofing', description: '0.5mm corrugated iron roofing sheet.' },
  { itemName: 'Zinc Corrugated Sheet', keywords: ['zinc', 'corrugated', 'sheet', 'galvanised'], unitPrice: 135.00, unit: 'meter', supplier: 'CORRSHINE', available: true, lastUpdated: '2026-01-27', category: 'Roofing', description: 'Galvanised zinc corrugated sheet.' },
  { itemName: 'Roof Screws 100 Pack', keywords: ['roof', 'screws', 'fasteners', 'washers'], unitPrice: 125.00, unit: 'pack', supplier: 'CORRSHINE', available: true, lastUpdated: '2026-01-27', category: 'Roofing Accessories', description: '100 pack of roofing screws with washers.' },
  { itemName: 'Ridge Capping 3m', keywords: ['ridge', 'capping', '3m', 'roof', 'apex'], unitPrice: 185.00, unit: 'length', supplier: 'CORRSHINE', available: true, lastUpdated: '2026-01-27', category: 'Roofing Accessories', description: '3m roof ridge capping.' },
];

// HIRE AND RENTAL SUPPLIERS

// CONTAINER WORLD - Site Administration & Storage
const containerWorldCatalog: SupplierPrice[] = [
  { itemName: 'Site Office Container 6m', keywords: ['container', 'office', 'site', '6m', 'administration'], unitPrice: 3500.00, unit: 'month', supplier: 'CONTAINER WORLD', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: '6m site office container rental per month.' },
  { itemName: 'Storage Container 12m', keywords: ['container', 'storage', '12m', 'shipping'], unitPrice: 2800.00, unit: 'month', supplier: 'CONTAINER WORLD', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: '12m storage container rental per month.' },
  { itemName: 'Site Store Room Container', keywords: ['store', 'room', 'container', 'storage'], unitPrice: 2500.00, unit: 'month', supplier: 'CONTAINER WORLD', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Site store room container rental per month.' },
  { itemName: 'Office Furniture Set', keywords: ['furniture', 'office', 'desk', 'chair'], unitPrice: 850.00, unit: 'month', supplier: 'CONTAINER WORLD', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Complete office furniture set rental.' },
  { itemName: 'Ablution Container', keywords: ['ablution', 'toilet', 'container', 'sanitation'], unitPrice: 2200.00, unit: 'month', supplier: 'CONTAINER WORLD', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Ablution and sanitation container rental.' },
];

// TALISMAN HIRE - Power Tools Hire
const talismanHireCatalog: SupplierPrice[] = [
  { itemName: 'Angle Grinder 230mm', keywords: ['angle', 'grinder', '230mm', 'power', 'tool'], unitPrice: 185.00, unit: 'day', supplier: 'TALISMAN HIRE', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: '230mm angle grinder hire per day.' },
  { itemName: 'Concrete Breaker', keywords: ['concrete', 'breaker', 'jackhammer', 'demolition'], unitPrice: 450.00, unit: 'day', supplier: 'TALISMAN HIRE', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Heavy duty concrete breaker hire per day.' },
  { itemName: 'Rotary Hammer Drill', keywords: ['rotary', 'hammer', 'drill', 'sds'], unitPrice: 195.00, unit: 'day', supplier: 'TALISMAN HIRE', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'SDS rotary hammer drill hire per day.' },
  { itemName: 'Circular Saw 235mm', keywords: ['circular', 'saw', '235mm', 'cutting'], unitPrice: 145.00, unit: 'day', supplier: 'TALISMAN HIRE', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: '235mm circular saw hire per day.' },
  { itemName: 'Generator 5kVA', keywords: ['generator', '5kva', 'power', 'diesel'], unitPrice: 650.00, unit: 'day', supplier: 'TALISMAN HIRE', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: '5kVA diesel generator hire per day.' },
];

// HIREALL - Equipment Rental
const hireallCatalog: SupplierPrice[] = [
  { itemName: 'Excavator 8 Ton', keywords: ['excavator', '8', 'ton', 'digger', 'earthmoving'], unitPrice: 4500.00, unit: 'day', supplier: 'HIREALL', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: '8 ton excavator hire per day.' },
  { itemName: 'Bobcat Skid Steer Loader', keywords: ['bobcat', 'skid', 'steer', 'loader'], unitPrice: 3200.00, unit: 'day', supplier: 'HIREALL', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Bobcat skid steer loader hire per day.' },
  { itemName: 'Tipper Truck 6m3', keywords: ['tipper', 'truck', '6m3', 'dump'], unitPrice: 2800.00, unit: 'day', supplier: 'HIREALL', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: '6m3 tipper truck hire per day.' },
  { itemName: 'Roller Compactor 3 Ton', keywords: ['roller', 'compactor', '3', 'ton', 'vibrating'], unitPrice: 2500.00, unit: 'day', supplier: 'HIREALL', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: '3 ton vibrating roller compactor hire per day.' },
  { itemName: 'Mobile Crane 25 Ton', keywords: ['mobile', 'crane', '25', 'ton', 'lifting'], unitPrice: 8500.00, unit: 'day', supplier: 'HIREALL', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: '25 ton mobile crane hire per day.' },
  { itemName: 'Scaffolding Package 100m2', keywords: ['scaffolding', 'package', '100m2', 'access'], unitPrice: 4500.00, unit: 'month', supplier: 'HIREALL', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: '100m2 scaffolding package rental per month.' },
];

// MUCH ASPHALT PLANT HIRE - Plant & Equipment
const muchAsphaltPlantHireCatalog: SupplierPrice[] = [
  { itemName: 'Asphalt Paving Machine', keywords: ['asphalt', 'paving', 'machine', 'paver', 'road'], unitPrice: 12500.00, unit: 'day', supplier: 'MUCH ASPHALT PLANT HIRE', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Asphalt paving machine hire per day.' },
  { itemName: 'Asphalt Mixing Plant', keywords: ['asphalt', 'mixing', 'plant', 'batching'], unitPrice: 35000.00, unit: 'month', supplier: 'MUCH ASPHALT PLANT HIRE', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Asphalt mixing plant hire per month.' },
  { itemName: 'Road Milling Machine', keywords: ['road', 'milling', 'machine', 'planer'], unitPrice: 15000.00, unit: 'day', supplier: 'MUCH ASPHALT PLANT HIRE', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Road milling machine hire per day.' },
  { itemName: 'Hot Asphalt Truck', keywords: ['hot', 'asphalt', 'truck', 'delivery'], unitPrice: 5500.00, unit: 'day', supplier: 'MUCH ASPHALT PLANT HIRE', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Hot asphalt delivery truck hire per day.' },
];

// PAN - Formwork Systems
const panCatalog: SupplierPrice[] = [
  { itemName: 'Slab Formwork System 100m2', keywords: ['slab', 'formwork', 'system', '100m2', 'concrete'], unitPrice: 8500.00, unit: 'month', supplier: 'PAN', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: '100m2 slab formwork system rental per month.' },
  { itemName: 'Wall Formwork Panels', keywords: ['wall', 'formwork', 'panels', 'shuttering'], unitPrice: 125.00, unit: 'm2/month', supplier: 'PAN', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Wall formwork panels rental per m2 per month.' },
  { itemName: 'Column Formwork', keywords: ['column', 'formwork', 'moulds', 'circular'], unitPrice: 450.00, unit: 'unit/month', supplier: 'PAN', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Column formwork rental per unit per month.' },
  { itemName: 'Formwork Props/Shores', keywords: ['formwork', 'props', 'shores', 'adjustable'], unitPrice: 35.00, unit: 'unit/month', supplier: 'PAN', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Adjustable formwork props rental per unit per month.' },
];

// BRIDGEDECK - Bridge Formwork
const bridgedeckCatalog: SupplierPrice[] = [
  { itemName: 'Bridge Deck Formwork System', keywords: ['bridge', 'deck', 'formwork', 'system'], unitPrice: 45000.00, unit: 'month', supplier: 'BRIDGEDECK', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Complete bridge deck formwork system rental per month.' },
  { itemName: 'Formwork Traveller System', keywords: ['formwork', 'traveller', 'system', 'bridge'], unitPrice: 85000.00, unit: 'month', supplier: 'BRIDGEDECK', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Formwork traveller system for bridge construction per month.' },
  { itemName: 'Pier Formwork', keywords: ['pier', 'formwork', 'bridge', 'support'], unitPrice: 12500.00, unit: 'month', supplier: 'BRIDGEDECK', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Bridge pier formwork rental per month.' },
  { itemName: 'Soffit Formwork Beams', keywords: ['soffit', 'formwork', 'beams', 'bridge'], unitPrice: 185.00, unit: 'meter/month', supplier: 'BRIDGEDECK', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Soffit formwork beams rental per meter per month.' },
];

// MAKU - Formwork & Scaffolding
const makuCatalog: SupplierPrice[] = [
  { itemName: 'Aluminium Formwork System', keywords: ['aluminium', 'formwork', 'system', 'modular'], unitPrice: 165.00, unit: 'm2/month', supplier: 'MAKU', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Modular aluminium formwork system rental per m2 per month.' },
  { itemName: 'Steel Scaffolding Tube 4m', keywords: ['steel', 'scaffolding', 'tube', '4m'], unitPrice: 28.00, unit: 'unit/month', supplier: 'MAKU', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: '4m steel scaffolding tube rental per unit per month.' },
  { itemName: 'Scaffolding Coupler', keywords: ['scaffolding', 'coupler', 'clamp', 'connector'], unitPrice: 4.50, unit: 'unit/month', supplier: 'MAKU', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: 'Scaffolding coupler rental per unit per month.' },
  { itemName: 'Scaffolding Board 230x38mm', keywords: ['scaffolding', 'board', '230x38', 'plank'], unitPrice: 15.00, unit: 'meter/month', supplier: 'MAKU', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: '230x38mm scaffolding board rental per meter per month.' },
  { itemName: 'Mobile Scaffold Tower 6m', keywords: ['mobile', 'scaffold', 'tower', '6m'], unitPrice: 1850.00, unit: 'month', supplier: 'MAKU', available: true, lastUpdated: '2026-01-27', category: 'Hire & Rental', description: '6m mobile scaffold tower rental per month.' },
];

// ROOFCAP - Specialized Testing Services
const roofcapCatalog: SupplierPrice[] = [
  { itemName: 'Soil Compaction Testing', keywords: ['soil', 'compaction', 'testing', 'mod', 'aashto'], unitPrice: 1850.00, unit: 'test', supplier: 'ROOFCAP', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Soil compaction testing (Mod AASHTO) per test.' },
  { itemName: 'Concrete Cube Testing', keywords: ['concrete', 'cube', 'testing', 'strength', 'compression'], unitPrice: 185.00, unit: 'test', supplier: 'ROOFCAP', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Concrete cube compression strength testing per test.' },
  { itemName: 'Concrete Core Testing', keywords: ['concrete', 'core', 'testing', 'strength', 'in-situ'], unitPrice: 950.00, unit: 'test', supplier: 'ROOFCAP', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Concrete core in-situ strength testing per test.' },
  { itemName: 'CBR Testing', keywords: ['cbr', 'california', 'bearing', 'ratio', 'testing'], unitPrice: 2200.00, unit: 'test', supplier: 'ROOFCAP', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'California Bearing Ratio (CBR) testing per test.' },
  { itemName: 'Nuclear Density Testing', keywords: ['nuclear', 'density', 'testing', 'gauge', 'compaction'], unitPrice: 650.00, unit: 'test', supplier: 'ROOFCAP', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Nuclear density gauge testing per test.' },
  { itemName: 'Proctor Density Testing', keywords: ['proctor', 'density', 'testing', 'optimum', 'moisture'], unitPrice: 1450.00, unit: 'test', supplier: 'ROOFCAP', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Proctor density testing (optimum moisture content) per test.' },
  { itemName: 'Sand Equivalent Testing', keywords: ['sand', 'equivalent', 'testing', 'aggregate'], unitPrice: 750.00, unit: 'test', supplier: 'ROOFCAP', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Sand equivalent testing for aggregates per test.' },
];

// CIVIL LAB - Civil Engineering Testing
const civilLabCatalog: SupplierPrice[] = [
  { itemName: 'Geotechnical Investigation', keywords: ['geotechnical', 'investigation', 'soil', 'borehole'], unitPrice: 8500.00, unit: 'borehole', supplier: 'CIVIL LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Geotechnical investigation with soil analysis per borehole.' },
  { itemName: 'Soil Classification Testing', keywords: ['soil', 'classification', 'testing', 'grading'], unitPrice: 1250.00, unit: 'test', supplier: 'CIVIL LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Soil classification and grading testing per test.' },
  { itemName: 'Aggregate Grading Testing', keywords: ['aggregate', 'grading', 'testing', 'sieve', 'analysis'], unitPrice: 850.00, unit: 'test', supplier: 'CIVIL LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Aggregate sieve grading analysis per test.' },
  { itemName: 'Concrete Slump Testing', keywords: ['concrete', 'slump', 'testing', 'workability'], unitPrice: 285.00, unit: 'test', supplier: 'CIVIL LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Concrete slump testing for workability per test.' },
  { itemName: 'Asphalt Core Testing', keywords: ['asphalt', 'core', 'testing', 'bitumen', 'roads'], unitPrice: 1150.00, unit: 'test', supplier: 'CIVIL LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Asphalt core testing and analysis per test.' },
  { itemName: 'Water Quality Testing', keywords: ['water', 'quality', 'testing', 'potable', 'analysis'], unitPrice: 950.00, unit: 'test', supplier: 'CIVIL LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Water quality testing for construction use per test.' },
  { itemName: 'Atterberg Limits Testing', keywords: ['atterberg', 'limits', 'testing', 'soil', 'plasticity'], unitPrice: 1350.00, unit: 'test', supplier: 'CIVIL LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Atterberg limits testing for soil plasticity per test.' },
];

// CONCRETE LAB - Concrete Testing Services
const concreteLabCatalog: SupplierPrice[] = [
  { itemName: 'Concrete Compressive Strength Testing 7-Day', keywords: ['concrete', 'compressive', 'strength', '7-day', 'testing'], unitPrice: 195.00, unit: 'test', supplier: 'CONCRETE LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Concrete compressive strength testing at 7 days per test.' },
  { itemName: 'Concrete Compressive Strength Testing 28-Day', keywords: ['concrete', 'compressive', 'strength', '28-day', 'testing'], unitPrice: 195.00, unit: 'test', supplier: 'CONCRETE LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Concrete compressive strength testing at 28 days per test.' },
  { itemName: 'Concrete Cylinder Testing', keywords: ['concrete', 'cylinder', 'testing', 'strength', 'compression'], unitPrice: 225.00, unit: 'test', supplier: 'CONCRETE LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Concrete cylinder compression testing per test.' },
  { itemName: 'Concrete Air Content Testing', keywords: ['concrete', 'air', 'content', 'testing', 'entrainment'], unitPrice: 385.00, unit: 'test', supplier: 'CONCRETE LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Concrete air content testing per test.' },
  { itemName: 'Concrete Temperature Testing', keywords: ['concrete', 'temperature', 'testing', 'fresh'], unitPrice: 185.00, unit: 'test', supplier: 'CONCRETE LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Fresh concrete temperature testing per test.' },
  { itemName: 'Ultrasonic Pulse Velocity Testing', keywords: ['ultrasonic', 'pulse', 'velocity', 'testing', 'concrete'], unitPrice: 1450.00, unit: 'test', supplier: 'CONCRETE LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Ultrasonic pulse velocity testing for concrete quality per test.' },
  { itemName: 'Rebound Hammer Testing', keywords: ['rebound', 'hammer', 'testing', 'schmidt', 'concrete'], unitPrice: 850.00, unit: 'test', supplier: 'CONCRETE LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Rebound hammer (Schmidt Hammer) testing per test.' },
  { itemName: 'Concrete Permeability Testing', keywords: ['concrete', 'permeability', 'testing', 'water', 'penetration'], unitPrice: 1650.00, unit: 'test', supplier: 'CONCRETE LAB', available: true, lastUpdated: '2026-01-27', category: 'Testing Services', description: 'Concrete water permeability testing per test.' },
];

// Combined catalog from all suppliers
export const allSupplierCatalogs = [
  ...bucoCatalog,
  ...macsteelCatalog,
  ...lafargeCatalog,
  ...raumixCatalog,
  ...ksbCatalog,
  ...zenzeleCatalog,
  ...avkCatalog,
  ...sizabantuCatalog,
  ...stewardsllodsCatalog,
  ...marleyCatalog,
  ...eastCoastCatalog,
  ...muchPlantCatalog,
  ...polokwaneSurfacingCatalog,
  ...bosunCatalog,
  ...actomCatalog,
  ...abadereCatalog,
  ...arbCatalog,
  ...voltexCatalog,
  ...powerEquipmentCatalog,
  ...aermartCatalog,
  ...buildersCatalog,
  ...leroyMerlinCatalog,
  ...timberCityCatalog,
  ...atlasPlantCatalog,
  ...talismanCatalog,
  ...infrasetCatalog,
  ...techniCreteCatalog,
  ...njrSteelCatalog,
  ...rscCatalog,
  ...globalRoofingCatalog,
  // New suppliers from spreadsheet
  ...sekunaloCatalog,
  ...struandaleCatalog,
  ...llocsCatalog,
  ...polyframeCatalog,
  ...eastCoastFencingCatalog,
  ...sherrerdRoadSignsCatalog,
  ...vylTexCatalog,
  ...aermattCatalog,
  ...aguenieCatalog,
  ...a3mCatalog,
  ...buildersDepotCatalog,
  ...biltCatalog,
  ...jvrSteelCatalog,
  ...rscGlobalCatalog,
  ...corrshineCatalog,
  // Hire and Rental suppliers
  ...containerWorldCatalog,
  ...talismanHireCatalog,
  ...hireallCatalog,
  ...muchAsphaltPlantHireCatalog,
  ...panCatalog,
  ...bridgedeckCatalog,
  ...makuCatalog,
  // Specialized Services suppliers
  ...roofcapCatalog,
  ...civilLabCatalog,
  ...concreteLabCatalog,
];

// Get catalog for a specific supplier
export function getSupplierCatalog(supplier: string): SupplierPrice[] {
  switch (supplier.toLowerCase()) {
    case 'buco':
      return bucoCatalog;
    case 'macsteel':
      return macsteelCatalog;
    case 'lafarge':
      return lafargeCatalog;
    case 'raumix':
      return raumixCatalog;
    case 'ksb':
      return ksbCatalog;
    case 'zenzele':
      return zenzeleCatalog;
    case 'avk':
      return avkCatalog;
    case 'sizabantu':
      return sizabantuCatalog;
    case 'stewards&llods':
      return stewardsllodsCatalog;
    case 'marley':
      return marleyCatalog;
    case 'east coast':
      return eastCoastCatalog;
    case 'much plant':
      return muchPlantCatalog;
    case 'polokwane surfacing':
      return polokwaneSurfacingCatalog;
    case 'bosun':
      return bosunCatalog;
    case 'actom':
      return actomCatalog;
    case 'abadere':
      return abadereCatalog;
    case 'arb':
      return arbCatalog;
    case 'voltex':
      return voltexCatalog;
    case 'power equipment':
      return powerEquipmentCatalog;
    case 'aermart':
      return aermartCatalog;
    case 'builders':
      return buildersCatalog;
    case 'leroy merlin':
      return leroyMerlinCatalog;
    case 'timber city':
      return timberCityCatalog;
    case 'atlas plant':
      return atlasPlantCatalog;
    case 'talisman':
      return talismanCatalog;
    case 'infraset':
      return infrasetCatalog;
    case 'techni crete':
      return techniCreteCatalog;
    case 'njr steel':
      return njrSteelCatalog;
    case 'rsc':
      return rscCatalog;
    case 'global roofing':
      return globalRoofingCatalog;
    // New suppliers from spreadsheet
    case 'sekunalo':
      return sekunaloCatalog;
    case 'struandale':
      return struandaleCatalog;
    case 'llocs':
      return llocsCatalog;
    case 'polyframe':
      return polyframeCatalog;
    case 'east coast fencing':
      return eastCoastFencingCatalog;
    case 'sherrerd road signs':
      return sherrerdRoadSignsCatalog;
    case 'vyltex':
    case 'vyl-tex':
      return vylTexCatalog;
    case 'aermatt':
      return aermattCatalog;
    case 'aguenie':
      return aguenieCatalog;
    case 'a3m':
      return a3mCatalog;
    case 'builders depot':
      return buildersDepotCatalog;
    case 'bilt':
      return biltCatalog;
    case 'jvr steel':
      return jvrSteelCatalog;
    case 'rsc global':
      return rscGlobalCatalog;
    case 'corrshine':
      return corrshineCatalog;
    // Hire and Rental suppliers
    case 'container world':
      return containerWorldCatalog;
    case 'talisman hire':
      return talismanHireCatalog;
    case 'hireall':
      return hireallCatalog;
    case 'much asphalt plant hire':
      return muchAsphaltPlantHireCatalog;
    case 'pan':
      return panCatalog;
    case 'bridgedeck':
      return bridgedeckCatalog;
    case 'maku':
      return makuCatalog;
    // Specialized Services suppliers
    case 'roofcap':
      return roofcapCatalog;
    case 'civil lab':
      return civilLabCatalog;
    case 'concrete lab':
      return concreteLabCatalog;
    default:
      return [];
  }
}

// Get all available suppliers (55 total - matches comprehensiveScraperData.ts)
export function getAllSuppliers(): string[] {
  return [
    // Core 4 Suppliers
    'Buco', 'Macsteel', 'Lafarge', 'Raumix',
    // Water Infrastructure
    'KSB', 'ZENZELE', 'AVK', 'SIZABANTU', 'STEWARDS&LLODS', 'MARLEY',
    // Road & Surfacing
    'EAST COAST', 'POLOKWANE SURFACING', 'BOSUN',
    // Electrical
    'ACTOM', 'ABADERE', 'ARB', 'VOLTEX', 'POWER EQUIPMENT',
    // Building Materials
    'AERMART', 'BUILDERS', 'LEROY MERLIN', 'TIMBER CITY',
    // Plant Hire & Equipment
    'MUCH PLANT', 'ATLAS PLANT',
    // Steel & Roofing
    'NJR STEEL', 'RSC', 'GLOBAL ROOFING',
    // Civils & Infrastructure
    'INFRASET', 'TECHNI CRETE', 'TALISMAN',
    // Testing Services
    'ROOFCAP', 'CIVIL LAB', 'CONCRETE LAB',
    // Additional Suppliers
    'SEKUNALO', 'STRUANDALE', 'LLOCS', 'POLYFRAME', 'EAST COAST FENCING',
    'SHERRERD ROAD SIGNS', 'VYLTEX', 'AERMATT', 'AGUENIE', 'A3M',
    'BUILDERS DEPOT', 'BILT', 'JVR STEEL', 'RSC GLOBAL', 'CORRSHINE',
    // Hire and Rental
    'CONTAINER WORLD', 'TALISMAN HIRE', 'HIREALL', 'MUCH ASPHALT PLANT HIRE',
    'PAN', 'BRIDGEDECK', 'MAKU'
  ];
}

// Get all items from all suppliers
export function getAllSupplierItems(): SupplierPrice[] {
  return allSupplierCatalogs;
}