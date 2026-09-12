/**
 * Comprehensive scraper simulation data for ALL suppliers in the catalog
 * This file contains sample products from each supplier to simulate web scraping
 */

import { SupplierPrice } from '../supplierCatalog';

export interface SupplierScraperData {
  supplier: string;
  baseUrl: string;
  categories: { name: string; slug: string; products: Partial<SupplierPrice>[] }[];
}

// Generate comprehensive scraper data for all 55+ suppliers
export const allSuppliersScraperData: SupplierScraperData[] = [
  // ===== CORE 4 SUPPLIERS =====
  {
    supplier: 'Buco',
    baseUrl: 'https://www.buco.co.za',
    categories: [
      {
        name: 'Cement & Concrete',
        slug: 'cement-concrete',
        products: [
          { itemName: 'Cement 50kg', unitPrice: 89.99, unit: 'bag', category: 'Cement', description: 'High-quality Portland cement' },
          { itemName: 'PPC Cement', unitPrice: 92.00, unit: 'bag', category: 'Cement', description: 'Premier Portland cement' },
          { itemName: 'Ready Mix Concrete', unitPrice: 1250.00, unit: 'm3', category: 'Concrete', description: 'Ready mix concrete' },
        ]
      },
      {
        name: 'Steel & Reinforcement',
        slug: 'steel-reinforcement',
        products: [
          { itemName: 'Steel Rod 8mm', unitPrice: 45.00, unit: 'meter', category: 'Steel & Reinforcement', description: '8mm steel reinforcement bar' },
          { itemName: 'Steel Rod 10mm', unitPrice: 65.00, unit: 'meter', category: 'Steel & Reinforcement', description: '10mm steel reinforcement bar' },
          { itemName: 'Steel Rod 12mm', unitPrice: 85.00, unit: 'meter', category: 'Steel & Reinforcement', description: '12mm steel reinforcement bar' },
        ]
      },
      {
        name: 'Bricks & Blocks',
        slug: 'bricks-blocks',
        products: [
          { itemName: 'Clay Brick', unitPrice: 2.85, unit: 'unit', category: 'Bricks & Blocks', description: 'Standard clay brick' },
          { itemName: 'Concrete Block', unitPrice: 12.50, unit: 'unit', category: 'Bricks & Blocks', description: 'Hollow concrete block' },
        ]
      }
    ]
  },
  {
    supplier: 'Macsteel',
    baseUrl: 'https://www.macsteel.co.za',
    categories: [
      {
        name: 'Steel Products',
        slug: 'steel-products',
        products: [
          { itemName: 'Steel Rod 8mm', unitPrice: 42.50, unit: 'meter', category: 'Steel & Reinforcement', description: '8mm steel rod' },
          { itemName: 'Steel Rod 12mm', unitPrice: 82.00, unit: 'meter', category: 'Steel & Reinforcement', description: '12mm steel rod' },
          { itemName: 'Steel Beam IPE200', unitPrice: 2780.00, unit: 'meter', category: 'Steel Sections', description: 'IPE200 steel beam' },
        ]
      },
      {
        name: 'Reinforcement',
        slug: 'reinforcement',
        products: [
          { itemName: 'High Tensile Y12', unitPrice: 87.50, unit: 'meter', category: 'Steel & Reinforcement', description: 'High tensile Y12 bar' },
          { itemName: 'Mild Steel Flat Bar', unitPrice: 145.00, unit: 'meter', category: 'Steel Products', description: 'Mild steel flat bar' },
        ]
      }
    ]
  },
  {
    supplier: 'Lafarge',
    baseUrl: 'https://www.lafarge.co.za',
    categories: [
      {
        name: 'Cement',
        slug: 'cement',
        products: [
          { itemName: 'Cement 50kg', unitPrice: 87.50, unit: 'bag', category: 'Cement', description: 'Portland cement 50kg' },
          { itemName: 'PPC Cement', unitPrice: 88.99, unit: 'bag', category: 'Cement', description: 'PPC cement for construction' },
        ]
      },
      {
        name: 'Concrete',
        slug: 'concrete',
        products: [
          { itemName: 'Ready Mix 30MPa', unitPrice: 1320.00, unit: 'm³', category: 'Concrete', description: '30MPa ready mix concrete' },
          { itemName: 'Ready Mix 40MPa', unitPrice: 1520.00, unit: 'm³', category: 'Concrete', description: '40MPa high-strength concrete' },
        ]
      }
    ]
  },
  {
    supplier: 'Raumix',
    baseUrl: 'https://www.raumix.co.za',
    categories: [
      {
        name: 'Ready Mix Concrete',
        slug: 'ready-mix',
        products: [
          { itemName: 'Ready Mix 20MPa', unitPrice: 1185.00, unit: 'm³', category: 'Concrete', description: '20MPa ready-mixed concrete' },
          { itemName: 'Ready Mix 25MPa', unitPrice: 1240.00, unit: 'm³', category: 'Concrete', description: '25MPa ready-mixed concrete' },
          { itemName: 'Ready Mix 30MPa', unitPrice: 1340.00, unit: 'm³', category: 'Concrete', description: '30MPa ready-mixed concrete' },
        ]
      },
      {
        name: 'Aggregates',
        slug: 'aggregates',
        products: [
          { itemName: '19mm Stone', unitPrice: 350.00, unit: 'ton', category: 'Aggregates', description: '19mm crushed stone' },
          { itemName: 'Concrete Sand', unitPrice: 460.00, unit: 'ton', category: 'Aggregates', description: 'Concrete sand' },
        ]
      }
    ]
  },
  
  // ===== WATER INFRASTRUCTURE SUPPLIERS =====
  {
    supplier: 'KSB',
    baseUrl: 'https://www.ksb.com/za',
    categories: [
      {
        name: 'Water Equipment',
        slug: 'water-equipment',
        products: [
          { itemName: 'Centrifugal Pump 50mm', unitPrice: 12500.00, unit: 'unit', category: 'Water Equipment', description: 'Centrifugal pump for water supply' },
          { itemName: 'Gate Valve 100mm', unitPrice: 2850.00, unit: 'unit', category: 'Water Fittings', description: 'Gate valve for water control' },
        ]
      }
    ]
  },
  {
    supplier: 'ZENZELE',
    baseUrl: 'https://www.zenzele.co.za',
    categories: [
      {
        name: 'Water Pipes',
        slug: 'water-pipes',
        products: [
          { itemName: 'HDPE Pipe 110mm', unitPrice: 185.00, unit: 'meter', category: 'Water Pipes', description: 'HDPE water pipe' },
          { itemName: 'Water Tank 5000L', unitPrice: 8500.00, unit: 'unit', category: 'Water Storage', description: '5000L water tank' },
        ]
      }
    ]
  },
  {
    supplier: 'AVK',
    baseUrl: 'https://www.avk.co.za',
    categories: [
      {
        name: 'Water Valves',
        slug: 'water-valves',
        products: [
          { itemName: 'Gate Valve 80mm', unitPrice: 2650.00, unit: 'unit', category: 'Water Fittings', description: 'Resilient seated gate valve' },
          { itemName: 'Hydrant Valve 100mm', unitPrice: 3850.00, unit: 'unit', category: 'Water Fittings', description: 'Fire hydrant valve' },
        ]
      }
    ]
  },
  {
    supplier: 'SIZABANTU',
    baseUrl: 'https://www.sizabantu.co.za',
    categories: [
      {
        name: 'Water Infrastructure',
        slug: 'water-infrastructure',
        products: [
          { itemName: 'uPVC Pipe 110mm Class 12', unitPrice: 165.00, unit: 'meter', category: 'Water Pipes', description: 'uPVC pressure pipe' },
          { itemName: 'DI Pipe 150mm', unitPrice: 650.00, unit: 'meter', category: 'Water Pipes', description: 'Ductile iron pipe' },
        ]
      }
    ]
  },
  {
    supplier: 'STEWARDS&LLODS',
    baseUrl: 'https://www.stewardsllods.co.za',
    categories: [
      {
        name: 'Precast Concrete',
        slug: 'precast-concrete',
        products: [
          { itemName: 'Concrete Pipe 450mm', unitPrice: 385.00, unit: 'meter', category: 'Water Infrastructure', description: 'Reinforced concrete pipe' },
          { itemName: 'Precast Manhole 1200mm', unitPrice: 4500.00, unit: 'unit', category: 'Water Infrastructure', description: 'Precast manhole chamber' },
        ]
      }
    ]
  },
  {
    supplier: 'MARLEY',
    baseUrl: 'https://www.marley.co.za',
    categories: [
      {
        name: 'Drainage Products',
        slug: 'drainage',
        products: [
          { itemName: 'uPVC Gutter 150mm', unitPrice: 95.00, unit: 'meter', category: 'Drainage', description: 'uPVC rainwater gutter' },
          { itemName: 'PVC Sewer Pipe 110mm', unitPrice: 135.00, unit: 'meter', category: 'Drainage', description: 'PVC sewer pipe' },
        ]
      }
    ]
  },
  
  // ===== ROAD & SURFACING SUPPLIERS =====
  {
    supplier: 'EAST COAST',
    baseUrl: 'https://www.eastcoast.co.za',
    categories: [
      {
        name: 'Asphalt & Road Surfacing',
        slug: 'asphalt-surfacing',
        products: [
          { itemName: 'Asphalt Mix AC20', unitPrice: 850.00, unit: 'ton', category: 'Road Surfacing', description: 'AC20 asphalt mix' },
          { itemName: 'Tack Coat Bitumen', unitPrice: 45.00, unit: 'liter', category: 'Road Materials', description: 'Bitumen tack coat' },
        ]
      }
    ]
  },
  {
    supplier: 'POLOKWANE SURFACING',
    baseUrl: 'https://www.polokwanesurfacing.co.za',
    categories: [
      {
        name: 'Road Surface Treatments',
        slug: 'surface-treatments',
        products: [
          { itemName: 'Cold Mix Asphalt', unitPrice: 950.00, unit: 'ton', category: 'Road Surfacing', description: 'Cold mix asphalt for repairs' },
          { itemName: 'Slurry Seal Application', unitPrice: 65.00, unit: 'm2', category: 'Road Surfacing', description: 'Slurry seal treatment' },
        ]
      }
    ]
  },
  {
    supplier: 'BOSUN',
    baseUrl: 'https://www.bosun.co.za',
    categories: [
      {
        name: 'Road Furniture',
        slug: 'road-furniture',
        products: [
          { itemName: 'Road Stud Reflective', unitPrice: 35.00, unit: 'unit', category: 'Road Furniture', description: 'Reflective road stud' },
          { itemName: 'Guard Rail W-Beam', unitPrice: 450.00, unit: 'meter', category: 'Road Safety', description: 'W-beam guard rail' },
        ]
      }
    ]
  },
  
  // ===== ELECTRICAL SUPPLIERS =====
  {
    supplier: 'ACTOM',
    baseUrl: 'https://www.actom.co.za',
    categories: [
      {
        name: 'Electrical Equipment',
        slug: 'electrical-equipment',
        products: [
          { itemName: 'Transformer 500kVA', unitPrice: 185000.00, unit: 'unit', category: 'Electrical Equipment', description: '500kVA transformer' },
          { itemName: 'Electric Motor 15kW', unitPrice: 18500.00, unit: 'unit', category: 'Motors', description: '15kW electric motor' },
        ]
      }
    ]
  },
  {
    supplier: 'ABADERE',
    baseUrl: 'https://www.abadere.co.za',
    categories: [
      {
        name: 'Street Lighting',
        slug: 'street-lighting',
        products: [
          { itemName: 'Steel Lighting Pole 8m', unitPrice: 4500.00, unit: 'unit', category: 'Street Lighting', description: '8m lighting pole' },
          { itemName: 'LED Street Light 60W', unitPrice: 2850.00, unit: 'unit', category: 'Street Lighting', description: '60W LED street light' },
        ]
      }
    ]
  },
  {
    supplier: 'ARB',
    baseUrl: 'https://www.arb.co.za',
    categories: [
      {
        name: 'Electrical Cables',
        slug: 'cables',
        products: [
          { itemName: 'XLPE Cable 4x16mm', unitPrice: 95.00, unit: 'meter', category: 'Cables', description: 'XLPE insulated cable' },
          { itemName: 'Armoured Cable 4x70mm', unitPrice: 385.00, unit: 'meter', category: 'Cables', description: 'Armoured cable' },
        ]
      }
    ]
  },
  {
    supplier: 'VOLTEX',
    baseUrl: 'https://www.voltex.co.za',
    categories: [
      {
        name: 'Electrical Distribution',
        slug: 'distribution',
        products: [
          { itemName: 'Distribution Board 12-Way', unitPrice: 1850.00, unit: 'unit', category: 'Electrical Equipment', description: '12-way distribution board' },
          { itemName: 'MCB 20A Single Pole', unitPrice: 65.00, unit: 'unit', category: 'Electrical Components', description: '20A circuit breaker' },
        ]
      }
    ]
  },
  {
    supplier: 'POWER EQUIPMENT',
    baseUrl: 'https://www.powerequipment.co.za',
    categories: [
      {
        name: 'Power Generation',
        slug: 'power-generation',
        products: [
          { itemName: 'Generator 20kVA Diesel', unitPrice: 65000.00, unit: 'unit', category: 'Power Generation', description: '20kVA diesel generator' },
          { itemName: 'Solar Panel 350W', unitPrice: 2500.00, unit: 'unit', category: 'Renewable Energy', description: '350W solar panel' },
        ]
      }
    ]
  },
  
  // ===== BUILDING MATERIALS SUPPLIERS =====
  {
    supplier: 'AERMART',
    baseUrl: 'https://www.aermart.co.za',
    categories: [
      {
        name: 'Pneumatic Equipment',
        slug: 'pneumatic',
        products: [
          { itemName: 'Air Compressor 100L', unitPrice: 8500.00, unit: 'unit', category: 'Pneumatic Equipment', description: '100L air compressor' },
          { itemName: 'Pneumatic Drill', unitPrice: 2850.00, unit: 'unit', category: 'Pneumatic Tools', description: 'Pneumatic drill' },
        ]
      }
    ]
  },
  {
    supplier: 'BUILDERS',
    baseUrl: 'https://www.builders.co.za',
    categories: [
      {
        name: 'Building Materials',
        slug: 'building-materials',
        products: [
          { itemName: 'Cement 50kg', unitPrice: 87.50, unit: 'bag', category: 'Cement', description: 'Portland cement' },
          { itemName: 'Clay Brick NFP', unitPrice: 2.75, unit: 'unit', category: 'Bricks & Blocks', description: 'Clay brick' },
        ]
      }
    ]
  },
  {
    supplier: 'LEROY MERLIN',
    baseUrl: 'https://www.leroymerlin.co.za',
    categories: [
      {
        name: 'Tiles & Finishes',
        slug: 'tiles-finishes',
        products: [
          { itemName: 'Ceramic Tiles Floor 300x300mm', unitPrice: 125.00, unit: 'm2', category: 'Tiles', description: 'Ceramic floor tiles' },
          { itemName: 'Paint Interior White 20L', unitPrice: 650.00, unit: 'unit', category: 'Paint', description: 'Interior white paint' },
        ]
      }
    ]
  },
  {
    supplier: 'TIMBER CITY',
    baseUrl: 'https://www.timbercity.co.za',
    categories: [
      {
        name: 'Timber Products',
        slug: 'timber',
        products: [
          { itemName: 'Pine Timber 38x114mm', unitPrice: 55.00, unit: 'meter', category: 'Timber', description: 'Pine structural timber' },
          { itemName: 'Plywood 18mm Marine', unitPrice: 850.00, unit: 'sheet', category: 'Boards', description: 'Marine plywood sheet' },
        ]
      }
    ]
  },
  
  // ===== PLANT HIRE & EQUIPMENT =====
  {
    supplier: 'MUCH PLANT',
    baseUrl: 'https://www.muchplant.co.za',
    categories: [
      {
        name: 'Plant Hire',
        slug: 'plant-hire',
        products: [
          { itemName: 'Excavator Hire with Operator', unitPrice: 1850.00, unit: 'day', category: 'Plant Hire', description: 'Excavator with operator' },
          { itemName: 'Grader Hire with Operator', unitPrice: 2500.00, unit: 'day', category: 'Plant Hire', description: 'Motor grader with operator' },
          { itemName: 'TLB Hire', unitPrice: 1450.00, unit: 'day', category: 'Plant Hire', description: 'Tractor loader backhoe' },
        ]
      }
    ]
  },
  {
    supplier: 'ATLAS PLANT',
    baseUrl: 'https://www.atlasplant.co.za',
    categories: [
      {
        name: 'Construction Equipment',
        slug: 'construction-equipment',
        products: [
          { itemName: 'Concrete Mixer 260L', unitPrice: 8500.00, unit: 'unit', category: 'Construction Equipment', description: '260L concrete mixer' },
          { itemName: '10m3 Tippers', unitPrice: 820.00, unit: 'hour', category: 'Plant Hire', description: '10m3 tipper truck' },
          { itemName: 'Waterpump (Capacity 50,000 liter/hr medium)', unitPrice: 435.00, unit: 'hour', category: 'Plant Hire', description: 'Water pump 50,000 l/hr' },
        ]
      }
    ]
  },
  
  // ===== STEEL & ROOFING =====
  {
    supplier: 'NJR STEEL',
    baseUrl: 'https://www.njrsteel.co.za',
    categories: [
      {
        name: 'Steel & Reinforcement',
        slug: 'steel',
        products: [
          { itemName: 'Steel Rod 8mm Y12', unitPrice: 41.50, unit: 'meter', category: 'Steel & Reinforcement', description: '8mm steel bar' },
          { itemName: 'Steel Fabric Mesh D193', unitPrice: 210.00, unit: 'm2', category: 'Steel & Reinforcement', description: 'D193 steel mesh' },
        ]
      }
    ]
  },
  {
    supplier: 'RSC',
    baseUrl: 'https://www.rsc.co.za',
    categories: [
      {
        name: 'Roofing Sheets',
        slug: 'roofing',
        products: [
          { itemName: 'IBR Roof Sheet 0.5mm', unitPrice: 125.00, unit: 'meter', category: 'Roofing', description: 'IBR corrugated sheet' },
          { itemName: 'Colorbond Roof Sheet', unitPrice: 185.00, unit: 'meter', category: 'Roofing', description: 'Colorbond roof sheet' },
        ]
      }
    ]
  },
  {
    supplier: 'GLOBAL ROOFING',
    baseUrl: 'https://www.globalroofing.co.za',
    categories: [
      {
        name: 'Structural Steel & Roofing',
        slug: 'steel-roofing',
        products: [
          { itemName: 'Steel Truss 6m Span', unitPrice: 4500.00, unit: 'unit', category: 'Structural Steel', description: '6m steel roof truss' },
          { itemName: 'Chromadek Sheet 0.5mm', unitPrice: 165.00, unit: 'meter', category: 'Roofing', description: 'Chromadek roofing sheet' },
        ]
      }
    ]
  },
  
  // ===== CIVILS & INFRASTRUCTURE =====
  {
    supplier: 'INFRASET',
    baseUrl: 'https://www.infraset.co.za',
    categories: [
      {
        name: 'Civils Products',
        slug: 'civils',
        products: [
          { itemName: 'Concrete Kerb K12', unitPrice: 95.00, unit: 'meter', category: 'Civils Products', description: 'Precast concrete kerb' },
          { itemName: 'Paving Block 80mm Grey', unitPrice: 285.00, unit: 'm2', category: 'Paving', description: 'Concrete paving blocks' },
        ]
      }
    ]
  },
  {
    supplier: 'TECHNI CRETE',
    baseUrl: 'https://www.technicrete.co.za',
    categories: [
      {
        name: 'Precast Structures',
        slug: 'precast',
        products: [
          { itemName: 'Retaining Wall Block', unitPrice: 125.00, unit: 'unit', category: 'Civils Products', description: 'Retaining wall block' },
          { itemName: 'Culvert Box 1200x1200mm', unitPrice: 8500.00, unit: 'meter', category: 'Civils Products', description: 'Precast box culvert' },
        ]
      }
    ]
  },
  {
    supplier: 'TALISMAN',
    baseUrl: 'https://www.talisman.co.za',
    categories: [
      {
        name: 'Doors & Windows',
        slug: 'doors-windows',
        products: [
          { itemName: 'Door Internal Hollow Core', unitPrice: 650.00, unit: 'unit', category: 'Doors & Windows', description: 'Hollow core door' },
          { itemName: 'Window Aluminium Sliding 1.2x1.2m', unitPrice: 1850.00, unit: 'unit', category: 'Doors & Windows', description: 'Aluminium window' },
        ]
      }
    ]
  },
  
  // ===== TESTING SERVICES =====
  {
    supplier: 'ROOFCAP',
    baseUrl: 'https://www.roofcap.co.za',
    categories: [
      {
        name: 'Testing Services',
        slug: 'testing',
        products: [
          { itemName: 'Soil Compaction Testing', unitPrice: 1850.00, unit: 'test', category: 'Testing Services', description: 'Soil compaction testing' },
          { itemName: 'Concrete Cube Testing', unitPrice: 185.00, unit: 'test', category: 'Testing Services', description: 'Concrete cube testing' },
          { itemName: 'CBR Testing', unitPrice: 2200.00, unit: 'test', category: 'Testing Services', description: 'CBR testing' },
        ]
      }
    ]
  },
  {
    supplier: 'CIVIL LAB',
    baseUrl: 'https://www.civillab.co.za',
    categories: [
      {
        name: 'Civil Engineering Testing',
        slug: 'civil-testing',
        products: [
          { itemName: 'Geotechnical Investigation', unitPrice: 8500.00, unit: 'borehole', category: 'Testing Services', description: 'Geotechnical investigation' },
          { itemName: 'Soil Classification Testing', unitPrice: 1250.00, unit: 'test', category: 'Testing Services', description: 'Soil classification' },
          { itemName: 'Water Quality Testing', unitPrice: 950.00, unit: 'test', category: 'Testing Services', description: 'Water quality testing' },
        ]
      }
    ]
  },
  {
    supplier: 'CONCRETE LAB',
    baseUrl: 'https://www.concretelab.co.za',
    categories: [
      {
        name: 'Concrete Testing',
        slug: 'concrete-testing',
        products: [
          { itemName: 'Concrete Compressive Strength Testing 28-Day', unitPrice: 195.00, unit: 'test', category: 'Testing Services', description: '28-day strength testing' },
          { itemName: 'Concrete Slump Testing', unitPrice: 285.00, unit: 'test', category: 'Testing Services', description: 'Slump testing' },
        ]
      }
    ]
  },
  
  // ===== ADDITIONAL SUPPLIERS (condensed for space) =====
  {
    supplier: 'SEKUNALO',
    baseUrl: 'https://www.sekunalo.co.za',
    categories: [{ name: 'Fencing', slug: 'fencing', products: [
      { itemName: 'Palisade Fencing', unitPrice: 450.00, unit: 'meter', category: 'Fencing', description: 'Palisade fence' },
    ]}]
  },
  {
    supplier: 'STRUANDALE',
    baseUrl: 'https://www.struandale.co.za',
    categories: [{ name: 'Formwork', slug: 'formwork', products: [
      { itemName: 'Formwork Panel 1.2x2.4m', unitPrice: 850.00, unit: 'unit', category: 'Formwork', description: 'Formwork panel' },
    ]}]
  },
  {
    supplier: 'LLOCS',
    baseUrl: 'https://www.llocs.co.za',
    categories: [{ name: 'Concrete Products', slug: 'concrete', products: [
      { itemName: 'Precast Lintels', unitPrice: 185.00, unit: 'meter', category: 'Precast', description: 'Precast concrete lintel' },
    ]}]
  },
  {
    supplier: 'POLYFRAME',
    baseUrl: 'https://www.polyframe.co.za',
    categories: [{ name: 'Polyethylene Products', slug: 'poly-products', products: [
      { itemName: 'HDPE Geomembrane', unitPrice: 95.00, unit: 'm2', category: 'Geosynthetics', description: 'HDPE geomembrane' },
    ]}]
  },
  {
    supplier: 'EAST COAST FENCING',
    baseUrl: 'https://www.eastcoastfencing.co.za',
    categories: [{ name: 'Security Fencing', slug: 'security', products: [
      { itemName: 'Electric Fence Wire', unitPrice: 25.00, unit: 'meter', category: 'Fencing', description: 'Electric fence wire' },
    ]}]
  },
  {
    supplier: 'SHERRERD ROAD SIGNS',
    baseUrl: 'https://www.sherrerd.co.za',
    categories: [{ name: 'Road Signs', slug: 'road-signs', products: [
      { itemName: 'Road Sign Stop 900mm', unitPrice: 850.00, unit: 'unit', category: 'Road Signs', description: 'Stop sign' },
    ]}]
  },
  {
    supplier: 'VYLTEX',
    baseUrl: 'https://www.vyltex.co.za',
    categories: [{ name: 'PVC Products', slug: 'pvc', products: [
      { itemName: 'PVC Pipe 110mm', unitPrice: 145.00, unit: 'meter', category: 'Pipes', description: 'PVC drainage pipe' },
    ]}]
  },
  {
    supplier: 'AERMATT',
    baseUrl: 'https://www.aermatt.co.za',
    categories: [{ name: 'Compaction Equipment', slug: 'compaction', products: [
      { itemName: 'Plate Compactor Hire', unitPrice: 650.00, unit: 'day', category: 'Plant Hire', description: 'Plate compactor' },
    ]}]
  },
  {
    supplier: 'AGUENIE',
    baseUrl: 'https://www.aguenie.co.za',
    categories: [{ name: 'Industrial Supplies', slug: 'industrial', products: [
      { itemName: 'Safety Barriers', unitPrice: 285.00, unit: 'meter', category: 'Safety', description: 'Temporary safety barrier' },
    ]}]
  },
  {
    supplier: 'A3M',
    baseUrl: 'https://www.a3m.co.za',
    categories: [{ name: 'Road Marking', slug: 'road-marking', products: [
      { itemName: 'Road Marking Paint', unitPrice: 185.00, unit: 'liter', category: 'Road Materials', description: 'Road marking paint' },
    ]}]
  },
  {
    supplier: 'BUILDERS DEPOT',
    baseUrl: 'https://www.buildersdepot.co.za',
    categories: [{ name: 'Building Supplies', slug: 'supplies', products: [
      { itemName: 'River Sand', unitPrice: 470.00, unit: 'ton', category: 'Aggregates', description: 'River sand' },
    ]}]
  },
  {
    supplier: 'BILT',
    baseUrl: 'https://www.bilt.co.za',
    categories: [{ name: 'Construction Materials', slug: 'construction', products: [
      { itemName: 'Plaster Sand', unitPrice: 445.00, unit: 'ton', category: 'Aggregates', description: 'Plaster sand' },
    ]}]
  },
  {
    supplier: 'JVR STEEL',
    baseUrl: 'https://www.jvrsteel.co.za',
    categories: [{ name: 'Steel Supplies', slug: 'steel', products: [
      { itemName: 'Steel Mesh REF193', unitPrice: 215.00, unit: 'm2', category: 'Steel & Reinforcement', description: 'Steel reinforcing mesh' },
    ]}]
  },
  {
    supplier: 'RSC GLOBAL',
    baseUrl: 'https://www.rscglobal.co.za',
    categories: [{ name: 'Roofing Solutions', slug: 'roofing', products: [
      { itemName: 'Roof Sheeting Corrugated', unitPrice: 135.00, unit: 'meter', category: 'Roofing', description: 'Corrugated roof sheet' },
    ]}]
  },
  {
    supplier: 'CORRSHINE',
    baseUrl: 'https://www.corrshine.co.za',
    categories: [{ name: 'Roofing & Cladding', slug: 'cladding', products: [
      { itemName: 'Wall Cladding Panels', unitPrice: 295.00, unit: 'm2', category: 'Cladding', description: 'Wall cladding panels' },
    ]}]
  },
  
  // ===== HIRE & RENTAL =====
  {
    supplier: 'CONTAINER WORLD',
    baseUrl: 'https://www.containerworld.co.za',
    categories: [{ name: 'Container Hire', slug: 'containers', products: [
      { itemName: 'Storage Container 6m', unitPrice: 1850.00, unit: 'month', category: 'Hire & Rental', description: '6m storage container' },
    ]}]
  },
  {
    supplier: 'TALISMAN HIRE',
    baseUrl: 'https://www.talismanhire.co.za',
    categories: [{ name: 'Equipment Hire', slug: 'equipment', products: [
      { itemName: 'Scaffolding Hire', unitPrice: 45.00, unit: 'meter/month', category: 'Hire & Rental', description: 'Scaffolding rental' },
    ]}]
  },
  {
    supplier: 'HIREALL',
    baseUrl: 'https://www.hireall.co.za',
    categories: [{ name: 'Tool Hire', slug: 'tools', products: [
      { itemName: 'Concrete Breaker Hire', unitPrice: 450.00, unit: 'day', category: 'Hire & Rental', description: 'Concrete breaker' },
    ]}]
  },
  {
    supplier: 'MUCH ASPHALT PLANT HIRE',
    baseUrl: 'https://www.muchasphalt.co.za',
    categories: [{ name: 'Asphalt Plant Hire', slug: 'asphalt-plant', products: [
      { itemName: 'Asphalt Paver Hire', unitPrice: 3500.00, unit: 'day', category: 'Hire & Rental', description: 'Asphalt paver with operator' },
    ]}]
  },
  {
    supplier: 'PAN',
    baseUrl: 'https://www.pan.co.za',
    categories: [{ name: 'Scaffolding Hire', slug: 'scaffolding', products: [
      { itemName: 'Mobile Scaffold Tower', unitPrice: 850.00, unit: 'week', category: 'Hire & Rental', description: 'Mobile scaffold tower' },
    ]}]
  },
  {
    supplier: 'BRIDGEDECK',
    baseUrl: 'https://www.bridgedeck.co.za',
    categories: [{ name: 'Bridge Formwork', slug: 'bridge-formwork', products: [
      { itemName: 'Bridge Deck Formwork System', unitPrice: 45000.00, unit: 'month', category: 'Hire & Rental', description: 'Bridge formwork system' },
    ]}]
  },
  {
    supplier: 'MAKU',
    baseUrl: 'https://www.maku.co.za',
    categories: [{ name: 'Formwork & Scaffolding', slug: 'formwork-scaffolding', products: [
      { itemName: 'Aluminium Formwork System', unitPrice: 165.00, unit: 'm2/month', category: 'Hire & Rental', description: 'Aluminium formwork' },
      { itemName: 'Steel Scaffolding Tube 4m', unitPrice: 28.00, unit: 'unit/month', category: 'Hire & Rental', description: 'Scaffolding tube' },
    ]}]
  },
];
