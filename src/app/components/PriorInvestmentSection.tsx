import { Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from 'docx';

export function generatePriorInvestmentSection() {
  return [
    // Prior Investment Section
    new Paragraph({
      text: "PRIOR INVESTMENT: DEVELOPMENT & DEMO COSTS CONTRIBUTED",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
      shading: { fill: "00b4d8", color: "FFFFFF" },
    }),

    new Paragraph({
      text: "Significant development work and investment has already been made to build the Qilly functional demo/prototype. This section details the sunk costs and value already contributed to this project before DHS funding.",
      spacing: { after: 400 },
    }),

    new Paragraph({
      text: "Development Work Completed to Date",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),

    new Paragraph({
      text: "1. Core System Architecture & Design",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "✓ Complete system architecture design and technical specifications",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Database schema design for BOQ management",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ API architecture for supplier integrations",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Security architecture and POPIA compliance framework",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Regional Price Optimization System design",
      bullet: { level: 0 },
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "2. Functional Prototype Development",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "✓ User authentication and authorization system",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ BOQ upload functionality (Excel/CSV parsing)",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ 5-level cascading item matching algorithm (98-99.5% accuracy)",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Pricing engine with intelligent algorithm",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Regional price optimization with transport cost calculations",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Future price projections (6-month & 12-month inflation-adjusted)",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Bill history tracking and management",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Excel and PDF download capabilities",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Free trial system implementation",
      bullet: { level: 0 },
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "3. Supplier Data Integration (Pilot)",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "✓ Pilot integrations with Buco, Macsteel, Raumix, Lafarge",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Data normalization and standardization workflows",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Price comparison algorithms",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Coverage across all 9 South African provinces",
      bullet: { level: 0 },
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "4. User Interface & Experience",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "✓ Complete UI/UX design system with #00b4d8 brand color",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Responsive dashboard for BOQ management",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Proposal generation system (Word document export)",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Interactive reporting and analytics screens",
      bullet: { level: 0 },
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "5. Testing & Validation",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "✓ Proof-of-concept testing with sample BOQs",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Pricing accuracy validation (100% accuracy in <5 minutes)",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ User acceptance testing with construction industry professionals",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Performance benchmarking",
      bullet: { level: 0 },
      spacing: { after: 300 },
    }),

    new Paragraph({
      text: "Cost Calculation: Prior Investment",
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
              children: [new Paragraph({ text: "Development Phase", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 40, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Effort (Person-Days)", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 20, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Rate Range", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 20, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Estimated Value", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 20, type: WidthType.PERCENTAGE }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("System Architecture & Design")] }),
            new TableCell({ children: [new Paragraph("30 days")] }),
            new TableCell({ children: [new Paragraph("R10k - R15k/day")] }),
            new TableCell({ children: [new Paragraph("R300k - R450k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Frontend Development (React + Tailwind)")] }),
            new TableCell({ children: [new Paragraph("60 days")] }),
            new TableCell({ children: [new Paragraph("R6k - R9k/day")] }),
            new TableCell({ children: [new Paragraph("R360k - R540k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Backend Development (API, Logic, Database)")] }),
            new TableCell({ children: [new Paragraph("80 days")] }),
            new TableCell({ children: [new Paragraph("R7k - R10k/day")] }),
            new TableCell({ children: [new Paragraph("R560k - R800k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Pricing Engine & Matching Algorithm")] }),
            new TableCell({ children: [new Paragraph("45 days")] }),
            new TableCell({ children: [new Paragraph("R9k - R12k/day")] }),
            new TableCell({ children: [new Paragraph("R405k - R540k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Regional Price Optimization System")] }),
            new TableCell({ children: [new Paragraph("35 days")] }),
            new TableCell({ children: [new Paragraph("R8k - R11k/day")] }),
            new TableCell({ children: [new Paragraph("R280k - R385k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Supplier Data Integration (Pilot)")] }),
            new TableCell({ children: [new Paragraph("40 days")] }),
            new TableCell({ children: [new Paragraph("R7k - R10k/day")] }),
            new TableCell({ children: [new Paragraph("R280k - R400k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Excel/PDF Generation & Downloads")] }),
            new TableCell({ children: [new Paragraph("25 days")] }),
            new TableCell({ children: [new Paragraph("R6k - R9k/day")] }),
            new TableCell({ children: [new Paragraph("R150k - R225k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Future Price Projections Feature")] }),
            new TableCell({ children: [new Paragraph("20 days")] }),
            new TableCell({ children: [new Paragraph("R7k - R10k/day")] }),
            new TableCell({ children: [new Paragraph("R140k - R200k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("UI/UX Design & Prototyping")] }),
            new TableCell({ children: [new Paragraph("35 days")] }),
            new TableCell({ children: [new Paragraph("R5k - R8k/day")] }),
            new TableCell({ children: [new Paragraph("R175k - R280k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Proposal Generation System (Word Docs)")] }),
            new TableCell({ children: [new Paragraph("30 days")] }),
            new TableCell({ children: [new Paragraph("R6k - R9k/day")] }),
            new TableCell({ children: [new Paragraph("R180k - R270k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Authentication & User Management")] }),
            new TableCell({ children: [new Paragraph("20 days")] }),
            new TableCell({ children: [new Paragraph("R6k - R9k/day")] }),
            new TableCell({ children: [new Paragraph("R120k - R180k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Testing & QA (Manual + Automated)")] }),
            new TableCell({ children: [new Paragraph("40 days")] }),
            new TableCell({ children: [new Paragraph("R4k - R6k/day")] }),
            new TableCell({ children: [new Paragraph("R160k - R240k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Project Management & Coordination")] }),
            new TableCell({ children: [new Paragraph("30 days")] }),
            new TableCell({ children: [new Paragraph("R5k - R8k/day")] }),
            new TableCell({ children: [new Paragraph("R150k - R240k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("DevOps Setup & Deployment (Demo)")] }),
            new TableCell({ children: [new Paragraph("15 days")] }),
            new TableCell({ children: [new Paragraph("R5k - R7k/day")] }),
            new TableCell({ children: [new Paragraph("R75k - R105k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Documentation & User Guides")] }),
            new TableCell({ children: [new Paragraph("15 days")] }),
            new TableCell({ children: [new Paragraph("R3k - R5k/day")] }),
            new TableCell({ children: [new Paragraph("R45k - R75k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "SUBTOTAL: Development Labor", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "520 days", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R3.38M - R4.93M", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "Infrastructure & Services (Demo Period)", bold: true })] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Cloud hosting (6 months)")] }),
            new TableCell({ children: [new Paragraph("-")] }),
            new TableCell({ children: [new Paragraph("-")] }),
            new TableCell({ children: [new Paragraph("R85,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Development tools & licenses (6 months)")] }),
            new TableCell({ children: [new Paragraph("-")] }),
            new TableCell({ children: [new Paragraph("-")] }),
            new TableCell({ children: [new Paragraph("R45,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Domain, SSL, misc. services")] }),
            new TableCell({ children: [new Paragraph("-")] }),
            new TableCell({ children: [new Paragraph("-")] }),
            new TableCell({ children: [new Paragraph("R15,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "SUBTOTAL: Infrastructure", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R145,000", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "TOTAL PRIOR INVESTMENT", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "520+ days", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R3.53M - R5.08M", bold: true })],
              shading: { fill: "FFD700" }
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 400 } }),

    new Paragraph({
      text: "Value Delivered Through Prior Investment",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),

    new Paragraph({
      text: "✓ Proof of Concept Validated: Working demo proves technical feasibility",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "✓ Market Validation: 98-99.5% automated matching accuracy demonstrated",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "✓ Risk Reduction: Core technical challenges already solved",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "✓ Faster Time to Market: Production development can build on proven foundation",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "✓ User Feedback Incorporated: Prototype tested with industry professionals",
      bullet: { level: 0 },
      bold: true,
    }),
    new Paragraph({
      text: "✓ DHS Confidence: Functional demo reduces perceived risk of funding",
      bullet: { level: 0 },
      bold: true,
      spacing: { after: 400 },
    }),

    new Paragraph({
      text: "COMPLETE INVESTMENT PICTURE (Including Prior Work)",
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
              children: [new Paragraph({ text: "Investment Category", bold: true })],
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
            new TableCell({ 
              children: [new Paragraph({ text: "PRIOR INVESTMENT (Already Contributed)", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R3,530,000", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R5,080,000", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Demo development, testing, infrastructure (6 months)")] }),
            new TableCell({ children: [new Paragraph("(520 person-days)")] }),
            new TableCell({ children: [new Paragraph("(520 person-days)")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "DHS FUNDING REQUEST (5 Years)", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R25,007,885", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R33,698,048", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 1: Production development & launch")] }),
            new TableCell({ children: [new Paragraph("R6,208,860")] }),
            new TableCell({ children: [new Paragraph("R9,001,860")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Years 2-5: Infrastructure & maintenance")] }),
            new TableCell({ children: [new Paragraph("R8,216,434")] }),
            new TableCell({ children: [new Paragraph("R10,208,434")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Years 2-5: Enhancements & new features")] }),
            new TableCell({ children: [new Paragraph("R10,582,591")] }),
            new TableCell({ children: [new Paragraph("R14,487,754")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "TOTAL PROJECT VALUE (Prior + DHS Funding)", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R28,537,885", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R38,778,048", bold: true })],
              shading: { fill: "FFD700" }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Prior Investment as % of Total", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "12.4%", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "13.1%", bold: true })],
              shading: { fill: "90EE90" }
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 400 } }),

    new Paragraph({
      text: "Summary:",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),

    new Paragraph({
      text: "The Qilly development team has already invested R3.53M - R5.08M in building a functional demo/prototype, representing 12-13% of the total project value. This prior investment:",
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "✓ De-risks the DHS funding request by proving technical feasibility",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Demonstrates commitment and seriousness of the development team",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Reduces time-to-market for production version",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Provides working foundation to build enterprise-grade system",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Validates market demand and user acceptance",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Shows that requested DHS funding will build on proven technology",
      bullet: { level: 0 },
      spacing: { after: 400 },
    }),
  ];
}
