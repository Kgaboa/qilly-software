import { describe, expect, it } from 'vitest';
import { deriveBoqProgrammeGroups, draftBoqWorkPackageSchedule } from '@/utils/boqProgramme';
import type { RegionalPricedBillItem } from '@/utils/regionalPricingEngine';

const item = (overrides: Record<string, unknown> = {}): RegionalPricedBillItem => ({
  code: 'EW01', name: 'Earthworks excavation', description: 'Excavate trenches',
  rowType: 'item', totalPrice: 1200, pricingRequirement: 'PRICED',
  matchingDecision: { reviewStatus: 'ACCEPTED' }, ...overrides
} as unknown as RegionalPricedBillItem);

describe('BOQ-to-programme eligible work packages', () => {
  it('includes explicitly accepted priced items', () => {
    const result = deriveBoqProgrammeGroups([item()]);
    expect(result.eligibleTotal).toBe(1200);
    expect(result.excludedCount).toBe(0);
    expect(result.groups).toHaveLength(1);
    expect(result.groups[0].share).toBe(100);
  });
  it('excludes missing price and missing matching acceptance', () => {
    const result = deriveBoqProgrammeGroups([
      item({pricingRequirement: undefined}),
      item({matchingDecision: undefined}),
      item({matchingDecision: {reviewStatus:'REVIEW_REQUIRED'}}),
      item({pricingRequirement:'PRICING REQUIRED'})
    ]);
    expect(result.eligibleTotal).toBe(0);
    expect(result.excludedCount).toBe(4);
  });
  it('excludes structural, zero, negative and invalid monetary rows', () => {
    const result = deriveBoqProgrammeGroups([
      item({rowType:'heading'}), item({totalPrice:0}),
      item({totalPrice:-10}), item({totalPrice:'invalid'})
    ]);
    expect(result.groups).toEqual([]);
    expect(result.excludedCount).toBe(4);
  });
  it('groups accepted values without changing the eligible total', () => {
    const result = deriveBoqProgrammeGroups([
      item(), item({code:'EW02',totalPrice:800}),
      item({code:'RD01',name:'Road asphalt',description:'Roadworks',totalPrice:1000})
    ]);
    expect(result.eligibleTotal).toBe(3000);
    expect(result.groups).toHaveLength(2);
    expect(result.groups.reduce((sum,g)=>sum+g.value,0)).toBe(3000);
    expect(result.groups.reduce((sum,g)=>sum+g.share,0)).toBeCloseTo(100);
  });
});

describe('Sprint 02 draft BOQ work-package scheduling', () => {
  const groups = [
    { id: 1, name: 'Testing and handover', sourceCodes: ['T'], value: 100, share: 10, requiresReview: true },
    { id: 2, name: 'Preliminaries and mobilisation', sourceCodes: ['P'], value: 200, share: 20, requiresReview: true },
    { id: 3, name: 'Earthworks', sourceCodes: ['E'], value: 700, share: 70, requiresReview: true }
  ];
  it('spreads proposed starts across the configured duration without implying approved dependencies', () => {
    const result = draftBoqWorkPackageSchedule(groups, 12);
    expect(result.map(a => a.name)).toEqual(['Preliminaries and mobilisation', 'Earthworks', 'Testing and handover']);
    expect(result.map(a => a.start)).toEqual([1, 3, 12]);
    expect(result.every(a => a.start + a.duration - 1 <= 12 && a.predecessorId === null)).toBe(true);
    expect(result.reduce((sum, a) => sum + a.share, 0)).toBe(100);
  });
  it('supports a one-month project and rejects out-of-range durations', () => {
    expect(draftBoqWorkPackageSchedule(groups, 1).every(a => a.start === 1 && a.duration === 1)).toBe(true);
    expect(draftBoqWorkPackageSchedule(groups, 37)).toEqual([]);
  });
});
