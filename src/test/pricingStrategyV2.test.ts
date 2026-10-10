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
  CLIENT_APPROVED_STRATEGY_PROFILE,
  buildManualReviewInstruction,
  evaluateEquivalentActivity,
  evaluatePricingCandidateValidity,
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
      'composite-build-up',
      'supplier-product',
      'contractor-calculation',
      'qilly-own-library',
      'buildaid-benchmark',
      'historical-boq',
      'manual-review',
      'equivalent-activity',
    ]);

    const selection = selectBoqPricingCandidate([
      { strategy: 'composite-build-up', rate: 310, source: 'Qilly build-up', explanation: 'Built up', confidence: 'HIGH', reviewed: true },
      { strategy: 'supplier-product', rate: 295, source: 'Supplier quote', explanation: 'Direct match', confidence: 'MEDIUM', reviewed: true },
      { strategy: 'historical-boq', rate: 300, source: 'Approved BOQ', explanation: 'Approved match', confidence: 'HIGH', reviewed: true },
    ]);

    expect(selection?.candidate.strategy).toBe('composite-build-up');
    expect(selection?.decision.priority).toBe(1);
    expect(selection?.decision.reviewStatus).toBe('ACCEPTED');
    expect(selection?.decision.strategyProfileVersion).toBe(CLIENT_APPROVED_STRATEGY_PROFILE.version);
  });

  it('prioritises a contractor calculation while keeping it under review', () => {
    const selection = selectBoqPricingCandidate([
      { strategy: 'historical-boq', rate: 220000, source: 'Approved BOQ', explanation: 'Benchmark', confidence: 'HIGH', reviewed: true },
      { strategy: 'contractor-calculation', rate: 250000, source: 'Project calculation', explanation: 'Contractor inputs', confidence: 'MEDIUM', reviewed: false },
    ]);
    expect(selection?.candidate.strategy).toBe('contractor-calculation');
    expect(selection?.decision.priority).toBe(3);
    expect(selection?.decision.reviewStatus).toBe('REVIEW REQUIRED');
  });

  it('rejects an invalid higher-priority candidate before applying strategy priority', () => {
    const selection = selectBoqPricingCandidate([
      {
        strategy: 'composite-build-up', rate: 310, source: 'Partial build-up', explanation: 'Material only', confidence: 'HIGH', reviewed: true,
        validity: { evidenceComplete: false, unitCompatible: true, specificationCompatible: true, sourcePermitted: true },
      },
      {
        strategy: 'supplier-product', rate: 295, source: 'Approved supplier quote', explanation: 'Compatible delivered quote', confidence: 'HIGH', reviewed: true,
        validity: { evidenceComplete: true, unitCompatible: true, specificationCompatible: true, sourcePermitted: true },
      },
    ]);

    expect(selection?.candidate.strategy).toBe('supplier-product');
    expect(selection?.decision.rejectedCandidateCount).toBe(1);
  });

  it('keeps a valid candidate under review when its commercial basis is incomplete', () => {
    const candidate = {
      strategy: 'supplier-product' as const,
      rate: 295,
      source: 'Supplier quote',
      explanation: 'Product match',
      confidence: 'HIGH' as const,
      reviewed: true,
      validity: { commercialBasisKnown: false },
    };
    expect(evaluatePricingCandidateValidity(candidate)).toMatchObject({ valid: true, requiresReview: true });
    expect(selectBoqPricingCandidate([candidate])?.decision.reviewStatus).toBe('REVIEW REQUIRED');
  });

  it('requires review when a benchmark source is not reviewed', () => {
    const selection = selectBoqPricingCandidate([
      { strategy: 'buildaid-benchmark', rate: 450, source: 'Fallback benchmark', explanation: 'Benchmark match', confidence: 'HIGH', reviewed: false },
    ]);
    expect(selection?.decision.reviewStatus).toBe('REVIEW REQUIRED');
  });

  it('never auto-accepts BuildAid as the final source of truth', () => {
    const selection = selectBoqPricingCandidate([
      { strategy: 'buildaid-benchmark', rate: 450, source: 'BuildAid benchmark', explanation: 'Benchmark match', confidence: 'HIGH', reviewed: true },
    ]);
    expect(selection?.decision.reviewStatus).toBe('REVIEW REQUIRED');
  });

  it('provides an actionable manual-review instruction', () => {
    expect(buildManualReviewInstruction('Percentage base is missing')).toEqual({
      missingInputs: ['Applicable percentage', 'BOQ subtotal or amount to which the percentage applies'],
      requiredAction: 'Enter the percentage and select the applicable BOQ base amount.',
      responsibleParty: 'Quantity surveyor or estimator',
      resolutionOutcome: 'Qilly will calculate the percentage-based rate and amount and rerun validation.',
    });
  });

  it('rejects a wording-similar equivalent with a different critical size', () => {
    const result = evaluateEquivalentActivity({
      boqDescription: 'Supply and install 1500mm steel sign board to SANS 1200',
      boqUnit: 'm2',
      boqCategory: 'Signage',
      candidateDescription: 'Supply and install 1200mm steel sign board to SANS 1200',
      candidateUnit: 'm2',
      candidateCategory: 'Signage',
      candidateRate: 2200,
      source: 'Reviewed Qilly activity',
      sourcePermitted: true,
    });
    expect(result.candidate).toBeNull();
    expect(result.rejectionReasons).toContain('Critical dimensions or capacities differ.');
  });

  it('rejects unrelated activities even when their units are compatible', () => {
    const result = evaluateEquivalentActivity({
      boqDescription: 'Submission of a Scheme 2 Initial Programme',
      boqUnit: 'Lump Sum',
      candidateDescription: 'Removal and re-installation of pump station infrastructure',
      candidateUnit: 'sum',
      candidateRate: 163500,
      source: 'Qilly Construction Rates Library 2026',
      sourcePermitted: true,
    });

    expect(result.candidate).toBeNull();
    expect(result.rejectionReasons).toContain('Descriptions do not share enough technical activity terms.');
  });

  it('rejects weak equivalents that share only one generic activity term', () => {
    const result = evaluateEquivalentActivity({
      boqDescription: 'Training costs',
      boqUnit: 'Prov Sum',
      candidateDescription: 'Fixed costs',
      candidateUnit: 'provisional sum',
      candidateRate: 5500,
      source: 'Reviewed Qilly activity',
      sourcePermitted: true,
    });

    expect(result.candidate).toBeNull();
    expect(result.rejectionReasons).toContain('At least two meaningful activity terms must match.');
  });

  it('rejects equivalent activities with different Roman-numeral classes', () => {
    const result = evaluateEquivalentActivity({
      boqDescription: 'Class III formwork finish',
      boqUnit: 'm2',
      candidateDescription: 'Class I formwork finish',
      candidateUnit: 'm2',
      candidateRate: 253,
      source: 'Reviewed Qilly activity',
      sourcePermitted: true,
    });

    expect(result.candidate).toBeNull();
    expect(result.rejectionReasons).toContain('Pressure or performance class differs.');
  });

  it('produces a review-required controlled equivalent when technical controls pass', () => {
    const result = evaluateEquivalentActivity({
      boqDescription: 'Supply and install 1500mm steel sign board to SANS 1200',
      boqUnit: 'm2',
      boqCategory: 'Signage',
      candidateDescription: 'Install 1500mm steel road sign board SANS 1200',
      candidateUnit: 'm2',
      candidateCategory: 'Signage',
      candidateRate: 2250,
      source: 'Reviewed Qilly activity',
      sourcePermitted: true,
      sourceCurrent: true,
      commercialBasisKnown: true,
      geographicBasisKnown: true,
    });
    expect(result.candidate?.strategy).toBe('equivalent-activity');
    const selection = selectBoqPricingCandidate(result.candidate ? [result.candidate] : []);
    expect(selection?.decision.reviewStatus).toBe('REVIEW REQUIRED');
    expect(selection?.decision.manualReview?.requiredAction).toContain('Confirm');
  });
});
