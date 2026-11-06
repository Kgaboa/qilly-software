import React, { useEffect, useMemo, useState } from 'react';
import { listRepricingDrafts, saveNewRepricingDraft, type StoredRepricingDraft } from '@/utils/repricingStorage';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

type Item = { code?: string; name?: string; description?: string; quantity?: number | string; unit?: string; unitPrice?: number | string; totalPrice?: number | string };
type Props = { items: Item[]; originalTotal: number; boqId: string };
type Override = { selling?: string; allowable?: string };
const money = (n: number) => 'R ' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const validNumber = (n: unknown) => Number.isFinite(Number(n)) && Number(n) >= 0;
export function AllowablesWorkspace({ items, originalTotal, boqId }: Props) {
  const [drafts, setDrafts] = useState<StoredRepricingDraft[]>([]);
  const [draftBusy, setDraftBusy] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [selectedDraft, setSelectedDraft] = useState('');
  const refreshDrafts = async () => { const data = await listRepricingDrafts(boqId); setDrafts(data); };
  useEffect(() => { let active = true; void listRepricingDrafts(boqId).then(data => { if(active) setDrafts(data); }).catch(() => { if(active) setDraftMessage('Unable to load saved drafts.'); }); return () => { active = false; }; }, [boqId]);
  const [overrides, setOverrides] = useState<Record<number, Override>>({});
  const [risk, setRisk] = useState('10');
  const [filter, setFilter] = useState('');
  const [assumption, setAssumption] = useState('80');
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
  const suggestAllowables = () => {
    const percentage = Number(assumption);
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) return;
    setOverrides(previous => {
      const next = { ...previous };
      rows.forEach(r => {
        if (!r.editable || (next[r.index]?.allowable !== undefined && next[r.index]?.allowable !== '')) return;
        next[r.index] = { ...next[r.index], allowable: (r.selling * percentage / 100).toFixed(2) };
      });
      return next;
    });
  };
  const saveDraft = async () => {
    if (!complete || !validRisk || sellingValue <= 0) { setDraftMessage('Complete valid costing and risk inputs before saving.'); return; }
    setDraftBusy(true); setDraftMessage('');
    try {
      const lines = eligible.map(r => ({ itemIndex: r.index, proposedRate: r.selling, allowableUnitCost: r.allowable }));
      const saved = await saveNewRepricingDraft(boqId, lines, sellingValue, allowableCost, escalation);
      await refreshDrafts();
      setSelectedDraft(saved.id);
      setDraftMessage('Draft version ' + saved.version + ' saved. Original BOQ unchanged.');
    } catch (error) { setDraftMessage(error instanceof Error ? error.message : 'Draft save failed.'); }
    finally { setDraftBusy(false); }
  };
  const loadDraft = () => {
    const draft = drafts.find(d => d.id === selectedDraft);
    if (!draft) return;
    const next: Record<number, Override> = {};
    for (const line of draft.lines) {
      if (!Number.isInteger(line.itemIndex) || line.itemIndex < 0 || line.itemIndex >= items.length) { setDraftMessage('Saved draft does not match this BOQ.'); return; }
      next[line.itemIndex] = { selling: String(line.proposedRate), allowable: line.allowableUnitCost === null ? '' : String(line.allowableUnitCost) };
    }
    setOverrides(next); setRisk(String(draft.risk_escalation_percent));
    setDraftMessage('Loaded draft version ' + draft.version + ' for editing. No BOQ changes applied.');
  };
  const exportRows = rows.map(r => ({
    'Item No': r.item.code || '', Description: r.item.name || r.item.description || '',
    Quantity: r.item.quantity ?? '', Unit: r.item.unit || '',
    'Original Selling Rate': r.originalRate,
    'Proposed Selling Rate': r.valid ? r.selling : '',
    'Allowable Unit Cost': r.valid ? r.allowable ?? '' : '',
    'Proposed Selling Total': r.valid ? Number((r.quantity * r.selling).toFixed(2)) : '',
    'Expected Profit': r.valid && r.allowable !== null ? Number((r.quantity * (r.selling - r.allowable)).toFixed(2)) : '',
    Status: !r.editable ? 'Excluded' : !r.valid ? 'Invalid rate' : r.allowable === null ? 'Allowable pending' : 'Cost entered'
  }));
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(exportRows), 'Repriced BOQ');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Qilly proposed repricing scenario — NOT APPROVED'],
      ['Original BOQ total (R)', originalTotal], ['Scenario selling value (R)', sellingValue],
      ['Difference (R)', originalTotal - sellingValue], ['Allowable cost coverage', eligible.length - costMissing, eligible.length],
      ['Estimated allowable cost (R)', complete ? allowableCost : 'Incomplete'],
      ['Expected profit (R)', complete ? profit : 'Incomplete'],
      ['Profit margin (%)', complete && sellingValue > 0 ? profit / sellingValue * 100 : 'Incomplete'],
      ['Risk cost increase (%)', risk], ['Risk-adjusted profit (R)', complete && validRisk ? adjustedProfit : 'Incomplete'],
      ['Notice', 'Unapproved, scenario-only values. Original priced BOQ unchanged.']
    ]), 'Scenario Summary');
    XLSX.writeFile(wb, 'Qilly_Repriced_BOQ_DRAFT.xlsx');
  };
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(15); doc.text('Qilly — Proposed Repriced BOQ (DRAFT)', 14, 15);
    doc.setFontSize(9);
    doc.text('Unapproved scenario only. Original BOQ unchanged. Allowable costs may be incomplete.', 14, 22);
    doc.text('Original: ' + money(originalTotal) + ' | Proposed: ' + money(sellingValue) + ' | Difference: ' + money(originalTotal - sellingValue), 14, 29);
    autoTable(doc, {
      startY: 35,
      head: [['Item', 'Description', 'Qty', 'Unit', 'Original Rate', 'Proposed Rate', 'Allowable Rate', 'Proposed Total', 'Status']],
      body: exportRows.map(r => [String(r['Item No']), String(r.Description), String(r.Quantity), String(r.Unit), String(r['Original Selling Rate']), String(r['Proposed Selling Rate']), String(r['Allowable Unit Cost']), String(r['Proposed Selling Total']), String(r.Status)]),
      styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
      columnStyles: { 1: { cellWidth: 58 } }
    });
    doc.save('Qilly_Repriced_BOQ_DRAFT.pdf');
  };
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
    <div className="rounded-lg border p-3 space-y-2 text-sm">
      <strong>Generate allowable cost suggestions</strong>
      <p className="text-slate-600">Illustrative assumption only, NOT a verified execution cost. Fills missing allowable costs from a chosen percentage of proposed selling rates; review every item before approval.</p>
      <div className="flex flex-wrap items-center gap-2"><label>Assumed cost (% of selling rate) <input aria-label="Assumed allowable cost percentage" type="number" min="0" max="100" step=".1" className="w-24 rounded border p-2" value={assumption} onChange={e => setAssumption(e.target.value)} /></label>
      <button type="button" className="rounded bg-cyan-700 px-3 py-2 text-white disabled:opacity-50" disabled={!validNumber(assumption) || Number(assumption) > 100} onClick={suggestAllowables}>Generate Allowables</button>
      <button type="button" className="rounded border px-3 py-2" onClick={exportExcel}>Export Repriced BOQ — Excel</button>
      <button type="button" className="rounded border px-3 py-2" onClick={exportPDF}>Export Repriced BOQ — PDF</button></div>
    </div>
    <div className="rounded-lg border border-cyan-200 p-3 space-y-2 text-sm" aria-label="Repricing draft persistence">
      <strong>Versioned Repricing Drafts</strong>
      <p className="text-slate-600">Save or reload a scenario without modifying the original BOQ or using another BOQ credit. Drafts are private to the BOQ owner.</p>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" disabled={draftBusy || !complete || !validRisk || sellingValue <= 0} className="rounded bg-cyan-700 px-3 py-2 text-white disabled:opacity-50" onClick={() => void saveDraft()}>{draftBusy ? 'Saving...' : 'Save Draft'}</button>
        <select aria-label="Saved repricing draft" className="rounded border p-2" value={selectedDraft} onChange={e=>setSelectedDraft(e.target.value)}>
          <option value="">Select saved draft</option>
          {drafts.map(d => <option key={d.id} value={d.id}>Version {d.version}</option>)}
        </select>
        <button type="button" className="rounded border px-3 py-2 disabled:opacity-50" disabled={!selectedDraft} onClick={loadDraft}>Load Draft</button>
      </div>
      {draftMessage && <p role="status">{draftMessage}</p>}
    </div>
    <input className="w-full rounded border p-2 text-sm" aria-label="Search BOQ costing items" placeholder="Search BOQ item or description" value={filter} onChange={e=>setFilter(e.target.value)} />
    <div className="max-h-[65vh] overflow-auto"><table className="w-full min-w-[1020px] text-sm"><thead className="sticky top-0 bg-slate-100"><tr>{['BOQ item','Qty','Unit','Original selling rate','Proposed selling rate (R)','Allowable unit cost (R)','Selling total','Profit contribution'].map(h=><th key={h} className="p-2 text-left">{h}</th>)}</tr></thead><tbody>{visible.map(r=><tr key={r.index} className="border-t"><td className="p-2 min-w-52">{r.item.code} {r.item.name || r.item.description}</td><td className="p-2">{r.item.quantity}</td><td className="p-2">{r.item.unit}</td><td className="p-2">{money(r.originalRate || 0)}</td><td className="p-2"><input aria-label={`Proposed selling rate for item ${r.index+1}`} disabled={!r.editable} type="number" min="0" step=".01" className="w-32 rounded border p-1" value={overrides[r.index]?.selling ?? (r.editable ? String(r.originalRate) : '')} onChange={e=>update(r.index,'selling',e.target.value)} /></td><td className="p-2"><input aria-label={`Allowable unit cost for item ${r.index+1}`} disabled={!r.editable} type="number" min="0" step=".01" placeholder="Required" className="w-32 rounded border p-1" value={overrides[r.index]?.allowable ?? ''} onChange={e=>update(r.index,'allowable',e.target.value)} /></td><td className="p-2">{r.valid ? money(r.quantity*r.selling) : 'Review'}</td><td className="p-2">{r.valid && r.allowable !== null ? money(r.quantity*(r.selling-r.allowable)) : 'Pending'}</td></tr>)}</tbody></table></div>
    <div className="flex justify-end"><button type="button" className="rounded border px-3 py-2 text-sm" onClick={()=>{setOverrides({});setRisk('10');}}>Reset scenario</button></div>
  </section>;
}
