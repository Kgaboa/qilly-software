import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Progress } from '@/app/components/ui/progress';
import jsPDF from 'jspdf';
import {
  ShieldAlert,
  Leaf,
  Trash2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingDown,
  Download,
  MapPin,
  Scale,
  Recycle,
  TreePine,
} from 'lucide-react';
import {
  assessEnvironmentalCompliance,
  generateEMPTemplate,
  assessProvincialCompliance,
  getProvincialRequirements,
  type ComplianceStatus,
  type EnvironmentalRisk,
  type WasteEstimate,
} from '@/utils/environmentalCompliance';

interface EnvironmentalComplianceDashboardProps {
  projectParams: {
    projectName?: string;
    projectType: string;
    siteArea: number;
    buildingFootprint: number;
    excavationVolume?: number;
    isProtectedArea?: boolean;
    isUrbanArea?: boolean;
    hasWatercourse?: boolean;
    watercourseDistance?: number;
    hasHeritageProximity?: boolean;
    requiresRezoning?: boolean;
    province: string;
    municipality?: string;
  };
  pricedItems: any[];
  onClose?: () => void;
}

export function EnvironmentalComplianceDashboard({
  projectParams,
  pricedItems,
  onClose,
}: EnvironmentalComplianceDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate compliance status
  const complianceStatus = useMemo(() => {
    return assessEnvironmentalCompliance(projectParams, pricedItems);
  }, [projectParams, pricedItems]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Low': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'Medium': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'High': return <ShieldAlert className="w-5 h-5 text-orange-600" />;
      case 'Critical': return <ShieldAlert className="w-5 h-5 text-red-600" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const handleDownloadEMP = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;
      
      // Helper function to add text with word wrap
      const addText = (text: string, x: number, fontSize: number = 10, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        const lines = doc.splitTextToSize(text, 170);
        lines.forEach((line: string) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, x, yPos);
          yPos += fontSize * 0.4;
        });
        yPos += 3;
      };
      
      // Title Page
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 100, 0);
      doc.text('ENVIRONMENTAL MANAGEMENT PLAN', 105, 40, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(projectParams.projectName || 'Construction Project', 105, 55, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`${projectParams.municipality || ''}, ${projectParams.province}`, 105, 65, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleDateString('en-ZA')}`, 105, 75, { align: 'center' });
      
      // Compliance Status Box
      yPos = 95;
      doc.setFillColor(240, 248, 255);
      doc.rect(20, yPos, 170, 40, 'F');
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      yPos += 10;
      doc.text('Environmental Compliance Status', 25, yPos);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Overall Risk: ${complianceStatus.overallRisk}`, 25, yPos);
      doc.text(`Compliance Score: ${complianceStatus.complianceScore}/100`, 110, yPos);
      yPos += 6;
      doc.text(`NEMA Compliant: ${complianceStatus.nemaCompliant ? 'Yes' : 'No'}`, 25, yPos);
      doc.text(`Waste Compliant: ${complianceStatus.wasteCompliant ? 'Yes' : 'No'}`, 110, yPos);
      yPos += 6;
      doc.text(`Timeline Delay: ${complianceStatus.estimatedTimelineDelay} days`, 25, yPos);
      doc.text(`Compliance Cost: R${complianceStatus.estimatedComplianceCost.toLocaleString()}`, 110, yPos);
      
      // Section 1: NEMA Authorization Requirements
      doc.addPage();
      yPos = 20;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 100, 0);
      doc.text('1. NEMA AUTHORIZATION REQUIREMENTS', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      if (complianceStatus.authorizationsRequired.length === 0) {
        addText('No NEMA authorizations required for this project.', 20);
      } else {
        addText(`${complianceStatus.authorizationsRequired.length} NEMA listed activities triggered:`, 20, 10, true);
        complianceStatus.authorizationsRequired.forEach((activity, idx) => {
          addText(`${idx + 1}. ${activity.listingNotice} - ${activity.activityNumber}`, 25, 10, true);
          addText(`Description: ${activity.description}`, 30);
          addText(`Authorization Type: ${activity.authorizationType}`, 30);
          addText(`Competent Authority: ${activity.competentAuthority}`, 30);
          addText(`Estimated Timeframe: ${activity.estimatedTimeframe} days`, 30);
        });
      }
      
      // Section 2: Waste Management Plan
      doc.addPage();
      yPos = 20;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 100, 0);
      doc.text('2. CONSTRUCTION WASTE MANAGEMENT PLAN', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      if (complianceStatus.wasteEstimates.length === 0) {
        addText('No waste data available.', 20);
      } else {
        complianceStatus.wasteEstimates.forEach((waste, idx) => {
          addText(`${idx + 1}. ${waste.category}`, 20, 10, true);
          addText(`Volume: ${waste.estimatedVolume.toFixed(2)} ${waste.unit}`, 25);
          addText(`Disposal Method: ${waste.disposalMethod}`, 25);
          addText(`Recycling Potential: ${waste.recyclingPotential.toFixed(0)}%`, 25);
          addText(`Disposal Cost: R${waste.estimatedCost.toLocaleString()}`, 25);
          addText(`SAWIC Code: ${waste.sawicClassification}`, 25);
          addText(`Licensed Contractors: ${waste.licensedContractors.slice(0, 2).join(', ')}`, 25);
          yPos += 2;
        });
      }
      
      // Section 3: Environmental Risks & Mitigation
      doc.addPage();
      yPos = 20;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 100, 0);
      doc.text('3. ENVIRONMENTAL RISKS & MITIGATION', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      if (complianceStatus.environmentalRisks.length === 0) {
        addText('No significant environmental risks identified.', 20);
      } else {
        complianceStatus.environmentalRisks.forEach((risk, idx) => {
          addText(`${idx + 1}. ${risk.description}`, 20, 10, true);
          addText(`Category: ${risk.category} | Risk Level: ${risk.level}`, 25);
          addText(`Mitigation: ${risk.mitigation}`, 25);
          if (risk.estimatedCost) {
            addText(`Estimated Cost: R${risk.estimatedCost.toLocaleString()}`, 25);
          }
          if (risk.timelineImpact) {
            addText(`Timeline Impact: ${risk.timelineImpact} days`, 25);
          }
          yPos += 2;
        });
      }
      
      // Section 4: Recommended Actions
      doc.addPage();
      yPos = 20;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 100, 0);
      doc.text('4. RECOMMENDED ACTIONS', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      if (complianceStatus.recommendedActions.length === 0) {
        addText('No special actions required. Maintain standard construction site practices.', 20);
      } else {
        complianceStatus.recommendedActions.forEach((action, idx) => {
          addText(`${idx + 1}. ${action}`, 20);
        });
      }
      
      // Section 5: Roles & Responsibilities
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('ROLES & RESPONSIBILITIES', 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const roles = [
        'Site Agent: Overall environmental compliance on site',
        'Environmental Control Officer (ECO): Monitor compliance with EMP',
        'Waste Contractor: Manage waste disposal and recycling',
        'Environmental Consultant: Provide specialist advice and authorization support'
      ];
      roles.forEach(role => {
        addText(`• ${role}`, 25);
      });
      
      // Section 6: Emergency Contacts
      yPos += 5;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('EMERGENCY CONTACTS', 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      addText(`Provincial Environmental Department: ${projectParams.province} Environmental Affairs`, 25);
      addText('National Environmental Emergency: 0800 205 005', 25);
      addText('Fire & Rescue: 10177', 25);
      addText('Ambulance: 10177', 25);
      
      // Footer on all pages
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
        doc.text('Generated by Qilly - Environmental Compliance Module', 105, 292, { align: 'center' });
      }
      
      // Save the PDF
      doc.save(`EMP_${projectParams.projectName || 'Project'}_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating EMP PDF:', error);
      alert('Error generating EMP PDF. Please try again.');
    }
  };

  const totalWasteCost = complianceStatus.wasteEstimates.reduce((sum, w) => sum + w.estimatedCost, 0);
  const avgRecyclingPotential = complianceStatus.wasteEstimates.reduce((sum, w) => sum + w.recyclingPotential, 0) / 
    (complianceStatus.wasteEstimates.length || 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Leaf className="w-7 h-7 text-green-600" />
            Environmental Compliance Assessment
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            NEMA, Waste Management & Environmental Authorization Analysis
          </p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Overall Compliance Score */}
      <Card className={`border-2 ${getRiskColor(complianceStatus.overallRisk)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getRiskIcon(complianceStatus.overallRisk)}
                Overall Environmental Risk: {complianceStatus.overallRisk}
              </CardTitle>
              <CardDescription className="mt-2">
                Compliance Score: {complianceStatus.complianceScore}/100
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {complianceStatus.complianceScore}
              </div>
              <div className="text-xs text-gray-600">/ 100</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={complianceStatus.complianceScore} className="h-3" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              {complianceStatus.nemaCompliant ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-orange-600" />
              )}
              <div>
                <div className="text-xs text-gray-600">NEMA Status</div>
                <div className="font-semibold">
                  {complianceStatus.nemaCompliant ? 'Compliant' : `${complianceStatus.authorizationsRequired.length} Authorizations Required`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xs text-gray-600">Timeline Impact</div>
                <div className="font-semibold">
                  {complianceStatus.estimatedTimelineDelay > 0 
                    ? `+${complianceStatus.estimatedTimelineDelay} days`
                    : 'No delays'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-xs text-gray-600">Compliance Costs</div>
                <div className="font-semibold">
                  R{complianceStatus.estimatedComplianceCost.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nema">NEMA Authorization</TabsTrigger>
          <TabsTrigger value="waste">Waste Management</TabsTrigger>
          <TabsTrigger value="actions">Recommended Actions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Environmental Risks Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {complianceStatus.environmentalRisks.length === 0 ? (
                <Alert className="bg-green-50 border-green-300">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>No Significant Environmental Risks Identified</AlertTitle>
                  <AlertDescription>
                    This project appears to have minimal environmental compliance requirements.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {complianceStatus.environmentalRisks.map((risk, idx) => (
                    <Card key={idx} className={`border ${getRiskColor(risk.level)}`}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          {getRiskIcon(risk.level)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getRiskColor(risk.level)}>
                                {risk.category}
                              </Badge>
                              <Badge variant="outline">{risk.level} Risk</Badge>
                            </div>
                            <h4 className="font-semibold text-sm mb-1">{risk.description}</h4>
                            <p className="text-xs text-gray-600 mb-2">
                              <strong>Mitigation:</strong> {risk.mitigation}
                            </p>
                            {risk.estimatedCost && (
                              <div className="flex gap-4 text-xs">
                                {risk.estimatedCost > 0 && (
                                  <span className="text-orange-700">
                                    Cost: R{risk.estimatedCost.toLocaleString()}
                                  </span>
                                )}
                                {risk.timelineImpact && (
                                  <span className="text-blue-700">
                                    Timeline: +{risk.timelineImpact} days
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold">{complianceStatus.authorizationsRequired.length}</div>
                  <div className="text-xs text-gray-600">NEMA Authorizations</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Trash2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">{complianceStatus.wasteEstimates.length}</div>
                  <div className="text-xs text-gray-600">Waste Categories</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Recycle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">{avgRecyclingPotential.toFixed(0)}%</div>
                  <div className="text-xs text-gray-600">Recycling Potential</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingDown className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">R{totalWasteCost.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Waste Disposal Cost</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NEMA Authorization Tab */}
        <TabsContent value="nema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                NEMA Listed Activities Assessment
              </CardTitle>
              <CardDescription>
                National Environmental Management Act (Act 107 of 1998) - 2014 Listing Notices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complianceStatus.authorizationsRequired.length === 0 ? (
                <Alert className="bg-green-50 border-green-300">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>No NEMA Authorizations Required</AlertTitle>
                  <AlertDescription>
                    This project does not trigger any NEMA listed activities based on current parameters.
                    You may proceed without environmental authorization.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <Alert className="bg-orange-50 border-orange-300">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertTitle>Environmental Authorization Required</AlertTitle>
                    <AlertDescription>
                      This project triggers {complianceStatus.authorizationsRequired.length} NEMA listed {complianceStatus.authorizationsRequired.length === 1 ? 'activity' : 'activities'}. 
                      You must obtain authorization before commencing construction.
                    </AlertDescription>
                  </Alert>

                  {complianceStatus.authorizationsRequired.map((activity, idx) => (
                    <Card key={idx} className="border-2 border-orange-200 bg-orange-50">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Badge className="bg-orange-600 text-white mb-2">
                              {activity.listingNotice} - {activity.activityNumber}
                            </Badge>
                            <h4 className="font-semibold">{activity.description}</h4>
                          </div>
                          <Badge variant="outline" className="border-orange-400 text-orange-700">
                            {activity.authorizationType}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Trigger Threshold</div>
                            <div className="font-medium">{activity.triggerThreshold}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Competent Authority</div>
                            <div className="font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {activity.competentAuthority}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Estimated Timeframe</div>
                            <div className="font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.estimatedTimeframe} days
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 p-3 bg-white rounded border border-orange-200">
                          <div className="text-xs font-semibold text-gray-700 mb-1">What You Need to Do:</div>
                          <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                            <li>Appoint an independent Environmental Assessment Practitioner (EAP)</li>
                            <li>Submit application to {activity.competentAuthority} {activity.competentAuthority === 'Provincial' ? `(${projectParams.province})` : ''}</li>
                            <li>Allow {activity.estimatedTimeframe} days for authorization process</li>
                            <li>Budget R{activity.authorizationType === 'EIA' ? '200,000 - 500,000' : '50,000 - 150,000'} for assessment costs</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Waste Management Tab */}
        <TabsContent value="waste" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Construction Waste Management Plan
              </CardTitle>
              <CardDescription>
                Waste Act (Act 59 of 2008) & SAWIC Reporting Requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complianceStatus.wasteEstimates.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>No Waste Data Available</AlertTitle>
                  <AlertDescription>
                    Unable to calculate waste estimates. Ensure BOQ items are properly loaded.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Total Waste Volume</div>
                      <div className="text-xl font-bold">
                        {complianceStatus.wasteEstimates
                          .reduce((sum, w) => sum + w.estimatedVolume, 0)
                          .toFixed(2)} units
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Average Recycling Potential</div>
                      <div className="text-xl font-bold text-green-600">
                        {avgRecyclingPotential.toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Total Disposal Cost</div>
                      <div className="text-xl font-bold text-orange-600">
                        R{totalWasteCost.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Waste Categories */}
                  {complianceStatus.wasteEstimates.map((waste, idx) => (
                    <Card key={idx} className="border border-gray-200">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Recycle className="w-4 h-4 text-green-600" />
                              {waste.category}
                            </h4>
                            <div className="flex gap-3 mt-2 text-sm">
                              <Badge variant="outline">SAWIC: {waste.sawicClassification}</Badge>
                              <Badge variant="outline">{waste.disposalMethod}</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Estimated Volume</div>
                            <div className="font-semibold">
                              {waste.estimatedVolume.toFixed(2)} {waste.unit}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Recycling Potential</div>
                            <div className="font-semibold text-green-600">
                              {waste.recyclingPotential.toFixed(0)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Disposal Cost</div>
                            <div className="font-semibold text-orange-600">
                              R{waste.estimatedCost.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Potential Savings</div>
                            <div className="font-semibold text-blue-600">
                              R{((waste.estimatedCost * waste.recyclingPotential) / 100).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded border border-blue-200">
                          <div className="text-xs font-semibold text-blue-900 mb-1">
                            Licensed Waste Contractors ({projectParams.province}):
                          </div>
                          <div className="text-xs text-blue-800">
                            {waste.licensedContractors.slice(0, 3).join(' • ')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Waste Reduction Tips */}
                  <Alert className="bg-green-50 border-green-300">
                    <TreePine className="h-4 w-4 text-green-600" />
                    <AlertTitle>Waste Minimization Opportunities</AlertTitle>
                    <AlertDescription>
                      <ul className="text-sm space-y-1 mt-2 ml-4 list-disc">
                        <li>Target 60% recycling rate to save up to R{(totalWasteCost * 0.6).toLocaleString()}</li>
                        <li>Crushed concrete can replace virgin aggregate (save 85% disposal costs)</li>
                        <li>Steel offcuts have scrap value - arrange collection with licensed recycler</li>
                        <li>Timber waste can be chipped for landscaping mulch</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommended Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recommended Actions & Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              {complianceStatus.recommendedActions.length === 0 ? (
                <Alert className="bg-green-50 border-green-300">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>No Special Actions Required</AlertTitle>
                  <AlertDescription>
                    Your project appears to have minimal environmental compliance requirements.
                    Maintain standard construction site environmental practices.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {complianceStatus.recommendedActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1 text-sm text-gray-800">{action}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Download EMP */}
              <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-300">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      Environmental Management Plan (EMP)
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Download a site-specific EMP template based on this compliance assessment.
                      Customize with contractor details and submit to authorities.
                    </p>
                    <Button onClick={handleDownloadEMP} className="bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download EMP Template
                    </Button>
                  </div>
                </div>
              </div>

              {/* Professional Services */}
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-300">
                <h4 className="font-semibold text-yellow-900 mb-2">Need Professional Help?</h4>
                <p className="text-sm text-yellow-800 mb-3">
                  For projects requiring NEMA authorization, we recommend engaging:
                </p>
                <ul className="text-sm text-yellow-800 space-y-1 ml-4 list-disc">
                  <li>Registered Environmental Assessment Practitioner (EAP)</li>
                  <li>Licensed waste management contractor</li>
                  <li>Heritage Impact Assessment specialist (if applicable)</li>
                  <li>Water Use License consultant (if near watercourses)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}