/** Sprint 03 domain rules: revisions belong to an existing BOQ and do not consume credits. */
import { consumesBoqQuota } from './boqEntitlements';

export type RepricingStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
export type RepricingLine = { itemIndex: number; proposedRate: number; allowableUnitCost: number | null };
export type RepricingScenario = {
  id: string; boqId: string; ownerUserId: string; version: number;
  status: RepricingStatus; lines: RepricingLine[];
  createdAt: string; updatedAt: string;
};
export function validateRepricingScenario(scenario: RepricingScenario): string[] {
  const errors: string[] = [];
  if (!scenario.boqId.trim()) errors.push('Existing BOQ reference required');
  if (!scenario.ownerUserId.trim()) errors.push('Scenario owner required');
  if (!Number.isInteger(scenario.version) || scenario.version < 1) errors.push('Invalid version');
  if (scenario.lines.length === 0) errors.push('At least one BOQ line required');
  const seen = new Set<number>();
  for (const line of scenario.lines) {
    if (!Number.isInteger(line.itemIndex) || line.itemIndex < 0 || seen.has(line.itemIndex)) errors.push('Invalid or duplicate BOQ line');
    seen.add(line.itemIndex);
    if (!Number.isFinite(line.proposedRate) || line.proposedRate < 0) errors.push('Invalid proposed rate');
    if (line.allowableUnitCost !== null && (!Number.isFinite(line.allowableUnitCost) || line.allowableUnitCost < 0)) errors.push('Invalid allowable cost');
  }
  return errors;
}
export function canTransitionRepricing(from: RepricingStatus, to: RepricingStatus): boolean {
  return (from === 'draft' && to === 'submitted') ||
    (from === 'submitted' && (to === 'approved' || to === 'rejected')) ||
    (from === 'rejected' && to === 'draft');
}
export function repricingConsumesCredit(): boolean {
  return consumesBoqQuota('reprice_boq');
}
