import type { BoqProgrammeGroup } from '../../utils/boqProgramme';
import React, { useMemo, useState } from 'react';

type Activity = { id: number; name: string; start: number; duration: number; share: number };
type Props = { projectValue: number; durationMonths: number; isMasked?: boolean; boqGroups?: BoqProgrammeGroup[]; eligibleValue?: number; excludedCount?: number };
const money = (n: number) => 'R ' + n.toLocaleString('en-ZA', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const initial = (months: number): Activity[] => [
  { id: 1, name: 'Mobilisation and preliminaries', start: 1, duration: Math.max(1, Math.ceil(months * 0.2)), share: 10 },
  { id: 2, name: 'Main construction works', start: Math.min(months, 2), duration: Math.max(1, months - 1), share: 75 },
  { id: 3, name: 'Testing, completion and handover', start: Math.max(1, months - Math.ceil(months * 0.2) + 1), duration: Math.max(1, Math.ceil(months * 0.2)), share: 15 },
];

/** Illustrative programme/cashflow scenario, not a contractual baseline or a BOQ-derived activity schedule. */
export function ProgrammeCashflow({ projectValue, durationMonths, isMasked = false, boqGroups = [], eligibleValue = 0, excludedCount = 0 }: Props) {
  const months = Math.max(1, Math.min(36, Math.round(Number(durationMonths) || 6)));
  const [activities, setActivities] = useState<Activity[]>(() => initial(months));
  const [includeProgramme, setIncludeProgramme] = useState(false);
  const [baselineMonths, setBaselineMonths] = useState(months);
  const [scenarioValue, setScenarioValue] = useState(projectValue);
  const change = (id: number, field: keyof Activity, value: string) =>
    setActivities(current => current.map(a => a.id === id ? { ...a, [field]: field === 'name' ? value : Number(value) } : a));
  const totalShare = activities.reduce((sum, a) => sum + (Number.isFinite(a.share) ? a.share : 0), 0);
  const valid = scenarioValue > 0 && Number.isFinite(scenarioValue) && activities.length > 0 &&
    activities.every(a => a.name.trim() && Number.isInteger(a.start) && Number.isInteger(a.duration) &&
      a.start >= 1 && a.duration >= 1 && a.start + a.duration - 1 <= baselineMonths &&
      Number.isFinite(a.share) && a.share >= 0) && Math.abs(totalShare - 100) < 0.001;
  const series = useMemo(() => {
    if (!valid) return [];
    let cumulative = 0;
    return Array.from({ length: baselineMonths }, (_, index) => {
      const month = index + 1;
      const planned = activities.reduce((sum, a) =>
        month >= a.start && month < a.start + a.duration
          ? sum + (scenarioValue * a.share / 100 / a.duration) : sum, 0);
      cumulative += planned;
      return { month, planned, cumulative };
    });
  }, [valid, baselineMonths, activities, scenarioValue]);
  const applyBoqGroups = () => {
    if (!boqGroups.length || eligibleValue <= 0) return;
    setScenarioValue(eligibleValue);
    setActivities(boqGroups.map((g, i) => ({
      id: i + 1, name: g.name, start: 1, duration: baselineMonths, share: g.share
    })));
    setIncludeProgramme(true);
  };
  const reset = () => { setActivities(initial(months)); setBaselineMonths(months); setScenarioValue(projectValue); setIncludeProgramme(false); };
  const chartW = 720, chartH = 210, inset = 35;
  const points = series.map((p, i) =>
    `${inset + i * (chartW - inset * 2) / Math.max(1, series.length - 1)},${chartH - inset - (p.cumulative / scenarioValue) * (chartH - inset * 2)}`).join(' ');
  return (
    <section className="mt-5 rounded-xl border border-cyan-200 bg-white p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h3 className="text-lg font-semibold">Programme of Works &amp; S-Curve</h3>
          <p className="text-sm text-gray-600">Planning scenario based on the priced BOQ total. Edit activities and allocations before using this forecast.</p></div>
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
          <span>{boqGroups.length} proposed packages · {excludedCount} excluded lines</span>
        </div>
        {boqGroups.length > 0 && <p className="text-xs text-amber-800">
          BOQ work packages are a draft for QS review. {money(eligibleValue)} of {money(projectValue)} is eligible;
          any difference is not allocated. Generation starts all packages in month 1 and requires manual sequencing.
        </p>}
        <p className="text-xs text-amber-800">Illustrative allocations only. No BOQ-to-activity mapping, actual progress, dependencies or approved baseline is implied.</p>
        <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm">
          <thead><tr className="border-b text-left"><th className="p-2">Activity</th><th className="p-2">Start month</th><th className="p-2">Duration</th><th className="p-2">Allocation %</th><th className="p-2">Programme</th></tr></thead>
          <tbody>{activities.map(a => <tr key={a.id} className="border-b">
            <td className="p-2"><input aria-label="Activity" className="w-52 border rounded p-1" value={a.name} onChange={e => change(a.id, 'name', e.target.value)} /></td>
            <td className="p-2"><input aria-label="Start month" type="number" min="1" max={baselineMonths} className="w-16 border rounded p-1" value={a.start} onChange={e => change(a.id, 'start', e.target.value)} /></td>
            <td className="p-2"><input aria-label="Duration months" type="number" min="1" max={baselineMonths} className="w-16 border rounded p-1" value={a.duration} onChange={e => change(a.id, 'duration', e.target.value)} /></td>
            <td className="p-2"><input aria-label="Cost allocation percent" type="number" min="0" max="100" step="0.1" className="w-20 border rounded p-1" value={a.share} onChange={e => change(a.id, 'share', e.target.value)} /></td>
            <td className="p-2"><div className="flex min-w-40 h-5 bg-gray-100 rounded overflow-hidden">{Array.from({length:baselineMonths}, (_,i) => <div key={i} className={i+1>=a.start && i+1<a.start+a.duration ? 'bg-cyan-500 border-r border-white/40' : 'border-r border-gray-200'} style={{width:`${100/baselineMonths}%`}} />)}</div></td>
          </tr>)}</tbody></table></div>
        {!valid ? <p role="alert" className="text-sm text-red-700">Review activities: months must fit within the project duration and allocations must total exactly 100% (currently {totalShare.toFixed(1)}%).</p> : <>
          <h4 className="font-medium">Planned cumulative expenditure (S-Curve)</h4>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} role="img" aria-label="Planned cumulative expenditure S-Curve" className="w-full max-w-3xl">
            <line x1={inset} y1={chartH-inset} x2={chartW-inset} y2={chartH-inset} stroke="#94a3b8" />
            <line x1={inset} y1={inset} x2={inset} y2={chartH-inset} stroke="#94a3b8" />
            <polyline points={points} fill="none" stroke="#0891b2" strokeWidth="3" strokeLinejoin="round" />
            <text x="3" y={inset+5} fontSize="12">100%</text><text x="9" y={chartH-inset} fontSize="12">0%</text>
            <text x={inset} y={chartH-10} fontSize="12">M1</text><text x={chartW-inset-30} y={chartH-10} fontSize="12">M{baselineMonths}</text>
          </svg>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b text-left"><th className="p-2">Month</th><th className="p-2">Planned expenditure</th><th className="p-2">Cumulative</th><th className="p-2">Progress</th></tr></thead>
            <tbody>{series.map(s => <tr key={s.month} className="border-b"><td className="p-2">{s.month}</td><td className="p-2">{money(s.planned)}</td><td className="p-2">{money(s.cumulative)}</td><td className="p-2">{(100*s.cumulative/scenarioValue).toFixed(1)}%</td></tr>)}</tbody>
          </table></div>
        </>}
      </>)}
    </section>
  );
}
