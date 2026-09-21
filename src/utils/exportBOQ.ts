import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { RegionalPricedBillItem } from './regionalPricingEngine';
import type { ComplianceCosts } from './complianceCalculations';
import { calculateProjectCarbonSummary, calculateItemCarbon } from './carbonTracking';
import type { SubscriptionTier } from './tierAccess';
import { getTierFeatures } from './tierAccess';
import { calculatePricingCompleteness } from './pricingStrategyV2';

interface ExportOptions {
  pricedItems: RegionalPricedBillItem[];
  projectSettings?: {
    province?: string;
    municipality?: string;
    profitMargin?: string;
    cidbGrading?: string;
    duration?: string;
    machineryType?: string;
  };
  grandTotal: number;
  totalTransportCost: number;
  totalSavings: number;
  inflationRate?: number; // Annual inflation rate percentage (e.g., 7.5 for 7.5%)
  complianceCosts?: ComplianceCosts; // Total compliance costs (NHBRC, CIDB, Statutory, Testing, BBBEE - excl. P&G)
  pgCosts?: number; // Preliminaries & General costs (site overhead, not compliance)
  includeGreenData?: boolean; // Include carbon tracking data in export
  contractorTier?: SubscriptionTier; // Subscription tier for watermarking
}

function getPricingStatus(item: RegionalPricedBillItem): string {
  if (item.matchingDecision?.reviewStatus) return item.matchingDecision.reviewStatus;
  switch (item.pricingRequirement) {
    case 'NON_PRICEABLE': return 'Not priced — structural row';
    case 'RATE_INPUT_REQUIRED': return 'Rate Input Required';
    case 'PERCENTAGE_BASE_REQUIRED': return 'Percentage Base Required';
    case 'ALLOWANCE_REQUIRED': return 'Allowance Required';
    case 'SUPPLIER_MATCH_REQUIRED': return 'Pricing Required';
    case 'PRICED': return 'ACCEPTED';
    default:
      return parseFloat(item.totalPrice || '0') > 0 ? 'ACCEPTED' : 'Pricing Required';
  }
}

function getPricingStatusCounts(items: RegionalPricedBillItem[]): Array<[string, number]> {
  const counts = new Map<string, number>();
  items.forEach(item => {
    const status = getPricingStatus(item);
    counts.set(status, (counts.get(status) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

/**
 * Export priced BOQ to Excel format
 */
export function exportToExcel(options: ExportOptions): void {
  const { pricedItems, projectSettings, grandTotal, totalTransportCost, inflationRate = 7.5, complianceCosts, pgCosts = 0, includeGreenData = false } = options;
  
  // Safe access to compliance costs
  const complianceTotal = complianceCosts?.total || 0;
  const pricingCompleteness = calculatePricingCompleteness(pricedItems);
  const pricingStatusCounts = getPricingStatusCounts(pricedItems);

  // Calculate carbon summary if green data is included
  const carbonSummary = includeGreenData ? calculateProjectCarbonSummary(pricedItems) : null;

  // Calculate inflation projections
  const projected6Months = grandTotal * (1 + (inflationRate / 100) * 0.5);
  const projected12Months = grandTotal * (1 + (inflationRate / 100));
  const increase6Months = projected6Months - grandTotal;
  const increase12Months = projected12Months - grandTotal;

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Create main data sheet with or without carbon data
  const headers = includeGreenData ? [
    'Item No',
    'Description',
    'Quantity',
    'Unit',
    'Supplier',
    'Pricing Status',
    'Base Price',
    'Transport Cost',
    'Landed Cost',
    'Additional Fees',
    'Best Overall Price',
    'Total Price',
    'Distance (km)',
    'Branch Location',
    '🌿 Green?',
    'Standard Carbon (kgCO₂e)',
    'Green Carbon (kgCO₂e)',
    'Carbon Savings (%)',
    'Cost Premium (R)',
    'Cost Premium (%)',
    'R/tCO₂e Saved',
    'Green Score'
  ] : [
    'Item No',
    'Description',
    'Quantity',
    'Unit',
    'Supplier',
    'Pricing Status',
    'Base Price',
    'Transport Cost',
    'Landed Cost',
    'Additional Fees',
    'Best Overall Price',
    'Total Price',
    'Distance (km)',
    'Branch Location'
  ];

  const data = pricedItems.map(item => {
    const baseRow = [
      item.code,
      item.name,
      item.quantity,
      item.unit,
      item.selectedSupplier,
      getPricingStatus(item),
      parseFloat(item.baseUnitPrice),
      parseFloat(item.transportCost),
      parseFloat(item.landedUnitPrice),
      parseFloat(item.additionalFees || '0'),
      parseFloat(item.finalUnitPrice || item.landedUnitPrice),
      parseFloat(item.totalPrice),
      item.distance !== undefined && item.distance !== null ? item.distance : '', // Fixed: Show 0km when distance is 0
      item.selectedBranchName || item.selectedMunicipality || projectSettings?.municipality || ''
    ];

    if (includeGreenData) {
      const carbonData = calculateItemCarbon(item);
      baseRow.push(
        carbonData.greenAlternative ? '✅ Yes' : '',
        carbonData.totalCarbon.toFixed(2),
        carbonData.greenAlternative ? carbonData.greenAlternative.totalCarbon.toFixed(2) : '',
        carbonData.greenAlternative ? carbonData.greenAlternative.carbonSavingsPercent.toFixed(1) : '',
        carbonData.greenAlternative ? carbonData.greenAlternative.totalPricePremium.toFixed(2) : '',
        carbonData.greenAlternative ? carbonData.greenAlternative.pricePremiumPercent.toFixed(1) : '',
        carbonData.greenAlternative ? carbonData.greenAlternative.costPerTonneCO2eSaved.toFixed(0) : '',
        carbonData.greenScore
      );
    }

    return baseRow;
  });

  // Add totals rows
  data.push([
    '', 'GRAND TOTAL (Delivery)', '', '', '', '', '', totalTransportCost, '', '', '', grandTotal, '', ''
  ]);
  
  // Add P&G row
  data.push([
    '', 'Preliminaries & General (P&G)', '', '', '', '', '', '', '', '', '', pgCosts, '', ''
  ]);
  
  // Add Compliance Costs row
  data.push([
    '', 'Compliance Costs (NHBRC, CIDB, etc.)', '', '', '', '', '', '', '', '', '', complianceTotal, '', ''
  ]);
  
  // Add Green Cost Premium row (if green data included)
  if (includeGreenData && carbonSummary) {
    data.push([
      '', '🌿 Green Materials Cost Premium', '', '', '', '', '', '', '', '', '', carbonSummary.costPremium, '', ''
    ]);
  }
  
  // Add Overall BOQ Total row
  const overallTotal = grandTotal + complianceTotal + pgCosts + (includeGreenData && carbonSummary ? carbonSummary.costPremium : 0);
  data.push([
    '', 'OVERALL BOQ TOTAL', '', '', '', '', '', '', '', '', '', overallTotal, '', ''
  ]);

  // Combine headers and data
  const wsData = [headers, ...data];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws['!cols'] = includeGreenData ? [
    { wch: 10 },  // Item No
    { wch: 40 },  // Description
    { wch: 10 },  // Quantity
    { wch: 8 },   // Unit
    { wch: 15 },  // Supplier
    { wch: 24 },  // Pricing Status
    { wch: 12 },  // Base Price
    { wch: 14 },  // Transport Cost
    { wch: 12 },  // Landed Cost
    { wch: 14 },  // Additional Fees
    { wch: 15 },  // Best Overall Price
    { wch: 12 },  // Total Price
    { wch: 12 },  // Distance
    { wch: 20 },  // Branch Location
    { wch: 10 },  // 🌿 Green?
    { wch: 15 },  // Standard Carbon (kgCO₂e)
    { wch: 15 },  // Green Carbon (kgCO₂e)
    { wch: 15 },  // Carbon Savings (%)
    { wch: 15 },  // Cost Premium (R)
    { wch: 15 },  // Cost Premium (%)
    { wch: 15 },  // R/tCO₂e Saved
    { wch: 10 }   // Green Score
  ] : [
    { wch: 10 },  // Item No
    { wch: 40 },  // Description
    { wch: 10 },  // Quantity
    { wch: 8 },   // Unit
    { wch: 15 },  // Supplier
    { wch: 24 },  // Pricing Status
    { wch: 12 },  // Base Price
    { wch: 14 },  // Transport Cost
    { wch: 12 },  // Landed Cost
    { wch: 14 },  // Additional Fees
    { wch: 15 },  // Best Overall Price
    { wch: 12 },  // Total Price
    { wch: 12 },  // Distance
    { wch: 20 }   // Branch Location
  ];

  // Apply number formatting to currency columns
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let R = 1; R <= range.e.r; R++) {
    for (let C = 6; C <= 11; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (ws[cellAddress] && typeof ws[cellAddress].v === 'number') {
        ws[cellAddress].z = 'R#,##0.00';
      }
    }
  }

  const summaryRows: Array<Array<string | number>> = [
    ['BOQ SUMMARY', ''],
    ['Project location', `${projectSettings?.municipality || 'N/A'}, ${projectSettings?.province || 'N/A'}`],
    ['Pricing coverage', `${pricingCompleteness.coveragePercent.toFixed(1)}%`],
    ['Priceable items', pricingCompleteness.priceableItems],
    ['Priced items', pricingCompleteness.pricedItems],
    ['Unresolved items', pricingCompleteness.unresolvedItems],
    ['Structural/reference rows excluded', pricingCompleteness.nonPriceableRows],
    ['BOQ pricing complete', pricingCompleteness.isComplete ? 'Yes' : 'No — total remains incomplete'],
    ['', ''],
    ['PRICING STATUS BREAKDOWN', ''],
    ...pricingStatusCounts.map(([status, count]) => [status, count]),
    ['', ''],
    ['Delivery total', grandTotal],
    ['Transport included', totalTransportCost],
    ['Preliminaries & General (P&G)', pgCosts],
    ['Compliance costs', complianceTotal],
    ['Overall BOQ total', overallTotal],
    ['', ''],
    ['Generated', new Date().toLocaleString('en-ZA')],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary['!cols'] = [{ wch: 38 }, { wch: 32 }];
  for (let row = summaryRows.findIndex(entry => entry[0] === 'Delivery total'); row < summaryRows.length; row += 1) {
    const address = XLSX.utils.encode_cell({ r: row, c: 1 });
    if (wsSummary[address] && typeof wsSummary[address].v === 'number') wsSummary[address].z = 'R#,##0.00';
  }

  XLSX.utils.book_append_sheet(wb, wsSummary, 'BOQ Summary');
  XLSX.utils.book_append_sheet(wb, ws, 'Priced BOQ');

  // Create project info sheet with inflation projections
  const projectInfo = [
    ['Qilly - Regional Priced Bill of Quantities', ''],
    ['', ''],
    ['Project Information', ''],
    ['Province', projectSettings?.province || 'N/A'],
    ['Municipality', projectSettings?.municipality || 'N/A'],
    ['CIDB Grading', projectSettings?.cidbGrading || 'N/A'],
    ['Profit Margin', projectSettings?.profitMargin || 'N/A'],
    ['Project Duration', projectSettings?.duration || 'N/A'],
    ['Machinery Type', projectSettings?.machineryType || 'N/A'],
    ['', ''],
    ['⚠️ COMPLIANCE WARNING', ''],
    ['This BOQ includes comprehensive South African construction compliance costs as per:', ''],
    ['• NHBRC (National Home Builders Registration Council) - 5-year warranty enrollment', ''],
    ['• CIDB (Construction Industry Development Board) - Professional registration and levies', ''],
    ['• SANS 1200 Standards - Technical compliance and specifications', ''],
    ['• National Building Regulations (NBR) - Building code compliance', ''],
    ['• AGRÉMENT Certification - Product certification where applicable', ''],
    ['• BBBEE Requirements - Broad-Based Black Economic Empowerment tracking', ''],
    ['• POPIA Compliance - Data protection and privacy regulations', ''],
    ['• Anti-Corruption Measures - Ethical procurement and contracting standards', ''],
    ['', ''],
    ['IMPORTANT: All pricing includes regulatory compliance costs. Non-compliance may result in', ''],
    ['project delays, legal penalties, warranty issues, and funding rejection by government', ''],
    ['authorities including the Department of Human Settlements.', ''],
    ['', ''],
    ['Current Pricing Summary', ''],
    ['Grand Total (Delivery)', grandTotal],
    ['Total Transport Cost', totalTransportCost],
    ['Total Compliance Costs (excl. P&G)', complianceTotal],
    ['Preliminaries & General (P&G)', pgCosts],
    ...(includeGreenData && carbonSummary ? [
      ['🌿 Green Materials Cost Premium', carbonSummary.costPremium]
    ] : []),
    ['Overall BOQ Total', grandTotal + complianceTotal + pgCosts + (includeGreenData && carbonSummary ? carbonSummary.costPremium : 0)],
    ['Number of Items', pricedItems.length],
    ['Transport % of Total', ((totalTransportCost / grandTotal) * 100).toFixed(2) + '%'],
    ['Compliance % of Total', complianceTotal > 0 ? ((complianceTotal / grandTotal) * 100).toFixed(2) + '%' : '0.00%'],
    ['P&G % of Total', pgCosts > 0 ? ((pgCosts / grandTotal) * 100).toFixed(2) + '%' : '0.00%'],
    ...(includeGreenData && carbonSummary ? [
      ['Green Premium % of Total', ((carbonSummary.costPremium / grandTotal) * 100).toFixed(2) + '%']
    ] : []),
    ['', ''],
    ...(includeGreenData && carbonSummary ? [
      ['🌿 ENVIRONMENTAL IMPACT SUMMARY', ''],
      ['Standard Carbon Footprint', `${carbonSummary.totalCarbon.toFixed(1)} tCO₂e`],
      ['Green Alternative Carbon Footprint', `${carbonSummary.totalCarbonWithGreen.toFixed(1)} tCO₂e`],
      ['Carbon Savings', `${carbonSummary.totalCarbonSavings.toFixed(1)} tCO₂e (${carbonSummary.carbonSavingsPercent.toFixed(1)}%)`],
      ['Trees Equivalent', `~${carbonSummary.treesEquivalent} trees worth of CO₂ absorption`],
      ['DHS Green Score', carbonSummary.overallGreenScore],
      ['Items with Green Alternatives', `${carbonSummary.itemsWithGreenAlternatives} of ${carbonSummary.totalItems} items`],
      ['Cost per tCO₂e Saved', `R${(carbonSummary.costPremium / carbonSummary.totalCarbonSavings).toFixed(0)}`],
      ['', ''],
      ['Carbon Data Sources:', ''],
      ['ICE Database v3.0 (University of Bath)', 'International standard for embodied carbon'],
      ['IPCC Construction Guidelines', 'UN climate body methodology'],
      ['BuildAid 2025/2026 Standards', 'South African materials calibration'],
      ['GBCSA Alignment', 'Green Building Council SA compliance'],
      ['', '']
    ] : []),
    ['', ''],
    ['Future Price Projections (Inflation-Adjusted)', ''],
    ['Annual Inflation Rate', `${inflationRate}%`],
    ['', ''],
    ['6 Months Projection', ''],
    ['Projected Total (6 months)', projected6Months],
    ['Price Increase', increase6Months],
    ['Percentage Increase', `${(inflationRate * 0.5).toFixed(1)}%`],
    ['', ''],
    ['12 Months Projection', ''],
    ['Projected Total (12 months)', projected12Months],
    ['Price Increase', increase12Months],
    ['Percentage Increase', `${inflationRate.toFixed(1)}%`],
    ['', ''],
    ['Disclaimer', 'These projections are estimates based on historical trends. Actual prices may vary due to market conditions, exchange rates, and other economic factors.'],
    ['', ''],
    ['Generated Date', new Date().toLocaleString('en-ZA')]
  ];

  const wsInfo = XLSX.utils.aoa_to_sheet(projectInfo);
  wsInfo['!cols'] = [{ wch: 35 }, { wch: 25 }];
  
  // Format currency cells in project info (updated cell references after adding compliance warning)
  ['B28', 'B29', 'B30', 'B31', 'B39', 'B40', 'B44', 'B45'].forEach(cell => {
    if (wsInfo[cell]) {
      wsInfo[cell].z = 'R#,##0.00';
    }
  });

  XLSX.utils.book_append_sheet(wb, wsInfo, 'Project Info');

  // Save file
  const fileName = `Qilly-Regional-BOQ-${projectSettings?.municipality || 'Project'}-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Export priced BOQ to PDF format
 */
export function exportToPDF(options: ExportOptions): void {
  const { pricedItems, projectSettings, grandTotal, totalTransportCost, totalSavings, inflationRate = 7.5, complianceCosts, pgCosts = 0, includeGreenData = false, contractorTier = 'free' } = options;
  
  // Get tier features for watermarking
  const tierFeatures = getTierFeatures(contractorTier);
  const shouldWatermark = tierFeatures.pdfWatermark;
  
  // Safe access to compliance costs
  const complianceTotal = complianceCosts?.total || 0;
  const pricingCompleteness = calculatePricingCompleteness(pricedItems);
  const pricingStatusCounts = getPricingStatusCounts(pricedItems);

  // Calculate carbon summary if green data is included
  const carbonSummary = includeGreenData ? calculateProjectCarbonSummary(pricedItems) : null;

  // Calculate inflation projections
  const projected6Months = grandTotal * (1 + (inflationRate / 100) * 0.5);
  const projected12Months = grandTotal * (1 + (inflationRate / 100));

  // Create PDF document
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Set fonts
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);

  // Add header
  doc.setTextColor(0, 180, 216);
  doc.text('Qilly - Regional Priced Bill of Quantities', 15, 15);
  
  // Add watermark for FREE tier
  if (shouldWatermark) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Save current state
    const currentTextColor = doc.getTextColor();
    const currentFontSize = doc.getFontSize();
    
    // Add diagonal watermark
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    
    // Rotate and add watermark text
    const watermarkText = 'TRAINING';
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;
    
    doc.saveGraphicsState();
    doc.text(watermarkText, centerX, centerY, {
      align: 'center',
      angle: 45,
    });
    doc.restoreGraphicsState();
    
    // Add smaller subtitle watermark
    doc.setFontSize(20);
    doc.text('NOT FOR SUBMISSION', centerX, centerY + 20, {
      align: 'center',
      angle: 45,
    });
    
    // Restore state
    doc.setTextColor(currentTextColor as any);
    doc.setFontSize(currentFontSize);
    doc.setFont('helvetica', 'bold');
  }

  // Add project info
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  const projectInfoY = 25;
  doc.text(`Project Location: ${projectSettings?.municipality || 'N/A'}, ${projectSettings?.province || 'N/A'}`, 15, projectInfoY);
  doc.text(`CIDB Grading: ${projectSettings?.cidbGrading || 'N/A'}`, 15, projectInfoY + 5);
  doc.text(`Profit Margin: ${projectSettings?.profitMargin || 'N/A'}`, 15, projectInfoY + 10);
  doc.text(`Generated: ${new Date().toLocaleString('en-ZA')}`, 15, projectInfoY + 15);

  // Add summary boxes (5 boxes including compliance and inflation projections)
  const summaryY = projectInfoY + 25;
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  
  // Grand Total box (Current)
  doc.setFillColor(0, 180, 216);
  doc.rect(15, summaryY, 52, 15, 'F');
  doc.setFontSize(8);
  doc.text('CURRENT TOTAL', 17, summaryY + 5);
  doc.setFontSize(11);
  doc.text(`R${grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 17, summaryY + 11);

  // Transport Cost box
  doc.setFillColor(255, 140, 0);
  doc.rect(69, summaryY, 52, 15, 'F');
  doc.setFontSize(8);
  doc.text('TRANSPORT', 71, summaryY + 5);
  doc.setFontSize(11);
  doc.text(`R${totalTransportCost.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 71, summaryY + 11);

  // Compliance Costs box
  doc.setFillColor(147, 51, 234);
  doc.rect(123, summaryY, 52, 15, 'F');
  doc.setFontSize(8);
  doc.text('COMPLIANCE', 125, summaryY + 5);
  doc.setFontSize(11);
  doc.text(`R${complianceTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 125, summaryY + 11);

  // 6 Months Projection box
  doc.setFillColor(251, 191, 36);
  doc.rect(177, summaryY, 52, 15, 'F');
  doc.setFontSize(8);
  doc.text('6 MO. PROJ.', 179, summaryY + 5);
  doc.setFontSize(11);
  doc.text(`R${projected6Months.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 179, summaryY + 11);

  // 12 Months Projection box
  doc.setFillColor(239, 68, 68);
  doc.rect(231, summaryY, 52, 15, 'F');
  doc.setFontSize(8);
  doc.text('12 MO. PROJ.', 233, summaryY + 5);
  doc.setFontSize(11);
  doc.text(`R${projected12Months.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 233, summaryY + 11);

  // Add inflation note
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Future projections based on ${inflationRate}% annual inflation`, 15, summaryY + 20);

  autoTable(doc, {
    startY: summaryY + 24,
    head: [['Priceable', 'Priced', 'Unresolved', 'Excluded rows', 'Coverage', 'Pricing complete']],
    body: [[
      String(pricingCompleteness.priceableItems),
      String(pricingCompleteness.pricedItems),
      String(pricingCompleteness.unresolvedItems),
      String(pricingCompleteness.nonPriceableRows),
      `${pricingCompleteness.coveragePercent.toFixed(1)}%`,
      pricingCompleteness.isComplete ? 'Yes' : 'No — total incomplete',
    ]],
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    margin: { left: 15, right: 15 },
  });
  const boqSummaryEndY = (doc as any).lastAutoTable.finalY || summaryY + 38;
  doc.setFontSize(7);
  doc.setTextColor(60, 60, 60);
  const statusBreakdown = `Status breakdown: ${pricingStatusCounts.map(([status, count]) => `${status}: ${count}`).join(' | ')}`;
  doc.text(doc.splitTextToSize(statusBreakdown, 267), 15, boqSummaryEndY + 4);
  const itemTableStartY = boqSummaryEndY + 10;

  // Add items table - streamline columns when green data is included to prevent cutoff
  const tableData = pricedItems.map(item => {
    if (includeGreenData) {
      // Streamlined version with green data - fewer columns
      const carbonData = calculateItemCarbon(item);
      return [
        item.code,
        item.name.length > 35 ? item.name.substring(0, 32) + '...' : item.name,
        item.quantity,
        item.unit,
        String(item.selectedSupplier || '').length > 8 ? String(item.selectedSupplier || '').substring(0, 6) + '...' : String(item.selectedSupplier || ''),
        getPricingStatus(item),
        `R${parseFloat(item.totalPrice).toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`,
        item.distance !== undefined && item.distance !== null ? `${item.distance}km` : 'N/A',
        carbonData.greenAlternative ? '✅' : '',
        carbonData.totalCarbon.toFixed(0),
        carbonData.greenScore
      ];
    } else {
      // Full version without green data
      return [
        item.code,
        item.name.length > 40 ? item.name.substring(0, 37) + '...' : item.name,
        item.quantity,
        item.unit,
        String(item.selectedSupplier || '').length > 10 ? String(item.selectedSupplier || '').substring(0, 8) + '...' : String(item.selectedSupplier || ''),
        getPricingStatus(item),
        `R${item.baseUnitPrice}`,
        `R${item.transportCost}`,
        `R${item.additionalFees || '0.00'}`,
        `R${item.finalUnitPrice || item.landedUnitPrice}`,
        `R${parseFloat(item.totalPrice).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        item.distance !== undefined && item.distance !== null ? `${item.distance}km` : 'N/A',
        (item.selectedBranchName || item.selectedMunicipality || projectSettings?.municipality || '').length > 15 
          ? (item.selectedBranchName || item.selectedMunicipality || projectSettings?.municipality || '').substring(0, 12) + '...' 
          : (item.selectedBranchName || item.selectedMunicipality || projectSettings?.municipality || '')
      ];
    }
  });

  const tableHeaders = includeGreenData ? [
    'Item',
    'Description',
    'Qty',
    'Unit',
    'Supplier',
    'Status',
    'Total',
    'Dist',
    '🌿',
    'Carbon',
    'Score'
  ] : [
    'Item No',
    'Description',
    'Qty',
    'Unit',
    'Supplier',
    'Status',
    'Base Price',
    'Transport',
    'Add. Fees',
    'Best Price',
    'Total Price',
    'Distance',
    'Branch'
  ];

  const footerRows = includeGreenData ? [
    // Streamlined footer for green data version
    ['', 'GRAND TOTAL', '', '', '', '', `R${grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`, '', '', '', ''],
    ['', 'P&G', '', '', '', '', `R${pgCosts.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`, '', '', '', ''],
    ['', 'Compliance', '', '', '', '', `R${complianceTotal.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`, '', '', '', ''],
    ...(carbonSummary ? [
      ['', '🌿 Green Premium', '', '', '', '', `R${carbonSummary.costPremium.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`, '', '', '', '']
    ] : []),
    ['', 'OVERALL TOTAL', '', '', '', '', `R${(grandTotal + complianceTotal + pgCosts + (carbonSummary ? carbonSummary.costPremium : 0)).toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`, '', '', '', '']
  ] : [
    // Full footer for standard version
    ['', 'GRAND TOTAL (Delivery)', '', '', '', '', '', `R${totalTransportCost.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, '', '', `R${grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, '', ''],
    ['', 'Preliminaries & General (P&G)', '', '', '', '', '', '', '', '', `R${pgCosts.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, '', ''],
    ['', 'Compliance Costs', '', '', '', '', '', '', '', '', `R${complianceTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, '', ''],
    ['', 'OVERALL BOQ TOTAL', '', '', '', '', '', '', '', '', `R${(grandTotal + complianceTotal + pgCosts).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, '', '']
  ];

  autoTable(doc, {
    startY: itemTableStartY,
    head: [tableHeaders],
    body: tableData,
    foot: footerRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [0, 180, 216],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8
    },
    footStyles: {
      fillColor: [0, 180, 216],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    columnStyles: includeGreenData ? {
      0: { cellWidth: 12 },  // Item
      1: { cellWidth: 65 },  // Description
      2: { cellWidth: 15 },  // Qty
      3: { cellWidth: 12 },  // Unit
      4: { cellWidth: 25 },  // Supplier
      5: { cellWidth: 28 },  // Status
      6: { cellWidth: 26, halign: 'right' },  // Total
      7: { cellWidth: 15, halign: 'center' },  // Dist
      8: { cellWidth: 12, halign: 'center' },  // 🌿
      9: { cellWidth: 20, halign: 'right' },  // Carbon
      10: { cellWidth: 15, halign: 'center' }   // Score
    } : {
      0: { cellWidth: 15 },  // Item No
      1: { cellWidth: 35 },  // Description
      2: { cellWidth: 11 },  // Qty
      3: { cellWidth: 11 },  // Unit
      4: { cellWidth: 18 },  // Supplier
      5: { cellWidth: 25 },  // Status
      6: { cellWidth: 17, halign: 'right' },  // Base Price
      7: { cellWidth: 17, halign: 'right' },  // Transport
      8: { cellWidth: 17, halign: 'right' },  // Add. Fees
      9: { cellWidth: 17, halign: 'right' },  // Best Price
      10: { cellWidth: 23, halign: 'right' },  // Total Price
      11: { cellWidth: 13, halign: 'center' },  // Distance
      12: { cellWidth: 18 }  // Branch
    },
    margin: { left: 15, right: 15 }
  });

  // Add inflation projection details on a new page if there's space, or after the table
  const finalY = (doc as any).lastAutoTable.finalY || summaryY + 30;
  
  // ALWAYS Add Overall BOQ Total box right after the table (on new page if needed)
  const overallBOQTotal = grandTotal + complianceTotal + pgCosts + (includeGreenData && carbonSummary ? carbonSummary.costPremium : 0);
  let currentPageY = finalY;
  
  // Check if we need a new page for the Overall Total
  if (finalY > doc.internal.pageSize.getHeight() - 80) {
    doc.addPage();
    currentPageY = 20;
  }
  
  // Overall BOQ Total box (always displayed)
  doc.setFillColor(0, 119, 182); // Darker blue for Overall Total
  doc.rect(15, currentPageY + 5, 110, includeGreenData && carbonSummary ? 24 : 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`OVERALL BOQ TOTAL (Delivery + Compliance + P&G${includeGreenData && carbonSummary ? ' + Green' : ''})`, 17, currentPageY + 12);
  doc.setFontSize(13);
  doc.text(`R${overallBOQTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 17, currentPageY + 20);
  
  // Add green premium note if applicable
  if (includeGreenData && carbonSummary) {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`🌿 Includes R${carbonSummary.costPremium.toLocaleString('en-ZA', { minimumFractionDigits: 0 })} green premium`, 17, currentPageY + 26);
  }
  
  // Add COMPLIANCE WARNING box
  const complianceY = currentPageY + (includeGreenData && carbonSummary ? 34 : 28);
  doc.setFillColor(255, 243, 205); // Light yellow background
  doc.rect(15, complianceY, 267, 38, 'F');
  
  // Add warning border
  doc.setDrawColor(255, 140, 0); // Orange border
  doc.setLineWidth(0.5);
  doc.rect(15, complianceY, 267, 38);
  
  // Add warning icon and title
  doc.setTextColor(255, 140, 0); // Orange text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('⚠️ COMPLIANCE WARNING', 18, complianceY + 5);
  
  // Add compliance details
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('This BOQ includes comprehensive South African construction compliance costs as per:', 18, complianceY + 10);
  doc.text('• NHBRC (5-year warranty) • CIDB (registration & levies) • SANS 1200 Standards • NBR (Building code)', 18, complianceY + 14);
  doc.text('• AGRÉMENT Certification • BBBEE Requirements • POPIA Compliance • Anti-Corruption Measures', 18, complianceY + 18);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('IMPORTANT:', 18, complianceY + 24);
  doc.setFont('helvetica', 'normal');
  doc.text('All pricing includes regulatory compliance costs. Non-compliance may result in project delays,', 38, complianceY + 24);
  doc.text('legal penalties, warranty issues, and funding rejection by government authorities including the', 18, complianceY + 28);
  doc.text('Department of Human Settlements.', 18, complianceY + 32);
  
  // Add ENVIRONMENTAL IMPACT section if green data is included
  let nextSectionY = complianceY + 42;
  if (includeGreenData && carbonSummary) {
    const envY = nextSectionY;
    
    // Check if we need a new page
    if (envY > doc.internal.pageSize.getHeight() - 80) {
      doc.addPage();
      nextSectionY = 20;
    }
    
    // Environmental Impact box
    doc.setFillColor(34, 197, 94); // Green background
    doc.rect(15, nextSectionY, 267, 45, 'F');
    
    // Add green border
    doc.setDrawColor(22, 163, 74); // Darker green border
    doc.setLineWidth(0.5);
    doc.rect(15, nextSectionY, 267, 45);
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('🌿 ENVIRONMENTAL IMPACT SUMMARY', 18, nextSectionY + 5);
    
    // Environmental metrics
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(`Standard Carbon Footprint: ${carbonSummary.totalCarbon.toFixed(1)} tCO₂e`, 18, nextSectionY + 12);
    doc.text(`Green Alternative Carbon: ${carbonSummary.totalCarbonWithGreen.toFixed(1)} tCO₂e`, 18, nextSectionY + 17);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Carbon Savings: ${carbonSummary.totalCarbonSavings.toFixed(1)} tCO₂e (${carbonSummary.carbonSavingsPercent.toFixed(1)}% reduction)`, 18, nextSectionY + 22);
    doc.setFont('helvetica', 'normal');
    doc.text(`Trees Equivalent: ~${carbonSummary.treesEquivalent} trees worth of CO₂ absorption`, 18, nextSectionY + 27);
    
    // Green Score and Coverage
    doc.text(`DHS Green Score: ${carbonSummary.overallGreenScore} | Items with Green Options: ${carbonSummary.itemsWithGreenAlternatives} of ${carbonSummary.totalItems}`, 18, nextSectionY + 32);
    doc.text(`Cost per tCO₂e Saved: R${(carbonSummary.costPremium / carbonSummary.totalCarbonSavings).toFixed(0)}`, 18, nextSectionY + 37);
    
    // Data sources
    doc.setFontSize(6);
    doc.setTextColor(240, 253, 244);
    doc.text('Data Sources: ICE Database v3.0, IPCC Guidelines, BuildAid 2025/2026, GBCSA Alignment', 18, nextSectionY + 42);
    
    nextSectionY += 50;
  }
  
  // Add inflation projections below the compliance warning (or environmental section)
  const projectionsY = nextSectionY;
  if (projectionsY < doc.internal.pageSize.getHeight() - 60) {
    // Add projections on same page
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Future Price Projections (Inflation-Adjusted)', 15, projectionsY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Annual Inflation Rate: ${inflationRate}%`, 15, projectionsY + 6);
    doc.text(`6 Months: R${projected6Months.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} (+R${(projected6Months - grandTotal).toLocaleString('en-ZA', { minimumFractionDigits: 2 })})`, 15, projectionsY + 12);
    doc.text(`12 Months: R${projected12Months.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} (+R${(projected12Months - grandTotal).toLocaleString('en-ZA', { minimumFractionDigits: 2 })})`, 15, projectionsY + 18);
    
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(7);
    doc.text('Disclaimer: These projections are estimates based on historical trends. Actual prices may vary.', 15, projectionsY + 25);
  }

  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'Generated by Qilly - Intelligent Construction Billing System',
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'center' }
    );
  }

  // Save PDF
  const fileName = `Qilly-Regional-BOQ-${projectSettings?.municipality || 'Project'}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

/**
 * Export priced BOQ to CSV format (existing functionality)
 */
export function exportToCSV(options: ExportOptions): void {
  const { pricedItems, projectSettings, grandTotal, totalTransportCost, inflationRate = 7.5, complianceCosts } = options;
  
  // Safe access to compliance costs
  const complianceTotal = complianceCosts?.total || 0;
  const pricingCompleteness = calculatePricingCompleteness(pricedItems);
  const pricingStatusCounts = getPricingStatusCounts(pricedItems);

  // Calculate inflation projections
  const projected6Months = grandTotal * (1 + (inflationRate / 100) * 0.5);
  const projected12Months = grandTotal * (1 + (inflationRate / 100));

  const headers = [
    'Item No',
    'Description',
    'Quantity',
    'Unit',
    'Supplier',
    'Pricing Status',
    'Base Price',
    'Transport Cost',
    'Landed Cost',
    'Additional Fees',
    'Best Overall Price',
    'Total Price',
    'Distance (km)',
    'Branch Location'
  ];

  const rows = pricedItems.map(item => [
    item.code,
    item.name,
    item.quantity,
    item.unit,
    item.selectedSupplier,
    getPricingStatus(item),
    `R${item.baseUnitPrice}`,
    `R${item.transportCost}`,
    `R${item.landedUnitPrice}`,
    `R${item.additionalFees || '0.00'}`,
    `R${item.finalUnitPrice || item.landedUnitPrice}`,
    `R${item.totalPrice}`,
    item.distance ? `${item.distance}km` : 'N/A',
    item.selectedBranchName || item.selectedMunicipality || projectSettings?.municipality || ''
  ]);

  // Add summary rows at the bottom
  const summaryRows = [
    [''],
    ['SUMMARY'],
    ['Pricing Coverage', `${pricingCompleteness.coveragePercent.toFixed(1)}%`],
    ['Priceable Items', String(pricingCompleteness.priceableItems)],
    ['Priced Items', String(pricingCompleteness.pricedItems)],
    ['Unresolved Items', String(pricingCompleteness.unresolvedItems)],
    ['Structural/Reference Rows Excluded', String(pricingCompleteness.nonPriceableRows)],
    ['BOQ Pricing Complete', pricingCompleteness.isComplete ? 'Yes' : 'No - total remains incomplete'],
    ...pricingStatusCounts.map(([status, count]) => [`Status: ${status}`, String(count)]),
    [''],
    ['Current Grand Total', `R${grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
    ['Total Transport Cost', `R${totalTransportCost.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
    ['Total Compliance Costs', `R${complianceTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
    ['Overall BOQ Total', `R${(grandTotal + complianceTotal).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
    [''],
    ['FUTURE PRICE PROJECTIONS'],
    ['Annual Inflation Rate', `${inflationRate}%`],
    ['6 Months Projection', `R${projected6Months.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
    ['6 Months Increase', `R${(projected6Months - grandTotal).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
    ['12 Months Projection', `R${projected12Months.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
    ['12 Months Increase', `R${(projected12Months - grandTotal).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
    [''],
    ['Disclaimer', 'These projections are estimates based on historical trends. Actual prices may vary.']
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `\"${cell}\"`).join(',')),
    ...summaryRows.map(row => row.map(cell => `\"${cell}\"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Qilly-Regional-BOQ-${projectSettings?.municipality || 'Project'}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * Export Priced BOQ to Word (.docx) format
 */
export async function exportToWord(options: ExportOptions): Promise<void> {
  const { Document, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, AlignmentType, WidthType, Packer } = await import('docx');

  const { pricedItems, projectSettings, grandTotal, totalTransportCost, complianceCosts, pgCosts = 0 } = options;
  const complianceTotal = complianceCosts?.total || 0;
  const overallTotal = grandTotal + complianceTotal + pgCosts;
  const pricingCompleteness = calculatePricingCompleteness(pricedItems);
  const pricingStatusCounts = getPricingStatusCounts(pricedItems);
  const fmtR = (v: any) => {
    const n = parseFloat(v);
    return isNaN(n) ? 'R0.00' : `R${n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  const fmtN = (v: any) => { const n = parseFloat(v); return isNaN(n) ? '' : String(n); };
  const date = new Date().toLocaleDateString('en-ZA');

  const hCell = (text: string) => new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 16, color: 'FFFFFF' })] })],
    shading: { fill: '00b4d8' },
  });

  const dCell = (text: string, right = false) => new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text: text ?? '', size: 15 })],
      alignment: right ? AlignmentType.RIGHT : AlignmentType.LEFT,
    })],
  });

  const summaryTableRows = [
    ['Pricing coverage', `${pricingCompleteness.coveragePercent.toFixed(1)}%`],
    ['Priceable items', String(pricingCompleteness.priceableItems)],
    ['Priced items', String(pricingCompleteness.pricedItems)],
    ['Unresolved items', String(pricingCompleteness.unresolvedItems)],
    ['Structural/reference rows excluded', String(pricingCompleteness.nonPriceableRows)],
    ['BOQ pricing complete', pricingCompleteness.isComplete ? 'Yes' : 'No — total remains incomplete'],
    ...pricingStatusCounts.map(([status, count]) => [`Status: ${status}`, String(count)]),
    ['Delivery total', fmtR(grandTotal)],
    ['Preliminaries & General', fmtR(pgCosts)],
    ['Compliance costs', fmtR(complianceTotal)],
    ['Overall BOQ total', fmtR(overallTotal)],
  ].map(([label, value]) => new TableRow({ children: [dCell(label), dCell(value, true)] }));

  // Match Excel columns exactly: Item No, Description, Quantity, Unit, Supplier, Pricing Status,
  // Base Price, Transport Cost, Landed Cost, Additional Fees,
  // Best Overall Price, Total Price, Distance (km), Branch Location
  const itemRows = pricedItems.map((item: any, i: number) => new TableRow({
    children: [
      dCell(item.code || String(i + 1)),
      dCell(item.name || item.description || ''),
      dCell(String(item.quantity ?? '')),
      dCell(item.unit || ''),
      dCell(item.selectedSupplier || item.supplierName || ''),
      dCell(getPricingStatus(item)),
      dCell(fmtR(item.baseUnitPrice), true),
      dCell(fmtR(item.transportCost), true),
      dCell(fmtR(item.landedUnitPrice), true),
      dCell(fmtR(item.additionalFees || 0), true),
      dCell(fmtR(item.finalUnitPrice || item.landedUnitPrice), true),
      dCell(fmtR(item.totalPrice), true),
      dCell(item.distance !== undefined && item.distance !== null ? fmtN(item.distance) : '', true),
      dCell(item.selectedBranchName || item.selectedMunicipality || projectSettings?.municipality || ''),
    ],
  }));

  // Totals row
  const totalsRow = new TableRow({
    children: [
      dCell(''), dCell('GRAND TOTAL (Delivery)', false), dCell(''), dCell(''), dCell(''), dCell(''),
      dCell(''), dCell(fmtR(totalTransportCost), true), dCell(''), dCell(''), dCell(''),
      dCell(fmtR(grandTotal), true), dCell(''), dCell(''),
    ],
  });

  const doc = new Document({
    sections: [{
      properties: { page: { size: { orientation: 'landscape' } } } as any,
      children: [
        new Paragraph({ text: 'PRICED BILL OF QUANTITIES', heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [new TextRun({ text: 'Qilly Construction Billing Intelligence', italics: true })], alignment: AlignmentType.CENTER }),
        new Paragraph({ text: '' }),
        new Paragraph({ children: [new TextRun({ text: 'Province: ', bold: true }), new TextRun(projectSettings?.province || 'N/A')] }),
        new Paragraph({ children: [new TextRun({ text: 'Municipality: ', bold: true }), new TextRun(projectSettings?.municipality || 'N/A')] }),
        new Paragraph({ children: [new TextRun({ text: 'CIDB Grade: ', bold: true }), new TextRun(projectSettings?.cidbGrading || 'N/A')] }),
        new Paragraph({ children: [new TextRun({ text: 'Generated: ', bold: true }), new TextRun(date)] }),
        new Paragraph({ text: '' }),
        new Paragraph({ text: 'BOQ SUMMARY', heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ tableHeader: true, children: [hCell('Metric'), hCell('Value')] }),
            ...summaryTableRows,
          ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({ text: 'BOQ LINE ITEMS', heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                hCell('Item No'), hCell('Description'), hCell('Qty'), hCell('Unit'), hCell('Supplier'), hCell('Pricing Status'),
                hCell('Base Price'), hCell('Transport Cost'), hCell('Landed Cost'),
                hCell('Additional Fees'), hCell('Best Overall Price'), hCell('Total Price'),
                hCell('Distance (km)'), hCell('Branch Location'),
              ],
            }),
            ...itemRows,
            totalsRow,
          ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({ children: [new TextRun({ text: 'Materials Total: ', bold: true }), new TextRun(fmtR(grandTotal))] }),
        new Paragraph({ children: [new TextRun({ text: 'Transport Total: ', bold: true }), new TextRun(fmtR(totalTransportCost))] }),
        ...(complianceTotal > 0 ? [new Paragraph({ children: [new TextRun({ text: 'Compliance & Statutory: ', bold: true }), new TextRun(fmtR(complianceTotal))] })] : []),
        ...(pgCosts > 0 ? [new Paragraph({ children: [new TextRun({ text: 'Preliminaries & General: ', bold: true }), new TextRun(fmtR(pgCosts))] })] : []),
        new Paragraph({ children: [new TextRun({ text: 'OVERALL BOQ TOTAL: ', bold: true, size: 26 }), new TextRun({ text: fmtR(overallTotal), bold: true, size: 26 })] }),
        new Paragraph({ text: '' }),
        new Paragraph({ children: [new TextRun({ text: 'Disclaimer: ', bold: true, italics: true }), new TextRun({ text: 'Prices are indicative estimates based on BuildAid 2025/2026 industry benchmarks. For billing enquiries contact billing@qilly-software.co.za or billing@qilly.co.za. Confirm actual prices with suppliers.', italics: true, size: 16 })] }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Qilly-BOQ-${projectSettings?.municipality || 'Project'}-${new Date().toISOString().split('T')[0]}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export Compliance Report to PDF
 */
export function exportComplianceReportToPDF(
  complianceCosts: ComplianceCosts,
  projectSettings?: {
    province?: string;
    municipality?: string;
    cidbGrading?: string;
  },
  contractorData?: {
    company_name?: string;
    cidb_grade?: string;
    annual_turnover?: number;
  }
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(0, 180, 216);
  doc.text('Qilly - Compliance Report', 15, 15);

  // Project Information
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  const projectInfoY = 25;
  doc.text(`Project Location: ${projectSettings?.municipality || 'N/A'}, ${projectSettings?.province || 'N/A'}`, 15, projectInfoY);
  doc.text(`CIDB Grading: ${projectSettings?.cidbGrading || 'N/A'}`, 15, projectInfoY + 5);
  doc.text(`Generated: ${new Date().toLocaleString('en-ZA')}`, 15, projectInfoY + 10);

  // Contractor Information
  const contractorInfoY = projectInfoY + 20;
  doc.text(`Contractor Name: ${contractorData?.company_name || 'N/A'}`, 15, contractorInfoY);
  doc.text(`CIDB Grade: ${contractorData?.cidb_grade || 'N/A'}`, 15, contractorInfoY + 5);
  doc.text(`Annual Turnover: R${contractorData?.annual_turnover?.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) || 'N/A'}`, 15, contractorInfoY + 10);

  // Compliance Costs
  const complianceCostsY = contractorInfoY + 20;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Compliance Costs', 15, complianceCostsY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`NHBRC (5-year warranty): R${complianceCosts.nhbrc.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 15, complianceCostsY + 10);
  doc.text(`CIDB (registration & levies): R${complianceCosts.cidb.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 15, complianceCostsY + 15);
  doc.text(`Statutory Labour Costs: R${complianceCosts.statutory.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 15, complianceCostsY + 20);
  doc.text(`Testing & Quality Assurance: R${complianceCosts.testing.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 15, complianceCostsY + 25);
  doc.text(`BBBEE Verification: R${complianceCosts.bbbee.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 15, complianceCostsY + 30);
  doc.text(`Preliminaries & General: R${complianceCosts.preliminaries.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 15, complianceCostsY + 35);
  
  // Total Compliance Costs
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Compliance Costs: R${complianceCosts.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 15, complianceCostsY + 55);

  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'Generated by Qilly - Intelligent Construction Billing System',
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'center' }
    );
  }

  // Save PDF
  const fileName = `Qilly-Compliance-Report-${projectSettings?.municipality || 'Project'}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
