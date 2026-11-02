import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';

type Lead = { id: string; title: string; category: string; province: string | null; summary: string; closes_at: string | null; published_at: string };

export function SupplierLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'not-supplier' | 'signed-out' | 'pending' | 'error'>('loading');
  const [error, setError] = useState('');
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [supplierCriteria, setSupplierCriteria] = useState<{ categories: string[]; provinces: string[] } | null>(null);
  const [responseLeadId, setResponseLeadId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responding, setResponding] = useState(false);
  const [respondedLeadIds, setRespondedLeadIds] = useState<string[]>([]);
  const refresh = useCallback(async () => {
    setState('loading');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) { setState('signed-out'); return; }
    // This lookup is for UI context only. Lead access is enforced by supplier_lead_offers RLS.
    const { data: supplier, error: supplierError } = await supabase.from('suppliers')
      .select('id,status,product_categories,province,operating_provinces').eq('user_id',user.id).limit(1).maybeSingle();
    if (supplierError) { setError('Unable to verify supplier profile.'); setState('error'); return; }
    if (!supplier) { setState('not-supplier'); return; }
    setSupplierId(supplier.id);
    setSupplierCriteria({ categories: supplier.product_categories || [], provinces: Array.from(new Set([supplier.province, ...(supplier.operating_provinces || [])].filter(Boolean))) as string[] });
    if (supplier.status !== 'approved') { setLeads([]); setState('pending'); return; }
    const { data, error: failure } = await supabase.from('supplier_lead_offers')
      .select('id,title,category,province,summary,closes_at,published_at')
      .eq('status','open').order('published_at',{ascending:false}).limit(50);
    if (failure) { setError('Lead feed is not yet available.'); setState('error'); return; }
    setLeads((data || []) as Lead[]);
    const { data: existing, error: responseError } = await supabase.from('supplier_lead_responses')
      .select('lead_id').eq('supplier_id',supplier.id).limit(1000);
    if (responseError) { setError('Unable to verify previously submitted responses.'); setState('error'); return; }
    setRespondedLeadIds((existing || []).map(row=>row.lead_id));
    setState('ready');
  },[]);
  useEffect(()=>{void refresh();},[refresh]);
  const submitResponse = async (leadId: string) => {
    if (!supplierId || responseMessage.trim().length < 10) { toast.error('Enter a message of at least 10 characters.'); return; }
    setResponding(true);
    const { error: failure } = await supabase.from('supplier_lead_responses').insert({
      lead_id: leadId, supplier_id: supplierId, message: responseMessage.trim()
    });
    setResponding(false);
    if (failure) {
      const message = failure.code === '23505'
        ? 'You have already responded to this lead.'
        : failure.code === '42501'
          ? 'Your response was blocked by supplier eligibility rules. Please verify your campaign or paid entitlement with Qilly support.'
          : failure.code === '23514'
            ? 'Your response does not meet the message requirements (10–2000 characters).'
            : 'Unable to submit response. Please try again or contact Qilly support.';
      console.error('Supplier response submission failed', { code: failure.code, message: failure.message });
      toast.error(message);
      return;
    }
    setRespondedLeadIds(previous=>[...previous,leadId]);
    toast.success('Response sent to the contractor');
    setResponseLeadId(null); setResponseMessage('');
  };
  return <section className="space-y-4 rounded-xl border bg-white p-5">
    <div className="flex items-center justify-between gap-3"><div>
      <h2 className="text-xl font-semibold">Supplier Leads</h2>
      <p className="text-sm text-gray-600">Matching published opportunities. Access is verified by Qilly.</p>
    </div><button type="button" className="rounded border px-3 py-2 text-sm" onClick={()=>void refresh()}>Refresh</button></div>
    {state==='loading' && <p role="status">Loading supplier opportunities…</p>}
    {state==='not-supplier' && <p>This account is not registered as a supplier. Contractors can publish supplier opportunities from CRM &amp; Tenders.</p>}
    {state==='signed-out' && <p>Your supplier session is not active. Please sign out and sign in again with your approved supplier credentials.</p>}
    {state==='pending' && <p>Your supplier profile has not yet been approved. Lead access becomes available after approval and campaign activation.</p>}
    {state==='error' && <p role="alert" className="text-red-700">{error}</p>}
    {state==='ready' && leads.length===0 && supplierCriteria && <p className="text-sm text-gray-600">Your registered categories: {supplierCriteria.categories.join(', ') || 'None'} · Operating provinces: {supplierCriteria.provinces.join(', ') || 'None'}</p>}
    {state==='ready' && leads.length===0 && <p>No eligible supplier leads are available for your account. Lead access requires an approved supplier profile, a matching category and operating province, and an active campaign or verified paid entitlement. If you expected an opportunity, check your supplier registration details or contact Qilly support.</p>}
    {state==='ready' && leads.map(lead=><article key={lead.id} className="rounded-lg border p-4">
      <h3 className="font-semibold">{lead.title}</h3>
      <p className="text-xs text-gray-600">{lead.category} · {lead.province || 'All provinces'}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm">{lead.summary}</p>
      {lead.closes_at && <p className="mt-2 text-xs text-gray-600">Closes: {new Date(lead.closes_at).toLocaleDateString()}</p>}
      {respondedLeadIds.includes(lead.id)
        ? <p className="mt-3 text-sm font-medium text-green-700">Response submitted</p>
        : <button type="button" className="mt-3 rounded border px-3 py-1 text-cyan-800" onClick={()=>setResponseLeadId(responseLeadId===lead.id?null:lead.id)}>Respond to lead</button>}
      {responseLeadId===lead.id && !respondedLeadIds.includes(lead.id) && <div className="mt-3 space-y-2">
        <textarea aria-label="Supplier response message" className="w-full rounded border p-2" maxLength={2000} placeholder="Describe your interest and relevant offering" value={responseMessage} onChange={e=>setResponseMessage(e.target.value)} />
        <button type="button" disabled={responding} className="rounded bg-cyan-700 px-3 py-2 text-white disabled:opacity-50" onClick={()=>void submitResponse(lead.id)}>Submit response</button>
      </div>}
    </article>)}
  </section>;
}
