/** Sprint 03 tender risk register: explainable risk exposure, no automatic bid approval. */
export type TenderRiskCategory = 'commercial' | 'delivery' | 'technical' | 'compliance' | 'supplier' | 'schedule';
export type TenderRisk = {
  id: string;
  tenderId: string;
  boqId: string;
  category: TenderRiskCategory;
  description: string;
  probability: number;
  impact: number;
  exposureAmount: number;
  mitigation: string;
  ownerUserId: string;
  status: 'open' | 'mitigating' | 'closed';
};
export type RiskSummary = { totalExposure: number; weightedExposure: number; highRisks: number; blockingRisks: number; riskCount: number };
export function validateTenderRisk(risk: TenderRisk): string[] {
  const errors: string[] = [];
  if (!risk.tenderId.trim() || !risk.boqId.trim() || !risk.ownerUserId.trim()) errors.push('Risk must be linked to a tender, BOQ and owner');
  if (!risk.description.trim()) errors.push('Risk description required');
  if (!Number.isInteger(risk.probability) || risk.probability < 1 || risk.probability > 5) errors.push('Probability must be 1–5');
  if (!Number.isInteger(risk.impact) || risk.impact < 1 || risk.impact > 5) errors.push('Impact must be 1–5');
  if (!Number.isFinite(risk.exposureAmount) || risk.exposureAmount < 0) errors.push('Exposure must be non-negative');
  if (risk.status !== 'closed' && !risk.mitigation.trim()) errors.push('Open risks require mitigation');
  return errors;
}
export function summariseTenderRisks(risks: TenderRisk[]): RiskSummary {
  for (const risk of risks) {
    const errors = validateTenderRisk(risk);
    if (errors.length) throw new Error(errors.join('; '));
  }
  const active = risks.filter(r => r.status !== 'closed');
  return {
    totalExposure: active.reduce((total,r)=>total+r.exposureAmount,0),
    weightedExposure: active.reduce((total,r)=>total+r.exposureAmount*r.probability/5,0),
    highRisks: active.filter(r=>r.probability*r.impact >= 15).length,
    blockingRisks: active.filter(r=>r.category==='compliance' && r.probability*r.impact >= 20).length,
    riskCount: active.length
  };
}
