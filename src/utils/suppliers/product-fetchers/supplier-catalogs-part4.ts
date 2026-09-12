/**
 * Comprehensive Product Catalogs - Part 4
 * Steel & Metal, Timber suppliers
 */

import { ProductData } from './base-fetcher';

export class SupplierCatalogsPart4 {
  // ============================================================================
  // STEEL & METAL PRODUCT CATALOGS
  // ============================================================================

  static getArcelorMittalProducts(): ProductData[] {
    return [
      { productCode: 'ARM-RB-Y8', description: 'ArcelorMittal Rebar Y8', unit: '6m length', unitPrice: 46.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'ARM-RB-Y10', description: 'ArcelorMittal Rebar Y10', unit: '6m length', unitPrice: 69.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'ARM-RB-Y12', description: 'ArcelorMittal Rebar Y12', unit: '6m length', unitPrice: 116.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'ARM-RB-Y16', description: 'ArcelorMittal Rebar Y16', unit: '6m length', unitPrice: 188.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'ARM-RB-Y20', description: 'ArcelorMittal Rebar Y20', unit: '6m length', unitPrice: 278.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'ARM-RB-Y25', description: 'ArcelorMittal Rebar Y25', unit: '6m length', unitPrice: 395.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'ARM-MSH-193', description: 'Steel Mesh 193', unit: '2.4x4.8m sheet', unitPrice: 188.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'ARM-MSH-283', description: 'Steel Mesh 283', unit: '2.4x4.8m sheet', unitPrice: 248.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'ARM-MSH-393', description: 'Steel Mesh 393', unit: '2.4x4.8m sheet', unitPrice: 325.00, category: 'steel_metal', isAvailable: true },
    ];
  }

  static getCapeGateProducts(): ProductData[] {
    return [
      { productCode: 'CPG-WR-2.5', description: 'Cape Gate Binding Wire 2.5mm', unit: 'kg', unitPrice: 28.50, category: 'steel_metal', isAvailable: true },
      { productCode: 'CPG-WR-3.0', description: 'Cape Gate Binding Wire 3.0mm', unit: 'kg', unitPrice: 29.50, category: 'steel_metal', isAvailable: true },
      { productCode: 'CPG-NL-75', description: 'Cape Gate Nails 75mm', unit: '5kg', unitPrice: 98.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'CPG-NL-100', description: 'Cape Gate Nails 100mm', unit: '5kg', unitPrice: 102.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'CPG-STL-BAR', description: 'Cape Gate Steel Bar Stock', unit: '6m length', unitPrice: 285.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'CPG-WR-MESH', description: 'Cape Gate Wire Mesh 50x50mm', unit: 'roll', unitPrice: 485.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'CPG-FENCE', description: 'Fence Wire 2.5mm', unit: 'kg', unitPrice: 32.00, category: 'steel_metal', isAvailable: true },
    ];
  }

  static getChamberlainProducts(): ProductData[] {
    return [
      { productCode: 'CHM-RB-Y8', description: 'Chamberlain Rebar Y8', unit: '6m length', unitPrice: 45.50, category: 'steel_metal', isAvailable: true },
      { productCode: 'CHM-RB-Y10', description: 'Chamberlain Rebar Y10', unit: '6m length', unitPrice: 68.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'CHM-RB-Y12', description: 'Chamberlain Rebar Y12', unit: '6m length', unitPrice: 114.50, category: 'steel_metal', isAvailable: true },
      { productCode: 'CHM-RB-Y16', description: 'Chamberlain Rebar Y16', unit: '6m length', unitPrice: 183.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'CHM-RB-Y20', description: 'Chamberlain Rebar Y20', unit: '6m length', unitPrice: 272.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'CHM-RB-Y25', description: 'Chamberlain Rebar Y25', unit: '6m length', unitPrice: 385.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'CHM-MSH-193', description: 'Chamberlain Mesh 193', unit: '2.4x4.8m sheet', unitPrice: 182.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'CHM-MSH-283', description: 'Chamberlain Mesh 283', unit: '2.4x4.8m sheet', unitPrice: 242.00, category: 'steel_metal', isAvailable: true },
    ];
  }

  static getJVRSteelProducts(): ProductData[] {
    return [
      { productCode: 'JVR-RB-Y8', description: 'JVR Rebar Y8', unit: '6m length', unitPrice: 44.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'JVR-RB-Y10', description: 'JVR Rebar Y10', unit: '6m length', unitPrice: 66.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'JVR-RB-Y12', description: 'JVR Rebar Y12', unit: '6m length', unitPrice: 112.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'JVR-RB-Y16', description: 'JVR Rebar Y16', unit: '6m length', unitPrice: 178.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'JVR-RB-Y20', description: 'JVR Rebar Y20', unit: '6m length', unitPrice: 265.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'JVR-RB-Y25', description: 'JVR Rebar Y25', unit: '6m length', unitPrice: 375.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'JVR-MSH-193', description: 'JVR Mesh 193', unit: '2.4x4.8m sheet', unitPrice: 177.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'JVR-MSH-283', description: 'JVR Mesh 283', unit: '2.4x4.8m sheet', unitPrice: 235.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'JVR-MSH-393', description: 'JVR Mesh 393', unit: '2.4x4.8m sheet', unitPrice: 305.00, category: 'steel_metal', isAvailable: true },
    ];
  }

  static getNJRSteelProducts(): ProductData[] {
    return [
      { productCode: 'NJR-RB-Y8', description: 'NJR Rebar Y8', unit: '6m length', unitPrice: 43.50, category: 'steel_metal', isAvailable: true },
      { productCode: 'NJR-RB-Y10', description: 'NJR Rebar Y10', unit: '6m length', unitPrice: 65.50, category: 'steel_metal', isAvailable: true },
      { productCode: 'NJR-RB-Y12', description: 'NJR Rebar Y12', unit: '6m length', unitPrice: 111.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'NJR-RB-Y16', description: 'NJR Rebar Y16', unit: '6m length', unitPrice: 176.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'NJR-RB-Y20', description: 'NJR Rebar Y20', unit: '6m length', unitPrice: 263.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'NJR-RB-Y25', description: 'NJR Rebar Y25', unit: '6m length', unitPrice: 378.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'NJR-MSH-193', description: 'NJR Mesh 193', unit: '2.4x4.8m sheet', unitPrice: 175.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'NJR-MSH-283', description: 'NJR Mesh 283', unit: '2.4x4.8m sheet', unitPrice: 233.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'NJR-MSH-393', description: 'NJR Mesh 393', unit: '2.4x4.8m sheet', unitPrice: 302.00, category: 'steel_metal', isAvailable: true },
    ];
  }

  // ============================================================================
  // TIMBER PRODUCT CATALOGS
  // ============================================================================

  static getSappiProducts(): ProductData[] {
    return [
      { productCode: 'SAP-LMB-38x114', description: 'Sappi Pine Lumber 38x114mm', unit: '3.6m length', unitPrice: 88.00, category: 'timber', isAvailable: true },
      { productCode: 'SAP-LMB-38x152', description: 'Sappi Pine Lumber 38x152mm', unit: '3.6m length', unitPrice: 118.00, category: 'timber', isAvailable: true },
      { productCode: 'SAP-LMB-38x228', description: 'Sappi Pine Lumber 38x228mm', unit: '3.6m length', unitPrice: 168.00, category: 'timber', isAvailable: true },
      { productCode: 'SAP-LMB-50x76', description: 'Sappi Pine Lumber 50x76mm', unit: '4.2m length', unitPrice: 105.00, category: 'timber', isAvailable: true },
      { productCode: 'SAP-PLY-6', description: 'Sappi Plywood 6mm', unit: '2440x1220mm sheet', unitPrice: 295.00, category: 'timber', isAvailable: true },
      { productCode: 'SAP-PLY-9', description: 'Sappi Plywood 9mm', unit: '2440x1220mm sheet', unitPrice: 395.00, category: 'timber', isAvailable: true },
      { productCode: 'SAP-PLY-12', description: 'Sappi Plywood 12mm', unit: '2440x1220mm sheet', unitPrice: 495.00, category: 'timber', isAvailable: true },
      { productCode: 'SAP-PLY-18', description: 'Sappi Plywood 18mm', unit: '2440x1220mm sheet', unitPrice: 685.00, category: 'timber', isAvailable: true },
    ];
  }

  static getTimberCityProducts(): ProductData[] {
    return [
      { productCode: 'TMC-SAP-38x114', description: 'Pine SAP 38x114mm', unit: '3.6m length', unitPrice: 90.00, category: 'timber', isAvailable: true },
      { productCode: 'TMC-SAP-38x152', description: 'Pine SAP 38x152mm', unit: '3.6m length', unitPrice: 120.00, category: 'timber', isAvailable: true },
      { productCode: 'TMC-SAP-38x228', description: 'Pine SAP 38x228mm', unit: '3.6m length', unitPrice: 170.00, category: 'timber', isAvailable: true },
      { productCode: 'TMC-SAP-50x76', description: 'Pine SAP 50x76mm', unit: '4.2m length', unitPrice: 108.00, category: 'timber', isAvailable: true },
      { productCode: 'TMC-PAR-38x38', description: 'Pine PAR 38x38mm', unit: '3.0m length', unitPrice: 48.00, category: 'timber', isAvailable: true },
      { productCode: 'TMC-PAR-38x76', description: 'Pine PAR 38x76mm', unit: '3.0m length', unitPrice: 82.00, category: 'timber', isAvailable: true },
      { productCode: 'TMC-PLY-6', description: 'Plywood 6mm', unit: '2440x1220mm sheet', unitPrice: 298.00, category: 'timber', isAvailable: true },
      { productCode: 'TMC-PLY-9', description: 'Plywood 9mm', unit: '2440x1220mm sheet', unitPrice: 398.00, category: 'timber', isAvailable: true },
      { productCode: 'TMC-PLY-12', description: 'Plywood 12mm', unit: '2440x1220mm sheet', unitPrice: 498.00, category: 'timber', isAvailable: true },
      { productCode: 'TMC-PLY-18', description: 'Plywood 18mm', unit: '2440x1220mm sheet', unitPrice: 698.00, category: 'timber', isAvailable: true },
    ];
  }
}
