import * as XLSX from 'xlsx';
import type { BoqRowType } from './boqImport';
import { resolveImportedBoqRow } from './boqImport';

export interface SanralTargetMapping {
  id: string;
  sheetName: string;
  headerRow: number;
  itemColumn: number;
  descriptionColumn: number;
  unitColumn: number;
  quantityColumn: number;
  rateColumn: number;
  amountColumn: number;
}

export interface SanralNativeCellReference {
  sheetName: string;
  rowIndex: number;
  rateColumn: number;
  amountColumn: number;
}

export interface SanralNativeWorkbookContext {
  mode: 'sanral-native';
  sourceFileName: string;
  outputFileName: string;
  contractNumber: string;
  workbookData: ArrayBuffer;
  targets: SanralTargetMapping[];
  selectedTargetId: string;
  /** Existing positive rates are preserved unless the user explicitly opts in. */
  repriceExistingRates?: boolean;
}

export interface SanralImportedItem {
  code: string;
  name: string;
  description: string;
  quantity: string;
  unit: string;
  isRateOnly: boolean;
  rowType?: BoqRowType;
  sanralCellRef: SanralNativeCellReference;
}

export interface SanralPricedItem extends SanralImportedItem {
  finalUnitPrice?: string;
  baseUnitPrice?: string;
  landedUnitPrice?: string;
  unitPrice?: string;
  totalPrice?: string;
  pricingRequirement?: string;
}

export interface SanralExportResult {
  data: ArrayBuffer;
  fileName: string;
  writtenRows: number;
  unresolvedRows: number;
  preservedExistingRateRows: number;
  replacedExistingRateRows: number;
  preservedFormulaRows: number;
  changedCells: string[];
}

const cleanHeader = (value: unknown): string =>
  String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');

const columnName = (column: number): string => XLSX.utils.encode_col(column);

export function parseSanralInputFileName(fileName: string): { contractNumber: string; outputFileName: string } | null {
  const match = /^SANRAL_(.+)_UNPRICED\.xlsx$/i.exec(fileName.trim());
  if (!match) return null;
  const contractNumber = match[1].trim().replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^_+|_+$/g, '');
  if (!contractNumber) return null;
  return {
    contractNumber,
    outputFileName: `SANRAL_${contractNumber}_QILLY_PRICED.xlsx`,
  };
}

function findHeaderColumn(headers: string[], candidates: string[], fallback = -1): number {
  const found = headers.findIndex(header => candidates.some(candidate => header === candidate || header.includes(candidate)));
  return found >= 0 ? found : fallback;
}

export function detectSanralTargets(workbook: XLSX.WorkBook): SanralTargetMapping[] {
  const targets: SanralTargetMapping[] = [];

  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet?.['!ref']) return;
    const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1, defval: '', raw: false });

    rows.forEach((row, rowIndex) => {
      const headers = row.map(cleanHeader);
      const rateColumns = headers
        .map((header, column) => ({ header, column }))
        .filter(entry => entry.header === 'rate' || entry.header === 'unitrate')
        .map(entry => entry.column);

      if (!rateColumns.length) return;
      const itemColumn = findHeaderColumn(headers, ['itemno', 'payitemno', 'itemnumber', 'item'], 0);
      const descriptionColumn = findHeaderColumn(headers, ['description', 'particulars', 'details'], 1);
      const unitColumn = findHeaderColumn(headers, ['unit', 'uom'], 2);

      rateColumns.forEach(rateColumn => {
        let amountColumn = -1;
        for (let candidate = rateColumn + 1; candidate <= Math.min(rateColumn + 3, headers.length - 1); candidate += 1) {
          if (headers[candidate] === 'amount' || headers[candidate] === 'totalamount' || headers[candidate] === 'value') {
            amountColumn = candidate;
            break;
          }
        }
        if (amountColumn < 0) return;

        let quantityColumn = -1;
        for (let candidate = rateColumn - 1; candidate >= Math.max(0, rateColumn - 3); candidate -= 1) {
          if (headers[candidate] === 'quantity' || headers[candidate] === 'qty') {
            quantityColumn = candidate;
            break;
          }
        }
        if (quantityColumn < 0 || descriptionColumn < 0 || unitColumn < 0) return;

        targets.push({
          id: `${sheetName}:${rowIndex}:${rateColumn}:${amountColumn}`,
          sheetName,
          headerRow: rowIndex,
          itemColumn,
          descriptionColumn,
          unitColumn,
          quantityColumn,
          rateColumn,
          amountColumn,
        });
      });
    });
  });

  return targets;
}

export function describeSanralTarget(target: SanralTargetMapping): string {
  return `${target.sheetName} — ${columnName(target.quantityColumn)} QUANTITY / ${columnName(target.rateColumn)} RATE / ${columnName(target.amountColumn)} AMOUNT`;
}

export function createSanralWorkbookContext(fileName: string, data: ArrayBuffer): SanralNativeWorkbookContext {
  const parsedName = parseSanralInputFileName(fileName);
  if (!parsedName) {
    throw new Error('Use the filename SANRAL_<ContractNumber>_UNPRICED.xlsx for SANRAL Native Workbook pricing.');
  }

  const workbook = XLSX.read(new Uint8Array(data), {
    type: 'array',
    cellStyles: true,
    cellFormula: true,
    cellDates: true,
    bookVBA: true,
  });
  const targets = detectSanralTargets(workbook);
  if (!targets.length) {
    throw new Error('No supported SANRAL QUANTITY, RATE and AMOUNT column group was detected. The workbook was not changed.');
  }

  return {
    mode: 'sanral-native',
    sourceFileName: fileName,
    outputFileName: parsedName.outputFileName,
    contractNumber: parsedName.contractNumber,
    workbookData: data.slice(0),
    targets,
    selectedTargetId: targets[0].id,
    repriceExistingRates: false,
  };
}

export function countExistingSanralRates(
  context: SanralNativeWorkbookContext,
  selectedTargetId = context.selectedTargetId,
): number {
  const target = context.targets.find(candidate => candidate.id === selectedTargetId);
  if (!target) return 0;
  const workbook = XLSX.read(new Uint8Array(context.workbookData), { type: 'array', cellFormula: true });
  const worksheet = workbook.Sheets[target.sheetName];
  if (!worksheet?.['!ref']) return 0;
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  let count = 0;
  for (let row = target.headerRow + 1; row <= range.e.r; row += 1) {
    const address = XLSX.utils.encode_cell({ r: row, c: target.rateColumn });
    if (positivePrice((worksheet[address] as XLSX.CellObject | undefined)?.v) > 0) count += 1;
  }
  return count;
}

export function parseSanralItems(context: SanralNativeWorkbookContext, selectedTargetId = context.selectedTargetId): SanralImportedItem[] {
  const target = context.targets.find(candidate => candidate.id === selectedTargetId);
  if (!target) throw new Error('Select a valid SANRAL RATE and AMOUNT target before pricing.');

  const workbook = XLSX.read(new Uint8Array(context.workbookData), { type: 'array', cellFormula: true, cellDates: true });
  const worksheet = workbook.Sheets[target.sheetName];
  if (!worksheet) throw new Error(`The SANRAL pricing sheet ${target.sheetName} is no longer available.`);
  const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1, defval: '', raw: false });
  const columnMap = {
    itemNo: target.itemColumn,
    description: target.descriptionColumn,
    unit: target.unitColumn,
    quantity: target.quantityColumn,
    rate: target.rateColumn,
    amount: target.amountColumn,
  };

  const items: SanralImportedItem[] = [];
  for (let rowIndex = target.headerRow + 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex] || [];
    const parts = row.map(value => String(value ?? '').trim());
    const resolved = resolveImportedBoqRow(parts, columnMap);
    if (!resolved.description?.trim()) continue;
    const descriptionHeader = cleanHeader(resolved.description);
    if (descriptionHeader === 'description' || descriptionHeader === 'itemdescription') continue;

    items.push({
      code: resolved.code.trim(),
      name: resolved.description.trim(),
      description: '',
      quantity: resolved.quantity,
      unit: resolved.unit.trim(),
      isRateOnly: /^rate\s*only$/i.test(String(parts[target.quantityColumn] || '').trim()),
      rowType: resolved.rowType,
      sanralCellRef: {
        sheetName: target.sheetName,
        rowIndex,
        rateColumn: target.rateColumn,
        amountColumn: target.amountColumn,
      },
    });
  }

  return items;
}

const positivePrice = (...values: unknown[]): number => {
  for (const value of values) {
    const parsed = Number.parseFloat(String(value ?? '').replace(/,/g, ''));
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return 0;
};

function setNumericCell(worksheet: XLSX.WorkSheet, address: string, value: number): void {
  const existing = worksheet[address] as XLSX.CellObject | undefined;
  if (existing?.f) {
    existing.v = value;
    existing.t = 'n';
    return;
  }
  worksheet[address] = {
    ...(existing || {}),
    t: 'n',
    v: value,
    z: existing?.z || '#,##0.00',
  } as XLSX.CellObject;
}

export function buildSanralPricedWorkbook(
  context: SanralNativeWorkbookContext,
  pricedItems: SanralPricedItem[],
): SanralExportResult {
  const workbook = XLSX.read(new Uint8Array(context.workbookData), {
    type: 'array',
    cellStyles: true,
    cellFormula: true,
    cellDates: true,
    bookVBA: true,
  });
  const target = context.targets.find(candidate => candidate.id === context.selectedTargetId);
  if (!target) throw new Error('The confirmed SANRAL pricing target is missing. Please upload the workbook again.');

  let writtenRows = 0;
  let unresolvedRows = 0;
  let preservedExistingRateRows = 0;
  let replacedExistingRateRows = 0;
  let preservedFormulaRows = 0;
  const changedCells: string[] = [];

  pricedItems.forEach(item => {
    const ref = item.sanralCellRef;
    if (!ref || ref.sheetName !== target.sheetName || ref.rateColumn !== target.rateColumn || ref.amountColumn !== target.amountColumn) return;
    const rate = positivePrice(item.finalUnitPrice, item.baseUnitPrice, item.landedUnitPrice, item.unitPrice);
    const amount = positivePrice(item.totalPrice);
    if (rate <= 0 || amount <= 0 || item.pricingRequirement === 'NON_PRICEABLE') {
      if (item.rowType !== 'heading' && item.rowType !== 'subheading' && item.rowType !== 'summary') unresolvedRows += 1;
      return;
    }

    const worksheet = workbook.Sheets[ref.sheetName];
    if (!worksheet) return;
    const rateAddress = XLSX.utils.encode_cell({ r: ref.rowIndex, c: ref.rateColumn });
    const amountAddress = XLSX.utils.encode_cell({ r: ref.rowIndex, c: ref.amountColumn });
    const existingRate = positivePrice((worksheet[rateAddress] as XLSX.CellObject | undefined)?.v);
    if (existingRate > 0 && !context.repriceExistingRates) {
      preservedExistingRateRows += 1;
      return;
    }
    if (existingRate > 0) replacedExistingRateRows += 1;
    setNumericCell(worksheet, rateAddress, rate);
    const amountHadFormula = Boolean((worksheet[amountAddress] as XLSX.CellObject | undefined)?.f);
    setNumericCell(worksheet, amountAddress, amount);
    if (amountHadFormula) preservedFormulaRows += 1;
    changedCells.push(`${ref.sheetName}!${rateAddress}`, `${ref.sheetName}!${amountAddress}`);
    writtenRows += 1;
  });

  const data = XLSX.write(workbook, {
    type: 'array',
    bookType: 'xlsx',
    cellStyles: true,
    compression: true,
  }) as ArrayBuffer;

  return {
    data,
    fileName: context.outputFileName,
    writtenRows,
    unresolvedRows,
    preservedExistingRateRows,
    replacedExistingRateRows,
    preservedFormulaRows,
    changedCells,
  };
}

export function downloadSanralPricedWorkbook(context: SanralNativeWorkbookContext, pricedItems: SanralPricedItem[]): SanralExportResult {
  const result = buildSanralPricedWorkbook(context, pricedItems);
  const blob = new Blob([result.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = result.fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  return result;
}
