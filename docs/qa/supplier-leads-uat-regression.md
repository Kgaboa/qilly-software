# Supplier Leads — controlled UAT regression matrix

Scope: `uat-controlled-matching` branch and isolated Qilly test accounts only. Do not use production or modify real supplier payments, campaign activation dates, or subscriptions.

## Existing authorization contract

`qilly_private.supplier_can_view_lead(category, province)` requires an authenticated approved supplier with an approval timestamp, a matching `product_categories` entry, and matching `province` or `operating_provinces`. Lead access additionally requires either the configured six-month campaign window or an unexpired paid entitlement. `supplier_lead_offers` SELECT also requires an open, unexpired opportunity.

## Test fixtures (synthetic accounts only)

- Contractor C1 publishes an open lead in category `Building Materials`, province `Free State`, with a future closing date.
- Supplier S1: approved, same category/province; no entitlement, campaign inactive.
- Supplier S2: approved, same category/province; verified UAT-only entitlement valid into future.
- Supplier S3: approved, different category/province; UAT-only entitlement.
- Supplier S4: pending, same category/province; UAT-only entitlement.
- Contractor C2: unrelated tenant.

## Acceptance checks

| ID | Actor | Scenario | Expected |
|---|---|---|---|
| SL-01 | S1 | Matching lead, campaign inactive, no entitlement | Lead hidden |
| SL-02 | S2 | Matching lead, valid entitlement | Lead visible |
| SL-03 | S3 | Mismatched category or province | Lead hidden |
| SL-04 | S4 | Pending supplier | Lead hidden |
| SL-05 | S2 | Respond to eligible lead | One response created |
| SL-06 | S2 | Submit duplicate response | Rejected by unique constraint |
| SL-07 | C1 | View responses to own lead | S2 response visible |
| SL-08 | C2 | View C1 lead and responses | Access denied |
| SL-09 | S3 | Submit response to hidden lead by known UUID | Access denied by RLS |
| SL-10 | S2 | Expired entitlement, campaign inactive | Lead hidden |
| SL-11 | S2 | Lead closed or expired | Lead hidden |
| SL-12 | Anonymous | Read leads or responses | Access denied |

## Execution safeguards

1. Use dedicated synthetic auth users and fixtures in an isolated test database or a reversible, clearly labelled UAT test setup.
2. Do not impersonate users via privileged SQL and treat that as a substitute for real authenticated session tests.
3. Record evidence: authenticated role, visible lead IDs, RLS results, response ownership and duplicate prevention.
4. Remove synthetic fixtures after the run; preserve existing contractor/supplier records.
5. Run TypeScript build and browser checks before any controlled UAT deployment. Production is out of scope.

Status: test specification committed; execution pending test environment and fixtures.
