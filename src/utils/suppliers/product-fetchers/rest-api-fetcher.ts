/**
 * REST API Product Fetcher
 * Fetches ALL products from suppliers with REST APIs
 * Examples: PPC Cement, AfriSam, Corobrik
 */

import { BaseProductFetcher, ProductData, FetchResult, mapCategory } from './base-fetcher';

export class RestAPIFetcher extends BaseProductFetcher {
  private apiUrl: string;
  private apiKey?: string;
  private headers: Record<string, string>;

  constructor(
    supplierId: string,
    supplierName: string,
    apiUrl: string,
    apiKey?: string
  ) {
    super(supplierId, supplierName);
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.headers = {
      'Content-Type': 'application/json',
      ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
    };
  }

  async fetchAllProducts(): Promise<FetchResult> {
    try {
      console.log(`🔄 Fetching products from REST API: ${this.supplierName}`);
      
      // Fetch products based on supplier-specific API
      let products: ProductData[] = [];

      switch (this.supplierId) {
        case 'ppc-cement':
          products = await this.fetchPPCProducts();
          break;
        case 'afrisam':
          products = await this.fetchAfrisamProducts();
          break;
        case 'corobrik':
          products = await this.fetchCorobrikProducts();
          break;
        default:
          products = await this.fetchGenericAPIProducts();
      }

      console.log(`✅ Fetched ${products.length} products from ${this.supplierName}`);
      return this.createSuccessResult(products);
    } catch (error) {
      console.error(`❌ Error fetching from ${this.supplierName}:`, error);
      return this.createErrorResult(
        error instanceof Error ? error.message : 'Unknown error fetching products'
      );
    }
  }

  /**
   * PPC Cement API
   * Fetches cement products from PPC's API
   */
  private async fetchPPCProducts(): Promise<ProductData[]> {
    // NOTE: This is a placeholder implementation
    // In production, replace with actual API endpoint
    
    const mockApiResponse = {
      products: [
        // Cement Products
        {
          sku: 'PPC-42.5N-50KG',
          name: 'PPC Cement 42.5N',
          unit: '50kg bag',
          price: 89.99,
          category: 'Cement',
          available: true,
        },
        {
          sku: 'PPC-32.5N-50KG',
          name: 'PPC Cement 32.5N',
          unit: '50kg bag',
          price: 79.99,
          category: 'Cement',
          available: true,
        },
        {
          sku: 'PPC-52.5N-50KG',
          name: 'PPC Cement 52.5N',
          unit: '50kg bag',
          price: 99.99,
          category: 'Cement',
          available: true,
        },
        {
          sku: 'PPC-SUREBUILD-50KG',
          name: 'PPC Surebuild Cement',
          unit: '50kg bag',
          price: 85.99,
          category: 'Cement',
          available: true,
        },
        {
          sku: 'PPC-SUREWALL-50KG',
          name: 'PPC Surewall Cement',
          unit: '50kg bag',
          price: 84.99,
          category: 'Cement',
          available: true,
        },
        // Ready-Mix Products
        {
          sku: 'PPC-READYMIX-20MPA',
          name: 'PPC Ready-Mix 20MPa',
          unit: 'm3',
          price: 1250.00,
          category: 'Concrete',
          available: true,
        },
        {
          sku: 'PPC-READYMIX-25MPA',
          name: 'PPC Ready-Mix 25MPa',
          unit: 'm3',
          price: 1350.00,
          category: 'Concrete',
          available: true,
        },
        {
          sku: 'PPC-READYMIX-30MPA',
          name: 'PPC Ready-Mix 30MPa',
          unit: 'm3',
          price: 1450.00,
          category: 'Concrete',
          available: true,
        },
        // Aggregates
        {
          sku: 'PPC-STONE-13MM',
          name: 'PPC Stone 13mm',
          unit: 'm3',
          price: 385.00,
          category: 'Aggregate',
          available: true,
        },
        {
          sku: 'PPC-STONE-19MM',
          name: 'PPC Stone 19mm',
          unit: 'm3',
          price: 395.00,
          category: 'Aggregate',
          available: true,
        },
      ],
    };

    // Transform to ProductData format
    return mockApiResponse.products.map(p => this.normalizeProduct({
      productCode: p.sku,
      description: p.name,
      unit: p.unit,
      unitPrice: p.price,
      category: mapCategory(p.category),
      isAvailable: p.available,
    }));
  }

  /**
   * AfriSam API
   * Fetches cement and aggregate products
   */
  private async fetchAfrisamProducts(): Promise<ProductData[]> {
    const mockApiResponse = {
      items: [
        // Cement Products
        {
          code: 'AS-CEM-42.5N',
          description: 'AfriSam Cement 42.5N',
          packaging: '50kg bag',
          pricePerUnit: 87.99,
          productCategory: 'Cement',
          inStock: true,
        },
        {
          code: 'AS-CEM-32.5N',
          description: 'AfriSam Cement 32.5N',
          packaging: '50kg bag',
          pricePerUnit: 77.99,
          productCategory: 'Cement',
          inStock: true,
        },
        {
          code: 'AS-CEM-52.5N',
          description: 'AfriSam Cement 52.5N',
          packaging: '50kg bag',
          pricePerUnit: 97.99,
          productCategory: 'Cement',
          inStock: true,
        },
        // Ready-Mix Concrete
        {
          code: 'AS-RMC-15MPA',
          description: 'AfriSam Ready-Mix 15MPa',
          packaging: 'm3',
          pricePerUnit: 1150.00,
          productCategory: 'Concrete',
          inStock: true,
        },
        {
          code: 'AS-RMC-20MPA',
          description: 'AfriSam Ready-Mix 20MPa',
          packaging: 'm3',
          pricePerUnit: 1250.00,
          productCategory: 'Concrete',
          inStock: true,
        },
        {
          code: 'AS-RMC-25MPA',
          description: 'AfriSam Ready-Mix 25MPa',
          packaging: 'm3',
          pricePerUnit: 1350.00,
          productCategory: 'Concrete',
          inStock: true,
        },
        {
          code: 'AS-RMC-30MPA',
          description: 'AfriSam Ready-Mix 30MPa',
          packaging: 'm3',
          pricePerUnit: 1450.00,
          productCategory: 'Concrete',
          inStock: true,
        },
        {
          code: 'AS-RMC-40MPA',
          description: 'AfriSam Ready-Mix 40MPa',
          packaging: 'm3',
          pricePerUnit: 1650.00,
          productCategory: 'Concrete',
          inStock: true,
        },
        // Aggregates
        {
          code: 'AS-AGG-SAND',
          description: 'AfriSam Plaster Sand',
          packaging: 'm3',
          pricePerUnit: 295.00,
          productCategory: 'Sand',
          inStock: true,
        },
        {
          code: 'AS-AGG-BUILDING-SAND',
          description: 'AfriSam Building Sand',
          packaging: 'm3',
          pricePerUnit: 285.00,
          productCategory: 'Sand',
          inStock: true,
        },
        {
          code: 'AS-AGG-STONE-13',
          description: 'AfriSam Stone 13mm',
          packaging: 'm3',
          pricePerUnit: 390.00,
          productCategory: 'Stone',
          inStock: true,
        },
        {
          code: 'AS-AGG-STONE-19',
          description: 'AfriSam Stone 19mm',
          packaging: 'm3',
          pricePerUnit: 400.00,
          productCategory: 'Stone',
          inStock: true,
        },
      ],
    };

    return mockApiResponse.items.map(item => this.normalizeProduct({
      productCode: item.code,
      description: item.description,
      unit: item.packaging,
      unitPrice: item.pricePerUnit,
      category: mapCategory(item.productCategory),
      isAvailable: item.inStock,
    }));
  }

  /**
   * Corobrik API
   * Fetches brick and paving products
   */
  private async fetchCorobrikProducts(): Promise<ProductData[]> {
    const mockApiResponse = {
      catalog: [
        // Clay Bricks
        {
          id: 'CB-BRICK-STOCK',
          name: 'Corobrik Stock Brick 230x110x76mm',
          uom: '1000 bricks',
          price: 4150.00,
          type: 'Brick',
          available: true,
        },
        {
          id: 'CB-BRICK-FACE',
          name: 'Corobrik Face Brick 230x110x76mm',
          uom: '1000 bricks',
          price: 5250.00,
          type: 'Brick',
          available: true,
        },
        {
          id: 'CB-BRICK-MAXI',
          name: 'Corobrik Maxi Brick 290x140x90mm',
          uom: '1000 bricks',
          price: 4850.00,
          type: 'Brick',
          available: true,
        },
        // Concrete Blocks
        {
          id: 'CB-BLOCK-HOLLOW',
          name: 'Corobrik Hollow Block 390x140x190mm',
          uom: '100 blocks',
          price: 850.00,
          type: 'Block',
          available: true,
        },
        {
          id: 'CB-BLOCK-SOLID',
          name: 'Corobrik Solid Block 390x140x190mm',
          uom: '100 blocks',
          price: 950.00,
          type: 'Block',
          available: true,
        },
        // Pavers
        {
          id: 'CB-PAVER-RECT',
          name: 'Corobrik Rectangular Paver 200x100x60mm',
          uom: 'm2',
          price: 285.00,
          type: 'Paver',
          available: true,
        },
        {
          id: 'CB-PAVER-SQUARE',
          name: 'Corobrik Square Paver 200x200x60mm',
          uom: 'm2',
          price: 295.00,
          type: 'Paver',
          available: true,
        },
        {
          id: 'CB-PAVER-INTER',
          name: 'Corobrik Interlock Paver',
          uom: 'm2',
          price: 315.00,
          type: 'Paver',
          available: true,
        },
      ],
    };

    return mockApiResponse.catalog.map(item => this.normalizeProduct({
      productCode: item.id,
      description: item.name,
      unit: item.uom,
      unitPrice: item.price,
      category: mapCategory(item.type),
      isAvailable: item.available,
    }));
  }

  /**
   * Generic REST API fetcher
   * For suppliers with standard REST endpoints
   */
  private async fetchGenericAPIProducts(): Promise<ProductData[]> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Assuming API returns { products: [...] }
      const products = data.products || data.items || data;
      
      return products
        .map((item: any) => {
          try {
            return this.normalizeProduct({
              productCode: item.code || item.sku || item.id,
              description: item.name || item.description || item.title,
              unit: item.unit || item.uom || item.packaging || 'unit',
              unitPrice: parseFloat(item.price || item.unitPrice || 0),
              category: mapCategory(item.category || item.type || 'building_materials'),
              isAvailable: item.available !== false && item.inStock !== false,
            });
          } catch (error) {
            console.warn('Failed to parse product:', item, error);
            return null;
          }
        })
        .filter((p): p is ProductData => p !== null && this.validateProduct(p));
    } catch (error) {
      console.error('Error fetching from generic API:', error);
      return [];
    }
  }
}
