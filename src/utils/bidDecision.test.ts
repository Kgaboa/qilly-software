import { describe, expect, it } from 'vitest';
import { assessBid, type BidAssessmentInput } from './bidDecision';
const base: BidAssessmentInput = {
  boqId: 'existing-boq', expectedMarginPercent: 20, riskAdjustedMarginPercent: 15,
  capacityScore: 85, complianceScore: 90, deliveryScore: 80, strategicFitScore: 85,
  mandatoryRequirementsMet: true
};
describe('Sprint 03 bid decision gates', () => {
  it('recommends bid when assumptions are strong', () => expect(assessBid(base).recommendation).toBe('BID'));
  it('does not recommend bidding with missing financial data', () => expect(assessBid({ ...base, riskAdjustedMarginPercent: null }).recommendation).toBe('INSUFFICIENT_DATA'));
  it('rejects mandatory compliance failure', () => expect(assessBid({ ...base, mandatoryRequirementsMet: false }).recommendation).toBe('NO_BID'));
  it('rejects negative risk-adjusted margin', () => expect(assessBid({ ...base, riskAdjustedMarginPercent: -1 }).recommendation).toBe('NO_BID'));
  it('requires human approval for every outcome', () => expect(assessBid(base).requiresHumanApproval).toBe(true));
});
