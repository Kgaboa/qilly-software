/** Review-only pricing evidence from non-standard tender tables.
 * Never converts supporting calculations or administrative tables into priced BOQ lines.
 */
import type { PositionedText } from './pdf-coordinate';
export type TenderEvidenceRow={
 page:number;line:number;kind:'area_office_summary'|'item_amount_summary'|'pricing_row'|'resource_calculation';
 label:string;values:string[];source:string;requiresReview:true
};
const amount=/^-?(?:R\s*)?\d{1,3}(?:[ ,]\d{3})*(?:[.,]\d{2})$|^-?(?:R\s*)?\d+[.,]\d{2}$/i;
const item=/^\d{1,3}\.\d{1,3}$/;
const clean=(v:string)=>v.replace(/\s+/g,' ').trim();
export function extractTenderEvidence(items:PositionedText[]){
 const rows:TenderEvidenceRow[]=[];
 const byPage=new Map<number,PositionedText[]>();
 for(const part of items){const p=byPage.get(part.page)??[];p.push(part);byPage.set(part.page,p);}
 for(const [page,parts] of byPage){
   const sorted=[...parts].filter(p=>p.text.trim()).sort((a,b)=>b.y-a.y||a.x-b.x);
   const lines:{y:number;cells:PositionedText[]}[]=[];
   for(const part of sorted){
     const prev=lines[lines.length-1];
     if(prev&&Math.abs(prev.y-part.y)<=3)prev.cells.push(part);
     else lines.push({y:part.y,cells:[part]});
   }
   let context:'area'|'item'|'pricing'|'resource'|'none'='none';
   for(let index=0;index<lines.length;index++){
     const cells=lines[index].cells.sort((a,b)=>a.x-b.x);
     const fragments=cells.map(c=>clean(c.text)).filter(Boolean);
     const source=clean(fragments.join(' '));
     if(/area office/i.test(source)&&/excluding vat/i.test(source)){context='area';continue;}
     if(/item totals excluding vat/i.test(source)){context='item';continue;}
     if(/level of manpower|no of hours|labour costs|transport cost for item/i.test(source)){context='resource';continue;}
     if(/pricing schedule|service description|price schedule/i.test(source)){context='pricing';continue;}
     if(/conditions of contract|instructions to bidders|terms and conditions/i.test(source)){context='none';continue;}
     if(context==='none'||source.length<5)continue;
     // Do not infer money from numbers with no financial context.
     const amounts=fragments.filter(v=>amount.test(v.replace(/\s/g,'')));
     const kind=context==='area'?'area_office_summary':context==='item'?'item_amount_summary':context==='resource'?'resource_calculation':'pricing_row';
     const label=fragments.find(v=>!amount.test(v.replace(/\s/g,''))&&!/^\d+$/.test(v))??'';
     if(!label||amounts.length===0)continue;
     if(context==='area'&&amounts.length<3)continue;
     if(context==='item'&&!fragments.some(v=>item.test(v)))continue;
     rows.push({page,line:index+1,kind,label,values:amounts,source:source.slice(0,600),requiresReview:true});
     if(rows.length>=5000)return {rows,warnings:['Review evidence truncated at 5,000 rows.']};
   }
 }
 return {rows,warnings:rows.length?['Extracted pricing evidence is for manual reconciliation only; not approved BOQ items.']:[]};
}
