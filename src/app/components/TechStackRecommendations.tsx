import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { CheckCircle2, Server, Code, Database, Cloud, Shield, CreditCard, TrendingUp, AlertCircle, TestTube, Users, Award, Target, Briefcase, Calendar, Download, GraduationCap, Repeat, ClipboardCheck, AlertTriangle, Rocket, ArrowUp, FileCheck } from 'lucide-react';
import { generateProposalDocument } from '@/utils/generateProposalDocument';
import { TechnologyStackSection } from '@/app/components/TechnologyStackSection';

export function TechStackRecommendations() {
  const handleDownloadProposal = async () => {
    await generateProposalDocument();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const BackToTopButton = () => (
    <Button 
      onClick={scrollToTop} 
      variant="outline" 
      className="border-[#00b4d8] text-[#00b4d8] hover:bg-[#00b4d8] hover:text-white"
    >
      <ArrowUp className="h-4 w-4 mr-2" />
      Back to Top
    </Button>
  );

  return (
    <div className="space-y-8">
      {/* Proposal Header */}
      <div className="text-center space-y-4 border-b-4 border-[#00b4d8] pb-6">
        <div className="inline-block bg-[#00b4d8] text-white px-6 py-2 rounded-full text-sm font-semibold mb-2">
          CONFIDENTIAL PARTNERSHIP PROPOSAL
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Qilly Construction Billing System</h1>
        <h2 className="text-2xl font-semibold text-[#00b4d8]">5-Year Development & Maintenance Partnership</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Technology Stack, Team Composition, Development Methodology & Quality Assurance Framework
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Proposal Date:</span> {new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Valid Until:</span> {new Date(Date.now() + 60*24*60*60*1000).toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={handleDownloadProposal} className="bg-[#00b4d8] hover:bg-[#0077b6]">
            <Download className="h-4 w-4 mr-2" />
            Download Word Document
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white">
        <CardHeader>
          <CardTitle className="text-3xl">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">60 Months</p>
              <p className="text-xs opacity-90 mt-1">Partnership Duration</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Repeat className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">130 Sprints</p>
              <p className="text-xs opacity-90 mt-1">2-week agile cycles</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">5-11 People</p>
              <p className="text-xs opacity-90 mt-1">Dedicated team</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">R 77.01M</p>
              <p className="text-xs opacity-90 mt-1">5-year partnership</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation */}
      <Card id="navigation" className="bg-gradient-to-r from-[#00b4d8]/10 to-[#0077b6]/10">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <a href="#tech-stack" className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-[#00b4d8] hover:text-white transition-colors">1. Tech Stack</a>
            <a href="#agile" className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-[#00b4d8] hover:text-white transition-colors">2. Agile</a>
            <a href="#dependencies" className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-[#00b4d8] hover:text-white transition-colors">3. Dependencies</a>
            <a href="#deployment" className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-[#00b4d8] hover:text-white transition-colors">4. Deployment</a>
            <a href="#obligations" className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-[#00b4d8] hover:text-white transition-colors">5. Obligations</a>
            <a href="#testing" className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-[#00b4d8] hover:text-white transition-colors">6. Testing</a>
            <a href="#team" className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-[#00b4d8] hover:text-white transition-colors">7. Team</a>
            <a href="#training" className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-[#00b4d8] hover:text-white transition-colors">8. Training</a>
            <a href="#roadmap" className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-[#00b4d8] hover:text-white transition-colors">9. Roadmap</a>
            <a href="#costs" className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-[#00b4d8] hover:text-white transition-colors">10. Costs</a>
          </div>
        </CardContent>
      </Card>

      {/* 1. Technology Stack */}
      <TechnologyStackSection />

      {/* 2. Agile Development Methodology */}
      <Card id="agile" className="border-[#00b4d8] border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Repeat className="h-6 w-6 text-[#00b4d8]" />
            2. Agile Development Methodology & Sprint Structure
          </CardTitle>
          <CardDescription>2-week sprints with bi-weekly deliverables and customer demos every 4 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Sprint Framework */}
            <div className="bg-gradient-to-r from-[#00b4d8]/10 to-[#0077b6]/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Sprint Framework (2-Week Cycles)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#00b4d8]" />
                    Sprint Structure
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Sprint Duration: 2 weeks (10 working days)</p>
                        <p className="text-gray-600">26 sprints per year × 5 years = 130 total sprints</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Daily Standup: 15 minutes</p>
                        <p className="text-gray-600">What we did, what we're doing, blockers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Sprint Planning: Day 1 (2-4 hours)</p>
                        <p className="text-gray-600">Define user stories, estimate tasks, commit to goals</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Sprint Review: Last Day (1-2 hours)</p>
                        <p className="text-gray-600">Demo working software to stakeholders</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Sprint Retrospective: Last Day (1 hour)</p>
                        <p className="text-gray-600">What went well, what to improve</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#00b4d8]" />
                    Customer Demos (Every 4 Weeks)
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Demo Frequency: Every 2 sprints (monthly)</p>
                        <p className="text-gray-600">13 major demos per year over 4 years</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Demo Content: Live working features</p>
                        <p className="text-gray-600">Not mockups - real code deployed to staging</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Client Feedback: Within 48 hours</p>
                        <p className="text-gray-600">Quick turnaround for adjustments</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Stakeholder Attendance: Required</p>
                        <p className="text-gray-600">Decision-makers validate direction early</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Year 1 Sprint Breakdown */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#00b4d8]">Year 1: MVP Development (26 Sprints)</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-[#00b4d8]">
                  <h4 className="font-semibold text-lg mb-3">Quarter 1 (Sprints 1-6) - Foundation</h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="font-semibold">Sprints 1-2: Project Setup & Authentication</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside mt-1 space-y-1">
                        <li>React + TypeScript + Tailwind setup</li>
                        <li>Supabase database configuration</li>
                        <li>User authentication (login, register, password reset)</li>
                        <li>Free trial system (14-day access tracking)</li>
                        <li><span className="font-medium text-[#00b4d8]">Demo: Live login system with trial countdown</span></li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-semibold">Sprints 3-4: Dashboard & UI Framework</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside mt-1 space-y-1">
                        <li>Main dashboard with navigation</li>
                        <li>User profile management</li>
                        <li>Bill history page (empty state)</li>
                        <li>Blue (#00b4d8) branding applied</li>
                        <li><span className="font-medium text-[#00b4d8]">Demo: Navigate entire app skeleton</span></li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <p className="font-semibold">Sprints 5-6: BOQ File Upload</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside mt-1 space-y-1">
                        <li>Excel/CSV file upload component</li>
                        <li>File validation & error handling</li>
                        <li>BOQ column mapping & detection</li>
                        <li>Data preview & confirmation screen</li>
                        <li><span className="font-medium text-[#00b4d8]">Demo: Upload sample BOQ files, show parsing results</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                  <h4 className="font-semibold text-lg mb-3">Quarter 2 (Sprints 7-13) - Core Pricing Engine</h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-[#00b4d8] pl-4">
                      <p className="font-semibold">Sprints 7-8: Supplier Data Integration (Buco)</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside mt-1 space-y-1">
                        <li>Buco catalog data structure & API integration</li>
                        <li>Item matching algorithm (fuzzy search)</li>
                        <li>Price fetching across 9 provinces</li>
                        <li><span className="font-medium text-[#00b4d8]">Demo: Live price lookup for Buco items</span></li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-semibold">Sprints 9-10: Multi-Supplier Integration (Macsteel, Raumix)</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside mt-1 space-y-1">
                        <li>Macsteel & Raumix data integration</li>
                        <li>Multi-supplier price comparison</li>
                        <li>Best price selection logic</li>
                        <li><span className="font-medium text-[#00b4d8]">Demo: Compare prices across 3 suppliers</span></li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <p className="font-semibold">Sprints 11-13: Pricing Engine & Calculations</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside mt-1 space-y-1">
                        <li>Automated RATE × QUANTITY calculations</li>
                        <li>Provincial pricing logic</li>
                        <li>Pricing accuracy validation (100% target)</li>
                        <li>Performance optimization (&lt; 5 min for 500 items)</li>
                        <li><span className="font-medium text-[#00b4d8]">Demo: End-to-end BOQ pricing with 100% accuracy</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <h4 className="font-semibold text-lg mb-3">Quarter 3-4 (Sprints 14-26) - Advanced Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span><strong>Sprints 14-15:</strong> Results export (Excel, PDF) + Demo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span><strong>Sprints 16-17:</strong> Lafarge supplier integration + Demo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span><strong>Sprints 18-19:</strong> Bill history & saved projects + Demo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span><strong>Sprints 20-21:</strong> Provincial pricing settings + Demo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span><strong>Sprints 22-23:</strong> Supplier catalog management + Demo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span><strong>Sprints 24-26:</strong> Performance testing & optimization + Final Q1 Demo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-[#00b4d8]">Agile Success Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                  <p className="text-3xl font-bold text-[#00b4d8] mb-1">52</p>
                  <p className="text-sm">Customer Demos</p>
                  <p className="text-xs text-gray-500 mt-1">Every 4 weeks over 4 years</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                  <p className="text-3xl font-bold text-[#00b4d8] mb-1">104</p>
                  <p className="text-sm">Sprint Deliverables</p>
                  <p className="text-xs text-gray-500 mt-1">Bi-weekly working software</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                  <p className="text-3xl font-bold text-[#00b4d8] mb-1">1300+</p>
                  <p className="text-sm">Daily Standups</p>
                  <p className="text-xs text-gray-500 mt-1">Continuous communication</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                  <p className="text-3xl font-bold text-[#00b4d8] mb-1">130</p>
                  <p className="text-sm">Working Increments</p>
                  <p className="text-xs text-gray-500 mt-1">Tested & potentially shippable</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <BackToTopButton />
          </div>
        </CardContent>
      </Card>

      {/* 3. Dependencies & Mitigation Plans */}
      <Card id="dependencies" className="border-[#00b4d8] border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <AlertTriangle className="h-6 w-6 text-[#00b4d8]" />
            3. Project Dependencies & Risk Mitigation
          </CardTitle>
          <CardDescription>Comprehensive analysis of potential blockers and proactive mitigation strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Internal Dependencies */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#00b4d8]">Internal Dependencies</h3>
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-900">Team Resource Availability</p>
                      <p className="text-sm text-red-700 mt-1">Risk: Key team members unavailable due to illness, resignation, or competing priorities</p>
                      <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                        <p className="text-sm font-semibold text-green-900">Mitigation Plan:</p>
                        <ul className="text-sm text-green-800 list-disc list-inside mt-1 space-y-1">
                          <li>Cross-training team members across all critical modules</li>
                          <li>Maintain comprehensive documentation for knowledge transfer</li>
                          <li>Build 20% buffer into sprint capacity for unexpected absences</li>
                          <li>Pre-vetted backup resources on standby (1-week notice period)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-orange-900">Technical Complexity & Unknown Requirements</p>
                      <p className="text-sm text-orange-700 mt-1">Risk: Underestimation of complexity, scope creep, or ambiguous requirements causing delays</p>
                      <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                        <p className="text-sm font-semibold text-green-900">Mitigation Plan:</p>
                        <ul className="text-sm text-green-800 list-disc list-inside mt-1 space-y-1">
                          <li>Dedicated discovery phase (Sprint 1-2) with detailed requirement analysis</li>
                          <li>Bi-weekly client demos to validate assumptions early</li>
                          <li>Formal change request process with impact assessment</li>
                          <li>Technical spikes for complex features before committing to sprint</li>
                          <li>Architecture reviews with senior developers every quarter</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-yellow-900">Testing & QA Bottlenecks</p>
                      <p className="text-sm text-yellow-700 mt-1">Risk: QA team overwhelmed, leading to delayed releases or quality issues</p>
                      <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                        <p className="text-sm font-semibold text-green-900">Mitigation Plan:</p>
                        <ul className="text-sm text-green-800 list-disc list-inside mt-1 space-y-1">
                          <li>Automated test suite covering 80%+ of functionality</li>
                          <li>Developers write unit tests before code review</li>
                          <li>QA engineers embedded in sprint planning from Day 1</li>
                          <li>Test cases written parallel to development (not after)</li>
                          <li>Scale QA team to 2 engineers in Phase 1, with option to expand</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* External Dependencies */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#00b4d8]">External Dependencies</h3>
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-900">Supplier API Access & Data Quality</p>
                      <p className="text-sm text-red-700 mt-1">Risk: Suppliers (Buco, Macsteel, Raumix, Lafarge) delay API access, change data formats, or provide incomplete data</p>
                      <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                        <p className="text-sm font-semibold text-green-900">Mitigation Plan:</p>
                        <ul className="text-sm text-green-800 list-disc list-inside mt-1 space-y-1">
                          <li>Initiate supplier API negotiations in Month 1 (before development starts)</li>
                          <li>Build data scraping fallback for suppliers without APIs</li>
                          <li>Create mock data sets for development to proceed independently</li>
                          <li>Design modular integration layer to swap suppliers without code rewrites</li>
                          <li>Client to leverage business relationships for faster approvals</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-orange-900">Client Availability for Demos & Feedback</p>
                      <p className="text-sm text-orange-700 mt-1">Risk: Client stakeholders unavailable for scheduled demos, causing validation delays</p>
                      <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                        <p className="text-sm font-semibold text-green-900">Mitigation Plan:</p>
                        <ul className="text-sm text-green-800 list-disc list-inside mt-1 space-y-1">
                          <li>Schedule demo dates 8 weeks in advance (locked in calendar)</li>
                          <li>Record all demos for asynchronous review if needed</li>
                          <li>Establish primary + backup stakeholders for approvals</li>
                          <li>48-hour SLA for feedback on critical decisions</li>
                          <li>Escalation path to executives for urgent blockers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-yellow-900">Third-Party Service Outages (AWS, Supabase, etc.)</p>
                      <p className="text-sm text-yellow-700 mt-1">Risk: Cloud providers or dependencies experience downtime affecting development or production</p>
                      <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                        <p className="text-sm font-semibold text-green-900">Mitigation Plan:</p>
                        <ul className="text-sm text-green-800 list-disc list-inside mt-1 space-y-1">
                          <li>Select providers with 99.9%+ uptime SLA (AWS, Vercel)</li>
                          <li>Implement retry logic & graceful degradation in code</li>
                          <li>Maintain local development environments independent of cloud</li>
                          <li>Monitor third-party status pages proactively</li>
                          <li>Have backup database snapshots for disaster recovery</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-blue-900">Market Changes & Regulatory Updates</p>
                      <p className="text-sm text-blue-700 mt-1">Risk: Construction industry regulations or supplier pricing models change mid-project</p>
                      <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                        <p className="text-sm font-semibold text-green-900">Mitigation Plan:</p>
                        <ul className="text-sm text-green-800 list-disc list-inside mt-1 space-y-1">
                          <li>Build flexible pricing logic to accommodate formula changes</li>
                          <li>Quarterly regulatory review meetings with client</li>
                          <li>Version-controlled configuration for business rules</li>
                          <li>Budget 10% contingency for unforeseen regulatory work</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Risk Management */}
            <div className="bg-gradient-to-r from-[#00b4d8]/10 to-[#0077b6]/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Proactive Risk Management Framework</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-[#00b4d8]" />
                    Weekly Risk Reviews
                  </h4>
                  <p className="text-sm text-gray-600">Team identifies & tracks new risks in sprint retrospectives</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#00b4d8]" />
                    Escalation Protocol
                  </h4>
                  <p className="text-sm text-gray-600">Critical risks escalated to project manager within 24 hours</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#00b4d8]" />
                    Monthly Client Reviews
                  </h4>
                  <p className="text-sm text-gray-600">Risk register shared with client stakeholders each month</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#00b4d8]" />
                    Adaptive Planning
                  </h4>
                  <p className="text-sm text-gray-600">Sprint scope adjusted based on emerging dependencies</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <BackToTopButton />
          </div>
        </CardContent>
      </Card>

      {/* 4. Deployment Strategy */}
      <Card id="deployment" className="border-[#00b4d8] border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Rocket className="h-6 w-6 text-[#00b4d8]" />
            4. Deployment Strategy & Production Rollout
          </CardTitle>
          <CardDescription>Phased deployment with zero-downtime releases and automated CI/CD pipelines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Deployment Environments */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#00b4d8]">Multi-Environment Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h4 className="font-semibold text-lg mb-2">Development</h4>
                  <p className="text-sm text-gray-700 mb-3">Isolated environment for active development & testing</p>
                  <div className="space-y-1 text-xs">
                    <p><span className="font-semibold">Purpose:</span> Feature development & unit testing</p>
                    <p><span className="font-semibold">Access:</span> Development team only</p>
                    <p><span className="font-semibold">Data:</span> Mock/synthetic data</p>
                    <p><span className="font-semibold">Deployments:</span> Multiple times per day (automated)</p>
                  </div>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h4 className="font-semibold text-lg mb-2">Staging</h4>
                  <p className="text-sm text-gray-700 mb-3">Pre-production mirror for client validation</p>
                  <div className="space-y-1 text-xs">
                    <p><span className="font-semibold">Purpose:</span> Client demos & UAT</p>
                    <p><span className="font-semibold">Access:</span> Team + client stakeholders</p>
                    <p><span className="font-semibold">Data:</span> Anonymized production-like data</p>
                    <p><span className="font-semibold">Deployments:</span> Every sprint (bi-weekly)</p>
                  </div>
                </div>
                
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <h4 className="font-semibold text-lg mb-2">Production</h4>
                  <p className="text-sm text-gray-700 mb-3">Live environment serving end users</p>
                  <div className="space-y-1 text-xs">
                    <p><span className="font-semibold">Purpose:</span> Live operations</p>
                    <p><span className="font-semibold">Access:</span> End users + support team</p>
                    <p><span className="font-semibold">Data:</span> Real client data (encrypted)</p>
                    <p><span className="font-semibold">Deployments:</span> After client approval (monthly in early phases, weekly at maturity)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CI/CD Pipeline */}
            <div className="bg-gradient-to-r from-[#00b4d8]/10 to-[#0077b6]/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Automated CI/CD Pipeline</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-[#00b4d8] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Code Commit & Automated Testing</h4>
                    <p className="text-sm text-gray-600 mt-1">Developer pushes code → GitHub Actions trigger → Unit & integration tests run</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#00b4d8] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Code Quality & Security Scans</h4>
                    <p className="text-sm text-gray-600 mt-1">ESLint checks, TypeScript compilation, vulnerability scanning (Snyk)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#00b4d8] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Build & Deploy to Development</h4>
                    <p className="text-sm text-gray-600 mt-1">Successful tests → Auto-deploy to dev environment (Vercel/AWS)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#00b4d8] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Staging Deployment (Bi-weekly)</h4>
                    <p className="text-sm text-gray-600 mt-1">End of sprint → Manual trigger → Deploy to staging for client demos</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#00b4d8] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">5</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Production Deployment (Client-Approved)</h4>
                    <p className="text-sm text-gray-600 mt-1">Client approval → Blue-green deployment → Zero-downtime release</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Deployment Best Practices */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#00b4d8]">Production Deployment Safeguards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <h4 className="font-semibold">Blue-Green Deployment</h4>
                  </div>
                  <p className="text-sm text-gray-600">Two identical production environments - deploy to inactive one, switch traffic instantly if successful</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <h4 className="font-semibold">Automated Rollback</h4>
                  </div>
                  <p className="text-sm text-gray-600">Health checks fail → Automatic rollback to previous version within 2 minutes</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <h4 className="font-semibold">Database Migrations</h4>
                  </div>
                  <p className="text-sm text-gray-600">Backward-compatible schema changes tested in staging first, executed before code deployment</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <h4 className="font-semibold">Monitoring & Alerts</h4>
                  </div>
                  <p className="text-sm text-gray-600">Real-time error tracking (Sentry), performance monitoring, instant Slack notifications</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <h4 className="font-semibold">Deployment Windows</h4>
                  </div>
                  <p className="text-sm text-gray-600">Production releases during low-traffic hours (e.g., after business hours) with team on standby</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <h4 className="font-semibold">Feature Flags</h4>
                  </div>
                  <p className="text-sm text-gray-600">New features deployed "dark" (disabled) - enabled gradually for testing before full rollout</p>
                </div>
              </div>
            </div>

            {/* Infrastructure */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-[#00b4d8]">Infrastructure & Hosting</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Cloud className="h-5 w-5 text-[#00b4d8] mt-0.5" />
                  <div>
                    <p className="font-semibold">Cloud Provider: AWS / Vercel</p>
                    <p className="text-sm text-gray-600">Scalable, reliable infrastructure with 99.9% uptime SLA</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-[#00b4d8] mt-0.5" />
                  <div>
                    <p className="font-semibold">Database: Supabase (Postgres)</p>
                    <p className="text-sm text-gray-600">Managed database with automatic backups, point-in-time recovery</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#00b4d8] mt-0.5" />
                  <div>
                    <p className="font-semibold">Security: SSL/TLS encryption, WAF, DDoS protection</p>
                    <p className="text-sm text-gray-600">Enterprise-grade security for sensitive construction data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Server className="h-5 w-5 text-[#00b4d8] mt-0.5" />
                  <div>
                    <p className="font-semibold">CDN: Global content delivery for fast page loads</p>
                    <p className="text-sm text-gray-600">Sub-second response times across all South African provinces</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <BackToTopButton />
          </div>
        </CardContent>
      </Card>

      {/* 5. Client & Provider Obligations */}
      <Card id="obligations" className="border-[#00b4d8] border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FileCheck className="h-6 w-6 text-[#00b4d8]" />
            5. Mutual Obligations & Responsibilities
          </CardTitle>
          <CardDescription>Clear accountability framework for both Assure Tech Solutions and the Client</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Assure Tech Obligations */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#00b4d8]">Assure Tech Solutions Obligations</h3>
              <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-6 border border-blue-200">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Deliver Working Software Every 2 Weeks</p>
                      <p className="text-sm text-gray-600">Provide tested, functional increments at the end of each sprint for client review</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Maintain 100% Pricing Accuracy Target</p>
                      <p className="text-sm text-gray-600">Ensure BOQ pricing calculations match supplier rates within acceptable tolerances (99%+ accuracy)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Provide Comprehensive Documentation</p>
                      <p className="text-sm text-gray-600">Technical documentation, user guides, API specifications, and training materials</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Dedicated Quality Assurance</p>
                      <p className="text-sm text-gray-600">In-house QA team testing all features before client demos (2 QA engineers minimum)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Transparent Progress Reporting</p>
                      <p className="text-sm text-gray-600">Sprint reports, burn-down charts, and risk registers shared after every sprint</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Code Ownership & Handover</p>
                      <p className="text-sm text-gray-600">Full source code repository access, deployment scripts, and infrastructure-as-code</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Client Training & Knowledge Transfer</p>
                      <p className="text-sm text-gray-600">Live training sessions for admin users, power users, and end users (see Training Plan section)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Maintenance & Support (Phase 3)</p>
                      <p className="text-sm text-gray-600">Bug fixes, security patches, and performance optimization during maintenance phase</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Security & Data Protection</p>
                      <p className="text-sm text-gray-600">Implement industry-standard security practices, encryption, and POPI Act compliance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Scalable Architecture</p>
                      <p className="text-sm text-gray-600">Design system to handle growth from pilot users to full organizational rollout</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Obligations */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#00b4d8]">Client Obligations</h3>
              <div className="bg-gradient-to-r from-green-50 to-white rounded-lg p-6 border border-green-200">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Timely Feedback on Demos</p>
                      <p className="text-sm text-gray-600">Attend bi-weekly sprint demos and provide feedback within 48 hours (critical for agile flow)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Dedicated Stakeholder Availability</p>
                      <p className="text-sm text-gray-600">Assign primary + backup stakeholders with decision-making authority for approvals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Supplier Coordination</p>
                      <p className="text-sm text-gray-600">Leverage business relationships to facilitate API access from Buco, Macsteel, Raumix, Lafarge</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Sample Data & Domain Expertise</p>
                      <p className="text-sm text-gray-600">Provide real BOQ samples, construction industry context, and subject matter experts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">User Acceptance Testing (UAT)</p>
                      <p className="text-sm text-gray-600">Conduct UAT sessions in staging environment before production releases</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Timely Payment</p>
                      <p className="text-sm text-gray-600">Monthly invoices paid within 30 days to ensure uninterrupted development</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Training Participation</p>
                      <p className="text-sm text-gray-600">Ensure target users attend scheduled training sessions (admin, power users, end users)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Change Request Process</p>
                      <p className="text-sm text-gray-600">Submit scope changes through formal process with impact assessment before implementation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Production Environment Support</p>
                      <p className="text-sm text-gray-600">Provide necessary cloud accounts, domain names, SSL certificates for deployment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#00b4d8] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Data Backup & Compliance</p>
                      <p className="text-sm text-gray-600">Ensure compliance with internal data policies and approve backup/recovery procedures</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Collaboration Framework */}
            <div className="bg-gradient-to-r from-[#00b4d8]/10 to-[#0077b6]/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Success Through Partnership</h3>
              <p className="text-gray-700 mb-4">
                This project succeeds when both parties actively collaborate. Assure Tech brings technical excellence and agile delivery, 
                while the Client provides domain expertise and timely decision-making. Together, we will build a world-class construction billing system.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <Users className="h-8 w-8 text-[#00b4d8] mx-auto mb-2" />
                  <p className="font-semibold">Joint Ownership</p>
                  <p className="text-xs text-gray-600 mt-1">Shared responsibility for project success</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <ClipboardCheck className="h-8 w-8 text-[#00b4d8] mx-auto mb-2" />
                  <p className="font-semibold">Transparent Communication</p>
                  <p className="text-xs text-gray-600 mt-1">Open dialogue about challenges & risks</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Award className="h-8 w-8 text-[#00b4d8] mx-auto mb-2" />
                  <p className="font-semibold">Mutual Respect</p>
                  <p className="text-xs text-gray-600 mt-1">Value each other's expertise & time</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <BackToTopButton />
          </div>
        </CardContent>
      </Card>

      {/* 6. Testing & QA */}
      <Card id="testing" className="border-[#00b4d8] border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <TestTube className="h-6 w-6 text-[#00b4d8]" />
            6. Comprehensive Test Plan & Quality Assurance Strategy
          </CardTitle>
          <CardDescription>In-house QA team with comprehensive test coverage across all phases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Why In-House QA */}
            <div className="bg-gradient-to-r from-green-50 to-white rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="text-xl font-semibold mb-4 text-green-900">Why In-House QA vs Subcontracting?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Deep Product Knowledge</p>
                    <p className="text-sm text-gray-600">In-house QA engineers work with the same codebase daily, understanding architectural decisions and edge cases better than external contractors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Faster Communication & Feedback</p>
                    <p className="text-sm text-gray-600">QA sits with developers in daily standups - bugs identified in minutes, not days. No handoff delays with external vendors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Agile Integration</p>
                    <p className="text-sm text-gray-600">QA participates in sprint planning, reviews user stories before development, writes test cases in parallel - not possible with subcontractors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Cost Efficiency Over 5 Years</p>
                    <p className="text-sm text-gray-600">Subcontractors charge premium hourly rates (R800-R1200/hr). In-house QA at R35K-R45K/month is more economical for continuous testing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Quality Ownership</p>
                    <p className="text-sm text-gray-600">In-house QA is accountable to the team, not billing hours. They care about long-term product quality, not just test case count</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Coverage - Comprehensive grid */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#00b4d8]">Comprehensive Test Coverage</h3>
              <div className="text-center py-4 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">Complete testing strategy with functional, non-functional, data accuracy, and edge case testing</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <BackToTopButton />
          </div>
        </CardContent>
      </Card>

      {/* 7. Team Composition */}
      <Card id="team" className="border-[#00b4d8] border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6 text-[#00b4d8]" />
            7. Team Composition & Resource Allocation
          </CardTitle>
          <CardDescription>Dedicated team with 10% annual salary increases across all phases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">Phase 1: 12 people (R 41.86M team + R 192K infra)</p>
            <p className="text-gray-600">Phase 2: 8 people (R 25.27M team + R 480K infra)</p>
            <p className="text-gray-600">Phase 3: 3 people (R 7.41M team + R 1.8M infra)</p>
            <p className="text-lg font-bold text-[#00b4d8] mt-4">Total: R 77.01M (Team R74.54M + Infra R2.47M)</p>
          </div>
          <div className="mt-6 flex justify-center">
            <BackToTopButton />
          </div>
        </CardContent>
      </Card>

      {/* 8. Client Training */}
      <Card id="training" className="border-[#00b4d8] border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <GraduationCap className="h-6 w-6 text-[#00b4d8]" />
            8. Comprehensive Client Training Plan
          </CardTitle>
          <CardDescription>4-week structured training program for all user types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">Week 1: System Administrators</p>
            <p className="text-gray-600">Week 2: Power Users (Quantity Surveyors)</p>
            <p className="text-gray-600">Week 3: End Users</p>
            <p className="text-gray-600">Week 4: Q&A & Knowledge Transfer</p>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Development Roadmap */}
      <Card id="roadmap" className="border-[#00b4d8] border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Rocket className="h-6 w-6 text-[#00b4d8]" />
            9. Comprehensive Development Roadmap & Cost Justification
          </CardTitle>
          <CardDescription>Detailed 5-year development phases with deliverables that justify the R 77.01M investment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Phase 1: Year 1-2 MVP Development */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border-2 border-[#00b4d8]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#00b4d8] mb-2">Phase 1 (Years 1-2): MVP Development</h3>
                  <p className="text-sm text-gray-600">52 Sprints | Foundation & Core Features</p>
                </div>
                <div className="bg-[#00b4d8] text-white px-4 py-2 rounded-lg text-right">
                  <p className="text-sm font-semibold">Investment</p>
                  <p className="text-xl font-bold">R 7.16M - R 9.07M</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Year 1 */}
                <div className="bg-white rounded-lg p-5 border-l-4 border-green-500">
                  <h4 className="text-xl font-bold mb-4 text-green-700">Year 1 (26 Sprints) - Core Platform</h4>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-[#00b4d8] pl-4">
                      <h5 className="font-semibold text-lg mb-2">Q1 (Sprints 1-6): Foundation</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Authentication & User Management</p>
                            <p className="text-gray-600">Login, registration, password reset, free trial system, user profiles</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Dashboard & Navigation Framework</p>
                            <p className="text-gray-600">Main dashboard, responsive UI, bill history page, blue branding</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">BOQ File Upload System</p>
                            <p className="text-gray-600">Excel/CSV parsing, validation, column mapping, data preview</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                        <p className="text-sm font-semibold text-blue-900">💰 Cost Justification: Team of 5 (1 PM, 2 Devs, 1 QA, 1 Designer) × 3 months = R 895K - R 1.135M</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h5 className="font-semibold text-lg mb-2">Q2 (Sprints 7-13): Core Pricing Engine</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Buco Integration & Fuzzy Matching</p>
                            <p className="text-gray-600">API integration, item matching algorithm, 9-province pricing</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Multi-Supplier Integration (Macsteel, Raumix)</p>
                            <p className="text-gray-600">Data connectors, price comparison logic, best price selection</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Automated Pricing Calculations</p>
                            <p className="text-gray-600">RATE × QUANTITY, provincial logic, 100% accuracy validation</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                        <p className="text-sm font-semibold text-blue-900">💰 Cost Justification: Team of 5 × 3.5 months = R 1.045M - R 1.325M (Most complex technical work)</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h5 className="font-semibold text-lg mb-2">Q3-Q4 (Sprints 14-26): Advanced Features</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Results export (Excel, PDF) + custom branding</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Lafarge supplier integration (4th supplier)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Bill history & project management system</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Provincial pricing settings & customization</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Supplier catalog management interface</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Performance testing & optimization (&lt;5 min processing)</span>
                        </div>
                      </div>
                      <div className="mt-3 bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                        <p className="text-sm font-semibold text-blue-900">💰 Cost Justification: Team of 5 × 6.5 months = R 1.94M - R 2.46M</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Year 2 */}
                <div className="bg-white rounded-lg p-5 border-l-4 border-blue-500">
                  <h4 className="text-xl font-bold mb-4 text-blue-700">Year 2 (26 Sprints) - Enterprise Features</h4>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-semibold text-lg mb-2">Q1 (Sprints 27-32): Payment & Monetization</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Payment gateway integration (Stripe/PayFast)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Subscription plans (Basic, Pro, Enterprise)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Invoice generation & billing management</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Usage analytics & reporting dashboard</span>
                        </div>
                      </div>
                      <div className="mt-3 bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                        <p className="text-sm font-semibold text-blue-900">💰 Cost Justification: Team of 7 (added Backend Dev + DevOps) × 3 months = R 1.045M - R 1.325M</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h5 className="font-semibold text-lg mb-2">Q2 (Sprints 33-39): Multi-User & Collaboration</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Team accounts with role-based access control</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Project sharing & collaboration features</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Activity logs & audit trails</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Real-time notifications & alerts</span>
                        </div>
                      </div>
                      <div className="mt-3 bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                        <p className="text-sm font-semibold text-blue-900">💰 Cost Justification: Team of 7 × 3.5 months = R 1.22M - R 1.545M</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h5 className="font-semibold text-lg mb-2">Q3-Q4 (Sprints 40-52): Advanced Analytics & API</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Cost trend analysis & historical pricing data</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Supplier price comparison reports</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Public API for third-party integrations</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Mobile-responsive improvements & PWA</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Load testing & scalability optimization</span>
                        </div>
                      </div>
                      <div className="mt-3 bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                        <p className="text-sm font-semibold text-blue-900">💰 Cost Justification: Team of 7 × 6.5 months = R 2.275M - R 2.88M</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4">
                  <p className="text-lg font-bold text-gray-800 mb-2">✅ Phase 1 Deliverable: Fully Functional MVP</p>
                  <p className="text-sm text-gray-700">A production-ready platform with 4 supplier integrations, payment system, multi-user support, and enterprise features serving paying customers.</p>
                </div>
              </div>
            </div>

            {/* Phase 2: Year 3-4 Enhancement & Scale */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 border-2 border-orange-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-orange-600 mb-2">Phase 2 (Years 3-4): Enhancement & Scale</h3>
                  <p className="text-sm text-gray-600">52 Sprints | Growth & Optimization</p>
                </div>
                <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-right">
                  <p className="text-sm font-semibold">Investment</p>
                  <p className="text-xl font-bold">R 6.56M - R 8.39M</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Year 3 */}
                <div className="bg-white rounded-lg p-5 border-l-4 border-orange-500">
                  <h4 className="text-xl font-bold mb-4 text-orange-700">Year 3 (26 Sprints) - Advanced Features</h4>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-[#00b4d8] pl-4">
                      <h5 className="font-semibold text-lg mb-2">Q1-Q2 (Sprints 53-65): AI & Automation</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>AI-powered item description matching (ML models)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Automated supplier catalog updates (web scraping)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Price prediction & forecasting engine</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Smart BOQ templates & industry standards</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Automated reporting & email notifications</span>
                        </div>
                      </div>
                      <div className="mt-3 bg-orange-50 p-3 rounded border-l-4 border-orange-500">
                        <p className="text-sm font-semibold text-orange-900">💰 Cost Justification: Team of 9 (added ML Engineer + Data Analyst) × 6.5 months = R 2.925M - R 3.71M</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-semibold text-lg mb-2">Q3-Q4 (Sprints 66-78): Enterprise Expansion</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>5+ additional supplier integrations (Cashbuild, Builders, PPC, etc.)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>White-label solution for enterprise clients</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Custom approval workflows & procurement rules</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Integration with ERP systems (SAP, Oracle)</span>
                        </div>
                      </div>
                      <div className="mt-3 bg-orange-50 p-3 rounded border-l-4 border-orange-500">
                        <p className="text-sm font-semibold text-orange-900">💰 Cost Justification: Team of 9 × 6.5 months = R 2.925M - R 3.71M</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Year 4 */}
                <div className="bg-white rounded-lg p-5 border-l-4 border-yellow-500">
                  <h4 className="text-xl font-bold mb-4 text-yellow-700">Year 4 (26 Sprints) - Market Leadership</h4>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h5 className="font-semibold text-lg mb-2">Full Year Focus: Dominance & Innovation</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Mobile apps (iOS & Android native)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Blockchain-based supplier verification</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Marketplace for pre-priced BOQ templates</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Advanced data visualization & BI dashboards</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Supplier bid management & RFQ automation</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Compliance & regulatory reporting tools</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Multi-currency & international expansion prep</span>
                        </div>
                      </div>
                      <div className="mt-3 bg-orange-50 p-3 rounded border-l-4 border-orange-500">
                        <p className="text-sm font-semibold text-orange-900">💰 Cost Justification: Team of 11 (added Mobile Devs + UX Researcher) × 12 months = R 6.6M - R 8.37M</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-4">
                  <p className="text-lg font-bold text-gray-800 mb-2">✅ Phase 2 Deliverable: Market-Leading Platform</p>
                  <p className="text-sm text-gray-700">An AI-powered, enterprise-grade platform with 10+ supplier integrations, mobile apps, white-label capabilities, and dominant market position.</p>
                </div>
              </div>
            </div>

            {/* Phase 3: Year 5 Maintenance */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-purple-600 mb-2">Phase 3 (Year 5): Maintenance & Support</h3>
                  <p className="text-sm text-gray-600">26 Sprints | Stability & Optimization</p>
                </div>
                <div className="bg-purple-500 text-white px-4 py-2 rounded-lg text-right">
                  <p className="text-sm font-semibold">Investment</p>
                  <p className="text-xl font-bold">R 2.81M - R 3.6M</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-5 border-l-4 border-purple-500">
                  <h4 className="text-xl font-bold mb-4 text-purple-700">Year 5 (26 Sprints) - Maturity & Handover</h4>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-semibold text-lg mb-2">Ongoing Maintenance Activities</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Bug fixes & performance optimization</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Security patches & dependency updates</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Supplier data refresh & catalog maintenance</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Infrastructure monitoring & uptime (99.9% SLA)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>User support & helpdesk operations</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <h5 className="font-semibold text-lg mb-2">Minor Feature Enhancements</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>User-requested feature improvements</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>UI/UX refinements based on user feedback</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Additional export formats & reporting options</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Integration with new suppliers (as needed)</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h5 className="font-semibold text-lg mb-2">Knowledge Transfer & Handover</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Complete technical documentation update</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Training client's in-house team (if applicable)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Codebase review & best practices guide</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>DevOps playbooks & runbooks</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Post-handover support plan (optional renewal)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 bg-purple-50 p-3 rounded border-l-4 border-purple-500">
                      <p className="text-sm font-semibold text-purple-900">💰 Cost Justification: Reduced team of 5-6 (PM, 2-3 Devs, 1 QA, DevOps) × 12 months = R 2.81M - R 3.6M</p>
                      <p className="text-xs text-purple-700 mt-1">Lower cost due to reduced development scope and focus on maintenance</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
                  <p className="text-lg font-bold text-gray-800 mb-2">✅ Phase 3 Deliverable: Stable, Self-Sustaining Platform</p>
                  <p className="text-sm text-gray-700">A mature, well-documented platform ready for long-term operation with optional handover to client's internal team or continued support contract.</p>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-[#00b4d8] to-[#0077b6] text-white rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-4 text-center">5-Year Roadmap Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold mb-2">130</p>
                  <p className="text-sm">Total Sprints</p>
                  <p className="text-xs opacity-80 mt-1">2-week agile cycles</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold mb-2">100+</p>
                  <p className="text-sm">Major Features</p>
                  <p className="text-xs opacity-80 mt-1">From MVP to Market Leader</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold mb-2">R 77.01M</p>
                  <p className="text-sm">Total Investment</p>
                  <p className="text-xs opacity-80 mt-1">Justified by deliverables</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm opacity-90">Each phase builds on the previous, delivering tangible value and revenue potential at every stage</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <BackToTopButton />
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card id="costs" className="bg-gradient-to-br from-[#00b4d8] to-[#0077b6] text-white">
        <CardHeader>
          <CardTitle className="text-2xl">10. 5-Year Partnership: Complete Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-4">Team Costs by Phase</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Phase 1 (Years 1-2)</span>
                    <span className="font-semibold">R 41.86M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phase 2 (Years 3-4)</span>
                    <span className="font-semibold">R 25.27M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phase 3 (Year 5)</span>
                    <span className="font-semibold">R 7.41M</span>
                  </div>
                  <div className="border-t border-white/30 pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total Team Cost:</span>
                      <span>R 74.54M</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-4">Infrastructure & Tools (5 Years)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Years 1-2 (Phase 1)</span>
                    <span className="font-semibold">R 192K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Years 3-4 (Phase 2)</span>
                    <span className="font-semibold">R 480K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year 5 (Phase 3)</span>
                    <span className="font-semibold">R 1.8M</span>
                  </div>
                  <div className="border-t border-white/30 pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total Infrastructure:</span>
                      <span>R 2.47M</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/20 rounded-lg p-6 text-center">
              <p className="text-lg font-semibold mb-2">5-Year Total Contract Value</p>
              <p className="text-5xl font-bold mb-2">R 77.01M</p>
              <p className="text-sm opacity-90">Team: R74.54M + Infrastructure: R2.47M</p>
              <p className="text-sm opacity-90 mt-2">Average Monthly Cost: R 1.28M</p>
            </div>
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={scrollToTop} 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-[#00b4d8]"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Back to Top
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-8 border-t-2 border-[#00b4d8]">
        <p className="text-sm text-gray-600 mb-2">
          This proposal is confidential and proprietary to Assure Tech Solutions (Pty) Ltd.
        </p>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Assure Tech Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
}
