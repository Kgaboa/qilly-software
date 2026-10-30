-- Gate 07 / P0-S003: read-only RLS reconciliation. Run with a database administrator.
-- This script intentionally makes NO changes to permissions, data or policies.
SELECT t.tablename, t.rowsecurity AS rls_enabled,
       COUNT(p.policyname) AS policy_count
FROM pg_tables AS t
LEFT JOIN pg_policies AS p ON p.schemaname=t.schemaname AND p.tablename=t.tablename
WHERE t.schemaname='public'
  AND t.tablename IN ('users','contractors','suppliers','subscriptions','supplier_products','consent_audit_log','bills','bill_items','tender_opportunities')
GROUP BY t.tablename,t.rowsecurity ORDER BY t.tablename;

SELECT tablename,policyname,cmd,roles,qual,with_check
FROM pg_policies WHERE schemaname='public'
AND tablename IN ('users','contractors','suppliers','subscriptions','supplier_products','consent_audit_log','bills','bill_items','tender_opportunities')
ORDER BY tablename,policyname;

SELECT table_name,grantee,privilege_type FROM information_schema.role_table_grants
WHERE table_schema='public' AND grantee IN ('anon','authenticated')
AND table_name IN ('users','contractors','suppliers','subscriptions','supplier_products','consent_audit_log')
ORDER BY table_name,grantee,privilege_type;

SELECT count(*) AS total_contractors,
       count(*) FILTER (WHERE user_id IS NULL) AS contractors_missing_owner,
       count(DISTINCT user_id) AS distinct_owners
FROM public.contractors;

-- Before RLS rollout: ensure role assignment and commercial field updates are server-authorized.
-- Do not run legacy scripts that disable RLS or trust email allowlists as administrator authorization.
