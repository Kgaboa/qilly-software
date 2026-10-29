/** Section-aware table reconstruction for non-standard tender schedules.
 * All output is review evidence, NEVER automatically priced BOQ lines.
 */
import type { PositionedText } from './pdf-coordinate';

export type ScheduleType='resource_cost'|'service_pricing'|'commission'|'area_summary';
export type ScheduleRow={
 page:number;line:number;type:ScheduleType;description:string;
 cells:{text:string;x:number}[];amounts:{raw:string;value:number}[];
 source:string;periodValues?:{period:string;raw:string;value:number|null;x:number}[];reviewRequired:true;missingPrice?:boolean;commissionPercent?:number;arithmetic?:{expected:number;actual:number;difference:number;matches:boolean}
};
const clean=(s:string)=>s.replace(/\s+/g,' ').trim();
const money=/^(?:R\s*)?-?\d{1,3}(?:[ ,]\d{3})*(?:[.,]\d{2})$|^(?:R\s*)?-?\d+[.,]\d{2}$/i;
const parseMoney=(s:string)=>Number(s.replace(/[R\s,]/gi,''));
const header=/\b(?:description|item|service|particulars|area office|resource|labour|manpower|unit|quantity|rate|price|amount|excluding vat|including vat|commission)\b/i;
const stop=/\b(?:terms and conditions|instructions to bidders|evaluation criteria|declaration by bidder|signature of bidder)\b/i;
function linesForPage(parts:PositionedText[]){
 const lines:{y:number;cells:{text:string;x:number}[]}[]=[];
 for(const part of [...parts].filter(p=>p.text.trim()).sort((a,b)=>b.y-a.y||a.x-b.x)){
   const prev=lines[lines.length-1];
   if(prev&&Math.abs(prev.y-part.y)<=3)prev.cells.push({text:clean(part.text),x:part.x});
   else lines.push({y:part.y,cells:[{text:clean(part.text),x:part.x}]});
 }
 return lines.map(l=>({...l,cells:l.cells.sort((a,b)=>a.x-b.x)}));
}
function detectKind(text:string):ScheduleType|null{
 if(/area office/i.test(text)&&/excluding vat/i.test(text))return 'area_summary';
 if(/level of manpower|no of hours|labour cost|resource cost|travelling/i.test(text))return 'resource_cost';
 if(/\bcommission\b|\bfundraising fee\b|\bpercentage of funds raised\b/i.test(text))return 'commission';
 if(/pricing schedule|schedule of prices|price schedule|service description|licensing fee|subscription fee/i.test(text))return 'service_pricing';
 return null;
}
export function reconstructTenderSchedules(items:PositionedText[]){
 const byPage=new Map<number,PositionedText[]>();
 for(const part of items){const a=byPage.get(part.page)??[];a.push(part);byPage.set(part.page,a);}
 const rows:ScheduleRow[]=[];
 const warnings:string[]=[];
 for(const [page,parts] of byPage){
   const lines=linesForPage(parts);
   let kind:ScheduleType|null=null;
   let headerX:number[]=[];
   let periodColumns:{period:string;x:number}[]=[];
   let last:ScheduleRow|null=null;
   let lastY=0;
   for(let i=0;i<lines.length;i++){
     const {y,cells}=lines[i];
     const source=clean(cells.map(c=>c.text).join(' '));
     if(stop.test(source)){kind=null;last=null;continue;}
     const detected=detectKind(source);
     if(detected){kind=detected;headerX=cells.map(c=>c.x);last=null;const inlinePeriods=cells.flatMap(cell=>[...cell.text.matchAll(/\b(?:20\d{2}(?:\s*[-/]\s*(?:20)?\d{2})?|year\s*[1-9]\d*)\b/gi)].map(m=>({period:clean(m[0]),x:cell.x})));if(kind==='service_pricing'&&inlinePeriods.length)periodColumns=inlinePeriods;continue;}
     // Capture only explicit year headings with their PDF x-coordinates; never invent periods.
     const periodHeaders=cells.flatMap(c=>[...c.text.matchAll(/\b(?:20\d{2}(?:\s*[-/]\s*(?:20)?\d{2})?|year\s*[1-9]\d*)\b/gi)].map(m=>({period:clean(m[0]),x:c.x})));
     if(kind==='service_pricing'&&periodHeaders.length){periodColumns=periodHeaders;last=null;continue;}
     if(!kind||!source)continue;
     const amounts=cells.filter(c=>money.test(c.text)).map(c=>({raw:c.text,value:parseMoney(c.text)})).filter(v=>Number.isFinite(v.value));
     const description=clean(cells.filter(c=>!money.test(c.text)).map(c=>c.text).join(' '));
     // Continuations must be inside the previous row's descriptive region.
     // Never merge numeric fragments, item numbers, VAT, or new headings.
     if(amounts.length===0&&last&&last.page===page&&lastY-y>0&&lastY-y<=19&&
       description.length>=4&&!header.test(description)&&!/\b(?:vat|total|subtotal|carried forward)\b/i.test(description)&&
       cells.every(c=>c.x>=last.cells[0].x-5&&c.x<(headerX[1]??last.cells[0].x+260))){
       last.description=clean(last.description+' '+description);
       last.source=clean(last.source+' '+source);
       lastY=y;
       continue;
     }
     last=null;
     if(!description||/^\d+$/.test(description))continue;
     // Blank service-pricing forms use isolated currency placeholders, not quoted prices.
     // Keep these rows for customer mapping instead of dropping them as empty.
     const hasBlankPrice=kind==='service_pricing'&&amounts.length===0&&cells.some(c=>/^R\s*$/i.test(c.text));
     const commissionRate=kind==='commission'?source.match(/\b(\d{1,2}(?:\.\d+)?)\s*%/):null;
     if(!amounts.length&&!hasBlankPrice&&!commissionRate)continue;
     if(kind==='area_summary'&&amounts.length<3)continue;
     const periodValues=kind==='service_pricing'&&periodColumns.length?cells.filter(cell=>money.test(cell.text)||/^R\s*$/i.test(cell.text)).map(cell=>{const heading=periodColumns.reduce((best,p)=>Math.abs(p.x-cell.x)<Math.abs(best.x-cell.x)?p:best);return {period:heading.period,raw:cell.text,value:money.test(cell.text)?parseMoney(cell.text):null,x:cell.x};}):[];
     const entry:ScheduleRow={page,line:i+1,type:kind,description,cells,amounts,source:source.slice(0,700),...(periodValues.length?{periodValues}:{}),reviewRequired:true,...(hasBlankPrice?{missingPrice:true}:{}),...(commissionRate?{commissionPercent:Number(commissionRate[1])}:{})};
     if(kind==='area_summary'&&amounts.length>=3){
       const [excluding,vat,including]=amounts.slice(-3).map(a=>a.value);
       const difference=Math.round((excluding+vat-including)*100)/100;
       entry.arithmetic={expected:Math.round((excluding+vat)*100)/100,actual:including,difference,matches:Math.abs(difference)<=0.01};
       if(!entry.arithmetic.matches)warnings.push('Page '+page+' area summary arithmetic mismatch: '+description);
     }
     rows.push(entry);last=entry;lastY=y;
     if(rows.length>=5000){warnings.push('Schedule evidence limited to 5,000 rows.');return {rows,warnings};}
   }
 }
 if(rows.length)warnings.push('Non-standard schedule rows are review-only and cannot be automatically imported as construction BOQ items.');
 return {rows,warnings};
}
