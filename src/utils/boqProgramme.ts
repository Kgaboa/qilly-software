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
    const reviewed = status !== 'PRICED';
    const decisionReview = !decision || decision.reviewStatus !== 'ACCEPTED';
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

/** Historical BOQs lack per-line matching approval evidence. These are explicitly
 * provisional work groups for QS review, never accepted pricing decisions. */
export function deriveHistoricalDraftGroups(items: Array<{
  name?: string; description?: string; code?: string; quantity?: number | string; unitPrice?: number | string; totalPrice?: number | string;
}>): { groups: BoqProgrammeGroup[]; excludedCount: number; eligibleTotal: number } {
  const buckets = new Map<string, { value: number; codes: string[] }>();
  let excludedCount = 0;
  for (const item of items) {
    const amount = moneyValue(item.totalPrice);
    const quantity = moneyValue(item.quantity);
    const rate = moneyValue(item.unitPrice);
    const consistent = quantity !== null && rate !== null && quantity > 0 && rate > 0 && amount !== null && Math.abs(quantity * rate - amount) <= Math.max(0.05, amount * 0.001);
    if (!consistent || !String(item.name || item.description || '').trim()) {
      excludedCount++;
      continue;
    }
    const label = category([item.name, item.description].filter(Boolean).join(' '), item.code || '');
    const bucket = buckets.get(label) || { value: 0, codes: [] };
    bucket.value += amount;
    bucket.codes.push(item.code || item.name || 'Unnamed item');
    buckets.set(label, bucket);
  }
  const eligibleTotal = [...buckets.values()].reduce((sum, bucket) => sum + bucket.value, 0);
  return {
    groups: [...buckets].map(([name, bucket], index) => ({
      id: index + 1, name, sourceCodes: bucket.codes, value: bucket.value,
      share: eligibleTotal > 0 ? bucket.value / eligibleTotal * 100 : 0,
      requiresReview: true,
    })),
    excludedCount,
    eligibleTotal,
  };
}

/** Draft scheduling only: category order is a proposal, never an approved programme.
 * Each package retains its BOQ-derived cost share. Overlapping packages are allowed;
 * no contractual predecessor or actual progress is inferred.
 */
export function draftBoqWorkPackageSchedule(groups: BoqProgrammeGroup[], months: number) {
  if (!Number.isInteger(months) || months < 1 || months > 36 || !groups.length ||
      groups.some(g => !Number.isFinite(g.share) || g.share < 0)) return [];
  const rank = (name: string) => {
    const n = name.toLowerCase();
    if (/preliminar|mobilis/.test(n)) return 0;
    if (/earthwork/.test(n)) return 1;
    if (/concrete|structure|pipeline|drainage/.test(n)) return 2;
    if (/roadwork|surfacing|electrical|mechanical/.test(n)) return 3;
    if (/testing|handover/.test(n)) return 4;
    return 2;
  };
  return [...groups].sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name))
    .map((g, i, all) => {
      const phase = rank(g.name);
      const start = months === 1 ? 1 : Math.min(months, 1 + Math.floor((months - 1) * phase / 4));
      const duration = Math.max(1, months - start + 1);
      return { id: i + 1, name: g.name, start, duration, share: g.share, predecessorId: null as null };
    });
}
