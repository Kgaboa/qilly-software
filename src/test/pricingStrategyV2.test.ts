import { describe, expect, it } from 'vitest';
import { BOQ_TEMPLATES } from '@/utils/boqTemplates';
import {
  arePricingUnitsCompatible,
  convertCandidateRate,
  evaluateSupplierMatch,
  evaluateBenchmarkRange,
  getPricingEngineVersion,
  isSpecialPricingUnit,
  isSupportedPricingUnit,
  normalizePricingUnit,
  calculatePricingCompleteness,
  classifyUnpricedRequirement,
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
});
