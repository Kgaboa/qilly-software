import jsPDF from 'jspdf';

const PRIMARY_COLOR = '#00b4d8';
const SECONDARY_COLOR = '#0096c7';

export function generatePitchDeckPDF() {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  let currentPage = 1;
  
  // Helper function to add new page
  const addNewPage = () => {
    doc.addPage();
    currentPage++;
  };
  
  // Helper function to add footer
  const addFooter = () => {
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Qilly Supplier Partnership Deck - Page ${currentPage}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  };
  
  // SLIDE 1: TITLE PAGE
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.text('Partner with Qilly', pageWidth / 2, 80, { align: 'center' });
  
  doc.setFontSize(18);
  doc.text('Transform Construction Procurement in South Africa', pageWidth / 2, 100, { align: 'center' });
  
  doc.setFontSize(12);
  const badges = ['Daily Price Updates', 'API Integration', '9 Provinces'];
  badges.forEach((badge, i) => {
    const x = pageWidth / 2 - 60 + i * 40;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, 120, 35, 8, 2, 2, 'F');
    doc.setTextColor(0, 180, 216);
    doc.text(badge, x + 17.5, 125, { align: 'center' });
  });
  
  addNewPage();
  
  // SLIDE 2: THE PROBLEM
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.text('The Problem', margin, 30);
  
  doc.setFontSize(12);
  let y = 50;
  
  doc.setFont('helvetica', 'bold');
  doc.text('For Contractors:', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  
  const contractorProblems = [
    'Manual BOQ pricing takes 2-5 days per bill',
    'Outdated prices lead to budget overruns',
    "Can't compare suppliers across provinces efficiently"
  ];
  
  contractorProblems.forEach(problem => {
    doc.circle(margin + 2, y - 2, 1, 'F');
    const lines = doc.splitTextToSize(problem, contentWidth - 10);
    doc.text(lines, margin + 5, y);
    y += lines.length * 6;
  });
  
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('For Suppliers:', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  
  const supplierProblems = [
    'Missing opportunities in tender processes',
    'Limited digital presence in procurement systems',
    'Price inquiries handled manually via phone/email'
  ];
  
  supplierProblems.forEach(problem => {
    doc.circle(margin + 2, y - 2, 1, 'F');
    const lines = doc.splitTextToSize(problem, contentWidth - 10);
    doc.text(lines, margin + 5, y);
    y += lines.length * 6;
  });
  
  addFooter();
  addNewPage();
  
  // SLIDE 3: THE SOLUTION
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(20);
  doc.text('Qilly: The Solution', margin, 30);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  y = 50;
  
  const solutions = [
    { title: '5 Minutes', desc: 'Automated BOQ pricing vs 2-5 days manual' },
    { title: '100% Accuracy', desc: 'Intelligent matching with live supplier data' },
    { title: '9 Provinces', desc: 'Complete South African coverage' }
  ];
  
  solutions.forEach(solution => {
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 180, 216);
    doc.text(solution.title, margin + 5, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(solution.desc, margin + 5, y + 15);
    y += 25;
  });
  
  addFooter();
  addNewPage();
  
  // SLIDE 4: WHY PARTNER
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.text('Why Partner with Qilly?', margin, 30);
  
  y = 45;
  doc.setFontSize(11);
  
  const benefits = [
    { title: 'Increased Market Visibility', points: [
      'Featured on every relevant BOQ across South Africa',
      'Premium supplier badge on platform',
      'Estimated reach: 500+ bills/month by Q4 2026'
    ]},
    { title: 'Competitive Advantage', points: [
      'Win more business on the platform contractors use',
      'Real-time price competitiveness vs suppliers',
      'First-mover advantage in digital procurement'
    ]},
    { title: 'Operational Efficiency', points: [
      'Reduce manual quotation requests by 40-60%',
      'Automated price distribution',
      'Analytics on product demand'
    ]},
    { title: 'Digital Transformation', points: [
      'Free API development support (R50k-R150k value)',
      'White-label solution for other clients',
      'Technical documentation and support'
    ]}
  ];
  
  benefits.forEach(benefit => {
    if (y > 240) {
      addFooter();
      addNewPage();
      y = 30;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 180, 216);
    doc.text('✓ ' + benefit.title, margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    
    benefit.points.forEach(point => {
      const lines = doc.splitTextToSize('• ' + point, contentWidth - 10);
      doc.text(lines, margin + 5, y);
      y += lines.length * 5;
    });
    y += 5;
    doc.setFontSize(11);
  });
  
  addFooter();
  addNewPage();
  
  // SLIDE 5: HOW IT WORKS
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.text('How the Integration Works', margin, 30);
  
  y = 50;
  doc.setFontSize(11);
  
  const steps = [
    { num: '1', title: 'Daily Automated Sync', desc: "Qilly's system calls your API every morning at 06:00 SAST" },
    { num: '2', title: 'Intelligent Matching', desc: 'Our algorithms match BOQ items to catalog (98-99.5% success)' },
    { num: '3', title: 'Contractor Sees Your Prices', desc: 'When contractors price bills, they see best rates including yours' },
    { num: '4', title: 'You Get the Business', desc: 'Contractors contact you with priced BOQ - warm leads ready to buy' }
  ];
  
  steps.forEach(step => {
    doc.setFillColor(0, 180, 216);
    doc.circle(margin + 5, y, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(step.num, margin + 5, y + 2, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(step.title, margin + 15, y + 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const lines = doc.splitTextToSize(step.desc, contentWidth - 20);
    doc.text(lines, margin + 15, y + 8);
    y += 25;
    doc.setFontSize(11);
  });
  
  addFooter();
  addNewPage();
  
  // SLIDE 6: PARTNERSHIP MODELS
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.text('Partnership Models', margin, 30);
  
  y = 50;
  const models = [
    { name: 'Free Partnership', price: 'R0/year', badge: 'Recommended', features: [
      'API access & integration',
      'Standard supplier listing',
      'Basic analytics dashboard',
      'Email support'
    ]},
    { name: 'Featured Partner', price: 'R25,000/year', badge: 'Premium', features: [
      'Everything in Free, plus:',
      'Premium badge & top placement',
      'Advanced analytics & insights',
      'Quarterly business reviews',
      'Priority phone support'
    ]},
    { name: 'Revenue Share', price: '0.3-0.5%', badge: 'Performance', features: [
      'Pay only on materials sold via Qilly',
      'Full transaction tracking',
      'Monthly invoicing',
      'Performance-based model'
    ]}
  ];
  
  models.forEach(model => {
    if (y > 240) {
      addFooter();
      addNewPage();
      y = 30;
    }
    
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(margin, y, contentWidth, 45, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setFillColor(0, 180, 216);
    doc.roundedRect(margin + 5, y + 3, 25, 5, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(model.badge, margin + 17.5, y + 6, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(model.name, margin + 5, y + 13);
    
    doc.setTextColor(0, 180, 216);
    doc.setFontSize(16);
    doc.text(model.price, margin + 5, y + 22);
    
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    let featureY = y + 28;
    model.features.forEach(feature => {
      doc.text('✓ ' + feature, margin + 5, featureY);
      featureY += 4;
    });
    
    y += 50;
  });
  
  addFooter();
  addNewPage();
  
  // SLIDE 7: TECHNICAL REQUIREMENTS
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.text('What We Need From You', margin, 30);
  
  y = 45;
  doc.setFontSize(11);
  
  doc.setFont('helvetica', 'bold');
  doc.text('API Requirements:', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const apiReqs = [
    'REST API endpoint (JSON format)',
    'Product catalog with: SKU, description, unit, price',
    'Province/branch location data',
    'Daily price updates (automated)'
  ];
  
  apiReqs.forEach(req => {
    doc.text('• ' + req, margin + 5, y);
    y += 6;
  });
  
  y += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('From Your Team:', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const teamReqs = [
    'Technical contact (IT/development team)',
    'Pricing/procurement contact (for validation)',
    '~5-10 hours for initial setup & testing',
    'Ongoing: minimal (automated sync)'
  ];
  
  teamReqs.forEach(req => {
    doc.text('• ' + req, margin + 5, y);
    y += 6;
  });
  
  y += 10;
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setTextColor(0, 180, 216);
  doc.setFont('helvetica', 'bold');
  doc.text("Don't have an API?", margin + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  const apiHelpText = doc.splitTextToSize('We offer free API development support for qualified partners (valued at R50k-R150k).', contentWidth - 10);
  doc.text(apiHelpText, margin + 5, y + 13);
  
  addFooter();
  addNewPage();
  
  // SLIDE 8: PRICE INTEGRITY
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.text('Price Integrity Safeguards', margin, 30);
  
  y = 45;
  doc.setFontSize(10);
  
  const safeguards = [
    { title: 'Automated Detection', desc: 'Prices >20% increase flagged for review' },
    { title: 'Cross-Validation', desc: 'Compare same items across suppliers' },
    { title: 'Market Indexing', desc: 'Track Stats SA construction indices' },
    { title: 'Quarterly Audits', desc: 'Random spot-checks vs public prices' }
  ];
  
  safeguards.forEach(safeguard => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 180, 216);
    doc.text('✓ ' + safeguard.title, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(safeguard.desc, margin + 5, y + 5);
    y += 12;
  });
  
  y += 5;
  doc.setFillColor(220, 252, 231);
  doc.roundedRect(margin, y, contentWidth, 25, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Contract Protection:', margin + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  const contractText = doc.splitTextToSize('Our supplier agreement prohibits price inflation and allows audits against public rates. Fair pricing benefits everyone.', contentWidth - 10);
  doc.text(contractText, margin + 5, y + 12);
  
  addFooter();
  addNewPage();
  
  // SLIDE 9: SUCCESS METRICS
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.text('Success Metrics & ROI', margin, 30);
  
  y = 50;
  const metrics = [
    { value: '500+', label: 'Bills processed monthly (Q4 2026 target)' },
    { value: 'R15M+', label: 'Materials value quoted annually' },
    { value: '40-60%', label: 'Reduction in manual quote requests' }
  ];
  
  metrics.forEach(metric => {
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(margin, y, contentWidth, 15, 2, 2, 'F');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 180, 216);
    doc.text(metric.value, margin + 5, y + 7);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(metric.label, margin + 5, y + 12);
    y += 20;
  });
  
  y += 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('What You Can Track:', margin, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const trackables = [
    'Number of BOQs your products appear in',
    'Win rate vs competitors (anonymous)',
    'Most requested products by category',
    'Geographic demand patterns per province'
  ];
  
  trackables.forEach(item => {
    doc.text('✓ ' + item, margin + 5, y);
    y += 5;
  });
  
  addFooter();
  addNewPage();
  
  // SLIDE 10: NEXT STEPS
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, 60, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("Let's Get Started", pageWidth / 2, 30, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Onboarding Timeline: 7 weeks from discovery to go-live', pageWidth / 2, 45, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  y = 75;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Onboarding Timeline:', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const timeline = [
    'Week 1-2: Discovery (API spec review, contract)',
    'Week 3-4: Development (API setup, authentication)',
    'Week 5-6: Testing (Price validation, matching)',
    'Week 7: Go Live (Production deployment)'
  ];
  
  timeline.forEach(step => {
    doc.text('• ' + step, margin + 5, y);
    y += 6;
  });
  
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Contact Information:', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  
  doc.text('Partnership Inquiries: partnerships@qilly.co.za', margin + 5, y);
  y += 6;
  doc.text('Technical Integration: api@qilly.co.za', margin + 5, y);
  y += 6;
  doc.text('Website: www.qilly.co.za', margin + 5, y);
  
  y += 15;
  doc.setFillColor(0, 180, 216);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text('Ready to transform construction procurement together?', pageWidth / 2, y + 8, { align: 'center' });
  doc.setFontSize(9);
  doc.text('Join Qilly as a founding supplier partner.', pageWidth / 2, y + 14, { align: 'center' });
  
  addFooter();
  
  // Save the PDF
  doc.save('Qilly-Supplier-Partnership-Deck.pdf');
}

export function generateAPISpecPDF() {
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
    doc.text(`Qilly API Specification v1.0 - Page ${currentPage}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  };
  
  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - 25) {
      addFooter();
      addNewPage();
    }
  };
  
  // TITLE PAGE
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, 80, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text('Qilly API Integration', pageWidth / 2, 35, { align: 'center' });
  doc.setFontSize(20);
  doc.text('Specification v1.0', pageWidth / 2, 50, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Official Technical Documentation', pageWidth / 2, 65, { align: 'center' });
  
  y = 100;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Document Information:', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const docInfo = [
    'Version: 1.0',
    'Last Updated: February 6, 2026',
    'Protocol: REST API (JSON)',
    'Authentication: OAuth 2.0 / API Key'
  ];
  
  docInfo.forEach(info => {
    doc.text('• ' + info, margin + 5, y);
    y += 6;
  });
  
  y += 10;
  doc.setFontSize(10);
  const overview = doc.splitTextToSize('This document specifies technical requirements for suppliers to integrate their product catalog and pricing data with Qilly\'s automated BOQ pricing system. All suppliers must provide a REST API endpoint conforming to these specifications.', contentWidth);
  doc.text(overview, margin, y);
  
  addFooter();
  addNewPage();
  
  // 1. API ENDPOINT REQUIREMENTS
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
  doc.text('https://api.supplier-name.com/v1/qilly/products', margin + 3, y + 5);
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
    'Uptime SLA: 99.5% monthly uptime'
  ];
  
  specs.forEach(spec => {
    doc.text('✓ ' + spec, margin + 5, y);
    y += 5;
  });
  
  checkPageBreak(60);
  y += 8;
  
  // 2. AUTHENTICATION
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
    'Qilly can provide dedicated IP for whitelisting (optional)'
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
  y += 12;
  
  addFooter();
  addNewPage();
  
  // 3. DATA SCHEMA
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('3. Data Schema', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('JSON Response Structure:', margin, y);
  y += 6;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setFillColor(40, 40, 40);
  const codeHeight = 80;
  doc.roundedRect(margin, y, contentWidth, codeHeight, 1, 1, 'F');
  doc.setTextColor(0, 255, 0);
  
  const jsonCode = [
    '{',
    '  "metadata": {',
    '    "supplier_id": "BUCO_ZA",',
    '    "supplier_name": "Buco South Africa",',
    '    "timestamp": "2026-02-06T06:00:00+02:00",',
    '    "total_products": 15420',
    '  },',
    '  "products": [',
    '    {',
    '      "sku": "PPC-CEM-50KG-001",',
    '      "description": "Portland Cement 50kg PPC",',
    '      "brand": "PPC",',
    '      "unit": "bag",',
    '      "price_excl_vat": 89.50,',
    '      "province": "Gauteng",',
    '      "last_updated": "2026-02-06T06:00:00+02:00"',
    '    }',
    '  ]',
    '}'
  ];
  
  let codeY = y + 5;
  jsonCode.forEach(line => {
    doc.text(line, margin + 3, codeY);
    codeY += 4;
  });
  
  y += codeHeight + 10;
  
  checkPageBreak(80);
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Required Fields:', margin, y);
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
  
  // 4. DAILY SYNC SCHEDULE
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('4. Daily Sync Schedule', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text("Qilly's Sync Timing:", margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const syncTiming = [
    'Daily sync: 06:00 SAST',
    'Fallback sync: 12:00 SAST (if morning fails)',
    'Retry logic: 3 attempts with exponential backoff'
  ];
  
  syncTiming.forEach(item => {
    doc.text('• ' + item, margin + 5, y);
    y += 5;
  });
  
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Supplier Requirements:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const supplierReqs = [
    'Update prices by 05:30 SAST daily',
    'Provide 24-hour notice for major price changes (>20%)',
    'Maintain dedicated technical contact for incidents'
  ];
  
  supplierReqs.forEach(req => {
    const lines = doc.splitTextToSize('✓ ' + req, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.5;
  });
  
  y += 8;
  doc.setFillColor(255, 250, 230);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Downtime Notifications:', margin + 5, y + 6);
  doc.setFont('helvetica', 'normal');
  const downtimeText = doc.splitTextToSize('Notify api@qilly.co.za at least 48 hours before scheduled maintenance. Qilly will use cached prices (max 48 hours old) during planned outages.', contentWidth - 10);
  doc.text(downtimeText, margin + 5, y + 11);
  
  y += 25;
  
  // 5. PRICE VALIDATION
  checkPageBreak(60);
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('5. Price Validation & Quality Assurance', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  const validationIntro = doc.splitTextToSize('Qilly implements multiple validation layers to ensure pricing accuracy and prevent inflation:', contentWidth);
  doc.text(validationIntro, margin, y);
  y += 10;
  
  const validations = [
    { title: 'Historical Comparison', desc: 'Prices increasing >20% from previous sync are flagged for manual review' },
    { title: 'Cross-Supplier Validation', desc: 'Same items compared across suppliers. Prices >30% above average trigger alerts' },
    { title: 'Market Index Tracking', desc: 'Prices validated against Stats SA construction material price indices' },
    { title: 'Quarterly Audits', desc: 'Random spot-checks: API prices vs public website/in-store prices' }
  ];
  
  validations.forEach(validation => {
    checkPageBreak(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 128, 0);
    doc.text('✓ ' + validation.title, margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const lines = doc.splitTextToSize(validation.desc, contentWidth - 10);
    doc.text(lines, margin + 5, y);
    y += lines.length * 4.5 + 3;
  });
  
  y += 5;
  doc.setFillColor(255, 230, 230);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(139, 0, 0);
  doc.text('Contract Clause:', margin + 5, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  const contractText = doc.splitTextToSize('"Supplier warrants that all pricing data reflects genuine market rates and has not been artificially inflated. Qilly may terminate this agreement if pricing is consistently above verified market rates."', contentWidth - 10);
  doc.text(contractText, margin + 5, y + 11);
  
  y += 28;
  
  addFooter();
  addNewPage();
  
  // 6. ERROR HANDLING
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('6. Error Handling', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text('Your API must return appropriate HTTP status codes:', margin, y);
  y += 8;
  
  const errors = [
    { code: '200 OK', scenario: 'Successful response', action: 'Process data normally' },
    { code: '401 Unauthorized', scenario: 'Invalid credentials', action: 'Alert team, use cached prices' },
    { code: '429 Too Many Requests', scenario: 'Rate limit exceeded', action: 'Retry with exponential backoff' },
    { code: '500 Server Error', scenario: 'Internal error', action: 'Retry 3 times, notify supplier' },
    { code: '503 Service Unavailable', scenario: 'Maintenance', action: 'Use cached prices' }
  ];
  
  errors.forEach(error => {
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.text(error.code, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(error.scenario, margin + 35, y);
    doc.setTextColor(80, 80, 80);
    const actionLines = doc.splitTextToSize('→ ' + error.action, contentWidth - 70);
    doc.text(actionLines, margin + 70, y);
    doc.setTextColor(0, 0, 0);
    y += actionLines.length * 4.5 + 2;
  });
  
  y += 8;
  
  // 7. TESTING & VALIDATION
  checkPageBreak(60);
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('7. Testing & Validation', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text('Before production deployment, suppliers must complete:', margin, y);
  y += 8;
  
  const tests = [
    { num: '1', title: 'Connectivity Test', items: ['Verify HTTPS endpoint accessibility', 'Test authentication', 'Confirm response time < 2s'] },
    { num: '2', title: 'Data Validation Test', items: ['Validate JSON schema', 'Verify required fields', 'Check data types'] },
    { num: '3', title: 'Matching Accuracy Test', items: ['Test sample BOQ (50-100 items)', 'Verify >95% match rate'] },
    { num: '4', title: 'Price Validation Test', items: ['Compare 20 random API vs website prices', 'Verify prices match (±2% tolerance)'] }
  ];
  
  tests.forEach(test => {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(0, 180, 216);
    doc.circle(margin + 3, y, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(test.num, margin + 3, y + 1.5, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(test.title, margin + 8, y + 1.5);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    test.items.forEach(item => {
      doc.text('• ' + item, margin + 10, y);
      y += 4;
    });
    y += 3;
  });
  
  addFooter();
  addNewPage();
  
  // 8. MONITORING & SLA
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('8. Monitoring & SLA', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SLA Commitments:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const slas = [
    'Uptime: 99.5% monthly',
    'Response Time: < 2s (95th percentile)',
    'Incident Response: < 4 hours',
    'Critical Fix: < 24 hours'
  ];
  
  slas.forEach(sla => {
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(margin, y, contentWidth, 7, 1, 1, 'F');
    doc.text(sla, margin + 3, y + 5);
    y += 10;
  });
  
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Qilly Monitoring:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const monitoring = [
    'Real-time API health checks every 5 minutes',
    'Automated alerts for failed syncs',
    'Price change anomaly detection',
    'Weekly sync performance reports'
  ];
  
  monitoring.forEach(item => {
    doc.text('✓ ' + item, margin + 5, y);
    y += 5;
  });
  
  y += 10;
  
  // 9. SUPPORT & CONTACT
  checkPageBreak(60);
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(16);
  doc.text('9. Support & Contact Information', margin, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Technical Integration Support:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Email: api@qilly.co.za', margin + 5, y);
  y += 4;
  doc.text('Phone: +27 (0)11 123 4567', margin + 5, y);
  y += 4;
  doc.text('Hours: Mon-Fri, 08:00-17:00 SAST', margin + 5, y);
  y += 4;
  doc.text('Emergency: 24/7 for critical outages', margin + 5, y);
  
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Partnership Management:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Email: partnerships@qilly.co.za', margin + 5, y);
  y += 4;
  doc.text('Phone: +27 (0)11 123 4568', margin + 5, y);
  
  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Escalation Path:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const escalation = [
    'L1: Email/phone support (4-hour response)',
    'L2: Engineering team (2-hour response)',
    'L3: CTO/Partnership Director (immediate for critical issues)'
  ];
  
  escalation.forEach(level => {
    doc.text('• ' + level, margin + 5, y);
    y += 5;
  });
  
  y += 15;
  
  // CONCLUSION
  doc.setFillColor(0, 180, 216);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ready to Integrate?', pageWidth / 2, y + 10, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Contact our technical team for test credentials', pageWidth / 2, y + 17, { align: 'center' });
  doc.text('api@qilly.co.za  |  +27 (0)11 123 4567', pageWidth / 2, y + 23, { align: 'center' });
  
  addFooter();
  
  // Save the PDF
  doc.save('Qilly-API-Specification-v1.0.pdf');
}
