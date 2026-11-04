// Protected UAT smoke check. Uses only short-lived Vercel development OIDC credentials.
// Run with: vc env run -- node scripts/uat-vercel-smoke.mjs https://<preview-host>
const target = process.argv[2];
const token = process.env.VERCEL_OIDC_TOKEN;
if (!target || !token) {
  console.error('A UAT preview URL and VERCEL_OIDC_TOKEN from vc env run are required.');
  process.exit(2);
}
const url = new URL(target);
if (url.protocol !== 'https:' || !url.hostname.endsWith('.vercel.app')) {
  console.error('Only HTTPS Vercel preview hosts are supported.');
  process.exit(2);
}
const response = await fetch(url, {
  headers: { 'x-vercel-trusted-oidc-idp-token': token },
  redirect: 'manual',
  signal: AbortSignal.timeout(15000)
});
const body = await response.text();
const location = response.headers.get('location') || '';
if (!response.ok || /vercel\.com\/login|vercel authentication|deployment protection/i.test(body + location)) {
  console.error('Protected UAT smoke failed: Vercel protection or HTTP status', response.status);
  process.exit(1);
}
if (!/<html[\s>]/i.test(body) || !/id="root"|id="app"/i.test(body)) {
  console.error('Response did not contain the expected Qilly application shell.');
  process.exit(1);
}
console.log('Protected UAT HTTP smoke passed; application UI and Qilly sign-in still require browser regression.');
