import { supabase } from '@/utils/supabase';
import type { BidAssessment } from './bidDecision';
import type { RiskSummary } from './tenderRisk';
import type { ApprovedBidFinancials } from './approvedBidFinancials';
import { gateBidRecommendation } from './bidRiskGate';

export async function saveBidAssessment(
 tenderId:string,boqId:string,assessment:BidAssessment,
 risks:RiskSummary,approved:ApprovedBidFinancials|null
):Promise<string> {
 if(!tenderId || !boqId) throw new Error('Select a linked tender and BOQ');
 const recommendation=gateBidRecommendation(assessment.recommendation,risks);
 if(recommendation==='BID' && !approved) throw new Error('BID requires approved BOQ profitability');
 const {data,error}=await supabase.rpc('save_tender_bid_assessment',{
  p_tender_id:tenderId,p_boq_id:boqId,p_financial_scenario_id:approved?.scenarioId??null,
  p_recommendation:recommendation,p_readiness_score:assessment.score,
  p_expected_margin_percent:approved?.expectedMarginPercent??null,
  p_risk_adjusted_margin_percent:approved?.riskAdjustedMarginPercent??null,
  p_weighted_risk_exposure:risks.weightedExposure,
  p_critical_compliance_risks:risks.blockingRisks,p_reasons:assessment.reasons
 });
 if(error) throw error;
 return data as string;
}
export async function listBidAssessments(tenderId:string) {
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) throw new Error('Sign in to view bid history');
 const {data,error}=await supabase.from('tender_bid_assessments')
 .select('id,version,boq_id,recommendation,readiness_score,financial_scenario_id,weighted_risk_exposure,created_at')
 .eq('tender_id',tenderId).eq('owner_user_id',user.id).order('version',{ascending:false});
 if(error) throw error;
 return data||[];
}
