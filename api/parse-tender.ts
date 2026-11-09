export const config = { api: { bodyParser: false } };
import { createClient } from '@supabase/supabase-js';
import { parseTenderPdfServer } from '../server-bundles/pdf-server.mjs';
import { parseTenderDocxServer } from '../server-bundles/docx-server.mjs';

export default async function handler(req:any,res:any) {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const auth=req.headers.authorization;
  const token=auth?.startsWith('Bearer ')?auth.slice(7):'';
  const url=process.env.QILLY_IMPORT_SUPABASE_URL;
  const key=process.env.QILLY_IMPORT_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key) return res.status(503).json({error:'Document extraction is not configured'});
  if(!token) return res.status(401).json({error:'Authentication required'});
  const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await client.auth.getUser(token);
  if(error||!data.user) return res.status(401).json({error:'Invalid session'});
  const type=String(req.headers['x-qilly-file-type']||'').toLowerCase();
  if(!['pdf','docx'].includes(type)) return res.status(415).json({error:'Only PDF and DOCX supported'});
  const chunks:Buffer[]=[];
  let size=0;
  try {
    for await(const chunk of req) {
      const buf=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);
      size+=buf.length;
      if(size>15*1024*1024) return res.status(413).json({error:'File exceeds 15 MB'});
      chunks.push(buf);
    }
    if(!size) return res.status(400).json({error:'Empty document'});
    const bytes=new Uint8Array(Buffer.concat(chunks));
    const result=type==='pdf'?await parseTenderPdfServer(bytes):await parseTenderDocxServer(bytes);
    // Classification is a pricing safety gate, not a claim that every tender has a BOQ.
    // Known SBD preference forms must never produce priced line items, even if tables resemble schedules.
    const encodedFilename=String(req.headers['x-qilly-source-filename']||'').slice(0,500);
    let filename='';try{filename=decodeURIComponent(encodedFilename).slice(0,250);}catch{filename=encodedFilename;}
    // Inspect the parser's bounded, already-extracted text as well as the filename.
    // This is conservative: ambiguous/mixed tender packs require manual review.
    const evidence=[
      ...(Array.isArray(result.candidates)?result.candidates.map((v:any)=>v.raw):[]),
      ...(Array.isArray(result.unparsed)?result.unparsed.map((v:any)=>v.text):[]),
      ...(Array.isArray(result.lines)?result.lines.flatMap((v:any)=>[v.description,v.itemCode]):[])
    ].filter((v:unknown)=>typeof v==='string').join(' ').slice(0,200000);
    const filenameMatch=/\\bsbd[\\s._-]*6[\\s._-]*1\\b/i.test(filename)||
      /preference[\\s._-]*points[\\s._-]*(claim[\\s._-]*)?form/i.test(filename);
    const contentMatch=/\\bsbd\\s*6[.\\s-]*1\\b/i.test(evidence) &&
      /preference\\s+points|specific\\s+goals|preference\\s+points\\s+claim/i.test(evidence);
    if(filenameMatch||contentMatch){
      return res.status(200).json({...result,lines:[],importBlocked:true,
        classification:{type:'compliance_preference_form',confidence:filenameMatch&&contentMatch?'high':'requires_review',pageTypes:result.classification?.pageTypes??[]},
        warnings:[...(result.warnings??[]),'Possible SBD 6.1 preference points claim form: compliance review required; no BOQ lines were created. If this is a mixed tender pack, extract its BOQ schedule separately.'],
        issues:[],documentDisposition:'compliance_only'});
    }
    return res.status(200).json(result);
  }catch(e) {
    // Log only a bounded error category, never uploaded content, tokens or stack traces.
    const category = e instanceof Error ? e.name : 'UnknownError';
    console.error('[qilly-extraction] parser failure category:', /^[A-Za-z]+Error$/.test(category) ? category : 'UnknownError');
    // Do not expose document content, stack traces or internal parser details.
    return res.status(422).json({error:'Unable to extract tender document. Confirm the file is valid and review manually.'});
  }
}
