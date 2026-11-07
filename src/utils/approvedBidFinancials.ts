import { supabase } from '@/utils/supabase';
import { approvedFinancialInputs, type ApprovedFinancialSnapshot, type BidFinancialInputs } from './bidFinancialIntegration';

export type ApprovedBidFinancials = BidFinancialInputs & {
  sellingValue: number; allowableCost: number; riskEscalationPercent: number;
};

/** Read only approved scenarios for the authenticated BOQ owner; RLS is the security boundary. */
export async function loadApprovedBidFinancials(tenderId: string, boqId: string): Promise<ApprovedBidFinancials | null> {
  if (!tenderId || !boqId) return null;
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('Sign in to access approved BOQ financials');
  const { data: tender, error: tenderError } = await supabase.from('tender_opportunities')
    .select('id,linked_bill_id').eq('id', tenderId).eq('owner_user_id', user.id).maybeSingle();
  if (tenderError) throw tenderError;
  if (!tender || tender.linked_bill_id !== boqId) return null;
  const { data: bill, error: billError } = await supabase.from('bills')
    .select('id').eq('id', boqId).eq('user_id', user.id).maybeSingle();
  if (billError) throw billError;
  if (!bill) return null;
  const { data: rows, error } = await supabase.from('boq_repricing_scenarios')
    .select('id,boq_id,version,status,selling_value,allowable_cost,risk_escalation_percent')
    .eq('boq_id', boqId).eq('owner_user_id', user.id).eq('status', 'approved')
    .order('version', { ascending: false }).limit(1);
  if (error) throw error;
  const row = rows?.[0];
  if (!row) return null;
  const snapshot: ApprovedFinancialSnapshot = {
    tenderId, boqId: row.boq_id, scenarioId: row.id,
    scenarioVersion: row.version, approvalStatus: row.status,
    sellingValue: row.selling_value, allowableCost: row.allowable_cost,
    riskEscalationPercent: row.risk_escalation_percent
  };
  const financials = approvedFinancialInputs(snapshot, tenderId, boqId);
  return financials ? {
    ...financials, sellingValue: snapshot.sellingValue,
    allowableCost: snapshot.allowableCost, riskEscalationPercent: snapshot.riskEscalationPercent
  } : null;
}
