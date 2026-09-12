-- Monthly BOQ add-on allowance for paid contractor top-ups.
-- Allowance is scoped to boq_topup_month and does not carry into a new month.

alter table public.contractors
  add column if not exists boq_topup_allowance integer not null default 0,
  add column if not exists boq_topup_month date;

alter table public.contractors
  drop constraint if exists contractors_boq_topup_allowance_nonnegative;

alter table public.contractors
  add constraint contractors_boq_topup_allowance_nonnegative
  check (boq_topup_allowance >= 0);

notify pgrst, 'reload schema';
