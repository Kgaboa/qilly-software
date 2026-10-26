/** Conservative classification of tender PDF content. This is not a tender eligibility decision. */
import type { PositionedText } from './pdf-coordinate';
export type TenderDocumentType='priced_boq'|'unpriced_boq'|'service_pricing_schedule'|'resource_cost_schedule'|'tender_administration'|'procedure_manual'|'scanned_pdf'|'mixed_tender'|'unknown';
export type DocumentClassification={type:TenderDocumentType;confidence:'high'|'medium'|'low';pageTypes:{page:number;type:TenderDocumentType}[];warnings:string[]};
function classify(text:string):TenderDocumentType{
 const s=text.toLowerCase();
 // A page can contain an administrative footer alongside an actual pricing table.
 // Give explicit financial table headers precedence over generic tender wording.
 if(/\b(?:area office)\b/.test(s)&&/\b(?:excluding vat|including vat)\b/.test(s))return 'resource_cost_schedule';
 if(/\b(?:item totals excluding vat|level of manpower|no of hours|resource cost|labour rate)\b/.test(s))return 'resource_cost_schedule';
 if(/\b(?:pricing schedule|price schedule|schedule of prices|service description|licensing fees|bidder.s commission|funding value)\b/.test(s))return 'service_pricing_schedule';
 if(/\b(?:standard operating procedure|procedure approvals|governance\/business rule)\b/.test(s))return 'procedure_manual';
 if(/\b(?:level of manpower|no of hours|travelling remove the equipment|resource cost|labour rate)\b/.test(s))return 'resource_cost_schedule';
 if(/\b(?:pricing schedule|pricing instructions|schedule of prices|funding value|bidder.s commission|annual subscription|licensing fees|total rates for years)\b/.test(s)&&!/\b(?:bill of quantities|quantity\s+rate\s+amount)\b/.test(s))return 'service_pricing_schedule';
 if(/\b(?:bill of quantities|boq|schedule of quantities)\b/.test(s)||(/\bquantity\b/.test(s)&&/\brate\b/.test(s)&&/\b(?:unit|amount)\b/.test(s)))return /\b(?:priced|amount|rate)\b/.test(s)?'priced_boq':'unpriced_boq';
 if(/\b(?:invitation to bid|tender notice|conditions of contract|bidder contact|request for proposal|request for quotation)\b/.test(s))return 'tender_administration';
 return 'unknown';
}
export function classifyTenderDocument(items:PositionedText[],pageCount:number):DocumentClassification{
 const byPage=new Map<number,string[]>();
 for(const i of items){const list=byPage.get(i.page)??[];list.push(i.text);byPage.set(i.page,list);}
 const pageTypes=Array.from({length:pageCount},(_,index)=>({page:index+1,type:classify((byPage.get(index+1)??[]).join(' ').slice(0,40000))}));
 const counts=new Map<TenderDocumentType,number>();
 for(const p of pageTypes)if(p.type!=='unknown')counts.set(p.type,(counts.get(p.type)??0)+1);
 const ordered=[...counts.entries()].sort((a,b)=>b[1]-a[1]);
 let type:TenderDocumentType=ordered[0]?.[0]??'unknown';
 if(items.length===0)type='scanned_pdf';
 else if(ordered.length>1&&ordered[1][1]>=Math.max(2,Math.ceil(pageCount*.15)))type='mixed_tender';
 const confidence:DocumentClassification['confidence']=items.length===0?'high':ordered[0]?.[1]>=Math.max(2,Math.ceil(pageCount*.6))?'high':ordered[0]?.[1]>=2?'medium':'low';
 const warnings:string[]=[];
 if(type==='scanned_pdf')warnings.push('No selectable text: scanned or image-only PDF requires a separate OCR workflow.');
 if(type==='mixed_tender')warnings.push('Multiple document sections detected; only explicitly validated BOQ rows may be imported.');
 if(type==='procedure_manual'||type==='tender_administration')warnings.push('This document is not automatically a priced BOQ. Do not invent items from administrative tables.');
 return {type,confidence,pageTypes,warnings};
}
