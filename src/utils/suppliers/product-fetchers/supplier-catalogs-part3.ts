/**
 * Comprehensive Product Catalogs - Part 3
 * Hardware, Equipment Hire, Paint & Finishes, Plumbing suppliers
 */

import { ProductData } from './base-fetcher';

export class SupplierCatalogsPart3 {
  // ============================================================================
  // HARDWARE & EQUIPMENT PRODUCT CATALOGS
  // ============================================================================

  static getAtlasPlantProducts(): ProductData[] {
    return [
      { productCode: 'ATL-EXC-20T', description: '20 Ton Excavator Hire', unit: 'per day', unitPrice: 3500.00, category: 'hardware', isAvailable: true },
      { productCode: 'ATL-TLB-001', description: 'TLB (Backhoe Loader) Hire', unit: 'per day', unitPrice: 2800.00, category: 'hardware', isAvailable: true },
      { productCode: 'ATL-GRD-001', description: 'Grader Hire', unit: 'per day', unitPrice: 4500.00, category: 'hardware', isAvailable: true },
      { productCode: 'ATL-RLR-10T', description: 'Roller 10 Ton Hire', unit: 'per day', unitPrice: 2200.00, category: 'hardware', isAvailable: true },
      { productCode: 'ATL-DMP-10T', description: 'Dump Truck 10m³ Hire', unit: 'per day', unitPrice: 2500.00, category: 'hardware', isAvailable: true },
      { productCode: 'ATL-LOD-001', description: 'Front End Loader Hire', unit: 'per day', unitPrice: 3200.00, category: 'hardware', isAvailable: true },
      { productCode: 'ATL-BLD-001', description: 'Bulldozer Hire', unit: 'per day', unitPrice: 4800.00, category: 'hardware', isAvailable: true },
      { productCode: 'ATL-CRN-001', description: 'Mobile Crane 20T Hire', unit: 'per day', unitPrice: 5500.00, category: 'hardware', isAvailable: true },
    ];
  }

  static getBosunProducts(): ProductData[] {
    return [
      { productCode: 'BOS-SCF-STD', description: 'Steel Scaffold Tube 48mm', unit: '6m length', unitPrice: 185.00, category: 'hardware', isAvailable: true },
      { productCode: 'BOS-CLP-001', description: 'Scaffold Clamp', unit: 'each', unitPrice: 45.00, category: 'hardware', isAvailable: true },
      { productCode: 'BOS-BRD-001', description: 'Scaffold Board 3.9m', unit: 'each', unitPrice: 285.00, category: 'hardware', isAvailable: true },
      { productCode: 'BOS-FRM-001', description: 'H-Frame 1.8m', unit: 'each', unitPrice: 485.00, category: 'hardware', isAvailable: true },
      { productCode: 'BOS-LAD-2.4', description: 'Aluminium Ladder 2.4m', unit: 'each', unitPrice: 685.00, category: 'hardware', isAvailable: true },
      { productCode: 'BOS-LAD-3.6', description: 'Aluminium Ladder 3.6m', unit: 'each', unitPrice: 985.00, category: 'hardware', isAvailable: true },
      { productCode: 'BOS-STP-001', description: 'Step Ladder 1.8m', unit: 'each', unitPrice: 485.00, category: 'hardware', isAvailable: true },
      { productCode: 'BOS-BASE-001', description: 'Scaffold Base Plate', unit: 'each', unitPrice: 125.00, category: 'hardware', isAvailable: true },
    ];
  }

  static getContainerWorldProducts(): ProductData[] {
    return [
      { productCode: 'CNT-20FT-STD', description: '20ft Shipping Container', unit: 'each', unitPrice: 28500.00, category: 'hardware', isAvailable: true },
      { productCode: 'CNT-40FT-STD', description: '40ft Shipping Container', unit: 'each', unitPrice: 45000.00, category: 'hardware', isAvailable: true },
      { productCode: 'CNT-20FT-HC', description: '20ft High Cube Container', unit: 'each', unitPrice: 32500.00, category: 'hardware', isAvailable: true },
      { productCode: 'CNT-40FT-HC', description: '40ft High Cube Container', unit: 'each', unitPrice: 52000.00, category: 'hardware', isAvailable: true },
      { productCode: 'CNT-OFF-20', description: '20ft Office Container', unit: 'each', unitPrice: 45000.00, category: 'hardware', isAvailable: true },
      { productCode: 'CNT-OFF-40', description: '40ft Office Container', unit: 'each', unitPrice: 75000.00, category: 'hardware', isAvailable: true },
      { productCode: 'CNT-STR-20', description: '20ft Storage Container', unit: 'each', unitPrice: 26500.00, category: 'hardware', isAvailable: true },
    ];
  }

  static getHireallProducts(): ProductData[] {
    return [
      { productCode: 'HIR-CMP-50L', description: 'Air Compressor 50L Hire', unit: 'per day', unitPrice: 250.00, category: 'hardware', isAvailable: true },
      { productCode: 'HIR-GEN-2K', description: 'Generator 2kVA Hire', unit: 'per day', unitPrice: 350.00, category: 'hardware', isAvailable: true },
      { productCode: 'HIR-MIX-120', description: 'Concrete Mixer 120L Hire', unit: 'per day', unitPrice: 180.00, category: 'hardware', isAvailable: true },
      { productCode: 'HIR-PLT-001', description: 'Plate Compactor Hire', unit: 'per day', unitPrice: 280.00, category: 'hardware', isAvailable: true },
      { productCode: 'HIR-VIB-001', description: 'Concrete Vibrator Hire', unit: 'per day', unitPrice: 200.00, category: 'hardware', isAvailable: true },
      { productCode: 'HIR-SAW-001', description: 'Concrete Saw Hire', unit: 'per day', unitPrice: 320.00, category: 'hardware', isAvailable: true },
      { productCode: 'HIR-WLD-001', description: 'Welding Machine Hire', unit: 'per day', unitPrice: 280.00, category: 'hardware', isAvailable: true },
      { productCode: 'HIR-GEN-5K', description: 'Generator 5kVA Hire', unit: 'per day', unitPrice: 550.00, category: 'hardware', isAvailable: true },
    ];
  }

  static getMuchPlantProducts(): ProductData[] {
    return [
      { productCode: 'MCH-EXC-20T', description: '20 Ton Excavator Hire', unit: 'per day', unitPrice: 3400.00, category: 'hardware', isAvailable: true },
      { productCode: 'MCH-TLB-001', description: 'TLB Hire', unit: 'per day', unitPrice: 2700.00, category: 'hardware', isAvailable: true },
      { productCode: 'MCH-GRD-001', description: 'Grader Hire', unit: 'per day', unitPrice: 4400.00, category: 'hardware', isAvailable: true },
      { productCode: 'MCH-RLR-10T', description: 'Roller 10 Ton Hire', unit: 'per day', unitPrice: 2100.00, category: 'hardware', isAvailable: true },
      { productCode: 'MCH-DMP-001', description: 'Dump Truck Hire', unit: 'per day', unitPrice: 2400.00, category: 'hardware', isAvailable: true },
      { productCode: 'MCH-ASP-001', description: 'Asphalt Paver Hire', unit: 'per day', unitPrice: 5500.00, category: 'hardware', isAvailable: true },
      { productCode: 'MCH-ASP-PLT', description: 'Asphalt Plant Hire', unit: 'per day', unitPrice: 8500.00, category: 'hardware', isAvailable: true },
      { productCode: 'MCH-CMP-001', description: 'Compactor Hire', unit: 'per day', unitPrice: 1800.00, category: 'hardware', isAvailable: true },
    ];
  }

  static getTalismanHireProducts(): ProductData[] {
    return [
      { productCode: 'THR-TL-GEN', description: 'Generator Hire 5kVA', unit: 'per day', unitPrice: 450.00, category: 'hardware', isAvailable: true },
      { productCode: 'THR-TL-CMP', description: 'Compressor Hire 100L', unit: 'per day', unitPrice: 300.00, category: 'hardware', isAvailable: true },
      { productCode: 'THR-TL-WLD', description: 'Welding Machine Hire', unit: 'per day', unitPrice: 280.00, category: 'hardware', isAvailable: true },
      { productCode: 'THR-TL-MIX', description: 'Concrete Mixer Hire', unit: 'per day', unitPrice: 200.00, category: 'hardware', isAvailable: true },
      { productCode: 'THR-TL-SAW', description: 'Concrete Saw Hire', unit: 'per day', unitPrice: 350.00, category: 'hardware', isAvailable: true },
      { productCode: 'THR-SCF-PKG', description: 'Scaffold Package Hire', unit: 'per week', unitPrice: 1500.00, category: 'hardware', isAvailable: true },
      { productCode: 'THR-TL-DRL', description: 'Hammer Drill Hire', unit: 'per day', unitPrice: 150.00, category: 'hardware', isAvailable: true },
    ];
  }

  // ============================================================================
  // PAINT & FINISHES PRODUCT CATALOGS
  // ============================================================================

  static getDuluxProducts(): ProductData[] {
    return [
      { productCode: 'DLX-INT-WHT', description: 'Dulux Interior White 20L', unit: '20L', unitPrice: 685.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'DLX-EXT-WHT', description: 'Dulux Weatherguard White 20L', unit: '20L', unitPrice: 785.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'DLX-INT-MAG', description: 'Dulux Interior Magnolia 20L', unit: '20L', unitPrice: 695.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'DLX-EXT-CRM', description: 'Dulux Weatherguard Cream 20L', unit: '20L', unitPrice: 795.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'DLX-PRM-WHT', description: 'Dulux Premium White 20L', unit: '20L', unitPrice: 885.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'DLX-GLO-WHT', description: 'Dulux Gloss Enamel White 5L', unit: '5L', unitPrice: 425.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'DLX-VAR-CLR', description: 'Dulux Clear Varnish 5L', unit: '5L', unitPrice: 525.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'DLX-PVA-WHT', description: 'Dulux PVA White 20L', unit: '20L', unitPrice: 495.00, category: 'paint_finishes', isAvailable: true },
    ];
  }

  static getLeroyMerlinProducts(): ProductData[] {
    return [
      { productCode: 'LRM-PNT-INT', description: 'Interior Paint White 10L', unit: '10L', unitPrice: 385.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'LRM-PNT-EXT', description: 'Exterior Paint White 10L', unit: '10L', unitPrice: 485.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'LRM-TL-300', description: 'Ceramic Tile 300x300mm', unit: 'm2', unitPrice: 165.00, category: 'building_materials', isAvailable: true },
      { productCode: 'LRM-TL-600', description: 'Porcelain Tile 600x600mm', unit: 'm2', unitPrice: 365.00, category: 'building_materials', isAvailable: true },
      { productCode: 'LRM-LAM-AC3', description: 'Laminate Flooring AC3', unit: 'm2', unitPrice: 175.00, category: 'building_materials', isAvailable: true },
      { productCode: 'LRM-HDW-001', description: 'Power Tools Assorted', unit: 'each', unitPrice: 685.00, category: 'hardware', isAvailable: true },
      { productCode: 'LRM-GLO-WHT', description: 'Gloss Enamel White 5L', unit: '5L', unitPrice: 395.00, category: 'paint_finishes', isAvailable: true },
    ];
  }

  static getPlasconProducts(): ProductData[] {
    return [
      { productCode: 'PLS-INT-WHT', description: 'Plascon Interior White 20L', unit: '20L', unitPrice: 675.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'PLS-EXT-WHT', description: 'Plascon Exterior White 20L', unit: '20L', unitPrice: 775.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'PLS-INT-MAG', description: 'Plascon Interior Magnolia 20L', unit: '20L', unitPrice: 685.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'PLS-EXT-CRM', description: 'Plascon Exterior Cream 20L', unit: '20L', unitPrice: 785.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'PLS-PVA-WHT', description: 'Plascon PVA White 20L', unit: '20L', unitPrice: 495.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'PLS-GLO-WHT', description: 'Plascon Gloss Enamel White 5L', unit: '5L', unitPrice: 415.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'PLS-VAR-CLR', description: 'Plascon Clear Varnish 5L', unit: '5L', unitPrice: 515.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'PLS-UND-WHT', description: 'Plascon Undercoat White 5L', unit: '5L', unitPrice: 325.00, category: 'paint_finishes', isAvailable: true },
    ];
  }

  static getProminentPaintsProducts(): ProductData[] {
    return [
      { productCode: 'PRM-INT-WHT', description: 'Prominent Interior White 20L', unit: '20L', unitPrice: 665.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'PRM-EXT-WHT', description: 'Prominent Exterior White 20L', unit: '20L', unitPrice: 765.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'PRM-PVA-WHT', description: 'Prominent PVA White 20L', unit: '20L', unitPrice: 485.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'PRM-GLO-WHT', description: 'Prominent Gloss White 5L', unit: '5L', unitPrice: 405.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'PRM-VAR-CLR', description: 'Prominent Varnish 5L', unit: '5L', unitPrice: 505.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'PRM-UND-WHT', description: 'Prominent Undercoat 5L', unit: '5L', unitPrice: 315.00, category: 'paint_finishes', isAvailable: true },
    ];
  }

  // ============================================================================
  // PLUMBING PRODUCT CATALOGS
  // ============================================================================

  static getAVKProducts(): ProductData[] {
    return [
      { productCode: 'AVK-VLV-050', description: 'Gate Valve 50mm', unit: 'each', unitPrice: 685.00, category: 'plumbing', isAvailable: true },
      { productCode: 'AVK-VLV-080', description: 'Gate Valve 80mm', unit: 'each', unitPrice: 985.00, category: 'plumbing', isAvailable: true },
      { productCode: 'AVK-VLV-100', description: 'Gate Valve 100mm', unit: 'each', unitPrice: 1285.00, category: 'plumbing', isAvailable: true },
      { productCode: 'AVK-VLV-150', description: 'Gate Valve 150mm', unit: 'each', unitPrice: 2185.00, category: 'plumbing', isAvailable: true },
      { productCode: 'AVK-BUT-050', description: 'Butterfly Valve 50mm', unit: 'each', unitPrice: 485.00, category: 'plumbing', isAvailable: true },
      { productCode: 'AVK-BUT-080', description: 'Butterfly Valve 80mm', unit: 'each', unitPrice: 785.00, category: 'plumbing', isAvailable: true },
      { productCode: 'AVK-BUT-100', description: 'Butterfly Valve 100mm', unit: 'each', unitPrice: 985.00, category: 'plumbing', isAvailable: true },
      { productCode: 'AVK-CHK-050', description: 'Check Valve 50mm', unit: 'each', unitPrice: 385.00, category: 'plumbing', isAvailable: true },
    ];
  }

  static getGeberitProducts(): ProductData[] {
    return [
      { productCode: 'GEB-CIS-001', description: 'Geberit Concealed Cistern', unit: 'each', unitPrice: 2850.00, category: 'plumbing', isAvailable: true },
      { productCode: 'GEB-PAN-001', description: 'Geberit Wall-Hung Pan', unit: 'each', unitPrice: 3450.00, category: 'plumbing', isAvailable: true },
      { productCode: 'GEB-FRM-001', description: 'Geberit Frame System', unit: 'each', unitPrice: 4250.00, category: 'plumbing', isAvailable: true },
      { productCode: 'GEB-BTN-001', description: 'Geberit Flush Button Chrome', unit: 'each', unitPrice: 685.00, category: 'plumbing', isAvailable: true },
      { productCode: 'GEB-DRN-001', description: 'Geberit Shower Drain', unit: 'each', unitPrice: 1285.00, category: 'plumbing', isAvailable: true },
      { productCode: 'GEB-PIP-001', description: 'Geberit HDPE Pipe 110mm', unit: '3m length', unitPrice: 385.00, category: 'plumbing', isAvailable: true },
    ];
  }

  static getJojoTanksProducts(): ProductData[] {
    return [
      { productCode: 'JOJ-TNK-1000', description: 'Jojo Water Tank 1000L', unit: 'each', unitPrice: 2850.00, category: 'plumbing', isAvailable: true },
      { productCode: 'JOJ-TNK-2000', description: 'Jojo Water Tank 2000L', unit: 'each', unitPrice: 4250.00, category: 'plumbing', isAvailable: true },
      { productCode: 'JOJ-TNK-2500', description: 'Jojo Water Tank 2500L', unit: 'each', unitPrice: 4950.00, category: 'plumbing', isAvailable: true },
      { productCode: 'JOJ-TNK-5000', description: 'Jojo Water Tank 5000L', unit: 'each', unitPrice: 8850.00, category: 'plumbing', isAvailable: true },
      { productCode: 'JOJ-TNK-10000', description: 'Jojo Water Tank 10000L', unit: 'each', unitPrice: 16500.00, category: 'plumbing', isAvailable: true },
      { productCode: 'JOJ-SEP-2500', description: 'Jojo Septic Tank 2500L', unit: 'each', unitPrice: 6850.00, category: 'plumbing', isAvailable: true },
      { productCode: 'JOJ-SEP-5000', description: 'Jojo Septic Tank 5000L', unit: 'each', unitPrice: 11500.00, category: 'plumbing', isAvailable: true },
    ];
  }

  static getKSBProducts(): ProductData[] {
    return [
      { productCode: 'KSB-PMP-05', description: 'KSB Centrifugal Pump 0.5kW', unit: 'each', unitPrice: 3850.00, category: 'plumbing', isAvailable: true },
      { productCode: 'KSB-PMP-11', description: 'KSB Centrifugal Pump 1.1kW', unit: 'each', unitPrice: 5250.00, category: 'plumbing', isAvailable: true },
      { productCode: 'KSB-PMP-15', description: 'KSB Centrifugal Pump 1.5kW', unit: 'each', unitPrice: 6450.00, category: 'plumbing', isAvailable: true },
      { productCode: 'KSB-PMP-22', description: 'KSB Centrifugal Pump 2.2kW', unit: 'each', unitPrice: 8250.00, category: 'plumbing', isAvailable: true },
      { productCode: 'KSB-SBM-05', description: 'KSB Submersible Pump 0.5kW', unit: 'each', unitPrice: 4250.00, category: 'plumbing', isAvailable: true },
      { productCode: 'KSB-SBM-11', description: 'KSB Submersible Pump 1.1kW', unit: 'each', unitPrice: 5850.00, category: 'plumbing', isAvailable: true },
      { productCode: 'KSB-SBM-15', description: 'KSB Submersible Pump 1.5kW', unit: 'each', unitPrice: 7250.00, category: 'plumbing', isAvailable: true },
    ];
  }

  static getMarleyProducts(): ProductData[] {
    return [
      { productCode: 'MAR-PIP-110', description: 'Marley PVC Pipe 110mm', unit: '6m length', unitPrice: 295.00, category: 'plumbing', isAvailable: true },
      { productCode: 'MAR-PIP-160', description: 'Marley PVC Pipe 160mm', unit: '6m length', unitPrice: 495.00, category: 'plumbing', isAvailable: true },
      { productCode: 'MAR-ELB-110', description: 'Marley PVC Elbow 110mm 90°', unit: 'each', unitPrice: 48.00, category: 'plumbing', isAvailable: true },
      { productCode: 'MAR-TEE-110', description: 'Marley PVC Tee 110mm', unit: 'each', unitPrice: 68.00, category: 'plumbing', isAvailable: true },
      { productCode: 'MAR-GTR-150', description: 'Marley PVC Gutter 150mm', unit: 'linear meter', unitPrice: 92.00, category: 'plumbing', isAvailable: true },
      { productCode: 'MAR-DWN-080', description: 'Marley Downpipe 80mm', unit: '3m length', unitPrice: 145.00, category: 'plumbing', isAvailable: true },
      { productCode: 'MAR-JNT-110', description: 'Marley Coupler 110mm', unit: 'each', unitPrice: 35.00, category: 'plumbing', isAvailable: true },
    ];
  }
}
