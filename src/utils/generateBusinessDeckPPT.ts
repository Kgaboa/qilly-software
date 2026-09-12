import pptxgen from 'pptxgenjs';

export function generateBusinessDeckPPT() {
  const pres = new pptxgen();
  
  // Set presentation properties
  pres.author = 'Qilly - Construction Billing Intelligence';
  pres.company = 'Qilly';
  pres.subject = 'Qilly Business Deck - Construction BOQ Pricing Platform';
  pres.title = 'Qilly Business Deck';
  
  // Define color palette
  const colors = {
    primary: '00b4d8',
    primaryDark: '0077b6',
    secondary: '90e0ef',
    accent: '48cae4',
    success: '14532d',
    danger: 'dc2626',
    warning: 'f59e0b',
    gray: '6b7280',
    lightGray: 'f3f4f6',
    white: 'ffffff',
    black: '000000'
  };
  
  // Slide 1: Title Slide
  const slide1 = pres.addSlide();
  slide1.background = { color: colors.primary };
  
  slide1.addText('QILLY', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1.5,
    fontSize: 88,
    bold: true,
    color: colors.white,
    align: 'center'
  });
  
  slide1.addText('Construction Billing Intelligence Platform', {
    x: 1,
    y: 3.2,
    w: 8,
    h: 0.7,
    fontSize: 28,
    color: colors.secondary,
    align: 'center'
  });
  
  slide1.addText('Automatic BOQ Pricing • Multi-Supplier Comparison • 100% Accuracy', {
    x: 1,
    y: 4.2,
    w: 8,
    h: 0.5,
    fontSize: 16,
    color: colors.white,
    align: 'center'
  });
  
  // Slide 2: The Problem
  const slide2 = pres.addSlide();
  slide2.background = { color: colors.white };
  
  slide2.addText('THE PROBLEM', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.7,
    fontSize: 44,
    bold: true,
    color: colors.primary,
    align: 'center'
  });
  
  slide2.addText('Manual BOQ pricing is costing construction companies time, money, and accuracy', {
    x: 1,
    y: 1.5,
    w: 8,
    h: 0.6,
    fontSize: 18,
    color: colors.gray,
    align: 'center',
    italic: true
  });
  
  // Problem points
  const problems = [
    { icon: '⏱️', title: '2-3 Days Per Bill', desc: 'Estimators spend days manually pricing each BOQ' },
    { icon: '❌', title: '15-20% Pricing Errors', desc: 'Human error leads to significant cost overruns' },
    { icon: '📞', title: 'Multiple Phone Calls', desc: 'Hours wasted calling suppliers for quotes' },
    { icon: '💰', title: 'Money Left on Table', desc: 'Missing better rates from other suppliers' }
  ];
  
  let yPos = 2.5;
  problems.forEach((problem, idx) => {
    const xPos = idx < 2 ? 0.8 : 5.3;
    const yOffset = idx % 2 === 0 ? 0 : 1.8;
    
    slide2.addText(problem.icon, {
      x: xPos,
      y: yPos + yOffset,
      w: 0.8,
      h: 0.8,
      fontSize: 48,
      align: 'center'
    });
    
    slide2.addText(problem.title, {
      x: xPos + 0.9,
      y: yPos + yOffset,
      w: 3.2,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: colors.black
    });
    
    slide2.addText(problem.desc, {
      x: xPos + 0.9,
      y: yPos + yOffset + 0.4,
      w: 3.2,
      h: 0.4,
      fontSize: 12,
      color: colors.gray
    });
  });
  
  // Slide 3: The Solution
  const slide3 = pres.addSlide();
  slide3.background = { color: colors.white };
  
  slide3.addText('THE SOLUTION', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.7,
    fontSize: 44,
    bold: true,
    color: colors.primary,
    align: 'center'
  });
  
  slide3.addText('Qilly automates BOQ pricing with intelligent matching across multiple suppliers', {
    x: 1,
    y: 1.5,
    w: 8,
    h: 0.6,
    fontSize: 18,
    color: colors.gray,
    align: 'center',
    italic: true
  });
  
  // Solution features
  const features = [
    { icon: '📄', title: 'Upload BOQ', desc: 'Excel or CSV format bills accepted' },
    { icon: '🔍', title: 'Automatic Pricing', desc: 'Intelligent matching engine searches 4 suppliers across 9 provinces automatically' },
    { icon: '💰', title: 'Best Rates Found', desc: 'Compares all suppliers and provinces for optimal pricing' },
    { icon: '⚡', title: 'Results in 5 Minutes', desc: '100% accuracy for all 10,000+ items' }
  ];
  
  yPos = 2.5;
  features.forEach((feature, idx) => {
    const xPos = idx < 2 ? 0.8 : 5.3;
    const yOffset = idx % 2 === 0 ? 0 : 1.8;
    
    slide3.addText(feature.icon, {
      x: xPos,
      y: yPos + yOffset,
      w: 0.8,
      h: 0.8,
      fontSize: 48,
      align: 'center'
    });
    
    slide3.addText(feature.title, {
      x: xPos + 0.9,
      y: yPos + yOffset,
      w: 3.2,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: colors.black
    });
    
    slide3.addText(feature.desc, {
      x: xPos + 0.9,
      y: yPos + yOffset + 0.4,
      w: 3.2,
      h: 0.8,
      fontSize: 12,
      color: colors.gray
    });
  });
  
  // Slide 4: How It Works
  const slide4 = pres.addSlide();
  slide4.background = { color: colors.white };
  
  slide4.addText('HOW IT WORKS', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.7,
    fontSize: 44,
    bold: true,
    color: colors.primary,
    align: 'center'
  });
  
  // Process steps
  const steps = [
    { num: 1, title: 'Upload Your BOQ', points: [
      'Excel or CSV format accepted',
      'Standard BOQ column structure',
      'ITEM NO, DESCRIPTION, UNIT, QUANTITY columns required',
      'Supports 10,000+ line items per bill'
    ]},
    { num: 2, title: 'Automatic Processing', points: [
      'Intelligent matching engine searches 4 major suppliers simultaneously',
      'Checks prices across all 9 South African provinces',
      'Provincial price adjustments for transport and logistics',
      'Best price selected for each item automatically'
    ]},
    { num: 3, title: 'Download Results', points: [
      'Fully priced BOQ with RATE and AMOUNT columns',
      'Supplier breakdown showing all quotes received',
      'Provincial price comparison for transparency',
      'Ready to use in your tender submission'
    ]}
  ];
  
  yPos = 1.5;
  steps.forEach((step) => {
    slide4.addText(`${step.num}`, {
      x: 0.8,
      y: yPos,
      w: 0.6,
      h: 0.6,
      fontSize: 32,
      bold: true,
      color: colors.white,
      fill: { color: colors.primary },
      align: 'center',
      valign: 'middle'
    });
    
    slide4.addText(step.title, {
      x: 1.5,
      y: yPos,
      w: 7.5,
      h: 0.5,
      fontSize: 18,
      bold: true,
      color: colors.primary
    });
    
    step.points.forEach((point, idx) => {
      slide4.addText(`• ${point}`, {
        x: 1.5,
        y: yPos + 0.5 + (idx * 0.25),
        w: 7.5,
        h: 0.25,
        fontSize: 11,
        color: colors.gray
      });
    });
    
    yPos += 1.6;
  });
  
  // Slide 5: ROI Calculator
  const slide5 = pres.addSlide();
  slide5.background = { color: colors.white };
  
  slide5.addText('ROI CALCULATOR', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.7,
    fontSize: 44,
    bold: true,
    color: colors.primary,
    align: 'center'
  });
  
  slide5.addText('See how much time and money Qilly saves your business', {
    x: 1,
    y: 1.4,
    w: 8,
    h: 0.5,
    fontSize: 16,
    color: colors.gray,
    align: 'center',
    italic: true
  });
  
  // ROI metrics
  const roiMetrics = [
    { label: 'Bills Priced Per Month', before: '20', after: '80', improvement: '+300%' },
    { label: 'Hours Spent Pricing', before: '48h', after: '1.6h', improvement: '-97%' },
    { label: 'Cost Per Bill', before: 'R 2,400', after: 'R 50', improvement: '-98%' },
    { label: 'Pricing Accuracy', before: '80%', after: '100%', improvement: '+25%' }
  ];
  
  yPos = 2.2;
  roiMetrics.forEach((metric, idx) => {
    // Label
    slide5.addText(metric.label, {
      x: 1,
      y: yPos + (idx * 0.9),
      w: 3,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: colors.black
    });
    
    // Before
    slide5.addText(metric.before, {
      x: 4,
      y: yPos + (idx * 0.9),
      w: 1.5,
      h: 0.4,
      fontSize: 14,
      color: colors.danger,
      align: 'center'
    });
    
    // Arrow
    slide5.addText('→', {
      x: 5.5,
      y: yPos + (idx * 0.9),
      w: 0.5,
      h: 0.4,
      fontSize: 18,
      color: colors.gray,
      align: 'center'
    });
    
    // After
    slide5.addText(metric.after, {
      x: 6,
      y: yPos + (idx * 0.9),
      w: 1.5,
      h: 0.4,
      fontSize: 14,
      color: colors.success,
      align: 'center',
      bold: true
    });
    
    // Improvement
    slide5.addText(metric.improvement, {
      x: 7.5,
      y: yPos + (idx * 0.9),
      w: 1.5,
      h: 0.4,
      fontSize: 12,
      color: colors.success,
      align: 'center',
      italic: true
    });
  });
  
  // Slide 6: Pricing Plans
  const slide6 = pres.addSlide();
  slide6.background = { color: colors.white };
  
  slide6.addText('PRICING PLANS', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.7,
    fontSize: 44,
    bold: true,
    color: colors.primary,
    align: 'center'
  });
  
  // Plans
  const plans = [
    { name: 'FREE TRIAL', price: 'R 0', desc: '1 free bill to test the platform', features: ['1 bill processed', 'Full supplier comparison', 'Provincial pricing', '48-hour support'] },
    { name: 'PAY-AS-YOU-GO', price: 'R 50', desc: 'Per bill pricing with no commitment', features: ['No monthly fees', 'Unlimited items per bill', 'All suppliers & provinces', 'Email support'] },
    { name: 'ENTERPRISE', price: 'Custom', desc: 'For high-volume users', features: ['Volume discounts', 'Priority processing', 'Custom integrations', '24/7 phone support'] }
  ];
  
  plans.forEach((plan, idx) => {
    const xPos = 0.8 + (idx * 3.1);
    
    // Plan box background
    slide6.addShape(pres.ShapeType.rect, {
      x: xPos,
      y: 1.6,
      w: 2.8,
      h: 3.5,
      fill: { color: idx === 1 ? colors.primary : colors.lightGray },
      line: { color: idx === 1 ? colors.primaryDark : colors.gray, width: 1 }
    });
    
    // Plan name
    slide6.addText(plan.name, {
      x: xPos,
      y: 1.8,
      w: 2.8,
      h: 0.5,
      fontSize: 16,
      bold: true,
      color: idx === 1 ? colors.white : colors.primary,
      align: 'center'
    });
    
    // Price
    slide6.addText(plan.price, {
      x: xPos,
      y: 2.4,
      w: 2.8,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: idx === 1 ? colors.white : colors.primary,
      align: 'center'
    });
    
    // Description
    slide6.addText(plan.desc, {
      x: xPos + 0.2,
      y: 3.1,
      w: 2.4,
      h: 0.4,
      fontSize: 10,
      color: idx === 1 ? colors.secondary : colors.gray,
      align: 'center',
      italic: true
    });
    
    // Features
    plan.features.forEach((feature, fidx) => {
      slide6.addText(`✓ ${feature}`, {
        x: xPos + 0.2,
        y: 3.6 + (fidx * 0.3),
        w: 2.4,
        h: 0.3,
        fontSize: 10,
        color: idx === 1 ? colors.white : colors.black
      });
    });
  });
  
  // Slide 7: Features & Benefits
  const slide7 = pres.addSlide();
  slide7.background = { color: colors.white };
  
  slide7.addText('FEATURES & BENEFITS', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.7,
    fontSize: 44,
    bold: true,
    color: colors.primary,
    align: 'center'
  });
  
  const featureCategories = [
    { category: 'Time Savings', items: ['5-minute processing time', 'Automatic item matching', 'No manual data entry', 'Instant results delivery'] },
    { category: 'Smart Processing', items: ['Intelligent item matching', 'Advanced fuzzy search algorithms', 'Handles 10,000+ items per bill', 'Real-time price updates'] },
    { category: 'User Experience', items: ['Simple Excel/CSV upload', 'Intuitive dashboard', 'Project settings saved', 'Bill history tracking'] },
    { category: 'Cost Savings', items: ['Best supplier rates', 'Provincial comparison', 'Transparent pricing', 'Volume discounts available'] }
  ];
  
  yPos = 1.6;
  featureCategories.forEach((cat, idx) => {
    const xPos = idx < 2 ? 0.8 : 5.3;
    const yOffset = idx % 2 === 0 ? 0 : 2.2;
    
    slide7.addText(cat.category, {
      x: xPos,
      y: yPos + yOffset,
      w: 3.8,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: colors.primary
    });
    
    cat.items.forEach((item, iidx) => {
      slide7.addText(`• ${item}`, {
        x: xPos + 0.2,
        y: yPos + yOffset + 0.5 + (iidx * 0.3),
        w: 3.6,
        h: 0.3,
        fontSize: 11,
        color: colors.gray
      });
    });
  });
  
  // Slide 8: Supplier Coverage
  const slide8 = pres.addSlide();
  slide8.background = { color: colors.white };
  
  slide8.addText('SUPPLIER COVERAGE', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.7,
    fontSize: 44,
    bold: true,
    color: colors.primary,
    align: 'center'
  });
  
  slide8.addText('Integrated with South Africa\'s leading construction suppliers', {
    x: 1,
    y: 1.4,
    w: 8,
    h: 0.5,
    fontSize: 16,
    color: colors.gray,
    align: 'center',
    italic: true
  });
  
  const suppliers = [
    { name: 'Buco', items: 'Hardware & Building Materials', color: 'dc2626' },
    { name: 'Macsteel', items: 'Steel & Metal Products', color: '3b82f6' },
    { name: 'Raumix', items: 'Cement & Aggregates', color: 'f59e0b' },
    { name: 'Lafarge', items: 'Cement & Concrete Products', color: '10b981' }
  ];
  
  suppliers.forEach((supplier, idx) => {
    const xPos = 1.2 + (idx * 2.2);
    
    slide8.addShape(pres.ShapeType.rect, {
      x: xPos,
      y: 2.3,
      w: 1.8,
      h: 2,
      fill: { color: supplier.color },
      line: { color: supplier.color, width: 0 }
    });
    
    slide8.addText(supplier.name, {
      x: xPos,
      y: 2.6,
      w: 1.8,
      h: 0.6,
      fontSize: 18,
      bold: true,
      color: colors.white,
      align: 'center'
    });
    
    slide8.addText(supplier.items, {
      x: xPos + 0.1,
      y: 3.4,
      w: 1.6,
      h: 0.6,
      fontSize: 11,
      color: colors.white,
      align: 'center'
    });
  });
  
  slide8.addText('Coverage across all 9 South African provinces', {
    x: 2,
    y: 4.7,
    w: 6,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: colors.primary,
    align: 'center'
  });
  
  // Slide 9: Customer Testimonials
  const slide9 = pres.addSlide();
  slide9.background = { color: colors.lightGray };
  
  slide9.addText('CUSTOMER TESTIMONIALS', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.7,
    fontSize: 44,
    bold: true,
    color: colors.primary,
    align: 'center'
  });
  
  const testimonials = [
    { quote: '"Qilly reduced our BOQ pricing time from 3 days to 5 minutes. Game changer for our estimating team!"', author: 'John Smith', company: 'ABC Construction Ltd', role: 'Chief Estimator' },
    { quote: '"We found 18% cost savings on our last project by comparing suppliers across provinces. Qilly paid for itself immediately."', author: 'Sarah Johnson', company: 'BuildRight Projects', role: 'Procurement Manager' },
    { quote: '"The accuracy is incredible. No more pricing errors or last-minute corrections. Our tenders are more competitive now."', author: 'Michael Brown', company: 'Elite Builders SA', role: 'Operations Director' }
  ];
  
  testimonials.forEach((test, idx) => {
    slide9.addShape(pres.ShapeType.rect, {
      x: 0.8,
      y: 1.6 + (idx * 1.3),
      w: 8.4,
      h: 1.1,
      fill: { color: colors.white },
      line: { color: colors.gray, width: 1 }
    });
    
    slide9.addText(`"${test.quote}"`, {
      x: 1,
      y: 1.7 + (idx * 1.3),
      w: 8,
      h: 0.5,
      fontSize: 11,
      color: colors.gray,
      italic: true
    });
    
    slide9.addText(`— ${test.author}, ${test.role}`, {
      x: 1,
      y: 2.3 + (idx * 1.3),
      w: 8,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: colors.primary
    });
    
    slide9.addText(test.company, {
      x: 1,
      y: 2.5 + (idx * 1.3),
      w: 8,
      h: 0.2,
      fontSize: 9,
      color: colors.gray
    });
  });
  
  // Slide 10: Call to Action
  const slide10 = pres.addSlide();
  slide10.background = { color: colors.primary };
  
  slide10.addText('GET STARTED TODAY', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1,
    fontSize: 52,
    bold: true,
    color: colors.white,
    align: 'center'
  });
  
  slide10.addText('Try Qilly with 1 free bill - no credit card required', {
    x: 1,
    y: 2.8,
    w: 8,
    h: 0.6,
    fontSize: 22,
    color: colors.secondary,
    align: 'center'
  });
  
  const ctaItems = [
    { icon: '🌐', text: 'Visit www.qilly.co.za' },
    { icon: '✉️', text: 'Email info@qilly.co.za' },
    { icon: '📱', text: 'Call +27 11 123 4567' }
  ];
  
  ctaItems.forEach((item, idx) => {
    slide10.addText(`${item.icon} ${item.text}`, {
      x: 2,
      y: 3.8 + (idx * 0.4),
      w: 6,
      h: 0.4,
      fontSize: 16,
      color: colors.white,
      align: 'center'
    });
  });
  
  slide10.addText('Join the Future of Construction Billing', {
    x: 2,
    y: 5.3,
    w: 6,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: colors.white,
    align: 'center'
  });
  
  // Save presentation
  pres.writeFile({ fileName: `Qilly_Business_Deck_${new Date().toISOString().split('T')[0]}.pptx` });
}
