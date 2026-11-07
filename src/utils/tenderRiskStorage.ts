import { supabase } from '@/utils/supabase';
import { summariseTenderRisks, validateTenderRisk, type TenderRisk } from './tenderRisk';

export async function loadTenderRisks(tenderId: string, boqId: string): Promise<TenderRisk[]> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user || !tenderId || !boqId) return [];
  const { data, error } = await supabase.from('tender_risks')
    .select('id,tender_id,boq_id,owner_user_id,category,description,probability,impact,exposure_amount,mitigation,status')
    .eq('owner_user_id',user.id).eq('tender_id',tenderId).eq('boq_id',boqId)
    .order('created_at',{ascending:true});
  if (error) throw error;
  return (data || []).map(row=>({
    id:row.id,tenderId:row.tender_id,boqId:row.boq_id,ownerUserId:row.owner_user_id,
    category:row.category,description:row.description,probability:row.probability,
    impact:row.impact,exposureAmount:Number(row.exposure_amount),
    mitigation:row.mitigation,status:row.status
  })) as TenderRisk[];
}
export async function createTenderRisk(risk: Omit<TenderRisk,'id'|'ownerUserId'>): Promise<void> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('Sign in to manage tender risks');
  const record: TenderRisk = {...risk,id:crypto.randomUUID(),ownerUserId:user.id};
  const errors=validateTenderRisk(record);
  if (errors.length) throw new Error(errors.join('; '));
  const { error }=await supabase.from('tender_risks').insert({
    id:record.id,tender_id:record.tenderId,boq_id:record.boqId,owner_user_id:user.id,
    category:record.category,description:record.description,probability:record.probability,
    impact:record.impact,exposure_amount:record.exposureAmount,
    mitigation:record.mitigation,status:record.status
  });
  if(error) throw error;
}
export async function getTenderRiskSummary(tenderId:string,boqId:string) {
  return summariseTenderRisks(await loadTenderRisks(tenderId,boqId));
}
