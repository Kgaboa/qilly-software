/**
 * Enhanced Item Matching System - Main Export
 * 
 * Qilly's upgraded matching engine with PriceCheck-inspired features:
 * ✅ Fuzzy matching for typo tolerance
 * ✅ Construction synonym dictionary
 * ✅ Brand detection and matching
 * ✅ Learning from user corrections
 * ✅ Confidence scoring
 * ✅ Alternative match suggestions
 */

// Export only the main functions and types needed by other modules
// This prevents circular dependencies

export { 
  enhancedSearchCatalog,
  type MatchResult,
  type SearchResult 
} from './enhancedItemMatcher';

export {
  levenshteinDistance,
  calculateSimilarity,
  isFuzzyMatch,
  findBestFuzzyMatch
} from './levenshteinDistance';

export {
  normalizeWithSynonyms,
  areSynonyms,
  getCanonicalForm,
  getSynonyms,
  type SynonymGroup
} from './synonymDictionary';

export {
  detectBrand,
  getBrandMatchBonus,
  type BrandInfo
} from './brandDetection';

export {
  getLearningStats,
  type MatchCorrection,
  type MatchSuggestion
} from './matchFeedback';