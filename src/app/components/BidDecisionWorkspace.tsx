import { useMemo, useState } from 'react';
import { assessBid, type BidAssessmentInput } from '@/utils/bidDecision';

export function BidDecisionWorkspace({ boqId, tenderTitle }: { boqId: string | null; tenderTitle: string }) {
  const [margin, setMargin] = useState('');
  const [riskMargin, setRiskMargin] = useState('');
  const [capacity, setCapacity] = useState('');
  const [compliance, setCompliance] = useState('');
  const [delivery, setDelivery] = useState('');
  const [fit, setFit] = useState('');
  const [mandatory, setMandatory] = useState<'unknown'|'yes'|'no'>('unknown');
  const numberOrNull = (value: string) => value.trim() === '' ? null : Number(value);
  const input: BidAssessmentInput = {
    boqId: boqId || '', expectedMarginPercent: numberOrNull(margin),
    riskAdjustedMarginPercent: numberOrNull(riskMargin),
    capacityScore: numberOrNull(capacity), complianceScore: numberOrNull(compliance),
    deliveryScore: numberOrNull(delivery), strategicFitScore: numberOrNull(fit),
    mandatoryRequirementsMet: mandatory === 'unknown' ? null : mandatory === 'yes'
  };
  const assessment = useMemo(() => assessBid(input), [boqId, margin, riskMargin, capacity, compliance, delivery, fit, mandatory]);
  const fields = [
    ['Expected margin %', margin, setMargin], ['Risk-adjusted margin %', riskMargin, setRiskMargin],
    ['Capacity score (0–100)', capacity, setCapacity], ['Compliance score (0–100)', compliance, setCompliance],
    ['Delivery readiness (0–100)', delivery, setDelivery], ['Strategic fit (0–100)', fit, setFit]
  ] as const;
  return <section aria-label="Bid No-Bid assessment" className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-4 space-y-3">
    <h3 className="font-semibold text-slate-900">Bid / No-Bid Assessment — {tenderTitle}</h3>
    <p className="text-sm text-slate-600">Linked BOQ: {boqId || 'Not linked'}. Enter verified commercial and readiness inputs. These are manual assessment values, not automatically retrieved from Allowables. Draft assessment only; no database changes, approvals or BOQ credits used.</p>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map(([label, value, setter]) => <label key={label} className="text-sm text-slate-700">{label}
        <input className="mt-1 w-full rounded border bg-white p-2" type="number" step="0.01" aria-label={label} value={value} onChange={event => setter(event.target.value)} />
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
