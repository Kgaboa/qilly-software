// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

const fixture = vi.hoisted(() => ({
  user: { id: 'supplier-user' } as { id: string } | null,
  supplier: { id: 'supplier-1', status: 'approved', product_categories: ['Building Materials'], province: 'Free State', operating_provinces: [] } as any,
  leads: [] as any[],
  responses: [] as any[],
  error: null as any,
  calls: [] as string[],
}));

vi.mock('@/utils/supabase', () => ({
  supabase: {
    auth: { getUser: async () => ({ data: { user: fixture.user }, error: null }) },
    from: (table: string) => {
      fixture.calls.push(table);
      const query: any = {};
      query.select = () => query;
      query.eq = () => query;
      query.order = () => query;
      query.limit = () => query;
      query.maybeSingle = async () => ({ data: fixture.supplier, error: null });
      query.then = (resolve: (v: any) => void, reject?: (e: any) => void) =>
        Promise.resolve({ data: table === 'supplier_lead_offers' ? fixture.leads : fixture.responses, error: fixture.error }).then(resolve, reject);
      return query;
    },
  },
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
import { SupplierLeads } from './SupplierLeads';

describe('SupplierLeads UI authorization boundaries', () => {
  beforeEach(() => {
    fixture.user = { id: 'supplier-user' };
    fixture.supplier = { id: 'supplier-1', status: 'approved', product_categories: ['Building Materials'], province: 'Free State', operating_provinces: [] };
    fixture.leads = [];
    fixture.responses = [];
    fixture.error = null;
    fixture.calls.length = 0;
  });

  it('does not request lead records for a pending supplier', async () => {
    fixture.supplier.status = 'pending';
    render(<SupplierLeads />);
    expect(await screen.findByText(/profile has not yet been approved/i)).toBeTruthy();
    expect(fixture.calls).not.toContain('supplier_lead_offers');
  });

  it('shows registered criteria when RLS returns no eligible leads', async () => {
    render(<SupplierLeads />);
    expect(await screen.findByText(/No eligible supplier leads are available/i)).toBeTruthy();
    expect(screen.getByText(/Your registered categories: Building Materials/)).toBeTruthy();
    expect(screen.getByText(/Operating provinces: Free State/)).toBeTruthy();
  });

  it('renders a published lead returned by the authorized database query', async () => {
    fixture.leads = [{ id: 'lead-1', title: 'Cement tender', category: 'Building Materials', province: 'Free State', summary: 'Synthetic fixture', closes_at: null, published_at: '2026-10-31T00:00:00Z' }];
    render(<SupplierLeads />);
    expect(await screen.findByText('Cement tender')).toBeTruthy();
    expect(screen.getByText('Respond to lead')).toBeTruthy();
  });

  it('does not fetch leads for signed-out users', async () => {
    fixture.user = null;
    render(<SupplierLeads />);
    expect(await screen.findByText(/supplier session is not active/i)).toBeTruthy();
    expect(fixture.calls).not.toContain('supplier_lead_offers');
  });

  it('shows a safe error instead of silently reporting no matches on query failure', async () => {
    fixture.error = { message: 'Permission denied' };
    render(<SupplierLeads />);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/Lead feed is not yet available/i));
  });
});
