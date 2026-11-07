import { useEffect, useMemo, useState } from 'react';
import { loadApprovedBidFinancials, type ApprovedBidFinancials } from '@/utils/approvedBidFinancials';
import { assessBid, type BidAssessmentInput } from '@/utils/bidDecision';

export function BidDecisionWorkspace({ boqId, tenderId, tenderTitle }: { boqId: string | null; tenderId: string; tenderTitle: string }) {
  const [approved, setApproved] = useState<ApprovedBidFinancials | null>(null);
  const [financialStatus, setFinancialStatus] = useState('Checking approved financial scenarios...');
  const [margin, setMargin] = useState('');
  useEffect(() => {
    let active = true;
    setApproved(null); setFinancialStatus('Checking approved financial scenarios...');
    void loadApprovedBidFinancials(tenderId, boqId || '').then(data => {
      if (!active) return;
      setApproved(data);
      setFinancialStatus(data ? 'Approved scenario v' + data.scenarioVersion + ' loaded. Financial figures are read-only.' : 'No approved financial scenario linked to this tender and BOQ.');
    }).catch(() => { if (active) setFinancialStatus('Unable to retrieve approved financial figures.'); });
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
  const fields = [
    ['Expected margin %', margin, setMargin], ['Risk-adjusted margin %', riskMargin, setRiskMargin],
    ['Capacity score (0–100)', capacity, setCapacity], ['Compliance score (0–100)', compliance, setCompliance],
    ['Delivery readiness (0–100)', delivery, setDelivery], ['Strategic fit (0–100)', fit, setFit]
  ] as const;
  return <section aria-label="Bid No-Bid assessment" className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-4 space-y-3">
    <h3 className="font-semibold text-slate-900">Bid / No-Bid Assessment — {tenderTitle}</h3>
    <p role="status" className="text-sm text-cyan-900">{financialStatus}</p>
    {approved && <p className="text-sm text-slate-700">Approved selling value: R {approved.sellingValue.toFixed(2)} | Allowable cost: R {approved.allowableCost.toFixed(2)} | Escalation: {approved.riskEscalationPercent}% | Expected margin: {approved.expectedMarginPercent.toFixed(2)}% | Risk-adjusted margin: {approved.riskAdjustedMarginPercent.toFixed(2)}%</p>}
    <p className="text-sm text-slate-600">Linked BOQ: {boqId || 'Not linked'}. Enter verified commercial and readiness inputs. Financial values use an approved Allowables scenario when available; otherwise manual estimates are provisional. Draft assessment only; no database changes, approvals or BOQ credits used.</p>
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
      <strong>Recommendation: {assessment.recommendation.replaceAll('_', ' ')}</strong>
      <span className="ml-3">Readiness score: {assessment.score === null ? 'Incomplete' : assessment.score + '/100'}</span>
      <ul className="mt-2 list-disc pl-5">{assessment.reasons.map(reason=><li key={reason}>{reason}</li>)}</ul>
      <p className="mt-2 text-slate-600">Indicative decision support only. Final bid approval requires an authorised reviewer. Scores and thresholds are provisional.</p>
    </div>
  </section>;
}
