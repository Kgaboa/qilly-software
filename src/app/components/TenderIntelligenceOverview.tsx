import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

type Metrics = { tenders: number; pricedBills: number; supplierLeads: number; pricedValue: number; stages: Record<string, number>; durationConfigured: number };
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
        supabase.from('tender_opportunities').select('id,stage').eq('owner_user_id', user.id),
        supabase.from('bills').select('total_cost,project_settings').eq('user_id', user.id),
        supabase.from('supplier_lead_offers').select('id', { count: 'exact', head: true }).eq('contractor_user_id', user.id),
      ]);
      if (!active) return;
      if (tenders.error || bills.error || leads.error) {
        setError('Some account metrics could not be loaded. Please retry later.');
        return;
      }
      const priced = (bills.data || []).filter(b => Number(b.total_cost) > 0);
      const stages = (tenders.data || []).reduce((acc: Record<string, number>, row) => { const stage = String(row.stage || 'Unspecified'); acc[stage] = (acc[stage] || 0) + 1; return acc; }, {});
      setMetrics({
        tenders: (tenders.data || []).length,
        stages,
        durationConfigured: priced.filter(b => { const months = Number(b.project_settings?.duration); return Number.isInteger(months) && months >= 1 && months <= 36; }).length,
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
    {metrics && <div className="mt-4 grid gap-3 lg:grid-cols-2">
      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Tender pipeline by stage</h3>
        {Object.keys(metrics.stages).length === 0 ? <p className="mt-2 text-sm text-slate-500">No tender opportunities recorded.</p> :
          <div className="mt-3 space-y-2">{Object.entries(metrics.stages).sort(([a],[b]) => a.localeCompare(b)).map(([stage, count]) =>
            <div key={stage} className="flex items-center gap-3 text-xs">
              <span className="w-28 shrink-0 text-slate-700">{stage}</span>
              <div className="h-2 flex-1 overflow-hidden rounded bg-slate-100"><div className="h-full rounded bg-cyan-600" style={{ width: `${Math.round(count / Math.max(1, metrics.tenders) * 100)}%` }} /></div>
              <span className="w-7 text-right font-semibold">{count}</span>
            </div>)}</div>}
      </div>
      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Programme preparation</h3>
        <p className="mt-2 text-2xl font-bold text-slate-900">{metrics.durationConfigured} <span className="text-sm font-normal text-slate-500">/ {metrics.pricedBills} priced BOQs</span></p>
        <p className="mt-1 text-xs text-slate-600">Priced BOQs with a saved project duration (1–36 months). This does not indicate an approved programme or actual progress.</p>
        <button type="button" onClick={onOpenPricing} className="mt-3 text-sm font-semibold text-cyan-700 underline">Review priced BOQs</button>
      </div>
    </div>}
    <p className="mt-3 text-xs text-slate-500">Priced BOQ value is the sum of recorded positive BOQ totals, not contracted revenue or actual expenditure.</p>
  </section>;
}
