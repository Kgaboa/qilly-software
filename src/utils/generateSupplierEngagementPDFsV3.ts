import jsPDF from 'jspdf';

const PRIMARY_COLOR = '#00b4d8';
const SECONDARY_COLOR = '#0096c7';
const MUNICIPAL_COLOR = '#10b981'; // Green for multi-sector
const COMPLIANCE_COLOR = '#f59e0b'; // Amber for compliance sections

export function generateAPISpecMultiSectorPDF() {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  let currentPage = 1;
  let y = margin;
  
  const addNewPage = () => {
    doc.addPage();
    currentPage++;
    y = margin;
  };
  
  const addFooter = () => {
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Qilly API Specification v3.0 (Government & Multi-Sector Edition) - Page ${currentPage}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  };
  
  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - 25) {
      addFooter();
      addNewPage();
    }
  };
  
  // ========================================
  // TITLE PAGE
  // ========================================
  doc.setFillColor(16, 185, 129); // Green gradient
  doc.rect(0, 0, pageWidth, 90, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text('Qilly API Integration', pageWidth / 2, 25, { align: 'center' });
  doc.setFontSize(22);
  doc.text('Specification v3.0', pageWidth / 2, 38, { align: 'center' });
  doc.setFontSize(16);
  doc.text('Government & Multi-Sector Edition', pageWidth / 2, 50, { align: 'center' });
  doc.setFontSize(11);
  doc.text('National • Provincial • Municipal • SOE • Private Sector', pageWidth / 2, 62, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Official Technical Documentation', pageWidth / 2, 75, { align: 'center' });
  
  y = 105;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Document Information:', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const docInfo = [
    'Version: 3.0 (Government & Multi-Sector Edition)',
    'Last Updated: February 9, 2026',
    'Protocol: REST API (JSON)',
    'Authentication: OAuth 2.0 / API Key',
    'Compliance Coverage: All SA Construction Projects (Public & Private)'
  ];
  
  docInfo.forEach(info => {
    doc.text('• ' + info, margin + 5, y);
    y += 6;
  });
  
  y += 10;
  doc.setFontSize(10);
  const overview = doc.splitTextToSize('This document specifies technical requirements for suppliers to integrate their product catalog and pricing data with Qilly\'s automated BOQ pricing system. Version 3.0 includes comprehensive construction compliance features applicable to ALL South African construction projects: national government (PFMA), provincial government (PFMA), all 257 municipalities (MFMA), state-owned enterprises, and private sector.', contentWidth);
  doc.text(overview, margin, y);
  
  y += overview.length * 5 + 10;
  
  // Multi-Sector Coverage Badge
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'F');
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'S');
  
  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('✓ Universal Compliance Across All Sectors', pageWidth / 2, y + 8, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text('PFMA: National & Provincial Government | MFMA: All 257 Municipalities', pageWidth / 2, y + 15, { align: 'center' });
  doc.text('PPPFA/BBBEE: All Government Entities | NBR/POPIA: All South African Construction', pageWidth / 2, y + 21, { align: 'center' });
  doc.text('Private Sector: NBR, POPIA, Optional SANS 1200 & BBBEE', pageWidth / 2, y + 27, { align: 'center' });
  
  addFooter();
  addNewPage();
  
  // ========================================
  // TABLE OF CONTENTS
  // ========================================
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(18);
  doc.text('Table of Contents', margin, y);
  y += 12;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  const toc = [
    { section: '1. API Endpoint Requirements', page: '3' },
    { section: '2. Authentication & Security', page: '3-4' },
    { section: '3. Core Data Schema', page: '4-5' },
    { section: '4. Multi-Sector Compliance Features', page: '6-12', highlight: true },
    { section: '   4.1 SANS 1200 Compliance Data', page: '6' },
    { section: '   4.2 NBR Alignment Data (Mandatory All Sectors)', page: '7' },
    { section: '   4.3 AGRÉMENT Certification Data', page: '8' },
    { section: '   4.4 POPIA Compliance (Mandatory All Sectors)', page: '9' },
    { section: '   4.5 BBBEE Tracking (Mandatory Government)', page: '10' },
    { section: '   4.6 PFMA/MFMA Audit Trail Support', page: '11' },
    { section: '5. Sector-Specific Applicability Matrix', page: '12-13', highlight: true },
    { section: '   5.1 National Government (PFMA)', page: '12' },
    { section: '   5.2 Provincial Government (PFMA)', page: '12' },
    { section: '   5.3 Municipalities (MFMA)', page: '13' },
    { section: '   5.4 State-Owned Enterprises', page: '13' },
    { section: '   5.5 Private Sector', page: '13' },
    { section: '6. Daily Sync Schedule', page: '14' },
    { section: '7. Price Validation System', page: '14-15' },
    { section: '8. Error Handling', page: '15' },
    { section: '9. Testing & Go-Live', page: '16' },
    { section: '10. Monitoring & SLAs', page: '16-17' },
    { section: '11. Support & Contact', page: '17' }
  ];
  
  toc.forEach(item => {
    if (item.highlight) {
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(margin - 2, y - 4, contentWidth + 4, 7, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }
    doc.text(item.section, margin + 2, y);
    doc.text(item.page, pageWidth - margin - 15, y);
    y += 6;
  });
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 1. API ENDPOINT REQUIREMENTS
  // ========================================
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(16);
  doc.text('1. API Endpoint Requirements', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Base URL Format:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setFillColor(40, 40, 40);
  doc.roundedRect(margin, y, contentWidth, 8, 1, 1, 'F');
  doc.setTextColor(0, 255, 0);
  doc.text('https://api.supplier-name.com/v3/qilly/products', margin + 3, y + 5);
  y += 12;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Required Specifications:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const specs = [
    'Protocol: HTTPS (TLS 1.2 or higher)',
    'Method: GET',
    'Response Format: JSON (UTF-8 encoded)',
    'Rate Limiting: Minimum 1000 requests/day',
    'Response Time: < 2 seconds (95th percentile)',
    'Uptime SLA: 99.5% monthly uptime',
    'Data Retention: 7-year audit logs (PFMA/MFMA compliance) ← Multi-Sector!'
  ];
  
  specs.forEach(spec => {
    const isNew = spec.includes('Multi-Sector');
    if (isNew) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
    }
    doc.text('✓ ' + spec, margin + 5, y);
    if (isNew) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }
    y += 5;
  });
  
  checkPageBreak(60);
  y += 8;
  
  // ========================================
  // 2. AUTHENTICATION & SECURITY
  // ========================================
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(16);
  doc.text('2. Authentication & Security', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Option A: API Key (Recommended)', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  doc.text('Request Header:', margin, y);
  y += 5;
  doc.setFillColor(40, 40, 40);
  doc.roundedRect(margin, y, contentWidth, 8, 1, 1, 'F');
  doc.setTextColor(0, 255, 0);
  doc.text('Authorization: Bearer YOUR_API_KEY_HERE', margin + 3, y + 5);
  y += 12;
  
  doc.setTextColor(0, 0, 0);
  const apiKeyReqs = [
    'API keys must be rotatable without service disruption',
    'Minimum key length: 32 characters',
    'Qilly can provide dedicated IP for whitelisting (optional)',
    'Keys must be encrypted in transit & at rest (POPIA mandatory for all sectors)'
  ];
  
  apiKeyReqs.forEach(req => {
    const lines = doc.splitTextToSize('• ' + req, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.5;
  });
  
  checkPageBreak(50);
  y += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Option B: OAuth 2.0 Client Credentials', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  doc.text('Token Endpoint:', margin, y);
  y += 5;
  doc.setFillColor(40, 40, 40);
  doc.roundedRect(margin, y, contentWidth, 8, 1, 1, 'F');
  doc.setTextColor(0, 255, 0);
  doc.text('POST https://api.supplier-name.com/oauth/token', margin + 3, y + 5);
  y += 15;
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 3. CORE DATA SCHEMA
  // ========================================
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(16);
  doc.text('3. Core Data Schema', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('JSON Response Structure (Multi-Sector Compliance):', margin, y);
  y += 6;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setFillColor(40, 40, 40);
  const codeHeight = 125;
  doc.roundedRect(margin, y, contentWidth, codeHeight, 1, 1, 'F');
  doc.setTextColor(0, 255, 0);
  
  const jsonCode = [
    '{',
    '  "metadata": {',
    '    "supplier_id": "BUCO_ZA",',
    '    "supplier_name": "Buco South Africa",',
    '    "timestamp": "2026-02-09T06:00:00+02:00",',
    '    "total_products": 15420,',
    '    "compliance_version": "3.0",  // Multi-Sector Edition',
    '    // MANDATORY for Government (National, Provincial, Municipal, SOE)',
    '    "bbbee_level": "4",  // PPPFA applies to ALL government',
    '    "bbbee_certificate_number": "BEE2025-12345",',
    '    "bbbee_expiry_date": "2027-06-30",',
    '    // OPTIONAL for Private Sector (unless corporate BEE policy)',
    '    "sector": "government"  // Options: government, private',
    '  },',
    '  "products": [',
    '    {',
    '      "sku": "PPC-CEM-50KG-001",',
    '      "description": "Portland Cement 50kg PPC SABS Certified",',
    '      "brand": "PPC",',
    '      "unit": "bag",',
    '      "price_excl_vat": 89.50,',
    '      "province": "Gauteng",',
    '      "last_updated": "2026-02-09T06:00:00+02:00",',
    '      // OPTIONAL: Compliance fields (recommended for government visibility)',
    '      "compliance": {',
    '        "sans_1200_compliant": true,  // Optional (all sectors)',
    '        "sans_standards": ["SANS 50197"],',
    '        "nbr_compliant": true,  // MANDATORY by SA law (all sectors)',
    '        "agrement_certificate": "2023/001",  // If applicable',
    '        "agrement_expiry": "2028-12-31"',
    '      }',
    '    }',
    '  ]',
    '}'
  ];
  
  let codeY = y + 5;
  jsonCode.forEach(line => {
    doc.text(line, margin + 3, codeY);
    codeY += 3.7;
  });
  
  y += codeHeight + 10;
  
  checkPageBreak(100);
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Core Required Fields (All Sectors):', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const requiredFields = [
    'sku (string): Unique product identifier',
    'description (string): Product name/description',
    'unit (string): Unit of measure (bag, m³, m², kg, ton, each)',
    'price_excl_vat (decimal): Price excluding VAT (2 decimal places)',
    'province (string): South African province',
    'last_updated (ISO 8601): Timestamp of last price update'
  ];
  
  requiredFields.forEach(field => {
    const lines = doc.splitTextToSize('• ' + field, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.5;
  });
  
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Sector-Specific Required Fields:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  
  const sectorFields = [
    'Government Sector: bbbee_level, bbbee_certificate_number, bbbee_expiry_date (MANDATORY)',
    'All Sectors: nbr_compliant = true (mandatory by National Building Regulations Act)',
    'All Sectors: POPIA compliance (data encryption, DPA signature)'
  ];
  
  sectorFields.forEach(field => {
    const lines = doc.splitTextToSize('• ' + field, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.5;
  });
  
  checkPageBreak(40);
  y += 8;
  
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(margin, y, contentWidth, 25, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 180, 216);
  doc.text('Allowed Province Values:', margin + 5, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  const provinces = 'Gauteng, Western Cape, KwaZulu-Natal, Eastern Cape, Free State, Limpopo, Mpumalanga, Northern Cape, North West';
  const provinceLines = doc.splitTextToSize(provinces, contentWidth - 10);
  doc.text(provinceLines, margin + 5, y + 12);
  
  y += 30;
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 4. MULTI-SECTOR COMPLIANCE FEATURES
  // ========================================
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageWidth, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('4. Multi-Sector Construction Compliance Features', pageWidth / 2, 10, { align: 'center' });
  
  y = 25;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const complianceIntro = doc.splitTextToSize('Version 3.0 introduces comprehensive construction compliance features applicable to ALL South African construction projects. These features serve national government (PFMA), provincial government (PFMA), all 257 municipalities (MFMA), state-owned enterprises, and private sector. Compliance data fields are MANDATORY for government suppliers, OPTIONAL for private sector (except NBR & POPIA which are mandatory by law).', contentWidth);
  doc.text(complianceIntro, margin, y);
  y += complianceIntro.length * 5 + 10;
  
  // Feature summary table
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, contentWidth, 48, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129);
  doc.text('6 Compliance Features - Universal Applicability:', margin + 5, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  
  const features = [
    '✓ SANS 1200: Product standard compliance (optional all sectors, recommended govt)',
    '✓ NBR (National Building Regulations): MANDATORY by law for ALL SA construction',
    '✓ AGRÉMENT: Product certification (optional, if product is certified)',
    '✓ POPIA: Data protection - MANDATORY by law for ALL organizations in SA',
    '✓ BBBEE: MANDATORY for all government (PPPFA) - optional private sector',
    '✓ PFMA/MFMA: National/Provincial (PFMA) + All 257 Municipalities (MFMA)',
    '',
    'Sector Coverage: National (PFMA) | Provincial (PFMA) | Municipal (MFMA) | SOE (PFMA) | Private (NBR/POPIA)'
  ];
  
  let featureY = y + 12;
  features.forEach(feature => {
    if (feature === '') {
      featureY += 2;
    } else {
      doc.text(feature, margin + 5, featureY);
      featureY += 5;
    }
  });
  
  y += 53;
  
  checkPageBreak(60);
  
  // ========================================
  // 4.1 SANS 1200 COMPLIANCE DATA
  // ========================================
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(14);
  doc.text('4.1 SANS 1200 Compliance Data (All Sectors)', margin, y);
  y += 8;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const sans1200Desc = doc.splitTextToSize('SANS 1200 is the South African National Standard for construction procurement. Applies to all construction but ESPECIALLY important for government projects (national, provincial, municipal).', contentWidth);
  doc.text(sans1200Desc, margin, y);
  y += sans1200Desc.length * 4.5 + 6;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Compliance Fields (add to product object):', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  doc.setFillColor(40, 40, 40);
  doc.roundedRect(margin, y, contentWidth, 32, 1, 1, 'F');
  doc.setTextColor(0, 255, 0);
  
  const sans1200Code = [
    '"compliance": {',
    '  "sans_1200_compliant": true,  // Boolean (optional)',
    '  "sans_standards": ["SANS 50197", "SANS 227"],  // Array of SANS codes',
    '  "technical_specifications": "Portland Cement CEM I 42.5N",',
    '  "test_certificate_number": "TEST-2026-001",  // Optional',
    '  "test_date": "2026-01-15"  // Optional',
    '}'
  ];
  
  let sans1200Y = y + 4;
  sans1200Code.forEach(line => {
    doc.text(line, margin + 3, sans1200Y);
    sans1200Y += 4.5;
  });
  
  y += 36;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Sector Applicability:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const sans1200Sectors = [
    '✓ National Govt (DHS, DoE, DoH, DPW): Highly recommended',
    '✓ Provincial Govt: Highly recommended',
    '✓ Municipalities (257): Highly recommended for housing/infrastructure',
    '✓ SOEs (Eskom, Transnet, SANRAL): Often specified',
    '✓ Private Sector: Optional (quality assurance)'
  ];
  sans1200Sectors.forEach(sector => {
    doc.text(sector, margin + 3, y);
    y += 4.5;
  });
  
  y += 6;
  
  checkPageBreak(80);
  
  // ========================================
  // 4.2 NBR ALIGNMENT DATA (MANDATORY ALL SECTORS)
  // ========================================
  doc.setTextColor(220, 38, 38); // Red for mandatory
  doc.setFontSize(14);
  doc.text('4.2 NBR Alignment (MANDATORY BY LAW - All Sectors)', margin, y);
  y += 8;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const nbrDesc = doc.splitTextToSize('NBR compliance is MANDATORY by the National Building Regulations and Building Standards Act, 1977. ALL construction in South Africa (government & private) must comply. Enforced by local authorities (municipalities).', contentWidth);
  doc.text(nbrDesc, margin, y);
  y += nbrDesc.length * 4.5 + 6;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Compliance Fields:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  doc.setFillColor(40, 40, 40);
  doc.roundedRect(margin, y, contentWidth, 28, 1, 1, 'F');
  doc.setTextColor(0, 255, 0);
  
  const nbrCode = [
    '"compliance": {',
    '  "nbr_compliant": true,  // MANDATORY Boolean',
    '  "nbr_parts": ["A", "H"],  // Parts A-V (e.g., Part A: General, Part H: Foundations)',
    '  "fire_rating": "Class A",  // Optional: Fire safety classification',
    '  "structural_rating": "Category 1"  // Optional',
    '}'
  ];
  
  let nbrY = y + 4;
  nbrCode.forEach(line => {
    doc.text(line, margin + 3, nbrY);
    nbrY += 4.5;
  });
  
  y += 32;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Sector Applicability:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const nbrSectors = [
    '✓ ALL SECTORS: Mandatory by law (National Building Regulations Act)',
    '✓ Enforced by: Municipalities (building plan approval)',
    '✓ National Govt: Mandatory',
    '✓ Provincial Govt: Mandatory',
    '✓ Municipalities: Mandatory',
    '✓ Private Sector: Mandatory'
  ];
  nbrSectors.forEach(sector => {
    doc.text(sector, margin + 3, y);
    y += 4.5;
  });
  
  y += 6;
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 4.3 AGRÉMENT CERTIFICATION DATA
  // ========================================
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(14);
  doc.text('4.3 AGRÉMENT South Africa Certification (All Sectors)', margin, y);
  y += 8;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const agrementDesc = doc.splitTextToSize('AGRÉMENT South Africa provides independent certification for innovative construction products. Required for non-traditional materials on government projects. Also used in private sector for quality assurance.', contentWidth);
  doc.text(agrementDesc, margin, y);
  y += agrementDesc.length * 4.5 + 6;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Compliance Fields:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  doc.setFillColor(40, 40, 40);
  doc.roundedRect(margin, y, contentWidth, 28, 1, 1, 'F');
  doc.setTextColor(0, 255, 0);
  
  const agrementCode = [
    '"compliance": {',
    '  "agrement_certified": true,  // Boolean (if product has cert)',
    '  "agrement_certificate": "2023/001",  // Certificate number',
    '  "agrement_expiry": "2028-12-31",  // ISO 8601 date',
    '  "agrement_scope": "Cement-based waterproofing compound"  // Optional',
    '}'
  ];
  
  let agrementY = y + 4;
  agrementCode.forEach(line => {
    doc.text(line, margin + 3, agrementY);
    agrementY += 4.5;
  });
  
  y += 32;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Sector Applicability:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const agrementSectors = [
    '✓ National Govt: Required for innovative/non-traditional materials',
    '✓ Provincial Govt: Required for innovative materials',
    '✓ Municipalities: Required for innovative materials',
    '✓ Private Sector: Often specified for new products',
    '⚠ Only applicable if product HAS AGRÉMENT certification'
  ];
  agrementSectors.forEach(sector => {
    doc.text(sector, margin + 3, y);
    y += 4.5;
  });
  
  y += 10;
  
  checkPageBreak(80);
  
  // ========================================
  // 4.4 POPIA COMPLIANCE (MANDATORY ALL SECTORS)
  // ========================================
  doc.setTextColor(220, 38, 38); // Red for mandatory
  doc.setFontSize(14);
  doc.text('4.4 POPIA Compliance (MANDATORY BY LAW - All Sectors)', margin, y);
  y += 8;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const popiaDesc = doc.splitTextToSize('POPIA (Protection of Personal Information Act) compliance is MANDATORY for ALL organizations in South Africa since July 2020. This is a NATIONAL DATA PRIVACY LAW - not government-specific. Penalty: Up to R10 million.', contentWidth);
  doc.text(popiaDesc, margin, y);
  y += popiaDesc.length * 4.5 + 6;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Supplier Requirements (MANDATORY):', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const popiaReqs = [
    '✓ Data Encryption: All API data encrypted in transit (TLS 1.2+) & at rest',
    '✓ Data Minimization: Only collect necessary product/pricing data',
    '✓ Retention Policy: Delete outdated data after 7 years',
    '✓ Access Controls: Role-based access to API endpoints',
    '✓ Breach Notification: Notify Qilly within 72 hours of breach',
    '✓ Data Processing Agreement: Sign DPA before integration (Qilly provides)'
  ];
  
  popiaReqs.forEach(req => {
    const lines = doc.splitTextToSize(req, contentWidth - 5);
    doc.text(lines, margin + 3, y);
    y += lines.length * 4.5;
  });
  
  y += 6;
  
  doc.setFillColor(255, 240, 240);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(220, 38, 38);
  doc.text('⚠ CRITICAL: POPIA applies to ALL sectors (government & private)', margin + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Non-compliance penalty: R10M or 10 years imprisonment. Qilly provides DPA template.', margin + 5, y + 13);
  
  y += 22;
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 4.5 BBBEE TRACKING (MANDATORY GOVERNMENT)
  // ========================================
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(14);
  doc.text('4.5 BBBEE Tracking (Mandatory Govt, Optional Private)', margin, y);
  y += 8;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const bbbeeDesc = doc.splitTextToSize('BBBEE tracking is MANDATORY for ALL government procurement via PPPFA (Preferential Procurement Policy Framework Act). This includes national, provincial, municipal, and SOE procurement. OPTIONAL for private sector (unless corporate BEE policy).', contentWidth);
  doc.text(bbbeeDesc, margin, y);
  y += bbbeeDesc.length * 4.5 + 6;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('BBBEE Data (add to metadata object):', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  doc.setFillColor(40, 40, 40);
  doc.roundedRect(margin, y, contentWidth, 36, 1, 1, 'F');
  doc.setTextColor(0, 255, 0);
  
  const bbbeeCode = [
    '"metadata": {',
    '  "supplier_id": "BUCO_ZA",',
    '  "bbbee_level": "4",  // MANDATORY for govt: BEE Level 1-8 or "Non-Compliant"',
    '  "bbbee_certificate_number": "BEE2025-12345",  // MANDATORY for govt',
    '  "bbbee_expiry_date": "2027-06-30",  // MANDATORY for govt: ISO 8601 date',
    '  "bbbee_recognition_percentage": 100,  // Auto-calculated by Qilly',
    '  "bbbee_verification_agency": "SANAS Accredited Agency",  // Optional',
    '  "sector": "government",  // Options: government, private',
    '  ...',
    '}'
  ];
  
  let bbbeeY = y + 4;
  bbbeeCode.forEach(line => {
    doc.text(line, margin + 3, bbbeeY);
    bbbeeY += 4;
  });
  
  y += 40;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('BEE Recognition % (reference):', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'F');
  const bbbeeTable = [
    'Level 1: 135% | Level 2: 125% | Level 3: 110% | Level 4: 100%',
    'Level 5: 80% | Level 6: 60% | Level 7: 50% | Level 8: 10%',
    'Non-Compliant: 0%'
  ];
  
  let tableY = y + 6;
  bbbeeTable.forEach(line => {
    doc.text(line, margin + 5, tableY);
    tableY += 5;
  });
  
  y += 32;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Sector Applicability (via PPPFA):', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const bbbeeSectors = [
    '✓ National Govt: MANDATORY (PPPFA applies)',
    '✓ Provincial Govt: MANDATORY (PPPFA applies)',
    '✓ ALL 257 Municipalities: MANDATORY (MFMA Section 112 + PPPFA)',
    '✓ SOEs: MANDATORY (PFMA Schedule 2 entities)',
    '⚠ Private Sector: OPTIONAL (unless corporate BEE policy)'
  ];
  bbbeeSectors.forEach(sector => {
    doc.text(sector, margin + 3, y);
    y += 4.5;
  });
  
  y += 8;
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 4.6 PFMA/MFMA AUDIT TRAIL SUPPORT
  // ========================================
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(14);
  doc.text('4.6 PFMA/MFMA Audit Trail Support (Automatic)', margin, y);
  y += 8;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const pfmaDesc = doc.splitTextToSize('PFMA (Public Finance Management Act) applies to national/provincial govt. MFMA (Municipal Finance Management Act) applies to ALL 257 municipalities. Both require 7-year audit trails. Qilly handles this AUTOMATICALLY - no supplier action required!', contentWidth);
  doc.text(pfmaDesc, margin, y);
  y += pfmaDesc.length * 4.5 + 6;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Act Coverage:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'F');
  const actCoverage = [
    'PFMA (Public Finance Management Act, 1999):',
    '  • National Government Departments (all)',
    '  • Provincial Government Departments (all 9 provinces)',
    '  • National & Provincial Public Entities',
    '  • SOEs (Eskom, Transnet, PRASA, SANRAL, etc.)',
    '',
    'MFMA (Municipal Finance Management Act, 2003):',
    '  • 8 Metropolitan Municipalities (Joburg, Cape Town, eThekwini, Tshwane, etc.)',
    '  • 205 Local Municipalities',
    '  • 44 District Municipalities',
    '  • Municipal Entities'
  ];
  
  let actY = y + 6;
  actCoverage.forEach(line => {
    if (line === '') {
      actY += 2;
    } else {
      doc.text(line, margin + 5, actY);
      actY += 4;
    }
  });
  
  y += 42;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('What Qilly Logs Automatically (7-Year Retention):', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const pfmaReqs = [
    '✓ Price History: Every price change with timestamp',
    '✓ Immutable Records: Blockchain-inspired logs (cannot be edited)',
    '✓ API Response Logging: Every sync call logged',
    '✓ Change Detection: Automatic flagging of unusual changes (>20%)',
    '✓ Auditor-General Reports: PFMA/MFMA-compliant export'
  ];
  
  pfmaReqs.forEach(req => {
    doc.text(req, margin + 3, y);
    y += 4.5;
  });
  
  y += 6;
  
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(22, 163, 74);
  doc.text('✓ NO ACTION REQUIRED: Qilly automatically creates audit trails', margin + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Suppliers provide price data. Qilly handles all audit logging for PFMA & MFMA compliance.', margin + 5, y + 13);
  
  y += 22;
  
  checkPageBreak(60);
  
  // Compliance Summary
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(margin, y, contentWidth, 40, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('🎯 Multi-Sector Compliance Summary', margin + 5, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('✓ SANS 1200 & AGRÉMENT: Optional product fields (recommended govt projects)', margin + 5, y + 15);
  doc.text('✓ NBR: MANDATORY by law (all sectors - National Building Regulations Act)', margin + 5, y + 20);
  doc.text('✓ POPIA: MANDATORY by law (all sectors - Protection of Personal Information Act)', margin + 5, y + 25);
  doc.text('✓ BBBEE: MANDATORY govt (PPPFA) - National, Provincial, Municipal, SOE', margin + 5, y + 30);
  doc.text('✓ PFMA/MFMA: Automatic audit trails (National/Provincial=PFMA, Municipal=MFMA)', margin + 5, y + 35);
  
  y += 45;
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 5. SECTOR-SPECIFIC APPLICABILITY MATRIX
  // ========================================
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageWidth, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('5. Sector-Specific Applicability Matrix', pageWidth / 2, 10, { align: 'center' });
  
  y = 25;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const matrixIntro = doc.splitTextToSize('This section clarifies which compliance features apply to which sectors in South Africa. Use this to determine your supplier requirements based on your target market.', contentWidth);
  doc.text(matrixIntro, margin, y);
  y += matrixIntro.length * 5 + 10;
  
  // Create applicability table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setFillColor(240, 253, 244);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.text('Feature', margin + 2, y + 5);
  doc.text('National', margin + 40, y + 5);
  doc.text('Provincial', margin + 65, y + 5);
  doc.text('Municipal', margin + 92, y + 5);
  doc.text('SOE', margin + 120, y + 5);
  doc.text('Private', margin + 140, y + 5);
  y += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  const matrixData = [
    { feature: 'SANS 1200', national: 'Rec', provincial: 'Rec', municipal: 'Rec', soe: 'Rec', private: 'Opt' },
    { feature: 'NBR', national: 'REQ', provincial: 'REQ', municipal: 'REQ', soe: 'REQ', private: 'REQ' },
    { feature: 'AGRÉMENT', national: 'If cert', provincial: 'If cert', municipal: 'If cert', soe: 'If cert', private: 'If cert' },
    { feature: 'POPIA', national: 'REQ', provincial: 'REQ', municipal: 'REQ', soe: 'REQ', private: 'REQ' },
    { feature: 'BBBEE', national: 'REQ', provincial: 'REQ', municipal: 'REQ', soe: 'REQ', private: 'Opt' },
    { feature: 'Audit Trail', national: 'PFMA', provincial: 'PFMA', municipal: 'MFMA', soe: 'PFMA', private: 'N/A' }
  ];
  
  matrixData.forEach((row, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, y, contentWidth, 6, 'F');
    }
    doc.text(row.feature, margin + 2, y + 4);
    doc.text(row.national, margin + 42, y + 4);
    doc.text(row.provincial, margin + 67, y + 4);
    doc.text(row.municipal, margin + 94, y + 4);
    doc.text(row.soe, margin + 122, y + 4);
    doc.text(row.private, margin + 142, y + 4);
    y += 6;
  });
  
  y += 8;
  
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Legend: REQ = Required by law | Rec = Recommended for govt projects | Opt = Optional | If cert = If product has certification', margin, y);
  y += 10;
  
  // Municipality Details
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(12);
  doc.text('5.3 Municipal Sector Detail (MFMA)', margin, y);
  y += 8;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  const municipalDesc = doc.splitTextToSize('South Africa has 257 municipalities governed by MFMA (Municipal Finance Management Act, 2003). These represent R200B+ annual construction spend - the LARGEST government construction market. MFMA Section 112 requires compliance with PPPFA (preferential procurement), making BBBEE tracking MANDATORY for all municipal suppliers.', contentWidth);
  doc.text(municipalDesc, margin, y);
  y += municipalDesc.length * 4.5 + 8;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('257 Municipalities Breakdown:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const municipalities = [
    '8 Metropolitan Municipalities (Metros):',
    '  • City of Johannesburg (R15B+ annual budget)',
    '  • City of Cape Town (R52B annual budget)',
    '  • eThekwini - Durban (R45B annual budget)',
    '  • City of Tshwane - Pretoria (R42B annual budget)',
    '  • Ekurhuleni - East Rand (R35B annual budget)',
    '  • Nelson Mandela Bay - PE (R14B annual budget)',
    '  • Buffalo City - East London (R9B annual budget)',
    '  • Mangaung - Bloemfontein (R7B annual budget)',
    '',
    '205 Local Municipalities (cities, towns)',
    '44 District Municipalities (rural areas)'
  ];
  
  municipalities.forEach(line => {
    if (line === '') {
      y += 2;
    } else {
      const lines = doc.splitTextToSize(line, contentWidth - 5);
      doc.text(lines, margin + 3, y);
      y += lines.length * 4.5;
    }
  });
  
  y += 8;
  
  doc.setFillColor(255, 248, 225);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(245, 158, 11);
  doc.text('🏛️ Municipal Market Opportunity: R200B+ annual spend (4x national govt!)', margin + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Qilly API v3.0 explicitly supports ALL 257 municipalities with MFMA audit compliance', margin + 5, y + 13);
  
  y += 22;
  
  addFooter();
  addNewPage();
  
  // Continue with remaining sections (Daily Sync, Price Validation, Error Handling, etc.)
  // These are similar to v2.0 but with multi-sector language
  
  // ========================================
  // 6. DAILY SYNC SCHEDULE
  // ========================================
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(16);
  doc.text('6. Daily Sync Schedule', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Qilly\'s Sync Timing:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const syncTiming = [
    'Daily price sync: 06:00 SAST',
    'Fallback sync: 12:00 SAST (if morning fails)',
    'Weekly compliance sync: Sundays 06:00 SAST (BBBEE expiry, AGRÉMENT expiry)',
    'Duration: Typically 30-90 seconds per supplier',
    'Timeout: 120 seconds maximum'
  ];
  
  syncTiming.forEach(item => {
    doc.text('• ' + item, margin + 5, y);
    y += 5;
  });
  
  y += 10;
  
  // ========================================
  // 7. PRICE VALIDATION SYSTEM
  // ========================================
  checkPageBreak(80);
  
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(16);
  doc.text('7. Price Validation System (Multi-Sector)', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const validationIntro = doc.splitTextToSize('Qilly employs 6-layer price validation to detect errors and prevent fraud across all sectors. Validation Layer 5 includes compliance checks (BBBEE expiry, AGRÉMENT validity) for government suppliers.', contentWidth);
  doc.text(validationIntro, margin, y);
  y += validationIntro.length * 4.5 + 8;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Validation Layers:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const validationLayers = [
    'Layer 1: Format Validation (data types, required fields, price > 0)',
    'Layer 2: Historical Comparison (flag changes >20%)',
    'Layer 3: Cross-Supplier Benchmarking (flag outliers)',
    'Layer 4: Provincial Variance Check (unrealistic regional differences)',
    'Layer 5: Compliance Validation (BBBEE expiry, AGRÉMENT validity, NBR compliance)',
    'Layer 6: Manual Review (Qilly team reviews flagged prices)'
  ];
  
  validationLayers.forEach(layer => {
    const lines = doc.splitTextToSize('• ' + layer, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.5;
  });
  
  y += 8;
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 8. ERROR HANDLING
  // ========================================
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(16);
  doc.text('8. Error Handling & Status Codes', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Standard HTTP Status Codes:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const statusCodes = [
    '200 OK: Successful request, products returned',
    '304 Not Modified: No changes since last sync',
    '400 Bad Request: Invalid request parameters',
    '401 Unauthorized: Authentication failed',
    '403 Forbidden: Valid auth but insufficient permissions',
    '422 Unprocessable Entity: Compliance validation failed (govt suppliers)',
    '429 Too Many Requests: Rate limit exceeded',
    '500 Internal Server Error: Supplier API error',
    '503 Service Unavailable: Temporary maintenance'
  ];
  
  statusCodes.forEach(code => {
    const lines = doc.splitTextToSize('• ' + code, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.5;
  });
  
  y += 10;
  
  // ========================================
  // 9. TESTING & GO-LIVE
  // ========================================
  checkPageBreak(80);
  
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(16);
  doc.text('9. Testing & Go-Live Checklist', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Pre-Production Testing (Qilly Staging):', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const testingSteps = [
    '✓ Authentication: Verify API key or OAuth 2.0',
    '✓ Data Format: Validate JSON schema',
    '✓ Price Accuracy: Test sample products',
    '✓ Compliance Data: Verify BBBEE (if govt), NBR, POPIA',
    '✓ Error Handling: Test failures & timeouts',
    '✓ Performance: Measure response times (<2 sec)',
    '✓ End-to-End: Complete sync → Qilly staging → Mock BOQ'
  ];
  
  testingSteps.forEach(step => {
    doc.text(step, margin + 5, y);
    y += 4.5;
  });
  
  y += 10;
  
  // ========================================
  // 10. MONITORING & SLAs
  // ========================================
  checkPageBreak(60);
  
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(16);
  doc.text('10. Monitoring & Service Level Agreements', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Qilly Monitoring:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const monitoring = [
    '• Sync Success Rate: 99.5% target',
    '• API Response Time: < 2 seconds (95th percentile)',
    '• Data Freshness: Alerts if >24 hours old',
    '• Compliance Expiry: 30-day alerts (BBBEE/AGRÉMENT)',
    '• Price Anomalies: Flag >20% changes',
    '• Downtime: Automatic fallback to last known good data'
  ];
  
  monitoring.forEach(item => {
    doc.text(item, margin + 5, y);
    y += 4.5;
  });
  
  y += 10;
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 11. SUPPORT & CONTACT
  // ========================================
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(16);
  doc.text('11. Support & Contact Information', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Technical Support:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  doc.text('• API Integration: api@qilly.co.za', margin + 5, y);
  y += 5;
  doc.text('• Compliance Questions: compliance@qilly.co.za', margin + 5, y);
  y += 5;
  doc.text('• Municipal Inquiries: municipal@qilly.co.za (NEW!)', margin + 5, y);
  y += 5;
  doc.text('• BBBEE/AGRÉMENT Verification: verification@qilly.co.za', margin + 5, y);
  y += 5;
  doc.text('• General Inquiries: hello@qilly.co.za', margin + 5, y);
  y += 5;
  doc.text('• Emergency (API down): +27 XX XXX XXXX (24/7)', margin + 5, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Documentation & Resources:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  doc.text('• API Sandbox: https://sandbox.qilly.co.za/api/docs', margin + 5, y);
  y += 5;
  doc.text('• Compliance Guide: https://qilly.co.za/compliance', margin + 5, y);
  y += 5;
  doc.text('• Municipal Portal: https://qilly.co.za/municipal (NEW!)', margin + 5, y);
  y += 5;
  doc.text('• MFMA Compliance: https://qilly.co.za/mfma (NEW!)', margin + 5, y);
  y += 5;
  doc.text('• Developer Portal: https://developers.qilly.co.za', margin + 5, y);
  y += 5;
  doc.text('• Status Page: https://status.qilly.co.za', margin + 5, y);
  y += 15;
  
  // Final CTA
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(margin, y, contentWidth, 35, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Ready to Integrate Across All Sectors?', pageWidth / 2, y + 10, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Serving National Govt • Provincial Govt • ALL 257 Municipalities • SOEs • Private Sector', pageWidth / 2, y + 18, { align: 'center' });
  doc.text('Contact our API team: api@qilly.co.za | Municipal inquiries: municipal@qilly.co.za', pageWidth / 2, y + 24, { align: 'center' });
  doc.text('Average integration time: 4-7 weeks (core) + 2-3 weeks (compliance)', pageWidth / 2, y + 30, { align: 'center' });
  
  addFooter();
  
  // Save the PDF
  doc.save('Qilly-API-Spec-v3.0-Multi-Sector-Edition.pdf');
}
