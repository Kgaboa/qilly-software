import { describe, expect, it } from 'vitest';
import { deriveBoqProgrammeGroups } from '@/utils/boqProgramme';
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
