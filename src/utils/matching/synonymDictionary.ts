/**
 * Construction Industry Synonym Dictionary
 * Maps various terms to their canonical forms for better item matching
 * 
 * This helps match items with different terminology:
 * - "concrete kerb" matches "concrete kerbing"
 * - "m²" matches "m2", "sqm", "square meter"
 * - "rebar" matches "steel", "reinforcement"
 */

export interface SynonymGroup {
  canonical: string;  // The primary/preferred term
  synonyms: string[]; // Alternative terms that mean the same thing
  category?: string;  // Optional category for organization
}

export const constructionSynonyms: SynonymGroup[] = [
  // Materials - Cement & Concrete
  {
    canonical: 'cement',
    synonyms: ['cement', 'binder', 'cementitious'],
    category: 'Materials'
  },
  {
    canonical: 'ppc',
    synonyms: ['ppc', 'portland pozz cement', 'portland pozzolan cement'],
    category: 'Materials'
  },
  {
    canonical: 'concrete',
    synonyms: ['concrete', 'readymix', 'ready-mix', 'ready mix', 'premix', 'pre-mix'],
    category: 'Materials'
  },
  
  // Materials - Kerbing/Curbs
  {
    canonical: 'kerb',
    synonyms: ['kerb', 'kerbing', 'curb', 'curbing', 'kerbstone', 'curbstone'],
    category: 'Materials'
  },
  {
    canonical: 'mountable',
    synonyms: ['mountable', 'rollover', 'roll-over'],
    category: 'Materials'
  },
  {
    canonical: 'barrier',
    synonyms: ['barrier', 'non-mountable', 'safety'],
    category: 'Materials'
  },
  
  // Materials - Steel & Reinforcement
  {
    canonical: 'steel',
    synonyms: ['steel', 'rebar', 'reinforcement', 'reinforcing', 'reo'],
    category: 'Materials'
  },
  {
    canonical: 'reinforcement',
    synonyms: ['reinforcement', 'reinforcing', 'rebar', 'steel bars', 'reo'],
    category: 'Materials'
  },
  
  // Materials - Aggregates
  {
    canonical: 'sand',
    synonyms: ['sand', 'fine aggregate'],
    category: 'Materials'
  },
  {
    canonical: 'stone',
    synonyms: ['stone', 'crusher', 'aggregate', 'gravel', 'crushed stone'],
    category: 'Materials'
  },
  
  // Materials - Pipes
  {
    canonical: 'pipe',
    synonyms: ['pipe', 'piping', 'conduit'],
    category: 'Materials'
  },
  {
    canonical: 'drainage',
    synonyms: ['drainage', 'drain', 'stormwater', 'storm water', 'sewer'],
    category: 'Systems'
  },
  
  // Units - Area
  {
    canonical: 'm²',
    synonyms: ['m²', 'm2', 'sqm', 'sq m', 'square meter', 'square metre', 'square meters', 'square metres'],
    category: 'Units'
  },
  
  // Units - Volume
  {
    canonical: 'm³',
    synonyms: ['m³', 'm3', 'cum', 'cu m', 'cubic meter', 'cubic metre', 'cubic meters', 'cubic metres'],
    category: 'Units'
  },
  
  // Units - Length
  {
    canonical: 'm',
    synonyms: ['m', 'meter', 'metre', 'meters', 'metres'],
    category: 'Units'
  },
  
  // Units - Weight
  {
    canonical: 'kg',
    synonyms: ['kg', 'kilogram', 'kilograms', 'kilo'],
    category: 'Units'
  },
  {
    canonical: 'ton',
    synonyms: ['ton', 'tons', 'tonne', 'tonnes', 't', 'metric ton'],
    category: 'Units'
  },
  
  // Units - Count
  {
    canonical: 'bag',
    synonyms: ['bag', 'bags', 'sack', 'sacks', 'pk', 'packet', 'pkt'],
    category: 'Units'
  },
  {
    canonical: 'unit',
    synonyms: ['unit', 'units', 'ea', 'each', 'no', 'number', 'nr', 'item'],
    category: 'Units'
  },
  
  // Standards - SABS/SANS
  {
    canonical: 'sabs',
    synonyms: ['sabs', 'sans', 'south african bureau of standards', 'south african national standard'],
    category: 'Standards'
  },
  {
    canonical: 'figure',
    synonyms: ['figure', 'fig', 'fg', 'f'],
    category: 'Standards'
  },
  
  // Construction Activities
  {
    canonical: 'excavation',
    synonyms: ['excavation', 'excavate', 'excav', 'excv', 'dig', 'digging', 'earthworks'],
    category: 'Activities'
  },
  {
    canonical: 'formwork',
    synonyms: ['formwork', 'shuttering', 'forms', 'falsework'],
    category: 'Activities'
  },
  {
    canonical: 'backfill',
    synonyms: ['backfill', 'backfilling', 'fill', 'filling', 'infill'],
    category: 'Activities'
  },
  {
    canonical: 'compaction',
    synonyms: ['compaction', 'compacting', 'compact', 'consolidation'],
    category: 'Activities'
  },
  {
    canonical: 'demolition',
    synonyms: ['demolition', 'demolish', 'break up', 'breaking', 'removal', 'remove'],
    category: 'Activities'
  },
  
  // Equipment & Plant
  {
    canonical: 'tipper',
    synonyms: ['tipper', 'tippers', 'dump truck', 'dumper', 'tipper truck'],
    category: 'Equipment'
  },
  {
    canonical: 'pump',
    synonyms: ['pump', 'pumps', 'pumping', 'water pump', 'dewatering pump'],
    category: 'Equipment'
  },
  {
    canonical: 'tlb',
    synonyms: ['tlb', 'backhoe', 'loader', 'excavator', 'digger'],
    category: 'Equipment'
  },
  
  // Project Management
  {
    canonical: 'daywork',
    synonyms: ['daywork', 'day work', 'daily rate'],
    category: 'Labour'
  },
  {
    canonical: 'labourer',
    synonyms: ['labourer', 'laborer', 'worker', 'labour', 'labor'],
    category: 'Labour'
  },
  
  // Financial Terms
  {
    canonical: 'lump sum',
    synonyms: ['lump sum', 'lumpsum', 'ls', 'sum'],
    category: 'Financial'
  },
  {
    canonical: 'provisional sum',
    synonyms: ['provisional sum', 'prov sum', 'ps', 'provisional'],
    category: 'Financial'
  },
  {
    canonical: 'prime cost',
    synonyms: ['prime cost', 'pc', 'pc sum', 'prime cost sum'],
    category: 'Financial'
  },
];

/**
 * Create a fast lookup map from any synonym to its canonical form
 */
export function createSynonymLookup(): Map<string, string> {
  const lookup = new Map<string, string>();
  
  for (const group of constructionSynonyms) {
    for (const synonym of group.synonyms) {
      lookup.set(synonym.toLowerCase(), group.canonical);
    }
  }
  
  return lookup;
}

// Pre-build the lookup map for fast access
const synonymLookup = createSynonymLookup();

/**
 * Get the canonical form of a term if it has synonyms
 * @param term The term to look up
 * @returns The canonical form, or the original term if no synonym found
 */
export function getCanonicalForm(term: string): string {
  return synonymLookup.get(term.toLowerCase()) || term;
}

/**
 * Normalize text by replacing all synonyms with their canonical forms
 * This helps match "concrete kerbing" with "concrete kerb"
 */
export function normalizeWithSynonyms(text: string): string {
  const words = text.toLowerCase().split(/\s+/);
  const normalized = words.map(word => getCanonicalForm(word));
  return normalized.join(' ');
}

/**
 * Generate all possible synonym variants of a text
 * Used to check if any variant matches
 */
export function generateSynonymVariants(text: string): string[] {
  const variants = new Set<string>();
  
  // Add original
  variants.add(text.toLowerCase());
  
  // Add fully normalized version
  variants.add(normalizeWithSynonyms(text));
  
  // Add variants where individual words are replaced with synonyms
  const words = text.toLowerCase().split(/\s+/);
  
  for (let i = 0; i < words.length; i++) {
    const canonical = getCanonicalForm(words[i]);
    if (canonical !== words[i]) {
      const variant = [...words];
      variant[i] = canonical;
      variants.add(variant.join(' '));
    }
  }
  
  return Array.from(variants);
}

/**
 * Check if two texts are synonyms of each other
 */
export function areSynonyms(text1: string, text2: string): boolean {
  const normalized1 = normalizeWithSynonyms(text1);
  const normalized2 = normalizeWithSynonyms(text2);
  return normalized1 === normalized2;
}

/**
 * Get all synonyms for a given term
 */
export function getSynonyms(term: string): string[] {
  const canonical = getCanonicalForm(term);
  
  const group = constructionSynonyms.find(g => g.canonical === canonical);
  return group ? group.synonyms : [term];
}
