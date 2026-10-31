-- Qilly six-month supplier lead campaign: safe entitlement foundation.
-- No existing supplier subscription, payment, or paid entitlement is modified.
-- Activation must be configured by an authorized operator before lead distribution is enabled.
create table if not exists public.supplier_lead_campaign_config (
  id boolean primary key default true check (id = true),
  activation_at timestamptz,
  duration_months integer not null default 6 check (duration_months = 6),
  updated_at timestamptz not null default now()
);
alter table public.supplier_lead_campaign_config enable row level security;
revoke all on public.supplier_lead_campaign_config from anon, authenticated;
insert into public.supplier_lead_campaign_config(id,activation_at)
values (true,null) on conflict (id) do nothing;

-- A supplier's own free campaign window is visible only to their authenticated owner.
-- This view is read-only, and inherits the underlying supplier RLS with security_invoker.
create or replace view public.supplier_lead_campaign_status
with (security_invoker = true) as
select s.id as supplier_id, s.user_id, s.status,
       greatest(coalesce(s.approved_at, s.created_at), c.activation_at) as free_starts_at,
       (greatest(coalesce(s.approved_at, s.created_at), c.activation_at) + interval '6 months') as free_expires_at,
       (s.status = 'approved' and c.activation_at is not null
        and s.approved_at is not null
        and now() >= greatest(s.approved_at, c.activation_at)
        and now() < greatest(s.approved_at, c.activation_at) + interval '6 months') as free_lead_access
from public.suppliers s cross join public.supplier_lead_campaign_config c
where s.user_id = (select auth.uid());
revoke all on public.supplier_lead_campaign_status from anon, authenticated;
-- Do not grant browser access until supplier RLS and approval timestamp semantics are verified.
-- CRM opportunity records are contractor-private and must never be exposed by this view.
