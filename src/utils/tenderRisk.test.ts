import { describe, expect, it } from 'vitest';
import { summariseTenderRisks, validateTenderRisk, type TenderRisk } from './tenderRisk';
const risk: TenderRisk = {
 id:'risk-1', tenderId:'tender-1', boqId:'boq-1', ownerUserId:'owner-1',
 category:'delivery', description:'Late materials', probability:4, impact:4,
 exposureAmount:100000, mitigation:'Secure alternate supplier', status:'open'
};
describe('Sprint 03 tender risk register', () => {
 it('validates linked tender and BOQ ownership fields', () => expect(validateTenderRisk(risk)).toEqual([]));
 it('rejects missing owner and invalid probability', () => {
  expect(validateTenderRisk({...risk,ownerUserId:'',probability:6})).toHaveLength(2);
 });
 it('calculates weighted exposure and high risks', () => {
  expect(summariseTenderRisks([risk])).toEqual({totalExposure:100000,weightedExposure:80000,highRisks:1,blockingRisks:0,riskCount:1});
 });
 it('excludes closed risks from active exposure', () => {
  expect(summariseTenderRisks([{...risk,status:'closed'}]).weightedExposure).toBe(0);
 });
 it('flags critical compliance risks for review', () => {
  expect(summariseTenderRisks([{...risk,category:'compliance',probability:5,impact:4}]).blockingRisks).toBe(1);
 });
 it('rejects negative exposure rather than understating risk', () => {
  expect(() => summariseTenderRisks([{...risk,exposureAmount:-1}])).toThrow();
 });
});
