-- SECURITY REVIEW: development proposal, NOT an executed migration.
-- Verified public.bills has id, user_id, contractor_id and organization_id.
-- Before deployment: decide whether ownership is per-user or contractor organization;
-- current proposal uses user_id only and may exclude legitimate team members.
-- Apply least-privilege grants as well as RLS; existing default grants may be broad.
-- Approval must run via a server-authenticated role check against trusted role storage.
-- Do not trust a client-supplied actorCanApprove flag for any database transition.
-- Approval records and actuals require audit events and immutable correction history.
-- RLS integration tests must prove foreign-contractor SELECT/INSERT/UPDATE/DELETE denial.
-- Review source privileges, policy recursion and indexes before applying.
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
revoke all on public.boq_financial_baselines from anon, authenticated;
grant select, insert on public.boq_financial_baselines to authenticated;
create index if not exists boq_financial_baselines_owner_idx on public.boq_financial_baselines(owner_user_id);
create index if not exists boq_financial_baselines_bill_idx on public.boq_financial_baselines(bill_id);
alter table public.boq_actual_expenditure enable row level security;
revoke all on public.boq_actual_expenditure from anon, authenticated;
grant select, insert on public.boq_actual_expenditure to authenticated;
create index if not exists boq_actual_expenditure_owner_idx on public.boq_actual_expenditure(owner_user_id);
create index if not exists boq_actual_expenditure_baseline_idx on public.boq_actual_expenditure(baseline_id);
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

-- Append-only audit trail. Server-side approval must write this in the SAME
-- transaction as the baseline transition; a two-request sequence is unsafe.
create table if not exists public.boq_financial_approval_audit (
  id uuid primary key default gen_random_uuid(),
  baseline_id uuid not null references public.boq_financial_baselines(id),
  actor_user_id uuid not null references auth.users(id),
  previous_status text not null check (previous_status in ('draft','submitted','approved','rejected')),
  next_status text not null check (next_status in ('submitted','approved','rejected')),
  action_at timestamptz not null default now(),
  reason text,
  check (previous_status <> next_status)
);
create index if not exists boq_financial_approval_audit_baseline_idx
  on public.boq_financial_approval_audit(baseline_id, action_at);
alter table public.boq_financial_approval_audit enable row level security;
revoke all on public.boq_financial_approval_audit from public, anon, authenticated;
-- Deliberately no client policies. Only a trusted, audited backend may write.
-- A transaction must: (1) authenticate the actor; (2) check organization
-- membership and independent approver authority from trusted records;
-- (3) lock baseline FOR UPDATE; (4) check submitted status and unchanged version;
-- (5) update status and attribution; (6) append audit row; (7) COMMIT.
-- Fail closed if any check or audit insert fails. Never use user_metadata as role.
-- A privileged backend must not expose its service-role key to browsers.
