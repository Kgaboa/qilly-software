import { useEffect, useState } from 'react';
import { previewBoqExcel, previewMappedBoqSheet, type BoqWorkbookPreview, type BoqColumnMap } from '../../lib/boq-import/excel';
import { parseTenderText } from '../../lib/boq-import/tender-text';
import { normalizeBoqRows, type NormalizedBoqLine } from '../../lib/boq-import/normalize';

type PageAuditRow={page:number;disposition:string;classification:string;fragments:number;ocrRequired:boolean;ocrCompleted:boolean;confidence?:number;requiresReview:boolean;reason:string};
type Preview = {name:string;pageAudit?:PageAuditRow[];pageCoverage?:{total:number;accounted:number;manualReview:number;unresolved:number};scheduleRows?:{page:number;line:number;type:string;description:string;amounts:{raw:string;value:number}[];arithmetic?:{expected:number;actual:number;difference:number;matches:boolean}}[];importBlocked?:boolean;missingOcrPages?:number[];ocrConfidenceByPage?:{page:number;confidence:number;rotation:number}[];evidenceRows?:{page:number;line:number;kind:string;label:string;values:string[];source:string;requiresReview:true}[];lines:{sourceRow:number;itemCode:string;description:string;unit:string;quantity:number|null;rate:number|null;amount:number|null}[];issues:{row:number;field:string;message:string}[];warnings:string[];candidates?:{sourceLine:number;sourcePage:number|null;raw:string}[];unparsed?:{sourceLine:number;sourcePage:number;text:string}[];ocrPages?:number[];ocrReviewRequired?:boolean;classification?:{type:string;confidence:string;pageTypes:{page:number;type:string}[]}};
export function FlexibleBoqImport({onBack,accessToken}:{onBack:()=>void;accessToken:string}) {
  const [file,setFile]=useState('');
  const [workbook,setWorkbook]=useState<BoqWorkbookPreview|null>(null);
  const [sheet,setSheet]=useState('');
  const [preview,setPreview]=useState<Preview|null>(null);
  const [text,setText]=useState('');
  const [excelBytes,setExcelBytes]=useState<ArrayBuffer|null>(null);
  const [headerRow,setHeaderRow]=useState(1);
  const [mapping,setMapping]=useState<BoqColumnMap>({});
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [approved,setApproved]=useState(false);
  const [unmatchedReviewed,setUnmatchedReviewed]=useState(false);
  const [ocrReviewed,setOcrReviewed]=useState(false);
  const [acknowledged,setAcknowledged]=useState(false);
  const [selectedPage,setSelectedPage]=useState<number|null>(null);
  const [sourcePdfUrl,setSourcePdfUrl]=useState<string|null>(null);
  const [sourceKind,setSourceKind]=useState<'pdf'|'other'|null>(null);
  useEffect(()=>()=>{if(sourcePdfUrl)URL.revokeObjectURL(sourcePdfUrl);},[sourcePdfUrl]);
  function updatePreview(next:Preview|null){setSelectedPage(null);setPreview(next);setApproved(false);setAcknowledged(false);setUnmatchedReviewed(false);setOcrReviewed(false);}
  function exportReview(){
    if(!preview)return;
    const report={schema:'qilly-phase2-customer-review-v1',generatedAt:new Date().toISOString(),sourceFile:preview.name,documentClassification:preview.classification,pageCoverage:preview.pageCoverage,pageAudit:preview.pageAudit,recognizedLines:preview.lines,sourceCandidates:preview.candidates,unmatchedLines:preview.unparsed,scheduleEvidence:preview.scheduleRows,issues:preview.issues,warnings:preview.warnings,importBlocked:preview.importBlocked??false,localPreviewApproved:approved,customerAccepted:false,disclaimer:'Review evidence only. No BOQ pricing, persistence or production approval.'};
    const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download='qilly-phase2-review-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(url);
  }
  function exportCustomerReview(){
    if(!preview)return;
    const rows=(preview.pageAudit??[]).map(p=>[p.page,p.classification,p.disposition,p.reason].map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(','));
    const coverage=preview.pageCoverage;
    const resolved=(preview.pageAudit??[]).filter(p=>!p.requiresReview).length;
    const csv=['"Qilly Tender Extraction Review"','"Source document","'+preview.name.replaceAll('"','""')+'"','"Pages accounted for",'+(coverage?.accounted??0)+','+(coverage?.total??0),'"Pages without manual review flag",'+resolved+','+(coverage?.total??0),'"Recognised BOQ lines",'+preview.lines.length,'"Important: page accounting is not BOQ extraction accuracy or approval."','','"Page","Classification","Status","Finding"',...rows].join('\r\n');
    const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='Qilly-Customer-Tender-Review-'+new Date().toISOString().slice(0,10)+'.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function editLine(index:number,field:keyof NormalizedBoqLine,raw:string){
    if(!preview || field==='sourceRow')return;
    const lines=preview.lines.map((line,i)=>i===index?{...line,[field]:['quantity','rate','amount'].includes(field)?(raw.trim()===''?null:Number(raw)):raw}:line);
    const rows=lines.map(line=>({'Item No':line.itemCode,Description:line.description,Unit:line.unit,Quantity:line.quantity??'',Rate:line.rate??'',Amount:line.amount??''}));
    const validation=normalizeBoqRows(rows);
    const issues=validation.issues.map(issue=>({...issue,row:lines[issue.row-2]?.sourceRow??issue.row}));
    setPreview({...preview,lines,issues});setApproved(false);setAcknowledged(false);
  }
  function stageServiceScheduleRow(row:NonNullable<Preview['scheduleRows']>[number]){
    if(!preview || row.type!=='service_pricing')return;
    const sourceRow=100000+row.page*1000+row.line;
    if(preview.lines.some(line=>line.sourceRow===sourceRow))return;
    const lines=[...preview.lines,{sourceRow,itemCode:'',description:row.description,unit:'',quantity:null,rate:null,amount:null}];
    const candidates=[...(preview.candidates??[]),{sourceLine:sourceRow,sourcePage:row.page,raw:row.description}];
    const rows=lines.map(line=>({'Item No':line.itemCode,Description:line.description,Unit:line.unit,Quantity:line.quantity??'',Rate:line.rate??'',Amount:line.amount??''}));
    const validation=normalizeBoqRows(rows);
    const issues=validation.issues.map(issue=>({...issue,row:lines[issue.row-2]?.sourceRow??issue.row}));
    updatePreview({...preview,lines,candidates,issues,importBlocked:true,warnings:[...preview.warnings,'Service pricing row staged for manual mapping. Verify item, unit and quantity; no values were inferred.']});
    setSelectedPage(row.page);
  }
  async function load(f:File) {
    setError('');updatePreview(null);setWorkbook(null);setSheet('');setExcelBytes(null);setFile(f.name);setBusy(true);
    setSourcePdfUrl(null);setSourceKind(/\.pdf$/i.test(f.name)?'pdf':'other');
    try {
      if(f.size>15*1024*1024) throw new Error('Maximum upload size is 15 MB');
      if(/\.(xlsx|xls)$/i.test(f.name)){
        const bytes=await f.arrayBuffer();setExcelBytes(bytes);const w=previewBoqExcel(bytes,f.name);setWorkbook(w);
        const first=w.sheets.find(s=>s.result.lines.length)||w.sheets[0];
        if(first){setSheet(first.sheetName);setHeaderRow(first.headerRow>0?first.headerRow:1);updatePreview({name:first.sheetName,...first.result,warnings:first.warnings});}
      }else if(/\.(txt|csv|tsv)$/i.test(f.name)){
        const p=parseTenderText(await f.text());updatePreview({name:f.name,...p});
      }else if(/\.(pdf|docx)$/i.test(f.name)){
        const type=f.name.toLowerCase().endsWith('.pdf')?'pdf':'docx';
        const {data:authData,error:authError}=await (await import('../../utils/supabase')).supabase.auth.getUser();
        if(authError||!authData.user)throw new Error('Your login session has expired. Please sign in again before importing.');
        const {data:sessionData}=await (await import('../../utils/supabase')).supabase.auth.getSession();
        const verifiedToken=sessionData.session?.access_token;
        if(!verifiedToken)throw new Error('No active login session. Please sign in again.');
        const response=await fetch('/api/parse-tender',{method:'POST',headers:{Authorization:'Bearer '+verifiedToken,'Content-Type':'application/octet-stream','x-qilly-file-type':type},body:await f.arrayBuffer()});
        const responseText=await response.text();
        let result:any;
        try { result=JSON.parse(responseText); } catch {
          throw new Error(response.ok
            ? 'Document extraction returned an invalid response. Please contact support.'
            : 'Document extraction service is temporarily unavailable (HTTP '+response.status+'). Please retry shortly.');
        }
        if(!response.ok)throw new Error(result.error||'Document extraction failed');
        if(type==='pdf')setSourcePdfUrl(URL.createObjectURL(f));
        updatePreview({name:f.name,lines:result.lines??[],issues:result.issues??[],warnings:result.warnings??[],candidates:result.candidates??[],unparsed:result.unparsed??[],ocrPages:result.ocrPages??[],ocrReviewRequired:result.ocrReviewRequired??false,classification:result.classification,pageAudit:result.pageAudit??[],pageCoverage:result.pageCoverage,evidenceRows:result.evidenceRows??[],scheduleRows:result.scheduleRows??[],importBlocked:result.importBlocked??false,missingOcrPages:result.missingOcrPages??[],ocrConfidenceByPage:result.ocrConfidenceByPage??[]});
      }else if(/\.doc$/i.test(f.name)){
        throw new Error('Legacy DOC is not supported; convert to DOCX or PDF first.');
      }else throw new Error('Unsupported format');
    }catch(e){setError(e instanceof Error?e.message:'Unable to read file');}finally{setBusy(false);}
  }
  function chooseSheet(name:string){
    setSheet(name);
    const s=workbook?.sheets.find(x=>x.sheetName===name);
    if(s){setHeaderRow(s.headerRow>0?s.headerRow:1);updatePreview({name:s.sheetName,...s.result,warnings:s.warnings});}
  }
  function previewManual(){
    setError('');
    try {if(!excelBytes)throw new Error('Select an Excel workbook');const result=previewMappedBoqSheet(excelBytes,file,sheet,headerRow,mapping);updatePreview({name:sheet,...result,warnings:['Manual column mapping: review source rows and calculations before import']});}
    catch(e){setError(e instanceof Error?e.message:'Manual mapping failed');}
  }
  function parsePasted(){
    setError('');
    try{const p=parseTenderText(text);setWorkbook(null);updatePreview({name:'Pasted tender text',...p});}
    catch(e){setError(e instanceof Error?e.message:'Parsing failed');}
  }
  return <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 p-3 md:p-5 text-slate-900">
    <div className="max-w-7xl mx-auto space-y-3">
      <button className="text-blue-700 underline" onClick={onBack}>← Back to Qilly</button>
      <div className="rounded-xl bg-gradient-to-r from-sky-900 via-blue-800 to-teal-700 text-white p-4 shadow-sm"><h1 className="text-2xl font-bold">Flexible BOQ Import</h1><p className="text-sky-100 text-sm">BOQ import, correction and approval preview. Excel and text remain local to your browser; PDF/DOCX require a configured protected extraction server. No data is saved to Qilly.</p></div>
      <section className="bg-white border border-sky-100 shadow-sm rounded-xl p-3 space-y-3">
        <label className="block font-semibold" htmlFor="boq-file">Choose BOQ or tender document</label>
        <input id="boq-file" type="file" accept=".xlsx,.xls,.csv,.tsv,.txt,.pdf,.doc,.docx" disabled={busy} onChange={e=>{const f=e.target.files?.[0];if(f)void load(f);}}/>
        <p className="text-sm text-slate-600">Excel, CSV, text, PDF and DOCX can be previewed. PDF/DOCX extraction requires a configured authenticated server. Scanned PDFs may need OCR.</p>
        {file&&<p className="text-sm">Selected: {file}</p>}
        {busy&&<p role="status">Reading file…</p>}
        {error&&<p role="alert" className="text-red-700">{error}</p>}
      </section>
      <section className="bg-white border border-sky-100 shadow-sm rounded-xl p-3 space-y-3">
        <label className="font-semibold block" htmlFor="tender-text">Paste tender / BOQ text (optional)</label><p className="text-sm text-slate-600">Use this only when you have copied selectable BOQ rows from a tender, email or spreadsheet. Paste one item per line with columns separated by tabs, a | symbol, or two or more spaces: Item No | Description | Unit | Quantity | Rate | Amount. For an unpriced BOQ, leave Rate and Amount blank. This is a local text parser, not PDF OCR; use the document upload above for PDF/DOCX.</p>
        <textarea id="tender-text" value={text} onChange={e=>setText(e.target.value)} rows={5} maxLength={2000000} placeholder="Paste item | description | unit | quantity | rate | amount, one line per item" className="w-full border rounded p-2"/>
        <button onClick={parsePasted} className="bg-blue-700 text-white rounded px-4 py-2" disabled={!text.trim()||busy}>Parse pasted text</button>
      </section>
      {workbook&&<section className="bg-white border border-sky-100 shadow-sm rounded-xl p-3"><label htmlFor="boq-sheet" className="font-semibold mr-3">Worksheet</label><select id="boq-sheet" value={sheet} onChange={e=>chooseSheet(e.target.value)} className="border p-2 rounded">{workbook.sheets.map(s=><option key={s.sheetName} value={s.sheetName}>{s.sheetName} ({s.result.lines.length} lines)</option>)}</select></section>}
      {workbook&&<section className="bg-white border border-sky-100 shadow-sm rounded-xl p-3 space-y-3">
        <h2 className="font-semibold">Manual column mapping</h2>
        <p className="text-sm text-slate-600">For nonstandard SANRAL or other tender schedules, select the source column number (A=1). Description and quantity are required.</p>
        <label className="block text-sm">Header row <input type="number" min={1} max={30000} className="border rounded p-2 ml-2 w-24" value={headerRow} onChange={e=>setHeaderRow(Number(e.target.value))}/></label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(['itemCode','description','unit','quantity','rate','amount'] as const).map(field=><label key={field} className="text-sm capitalize">{field}
            <input type="number" min={1} max={500} placeholder="Column number" value={mapping[field]===undefined?'':mapping[field]!+1} onChange={e=>setMapping(m=>({...m,[field]:e.target.value===''?undefined:Number(e.target.value)-1}))} className="block w-full border rounded p-2"/>
          </label>)}
        </div>
        <button onClick={previewManual} className="bg-blue-700 text-white rounded px-4 py-2">Apply mapping and preview</button>
      </section>}
      {preview&&<section className="bg-white border border-sky-100 shadow-sm rounded-xl p-3 space-y-4">
        <h2 className="text-xl font-semibold">Import preview — {preview.name}</h2>
        <div className="flex flex-wrap items-center justify-between gap-3 border rounded-lg p-3 bg-slate-50"><div><h3 className="font-semibold">Customer review pack</h3><p className="text-xs text-slate-600">Customer review downloads as a spreadsheet-friendly CSV; technical JSON is optional. No approval is performed.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={exportCustomerReview} className="rounded bg-teal-700 px-4 py-2 text-white font-semibold">Download customer review (CSV)</button><button type="button" onClick={exportReview} className="rounded border border-slate-300 bg-white px-3 py-2 text-slate-700 text-sm">Technical JSON</button></div></div>
        {preview.pageCoverage&&<div className="border rounded-lg p-4 space-y-3" aria-label="Page coverage review"><h3 className="font-semibold text-blue-900">Page-by-page tender coverage</h3><div className="flex flex-wrap gap-4 text-sm"><span>Source pages: <strong>{preview.pageCoverage.total}</strong></span><span>Accounted for: <strong>{preview.pageCoverage.accounted}</strong></span><span>Review required: <strong>{preview.pageCoverage.manualReview}</strong></span><span>Unresolved: <strong>{preview.pageCoverage.unresolved}</strong></span></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm"><div className="rounded-lg bg-sky-50 border border-sky-200 p-3"><strong className="text-xl text-sky-800">{preview.pageCoverage.total?Math.round(100*preview.pageCoverage.accounted/preview.pageCoverage.total):0}%</strong><p>Pages accounted for</p></div><div className="rounded-lg bg-teal-50 border border-teal-200 p-3"><strong className="text-xl text-teal-800">{preview.pageCoverage.total?Math.round(100*(preview.pageAudit?.filter(p=>!p.requiresReview).length??0)/preview.pageCoverage.total):0}%</strong><p>Pages without review flag</p></div><div className="rounded-lg bg-amber-50 border border-amber-200 p-3"><strong className="text-xl text-amber-800">{preview.pageCoverage.total?Math.round(100*(preview.pageAudit?.filter(p=>p.disposition==='schedule_review').length??0)/preview.pageCoverage.total):0}%</strong><p>Pricing pages extracted for review</p></div></div><p className="text-xs text-slate-600">Page accounting is not the same as accurate BOQ extraction. Select a page to see its evidence and outstanding actions.</p><div className="flex flex-wrap gap-2 text-xs" aria-label="Tender page status legend"><span className="rounded border border-teal-300 bg-teal-100 px-2 py-1 font-medium">Teal — BOQ candidate / schedule evidence (review required)</span><span className="rounded border border-slate-300 bg-slate-100 px-2 py-1 font-medium">Grey — classified non-pricing</span><span className="rounded border border-amber-300 bg-amber-100 px-2 py-1 font-medium">Amber — manual review / OCR required</span><span className="rounded border-2 border-blue-700 bg-white px-2 py-1 font-medium">Blue outline — selected page</span></div><div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-2 max-h-48 overflow-y-auto">{preview.pageAudit?.map(p=><button type="button" key={p.page} aria-label={`Review source page ${p.page}`} aria-pressed={selectedPage===p.page} onClick={()=>setSelectedPage(p.page)} className={`rounded border p-2 text-xs ${selectedPage===p.page?'ring-2 ring-blue-700':''} ${p.disposition==='ocr_review'||p.disposition==='manual_review'?'bg-amber-100 border-amber-300':p.disposition==='non_pricing'?'bg-slate-100 border-slate-300':'bg-teal-100 border-teal-300'}`}>{p.page}</button>)}</div>{selectedPage!==null&&preview.pageAudit?.filter(p=>p.page===selectedPage).map(p=><div key={p.page} className="border rounded p-3 space-y-2 text-sm"><h4 className="font-semibold">Source page {p.page}: {p.disposition.replaceAll('_',' ')}</h4><p>{p.reason}</p><p>Classification: {p.classification.replaceAll('_',' ')} · Text fragments: {p.fragments} · OCR: {p.ocrRequired?(p.ocrCompleted?'completed':'required'):'not required'}{p.confidence===undefined?'':` · Confidence: ${p.confidence.toFixed(1)}%`}</p><p>BOQ candidates: {preview.candidates?.filter(c=>c.sourcePage===p.page).length??0} · Reconstructed schedules: {preview.scheduleRows?.filter(r=>r.page===p.page).length??0} · Unmatched lines: {preview.unparsed?.filter(u=>u.sourcePage===p.page).length??0}</p><p className="text-amber-800">Compare this page against the original PDF before customer acceptance.</p></div>)}</div>}
        <div className="border rounded-xl overflow-hidden" aria-label="Side-by-side Tender Reconciliation Workspace">
          <div className="bg-slate-900 text-white px-4 py-3"><h3 className="font-semibold">Tender Reconciliation Workspace</h3><p className="text-xs text-slate-200">Compare the original source against Qilly's interpretation. Edits remain local to this session.</p></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-3 border-r space-y-2 min-w-0">
              <div className="flex items-center justify-between gap-2"><h4 className="font-semibold">Original tender</h4>{preview.pageAudit?.length?<label className="text-sm">Page <select aria-label="Reconciliation source page" className="border rounded p-1 text-slate-900" value={selectedPage??1} onChange={e=>setSelectedPage(Number(e.target.value))}>{preview.pageAudit.map(p=><option key={p.page} value={p.page}>{p.page} — {p.disposition.replaceAll('_',' ')}</option>)}</select></label>:null}</div>
              {sourceKind==='pdf'&&sourcePdfUrl?<iframe title="Original PDF source" src={sourcePdfUrl+'#page='+(selectedPage??1)+'&view=FitH'} className="w-full h-[460px] border rounded" />:<div className="min-h-40 border rounded bg-slate-50 p-4 text-sm text-slate-600">Original inline PDF viewing is available for PDF files selected in this session. For Excel, DOCX and pasted text, compare against the original document separately.</div>}
              {sourcePdfUrl&&<a href={sourcePdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline text-sm">Open original PDF in a separate tab</a>}
            </div>
            <div className="p-3 space-y-3 min-w-0">
              <h4 className="font-semibold">Qilly interpretation {preview.pageAudit?.length?'— page '+(selectedPage??1):''}</h4>
              {preview.pageAudit?.filter(p=>p.page===(selectedPage??1)).map(p=><p key={p.page} className="text-sm bg-slate-50 rounded p-2">{p.disposition.replaceAll('_',' ')} — {p.reason}</p>)}
              <div className="max-h-[440px] overflow-auto space-y-3">
                {preview.lines.map((line,i)=>({line,i,source:preview.candidates?.find(c=>c.sourceLine===line.sourceRow)})).filter(x=>!preview.pageAudit?.length||x.source?.sourcePage===(selectedPage??1)).slice(0,100).map(({line,i,source})=><div key={i} className="border rounded p-3 space-y-2 text-sm"><p className="font-medium">Item {line.itemCode||'Unnumbered'} · Source row {line.sourceRow}</p>{source&&<p className="text-xs text-slate-500 break-words">Source: {source.raw}</p>}<label className="block">Description <input aria-label={`Reconciliation row ${line.sourceRow} description`} className="w-full border rounded p-2" value={line.description} onChange={e=>editLine(i,'description',e.target.value)}/></label><div className="grid grid-cols-3 gap-2">{(['quantity','rate','amount'] as const).map(field=><label key={field} className="capitalize">{field}<input aria-label={`Reconciliation row ${line.sourceRow} ${field}`} type="number" step="any" className="w-full border rounded p-1" value={line[field]??''} onChange={e=>editLine(i,field,e.target.value)}/></label>)}</div>{line.quantity!==null&&line.rate!==null&&line.amount!==null&&Math.abs(line.quantity*line.rate-line.amount)>0.01&&<p role="alert" className="text-amber-800">Arithmetic discrepancy: expected {(line.quantity*line.rate).toFixed(2)}; source amount {line.amount.toFixed(2)}</p>}</div>)}
                {preview.scheduleRows?.filter(r=>!preview.pageAudit?.length||r.page===(selectedPage??1)).slice(0,100).map((r,i)=><div key={'schedule'+i} className="border rounded p-3 text-sm"><p className="font-medium">{r.type.replaceAll('_',' ')} — {r.description}</p><p>Source values: {r.amounts.map(a=>a.raw).join(' | ')||'Missing price'}</p><p className="text-amber-800">Review only — not an imported BOQ line</p></div>)}
                {preview.unparsed?.filter(r=>!preview.pageAudit?.length||r.sourcePage===(selectedPage??1)).slice(0,30).map((r,i)=><p key={'unparsed'+i} className="border border-amber-300 rounded p-2 text-sm">Unmatched source line {r.sourceLine}: {r.text}</p>)}
              </div>
              <p className="text-xs text-slate-600">Source page links are based on parser mappings. Unmapped records remain visible in the full reconciliation tables below.</p>
            </div>
          </div>
        </div>
        {preview.importBlocked&&<div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 space-y-3 text-amber-950"><h3 className="font-bold">Extraction incomplete — approval remains blocked</h3><p className="text-sm">Qilly has read the document but cannot yet confirm a complete, accurate unpriced BOQ. Review the following source evidence before accepting this import.</p><div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm"><div className="rounded bg-white border p-2"><strong className="block text-lg">{preview.lines.length}</strong>BOQ rows recognised</div><div className="rounded bg-white border p-2"><strong className="block text-lg">{preview.unparsed?.length??0}</strong>Unmatched source lines</div><div className="rounded bg-white border p-2"><strong className="block text-lg">{preview.issues.length}</strong>Validation exceptions</div><div className="rounded bg-white border p-2"><strong className="block text-lg">{preview.missingOcrPages?.length??0}</strong>Pages awaiting OCR</div></div><p className="text-sm">Unresolved pages: <strong>{preview.pageCoverage?.unresolved??'Not reported'}</strong>. Pricing schedule evidence awaiting reconciliation: <strong>{preview.scheduleRows?.length??0}</strong> rows. These counts describe review work, not the number of confirmed missing BOQ items.</p><p className="text-sm font-medium">Next: open the page-by-page review, compare the original tender, correct recognised items and investigate unmatched source rows. Approval stays disabled until the extraction checks pass.</p></div>}{(preview.missingOcrPages?.length??0)>0&&<p role="alert" className="text-red-700">Scanned pages requiring OCR: {preview.missingOcrPages!.join(", ")}</p>}{preview.classification&&<div className="border p-3 rounded text-sm">Document classification: <strong>{preview.classification.type.replaceAll("_"," ")}</strong> ({preview.classification.confidence} confidence). Page-level sections must be checked before approval.</div>}{preview.ocrPages&&preview.ocrPages.length>0&&<div className="border p-3 rounded text-sm text-amber-900">OCR applied to page(s): {preview.ocrPages.join(", ")}. Check every extracted quantity, rate and amount against the source.</div>}{preview.scheduleRows&&preview.scheduleRows.length>0&&<div className="border rounded-lg p-3 space-y-2"><h3 className="font-semibold">Reconstructed tender schedules — review only</h3><p className="text-sm text-amber-800">These {preview.scheduleRows.length} rows are source evidence, not approved BOQ items. Reconcile with the original tender.</p><div className="max-h-72 overflow-auto"><table className="w-full text-xs"><thead><tr><th>Page</th><th>Schedule type</th><th>Description</th><th>Values</th><th>Arithmetic</th><th>Review action</th></tr></thead><tbody>{preview.scheduleRows.slice(0,200).map((r,i)=><tr key={i}><td>{r.page}</td><td>{r.type.replaceAll("_"," ")}</td><td>{r.description}</td><td>{r.amounts.map(a=>a.raw).join(" | ")}</td><td>{r.arithmetic?(r.arithmetic.matches?"Matches":"Mismatch: "+r.arithmetic.difference.toFixed(2)):"Manual review"}</td><td>{r.type==='service_pricing'?<button type="button" className="rounded border border-teal-600 px-2 py-1 text-teal-800 disabled:opacity-40" disabled={preview.lines.some(line=>line.sourceRow===100000+r.page*1000+r.line)} onClick={()=>stageServiceScheduleRow(r)}>{preview.lines.some(line=>line.sourceRow===100000+r.page*1000+r.line)?'Staged':'Stage for BOQ review'}</button>:'Review evidence only'}</td></tr>)}</tbody></table></div></div>}{preview.evidenceRows&&preview.evidenceRows.length>0&&<div className="border rounded-lg p-3 space-y-2"><h3 className="font-semibold">Tender pricing evidence — manual reconciliation only</h3><p className="text-sm text-amber-800">These {preview.evidenceRows.length} source values are NOT imported BOQ items. Check the original pricing schedules and map items manually.</p><div className="max-h-64 overflow-auto"><table className="w-full text-xs"><thead><tr><th>Page</th><th>Schedule</th><th>Source label</th><th>Source amounts</th></tr></thead><tbody>{preview.evidenceRows.slice(0,200).map((e,i)=><tr key={i}><td>{e.page}</td><td>{e.kind.replaceAll("_"," ")}</td><td>{e.label}</td><td>{e.values.join(" | ")}</td></tr>)}</tbody></table></div></div>}<div className="border rounded-lg bg-slate-50 p-4 space-y-2" aria-label="Source to Qilly reconciliation"><h3 className="font-semibold">Source-to-Qilly reconciliation</h3><div className="flex flex-wrap gap-4 text-sm"><span>Recognized: {preview.lines.length}</span><span>Unmatched: {preview.unparsed?.length??0}</span><span>Exceptions: {preview.issues.length}</span><span>Recognized amount: R {preview.lines.reduce((sum,line)=>sum+(line.amount??0),0).toLocaleString('en-ZA',{minimumFractionDigits:2,maximumFractionDigits:2})}</span></div><p className="text-sm text-amber-800">Recognized amount is not the tender total. Verify source schedules, VAT, provisional allowances and unparsed lines before approval.</p><p className="text-xs text-slate-600">The table below shows validated or manually staged BOQ rows. Source schedule values are displayed separately underneath; they are evidence, not approved BOQ rates.</p><div className="overflow-x-auto"><table className="text-xs w-full"><thead><tr>{['Source page','Source line','Item','Description','Unit','Qty','Rate','Amount','Calculated','Difference'].map(h=><th key={h} className="p-1 text-left">{h}</th>)}</tr></thead><tbody>{preview.lines.slice(0,200).map((line,i)=>{const source=preview.candidates?.find(c=>c.sourceLine===line.sourceRow);const calc=line.quantity!==null&&line.rate!==null?line.quantity*line.rate:null;return <tr key={i}><td>{source?.sourcePage??'—'}</td><td>{line.sourceRow}</td><td>{line.itemCode||'—'}</td><td>{line.description}</td><td>{line.unit||'—'}</td><td>{line.quantity??'—'}</td><td>{line.rate??'—'}</td><td>{line.amount??'—'}</td><td>{calc===null?'—':calc.toFixed(2)}</td><td>{calc===null||line.amount===null?'—':(line.amount-calc).toFixed(2)}</td></tr>;})}</tbody></table></div>{(preview.scheduleRows?.length??0)>0&&<div className="mt-3 space-y-2"><h4 className="font-semibold">Extracted source schedule values — awaiting BOQ mapping</h4><p className="text-xs text-amber-800">These are values read from the tender, not validated quantities, rates or Qilly pricing. Blank prices are shown as blank.</p><div className="overflow-x-auto max-h-64 overflow-y-auto"><table className="w-full text-xs"><thead><tr>{['Page','Source line','Schedule','Description','Source values','BOQ status'].map(h=><th key={h} className="p-2 text-left">{h}</th>)}</tr></thead><tbody>{preview.scheduleRows!.slice(0,200).map((r,i)=><tr key={i} className="border-t"><td className="p-2">{r.page}</td><td className="p-2">{r.line}</td><td className="p-2">{r.type.replaceAll('_',' ')}</td><td className="p-2">{r.description}</td><td className="p-2">{r.amounts.map(a=>a.raw).join(' | ')||'Blank / not supplied'}</td><td className="p-2">{preview.lines.some(line=>line.sourceRow===100000+r.page*1000+r.line)?'Staged for review':'Unmapped — review required'}</td></tr>)}</tbody></table></div></div>}</div>
        <div className="flex flex-wrap gap-3 text-sm"><span>{preview.lines.length} candidate lines</span><span>{preview.issues.length} validation issues</span><span>{preview.warnings.length} warnings</span></div>
        {preview.candidates&&<p className="text-sm text-slate-600">Source evidence: {preview.candidates.length} matched tender lines. Verify source page and line against the original document.</p>}{preview.unparsed&&preview.unparsed.length>0&&<details className="border rounded p-3"><summary className="font-semibold text-amber-800">Unmatched tender lines ({preview.unparsed.length}) — review manually</summary><ul className="text-sm space-y-1 mt-2">{preview.unparsed.slice(0,100).map((u,i)=><li key={i}>Page {u.sourcePage}, line {u.sourceLine}: {u.text}</li>)}</ul></details>}{preview.warnings.map((w,i)=><p key={i} className="text-amber-800 bg-amber-50 p-2">{w}</p>)}
        {preview.issues.length>0&&<details open><summary className="font-semibold">Validation issues</summary><ul className="list-disc pl-6">{preview.issues.slice(0,100).map((x,i)=><li key={i}>Row {x.row}: {x.field} — {x.message}</li>)}</ul></details>}
        <div className="overflow-auto"><table className="w-full text-sm border-collapse"><thead><tr>{['Row','Item','Description','Unit','Quantity','Rate','Amount'].map(x=><th key={x} className="border p-2 text-left">{x}</th>)}</tr></thead><tbody>{preview.lines.slice(0,200).map((x,i)=><tr key={i}><td className="border p-2">{x.sourceRow}</td>{(['itemCode','description','unit','quantity','rate','amount'] as const).map(field=><td key={field} className="border p-1"><input aria-label={`Row ${x.sourceRow} ${field}`} className="border rounded p-1 w-full min-w-20" type={['quantity','rate','amount'].includes(field)?'number':'text'} step="any" value={x[field]??''} onChange={e=>editLine(i,field,e.target.value)}/></td>)}</tr>)}</tbody></table></div>
        <div className="border-t pt-4 space-y-3"><h3 className="font-semibold">Customer review and approval</h3><p className="text-sm text-slate-600">Edit line items above, resolve every validation issue, and check the original tender document before approval. Approval is local to this preview and does not submit or price the BOQ.</p>{preview.ocrReviewRequired&&<label className="flex gap-2 items-start text-sm"><input type="checkbox" checked={ocrReviewed} onChange={e=>{setOcrReviewed(e.target.checked);setApproved(false);}}/>I have verified OCR-derived numeric fields against the original scanned pages.</label>}{(preview.unparsed?.length??0)>0&&<label className="flex gap-2 items-start text-sm"><input type="checkbox" checked={unmatchedReviewed} onChange={e=>{setUnmatchedReviewed(e.target.checked);setApproved(false);}}/>I have manually reviewed the unmatched tender lines against the source document.</label>}<label className="flex gap-2 items-start text-sm"><input type="checkbox" checked={acknowledged} onChange={e=>{setAcknowledged(e.target.checked);setApproved(false);}}/>I reviewed the source document, mappings, warnings and interpreted line items.</label><button type="button" className="bg-[#0077b6] disabled:opacity-40 text-white rounded px-4 py-2" disabled={preview.importBlocked || !preview.lines.length || preview.issues.length>0 || !acknowledged || ((preview.unparsed?.length??0)>0 && !unmatchedReviewed) || (preview.ocrReviewRequired && !ocrReviewed)} onClick={()=>setApproved(true)}>Approve interpreted BOQ (preview only)</button>{approved&&<p role="status" className="text-green-800 font-semibold">BOQ interpretation approved for this session. Pricing and saving remain unavailable pending security and integration gates.</p>}</div>
      </section>}
    </div>
  </main>;
}
