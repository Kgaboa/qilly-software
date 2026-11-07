import { beforeEach, describe, expect, it, vi } from 'vitest';
const { rpc, from, getUser } = vi.hoisted(() => ({
 rpc: vi.fn(), from: vi.fn(), getUser: vi.fn()
}));
vi.mock('@/utils/supabase',()=>({supabase:{rpc,from,auth:{getUser}}}));
import { saveBidAssessment, listBidAssessments } from './bidAssessmentStorage';
import type { BidAssessment } from './bidDecision';
import type { RiskSummary } from './tenderRisk';

const assessment: BidAssessment={recommendation:'BID',score:85,reasons:['Ready'],requiresHumanApproval:true};
const risks:RiskSummary={riskCount:0,weightedExposure:0,totalExposure:0,highRisks:0,blockingRisks:0};
const approved={
 scenarioId:'scenario-1',scenarioVersion:2,expectedMarginPercent:30,riskAdjustedMarginPercent:23,
 sellingValue:1000,allowableCost:700,riskEscalationPercent:10
};
beforeEach(()=>{vi.clearAllMocks();});
describe('versioned bid assessment persistence',()=>{
 it('blocks a BID without approved financials before calling the server',async()=>{
  await expect(saveBidAssessment('tender','boq',assessment,risks,null)).rejects.toThrow('approved BOQ');
  expect(rpc).not.toHaveBeenCalled();
 });
 it('downgrades critical compliance risks to REVIEW',async()=>{
  rpc.mockResolvedValue({data:'assessment-1',error:null});
  await saveBidAssessment('tender','boq',assessment,{...risks,blockingRisks:1},approved);
  expect(rpc).toHaveBeenCalledWith('save_tender_bid_assessment',expect.objectContaining({
   p_recommendation:'REVIEW',p_critical_compliance_risks:1,p_financial_scenario_id:'scenario-1'
  }));
 });
 it('sends approved financial references and risk evidence',async()=>{
  rpc.mockResolvedValue({data:'assessment-2',error:null});
  await expect(saveBidAssessment('tender','boq',assessment,risks,approved)).resolves.toBe('assessment-2');
  expect(rpc).toHaveBeenCalledWith('save_tender_bid_assessment',expect.objectContaining({
   p_recommendation:'BID',p_expected_margin_percent:30,p_risk_adjusted_margin_percent:23
  }));
 });
 it('propagates server validation failures',async()=>{
  rpc.mockResolvedValue({data:null,error:{message:'Risk figures do not match verified register'}});
  await expect(saveBidAssessment('tender','boq',assessment,risks,approved)).rejects.toMatchObject({message:'Risk figures do not match verified register'});
 });
 it('requires authentication for history',async()=>{
  getUser.mockResolvedValue({data:{user:null}});
  await expect(listBidAssessments('tender')).rejects.toThrow('Sign in');
  expect(from).not.toHaveBeenCalled();
 });
 it('loads only authenticated owner tender history',async()=>{
  getUser.mockResolvedValue({data:{user:{id:'owner-A'}}});
  const query:any={};
  query.select=vi.fn(()=>query);query.eq=vi.fn(()=>query);
  query.order=vi.fn(async()=>({data:[{id:'one',version:1}],error:null}));
  from.mockReturnValue(query);
  await expect(listBidAssessments('tender-A')).resolves.toHaveLength(1);
  expect(query.eq).toHaveBeenCalledWith('owner_user_id','owner-A');
  expect(query.eq).toHaveBeenCalledWith('tender_id','tender-A');
 });
});
