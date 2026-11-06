import { describe, expect, it } from 'vitest';
import { canTransitionRepricing, repricingConsumesCredit, validateRepricingScenario, type RepricingScenario } from './repricingScenario';
const scenario: RepricingScenario = {
  id: 's1', boqId: 'existing-boq-1', ownerUserId: 'contractor-user-1',
  version: 1, status: 'draft', lines: [{ itemIndex: 0, proposedRate: 100, allowableUnitCost: 70 }],
  createdAt: '2026-11-06T00:00:00Z', updatedAt: '2026-11-06T00:00:00Z'
};
describe('Sprint 03 repricing scenarios', () => {
  it('validates a versioned scenario against an existing BOQ', () => expect(validateRepricingScenario(scenario)).toEqual([]));
  it('rejects missing BOQ ownership', () => expect(validateRepricingScenario({ ...scenario, boqId: '' })).toContain('Existing BOQ reference required'));
  it('rejects invalid rates', () => expect(validateRepricingScenario({ ...scenario, lines: [{ itemIndex: 0, proposedRate: -1, allowableUnitCost: 70 }] })).toContain('Invalid proposed rate'));
  it('allows draft submission and subsequent approval', () => {
    expect(canTransitionRepricing('draft', 'submitted')).toBe(true);
    expect(canTransitionRepricing('submitted', 'approved')).toBe(true);
    expect(canTransitionRepricing('draft', 'approved')).toBe(false);
    expect(canTransitionRepricing('approved', 'draft')).toBe(false);
  });
  it('never consumes a BOQ credit for repricing', () => expect(repricingConsumesCredit()).toBe(false));
});
