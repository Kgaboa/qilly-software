import {createClient} from '@supabase/supabase-js';

// Authenticated, contractor-scoped retrieval of public eTenders attachments.
// No arbitrary URL input: the server reads the registered document URL from RLS-protected data.
export default async function handler(req:any,res:any){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 const token=String(req.headers.authorization||'').replace(/^Bearer /,'');
 const url=process.env.QILLY_IMPORT_SUPABASE_URL,key=process.env.QILLY_IMPORT_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return res.status(503).json({error:'Document retrieval not configured'});
 if(!token)return res.status(401).json({error:'Authentication required'});
 const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{headers:{Authorization:'Bearer '+token}}});
 const {data:{user},error:authError}=await client.auth.getUser(token);
 if(authError||!user)return res.status(401).json({error:'Invalid session'});
 const documentId=typeof req.body?.documentId==='string'?req.body.documentId:'';
 const tenderId=typeof req.body?.tenderId==='string'?req.body.tenderId:'';
 if(!/^[a-f0-9-]{36}$/i.test(documentId)||!/^[a-f0-9-]{36}$/i.test(tenderId))return res.status(400).json({error:'Invalid tender or document'});
 const {data:doc,error}=await client.from('tender_intake_documents').select('id,name,kind,source_url').eq('id',documentId).eq('opportunity_id',tenderId).eq('owner_user_id',user.id).single();
 if(error||!doc)return res.status(404).json({error:'Document not found for this contractor'});
 if(!doc.source_url)return res.status(422).json({error:'No source URL registered for this document'});
 let source:URL;
 try{source=new URL(doc.source_url);}catch{return res.status(422).json({error:'Invalid source URL'});}
 // Reject arbitrary hosts, userinfo, ports and non-HTTPS schemes (SSRF protection).
 if(source.protocol!=='https:'||source.username||source.password||source.port||!['www.etenders.gov.za','etenders.gov.za'].includes(source.hostname.toLowerCase()))return res.status(422).json({error:'Only official eTenders HTTPS document URLs are supported'});
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
 try{
  const response=await fetch(source.toString(),{redirect:'manual',signal:controller.signal,headers:{Accept:'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/octet-stream'}});
  if(!response.ok)return res.status(502).json({error:response.status>=300&&response.status<400?'Document source redirects are not supported':'Published document unavailable (HTTP '+response.status+')'});
  const length=Number(response.headers.get('content-length')||0);
  if(length>15*1024*1024)return res.status(413).json({error:'Document exceeds 15 MB'});
  const reader=response.body?.getReader();if(!reader)return res.status(502).json({error:'Empty source response'});
  const parts:Uint8Array[]=[];let total=0;
  while(true){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>15*1024*1024){await reader.cancel();return res.status(413).json({error:'Document exceeds 15 MB'});}parts.push(value);}
  const bytes=Buffer.concat(parts.map(p=>Buffer.from(p)));
  const pdf=bytes.subarray(0,5).toString()==='%PDF-';
  const zip=bytes[0]===0x50&&bytes[1]===0x4b;
  if(!pdf&&!zip)return res.status(422).json({error:'The published link is not a supported PDF, DOCX or XLSX document'});
  const type=pdf?'pdf':/\.docx(?:$|\?)/i.test(source.pathname)?'docx':'xlsx';
  res.setHeader('Content-Type',pdf?'application/pdf':'application/octet-stream');
  res.setHeader('X-Qilly-Document-Type',type);
  res.setHeader('X-Content-Type-Options','nosniff');
  return res.status(200).send(bytes);
 }catch{return res.status(502).json({error:'Unable to retrieve the published document securely'});}
 finally{clearTimeout(timeout);}
}
