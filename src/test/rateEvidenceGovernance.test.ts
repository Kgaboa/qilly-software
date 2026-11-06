import { describe, expect, it } from 'vitest';
import { assessRateEvidence, type RateEvidenceMetadata } from '../utils/rateEvidenceGovernance';
const valid: RateEvidenceMetadata = {
  sourceId: 'catalogue-1', sourceType: 'supplier-catalogue',
  sourceOrganisation: 'Example Supplier', acquiredAt: '2026-10-01',
  effectiveDate: '2026-09-01', licenceOrPermission: 'Documented supplier authorisation',
  permittedForSharedMatching: true, containsPrivateContractorData: false,
  reviewedBy: 'quality-reviewer', reviewedAt: '2026-10-02',
  unit: 'm3', currency: 'ZAR', province: 'Gauteng'
};
describe('shared matching evidence governance', () => {
  it('allows metadata-complete, permission-verified reviewed evidence', () => {
    expect(assessRateEvidence(valid)).toEqual({ eligible: true, reasons: [] });
  });
  it('blocks contractor-confidential data even with an asserted permission flag', () => {
    expect(assessRateEvidence({ ...valid, containsPrivateContractorData: true }).eligible).toBe(false);
  });
  it('blocks unlicensed, unreviewed and undated evidence', () => {
    const result = assessRateEvidence({ ...valid, permittedForSharedMatching: false,
      reviewedBy: null, licenceOrPermission: '', effectiveDate: '' });
    expect(result.eligible).toBe(false);
    expect(result.reasons.length).toBeGreaterThanOrEqual(3);
  });
});
