import { describe, expect, it } from 'vitest';
import { calculateContractorObligationRate } from '@/utils/regionalPricingEngine';

describe('contractor/project obligation minimum rates', () => {
  it('never returns zero for value-related obligations', () => {
    expect(calculateContractorObligationRate({ type: 'value-related' }).rate).toBe(65000);
  });

  it('uses the highest value-related contractor or BOQ-matching result', () => {
    expect(calculateContractorObligationRate({
      type: 'value-related',
      historicalBenchmark: 220000,
      eligibleContractValue: 30000000,
      valueRelatedPercentage: 1,
    }).rate).toBe(300000);
  });

  it('never returns zero for time-related obligations', () => {
    expect(calculateContractorObligationRate({ type: 'time-related' }).rate).toBe(25000);
  });

  it('uses the strongest monthly time-related rate', () => {
    expect(calculateContractorObligationRate({
      type: 'time-related',
      historicalBenchmark: 115000,
      monthlyProjectOverhead: 95000,
    }).rate).toBe(115000);
  });
});
