/** Metadata and reuse eligibility for Qilly-owned pricing evidence.
 * Metadata must be verified against the source; this function never grants rights.
 */
export type RateEvidenceMetadata = {
  sourceId: string;
  sourceType: 'contractor-upload' | 'supplier-catalogue' | 'licensed-reference' | 'public-document';
  sourceOrganisation: string;
  acquiredAt: string;
  effectiveDate: string;
  licenceOrPermission: string;
  permittedForSharedMatching: boolean;
  containsPrivateContractorData: boolean;
  reviewedBy: string | null;
  reviewedAt: string | null;
  unit: string;
  currency: string;
  province: string;
};
export function assessRateEvidence(metadata: RateEvidenceMetadata): {
  eligible: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  const required = ['sourceId','sourceOrganisation','licenceOrPermission','unit','currency','province'] as const;
  for (const key of required) if (!metadata[key]?.trim()) reasons.push(`Missing ${key}`);
  const dateValid = (s: string) => /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(s) && Number.isFinite(Date.parse(s));
  if (!dateValid(metadata.acquiredAt) || !dateValid(metadata.effectiveDate)) reasons.push('Invalid acquisition or effective date');
  if (!metadata.permittedForSharedMatching) reasons.push('Shared matching permission not verified');
  if (metadata.containsPrivateContractorData) reasons.push('Contains private contractor data');
  if (!metadata.reviewedBy?.trim() || !metadata.reviewedAt || !dateValid(metadata.reviewedAt)) reasons.push('Missing provenance review');
  return { eligible: reasons.length === 0, reasons };
}
