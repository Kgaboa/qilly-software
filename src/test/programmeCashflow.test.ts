import { describe, expect, it } from 'vitest';
import { calculateProgrammeCashflow } from '@/utils/programmeCashflow';
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
