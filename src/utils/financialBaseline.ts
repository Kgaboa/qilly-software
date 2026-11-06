import type { MonthlyCashflow } from './programmeCashflow';

export type FinancialBaseline = {
  billId: string;
  version: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  durationMonths: number;
  monthlyPlan: MonthlyCashflow[];
  createdBy: string;
  approvedBy: string | null;
  approvedAt: string | null;
};

export type ActualExpenditure = {
  billId: string;
  baselineVersion: number;
  month: number;
  amount: number;
  recordedBy: string;
};

/** Validate a financial baseline before submission; does not grant approval. */
export function validateFinancialBaseline(input: Pick<FinancialBaseline, 'durationMonths' | 'monthlyPlan'>): boolean {
  const { durationMonths, monthlyPlan } = input;
  if (!Number.isInteger(durationMonths) || durationMonths < 1 || durationMonths > 36 ||
      monthlyPlan.length !== durationMonths) return false;
  let running = 0;
  return monthlyPlan.every((row, i) => {
    running += row.planned;
    return row.month === i + 1 && Number.isFinite(row.planned) && row.planned >= 0 &&
      Number.isFinite(row.cumulative) && Math.abs(row.cumulative - running) < 0.01;
  });
}

/** Explicit actuals only; no inferred expenditure or automatic approvals. */
export function validateActualExpenditure(actual: Pick<ActualExpenditure, 'month' | 'amount'>, durationMonths: number): boolean {
  return Number.isInteger(actual.month) && actual.month >= 1 &&
    actual.month <= durationMonths && Number.isFinite(actual.amount) && actual.amount >= 0;
}

/** Pure authorization gate for baseline lifecycle changes.
 * Server must independently authenticate actor and verify project membership.
 * This is NOT an approval endpoint and cannot persist or authorize database writes.
 */
export type BaselineTransition = {
  actorId: string;
  actorCanApprove: boolean;
  nextStatus: FinancialBaseline['status'];
  reviewedAt: string;
};
export function evaluateBaselineTransition(
  baseline: FinancialBaseline,
  request: BaselineTransition
): { allowed: boolean; reason: string } {
  if (!baseline.billId || !baseline.createdBy || !request.actorId ||
      !Number.isInteger(baseline.version) || baseline.version < 1 ||
      !validateFinancialBaseline(baseline) ||
      !Number.isFinite(Date.parse(request.reviewedAt))) {
    return { allowed: false, reason: 'Invalid baseline or transition metadata' };
  }
  if (baseline.status === 'draft' && request.nextStatus === 'submitted' &&
      request.actorId === baseline.createdBy)
    return { allowed: true, reason: 'Draft submission permitted' };
  if (baseline.status === 'submitted' && ['approved', 'rejected'].includes(request.nextStatus)) {
    if (!request.actorCanApprove) return { allowed: false, reason: 'Approver role required' };
    if (request.actorId === baseline.createdBy) return { allowed: false, reason: 'Self-approval prohibited' };
    return { allowed: true, reason: 'Independent review permitted' };
  }
  return { allowed: false, reason: 'Invalid or immutable baseline status transition' };
}
