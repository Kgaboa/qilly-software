import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

type Lead = { id: string; title: string; category: string; province: string | null; summary: string; closes_at: string | null; published_at: string };

export function SupplierLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'not-supplier' | 'error'>('loading');
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    setState('loading');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) { setState('not-supplier'); return; }
    // This lookup is for UI context only. Lead access is enforced by supplier_lead_offers RLS.
    const { data: supplier, error: supplierError } = await supabase.from('suppliers')
      .select('id,status').eq('user_id',user.id).limit(1).maybeSingle();
    if (supplierError) { setError('Unable to verify supplier profile.'); setState('error'); return; }
    if (!supplier) { setState('not-supplier'); return; }
    if (supplier.status !== 'approved') { setLeads([]); setState('ready'); return; }
    const { data, error: failure } = await supabase.from('supplier_lead_offers')
      .select('id,title,category,province,summary,closes_at,published_at')
      .eq('status','open').order('published_at',{ascending:false}).limit(50);
    if (failure) { setError('Lead feed is not yet available.'); setState('error'); return; }
    setLeads((data || []) as Lead[]); setState('ready');
  },[]);
  useEffect(()=>{void refresh();},[refresh]);
  return <section className="space-y-4 rounded-xl border bg-white p-5">
    <div className="flex items-center justify-between gap-3"><div>
      <h2 className="text-xl font-semibold">Supplier Leads</h2>
      <p className="text-sm text-gray-600">Matching published opportunities. Access is verified by Qilly.</p>
    </div><button type="button" className="rounded border px-3 py-2 text-sm" onClick={()=>void refresh()}>Refresh</button></div>
    {state==='loading' && <p role="status">Loading supplier opportunities…</p>}
    {state==='not-supplier' && <p>Sign in with an approved supplier account to view leads.</p>}
    {state==='error' && <p role="alert" className="text-red-700">{error}</p>}
    {state==='ready' && leads.length===0 && <p>No matching leads available. Your campaign may not be active yet.</p>}
    {state==='ready' && leads.map(lead=><article key={lead.id} className="rounded-lg border p-4">
      <h3 className="font-semibold">{lead.title}</h3>
      <p className="text-xs text-gray-600">{lead.category} · {lead.province || 'All provinces'}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm">{lead.summary}</p>
      {lead.closes_at && <p className="mt-2 text-xs text-gray-600">Closes: {new Date(lead.closes_at).toLocaleDateString()}</p>}
    </article>)}
  </section>;
}
