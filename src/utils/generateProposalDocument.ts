import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { getTeamRolesSection } from './teamRolesSection';
import { getDevelopmentToolsSection } from './developmentToolsSection';

export async function generateProposalDocument() {
  const today = new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' });
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // ===== COVER PAGE =====
        new Paragraph({
          text: "CONFIDENTIAL PARTNERSHIP PROPOSAL",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "QILLY CONSTRUCTION BILLING SYSTEM",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "5-Year Development & Maintenance Partnership",
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Technology Stack, Team Composition, Development Methodology & Quality Assurance Framework",
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: `Proposal Date: ${today}`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: `Valid Until: ${new Date(Date.now() + 60*24*60*60*1000).toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        
        // ===== PARTIES =====
        new Paragraph({
          text: "PARTIES TO THE AGREEMENT",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Service Provider: ", bold: true }),
            new TextRun("Assure Tech Solutions (Pty) Ltd"),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Client: ", bold: true }),
            new TextRun("[CLIENT COMPANY NAME]"),
          ],
          spacing: { after: 400 },
        }),
        
        // ===== EXECUTIVE SUMMARY =====
        new Paragraph({
          text: "EXECUTIVE SUMMARY",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Partnership Duration: ", bold: true }),
            new TextRun("60 Months (5 years)"),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Development Methodology: ", bold: true }),
            new TextRun("Agile - 130 sprints (2-week cycles)"),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Team Size: ", bold: true }),
            new TextRun("3-12 dedicated professionals across all phases"),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Total Contract Value: ", bold: true }),
            new TextRun("R 77.01M (Team: R74.54M + Infrastructure: R2.47M)"),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Average Monthly Cost: ", bold: true }),
            new TextRun("R 273.5K - R 383K"),
          ],
          spacing: { after: 400 },
        }),

        // ===== PAGE BREAK =====
        new Paragraph({
          text: "",
          pageBreakBefore: true,
        }),

        // ===== TECHNOLOGY STACK =====
        new Paragraph({
          text: "1. RECOMMENDED TECHNOLOGY STACK",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),
        
        new Paragraph({
          text: "1.1 Frontend Technologies",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({ text: "React 18 (JavaScript Library)", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Modern, component-based UI framework with massive community support",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Lightning-fast rendering with virtual DOM optimization",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Extensive ecosystem: 2M+ npm packages, 200K+ StackOverflow questions",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Easy to find React developers in South Africa (largest talent pool)",
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "TypeScript (Type-Safe JavaScript)", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Catch bugs at compile-time (before code runs) = fewer production errors",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Improved code readability and maintainability for long-term project",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Industry standard for enterprise applications (Microsoft, Google, Airbnb)",
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Tailwind CSS v4 (Utility-First CSS)", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Rapid UI development with pre-built utility classes",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Consistent design system (blue #00b4d8 branding maintained across app)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Mobile-responsive by default (critical for construction site access)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Smaller CSS bundle size = faster page loads",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "1.2 Backend & Database",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Supabase (PostgreSQL Database + Backend-as-a-Service)", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Open-source Firebase alternative (no vendor lock-in)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Built-in authentication: Email/password, social logins, magic links",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Row-level security (RLS) for data protection (POPI Act compliance)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Automatic API generation from database schema (saves development time)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Realtime subscriptions for live updates (future feature: collaborative pricing)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• PostgreSQL = industry-standard relational database with 30+ years of maturity",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "1.3 Hosting & Infrastructure",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Vercel (Frontend Hosting)", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Automatic deployments from GitHub (every push = instant preview)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Global CDN: 300+ edge locations worldwide = <50ms load times",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Built-in SSL certificates, DDoS protection, automatic scaling",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Zero-downtime deployments with instant rollback capability",
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "AWS S3 (File Storage for BOQ uploads)", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• 99.999999999% durability (11 nines) - uploaded BOQs never lost",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Cost-effective storage: R0.023 per GB/month",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Versioning enabled: recover previous versions of uploaded files",
          spacing: { after: 200 },
        }),

        ...getDevelopmentToolsSection(),

        new Paragraph({
          text: "1.5 Why These Technologies?",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "✓ Future-Proof:", bold: true }),
            new TextRun(" All technologies backed by major companies (Meta/Facebook for React, Microsoft for TypeScript)"),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "✓ Developer Availability:", bold: true }),
            new TextRun(" Largest talent pool in South Africa - easy to hire replacements"),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "✓ Cost-Effective:", bold: true }),
            new TextRun(" Open-source stack = no licensing fees (only hosting costs R160K-R580K/5 years)"),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "✓ Proven at Scale:", bold: true }),
            new TextRun(" Used by Netflix, Airbnb, Uber, Facebook - battle-tested for millions of users"),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "✓ Security:", bold: true }),
            new TextRun(" Enterprise-grade security (SSL/TLS, row-level security, POPI Act compliance)"),
          ],
          spacing: { after: 400 },
        }),

        // ===== PAGE BREAK =====
        new Paragraph({
          text: "",
          pageBreakBefore: true,
        }),

        // ===== AGILE METHODOLOGY =====
        new Paragraph({
          text: "2. AGILE DEVELOPMENT METHODOLOGY",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          text: "Sprint Framework (2-Week Cycles)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "• Sprint Duration: 2 weeks (10 working days)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Total Sprints: 130 sprints over 5 years (26 per year)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Daily Standup: 15-minute sync meetings",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Sprint Planning: Day 1 (2-4 hours) - Define user stories and commit to goals",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Sprint Review: Last Day (1-2 hours) - Demo working software to stakeholders",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Sprint Retrospective: Last Day (1 hour) - Continuous improvement",
          spacing: { after: 200 },
        }),
        
        new Paragraph({
          text: "Customer Demos (Every 4 Weeks)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "• Demo Frequency: Every 2 sprints (monthly) = 52 major demos over 4 years",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Demo Content: Live working features (not mockups - real deployed code)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Client Feedback: Required within 48 hours for quick adjustments",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Stakeholder Attendance: Decision-makers validate direction early",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Year 1 MVP Development Roadmap",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Quarter 1 (Sprints 1-6): Foundation", bold: true }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Sprints 1-2: React + TypeScript setup, Supabase auth, free trial system",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Sprints 3-4: Dashboard UI, navigation, user profile, blue (#00b4d8) branding",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Sprints 5-6: Excel/CSV file upload, BOQ column mapping, data preview",
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Quarter 2 (Sprints 7-13): Core Pricing Engine", bold: true }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Sprints 7-8: Buco supplier integration, fuzzy search matching algorithm",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Sprints 9-10: Macsteel & Raumix integration, multi-supplier price comparison",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Sprints 11-13: Automated calculations (RATE × QUANTITY), provincial pricing, 100% accuracy validation",
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Quarter 3-4 (Sprints 14-26): Advanced Features", bold: true }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Sprints 14-15: Results export (Excel, CSV, PDF)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Sprints 16-17: Lafarge supplier integration",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Sprints 18-19: Bill history & saved projects",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Sprints 20-21: Provincial pricing settings",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Sprints 22-23: Supplier catalog management",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Sprints 24-26: Performance optimization (<5 min for 500 items)",
          spacing: { after: 400 },
        }),

        // ===== PAGE BREAK =====
        new Paragraph({
          text: "",
          pageBreakBefore: true,
        }),

        // ===== DEPENDENCIES & MITIGATION =====
        new Paragraph({
          text: "3. PROJECT DEPENDENCIES & RISK MITIGATION",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),
        
        new Paragraph({
          text: "3.1 Internal Dependencies",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({ text: "Risk: Team Resource Availability", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Key team members may become unavailable due to illness, resignation, or competing priorities.",
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Mitigation Plan:", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Cross-train team members across all critical modules",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Maintain comprehensive documentation for knowledge transfer",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Build 20% buffer into sprint capacity for unexpected absences",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Pre-vetted backup resources on standby (1-week notice period)",
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Risk: Technical Complexity & Unknown Requirements", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Underestimation of complexity, scope creep, or ambiguous requirements causing delays.",
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Mitigation Plan:", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Dedicated discovery phase (Sprint 1-2) with detailed requirement analysis",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Bi-weekly client demos to validate assumptions early",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Formal change request process with impact assessment",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Technical spikes for complex features before committing to sprint",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Architecture reviews with senior developers every quarter",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "3.2 External Dependencies",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Risk: Supplier API Access & Data Quality", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Suppliers (Buco, Macsteel, Raumix, Lafarge) may delay API access, change data formats, or provide incomplete data.",
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Mitigation Plan:", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Initiate supplier API negotiations in Month 1 (before development starts)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Build data scraping fallback for suppliers without APIs",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Create mock data sets for development to proceed independently",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Design modular integration layer to swap suppliers without code rewrites",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Client to leverage business relationships for faster approvals",
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Risk: Client Availability for Demos & Feedback", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Client stakeholders unavailable for scheduled demos, causing validation delays.",
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Mitigation Plan:", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Schedule demo dates 8 weeks in advance (locked in calendar)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Record all demos for asynchronous review if needed",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Establish primary + backup stakeholders for approvals",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• 48-hour SLA for feedback on critical decisions",
          spacing: { after: 400 },
        }),

        // ===== PAGE BREAK =====
        new Paragraph({
          text: "",
          pageBreakBefore: true,
        }),

        // ===== DEPLOYMENT STRATEGY =====
        new Paragraph({
          text: "4. DEPLOYMENT STRATEGY & PRODUCTION ROLLOUT",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),

        new Paragraph({
          text: "4.1 Multi-Environment Architecture",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Development Environment:", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Purpose: Feature development & unit testing",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Access: Development team only",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Data: Mock/synthetic data",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Deployments: Multiple times per day (automated)",
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Staging Environment:", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Purpose: Client demos & UAT",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Access: Team + client stakeholders",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Data: Anonymized production-like data",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Deployments: Every sprint (bi-weekly)",
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Production Environment:", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Purpose: Live operations serving end users",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Access: End users + support team",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Data: Real client data (encrypted)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Deployments: After client approval (monthly early phases, weekly at maturity)",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "4.2 Automated CI/CD Pipeline",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "1. Code Commit → GitHub Actions trigger → Unit & integration tests run",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "2. Code Quality & Security Scans → ESLint, TypeScript compilation, vulnerability scanning",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "3. Build & Deploy to Development → Successful tests = auto-deploy",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "4. Staging Deployment → End of sprint, manual trigger for client demos",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "5. Production Deployment → Client approval, blue-green deployment, zero-downtime",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "4.3 Production Deployment Safeguards",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "• Blue-Green Deployment: Two identical environments, instant traffic switch",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Automated Rollback: Health checks fail = rollback within 2 minutes",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Database Migrations: Backward-compatible schema changes tested in staging first",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Monitoring & Alerts: Real-time error tracking, instant Slack notifications",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Feature Flags: New features deployed dark (disabled), enabled gradually for testing",
          spacing: { after: 400 },
        }),

        // ===== PAGE BREAK =====
        new Paragraph({
          text: "",
          pageBreakBefore: true,
        }),

        // ===== MUTUAL OBLIGATIONS =====
        new Paragraph({
          text: "5. MUTUAL OBLIGATIONS & RESPONSIBILITIES",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),

        new Paragraph({
          text: "5.1 Assure Tech Solutions Obligations",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "1. Deliver working software every 2 weeks (tested, functional increments)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "2. Maintain 100% pricing accuracy target (99%+ accuracy in BOQ calculations)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "3. Provide comprehensive documentation (technical docs, user guides, API specs)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "4. Dedicated quality assurance (2 in-house QA engineers minimum)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "5. Transparent progress reporting (sprint reports, burn-down charts, risk registers)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "6. Code ownership & handover (full source code repository access)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "7. Client training & knowledge transfer (live sessions for all user types)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "8. Maintenance & support during Phase 3 (bug fixes, security patches)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "9. Security & data protection (encryption, POPI Act compliance)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "10. Scalable architecture (support growth from pilot to full rollout)",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "5.2 Client Obligations",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "1. Timely feedback on demos (attend bi-weekly sprints, feedback within 48 hours)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "2. Dedicated stakeholder availability (primary + backup decision-makers)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "3. Supplier coordination (leverage business relationships for API access)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "4. Sample data & domain expertise (real BOQ samples, construction context)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "5. User acceptance testing (conduct UAT in staging before production)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "6. Timely payment (monthly invoices paid within 30 days)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "7. Training participation (ensure target users attend scheduled sessions)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "8. Change request process (submit scope changes through formal process)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "9. Production environment support (cloud accounts, domain names, SSL certificates)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "10. Data backup & compliance (approve backup/recovery procedures)",
          spacing: { after: 400 },
        }),

        // ===== PAGE BREAK =====
        new Paragraph({
          text: "",
          pageBreakBefore: true,
        }),

        // ===== TESTING & QA =====
        new Paragraph({
          text: "6. COMPREHENSIVE TEST PLAN & QUALITY ASSURANCE",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),

        new Paragraph({
          text: "6.1 Why In-House QA vs Subcontracting?",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "• Deep Product Knowledge: In-house QA works with same codebase daily",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Faster Communication: QA sits with developers in daily standups",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Agile Integration: QA participates in sprint planning from Day 1",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Cost Efficiency: In-house R35K-R45K/month vs subcontractors R800-R1200/hr",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Quality Ownership: Accountable to team, care about long-term product quality",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "6.2 Test Coverage",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Functional Testing:", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Unit Tests: Every function, component tested in isolation (Jest, React Testing Library)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Integration Tests: API endpoints, database queries, supplier integrations",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• End-to-End Tests: Complete user flows (upload BOQ → pricing → export)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Regression Tests: Automated suite runs on every code commit",
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Non-Functional Testing:", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Performance: Load testing (500 items priced in <5 min), stress testing",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Security: Penetration testing, SQL injection, XSS vulnerability scans",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Usability: User acceptance testing with real construction professionals",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Compatibility: Cross-browser testing (Chrome, Firefox, Safari, Edge)",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "6.3 QA Team Composition",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "Phase 1-2 (Years 1-4): 2 QA Engineers",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• QA Engineer 1 (Senior): Test strategy, automation framework, security testing",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• QA Engineer 2 (Mid-level): Manual testing, UAT coordination, bug documentation",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Salary Range: R35K-R45K/month each",
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Phase 3 (Year 5): 1 QA Engineer",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• QA Engineer (Senior): Regression testing, bug fixes validation",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Salary Range: R40K/month",
          spacing: { after: 400 },
        }),

        // ===== PAGE BREAK =====
        new Paragraph({
          text: "",
          pageBreakBefore: true,
        }),

        // ===== TEAM COMPOSITION =====
        new Paragraph({
          text: "8. TEAM COMPOSITION & RESOURCE ALLOCATION",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),

        new Paragraph({
          text: "8.1 Phase 1: MVP Development (Years 1-2, 24 months)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "Development Project/Scrum Manager (1): R192K/mo",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Full Stack Developer Lead (1): R208K/mo",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "QA Lead (1): R120K/mo",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Mid-Level Developers (2): R136K/mo each",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Security Test Engineer (1): R192K/mo",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Performance Test Engineer (1): R136K/mo",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "DevOps Engineer (1): R152K/mo",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "QA Engineers (2): R120K/mo each",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "QE Engineer (1): R120K/mo",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Business Analyst/UI/UX Designer (1): R112K/mo",
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Phase 1 Total: ", bold: true }),
            new TextRun("12 people | R1.744M/mo"),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "24-Month Team Cost: R 41.86M", bold: true }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Infrastructure (Years 1-2): R 192K", bold: true }),
            new TextRun({ text: " (R8K/month × 24 months)", italic: true }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "8.2 Phase 2: Feature Enhancement & Scaling (Years 3-4, 24 months)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "Development Project/Scrum Manager (1): R211.2K/mo Year 3 → R232.3K/mo Year 4",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Full Stack Developer Lead (1): R228.8K/mo Year 3 → R251.7K/mo Year 4",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "QA Lead (1): R132K/mo Year 3 → R145.2K/mo Year 4",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Mid-Level Developers (2): R149.6K/mo each Year 3 → R164.6K/mo each Year 4",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "QA Engineers (2): R132K/mo each Year 3 → R145.2K/mo each Year 4",
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Phase 2 Total: ", bold: true }),
            new TextRun("8 people | R1.003M/mo Year 3 | R1.103M/mo Year 4"),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "24-Month Team Cost: R 25.27M", bold: true }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Infrastructure (Years 3-4): R 480K", bold: true }),
            new TextRun({ text: " (R20K/month × 24 months)", italic: true }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "8.3 Phase 3: Maintenance & Support (Year 5, 12 months)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "Full Stack Developer Lead (1): R276.9K/mo",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Senior Developer (1): R181.1K/mo",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "QA Engineer (1): R159.7K/mo",
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Phase 3 Total: ", bold: true }),
            new TextRun("3 people | R617.7K/mo"),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "12-Month Team Cost: R 7.41M", bold: true }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Infrastructure (Year 5): R 1.8M", bold: true }),
            new TextRun({ text: " (R150K/month × 12 months)", italic: true }),
          ],
          spacing: { after: 400 },
        }),

        // ===== PAGE BREAK =====
        new Paragraph({
          text: "",
          pageBreakBefore: true,
        }),

        // ===== CLIENT TRAINING =====
        new Paragraph({
          text: "9. COMPREHENSIVE CLIENT TRAINING PLAN",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          text: "4-Week Structured Training Program (Month 47-48 before production rollout)",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Week 1: System Administrators Training",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "Target Audience: IT administrators, system owners (2-3 people)",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Training Topics:",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• User management (create, deactivate users)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Supplier catalog updates & maintenance",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• System settings & configurations",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Database backups & recovery",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Monitoring & error logs",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Format: 2 live sessions (2 hours each) + hands-on lab exercises",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Deliverable: Admin user guide (PDF) + recorded sessions",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Week 2: Power Users Training",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "Target Audience: Quantity surveyors, project managers, estimators (5-10 people)",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Training Topics:",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• BOQ file preparation (Excel/CSV format)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Uploading & mapping BOQ columns",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Provincial pricing configurations",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Reviewing & validating pricing results",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Exporting results (Excel, CSV, PDF)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Troubleshooting common errors",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Format: 3 live sessions (2 hours each) + real BOQ practice files",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Deliverable: Power user guide (PDF) + workflow checklists",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Week 3: End Users Training",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "Target Audience: Junior estimators, procurement teams (10-20 people)",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Training Topics:",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Basic system navigation",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Simple BOQ upload workflow",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Viewing pricing results",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Downloading completed BOQs",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Accessing bill history",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Format: 2 live sessions (1.5 hours each) + quick reference guide",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Deliverable: End user quick-start guide (1-page PDF)",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Week 4: Q&A, Troubleshooting & Knowledge Transfer",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "• Open Q&A Sessions (2 hours): Address specific client questions, edge cases",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Troubleshooting Workshop (2 hours): Simulate errors and teach resolution",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Knowledge Base Handover: Complete documentation library, FAQs, video tutorials",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Post-Training Support: 30-day email/Slack support channel",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Training Materials Delivered:",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "• User Guides (PDFs): Admin guide (20 pages), Power user guide (15 pages), Quick-start (1 page)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Video Tutorials: Recorded sessions for all topics (12+ hours)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• FAQ Database: 50+ common questions with answers, searchable knowledge base",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "• Quick Reference Cards: Printable cheat sheets for common workflows",
          spacing: { after: 400 },
        }),

        // ===== PAGE BREAK =====
        new Paragraph({
          text: "",
          pageBreakBefore: true,
        }),

        // ===== COST BREAKDOWN =====
        new Paragraph({
          text: "10. 5-YEAR PARTNERSHIP: COMPLETE FINANCIAL SUMMARY",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),

        new Paragraph({
          text: "10.1 Team Costs by Phase",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "Phase 1 (Years 1-2, 24 months): R 41.86M",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Phase 2 (Years 3-4, 24 months): R 25.27M",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Phase 3 (Year 5, 12 months): R 7.41M",
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Total Team Cost (60 months): ", bold: true }),
            new TextRun({ text: "R 74.54M", bold: true }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "10.2 Infrastructure & Tools (5 Years)",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "Years 1-2 (Phase 1): R 192K (R8K/month × 24 months)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Years 3-4 (Phase 2): R 480K (R20K/month × 24 months)",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Year 5 (Phase 3): R 1.8M (R150K/month × 12 months)",
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Total Infrastructure (60 months): ", bold: true }),
            new TextRun({ text: "R 2.47M", bold: true }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "10.3 Total Contract Value",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "5-Year Total Contract Value: ", bold: true }),
            new TextRun({ text: "R 77.01M", bold: true }),
            new TextRun({ text: " (Team: R74.54M + Infrastructure: R2.47M)", italic: true }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Average Monthly Cost: ", bold: true }),
            new TextRun({ text: "R 1.28M", bold: true }),
            new TextRun({ text: " (R77.01M ÷ 60 months)", italic: true }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Average per Sprint (130 sprints): ", bold: true }),
            new TextRun("R 592K (R77.01M ÷ 130 sprints)"),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Total Customer Demos: ", bold: true }),
            new TextRun("52 major demos over 4 years"),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Team Size Range: ", bold: true }),
            new TextRun("3-12 dedicated professionals"),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Infrastructure Breakdown: ", bold: true }),
            new TextRun("Year 1-2: R192K | Year 3-4: R480K | Year 5: R1.8M | Total: R2.47M"),
          ],
          spacing: { after: 400 },
        }),

        // ===== PAGE BREAK =====
        new Paragraph({
          text: "",
          pageBreakBefore: true,
        }),

        // ===== SIGNATURES =====
        new Paragraph({
          text: "SIGNATURES",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),
        
        // Assure Tech Executives
        new Paragraph({
          text: "ASSURE TECH SOLUTIONS (PTY) LTD",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        
        new Paragraph({
          text: "Executive 1: Chief Executive Officer",
          spacing: { before: 300, after: 100 },
        }),
        new Paragraph({
          text: "Signature: _________________________    Date: ______________",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Name: _____________________________",
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          text: "Executive 2: Chief Technology Officer",
          spacing: { before: 300, after: 100 },
        }),
        new Paragraph({
          text: "Signature: _________________________    Date: ______________",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Name: _____________________________",
          spacing: { after: 300 },
        }),
        
        new Paragraph({
          text: "Executive 3: Chief Operations Officer",
          spacing: { before: 300, after: 100 },
        }),
        new Paragraph({
          text: "Signature: _________________________    Date: ______________",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Name: _____________________________",
          spacing: { after: 400 },
        }),
        
        // Client Signature
        new Paragraph({
          text: "CLIENT ACCEPTANCE",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "Authorized Signatory",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Signature: _________________________    Date: ______________",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Name: _____________________________",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Title: _____________________________",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Company: __________________________",
          spacing: { after: 400 },
        }),
        
        // Footer
        new Paragraph({
          text: `© ${new Date().getFullYear()} Assure Tech Solutions (Pty) Ltd. All rights reserved.`,
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Qilly_Partnership_Proposal_CONFIDENTIAL_${new Date().toISOString().split('T')[0]}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}