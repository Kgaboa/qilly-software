import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { ArrowLeft, CheckCircle2, ChevronRight, FileText, FileUp, Info, Play, Search, Shield, Zap } from 'lucide-react';
import { BOQ_TEMPLATES, getTemplatesByProjectType, type BoqTemplate, type BoqTemplateItem } from '@/utils/boqTemplates';
import { toast } from 'sonner';
import { TemplateValidationModal } from './TemplateValidationModal';
import type { SubscriptionTier } from '@/utils/tierAccess';

interface BoqTemplateLibraryProps {
  contractorProjectTypes?: string[];
  onTemplateSelect: (items: BoqTemplateItem[]) => void;
  onManualEntry: () => void;
  onBack: () => void;
  canUploadBOQ?: boolean; // ✅ NEW: Control manual BOQ visibility based on tier
  contractorTier?: SubscriptionTier; // ✅ NEW: Contractor subscription tier
}

export function BoqTemplateLibrary({ 
  contractorProjectTypes = [], 
  onTemplateSelect, 
  onManualEntry,
  onBack,
  canUploadBOQ = true, // Default to true for non-contractors
  contractorTier = 'free' // Default to free tier
}: BoqTemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<BoqTemplate | null>(null);
  const [filteredTemplates, setFilteredTemplates] = useState<BoqTemplate[]>([]);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [showAllTemplates, setShowAllTemplates] = useState(false);

  useEffect(() => {
    // Filter templates based on contractor's project types
    let templates: BoqTemplate[] = [];
    
    // ✅ FREE TIER RESTRICTION: Only show ONE template per project type
    if (contractorTier === 'free') {
      // For FREE tier, get only the FIRST template for each project type
      const seenProjectTypes = new Set<string>();
      
      contractorProjectTypes.forEach(projectType => {
        if (!seenProjectTypes.has(projectType)) {
          const typeTemplates = getTemplatesByProjectType(projectType);
          if (typeTemplates.length > 0) {
            // Only take the first template for this project type
            templates.push(typeTemplates[0]);
            seenProjectTypes.add(projectType);
          }
        }
      });
    } else {
      // For paid tiers, show all templates
      contractorProjectTypes.forEach(projectType => {
        const typeTemplates = getTemplatesByProjectType(projectType);
        templates = [...templates, ...typeTemplates];
      });
    }

    // A contractor can select multiple profile categories that resolve to the
    // same template category. Keep each template visible only once.
    templates = Array.from(
      new Map(templates.map(template => [template.id, template])).values()
    );

    // Apply search filter
    if (searchQuery.trim()) {
      templates = templates.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.projectType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTemplates(templates);
  }, [contractorProjectTypes, searchQuery, contractorTier]);

  useEffect(() => {
    if (!selectedTemplate) return;

    const remainsAvailable = contractorProjectTypes.some(projectType =>
      getTemplatesByProjectType(projectType).some(template => template.id === selectedTemplate.id)
    );

    if (!remainsAvailable) {
      setSelectedTemplate(null);
    }
  }, [contractorProjectTypes, selectedTemplate]);

  const handleUseTemplate = (template: BoqTemplate) => {
    toast.success(`Training template "${template.name}" loaded in read-only mode. Generate pricing to explore the workflow.`);
    onTemplateSelect(template.items);
  };

  if (selectedTemplate) {
    return (
      <div className="space-y-6">
        {/* Validation Modal */}
        {selectedTemplate.validation && (
          <TemplateValidationModal
            template={selectedTemplate}
            isOpen={isValidationModalOpen}
            onClose={() => setIsValidationModalOpen(false)}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setSelectedTemplate(null)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Button>
          <Button
            onClick={() => handleUseTemplate(selectedTemplate)}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Use This Template
          </Button>
        </div>

        {/* Template Details */}
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{selectedTemplate.icon}</div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{selectedTemplate.name}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {selectedTemplate.description}
                </CardDescription>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <Badge className="bg-blue-600">{selectedTemplate.projectType}</Badge>
                  <Badge variant="outline">{selectedTemplate.projectSize}</Badge>
                  <Badge variant="outline">{selectedTemplate.items.length} Work Items</Badge>
                  {selectedTemplate.validation && (
                    <>
                      <Badge className="bg-green-600">
                        <Shield className="w-3 h-3 mr-1" />
                        Expert Reviewed
                      </Badge>
                      <Badge className="bg-purple-600">
                        v{selectedTemplate.validation.version}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Validation Quick Info (if available) */}
            {selectedTemplate.validation && (
              <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-600 rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">✅ Validated Template</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <div className="text-gray-600">Expert Reviewers</div>
                        <div className="font-bold text-green-700">{selectedTemplate.validation.reviewedBy.length} Professionals</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Benchmark Projects</div>
                        <div className="font-bold text-green-700">{selectedTemplate.validation.benchmarkProjects.length} Government Projects</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Last Reviewed</div>
                        <div className="font-bold text-green-700">{selectedTemplate.validation.lastReviewDate}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setIsValidationModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        View Full Validation Report
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          toast.info('Video tutorial coming soon!', {
                            description: 'We\'re creating detailed videos for each template.'
                          });
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        How This Was Built
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SANS Standards */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                SANS Standards Compliance
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.sansStandards.map((standard, idx) => (
                  <Badge key={idx} className="bg-green-600">
                    {standard}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Work Items Table */}
            <div>
              <h3 className="font-semibold mb-3">Work Items Included ({selectedTemplate.items.length} items)</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr className="border-b">
                        <th className="px-3 py-2 text-left font-semibold">Code</th>
                        <th className="px-3 py-2 text-left font-semibold">Description</th>
                        <th className="px-3 py-2 text-left font-semibold">Unit</th>
                        <th className="px-3 py-2 text-right font-semibold">Quantity</th>
                        <th className="px-3 py-2 text-left font-semibold">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTemplate.items.map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2 font-mono text-xs">{item.code}</td>
                          <td className="px-3 py-2">
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                          </td>
                          <td className="px-3 py-2">{item.unit}</td>
                          <td className="px-3 py-2 text-right font-medium">{item.quantity}</td>
                          <td className="px-3 py-2">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">What happens next?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>All {selectedTemplate.items.length} work items will be pre-loaded into the BOQ form</li>
                  <li>Template work items are read-only so the standard scope stays consistent</li>
                  <li>Qilly matches the work items against the available supplier catalogue</li>
                  <li>Provincial factors are applied for the province you select</li>
                  <li>Review the priced BOQ before using it for a bid</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedTemplate(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleUseTemplate(selectedTemplate)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Use This Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-hidden">
      {/* FREE Tier Training Mode Banner */}
      {!canUploadBOQ && (
        <div className="w-full p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🎓</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-900 mb-1">
                Training Mode Active - Learn Qilly with Real Templates
              </p>
              <p className="text-xs text-amber-800 mb-2">
                You're on the <strong>FREE tier</strong>. {filteredTemplates.length > 0 ? `${filteredTemplates.length} training template${filteredTemplates.length !== 1 ? 's are' : ' is'} available below` : 'Select a BuildAid 2025/2026 template below'} 
                {filteredTemplates.length > 0 && <> (1 per project type)</>}. 
                Explore Qilly's current template pricing workflow—completely free!
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-amber-700">
                  ✅ Unlimited template practice
                </span>
                <span className="text-amber-700">
                  ✅ Supplier-catalogue estimates
                </span>
                <span className="text-amber-700">
                  ✅ All 9 provinces supported
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-amber-300">
                <p className="text-xs text-amber-800">
                  <strong>Ready to upload your own BOQs?</strong> Upgrade to <strong className="text-amber-900">PROFESSIONAL</strong> (R2,999/month) 
                  or <strong className="text-amber-900">ENTERPRISE</strong> (R8,999/month).{' '}
                  <a href="mailto:support@qilly.co.za" className="underline font-semibold hover:text-amber-950">Contact sales</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Qilly</h1>
        <p className="text-gray-600 mt-1">
          {canUploadBOQ 
            ? 'Upload or enter your own BOQ, or explore a locked training template'
            : 'Choose a locked BuildAid 2025/2026 template for training'
          }
        </p>
      </div>

      {/* Quick Actions - Only show if not viewing all templates */}
      {!showAllTemplates && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Template Option */}
          <Card
            className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => setShowAllTemplates(true)}
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Use a Template (Recommended)</CardTitle>
                  <CardDescription className="mt-2">
                    Start with pre-built SANS 1200 compliant work items
                  </CardDescription>
                  <div className="mt-3 space-y-1 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Pre-loaded standard work items</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Configure and price without starting from scratch</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>SANS 1200 references included where applicable</span>
                    </div>
                  </div>
                  
                  {/* Available Templates List */}
                  {filteredTemplates.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Available Templates for You:</p>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {filteredTemplates.slice(0, 4).map((template, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTemplate(template);
                            }}
                          >
                            <FileText className="w-3 h-3" />
                            <span className="truncate">{template.name}</span>
                            <Badge variant="outline" className="text-[10px] ml-auto">{template.items.length} items</Badge>
                          </div>
                        ))}
                      </div>
                      {filteredTemplates.length > 4 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAllTemplates(true);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold mt-2 flex items-center gap-1"
                        >
                          View All {filteredTemplates.length} Templates
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Manual Option */}
          {canUploadBOQ && (
            <Card className="border-2 border-gray-300 hover:border-gray-400 hover:shadow-lg transition-all cursor-pointer group" onClick={onManualEntry}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-600 rounded-lg group-hover:bg-gray-700 transition-colors">
                    <FileUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Manual Entry / Upload</CardTitle>
                    <CardDescription className="mt-2">
                      Create from scratch or upload your own BOQ file
                    </CardDescription>
                    <div className="mt-3 space-y-1 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gray-600" />
                        <span>Enter work items manually</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gray-600" />
                        <span>Upload Excel/CSV file</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gray-600" />
                        <span>Full control over all items</span>
                      </div>
                    </div>
                    <Button className="mt-4 w-full group-hover:bg-gray-700" variant="default">
                      Start Manual Entry
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}
        </div>
      )}

      {/* Template Grid - Only show when "View All" is clicked */}
      {showAllTemplates && (
        <>
          {/* Back Button */}
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setShowAllTemplates(false)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <Label>Search Templates</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by project type, name, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-center">
                  {searchQuery
                    ? 'No training templates match your search.'
                    : 'No training template currently matches the project types saved in your profile.'
                  }
                </p>
                {!searchQuery && contractorProjectTypes.length > 0 && (
                  <p className="mt-2 max-w-xl text-center text-xs text-gray-500">
                    Profile project types: {contractorProjectTypes.join(', ')}. You can still start your own BOQ if your plan allows it.
                  </p>
                )}
                {canUploadBOQ && (
                  <Button onClick={onManualEntry} variant="outline" className="mt-4">
                    Create Manual BOQ Instead
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available (based on your project types)
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className="hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{template.icon}</div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base group-hover:text-blue-600 transition-colors">
                            {template.name}
                          </CardTitle>
                          <Badge className="mt-2 bg-blue-600 text-xs">
                            {template.projectType}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {template.description}
                      </p>
                      <div className="space-y-2 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{template.items.length} work items</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>{template.sansStandards.length} SANS standards</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full group-hover:bg-blue-700"
                        size="sm"
                      >
                        View Template
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
