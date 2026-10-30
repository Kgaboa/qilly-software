-- P0-C: CRM tender opportunities; owner-scoped until team authorisation is designed.
create table if not exists public.tender_opportunities (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null check (length(trim(customer_name)) > 0),
  tender_title text not null check (length(trim(tender_title)) > 0),
  tender_reference text,
  stage text not null default 'Lead' check (stage in ('Lead','Qualified','BOQ Pricing','Submitted','Won','Lost')),
  due_date date,
  notes text,
  linked_bill_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tender_opportunities_owner_idx on public.tender_opportunities(owner_user_id, created_at desc);
alter table public.tender_opportunities enable row level security;
revoke all on public.tender_opportunities from anon;
grant select, insert, update, delete on public.tender_opportunities to authenticated;
drop policy if exists tender_opportunities_owner_select on public.tender_opportunities;
create policy tender_opportunities_owner_select on public.tender_opportunities for select to authenticated using (owner_user_id = (select auth.uid()));
drop policy if exists tender_opportunities_owner_insert on public.tender_opportunities;
create policy tender_opportunities_owner_insert on public.tender_opportunities for insert to authenticated with check (owner_user_id = (select auth.uid()));
drop policy if exists tender_opportunities_owner_update on public.tender_opportunities;
create policy tender_opportunities_owner_update on public.tender_opportunities for update to authenticated using (owner_user_id = (select auth.uid())) with check (owner_user_id = (select auth.uid()));
drop policy if exists tender_opportunities_owner_delete on public.tender_opportunities;
create policy tender_opportunities_owner_delete on public.tender_opportunities for delete to authenticated using (owner_user_id = (select auth.uid()));
