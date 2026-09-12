/**
 * Regional Price Optimization Engine for Qilly
 * Extends the base pricing engine with location-based supplier selection and transport cost calculations
 */

import { allSupplierCatalogs, getAllSuppliers, type SupplierPrice } from './supplierCatalog';
import { calculateProvincialPrice, getProvinceByCode } from './provincialPricing';
import { enhancedSearchCatalog, type MatchResult } from './matching';
import {
  municipalities,
  getMunicipalityByCode as _getMunicipalityByCode,
  optimizeSupplierSelection,
  type OptimizedSupplierQuote,
  getMaterialType,
  calculateTransportCost
} from './regionalOptimization';
import { matchLaborRate, type LaborPricing, formatLaborPricing } from '@/lib/boq/laborRates';
import { categorizeItem, type ItemCategorization } from './itemCategorization';

// Local reference to ensure the function is included in the bundle
const getMunicipalityByCode = _getMunicipalityByCode || ((code: string) => municipalities.find(m => m.code === code));

export interface ProjectSettings {
  province?: string;
  municipality?: string;
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
  isRateOnly?: boolean;
  buildAidRef?: string; // BuildAid 2025/2026 reference
  sansCode?: string; // SANS 1200 standard code
}

export interface RegionalSupplierQuote {
  supplier: string;
  branchName: string;
  baseUnitPrice: string;
  distance: number;
  transportCost: string;
  transportCostPerUnit: string;
  landedUnitPrice: string;
  totalLandedCost: string;
  available: boolean;
  isRegionalBest: boolean;
  isNationalBest: boolean;
  savingsVsNationalBest?: string;
  materialType: 'bulk' | 'standard' | 'lightweight';
  province?: string;
  matchType?: 'exact' | 'keyword';
  buildAidRef?: string; // BuildAid 2025/2026 reference from supplier catalog
  sansCode?: string; // SANS 1200 standard code from supplier catalog
}

export interface RegionalPricedBillItem extends BillItem {
  supplierPrices: RegionalSupplierQuote[];
  selectedSupplier: string;
  selectedProvince?: string;
  selectedMunicipality?: string;
  selectedBranchName?: string;
  baseUnitPrice: string;
  transportCost: string;
  transportCostPerUnit: string;
  landedUnitPrice: string;
  additionalFees: string;
  additionalFeesBreakdown?: {
    cidbOverhead: number;
    durationAdjustment: number;
    machineryAdjustment: number;
    profitMargin: number;
    totalAdditional: number;
    totalAdditionalAmount: number;
  };
  finalUnitPrice: string;
  totalPrice: string;
  distance?: number;
  savingsVsDistantSupplier?: string;
  // LABOR & EQUIPMENT PRICING
  laborRate?: string;
  laborTotal?: string;
  equipmentRate?: string;
  equipmentTotal?: string;
  laborMatched?: boolean;
  laborConfidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  laborDescription?: string;
  laborTradeCategory?: string;
  buildAidRef?: string; // BuildAid 2025/2026 reference (from user or supplier)
  sansCode?: string; // SANS 1200 standard code (from user or supplier)
}

/**
 * Get regional supplier quotes with transport cost optimization
 */
function getRegionalSupplierQuotes(
  item: BillItem,
  matchedItems: SupplierPrice[],
  projectLat: number,
  projectLng: number,
  provinceCode: string
): RegionalSupplierQuote[] {
  const suppliers = getAllSuppliers();
  const quantity = parseFloat(item.quantity) || 1;
  const materialType = getMaterialType(item.name);
  
  // Build supplier quotes with base prices (and BuildAid references)
  const supplierQuotes = suppliers.map(supplier => {
    const supplierMatch = matchedItems.find(m => m.supplier.toUpperCase() === supplier.toUpperCase());

    if (supplierMatch && supplierMatch.available) {
      const basePrice = calculateProvincialPrice(supplierMatch.unitPrice, provinceCode);
      return {
        supplier: supplierMatch.supplier,
        unitPrice: basePrice,
        buildAidRef: supplierMatch.buildAidRef,
        sansCode: supplierMatch.sansCode,
      };
    }

    return null;
  }).filter(q => q !== null) as Array<{ supplier: string; unitPrice: number; buildAidRef?: string; sansCode?: string }>;
  
  // Create a map of supplier → BuildAid/SANS references for lookup after optimization
  const supplierReferences = new Map<string, { buildAidRef?: string; sansCode?: string }>();
  supplierQuotes.forEach(q => {
    supplierReferences.set(q.supplier, {
      buildAidRef: q.buildAidRef,
      sansCode: q.sansCode,
    });
  });

  // Optimize supplier selection based on location and transport costs
  const optimizedQuotes = optimizeSupplierSelection(
    supplierQuotes,
    projectLat,
    projectLng,
    item.name,
    quantity
  );

  // Convert to RegionalSupplierQuote format
  const regionalQuotes: RegionalSupplierQuote[] = optimizedQuotes.map(quote => {
    const refs = supplierReferences.get(quote.supplier);
    return {
      supplier: quote.supplier,
      branchName: quote.branchName,
      baseUnitPrice: quote.baseUnitPrice.toFixed(2),
      distance: quote.distance,
      transportCost: quote.transportCost.toFixed(2),
      transportCostPerUnit: quote.transportCostPerUnit.toFixed(2),
      landedUnitPrice: quote.landedUnitPrice.toFixed(2),
      totalLandedCost: quote.totalLandedCost.toFixed(2),
      available: true,
      isRegionalBest: quote.isRegionalBest,
      isNationalBest: quote.isNationalBest,
      savingsVsNationalBest: quote.savingsVsNationalBest ? quote.savingsVsNationalBest.toFixed(2) : undefined,
      materialType,
      province: provinceCode,
      matchType: 'exact',
      buildAidRef: refs?.buildAidRef, // Add BuildAid reference from supplier catalog
      sansCode: refs?.sansCode, // Add SANS code from supplier catalog
    };
  });
  
  // Add unavailable suppliers
  const availableSuppliers = new Set(regionalQuotes.map(q => q.supplier));
  suppliers.forEach(supplier => {
    if (!availableSuppliers.has(supplier)) {
      regionalQuotes.push({
        supplier,
        branchName: `${supplier} (Not Available)`,
        baseUnitPrice: '0',
        distance: 0,
        transportCost: '0',
        transportCostPerUnit: '0',
        landedUnitPrice: '0',
        totalLandedCost: '0',
        available: false,
        isRegionalBest: false,
        isNationalBest: false,
        materialType,
        province: provinceCode,
        matchType: 'exact',
      });
    }
  });
  
  return regionalQuotes;
}

/**
 * Select the best regional supplier (lowest landed cost including transport)
 */
function selectBestRegionalSupplier(quotes: RegionalSupplierQuote[]): RegionalSupplierQuote | null {
  const availableQuotes = quotes.filter(q => q.available);
  
  if (availableQuotes.length === 0) {
    return null;
  }
  
  // Sort by total landed cost (lowest first)
  availableQuotes.sort((a, b) => parseFloat(a.totalLandedCost) - parseFloat(b.totalLandedCost));
  
  return availableQuotes[0];
}

/**
 * Apply project settings (CIDB, duration, machinery, profit)
 */
function applyProjectSettings(
  basePrice: number,
  projectSettings: ProjectSettings
): { finalPrice: number; additionalFeesBreakdown: any } {
  let currentPrice = basePrice;
  
  const breakdown = {
    cidbOverhead: 0,
    durationAdjustment: 0,
    machineryAdjustment: 0,
    profitMargin: 0,
    totalAdditional: 0,
    totalAdditionalAmount: 0,
  };
  
  // 1. CIDB overhead factor
  const cidbFactors: { [key: string]: number } = {
    'GB1': 1.02, 'GB2': 1.03, 'GB3': 1.04, 'GB4': 1.05,
    'GB5': 1.06, 'GB6': 1.07, 'GB7': 1.08, 'GB8': 1.09, 'GB9': 1.10,
  };
  const cidbFactor = cidbFactors[projectSettings.cidbGrading || 'GB4'] || 1.05;
  const cidbAmount = currentPrice * (cidbFactor - 1);
  breakdown.cidbOverhead = cidbAmount;
  currentPrice *= cidbFactor;
  
  // 2. Duration factor
  const duration = parseInt(projectSettings.duration || '6');
  let durationFactor = 1.00;
  if (duration <= 1) durationFactor = 1.05;
  else if (duration <= 3) durationFactor = 1.02;
  else if (duration <= 12) durationFactor = 1.00;
  else if (duration <= 18) durationFactor = 0.99;
  else if (duration <= 24) durationFactor = 0.98;
  else durationFactor = 0.97;
  const durationAmount = currentPrice * (durationFactor - 1);
  breakdown.durationAdjustment = durationAmount;
  currentPrice *= durationFactor;
  
  // 3. Machinery factor
  const machineryFactor = projectSettings.machineryType === 'owned' ? 0.95 : 1.03;
  const machineryAmount = currentPrice * (machineryFactor - 1);
  breakdown.machineryAdjustment = machineryAmount;
  currentPrice *= machineryFactor;
  
  // 4. Profit margin
  const profitMarginPercent = parseFloat(projectSettings.profitMargin || '15') / 100;
  const profitAmount = currentPrice * profitMarginPercent;
  breakdown.profitMargin = profitAmount;
  currentPrice *= (1 + profitMarginPercent);
  
  // Calculate totals
  breakdown.totalAdditionalAmount = currentPrice - basePrice;
  breakdown.totalAdditional = ((currentPrice - basePrice) / basePrice) * 100;
  
  return {
    finalPrice: currentPrice,
    additionalFeesBreakdown: breakdown
  };
}

/**
 * Main regional pricing engine
 * Prices a bill of quantities with regional optimization and transport cost calculations
 */
export async function priceRegionalBill(
  unpricedItems: BillItem[],
  projectSettings?: ProjectSettings
): Promise<RegionalPricedBillItem[]> {
  const province = projectSettings?.province || 'GP';
  const municipalityCode = projectSettings?.municipality || 'JHB';
  
  // Get project location coordinates
  const municipality = getMunicipalityByCode(municipalityCode);
  if (!municipality) {
    console.error(`Municipality ${municipalityCode} not found, using default (JHB)`);
  }
  const projectLat = municipality?.lat || -26.2041;
  const projectLng = municipality?.lng || 28.0473;
  
  console.log(`\n🌍 Regional Pricing Engine Started`);
  console.log(`📍 Project Location: ${municipality?.name || 'Johannesburg'}, ${province}`);
  console.log(`📌 Coordinates: ${projectLat}, ${projectLng}`);
  console.log(`📦 Processing ${unpricedItems.length} items...\n`);
  
  const pricedItems: RegionalPricedBillItem[] = [];
  
  for (const item of unpricedItems) {
    console.log(`\n🔍 Pricing: "${item.name}" (${item.quantity} ${item.unit})`);
    
    // Check for summary rows (with null safety)
    const isSummaryRow = item.name && (
      item.name.toLowerCase().includes('total carried forward to summary') ||
      item.name.toLowerCase().includes('total carried to summary') ||
      item.name.toLowerCase().includes('carried forward to summary')
    );
    
    if (isSummaryRow) {
      console.log(`   ⚠️  SUMMARY ROW DETECTED - Adding with zero prices`);
      pricedItems.push({
        ...item,
        supplierPrices: [],
        selectedSupplier: 'N/A',
        baseUnitPrice: '0',
        transportCost: '0',
        transportCostPerUnit: '0',
        landedUnitPrice: '0',
        additionalFees: '0',
        finalUnitPrice: '0',
        totalPrice: '0',
      });
      continue;
    }
    
    // Skip items with missing required fields
    if (!item.name || !item.unit || !item.quantity) {
      console.log(`   ⚠️  SKIPPING - Missing required fields (name: ${item.name}, unit: ${item.unit}, quantity: ${item.quantity})`);
      pricedItems.push({
        ...item,
        name: item.name || 'Unknown Item',
        unit: item.unit || 'unit',
        quantity: item.quantity || '0',
        supplierPrices: [],
        selectedSupplier: 'Not Available',
        baseUnitPrice: '0',
        transportCost: '0',
        transportCostPerUnit: '0',
        landedUnitPrice: '0',
        additionalFees: '0',
        finalUnitPrice: '0',
        totalPrice: '0',
      });
      continue;
    }
    
    // ============================================================================
    // CATEGORIZE ITEM FIRST - Determine pricing method
    // ============================================================================
    const categorization = categorizeItem(item.code || '', item.name, item.unit);
    console.log(`   📊 Category: ${categorization.category}`);
    console.log(`   ℹ️  ${categorization.reason}`);
    console.log(`   ✓ Supplier: ${categorization.hasSupplier ? 'YES' : 'NO'}`);
    console.log(`   ✓ Transport: ${categorization.hasTransport ? 'YES' : 'NO'}`);
    console.log(`   ✓ Labor: ${categorization.hasLaborComponent ? 'YES' : 'NO'}`);
    console.log(`   ✓ Equipment: ${categorization.hasEquipmentComponent ? 'YES' : 'NO'}`);
    
    // ============================================================================
    // EARTHWORKS / P&G / LABOR-ONLY: Skip supplier search entirely!
    // ============================================================================
    if (!categorization.hasSupplier) {
      console.log(`   🚫 NO SUPPLIER SEARCH - Using labor/equipment rates only`);
      
      // Get labor and equipment pricing
      const quantity = parseFloat(item.quantity) || 1;
      const laborPricing: LaborPricing = await matchLaborRate(item.name, item.unit, quantity);
      
      if (laborPricing.matched) {
        const laborRate = laborPricing.laborRate;
        const equipmentRate = laborPricing.equipmentRate;
        const totalRate = laborPricing.totalRate;
        const totalCost = totalRate * quantity;
        
        console.log(`   ✅ Labor rate: R${laborRate.toFixed(2)}/${item.unit}`);
        console.log(`   ✅ Equipment rate: R${equipmentRate.toFixed(2)}/${item.unit}`);
        console.log(`   ✅ Total rate: R${totalRate.toFixed(2)}/${item.unit}`);
        console.log(`   ✅ Total cost: R${totalCost.toFixed(2)}`);
        console.log(`   📋 Matched: \"${laborPricing.matchedDescription}\" (${laborPricing.tradeCategory})`);
        
        // Apply project settings to labor cost
        const { finalPrice: finalTotalPrice, additionalFeesBreakdown } = applyProjectSettings(totalCost, projectSettings || {});
        const finalUnitPrice = finalTotalPrice / quantity;
        const additionalFeesPerUnit = additionalFeesBreakdown.totalAdditionalAmount / quantity;
        
        pricedItems.push({
          ...item,
          supplierPrices: [], // NO SUPPLIERS!
          selectedSupplier: `Labor Rate (${laborPricing.tradeCategory})`,
          selectedProvince: undefined, // NO PROVINCE
          selectedMunicipality: undefined,
          selectedBranchName: undefined,
          baseUnitPrice: totalRate.toFixed(2),
          transportCost: '0', // NO TRANSPORT!
          transportCostPerUnit: '0',
          landedUnitPrice: totalRate.toFixed(2),
          additionalFees: additionalFeesPerUnit.toFixed(2),
          additionalFeesBreakdown,
          finalUnitPrice: finalUnitPrice.toFixed(2),
          totalPrice: finalTotalPrice.toFixed(2),
          distance: undefined, // NO DISTANCE
          savingsVsDistantSupplier: undefined,
          // LABOR & EQUIPMENT PRICING
          laborRate: laborRate.toFixed(2),
          laborTotal: (laborRate * quantity).toFixed(2),
          equipmentRate: equipmentRate.toFixed(2),
          equipmentTotal: (equipmentRate * quantity).toFixed(2),
          laborMatched: true,
          laborConfidence: laborPricing.confidence,
          laborDescription: laborPricing.matchedDescription,
          laborTradeCategory: laborPricing.tradeCategory,
        });
        continue; // SKIP supplier search entirely
      } else {
        // No labor match found - use default
        console.log(`   ⚠️  No labor rate found - using default`);
        const defaultRate = 200; // R200/unit default
        const totalCost = defaultRate * quantity;
        
        const { finalPrice: finalTotalPrice, additionalFeesBreakdown } = applyProjectSettings(totalCost, projectSettings || {});
        const finalUnitPrice = finalTotalPrice / quantity;
        const additionalFeesPerUnit = additionalFeesBreakdown.totalAdditionalAmount / quantity;
        
        pricedItems.push({
          ...item,
          supplierPrices: [],
          selectedSupplier: 'Default Labor Rate',
          selectedProvince: undefined,
          selectedMunicipality: undefined,
          selectedBranchName: undefined,
          baseUnitPrice: defaultRate.toFixed(2),
          transportCost: '0',
          transportCostPerUnit: '0',
          landedUnitPrice: defaultRate.toFixed(2),
          additionalFees: additionalFeesPerUnit.toFixed(2),
          additionalFeesBreakdown,
          finalUnitPrice: finalUnitPrice.toFixed(2),
          totalPrice: finalTotalPrice.toFixed(2),
          distance: undefined,
          savingsVsDistantSupplier: undefined,
          laborRate: defaultRate.toFixed(2),
          laborTotal: totalCost.toFixed(2),
          equipmentRate: '0',
          equipmentTotal: '0',
          laborMatched: false,
          laborConfidence: 'LOW',
          laborDescription: 'Default rate',
          laborTradeCategory: categorization.category,
        });
        continue; // SKIP supplier search
      }
    }
    
    // ============================================================================
    // SPECIAL ITEMS: Provisional Sums, Prime Cost Sums, Lump Sums, Percentages
    // ============================================================================
    if (categorization.category === 'SPECIAL') {
      console.log(`   💎 SPECIAL ITEM DETECTED - Using special pricing logic`);
      
      // Determine the special type
      const unitLower = item.unit.toLowerCase().trim();
      const descLower = item.name.toLowerCase();
      
      const isProvisionalSum = unitLower.includes('provisional sum') || 
                              unitLower === 'p/s' || 
                              unitLower === 'prov sum' ||
                              descLower.includes('provisional sum');
      
      const isPCSum = unitLower.includes('prime cost') || 
                     unitLower.includes('pc sum') || 
                     unitLower === 'pc' ||
                     descLower.includes('prime cost') ||
                     descLower.includes('pc sum');
      
      const isPercentage = unitLower === '%' || 
                          unitLower.includes('percent');
      
      const isLumpSum = unitLower === 'lump sum' || 
                       unitLower === 'lumpsum' || 
                       unitLower === 'ls' || 
                       unitLower === 'l/s' ||
                       unitLower === 'sum';
      
      // Search for supplier match to get base price
      const searchResult = enhancedSearchCatalog(item.name, allSupplierCatalogs, item.description);
      
      if (!searchResult.topMatch) {
        console.log(`   ⚠️  No catalog match found for special item - using fallback`);
        // For special items without matches, use a reasonable default
        const defaultPrice = 50000; // R50,000 default for provisional/PC sums
        
        pricedItems.push({
          ...item,
          supplierPrices: [],
          selectedSupplier: 'Not Available',
          baseUnitPrice: defaultPrice.toFixed(2),
          transportCost: '0',
          transportCostPerUnit: '0',
          landedUnitPrice: defaultPrice.toFixed(2),
          additionalFees: '0',
          finalUnitPrice: defaultPrice.toFixed(2),
          totalPrice: defaultPrice.toFixed(2),
        });
        continue;
      }
      
      // Get base price from matched catalog item
      const catalogPrice = calculateProvincialPrice(searchResult.topMatch.item.unitPrice, province);
      
      // For special items, quantity is ALWAYS 1
      const quantity = 1;
      
      let finalBasePrice = catalogPrice;
      let specialHandling = '';
      
      if (isProvisionalSum) {
        // PROVISIONAL SUM: Use catalog price directly (no contractor markup)
        finalBasePrice = catalogPrice;
        specialHandling = 'Provisional Sum (Direct Price)';
        console.log(`   📦 Provisional Sum: R${catalogPrice.toFixed(2)} (direct from catalog)`);
        
      } else if (isPCSum) {
        // PRIME COST SUM: Add 10-15% contractor handling/profit margin
        const pcMargin = 0.125; // 12.5% handling fee for PC items
        finalBasePrice = catalogPrice * (1 + pcMargin);
        specialHandling = 'Prime Cost Sum (+12.5% handling)';
        console.log(`   💰 PC Sum: Base=R${catalogPrice.toFixed(2)}, Margin=12.5%, Final=R${finalBasePrice.toFixed(2)}`);
        
      } else if (isPercentage) {
        // PERCENTAGE: Calculate as percentage of the base value
        // The catalog price should already represent the percentage value
        finalBasePrice = catalogPrice;
        specialHandling = 'Percentage-based Item';
        console.log(`   📊 Percentage Item: ${catalogPrice.toFixed(2)}%`);
        
      } else if (isLumpSum) {
        // LUMP SUM: Use catalog price with minor overhead
        const lsMargin = 0.05; // 5% overhead for lump sum coordination
        finalBasePrice = catalogPrice * (1 + lsMargin);
        specialHandling = 'Lump Sum (+5% overhead)';
        console.log(`   📋 Lump Sum: Base=R${catalogPrice.toFixed(2)}, Overhead=5%, Final=R${finalBasePrice.toFixed(2)}`);
      }
      
      // NO project settings applied to special items (they're already finalized)
      // Special items don't get CIDB, duration, machinery, or profit margin adjustments
      
      pricedItems.push({
        ...item,
        quantity: quantity.toString(), // Override to 1
        supplierPrices: [], // Special items don't have supplier comparison
        selectedSupplier: searchResult.topMatch.item.supplier,
        selectedProvince: province,
        selectedMunicipality: undefined,
        selectedBranchName: specialHandling,
        baseUnitPrice: catalogPrice.toFixed(2),
        transportCost: '0', // No transport for special items
        transportCostPerUnit: '0',
        landedUnitPrice: catalogPrice.toFixed(2),
        additionalFees: (finalBasePrice - catalogPrice).toFixed(2),
        additionalFeesBreakdown: {
          cidbOverhead: 0,
          durationAdjustment: 0,
          machineryAdjustment: 0,
          profitMargin: finalBasePrice - catalogPrice,
          totalAdditional: ((finalBasePrice - catalogPrice) / catalogPrice) * 100,
          totalAdditionalAmount: finalBasePrice - catalogPrice,
        },
        finalUnitPrice: finalBasePrice.toFixed(2),
        totalPrice: finalBasePrice.toFixed(2),
        distance: undefined,
        savingsVsDistantSupplier: undefined,
      });
      continue; // SKIP regular supplier search
    }
    
    // ============================================================================
    // MATERIALS / MIXED: Continue with supplier search
    // ============================================================================
    console.log(`   🔍 Searching for suppliers (material item)...`);
    
    // Search for matches using enhanced matching system
    const searchResult = enhancedSearchCatalog(item.name, allSupplierCatalogs, item.description);
    
    // Extract all matches from the search result
    const matchResults: MatchResult[] = [];
    if (searchResult.topMatch) {
      matchResults.push(searchResult.topMatch);
    }
    if (searchResult.alternativeMatches && searchResult.alternativeMatches.length > 0) {
      matchResults.push(...searchResult.alternativeMatches);
    }
    
    if (matchResults.length === 0) {
      console.log(`   ❌ No matches found`);
      pricedItems.push({
        ...item,
        supplierPrices: [],
        selectedSupplier: 'Not Available',
        baseUnitPrice: '0',
        transportCost: '0',
        transportCostPerUnit: '0',
        landedUnitPrice: '0',
        additionalFees: '0',
        finalUnitPrice: '0',
        totalPrice: '0',
      });
      continue;
    }
    
    console.log(`   ✅ Found ${matchResults.length} supplier matches`);
    
    // Get regional quotes with transport optimization
    const regionalQuotes = getRegionalSupplierQuotes(
      item,
      matchResults.map(r => r.item),
      projectLat,
      projectLng,
      province
    );
    
    // Select best supplier
    const bestQuote = selectBestRegionalSupplier(regionalQuotes);
    
    if (!bestQuote) {
      console.log(`   ❌ No available suppliers`);
      pricedItems.push({
        ...item,
        supplierPrices: regionalQuotes,
        selectedSupplier: 'Not Available',
        baseUnitPrice: '0',
        transportCost: '0',
        transportCostPerUnit: '0',
        landedUnitPrice: '0',
        additionalFees: '0',
        finalUnitPrice: '0',
        totalPrice: '0',
      });
      continue;
    }
    
    // Apply project settings to get final price
    const quantity = parseFloat(item.quantity) || 1;
    const totalLandedCost = parseFloat(bestQuote.totalLandedCost);
    const landedUnitPrice = parseFloat(bestQuote.landedUnitPrice);
    
    // Check if unit is square meter and adjust calculation
    const isSquareMeter = /^(m[²2]|sqm|sq\s*m|square\s*meter|square\s*metre)$/i.test(item.unit.trim());
    
    let adjustedTotalLandedCost = totalLandedCost;
    if (isSquareMeter && quantity > 0) {
      const adjustedUnitPrice = landedUnitPrice / quantity;
      adjustedTotalLandedCost = adjustedUnitPrice * quantity;
      console.log(`   📐 SQUARE METER DETECTED: Adjusted unit price from R${landedUnitPrice} to R${adjustedUnitPrice.toFixed(2)}`);
    }
    
    const { finalPrice: finalTotalPrice, additionalFeesBreakdown } = applyProjectSettings(adjustedTotalLandedCost, projectSettings || {});
    const finalUnitPrice = quantity > 0 ? finalTotalPrice / quantity : finalTotalPrice;
    const additionalFeesPerUnit = quantity > 0 ? additionalFeesBreakdown.totalAdditionalAmount / quantity : additionalFeesBreakdown.totalAdditionalAmount;
    
    console.log(`   🏆 Best Supplier: ${bestQuote.supplier} (${bestQuote.branchName})`);
    console.log(`   📦 Base Price: R${bestQuote.baseUnitPrice}/unit`);
    console.log(`   🚚 Transport: R${bestQuote.transportCost} (${bestQuote.distance}km)`);
    console.log(`   💰 Landed Cost: R${bestQuote.landedUnitPrice}/unit`);
    console.log(`   💵 Additional Fees: R${additionalFeesPerUnit.toFixed(2)}/unit`);
    console.log(`   💵 Final Price: R${finalTotalPrice.toFixed(2)} (incl. all fees)`);
    
    // Calculate total savings
    const totalSavingsForItem = bestQuote.savingsVsNationalBest 
      ? (parseFloat(bestQuote.savingsVsNationalBest) * quantity).toFixed(2)
      : undefined;
    
    if (totalSavingsForItem && parseFloat(totalSavingsForItem) > 0) {
      console.log(`   💚 Savings vs Distant: R${totalSavingsForItem} (R${bestQuote.savingsVsNationalBest}/unit × ${quantity})`);
    }
    
    // Add labor and equipment pricing
    const laborPricing: LaborPricing = await matchLaborRate(item.name, item.unit, quantity);
    const laborRate = laborPricing.matched ? laborPricing.laborRate.toFixed(2) : '0';
    const equipmentRate = laborPricing.matched ? laborPricing.equipmentRate.toFixed(2) : '0';
    const laborTotal = (parseFloat(laborRate) * quantity).toFixed(2);
    const equipmentTotal = (parseFloat(equipmentRate) * quantity).toFixed(2);
    
    if (laborPricing.matched) {
      console.log(`   🔧 Labor Rate: R${laborRate}/${item.unit} (${laborPricing.confidence} confidence)`);
      console.log(`   🚜 Equipment Rate: R${equipmentRate}/${item.unit}`);
      console.log(`   👷 Total Labor: R${laborTotal} | Total Equipment: R${equipmentTotal}`);
      console.log(`   📋 Matched: "${laborPricing.matchedDescription}" (${laborPricing.tradeCategory})`);
    } else {
      console.log(`   ⚠️  Labor/Equipment: No match found (using R0)`);
    }
    
    pricedItems.push({
      ...item,
      supplierPrices: regionalQuotes,
      selectedSupplier: bestQuote.supplier,
      selectedProvince: province,
      selectedMunicipality: municipality?.name,
      selectedBranchName: bestQuote.branchName,
      baseUnitPrice: bestQuote.baseUnitPrice,
      transportCost: bestQuote.transportCost,
      transportCostPerUnit: bestQuote.transportCostPerUnit,
      landedUnitPrice: bestQuote.landedUnitPrice,
      additionalFees: additionalFeesPerUnit.toFixed(2),
      additionalFeesBreakdown,
      finalUnitPrice: finalUnitPrice.toFixed(2),
      totalPrice: finalTotalPrice.toFixed(2),
      distance: bestQuote.distance,
      savingsVsDistantSupplier: totalSavingsForItem,
      // LABOR & EQUIPMENT PRICING
      laborRate,
      laborTotal,
      equipmentRate,
      equipmentTotal,
      laborMatched: laborPricing.matched,
      laborConfidence: laborPricing.confidence,
      laborDescription: laborPricing.matchedDescription,
      laborTradeCategory: laborPricing.tradeCategory,
      // BUILDAID & SANS COMPLIANCE - Use user-entered values if available, otherwise from supplier catalog
      buildAidRef: item.buildAidRef || bestQuote.buildAidRef,
      sansCode: item.sansCode || bestQuote.sansCode,
    });
  }
  
  console.log(`\n✅ Regional Pricing Complete: ${pricedItems.length} items priced\n`);
  
  return pricedItems;
}