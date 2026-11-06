import { evaluateBaselineTransition, type FinancialBaseline } from './financialBaseline';

/** Server-only orchestration contract. Never import into browser UI.
 * The adapter must authenticate the token server-side, check trusted organization roles,
 * and commit status + audit record in one database transaction.
 */
export interface FinancialApprovalAdapter {
  authenticate(accessToken: string): Promise<{ id: string } | null>;
  getBaselineForReview(baselineId: string, actorId: string): Promise<FinancialBaseline | null>;
  isAuthorizedApprover(actorId: string, billId: string): Promise<boolean>;
  transitionWithAudit(input: {
    baselineId: string;
    expectedStatus: 'submitted';
    nextStatus: 'approved' | 'rejected';
    actorId: string;
    reviewedAt: string;
  }): Promise<boolean>;
}
export async function reviewFinancialBaseline(
  adapter: FinancialApprovalAdapter,
  input: { accessToken: string; baselineId: string; decision: 'approved' | 'rejected'; reviewedAt: string }
): Promise<{ ok: boolean; reason: string }> {
  if (!input.accessToken || !input.baselineId || !Number.isFinite(Date.parse(input.reviewedAt)))
    return { ok: false, reason: 'Invalid request' };
  const actor = await adapter.authenticate(input.accessToken);
  if (!actor) return { ok: false, reason: 'Authentication required' };
  const baseline = await adapter.getBaselineForReview(input.baselineId, actor.id);
  if (!baseline) return { ok: false, reason: 'Baseline unavailable' };
  const authorized = await adapter.isAuthorizedApprover(actor.id, baseline.billId);
  const transition = evaluateBaselineTransition(baseline, {
    actorId: actor.id, actorCanApprove: authorized,
    nextStatus: input.decision, reviewedAt: input.reviewedAt
  });
  if (!transition.allowed) return { ok: false, reason: transition.reason };
  const committed = await adapter.transitionWithAudit({
    baselineId: input.baselineId, expectedStatus: 'submitted',
    nextStatus: input.decision, actorId: actor.id, reviewedAt: input.reviewedAt
  });
  return committed
    ? { ok: true, reason: 'Reviewed and audited' }
    : { ok: false, reason: 'Concurrent change or audit transaction failed' };
}
