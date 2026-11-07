import { TenderIntakeWorkspace } from './TenderIntakeWorkspace';
import { TenderRiskWorkspace } from './TenderRiskWorkspace';
import { RepricingReviewWorkspace } from './RepricingReviewWorkspace';
import { BidDecisionWorkspace } from './BidDecisionWorkspace';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';

type Opportunity = { id: string; customer_name: string; tender_title: string; tender_reference: string | null;
  stage: string; due_date: string | null; notes: string | null; linked_bill_id: string | null };
type PublishedLead = { id: string; title: string; category: string; province: string | null; status: string; published_at: string };
type SupplierResponse = { id: string; lead_id: string; message: string; created_at: string; supplier_id: string };
const stages = ['Lead', 'Qualified', 'BOQ Pricing', 'Submitted', 'Won', 'Lost'];
export function TenderPipeline({ onStartPricing, onOpenTenderImport, onSelectOpportunity, selectedOpportunityId, focusBid = false, focusIntake = false }: {
  onStartPricing: () => void; onOpenTenderImport: () => void; onSelectOpportunity: (id: string | null) => void; selectedOpportunityId: string | null; focusBid?: boolean; focusIntake?: boolean;
}) {
  const [workspace, setWorkspace] = useState<'crm' | 'tenders' | 'suppliers'>('tenders');
  const [assessmentTenderId, setAssessmentTenderId] = useState<string | null>(null);
  const [rows, setRows] = useState<Opportunity[]>([]);
  const [publishedLeads, setPublishedLeads] = useState<PublishedLead[]>([]);
  const [leadListError, setLeadListError] = useState('');
  const [responsesByLead, setResponsesByLead] = useState<Record<string, SupplierResponse[]>>({});
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [responseError, setResponseError] = useState('');
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setRows([]); setError('Sign in to view your tenders.'); return; }
    const { data, error: failure } = await supabase.from('tender_opportunities')
      .select('id,customer_name,tender_title,tender_reference,stage,due_date,notes,linked_bill_id')
      .eq('owner_user_id', user.id)
      .order('created_at', { ascending: false }).limit(100);
    if (failure) { setError('CRM database unavailable. Apply the tender_opportunities migration and verify access.'); return; }
    setError(''); setRows((data || []) as Opportunity[]);
  }, []);
  // Keep intake, risk and bid assessment bound to the selected CRM tender.
  // Never silently switch to another tender when the selected ID is unavailable.
  useEffect(() => {
    if (focusBid || focusIntake) setWorkspace('tenders');
    if (!selectedOpportunityId) {
      setAssessmentTenderId(null);
      return;
    }
    setAssessmentTenderId(rows.some(row => row.id === selectedOpportunityId) ? selectedOpportunityId : null);
  }, [focusBid, focusIntake, selectedOpportunityId, rows]);
    const loadPublishedLeads = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setPublishedLeads([]); setLeadListError('Sign in to view your published leads.'); return; }
    const { data, error: failure } = await supabase.from('supplier_lead_offers')
      .select('id,title,category,province,status,published_at')
      .eq('contractor_user_id', user.id).order('published_at', { ascending: false }).limit(100);
    if (failure) { setLeadListError('Unable to load published supplier leads.'); return; }
    setLeadListError(''); setPublishedLeads((data || []) as PublishedLead[]);
  }, []);
  useEffect(() => { void load(); void loadPublishedLeads(); }, [load, loadPublishedLeads]);
  const loadResponses = async (leadId: string) => {
    if (expandedLead === leadId) { setExpandedLead(null); return; }
    setResponseError('');
    if (!publishedLeads.some(lead => lead.id === leadId)) { setResponseError('This lead is not in your published leads.'); return; }
    const { data, error: failure } = await supabase.from('supplier_lead_responses')
      .select('id,lead_id,message,created_at,supplier_id')
      .eq('lead_id',leadId).order('created_at',{ascending:false}).limit(100);
    if (failure) { setResponseError('Unable to load supplier responses.'); return; }
    setResponsesByLead(prev => ({...prev,[leadId]:(data || []) as SupplierResponse[]}));
    setExpandedLead(leadId);
  };
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Sign in to update a tender.'); return; }
    const { data: updated, error: failure } = await supabase.from('tender_opportunities')
      .update({ stage }).eq('id', id).eq('owner_user_id', user.id).select('id');
    if (failure) { toast.error(failure.message); return; }
    if (!updated?.length) { toast.error('Tender not found or you do not have permission to update it.'); await load(); return; }
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
    toast.success('Supplier lead published'); await loadPublishedLeads();
  };
  return <section className="space-y-5 rounded-xl border bg-white p-5">
    <div><h2 className="text-xl font-semibold text-slate-900">CRM &amp; Tender Pipeline</h2>
      <p className="text-sm text-gray-600">Connected opportunities, tender pricing and supplier leads.</p></div>
    <nav aria-label="CRM and tender workspace" className="flex flex-wrap gap-2 border-b pb-3">
      {([
        ['crm','CRM Opportunities'],['tenders','Tender Pipeline'],['suppliers','Supplier Leads']
      ] as const).map(([key,label]) => (
        <button key={key} type="button" onClick={() => setWorkspace(key)} aria-current={workspace===key?'page':undefined}
          className={`rounded-lg border px-3 py-2 text-sm font-medium ${workspace===key?'border-[#0077b6] bg-cyan-50 text-[#0077b6]':'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>{label}</button>
      ))}
    </nav>
    {error && <p role="alert" className="rounded bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}
    {workspace !== 'suppliers' && <form onSubmit={create} className="grid gap-3 md:grid-cols-5">
      <input aria-label="Customer name" required placeholder="Customer name" className="border rounded p-2" value={customer} onChange={e=>setCustomer(e.target.value)} />
      <input aria-label="Tender title" required placeholder="Tender title" className="border rounded p-2" value={title} onChange={e=>setTitle(e.target.value)} />
      <input aria-label="Tender reference" placeholder="Tender reference" className="border rounded p-2" value={reference} onChange={e=>setReference(e.target.value)} />
      <input aria-label="Submission deadline" type="date" className="border rounded p-2" value={due} onChange={e=>setDue(e.target.value)} />
      <button type="submit" disabled={busy} className="rounded bg-cyan-700 text-white px-3 py-2 disabled:opacity-50">Add opportunity</button>
    </form>}
    {workspace !== 'suppliers' && <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-sm">
      <thead><tr className="border-b text-left"><th className="p-2">Customer</th><th className="p-2">Tender</th><th className="p-2">Deadline</th><th className="p-2">Stage</th><th className="p-2">Action</th></tr></thead>
      <tbody>{rows.map(row=><tr key={row.id} className={row.id === selectedOpportunityId ? 'border-b bg-cyan-50' : 'border-b'}>
        <td className="p-2">{row.customer_name}</td>
        <td className="p-2">{row.tender_title}<div className="text-xs text-gray-500">{row.tender_reference || ''}</div></td>
        <td className="p-2">{row.due_date || 'Not set'}</td>
        <td className="p-2"><select aria-label="Tender stage" value={row.stage} className="border rounded p-1" onChange={e=>void setStage(row.id,e.target.value)}>
          {stages.map(stage=><option key={stage} value={stage}>{stage}</option>)}</select></td>
        <td className="p-2 space-y-2"><button type="button" className="rounded border px-3 py-1 text-cyan-800" onClick={()=>{onSelectOpportunity(row.id);onStartPricing();}}>Price BOQ</button>
          <button type="button" className="block rounded border px-3 py-1 text-cyan-800" onClick={()=>{onSelectOpportunity(row.id);setAssessmentTenderId(row.id);setWorkspace('tenders');}}>Bid / No-Bid</button>
          <button type="button" className="block rounded border px-3 py-1 text-cyan-800" onClick={()=>setPublishing(publishing===row.id?null:row.id)}>Publish supplier lead</button>
          {publishing===row.id && <div className="space-y-2 min-w-56">
            <input aria-label="Supplier lead category" className="w-full rounded border p-1" placeholder="Supplier category" value={leadCategory} onChange={e=>setLeadCategory(e.target.value)} />
            <input aria-label="Supplier lead province" className="w-full rounded border p-1" placeholder="Province (optional)" value={leadProvince} onChange={e=>setLeadProvince(e.target.value)} />
            <textarea aria-label="Public supplier lead summary" className="w-full rounded border p-1" placeholder="Public summary only — no confidential tender details" value={leadSummary} onChange={e=>setLeadSummary(e.target.value)} />
            <button type="button" disabled={publishBusy===row.id} className="rounded bg-cyan-700 px-3 py-1 text-white disabled:opacity-50" onClick={()=>void publishSupplierLead(row)}>Confirm publication</button>
          </div>}
        </td>
      </tr>)}</tbody>
    </table></div>}
    {workspace !== 'suppliers' && selectedOpportunityId && !rows.some(row=>row.id===selectedOpportunityId) && <p role="alert" className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">The selected tender is not available in your account. Select an accessible tender in CRM.</p>}
    {workspace !== 'suppliers' && <RepricingReviewWorkspace />}
    {workspace !== 'suppliers' && assessmentTenderId && rows.some(row=>row.id===assessmentTenderId) && (()=>{const tender=rows.find(row=>row.id===assessmentTenderId)!;return <TenderIntakeWorkspace key={'intake-'+tender.id} opportunity={tender} onOpenTenderImport={onOpenTenderImport}/>;})()}
    {workspace !== 'suppliers' && !focusIntake && assessmentTenderId && rows.some(row=>row.id===assessmentTenderId) && (() => { const tender = rows.find(row=>row.id===assessmentTenderId)!; return <TenderRiskWorkspace key={'risk-'+tender.id} tenderId={tender.id} boqId={tender.linked_bill_id} />; })()}
    {workspace !== 'suppliers' && !focusIntake && assessmentTenderId && rows.some(row=>row.id===assessmentTenderId) && (() => { const tender = rows.find(row=>row.id===assessmentTenderId)!; return <BidDecisionWorkspace key={tender.id} tenderId={tender.id} boqId={tender.linked_bill_id} tenderTitle={tender.tender_title} />; })()}
    {workspace !== 'suppliers' && rows.length === 0 && !error && <p className="text-sm text-gray-500">No opportunities yet.</p>}
    {workspace === 'suppliers' && <section aria-label="Published supplier leads" className="space-y-3 border-t pt-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h3 className="font-semibold">Published Supplier Leads</h3>
          <p className="text-sm text-gray-600">Your supplier-facing opportunities and supplier responses.</p></div>
        <button type="button" className="rounded border px-3 py-1 text-sm" onClick={()=>void loadPublishedLeads()}>Refresh published leads</button>
      </div>
      {leadListError && <p role="alert" className="text-sm text-red-700">{leadListError}</p>}
      {!leadListError && publishedLeads.length===0 && <p className="text-sm text-gray-600">No supplier leads published yet.</p>}
      {publishedLeads.length>0 && <div className="overflow-x-auto"><table className="w-full min-w-[500px] text-sm">
        <thead><tr className="border-b text-left"><th className="p-2">Opportunity</th><th className="p-2">Category</th><th className="p-2">Province</th><th className="p-2">Status</th><th className="p-2">Published</th><th className="p-2">Responses</th></tr></thead>
        <tbody>{publishedLeads.map(lead=><tr key={lead.id} className="border-b">
          <td className="p-2">{lead.title}</td><td className="p-2">{lead.category}</td>
          <td className="p-2">{lead.province || 'All provinces'}</td><td className="p-2">{lead.status}</td>
          <td className="p-2">{new Date(lead.published_at).toLocaleDateString()}</td>
          <td className="p-2"><button type="button" className="rounded border px-2 py-1" onClick={()=>void loadResponses(lead.id)}>{expandedLead===lead.id?'Hide responses':'View responses'}</button></td>
        </tr>)}</tbody>
      </table></div>}
      {responseError && <p role="alert" className="text-sm text-red-700">{responseError}</p>}
      {expandedLead && <div className="space-y-2 rounded border p-3">
        <h4 className="font-semibold">Supplier responses</h4>
        {(responsesByLead[expandedLead] || []).length===0 && <p className="text-sm text-gray-600">No responses received yet.</p>}
        {(responsesByLead[expandedLead] || []).map(response=><article key={response.id} className="rounded border p-3">
          <p className="whitespace-pre-wrap text-sm">{response.message}</p>
          <p className="mt-1 text-xs text-gray-500">Supplier reference: {response.supplier_id.slice(0,8)} · {new Date(response.created_at).toLocaleString()}</p>
        </article>)}
      </div>}
    </section>}

  </section>;
}
