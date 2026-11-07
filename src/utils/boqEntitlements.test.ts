import { describe, expect, it } from 'vitest';
import { canPerformExistingBoqAction, consumesBoqQuota, remainingBoqCredits, type BoqEntitlementAction } from './boqEntitlements';

describe('Qilly BOQ entitlement regression', () => {
  it.each(['create_boq','import_boq'] as BoqEntitlementAction[])('charges new BOQ: %s', action => {
    expect(consumesBoqQuota(action)).toBe(true);
  });
  it.each(['price_existing_boq','reprice_boq','generate_allowables','save_scenario','approve_scenario','apply_scenario','export_excel','export_pdf','programme','cashflow','training_preview'] as BoqEntitlementAction[])('does not charge existing BOQ operation: %s', action => {
    expect(consumesBoqQuota(action)).toBe(false);
    expect(canPerformExistingBoqAction(action, 'bill-1')).toBe(true);
  });
  it('does not allow repricing without a source BOQ', () => {
    expect(canPerformExistingBoqAction('reprice_boq', null)).toBe(false);
    expect(canPerformExistingBoqAction('export_pdf', '')).toBe(false);
  });
  it('repeated repricing does not change monthly countdown', () => {
    const used = 3;
    for (let i = 0; i < 50; i++) {
      expect(consumesBoqQuota('reprice_boq')).toBe(false);
      expect(consumesBoqQuota('export_excel')).toBe(false);
    }
    expect(remainingBoqCredits(10, 0, used)).toBe(7);
  });
  it('preserves top-ups and unlimited tiers', () => {
    expect(remainingBoqCredits(10, 5, 10)).toBe(5);
    expect(remainingBoqCredits(null, 5, 100)).toBeNull();
  });
});
