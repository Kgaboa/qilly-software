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
-- IMPORTANT: no supplier SELECT policy is installed in this foundation migration.
-- Supplier-facing access must remain denied until both:
--  (1) the supplier RLS ownership rules and approval timestamps are verified, and
--  (2) a trusted, independently verified paid supplier-lead entitlement is defined.
-- The existing subscriptions table also holds contractor plans and must NOT be used
-- indiscriminately to grant supplier access.
-- A follow-up migration will enable an explicit supplier read policy after UAT tests.
