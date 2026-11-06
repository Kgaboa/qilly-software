import { describe, expect, it } from 'vitest';
import { evaluateBaselineTransition, validateFinancialBaseline, validateActualExpenditure, type FinancialBaseline } from '../utils/financialBaseline';
const baseline: FinancialBaseline = {
  billId: 'bill-1', version: 1, status: 'submitted', durationMonths: 2,
  monthlyPlan: [{ month: 1, planned: 40, cumulative: 40 }, { month: 2, planned: 60, cumulative: 100 }],
  createdBy: 'author-1', approvedBy: null, approvedAt: null
};
const review = { actorId: 'reviewer-2', actorCanApprove: true, nextStatus: 'approved' as const, reviewedAt: '2026-11-06T10:00:00Z' };
describe('Sprint 02 baseline review controls', () => {
  it('allows an independent authorized reviewer to approve submitted valid baseline', () => {
    expect(evaluateBaselineTransition(baseline, review).allowed).toBe(true);
  });
  it('rejects self approval, unprivileged approval and repeated approval', () => {
    expect(evaluateBaselineTransition(baseline, { ...review, actorId: 'author-1' }).allowed).toBe(false);
    expect(evaluateBaselineTransition(baseline, { ...review, actorCanApprove: false }).allowed).toBe(false);
    expect(evaluateBaselineTransition({ ...baseline, status: 'approved' }, review).allowed).toBe(false);
  });
  it('allows author draft submission but not approval', () => {
    expect(evaluateBaselineTransition({ ...baseline, status: 'draft' }, { ...review, actorId: 'author-1', actorCanApprove: false, nextStatus: 'submitted' }).allowed).toBe(true);
    expect(evaluateBaselineTransition({ ...baseline, status: 'draft' }, review).allowed).toBe(false);
  });
  it('rejects inconsistent baseline totals and invalid actuals', () => {
    expect(validateFinancialBaseline({ ...baseline, monthlyPlan: [{ month: 1, planned: 40, cumulative: 40 }, { month: 2, planned: 60, cumulative: 90 }] })).toBe(false);
    expect(validateActualExpenditure({ month: 3, amount: 10 }, 2)).toBe(false);
  });
});
