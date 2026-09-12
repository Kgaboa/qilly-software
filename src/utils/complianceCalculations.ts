/**
 * Qilly Compliance Cost Calculator
 * Calculates all mandatory South African construction compliance costs
 * 
 * Data Sources:
 * - NHBRC: Official fee schedules (2024/2025)
 * - CIDB: Contractor grading matrix (public)
 * - Department of Labour: Statutory contribution rates
 * - SABS/Testing Labs: Industry-standard rates
 * - SANAS: BBBEE verification agency fees
 */

// ==================== TYPES ====================

export interface ComplianceCosts {
  nhbrc: NHBRCCosts;
  cidb: CIDBCosts;
  statutory: StatutoryCosts;
  testing: TestingCosts;
  bbbee: BBBEECosts;
  preliminaries: PreliminaryCosts;
  environmental?: EnvironmentalComplianceCosts; // Environmental compliance (NEMA, Waste, Provincial)
  total: number;
  breakdown: CostBreakdownItem[];
}

export interface EnvironmentalComplianceCosts {
  nemaAuthorizations: number; // NEMA Basic Assessment or EIA costs
  wasteManagement: number; // Waste disposal and recycling costs
  provincialPermits: number; // Province-specific environmental permits
  empPreparation: number; // Environmental Management Plan preparation
  total: number;
  details: string[];
}

export interface NHBRCCosts {
  enrollmentFee: number;
  inspectionFees: number;
  defectsInsurance: number;
  total: number;
  details: string[];
}

export interface CIDBCosts {
  isCompliant: boolean;
  requiredGrade: string;
  registrationFee: number;
  annualFee: number;
  total: number;
  warnings: string[];
}

export interface StatutoryCosts {
  uif: number;
  sdl: number;
  coida: number;
  pensionFund: number;
  total: number;
  percentageOfLabour: number;
}

export interface TestingCosts {
  concreteTests: number;
  soilTests: number;
  brickTests: number;
  geotechnical: number;
  total: number;
  testingSchedule: TestingScheduleItem[];
}

export interface BBBEECosts {
  verificationType: 'EME' | 'QSE' | 'Generic' | 'Not Required';
  verificationFee: number;
  consultantFees: number;
  total: number;
  details: string[];
}

export interface PreliminaryCosts {
  siteEstablishment: number;
  temporaryServices: number;
  timeRelated: number;
  healthAndSafety: number;
  total: number;
  breakdown: { item: string; cost: number }[];
}

export interface CostBreakdownItem {
  category: string;
  subcategory: string;
  amount: number;
  percentage: number;
  regulation: string;
}

export interface TestingScheduleItem {
  testType: string;
  frequency: string;
  estimatedTests: number;
  costPerTest: number;
  totalCost: number;
  standard: string;
}

export interface ProjectParameters {
  projectValue: number;
  numberOfUnits?: number;
  houseType?: '40sqm' | '50sqm' | 'BNG' | 'RDP' | 'Custom';
  province: string;
  projectDuration: number; // months
  labourContent: number; // percentage of project value
  projectType: 'housing' | 'commercial' | 'infrastructure' | 'renovation';
  contractorGrade?: string;
  companyTurnover?: number;
}

// ==================== NHBRC CALCULATIONS ====================

/**
 * NHBRC Enrollment and Inspection Fees
 * Source: NHBRC Fee Schedule 2024/2025
 */
export function calculateNHBRCCosts(params: ProjectParameters): NHBRCCosts {
  const { numberOfUnits = 0, houseType = 'RDP', projectValue } = params;
  
  // NHBRC Enrollment Fees (per unit)
  const enrollmentFeePerUnit: Record<string, number> = {
    '40sqm': 850,
    '50sqm': 950,
    'RDP': 850,
    'BNG': 1200,
    'Custom': 1500
  };

  const baseEnrollmentFee = enrollmentFeePerUnit[houseType] || 850;
  const enrollmentFee = numberOfUnits > 0 
    ? numberOfUnits * baseEnrollmentFee 
    : projectValue * 0.003; // 0.3% for non-unit projects

  // Inspection Fees (5 inspections per unit: foundation, damp course, wall plate, roof, final)
  const inspectionFeePerVisit = 450;
  const inspectionsPerUnit = 5;
  const inspectionFees = numberOfUnits > 0
    ? numberOfUnits * inspectionsPerUnit * inspectionFeePerVisit
    : projectValue * 0.005; // 0.5% for non-unit projects

  // Defects Insurance (10-year structural warranty)
  const defectsInsurance = numberOfUnits > 0
    ? numberOfUnits * 1800 // R1,800 per unit
    : projectValue * 0.015; // 1.5% for commercial

  const total = enrollmentFee + inspectionFees + defectsInsurance;

  const details = [
    `Enrollment: ${numberOfUnits} units @ R${baseEnrollmentFee.toLocaleString()} = R${enrollmentFee.toLocaleString()}`,
    `Inspections: ${numberOfUnits * inspectionsPerUnit} visits @ R${inspectionFeePerVisit} = R${inspectionFees.toLocaleString()}`,
    `10-year warranty insurance: R${defectsInsurance.toLocaleString()}`
  ];

  return {
    enrollmentFee,
    inspectionFees,
    defectsInsurance,
    total,
    details
  };
}

// ==================== CIDB CALCULATIONS ====================

/**
 * CIDB Contractor Grading Validation
 * Source: CIDB Contractor Grading Matrix (Public)
 */
export function calculateCIDBCosts(params: ProjectParameters): CIDBCosts {
  const { projectValue, contractorGrade } = params;

  // CIDB Grading Thresholds (GB - General Building)
  const gradingThresholds = [
    { grade: 'GB1', maxValue: 200000, regFee: 500, annualFee: 500 },
    { grade: 'GB2', maxValue: 650000, regFee: 750, annualFee: 750 },
    { grade: 'GB3', maxValue: 2000000, regFee: 1000, annualFee: 1000 },
    { grade: 'GB4', maxValue: 6500000, regFee: 1500, annualFee: 1500 },
    { grade: 'GB5', maxValue: 20000000, regFee: 2500, annualFee: 2500 },
    { grade: 'GB6', maxValue: 65000000, regFee: 4000, annualFee: 4000 },
    { grade: 'GB7', maxValue: 200000000, regFee: 6500, annualFee: 6500 },
    { grade: 'GB8', maxValue: 650000000, regFee: 10000, annualFee: 10000 },
    { grade: 'GB9', maxValue: Infinity, regFee: 15000, annualFee: 15000 }
  ];

  // Find required grade for project value
  const requiredGrading = gradingThresholds.find(g => projectValue <= g.maxValue) || gradingThresholds[8];
  
  // Check if contractor grade is sufficient
  const contractorGradeNumber = contractorGrade ? parseInt(contractorGrade.replace(/\D/g, '')) : 0;
  const requiredGradeNumber = parseInt(requiredGrading.grade.replace(/\D/g, ''));
  const isCompliant = contractorGradeNumber >= requiredGradeNumber;

  const warnings = [];
  if (!isCompliant) {
    warnings.push(`⚠️ Contractor grade ${contractorGrade || 'Unknown'} insufficient for R${projectValue.toLocaleString()} project`);
    warnings.push(`Required minimum: ${requiredGrading.grade}`);
    warnings.push(`This bid will be rejected as non-compliant`);
  }

  return {
    isCompliant,
    requiredGrade: requiredGrading.grade,
    registrationFee: requiredGrading.regFee,
    annualFee: requiredGrading.annualFee,
    total: requiredGrading.regFee + requiredGrading.annualFee,
    warnings
  };
}

// ==================== STATUTORY LABOUR COSTS ====================

/**
 * Statutory Labour Contributions
 * Sources: Department of Labour, Compensation Fund, Bargaining Councils
 */
export function calculateStatutoryCosts(params: ProjectParameters): StatutoryCosts {
  const { projectValue, labourContent } = params;
  
  const labourCost = projectValue * (labourContent / 100);

  // Statutory Rates (as of 2024)
  const rates = {
    uif: 0.01,        // 1% of payroll (UIF - Unemployment Insurance Fund)
    sdl: 0.01,        // 1% of payroll (SDL - Skills Development Levy)
    coida: 0.0175,    // 1.75% of payroll (COIDA - Compensation for Occupational Injuries)
    pensionFund: 0.10 // 10% of payroll (Industry Pension Fund - MIBCO average)
  };

  const uif = labourCost * rates.uif;
  const sdl = labourCost * rates.sdl;
  const coida = labourCost * rates.coida;
  const pensionFund = labourCost * rates.pensionFund;

  const total = uif + sdl + coida + pensionFund;
  const percentageOfLabour = (total / labourCost) * 100;

  return {
    uif,
    sdl,
    coida,
    pensionFund,
    total,
    percentageOfLabour
  };
}

// ==================== QUALITY TESTING COSTS ====================

/**
 * Quality Assurance Testing Schedule
 * Sources: SANS 2001, SANS 227, SANS 3001, Industry Testing Lab Rates
 */
export function calculateTestingCosts(params: ProjectParameters): TestingCosts {
  const { projectValue, numberOfUnits = 0 } = params;

  const testingSchedule: TestingScheduleItem[] = [];

  // Concrete Testing (SANS 2001)
  const concreteVolume = numberOfUnits > 0 ? numberOfUnits * 25 : projectValue / 100000; // m³
  const concreteCubesPerBatch = 3; // Standard: 3 cubes per 20m³ or day
  const batches = Math.ceil(concreteVolume / 20);
  const concreteTests = batches * concreteCubesPerBatch;
  const concreteTestCost = 450; // Per cube test
  const concreteTotalCost = concreteTests * concreteTestCost;

  testingSchedule.push({
    testType: 'Concrete Cube Strength',
    frequency: '3 cubes per 20m³ or per day',
    estimatedTests: concreteTests,
    costPerTest: concreteTestCost,
    totalCost: concreteTotalCost,
    standard: 'SANS 2001-CC1'
  });

  // Soil Compaction Testing (SANS 3001)
  const soilTestsPerUnit = numberOfUnits > 0 ? numberOfUnits * 3 : 15; // 3 per unit or minimum 15
  const soilTestCost = 850; // Per test
  const soilTotalCost = soilTestsPerUnit * soilTestCost;

  testingSchedule.push({
    testType: 'Soil Compaction (Proctor)',
    frequency: '3 tests per unit (foundation, subbase, base)',
    estimatedTests: soilTestsPerUnit,
    costPerTest: soilTestCost,
    totalCost: soilTotalCost,
    standard: 'SANS 3001-GR30'
  });

  // Brick/Masonry Testing (SANS 227)
  const brickTests = numberOfUnits > 0 ? Math.ceil(numberOfUnits / 10) : 5; // 1 sample per 10 units
  const brickTestCost = 650; // Per sample
  const brickTotalCost = brickTests * brickTestCost;

  testingSchedule.push({
    testType: 'Brick Strength & Water Absorption',
    frequency: '1 sample per 10 units',
    estimatedTests: brickTests,
    costPerTest: brickTestCost,
    totalCost: brickTotalCost,
    standard: 'SANS 227'
  });

  // Geotechnical Investigation
  const geotechnical = numberOfUnits > 0 
    ? Math.max(15000, numberOfUnits * 150) // R150 per unit, min R15,000
    : projectValue * 0.005; // 0.5% for commercial

  testingSchedule.push({
    testType: 'Geotechnical Investigation',
    frequency: 'Once per site (soil report)',
    estimatedTests: 1,
    costPerTest: geotechnical,
    totalCost: geotechnical,
    standard: 'SANS 634'
  });

  return {
    concreteTests: concreteTotalCost,
    soilTests: soilTotalCost,
    brickTests: brickTotalCost,
    geotechnical,
    total: concreteTotalCost + soilTotalCost + brickTotalCost + geotechnical,
    testingSchedule
  };
}

// ==================== BBBEE VERIFICATION COSTS ====================

/**
 * BBBEE Verification Certificate Costs
 * Source: SANAS-accredited verification agencies (2024 rates)
 */
export function calculateBBBEECosts(params: ProjectParameters): BBBEECosts {
  const { companyTurnover = 0 } = params;

  let verificationType: 'EME' | 'QSE' | 'Generic' | 'Not Required';
  let verificationFee = 0;
  let consultantFees = 0;
  const details: string[] = [];

  if (companyTurnover === 0) {
    verificationType = 'Not Required';
    details.push('Company turnover not specified');
  } else if (companyTurnover <= 10000000) {
    // EME (Exempt Micro Enterprise) - under R10M
    verificationType = 'EME';
    verificationFee = 0; // Affidavit only
    details.push('EME: Affidavit certification (under R10M turnover)');
    details.push('No verification fee required');
  } else if (companyTurnover <= 50000000) {
    // QSE (Qualifying Small Enterprise) - R10M to R50M
    verificationType = 'QSE';
    verificationFee = 8500;
    consultantFees = 15000; // Average consultant fee for QSE
    details.push('QSE: Certificate required (R10M - R50M turnover)');
    details.push(`Verification fee: R${verificationFee.toLocaleString()}`);
    details.push(`Consultant fees: R${consultantFees.toLocaleString()}`);
  } else {
    // Generic - over R50M
    verificationType = 'Generic';
    verificationFee = 25000;
    consultantFees = 45000; // Average consultant fee for Generic
    details.push('Generic: Full verification (over R50M turnover)');
    details.push(`Verification fee: R${verificationFee.toLocaleString()}`);
    details.push(`Consultant fees: R${consultantFees.toLocaleString()}`);
  }

  return {
    verificationType,
    verificationFee,
    consultantFees,
    total: verificationFee + consultantFees,
    details
  };
}

// ==================== PRELIMINARIES & GENERAL ====================

/**
 * Preliminaries and General Items (P&G)
 * Source: ASAQS guidelines, industry standards
 */
export function calculatePreliminaryCosts(params: ProjectParameters): PreliminaryCosts {
  const { projectValue, projectDuration, numberOfUnits = 0, projectType } = params;

  const breakdown: { item: string; cost: number }[] = [];

  // Site Establishment (2-3% of project value)
  const siteEstablishment = projectValue * 0.025;
  breakdown.push(
    { item: 'Site offices & stores', cost: siteEstablishment * 0.4 },
    { item: 'Fencing & access control', cost: siteEstablishment * 0.3 },
    { item: 'Signage & notice boards', cost: siteEstablishment * 0.15 },
    { item: 'Site access roads', cost: siteEstablishment * 0.15 }
  );

  // Temporary Services (1.5-2% of project value)
  const temporaryServices = projectValue * 0.0175;
  breakdown.push(
    { item: 'Temporary water supply', cost: temporaryServices * 0.35 },
    { item: 'Temporary electricity', cost: temporaryServices * 0.45 },
    { item: 'Chemical toilets (1 per 15 workers)', cost: temporaryServices * 0.20 }
  );

  // Time-Related Costs (based on project type)
  // Housing projects: percentage-based (scales with project size)
  // Commercial/Infrastructure: monthly rate (fixed overhead)
  let timeRelated: number;
  if (projectType === 'housing') {
    // For housing: 3-4% of project value (scales appropriately)
    timeRelated = projectValue * 0.035;
    breakdown.push(
      { item: 'Site management team', cost: timeRelated * 0.65 },
      { item: 'Security services', cost: timeRelated * 0.30 },
      { item: 'Site cleaning & maintenance', cost: timeRelated * 0.05 }
    );
  } else {
    // For commercial/infrastructure: R85k per month (larger teams required)
    timeRelated = projectDuration * 85000;
    breakdown.push(
      { item: 'Site management team', cost: timeRelated * 0.65 },
      { item: '24/7 Security services', cost: timeRelated * 0.30 },
      { item: 'Site cleaning & maintenance', cost: timeRelated * 0.05 }
    );
  }

  // Health & Safety (0.5-1% of project value)
  const healthAndSafety = projectValue * 0.0075;
  breakdown.push(
    { item: 'Safety equipment & PPE', cost: healthAndSafety * 0.40 },
    { item: 'First aid facilities', cost: healthAndSafety * 0.20 },
    { item: 'Fire fighting equipment', cost: healthAndSafety * 0.15 },
    { item: 'Safety officer & training', cost: healthAndSafety * 0.25 }
  );

  return {
    siteEstablishment,
    temporaryServices,
    timeRelated,
    healthAndSafety,
    total: siteEstablishment + temporaryServices + timeRelated + healthAndSafety,
    breakdown
  };
}

// ==================== MASTER CALCULATOR ====================

/**
 * Calculate Environmental Compliance Costs (NEMA, Waste, Provincial)
 * Integrates with environmentalCompliance.ts assessments
 */
export function calculateEnvironmentalComplianceCosts(
  projectValue: number,
  environmentalData?: any
): EnvironmentalComplianceCosts {
  if (!environmentalData) {
    // No environmental assessment data provided
    return {
      nemaAuthorizations: 0,
      wasteManagement: 0,
      provincialPermits: 0,
      empPreparation: 0,
      total: 0,
      details: ['No environmental assessment conducted']
    };
  }

  const details: string[] = [];
  
  // NEMA Authorization Costs
  const nemaAuthorizations = environmentalData.estimatedComplianceCost || 0;
  if (nemaAuthorizations > 0) {
    details.push(`NEMA authorizations (${environmentalData.authorizationsRequired?.length || 0} activities): R${nemaAuthorizations.toLocaleString()}`);
  }
  
  // Waste Management Costs
  const wasteManagement = environmentalData.wasteEstimates?.reduce(
    (sum: number, w: any) => sum + (w.estimatedCost || 0), 
    0
  ) || 0;
  if (wasteManagement > 0) {
    details.push(`Waste disposal & recycling: R${wasteManagement.toLocaleString()}`);
  }
  
  // Provincial Environmental Permits (if triggered)
  const provincialPermits = 0; // Already included in NEMA costs typically
  
  // EMP Preparation (if required)
  const empPreparation = environmentalData.empIncluded ? 
    Math.max(15000, projectValue * 0.002) : 0; // R15k minimum or 0.2% of project value
  if (empPreparation > 0) {
    details.push(`Environmental Management Plan preparation: R${empPreparation.toLocaleString()}`);
  }
  
  const total = nemaAuthorizations + wasteManagement + provincialPermits + empPreparation;
  
  if (total === 0) {
    details.push('No environmental compliance costs required (Low-risk project)');
  }
  
  return {
    nemaAuthorizations,
    wasteManagement,
    provincialPermits,
    empPreparation,
    total,
    details
  };
}

/**
 * Calculate All Compliance Costs (INCLUDING Environmental)
 */
export function calculateAllComplianceCosts(
  params: ProjectParameters, 
  environmentalData?: any
): ComplianceCosts {
  const nhbrc = calculateNHBRCCosts(params);
  const cidb = calculateCIDBCosts(params);
  const statutory = calculateStatutoryCosts(params);
  const testing = calculateTestingCosts(params);
  const bbbee = calculateBBBEECosts(params);
  const preliminaries = calculatePreliminaryCosts(params);
  const environmental = calculateEnvironmentalComplianceCosts(params.projectValue, environmentalData);

  // UPDATED: Compliance costs now INCLUDE environmental costs
  // Compliance = NHBRC + CIDB + Statutory + Testing + BBBEE + Environmental
  // Preliminaries (P&G) are still separate as normal project costs
  const total = nhbrc.total + cidb.total + statutory.total + testing.total + bbbee.total + (environmental.total || 0);

  // Create detailed breakdown
  const breakdown: CostBreakdownItem[] = [
    {
      category: 'NHBRC Compliance',
      subcategory: 'Enrollment & Inspections',
      amount: nhbrc.enrollmentFee + nhbrc.inspectionFees,
      percentage: ((nhbrc.enrollmentFee + nhbrc.inspectionFees) / params.projectValue) * 100,
      regulation: 'Housing Consumers Protection Measures Act 95 of 1998'
    },
    {
      category: 'NHBRC Compliance',
      subcategory: '10-Year Defects Insurance',
      amount: nhbrc.defectsInsurance,
      percentage: (nhbrc.defectsInsurance / params.projectValue) * 100,
      regulation: 'NHBRC Warranty Scheme'
    },
    {
      category: 'CIDB Compliance',
      subcategory: 'Registration & Annual Fees',
      amount: cidb.total,
      percentage: (cidb.total / params.projectValue) * 100,
      regulation: 'Construction Industry Development Board Act 38 of 2000'
    },
    {
      category: 'Statutory Labour',
      subcategory: 'UIF Contributions',
      amount: statutory.uif,
      percentage: (statutory.uif / params.projectValue) * 100,
      regulation: 'Unemployment Insurance Act 63 of 2001'
    },
    {
      category: 'Statutory Labour',
      subcategory: 'Skills Development Levy',
      amount: statutory.sdl,
      percentage: (statutory.sdl / params.projectValue) * 100,
      regulation: 'Skills Development Levies Act 9 of 1999'
    },
    {
      category: 'Statutory Labour',
      subcategory: 'COIDA (Injury Compensation)',
      amount: statutory.coida,
      percentage: (statutory.coida / params.projectValue) * 100,
      regulation: 'Compensation for Occupational Injuries Act 130 of 1993'
    },
    {
      category: 'Statutory Labour',
      subcategory: 'Pension Fund Contributions',
      amount: statutory.pensionFund,
      percentage: (statutory.pensionFund / params.projectValue) * 100,
      regulation: 'Bargaining Council Agreement (MIBCO)'
    },
    {
      category: 'Quality Assurance',
      subcategory: 'Material Testing',
      amount: testing.total,
      percentage: (testing.total / params.projectValue) * 100,
      regulation: 'SANS 2001, SANS 227, SANS 3001'
    },
    {
      category: 'BBBEE',
      subcategory: 'Verification Certificate',
      amount: bbbee.total,
      percentage: (bbbee.total / params.projectValue) * 100,
      regulation: 'Broad-Based Black Economic Empowerment Act 53 of 2003'
    },
    // NEW: Environmental Compliance breakdown
    ...(environmental.total > 0 ? [
      {
        category: 'Environmental Compliance',
        subcategory: 'NEMA Authorizations & Waste Management',
        amount: environmental.total,
        percentage: (environmental.total / params.projectValue) * 100,
        regulation: 'National Environmental Management Act 107 of 1998'
      }
    ] : []),
    {
      category: 'Preliminaries',
      subcategory: 'Site Establishment',
      amount: preliminaries.siteEstablishment,
      percentage: (preliminaries.siteEstablishment / params.projectValue) * 100,
      regulation: 'Standard Conditions of Contract (JBCC/FIDIC)'
    },
    {
      category: 'Preliminaries',
      subcategory: 'Temporary Services',
      amount: preliminaries.temporaryServices,
      percentage: (preliminaries.temporaryServices / params.projectValue) * 100,
      regulation: 'Standard Conditions of Contract'
    },
    {
      category: 'Preliminaries',
      subcategory: 'Time-Related Costs',
      amount: preliminaries.timeRelated,
      percentage: (preliminaries.timeRelated / params.projectValue) * 100,
      regulation: 'ASAQS Guidelines'
    },
    {
      category: 'Preliminaries',
      subcategory: 'Health & Safety',
      amount: preliminaries.healthAndSafety,
      percentage: (preliminaries.healthAndSafety / params.projectValue) * 100,
      regulation: 'Occupational Health & Safety Act 85 of 1993'
    }
  ];

  return {
    nhbrc,
    cidb,
    statutory,
    testing,
    bbbee,
    preliminaries,
    environmental,
    total,
    breakdown
  };
}

// ==================== PROVINCE-SPECIFIC ADJUSTMENTS ====================

/**
 * Apply province-specific cost multipliers
 */
export function applyProvincialAdjustments(
  costs: ComplianceCosts,
  province: string
): ComplianceCosts {
  // Cost multipliers by province (relative to Gauteng baseline = 1.0)
  const provinceMultipliers: Record<string, number> = {
    'Gauteng': 1.0,
    'Western Cape': 1.05,
    'KwaZulu-Natal': 0.95,
    'Eastern Cape': 0.85,
    'Limpopo': 0.80,
    'Mpumalanga': 0.88,
    'North West': 0.85,
    'Free State': 0.87,
    'Northern Cape': 0.90
  };

  const multiplier = provinceMultipliers[province] || 1.0;

  // Apply multiplier to variable costs (not statutory rates)
  return {
    ...costs,
    testing: {
      ...costs.testing,
      total: costs.testing.total * multiplier,
      concreteTests: costs.testing.concreteTests * multiplier,
      soilTests: costs.testing.soilTests * multiplier,
      brickTests: costs.testing.brickTests * multiplier,
      geotechnical: costs.testing.geotechnical * multiplier
    },
    preliminaries: {
      ...costs.preliminaries,
      total: costs.preliminaries.total * multiplier,
      siteEstablishment: costs.preliminaries.siteEstablishment * multiplier,
      temporaryServices: costs.preliminaries.temporaryServices * multiplier,
      timeRelated: costs.preliminaries.timeRelated * multiplier,
      healthAndSafety: costs.preliminaries.healthAndSafety * multiplier
    },
    // UPDATED: Compliance total NOW INCLUDES environmental costs
    total: costs.nhbrc.total + 
           costs.cidb.total + 
           costs.statutory.total + 
           (costs.testing.total * multiplier) + 
           costs.bbbee.total + 
           (costs.environmental?.total || 0)
  };
}