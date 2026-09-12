import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  convertInchesToTwip,
} from 'docx';

export async function generateSupplierBillingDoc() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: '🏢 Qilly Supplier Billing Strategy',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Executive Summary
          new Paragraph({
            text: 'Executive Summary',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            text: 'This document outlines the complete billing strategy for how Qilly would charge suppliers for access to the platform, including multiple pricing models, billing cycles, and implementation approach.',
            spacing: { after: 200 },
          }),

          // Current State
          new Paragraph({
            text: 'Current State',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            text: 'Status: ⚠️ NOT YET IMPLEMENTED',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'The current Qilly system includes:',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: '✅ Customer pricing (contractors pay R2,500-R200,000/month)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Supplier signup form (collects supplier information)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Supplier database structure',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '❌ NO supplier billing system',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '❌ NO supplier subscription tiers',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '❌ NO payment processing for suppliers',
            spacing: { after: 200 },
            bullet: { level: 0 },
          }),

          // Recommended Supplier Pricing Model
          new Paragraph({
            text: 'Recommended Supplier Pricing Model',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            text: 'Option 1: Freemium + Premium Tiers (RECOMMENDED)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'This model balances growth (free tier attracts suppliers) with revenue (premium features generate income).',
            spacing: { after: 200 },
          }),

          // Tier 1: FREE
          new Paragraph({
            text: 'Tier 1: FREE - R0/month',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'What Suppliers Get:',
            bold: true,
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '✅ Basic product catalog listing (up to 50 products)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Standard search visibility',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Manual price updates (weekly batch upload)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Basic analytics (monthly summary)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Email support (48-hour response time)',
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: 'Limitations:',
            bold: true,
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '⚠️ Listed after Premium suppliers in search results',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '⚠️ No API integration',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '⚠️ No real-time price updates',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '⚠️ No compliance data display',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '⚠️ No priority placement in regional searches',
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: 'Target: Small suppliers, new market entrants, testing the platform',
            italics: true,
            spacing: { after: 200 },
          }),

          // Tier 2: PROFESSIONAL
          new Paragraph({
            text: 'Tier 2: PROFESSIONAL - R2,500/month (Most Popular)',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Price: R2,500/month or R27,000/year (save 10%)',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Everything in FREE, PLUS:',
            bold: true,
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '✅ Unlimited product listings',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ API Integration (v1.0 - Basic REST API)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Real-time price updates',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Higher search ranking (appear above Free tier)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Regional province filtering',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Advanced analytics dashboard',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '  • Daily quote requests',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '  • Product popularity reports',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '  • Regional demand insights',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '✅ Phone + email support (24-hour response)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Quarterly business review calls',
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: 'Target: Medium-sized suppliers (Buco, Builders Warehouse branches)',
            italics: true,
            spacing: { after: 200 },
          }),

          // Tier 3: ENTERPRISE
          new Paragraph({
            text: 'Tier 3: ENTERPRISE - R7,500/month (DHS-Compliant)',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Price: R7,500/month or R81,000/year (save 10%)',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Everything in PROFESSIONAL, PLUS:',
            bold: true,
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '✅ API v2.0 - Government Compliance Integration',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '  • SANS 1200 compliance data',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '  • NBR (National Building Regulations) alignment',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '  • AGRÉMENT certification tracking',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '  • BBBEE status verification',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '  • POPIA compliance features',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '  • Anti-corruption verification',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '✅ PRIORITY PLACEMENT on all DHS government projects',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Premium Badge displayed on supplier profile',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Dedicated account manager',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ White-label export options',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Custom reporting & data exports',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Priority phone support (4-hour response)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Monthly optimization consulting',
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: 'Target: Large suppliers targeting government contracts (R10M-R43M annual DHS projects)',
            italics: true,
            spacing: { after: 200 },
          }),

          // Tier 4: CUSTOM
          new Paragraph({
            text: 'Tier 4: CUSTOM - R15,000-R50,000/month',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Price: Custom pricing (typically R15,000-R50,000/month)',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Everything in ENTERPRISE, PLUS:',
            bold: true,
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '✅ Multi-location management (franchises, branches across provinces)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Custom API endpoints and webhooks',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Direct ERP/inventory system integration',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Co-branded marketing materials',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Exclusive partnership agreements',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Featured supplier status',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Revenue sharing opportunities',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '✅ Joint go-to-market initiatives',
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: 'Target: National chains (Cashbuild, Builders, PPC, Lafarge), strategic partners',
            italics: true,
            spacing: { after: 200 },
          }),

          // Billing & Payment Implementation
          new Paragraph({
            text: 'Billing & Payment Implementation',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            text: 'Payment Methods',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: '1. Credit/Debit Card (Stripe or PayFast integration)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '2. EFT/Bank Transfer (manual reconciliation for large suppliers)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '3. Debit Order (recurring monthly payments)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '4. Invoice + Payment Terms (30-day terms for enterprise clients)',
            spacing: { after: 200 },
            bullet: { level: 0 },
          }),

          // Billing Cycle
          new Paragraph({
            text: 'Billing Cycle',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: '• Monthly: Default option, billed on signup date anniversary',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Annual: 10% discount, billed once per year',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Quarterly: 5% discount (optional for Professional+)',
            spacing: { after: 200 },
            bullet: { level: 0 },
          }),

          // Payment Schedule
          new Paragraph({
            text: 'Payment Schedule Example',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Day 1:  Supplier signs up → Account created (Free tier)',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Day 1:  Upgrade to Professional → R2,500 charged immediately',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Day 30: First renewal → R2,500 charged (monthly subscription)',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Day 60: Second renewal → R2,500 charged',
            spacing: { after: 200 },
          }),

          // Grace Periods
          new Paragraph({
            text: 'Grace Periods & Downgrades',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: '• 7-day grace period for failed payments',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Email reminders at Day 3 and Day 7',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Auto-downgrade to Free tier after 7 days (no account deletion)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Products remain visible but lose premium features',
            spacing: { after: 200 },
            bullet: { level: 0 },
          }),

          // Revenue Projections
          new Paragraph({
            text: 'Revenue Projections',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            text: 'Year 1 Supplier Revenue',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Assumptions: 50 suppliers by end of Year 1 (30% Free, 50% Professional, 15% Enterprise, 5% Custom)',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Breakdown:',
            bold: true,
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Free Tier:        15 suppliers × R0       = R0',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Professional:     25 suppliers × R2,500   = R62,500/month',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Enterprise:       8 suppliers  × R7,500   = R60,000/month',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Custom:           2 suppliers  × R25,000  = R50,000/month',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '                                           ─────────────',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '                                TOTAL:     R172,500/month',
            bold: true,
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '                                           R2.07M/year',
            bold: true,
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Year 3 Supplier Revenue (Scaled)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Assumptions: 300 suppliers (40% Free, 40% Professional, 15% Enterprise, 5% Custom)',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Breakdown:',
            bold: true,
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Free Tier:        120 suppliers × R0       = R0',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Professional:     120 suppliers × R2,500   = R300,000/month',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Enterprise:       45 suppliers  × R7,500   = R337,500/month',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Custom:           15 suppliers  × R30,000  = R450,000/month',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '                                            ─────────────',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '                                 TOTAL:     R1,087,500/month',
            bold: true,
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '                                            R13.05M/year',
            bold: true,
            spacing: { after: 200 },
          }),

          // Value Proposition
          new Paragraph({
            text: 'Value Proposition for Each Tier',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            text: 'Professional Tier (R2,500/month) Value',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Cost: R2,500/month (R30,000/year)',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Value Delivered:',
            bold: true,
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '• Access to 50-100 construction companies using Qilly (Year 2)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Each company prices 2-5 BOQs/month = 100-500 quote requests/month',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• If supplier wins just 2% of quotes at R50,000 average = R100,000/month in sales',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• ROI: R100,000 revenue from R2,500 investment = 40x return',
            bold: true,
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: 'Break-even: Just 1 small project win per month pays for entire year',
            italics: true,
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Enterprise Tier (R7,500/month) Value',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Cost: R7,500/month (R90,000/year)',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Value Delivered:',
            bold: true,
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '• Priority access to DHS housing projects (R10M-R43M annually)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• If supplier wins just 1 DHS project per year at 3% margin:',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '  • R10M project × 3% = R300,000 profit',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '  • Cost: R90,000/year',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '  • ROI: R300,000 profit from R90,000 investment = 3.3x return',
            bold: true,
            spacing: { after: 100 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: 'Break-even: Just 1 medium DHS project per year pays for 3+ years',
            italics: true,
            spacing: { after: 200 },
          }),

          // Implementation Roadmap
          new Paragraph({
            text: 'Implementation Roadmap',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            text: 'Phase 1: Basic Subscription System (Month 1-2)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Features:',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '• Free tier (default for all suppliers)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Professional tier upgrade option',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Manual payment processing (EFT + email invoice)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Basic tier detection in search results',
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: 'Deliverables:',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '• Supplier subscription management in Admin Dashboard',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Invoice generation',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Payment tracking spreadsheet',
            spacing: { after: 200 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: 'Phase 2: Automated Billing (Month 3-4)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Features:',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '• Stripe/PayFast integration',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Automated recurring billing',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Payment failure handling',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Auto-downgrade logic',
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: 'Deliverables:',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '• Automated monthly invoicing',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Credit card payment processing',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Supplier billing portal',
            spacing: { after: 200 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: 'Phase 3: Enterprise Features (Month 5-6)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Features:',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '• Enterprise tier with compliance API',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Custom tier with negotiations',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Revenue analytics dashboard',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Supplier success metrics',
            spacing: { after: 100 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: 'Deliverables:',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: '• API v2.0 with compliance features',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Enterprise onboarding workflow',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• Custom contract management',
            spacing: { after: 200 },
            bullet: { level: 0 },
          }),

          // Recommended Approach
          new Paragraph({
            text: 'Recommended Approach',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            text: 'Start with Freemium Model:',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Year 1: Free for all suppliers (growth focus)',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '  • Goal: Get 50-100 suppliers on platform',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '  • Build supplier catalog and data',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '  • Prove value to contractors',
            spacing: { after: 100 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: 'Year 2: Introduce Professional tier',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '  • Grandfather existing suppliers (12 months free Professional)',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '  • New suppliers: Free or R2,500/month',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '  • Goal: 30% conversion to paid',
            spacing: { after: 100 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: 'Year 3: Launch Enterprise tier',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '  • Target large suppliers and government contractors',
            spacing: { after: 50 },
            bullet: { level: 1 },
          }),

          new Paragraph({
            text: '  • Goal: 15-20% of suppliers on Enterprise',
            spacing: { after: 200 },
            bullet: { level: 1 },
          }),

          // Summary
          new Paragraph({
            text: 'Summary',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            text: 'Qilly will bill suppliers using a Freemium + Tiered Subscription model:',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: '• FREE Tier: R0/month - Basic listing for small suppliers',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• PROFESSIONAL Tier: R2,500/month - API access, analytics, priority ranking',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• ENTERPRISE Tier: R7,500/month - Government compliance, DHS priority',
            spacing: { after: 50 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: '• CUSTOM Tier: R15,000+/month - National chains, strategic partnerships',
            spacing: { after: 200 },
            bullet: { level: 0 },
          }),

          new Paragraph({
            text: 'Payment: Monthly or annual (10% discount)',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Method: Card, EFT, debit order, or invoice',
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Implementation: Coming in Year 2',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Expected Revenue: R2.07M (Year 1) → R13.05M (Year 3) → R30M (Year 5)',
            bold: true,
            spacing: { after: 200 },
          }),

          // Footer
          new Paragraph({
            text: '───────────────────────────────────────────────',
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
          }),

          new Paragraph({
            text: 'Document Version: 1.0',
            alignment: AlignmentType.CENTER,
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Last Updated: February 16, 2026',
            alignment: AlignmentType.CENTER,
            spacing: { after: 50 },
          }),

          new Paragraph({
            text: 'Status: Proposed Strategy - Awaiting Approval',
            alignment: AlignmentType.CENTER,
            italics: true,
          }),
        ],
      },
    ],
  });

  // Generate and download the document
  const blob = await Packer.toBlob(doc);
  
  // Use native browser download
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Qilly_Supplier_Billing_Strategy.docx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  
  return blob;
}