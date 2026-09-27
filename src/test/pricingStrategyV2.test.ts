import { describe, expect, it } from 'vitest';
import { BOQ_TEMPLATES } from '@/utils/boqTemplates';
import {
  arePricingUnitsCompatible,
  convertCandidateRate,
  evaluateSupplierMatch,
  evaluateBenchmarkRange,
  getPricingEngineVersion,
  getCompactPricingReason,
  isSpecialPricingUnit,
  isSupportedPricingUnit,
  normalizePricingUnit,
  calculatePricingCompleteness,
  classifyUnpricedRequirement,
  BOQ_MATCHING_PRIORITIES,
  selectBoqPricingCandidate,
} from '@/utils/pricingStrategyV2';

describe('BOQ Matching Strategy v2', () => {
  it('normalizes the canonical client unit set', () => {
    expect(normalizePricingUnit('PC. Sum')).toBe('prime cost (PC) sum');
    expect(normalizePricingUnit('m²')).toBe('m2');
    expect(normalizePricingUnit('kℓ')).toBe('kL');
    expect(normalizePricingUnit('tonne')).toBe('t');
    expect(normalizePricingUnit('No')).toBe('No.');
  });

  it('recognizes controlled special units', () => {
    for (const unit of ['sum', 'lump sum', 'PC. Sum', 'provisional sum', '%']) {
      expect(isSpecialPricingUnit(unit)).toBe(true);
    }
  });

  it('rejects the client brick versus square-metre mismatch', () => {
    const decision = evaluateSupplierMatch({ boqUnit: 'm²', candidateUnit: 'each', score: 96, supplier: 'Supplier catalogue' });
    expect(decision.reviewStatus).toBe('PRICING REQUIRED');
    expect(decision.confidence).toBe('LOW');
  });

  it('rejects the client steel tonne versus unrelated unit mismatch', () => {
    const decision = evaluateSupplierMatch({ boqUnit: 't', candidateUnit: 'm', score: 90, supplier: 'Supplier catalogue' });
    expect(decision.reviewStatus).toBe('PRICING REQUIRED');
  });

  it('allows only approved mass and volume conversions', () => {
    expect(arePricingUnitsCompatible('t', 'kg')).toBe(true);
    expect(convertCandidateRate(26.7, 'kg', 't')).toBe(26700);
    expect(convertCandidateRate(0.065, 'L', 'kL')).toBe(65);
    expect(convertCandidateRate(10, 'each', 'm2')).toBeNull();
  });

  it('uses v2 by default in UAT while allowing an explicit legacy fallback', () => {
    expect(getPricingEngineVersion()).toBe('boq-matching-v2');
    expect(getPricingEngineVersion({ pricingEngineVersion: 'boq-matching-v2' })).toBe('boq-matching-v2');
    expect(getPricingEngineVersion({ pricingEngineVersion: 'legacy' })).toBe('legacy');
  });

  it('flags the client workbook outliers instead of silently accepting them', () => {
    expect(evaluateBenchmarkRange(11380.08, 138)?.reviewStatus).toBe('REVIEW REQUIRED');
    expect(evaluateBenchmarkRange(388.66, 26700)?.reviewStatus).toBe('REVIEW REQUIRED');
    expect(evaluateBenchmarkRange(348.27, 65)?.reviewStatus).toBe('REVIEW REQUIRED');
    expect(evaluateBenchmarkRange(320, 300)).toBeNull();
  });

  it('keeps every training-template unit recognizable by the new strategy', () => {
    const unknown = BOQ_TEMPLATES.flatMap(template => template.items)
      .filter(item => !isSupportedPricingUnit(item.unit));
    expect(unknown).toEqual([]);
  });

  it('excludes structural rows and exposes incomplete BOQ totals', () => {
    const completeness = calculatePricingCompleteness([
      { rowType: 'heading', selectedSupplier: 'Not priced — structural row', totalPrice: '0', pricingRequirement: 'NON_PRICEABLE' },
      { rowType: 'item', quantity: '10', unit: 'm2', selectedSupplier: 'Buco', totalPrice: '2500', pricingRequirement: 'PRICED' },
      { rowType: 'item', quantity: '5', unit: 'No.', selectedSupplier: 'Pricing Required', totalPrice: '0', pricingRequirement: 'SUPPLIER_MATCH_REQUIRED' },
    ]);

    expect(completeness).toMatchObject({
      totalRows: 3,
      nonPriceableRows: 1,
      priceableItems: 2,
      pricedItems: 1,
      unresolvedItems: 1,
      coveragePercent: 50,
      isComplete: false,
    });
  });

  it('routes specialised items away from general supplier matching', () => {
    expect(classifyUnpricedRequirement('Handling cost, profit and all other charges').requirement)
      .toBe('PERCENTAGE_BASE_REQUIRED');
    expect(classifyUnpricedRequirement('Motor grader CAT 140G').requirement)
      .toBe('RATE_INPUT_REQUIRED');
    expect(classifyUnpricedRequirement('Prime cost sum').requirement)
      .toBe('ALLOWANCE_REQUIRED');
    expect(classifyUnpricedRequirement('Road studs', 'No').requirement)
      .toBe('SUPPLIER_MATCH_REQUIRED');
  });

  it('uses compact, client-readable pricing reasons in dense reports', () => {
    expect(getCompactPricingReason({ pricingRequirement: 'SUPPLIER_MATCH_REQUIRED' })).toBe('No compatible rate match');
    expect(getCompactPricingReason({ pricingRequirement: 'RATE_INPUT_REQUIRED' })).toBe('Labour/plant rate needed');
    expect(getCompactPricingReason({ pricingRequirement: 'PERCENTAGE_BASE_REQUIRED' })).toBe('Percentage/base missing');
    expect(getCompactPricingReason({ pricingRequirement: 'ALLOWANCE_REQUIRED' })).toBe('Project allowance needed');
    expect(getCompactPricingReason({
      matchingDecision: {
        reviewStatus: 'REVIEW REQUIRED',
        explanation: 'Candidate rate falls outside the reviewed project benchmark control range.',
      },
    })).toBe('Rate outside benchmark');
  });

  it('applies the agreed BOQ matching priority order', () => {
    expect(BOQ_MATCHING_PRIORITIES.map(item => item.strategy)).toEqual([
      'contractor-calculation',
      'historical-boq',
      'supplier-product',
      'buildaid-benchmark',
      'equivalent-activity',
      'composite-build-up',
      'manual-review',
    ]);

    const selection = selectBoqPricingCandidate([
      { strategy: 'composite-build-up', rate: 310, source: 'Qilly build-up', explanation: 'Built up', confidence: 'HIGH', reviewed: true },
      { strategy: 'supplier-product', rate: 295, source: 'Supplier quote', explanation: 'Direct match', confidence: 'MEDIUM', reviewed: true },
      { strategy: 'historical-boq', rate: 300, source: 'Approved BOQ', explanation: 'Approved match', confidence: 'HIGH', reviewed: true },
    ]);

    expect(selection?.candidate.strategy).toBe('historical-boq');
    expect(selection?.decision.priority).toBe(2);
    expect(selection?.decision.reviewStatus).toBe('ACCEPTED');
  });

  it('prioritises a contractor calculation while keeping it under review', () => {
    const selection = selectBoqPricingCandidate([
      { strategy: 'historical-boq', rate: 220000, source: 'Approved BOQ', explanation: 'Benchmark', confidence: 'HIGH', reviewed: true },
      { strategy: 'contractor-calculation', rate: 250000, source: 'Project calculation', explanation: 'Contractor inputs', confidence: 'MEDIUM', reviewed: false },
    ]);
    expect(selection?.candidate.strategy).toBe('contractor-calculation');
    expect(selection?.decision.priority).toBe(1);
    expect(selection?.decision.reviewStatus).toBe('REVIEW REQUIRED');
  });

  it('requires review when a benchmark source is not reviewed', () => {
    const selection = selectBoqPricingCandidate([
      { strategy: 'buildaid-benchmark', rate: 450, source: 'Fallback benchmark', explanation: 'Benchmark match', confidence: 'HIGH', reviewed: false },
    ]);
    expect(selection?.decision.reviewStatus).toBe('REVIEW REQUIRED');
  });
});
