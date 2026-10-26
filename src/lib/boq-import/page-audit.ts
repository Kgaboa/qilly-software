/** Complete page accounting for every tender type.
 * Coverage measures whether every source page has an auditable outcome, NOT whether
 * every page contains an importable BOQ. Never synthesize a rate or quantity.
 */
import type { PositionedText } from './pdf-coordinate';
export type PageDisposition='boq_candidate'|'schedule_review'|'non_pricing'|'ocr_review'|'manual_review';
export type PageAudit={page:number;disposition:PageDisposition;classification:string;fragments:number;ocrRequired:boolean;ocrCompleted:boolean;confidence?:number;requiresReview:boolean;reason:string};
export function auditTenderPages(args:{pageCount:number;items:PositionedText[];classification:{pageTypes:{page:number;type:string}[]};candidates:{sourcePage:number}[];scheduleRows:{page:number}[];ocrRequiredPages?:number[];ocrPages?:number[];ocrConfidenceByPage?:{page:number;confidence:number}[]}):PageAudit[]{
 const count=new Map<number,number>();
 for(const p of args.items)count.set(p.page,(count.get(p.page)??0)+1);
 const required=new Set(args.ocrRequiredPages??[]);
 const completed=new Set(args.ocrPages??[]);
 const boq=new Set(args.candidates.map(r=>r.sourcePage));
 const schedule=new Set(args.scheduleRows.map(r=>r.page));
 const conf=new Map((args.ocrConfidenceByPage??[]).map(r=>[r.page,r.confidence]));
 return Array.from({length:args.pageCount},(_,i)=>{
   const page=i+1,classification=args.classification.pageTypes[i]?.type??'unknown';
   const ocrRequired=required.has(page),ocrCompleted=completed.has(page);
   const confidence=conf.get(page);
   let disposition:PageDisposition='manual_review',reason='No confidently mapped table; manual page review required';
   if(ocrRequired&&(!ocrCompleted||confidence===undefined||confidence<85)){disposition='ocr_review';reason='OCR missing or below confidence threshold';}
   else if(boq.has(page)){disposition='boq_candidate';reason='Candidate BOQ rows require source reconciliation';}
   else if(schedule.has(page)){disposition='schedule_review';reason='Pricing schedule extracted as review-only evidence';}
   else if(classification==='procedure_manual'||classification==='tender_administration'){disposition='non_pricing';reason='Classified as non-pricing; verify no embedded price schedule was missed';}
   return {page,disposition,classification,fragments:count.get(page)??0,ocrRequired,ocrCompleted,...(confidence===undefined?{}:{confidence}),requiresReview:disposition!=='non_pricing',reason};
 });
}
