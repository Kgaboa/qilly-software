-- Formal provenance and review controls for the Qilly-owned BOQ rate library.
-- Existing monetary values are intentionally not changed by this migration.

alter table public.boq_rates
  add column if not exists source_type text,
  add column if not exists source_date date,
  add column if not exists valid_until date,
  add column if not exists usage_rights_status text,
  add column if not exists review_status text,
  add column if not exists commercial_basis text,
  add column if not exists province_basis text,
  add column if not exists evidence_reference text,
  add column if not exists description_normalized text,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

update public.boq_rates
set
  source_type = case
    when lower(coalesce(source, '')) like '%buildaid%' then 'buildaid-benchmark'
    when lower(coalesce(source, '')) like '%supplier%'
      or lower(coalesce(source, '')) like '%quotation%' then 'supplier-product'
    when lower(coalesce(source, '')) like '%qilly%' then 'qilly-own-library'
    else 'unknown'
  end,
  usage_rights_status = case
    when lower(coalesce(source, '')) like '%buildaid%' then 'benchmark-reference-only'
    when lower(coalesce(source, '')) like '%qilly%' then 'internal-approved'
    else 'unknown'
  end,
  review_status = case
    when lower(coalesce(source, '')) like '%qilly%' then 'reviewed'
    else 'review-required'
  end,
  commercial_basis = coalesce(
    nullif(commercial_basis, ''),
    case
      when material_rate is not null and material_rate > 0
        then 'Imported component build-up: labour, equipment and material'
      else 'Imported component build-up: labour and equipment'
    end
  ),
  province_basis = coalesce(nullif(province_basis, ''), coalesce(nullif(province_code, ''), 'ALL')),
  evidence_reference = coalesce(
    nullif(evidence_reference, ''),
    concat_ws(' | ', nullif(source, ''), nullif(code, ''), nullif(page_reference, ''))
  ),
  description_normalized = lower(regexp_replace(trim(description), '[^[:alnum:]%]+', ' ', 'g')),
  metadata = coalesce(metadata, '{}'::jsonb)
where
  source_type is null
  or usage_rights_status is null
  or review_status is null
  or commercial_basis is null
  or province_basis is null
  or evidence_reference is null
  or description_normalized is null;

alter table public.boq_rates
  alter column source_type set default 'unknown',
  alter column source_type set not null,
  alter column usage_rights_status set default 'unknown',
  alter column usage_rights_status set not null,
  alter column review_status set default 'review-required',
  alter column review_status set not null,
  alter column description_normalized set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'boq_rates_source_type_check'
      and conrelid = 'public.boq_rates'::regclass
  ) then
    alter table public.boq_rates add constraint boq_rates_source_type_check
      check (source_type in ('qilly-own-library', 'buildaid-benchmark', 'supplier-product', 'historical-boq', 'unknown'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'boq_rates_usage_rights_status_check'
      and conrelid = 'public.boq_rates'::regclass
  ) then
    alter table public.boq_rates add constraint boq_rates_usage_rights_status_check
      check (usage_rights_status in ('internal-approved', 'licensed', 'benchmark-reference-only', 'restricted', 'unknown'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'boq_rates_review_status_check'
      and conrelid = 'public.boq_rates'::regclass
  ) then
    alter table public.boq_rates add constraint boq_rates_review_status_check
      check (review_status in ('reviewed', 'review-required', 'rejected'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'boq_rates_validity_period_check'
      and conrelid = 'public.boq_rates'::regclass
  ) then
    alter table public.boq_rates add constraint boq_rates_validity_period_check
      check (valid_until is null or source_date is null or valid_until >= source_date);
  end if;
end $$;

create index if not exists idx_boq_rates_provenance
  on public.boq_rates (source_type, review_status, usage_rights_status);

create index if not exists idx_boq_rates_matching
  on public.boq_rates (unit, category, review_status)
  where composite_rate > 0;

alter table public.boq_rates enable row level security;

drop policy if exists "Authenticated users can read approved BOQ rates" on public.boq_rates;
create policy "Authenticated users can read approved BOQ rates"
  on public.boq_rates
  for select
  to authenticated
  using (
    review_status <> 'rejected'
    and usage_rights_status in ('internal-approved', 'licensed', 'benchmark-reference-only')
  );

comment on table public.boq_rates is
  'Qilly BOQ source-rate library with explicit provenance, usage-rights and review controls.';
comment on column public.boq_rates.source_type is
  'Owned, licensed or benchmark source classification used by the BOQ matching strategy.';
comment on column public.boq_rates.usage_rights_status is
  'Controls whether a rate may be used internally, as a licensed source, or only as a benchmark.';
comment on column public.boq_rates.review_status is
  'Rate-governance status. Rejected rates are excluded from authenticated reads.';
comment on column public.boq_rates.evidence_reference is
  'Traceable source, record code and page reference where available.';
