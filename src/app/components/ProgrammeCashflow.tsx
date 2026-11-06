import { draftBoqWorkPackageSchedule, type BoqProgrammeGroup } from '../../utils/boqProgramme';
import React, { useMemo, useState } from 'react';
import { validateProgrammeDependencies, type ProgrammeActivity } from '../../utils/programmeDependencies';
import { calculateProgrammeCashflow, calculateWorkPackageMonthlyAllocations, comparePlannedAndActual, type MonthlyCashflow } from '../../utils/programmeCashflow';

type Activity = ProgrammeActivity;
type Props = { projectValue: number; durationMonths: number; programmeLevel?: 'high' | 'detailed'; isMasked?: boolean; boqGroups?: BoqProgrammeGroup[]; eligibleValue?: number; excludedCount?: number };
const money = (n: number) => 'R ' + n.toLocaleString('en-ZA', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const initial = (months: number): Activity[] => [
  { id: 1, name: 'Mobilisation and preliminaries', start: 1, duration: Math.max(1, Math.ceil(months * 0.2)), share: 10 },
  { id: 2, name: 'Main construction works', start: Math.min(months, 2), duration: Math.max(1, months - 1), share: 75 },
  { id: 3, name: 'Testing, completion and handover', start: Math.max(1, months - Math.ceil(months * 0.2) + 1), duration: Math.max(1, Math.ceil(months * 0.2)), share: 15 },
];

/** Illustrative programme/cashflow scenario, not a contractual baseline or a BOQ-derived activity schedule. */
export function ProgrammeCashflow({ projectValue, durationMonths, programmeLevel = 'high', isMasked = false, boqGroups = [], eligibleValue = 0, excludedCount = 0 }: Props) {
  const months = Math.max(1, Math.min(36, Math.round(Number(durationMonths) || 6)));
  const [activities, setActivities] = useState<Activity[]>(() => programmeLevel === 'detailed' ? [
    { id: 1, name: 'Mobilisation and preliminaries', start: 1, duration: Math.max(1, Math.ceil(months * 0.15)), share: 10 },
    { id: 2, name: 'Site preparation and earthworks', start: 1, duration: Math.max(1, Math.ceil(months * 0.3)), share: 20 },
    { id: 3, name: 'Primary construction activities', start: Math.max(1, Math.floor(months * 0.2)), duration: Math.max(1, months - Math.floor(months * 0.2)), share: 45 },
    { id: 4, name: 'Finishing and surfacing', start: Math.max(1, Math.floor(months * 0.6)), duration: Math.max(1, months - Math.floor(months * 0.6)), share: 15 },
    { id: 5, name: 'Testing and handover', start: months, duration: 1, share: 10 },
  ] : initial(months));
  const [includeProgramme, setIncludeProgramme] = useState(false);
  const [approvedBaseline, setApprovedBaseline] = useState<MonthlyCashflow[] | null>(null);
  const [actuals, setActuals] = useState<Record<number, number>>({});
  const [baselineMonths, setBaselineMonths] = useState(months);
  const [scenarioValue, setScenarioValue] = useState(projectValue);
  const change = (id: number, field: keyof Activity, value: string) =>
    setActivities(current => current.map(a => a.id === id ? { ...a, [field]: field === 'name' ? value : Number(value) } : a));
  const dependenciesValid = validateProgrammeDependencies(activities);
  const totalShare = activities.reduce((sum, a) => sum + (Number.isFinite(a.share) ? a.share : 0), 0);
  const valid = dependenciesValid && scenarioValue > 0 && Number.isFinite(scenarioValue) && activities.length > 0 &&
    activities.every(a => a.name.trim() && Number.isInteger(a.start) && Number.isInteger(a.duration) &&
      a.start >= 1 && a.duration >= 1 && a.start + a.duration - 1 <= baselineMonths &&
      Number.isFinite(a.share) && a.share >= 0) && Math.abs(totalShare - 100) < 0.001;
  const series = useMemo(() => calculateProgrammeCashflow(activities, baselineMonths, scenarioValue), [activities, baselineMonths, scenarioValue]);
  const comparison = useMemo(() => approvedBaseline ? comparePlannedAndActual(approvedBaseline, Object.entries(actuals).map(([month, amount]) => ({ month: Number(month), amount }))) : [], [approvedBaseline, actuals]);
  const packageAllocations = useMemo(() => calculateWorkPackageMonthlyAllocations(activities, baselineMonths, scenarioValue), [activities, baselineMonths, scenarioValue]);
  const applyBoqGroups = () => {
    if (!boqGroups.length || eligibleValue <= 0) return;
    setScenarioValue(eligibleValue);
    setActivities(draftBoqWorkPackageSchedule(boqGroups, baselineMonths));
    setIncludeProgramme(true);
  };
  const reset = () => { setApprovedBaseline(null); setActuals({}); setActivities(initial(months)); setBaselineMonths(months); setScenarioValue(projectValue); setIncludeProgramme(false); };
  const chartW = 800, chartH = 300, left = 104, right = 32, top = 24, bottom = 64;
  const plotW = chartW - left - right, plotH = chartH - top - bottom;
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const tickCount = Math.min(6, baselineMonths);
  const monthTicks = Array.from({ length: tickCount }, (_, i) =>
    Math.max(1, Math.round(1 + i * (baselineMonths - 1) / Math.max(1, tickCount - 1)))
  );
  const points = series.map(p => `${left + (p.month - 1) * plotW / Math.max(1, baselineMonths - 1)},${top + plotH * (1 - p.cumulative / Math.max(1, scenarioValue))}`).join(' ');
  return (
    <section className="mt-5 rounded-xl border border-cyan-200 bg-white p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h3 className="text-lg font-semibold">Programme of Works &amp; S-Curve</h3>
          <p className="text-sm text-gray-600">{programmeLevel === 'detailed' ? 'Detailed illustrative activity breakdown' : 'High-level illustrative activity breakdown'} based on the priced BOQ total. Edit activities and allocations before using this forecast.</p></div>
        <button type="button" className="rounded border px-3 py-2 text-sm" onClick={() => setIncludeProgramme(v => !v)}>
          {includeProgramme ? 'Hide planning scenario' : 'Open planning scenario'}
        </button>
      </div>
      {includeProgramme && (isMasked ? <p className="text-sm text-amber-700">Upgrade access is required to view project-value forecasts.</p> : <>
        <div className="flex items-center justify-between gap-2 text-sm">
          <span>Planning duration: {baselineMonths} months · Scenario value: {money(scenarioValue)}</span>
          <button type="button" className="underline text-cyan-700" onClick={reset}>Reset scenario</button>
        </div>
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <button type="button" disabled={!boqGroups.length} onClick={applyBoqGroups}
            className="rounded bg-cyan-700 px-3 py-2 text-white disabled:opacity-50">
            Generate work packages from priced BOQ
          </button>
          <span>{boqGroups.length ? `${boqGroups.length} proposed packages · ${excludedCount} excluded lines` : 'Unavailable: no eligible BOQ work groups have been mapped for this historical bill.'}</span>
        </div>
        {boqGroups.length > 0 && <p className="text-xs text-amber-800">
          BOQ work packages are a draft for QS review. {money(eligibleValue)} of {money(projectValue)} is eligible;
          any difference is not allocated. Draft category-based start months are proposed across the project duration; review and adjust sequencing and dependencies.
        </p>}
        <p className="text-xs text-amber-800">Illustrative allocations only. BOQ categories are proposed work packages, not approved activity mappings. No actual progress or approved baseline is implied.</p>
        <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm">
          <thead><tr className="border-b text-left"><th className="p-2">Activity</th><th className="p-2">Start month</th><th className="p-2">Duration</th><th className="p-2">Allocation %</th><th className="p-2">Predecessor</th><th className="p-2">Programme</th></tr></thead>
          <tbody>{activities.map(a => <tr key={a.id} className="border-b">
            <td className="p-2"><input aria-label="Activity" className="w-52 border rounded p-1" value={a.name} onChange={e => change(a.id, 'name', e.target.value)} /></td>
            <td className="p-2"><input aria-label="Start month" type="number" min="1" max={baselineMonths} className="w-16 border rounded p-1" value={a.start} onChange={e => change(a.id, 'start', e.target.value)} /></td>
            <td className="p-2"><input aria-label="Duration months" type="number" min="1" max={baselineMonths} className="w-16 border rounded p-1" value={a.duration} onChange={e => change(a.id, 'duration', e.target.value)} /></td>
            <td className="p-2"><input aria-label="Cost allocation percent" type="number" min="0" max="100" step="0.1" className="w-20 border rounded p-1" value={a.share} onChange={e => change(a.id, 'share', e.target.value)} /></td>
            <td className="p-2"><select aria-label="Predecessor activity" className="border rounded p-1" value={a.predecessorId ?? ''} onChange={e => setActivities(current => current.map(item => item.id === a.id ? {...item, predecessorId: e.target.value === '' ? null : Number(e.target.value)} : item))}><option value="">None</option>{activities.filter(p => p.id !== a.id).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></td>
            <td className="p-2"><div className="flex min-w-40 h-5 bg-gray-100 rounded overflow-hidden">{Array.from({length:baselineMonths}, (_,i) => <div key={i} className={i+1>=a.start && i+1<a.start+a.duration ? 'bg-cyan-500 border-r border-white/40' : 'border-r border-gray-200'} style={{width:`${100/baselineMonths}%`}} />)}</div></td>
          </tr>)}</tbody></table></div>
        {!dependenciesValid && <p role="alert" className="text-sm text-red-700">Invalid dependency: successor must start after predecessor finishes.</p>}
        {!valid ? <p role="alert" className="text-sm text-red-700">Review activities: months must fit within the project duration and allocations must total exactly 100% (currently {totalShare.toFixed(1)}%).</p> : <>
          <details className="rounded-lg border border-cyan-200 bg-white">
            <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-cyan-800">Monthly expenditure by work package — draft BOQ allocation</summary>
            <div className="max-h-80 overflow-auto border-t border-cyan-100">
              <table className="min-w-full text-xs">
                <thead className="sticky top-0 bg-slate-50"><tr><th className="p-2 text-left">Work package</th><th className="p-2 text-right">Planned total</th>{series.map(row => <th key={row.month} className="p-2 text-right">M{row.month}</th>)}</tr></thead>
                <tbody>{packageAllocations.map(pkg => <tr key={pkg.id} className="border-t"><td className="p-2 whitespace-nowrap">{pkg.name}</td><td className="p-2 text-right whitespace-nowrap">{money(pkg.plannedTotal)}</td>{pkg.months.map((amount, index) => <td key={index} className="p-2 text-right whitespace-nowrap">{money(amount)}</td>)}</tr>)}</tbody>
              </table>
            </div>
            <p className="p-2 text-xs text-amber-800">Illustrative monthly allocation, not approved baseline or actual expenditure.</p>
          </details>
          <div className="rounded-lg border border-cyan-200 p-3 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><h4 className="font-semibold">Baseline review &amp; actual expenditure</h4><p className="text-xs text-slate-600">Local draft workflow only. Approval here is a review marker, not a saved contractual authorisation.</p></div>
              <button type="button" className="rounded bg-cyan-700 px-3 py-2 text-sm text-white" onClick={() => { setApprovedBaseline(series.map(row => ({ ...row }))); setActuals({}); }}>Mark current plan as reviewed baseline</button>
            </div>
            {approvedBaseline ? <>
              <p className="text-xs text-amber-800">Reviewed baseline captured in this session only. Changing the plan will not overwrite this snapshot. Actual amounts are entered manually; blank means not reported.</p>
              <div className="max-h-72 overflow-auto"><table className="w-full min-w-[660px] text-sm">
                <thead className="sticky top-0 bg-slate-50"><tr><th className="p-2 text-left">Month</th><th className="p-2 text-right">Baseline (R)</th><th className="p-2 text-right">Actual expenditure (R)</th><th className="p-2 text-right">Monthly variance (R)</th><th className="p-2 text-right">Cumulative variance (R)</th></tr></thead>
                <tbody>{comparison.map(row => <tr key={row.month} className="border-t">
                  <td className="p-2">M{row.month}</td><td className="p-2 text-right">{money(row.planned)}</td>
                  <td className="p-2 text-right"><input aria-label={`Actual expenditure month ${row.month}`} className="w-32 rounded border p-1 text-right" type="number" min="0" step="0.01" value={actuals[row.month] ?? ''} onChange={e => { const value = e.target.value; setActuals(current => { const next = { ...current }; if (value === '') delete next[row.month]; else next[row.month] = Number(value); return next; }); }} /></td>
                  <td className="p-2 text-right">{row.variance === null ? 'Not reported' : money(row.variance)}</td>
                  <td className="p-2 text-right">{row.cumulativeVariance === null ? 'Incomplete actuals' : money(row.cumulativeVariance)}</td>
                </tr>)}</tbody></table></div>
            </> : <p className="text-sm text-slate-600">Review the schedule and allocations before capturing an in-session baseline.</p>}
          </div>
          <h4 className="font-medium">Planned cumulative expenditure (S-Curve)</h4>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-xs text-slate-600">Horizontal axis: project month · Vertical axis: cumulative planned expenditure (R). Values are planned, not actual.</p>
            <svg viewBox={`0 0 ${chartW} ${chartH}`} role="img" aria-label="S-Curve: cumulative planned expenditure in rand by project month" className="w-full">
              {ticks.map(t => <g key={t}>
                <line x1={left} x2={chartW-right} y1={top+plotH*(1-t)} y2={top+plotH*(1-t)} stroke="#dbe4ee" strokeDasharray="4 4" />
                <text x={left-12} y={top+plotH*(1-t)+4} textAnchor="end" fontSize="12" fill="#475569">{money(scenarioValue*t)}</text>
              </g>)}
              {monthTicks.map(m => <g key={m}>
                <line x1={left+(m-1)*plotW/Math.max(1,baselineMonths-1)} x2={left+(m-1)*plotW/Math.max(1,baselineMonths-1)} y1={top+plotH} y2={top+plotH+5} stroke="#64748b" />
                <text x={left+(m-1)*plotW/Math.max(1,baselineMonths-1)} y={top+plotH+21} textAnchor="middle" fontSize="12" fill="#475569">M{m}</text>
              </g>)}
              <line x1={left} y1={top} x2={left} y2={top+plotH} stroke="#64748b" />
              <line x1={left} y1={top+plotH} x2={chartW-right} y2={top+plotH} stroke="#64748b" />
              <polyline points={points} fill="none" stroke="#0877ad" strokeWidth="3" strokeLinejoin="round" />
              {series.map(p => <circle key={p.month} cx={left+(p.month-1)*plotW/Math.max(1,baselineMonths-1)} cy={top+plotH*(1-p.cumulative/Math.max(1,scenarioValue))} r="3" fill="#0877ad"><title>{`Month ${p.month}: ${money(p.cumulative)} cumulative planned`}</title></circle>)}
              <text x={left+plotW/2} y={chartH-12} textAnchor="middle" fontSize="13" fill="#334155">Project duration (months)</text>
            </svg>
            <p className="text-xs text-slate-600">Blue line — cumulative planned expenditure · Final planned value: {money(scenarioValue)} · Duration: {baselineMonths} months</p>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b text-left"><th className="p-2">Month</th><th className="p-2">Planned expenditure</th><th className="p-2">Cumulative</th><th className="p-2">Progress</th></tr></thead>
            <tbody>{series.map(s => <tr key={s.month} className="border-b"><td className="p-2">{s.month}</td><td className="p-2">{money(s.planned)}</td><td className="p-2">{money(s.cumulative)}</td><td className="p-2">{(100*s.cumulative/scenarioValue).toFixed(1)}%</td></tr>)}</tbody>
          </table></div>
        </>}
      </>)}
    </section>
  );
}
