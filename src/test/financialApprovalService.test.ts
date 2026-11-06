import { describe, expect, it, vi } from 'vitest';
import { reviewFinancialBaseline, type FinancialApprovalAdapter } from '../utils/financialApprovalService';
const baseline = {
  billId: 'bill-1', version: 1, status: 'submitted' as const, durationMonths: 1,
  monthlyPlan: [{ month: 1, planned: 100, cumulative: 100 }],
  createdBy: 'author', approvedBy: null, approvedAt: null
};
function adapter(): FinancialApprovalAdapter {
  return {
    authenticate: vi.fn(async () => ({ id: 'reviewer' })),
    getBaselineForReview: vi.fn(async () => baseline),
    isAuthorizedApprover: vi.fn(async () => true),
    transitionWithAudit: vi.fn(async () => true)
  };
}
const request = { accessToken: 'server-validated-token', baselineId: 'baseline-1', decision: 'approved' as const, reviewedAt: '2026-11-06T10:00:00Z' };
describe('server approval orchestration contract', () => {
  it('requires server authentication and refuses database changes on failure', async () => {
    const service = adapter();
    service.authenticate = vi.fn(async () => null);
    expect((await reviewFinancialBaseline(service, request)).ok).toBe(false);
    expect(service.transitionWithAudit).not.toHaveBeenCalled();
  });
  it('denies unauthorized and self approval', async () => {
    const service = adapter();
    service.isAuthorizedApprover = vi.fn(async () => false);
    expect((await reviewFinancialBaseline(service, request)).ok).toBe(false);
    expect(service.transitionWithAudit).not.toHaveBeenCalled();
    service.isAuthorizedApprover = vi.fn(async () => true);
    service.authenticate = vi.fn(async () => ({ id: 'author' }));
    expect((await reviewFinancialBaseline(service, request)).ok).toBe(false);
  });
  it('requires an atomic audited transition', async () => {
    const service = adapter();
    expect((await reviewFinancialBaseline(service, request)).ok).toBe(true);
    expect(service.transitionWithAudit).toHaveBeenCalledWith(expect.objectContaining({ expectedStatus: 'submitted', actorId: 'reviewer' }));
    service.transitionWithAudit = vi.fn(async () => false);
    expect((await reviewFinancialBaseline(service, request)).ok).toBe(false);
  });
});
