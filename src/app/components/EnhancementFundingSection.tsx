import { Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from 'docx';

export function generateEnhancementFundingSection() {
  return [
    // Enhancement Funding Section
    new Paragraph({
      text: "POST-LAUNCH ENHANCEMENT FUNDING (YEARS 2-5)",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
      shading: { fill: "00b4d8", color: "FFFFFF" },
    }),

    new Paragraph({
      text: "Beyond maintenance and infrastructure costs, this section outlines dedicated funding for continuous improvement, feature development, and system enhancements to keep Qilly competitive and aligned with evolving DHS requirements.",
      spacing: { after: 400 },
    }),

    new Paragraph({
      text: "Enhancement Categories",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),

    new Paragraph({
      text: "1. Feature Enhancements & New Functionality",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "• Integration with additional suppliers (expanding beyond Buco, Macsteel, Raumix, Lafarge)",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• Advanced analytics and reporting dashboards for DHS leadership",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• Mobile applications (iOS/Android) for field staff",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• AI/ML-powered price prediction and trend analysis",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• Integration with National Treasury systems (e-procurement)",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• Automated tender generation and submission",
      bullet: { level: 0 },
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "2. Regulatory & Compliance Updates",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "• Updates to reflect changes in SANS standards",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• National Building Regulations (NBR) updates",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• POPIA compliance adjustments for new regulations",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• BBBEE scorecard calculation updates",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• AGRÉMENT certification database updates",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• National Home Builders Registration Council (NHBRC) updates",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• National Home Builders Registration Council (NHBRC) updates",
      bullet: { level: 0 },
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "3. Performance & Scalability Improvements",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "• Database optimization for growing data volumes",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• Caching improvements for faster BOQ processing",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• API performance enhancements",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• Infrastructure scaling for increased user load",
      bullet: { level: 0 },
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "4. User Experience Enhancements",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "• UI/UX redesigns based on user feedback",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• Accessibility improvements (WCAG compliance)",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• Multilingual support (all 11 official SA languages)",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• Enhanced search and filtering capabilities",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "• Bulk operations and workflow automation",
      bullet: { level: 0 },
      spacing: { after: 300 },
    }),

    new Paragraph({
      text: "Annual Enhancement Budget Allocation",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      pageBreakBefore: true,
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Year", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 10, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Enhancement Team", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 40, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Conservative", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Premium", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
          ],
        }),
        // Year 2
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Year 2", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Enhancement Team Composition:", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("Product Owner (10 days/month)")] }),
            new TableCell({ children: [new Paragraph("R840,000")] }),
            new TableCell({ children: [new Paragraph("R1,080,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("Senior Developer (8 days/month)")] }),
            new TableCell({ children: [new Paragraph("R576,000")] }),
            new TableCell({ children: [new Paragraph("R816,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("UI/UX Designer (4 days/month)")] }),
            new TableCell({ children: [new Paragraph("R216,000")] }),
            new TableCell({ children: [new Paragraph("R312,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("QA Engineer (4 days/month)")] }),
            new TableCell({ children: [new Paragraph("R192,000")] }),
            new TableCell({ children: [new Paragraph("R264,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Year 2 Enhancement Subtotal", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R1,824,000", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R2,472,000", bold: true })],
              shading: { fill: "90EE90" }
            }),
          ],
        }),
        // Year 3
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Year 3", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Expanded Enhancement Team:", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("Product Owner (10 days/month)")] }),
            new TableCell({ children: [new Paragraph("R882,000")] }),
            new TableCell({ children: [new Paragraph("R1,134,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("Senior Developers x2 (16 days/month total)")] }),
            new TableCell({ children: [new Paragraph("R1,209,600")] }),
            new TableCell({ children: [new Paragraph("R1,713,600")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("UI/UX Designer (5 days/month)")] }),
            new TableCell({ children: [new Paragraph("R283,500")] }),
            new TableCell({ children: [new Paragraph("R409,500")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("QA Engineers x2 (8 days/month total)")] }),
            new TableCell({ children: [new Paragraph("R403,200")] }),
            new TableCell({ children: [new Paragraph("R554,400")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Year 3 Enhancement Subtotal", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R2,778,300", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R3,811,500", bold: true })],
              shading: { fill: "90EE90" }
            }),
          ],
        }),
        // Year 4
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Year 4", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Sustained Enhancement Team:", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("Similar to Year 3 with 5% cost increase")] }),
            new TableCell({ children: [new Paragraph("R2,917,215")] }),
            new TableCell({ children: [new Paragraph("R4,002,075")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Year 4 Enhancement Subtotal", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R2,917,215", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R4,002,075", bold: true })],
              shading: { fill: "90EE90" }
            }),
          ],
        }),
        // Year 5
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Year 5", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Matured Enhancement Team:", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("Similar to Year 4 with 5% cost increase")] }),
            new TableCell({ children: [new Paragraph("R3,063,076")] }),
            new TableCell({ children: [new Paragraph("R4,202,179")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Year 5 Enhancement Subtotal", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R3,063,076", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R4,202,179", bold: true })],
              shading: { fill: "90EE90" }
            }),
          ],
        }),
        // TOTAL
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "TOTAL ENHANCEMENT FUNDING (Years 2-5)", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R10,582,591", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R14,487,754", bold: true })],
              shading: { fill: "FFD700" }
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 400 } }),

    new Paragraph({
      text: "Product Owner Role - Critical for Enhancement Success",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      shading: { fill: "E8F4F8" },
    }),

    new Paragraph({
      text: "The Product Owner role is essential for directing enhancements and ensuring they deliver maximum value to DHS:",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "Key Responsibilities:",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "✓ Prioritize enhancement backlog based on DHS strategic priorities",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Conduct stakeholder interviews to gather requirements",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Define user stories and acceptance criteria",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Coordinate with DHS departments to validate feature designs",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Manage enhancement roadmap and release planning",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Track ROI and value delivered by each enhancement",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Ensure alignment with compliance and regulatory requirements",
      bullet: { level: 0 },
      spacing: { after: 400 },
    }),

    new Paragraph({
      text: "COMPLETE 5-YEAR FUNDING WITH ENHANCEMENTS",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
      shading: { fill: "00b4d8", color: "FFFFFF" },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Cost Category", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 50, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Conservative", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Premium", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 1: Production Development & Launch")] }),
            new TableCell({ children: [new Paragraph("R6,208,860")] }),
            new TableCell({ children: [new Paragraph("R9,001,860")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Years 2-5: Infrastructure & Maintenance")] }),
            new TableCell({ children: [new Paragraph("R8,216,434")] }),
            new TableCell({ children: [new Paragraph("R10,208,434")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Years 2-5: Enhancement & Feature Development")] }),
            new TableCell({ children: [new Paragraph("R10,582,591")] }),
            new TableCell({ children: [new Paragraph("R14,487,754")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "GRAND TOTAL (5 YEARS)", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R25,007,885", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R33,698,048", bold: true })],
              shading: { fill: "FFD700" }
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 300 } }),

    new Paragraph({
      text: "Enhancement Funding Benefits:",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),

    new Paragraph({
      text: "✓ Ensures Qilly remains competitive and meets evolving DHS needs",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "✓ Allows system to adapt to new construction industry standards and regulations",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "✓ Delivers continuous value through new features and capabilities",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "✓ Maintains technological advantage with modern tools and integrations",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "✓ Responds to user feedback and improves user experience",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "✓ Supports DHS digital transformation and innovation goals",
      bullet: { level: 0 },
      bold: true,
      spacing: { after: 400 },
    }),
  ];
}