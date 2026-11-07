import { useCallback, useEffect, useState } from 'react';
import { createTenderRisk, loadTenderRisks } from '@/utils/tenderRiskStorage';
import { summariseTenderRisks, type TenderRisk, type TenderRiskCategory } from '@/utils/tenderRisk';

export function TenderRiskWorkspace({tenderId,boqId,onChanged}:{tenderId:string;boqId:string|null;onChanged?:()=>void}) {
 const [risks,setRisks]=useState<TenderRisk[]>([]);
 const [category,setCategory]=useState<TenderRiskCategory>('commercial');
 const [description,setDescription]=useState('');
 const [probability,setProbability]=useState(3);
 const [impact,setImpact]=useState(3);
 const [exposure,setExposure]=useState('');
 const [mitigation,setMitigation]=useState('');
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const refresh=useCallback(async()=>{
   if(!boqId) {setRisks([]);return;}
   try {setRisks(await loadTenderRisks(tenderId,boqId));setMessage('');}
   catch(e){setMessage(e instanceof Error?e.message:'Unable to load risks');}
 },[tenderId,boqId]);
 useEffect(()=>{void refresh();},[refresh]);
 const save=async()=>{
   if(!boqId)return;
   setBusy(true);
   try{
     await createTenderRisk({tenderId,boqId,category,description,probability,impact,exposureAmount:Number(exposure),mitigation,status:'open'});
     setDescription('');setExposure('');setMitigation('');
     await refresh();onChanged?.();setMessage('Risk recorded.');
   }catch(e){setMessage(e instanceof Error?e.message:'Unable to save risk');}
   finally{setBusy(false);}
 };
 const summary=summariseTenderRisks(risks);
 return <section className="rounded-lg border p-4 space-y-3" aria-label="Tender risk register">
  <h3 className="font-semibold">Tender Risk Register</h3>
  {!boqId?<p className="text-sm">Link a BOQ to this tender before recording risks.</p>:<>
   <p className="text-sm">Active risks: {summary.riskCount} | Weighted exposure: R {summary.weightedExposure.toFixed(2)} | High risks: {summary.highRisks} | Critical compliance risks: {summary.blockingRisks}</p>
   <div className="grid gap-2 sm:grid-cols-2">
    <label className="text-sm">Category<select className="block w-full rounded border p-2" value={category} onChange={e=>setCategory(e.target.value as TenderRiskCategory)}>{(['commercial','delivery','technical','compliance','supplier','schedule'] as const).map(x=><option key={x} value={x}>{x}</option>)}</select></label>
    <label className="text-sm">Description<input className="block w-full rounded border p-2" value={description} onChange={e=>setDescription(e.target.value)}/></label>
    <label className="text-sm">Probability (1–5)<input type="number" min="1" max="5" className="block w-full rounded border p-2" value={probability} onChange={e=>setProbability(Number(e.target.value))}/></label>
    <label className="text-sm">Impact (1–5)<input type="number" min="1" max="5" className="block w-full rounded border p-2" value={impact} onChange={e=>setImpact(Number(e.target.value))}/></label>
    <label className="text-sm">Financial exposure (R)<input type="number" min="0" className="block w-full rounded border p-2" value={exposure} onChange={e=>setExposure(e.target.value)}/></label>
    <label className="text-sm">Mitigation<input className="block w-full rounded border p-2" value={mitigation} onChange={e=>setMitigation(e.target.value)}/></label>
   </div>
   <button type="button" className="rounded bg-cyan-700 px-3 py-2 text-white disabled:opacity-50" disabled={busy||!description.trim()||!mitigation.trim()||exposure.trim()===''} onClick={()=>void save()}>{busy?'Saving…':'Add Risk'}</button>
   <div className="space-y-2">{risks.map(r=><div key={r.id} className="rounded border p-2 text-sm"><strong>{r.category}</strong> — {r.description} | P{r.probability} × I{r.impact} | R {r.exposureAmount.toFixed(2)} | {r.status}<p>Mitigation: {r.mitigation}</p></div>)}</div>
  </>}
  {message&&<p role="status" className="text-sm">{message}</p>}
 </section>;
}
