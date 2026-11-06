/** Sprint 03: explainable Bid/No-Bid assessment, not an automatic award or approval. */
export type BidFactor = 'margin' | 'capacity' | 'compliance' | 'delivery' | 'strategicFit';
export type BidAssessmentInput = {
  boqId: string;
  expectedMarginPercent: number | null;
  riskAdjustedMarginPercent: number | null;
  capacityScore: number | null;
  complianceScore: number | null;
  deliveryScore: number | null;
  strategicFitScore: number | null;
  mandatoryRequirementsMet: boolean | null;
};
export type BidRecommendation = 'BID' | 'REVIEW' | 'NO_BID' | 'INSUFFICIENT_DATA';
export type BidAssessment = { recommendation: BidRecommendation; score: number | null; reasons: string[]; requiresHumanApproval: true };
const validScore = (n: number | null): n is number => n !== null && Number.isFinite(n) && n >= 0 && n <= 100;
export function assessBid(input: BidAssessmentInput): BidAssessment {
  const reasons: string[] = [];
  if (!input.boqId.trim()) reasons.push('An existing BOQ must be selected');
  if (input.mandatoryRequirementsMet === null) reasons.push('Mandatory tender requirements have not been assessed');
  if (input.expectedMarginPercent === null || !Number.isFinite(input.expectedMarginPercent)) reasons.push('Expected margin is missing');
  if (input.riskAdjustedMarginPercent === null || !Number.isFinite(input.riskAdjustedMarginPercent)) reasons.push('Risk-adjusted margin is missing');
  for (const [name, value] of [['capacity',input.capacityScore],['compliance',input.complianceScore],['delivery',input.deliveryScore],['strategic fit',input.strategicFitScore]] as const) {
    if (!validScore(value)) reasons.push(name + ' score is missing or invalid');
  }
  if (reasons.length) return { recommendation: 'INSUFFICIENT_DATA', score: null, reasons, requiresHumanApproval: true };
  const scores = [input.capacityScore!, input.complianceScore!, input.deliveryScore!, input.strategicFitScore!];
  const score = Math.round(scores.reduce((a,b)=>a+b,0) / scores.length);
  if (!input.mandatoryRequirementsMet) return { recommendation: 'NO_BID', score, reasons: ['Mandatory tender requirements not met'], requiresHumanApproval: true };
  if (input.riskAdjustedMarginPercent! <= 0) return { recommendation: 'NO_BID', score, reasons: ['Non-positive risk-adjusted margin'], requiresHumanApproval: true };
  if (score < 50) return { recommendation: 'NO_BID', score, reasons: ['Low operational and strategic readiness score'], requiresHumanApproval: true };
  if (score < 75 || input.riskAdjustedMarginPercent! < 10) return { recommendation: 'REVIEW', score, reasons: ['Commercial or delivery assumptions require review'], requiresHumanApproval: true };
  return { recommendation: 'BID', score, reasons: ['Positive risk-adjusted margin and sufficient readiness'], requiresHumanApproval: true };
}
