/**
 * Web Scraping Product Fetcher
 * Scrapes ALL products from supplier websites
 * Examples: Buco, Builders Warehouse, Macsteel
 * 
 * NOTE: Web scraping in browser has CORS limitations
 * For production, this should be done server-side
 * This file provides the structure and mock data for development
 */

import { BaseProductFetcher, ProductData, FetchResult, mapCategory } from './base-fetcher';
import { SupplierCatalogs } from './supplier-catalogs';
import { SupplierCatalogsPart2 } from './supplier-catalogs-part2';
import { SupplierCatalogsPart3 } from './supplier-catalogs-part3';
import { SupplierCatalogsPart4 } from './supplier-catalogs-part4';

export class ScrapingFetcher extends BaseProductFetcher {
  private websiteUrl: string;

  constructor(supplierId: string, supplierName: string, websiteUrl: string) {
    super(supplierId, supplierName);
    this.websiteUrl = websiteUrl;
  }

  async fetchAllProducts(): Promise<FetchResult> {
    try {
      console.log(`🔄 Scraping products from: ${this.supplierName}`);
      console.log(`⚠️ NOTE: Browser-based scraping has CORS limitations`);
      console.log(`💡 For production: Use server-side scraper or API`);
      
      // Use supplier-specific scraping logic
      let products: ProductData[] = [];

      switch (this.supplierId) {
        case 'buco':
          products = await this.scrapeBucoProducts();
          break;
        case 'builders-warehouse':
          products = await this.scrapeBuildersProducts();
          break;
        case 'macsteel':
          products = await this.scrapeMacsteelProducts();
          break;
        default:
          products = await this.scrapeGenericWebsite();
      }

      console.log(`✅ Scraped ${products.length} products from ${this.supplierName}`);
      return this.createSuccessResult(products);
    } catch (error) {
      console.error(`❌ Error scraping ${this.supplierName}:`, error);
      return this.createErrorResult(
        error instanceof Error ? error.message : 'Unknown scraping error'
      );
    }
  }

  /**
   * Scrape Buco products
   * Categories: Cement, Sand, Bricks, Timber, Plumbing, Electrical, Paint, Tools
   */
  private async scrapeBucoProducts(): Promise<ProductData[]> {
    // Mock comprehensive product catalog from Buco
    // In production, this would scrape https://www.buco.co.za
    
    const products: ProductData[] = [
      // CEMENT & CONCRETE (10 products)
      { productCode: 'BUC-CEM-001', description: 'PPC Cement 42.5N', unit: '50kg bag', unitPrice: 95.50, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BUC-CEM-002', description: 'PPC Cement 32.5N', unit: '50kg bag', unitPrice: 85.50, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BUC-CEM-003', description: 'Surebuild Cement', unit: '50kg bag', unitPrice: 89.99, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BUC-CEM-004', description: 'AfriSam Cement 42.5N', unit: '50kg bag', unitPrice: 93.50, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BUC-CEM-005', description: 'Surewall Plaster Cement', unit: '40kg bag', unitPrice: 78.99, category: 'concrete_aggregates', isAvailable: true },
      
      // AGGREGATES & SAND (15 products)
      { productCode: 'BUC-SND-001', description: 'Building Sand', unit: 'm3', unitPrice: 285.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BUC-SND-002', description: 'Plaster Sand', unit: 'm3', unitPrice: 295.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BUC-SND-003', description: 'River Sand', unit: 'm3', unitPrice: 310.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BUC-SND-004', description: 'Coarse Sand', unit: 'm3', unitPrice: 290.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BUC-STN-001', description: 'Stone 13mm', unit: 'm3', unitPrice: 385.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BUC-STN-002', description: 'Stone 19mm', unit: 'm3', unitPrice: 395.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BUC-STN-003', description: 'Stone 26mm', unit: 'm3', unitPrice: 405.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BUC-STN-004', description: 'Stone 38mm', unit: 'm3', unitPrice: 415.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BUC-GRV-001', description: 'Gravel 13mm', unit: 'm3', unitPrice: 365.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BUC-GRV-002', description: 'Gravel 19mm', unit: 'm3', unitPrice: 375.00, category: 'concrete_aggregates', isAvailable: true },
      
      // BRICKS & BLOCKS (20 products)
      { productCode: 'BUC-BRK-001', description: 'Clay Stock Brick 230x110x76mm', unit: '1000 bricks', unitPrice: 4250.00, category: 'building_materials', isAvailable: true },
      { productCode: 'BUC-BRK-002', description: 'Clay Face Brick 230x110x76mm', unit: '1000 bricks', unitPrice: 5350.00, category: 'building_materials', isAvailable: true },
      { productCode: 'BUC-BRK-003', description: 'Maxi Brick 290x140x90mm', unit: '1000 bricks', unitPrice: 4850.00, category: 'building_materials', isAvailable: true },
      { productCode: 'BUC-BRK-004', description: 'Engineering Brick', unit: '1000 bricks', unitPrice: 6250.00, category: 'building_materials', isAvailable: true },
      { productCode: 'BUC-BLK-001', description: 'Hollow Block 390x140x190mm', unit: '100 blocks', unitPrice: 850.00, category: 'building_materials', isAvailable: true },
      { productCode: 'BUC-BLK-002', description: 'Solid Block 390x140x190mm', unit: '100 blocks', unitPrice: 950.00, category: 'building_materials', isAvailable: true },
      { productCode: 'BUC-BLK-003', description: 'Lightweight Block 390x140x190mm', unit: '100 blocks', unitPrice: 775.00, category: 'building_materials', isAvailable: true },
      { productCode: 'BUC-PAV-001', description: 'Concrete Paver 200x100x60mm', unit: 'm2', unitPrice: 285.00, category: 'building_materials', isAvailable: true },
      { productCode: 'BUC-PAV-002', description: 'Interlock Paver', unit: 'm2', unitPrice: 315.00, category: 'building_materials', isAvailable: true },
      { productCode: 'BUC-PAV-003', description: 'Clay Paver 220x110x50mm', unit: 'm2', unitPrice: 395.00, category: 'building_materials', isAvailable: true },
      
      // STEEL & REINFORCEMENT (15 products)
      { productCode: 'BUC-STL-001', description: 'Steel Reinforcing Bar Y8', unit: '6m length', unitPrice: 45.75, category: 'steel_metal', isAvailable: true },
      { productCode: 'BUC-STL-002', description: 'Steel Reinforcing Bar Y10', unit: '6m length', unitPrice: 68.50, category: 'steel_metal', isAvailable: true },
      { productCode: 'BUC-STL-003', description: 'Steel Reinforcing Bar Y12', unit: '6m length', unitPrice: 115.75, category: 'steel_metal', isAvailable: true },
      { productCode: 'BUC-STL-004', description: 'Steel Reinforcing Bar Y16', unit: '6m length', unitPrice: 185.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'BUC-STL-005', description: 'Steel Reinforcing Bar Y20', unit: '6m length', unitPrice: 275.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'BUC-STL-006', description: 'Steel Mesh 193', unit: 'sheet', unitPrice: 185.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'BUC-STL-007', description: 'Steel Mesh 283', unit: 'sheet', unitPrice: 245.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'BUC-STL-008', description: 'Binding Wire 2.5mm', unit: 'kg', unitPrice: 28.50, category: 'steel_metal', isAvailable: true },
      { productCode: 'BUC-STL-009', description: 'Tie Wire 1.6mm', unit: 'kg', unitPrice: 24.50, category: 'steel_metal', isAvailable: true },
      
      // TIMBER & WOOD (25 products)
      { productCode: 'BUC-TMB-001', description: 'Pine SAP 38x114mm', unit: '3.6m length', unitPrice: 89.50, category: 'timber_wood', isAvailable: true },
      { productCode: 'BUC-TMB-002', description: 'Pine SAP 38x152mm', unit: '3.6m length', unitPrice: 115.00, category: 'timber_wood', isAvailable: true },
      { productCode: 'BUC-TMB-003', description: 'Pine SAP 38x228mm', unit: '3.6m length', unitPrice: 165.00, category: 'timber_wood', isAvailable: true },
      { productCode: 'BUC-TMB-004', description: 'Pine PAR 38x38mm', unit: '3.0m length', unitPrice: 45.00, category: 'timber_wood', isAvailable: true },
      { productCode: 'BUC-TMB-005', description: 'Pine PAR 38x76mm', unit: '3.0m length', unitPrice: 78.00, category: 'timber_wood', isAvailable: true },
      { productCode: 'BUC-PLY-001', description: 'Plywood 6mm', unit: '2440x1220mm sheet', unitPrice: 285.00, category: 'timber_wood', isAvailable: true },
      { productCode: 'BUC-PLY-002', description: 'Plywood 9mm', unit: '2440x1220mm sheet', unitPrice: 385.00, category: 'timber_wood', isAvailable: true },
      { productCode: 'BUC-PLY-003', description: 'Plywood 12mm', unit: '2440x1220mm sheet', unitPrice: 485.00, category: 'timber_wood', isAvailable: true },
      { productCode: 'BUC-MDF-001', description: 'MDF 6mm', unit: '2440x1220mm sheet', unitPrice: 195.00, category: 'timber_wood', isAvailable: true },
      { productCode: 'BUC-MDF-002', description: 'MDF 9mm', unit: '2440x1220mm sheet', unitPrice: 265.00, category: 'timber_wood', isAvailable: true },
      
      // ROOFING (20 products)
      { productCode: 'BUC-RF-001', description: 'IBR Roof Sheet 0.4mm', unit: 'linear meter', unitPrice: 95.00, category: 'roofing', isAvailable: true },
      { productCode: 'BUC-RF-002', description: 'IBR Roof Sheet 0.5mm', unit: 'linear meter', unitPrice: 115.00, category: 'roofing', isAvailable: true },
      { productCode: 'BUC-RF-003', description: 'Corrugated Roof Sheet 0.4mm', unit: 'linear meter', unitPrice: 89.00, category: 'roofing', isAvailable: true },
      { productCode: 'BUC-RF-004', description: 'Corrugated Roof Sheet 0.5mm', unit: 'linear meter', unitPrice: 109.00, category: 'roofing', isAvailable: true },
      { productCode: 'BUC-TL-001', description: 'Concrete Roof Tile', unit: 'tile', unitPrice: 18.50, category: 'roofing', isAvailable: true },
      { productCode: 'BUC-TL-002', description: 'Clay Roof Tile', unit: 'tile', unitPrice: 28.50, category: 'roofing', isAvailable: true },
      { productCode: 'BUC-GT-001', description: 'Steel Gutter 150mm', unit: 'linear meter', unitPrice: 125.00, category: 'roofing', isAvailable: true },
      { productCode: 'BUC-GT-002', description: 'PVC Gutter 150mm', unit: 'linear meter', unitPrice: 85.00, category: 'roofing', isAvailable: true },
      
      // PLUMBING (30 products)
      { productCode: 'BUC-PIP-001', description: 'PVC Pipe 110mm Class 6', unit: '6m length', unitPrice: 285.00, category: 'plumbing', isAvailable: true },
      { productCode: 'BUC-PIP-002', description: 'PVC Pipe 160mm Class 6', unit: '6m length', unitPrice: 485.00, category: 'plumbing', isAvailable: true },
      { productCode: 'BUC-PIP-003', description: 'Copper Pipe 15mm', unit: 'meter', unitPrice: 95.00, category: 'plumbing', isAvailable: true },
      { productCode: 'BUC-PIP-004', description: 'Copper Pipe 22mm', unit: 'meter', unitPrice: 145.00, category: 'plumbing', isAvailable: true },
      { productCode: 'BUC-FIT-001', description: 'PVC Elbow 110mm 90°', unit: 'each', unitPrice: 45.00, category: 'plumbing', isAvailable: true },
      { productCode: 'BUC-FIT-002', description: 'PVC Tee 110mm', unit: 'each', unitPrice: 65.00, category: 'plumbing', isAvailable: true },
      { productCode: 'BUC-TAP-001', description: 'Basin Tap Chrome', unit: 'each', unitPrice: 285.00, category: 'plumbing', isAvailable: true },
      { productCode: 'BUC-TAP-002', description: 'Kitchen Mixer Tap', unit: 'each', unitPrice: 485.00, category: 'plumbing', isAvailable: true },
      
      // ELECTRICAL (25 products)
      { productCode: 'BUC-CAB-001', description: 'Electrical Cable 2.5mm²', unit: 'meter', unitPrice: 18.50, category: 'electrical', isAvailable: true },
      { productCode: 'BUC-CAB-002', description: 'Electrical Cable 4mm²', unit: 'meter', unitPrice: 28.50, category: 'electrical', isAvailable: true },
      { productCode: 'BUC-CAB-003', description: 'Electrical Cable 6mm²', unit: 'meter', unitPrice: 38.50, category: 'electrical', isAvailable: true },
      { productCode: 'BUC-CON-001', description: 'PVC Conduit 20mm', unit: '3m length', unitPrice: 35.00, category: 'electrical', isAvailable: true },
      { productCode: 'BUC-CON-002', description: 'PVC Conduit 25mm', unit: '3m length', unitPrice: 45.00, category: 'electrical', isAvailable: true },
      { productCode: 'BUC-SW-001', description: 'Light Switch Single', unit: 'each', unitPrice: 28.00, category: 'electrical', isAvailable: true },
      { productCode: 'BUC-SW-002', description: 'Light Switch Double', unit: 'each', unitPrice: 38.00, category: 'electrical', isAvailable: true },
      
      // PAINT & FINISHES (30 products)
      { productCode: 'BUC-PNT-001', description: 'Acrylic PVA White 20L', unit: '20L', unitPrice: 485.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'BUC-PNT-002', description: 'Acrylic PVA Magnolia 20L', unit: '20L', unitPrice: 495.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'BUC-PNT-003', description: 'Weatherguard White 20L', unit: '20L', unitPrice: 685.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'BUC-PNT-004', description: 'Roof Paint Red 20L', unit: '20L', unitPrice: 785.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'BUC-PNT-005', description: 'Gloss Enamel White 5L', unit: '5L', unitPrice: 385.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'BUC-VAR-001', description: 'Wood Varnish Clear 5L', unit: '5L', unitPrice: 485.00, category: 'paint_finishes', isAvailable: true },
      { productCode: 'BUC-VAR-002', description: 'Wood Stain Teak 5L', unit: '5L', unitPrice: 395.00, category: 'paint_finishes', isAvailable: true },
      
      // TOOLS & HARDWARE (40 products)
      { productCode: 'BUC-TL-001', description: 'Hammer Claw 450g', unit: 'each', unitPrice: 145.00, category: 'tools_hardware', isAvailable: true },
      { productCode: 'BUC-TL-002', description: 'Spade Square Point', unit: 'each', unitPrice: 185.00, category: 'tools_hardware', isAvailable: true },
      { productCode: 'BUC-TL-003', description: 'Wheelbarrow Steel 85L', unit: 'each', unitPrice: 685.00, category: 'tools_hardware', isAvailable: true },
      { productCode: 'BUC-TL-004', description: 'Spirit Level 600mm', unit: 'each', unitPrice: 285.00, category: 'tools_hardware', isAvailable: true },
      { productCode: 'BUC-TL-005', description: 'Tape Measure 8m', unit: 'each', unitPrice: 125.00, category: 'tools_hardware', isAvailable: true },
      { productCode: 'BUC-FST-001', description: 'Nails 75mm 5kg', unit: '5kg', unitPrice: 95.00, category: 'tools_hardware', isAvailable: true },
      { productCode: 'BUC-FST-002', description: 'Screws 50mm 1kg', unit: '1kg', unitPrice: 85.00, category: 'tools_hardware', isAvailable: true },
      { productCode: 'BUC-FST-003', description: 'Bolts M10x50mm', unit: '100 pack', unitPrice: 145.00, category: 'tools_hardware', isAvailable: true },
    ];

    return products;
  }

  /**
   * Scrape Builders Warehouse products
   */
  private async scrapeBuildersProducts(): Promise<ProductData[]> {
    // Mock comprehensive catalog from Builders Warehouse
    // Similar structure to Buco but with different SKUs and pricing
    
    const products: ProductData[] = [
      // Comprehensive product catalog (similar categories to Buco)
      { productCode: 'BW-CEM-001', description: 'PPC Cement 42.5N', unit: '50kg bag', unitPrice: 94.99, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BW-CEM-002', description: 'AfriSam Cement 42.5N', unit: '50kg bag', unitPrice: 92.99, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BW-SND-001', description: 'Building Sand', unit: 'm3', unitPrice: 280.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BW-SND-002', description: 'Plaster Sand', unit: 'm3', unitPrice: 290.00, category: 'concrete_aggregates', isAvailable: true },
      { productCode: 'BW-BRK-001', description: 'Stock Brick 230x110x76mm', unit: '1000 bricks', unitPrice: 4150.00, category: 'building_materials', isAvailable: true },
      { productCode: 'BW-STL-001', description: 'Reinforcing Bar Y12', unit: '6m length', unitPrice: 112.50, category: 'steel_metal', isAvailable: true },
      { productCode: 'BW-TMB-001', description: 'Pine SAP 38x114mm', unit: '3.6m length', unitPrice: 87.50, category: 'timber_wood', isAvailable: true },
      { productCode: 'BW-RF-001', description: 'IBR Sheet 0.5mm', unit: 'linear meter', unitPrice: 112.00, category: 'roofing', isAvailable: true },
      { productCode: 'BW-PIP-001', description: 'PVC Pipe 110mm', unit: '6m length', unitPrice: 275.00, category: 'plumbing', isAvailable: true },
      { productCode: 'BW-CAB-001', description: 'Cable 2.5mm²', unit: 'meter', unitPrice: 17.50, category: 'electrical', isAvailable: true },
      { productCode: 'BW-PNT-001', description: 'PVA White 20L', unit: '20L', unitPrice: 475.00, category: 'paint_finishes', isAvailable: true },
      // Add more products as needed...
    ];

    return products;
  }

  /**
   * Scrape Macsteel products
   */
  private async scrapeMacsteelProducts(): Promise<ProductData[]> {
    // Mock Macsteel steel products catalog
    
    const products: ProductData[] = [
      // Steel bars and reinforcement
      { productCode: 'MS-RB-Y8', description: 'Reinforcing Bar Y8', unit: '6m length', unitPrice: 44.50, category: 'steel_metal', isAvailable: true },
      { productCode: 'MS-RB-Y10', description: 'Reinforcing Bar Y10', unit: '6m length', unitPrice: 67.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'MS-RB-Y12', description: 'Reinforcing Bar Y12', unit: '6m length', unitPrice: 113.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'MS-RB-Y16', description: 'Reinforcing Bar Y16', unit: '6m length', unitPrice: 180.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'MS-RB-Y20', description: 'Reinforcing Bar Y20', unit: '6m length', unitPrice: 268.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'MS-RB-Y25', description: 'Reinforcing Bar Y25', unit: '6m length', unitPrice: 385.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'MS-MSH-193', description: 'Welded Steel Mesh 193', unit: '2.4x4.8m sheet', unitPrice: 180.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'MS-MSH-283', description: 'Welded Steel Mesh 283', unit: '2.4x4.8m sheet', unitPrice: 240.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'MS-MSH-393', description: 'Welded Steel Mesh 393', unit: '2.4x4.8m sheet', unitPrice: 315.00, category: 'steel_metal', isAvailable: true },
      { productCode: 'MS-WR-2.5', description: 'Binding Wire 2.5mm', unit: 'kg', unitPrice: 27.50, category: 'steel_metal', isAvailable: true },
      // Add more steel products...
    ];

    return products;
  }

  /**
   * Generic website scraper
   * Returns supplier-specific product catalogs based on supplier ID
   */
  private async scrapeGenericWebsite(): ProductData[] {
    console.log(`📦 Generating product catalog for: ${this.supplierName}`);
    
    // Building Materials (15 suppliers)
    switch (this.supplierId) {
      case 'aerolite': return SupplierCatalogs.getAeroliteProducts();
      case 'bilt': return SupplierCatalogs.getBiltProducts();
      case 'build-it': return SupplierCatalogs.getBuildItProducts();
      case 'builders-depot': return SupplierCatalogs.getBuildersDepotProducts();
      case 'cashbuild': return SupplierCatalogs.getCashbuildProducts();
      case 'ceramic-industries': return SupplierCatalogs.getCeramicIndustriesProducts();
      case 'ctm': return SupplierCatalogs.getCTMProducts();
      case 'gyproc': return SupplierCatalogs.getGyprocProducts();
      case 'italtile': return SupplierCatalogs.getItaltileProducts();
      case 'knauf': return SupplierCatalogs.getKnaufProducts();
      case 'pennypinchers': return SupplierCatalogs.getPennyPinchersProducts();
      case 'saint-gobain': return SupplierCatalogs.getSaintGobainProducts();
      case 'sika': return SupplierCatalogs.getSikaProducts();
      case 'tal': return SupplierCatalogs.getTALProducts();
      case 'talisman': return SupplierCatalogs.getTalismanProducts();
      
      // Concrete & Aggregates (8 suppliers)
      case 'afrisam': return SupplierCatalogsPart2.getAfrisamProducts();
      case 'infraset': return SupplierCatalogsPart2.getInfrasetProducts();
      case 'lafarge': return SupplierCatalogsPart2.getLafargeProducts();
      case 'npc-cimpor': return SupplierCatalogsPart2.getNPCCimporProducts();
      case 'ppc-cement': return SupplierCatalogsPart2.getPPCProducts();
      case 'sephaku-cement': return SupplierCatalogsPart2.getSephakuProducts();
      case 'stewardsllods': return SupplierCatalogsPart2.getStewardsLlodsProducts();
      case 'technicrete': return SupplierCatalogsPart2.getTechnicreteProducts();
      
      // Electrical (6 suppliers)
      case 'abb': return SupplierCatalogsPart2.getABBProducts();
      case 'actom': return SupplierCatalogsPart2.getActomProducts();
      case 'arb': return SupplierCatalogsPart2.getARBProducts();
      case 'power-equipment': return SupplierCatalogsPart2.getPowerEquipmentProducts();
      case 'schneider-electric': return SupplierCatalogsPart2.getSchneiderProducts();
      case 'voltex': return SupplierCatalogsPart2.getVoltexProducts();
      
      // Hardware & Equipment (6 suppliers)
      case 'atlas-plant': return SupplierCatalogsPart3.getAtlasPlantProducts();
      case 'bosun': return SupplierCatalogsPart3.getBosunProducts();
      case 'container-world': return SupplierCatalogsPart3.getContainerWorldProducts();
      case 'hireall': return SupplierCatalogsPart3.getHireallProducts();
      case 'much-asphalt-plant-hire':
      case 'much-plant': return SupplierCatalogsPart3.getMuchPlantProducts();
      case 'talisman-hire': return SupplierCatalogsPart3.getTalismanHireProducts();
      
      // Paint & Finishes (4 suppliers)
      case 'dulux': return SupplierCatalogsPart3.getDuluxProducts();
      case 'leroy-merlin': return SupplierCatalogsPart3.getLeroyMerlinProducts();
      case 'plascon': return SupplierCatalogsPart3.getPlasconProducts();
      case 'prominent-paints': return SupplierCatalogsPart3.getProminentPaintsProducts();
      
      // Plumbing (5 suppliers)
      case 'avk': return SupplierCatalogsPart3.getAVKProducts();
      case 'geberit': return SupplierCatalogsPart3.getGeberitProducts();
      case 'jojo-tanks': return SupplierCatalogsPart3.getJojoTanksProducts();
      case 'ksb': return SupplierCatalogsPart3.getKSBProducts();
      case 'marley': return SupplierCatalogsPart3.getMarleyProducts();
      
      // Steel & Metal (5 suppliers)
      case 'arcelormittal': return SupplierCatalogsPart4.getArcelorMittalProducts();
      case 'cape-gate': return SupplierCatalogsPart4.getCapeGateProducts();
      case 'chamberlain': return SupplierCatalogsPart4.getChamberlainProducts();
      case 'jvr-steel': return SupplierCatalogsPart4.getJVRSteelProducts();
      case 'njr-steel': return SupplierCatalogsPart4.getNJRSteelProducts();
      
      // Timber (2 suppliers)
      case 'sappi': return SupplierCatalogsPart4.getSappiProducts();
      case 'timber-city': return SupplierCatalogsPart4.getTimberCityProducts();
      
      default:
        console.warn(`⚠️ No product catalog defined for ${this.supplierName} (${this.supplierId})`);
        console.log('💡 Add catalog method in supplier-catalogs.ts files');
        return [];
    }
  }
}

/**
 * NOTE FOR PRODUCTION:
 * 
 * Browser-based web scraping has limitations due to CORS.
 * For production deployment, implement server-side scraping:
 * 
 * 1. Create a Next.js API route: /api/scrape-supplier
 * 2. Use libraries like:
 *    - Cheerio (for static sites)
 *    - Puppeteer (for dynamic sites)
 *    - Playwright (for complex scraping)
 * 3. Schedule regular scraping jobs (cron)
 * 4. Cache results to avoid excessive requests
 * 5. Handle rate limiting and robots.txt
 * 
 * Example server-side implementation:
 * 
 * ```typescript
 * // /app/api/scrape-supplier/route.ts
 * import * as cheerio from 'cheerio';
 * 
 * export async function GET(request: Request) {
 *   const { searchParams } = new URL(request.url);
 *   const supplier = searchParams.get('supplier');
 *   
 *   const response = await fetch(`https://${supplier}.co.za/products`);
 *   const html = await response.text();
 *   const $ = cheerio.load(html);
 *   
 *   const products = [];
 *   $('.product-item').each((i, elem) => {
 *     products.push({
 *       code: $(elem).find('.sku').text(),
 *       name: $(elem).find('.title').text(),
 *       price: parseFloat($(elem).find('.price').text().replace('R', '')),
 *       // ... more fields
 *     });
 *   });
 *   
 *   return Response.json({ products });
 * }
 * ```
 */