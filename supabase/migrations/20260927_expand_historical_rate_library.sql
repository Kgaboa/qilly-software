alter table public.historical_boq_rates
  alter column quote_date drop not null,
  add column if not exists quantity numeric(18,4),
  add column if not exists source_amount numeric(18,2),
  add column if not exists validation_notes text;

create index if not exists historical_boq_rates_category_idx
  on public.historical_boq_rates (category, status);

comment on column public.historical_boq_rates.quote_date is
  'Source date when known. Null/older rates remain historical evidence and require review before use.';
comment on column public.historical_boq_rates.validation_notes is
  'Import validation result, including quantity x rate reconciliation evidence.';
