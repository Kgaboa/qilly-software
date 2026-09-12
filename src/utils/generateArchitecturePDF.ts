import jsPDF from 'jspdf';

export function generateArchitecturePDF() {
  const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.text('QILLY', pageWidth / 2, 50, { align: 'center' });
  
  doc.setFontSize(28);
  doc.setFont('helvetica', 'normal');
  doc.text('System Architecture Document', pageWidth / 2, 75, { align: 'center' });
  
  doc.setFontSize(18);
  doc.text('Construction Billing Intelligence Platform', pageWidth / 2, 95, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('Automated BOQ Pricing • 9 SA Provinces • 100% Compliance', pageWidth / 2, 110, { align: 'center' });
  
  doc.setFontSize(12);
  const today = new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Generated: ${today}`, pageWidth / 2, 130, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text('Version 2.0 • February 2026', pageWidth / 2, 140, { align: 'center' });
  
  // ==========================================
  // PAGE 2: SYSTEM OVERVIEW
  // ==========================================
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('System Overview', pageWidth / 2, 15, { align: 'center' });
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Qilly revolutionizes construction billing with intelligent automation and comprehensive compliance', pageWidth / 2, 23, { align: 'center' });
  
  let yPos = 35;
  const leftMargin = 15;
  const boxWidth = 85;
  const boxHeight = 50;
  
  // Key Capabilities Box 1
  doc.setFillColor(219, 234, 254);
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.roundedRect(leftMargin, yPos, boxWidth, boxHeight, 3, 3, 'FD');
  
  doc.setTextColor(30, 64, 175);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('⚡ Core Capability', leftMargin + 3, yPos + 8);
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('• Automated BOQ pricing in <5 minutes', leftMargin + 3, yPos + 16);
  doc.text('• 3,000+ construction items matched', leftMargin + 3, yPos + 21);
  doc.text('• Multi-supplier price comparison', leftMargin + 3, yPos + 26);
  doc.text('• 100% accurate pricing guarantee', leftMargin + 3, yPos + 31);
  doc.text('• Live supplier data integration', leftMargin + 3, yPos + 36);
  doc.text('• Excel/CSV upload & download', leftMargin + 3, yPos + 41);
  
  // Key Capabilities Box 2
  doc.setFillColor(220, 252, 231);
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(leftMargin + boxWidth + 10, yPos, boxWidth, boxHeight, 3, 3, 'FD');
  
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('🌍 Regional Coverage', leftMargin + boxWidth + 13, yPos + 8);
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('• All 9 South African provinces', leftMargin + boxWidth + 13, yPos + 16);
  doc.text('• Provincial pricing optimization', leftMargin + boxWidth + 13, yPos + 21);
  doc.text('• Regional supplier networks', leftMargin + boxWidth + 13, yPos + 26);
  doc.text('• Transport cost calculations', leftMargin + boxWidth + 13, yPos + 31);
  doc.text('• Local market dynamics', leftMargin + boxWidth + 13, yPos + 36);
  doc.text('• Future price projections', leftMargin + boxWidth + 13, yPos + 41);
  
  // Key Capabilities Box 3
  doc.setFillColor(254, 249, 195);
  doc.setDrawColor(234, 179, 8);
  doc.roundedRect(leftMargin + (boxWidth + 10) * 2, yPos, boxWidth, boxHeight, 3, 3, 'FD');
  
  doc.setTextColor(113, 63, 18);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('✅ Compliance Features', leftMargin + (boxWidth + 10) * 2 + 3, yPos + 8);
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('• SANS 1200 verification', leftMargin + (boxWidth + 10) * 2 + 3, yPos + 16);
  doc.text('• NBR building compliance', leftMargin + (boxWidth + 10) * 2 + 3, yPos + 21);
  doc.text('• AGRÉMENT certification', leftMargin + (boxWidth + 10) * 2 + 3, yPos + 26);
  doc.text('• BBBEE tracking system', leftMargin + (boxWidth + 10) * 2 + 3, yPos + 31);
  doc.text('• POPIA data protection', leftMargin + (boxWidth + 10) * 2 + 3, yPos + 36);
  doc.text('• Anti-corruption measures', leftMargin + (boxWidth + 10) * 2 + 3, yPos + 41);
  
  // Statistics Section
  yPos += boxHeight + 15;
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Performance Metrics', leftMargin, yPos);
  
  yPos += 10;
  const stats = [
    { label: 'Processing Time', value: '<5 minutes', desc: '99.9% faster than manual (2-4 weeks)' },
    { label: 'Cost Savings', value: '85-95%', desc: 'Professional fees eliminated (R10M-R43M annually)' },
    { label: 'Accuracy Rate', value: '100%', desc: 'Guaranteed pricing accuracy with live data' },
    { label: 'Supplier Coverage', value: '8+ major', desc: 'Buco, Builders, Macsteel, Lafarge, PPC, etc.' },
    { label: 'Item Database', value: '3,000+', desc: 'Construction materials & services matched' },
    { label: 'Compliance', value: '6 features', desc: 'SANS, NBR, AGRÉMENT, BBBEE, POPIA, PFMA' }
  ];
  
  const statBoxWidth = 86;
  let xPos = leftMargin;
  
  stats.slice(0, 3).forEach((stat) => {
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(191, 219, 254);
    doc.setLineWidth(0.3);
    doc.roundedRect(xPos, yPos, statBoxWidth, 22, 2, 2, 'FD');
    
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(stat.value, xPos + 3, yPos + 8);
    
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(stat.label, xPos + 3, yPos + 14);
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(stat.desc, statBoxWidth - 6);
    doc.text(descLines, xPos + 3, yPos + 18);
    
    xPos += statBoxWidth + 7;
  });
  
  yPos += 27;
  xPos = leftMargin;
  
  stats.slice(3, 6).forEach((stat) => {
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(191, 219, 254);
    doc.setLineWidth(0.3);
    doc.roundedRect(xPos, yPos, statBoxWidth, 22, 2, 2, 'FD');
    
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(stat.value, xPos + 3, yPos + 8);
    
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(stat.label, xPos + 3, yPos + 14);
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(stat.desc, statBoxWidth - 6);
    doc.text(descLines, xPos + 3, yPos + 18);
    
    xPos += statBoxWidth + 7;
  });
  
  // ==========================================
  // PAGE 3: HIGH-LEVEL ARCHITECTURE
  // ==========================================
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('High-Level System Architecture', pageWidth / 2, 15, { align: 'center' });
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Multi-tier architecture with clear separation of concerns and scalability', pageWidth / 2, 23, { align: 'center' });
  
  yPos = 35;
  const layerBoxWidth = 250;
  const layerBoxHeight = 32;
  
  // Layer 1: Presentation Layer
  doc.setFillColor(219, 234, 254);
  doc.setDrawColor(191, 219, 254);
  doc.setLineWidth(0.5);
  doc.roundedRect(leftMargin, yPos, layerBoxWidth, layerBoxHeight, 3, 3, 'FD');
  
  doc.setTextColor(30, 64, 175);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('LAYER 1: PRESENTATION (Frontend)', leftMargin + 5, yPos + 10);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('• React 18 + TypeScript + Tailwind CSS v4', leftMargin + 5, yPos + 17);
  doc.text('• Responsive web interface (desktop & mobile)', leftMargin + 5, yPos + 22);
  doc.text('• User authentication & session management', leftMargin + 5, yPos + 27);
  
  // Arrow
  yPos += layerBoxHeight + 3;
  doc.setDrawColor(0, 180, 216);
  doc.setLineWidth(1.5);
  doc.line(leftMargin + layerBoxWidth / 2, yPos, leftMargin + layerBoxWidth / 2, yPos + 5);
  doc.triangle(leftMargin + layerBoxWidth / 2, yPos + 5, leftMargin + layerBoxWidth / 2 - 3, yPos + 2, leftMargin + layerBoxWidth / 2 + 3, yPos + 2, 'F');
  yPos += 5;
  
  // Layer 2: Application Layer
  doc.setFillColor(220, 252, 231);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(leftMargin, yPos, layerBoxWidth, layerBoxHeight, 3, 3, 'FD');
  
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('LAYER 2: APPLICATION (Business Logic)', leftMargin + 5, yPos + 10);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('• BOQ parser & intelligent item matching algorithm', leftMargin + 5, yPos + 17);
  doc.text('• Multi-supplier search & price comparison engine', leftMargin + 5, yPos + 22);
  doc.text('• RESTful API services & compliance verification', leftMargin + 5, yPos + 27);
  
  // Arrow
  yPos += layerBoxHeight + 3;
  doc.setDrawColor(0, 180, 216);
  doc.line(leftMargin + layerBoxWidth / 2, yPos, leftMargin + layerBoxWidth / 2, yPos + 5);
  doc.triangle(leftMargin + layerBoxWidth / 2, yPos + 5, leftMargin + layerBoxWidth / 2 - 3, yPos + 2, leftMargin + layerBoxWidth / 2 + 3, yPos + 2, 'F');
  yPos += 5;
  
  // Layer 3: Data Layer
  doc.setFillColor(243, 232, 255);
  doc.setDrawColor(233, 213, 255);
  doc.roundedRect(leftMargin, yPos, layerBoxWidth, layerBoxHeight, 3, 3, 'FD');
  
  doc.setTextColor(76, 29, 149);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('LAYER 3: DATA (Storage & Persistence)', leftMargin + 5, yPos + 10);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('• PostgreSQL database (Supabase hosted)', leftMargin + 5, yPos + 17);
  doc.text('• User data, BOQs, supplier catalogs, pricing history', leftMargin + 5, yPos + 22);
  doc.text('• Provincial pricing data for all 9 SA provinces', leftMargin + 5, yPos + 27);
  
  // Arrow
  yPos += layerBoxHeight + 3;
  doc.setDrawColor(0, 180, 216);
  doc.line(leftMargin + layerBoxWidth / 2, yPos, leftMargin + layerBoxWidth / 2, yPos + 5);
  doc.triangle(leftMargin + layerBoxWidth / 2, yPos + 5, leftMargin + layerBoxWidth / 2 - 3, yPos + 2, leftMargin + layerBoxWidth / 2 + 3, yPos + 2, 'F');
  yPos += 5;
  
  // Layer 4: Infrastructure Layer
  doc.setFillColor(255, 237, 213);
  doc.setDrawColor(254, 215, 170);
  doc.roundedRect(leftMargin, yPos, layerBoxWidth, layerBoxHeight, 3, 3, 'FD');
  
  doc.setTextColor(124, 45, 18);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('LAYER 4: INFRASTRUCTURE (Hosting & Security)', leftMargin + 5, yPos + 10);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('• Vercel cloud hosting with auto-scaling & CDN', leftMargin + 5, yPos + 17);
  doc.text('• SSL/TLS encryption, DDoS protection, WAF', leftMargin + 5, yPos + 22);
  doc.text('• 99.99% uptime SLA, monitoring, error tracking', leftMargin + 5, yPos + 27);
  
  // ==========================================
  // PAGE 4: DATA FLOW DIAGRAM
  // ==========================================
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill of Quantities Processing Flow', pageWidth / 2, 15, { align: 'center' });
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Step-by-step journey from BOQ upload to fully priced download', pageWidth / 2, 23, { align: 'center' });
  
  const steps = [
    {
      num: 1,
      title: 'File Upload & Validation',
      desc: 'User uploads Excel/CSV containing Bill of Quantities',
      detail: 'Validates: File format, column structure (ITEM NO, DESCRIPTION, UNIT, QUANTITY, RATE, AMOUNT)',
      color: { bg: [219, 234, 254], border: [191, 219, 254], text: [30, 64, 175] }
    },
    {
      num: 2,
      title: 'Data Parsing & Extraction',
      desc: 'System parses file and extracts item descriptions',
      detail: 'Example: "Portland Cement 50kg PPC" extracted from ITEM NO column for matching',
      color: { bg: [220, 252, 231], border: [187, 247, 208], text: [20, 83, 45] }
    },
    {
      num: 3,
      title: 'Intelligent Item Matching',
      desc: 'AI algorithm matches 3,000+ construction items',
      detail: 'Uses fuzzy matching, synonyms, SANS 1200 codes, product specifications',
      color: { bg: [243, 232, 255], border: [233, 213, 255], text: [76, 29, 149] }
    },
    {
      num: 4,
      title: 'Multi-Supplier Search',
      desc: 'Searches all supplier catalogs across 9 provinces',
      detail: 'Suppliers: Buco, Builders, Macsteel, Lafarge, PPC, Cashbuild, etc.',
      color: { bg: [255, 237, 213], border: [254, 215, 170], text: [124, 45, 18] }
    },
    {
      num: 5,
      title: 'Provincial Price Optimization',
      desc: 'Adjusts prices based on project location',
      detail: 'Factors: Transport costs, regional market dynamics, supplier availability',
      color: { bg: [254, 226, 226], border: [254, 202, 202], text: [127, 29, 29] }
    },
    {
      num: 6,
      title: 'Compliance Verification',
      desc: 'Validates against all 6 compliance features',
      detail: 'SANS 1200, NBR, AGRÉMENT, BBBEE, POPIA, Anti-corruption checks',
      color: { bg: [254, 249, 195], border: [254, 240, 138], text: [113, 63, 18] }
    },
    {
      num: 7,
      title: 'Best Price Selection',
      desc: 'Algorithm selects optimal supplier per item',
      detail: 'Criteria: Lowest price, availability, delivery time, supplier reliability, BBBEE',
      color: { bg: [219, 234, 254], border: [191, 219, 254], text: [30, 64, 175] }
    },
    {
      num: 8,
      title: 'BOQ Generation & Download',
      desc: 'Fully priced, compliant BOQ generated in <5 minutes',
      detail: 'Output: Excel/CSV with RATE/AMOUNT populated, supplier details, audit trail',
      color: { bg: [220, 252, 231], border: [187, 247, 208], text: [20, 83, 45] }
    }
  ];
  
  yPos = 35;
  const stepHeight = 20;
  const stepBoxWidth = 250;
  
  steps.forEach((step, index) => {
    doc.setFillColor(step.color.bg[0], step.color.bg[1], step.color.bg[2]);
    doc.setDrawColor(step.color.border[0], step.color.border[1], step.color.border[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(leftMargin, yPos, stepBoxWidth, stepHeight, 2, 2, 'FD');
    
    // Step number circle
    doc.setFillColor(step.color.text[0], step.color.text[1], step.color.text[2]);
    doc.circle(leftMargin + 7, yPos + 7, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(step.num.toString(), leftMargin + 7, yPos + 8.5, { align: 'center' });
    
    // Step title
    doc.setTextColor(step.color.text[0], step.color.text[1], step.color.text[2]);
    doc.setFontSize(10);
    doc.text(step.title, leftMargin + 14, yPos + 6);
    
    // Step description
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(step.desc, leftMargin + 14, yPos + 10.5);
    
    // Step detail
    doc.setFontSize(6);
    doc.setTextColor(107, 114, 128);
    const detailLines = doc.splitTextToSize(step.detail, stepBoxWidth - 18);
    doc.text(detailLines, leftMargin + 14, yPos + 14);
    
    // Arrow to next step
    if (index < steps.length - 1) {
      yPos += stepHeight + 1.5;
      doc.setDrawColor(0, 180, 216);
      doc.setLineWidth(1);
      doc.line(leftMargin + stepBoxWidth / 2, yPos, leftMargin + stepBoxWidth / 2, yPos + 2.5);
      doc.triangle(leftMargin + stepBoxWidth / 2, yPos + 2.5, leftMargin + stepBoxWidth / 2 - 2, yPos + 1, leftMargin + stepBoxWidth / 2 + 2, yPos + 1, 'F');
      yPos += 2.5;
    } else {
      yPos += stepHeight;
    }
  });
  
  // ==========================================
  // PAGE 5: COMPLIANCE ARCHITECTURE
  // ==========================================
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Compliance Architecture', pageWidth / 2, 15, { align: 'center' });
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Six integrated compliance features ensuring government regulation adherence', pageWidth / 2, 23, { align: 'center' });
  
  yPos = 35;
  const complianceBoxWidth = 85;
  const complianceBoxHeight = 40;
  
  const complianceFeatures = [
    {
      icon: '📋',
      title: 'SANS 1200',
      subtitle: 'Specification Verification',
      items: [
        '3,000+ pre-loaded items',
        'Automatic spec matching',
        'Material standards check',
        'Compliance alerts'
      ],
      color: { bg: [219, 234, 254], border: [59, 130, 246], text: [30, 64, 175] }
    },
    {
      icon: '🏗️',
      title: 'NBR',
      subtitle: 'Building Regulations',
      items: [
        'Safety standard validation',
        'Building code alignment',
        'Load-bearing checks',
        'Fire safety compliance'
      ],
      color: { bg: [220, 252, 231], border: [34, 197, 94], text: [20, 83, 45] }
    },
    {
      icon: '✅',
      title: 'AGRÉMENT',
      subtitle: 'Product Certification',
      items: [
        'Certified product database',
        'Certificate verification',
        'Expiry date tracking',
        'Quality assurance'
      ],
      color: { bg: [243, 232, 255], border: [168, 85, 247], text: [76, 29, 149] }
    },
    {
      icon: '🎯',
      title: 'BBBEE',
      subtitle: 'Transformation Tracking',
      items: [
        'Supplier level tracking',
        '80/20 & 90/10 scoring',
        'EME/QSE identification',
        'SANAS verification'
      ],
      color: { bg: [255, 237, 213], border: [249, 115, 22], text: [124, 45, 18] }
    },
    {
      icon: '🔒',
      title: 'POPIA',
      subtitle: 'Data Protection',
      items: [
        'AES-256 encryption',
        'RBAC access control',
        'Audit logs',
        'Consent management'
      ],
      color: { bg: [254, 226, 226], border: [239, 68, 68], text: [127, 29, 29] }
    },
    {
      icon: '🛡️',
      title: 'Anti-Corruption',
      subtitle: 'PFMA/MFMA Compliance',
      items: [
        'Immutable audit trail',
        'Price comparison logs',
        'Timestamp all decisions',
        'Anomaly detection'
      ],
      color: { bg: [254, 249, 195], border: [234, 179, 8], text: [113, 63, 18] }
    }
  ];
  
  xPos = leftMargin;
  let rowCount = 0;
  
  complianceFeatures.forEach((feature, index) => {
    if (index > 0 && index % 3 === 0) {
      yPos += complianceBoxHeight + 8;
      xPos = leftMargin;
      rowCount++;
    }
    
    doc.setFillColor(feature.color.bg[0], feature.color.bg[1], feature.color.bg[2]);
    doc.setDrawColor(feature.color.border[0], feature.color.border[1], feature.color.border[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(xPos, yPos, complianceBoxWidth, complianceBoxHeight, 3, 3, 'FD');
    
    // Icon
    doc.setFontSize(16);
    doc.text(feature.icon, xPos + 3, yPos + 8);
    
    // Title
    doc.setTextColor(feature.color.text[0], feature.color.text[1], feature.color.text[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(feature.title, xPos + 12, yPos + 7);
    
    // Subtitle
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(feature.subtitle, xPos + 12, yPos + 11);
    
    // Items
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(7);
    feature.items.forEach((item, idx) => {
      doc.text(`• ${item}`, xPos + 3, yPos + 17 + (idx * 4.5));
    });
    
    xPos += complianceBoxWidth + 8;
  });
  
  // Compliance Integration Box
  yPos += complianceBoxHeight + 15;
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.roundedRect(leftMargin, yPos, layerBoxWidth, 25, 3, 3, 'FD');
  
  doc.setTextColor(30, 64, 175);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('🔗 System-Wide Integration', leftMargin + 3, yPos + 7);
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('All compliance features are integrated at every stage:', leftMargin + 3, yPos + 12);
  doc.text('• Supplier Sign-Up: BBBEE verification, POPIA consent, AGRÉMENT certification checks', leftMargin + 5, yPos + 16);
  doc.text('• BOQ Generation: SANS 1200 matching, NBR validation, price transparency logging', leftMargin + 5, yPos + 20);
  doc.text('• System-Wide: Encryption, audit trails, anti-corruption monitoring across all operations', leftMargin + 5, yPos + 24);
  
  // ==========================================
  // PAGE 6: SECURITY ARCHITECTURE
  // ==========================================
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Security Architecture', pageWidth / 2, 15, { align: 'center' });
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Enterprise-grade security protecting all data and transactions', pageWidth / 2, 23, { align: 'center' });
  
  yPos = 35;
  
  // Security Layers
  const securityLayers = [
    {
      title: '🔐 Authentication & Authorization',
      items: [
        'Secure JWT-based authentication with refresh tokens',
        'Role-based access control (RBAC) - Admin, QS, Viewer roles',
        'Session management with automatic timeout (30 min inactivity)',
        'Multi-factor authentication (MFA) support for enterprise users',
        'Password strength requirements (min 12 chars, special chars)',
        'Account lockout after 5 failed login attempts'
      ]
    },
    {
      title: '🔒 Data Encryption',
      items: [
        'End-to-end encryption for all data transmission (TLS 1.3)',
        'AES-256 encryption for data at rest in database',
        'Encrypted file storage for uploaded BOQs and documents',
        'Secure key management with rotation every 90 days',
        'Field-level encryption for sensitive supplier data',
        'Encrypted backups with 30-day retention'
      ]
    },
    {
      title: '��️ Application Security',
      items: [
        'Input validation and sanitization to prevent injection attacks',
        'CSRF protection on all state-changing operations',
        'XSS prevention with Content Security Policy (CSP)',
        'Rate limiting (100 requests/min per user)',
        'File upload validation (type, size, virus scanning)',
        'Secure headers (HSTS, X-Frame-Options, X-Content-Type-Options)'
      ]
    },
    {
      title: '📊 Monitoring & Auditing',
      items: [
        'Real-time security monitoring and alerting',
        'Comprehensive audit logs for all user actions',
        'Failed login attempt tracking and notifications',
        'Data access logging (who, what, when)',
        'Automated security scanning (SAST, DAST)',
        'Quarterly penetration testing and vulnerability assessments'
      ]
    }
  ];
  
  securityLayers.forEach((layer) => {
    doc.setTextColor(0, 180, 216);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(layer.title, leftMargin, yPos);
    
    yPos += 6;
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    layer.items.forEach(item => {
      const lines = doc.splitTextToSize(`• ${item}`, layerBoxWidth);
      doc.text(lines, leftMargin + 3, yPos);
      yPos += lines.length * 4;
    });
    
    yPos += 4;
  });
  
  // ==========================================
  // PAGE 7: SUPPLIER INTEGRATIONS
  // ==========================================
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Supplier Integration Architecture', pageWidth / 2, 15, { align: 'center' });
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Multi-supplier ecosystem with real-time data synchronization', pageWidth / 2, 23, { align: 'center' });
  
  yPos = 35;
  
  const suppliers = [
    {
      name: 'Buco',
      category: 'Building Materials',
      coverage: '30+ branches, 9 provinces',
      items: ['Cement & concrete', 'Bricks & blocks', 'Timber & boards', 'Plumbing & electrical', 'Tools & hardware'],
      integration: 'API: Real-time catalog sync, stock levels, pricing updates'
    },
    {
      name: 'Builders Warehouse',
      category: 'Construction Supplies',
      coverage: '60+ stores nationwide',
      items: ['Building materials', 'Paint & coatings', 'Roofing materials', 'Doors & windows', 'Insulation'],
      integration: 'API: Live pricing feed, product availability, delivery tracking'
    },
    {
      name: 'Macsteel',
      category: 'Steel & Metal Products',
      coverage: 'National distribution',
      items: ['Steel reinforcement', 'Structural steel', 'Metal sheets', 'Wire & mesh', 'Steel beams'],
      integration: 'API: Product catalog, regional pricing, bulk discounts'
    },
    {
      name: 'Lafarge',
      category: 'Cement & Aggregates',
      coverage: 'Multiple plants across SA',
      items: ['Cement products', 'Ready-mix concrete', 'Aggregates & sand', 'Lime products', 'Mortars'],
      integration: 'API: Material specs, provincial pricing, delivery zones'
    },
    {
      name: 'PPC Cement',
      category: 'Cement Solutions',
      coverage: 'Nationwide distribution',
      items: ['Portland cement', 'Blended cement', 'Lime products', 'Aggregates', 'Technical support'],
      integration: 'API: Product data feed, pricing tiers, technical specs'
    },
    {
      name: 'Cashbuild',
      category: 'Building Supplies',
      coverage: '300+ stores Southern Africa',
      items: ['Construction materials', 'Hardware & tools', 'Plumbing supplies', 'Electrical items', 'Paint & sundries'],
      integration: 'API: Inventory sync, promotional pricing, store availability'
    }
  ];
  
  const supplierBoxWidth = 85;
  const supplierBoxHeight = 48;
  xPos = leftMargin;
  let supplierRow = 0;
  
  suppliers.forEach((supplier, index) => {
    if (index > 0 && index % 3 === 0) {
      yPos += supplierBoxHeight + 8;
      xPos = leftMargin;
      supplierRow++;
    }
    
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.roundedRect(xPos, yPos, supplierBoxWidth, supplierBoxHeight, 3, 3, 'FD');
    
    // Supplier name
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(supplier.name, xPos + 3, yPos + 6);
    
    // Category
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.text(supplier.category, xPos + 3, yPos + 10);
    
    // Coverage
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text(supplier.coverage, xPos + 3, yPos + 14);
    
    // Items (first 3)
    doc.setFontSize(6);
    supplier.items.slice(0, 3).forEach((item, idx) => {
      doc.text(`• ${item}`, xPos + 3, yPos + 18 + (idx * 3));
    });
    
    // Integration
    doc.setFillColor(219, 234, 254);
    doc.roundedRect(xPos + 2, yPos + 30, supplierBoxWidth - 4, 15, 2, 2, 'F');
    
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('Integration:', xPos + 4, yPos + 34);
    
    doc.setTextColor(75, 85, 99);
    doc.setFont('helvetica', 'normal');
    const integrationLines = doc.splitTextToSize(supplier.integration, supplierBoxWidth - 8);
    doc.text(integrationLines, xPos + 4, yPos + 37);
    
    xPos += supplierBoxWidth + 8;
  });
  
  // Integration Summary
  yPos += supplierBoxHeight + 15;
  doc.setFillColor(254, 249, 195);
  doc.setDrawColor(234, 179, 8);
  doc.roundedRect(leftMargin, yPos, layerBoxWidth, 20, 3, 3, 'FD');
  
  doc.setTextColor(113, 63, 18);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('🔗 Integration Summary', leftMargin + 3, yPos + 6);
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('• 8+ major suppliers integrated with real-time API connections', leftMargin + 3, yPos + 11);
  doc.text('• 3,000+ construction items across cement, steel, timber, aggregates, hardware, and specialized materials', leftMargin + 3, yPos + 15);
  doc.text('• Live pricing updates every 24 hours, stock availability checks, provincial pricing optimization', leftMargin + 3, yPos + 19);
  
  // ==========================================
  // PAGE 8: TECHNOLOGY STACK
  // ==========================================
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Technology Stack', pageWidth / 2, 15, { align: 'center' });
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Modern, scalable technologies powering Qilly', pageWidth / 2, 23, { align: 'center' });
  
  yPos = 35;
  
  const techCategories = [
    {
      category: 'Frontend',
      icon: '💻',
      technologies: [
        { name: 'React 18', desc: 'UI library with hooks and concurrent features' },
        { name: 'TypeScript', desc: 'Type-safe JavaScript for robust code' },
        { name: 'Tailwind CSS v4', desc: 'Utility-first CSS framework' },
        { name: 'Lucide React', desc: 'Icon library for UI elements' },
        { name: 'React Hook Form', desc: 'Form validation and state management' }
      ]
    },
    {
      category: 'Backend & Database',
      icon: '⚙️',
      technologies: [
        { name: 'Node.js', desc: 'JavaScript runtime for server-side logic' },
        { name: 'PostgreSQL', desc: 'Relational database for data storage' },
        { name: 'Supabase', desc: 'Backend-as-a-service with auth & realtime' },
        { name: 'RESTful APIs', desc: 'HTTP APIs for client-server communication' },
        { name: 'Edge Functions', desc: 'Serverless compute for scalability' }
      ]
    },
    {
      category: 'Data Processing',
      icon: '🔬',
      technologies: [
        { name: 'ExcelJS', desc: 'Excel file parsing and generation' },
        { name: 'PapaParse', desc: 'CSV parsing and processing' },
        { name: 'Fuzzy Matching', desc: 'Intelligent item matching algorithm' },
        { name: 'Price Engine', desc: 'Multi-supplier price comparison logic' },
        { name: 'Regional Optimizer', desc: 'Provincial pricing calculations' }
      ]
    },
    {
      category: 'Infrastructure',
      icon: '☁️',
      technologies: [
        { name: 'Vercel', desc: 'Cloud hosting with edge network & CDN' },
        { name: 'GitHub', desc: 'Version control and CI/CD pipelines' },
        { name: 'SSL/TLS', desc: 'Encryption for secure connections' },
        { name: 'Monitoring', desc: 'Real-time performance and error tracking' },
        { name: 'Auto-scaling', desc: 'Dynamic resource allocation' }
      ]
    },
    {
      category: 'Document Generation',
      icon: '📄',
      technologies: [
        { name: 'jsPDF', desc: 'PDF generation for reports and documents' },
        { name: 'docx', desc: 'Word document generation (proposals)' },
        { name: 'pptxgen', desc: 'PowerPoint presentation generation' },
        { name: 'Excel Export', desc: 'Priced BOQ export in Excel format' },
        { name: 'CSV Export', desc: 'Alternative CSV format export' }
      ]
    },
    {
      category: 'Compliance & Standards',
      icon: '✅',
      technologies: [
        { name: 'SANS 1200 DB', desc: 'Construction specification database' },
        { name: 'NBR Validator', desc: 'Building regulation checking' },
        { name: 'AGRÉMENT API', desc: 'Product certification verification' },
        { name: 'BBBEE Tracker', desc: 'Transformation scoring system' },
        { name: 'POPIA Engine', desc: 'Data protection compliance' }
      ]
    }
  ];
  
  const techBoxWidth = 125;
  const techBoxHeight = 42;
  xPos = leftMargin;
  let techRow = 0;
  
  techCategories.forEach((category, index) => {
    if (index > 0 && index % 2 === 0) {
      yPos += techBoxHeight + 8;
      xPos = leftMargin;
      techRow++;
    }
    
    const colors = [
      { bg: [219, 234, 254], border: [59, 130, 246], text: [30, 64, 175] },
      { bg: [220, 252, 231], border: [34, 197, 94], text: [20, 83, 45] },
      { bg: [243, 232, 255], border: [168, 85, 247], text: [76, 29, 149] },
      { bg: [255, 237, 213], border: [249, 115, 22], text: [124, 45, 18] },
      { bg: [254, 226, 226], border: [239, 68, 68], text: [127, 29, 29] },
      { bg: [254, 249, 195], border: [234, 179, 8], text: [113, 63, 18] }
    ];
    
    const color = colors[index % colors.length];
    
    doc.setFillColor(color.bg[0], color.bg[1], color.bg[2]);
    doc.setDrawColor(color.border[0], color.border[1], color.border[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(xPos, yPos, techBoxWidth, techBoxHeight, 3, 3, 'FD');
    
    // Icon and category
    doc.setFontSize(14);
    doc.text(category.icon, xPos + 3, yPos + 7);
    
    doc.setTextColor(color.text[0], color.text[1], color.text[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(category.category, xPos + 11, yPos + 7);
    
    // Technologies
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    
    category.technologies.forEach((tech, idx) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${tech.name}:`, xPos + 3, yPos + 13 + (idx * 5.5));
      doc.setFont('helvetica', 'normal');
      doc.text(tech.desc, xPos + 25, yPos + 13 + (idx * 5.5));
    });
    
    xPos += techBoxWidth + 8;
  });
  
  // ==========================================
  // PAGE 9: DEPLOYMENT & SCALABILITY
  // ==========================================
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Deployment & Scalability Architecture', pageWidth / 2, 15, { align: 'center' });
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Production-ready infrastructure with global reach and high availability', pageWidth / 2, 23, { align: 'center' });
  
  yPos = 35;
  
  // Deployment Architecture
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('🚀 Production Deployment', leftMargin, yPos);
  
  yPos += 10;
  
  const deploymentItems = [
    {
      title: 'Hosting Platform: Vercel',
      details: [
        'Global edge network with 100+ data centers worldwide',
        'Automatic HTTPS with SSL/TLS certificates',
        'DDoS protection and Web Application Firewall (WAF)',
        'Built-in CDN for static asset delivery (images, CSS, JS)',
        'Zero-downtime deployments with instant rollbacks'
      ]
    },
    {
      title: 'Database Hosting: Supabase',
      details: [
        'Managed PostgreSQL with automatic backups (daily)',
        'Point-in-time recovery up to 7 days',
        'Connection pooling for optimal performance',
        'Read replicas for high-traffic scenarios',
        'Row-level security and encryption at rest'
      ]
    },
    {
      title: 'CI/CD Pipeline',
      details: [
        'GitHub Actions for automated testing and deployment',
        'Automated code quality checks (ESLint, TypeScript)',
        'Preview deployments for every pull request',
        'Production deployment on merge to main branch',
        'Automated rollback on failed health checks'
      ]
    }
  ];
  
  deploymentItems.forEach((item) => {
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.3);
    doc.roundedRect(leftMargin, yPos, layerBoxWidth, 28, 2, 2, 'FD');
    
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(item.title, leftMargin + 3, yPos + 5);
    
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    
    item.details.forEach((detail, idx) => {
      doc.text(`• ${detail}`, leftMargin + 5, yPos + 10 + (idx * 4));
    });
    
    yPos += 32;
  });
  
  yPos += 5;
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('📈 Scalability Features', leftMargin, yPos);
  
  yPos += 10;
  
  const scalabilityFeatures = [
    {
      metric: 'Auto-Scaling',
      value: 'Dynamic',
      description: 'Automatically scales from 1 to 1,000+ concurrent users based on demand'
    },
    {
      metric: 'Response Time',
      value: '<200ms',
      description: 'Average API response time with edge caching and optimization'
    },
    {
      metric: 'Uptime SLA',
      value: '99.99%',
      description: 'Guaranteed uptime with redundancy and failover mechanisms'
    },
    {
      metric: 'Concurrent Users',
      value: '10,000+',
      description: 'Supports large-scale deployments with horizontal scaling'
    },
    {
      metric: 'Data Processing',
      value: '100 BOQs/min',
      description: 'Can process up to 100 bills of quantities per minute at peak'
    },
    {
      metric: 'Storage Capacity',
      value: 'Unlimited',
      description: 'Cloud storage scales automatically with usage growth'
    }
  ];
  
  const scalabilityBoxWidth = 83;
  xPos = leftMargin;
  
  scalabilityFeatures.forEach((feature, index) => {
    if (index > 0 && index % 3 === 0) {
      yPos += 25;
      xPos = leftMargin;
    }
    
    doc.setFillColor(220, 252, 231);
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(0.3);
    doc.roundedRect(xPos, yPos, scalabilityBoxWidth, 23, 2, 2, 'FD');
    
    doc.setTextColor(20, 83, 45);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(feature.value, xPos + 3, yPos + 7);
    
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(feature.metric, xPos + 3, yPos + 12);
    
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(feature.description, scalabilityBoxWidth - 6);
    doc.text(descLines, xPos + 3, yPos + 16);
    
    xPos += scalabilityBoxWidth + 8;
  });
  
  // ==========================================
  // PAGE 10: CITATIONS & REFERENCES
  // ==========================================
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Architecture Standards & References', pageWidth / 2, 15, { align: 'center' });
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Industry standards and best practices guiding system architecture', pageWidth / 2, 23, { align: 'center' });
  
  yPos = 35;
  
  const references = [
    {
      category: 'Security Standards',
      items: [
        'ISO/IEC 27001:2022 - Information Security Management',
        'OWASP Top 10 - Web Application Security Best Practices',
        'POPIA Act 4/2013 - Data Protection Requirements',
        'NIST Cybersecurity Framework - Security Controls'
      ]
    },
    {
      category: 'Construction Standards',
      items: [
        'SANS 1200 Series - South African Construction Specifications',
        'National Building Regulations (Act 103/1977)',
        'AGRÉMENT South Africa - Product Certification Standards',
        'CIDB Standards - Construction Industry Best Practices'
      ]
    },
    {
      category: 'Development Standards',
      items: [
        'REST API Design - RESTful architecture principles',
        'Clean Code - Robert C. Martin coding standards',
        'SOLID Principles - Object-oriented design patterns',
        'Twelve-Factor App - Modern application deployment'
      ]
    },
    {
      category: 'Compliance & Governance',
      items: [
        'BBBEE Act 53/2003 - Transformation Requirements',
        'PFMA Act 1/1999 - Public Finance Management',
        'MFMA Act 56/2003 - Municipal Finance Management',
        'PRECCA Act 12/2004 - Anti-Corruption Measures'
      ]
    }
  ];
  
  references.forEach((ref) => {
    doc.setTextColor(0, 180, 216);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(ref.category, leftMargin, yPos);
    
    yPos += 7;
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    ref.items.forEach(item => {
      doc.text(`• ${item}`, leftMargin + 3, yPos);
      yPos += 5;
    });
    
    yPos += 5;
  });
  
  yPos += 5;
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Technology Documentation', leftMargin, yPos);
  
  yPos += 7;
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  const techDocs = [
    'React 18 Documentation - https://react.dev',
    'TypeScript Handbook - https://www.typescriptlang.org/docs',
    'Tailwind CSS v4 - https://tailwindcss.com/docs',
    'PostgreSQL Documentation - https://www.postgresql.org/docs',
    'Supabase Documentation - https://supabase.com/docs',
    'Vercel Platform Documentation - https://vercel.com/docs'
  ];
  
  techDocs.forEach(doc_ref => {
    doc.text(`• ${doc_ref}`, leftMargin + 3, yPos);
    yPos += 5;
  });
  
  // Version Information
  yPos += 10;
  doc.setFillColor(254, 249, 195);
  doc.setDrawColor(234, 179, 8);
  doc.setLineWidth(0.5);
  doc.roundedRect(leftMargin, yPos, layerBoxWidth, 20, 3, 3, 'FD');
  
  doc.setTextColor(113, 63, 18);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('📋 Document Information', leftMargin + 3, yPos + 6);
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Version: 2.0 | Generated: ${today} | Status: Production-Ready`, leftMargin + 3, yPos + 11);
  doc.text('This architecture supports DHS funding proposal with all 6 compliance features integrated', leftMargin + 3, yPos + 15);
  doc.text('Complete source code and technical documentation available at: www.qilly.co.za/docs', leftMargin + 3, yPos + 19);
  
  // Save the PDF
  doc.save(`Qilly_Architecture_Document_${new Date().toISOString().split('T')[0]}.pdf`);
}
