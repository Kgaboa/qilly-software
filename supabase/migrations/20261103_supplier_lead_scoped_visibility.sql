-- Applied to Qilly-dev controlled UAT: scoped supplier visibility.
-- Private helper reads supplier records only for the authenticated user's own supplier ID.
-- No existing subscription or billing record is changed.
create schema if not exists qilly_private;
revoke all on schema qilly_private from public, anon;
grant usage on schema qilly_private to authenticated;
create or replace function qilly_private.supplier_can_view_lead(p_category text,p_province text)
returns boolean language sql stable security definer
set search_path = '' as $$
 select (select auth.uid()) is not null and exists (
  select 1 from public.suppliers s
  cross join public.supplier_lead_campaign_config c
  left join public.supplier_lead_paid_entitlements pe on pe.supplier_id=s.id
  where s.user_id=(select auth.uid())
    and s.status='approved' and s.approved_at is not null
    and p_category=any(s.product_categories)
    and (p_province is null or p_province=s.province or p_province=any(s.operating_provinces))
    and (
      (c.activation_at is not null and now()>=greatest(s.approved_at,c.activation_at)
       and now()<greatest(s.approved_at,c.activation_at)+interval '6 months')
      or (pe.valid_until>now())
    )
 )
$$;
revoke all on function qilly_private.supplier_can_view_lead(text,text) from public,anon;
grant execute on function qilly_private.supplier_can_view_lead(text,text) to authenticated;
create policy supplier_lead_offers_supplier_read on public.supplier_lead_offers
 for select to authenticated using (
 status='open' and (closes_at is null or closes_at>now())
 and qilly_private.supplier_can_view_lead(category,province)
);
-- Campaign activation remains NULL until explicitly approved.
-- Paid entitlement rows must be populated only after independent verification.
