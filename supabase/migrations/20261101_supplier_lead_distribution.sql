-- Supplier lead distribution: opt-in publishing only, never exposes private tender_opportunities.
-- Apply to controlled UAT after reviewing supplier RLS and approval timestamps.
create table if not exists public.supplier_lead_offers (
 id uuid primary key default gen_random_uuid(),
 contractor_user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(length(trim(title)) between 3 and 180),
 category text not null check(length(trim(category)) between 2 and 120),
 province text,
 summary text not null check(length(trim(summary)) between 10 and 2000),
 closes_at timestamptz,
 published_at timestamptz not null default now(),
 status text not null default 'open' check(status in ('open','closed')),
 created_at timestamptz not null default now()
);
create index if not exists supplier_lead_offers_owner_idx on public.supplier_lead_offers(contractor_user_id);
alter table public.supplier_lead_offers enable row level security;
revoke all on public.supplier_lead_offers from anon, authenticated;
grant select,insert,update on public.supplier_lead_offers to authenticated;
drop policy if exists supplier_lead_offers_contractor_read on public.supplier_lead_offers;
create policy supplier_lead_offers_contractor_read on public.supplier_lead_offers
 for select to authenticated using(contractor_user_id=(select auth.uid()));
drop policy if exists supplier_lead_offers_contractor_insert on public.supplier_lead_offers;
create policy supplier_lead_offers_contractor_insert on public.supplier_lead_offers
 for insert to authenticated with check(contractor_user_id=(select auth.uid()));
drop policy if exists supplier_lead_offers_contractor_update on public.supplier_lead_offers;
create policy supplier_lead_offers_contractor_update on public.supplier_lead_offers
 for update to authenticated using(contractor_user_id=(select auth.uid()))
 with check(contractor_user_id=(select auth.uid()));

-- Suppliers may see only intentionally published, open offers while their campaign is active.
-- No customer name, tender attachments, BOQ prices or contractor-private CRM fields are included.
drop policy if exists supplier_lead_offers_supplier_read on public.supplier_lead_offers;
create policy supplier_lead_offers_supplier_read on public.supplier_lead_offers
 for select to authenticated using (
 status='open' and (closes_at is null or closes_at>now())
 and exists (
  select 1 from public.suppliers s
  cross join public.supplier_lead_campaign_config c
  where s.user_id=(select auth.uid())
    and s.status='approved' and s.approved_at is not null
    and c.activation_at is not null
    and now()>=greatest(s.approved_at,c.activation_at)
    and now()<greatest(s.approved_at,c.activation_at)+interval '6 months'
    and (province is null or s.province=province)
    and category=any(s.product_categories)
 )
);
-- Note: paid entitlement access must be added as a separate verified server-side rule
-- before this policy is enabled for paying suppliers. No automatic subscription changes.
