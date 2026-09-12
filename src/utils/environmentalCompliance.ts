// Environmental Compliance Utility for South African Construction Projects
// Covers NEMA, Waste Management Act, and Environmental Authorization requirements
// Based on South African environmental legislation (NEMA 1998, Waste Act 2008)

export interface NEMAActivity {
  listingNotice: 'R.324' | 'R.327' | 'R.983' | 'R.985';
  activityNumber: string;
  description: string;
  triggerThreshold: string;
  authorizationType: 'Basic Assessment' | 'EIA' | 'Listed Activity' | 'Exempt';
  competentAuthority: 'DEA' | 'Provincial' | 'Local';
  estimatedTimeframe: string; // in days
}

export interface EnvironmentalRisk {
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'NEMA' | 'Waste' | 'Water' | 'Heritage' | 'Biodiversity';
  description: string;
  mitigation: string;
  authorizationRequired: boolean;
  estimatedCost?: number;
  timelineImpact?: number; // days delay
}

export interface WasteEstimate {
  category: string;
  estimatedVolume: number; // m³ or kg
  unit: 'm³' | 'kg' | 'ton';
  recyclingPotential: number; // percentage
  disposalMethod: 'Landfill' | 'Recycling' | 'Reuse' | 'Special Treatment';
  licensedContractors: string[];
  estimatedCost: number;
  sawicClassification?: string;
}

export interface ComplianceStatus {
  overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  nemaCompliant: boolean;
  wasteCompliant: boolean;
  authorizationsRequired: NEMAActivity[];
  environmentalRisks: EnvironmentalRisk[];
  wasteEstimates: WasteEstimate[];
  complianceScore: number; // 0-100
  estimatedComplianceCost: number;
  estimatedTimelineDelay: number; // days
  recommendedActions: string[];
}

// NEMA Listed Activities Database (2014 Regulations)
// Source: Government Gazette No. 38282-38285, December 2014
const nemaListedActivities: Record<string, NEMAActivity> = {
  'site_clearance_large': {
    listingNotice: 'R.983',
    activityNumber: 'Activity 27',
    description: 'Clearance of vegetation exceeding 300m² in protected areas',
    triggerThreshold: '>300m² in sensitive areas or >1ha elsewhere',
    authorizationType: 'Basic Assessment',
    competentAuthority: 'Provincial',
    estimatedTimeframe: '107', // 107 days for Basic Assessment
  },
  'earthworks_large': {
    listingNotice: 'R.983',
    activityNumber: 'Activity 20',
    description: 'Excavation, moving, or removal of soil/rock exceeding 10,000m³',
    triggerThreshold: '>10,000m³ outside urban areas',
    authorizationType: 'EIA',
    competentAuthority: 'Provincial',
    estimatedTimeframe: '300', // Full EIA process
  },
  'development_watercourse': {
    listingNotice: 'R.985',
    activityNumber: 'Activity 12',
    description: 'Development within 32m of watercourse/wetland',
    triggerThreshold: '<32m from wetland or watercourse',
    authorizationType: 'EIA',
    competentAuthority: 'DEA',
    estimatedTimeframe: '300',
  },
  'rezoning': {
    listingNotice: 'R.983',
    activityNumber: 'Activity 10',
    description: 'Rezoning requiring zoning scheme amendment',
    triggerThreshold: 'Any rezoning in protected areas',
    authorizationType: 'Basic Assessment',
    competentAuthority: 'Provincial',
    estimatedTimeframe: '107',
  },
  'bulk_earthworks': {
    listingNotice: 'R.983',
    activityNumber: 'Activity 18',
    description: 'Bulk earthworks (roads, stormwater, services)',
    triggerThreshold: '>5,000m³ material',
    authorizationType: 'Basic Assessment',
    competentAuthority: 'Provincial',
    estimatedTimeframe: '107',
  },
  'heritage_proximity': {
    listingNotice: 'R.324',
    activityNumber: 'Heritage Impact',
    description: 'Development within 60m of heritage site',
    triggerThreshold: '<60m from listed heritage resource',
    authorizationType: 'Listed Activity',
    competentAuthority: 'Provincial',
    estimatedTimeframe: '60',
  },
};

// Waste generation coefficients (South African construction industry averages)
// Source: CSIR Green Building Handbook & Construction Industry Development Board
const wasteCoefficients = {
  // Building construction waste
  'concrete_waste': {
    percentage: 0.08, // 8% of total concrete volume becomes waste
    recyclingPotential: 0.85, // 85% can be recycled as aggregate
    sawicCode: 'G-W-01',
    costPerM3: 150, // R150/m³ disposal
  },
  'brick_waste': {
    percentage: 0.05, // 5% breakage/waste
    recyclingPotential: 0.70,
    sawicCode: 'G-W-02',
    costPerM3: 120,
  },
  'steel_waste': {
    percentage: 0.03, // 3% offcuts/waste
    recyclingPotential: 0.95, // Steel highly recyclable
    sawicCode: 'G-M-01',
    costPerKg: 0.50, // Often offset by scrap value
  },
  'timber_waste': {
    percentage: 0.12, // 12% offcuts/damaged material
    recyclingPotential: 0.40, // Can be chipped for landscaping
    sawicCode: 'G-W-03',
    costPerM3: 80,
  },
  'general_construction_waste': {
    kgPerM2: 20, // 20kg/m² of building area
    recyclingPotential: 0.30,
    sawicCode: 'G-W-04',
    costPerKg: 0.12,
  },
  'excavation_soil': {
    percentage: 0.15, // 15% excess soil (bulking factor)
    recyclingPotential: 0.60, // Can be reused for landscaping
    sawicCode: 'G-W-05',
    costPerM3: 50,
  },
  'hazardous_waste': {
    kgPerM2: 0.5, // Paints, solvents, adhesives
    recyclingPotential: 0.10,
    sawicCode: 'H-W-01',
    costPerKg: 5.00, // Expensive special disposal
  },
};

// Licensed waste contractors by province (sample data - would be comprehensive in production)
const licensedWasteContractors = {
  'GP': [
    'Enviroserv Waste Management (Pty) Ltd',
    'Averda South Africa',
    'Interwaste (Pty) Ltd',
    'Compass Waste Services',
  ],
  'WC': [
    'Integrated Waste Tracking',
    'Wasteplan',
    'Oricol Environmental Services',
  ],
  'KZN': [
    'EnviroServ KZN',
    'Interwaste Durban',
    'Wasteman',
  ],
  'EC': [
    'Eastern Cape Waste Management',
    'Integrated Waste Solutions EC',
  ],
  'MP': [
    'Mpumalanga Waste Services',
    'EnviroServ Mpumalanga',
  ],
  'LP': [
    'Limpopo Waste Solutions',
    'Polokwane Waste Management',
  ],
  'NW': [
    'North West Waste Services',
    'EnviroServ NW',
  ],
  'FS': [
    'Free State Waste Management',
    'Bloemfontein Waste Solutions',
  ],
  'NC': [
    'Northern Cape Waste Services',
    'Kimberley Waste Management',
  ],
};

// Provincial Environmental Regulations - Province-specific requirements
// Each province has additional environmental requirements beyond NEMA
export interface ProvincialRegulation {
  province: string;
  provincialDepartment: string;
  specificRequirements: {
    name: string;
    description: string;
    triggerCondition: string;
    estimatedCost: number;
    timelineImpact: number; // days
    contactDetails?: string;
  }[];
  airQualityPermits: {
    required: boolean;
    conditions: string[];
    authority: string;
  };
  waterUseRestrictions: {
    level: 'High' | 'Medium' | 'Low';
    description: string;
    restrictions: string[];
  };
  biodiversityProtection: {
    criticalBiodiversityAreas: boolean;
    protectedSpecies: string[];
    additionalAssessments: string[];
  };
  wastePermitThresholds: {
    dailyWasteLimit: number; // kg/day before permit required
    permitCost: number;
  };
}

const provincialRegulations: Record<string, ProvincialRegulation> = {
  'GP': {
    province: 'Gauteng',
    provincialDepartment: 'Gauteng Department of Agriculture and Rural Development (GDARD)',
    specificRequirements: [
      {
        name: 'Gauteng Air Quality Management Plan Compliance',
        description: 'Projects must comply with Gauteng Air Quality Management Plan (dust, emissions)',
        triggerCondition: 'All construction projects > 1000m²',
        estimatedCost: 15000,
        timelineImpact: 30,
        contactDetails: 'GDARD: 011 355 1000 | airquality@gdard.gov.za',
      },
      {
        name: 'C-Plan (Conservation Plan) Biodiversity Assessment',
        description: 'Projects in Gauteng Conservation Plan areas require biodiversity screening',
        triggerCondition: 'Sites within C-Plan critical biodiversity areas',
        estimatedCost: 45000,
        timelineImpact: 60,
        contactDetails: 'GDARD Biodiversity: biodiversity@gdard.gov.za',
      },
      {
        name: 'Gauteng Waste Management License',
        description: 'Construction sites generating >500kg waste/day need provincial waste license',
        triggerCondition: 'Waste generation > 500kg/day',
        estimatedCost: 8500,
        timelineImpact: 45,
        contactDetails: 'GDARD Waste: waste@gdard.gov.za',
      },
    ],
    airQualityPermits: {
      required: true,
      conditions: [
        'Dust suppression measures mandatory',
        'Vehicle emission controls for construction fleet',
        'No open burning of construction waste',
      ],
      authority: 'GDARD Air Quality Management Unit',
    },
    waterUseRestrictions: {
      level: 'High',
      description: 'Gauteng has strict water use restrictions due to water scarcity',
      restrictions: [
        'Watering/dust suppression only between 06:00-09:00 and 18:00-21:00',
        'Mandatory water recycling for concrete washing',
        'Rainwater harvesting encouraged',
      ],
    },
    biodiversityProtection: {
      criticalBiodiversityAreas: true,
      protectedSpecies: ['Highveld grassland species', 'Leopard tortoise', 'Various raptor species'],
      additionalAssessments: ['Gauteng C-Plan screening', 'Ridges and wetlands assessment'],
    },
    wastePermitThresholds: {
      dailyWasteLimit: 500, // kg/day
      permitCost: 8500,
    },
  },
  'WC': {
    province: 'Western Cape',
    provincialDepartment: 'Western Cape Department of Environmental Affairs and Development Planning (DEA&DP)',
    specificRequirements: [
      {
        name: 'Western Cape Biodiversity Framework Compliance',
        description: 'Projects in CBA or ESA areas require detailed biodiversity assessment',
        triggerCondition: 'Sites within Critical Biodiversity Areas (CBA) or Ecological Support Areas (ESA)',
        estimatedCost: 55000,
        timelineImpact: 90,
        contactDetails: 'DEA&DP: 021 483 2984 | eadp@westerncape.gov.za',
      },
      {
        name: 'Cape Flats Aquifer Protection',
        description: 'Special requirements for projects above Cape Flats Aquifer',
        triggerCondition: 'Construction on Cape Flats Aquifer zone',
        estimatedCost: 35000,
        timelineImpact: 60,
        contactDetails: 'DEA&DP Pollution & Chemicals: pollution@westerncape.gov.za',
      },
      {
        name: 'Heritage Western Cape (HWC) Approval',
        description: 'Stricter heritage requirements in Western Cape (includes paleontological finds)',
        triggerCondition: 'All projects > 5000m² or in heritage zones',
        estimatedCost: 28000,
        timelineImpact: 75,
        contactDetails: 'HWC: 021 483 9685 | info@hwc.org.za',
      },
    ],
    airQualityPermits: {
      required: true,
      conditions: [
        'Cape Town Air Quality Bylaws compliance',
        'Dust fallout monitoring for projects > 5000m²',
        'Emission certificates for generators and heavy machinery',
      ],
      authority: 'City of Cape Town Air Quality Management',
    },
    waterUseRestrictions: {
      level: 'High',
      description: 'Western Cape has ongoing water restrictions due to drought risk',
      restrictions: [
        'Level 3 water restrictions apply to construction',
        'No potable water for dust suppression - use recycled/grey water only',
        'Mandatory water consumption monitoring and reporting',
        'Water-wise construction practices required',
      ],
    },
    biodiversityProtection: {
      criticalBiodiversityAreas: true,
      protectedSpecies: [
        'Fynbos plant species (hundreds endemic)',
        'Cape Leopard',
        'African Penguin',
        'Western Leopard Toad',
        'Geometric Tortoise',
      ],
      additionalAssessments: [
        'Botanical specialist assessment (mandatory for fynbos areas)',
        'Paleontological impact assessment',
        'Cape Flats Sand Fynbos assessment',
      ],
    },
    wastePermitThresholds: {
      dailyWasteLimit: 500,
      permitCost: 9500,
    },
  },
  'KZN': {
    province: 'KwaZulu-Natal',
    provincialDepartment: 'KZN Department of Economic Development, Tourism and Environmental Affairs (EDTEA)',
    specificRequirements: [
      {
        name: 'KZN Coastal Management Compliance',
        description: 'Projects within coastal zone require ICM Act compliance',
        triggerCondition: 'Sites within 1km of high-water mark',
        estimatedCost: 65000,
        timelineImpact: 120,
        contactDetails: 'EDTEA Coastal: coastal@kznecon.gov.za',
      },
      {
        name: 'Amafa aKwaZulu-Natali Heritage Approval',
        description: 'Provincial heritage authority approval for KZN projects',
        triggerCondition: 'All projects > 5000m² or in heritage areas',
        estimatedCost: 32000,
        timelineImpact: 90,
        contactDetails: 'Amafa: 033 394 6543 | info@amafapmb.co.za',
      },
      {
        name: 'KZN Biodiversity Stewardship Assessment',
        description: 'Assessment required for projects in biodiversity priority areas',
        triggerCondition: 'Sites within KZN Systematic Conservation Assessment priority areas',
        estimatedCost: 48000,
        timelineImpact: 75,
        contactDetails: 'EDTEA Biodiversity: biodiversity@kznecon.gov.za',
      },
    ],
    airQualityPermits: {
      required: true,
      conditions: [
        'eThekwini Air Quality Bylaws (for Durban metro)',
        'Dust control for sugarcane areas (agricultural sensitivity)',
        'Emission controls near industrial zones (south Durban basin)',
      ],
      authority: 'EDTEA Environmental Quality',
    },
    waterUseRestrictions: {
      level: 'Medium',
      description: 'Moderate water restrictions with focus on coastal protection',
      restrictions: [
        'No construction water discharge to rivers/ocean without treatment',
        'Stormwater management mandatory for coastal projects',
        'Water quality monitoring for projects near uMngeni and Tugela rivers',
      ],
    },
    biodiversityProtection: {
      criticalBiodiversityAreas: true,
      protectedSpecies: [
        'Spotted Grunter (coastal)',
        'Blue Swallow',
        'KZN endemic orchids',
        'African Wild Dog (northern KZN)',
      ],
      additionalAssessments: [
        'Coastal impact assessment (ICM Act)',
        'Estuarine management plan (if applicable)',
        'Grassland assessment (uKhahlamba areas)',
      ],
    },
    wastePermitThresholds: {
      dailyWasteLimit: 500,
      permitCost: 8000,
    },
  },
  'EC': {
    province: 'Eastern Cape',
    provincialDepartment: 'Eastern Cape Department of Economic Development, Environmental Affairs and Tourism (DEDEAT)',
    specificRequirements: [
      {
        name: 'EC Coastal Management Permit',
        description: 'Projects in coastal zone require DEDEAT coastal permit',
        triggerCondition: 'Within 1km of coastline',
        estimatedCost: 42000,
        timelineImpact: 90,
        contactDetails: 'DEDEAT: 043 605 7325 | coastal@dedeat.gov.za',
      },
      {
        name: 'Albany Thicket Biodiversity Assessment',
        description: 'Special protection for Albany Thicket biome',
        triggerCondition: 'Sites within Albany Thicket or Subtropical Thicket areas',
        estimatedCost: 38000,
        timelineImpact: 60,
        contactDetails: 'DEDEAT Biodiversity: biodiversity@dedeat.gov.za',
      },
    ],
    airQualityPermits: {
      required: false,
      conditions: ['Dust control near residential areas', 'Basic emission controls'],
      authority: 'DEDEAT Environmental Quality',
    },
    waterUseRestrictions: {
      level: 'Medium',
      description: 'Water restrictions vary by municipality',
      restrictions: [
        'Water conservation measures required',
        'No wastage of potable water',
        'Coastal projects: strict effluent controls',
      ],
    },
    biodiversityProtection: {
      criticalBiodiversityAreas: true,
      protectedSpecies: ['Blue Crane (provincial bird)', 'Albany Cycad', 'Knysna Seahorse'],
      additionalAssessments: ['Albany Thicket assessment', 'Coastal dune assessment'],
    },
    wastePermitThresholds: {
      dailyWasteLimit: 1000,
      permitCost: 7000,
    },
  },
  'MP': {
    province: 'Mpumalanga',
    provincialDepartment: 'Mpumalanga Department of Agriculture, Rural Development, Land and Environmental Affairs (DARDLEA)',
    specificRequirements: [
      {
        name: 'Mpumalanga Highveld Priority Area Compliance',
        description: 'Stricter air quality requirements in declared priority area',
        triggerCondition: 'Projects within Highveld Priority Area',
        estimatedCost: 52000,
        timelineImpact: 90,
        contactDetails: 'DARDLEA: 013 766 6219 | info@dardlea.gov.za',
      },
      {
        name: 'Grassland Protection Assessment',
        description: 'Projects in grassland biome require specialist assessment',
        triggerCondition: 'Sites within threatened grassland ecosystems',
        estimatedCost: 41000,
        timelineImpact: 75,
        contactDetails: 'DARDLEA Biodiversity: biodiversity@dardlea.gov.za',
      },
    ],
    airQualityPermits: {
      required: true,
      conditions: [
        'Highveld Priority Area emission limits',
        'PM10 and PM2.5 monitoring for large projects',
        'NO₂ and SO₂ controls near industrial areas',
      ],
      authority: 'DARDLEA Air Quality Management',
    },
    waterUseRestrictions: {
      level: 'Medium',
      description: 'Focus on catchment protection (Inkomati, Olifants rivers)',
      restrictions: [
        'Water use authorization for projects near rivers',
        'Stormwater pollution prevention plan required',
      ],
    },
    biodiversityProtection: {
      criticalBiodiversityAreas: true,
      protectedSpecies: ['Wattled Crane', 'Blue Swallow', 'Mpumalanga endemic frogs'],
      additionalAssessments: ['Grassland specialist study', 'Wetland delineation'],
    },
    wastePermitThresholds: {
      dailyWasteLimit: 750,
      permitCost: 7500,
    },
  },
  'LP': {
    province: 'Limpopo',
    provincialDepartment: 'Limpopo Department of Economic Development, Environment and Tourism (LEDET)',
    specificRequirements: [
      {
        name: 'Limpopo Heritage Resources Authority Approval',
        description: 'Heritage approval for projects in archaeologically sensitive areas',
        triggerCondition: 'Projects > 5000m² or in heritage zones',
        estimatedCost: 29000,
        timelineImpact: 60,
        contactDetails: 'LEDET Heritage: heritage@ledet.gov.za',
      },
    ],
    airQualityPermits: {
      required: false,
      conditions: ['Basic dust control measures'],
      authority: 'LEDET Environmental Quality',
    },
    waterUseRestrictions: {
      level: 'Low',
      description: 'Standard water conservation practices',
      restrictions: ['No water wastage', 'Basic conservation measures'],
    },
    biodiversityProtection: {
      criticalBiodiversityAreas: true,
      protectedSpecies: ['Baobab trees', 'Limpopo endemic cycads', 'Martial Eagle'],
      additionalAssessments: ['Baobab impact assessment (if present)', 'Bushveld flora screening'],
    },
    wastePermitThresholds: {
      dailyWasteLimit: 1000,
      permitCost: 6500,
    },
  },
  'NW': {
    province: 'North West',
    provincialDepartment: 'North West Department of Rural, Environment and Agricultural Development (READ)',
    specificRequirements: [
      {
        name: 'North West Biodiversity Management Plan Compliance',
        description: 'Compliance with provincial biodiversity management priorities',
        triggerCondition: 'Projects in CBA areas',
        estimatedCost: 35000,
        timelineImpact: 60,
        contactDetails: 'READ: 018 389 5000 | info@read.nwpg.gov.za',
      },
    ],
    airQualityPermits: {
      required: false,
      conditions: ['Dust control near mining areas', 'Basic emission controls'],
      authority: 'READ Environmental Management',
    },
    waterUseRestrictions: {
      level: 'Medium',
      description: 'Water conservation due to semi-arid climate',
      restrictions: ['Water-wise construction practices', 'No wastage of potable water'],
    },
    biodiversityProtection: {
      criticalBiodiversityAreas: true,
      protectedSpecies: ['Black Rhino (Pilanesberg)', 'Kori Bustard', 'Grassland birds'],
      additionalAssessments: ['Grassland/savanna assessment'],
    },
    wastePermitThresholds: {
      dailyWasteLimit: 1000,
      permitCost: 7000,
    },
  },
  'FS': {
    province: 'Free State',
    provincialDepartment: 'Free State Department of Economic, Small Business Development, Tourism and Environmental Affairs (DESTEA)',
    specificRequirements: [
      {
        name: 'Free State Grassland Protection Compliance',
        description: 'Protection of threatened grassland ecosystems',
        triggerCondition: 'Projects in grassland conservation areas',
        estimatedCost: 37000,
        timelineImpact: 60,
        contactDetails: 'DESTEA: 051 400 4775 | info@destea.gov.za',
      },
    ],
    airQualityPermits: {
      required: false,
      conditions: ['Dust control in urban areas', 'Basic air quality management'],
      authority: 'DESTEA Environmental Services',
    },
    waterUseRestrictions: {
      level: 'Medium',
      description: 'Focus on Vaal and Orange River catchment protection',
      restrictions: [
        'Water use authorization near major rivers',
        'Pollution prevention for Vaal Dam catchment',
      ],
    },
    biodiversityProtection: {
      criticalBiodiversityAreas: true,
      protectedSpecies: ['Black Wildebeest', 'Free State endemic grassland species', 'Blue Crane'],
      additionalAssessments: ['Grassland specialist assessment', 'Wetland screening'],
    },
    wastePermitThresholds: {
      dailyWasteLimit: 1000,
      permitCost: 6500,
    },
  },
  'NC': {
    province: 'Northern Cape',
    provincialDepartment: 'Northern Cape Department of Environment and Nature Conservation (DENC)',
    specificRequirements: [
      {
        name: 'Northern Cape Biodiversity Screening',
        description: 'Assessment for unique Karoo and Nama-Karoo biomes',
        triggerCondition: 'All projects > 5000m²',
        estimatedCost: 39000,
        timelineImpact: 75,
        contactDetails: 'DENC: 053 839 0000 | info@denc.gov.za',
      },
    ],
    airQualityPermits: {
      required: false,
      conditions: ['Dust control (important due to arid climate)', 'Mining area considerations'],
      authority: 'DENC Environmental Quality',
    },
    waterUseRestrictions: {
      level: 'High',
      description: 'Strict water conservation due to arid climate and water scarcity',
      restrictions: [
        'Mandatory water conservation plan',
        'No wastage of water resources',
        'Greywater reuse encouraged',
        'Borehole monitoring if groundwater used',
      ],
    },
    biodiversityProtection: {
      criticalBiodiversityAreas: true,
      protectedSpecies: [
        'Karoo endemic succulents',
        'Riverine Rabbit (critically endangered)',
        'Black Harrier',
        'Nama-Karoo flora',
      ],
      additionalAssessments: [
        'Karoo biome specialist assessment',
        'Succulent specialist study (if applicable)',
        'Paleontological assessment (fossil-rich areas)',
      ],
    },
    wastePermitThresholds: {
      dailyWasteLimit: 1000,
      permitCost: 6000,
    },
  },
};

/**
 * Get province-specific environmental requirements
 */
export function getProvincialRequirements(province: string): ProvincialRegulation | null {
  return provincialRegulations[province] || null;
}

/**
 * Assess provincial compliance and identify additional requirements
 */
export function assessProvincialCompliance(
  province: string,
  projectParams: {
    projectType: string;
    siteArea: number;
    buildingFootprint: number;
    isCoastal?: boolean;
    inCBA?: boolean; // Critical Biodiversity Area
    dailyWasteGeneration?: number; // kg/day
  }
): {
  provincialRequirements: ProvincialRegulation['specificRequirements'];
  triggeredRequirements: ProvincialRegulation['specificRequirements'];
  additionalCosts: number;
  additionalTimelineImpact: number;
  airQualityCompliance: ProvincialRegulation['airQualityPermits'];
  waterRestrictions: ProvincialRegulation['waterUseRestrictions'];
  biodiversityRequirements: ProvincialRegulation['biodiversityProtection'];
  wastePermitRequired: boolean;
} {
  const provincialReg = getProvincialRequirements(province);
  
  if (!provincialReg) {
    // Return default/empty requirements if province not found
    return {
      provincialRequirements: [],
      triggeredRequirements: [],
      additionalCosts: 0,
      additionalTimelineImpact: 0,
      airQualityCompliance: { required: false, conditions: [], authority: 'N/A' },
      waterRestrictions: { level: 'Low', description: 'Standard restrictions apply', restrictions: [] },
      biodiversityRequirements: { 
        criticalBiodiversityAreas: false, 
        protectedSpecies: [], 
        additionalAssessments: [] 
      },
      wastePermitRequired: false,
    };
  }
  
  // Determine which requirements are triggered
  const triggered: ProvincialRegulation['specificRequirements'] = [];
  let additionalCosts = 0;
  let additionalTimelineImpact = 0;
  
  provincialReg.specificRequirements.forEach(req => {
    let isTriggered = false;
    
    // Check trigger conditions
    if (req.triggerCondition.includes('All projects') && projectParams.siteArea > 1000) {
      isTriggered = true;
    }
    if (req.triggerCondition.includes('coastal') && projectParams.isCoastal) {
      isTriggered = true;
    }
    if (req.triggerCondition.includes('CBA') && projectParams.inCBA) {
      isTriggered = true;
    }
    if (req.triggerCondition.includes('> 5000m²') && projectParams.buildingFootprint > 5000) {
      isTriggered = true;
    }
    
    if (isTriggered) {
      triggered.push(req);
      additionalCosts += req.estimatedCost;
      additionalTimelineImpact = Math.max(additionalTimelineImpact, req.timelineImpact);
    }
  });
  
  // Check waste permit requirements
  const dailyWaste = projectParams.dailyWasteGeneration || 0;
  const wastePermitRequired = dailyWaste > provincialReg.wastePermitThresholds.dailyWasteLimit;
  
  if (wastePermitRequired) {
    additionalCosts += provincialReg.wastePermitThresholds.permitCost;
    additionalTimelineImpact = Math.max(additionalTimelineImpact, 45);
  }
  
  return {
    provincialRequirements: provincialReg.specificRequirements,
    triggeredRequirements: triggered,
    additionalCosts,
    additionalTimelineImpact,
    airQualityCompliance: provincialReg.airQualityPermits,
    waterRestrictions: provincialReg.waterUseRestrictions,
    biodiversityRequirements: provincialReg.biodiversityProtection,
    wastePermitRequired,
  };
}

/**
 * Screen project for NEMA compliance based on project parameters and BOQ items
 */
export function screenNEMACompliance(projectParams: {
  projectType: string;
  siteArea: number; // m²
  buildingFootprint: number; // m²
  excavationVolume?: number; // m³
  isProtectedArea?: boolean;
  isUrbanArea?: boolean;
  hasWatercourse?: boolean;
  watercourseDistance?: number; // meters
  hasHeritageProximity?: boolean;
  requiresRezoning?: boolean;
  province: string;
}): {
  triggeredActivities: NEMAActivity[];
  authorizationRequired: boolean;
  overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedTimeframe: number;
  estimatedCost: number;
} {
  const triggered: NEMAActivity[] = [];
  
  // Check site clearance
  const clearanceArea = projectParams.buildingFootprint * 1.5; // Assume 50% additional clearance
  if (projectParams.isProtectedArea && clearanceArea > 300) {
    triggered.push(nemaListedActivities['site_clearance_large']);
  } else if (!projectParams.isUrbanArea && clearanceArea > 10000) {
    triggered.push(nemaListedActivities['site_clearance_large']);
  }
  
  // Check excavation volumes
  if (projectParams.excavationVolume && projectParams.excavationVolume > 10000 && !projectParams.isUrbanArea) {
    triggered.push(nemaListedActivities['earthworks_large']);
  } else if (projectParams.excavationVolume && projectParams.excavationVolume > 5000) {
    triggered.push(nemaListedActivities['bulk_earthworks']);
  }
  
  // Check watercourse proximity
  if (projectParams.hasWatercourse && projectParams.watercourseDistance && projectParams.watercourseDistance < 32) {
    triggered.push(nemaListedActivities['development_watercourse']);
  }
  
  // Check heritage proximity
  if (projectParams.hasHeritageProximity) {
    triggered.push(nemaListedActivities['heritage_proximity']);
  }
  
  // Check rezoning
  if (projectParams.requiresRezoning) {
    triggered.push(nemaListedActivities['rezoning']);
  }
  
  // Calculate overall risk
  let overallRisk: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (triggered.some(a => a.authorizationType === 'EIA')) {
    overallRisk = 'Critical';
  } else if (triggered.some(a => a.authorizationType === 'Basic Assessment')) {
    overallRisk = 'High';
  } else if (triggered.length > 0) {
    overallRisk = 'Medium';
  }
  
  // Calculate timeline (worst case - longest authorization)
  const timeframes = triggered.map(a => parseInt(a.estimatedTimeframe));
  const estimatedTimeframe = timeframes.length > 0 ? Math.max(...timeframes) : 0;
  
  // Estimate costs (Basic Assessment ~R50k-150k, EIA ~R200k-500k)
  const estimatedCost = triggered.reduce((total, activity) => {
    if (activity.authorizationType === 'EIA') return total + 350000;
    if (activity.authorizationType === 'Basic Assessment') return total + 100000;
    return total + 25000;
  }, 0);
  
  return {
    triggeredActivities: triggered,
    authorizationRequired: triggered.length > 0,
    overallRisk,
    estimatedTimeframe,
    estimatedCost,
  };
}

/**
 * Calculate construction waste based on BOQ items
 */
export function calculateConstructionWaste(
  pricedItems: any[],
  buildingArea: number,
  province: string
): WasteEstimate[] {
  const wasteEstimates: WasteEstimate[] = [];
  
  let totalConcreteVolume = 0;
  let totalSteelWeight = 0;
  let totalBrickCount = 0;
  let totalTimberVolume = 0;
  
  // Parse BOQ items to extract material quantities
  pricedItems.forEach(item => {
    const desc = (item.description || '').toLowerCase();
    const qty = parseFloat(item.quantity) || 0;
    const unit = (item.unit || '').toLowerCase();
    
    // Concrete
    if (desc.includes('concrete') && (unit.includes('m³') || unit.includes('m3'))) {
      totalConcreteVolume += qty;
    }
    
    // Steel
    if ((desc.includes('steel') || desc.includes('reinforcement') || desc.includes('rebar')) && 
        (unit.includes('kg') || unit.includes('ton'))) {
      const weight = unit.includes('ton') ? qty * 1000 : qty;
      totalSteelWeight += weight;
    }
    
    // Bricks
    if (desc.includes('brick') && (unit === 'nr' || unit === 'no')) {
      totalBrickCount += qty;
    }
    
    // Timber
    if (desc.includes('timber') && (unit.includes('m³') || unit.includes('m3'))) {
      totalTimberVolume += qty;
    }
  });
  
  // Calculate concrete waste
  if (totalConcreteVolume > 0) {
    const wasteVolume = totalConcreteVolume * wasteCoefficients.concrete_waste.percentage;
    wasteEstimates.push({
      category: 'Concrete & Masonry Waste',
      estimatedVolume: wasteVolume,
      unit: 'm³',
      recyclingPotential: wasteCoefficients.concrete_waste.recyclingPotential * 100,
      disposalMethod: 'Recycling',
      licensedContractors: licensedWasteContractors[province] || licensedWasteContractors['GP'],
      estimatedCost: wasteVolume * wasteCoefficients.concrete_waste.costPerM3,
      sawicClassification: wasteCoefficients.concrete_waste.sawicCode,
    });
  }
  
  // Calculate steel waste
  if (totalSteelWeight > 0) {
    const wasteWeight = totalSteelWeight * wasteCoefficients.steel_waste.percentage;
    wasteEstimates.push({
      category: 'Steel & Metal Waste',
      estimatedVolume: wasteWeight,
      unit: 'kg',
      recyclingPotential: wasteCoefficients.steel_waste.recyclingPotential * 100,
      disposalMethod: 'Recycling',
      licensedContractors: licensedWasteContractors[province] || licensedWasteContractors['GP'],
      estimatedCost: wasteWeight * wasteCoefficients.steel_waste.costPerKg,
      sawicClassification: wasteCoefficients.steel_waste.sawicCode,
    });
  }
  
  // Calculate timber waste
  if (totalTimberVolume > 0) {
    const wasteVolume = totalTimberVolume * wasteCoefficients.timber_waste.percentage;
    wasteEstimates.push({
      category: 'Timber & Wood Waste',
      estimatedVolume: wasteVolume,
      unit: 'm³',
      recyclingPotential: wasteCoefficients.timber_waste.recyclingPotential * 100,
      disposalMethod: 'Recycling',
      licensedContractors: licensedWasteContractors[province] || licensedWasteContractors['GP'],
      estimatedCost: wasteVolume * wasteCoefficients.timber_waste.costPerM3,
      sawicClassification: wasteCoefficients.timber_waste.sawicCode,
    });
  }
  
  // General construction waste (based on building area)
  if (buildingArea > 0) {
    const generalWasteKg = buildingArea * wasteCoefficients.general_construction_waste.kgPerM2;
    wasteEstimates.push({
      category: 'General Construction Waste',
      estimatedVolume: generalWasteKg,
      unit: 'kg',
      recyclingPotential: wasteCoefficients.general_construction_waste.recyclingPotential * 100,
      disposalMethod: 'Landfill',
      licensedContractors: licensedWasteContractors[province] || licensedWasteContractors['GP'],
      estimatedCost: generalWasteKg * wasteCoefficients.general_construction_waste.costPerKg,
      sawicClassification: wasteCoefficients.general_construction_waste.sawicCode,
    });
  }
  
  // Hazardous waste (paints, solvents)
  if (buildingArea > 0) {
    const hazardousWasteKg = buildingArea * wasteCoefficients.hazardous_waste.kgPerM2;
    wasteEstimates.push({
      category: 'Hazardous Waste (Paints, Solvents)',
      estimatedVolume: hazardousWasteKg,
      unit: 'kg',
      recyclingPotential: wasteCoefficients.hazardous_waste.recyclingPotential * 100,
      disposalMethod: 'Special Treatment',
      licensedContractors: licensedWasteContractors[province] || licensedWasteContractors['GP'],
      estimatedCost: hazardousWasteKg * wasteCoefficients.hazardous_waste.costPerKg,
      sawicClassification: wasteCoefficients.hazardous_waste.sawicCode,
    });
  }
  
  // Excavation soil (if excavation volume provided)
  const excavationItem = pricedItems.find(item => 
    (item.description || '').toLowerCase().includes('excavat')
  );
  if (excavationItem) {
    const excavationVolume = parseFloat(excavationItem.quantity) || 0;
    if (excavationVolume > 0) {
      const excessSoil = excavationVolume * wasteCoefficients.excavation_soil.percentage;
      wasteEstimates.push({
        category: 'Excavated Soil (Excess)',
        estimatedVolume: excessSoil,
        unit: 'm³',
        recyclingPotential: wasteCoefficients.excavation_soil.recyclingPotential * 100,
        disposalMethod: 'Reuse',
        licensedContractors: licensedWasteContractors[province] || licensedWasteContractors['GP'],
        estimatedCost: excessSoil * wasteCoefficients.excavation_soil.costPerM3,
        sawicClassification: wasteCoefficients.excavation_soil.sawicCode,
      });
    }
  }
  
  return wasteEstimates;
}

/**
 * Generate comprehensive environmental compliance status
 */
export function assessEnvironmentalCompliance(
  projectParams: any,
  pricedItems: any[]
): ComplianceStatus {
  // Screen NEMA compliance
  const nemaScreening = screenNEMACompliance(projectParams);
  
  // Calculate waste
  const wasteEstimates = calculateConstructionWaste(
    pricedItems,
    projectParams.buildingFootprint || projectParams.siteArea || 0,
    projectParams.province || 'GP'
  );
  
  // Identify environmental risks
  const environmentalRisks: EnvironmentalRisk[] = [];
  
  // NEMA risks
  nemaScreening.triggeredActivities.forEach(activity => {
    environmentalRisks.push({
      level: activity.authorizationType === 'EIA' ? 'Critical' : 
             activity.authorizationType === 'Basic Assessment' ? 'High' : 'Medium',
      category: 'NEMA',
      description: activity.description,
      mitigation: `Apply for ${activity.authorizationType} with ${activity.competentAuthority}`,
      authorizationRequired: true,
      estimatedCost: activity.authorizationType === 'EIA' ? 350000 : 100000,
      timelineImpact: parseInt(activity.estimatedTimeframe),
    });
  });
  
  // Waste management risks
  const totalWasteCost = wasteEstimates.reduce((sum, w) => sum + w.estimatedCost, 0);
  if (totalWasteCost > 50000) {
    environmentalRisks.push({
      level: 'Medium',
      category: 'Waste',
      description: `High waste disposal costs (R${totalWasteCost.toLocaleString()})`,
      mitigation: 'Implement waste minimization plan and recycling program',
      authorizationRequired: false,
      estimatedCost: totalWasteCost * -0.3, // 30% potential savings
    });
  }
  
  // Calculate compliance score (0-100)
  let complianceScore = 100;
  complianceScore -= nemaScreening.triggeredActivities.length * 15; // -15 per NEMA trigger
  complianceScore -= environmentalRisks.filter(r => r.level === 'Critical').length * 20;
  complianceScore -= environmentalRisks.filter(r => r.level === 'High').length * 10;
  complianceScore = Math.max(0, complianceScore);
  
  // Generate recommended actions
  const recommendedActions: string[] = [];
  if (nemaScreening.authorizationRequired) {
    recommendedActions.push('Engage environmental consultant for authorization applications');
    recommendedActions.push(`Budget R${nemaScreening.estimatedCost.toLocaleString()} for environmental approvals`);
    recommendedActions.push(`Add ${nemaScreening.estimatedTimeframe} days to project timeline for authorizations`);
  }
  if (wasteEstimates.length > 0) {
    recommendedActions.push('Appoint licensed waste contractor before construction starts');
    recommendedActions.push('Develop site-specific Waste Management Plan');
    recommendedActions.push('Target 60% waste recycling/reuse rate to minimize disposal costs');
  }
  if (projectParams.hasWatercourse) {
    recommendedActions.push('Apply for Water Use License (DWS) if within riparian zone');
  }
  if (projectParams.hasHeritageProximity) {
    recommendedActions.push('Obtain Heritage Impact Assessment from accredited specialist');
  }
  
  return {
    overallRisk: nemaScreening.overallRisk,
    nemaCompliant: !nemaScreening.authorizationRequired,
    wasteCompliant: wasteEstimates.length > 0, // Has waste plan
    authorizationsRequired: nemaScreening.triggeredActivities,
    environmentalRisks,
    wasteEstimates,
    complianceScore,
    estimatedComplianceCost: nemaScreening.estimatedCost + totalWasteCost,
    estimatedTimelineDelay: nemaScreening.estimatedTimeframe,
    recommendedActions,
  };
}

/**
 * Generate Environmental Management Plan (EMP) template
 */
export function generateEMPTemplate(projectParams: any, complianceStatus: ComplianceStatus): string {
  return `
# ENVIRONMENTAL MANAGEMENT PLAN (EMP)
## ${projectParams.projectName || 'Construction Project'}

**Project Location:** ${projectParams.municipality || 'N/A'}, ${projectParams.province || 'N/A'}
**Site Area:** ${projectParams.siteArea || 'N/A'} m²
**Building Footprint:** ${projectParams.buildingFootprint || 'N/A'} m²

---

## 1. ENVIRONMENTAL LEGISLATION COMPLIANCE

### NEMA Authorization Status:
${complianceStatus.nemaCompliant ? 
  '✅ No NEMA authorizations required (exempt activities)' : 
  `⚠️ NEMA authorizations required:\n${complianceStatus.authorizationsRequired.map(a => 
    `- ${a.description} (${a.authorizationType})`
  ).join('\n')}`
}

### Waste Management Compliance:
- Waste Act (Act 59 of 2008) applies
- Total estimated waste: ${complianceStatus.wasteEstimates.reduce((sum, w) => 
  sum + w.estimatedVolume, 0).toFixed(2)} ${complianceStatus.wasteEstimates[0]?.unit || 'units'}
- Licensed waste contractor appointed: [CONTRACTOR NAME]
- SAWIC reporting required: ${complianceStatus.wasteEstimates.length > 0 ? 'YES' : 'NO'}

---

## 2. ENVIRONMENTAL RISKS & MITIGATION

${complianceStatus.environmentalRisks.map((risk, idx) => `
### Risk ${idx + 1}: ${risk.category} - ${risk.level} Priority
**Description:** ${risk.description}
**Mitigation:** ${risk.mitigation}
**Responsible Party:** Site Agent / Environmental Officer
**Monitoring Frequency:** ${risk.level === 'Critical' ? 'Daily' : risk.level === 'High' ? 'Weekly' : 'Monthly'}
`).join('\n')}

---

## 3. WASTE MANAGEMENT PLAN

${complianceStatus.wasteEstimates.map(waste => `
### ${waste.category}
- **Estimated Volume:** ${waste.estimatedVolume.toFixed(2)} ${waste.unit}
- **Recycling Potential:** ${waste.recyclingPotential.toFixed(0)}%
- **Disposal Method:** ${waste.disposalMethod}
- **SAWIC Code:** ${waste.sawicClassification || 'N/A'}
- **Licensed Contractors:** ${waste.licensedContractors.slice(0, 2).join(', ')}
`).join('\n')}

**Total Waste Disposal Cost:** R${complianceStatus.wasteEstimates.reduce((sum, w) => 
  sum + w.estimatedCost, 0).toLocaleString()}

---

## 4. ROLES & RESPONSIBILITIES

| Role | Responsibility | Contact |
|------|---------------|---------|
| **Site Agent** | Overall EMP implementation | [NAME] |
| **Environmental Officer** | Daily monitoring & compliance | [NAME] |
| **Waste Contractor** | Waste removal & recycling | [COMPANY] |
| **Environmental Consultant** | Audits & reporting | [COMPANY] |

---

## 5. MONITORING & REPORTING

- **Weekly:** Site inspections (water, dust, waste management)
- **Monthly:** Compliance report to Project Manager
- **Quarterly:** Environmental audit (if NEMA authorization required)
- **Final:** Rehabilitation completion certificate

---

## 6. EMERGENCY RESPONSE

- **Spills:** Spill kits located at [LOCATION]
- **Fire:** Fire extinguishers at [LOCATIONS]
- **Emergency Contacts:** 
  - Fire: 10177
  - Ambulance: 10177
  - Provincial Environmental Hotline: [NUMBER]

---

**Generated by Qilly Environmental Compliance Module**
**Date:** ${new Date().toLocaleDateString('en-ZA')}
**Compliance Score:** ${complianceStatus.complianceScore}/100
`;
}