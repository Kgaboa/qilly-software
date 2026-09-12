import pptxgen from 'pptxgenjs';

const PRIMARY_COLOR = '00b4d8';
const SECONDARY_COLOR = '0096c7';
const DARK_BLUE = '0077b6';

export function generatePitchDeckPPT() {
  const pptx = new pptxgen();
  
  // Set presentation properties
  pptx.author = 'Qilly';
  pptx.company = 'Qilly';
  pptx.title = 'Supplier Partnership Pitch Deck';
  pptx.subject = 'Supplier Partnership Opportunity';
  
  // SLIDE 1: TITLE SLIDE
  const slide1 = pptx.addSlide();
  slide1.background = { color: PRIMARY_COLOR };
  
  slide1.addText('Partner with Qilly', {
    x: 0.5,
    y: 2.0,
    w: 9,
    h: 1.0,
    fontSize: 44,
    bold: true,
    color: 'FFFFFF',
    align: 'center'
  });
  
  slide1.addText('Transform Construction Procurement in South Africa', {
    x: 0.5,
    y: 3.2,
    w: 9,
    h: 0.6,
    fontSize: 24,
    color: 'FFFFFF',
    align: 'center'
  });
  
  slide1.addText('Daily Price Updates  •  API Integration  •  9 Provinces', {
    x: 0.5,
    y: 4.5,
    w: 9,
    h: 0.5,
    fontSize: 18,
    color: 'FFFFFF',
    align: 'center'
  });
  
  // SLIDE 2: THE PROBLEM
  const slide2 = pptx.addSlide();
  slide2.background = { color: 'FFFFFF' };
  
  slide2.addText('The Problem', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: '000000'
  });
  
  slide2.addText('For Contractors:', {
    x: 0.5,
    y: 1.5,
    w: 4.5,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: '333333'
  });
  
  const contractorProblems = [
    'Manual BOQ pricing takes 2-5 days per bill',
    'Outdated prices lead to budget overruns',
    "Can't compare suppliers across provinces efficiently"
  ];
  
  contractorProblems.forEach((problem, i) => {
    slide2.addText(`• ${problem}`, {
      x: 0.5,
      y: 2.0 + (i * 0.5),
      w: 4.5,
      h: 0.4,
      fontSize: 14,
      color: '666666'
    });
  });
  
  slide2.addText('For Suppliers:', {
    x: 5.0,
    y: 1.5,
    w: 4.5,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: '333333'
  });
  
  const supplierProblems = [
    'Missing opportunities in tender processes',
    'Limited digital presence in procurement systems',
    'Price inquiries handled manually via phone/email'
  ];
  
  supplierProblems.forEach((problem, i) => {
    slide2.addText(`• ${problem}`, {
      x: 5.0,
      y: 2.0 + (i * 0.5),
      w: 4.5,
      h: 0.4,
      fontSize: 14,
      color: '666666'
    });
  });
  
  // SLIDE 3: THE SOLUTION
  const slide3 = pptx.addSlide();
  slide3.background = { color: 'F0F9FF' };
  
  slide3.addText('Qilly: The Solution', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: PRIMARY_COLOR
  });
  
  const solutions = [
    { title: '5 Minutes', desc: 'Automated BOQ pricing vs 2-5 days manual' },
    { title: '100% Accuracy', desc: 'Intelligent matching with live supplier data' },
    { title: '9 Provinces', desc: 'Complete South African coverage' }
  ];
  
  solutions.forEach((solution, i) => {
    const xPos = 0.5 + (i * 3.3);
    
    slide3.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: 2.0,
      w: 3.0,
      h: 2.5,
      fill: { color: 'FFFFFF' },
      line: { color: PRIMARY_COLOR, width: 2 }
    });
    
    slide3.addText(solution.title, {
      x: xPos,
      y: 2.5,
      w: 3.0,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: PRIMARY_COLOR,
      align: 'center'
    });
    
    slide3.addText(solution.desc, {
      x: xPos + 0.2,
      y: 3.2,
      w: 2.6,
      h: 1.0,
      fontSize: 12,
      color: '666666',
      align: 'center',
      valign: 'middle'
    });
  });
  
  // SLIDE 4: WHY PARTNER WITH QILLY
  const slide4 = pptx.addSlide();
  slide4.background = { color: 'FFFFFF' };
  
  slide4.addText('Why Partner with Qilly?', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: '000000'
  });
  
  const benefits = [
    {
      title: '✓ Increased Market Visibility',
      points: [
        'Featured on every relevant BOQ across South Africa',
        'Estimated reach: 500+ bills/month by Q4 2026'
      ]
    },
    {
      title: '✓ Competitive Advantage',
      points: [
        'Win more business on the platform contractors use',
        'First-mover advantage in digital procurement'
      ]
    },
    {
      title: '✓ Operational Efficiency',
      points: [
        'Reduce manual quotation requests by 40-60%',
        'Analytics on product demand'
      ]
    },
    {
      title: '✓ Digital Transformation',
      points: [
        'Free API development support (R50k-R150k value)',
        'Technical documentation and support'
      ]
    }
  ];
  
  benefits.forEach((benefit, i) => {
    const yPos = 1.5 + (i * 1.1);
    
    slide4.addText(benefit.title, {
      x: 0.5,
      y: yPos,
      w: 9,
      h: 0.3,
      fontSize: 16,
      bold: true,
      color: PRIMARY_COLOR
    });
    
    benefit.points.forEach((point, j) => {
      slide4.addText(`  • ${point}`, {
        x: 0.7,
        y: yPos + 0.35 + (j * 0.3),
        w: 8.8,
        h: 0.25,
        fontSize: 11,
        color: '666666'
      });
    });
  });
  
  // SLIDE 5: HOW IT WORKS
  const slide5 = pptx.addSlide();
  slide5.background = { color: 'F8FAFC' };
  
  slide5.addText('How the Integration Works', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: '000000'
  });
  
  const steps = [
    { num: '1', title: 'Daily Automated Sync', desc: "Qilly calls your API every morning at 06:00 SAST" },
    { num: '2', title: 'Intelligent Matching', desc: 'Our algorithms match BOQ items to catalog (98-99.5% success)' },
    { num: '3', title: 'Contractor Sees Your Prices', desc: 'Contractors see best rates including yours across all provinces' },
    { num: '4', title: 'You Get the Business', desc: 'Contractors contact you with priced BOQ - warm leads ready to buy' }
  ];
  
  steps.forEach((step, i) => {
    const yPos = 1.5 + (i * 1.0);
    
    slide5.addShape(pptx.ShapeType.ellipse, {
      x: 0.5,
      y: yPos,
      w: 0.5,
      h: 0.5,
      fill: { color: PRIMARY_COLOR }
    });
    
    slide5.addText(step.num, {
      x: 0.5,
      y: yPos,
      w: 0.5,
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      valign: 'middle'
    });
    
    slide5.addText(step.title, {
      x: 1.2,
      y: yPos,
      w: 8.3,
      h: 0.25,
      fontSize: 16,
      bold: true,
      color: '000000'
    });
    
    slide5.addText(step.desc, {
      x: 1.2,
      y: yPos + 0.3,
      w: 8.3,
      h: 0.4,
      fontSize: 12,
      color: '666666'
    });
  });
  
  // SLIDE 6: PARTNERSHIP MODELS
  const slide6 = pptx.addSlide();
  slide6.background = { color: 'FFFFFF' };
  
  slide6.addText('Partnership Models', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: '000000'
  });
  
  const models = [
    {
      name: 'Free Partnership',
      price: 'R0/year',
      badge: 'Recommended',
      badgeColor: '22C55E',
      features: [
        'API access & integration',
        'Standard supplier listing',
        'Basic analytics dashboard',
        'Email support'
      ]
    },
    {
      name: 'Featured Partner',
      price: 'R25,000/year',
      badge: 'Premium',
      badgeColor: PRIMARY_COLOR,
      features: [
        'Everything in Free, plus:',
        'Premium badge & top placement',
        'Advanced analytics',
        'Priority phone support'
      ]
    },
    {
      name: 'Revenue Share',
      price: '0.3-0.5%',
      badge: 'Performance',
      badgeColor: 'A855F7',
      features: [
        'Pay only on sales via Qilly',
        'Full transaction tracking',
        'Monthly invoicing',
        'Performance-based'
      ]
    }
  ];
  
  models.forEach((model, i) => {
    const xPos = 0.5 + (i * 3.3);
    
    slide6.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: 1.5,
      w: 3.0,
      h: 3.5,
      fill: { color: 'F0F9FF' },
      line: { color: PRIMARY_COLOR, width: 1 }
    });
    
    slide6.addShape(pptx.ShapeType.rect, {
      x: xPos + 0.1,
      y: 1.7,
      w: 1.5,
      h: 0.3,
      fill: { color: model.badgeColor }
    });
    
    slide6.addText(model.badge, {
      x: xPos + 0.1,
      y: 1.7,
      w: 1.5,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      valign: 'middle'
    });
    
    slide6.addText(model.name, {
      x: xPos + 0.1,
      y: 2.2,
      w: 2.8,
      h: 0.3,
      fontSize: 16,
      bold: true,
      color: '000000'
    });
    
    slide6.addText(model.price, {
      x: xPos + 0.1,
      y: 2.6,
      w: 2.8,
      h: 0.4,
      fontSize: 22,
      bold: true,
      color: PRIMARY_COLOR
    });
    
    model.features.forEach((feature, j) => {
      slide6.addText(`✓ ${feature}`, {
        x: xPos + 0.1,
        y: 3.2 + (j * 0.3),
        w: 2.8,
        h: 0.25,
        fontSize: 10,
        color: '666666'
      });
    });
  });
  
  // SLIDE 7: TECHNICAL REQUIREMENTS
  const slide7 = pptx.addSlide();
  slide7.background = { color: 'F8FAFC' };
  
  slide7.addText('What We Need From You', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: '000000'
  });
  
  slide7.addText('API Requirements:', {
    x: 0.5,
    y: 1.5,
    w: 4.5,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: PRIMARY_COLOR
  });
  
  const apiReqs = [
    'REST API endpoint (JSON format)',
    'Product catalog: SKU, description, unit, price',
    'Province/branch location data',
    'Daily price updates (automated)'
  ];
  
  apiReqs.forEach((req, i) => {
    slide7.addText(`• ${req}`, {
      x: 0.7,
      y: 2.0 + (i * 0.35),
      w: 4.3,
      h: 0.3,
      fontSize: 12,
      color: '666666'
    });
  });
  
  slide7.addText('From Your Team:', {
    x: 5.0,
    y: 1.5,
    w: 4.5,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: PRIMARY_COLOR
  });
  
  const teamReqs = [
    'Technical contact (IT/development team)',
    'Pricing/procurement contact',
    '~5-10 hours for initial setup & testing',
    'Ongoing: minimal (automated sync)'
  ];
  
  teamReqs.forEach((req, i) => {
    slide7.addText(`• ${req}`, {
      x: 5.2,
      y: 2.0 + (i * 0.35),
      w: 4.3,
      h: 0.3,
      fontSize: 12,
      color: '666666'
    });
  });
  
  slide7.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 3.8,
    w: 9,
    h: 0.8,
    fill: { color: 'E0F2FE' },
    line: { color: PRIMARY_COLOR, width: 1 }
  });
  
  slide7.addText("Don't have an API? We offer free API development support for qualified partners (valued at R50k-R150k).", {
    x: 0.7,
    y: 3.95,
    w: 8.6,
    h: 0.5,
    fontSize: 11,
    color: '000000',
    bold: true
  });
  
  // SLIDE 8: PRICE INTEGRITY SAFEGUARDS
  const slide8 = pptx.addSlide();
  slide8.background = { color: 'FFFFFF' };
  
  slide8.addText('Price Integrity Safeguards', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: '000000'
  });
  
  slide8.addText('Qilly maintains accurate, fair market pricing through:', {
    x: 0.5,
    y: 1.3,
    w: 9,
    h: 0.3,
    fontSize: 14,
    color: '666666'
  });
  
  const safeguards = [
    { title: 'Automated Detection', desc: 'Prices >20% increase flagged for review' },
    { title: 'Cross-Validation', desc: 'Compare same items across suppliers' },
    { title: 'Market Indexing', desc: 'Track Stats SA construction indices' },
    { title: 'Quarterly Audits', desc: 'Random spot-checks vs public prices' }
  ];
  
  safeguards.forEach((safeguard, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const xPos = 0.5 + (col * 4.75);
    const yPos = 2.0 + (row * 1.3);
    
    slide8.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: yPos,
      w: 4.5,
      h: 1.0,
      fill: { color: 'F0FDF4' },
      line: { color: '22C55E', width: 1 }
    });
    
    slide8.addText(`✓ ${safeguard.title}`, {
      x: xPos + 0.2,
      y: yPos + 0.15,
      w: 4.1,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: '000000'
    });
    
    slide8.addText(safeguard.desc, {
      x: xPos + 0.2,
      y: yPos + 0.5,
      w: 4.1,
      h: 0.3,
      fontSize: 11,
      color: '666666'
    });
  });
  
  slide8.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 4.8,
    w: 9,
    h: 0.7,
    fill: { color: 'FEF2F2' },
    line: { color: 'DC2626', width: 1 }
  });
  
  slide8.addText('Contract Protection: Our supplier agreement prohibits price inflation and allows audits against public rates.', {
    x: 0.7,
    y: 4.95,
    w: 8.6,
    h: 0.4,
    fontSize: 11,
    bold: true,
    color: '000000'
  });
  
  // SLIDE 9: SUCCESS METRICS & ROI
  const slide9 = pptx.addSlide();
  slide9.background = { color: 'F8FAFC' };
  
  slide9.addText('Success Metrics & ROI', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: '000000'
  });
  
  const metrics = [
    { value: '500+', label: 'Bills processed monthly\n(Q4 2026 target)' },
    { value: 'R15M+', label: 'Materials value\nquoted annually' },
    { value: '40-60%', label: 'Reduction in manual\nquote requests' }
  ];
  
  metrics.forEach((metric, i) => {
    const xPos = 0.5 + (i * 3.3);
    
    slide9.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: 1.5,
      w: 3.0,
      h: 1.5,
      fill: { color: 'FFFFFF' },
      line: { color: PRIMARY_COLOR, width: 2 }
    });
    
    slide9.addText(metric.value, {
      x: xPos,
      y: 1.8,
      w: 3.0,
      h: 0.5,
      fontSize: 32,
      bold: true,
      color: PRIMARY_COLOR,
      align: 'center'
    });
    
    slide9.addText(metric.label, {
      x: xPos,
      y: 2.4,
      w: 3.0,
      h: 0.5,
      fontSize: 11,
      color: '666666',
      align: 'center'
    });
  });
  
  slide9.addText('What You Can Track:', {
    x: 0.5,
    y: 3.5,
    w: 9,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: '000000'
  });
  
  const trackables = [
    'Number of BOQs your products appear in',
    'Win rate vs competitors (anonymous)',
    'Most requested products by category',
    'Geographic demand patterns per province'
  ];
  
  trackables.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const xPos = 0.5 + (col * 4.75);
    const yPos = 4.0 + (row * 0.35);
    
    slide9.addText(`✓ ${item}`, {
      x: xPos,
      y: yPos,
      w: 4.5,
      h: 0.3,
      fontSize: 12,
      color: '666666'
    });
  });
  
  // SLIDE 10: NEXT STEPS
  const slide10 = pptx.addSlide();
  
  slide10.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: 1.5,
    fill: { color: PRIMARY_COLOR }
  });
  
  slide10.addText("Let's Get Started", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 36,
    bold: true,
    color: 'FFFFFF',
    align: 'center'
  });
  
  slide10.addText('Onboarding Timeline: 7 weeks from discovery to go-live', {
    x: 0.5,
    y: 0.9,
    w: 9,
    h: 0.3,
    fontSize: 14,
    color: 'FFFFFF',
    align: 'center'
  });
  
  slide10.addText('Onboarding Timeline:', {
    x: 0.5,
    y: 2.0,
    w: 4.5,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: '000000'
  });
  
  const timeline = [
    'Week 1-2: Discovery (API spec review, contract)',
    'Week 3-4: Development (API setup, authentication)',
    'Week 5-6: Testing (Price validation, matching)',
    'Week 7: Go Live (Production deployment)'
  ];
  
  timeline.forEach((step, i) => {
    slide10.addText(`• ${step}`, {
      x: 0.7,
      y: 2.5 + (i * 0.35),
      w: 4.3,
      h: 0.3,
      fontSize: 12,
      color: '666666'
    });
  });
  
  slide10.addText('Contact Information:', {
    x: 5.0,
    y: 2.0,
    w: 4.5,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: '000000'
  });
  
  const contacts = [
    'Partnership Inquiries:',
    'partnerships@qilly.co.za',
    '',
    'Technical Integration:',
    'api@qilly.co.za',
    '',
    'Website: www.qilly.co.za'
  ];
  
  contacts.forEach((contact, i) => {
    slide10.addText(contact, {
      x: 5.2,
      y: 2.5 + (i * 0.25),
      w: 4.3,
      h: 0.2,
      fontSize: contact.includes('@') || contact.includes('www') ? 12 : 11,
      color: contact.includes(':') && !contact.includes('@') ? '000000' : '666666',
      bold: contact.includes(':') && !contact.includes('@')
    });
  });
  
  slide10.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 4.5,
    w: 9,
    h: 1.0,
    fill: { color: PRIMARY_COLOR }
  });
  
  slide10.addText('Ready to transform construction procurement together?', {
    x: 0.5,
    y: 4.7,
    w: 9,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: 'FFFFFF',
    align: 'center'
  });
  
  slide10.addText('Join Qilly as a founding supplier partner.', {
    x: 0.5,
    y: 5.05,
    w: 9,
    h: 0.3,
    fontSize: 13,
    color: 'FFFFFF',
    align: 'center'
  });
  
  // Save the presentation
  pptx.writeFile({ fileName: 'Qilly-Supplier-Partnership-Deck.pptx' });
}
