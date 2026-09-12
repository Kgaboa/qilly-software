/**
 * Comprehensive Product Catalogs for All 52 Suppliers
 * Each supplier has realistic product data based on their specialty
 * 
 * NOTE: In production, these would be replaced by actual web scraping
 * or REST API calls to fetch real-time product data from supplier websites
 */

import { ProductData } from './base-fetcher';

export class SupplierCatalogs {
  // ============================================================================
  // BUILDING MATERIALS PRODUCT CATALOGS
  // ============================================================================

  static getAeroliteProducts(): ProductData[] {
    return [
      { productCode: 'AER-INS-135', description: 'Aerolite Insulation 135mm (Think Pink)', unit: 'm2', unitPrice: 85.00, category: 'building_materials', isAvailable: true },
      { productCode: 'AER-INS-145', description: 'Aerolite Insulation 145mm', unit: 'm2', unitPrice: 95.00, category: 'building_materials', isAvailable: true },
      { productCode: 'AER-INS-175', description: 'Aerolite Insulation 175mm', unit: 'm2', unitPrice: 115.00, category: 'building_materials', isAvailable: true },
      { productCode: 'AER-CLS-135', description: 'Aerolite Classic 135mm', unit: 'm2', unitPrice: 78.00, category: 'building_materials', isAvailable: true },
      { productCode: 'AER-WALL-75', description: 'Aerolite Wall Insulation 75mm', unit: 'm2', unitPrice: 65.00, category: 'building_materials', isAvailable: true },
      { productCode: 'AER-ROOF-135', description: 'Aerolite Roof Blanket 135mm', unit: 'm2', unitPrice: 82.00, category: 'building_materials', isAvailable: true },
    ];
  }

  static getBiltProducts(): ProductData[] {
    return [
      { productCode: 'BIL-CEM-001', description: 'PPC Cement 42.5N', unit: '50kg bag', unitPrice: 96.50, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BIL-BRK-001', description: 'Stock Brick 230x110x76mm', unit: '1000 bricks', unitPrice: 4300.00, category: 'building_materials', isAvailable: true },
      { productCode: 'BIL-SND-001', description: 'Building Sand', unit: 'm3', unitPrice: 290.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BIL-STL-001', description: 'Reinforcing Bar Y12', unit: '6m length', unitPrice: 118.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'BIL-TMB-001', description: 'Pine SAP 38x114mm', unit: '3.6m length', unitPrice: 91.00, category: 'timber', isAvailable: true },
      { productCode: 'BIL-RF-001', description: 'IBR Sheet 0.5mm', unit: 'linear meter', unitPrice: 116.00, category: 'roofing', isAvailable: true },
      { productCode: 'BIL-PIP-001', description: 'PVC Pipe 110mm', unit: '6m length', unitPrice: 289.00, category: 'plumbing', isAvailable: true },
      { productCode: 'BIL-PNT-001', description: 'PVA White 20L', unit: '20L', unitPrice: 495.00, category: 'paint_finishes', isAvailable: true },
    ];
  }

  static getBuildItProducts(): ProductData[] {
    return [
      { productCode: 'BLD-CEM-001', description: 'PPC Cement 42.5N', unit: '50kg bag', unitPrice: 93.99, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BLD-CEM-002', description: 'AfriSam Cement 42.5N', unit: '50kg bag', unitPrice: 91.99, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BLD-BRK-001', description: 'Clay Stock Brick', unit: '1000 bricks', unitPrice: 4200.00, category: 'building_materials', isAvailable: true },
      { productCode: 'BLD-BRK-002', description: 'Maxi Brick', unit: '1000 bricks', unitPrice: 4800.00, category: 'building_materials', isAvailable: true },
      { productCode: 'BLD-SND-001', description: 'Building Sand', unit: 'm3', unitPrice: 278.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BLD-STN-001', description: 'Stone 19mm', unit: 'm3', unitPrice: 390.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BLD-STL-001', description: 'Reinforcing Bar Y10', unit: '6m length', unitPrice: 66.50, category: 'steel_metal', isAvailable: true },
      { productCode: 'BLD-STL-002', description: 'Reinforcing Bar Y12', unit: '6m length', unitPrice: 110.50, category: 'steel_metal', isAvailable: true },
      { productCode: 'BLD-TMB-001', description: 'Pine SAP 38x114mm', unit: '3.6m length', unitPrice: 86.00, category: 'timber', isAvailable: true },
      { productCode: 'BLD-RF-001', description: 'IBR Sheet 0.5mm', unit: 'linear meter', unitPrice: 110.00, category: 'roofing', isAvailable: true },
    ];
  }

  static getBuildersDepotProducts(): ProductData[] {
    return [
      { productCode: 'BDP-CEM-001', description: 'PPC Cement 42.5N', unit: '50kg bag', unitPrice: 97.50, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BDP-BRK-001', description: 'Stock Brick', unit: '1000 bricks', unitPrice: 4350.00, category: 'building_materials', isAvailable: true },
      { productCode: 'BDP-SND-001', description: 'Building Sand', unit: 'm3', unitPrice: 292.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BDP-STL-001', description: 'Reinforcing Bar Y12', unit: '6m length', unitPrice: 119.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'BDP-TMB-001', description: 'Pine SAP 38x114mm', unit: '3.6m length', unitPrice: 92.50, category: 'timber', isAvailable: true },
      { productCode: 'BDP-PIP-001', description: 'PVC Pipe 110mm', unit: '6m length', unitPrice: 292.00, category: 'plumbing', isAvailable: true },
      { productCode: 'BDP-CAB-001', description: 'Cable 2.5mm²', unit: 'meter', unitPrice: 19.00, category: 'electrical', isAvailable: true },
    ];
  }

  static getCashbuildProducts(): ProductData[] {
    return [
      { productCode: 'CSH-CEM-001', description: 'PPC Cement 42.5N', unit: '50kg bag', unitPrice: 92.50, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'CSH-CEM-002', description: 'AfriSam Cement 42.5N', unit: '50kg bag', unitPrice: 90.50, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'CSH-BRK-001', description: 'Stock Brick', unit: '1000 bricks', unitPrice: 4100.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CSH-BRK-002', description: 'Face Brick', unit: '1000 bricks', unitPrice: 5200.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CSH-SND-001', description: 'Building Sand', unit: 'm3', unitPrice: 275.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'CSH-SND-002', description: 'Plaster Sand', unit: 'm3', unitPrice: 285.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'CSH-STN-001', description: 'Stone 19mm', unit: 'm3', unitPrice: 385.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'CSH-STL-001', description: 'Reinforcing Bar Y12', unit: '6m length', unitPrice: 108.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'CSH-TMB-001', description: 'Pine SAP 38x114mm', unit: '3.6m length', unitPrice: 84.00, category: 'timber', isAvailable: true },
      { productCode: 'CSH-RF-001', description: 'IBR Sheet 0.5mm', unit: 'linear meter', unitPrice: 108.00, category: 'roofing', isAvailable: true },
    ];
  }

  static getCeramicIndustriesProducts(): ProductData[] {
    return [
      { productCode: 'CER-TIL-300', description: 'Ceramic Floor Tile 300x300mm', unit: 'm2', unitPrice: 185.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CER-TIL-400', description: 'Ceramic Floor Tile 400x400mm', unit: 'm2', unitPrice: 225.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CER-TIL-600', description: 'Ceramic Floor Tile 600x600mm', unit: 'm2', unitPrice: 295.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CER-WALL-200', description: 'Ceramic Wall Tile 200x300mm', unit: 'm2', unitPrice: 165.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CER-WALL-250', description: 'Ceramic Wall Tile 250x400mm', unit: 'm2', unitPrice: 195.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CER-POR-600', description: 'Porcelain Tile 600x600mm', unit: 'm2', unitPrice: 385.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CER-POR-800', description: 'Porcelain Tile 800x800mm', unit: 'm2', unitPrice: 485.00, category: 'building_materials', isAvailable: true },
    ];
  }

  static getCTMProducts(): ProductData[] {
    return [
      { productCode: 'CTM-TIL-300', description: 'Floor Tile 300x300mm', unit: 'm2', unitPrice: 175.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CTM-TIL-400', description: 'Floor Tile 400x400mm', unit: 'm2', unitPrice: 215.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CTM-TIL-600', description: 'Floor Tile 600x600mm', unit: 'm2', unitPrice: 285.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CTM-WALL-200', description: 'Wall Tile 200x300mm', unit: 'm2', unitPrice: 155.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CTM-POR-600', description: 'Porcelain Tile 600x600mm', unit: 'm2', unitPrice: 375.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CTM-LAM-AC3', description: 'Laminate Flooring AC3', unit: 'm2', unitPrice: 185.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CTM-LAM-AC4', description: 'Laminate Flooring AC4', unit: 'm2', unitPrice: 245.00, category: 'building_materials', isAvailable: true },
      { productCode: 'CTM-VIN-001', description: 'Vinyl Flooring', unit: 'm2', unitPrice: 165.00, category: 'building_materials', isAvailable: true },
    ];
  }

  static getGyprocProducts(): ProductData[] {
    return [
      { productCode: 'GYP-STD-9', description: 'Gyproc Standard Board 9mm', unit: '2400x1200mm sheet', unitPrice: 125.00, category: 'building_materials', isAvailable: true },
      { productCode: 'GYP-STD-12', description: 'Gyproc Standard Board 12mm', unit: '2400x1200mm sheet', unitPrice: 145.00, category: 'building_materials', isAvailable: true },
      { productCode: 'GYP-MR-12', description: 'Gyproc Moisture Resistant 12mm', unit: '2400x1200mm sheet', unitPrice: 165.00, category: 'building_materials', isAvailable: true },
      { productCode: 'GYP-FR-12', description: 'Gyproc Fire Resistant 12mm', unit: '2400x1200mm sheet', unitPrice: 185.00, category: 'building_materials', isAvailable: true },
      { productCode: 'GYP-CEIL-9', description: 'Gyproc Ceiling Board 9mm', unit: '2400x1200mm sheet', unitPrice: 115.00, category: 'building_materials', isAvailable: true },
      { productCode: 'GYP-STUD-50', description: 'Gyproc Steel Stud 50mm', unit: '3m length', unitPrice: 45.00, category: 'building_materials', isAvailable: true },
      { productCode: 'GYP-TRACK-50', description: 'Gyproc Steel Track 50mm', unit: '3m length', unitPrice: 42.00, category: 'building_materials', isAvailable: true },
    ];
  }

  static getItaltileProducts(): ProductData[] {
    return [
      { productCode: 'ITA-TIL-300', description: 'Italian Ceramic Tile 300x300mm', unit: 'm2', unitPrice: 195.00, category: 'building_materials', isAvailable: true },
      { productCode: 'ITA-TIL-600', description: 'Italian Ceramic Tile 600x600mm', unit: 'm2', unitPrice: 315.00, category: 'building_materials', isAvailable: true },
      { productCode: 'ITA-POR-600', description: 'Italian Porcelain 600x600mm', unit: 'm2', unitPrice: 425.00, category: 'building_materials', isAvailable: true },
      { productCode: 'ITA-POR-800', description: 'Italian Porcelain 800x800mm', unit: 'm2', unitPrice: 545.00, category: 'building_materials', isAvailable: true },
      { productCode: 'ITA-MOS-001', description: 'Glass Mosaic Tile', unit: 'm2', unitPrice: 385.00, category: 'building_materials', isAvailable: true },
      { productCode: 'ITA-SAN-BAS', description: 'Bathroom Basin', unit: 'each', unitPrice: 1850.00, category: 'plumbing', isAvailable: true },
      { productCode: 'ITA-SAN-TOI', description: 'Toilet Suite', unit: 'each', unitPrice: 2450.00, category: 'plumbing', isAvailable: true },
    ];
  }

  static getKnaufProducts(): ProductData[] {
    return [
      { productCode: 'KNF-DRY-9', description: 'Knauf Drywall 9mm', unit: '2400x1200mm sheet', unitPrice: 130.00, category: 'building_materials', isAvailable: true },
      { productCode: 'KNF-DRY-12', description: 'Knauf Drywall 12mm', unit: '2400x1200mm sheet', unitPrice: 150.00, category: 'building_materials', isAvailable: true },
      { productCode: 'KNF-MR-12', description: 'Knauf Moisture Resistant 12mm', unit: '2400x1200mm sheet', unitPrice: 170.00, category: 'building_materials', isAvailable: true },
      { productCode: 'KNF-FR-12', description: 'Knauf Fire Resistant 12mm', unit: '2400x1200mm sheet', unitPrice: 190.00, category: 'building_materials', isAvailable: true },
      { productCode: 'KNF-INS-50', description: 'Knauf Insulation 50mm', unit: 'm2', unitPrice: 55.00, category: 'building_materials', isAvailable: true },
      { productCode: 'KNF-INS-75', description: 'Knauf Insulation 75mm', unit: 'm2', unitPrice: 75.00, category: 'building_materials', isAvailable: true },
      { productCode: 'KNF-COMP-20', description: 'Knauf Joint Compound 20kg', unit: '20kg', unitPrice: 185.00, category: 'building_materials', isAvailable: true },
    ];
  }

  static getPennyPinchersProducts(): ProductData[] {
    return [
      { productCode: 'PPH-CEM-001', description: 'PPC Cement 42.5N', unit: '50kg bag', unitPrice: 91.50, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'PPH-BRK-001', description: 'Stock Brick', unit: '1000 bricks', unitPrice: 4050.00, category: 'building_materials', isAvailable: true },
      { productCode: 'PPH-SND-001', description: 'Building Sand', unit: 'm3', unitPrice: 272.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'PPH-STL-001', description: 'Reinforcing Bar Y12', unit: '6m length', unitPrice: 106.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'PPH-TMB-001', description: 'Pine SAP 38x114mm', unit: '3.6m length', unitPrice: 82.50, category: 'timber', isAvailable: true },
      { productCode: 'PPH-PIP-001', description: 'PVC Pipe 110mm', unit: '6m length', unitPrice: 268.00, category: 'plumbing', isAvailable: true },
      { productCode: 'PPH-PNT-001', description: 'PVA White 20L', unit: '20L', unitPrice: 465.00, category: 'paint_finishes', isAvailable: true },
    ];
  }

  static getSaintGobainProducts(): ProductData[] {
    return [
      { productCode: 'SGB-GLS-4', description: 'Float Glass 4mm', unit: 'm2', unitPrice: 285.00, category: 'building_materials', isAvailable: true },
      { productCode: 'SGB-GLS-6', description: 'Float Glass 6mm', unit: 'm2', unitPrice: 385.00, category: 'building_materials', isAvailable: true },
      { productCode: 'SGB-LAM-6', description: 'Laminated Glass 6mm', unit: 'm2', unitPrice: 585.00, category: 'building_materials', isAvailable: true },
      { productCode: 'SGB-TMP-6', description: 'Tempered Glass 6mm', unit: 'm2', unitPrice: 485.00, category: 'building_materials', isAvailable: true },
      { productCode: 'SGB-INS-135', description: 'Saint-Gobain Insulation 135mm', unit: 'm2', unitPrice: 88.00, category: 'building_materials', isAvailable: true },
      { productCode: 'SGB-DRY-12', description: 'Rigips Drywall 12mm', unit: '2400x1200mm sheet', unitPrice: 155.00, category: 'building_materials', isAvailable: true },
    ];
  }

  static getSikaProducts(): ProductData[] {
    return [
      { productCode: 'SIK-SL-001', description: 'Sikaflex 11FC Sealant', unit: '310ml', unitPrice: 95.00, category: 'building_materials', isAvailable: true },
      { productCode: 'SIK-WP-001', description: 'Sika Waterproofing Membrane', unit: 'liter', unitPrice: 185.00, category: 'building_materials', isAvailable: true },
      { productCode: 'SIK-ADH-001', description: 'Sikabond Construction Adhesive', unit: '310ml', unitPrice: 115.00, category: 'building_materials', isAvailable: true },
      { productCode: 'SIK-GRT-001', description: 'Sika Tile Grout', unit: '5kg', unitPrice: 125.00, category: 'building_materials', isAvailable: true },
      { productCode: 'SIK-ADM-001', description: 'Sika Concrete Admixture', unit: 'liter', unitPrice: 145.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'SIK-REP-001', description: 'Sika Concrete Repair Mortar', unit: '25kg', unitPrice: 385.00, category: 'concrete_aggregates', isAvailable: true },
    ];
  }

  static getTALProducts(): ProductData[] {
    return [
      { productCode: 'TAL-ADH-001', description: 'TAL Tile Adhesive', unit: '20kg', unitPrice: 165.00, category: 'building_materials', isAvailable: true },
      { productCode: 'TAL-GRT-001', description: 'TAL Wall Grout', unit: '5kg', unitPrice: 105.00, category: 'building_materials', isAvailable: true },
      { productCode: 'TAL-GRT-002', description: 'TAL Floor Grout', unit: '5kg', unitPrice: 115.00, category: 'building_materials', isAvailable: true },
      { productCode: 'TAL-WP-001', description: 'TAL Waterproofing', unit: 'liter', unitPrice: 175.00, category: 'building_materials', isAvailable: true },
      { productCode: 'TAL-LEV-001', description: 'TAL Self-Leveling Compound', unit: '20kg', unitPrice: 285.00, category: 'building_materials', isAvailable: true },
      { productCode: 'TAL-SCR-001', description: 'TAL Floor Screed', unit: '40kg', unitPrice: 145.00, category: 'building_materials', isAvailable: true },
    ];
  }

  static getTalismanProducts(): ProductData[] {
    return [
      { productCode: 'TAL-HDW-001', description: 'Angle Grinder 115mm', unit: 'each', unitPrice: 485.00, category: 'hardware', isAvailable: true },
      { productCode: 'TAL-HDW-002', description: 'Electric Drill 13mm', unit: 'each', unitPrice: 685.00, category: 'hardware', isAvailable: true },
      { productCode: 'TAL-HDW-003', description: 'Circular Saw 185mm', unit: 'each', unitPrice: 1285.00, category: 'hardware', isAvailable: true },
      { productCode: 'TAL-TL-001', description: 'Hammer Drill Bits Set', unit: 'set', unitPrice: 285.00, category: 'hardware', isAvailable: true },
      { productCode: 'TAL-TL-002', description: 'Spanner Set Metric', unit: 'set', unitPrice: 485.00, category: 'hardware', isAvailable: true },
      { productCode: 'TAL-SAF-001', description: 'Safety Goggles', unit: 'each', unitPrice: 45.00, category: 'hardware', isAvailable: true },
      { productCode: 'TAL-SAF-002', description: 'Hard Hat', unit: 'each', unitPrice: 85.00, category: 'hardware', isAvailable: true },
    ];
  }

  // CONTINUE IN NEXT FILE DUE TO SIZE...
}
