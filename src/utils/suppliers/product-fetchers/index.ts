/**
 * Product Fetchers Index
 * Exports all fetcher types and factory function
 */

export { BaseProductFetcher, type ProductData, type FetchResult, mapCategory, PRODUCT_CATEGORIES } from './base-fetcher';
export { RestAPIFetcher } from './rest-api-fetcher';
export { ScrapingFetcher } from './scraping-fetcher';

import { BaseProductFetcher, FetchResult } from './base-fetcher';
import { RestAPIFetcher } from './rest-api-fetcher';
import { ScrapingFetcher } from './scraping-fetcher';
import { SUPPLIER_CONFIGS } from '../supplier-connector';

/**
 * Factory function to create appropriate fetcher for a supplier
 */
export function createProductFetcher(supplierId: string): BaseProductFetcher | null {
  const config = SUPPLIER_CONFIGS.find(s => s.id === supplierId);
  
  if (!config) {
    console.error(`Supplier ${supplierId} not found in configuration`);
    return null;
  }

  switch (config.apiType) {
    case 'rest':
      return new RestAPIFetcher(
        config.id,
        config.name,
        config.website || '', // In production, use actual API endpoint
        config.apiKey
      );
      
    case 'scraping':
      return new ScrapingFetcher(
        config.id,
        config.name,
        config.website || ''
      );
      
    case 'manual':
      // Manual suppliers don't have automated fetchers
      // They use the manual entry UI
      console.log(`${config.name} requires manual product entry`);
      return null;
      
    default:
      console.warn(`Unknown API type for ${config.name}: ${config.apiType}`);
      return null;
  }
}

/**
 * Fetch products from a supplier using the appropriate method
 */
export async function fetchSupplierProducts(supplierId: string): Promise<FetchResult> {
  const fetcher = createProductFetcher(supplierId);
  
  if (!fetcher) {
    const config = SUPPLIER_CONFIGS.find(s => s.id === supplierId);
    return {
      success: false,
      products: [],
      totalProducts: 0,
      errors: ['No fetcher available for this supplier. Manual entry required.'],
      fetchedAt: new Date().toISOString(),
      supplierName: config?.name || 'Unknown',
      supplierId,
    };
  }

  return await fetcher.fetchAllProducts();
}
