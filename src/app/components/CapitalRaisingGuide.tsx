import { useState } from 'react';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle
} from 'docx';
import { saveAs } from 'file-saver';
import {
  Copy, Check, Mail, BookOpen, Shield, ChevronDown, ChevronUp,
  Building2, Globe, TrendingUp, DollarSign, Users, FileText,
  AlertCircle, Star, Briefcase, ArrowRight, Target, Lightbulb,
  BarChart3, Lock, Zap, Download, FileDown
} from 'lucide-react';
import { toast } from 'sonner';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Tab = 'emails' | 'how-they-work' | 'approach';
type EmailKey = 'privateVc' | 'transactional' | 'government';

interface EmailTemplate {
  key: EmailKey;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  colour: string;
  border: string;
  badge: string;
  badgeColour: string;
  subject: string;
  recipient: string;
  recipientTitle: string;
  body: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Copy button
// ─────────────────────────────────────────────────────────────────────────────
function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-all shadow-sm"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Email templates data
// ─────────────────────────────────────────────────────────────────────────────
const emailTemplates: EmailTemplate[] = [
  {
    key: 'privateVc',
    label: 'Private Fund Manager / VC',
    subtitle: 'e.g. Knife Capital, Naspers Foundry, 4Di Capital, Hlayisani Capital',
    icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
    colour: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'EMAIL 1',
    badgeColour: 'bg-purple-100 text-purple-700',
    subject: 'Investment Opportunity — Qilly Construction Tech | SaaS | 2.5% Carry | South Africa',
    recipient: '[Fund Manager Name]',
    recipientTitle: '[Fund / VC Firm Name]',
    body: `Dear [Fund Manager Name],

I trust this message finds you well. My name is Kgabo Sekhula, Founder and CEO of Qilly (Pty) Ltd (Registration No. K2026156151), a South African PropTech / ConTech SaaS company headquartered in Pretoria, Gauteng.

─────────────────────────────────────────────
WHAT QILLY DOES
─────────────────────────────────────────────
Qilly is a cloud-based construction billing intelligence platform that automatically prices Bills of Quantities (BOQ) using live supplier data and BuildAid 2025/2026 standards — eliminating the manual pricing process that costs South African contractors R2 – R15 billion annually in pricing errors, delays, and rework.

Our platform delivers a complete priced BOQ in under 5 minutes, with 100% accuracy.

─────────────────────────────────────────────
THE MARKET OPPORTUNITY
─────────────────────────────────────────────
• South Africa's construction sector is a R267 billion/year industry
• 120,000+ registered CIDB contractors are underserved by modern pricing tools
• Government eTender integration (SIPDM/CIDB compliance) is built into our Enterprise tier
• Addressable market: R4.8 billion/year in construction QS software licences
• International expansion pathway: SADC, East Africa, MENA (Dubai/UAE construction tech boom)

─────────────────────────────────────────────
BUSINESS MODEL — 4 SUBSCRIPTION TIERS
─────────────────────────────────────────────
  FREE         — Training mode (data capture & pipeline)
  PROFESSIONAL — R2,999/month (10 BOQs/month)
  ENTERPRISE   — R8,999/month (30 BOQs/month, green building, eTender, multi-user)
  CUSTOM       — Unlimited (government bodies & large contractors)

Payment-gated login, POPIA-compliant, Stitch & PayFast integrated.
12-month revenue target: R8.5M ARR (based on 80 PROFESSIONAL + 20 ENTERPRISE clients).

─────────────────────────────────────────────
THE ASK
─────────────────────────────────────────────
We are raising [INSERT CAPITAL AMOUNT, e.g. R5,000,000 – R20,000,000] in growth capital for:
  • Infrastructure scaling (Supabase → dedicated cloud, ISO 27001)
  • Sales team (3 enterprise account executives)
  • Government tender activation (CIDB & SEDA partnership)
  • SADC market expansion

─────────────────────────────────────────────
INVESTOR PROPOSITION — 2.5% CARRY
─────────────────────────────────────────────
We are offering [Fund Name] a 2.5% equity stake (or revenue share, or carry — subject to structure negotiation) in recognition of capital placement and/or introductions to co-investors.

This is structured as a success-aligned fee to ensure our interests are fully aligned. We welcome discussion on the optimal capital structure for your fund mandate.

─────────────────────────────────────────────
WHY NOW
─────────────────────────────────────────────
• Working product live in DEV and SIT (Figma Make → GitHub → Vercel deployment)
• Regression-tested with Selenium suite (33 automated test cases, 21 passing)
• No comparable automated BOQ pricing tool exists in the South African market
• First-mover advantage is critical — we are 6–12 months ahead of any potential competitor

─────────────────────────────────────────────
NEXT STEPS
─────────────────────────────────────────────
I would welcome a 30-minute introductory call at your earliest convenience. I can provide:
  ✓ Full pitch deck (investor-ready)
  ✓ Live platform demo (SIT environment)
  ✓ 3-year financial projections
  ✓ Due diligence data room access

Please contact me at:
  📧  kgabo@qilly.co.za
  📞  +27 83 941 2655
  📍  210 Kirkness Avenue, Pierre van Ryneveld, Centurion, 0157

I look forward to exploring this opportunity with you.

Warm regards,

Kgabo Sekhula
Founder & CEO — Qilly (Pty) Ltd
Registration: K2026156151
Construction Billing Intelligence`,
  },
  {
    key: 'transactional',
    label: 'Transactional Advisor / Investment Bank',
    subtitle: 'e.g. Nedbank CIB, RMB Advisory, KPMG Deal Advisory, Deloitte Corporate Finance, Bravura Capital',
    icon: <Briefcase className="w-5 h-5 text-blue-600" />,
    colour: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'EMAIL 2',
    badgeColour: 'bg-blue-100 text-blue-700',
    subject: 'Mandate Enquiry — Capital Raise Advisory for Qilly (Pty) Ltd | ConTech SaaS | South Africa',
    recipient: '[Advisor Name]',
    recipientTitle: '[Advisory Firm Name]',
    body: `Dear [Advisor Name],

I write to enquire whether [Advisory Firm Name] would consider accepting a capital raise mandate on behalf of Qilly (Pty) Ltd (Registration No. K2026156151).

─────────────────────────────────────────────
ABOUT QILLY
─────────────────────────────────────────────
Qilly is a South African SaaS platform that automates the pricing of Bills of Quantities (BOQ) for the construction sector — the first of its kind in Sub-Saharan Africa. Our technology integrates live supplier price data with BuildAid 2025/2026 industry standards and CIDB-compliant outputs.

Sector classification: ConTech / PropTech / GovTech
Stage: Seed/Series A (working product, pre-revenue scaling)
Founders: Kgabo Sekhula (Founder & CEO)
Registered address: 210 Kirkness Avenue, Pierre van Ryneveld, Centurion, 0157

─────────────────────────────────────────────
MANDATE OVERVIEW
─────────────────────────────────────────────
Mandate type:      Capital Raise Advisory (Equity / Revenue Share / Hybrid)
Capital target:    R[X]M – R[Y]M
Use of funds:      Product scaling, sales headcount, government sector activation
Investor target:   Private VC, DFI (IDC / NEF / SEFA), strategic corporates
Timeline:          [e.g. Q2 2026 close target]

─────────────────────────────────────────────
OUR OFFER TO YOUR FIRM
─────────────────────────────────────────────
We propose a 2.5% success fee on total capital raised, payable on close of each tranche.

We are open to structuring this as:
  (a) Pure success fee (no retainer) — preferred
  (b) Nominal retainer + reduced success fee
  (c) A hybrid carry / co-investment arrangement

We believe this offer is competitive and reflects our commitment to aligning incentives with your firm's performance.

─────────────────────────────────────────────
WHAT WE PROVIDE FOR DUE DILIGENCE
─────────────────────────────────────────────
  ✓ Executive summary and business overview
  ✓ Full investor pitch deck
  ✓ 3-year financial model (revenue, cost, EBITDA projections)
  ✓ Market sizing analysis (South African + SADC)
  ✓ Technology documentation (architecture, security, POPIA compliance)
  ✓ Management team CVs
  ✓ Current client pipeline / LOIs (if applicable)
  ✓ Live platform demonstration

─────────────────────────────────────────────
WHY THIS DEAL MAKES SENSE
─────────────────────────────────────────────
• The South African construction sector is R267B/year — largely undigitised
• Government eTender / CIDB compliance built-in = public sector market access
• Recurring SaaS revenue model with high switching costs (data lock-in)
• No direct competitor in the automated BOQ pricing space in South Africa
• Clear SADC and Africa expansion pathway (East Africa, MENA in Year 3)

─────────────────────────────────────────────
PROPOSED NEXT STEP
─────────────────────────────────────────────
I would welcome a brief introductory call (20–30 minutes) to assess mutual fit and discuss how a mandate might be structured. If [Advisory Firm Name] does not typically work at this stage, I would also appreciate any referral to an appropriate advisory contact.

Contact details:
  📧  kgabo@qilly.co.za
  📞  +27 83 941 2655
  📍  210 Kirkness Avenue, Pierre van Ryneveld, Centurion, 0157

I look forward to your response and thank you for your time.

Yours sincerely,

Kgabo Sekhula
Founder & CEO — Qilly (Pty) Ltd
Registration: K2026156151`,
  },
  {
    key: 'government',
    label: 'Government / Development Finance Institution (DFI)',
    subtitle: 'e.g. IDC, NEF, SEFA, SEDA, dtic, NYDA, Gauteng Growth and Development Agency (GGDA)',
    icon: <Globe className="w-5 h-5 text-green-600" />,
    colour: 'bg-green-50',
    border: 'border-green-200',
    badge: 'EMAIL 3',
    badgeColour: 'bg-green-100 text-green-700',
    subject: 'Funding Application Enquiry — Qilly (Pty) Ltd | ConTech SaaS | Black-Owned | South Africa',
    recipient: '[Programme Officer / Fund Manager Name]',
    recipientTitle: '[Institution Name — e.g. IDC / NEF / SEFA / GGDA]',
    body: `Dear [Programme Officer Name],

I respectfully submit this letter as a formal enquiry regarding funding or investment support available from [Institution Name] for an innovative South African technology company.

─────────────────────────────────────────────
COMPANY PROFILE
─────────────────────────────────────────────
Company name:      Qilly (Pty) Ltd
Registration No.:  K2026156151
Address:           210 Kirkness Avenue, Pierre van Ryneveld, Centurion, 0157
Contact:           +27 83 941 2655 | kgabo@qilly.co.za
Founder/CEO:       Kgabo Sekhula
Sector:            Information Technology / Construction Technology (ConTech)
B-BBEE Status:     [Insert B-BBEE level — Black-owned & managed]
SARS Tax No.:      [Insert]
Stage:             Seed / Early Growth (product live, revenue-generating)

─────────────────────────────────────────────
WHAT QILLY DOES — ECONOMIC IMPACT FRAMING
─────────────────────────────────────────────
Qilly is a cloud-based platform that automates the pricing of Bills of Quantities (BOQ) for the South African construction sector using BuildAid 2025/2026 standards and live supplier data.

The construction sector contributes approximately 4.1% to South Africa's GDP and employs over 1.3 million people. Yet 78% of small and medium-sized contractors (Grade 1–7 CIDB) price their BOQs manually — leading to pricing errors, tender losses, and project failures.

Qilly solves this by delivering a 100% accurate, fully priced BOQ in under 5 minutes, making it accessible to contractors at all CIDB grades.

─────────────────────────────────────────────
ALIGNMENT WITH [INSTITUTION]'s MANDATE
─────────────────────────────────────────────
  ✓ Black-owned and Black-managed technology company
  ✓ Serves small and medium contractors (CIDB Grade 1–7)
  ✓ Creates downstream job security for 120,000+ CIDB-registered firms
  ✓ Government eTender integration (SIPDM/CIDB compliance)
  ✓ Built for South Africa — POPIA compliant, priced in ZAR
  ✓ Supports NDP Goal 4 (Skills) & Goal 9 (Transforming the economy)
  ✓ Potential to extend to SADC bloc — forex earnings for SA

─────────────────────────────────────────────
FUNDING REQUIREMENT
─────────────────────────────────────────────
We are seeking:
  Amount:    R[X]M – R[Y]M
  Structure: [Soft loan / Grant / Equity / Blended finance — as available]
  Purpose:
    • Cloud infrastructure and cybersecurity (POPIA / ISO 27001)
    • Sales and customer success team (3 permanent positions)
    • CIDB/SEDA partnership activation
    • SADC market development

─────────────────────────────────────────────
OUR COMMITMENT — 2.5% CARRY / REFERRAL FEE
─────────────────────────────────────────────
Where [Institution Name] facilitates an introduction to a co-funder, private partner, or strategic investor that results in a confirmed capital placement, Qilly will pay a 2.5% success/referral fee on the capital raised from that introduction.

This demonstrates our commitment to mutually beneficial, performance-aligned partnerships.

─────────────────────────────────────────────
SOCIAL AND ECONOMIC IMPACT METRICS (YEAR 3)
─────────────────────────────────────────────
  • 500+ CIDB contractors digitised (from current 0)
  • 3,000+ BOQs priced automatically per month
  • 8 permanent jobs created (Year 1); 25+ by Year 3
  • Estimated R420M in contractor pricing errors prevented annually
  • R8.5M+ ARR (Year 3), creating sustainable tax revenues

─────────────────────────────────────────────
DOCUMENTS AVAILABLE ON REQUEST
─────────────────────────────────────────────
  ✓ Company registration certificate (CIPC)
  ✓ POPIA compliance framework
  ✓ Business plan (full version)
  ✓ 3-year financial projections
  ✓ Pitch deck (investor format)
  ✓ Platform demonstration (live SIT environment)
  ✓ B-BBEE certificate / affidavit
  ✓ Tax clearance certificate (SARS)

─────────────────────────────────────────────
NEXT STEP
─────────────────────────────────────────────
I kindly request a meeting or call at [Institution Name]'s convenience to discuss eligibility, applicable programmes, and the application process.

I can be reached at:
  📧  kgabo@qilly.co.za
  📞  +27 83 941 2655
  📍  210 Kirkness Avenue, Pierre van Ryneveld, Centurion, 0157

Thank you for the important work [Institution Name] does in developing South Africa's economy. I look forward to your positive response.

Yours faithfully,

Kgabo Sekhula
Founder & CEO — Qilly (Pty) Ltd
Registration: K2026156151`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HOW THEY WORK — data
// ─────────────────────────────────────────────────────────────────────────────
const entities = [
  {
    type: 'Private Venture Capital (VC) / Private Equity',
    icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
    colour: 'border-purple-200 bg-purple-50',
    badge: 'bg-purple-100 text-purple-700',
    examples: ['Knife Capital', 'Naspers Foundry', '4Di Capital', 'Hlayisani Capital', 'Edge Growth', 'Savant Venture Fund'],
    howTheyWork: [
      'Pool capital from Limited Partners (LPs) — pension funds, family offices, HNWIs',
      'Deploy capital in return for equity (shares) in your company',
      'Target 10×+ return over a 5–7 year investment horizon',
      'Typically require a board seat or observer rights',
      'Conduct thorough due diligence: financials, team, product, market',
    ],
    whatTheyWant: [
      'Scalable SaaS model with recurring revenue (MRR/ARR growth)',
      'Strong founding team with domain expertise',
      'Clear exit strategy (IPO, trade sale, secondary buyout)',
      'Market leadership potential — "can this be #1 in SA, then Africa?"',
      'B-BBEE alignment increasingly important for SA VCs',
    ],
    timeline: '3–6 months from first meeting to term sheet',
    fee: '2.5% carry/equity is reasonable for a finder or co-investor referral. For direct VC equity, expect 15–35% equity for seed round.',
    risk: 'High — they may require board control at early stage',
    colour2: 'text-purple-700',
  },
  {
    type: 'Transactional Advisors / Corporate Finance Houses',
    icon: <Briefcase className="w-5 h-5 text-blue-600" />,
    colour: 'border-blue-200 bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
    examples: ['Nedbank CIB', 'RMB Advisory', 'KPMG Deal Advisory', 'Deloitte Corporate Finance', 'Bravura Capital', 'Nodus Capital'],
    howTheyWork: [
      'They do NOT invest their own money — they find investors FOR you',
      'Earn a success fee (typically 2–5% of capital raised) on deal close',
      'Prepare investor-ready documents: pitch deck, financial model, teaser',
      'Manage the investor roadshow and due diligence process',
      'Negotiate term sheets and transaction agreements on your behalf',
    ],
    whatTheyWant: [
      'A viable, fundable business (they will assess your "deal quality")',
      'Clear use of funds and credible financial projections',
      'Committed, coachable founders',
      'A deal size that justifies their effort (typically R5M+ for smaller advisors)',
      'Your 2.5% success fee offer is exactly how they are compensated',
    ],
    timeline: '1–4 months to mandate; 3–9 months to capital close',
    fee: '2.5% is at the lower end — standard is 3–5%. Position it as a starting point with room for negotiation.',
    risk: 'Low conflict of interest — they only earn if you raise',
    colour2: 'text-blue-700',
  },
  {
    type: 'Government & Development Finance Institutions (DFIs)',
    icon: <Globe className="w-5 h-5 text-green-600" />,
    colour: 'border-green-200 bg-green-50',
    badge: 'bg-green-100 text-green-700',
    examples: ['IDC (Industrial Development Corporation)', 'NEF (National Empowerment Fund)', 'SEFA (Small Enterprise Finance Agency)', 'SEDA (Small Enterprise Development Agency)', 'GGDA (Gauteng Growth & Development Agency)', 'dtic (Dept. of Trade, Industry and Competition)', 'NYDA (National Youth Development Agency)'],
    howTheyWork: [
      'Funded by the South African government to catalyse economic development',
      'Offer soft loans (below-prime rates), grants, equity, or blended finance',
      'Have specific mandates: youth, women, black-owned, rural, or sector-specific',
      'Move SLOWLY — applications, committees, due diligence can take 3–12 months',
      'Require detailed business plans, financials, B-BBEE documentation, and impact metrics',
    ],
    whatTheyWant: [
      'Strong B-BBEE profile (black-owned, -managed, -controlled)',
      'Job creation commitment — how many permanent jobs will this fund create?',
      'Alignment with national priorities (NDP, IPAP, SMME development)',
      'Sector alignment — construction, technology, and digital economy are current priorities',
      'Social and economic impact metrics (beyond just profit)',
    ],
    timeline: '3–12 months from application to approval — be patient',
    fee: '2.5% referral fee is appropriate when a DFI introduces you to a private co-funder; not applicable to the DFI itself (they do not earn fees).',
    risk: 'Process-heavy, slow, but non-dilutive (grants) or low-cost (soft loans)',
    colour2: 'text-green-700',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SOLID APPROACH — data
// ─────────────────────────────────────────────────────────────────────────────
const approachSteps = [
  {
    step: '01',
    icon: <FileText className="w-5 h-5 text-indigo-600" />,
    title: 'Prepare Your Data Room First',
    colour: 'bg-indigo-50 border-indigo-200',
    items: [
      { label: 'Company registration', note: 'CIPC certificate — K2026156151', done: true },
      { label: 'Pitch deck (10–12 slides)', note: 'Problem → Solution → Market → Business Model → Traction → Team → Ask', done: false },
      { label: '3-year financial model', note: 'Monthly P&L, cash flow, balance sheet, MRR waterfall', done: false },
      { label: 'Tax clearance (SARS)', note: 'Required for all DFI/government applications', done: false },
      { label: 'B-BBEE certificate or affidavit', note: 'Level 1 target — critical for DFI and government sector', done: false },
      { label: 'Platform demo environment', note: 'SIT environment is ready — Figma Make → Vercel', done: true },
      { label: 'POPIA compliance documentation', note: 'Already implemented in the platform', done: true },
      { label: 'LOIs or client pipeline', note: 'Even 3 signed Letters of Intent boost credibility enormously', done: false },
    ],
  },
  {
    step: '02',
    icon: <DollarSign className="w-5 h-5 text-amber-600" />,
    title: 'Define Your Capital Ask Precisely',
    colour: 'bg-amber-50 border-amber-200',
    items: [
      { label: 'Set a specific range', note: 'e.g. R5M – R15M (not "we\'re open to offers" — that signals weakness)', done: false },
      { label: 'Break down use of funds', note: 'Infrastructure 30% | Sales 40% | Government Activation 20% | Working Capital 10%', done: false },
      { label: 'Define milestones per tranche', note: 'Tranche 1: R3M → 50 clients | Tranche 2: R7M → 150 clients + SADC launch', done: false },
      { label: 'State the equity / carry clearly', note: '2.5% to the fund manager who places the capital — on success basis', done: false },
      { label: 'Have a valuation basis', note: 'SaaS ARR multiple (e.g. 5x projected Year-2 ARR = R42.5M pre-money)', done: false },
    ],
  },
  {
    step: '03',
    icon: <Target className="w-5 h-5 text-rose-600" />,
    title: 'Sequence Your Outreach Strategically',
    colour: 'bg-rose-50 border-rose-200',
    items: [
      { label: 'Start with DFIs (SEFA / NEF / SEDA)', note: 'Non-dilutive funding first — protects your equity', done: false },
      { label: 'Approach transactional advisors in parallel', note: 'They find the money — let them work for their 2.5%', done: false },
      { label: 'VC/PE rounds last', note: 'Use DFI approval as validation — VCs trust government due diligence', done: false },
      { label: 'Send exactly 3 emails per category', note: 'Quality over quantity — personalise each email, never use a mass template', done: false },
      { label: 'Follow up in 5 business days', note: 'A polite follow-up email if no response — once only', done: false },
    ],
  },
  {
    step: '04',
    icon: <Shield className="w-5 h-5 text-teal-600" />,
    title: 'Protect the Business — Due Diligence Readiness',
    colour: 'bg-teal-50 border-teal-200',
    items: [
      { label: 'Register IP / trademark "Qilly"', note: 'CIPC trademark registration — protect the brand before any investor deal', done: false },
      { label: 'Separate founder & company accounts', note: 'Business bank account (FNB Business Cheque) strictly for company', done: true },
      { label: 'Shareholder agreement in place', note: 'Even solo founder — cover future co-founder or investor share classes', done: false },
      { label: 'NDA ready to send', note: 'Simple, South African-law NDA for sharing sensitive financials', done: false },
      { label: 'Director disclosure pack', note: 'Your CV, background, any directorships — investors WILL Google you', done: false },
      { label: 'Vesting schedule', note: '4-year cliff + monthly vest for any future co-founder shares', done: false },
    ],
  },
  {
    step: '05',
    icon: <BarChart3 className="w-5 h-5 text-sky-600" />,
    title: 'The Killer Pitch — Key Numbers to Lead With',
    colour: 'bg-sky-50 border-sky-200',
    items: [
      { label: 'R267 billion/year', note: 'South African construction sector annual value — total addressable market context', done: true },
      { label: '120,000+ CIDB contractors', note: 'Target customers — largely unserved by digital pricing tools', done: true },
      { label: 'Under 5 minutes', note: 'Time to generate a complete priced BOQ vs 3–5 days manual — the WOW stat', done: true },
      { label: '100% pricing accuracy', note: 'Live supplier data + BuildAid 2025/2026 = zero human error', done: true },
      { label: 'R8.5M ARR (Year 3 target)', note: 'Based on 80 PRO + 20 ENT clients — conservative model', done: false },
      { label: 'First mover in SA', note: 'No direct competitor for automated BOQ pricing in Sub-Saharan Africa', done: true },
    ],
  },
  {
    step: '06',
    icon: <Lightbulb className="w-5 h-5 text-orange-600" />,
    title: 'Common Mistakes to Avoid',
    colour: 'bg-orange-50 border-orange-200',
    items: [
      { label: 'Never give equity for "advice"', note: 'Advisors are paid in cash (success fee). Equity is for investors only.', done: true },
      { label: 'Do not raise at too low a valuation', note: 'Seed rounds for SaaS in SA: R15M–R50M pre-money is credible', done: false },
      { label: 'Do not chase one investor only', note: 'Run 5–10 conversations in parallel — investor processes are slow', done: false },
      { label: 'Do not sign exclusivity too early', note: 'Term sheets with 60+ day exclusivity lock you out of better deals', done: false },
      { label: 'Always have an attorney review term sheets', note: 'Especially anti-dilution, liquidation preference, and drag-along clauses', done: false },
      { label: 'Keep the 2.5% carry offer professional', note: 'Put it in writing — an LOE (Letter of Engagement) protects both parties', done: false },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Word document generation helpers
// ─────────────────────────────────────────────────────────────────────────────
const QILLY_BLUE = '0077B6';
const QILLY_LIGHT = '00B4D8';

function makeHeading(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_1) {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 300, after: 120 },
  });
}

function makeSubheading(text: string) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        color: QILLY_BLUE,
        size: 22,
        allCaps: true,
      }),
    ],
    spacing: { before: 280, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: QILLY_LIGHT },
    },
  });
}

function makePara(text: string, opts?: { bold?: boolean; color?: string; size?: number }) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: opts?.bold,
        color: opts?.color,
        size: opts?.size ?? 20,
      }),
    ],
    spacing: { before: 60, after: 60 },
  });
}

function makeBullet(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: 20 })],
    bullet: { level: 0 },
    spacing: { before: 40, after: 40 },
  });
}

function makeRule() {
  return new Paragraph({
    children: [new TextRun({ text: '' })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' } },
    spacing: { before: 120, after: 120 },
  });
}

function makeCoverBlock(companyName: string, docTitle: string, subtitle: string, date: string) {
  return [
    new Paragraph({
      children: [new TextRun({ text: companyName, bold: true, color: QILLY_BLUE, size: 48 })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 160 },
    }),
    new Paragraph({
      children: [new TextRun({ text: docTitle, bold: true, size: 36 })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
    }),
    new Paragraph({
      children: [new TextRun({ text: subtitle, color: '666666', size: 22 })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: date, color: '888888', size: 20 })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 600 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'CONFIDENTIAL — NOT FOR GENERAL CIRCULATION', bold: true, color: 'CC0000', size: 20 })],
      alignment: AlignmentType.CENTER,
    }),
    makeRule(),
  ];
}

// Build a single email Word doc
function buildEmailDoc(template: EmailTemplate): Document {
  const lines = template.body.split('\n');

  const bodyParagraphs: Paragraph[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('─') || trimmed.startsWith('─────')) {
      // divider — skip (section headers follow)
      continue;
    }
    if (
      trimmed === 'WHAT QILLY DOES' ||
      trimmed === 'THE MARKET OPPORTUNITY' ||
      trimmed === 'BUSINESS MODEL — 4 SUBSCRIPTION TIERS' ||
      trimmed === 'THE ASK' ||
      trimmed === 'INVESTOR PROPOSITION — 2.5% CARRY' ||
      trimmed === 'WHY NOW' ||
      trimmed === 'NEXT STEPS' ||
      trimmed === 'ABOUT QILLY' ||
      trimmed === 'MANDATE OVERVIEW' ||
      trimmed === "OUR OFFER TO YOUR FIRM" ||
      trimmed === 'WHAT WE PROVIDE FOR DUE DILIGENCE' ||
      trimmed === 'WHY THIS DEAL MAKES SENSE' ||
      trimmed === 'PROPOSED NEXT STEP' ||
      trimmed === 'COMPANY PROFILE' ||
      trimmed === 'WHAT QILLY DOES — ECONOMIC IMPACT FRAMING' ||
      trimmed.startsWith('ALIGNMENT WITH') ||
      trimmed === 'FUNDING REQUIREMENT' ||
      trimmed === 'OUR COMMITMENT — 2.5% CARRY / REFERRAL FEE' ||
      trimmed === 'SOCIAL AND ECONOMIC IMPACT METRICS (YEAR 3)' ||
      trimmed === 'DOCUMENTS AVAILABLE ON REQUEST' ||
      trimmed === 'NEXT STEP'
    ) {
      bodyParagraphs.push(makeSubheading(trimmed));
      continue;
    }
    if (trimmed.startsWith('•') || trimmed.startsWith('✓') || trimmed.startsWith('(a)') || trimmed.startsWith('(b)') || trimmed.startsWith('(c)')) {
      bodyParagraphs.push(makeBullet(trimmed));
      continue;
    }
    if (trimmed === '') {
      bodyParagraphs.push(new Paragraph({ text: '', spacing: { before: 40, after: 40 } }));
      continue;
    }
    bodyParagraphs.push(makePara(trimmed));
  }

  return new Document({
    styles: {
      default: {
        heading1: {
          run: { color: QILLY_BLUE, bold: true, size: 28 },
        },
      },
    },
    sections: [
      {
        children: [
          ...makeCoverBlock(
            'Qilly (Pty) Ltd',
            template.label,
            'Capital Raising Email Template — 2.5% Carry / Success Fee',
            'March 2026'
          ),
          new Paragraph({
            children: [
              new TextRun({ text: 'TO: ', bold: true, size: 20 }),
              new TextRun({ text: `${template.recipient}, ${template.recipientTitle}`, size: 20 }),
            ],
            spacing: { before: 100, after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'FROM: ', bold: true, size: 20 }),
              new TextRun({ text: 'Kgabo Sekhula, CEO — kgabo@qilly.co.za | +27 83 941 2655', size: 20 }),
            ],
            spacing: { before: 60, after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'SUBJECT: ', bold: true, size: 20 }),
              new TextRun({ text: template.subject, bold: true, color: QILLY_BLUE, size: 20 }),
            ],
            spacing: { before: 60, after: 120 },
          }),
          makeRule(),
          ...bodyParagraphs,
          makeRule(),
          makePara('Kgabo Sekhula | Founder & CEO — Qilly (Pty) Ltd | K2026156151', { bold: true }),
          makePara('210 Kirkness Avenue, Pierre van Ryneveld, Centurion, 0157', { color: '666666' }),
          makePara('kgabo@qilly.co.za | +27 83 941 2655', { color: '666666' }),
        ],
      },
    ],
  });
}

// Build full guide Word doc
function buildFullGuideDoc(): Document {
  const children: Paragraph[] = [
    ...makeCoverBlock(
      'Qilly (Pty) Ltd',
      'Capital Raising Full Guide',
      'Email Templates | How Funders Work | Investor-Ready Approach — 2.5% Carry',
      'March 2026'
    ),
    makeHeading('PART 1 — EMAIL TEMPLATES', HeadingLevel.HEADING_1),
    makePara('Three ready-to-personalise investor emails. Fill in all [BRACKETED] fields before sending.', { color: '555555' }),
    makeRule(),
  ];

  // Add each email
  for (const t of emailTemplates) {
    children.push(makeHeading(t.label, HeadingLevel.HEADING_2));
    children.push(makePara(`TO: ${t.recipient}, ${t.recipientTitle}`, { bold: true }));
    children.push(makePara(`SUBJECT: ${t.subject}`, { color: QILLY_BLUE, bold: true }));
    const lines = t.body.split('\n');
    for (const line of lines) {
      const tr = line.trim();
      if (tr === '') { children.push(new Paragraph({ text: '' })); continue; }
      if (tr.startsWith('─')) continue;
      if (tr.startsWith('•') || tr.startsWith('✓')) { children.push(makeBullet(tr)); continue; }
      children.push(makePara(tr));
    }
    children.push(makeRule());
  }

  // How they work
  children.push(makeHeading('PART 2 — HOW EACH FUNDER TYPE WORKS', HeadingLevel.HEADING_1));
  for (const e of entities) {
    children.push(makeHeading(e.type, HeadingLevel.HEADING_2));
    children.push(makePara('Examples: ' + e.examples.join(', '), { color: '555555' }));
    children.push(makeSubheading('How They Operate'));
    e.howTheyWork.forEach((p, i) => children.push(makeBullet(`${i + 1}. ${p}`)));
    children.push(makeSubheading('What They Look For'));
    e.whatTheyWant.forEach(p => children.push(makeBullet(p)));
    children.push(makePara('Timeline: ' + e.timeline, { bold: true }));
    children.push(makePara('2.5% Carry Relevance: ' + e.fee));
    children.push(makePara('Risk: ' + e.risk));
    children.push(makeRule());
  }

  // Approach
  children.push(makeHeading('PART 3 — SOLID APPROACH (6 STEPS)', HeadingLevel.HEADING_1));
  for (const s of approachSteps) {
    children.push(makeHeading(`Step ${s.step}: ${s.title}`, HeadingLevel.HEADING_2));
    for (const item of s.items) {
      children.push(makePara(`${item.done ? '[DONE] ' : '[ ] '}${item.label}`, { bold: true }));
      children.push(makePara(`     ${item.note}`, { color: '666666' }));
    }
    children.push(makeRule());
  }

  // LOE section
  children.push(makeHeading('PART 4 — LETTER OF ENGAGEMENT CHECKLIST (2.5% CARRY)', HeadingLevel.HEADING_1));
  const loeItems = [
    'Party names and registration numbers',
    'Capital target and investor type',
    '2.5% success fee — payable on close, per tranche',
    'Fee basis: gross capital placed, excluding government grants',
    'Exclusivity: none — Qilly retains right to approach others',
    'Governing law: South Africa, English language',
    'Term: 12 months from date of signing',
    'Dispute resolution: AFSA arbitration preferred',
  ];
  children.push(makePara('Include these clauses in every Letter of Engagement before anyone works on your behalf:', { color: '555555' }));
  loeItems.forEach(item => children.push(makeBullet(item)));
  children.push(makeRule());
  children.push(makePara('IMPORTANT: Have a South African commercial attorney review the LOE before signing. Estimated cost: R3,000–R5,000.', { bold: true, color: 'CC0000' }));

  return new Document({
    styles: {
      default: {
        heading1: { run: { color: QILLY_BLUE, bold: true, size: 28 } },
        heading2: { run: { color: '333333', bold: true, size: 24 } },
      },
    },
    sections: [{ children }],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Download functions
// ─────────────────────────────────────────────────────────────────────────────
async function downloadEmailAsWord(template: EmailTemplate) {
  toast.loading(`Generating Word document for ${template.label}...`);
  try {
    const doc = buildEmailDoc(template);
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Qilly_CapitalRaising_${template.key}.docx`);
    toast.dismiss();
    toast.success(`Downloaded: Qilly_CapitalRaising_${template.key}.docx`);
  } catch (e) {
    toast.dismiss();
    toast.error('Failed to generate Word document. Please try again.');
    console.error(e);
  }
}

async function downloadFullGuideAsWord() {
  toast.loading('Generating Full Capital Raising Guide (Word)...');
  try {
    const doc = buildFullGuideDoc();
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'Qilly_CapitalRaising_FullGuide.docx');
    toast.dismiss();
    toast.success('Downloaded: Qilly_CapitalRaising_FullGuide.docx');
  } catch (e) {
    toast.dismiss();
    toast.error('Failed to generate document. Please try again.');
    console.error(e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface CapitalRaisingGuideProps {
  onBack?: () => void;
  embedded?: boolean; // true when rendered inside AdminDashboard tab (no standalone header)
}

export function CapitalRaisingGuide({ onBack, embedded = false }: CapitalRaisingGuideProps) {
  const [activeTab, setActiveTab] = useState<Tab>('emails');
  const [selectedEmail, setSelectedEmail] = useState<EmailKey>('privateVc');

  const selectedTemplate = emailTemplates.find(t => t.key === selectedEmail)!;
  const fullEmailText = `SUBJECT: ${selectedTemplate.subject}\n\nTO: ${selectedTemplate.recipient} — ${selectedTemplate.recipientTitle}\n\n${selectedTemplate.body}`;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'emails', label: 'Email Templates', icon: <Mail className="w-4 h-4" /> },
    { key: 'how-they-work', label: 'How They Work', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'approach', label: 'Solid Approach', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className={embedded ? '' : 'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}>
      {/* Standalone-mode header — hidden when embedded */}
      {!embedded && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-[#00b4d8] hover:text-[#0077b6] font-medium text-sm flex items-center gap-1.5 transition-colors"
                >
                  ← Back
                </button>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <div className="bg-[#00b4d8] w-7 h-7 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="font-bold text-gray-900 text-lg">Capital Raising Guide</h1>
                </div>
                <p className="text-xs text-gray-500 ml-9">Qilly (Pty) Ltd — K2026156151 — 2.5% Carry Strategy</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#0096c7] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-9">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-yellow-200 text-xs font-medium tracking-wide uppercase">Investor Outreach Framework</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Raise Capital for Qilly — 3 Audiences, 1 Clear Strategy
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                Copy-ready emails, funder breakdowns, and a step-by-step approach — all downloadable as Word documents.
              </p>
            </div>
            {/* Download All button */}
            <button
              onClick={downloadFullGuideAsWord}
              className="flex items-center gap-2 bg-white text-[#0077b6] px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors shadow-md shrink-0"
            >
              <FileDown className="w-4 h-4" />
              Download Full Guide (.docx)
            </button>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { n: 'R267B', label: 'SA construction market' },
              { n: '120K+', label: 'CIDB contractors (TAM)' },
              { n: '2.5%', label: 'Carry / success fee' },
              { n: '< 5 min', label: 'BOQ pricing speed' },
            ].map(({ n, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-xl px-4 py-2.5 text-center min-w-[100px]">
                <div className="text-lg font-bold">{n}</div>
                <div className="text-blue-200 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.key
                    ? 'border-[#00b4d8] text-[#00b4d8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">

        {/* ── TAB 1: EMAILS ──────────────────────────────────────────────────── */}
        {activeTab === 'emails' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Selector panel */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Select Recipient Type</h3>
              {emailTemplates.map(t => (
                <button
                  key={t.key}
                  onClick={() => setSelectedEmail(t.key)}
                  className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                    selectedEmail === t.key
                      ? `${t.border} ${t.colour} shadow-md`
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${t.colour} mt-0.5`}>{t.icon}</div>
                    <div>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${t.badgeColour}`}>{t.badge}</span>
                      <p className="font-semibold text-gray-900 text-sm leading-tight mt-1">{t.label}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.subtitle}</p>
                    </div>
                  </div>
                </button>
              ))}

              {/* Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs font-bold text-amber-800">Before Sending</span>
                </div>
                <ul className="text-xs text-amber-700 space-y-1.5">
                  {['Fill in all [BRACKETED] fields', 'Research the exact person to address', 'Attach a one-page executive summary', 'Send from kgabo@qilly.co.za', 'Follow up once after 5 business days'].map(tip => (
                    <li key={tip} className="flex items-start gap-1.5">
                      <ArrowRight className="w-3 h-3 mt-0.5 shrink-0" />{tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Email display panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Email header strip */}
                <div className={`${selectedTemplate.colour} ${selectedTemplate.border} border-b px-6 py-4`}>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white shadow-sm">{selectedTemplate.icon}</div>
                      <div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${selectedTemplate.badgeColour}`}>
                          {selectedTemplate.badge}
                        </span>
                        <h3 className="font-bold text-gray-900 text-base mt-1">{selectedTemplate.label}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CopyButton text={fullEmailText} label="Copy Email" />
                      <button
                        onClick={() => downloadEmailAsWord(selectedTemplate)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-[#0077b6] text-white hover:bg-[#005f8e] transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download .docx
                      </button>
                    </div>
                  </div>
                </div>

                {/* Email metadata */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 space-y-2">
                  <div className="flex gap-2 items-start text-sm">
                    <span className="text-gray-400 w-16 shrink-0 pt-0.5 text-xs font-medium">TO:</span>
                    <span className="text-gray-700 font-medium">{selectedTemplate.recipient}, {selectedTemplate.recipientTitle}</span>
                  </div>
                  <div className="flex gap-2 items-start text-sm">
                    <span className="text-gray-400 w-16 shrink-0 pt-0.5 text-xs font-medium">FROM:</span>
                    <span className="text-gray-700">kgabo@qilly.co.za — Kgabo Sekhula, CEO Qilly (Pty) Ltd</span>
                  </div>
                  <div className="flex gap-2 items-start text-sm">
                    <span className="text-gray-400 w-16 shrink-0 pt-0.5 text-xs font-medium">SUBJECT:</span>
                    <div className="flex-1 flex items-start gap-2 justify-between">
                      <span className="text-gray-900 font-semibold text-xs leading-relaxed">{selectedTemplate.subject}</span>
                      <CopyButton text={selectedTemplate.subject} label="Copy" />
                    </div>
                  </div>
                </div>

                {/* Email body */}
                <div className="px-6 py-5 max-h-[520px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                    {selectedTemplate.body}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: HOW THEY WORK ───────────────────────────────────────────── */}
        {activeTab === 'how-they-work' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-[#00b4d8] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Understanding the Three Funding Channels</h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                    A plain-language breakdown of how each entity type works, what they want, and where your 2.5% carry offer fits.
                  </p>
                </div>
              </div>
            </div>

            {entities.map((entity) => (
              <div key={entity.type} className={`rounded-xl border-2 overflow-hidden ${entity.colour}`}>
                <div className="px-6 py-5 border-b border-opacity-50">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm">{entity.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{entity.type}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {entity.examples.map(e => (
                          <span key={e} className={`text-xs px-2 py-0.5 rounded-full font-medium ${entity.badge}`}>{e}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">How They Operate</h4>
                    <ul className="space-y-2">
                      {entity.howTheyWork.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 mt-0.5">{i + 1}</div>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">What They Look For (in Qilly)</h4>
                    <ul className="space-y-2">
                      {entity.whatTheyWant.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${entity.colour2}`} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Typical Timeline', value: entity.timeline, icon: '⏱' },
                    { label: '2.5% Carry Relevance', value: entity.fee, icon: '💰' },
                    { label: 'Risk Profile', value: entity.risk, icon: '⚖️' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">{icon}</span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Comparison table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Quick Comparison — Who to Approach First</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Criterion</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-purple-600 uppercase">Private VC</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-blue-600 uppercase">Transact. Advisor</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-green-600 uppercase">DFI / Govt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Own money invested?', '✅ Yes', '❌ No (earns fee)', '✅ Yes (loans/equity)'],
                      ['Speed', '⚡ 3–6 months', '⚡ 1–4 months mandate', '🐢 6–12 months'],
                      ['Dilution to founder', 'High (15–35%)', 'None (cash fee)', 'Low (loans) or none (grants)'],
                      ['B-BBEE requirement', 'Preferred', 'Neutral', '🔴 Critical'],
                      ['2.5% carry applicable?', 'For referrals', '✅ Core model', 'For introductions only'],
                      ['Best for Qilly at this stage', 'Series A (later)', '✅ Start NOW', '✅ Start NOW (parallel)'],
                    ].map(([criterion, vc, advisor, dfi], i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium text-gray-700">{criterion}</td>
                        <td className="px-4 py-3 text-gray-600">{vc}</td>
                        <td className="px-4 py-3 text-gray-600">{advisor}</td>
                        <td className="px-4 py-3 text-gray-600">{dfi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: SOLID APPROACH ──────────────────────────────────────────── */}
        {activeTab === 'approach' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#00b4d8] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">A Solid, Investor-Ready Approach for Qilly</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Six concrete steps to ensure your business is structured correctly and your pitch is credible.
                  </p>
                </div>
              </div>
            </div>

            {approachSteps.map((step) => (
              <div key={step.step} className={`rounded-xl border-2 overflow-hidden ${step.colour}`}>
                <div className="flex items-center gap-4 px-6 py-4 border-b border-opacity-40">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
                    <span className="text-xs font-black text-gray-500">{step.step}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg shadow-sm">{step.icon}</div>
                  <h3 className="font-bold text-gray-900">{step.title}</h3>
                </div>
                <div className="px-6 py-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {step.items.map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 bg-white rounded-lg p-4 border shadow-sm ${
                          item.done ? 'border-green-200' : 'border-gray-100'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          item.done ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}>
                          {item.done && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${item.done ? 'text-gray-700' : 'text-gray-900'}`}>
                            {item.label}
                            {item.done && <span className="ml-2 text-xs text-green-600 font-normal">✓ Done</span>}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* LOE box */}
            <div className="bg-gradient-to-r from-[#0077b6] to-[#00b4d8] rounded-xl p-6 text-white">
              <div className="flex items-start gap-4">
                <Star className="w-8 h-8 text-yellow-300 shrink-0" />
                <div className="w-full">
                  <h3 className="font-bold text-lg mb-2">The 2.5% Carry — How to Formalise It</h3>
                  <p className="text-blue-100 text-sm leading-relaxed mb-4">
                    A verbal offer of 2.5% is not enforceable. Before anyone begins working on your behalf,
                    send a signed <strong className="text-white">Letter of Engagement (LOE)</strong> that states:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {[
                      'Party names and registration numbers',
                      'Capital target and investor type',
                      '2.5% success fee — payable on close, per tranche',
                      'Fee basis: gross capital placed, excluding government grants',
                      'Exclusivity: none — Qilly retains right to approach others',
                      'Governing law: South Africa, English language',
                      'Term: 12 months from date of signing',
                      'Dispute resolution: AFSA arbitration preferred',
                    ].map((point, i) => (
                      <div key={i} className="flex items-start gap-2 bg-white/10 rounded-lg p-3 text-sm">
                        <Lock className="w-3.5 h-3.5 text-yellow-300 shrink-0 mt-0.5" />
                        {point}
                      </div>
                    ))}
                  </div>
                  <p className="text-blue-200 text-xs">
                    ⚠ Have a South African commercial attorney review the LOE before signing. Cost: ~R3,000–R5,000. Worth every rand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer — only in standalone mode */}
      {!embedded && (
        <div className="border-t border-gray-200 bg-white mt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
              <span>Qilly (Pty) Ltd — Reg. K2026156151 — 210 Kirkness Ave, Pierre van Ryneveld, 0157</span>
              <div className="flex items-center gap-4">
                <span>+27 83 941 2655</span>
                <span>•</span>
                <span>kgabo@qilly.co.za</span>
                <span>•</span>
                <span className="text-amber-600 font-medium">CONFIDENTIAL — March 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
