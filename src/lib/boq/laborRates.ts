/**
 * Labor Rate Lookup and Matching
 * Integrates with labor_rates table in Supabase
 */

import { supabase } from '@/utils/supabase';
import { mockLaborRates } from '@/data/mockLaborRates';

export interface LaborRate {
  id: string;
  category: string; // Changed from trade_category to match DB schema
  code?: string; // DB has code column
  description: string; // Changed from work_description
  description_normalized?: string;
  unit: string;
  base_rate?: number; // DB has base_rate in hourly
  labor_rate: number; // Changed from labor_rate_per_unit (calculated from base_rate)
  equipment_rate: number; // Changed from equipment_rate_per_unit
  composite_rate: number; // Changed from total_rate_per_unit
  material_rate?: number;
  labor_percentage?: number;
  crew_size?: number;
  output_per_day?: number;
  skill_level?: string;
  province?: string;
  source?: string;
  page_reference?: string;
  notes?: string;
  metadata?: any; // DB has JSON metadata column
}

const LABOR_RATE_CACHE_MS = 5 * 60 * 1000;
let cachedLaborRates: LaborRate[] | null = null;
let cachedLaborRatesAt = 0;

export interface LaborPricing {
  matched: boolean;
  laborRate: number;
  equipmentRate: number;
  totalRate: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  matchedDescription: string;
  tradeCategory: string;
  source: string;
  reviewedSource: boolean;
}

/**
 * Match a BOQ item description to a labor rate
 * Uses fuzzy matching and keyword scoring
 */
export async function matchLaborRate(
  description: string,
  unit: string,
  quantity?: number
): Promise<LaborPricing> {
  try {
    console.log(`\n🔧 LABOR RATE LOOKUP: "${description}" (${unit})`);

    const cacheIsFresh = cachedLaborRates && Date.now() - cachedLaborRatesAt < LABOR_RATE_CACHE_MS;
    let ratesToUse: LaborRate[] = cacheIsFresh ? cachedLaborRates! : [];
    let dataSource = cacheIsFresh ? 'in-memory cache' : 'unknown';

    // PRIORITY 1: Try boq_rates table (new schema with equipment rates)
    if (ratesToUse.length === 0) try {
      const { data: boqRates, error: boqError } = await supabase
        .from('boq_rates')
        .select('*')
        .order('category');

      if (!boqError && boqRates && boqRates.length > 0) {
        // Check if it has the correct per-unit structure
        const firstRate = boqRates[0];
        const hasPerUnitStructure = firstRate && 
          'labor_rate' in firstRate && 
          'equipment_rate' in firstRate &&
          'composite_rate' in firstRate &&
          firstRate.unit !== 'hour'; // BOQ needs per-unit, not per-hour
        
        if (hasPerUnitStructure) {
          ratesToUse = boqRates as any;
          dataSource = 'boq_rates table';
          console.log(`  ✅ Loaded ${ratesToUse.length} rates from boq_rates table (BuildAid 2025/2026)`);
        } else {
          console.log(`⚠️ boq_rates table exists but has unexpected structure`);
        }
      } else if (boqError) {
        if (boqError.code !== 'PGRST116') {
          console.log(`ℹ️ Error querying boq_rates: ${boqError.code} - ${boqError.message}`);
        }
      }
    } catch (boqFetchError) {
      console.log(`ℹ️ Could not fetch boq_rates table (table may not exist yet)`);
    }

    // PRIORITY 2: Try labor_rates table (old schema, hourly rates)
    if (ratesToUse.length === 0) {
      try {
        const { data: laborRates, error: laborError } = await supabase
          .from('labor_rates')
          .select('*')
          .order('category');

        if (!laborError && laborRates && laborRates.length > 0) {
          const firstRate = laborRates[0];
          const hasPerUnitStructure = firstRate && 
            'labor_rate' in firstRate && 
            'equipment_rate' in firstRate &&
            firstRate.unit !== 'hour';
          
          if (hasPerUnitStructure) {
            ratesToUse = laborRates as any;
            dataSource = 'labor_rates table';
            console.log(`  📊 Loaded ${ratesToUse.length} labor rates from labor_rates table`);
          } else {
            console.log(`⚠️ Database schema mismatch detected:`);
            console.log(`   Database has: ${firstRate?.unit || 'unknown'} unit (hourly job rates)`);
            console.log(`   BOQ needs: m³, m², nr, etc. (per-unit task rates)`);
          }
        } else if (laborError) {
          console.log(`ℹ️ Error querying labor_rates: ${laborError.code}`);
        }
      } catch (laborFetchError) {
        console.log(`ℹ️ Could not fetch labor_rates table`);
      }
    }

    // PRIORITY 3: Use mock data as fallback
    if (ratesToUse.length === 0) {
      console.log(`📊 Using BuildAid 2025/2026 mock data for accurate per-unit pricing`);
      ratesToUse = mockLaborRates as any;
      dataSource = 'mock database (BuildAid 2025/2026)';
      console.log(`  📊 Loaded ${ratesToUse.length} labor rates from ${dataSource}`);
    }

    if (!cacheIsFresh && ratesToUse.length > 0) {
      cachedLaborRates = ratesToUse;
      cachedLaborRatesAt = Date.now();
    }

    // Filter out rates with missing required fields
    const validRates = ratesToUse.filter(rate => 
      rate.description && 
      rate.unit && 
      rate.category &&
      typeof rate.labor_rate === 'number' &&
      typeof rate.composite_rate === 'number'
    );

    if (validRates.length === 0) {
      console.warn('⚠️  No valid labor rates found');
      return getDefaultLaborPricing();
    }

    console.log(`  ✅ ${validRates.length} valid labor rates to match against`);

    // Normalize search term
    const searchTerm = normalizeText(description);
    const searchUnit = normalizeUnit(unit);

    console.log(`  🔍 Normalized search: "${searchTerm}" (${searchUnit})`);

    // Score each labor rate
    const scoredRates = validRates.map(rate => {
      const score = calculateLaborMatchScore(
        searchTerm,
        searchUnit,
        normalizeText(rate.description),
        normalizeUnit(rate.unit),
        rate.category
      );

      return {
        rate,
        score,
      };
    });

    // Sort by score (highest first)
    scoredRates.sort((a, b) => b.score - a.score);

    const bestMatch = scoredRates[0];

    console.log(`  🏆 Best match: "${bestMatch.rate.description}" (${bestMatch.rate.category})`);
    console.log(`  📊 Score: ${bestMatch.score}/100`);

    // Determine confidence
    let confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    if (bestMatch.score >= 80) {
      confidence = 'HIGH';
    } else if (bestMatch.score >= 60) {
      confidence = 'MEDIUM';
    } else {
      confidence = 'LOW';
    }

    console.log(`  ✅ Confidence: ${confidence}`);
    console.log(`  💰 Labor rate: R${bestMatch.rate.labor_rate.toFixed(2)}/${bestMatch.rate.unit}`);
    console.log(`  🚜 Equipment rate: R${(bestMatch.rate.equipment_rate || 0).toFixed(2)}/${bestMatch.rate.unit}`);

    return {
      matched: bestMatch.score >= 50, // Minimum threshold
      laborRate: bestMatch.rate.labor_rate,
      equipmentRate: bestMatch.rate.equipment_rate || 0,
      totalRate: bestMatch.rate.composite_rate,
      confidence,
      matchedDescription: bestMatch.rate.description,
      tradeCategory: bestMatch.rate.category,
      source: bestMatch.rate.source || dataSource,
      reviewedSource: !dataSource.toLowerCase().includes('mock'),
    };
  } catch (error) {
    console.error('❌ Error in matchLaborRate:', error);
    return getDefaultLaborPricing();
  }
}

/**
 * Calculate match score between search term and labor rate
 */
function calculateLaborMatchScore(
  searchTerm: string,
  searchUnit: string,
  rateDescription: string,
  rateUnit: string,
  tradeCategory: string
): number {
  let score = 0;

  // Exact match = 100
  if (searchTerm === rateDescription) {
    return 100;
  }

  // Unit match (very important) = +30
  if (searchUnit === rateUnit) {
    score += 30;
  }

  // Split into keywords
  const searchKeywords = searchTerm.split(/\s+/).filter(k => k.length > 0);
  const rateKeywords = rateDescription.split(/\s+/).filter(k => k.length > 0);
  const categoryKeywords = (tradeCategory || '').toLowerCase().split(/\s+/).filter(k => k.length > 0);

  // Count matching keywords
  let keywordMatches = 0;
  let exactKeywordMatches = 0;

  for (const searchWord of searchKeywords) {
    // Check description keywords
    for (const rateWord of rateKeywords) {
      if (searchWord === rateWord) {
        exactKeywordMatches++;
        score += 10;
      } else if (rateWord.includes(searchWord) || searchWord.includes(rateWord)) {
        keywordMatches++;
        score += 5;
      }
    }

    // Check trade category
    for (const categoryWord of categoryKeywords) {
      if (searchWord === categoryWord) {
        score += 8;
      } else if (categoryWord.includes(searchWord) || searchWord.includes(categoryWord)) {
        score += 4;
      }
    }
  }

  // Bonus for multiple exact matches
  if (exactKeywordMatches >= 2) {
    score += 10;
  }

  // Substring match bonus
  if (rateDescription.includes(searchTerm)) {
    score += 15;
  } else if (searchTerm.includes(rateDescription)) {
    score += 10;
  }

  // Trade category relevance
  const tradeCategoryMatch = (tradeCategory || '').toLowerCase();
  if (tradeCategoryMatch && searchTerm.includes(tradeCategoryMatch)) {
    score += 5;
  }

  // Cap at 100
  return Math.min(score, 100);
}

/**
 * Normalize text for matching
 */
function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    // Remove special characters
    .replace(/[^\w\s]/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Common substitutions
    .replace(/\bmm\b/g, 'millimeter')
    .replace(/\bm2\b/g, 'm²')
    .replace(/\bm3\b/g, 'm³');
}

/**
 * Normalize unit for matching
 */
function normalizeUnit(unit: string): string {
  if (!unit) return '';
  const normalized = unit.toLowerCase().trim();

  // Unit mappings
  const unitMap: Record<string, string> = {
    'm2': 'm²',
    'm²': 'm²',
    'sqm': 'm²',
    'square meter': 'm²',
    'square metre': 'm²',
    'm3': 'm³',
    'm³': 'm³',
    'cum': 'm³',
    'cubic meter': 'm³',
    'cubic metre': 'm³',
    'lin m': 'm',
    'linear m': 'm',
    'running m': 'm',
    'nr': 'nr',
    'no': 'nr',
    'number': 'nr',
    'each': 'nr',
    'kg': 'kg',
    'kilogram': 'kg',
    't': 'ton',
    'ton': 'ton',
    'tonne': 'ton',
    'l': 'liter',
    'liter': 'liter',
    'litre': 'liter',
    'sum': 'sum',
    'lump sum': 'sum',
    'ls': 'sum',
    'prov sum': 'sum',
    'h': 'hour',
    'hr': 'hour',
    'hour': 'hour',
  };

  return unitMap[normalized] || normalized;
}

/**
 * Get default labor pricing when no match found
 */
function getDefaultLaborPricing(): LaborPricing {
  return {
    matched: false,
    laborRate: 0,
    equipmentRate: 0,
    totalRate: 0,
    confidence: 'LOW',
    matchedDescription: 'No match found',
    tradeCategory: 'General',
    source: 'No reviewed rate source',
    reviewedSource: false,
  };
}

/**
 * Calculate total labor cost for a BOQ item
 */
export function calculateLaborCost(
  laborRate: number,
  quantity: number,
  unit: string
): number {
  return laborRate * quantity;
}

/**
 * Calculate total equipment cost for a BOQ item
 */
export function calculateEquipmentCost(
  equipmentRate: number,
  quantity: number,
  unit: string
): number {
  return equipmentRate * quantity;
}

/**
 * Get labor pricing breakdown for display
 */
export function formatLaborPricing(pricing: LaborPricing, quantity: number): {
  laborCost: number;
  equipmentCost: number;
  totalLaborAndEquipment: number;
  perUnitBreakdown: {
    labor: number;
    equipment: number;
    total: number;
  };
} {
  const laborCost = pricing.laborRate * quantity;
  const equipmentCost = pricing.equipmentRate * quantity;
  const totalLaborAndEquipment = laborCost + equipmentCost;

  return {
    laborCost,
    equipmentCost,
    totalLaborAndEquipment,
    perUnitBreakdown: {
      labor: pricing.laborRate,
      equipment: pricing.equipmentRate,
      total: pricing.totalRate,
    },
  };
}
