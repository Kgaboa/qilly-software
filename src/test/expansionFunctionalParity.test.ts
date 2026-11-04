import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dashboard = readFileSync(resolve(process.cwd(), 'src/app/components/MainDashboard.tsx'), 'utf8');
const history = readFileSync(resolve(process.cwd(), 'src/app/components/BillHistory.tsx'), 'utf8');

describe('Qilly expansion functional parity: preserve legacy entry points', () => {
  const entries = [
    ['BOQ upload and pricing', '<BillUpload'],
    ['flexible tender/BOQ import', '<FlexibleBoqImport'],
    ['priced BOQ history', '<BillHistory'],
    ['priced BOQ details', '<RegionalPricedBillView'],
    ['tender CRM', '<TenderPipeline'],
    ['supplier leads', '<SupplierLeads'],
  ] as const;

  for (const [label, component] of entries) {
    it('retains ' + label + ' in the dashboard', () => {
      expect(dashboard).toContain(component);
    });
  }

  it('preserves access gating on flexible BOQ import', () => {
    expect(dashboard).toMatch(/currentView === 'flexible-import' && canUploadBOQ/);
  });

  it('retains existing BOQ upload eligibility checks', () => {
    expect(dashboard).toContain('quotaExceeded');
    expect(dashboard).toContain('canProcess=');
  });

  it('connects programme and cashflow through existing BOQ history', () => {
    expect(dashboard).toContain('planningMode={planningDestination}');
    expect(history).toContain('<ProgrammeCashflow');
  });
});
