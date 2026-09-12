/**
 * Generate Qilly Investor Pitch Deck (PowerPoint)
 * Monday Investor Presentation - February 2026
 */

import pptxgen from 'pptxgenjs';

export async function generateInvestorPitchDeck() {
  const pptx = new pptxgen();

  // Presentation settings
  pptx.author = 'Qilly (Pty) Ltd';
  pptx.company = 'Qilly';
  pptx.subject = 'Investor Pitch Deck - Series A Fundraising';
  pptx.title = 'Qilly: Revolutionizing Construction Procurement in South Africa';

  // Define color scheme (Qilly brand colors)
  const colors = {
    primary: '1E40AF', // Blue
    secondary: '10B981', // Green
    accent: 'F59E0B', // Amber
    dark: '1F2937', // Gray-800
    light: 'F3F4F6', // Gray-100
    white: 'FFFFFF',
    red: 'EF4444',
  };

  // Helper function to add slide title
  const addSlideTitle = (slide: any, title: string, subtitle?: string) => {
    slide.addText(title, {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 36,
      bold: true,
      color: colors.dark,
      fontFace: 'Arial',
    });

    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.5,
        y: 0.95,
        w: 9,
        h: 0.4,
        fontSize: 18,
        color: colors.primary,
        fontFace: 'Arial',
      });
    }
  };

  // =============================================================================
  // SLIDE 1: TITLE SLIDE
  // =============================================================================
  const slide1 = pptx.addSlide();
  slide1.background = { color: colors.primary };

  slide1.addText('QILLY', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1.2,
    fontSize: 72,
    bold: true,
    color: colors.white,
    fontFace: 'Arial',
    align: 'center',
  });

  slide1.addText('Revolutionizing Construction Procurement in South Africa', {
    x: 0.5,
    y: 2.9,
    w: 9,
    h: 0.6,
    fontSize: 24,
    color: colors.white,
    fontFace: 'Arial',
    align: 'center',
  });

  slide1.addText('Investor Presentation • February 2026', {
    x: 0.5,
    y: 4.8,
    w: 9,
    h: 0.4,
    fontSize: 16,
    color: colors.light,
    fontFace: 'Arial',
    align: 'center',
  });

  slide1.addText('Automated BOQ Pricing • 5 Minutes • 100% Accuracy • 9 Provinces', {
    x: 0.5,
    y: 5.3,
    w: 9,
    h: 0.4,
    fontSize: 14,
    color: colors.accent,
    fontFace: 'Arial',
    align: 'center',
  });

  // =============================================================================
  // SLIDE 2: THE PROBLEM
  // =============================================================================
  const slide2 = pptx.addSlide();
  addSlideTitle(slide2, 'The R32.5 Billion Problem', 'Construction procurement crisis in South Africa');

  const problemData = [
    { label: 'Professional Fees Waste', value: 'R5.7B annually', impact: 'Eliminating QS fees' },
    { label: 'Project Delays', value: 'R12B lost/year', impact: '47% of housing projects delayed' },
    { label: 'Procurement Fraud', value: 'R14.8B stolen', impact: '30% of projects affected' },
  ];

  let yPos = 1.8;
  problemData.forEach((item, idx) => {
    // Icon box
    slide2.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: yPos,
      w: 0.5,
      h: 0.5,
      fill: { color: colors.red },
    });

    slide2.addText('❌', {
      x: 0.8,
      y: yPos,
      w: 0.5,
      h: 0.5,
      fontSize: 28,
      color: colors.white,
      align: 'center',
      valign: 'middle',
    });

    // Problem label
    slide2.addText(item.label, {
      x: 1.5,
      y: yPos,
      w: 3,
      h: 0.3,
      fontSize: 20,
      bold: true,
      color: colors.dark,
    });

    // Value
    slide2.addText(item.value, {
      x: 1.5,
      y: yPos + 0.35,
      w: 3,
      h: 0.25,
      fontSize: 24,
      bold: true,
      color: colors.red,
    });

    // Impact
    slide2.addText(item.impact, {
      x: 5,
      y: yPos + 0.15,
      w: 4,
      h: 0.3,
      fontSize: 14,
      color: colors.dark,
      italic: true,
    });

    yPos += 1.1;
  });

  // Total impact box
  slide2.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 5,
    w: 8.4,
    h: 0.6,
    fill: { color: colors.red },
  });

  slide2.addText('TOTAL ANNUAL WASTE: R32.5 BILLION', {
    x: 0.8,
    y: 5,
    w: 8.4,
    h: 0.6,
    fontSize: 28,
    bold: true,
    color: colors.white,
    align: 'center',
    valign: 'middle',
  });

  // =============================================================================
  // SLIDE 3: THE SOLUTION
  // =============================================================================
  const slide3 = pptx.addSlide();
  addSlideTitle(slide3, 'The Qilly Solution', 'AI-powered drawing analysis + automated BOQ pricing');

  const solutionFeatures = [
    { icon: '🤖', title: 'AI Extraction', subtitle: 'Upload drawings, auto-extract BOQ' },
    { icon: '⚡', title: '5 Minutes', subtitle: 'vs 3-7 days (99% faster)' },
    { icon: '💰', title: 'R0 Fees', subtitle: 'vs R15k-R50k per BOQ' },
    { icon: '🎯', title: '100% Accurate', subtitle: 'Materials + Labor + Equipment' },
    { icon: '🗺️', title: '9 Provinces', subtitle: 'Regional optimization' },
    { icon: '✅', title: 'Compliant', subtitle: 'SANS 1200, NBR, AGRÉMENT' },
  ];

  let xPos = 0.5;
  let yStart = 1.8;
  solutionFeatures.forEach((feature, idx) => {
    if (idx === 3) {
      xPos = 0.5;
      yStart = 3.7;
    }

    // Card background
    slide3.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: yStart,
      w: 2.8,
      h: 1.5,
      fill: { color: colors.light },
      line: { color: colors.primary, width: 2 },
    });

    // Icon
    slide3.addText(feature.icon, {
      x: xPos,
      y: yStart + 0.2,
      w: 2.8,
      h: 0.5,
      fontSize: 40,
      align: 'center',
    });

    // Title
    slide3.addText(feature.title, {
      x: xPos,
      y: yStart + 0.75,
      w: 2.8,
      h: 0.35,
      fontSize: 22,
      bold: true,
      color: colors.primary,
      align: 'center',
    });

    // Subtitle
    slide3.addText(feature.subtitle, {
      x: xPos,
      y: yStart + 1.1,
      w: 2.8,
      h: 0.3,
      fontSize: 13,
      color: colors.dark,
      align: 'center',
    });

    xPos += 3.1;
  });

  // =============================================================================
  // SLIDE 4: MARKET OPPORTUNITY
  // =============================================================================
  const slide4 = pptx.addSlide();
  addSlideTitle(slide4, 'Massive Market Opportunity', 'R54.6B TAM • No direct competitors');

  // TAM boxes
  const marketData = [
    { label: 'SA Construction', value: 'R856B', color: colors.dark },
    { label: 'Government Spend', value: 'R182B', color: colors.primary },
    { label: 'Target TAM', value: 'R54.6B', color: colors.secondary },
  ];

  let marketX = 1;
  marketData.forEach((market) => {
    slide4.addShape(pptx.ShapeType.rect, {
      x: marketX,
      y: 2,
      w: 2.5,
      h: 1.2,
      fill: { color: market.color },
    });

    slide4.addText(market.label, {
      x: marketX,
      y: 2.1,
      w: 2.5,
      h: 0.4,
      fontSize: 16,
      color: colors.white,
      align: 'center',
    });

    slide4.addText(market.value, {
      x: marketX,
      y: 2.5,
      w: 2.5,
      h: 0.6,
      fontSize: 36,
      bold: true,
      color: colors.white,
      align: 'center',
    });

    marketX += 2.8;
  });

  // Key segments
  slide4.addText('Target Customer Segments:', {
    x: 0.5,
    y: 3.6,
    w: 9,
    h: 0.4,
    fontSize: 20,
    bold: true,
    color: colors.dark,
  });

  const segments = [
    '🏛️ Department of Human Settlements (R65B)',
    '🏢 Provincial Housing Departments (R35B)',
    '🌆 Municipalities (R45B)',
    '🏗️ Private Developers (R85B)',
  ];

  let segY = 4.1;
  segments.forEach((segment) => {
    slide4.addText(segment, {
      x: 1,
      y: segY,
      w: 8,
      h: 0.35,
      fontSize: 16,
      color: colors.dark,
      bullet: true,
    });
    segY += 0.4;
  });

  // =============================================================================
  // SLIDE 5: COMPETITIVE LANDSCAPE
  // =============================================================================
  const slide5 = pptx.addSlide();
  addSlideTitle(slide5, 'Competitive Landscape', 'No direct competitors in automated government BOQ pricing');

  // Comparison table
  const compRows = [
    ['Feature', 'Traditional QS', 'CCS Candy', 'Buildsmart', 'QILLY'],
    ['Processing Time', '3-7 days', '2-5 days', 'Manual', '5 minutes'],
    ['Cost per BOQ', 'R15k-R50k', 'R60k/year license', 'N/A', 'R500-R2k'],
    ['Live Supplier Data', '❌', '❌', '❌', '✅'],
    ['Regional Optimization', '❌', '❌', '❌', '✅ (9 provinces)'],
    ['Compliance Auto-Check', '❌', '❌', '❌', '✅ SANS/NBR'],
    ['Anti-Corruption', '❌', '❌', '❌', '✅ Transparent'],
    ['Target Customer', 'Anyone', 'QS Firms', 'Large Contractors', 'Government'],
  ];

  slide5.addTable(compRows, {
    x: 0.5,
    y: 1.8,
    w: 9,
    h: 3.5,
    colW: [2.2, 1.7, 1.7, 1.7, 1.7],
    border: { type: 'solid', color: colors.primary, pt: 1 },
    fill: { color: colors.light },
    fontSize: 11,
    fontFace: 'Arial',
    align: 'center',
    valign: 'middle',
  });

  // Highlight Qilly column
  slide5.addShape(pptx.ShapeType.rect, {
    x: 7.6,
    y: 1.8,
    w: 1.7,
    h: 0.45,
    fill: { color: colors.secondary },
  });

  slide5.addText('QILLY', {
    x: 7.6,
    y: 1.8,
    w: 1.7,
    h: 0.45,
    fontSize: 14,
    bold: true,
    color: colors.white,
    align: 'center',
    valign: 'middle',
  });

  // Key insight
  slide5.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 5.5,
    w: 9,
    h: 0.5,
    fill: { color: colors.accent },
  });

  slide5.addText('🎯 Qilly is the ONLY platform with automated, government-focused BOQ pricing in South Africa', {
    x: 0.5,
    y: 5.5,
    w: 9,
    h: 0.5,
    fontSize: 16,
    bold: true,
    color: colors.white,
    align: 'center',
    valign: 'middle',
  });

  // =============================================================================
  // SLIDE 6: REVENUE MODEL
  // =============================================================================
  const slide6 = pptx.addSlide();
  addSlideTitle(slide6, 'Multi-Tier Revenue Model', 'SaaS + Marketplace + Transaction Fees');

  const pricingTiers = [
    {
      tier: 'Enterprise',
      price: 'R500k-R5M/year',
      target: 'Govt Departments',
      features: ['Unlimited BOQs', 'API Access', 'Dedicated Support'],
    },
    {
      tier: 'Professional',
      price: 'R50k-R500k/year',
      target: 'Municipalities',
      features: ['100+ BOQs/month', 'Multi-user', 'Advanced Reports'],
    },
    {
      tier: 'Standard',
      price: 'R5k-R50k/year',
      target: 'Private Sector',
      features: ['20 BOQs/month', 'Basic Features', 'Email Support'],
    },
  ];

  let tierX = 0.5;
  pricingTiers.forEach((tier, idx) => {
    const bgColor = idx === 0 ? colors.primary : idx === 1 ? colors.secondary : colors.dark;

    // Tier card
    slide6.addShape(pptx.ShapeType.rect, {
      x: tierX,
      y: 2,
      w: 3,
      h: 3,
      fill: { color: bgColor },
    });

    // Tier name
    slide6.addText(tier.tier, {
      x: tierX,
      y: 2.2,
      w: 3,
      h: 0.4,
      fontSize: 22,
      bold: true,
      color: colors.white,
      align: 'center',
    });

    // Price
    slide6.addText(tier.price, {
      x: tierX,
      y: 2.7,
      w: 3,
      h: 0.5,
      fontSize: 18,
      color: colors.accent,
      align: 'center',
    });

    // Target
    slide6.addText(tier.target, {
      x: tierX,
      y: 3.3,
      w: 3,
      h: 0.3,
      fontSize: 14,
      italic: true,
      color: colors.light,
      align: 'center',
    });

    // Features
    let featY = 3.7;
    tier.features.forEach((feature) => {
      slide6.addText(`✓ ${feature}`, {
        x: tierX + 0.2,
        y: featY,
        w: 2.6,
        h: 0.25,
        fontSize: 11,
        color: colors.white,
      });
      featY += 0.3;
    });

    tierX += 3.2;
  });

  // Additional revenue streams
  slide6.addText('Additional Revenue Streams:', {
    x: 0.5,
    y: 5.3,
    w: 9,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: colors.dark,
  });

  slide6.addText('• Supplier Marketplace Fees (2% transaction fee) • API Licensing • White-Label Partnerships', {
    x: 0.5,
    y: 5.65,
    w: 9,
    h: 0.3,
    fontSize: 13,
    color: colors.dark,
  });

  // =============================================================================
  // SLIDE 7: FINANCIAL PROJECTIONS
  // =============================================================================
  const slide7 = pptx.addSlide();
  addSlideTitle(slide7, '5-Year Financial Projections', 'Profitable Year 2 • 40% EBITDA margin by Year 5');

  const financialData = [
    ['Year', '2026', '2027', '2028', '2029', '2030', '2031'],
    ['Revenue', 'R18.5M', 'R62M', 'R165M', 'R385M', 'R585M', 'R819M'],
    ['EBITDA', '-R8.2M', 'R8.6M', 'R48M', 'R154M', 'R234M', 'R328M'],
    ['Margin', '-44%', '14%', '29%', '40%', '40%', '40%'],
    ['Customers', '28', '95', '185', '340', '485', '620'],
  ];

  slide7.addTable(financialData, {
    x: 0.5,
    y: 2,
    w: 9,
    h: 2,
    colW: [1.5, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25],
    border: { type: 'solid', color: colors.primary, pt: 1 },
    fill: { color: colors.light },
    fontSize: 13,
    fontFace: 'Arial',
    align: 'center',
    valign: 'middle',
    autoPage: false,
  });

  // Key metrics boxes
  const metrics = [
    { label: 'Revenue CAGR', value: '93%', icon: '📈' },
    { label: 'LTV:CAC Ratio', value: '24:1', icon: '💎' },
    { label: 'Gross Margin', value: '88%', icon: '💰' },
    { label: 'Year 5 Valuation', value: 'R4.9B', icon: '🚀' },
  ];

  let metricX = 0.5;
  metrics.forEach((metric) => {
    slide7.addShape(pptx.ShapeType.rect, {
      x: metricX,
      y: 4.5,
      w: 2.2,
      h: 1,
      fill: { color: colors.primary },
    });

    slide7.addText(metric.icon, {
      x: metricX,
      y: 4.6,
      w: 2.2,
      h: 0.3,
      fontSize: 24,
      align: 'center',
    });

    slide7.addText(metric.label, {
      x: metricX,
      y: 4.95,
      w: 2.2,
      h: 0.25,
      fontSize: 12,
      color: colors.light,
      align: 'center',
    });

    slide7.addText(metric.value, {
      x: metricX,
      y: 5.2,
      w: 2.2,
      h: 0.3,
      fontSize: 20,
      bold: true,
      color: colors.accent,
      align: 'center',
    });

    metricX += 2.35;
  });

  // =============================================================================
  // SLIDE 8: TRACTION & MILESTONES
  // =============================================================================
  const slide8 = pptx.addSlide();
  addSlideTitle(slide8, 'Current Traction', 'Live platform • Real suppliers • Government engagement');

  const tractionItems = [
    {
      icon: '✅',
      title: 'Product Launched',
      description: 'SIT environment 100% operational',
      status: 'COMPLETE',
    },
    {
      icon: '🤝',
      title: '31 Suppliers',
      description: '105+ products across 9 provinces',
      status: 'COMPLETE',
    },
    {
      icon: '⚡',
      title: '1.4 Second Pricing',
      description: '19 items priced with 100% accuracy',
      status: 'COMPLETE',
    },
    {
      icon: '🏛️',
      title: 'Government LOI',
      description: 'City of Johannesburg pilot starting',
      status: 'IN PROGRESS',
    },
  ];

  let tractionY = 2;
  tractionItems.forEach((item) => {
    // Status badge
    const badgeColor = item.status === 'COMPLETE' ? colors.secondary : colors.accent;
    slide8.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: tractionY,
      w: 1.2,
      h: 0.4,
      fill: { color: badgeColor },
    });

    slide8.addText(item.status, {
      x: 0.5,
      y: tractionY,
      w: 1.2,
      h: 0.4,
      fontSize: 10,
      bold: true,
      color: colors.white,
      align: 'center',
      valign: 'middle',
    });

    // Icon
    slide8.addText(item.icon, {
      x: 1.9,
      y: tractionY - 0.05,
      w: 0.5,
      h: 0.5,
      fontSize: 32,
    });

    // Title
    slide8.addText(item.title, {
      x: 2.6,
      y: tractionY,
      w: 3,
      h: 0.35,
      fontSize: 18,
      bold: true,
      color: colors.dark,
    });

    // Description
    slide8.addText(item.description, {
      x: 2.6,
      y: tractionY + 0.4,
      w: 6.5,
      h: 0.3,
      fontSize: 14,
      color: colors.dark,
    });

    tractionY += 0.9;
  });

  // Next milestones
  slide8.addText('Next 90 Days:', {
    x: 0.5,
    y: 5,
    w: 9,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: colors.primary,
  });

  const milestones = [
    '• Close R2-5M bridge round (enable City of Johannesburg pilot)',
    '• Expand to 75+ labor rates (BuildAid digitization)',
    '• Deploy UAT environment for government testing',
    '• Sign 3-5 municipal LOIs',
  ];

  let milestoneY = 5.5;
  milestones.forEach((milestone) => {
    slide8.addText(milestone, {
      x: 1,
      y: milestoneY,
      w: 8,
      h: 0.25,
      fontSize: 13,
      color: colors.dark,
    });
    milestoneY += 0.3;
  });

  // =============================================================================
  // SLIDE 9: DEMO SCREENSHOT - Updated with AI Drawing Feature
  // =============================================================================
  const slide9 = pptx.addSlide();
  addSlideTitle(slide9, 'Live Product Demo', '3 Ways to Price: Drawing (AI) • BOQ Upload • Manual Entry');

  // Two workflow options
  // Option 1: AI Drawing Analysis (NEW!)
  slide9.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 1.8,
    w: 9,
    h: 0.5,
    fill: { color: '9333EA' }, // Purple gradient
  });
  
  slide9.addText('🤖 NEW: AI-Powered Drawing Analysis', {
    x: 0.5,
    y: 1.8,
    w: 9,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: colors.white,
    align: 'center',
    valign: 'middle',
  });

  slide9.addText('1️⃣ Upload Drawing', {
    x: 0.5,
    y: 2.5,
    w: 2.5,
    h: 0.35,
    fontSize: 14,
    bold: true,
    color: colors.primary,
    align: 'center',
  });
  
  slide9.addText('(PDF, DWG, DXF)', {
    x: 0.5,
    y: 2.85,
    w: 2.5,
    h: 0.25,
    fontSize: 11,
    color: colors.dark,
    align: 'center',
  });

  slide9.addText('→', {
    x: 3,
    y: 2.5,
    w: 0.5,
    h: 0.35,
    fontSize: 20,
    bold: true,
    color: '9333EA',
    align: 'center',
  });

  slide9.addText('2️⃣ AI Extracts BOQ', {
    x: 3.5,
    y: 2.5,
    w: 2.5,
    h: 0.35,
    fontSize: 14,
    bold: true,
    color: colors.primary,
    align: 'center',
  });
  
  slide9.addText('(Quantities, materials)', {
    x: 3.5,
    y: 2.85,
    w: 2.5,
    h: 0.25,
    fontSize: 11,
    color: colors.dark,
    align: 'center',
  });

  slide9.addText('→', {
    x: 6,
    y: 2.5,
    w: 0.5,
    h: 0.35,
    fontSize: 20,
    bold: true,
    color: '9333EA',
    align: 'center',
  });

  slide9.addText('3️⃣ Full Pricing', {
    x: 6.5,
    y: 2.5,
    w: 3,
    h: 0.35,
    fontSize: 14,
    bold: true,
    color: colors.primary,
    align: 'center',
  });
  
  slide9.addText('(Mat + Labor + Equip)', {
    x: 6.5,
    y: 2.85,
    w: 3,
    h: 0.25,
    fontSize: 11,
    color: colors.dark,
    align: 'center',
  });

  // Traditional BOQ Upload
  slide9.addText('⚡ Traditional: Upload Excel BOQ → Auto-Price → Download', {
    x: 0.5,
    y: 3.5,
    w: 9,
    h: 0.35,
    fontSize: 14,
    color: colors.dark,
    align: 'center',
  });

  // Sample results box
  slide9.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 2.8,
    w: 9,
    h: 2.5,
    fill: { color: colors.light },
    line: { color: colors.primary, width: 2 },
  });

  slide9.addText('SAMPLE RESULTS: RDP Housing Project (100 Units)', {
    x: 0.5,
    y: 3,
    w: 9,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: colors.primary,
    align: 'center',
  });

  const resultData = [
    ['Component', 'Amount', '% of Total'],
    ['Materials', 'R1.9M', '60%'],
    ['Labor', 'R850k', '27%'],
    ['Equipment', 'R350k', '11%'],
    ['OH&P (15%)', 'R100k', '3%'],
    ['TOTAL PROJECT', 'R3.2M', '100%'],
  ];

  slide9.addTable(resultData, {
    x: 1.5,
    y: 3.6,
    w: 7,
    h: 1.5,
    colW: [3, 2, 2],
    border: { type: 'solid', color: colors.primary, pt: 1 },
    fontSize: 13,
    fontFace: 'Arial',
    align: 'center',
    valign: 'middle',
  });

  slide9.addText('⏱️ Processing Time: 1.4 seconds • ✅ Accuracy: 100% • 🗺️ Optimized for Gauteng Province', {
    x: 0.5,
    y: 5.5,
    w: 9,
    h: 0.4,
    fontSize: 14,
    color: colors.dark,
    align: 'center',
    italic: true,
  });

  // =============================================================================
  // SLIDE 10: INVESTMENT ASK
  // =============================================================================
  const slide10 = pptx.addSlide();
  slide10.background = { color: colors.primary };

  slide10.addText('Investment Opportunity', {
    x: 0.5,
    y: 1,
    w: 9,
    h: 0.6,
    fontSize: 36,
    bold: true,
    color: colors.white,
    align: 'center',
  });

  // Ask details
  const askDetails = [
    { label: 'Raising', value: 'R2-5M' },
    { label: 'Use of Funds', value: 'Bridge Round' },
    { label: 'Equity Offer', value: '10-15%' },
    { label: 'Valuation', value: 'R25-35M' },
  ];

  let askY = 2.2;
  askDetails.forEach((detail) => {
    slide10.addText(detail.label, {
      x: 2,
      y: askY,
      w: 3,
      h: 0.35,
      fontSize: 18,
      color: colors.light,
      align: 'right',
    });

    slide10.addText(detail.value, {
      x: 5.5,
      y: askY,
      w: 2.5,
      h: 0.35,
      fontSize: 24,
      bold: true,
      color: colors.accent,
      align: 'left',
    });

    askY += 0.5;
  });

  // Use of funds
  slide10.addText('Use of Funds:', {
    x: 0.5,
    y: 4.2,
    w: 9,
    h: 0.4,
    fontSize: 20,
    bold: true,
    color: colors.white,
  });

  const useFunds = [
    '• R1.5M: City of Johannesburg pilot deployment',
    '• R1M: Labor rate library expansion (BuildAid + eTender data)',
    '• R800k: Sales & marketing (3-5 municipal LOIs)',
    '• R700k: Engineering (UAT environment, API integrations)',
  ];

  let fundsY = 4.7;
  useFunds.forEach((use) => {
    slide10.addText(use, {
      x: 1,
      y: fundsY,
      w: 8,
      h: 0.25,
      fontSize: 15,
      color: colors.white,
    });
    fundsY += 0.3;
  });

  // =============================================================================
  // SLIDE 11: RETURN POTENTIAL
  // =============================================================================
  const slide11 = pptx.addSlide();
  addSlideTitle(slide11, 'Investor Return Potential', '39x return in 5 years • 108% IRR');

  const returnScenarios = [
    {
      scenario: 'Conservative',
      investment: 'R25M (20%)',
      year3: 'R91M',
      year5: 'R490M',
      moic: '20x',
      irr: '82%',
    },
    {
      scenario: 'Base Case',
      investment: 'R25M (20%)',
      year3: 'R183M',
      year5: 'R980M',
      moic: '39x',
      irr: '108%',
    },
    {
      scenario: 'Optimistic',
      investment: 'R25M (20%)',
      year3: 'R274M',
      year5: 'R1.47B',
      moic: '59x',
      irr: '128%',
    },
  ];

  const returnRows = [
    ['Scenario', 'Investment', 'Year 3 Exit', 'Year 5 Exit', 'MOIC', 'IRR'],
    ...returnScenarios.map((r) => [r.scenario, r.investment, r.year3, r.year5, r.moic, r.irr]),
  ];

  slide11.addTable(returnRows, {
    x: 0.5,
    y: 2,
    w: 9,
    h: 1.5,
    colW: [2, 1.5, 1.5, 1.5, 1.25, 1.25],
    border: { type: 'solid', color: colors.primary, pt: 1 },
    fontSize: 12,
    fontFace: 'Arial',
    align: 'center',
    valign: 'middle',
  });

  // Highlight base case
  slide11.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 2.5,
    w: 2,
    h: 0.5,
    fill: { color: colors.secondary },
  });

  slide11.addText('Base Case', {
    x: 0.5,
    y: 2.5,
    w: 2,
    h: 0.5,
    fontSize: 12,
    bold: true,
    color: colors.white,
    align: 'center',
    valign: 'middle',
  });

  // Exit scenarios
  slide11.addText('Potential Exit Scenarios:', {
    x: 0.5,
    y: 4,
    w: 9,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: colors.dark,
  });

  const exits = [
    { type: 'Strategic Acquisition', buyers: 'SAP, Oracle, Autodesk, Procore', probability: 'High' },
    { type: 'Private Equity', buyers: 'African infrastructure funds', probability: 'Medium' },
    { type: 'JSE IPO', buyers: 'Public markets (Year 6-7)', probability: 'Medium' },
  ];

  let exitY = 4.6;
  exits.forEach((exit) => {
    slide11.addText(`${exit.type} (${exit.probability})`, {
      x: 1,
      y: exitY,
      w: 3,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: colors.primary,
    });

    slide11.addText(exit.buyers, {
      x: 4.5,
      y: exitY,
      w: 4.5,
      h: 0.3,
      fontSize: 13,
      color: colors.dark,
      italic: true,
    });

    exitY += 0.4;
  });

  // =============================================================================
  // SLIDE 12: CONTACT & NEXT STEPS
  // =============================================================================
  const slide12 = pptx.addSlide();
  slide12.background = { color: colors.dark };

  slide12.addText('Thank You', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 0.8,
    fontSize: 48,
    bold: true,
    color: colors.white,
    align: 'center',
  });

  slide12.addText("Let's revolutionize construction procurement together", {
    x: 0.5,
    y: 2.4,
    w: 9,
    h: 0.5,
    fontSize: 20,
    color: colors.accent,
    align: 'center',
    italic: true,
  });

  // Contact info
  slide12.addText('Contact Information:', {
    x: 0.5,
    y: 3.5,
    w: 9,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: colors.white,
    align: 'center',
  });

  const contactInfo = [
    '🌐 Website: https://qilly.co.za',
    '🚀 Live Demo: https://sit.qilly.co.za',
    '📧 Email: invest@qilly.co.za',
    '📱 Schedule: calendly.com/qilly-investor-demos',
  ];

  let contactY = 4.1;
  contactInfo.forEach((info) => {
    slide12.addText(info, {
      x: 0.5,
      y: contactY,
      w: 9,
      h: 0.3,
      fontSize: 15,
      color: colors.light,
      align: 'center',
    });
    contactY += 0.35;
  });

  // Next steps
  slide12.addText('Next Steps:', {
    x: 0.5,
    y: 5.5,
    w: 9,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: colors.accent,
    align: 'center',
  });

  slide12.addText('1. Live product demo • 2. Due diligence • 3. Term sheet discussion', {
    x: 0.5,
    y: 5.85,
    w: 9,
    h: 0.25,
    fontSize: 13,
    color: colors.white,
    align: 'center',
  });

  // =============================================================================
  // EXPORT PRESENTATION
  // =============================================================================
  return pptx;
}

/**
 * Download the investor pitch deck
 */
export async function downloadInvestorPitchDeck() {
  try {
    const pptx = await generateInvestorPitchDeck();
    const fileName = `Qilly_Investor_Pitch_Deck_${new Date().toISOString().split('T')[0]}.pptx`;
    await pptx.writeFile({ fileName });
    console.log('✅ Investor pitch deck downloaded:', fileName);
    return fileName;
  } catch (error) {
    console.error('❌ Error generating investor pitch deck:', error);
    throw error;
  }
}
