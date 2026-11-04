export type ProgrammeActivity = { id:number; name:string; start:number; duration:number; share:number; predecessorId?:number|null };

export function validateProgrammeDependencies(activities: ProgrammeActivity[]): boolean {
  return activities.every(activity => {
    if (activity.predecessorId == null) return true;
    const predecessor = activities.find(item => item.id === activity.predecessorId);
    return !!predecessor && predecessor.id !== activity.id &&
      Number.isInteger(activity.start) && Number.isInteger(predecessor.start) &&
      Number.isInteger(predecessor.duration) && predecessor.duration > 0 &&
      activity.start >= predecessor.start + predecessor.duration;
  });
}
