import { describe, expect, it } from 'vitest';
import { classifyRateProvenance } from '@/lib/boq/laborRates';

const NOW = new Date('2026-10-09T12:00:00Z');
const baseRate = {
  description: 'Excavation in soft material',
  unit: 'm3',
  composite_rate: 320,
};

describe('Qilly rate-library provenance', () => {
  it('keeps legacy BuildAid-labelled rows in the benchmark path', () => {
    const provenance = classifyRateProvenance({
      ...baseRate,
      source: 'BuildAid 2025/2026',
    }, 'boq_rates table', NOW);

    expect(provenance).toMatchObject({
      sourceType: 'buildaid-benchmark',
      usageRightsStatus: 'benchmark-reference-only',
      reviewStatus: 'review-required',
      sourcePermitted: true,
      sourceCurrent: false,
    });
  });

  it('recognises an approved reviewed Qilly-owned rate', () => {
    const provenance = classifyRateProvenance({
      ...baseRate,
      source: 'Qilly Civil Rate Library 2026',
      source_type: 'qilly-own-library',
      source_date: '2026-09-01',
      usage_rights_status: 'internal-approved',
      review_status: 'reviewed',
      commercial_basis: 'Labour plus plant per cubic metre',
      province_basis: 'National base',
    }, 'boq_rates table', NOW);

    expect(provenance).toMatchObject({
      sourceType: 'qilly-own-library',
      sourcePermitted: true,
      sourceCurrent: true,
      commercialBasisKnown: true,
      geographicBasisKnown: true,
      evidenceComplete: true,
    });
  });

  it('rejects a Qilly-labelled rate when usage rights are restricted', () => {
    const provenance = classifyRateProvenance({
      ...baseRate,
      source_type: 'qilly-own-library',
      usage_rights_status: 'restricted',
      review_status: 'reviewed',
    }, 'boq_rates table', NOW);

    expect(provenance.sourcePermitted).toBe(false);
  });

  it('does not silently classify an external quotation as Qilly-owned', () => {
    const provenance = classifyRateProvenance({
      ...baseRate,
      source: 'Supplier quotation October 2026',
    }, 'boq_rates table', NOW);

    expect(provenance.sourceType).toBe('supplier-product');
    expect(provenance.sourcePermitted).toBe(false);
  });
});
