import { allSupplierCatalogs, getAllSuppliers, type SupplierPrice } from './supplierCatalog';
import { calculateProvincialPrice, getProvinceByCode } from './provincialPricing';
import { enhancedSearchCatalog, type MatchResult } from './matching';

export interface ProjectSettings {
  province?: string;
  profitMargin?: string;
  cidbGrading?: string;
  duration?: string;
  machineryType?: string;
}

export interface BillItem {
  code: string;
  name: string;
  description: string;
  quantity: string;
  unit: string;
  isRateOnly?: boolean; // Flag for "Rate Only" items
  buildAidRef?: string; // BuildAid 2025/2026 reference
  sansCode?: string; // SANS 1200 standard code
}

export interface SupplierQuote {
  supplier: string;
  unitPrice: string;
  totalPrice: string;
  available: boolean;
  province?: string; // Province where this quote is from
  matchType?: 'exact' | 'keyword';
  buildAidRef?: string; // BuildAid 2025/2026 reference from supplier catalog
  sansCode?: string; // SANS 1200 standard code from supplier catalog
}

export interface PricedBillItem extends BillItem {
  supplierPrices: SupplierQuote[];
  selectedSupplier: string;
  selectedProvince?: string; // Add province information
  unitPrice: string;
  totalPrice: string;
  buildAidRef?: string; // BuildAid 2025/2026 reference (inherited from BillItem or supplier)
  sansCode?: string; // SANS 1200 standard code (inherited from BillItem or supplier)
}

/**
 * Calculate CIDB overhead factor based on grading
 * Higher CIDB gradings require more overhead for compliance, insurance, and administration
 */
function getCIDBOverheadFactor(cidbGrading: string): number {
  const overheadMap: { [key: string]: number } = {
    'GB1': 1.02,  // 2% overhead for smallest contractors
    'GB2': 1.03,  // 3% overhead
    'GB3': 1.04,  // 4% overhead
    'GB4': 1.05,  // 5% overhead
    'GB5': 1.06,  // 6% overhead
    'GB6': 1.07,  // 7% overhead
    'GB7': 1.08,  // 8% overhead
    'GB8': 1.09,  // 9% overhead
    'GB9': 1.10,  // 10% overhead for largest contractors
  };
  
  return overheadMap[cidbGrading] || 1.05; // Default to GB4 level
}

/**
 * Calculate duration factor - longer projects can afford lower margins
 * Shorter projects need higher margins due to mobilization costs
 */
function getDurationFactor(durationMonths: string): number {
  const duration = parseInt(durationMonths);
  
  if (duration <= 1) return 1.05;      // 5% extra for very short projects
  if (duration <= 3) return 1.03;      // 3% extra for short projects
  if (duration <= 6) return 1.01;      // 1% extra for medium projects
  if (duration <= 12) return 1.00;     // No adjustment for standard projects
  if (duration <= 18) return 0.99;     // 1% discount for longer projects
  if (duration <= 24) return 0.98;     // 2% discount for long projects
  return 0.97;                          // 3% discount for very long projects (economies of scale)
}

/**
 * Calculate machinery cost factor
 * Owned machinery reduces costs, rented increases them
 */
function getMachineryFactor(machineryType: string): number {
  return machineryType === 'owned' ? 0.95 : 1.03; // 5% savings for owned, 3% premium for rented
}

/**
 * Apply all project settings to calculate final price
 * This applies after finding the best supplier base price
 */
export function applyProjectSettings(
  basePrice: number,
  projectSettings: ProjectSettings
): number {
  // Start with base price
  let finalPrice = basePrice;
  
  // 1. Apply provincial pricing (already applied in base price)
  // Province is handled separately in getSupplierQuotesWithProvince
  
  // 2. Apply CIDB overhead (compliance, insurance, admin costs)
  const cidbFactor = getCIDBOverheadFactor(projectSettings.cidbGrading || 'GB4');
  finalPrice *= cidbFactor;
  
  // 3. Apply duration factor (project timeline economics)
  const durationFactor = getDurationFactor(projectSettings.duration || '6');
  finalPrice *= durationFactor;
  
  // 4. Apply machinery factor (equipment ownership economics)
  const machineryFactor = getMachineryFactor(projectSettings.machineryType || 'rented');
  finalPrice *= machineryFactor;
  
  // 5. Apply profit margin (contractor's markup)
  const profitMargin = parseFloat(projectSettings.profitMargin || '15') / 100;
  finalPrice *= (1 + profitMargin);
  
  return finalPrice;
}

/**
 * Apply unit conversion if needed
 */
function convertUnit(price: number, fromUnit: string, toUnit: string, quantity: number): number {
  // Normalize units
  const normalizeUnit = (unit: string) => unit.toLowerCase().trim();
  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);
  
  // If units match, no conversion needed
  if (from === to) {
    return price * quantity;
  }
  
  // Handle common conversions
  // Add more conversion rules as needed
  const conversions: { [key: string]: { [key: string]: number } } = {
    'bag': { 'bags': 1, 'bag': 1 },
    
    // WEIGHT CONVERSIONS - Enhanced for kg, MT, and tons
    'ton': { 
      'ton': 1, 
      'tons': 1, 
      'tonne': 1, 
      'tonnes': 1, 
      't': 1,
      'mt': 1,           // ✅ Metric ton
      'metric ton': 1,
      'metric tons': 1
    },
    'kg': {
      'kg': 1,
      'kgs': 1,          // ✅ kg variation
      'kilogram': 1,     // ✅ kg variation
      'kilograms': 1,    // ✅ kg variation
      't': 1000,         // 1 ton = 1000 kg
      'ton': 1000,
      'tonne': 1000,
      'mt': 1000         // 1 metric ton = 1000 kg
    },
    
    // VOLUME/CAPACITY CONVERSIONS - New!
    'liter': {
      'liter': 1,
      'litre': 1,        // ✅ UK spelling
      'l': 1,            // ✅ Common abbreviation
      'ltr': 1,          // ✅ Alternative abbreviation
      'liters': 1,
      'litres': 1,
      'ml': 0.001,       // ✅ 1000 ml = 1 liter
      'milliliter': 0.001,
      'millilitre': 0.001,
      'milliliters': 0.001,
      'millilitres': 0.001,
      'kl': 1000,        // ✅ 1 kiloliter = 1000 liters
      'kiloliter': 1000,
      'kilolitre': 1000,
      'kiloliters': 1000,
      'kilolitres': 1000
    },
    
    // LENGTH CONVERSIONS
    'meter': { 'meters': 1, 'metre': 1, 'metres': 1, 'm': 1, 'meter': 1 },
    
    // UNIT/QUANTITY CONVERSIONS
    'unit': { 'units': 1, 'ea': 1, 'each': 1, 'unit': 1 },
    
    // VOLUME CONVERSIONS
    'm3': { 'm³': 1, 'cubicmeter': 1, 'cubic meter': 1, 'm3': 1 },
    
    // AREA CONVERSIONS - Enhanced for hectares
    'm2': { 
      'm²': 1,
      'm2': 1,
      'sqm': 1,
      'squaremeter': 1, 
      'square meter': 1,
      'square metre': 1,
      'ha': 10000,         // ✅ 1 hectare = 10,000 m²
      'hectare': 10000,
      'hectares': 10000
    },
  };
  
  // Try to find conversion
  for (const [baseUnit, equivalents] of Object.entries(conversions)) {
    if (from in equivalents && to in equivalents) {
      return price * quantity * (equivalents[from] / equivalents[to]);
    }
    if (baseUnit === from && to in equivalents) {
      return price * quantity * (1 / equivalents[to]);
    }
    if (baseUnit === to && from in equivalents) {
      return price * quantity * equivalents[from];
    }
  }
  
  // If no conversion found, return price as-is
  return price * quantity;
}

/**
 * Get price quotes from all suppliers with provincial pricing adjustment
 */
function getSupplierQuotesWithProvince(item: BillItem, matchedItems: SupplierPrice[], provinceCode: string): SupplierQuote[] {
  const quotes: SupplierQuote[] = [];
  const suppliers = getAllSuppliers();
  
  // Normalize quantity for special unit types
  let quantity = parseFloat(item.quantity) || 1;
  const unitLower = item.unit.toLowerCase().trim();
  const isLumpSum = unitLower === 'lump sum' || unitLower === 'lumpsum' || unitLower === 'ls' || unitLower === 'sum';
  const isPCSum = unitLower.includes('prime cost') || unitLower.includes('pc sum') || unitLower === 'pc';
  const isProvisionalSum = unitLower.includes('provisional sum') || unitLower === 'provisional sum';
  const isRateOnly = item.isRateOnly === true;
  
  // For lump sum, PC sum, and provisional sum, always use quantity of 1
  if (isLumpSum || isPCSum || isProvisionalSum) {
    quantity = 1;
  }
  
  for (const supplier of suppliers) {
    // Find the best match from this supplier (case-insensitive comparison)
    const supplierMatch = matchedItems.find(m => m.supplier.toUpperCase() === supplier.toUpperCase());
    
    if (supplierMatch && supplierMatch.available) {
      // Apply provincial pricing to unit price
      const provincialUnitPrice = calculateProvincialPrice(supplierMatch.unitPrice, provinceCode);
      
      let totalPrice: number;
      
      // For "Rate Only" items, total price = unit price (no multiplication)
      if (isRateOnly) {
        totalPrice = provincialUnitPrice;
      }
      // For provisional sum, use a value > 20000 regardless of quantity
      else if (isProvisionalSum) {
        totalPrice = provincialUnitPrice;
      }
      // ✅ FOR PC SUM: Add 10% contractor handling margin
      else if (isPCSum) {
        const pcMargin = 0.10; // 10% contractor handling fee
        totalPrice = provincialUnitPrice * (1 + pcMargin);
        console.log(`     💰 PC Sum: Base=${provincialUnitPrice.toFixed(2)}, Margin=10%, Total=${totalPrice.toFixed(2)}`);
      }
      else {
        totalPrice = convertUnit(
          provincialUnitPrice,
          supplierMatch.unit,
          item.unit || supplierMatch.unit,
          quantity
        );
      }
      
      quotes.push({
        supplier: supplierMatch.supplier,
        unitPrice: provincialUnitPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
        available: true,
        province: provinceCode,
        matchType: supplierMatch.itemName.toLowerCase() === item.name.toLowerCase() ? 'exact' : 'keyword',
        buildAidRef: supplierMatch.buildAidRef, // Copy BuildAid reference from supplier catalog
        sansCode: supplierMatch.sansCode, // Copy SANS code from supplier catalog
      });
      
      console.log(`     💵 ${supplierMatch.supplier}: Unit=${provincialUnitPrice.toFixed(2)}, Qty=${quantity}, Total=${totalPrice.toFixed(2)}`);
    } else {
      // Supplier doesn't have this item
      quotes.push({
        supplier,
        unitPrice: '0',
        totalPrice: '0',
        available: false,
        province: provinceCode,
      });
    }
  }
  
  return quotes;
}

/**
 * Select the best supplier (lowest price among available suppliers)
 */
function selectBestSupplier(quotes: SupplierQuote[]): SupplierQuote | null {
  const availableQuotes = quotes.filter(q => q.available);
  
  if (availableQuotes.length === 0) {
    return null;
  }
  
  // Sort by total price (ascending) and return the cheapest
  return availableQuotes.sort((a, b) => 
    parseFloat(a.totalPrice) - parseFloat(b.totalPrice)
  )[0];
}

/**
 * Main pricing engine function
 * Processes an unpriced bill and returns a fully priced bill with supplier comparisons
 * Now searches across ALL 9 SA provinces to find the absolute best price
 */
export function priceBill(unpricedItems: BillItem[], projectSettings?: ProjectSettings): PricedBillItem[] {
  const pricedItems: PricedBillItem[] = [];
  const allProvinces = ['GP', 'WC', 'KZN', 'EC', 'FS', 'MP', 'NW', 'LP', 'NC']; // All SA provinces
  
  console.log(`🔍 Pricing ${unpricedItems.length} items across ALL 9 South African provinces...`);
  
  for (const item of unpricedItems) {
    console.log(`\n📦 Pricing item: "${item.name}" (${item.quantity} ${item.unit})${item.isRateOnly ? ' [RATE ONLY]' : ''}`);
    
    // Check if this is a summary row FIRST before any other processing
    const itemNameLower = item.name.toLowerCase().trim();
    const isSummaryRow = itemNameLower.includes('total carried forward to summary') || 
                         itemNameLower.includes('total carried to summary') ||
                         itemNameLower.includes('carried forward to summary');
    
    if (isSummaryRow) {
      console.log(`  📋 SUMMARY ROW detected - will calculate total after all items are priced`);
      // Add summary row as placeholder - will be calculated in post-processing
      pricedItems.push({
        ...item,
        supplierPrices: [],
        selectedSupplier: 'Summary',
        selectedProvince: undefined,
        unitPrice: '0.00',
        totalPrice: '0.00', // Will be calculated later
      });
      continue; // Skip normal pricing for summary rows
    }
    
    // Normalize quantity for special unit types BEFORE processing
    const unitLower = item.unit.toLowerCase().trim();
    const isLumpSum = unitLower === 'lump sum' || unitLower === 'lumpsum' || unitLower === 'ls' || unitLower === 'sum';
    const isPCSum = unitLower.includes('prime cost') || unitLower.includes('pc sum') || unitLower === 'pc';
    const isProvisionalSum = unitLower.includes('provisional sum') || unitLower === 'provisional sum';
    
    // For lump sum, PC sum, and provisional sum, override quantity to 1
    if (isLumpSum || isPCSum || isProvisionalSum) {
      console.log(`  ℹ️  Unit type "${item.unit}" detected - setting quantity to 1`);
      item.quantity = '1';
    }
    
    // Check if quantity is blank or empty
    const quantityStr = item.quantity?.trim();
    if (!quantityStr || quantityStr === '') {
      console.log('  ⚠️  Skipping: No quantity specified');
      // Keep item in results but with N/A pricing
      pricedItems.push({
        ...item,
        supplierPrices: [],
        selectedSupplier: 'N/A',
        selectedProvince: undefined,
        unitPrice: '0.00',
        totalPrice: '0.00',
      });
      continue;
    }
    
    const quantity = parseFloat(quantityStr) || 0;
    
    // Skip pricing for items with zero quantity UNLESS it's a "Rate Only" item
    if (quantity === 0 && !item.isRateOnly) {
      console.log('  ⚠️  Skipping: Zero quantity');
      pricedItems.push({
        ...item,
        supplierPrices: [],
        selectedSupplier: 'N/A',
        selectedProvince: undefined,
        unitPrice: '0.00',
        totalPrice: '0.00',
      });
      continue;
    }
    
    // Step 1: Search for item across all supplier catalogs using DESCRIPTION
    console.log(`  🔎 Searching supplier catalogs for: "${item.name}"`);
    const matchedItems = searchSupplierCatalogs(item);
    console.log(`  ✓ Found ${matchedItems.length} potential matches across suppliers`);
    
    // Step 2: Get quotes from all suppliers across all provinces
    let bestQuote: SupplierQuote | null = null;
    let bestProvince = 'GP';
    let bestTotalPrice = Infinity;
    
    console.log(`  💰 Comparing prices across all 9 provinces...`);
    
    // Search across all provinces to find the best price
    for (const province of allProvinces) {
      const provincialQuotes = getSupplierQuotesWithProvince(item, matchedItems, province);
      const bestProvinceQuote = selectBestSupplier(provincialQuotes);
      
      if (bestProvinceQuote) {
        const totalPrice = parseFloat(bestProvinceQuote.totalPrice);
        console.log(`     ${province}: R${totalPrice.toFixed(2)} (${bestProvinceQuote.supplier})`);
        if (totalPrice < bestTotalPrice) {
          bestTotalPrice = totalPrice;
          bestQuote = bestProvinceQuote;
          bestProvince = province;
        }
      }
    }
    
    // Step 3: Get quotes for display (using best province)
    const supplierQuotes = getSupplierQuotesWithProvince(item, matchedItems, bestProvince);
    
    if (bestQuote) {
      console.log(`  ✅ BEST PRICE: ${bestQuote.supplier} in ${bestProvince} @ R${bestQuote.totalPrice}`);
      // Item found and priced
      pricedItems.push({
        ...item,
        supplierPrices: supplierQuotes,
        selectedSupplier: bestQuote.supplier,
        selectedProvince: bestProvince,
        unitPrice: bestQuote.unitPrice,
        totalPrice: bestQuote.totalPrice,
      });
    } else {
      console.log(`  ❌ NOT AVAILABLE: No supplier has this item`);
      // Item not found in any supplier catalog
      pricedItems.push({
        ...item,
        supplierPrices: supplierQuotes,
        selectedSupplier: 'Not Available',
        selectedProvince: undefined,
        unitPrice: '0.00',
        totalPrice: '0.00',
      });
    }
  }
  
  // Step 4: Post-process to handle "TOTAL CARRIED FORWARD TO SUMMARY" items
  for (let i = 0; i < pricedItems.length; i++) {
    const item = pricedItems[i];
    const itemNameLower = item.name.toLowerCase().trim();
    
    // Check if this is a summary/total row
    if (itemNameLower.includes('total carried forward to summary') || 
        itemNameLower.includes('total carried to summary') ||
        itemNameLower.includes('carried forward to summary')) {
      
      // Extract the base code (e.g., "C1.2" from "C1.2")
      const baseCode = item.code.trim();
      
      if (baseCode) {
        // Find all items that start with this base code followed by a dot
        const relatedItems = pricedItems.filter(pItem => {
          const pCode = pItem.code.trim();
          return pCode !== baseCode && pCode.startsWith(baseCode + '.');
        });
        
        // Calculate sum of all related items
        let totalSum = 0;
        relatedItems.forEach(relatedItem => {
          const amount = parseFloat(relatedItem.totalPrice) || 0;
          if (amount > 0) {
            totalSum += amount;
          }
        });
        
        // Update the summary item
        pricedItems[i] = {
          ...item,
          quantity: '', // Blank quantity
          unit: '', // Blank unit
          unitPrice: '0.00', // Blank rate
          totalPrice: totalSum.toFixed(2),
          selectedSupplier: 'Summary',
          supplierPrices: [],
        };
      }
    }
  }
  
  // Step 5: Post-process to handle percentage (%) items
  console.log(`\n📊 Processing percentage-based items...`);
  for (let i = 0; i < pricedItems.length; i++) {
    const item = pricedItems[i];
    const unitLower = item.unit.toLowerCase().trim();
    
    // Check if this is a percentage item
    if (unitLower === '%' || unitLower === 'percentage' || unitLower === 'percent') {
      console.log(`  📍 Found percentage item: \"${item.name}\" (Code: ${item.code})`);
      
      // Extract referenced item code from description
      const referencedCode = extractItemReference(item.name);
      
      if (referencedCode) {
        console.log(`  🔍 Looking for referenced item with code: \"${referencedCode}\"`);
        const referencedItem = findItemByCode(referencedCode, pricedItems);
        
        if (referencedItem && referencedItem.totalPrice) {
          const referencedTotal = parseFloat(referencedItem.totalPrice);
          console.log(`  ✅ Found referenced item \"${referencedCode}\" with total: R${referencedTotal.toFixed(2)}`);
          
          // Calculate 1% of the referenced item's total amount
          const onePercentRate = referencedTotal * 0.01;
          const quantity = parseFloat(item.quantity) || 1;
          const totalAmount = onePercentRate * quantity;
          
          console.log(`  💰 Calculated rate (1% of R${referencedTotal.toFixed(2)}): R${onePercentRate.toFixed(2)}`);
          console.log(`  💰 Total (R${onePercentRate.toFixed(2)} × ${quantity}%): R${totalAmount.toFixed(2)}`);
          
          // Update the percentage item with calculated values
          pricedItems[i] = {
            ...item,
            unitPrice: onePercentRate.toFixed(2),
            totalPrice: totalAmount.toFixed(2),
            selectedSupplier: 'Calculated (% of ' + referencedCode + ')',
            supplierPrices: [{
              supplier: 'Calculated',
              unitPrice: onePercentRate.toFixed(2),
              totalPrice: totalAmount.toFixed(2),
              available: true,
              matchType: 'exact'
            }],
          };
          
          console.log(`  ✅ Updated percentage item with calculated pricing`);
        } else {
          console.log(`  ⚠️  Referenced item \"${referencedCode}\" not found or has no price`);
        }
      } else {
        console.log(`  ⚠️  Could not extract item reference from description: \"${item.name}\"`);
      }
    }
  }
  
  return pricedItems;
}

/**
 * Main pricing engine function with provincial pricing
 * Processes an unpriced bill and returns a fully priced bill with provincial adjustments
 */
export function priceBillWithProvince(unpricedItems: BillItem[], provinceCode: string = 'GP'): PricedBillItem[] {
  const pricedItems: PricedBillItem[] = [];
  const province = getProvinceByCode(provinceCode);
  const provincialFactor = province?.factor || 1.0;
  
  for (const item of unpricedItems) {
    // Check if this is a summary row FIRST before any other processing
    const itemNameLower = item.name.toLowerCase().trim();
    const isSummaryRow = itemNameLower.includes('total carried forward to summary') || 
                         itemNameLower.includes('total carried to summary') ||
                         itemNameLower.includes('carried forward to summary');
    
    if (isSummaryRow) {
      // Add summary row as placeholder - will be calculated in post-processing
      pricedItems.push({
        ...item,
        supplierPrices: [],
        selectedSupplier: 'Summary',
        selectedProvince: undefined,
        unitPrice: '0.00',
        totalPrice: '0.00', // Will be calculated later
      });
      continue; // Skip normal pricing for summary rows
    }
    
    // Normalize quantity for special unit types BEFORE processing
    const unitLower = item.unit.toLowerCase().trim();
    const isLumpSum = unitLower === 'lump sum' || unitLower === 'lumpsum' || unitLower === 'ls' || unitLower === 'sum';
    const isPCSum = unitLower.includes('prime cost') || unitLower.includes('pc sum') || unitLower === 'pc';
    const isProvisionalSum = unitLower.includes('provisional sum') || unitLower === 'provisional sum';
    
    // For lump sum, PC sum, and provisional sum, override quantity to 1
    if (isLumpSum || isPCSum || isProvisionalSum) {
      item.quantity = '1';
    }
    
    // Check if quantity is blank or empty
    const quantityStr = item.quantity?.trim();
    if (!quantityStr || quantityStr === '') {
      // Keep item in results but with N/A pricing
      pricedItems.push({
        ...item,
        supplierPrices: [],
        selectedSupplier: 'N/A',
        unitPrice: '0.00',
        totalPrice: '0.00',
      });
      continue;
    }
    
    const quantity = parseFloat(quantityStr) || 0;
    
    // Skip pricing for items with zero quantity
    if (quantity === 0) {
      pricedItems.push({
        ...item,
        supplierPrices: [],
        selectedSupplier: 'N/A',
        unitPrice: '0.00',
        totalPrice: '0.00',
      });
      continue;
    }
    
    // Step 1: Search for item across all supplier catalogs
    const matchedItems = searchSupplierCatalogs(item);
    
    // Step 2: Get quotes from all suppliers with provincial adjustment
    const supplierQuotes = getSupplierQuotesWithProvince(item, matchedItems, provinceCode);
    
    // Step 3: Select the best supplier (lowest price)
    const bestQuote = selectBestSupplier(supplierQuotes);
    
    if (bestQuote) {
      // Item found and priced
      pricedItems.push({
        ...item,
        supplierPrices: supplierQuotes,
        selectedSupplier: bestQuote.supplier,
        selectedProvince: provinceCode, // Add province information
        unitPrice: bestQuote.unitPrice,
        totalPrice: bestQuote.totalPrice,
        // Use user-entered BuildAid/SANS codes if available, otherwise use from supplier catalog
        buildAidRef: item.buildAidRef || bestQuote.buildAidRef,
        sansCode: item.sansCode || bestQuote.sansCode,
      });
    } else {
      // Item not found in any supplier catalog
      pricedItems.push({
        ...item,
        supplierPrices: supplierQuotes,
        selectedSupplier: 'Not Available',
        unitPrice: '0.00',
        totalPrice: '0.00',
      });
    }
  }
  
  // Step 4: Post-process to handle "TOTAL CARRIED FORWARD TO SUMMARY" items
  for (let i = 0; i < pricedItems.length; i++) {
    const item = pricedItems[i];
    const itemNameLower = item.name.toLowerCase().trim();
    
    // Check if this is a summary/total row
    if (itemNameLower.includes('total carried forward to summary') || 
        itemNameLower.includes('total carried to summary') ||
        itemNameLower.includes('carried forward to summary')) {
      
      // Extract the base code (e.g., "C1.2" from "C1.2")
      const baseCode = item.code.trim();
      
      if (baseCode) {
        // Find all items that start with this base code followed by a dot
        const relatedItems = pricedItems.filter(pItem => {
          const pCode = pItem.code.trim();
          return pCode !== baseCode && pCode.startsWith(baseCode + '.');
        });
        
        // Calculate sum of all related items
        let totalSum = 0;
        relatedItems.forEach(relatedItem => {
          const amount = parseFloat(relatedItem.totalPrice) || 0;
          if (amount > 0) {
            totalSum += amount;
          }
        });
        
        // Update the summary item
        pricedItems[i] = {
          ...item,
          quantity: '', // Blank quantity
          unit: '', // Blank unit
          unitPrice: '0.00', // Blank rate
          totalPrice: totalSum.toFixed(2),
          selectedSupplier: 'Summary',
          supplierPrices: [],
        };
      }
    }
  }
  
  return pricedItems;
}

/**
 * Calculate the overall total for a priced bill
 * Sums only the summary row totals (items with "TOTAL CARRIED FORWARD TO SUMMARY")
 */
export function calculateBillTotal(pricedItems: PricedBillItem[]): number {
  // Find all summary rows
  const summaryRows = pricedItems.filter(item => {
    const itemNameLower = item.name.toLowerCase().trim();
    return itemNameLower.includes('total carried forward to summary') || 
           itemNameLower.includes('total carried to summary') ||
           itemNameLower.includes('carried forward to summary');
  });
  
  // If there are summary rows, sum only those
  if (summaryRows.length > 0) {
    console.log(`📊 Calculating overall total from ${summaryRows.length} summary rows`);
    const total = summaryRows.reduce((sum, item) => {
      const totalPrice = parseFloat(item.totalPrice || '0');
      console.log(`   + ${item.code} (${item.name}): R${totalPrice.toFixed(2)}`);
      return sum + totalPrice;
    }, 0);
    console.log(`✅ Overall total (sum of summary rows): R${total.toFixed(2)}`);
    
    // DEBUG: Check if we're double-counting
    console.log(`\n🔍 DEBUGGING GRAND TOTAL CALCULATION:`);
    console.log(`   Summary rows found: ${summaryRows.length}`);
    summaryRows.forEach((row, index) => {
      console.log(`   ${index + 1}. Code: ${row.code}, Amount: R${parseFloat(row.totalPrice || '0').toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    });
    console.log(`   TOTAL: R${total.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    
    // Check for hierarchical structure
    const mainSectionCodes = summaryRows.map(r => r.code.trim()).filter(code => {
      // Main sections typically have format like "C1", "C2", "C8" (not "C1.2", "C1.3")
      const parts = code.split('.');
      return parts.length === 1 || (parts.length === 2 && parts[1].length === 1);
    });
    
    if (mainSectionCodes.length > 0 && mainSectionCodes.length < summaryRows.length) {
      console.log(`\n⚠️  WARNING: Detected hierarchical BOQ structure!`);
      console.log(`   Found ${mainSectionCodes.length} main section summaries among ${summaryRows.length} total summary rows`);
      console.log(`   Main sections: ${mainSectionCodes.join(', ')}`);
      console.log(`   This might indicate double-counting. You should sum only main section totals.`);
    }
    
    return total;
  }
  
  // If there are no summary rows, fall back to summing all regular items
  console.log(`📊 No summary rows found, calculating total from all items`);
  return pricedItems.reduce((sum, item) => {
    // Skip items with blank or zero quantity
    const quantity = item.quantity?.trim();
    if (!quantity || quantity === '' || parseFloat(quantity) === 0) {
      return sum;
    }
    
    // Skip items with "Not Available" supplier
    if (item.selectedSupplier === 'Not Available' || item.selectedSupplier === 'N/A') {
      return sum;
    }
    
    return sum + parseFloat(item.totalPrice || '0');
  }, 0);
}

/**
 * Extract item reference from description (e.g., "C1.2.8.4(a)" from text)
 */
function extractItemReference(description: string): string | null {
  // Match patterns like C1.2.8.4(a), PC1.4.4.17, D10.06(a)(i), etc.
  const match = description.match(/\b([A-Z]+\d+(?:\.\d+)*(?:\([a-z]+\))*(?:\([ivx]+\))?)\b/i);
  return match ? match[1] : null;
}

/**
 * Find an item by its code/itemNo in the priced items list
 */
function findItemByCode(code: string, items: PricedBillItem[]): PricedBillItem | null {
  const normalizedCode = code.trim().toLowerCase();
  return items.find(item => item.code.trim().toLowerCase() === normalizedCode) || null;
}

/**
 * Search for an item in supplier catalogs using Enhanced Matching System
 * Now includes fuzzy matching, synonyms, brand detection, and learning
 */
function searchSupplierCatalogs(item: BillItem): Array<SupplierPrice & { score?: number; matchInfo?: MatchResult }> {
  console.log(`  🔍 Enhanced Search Query: "${item.name}"`);
  console.log(`  📊 Total catalog size: ${allSupplierCatalogs.length} items`);
  
  // Use the enhanced search engine
  const searchResult = enhancedSearchCatalog(
    item.name,
    allSupplierCatalogs,
    item.description
  );
  
  // Convert match results to supplier prices with scores
  const results: Array<SupplierPrice & { score?: number; matchInfo?: MatchResult }> = [];
  
  if (searchResult.topMatch) {
    results.push({
      ...searchResult.topMatch.item,
      score: searchResult.topMatch.score,
      matchInfo: searchResult.topMatch
    });
  }
  
  // Add alternative matches
  for (const altMatch of searchResult.alternativeMatches) {
    results.push({
      ...altMatch.item,
      score: altMatch.score,
      matchInfo: altMatch
    });
  }
  
  if (results.length > 0) {
    const topMatch = results[0];
    console.log(`  ✅ Found ${results.length} matches using enhanced search (Level ${searchResult.searchLevel})`);
    console.log(`  🏆 Top match: "${topMatch.itemName}" from ${topMatch.supplier} (score: ${topMatch.score})`);
    if (topMatch.matchInfo) {
      console.log(`     └─ ${topMatch.matchInfo.confidence} confidence: ${topMatch.matchInfo.reason}`);
    }
  } else {
    console.log(`  ❌ No matches found after all 5 enhanced search levels`);
  }
  
  return results;
}