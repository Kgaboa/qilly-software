import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Shield,
  Award,
  Calendar,
  Users,
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Mail,
  Video,
  History
} from 'lucide-react';
import type { BoqTemplate } from '@/utils/boqTemplates';
import { toast } from 'sonner';

interface TemplateValidationModalProps {
  template: BoqTemplate;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateValidationModal({ template, isOpen, onClose }: TemplateValidationModalProps) {
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isRequestingReview, setIsRequestingReview] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Validation Certificate downloaded! Check your downloads folder.', {
      description: 'Use this PDF to prove SANS compliance in tender submissions.'
    });
    
    setIsDownloadingPDF(false);
  };

  const handleRequestExpertReview = async () => {
    setIsRequestingReview(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Expert Review Request Submitted!', {
      description: 'Our Pr.QS will review within 48 hours. Cost: R2,500 (charged to your account).'
    });
    
    setIsRequestingReview(false);
  };

  const handleWatchVideo = () => {
    toast.info('Video Tutorial Coming Soon!', {
      description: 'We\'re creating detailed videos showing how each template was built.'
    });
  };

  if (!template.validation) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Validation Not Available</DialogTitle>
            <DialogDescription>
              This template does not have validation metadata yet. Contact support@qilly.co.za for details.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">Template Validation Report</DialogTitle>
              <DialogDescription className="text-base mt-2">
                {template.name} - Version {template.validation.version}
              </DialogDescription>
              <div className="flex gap-2 mt-3">
                <Badge className="bg-green-600">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  SANS Compliant
                </Badge>
                <Badge className="bg-blue-600">
                  <Award className="w-3 h-3 mr-1" />
                  Expert Reviewed
                </Badge>
                <Badge className="bg-purple-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Benchmark Validated
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experts">Expert Review</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Version Info */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">Version Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium">{template.validation.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{template.validation.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Review Date:</span>
                    <span className="font-medium">{template.validation.lastReviewDate}</span>
                  </div>
                </div>
              </div>

              {/* Standards */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">SANS Standards</h3>
                </div>
                <div className="space-y-2">
                  {template.sansStandards.map((standard, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{standard}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Validation Summary
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Expert Reviewers</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {template.validation.reviewedBy.length}
                  </div>
                  <div className="text-xs text-gray-500">Pr.Eng, Pr.QS, NHBRC</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Benchmark Projects</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {template.validation.benchmarkProjects.length}
                  </div>
                  <div className="text-xs text-gray-500">Government projects analyzed</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Work Items</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {template.items.length}
                  </div>
                  <div className="text-xs text-gray-500">SANS-compliant items</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Expert Review Tab */}
          <TabsContent value="experts" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-lg">Expert Review Panel</h3>
            </div>
            <div className="space-y-3">
              {template.validation.reviewedBy.map((reviewer, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{reviewer.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{reviewer.qualification}</p>
                      <p className="text-sm font-medium text-purple-600 mt-2">{reviewer.role}</p>
                    </div>
                    <Badge className="bg-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-purple-900">
                  <p className="font-semibold mb-1">Professional Credentials Verified</p>
                  <p>All reviewers are registered with their respective professional bodies (ECSA, SACQSP, NHBRC). Registration numbers can be verified on official websites.</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Benchmarks Tab */}
          <TabsContent value="benchmarks" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-lg">Benchmark Projects</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This template was validated against {template.validation.benchmarkProjects.length} real government projects to ensure quantities and work breakdown are realistic and industry-standard.
            </p>
            <div className="space-y-3">
              {template.validation.benchmarkProjects.map((project, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{project.name}</h4>
                      <div className="flex gap-3 mt-2 text-sm text-gray-600">
                        <span>📍 {project.province}</span>
                        <span>📅 {project.year}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-600 text-lg px-3 py-1">
                        {project.matchScore}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">Match Score</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-900">
                  <p className="font-semibold mb-1">High Accuracy Validation</p>
                  <p>Match scores above 85% indicate that this template's quantities and work breakdown align closely with actual completed projects in South Africa.</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            {/* Assumptions */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Assumptions
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                This template assumes the following standard conditions:
              </p>
              <ul className="space-y-2">
                {template.validation.assumptions.map((assumption, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{assumption}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Exclusions (Not Included)
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                The following items are NOT included in this template:
              </p>
              <ul className="space-y-2">
                {template.validation.exclusions.map((exclusion, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>{exclusion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-900">
                  <p className="font-semibold mb-1">Important: Contractor Responsibility</p>
                  <p>This template is a STARTING POINT. You must verify all quantities against YOUR specific site conditions and add any missing items based on your project requirements, client specifications, and site investigations.</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Download PDF */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Download className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Download Validation Certificate</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Get a PDF certificate for tender submissions
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloadingPDF}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isDownloadingPDF ? (
                    <>Generating PDF...</>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF (Free)
                    </>
                  )}
                </Button>
              </div>

              {/* Expert Review */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Request Expert Re-Review</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Get a Pr.QS to review within 48 hours (R2,500)
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleRequestExpertReview}
                  disabled={isRequestingReview}
                  variant="outline"
                  className="w-full"
                >
                  {isRequestingReview ? (
                    <>Submitting Request...</>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Request Review (R2,500)
                    </>
                  )}
                </Button>
              </div>

              {/* Video Tutorial */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Video className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">How This Was Built</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Watch a 5-minute video showing the build process
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleWatchVideo}
                  variant="outline"
                  className="w-full"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Watch Tutorial (Coming Soon)
                </Button>
              </div>

              {/* Version History */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <History className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Version History</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      See all updates and changes to this template
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.info('Version history coming soon!')}
                >
                  <History className="w-4 h-4 mr-2" />
                  View History
                </Button>
              </div>
            </div>

            {/* Quarterly Review Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Quarterly Template Updates</p>
                  <p>Qilly reviews all templates every 3 months to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Update SANS standards compliance</li>
                    <li>Analyze 10+ new benchmark projects</li>
                    <li>Incorporate contractor feedback</li>
                    <li>Update unit rates from live supplier data</li>
                    <li>Re-validate with expert panel</li>
                  </ul>
                  <p className="mt-2 font-medium">Next review: {
                    new Date(new Date(template.validation.lastReviewDate).setMonth(new Date(template.validation.lastReviewDate).getMonth() + 3)).toISOString().split('T')[0]
                  }</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            disabled={isDownloadingPDF}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Validation PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
