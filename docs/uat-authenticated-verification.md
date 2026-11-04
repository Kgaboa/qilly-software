# Qilly protected UAT verification

## Scope
UAT only. Never disable Vercel Deployment Protection, expose credentials, or use production customer data for testing.

## 1. Build and regression gate
Run `npm ci && npm test && npm run build`. The Vercel build already runs tests, but a READY deployment alone does not prove authenticated user journeys.

## 2. Authenticated HTTP smoke test
On a machine with Vercel CLI installed and an authorized Vercel login, link to the **Qilly UAT project** and verify identity:

```sh
vc whoami
vc link
vc curl https://<protected-uat-deployment-host>/
```

Replace the placeholder with the actual UAT deployment URL. The authenticated `vc curl` request should return Qilly's application HTML rather than a Vercel login page. Do not use the production deployment or infer application authentication from HTTP 200.

## 3. Authenticated protected HTTP smoke
Run the repository's Node.js HTTP smoke script with a short-lived development OIDC token from the linked Vercel project:

```sh
vc env run -- sh -c 'test -n "$VERCEL_OIDC_TOKEN" && node scripts/uat-vercel-smoke.mjs "$1"' sh https://<protected-uat-deployment-host>
```

The HTTP script attaches `x-vercel-trusted-oidc-idp-token` **only to the protected UAT origin**, and never prints the token. A local development token normally works for same-project Preview deployments. If Vercel reports `TRUSTED_SOURCES_ENVIRONMENT_MISMATCH`, stop and review the project's Trusted Sources rules instead of disabling protection.

## 4. Browser regression (separate gate)
Use a Playwright or equivalent browser runner that supports origin-scoped extra HTTP headers. It must attach the same short-lived OIDC token only to the UAT origin. The HTTP smoke script above is **not** a browser test and does not verify Qilly sign-in or interactive features.

## 5. Qilly functional checks
After Vercel protection is passed, authenticate using a dedicated Qilly UAT test account. Verify: valid unpriced BOQ can be approved for preview after review; incomplete extraction stays blocked with clear reasons; Programme of Works permits valid predecessors and blocks overlapping or invalid predecessors; S-Curve reflects eligible priced BOQ allocations. Use synthetic BOQs and verify tenant isolation.

## Release rule
Build + unit tests + authenticated browser functional checks must pass before a release is promoted. Preserve screenshots/test evidence without access tokens, credentials, or customer BOQ data.
