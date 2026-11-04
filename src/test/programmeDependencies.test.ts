import { describe, expect, it } from 'vitest';
import { validateProgrammeDependencies, type ProgrammeActivity } from '@/utils/programmeDependencies';
const activities: ProgrammeActivity[] = [
  {id:1,name:'Earthworks',start:1,duration:2,share:50},
  {id:2,name:'Concrete',start:3,duration:2,share:50,predecessorId:1}
];
describe('programme predecessor sequencing', () => {
  it('allows a successor beginning after its predecessor finishes', () => expect(validateProgrammeDependencies(activities)).toBe(true));
  it('rejects overlapping predecessor and successor', () => expect(validateProgrammeDependencies([{...activities[0]},{...activities[1],start:2}])).toBe(false));
  it('rejects a nonexistent predecessor', () => expect(validateProgrammeDependencies([{...activities[0]},{...activities[1],predecessorId:999}])).toBe(false));
  it('rejects self-dependency', () => expect(validateProgrammeDependencies([{...activities[0],predecessorId:1},activities[1]])).toBe(false));
  it('allows unlinked packages for manual sequencing', () => expect(validateProgrammeDependencies(activities.map(a=>({...a,predecessorId:null})))).toBe(true));
  it('rejects invalid predecessor duration', () => expect(validateProgrammeDependencies([{...activities[0],duration:0},activities[1]])).toBe(false));
});
