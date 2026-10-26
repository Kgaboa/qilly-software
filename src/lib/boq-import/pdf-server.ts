/** Server-only, conservative coordinate-aware PDF extraction.
 * Local-only optional OCR; no persistence, external fetching, or automatic pricing.
 */
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { parsePositionedTender, type PositionedText } from './pdf-coordinate';
import { recognizeTenderPage } from './pdf-ocr';
import { auditTenderPages } from './page-audit';

export async function parseTenderPdfServer(bytes:Uint8Array) {
 if(!bytes.length||bytes.length>15*1024*1024)throw new Error('PDF must be between 1 byte and 15 MB');
 if(new TextDecoder('ascii').decode(bytes.slice(0,5))!=='%PDF-')throw new Error('Invalid PDF signature');
 const task=getDocument({data:new Uint8Array(bytes),useSystemFonts:true,disableFontFace:true,isEvalSupported:false,stopAtErrors:true});
 let pdf:Awaited<typeof task.promise>|undefined;
 try {
   pdf=await task.promise;
   if(pdf.numPages>200)throw new Error('PDF exceeds 200 page safety limit');
   const items:PositionedText[]=[];
   const ocrPages:number[]=[];
   const ocrRequiredPages:number[]=[];
   const ocrFailedPages:number[]=[];
   const ocrConfidenceByPage:{page:number;confidence:number;rotation:number}[]=[];
   const ocrWarnings:string[]=[];
   const ocrPath=process.env.QILLY_OCR_LANG_PATH;
   const ocrEnabled=process.env.QILLY_ENABLE_LOCAL_OCR==='true'&&Boolean(ocrPath);
   for(let pageNumber=1;pageNumber<=pdf.numPages;pageNumber++){
     const page=await pdf.getPage(pageNumber);
     const content=await page.getTextContent({disableNormalization:false});
     let pageTextCount=0;
     for(const element of content.items){
       if(!('str' in element)||!element.str?.trim())continue;
       const [,, , ,x,y]=element.transform;
       if(!Number.isFinite(x)||!Number.isFinite(y))continue;
       items.push({text:element.str,x,y,width:element.width,page:pageNumber});
       pageTextCount+=element.str.trim().length;
       if(items.length>200_000)throw new Error('PDF exceeds text fragment safety limit');
     }
     // OCR only pages with little selectable text; bounded to prevent resource exhaustion.
     if(pageTextCount<35)ocrRequiredPages.push(pageNumber);
     if(pageTextCount<35&&ocrEnabled){
       if(ocrPages.length>=12){ocrFailedPages.push(pageNumber);ocrWarnings.push('OCR page limit reached (12); remaining image pages require manual review.');}
       else try{
         const ocr=await recognizeTenderPage(page,pageNumber,ocrPath!);
         items.push(...ocr.items);
         if(!ocr.items.length)ocrFailedPages.push(pageNumber);
         else ocrPages.push(pageNumber);
         ocrConfidenceByPage.push({page:pageNumber,confidence:ocr.meanConfidence,rotation:ocr.rotation});
         ocrWarnings.push(...ocr.warnings.map(w=>'Page '+pageNumber+': '+w));
       }catch(error){ocrFailedPages.push(pageNumber);ocrWarnings.push('OCR failed on page '+pageNumber+': '+(error instanceof Error?error.message:'unknown error'));}
     }else if(pageTextCount<35&&!ocrEnabled)ocrWarnings.push('Page '+pageNumber+' has little selectable text; local OCR is disabled or not configured.');
     page.cleanup();
   }
   const result=parsePositionedTender(items,pdf.numPages);
   const lowConfidencePages=ocrConfidenceByPage.filter(item=>item.confidence<85).map(item=>item.page);
   const missingOcrPages=ocrRequiredPages.filter(page=>!ocrPages.includes(page)||lowConfidencePages.includes(page));
   const pageAudit=auditTenderPages({pageCount:pdf.numPages,items,classification:result.classification,candidates:result.candidates,scheduleRows:result.scheduleRows,ocrRequiredPages,ocrPages,ocrConfidenceByPage});
   const pageCoverage={total:pdf.numPages,accounted:pageAudit.length,manualReview:pageAudit.filter(p=>p.requiresReview).length,unresolved:pageAudit.filter(p=>p.disposition==='manual_review'||p.disposition==='ocr_review').length};
   const importBlocked=missingOcrPages.length>0||result.lines.length===0||result.issues.length>0||result.unparsed.length>0||result.scheduleRows.some(row=>row.arithmetic&&!row.arithmetic.matches);
   return {...result,pageAudit,pageCoverage,ocrPages,ocrRequiredPages,ocrFailedPages,ocrConfidenceByPage,lowConfidencePages,missingOcrPages,importBlocked,ocrReviewRequired:ocrPages.length>0,warnings:[...result.warnings,...ocrWarnings,...(missingOcrPages.length?['Some scanned pages have not been OCR processed; import approval blocked.']:[])]};
 } finally {
   if(pdf)await pdf.destroy();else await task.destroy();
 }
}
