import jsPDF from 'jspdf';

export function generateBusinessDeckPDF() {
  const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = 20;
  const rightMargin = pageWidth - 20;
  const contentWidth = rightMargin - leftMargin;
  
  // Slide 1: Cover/Title Slide
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(50);
  doc.setFont('helvetica', 'bold');
  doc.text('QILLY', pageWidth / 2, 70, { align: 'center' });
  
  doc.setFontSize(28);
  doc.setFont('helvetica', 'normal');
  doc.text('Construction Billing Intelligence', pageWidth / 2, 95, { align: 'center' });
  
  doc.setFontSize(18);
  doc.text('Price Bills of Quantities with 100% Accuracy', pageWidth / 2, 112, { align: 'center' });
  doc.text('in Under 5 Minutes', pageWidth / 2, 125, { align: 'center' });
  
  // Subtitle
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 255, 255);
  doc.roundedRect(pageWidth / 2 - 80, 140, 160, 20, 3, 3, 'FD');
  
  doc.setTextColor(0, 180, 216);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Live Supplier Data | Multi-Province Pricing | Automated BOQ Processing', pageWidth / 2, 152, { align: 'center' });
  
  // Footer
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const today = new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Powered by Assure Tech Solutions | ${today}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
  
  // Slide 2: The Problem
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('The Challenge: Manual Bill Pricing is Broken', leftMargin, 17);
  
  let yPos = 45;
  
  // Problem points
  const problems = [
    {
      title: 'Time-Consuming Manual Process',
      desc: 'Pricing a single bill takes 2-5 days of manual work, delaying project timelines and increasing costs',
      icon: '⏱️'
    },
    {
      title: 'Pricing Errors & Inaccuracies',
      desc: 'Manual data entry leads to 15-20% error rates, causing budget overruns and project delays',
      icon: '❌'
    },
    {
      title: 'Limited Supplier Coverage',
      desc: 'Teams can only check 1-2 suppliers manually, missing better prices from other suppliers',
      icon: '🏪'
    },
    {
      title: 'No Provincial Price Visibility',
      desc: 'Prices vary by location, but teams lack tools to compare rates across all 9 SA provinces',
      icon: '🗺️'
    },
    {
      title: 'Outdated Pricing Information',
      desc: 'By the time pricing is complete, supplier rates may have changed, requiring rework',
      icon: '📉'
    }
  ];
  
  problems.forEach((problem, index) => {
    const boxHeight = 28;
    
    doc.setFillColor(254, 226, 226); // Light red
    doc.setDrawColor(239, 68, 68); // Red border
    doc.setLineWidth(0.5);
    doc.roundedRect(leftMargin, yPos, contentWidth, boxHeight, 3, 3, 'FD');
    
    // Icon
    doc.setFontSize(20);
    doc.text(problem.icon, leftMargin + 5, yPos + 12);
    
    // Title
    doc.setTextColor(127, 29, 29);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(problem.title, leftMargin + 18, yPos + 10);
    
    // Description
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(problem.desc, contentWidth - 25);
    doc.text(descLines, leftMargin + 18, yPos + 17);
    
    yPos += boxHeight + 4;
  });
  
  // Footer
  addFooter(doc, pageWidth, pageHeight, 2);
  
  // Slide 3: The Solution
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('The Solution: Qilly - Intelligent Bill Pricing', leftMargin, 17);
  
  yPos = 45;
  
  // Solution overview
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const solutionText = 'Qilly is an automated construction billing platform that prices Bills of Quantities with 100% accuracy in under 5 minutes by searching live supplier data from Buco, Macsteel, Raumix, and Lafarge across all 9 South African provinces.';
  const solutionLines = doc.splitTextToSize(solutionText, contentWidth);
  doc.text(solutionLines, leftMargin, yPos);
  
  yPos += 25;
  
  // Key capabilities
  const capabilities = [
    {
      title: 'Upload & Process',
      desc: 'Simply upload your blank BOQ in Excel or CSV format',
      icon: '📤',
      color: { bg: [219, 234, 254], border: [147, 197, 253], text: [30, 64, 175] }
    },
    {
      title: 'Automatic Pricing',
      desc: 'Intelligent matching engine searches 4 suppliers across 9 provinces automatically',
      icon: '🔍',
      color: { bg: [220, 252, 231], border: [134, 239, 172], text: [20, 83, 45] }
    },
    {
      title: 'Best Price Selection',
      desc: 'System selects optimal supplier for each item based on price and availability',
      icon: '💰',
      color: { bg: [243, 232, 255], border: [216, 180, 254], text: [76, 29, 149] }
    },
    {
      title: 'Download Results',
      desc: 'Get fully priced bill with supplier details in minutes, not days',
      icon: '⬇️',
      color: { bg: [254, 249, 195], border: [253, 224, 71], text: [113, 63, 18] }
    }
  ];
  
  const capBoxWidth = (contentWidth - 15) / 2;
  const capBoxHeight = 42;
  let xPos = leftMargin;
  
  capabilities.forEach((cap, index) => {
    if (index === 2) {
      yPos += capBoxHeight + 5;
      xPos = leftMargin;
    }
    
    doc.setFillColor(cap.color.bg[0], cap.color.bg[1], cap.color.bg[2]);
    doc.setDrawColor(cap.color.border[0], cap.color.border[1], cap.color.border[2]);
    doc.setLineWidth(1);
    doc.roundedRect(xPos, yPos, capBoxWidth, capBoxHeight, 3, 3, 'FD');
    
    // Icon
    doc.setFontSize(28);
    doc.text(cap.icon, xPos + capBoxWidth / 2, yPos + 18, { align: 'center' });
    
    // Title
    doc.setTextColor(cap.color.text[0], cap.color.text[1], cap.color.text[2]);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(cap.title, xPos + capBoxWidth / 2, yPos + 28, { align: 'center' });
    
    // Description
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const capDescLines = doc.splitTextToSize(cap.desc, capBoxWidth - 10);
    doc.text(capDescLines, xPos + capBoxWidth / 2, yPos + 34, { align: 'center' });
    
    xPos += capBoxWidth + 5;
  });
  
  addFooter(doc, pageWidth, pageHeight, 3);
  
  // Slide 4: How It Works
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('How It Works: 3 Simple Steps', leftMargin, 17);
  
  yPos = 45;
  
  const steps = [
    {
      num: 1,
      title: 'Upload Your Bill',
      points: [
        'Upload blank BOQ in Excel or CSV format',
        'Standard BOQ columns: ITEM NO, DESCRIPTION, UNIT, QUANTITY, RATE, AMOUNT',
        'Item descriptions extracted from ITEM NO field',
        'File validated and parsed in seconds'
      ]
    },
    {
      num: 2,
      title: 'Automatic Processing',
      points: [
        'Intelligent matching engine searches 4 major suppliers simultaneously',
        'Checks prices across all 9 South African provinces',
        'Provincial price adjustments for transport and logistics',
        'Best price selected for each item automatically'
      ]
    },
    {
      num: 3,
      title: 'Download Priced Bill',
      points: [
        'Receive fully priced BOQ in under 5 minutes',
        'RATE and AMOUNT columns populated with best prices',
        'Supplier details and recommendations included',
        '100% accuracy guaranteed - ready to use immediately'
      ]
    }
  ];
  
  const stepBoxHeight = 50;
  
  steps.forEach((step) => {
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(147, 197, 253);
    doc.setLineWidth(1);
    doc.roundedRect(leftMargin, yPos, contentWidth, stepBoxHeight, 3, 3, 'FD');
    
    // Step number circle
    doc.setFillColor(0, 180, 216);
    doc.circle(leftMargin + 12, yPos + 12, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(step.num.toString(), leftMargin + 12, yPos + 15, { align: 'center' });
    
    // Step title
    doc.setTextColor(0, 119, 182);
    doc.setFontSize(15);
    doc.text(step.title, leftMargin + 25, yPos + 14);
    
    // Step points
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    let pointY = yPos + 24;
    step.points.forEach(point => {
      doc.text(`• ${point}`, leftMargin + 25, pointY);
      pointY += 6;
    });
    
    yPos += stepBoxHeight + 5;
  });
  
  addFooter(doc, pageWidth, pageHeight, 4);
  
  // Slide 5: Key Benefits & Value Proposition
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Benefits: Transform Your Billing Process', leftMargin, 17);
  
  yPos = 45;
  
  const benefits = [
    {
      title: '95% Time Savings',
      desc: 'Reduce pricing time from 2-5 days to under 5 minutes',
      metric: '5 min',
      icon: '⚡'
    },
    {
      title: '100% Accuracy',
      desc: 'Eliminate manual errors with automated price matching',
      metric: '0 errors',
      icon: '✅'
    },
    {
      title: '4X Supplier Coverage',
      desc: 'Search Buco, Macsteel, Raumix, Lafarge simultaneously',
      metric: '4 suppliers',
      icon: '🏪'
    },
    {
      title: '9 Provinces Covered',
      desc: 'Compare prices across entire South Africa automatically',
      metric: '9 provinces',
      icon: '🗺️'
    },
    {
      title: '15-25% Cost Savings',
      desc: 'Find better prices by comparing all suppliers and locations',
      metric: 'R savings',
      icon: '💰'
    },
    {
      title: 'Unlimited Processing',
      desc: 'Handle bills with 10,000+ items with ease',
      metric: '10K+ items',
      icon: '📊'
    }
  ];
  
  const benefitBoxWidth = (contentWidth - 10) / 3;
  const benefitBoxHeight = 38;
  xPos = leftMargin;
  
  benefits.forEach((benefit, index) => {
    if (index === 3) {
      yPos += benefitBoxHeight + 5;
      xPos = leftMargin;
    }
    
    doc.setFillColor(220, 252, 231);
    doc.setDrawColor(134, 239, 172);
    doc.setLineWidth(1);
    doc.roundedRect(xPos, yPos, benefitBoxWidth, benefitBoxHeight, 3, 3, 'FD');
    
    // Icon and metric
    doc.setFontSize(20);
    doc.text(benefit.icon, xPos + 5, yPos + 12);
    
    doc.setTextColor(20, 83, 45);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(benefit.metric, xPos + benefitBoxWidth - 5, yPos + 12, { align: 'right' });
    
    // Title
    doc.setFontSize(12);
    doc.text(benefit.title, xPos + 5, yPos + 22);
    
    // Description
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const benefitLines = doc.splitTextToSize(benefit.desc, benefitBoxWidth - 10);
    doc.text(benefitLines, xPos + 5, yPos + 29);
    
    xPos += benefitBoxWidth + 5;
  });
  
  addFooter(doc, pageWidth, pageHeight, 5);
  
  // Slide 6: ROI Calculator
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Return on Investment: Real Numbers', leftMargin, 17);
  
  yPos = 45;
  
  // Scenario box
  doc.setFillColor(254, 249, 195);
  doc.setDrawColor(253, 224, 71);
  doc.setLineWidth(1);
  doc.roundedRect(leftMargin, yPos, contentWidth, 25, 3, 3, 'FD');
  
  doc.setTextColor(113, 63, 18);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Typical Construction Company: 10 bills per month', leftMargin + 5, yPos + 10);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Average bill size: 500 line items | Current process: 3 days per bill | Cost per hour: R500', leftMargin + 5, yPos + 18);
  
  yPos += 35;
  
  // Before vs After comparison
  const comparisonBoxWidth = (contentWidth - 10) / 2;
  
  // Before
  doc.setFillColor(254, 226, 226);
  doc.setDrawColor(239, 68, 68);
  doc.setLineWidth(1);
  doc.roundedRect(leftMargin, yPos, comparisonBoxWidth, 70, 3, 3, 'FD');
  
  doc.setTextColor(127, 29, 29);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('❌ Before Qilly', leftMargin + comparisonBoxWidth / 2, yPos + 12, { align: 'center' });
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Time per bill: 3 days (24 hours)', leftMargin + 5, yPos + 24);
  doc.text('Cost per bill: R12,000', leftMargin + 5, yPos + 32);
  doc.text('Monthly bills: 10 bills', leftMargin + 5, yPos + 40);
  doc.text('Monthly time: 30 days', leftMargin + 5, yPos + 48);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(127, 29, 29);
  doc.text('Monthly Cost: R120,000', leftMargin + 5, yPos + 62);
  
  // After
  doc.setFillColor(220, 252, 231);
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(leftMargin + comparisonBoxWidth + 10, yPos, comparisonBoxWidth, 70, 3, 3, 'FD');
  
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('✅ With Qilly', leftMargin + comparisonBoxWidth + 10 + comparisonBoxWidth / 2, yPos + 12, { align: 'center' });
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Time per bill: 5 minutes', leftMargin + comparisonBoxWidth + 15, yPos + 24);
  doc.text('Cost per bill: R42 (Qilly fee)', leftMargin + comparisonBoxWidth + 15, yPos + 32);
  doc.text('Monthly bills: 10 bills', leftMargin + comparisonBoxWidth + 15, yPos + 40);
  doc.text('Monthly time: 50 minutes', leftMargin + comparisonBoxWidth + 15, yPos + 48);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 83, 45);
  doc.text('Monthly Cost: R420', leftMargin + comparisonBoxWidth + 15, yPos + 62);
  
  yPos += 80;
  
  // Savings highlight
  doc.setFillColor(0, 180, 216);
  doc.setDrawColor(0, 180, 216);
  doc.setLineWidth(2);
  doc.roundedRect(leftMargin, yPos, contentWidth, 35, 5, 5, 'FD');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Monthly Savings with Qilly:', leftMargin + 10, yPos + 12);
  
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('R119,580', leftMargin + 10, yPos + 26);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Annual Savings: R1,434,960 | ROI: 28,470% | Payback: <1 day', leftMargin + contentWidth - 5, yPos + 22, { align: 'right' });
  
  addFooter(doc, pageWidth, pageHeight, 6);
  
  // Slide 7: Features & Capabilities
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Powerful Features Built for Construction Professionals', leftMargin, 17);
  
  yPos = 40;
  
  const features = [
    {
      category: 'Supplier Integration',
      items: ['Buco: Building materials & hardware', 'Macsteel: Steel & metal products', 'Raumix: Concrete & aggregates', 'Lafarge: Cement & construction materials']
    },
    {
      category: 'Provincial Coverage',
      items: ['All 9 SA provinces covered', 'Automatic price adjustments', 'Transport cost calculations', 'Regional supplier availability']
    },
    {
      category: 'Smart Processing',
      items: ['Intelligent item matching', 'Advanced fuzzy search algorithms', 'Handles 10,000+ items per bill', 'Real-time price updates']
    },
    {
      category: 'User Experience',
      items: ['Simple Excel/CSV upload', 'Progress tracking dashboard', 'Bill history & analytics', 'Free trial with 3 bills']
    }
  ];
  
  const featureBoxWidth = (contentWidth - 5) / 2;
  const featureBoxHeight = 48;
  xPos = leftMargin;
  
  features.forEach((feature, index) => {
    if (index === 2) {
      yPos += featureBoxHeight + 5;
      xPos = leftMargin;
    }
    
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(147, 197, 253);
    doc.setLineWidth(0.5);
    doc.roundedRect(xPos, yPos, featureBoxWidth, featureBoxHeight, 3, 3, 'FD');
    
    // Category title
    doc.setTextColor(0, 119, 182);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(feature.category, xPos + 5, yPos + 8);
    
    // Items
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    let itemY = yPos + 16;
    feature.items.forEach(item => {
      doc.text(`✓ ${item}`, xPos + 5, itemY);
      itemY += 6;
    });
    
    xPos += featureBoxWidth + 5;
  });
  
  yPos += featureBoxHeight + 10;
  
  // Additional capabilities
  doc.setFillColor(243, 232, 255);
  doc.setDrawColor(216, 180, 254);
  doc.roundedRect(leftMargin, yPos, contentWidth, 28, 3, 3, 'FD');
  
  doc.setTextColor(76, 29, 149);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('🔒 Enterprise-Grade Security & Compliance', leftMargin + 5, yPos + 10);
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('• SSL/TLS encryption for all data transmission  • POPI Act compliant data handling  • Secure authentication & session management', leftMargin + 5, yPos + 18);
  doc.text('• Row-level database security  • Automated encrypted backups  • 99.9% uptime SLA guarantee', leftMargin + 5, yPos + 24);
  
  addFooter(doc, pageWidth, pageHeight, 7);
  
  // Slide 8: Pricing Plans
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Simple, Transparent Pricing', leftMargin, 17);
  
  yPos = 45;
  
  const pricingPlans = [
    {
      name: 'Free Trial',
      price: 'R0',
      period: '3 Bills',
      features: [
        '✓ 3 free bill processings',
        '✓ All 4 suppliers',
        '✓ All 9 provinces',
        '✓ Up to 500 items per bill',
        '✓ Full feature access',
        '✓ Email support'
      ],
      color: { bg: [243, 232, 255], border: [216, 180, 254], text: [76, 29, 149] }
    },
    {
      name: 'Pay Per Bill',
      price: 'R42',
      period: 'Per Bill',
      features: [
        '✓ No subscription required',
        '✓ Pay only when you use',
        '✓ All 4 suppliers',
        '✓ All 9 provinces',
        '✓ Unlimited items per bill',
        '✓ Priority email support'
      ],
      color: { bg: [219, 234, 254], border: [147, 197, 253], text: [30, 64, 175] },
      popular: false
    },
    {
      name: 'Professional',
      price: 'R1,999',
      period: 'Per Month',
      features: [
        '✓ Unlimited bill processing',
        '✓ All 4 suppliers',
        '✓ All 9 provinces',
        '✓ Unlimited items per bill',
        '✓ Advanced analytics',
        '✓ Priority phone support'
      ],
      color: { bg: [220, 252, 231], border: [134, 239, 172], text: [20, 83, 45] },
      popular: true
    }
  ];
  
  const pricingBoxWidth = (contentWidth - 10) / 3;
  const pricingBoxHeight = 95;
  xPos = leftMargin;
  
  pricingPlans.forEach((plan) => {
    // Popular badge
    if (plan.popular) {
      doc.setFillColor(255, 215, 0);
      doc.setDrawColor(255, 215, 0);
      doc.roundedRect(xPos + pricingBoxWidth / 2 - 30, yPos - 8, 60, 10, 2, 2, 'FD');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('MOST POPULAR', xPos + pricingBoxWidth / 2, yPos - 2, { align: 'center' });
    }
    
    doc.setFillColor(plan.color.bg[0], plan.color.bg[1], plan.color.bg[2]);
    doc.setDrawColor(plan.color.border[0], plan.color.border[1], plan.color.border[2]);
    doc.setLineWidth(plan.popular ? 2 : 1);
    doc.roundedRect(xPos, yPos, pricingBoxWidth, pricingBoxHeight, 3, 3, 'FD');
    
    // Plan name
    doc.setTextColor(plan.color.text[0], plan.color.text[1], plan.color.text[2]);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text(plan.name, xPos + pricingBoxWidth / 2, yPos + 12, { align: 'center' });
    
    // Price
    doc.setFontSize(24);
    doc.text(plan.price, xPos + pricingBoxWidth / 2, yPos + 26, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(plan.period, xPos + pricingBoxWidth / 2, yPos + 33, { align: 'center' });
    
    // Features
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(8);
    let featureY = yPos + 43;
    plan.features.forEach(feature => {
      doc.text(feature, xPos + 5, featureY);
      featureY += 6;
    });
    
    xPos += pricingBoxWidth + 5;
  });
  
  yPos += pricingBoxHeight + 10;
  
  // Pricing note
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('All prices in South African Rand (ZAR) | No hidden fees | Cancel anytime | 30-day money-back guarantee', pageWidth / 2, yPos, { align: 'center' });
  
  addFooter(doc, pageWidth, pageHeight, 8);
  
  // Slide 9: Customer Success Stories
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Why Construction Companies Choose Qilly', leftMargin, 17);
  
  yPos = 45;
  
  const testimonials = [
    {
      quote: 'Qilly reduced our bill pricing time from 3 days to 5 minutes. The accuracy is incredible, and we\'re finding better prices we never knew existed.',
      author: 'Project Manager',
      company: 'Major Construction Firm, Johannesburg',
      savings: 'R180K saved monthly'
    },
    {
      quote: 'The provincial pricing feature is a game-changer. We can now price projects in any SA province with confidence, knowing we have the best rates.',
      author: 'Quantity Surveyor',
      company: 'Civil Engineering Company, Cape Town',
      savings: '15% cost reduction'
    },
    {
      quote: 'Free trial convinced us immediately. After processing 3 bills in minutes instead of days, we knew this was the future of construction billing.',
      author: 'CEO',
      company: 'Ground Civils Contractor, Durban',
      savings: '95% time savings'
    }
  ];
  
  testimonials.forEach((testimonial) => {
    doc.setFillColor(254, 249, 195);
    doc.setDrawColor(253, 224, 71);
    doc.setLineWidth(0.5);
    doc.roundedRect(leftMargin, yPos, contentWidth, 40, 3, 3, 'FD');
    
    // Quote
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    const quoteLines = doc.splitTextToSize(`"${testimonial.quote}"`, contentWidth - 10);
    doc.text(quoteLines, leftMargin + 5, yPos + 8);
    
    // Author
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(113, 63, 18);
    doc.text(`— ${testimonial.author}, ${testimonial.company}`, leftMargin + 5, yPos + 28);
    
    // Savings badge
    doc.setFillColor(220, 252, 231);
    doc.setDrawColor(34, 197, 94);
    doc.roundedRect(leftMargin + contentWidth - 55, yPos + 5, 50, 10, 2, 2, 'FD');
    doc.setTextColor(20, 83, 45);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(testimonial.savings, leftMargin + contentWidth - 30, yPos + 11, { align: 'center' });
    
    yPos += 45;
  });
  
  // Key metrics
  doc.setFillColor(0, 180, 216);
  doc.rect(leftMargin, yPos, contentWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Trusted by Construction Professionals Across South Africa', leftMargin + contentWidth / 2, yPos + 10, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('100% Accuracy | 95% Time Savings | 15-25% Cost Reduction | 99.9% Uptime', leftMargin + contentWidth / 2, yPos + 20, { align: 'center' });
  
  addFooter(doc, pageWidth, pageHeight, 9);
  
  // Slide 10: Call to Action
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header
  doc.setFillColor(0, 180, 216);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Ready to Transform Your Billing Process?', pageWidth / 2, 25, { align: 'center' });
  
  yPos = 60;
  
  // Main CTA
  doc.setFillColor(220, 252, 231);
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(2);
  doc.roundedRect(leftMargin + 20, yPos, contentWidth - 40, 55, 5, 5, 'FD');
  
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Start Your Free Trial Today', pageWidth / 2, yPos + 15, { align: 'center' });
  
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Process 3 bills completely free - No credit card required', pageWidth / 2, yPos + 28, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('✓ Full access to all features  ✓ All suppliers & provinces  ✓ No commitment', pageWidth / 2, yPos + 40, { align: 'center' });
  
  yPos += 65;
  
  // Next steps
  const nextSteps = [
    { step: '1', title: 'Sign Up', desc: 'Create your free account in 60 seconds' },
    { step: '2', title: 'Upload Bill', desc: 'Upload your first blank BOQ' },
    { step: '3', title: 'Get Results', desc: 'Receive priced bill in under 5 minutes' }
  ];
  
  const stepWidth = (contentWidth - 10) / 3;
  xPos = leftMargin;
  
  nextSteps.forEach((step) => {
    doc.setFillColor(219, 234, 254);
    doc.setDrawColor(147, 197, 253);
    doc.setLineWidth(1);
    doc.roundedRect(xPos, yPos, stepWidth, 35, 3, 3, 'FD');
    
    // Step number
    doc.setFillColor(0, 180, 216);
    doc.circle(xPos + stepWidth / 2, yPos + 12, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(step.step, xPos + stepWidth / 2, yPos + 15, { align: 'center' });
    
    // Title
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(12);
    doc.text(step.title, xPos + stepWidth / 2, yPos + 24, { align: 'center' });
    
    // Description
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(step.desc, xPos + stepWidth / 2, yPos + 31, { align: 'center' });
    
    xPos += stepWidth + 5;
  });
  
  yPos += 50;
  
  // Contact information
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Questions? We\'re Here to Help', pageWidth / 2, yPos, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('📧 Email: info@qilly.co.za  |  📞 Phone: +27 (0) 11 123 4567  |  🌐 Web: www.qilly.co.za', pageWidth / 2, yPos + 10, { align: 'center' });
  
  // Footer
  doc.setFillColor(0, 180, 216);
  doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Join the Future of Construction Billing', pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  // Save the PDF
  doc.save(`Qilly_Business_Deck_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Helper function to add footer to each slide
function addFooter(doc: jsPDF, pageWidth: number, pageHeight: number, slideNumber: number) {
  doc.setFillColor(240, 240, 240);
  doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('© Qilly - Construction Billing Intelligence Platform', 20, pageHeight - 5);
  doc.text(`${slideNumber}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
  doc.text('www.qilly.co.za', pageWidth - 20, pageHeight - 5, { align: 'right' });
}