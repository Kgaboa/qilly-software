import { normalizeBoqRows, type RawBoqRow } from './normalize';

export type TenderCandidate = { sourceLine:number; sourcePage:number|null; raw:string; cells:string[] };
/** Conservative tender parser: retains source evidence, never invents quantities or prices. */
export function parseTenderText(text:string) {
  if(text.length>2_000_000) throw new Error('Tender text exceeds 2 million characters');
  const pages=text.split(/\f/);
  const rows:RawBoqRow[]=[];
  const candidates:TenderCandidate[]=[];
  const unparsed:{sourceLine:number;sourcePage:number;text:string}[]=[];
  let absoluteLine=0;
  for(const [p,page] of pages.entries()) {
    for(const line of page.split(/\r?\n/)) {
      absoluteLine++;
      const trimmed=line.trim();
      if(!trimmed) continue;
      const cells=trimmed.split(/\t|\s*\|\s*|\s{2,}/).map(s=>s.trim()).filter(Boolean);
      // Strict six-column and four-column recognition avoids treating headings/subtotals as items.
      const quantity=cells[3]?.replace(/,/g,'');
      const isQty=/^\d+(?:\.\d+)?$/.test(quantity??'');
      const isItem=/^(?:[A-Za-z]{0,5}[-.]?)?\d+[A-Za-z0-9.\/-]*$/.test(cells[0]??'');
      const unit=/^(?:m|m2|m3|m²|m³|mm|km|kg|t|ton|tonne|l|litre|no|nr|ea|each|item|sum|ls|hr|day|week|set|%|prov\.?\s*sum)$/i.test(cells[2]??'');
      const isSummary=/\b(subtotal|sub-total|total carried|grand total|vat|value added tax|brought forward)\b/i.test(cells[1]??'');
      if(cells.length>=4 && isItem && isQty && unit && cells[1]?.length>1 && !isSummary) {
        rows.push({'Item No':cells[0],Description:cells[1],Unit:cells[2],Quantity:cells[3],Rate:cells[4]??'',Amount:cells[5]??''});
        candidates.push({sourceLine:absoluteLine,sourcePage:p+1,raw:trimmed,cells});
      } else if(/\d/.test(trimmed) && trimmed.length>12) {
        unparsed.push({sourceLine:absoluteLine,sourcePage:p+1,text:trimmed.slice(0,300)});
      }
    }
  }
  const normalized=normalizeBoqRows(rows);
  normalized.lines.forEach((line,i)=>{line.sourceRow=candidates[i]?.sourceLine??line.sourceRow;});
  normalized.issues.forEach(issue=>{issue.row=candidates[issue.row-2]?.sourceLine??issue.row;});
  const warnings:string[]=[];
  if(unparsed.length) warnings.push('Some tender lines were not confidently recognized; review unmatched lines against the original document.');
  if(!candidates.length) warnings.push('No confidently structured BOQ items detected; manual review or mapping is required.');
  return {...normalized,candidates,unparsed,sourceLines:absoluteLine,pageCount:pages.length,warnings};
}
