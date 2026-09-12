import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import saveAs from 'file-saver';
import { FileDown, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { createComplianceFeaturesSection } from './ComplianceFeaturesSection';

export function ComplianceDocumentGenerator() {
  
  const generateComplianceDocument = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Cover Page
          new Paragraph({
            text: "QILLY - DHS CONSTRUCTION COMPLIANCE FEATURES",
            heading: HeadingLevel.TITLE,
            spacing: { after: 200 },
            alignment: 1, // CENTER
          }),
          
          new Paragraph({
            text: "Technical Feasibility Analysis",
            spacing: { after: 400 },
            alignment: 1, // CENTER
          }),
          
          new Paragraph({
            text: "Department of Human Settlements",
            spacing: { after: 200 },
            bold: true,
            alignment: 1, // CENTER
          }),
          
          new Paragraph({
            text: "SANS 1200 • NBR • AGRÉMENT • POPIA • BBBEE • PFMA/MFMA",
            spacing: { after: 600 },
            alignment: 1, // CENTER
          }),
          
          new Paragraph({
            text: "February 2026",
            spacing: { after: 400 },
            alignment: 1, // CENTER
          }),
          
          // Compliance Features Content
          ...createComplianceFeaturesSection(),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Qilly_DHS_Compliance_Features.docx");
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-600" />
          DHS Compliance Features Document
        </CardTitle>
        <CardDescription>
          Standalone document detailing all 6 construction compliance features (SANS 1200, NBR, AGRÉMENT, POPIA, BBBEE, PFMA/MFMA)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white/70 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 mb-2">Document Contents:</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>✓ Technical feasibility analysis for all 6 features</li>
              <li>✓ Implementation stages (Supplier, BOQ, System-Wide)</li>
              <li>✓ Detailed feature descriptions with examples</li>
              <li>✓ 3-year implementation roadmap</li>
              <li>✓ Cost breakdown (R1.14M - R1.63M)</li>
              <li>✓ ROI analysis (77x-377x return)</li>
              <li>✓ DHS-specific value proposition</li>
            </ul>
          </div>
          
          <Button 
            onClick={generateComplianceDocument}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download Compliance Features Document (Word)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}