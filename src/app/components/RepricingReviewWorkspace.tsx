import { useCallback, useEffect, useState } from 'react';
import { decideRepricingScenario, listAssignedRepricingReviews, type RepricingReview } from '@/utils/repricingStorage';

export function RepricingReviewWorkspace() {
  const [reviews, setReviews] = useState<RepricingReview[]>([]);
  const [notes, setNotes] = useState<Record<string,string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const refresh = useCallback(async () => {
    try { setReviews(await listAssignedRepricingReviews()); setMessage(''); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to load assigned reviews'); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const decide = async (id: string, approve: boolean) => {
    setBusy(id); setMessage('');
    try {
      await decideRepricingScenario(id, approve, notes[id] || '');
      await refresh();
      setMessage(approve ? 'Scenario approved and audited.' : 'Scenario rejected and audited.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Review decision failed'); }
    finally { setBusy(null); }
  };
  return <section className="rounded-lg border p-4 space-y-3" aria-label="Assigned repricing reviews">
    <div className="flex items-center justify-between"><h3 className="font-semibold">Assigned Repricing Reviews</h3>
      <button type="button" className="rounded border px-3 py-1" onClick={() => void refresh()}>Refresh</button></div>
    <p className="text-sm text-slate-600">Only assigned reviewers can approve or reject submitted scenarios. The original BOQ is never modified by a decision.</p>
    {reviews.length === 0 && <p className="text-sm text-slate-500">No submitted scenarios awaiting your review.</p>}
    {reviews.map(review => <div key={review.id} className="rounded border p-3 space-y-2 text-sm">
      <div><strong>BOQ {review.boq_id}</strong> — Scenario v{review.version}</div>
      <div>Selling value: {review.selling_value ?? 'Incomplete'} | Allowable cost: {review.allowable_cost ?? 'Incomplete'} | Risk escalation: {review.risk_escalation_percent}%</div>
      <label className="block">Decision note / rejection reason
        <textarea className="mt-1 w-full rounded border p-2" value={notes[review.id] || ''} onChange={e=>setNotes(p=>({...p,[review.id]:e.target.value}))} />
      </label>
      <div className="flex gap-2">
        <button type="button" disabled={busy===review.id} className="rounded bg-cyan-700 px-3 py-2 text-white disabled:opacity-50" onClick={()=>void decide(review.id,true)}>Approve</button>
        <button type="button" disabled={busy===review.id || !(notes[review.id] || '').trim()} className="rounded border px-3 py-2 disabled:opacity-50" onClick={()=>void decide(review.id,false)}>Reject</button>
      </div>
    </div>)}
    {message && <p role="status" className="text-sm">{message}</p>}
  </section>;
}
