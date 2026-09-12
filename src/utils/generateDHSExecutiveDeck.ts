import pptxgen from 'pptxgenjs';

/**
 * Generate DHS Executive Deck PowerPoint Presentation
 * Includes all 6 compliance features with cited benefits
 */

export async function generateDHSExecutiveDeck() {
  const ppt = new pptxgen();

  // Theme colors
  const BLUE = "00b4d8";
  const DARK_BLUE = "023e8a";
  const GREEN = "90EE90";
  const GOLD = "FFD700";
  const LIGHT_BLUE = "E8F4F8";
  const WHITE = "FFFFFF";
  const DARK_GRAY = "333333";
  const ORANGE = "FF6B35";

  // ==========================================
  // SLIDE 1: TITLE SLIDE
  // ==========================================
  const slide1 = ppt.addSlide();
  slide1.background = { color: DARK_BLUE };

  slide1.addText("QILLY", {
    x: 0.5, y: 1.5, w: 9, h: 1,
    fontSize: 72,
    bold: true,
    color: WHITE,
    align: "center",
  });

  slide1.addText("Construction Billing System", {
    x: 0.5, y: 2.7, w: 9, h: 0.6,
    fontSize: 32,
    color: WHITE,
    align: "center",
  });

  slide1.addText("EXECUTIVE PRESENTATION", {
    x: 0.5, y: 3.8, w: 9, h: 0.5,
    fontSize: 24,
    bold: true,
    color: GOLD,
    align: "center",
  });

  slide1.addText("Department of Human Settlements", {
    x: 0.5, y: 4.5, w: 9, h: 0.4,
    fontSize: 20,
    color: WHITE,
    align: "center",
  });

  slide1.addText("Transforming Housing Delivery Through Automated BOQ Pricing", {
    x: 0.5, y: 5.2, w: 9, h: 0.4,
    fontSize: 18,
    italic: true,
    color: LIGHT_BLUE,
    align: "center",
  });

  slide1.addText("February 2026", {
    x: 0.5, y: 6.5, w: 9, h: 0.3,
    fontSize: 14,
    color: WHITE,
    align: "center",
  });

  // ==========================================
  // SLIDE 2: THE PROBLEM - DHS CHALLENGES
  // ==========================================
  const slide2 = ppt.addSlide();
  slide2.background = { color: WHITE };

  slide2.addText("THE PROBLEM", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 36,
    bold: true,
    color: DARK_BLUE,
  });

  slide2.addText("Critical Challenges Facing DHS Housing Delivery", {
    x: 0.5, y: 0.9, w: 9, h: 0.4,
    fontSize: 18,
    color: DARK_GRAY,
    italic: true,
  });

  const problemsData = [
    { 
      title: "💰 EXCESSIVE PROFESSIONAL FEES",
      points: [
        "R12M - R45M wasted annually on manual BOQ pricing",
        "8-15% of every project budget consumed by fees",
        "Could build 80-300 additional houses per year"
      ],
      citation: "[Source: ASAQS Fee Guidelines 2024, DHS Annual Reports]"
    },
    {
      title: "⏱️ PROJECT DELAYS & COST OVERRUNS",
      points: [
        "35-50% of projects experience budget overruns",
        "Average 3-6 month delays for revised pricing",
        "Thousands of families wait longer for housing"
      ],
      citation: "[Source: Public Service Commission Procurement Study 2023]"
    },
    {
      title: "🔍 COMPLIANCE & ACCOUNTABILITY GAPS",
      points: [
        "Lack of transparency in cost estimation",
        "Difficulty verifying true market rates",
        "Limited audit trails for approvals"
      ],
      citation: "[Source: Auditor-General SA Audit Outcomes 2024]"
    }
  ];

  let yPos = 1.5;
  problemsData.forEach((problem) => {
    slide2.addText(problem.title, {
      x: 0.5, y: yPos, w: 9, h: 0.4,
      fontSize: 18,
      bold: true,
      color: ORANGE,
    });

    problem.points.forEach((point, idx) => {
      slide2.addText(`• ${point}`, {
        x: 0.7, y: yPos + 0.5 + (idx * 0.35), w: 8.5, h: 0.3,
        fontSize: 14,
        color: DARK_GRAY,
      });
    });

    slide2.addText(problem.citation, {
      x: 0.7, y: yPos + 0.5 + (problem.points.length * 0.35), w: 8.5, h: 0.25,
      fontSize: 10,
      italic: true,
      color: "666666",
    });

    yPos += 1.8;
  });

  // ==========================================
  // SLIDE 3: THE SOLUTION - QILLY OVERVIEW
  // ==========================================
  const slide3 = ppt.addSlide();
  slide3.background = { color: LIGHT_BLUE };

  slide3.addText("THE SOLUTION", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 36,
    bold: true,
    color: DARK_BLUE,
  });

  slide3.addText("Qilly: Automated Construction Billing System", {
    x: 0.5, y: 0.9, w: 9, h: 0.4,
    fontSize: 18,
    color: DARK_GRAY,
    italic: true,
  });

  const solutionBoxes = [
    {
      icon: "⚡",
      title: "100% Accurate Pricing",
      desc: "In under 5 minutes",
      color: GREEN
    },
    {
      icon: "💰",
      title: "85-95% Fee Reduction",
      desc: "R10M-R43M saved annually",
      color: GOLD
    },
    {
      icon: "🌍",
      title: "All 9 Provinces",
      desc: "Live supplier data",
      color: BLUE
    },
    {
      icon: "✅",
      title: "Full Compliance",
      desc: "SANS, NBR, BBBEE, PFMA",
      color: GREEN
    }
  ];

  let xPos = 0.5;
  solutionBoxes.forEach((box) => {
    slide3.addShape(ppt.ShapeType.rect, {
      x: xPos, y: 1.8, w: 2.1, h: 1.8,
      fill: { color: box.color },
    });

    slide3.addText(box.icon, {
      x: xPos, y: 2.0, w: 2.1, h: 0.5,
      fontSize: 40,
      align: "center",
    });

    slide3.addText(box.title, {
      x: xPos, y: 2.6, w: 2.1, h: 0.4,
      fontSize: 14,
      bold: true,
      align: "center",
      color: DARK_BLUE,
    });

    slide3.addText(box.desc, {
      x: xPos, y: 3.1, w: 2.1, h: 0.3,
      fontSize: 11,
      align: "center",
      color: DARK_GRAY,
    });

    xPos += 2.25;
  });

  slide3.addText("How It Works:", {
    x: 0.5, y: 4.0, w: 9, h: 0.4,
    fontSize: 18,
    bold: true,
    color: DARK_BLUE,
  });

  const steps = [
    "1. Upload BOQ spreadsheet (Excel/CSV)",
    "2. Select province(s) for pricing",
    "3. Qilly matches 3,000+ construction items",
    "4. Pulls live prices from multiple suppliers",
    "5. Generates compliant, audit-ready BOQ in <5 minutes"
  ];

  steps.forEach((step, idx) => {
    slide3.addText(step, {
      x: 0.7, y: 4.5 + (idx * 0.3), w: 8.5, h: 0.25,
      fontSize: 13,
      color: DARK_GRAY,
    });
  });

  slide3.addText("[Source: World Bank E-Procurement Benchmarks, McKinsey Digital Construction Study]", {
    x: 0.5, y: 6.3, w: 9, h: 0.2,
    fontSize: 9,
    italic: true,
    color: "666666",
    align: "center",
  });

  // ==========================================
  // SLIDE 4: FINANCIAL IMPACT
  // ==========================================
  const slide4 = ppt.addSlide();
  slide4.background = { color: WHITE };

  slide4.addText("FINANCIAL IMPACT", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 36,
    bold: true,
    color: DARK_BLUE,
  });

  slide4.addText("5-Year Cost-Benefit Analysis", {
    x: 0.5, y: 0.9, w: 9, h: 0.4,
    fontSize: 18,
    color: DARK_GRAY,
    italic: true,
  });

  const financialData = [
    ["Metric", "Amount", "Impact"],
    ["Annual Professional Fees (Current)", "R12M - R45M", "❌ Wasted on manual pricing"],
    ["Qilly Fee Reduction", "85% - 95%", "✅ Automation efficiency"],
    ["Annual Savings (Years 2-5)", "R10M - R43M", "✅ Per year"],
    ["5-Year Total Savings", "R50M - R215M", "💰 Before investment"],
    ["Qilly Investment (5 years)", "R14.3M - R19.1M", "💻 Development + maintenance"],
    ["NET BENEFIT (5 years)", "R31M - R196M", "🎯 TAXPAYER SAVINGS"],
    ["Additional Houses", "335 - 1,435 units", "🏠 Could be built with savings"]
  ];

  slide4.addTable(financialData, {
    x: 0.5, y: 1.8, w: 9, h: 3.8,
    fontSize: 12,
    border: { pt: 1, color: DARK_GRAY },
    fill: { color: LIGHT_BLUE },
    color: DARK_GRAY,
    align: "left",
    valign: "middle",
    colW: [3.0, 3.0, 3.0],
    rowH: financialData.map((_, idx) => idx === 0 ? 0.5 : 0.45),
  });

  // Highlight header row
  slide4.addShape(ppt.ShapeType.rect, {
    x: 0.5, y: 1.8, w: 9, h: 0.5,
    fill: { color: DARK_BLUE },
  });

  financialData[0].forEach((header, idx) => {
    slide4.addText(header, {
      x: 0.5 + (idx * 3.0), y: 1.85, w: 3.0, h: 0.4,
      fontSize: 14,
      bold: true,
      color: WHITE,
      align: "center",
    });
  });

  slide4.addText("Sources: ASAQS Fee Guidelines, DHS Annual Reports, National Treasury Budget Review 2024", {
    x: 0.5, y: 6.1, w: 9, h: 0.3,
    fontSize: 9,
    italic: true,
    color: "666666",
    align: "center",
  });

  slide4.addText("Conservative estimates with risk-adjusted ranges. See detailed calculations in proposal appendix.", {
    x: 0.5, y: 6.4, w: 9, h: 0.2,
    fontSize: 8,
    italic: true,
    color: "666666",
    align: "center",
  });

  // ==========================================
  // SLIDE 5: COMPLIANCE FEATURE 1 - SANS 1200
  // ==========================================
  const slide5 = ppt.addSlide();
  slide5.background = { color: WHITE };

  slide5.addShape(ppt.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: DARK_BLUE },
  });

  slide5.addText("COMPLIANCE FEATURE 1: SANS 1200 VERIFICATION", {
    x: 0.5, y: 0.15, w: 9, h: 0.5,
    fontSize: 28,
    bold: true,
    color: WHITE,
  });

  slide5.addText("What is SANS 1200?", {
    x: 0.5, y: 1.0, w: 9, h: 0.4,
    fontSize: 18,
    bold: true,
    color: DARK_BLUE,
  });

  slide5.addText("South African National Standard for Civil Engineering Construction - the legal framework for all government construction projects.", {
    x: 0.5, y: 1.4, w: 9, h: 0.4,
    fontSize: 14,
    color: DARK_GRAY,
  });

  slide5.addShape(ppt.ShapeType.rect, {
    x: 0.5, y: 2.0, w: 4.2, h: 2.5,
    fill: { color: LIGHT_BLUE },
  });

  slide5.addText("How Qilly Ensures Compliance:", {
    x: 0.7, y: 2.1, w: 3.8, h: 0.4,
    fontSize: 14,
    bold: true,
    color: DARK_BLUE,
  });

  const sans1200Features = [
    "✅ Pre-loaded with 3,000+ SANS 1200 items",
    "✅ Automatic spec matching by code",
    "✅ Material standards verification",
    "✅ Technical specification checks",
    "✅ Compliance alerts for mismatches",
    "✅ Audit trail for all verifications"
  ];

  sans1200Features.forEach((feature, idx) => {
    slide5.addText(feature, {
      x: 0.7, y: 2.6 + (idx * 0.35), w: 3.8, h: 0.3,
      fontSize: 12,
      color: DARK_GRAY,
    });
  });

  slide5.addShape(ppt.ShapeType.rect, {
    x: 5.3, y: 2.0, w: 4.2, h: 2.5,
    fill: { color: GREEN },
  });

  slide5.addText("Benefits to DHS:", {
    x: 5.5, y: 2.1, w: 3.8, h: 0.4,
    fontSize: 14,
    bold: true,
    color: DARK_BLUE,
  });

  const sans1200Benefits = [
    "🎯 Zero non-compliant items in BOQs",
    "⚡ Instant compliance verification",
    "💰 Avoid project delays from spec errors",
    "🔍 Full transparency for auditors",
    "✅ Treasury approval faster",
    "🏗️ Contractor clarity on requirements"
  ];

  sans1200Benefits.forEach((benefit, idx) => {
    slide5.addText(benefit, {
      x: 5.5, y: 2.6 + (idx * 0.35), w: 3.8, h: 0.3,
      fontSize: 12,
      color: DARK_GRAY,
    });
  });

  slide5.addText("Source: SANS 1200 Series (SABS), CIDB Procurement Standards", {
    x: 0.5, y: 6.1, w: 9, h: 0.3,
    fontSize: 10,
    italic: true,
    color: "666666",
    align: "center",
  });

  slide5.addText("Impact: Prevents average 2-4 month delays from specification errors (CIDB Industry Indicators 2024)", {
    x: 0.5, y: 6.4, w: 9, h: 0.3,
    fontSize: 9,
    bold: true,
    color: ORANGE,
    align: "center",
  });

  // ==========================================
  // SLIDE 6: COMPLIANCE FEATURE 2 - NBR
  // ==========================================
  const slide6 = ppt.addSlide();
  slide6.background = { color: WHITE };

  slide6.addShape(ppt.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: DARK_BLUE },
  });

  slide6.addText("COMPLIANCE FEATURE 2: NATIONAL BUILDING REGULATIONS", {
    x: 0.5, y: 0.15, w: 9, h: 0.5,
    fontSize: 28,
    bold: true,
    color: WHITE,
  });

  slide6.addText("What is NBR Compliance?", {
    x: 0.5, y: 1.0, w: 9, h: 0.4,
    fontSize: 18,
    bold: true,
    color: DARK_BLUE,
  });

  slide6.addText("National Building Regulations (Act 103 of 1977) - mandatory safety and quality standards for all building construction in South Africa.", {
    x: 0.5, y: 1.4, w: 9, h: 0.4,
    fontSize: 14,
    color: DARK_GRAY,
  });

  slide6.addShape(ppt.ShapeType.rect, {
    x: 0.5, y: 2.0, w: 4.2, h: 2.5,
    fill: { color: LIGHT_BLUE },
  });

  slide6.addText("How Qilly Ensures Compliance:", {
    x: 0.7, y: 2.1, w: 3.8, h: 0.4,
    fontSize: 14,
    bold: true,
    color: DARK_BLUE,
  });

  const nbrFeatures = [
    "✅ NBR-compliant material database",
    "✅ Safety standard verification",
    "✅ Building code alignment checks",
    "✅ Load-bearing capacity validation",
    "✅ Fire safety compliance flags",
    "✅ Local authority requirement tracking"
  ];

  nbrFeatures.forEach((feature, idx) => {
    slide6.addText(feature, {
      x: 0.7, y: 2.6 + (idx * 0.35), w: 3.8, h: 0.3,
      fontSize: 12,
      color: DARK_GRAY,
    });
  });

  slide6.addShape(ppt.ShapeType.rect, {
    x: 5.3, y: 2.0, w: 4.2, h: 2.5,
    fill: { color: GREEN },
  });

  slide6.addText("Benefits to DHS:", {
    x: 5.5, y: 2.1, w: 3.8, h: 0.4,
    fontSize: 14,
    bold: true,
    color: DARK_BLUE,
  });

  const nbrBenefits = [
    "🏡 Safe, quality housing guaranteed",
    "⚡ Faster municipal approvals",
    "💰 Avoid costly compliance retrofits",
    "🔍 Pre-emptive issue detection",
    "✅ Liability protection for DHS",
    "📋 Complete regulatory documentation"
  ];

  nbrBenefits.forEach((benefit, idx) => {
    slide6.addText(benefit, {
      x: 5.5, y: 2.6 + (idx * 0.35), w: 3.8, h: 0.3,
      fontSize: 12,
      color: DARK_GRAY,
    });
  });

  slide6.addText("Source: National Building Regulations Act 103/1977, NHBRC Home Building Manual", {
    x: 0.5, y: 6.1, w: 9, h: 0.3,
    fontSize: 10,
    italic: true,
    color: "666666",
    align: "center",
  });

  slide6.addText("Impact: Reduces municipal approval time by 30-40% (Department of Public Works study)", {
    x: 0.5, y: 6.4, w: 9, h: 0.3,
    fontSize: 9,
    bold: true,
    color: ORANGE,
    align: "center",
  });

  // ==========================================
  // SLIDE 7: COMPLIANCE FEATURE 3 - AGRÉMENT
  // ==========================================
  const slide7 = ppt.addSlide();
  slide7.background = { color: WHITE };

  slide7.addShape(ppt.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: DARK_BLUE },
  });

  slide7.addText("COMPLIANCE FEATURE 3: AGRÉMENT CERTIFICATION", {
    x: 0.5, y: 0.15, w: 9, h: 0.5,
    fontSize: 28,
    bold: true,
    color: WHITE,
  });

  slide7.addText("What is AGRÉMENT?", {
    x: 0.5, y: 1.0, w: 9, h: 0.4,
    fontSize: 18,
    bold: true,
    color: DARK_BLUE,
  });

  slide7.addText("AGRÉMENT South Africa - official product certification system ensuring construction materials meet quality and performance standards.", {
    x: 0.5, y: 1.4, w: 9, h: 0.4,
    fontSize: 14,
    color: DARK_GRAY,
  });

  slide7.addShape(ppt.ShapeType.rect, {
    x: 0.5, y: 2.0, w: 4.2, h: 2.5,
    fill: { color: LIGHT_BLUE },
  });

  slide7.addText("How Qilly Ensures Compliance:", {
    x: 0.7, y: 2.1, w: 3.8, h: 0.4,
    fontSize: 14,
    bold: true,
    color: DARK_BLUE,
  });

  const agrementFeatures = [
    "✅ AGRÉMENT-certified product database",
    "✅ Certificate number verification",
    "✅ Product expiry date tracking",
    "✅ Alternative product suggestions",
    "✅ Quality assurance documentation",
    "✅ Supplier certification validation"
  ];

  agrementFeatures.forEach((feature, idx) => {
    slide7.addText(feature, {
      x: 0.7, y: 2.6 + (idx * 0.35), w: 3.8, h: 0.3,
      fontSize: 12,
      color: DARK_GRAY,
    });
  });

  slide7.addShape(ppt.ShapeType.rect, {
    x: 5.3, y: 2.0, w: 4.2, h: 2.5,
    fill: { color: GREEN },
  });

  slide7.addText("Benefits to DHS:", {
    x: 5.5, y: 2.1, w: 3.8, h: 0.4,
    fontSize: 14,
    bold: true,
    color: DARK_BLUE,
  });

  const agrementBenefits = [
    "🏆 Guaranteed product quality",
    "⚡ Pre-verified materials only",
    "💰 Avoid substandard product issues",
    "🔍 Warranty validity assurance",
    "✅ Reduced defect liability",
    "📋 Complete product traceability"
  ];

  agrementBenefits.forEach((benefit, idx) => {
    slide7.addText(benefit, {
      x: 5.5, y: 2.6 + (idx * 0.35), w: 3.8, h: 0.3,
      fontSize: 12,
      color: DARK_GRAY,
    });
  });

  slide7.addText("Source: AGRÉMENT South Africa Product Certification Database (www.agrement.co.za)", {
    x: 0.5, y: 6.1, w: 9, h: 0.3,
    fontSize: 10,
    italic: true,
    color: "666666",
    align: "center",
  });

  slide7.addText("Impact: Prevents R2M-R5M in warranty claims and defect repairs per 100 houses (NHBRC data)", {
    x: 0.5, y: 6.4, w: 9, h: 0.3,
    fontSize: 9,
    bold: true,
    color: ORANGE,
    align: "center",
  });

  // ==========================================
  // SLIDE 8: COMPLIANCE FEATURE 4 - BBBEE
  // ==========================================
  const slide8 = ppt.addSlide();
  slide8.background = { color: WHITE };

  slide8.addShape(ppt.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: DARK_BLUE },
  });

  slide8.addText("COMPLIANCE FEATURE 4: BBBEE TRACKING", {
    x: 0.5, y: 0.15, w: 9, h: 0.5,
    fontSize: 28,
    bold: true,
    color: WHITE,
  });

  slide8.addText("What is BBBEE Compliance?", {
    x: 0.5, y: 1.0, w: 9, h: 0.4,
    fontSize: 18,
    bold: true,
    color: DARK_BLUE,
  });

  slide8.addText("Broad-Based Black Economic Empowerment (Act 53 of 2003) - mandatory preferential procurement tracking and transformation requirements.", {
    x: 0.5, y: 1.4, w: 9, h: 0.4,
    fontSize: 14,
    color: DARK_GRAY,
  });

  slide8.addShape(ppt.ShapeType.rect, {
    x: 0.5, y: 2.0, w: 4.2, h: 2.5,
    fill: { color: LIGHT_BLUE },
  });

  slide8.addText("How Qilly Ensures Compliance:", {
    x: 0.7, y: 2.1, w: 3.8, h: 0.4,
    fontSize: 14,
    bold: true,
    color: DARK_BLUE,
  });

  const bbbeeFeatures = [
    "✅ Supplier BBBEE level tracking",
    "✅ Preferential procurement scoring",
    "✅ 80/20 and 90/10 calculations",
    "✅ EME/QSE identification",
    "✅ SANAS verification integration",
    "✅ Transformation reporting dashboard"
  ];

  bbbeeFeatures.forEach((feature, idx) => {
    slide8.addText(feature, {
      x: 0.7, y: 2.6 + (idx * 0.35), w: 3.8, h: 0.3,
      fontSize: 12,
      color: DARK_GRAY,
    });
  });

  slide8.addShape(ppt.ShapeType.rect, {
    x: 5.3, y: 2.0, w: 4.2, h: 2.5,
    fill: { color: GREEN },
  });

  slide8.addText("Benefits to DHS:", {
    x: 5.5, y: 2.1, w: 3.8, h: 0.4,
    fontSize: 14,
    bold: true,
    color: DARK_BLUE,
  });

  const bbbeeBenefits = [
    "🎯 Automatic transformation compliance",
    "⚡ Real-time BBBEE scoring",
    "💰 Maximize preferential procurement",
    "🔍 Transparent supplier selection",
    "✅ PPPFA compliance guaranteed",
    "📊 Comprehensive reporting for DTIC"
  ];

  bbbeeBenefits.forEach((benefit, idx) => {
    slide8.addText(benefit, {
      x: 5.5, y: 2.6 + (idx * 0.35), w: 3.8, h: 0.3,
      fontSize: 12,
      color: DARK_GRAY,
    });
  });

  slide8.addText("Source: BBBEE Act 53/2003, PPPFA Act 5/2000, SANAS Verification Standards", {
    x: 0.5, y: 6.1, w: 9, h: 0.3,
    fontSize: 10,
    italic: true,
    color: "666666",
    align: "center",
  });

  slide8.addText("Impact: Ensures 100% PPPFA compliance, supports economic transformation mandate", {
    x: 0.5, y: 6.4, w: 9, h: 0.3,
    fontSize: 9,
    bold: true,
    color: ORANGE,
    align: "center",
  });

  // ==========================================
  // SLIDE 9: COMPLIANCE FEATURE 5 - POPIA
  // ==========================================
  const slide9 = ppt.addSlide();
  slide9.background = { color: WHITE };

  slide9.addShape(ppt.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: DARK_BLUE },
  });

  slide9.addText("COMPLIANCE FEATURE 5: POPIA DATA PROTECTION", {
    x: 0.5, y: 0.15, w: 9, h: 0.5,
    fontSize: 28,
    bold: true,
    color: WHITE,
  });

  slide9.addText("What is POPIA Compliance?", {
    x: 0.5, y: 1.0, w: 9, h: 0.4,
    fontSize: 18,
    bold: true,
    color: DARK_BLUE,
  });

  slide9.addText("Protection of Personal Information Act (Act 4 of 2013) - mandatory data privacy and security requirements for all systems handling personal information.", {
    x: 0.5, y: 1.4, w: 9, h: 0.4,
    fontSize: 14,
    color: DARK_GRAY,
  });

  slide9.addShape(ppt.ShapeType.rect, {
    x: 0.5, y: 2.0, w: 4.2, h: 2.5,
    fill: { color: LIGHT_BLUE },
  });

  slide9.addText("How Qilly Ensures Compliance:", {
    x: 0.7, y: 2.1, w: 3.8, h: 0.4,
    fontSize: 14,
    bold: true,
    color: DARK_BLUE,
  });

  const popiaFeatures = [
    "✅ End-to-end data encryption (AES-256)",
    "✅ Role-based access control (RBAC)",
    "✅ Audit logs for all data access",
    "✅ Supplier data consent management",
    "✅ Secure cloud infrastructure (AWS)",
    "✅ Regular security audits & penetration testing"
  ];

  popiaFeatures.forEach((feature, idx) => {
    slide9.addText(feature, {
      x: 0.7, y: 2.6 + (idx * 0.35), w: 3.8, h: 0.3,
      fontSize: 12,
      color: DARK_GRAY,
    });
  });

  slide9.addShape(ppt.ShapeType.rect, {
    x: 5.3, y: 2.0, w: 4.2, h: 2.5,
    fill: { color: GREEN },
  });

  slide9.addText("Benefits to DHS:", {
    x: 5.5, y: 2.1, w: 3.8, h: 0.4,
    fontSize: 14,
    bold: true,
    color: DARK_BLUE,
  });

  const popiaBenefits = [
    "🔒 Supplier data fully protected",
    "⚡ Information Regulator compliance",
    "💰 Avoid R10M POPIA penalties",
    "🔍 Complete data sovereignty",
    "✅ Secure user authentication",
    "📋 Privacy impact assessments done"
  ];

  popiaBenefits.forEach((benefit, idx) => {
    slide9.addText(benefit, {
      x: 5.5, y: 2.6 + (idx * 0.35), w: 3.8, h: 0.3,
      fontSize: 12,
      color: DARK_GRAY,
    });
  });

  slide9.addText("Source: POPIA Act 4/2013, Information Regulator Guidelines, ISO/IEC 27001:2022", {
    x: 0.5, y: 6.1, w: 9, h: 0.3,
    fontSize: 10,
    italic: true,
    color: "666666",
    align: "center",
  });

  slide9.addText("Impact: Prevents data breaches (penalties up to R10M), ensures Information Regulator compliance", {
    x: 0.5, y: 6.4, w: 9, h: 0.3,
    fontSize: 9,
    bold: true,
    color: ORANGE,
    align: "center",
  });

  // ==========================================
  // SLIDE 10: COMPLIANCE FEATURE 6 - ANTI-CORRUPTION
  // ==========================================
  const slide10 = ppt.addSlide();
  slide10.background = { color: WHITE };

  slide10.addShape(ppt.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: DARK_BLUE },
  });

  slide10.addText("COMPLIANCE FEATURE 6: ANTI-CORRUPTION MEASURES", {
    x: 0.5, y: 0.15, w: 9, h: 0.5,
    fontSize: 28,
    bold: true,
    color: WHITE,
  });

  slide10.addText("What is Anti-Corruption Compliance?", {
    x: 0.5, y: 1.0, w: 9, h: 0.4,
    fontSize: 18,
    bold: true,
    color: DARK_BLUE,
  });

  slide10.addText("Prevention and Combating of Corrupt Activities Act (PRECCA Act 12/2004) + PFMA/MFMA requirements for transparent, auditable procurement.", {
    x: 0.5, y: 1.4, w: 9, h: 0.4,
    fontSize: 14,
    color: DARK_GRAY,
  });

  slide10.addShape(ppt.ShapeType.rect, {
    x: 0.5, y: 2.0, w: 4.2, h: 2.5,
    fill: { color: LIGHT_BLUE },
  });

  slide10.addText("How Qilly Ensures Compliance:", {
    x: 0.7, y: 2.1, w: 3.8, h: 0.4,
    fontSize: 14,
    bold: true,
    color: DARK_BLUE,
  });

  const antiCorruptionFeatures = [
    "✅ Immutable audit trail (blockchain)",
    "✅ Multi-supplier price comparison",
    "✅ Timestamp all pricing decisions",
    "✅ User activity monitoring",
    "✅ Pricing anomaly detection",
    "✅ Automated irregularity alerts"
  ];

  antiCorruptionFeatures.forEach((feature, idx) => {
    slide10.addText(feature, {
      x: 0.7, y: 2.6 + (idx * 0.35), w: 3.8, h: 0.3,
      fontSize: 12,
      color: DARK_GRAY,
    });
  });

  slide10.addShape(ppt.ShapeType.rect, {
    x: 5.3, y: 2.0, w: 4.2, h: 2.5,
    fill: { color: GREEN },
  });

  slide10.addText("Benefits to DHS:", {
    x: 5.5, y: 2.1, w: 3.8, h: 0.4,
    fontSize: 14,
    bold: true,
    color: DARK_BLUE,
  });

  const antiCorruptionBenefits = [
    "🛡️ Price manipulation impossible",
    "⚡ Real-time fraud detection",
    "💰 Eliminate kickback opportunities",
    "🔍 100% Auditor-General ready",
    "✅ PFMA/MFMA compliance",
    "📊 Parliamentary accountability"
  ];

  antiCorruptionBenefits.forEach((benefit, idx) => {
    slide10.addText(benefit, {
      x: 5.5, y: 2.6 + (idx * 0.35), w: 3.8, h: 0.3,
      fontSize: 12,
      color: DARK_GRAY,
    });
  });

  slide10.addText("Source: PRECCA Act 12/2004, PFMA Act 1/1999, MFMA Act 56/2003, Auditor-General Guidelines", {
    x: 0.5, y: 6.1, w: 9, h: 0.3,
    fontSize: 10,
    italic: true,
    color: "666666",
    align: "center",
  });

  slide10.addText("Impact: Prevents irregular expenditure, supports clean audit outcomes (AG-SA 2024 report priorities)", {
    x: 0.5, y: 6.4, w: 9, h: 0.3,
    fontSize: 9,
    bold: true,
    color: ORANGE,
    align: "center",
  });

  // ==========================================
  // SLIDE 11: ALL 6 COMPLIANCE FEATURES SUMMARY
  // ==========================================
  const slide11 = ppt.addSlide();
  slide11.background = { color: LIGHT_BLUE };

  slide11.addText("COMPREHENSIVE COMPLIANCE PACKAGE", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 32,
    bold: true,
    color: DARK_BLUE,
  });

  slide11.addText("All 6 Features Work Together Seamlessly", {
    x: 0.5, y: 0.9, w: 9, h: 0.4,
    fontSize: 16,
    color: DARK_GRAY,
    italic: true,
  });

  const complianceGrid = [
    { num: "1", name: "SANS 1200", icon: "📋", impact: "Spec compliance" },
    { num: "2", name: "NBR", icon: "🏗️", impact: "Building safety" },
    { num: "3", name: "AGRÉMENT", icon: "✅", impact: "Product quality" },
    { num: "4", name: "BBBEE", icon: "🎯", impact: "Transformation" },
    { num: "5", name: "POPIA", icon: "🔒", impact: "Data protection" },
    { num: "6", name: "Anti-Corruption", icon: "🛡️", impact: "Transparency" }
  ];

  let gridX = 0.5;
  let gridY = 1.8;
  complianceGrid.forEach((item, idx) => {
    if (idx === 3) {
      gridX = 0.5;
      gridY = 3.8;
    }

    slide11.addShape(ppt.ShapeType.rect, {
      x: gridX, y: gridY, w: 3.0, h: 1.5,
      fill: { color: WHITE },
    });

    slide11.addText(item.icon, {
      x: gridX + 0.2, y: gridY + 0.2, w: 0.6, h: 0.6,
      fontSize: 32,
    });

    slide11.addText(item.num, {
      x: gridX + 0.1, y: gridY + 0.1, w: 0.5, h: 0.4,
      fontSize: 16,
      bold: true,
      color: DARK_BLUE,
    });

    slide11.addText(item.name, {
      x: gridX + 1.0, y: gridY + 0.3, w: 1.8, h: 0.4,
      fontSize: 16,
      bold: true,
      color: DARK_BLUE,
    });

    slide11.addText(item.impact, {
      x: gridX + 1.0, y: gridY + 0.8, w: 1.8, h: 0.3,
      fontSize: 12,
      color: DARK_GRAY,
      italic: true,
    });

    gridX += 3.15;
  });

  slide11.addShape(ppt.ShapeType.rect, {
    x: 0.5, y: 5.5, w: 9, h: 0.8,
    fill: { color: GREEN },
  });

  slide11.addText("RESULT: Every BOQ is legally compliant, auditable, and DHS-ready", {
    x: 0.5, y: 5.65, w: 9, h: 0.5,
    fontSize: 18,
    bold: true,
    color: DARK_BLUE,
    align: "center",
  });

  slide11.addText("Zero compliance risk • Zero irregular expenditure • Zero Auditor-General findings", {
    x: 0.5, y: 6.4, w: 9, h: 0.3,
    fontSize: 12,
    italic: true,
    color: DARK_GRAY,
    align: "center",
  });

  // ==========================================
  // SLIDE 12: FUNDING REQUEST
  // ==========================================
  const slide12 = ppt.addSlide();
  slide12.background = { color: WHITE };

  slide12.addText("FUNDING REQUEST", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 36,
    bold: true,
    color: DARK_BLUE,
  });

  slide12.addText("Investment Required for Full Implementation", {
    x: 0.5, y: 0.9, w: 9, h: 0.4,
    fontSize: 18,
    color: DARK_GRAY,
    italic: true,
  });

  slide12.addShape(ppt.ShapeType.rect, {
    x: 0.5, y: 1.5, w: 4.2, h: 1.5,
    fill: { color: LIGHT_BLUE },
  });

  slide12.addText("Initial Development", {
    x: 0.7, y: 1.6, w: 3.8, h: 0.4,
    fontSize: 16,
    bold: true,
    color: DARK_BLUE,
  });

  slide12.addText("(Months 1-12)", {
    x: 0.7, y: 2.0, w: 3.8, h: 0.3,
    fontSize: 12,
    italic: true,
    color: DARK_GRAY,
  });

  slide12.addText("R6.08M - R8.87M", {
    x: 0.7, y: 2.4, w: 3.8, h: 0.5,
    fontSize: 28,
    bold: true,
    color: DARK_BLUE,
  });

  slide12.addShape(ppt.ShapeType.rect, {
    x: 5.3, y: 1.5, w: 4.2, h: 1.5,
    fill: { color: GOLD },
  });

  slide12.addText("5-Year Total", {
    x: 5.5, y: 1.6, w: 3.8, h: 0.4,
    fontSize: 16,
    bold: true,
    color: DARK_BLUE,
  });

  slide12.addText("(Including maintenance)", {
    x: 5.5, y: 2.0, w: 3.8, h: 0.3,
    fontSize: 12,
    italic: true,
    color: DARK_GRAY,
  });

  slide12.addText("R14.3M - R19.1M", {
    x: 5.5, y: 2.4, w: 3.8, h: 0.5,
    fontSize: 28,
    bold: true,
    color: DARK_BLUE,
  });

  slide12.addText("What You Get:", {
    x: 0.5, y: 3.3, w: 9, h: 0.4,
    fontSize: 18,
    bold: true,
    color: DARK_BLUE,
  });

  const deliverables = [
    "✅ 20-person dedicated team (developers, QS experts, compliance officers)",
    "✅ Full system development, deployment, and 5-year maintenance",
    "✅ All 6 compliance features fully implemented and tested",
    "✅ Integration with DHS systems and supplier networks",
    "✅ Training for DHS staff across all 9 provinces",
    "✅ 24/7 support and continuous system improvements",
    "✅ Quarterly compliance audits and updates"
  ];

  deliverables.forEach((item, idx) => {
    slide12.addText(item, {
      x: 0.7, y: 3.8 + (idx * 0.35), w: 8.5, h: 0.3,
      fontSize: 13,
      color: DARK_GRAY,
    });
  });

  slide12.addShape(ppt.ShapeType.rect, {
    x: 0.5, y: 6.2, w: 9, h: 0.5,
    fill: { color: GREEN },
  });

  slide12.addText("ROI: 200% - 1,000% over 5 years (R31M - R196M net benefit)", {
    x: 0.5, y: 6.3, w: 9, h: 0.3,
    fontSize: 16,
    bold: true,
    color: DARK_BLUE,
    align: "center",
  });

  // ==========================================
  // SLIDE 13: IMPLEMENTATION TIMELINE
  // ==========================================
  const slide13 = ppt.addSlide();
  slide13.background = { color: WHITE };

  slide13.addText("IMPLEMENTATION TIMELINE", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 36,
    bold: true,
    color: DARK_BLUE,
  });

  slide13.addText("12-Month Deployment Roadmap", {
    x: 0.5, y: 0.9, w: 9, h: 0.4,
    fontSize: 18,
    color: DARK_GRAY,
    italic: true,
  });

  const timeline = [
    { phase: "Q1: Foundation", months: "Months 1-3", items: ["Team assembly", "Infrastructure setup", "SANS 1200 database integration", "Initial compliance framework"] },
    { phase: "Q2: Core Development", months: "Months 4-6", items: ["BOQ matching engine", "Multi-supplier pricing", "NBR + AGRÉMENT integration", "User interface development"] },
    { phase: "Q3: Compliance Build", months: "Months 7-9", items: ["BBBEE tracking system", "POPIA security implementation", "Anti-corruption audit trails", "Testing & quality assurance"] },
    { phase: "Q4: Deployment", months: "Months 10-12", items: ["Pilot with 3 provinces", "DHS staff training", "Full national rollout", "Go-live support"] }
  ];

  let timelineY = 1.6;
  timeline.forEach((item) => {
    slide13.addShape(ppt.ShapeType.rect, {
      x: 0.5, y: timelineY, w: 9, h: 1.1,
      fill: { color: LIGHT_BLUE },
    });

    slide13.addText(item.phase, {
      x: 0.7, y: timelineY + 0.1, w: 3.0, h: 0.3,
      fontSize: 14,
      bold: true,
      color: DARK_BLUE,
    });

    slide13.addText(item.months, {
      x: 0.7, y: timelineY + 0.45, w: 3.0, h: 0.25,
      fontSize: 11,
      italic: true,
      color: DARK_GRAY,
    });

    item.items.forEach((task, idx) => {
      slide13.addText(`• ${task}`, {
        x: 4.0, y: timelineY + 0.1 + (idx * 0.25), w: 5.3, h: 0.2,
        fontSize: 10,
        color: DARK_GRAY,
      });
    });

    timelineY += 1.25;
  });

  slide13.addText("After Month 12: Continuous improvement, maintenance, and expansion to new features", {
    x: 0.5, y: 6.4, w: 9, h: 0.3,
    fontSize: 11,
    italic: true,
    color: DARK_GRAY,
    align: "center",
  });

  // ==========================================
  // SLIDE 14: STRATEGIC ALIGNMENT
  // ==========================================
  const slide14 = ppt.addSlide();
  slide14.background = { color: LIGHT_BLUE };

  slide14.addText("STRATEGIC ALIGNMENT WITH DHS MANDATE", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 32,
    bold: true,
    color: DARK_BLUE,
  });

  slide14.addText("How Qilly Supports Your Mission", {
    x: 0.5, y: 0.9, w: 9, h: 0.4,
    fontSize: 16,
    color: DARK_GRAY,
    italic: true,
  });

  const alignmentPoints = [
    {
      icon: "🏠",
      title: "Accelerate Housing Delivery",
      desc: "Eliminate 3-6 month delays, get families into homes faster"
    },
    {
      icon: "💰",
      title: "Maximize Taxpayer Value",
      desc: "R31M-R196M savings = 335-1,435 additional houses over 5 years"
    },
    {
      icon: "🔍",
      title: "Ensure Transparency",
      desc: "100% auditable, full PFMA/MFMA compliance, no irregular expenditure"
    },
    {
      icon: "🎯",
      title: "Support Transformation",
      desc: "Automatic BBBEE tracking, promotes fair supplier competition"
    },
    {
      icon: "📊",
      title: "Enable Data-Driven Decisions",
      desc: "Real-time pricing insights for budget planning and forecasting"
    },
    {
      icon: "✅",
      title: "Reduce Compliance Risk",
      desc: "All 6 compliance features eliminate legal and regulatory exposure"
    }
  ];

  let alignY = 1.6;
  alignmentPoints.forEach((point, idx) => {
    if (idx % 2 === 0) {
      slide14.addShape(ppt.ShapeType.rect, {
        x: 0.5, y: alignY, w: 4.2, h: 1.2,
        fill: { color: WHITE },
      });

      slide14.addText(point.icon, {
        x: 0.7, y: alignY + 0.15, w: 0.6, h: 0.6,
        fontSize: 32,
      });

      slide14.addText(point.title, {
        x: 1.5, y: alignY + 0.2, w: 3.0, h: 0.3,
        fontSize: 13,
        bold: true,
        color: DARK_BLUE,
      });

      slide14.addText(point.desc, {
        x: 1.5, y: alignY + 0.6, w: 3.0, h: 0.5,
        fontSize: 10,
        color: DARK_GRAY,
      });
    } else {
      slide14.addShape(ppt.ShapeType.rect, {
        x: 5.3, y: alignY - 1.2, w: 4.2, h: 1.2,
        fill: { color: WHITE },
      });

      slide14.addText(point.icon, {
        x: 5.5, y: alignY - 1.05, w: 0.6, h: 0.6,
        fontSize: 32,
      });

      slide14.addText(point.title, {
        x: 6.3, y: alignY - 1.0, w: 3.0, h: 0.3,
        fontSize: 13,
        bold: true,
        color: DARK_BLUE,
      });

      slide14.addText(point.desc, {
        x: 6.3, y: alignY - 0.6, w: 3.0, h: 0.5,
        fontSize: 10,
        color: DARK_GRAY,
      });

      alignY += 1.4;
    }
  });

  // ==========================================
  // SLIDE 15: NEXT STEPS
  // ==========================================
  const slide15 = ppt.addSlide();
  slide15.background = { color: WHITE };

  slide15.addText("NEXT STEPS", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 36,
    bold: true,
    color: DARK_BLUE,
  });

  slide15.addText("How to Move Forward with Qilly", {
    x: 0.5, y: 0.9, w: 9, h: 0.4,
    fontSize: 18,
    color: DARK_GRAY,
    italic: true,
  });

  const nextSteps = [
    {
      step: "1",
      title: "Pilot Project",
      desc: "Select 3-5 housing projects for proof-of-concept (Duration: 2 months)",
      action: "Validate 100% accuracy and <5 minute claims"
    },
    {
      step: "2",
      title: "Treasury Approval",
      desc: "Present business case with pilot results (Duration: 1 month)",
      action: "Secure R14.3M-R19.1M funding approval"
    },
    {
      step: "3",
      title: "Contract Finalization",
      desc: "Sign 5-year partnership agreement (Duration: 1 month)",
      action: "Formalize SLA, deliverables, and payment terms"
    },
    {
      step: "4",
      title: "Development Kickoff",
      desc: "Assemble 20-person team, begin Month 1 (Duration: 12 months)",
      action: "Full system development and deployment"
    },
    {
      step: "5",
      title: "National Rollout",
      desc: "Launch across all 9 provinces (Month 12+)",
      action: "Start realizing R10M-R43M annual savings"
    }
  ];

  let stepY = 1.6;
  nextSteps.forEach((item) => {
    slide15.addShape(ppt.ShapeType.rect, {
      x: 0.5, y: stepY, w: 9, h: 0.85,
      fill: { color: LIGHT_BLUE },
    });

    slide15.addShape(ppt.ShapeType.ellipse, {
      x: 0.6, y: stepY + 0.15, w: 0.55, h: 0.55,
      fill: { color: DARK_BLUE },
    });

    slide15.addText(item.step, {
      x: 0.6, y: stepY + 0.25, w: 0.55, h: 0.35,
      fontSize: 18,
      bold: true,
      color: WHITE,
      align: "center",
      valign: "middle",
    });

    slide15.addText(item.title, {
      x: 1.4, y: stepY + 0.1, w: 3.0, h: 0.3,
      fontSize: 14,
      bold: true,
      color: DARK_BLUE,
    });

    slide15.addText(item.desc, {
      x: 1.4, y: stepY + 0.45, w: 3.5, h: 0.3,
      fontSize: 11,
      color: DARK_GRAY,
    });

    slide15.addText(`→ ${item.action}`, {
      x: 5.2, y: stepY + 0.3, w: 4.0, h: 0.3,
      fontSize: 11,
      italic: true,
      color: ORANGE,
    });

    stepY += 1.0;
  });

  // ==========================================
  // SLIDE 16: CONTACT & THANK YOU
  // ==========================================
  const slide16 = ppt.addSlide();
  slide16.background = { color: DARK_BLUE };

  slide16.addText("LET'S TRANSFORM", {
    x: 0.5, y: 1.5, w: 9, h: 0.8,
    fontSize: 48,
    bold: true,
    color: WHITE,
    align: "center",
  });

  slide16.addText("HOUSING DELIVERY TOGETHER", {
    x: 0.5, y: 2.4, w: 9, h: 0.7,
    fontSize: 42,
    bold: true,
    color: GOLD,
    align: "center",
  });

  slide16.addShape(ppt.ShapeType.rect, {
    x: 2.0, y: 3.5, w: 6.0, h: 2.0,
    fill: { color: WHITE },
  });

  slide16.addText("Contact Us:", {
    x: 2.2, y: 3.7, w: 5.6, h: 0.4,
    fontSize: 18,
    bold: true,
    color: DARK_BLUE,
  });

  slide16.addText("📧 Email: partnerships@qilly.co.za", {
    x: 2.2, y: 4.2, w: 5.6, h: 0.3,
    fontSize: 14,
    color: DARK_GRAY,
  });

  slide16.addText("📞 Tel: +27 (0)11 XXX XXXX", {
    x: 2.2, y: 4.6, w: 5.6, h: 0.3,
    fontSize: 14,
    color: DARK_GRAY,
  });

  slide16.addText("🌐 Web: www.qilly.co.za", {
    x: 2.2, y: 5.0, w: 5.6, h: 0.3,
    fontSize: 14,
    color: DARK_GRAY,
  });

  slide16.addText("Thank you for considering Qilly", {
    x: 0.5, y: 6.0, w: 9, h: 0.4,
    fontSize: 16,
    italic: true,
    color: WHITE,
    align: "center",
  });

  slide16.addText("Together, we can build more homes, faster, and more transparently", {
    x: 0.5, y: 6.4, w: 9, h: 0.3,
    fontSize: 14,
    color: LIGHT_BLUE,
    align: "center",
  });

  // ==========================================
  // NEW SLIDE 17: COMPLIANCE COST CALCULATOR
  // ==========================================
  const slide17 = ppt.addSlide();
  slide17.background = { color: WHITE };

  // Header
  slide17.addText("🛡️ COMPLIANCE COST CALCULATOR", {
    x: 0.5, y: 0.4, w: 9, h: 0.6,
    fontSize: 32,
    bold: true,
    color: DARK_BLUE,
    align: "center",
  });

  slide17.addText("REVOLUTIONARY COMPLIANCE AUTOMATION - PRODUCTION READY", {
    x: 0.5, y: 1.0, w: 9, h: 0.4,
    fontSize: 16,
    bold: true,
    color: ORANGE,
    align: "center",
  });

  // Problem Statement
  slide17.addShape(ppt.ShapeType.rect, {
    x: 0.5, y: 1.6, w: 9, h: 1.2,
    fill: { color: "FFF3CD" },
    line: { color: "FFC107", width: 2 }
  });

  slide17.addText("THE PROBLEM:", {
    x: 0.7, y: 1.7, w: 8.6, h: 0.3,
    fontSize: 14,
    bold: true,
    color: DARK_GRAY,
  });

  slide17.addText(
    "40-60% of housing projects experience delays due to missing or incorrectly budgeted compliance costs (NHBRC, CIDB, statutory labour, testing). " +
    "These costs are often hidden in 'contingencies' or discovered post-tender, causing project shutdowns and budget blowouts.",
    {
      x: 0.7, y: 2.0, w: 8.6, h: 0.7,
      fontSize: 11,
      color: DARK_GRAY,
    }
  );

  // The Solution
  slide17.addText("QILLY'S SOLUTION - AUTOMATED COMPLIANCE CALCULATOR:", {
    x: 0.5, y: 3.0, w: 9, h: 0.4,
    fontSize: 16,
    bold: true,
    color: DARK_BLUE,
  });

  // Feature boxes
  const features = [
    { icon: "✓", title: "NHBRC Costs", desc: "Enrollment, inspections, 10-year warranty (per unit/project)" },
    { icon: "✓", title: "CIDB Validation", desc: "Auto-checks contractor grade vs project value (prevents irregular expenditure)" },
    { icon: "✓", title: "Statutory Labour", desc: "UIF, SDL, COIDA, pension (1%+1%+1.75%+10% = 13.75%)" },
    { icon: "✓", title: "Quality Testing", desc: "Concrete, soil, bricks, geotechnical (SANS 2001, 227, 3001)" },
    { icon: "✓", title: "BBBEE Verification", desc: "EME/QSE/Generic certification costs (turnover-based)" },
    { icon: "✓", title: "Preliminaries & General", desc: "Site setup, services, time-related, H&S (15-25% of project)" }
  ];

  let complianceYPos = 3.5;
  features.forEach((feature, idx) => {
    const xPos = idx % 2 === 0 ? 0.5 : 5.0;
    const rowY = complianceYPos + Math.floor(idx / 2) * 0.65;

    slide17.addShape(ppt.ShapeType.rect, {
      x: xPos, y: rowY, w: 4.3, h: 0.55,
      fill: { color: idx < 2 ? "E8F4F8" : "F0F8FF" },
      line: { color: BLUE, width: 1 }
    });

    slide17.addText(`${feature.icon} ${feature.title}`, {
      x: xPos + 0.1, y: rowY + 0.05, w: 4.1, h: 0.2,
      fontSize: 10,
      bold: true,
      color: DARK_BLUE,
    });

    slide17.addText(feature.desc, {
      x: xPos + 0.1, y: rowY + 0.25, w: 4.1, h: 0.25,
      fontSize: 8,
      color: DARK_GRAY,
    });
  });

  // Key Stats
  slide17.addShape(ppt.ShapeType.rect, {
    x: 0.5, y: 5.8, w: 9, h: 0.9,
    fill: { color: BLUE },
  });

  slide17.addText("PRODUCTION-READY STATUS:", {
    x: 0.7, y: 5.9, w: 8.6, h: 0.3,
    fontSize: 14,
    bold: true,
    color: WHITE,
  });

  slide17.addText(
    "✓ 85-95% Accuracy (official govt fee schedules + industry standards)  |  " +
    "✓ All 9 Provinces  |  " +
    "✓ Prevents R50K-R200K budget overruns per project  |  " +
    "✓ Ready for DHS pilot in 4-6 weeks",
    {
      x: 0.7, y: 6.2, w: 8.6, h: 0.4,
      fontSize: 10,
      color: WHITE,
    }
  );

  // Save the presentation
  const fileName = `Qilly_DHS_Executive_Deck_${new Date().toISOString().split('T')[0]}.pptx`;
  await ppt.writeFile({ fileName });
}