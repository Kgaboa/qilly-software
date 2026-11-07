/** Sprint 03 integration contract: a bid decision must reference its source tender,
 * original BOQ and immutable, approved financial scenario. */
export type ApprovedFinancialSnapshot = {
  tenderId: string;
  boqId: string;
  scenarioId: string;
  scenarioVersion: number;
  approvalStatus: 'draft' | 'submitted' | 'approved' | 'rejected';
  sellingValue: number;
  allowableCost: number;
  riskEscalationPercent: number;
};
export type BidFinancialInputs = {
  boqId: string;
  expectedMarginPercent: number;
  riskAdjustedMarginPercent: number;
  scenarioId: string;
  scenarioVersion: number;
};
export function approvedFinancialInputs(
  snapshot: ApprovedFinancialSnapshot,
  expectedTenderId: string,
  expectedBoqId: string,
): BidFinancialInputs | null {
  if (snapshot.approvalStatus !== 'approved' ||
      !snapshot.tenderId || snapshot.tenderId !== expectedTenderId ||
      !snapshot.boqId || snapshot.boqId !== expectedBoqId ||
      !snapshot.scenarioId || !Number.isInteger(snapshot.scenarioVersion) || snapshot.scenarioVersion < 1 ||
      !Number.isFinite(snapshot.sellingValue) || snapshot.sellingValue <= 0 ||
      !Number.isFinite(snapshot.allowableCost) || snapshot.allowableCost < 0 ||
      !Number.isFinite(snapshot.riskEscalationPercent) ||
      snapshot.riskEscalationPercent < 0 || snapshot.riskEscalationPercent > 1000) return null;
  const expectedMarginPercent = 100 * (snapshot.sellingValue - snapshot.allowableCost) / snapshot.sellingValue;
  const riskAdjustedMarginPercent = 100 * (snapshot.sellingValue -
    snapshot.allowableCost * (1 + snapshot.riskEscalationPercent / 100)) / snapshot.sellingValue;
  return { boqId: snapshot.boqId, scenarioId: snapshot.scenarioId,
    scenarioVersion: snapshot.scenarioVersion, expectedMarginPercent, riskAdjustedMarginPercent };
}
