import { describe, expect, it } from 'vitest';
import { calculateProgrammeCashflow, calculateWorkPackageMonthlyAllocations, comparePlannedAndActual } from '@/utils/programmeCashflow';
import type { ProgrammeActivity } from '@/utils/programmeDependencies';

const activities: ProgrammeActivity[] = [
  {id:1,name:'Earthworks',start:1,duration:2,share:40},
  {id:2,name:'Roadworks',start:3,duration:2,share:60,predecessorId:1}
];
describe('monthly BOQ programme cashflow', () => {
  it('allocates monthly spend and reconciles final cumulative value', () => {
    const series = calculateProgrammeCashflow(activities,4,1000);
    expect(series.map(s=>s.planned)).toEqual([200,200,300,300]);
    expect(series.at(-1)?.cumulative).toBeCloseTo(1000,8);
  });
  it('supports one-month and 36-month planning horizons', () => {
    expect(calculateProgrammeCashflow([{id:1,name:'Works',start:1,duration:1,share:100}],1,500)).toEqual([{month:1,planned:500,cumulative:500}]);
    const series=calculateProgrammeCashflow([{id:1,name:'Works',start:1,duration:36,share:100}],36,3600);
    expect(series).toHaveLength(36);
    expect(series.at(-1)?.cumulative).toBeCloseTo(3600,8);
  });
  it('rejects invalid share totals and out-of-bounds activities', () => {
    expect(calculateProgrammeCashflow([{...activities[0],share:90}],4,1000)).toEqual([]);
    expect(calculateProgrammeCashflow([{...activities[0],duration:5}],4,1000)).toEqual([]);
  });
  it('rejects overlapping dependencies and nonpositive scenario values', () => {
    expect(calculateProgrammeCashflow([{...activities[0]},{...activities[1],start:2}],4,1000)).toEqual([]);
    expect(calculateProgrammeCashflow(activities,4,0)).toEqual([]);
  });
  it('rejects invalid month horizon and empty activity schedules', () => {
    expect(calculateProgrammeCashflow(activities,37,1000)).toEqual([]);
    expect(calculateProgrammeCashflow([],4,1000)).toEqual([]);
  });
});

describe('Sprint 02 monthly allocations and actual expenditure controls', () => {
  it('reconciles package allocations to the S-Curve by month', () => {
    const cashflow = calculateProgrammeCashflow(activities, 4, 1000);
    const packages = calculateWorkPackageMonthlyAllocations(activities, 4, 1000);
    expect(packages.map(p => p.plannedTotal)).toEqual([400, 600]);
    expect(cashflow.map((m, index) => packages.reduce((sum, p) => sum + p.months[index], 0))).toEqual(cashflow.map(m => m.planned));
  });
  it('shows only explicitly supplied actuals and does not fill missing months with zero', () => {
    const baseline = calculateProgrammeCashflow(activities, 4, 1000);
    const comparison = comparePlannedAndActual(baseline, [{month:1,amount:175},{month:2,amount:225}]);
    expect(comparison[0]).toMatchObject({actual:175,cumulativeActual:175,variance:-25,cumulativeVariance:-25});
    expect(comparison[1]).toMatchObject({actual:225,cumulativeActual:400,cumulativeVariance:0});
    expect(comparison[2]).toMatchObject({actual:null,cumulativeActual:null,variance:null,cumulativeVariance:null});
  });
  it('rejects duplicate, negative and out-of-horizon actual expenditure', () => {
    const baseline = calculateProgrammeCashflow(activities, 4, 1000);
    expect(comparePlannedAndActual(baseline,[{month:1,amount:10},{month:1,amount:20}])).toEqual([]);
    expect(comparePlannedAndActual(baseline,[{month:1,amount:-1}])).toEqual([]);
    expect(comparePlannedAndActual(baseline,[{month:5,amount:1}])).toEqual([]);
  });
});
