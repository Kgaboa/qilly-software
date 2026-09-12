/**
 * Base Product Fetcher Interface
 * All product fetchers (REST, Scraping, Manual) implement this interface
 */

export interface ProductData {
  productCode: string;
  description: string;
  unit: string;
  unitPrice: number;
  category: string;
  isAvailable: boolean;
  brand?: string;
  specifications?: Record<string, any>;
  imageUrl?: string;
}

export interface FetchResult {
  success: boolean;
  products: ProductData[];
  totalProducts: number;
  errors: string[];
  fetchedAt: string;
  supplierName: string;
  supplierId: string;
}

export abstract class BaseProductFetcher {
  protected supplierId: string;
  protected supplierName: string;
  
  constructor(supplierId: string, supplierName: string) {
    this.supplierId = supplierId;
    this.supplierName = supplierName;
  }

  /**
   * Fetch all products from supplier
   * Must be implemented by each fetcher type
   */
  abstract fetchAllProducts(): Promise<FetchResult>;

  /**
   * Validate product data
   */
  protected validateProduct(product: Partial<ProductData>): product is ProductData {
    return !!(
      product.productCode &&
      product.description &&
      product.unit &&
      typeof product.unitPrice === 'number' &&
      product.unitPrice > 0 &&
      product.category
    );
  }

  /**
   * Clean and normalize product data
   */
  protected normalizeProduct(product: ProductData): ProductData {
    return {
      ...product,
      productCode: product.productCode.trim(),
      description: product.description.trim(),
      unit: product.unit.trim(),
      unitPrice: parseFloat(product.unitPrice.toFixed(2)),
      category: product.category.trim().toLowerCase(),
      isAvailable: product.isAvailable !== false, // Default to true
    };
  }

  /**
   * Create error result
   */
  protected createErrorResult(error: string): FetchResult {
    return {
      success: false,
      products: [],
      totalProducts: 0,
      errors: [error],
      fetchedAt: new Date().toISOString(),
      supplierName: this.supplierName,
      supplierId: this.supplierId,
    };
  }

  /**
   * Create success result
   */
  protected createSuccessResult(products: ProductData[]): FetchResult {
    return {
      success: true,
      products,
      totalProducts: products.length,
      errors: [],
      fetchedAt: new Date().toISOString(),
      supplierName: this.supplierName,
      supplierId: this.supplierId,
    };
  }
}

/**
 * Product Category Mapping
 * Maps supplier categories to Qilly standard categories
 */
export const PRODUCT_CATEGORIES = {
  // Concrete & Aggregates
  cement: 'concrete_aggregates',
  concrete: 'concrete_aggregates',
  sand: 'concrete_aggregates',
  aggregate: 'concrete_aggregates',
  stone: 'concrete_aggregates',
  
  // Steel & Metal
  steel: 'steel_metal',
  rebar: 'steel_metal',
  reinforcement: 'steel_metal',
  metal: 'steel_metal',
  
  // Bricks & Blocks
  brick: 'building_materials',
  block: 'building_materials',
  paver: 'building_materials',
  
  // Timber & Wood
  timber: 'timber_wood',
  wood: 'timber_wood',
  plank: 'timber_wood',
  beam: 'timber_wood',
  
  // Plumbing
  pipe: 'plumbing',
  fitting: 'plumbing',
  valve: 'plumbing',
  tap: 'plumbing',
  
  // Electrical
  cable: 'electrical',
  wire: 'electrical',
  conduit: 'electrical',
  switch: 'electrical',
  
  // Paint & Finishes
  paint: 'paint_finishes',
  varnish: 'paint_finishes',
  coating: 'paint_finishes',
  
  // Roofing
  roof: 'roofing',
  tile: 'roofing',
  sheet: 'roofing',
  gutter: 'roofing',
  
  // Tools & Hardware
  tool: 'tools_hardware',
  hardware: 'tools_hardware',
  fastener: 'tools_hardware',
} as const;

/**
 * Map supplier category to Qilly category
 */
export function mapCategory(supplierCategory: string): string {
  const normalized = supplierCategory.toLowerCase();
  
  for (const [key, value] of Object.entries(PRODUCT_CATEGORIES)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  
  return 'building_materials'; // Default category
}
