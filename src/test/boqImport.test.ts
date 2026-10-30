import * as fs from 'node:fs';
import * as path from 'node:path';
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

  it('keeps a row with numeric pricing evidence priceable without using the number as a unit', () => {
    const row = ['C20.1', 'Testing materials and judgement of workmanship', '11843040', '11843040'];
    const resolved = resolveImportedBoqRow(row, {
      itemNo: 0, description: 1, unit: 2, quantity: 3, rate: -1, amount: -1,
    });

    expect(resolved.rowType).toBe('item');
    expect(resolved.unit).toBe('item');
    expect(resolved.quantity).toBe('1');
    expect(resolved.recoveredColumns).toBe(true);
  });

  it('recognises common labour and plant units', () => {
    expect(classifyBoqRow('C1.5.7.3', 'Flagmen', 'man-day', '704')).toBe('item');
    expect(classifyBoqRow('C1.5.7.4', 'Labourer', 'person-day', '20')).toBe('item');
    expect(classifyBoqRow('C1.5.7.5', 'Roller operator', 'man-shift', '5')).toBe('item');
  });
});

describe('Flexible BOQ customer import integration contracts', () => {
  const root = path.resolve(__dirname, '../..');
  const ui = fs.readFileSync(path.join(root, 'src/app/components/FlexibleBoqImport.tsx'), 'utf8');
  const api = fs.readFileSync(path.join(root, 'api/parse-tender.ts'), 'utf8');
  const build = fs.readFileSync(path.join(root, 'scripts/build-extraction.mjs'), 'utf8');

  it('routes PDF and DOCX through the authenticated server endpoint', () => {
    expect(ui).toContain("fetch('/api/parse-tender'");
    expect(ui).toContain("supabase.auth.getUser()");
    expect(ui).toContain("'x-qilly-file-type':type");
    expect(api).toContain('client.auth.getUser(token)');
  });

  it('does not offer unsupported legacy DOC uploads', () => {
    expect(ui).toContain('.pdf,.docx');
    expect(ui).not.toMatch(/accept="[^"]*\.doc,/);
  });

  it('enforces a server-side file limit and supported document types', () => {
    expect(api).toContain("['pdf','docx'].includes(type)");
    expect(api).toContain('15*1024*1024');
    expect(api).toContain("res.setHeader('Cache-Control','no-store')");
  });

  it('bundles both server parsers for deployment', () => {
    expect(build).toContain("['pdf-server', 'docx-server']");
  });

  it('does not silently persist or price a preview', () => {
    expect(ui).toContain('Approve interpreted BOQ (preview only)');
    expect(ui).toContain('Pricing and saving remain unavailable');
  });
});
