/**
 * Client-approved six-month supplier lead-access campaign.
 * Pure eligibility rules only: never changes subscriptions, billing, or supplier records.
 * The campaign activation date must be supplied by an authorized server-side configuration.
 */
export type SupplierLeadEligibilityInput = {
  supplierStatus: 'pending' | 'approved' | 'rejected';
  supplierApprovedAt: string | null;
  campaignStartsAt: string;
  evaluatedAt: string;
  paidLeadAccessUntil?: string | null;
};

function date(value: string): Date {
  const result = new Date(value);
  if (!Number.isFinite(result.getTime())) throw new Error('Invalid campaign date');
  return result;
}

export function addCalendarMonthsClamped(start: Date, months: number): Date {
  const day = start.getUTCDate();
  const target = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + months, 1,
    start.getUTCHours(), start.getUTCMinutes(), start.getUTCSeconds(), start.getUTCMilliseconds()));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target;
}

export function evaluateSupplierLeadAccess(input: SupplierLeadEligibilityInput) {
  const launch = date(input.campaignStartsAt);
  const now = date(input.evaluatedAt);
  const approval = input.supplierApprovedAt ? date(input.supplierApprovedAt) : null;
  // Existing approved suppliers start on launch; newly approved suppliers start on approval.
  const start = approval && approval > launch ? approval : launch;
  const expires = addCalendarMonthsClamped(start, 6);
  const freeEligible = input.supplierStatus === 'approved' && Boolean(approval) && now >= start && now < expires;
  const paidEligible = Boolean(input.paidLeadAccessUntil && date(input.paidLeadAccessUntil) > now);
  return {
    hasLeadAccess: freeEligible || paidEligible,
    freeEligible,
    paidEligible,
    freeStartsAt: start.toISOString(),
    freeExpiresAt: expires.toISOString(),
    // A paid entitlement is never removed or modified by this calculation.
  };
}
