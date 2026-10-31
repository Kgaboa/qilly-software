import { describe, expect, it } from 'vitest';
import { addCalendarMonthsClamped, evaluateSupplierLeadAccess } from '../utils/supplierLeadCampaign';

const base = {supplierStatus:'approved' as const, supplierApprovedAt:'2026-09-01T00:00:00Z',campaignStartsAt:'2026-11-01T00:00:00Z',evaluatedAt:'2026-11-15T00:00:00Z'};
describe('Six-month supplier free-leads campaign',()=>{
 it('includes suppliers approved before campaign activation',()=>{const result=evaluateSupplierLeadAccess(base);expect(result.freeEligible).toBe(true);expect(result.freeExpiresAt).toBe('2027-05-01T00:00:00.000Z');});
 it('starts newly approved suppliers on approval date',()=>{const result=evaluateSupplierLeadAccess({...base,supplierApprovedAt:'2026-12-10T00:00:00Z',evaluatedAt:'2026-12-11T00:00:00Z'});expect(result.freeStartsAt).toBe('2026-12-10T00:00:00.000Z');expect(result.freeExpiresAt).toBe('2027-06-10T00:00:00.000Z');});
 it('does not give pending suppliers free access',()=>{expect(evaluateSupplierLeadAccess({...base,supplierStatus:'pending'}).hasLeadAccess).toBe(false);});
 it('does not activate free leads before campaign launch',()=>{expect(evaluateSupplierLeadAccess({...base,evaluatedAt:'2026-10-31T00:00:00Z'}).freeEligible).toBe(false);});
 it('requires recorded supplier approval, not only approved status',()=>{expect(evaluateSupplierLeadAccess({...base,supplierApprovedAt:null}).freeEligible).toBe(false);});
 it('does not allow rejected suppliers to access free leads',()=>{expect(evaluateSupplierLeadAccess({...base,supplierStatus:'rejected'}).freeEligible).toBe(false);});
 it('preserves paid access for pending suppliers without enabling free access',()=>{const result=evaluateSupplierLeadAccess({...base,supplierStatus:'pending',paidLeadAccessUntil:'2027-01-01T00:00:00Z'});expect(result.freeEligible).toBe(false);expect(result.paidEligible).toBe(true);});
 it('ends free access at the six-month boundary',()=>{expect(evaluateSupplierLeadAccess({...base,evaluatedAt:'2027-05-01T00:00:00Z'}).freeEligible).toBe(false);});
 it('preserves existing paid access after free expiry',()=>{const result=evaluateSupplierLeadAccess({...base,evaluatedAt:'2027-05-02T00:00:00Z',paidLeadAccessUntil:'2027-07-01T00:00:00Z'});expect(result.hasLeadAccess).toBe(true);expect(result.paidEligible).toBe(true);});
 it('clamps calendar month end dates',()=>{expect(addCalendarMonthsClamped(new Date('2026-08-31T00:00:00Z'),6).toISOString()).toBe('2027-02-28T00:00:00.000Z');});
});
