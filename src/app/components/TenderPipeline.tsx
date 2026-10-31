import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';

type Opportunity = { id: string; customer_name: string; tender_title: string; tender_reference: string | null;
  stage: string; due_date: string | null; notes: string | null; linked_bill_id: string | null };
const stages = ['Lead', 'Qualified', 'BOQ Pricing', 'Submitted', 'Won', 'Lost'];
export function TenderPipeline({ onStartPricing, onSelectOpportunity, selectedOpportunityId }: {
  onStartPricing: () => void; onSelectOpportunity: (id: string | null) => void; selectedOpportunityId: string | null;
}) {
  const [rows, setRows] = useState<Opportunity[]>([]);
  const [customer, setCustomer] = useState('');
  const [title, setTitle] = useState('');
  const [reference, setReference] = useState('');
  const [due, setDue] = useState('');
  const [busy, setBusy] = useState(false);
  const [publishBusy, setPublishBusy] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [leadCategory, setLeadCategory] = useState('');
  const [leadProvince, setLeadProvince] = useState('');
  const [leadSummary, setLeadSummary] = useState('');
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    const { data, error: failure } = await supabase.from('tender_opportunities')
      .select('id,customer_name,tender_title,tender_reference,stage,due_date,notes,linked_bill_id')
      .order('created_at', { ascending: false }).limit(100);
    if (failure) { setError('CRM database unavailable. Apply the tender_opportunities migration and verify access.'); return; }
    setError(''); setRows((data || []) as Opportunity[]);
  }, []);
  useEffect(() => { void load(); }, [load]);
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim() || !title.trim()) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Sign in to create a tender.'); setBusy(false); return; }
    const { error: failure } = await supabase.from('tender_opportunities').insert({
      owner_user_id: user.id, customer_name: customer.trim(), tender_title: title.trim(),
      tender_reference: reference.trim() || null, due_date: due || null
    });
    setBusy(false);
    if (failure) { setError(failure.message); return; }
    setCustomer(''); setTitle(''); setReference(''); setDue('');
    toast.success('Tender opportunity created'); await load();
  };
  const setStage = async (id: string, stage: string) => {
    const { error: failure } = await supabase.from('tender_opportunities').update({ stage }).eq('id', id);
    if (failure) { toast.error(failure.message); return; }
    await load();
  };
  const publishSupplierLead = async (opportunity: Opportunity) => {
    if (!leadCategory.trim() || leadSummary.trim().length < 10) {
      toast.error('Provide a supplier category and a summary of at least 10 characters.');
      return;
    }
    setPublishBusy(opportunity.id);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Sign in to publish a lead.'); setPublishBusy(null); return; }
    // Publish only an explicitly authored summary. Never copy private CRM notes,
    // customer identity, BOQ pricing, or tender attachments into supplier offers.
    const { error: failure } = await supabase.from('supplier_lead_offers').insert({
      contractor_user_id: user.id, title: opportunity.tender_title,
      category: leadCategory.trim(), province: leadProvince.trim() || null,
      summary: leadSummary.trim(), status: 'open'
    });
    setPublishBusy(null);
    if (failure) { toast.error(failure.message); return; }
    setPublishing(null); setLeadCategory(''); setLeadProvince(''); setLeadSummary('');
    toast.success('Supplier lead published');
  };
  return <section className="space-y-5 rounded-xl border bg-white p-5">
    <div><h2 className="text-xl font-semibold">CRM &amp; Tender Pipeline</h2>
      <p className="text-sm text-gray-600">Track customer opportunities and start pricing from the selected tender.</p></div>
    {error && <p role="alert" className="rounded bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}
    <form onSubmit={create} className="grid gap-3 md:grid-cols-5">
      <input aria-label="Customer name" required placeholder="Customer name" className="border rounded p-2" value={customer} onChange={e=>setCustomer(e.target.value)} />
      <input aria-label="Tender title" required placeholder="Tender title" className="border rounded p-2" value={title} onChange={e=>setTitle(e.target.value)} />
      <input aria-label="Tender reference" placeholder="Tender reference" className="border rounded p-2" value={reference} onChange={e=>setReference(e.target.value)} />
      <input aria-label="Submission deadline" type="date" className="border rounded p-2" value={due} onChange={e=>setDue(e.target.value)} />
      <button type="submit" disabled={busy} className="rounded bg-cyan-700 text-white px-3 py-2 disabled:opacity-50">Add opportunity</button>
    </form>
    <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-sm">
      <thead><tr className="border-b text-left"><th className="p-2">Customer</th><th className="p-2">Tender</th><th className="p-2">Deadline</th><th className="p-2">Stage</th><th className="p-2">Action</th></tr></thead>
      <tbody>{rows.map(row=><tr key={row.id} className={row.id === selectedOpportunityId ? 'border-b bg-cyan-50' : 'border-b'}>
        <td className="p-2">{row.customer_name}</td>
        <td className="p-2">{row.tender_title}<div className="text-xs text-gray-500">{row.tender_reference || ''}</div></td>
        <td className="p-2">{row.due_date || 'Not set'}</td>
        <td className="p-2"><select aria-label="Tender stage" value={row.stage} className="border rounded p-1" onChange={e=>void setStage(row.id,e.target.value)}>
          {stages.map(stage=><option key={stage} value={stage}>{stage}</option>)}</select></td>
        <td className="p-2 space-y-2"><button type="button" className="rounded border px-3 py-1 text-cyan-800" onClick={()=>{onSelectOpportunity(row.id);onStartPricing();}}>Price BOQ</button>
          <button type="button" className="block rounded border px-3 py-1 text-cyan-800" onClick={()=>setPublishing(publishing===row.id?null:row.id)}>Publish supplier lead</button>
          {publishing===row.id && <div className="space-y-2 min-w-56">
            <input aria-label="Supplier lead category" className="w-full rounded border p-1" placeholder="Supplier category" value={leadCategory} onChange={e=>setLeadCategory(e.target.value)} />
            <input aria-label="Supplier lead province" className="w-full rounded border p-1" placeholder="Province (optional)" value={leadProvince} onChange={e=>setLeadProvince(e.target.value)} />
            <textarea aria-label="Public supplier lead summary" className="w-full rounded border p-1" placeholder="Public summary only — no confidential tender details" value={leadSummary} onChange={e=>setLeadSummary(e.target.value)} />
            <button type="button" disabled={publishBusy===row.id} className="rounded bg-cyan-700 px-3 py-1 text-white disabled:opacity-50" onClick={()=>void publishSupplierLead(row)}>Confirm publication</button>
          </div>}
        </td>
      </tr>)}</tbody>
    </table></div>
    {rows.length === 0 && !error && <p className="text-sm text-gray-500">No opportunities yet.</p>}
  </section>;
}
