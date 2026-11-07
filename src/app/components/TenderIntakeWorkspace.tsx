import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

type IntakeDocument={id:string;name:string;kind:string;version:number;extraction_status:string;source_url:string|null};
type Requirement={id:string;description:string;mandatory:boolean;status:string;source_document_id:string|null;evidence_document_id:string|null};
export function TenderIntakeWorkspace({opportunity,onOpenTenderImport}:{onOpenTenderImport:()=>void;opportunity:{id:string;customer_name:string;tender_title:string;tender_reference:string|null;due_date:string|null}}){
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
   void supabase.from('tender_intakes').select('issuer,reference,title,closing_date').eq('opportunity_id',opportunity.id).maybeSingle()
   .then(({data,error})=>{if(!active)return;if(error){setMessage(error.message);return;}if(data){setIssuer(data.issuer);setReference(data.reference);setTitle(data.title);setClosing(data.closing_date||'');}});
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
   const {error}=await supabase.from('tender_intakes').upsert({opportunity_id:opportunity.id,owner_user_id:user.id,route:'contractor_import',issuer:issuer.trim(),reference:reference.trim(),title:title.trim(),closing_date:closing||null},{onConflict:'opportunity_id'});
   if(error)throw error;setMessage('Tender intake saved.');
  }catch(e){setMessage(e instanceof Error?e.message:'Unable to save');}finally{setBusy(false);}
 };
 const addRequirement=async()=>{
  if(!description.trim())return;
  setBusy(true);setMessage('');
  try{
   const {data:{user}}=await supabase.auth.getUser();if(!user)throw Error('Sign in required');
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
   if(review.importBlocked||review.issues?.length||review.pageCoverage?.unresolved||review.missingOcrPages?.length)
    throw Error('Unresolved extraction exceptions prevent verification');
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
 return <section aria-label="Tender intake and compliance" className="rounded-lg border p-4 space-y-3">
  <h3 className="font-semibold">Tender Intake &amp; Compliance — Route B</h3>
  <p className="text-sm text-slate-600">Capture tender details and compliance evidence. Existing BOQ import remains available through Price BOQ. Automated discovery is planned for Route A.</p>
  <div className="grid gap-2 md:grid-cols-2">
   <label className="text-sm">Issuer<input className="block w-full rounded border p-2" value={issuer} onChange={e=>setIssuer(e.target.value)}/></label>
   <label className="text-sm">Tender reference<input className="block w-full rounded border p-2" value={reference} onChange={e=>setReference(e.target.value)}/></label>
   <label className="text-sm">Title<input className="block w-full rounded border p-2" value={title} onChange={e=>setTitle(e.target.value)}/></label>
   <label className="text-sm">Closing date<input type="date" className="block w-full rounded border p-2" value={closing} onChange={e=>setClosing(e.target.value)}/></label>
  </div>
  <button type="button" disabled={busy} onClick={()=>void save()} className="rounded bg-cyan-700 px-3 py-2 text-white disabled:opacity-50">Save Intake</button>
  <button type="button" className="rounded bg-cyan-700 px-3 py-2 text-white" onClick={onOpenTenderImport}>Open Existing PDF / Word / Excel Extraction</button>
  <p className="text-xs text-amber-800">Extraction opens the existing review workspace. Select a registered document there and explicitly save its extraction review to this tender. Source files are not saved by that action.</p>
  <h4 className="font-semibold">Tender document register</h4>
  <p className="text-sm">Record the tender pack and its source. This step registers document metadata; it does not upload or extract the file.</p>
  <div className="grid gap-2 md:grid-cols-2">
   <input aria-label="Document name" className="rounded border p-2" placeholder="Tender document filename" value={documentName} onChange={e=>setDocumentName(e.target.value)}/>
   <select aria-label="Document category" className="rounded border p-2" value={documentKind} onChange={e=>setDocumentKind(e.target.value)}>{['tender_notice','boq','specification','drawing','addendum','other'].map(kind=><option key={kind} value={kind}>{kind.replaceAll('_',' ')}</option>)}</select>
   <input aria-label="Document source URL" className="rounded border p-2 md:col-span-2" placeholder="Source HTTPS URL (optional)" value={documentUrl} onChange={e=>setDocumentUrl(e.target.value)}/>
  </div>
  <button type="button" disabled={busy||!documentName.trim()} onClick={()=>void registerDocument()} className="rounded border px-3 py-2">Register Document</button>
  {documents.map(doc=><p className="text-sm" key={doc.id}>{doc.name} — {doc.kind.replaceAll('_',' ')} · v{doc.version} · {doc.extraction_status}</p>)}
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
