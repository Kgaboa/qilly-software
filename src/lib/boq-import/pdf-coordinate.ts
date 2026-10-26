import { normalizeBoqRows, type RawBoqRow } from './normalize';

export type PositionedText = {text:string;x:number;y:number;width:number;page:number};
type Cell = {text:string;x:number};
import { classifyTenderDocument } from './document-classification';
import { extractTenderEvidence } from './tender-evidence';
import { reconstructTenderSchedules } from './schedule-reconstruction';
const item=/^(?:[A-Za-z]{0,5}[-.]?)?\d+[A-Za-z0-9./-]*$/;
const unit=/^(?:m|m2|m3|m²|m³|mm|km|kg|t|ton|tonne|l|litre|no|nr|ea|each|item|sum|ls|hr|day|week|set|%)$/i;
const numeric=/^\d+(?:,\d{3})*(?:\.\d+)?$/;
const summary=/\b(?:sub-?total|grand total|total carried|vat|value added tax|brought forward)\b/i;
function groupRows(items:PositionedText[]) {
 const sorted=[...items].filter(i=>i.text.trim()).sort((a,b)=>a.page-b.page||b.y-a.y||a.x-b.x);
 const rows:{page:number;y:number;cells:Cell[]}[]=[];
 for(const i of sorted){
   const last=rows[rows.length-1];
   if(last&&last.page===i.page&&Math.abs(last.y-i.y)<=3){
     last.cells.push({text:i.text.trim(),x:i.x});
   } else rows.push({page:i.page,y:i.y,cells:[{text:i.text.trim(),x:i.x}]});
 }
 return rows.map(row=>({...row,cells:row.cells.sort((a,b)=>a.x-b.x)}));
}
const clean=(s:string)=>s.replace(/\s+/g,' ').trim();
const join=(cells:Cell[])=>clean(cells.map(c=>c.text).join(' '));
/** Geometry-based reconstruction. Only confidently aligned BOQ rows are accepted.
 * Supporting calculations, wrapped cells and ambiguous columns stay in review.
 */
export function parsePositionedTender(items:PositionedText[],declaredPageCount?:number) {
 if(items.length>200_000) throw new Error('PDF contains too many text fragments');
 const rows=groupRows(items);
 const raw:RawBoqRow[]=[];
 const candidates:{sourceLine:number;sourcePage:number;raw:string;cells:string[]}[]=[];
 const unparsed:{sourceLine:number;sourcePage:number;text:string}[]=[];
 const warnings:string[]=[];
 const classification=classifyTenderDocument(items,declaredPageCount??Math.max(0,...items.map(i=>i.page)));
 const evidence=extractTenderEvidence(items);
 const schedules=reconstructTenderSchedules(items);
 warnings.push(...classification.warnings,...evidence.warnings,...schedules.warnings);
 const continuations:{page:number;sourceLine:number;text:string}[]=[];
 let lastCandidateIndex=-1;
 let lastCandidateY=0;
 let lastCandidatePage=0;
 let lastDescriptionStart=0;
 let lastDescriptionEnd=0;
 let lastHeader:{page:number;x:number[]} | null=null;
 for(let i=0;i<rows.length;i++){
   const row=rows[i], cells=row.cells, text=join(cells), lower=text.toLowerCase();
   if(/\b(?:description|particulars)\b/.test(lower)&&/\b(?:qty|quantity)\b/.test(lower)&&/\b(?:rate|price)\b/.test(lower)){
     const headerNames=['item','description','unit','quantity','rate','amount'];
     const positions=headerNames.map(name=>{
       const match=cells.find(c=>name==='quantity'?/\b(?:qty|quantity)\b/i.test(c.text):name==='amount'?/\b(?:amount|total)\b/i.test(c.text):name==='item'?/\b(?:item|ref|code)\b/i.test(c.text):new RegExp('\\b'+name+'\\b','i').test(c.text));
       return match?.x??NaN;
     });
     if(positions.every(Number.isFinite)&&positions.every((x,j)=>j===0||x>positions[j-1])) lastHeader={page:row.page,x:positions};
     continue;
   }
   if(summary.test(text)){lastCandidateIndex=-1;continue;}
   const pageType=classification.pageTypes[row.page-1]?.type;
   if(pageType==='procedure_manual'||pageType==='tender_administration'){
     lastCandidateIndex=-1;
     if(/\d/.test(text)&&text.length>12)unparsed.push({sourceLine:i+1,sourcePage:row.page,text:text.slice(0,300)});
     continue;
   }
   let parts:string[]|null=null;
   if(lastHeader?.page===row.page){
     const columns:string[][]=Array.from({length:6},()=>[]);
     for(const c of cells){
       let index=0;
       for(let j=1;j<6;j++)if(c.x>=(lastHeader.x[j-1]+lastHeader.x[j])/2)index=j;
       columns[index].push(c.text);
     }
     const p=columns.map(v=>clean(v.join(' ')));
     if(item.test(p[0])&&p[1].length>1&&unit.test(p[2])&&numeric.test(p[3]))parts=p;
   }
   if(!parts){
     // No column headers: infer only when tokens visibly form a complete, unambiguous row.
     const tokens=cells.flatMap(c=>c.text.split(/\s*\|\s*/)).map(t=>t.trim()).filter(Boolean);
     const u=tokens.findIndex((v,j)=>j>=2&&unit.test(v)&&numeric.test(tokens[j+1]??''));
     if(u>=2&&item.test(tokens[0])&&u+1<tokens.length&&u<=tokens.length-2){
       const tail=tokens.slice(u+2);
       if(tail.length<=2&&tail.every(v=>numeric.test(v)))parts=[tokens[0],clean(tokens.slice(1,u).join(' ')),tokens[u],tokens[u+1],tail[0]??'',tail[1]??''];
     }
   }
   if(parts&&parts[1]&&!summary.test(parts[1])){
     raw.push({'Item No':parts[0],Description:parts[1],Unit:parts[2],Quantity:parts[3],Rate:parts[4],Amount:parts[5]});
     candidates.push({sourceLine:i+1,sourcePage:row.page,raw:text,cells:parts});
     lastCandidateIndex=raw.length-1;lastCandidateY=row.y;lastCandidatePage=row.page;
     lastDescriptionStart=lastHeader?.page===row.page?lastHeader.x[1]:(cells[1]?.x??cells[0].x+15);
     lastDescriptionEnd=lastHeader?.page===row.page?lastHeader.x[2]:(cells.find(c=>unit.test(c.text))?.x??lastDescriptionStart+200);
   }else if(lastCandidateIndex>=0&&row.page===lastCandidatePage&&lastCandidateY-row.y>0&&lastCandidateY-row.y<=22&&
     cells.every(c=>c.x>=lastDescriptionStart-5&&c.x<lastDescriptionEnd-5)&&!item.test(cells[0]?.text??'')&&!summary.test(text)&&
     !/\b(?:qty|quantity|unit|rate|amount|total|hours|travelling)\b/i.test(text)&&text.length>=4){
     // A short, description-column-only continuation immediately below a recognized row.
     // Do not merge numeric/rate fragments or content on another page.
     raw[lastCandidateIndex].Description=clean(String(raw[lastCandidateIndex].Description)+' '+text);
     candidates[lastCandidateIndex].raw+=' '+text;
     candidates[lastCandidateIndex].cells[1]=String(raw[lastCandidateIndex].Description);
     continuations.push({page:row.page,sourceLine:i+1,text});
     lastCandidateY=row.y;
   }else if(/\d/.test(text)&&text.length>12){
     lastCandidateIndex=-1;
     unparsed.push({sourceLine:i+1,sourcePage:row.page,text:text.slice(0,300)});
   }else{lastCandidateIndex=-1;}
 }
 const normalized=normalizeBoqRows(raw);
 normalized.lines.forEach((line,i)=>{line.sourceRow=candidates[i]?.sourceLine??line.sourceRow;});
 normalized.issues.forEach(issue=>{issue.row=candidates[issue.row-2]?.sourceLine??issue.row;});
 if(unparsed.length)warnings.push('Some positioned PDF rows were not confidently recognized; review source pages and unmatched lines.');
 if(!candidates.length)warnings.push('No confidently structured BOQ items detected; manual table mapping required.');
 warnings.push('Coordinate extraction is conservative: merged cells, wrapped descriptions and supporting schedules require human reconciliation.');
 return {...normalized,candidates,unparsed,sourceLines:rows.length,pageCount:declaredPageCount??Math.max(0,...items.map(i=>i.page)),classification,continuations,evidenceRows:evidence.rows,scheduleRows:schedules.rows,warnings};
}
