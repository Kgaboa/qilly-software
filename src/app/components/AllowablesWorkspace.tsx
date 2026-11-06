import React, { useMemo, useState } from 'react';

type Item = { code?: string; name?: string; description?: string; quantity?: number | string; unit?: string; unitPrice?: number | string; totalPrice?: number | string };
type Props = { items: Item[]; originalTotal: number };
type Override = { selling?: string; allowable?: string };
const money = (n: number) => 'R ' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const validNumber = (n: unknown) => Number.isFinite(Number(n)) && Number(n) >= 0;
export function AllowablesWorkspace({ items, originalTotal }: Props) {
  const [overrides, setOverrides] = useState<Record<number, Override>>({});
  const [risk, setRisk] = useState('10');
  const [filter, setFilter] = useState('');
  const rows = useMemo(() => items.map((item, index) => {
    const quantity = Number(item.quantity);
    const originalRate = Number(item.unitPrice);
    const editable = Number.isFinite(quantity) && quantity > 0 && validNumber(originalRate);
    const selling = overrides[index]?.selling === undefined ? originalRate : Number(overrides[index].selling);
    const allowable = overrides[index]?.allowable === undefined || overrides[index]?.allowable === '' ? null : Number(overrides[index].allowable);
    const valid = editable && validNumber(selling) && (allowable === null || validNumber(allowable));
    return { item, index, quantity, originalRate, selling, allowable, valid, editable, originalValue: Number(item.totalPrice) || 0 };
  }), [items, overrides]);
  const eligible = rows.filter(r => r.editable);
  const invalid = eligible.filter(r => !r.valid).length;
  const costMissing = eligible.filter(r => r.allowable === null).length;
  const sellingValue = eligible.reduce((sum, r) => sum + (r.valid ? r.quantity * r.selling : 0), 0);
  const allowableCost = eligible.reduce((sum, r) => sum + (r.valid && r.allowable !== null ? r.quantity * r.allowable : 0), 0);
  const complete = eligible.length > 0 && invalid === 0 && costMissing === 0;
  const profit = sellingValue - allowableCost;
  const escalation = Number(risk);
  const validRisk = validNumber(escalation) && escalation <= 1000;
  const adjustedProfit = sellingValue - allowableCost * (1 + (validRisk ? escalation : 0) / 100);
  const update = (index: number, key: keyof Override, value: string) => setOverrides(prev => ({ ...prev, [index]: { ...prev[index], [key]: value } }));
  const visible = rows.filter(r => !filter || [r.item.code, r.item.name, r.item.description].some(v => String(v || '').toLowerCase().includes(filter.toLowerCase())));
  return <section className="mt-4 rounded-xl border border-cyan-200 bg-white p-4 space-y-4" aria-label="BOQ item-level allowables and margin">
    <div><h3 className="text-lg font-semibold">Allowables &amp; Profitability — BOQ item analysis</h3><p className="text-sm text-slate-600">Edit proposed selling rates and allowable unit costs. Changes are in-memory scenarios only; the historical priced BOQ is not modified.</p></div>
    <div className="grid gap-3 md:grid-cols-4 text-sm">
      <div className="rounded border p-3"><div className="text-slate-500">Scenario selling value</div><strong>{money(sellingValue)}</strong></div>
      <div className="rounded border p-3"><div className="text-slate-500">Estimated allowable cost</div><strong>{complete ? money(allowableCost) : 'Incomplete'}</strong></div>
      <div className="rounded border p-3"><div className="text-slate-500">Expected profit</div><strong>{complete ? money(profit) : 'Incomplete'}</strong></div>
      <div className="rounded border p-3"><div className="text-slate-500">Profit margin</div><strong>{complete && sellingValue > 0 ? (profit / sellingValue * 100).toFixed(2) + '%' : 'Incomplete'}</strong></div>
    </div>
    <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm" role="status">
      {eligible.length} editable lines; {rows.length - eligible.length} excluded; {costMissing} allowable rates outstanding; {invalid} invalid entries.
      {' '}Historical BOQ total: {money(originalTotal)}. Scenario selling value is calculated from eligible lines only. Difference: {money(originalTotal - sellingValue)}.
      {(!complete || Math.abs(originalTotal - eligible.reduce((s,r) => s + r.originalValue,0)) > .01) && ' Do not approve or use for financial baselines until costs and reconciliation are reviewed.'}
    </div>
    <div className="flex flex-wrap items-center gap-3 text-sm"><label>Risk cost increase (%) <input aria-label="Risk cost increase percentage" className="ml-2 w-24 rounded border p-2" type="number" min="0" max="1000" step=".1" value={risk} onChange={e=>setRisk(e.target.value)} /></label><strong>Risk-adjusted margin: {complete && validRisk && sellingValue > 0 ? (adjustedProfit / sellingValue * 100).toFixed(2)+'%' : 'Incomplete'}</strong></div>
    <input className="w-full rounded border p-2 text-sm" aria-label="Search BOQ costing items" placeholder="Search BOQ item or description" value={filter} onChange={e=>setFilter(e.target.value)} />
    <div className="max-h-[65vh] overflow-auto"><table className="w-full min-w-[1020px] text-sm"><thead className="sticky top-0 bg-slate-100"><tr>{['BOQ item','Qty','Unit','Original selling rate','Proposed selling rate (R)','Allowable unit cost (R)','Selling total','Profit contribution'].map(h=><th key={h} className="p-2 text-left">{h}</th>)}</tr></thead><tbody>{visible.map(r=><tr key={r.index} className="border-t"><td className="p-2 min-w-52">{r.item.code} {r.item.name || r.item.description}</td><td className="p-2">{r.item.quantity}</td><td className="p-2">{r.item.unit}</td><td className="p-2">{money(r.originalRate || 0)}</td><td className="p-2"><input aria-label={`Proposed selling rate for item ${r.index+1}`} disabled={!r.editable} type="number" min="0" step=".01" className="w-32 rounded border p-1" value={overrides[r.index]?.selling ?? (r.editable ? String(r.originalRate) : '')} onChange={e=>update(r.index,'selling',e.target.value)} /></td><td className="p-2"><input aria-label={`Allowable unit cost for item ${r.index+1}`} disabled={!r.editable} type="number" min="0" step=".01" placeholder="Required" className="w-32 rounded border p-1" value={overrides[r.index]?.allowable ?? ''} onChange={e=>update(r.index,'allowable',e.target.value)} /></td><td className="p-2">{r.valid ? money(r.quantity*r.selling) : 'Review'}</td><td className="p-2">{r.valid && r.allowable !== null ? money(r.quantity*(r.selling-r.allowable)) : 'Pending'}</td></tr>)}</tbody></table></div>
    <div className="flex justify-end"><button type="button" className="rounded border px-3 py-2 text-sm" onClick={()=>{setOverrides({});setRisk('10');}}>Reset scenario</button></div>
  </section>;
}
