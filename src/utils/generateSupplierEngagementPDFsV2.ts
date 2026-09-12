import jsPDF from 'jspdf';

const PRIMARY_COLOR = '#00b4d8';
const SECONDARY_COLOR = '#0096c7';
const COMPLIANCE_COLOR = '#f59e0b'; // Amber for compliance sections

export function generateAPISpecPDFWithCompliance() {
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
    doc.text(`Qilly API Specification v2.0 (DHS Compliance Edition) - Page ${currentPage}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
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
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, 80, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text('Qilly API Integration', pageWidth / 2, 30, { align: 'center' });
  doc.setFontSize(20);
  doc.text('Specification v2.0', pageWidth / 2, 45, { align: 'center' });
  doc.setFontSize(14);
  doc.text('with DHS Construction Compliance Features', pageWidth / 2, 58, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Official Technical Documentation', pageWidth / 2, 70, { align: 'center' });
  
  y = 95;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Document Information:', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const docInfo = [
    'Version: 2.0 (Compliance Edition)',
    'Last Updated: February 9, 2026',
    'Protocol: REST API (JSON)',
    'Authentication: OAuth 2.0 / API Key',
    'DHS Compliance: SANS 1200 • NBR • AGRÉMENT • POPIA • BBBEE • PFMA/MFMA'
  ];
  
  docInfo.forEach(info => {
    doc.text('• ' + info, margin + 5, y);
    y += 6;
  });
  
  y += 10;
  doc.setFontSize(10);
  const overview = doc.splitTextToSize('This document specifies technical requirements for suppliers to integrate their product catalog and pricing data with Qilly\'s automated BOQ pricing system. Version 2.0 includes comprehensive DHS construction compliance features supporting government procurement standards across South Africa.', contentWidth);
  doc.text(overview, margin, y);
  
  y += overview.length * 5 + 10;
  
  // Compliance Badge
  doc.setFillColor(245, 158, 11);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('✓ First-of-its-kind API with integrated government compliance checking', pageWidth / 2, y + 8, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Supporting DHS housing projects with automated regulatory validation', pageWidth / 2, y + 14, { align: 'center' });
  
  addFooter();
  addNewPage();
  
  // ========================================
  // TABLE OF CONTENTS
  // ========================================
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(18);
  doc.text('Table of Contents', margin, y);
  y += 12;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  const toc = [
    { section: '1. API Endpoint Requirements', page: '3' },
    { section: '2. Authentication', page: '3-4' },
    { section: '3. Core Data Schema', page: '4-5' },
    { section: '4. DHS Compliance Features (NEW!)', page: '6-10', highlight: true },
    { section: '   4.1 SANS 1200 Compliance Data', page: '6' },
    { section: '   4.2 NBR Alignment Data', page: '7' },
    { section: '   4.3 AGRÉMENT Certification Data', page: '8' },
    { section: '   4.4 POPIA Compliance Requirements', page: '8' },
    { section: '   4.5 BBBEE Tracking Data', page: '9' },
    { section: '   4.6 PFMA/MFMA Audit Trail Support', page: '10' },
    { section: '5. Daily Sync Schedule', page: '11' },
    { section: '6. Price Validation System', page: '11-12' },
    { section: '7. Error Handling', page: '12' },
    { section: '8. Testing & Go-Live', page: '13' },
    { section: '9. Monitoring & SLAs', page: '13-14' },
    { section: '10. Support & Contact', page: '14' }
  ];
  
  toc.forEach(item => {
    if (item.highlight) {
      doc.setFillColor(255, 248, 225);
      doc.roundedRect(margin - 2, y - 4, contentWidth + 4, 7, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 158, 11);
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
  doc.setTextColor(0, 180, 216);
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
  doc.text('https://api.supplier-name.com/v2/qilly/products', margin + 3, y + 5);
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
    'Data Retention: Compliance audit logs (7 years minimum) ← NEW!'
  ];
  
  specs.forEach(spec => {
    const isNew = spec.includes('NEW!');
    if (isNew) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 158, 11);
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
  // 2. AUTHENTICATION
  // ========================================
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('2. Authentication', margin, y);
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
    'Keys must be encrypted in transit and at rest (POPIA compliance) ← NEW!'
  ];
  
  apiKeyReqs.forEach(req => {
    const isNew = req.includes('NEW!');
    if (isNew) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 158, 11);
    }
    const lines = doc.splitTextToSize('• ' + req, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.5;
    if (isNew) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }
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
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('3. Core Data Schema', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('JSON Response Structure (with Compliance Extensions):', margin, y);
  y += 6;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setFillColor(40, 40, 40);
  const codeHeight = 120;
  doc.roundedRect(margin, y, contentWidth, codeHeight, 1, 1, 'F');
  doc.setTextColor(0, 255, 0);
  
  const jsonCode = [
    '{',
    '  "metadata": {',
    '    "supplier_id": "BUCO_ZA",',
    '    "supplier_name": "Buco South Africa",',
    '    "timestamp": "2026-02-09T06:00:00+02:00",',
    '    "total_products": 15420,',
    '    "compliance_version": "2.0",  // NEW: DHS compliance support',
    '    "bbbee_level": "4",  // NEW: BEE Level for supplier',
    '    "bbbee_certificate_number": "BEE2025-12345",  // NEW',
    '    "bbbee_expiry_date": "2027-06-30"  // NEW',
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
    '      // NEW: Compliance fields (optional but recommended)',
    '      "compliance": {',
    '        "sans_1200_compliant": true,',
    '        "sans_standards": ["SANS 50197"],',
    '        "nbr_compliant": true,',
    '        "agrement_certificate": "2023/001",',
    '        "agrement_expiry": "2028-12-31"',
    '      }',
    '    }',
    '  ]',
    '}'
  ];
  
  let codeY = y + 5;
  jsonCode.forEach(line => {
    doc.text(line, margin + 3, codeY);
    codeY += 3.8;
  });
  
  y += codeHeight + 10;
  
  checkPageBreak(100);
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Core Required Fields:', margin, y);
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
  doc.text('Optional Fields (Recommended):', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  
  const optionalFields = [
    'brand (string): Brand name - improves matching accuracy',
    'category (string): Product category',
    'stock_status (enum): in_stock, out_of_stock, low_stock'
  ];
  
  optionalFields.forEach(field => {
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
  // 4. DHS COMPLIANCE FEATURES (NEW!)
  // ========================================
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 0, pageWidth, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('4. DHS Construction Compliance Features', pageWidth / 2, 10, { align: 'center' });
  
  y = 25;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const complianceIntro = doc.splitTextToSize('Version 2.0 of the Qilly API introduces comprehensive Department of Human Settlements (DHS) compliance features. These features enable automated verification of government procurement standards, ensuring housing projects meet regulatory requirements. While compliance data fields are OPTIONAL, suppliers providing this data will receive PREMIUM visibility on DHS projects.', contentWidth);
  doc.text(complianceIntro, margin, y);
  y += complianceIntro.length * 5 + 10;
  
  // Feature summary table
  doc.setFillColor(255, 248, 225);
  doc.roundedRect(margin, y, contentWidth, 40, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(245, 158, 11);
  doc.text('6 Compliance Features Supported:', margin + 5, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  
  const features = [
    '✓ SANS 1200: Product standard compliance verification',
    '✓ NBR (National Building Regulations): Building code alignment',
    '✓ AGRÉMENT: Product certification tracking',
    '✓ POPIA: Data protection & security compliance',
    '✓ BBBEE: Black Economic Empowerment tracking',
    '✓ PFMA/MFMA: Public finance audit trail support'
  ];
  
  let featureY = y + 12;
  features.forEach(feature => {
    doc.text(feature, margin + 5, featureY);
    featureY += 5;
  });
  
  y += 45;
  
  checkPageBreak(60);
  
  // ========================================
  // 4.1 SANS 1200 COMPLIANCE DATA
  // ========================================
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(14);
  doc.text('4.1 SANS 1200 Compliance Data', margin, y);
  y += 8;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const sans1200Desc = doc.splitTextToSize('SANS 1200 is the South African National Standard for construction procurement. Products meeting SANS 1200 specifications receive priority for DHS housing projects.', contentWidth);
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
    '  "sans_1200_compliant": true,  // Boolean',
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
  doc.text('DHS Value:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const sans1200Value = doc.splitTextToSize('• Automated compliance checking (99.6% faster than manual verification)\n• Ensures materials meet government housing specifications\n• Reduces risk of non-compliant material procurement', contentWidth - 5);
  doc.text(sans1200Value, margin + 3, y);
  y += sans1200Value.length * 4 + 8;
  
  checkPageBreak(80);
  
  // ========================================
  // 4.2 NBR ALIGNMENT DATA
  // ========================================
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(14);
  doc.text('4.2 NBR (National Building Regulations) Alignment Data', margin, y);
  y += 8;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const nbrDesc = doc.splitTextToSize('NBR compliance ensures products meet South African building codes and safety standards mandated by the National Building Regulations and Building Standards Act.', contentWidth);
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
    '  "nbr_compliant": true,  // Boolean',
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
  doc.text('DHS Value:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const nbrValue = doc.splitTextToSize('• Guarantees products meet mandatory building code requirements\n• Prevents specification errors that cause project delays\n• Supports legal compliance for government contracts', contentWidth - 5);
  doc.text(nbrValue, margin + 3, y);
  y += nbrValue.length * 4 + 8;
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 4.3 AGRÉMENT CERTIFICATION DATA
  // ========================================
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(14);
  doc.text('4.3 AGRÉMENT South Africa Certification Data', margin, y);
  y += 8;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const agrementDesc = doc.splitTextToSize('AGRÉMENT South Africa provides independent certification for innovative construction products. DHS projects often require AGRÉMENT certification for non-traditional materials.', contentWidth);
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
    '  "agrement_certified": true,  // Boolean',
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
  doc.text('DHS Value:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const agrementValue = doc.splitTextToSize('• Automated verification of product certifications\n• Prevents procurement of uncertified innovative products\n• Tracks certificate expiry to avoid non-compliant purchases', contentWidth - 5);
  doc.text(agrementValue, margin + 3, y);
  y += agrementValue.length * 4 + 10;
  
  checkPageBreak(80);
  
  // ========================================
  // 4.4 POPIA COMPLIANCE REQUIREMENTS
  // ========================================
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(14);
  doc.text('4.4 POPIA (Protection of Personal Information Act) Compliance', margin, y);
  y += 8;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const popiaDesc = doc.splitTextToSize('POPIA compliance is MANDATORY for all suppliers. This is a system-wide requirement ensuring data protection and privacy for government procurement data.', contentWidth);
  doc.text(popiaDesc, margin, y);
  y += popiaDesc.length * 4.5 + 6;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Supplier Requirements:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const popiaReqs = [
    '✓ Data Encryption: All API data must be encrypted in transit (TLS 1.2+) and at rest',
    '✓ Data Minimization: Only collect necessary product/pricing data',
    '✓ Retention Policy: Delete outdated price data after 7 years (audit requirement)',
    '✓ Access Controls: Implement role-based access to API endpoints',
    '✓ Breach Notification: Notify Qilly within 72 hours of any data breach',
    '✓ Data Processing Agreement: Sign DPA before API integration (provided by Qilly)'
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
  doc.text('⚠ CRITICAL: Non-compliance with POPIA can result in penalties up to R10 million', margin + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Qilly provides a standard Data Processing Agreement template for all suppliers', margin + 5, y + 13);
  
  y += 22;
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 4.5 BBBEE TRACKING DATA
  // ========================================
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(14);
  doc.text('4.5 BBBEE (Broad-Based Black Economic Empowerment) Tracking', margin, y);
  y += 8;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const bbbeeDesc = doc.splitTextToSize('BBBEE tracking is REQUIRED for DHS preferential procurement. Government projects must achieve 60%+ BEE-compliant procurement. Suppliers must provide current BEE status.', contentWidth);
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
    '  "bbbee_level": "4",  // REQUIRED: BEE Level 1-8, or "Non-Compliant"',
    '  "bbbee_certificate_number": "BEE2025-12345",  // REQUIRED',
    '  "bbbee_expiry_date": "2027-06-30",  // REQUIRED: ISO 8601 date',
    '  "bbbee_recognition_percentage": 100,  // Auto-calculated by level',
    '  "bbbee_verification_agency": "SANAS Accredited Agency",  // Optional',
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
  doc.text('BEE Recognition Percentages (reference):', margin, y);
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
  doc.text('DHS Value:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const bbbeeValue = doc.splitTextToSize('• Automated BEE compliance calculation for every BOQ\n• Real-time tracking of preferential procurement targets (60%+ required)\n• Prevents non-compliant supplier selection on government projects\n• Supports transformation goals for DHS housing programs', contentWidth - 5);
  doc.text(bbbeeValue, margin + 3, y);
  y += bbbeeValue.length * 4 + 8;
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 4.6 PFMA/MFMA AUDIT TRAIL SUPPORT
  // ========================================
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(14);
  doc.text('4.6 PFMA/MFMA Compliance & Audit Trail Support', margin, y);
  y += 8;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const pfmaDesc = doc.splitTextToSize('The Public Finance Management Act (PFMA) and Municipal Finance Management Act (MFMA) require comprehensive audit trails for government procurement. Qilly automatically logs all supplier price changes.', contentWidth);
  doc.text(pfmaDesc, margin, y);
  y += pfmaDesc.length * 4.5 + 6;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Audit Trail Requirements (Qilly handles this automatically):', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const pfmaReqs = [
    '✓ Price History: Qilly logs every price change with timestamp',
    '✓ Immutable Records: Blockchain-inspired audit logs (cannot be edited)',
    '✓ 7-Year Retention: All pricing data stored for government audit period',
    '✓ API Response Logging: Every sync call logged with request/response data',
    '✓ Change Detection: Automatic flagging of unusual price changes (>20%)',
    '✓ Auditor-General Reports: Qilly generates PFMA-compliant audit reports'
  ];
  
  pfmaReqs.forEach(req => {
    const lines = doc.splitTextToSize(req, contentWidth - 5);
    doc.text(lines, margin + 3, y);
    y += lines.length * 4.5;
  });
  
  y += 6;
  
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(22, 163, 74);
  doc.text('✓ NO ACTION REQUIRED: Qilly automatically creates PFMA/MFMA-compliant audit trails', margin + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Suppliers simply provide price data via API. Qilly handles all audit logging and compliance.', margin + 5, y + 13);
  doc.text('Audit trails include: User actions, price changes, system events, API calls, approvals, timestamps', margin + 5, y + 18);
  
  y += 26;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DHS Value:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const pfmaValue = doc.splitTextToSize('• Auditor-General compliance (clean audits for DHS)\n• Fraud prevention through transparent price tracking\n• Anti-corruption safeguards for government procurement\n• Complete traceability for every rand spent on housing projects', contentWidth - 5);
  doc.text(pfmaValue, margin + 3, y);
  y += pfmaValue.length * 4 + 10;
  
  checkPageBreak(60);
  
  // Compliance Summary
  doc.setFillColor(245, 158, 11);
  doc.roundedRect(margin, y, contentWidth, 35, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('🎯 Compliance Features Summary', margin + 5, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('✓ SANS 1200 & NBR: Optional product-level fields (recommended for DHS visibility)', margin + 5, y + 15);
  doc.text('✓ AGRÉMENT: Optional certification tracking (required for innovative products)', margin + 5, y + 20);
  doc.text('✓ POPIA: MANDATORY data protection (all suppliers must sign DPA)', margin + 5, y + 25);
  doc.text('✓ BBBEE: REQUIRED supplier-level metadata (BEE level, certificate, expiry)', margin + 5, y + 30);
  doc.text('✓ PFMA/MFMA: Automatic (Qilly handles all audit trail logging)', margin + 5, y + 35);
  
  y += 40;
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 5. DAILY SYNC SCHEDULE
  // ========================================
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('5. Daily Sync Schedule', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Qilly\'s Sync Timing:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const syncTiming = [
    'Daily sync: 06:00 SAST',
    'Fallback sync: 12:00 SAST (if morning fails)',
    'Compliance data sync: Once weekly (Sundays 06:00 SAST) ← NEW!',
    'Duration: Typically 30-90 seconds per supplier',
    'Timeout: 120 seconds maximum'
  ];
  
  syncTiming.forEach(item => {
    const isNew = item.includes('NEW!');
    if (isNew) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 158, 11);
    }
    doc.text('• ' + item, margin + 5, y);
    y += 5;
    if (isNew) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }
  });
  
  y += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('What Qilly Syncs:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const syncItems = [
    'Daily: Product prices, stock status, availability',
    'Weekly: BBBEE certificate expiry, AGRÉMENT certificate expiry, compliance flags ← NEW!',
    'On-demand: Manual sync via Qilly admin dashboard (for urgent updates)'
  ];
  
  syncItems.forEach(item => {
    const isNew = item.includes('NEW!');
    if (isNew) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 158, 11);
    }
    const lines = doc.splitTextToSize('• ' + item, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.5;
    if (isNew) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }
  });
  
  y += 10;
  
  // ========================================
  // 6. PRICE VALIDATION SYSTEM
  // ========================================
  checkPageBreak(80);
  
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('6. Price Validation System', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const validationIntro = doc.splitTextToSize('Qilly employs multi-layer price validation to detect errors and prevent fraud. All prices are validated before being made available to contractors.', contentWidth);
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
    'Layer 2: Historical Comparison (flag changes >20% from last sync)',
    'Layer 3: Cross-Supplier Benchmarking (flag outliers vs market average)',
    'Layer 4: Provincial Variance Check (flag unrealistic regional differences)',
    'Layer 5: Compliance Validation (verify BBBEE expiry, AGRÉMENT validity) ← NEW!',
    'Layer 6: Manual Review (Qilly team reviews flagged prices before approval)'
  ];
  
  validationLayers.forEach(layer => {
    const isNew = layer.includes('NEW!');
    if (isNew) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 158, 11);
    }
    const lines = doc.splitTextToSize('• ' + layer, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.5;
    if (isNew) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }
  });
  
  y += 8;
  
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 180, 216);
  doc.text('ℹ Anti-Fraud Protection: Suspicious prices are quarantined and require supplier confirmation', margin + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Example: Cement price drops 50% overnight → Qilly emails supplier to verify before updating', margin + 5, y + 13);
  
  y += 22;
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 7. ERROR HANDLING
  // ========================================
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('7. Error Handling & Status Codes', margin, y);
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
    '304 Not Modified: No price changes since last sync (efficiency optimization)',
    '400 Bad Request: Invalid request parameters',
    '401 Unauthorized: Authentication failed',
    '403 Forbidden: Valid auth but insufficient permissions',
    '422 Unprocessable Entity: Valid request but compliance validation failed ← NEW!',
    '429 Too Many Requests: Rate limit exceeded',
    '500 Internal Server Error: Supplier API error',
    '503 Service Unavailable: Temporary maintenance'
  ];
  
  statusCodes.forEach(code => {
    const isNew = code.includes('NEW!');
    if (isNew) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 158, 11);
    }
    const lines = doc.splitTextToSize('• ' + code, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.5;
    if (isNew) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }
  });
  
  y += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Error Response Format:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  doc.setFillColor(40, 40, 40);
  doc.roundedRect(margin, y, contentWidth, 28, 1, 1, 'F');
  doc.setTextColor(0, 255, 0);
  
  const errorCode = [
    '{',
    '  "error": {',
    '    "code": "COMPLIANCE_VALIDATION_FAILED",',
    '    "message": "BBBEE certificate has expired",',
    '    "field": "bbbee_expiry_date",',
    '    "details": "Expiry date 2026-01-01 is in the past"',
    '  }',
    '}'
  ];
  
  let errorY = y + 4;
  errorCode.forEach(line => {
    doc.text(line, margin + 3, errorY);
    errorY += 3.5;
  });
  
  y += 32;
  
  checkPageBreak(60);
  
  // ========================================
  // 8. TESTING & GO-LIVE
  // ========================================
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('8. Testing & Go-Live Checklist', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Pre-Production Testing (Qilly Staging Environment):', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const testingSteps = [
    '✓ Authentication: Verify API key or OAuth 2.0 token exchange',
    '✓ Data Format: Validate JSON schema compliance',
    '✓ Price Accuracy: Test sample products against your catalog',
    '✓ Compliance Data: Verify BBBEE, AGRÉMENT, SANS 1200 fields (if applicable) ← NEW!',
    '✓ Error Handling: Test authentication failures, timeouts, invalid data',
    '✓ Performance: Measure response times (<2 sec target)',
    '✓ End-to-End: Complete sync from your API → Qilly staging → Mock BOQ pricing'
  ];
  
  testingSteps.forEach(step => {
    const isNew = step.includes('NEW!');
    if (isNew) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 158, 11);
    }
    const lines = doc.splitTextToSize(step, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.5;
    if (isNew) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }
  });
  
  y += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Go-Live Approval:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const goLive = doc.splitTextToSize('After successful testing, Qilly activates your supplier profile on the production platform. First sync occurs at 06:00 SAST the following day. Average onboarding timeline: 4-7 weeks from initial contact to live production.', contentWidth);
  doc.text(goLive, margin, y);
  y += goLive.length * 4.5 + 10;
  
  addFooter();
  addNewPage();
  
  // ========================================
  // 9. MONITORING & SLAs
  // ========================================
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('9. Monitoring & Service Level Agreements', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Qilly Monitoring (what we track):', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const monitoring = [
    '• Sync Success Rate: Target 99.5% successful daily syncs',
    '• API Response Time: < 2 seconds (95th percentile)',
    '• Data Freshness: Alerts if supplier data >24 hours old',
    '• Compliance Expiry: Automated alerts 30 days before BBBEE/AGRÉMENT expiry ← NEW!',
    '• Price Anomalies: Flagged price changes >20% for manual review',
    '• Downtime: Automatic fallback to last known good data if API unavailable'
  ];
  
  monitoring.forEach(item => {
    const isNew = item.includes('NEW!');
    if (isNew) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 158, 11);
    }
    const lines = doc.splitTextToSize(item, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.5;
    if (isNew) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }
  });
  
  y += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Supplier SLA Commitments:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const sla = [
    '✓ Uptime: 99.5% monthly uptime (max 3.6 hours downtime/month)',
    '✓ Response Time: <2 seconds for API requests (95th percentile)',
    '✓ Data Accuracy: Prices must match your current catalog',
    '✓ BBBEE Currency: Certificate must be valid (not expired) ← NEW!',
    '✓ Change Notifications: Notify Qilly 48 hours before major catalog changes',
    '✓ Incident Response: Acknowledge API issues within 2 hours during business hours'
  ];
  
  sla.forEach(item => {
    const isNew = item.includes('NEW!');
    if (isNew) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 158, 11);
    }
    const lines = doc.splitTextToSize(item, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.5;
    if (isNew) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }
  });
  
  y += 10;
  
  // ========================================
  // 10. SUPPORT & CONTACT
  // ========================================
  checkPageBreak(60);
  
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('10. Support & Contact Information', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Technical Support:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  doc.text('• API Integration Support: api@qilly.co.za', margin + 5, y);
  y += 5;
  doc.text('• Compliance Questions: compliance@qilly.co.za (NEW!)', margin + 5, y);
  y += 5;
  doc.text('• BBBEE/AGRÉMENT Verification: verification@qilly.co.za (NEW!)', margin + 5, y);
  y += 5;
  doc.text('• General Inquiries: hello@qilly.co.za', margin + 5, y);
  y += 5;
  doc.text('• Emergency (API down): +27 XX XXX XXXX (24/7 on-call)', margin + 5, y);
  y += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Documentation & Resources:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  doc.text('• API Sandbox: https://sandbox.qilly.co.za/api/docs', margin + 5, y);
  y += 5;
  doc.text('• Compliance Guide: https://qilly.co.za/compliance (NEW!)', margin + 5, y);
  y += 5;
  doc.text('• BBBEE Verification Process: https://qilly.co.za/bbbee (NEW!)', margin + 5, y);
  y += 5;
  doc.text('• Developer Portal: https://developers.qilly.co.za', margin + 5, y);
  y += 5;
  doc.text('• Status Page: https://status.qilly.co.za', margin + 5, y);
  y += 15;
  
  // Final CTA
  doc.setFillColor(0, 180, 216);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Ready to Integrate?', pageWidth / 2, y + 10, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Contact our API team to schedule your onboarding call and receive', pageWidth / 2, y + 17, { align: 'center' });
  doc.text('sandbox credentials. Average integration time: 4-7 weeks.', pageWidth / 2, y + 22, { align: 'center' });
  
  addFooter();
  
  // Save the PDF
  doc.save('Qilly-API-Spec-v2.0-DHS-Compliance.pdf');
}
