/**
 * Brand Detection System
 * Identifies brand names in item descriptions to improve matching accuracy
 * 
 * When matching "PPC Cement" vs "Surecem Cement", brand detection ensures
 * we don't mix brands unless explicitly allowed
 */

export interface BrandInfo {
  name: string;
  category: string;
  aliases: string[];
}

export const constructionBrands: BrandInfo[] = [
  // Cement Brands
  {
    name: 'PPC',
    category: 'Cement',
    aliases: ['ppc', 'pretoria portland cement']
  },
  {
    name: 'Surecem',
    category: 'Cement',
    aliases: ['surecem', 'sure cem']
  },
  {
    name: 'Surebuild',
    category: 'Cement',
    aliases: ['surebuild', 'sure build']
  },
  {
    name: 'Lafarge',
    category: 'Cement',
    aliases: ['lafarge']
  },
  {
    name: 'AfriSam',
    category: 'Cement',
    aliases: ['afrisam', 'afri sam', 'afri-sam']
  },
  
  // Steel Brands
  {
    name: 'Macsteel',
    category: 'Steel',
    aliases: ['macsteel', 'mac steel']
  },
  {
    name: 'ArcelorMittal',
    category: 'Steel',
    aliases: ['arcelormittal', 'arcelor mittal', 'mittal']
  },
  {
    name: 'Scaw Metals',
    category: 'Steel',
    aliases: ['scaw', 'scaw metals']
  },
  {
    name: 'Cape Gate',
    category: 'Steel',
    aliases: ['cape gate', 'capegate']
  },
  
  // Paint Brands
  {
    name: 'Dulux',
    category: 'Paint',
    aliases: ['dulux']
  },
  {
    name: 'Plascon',
    category: 'Paint',
    aliases: ['plascon']
  },
  {
    name: 'Prominent',
    category: 'Paint',
    aliases: ['prominent']
  },
  
  // Pipe Brands
  {
    name: 'Marley',
    category: 'Pipes',
    aliases: ['marley']
  },
  {
    name: 'Cobra',
    category: 'Pipes',
    aliases: ['cobra']
  },
  {
    name: 'Wavin',
    category: 'Pipes',
    aliases: ['wavin']
  },
  {
    name: 'Pipelife',
    category: 'Pipes',
    aliases: ['pipelife', 'pipe life']
  },
  
  // Brick Brands
  {
    name: 'Corobrik',
    category: 'Bricks',
    aliases: ['corobrik', 'coro brik']
  },
  {
    name: 'Clay Brick',
    category: 'Bricks',
    aliases: ['clay brick', 'claybrick']
  },
  
  // Concrete Brands
  {
    name: 'Raumix',
    category: 'Concrete',
    aliases: ['raumix', 'rau mix']
  },
  {
    name: 'Readymix',
    category: 'Concrete',
    aliases: ['readymix', 'ready mix', 'ready-mix']
  },
  
  // Aggregate Brands
  {
    name: 'Lafarge',
    category: 'Aggregates',
    aliases: ['lafarge']
  },
  
  // Hardware Stores (Suppliers)
  {
    name: 'Buco',
    category: 'Supplier',
    aliases: ['buco', 'buildersuco']
  },
  {
    name: 'Builders Warehouse',
    category: 'Supplier',
    aliases: ['builders warehouse', 'builders', 'bw']
  },
  {
    name: 'Cashbuild',
    category: 'Supplier',
    aliases: ['cashbuild', 'cash build']
  },
  {
    name: 'Leroy Merlin',
    category: 'Supplier',
    aliases: ['leroy merlin', 'leroy', 'leroymerlin']
  },
  {
    name: 'Makro',
    category: 'Supplier',
    aliases: ['makro']
  }
];

/**
 * Create a fast lookup map for brand detection
 */
function createBrandLookup(): Map<string, BrandInfo> {
  const lookup = new Map<string, BrandInfo>();
  
  for (const brand of constructionBrands) {
    for (const alias of brand.aliases) {
      lookup.set(alias.toLowerCase(), brand);
    }
  }
  
  return lookup;
}

const brandLookup = createBrandLookup();

/**
 * Detect brand in a text description
 * @param text The item description to search
 * @returns BrandInfo if found, null otherwise
 */
export function detectBrand(text: string): BrandInfo | null {
  if (!text) return null;
  
  const textLower = text.toLowerCase();
  
  // Check each brand alias
  for (const [alias, brand] of brandLookup.entries()) {
    // Use word boundaries to avoid false matches
    // e.g., "PPC" should match "PPC Cement" but not "PPCC"
    const regex = new RegExp(`\\b${alias}\\b`, 'i');
    if (regex.test(textLower)) {
      return brand;
    }
  }
  
  return null;
}

/**
 * Extract all brands mentioned in text
 */
export function extractBrands(text: string): BrandInfo[] {
  const brands: BrandInfo[] = [];
  const seen = new Set<string>();
  
  const textLower = text.toLowerCase();
  
  for (const [alias, brand] of brandLookup.entries()) {
    const regex = new RegExp(`\\b${alias}\\b`, 'i');
    if (regex.test(textLower) && !seen.has(brand.name)) {
      brands.push(brand);
      seen.add(brand.name);
    }
  }
  
  return brands;
}

/**
 * Check if two items have matching brands
 * This is used to boost match scores when brands align
 * 
 * @returns 
 *  - true if both have same brand
 *  - false if both have different brands
 *  - null if one or both have no brand detected
 */
export function brandsMatch(text1: string, text2: string): boolean | null {
  const brand1 = detectBrand(text1);
  const brand2 = detectBrand(text2);
  
  // If neither has a brand, we can't determine brand match
  if (!brand1 && !brand2) return null;
  
  // If only one has a brand, we can't determine match
  if (!brand1 || !brand2) return null;
  
  // Both have brands - do they match?
  return brand1.name === brand2.name;
}

/**
 * Calculate brand match bonus for scoring
 * @returns Bonus points to add to match score (0-15)
 */
export function getBrandMatchBonus(text1: string, text2: string): number {
  const match = brandsMatch(text1, text2);
  
  if (match === true) {
    // Same brand = strong positive signal
    return 15;
  } else if (match === false) {
    // Different brands = penalty
    return -10;
  }
  
  // No brand or can't determine = neutral
  return 0;
}

/**
 * Check if text contains a specific brand
 */
export function hasBrand(text: string, brandName: string): boolean {
  const brand = detectBrand(text);
  return brand?.name.toLowerCase() === brandName.toLowerCase();
}

/**
 * Get all brands in a specific category
 */
export function getBrandsByCategory(category: string): BrandInfo[] {
  return constructionBrands.filter(b => 
    b.category.toLowerCase() === category.toLowerCase()
  );
}
