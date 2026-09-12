import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  TrendingUp, 
  Shield, 
  Users, 
  DollarSign,
  Building2,
  Target,
  Zap,
  Award,
  ArrowLeft,
  Presentation,
  Sparkles
} from 'lucide-react';
import { generateDHSExecutiveDeck } from '@/utils/generateDHSExecutiveDeck';
import { generateArchitecturePDF } from '@/utils/generateArchitecturePDF';
import { toast } from 'sonner';
import { QillyProposalGenerator } from '@/app/components/QillyProposalGenerator';
import { ComplianceDocumentGenerator } from '@/app/components/ComplianceDocumentGenerator';

interface ProposalPageProps {
  onBack?: () => void;
}

export function ProposalPage({ onBack }: ProposalPageProps) {
  const handleDownloadExecutiveDeck = async () => {
    await generateDHSExecutiveDeck();
  };

  const handleDownloadArchitecturePDF = async () => {
    await generateArchitecturePDF();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {onBack && (
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        )}
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Department of Human Settlements Funding Request
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Qilly: Automated BOQ Solution to Eliminate Professional Fees, Prevent Project Delays, and Ensure Construction Compliance Across All 9 Provinces
          </p>
        </div>

        {/* FEATURED: DHS Funding Request PowerPoint - Highlighted */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-xl p-8 text-white">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Presentation className="h-10 w-10" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">DHS Funding Request - Complete Proposal</h2>
                    <p className="text-purple-100 mt-1">PowerPoint Presentation (16 Professional Slides)</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-lg">📊 Complete Funding Proposal</h3>
                    <ul className="text-sm space-y-1 text-purple-50">
                      <li>• R25.0M - R33.7M total funding request</li>
                      <li>• R31M - R196M taxpayer savings projection</li>
                      <li>• 335-1,435 additional houses funded</li>
                      <li>• 20-person team structure & salaries</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-lg">✅ All 6 Compliance Features</h3>
                    <ul className="text-sm space-y-1 text-purple-50">
                      <li>• SANS 1200 verification system</li>
                      <li>• NBR (National Building Regulations)</li>
                      <li>• AGRÉMENT certification tracking</li>
                      <li>• BBBEE preferential procurement</li>
                      <li>• POPIA data protection compliance</li>
                      <li>• Anti-corruption & audit trails (PFMA/MFMA)</li>
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-300">16 Slides</div>
                    <div className="text-xs text-purple-100">Professional format</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-300">40+ Citations</div>
                    <div className="text-xs text-purple-100">Govt sources</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-300">100% Ready</div>
                    <div className="text-xs text-purple-100">For DHS submission</div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleDownloadExecutiveDeck}
              size="lg"
              className="w-full bg-white text-purple-700 hover:bg-purple-50 font-bold text-lg py-6 shadow-lg"
            >
              <Presentation className="h-6 w-6 mr-3" />
              Download DHS Funding Request PowerPoint (PPT)
            </Button>
            
            <p className="text-center text-purple-100 mt-4 text-sm">
              💼 Perfect for: DHS Leadership, National Treasury, Provincial Departments, Municipal Managers, Parliamentary Committees
            </p>
          </div>
        </div>

        {/* Document Download Cards - 2 columns for supporting documents */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Supporting Documents</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <QillyProposalGenerator />
            <ComplianceDocumentGenerator />
          </div>
        </div>

        {/* Informational Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📥 Download Options
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">Complete DHS Funding Proposal</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>✓ Full 5-year funding request (R14.3M - R19.1M)</li>
                  <li>✓ 20-person team composition</li>
                  <li>✓ 40+ citations from govt sources</li>
                  <li>✓ All 6 compliance features</li>
                  <li>✓ Detailed calculations & methodology</li>
                  <li>✓ ROI projections & partnership models</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-900 mb-3">Compliance Features Document</h3>
                <ul className="text-sm text-orange-700 space-y-2">
                  <li>✓ Technical feasibility for all 6 features</li>
                  <li>✓ Implementation stages (3 phases)</li>
                  <li>✓ Detailed feature descriptions</li>
                  <li>✓ 3-year phased roadmap</li>
                  <li>✓ Cost breakdown (R1.14M - R1.63M)</li>
                  <li>✓ ROI analysis (77x-377x return)</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-3">DHS Executive Deck (NEW!)</h3>
                <ul className="text-sm text-purple-700 space-y-2">
                  <li>✓ 16-slide PowerPoint presentation</li>
                  <li>✓ All 6 compliance features detailed</li>
                  <li>✓ Each feature with cited benefits</li>
                  <li>✓ Financial impact summary</li>
                  <li>✓ Implementation timeline</li>
                  <li>✓ Ready for DHS leadership</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                ✅ Confirmation: Compliance Features in Main Proposal
              </h3>
              <p className="text-sm text-green-800 mb-3">
                The complete DHS funding proposal Word document <strong>ALREADY INCLUDES</strong> a comprehensive compliance features section with:
              </p>
              <div className="grid md:grid-cols-3 gap-3 text-xs text-green-700">
                <div>• SANS 1200 verification</div>
                <div>• NBR alignment details</div>
                <div>• AGRÉMENT certification</div>
                <div>• POPIA compliance</div>
                <div>• BBBEE tracking system</div>
                <div>• PFMA/MFMA audit trails</div>
                <div>• Implementation roadmap</div>
                <div>• Cost breakdown by phase</div>
                <div>• ROI & value proposition</div>
              </div>
              <p className="text-sm text-green-800 mt-4 font-semibold">
                💡 Download the standalone compliance document for a focused, detailed technical analysis to share with IT, legal, and compliance teams.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Benefits to Department of Human Settlements
              </h2>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">R10M - R43M</div>
                  <div className="text-sm font-semibold text-green-900 mb-1">Annual Savings</div>
                  <div className="text-xs text-green-700">Professional fees eliminated</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                  <div className="text-sm font-semibold text-blue-900 mb-1">Faster Processing</div>
                  <div className="text-xs text-blue-700">5 minutes vs. 2-4 weeks</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">335-1,435</div>
                  <div className="text-sm font-semibold text-purple-900 mb-1">Additional Houses</div>
                  <div className="text-xs text-purple-700">Built with 5-year savings</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-4">🏗️ Construction Compliance Features (Included in Both Documents)</h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">✓</span>
                    <span className="text-amber-800">SANS 1200 automated compliance verification</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">✓</span>
                    <span className="text-amber-800">National Building Regulations (NBR) alignment</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">✓</span>
                    <span className="text-amber-800">AGRÉMENT South Africa certification checks</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">✓</span>
                    <span className="text-amber-800">POPIA compliance (government data security)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">✓</span>
                    <span className="text-amber-800">BBBEE preferential procurement tracking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">✓</span>
                    <span className="text-amber-800">PFMA/MFMA compliance & audit trails</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This proposal reflects South African market contracting rates as of February 2026</p>
          <p className="mt-1">Valid for 60 days from date of issue</p>
        </div>
      </div>
    </div>
  );
}