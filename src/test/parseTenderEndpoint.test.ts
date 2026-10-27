import { describe, expect, it, vi } from 'vitest';
import handler from '../../api/parse-tender';

function response() {
  const res: any = {
    headers: {} as Record<string,string>,
    statusCode: 200,
    setHeader: vi.fn((key:string,value:string) => {res.headers[key]=value;return res;}),
    status: vi.fn((code:number) => {res.statusCode=code;return res;}),
    json: vi.fn((body:unknown) => {res.body=body;return res;})
  };
  return res;
}

describe('protected tender extraction endpoint', () => {
  it('rejects anonymous callers before revealing configuration', async () => {
    const res=response();
    await handler({method:'POST',headers:{}},res);
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({error:'Authentication required'});
    expect(res.headers['Cache-Control']).toBe('no-store');
  });

  it('rejects unsupported methods without parsing a request', async () => {
    const res=response();
    await handler({method:'GET',headers:{}},res);
    expect(res.statusCode).toBe(405);
  });

  it('returns service-unavailable for authenticated callers if configuration is absent', async () => {
    const prevUrl=process.env.QILLY_IMPORT_SUPABASE_URL;
    const prevKey=process.env.QILLY_IMPORT_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.QILLY_IMPORT_SUPABASE_URL;
    delete process.env.QILLY_IMPORT_SUPABASE_PUBLISHABLE_KEY;
    try {
      const res=response();
      await handler({method:'POST',headers:{authorization:'Bearer synthetic-test-token'}},res);
      expect(res.statusCode).toBe(503);
      expect(res.body).toEqual({error:'Document extraction is not configured'});
    } finally {
      if(prevUrl===undefined) delete process.env.QILLY_IMPORT_SUPABASE_URL; else process.env.QILLY_IMPORT_SUPABASE_URL=prevUrl;
      if(prevKey===undefined) delete process.env.QILLY_IMPORT_SUPABASE_PUBLISHABLE_KEY; else process.env.QILLY_IMPORT_SUPABASE_PUBLISHABLE_KEY=prevKey;
    }
  });
});
