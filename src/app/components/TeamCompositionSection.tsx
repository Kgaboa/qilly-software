import { Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from 'docx';

export function generateTeamCompositionSection() {
  return [
    // Team Composition
    new Paragraph({
      text: "TEAM COMPOSITION & RESPONSIBILITIES",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
    }),

    new Paragraph({
      text: "This section outlines the complete team structure required to deliver Qilly to production readiness, including detailed responsibilities, South African market rates, and time allocation for each role.",
      spacing: { after: 400 },
    }),

    // Executive Oversight
    new Paragraph({
      text: "EXECUTIVE OVERSIGHT",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      shading: { fill: "00b4d8", color: "FFFFFF" },
    }),

    new Paragraph({
      text: "1. Technical Director / Chief Technology Officer (CTO)",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Rate", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph("R12,000 - R18,000 per day")],
              width: { size: 75, type: WidthType.PERCENTAGE }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Allocation", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ children: [new Paragraph("2-3 days per week (strategic oversight)")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Duration", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ children: [new Paragraph("Full project lifecycle (4 months = 32-48 days)")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Investment", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R384,000 - R864,000", bold: true })] 
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 200 } }),
    new Paragraph({
      text: "Key Responsibilities:",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "Strategic Technology Leadership",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Define overall technical architecture and technology stack decisions",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Make critical build vs. buy decisions for third-party services",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Ensure alignment with business objectives and scalability requirements",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Approve all major technical decisions and architectural changes",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "Risk Management & Quality Assurance",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Identify and mitigate technical risks throughout the project lifecycle",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Review security architecture and POPIA compliance strategies",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Validate disaster recovery and business continuity plans",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Sign off on major milestone deliverables and production releases",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "Team Leadership & Mentorship",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Provide technical guidance and mentorship to development team",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Resolve complex technical challenges and architectural debates",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Foster culture of innovation and technical excellence",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Conduct technical reviews and enforce code quality standards",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "Stakeholder Communication",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Present technical strategy and progress to executive stakeholders",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Translate complex technical concepts into business value propositions",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Manage expectations and communicate realistic timelines",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Participate in partnership negotiations and technical due diligence",
      bullet: { level: 1 },
      spacing: { after: 300 },
    }),

    // Executive Position 2
    new Paragraph({
      text: "2. Project Executive Sponsor / Chief Operating Officer (COO)",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      pageBreakBefore: true,
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Rate", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph("R10,000 - R15,000 per day")],
              width: { size: 75, type: WidthType.PERCENTAGE }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Allocation", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ children: [new Paragraph("1-2 days per week (strategic oversight)")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Duration", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ children: [new Paragraph("Full project lifecycle (4 months = 16-32 days)")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Investment", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R160,000 - R480,000", bold: true })] 
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 200 } }),
    new Paragraph({
      text: "Key Responsibilities:",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "Business Strategy & Operations",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Align technical development with business goals and market strategy",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Ensure project delivers tangible business value and measurable ROI",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Oversee operational readiness and go-to-market planning",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Define success metrics, KPIs, and performance benchmarks",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "Budget & Resource Management",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Approve project budget and monitor financial performance against targets",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Authorize resource allocation and major contract approvals",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Review and approve procurement decisions for infrastructure and tools",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Ensure cost-effectiveness and strict budget adherence",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "Stakeholder & Partner Relations",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Lead partnership negotiations and commercial agreements",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Manage relationships with key suppliers (Buco, Macsteel, Raumix, Lafarge)",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Coordinate with legal, compliance, and procurement teams",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Present quarterly updates to board of directors and investors",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "Risk Oversight & Governance",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Monitor project risks and review mitigation strategies",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Ensure regulatory compliance (POPIA, construction industry standards)",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Approve change requests and scope modifications",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Escalate critical issues to executive leadership team",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "Change Management & Market Adoption",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Champion organizational change management initiatives",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Plan user adoption strategy and comprehensive training programs",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Coordinate marketing, PR, and communication strategies",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Monitor post-launch success metrics and user feedback",
      bullet: { level: 1 },
      spacing: { after: 300 },
    }),

    // Executive Position 3
    new Paragraph({
      text: "3. Chief Financial Officer (CFO)",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      pageBreakBefore: true,
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Rate", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph("R9,000 - R14,000 per day")],
              width: { size: 75, type: WidthType.PERCENTAGE }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Allocation", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ children: [new Paragraph("1-2 days per week (financial oversight)")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Duration", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ children: [new Paragraph("Full project lifecycle (4 months = 16-32 days)")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Investment", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R144,000 - R448,000", bold: true })] 
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 200 } }),
    new Paragraph({
      text: "Key Responsibilities:",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "Financial Governance & Budget Management",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Oversee complete financial planning and budget allocation for the project",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Ensure cost control and prevent budget overruns",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Develop financial reporting frameworks for DHS leadership",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Monitor spending against approved budgets and forecasts",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "Treasury & Audit Compliance",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Ensure full compliance with Public Finance Management Act (PFMA)",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Prepare documentation for National Treasury and Auditor-General",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Implement financial controls and audit trail mechanisms",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Coordinate with DHS finance department for procurement processes",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "Cost-Benefit Analysis & ROI Tracking",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Calculate and document cost savings from professional fee elimination",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Track ROI metrics and taxpayer value delivered",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Prepare financial justifications for continued funding",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Develop 5-year financial projections and sustainability models",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "Procurement & Supplier Financial Management",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Oversee financial relationships with technology suppliers and vendors",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Negotiate payment terms and service level agreements",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Ensure competitive pricing for infrastructure and licenses",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Review and approve all major financial commitments",
      bullet: { level: 1 },
      spacing: { after: 300 },
    }),

    // Executive Position 4
    new Paragraph({
      text: "4. Chief Compliance Officer (CCO)",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
      pageBreakBefore: true,
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Rate", bold: true })],
              shading: { fill: "E8F4F8" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph("R8,500 - R13,000 per day")],
              width: { size: 75, type: WidthType.PERCENTAGE }
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Allocation", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ children: [new Paragraph("1-2 days per week (compliance oversight)")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Duration", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ children: [new Paragraph("Full project lifecycle (4 months = 16-32 days)")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "Investment", bold: true })],
              shading: { fill: "E8F4F8" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R136,000 - R416,000", bold: true })] 
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 200 } }),
    new Paragraph({
      text: "Key Responsibilities:",
      bold: true,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "Construction Standards Compliance",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Ensure system compliance with SANS 1200 (South African National Standards)",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Validate alignment with National Home Builders Registration Council (NHBRC)",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Verify AGRÉMENT South Africa certification requirements",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Implement automated compliance verification workflows",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "Data Protection & Privacy Compliance",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Ensure full POPIA (Protection of Personal Information Act) compliance",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Implement government-grade data security protocols",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Establish data residency policies (all data within South Africa)",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Conduct regular privacy impact assessments",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "Procurement & Transformation Compliance",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Oversee BBBEE (Broad-Based Black Economic Empowerment) compliance",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Implement preferential procurement tracking and reporting",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Ensure supplier diversity across all 9 provinces",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Monitor local economic development impacts",
      bullet: { level: 1 },
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: "Regulatory Reporting & Audit Management",
      bullet: { level: 0 },
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "- Prepare compliance reports for DHS leadership and National Treasury",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Coordinate with Auditor-General for audit readiness",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Establish comprehensive audit trails for all system decisions",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Develop compliance dashboards and real-time monitoring",
      bullet: { level: 1 },
    }),
    new Paragraph({
      text: "- Manage anti-corruption and fraud prevention frameworks",
      bullet: { level: 1 },
      spacing: { after: 300 },
    }),

    new Paragraph({
      text: "Executive Oversight Total Investment: R1,208,000 - R3,072,000",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 400 },
      shading: { fill: "FFE5B4" },
    }),

    // Team Summary
    new Paragraph({
      text: "COMPLETE TEAM SUMMARY",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
      shading: { fill: "00b4d8", color: "FFFFFF" },
    }),

    new Paragraph({
      text: "The complete 18-person team includes 4 executive oversight positions and 14 technical/operational professionals (including Product Owner and Project Manager):",
      spacing: { after: 200 },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "#", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" },
              width: { size: 5, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Role", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" },
              width: { size: 45, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Allocation", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Investment", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" },
              width: { size: 25, type: WidthType.PERCENTAGE }
            }),
          ],
        }),
        // Executive Oversight
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "1", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "CTO / Technical Director", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ children: [new Paragraph("2-3 days/week")] }),
            new TableCell({ children: [new Paragraph("R384k - R864k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "2", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "COO / Executive Sponsor", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ children: [new Paragraph("1-2 days/week")] }),
            new TableCell({ children: [new Paragraph("R160k - R480k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "3", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "CFO / Chief Financial Officer", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ children: [new Paragraph("1-2 days/week")] }),
            new TableCell({ children: [new Paragraph("R144k - R448k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "4", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "CCO / Chief Compliance Officer", bold: true })],
              shading: { fill: "FFE5B4" }
            }),
            new TableCell({ children: [new Paragraph("1-2 days/week")] }),
            new TableCell({ children: [new Paragraph("R136k - R416k")] }),
          ],
        }),
        // Core Development
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("5")] }),
            new TableCell({ children: [new Paragraph("Product Owner")] }),
            new TableCell({ children: [new Paragraph("Full-time")] }),
            new TableCell({ children: [new Paragraph("R560k - R720k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("6")] }),
            new TableCell({ children: [new Paragraph("Technical Project Manager")] }),
            new TableCell({ children: [new Paragraph("Full-time")] }),
            new TableCell({ children: [new Paragraph("R440k - R640k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("7")] }),
            new TableCell({ children: [new Paragraph("Solution Analyst / Business Analyst")] }),
            new TableCell({ children: [new Paragraph("Full-time")] }),
            new TableCell({ children: [new Paragraph("R480k - R660k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("8")] }),
            new TableCell({ children: [new Paragraph("Senior Full-Stack Developer (Lead)")] }),
            new TableCell({ children: [new Paragraph("Full-time")] }),
            new TableCell({ children: [new Paragraph("R480k - R680k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("9-10")] }),
            new TableCell({ children: [new Paragraph("Backend Developers (x2)")] }),
            new TableCell({ children: [new Paragraph("Full-time each")] }),
            new TableCell({ children: [new Paragraph("R600k - R840k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("11")] }),
            new TableCell({ children: [new Paragraph("Frontend Developer")] }),
            new TableCell({ children: [new Paragraph("Full-time")] }),
            new TableCell({ children: [new Paragraph("R270k - R390k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("12")] }),
            new TableCell({ children: [new Paragraph("Database Specialist")] }),
            new TableCell({ children: [new Paragraph("3 days/week")] }),
            new TableCell({ children: [new Paragraph("R156k - R216k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("13")] }),
            new TableCell({ children: [new Paragraph("UI/UX Designer")] }),
            new TableCell({ children: [new Paragraph("2 days/week")] }),
            new TableCell({ children: [new Paragraph("R72k - R104k")] }),
          ],
        }),
        // Security & Infrastructure
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("14")] }),
            new TableCell({ children: [new Paragraph("Senior Security Engineer")] }),
            new TableCell({ children: [new Paragraph("3 days/week")] }),
            new TableCell({ children: [new Paragraph("R135k - R180k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("15")] }),
            new TableCell({ children: [new Paragraph("Senior DevOps Engineer")] }),
            new TableCell({ children: [new Paragraph("3 days/week")] }),
            new TableCell({ children: [new Paragraph("R105k - R150k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("16")] }),
            new TableCell({ children: [new Paragraph("Cloud Architect")] }),
            new TableCell({ children: [new Paragraph("2 days/week")] }),
            new TableCell({ children: [new Paragraph("R80k - R110k")] }),
          ],
        }),
        // QA & Testing
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("17")] }),
            new TableCell({ children: [new Paragraph("Senior QA Engineer")] }),
            new TableCell({ children: [new Paragraph("Full-time")] }),
            new TableCell({ children: [new Paragraph("R80k - R110k")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("18")] }),
            new TableCell({ children: [new Paragraph("Test Automation Engineer")] }),
            new TableCell({ children: [new Paragraph("3 days/week")] }),
            new TableCell({ children: [new Paragraph("R60k - R84k")] }),
          ],
        }),
        // Documentation
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("19")] }),
            new TableCell({ children: [new Paragraph("Technical Writer")] }),
            new TableCell({ children: [new Paragraph("2 days/week")] }),
            new TableCell({ children: [new Paragraph("R17.5k - R25k")] }),
          ],
        }),
        // HR & Recruitment
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("20")] }),
            new TableCell({ children: [new Paragraph("HR & Recruitment Specialist")] }),
            new TableCell({ children: [new Paragraph("3 days/week")] }),
            new TableCell({ children: [new Paragraph("R180k - R270k")] }),
          ],
        }),
        // Total
        new TableRow({
          children: [
            new TableCell({ 
              children: [new Paragraph({ text: "", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "TOTAL TEAM (20 professionals)", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "Mixed allocation", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" }
            }),
            new TableCell({ 
              children: [new Paragraph({ text: "R4.74M - R7.86M", bold: true })],
              shading: { fill: "00b4d8", color: "FFFFFF" }
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ text: "", spacing: { after: 400 } }),

    new Paragraph({
      text: "Team Composition Key Benefits:",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),

    new Paragraph({
      text: "✓ Comprehensive executive oversight (CTO, COO, CFO, CCO) ensures strategic alignment, financial governance, and compliance",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ All roles filled with South African market-rate senior professionals",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Balanced team covering development, security, infrastructure, QA, and documentation",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Part-time allocations optimize costs without sacrificing quality",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Clear accountability matrix with defined responsibilities for all deliverables",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Knowledge transfer and comprehensive documentation ensure long-term maintainability",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "✓ Proven South African contracting rates based on February 2026 market data",
      bullet: { level: 0 },
      spacing: { after: 400 },
    }),
  ];
}