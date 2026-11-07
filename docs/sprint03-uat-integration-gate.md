# Sprint 03 → controlled UAT integration checklist

Target: `uat-controlled-matching` (production excluded)
Source: `feature/qilly-expansion-sprint-03`
Staging: `integration/sprint03-uat`
Source PR: #14 (draft, currently unmergeable)

## Conflict-sensitive modules
- `BillHistory.tsx`: preserve UAT BOQ navigation, original BOQ protection and quota countdown; integrate Sprint 03 Allowables scenario controls.
- `AllowablesWorkspace.tsx`: preserve UAT profitability/export behavior; add Save/Load/Submit and reviewer assignment without losing original BOQ protection.
- `TenderPipeline.tsx`: preserve CRM and supplier lead flows; add repricing reviews, tender risks and Bid/No-Bid assessment.
- `ProgrammeCashflow.tsx`: retain existing UAT BOQ-driven scheduling, cash flow and S-curve logic.
- `MainDashboard.tsx`, `BillUpload.tsx`, regression tests and workflows: reconcile rather than blindly replace.

## Mandatory gates before merge
1. Resolve conflicts against the UAT baseline on the staging branch.
2. Verify Vercel build and GitHub Actions regression (including BOQ quota, original BOQ protection, repricing, risk and bid tests).
3. Confirm controlled UAT Supabase schema/migrations for repricing scenarios, reviewers, audit, tender risks and bid assessments; never assume Qilly-dev migrations are present in UAT.
4. Authenticate BOQ owner, assigned reviewer and unrelated contractor. Verify self-approval and cross-tenant access are denied.
5. Validate Save → Load → Submit → Approve/Reject, Risk Register → Bid Decision → Save/Reload history.
6. Confirm repricing and risk assessments consume no additional BOQ credits.
7. Merge into controlled UAT only after checks pass. Do not deploy to production.

Current state: staging branch created from UAT; integration not merged or released.
