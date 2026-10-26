/** Pure, browser-safe BOQ row normalization; no persistence or network calls. */
export type RawBoqRow = Record<string, unknown>;
export type NormalizedBoqLine = {
  sourceRow: number;
  itemCode: string;
  description: string;
  unit: string;
  quantity: number | null;
  rate: number | null;
  amount: number | null;
};
export type ImportIssue = { row: number; field: string; code: string; message: string };
export type BoqNormalization = { lines: NormalizedBoqLine[]; issues: ImportIssue[] };

const aliases: Record<string, string[]> = {
  itemCode: ['item','item no','item number','item code','code','ref','reference','bill item'],
  description: ['description','item description','work description','particulars','details'],
  unit: ['unit','uom','units'],
  quantity: ['quantity','qty','estimated quantity'],
  rate: ['rate','unit rate','price','unit price'],
  amount: ['amount','total','total amount','extended amount']
};
function key(s: string): string { return s.toLowerCase().trim().replace(/[_-]+/g,' ').replace(/\s+/g,' '); }
function value(row: RawBoqRow, field: string): unknown {
  const entry = Object.entries(row).find(([k])=>aliases[field].includes(key(k)));
  return entry?.[1];
}
function numberValue(v: unknown): number | null {
  if (v === undefined || v === null || String(v).trim()==='') return null;
  const cleaned=String(v).trim().replace(/,/g,'').replace(/^(R|ZAR|\$)\s*/i,'');
  if (!/^-?(?:\d+\.?\d*|\.\d+)$/.test(cleaned)) return null;
  const n=Number(cleaned); return Number.isFinite(n)?n:null;
}
export function normalizeBoqRows(rows: RawBoqRow[]): BoqNormalization {
  const lines: NormalizedBoqLine[]=[];
  const issues: ImportIssue[]=[];
  const seenItems = new Map<string, number>();
  rows.forEach((row,index)=>{
    const sourceRow=index+2;
    const description=String(value(row,'description')??'').trim();
    const itemCode=String(value(row,'itemCode')??'').trim();
    const unit=String(value(row,'unit')??'').trim();
    const quantity=numberValue(value(row,'quantity'));
    const rate=numberValue(value(row,'rate'));
    const amount=numberValue(value(row,'amount'));
    if (!description && !itemCode && quantity===null && rate===null && amount===null) return;
    if (!unit) issues.push({row:sourceRow,field:'unit',code:'MISSING_UNIT',message:'Unit is required for a measurable BOQ line'});
    if (itemCode) {
      const normalizedCode=itemCode.toLowerCase().replace(/\s+/g,'');
      const first=seenItems.get(normalizedCode);
      if(first!==undefined) issues.push({row:sourceRow,field:'itemCode',code:'DUPLICATE_ITEM',message:`Duplicate item code (first seen on row ${first})`});
      else seenItems.set(normalizedCode,sourceRow);
    }
    for(const [field,raw] of [['quantity',value(row,'quantity')],['rate',value(row,'rate')],['amount',value(row,'amount')]] as const) {
      if(raw!==null && raw!==undefined && String(raw).trim()!=='' && numberValue(raw)===null)
        issues.push({row:sourceRow,field,code:'INVALID_NUMBER',message:`${field} must be numeric`});
    }
    if (!description) issues.push({row:sourceRow,field:'description',code:'REQUIRED',message:'Description is required'});
    if (quantity===null) issues.push({row:sourceRow,field:'quantity',code:'INVALID_QUANTITY',message:'A numeric quantity is required'});
    else if (quantity<0) issues.push({row:sourceRow,field:'quantity',code:'NEGATIVE_QUANTITY',message:'Quantity must not be negative'});
    if (rate!==null && rate<0) issues.push({row:sourceRow,field:'rate',code:'NEGATIVE_RATE',message:'Rate must not be negative'});
    if (amount!==null && amount<0) issues.push({row:sourceRow,field:'amount',code:'NEGATIVE_AMOUNT',message:'Amount must not be negative'});
    if (rate!==null && quantity!==null && amount!==null && Math.abs(rate*quantity-amount)>0.02)
      issues.push({row:sourceRow,field:'amount',code:'AMOUNT_MISMATCH',message:'Amount differs from quantity multiplied by rate'});
    lines.push({sourceRow,itemCode,description,unit,quantity,rate,amount});
  });
  return {lines,issues};
}
