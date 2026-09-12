/**
 * Security regression tests — run before every deployment.
 * These tests verify that critical security fixes remain in place.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../..');

function readSrc(relPath: string): string {
  return fs.readFileSync(path.join(ROOT, 'src', relPath), 'utf-8');
}

// ─── CRITICAL-1: No hardcoded admin credentials ──────────────────────────────
describe('CRITICAL-1: AdminLogin has no hardcoded credentials', () => {
  const adminLogin = readSrc('app/components/AdminLogin.tsx');

  it('does not contain hardcoded admin password', () => {
    expect(adminLogin).not.toMatch(/QillyAdmin2026!/);
  });

  it('does not contain ADMIN_PASSWORD constant', () => {
    expect(adminLogin).not.toMatch(/const ADMIN_PASSWORD\s*=/);
  });

  it('does not contain ADMIN_EMAIL constant', () => {
    expect(adminLogin).not.toMatch(/const ADMIN_EMAIL\s*=/);
  });

  it('does not expose raw Supabase error messages to users', () => {
    // Ensure setError is not called directly with signInError.message
    expect(adminLogin).not.toMatch(/setError\(signInError\.message\)/);
  });

  it('does not contain fillAdminCredentials helper', () => {
    expect(adminLogin).not.toMatch(/fillAdminCredentials/);
  });
});

// ─── CRITICAL-2: Admin view is gated by accessToken ──────────────────────────
describe('CRITICAL-2: App.tsx admin view requires accessToken', () => {
  const app = readSrc('app/App.tsx');

  it('admin view is guarded with accessToken', () => {
    // Must contain accessToken check on same line/proximity as admin view
    expect(app).toMatch(/currentView === 'admin' && accessToken/);
  });
});

// ─── CRITICAL-3: PartnerLogin has no visible credentials ─────────────────────
describe('CRITICAL-3: PartnerLogin does not display credentials', () => {
  const partnerLogin = readSrc('app/components/PartnerLogin.tsx');

  it('does not render Demo Credentials in JSX', () => {
    expect(partnerLogin).not.toMatch(/Demo Credentials/);
  });

  it('does not show password in toast error', () => {
    expect(partnerLogin).not.toMatch(/Demo1234!/);
  });

  it('does not import Alert component (removed with credential block)', () => {
    expect(partnerLogin).not.toMatch(/from ['"]\.\/ui\/alert['"]/);
  });
});

// ─── HIGH: No wildcard CORS + credentials ────────────────────────────────────
describe('HIGH: Edge function CORS is not wildcard', () => {
  const edgeFn = fs.readFileSync(
    path.join(ROOT, 'supabase/functions/server/index.ts'),
    'utf-8'
  );

  it('does not use origin: "*" with credentials: true together', () => {
    const hasWildcard = /origin:\s*["']\*["']/.test(edgeFn);
    const hasCredentials = /credentials:\s*true/.test(edgeFn);
    // They must not BOTH be set at the same time with wildcard
    if (hasWildcard && hasCredentials) {
      throw new Error('CORS wildcard origin with credentials: true is insecure');
    }
  });

  it('does not log raw Authorization headers', () => {
    expect(edgeFn).not.toMatch(/headers\.entries\(\)/);
  });
});

// ─── HIGH: PayFast key not hardcoded ─────────────────────────────────────────
describe('HIGH: PayFast merchant key uses env var', () => {
  const paymentProcessor = readSrc('utils/payments/payment-processor.ts');

  it('merchant key reads from VITE_PAYFAST_MERCHANT_KEY env var', () => {
    expect(paymentProcessor).toMatch(/VITE_PAYFAST_MERCHANT_KEY/);
  });

  it('merchant ID reads from VITE_PAYFAST_MERCHANT_ID env var', () => {
    expect(paymentProcessor).toMatch(/VITE_PAYFAST_MERCHANT_ID/);
  });
});

// ─── MEDIUM: PII files not present ───────────────────────────────────────────
describe('MEDIUM: PII and server log files removed from repo', () => {
  const importsDir = path.join(ROOT, 'src/imports');

  it('user-data-1.json does not exist', () => {
    expect(fs.existsSync(path.join(importsDir, 'user-data-1.json'))).toBe(false);
  });

  it('user-data.json does not exist', () => {
    expect(fs.existsSync(path.join(importsDir, 'user-data.json'))).toBe(false);
  });

  it('server-logs-2.json does not exist', () => {
    expect(fs.existsSync(path.join(importsDir, 'server-logs-2.json'))).toBe(false);
  });

  it('supabase-auth-log.json does not exist', () => {
    expect(fs.existsSync(path.join(importsDir, 'supabase-auth-log.json'))).toBe(false);
  });
});

// ─── MEDIUM: CSP header is configured ────────────────────────────────────────
describe('MEDIUM: Content-Security-Policy header configured', () => {
  const vercelJson = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf-8')
  );

  it('vercel.json contains Content-Security-Policy header', () => {
    const allHeaders = vercelJson.headers?.flatMap((h: any) => h.headers) ?? [];
    const csp = allHeaders.find((h: any) => h.key === 'Content-Security-Policy');
    expect(csp).toBeDefined();
    expect(csp?.value).toContain("default-src 'self'");
  });
});
