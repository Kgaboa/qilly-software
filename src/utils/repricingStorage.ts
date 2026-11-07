import { supabase } from '@/utils/supabase';
import { validateRepricingScenario, type RepricingLine, type RepricingScenario } from './repricingScenario';

export type StoredRepricingDraft = {
  id: string; boq_id: string; owner_user_id: string; version: number; status: 'draft';
  lines: RepricingLine[]; selling_value: number; allowable_cost: number;
  risk_escalation_percent: number;
};
export async function listRepricingDrafts(boqId: string): Promise<StoredRepricingDraft[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !boqId) throw new Error('Sign in and select a BOQ');
  const { data, error } = await supabase.from('boq_repricing_scenarios')
    .select('id,boq_id,owner_user_id,version,status,lines,selling_value,allowable_cost,risk_escalation_percent')
    .eq('boq_id', boqId).eq('owner_user_id', user.id).order('version', { ascending: false });
  if (error) throw error;
  return (data || []).filter(row => row.status === 'draft') as StoredRepricingDraft[];
}
export async function saveNewRepricingDraft(
  boqId: string, lines: RepricingLine[], sellingValue: number,
  allowableCost: number, riskEscalationPercent: number,
): Promise<StoredRepricingDraft> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !boqId) throw new Error('Sign in and select an existing BOQ');
  if (![sellingValue, allowableCost, riskEscalationPercent].every(Number.isFinite) ||
      sellingValue < 0 || allowableCost < 0 || riskEscalationPercent < 0 || riskEscalationPercent > 1000)
    throw new Error('Invalid financial scenario values');
  const { data: versions, error: versionsError } = await supabase.from('boq_repricing_scenarios')
    .select('version').eq('boq_id', boqId).order('version', { ascending: false }).limit(1);
  if (versionsError) throw versionsError;
  const version = Math.max(0, Number(versions?.[0]?.version || 0)) + 1;
  const now = new Date().toISOString();
  const scenario: RepricingScenario = {
    id: crypto.randomUUID(), boqId, ownerUserId: user.id, version,
    status: 'draft', lines, createdAt: now, updatedAt: now
  };
  const validation = validateRepricingScenario(scenario);
  if (validation.length) throw new Error(validation.join('; '));
  const { data, error } = await supabase.from('boq_repricing_scenarios').insert({
    id: scenario.id, boq_id: boqId, owner_user_id: user.id, version,
    status: 'draft', lines, selling_value: sellingValue,
    allowable_cost: allowableCost, risk_escalation_percent: riskEscalationPercent
  }).select('id,boq_id,owner_user_id,version,status,lines,selling_value,allowable_cost,risk_escalation_percent').single();
  if (error) throw error;
  return data as StoredRepricingDraft;
}

/** Atomically submits an owned draft and writes an immutable audit entry server-side. */
export async function submitRepricingDraft(scenarioId: string): Promise<void> {
  if (!scenarioId) throw new Error('Select a draft first');
  const { data, error } = await supabase.rpc('submit_boq_repricing_scenario', { p_scenario_id: scenarioId });
  if (error) throw error;
  if (data !== true) throw new Error('Draft not eligible for submission');
}

export type RepricingReview = {
  id: string; boq_id: string; owner_user_id: string; version: number;
  status: 'submitted' | 'approved' | 'rejected'; selling_value: number | null;
  allowable_cost: number | null; risk_escalation_percent: number;
};
export async function assignRepricingReviewer(boqId: string, reviewerUserId: string): Promise<void> {
  const { data, error } = await supabase.rpc('assign_boq_repricing_reviewer', {
    p_boq_id: boqId, p_reviewer_user_id: reviewerUserId
  });
  if (error) throw error;
  if (data !== true) throw new Error('Reviewer assignment denied');
}
export async function listAssignedRepricingReviews(): Promise<RepricingReview[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Sign in to review repricing');
  const { data: assignments, error: assignmentError } = await supabase
    .from('boq_repricing_reviewers').select('boq_id').eq('reviewer_user_id', user.id).is('revoked_at', null);
  if (assignmentError) throw assignmentError;
  const boqIds = (assignments || []).map(a => a.boq_id);
  if (!boqIds.length) return [];
  const { data, error } = await supabase.from('boq_repricing_scenarios')
    .select('id,boq_id,owner_user_id,version,status,selling_value,allowable_cost,risk_escalation_percent')
    .in('boq_id', boqIds).eq('status', 'submitted').order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []) as RepricingReview[];
}
export async function decideRepricingScenario(
  scenarioId: string, approve: boolean, note: string
): Promise<void> {
  if (!scenarioId || (!approve && !note.trim())) throw new Error('Select a scenario and provide a rejection reason');
  const { data, error } = await supabase.rpc('decide_boq_repricing_scenario', {
    p_scenario_id: scenarioId, p_approve: approve, p_note: note
  });
  if (error) throw error;
  if (data !== true) throw new Error('Decision denied: check reviewer assignment and scenario status');
}
