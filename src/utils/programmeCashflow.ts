import type { ProgrammeActivity } from './programmeDependencies';
import { validateProgrammeDependencies } from './programmeDependencies';

export type MonthlyCashflow = { month: number; planned: number; cumulative: number };

/** Generate a deterministic, illustrative monthly spend curve; never treat as an approved baseline. */
export function calculateProgrammeCashflow(activities: ProgrammeActivity[], months: number, value: number): MonthlyCashflow[] {
  if (!Number.isInteger(months) || months < 1 || months > 36 ||
      !Number.isFinite(value) || value <= 0 || !activities.length ||
      !validateProgrammeDependencies(activities)) return [];
  const totalShare = activities.reduce((sum, a) => sum + a.share, 0);
  if (!Number.isFinite(totalShare) || Math.abs(totalShare - 100) >= 0.001 ||
      activities.some(a => !a.name.trim() || !Number.isInteger(a.start) ||
        !Number.isInteger(a.duration) || a.start < 1 || a.duration < 1 ||
        a.start + a.duration - 1 > months || !Number.isFinite(a.share) || a.share < 0)) return [];
  let cumulative = 0;
  return Array.from({length: months}, (_, index) => {
    const month = index + 1;
    const planned = activities.reduce((sum, a) => month >= a.start && month < a.start + a.duration
      ? sum + value * a.share / 100 / a.duration : sum, 0);
    cumulative += planned;
    return { month, planned, cumulative };
  });
}
