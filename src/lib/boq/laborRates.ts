/**
 * Labor Rate Lookup and Matching
 * Integrates with labor_rates table in Supabase
 */

import { supabase } from '@/utils/supabase';
import { mockLaborRates } from '@/data/mockLaborRates';
import { arePricingUnitsCompatible, evaluateEquivalentActivity } from '@/utils/pricingStrategyV2';

export type RateSourceType = 'qilly-own-library' | 'buildaid-benchmark' | 'supplier-product' | 'historical-boq' | 'unknown';
export type UsageRightsStatus = 'internal-approved' | 'licensed' | 'benchmark-reference-only' | 'restricted' | 'unknown';
export type RateReviewStatus = 'reviewed' | 'review-required' | 'rejected';

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
  source_type?: RateSourceType;
  source_date?: string;
  valid_until?: string;
  usage_rights_status?: UsageRightsStatus;
  review_status?: RateReviewStatus;
  commercial_basis?: string;
  province_basis?: string;
  evidence_reference?: string;
}

const LABOR_RATE_CACHE_MS = 5 * 60 * 1000;
const BOQ_RATE_PAGE_SIZE = 1000;
let cachedLaborRates: LaborRate[] | null = null;
let cachedLaborRatesAt = 0;
let cachedLaborRatesSource = 'unknown';

export function clearLaborRateCache(): void {
  cachedLaborRates = null;
  cachedLaborRatesAt = 0;
  cachedLaborRatesSource = 'unknown';
}

const normalizeExactMatchText = (value: string) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9.%]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const medianRate = (values: number[]): number => {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const midpoint = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[midpoint] : (sorted[midpoint - 1] + sorted[midpoint]) / 2;
};

export async function collectRatePages<T>(
  fetchPage: (from: number, to: number) => Promise<T[]>,
  pageSize = BOQ_RATE_PAGE_SIZE,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const page = await fetchPage(from, from + pageSize - 1);
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows;
}

const sourcePriority = (sourceType: RateSourceType): number => ({
  'qilly-own-library': 1,
  'supplier-product': 2,
  'historical-boq': 3,
  'buildaid-benchmark': 4,
  unknown: 5,
}[sourceType]);

async function loadAllBoqRates(): Promise<LaborRate[]> {
  return collectRatePages(async (from, to) => {
    const { data, error } = await supabase
      .from('boq_rates')
      .select('*')
      .order('category')
      .order('id')
      .range(from, to);
    if (error) throw error;
    return (data || []) as LaborRate[];
  });
}

export interface LaborPricing {
  matched: boolean;
  laborRate: number;
  equipmentRate: number;
  totalRate: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  matchedDescription: string;
  tradeCategory: string;
  source: string;
  sourceType: RateSourceType;
  usageRightsStatus: UsageRightsStatus;
  reviewedSource: boolean;
  sourcePermitted: boolean;
  sourceCurrent: boolean;
  commercialBasisKnown: boolean;
  geographicBasisKnown: boolean;
  evidenceComplete: boolean;
}

export interface RateProvenance {
  sourceType: RateSourceType;
  usageRightsStatus: UsageRightsStatus;
  reviewStatus: RateReviewStatus;
  sourcePermitted: boolean;
  sourceCurrent: boolean;
  commercialBasisKnown: boolean;
  geographicBasisKnown: boolean;
  evidenceComplete: boolean;
}

const monthsBetween = (from: Date, to: Date) => (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24 * 30.44);

/** Explicit provenance wins; legacy rows are classified conservatively. */
export function classifyRateProvenance(
  rate: Partial<LaborRate>,
  dataSource: string,
  now: Date = new Date(),
): RateProvenance {
  const sourceText = `${rate.source || ''} ${dataSource || ''}`.toLowerCase();
  const sourceType: RateSourceType = rate.source_type
    || (sourceText.includes('buildaid')
      ? 'buildaid-benchmark'
      : sourceText.includes('supplier') || sourceText.includes('quotation')
        ? 'supplier-product'
        : dataSource === 'boq_rates table' || sourceText.includes('qilly')
          ? 'qilly-own-library'
          : 'unknown');
  const usageRightsStatus: UsageRightsStatus = rate.usage_rights_status
    || (sourceType === 'qilly-own-library'
      ? 'internal-approved'
      : sourceType === 'buildaid-benchmark'
        ? 'benchmark-reference-only'
        : 'unknown');
  const reviewStatus: RateReviewStatus = rate.review_status || 'review-required';
  const validUntil = rate.valid_until ? new Date(rate.valid_until) : null;
  const sourceDate = rate.source_date ? new Date(rate.source_date) : null;
  const sourceCurrent = validUntil && !Number.isNaN(validUntil.getTime())
    ? validUntil.getTime() >= now.getTime()
    : sourceDate && !Number.isNaN(sourceDate.getTime())
      ? monthsBetween(sourceDate, now) <= 18
      : sourceType === 'qilly-own-library' && reviewStatus === 'reviewed';

  return {
    sourceType,
    usageRightsStatus,
    reviewStatus,
    sourcePermitted: ['internal-approved', 'licensed', 'benchmark-reference-only'].includes(usageRightsStatus)
      && reviewStatus !== 'rejected',
    sourceCurrent: Boolean(sourceCurrent),
    commercialBasisKnown: Boolean(rate.commercial_basis || rate.notes),
    geographicBasisKnown: Boolean(rate.province_basis || rate.province),
    evidenceComplete: Boolean(rate.description && rate.unit && Number.isFinite(rate.composite_rate)),
  };
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
    let dataSource = cacheIsFresh ? cachedLaborRatesSource : 'unknown';

    // PRIORITY 1: Try boq_rates table (new schema with equipment rates)
    if (ratesToUse.length === 0) try {
      const boqRates = await loadAllBoqRates();
      const boqError = null;

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
          console.log(`  ✅ Loaded ${ratesToUse.length} rates from boq_rates table; provenance is evaluated per record`);
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
      cachedLaborRatesSource = dataSource;
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

    console.log(`  🔍 Controlled match search: "${description}" (${unit})`);

    // Resolve exact description + compatible-unit candidates before running
    // the broader controlled-equivalence scan. This both honours the approved
    // strategy and avoids scoring all 9,000+ records for ordinary exact hits.
    const exactRatePool = validRates.filter(rate =>
      normalizeExactMatchText(description) === normalizeExactMatchText(rate.description)
      && arePricingUnitsCompatible(unit, rate.unit));
    const ratePool = exactRatePool.length ? exactRatePool : validRates;

    // Apply the client-approved technical controls before a Qilly-library rate
    // can compete. This prevents common words and a matching unit from
    // producing a false high-confidence match.
    const scoredRates = ratePool.flatMap(rate => {
      const provenance = classifyRateProvenance(rate, dataSource);
      const evaluation = evaluateEquivalentActivity({
        boqDescription: description,
        boqUnit: unit,
        candidateDescription: rate.description,
        candidateUnit: rate.unit,
        candidateRate: rate.composite_rate,
        source: rate.source || dataSource,
        sourcePermitted: provenance.sourcePermitted,
        sourceCurrent: provenance.sourceCurrent,
        commercialBasisKnown: provenance.commercialBasisKnown,
        geographicBasisKnown: provenance.geographicBasisKnown,
      });
      const exact = exactRatePool.length > 0;
      return evaluation.candidate ? [{ rate, score: evaluation.score, provenance, exact }] : [];
    });

    if (scoredRates.length === 0) {
      console.warn('⚠️  No technically compatible Qilly-library rate found');
      return getDefaultLaborPricing();
    }

    // Exact description + compatible unit is authoritative. When several
    // reviewed records are equally exact, use the median within the highest
    // priority provenance group so duplicate historical observations cannot
    // produce an arbitrary first-row result.
    const exactRates = scoredRates.filter(candidate => candidate.exact);
    const candidatePool = exactRates.length ? exactRates : scoredRates;
    candidatePool.sort((a, b) =>
      sourcePriority(a.provenance.sourceType) - sourcePriority(b.provenance.sourceType)
      || b.score - a.score
      || Number(a.rate.id) - Number(b.rate.id));
    const bestPriority = sourcePriority(candidatePool[0].provenance.sourceType);
    const samePriority = candidatePool.filter(candidate => sourcePriority(candidate.provenance.sourceType) === bestPriority);
    const reviewed = samePriority.filter(candidate => candidate.provenance.reviewStatus === 'reviewed');
    const medianPool = exactRates.length ? (reviewed.length ? reviewed : samePriority) : [candidatePool[0]];
    const representative = medianPool[0];
    const bestMatch = {
      ...representative,
      rate: {
        ...representative.rate,
        labor_rate: medianRate(medianPool.map(candidate => candidate.rate.labor_rate)),
        equipment_rate: medianRate(medianPool.map(candidate => candidate.rate.equipment_rate || 0)),
        composite_rate: medianRate(medianPool.map(candidate => candidate.rate.composite_rate)),
        source: medianPool.length > 1
          ? `${representative.rate.source || dataSource}; median of ${medianPool.length} reviewed exact matches`
          : representative.rate.source,
      },
      score: exactRates.length ? 100 : representative.score,
    };

    console.log(`  🏆 Best match: "${bestMatch.rate.description}" (${bestMatch.rate.category})`);
    console.log(`  📊 Score: ${bestMatch.score}/100`);

    // Determine confidence
    let confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    if (bestMatch.score >= 75) {
      confidence = 'HIGH';
    } else if (bestMatch.score >= 60) {
      confidence = 'MEDIUM';
    } else {
      confidence = 'LOW';
    }

    console.log(`  ✅ Confidence: ${confidence}`);
    console.log(`  💰 Labor rate: R${bestMatch.rate.labor_rate.toFixed(2)}/${bestMatch.rate.unit}`);
    console.log(`  🚜 Equipment rate: R${(bestMatch.rate.equipment_rate || 0).toFixed(2)}/${bestMatch.rate.unit}`);

    const provenance = bestMatch.provenance;
    return {
      matched: bestMatch.score >= 60,
      laborRate: bestMatch.rate.labor_rate,
      equipmentRate: bestMatch.rate.equipment_rate || 0,
      totalRate: bestMatch.rate.composite_rate,
      confidence,
      matchedDescription: bestMatch.rate.description,
      tradeCategory: bestMatch.rate.category,
      source: bestMatch.rate.source || dataSource,
      sourceType: provenance.sourceType,
      usageRightsStatus: provenance.usageRightsStatus,
      reviewedSource: provenance.reviewStatus === 'reviewed',
      sourcePermitted: provenance.sourcePermitted,
      sourceCurrent: provenance.sourceCurrent,
      commercialBasisKnown: provenance.commercialBasisKnown,
      geographicBasisKnown: provenance.geographicBasisKnown,
      evidenceComplete: provenance.evidenceComplete,
    };
  } catch (error) {
    console.error('❌ Error in matchLaborRate:', error);
    return getDefaultLaborPricing();
  }
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
    sourceType: 'unknown',
    usageRightsStatus: 'unknown',
    reviewedSource: false,
    sourcePermitted: false,
    sourceCurrent: false,
    commercialBasisKnown: false,
    geographicBasisKnown: false,
    evidenceComplete: false,
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
