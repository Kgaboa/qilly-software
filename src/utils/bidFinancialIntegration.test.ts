import { describe, expect, it } from 'vitest';
import { approvedFinancialInputs, type ApprovedFinancialSnapshot } from './bidFinancialIntegration';
const approved: ApprovedFinancialSnapshot = {
  tenderId: 'tender-1', boqId: 'boq-1', scenarioId: 'scenario-1',
  scenarioVersion: 2, approvalStatus: 'approved',
  sellingValue: 1000, allowableCost: 700, riskEscalationPercent: 10
};
describe('Sprint 03 approved financial handoff', () => {
  it('calculates expected and risk-adjusted margins from approved scenario', () => {
    const result = approvedFinancialInputs(approved, 'tender-1', 'boq-1');
    expect(result?.expectedMarginPercent).toBeCloseTo(30);
    expect(result?.riskAdjustedMarginPercent).toBeCloseTo(23);
  });
  it('blocks unapproved financial scenarios', () => {
    expect(approvedFinancialInputs({ ...approved, approvalStatus: 'draft' }, 'tender-1', 'boq-1')).toBeNull();
  });
  it('blocks cross-tender and cross-BOQ mismatches', () => {
    expect(approvedFinancialInputs(approved, 'other-tender', 'boq-1')).toBeNull();
    expect(approvedFinancialInputs(approved, 'tender-1', 'other-boq')).toBeNull();
  });
  it('rejects invalid or incomplete financial figures', () => {
    expect(approvedFinancialInputs({ ...approved, sellingValue: 0 }, 'tender-1', 'boq-1')).toBeNull();
    expect(approvedFinancialInputs({ ...approved, scenarioVersion: 0 }, 'tender-1', 'boq-1')).toBeNull();
  });
});
