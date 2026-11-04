import { describe, expect, it } from 'vitest';
import { getApprovalBlockers, type ApprovalReadiness } from '@/lib/boq-import/approvalReadiness';

const valid: ApprovalReadiness = {
  importBlocked: false, lineCount: 2, issueCount: 0, acknowledged: true,
  unmatchedCount: 0, unmatchedReviewed: false, ocrReviewRequired: false, ocrReviewed: false
};

describe('interpreted BOQ preview approval gates', () => {
  it('enables approval for a valid reviewed unpriced BOQ', () => {
    expect(getApprovalBlockers(valid)).toEqual([]);
  });
  it('blocks incomplete PDF/DOCX extraction even after acknowledgements', () => {
    expect(getApprovalBlockers({...valid, importBlocked:true})).toContain(
      'Extraction is incomplete: resolve unresolved pages and source evidence before approval.');
  });
  it('blocks zero recognised lines and outstanding validation errors', () => {
    expect(getApprovalBlockers({...valid,lineCount:0,issueCount:2})).toHaveLength(2);
  });
  it('requires source review acknowledgement', () => {
    expect(getApprovalBlockers({...valid,acknowledged:false})).toHaveLength(1);
  });
  it('requires manual unmatched-line review when unmatched lines exist', () => {
    expect(getApprovalBlockers({...valid,unmatchedCount:3})).toHaveLength(1);
    expect(getApprovalBlockers({...valid,unmatchedCount:3,unmatchedReviewed:true})).toEqual([]);
  });
  it('requires OCR numeric review for OCR-derived content', () => {
    expect(getApprovalBlockers({...valid,ocrReviewRequired:true})).toHaveLength(1);
    expect(getApprovalBlockers({...valid,ocrReviewRequired:true,ocrReviewed:true})).toEqual([]);
  });
});
