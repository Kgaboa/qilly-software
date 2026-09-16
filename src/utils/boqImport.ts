export type BoqRowType = 'item' | 'heading' | 'subheading' | 'summary';

export interface BoqColumnMap {
  itemNo: number;
  description: number;
  unit: number;
  quantity: number;
  rate: number;
  amount: number;
}

const UNIT_ALIASES = new Set([
  'm', 'm1', 'm2', 'm²', 'sqm', 'm3', 'm³', 'cum', 'km', 'km/m3', 'km/m³',
  'mm', 'cm', 'ha', 'kg', 'g', 't', 'ton', 'tonne', 'l', 'lt', 'ltr', 'litre',
  'no', 'nr', 'ea', 'each', 'item', 'month', 'months', 'day', 'days', 'hour', 'hr',
  '%', 'sum', 'ls', 'l/s', 'lump', 'lumpsum', 'lump sum', 'pc', 'pcsum', 'pc sum',
  'primecostsum', 'prime cost sum', 'provisionalsum', 'provisional sum', 'rateonly',
]);

const cleanUnit = (value: unknown) => String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');

export function isRecognizedBoqUnit(value: unknown): boolean {
  const unit = cleanUnit(value);
  return UNIT_ALIASES.has(unit) || UNIT_ALIASES.has(unit.replace(/\s+/g, ''));
}

export function normalizeBoqQuantity(value: unknown): string {
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : '';

  let text = String(value ?? '').trim();
  if (!text || text.toLowerCase() === 'undefined') return '';
  if (/^rate\s*only$/i.test(text)) return '1';

  text = text.replace(/[R$\s]/g, '').replace(/(km|m³|m3|m²|m2|kg|tonnes?|t|ha|nr|no)$/i, '');

  // Support both 10.4 and South African/European-style 10,4 decimals.
  if (text.includes(',') && text.includes('.')) {
    text = text.replace(/,/g, '');
  } else if (/^-?\d+,\d{1,3}$/.test(text)) {
    text = text.replace(',', '.');
  } else {
    text = text.replace(/,/g, '');
  }

  const quantity = Number(text);
  return Number.isFinite(quantity) ? String(quantity) : '';
}

function outlineDepth(code: string): number {
  const normalized = code.trim().replace(/[.]$/, '');
  return normalized ? normalized.split('.').filter(Boolean).length : 0;
}

export function classifyBoqRow(code: string, description: string, unit: string, quantity: string): BoqRowType {
  const descriptionLower = description.toLowerCase();
  if (descriptionLower.includes('total carried forward to summary') ||
      descriptionLower.includes('total carried to summary') ||
      descriptionLower.includes('carried forward to summary')) {
    return 'summary';
  }

  if (description.trim() && (!isRecognizedBoqUnit(unit) || !quantity)) {
    return outlineDepth(code) >= 3 ? 'subheading' : 'heading';
  }

  return 'item';
}

export function resolveImportedBoqRow(row: unknown[], columns: BoqColumnMap) {
  const cells = row.map(cell => String(cell ?? '').trim());
  const code = columns.itemNo >= 0 ? cells[columns.itemNo] || '' : '';
  const description = columns.description >= 0 ? cells[columns.description] || '' : '';
  let unit = columns.unit >= 0 ? cells[columns.unit] || '' : '';
  let quantity = columns.quantity >= 0 ? normalizeBoqQuantity(cells[columns.quantity]) : '';
  let recoveredColumns = false;

  // Some consultant workbooks use merged or multi-row headers. If the mapped
  // UNIT cell is numeric, locate the actual unit in the row and take the
  // adjacent quantity instead of pricing an amount/rate as the quantity.
  if (!isRecognizedBoqUnit(unit)) {
    const unitIndex = cells.findIndex((cell, index) => index > columns.description && isRecognizedBoqUnit(cell));
    if (unitIndex >= 0) {
      unit = cells[unitIndex];
      const reservedValueColumns = new Set([columns.unit, columns.rate, columns.amount]);
      const nearbyIndexes = [unitIndex + 1, unitIndex - 1].filter(index => !reservedValueColumns.has(index));
      const adjacentQuantity = nearbyIndexes
        .map(index => normalizeBoqQuantity(cells[index]))
        .find(Boolean) || '';
      if (adjacentQuantity) quantity = adjacentQuantity;
      recoveredColumns = true;
    } else {
      unit = '';
      quantity = '';
    }
  }

  const rowType = classifyBoqRow(code, description, unit, quantity);
  return { code, description, unit, quantity, rowType, recoveredColumns };
}
