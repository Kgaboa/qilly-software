import type { RegionalPricedBillItem } from './regionalPricingEngine';

export type BoqProgrammeGroup = {
  id: number; name: string; sourceCodes: string[]; value: number; share: number;
  requiresReview: boolean;
};
const moneyValue = (raw: unknown): number | null => {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  const s = String(raw ?? '').replace(/[R\s,]/gi, '');
  if (!s || !/^-?\d+(?:\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};
const category = (name: string, code: string): string => {
  const s = name.toLowerCase();
  if (/preliminar|mobilis|site establishment|general items|p\s*&\s*g/.test(s)) return 'Preliminaries and mobilisation';
  if (/earthwork|excavat|fill|trench|bulk earth/.test(s)) return 'Earthworks';
  if (/concrete|reinforc|formwork|foundation/.test(s)) return 'Concrete and structures';
  if (/pipe|water|sewer|drain|stormwater/.test(s)) return 'Pipelines and drainage';
  if (/road|pavement|asphalt|surfacing|kerb/.test(s)) return 'Roadworks and surfacing';
  if (/electrical|cable|lighting|mechanical|pump/.test(s)) return 'Electrical and mechanical';
  if (/test|commission|handover|snag/.test(s)) return 'Testing and handover';
  const prefix = code.match(/^[A-Za-z]+(?:[-.]\d+)?/)?.[0];
  return prefix ? `Other works — ${prefix}` : 'Other works — unclassified';
};

/** Only accepted, positive-value priceable BOQ lines are eligible for a planning proposal.
 * Unpriced, review-required, structural and ambiguous rows remain excluded.
 */
export function deriveBoqProgrammeGroups(items: RegionalPricedBillItem[]): {
  groups: BoqProgrammeGroup[]; excludedCount: number; eligibleTotal: number;
} {
  const buckets = new Map<string, { value: number; codes: string[] }>();
  let excludedCount = 0;
  for (const item of items) {
    const amount = moneyValue(item.totalPrice);
    const status = item.pricingRequirement;
    const decision = item.matchingDecision;
    const reviewed = status && status !== 'PRICED';
    const decisionReview = decision && decision.reviewStatus && decision.reviewStatus !== 'ACCEPTED';
    if (item.rowType === 'heading' || item.rowType === 'subheading' ||
      reviewed || decisionReview || amount === null || amount <= 0) {
      excludedCount++; continue;
    }
    const label = category([item.name, item.description].filter(Boolean).join(' '), item.code || '');
    const bucket = buckets.get(label) || { value: 0, codes: [] };
    bucket.value += amount;
    bucket.codes.push(item.code || item.name || 'Unnamed item');
    buckets.set(label, bucket);
  }
  const eligibleTotal = [...buckets.values()].reduce((s, b) => s + b.value, 0);
  const groups = [...buckets].map(([name, b], i) => ({
    id: i + 1, name, sourceCodes: b.codes, value: b.value,
    share: eligibleTotal > 0 ? b.value / eligibleTotal * 100 : 0,
    requiresReview: true,
  }));
  return { groups, excludedCount, eligibleTotal };
}
