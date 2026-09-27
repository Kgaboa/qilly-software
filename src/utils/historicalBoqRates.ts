import { supabase } from '@/utils/supabase';
import { arePricingUnitsCompatible, normalizePricingUnit } from './pricingStrategyV2';

export interface HistoricalBoqRate {
  id: number;
  description: string;
  unit: string;
  rate: number;
  province_code: string;
  supplier: string;
  quote_date: string;
  category: string;
  source_reference: string;
  page_reference: string;
  status: 'reviewed' | 'pending' | 'rejected';
}

export interface HistoricalRateMatch {
  rate: number;
  score: number;
  confidence: 'HIGH' | 'MEDIUM';
  reviewed: boolean;
  requiresReview: boolean;
  source: string;
  supplier: string;
  matchedDescription: string;
  sampleCount: number;
  minRate: number;
  maxRate: number;
}

const CACHE_MS = 10 * 60 * 1000;
let cache: HistoricalBoqRate[] | null = null;
let cachedAt = 0;

const normalize = (value: string) => String(value || '')
  .toLowerCase()
  .replace(/\bu\s*[- ]?pvc\b/g, 'upvc')
  .replace(/\b(\d{2,3})\s*mm\b/g, '$1mm')
  .replace(/\bnumber\b|\bnr\b|\bno\.?\b/g, 'no')
  .replace(/[^a-z0-9.%x]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const tokens = (value: string) => new Set(normalize(value).split(' ').filter(token => token.length > 1));
const first = (value: string, expression: RegExp) => normalize(value).match(expression)?.[1];

function extractSpecs(value: string) {
  return {
    diameters: [...normalize(value).matchAll(/\b(\d{2,4})(?:mm|\s*nd|\s*(?:dia|diameter))\b/g)].map(match => match[1]),
    pressureClass: first(value, /\bclass\s*(\d+)\b/),
    angle: first(value, /\b(90|45|22\.5|11\.25)\s*(?:deg|degree|degrees|°)?\b/),
  };
}

export function scoreHistoricalDescription(input: string, candidate: string): number {
  const inputSpecs = extractSpecs(input);
  const candidateSpecs = extractSpecs(candidate);
  if (candidateSpecs.pressureClass && inputSpecs.pressureClass !== candidateSpecs.pressureClass) return 0;
  if (candidateSpecs.angle && inputSpecs.angle !== candidateSpecs.angle) return 0;
  if (candidateSpecs.diameters.length && candidateSpecs.diameters.some((diameter, index) => inputSpecs.diameters[index] !== diameter)) return 0;

  const inputTokens = tokens(input);
  const candidateTokens = tokens(candidate);
  const anchors = ['excavation','backfill','compaction','concrete','formwork','reinforcement','brickwork','plaster','paint','roof','door','window','pipe','bend','tee','reducer','cap','valve','coupling','connection','standpipe','marker','cable','conductor','switchgear','transformer','kerb','asphalt','bitumen','paving','drain','manhole','guardrail','geotextile','gabion','fence','sign'];
  const sharedAnchor = anchors.some(word => inputTokens.has(word) && candidateTokens.has(word));
  if (!sharedAnchor) return 0;
  const matched = [...candidateTokens].filter(token => inputTokens.has(token)).length;
  const coverage = candidateTokens.size ? matched / candidateTokens.size : 0;
  const critical = ['pipe', 'bend', 'tee', 'reducer', 'cap', 'valve', 'coupling', 'connection', 'standpipe', 'marker', 'cable', 'conductor', 'switchgear', 'transformer', 'excavation', 'concrete', 'asphalt', 'kerb', 'drain', 'manhole'];
  const candidateType = critical.find(word => candidateTokens.has(word));
  if (candidateType && !inputTokens.has(candidateType)) return 0;
  return Math.round(coverage * 70 + (inputSpecs.diameters.length ? 15 : 0) + (inputSpecs.pressureClass ? 10 : 0) + (inputSpecs.angle ? 5 : 0));
}

async function loadRates(): Promise<HistoricalBoqRate[]> {
  if (cache && Date.now() - cachedAt < CACHE_MS) return cache;
  const { data, error } = await supabase
    .from('historical_boq_rates')
    .select('id,description,unit,rate,category,province_code,supplier,quote_date,source_reference,page_reference,status')
    .eq('status', 'reviewed');
  if (error) {
    console.warn('Historical BOQ rates unavailable:', error.message);
    return [];
  }
  cache = (data || []).map(row => ({ ...row, rate: Number(row.rate) })) as HistoricalBoqRate[];
  cachedAt = Date.now();
  return cache;
}

export async function matchHistoricalBoqRate(
  description: string,
  unit: string,
  provinceCode: string,
): Promise<HistoricalRateMatch | null> {
  const rates = await loadRates();
  const candidates = rates
    .filter(rate => arePricingUnitsCompatible(unit, rate.unit))
    .map(rate => ({ rate, score: scoreHistoricalDescription(description, rate.description) }))
    .filter(result => result.score >= 85)
    .sort((a, b) => b.score - a.score);
  if (!candidates.length) return null;

  const bestScore = candidates[0].score;
  const equivalent = candidates.filter(candidate => candidate.score === bestScore);
  const values = equivalent.map(candidate => candidate.rate.rate).sort((a, b) => a - b);
  const midpoint = Math.floor(values.length / 2);
  const median = values.length % 2 ? values[midpoint] : (values[midpoint - 1] + values[midpoint]) / 2;
  const best = equivalent[0].rate;
  const sameProvince = best.province_code === provinceCode;
  const sourceDate = best.quote_date ? new Date(best.quote_date) : null;
  const ageMonths = sourceDate && !Number.isNaN(sourceDate.getTime())
    ? (Date.now() - sourceDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    : Number.POSITIVE_INFINITY;
  const currentEnough = ageMonths <= 18;

  return {
    rate: median,
    score: bestScore,
    confidence: bestScore >= 92 && sameProvince && currentEnough ? 'HIGH' : 'MEDIUM',
    reviewed: sameProvince && currentEnough,
    requiresReview: !sameProvince || !currentEnough,
    source: `${best.source_reference}, ${best.page_reference}${best.quote_date ? `; dated ${best.quote_date}` : '; source date not recorded'}`,
    supplier: best.supplier,
    matchedDescription: best.description,
    sampleCount: values.length,
    minRate: values[0],
    maxRate: values[values.length - 1],
  };
}

export const historicalRateUnitLabel = normalizePricingUnit;
