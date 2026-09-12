import { Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from 'docx';

export function generateFiveYearCostBreakdown() {
  return [
    // 5-Year Complete Cost Breakdown
    new Paragraph({
      text: "COMPLETE 5-YEAR COST BREAKDOWN",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
      shading: { fill: "00b4d8", color: "FFFFFF" },
    }),

    new Paragraph({
      text: "This section provides a comprehensive breakdown of ALL costs over the 5-year partnership period, including production development, infrastructure, DevOps, licenses, and ongoing maintenance.",
      spacing: { after: 400 },
    }),

    // YEAR 1 COMPLETE BREAKDOWN
    new Paragraph({
      text: "YEAR 1: PRODUCTION DEVELOPMENT & LAUNCH",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      shading: { fill: "FFD700" },
    }),

    new Paragraph({
      text: "One-Time Development Costs",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Category", bold: true })],
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
            new TableCell({ children: [new Paragraph("Team Composition (15 professionals)")] }),
            new TableCell({ children: [new Paragraph("R3,040,000")] }),
            new TableCell({ children: [new Paragraph("R4,870,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Security Hardening")] }),
            new TableCell({ children: [new Paragraph("R262,500")] }),
            new TableCell({ children: [new Paragraph("R355,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Performance Optimization")] }),
            new TableCell({ children: [new Paragraph("R198,000")] }),
            new TableCell({ children: [new Paragraph("R278,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Enterprise Features")] }),
            new TableCell({ children: [new Paragraph("R225,000")] }),
            new TableCell({ children: [new Paragraph("R320,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("QA & Testing")] }),
            new TableCell({ children: [new Paragraph("R170,000")] }),
            new TableCell({ children: [new Paragraph("R237,500")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("DevOps Setup")] }),
            new TableCell({ children: [new Paragraph("R185,000")] }),
            new TableCell({ children: [new Paragraph("R260,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Security Infrastructure Setup")] }),
            new TableCell({ children: [new Paragraph("R110,000")] }),
            new TableCell({ children: [new Paragraph("R150,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Performance Infrastructure Setup")] }),
            new TableCell({ children: [new Paragraph("R35,000")] }),
            new TableCell({ children: [new Paragraph("R50,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Supplier API Integration Enhancement", bold: true })] 
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R485,000", bold: true })] 
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R680,000", bold: true })] 
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph("(Direct API integration for Buco, Macsteel, Raumix, Lafarge - replacing web scraping)")],
              width: { size: 50, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Subtotal: One-Time Development", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R4,710,500", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R7,200,500", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 300 } }),

    new Paragraph({
      text: "Year 1 Infrastructure & Licenses (12 months)",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Service", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 50, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Monthly", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Annual", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "Cloud Infrastructure (AWS/Azure)", bold: true })] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- Compute (App servers + Workers)")] }),
            new TableCell({ children: [new Paragraph("R16,150")] }),
            new TableCell({ children: [new Paragraph("R193,800")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- Database (Multi-AZ + Replicas)")] }),
            new TableCell({ children: [new Paragraph("R11,050")] }),
            new TableCell({ children: [new Paragraph("R132,600")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- Storage (500GB + backups)")] }),
            new TableCell({ children: [new Paragraph("R850")] }),
            new TableCell({ children: [new Paragraph("R10,200")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- CDN & Bandwidth")] }),
            new TableCell({ children: [new Paragraph("R3,825")] }),
            new TableCell({ children: [new Paragraph("R45,900")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- Redis Cache")] }),
            new TableCell({ children: [new Paragraph("R2,550")] }),
            new TableCell({ children: [new Paragraph("R30,600")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- Load Balancer")] }),
            new TableCell({ children: [new Paragraph("R1,275")] }),
            new TableCell({ children: [new Paragraph("R15,300")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- Monitoring & Logging (New Relic/DataDog)")] }),
            new TableCell({ children: [new Paragraph("R5,950")] }),
            new TableCell({ children: [new Paragraph("R71,400")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- Security (WAF, SSL, Secrets Manager)")] }),
            new TableCell({ children: [new Paragraph("R2,975")] }),
            new TableCell({ children: [new Paragraph("R35,700")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- Backup & Disaster Recovery")] }),
            new TableCell({ children: [new Paragraph("R1,700")] }),
            new TableCell({ children: [new Paragraph("R20,400")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- Email Service (SendGrid/AWS SES)")] }),
            new TableCell({ children: [new Paragraph("R850")] }),
            new TableCell({ children: [new Paragraph("R10,200")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Cloud Infrastructure Subtotal", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R47,175", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R566,100", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "Software Licenses & Services", bold: true })] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- GitHub Enterprise (Team)")] }),
            new TableCell({ children: [new Paragraph("R850")] }),
            new TableCell({ children: [new Paragraph("R10,200")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- Sentry (Error Tracking)")] }),
            new TableCell({ children: [new Paragraph("R1,275")] }),
            new TableCell({ children: [new Paragraph("R15,300")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- PagerDuty (Incident Management)")] }),
            new TableCell({ children: [new Paragraph("R850")] }),
            new TableCell({ children: [new Paragraph("R10,200")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- StatusPage (System Status)")] }),
            new TableCell({ children: [new Paragraph("R850")] }),
            new TableCell({ children: [new Paragraph("R10,200")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- Auth0 / Supabase Auth (optional)")] }),
            new TableCell({ children: [new Paragraph("R1,700")] }),
            new TableCell({ children: [new Paragraph("R20,400")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- Slack (Team Communication)")] }),
            new TableCell({ children: [new Paragraph("R425")] }),
            new TableCell({ children: [new Paragraph("R5,100")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- Figma / Design Tools")] }),
            new TableCell({ children: [new Paragraph("R510")] }),
            new TableCell({ children: [new Paragraph("R6,120")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- Postman / API Tools")] }),
            new TableCell({ children: [new Paragraph("R340")] }),
            new TableCell({ children: [new Paragraph("R4,080")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("- SSL Certificates (Wildcard)")] }),
            new TableCell({ children: [new Paragraph("R425")] }),
            new TableCell({ children: [new Paragraph("R5,100")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Licenses Subtotal", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R7,225", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R86,700", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Contingency (20%)", bold: true })],
              shading: { fill: "FFF4CC" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R10,880", bold: true })],
              shading: { fill: "FFF4CC" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R130,560", bold: true })],
              shading: { fill: "FFF4CC" }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "YEAR 1 INFRASTRUCTURE TOTAL", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R65,280", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R783,360", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" }
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 300 } }),

    new Paragraph({
      text: "Year 1 Maintenance & Support (12 months)",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Senior Full-Stack Developer (10 days/month)")] }),
            new TableCell({ children: [new Paragraph("R720,000 - R1,020,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("DevOps Engineer (4 days/month)")] }),
            new TableCell({ children: [new Paragraph("R336,000 - R480,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("QA Engineer (3 days/month)")] }),
            new TableCell({ children: [new Paragraph("R144,000 - R198,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "YEAR 1 MAINTENANCE TOTAL", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R1,200,000 - R1,698,000", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" }
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 400 } }),

    new Paragraph({
      text: "YEAR 1 TOTAL INVESTMENT",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      shading: { fill: "FFD700" },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Component", bold: true })],
              shading: { fill: "E8F4F8" },
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Conservative", bold: true })],
              shading: { fill: "E8F4F8" },
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Premium", bold: true })],
              shading: { fill: "E8F4F8" },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Production Development (one-time)")] }),
            new TableCell({ children: [new Paragraph("R4,710,500")] }),
            new TableCell({ children: [new Paragraph("R7,200,500")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Infrastructure & Licenses (12 months)")] }),
            new TableCell({ children: [new Paragraph("R783,360")] }),
            new TableCell({ children: [new Paragraph("R783,360")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Maintenance & Support (12 months)")] }),
            new TableCell({ children: [new Paragraph("R1,200,000")] }),
            new TableCell({ children: [new Paragraph("R1,698,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "YEAR 1 GRAND TOTAL", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R6,693,860", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R9,681,860", bold: true })],
              shading: { fill: "FFD700" }
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 600 } }),

    // YEARS 2-5
    new Paragraph({
      text: "YEARS 2-5: OPERATIONAL COSTS",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
      shading: { fill: "00b4d8", color: "FFFFFF" },
    }),

    new Paragraph({
      text: "Annual Recurring Costs (Years 2, 3, 4, 5)",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Category", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 50, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Annual Cost", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "4-Year Total", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "Cloud Infrastructure", bold: true })] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 2 (20% growth)")] }),
            new TableCell({ children: [new Paragraph("R679,320")] }),
            new TableCell({ children: [new Paragraph("-")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 3 (30% growth)")] }),
            new TableCell({ children: [new Paragraph("R735,948")] }),
            new TableCell({ children: [new Paragraph("-")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 4 (25% growth)")] }),
            new TableCell({ children: [new Paragraph("R735,948")] }),
            new TableCell({ children: [new Paragraph("-")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 5 (20% growth)")] }),
            new TableCell({ children: [new Paragraph("R883,138")] }),
            new TableCell({ children: [new Paragraph("-")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Infrastructure Subtotal (Years 2-5)", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ children: [new Paragraph("-")] }),
            new TableCell({ 
              children: [new Paragraph({ text: "R3,034,354", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "Software Licenses", bold: true })] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Years 2-5 (5% annual increase)")] }),
            new TableCell({ children: [new Paragraph("~R91,000 avg/year")] }),
            new TableCell({ children: [new Paragraph("R382,080")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Licenses Subtotal (Years 2-5)", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
            new TableCell({ children: [new Paragraph("-")] }),
            new TableCell({ 
              children: [new Paragraph({ text: "R382,080", bold: true })],
              shading: { fill: "D0F0FF" }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "Maintenance & Support", bold: true })] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Conservative (R1.2M/year)")] }),
            new TableCell({ children: [new Paragraph("R1,200,000")] }),
            new TableCell({ children: [new Paragraph("R4,800,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Premium (R1.7M/year)")] }),
            new TableCell({ children: [new Paragraph("R1,698,000")] }),
            new TableCell({ children: [new Paragraph("R6,792,000")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "YEARS 2-5 TOTAL (Conservative)", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "~R2.1M/year", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R8,216,434", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "YEARS 2-5 TOTAL (Premium)", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "~R2.2M/year", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R10,208,434", bold: true })],
              shading: { fill: "FFD700" }
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 600 } }),

    // COMPLETE 5-YEAR SUMMARY
    new Paragraph({
      text: "COMPLETE 5-YEAR INVESTMENT SUMMARY",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
      shading: { fill: "FFD700" },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Year", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" },
              width: { size: 15, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Development", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" },
              width: { size: 20, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Infrastructure", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" },
              width: { size: 15, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Licenses", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" },
              width: { size: 15, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Maintenance", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" },
              width: { size: 15, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Annual Total", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" },
              width: { size: 20, type: WidthType.PERCENTAGE }
            }),
          ],
        }),
        // Conservative Model
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "CONSERVATIVE MODEL", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 1")] }),
            new TableCell({ children: [new Paragraph("R4,225,500")] }),
            new TableCell({ children: [new Paragraph("R566,100")] }),
            new TableCell({ children: [new Paragraph("R86,700")] }),
            new TableCell({ children: [new Paragraph("R1,200,000")] }),
            new TableCell({ children: [new Paragraph({ text: "R6,078,300", bold: true })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 2")] }),
            new TableCell({ children: [new Paragraph("R0")] }),
            new TableCell({ children: [new Paragraph("R679,320")] }),
            new TableCell({ children: [new Paragraph("R91,035")] }),
            new TableCell({ children: [new Paragraph("R1,200,000")] }),
            new TableCell({ children: [new Paragraph({ text: "R1,970,355", bold: true })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 3")] }),
            new TableCell({ children: [new Paragraph("R0")] }),
            new TableCell({ children: [new Paragraph("R735,948")] }),
            new TableCell({ children: [new Paragraph("R95,587")] }),
            new TableCell({ children: [new Paragraph("R1,200,000")] }),
            new TableCell({ children: [new Paragraph({ text: "R2,031,535", bold: true })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 4")] }),
            new TableCell({ children: [new Paragraph("R0")] }),
            new TableCell({ children: [new Paragraph("R735,948")] }),
            new TableCell({ children: [new Paragraph("R100,366")] }),
            new TableCell({ children: [new Paragraph("R1,200,000")] }),
            new TableCell({ children: [new Paragraph({ text: "R2,036,314", bold: true })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 5")] }),
            new TableCell({ children: [new Paragraph("R0")] }),
            new TableCell({ children: [new Paragraph("R883,138")] }),
            new TableCell({ children: [new Paragraph("R105,384")] }),
            new TableCell({ children: [new Paragraph("R1,200,000")] }),
            new TableCell({ children: [new Paragraph({ text: "R2,188,522", bold: true })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "5-YEAR TOTAL", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R4,225,500", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R3,600,454", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R479,072", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R6,000,000", bold: true })],
              shading: { fill: "90EE90" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R14,305,026", bold: true })],
              shading: { fill: "90EE90" }
            }),
          ],
        }),
        // Spacing
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
            new TableCell({ children: [new Paragraph("")] }),
          ],
        }),
        // Premium Model
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "PREMIUM MODEL", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 1")] }),
            new TableCell({ children: [new Paragraph("R6,520,500")] }),
            new TableCell({ children: [new Paragraph("R566,100")] }),
            new TableCell({ children: [new Paragraph("R86,700")] }),
            new TableCell({ children: [new Paragraph("R1,698,000")] }),
            new TableCell({ children: [new Paragraph({ text: "R8,871,300", bold: true })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 2")] }),
            new TableCell({ children: [new Paragraph("R0")] }),
            new TableCell({ children: [new Paragraph("R679,320")] }),
            new TableCell({ children: [new Paragraph("R91,035")] }),
            new TableCell({ children: [new Paragraph("R1,698,000")] }),
            new TableCell({ children: [new Paragraph({ text: "R2,468,355", bold: true })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 3")] }),
            new TableCell({ children: [new Paragraph("R0")] }),
            new TableCell({ children: [new Paragraph("R735,948")] }),
            new TableCell({ children: [new Paragraph("R95,587")] }),
            new TableCell({ children: [new Paragraph("R1,698,000")] }),
            new TableCell({ children: [new Paragraph({ text: "R2,529,535", bold: true })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 4")] }),
            new TableCell({ children: [new Paragraph("R0")] }),
            new TableCell({ children: [new Paragraph("R735,948")] }),
            new TableCell({ children: [new Paragraph("R100,366")] }),
            new TableCell({ children: [new Paragraph("R1,698,000")] }),
            new TableCell({ children: [new Paragraph({ text: "R2,534,314", bold: true })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year 5")] }),
            new TableCell({ children: [new Paragraph("R0")] }),
            new TableCell({ children: [new Paragraph("R883,138")] }),
            new TableCell({ children: [new Paragraph("R105,384")] }),
            new TableCell({ children: [new Paragraph("R1,698,000")] }),
            new TableCell({ children: [new Paragraph({ text: "R2,686,522", bold: true })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "5-YEAR TOTAL", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R6,520,500", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R3,600,454", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R479,072", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R8,490,000", bold: true })],
              shading: { fill: "FFD700" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R19,090,026", bold: true })],
              shading: { fill: "FFD700" }
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 400 } }),

    new Paragraph({
      text: "5-Year Cost Summary:",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),

    new Paragraph({
      text: "✓ Production Development (one-time): R4.2M - R6.5M",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Cloud Infrastructure (5 years): R3.6M",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Software Licenses (5 years): R479K",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Maintenance & Support (5 years): R6.0M - R8.5M",
      bullet: { level: 0 },
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: "CONSERVATIVE 5-YEAR TOTAL: R14,305,026",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 100 },
      shading: { fill: "90EE90" },
    }),

    new Paragraph({
      text: "PREMIUM 5-YEAR TOTAL: R19,090,026",
      heading: HeadingLevel.HEADING_3,
      spacing: { after: 400 },
      shading: { fill: "FFD700" },
    }),

    new Paragraph({
      text: "Note: Infrastructure costs include 20-30% growth annually to accommodate scaling user base. License costs include 5% annual increases. All figures in South African Rands (ZAR).",
      spacing: { after: 400 },
      italics: true,
    }),
  ];
}