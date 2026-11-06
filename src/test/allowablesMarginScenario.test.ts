import { describe, expect, it } from 'vitest';
import { calculateAllowablesMarginScenario } from '@/utils/allowablesMarginScenario';
import { calculateProgrammeCashflow } from '@/utils/programmeCashflow';

describe('BOQ programme allowables and margin scenario', () => {
  const schedule = [{id:1,name:'Earthworks',start:1,duration:2,share:40},{id:2,name:'Roadworks',start:2,duration:3,share:60}];
  const revenue = calculateProgrammeCashflow(schedule, 4, 10000);

  it('reconciles monthly revenue, allowable costs and projected profit', () => {
    const result = calculateAllowablesMarginScenario(revenue, 10000, 8000);
    expect(result).not.toBeNull();
    expect(result!.profit).toBe(2000);
    expect(result!.marginPercent).toBe(20);
    expect(result!.markupPercent).toBe(25);
    expect(result!.monthly.reduce((sum, row) => sum + row.allowableCost, 0)).toBeCloseTo(8000);
    expect(result!.monthly.reduce((sum, row) => sum + row.projectedProfit, 0)).toBeCloseTo(2000);
    expect(result!.monthly[3].cumulativeRevenue).toBeCloseTo(10000);
  });

  it('rejects a cash-flow series that does not reconcile to the selling value', () => {
    expect(calculateAllowablesMarginScenario(revenue, 12000, 8000)).toBeNull();
  });

  it('does not mistake a loss for a positive margin', () => {
    const result = calculateAllowablesMarginScenario(revenue, 10000, 11000);
    expect(result!.profit).toBe(-1000);
    expect(result!.marginPercent).toBe(-10);
  });
});
