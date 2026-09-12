import { Check, TrendingUp, Calendar, Users, Zap, Shield } from 'lucide-react';

interface ETenderQuestionAnalysisProps {
  questionId: number;
}

export function ETenderQuestionAnalysis({ questionId }: ETenderQuestionAnalysisProps) {
  const analyses = {
    1: <MLAnalysis />,
    2: <MiningExpansion />,
    3: <IntegrationJourney />,
    4: <PlatformAssociation />,
    5: <DualFunctionality />
  };

  return analyses[questionId as keyof typeof analyses] || null;
}

function MLAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          YES - Qilly's ML Learning Pipeline on Real Tender Outcomes
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          Qilly is designed with a <strong>feedback loop architecture</strong> that learns from actual tender awards. 
          Here's how it works and why eTender integration supercharges this capability:
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-3 text-sm">Current ML Capabilities (Without eTender)</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
            <div className="text-sm text-blue-900">
              <strong>Regional Price Optimization:</strong> Qilly already tracks supplier pricing variations across all 9 provinces, 
              learning which suppliers consistently offer competitive rates per region
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
            <div className="text-sm text-blue-900">
              <strong>Material Cost Trending:</strong> Algorithm identifies seasonal price fluctuations (cement prices rise in summer 
              construction season, asphalt drops in winter) and adjusts BOQ pricing accordingly
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
            <div className="text-sm text-blue-900">
              <strong>Labor Rate Intelligence:</strong> Tracks prevailing wage rates by trade (brick layers, steel fixers, operators) 
              across provinces based on BuildAid 2025/2026 standards
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-3 text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Enhanced ML with eTender Integration
        </h4>
        <div className="space-y-3">
          <div className="bg-white rounded p-3 border border-green-200">
            <div className="font-semibold text-green-900 text-sm mb-1">🎯 Winning Bid Analysis</div>
            <div className="text-xs text-slate-700">
              Access to <strong>actual tender awards</strong> from 50,000+ contractors. Qilly learns: "For a 100-unit RDP housing 
              project in Eastern Cape, winning bids averaged R485K/unit, 3.2% below Qilly's initial estimate." ML adjusts future 
              pricing models to match market reality.
            </div>
          </div>
          
          <div className="bg-white rounded p-3 border border-green-200">
            <div className="font-semibold text-green-900 text-sm mb-1">🏆 Contractor Performance Data</div>
            <div className="text-xs text-slate-700">
              Track which contractors consistently win with specific pricing strategies (aggressive labor pricing vs. conservative 
              material margins). Qilly identifies patterns: "BBBEE Level 1 contractors win with 8% lower margins in Gauteng due to 
              preferential procurement scoring."
            </div>
          </div>

          <div className="bg-white rounded p-3 border border-green-200">
            <div className="font-semibold text-green-900 text-sm mb-1">📊 Validation Feedback Loop</div>
            <div className="text-xs text-slate-700">
              When Qilly generates a BOQ estimate of R12.5M for a civils project and the actual winning bid is R11.8M, the ML model 
              analyzes the gap: Was it lower labor rates? Bulk material discounts? Regional supplier competition? The algorithm 
              adjusts weighting for future similar projects.
            </div>
          </div>

          <div className="bg-white rounded p-3 border border-green-200">
            <div className="font-semibold text-green-900 text-sm mb-1">⚡ Real-Time Market Intelligence</div>
            <div className="text-xs text-slate-700">
              eTender provides live tender activity data. If 15 contractors bid on a project (high competition), Qilly learns that 
              pricing should be 4-6% more competitive than projects with only 3-4 bidders (low competition markets).
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h4 className="font-semibold text-slate-900 mb-3 text-sm">Technical Implementation</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-xs">
            <div className="font-semibold text-slate-900 mb-1">Data Ingestion</div>
            <div className="text-slate-700">eTender API pushes tender awards (anonymized pricing, project specs, winner details) 
            to Qilly nightly batch processing</div>
          </div>
          <div className="text-xs">
            <div className="font-semibold text-slate-900 mb-1">ML Training Cycle</div>
            <div className="text-slate-700">Weekly model retraining with new tender data. A/B testing between current model vs. 
            updated model on validation set</div>
          </div>
          <div className="text-xs">
            <div className="font-semibold text-slate-900 mb-1">Accuracy Metrics</div>
            <div className="text-slate-700">Target: 95% of Qilly estimates within ±5% of winning bids within 6 months of eTender 
            integration</div>
          </div>
          <div className="text-xs">
            <div className="font-semibold text-slate-900 mb-1">Privacy Compliance</div>
            <div className="text-slate-700">POPIA-compliant anonymization of contractor identities. Only aggregate pricing 
            patterns used for ML</div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
        <div className="font-semibold text-amber-900 text-sm mb-1">💡 Investor Pitch Point</div>
        <div className="text-xs text-amber-800">
          "Qilly isn't just a pricing calculator—it's a learning system that gets smarter with every tender. With eTender's 
          50,000+ contractor network, we'll train on <strong>thousands of real-world tender outcomes monthly</strong>, creating 
          the most accurate construction pricing AI in South Africa. Our competitive moat deepens with every project."
        </div>
      </div>
    </div>
  );
}

function MiningExpansion() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Mining Contractor Sector: Strategic Expansion Plan</h3>
        <p className="text-sm text-slate-700 leading-relaxed">
          Mining civils is a <strong>R8.5B/year sector</strong> in South Africa with unique BOQ requirements. 
          Here's Qilly's penetration strategy:
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-900 mb-3 text-sm">Phase 1: Surface Mining Civils (Year 1)</h4>
          <div className="space-y-2 text-xs text-amber-900">
            <div className="flex items-start gap-2">
              <Check className="w-3 h-3 mt-0.5 text-amber-600 flex-shrink-0" />
              <div><strong>Target:</strong> Haul roads, stockpile pads, settling ponds, explosives bunkers</div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-3 h-3 mt-0.5 text-amber-600 flex-shrink-0" />
              <div><strong>Why Easy Entry:</strong> Uses standard SANS 1200 series D (earthworks), E (concrete), similar to 
              housing civils Qilly already masters</div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-3 h-3 mt-0.5 text-amber-600 flex-shrink-0" />
              <div><strong>Quick Win:</strong> Add mining-specific materials (geotextiles, crusher run, mine water treatment 
              chemicals) to database—80% of BOQ items already covered</div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-3 h-3 mt-0.5 text-amber-600 flex-shrink-0" />
              <div><strong>Revenue Model:</strong> R15K-R45K per BOQ for R5M-R50M mining civils projects</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-900 mb-3 text-sm">Phase 2: Underground Infrastructure (Year 2)</h4>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <Check className="w-3 h-3 mt-0.5 text-slate-600 flex-shrink-0" />
              <div><strong>Target:</strong> Ventilation shafts, decline access, underground pump stations, refuge chambers</div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-3 h-3 mt-0.5 text-slate-600 flex-shrink-0" />
              <div><strong>Complexity:</strong> Requires specialized materials (shaft steel sets, rock bolt systems, shotcrete 
              additives) and equipment (raise borers, shaft sinking stages)</div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-3 h-3 mt-0.5 text-slate-600 flex-shrink-0" />
              <div><strong>Partnership:</strong> Collaborate with Murray & Roberts, Aveng Mining for BOQ templates and 
              supplier networks</div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-3 h-3 mt-0.5 text-slate-600 flex-shrink-0" />
              <div><strong>Premium Pricing:</strong> R75K-R150K per BOQ due to specialized expertise required</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-3 text-sm flex items-center gap-2">
          <Users className="w-4 h-4" />
          Market Access Strategy
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded p-3 border border-blue-200">
            <div className="font-semibold text-blue-900 text-xs mb-1">Mining Houses</div>
            <div className="text-xs text-slate-700">
              Target Anglo American Platinum, Sibanye-Stillwater, Impala Platinum procurement teams. Position Qilly as 
              <strong> BBBEE compliance tool</strong> (tracks Level 1-4 contractor pricing).
            </div>
          </div>
          <div className="bg-white rounded p-3 border border-blue-200">
            <div className="font-semibold text-blue-900 text-xs mb-1">Mining Contractors</div>
            <div className="text-xs text-slate-700">
              Partner with ASPASA (Southern African Aggregate & Sand Association) and MBA (Master Builders Association) 
              mining divisions for contractor database access.
            </div>
          </div>
          <div className="bg-white rounded p-3 border border-blue-200">
            <div className="font-semibold text-blue-900 text-xs mb-1">Consulting Engineers</div>
            <div className="text-xs text-slate-700">
              Work with SRK Consulting, DRA Global, Goba (Pty) Ltd who prepare mining civils BOQs. Offer Qilly as 
              <strong> validation tool</strong> for their estimates.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-3 text-sm">Mining-Specific Differentiators</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
            <div className="text-xs text-slate-700">
              <strong>Remote Location Pricing:</strong> Qilly adjusts for transport costs to remote mines (Northern Cape, 
              Limpopo). Algorithm adds 12-18% logistics surcharge based on distance from major supplier hubs.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
            <div className="text-xs text-slate-700">
              <strong>Regulatory Compliance Tracking:</strong> Mining BOQs must comply with Mine Health & Safety Act. 
              Qilly flags items requiring SABS certification (ventilation ducting, emergency lighting, fire suppression).
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
            <div className="text-xs text-slate-700">
              <strong>Environmental Compliance:</strong> Auto-includes rehab costs (topsoil stripping/replacement, erosion 
              control, alien vegetation clearing) per NEMA requirements—often missing from contractor quotes.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
            <div className="text-xs text-slate-700">
              <strong>Social & Labor Plan (SLP) Costing:</strong> Mines must spend on community infrastructure. Qilly 
              generates BOQs for schools, clinics, roads required under SLP commitments.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
        <div className="font-semibold text-purple-900 text-sm mb-2">🎯 3-Year Mining Revenue Projection</div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <div className="text-purple-900 font-semibold">Year 1</div>
            <div className="text-slate-700">25 surface civils projects @ R25K avg = <strong>R625K</strong></div>
          </div>
          <div>
            <div className="text-purple-900 font-semibold">Year 2</div>
            <div className="text-slate-700">60 projects (surface + underground) @ R45K avg = <strong>R2.7M</strong></div>
          </div>
          <div>
            <div className="text-purple-900 font-semibold">Year 3</div>
            <div className="text-slate-700">120 projects + subscription model = <strong>R8.5M</strong></div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
        <div className="font-semibold text-amber-900 text-sm mb-1">💡 Investor Pitch Point</div>
        <div className="text-xs text-amber-800">
          "Mining is our natural expansion—80% of the technical infrastructure already exists in Qilly's core platform. 
          It's a <strong>R8.5B market where accurate BOQ pricing solves major pain points</strong>: budget overruns delay 
          production timelines (costing millions/day), and environmental non-compliance triggers DMRE project suspensions. 
          We enter with low technical risk and high revenue potential."
        </div>
      </div>
    </div>
  );
}

function IntegrationJourney() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-700" />
          eTender Integration Journey: 4-Phase Roadmap
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed">
          Integration can begin <strong>immediately</strong> with pilot phase, scaling to full platform integration over 18 months:
        </p>
      </div>

      <div className="space-y-4">
        {/* Phase 1 */}
        <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-semibold text-green-900 text-sm">Phase 1: Pilot Integration (Months 1-3)</div>
              <div className="text-xs text-green-700">Can start immediately after Monday meeting</div>
            </div>
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">NOW</div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded p-3 border border-green-200">
              <div className="font-semibold text-slate-900 text-xs mb-2 flex items-center gap-2">
                <Zap className="w-3 h-3 text-green-600" />
                Technical Setup
              </div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-green-600 mt-1.5"></div>
                  <div><strong>Week 1-2:</strong> eTender provides sandbox API access. Qilly engineers build connector 
                  for tender listings (read-only)</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-green-600 mt-1.5"></div>
                  <div><strong>Week 3-4:</strong> Qilly embeds "Price This BOQ" widget on eTender tender detail pages</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-green-600 mt-1.5"></div>
                  <div><strong>Week 5-8:</strong> Test with 10 real Department of Human Settlements tenders in Gauteng</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-green-200">
              <div className="font-semibold text-slate-900 text-xs mb-2">Pilot Scope</div>
              <div className="text-xs text-slate-700">
                <strong>Target Sectors:</strong> RDP housing, low-cost housing civils only (leverages Qilly's 98% coverage)<br/>
                <strong>Geographic Focus:</strong> Gauteng & Western Cape (highest tender volumes)<br/>
                <strong>Contractors:</strong> 50 selected eTender users (BBBEE Level 1-4 emerging contractors)<br/>
                <strong>Success Metric:</strong> 30+ BOQs priced, 80% accuracy vs. winning bids
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-green-200">
              <div className="font-semibold text-slate-900 text-xs mb-2">Deliverables</div>
              <div className="text-xs text-slate-700">
                ✅ API integration documentation<br/>
                ✅ Pilot performance report (accuracy, speed, user feedback)<br/>
                ✅ Case studies from 3 winning contractors who used Qilly pricing
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-semibold text-blue-900 text-sm">Phase 2: Validation Integration (Months 4-9)</div>
              <div className="text-xs text-blue-700">Qilly validates contractor-submitted BOQs on eTender</div>
            </div>
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Q2-Q3</div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded p-3 border border-blue-200">
              <div className="font-semibold text-slate-900 text-xs mb-2">Technical Implementation</div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-600 mt-1.5"></div>
                  <div>When contractor uploads BOQ to eTender tender response, Qilly API automatically validates pricing</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-600 mt-1.5"></div>
                  <div>Real-time alerts: "Line item 3.2.5 (Y12 steel fixing): Your price R145/m² is 18% above market average 
                  R122/m² (Gauteng). Risk: Non-competitive bid."</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-600 mt-1.5"></div>
                  <div>Government procurement officers see Qilly validation badge: "BOQ Verified - 94% Market Accuracy"</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-blue-200">
              <div className="font-semibold text-slate-900 text-xs mb-2">Value Proposition</div>
              <div className="text-xs text-slate-700">
                <strong>For Contractors:</strong> Catch pricing errors before submission (避免被取消资格 due to arithmetic mistakes or 
                wildly unrealistic pricing)<br/>
                <strong>For Government:</strong> Instant red-flag detection for collusion (multiple contractors with identical pricing 
                on 50+ line items) or front companies (BOQs with impossible labor rates)<br/>
                <strong>For eTender:</strong> Platform differentiator—only tender portal with AI-powered BOQ validation
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-blue-200">
              <div className="font-semibold text-slate-900 text-xs mb-2">Revenue Model Activated</div>
              <div className="text-xs text-slate-700">
                💰 Contractors pay R2,500-R7,500 per validated BOQ submission<br/>
                💰 Government agencies pay R15K/month subscription for unlimited validation access<br/>
                💰 eTender receives 20% revenue share on all Qilly transactions through platform
              </div>
            </div>
          </div>
        </div>

        {/* Phase 3 */}
        <div className="bg-purple-50 border-l-4 border-purple-500 rounded-r-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-semibold text-purple-900 text-sm">Phase 3: Deep Data Integration (Months 10-15)</div>
              <div className="text-xs text-purple-700">Qilly learns from eTender tender outcome data (ML training)</div>
            </div>
            <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Year 2</div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded p-3 border border-purple-200">
              <div className="font-semibold text-slate-900 text-xs mb-2">Data Sharing Agreement</div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Shield className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div><strong>What eTender Shares:</strong> Anonymized tender awards (winning bid amounts, project specs, 
                  number of bidders, BBBEE scoring, project completion status)</div>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div><strong>POPIA Compliance:</strong> Zero personally identifiable contractor data. Only aggregate pricing 
                  patterns by province, project type, size</div>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div><strong>What Qilly Provides Back:</strong> Market intelligence reports for government (e.g., "Average 
                  RDP housing cost in Limpopo increased 7% YoY due to cement shortage")</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-purple-200">
              <div className="font-semibold text-slate-900 text-xs mb-2">ML Training Pipeline</div>
              <div className="text-xs text-slate-700">
                Qilly ingests 500-800 tender awards monthly from eTender. Algorithm identifies:<br/>
                • Which line items contractors consistently underprice (foundation excavation in rocky areas)<br/>
                • Regional cost variations (labor 12% cheaper in Eastern Cape vs. Gauteng)<br/>
                • Seasonal trends (asphalt projects 8% cheaper in winter when less road work happens)<br/>
                • BBBEE pricing strategies (Level 1 contractors can bid 5-7% lower due to preferential points)
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-purple-200">
              <div className="font-semibold text-slate-900 text-xs mb-2">Accuracy Improvement Target</div>
              <div className="text-xs text-slate-700">
                <strong>Month 10:</strong> 85% of Qilly BOQs within ±8% of winning bids<br/>
                <strong>Month 15:</strong> 95% of Qilly BOQs within ±5% of winning bids<br/>
                This level of accuracy makes Qilly the <strong>de facto standard</strong> for government BOQ budgeting
              </div>
            </div>
          </div>
        </div>

        {/* Phase 4 */}
        <div className="bg-slate-50 border-l-4 border-slate-500 rounded-r-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-semibold text-slate-900 text-sm">Phase 4: Full Platform Integration (Months 16-18)</div>
              <div className="text-xs text-slate-700">Qilly becomes embedded pricing engine for all eTender construction tenders</div>
            </div>
            <div className="bg-slate-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Year 2</div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded p-3 border border-slate-200">
              <div className="font-semibold text-slate-900 text-xs mb-2">Seamless Workflow</div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <div className="bg-slate-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">1</div>
                  <div>Government uploads tender specification & BOQ template to eTender</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-slate-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">2</div>
                  <div>Qilly auto-generates estimated budget range (e.g., "R14.2M - R16.8M based on current market rates")</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-slate-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">3</div>
                  <div>Contractors access Qilly-powered "BOQ Assistant" to build competitive bids</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-slate-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">4</div>
                  <div>Qilly validates all submissions, flags outliers for procurement review</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-slate-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">5</div>
                  <div>Post-award, Qilly tracks project costs vs. BOQ for variance analysis</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-slate-200">
              <div className="font-semibold text-slate-900 text-xs mb-2">White-Label Option</div>
              <div className="text-xs text-slate-700">
                eTender can rebrand Qilly as "eTender Smart Pricing" for seamless user experience. Revenue split: 70% Qilly / 30% eTender 
                for white-label transactions, or 80% Qilly / 20% eTender for co-branded.
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-slate-200">
              <div className="font-semibold text-slate-900 text-xs mb-2">Enterprise Licensing</div>
              <div className="text-xs text-slate-700">
                Major government clients (Department of Human Settlements, SANRAL, Transnet) get unlimited Qilly access via 
                eTender portal for annual license: R500K-R2M depending on tender volume.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4">
        <div className="font-semibold text-green-900 text-sm mb-2">🚀 Integration Timeline Summary</div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="bg-white rounded p-2 border border-green-200">
            <div className="font-semibold text-green-900">Months 1-3</div>
            <div className="text-slate-700">Pilot (10 tenders)</div>
          </div>
          <div className="bg-white rounded p-2 border border-green-200">
            <div className="font-semibold text-blue-900">Months 4-9</div>
            <div className="text-slate-700">Validation (500+ tenders)</div>
          </div>
          <div className="bg-white rounded p-2 border border-green-200">
            <div className="font-semibold text-purple-900">Months 10-15</div>
            <div className="text-slate-700">ML Training (2000+ tenders)</div>
          </div>
          <div className="bg-white rounded p-2 border border-green-200">
            <div className="font-semibold text-slate-900">Months 16-18</div>
            <div className="text-slate-700">Full Integration (All tenders)</div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
        <div className="font-semibold text-amber-900 text-sm mb-1">💡 Investor Pitch Point</div>
        <div className="text-xs text-amber-800">
          "Integration starts Day 1 with pilot phase—no long development cycles. We've designed a <strong>progressive integration 
          roadmap</strong> that delivers value at each stage: pilot proves accuracy, validation generates revenue, ML training 
          builds competitive moat, full integration locks in enterprise contracts. By Month 18, Qilly becomes indispensable 
          infrastructure for South African government procurement."
        </div>
      </div>
    </div>
  );
}

function PlatformAssociation() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">eTender vs. Qilly: Complementary Platforms</h3>
        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          eTender and Qilly solve <strong>different but adjacent problems</strong> in government procurement. 
          Together, they create an end-to-end solution that neither can achieve alone.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* eTender */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900">eTender Platform</h4>
              <div className="text-xs text-blue-700">Tender Management & Procurement</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded p-3 border border-blue-200">
              <div className="font-semibold text-blue-900 text-xs mb-2">🎯 Core Function</div>
              <div className="text-xs text-slate-700">
                Digital marketplace connecting government agencies with contractors for tender publication, bid submission, 
                and award management
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-blue-200">
              <div className="font-semibold text-blue-900 text-xs mb-2">🏢 What They Do</div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>Publish government tenders (R1M - R500M+ projects)</div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>Manage contractor databases (50,000+ registered)</div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>Handle bid submissions & document management</div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>BBBEE compliance verification</div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>Tender evaluation workflows for procurement officers</div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>Award notifications & contract management</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-blue-200">
              <div className="font-semibold text-blue-900 text-xs mb-2">💪 Strengths</div>
              <div className="text-xs text-slate-700">
                <strong>Network effects:</strong> More contractors → more competition → better government pricing<br/>
                <strong>Compliance infrastructure:</strong> Tax clearance, CSD registration, CIDB grading verification<br/>
                <strong>Government trust:</strong> Established relationships with National Treasury, provincial departments
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-blue-200">
              <div className="font-semibold text-blue-900 text-xs mb-2">❌ What They DON'T Do</div>
              <div className="text-xs text-slate-700">
                ❌ Price BOQs (contractors manually calculate, often with 15-25% errors)<br/>
                ❌ Validate pricing accuracy (accept any numbers contractors submit)<br/>
                ❌ Provide material/labor cost intelligence<br/>
                ❌ Detect pricing collusion beyond basic duplicate detection<br/>
                ❌ Help contractors optimize bids for competitiveness
              </div>
            </div>
          </div>
        </div>

        {/* Qilly */}
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-green-900">Qilly Platform</h4>
              <div className="text-xs text-green-700">AI-Powered BOQ Pricing Engine</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded p-3 border border-green-200">
              <div className="font-semibold text-green-900 text-xs mb-2">🎯 Core Function</div>
              <div className="text-xs text-slate-700">
                Automated bill of quantities pricing using live supplier data, labor rates, and equipment costs across 
                all 9 South African provinces
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-green-200">
              <div className="font-semibold text-green-900 text-xs mb-2">🏢 What They Do</div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>Generate priced BOQs in &lt;5 minutes (vs. 8-40 hours manual)</div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>Validate contractor-submitted BOQs for accuracy</div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>Real-time material pricing from 200+ suppliers</div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>SANS 1200, NHBRC, AGRÉMENT compliance checking</div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>Regional price optimization (Gauteng vs. Limpopo labor rate differences)</div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>PC/PS sum handling, percentage items, time-based units</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-green-200">
              <div className="font-semibold text-green-900 text-xs mb-2">💪 Strengths</div>
              <div className="text-xs text-slate-700">
                <strong>Speed:</strong> 5 minutes vs. 8-40 hours for manual BOQ pricing<br/>
                <strong>Accuracy:</strong> 100% arithmetic accuracy, 98% BOQ coverage<br/>
                <strong>Intelligence:</strong> ML learns from tender outcomes, improves pricing models over time
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-green-200">
              <div className="font-semibold text-green-900 text-xs mb-2">❌ What They DON'T Do</div>
              <div className="text-xs text-slate-700">
                ❌ Manage tender publication/submission workflows<br/>
                ❌ Maintain contractor databases<br/>
                ❌ Handle BBBEE scoring or compliance verification<br/>
                ❌ Facilitate government-contractor communication<br/>
                ❌ Award management or contract administration
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Value */}
      <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-5">
        <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
          <Link className="w-5 h-5" />
          The Power of Integration: eTender + Qilly
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="font-semibold text-purple-900 text-sm mb-3">For Government Agencies</div>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <div className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
                <div><strong>Budget Accuracy:</strong> Upload project specs to eTender → Qilly generates realistic budget 
                estimate → Procurement officers know if R15M allocation is sufficient before tender publication</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
                <div><strong>Anti-Corruption:</strong> When 5 contractors submit bids with identical pricing on 80% of line items 
                (collusion red flag), Qilly auto-flags for investigation</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</div>
                <div><strong>Faster Approvals:</strong> National Treasury requires realistic cost estimates for project approval. 
                Qilly-validated BOQs reduce approval time from 6-8 weeks to 2-3 weeks</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="font-semibold text-purple-900 text-sm mb-3">For Contractors</div>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <div className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
                <div><strong>Competitive Advantage:</strong> Emerging contractors without in-house QS teams can bid on complex 
                R50M+ tenders using Qilly's professional-grade BOQ pricing</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
                <div><strong>Error Prevention:</strong> Qilly catches mistakes before eTender submission: "Your total is R14.2M 
                but line items sum to R16.8M—arithmetic error will disqualify your bid"</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</div>
                <div><strong>Market Intelligence:</strong> "83 contractors viewed this tender, 12 downloaded BOQ. Competitive 
                bidding expected—consider 5-7% margin vs. your usual 12%"</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-white">
          <div className="font-semibold text-sm mb-2">🎯 Unified Value Proposition</div>
          <div className="text-xs text-purple-100">
            <strong>eTender</strong> is the trusted marketplace where government and contractors meet. <strong>Qilly</strong> is the 
            intelligent pricing engine that ensures every BOQ is accurate, competitive, and compliant. Together: "The only tender 
            platform where you can find opportunities AND price them correctly—in one workflow."
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <h4 className="font-semibold text-slate-900 mb-4">Comparative Analysis Table</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-2 px-3 font-semibold text-slate-900">Capability</th>
                <th className="text-center py-2 px-3 font-semibold text-blue-900">eTender</th>
                <th className="text-center py-2 px-3 font-semibold text-green-900">Qilly</th>
                <th className="text-center py-2 px-3 font-semibold text-purple-900">Integrated</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-b border-slate-200">
                <td className="py-2 px-3">Tender Publication</td>
                <td className="text-center">✅</td>
                <td className="text-center">❌</td>
                <td className="text-center">✅</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2 px-3">Contractor Database</td>
                <td className="text-center">✅ 50K+</td>
                <td className="text-center">❌</td>
                <td className="text-center">✅ 50K+</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2 px-3">BOQ Pricing</td>
                <td className="text-center">❌</td>
                <td className="text-center">✅ &lt;5min</td>
                <td className="text-center">✅ &lt;5min</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2 px-3">Pricing Validation</td>
                <td className="text-center">❌</td>
                <td className="text-center">✅ 100%</td>
                <td className="text-center">✅ 100%</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2 px-3">Live Supplier Pricing</td>
                <td className="text-center">❌</td>
                <td className="text-center">✅ 200+</td>
                <td className="text-center">✅ 200+</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2 px-3">BBBEE Compliance</td>
                <td className="text-center">✅</td>
                <td className="text-center">✅ Track</td>
                <td className="text-center">✅✅</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2 px-3">Anti-Corruption Detection</td>
                <td className="text-center">Basic</td>
                <td className="text-center">✅ AI</td>
                <td className="text-center">✅✅ Advanced</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2 px-3">ML Learning from Outcomes</td>
                <td className="text-center">❌</td>
                <td className="text-center">⚠️ Limited</td>
                <td className="text-center">✅✅ Full</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
        <div className="font-semibold text-amber-900 text-sm mb-1">💡 Investor Pitch Point</div>
        <div className="text-xs text-amber-800">
          "eTender owns distribution—50,000 contractors, government credibility, tender workflow infrastructure. Qilly owns 
          intelligence—AI pricing, compliance validation, market optimization. <strong>Neither can achieve their full potential 
          alone.</strong> Integrated, they become the definitive platform for South African government construction procurement, 
          with network effects on both sides: more tenders improve Qilly's ML accuracy, better pricing attracts more contractors 
          to eTender. This is a 1+1=5 partnership."
        </div>
      </div>
    </div>
  );
}

function DualFunctionality() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <CheckCheck className="w-5 h-5 text-green-600" />
          YES - Qilly's Dual Mode: Validation + Generation
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          Qilly operates in <strong>two complementary modes</strong> that serve different user needs at different stages 
          of the tender process. This dual functionality is a key competitive advantage.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Generation Mode */}
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-green-900">Mode 1: Generation</h4>
              <div className="text-xs text-green-700">Create Priced BOQs from Scratch</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded p-3 border border-green-200">
              <div className="font-semibold text-green-900 text-xs mb-2">📋 Use Cases</div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0"></div>
                  <div><strong>Contractors bidding on tenders:</strong> Upload unpriced BOQ template from eTender, Qilly 
                  generates fully priced version in 5 minutes</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0"></div>
                  <div><strong>Government budget planning:</strong> Department of Human Settlements planning 500-unit RDP 
                  project, needs cost estimate before tender publication</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0"></div>
                  <div><strong>Consulting engineers:</strong> Preparing project feasibility study, needs BOQ estimate for 
                  R25M civils component</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0"></div>
                  <div><strong>Emerging contractors:</strong> BBBEE Level 1-2 contractors without in-house quantity surveyors 
                  can compete on complex projects</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-green-200">
              <div className="font-semibold text-green-900 text-xs mb-2">⚙️ How It Works</div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <div className="bg-green-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
                  <div>User uploads BOQ template (Excel, PDF, or manual entry of line items)</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-green-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
                  <div>Qilly parses items using NLP: "150mm thick concrete slab C25/20" → material: cement (350kg/m³), 
                  aggregate, labor: 0.8hrs/m², equipment: poker vibrator</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-green-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</div>
                  <div>Queries live supplier database for regional pricing (Gauteng vs. Eastern Cape cement costs)</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-green-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0">4</div>
                  <div>Applies BuildAid 2025/2026 labor rates + equipment hire rates + contractor markup (10-15%)</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-green-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0">5</div>
                  <div>Generates detailed breakdown: R285/m² (materials: R165, labor: R85, equipment: R20, margin: R15)</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-green-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0">6</div>
                  <div>Exports to Excel with formulas intact for contractor adjustments (if they have better supplier pricing)</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-green-200">
              <div className="font-semibold text-green-900 text-xs mb-2">💰 Pricing Model</div>
              <div className="text-xs text-slate-700">
                <strong>Small projects (R500K-R5M):</strong> R2,500 per BOQ<br/>
                <strong>Medium (R5M-R25M):</strong> R7,500 per BOQ<br/>
                <strong>Large (R25M+):</strong> R15,000 per BOQ<br/>
                <strong>Subscription:</strong> R25K/month unlimited for contractors bidding 10+ tenders/month
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-green-200">
              <div className="font-semibold text-green-900 text-xs mb-2">✅ Value Delivered</div>
              <div className="text-xs text-slate-700">
                ⚡ <strong>Speed:</strong> 5 minutes vs. 8-40 hours manual<br/>
                🎯 <strong>Accuracy:</strong> 100% arithmetic, 98% BOQ coverage<br/>
                💵 <strong>Cost Savings:</strong> R2.5K Qilly fee vs. R15K-R45K for QS consultant<br/>
                🏆 <strong>Competitiveness:</strong> Enables more contractors to bid professionally
              </div>
            </div>
          </div>
        </div>

        {/* Validation Mode */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900">Mode 2: Validation</h4>
              <div className="text-xs text-blue-700">Verify Already-Priced BOQs</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded p-3 border border-blue-200">
              <div className="font-semibold text-blue-900 text-xs mb-2">📋 Use Cases</div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                  <div><strong>Contractors pre-submission check:</strong> "I priced this R14.5M BOQ manually—is it competitive? 
                  Any errors?"</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                  <div><strong>Government procurement review:</strong> 8 contractors submitted bids ranging R12M-R18M. Which 
                  pricing is realistic vs. too low (front company) or too high (collusion)?</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                  <div><strong>eTender integration:</strong> Auto-validate every BOQ uploaded to eTender before final submission</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                  <div><strong>Auditors & forensic investigators:</strong> Detect pricing irregularities in awarded tenders 
                  (anti-corruption use case)</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-blue-200">
              <div className="font-semibold text-blue-900 text-xs mb-2">⚙️ How It Works</div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
                  <div>User uploads priced BOQ (their own or from contractor submission)</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
                  <div>Qilly re-prices the same BOQ using its own database and algorithms</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</div>
                  <div>Comparison analysis: Line-by-line variance report</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0">4</div>
                  <div><strong>Green flags:</strong> "Line 2.3.1 (brickwork): Your R185/m² vs. Qilly R178/m² = 4% variance 
                  (acceptable, likely better supplier pricing)"</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0">5</div>
                  <div><strong>Red flags:</strong> "Line 4.1.2 (excavation): Your R45/m³ vs. Qilly R125/m³ = 64% under market. 
                  Risk: Unsustainable pricing or error."</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0">6</div>
                  <div>Overall verdict: "92% Market Conformance - Competitive & Realistic" or "ALERT: 23% Below Market Average 
                  - Investigate Further"</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-blue-200">
              <div className="font-semibold text-blue-900 text-xs mb-2">💰 Pricing Model</div>
              <div className="text-xs text-slate-700">
                <strong>Contractor self-check:</strong> R1,500-R5,000 per validation<br/>
                <strong>Government procurement validation:</strong> R500/month unlimited (for reviewing all tender submissions)<br/>
                <strong>eTender integration:</strong> Included in eTender transaction fees (revenue share model)<br/>
                <strong>Forensic audit services:</strong> R25K-R75K for deep analysis of suspicious tenders
              </div>
            </div>

            <div className="bg-white rounded p-3 border border-blue-200">
              <div className="font-semibold text-blue-900 text-xs mb-2">✅ Value Delivered</div>
              <div className="text-xs text-slate-700">
                🛡️ <strong>Error Prevention:</strong> Catch arithmetic mistakes, missing items, unrealistic unit rates before 
                tender submission<br/>
                🚨 <strong>Anti-Corruption:</strong> Detect collusion (identical pricing patterns) and front companies 
                (impossible rates)<br/>
                ⚖️ <strong>Fair Evaluation:</strong> Government can objectively compare bids using Qilly benchmark<br/>
                📊 <strong>Transparency:</strong> Clear justification for tender awards ("Winning bid 97% aligned with Qilly 
                market data")
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Workflow */}
      <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-5">
        <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Dual Mode in Action: Complete eTender Workflow
        </h4>
        
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <div className="font-semibold text-purple-900 text-sm mb-2">🏛️ Government Journey</div>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="font-bold text-purple-600 w-12 flex-shrink-0">Step 1</div>
                <div><strong>Pre-Tender (Generation Mode):</strong> Department uploads project specs → Qilly generates budget 
                estimate R14.5M-R16.2M → Secure National Treasury approval with realistic costing</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="font-bold text-purple-600 w-12 flex-shrink-0">Step 2</div>
                <div><strong>Tender Publication:</strong> Upload BOQ template + budget range to eTender → Contractors see 
                "Qilly Smart Pricing Available" badge</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="font-bold text-purple-600 w-12 flex-shrink-0">Step 3</div>
                <div><strong>Tender Closing:</strong> 12 contractors submit bids ranging R13.2M-R18.5M</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="font-bold text-purple-600 w-12 flex-shrink-0">Step 4</div>
                <div><strong>Evaluation (Validation Mode):</strong> Qilly auto-validates all 12 submissions → Flags 2 as 
                "Below Market Risk" (23% and 31% under), 1 as "Possible Collusion" (98% identical to another bid)</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="font-bold text-purple-600 w-12 flex-shrink-0">Step 5</div>
                <div><strong>Award Decision:</strong> Select R14.8M bid (96% Qilly conformance, BBBEE Level 2) with confidence 
                it's realistic pricing</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <div className="font-semibold text-purple-900 text-sm mb-2">👷 Contractor Journey</div>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="font-bold text-purple-600 w-12 flex-shrink-0">Step 1</div>
                <div><strong>Tender Discovery:</strong> Find R15M civils project on eTender matching capabilities</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="font-bold text-purple-600 w-12 flex-shrink-0">Step 2</div>
                <div><strong>BOQ Pricing (Generation Mode):</strong> Download 247-line item BOQ template → Upload to Qilly → 
                Receive priced BOQ in 4 minutes with detailed breakdowns</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="font-bold text-purple-600 w-12 flex-shrink-0">Step 3</div>
                <div><strong>Optimization:</strong> Contractor reviews: "Qilly says R14.9M, but I have 8% better pricing on cement 
                through bulk supplier relationship → Adjust to R14.2M for competitive edge"</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="font-bold text-purple-600 w-12 flex-shrink-0">Step 4</div>
                <div><strong>Pre-Submission Check (Validation Mode):</strong> Upload adjusted R14.2M BOQ → Qilly validates: 
                "95% market conformance, arithmetic correct, no missing items—bid is competitive & realistic"</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="font-bold text-purple-600 w-12 flex-shrink-0">Step 5</div>
                <div><strong>Submission:</strong> Upload to eTender with confidence → Win tender 🎉</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <h4 className="font-semibold text-slate-900 mb-4">Technical Implementation: How Both Modes Share Infrastructure</h4>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded p-3 border border-slate-200">
            <div className="font-semibold text-slate-900 text-xs mb-2">🗄️ Shared Database</div>
            <div className="text-xs text-slate-700">
              Both modes use same pricing engine:<br/>
              • 200+ live supplier feeds<br/>
              • BuildAid 2025/2026 labor rates<br/>
              • Equipment hire rate database<br/>
              • ML-trained regional adjustments
            </div>
          </div>

          <div className="bg-white rounded p-3 border border-slate-200">
            <div className="font-semibold text-slate-900 text-xs mb-2">⚙️ Common Processing</div>
            <div className="text-xs text-slate-700">
              Both modes execute:<br/>
              • NLP parsing of BOQ items<br/>
              • SANS 1200 compliance checks<br/>
              • PC/PS sum calculations<br/>
              • Percentage-based item handling
            </div>
          </div>

          <div className="bg-white rounded p-3 border border-slate-200">
            <div className="font-semibold text-slate-900 text-xs mb-2">🔀 Mode Differentiation</div>
            <div className="text-xs text-slate-700">
              <strong>Generation:</strong> Output = priced BOQ<br/>
              <strong>Validation:</strong> Output = variance report + conformance score<br/>
              <em>Same engine, different UX</em>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4">
        <div className="font-semibold text-green-900 text-sm mb-2">📊 Revenue Potential: Dual Mode Strategy</div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="font-semibold text-green-900 mb-1">Generation Mode (Year 1)</div>
            <div className="text-slate-700">
              1,200 BOQs @ R6,000 avg = <strong>R7.2M revenue</strong><br/>
              <span className="text-green-700">Users: Contractors, consulting engineers, government pre-tender planning</span>
            </div>
          </div>
          <div>
            <div className="font-semibold text-blue-900 mb-1">Validation Mode (Year 1)</div>
            <div className="text-slate-700">
              450 government subscriptions @ R8K/mo avg = <strong>R43.2M annual</strong><br/>
              <span className="text-blue-700">Users: Government procurement, eTender integration, contractors self-check</span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-green-200">
          <div className="font-semibold text-green-900">Combined Year 1: R50.4M Revenue Potential</div>
          <div className="text-slate-700 mt-1">Validation mode drives recurring revenue (subscriptions), Generation mode drives 
          transaction volume. Both modes reinforce each other: contractors using Generation become Validation customers for 
          quality control.</div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
        <div className="font-semibold text-amber-900 text-sm mb-1">💡 Investor Pitch Point</div>
        <div className="text-xs text-amber-800">
          "Qilly's dual functionality addresses the entire BOQ lifecycle: <strong>Generation when you need a starting point, 
          Validation when you need confidence in your numbers.</strong> This isn't feature bloat—it's the same AI pricing engine 
          serving different use cases. Contractors use Generation to bid faster, Validation to bid smarter. Government uses 
          Generation for realistic budgeting, Validation for corruption prevention. One platform, two revenue streams, complete 
          market coverage."
        </div>
      </div>
    </div>
  );
}
