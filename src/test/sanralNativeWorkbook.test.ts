import { describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';
import {
  buildSanralPricedWorkbook,
  createSanralWorkbookContext,
  detectSanralTargets,
  parseSanralInputFileName,
  parseSanralItems,
} from '@/utils/sanralNativeWorkbook';

function createFixture(): ArrayBuffer {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['SANRAL PRICING SCHEDULE'],
    [],
    [],
    ['ITEM NO', 'DESCRIPTION', 'UNIT', 'QUANTITY', 'RATE', 'AMOUNT', '', '', '', '', '', '', '', '', '', 'QUANTITY', 'RATE', 'AMOUNT'],
    ['C1.1', 'Excavate in soft material', 'm³', 10, '', '', '', '', '', '', '', '', '', '', '', 10, 750, 7500],
    ['C1.2', 'Concrete 25 MPa', 'm³', 2.5, '', '', '', '', '', '', '', '', '', '', '', 2.5, 2200, 5500],
    ['C2', 'DRAINAGE', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ]);
  worksheet.F5 = { t: 'n', v: 0, f: 'D5*E5', z: 'R#,##0.00' };
  worksheet['!merges'] = [XLSX.utils.decode_range('A1:F1')];
  worksheet['!cols'] = [{ wch: 12 }, { wch: 42 }, { wch: 10 }, { wch: 12 }, { wch: 14 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pricing Schedule');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([['Reference data'], ['Keep unchanged']]), 'Reference');
  const output = XLSX.write(workbook, { type: 'array', bookType: 'xlsx', cellStyles: true }) as ArrayBuffer;
  return output.slice(0);
}

describe('SANRAL Native Workbook processing', () => {
  it('enforces the approved input and output filename convention', () => {
    expect(parseSanralInputFileName('SANRAL_NRA-N001-2026_UNPRICED.xlsx')).toEqual({
      contractNumber: 'NRA-N001-2026',
      outputFileName: 'SANRAL_NRA-N001-2026_QILLY_PRICED.xlsx',
    });
    expect(parseSanralInputFileName('ordinary-boq.xlsx')).toBeNull();
  });

  it('detects each SANRAL quantity, rate and amount group independently', () => {
    const workbook = XLSX.read(createFixture(), { type: 'array', cellFormula: true });
    const targets = detectSanralTargets(workbook);
    expect(targets).toHaveLength(2);
    expect(targets.map(target => [target.quantityColumn, target.rateColumn, target.amountColumn])).toEqual([
      [3, 4, 5],
      [15, 16, 17],
    ]);
  });

  it('writes only the confirmed RATE and AMOUNT pair and preserves workbook structure', () => {
    const context = createSanralWorkbookContext('SANRAL_NRA-N001-2026_UNPRICED.xlsx', createFixture());
    const items = parseSanralItems(context);
    expect(items).toHaveLength(3);

    const result = buildSanralPricedWorkbook(context, [
      { ...items[0], finalUnitPrice: '810.50', totalPrice: '8105.00', pricingRequirement: 'PRICED' },
      { ...items[1], finalUnitPrice: '2400', totalPrice: '6000', pricingRequirement: 'PRICED' },
      { ...items[2], finalUnitPrice: '0', totalPrice: '0', pricingRequirement: 'NON_PRICEABLE' },
    ]);
    const output = XLSX.read(result.data, { type: 'array', cellFormula: true, cellStyles: true });
    const sheet = output.Sheets['Pricing Schedule'];

    expect(result.fileName).toBe('SANRAL_NRA-N001-2026_QILLY_PRICED.xlsx');
    expect(result.writtenRows).toBe(2);
    expect(result.changedCells).toEqual([
      'Pricing Schedule!E5', 'Pricing Schedule!F5',
      'Pricing Schedule!E6', 'Pricing Schedule!F6',
    ]);
    expect(sheet.E5.v).toBe(810.5);
    expect(sheet.F5.f).toBe('D5*E5');
    expect(sheet.F5.v).toBe(8105);
    expect(sheet.E6.v).toBe(2400);
    expect(sheet.F6.v).toBe(6000);
    expect(sheet.Q5.v).toBe(750);
    expect(sheet.R5.v).toBe(7500);
    expect(sheet.B5.v).toBe('Excavate in soft material');
    expect(output.SheetNames).toEqual(['Pricing Schedule', 'Reference']);
    expect(sheet['!merges']).toEqual([XLSX.utils.decode_range('A1:F1')]);
    expect(output.Sheets.Reference.A2.v).toBe('Keep unchanged');
  });

  it('leaves unresolved priceable rows unchanged instead of writing zero', () => {
    const context = createSanralWorkbookContext('SANRAL_NRA-N001-2026_UNPRICED.xlsx', createFixture());
    const items = parseSanralItems(context);
    const result = buildSanralPricedWorkbook(context, [
      { ...items[0], finalUnitPrice: '0', totalPrice: '0', pricingRequirement: 'RATE_INPUT_REQUIRED' },
    ]);
    const output = XLSX.read(result.data, { type: 'array', cellFormula: true });
    expect(result.writtenRows).toBe(0);
    expect(result.unresolvedRows).toBe(1);
    expect(output.Sheets['Pricing Schedule'].E5?.v ?? '').toBe('');
    expect(output.Sheets['Pricing Schedule'].F5.f).toBe('D5*E5');
  });
});
