/** Local OCR for scanned tender pages, with orientation selection and manual review.
 * No external OCR API or automatic approval. Language data must be provisioned locally.
 */
import type { PositionedText } from './pdf-coordinate';
import type { PDFPageProxy } from 'pdfjs-dist';
import { createCanvas } from '@napi-rs/canvas';
import { createWorker } from 'tesseract.js';

export type OcrPageResult={items:PositionedText[];meanConfidence:number;rotation:number;warnings:string[]};
export async function recognizeTenderPage(page:PDFPageProxy,pageNumber:number,languagePath:string):Promise<OcrPageResult>{
 if(!languagePath)throw new Error('OCR language path must be configured locally');
 const worker=await createWorker('eng',1,{langPath:languagePath,cacheMethod:'none'});
 let best:{items:PositionedText[];meanConfidence:number;rotation:number}|null=null;
 try{
   for(const rotation of [0,90,180,270]){
     const viewport=page.getViewport({scale:1.5,rotation});
     if(viewport.width*viewport.height>18_000_000)throw new Error('OCR page exceeds pixel safety limit');
     const canvas=createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));
     const context=canvas.getContext('2d');
     await page.render({canvasContext:context as any,viewport,canvas:canvas as any}).promise;
     const response=await worker.recognize(canvas.toBuffer('image/png'),{}, {tsv:true});
     const rows=(response.data.tsv??'').split(/\r?\n/).slice(1).map(row=>row.split('\t')).filter(row=>row.length>=12&&row[0]==='5'&&row[11]?.trim());
     const items:PositionedText[]=[];
     let sum=0,valid=0;
     // PDF.js PageViewport exposes convertToPdfPoint, not inverseTransform.
     for(const w of rows){
       const x=Number(w[6]),y=Number(w[7]),width=Number(w[8]),height=Number(w[9]),confidence=Number(w[10]);
       if(![x,y,width,height,confidence].every(Number.isFinite)||confidence<0)continue;
       sum+=confidence;valid++;
       // PDF.js viewport inversion keeps source coordinates correct for rotated pages.
       const px=x+width/2,py=y+height/2;
       const [pdfX,pdfY]=viewport.convertToPdfPoint(px,py);
       items.push({text:w.slice(11).join('\t'),x:pdfX,y:pdfY,width:width/1.5,page:pageNumber});
     }
     const meanConfidence=valid?sum/valid:0;
     if(!best||meanConfidence>best.meanConfidence)best={items,meanConfidence,rotation};
     // High-confidence text in the initial orientation avoids 3 extra OCR passes.
     if(rotation===0&&meanConfidence>=92&&valid>=20)break;
   }
   if(!best)return {items:[],meanConfidence:0,rotation:0,warnings:['OCR found no reliable words; manual mapping required.']};
   const warnings=['OCR-derived text must be verified against the source before approval.'];
   if(best.meanConfidence<85)warnings.push('OCR mean confidence below 85%; manual review required.');
   if(best.rotation!==0)warnings.push('Scanned page required '+best.rotation+' degree OCR rotation.');
   return {...best,warnings};
 }finally{await worker.terminate();}
}
