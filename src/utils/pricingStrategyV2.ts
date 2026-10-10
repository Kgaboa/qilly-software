export type PricingEngineVersion = 'legacy' | 'boq-matching-v2';
export type PricingPath = 'composite-build-up' | 'supplier-product' | 'contractor-calculation' | 'qilly-own-library' | 'buildaid-benchmark' | 'historical-boq' | 'manual-review' | 'equivalent-activity' | 'controlled-fallback';
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
  priority?: number;
  attemptedStrategies?: PricingPath[];
  strategyProfileVersion?: string;
  validityReasons?: string[];
  rejectedCandidateCount?: number;
  manualReview?: ManualReviewInstruction;
}

export interface ManualReviewInstruction {
  missingInputs: string[];
  requiredAction: string;
  responsibleParty: 'Contractor' | 'Client or contractor' | 'Qilly pricing administrator' | 'Quantity surveyor or estimator';
  resolutionOutcome: string;
}

export interface PricingCandidateValidity {
  unitCompatible?: boolean;
  specificationCompatible?: boolean;
  sourcePermitted?: boolean;
  sourceCurrent?: boolean;
  commercialBasisKnown?: boolean;
  geographicBasisKnown?: boolean;
  evidenceComplete?: boolean;
}

export interface PricingCandidateEvidence {
  sourceType?: string;
  sourceDate?: string;
  validityDate?: string;
  matchedDescription?: string;
  boqUnit?: string;
  candidateUnit?: string;
  specification?: string;
  commercialBasis?: string;
  provinceCode?: string;
  adjustmentFactors?: Record<string, number>;
  matchReason?: string;
}

export interface PricingCandidate {
  strategy: PricingPath;
  rate: number;
  source: string;
  explanation: string;
  confidence: MatchConfidence;
  reviewed: boolean;
  validity?: PricingCandidateValidity;
  evidence?: PricingCandidateEvidence;
}

export interface PricingStrategyProfile {
  version: string;
  name: string;
  priorities: ReadonlyArray<{ strategy: PricingPath; priority: number; label: string }>;
}

export const CLIENT_APPROVED_STRATEGY_PROFILE: PricingStrategyProfile = {
  version: 'client-approved-2026-10-09',
  name: 'Client approved BOQ matching strategy',
  priorities: [
    { strategy: 'composite-build-up', priority: 1, label: 'Composite build-up' },
    { strategy: 'supplier-product', priority: 2, label: 'Compatible supplier product' },
    { strategy: 'contractor-calculation', priority: 3, label: 'Contractor/project calculation' },
    { strategy: 'qilly-own-library', priority: 3, label: 'Qilly own rate library' },
    { strategy: 'buildaid-benchmark', priority: 4, label: 'BuildAid benchmark' },
    { strategy: 'historical-boq', priority: 5, label: 'Approved historical BOQ evidence' },
    { strategy: 'manual-review', priority: 6, label: 'Contractor input or manual review' },
    { strategy: 'equivalent-activity', priority: 7, label: 'Controlled equivalent activity' },
  ],
};

export const BOQ_MATCHING_PRIORITIES = CLIENT_APPROVED_STRATEGY_PROFILE.priorities;

export interface PricingCandidateValidityResult {
  valid: boolean;
  requiresReview: boolean;
  reasons: string[];
}

export interface EquivalentActivityInput {
  boqDescription: string;
  boqUnit: string;
  boqCategory?: string;
  candidateDescription: string;
  candidateUnit: string;
  candidateCategory?: string;
  candidateRate: number;
  source: string;
  sourcePermitted?: boolean;
  sourceCurrent?: boolean;
  commercialBasisKnown?: boolean;
  geographicBasisKnown?: boolean;
}

export interface EquivalentActivityEvaluation {
  candidate: PricingCandidate | null;
  score: number;
  rejectionReasons: string[];
}

const normalizeMatchText = (value: string) => String(value || '')
  .toLowerCase()
  .replace(/\bu\s*[- ]?pvc\b/g, 'upvc')
  .replace(/[^a-z0-9.%]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const MATCH_STOP_WORDS = new Set([
  'a', 'an', 'and', 'or', 'of', 'for', 'the', 'to', 'in', 'on', 'with', 'from',
  'other', 'item', 'items', 'including', 'include', 'included', 'above', 'below',
]);
const matchTokens = (value: string) => new Set(normalizeMatchText(value).split(' ')
  .filter(token => token.length > 1 && !MATCH_STOP_WORDS.has(token)));
const extractTechnicalAttributes = (value: string) => {
  const normalized = normalizeMatchText(value);
  return {
    dimensions: [...normalized.matchAll(/\b(\d+(?:\.\d+)?)\s*(mm|cm|m|kw|kva|mpa)\b/g)].map(match => `${match[1]}${match[2]}`),
    classes: [...normalized.matchAll(/\bclass\s*([a-z0-9.-]+)\b/g)].map(match => match[1]),
    grades: [...normalized.matchAll(/\b(?:grade|gr)\s*([a-z0-9.-]+)\b/g)].map(match => match[1]),
    roadMaterials: [...normalized.matchAll(/\bg\d+[a-z]?\b/g)].map(match => match[0]),
    standards: [...normalized.matchAll(/\b(?:sans|sabs|en|iso)\s*([a-z0-9.-]+)\b/g)].map(match => match[0].replace(/\s+/g, '')),
    materials: ['upvc', 'pvc', 'hdpe', 'steel', 'concrete', 'timber', 'aluminium', 'copper', 'bitumen', 'brick']
      .filter(material => normalized.includes(material)),
    methods: ['manual', 'hand', 'machine', 'mechanical', 'blasting']
      .filter(method => normalized.includes(method)),
    scopeQualifiers: ['internal', 'external', 'both', 'only']
      .filter(qualifier => normalized.includes(qualifier)),
    equipmentModels: [...normalized.matchAll(/\b(?:cat|caterpillar|bomag)\s*([a-z0-9.-]+)\b/g)]
      .map(match => match[0].replace(/\s+/g, '')),
  };
};

const sameValues = (required: string[], candidate: string[]) => !required.length
  || (candidate.length > 0 && required.every(value => candidate.includes(value)));

export function evaluateEquivalentActivity(input: EquivalentActivityInput): EquivalentActivityEvaluation {
  const rejectionReasons: string[] = [];
  if (!arePricingUnitsCompatible(input.boqUnit, input.candidateUnit)) {
    rejectionReasons.push(`Unit ${input.candidateUnit || 'unknown'} is incompatible with ${input.boqUnit || 'unknown'}.`);
  }

  const boqCategory = normalizeMatchText(input.boqCategory || '');
  const candidateCategory = normalizeMatchText(input.candidateCategory || '');
  if (boqCategory && candidateCategory && boqCategory !== candidateCategory
    && !boqCategory.includes(candidateCategory) && !candidateCategory.includes(boqCategory)) {
    rejectionReasons.push('Activity categories are not technically compatible.');
  }

  const required = extractTechnicalAttributes(input.boqDescription);
  const offered = extractTechnicalAttributes(input.candidateDescription);
  if (!sameValues(required.dimensions, offered.dimensions)) rejectionReasons.push('Critical dimensions or capacities differ.');
  if (!sameValues(required.classes, offered.classes)) rejectionReasons.push('Pressure or performance class differs.');
  if (!sameValues(required.grades, offered.grades)) rejectionReasons.push('Material grade differs.');
  if (!sameValues(required.roadMaterials, offered.roadMaterials)) rejectionReasons.push('Pavement material class differs.');
  if (!sameValues(required.standards, offered.standards)) rejectionReasons.push('Referenced technical standard differs.');
  if (!sameValues(required.materials, offered.materials)) rejectionReasons.push('Material type differs.');
  if (!sameValues(required.methods, offered.methods)) rejectionReasons.push('Construction or equipment method differs.');
  if (!sameValues(required.scopeQualifiers, offered.scopeQualifiers)) rejectionReasons.push('Activity scope qualifiers differ.');
  if (!sameValues(required.equipmentModels, offered.equipmentModels)) rejectionReasons.push('Equipment make or model differs.');

  const boqTokens = matchTokens(input.boqDescription);
  const candidateTokens = matchTokens(input.candidateDescription);
  const shared = [...boqTokens].filter(token => candidateTokens.has(token)).length;
  const score = Math.round((shared / Math.max(boqTokens.size, candidateTokens.size, 1)) * 100);
  if (score < 45) rejectionReasons.push('Descriptions do not share enough technical activity terms.');
  if (Math.max(boqTokens.size, candidateTokens.size) > 1 && shared < 2) {
    rejectionReasons.push('At least two meaningful activity terms must match.');
  }
  if (!Number.isFinite(input.candidateRate) || input.candidateRate <= 0) rejectionReasons.push('Equivalent rate is not greater than zero.');
  if (input.sourcePermitted === false) rejectionReasons.push('Equivalent source is not permitted for use.');

  if (rejectionReasons.length) return { candidate: null, score, rejectionReasons };
  return {
    score,
    rejectionReasons,
    candidate: {
      strategy: 'equivalent-activity',
      rate: input.candidateRate,
      source: input.source,
      explanation: `Controlled equivalent activity matched at ${score}% technical-term similarity. The estimator must confirm the disclosed equivalence before acceptance.`,
      confidence: score >= 75 ? 'MEDIUM' : 'LOW',
      reviewed: false,
      validity: {
        unitCompatible: true,
        specificationCompatible: true,
        sourcePermitted: input.sourcePermitted !== false,
        sourceCurrent: input.sourceCurrent,
        commercialBasisKnown: input.commercialBasisKnown,
        geographicBasisKnown: input.geographicBasisKnown,
        evidenceComplete: true,
      },
      evidence: {
        sourceType: 'equivalent-activity',
        matchedDescription: input.candidateDescription,
        boqUnit: input.boqUnit,
        candidateUnit: input.candidateUnit,
        specification: input.boqDescription,
        commercialBasis: 'Technically controlled equivalent activity rate',
        matchReason: `Unit, category and critical attributes passed; technical-term score ${score}%.`,
      },
    },
  };
}

export function evaluatePricingCandidateValidity(candidate: PricingCandidate): PricingCandidateValidityResult {
  const reasons: string[] = [];
  const validity = candidate.validity || {};
  let valid = Number.isFinite(candidate.rate) && candidate.rate > 0;
  let requiresReview = false;

  if (!valid) reasons.push('Candidate rate must be greater than zero.');
  const rejectChecks: Array<[keyof PricingCandidateValidity, string]> = [
    ['unitCompatible', 'BOQ and candidate units are incompatible.'],
    ['specificationCompatible', 'Candidate specification is incompatible with the BOQ item.'],
    ['sourcePermitted', 'Candidate source is not approved or permitted for use.'],
    ['evidenceComplete', 'Candidate evidence is incomplete.'],
  ];
  rejectChecks.forEach(([field, reason]) => {
    if (validity[field] === false) {
      valid = false;
      reasons.push(reason);
    }
  });

  const reviewChecks: Array<[keyof PricingCandidateValidity, string]> = [
    ['sourceCurrent', 'Source date or validity requires review.'],
    ['commercialBasisKnown', 'Commercial basis requires review.'],
    ['geographicBasisKnown', 'Geographic or provincial basis requires review.'],
  ];
  reviewChecks.forEach(([field, reason]) => {
    if (validity[field] === false) {
      requiresReview = true;
      reasons.push(reason);
    }
  });

  return { valid, requiresReview, reasons };
}

export function selectBoqPricingCandidate(
  candidates: PricingCandidate[],
  profile: PricingStrategyProfile = CLIENT_APPROVED_STRATEGY_PROFILE,
): { candidate: PricingCandidate; decision: PricingDecision } | null {
  const priorityByStrategy = new Map(profile.priorities.map(item => [item.strategy, item.priority]));
  const attemptedStrategies = profile.priorities
    .map(item => item.strategy)
    .filter(strategy => candidates.some(candidate => candidate.strategy === strategy));
  const assessed = candidates.map((candidate, index) => ({
    candidate,
    index,
    validity: evaluatePricingCandidateValidity(candidate),
  }));
  const candidate = assessed
    .filter(item => item.validity.valid)
    .sort((a, b) => (priorityByStrategy.get(a.candidate.strategy) ?? 99) - (priorityByStrategy.get(b.candidate.strategy) ?? 99) || a.index - b.index)[0];

  if (!candidate) return null;
  const selected = candidate.candidate;
  const priority = priorityByStrategy.get(selected.strategy) ?? 99;
  const benchmarkRequiresReview = selected.strategy === 'buildaid-benchmark';
  return {
    candidate: selected,
    decision: {
      strategy: selected.strategy,
      explanation: selected.explanation,
      confidence: selected.confidence,
      reviewStatus: selected.reviewed && selected.confidence !== 'LOW' && !candidate.validity.requiresReview && !benchmarkRequiresReview ? 'ACCEPTED' : 'REVIEW REQUIRED',
      source: selected.source,
      priority,
      attemptedStrategies,
      strategyProfileVersion: profile.version,
      validityReasons: candidate.validity.reasons,
      rejectedCandidateCount: assessed.filter(item => !item.validity.valid).length,
      manualReview: selected.strategy === 'equivalent-activity'
        ? {
            missingInputs: ['Technical equivalence confirmation', 'Confirmation of any scope or productivity adjustment'],
            requiredAction: 'Confirm that the proposed equivalent has the same construction method, specification and commercial inclusions.',
            responsibleParty: 'Quantity surveyor or estimator',
            resolutionOutcome: 'Qilly will retain the confirmed equivalent evidence and allow the rate to be accepted for this BOQ item.',
          }
        : undefined,
    },
  };
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
  matchingDecision?: Pick<PricingDecision, 'explanation' | 'reviewStatus'>;
};

/** Short reason for dense tables and exported BOQs. The full matching explanation remains available in row details. */
export function getCompactPricingReason(item: PricingItemLike): string {
  switch (item.pricingRequirement) {
    case 'NON_PRICEABLE': return 'Structural row';
    case 'RATE_INPUT_REQUIRED': return 'Labour/plant rate needed';
    case 'PERCENTAGE_BASE_REQUIRED': return 'Percentage/base missing';
    case 'ALLOWANCE_REQUIRED': return 'Project allowance needed';
    case 'SUPPLIER_MATCH_REQUIRED': return 'No compatible rate match';
  }

  const explanation = String(item.matchingDecision?.explanation || '').toLowerCase();
  if (/contractor|project-specific|minimum project|overhead/.test(explanation)) return 'Contractor rate to review';
  if (/outside|control range|benchmark/.test(explanation)) return 'Rate outside benchmark';
  if (/older than|undated|date/.test(explanation)) return 'Source date to review';
  if (/low confidence/.test(explanation)) return 'Low-confidence match';
  if (/medium confidence/.test(explanation)) return 'Match needs review';
  if (/incompatible.*unit|unit.*incompatible/.test(explanation)) return 'Unit mismatch';
  if (/category.*incompatible/.test(explanation)) return 'Category mismatch';
  if (/no compatible|no reviewed|no supplier|no match/.test(explanation)) return 'No compatible rate match';
  if (item.matchingDecision?.reviewStatus === 'REVIEW REQUIRED') return 'Rate needs review';
  if (item.matchingDecision?.reviewStatus === 'PRICING REQUIRED') return 'Rate required';
  return '';
}

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
  mth: 'month', mths: 'month', week: 'week', weeks: 'week',
  'man-day': 'man-day', 'man-days': 'man-day', 'person-day': 'man-day', 'person-days': 'man-day',
  'man-shift': 'man-shift', 'man-shifts': 'man-shift', shift: 'man-shift', shifts: 'man-shift',
  lot: 'lot', lots: 'lot', point: 'point', points: 'point', trip: 'trip', trips: 'trip',
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
  'week', 'man-day', 'man-shift', 'lot', 'point', 'trip',
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
    priority: 2,
    attemptedStrategies: ['composite-build-up', 'supplier-product'],
    strategyProfileVersion: CLIENT_APPROVED_STRATEGY_PROFILE.version,
  };
}

export function buildManualReviewInstruction(reason: string): ManualReviewInstruction {
  const text = String(reason || '').toLowerCase();
  if (/percentage|percentage base/.test(text)) {
    return {
      missingInputs: ['Applicable percentage', 'BOQ subtotal or amount to which the percentage applies'],
      requiredAction: 'Enter the percentage and select the applicable BOQ base amount.',
      responsibleParty: 'Quantity surveyor or estimator',
      resolutionOutcome: 'Qilly will calculate the percentage-based rate and amount and rerun validation.',
    };
  }
  if (/allowance|provisional|prime cost|special sum|lump sum/.test(text)) {
    return {
      missingInputs: ['Approved project allowance or tender sum', 'Scope and inclusions for the allowance'],
      requiredAction: 'Provide the approved allowance and confirm its inclusions and exclusions.',
      responsibleParty: 'Client or contractor',
      resolutionOutcome: 'Qilly will use the confirmed allowance and apply only the permitted handling calculation.',
    };
  }
  if (/labour|labor|plant|equipment|activity library|composite build-up/.test(text)) {
    return {
      missingInputs: ['Reviewed labour or plant rate', 'Unit and productivity basis', 'Province and effective date'],
      requiredAction: 'Provide or approve the missing labour, plant or productivity input.',
      responsibleParty: 'Contractor',
      resolutionOutcome: 'Qilly will construct or validate the activity rate and rerun the matching pipeline.',
    };
  }
  if (/source|permission|evidence validity|validity gate/.test(text)) {
    return {
      missingInputs: ['Permitted source evidence', 'Source date and commercial basis', 'Technical compatibility confirmation'],
      requiredAction: 'Submit a permitted quotation or approve a reviewed Qilly rate-library record.',
      responsibleParty: 'Qilly pricing administrator',
      resolutionOutcome: 'Qilly will revalidate provenance and make the rate eligible for strategy selection.',
    };
  }
  return {
    missingInputs: ['Complete technical specification', 'Compatible unit', 'Current supplier quote or reviewed rate source'],
    requiredAction: 'Confirm the specification and provide a current compatible rate or quotation.',
    responsibleParty: 'Quantity surveyor or estimator',
    resolutionOutcome: 'Qilly will rerun supplier, Qilly-library, historical and equivalent-activity matching.',
  };
}

export function pricingRequired(reason: string, instruction?: ManualReviewInstruction): PricingDecision {
  return {
    strategy: 'manual-review', explanation: reason, confidence: 'LOW', reviewStatus: 'PRICING REQUIRED',
    priority: 6,
    attemptedStrategies: ['composite-build-up', 'supplier-product', 'contractor-calculation', 'qilly-own-library', 'buildaid-benchmark', 'historical-boq', 'manual-review', 'equivalent-activity'],
    strategyProfileVersion: CLIENT_APPROVED_STRATEGY_PROFILE.version,
    manualReview: instruction || buildManualReviewInstruction(reason),
  };
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
