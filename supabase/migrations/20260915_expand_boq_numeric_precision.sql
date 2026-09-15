-- Large construction BOQs can exceed numeric(12,2), whose maximum is
-- R9,999,999,999.99. Keep cents while allowing enterprise-scale totals.
alter table public.bills
  alter column total_cost type numeric(18,2)
  using total_cost::numeric(18,2);

alter table public.bill_items
  alter column quantity type numeric(18,3)
    using quantity::numeric(18,3),
  alter column unit_price type numeric(18,2)
    using unit_price::numeric(18,2),
  alter column total_price type numeric(18,2)
    using total_price::numeric(18,2);
