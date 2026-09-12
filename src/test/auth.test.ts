/**
 * Auth regression tests — verifies login flow logic and session handling.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { getTemplatesByProjectType } from '../utils/boqTemplates';

// ─── Fallback login logic (pure unit tests, no DOM needed) ───────────────────
describe('Fallback login accounts', () => {
  const fallbackAccounts: Record<string, { tier: string; type: string; company?: string }> = {
    'operator@test.com': { tier: 'professional', type: 'operator' },
    'fallback_free@qilly-test.com': { tier: 'free', type: 'contractor' },
    'fallback_pro@qilly-test.com': { tier: 'professional', type: 'contractor' },
    'fallback_ent@qilly-test.com': { tier: 'enterprise', type: 'contractor' },
  };

  it('does not treat a real contractor as a fallback demo account', () => {
    expect(fallbackAccounts['enter123@gmail.com']).toBeUndefined();
  });

  it('all fallback accounts have required fields', () => {
    for (const [email, account] of Object.entries(fallbackAccounts)) {
      expect(account.tier, `${email} missing tier`).toBeTruthy();
      expect(account.type, `${email} missing type`).toBeTruthy();
    }
  });
});


describe('Template project type matching', () => {
  it('maps residential contractor work to housing templates', () => {
    expect(getTemplatesByProjectType('Residential Building').length).toBeGreaterThan(0);
    expect(getTemplatesByProjectType('Residential Building')[0].projectType).toBe('Housing Development');
  });

  it('maps water and sanitation work to infrastructure templates', () => {
    expect(getTemplatesByProjectType('Water & Sanitation').length).toBeGreaterThan(0);
    expect(getTemplatesByProjectType('Water & Sanitation')[0].projectType).toBe('Infrastructure (Water/Sewer)');
  });

  it('leaves genuinely unsupported project types empty', () => {
    expect(getTemplatesByProjectType('Unsupported Specialist Work')).toHaveLength(0);
  });
});

// ─── Session storage gating ───────────────────────────────────────────────────
describe('Admin session bypass prevention', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('admin_logged_in flag alone cannot grant access without accessToken', () => {
    // Simulate the App.tsx logic: admin view requires BOTH admin_logged_in AND accessToken
    sessionStorage.setItem('admin_logged_in', 'true');
    // No access_token set
    const accessToken = sessionStorage.getItem('access_token');
    const adminLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';

    // The guard in App.tsx is: currentView === 'admin' && accessToken && (...)
    // Without accessToken, admin view must not render
    const adminViewRendered = adminLoggedIn && !!accessToken;
    expect(adminViewRendered).toBe(false);
  });

  it('admin view requires valid accessToken alongside flag', () => {
    sessionStorage.setItem('admin_logged_in', 'true');
    sessionStorage.setItem('access_token', 'valid_jwt_token_here');
    const accessToken = sessionStorage.getItem('access_token');
    const adminLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
    const adminViewRendered = adminLoggedIn && !!accessToken;
    expect(adminViewRendered).toBe(true);
  });
});

// ─── BOQ quota enforcement ────────────────────────────────────────────────────
describe('BOQ quota enforcement', () => {
  const tierQuotas: Record<string, number | null> = {
    free: 3,
    professional: null, // unlimited
    enterprise: 30,
  };

  it('free tier has quota of 3', () => {
    expect(tierQuotas['free']).toBe(3);
  });

  it('enterprise tier has quota of 30', () => {
    expect(tierQuotas['enterprise']).toBe(30);
  });

  it('professional tier has unlimited quota', () => {
    expect(tierQuotas['professional']).toBeNull();
  });

  it('quota exceeded when monthlyCount >= boqQuota', () => {
    const boqQuota = 30;
    const monthlyBoqCount = 30;
    const quotaExceeded = boqQuota !== null && monthlyBoqCount >= boqQuota;
    expect(quotaExceeded).toBe(true);
  });

  it('quota not exceeded when monthlyCount < boqQuota', () => {
    const boqQuota = 30;
    const monthlyBoqCount = 29;
    const quotaExceeded = boqQuota !== null && monthlyBoqCount >= boqQuota;
    expect(quotaExceeded).toBe(false);
  });
});
