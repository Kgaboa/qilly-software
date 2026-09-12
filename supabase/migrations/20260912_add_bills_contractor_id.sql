-- Persist monthly BOQ usage against the contractor account.
-- Idempotent so it is safe for existing Qilly databases.

alter table public.bills
  add column if not exists contractor_id uuid;

update public.bills b
set contractor_id = c.id
from public.contractors c
where b.contractor_id is null
  and b.user_id = c.user_id;

create index if not exists idx_bills_contractor_created_at
  on public.bills (contractor_id, created_at desc);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bills_contractor_id_fkey'
      and conrelid = 'public.bills'::regclass
  ) then
    alter table public.bills
      add constraint bills_contractor_id_fkey
      foreign key (contractor_id)
      references public.contractors(id)
      on delete set null;
  end if;
end
$$;
