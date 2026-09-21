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

  it('requires an explicit switch before the new engine is used', () => {
    expect(getPricingEngineVersion()).toBe('legacy');
    expect(getPricingEngineVersion({ pricingEngineVersion: 'boq-matching-v2' })).toBe('boq-matching-v2');
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
});
