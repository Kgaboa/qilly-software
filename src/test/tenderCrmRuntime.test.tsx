// @vitest-environment jsdom
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const fixture = vi.hoisted(() => ({
  user: null as { id: string } | null,
  tables: [] as string[],
  filters: [] as Array<[string, unknown]>,
}));

vi.mock('@/utils/supabase', () => ({
  supabase: {
    auth: { getUser: async () => ({ data: { user: fixture.user }, error: null }) },
    from: (table: string) => {
      fixture.tables.push(table);
      const query: any = {};
      query.select = () => query;
      query.eq = (field: string, value: unknown) => { fixture.filters.push([field, value]); return query; };
      query.order = () => query;
      query.limit = () => query;
      query.then = (resolve: (value: unknown) => void, reject?: (reason: unknown) => void) =>
        Promise.resolve({ data: [], error: null }).then(resolve, reject);
      return query;
    },
  },
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

import { TenderPipeline } from '../app/components/TenderPipeline';

describe('Tender CRM runtime owner isolation', () => {
  beforeEach(() => {
    fixture.user = null;
    fixture.tables.length = 0;
    fixture.filters.length = 0;
  });

  const renderCrm = () => render(<TenderPipeline onStartPricing={() => {}} onSelectOpportunity={() => {}} selectedOpportunityId={null} />);

  it('does not query tender or supplier lead records for signed-out users', async () => {
    renderCrm();
    expect(await screen.findByText(/Sign in to view your tenders/i)).toBeTruthy();
    expect(fixture.tables).toEqual([]);
  });

  it('scopes both tender and published lead reads to authenticated owner', async () => {
    fixture.user = { id: 'contractor-123' };
    renderCrm();
    await waitFor(() => expect(fixture.tables).toContain('supplier_lead_offers'));
    expect(fixture.tables).toContain('tender_opportunities');
    expect(fixture.filters).toContainEqual(['owner_user_id', 'contractor-123']);
    expect(fixture.filters).toContainEqual(['contractor_user_id', 'contractor-123']);
  });
});
