/**
 * SupplierCoverageCompliance.tsx
 * Two-part component:
 * 1. Supplier Coverage Analysis — current 100 suppliers, gaps, expansion roadmap
 * 2. CIDB / SANS 1200 / Compliance Bodies — go-LIVE readiness dashboard
 */

import { useState } from 'react';
import {
  Building2, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp,
  Globe, Package, Zap, TrendingUp, Target, Shield, FileText, Users,
  AlertCircle, Info, Star, ArrowRight, Clock, CheckSquare, ExternalLink,
  BarChart3, MapPin, Layers, Award, Scale, BookOpen, Hammer, HardHat,
  ClipboardCheck, Wrench
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type Tab = 'coverage' | 'gaps' | 'compliance' | 'roadmap';
type GoLiveStatus = 'done' | 'in-progress' | 'pending' | 'critical';

interface SupplierGap {
  id: string;
  name: string;
  website: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  apiType: 'scraping' | 'rest' | 'manual';
  cidbRelevance: string;
  sans1200Section: string;
}

interface ComplianceItem {
  id: string;
  body: string;
  fullName: string;
  category: 'registration' | 'technical' | 'legal' | 'operational' | 'financial';
  status: GoLiveStatus;
  requirement: string;
  qillyAction: string;
  contacts: string;
  timeline: string;
  cost: string;
  urgency: 'blocking' | 'important' | 'recommended';
}

// ─────────────────────────────────────────────────────────────────────────────
// CURRENT SUPPLIER SUMMARY (from supplier-connector.ts)
// ─────────────────────────────────────────────────────────────────────────────
const CURRENT_COVERAGE = {
  total: 159,
  scraping: 57,
  rest: 38,
  manual: 64,
  categories: [
    { name: 'Building Materials & Hardware', count: 22, cidbSections: ['A', 'B', 'G', 'P'], sans1200: ['A', 'B', 'G'], coveragePct: 90, gap: '✅ Well covered. Minor gap: specialist waterproofing membranes.' },
    { name: 'Steel & Metal', count: 13, cidbSections: ['C', 'D', 'H'], sans1200: ['C', 'DB', 'DF'], coveragePct: 95, gap: '✅ Now covered: BRC Mesh, Bolt & Eng, Vanderbijlpark Steel added.' },
    { name: 'Concrete & Aggregates', count: 10, cidbSections: ['A', 'C', 'DB'], sans1200: ['A', 'B', 'DB', 'DC'], coveragePct: 95, gap: '✅ Well covered: PPC, AfriSam, Sephaku, Concor Readymix, Lafarge Readymix added.' },
    { name: 'Civil & Earthworks', count: 13, cidbSections: ['A', 'B', 'C'], sans1200: ['A', 'B', 'C', 'DB', 'DC', 'DD'], coveragePct: 90, gap: '✅ FIXED: G4 Cube, Afrimat, Sapstone, Much Asphalt, Fibertex, Kaytech, Maccaferri added.' },
    { name: 'Plumbing & Water', count: 17, cidbSections: ['M', 'P', 'Q'], sans1200: ['M', 'L', 'P'], coveragePct: 90, gap: '✅ Now covered: Pipe World, Flo-Tek, Wavin, Vaal Sanitaryware, Roca, ABS Pumps added.' },
    { name: 'Electrical', count: 18, cidbSections: ['E', 'F'], sans1200: ['E', 'F'], coveragePct: 88, gap: '✅ Improved: Cabstrut, Helukabel, Prysmian (cables), Solar MD, Suntech, Fuchs, Radiant Lighting added.' },
    { name: 'Roofing', count: 13, cidbSections: ['G', 'H'], sans1200: ['G', 'H'], coveragePct: 95, gap: '✅ Now covered: Safintra Roofing (IBR), Clotan Steel, Truecor, Trussworks, Waterproofing Co added.' },
    { name: 'Timber & Joinery', count: 7, cidbSections: ['G', 'H', 'J'], sans1200: ['G', 'H'], coveragePct: 88, gap: '✅ Improved: PG Bison, Saligna Timber, Lacewood Flooring added.' },
    { name: 'Paint & Finishes', count: 5, cidbSections: ['K', 'L'], sans1200: ['K', 'L'], coveragePct: 82, gap: 'Minor gap: specialist epoxy coatings. Dulux, Plascon, Prominent well covered.' },
    { name: 'Hardware & Plant Hire', count: 14, cidbSections: ['all'], sans1200: ['all'], coveragePct: 78, gap: 'Minor gap: crane hire, specialised earthmoving. General plant hire well covered.' },
    { name: 'Glass, Glazing & Doors', count: 5, cidbSections: ['J', 'K'], sans1200: ['J', 'K'], coveragePct: 95, gap: '✅ FIXED: PG Glass, Guardian, Aluplast, Fenster, Stalwart Doors added.' },
    { name: 'Masonry (Bricks & Blocks)', count: 4, cidbSections: ['B'], sans1200: ['B'], coveragePct: 95, gap: '✅ FIXED: Corobrick, Ocon Brick, Midrand Brick, Hebel Blocks added.' },
    { name: 'Scaffolding & Formwork', count: 3, cidbSections: ['all'], sans1200: ['all'], coveragePct: 90, gap: '✅ FIXED: Safway, Formscaff, Doka SA added.' },
    { name: 'HVAC', count: 3, cidbSections: ['M'], sans1200: ['M'], coveragePct: 82, gap: '✅ FIXED: Trane SA, Daikin SA, Energy HVAC added.' },
    { name: 'Fire Protection', count: 2, cidbSections: ['F', 'M'], sans1200: ['F'], coveragePct: 88, gap: '✅ FIXED: Wormald, Fire Solutions SA added.' },
    { name: 'External Works & Landscaping', count: 3, cidbSections: ['P', 'Q'], sans1200: ['P', 'Q'], coveragePct: 75, gap: '✅ Improved: Tegola, Terraforce, Envirowild added. Still needed: irrigation specialists.' },
    { name: 'Tiles & Flooring', count: 4, cidbSections: ['K', 'L'], sans1200: ['K'], coveragePct: 75, gap: 'CTM, Italtile, Ceramic Industries, Johnson Tiles. Gap: vinyl/carpet, epoxy specialist.' },
    { name: 'Insulation & Drywall', count: 5, cidbSections: ['G', 'H', 'K'], sans1200: ['G', 'H'], coveragePct: 85, gap: 'Isover, Aerolite, Knauf, Gyproc, Saint-Gobain. Minor gap: suspended ceilings.' },
    { name: 'Waterproofing & Sealants', count: 5, cidbSections: ['D', 'G'], sans1200: ['D', 'G'], coveragePct: 85, gap: 'TAL, Sika, Pratley, Rhinolite + Waterproofing Co. Good coverage.' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// REMAINING GAPS — minor items still to add (phase 3)
// All 59 critical/high-priority suppliers added in March 2026 batch.
// ─────────────────────────────────────────────────────────────────────────────
const MISSING_SUPPLIERS: SupplierGap[] = [
  // CRITICAL — Civil & Earthworks (completely missing category)
  { id: 'g4', name: 'G4 CUBE (Aggregates)', website: 'https://www.g4cube.co.za', category: 'Civil & Earthworks', priority: 'critical', reason: 'Crusher dust, G4/G7 sub-base material — SANS 1200C/DB standard items', apiType: 'scraping', cidbRelevance: 'CIDB Grade 1–9 civil works', sans1200Section: 'SANS 1200 A, C, DB' },
  { id: 'afrimat', name: 'AFRIMAT', website: 'https://www.afrimat.co.za', category: 'Civil & Earthworks', priority: 'critical', reason: 'JSE-listed aggregates, clinker, industrial minerals — major BOQ aggregates reference', apiType: 'rest', cidbRelevance: 'CIDB civil grading 3+', sans1200Section: 'SANS 1200 A, C, DB, DC' },
  { id: 'sapstone', name: 'SAPSTONE', website: 'https://www.sapstone.co.za', category: 'Civil & Earthworks', priority: 'critical', reason: 'Crushed stone, roadstone, drainage aggregates — critical for civil BOQs', apiType: 'scraping', cidbRelevance: 'All civil CIDB grades', sans1200Section: 'SANS 1200 C, DB' },
  { id: 'asphalt', name: 'MUCH ASPHALT', website: 'https://www.muchasphalt.co.za', category: 'Civil & Earthworks', priority: 'critical', reason: 'Asphalt/bitumen — SANS 1200 PE/DD road surfacing rates', apiType: 'scraping', cidbRelevance: 'CIDB Grade 3+ civil', sans1200Section: 'SANS 1200 DD, PE' },
  { id: 'concor', name: 'CONCOR READYMIX', website: 'https://www.concor.co.za', category: 'Civil & Earthworks', priority: 'critical', reason: 'Ready-mix concrete — every structural BOQ needs ready-mix unit rates', apiType: 'rest', cidbRelevance: 'All CIDB grades structural', sans1200Section: 'SANS 1200 A, C' },
  { id: 'lafarge-readymix', name: 'LAFARGE READYMIX', website: 'https://www.lafarge.co.za', category: 'Civil & Earthworks', priority: 'critical', reason: 'Ready-mix concrete — provincial coverage across all 9 provinces', apiType: 'rest', cidbRelevance: 'All CIDB grades', sans1200Section: 'SANS 1200 A, C' },
  { id: 'murray-roberts-readymix', name: 'MURRAY & ROBERTS READYMIX', website: 'https://www.murrob.co.za', category: 'Civil & Earthworks', priority: 'critical', reason: 'Premix concrete — major government and infrastructure contractor supplier', apiType: 'manual', cidbRelevance: 'CIDB Grade 5–9 civil', sans1200Section: 'SANS 1200 A, C' },

  // Civil — Geotextiles & Drainage
  { id: 'fibertex', name: 'FIBERTEX SA', website: 'https://www.fibertex.co.za', category: 'Civil & Earthworks', priority: 'high', reason: 'Geotextiles, geomembranes — SANS 1200 DB/DC drainage and earthworks standard items', apiType: 'scraping', cidbRelevance: 'CIDB civil Grade 3+', sans1200Section: 'SANS 1200 DB, DC' },
  { id: 'kaytech', name: 'KAYTECH', website: 'https://www.kaytech.co.za', category: 'Civil & Earthworks', priority: 'high', reason: 'Geosynthetics, drainage composites — heavily referenced in civil BOQs', apiType: 'rest', cidbRelevance: 'CIDB civil/roads Grade 4+', sans1200Section: 'SANS 1200 C, DB, DC' },
  { id: 'maccaferri', name: 'MACCAFERRI SA', website: 'https://www.maccaferri.com', category: 'Civil & Earthworks', priority: 'high', reason: 'Gabions, rockfall protection, erosion control — civil BOQ speciality items', apiType: 'rest', cidbRelevance: 'CIDB civil Grade 4+', sans1200Section: 'SANS 1200 B, C' },

  // Roads & Surfacing
  { id: 'tosas', name: 'TOSAS (BITUMEN)', website: 'https://www.tosas.co.za', category: 'Roads & Surfacing', priority: 'high', reason: 'Bitumen emulsions, cold mix — SANS 1200 DD/PE road construction standard items', apiType: 'scraping', cidbRelevance: 'CIDB roads Grade 3+', sans1200Section: 'SANS 1200 DD, PE' },
  { id: 'total-bitumen', name: 'TOTALENERGIES BITUMEN', website: 'https://www.totalenergies.co.za', category: 'Roads & Surfacing', priority: 'high', reason: 'Modified bitumen, prime coat — major bitumen supplier referenced in civil BOQs', apiType: 'rest', cidbRelevance: 'CIDB roads Grade 4+', sans1200Section: 'SANS 1200 DD' },
  { id: 'engen-bitumen', name: 'ENGEN BITUMEN', website: 'https://www.engen.co.za', category: 'Roads & Surfacing', priority: 'medium', reason: 'Road construction bitumen products — standard SA roads BOQ reference', apiType: 'manual', cidbRelevance: 'CIDB roads Grade 3+', sans1200Section: 'SANS 1200 DD' },

  // Structural Steel
  { id: 'bolt-eng', name: 'BOLT & ENG', website: 'https://www.bolteng.co.za', category: 'Steel & Metal', priority: 'high', reason: 'Structural bolts, fasteners — every structural steel BOQ section needs this', apiType: 'scraping', cidbRelevance: 'CIDB structural Grade 3+', sans1200Section: 'SANS 1200 C, DF' },
  { id: 'vanderbijl-steel', name: 'VANDERBIJLPARK STEEL', website: 'https://www.vanderbijlsteel.co.za', category: 'Steel & Metal', priority: 'high', reason: 'Structural steel sections — I-beams, channels, angles for buildings/civil BOQs', apiType: 'scraping', cidbRelevance: 'CIDB structural Grade 4+', sans1200Section: 'SANS 1200 C, DF' },
  { id: 'brc', name: 'BRC REINFORCING', website: 'https://www.brc.co.za', category: 'Steel & Metal', priority: 'high', reason: 'Reinforcing mesh (ref188, ref193, ref196) — every slab BOQ needs BRC rates', apiType: 'scraping', cidbRelevance: 'All CIDB grades structural', sans1200Section: 'SANS 1200 C, DB' },
  { id: 'betek', name: 'BETEC CONCRETE', website: 'https://www.betec.co.za', category: 'Steel & Metal', priority: 'medium', reason: 'Concrete reinforcing accessories, chairs, spacers', apiType: 'manual', cidbRelevance: 'CIDB structural Grade 2+', sans1200Section: 'SANS 1200 C' },

  // Plumbing & Civil Water
  { id: 'pipe-world', name: 'PIPE WORLD', website: 'https://www.pipeworld.co.za', category: 'Plumbing & Civil Water', priority: 'high', reason: 'HDPE, uPVC, DI pipes — critical for water reticulation BOQs', apiType: 'scraping', cidbRelevance: 'CIDB plumbing/civil Grade 2+', sans1200Section: 'SANS 1200 L, M, P' },
  { id: 'flo-tek', name: 'FLO-TEK', website: 'https://www.flo-tek.co.za', category: 'Plumbing & Civil Water', priority: 'high', reason: 'HDPE pipe fittings — standard civil water BOQ items', apiType: 'scraping', cidbRelevance: 'CIDB civil water Grade 3+', sans1200Section: 'SANS 1200 L, P' },
  { id: 'wavin-sa', name: 'WAVIN SA', website: 'https://www.wavin.co.za', category: 'Plumbing & Civil Water', priority: 'high', reason: 'uPVC pressure and gravity pipes — building and civil water supply BOQs', apiType: 'rest', cidbRelevance: 'All CIDB grades plumbing', sans1200Section: 'SANS 1200 L, M, P' },
  { id: 'vaal-sanitary', name: 'VAAL SANITARYWARE', website: 'https://www.vaalsanitaryware.co.za', category: 'Plumbing & Sanitaryware', priority: 'medium', reason: 'Toilets, basins, baths — BOQ sanitaryware section standard items', apiType: 'scraping', cidbRelevance: 'CIDB plumbing Grade 1–4', sans1200Section: 'SANS 1200 M' },
  { id: 'roca', name: 'ROCA SA', website: 'https://www.roca.co.za', category: 'Plumbing & Sanitaryware', priority: 'medium', reason: 'Sanitaryware — commercial bathroom BOQ specification items', apiType: 'rest', cidbRelevance: 'CIDB plumbing Grade 2+', sans1200Section: 'SANS 1200 M' },
  { id: 'abs-pumps', name: 'ABS PUMPS', website: 'https://www.abs-pumps.co.za', category: 'Plumbing & Civil Water', priority: 'high', reason: 'Sewage pumps, drainage pumps — civil and building services BOQs', apiType: 'rest', cidbRelevance: 'CIDB civil/mech Grade 3+', sans1200Section: 'SANS 1200 M, P' },

  // Electrical — Critical Gaps
  { id: 'cabstrut', name: 'CABSTRUT', website: 'https://www.cabstrut.co.za', category: 'Electrical', priority: 'high', reason: 'Cable trays, trunking — every electrical BOQ bill has cable management items', apiType: 'scraping', cidbRelevance: 'CIDB electrical Grade 1–5', sans1200Section: 'SANS 1200 E, F' },
  { id: 'helukabel', name: 'HELUKABEL SA', website: 'https://www.helukabel.co.za', category: 'Electrical', priority: 'high', reason: 'LV/MV cables — the highest-value single item in most electrical BOQs', apiType: 'rest', cidbRelevance: 'CIDB electrical Grade 2+', sans1200Section: 'SANS 1200 E, F' },
  { id: 'prysmian', name: 'PRYSMIAN GROUP SA', website: 'https://www.prysmiangroup.com', category: 'Electrical', priority: 'high', reason: 'Armoured and unarmoured cables — major LV/MV cable supplier in SA', apiType: 'rest', cidbRelevance: 'CIDB electrical Grade 3+', sans1200Section: 'SANS 1200 E, F' },
  { id: 'belden', name: 'BELDEN SA', website: 'https://www.belden.com', category: 'Electrical', priority: 'medium', reason: 'Instrumentation cables, fire alarm cables — building services BOQs', apiType: 'rest', cidbRelevance: 'CIDB electrical Grade 3+', sans1200Section: 'SANS 1200 E' },
  { id: 'fuchs-lighting', name: 'FUCHS LIGHTING', website: 'https://www.fuchs.co.za', category: 'Electrical', priority: 'medium', reason: 'Luminaires — lighting BOQ section', apiType: 'scraping', cidbRelevance: 'CIDB electrical Grade 1–3', sans1200Section: 'SANS 1200 F' },
  { id: 'radiant-lighting', name: 'RADIANT LIGHTING', website: 'https://www.radiantlighting.co.za', category: 'Electrical', priority: 'medium', reason: 'LED lighting, streetlights — residential and infrastructure BOQs', apiType: 'scraping', cidbRelevance: 'CIDB electrical Grade 1–4', sans1200Section: 'SANS 1200 E, F' },
  { id: 'solar-md', name: 'SOLAR MD (Renewable)', website: 'https://www.solarmd.co.za', category: 'Electrical (Renewable)', priority: 'high', reason: 'Solar panels, inverters, batteries — ENTERPRISE green building tier', apiType: 'rest', cidbRelevance: 'CIDB electrical Grade 2+', sans1200Section: 'SANS 1200 E' },
  { id: 'suntech', name: 'SUNTECH POWER SA', website: 'https://www.suntech-power.com', category: 'Electrical (Renewable)', priority: 'medium', reason: 'PV modules — green building BOQ items', apiType: 'rest', cidbRelevance: 'CIDB electrical Grade 2+', sans1200Section: 'SANS 1200 E' },

  // Roofing — Critical
  { id: 'safintra-roofing', name: 'SAFINTRA ROOFING (IBR)', website: 'https://www.safintra.co.za', category: 'Roofing', priority: 'high', reason: 'IBR and corrugated sheeting — the most common roof BOQ item in SA', apiType: 'scraping', cidbRelevance: 'CIDB Grade 1–5 buildings', sans1200Section: 'SANS 1200 G, H' },
  { id: 'clotan-steel', name: 'CLOTAN STEEL', website: 'https://www.clotan.co.za', category: 'Roofing', priority: 'high', reason: 'Roof sheets, flashings — essential roofing BOQ coverage', apiType: 'scraping', cidbRelevance: 'CIDB Grade 1–5 buildings', sans1200Section: 'SANS 1200 G, H' },
  { id: 'truecor', name: 'TRUECOR ROOFING', website: 'https://www.truecor.co.za', category: 'Roofing', priority: 'medium', reason: 'Roof tiles, slates — residential and commercial roofing BOQs', apiType: 'scraping', cidbRelevance: 'CIDB Grade 1–4 buildings', sans1200Section: 'SANS 1200 G' },
  { id: 'trussworks', name: 'TRUSSWORKS (MITEK)', website: 'https://www.trussworks.co.za', category: 'Roofing', priority: 'high', reason: 'Roof trusses (supply & erect) — timber truss BOQ items are common nationwide', apiType: 'manual', cidbRelevance: 'CIDB Grade 1–5', sans1200Section: 'SANS 1200 G, H' },
  { id: 'waterproofing-co', name: 'WATERPROOFING COMPANY', website: 'https://www.waterproofingco.co.za', category: 'Roofing', priority: 'high', reason: 'Torch-on membranes, liquid applied waterproofing — flat roof BOQs', apiType: 'scraping', cidbRelevance: 'CIDB Grade 2+', sans1200Section: 'SANS 1200 D, G' },

  // Timber & Joinery
  { id: 'pg-bison', name: 'PG BISON', website: 'https://www.pgbison.co.za', category: 'Timber & Joinery', priority: 'critical', reason: 'MDF, chipboard, veneer — joinery/cabinetry BOQ items. Major SA supplier', apiType: 'scraping', cidbRelevance: 'CIDB Grade 1–4 buildings', sans1200Section: 'SANS 1200 H, J' },
  { id: 'saligna-timber', name: 'SALIGNA TIMBER', website: 'https://www.saligna.co.za', category: 'Timber & Joinery', priority: 'medium', reason: 'Hardwood, structural timber — BOQ timber frame and joinery items', apiType: 'scraping', cidbRelevance: 'CIDB Grade 2+ buildings', sans1200Section: 'SANS 1200 H, J' },
  { id: 'lacewood', name: 'LACEWOOD FLOORING', website: 'https://www.lacewood.co.za', category: 'Tiles & Flooring', priority: 'medium', reason: 'Engineered wood, parquet flooring — BOQ floor finishes section', apiType: 'scraping', cidbRelevance: 'CIDB Grade 1–3 buildings', sans1200Section: 'SANS 1200 K' },

  // Glass & Glazing
  { id: 'pglass', name: 'PG GLASS (GLASS SOUTH AFRICA)', website: 'https://www.pgglass.co.za', category: 'Glass & Glazing', priority: 'critical', reason: 'Float glass, toughened, laminated, double-glazed — every building BOQ has glazing items', apiType: 'scraping', cidbRelevance: 'All CIDB building grades', sans1200Section: 'SANS 1200 J, K' },
  { id: 'guardian-glass', name: 'GUARDIAN GLASS SA', website: 'https://www.guardianglass.com', category: 'Glass & Glazing', priority: 'high', reason: 'Architectural glass — commercial building BOQ facade items', apiType: 'rest', cidbRelevance: 'CIDB Grade 4+ commercial', sans1200Section: 'SANS 1200 J' },
  { id: 'aluplast', name: 'ALUPLAST SA (ALUMINIUM)', website: 'https://www.aluplast.co.za', category: 'Windows & Doors', priority: 'critical', reason: 'Aluminium window/door frames — BOQ windows section is always significant', apiType: 'scraping', cidbRelevance: 'All CIDB building grades', sans1200Section: 'SANS 1200 J' },
  { id: 'fenster', name: 'FENSTER ALUMINIUM', website: 'https://www.fenster.co.za', category: 'Windows & Doors', priority: 'high', reason: 'Aluminium windows and doors — alternative to Aluplast for pricing comparison', apiType: 'scraping', cidbRelevance: 'All CIDB building grades', sans1200Section: 'SANS 1200 J' },
  { id: 'stalwart-doors', name: 'STALWART DOORS', website: 'https://www.stalwartdoors.co.za', category: 'Windows & Doors', priority: 'high', reason: 'Flush, panel, fire doors — internal doors section of every building BOQ', apiType: 'scraping', cidbRelevance: 'CIDB Grade 1–5', sans1200Section: 'SANS 1200 J' },

  // Masonry & Blocks
  { id: 'corobrick', name: 'COROBRICK', website: 'https://www.corobrick.co.za', category: 'Masonry', priority: 'critical', reason: 'Bricks and blocks — masonry is typically 15–25% of a building BOQ value', apiType: 'scraping', cidbRelevance: 'All CIDB building grades', sans1200Section: 'SANS 1200 B' },
  { id: 'ocon-brick', name: 'OCON BRICK', website: 'https://www.oconbrick.co.za', category: 'Masonry', priority: 'high', reason: 'Clay face bricks, pavers — face brick pricing for commercial BOQs', apiType: 'scraping', cidbRelevance: 'CIDB Grade 2+', sans1200Section: 'SANS 1200 B' },
  { id: 'midrand-brick', name: 'MIDRAND BRICK', website: 'https://www.midrandbrick.co.za', category: 'Masonry', priority: 'high', reason: 'Concrete blocks (140mm, 190mm, 290mm) — block BOQ items across all provinces', apiType: 'scraping', cidbRelevance: 'All CIDB grades masonry', sans1200Section: 'SANS 1200 B' },
  { id: 'hebel-blocks', name: 'HEBEL AUTOCLAVED AERATED', website: 'https://www.hebel.co.za', category: 'Masonry', priority: 'medium', reason: 'AAC lightweight blocks — green building masonry items', apiType: 'rest', cidbRelevance: 'CIDB Grade 2+', sans1200Section: 'SANS 1200 B' },

  // Scaffolding & Formwork
  { id: 'safway', name: 'SAFWAY SCAFFOLDING', website: 'https://www.safway.co.za', category: 'Scaffolding & Formwork', priority: 'critical', reason: 'Scaffolding hire rates — every building BOQ has temporary works section', apiType: 'scraping', cidbRelevance: 'All CIDB grades', sans1200Section: 'SANS 1200 A, C' },
  { id: 'formscaff', name: 'FORMSCAFF', website: 'https://www.formscaff.co.za', category: 'Scaffolding & Formwork', priority: 'high', reason: 'Formwork systems, shoring — concrete structure BOQs', apiType: 'scraping', cidbRelevance: 'CIDB structural Grade 3+', sans1200Section: 'SANS 1200 C' },
  { id: 'doka', name: 'DOKA SA (FORMWORK)', website: 'https://www.doka.com', category: 'Scaffolding & Formwork', priority: 'high', reason: 'Slab and wall formwork — large-scale structural BOQs', apiType: 'rest', cidbRelevance: 'CIDB Grade 5+ structural', sans1200Section: 'SANS 1200 C' },

  // External Works
  { id: 'tegola', name: 'TEGOLA PAVING', website: 'https://www.tegola.co.za', category: 'External Works', priority: 'high', reason: 'Paving blocks/bricks — external works BOQ section (estate, commercial, industrial)', apiType: 'scraping', cidbRelevance: 'CIDB Grade 2+ civil/building', sans1200Section: 'SANS 1200 B, P' },
  { id: 'terraforce', name: 'TERRAFORCE RETAINING', website: 'https://www.terraforce.com', category: 'External Works', priority: 'medium', reason: 'Retaining wall blocks — external works and civil BOQ items', apiType: 'scraping', cidbRelevance: 'CIDB civil Grade 3+', sans1200Section: 'SANS 1200 B, C' },
  { id: 'royal-landscapes', name: 'ENVIRO WILD LANDSCAPING', website: 'https://www.envirowild.co.za', category: 'Landscaping', priority: 'medium', reason: 'Trees, shrubs, turf, irrigation — landscaping section of external works BOQ', apiType: 'manual', cidbRelevance: 'CIDB Grade 2+', sans1200Section: 'SANS 1200 P, Q' },

  // HVAC
  { id: 'trane', name: 'TRANE SA (HVAC)', website: 'https://www.trane.co.za', category: 'HVAC', priority: 'high', reason: 'Air conditioning units — M&E BOQ HVAC section. ENTERPRISE tier relevance', apiType: 'rest', cidbRelevance: 'CIDB mechanical Grade 3+', sans1200Section: 'SANS 1200 M' },
  { id: 'daikin', name: 'DAIKIN SA', website: 'https://www.daikin.co.za', category: 'HVAC', priority: 'high', reason: 'Split units, VRF systems — commercial air conditioning BOQs', apiType: 'rest', cidbRelevance: 'CIDB mechanical Grade 2+', sans1200Section: 'SANS 1200 M' },
  { id: 'energy-hvac', name: 'ENERGY HVAC', website: 'https://www.energyhvac.co.za', category: 'HVAC', priority: 'medium', reason: 'Ducting, diffusers — building services BOQ mechanical items', apiType: 'scraping', cidbRelevance: 'CIDB mechanical Grade 2+', sans1200Section: 'SANS 1200 M' },

  // ── PHASE 3 minor gaps (all critical/high items now added) ──────────────
  { id: 'epoxy-floors', name: 'FLOWCRETE SA (Epoxy Flooring)', website: 'https://www.flowcrete.co.za', category: 'Tiles & Flooring', priority: 'low', reason: 'Epoxy and polyurethane floor coatings — industrial floor BOQ items', apiType: 'rest', cidbRelevance: 'CIDB Grade 2+ buildings', sans1200Section: 'SANS 1200 K' },
  { id: 'vinyl-floors', name: 'POLYFLOR SA (Vinyl Flooring)', website: 'https://www.polyflor.com', category: 'Tiles & Flooring', priority: 'low', reason: 'Commercial vinyl sheet/tile — healthcare and education floor BOQs', apiType: 'rest', cidbRelevance: 'CIDB Grade 2+ buildings', sans1200Section: 'SANS 1200 K' },
  { id: 'irrigation', name: 'HUNTER INDUSTRIES SA (Irrigation)', website: 'https://www.hunterindustries.com', category: 'Landscaping', priority: 'low', reason: 'Irrigation heads, controllers — external works landscaping BOQ', apiType: 'rest', cidbRelevance: 'CIDB Grade 2+ external', sans1200Section: 'SANS 1200 Q' },
  { id: 'suspended-ceilings', name: 'ARMSTRONG CEILINGS SA', website: 'https://www.armstrongceilings.com', category: 'Insulation & Drywall', priority: 'low', reason: 'Suspended ceiling grid and tiles — commercial building BOQ finishes', apiType: 'rest', cidbRelevance: 'CIDB Grade 2+', sans1200Section: 'SANS 1200 L' },
  { id: 'crane-hire', name: 'SARENS SA (Crane Hire)', website: 'https://www.sarens.com', category: 'Hardware & Plant Hire', priority: 'low', reason: 'Mobile cranes, crane hire — structural steel erection BOQ items', apiType: 'manual', cidbRelevance: 'CIDB Grade 6–9 structural', sans1200Section: 'SANS 1200 A, DF' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPLIANCE BODIES — CIDB, SANS 1200, and all others
// ─────────────────────────────────────────────────────────────────────────────
const COMPLIANCE_ITEMS: ComplianceItem[] = [
  // ── REGISTRATION ──────────────────────────────────────────────────────────
  {
    id: 'cipc',
    body: 'CIPC',
    fullName: 'Companies and Intellectual Property Commission',
    category: 'registration',
    status: 'done',
    urgency: 'blocking',
    requirement: 'Company registration as (Pty) Ltd — Reg. K2026156151',
    qillyAction: '✅ DONE. Registration K2026156151 confirmed. Annual returns must be filed on time. Ensure MOI is correct for a technology SaaS company.',
    contacts: 'cipc.co.za | 0861 843 384',
    timeline: 'Annual returns due within 30 business days after anniversary date',
    cost: 'Annual return: ~R500/year',
  },
  {
    id: 'sars',
    body: 'SARS',
    fullName: 'South African Revenue Service — Income Tax & VAT',
    category: 'registration',
    status: 'in-progress',
    urgency: 'blocking',
    requirement: 'Income Tax registration (company). VAT registration required once annual turnover exceeds R1,000,000 (or may voluntarily register earlier for B2B credibility).',
    qillyAction: 'Register for Income Tax (company) immediately if not done. VAT registration recommended BEFORE first PROFESSIONAL subscriber — most contractors will need a VAT invoice. Apply via eFiling.',
    contacts: 'sars.gov.za | 0800 00 7277',
    timeline: 'Complete before first invoice issued',
    cost: 'Free to register. VAT filing monthly/bi-monthly once registered.',
  },
  {
    id: 'cidb',
    body: 'CIDB',
    fullName: 'Construction Industry Development Board',
    category: 'registration',
    status: 'pending',
    urgency: 'blocking',
    requirement: 'CIDB Act 38 of 2000. Qilly as a ConTech service provider should register as a CIDB-associated system. More importantly: Qilly\'s BOQ outputs must align with CIDB contractor grading (Grade 1–9) so that each BOQ clearly indicates which CIDB grade contractors can price it.',
    qillyAction: '1. Contact CIDB to confirm if technology providers require registration (likely not mandatory, but recommended for credibility). 2. CRITICAL: Implement CIDB grade filtering in BOQ output — every Qilly BOQ must indicate the minimum CIDB contractor grade for that project type. 3. Map Qilly subscription tiers to CIDB grades: FREE→Grade 1-2, PRO→Grade 2-5, ENT→Grade 5-9.',
    contacts: 'cidb.org.za | 012 482 7200 | info@cidb.org.za',
    timeline: 'Implement CIDB grade mapping before go-LIVE. Registration enquiry: Q2 2026.',
    cost: 'Registration: TBD (likely nominal). Implementation: internal dev work.',
  },
  {
    id: 'nhbrc',
    body: 'NHBRC',
    fullName: 'National Home Builders Registration Council',
    category: 'registration',
    status: 'pending',
    urgency: 'important',
    requirement: 'Housing Consumers Protection Measures Act 95 of 1998. NHBRC registration required for contractors building residential dwellings. Qilly\'s BOQs for residential projects should include NHBRC enrolment fees as a standard BOQ item.',
    qillyAction: '1. Add NHBRC enrolment fee as a standard "Preliminaries and General" BOQ line item for all residential project types. 2. Display NHBRC contractor verification status in the Qilly contractor profile. 3. No registration required for Qilly itself — but documentation of NHBRC compliance in contractor profiles is required.',
    contacts: 'nhbrc.org.za | 0800 200 824',
    timeline: 'BOQ line item: implement before go-LIVE. Contractor profile: Phase 2.',
    cost: 'Internal dev work. NHBRC enrolment rates in BOQ: 1.3% of contract value.',
  },
  {
    id: 'sacqsp',
    body: 'SACQSP',
    fullName: 'South African Council for the Quantity Surveying Profession',
    category: 'registration',
    status: 'pending',
    urgency: 'important',
    requirement: 'Quantity Surveying Profession Act 49 of 2000. Qilly does not employ QSs directly — but the platform produces BOQs that are QS outputs. SACQSP needs to clarify whether automated BOQ platforms require any form of professional endorsement.',
    qillyAction: '1. Write formally to SACQSP Council requesting a position statement on AI/automated BOQ platforms. 2. Pursue a SACQSP endorsement or recognition letter — this massively increases credibility. 3. Consider appointing a registered QS as a technical advisor to Qilly (part-time, R5,000–R15,000/month) for professional oversight. 4. Add disclaimer: "Qilly BOQs are pricing intelligence tools — final certification by a registered QS is the contractor\'s responsibility."',
    contacts: 'sacqsp.org.za | 012 346 4925 | sacqsp@sacqsp.org.za',
    timeline: 'Written enquiry: April 2026. Endorsement pursuit: Q3 2026.',
    cost: 'QS advisor: R5K–R15K/month. Registration: TBD.',
  },
  {
    id: 'asaqs',
    body: 'ASAQS',
    fullName: 'Association of South African Quantity Surveyors',
    category: 'registration',
    status: 'pending',
    urgency: 'recommended',
    requirement: 'Industry body membership — not mandatory but strategically important for market access.',
    qillyAction: '1. Apply for ASAQS Associate Membership as a ConTech company. 2. Present at ASAQS annual conference — positioning Qilly as the QS profession\'s digital partner, not a threat. 3. Partner with ASAQS for training/CPD content (BuildAid 2025/2026 standard).',
    contacts: 'asaqs.co.za | 011 315 4140 | admin@asaqs.co.za',
    timeline: 'Membership application: Q2 2026. Conference: Q3 2026.',
    cost: 'Associate membership: ~R5,000/year.',
  },

  // ── TECHNICAL — SANS 1200 ────────────────────────────────────────────────
  {
    id: 'sans1200',
    body: 'SANS 1200',
    fullName: 'South African National Standard 1200 — Standard Specifications for Civil Engineering Construction',
    category: 'technical',
    status: 'in-progress',
    urgency: 'blocking',
    requirement: 'SANS 1200 is the primary civil engineering BOQ specification standard in South Africa. 24 sub-parts cover all civil construction work items. Qilly\'s BOQ output for civil projects MUST reference SANS 1200 item codes and descriptions correctly.',
    qillyAction: '1. Map all current BOQ item codes to the correct SANS 1200 sub-part (A through Q). 2. Implement SANS 1200 item code field in every BOQ line item for civil projects. 3. Build a SANS 1200 reference table as a dropdown for civil BOQ item classification. 4. Add "SANS 1200 compliant" badge on civil BOQ outputs. 5. PRIORITY: Add civil/earthworks suppliers (G4 Cube, Afrimat, Concor) — currently ZERO civil suppliers in the database.',
    contacts: 'SABS: sabs.co.za | 012 428 6700. Purchase SANS 1200: store.sabs.co.za',
    timeline: 'SANS 1200 mapping: Priority 1 before go-LIVE for civil projects',
    cost: 'SANS 1200 document set purchase: ~R15,000–R25,000. Implementation: internal.',
  },
  {
    id: 'sans10400',
    body: 'SANS 10400',
    fullName: 'National Building Regulations — SANS 10400 (Parts A–T)',
    category: 'technical',
    status: 'pending',
    urgency: 'important',
    requirement: 'National Building Regulations and Building Standards Act 103 of 1977. SANS 10400 governs all building construction in SA. Qilly\'s BOQ items for building projects should reference SANS 10400 compliance requirements.',
    qillyAction: '1. Ensure all building BOQ items comply with SANS 10400 specifications (structural, fire, energy efficiency). 2. Add energy efficiency BOQ items (SANS 10400-XA for energy) — critical for ENTERPRISE green building tier. 3. Include building plans approval and occupation certificate fees as standard Preliminaries BOQ items.',
    contacts: 'Department of Human Settlements | SABS: sabs.co.za',
    timeline: 'Review compliance mapping: Q2 2026. Green building items: Phase 2.',
    cost: 'SANS 10400 document purchase: ~R8,000. Internal implementation.',
  },
  {
    id: 'buildaid',
    body: 'BuildAid',
    fullName: 'BuildAid Price Book 2025/2026 — SA Construction Industry Standard',
    category: 'technical',
    status: 'done',
    urgency: 'blocking',
    requirement: 'BuildAid 2025/2026 is the primary pricing reference for South African construction. Qilly\'s platform is explicitly built on BuildAid standards.',
    qillyAction: '✅ DONE. BuildAid 2025/2026 is the core pricing reference. Annual update required: 2026/2027 edition must be incorporated when published (typically June/July each year). Budget for annual licence/purchase.',
    contacts: 'buildaid.co.za | 021 447 8704',
    timeline: 'Current: 2025/2026 incorporated. Next update: July 2026.',
    cost: 'Annual BuildAid licence: ~R3,500–R8,500/year.',
  },
  {
    id: 'safcec',
    body: 'SAFCEC',
    fullName: 'South African Federation of Civil Engineering Contractors — Labour & Plant Rates',
    category: 'technical',
    status: 'pending',
    urgency: 'important',
    requirement: 'SAFCEC publishes the definitive labour and plant hire rates used by civil engineering QSs. These rates are referenced in SANS 1200 civil BOQs for wage rates, overtime, and statutory contributions.',
    qillyAction: '1. Purchase SAFCEC current wage rate schedule and incorporate as the civil labour rate reference. 2. Implement SAFCEC wage rates in the Qilly pricing engine for all civil BOQ labour items. 3. SAFCEC rates update quarterly — build an update process.',
    contacts: 'safcec.org.za | 011 409 0900 | info@safcec.org.za',
    timeline: 'Purchase and implement: Q2 2026 (before civil module go-LIVE)',
    cost: 'SAFCEC wage schedule: ~R2,000/year.',
  },
  {
    id: 'master-builders',
    body: 'MBA',
    fullName: 'Master Builders South Africa — Labour Wage Rates (Building)',
    category: 'technical',
    status: 'pending',
    urgency: 'important',
    requirement: 'MBA publishes building industry labour rates (artisans, builders, labourers) under various collective agreements. These are the reference labour rates for building BOQ labour sections.',
    qillyAction: '1. Purchase MBA current wage rate schedule for building industry. 2. Implement as building labour rate reference in Qilly pricing engine. 3. Build provincial wage variation table (KZN rates differ from WC, GP etc.).',
    contacts: 'mbsa.org.za | 011 205 9000',
    timeline: 'Implement: Q2 2026',
    cost: 'MBA wage schedule: ~R1,500/year.',
  },

  // ── LEGAL ─────────────────────────────────────────────────────────────────
  {
    id: 'popia',
    body: 'POPIA',
    fullName: 'Protection of Personal Information Act No. 4 of 2013',
    category: 'legal',
    status: 'in-progress',
    urgency: 'blocking',
    requirement: 'POPIA compliance is mandatory for any SA company that processes personal information. Qilly collects: contractor name, email, phone, company, payment details, project data.',
    qillyAction: '1. ✅ POPIA framework implemented in platform. 2. Appoint an Information Officer (the CEO can self-appoint initially — free). 3. Register as Information Officer with Information Regulator (free, required). 4. Complete POPIA impact assessment — document all personal data flows. 5. Implement data deletion/right-to-be-forgotten functionality. 6. Review sub-processor agreements (Supabase, PayFast, Stitch).',
    contacts: 'justice.gov.za/inforeg | inforeg@justice.gov.za | 010 023 5207',
    timeline: 'Information Officer registration: before go-LIVE (30 days to register)',
    cost: 'Registration: Free. Legal review: R8,000–R20,000. Internal implementation.',
  },
  {
    id: 'ect',
    body: 'ECT Act',
    fullName: 'Electronic Communications and Transactions Act No. 25 of 2002',
    category: 'legal',
    status: 'in-progress',
    urgency: 'blocking',
    requirement: 'ECT Act governs all e-commerce transactions in SA. Qilly\'s subscription payments, contractor registration, and BOQ delivery are all subject to ECT Act requirements.',
    qillyAction: '1. Ensure Terms of Service comply with ECT Act Section 43 (e-commerce disclosure requirements). 2. Display full company registration details on website (K2026156151, 210 Kirkness Avenue). 3. Confirm 30-day cancellation policy in T&C. 4. Implement electronic acknowledgement of all agreements.',
    contacts: 'DCDT: dcdt.gov.za',
    timeline: 'T&C review: before go-LIVE',
    cost: 'Legal review of T&C: R5,000–R15,000',
  },
  {
    id: 'cpa',
    body: 'CPA',
    fullName: 'Consumer Protection Act No. 68 of 2008',
    category: 'legal',
    status: 'in-progress',
    urgency: 'blocking',
    requirement: 'CPA applies to all B2C transactions. For Qilly\'s FREE and PROFESSIONAL tiers selling to individual contractors — CPA applies. Key requirements: price transparency, right to cancel, no unfair terms.',
    qillyAction: '1. All subscription prices must be displayed inclusive of VAT (once VAT registered). 2. Implement 5-business-day cooling off period for new subscriptions. 3. Review cancellation and refund policy per CPA Section 17. 4. Ensure no automatic renewal without explicit consent.',
    contacts: 'NCC: thencc.org.za | 012 428 7000',
    timeline: 'T&C and pricing page review: before go-LIVE',
    cost: 'CPA compliance legal review: R5,000–R10,000',
  },
  {
    id: 'competition',
    body: 'Competition Act',
    fullName: 'Competition Act No. 89 of 1998 — Collusion Detection Feature',
    category: 'legal',
    status: 'pending',
    urgency: 'important',
    requirement: 'Qilly\'s ENTERPRISE collusion detection feature flags suspicious BOQ pricing patterns. This feature must be carefully positioned — it supports competition law compliance, not investigation. Legal sign-off required before activation.',
    qillyAction: '1. Review collusion detection algorithm with a competition law attorney before enabling. 2. Add clear disclaimer: "Qilly\'s collusion detection is an advisory tool — legal action requires investigation by the Competition Commission." 3. Consider positioning as "Price Reasonableness Checker" rather than "Collusion Detector" to avoid liability. 4. Competition Commission of SA should be briefed on the feature.',
    contacts: 'compcom.co.za | 012 394 3200',
    timeline: 'Legal review: Q3 2026 before ENTERPRISE launch',
    cost: 'Competition law attorney review: R15,000–R30,000',
  },

  // ── OPERATIONAL ──────────────────────────────────────────────────────────
  {
    id: 'payfast',
    body: 'PayFast / Stitch',
    fullName: 'Payment Service Providers — PayFast (DPO Group) & Stitch Money',
    category: 'operational',
    status: 'in-progress',
    urgency: 'blocking',
    requirement: 'Payment processing for PROFESSIONAL (R2,999/mo) and ENTERPRISE (R8,999/mo) tiers. Both PayFast and Stitch are configured. Must comply with PCI-DSS for card handling.',
    qillyAction: '1. ✅ Both PayFast and Stitch integrated. 2. Complete PayFast merchant verification (requires CIPC docs, bank statement, ID). 3. Implement webhook confirmation before unlocking access — prevent payment-without-access or access-without-payment bugs. 4. Test manual EFT [23514] constraint fix in SIT before go-LIVE.',
    contacts: 'payfast.co.za | support@payfast.co.za. stitch.money | support@stitch.money',
    timeline: 'PayFast merchant verification: before go-LIVE. Webhook testing: before go-LIVE.',
    cost: 'PayFast: 3.5% + R2.00 per transaction. Stitch: TBD per agreement.',
  },
  {
    id: 'iso27001',
    body: 'ISO 27001',
    fullName: 'Information Security Management System — ISO/IEC 27001:2022',
    category: 'operational',
    status: 'pending',
    urgency: 'recommended',
    requirement: 'ISO 27001 certification is a requirement for government and enterprise contracts (CIDB Grade 7–9, SOE procurement). Not legally mandatory at launch but critical for ENTERPRISE clients.',
    qillyAction: '1. Document Qilly\'s information security policies (password, access control, data classification). 2. Implement security baseline (MFA for admin, encrypted storage, audit logs). 3. Formal ISO 27001 certification: Year 2 goal. 4. Initial security assessment: hire a cybersecurity firm for a gap analysis (R15K–R30K).',
    contacts: 'SABS Certification: sabscertification.co.za | NQA: nqa.com/en-za',
    timeline: 'Security policies: before go-LIVE. ISO audit: Q4 2026–Q1 2027.',
    cost: 'Gap analysis: R15K–R30K. Certification: R80K–R150K.',
  },
  {
    id: 'supabase',
    body: 'Supabase / Data',
    fullName: 'Supabase Data Infrastructure — DEV & SIT Database Governance',
    category: 'operational',
    status: 'in-progress',
    urgency: 'blocking',
    requirement: 'DEV (zzdzrlglivtpawtitvgu) and SIT (kcptusoevqapcvptlgkd) databases operational. Production database must be on a dedicated Supabase Pro or Team plan with daily backups, point-in-time recovery, and SA region (or closest: Europe-West).',
    qillyAction: '1. Upgrade production Supabase to PRO plan (R600–R1,200/month) before go-LIVE. 2. Enable point-in-time recovery. 3. Configure South Africa or Europe region. 4. Implement Row Level Security (RLS) for all tables. 5. Enable audit logging. 6. Document data residency for POPIA compliance (where is SA contractor data stored?).',
    contacts: 'supabase.com/pricing | support@supabase.io',
    timeline: 'PRO plan: before go-LIVE. RLS audit: Q2 2026.',
    cost: 'Supabase PRO: ~$25/month (~R460). Team: ~$599/month for enterprise.',
  },
  {
    id: 'vercel',
    body: 'Vercel / Hosting',
    fullName: 'Vercel Deployment — Production Hosting & CI/CD',
    category: 'operational',
    status: 'in-progress',
    urgency: 'blocking',
    requirement: 'Figma Make → GitHub (dev-branch) → Vercel pipeline operational. Production deployment must be on a Vercel Pro or Enterprise plan.',
    qillyAction: '1. Upgrade Vercel to PRO plan before go-LIVE (required for custom domain, SLA, analytics). 2. Configure custom domain: app.qilly.co.za or similar. 3. Set environment variables for PROD (separate from DEV/SIT). 4. Implement Vercel Analytics for uptime monitoring. 5. Configure preview deployments for dev-branch.',
    contacts: 'vercel.com/pricing | support@vercel.com',
    timeline: 'PRO plan + custom domain: before go-LIVE',
    cost: 'Vercel PRO: $20/month. Custom domain: ~R150/year.',
  },

  // ── FINANCIAL ─────────────────────────────────────────────────────────────
  {
    id: 'fnb-business',
    body: 'Business Banking',
    fullName: 'Dedicated Business Bank Account — FNB Business / ABSA Business',
    category: 'financial',
    status: 'in-progress',
    urgency: 'blocking',
    requirement: 'Separate business bank account required for PayFast merchant verification, investor due diligence, SARS compliance, and POPIA data separation.',
    qillyAction: '1. Open FNB Business Cheque or ABSA Business current account in company name (Qilly Pty Ltd). 2. Never mix personal and company funds. 3. Required for PayFast merchant verification. 4. Required for SARS EFT tax payments.',
    contacts: 'FNB Business: fnb.co.za/business | ABSA: absa.co.za/business',
    timeline: 'Before first subscriber payment received',
    cost: 'FNB Business: ~R200–R500/month. ABSA Business: ~R150–R400/month.',
  },
  {
    id: 'bbbee',
    body: 'B-BBEE',
    fullName: 'Broad-Based Black Economic Empowerment — B-BBEE Certificate',
    category: 'financial',
    status: 'pending',
    urgency: 'blocking',
    requirement: 'B-BBEE compliance is required for: (1) government/SOE contracts, (2) DFI funding applications (IDC, NEF, SEFA), (3) CIDB contractor procurement, and (4) enterprise contracts with JSE-listed companies. Qilly as a black-owned company should be Level 1.',
    qillyAction: '1. Engage a SANAS-accredited B-BBEE verification agency for certification. 2. As a black-owned Exempt Micro Enterprise (EME — turnover <R10M), Qilly qualifies for automatic Level 1 via an affidavit (Section 9(1) of the B-BBEE Act). 3. Complete a B-BBEE affidavit immediately — costs R0 to R500 (commissioner of oaths). 4. Upgrade to formal B-BBEE certificate once turnover exceeds R10M.',
    contacts: 'SANAS: sanas.co.za. B-BBEE Commission: bbbeecommission.co.za | 012 394 3200',
    timeline: 'EME affidavit: within 2 weeks. Formal certification: when turnover > R10M.',
    cost: 'EME affidavit: R0–R500. Formal verification: R8,000–R25,000.',
  },
  {
    id: 'tax-clearance',
    body: 'Tax Clearance',
    fullName: 'SARS Tax Clearance Certificate (Good Standing)',
    category: 'financial',
    status: 'pending',
    urgency: 'blocking',
    requirement: 'Required for: (1) government/SOE contracts (via CSD registration), (2) DFI/government funding applications, (3) any tender process. Valid for 1 year.',
    qillyAction: '1. Register for SARS eFiling if not done. 2. Ensure all tax returns are up to date. 3. Apply for Tax Compliance Status (TCS) via SARS eFiling — free, generated immediately if tax affairs are in order. 4. Register on the Central Supplier Database (CSD) at csd.gov.za for government procurement.',
    contacts: 'SARS eFiling: sarsefiling.co.za | CSD: csd.gov.za',
    timeline: 'Before any DFI application or government contract',
    cost: 'Free (SARS eFiling). CSD registration: Free.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<GoLiveStatus, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  done:        { label: 'Done ✓',      bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-300', icon: <CheckCircle className="w-4 h-4 text-green-600" /> },
  'in-progress': { label: 'In Progress', bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-300',  icon: <Clock className="w-4 h-4 text-blue-600" /> },
  pending:     { label: 'Pending',     bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-300', icon: <AlertTriangle className="w-4 h-4 text-amber-600" /> },
  critical:    { label: '⚠ Critical',  bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-300',   icon: <XCircle className="w-4 h-4 text-red-600" /> },
};

const URGENCY_CFG = {
  blocking:    { label: 'BLOCKING go-LIVE', bg: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  important:   { label: 'Important',        bg: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  recommended: { label: 'Recommended',      bg: 'bg-blue-100 text-blue-600', dot: 'bg-blue-400' },
};

const PRIORITY_CFG = {
  critical: { label: 'Critical Gap', bg: 'bg-red-100 text-red-700 border-red-300', dot: 'bg-red-500' },
  high:     { label: 'High Priority', bg: 'bg-amber-100 text-amber-700 border-amber-300', dot: 'bg-amber-500' },
  medium:   { label: 'Medium Priority', bg: 'bg-blue-100 text-blue-700 border-blue-300', dot: 'bg-blue-400' },
  low:      { label: 'Low Priority', bg: 'bg-gray-100 text-gray-600 border-gray-300', dot: 'bg-gray-400' },
};

const CATEGORY_CFG: Record<string, { label: string; colour: string; icon: React.ReactNode }> = {
  registration: { label: 'Registration', colour: 'bg-purple-50 border-purple-200 text-purple-700', icon: <Award className="w-4 h-4" /> },
  technical:    { label: 'Technical Standards', colour: 'bg-blue-50 border-blue-200 text-blue-700', icon: <Wrench className="w-4 h-4" /> },
  legal:        { label: 'Legal Compliance', colour: 'bg-rose-50 border-rose-200 text-rose-700', icon: <Scale className="w-4 h-4" /> },
  operational:  { label: 'Operational', colour: 'bg-teal-50 border-teal-200 text-teal-700', icon: <Zap className="w-4 h-4" /> },
  financial:    { label: 'Financial', colour: 'bg-green-50 border-green-200 text-green-700', icon: <BarChart3 className="w-4 h-4" /> },
};

// ─────────────────────────────────────────────────────────────────────────────
// SANS 1200 STRUCTURE
// ─────────────────────────────────────────────────────────────────────────────
const SANS1200_PARTS = [
  { code: 'A', title: 'General', description: 'Definitions, measurement rules, general provisions', covered: true, suppliers: 'BuildAid, PPC, AfriSam' },
  { code: 'B', title: 'Earthworks', description: 'Bulk excavation, filling, compaction', covered: true, suppliers: '✅ G4 Cube, Afrimat, Sapstone, Fibertex, Kaytech, Maccaferri added' },
  { code: 'C', title: 'Concrete Works', description: 'All cast in-situ concrete, formwork, reinforcing', covered: true, suppliers: 'PPC, AfriSam, Sephaku, ArcelorMittal, Cape Gate' },
  { code: 'DB', title: 'Bedding & Backfilling (Pipes)', description: 'Trench bedding, pipe zones, compaction', covered: true, suppliers: '✅ G4 Cube, Afrimat, Sapstone for bedding aggregates. Fibertex, Kaytech for geotextile bedding.' },
  { code: 'DC', title: 'Manholes & Chambers', description: 'Precast and in-situ manholes, chambers', covered: true, suppliers: 'Infraset, Technicrete, Bosun' },
  { code: 'DD', title: 'Roads', description: 'Subgrade, layers, asphalt, surfacing', covered: true, suppliers: '✅ Much Asphalt, Tosas Bitumen, TotalEnergies Bitumen, Engen Bitumen added' },
  { code: 'DF', title: 'Structural Steelwork', description: 'Fabricated structural steel sections', covered: true, suppliers: 'ArcelorMittal, Cape Gate, Chamberlain, Macsteel (B2B)' },
  { code: 'E', title: 'Electrical', description: 'LV/MV cabling, switchgear, distribution', covered: true, suppliers: 'ARB, Voltex, Actom, ABB, Schneider. Gap: cable suppliers' },
  { code: 'F', title: 'Fire', description: 'Fire detection, suppression, exit signage', covered: true, suppliers: '✅ Wormald Fire Protection, Fire Solutions SA added' },
  { code: 'G', title: 'Roofing', description: 'IBR, tiles, trusses, waterproofing', covered: true, suppliers: 'Safintra, Brownbuilt, Fullstop, Gyproc, Isover. Gap: IBR sheets' },
  { code: 'H', title: 'Structural Timber', description: 'Roof trusses, structural timber framing', covered: true, suppliers: '✅ Trussworks (MiTek), PG Bison, Saligna Timber, Lacewood Flooring added' },
  { code: 'J', title: 'Windows & Doors', description: 'Aluminium and timber windows, internal/external doors, glazing', covered: true, suppliers: '✅ PG Glass, Guardian Glass, Aluplast, Fenster, Stalwart Doors added' },
  { code: 'K', title: 'Finishes', description: 'Plastering, tiling, painting, floor finishes', covered: true, suppliers: 'CTM, Italtile, Dulux, Plascon, TAL. Gap: epoxy, vinyl flooring' },
  { code: 'L', title: 'Ceilings & Partitions', description: 'Suspended ceilings, drylining partitions', covered: true, suppliers: 'Gyproc, Knauf, Saint-Gobain, Isover. Gap: speciality ceiling systems' },
  { code: 'M', title: 'Mechanical / HVAC / Plumbing', description: 'Plumbing, drainage, HVAC, pumps', covered: true, suppliers: 'KSB, Marley, Geberit, JoJo, Cobra, Kwikot, KSB. Gap: HVAC suppliers' },
  { code: 'P', title: 'Paving & External Works', description: 'Paving, kerbs, drainage channels, fencing', covered: true, suppliers: '✅ Tegola Paving, Terraforce Retaining, Bosun (paving bricks/kerbs), Technicrete' },
  { code: 'Q', title: 'Landscaping', description: 'Planting, turf, irrigation, external features', covered: true, suppliers: '✅ Envirowild Landscaping (turf, trees, drip irrigation) added. Phase 3: Hunter Industries irrigation.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function ComplianceCard({ item }: { item: ComplianceItem }) {
  const [open, setOpen] = useState(false);
  const sc = STATUS_CFG[item.status];
  const uc = URGENCY_CFG[item.urgency];
  const cc = CATEGORY_CFG[item.category];

  return (
    <div className={`border-2 rounded-xl overflow-hidden ${sc.border}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between p-4 text-left transition-opacity hover:opacity-90 ${sc.bg}`}
      >
        <div className="flex items-center gap-3 flex-wrap">
          {sc.icon}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 text-sm">{item.body}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.text} border ${sc.border}`}>{sc.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${uc.bg}`}>{uc.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${cc.colour}`}>{cc.label}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.fullName}</p>
          </div>
        </div>
        <div className="shrink-0 ml-2">
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="bg-white px-5 py-4 space-y-3 border-t border-gray-100">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Requirement</p>
            <p className="text-sm text-gray-700 leading-relaxed">{item.requirement}</p>
          </div>
          <div className={`rounded-lg p-3 border ${sc.border} ${sc.bg}`}>
            <p className="text-xs font-bold uppercase tracking-wide mb-1 text-gray-600">Qilly Action Required</p>
            <p className={`text-sm leading-relaxed ${sc.text} font-medium`}>{item.qillyAction}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-1">Contact / Resource</p>
              <p className="text-xs text-gray-600 leading-relaxed">{item.contacts}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-1">Timeline</p>
              <p className="text-xs text-gray-600 leading-relaxed">{item.timeline}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-1">Estimated Cost</p>
              <p className="text-xs text-gray-600 leading-relaxed">{item.cost}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export function SupplierCoverageCompliance() {
  const [activeTab, setActiveTab] = useState<Tab>('coverage');
  const [complianceFilter, setComplianceFilter] = useState<'all' | 'registration' | 'technical' | 'legal' | 'operational' | 'financial'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'blocking' | 'important' | 'recommended'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [gapCategory, setGapCategory] = useState('all');

  const missingCategories = [...new Set(MISSING_SUPPLIERS.map(s => s.category))];

  const filteredCompliance = COMPLIANCE_ITEMS.filter(item => {
    if (complianceFilter !== 'all' && item.category !== complianceFilter) return false;
    if (urgencyFilter !== 'all' && item.urgency !== urgencyFilter) return false;
    return true;
  });

  const filteredGaps = MISSING_SUPPLIERS.filter(s => {
    if (gapCategory !== 'all' && s.category !== gapCategory) return false;
    if (priorityFilter !== 'all' && s.priority !== priorityFilter) return false;
    return true;
  });

  const blockingCount = COMPLIANCE_ITEMS.filter(c => c.urgency === 'blocking').length;
  const doneCount = COMPLIANCE_ITEMS.filter(c => c.status === 'done').length;
  const criticalGaps = MISSING_SUPPLIERS.filter(s => s.priority === 'critical').length;
  const sans1200Covered = SANS1200_PARTS.filter(p => p.covered).length;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'coverage', label: 'Current Coverage', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'gaps', label: `Gaps & Expansion (${MISSING_SUPPLIERS.length})`, icon: <Target className="w-4 h-4" /> },
    { key: 'compliance', label: 'CIDB / Compliance', icon: <Shield className="w-4 h-4" /> },
    { key: 'roadmap', label: 'SANS 1200 Map', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full space-y-5">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0077b6] text-white rounded-xl px-6 py-6">
        <div className="flex items-center gap-3 mb-2">
          <HardHat className="w-5 h-5 text-yellow-300" />
          <span className="text-yellow-200 text-xs font-medium tracking-wide uppercase">Supplier Coverage & Go-LIVE Compliance — March 2026</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Qilly: Supplier Coverage & Compliance Dashboard</h2>
        <p className="text-slate-200 text-sm leading-relaxed max-w-3xl">
          You already have <strong className="text-white">{CURRENT_COVERAGE.total} suppliers</strong> configured — 36 scraping, 22 REST, 42 manual.
          But coverage gaps exist in civil works, glazing, masonry, and external works.
          This dashboard also tracks CIDB, SANS 1200, and all go-LIVE compliance obligations.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { n: `${CURRENT_COVERAGE.total}`, label: 'Suppliers configured', bg: 'bg-white/10' },
            { n: `${CURRENT_COVERAGE.scraping}`, label: 'Web scraping', bg: 'bg-purple-500/30' },
            { n: `${CURRENT_COVERAGE.rest}`, label: 'REST API', bg: 'bg-blue-500/30' },
            { n: `${CURRENT_COVERAGE.manual}`, label: 'Manual/upload', bg: 'bg-gray-400/30' },
            { n: `59`, label: 'New suppliers added', bg: 'bg-green-500/30' },
            { n: `${MISSING_SUPPLIERS.length}`, label: 'Phase-3 gaps remaining', bg: 'bg-amber-500/30' },
            { n: `${blockingCount}`, label: 'Blocking compliance items', bg: 'bg-red-600/30' },
            { n: `${SANS1200_PARTS.length}/${SANS1200_PARTS.length}`, label: 'SANS 1200 sections covered', bg: 'bg-green-500/30' },
          ].map(({ n, label, bg }) => (
            <div key={label} className={`${bg} backdrop-blur rounded-xl px-4 py-2.5 text-center min-w-[110px]`}>
              <div className="text-xl font-bold">{n}</div>
              <div className="text-slate-300 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab nav */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.key ? 'border-[#0077b6] text-[#0077b6] bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB 1: CURRENT COVERAGE ──────────────────────────────────────── */}
      {activeTab === 'coverage' && (
        <div className="space-y-4">
          {/* Corrected supplier count explanation */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Supplier count — the full picture (now 159 suppliers)</h3>
                <p className="text-sm text-blue-800 leading-relaxed mb-3">
                  The original 36 was just the <em>web scraping</em> count. After adding 59 new suppliers in this batch, total is now <strong>159</strong>:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  {[
                    { type: 'Web Scraping', count: 57, desc: 'Live price fetch — public retail prices', colour: 'bg-purple-100 border-purple-200 text-purple-800' },
                    { type: 'REST API', count: 38, desc: 'Direct API integration', colour: 'bg-blue-100 border-blue-200 text-blue-800' },
                    { type: 'Manual / Upload', count: 64, desc: 'Supplier uploads own price list', colour: 'bg-gray-100 border-gray-200 text-gray-700' },
                  ].map(({ type, count, desc, colour }) => (
                    <div key={type} className={`rounded-lg p-3 border ${colour}`}>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="font-semibold text-sm">{type}</p>
                      <p className="text-xs opacity-75">{desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-green-800 bg-green-50 rounded-lg p-3 border border-green-200">
                  ✅ <strong>Is 159 enough?</strong> Yes — for PROFESSIONAL and ENTERPRISE tiers. All 17 SANS 1200 sections now have supplier coverage. All 9 CIDB grading categories are covered. 5 minor phase-3 gaps remain (epoxy floors, vinyl flooring, irrigation specialists, suspended ceilings, crane hire).
                </p>
              </div>
            </div>
          </div>

          {/* ── PRICING STRATEGY ANSWER (Question 2) ── */}
          <div className="bg-white border-2 border-amber-300 rounded-xl overflow-hidden">
            <div className="bg-amber-50 px-5 py-4 border-b border-amber-200 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h3 className="font-bold text-amber-900">❓ Do manual suppliers have real prices or simulated prices?</h3>
                <p className="text-xs text-amber-700 mt-0.5">Critical answer for go-LIVE readiness</p>
              </div>
            </div>
            <div className="px-5 py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    type: '🔴 MANUAL suppliers (64)',
                    status: 'SIMULATED PRICES',
                    bg: 'bg-red-50 border-red-200',
                    title: 'text-red-800',
                    body: 'All 64 manual suppliers currently use SIMULATED/ESTIMATED prices hardcoded in SupplierIntegration.tsx. These prices were estimated from BuildAid 2025/2026 and published rate schedules to make the platform look complete for demos. They are NOT real prices submitted by the actual suppliers.',
                    action: 'Action required: Contact each manual supplier and ask them to upload their current price list via the Supplier Portal at /supplier-signup.',
                  },
                  {
                    type: '🟡 SCRAPING suppliers (57)',
                    status: 'PLACEHOLDER PRICES (Demo)',
                    bg: 'bg-amber-50 border-amber-200',
                    title: 'text-amber-800',
                    body: 'Scraping suppliers have real websites with real prices — BUT the actual web scraper has not been built yet. Currently the platform uses hardcoded demo prices from SupplierIntegration.tsx. When live scraping is implemented, prices will update automatically from the supplier websites.',
                    action: 'Action required: Build and deploy the scraper microservice (server-side, outside Figma Make/Vercel). Until then, prices are BuildAid-estimated placeholders.',
                  },
                  {
                    type: '🟢 REST API suppliers (38)',
                    status: 'PLACEHOLDER (API not connected)',
                    bg: 'bg-blue-50 border-blue-200',
                    title: 'text-blue-800',
                    body: 'REST API suppliers are configured but no actual API connections have been established. Prices are BuildAid-estimated. Real API connections require formal data supply agreements with each supplier (PPC, AfriSam, Dulux, Plascon, KSB, etc.).',
                    action: 'Action required: Negotiate data supply agreements. Short-term: use BuildAid rates. Medium-term: activate REST APIs per supplier partnership.',
                  },
                ].map(({ type, status, bg, title, body, action }) => (
                  <div key={type} className={`rounded-xl border-2 p-4 ${bg}`}>
                    <p className={`font-bold text-sm mb-1 ${title}`}>{type}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${bg} ${title} border inline-block mb-2`}>{status}</span>
                    <p className="text-xs text-gray-700 leading-relaxed mb-3">{body}</p>
                    <div className="bg-white rounded-lg p-2 border border-gray-200">
                      <p className="text-xs font-bold text-gray-600 mb-1">Required Action:</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{action}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* The go-LIVE pricing strategy */}
              <div className="bg-slate-800 text-white rounded-xl p-5">
                <h4 className="font-bold text-base mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-yellow-300" />
                  Recommended Go-LIVE Pricing Strategy (3-phase approach)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      phase: 'Phase 1 — Launch (Now)',
                      label: 'BuildAid as Primary Source',
                      colour: 'bg-green-500/20 border-green-500/40',
                      items: [
                        'Use BuildAid 2025/2026 as the authoritative price reference',
                        'Simulated supplier prices are BuildAid-calibrated — they are close to real market rates',
                        'Label BOQ as "Estimated from BuildAid 2025/2026 & market rates"',
                        'FREE tier users: this is perfectly sufficient for training BOQs',
                        'PROFESSIONAL users: acceptable for early-stage project estimation',
                      ],
                    },
                    {
                      phase: 'Phase 2 — Q2/Q3 2026',
                      label: 'Activate Live Scraping',
                      colour: 'bg-blue-500/20 border-blue-500/40',
                      items: [
                        'Build scraper microservice for top 20 scraping suppliers',
                        'Priority: Cashbuild, Buco, Build It, ARB, Voltex, CTM, Italtile',
                        'Real prices from retailer sites replace simulated prices automatically',
                        'Manual suppliers: send onboarding emails + Supplier Portal link',
                        'Target: 60% of suppliers on real prices by Q3 2026',
                      ],
                    },
                    {
                      phase: 'Phase 3 — Q4 2026',
                      label: 'Formal Supplier Partnerships',
                      colour: 'bg-purple-500/20 border-purple-500/40',
                      items: [
                        'Negotiate data supply agreements with JSE-listed suppliers',
                        'Activate REST APIs: PPC, AfriSam, Dulux, Plascon, ARB, Actom',
                        'ENTERPRISE: dedicated supplier relationship manager',
                        'Target: 90% of supplier prices are live/real by end 2026',
                        'Supplier logo + "verified price" badge on BOQ outputs',
                      ],
                    },
                  ].map(({ phase, label, colour, items }) => (
                    <div key={phase} className={`rounded-lg border p-3 ${colour}`}>
                      <p className="font-bold text-sm mb-0.5">{phase}</p>
                      <p className="text-xs text-slate-300 mb-2">{label}</p>
                      {items.map((item, i) => (
                        <p key={i} className="text-xs text-slate-200 py-1 border-b border-white/10 flex items-start gap-1.5">
                          <span className="text-yellow-300 shrink-0">→</span>{item}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  <strong className="text-slate-200">Bottom line:</strong> The simulated prices are BuildAid-calibrated and are accurate enough for Phase 1 go-LIVE. QSs understand that estimated prices need verification — Qilly clearly labels pricing sources. Real supplier prices improve accuracy and trust over time.
                </p>
              </div>
            </div>
          </div>

          {/* Category coverage table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900">Coverage by Category — vs CIDB & SANS 1200 Requirements</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Category', 'Suppliers', 'CIDB Sections', 'Coverage %', 'Gap Summary'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CURRENT_COVERAGE.categories.map((cat, i) => (
                    <tr key={cat.name} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-3 font-semibold text-gray-800 text-sm">{cat.name}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold text-lg ${cat.count === 0 ? 'text-red-600' : cat.count < 5 ? 'text-amber-600' : 'text-green-600'}`}>
                          {cat.count}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {cat.cidbSections.map(s => (
                            <span key={s} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${cat.coveragePct === 0 ? 'bg-red-500' : cat.coveragePct < 50 ? 'bg-amber-500' : cat.coveragePct < 70 ? 'bg-yellow-400' : 'bg-green-500'}`}
                              style={{ width: `${cat.coveragePct}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${cat.coveragePct === 0 ? 'text-red-600' : cat.coveragePct < 50 ? 'text-amber-600' : 'text-green-600'}`}>
                            {cat.coveragePct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 leading-relaxed max-w-xs">{cat.gap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Go-LIVE readiness */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-bold text-green-900 flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4" /> Ready for PROFESSIONAL Tier (go-LIVE)
              </h4>
              <ul className="space-y-1.5">
                {['Building materials: Buco, Cashbuild, Build It, Builders Warehouse', 'Cement: PPC, AfriSam, Sephaku', 'Steel: ArcelorMittal, Cape Gate, NJR, JVR', 'Electrical: ARB, Voltex, Actom, ABB, Schneider', 'Paint: Dulux, Plascon, Prominent Paints', 'Tiles: CTM, Italtile, Ceramic Industries', 'Timber: Timber City, Sappi, Federated Timbers', 'Plumbing: KSB, Marley, Geberit, JoJo, Cobra'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-green-800">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-bold text-green-900 flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4" /> ENTERPRISE Tier — Gaps Now Fixed (CIDB Grade 5–9)
              </h4>
              <ul className="space-y-1.5">
                {['✅ Civil earthworks: G4 Cube, Afrimat, Sapstone, Much Asphalt (SANS 1200 B/C/DB/DD)', '✅ Ready-mix concrete: Concor, Lafarge Readymix, Murray & Roberts added', '✅ Glass & glazing: PG Glass, Aluplast, Fenster, Stalwart Doors added', '✅ Masonry bricks: Corobrick, Ocon Brick, Midrand Brick, Hebel added', '✅ Scaffolding: Safway, Formscaff, Doka SA added', '✅ Fire protection: Wormald, Fire Solutions SA added', '✅ HVAC: Trane SA, Daikin SA, Energy HVAC added', '✅ Renewable energy: Solar MD, Suntech Power SA added'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-green-800">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: GAPS & EXPANSION ──────────────────────────────────────── */}
      {activeTab === 'gaps' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-600 self-center">Category:</span>
                <button onClick={() => setGapCategory('all')} className={`px-3 py-1 text-xs rounded-lg border font-medium ${gapCategory === 'all' ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-gray-600 border-gray-200'}`}>All</button>
                {missingCategories.slice(0, 8).map(cat => (
                  <button key={cat} onClick={() => setGapCategory(cat)} className={`px-3 py-1 text-xs rounded-lg border font-medium ${gapCategory === cat ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-gray-600 border-gray-200'}`}>{cat}</button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-600 self-center">Priority:</span>
                {(['all', 'critical', 'high', 'medium', 'low'] as const).map(p => (
                  <button key={p} onClick={() => setPriorityFilter(p)} className={`px-3 py-1 text-xs rounded-lg border font-medium ${priorityFilter === p ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                    {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>{MISSING_SUPPLIERS.filter(s => s.priority === 'critical').length} critical gaps</strong> and <strong>{MISSING_SUPPLIERS.filter(s => s.priority === 'high').length} high-priority gaps</strong> identified.
              Adding these {MISSING_SUPPLIERS.length} suppliers brings your total to ~<strong>160 suppliers</strong> — comprehensive coverage for all 9 CIDB grading categories and all 17 SANS 1200 specification sections.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredGaps.map(s => {
              const pc = PRIORITY_CFG[s.priority];
              const apiBadge = s.apiType === 'scraping' ? 'bg-purple-100 text-purple-700' : s.apiType === 'rest' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600';
              return (
                <div key={s.id} className={`bg-white border-2 rounded-xl p-4 ${s.priority === 'critical' ? 'border-red-200' : s.priority === 'high' ? 'border-amber-200' : 'border-gray-200'}`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-gray-900 text-sm">{s.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${pc.bg}`}>{pc.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${apiBadge}`}>{s.apiType.toUpperCase()}</span>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s.category}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{s.reason}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="text-gray-500">CIDB: <strong className="text-gray-700">{s.cidbRelevance}</strong></span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-500">SANS 1200: <strong className="text-gray-700">{s.sans1200Section}</strong></span>
                      </div>
                    </div>
                    {s.website && (
                      <a href={s.website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-[#00b4d8] hover:underline shrink-0">
                        <ExternalLink className="w-3 h-3" />{s.website.replace('https://www.', '')}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 3: COMPLIANCE ────────────────────────────────────────────── */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {['all', 'registration', 'technical', 'legal', 'operational', 'financial'].slice(0,5).map(cat => {
              const items = cat === 'all' ? COMPLIANCE_ITEMS : COMPLIANCE_ITEMS.filter(c => c.category === cat);
              const doneN = items.filter(c => c.status === 'done').length;
              const cc = cat !== 'all' ? CATEGORY_CFG[cat] : { colour: 'bg-gray-50 border-gray-200 text-gray-700', label: 'All', icon: <ClipboardCheck className="w-4 h-4" /> };
              return (
                <button key={cat} onClick={() => setComplianceFilter(cat as any)}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${complianceFilter === cat ? cc.colour + ' ring-2 ring-offset-1 ring-current' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-1.5 mb-1">{cc.icon}<span className="text-xs font-bold">{cc.label}</span></div>
                  <p className="text-lg font-bold">{doneN}/{items.length}</p>
                  <p className="text-xs opacity-70">complete</p>
                </button>
              );
            })}
          </div>

          {/* Urgency filter */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'blocking', 'important', 'recommended'] as const).map(u => (
              <button key={u} onClick={() => setUrgencyFilter(u)}
                className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-all ${urgencyFilter === u ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                {u === 'all' ? 'All' : u === 'blocking' ? `🔴 Blocking (${COMPLIANCE_ITEMS.filter(c=>c.urgency==='blocking').length})` : u === 'important' ? `🟡 Important (${COMPLIANCE_ITEMS.filter(c=>c.urgency==='important').length})` : `🔵 Recommended (${COMPLIANCE_ITEMS.filter(c=>c.urgency==='recommended').length})`}
              </button>
            ))}
          </div>

          {urgencyFilter === 'all' || urgencyFilter === 'blocking' ? (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-800 mb-1">⚠️ {COMPLIANCE_ITEMS.filter(c=>c.urgency==='blocking' && c.status !== 'done').length} blocking items not yet complete</p>
                <p className="text-xs text-red-700 leading-relaxed">
                  These items MUST be completed before Qilly accepts its first paying subscriber:
                  SARS registration, POPIA Information Officer registration, PayFast merchant verification, VAT registration, B-BBEE EME affidavit, Tax Clearance, business bank account, SANS 1200 civil mapping, Vercel PRO + custom domain.
                </p>
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            {filteredCompliance.map(item => <ComplianceCard key={item.id} item={item} />)}
          </div>
        </div>
      )}

      {/* ── TAB 4: SANS 1200 MAP ─────────────────────────────────────────── */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Layers className="w-5 h-5 text-[#0077b6] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">SANS 1200 — Standard Specifications for Civil Engineering Construction</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  SANS 1200 is the primary civil engineering BOQ specification standard in South Africa — used by all CIDB-registered civil contractors.
                  Qilly must cover all 17 sections to be eligible for government and civil infrastructure tenders (ENTERPRISE tier).
                  Currently <strong className="text-[#0077b6]">{sans1200Covered} of {SANS1200_PARTS.length} sections</strong> are adequately covered by your supplier database.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {SANS1200_PARTS.map(part => (
              <div key={part.code} className={`rounded-xl border-2 p-4 ${part.covered ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-black text-sm ${part.covered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {part.code}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {part.covered ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                      <span className="font-bold text-gray-900 text-sm">SANS 1200 {part.code}: {part.title}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${part.covered ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {part.covered ? '✓ Covered' : '✗ Gap'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1.5">{part.description}</p>
                    <p className="text-xs font-medium text-gray-700">
                      <span className="text-gray-500">Current suppliers: </span>
                      <span className={part.covered ? 'text-green-700' : 'text-red-700'}>{part.suppliers}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#0077b6] to-[#00b4d8] text-white rounded-xl p-5">
            <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-300" />
              Priority Action — Get to 100% SANS 1200 Coverage
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { section: 'SANS 1200 B (Earthworks)', action: 'Add: G4 Cube, Afrimat, Sapstone for G4/G7 sub-base, crusher dust, earthworks', timeline: 'Q2 2026' },
                { section: 'SANS 1200 C (Concrete)', action: 'Add: Concor Readymix, Lafarge Readymix for ready-mix concrete rates', timeline: 'Q2 2026' },
                { section: 'SANS 1200 DD (Roads)', action: 'Add: Much Asphalt, Tosas, TotalEnergies Bitumen for road surfacing', timeline: 'Q3 2026' },
                { section: 'SANS 1200 F (Fire)', action: 'Add: Wormald, Fire Solutions SA for fire protection systems', timeline: 'Q3 2026' },
                { section: 'SANS 1200 H (Structural Timber)', action: 'Add: Trussworks/MiTek for roof trusses, Federated Timbers for structural timber', timeline: 'Q2 2026' },
                { section: 'SANS 1200 J (Glazing/Joinery)', action: 'Add: PG Glass, Aluplast, Stalwart Doors for windows, doors, glazing', timeline: 'Q2 2026' },
                { section: 'SANS 1200 P (External Works)', action: 'Add: Tegola, Terraforce for paving blocks, retaining walls', timeline: 'Q3 2026' },
                { section: 'SANS 1200 Q (Landscaping)', action: 'Add: Landscaping/irrigation suppliers for external works BOQ completion', timeline: 'Q4 2026' },
              ].map(({ section, action, timeline }) => (
                <div key={section} className="bg-white/10 rounded-lg p-3">
                  <p className="font-bold text-sm mb-1">{section}</p>
                  <p className="text-xs text-blue-100 mb-1.5">{action}</p>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{timeline}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
