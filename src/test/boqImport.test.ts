import { describe, expect, it } from 'vitest';
import { classifyBoqRow, normalizeBoqQuantity, resolveImportedBoqRow } from '@/utils/boqImport';

describe('BOQ import rules', () => {
  it('preserves dot and comma decimal quantities', () => {
    expect(normalizeBoqQuantity('10.4 km')).toBe('10.4');
    expect(normalizeBoqQuantity('10,4')).toBe('10.4');
    expect(normalizeBoqQuantity(10.4)).toBe('10.4');
  });

  it('recognises headings and subheadings from outline codes', () => {
    expect(classifyBoqRow('1.7', 'Heading', '', '')).toBe('heading');
    expect(classifyBoqRow('1.7.1', 'Sub Heading', '', '')).toBe('subheading');
    expect(classifyBoqRow('1.7.2', 'Sub Heading 2', '', '')).toBe('subheading');
  });

  it('recovers the unit and decimal quantity when merged headers shift columns', () => {
    const row = ['C11.9', 'Finishing the road', '10.4', 'km', '92560', '1436347.7'];
    const resolved = resolveImportedBoqRow(row, {
      itemNo: 0, description: 1, unit: 4, quantity: 5, rate: -1, amount: -1,
    });

    expect(resolved.unit).toBe('km');
    expect(resolved.quantity).toBe('10.4');
    expect(resolved.recoveredColumns).toBe(true);
  });

  it('does not price a numeric cell as a unit', () => {
    const row = ['C20.1', 'Testing materials and judgement of workmanship', '11843040', '11843040'];
    const resolved = resolveImportedBoqRow(row, {
      itemNo: 0, description: 1, unit: 2, quantity: 3, rate: -1, amount: -1,
    });

    expect(resolved.rowType).toBe('heading');
    expect(resolved.unit).toBe('');
    expect(resolved.quantity).toBe('');
  });
});
