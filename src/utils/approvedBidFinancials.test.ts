import { describe, expect, it, vi, beforeEach } from 'vitest';

const getUser = vi.fn();
const from = vi.fn();
vi.mock('@/utils/supabase', () => ({ supabase: { auth: { getUser }, from } }));
import { loadApprovedBidFinancials } from './approvedBidFinancials';

const userId = 'contractor-A';
const tenderId = 'tender-A';
const boqId = 'boq-A';
function query(result: unknown) {
  const q: Record<string, any> = {};
  q.select = vi.fn(() => q);
  q.eq = vi.fn(() => q);
  q.maybeSingle = vi.fn(async () => ({ data: result, error: null }));
  q.order = vi.fn(() => q);
  q.limit = vi.fn(async () => ({ data: result, error: null }));
  return q;
}
beforeEach(() => {
  vi.clearAllMocks();
  getUser.mockResolvedValue({ data: { user: { id: userId } }, error: null });
});
describe('approved profitability → Bid/No-Bid handoff', () => {
  it('rejects unauthenticated requests', async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(loadApprovedBidFinancials(tenderId, boqId)).rejects.toThrow('Sign in');
    expect(from).not.toHaveBeenCalled();
  });
  it('rejects a tender linked to a different BOQ', async () => {
    from.mockReturnValueOnce(query({ id: tenderId, linked_bill_id: 'other-boq' }));
    await expect(loadApprovedBidFinancials(tenderId, boqId)).resolves.toBeNull();
    expect(from).toHaveBeenCalledTimes(1);
  });
  it('rejects an inaccessible BOQ', async () => {
    from.mockReturnValueOnce(query({ id: tenderId, linked_bill_id: boqId })).mockReturnValueOnce(query(null));
    await expect(loadApprovedBidFinancials(tenderId, boqId)).resolves.toBeNull();
    expect(from).toHaveBeenCalledTimes(2);
  });
  it('does not accept an unapproved scenario', async () => {
    from.mockReturnValueOnce(query({ id: tenderId, linked_bill_id: boqId }))
      .mockReturnValueOnce(query({ id: boqId }))
      .mockReturnValueOnce(query([{ id: 'scenario-A', boq_id: boqId, version: 1, status: 'submitted', selling_value: 1000, allowable_cost: 700, risk_escalation_percent: 10 }]));
    await expect(loadApprovedBidFinancials(tenderId, boqId)).resolves.toBeNull();
  });
  it('calculates expected and risk-adjusted margin for approved scenario', async () => {
    from.mockReturnValueOnce(query({ id: tenderId, linked_bill_id: boqId }))
      .mockReturnValueOnce(query({ id: boqId }))
      .mockReturnValueOnce(query([{ id: 'scenario-A', boq_id: boqId, version: 2, status: 'approved', selling_value: 1000, allowable_cost: 700, risk_escalation_percent: 10 }]));
    const result = await loadApprovedBidFinancials(tenderId, boqId);
    expect(result?.expectedMarginPercent).toBeCloseTo(30);
    expect(result?.riskAdjustedMarginPercent).toBeCloseTo(23);
    expect(result?.scenarioVersion).toBe(2);
  });
});
