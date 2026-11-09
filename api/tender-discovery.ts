import { createClient } from '@supabase/supabase-js';

type TenderResult = { id: string; title: string; issuer: string; reference: string; closingDate: string | null; sourceUrl: string; publishedAt: string | null };
const send = (res: any, status: number, body: unknown) => res.status(status).json(body);
const text = (v: unknown) => typeof v === 'string' ? v.trim().slice(0, 500) : '';
const safeUrl = (v: unknown) => {
  try { const u = new URL(text(v)); return u.protocol === 'https:' && !u.username && !u.password ? u.toString() : ''; } catch { return ''; }
};
export function mapTenderRecords(payload: unknown): TenderResult[] {
  const root = payload as any;
  const items: unknown[] = Array.isArray(root) ? root : Array.isArray(root?.records) ? root.records : Array.isArray(root?.results) ? root.results : Array.isArray(root?.data) ? root.data : Array.isArray(root?.value) ? root.value : [];
  return items.slice(0, 100).flatMap((item: any) => {
    const release = item?.compiledRelease || item?.releases?.[0] || item?.record?.releases?.[0] || item;
    const tender = release?.tender || release;
    const issuer = text(tender?.procuringEntity?.name || release?.buyer?.name || release?.parties?.find?.((p: any) => p?.roles?.includes?.('buyer'))?.name);
    const reference = text(tender?.id || release?.ocid || item?.ocid);
    const title = text(tender?.title);
    const sourceUrl = safeUrl(release?.uri || release?.url || item?.url || item?.uri || tender?.documents?.[0]?.url) || 'https://www.etenders.gov.za/Home/Opportunities';
    if (!title || !issuer || !reference || !sourceUrl) return [];
    const date = text(tender?.tenderPeriod?.endDate || tender?.datePublished);
    return [{ id: text(release?.ocid || reference), title, issuer, reference, closingDate: date || null, sourceUrl, publishedAt: text(release?.date) || null }];
  });
}
export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
  const token = String(req.headers.authorization || '').match(/^Bearer (.+)$/)?.[1];
  if (!token) return send(res, 401, { error: 'Authentication required' });
  const supabaseUrl = process.env.QILLY_IMPORT_SUPABASE_URL;
  const supabaseKey = process.env.QILLY_IMPORT_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) return send(res, 503, { error: 'Authentication service unavailable' });
  const client = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return send(res, 401, { error: 'Invalid session' });
  // Configure the verified official OCDS JSON endpoint in the server environment.
  // Do not accept an arbitrary upstream URL from the caller (SSRF prevention).
  const endpoint = process.env.QILLY_TENDER_DISCOVERY_URL || 'https://ocds-api.etenders.gov.za/api/OCDSReleases?PageNumber=1&PageSize=100';
  if (!endpoint) return send(res, 503, { error: 'Tender discovery provider not configured' });
  let upstream: URL;
  try {
    upstream = new URL(endpoint);
    if (upstream.protocol !== 'https:' || upstream.username || upstream.password || upstream.hostname !== 'ocds-api.etenders.gov.za')
      return send(res, 503, { error: 'Tender discovery provider configuration invalid' });
  } catch { return send(res, 503, { error: 'Tender discovery provider configuration invalid' }); }
  const query = text(req.query?.q).slice(0, 100);
  // The OCDS releases endpoint supports pagination; search its returned records locally.
  // Passing an unsupported `q` parameter previously produced empty or inconsistent results.
  if (!upstream.searchParams.has('PageNumber')) upstream.searchParams.set('PageNumber', '1');
  if (!upstream.searchParams.has('PageSize')) upstream.searchParams.set('PageSize', '100');
  try {
    const response = await fetch(upstream, { signal: AbortSignal.timeout(8000), headers: { Accept: 'application/json' }, redirect: 'error' });
    if (!response.ok) return send(res, 502, { error: 'Tender discovery provider unavailable' });
    const length = Number(response.headers.get('content-length') || 0);
    if (length > 1_000_000) return send(res, 502, { error: 'Tender discovery response too large' });
    const body = await response.text();
    if (body.length > 1_000_000) return send(res, 502, { error: 'Tender discovery response too large' });
    const all = mapTenderRecords(JSON.parse(body));
    const needle = query.toLocaleLowerCase('en-ZA');
    const tenders = needle ? all.filter(t => [t.title, t.issuer, t.reference].some(v => v.toLocaleLowerCase('en-ZA').includes(needle))) : all;
    return send(res, 200, { source: 'National Treasury OCDS', tenders, reviewRequired: true, pageLimited: true, notice: 'Search covers the first page of published records; verify each tender and its source on the official portal.' });
  } catch { return send(res, 502, { error: 'Tender discovery provider unavailable' }); }
}
