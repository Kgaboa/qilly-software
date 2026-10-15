import { describe, expect, it } from 'vitest';
import { arePricingUnitsCompatible, evaluateEquivalentActivity } from '@/utils/pricingStrategyV2';
import { collectRatePages, medianRate } from '@/lib/boq/laborRates';

describe('SANRAL rate-library regression controls', () => {
  it('loads every page when the rate library exceeds the Supabase 1,000-row response limit', async () => {
    const source = Array.from({ length: 9051 }, (_, index) => index + 1);
    const calls: Array<[number, number]> = [];
    const rows = await collectRatePages(async (from, to) => {
      calls.push([from, to]);
      return source.slice(from, to + 1);
    });

    expect(rows).toHaveLength(9051);
    expect(rows[0]).toBe(1);
    expect(rows.at(-1)).toBe(9051);
    expect(calls).toHaveLength(10);
    expect(calls.at(-1)).toEqual([9000, 9999]);
  });

  it('uses the median for duplicate reviewed exact-rate observations', () => {
    expect(medianRate([90000, 99435.12, 127500])).toBe(99435.12);
    expect(medianRate([5000, 10000])).toBe(7500);
  });

  const exactCases = [
    ['Route Patrol', 'Month', 'Route Patrol', 'Month'],
    ['Temporary repair of potholes', 'Month', 'Temporary repair of potholes', 'Month'],
    ['Emergency team on standby', 'Month', 'Emergency team on standby', 'Month'],
    ['Commercial sources', 'm3', 'Commercial sources', 'm3'],
    ['N1 section 21 distance 27.2 km (10 interchanges)', 'WEEKLY', 'N1 section 21 distance 27.2 km (10 interchanges)', 'WEEKLY'],
  ] as const;

  it.each(exactCases)('accepts exact SANRAL description/unit match: %s', (boqDescription, boqUnit, candidateDescription, candidateUnit) => {
    expect(arePricingUnitsCompatible(boqUnit, candidateUnit)).toBe(true);
    const evaluation = evaluateEquivalentActivity({
      boqDescription,
      boqUnit,
      candidateDescription,
      candidateUnit,
      candidateRate: 100,
      source: 'Qilly reviewed SANRAL rate',
      sourcePermitted: true,
      sourceCurrent: true,
      commercialBasisKnown: true,
      geographicBasisKnown: true,
    });
    expect(evaluation.candidate).not.toBeNull();
    expect(evaluation.score).toBe(100);
  });

  it('rejects a SANRAL match when the unit is incompatible', () => {
    const evaluation = evaluateEquivalentActivity({
      boqDescription: 'Route Patrol',
      boqUnit: 'Month',
      candidateDescription: 'Route Patrol',
      candidateUnit: 'm3',
      candidateRate: 99435.12,
      source: 'Qilly reviewed SANRAL rate',
      sourcePermitted: true,
    });
    expect(evaluation.candidate).toBeNull();
    expect(evaluation.rejectionReasons.join(' ')).toContain('incompatible');
  });
});
