-- Sprint 02 proposed schema. REVIEW BEFORE APPLYING. Not executed against UAT or production.
-- Ownership follows public.bills.user_id; no cross-tenant reads or writes.
create table if not exists public.boq_financial_baselines (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  owner_user_id uuid not null references auth.users(id),
  version integer not null check (version > 0),
  status text not null default 'draft' check (status in ('draft','submitted','approved','rejected')),
  duration_months integer not null check (duration_months between 1 and 36),
  monthly_plan jsonb not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  unique(bill_id, version),
  check (status <> 'approved' or (approved_by is not null and approved_at is not null))
);
create table if not exists public.boq_actual_expenditure (
  id uuid primary key default gen_random_uuid(),
  baseline_id uuid not null references public.boq_financial_baselines(id) on delete cascade,
  owner_user_id uuid not null references auth.users(id),
  month integer not null check (month between 1 and 36),
  amount numeric(18,2) not null check (amount >= 0),
  recorded_by uuid not null references auth.users(id),
  recorded_at timestamptz not null default now(),
  unique(baseline_id, month)
);
alter table public.boq_financial_baselines enable row level security;
alter table public.boq_actual_expenditure enable row level security;
create policy "Owner reads financial baselines" on public.boq_financial_baselines for select to authenticated
  using (owner_user_id = (select auth.uid()) and exists
    (select 1 from public.bills b where b.id = bill_id and b.user_id = (select auth.uid())));
create policy "Owner creates draft financial baselines" on public.boq_financial_baselines for insert to authenticated
  with check (owner_user_id = (select auth.uid()) and created_by = (select auth.uid())
    and status = 'draft' and approved_by is null and approved_at is null and exists
    (select 1 from public.bills b where b.id = bill_id and b.user_id = (select auth.uid())));
-- No direct baseline UPDATE/DELETE policies. A reviewed baseline must be immutable;
-- approval must be implemented through a separately audited, authorized server workflow.
create policy "Owner reads actual expenditure" on public.boq_actual_expenditure for select to authenticated
  using (owner_user_id = (select auth.uid()) and exists
    (select 1 from public.boq_financial_baselines f where f.id = baseline_id and f.owner_user_id = (select auth.uid())));
create policy "Owner inserts actual expenditure" on public.boq_actual_expenditure for insert to authenticated
  with check (owner_user_id = (select auth.uid()) and recorded_by = (select auth.uid())
    and exists (select 1 from public.boq_financial_baselines f
      where f.id = baseline_id and f.owner_user_id = (select auth.uid()) and f.status = 'approved'
        and month <= f.duration_months));
-- No UPDATE/DELETE policies: corrections require a separately audited workflow.
-- NOTE: column-level privilege and immutable-row controls still require security review.
