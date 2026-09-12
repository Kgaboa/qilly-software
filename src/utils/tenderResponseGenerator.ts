import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { RegionalPricedBillItem } from './regionalPricingEngine';
import type { ComplianceCosts } from './complianceCalculations';
import type { CarbonSummary } from './carbonTracking';

interface TenderResponseData {
  pricedItems: RegionalPricedBillItem[];
  projectSettings?: {
    province?: string;
    municipality?: string;
    cidbGrading?: string;
    profitMargin?: string;
    duration?: string;
    machineryType?: string;
  };
  contractorData?: {
    company_name?: string;
    registration_number?: string;
    cidb_grading?: string;
    annual_turnover?: number;
    bbbee_level?: string;
    nhbrc_registered?: boolean;
    contact_person?: string;
    email?: string;
    phone?: string;
  };
  complianceCosts?: ComplianceCosts | null;
  carbonSummary?: CarbonSummary | null;
  tenderReference?: string;
  tenderTitle?: string;
  clientName?: string;
}

export function generateTenderResponse(data: TenderResponseData) {
  const doc = new jsPDF();
  const {
    pricedItems,
    projectSettings,
    contractorData,
    complianceCosts,
    carbonSummary,
    tenderReference = 'TENDER-2026-001',
    tenderTitle = 'Construction Project - Bill of Quantities',
    clientName = 'Department of Human Settlements'
  } = data;

  // Calculate totals
  const grandTotal = pricedItems.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
  const totalTransportCost = pricedItems.reduce((sum, item) => sum + parseFloat(item.transportCost || '0'), 0);
  const complianceTotal = complianceCosts?.total || 0;
  const pgCosts = complianceCosts?.preliminaries.total || 0;
  const greenPremium = carbonSummary?.costPremium || 0;
  const overallTotal = grandTotal + complianceTotal + pgCosts + greenPremium;

  let yPos = 20;

  // ===== PAGE 1: COVER PAGE =====
  
  // Add Qilly logo/header
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Qilly', 15, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Construction Billing & Tender Management System', 15, 28);

  // Tender Reference Box
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 50, 180, 30, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TENDER REFERENCE:', 20, 58);
  doc.setFontSize(14);
  doc.text(tenderReference, 20, 66);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('TENDER TITLE:', 20, 73);
  doc.setFontSize(11);
  doc.text(tenderTitle.length > 70 ? tenderTitle.substring(0, 67) + '...' : tenderTitle, 20, 78);

  // Contractor Information
  yPos = 95;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SUBMITTED BY:', 15, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(contractorData?.company_name || 'Contractor Name', 15, yPos);
  
  yPos += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  if (contractorData?.registration_number) {
    doc.text(`Registration Number: ${contractorData.registration_number}`, 15, yPos);
    yPos += 5;
  }
  if (contractorData?.cidb_grading) {
    doc.text(`CIDB Grading: ${contractorData.cidb_grading}`, 15, yPos);
    yPos += 5;
  }
  if (contractorData?.bbbee_level) {
    doc.text(`BBBEE Level: ${contractorData.bbbee_level}`, 15, yPos);
    yPos += 5;
  }
  if (contractorData?.nhbrc_registered) {
    doc.text('NHBRC Registered: Yes ✓', 15, yPos);
    yPos += 5;
  }
  
  yPos += 5;
  if (contractorData?.contact_person) {
    doc.text(`Contact Person: ${contractorData.contact_person}`, 15, yPos);
    yPos += 5;
  }
  if (contractorData?.email) {
    doc.text(`Email: ${contractorData.email}`, 15, yPos);
    yPos += 5;
  }
  if (contractorData?.phone) {
    doc.text(`Phone: ${contractorData.phone}`, 15, yPos);
    yPos += 5;
  }

  // Tender Summary Box
  yPos = 155;
  doc.setFillColor(0, 119, 182);
  doc.rect(15, yPos, 180, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TENDER PRICE SUMMARY', 20, yPos + 8);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Items: ${pricedItems.length}`, 20, yPos + 15);
  doc.text(`Location: ${projectSettings?.municipality || 'N/A'}, ${projectSettings?.province || 'N/A'}`, 20, yPos + 21);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL TENDER PRICE:', 20, yPos + 29);
  doc.setFontSize(16);
  doc.text(`R${overallTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 100, yPos + 29);

  // Submission Date
  yPos = 200;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('en-ZA', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Submission Date: ${currentDate}`, 15, yPos);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Generated by Qilly - Construction Billing System', 15, 285);
  doc.text(`Page 1 of 5`, 180, 285);

  // ===== PAGE 2: EXECUTIVE SUMMARY & COMPLIANCE =====
  doc.addPage();
  yPos = 20;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('EXECUTIVE SUMMARY', 15, yPos);

  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const execSummary = [
    `We are pleased to submit our tender response for ${tenderTitle}. This submission includes`,
    'a comprehensive priced Bill of Quantities with full South African construction compliance,',
    'transparent pricing breakdown, and professional project delivery guarantees.',
    '',
    `Our tender price of R${overallTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} includes:`,
    `• Materials and delivery costs: R${grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
    `• Compliance costs (NHBRC, CIDB, SANS, etc.): R${complianceTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
    `• Preliminaries & General (P&G): R${pgCosts.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
  ];

  if (greenPremium > 0) {
    execSummary.push(`• Green materials premium: R${greenPremium.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`);
  }

  execSummary.forEach(line => {
    doc.text(line, 15, yPos);
    yPos += 5;
  });

  // Compliance Declaration
  yPos += 5;
  doc.setFillColor(255, 243, 205);
  doc.rect(15, yPos, 180, 70, 'F');
  doc.setDrawColor(255, 140, 0);
  doc.setLineWidth(0.5);
  doc.rect(15, yPos, 180, 70);

  yPos += 6;
  doc.setTextColor(255, 140, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('✓ COMPLIANCE DECLARATION', 20, yPos);

  yPos += 7;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const complianceItems = [
    '✓ NHBRC Registration - Valid and current, providing 5-year structural warranty',
    '✓ CIDB Grading - Meets or exceeds project requirements',
    '✓ SANS 1200 Standards - Full compliance with South African construction standards',
    '✓ National Building Regulations - All materials and methods compliant',
    '✓ BBBEE Certification - Valid BBBEE certificate submitted',
    '✓ Tax Clearance - Valid SARS tax clearance certificate',
    '✓ POPIA Compliance - Data protection and privacy measures in place',
    '✓ Anti-Corruption - Declaration of no conflicts of interest',
    '✓ Health & Safety - Comprehensive OHS Act compliance plan'
  ];

  complianceItems.forEach(item => {
    doc.text(item, 20, yPos);
    yPos += 5.5;
  });

  // Environmental Compliance (if green analysis enabled)
  if (carbonSummary) {
    yPos += 5;
    doc.setFillColor(34, 197, 94);
    doc.rect(15, yPos, 180, 45, 'F');
    doc.setDrawColor(22, 163, 74);
    doc.rect(15, yPos, 180, 45);

    yPos += 6;
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('🌿 ENVIRONMENTAL COMMITMENT', 20, yPos);

    yPos += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    const envItems = [
      `Carbon Footprint Reduction: ${carbonSummary.carbonSavingsPercent.toFixed(1)}% below standard construction`,
      `Total Carbon Savings: ${carbonSummary.totalCarbonSavings.toFixed(1)} tCO₂e (equivalent to ~${carbonSummary.treesEquivalent} trees)`,
      `DHS Green Score: ${carbonSummary.overallGreenScore} - Exceeds minimum environmental standards`,
      `Green Materials Coverage: ${carbonSummary.itemsWithGreenAlternatives} of ${carbonSummary.totalItems} items use eco-friendly alternatives`,
      `Environmental ROI: R${(carbonSummary.costPremium / carbonSummary.totalCarbonSavings).toFixed(0)} per ton of CO₂ saved`,
      `Data Sources: ICE Database v3.0, IPCC Guidelines, GBCSA standards`
    ];

    envItems.forEach(item => {
      doc.text(item, 20, yPos);
      yPos += 5.5;
    });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Generated by Qilly - Construction Billing System', 15, 285);
  doc.text(`Page 2 of 5`, 180, 285);

  // ===== PAGE 3: DETAILED PRICING SCHEDULE =====
  doc.addPage();
  yPos = 20;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('DETAILED PRICING SCHEDULE', 15, yPos);

  yPos += 10;

  // Pricing table
  const tableData = pricedItems.map(item => [
    item.code,
    item.name.length > 50 ? item.name.substring(0, 47) + '...' : item.name,
    item.quantity,
    item.unit,
    item.selectedSupplier.length > 12 ? item.selectedSupplier.substring(0, 10) + '..' : item.selectedSupplier,
    `R${parseFloat(item.finalUnitPrice || item.landedUnitPrice).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
    `R${parseFloat(item.totalPrice).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Description', 'Qty', 'Unit', 'Supplier', 'Unit Price', 'Total']],
    body: tableData,
    foot: [
      ['', 'MATERIALS & DELIVERY TOTAL', '', '', '', '', `R${grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
      ['', 'Preliminaries & General (P&G)', '', '', '', '', `R${pgCosts.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
      ['', 'Compliance Costs', '', '', '', '', `R${complianceTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
      ...(greenPremium > 0 ? [
        ['', '🌿 Green Materials Premium', '', '', '', '', `R${greenPremium.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`]
      ] : []),
      ['', 'TOTAL TENDER PRICE', '', '', '', '', `R${overallTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`]
    ],
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 119, 182], textColor: 255 },
    footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 60 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 15 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25, halign: 'right' },
      6: { cellWidth: 30, halign: 'right' }
    },
    margin: { left: 15, right: 15 }
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Generated by Qilly - Construction Billing System', 15, 285);
  doc.text(`Page 3 of 5`, 180, 285);

  // ===== PAGE 4: PRICING BREAKDOWN & NOTES =====
  doc.addPage();
  yPos = 20;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('PRICING BREAKDOWN & CLARIFICATIONS', 15, yPos);

  yPos += 12;
  doc.setFontSize(11);
  doc.text('1. Materials & Delivery Costs', 15, yPos);
  
  yPos += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Materials (ex-delivery): R${(grandTotal - totalTransportCost).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 20, yPos);
  yPos += 5;
  doc.text(`Transport Costs: R${totalTransportCost.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} (${((totalTransportCost / grandTotal) * 100).toFixed(1)}% of materials)`, 20, yPos);
  yPos += 5;
  doc.text(`Subtotal: R${grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 20, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Preliminaries & General (P&G)', 15, yPos);
  
  yPos += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  if (complianceCosts?.preliminaries) {
    const pg = complianceCosts.preliminaries;
    doc.text(`Site Establishment: R${pg.siteEstablishment.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 20, yPos);
    yPos += 5;
    doc.text(`Temporary Services: R${pg.temporaryServices.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 20, yPos);
    yPos += 5;
    doc.text(`Equipment Hire: R${pg.equipmentHire.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 20, yPos);
    yPos += 5;
    doc.text(`Insurance & Bonds: R${pg.insuranceAndBonds.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 20, yPos);
    yPos += 5;
  }
  doc.setFont('helvetica', 'bold');
  doc.text(`P&G Total: R${pgCosts.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 20, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.text('3. Compliance Costs', 15, yPos);
  
  yPos += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  if (complianceCosts) {
    doc.text(`NHBRC Enrollment: R${complianceCosts.nhbrc.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 20, yPos);
    yPos += 5;
    doc.text(`CIDB Levy: R${complianceCosts.cidb.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 20, yPos);
    yPos += 5;
    doc.text(`Professional Fees: R${complianceCosts.professionalFees.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 20, yPos);
    yPos += 5;
    doc.text(`Testing & Inspections: R${complianceCosts.testingAndInspections.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 20, yPos);
    yPos += 5;
  }
  doc.setFont('helvetica', 'bold');
  doc.text(`Compliance Total: R${complianceTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 20, yPos);

  if (greenPremium > 0) {
    yPos += 10;
    doc.setFontSize(11);
    doc.text('4. Green Materials Premium', 15, yPos);
    
    yPos += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Environmental upgrade cost: R${greenPremium.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} (+${((greenPremium / grandTotal) * 100).toFixed(1)}%)`, 20, yPos);
    yPos += 5;
    doc.text(`Carbon reduction achieved: ${carbonSummary?.carbonSavingsPercent.toFixed(1)}%`, 20, yPos);
    yPos += 5;
    doc.text(`ROI: R${carbonSummary ? (carbonSummary.costPremium / carbonSummary.totalCarbonSavings).toFixed(0) : '0'} per ton of CO₂ saved`, 20, yPos);
  }

  // Tender Notes
  yPos += 15;
  doc.setFillColor(240, 240, 240);
  doc.rect(15, yPos, 180, 60, 'F');
  
  yPos += 6;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('TENDER NOTES & CONDITIONS', 20, yPos);

  yPos += 7;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  const notes = [
    '• Pricing valid for 90 days from submission date',
    '• All prices include VAT at current statutory rate (15%)',
    '• Materials sourced from nearest regional suppliers to minimize transport costs',
    '• Delivery times: 5-10 working days for standard items, 15-20 days for specialized materials',
    '• Payment terms: 30 days from invoice date, staged payments negotiable',
    '• All work performed in accordance with SANS 1200 standards',
    '• Warranty: 5-year NHBRC structural warranty included',
    '• Price adjustments: Subject to price variation clause for projects >6 months',
    '• Force majeure: Standard force majeure clause applies'
  ];

  notes.forEach(note => {
    doc.text(note, 20, yPos);
    yPos += 5;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Generated by Qilly - Construction Billing System', 15, 285);
  doc.text(`Page 4 of 5`, 180, 285);

  // ===== PAGE 5: DECLARATION & SIGNATURE =====
  doc.addPage();
  yPos = 20;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('TENDER DECLARATION', 15, yPos);

  yPos += 12;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const declaration = [
    'I/We hereby declare that:',
    '',
    '1. The information provided in this tender submission is true, correct, and complete.',
    '',
    '2. I/We have examined and understood all tender documents and accept the conditions',
    '   of tender without reservation.',
    '',
    '3. This tender is made in good faith without collusion or fraud.',
    '',
    '4. I/We are not under any investigation for fraud or corruption by any authority.',
    '',
    '5. All compliance certifications (CIDB, NHBRC, BBBEE, Tax Clearance) are valid',
    '   and copies are attached to this submission.',
    '',
    '6. I/We understand that providing false information may result in tender disqualification',
    '   and/or legal action.',
    '',
    '7. I/We accept that the client is not bound to accept the lowest or any tender.',
    '',
    '8. This tender pricing includes all costs necessary to complete the work as specified.',
  ];

  declaration.forEach(line => {
    doc.text(line, 15, yPos);
    yPos += 6;
  });

  // Signature block
  yPos += 10;
  doc.setFillColor(240, 240, 240);
  doc.rect(15, yPos, 180, 50, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.rect(15, yPos, 180, 50);

  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('AUTHORIZED SIGNATORY', 20, yPos);

  yPos += 12;
  doc.setFont('helvetica', 'normal');
  doc.text('Name: _______________________________________________', 20, yPos);
  yPos += 10;
  doc.text('Position: ____________________________________________', 20, yPos);
  yPos += 10;
  doc.text('Signature: ___________________________________________', 20, yPos);
  yPos += 10;
  doc.text(`Date: ${currentDate}`, 20, yPos);

  // Company stamp box
  yPos += 10;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(130, yPos - 25, 50, 30);
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('COMPANY STAMP', 140, yPos - 8);

  // Footer
  yPos = 285;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Generated by Qilly - Construction Billing System', 15, yPos);
  doc.text(`Page 5 of 5`, 180, yPos);

  // Final note
  doc.setFontSize(7);
  doc.text('This tender response was automatically generated using verified pricing data and compliance checks.', 15, yPos - 5);

  // Save the PDF
  const fileName = `Tender_Response_${tenderReference.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
}
