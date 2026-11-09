import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

type IntakeDocument={id:string;name:string;kind:string;version:number;extraction_status:string;source_url:string|null};
type Requirement={id:string;description:string;mandatory:boolean;status:string;source_document_id:string|null;evidence_document_id:string|null};
export function TenderIntakeWorkspace({opportunity,onOpenTenderImport}:{onOpenTenderImport:()=>void;opportunity:{id:string;customer_name:string;tender_title:string;tender_reference:string|null;due_date:string|null}}){
 const [route,setRoute]=useState<'contractor_import'|'manual_entry'|'qilly_discovery'>('contractor_import');
 const [sourceUrl,setSourceUrl]=useState('');
 const [sourcePublishedAt,setSourcePublishedAt]=useState('');
 const [issuer,setIssuer]=useState(opportunity.customer_name);
 const [reference,setReference]=useState(opportunity.tender_reference||'');
 const [title,setTitle]=useState(opportunity.tender_title);
 const [closing,setClosing]=useState(opportunity.due_date||'');
 const [requirements,setRequirements]=useState<Requirement[]>([]);
 const [description,setDescription]=useState('');
 const [documents,setDocuments]=useState<IntakeDocument[]>([]);
 const [documentName,setDocumentName]=useState('');
 const [documentKind,setDocumentKind]=useState('tender_notice');
 const [documentUrl,setDocumentUrl]=useState('');
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const [verificationConfirmed,setVerificationConfirmed]=useState<Record<string,boolean>>({});
 useEffect(()=>{
   let active=true;
   setIssuer(opportunity.customer_name);setReference(opportunity.tender_reference||'');
   setTitle(opportunity.tender_title);setClosing(opportunity.due_date||'');
   void supabase.from('tender_intakes').select('route,issuer,reference,title,closing_date,source_url,source_published_at').eq('opportunity_id',opportunity.id).maybeSingle()
   .then(({data,error})=>{if(!active)return;if(error){setMessage(error.message);return;}if(data){setRoute(data.route === 'manual_entry' || data.route === 'qilly_discovery' ? data.route : 'contractor_import');setSourceUrl(data.source_url||'');setSourcePublishedAt(data.source_published_at?.slice(0,10)||'');setIssuer(data.issuer);setReference(data.reference);setTitle(data.title);setClosing(data.closing_date||'');}});
   void supabase.from('tender_compliance_requirements').select('id,description,mandatory,status,source_document_id,evidence_document_id').eq('opportunity_id',opportunity.id).order('created_at')
   .then(({data,error})=>{if(active){if(error)setMessage(error.message);else setRequirements(data||[]);}});
   void supabase.from('tender_intake_documents').select('id,name,kind,version,extraction_status,source_url').eq('opportunity_id',opportunity.id).order('created_at')
   .then(({data,error})=>{if(active){if(error)setMessage(error.message);else setDocuments(data||[]);}});
   return()=>{active=false;};
 },[opportunity.id,opportunity.customer_name,opportunity.tender_reference,opportunity.tender_title,opportunity.due_date]);
 const save=async()=>{
  setBusy(true);setMessage('');
  try{
   const {data:{user}}=await supabase.auth.getUser();if(!user)throw Error('Sign in required');
   if(!issuer.trim()||!reference.trim()||!title.trim())throw Error('Issuer, reference and title are required');
   if(sourceUrl.trim() && !/^https:\/\//i.test(sourceUrl.trim()))throw Error('Tender source must use HTTPS');
   if(route === 'qilly_discovery' && !sourceUrl.trim())throw Error('Discovered tenders require a source URL');
   const {error}=await supabase.from('tender_intakes').upsert({opportunity_id:opportunity.id,owner_user_id:user.id,route,issuer:issuer.trim(),reference:reference.trim(),title:title.trim(),closing_date:closing||null,source_url:sourceUrl.trim()||null,source_published_at:sourcePublishedAt?new Date(sourcePublishedAt+'T00:00:00Z').toISOString():null},{onConflict:'opportunity_id'});
   if(error)throw error;setMessage('Tender intake saved.');
  }catch(e){setMessage(e instanceof Error?e.message:'Unable to save');}finally{setBusy(false);}
 };
 const ensureIntake=async(userId:string)=>{
  if(!issuer.trim()||!reference.trim()||!title.trim())throw Error('Issuer, reference and title are required');
  if(sourceUrl.trim() && !/^https:\/\//i.test(sourceUrl.trim()))throw Error('Tender source must use HTTPS');
  const {error}=await supabase.from('tender_intakes').upsert({
   opportunity_id:opportunity.id,owner_user_id:userId,route,
   issuer:issuer.trim(),reference:reference.trim(),title:title.trim(),closing_date:closing||null,source_url:sourceUrl.trim()||null,source_published_at:sourcePublishedAt?new Date(sourcePublishedAt+'T00:00:00Z').toISOString():null
  },{onConflict:'opportunity_id'});
  if(error)throw error;
 };
 const addRequirement=async()=>{
  if(!description.trim())return;
  setBusy(true);setMessage('');
  try{
   const {data:{user}}=await supabase.auth.getUser();if(!user)throw Error('Sign in required');
   await ensureIntake(user.id);
   const {error}=await supabase.from('tender_compliance_requirements').insert({opportunity_id:opportunity.id,owner_user_id:user.id,description:description.trim(),mandatory:true,status:'evidence_required'});
   if(error)throw error;
   const result=await supabase.from('tender_compliance_requirements').select('id,description,mandatory,status,source_document_id,evidence_document_id').eq('opportunity_id',opportunity.id).order('created_at');
   if(result.error)throw result.error;
   setRequirements(result.data||[]);setDescription('');setMessage('Requirement added.');
  }catch(e){setMessage(e instanceof Error?e.message:'Unable to add requirement');}finally{setBusy(false);}
 };
 const registerDocument=async()=>{
  if(!documentName.trim())return;
  setBusy(true);setMessage('');
  try{
   const {data:{user}}=await supabase.auth.getUser();if(!user)throw Error('Sign in required');
   if(documentUrl.trim() && !/^https:\/\//i.test(documentUrl.trim()))throw Error('Document source must be an HTTPS link');
   await ensureIntake(user.id);
   const {error}=await supabase.from('tender_intake_documents').insert({
    opportunity_id:opportunity.id,owner_user_id:user.id,name:documentName.trim(),kind:documentKind,
    source_url:documentUrl.trim()||null,extraction_status:'pending',version:1
   });
   if(error)throw error;
   const result=await supabase.from('tender_intake_documents').select('id,name,kind,version,extraction_status,source_url').eq('opportunity_id',opportunity.id).order('created_at');
   if(result.error)throw result.error;
   setDocuments(result.data||[]);setDocumentName('');setDocumentUrl('');
   setMessage('Document reference registered. File extraction has not been performed.');
  }catch(e){setMessage(e instanceof Error?e.message:'Unable to register document');}finally{setBusy(false);}
 };
 const linkEvidence=async(requirement:Requirement,documentId:string)=>{
  setBusy(true);setMessage('');
  try{
   const {data:{user}}=await supabase.auth.getUser();if(!user)throw Error('Sign in required');
   if(documentId && !documents.some(d=>d.id===documentId))throw Error('Document must belong to this tender');
   const {data,error}=await supabase.from('tender_compliance_requirements')
    .update({evidence_document_id:documentId||null,status:documentId?'under_review':'evidence_required'})
    .eq('id',requirement.id).eq('opportunity_id',opportunity.id).eq('owner_user_id',user.id)
    .select('id,description,mandatory,status,source_document_id,evidence_document_id').single();
   if(error)throw error;
   setRequirements(previous=>previous.map(item=>item.id===data.id?data:item));
   setMessage(documentId?'Evidence linked; verification remains pending.':'Evidence link cleared.');
  }catch(e){setMessage(e instanceof Error?e.message:'Unable to link evidence');}finally{setBusy(false);}
 };
 const verifyEvidence=async(requirement:Requirement)=>{
  setBusy(true);setMessage('');
  try{
   if(!verificationConfirmed[requirement.id])throw Error('Confirm manual source evidence review first');
   if(!requirement.evidence_document_id)throw Error('Link a registered evidence document first');
   const {data:{user}}=await supabase.auth.getUser();if(!user)throw Error('Sign in required');
   const {data:document,error:docError}=await supabase.from('tender_intake_documents')
    .select('id,extraction_status,extraction_review').eq('id',requirement.evidence_document_id)
    .eq('opportunity_id',opportunity.id).eq('owner_user_id',user.id).single();
   if(docError)throw docError;
   if(!document||document.extraction_status!=='review'||!document.extraction_review)
    throw Error('Save extraction review evidence for this document before verification');
   const review=document.extraction_review as {importBlocked?:boolean;issues?:unknown[];pageCoverage?:{unresolved?:number};missingOcrPages?:unknown[]};
   if(review.importBlocked||review.issues?.length||review.pageCoverage?.unresolved||review.missingOcrPages?.length||(review as {unparsed?:unknown[]}).unparsed?.length)
    throw Error('Unresolved extraction exceptions prevent verification');
   const {data:updatedDocument,error:reviewError}=await supabase.from('tender_intake_documents')
    .update({extraction_review:{...review,verifiedAgainstSource:true,verifiedAt:new Date().toISOString(),verifiedBy:user.id}})
    .eq('id',requirement.evidence_document_id).eq('opportunity_id',opportunity.id)
    .eq('owner_user_id',user.id).eq('extraction_status','review').select('id').single();
   if(reviewError)throw reviewError;
   if(!updatedDocument)throw Error('Unable to record source review');
   const {data,error}=await supabase.from('tender_compliance_requirements')
    .update({status:'verified'}).eq('id',requirement.id).eq('opportunity_id',opportunity.id)
    .eq('owner_user_id',user.id).eq('evidence_document_id',requirement.evidence_document_id)
    .select('id,description,mandatory,status,source_document_id,evidence_document_id').single();
   if(error)throw error;
   setRequirements(previous=>previous.map(item=>item.id===data.id?data:item));
   setVerificationConfirmed(previous=>({...previous,[requirement.id]:false}));
   setMessage('Evidence manually verified for this requirement.');
  }catch(e){setMessage(e instanceof Error?e.message:'Unable to verify evidence');}
  finally{setBusy(false);}
 };
 const verified=requirements.filter(r=>r.mandatory&&r.status==='verified').length;
 const mandatory=requirements.filter(r=>r.mandatory).length;
 const boqDocuments=documents.filter(doc=>doc.kind==='boq');
 const reviewedBoqDocuments=boqDocuments.filter(doc=>doc.extraction_status==='review');
 const pendingBoqDocuments=boqDocuments.filter(doc=>doc.extraction_status!=='review');
 return <section aria-label="Tender intake and compliance" className="rounded-lg border p-4 space-y-3">
  <h3 className="font-semibold">Tender Intake &amp; Compliance</h3>
  <p className="text-sm text-slate-600">Review discovered tender details and compliance evidence. Discovery does not imply that a BOQ was published or extracted.</p>
  <label className="block text-sm">Tender intake route
   <select aria-label="Tender intake route" className="mt-1 rounded border p-2" value={route} onChange={e=>setRoute(e.target.value as typeof route)}>
    <option value="contractor_import">Route B — Contractor-supplied tender</option>
    <option value="manual_entry">Route C — Manual tender entry</option>
    {route === 'qilly_discovery' && <option value="qilly_discovery">Route A — Qilly-discovered tender</option>}
   </select>
  </label>
  <div className="grid gap-2 md:grid-cols-2">
   <label className="text-sm">Issuer<input className="block w-full rounded border p-2" value={issuer} onChange={e=>setIssuer(e.target.value)}/></label>
   <label className="text-sm">Tender reference<input className="block w-full rounded border p-2" value={reference} onChange={e=>setReference(e.target.value)}/></label>
   <label className="text-sm">Title<input className="block w-full rounded border p-2" value={title} onChange={e=>setTitle(e.target.value)}/></label>
   <label className="text-sm">Closing date<input type="date" className="block w-full rounded border p-2" value={closing} onChange={e=>setClosing(e.target.value)}/></label>
  </div>
  <div className="grid gap-2 md:grid-cols-2">
   <label className="text-sm">Original tender source URL<input aria-label="Original tender source URL" type="url" placeholder="https://..." className="block w-full rounded border p-2" value={sourceUrl} onChange={e=>setSourceUrl(e.target.value)}/></label>
   <label className="text-sm">Source publication date<input aria-label="Source publication date" type="date" className="block w-full rounded border p-2" value={sourcePublishedAt} onChange={e=>setSourcePublishedAt(e.target.value)}/></label>
  </div>
  <div role="status" className="rounded border border-amber-300 bg-amber-50 p-3 text-sm space-y-2">
   <h4 className="font-semibold">Tender-to-BOQ readiness</h4>
   {boqDocuments.length===0 ? <p>No BOQ document is registered for this tender. A tender notice alone does not provide priceable BOQ lines. Check the original tender pack for a bill of quantities.</p> :
    <p>{boqDocuments.length} BOQ document reference(s) registered; {reviewedBoqDocuments.length} extraction review(s) saved; {pendingBoqDocuments.length} awaiting extraction review. A saved review does not yet mean that BOQ lines have been approved and linked to pricing.</p>}
   <p className="text-slate-700">Required: obtain the BOQ file, extract its line items, reconcile quantities and units, approve the reviewed BOQ, then link it to pricing. Until that handoff is implemented, the existing import remains necessary.</p>
   <button type="button" onClick={onOpenTenderImport} className="rounded border border-cyan-700 px-3 py-2 text-cyan-900">Open BOQ extraction and review</button>
  </div>
  <button type="button" disabled={busy} onClick={()=>void save()} className="rounded bg-cyan-700 px-3 py-2 text-white disabled:opacity-50">Save Intake</button>
  <p className="text-xs text-amber-800">Extraction opens the existing review workspace. Select a registered document there and explicitly save its extraction review to this tender. Source files are not saved by that action.</p>
  {route==='qilly_discovery' && sourceUrl && /^https:\/\//i.test(sourceUrl) && <p className="text-sm"><a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-800 underline">Open published tender source to locate its BOQ attachments</a></p>}
  <h4 className="font-semibold">Tender document register</h4>
  <p className="text-sm">Record the tender pack and its source. This step registers document metadata; it does not upload or extract the file.</p>
  <div className="grid gap-2 md:grid-cols-2">
   <input aria-label="Document name" className="rounded border p-2" placeholder="Tender document filename" value={documentName} onChange={e=>setDocumentName(e.target.value)}/>
   <select aria-label="Document category" className="rounded border p-2" value={documentKind} onChange={e=>setDocumentKind(e.target.value)}>{['tender_notice','boq','specification','drawing','addendum','other'].map(kind=><option key={kind} value={kind}>{kind.replaceAll('_',' ')}</option>)}</select>
   <input aria-label="Document source URL" className="rounded border p-2 md:col-span-2" placeholder="Source HTTPS URL (optional)" value={documentUrl} onChange={e=>setDocumentUrl(e.target.value)}/>
  </div>
  <button type="button" disabled={busy||!documentName.trim()} onClick={()=>void registerDocument()} className="rounded border px-3 py-2">Register Document</button>
  {documents.map(doc=><div className="rounded border p-2 text-sm" key={doc.id}>
   <p className="font-medium">{doc.name} — {doc.kind.replaceAll('_',' ')} · v{doc.version}</p>
   <p className="text-slate-600">Extraction: {doc.extraction_status==='review'?'Review evidence saved; pricing approval not yet confirmed':doc.extraction_status==='pending'?'Not extracted':doc.extraction_status.replaceAll('_',' ')}</p>
   {doc.source_url && /^https:\/\//i.test(doc.source_url) && <a className="text-cyan-800 underline" href={doc.source_url} target="_blank" rel="noopener noreferrer">Open original registered document</a>}
  </div>)}
  <h4 className="font-semibold">Compliance requirements</h4>
  <p className="text-sm">Verified mandatory requirements: {verified}/{mandatory}. Each mandatory requirement needs linked evidence, an extraction review without unresolved issues, and manual verification. This is not a final tender submission approval.</p>
  <div className="flex flex-wrap gap-2"><input aria-label="New compliance requirement" className="min-w-[220px] flex-1 rounded border p-2" placeholder="e.g. CIDB certificate" value={description} onChange={e=>setDescription(e.target.value)}/><button type="button" disabled={busy||!description.trim()} onClick={()=>void addRequirement()} className="rounded border px-3 py-2">Add Requirement</button></div>
  {requirements.map(r=><div className="flex flex-wrap items-center gap-2 rounded border p-2 text-sm" key={r.id}>
   <span className="flex-1">{r.description} — {r.status.replaceAll('_',' ')}</span>
   <label>Evidence document <select aria-label={'Evidence for '+r.description} disabled={busy} className="rounded border p-2" value={r.evidence_document_id||''} onChange={e=>void linkEvidence(r,e.target.value)}>
    <option value="">Not linked</option>{documents.map(doc=><option key={doc.id} value={doc.id}>{doc.name} (v{doc.version})</option>)}
   </select></label>
   {r.evidence_document_id&&r.status!=='verified'&&<label className="flex items-center gap-1">
    <input type="checkbox" checked={!!verificationConfirmed[r.id]} onChange={e=>setVerificationConfirmed(prev=>({...prev,[r.id]:e.target.checked}))}/>
    I manually checked this requirement against the original evidence
   </label>}
   {r.evidence_document_id&&r.status!=='verified'&&<button type="button" disabled={busy||!verificationConfirmed[r.id]} onClick={()=>void verifyEvidence(r)} className="rounded border px-3 py-2 disabled:opacity-40">Verify evidence</button>}
  </div>)}
  {message&&<p role="status" className="text-sm">{message}</p>}
 </section>;
}
