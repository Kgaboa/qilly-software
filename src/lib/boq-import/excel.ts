import * as XLSX from 'xlsx';
import { normalizeBoqRows, type RawBoqRow, type BoqNormalization } from './normalize';

export type BoqSheetPreview = {
  sheetName: string;
  headerRow: number;
  headers: string[];
  totalSourceRows: number;
  result: BoqNormalization;
  warnings: string[];
};
export type BoqWorkbookPreview = { sheets: BoqSheetPreview[]; filename: string };
const MAX_BYTES = 15 * 1024 * 1024;
const MAX_ROWS = 30000;
const MAX_SHEETS = 40;
const headerNames = ['description','particulars','item description','quantity','qty','unit','uom','rate','amount','item no','item number'];
const norm = (v: unknown) => String(v ?? '').trim().toLowerCase().replace(/[_-]/g,' ').replace(/\s+/g,' ');
function detectHeader(rows: unknown[][]): number {
  let best = -1, score = 0;
  rows.slice(0, Math.min(40, rows.length)).forEach((r,i) => {
    const matches = r.map(norm).filter(x => headerNames.includes(x));
    const s = new Set(matches).size;
    if (s > score) {score=s;best=i;}
  });
  return score >= 2 ? best : -1;
}
export function previewBoqExcel(data: ArrayBuffer, filename: string): BoqWorkbookPreview {
  if (!/\.(xlsx|xls)$/i.test(filename)) throw new Error('Unsupported Excel file extension');
  if (!data.byteLength || data.byteLength > MAX_BYTES) throw new Error('Excel file is empty or exceeds 15 MB');
  const book = XLSX.read(data, { type:'array', cellDates:false, cellFormula:false, cellHTML:false, sheetRows:MAX_ROWS + 45 });
  if (book.SheetNames.length > MAX_SHEETS) throw new Error('Workbook has too many sheets');
  const sheets = book.SheetNames.map(sheetName => {
    const sheet = book.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet,{header:1,raw:true,defval:''});
    const headerRow = detectHeader(rows);
    const warnings:string[]=[];
    if (headerRow < 0) return {sheetName,headerRow:-1,headers:[],totalSourceRows:rows.length,result:{lines:[],issues:[]},warnings:['No confident BOQ header row found; manual mapping required']};
    const headers = rows[headerRow].map(v=>String(v??'').trim());
    if (new Set(headers.map(norm)).size !== headers.length) warnings.push('Duplicate column headings detected');
    if (rows.length >= MAX_ROWS + 45) warnings.push('Row limit reached; workbook may be truncated');
    const objects:RawBoqRow[] = rows.slice(headerRow+1).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
    const normalized=normalizeBoqRows(objects);
    normalized.lines.forEach(line=>{line.sourceRow += headerRow;});
    normalized.issues.forEach(issue=>{issue.row += headerRow;});
    return {sheetName,headerRow:headerRow+1,headers,totalSourceRows:rows.length,result:normalized,warnings};
  });
  return {filename,sheets};
}

/** Manual mapping for unfamiliar tender layouts. Indices are zero-based source columns. */
export type BoqColumnMap = Partial<Record<'itemCode'|'description'|'unit'|'quantity'|'rate'|'amount',number>>;
export function previewMappedBoqSheet(data:ArrayBuffer,filename:string,sheetName:string,headerRowOneBased:number,map:BoqColumnMap) {
  if (!/\.(xlsx|xls)$/i.test(filename) || data.byteLength>MAX_BYTES || !data.byteLength) throw new Error('Invalid Excel file');
  if (!Number.isInteger(headerRowOneBased) || headerRowOneBased<1 || headerRowOneBased>MAX_ROWS) throw new Error('Invalid header row');
  if(map.description===undefined || map.quantity===undefined) throw new Error('Map description and quantity before preview');
  const book=XLSX.read(data,{type:'array',cellFormula:false,cellHTML:false,sheetRows:MAX_ROWS+45});
  if(book.SheetNames.length>MAX_SHEETS) throw new Error('Too many worksheets');
  if(!book.SheetNames.includes(sheetName)) throw new Error('Worksheet not found');
  const rows=XLSX.utils.sheet_to_json<unknown[]>(book.Sheets[sheetName],{header:1,raw:true,defval:''});
  const aliases:Record<keyof BoqColumnMap,string>={itemCode:'Item No',description:'Description',unit:'Unit',quantity:'Quantity',rate:'Rate',amount:'Amount'};
  const mapped=rows.slice(headerRowOneBased).map(row=>Object.fromEntries(
    Object.entries(map).filter((entry):entry is [keyof BoqColumnMap,number]=>Number.isInteger(entry[1])&&entry[1]>=0)
      .map(([field,index])=>[aliases[field],row[index]??''])
  ));
  const result=normalizeBoqRows(mapped);
  result.lines.forEach(line=>{line.sourceRow+=headerRowOneBased-1;});
  result.issues.forEach(issue=>{issue.row+=headerRowOneBased-1;});
  return result;
}
