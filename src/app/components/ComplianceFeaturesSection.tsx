import { Paragraph, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from "docx";

export function createComplianceFeaturesSection() {
  return [
    new Paragraph({
      text: "DHS-SPECIFIC CONSTRUCTION COMPLIANCE FEATURES",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
      shading: { fill: "FF6B35", color: "FFFFFF" },
    }),

    new Paragraph({
      text: "Technical Feasibility Analysis: All 6 Compliance Features are Implementable",
      spacing: { after: 300 },
      bold: true,
    }),

    new Paragraph({
      text: "Qilly can be enhanced with comprehensive construction compliance features specifically designed for the Department of Human Settlements. These features integrate seamlessly into the existing BOQ pricing workflow and provide automated verification, tracking, and reporting capabilities.",
      spacing: { after: 400 },
    }),

    // Feature Overview Table
    new Paragraph({
      text: "Compliance Features Overview",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Compliance Feature", bold: true })],
              shading: { fill: "FF6B35", color: "FFFFFF" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Feasibility", bold: true })],
              shading: { fill: "FF6B35", color: "FFFFFF" },
              width: { size: 12, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Implementation Stage", bold: true })],
              shading: { fill: "FF6B35", color: "FFFFFF" },
              width: { size: 20, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Key Benefit", bold: true })],
              shading: { fill: "FF6B35", color: "FFFFFF" },
              width: { size: 28, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Dev Time", bold: true })],
              shading: { fill: "FF6B35", color: "FFFFFF" },
              width: { size: 15, type: WidthType.PERCENTAGE }
            }),
          ],
        }),
        // SANS 1200
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "SANS 1200 Automated Compliance Verification", bold: true })] 
            }),
            new TableCell({ 
              children: [new Paragraph("✅ HIGH")],
              shading: { fill: "D4EDDA" }
            }),
            new TableCell({ 
              children: [new Paragraph("BOQ Generation")] 
            }),
            new TableCell({ 
              children: [new Paragraph("Validates BOQ items against standardized item codes, ensuring procurement consistency")] 
            }),
            new TableCell({ 
              children: [new Paragraph("6-8 weeks")] 
            }),
          ],
        }),
        // NBR
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "National Building Regulations (NBR) Alignment", bold: true })] 
            }),
            new TableCell({ 
              children: [new Paragraph("✅ MEDIUM")],
              shading: { fill: "FFF3CD" }
            }),
            new TableCell({ 
              children: [new Paragraph("BOQ Generation + Supplier Database")] 
            }),
            new TableCell({ 
              children: [new Paragraph("Cross-references materials against NBR technical requirements (structural, fire, thermal)")] 
            }),
            new TableCell({ 
              children: [new Paragraph("10-12 weeks")] 
            }),
          ],
        }),
        // AGRÉMENT
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "AGRÉMENT South Africa Certification Checks", bold: true })] 
            }),
            new TableCell({ 
              children: [new Paragraph("✅ HIGH")],
              shading: { fill: "D4EDDA" }
            }),
            new TableCell({ 
              children: [new Paragraph("Supplier Sign-up + BOQ Pricing")] 
            }),
            new TableCell({ 
              children: [new Paragraph("Verifies supplier products have valid AGRÉMENT certificates, monitors expiry dates")] 
            }),
            new TableCell({ 
              children: [new Paragraph("4-10 weeks")] 
            }),
          ],
        }),
        // POPIA
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "POPIA Compliance (Government Data Security)", bold: true })] 
            }),
            new TableCell({ 
              children: [new Paragraph("✅ CRITICAL")],
              shading: { fill: "D4EDDA" }
            }),
            new TableCell({ 
              children: [new Paragraph("System-Wide Architecture")] 
            }),
            new TableCell({ 
              children: [new Paragraph("Encryption, consent management, audit trails, data subject rights, secure data disposal")] 
            }),
            new TableCell({ 
              children: [new Paragraph("8-12 weeks")] 
            }),
          ],
        }),
        // BBBEE
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "BBBEE Preferential Procurement Tracking", bold: true })] 
            }),
            new TableCell({ 
              children: [new Paragraph("✅ HIGH")],
              shading: { fill: "D4EDDA" }
            }),
            new TableCell({ 
              children: [new Paragraph("Supplier Sign-up + BOQ Reporting")] 
            }),
            new TableCell({ 
              children: [new Paragraph("Tracks supplier BEE levels, calculates recognition percentages, generates compliance reports")] 
            }),
            new TableCell({ 
              children: [new Paragraph("6-8 weeks")] 
            }),
          ],
        }),
        // PFMA/MFMA
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "PFMA/MFMA Compliance & Audit Trails", bold: true })] 
            }),
            new TableCell({ 
              children: [new Paragraph("✅ CRITICAL")],
              shading: { fill: "D4EDDA" }
            }),
            new TableCell({ 
              children: [new Paragraph("System-Wide + Reporting")] 
            }),
            new TableCell({ 
              children: [new Paragraph("Comprehensive audit logs, approval workflows, budget tracking, fraud prevention")] 
            }),
            new TableCell({ 
              children: [new Paragraph("10-14 weeks")] 
            }),
          ],
        }),
      ],
    }),

    // Implementation Roadmap
    new Paragraph({
      text: "Recommended Implementation Roadmap",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Phase", bold: true })],
              shading: { fill: "4A90E2", color: "FFFFFF" },
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Timeline", bold: true })],
              shading: { fill: "4A90E2", color: "FFFFFF" },
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Features", bold: true })],
              shading: { fill: "4A90E2", color: "FFFFFF" },
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Investment", bold: true })],
              shading: { fill: "4A90E2", color: "FFFFFF" },
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Status", bold: true })],
              shading: { fill: "4A90E2", color: "FFFFFF" },
            }),
          ],
        }),
        // Phase 1
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Phase 1: Foundation", bold: true })] 
            }),
            new TableCell({ 
              children: [new Paragraph("Year 1 (Weeks 1-8)")] 
            }),
            new TableCell({ 
              children: [new Paragraph("• POPIA Compliance\n• PFMA/MFMA Audit Trails")] 
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R0 (Already Included)", bold: true })],
              shading: { fill: "D4EDDA" }
            }),
            new TableCell({ 
              children: [new Paragraph("✅ Funded")],
              shading: { fill: "D4EDDA" }
            }),
          ],
        }),
        // Phase 2
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Phase 2: Supplier Integration", bold: true })] 
            }),
            new TableCell({ 
              children: [new Paragraph("Year 1 (Weeks 9-16)")] 
            }),
            new TableCell({ 
              children: [new Paragraph("• BBBEE Tracking\n• AGRÉMENT Certification")] 
            }),
            new TableCell({ 
              children: [new Paragraph("R500k - R714k")] 
            }),
            new TableCell({ 
              children: [new Paragraph("⚡ Optional Year 1")],
              shading: { fill: "FFF3CD" }
            }),
          ],
        }),
        // Phase 3
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Phase 3: BOQ Compliance", bold: true })] 
            }),
            new TableCell({ 
              children: [new Paragraph("Year 2 (Weeks 17-28)")] 
            }),
            new TableCell({ 
              children: [new Paragraph("• SANS 1200 Verification\n• NBR Alignment")] 
            }),
            new TableCell({ 
              children: [new Paragraph("R638k - R916k")] 
            }),
            new TableCell({ 
              children: [new Paragraph("📅 Year 2 Enhancement")],
              shading: { fill: "E0E7FF" }
            }),
          ],
        }),
        // Total
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "TOTAL COMPLIANCE INVESTMENT", bold: true })],
              shading: { fill: "FF6B35", color: "FFFFFF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "3 Years", bold: true })],
              shading: { fill: "FF6B35", color: "FFFFFF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "All 6 Features", bold: true })],
              shading: { fill: "FF6B35", color: "FFFFFF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R1.14M - R1.63M", bold: true })],
              shading: { fill: "FF6B35", color: "FFFFFF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Phased Approach", bold: true })],
              shading: { fill: "FF6B35", color: "FFFFFF" }
            }),
          ],
        }),
      ],
    }),

    // Value Proposition
    new Paragraph({
      text: "Strategic Value for DHS",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),

    new Paragraph({
      text: "1. First-of-Its-Kind in South Africa",
      bold: true,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "No other BOQ pricing system in South Africa offers integrated compliance verification across SANS 1200, NBR, AGRÉMENT, BBBEE, and PFMA/MFMA. DHS would become the national leader in compliant construction procurement.",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "2. Massive Time Savings: 99.6% Faster Compliance Checking",
      bold: true,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "Current manual compliance checking requires 2-5 days per BOQ. Qilly's automated compliance verification completes in 5 minutes - representing a 99.6% productivity gain for DHS procurement teams.",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "3. Risk Mitigation & Audit Protection",
      bold: true,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "Automated compliance verification prevents non-compliant procurements that could be challenged legally or flagged in Auditor-General reports. Full audit trails protect DHS officials from accusations of irregular expenditure or non-compliance.",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "4. Transparency & Anti-Corruption Measures",
      bold: true,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "Comprehensive PFMA/MFMA audit trails, conflict of interest detection, and approval workflows create transparency in procurement decisions. BBBEE tracking ensures preferential procurement goals are met without manual oversight.",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "5. Budget Optimization & Financial Control",
      bold: true,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "Real-time budget variance reports flag cost overruns before contracts are awarded. BEE-weighted pricing allows DHS to balance lowest cost with transformation objectives, optimizing both financial and socio-economic outcomes.",
      spacing: { after: 400 },
    }),

    // Detailed Feature Descriptions
    new Paragraph({
      text: "Detailed Feature Descriptions",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),

    // SANS 1200
    new Paragraph({
      text: "Feature 1: SANS 1200 Automated Compliance Verification",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 150 },
      shading: { fill: "F0F0F0" },
    }),
    
    new Paragraph({
      text: "Implementation Stage: BOQ Generation (Line Item Validation)",
      bold: true,
      spacing: { after: 100 },
    }),
    
    new Paragraph({
      text: "How It Works:",
      bold: true,
      spacing: { before: 100, after: 50 },
    }),
    new Paragraph({
      text: "• During BOQ upload, each line item is parsed and matched against the SANS 1200 standardized item codes database (~15,000 items)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• System validates measurement units (m³, m², kg, etc.) against SANS standards for each item type",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Non-compliant item descriptions are flagged with suggested corrections using SANS 1200 nomenclature",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Generates compliance percentage report (e.g., '94% SANS 1200 compliant') with detailed recommendations",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "DHS Benefit:",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "Ensures all BOQs use standardized terminology, making procurement consistent across all 9 provinces. Prevents disputes with contractors over ambiguous item descriptions. Streamlines cost comparisons between projects.",
      spacing: { after: 300 },
    }),

    // NBR
    new Paragraph({
      text: "Feature 2: National Building Regulations (NBR) Alignment",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 150 },
      shading: { fill: "F0F0F0" },
    }),
    
    new Paragraph({
      text: "Implementation Stage: BOQ Generation + Supplier Material Database",
      bold: true,
      spacing: { after: 100 },
    }),
    
    new Paragraph({
      text: "How It Works:",
      bold: true,
      spacing: { before: 100, after: 50 },
    }),
    new Paragraph({
      text: "• Cross-references material specifications against NBR technical requirements (Parts A-W covering structural, fire safety, plumbing, energy efficiency, etc.)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Example: Verifies concrete strength (25 MPa) meets NBR Part H (Foundations) requirements for housing projects",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Flags materials that don't meet minimum NBR standards with alternative supplier suggestions",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Generates NBR compliance summary report showing which regulations are satisfied",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "DHS Benefit:",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "Prevents procurement of non-compliant materials that would fail building inspections. Reduces project delays from having to replace non-conforming materials. Protects DHS from liability if housing projects have structural or safety defects.",
      spacing: { after: 300 },
    }),

    // AGRÉMENT
    new Paragraph({
      text: "Feature 3: AGRÉMENT South Africa Certification Checks",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 150 },
      shading: { fill: "F0F0F0" },
    }),
    
    new Paragraph({
      text: "Implementation Stage: Supplier Sign-up + BOQ Pricing (Certificate Validation)",
      bold: true,
      spacing: { after: 100 },
    }),
    
    new Paragraph({
      text: "How It Works:",
      bold: true,
      spacing: { before: 100, after: 50 },
    }),
    new Paragraph({
      text: "• Suppliers upload AGRÉMENT certificates during onboarding for any innovative/non-standard products",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• System validates certificate numbers, expiry dates, and product scope against AGRÉMENT database",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• During BOQ pricing, AGRÉMENT-certified products are highlighted, giving DHS confidence in quality",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Automated alerts 90 days before certificate expiry, notifying both supplier and DHS users",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "DHS Benefit:",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "Ensures innovative building products (e.g., prefabricated panels, new roofing systems) have been independently certified for South African conditions. Reduces risk of product failures in DHS housing projects. Simplifies approval processes when using non-traditional construction methods.",
      spacing: { after: 300 },
    }),

    // POPIA
    new Paragraph({
      text: "Feature 4: POPIA Compliance (Government Data Security)",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 150 },
      shading: { fill: "F0F0F0" },
    }),
    
    new Paragraph({
      text: "Implementation Stage: System-Wide Architecture (Foundation)",
      bold: true,
      spacing: { after: 100 },
    }),
    
    new Paragraph({
      text: "How It Works:",
      bold: true,
      spacing: { before: 100, after: 50 },
    }),
    new Paragraph({
      text: "• Data encryption at rest (AES-256) and in transit (TLS 1.3) protects all DHS project information",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Role-based access control (RBAC) ensures only authorized DHS personnel can access sensitive procurement data",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Multi-factor authentication (MFA) for all DHS users prevents unauthorized access",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Data subject rights implemented: users can request data export, deletion, or access to all stored information",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Comprehensive audit logs track all data access, modifications, and deletions (retained 5 years per POPIA)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Automated data retention policies ensure data is deleted after required retention periods",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "DHS Benefit:",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "Full compliance with Protection of Personal Information Act (2013) requirements for government data handling. Protects DHS from penalties (up to R10M) for data breaches or non-compliance. Gives DHS officials confidence that contractor and supplier information is handled legally and ethically.",
      spacing: { after: 300 },
    }),

    // BBBEE
    new Paragraph({
      text: "Feature 5: BBBEE Preferential Procurement Tracking",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 150 },
      shading: { fill: "F0F0F0" },
    }),
    
    new Paragraph({
      text: "Implementation Stage: Supplier Sign-up + BOQ Pricing + Compliance Reporting",
      bold: true,
      spacing: { after: 100 },
    }),
    
    new Paragraph({
      text: "How It Works:",
      bold: true,
      spacing: { before: 100, after: 50 },
    }),
    new Paragraph({
      text: "• Suppliers upload BEE verification certificates during onboarding, capturing BEE Level (1-8) and recognition percentage (135% to 10%)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• During BOQ pricing, system calculates both 'Total Cost' and 'BEE-Weighted Cost' for each supplier option",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Example: R100,000 from Level 1 supplier = R135,000 BEE recognition; R100,000 from Level 8 supplier = R10,000 BEE recognition",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Generates BEE procurement scorecard showing total BEE spend percentage and supplier breakdown by BEE level",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Allows DHS to optimize for BEE compliance vs. absolute lowest price based on policy priorities",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "DHS Benefit:",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "Ensures DHS meets government transformation goals (typically 60%+ BEE procurement). Simplifies BEE reporting to National Treasury and Auditor-General. Balances cost efficiency with empowerment objectives without manual calculations. Tracks progress toward preferential procurement targets in real-time.",
      spacing: { after: 300 },
    }),

    // PFMA/MFMA
    new Paragraph({
      text: "Feature 6: PFMA/MFMA Compliance & Audit Trails",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 150 },
      shading: { fill: "F0F0F0" },
    }),
    
    new Paragraph({
      text: "Implementation Stage: System-Wide + Reporting + Workflow Management",
      bold: true,
      spacing: { after: 100 },
    }),
    
    new Paragraph({
      text: "How It Works:",
      bold: true,
      spacing: { before: 100, after: 50 },
    }),
    new Paragraph({
      text: "• Comprehensive audit trails log EVERY action in Qilly with timestamp, user ID, and justification (immutable logs, 5-year retention)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Multi-level approval workflows for high-value BOQ projects (e.g., >R10M requires Manager → CFO → Accounting Officer approval chain)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Budget variance reports compare approved budgets to actual BOQ quotes, flagging overruns before procurement",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Conflict of interest detection: DHS users must declare supplier relationships, system blocks procurement if conflict exists",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Fraud prevention: duplicate payment detection, unusual pricing pattern alerts, segregation of duties enforcement",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Monthly procurement reports for National Treasury: supplier payments, budget vs. actual, variance explanations",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "DHS Benefit:",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "Full compliance with Public Finance Management Act (national) and Municipal Finance Management Act (local government). Prevents irregular expenditure findings in Auditor-General reports. Creates transparency that deters corruption and fraud. Protects DHS officials from accusations of financial misconduct with complete audit trails. Simplifies compliance reporting to National Treasury and Parliament.",
      spacing: { after: 400 },
    }),

    // Final Recommendation
    new Paragraph({
      text: "FINAL RECOMMENDATION",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      shading: { fill: "4CAF50", color: "FFFFFF" },
    }),

    new Paragraph({
      text: "All 6 compliance features are technically feasible and strategically valuable for DHS. The recommended phased implementation approach allows DHS to:",
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "✅ Launch Qilly in Year 1 with critical foundation features (POPIA + PFMA/MFMA) already included in current budget",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "✅ Add supplier integration features (BBBEE + AGRÉMENT) in Year 1 or 2 with modest additional investment (R500k-R714k)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "✅ Complete full compliance suite in Year 2 with BOQ compliance features (SANS 1200 + NBR) funded from enhancement budget (R638k-R916k)",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "Total compliance investment over 3 years: R1.14M - R1.63M",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "Expected ROI: Compliance automation saves 2-5 days per BOQ × 1,000+ annual DHS BOQs = 2,000-5,000 person-days saved per year = R10M-R25M annual productivity gains",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "Strategic Value: DHS becomes the national leader in compliant, transparent, and efficient construction procurement - setting the standard for all government housing programs across South Africa.",
      bold: true,
      spacing: { after: 400 },
      shading: { fill: "FFFACD" },
    }),
  ];
}
