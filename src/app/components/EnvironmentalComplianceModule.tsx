import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Progress } from '@/app/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Trash2,
  LeafyGreen,
  Clock,
  DollarSign,
  MapPin,
  FileWarning,
  Download,
  Info,
} from 'lucide-react';
import {
  calculateEnvironmentalCompliance,
  getProvincialRequirements,
  type EnvironmentalCompliance,
  type NEMAActivity,
  type WasteEstimate,
} from '@/utils/environmentalCompliance';

interface EnvironmentalComplianceModuleProps {
  projectSettings: {
    projectType: string;
    totalArea: number;
    province: string;
    municipality: string;
  };
  boqItems: any[];
  onExportDocuments?: () => void;
}

export function EnvironmentalComplianceModule({
  projectSettings,
  boqItems,
  onExportDocuments,
}: EnvironmentalComplianceModuleProps) {
  const [complianceData, setComplianceData] = useState<EnvironmentalCompliance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  // Extended project parameters for screening
  const [projectParams, setProjectParams] = useState({
    projectType: projectSettings.projectType || 'residential',
    totalArea: projectSettings.totalArea || 0,
    totalEarthworks: 0, // Will calculate from BOQ
    location: {
      province: projectSettings.province || 'Gauteng',
      municipality: projectSettings.municipality || '',
      isCoastal: false,
      isSensitiveArea: false,
    },
    hasElectricalInfra: false,
    electricalCapacity: 0,
    hasSewageInfra: false,
    hasWaterInfra: false,
  });

  useEffect(() => {
    // Calculate earthworks from BOQ
    const earthworksItems = boqItems.filter(item => {
      const desc = (item.description || '').toLowerCase();
      return desc.includes('excavat') || desc.includes('earthwork') || desc.includes('cutting') || desc.includes('filling');
    });
    
    const totalEarthworks = earthworksItems.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) || 0);
    }, 0);

    // Check for electrical infrastructure
    const hasElectrical = boqItems.some(item =>
      (item.description || '').toLowerCase().includes('electrical') ||
      (item.description || '').toLowerCase().includes('substation')
    );

    // Check for sewage infrastructure
    const hasSewage = boqItems.some(item =>
      (item.description || '').toLowerCase().includes('sewer') ||
      (item.description || '').toLowerCase().includes('effluent')
    );

    // Determine if coastal (simplified - based on province)
    const coastalProvinces = ['Western Cape', 'KwaZulu-Natal', 'Eastern Cape'];
    const isCoastal = coastalProvinces.includes(projectSettings.province);

    // Update project params
    const updatedParams = {
      ...projectParams,
      totalArea: projectSettings.totalArea || 0,
      totalEarthworks,
      location: {
        ...projectParams.location,
        province: projectSettings.province || 'Gauteng',
        municipality: projectSettings.municipality || '',
        isCoastal,
      },
      hasElectricalInfra: hasElectrical,
      hasSewageInfra: hasSewage,
    };

    setProjectParams(updatedParams);

    // Calculate compliance
    const compliance = calculateEnvironmentalCompliance(updatedParams, boqItems);
    setComplianceData(compliance);
    setIsLoading(false);
  }, [projectSettings, boqItems]);

  if (isLoading || !complianceData) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Environmental Compliance Screening</CardTitle>
          <CardDescription>Analyzing project for NEMA and Waste Act requirements...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Very High': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Low': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'Medium': return <Info className="w-5 h-5 text-yellow-600" />;
      case 'High': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'Very High': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const provincialReqs = getProvincialRequirements(projectSettings.province);

  return (
    <div className="mt-4 space-y-4">
      {/* Header Card with Overall Status */}
      <Card className={`border-2 ${getRiskColor(complianceData.projectRiskLevel)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getRiskIcon(complianceData.projectRiskLevel)}
              <div>
                <CardTitle>Environmental Compliance Status</CardTitle>
                <CardDescription className="mt-1">
                  NEMA, Waste Act, and Provincial Requirements
                </CardDescription>
              </div>
            </div>
            <Badge className={`${getRiskColor(complianceData.projectRiskLevel)} text-lg px-4 py-2`}>
              {complianceData.projectRiskLevel} Risk
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-xs text-gray-600 mb-1">Compliance Score</div>
              <div className="text-3xl font-bold text-gray-900">
                {complianceData.complianceScore}/100
              </div>
              <Progress value={complianceData.complianceScore} className="mt-2" />
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                Authorization Timeline
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {complianceData.estimatedTimelineWeeks}
              </div>
              <div className="text-xs text-gray-500 mt-1">weeks (est.)</div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                <DollarSign className="w-4 h-4" />
                Compliance Costs
              </div>
              <div className="text-2xl font-bold text-gray-900">
                R{(complianceData.estimatedComplianceCost / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-gray-500 mt-1">estimated</div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                <FileText className="w-4 h-4" />
                Documents Required
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {complianceData.requiredDocuments.length}
              </div>
              <div className="text-xs text-gray-500 mt-1">submissions</div>
            </div>
          </div>

          {complianceData.requiresEA && (
            <Alert className="mt-4 bg-amber-50 border-amber-300">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                <strong>Environmental Authorization Required:</strong> This project triggers NEMA listed activities 
                and requires formal environmental assessment before construction can commence.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activities">
            <Shield className="w-4 h-4 mr-2" />
            NEMA Activities
          </TabsTrigger>
          <TabsTrigger value="waste">
            <Trash2 className="w-4 h-4 mr-2" />
            Waste Management
          </TabsTrigger>
          <TabsTrigger value="provincial">
            <MapPin className="w-4 h-4 mr-2" />
            Provincial Rules
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <FileWarning className="w-4 h-4 mr-2" />
            Action Plan
          </TabsTrigger>
        </TabsList>

        {/* NEMA Activities Tab */}
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Triggered NEMA Listed Activities</CardTitle>
              <CardDescription>
                Environmental Impact Assessment Regulations (GN R.982-985, 2014 as amended 2017)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complianceData.triggeredActivities.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-gray-900">No NEMA Activities Triggered</p>
                  <p className="text-sm text-gray-600 mt-1">
                    This project does not require Environmental Authorization based on current screening.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complianceData.triggeredActivities.map((activity, index) => (
                    <ActivityCard key={index} activity={activity} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Waste Management Tab */}
        <TabsContent value="waste">
          <Card>
            <CardHeader>
              <CardTitle>Construction Waste Estimates</CardTitle>
              <CardDescription>
                National Environmental Management: Waste Act (59/2008) compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complianceData.wasteEstimates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No waste estimates calculated (insufficient BOQ data)
                </div>
              ) : (
                <div className="space-y-4">
                  {complianceData.wasteEstimates.map((waste, index) => (
                    <WasteCard key={index} waste={waste} />
                  ))}
                  
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      SAWIC Registration Required
                    </h4>
                    <p className="text-sm text-blue-800">
                      All construction projects generating waste must register with the South African Waste 
                      Information Centre (SAWIC) and submit quarterly waste returns.
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      <a href="https://sawic.environment.gov.za" target="_blank" rel="noopener noreferrer">
                        Register at SAWIC →
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Provincial Requirements Tab */}
        <TabsContent value="provincial">
          <Card>
            <CardHeader>
              <CardTitle>{projectSettings.province} Environmental Requirements</CardTitle>
              <CardDescription>
                Province-specific regulations and screening criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              {provincialReqs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No specific provincial requirements identified
                </div>
              ) : (
                <ul className="space-y-3">
                  {provincialReqs.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-800">{req}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Heritage Screening Required</h4>
                <p className="text-sm text-yellow-800">
                  All construction projects must screen for heritage resources using the SAHRA Paleontological 
                  and Archaeological Sensitivity Map. Projects in high-sensitivity areas require Heritage Impact Assessments.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  <a href="https://sahris.sahra.org.za" target="_blank" rel="noopener noreferrer">
                    Screen on SAHRIS →
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Compliance Action Plan</CardTitle>
              <CardDescription>
                Steps to ensure regulatory compliance before construction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Immediate Actions Required:</h4>
                <ol className="space-y-3">
                  {complianceData.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-800 pt-0.5">{rec}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <LeafyGreen className="w-4 h-4" />
                    Environmental Best Practices
                  </h4>
                  <ul className="text-sm text-green-800 space-y-2 mt-3">
                    <li>• Appoint Environmental Control Officer (ECO) during construction</li>
                    <li>• Implement dust suppression measures (water spraying)</li>
                    <li>• Install sediment traps and erosion control</li>
                    <li>• Designate waste sorting areas on site</li>
                    <li>• Protect vegetation outside construction footprint</li>
                    <li>• Monitor noise levels near residential areas</li>
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Required Documents Checklist:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {complianceData.requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="w-4 h-4" />
                        <label className="text-gray-700">{doc}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {onExportDocuments && (
                  <Button onClick={onExportDocuments} className="w-full mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Export Environmental Compliance Report (PDF)
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Activity Card Component
function ActivityCard({ activity }: { activity: NEMAActivity }) {
  const getAuthTypeColor = (type: string) => {
    switch (type) {
      case 'Full EIA': return 'bg-red-100 text-red-800';
      case 'Basic Assessment': return 'bg-orange-100 text-orange-800';
      case 'Exempted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getAuthTypeColor(activity.authorizationType)}>
              {activity.authorizationType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {activity.listingNotice} - Activity {activity.activityNumber}
            </Badge>
          </div>
          <h4 className="font-semibold text-gray-900 text-sm">{activity.description}</h4>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
        <div>
          <span className="text-gray-600">Trigger:</span>
          <p className="font-medium text-gray-900">{activity.triggerThreshold}</p>
        </div>
        <div>
          <span className="text-gray-600">Authority:</span>
          <p className="font-medium text-gray-900">{activity.competentAuthority}</p>
        </div>
        <div>
          <span className="text-gray-600">Timeline:</span>
          <p className="font-medium text-gray-900">{activity.estimatedTimeframe}</p>
        </div>
        <div>
          <span className="text-gray-600">Est. Cost:</span>
          <p className="font-medium text-gray-900">{activity.estimatedCost}</p>
        </div>
      </div>
    </div>
  );
}

// Waste Card Component
function WasteCard({ waste }: { waste: WasteEstimate }) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{waste.category}</h4>
          <Badge variant="outline" className="mt-1 text-xs">
            {waste.wasteClassification} Waste
          </Badge>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {waste.estimatedVolume.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600">
            {waste.category === 'Steel' || waste.category === 'General Construction' ? 'tons' : 'm³'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
        <div>
          <span className="text-gray-600 text-xs">Disposal Method:</span>
          <p className="font-medium text-gray-900">{waste.disposalMethod}</p>
        </div>
        <div>
          <span className="text-gray-600 text-xs">Est. Cost:</span>
          <p className="font-medium text-gray-900">R{waste.estimatedCost.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-3">
        <span className="text-gray-600 text-xs">Licensed Contractors:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {waste.licensedContractors.map((contractor, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {contractor}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
