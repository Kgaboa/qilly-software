import type { MonthlyCashflow } from './programmeCashflow';

/** Draft commercial scenario only. A BOQ selling price does not prove actual allowable cost. */
export function calculateAllowablesMarginScenario(
  plannedRevenue: MonthlyCashflow[],
  sellingValue: number,
  allowableCost: number
) {
  if (!plannedRevenue.length || !Number.isFinite(sellingValue) || sellingValue <= 0 ||
      !Number.isFinite(allowableCost) || allowableCost < 0 ||
      plannedRevenue.some((row, i) => row.month !== i + 1 || !Number.isFinite(row.planned) ||
        row.planned < 0 || !Number.isFinite(row.cumulative) || row.cumulative < 0) ||
      Math.abs(plannedRevenue[plannedRevenue.length - 1].cumulative - sellingValue) > Math.max(0.01, sellingValue * 0.000001)) return null;

  const profit = sellingValue - allowableCost;
  const marginPercent = profit / sellingValue * 100;
  const markupPercent = allowableCost > 0 ? profit / allowableCost * 100 : null;
  let cumulativeCost = 0;
  let cumulativeProfit = 0;
  const monthly = plannedRevenue.map((row, index) => {
    const cost = index === plannedRevenue.length - 1
      ? allowableCost - cumulativeCost
      : allowableCost * row.planned / sellingValue;
    const monthlyProfit = row.planned - cost;
    cumulativeCost += cost;
    cumulativeProfit += monthlyProfit;
    return {
      month: row.month,
      revenue: row.planned,
      allowableCost: cost,
      projectedProfit: monthlyProfit,
      cumulativeRevenue: row.cumulative,
      cumulativeAllowableCost: cumulativeCost,
      cumulativeProfit
    };
  });
  return { sellingValue, allowableCost, profit, marginPercent, markupPercent, monthly };
}
