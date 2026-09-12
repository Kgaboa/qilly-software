import { allSuppliersScraperData } from './comprehensiveScraperData';
import type { SupplierPrice } from '../supplierCatalog';

export interface ScrapeProgress {
  supplier: string;
  category: string;
  itemsScraped: number;
  totalCategories: number;
  currentCategory: number;
  status: 'scraping' | 'completed' | 'failed';
  error?: string;
}

/**
 * Simulate scraping a single page
 * In production, this would use HTTP requests + HTML parsing
 */
async function simulateScrapePage(
  url: string, 
  supplier: string, 
  categorySlug: string
): Promise<SupplierPrice[]> {
  // Find the supplier data
  const supplierData = allSuppliersScraperData.find(s => s.supplier === supplier);
  if (!supplierData) {
    throw new Error(`Supplier ${supplier} not found in scraper data`);
  }
  
  // Find the category
  const categoryData = supplierData.categories.find(c => c.slug === categorySlug);
  if (!categoryData) {
    throw new Error(`Category ${categorySlug} not found for supplier ${supplier}`);
  }
  
  // Simulate network delay (50-200ms per item)
  const delay = Math.random() * 150 + 50;
  await new Promise(resolve => setTimeout(resolve, delay * categoryData.products.length));
  
  // Convert partial products to full SupplierPrice objects
  return categoryData.products.map(product => ({
    itemName: product.itemName || 'Unknown Item',
    keywords: product.keywords || [],
    unitPrice: product.unitPrice || 0,
    unit: product.unit || 'unit',
    supplier: supplier,
    available: product.available !== undefined ? product.available : true,
    lastUpdated: new Date().toISOString().split('T')[0],
    category: product.category || categoryData.name,
    description: product.description || ''
  }));
}

/**
 * Scrape all configured suppliers
 */
export async function scrapeAllSuppliers(
  onProgress?: (progress: ScrapeProgress) => void
): Promise<SupplierPrice[]> {
  console.log('🚀 Starting catalog scraping for all suppliers...\n');
  
  const allCatalogData: SupplierPrice[] = [];
  
  // Iterate through all suppliers in comprehensive data
  for (const supplierData of allSuppliersScraperData) {
    const allProducts: SupplierPrice[] = [];
    
    console.log(`🕷️ Starting scrape for ${supplierData.supplier}...`);
    
    for (let i = 0; i < supplierData.categories.length; i++) {
      const categoryData = supplierData.categories[i];
      const url = `${supplierData.baseUrl}/${categoryData.slug}`;
      
      onProgress?.({
        supplier: supplierData.supplier,
        category: categoryData.name,
        itemsScraped: allProducts.length,
        totalCategories: supplierData.categories.length,
        currentCategory: i + 1,
        status: 'scraping'
      });
      
      try {
        console.log(`  📄 Scraping category: ${categoryData.name} (${url})`);
        
        // DEMO: Simulated scraping - In production, use actual HTTP + parsing
        const products = await simulateScrapePage(url, supplierData.supplier, categoryData.slug);
        
        allProducts.push(...products);
        console.log(`  ✅ Found ${products.length} items in ${categoryData.name}`);
        
      } catch (error) {
        console.error(`  ❌ Failed to scrape ${categoryData.name}:`, error);
        onProgress?.({
          supplier: supplierData.supplier,
          category: categoryData.name,
          itemsScraped: allProducts.length,
          totalCategories: supplierData.categories.length,
          currentCategory: i + 1,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    onProgress?.({
      supplier: supplierData.supplier,
      category: 'Complete',
      itemsScraped: allProducts.length,
      totalCategories: supplierData.categories.length,
      currentCategory: supplierData.categories.length,
      status: 'completed'
    });
    
    console.log(`✅ Completed scraping ${supplierData.supplier}: ${allProducts.length} total items`);
    allCatalogData.push(...allProducts);
  }
  
  console.log(`\n✅ Scraping complete! Total items: ${allCatalogData.length} from ${allSuppliersScraperData.length} suppliers`);
  return allCatalogData;
}

/**
 * Save catalog data to localStorage
 */
export function saveCatalogToStorage(catalog: SupplierPrice[]): void {
  try {
    localStorage.setItem('qilly_catalog_data', JSON.stringify(catalog));
    localStorage.setItem('qilly_catalog_timestamp', new Date().toISOString());
    console.log('✅ Catalog saved to localStorage');
  } catch (error) {
    console.error('❌ Failed to save catalog to localStorage:', error);
  }
}

/**
 * Load catalog data from localStorage
 */
export function loadCatalogFromStorage(): SupplierPrice[] | null {
  try {
    const data = localStorage.getItem('qilly_catalog_data');
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Failed to load catalog from localStorage:', error);
    return null;
  }
}

/**
 * Check if catalog needs refresh (older than 24 hours)
 */
export function needsCatalogRefresh(): boolean {
  try {
    const timestamp = localStorage.getItem('qilly_catalog_timestamp');
    if (!timestamp) return true;
    
    const lastUpdate = new Date(timestamp);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceUpdate > 24;
  } catch (error) {
    return true;
  }
}

/**
 * Get catalog age in hours
 */
export function getCatalogAge(): number | null {
  try {
    const timestamp = localStorage.getItem('qilly_catalog_timestamp');
    if (!timestamp) return null;
    
    const lastUpdate = new Date(timestamp);
    const now = new Date();
    return (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
  } catch (error) {
    return null;
  }
}
