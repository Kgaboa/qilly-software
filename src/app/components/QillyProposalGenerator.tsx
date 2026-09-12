import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType, convertInchesToTwip } from 'docx';
import saveAs from 'file-saver';
import { FileDown, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { generateTeamCompositionSection } from './TeamCompositionSection';
import { generateFiveYearCostBreakdown } from './FiveYearCostBreakdown';
import { generateDHSFundingProposal } from './DHSFundingProposal';
import { generateEnhancementFundingSection } from './EnhancementFundingSection';
import { generatePriorInvestmentSection } from './PriorInvestmentSection';
import { createComplianceFeaturesSection } from './ComplianceFeaturesSection';
import { generateCitationsAndReferences } from '@/utils/citationsAndReferences';

export function QillyProposalGenerator() {
  
  const generateProposal = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Cover Page
          new Paragraph({
            text: "QILLY",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            style: "Title"
          }),
          new Paragraph({
            text: "Construction Billing System",
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "FUNDING REQUEST",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Department of Human Settlements",
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            bold: true,
          }),
          new Paragraph({
            text: "Automated BOQ Pricing Solution",
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Eliminating Professional Fees • Preventing Project Delays • Ensuring Construction Compliance",
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            italics: true,
          }),
          new Paragraph({
            text: `Prepared: ${new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "Republic of South Africa • All 9 Provinces",
            alignment: AlignmentType.CENTER,
            italics: true,
          }),

          // Page Break
          new Paragraph({ text: "", pageBreakBefore: true }),

          // DHS-Specific Executive Summary and Benefits
          ...generateDHSFundingProposal(),

          // Page Break before technical details
          new Paragraph({ text: "", pageBreakBefore: true }),

          // Executive Summary
          new Paragraph({
            text: "EXECUTIVE SUMMARY",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: "Total Investment Required: R2,847,500 - R4,165,000",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 300 },
          }),

          // Executive Summary Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: "Phase", bold: true })],
                    shading: { fill: "00b4d8", color: "FFFFFF" },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Cost Range (ZAR)", bold: true })],
                    shading: { fill: "00b4d8", color: "FFFFFF" },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Production Development")] }),
                  new TableCell({ children: [new Paragraph("R1,260,000 - R1,890,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Infrastructure (Year 1)")] }),
                  new TableCell({ children: [new Paragraph("R252,000 - R420,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("DevOps & Security Setup")] }),
                  new TableCell({ children: [new Paragraph("R315,000 - R525,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Maintenance (12 months)")] }),
                  new TableCell({ children: [new Paragraph("R1,020,000 - R1,330,000")] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 400 } }),

          // About Qilly
          new Paragraph({
            text: "ABOUT QILLY",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: "Qilly is a revolutionary Core Ground Civils construction billing system that automatically prices bills of quantities using live supplier data from multiple suppliers including Buco, Macsteel, Raumix, and Lafarge across all 9 South African provinces.",
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "Key Features:",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: "• Automatic BOQ pricing with 100% accuracy in under 5 minutes",
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "• Multi-supplier comparison across entire country",
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "• Regional Price Optimization System with transport cost calculations",
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "• 5-level cascading item matching system (98-99.5% automated matching)",
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "• Future Price Projections with inflation adjustments (6 & 12 months)",
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "• Excel and PDF download capabilities",
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "• User authentication and bill history tracking",
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "• Free trial system",
            spacing: { after: 300 },
            bullet: { level: 0 },
          }),

          // Phase 1: Production Development
          new Paragraph({
            text: "PHASE 1: PRODUCTION DEVELOPMENT",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: "Duration: 3-4 months",
            spacing: { after: 200 },
            italics: true,
          }),

          // 1.1 Security Hardening
          new Paragraph({
            text: "1.1 Security Hardening 🔒",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            text: "Duration: 4-6 weeks",
            spacing: { after: 100 },
            italics: true,
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Resource", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Rate/Day (ZAR)", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Days", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Subtotal", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Senior Security Engineer")] }),
                  new TableCell({ children: [new Paragraph("R7,500 - R10,000")] }),
                  new TableCell({ children: [new Paragraph("25")] }),
                  new TableCell({ children: [new Paragraph("R187,500 - R250,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Backend Developer")] }),
                  new TableCell({ children: [new Paragraph("R5,000 - R7,000")] }),
                  new TableCell({ children: [new Paragraph("15")] }),
                  new TableCell({ children: [new Paragraph("R75,000 - R105,000")] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 200 } }),
          new Paragraph({
            text: "Deliverables:",
            bold: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "Authentication & Authorization",
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "- OAuth 2.0 / JWT implementation",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Multi-factor authentication (MFA)",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Role-based access control (RBAC)",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Session management & token refresh",
            bullet: { level: 1 },
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: "Data Security",
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "- End-to-end encryption for sensitive data",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Database encryption at rest",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Secure API key management (Vault/AWS Secrets Manager)",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- PII data anonymization for non-production environments",
            bullet: { level: 1 },
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: "API Security",
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "- Rate limiting (prevent DDoS)",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- API authentication tokens",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Input validation & sanitization",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- SQL injection prevention",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- XSS protection",
            bullet: { level: 1 },
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: "Compliance",
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "- POPIA (Protection of Personal Information Act) compliance",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- GDPR considerations for international clients",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Audit logging for all transactions",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Data retention policies",
            bullet: { level: 1 },
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "Subtotal: R262,500 - R355,000",
            bold: true,
            spacing: { after: 300 },
          }),

          // 1.2 Performance Optimization
          new Paragraph({
            text: "1.2 Performance Optimization ⚡",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: "Duration: 3-4 weeks",
            spacing: { after: 100 },
            italics: true,
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Resource", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Rate/Day (ZAR)", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Days", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Subtotal", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Senior Full-Stack Developer")] }),
                  new TableCell({ children: [new Paragraph("R6,000 - R8,500")] }),
                  new TableCell({ children: [new Paragraph("20")] }),
                  new TableCell({ children: [new Paragraph("R120,000 - R170,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Database Specialist")] }),
                  new TableCell({ children: [new Paragraph("R6,500 - R9,000")] }),
                  new TableCell({ children: [new Paragraph("12")] }),
                  new TableCell({ children: [new Paragraph("R78,000 - R108,000")] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 200 } }),
          new Paragraph({
            text: "Deliverables:",
            bold: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "Backend Optimization",
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "- Database query optimization & indexing",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Caching layer (Redis) for pricing data",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Connection pooling",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Async processing for BOQ pricing",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Background job queues (Bull/RabbitMQ)",
            bullet: { level: 1 },
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: "Frontend Optimization",
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "- Code splitting & lazy loading",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Asset optimization (images, fonts)",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- CDN integration for static assets",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Service workers for offline capability",
            bullet: { level: 1 },
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: "Pricing Engine Performance",
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "- Parallel processing for supplier comparisons",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Caching frequently accessed supplier data",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Optimize Excel/CSV parsing (streaming)",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Target: <3 minutes for 500+ item BOQs",
            bullet: { level: 1 },
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "Subtotal: R198,000 - R278,000",
            bold: true,
            spacing: { after: 300 },
          }),

          // 1.3 Enterprise Features
          new Paragraph({
            text: "1.3 Enterprise Features 🚀",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: "Duration: 4-6 weeks",
            spacing: { after: 100 },
            italics: true,
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Resource", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Rate/Day (ZAR)", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Days", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Subtotal", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Senior Full-Stack Developer")] }),
                  new TableCell({ children: [new Paragraph("R6,000 - R8,500")] }),
                  new TableCell({ children: [new Paragraph("30")] }),
                  new TableCell({ children: [new Paragraph("R180,000 - R255,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("UI/UX Designer")] }),
                  new TableCell({ children: [new Paragraph("R4,500 - R6,500")] }),
                  new TableCell({ children: [new Paragraph("10")] }),
                  new TableCell({ children: [new Paragraph("R45,000 - R65,000")] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 200 } }),
          new Paragraph({
            text: "Deliverables:",
            bold: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "Multi-tenancy Architecture",
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "- Tenant isolation (data separation)",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Custom branding per client",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Usage tracking & billing per tenant",
            bullet: { level: 1 },
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: "Advanced Features",
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "- Bulk BOQ processing (batch uploads)",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Advanced reporting & analytics dashboard",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Export options (Excel, PDF)",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Email notifications (quotes, processing complete)",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Webhook integrations for partner systems",
            bullet: { level: 1 },
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: "Admin Portal",
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "- Supplier data management",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- User management",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- System monitoring dashboard",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Pricing algorithm configuration",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Transport matrix management",
            bullet: { level: 1 },
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "Subtotal: R225,000 - R320,000",
            bold: true,
            spacing: { after: 300 },
          }),

          // 1.4 Quality Assurance & Testing
          new Paragraph({
            text: "1.4 Quality Assurance & Testing 🧪",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: "Duration: 3-4 weeks",
            spacing: { after: 100 },
            italics: true,
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Resource", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Rate/Day (ZAR)", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Days", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Subtotal", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("QA Engineer")] }),
                  new TableCell({ children: [new Paragraph("R4,000 - R5,500")] }),
                  new TableCell({ children: [new Paragraph("20")] }),
                  new TableCell({ children: [new Paragraph("R80,000 - R110,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Senior Developer (Unit Tests)")] }),
                  new TableCell({ children: [new Paragraph("R6,000 - R8,500")] }),
                  new TableCell({ children: [new Paragraph("15")] }),
                  new TableCell({ children: [new Paragraph("R90,000 - R127,500")] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 200 } }),
          new Paragraph({
            text: "Deliverables:",
            bold: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "Automated Testing",
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "- Unit tests (80%+ coverage)",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Integration tests for APIs",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- End-to-end testing (Playwright/Cypress)",
            bullet: { level: 1 },
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: "Manual Testing",
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "- User acceptance testing (UAT)",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Cross-browser testing",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Mobile responsiveness testing",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Load testing (1000+ concurrent users)",
            bullet: { level: 1 },
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: "Security Testing",
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "- Penetration testing",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Vulnerability scanning (OWASP Top 10)",
            bullet: { level: 1 },
          }),
          new Paragraph({
            text: "- Third-party security audit",
            bullet: { level: 1 },
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "Subtotal: R170,000 - R237,500",
            bold: true,
            spacing: { after: 300 },
          }),

          // 1.5 Documentation & Project Management
          new Paragraph({
            text: "1.5 Documentation & Project Management",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Resource", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Rate/Day (ZAR)", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Days", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Subtotal", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Technical Writer")] }),
                  new TableCell({ children: [new Paragraph("R3,500 - R5,000")] }),
                  new TableCell({ children: [new Paragraph("10")] }),
                  new TableCell({ children: [new Paragraph("R35,000 - R50,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Developer (API docs)")] }),
                  new TableCell({ children: [new Paragraph("R5,000 - R7,000")] }),
                  new TableCell({ children: [new Paragraph("5")] }),
                  new TableCell({ children: [new Paragraph("R25,000 - R35,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Technical Project Manager")] }),
                  new TableCell({ children: [new Paragraph("R5,500 - R8,000")] }),
                  new TableCell({ children: [new Paragraph("60")] }),
                  new TableCell({ children: [new Paragraph("R330,000 - R480,000")] }),
                ],
              }),
            ],
          }),

          new Paragraph({
            text: "Documentation Subtotal: R60,000 - R85,000",
            bold: true,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: "Project Management Subtotal: R330,000 - R480,000",
            bold: true,
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: "PHASE 1 TOTAL: R1,260,000 - R1,890,000",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 400 },
            shading: { fill: "00b4d8", color: "FFFFFF" },
          }),

          // Phase 2: Infrastructure & DevOps
          new Paragraph({
            text: "PHASE 2: INFRASTRUCTURE & DEVOPS",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: "Duration: 2-3 weeks",
            spacing: { after: 200 },
            italics: true,
          }),

          new Paragraph({
            text: "2.1 DevOps Setup 🔧",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Resource", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Rate/Day (ZAR)", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Days", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Subtotal", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Senior DevOps Engineer")] }),
                  new TableCell({ children: [new Paragraph("R7,000 - R10,000")] }),
                  new TableCell({ children: [new Paragraph("15")] }),
                  new TableCell({ children: [new Paragraph("R105,000 - R150,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Cloud Architect")] }),
                  new TableCell({ children: [new Paragraph("R8,000 - R11,000")] }),
                  new TableCell({ children: [new Paragraph("10")] }),
                  new TableCell({ children: [new Paragraph("R80,000 - R110,000")] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 200 } }),
          new Paragraph({
            text: "Deliverables:",
            bold: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "- Infrastructure as Code (Terraform/CloudFormation)",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- CI/CD Pipeline (GitHub Actions/GitLab CI)",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Docker containerization & Kubernetes orchestration",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Monitoring & Logging (New Relic/DataDog, ELK Stack)",
            bullet: { level: 0 },
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "Subtotal: R185,000 - R260,000",
            bold: true,
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: "2.2 Security Infrastructure 🛡️",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Resource", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Rate/Day (ZAR)", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Days", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Subtotal", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Security Engineer")] }),
                  new TableCell({ children: [new Paragraph("R7,500 - R10,000")] }),
                  new TableCell({ children: [new Paragraph("10")] }),
                  new TableCell({ children: [new Paragraph("R75,000 - R100,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("DevOps Engineer")] }),
                  new TableCell({ children: [new Paragraph("R7,000 - R10,000")] }),
                  new TableCell({ children: [new Paragraph("5")] }),
                  new TableCell({ children: [new Paragraph("R35,000 - R50,000")] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 200 } }),
          new Paragraph({
            text: "Deliverables:",
            bold: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "- WAF (Web Application Firewall) & DDoS protection",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- SSL/TLS certificates (auto-renewal)",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Automated database backups & disaster recovery",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Intrusion detection system (IDS)",
            bullet: { level: 0 },
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "Subtotal: R110,000 - R150,000",
            bold: true,
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: "2.3 Performance Infrastructure ⚡",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),

          new Paragraph({
            text: "DevOps Engineer: R35,000 - R50,000",
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "Deliverables:",
            bold: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "- CDN setup (Cloudflare/AWS CloudFront)",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Load balancers (auto-scaling)",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Redis cache cluster",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Database read replicas",
            bullet: { level: 0 },
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "PHASE 2 TOTAL: R330,000 - R460,000",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 400 },
            shading: { fill: "00b4d8", color: "FFFFFF" },
          }),

          // Phase 3: Infrastructure Costs
          new Paragraph({
            text: "PHASE 3: INFRASTRUCTURE COSTS (ANNUAL)",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),

          new Paragraph({
            text: "3.1 Cloud Hosting - AWS/Azure",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            text: "Assumptions: 500-1000 active users, 5,000-10,000 BOQ processings/month, 99.9% uptime",
            spacing: { after: 200 },
            italics: true,
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Service", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Monthly (ZAR)", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Annual (ZAR)", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Compute (2x App servers + Worker)")] }),
                  new TableCell({ children: [new Paragraph("R16,150")] }),
                  new TableCell({ children: [new Paragraph("R193,800")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Database (Multi-AZ + Replica)")] }),
                  new TableCell({ children: [new Paragraph("R11,050")] }),
                  new TableCell({ children: [new Paragraph("R132,600")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Storage (500GB)")] }),
                  new TableCell({ children: [new Paragraph("R850")] }),
                  new TableCell({ children: [new Paragraph("R10,200")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("CDN & Bandwidth")] }),
                  new TableCell({ children: [new Paragraph("R3,825")] }),
                  new TableCell({ children: [new Paragraph("R45,900")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Redis Cache")] }),
                  new TableCell({ children: [new Paragraph("R2,550")] }),
                  new TableCell({ children: [new Paragraph("R30,600")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Load Balancer")] }),
                  new TableCell({ children: [new Paragraph("R1,275")] }),
                  new TableCell({ children: [new Paragraph("R15,300")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Monitoring & Logging")] }),
                  new TableCell({ children: [new Paragraph("R5,950")] }),
                  new TableCell({ children: [new Paragraph("R71,400")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Security (WAF, SSL, Secrets)")] }),
                  new TableCell({ children: [new Paragraph("R2,975")] }),
                  new TableCell({ children: [new Paragraph("R35,700")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Backup & DR")] }),
                  new TableCell({ children: [new Paragraph("R1,700")] }),
                  new TableCell({ children: [new Paragraph("R20,400")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Email Service")] }),
                  new TableCell({ children: [new Paragraph("R850")] }),
                  new TableCell({ children: [new Paragraph("R10,200")] }),
                ],
              }),
            ],
          }),

          new Paragraph({
            text: "Infrastructure Subtotal: R47,175/month = R566,100/year",
            bold: true,
            spacing: { before: 200, after: 300 },
          }),

          new Paragraph({
            text: "3.2 Third-Party Services",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Service", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Purpose", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Annual (ZAR)", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("GitHub Enterprise")] }),
                  new TableCell({ children: [new Paragraph("Code repository")] }),
                  new TableCell({ children: [new Paragraph("R10,200")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Sentry")] }),
                  new TableCell({ children: [new Paragraph("Error tracking")] }),
                  new TableCell({ children: [new Paragraph("R15,300")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("PagerDuty")] }),
                  new TableCell({ children: [new Paragraph("On-call management")] }),
                  new TableCell({ children: [new Paragraph("R10,200")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("StatusPage")] }),
                  new TableCell({ children: [new Paragraph("Status monitoring")] }),
                  new TableCell({ children: [new Paragraph("R10,200")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Auth0 (optional)")] }),
                  new TableCell({ children: [new Paragraph("Authentication service")] }),
                  new TableCell({ children: [new Paragraph("R20,400")] }),
                ],
              }),
            ],
          }),

          new Paragraph({
            text: "Third-Party Subtotal: R66,300/year",
            bold: true,
            spacing: { before: 200, after: 200 },
          }),

          new Paragraph({
            text: "Contingency Buffer (+20%): R126,480/year",
            bold: true,
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: "INFRASTRUCTURE YEAR 1 TOTAL: R758,880",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            text: "Operational (9 months after setup): R252,000 - R420,000",
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 400 },
            shading: { fill: "00b4d8", color: "FFFFFF" },
          }),

          // Phase 4: Maintenance & Support
          new Paragraph({
            text: "PHASE 4: MAINTENANCE & SUPPORT (12 MONTHS)",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),

          new Paragraph({
            text: "4.1 Ongoing Development & Enhancements",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Resource", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Rate/Day", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Days/Month", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Annual", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Senior Full-Stack Developer")] }),
                  new TableCell({ children: [new Paragraph("R6,000 - R8,500")] }),
                  new TableCell({ children: [new Paragraph("10")] }),
                  new TableCell({ children: [new Paragraph("R720,000 - R1,020,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("DevOps Engineer (part-time)")] }),
                  new TableCell({ children: [new Paragraph("R7,000 - R10,000")] }),
                  new TableCell({ children: [new Paragraph("4")] }),
                  new TableCell({ children: [new Paragraph("R336,000 - R480,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("QA Engineer (part-time)")] }),
                  new TableCell({ children: [new Paragraph("R4,000 - R5,500")] }),
                  new TableCell({ children: [new Paragraph("3")] }),
                  new TableCell({ children: [new Paragraph("R144,000 - R198,000")] }),
                ],
              }),
            ],
          }),

          new Paragraph({
            text: "Subtotal: R1,200,000 - R1,698,000/year",
            bold: true,
            spacing: { before: 200, after: 200 },
          }),

          new Paragraph({
            text: "Activities:",
            bold: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "- Bug fixes & patches (SLA: 24-48hr response)",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Feature enhancements",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Supplier data updates",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Performance monitoring & optimization",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Security patches & updates",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Monthly reporting",
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: "4.2 Support Tiers",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Tier", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Coverage", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Response Time", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Cost", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Business Hours")] }),
                  new TableCell({ children: [new Paragraph("Mon-Fri 8AM-5PM")] }),
                  new TableCell({ children: [new Paragraph("4 hours")] }),
                  new TableCell({ children: [new Paragraph("Included")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Extended Hours")] }),
                  new TableCell({ children: [new Paragraph("Mon-Fri 7AM-7PM")] }),
                  new TableCell({ children: [new Paragraph("2 hours")] }),
                  new TableCell({ children: [new Paragraph("+R15,000/month")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("24/7 Critical")] }),
                  new TableCell({ children: [new Paragraph("All emergencies")] }),
                  new TableCell({ children: [new Paragraph("1 hour")] }),
                  new TableCell({ children: [new Paragraph("+R35,000/month")] }),
                ],
              }),
            ],
          }),

          new Paragraph({
            text: "MAINTENANCE YEAR 1 TOTAL: R1,020,000 - R1,478,400",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 400 },
            shading: { fill: "00b4d8", color: "FFFFFF" },
          }),

          // Total Investment
          new Paragraph({
            text: "TOTAL INVESTMENT BREAKDOWN",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true,
          }),

          new Paragraph({
            text: "Option A: Conservative Estimate",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Phase", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Cost (ZAR)", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Production Development")] }),
                  new TableCell({ children: [new Paragraph("R1,260,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("DevOps & Security Setup")] }),
                  new TableCell({ children: [new Paragraph("R330,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Infrastructure (9 months operational)")] }),
                  new TableCell({ children: [new Paragraph("R252,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Maintenance (12 months)")] }),
                  new TableCell({ children: [new Paragraph("R1,020,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ text: "TOTAL", bold: true })],
                    shading: { fill: "00b4d8", color: "FFFFFF" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ text: "R2,862,000", bold: true })],
                    shading: { fill: "00b4d8", color: "FFFFFF" }
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 400 } }),

          new Paragraph({
            text: "Option B: Premium Estimate",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Phase", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Cost (ZAR)", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Production Development")] }),
                  new TableCell({ children: [new Paragraph("R1,890,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("DevOps & Security Setup")] }),
                  new TableCell({ children: [new Paragraph("R460,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Infrastructure (9 months operational)")] }),
                  new TableCell({ children: [new Paragraph("R420,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Maintenance (12 months)")] }),
                  new TableCell({ children: [new Paragraph("R1,478,400")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ text: "TOTAL", bold: true })],
                    shading: { fill: "00b4d8", color: "FFFFFF" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ text: "R4,248,400", bold: true })],
                    shading: { fill: "00b4d8", color: "FFFFFF" }
                  }),
                ],
              }),
            ],
          }),

          // 5-Year Partnership
          new Paragraph({
            text: "5-YEAR PARTNERSHIP MODELS",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),

          new Paragraph({
            text: "Model 1: Upfront + Annual Subscription",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),

          new Paragraph({
            text: "Year 1 (Production + Setup): R2,862,000 - R4,248,400",
            bold: true,
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: "Years 2-5 (Maintenance + Infrastructure):",
            bold: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "- Infrastructure: R758,880/year",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Maintenance: R1,020,000 - R1,478,400/year",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Annual Cost: R1,778,880 - R2,237,280/year",
            bullet: { level: 0 },
            bold: true,
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "5-Year Total: R9,977,520 - R13,198,520",
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 },
            shading: { fill: "FFE5B4" },
          }),
          new Paragraph({
            text: "Monthly SLA Fee (Years 2-5): R148,240 - R186,440",
            spacing: { after: 400 },
          }),

          new Paragraph({
            text: "Model 2: Equity Partnership Structure",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),

          new Paragraph({
            text: "Equity Split:",
            bold: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "- Client contributes: 50% cash (R1,431,000 - R2,124,200 Year 1)",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Client receives: 40-50% equity in Qilly",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Developer retains: 50-60% equity",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Developer covers: Remaining development costs",
            bullet: { level: 0 },
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "Revenue Share (Years 2-5):",
            bold: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "- Split maintenance costs 50/50",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Share revenue from other clients",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Build value for potential exit/acquisition",
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),

          new Paragraph({
            text: "Model 3: Revenue-Based Pricing",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),

          new Paragraph({
            text: "Year 1 Setup: R1,500,000 (reduced)",
            bold: true,
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "Ongoing (Years 2-5):",
            bold: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "- Base fee: R100,000/month (infrastructure + support)",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Plus: 15-20% of gross revenue from Qilly platform",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Incentivizes growth and success",
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),

          // 5-Year Complete Cost Breakdown
          ...generateFiveYearCostBreakdown(),

          // Team Composition Section
          ...generateTeamCompositionSection(),

          // Prior Investment Section (Demo/Prototype Costs)
          ...generatePriorInvestmentSection(),

          // Enhancement Funding Section (Years 2-5)
          ...generateEnhancementFundingSection(),

          // DHS Construction Compliance Features
          ...createComplianceFeaturesSection(),

          // Citations and References Section
          ...generateCitationsAndReferences(),

          // ROI Projection
          new Paragraph({
            text: "ROI PROJECTION FOR PARTNER",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),

          new Paragraph({
            text: "Revenue Assumptions:",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: "- Pricing: R5,000 - R15,000 per BOQ priced",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Target Clients: 50-100 construction companies (Year 2)",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- BOQs per client: 2-5 per month",
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: "Conservative Revenue Projection",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Year", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Clients", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "BOQs/Month", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Avg Price", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Annual Revenue", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("1")] }),
                  new TableCell({ children: [new Paragraph("5")] }),
                  new TableCell({ children: [new Paragraph("25")] }),
                  new TableCell({ children: [new Paragraph("R8,000")] }),
                  new TableCell({ children: [new Paragraph("R2,400,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("2")] }),
                  new TableCell({ children: [new Paragraph("20")] }),
                  new TableCell({ children: [new Paragraph("100")] }),
                  new TableCell({ children: [new Paragraph("R8,000")] }),
                  new TableCell({ children: [new Paragraph("R9,600,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("3")] }),
                  new TableCell({ children: [new Paragraph("50")] }),
                  new TableCell({ children: [new Paragraph("250")] }),
                  new TableCell({ children: [new Paragraph("R8,000")] }),
                  new TableCell({ children: [new Paragraph("R24,000,000")] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 400 } }),

          new Paragraph({
            text: "Year 3 Profitability Analysis",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Item", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Amount (ZAR)", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Revenue", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "R24,000,000", bold: true })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Infrastructure")] }),
                  new TableCell({ children: [new Paragraph("R900,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Maintenance & Support")] }),
                  new TableCell({ children: [new Paragraph("R1,800,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Sales & Marketing")] }),
                  new TableCell({ children: [new Paragraph("R3,600,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Data Acquisition (suppliers)")] }),
                  new TableCell({ children: [new Paragraph("R1,200,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("General & Admin")] }),
                  new TableCell({ children: [new Paragraph("R2,400,000")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Total Costs", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "R9,900,000", bold: true })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ text: "EBITDA", bold: true })],
                    shading: { fill: "90EE90" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ text: "R14,100,000", bold: true })],
                    shading: { fill: "90EE90" }
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ text: "Profit Margin", bold: true })],
                    shading: { fill: "90EE90" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ text: "58.8%", bold: true })],
                    shading: { fill: "90EE90" }
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            text: "Year 3 ROI: 470% (based on R3M Year 1 investment)",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 300, after: 400 },
            shading: { fill: "FFD700" },
          }),

          // SLA
          new Paragraph({
            text: "SERVICE LEVEL AGREEMENT (SLA) INCLUSIONS",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),

          new Paragraph({
            text: "Uptime Guarantee",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: "- 99.9% uptime (maximum 8.76 hours downtime per year)",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Credit: 10% monthly fee for each 0.1% below SLA",
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: "Response Times",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Severity", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Response", bold: true })], shading: { fill: "E8F4F8" } }),
                  new TableCell({ children: [new Paragraph({ text: "Resolution", bold: true })], shading: { fill: "E8F4F8" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Critical (system down)")] }),
                  new TableCell({ children: [new Paragraph("1 hour")] }),
                  new TableCell({ children: [new Paragraph("4 hours")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("High (major feature broken)")] }),
                  new TableCell({ children: [new Paragraph("4 hours")] }),
                  new TableCell({ children: [new Paragraph("24 hours")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Medium (minor bug)")] }),
                  new TableCell({ children: [new Paragraph("24 hours")] }),
                  new TableCell({ children: [new Paragraph("3 days")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Low (enhancement)")] }),
                  new TableCell({ children: [new Paragraph("3 days")] }),
                  new TableCell({ children: [new Paragraph("Next sprint")] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 300 } }),

          new Paragraph({
            text: "Performance Guarantees",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: "- BOQ processing: <5 minutes for 500 items",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Page load time: <2 seconds",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- API response: <500ms (95th percentile)",
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: "Security Commitments",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: "- Quarterly security audits",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Monthly vulnerability scans",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Immediate patching of critical vulnerabilities",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Annual penetration testing",
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: "Maintenance Windows",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: "- Scheduled: 1st Sunday of month, 2AM-6AM SAST",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Emergency: As needed (with 2-hour notice if possible)",
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),

          // Risks & Mitigation
          new Paragraph({
            text: "RISKS & MITIGATION",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Risk", bold: true })], shading: { fill: "FFB6C1" } }),
                  new TableCell({ children: [new Paragraph({ text: "Mitigation", bold: true })], shading: { fill: "90EE90" } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Supplier data changes")] }),
                  new TableCell({ children: [new Paragraph("Build scraping + API fallbacks; contracts with suppliers")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Pricing accuracy issues")] }),
                  new TableCell({ children: [new Paragraph("Start with 95% accuracy SLA, improve to 99%")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Scalability bottlenecks")] }),
                  new TableCell({ children: [new Paragraph("Cloud auto-scaling, load testing before launch")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Competition")] }),
                  new TableCell({ children: [new Paragraph("First-mover advantage, IP protection, exclusive supplier partnerships")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Client adoption")] }),
                  new TableCell({ children: [new Paragraph("Pilot program, money-back guarantee first 3 months")] }),
                ],
              }),
            ],
          }),

          // Recommended Pricing
          new Paragraph({
            text: "RECOMMENDED PRICING FOR PARTNER",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            pageBreakBefore: true,
          }),

          new Paragraph({
            text: "Tier 1 (Conservative)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            shading: { fill: "E8F4F8" },
          }),
          new Paragraph({
            text: "- Year 1: R3,200,000",
            bullet: { level: 0 },
            bold: true,
          }),
          new Paragraph({
            text: "- Years 2-5: R1,900,000/year",
            bullet: { level: 0 },
            bold: true,
          }),
          new Paragraph({
            text: "- 5-Year Total: R10,800,000",
            bullet: { level: 0 },
            bold: true,
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: "Tier 2 (Premium)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            shading: { fill: "FFE5B4" },
          }),
          new Paragraph({
            text: "- Year 1: R4,500,000",
            bullet: { level: 0 },
            bold: true,
          }),
          new Paragraph({
            text: "- Years 2-5: R2,200,000/year",
            bullet: { level: 0 },
            bold: true,
          }),
          new Paragraph({
            text: "- 5-Year Total: R13,300,000",
            bullet: { level: 0 },
            bold: true,
            spacing: { after: 400 },
          }),

          // Conclusion
          new Paragraph({
            text: "CONCLUSION",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            text: "Investment Summary:",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: "- Year 1: R2,862,000 - R4,248,400 (production-ready + 1-year support)",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- Annual Recurring: R1,778,880 - R2,237,280 (Years 2-5)",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "- 5-Year Total: R9,977,520 - R13,198,520",
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: "Value Proposition:",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: "✓ Production-ready system with enterprise-grade security",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "✓ 99.9% uptime SLA with 24/7 critical support",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "✓ Scalable infrastructure supporting 1000+ concurrent users",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "✓ 12 months comprehensive maintenance included",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "✓ ROI potential: 470%+ by Year 3",
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),

          new Paragraph({
            text: "This pricing reflects realistic South African market rates and enterprise-grade development standards.",
            spacing: { after: 200 },
            italics: true,
          }),

          new Paragraph({
            text: "Next Steps:",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            text: "1. Review proposal and select preferred partnership model",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "2. Schedule technical assessment and due diligence (2 weeks)",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "3. Finalize partnership agreement and commence development",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "4. Target production launch: 3-4 months from commencement",
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),

          new Paragraph({ text: "", spacing: { after: 600 } }),

          new Paragraph({
            text: "Contact Information",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 100 },
          }),
          new Paragraph({
            text: "For questions or clarifications regarding this proposal, please contact:",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Qilly Development Team",
            bold: true,
          }),
          new Paragraph({
            text: `Document prepared: ${new Date().toLocaleDateString('en-ZA')}`,
            italics: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "Proposal valid for 60 days from date of issue",
            italics: true,
            color: "666666",
          }),

        ],
      }],
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Qilly_Production_Proposal_${new Date().toISOString().split('T')[0]}.docx`);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <CardTitle className="text-2xl">DHS Funding Request - Qilly System</CardTitle>
        </div>
        <CardDescription className="text-base">
          Department of Human Settlements: Automated BOQ Solution to Eliminate Professional Fees, Prevent Project Delays & Ensure Construction Compliance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Funding Request & Cost Savings</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">DHS 5-Year Funding Request</p>
              <p className="text-2xl font-bold text-blue-600">R25.0M - R33.7M</p>
              <p className="text-xs text-gray-500 mt-1">Development, infrastructure, maintenance & enhancements</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Prior Investment (Already Contributed)</p>
              <p className="text-2xl font-bold text-purple-600">R3.53M - R5.08M</p>
              <p className="text-xs text-gray-500 mt-1">Functional demo/prototype (520 person-days)</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Total Project Value:</span> R28.5M - R38.8M (including prior work)
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-semibold">5-Year Cost Savings:</span> <span className="text-green-600 font-bold">R50M - R215M</span>
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-semibold">Net Benefit to DHS:</span> <span className="text-green-600 font-bold">R21M - R181M</span>
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Taxpayer savings after accounting for DHS funding request
            </p>
            <p className="text-sm text-green-600 font-semibold mt-3">
              Build 140 - 1,207 additional houses with net savings
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Proposal Includes:</h4>
          <div className="grid gap-2">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span className="text-sm text-gray-700">Production Development (Security, Performance, Enterprise Features)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span className="text-sm text-gray-700">DevOps & Security Infrastructure Setup</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span className="text-sm text-gray-700">Cloud Hosting (AWS/Azure) with 99.9% uptime SLA</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span className="text-sm text-gray-700">Complete 5-Year Infrastructure & License Cost Breakdown</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span className="text-sm text-gray-700">12 Months Comprehensive Maintenance & Support</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span className="text-sm text-gray-700">Detailed Team Composition (15 professionals with executive oversight)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span className="text-sm text-gray-700">Multiple Partnership Models (Upfront, Equity, Revenue-Based)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span className="text-sm text-gray-700">ROI Projections & Financial Analysis</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span className="text-sm text-gray-700">South African Market Contracting Rates</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={generateProposal}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileDown className="h-5 w-5 mr-2" />
            Download DHS Funding Request (Word Document)
          </Button>
          <p className="text-xs text-gray-500 text-center mt-3">
            Comprehensive 40+ page proposal with cost savings analysis, compliance framework, benefits breakdown, and complete 5-year projections
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Note:</span> This proposal reflects realistic South African contracting rates as of February 2026 and includes comprehensive security, performance optimization, DevOps resources, and enterprise-grade infrastructure costs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
