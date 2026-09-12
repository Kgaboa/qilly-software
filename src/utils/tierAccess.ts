/**
 * Tier Access Control
 * Centralized feature gating for subscription tiers
 * 
 * FREE TIER PHILOSOPHY:
 * - Training & Evaluation ONLY - not for production use
 * - Template-based learning (no custom uploads)
 * - All pricing amounts encrypted (R ●●●●●●)
 * - Structure visible but no real financial data
 * - Forces contractor approval + upgrade for real work
 */

export type SubscriptionTier = 'free' | 'professional' | 'enterprise' | 'custom';

export interface TierFeatures {
  // BOQ Processing
  boqQuota: number | null; // null = unlimited
  boqMode: 'training' | 'live'; // training = demo data, live = real pricing
  canUploadBOQ: boolean; // NEW: Allow custom BOQ upload (FREE tier = false, must use templates)
  
  // Templates
  templateCount: number;
  customTemplates: boolean;
  
  // Export
  pdfExport: boolean;
  pdfWatermark: boolean;
  excelExport: boolean;
  
  // Pricing & Suppliers
  realTimePricing: boolean;
  multiSupplierComparison: boolean;
  regionalPricing: boolean;
  futurePriceProjections: boolean;
  
  // Compliance
  complianceCalculator: boolean;
  complianceDocuments: boolean;
  advancedCompliance: boolean;
  pgCosts: boolean;
  
  // Green Building
  greenBuilding: boolean;
  carbonTracking: boolean;
  greenMaterials: boolean;
  environmentalDashboard: boolean;
  
  // Fraud Prevention
  collusionDetection: boolean;
  
  // Integrations
  eTenderIntegration: boolean;
  apiAccess: boolean;
  customIntegrations: boolean;
  
  // Documents
  tenderResponseGenerator: boolean;
  advancedDocuments: boolean;
  
  // Project Management
  projectHistory: number | null; // months, null = unlimited
  multiUser: number; // max users
  
  // Support
  supportLevel: 'email' | 'email-chat' | 'priority' | '24-7';
  
  // Advanced
  whiteLabel: boolean;
  multiCompany: boolean;
  onPremise: boolean;
  slaGuarantee: boolean;
}

export const TIER_FEATURES: Record<SubscriptionTier, TierFeatures> = {
  free: {
    // ===== BOQ PROCESSING =====
    boqQuota: null, // ✅ Unlimited training BOQs (templates only)
    boqMode: 'training', // ❌ Training mode only - no live supplier data
    canUploadBOQ: false, // ❌ BLOCKED: Must use pre-loaded templates, cannot upload custom Excel/CSV
    
    // ===== TEMPLATES =====
    templateCount: 5, // ✅ 5 BuildAid templates (1 per project type)
    customTemplates: false, // ❌ Cannot create custom templates
    
    // ===== EXPORT =====
    pdfExport: true, // ✅ Can export to PDF
    pdfWatermark: true, // ⚠️ PDF includes "TRAINING MODE" watermark
    excelExport: false, // ❌ No Excel export (PDF only)
    
    // ===== PRICING & SUPPLIERS =====
    realTimePricing: false, // ❌ ENCRYPTED: All prices show as "R ●●●●●●"
    multiSupplierComparison: false, // ❌ No supplier comparison
    regionalPricing: false, // ❌ No regional optimization
    futurePriceProjections: false, // ❌ No price forecasting
    
    // ===== COMPLIANCE =====
    complianceCalculator: true, // ⚠️ VIEW-ONLY: Structure visible, amounts encrypted "R ●●●●●●"
    complianceDocuments: false, // ❌ Cannot generate compliance documents
    advancedCompliance: false, // ❌ No advanced compliance features
    pgCosts: false, // ❌ ENCRYPTED: P&G costs show as "R ●●●●●●"
    
    // ===== GREEN BUILDING & CARBON =====
    greenBuilding: false, // ❌ No green building features
    carbonTracking: false, // ❌ No carbon tracking
    greenMaterials: false, // ❌ No green materials database
    environmentalDashboard: false, // ❌ No environmental dashboard
    
    // ===== FRAUD PREVENTION =====
    collusionDetection: false, // ❌ No collusion detection
    
    // ===== INTEGRATIONS =====
    eTenderIntegration: false, // ❌ No eTender integration
    apiAccess: false, // ❌ No API access
    customIntegrations: false, // ❌ No custom integrations
    
    // ===== DOCUMENTS =====
    tenderResponseGenerator: false, // ❌ No tender response generator
    advancedDocuments: false, // ❌ No advanced document generation
    
    // ===== PROJECT MANAGEMENT =====
    projectHistory: 0, // ❌ No project history saved (0 months retention)
    multiUser: 1, // ✅ Single user only
    
    // ===== SUPPORT =====
    supportLevel: 'email', // ✅ Email support only (no chat/phone)
    
    // ===== ENTERPRISE FEATURES =====
    whiteLabel: false, // ❌ No white labeling
    multiCompany: false, // ❌ Single company only
    onPremise: false, // ❌ No on-premise deployment
    slaGuarantee: false, // ❌ No SLA guarantee
  },
  
  professional: {
    boqQuota: 10,
    boqMode: 'live',
    canUploadBOQ: true, // NEW: Allow custom BOQ upload (FREE tier = false, must use templates)
    templateCount: 10,
    customTemplates: false,
    pdfExport: true,
    pdfWatermark: false,
    excelExport: true,
    realTimePricing: true,
    multiSupplierComparison: true,
    regionalPricing: true,
    futurePriceProjections: false,
    complianceCalculator: true,
    complianceDocuments: true,
    advancedCompliance: false,
    pgCosts: true,
    greenBuilding: false,
    carbonTracking: false,
    greenMaterials: false,
    environmentalDashboard: false, // ❌ LOCKED: Enterprise & Custom only
    collusionDetection: false,
    eTenderIntegration: false, // ❌ LOCKED: Enterprise & Custom only
    apiAccess: false,
    customIntegrations: false,
    tenderResponseGenerator: false, // ❌ LOCKED: Enterprise & Custom only (eTender Integration)
    advancedDocuments: false,
    projectHistory: 6,
    multiUser: 1,
    supportLevel: 'email-chat',
    whiteLabel: false,
    multiCompany: false,
    onPremise: false,
    slaGuarantee: false,
  },
  
  enterprise: {
    boqQuota: 30,
    boqMode: 'live',
    canUploadBOQ: true, // NEW: Allow custom BOQ upload (FREE tier = false, must use templates)
    templateCount: 15,
    customTemplates: false,
    pdfExport: true,
    pdfWatermark: false,
    excelExport: true,
    realTimePricing: true,
    multiSupplierComparison: true,
    regionalPricing: true,
    futurePriceProjections: true,
    complianceCalculator: true,
    complianceDocuments: true,
    advancedCompliance: true,
    pgCosts: true,
    greenBuilding: true,
    carbonTracking: true,
    greenMaterials: true,
    environmentalDashboard: true,
    collusionDetection: true,
    eTenderIntegration: true,
    apiAccess: true,
    customIntegrations: false,
    tenderResponseGenerator: true,
    advancedDocuments: true,
    projectHistory: null,
    multiUser: 5,
    supportLevel: 'priority',
    whiteLabel: false,
    multiCompany: false,
    onPremise: false,
    slaGuarantee: false,
  },
  
  custom: {
    boqQuota: null,
    boqMode: 'live',
    canUploadBOQ: true, // NEW: Allow custom BOQ upload (FREE tier = false, must use templates)
    templateCount: 999,
    customTemplates: true,
    pdfExport: true,
    pdfWatermark: false,
    excelExport: true,
    realTimePricing: true,
    multiSupplierComparison: true,
    regionalPricing: true,
    futurePriceProjections: true,
    complianceCalculator: true,
    complianceDocuments: true,
    advancedCompliance: true,
    pgCosts: true,
    greenBuilding: true,
    carbonTracking: true,
    greenMaterials: true,
    environmentalDashboard: true,
    collusionDetection: true,
    eTenderIntegration: true,
    apiAccess: true,
    customIntegrations: true,
    tenderResponseGenerator: true,
    advancedDocuments: true,
    projectHistory: null,
    multiUser: 999,
    supportLevel: '24-7',
    whiteLabel: true,
    multiCompany: true,
    onPremise: true,
    slaGuarantee: true,
  },
};

/**
 * Check if a tier has access to a specific feature
 */
export function hasFeatureAccess(
  tier: SubscriptionTier,
  feature: keyof TierFeatures
): boolean {
  // Normalize tier to lowercase for case-insensitive lookup
  const normalizedTier = tier.toLowerCase() as SubscriptionTier;
  const tierFeatures = TIER_FEATURES[normalizedTier];
  
  // Safety check: if tier features are undefined, deny access
  if (!tierFeatures) {
    console.warn(`Tier features not found for tier: ${tier} (normalized: ${normalizedTier})`);
    return false;
  }
  
  const featureValue = tierFeatures[feature];
  
  // Boolean features
  if (typeof featureValue === 'boolean') {
    return featureValue;
  }
  
  // Numeric features (quota, user count)
  if (typeof featureValue === 'number') {
    return featureValue > 0;
  }
  
  // String features (mode, support level)
  if (typeof featureValue === 'string') {
    return true; // Has some value
  }
  
  // null values (unlimited)
  return featureValue !== null;
}

/**
 * Get the tier features object
 */
export function getTierFeatures(tier: SubscriptionTier): TierFeatures {
  // Normalize tier to lowercase for case-insensitive lookup
  const normalizedTier = tier.toLowerCase() as SubscriptionTier;
  return TIER_FEATURES[normalizedTier];
}

/**
 * Get the minimum tier required for a feature
 */
export function getMinimumTierForFeature(
  feature: keyof TierFeatures
): SubscriptionTier {
  const tiers: SubscriptionTier[] = ['free', 'professional', 'enterprise', 'custom'];
  
  for (const tier of tiers) {
    if (hasFeatureAccess(tier, feature)) {
      return tier;
    }
  }
  
  return 'custom'; // Fallback to highest tier
}

/**
 * Get tier display name
 */
export function getTierDisplayName(tier: SubscriptionTier): string {
  const names: Record<SubscriptionTier, string> = {
    free: 'FREE',
    professional: 'PROFESSIONAL',
    enterprise: 'ENTERPRISE',
    custom: 'CUSTOM',
  };
  return names[tier];
}

/**
 * Get upgrade message for a feature
 */
export function getUpgradeMessage(
  currentTier: SubscriptionTier,
  feature: keyof TierFeatures
): string {
  const requiredTier = getMinimumTierForFeature(feature);
  const requiredTierName = getTierDisplayName(requiredTier);
  
  const featureNames: Partial<Record<keyof TierFeatures, string>> = {
    greenBuilding: 'Green Building & Carbon Tracking',
    futurePriceProjections: 'Future Price Projections',
    collusionDetection: 'Collusion Detection',
    eTenderIntegration: 'eTender Integration',
    excelExport: 'Excel Export',
    tenderResponseGenerator: 'Tender Response Generator',
    pgCosts: 'Preliminaries & General Costs',
    advancedCompliance: 'Advanced Compliance Documents',
  };
  
  const featureName = featureNames[feature] || feature;
  
  return `${featureName} is available in ${requiredTierName} tier and above. Upgrade to unlock this feature!`;
}