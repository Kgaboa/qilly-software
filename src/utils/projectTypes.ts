export const CONTRACTOR_PROJECT_TYPES = [
  'Residential Building',
  'Commercial Building',
  'Industrial Construction',
  'Infrastructure Development',
  'Road Construction',
  'Bridge Construction',
  'Water & Sanitation',
  'Electrical Works',
  'Mechanical Works',
  'Renovation & Refurbishment',
  'Landscaping & Earthworks',
] as const;

export type ContractorProjectType = (typeof CONTRACTOR_PROJECT_TYPES)[number];
