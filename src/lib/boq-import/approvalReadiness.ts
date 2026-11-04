export type ApprovalReadiness = {
  importBlocked?: boolean;
  lineCount: number;
  issueCount: number;
  acknowledged: boolean;
  unmatchedCount: number;
  unmatchedReviewed: boolean;
  ocrReviewRequired: boolean;
  ocrReviewed: boolean;
};

/** A preview may be approved locally only after all extraction and review gates pass. */
export function getApprovalBlockers(input: ApprovalReadiness): string[] {
  const blockers: string[] = [];
  if (input.importBlocked) blockers.push('Extraction is incomplete: resolve unresolved pages and source evidence before approval.');
  if (input.lineCount === 0) blockers.push('No BOQ lines recognised: review document extraction or choose a valid BOQ sheet.');
  if (input.issueCount > 0) blockers.push(input.issueCount + ' validation issue(s) must be corrected in the reconciliation table.');
  if (!input.acknowledged) blockers.push('Confirm that you reviewed the source document, mappings and warnings.');
  if (input.unmatchedCount > 0 && !input.unmatchedReviewed) blockers.push('Confirm manual review of unmatched source lines.');
  if (input.ocrReviewRequired && !input.ocrReviewed) blockers.push('Confirm verification of OCR-derived numeric values.');
  return blockers;
}
