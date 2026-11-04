import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

type Metrics = { tenders: number; pricedBills: number; supplierLeads: number; pricedValue: number };
const rand = (value: number) => 'R ' + value.toLocaleString('en-ZA', { maximumFractionDigits: 0 });

/** Account-scoped operational overview. No synthetic or cross-tenant metrics. */
export function TenderIntelligenceOverview({ onOpenTenders, onOpenPricing, onOpenLeads }: {
  onOpenTenders: () => void; onOpenPricing: () => void; onOpenLeads: () => void;
}) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    async function load() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!active) return;
      if (authError || !user) { setError('Sign in to view your tender intelligence.'); return; }
      const [tenders, bills, leads] = await Promise.all([
        supabase.from('tender_opportunities').select('id', { count: 'exact', head: true }).eq('owner_user_id', user.id),
        supabase.from('bills').select('total_cost').eq('user_id', user.id),
        supabase.from('supplier_lead_offers').select('id', { count: 'exact', head: true }).eq('contractor_user_id', user.id),
      ]);
      if (!active) return;
      if (tenders.error || bills.error || leads.error) {
        setError('Some account metrics could not be loaded. Please retry later.');
        return;
      }
      const priced = (bills.data || []).filter(b => Number(b.total_cost) > 0);
      setMetrics({
        tenders: tenders.count ?? 0,
        pricedBills: priced.length,
        supplierLeads: leads.count ?? 0,
        pricedValue: priced.reduce((sum, b) => sum + Number(b.total_cost), 0),
      });
    }
    load().catch(() => { if (active) setError('Unable to retrieve tender intelligence.'); });
    return () => { active = false; };
  }, []);

  return <section aria-label="Tender Intelligence Overview" className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div><h2 className="text-xl font-bold text-slate-900">Tender Intelligence Overview</h2>
        <p className="text-sm text-slate-600">Your account's recorded tender and BOQ activity</p></div>
      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">Live account data</span>
    </div>
    {error && <p role="alert" className="rounded bg-amber-50 p-3 text-sm text-amber-900">{error}</p>}
    {!metrics && !error && <p role="status" className="text-sm text-slate-600">Loading account metrics…</p>}
    {metrics && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: 'Tender opportunities', value: String(metrics.tenders), action: onOpenTenders },
        { label: 'Priced BOQs', value: String(metrics.pricedBills), action: onOpenPricing },
        { label: 'Recorded priced BOQ value', value: rand(metrics.pricedValue), action: onOpenPricing },
        { label: 'Supplier lead offers', value: String(metrics.supplierLeads), action: onOpenLeads },
      ].map(card => <button type="button" key={card.label} onClick={card.action} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-left hover:border-cyan-500 focus-visible:outline-2 focus-visible:outline-cyan-600">
        <span className="block text-xs font-medium text-slate-600">{card.label}</span>
        <span className="mt-2 block text-2xl font-bold text-slate-900">{card.value}</span>
      </button>)}
    </div>}
    <p className="mt-3 text-xs text-slate-500">Priced BOQ value is the sum of recorded positive BOQ totals, not contracted revenue or actual expenditure.</p>
  </section>;
}
