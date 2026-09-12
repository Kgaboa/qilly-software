import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, convertInchesToTwip } from 'docx';
import saveAs from 'file-saver';

export async function generatePricingPackageDoc() {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // COVER PAGE
        new Paragraph({
          children: [new TextRun({ text: '', break: 3 })],
        }),
        new Paragraph({
          text: 'QILLY',
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'Pricing Packages & Subscription Plans',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Automated BOQ Pricing for Construction Projects',
              size: 28,
              color: '0070C0',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: 'Flexible pricing based on your project volume and size',
              size: 24,
              italics: true,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: '✓ 100% Accurate Pricing  •  ✓ <5 Min Processing  •  ✓ All 9 SA Provinces',
              size: 22,
              bold: true,
              color: '00B050',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: `Generated: ${new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}`,
              size: 20,
              color: '666666',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: 'Version 1.0 • February 2026',
              size: 20,
              color: '666666',
            }),
          ],
        }),

        new Paragraph({ children: [new TextRun({ text: '', break: 1 }), new PageBreak()] }),

        // TABLE OF CONTENTS
        new Paragraph({
          text: 'Table of Contents',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 },
        }),
        new Paragraph({
          text: '1. Executive Summary',
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: '2. Pricing Models Overview',
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: '3. Volume-Based Pricing',
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: '4. Project Size-Based Pricing',
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: '5. Government Sector Pricing',
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: '6. Private Sector Pricing',
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: '7. Enterprise Solutions',
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: '8. Feature Comparison',
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: '9. ROI Calculator',
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: '10. FAQ',
          spacing: { after: 150 },
        }),

        new Paragraph({ children: [new TextRun({ text: '', break: 1 }), new PageBreak()] }),

        // EXECUTIVE SUMMARY
        new Paragraph({
          text: '1. Executive Summary',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 },
        }),
        new Paragraph({
          text: 'Qilly revolutionizes construction billing with automated BOQ pricing that delivers 100% accurate quotes in under 5 minutes. Our flexible pricing model ensures you only pay for what you use.',
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: 'Key Benefits',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 200 },
        }),
        new Paragraph({
          text: '✓ Cost Savings: 85-95% reduction in professional fees',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '✓ Time Savings: 99.9% faster than manual methods',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '✓ Accuracy: 100% guaranteed pricing with live supplier data',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '✓ Compliance: SANS 1200, NBR, BBBEE, POPIA built-in',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '✓ Multi-Supplier: 8+ major suppliers across 9 provinces',
          spacing: { after: 300 },
          bullet: { level: 0 },
        }),

        new Paragraph({
          text: 'Pricing Philosophy',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 200 },
        }),
        new Paragraph({
          text: 'Our pricing is designed to be fair, transparent, and provide immediate ROI for all customer segments.',
          spacing: { after: 200 },
        }),

        new Paragraph({ children: [new TextRun({ text: '', break: 1 }), new PageBreak()] }),

        // PRICING MODELS
        new Paragraph({
          text: '2. Pricing Models Overview',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 },
        }),

        new Paragraph({
          text: 'Model 1: Volume-Based Pricing',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 200 },
        }),
        new Paragraph({
          text: 'Pay based on how many BOQs you process each month.',
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: '• Starter: 1-10 BOQs/month - R2,500/month',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '• Professional: 11-50 BOQs/month - R8,500/month',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '• Business: 51-200 BOQs/month - R25,000/month',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '• Enterprise: 201+ BOQs/month - Custom pricing',
          spacing: { after: 300 },
          bullet: { level: 0 },
        }),

        new Paragraph({
          text: 'Model 2: Project Size-Based Pricing',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 200 },
        }),
        new Paragraph({
          text: 'Pay based on total construction project value.',
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: '• Small: <R5M - 0.08% of project value',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '• Medium: R5M-R50M - 0.05% of project value',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '• Large: R50M-R500M - 0.03% of project value',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '• Mega: R500M+ - 0.02% of project value',
          spacing: { after: 300 },
          bullet: { level: 0 },
        }),

        new Paragraph({ children: [new TextRun({ text: '', break: 1 }), new PageBreak()] }),

        // VOLUME PRICING DETAILS
        new Paragraph({
          text: '3. Volume-Based Pricing',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 },
        }),

        // STARTER
        new Paragraph({
          text: 'STARTER PLAN',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'R2,500/month', bold: true, size: 32, color: '00B050' }),
            new TextRun({ text: '  |  1-10 BOQs per month', size: 24 }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'Perfect for: Small contractors, individual QS professionals',
          spacing: { after: 200 },
          italics: true,
        }),
        new Paragraph({
          text: '✓ Multi-supplier pricing',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '✓ All 9 provinces',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '✓ SANS 1200 compliance',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '✓ Unlimited users',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Cost per BOQ: R250', bold: true, color: '0070C0' }),
          ],
          spacing: { after: 200 },
        }),

        // PROFESSIONAL
        new Paragraph({
          text: 'PROFESSIONAL PLAN',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'R8,500/month', bold: true, size: 32, color: '00B050' }),
            new TextRun({ text: '  |  11-50 BOQs per month', size: 24 }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'Perfect for: Medium contractors, QS firms, municipal departments',
          spacing: { after: 200 },
          italics: true,
        }),
        new Paragraph({
          text: 'Everything in Starter, plus:',
          spacing: { after: 150 },
          bold: true,
        }),
        new Paragraph({
          text: '✓ NBR compliance',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '✓ BBBEE tracking',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '✓ API access',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Cost per BOQ: R170', bold: true, color: '0070C0' }),
          ],
          spacing: { after: 200 },
        }),

        // BUSINESS
        new Paragraph({
          text: 'BUSINESS PLAN',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'R25,000/month', bold: true, size: 32, color: '00B050' }),
            new TextRun({ text: '  |  51-200 BOQs per month', size: 24 }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'Perfect for: Large contractors, national departments, developers',
          spacing: { after: 200 },
          italics: true,
        }),
        new Paragraph({
          text: 'Everything in Professional, plus:',
          spacing: { after: 150 },
          bold: true,
        }),
        new Paragraph({
          text: '✓ POPIA compliance',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '✓ Anti-corruption tracking',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '✓ Dedicated account manager',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Cost per BOQ: R125', bold: true, color: '0070C0' }),
          ],
          spacing: { after: 200 },
        }),

        // ENTERPRISE
        new Paragraph({
          text: 'ENTERPRISE PLAN',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Custom Pricing', bold: true, size: 32, color: '0070C0' }),
            new TextRun({ text: '  |  201+ BOQs per month', size: 24 }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'Perfect for: DHS, SOEs, large developers',
          spacing: { after: 200 },
          italics: true,
        }),
        new Paragraph({
          text: '✓ Unlimited BOQs',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '✓ Custom compliance',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '✓ 24/7 support',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),

        new Paragraph({ children: [new TextRun({ text: '', break: 1 }), new PageBreak()] }),

        // PROJECT SIZE PRICING
        new Paragraph({
          text: '4. Project Size-Based Pricing',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 },
        }),

        new Paragraph({
          text: 'SMALL PROJECTS',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '0.08%', bold: true, size: 32, color: '00B050' }),
            new TextRun({ text: '  of project value', size: 24 }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'Up to R5,000,000',
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'Example: R1M project = R800 fee',
          spacing: { after: 200 },
          bullet: { level: 0 },
        }),

        new Paragraph({
          text: 'MEDIUM PROJECTS',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '0.05%', bold: true, size: 32, color: '00B050' }),
            new TextRun({ text: '  of project value', size: 24 }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'R5M - R50M',
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'Example: R25M project = R12,500 fee',
          spacing: { after: 200 },
          bullet: { level: 0 },
        }),

        new Paragraph({
          text: 'LARGE PROJECTS',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '0.03%', bold: true, size: 32, color: '00B050' }),
            new TextRun({ text: '  of project value', size: 24 }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'R50M - R500M',
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'Example: R100M project = R30,000 fee',
          spacing: { after: 200 },
          bullet: { level: 0 },
        }),

        new Paragraph({
          text: 'MEGA PROJECTS',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '0.02%', bold: true, size: 32, color: '00B050' }),
            new TextRun({ text: '  of project value', size: 24 }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'R500M+',
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'Example: R1B project = R200,000 fee',
          spacing: { after: 200 },
          bullet: { level: 0 },
        }),

        new Paragraph({ children: [new TextRun({ text: '', break: 1 }), new PageBreak()] }),

        // GOVERNMENT PRICING
        new Paragraph({
          text: '5. Government Sector Pricing',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 },
        }),

        new Paragraph({
          text: 'NATIONAL GOVERNMENT',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          text: 'Year 1: R14.3M - R19.1M',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: 'Years 2-5: R2.7M - R3.65M/year',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: 'Total 5-Year: R25M - R33.7M',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'ROI: R31M - R196M savings', bold: true, color: '00B050' }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: 'PROVINCIAL GOVERNMENT',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          text: 'R25,000/month (Business Plan)',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: 'Or 0.03-0.05% of provincial budget',
          spacing: { after: 200 },
          bullet: { level: 0 },
        }),

        new Paragraph({
          text: 'MUNICIPAL GOVERNMENT',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          text: 'Metros: R25,000/month',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: 'Districts: R8,500/month',
          spacing: { after: 200 },
          bullet: { level: 0 },
        }),

        new Paragraph({ children: [new TextRun({ text: '', break: 1 }), new PageBreak()] }),

        // PRIVATE SECTOR
        new Paragraph({
          text: '6. Private Sector Pricing',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 },
        }),

        new Paragraph({
          text: 'CONTRACTORS',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          text: 'Small: R2,500/month (1-10 BOQs)',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: 'Medium: R8,500/month (11-50 BOQs)',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: 'Large: R25,000/month (51-200 BOQs)',
          spacing: { after: 200 },
          bullet: { level: 0 },
        }),

        new Paragraph({
          text: 'DEVELOPERS',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          text: 'Project-based pricing: 0.02% - 0.08%',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: 'Aligns with development budgets',
          spacing: { after: 200 },
          bullet: { level: 0 },
        }),

        new Paragraph({
          text: 'QS FIRMS',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        }),
        new Paragraph({
          text: 'White-label options available',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: '10x capacity increase',
          spacing: { after: 200 },
          bullet: { level: 0 },
        }),

        new Paragraph({ children: [new TextRun({ text: '', break: 1 }), new PageBreak()] }),

        // ROI CALCULATOR
        new Paragraph({
          text: '9. ROI Calculator',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 },
        }),

        new Paragraph({
          text: 'Traditional QS: R20K - R150K per BOQ',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: 'Qilly: R50 - R250 per BOQ',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Savings: 98.6% - 99.7%', bold: true, color: '00B050', size: 24 }),
          ],
          spacing: { after: 300 },
        }),

        new Paragraph({
          text: 'Time Savings',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 200 },
        }),
        new Paragraph({
          text: 'Traditional: 2-4 weeks per BOQ',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          text: 'Qilly: Under 5 minutes',
          spacing: { after: 100 },
          bullet: { level: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Time Savings: 99.9%', bold: true, color: '00B050', size: 24 }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({ children: [new TextRun({ text: '', break: 1 }), new PageBreak()] }),

        // FAQ
        new Paragraph({
          text: '10. Frequently Asked Questions',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 },
        }),

        new Paragraph({
          text: 'Q1: Can I change my plan?',
          spacing: { after: 100 },
          bold: true,
        }),
        new Paragraph({
          text: 'Yes! You can upgrade or downgrade at any time.',
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: 'Q2: Is there a free trial?',
          spacing: { after: 100 },
          bold: true,
        }),
        new Paragraph({
          text: 'Yes! All plans include a 14-day free trial.',
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: 'Q3: Do you offer annual discounts?',
          spacing: { after: 100 },
          bold: true,
        }),
        new Paragraph({
          text: 'Yes! Pay annually and save 15% on all plans.',
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: 'Q4: What payment methods?',
          spacing: { after: 100 },
          bold: true,
        }),
        new Paragraph({
          text: 'EFT, credit cards, and purchase orders for government.',
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: 'Q5: Is pricing per user?',
          spacing: { after: 100 },
          bold: true,
        }),
        new Paragraph({
          text: 'No. All plans include unlimited users.',
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: 'Q6: What is the accuracy guarantee?',
          spacing: { after: 100 },
          bold: true,
        }),
        new Paragraph({
          text: 'We guarantee 100% accurate supplier prices as of the processing date.',
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: 'Q7: Can I cancel anytime?',
          spacing: { after: 100 },
          bold: true,
        }),
        new Paragraph({
          text: 'Yes, no long-term contracts required.',
          spacing: { after: 400 },
        }),

        // CONTACT
        new Paragraph({
          text: 'READY TO GET STARTED?',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200, before: 300 },
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: 'Start your 14-day free trial today',
          spacing: { after: 200 },
          alignment: AlignmentType.CENTER,
        }),

        new Paragraph({
          text: 'Email: sales@qilly.co.za',
          spacing: { after: 100 },
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: 'Phone: +27 (0)11 123 4567',
          spacing: { after: 100 },
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: 'Website: www.qilly.co.za',
          spacing: { after: 300 },
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Qilly_Pricing_Packages_${new Date().toISOString().split('T')[0]}.docx`);
}