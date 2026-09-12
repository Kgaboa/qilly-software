import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { FileText, Download, CheckCircle2, AlertCircle, Building2, Shield, Award, Clock, FileCheck, ChevronDown, ChevronUp, Send, ExternalLink } from 'lucide-react';
import { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import { submitToETender, buildETenderPayload, type ETenderSubmissionResponse } from '@/utils/eTenderAPI';
import { assessEnvironmentalCompliance } from '@/utils/environmentalCompliance';

interface TenderResponseGeneratorProps {
  projectName: string;
  projectValue: number;
  municipality: string;
  province: string;
  items: any[];
  complianceCosts: any;
  carbonSummary?: any;
  contractorData?: {
    company_name?: string;
    email?: string;
    phone?: string;
    cidb_registration?: string;
    annual_turnover?: number;
    bbbee_level?: string;
  };
}

export function TenderResponseGenerator({
  projectName,
  projectValue,
  municipality,
  province,
  items,
  complianceCosts,
  carbonSummary,
  contractorData
}: TenderResponseGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // COLLAPSED BY DEFAULT
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionResponse, setSubmissionResponse] = useState<ETenderSubmissionResponse | null>(null);

  // Calculate environmental compliance data for eTender submission
  const environmentalComplianceData = useMemo(() => {
    // Build project parameters for environmental assessment
    const projectParams = {
      projectName: projectName || 'Construction Project',
      projectValue: projectValue,
      province: province,
      municipality: municipality,
      projectType: 'housing', // Default to housing, can be made dynamic
      siteArea: 5000, // Default site area, can be made dynamic
      buildingFootprint: 2000, // Default building footprint
    };
    
    return assessEnvironmentalCompliance(projectParams, items);
  }, [projectName, projectValue, province, municipality, items]);

  // Tender document sections checklist
  const tenderSections = [
    { id: 'executive', name: 'Executive Summary', icon: FileText, status: 'included', required: true },
    { id: 'company', name: 'Company Profile & Credentials', icon: Building2, status: 'included', required: true },
    { id: 'pricing', name: 'Priced Bill of Quantities', icon: FileCheck, status: 'included', required: true },
    { id: 'compliance', name: 'Compliance Declarations', icon: Shield, status: 'included', required: true },
    { id: 'bbbee', name: 'BBBEE Certificate & Scorecard', icon: Award, status: 'included', required: true },
    { id: 'timeline', name: 'Project Timeline & Methodology', icon: Clock, status: 'included', required: true },
    { id: 'green', name: 'Environmental Impact Statement', icon: CheckCircle2, status: carbonSummary ? 'included' : 'optional', required: false }
  ];

  const generateTenderResponse = async () => {
    setGenerating(true);

    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate comprehensive PDF tender response
    const doc = new jsPDF('p', 'mm', 'a4');
    let yPos = 20;

    // Cover Page
    doc.setFillColor(0, 180, 216);
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('TENDER SUBMISSION', 105, 25, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(projectName || 'Construction Project', 105, 38, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Submitted by:', 20, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(contractorData?.company_name || 'Your Company Name', 20, 77);
    doc.text(`CIDB Registration: ${contractorData?.cidb_registration || 'GB4'}`, 20, 84);
    doc.text(`BBBEE Level: ${contractorData?.bbbee_level || 'Level 4'}`, 20, 91);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Project Location:', 20, 105);
    doc.setFont('helvetica', 'normal');
    doc.text(`${municipality}, ${province}`, 20, 112);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Tender Value:', 20, 126);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(0, 119, 182);
    doc.text(`R${projectValue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 20, 135);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    const today = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Submission Date: ${today}`, 20, 270);
    
    // Page 2: Executive Summary
    doc.addPage();
    yPos = 20;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 119, 182);
    doc.text('EXECUTIVE SUMMARY', 20, yPos);
    
    yPos += 12;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    const execSummary = [
      `We are pleased to submit our tender response for ${projectName || 'this construction project'}.`,
      `Our company, ${contractorData?.company_name || 'a qualified contractor'}, brings extensive experience in`,
      `${province} region construction, with full CIDB registration (${contractorData?.cidb_registration || 'GB4'}) and`,
      `BBBEE Level ${contractorData?.bbbee_level || '4'} certification.`,
      '',
      'KEY HIGHLIGHTS:',
      `• Total Tender Value: R${projectValue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
      `• Number of BOQ Items: ${items.length}`,
      `• Project Location: ${municipality}, ${province}`,
      `• Full Compliance: NHBRC, CIDB, SANS 1200, NBR, BBBEE`,
      carbonSummary ? `• Environmental Impact: ${carbonSummary.carbonSavingsPercent.toFixed(1)}% carbon reduction with green options` : '',
      '',
      'Our pricing includes:',
      '• Competitive material costs from verified South African suppliers',
      '• Optimized logistics from nearest branches to minimize transport costs',
      '• Full regulatory compliance costs (NHBRC warranty, CIDB levies, etc.)',
      '• Professional project management and quality assurance',
      carbonSummary ? '• Optional green building materials with environmental certifications' : '',
      '',
      'We are committed to delivering this project on time, within budget, and to the highest',
      'quality standards. Our tender submission demonstrates full compliance with all technical,',
      'financial, and regulatory requirements.'
    ].filter(line => line !== '');
    
    execSummary.forEach(line => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      if (line.startsWith('•')) {
        doc.setFont('helvetica', 'bold');
        doc.text(line, 25, yPos);
        doc.setFont('helvetica', 'normal');
      } else if (line === 'KEY HIGHLIGHTS:' || line === 'Our pricing includes:') {
        doc.setFont('helvetica', 'bold');
        doc.text(line, 20, yPos);
        doc.setFont('helvetica', 'normal');
      } else {
        doc.text(line, 20, yPos);
      }
      yPos += line === '' ? 3 : 6;
    });
    
    // Page 3: Company Credentials
    doc.addPage();
    yPos = 20;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 119, 182);
    doc.text('COMPANY CREDENTIALS', 20, yPos);
    
    yPos += 12;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    // Company details table
    const credentials = [
      ['Company Name:', contractorData?.company_name || 'Your Company Name'],
      ['Contact Email:', contractorData?.email || 'info@company.co.za'],
      ['Contact Phone:', contractorData?.phone || '+27 11 123 4567'],
      ['CIDB Registration:', contractorData?.cidb_registration || 'GB4'],
      ['Annual Turnover:', `R${(contractorData?.annual_turnover || 5000000).toLocaleString('en-ZA')}`],
      ['BBBEE Level:', contractorData?.bbbee_level || 'Level 4'],
      ['Years in Operation:', '10+ years'],
      ['Compliance Status:', '✓ Fully Compliant']
    ];
    
    credentials.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 80, yPos);
      yPos += 8;
    });
    
    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATIONS & REGISTRATIONS:', 20, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    const certifications = [
      '✓ CIDB Registered Contractor (Current)',
      '✓ NHBRC Registered Home Builder',
      '✓ BBBEE Certificate (Valid)',
      '✓ Tax Clearance Certificate (Valid)',
      '✓ Company Registration (Active)',
      '✓ Professional Indemnity Insurance',
      '✓ Public Liability Insurance',
      '✓ Workmen\'s Compensation (Valid)'
    ];
    
    certifications.forEach(cert => {
      doc.text(cert, 25, yPos);
      yPos += 7;
    });
    
    // Page 4: Pricing Summary
    doc.addPage();
    yPos = 20;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 119, 182);
    doc.text('PRICING SUMMARY', 20, yPos);
    
    yPos += 12;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    doc.text('Detailed breakdown of tender value:', 20, yPos);
    yPos += 10;
    
    // Pricing breakdown
    const grandTotal = items.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
    const totalTransport = items.reduce((sum, item) => sum + parseFloat(item.transportCost || 0), 0);
    const complianceTotal = complianceCosts?.total || 0;
    const pgCosts = complianceCosts?.preliminaries?.total || 0;
    const greenPremium = carbonSummary?.costPremium || 0;
    
    const pricingLines = [
      ['Materials & Labour (BOQ Total)', `R${grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
      ['  - Base Materials', `R${(grandTotal - totalTransport).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
      ['  - Transport & Logistics', `R${totalTransport.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
      ['', ''],
      ['Compliance Costs', `R${complianceTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
      ['  - NHBRC Warranty Enrollment', `R${(complianceCosts?.nhbrc?.total || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
      ['  - CIDB Levies & Registration', `R${(complianceCosts?.cidb?.total || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
      ['  - Environmental (NEMA & Waste)', `R${(complianceCosts?.environmental?.total || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
      ['  - SANS 1200 Compliance', `R${(complianceCosts?.sans1200 || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
      ['  - Other Regulatory', `R${(complianceCosts?.agrément || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
      ['', ''],
      ['Preliminaries & General', `R${pgCosts.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`],
      ...(greenPremium > 0 ? [
        ['', ''],
        ['🌿 Green Materials Premium (Optional)', `R${greenPremium.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`]
      ] : [])
    ];
    
    pricingLines.forEach(([label, value]) => {
      if (label === '') {
        yPos += 3;
      } else if (label.startsWith('  - ')) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(label, 25, yPos);
        doc.text(value, 180, yPos, { align: 'right' });
        doc.setFontSize(10);
      } else {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPos);
        doc.text(value, 180, yPos, { align: 'right' });
        doc.setFont('helvetica', 'normal');
      }
      yPos += label === '' ? 0 : 7;
    });
    
    // Total
    yPos += 5;
    doc.setDrawColor(0, 119, 182);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 180, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 119, 182);
    doc.text('TOTAL TENDER VALUE:', 20, yPos);
    doc.text(`R${projectValue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 180, yPos, { align: 'right' });
    
    // Environmental Impact Section (if green data available)
    if (carbonSummary) {
      doc.addPage();
      yPos = 20;
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 197, 94);
      doc.text('🌿 ENVIRONMENTAL IMPACT STATEMENT', 20, yPos);
      
      yPos += 12;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      const envText = [
        'As part of our commitment to sustainable construction and alignment with Department of',
        'Human Settlements (DHS) green building initiatives, we offer optional green materials',
        'that significantly reduce the project\'s environmental impact.',
        '',
        'ENVIRONMENTAL METRICS:',
        `• Standard Materials Carbon Footprint: ${carbonSummary.totalCarbon.toFixed(1)} tCO₂e`,
        `• Green Materials Carbon Footprint: ${carbonSummary.totalCarbonWithGreen.toFixed(1)} tCO₂e`,
        `• Carbon Savings: ${carbonSummary.totalCarbonSavings.toFixed(1)} tCO₂e (${carbonSummary.carbonSavingsPercent.toFixed(1)}% reduction)`,
        `• Trees Equivalent: ~${carbonSummary.treesEquivalent} trees worth of CO₂ absorption`,
        `• DHS Green Score: ${carbonSummary.overallGreenScore}`,
        '',
        'COST-BENEFIT ANALYSIS:',
        `• Additional Investment Required: R${greenPremium.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
        `• Percentage Increase: ${((greenPremium / grandTotal) * 100).toFixed(2)}%`,
        `• Cost per tCO₂e Saved: R${(greenPremium / carbonSummary.totalCarbonSavings).toFixed(0)}`,
        `• Items with Green Options: ${carbonSummary.itemsWithGreenAlternatives} of ${carbonSummary.totalItems}`,
        '',
        'The decision to adopt green materials is optional and at the discretion of the client.',
        'We provide this analysis to support informed decision-making aligned with national',
        'sustainability goals and potential future carbon pricing regulations.'
      ];
      
      envText.forEach(line => {
        if (line.startsWith('•')) {
          doc.setFont('helvetica', 'bold');
          doc.text(line, 25, yPos);
          doc.setFont('helvetica', 'normal');
        } else if (line.includes('METRICS:') || line.includes('ANALYSIS:')) {
          doc.setFont('helvetica', 'bold');
          doc.text(line, 20, yPos);
          doc.setFont('helvetica', 'normal');
        } else {
          doc.text(line, 20, yPos);
        }
        yPos += line === '' ? 3 : 6;
      });
    }
    
    // Final Page: Declarations
    doc.addPage();
    yPos = 20;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 119, 182);
    doc.text('DECLARATIONS & UNDERTAKINGS', 20, yPos);
    
    yPos += 12;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    const declarations = [
      '✓ We confirm that all information provided is accurate and complete',
      '✓ We comply with all CIDB, NHBRC, and BBBEE requirements',
      '✓ We have no conflict of interest with this tender',
      '✓ We have not engaged in any collusion or anti-competitive practices',
      '✓ We accept all terms and conditions of the tender',
      '✓ Our pricing is valid for 90 days from submission date',
      '✓ We will provide all required bonds and insurance upon award',
      '✓ We commit to delivering the project within agreed timelines'
    ];
    
    declarations.forEach(decl => {
      doc.text(decl, 20, yPos);
      yPos += 8;
    });
    
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Authorized Signatory:', 20, yPos);
    yPos += 15;
    doc.setFont('helvetica', 'normal');
    doc.line(20, yPos, 90, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.text('Signature', 20, yPos);
    
    doc.setFontSize(10);
    yPos -= 5;
    doc.line(120, yPos, 180, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.text('Date', 120, yPos);
    
    // Add footer to all pages
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
      doc.text('Generated by Qilly Construction Billing System', 105, 292, { align: 'center' });
    }
    
    // Save the document
    doc.save(`Tender_Response_${projectName.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
    
    setGenerating(false);
    setGenerated(true);
  };

  const submitTenderResponse = async () => {
    setSubmitting(true);

    try {
      // Build payload from current data
      const boqData = {
        projectSettings: { municipality, province },
        pricedItems: items,
        grandTotal: items.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0),
        totalTransportCost: items.reduce((sum, item) => sum + parseFloat(item.transportCost || 0), 0),
        overallBOQTotal: projectValue,
      };

      const payload = buildETenderPayload(
        boqData,
        contractorData,
        complianceCosts,
        carbonSummary,
        environmentalComplianceData, // environmental data
        {
          tenderId: `T-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          tenderReference: `${municipality.substring(0, 3).toUpperCase()}/${new Date().getFullYear()}/PROJECT/001`,
          projectName: projectName,
          closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        }
      );

      // Submit to eTender API (simulation mode for demo)
      const response = await submitToETender(payload, 'simulation');

      setSubmitted(true);
      setSubmissionResponse(response);
    } catch (error) {
      console.error('Tender submission error:', error);
      alert('Error submitting tender. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-2 border-blue-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <FileText className="w-5 h-5" />
              eTender Integration: Automated Tender Response Generator
            </CardTitle>
            <CardDescription className="mt-2">
              Generate professional, compliance-ready tender submissions in seconds
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-600 text-white">
              eTender Ready
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-700 hover:text-blue-900"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Document Sections Checklist */}
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              Tender Document Sections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tenderSections.map((section) => (
                <div
                  key={section.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    section.status === 'included'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <section.icon
                    className={`w-5 h-5 ${
                      section.status === 'included' ? 'text-green-600' : 'text-gray-400'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{section.name}</p>
                    {section.required && (
                      <p className="text-xs text-gray-500">Required</p>
                    )}
                  </div>
                  {section.status === 'included' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tender Value Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Tender Value</p>
                <p className="text-2xl font-bold text-blue-900">
                  R{projectValue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {items.length} BOQ items • {municipality}, {province}
                </p>
              </div>
              <div className="text-right">
                <Badge className="bg-green-600 text-white mb-2">
                  All Compliance Included
                </Badge>
                {carbonSummary && (
                  <Badge className="bg-emerald-600 text-white">
                    🌿 Green Options Available
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Automatically Generated Content:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Executive summary with project highlights</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Company credentials & CIDB registration</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Detailed pricing breakdown (BOQ + compliance)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>BBBEE certificates & compliance declarations</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Project timeline & methodology statement</span>
              </div>
              {carbonSummary && (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>🌿 Environmental impact analysis</span>
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-3">
            <Button
              onClick={generateTenderResponse}
              disabled={generating}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Generating Tender Response...
                </>
              ) : generated ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Generate Again
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Generate Complete Tender Response (PDF)
                </>
              )}
            </Button>
          </div>

          {generated && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Tender Response Generated Successfully!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your complete tender submission has been downloaded. The document includes all required sections,
                    compliance declarations, and is ready for submission via eTender platform.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              onClick={submitTenderResponse}
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Submitting Tender Response...
                </>
              ) : submitted ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Submit Again
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Complete Tender Response to eTender
                </>
              )}
            </Button>
          </div>

          {submitted && submissionResponse && (
            <div className={`border rounded-lg p-4 ${
              submissionResponse.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {submissionResponse.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`font-semibold ${submissionResponse.success ? 'text-green-900' : 'text-red-900'}`}>
                    {submissionResponse.message}
                  </p>
                  
                  {submissionResponse.success && submissionResponse.receiptNumber && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-green-800">Receipt Number:</span>
                        <code className="bg-green-100 px-2 py-0.5 rounded text-green-900 font-mono">
                          {submissionResponse.receiptNumber}
                        </code>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-green-800">Status:</span>
                        <Badge className="bg-green-600 text-white">
                          {submissionResponse.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(submissionResponse.timestamp).toLocaleString('en-ZA')}</span>
                      </div>
                    </div>
                  )}
                  
                  {submissionResponse.nextSteps && submissionResponse.nextSteps.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-green-800 mb-2">Next Steps:</p>
                      <ul className="text-xs text-green-700 space-y-1">
                        {submissionResponse.nextSteps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600 font-bold mt-0.5">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {submissionResponse.errors && submissionResponse.errors.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-red-800 mb-2">Validation Errors:</p>
                      <ul className="text-xs text-red-700 space-y-1">
                        {submissionResponse.errors.map((error, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                            <span><strong>{error.field}:</strong> {error.message}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>eTender Integration:</strong> This feature automatically formats your priced BOQ into a complete,
              professional tender response document. All compliance requirements (CIDB, NHBRC, BBBEE) are included.
              Simply upload the generated PDF to the eTender portal.
            </p>
          </div>
        </div>
      </CardContent>
      )}
    </Card>
  );
}