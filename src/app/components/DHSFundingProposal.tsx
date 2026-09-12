import { Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from 'docx';

export function generateDHSFundingProposal() {
  return [
    // Executive Summary for DHS
    new Paragraph({
      text: "EXECUTIVE SUMMARY",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
      shading: { fill: "00b4d8", color: "FFFFFF" },
    }),

    new Paragraph({
      text: "Problem Statement",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),

    new Paragraph({
      text: "The Department of Human Settlements faces critical challenges that impede efficient housing delivery across South Africa:",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "1. EXCESSIVE PROFESSIONAL FEES BURDEN",
      bold: true,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "- Current Challenge: Every housing project budget allocates 8-15% for professional quantity surveying fees",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "- Financial Impact: R120,000 - R450,000 wasted per project on manual BOQ pricing",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "- Scale: With 100+ projects annually, DHS spends R12M - R45M on fees that could build 80-300 additional houses",
      bullet: { level: 0 },
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "2. PROJECT DELAYS DUE TO INCORRECT COST ESTIMATES",
      bold: true,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "- 35-50% of housing projects experience budget overruns requiring re-approval",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "- Average delay: 3-6 months per project while waiting for revised BOQ pricing",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "- Result: Thousands of South African families wait longer for housing delivery",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "- Root Cause: Manual pricing processes cannot access real-time supplier rates across all 9 provinces",
      bullet: { level: 0 },
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "3. COMPLIANCE AND ACCOUNTABILITY GAPS",
      bold: true,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "- Lack of transparency in cost estimation processes",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "- Difficulty verifying that quoted prices reflect true market rates",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "- Limited audit trails for budget approvals",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "- Inability to ensure compliance with preferential procurement from multiple suppliers",
      bullet: { level: 0 },
      spacing: { after: 400 },
    }),

    new Paragraph({
      text: "The Qilly Solution",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      shading: { fill: "E8F4F8" },
    }),

    new Paragraph({
      text: "Qilly is an automated construction billing system that revolutionizes how the Department of Human Settlements prices Bills of Quantities by:",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "✓ ELIMINATING 85-95% of professional fees (saving R10M - R43M annually)",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "✓ PREVENTING project delays with 100% accurate pricing in under 5 minutes",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "✓ ENSURING construction compliance through automated verification across all 9 provinces",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "✓ PROVIDING complete transparency and audit trails for National Treasury compliance",
      bullet: { level: 0 },
      bold: true,
      spacing: { after: 400 },
    }),

    // NEW: Compliance Cost Calculator Section
    new Paragraph({
      text: "BREAKTHROUGH INNOVATION: Automated Compliance Cost Calculator",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 150 },
      shading: { fill: "FFF8DC" },
    }),

    new Paragraph({
      text: "Qilly is the ONLY system in South Africa that automatically calculates and validates all mandatory construction compliance costs, preventing project failures and budget overruns:",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "✓ NHBRC Compliance (Housing Consumers Protection Measures Act 95 of 1998)",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "Automated calculation of: Enrollment fees • 5-stage inspection schedules • 10-year defects insurance premiums",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "✓ CIDB Contractor Validation (Construction Industry Development Board Act 38 of 2000)",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "Automated validation of: Contractor grading vs project value • Registration & annual fees • Non-compliant bid rejection",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "✓ Statutory Labour Compliance (UIF, SDL, COIDA, Pension Funds)",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "Automated calculation of: UIF (1%) • Skills Development Levy (1%) • COIDA (1.75%) • Bargaining Council pension contributions (10%)",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "✓ Quality Assurance Testing (SANS 2001, 227, 3001, 634)",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "Automated scheduling and costing: Concrete cube testing • Soil compaction • Brick strength • Geotechnical investigations",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "✓ BBBEE Verification (BBBEE Act 53 of 2003)",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "Automated verification type determination (EME/QSE/Generic) and fee calculations based on company turnover",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "✓ Preliminaries & General (P&G) Calculator",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "Automated calculation: Site establishment • Temporary services • Time-related costs • Health & Safety compliance (OHS Act 85 of 1993)",
      bullet: { level: 1 },
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "Impact for DHS:",
      bold: true,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "• PREVENTS 40-60% of project failures caused by contractors who underestimated compliance costs",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• SAVES R50,000 - R200,000 per project in missed compliance cost blow-outs",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• ELIMINATES 30-45 day delays waiting for NHBRC enrollment (flagged pre-tender)",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• PREVENTS irregular expenditure from awarding contracts to CIDB non-compliant contractors",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• PROVIDES itemized audit trail for every compliance rand spent (anti-corruption)",
      bullet: { level: 0 },
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "Data Sources & Accuracy (85-95%):",
      bold: true,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      text: "• NHBRC: Official fee schedules (2024/2025) updated quarterly",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• CIDB: Public grading matrix and registration fee tables",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• Dept of Labour: Statutory contribution rates (UIF, SDL, COIDA)",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• SABS/Testing Labs: Industry-standard testing frequencies and market rates",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• SANAS: BBBEE verification agency fee schedules",
      bullet: { level: 0 },
      spacing: { after: 300 },
    }),

    new Paragraph({
      text: "COMPETITIVE ADVANTAGE: No other BOQ system in South Africa offers this capability. Competitors would need 18+ months to replicate Qilly's compliance calculation engine and regulatory expertise.",
      italics: true,
      spacing: { after: 400 },
      shading: { fill: "FFFACD" },
    }),

    new Paragraph({
      text: "Funding Request Summary",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Initial Development & Deployment", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ children: [new Paragraph("R6.08M - R8.87M")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "5-Year Total Investment", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ children: [new Paragraph("R14.3M - R19.1M")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Annual Cost Savings (Year 2+)", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R10M - R43M per year", bold: true })],
              shading: { fill: "90EE90" }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "ROI Timeline", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ children: [new Paragraph("System pays for itself within 2-6 months of deployment")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Additional Houses Built (5 Years)", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "70-215 houses from savings", bold: true })],
              shading: { fill: "90EE90" }
            }),
          ],
        }),
      ],
    }),
  ];
}
