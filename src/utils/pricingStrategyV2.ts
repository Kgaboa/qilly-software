export type PricingEngineVersion = 'legacy' | 'boq-matching-v2';
export type PricingPath = 'historical-boq' | 'equivalent-activity' | 'composite-build-up' | 'supplier-product' | 'controlled-fallback' | 'manual-review';
export type MatchConfidence = 'HIGH' | 'MEDIUM' | 'LOW';
export type PricingReviewStatus = 'ACCEPTED' | 'REVIEW REQUIRED' | 'PRICING REQUIRED';
export type PricingRequirement =
  | 'PRICED'
  | 'NON_PRICEABLE'
  | 'RATE_INPUT_REQUIRED'
  | 'PERCENTAGE_BASE_REQUIRED'
  | 'ALLOWANCE_REQUIRED'
  | 'SUPPLIER_MATCH_REQUIRED';

export interface PricingDecision {
  strategy: PricingPath;
  explanation: string;
  confidence: MatchConfidence;
  reviewStatus: PricingReviewStatus;
  source?: string;
  candidateScore?: number;
}

export interface PricingCompleteness {
  totalRows: number;
  nonPriceableRows: number;
  priceableItems: number;
  pricedItems: number;
  unresolvedItems: number;
  coveragePercent: number;
  isComplete: boolean;
}

type PricingItemLike = {
  quantity?: string | number;
  unit?: string;
  rowType?: string;
  pricingRequirement?: PricingRequirement;
  selectedSupplier?: string;
  totalPrice?: string | number;
};

const hasPositiveQuantity = (value: unknown) => {
  const quantity = Number.parseFloat(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(quantity) && quantity > 0;
};

export function isPriceableBoqItem(item: PricingItemLike): boolean {
  if (item.pricingRequirement === 'NON_PRICEABLE') return false;
  if (item.rowType === 'heading' || item.rowType === 'subheading' || item.rowType === 'summary') return false;
  return hasPositiveQuantity(item.quantity) && Boolean(String(item.unit || '').trim());
}

export function calculatePricingCompleteness(items: PricingItemLike[]): PricingCompleteness {
  const priceableItems = items.filter(isPriceableBoqItem);
  const pricedItems = priceableItems.filter(item => {
    if (item.pricingRequirement && item.pricingRequirement !== 'PRICED') return false;
    if (['Pricing Required', 'Not Available', 'N/A'].includes(String(item.selectedSupplier || ''))) return false;
    const total = Number.parseFloat(String(item.totalPrice ?? ''));
    return Number.isFinite(total) && total > 0;
  });
  const unresolvedItems = priceableItems.length - pricedItems.length;
  const coveragePercent = priceableItems.length === 0 ? 100 : (pricedItems.length / priceableItems.length) * 100;

  return {
    totalRows: items.length,
    nonPriceableRows: items.length - priceableItems.length,
    priceableItems: priceableItems.length,
    pricedItems: pricedItems.length,
    unresolvedItems,
    coveragePercent,
    isComplete: unresolvedItems === 0,
  };
}

export function classifyUnpricedRequirement(description: string, unit?: string): {
  requirement: Exclude<PricingRequirement, 'PRICED' | 'NON_PRICEABLE'>;
  label: string;
  reason: string;
} {
  const text = `${description || ''} ${unit || ''}`.toLowerCase();
  if (/%|percentage|handling cost|handling charge|profit and all other charges/.test(text)) {
    return {
      requirement: 'PERCENTAGE_BASE_REQUIRED',
      label: 'Percentage Base Required',
      reason: 'Enter the percentage and identify the BOQ amount to which it must be applied.',
    };
  }
  if (/provisional sum|prime cost|pc sum|lump sum|allowance/.test(text)) {
    return {
      requirement: 'ALLOWANCE_REQUIRED',
      label: 'Allowance Required',
      reason: 'Enter the tender allowance or approved project-specific sum.',
    };
  }
  if (/labou?r|artisan|foreman|gang leader|grader|roller|loader|excavator|compressor|milling machine|truck|plant|equipment|mobilisation|execution of the works|suspension period/.test(text)) {
    return {
      requirement: 'RATE_INPUT_REQUIRED',
      label: 'Rate Input Required',
      reason: 'Use a reviewed labour, plant, time-related or contractor rate rather than a supplier product price.',
    };
  }
  return {
    requirement: 'SUPPLIER_MATCH_REQUIRED',
    label: 'Pricing Required',
    reason: 'No compatible reviewed rate or supplier match is available for this BOQ item.',
  };
}

const UNIT_ALIASES: Record<string, string> = {
  no: 'No.', nr: 'No.', ea: 'No.', each: 'No.', item: 'item', items: 'item',
  sum: 'sum', ls: 'lump sum', 'l/s': 'lump sum', lump: 'lump sum', lumpsum: 'lump sum', 'lump sum': 'lump sum',
  pc: 'prime cost (PC) sum', pcsum: 'prime cost (PC) sum', 'pc sum': 'prime cost (PC) sum', 'pc. sum': 'prime cost (PC) sum',
  'prime cost sum': 'prime cost (PC) sum', 'prime cost (pc) sum': 'prime cost (PC) sum',
  ps: 'provisional sum', 'p/s': 'provisional sum', prov: 'provisional sum', 'prov sum': 'provisional sum', 'provisional sum': 'provisional sum',
  percent: '%', percentage: '%', '%': '%',
  m: 'm', meter: 'm', metre: 'm', 'lin m': 'm',
  m2: 'm2', 'm²': 'm2', sqm: 'm2', 'square meter': 'm2', 'square metre': 'm2',
  m3: 'm3', 'm³': 'm3', cum: 'm3', 'cubic meter': 'm3', 'cubic metre': 'm3',
  km: 'km', 'km/m3': 'km/m3', 'km/m³': 'km/m3',
  kg: 'kg', kilogram: 'kg', kilograms: 'kg',
  t: 't', ton: 't', tons: 't', tonne: 't', tonnes: 't', mt: 't',
  l: 'L', lt: 'L', ltr: 'L', liter: 'L', litre: 'L',
  kl: 'kL', 'kℓ': 'kL', kiloliter: 'kL', kilolitre: 'kL',
  bag: 'bag', bags: 'bag', pair: 'pair', set: 'set',
  month: 'month', months: 'month', hour: 'hour', hours: 'hour', hr: 'hour', hrs: 'hour', day: 'day', days: 'day',
};

export function normalizePricingUnit(unit: string): string {
  const cleaned = String(unit || '').trim().toLowerCase().replace(/\s+/g, ' ');
  return UNIT_ALIASES[cleaned] || cleaned;
}

export function isSpecialPricingUnit(unit: string): boolean {
  return ['sum', 'lump sum', 'prime cost (PC) sum', 'provisional sum', '%'].includes(normalizePricingUnit(unit));
}

const SUPPORTED_UNITS = new Set([
  'No.', 'item', 'sum', 'lump sum', 'prime cost (PC) sum', 'provisional sum', '%',
  'month', 'hour', 'day', 'm', 'm2', 'm3', 'km', 'km/m3', 'kg', 't', 'L', 'kL', 'bag', 'pair', 'set', 'ha',
]);

export function isSupportedPricingUnit(unit: string): boolean {
  return SUPPORTED_UNITS.has(normalizePricingUnit(unit));
}

export function arePricingUnitsCompatible(boqUnit: string, candidateUnit: string): boolean {
  const boq = normalizePricingUnit(boqUnit);
  const candidate = normalizePricingUnit(candidateUnit);
  if (!boq || !candidate) return false;
  if (boq === candidate) return true;
  return (boq === 'kg' && candidate === 't') || (boq === 't' && candidate === 'kg') ||
    (boq === 'L' && candidate === 'kL') || (boq === 'kL' && candidate === 'L');
}

export function convertCandidateRate(rate: number, candidateUnit: string, boqUnit: string): number | null {
  if (!Number.isFinite(rate)) return null;
  const from = normalizePricingUnit(candidateUnit);
  const to = normalizePricingUnit(boqUnit);
  if (from === to) return rate;
  if (from === 'kg' && to === 't') return rate * 1000;
  if (from === 't' && to === 'kg') return rate / 1000;
  if (from === 'L' && to === 'kL') return rate * 1000;
  if (from === 'kL' && to === 'L') return rate / 1000;
  return null;
}

export function evaluateSupplierMatch(input: {
  boqUnit: string;
  candidateUnit: string;
  score: number;
  supplier: string;
  categoryCompatible?: boolean;
}): PricingDecision {
  if (!arePricingUnitsCompatible(input.boqUnit, input.candidateUnit)) {
    return {
      strategy: 'manual-review',
      explanation: `Rejected supplier match because ${input.candidateUnit || 'unknown'} is incompatible with BOQ unit ${input.boqUnit || 'unknown'}.`,
      confidence: 'LOW', reviewStatus: 'PRICING REQUIRED', source: input.supplier, candidateScore: input.score,
    };
  }
  if (input.categoryCompatible === false) {
    return {
      strategy: 'manual-review', explanation: 'Rejected supplier match because the product category is incompatible with the BOQ activity.',
      confidence: 'LOW', reviewStatus: 'PRICING REQUIRED', source: input.supplier, candidateScore: input.score,
    };
  }
  const confidence: MatchConfidence = input.score >= 85 ? 'HIGH' : input.score >= 70 ? 'MEDIUM' : 'LOW';
  return {
    strategy: 'supplier-product',
    explanation: `Supplier product matched with a compatible ${normalizePricingUnit(input.boqUnit)} unit.`,
    confidence,
    reviewStatus: confidence === 'LOW' ? 'REVIEW REQUIRED' : 'ACCEPTED',
    source: input.supplier,
    candidateScore: input.score,
  };
}

export function pricingRequired(reason: string): PricingDecision {
  return { strategy: 'manual-review', explanation: reason, confidence: 'LOW', reviewStatus: 'PRICING REQUIRED' };
}

export function evaluateBenchmarkRange(rate: number, benchmarkRate?: number): PricingDecision | null {
  if (!Number.isFinite(benchmarkRate) || !benchmarkRate || benchmarkRate <= 0) return null;
  const ratio = rate / benchmarkRate;
  if (!Number.isFinite(rate) || rate <= 0 || ratio < 0.5 || ratio > 2) {
    return {
      strategy: 'manual-review',
      explanation: `Candidate rate is ${(ratio * 100).toFixed(0)}% of the reviewed project benchmark and falls outside the 50%–200% control range.`,
      confidence: 'LOW', reviewStatus: 'REVIEW REQUIRED',
    };
  }
  return null;
}

export function getPricingEngineVersion(settings?: { pricingEngineVersion?: PricingEngineVersion }): PricingEngineVersion {
  // UAT release default. Production main remains on the explicit legacy default.
  return settings?.pricingEngineVersion === 'legacy' ? 'legacy' : 'boq-matching-v2';
}
