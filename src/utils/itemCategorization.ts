/**
 * Categorize a BOQ item based on its code, description, and unit
 */

export interface ItemCategorization {
  category: 'EARTHWORKS' | 'PG_PROFESSIONAL' | 'PG_OVERHEAD' | 'SPECIAL' | 'LABOR' | 'EQUIPMENT' | 'MATERIAL' | 'MIXED' | 'UNKNOWN';
  hasSupplier: boolean;
  hasTransport: boolean;
  hasLaborComponent: boolean;
  hasEquipmentComponent: boolean;
  reason: string;
}

export function categorizeItem(
  code: string,
  description: string,
  unit: string
): ItemCategorization {
  
  // Handle null/undefined inputs safely
  const descLower = (description || '').toLowerCase();
  const unitLower = (unit || '').toLowerCase().trim();
  const codeUpper = (code || '').toUpperCase().trim();
  
  // Get the section letter (e.g., "D" from "D4.2")
  const sectionLetter = codeUpper.charAt(0);
  
  // ============================================================================
  // CATEGORY 1: EARTHWORKS (Section D OR earthworks keywords)
  // ============================================================================
  
  // Check for earthworks keywords FIRST (in case code is missing)
  const earthworksKeywords = [
    'excavat',
    'backfill',
    'compact',
    'subgrade',
    'fill',
    'earth',
    'trench',
    'foundation excavation',
    'cut and fill',
    'grade',
    'topsoil'
  ];
  
  const isEarthworksKeyword = earthworksKeywords.some(keyword => descLower.includes(keyword));
  
  if (sectionLetter === 'D' || isEarthworksKeyword) {
    // ALL earthworks are labor + equipment, NO suppliers, NO transport
    return {
      category: 'EARTHWORKS',
      hasSupplier: false,
      hasTransport: false,
      hasLaborComponent: true,
      hasEquipmentComponent: true,
      reason: sectionLetter === 'D' 
        ? `Section D (Earthworks) - Labor + Equipment pricing only`
        : `Earthworks keywords detected - Labor + Equipment pricing only`
    };
  }
  
  // ============================================================================
  // CATEGORY 2: P&G PROFESSIONAL SERVICES (Section A - specific items)
  // ============================================================================
  if (sectionLetter === 'A') {
    // Check for professional services (labor-based, NO materials)
    const professionalKeywords = [
      'health and safety file',
      'safety file',
      'site diary',
      'as-built drawings',
      'quantity surveyor',
      'project manager',
      'engineer',
      'architect',
      'geotechnical',
      'soil testing',
      'supervision',
      'inspection',
      'survey',
      'setting out',
      'professional fee',
      'submission of',
      'compile',
      'preparation of',
      'coordinate',
      'liaison'
    ];
    
    if (professionalKeywords.some(keyword => descLower.includes(keyword))) {
      return {
        category: 'PG_PROFESSIONAL',
        hasSupplier: false,
        hasTransport: false,
        hasLaborComponent: true,
        hasEquipmentComponent: false,
        reason: `P&G Professional Services - Fee-based, no materials/transport`
      };
    }
    
    // Check for P&G overhead items (NO materials, NO labor - percentage-based)
    const overheadKeywords = [
      'site establishment',
      'temporary fence',
      'temporary water',
      'temporary electrical',
      'site office',
      'security',
      'storage',
      'insurance',
      'preliminaries',
      'general items'
    ];
    
    if (overheadKeywords.some(keyword => descLower.includes(keyword))) {
      return {
        category: 'PG_OVERHEAD',
        hasSupplier: true,
        hasTransport: false,
        hasLaborComponent: false,
        hasEquipmentComponent: false,
        reason: `P&G Overhead - Percentage-based, no materials/transport`
      };
    }
  }
  
  // ============================================================================
  // CATEGORY 3: SPECIAL UNITS (P/S, PC, L/S, %)
  // ============================================================================
  const isProvisionalSum = unitLower.includes('provisional sum') || 
                          unitLower === 'p/s' || 
                          descLower.includes('provisional sum');
  
  const isPCSum = unitLower.includes('prime cost') || 
                 unitLower.includes('pc sum') || 
                 unitLower === 'pc' ||
                 descLower.includes('prime cost');
  
  const isLumpSum = unitLower === 'lump sum' || 
                   unitLower === 'lumpsum' || 
                   unitLower === 'lump' ||
                   unitLower === 'ls' || 
                   unitLower === 'l/s' ||
                   unitLower === 'sum';
  
  const isPercentage = unitLower === '%' || 
                      unitLower.includes('percent');
  
  if (isProvisionalSum || isPCSum || isLumpSum || isPercentage) {
    return {
      category: 'SPECIAL',
      hasSupplier: true,
      hasTransport: false,
      hasLaborComponent: false,
      hasEquipmentComponent: false,
      reason: `Special unit type (${unit}) - Handled separately`
    };
  }
  
  // ============================================================================
  // CATEGORY 4: PURE LABOR (No materials)
  // ============================================================================
  const laborOnlyKeywords = [
    'labor only',
    'labour only',
    'labor for',
    'labour for',
    'laying only',
    'installation only',
    'fixing only',
    'placing only',
    'erection only',
    'assembly only'
  ];
  
  if (laborOnlyKeywords.some(keyword => descLower.includes(keyword))) {
    return {
      category: 'LABOR',
      hasSupplier: false,
      hasTransport: false,
      hasLaborComponent: true,
      hasEquipmentComponent: false,
      reason: `Pure labor item - No materials/transport`
    };
  }
  
  // ============================================================================
  // CATEGORY 5: EQUIPMENT RENTAL
  // ============================================================================
  const equipmentKeywords = [
    'hire of',
    'rental of',
    'rent',
    'scaffolding',
    'formwork',
    'shoring',
    'propping',
    'excavator',
    'loader',
    'mixer',
    'crane',
    'hoist',
    'pump'
  ];
  
  // Check if it's rental/hire and unit is time-based
  const isTimeBasedUnit = ['day', 'days', 'week', 'weeks', 'month', 'months', 'hour', 'hours', 'hr', 'hrs']
    .some(timeUnit => unitLower.includes(timeUnit));
  
  if (equipmentKeywords.some(keyword => descLower.includes(keyword)) && isTimeBasedUnit) {
    return {
      category: 'EQUIPMENT',
      hasSupplier: false,
      hasTransport: false,
      hasLaborComponent: false,
      hasEquipmentComponent: true,
      reason: `Equipment rental - Rental rate only, no materials/transport`
    };
  }
  
  // ============================================================================
  // CATEGORY 6: PURE MATERIALS (Supplier + Transport)
  // ============================================================================
  const pureMaterialKeywords = [
    'supply only',
    'material only',
    'supply of',
    'supply and deliver',
    'delivered to site'
  ];
  
  // Also check for known material codes (B1 = concrete, etc.)
  const pureMaterialCodes = ['B1.1', 'B1.2', 'B1.3', 'B1.4']; // Concrete items
  
  if (pureMaterialKeywords.some(keyword => descLower.includes(keyword)) ||
      pureMaterialCodes.includes(codeUpper)) {
    return {
      category: 'MATERIAL',
      hasSupplier: true,
      hasTransport: true,
      hasLaborComponent: false,
      hasEquipmentComponent: false,
      reason: `Pure material item - Supplier + Transport pricing`
    };
  }
  
  // ============================================================================
  // CATEGORY 7: MIXED (Material + Labor)
  // ============================================================================
  // Check for items that explicitly include both
  const mixedKeywords = [
    'supply and install',
    'supply and fix',
    'supply and lay',
    'including installation',
    'including fixing',
    'including laying',
    'complete',
    'fully installed'
  ];
  
  if (mixedKeywords.some(keyword => descLower.includes(keyword))) {
    return {
      category: 'MIXED',
      hasSupplier: true,
      hasTransport: true,
      hasLaborComponent: true,
      hasEquipmentComponent: false,
      reason: `Mixed item - Material (supplier+transport) + Labor`
    };
  }
  
  // ============================================================================
  // DEFAULT: Analyze by section and common patterns
  // ============================================================================
  
  // Section-based defaults
  switch (sectionLetter) {
    case 'A': // Preliminaries - usually P&G overhead
      return {
        category: 'PG_OVERHEAD',
        hasSupplier: false,
        hasTransport: false,
        hasLaborComponent: false,
        hasEquipmentComponent: false,
        reason: `Section A default - P&G overhead`
      };
    
    case 'B': // Substructure/Superstructure - usually mixed (material + labor)
    case 'C': // Superstructure
      return {
        category: 'MIXED',
        hasSupplier: true,
        hasTransport: true,
        hasLaborComponent: true,
        hasEquipmentComponent: false,
        reason: `Section ${sectionLetter} default - Material + Labor`
      };
    
    case 'D': // Earthworks - already handled above
      return {
        category: 'EARTHWORKS',
        hasSupplier: false,
        hasTransport: false,
        hasLaborComponent: true,
        hasEquipmentComponent: true,
        reason: `Section D - Earthworks`
      };
    
    case 'E': // Services - usually mixed
    case 'F': // Finishes - usually mixed
      return {
        category: 'MIXED',
        hasSupplier: true,
        hasTransport: true,
        hasLaborComponent: true,
        hasEquipmentComponent: false,
        reason: `Section ${sectionLetter} default - Material + Labor`
      };
    
    case 'G': // External works - could be earthworks or materials
      // If it involves earth/ground work, treat as earthworks
      if (descLower.includes('excavat') || descLower.includes('fill') || 
          descLower.includes('compact') || descLower.includes('grade')) {
        return {
          category: 'EARTHWORKS',
          hasSupplier: false,
          hasTransport: false,
          hasLaborComponent: true,
          hasEquipmentComponent: true,
          reason: `Section G - Earthworks component`
        };
      }
      // Otherwise mixed (e.g., paving = material + labor)
      return {
        category: 'MIXED',
        hasSupplier: true,
        hasTransport: true,
        hasLaborComponent: true,
        hasEquipmentComponent: false,
        reason: `Section G default - Material + Labor`
      };
    
    default:
      // Unknown section - assume mixed as safest default
      return {
        category: 'UNKNOWN',
        hasSupplier: true,
        hasTransport: true,
        hasLaborComponent: true,
        hasEquipmentComponent: false,
        reason: `Unknown section - Defaulting to mixed pricing`
      };
  }
}

/**
 * Quick check: Should this item use supplier pricing?
 */
export function shouldUseSupplier(code: string, description: string, unit: string): boolean {
  const categorization = categorizeItem(code, description, unit);
  return categorization.hasSupplier;
}

/**
 * Quick check: Should this item have transport costs?
 */
export function shouldHaveTransport(code: string, description: string, unit: string): boolean {
  const categorization = categorizeItem(code, description, unit);
  return categorization.hasTransport;
}

/**
 * Quick check: Should this item use labor rates?
 */
export function shouldUseLaborRate(code: string, description: string, unit: string): boolean {
  const categorization = categorizeItem(code, description, unit);
  return categorization.hasLaborComponent;
}

/**
 * Quick check: Should this item use equipment rates?
 */
export function shouldUseEquipmentRate(code: string, description: string, unit: string): boolean {
  const categorization = categorizeItem(code, description, unit);
  return categorization.hasEquipmentComponent;
}

/**
 * Get full categorization details (for logging/debugging)
 */
export function getItemCategorization(code: string, description: string, unit: string): ItemCategorization {
  return categorizeItem(code, description, unit);
}