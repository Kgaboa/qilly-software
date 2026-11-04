import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const crm = readFileSync(resolve(process.cwd(), 'src/app/components/TenderPipeline.tsx'), 'utf8');

describe('Tender CRM owner access regression', () => {
  it('restricts tender reads to authenticated owners', () => {
    expect(crm).toContain(".eq('owner_user_id', user.id)");
    expect(crm).toContain("if (!user) { setRows([])");
  });

  it('requires an authenticated owner when updating tender stage', () => {
    expect(crm).toMatch(/update\(\{ stage \}\)[\s\S]*?\.eq\('owner_user_id', user\.id\)/);
    expect(crm).toContain("if (!updated?.length)");
  });

  it('scopes published leads to the contractor account', () => {
    expect(crm).toContain(".eq('contractor_user_id', user.id)");
  });

  it('guards supplier response reads with the owned lead list', () => {
    expect(crm).toContain("publishedLeads.some(lead => lead.id === leadId)");
  });
});
