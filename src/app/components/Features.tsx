import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import {
  CheckCircle2, Zap, Shield, TrendingUp,
  Building2, Globe, BarChart3, FileSpreadsheet,
  ChevronDown, ChevronUp, Star,
} from 'lucide-react';

const TIER_BADGE: Record<string, string> = {
  'ALL TIERS': 'bg-gray-100 text-gray-600',
  'PRO + ENTERPRISE': 'bg-blue-100 text-blue-700',
  'ENTERPRISE': 'bg-purple-100 text-purple-700',
  'ROADMAP': 'bg-orange-100 text-orange-700',
};

export function Features() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-12">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-[#0077b6] to-slate-900 text-white py-14 px-8 text-center">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Zap className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-semibold text-white/90">Built for South African Construction — Today and Tomorrow</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            South Africa's First<br />
            <span className="text-[#00b4d8]">AI-Augmented Construction</span><br />
            Cost Intelligence Platform
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed mb-6">
            Qilly prices complete Bills of Quantities — general building, civil works, steel construction, M&E, green building, and government eTender — in minutes using live data from 159 SA suppliers, BuildAid 2025/2026, and SANS 1200 specifications.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { n: '159', l: 'SA Suppliers' }, { n: '17/17', l: 'SANS 1200 Sections' },
              { n: 'CIDB 1–9', l: 'All Grades' }, { n: '9', l: 'Provinces' },
              { n: 'BuildAid 2025/26', l: 'Integrated' }, { n: 'POPIA', l: 'Compliant' },
            ].map(({ n, l }) => (
              <div key={l} className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-center">
                <div className="font-bold text-base">{n}</div>
                <div className="text-slate-400 text-xs">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Core Value Props ─────────────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">What Qilly Does Today</h2>
        <p className="text-center text-gray-500 text-sm mb-8">All capabilities available now — not a promise, a product.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: <FileSpreadsheet className="h-6 w-6 text-white" />, bg: 'bg-[#0077b6]',
              title: 'General Building BOQ', tier: 'ALL TIERS',
              body: 'Upload any BOQ (Excel/CSV) and receive a fully priced bill in under 5 minutes. Line items matched against 159 SA suppliers across all 17 SANS 1200 specification sections — masonry, concrete, finishes, plumbing, electrical, roofing, and more.',
            },
            {
              icon: <span className="text-white text-xl">🏗️</span>, bg: 'bg-slate-800',
              title: 'Steel Construction BOQ', tier: 'PRO + ENTERPRISE',
              body: 'Dedicated steel pricing engine covering 45+ steel items: reinforcing bar (Y8–Y32), BRC mesh, universal beams/columns, hollow sections, angles, flat plate, IBR roofing, Z/C purlins, fasteners, and fabrication allowances — sourced from ArcelorMittal SA, NJR Steel, BRC Reinforcing, Cape Gate, Macsteel, Bolt & Eng.',
            },
            {
              icon: <Globe className="h-6 w-6 text-white" />, bg: 'bg-emerald-600',
              title: 'Civil & Infrastructure BOQ', tier: 'ENTERPRISE',
              body: 'Price civil works BOQs per SANS 1200 A–DD: bulk earthworks, G4/G7 sub-base, asphalt surfacing, geotextiles, gabions, HDPE pipes, concrete structures, kerbing, and drainage. Sourced from G4 Cube, Afrimat, Much Asphalt, Kaytech, Maccaferri, Concor Readymix, and more.',
            },
            {
              icon: <BarChart3 className="h-6 w-6 text-white" />, bg: 'bg-purple-600',
              title: 'Provincial Price Intelligence', tier: 'ALL TIERS',
              body: 'Every BOQ is automatically adjusted for provincial freight. Cape Town is 12% above Gauteng base; Northern Cape 18%; KwaZulu-Natal 9%. All 9 provinces covered with municipality-level granularity — ensuring your Cape Town price is never the same as your Johannesburg price.',
            },
            {
              icon: <Shield className="h-6 w-6 text-white" />, bg: 'bg-amber-600',
              title: 'Collusion Detection', tier: 'ENTERPRISE',
              body: 'Statistical analysis identifies abnormally consistent supplier pricing patterns — a red flag for price-fixing in government eTender submissions. Generates a Competition Act compliance report per project. Required for CIDB Grade 6–9 government work.',
            },
            {
              icon: <Layers className="h-6 w-6 text-white" />, bg: 'bg-teal-600',
              title: 'Green Building & Environmental', tier: 'ENTERPRISE',
              body: 'GBCSA Green Star and SANS 10400-XA compliance costing. Embodied carbon per material line item. Solar PV and energy storage BOQ items priced from Solar MD and Suntech. Environmental impact reports generated automatically for ENTERPRISE tier projects.',
            },
          ].map(({ icon, bg, title, tier, body }) => (
            <Card key={title} className="border-2 hover:border-[#00b4d8] transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className={`p-3 ${bg} rounded-xl shrink-0`}>{icon}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <CardTitle className="text-sm">{title}</CardTitle>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TIER_BADGE[tier]}`}>{tier}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Steel Feature Spotlight ──────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 to-gray-800 text-white rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-8">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-3 py-1 mb-4">
              <span className="text-orange-300 text-xs font-semibold uppercase tracking-wide">New · Steel Construction Module</span>
            </div>
            <h2 className="text-2xl font-bold mb-3">Complete Steel BOQ Pricing Engine</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              Steel is 15–40% of total project cost on commercial and industrial buildings. Qilly's steel module gives QSs and contractors a dedicated pricing tool for the most volatile and complex cost category in construction.
            </p>
            <ul className="space-y-2">
              {[
                '45+ steel products across 8 categories — all SANS 1200 DF classified',
                'ArcelorMittal SA, NJR Steel, BRC Reinforcing, Cape Gate, Macsteel priced',
                'S275, S355, Grade 43, Grade 50, 450MPa reinforcing grades',
                'Automatic provincial freight adjustment (up to +18% for Northern Cape)',
                'Tonnage calculation per line item — total steel mass summary',
                'Fabrication allowances: welding, grit blasting, hot-dip galvanising, erection',
                'Export to Excel with project summary, BuildAid refs, and supplier attribution',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/5 border-l border-white/10 p-8">
            <h3 className="font-bold text-white mb-4">Steel Suppliers in Qilly's Pricing Engine</h3>
            <div className="space-y-2">
              {[
                { name: 'ArcelorMittal SA', role: 'Primary mill — structural sections, reinforcing, flat products', listing: 'JSE: ACL', badge: 'bg-blue-500/20 text-blue-300' },
                { name: 'BRC Reinforcing', role: 'Reinforcing mesh (Ref 188/193/196/D8-200)', listing: 'SA', badge: 'bg-green-500/20 text-green-300' },
                { name: 'Cape Gate', role: 'Reinforcing bar, wire products, binding wire', listing: 'SA', badge: 'bg-green-500/20 text-green-300' },
                { name: 'NJR Steel', role: 'Full sections distribution — 2,000+ stock items', listing: 'SA', badge: 'bg-amber-500/20 text-amber-300' },
                { name: 'Macsteel', role: 'All sections — B2B trade account required', listing: 'SA (B2B)', badge: 'bg-red-500/20 text-red-300' },
                { name: 'Safintra Roofing', role: 'IBR, corrugated, Chromadek sheeting', listing: 'AMSA Group', badge: 'bg-green-500/20 text-green-300' },
                { name: 'Bolt & Eng', role: 'Fasteners, bolts, chemical anchors', listing: 'SA', badge: 'bg-green-500/20 text-green-300' },
                { name: 'Vanderbijlpark Steel', role: 'Structural sections (near mill source)', listing: 'SA', badge: 'bg-amber-500/20 text-amber-300' },
                { name: 'JVR Steel', role: 'Pipes, CHS sections', listing: 'SA', badge: 'bg-amber-500/20 text-amber-300' },
              ].map(({ name, role, listing, badge }) => (
                <div key={name} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{name}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${badge}`}>{listing}</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Roadmap ──────────────────────────────────────────────────── */}
      <div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-3">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-700">Product Roadmap</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Building for Tomorrow's Construction</h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">Qilly is positioned for every major shift in the SA construction industry — from BIM adoption to green infrastructure, digital twins, and government eTender compliance.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { phase: 'Q3 2026', title: 'Live ArcelorMittal Price Feed', desc: 'Direct REST API from AMSA for daily mill prices on structural sections, reinforcing bar, and flat products.', icon: '⚡', colour: 'border-blue-200 bg-blue-50' },
            { phase: 'Q3 2026', title: 'Steel QTO from Drawings', desc: 'Upload a structural GA drawing — Qilly AI extracts member sizes, lengths, and generates a complete steel schedule automatically.', icon: '🤖', colour: 'border-purple-200 bg-purple-50' },
            { phase: 'Q4 2026', title: 'eTender Bid Preparation', desc: 'Full eTender-ready BOQ packages with B-BBEE scoring, CIDB grading documentation, and Competition Act compliance reports.', icon: '📋', colour: 'border-amber-200 bg-amber-50' },
            { phase: 'Q1 2027', title: 'BIM/IFC Integration (Tekla & Revit)', desc: 'Import Tekla Structures or Revit IFC files — Qilly reads the model and auto-prices the complete steel and building package.', icon: '🏗️', colour: 'border-teal-200 bg-teal-50' },
            { phase: 'Q1 2027', title: 'Carbon Cost per Material', desc: 'Embodied carbon (kgCO₂e) per line item from the ICE database. Green Star and LEED credit documentation auto-generated.', icon: '🌿', colour: 'border-green-200 bg-green-50' },
            { phase: 'Q2 2027', title: 'Digital Twin Cost Intelligence', desc: 'Link your BOQ to a live project cost model. AMSA quarterly price adjustments re-price your project automatically — live budget forecasting.', icon: '🔮', colour: 'border-slate-200 bg-slate-50' },
          ].map(({ phase, title, desc, icon, colour }) => (
            <div key={title} className={`rounded-xl border-2 p-4 ${colour}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{phase}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tier Comparison ──────────────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Subscription Tiers</h2>
        <p className="text-center text-gray-500 text-sm mb-8">Designed for every stage of a contractor's growth — from EME to Grade 9.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: 'FREE', price: 'R0/month', subtitle: 'Training Mode', colour: 'border-gray-200', headerBg: 'bg-gray-50',
              cidb: 'Grade 1–2', features: ['BuildAid 2025/2026 template library', 'Encrypted pricing (training only)', 'No live supplier data', 'Unlimited template views', 'POPIA-compliant data handling'],
            },
            {
              name: 'PROFESSIONAL', price: 'R2,999/month', subtitle: '10 BOQs/month', colour: 'border-[#0077b6]', headerBg: 'bg-[#0077b6]',
              textWhite: true, cidb: 'Grade 2–5', features: ['10 priced BOQs per month', 'General building BOQ (all categories)', 'Steel BOQ pricing engine', 'Provincial pricing (9 provinces)', '159-supplier network', 'Excel/PDF export', 'Stitch/PayFast auto-approval'],
            },
            {
              name: 'ENTERPRISE', price: 'R8,999/month', subtitle: '30 BOQs/month', colour: 'border-purple-500', headerBg: 'bg-gradient-to-r from-purple-600 to-[#0077b6]',
              textWhite: true, cidb: 'Grade 5–9', features: ['30 priced BOQs per month', 'Steel + civil + M&E BOQ modules', 'Collusion detection reports', 'Green building & environmental', 'eTender bid preparation', 'Multi-user team management', 'GBCSA/SANS 10400-XA compliance', 'Priority support'],
            },
            {
              name: 'CUSTOM', price: 'Contact us', subtitle: 'Unlimited', colour: 'border-slate-700', headerBg: 'bg-slate-800',
              textWhite: true, cidb: 'Grade 8–9', features: ['Unlimited BOQs', 'All ENTERPRISE features', 'BIM/IFC integration (roadmap)', 'Digital twin cost model (roadmap)', 'Dedicated account manager', 'Custom data supply agreements', 'On-site training & implementation'],
            },
          ].map(({ name, price, subtitle, colour, headerBg, textWhite, cidb, features }) => (
            <div key={name} className={`rounded-2xl border-2 overflow-hidden ${colour} ${name === 'PROFESSIONAL' ? 'shadow-lg scale-[1.02]' : ''}`}>
              <div className={`${headerBg} px-4 py-4 ${textWhite ? 'text-white' : 'text-gray-900'}`}>
                {name === 'PROFESSIONAL' && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                    <span className="text-xs font-bold text-yellow-200 uppercase tracking-wide">Most Popular</span>
                  </div>
                )}
                <p className="font-bold text-lg">{name}</p>
                <p className="text-xl font-bold mt-0.5">{price}</p>
                <p className={`text-xs mt-0.5 ${textWhite ? 'text-white/70' : 'text-gray-500'}`}>{subtitle} · CIDB {cidb}</p>
              </div>
              <div className="p-4 space-y-1.5">
                {features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700 leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why Qilly ───────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Why Qilly for Steel?</h2>
        <p className="text-center text-gray-500 text-sm mb-6 max-w-xl mx-auto">Steel pricing is the most volatile and complex category in construction — here is how Qilly addresses that.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { q: 'Why is steel so hard to price?', a: 'Steel prices change with global commodity markets, USD/ZAR exchange rates, and ArcelorMittal SA\'s quarterly price adjustments. A BOQ priced with 6-month-old steel rates can be 15–25% below actual cost — causing contractors to price themselves into losses.' },
            { q: 'How does Qilly handle steel price volatility?', a: 'Qilly uses BuildAid 2025/2026 as the primary reference (updated annually) and provides supplier comparison across ArcelorMittal, NJR Steel, BRC, Cape Gate, and Macsteel. The Q3 2026 roadmap adds daily price feed from AMSA via REST API.' },
            { q: 'What steel standard does Qilly follow?', a: 'SANS 1200 DF — Structural Steelwork, and SANS 920/SABS 1024 for reinforcing steel. All items are classified by steel grade: S275 (Grade 43), S355 (Grade 50), and 450MPa reinforcing (SABS 920).' },
            { q: 'Does Qilly cover fabrication costs?', a: 'Yes — fabrication allowances are included: general structural fabrication (R18,500/tonne), grit blasting to SA2.5 (R185/m²), zinc-rich primer (R145/m²), hot-dip galvanising (R9,500/tonne), and erection (R12,500/tonne).' },
            { q: 'Can I price a complete steel industrial shed?', a: 'Yes. Add structural columns (UC), roof beams (UB), purlins (Z/C sections), IBR cladding, girts, wind bracing (SHS/angles), gutter and ridge flashing, anchor bolts, and fabrication — all from the Steel Catalogue tab in one session.' },
            { q: 'What about reinforced concrete and mixed structures?', a: 'Use the general BOQ Upload for concrete items (PPC cement, readymix, formwork) and the Steel BOQ for the reinforcing bar (Y10–Y32) and BRC mesh — then combine both into your project total.' },
          ].map(({ q, a }, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="font-semibold text-sm text-gray-900">{q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#0077b6] to-[#00b4d8] rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Start Pricing Steel BOQs Today</h2>
        <p className="text-blue-100 text-sm mb-5 max-w-lg mx-auto">
          Price your first complete steel construction bill of quantities — reinforcing, structural sections, roofing, and fabrication — in under 10 minutes. Backed by BuildAid 2025/2026 and 9 SA steel suppliers.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <div className="bg-white/10 border border-white/30 rounded-xl px-5 py-2.5 text-sm font-medium">
            🔩 45+ Steel Items in Catalogue
          </div>
          <div className="bg-white/10 border border-white/30 rounded-xl px-5 py-2.5 text-sm font-medium">
            📊 Excel Export with Tonnage Summary
          </div>
          <div className="bg-white/10 border border-white/30 rounded-xl px-5 py-2.5 text-sm font-medium">
            🏗️ SANS 1200 DF Compliant
          </div>
        </div>
      </div>

    </div>
  );
}
