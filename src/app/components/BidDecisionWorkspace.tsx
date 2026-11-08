import { supabase } from '@/utils/supabase';
import { saveBidAssessment, listBidAssessments } from '@/utils/bidAssessmentStorage';
import { gateBidRecommendation } from '@/utils/bidRiskGate';
import { getTenderRiskSummary } from '@/utils/tenderRiskStorage';
import type { RiskSummary } from '@/utils/tenderRisk';
import { useEffect, useMemo, useState } from 'react';
import { loadApprovedBidFinancials, type ApprovedBidFinancials } from '@/utils/approvedBidFinancials';
import { assessBid, type BidAssessmentInput } from '@/utils/bidDecision';

export function BidDecisionWorkspace({ boqId, tenderId, tenderTitle }: { boqId: string | null; tenderId: string; tenderTitle: string }) {
  const [history,setHistory]=useState<Array<{id:string;version:number;recommendation:string;created_at:string;boq_id:string;financial_scenario_id:string|null}>>([]);
  const [saveBusy,setSaveBusy]=useState(false);
  const [draftHistory,setDraftHistory]=useState<Array<{id:string;version:number;created_at:string;boq_reference:string|null;assessment:{recommendation?:string}}>>([]);
  const [saveMessage,setSaveMessage]=useState('');
  const [riskSummary,setRiskSummary]=useState<RiskSummary|null>(null);
  const [riskStatus,setRiskStatus]=useState('Checking tender risks...');
  useEffect(()=>{
    let active=true;setRiskSummary(null);setRiskStatus('Checking tender risks...');
    void getTenderRiskSummary(tenderId,boqId||'').then(summary=>{
      if(active){setRiskSummary(summary);setRiskStatus('Risk register loaded');}
    }).catch(()=>{if(active)setRiskStatus('Risk register unavailable — decision cannot be verified');});
    return()=>{active=false;};
  },[tenderId,boqId]);
  const [approved, setApproved] = useState<ApprovedBidFinancials | null>(null);
  const [financialStatus, setFinancialStatus] = useState('Checking approved financial scenarios...');
  const [margin, setMargin] = useState('');
  useEffect(() => {
    let active = true;
    setApproved(null); setFinancialStatus('Checking approved financial scenarios...');
    void loadApprovedBidFinancials(tenderId, boqId || '').then(data => {
      if (!active) return;
      setApproved(data);
      setFinancialStatus(data ? 'Approved scenario v' + data.scenarioVersion + ' loaded. Financial figures are read-only.' : 'No approved financial scenario linked. Manual estimates can be saved as a provisional draft.');
    }).catch(() => { if (active) setFinancialStatus('Approved BOQ figures unavailable. You may save a provisional assessment using manual estimates.'); });
    return () => { active = false; };
  }, [tenderId, boqId]);
  const [riskMargin, setRiskMargin] = useState('');
  const [capacity, setCapacity] = useState('');
  const [compliance, setCompliance] = useState('');
  const [delivery, setDelivery] = useState('');
  const [fit, setFit] = useState('');
  const [mandatory, setMandatory] = useState<'unknown'|'yes'|'no'>('unknown');
  const numberOrNull = (value: string) => value.trim() === '' ? null : Number(value);
  const input: BidAssessmentInput = {
    boqId: boqId || '', expectedMarginPercent: approved ? approved.expectedMarginPercent : numberOrNull(margin),
    riskAdjustedMarginPercent: approved ? approved.riskAdjustedMarginPercent : numberOrNull(riskMargin),
    capacityScore: numberOrNull(capacity), complianceScore: numberOrNull(compliance),
    deliveryScore: numberOrNull(delivery), strategicFitScore: numberOrNull(fit),
    mandatoryRequirementsMet: mandatory === 'unknown' ? null : mandatory === 'yes'
  };
  const assessment = useMemo(() => assessBid(input), [boqId, approved, margin, riskMargin, capacity, compliance, delivery, fit, mandatory]);
  useEffect(()=>{let active=true;void supabase.from('tender_bid_drafts').select('id,version,created_at,boq_reference,assessment').eq('tender_id',tenderId).order('version',{ascending:false}).then(({data})=>{if(active)setDraftHistory(data||[]);});return()=>{active=false;};},[tenderId]);
  useEffect(()=>{let active=true;void listBidAssessments(tenderId).then(rows=>{if(active)setHistory(rows);}).catch(()=>{});return()=>{active=false;};},[tenderId]);
  const saveAssessment=async()=>{
    if(!boqId || !riskSummary) return;
    setSaveBusy(true);setSaveMessage('');
    try {
      await saveBidAssessment(tenderId,boqId,assessment,riskSummary,approved);
      setHistory(await listBidAssessments(tenderId));
      setSaveMessage('Assessment version saved. This is not final bid approval.');
    } catch(e) {setSaveMessage(e instanceof Error?e.message:'Unable to save assessment');}
    finally{setSaveBusy(false);}
  };
  const saveDraft=async()=>{
    if(!riskSummary || assessment.recommendation==='INSUFFICIENT_DATA')return;
    setSaveBusy(true);setSaveMessage('');
    try{
      const {error}=await supabase.rpc('save_tender_bid_draft',{
       p_tender_id:tenderId,p_boq_reference:boqId||null,
       p_assessment:{
        recommendation:gateBidRecommendation(assessment.recommendation,riskSummary),
        provisional:true,expectedMarginPercent:input.expectedMarginPercent,
        riskAdjustedMarginPercent:input.riskAdjustedMarginPercent,
        capacityScore:input.capacityScore,complianceScore:input.complianceScore,
        deliveryScore:input.deliveryScore,strategicFitScore:input.strategicFitScore,
        mandatoryRequirementsMet:input.mandatoryRequirementsMet,
        readinessScore:assessment.score,reasons:assessment.reasons,
        weightedRiskExposure: riskSummary.weightedExposure,
        criticalComplianceRisks:riskSummary.blockingRisks
       }
      });
      if(error)throw error;
      const {data,error:historyError}=await supabase.from('tender_bid_drafts')
       .select('id,version,created_at,assessment').eq('tender_id',tenderId).order('version',{ascending:false});
      if(historyError)throw historyError;
      setDraftHistory(data||[]);
      setSaveMessage('Provisional assessment saved. This is not an approved BID decision.');
    }catch(e){setSaveMessage(e instanceof Error?e.message:'Unable to save draft');}
    finally{setSaveBusy(false);}
  };
  const fields = [
    ['Expected margin %', margin, setMargin], ['Risk-adjusted margin %', riskMargin, setRiskMargin],
    ['Capacity score (0–100)', capacity, setCapacity], ['Compliance score (0–100)', compliance, setCompliance],
    ['Delivery readiness (0–100)', delivery, setDelivery], ['Strategic fit (0–100)', fit, setFit]
  ] as const;
  return <section aria-label="Bid No-Bid assessment" className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-4 space-y-3">
    <h3 className="font-semibold text-slate-900">Bid / No-Bid Assessment — {tenderTitle}</h3>
    <p role="status" className="text-sm text-cyan-900">{financialStatus}</p>
    <p role="status" className="text-sm text-cyan-900">{riskStatus}{riskSummary ? ' | Active risks: '+riskSummary.riskCount+' | Weighted exposure: R '+riskSummary.weightedExposure.toFixed(2)+' | Critical compliance risks: '+riskSummary.blockingRisks : ''}</p>
    {riskSummary && riskSummary.blockingRisks>0 && <p role="alert" className="text-sm text-red-700">Critical compliance risks require mitigation and authorised review before bidding.</p>}
    {approved && <p className="text-sm text-slate-700">Approved selling value: R {approved.sellingValue.toFixed(2)} | Allowable cost: R {approved.allowableCost.toFixed(2)} | Escalation: {approved.riskEscalationPercent}% | Expected margin: {approved.expectedMarginPercent.toFixed(2)}% | Risk-adjusted margin: {approved.riskAdjustedMarginPercent.toFixed(2)}%</p>}
    <p className="text-sm text-slate-600">Linked BOQ: {boqId || 'Not linked'}. Enter verified commercial and readiness inputs. Financial values use an approved Allowables scenario when available; otherwise manual estimates are provisional. Provisional assessments are saved as drafts without approving a BID or consuming BOQ credits.</p>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map(([label, value, setter]) => <label key={label} className="text-sm text-slate-700">{label}
        <input className="mt-1 w-full rounded border bg-white p-2" type="number" step="0.01" aria-label={label} value={approved && (label === "Expected margin %" || label === "Risk-adjusted margin %") ? String(label === "Expected margin %" ? approved.expectedMarginPercent : approved.riskAdjustedMarginPercent) : value} disabled={Boolean(approved) && (label === "Expected margin %" || label === "Risk-adjusted margin %")} onChange={event => setter(event.target.value)} />
      </label>)}
      <label className="text-sm text-slate-700">Mandatory tender requirements met?
        <select className="mt-1 w-full rounded border bg-white p-2" value={mandatory} onChange={event=>setMandatory(event.target.value as typeof mandatory)}>
          <option value="unknown">Not assessed</option><option value="yes">Yes</option><option value="no">No</option>
        </select>
      </label>
    </div>
    <div role="status" className="rounded border bg-white p-3 text-sm">
      <strong>Recommendation: {gateBidRecommendation(assessment.recommendation,riskSummary).replaceAll('_', ' ')}</strong>
      <span className="ml-3">Readiness score: {assessment.score === null ? 'Incomplete' : assessment.score + '/100'}</span>
      <ul className="mt-2 list-disc pl-5">{assessment.reasons.map(reason=><li key={reason}>{reason}</li>)}</ul>
      <p className="mt-2 text-slate-600">Indicative decision support only. Final bid approval requires an authorised reviewer. Scores and thresholds are provisional.</p>
    </div>
    {!approved&&<button type="button" disabled={saveBusy || !riskSummary || assessment.recommendation==='INSUFFICIENT_DATA'} onClick={()=>void saveDraft()} className="rounded bg-cyan-700 px-3 py-2 text-white disabled:opacity-50">{saveBusy?'Saving...':'Save Provisional Assessment'}</button>}
    {approved&&<button type="button" disabled={saveBusy || !boqId || !riskSummary || assessment.recommendation==='INSUFFICIENT_DATA'} onClick={()=>void saveAssessment()} className="rounded bg-cyan-700 px-3 py-2 text-white disabled:opacity-50">{saveBusy?'Saving...':'Save Verified Bid Assessment'}</button>}
    {saveMessage && <p role="status" className="text-sm">{saveMessage}</p>}
    <div className="space-y-1 text-sm"><strong>Provisional assessment history</strong>{draftHistory.length===0?<p>No saved drafts.</p>:draftHistory.map(h=><p key={h.id}>Draft v{h.version} — {h.assessment?.recommendation||'REVIEW'} — {h.boq_reference === boqId ? 'Current BOQ reference' : 'Historical BOQ reference — reassess'} — {new Date(h.created_at).toLocaleString()}</p>)}</div>
    <div className="space-y-1 text-sm"><strong>Verified assessment history</strong>{history.length===0?<p>No saved assessments.</p>:history.map(h=><p key={h.id}>Version {h.version} — {h.recommendation.replaceAll('_',' ')} — {h.boq_id === boqId ? 'Linked BOQ matches' : 'OUTDATED: BOQ link changed; reassessment required'} — {h.financial_scenario_id ? 'Financial scenario '+h.financial_scenario_id : 'No approved scenario'} — {new Date(h.created_at).toLocaleString()}</p>)}</div>
  </section>;
}
