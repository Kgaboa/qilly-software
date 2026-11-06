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
