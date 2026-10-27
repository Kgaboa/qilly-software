import JSZip from 'jszip';
import { parseTenderText } from './tender-text';

/** Best-effort DOCX OOXML table extraction; never resolves external resources or macros. */
export async function parseTenderDocxServer(bytes:Uint8Array) {
  if(bytes.length<4 || bytes.length>15*1024*1024 || bytes[0]!==0x50 || bytes[1]!==0x4b) throw new Error('Invalid or oversized DOCX');
  const zip=await JSZip.loadAsync(bytes,{checkCRC32:true});
  const entries=Object.values(zip.files);
  if(entries.length>1500) throw new Error('DOCX contains too many ZIP entries');
  const inflated=entries.reduce((sum,entry)=>sum+(entry.dir?0:(entry as any)._data?.uncompressedSize??0),0);
  if(inflated>30*1024*1024) throw new Error('DOCX decompressed content exceeds safety limit');
  const document=zip.file('word/document.xml');
  if(!document) throw new Error('Missing DOCX document XML');
  const xml=await document.async('string');
  if(xml.length>12_000_000) throw new Error('Uncompressed document exceeds limit');
  const decoded=(s:string)=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&');
  const text=decoded(xml
    .replace(/<w:tab\b[^>]*\/>/g,'\t')
    .replace(/<\/w:tc>/g,' | ')
    .replace(/<\/w:tr>/g,'\n')
    .replace(/<\/w:p>/g,' ')
    .replace(/<[^>]+>/g,''));
  const parsed=parseTenderText(text);
  // DOCX is a best-effort conversion: never allow local approval while source
  // lines remain unmatched or validation errors remain unresolved.
  const importBlocked = parsed.lines.length === 0 ||
    parsed.issues.length > 0 ||
    parsed.unparsed.length > 0;
  return {...parsed,importBlocked,warnings:[...parsed.warnings,'DOCX extraction is best-effort; verify merged cells, multi-line descriptions, headings, VAT and totals against the original.']};
}
