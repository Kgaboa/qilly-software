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
  it('requires all independent review gates simultaneously', () => {
    const input = {
      ...valid, unmatchedCount: 2, unmatchedReviewed: false,
      ocrReviewRequired: true, ocrReviewed: false, acknowledged: false
    };
    expect(getApprovalBlockers(input)).toHaveLength(3);
    expect(getApprovalBlockers({...input, acknowledged:true, unmatchedReviewed:true})).toHaveLength(1);
    expect(getApprovalBlockers({...input, acknowledged:true, unmatchedReviewed:true, ocrReviewed:true})).toEqual([]);
  });
  it('does not allow acknowledgements to override extraction or validation failures', () => {
    const input = {...valid, importBlocked:true, lineCount:0, issueCount:4,
      unmatchedCount:2, unmatchedReviewed:true, ocrReviewRequired:true, ocrReviewed:true};
    expect(getApprovalBlockers(input)).toHaveLength(3);
  });
  it('reports a useful blocker for each independent invalid condition', () => {
    const input = {...valid, importBlocked:true, lineCount:0, issueCount:1,
      acknowledged:false, unmatchedCount:1, unmatchedReviewed:false,
      ocrReviewRequired:true, ocrReviewed:false};
    const blockers = getApprovalBlockers(input);
    expect(blockers).toHaveLength(6);
    expect(new Set(blockers).size).toBe(6);
  });
});
