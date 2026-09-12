/**
 * Comprehensive Product Catalogs - Part 2
 * Concrete, Electrical, Hardware, Paint, Plumbing, Steel, Timber suppliers
 */

import { ProductData } from './base-fetcher';

export class SupplierCatalogsPart2 {
  // ============================================================================
  // CONCRETE & AGGREGATES PRODUCT CATALOGS
  // ============================================================================

  static getAfrisamProducts(): ProductData[] {
    return [
      { productCode: 'AFR-CEM-42.5', description: 'AfriSam Cement 42.5N', unit: '50kg bag', unitPrice: 94.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'AFR-CEM-32.5', description: 'AfriSam Cement 32.5N', unit: '50kg bag', unitPrice: 86.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'AFR-CEM-52.5', description: 'AfriSam Cement 52.5N', unit: '50kg bag', unitPrice: 105.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'AFR-CON-15', description: 'AfriSam Ready-Mix 15MPa', unit: 'm3', unitPrice: 985.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'AFR-CON-20', description: 'AfriSam Ready-Mix 20MPa', unit: 'm3', unitPrice: 1085.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'AFR-CON-25', description: 'AfriSam Ready-Mix 25MPa', unit: 'm3', unitPrice: 1185.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'AFR-CON-30', description: 'AfriSam Ready-Mix 30MPa', unit: 'm3', unitPrice: 1285.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'AFR-AGG-13', description: 'AfriSam Stone 13mm', unit: 'm3', unitPrice: 395.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'AFR-AGG-19', description: 'AfriSam Stone 19mm', unit: 'm3', unitPrice: 405.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'AFR-SND-001', description: 'AfriSam Concrete Sand', unit: 'm3', unitPrice: 295.00, category: 'concrete_aggregates', isAvailable: true },
    ];
  }

  static getInfrasetProducts(): ProductData[] {
    return [
      { productCode: 'INF-PAV-200', description: 'Concrete Paver 200x100x60mm', unit: 'm2', unitPrice: 295.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'INF-PAV-INT', description: 'Interlock Paver', unit: 'm2', unitPrice: 325.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'INF-KRB-STD', description: 'Standard Kerb', unit: 'linear meter', unitPrice: 185.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'INF-KRB-TRF', description: 'Traffic Kerb', unit: 'linear meter', unitPrice: 205.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'INF-BLK-001', description: 'Hollow Block 390x140x190mm', unit: '100 blocks', unitPrice: 875.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'INF-MHL-900', description: 'Manhole Cover 900mm', unit: 'each', unitPrice: 1850.00, category: 'concrete_aggregates', isAvailable: true },
    ];
  }

  static getLafargeProducts(): ProductData[] {
    return [
      { productCode: 'LAF-CEM-42.5', description: 'Lafarge Cement 42.5N', unit: '50kg bag', unitPrice: 95.50, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'LAF-CEM-32.5', description: 'Lafarge Cement 32.5N', unit: '50kg bag', unitPrice: 87.50, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'LAF-CEM-52.5', description: 'Lafarge Cement 52.5N', unit: '50kg bag', unitPrice: 106.50, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'LAF-PLS-001', description: 'Lafarge Plaster Cement', unit: '40kg bag', unitPrice: 82.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'LAF-CON-20', description: 'Lafarge Ready-Mix 20MPa', unit: 'm3', unitPrice: 1095.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'LAF-CON-25', description: 'Lafarge Ready-Mix 25MPa', unit: 'm3', unitPrice: 1195.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'LAF-CON-30', description: 'Lafarge Ready-Mix 30MPa', unit: 'm3', unitPrice: 1295.00, category: 'concrete_aggregates', isAvailable: true },
    ];
  }

  static getNPCCimporProducts(): ProductData[] {
    return [
      { productCode: 'NPC-CEM-42.5', description: 'NPC-Cimpor Cement 42.5N', unit: '50kg bag', unitPrice: 93.50, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'NPC-CEM-32.5', description: 'NPC-Cimpor Cement 32.5N', unit: '50kg bag', unitPrice: 85.50, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'NPC-CEM-52.5', description: 'NPC-Cimpor Cement 52.5N', unit: '50kg bag', unitPrice: 104.50, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'NPC-PLS-001', description: 'NPC Plaster Cement', unit: '40kg bag', unitPrice: 80.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'NPC-CON-20', description: 'NPC Ready-Mix 20MPa', unit: 'm3', unitPrice: 1075.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'NPC-CON-30', description: 'NPC Ready-Mix 30MPa', unit: 'm3', unitPrice: 1275.00, category: 'concrete_aggregates', isAvailable: true },
    ];
  }

  static getPPCProducts(): ProductData[] {
    return [
      { productCode: 'PPC-CEM-42.5', description: 'PPC Cement 42.5N (SUREBUILD)', unit: '50kg bag', unitPrice: 96.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'PPC-CEM-32.5', description: 'PPC Cement 32.5N', unit: '50kg bag', unitPrice: 88.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'PPC-CEM-52.5', description: 'PPC Cement 52.5N', unit: '50kg bag', unitPrice: 107.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'PPC-PLS-001', description: 'PPC Plaster Cement (SUREWALL)', unit: '40kg bag', unitPrice: 83.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'PPC-CON-15', description: 'PPC Ready-Mix 15MPa', unit: 'm3', unitPrice: 995.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'PPC-CON-20', description: 'PPC Ready-Mix 20MPa', unit: 'm3', unitPrice: 1095.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'PPC-CON-25', description: 'PPC Ready-Mix 25MPa', unit: 'm3', unitPrice: 1195.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'PPC-CON-30', description: 'PPC Ready-Mix 30MPa', unit: 'm3', unitPrice: 1295.00, category: 'concrete_aggregates', isAvailable: true },
    ];
  }

  static getSephakuProducts(): ProductData[] {
    return [
      { productCode: 'SEP-CEM-42.5', description: 'Sephaku Cement 42.5N', unit: '50kg bag', unitPrice: 92.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'SEP-CEM-32.5', description: 'Sephaku Cement 32.5N', unit: '50kg bag', unitPrice: 84.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'SEP-CEM-52.5', description: 'Sephaku Cement 52.5N', unit: '50kg bag', unitPrice: 103.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'SEP-PLS-001', description: 'Sephaku Plaster Cement', unit: '40kg bag', unitPrice: 78.00, category: 'concrete_aggregates', isAvailable: true },
    ];
  }

  static getStewardsLlodsProducts(): ProductData[] {
    return [
      { productCode: 'SL-PIP-21.3', description: 'Steel Pipe 21.3mm (½")', unit: '6m length', unitPrice: 185.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'SL-PIP-26.9', description: 'Steel Pipe 26.9mm (¾")', unit: '6m length', unitPrice: 225.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'SL-PIP-33.7', description: 'Steel Pipe 33.7mm (1")', unit: '6m length', unitPrice: 285.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'SL-PIP-48.3', description: 'Steel Pipe 48.3mm (1½")', unit: '6m length', unitPrice: 425.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'SL-PIP-60.3', description: 'Steel Pipe 60.3mm (2")', unit: '6m length', unitPrice: 565.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'SL-TUB-50', description: 'Square Tube 50x50x3mm', unit: '6m length', unitPrice: 385.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'SL-TUB-76', description: 'Square Tube 76x76x3mm', unit: '6m length', unitPrice: 625.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'SL-ANG-50', description: 'Angle Iron 50x50x5mm', unit: '6m length', unitPrice: 295.00, category: 'steel_metal', isAvailable: true },
    ];
  }

  static getTechnicreteProducts(): ProductData[] {
    return [
      { productCode: 'TCR-PAV-200', description: 'Technicrete Paver 200x100x60mm', unit: 'm2', unitPrice: 305.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'TCR-PAV-INT', description: 'Technicrete Interlock Paver', unit: 'm2', unitPrice: 335.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'TCR-WALL-STD', description: 'Retaining Wall Block', unit: 'each', unitPrice: 45.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'TCR-WALL-KEV', description: 'Keystone Wall Block', unit: 'each', unitPrice: 52.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'TCR-KRB-STD', description: 'Standard Kerb Stone', unit: 'linear meter', unitPrice: 195.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'TCR-STP-001', description: 'Concrete Step', unit: 'each', unitPrice: 285.00, category: 'concrete_aggregates', isAvailable: true },
    ];
  }

  // ============================================================================
  // ELECTRICAL PRODUCT CATALOGS
  // ============================================================================

  static getABBProducts(): ProductData[] {
    return [
      { productCode: 'ABB-MCB-10A', description: 'ABB MCB Single Pole 10A', unit: 'each', unitPrice: 85.00, category: 'electrical', isAvailable: true },
      { productCode: 'ABB-MCB-16A', description: 'ABB MCB Single Pole 16A', unit: 'each', unitPrice: 87.00, category: 'electrical', isAvailable: true },
      { productCode: 'ABB-MCB-20A', description: 'ABB MCB Single Pole 20A', unit: 'each', unitPrice: 89.00, category: 'electrical', isAvailable: true },
      { productCode: 'ABB-MCB-32A', description: 'ABB MCB Single Pole 32A', unit: 'each', unitPrice: 95.00, category: 'electrical', isAvailable: true },
      { productCode: 'ABB-RCD-25A', description: 'ABB RCD 2-Pole 25A 30mA', unit: 'each', unitPrice: 385.00, category: 'electrical', isAvailable: true },
      { productCode: 'ABB-RCD-40A', description: 'ABB RCD 2-Pole 40A 30mA', unit: 'each', unitPrice: 425.00, category: 'electrical', isAvailable: true },
      { productCode: 'ABB-DB-4W', description: 'ABB Distribution Board 4-Way', unit: 'each', unitPrice: 285.00, category: 'electrical', isAvailable: true },
      { productCode: 'ABB-DB-8W', description: 'ABB Distribution Board 8-Way', unit: 'each', unitPrice: 385.00, category: 'electrical', isAvailable: true },
      { productCode: 'ABB-DB-12W', description: 'ABB Distribution Board 12-Way', unit: 'each', unitPrice: 485.00, category: 'electrical', isAvailable: true },
      { productCode: 'ABB-CNT-25A', description: 'ABB Contactor 25A', unit: 'each', unitPrice: 685.00, category: 'electrical', isAvailable: true },
    ];
  }

  static getActomProducts(): ProductData[] {
    return [
      { productCode: 'ACT-MTR-075', description: 'Electric Motor 0.75kW', unit: 'each', unitPrice: 1850.00, category: 'electrical', isAvailable: true },
      { productCode: 'ACT-MTR-110', description: 'Electric Motor 1.1kW', unit: 'each', unitPrice: 2150.00, category: 'electrical', isAvailable: true },
      { productCode: 'ACT-MTR-150', description: 'Electric Motor 1.5kW', unit: 'each', unitPrice: 2450.00, category: 'electrical', isAvailable: true },
      { productCode: 'ACT-MTR-220', description: 'Electric Motor 2.2kW', unit: 'each', unitPrice: 2950.00, category: 'electrical', isAvailable: true },
      { productCode: 'ACT-MTR-300', description: 'Electric Motor 3.0kW', unit: 'each', unitPrice: 3450.00, category: 'electrical', isAvailable: true },
      { productCode: 'ACT-TRF-1K', description: 'Transformer 1kVA', unit: 'each', unitPrice: 1450.00, category: 'electrical', isAvailable: true },
      { productCode: 'ACT-TRF-2K', description: 'Transformer 2kVA', unit: 'each', unitPrice: 2150.00, category: 'electrical', isAvailable: true },
    ];
  }

  static getARBProducts(): ProductData[] {
    return [
      { productCode: 'ARB-CAB-2.5', description: 'Electrical Cable 2.5mm²', unit: 'meter', unitPrice: 19.50, category: 'electrical', isAvailable: true },
      { productCode: 'ARB-CAB-4.0', description: 'Electrical Cable 4mm²', unit: 'meter', unitPrice: 29.50, category: 'electrical', isAvailable: true },
      { productCode: 'ARB-CAB-6.0', description: 'Electrical Cable 6mm²', unit: 'meter', unitPrice: 39.50, category: 'electrical', isAvailable: true },
      { productCode: 'ARB-CAB-10', description: 'Electrical Cable 10mm²', unit: 'meter', unitPrice: 59.50, category: 'electrical', isAvailable: true },
      { productCode: 'ARB-CON-20', description: 'PVC Conduit 20mm', unit: '3m length', unitPrice: 38.00, category: 'electrical', isAvailable: true },
      { productCode: 'ARB-CON-25', description: 'PVC Conduit 25mm', unit: '3m length', unitPrice: 48.00, category: 'electrical', isAvailable: true },
      { productCode: 'ARB-BOX-1G', description: 'Junction Box 1-Gang', unit: 'each', unitPrice: 18.00, category: 'electrical', isAvailable: true },
      { productCode: 'ARB-BOX-2G', description: 'Junction Box 2-Gang', unit: 'each', unitPrice: 24.00, category: 'electrical', isAvailable: true },
    ];
  }

  static getPowerEquipmentProducts(): ProductData[] {
    return [
      { productCode: 'PWR-GEN-2K', description: 'Generator 2kVA', unit: 'each', unitPrice: 4850.00, category: 'electrical', isAvailable: true },
      { productCode: 'PWR-GEN-3K', description: 'Generator 3kVA', unit: 'each', unitPrice: 6850.00, category: 'electrical', isAvailable: true },
      { productCode: 'PWR-GEN-5K', description: 'Generator 5kVA', unit: 'each', unitPrice: 9850.00, category: 'electrical', isAvailable: true },
      { productCode: 'PWR-WLD-160', description: 'Welding Machine 160A', unit: 'each', unitPrice: 2850.00, category: 'electrical', isAvailable: true },
      { productCode: 'PWR-WLD-200', description: 'Welding Machine 200A', unit: 'each', unitPrice: 3450.00, category: 'electrical', isAvailable: true },
      { productCode: 'PWR-CMP-50L', description: 'Air Compressor 50L', unit: 'each', unitPrice: 3850.00, category: 'electrical', isAvailable: true },
      { productCode: 'PWR-CMP-100L', description: 'Air Compressor 100L', unit: 'each', unitPrice: 5850.00, category: 'electrical', isAvailable: true },
    ];
  }

  static getSchneiderProducts(): ProductData[] {
    return [
      { productCode: 'SCH-MCB-10A', description: 'Schneider MCB 10A C-Curve', unit: 'each', unitPrice: 92.00, category: 'electrical', isAvailable: true },
      { productCode: 'SCH-MCB-16A', description: 'Schneider MCB 16A C-Curve', unit: 'each', unitPrice: 94.00, category: 'electrical', isAvailable: true },
      { productCode: 'SCH-MCB-20A', description: 'Schneider MCB 20A C-Curve', unit: 'each', unitPrice: 96.00, category: 'electrical', isAvailable: true },
      { productCode: 'SCH-MCB-32A', description: 'Schneider MCB 32A C-Curve', unit: 'each', unitPrice: 102.00, category: 'electrical', isAvailable: true },
      { productCode: 'SCH-RCD-25A', description: 'Schneider RCD 2P 25A 30mA', unit: 'each', unitPrice: 425.00, category: 'electrical', isAvailable: true },
      { productCode: 'SCH-RCD-40A', description: 'Schneider RCD 2P 40A 30mA', unit: 'each', unitPrice: 465.00, category: 'electrical', isAvailable: true },
      { productCode: 'SCH-CNT-16A', description: 'Schneider Contactor 16A', unit: 'each', unitPrice: 585.00, category: 'electrical', isAvailable: true },
      { productCode: 'SCH-CNT-25A', description: 'Schneider Contactor 25A', unit: 'each', unitPrice: 725.00, category: 'electrical', isAvailable: true },
    ];
  }

  static getVoltexProducts(): ProductData[] {
    return [
      { productCode: 'VLT-CAB-2.5', description: 'Single Core Cable 2.5mm²', unit: 'meter', unitPrice: 18.00, category: 'electrical', isAvailable: true },
      { productCode: 'VLT-CAB-4.0', description: 'Single Core Cable 4mm²', unit: 'meter', unitPrice: 28.00, category: 'electrical', isAvailable: true },
      { productCode: 'VLT-CAB-6.0', description: 'Single Core Cable 6mm²', unit: 'meter', unitPrice: 38.00, category: 'electrical', isAvailable: true },
      { productCode: 'VLT-CAB-10', description: 'Single Core Cable 10mm²', unit: 'meter', unitPrice: 58.00, category: 'electrical', isAvailable: true },
      { productCode: 'VLT-MCB-10A', description: 'MCB 10A', unit: 'each', unitPrice: 78.00, category: 'electrical', isAvailable: true },
      { productCode: 'VLT-MCB-16A', description: 'MCB 16A', unit: 'each', unitPrice: 80.00, category: 'electrical', isAvailable: true },
      { productCode: 'VLT-MCB-20A', description: 'MCB 20A', unit: 'each', unitPrice: 82.00, category: 'electrical', isAvailable: true },
      { productCode: 'VLT-CON-20', description: 'PVC Conduit 20mm', unit: '3m length', unitPrice: 35.00, category: 'electrical', isAvailable: true },
      { productCode: 'VLT-CON-25', description: 'PVC Conduit 25mm', unit: '3m length', unitPrice: 45.00, category: 'electrical', isAvailable: true },
      { productCode: 'VLT-LGT-LED9', description: 'LED Bulb 9W', unit: 'each', unitPrice: 65.00, category: 'electrical', isAvailable: true },
    ];
  }

  // CONTINUE WITH HARDWARE, PAINT, PLUMBING, STEEL, TIMBER...
}
