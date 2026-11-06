import { describe, expect, it } from 'vitest';
import { deriveHistoricalDraftGroups, draftBoqWorkPackageSchedule } from '@/utils/boqProgramme';
import { calculateProgrammeCashflow, calculateWorkPackageMonthlyAllocations } from '@/utils/programmeCashflow';

describe('historical priced BOQ to programme to S-Curve regression', () => {
  const items = [
    { code: 'EW01', name: 'Earthworks excavation', quantity: 10, unitPrice: 100, totalPrice: 1000 },
    { code: 'RD01', name: 'Road asphalt surfacing', quantity: 5, unitPrice: 200, totalPrice: 1000 },
    { code: 'BAD', name: 'Unreconciled item', quantity: 3, unitPrice: 100, totalPrice: 500 },
  ];

  it('reuses historical BOQ mapping and reconciles work packages, monthly cash flow and S-Curve', () => {
    const { groups, excludedCount, eligibleTotal } = deriveHistoricalDraftGroups(items);
    expect(excludedCount).toBe(1);
    expect(groups).toHaveLength(2);
    expect(eligibleTotal).toBe(2000);
    const schedule = draftBoqWorkPackageSchedule(groups, 6);
    expect(schedule).toHaveLength(2);
    const cashflow = calculateProgrammeCashflow(schedule, 6, eligibleTotal);
    const allocations = calculateWorkPackageMonthlyAllocations(schedule, 6, eligibleTotal);
    expect(cashflow).toHaveLength(6);
    expect(allocations).toHaveLength(2);
    expect(allocations.reduce((sum, a) => sum + a.plannedTotal, 0)).toBeCloseTo(eligibleTotal, 6);
    for (let i = 0; i < 6; i++) {
      expect(allocations.reduce((sum, a) => sum + a.months[i], 0)).toBeCloseTo(cashflow[i].planned, 6);
    }
    expect(cashflow[5].cumulative).toBeCloseTo(eligibleTotal, 6);
  });

  it('does not generate a cash-flow baseline from unreconciled historical prices', () => {
    const { groups, eligibleTotal } = deriveHistoricalDraftGroups([items[2]]);
    expect(groups).toHaveLength(0);
    expect(eligibleTotal).toBe(0);
    expect(draftBoqWorkPackageSchedule(groups, 6)).toEqual([]);
  });
});
