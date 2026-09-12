import type { RegionalPricedBillItem } from './regionalPricingEngine';

/**
 * QILLY ANTI-COLLUSION DETECTION SYSTEM
 * 
 * Detects potential bid rigging and collusive behavior in construction tenders
 * Based on South African Competition Act guidelines and international best practices
 * 
 * Detection Methods:
 * 1. Price Similarity Analysis - Statistical comparison of bid prices
 * 2. Pattern Recognition - Rotating winners, consistent margins
 * 3. Supplier Concentration - Unusual supplier clustering
 * 4. Bid Withdrawal Patterns - Coordinated withdrawals
 * 5. Geographic Analysis - Unnatural bid distribution
 */

export interface HistoricalSubmission {
  id: string;
  contractorName: string;
  contractorId: string;
  submissionDate: Date;
  tenderReference: string;
  totalPrice: number;
  items: {
    code: string;
    name: string;
    unitPrice: number;
    quantity: number;
    supplier: string;
  }[];
  province: string;
  municipality: string;
  won: boolean;
}

export interface CollusionRiskScore {
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskPercentage: number;
  flags: CollusionFlag[];
  detailedAnalysis: {
    priceSimilarity: PriceSimilarityAnalysis;
    patternRecognition: PatternAnalysis;
    supplierConcentration: SupplierAnalysis;
    recommendations: string[];
  };
}

export interface CollusionFlag {
  severity: 'INFO' | 'WARNING' | 'DANGER' | 'CRITICAL';
  category: 'PRICE' | 'PATTERN' | 'SUPPLIER' | 'GEOGRAPHIC' | 'TIMING';
  title: string;
  description: string;
  evidence: string[];
  regulatoryReference?: string;
}

interface PriceSimilarityAnalysis {
  identicalPrices: number;
  nearIdenticalPrices: number; // Within 0.5%
  suspiciousPatterns: number;
  averageDeviation: number;
  standardDeviation: number;
}

interface PatternAnalysis {
  rotatingWinners: boolean;
  consistentMargins: boolean;
  coordinatedBidding: boolean;
  suspiciousWithdrawals: number;
}

interface SupplierAnalysis {
  uniqueSuppliers: number;
  sharedSuppliers: number;
  concentrationIndex: number; // 0-100, higher = more concentrated
  unusualClustering: boolean;
}

// Mock historical database (In production, this would come from a database)
const MOCK_HISTORICAL_SUBMISSIONS: HistoricalSubmission[] = [
  {
    id: 'HIST-001',
    contractorName: 'BuildCo SA',
    contractorId: 'BC-001',
    submissionDate: new Date('2026-02-15'),
    tenderReference: 'DHS-2026-045',
    totalPrice: 298450.00,
    items: [
      { code: '001', name: 'Cement 42.5N', unitPrice: 85.50, quantity: 200, supplier: 'PPC Cement' },
      { code: '002', name: 'Concrete 30MPa', unitPrice: 1250.00, quantity: 50, supplier: 'AfriSam' },
    ],
    province: 'GP',
    municipality: 'Johannesburg',
    won: true
  },
  {
    id: 'HIST-002',
    contractorName: 'MegaConstruct',
    contractorId: 'MC-002',
    submissionDate: new Date('2026-02-16'),
    tenderReference: 'DHS-2026-045',
    totalPrice: 298750.00, // Very close to BuildCo
    items: [
      { code: '001', name: 'Cement 42.5N', unitPrice: 85.50, quantity: 200, supplier: 'PPC Cement' },
      { code: '002', name: 'Concrete 30MPa', unitPrice: 1252.00, quantity: 50, supplier: 'AfriSam' },
    ],
    province: 'GP',
    municipality: 'Johannesburg',
    won: false
  },
  {
    id: 'HIST-003',
    contractorName: 'ProBuild Ltd',
    contractorId: 'PB-003',
    submissionDate: new Date('2026-02-16'),
    tenderReference: 'DHS-2026-045',
    totalPrice: 299100.00, // Suspiciously similar
    items: [
      { code: '001', name: 'Cement 42.5N', unitPrice: 85.50, quantity: 200, supplier: 'PPC Cement' },
      { code: '002', name: 'Concrete 30MPa', unitPrice: 1253.50, quantity: 50, supplier: 'AfriSam' },
    ],
    province: 'GP',
    municipality: 'Johannesburg',
    won: false
  },
  {
    id: 'HIST-004',
    contractorName: 'BuildCo SA',
    contractorId: 'BC-001',
    submissionDate: new Date('2026-01-20'),
    tenderReference: 'DHS-2026-032',
    totalPrice: 425300.00,
    items: [],
    province: 'GP',
    municipality: 'Pretoria',
    won: false
  },
  {
    id: 'HIST-005',
    contractorName: 'MegaConstruct',
    contractorId: 'MC-002',
    submissionDate: new Date('2026-01-21'),
    tenderReference: 'DHS-2026-032',
    totalPrice: 423800.00,
    items: [],
    province: 'GP',
    municipality: 'Pretoria',
    won: true
  },
];

/**
 * Analyzes current BOQ submission against historical data to detect collusion
 */
export function analyzeCollusionRisk(
  currentItems: RegionalPricedBillItem[],
  currentTotalPrice: number,
  projectSettings: {
    province?: string;
    municipality?: string;
  },
  contractorId?: string
): CollusionRiskScore {
  const flags: CollusionFlag[] = [];
  
  // Get relevant historical submissions (same region, recent)
  const relevantHistory = MOCK_HISTORICAL_SUBMISSIONS.filter(h => 
    h.province === (projectSettings.province || 'GP') &&
    // Last 6 months
    h.submissionDate > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
  );

  // 1. PRICE SIMILARITY ANALYSIS
  const priceSimilarity = analyzePriceSimilarity(currentTotalPrice, relevantHistory);
  
  if (priceSimilarity.identicalPrices > 0) {
    flags.push({
      severity: 'CRITICAL',
      category: 'PRICE',
      title: 'Identical Pricing Detected',
      description: `Your total price matches ${priceSimilarity.identicalPrices} other submission(s) exactly.`,
      evidence: [
        'Identical total prices are statistically improbable in competitive bidding',
        'May indicate price-sharing or coordinated bidding',
        'Violation of Competition Act 89 of 1998, Section 4(1)(b)'
      ],
      regulatoryReference: 'Competition Act 89 of 1998 - Section 4(1)(b) - Collusive Tendering'
    });
  }

  if (priceSimilarity.nearIdenticalPrices > 2) {
    flags.push({
      severity: 'DANGER',
      category: 'PRICE',
      title: 'Suspiciously Similar Pricing',
      description: `${priceSimilarity.nearIdenticalPrices} submissions within 0.5% of each other.`,
      evidence: [
        `Prices clustered within R${(currentTotalPrice * 0.005).toFixed(2)} range`,
        'Natural competitive variation typically 3-8% for construction',
        'Pattern suggests possible price coordination'
      ],
      regulatoryReference: 'Competition Commission Guidelines - Bid Rigging Red Flags'
    });
  }

  // 2. PATTERN RECOGNITION
  const patterns = analyzePatterns(relevantHistory, contractorId);
  
  if (patterns.rotatingWinners) {
    flags.push({
      severity: 'WARNING',
      category: 'PATTERN',
      title: 'Rotating Winner Pattern',
      description: 'Historical data shows alternating winners among same contractors.',
      evidence: [
        'BuildCo won DHS-2026-045, MegaConstruct won DHS-2026-032',
        'Regular rotation suggests market allocation',
        'Classic bid rigging indicator'
      ],
      regulatoryReference: 'OECD Guidelines - Detecting Bid Rigging in Public Procurement'
    });
  }

  if (patterns.consistentMargins) {
    flags.push({
      severity: 'WARNING',
      category: 'PATTERN',
      title: 'Consistent Bid Margins',
      description: 'Losing bids consistently higher by similar percentage.',
      evidence: [
        'Non-winning bids average 0.8-1.2% above winning bid',
        'Suggests "cover bidding" - bids designed to lose',
        'Indicates coordinated pricing to maintain appearance of competition'
      ]
    });
  }

  // 3. SUPPLIER CONCENTRATION ANALYSIS
  const supplierAnalysis = analyzeSupplierConcentration(currentItems, relevantHistory);
  
  if (supplierAnalysis.concentrationIndex > 75) {
    flags.push({
      severity: 'WARNING',
      category: 'SUPPLIER',
      title: 'High Supplier Concentration',
      description: `${supplierAnalysis.concentrationIndex}% of bids use same ${supplierAnalysis.sharedSuppliers} suppliers.`,
      evidence: [
        `All contractors using PPC Cement and AfriSam`,
        'May indicate supplier-led collusion or information sharing',
        'Reduces genuine price competition'
      ]
    });
  }

  if (supplierAnalysis.unusualClustering) {
    flags.push({
      severity: 'INFO',
      category: 'SUPPLIER',
      title: 'Identical Supplier Selection',
      description: 'Multiple contractors selected identical suppliers for all items.',
      evidence: [
        'Could indicate shared procurement information',
        'May be legitimate (limited suppliers in region)',
        'Monitor for price uniformity'
      ]
    });
  }

  // 4. GEOGRAPHIC ANALYSIS
  const geographicFlags = analyzeGeographicPatterns(relevantHistory, projectSettings);
  flags.push(...geographicFlags);

  // 5. TIMING ANALYSIS
  const timingFlags = analyzeSubmissionTiming(relevantHistory);
  flags.push(...timingFlags);

  // Calculate overall risk score
  const riskPercentage = calculateRiskPercentage(flags);
  const overallRisk = getRiskLevel(riskPercentage);

  // Generate recommendations
  const recommendations = generateRecommendations(flags, overallRisk);

  return {
    overallRisk,
    riskPercentage,
    flags,
    detailedAnalysis: {
      priceSimilarity,
      patternRecognition: patterns,
      supplierConcentration: supplierAnalysis,
      recommendations
    }
  };
}

function analyzePriceSimilarity(
  currentPrice: number,
  history: HistoricalSubmission[]
): PriceSimilarityAnalysis {
  const prices = history.map(h => h.totalPrice);
  
  let identicalPrices = 0;
  let nearIdenticalPrices = 0;
  
  prices.forEach(price => {
    if (Math.abs(price - currentPrice) < 0.01) {
      identicalPrices++;
    } else if (Math.abs(price - currentPrice) / currentPrice < 0.005) {
      nearIdenticalPrices++;
    }
  });

  // Calculate statistical measures
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const squaredDiffs = prices.map(p => Math.pow(p - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / prices.length;
  const standardDeviation = Math.sqrt(variance);
  const averageDeviation = (standardDeviation / mean) * 100;

  const suspiciousPatterns = nearIdenticalPrices >= 3 ? 1 : 0;

  return {
    identicalPrices,
    nearIdenticalPrices,
    suspiciousPatterns,
    averageDeviation,
    standardDeviation
  };
}

function analyzePatterns(
  history: HistoricalSubmission[],
  contractorId?: string
): PatternAnalysis {
  // Check for rotating winners
  const tenderGroups: Record<string, HistoricalSubmission[]> = {};
  history.forEach(h => {
    if (!tenderGroups[h.tenderReference]) {
      tenderGroups[h.tenderReference] = [];
    }
    tenderGroups[h.tenderReference].push(h);
  });

  const winners = Object.values(tenderGroups)
    .map(group => group.find(s => s.won)?.contractorId)
    .filter(Boolean);
  
  const uniqueWinners = new Set(winners);
  const rotatingWinners = uniqueWinners.size >= 2 && winners.length >= 3;

  // Check for consistent margins
  let marginSum = 0;
  let marginCount = 0;
  
  Object.values(tenderGroups).forEach(group => {
    const winner = group.find(s => s.won);
    if (winner) {
      group.filter(s => !s.won).forEach(loser => {
        const margin = ((loser.totalPrice - winner.totalPrice) / winner.totalPrice) * 100;
        marginSum += margin;
        marginCount++;
      });
    }
  });

  const averageMargin = marginCount > 0 ? marginSum / marginCount : 0;
  const consistentMargins = averageMargin > 0.5 && averageMargin < 2.0 && marginCount >= 3;

  // Simplified coordinated bidding check
  const coordinatedBidding = rotatingWinners && consistentMargins;

  return {
    rotatingWinners,
    consistentMargins,
    coordinatedBidding,
    suspiciousWithdrawals: 0 // Would track bid withdrawals in production
  };
}

function analyzeSupplierConcentration(
  currentItems: RegionalPricedBillItem[],
  history: HistoricalSubmission[]
): SupplierAnalysis {
  const currentSuppliers = new Set(currentItems.map(i => i.selectedSupplier));
  
  // Get all suppliers from history
  const historicalSuppliers = new Set<string>();
  history.forEach(h => {
    h.items.forEach(item => historicalSuppliers.add(item.supplier));
  });

  // Count shared suppliers
  const sharedSuppliers = [...currentSuppliers].filter(s => historicalSuppliers.has(s)).length;
  const uniqueSuppliers = new Set([...currentSuppliers, ...historicalSuppliers]).size;

  // Calculate concentration index (0-100)
  const concentrationIndex = uniqueSuppliers > 0 
    ? Math.round((sharedSuppliers / uniqueSuppliers) * 100)
    : 0;

  // Check for unusual clustering (all contractors using same suppliers)
  const unusualClustering = sharedSuppliers === currentSuppliers.size && currentSuppliers.size >= 3;

  return {
    uniqueSuppliers,
    sharedSuppliers,
    concentrationIndex,
    unusualClustering
  };
}

function analyzeGeographicPatterns(
  history: HistoricalSubmission[],
  projectSettings: { province?: string; municipality?: string }
): CollusionFlag[] {
  const flags: CollusionFlag[] = [];

  // Check for unusual geographic concentration
  const sameMunicipality = history.filter(
    h => h.municipality === projectSettings.municipality
  ).length;

  if (sameMunicipality >= 5 && history.length >= 5) {
    flags.push({
      severity: 'INFO',
      category: 'GEOGRAPHIC',
      title: 'Geographic Market Concentration',
      description: `${sameMunicipality} recent submissions in ${projectSettings.municipality}.`,
      evidence: [
        'High concentration may indicate local market allocation',
        'Could be natural (limited contractors in area)',
        'Monitor for price consistency across submissions'
      ]
    });
  }

  return flags;
}

function analyzeSubmissionTiming(history: HistoricalSubmission[]): CollusionFlag[] {
  const flags: CollusionFlag[] = [];

  // Group by tender reference
  const tenderGroups: Record<string, HistoricalSubmission[]> = {};
  history.forEach(h => {
    if (!tenderGroups[h.tenderReference]) {
      tenderGroups[h.tenderReference] = [];
    }
    tenderGroups[h.tenderReference].push(h);
  });

  // Check for suspicious timing patterns
  Object.entries(tenderGroups).forEach(([tenderRef, submissions]) => {
    if (submissions.length < 2) return;

    const sortedByDate = [...submissions].sort(
      (a, b) => a.submissionDate.getTime() - b.submissionDate.getTime()
    );

    // Check if submissions within minutes of each other
    for (let i = 0; i < sortedByDate.length - 1; i++) {
      const timeDiff = Math.abs(
        sortedByDate[i + 1].submissionDate.getTime() - sortedByDate[i].submissionDate.getTime()
      );
      const minutesDiff = timeDiff / (1000 * 60);

      if (minutesDiff < 5) {
        flags.push({
          severity: 'WARNING',
          category: 'TIMING',
          title: 'Coordinated Submission Timing',
          description: `Multiple bids submitted within ${minutesDiff.toFixed(0)} minutes.`,
          evidence: [
            `${sortedByDate[i].contractorName} and ${sortedByDate[i + 1].contractorName}`,
            'Unusually close submission times may indicate coordination',
            'Could be coincidental but warrants monitoring'
          ]
        });
        break;
      }
    }
  });

  return flags;
}

function calculateRiskPercentage(flags: CollusionFlag[]): number {
  let score = 0;

  flags.forEach(flag => {
    switch (flag.severity) {
      case 'CRITICAL':
        score += 40;
        break;
      case 'DANGER':
        score += 25;
        break;
      case 'WARNING':
        score += 15;
        break;
      case 'INFO':
        score += 5;
        break;
    }
  });

  return Math.min(score, 100);
}

function getRiskLevel(percentage: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (percentage >= 75) return 'CRITICAL';
  if (percentage >= 50) return 'HIGH';
  if (percentage >= 25) return 'MEDIUM';
  return 'LOW';
}

function generateRecommendations(
  flags: CollusionFlag[],
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
): string[] {
  const recommendations: string[] = [];

  if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    recommendations.push(
      '⚠️ URGENT: Report to Competition Commission - High collusion risk detected',
      'Do not proceed with tender submission until investigation complete',
      'Preserve all pricing documentation and communication records',
      'Engage legal counsel for Competition Act compliance review'
    );
  }

  if (flags.some(f => f.category === 'PRICE' && f.severity === 'CRITICAL')) {
    recommendations.push(
      'Review pricing methodology - ensure independent calculation',
      'Verify no pricing information shared with competitors',
      'Document all supplier quotes and price sources'
    );
  }

  if (flags.some(f => f.category === 'PATTERN')) {
    recommendations.push(
      'Monitor future tender outcomes for rotating winner patterns',
      'Consider alternative suppliers to break concentration',
      'Report suspicious patterns to procurement authority'
    );
  }

  if (flags.some(f => f.category === 'SUPPLIER')) {
    recommendations.push(
      'Diversify supplier base to increase independence',
      'Verify suppliers are not sharing pricing information',
      'Request independent quotes from additional suppliers'
    );
  }

  if (riskLevel === 'LOW') {
    recommendations.push(
      '✓ No significant collusion indicators detected',
      'Continue monitoring for unusual patterns',
      'Maintain independent pricing methodology',
      'Document compliance with Competition Act requirements'
    );
  }

  if (riskLevel === 'MEDIUM') {
    recommendations.push(
      'Review flagged areas for potential compliance issues',
      'Consider additional price verification from independent sources',
      'Maintain detailed audit trail of pricing decisions'
    );
  }

  return recommendations;
}

/**
 * Generates a compliance report for regulatory submission
 */
export function generateCollusionComplianceReport(
  riskScore: CollusionRiskScore,
  contractorName: string
): string {
  let report = `ANTI-COLLUSION COMPLIANCE REPORT\n`;
  report += `Generated: ${new Date().toLocaleString('en-ZA')}\n`;
  report += `Contractor: ${contractorName}\n`;
  report += `\n`;
  report += `OVERALL RISK ASSESSMENT: ${riskScore.overallRisk} (${riskScore.riskPercentage}%)\n`;
  report += `\n`;
  report += `FLAGS DETECTED: ${riskScore.flags.length}\n`;
  report += `\n`;

  if (riskScore.flags.length > 0) {
    report += `DETAILED FLAGS:\n`;
    riskScore.flags.forEach((flag, i) => {
      report += `\n${i + 1}. [${flag.severity}] ${flag.title}\n`;
      report += `   Category: ${flag.category}\n`;
      report += `   ${flag.description}\n`;
      if (flag.regulatoryReference) {
        report += `   Legal Reference: ${flag.regulatoryReference}\n`;
      }
    });
  }

  report += `\n`;
  report += `RECOMMENDATIONS:\n`;
  riskScore.detailedAnalysis.recommendations.forEach((rec, i) => {
    report += `${i + 1}. ${rec}\n`;
  });

  report += `\n`;
  report += `---\n`;
  report += `This report is generated by Qilly Anti-Collusion Detection System\n`;
  report += `South African Competition Act 89 of 1998 Compliance\n`;

  return report;
}
