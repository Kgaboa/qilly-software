-- Applied to Qilly-dev controlled UAT as part of supplier_leads_foundation_paid_entitlements_20261031.
-- Paid entitlements are separate from contractor subscriptions; only trusted backend operators
-- may populate them after payment/contract verification. Never grant client write access.
create table if not exists public.supplier_lead_paid_entitlements (
 supplier_id uuid primary key references public.suppliers(id) on delete cascade,
 valid_until timestamptz not null,
 source_reference text not null check(length(trim(source_reference)) > 0),
 verified_at timestamptz not null default now()
);
alter table public.supplier_lead_paid_entitlements enable row level security;
revoke all on public.supplier_lead_paid_entitlements from anon, authenticated;
-- Existing subscriptions and suppliers are never updated by this migration.
-- Supplier read policy on supplier_lead_offers remains disabled pending cross-tenant
-- access tests and verified entitlement provisioning.
