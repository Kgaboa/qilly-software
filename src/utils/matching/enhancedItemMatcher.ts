/**
 * Enhanced Item Matching System
 * Integrates fuzzy matching, synonyms, brand detection, and learning
 * 
 * This is Qilly's upgraded 5-level matching engine with PriceCheck-inspired features:
 * - Level 1: Exact Match (with fuzzy tolerance)
 * - Level 2: Scored Match (with synonyms + brands)
 * - Level 3: Substring Match
 * - Level 4: Description Fallback
 * - Level 5: Word-by-Word Match
 * 
 * Plus:
 * - Fuzzy matching for typo tolerance
 * - Synonym normalization
 * - Brand detection and matching
 * - Learning from corrections
 * - Confidence scoring
 * - Alternative match suggestions
 */

import { isFuzzyMatch, calculateSimilarity } from './levenshteinDistance';
import { normalizeWithSynonyms, areSynonyms } from './synonymDictionary';
import { detectBrand, getBrandMatchBonus } from './brandDetection';
import { getSuggestedMatch, getLearnedKeywordWeights } from './matchFeedback';
import type { SupplierPrice } from '../supplierCatalog';

export interface MatchResult {
  item: SupplierPrice;
  score: number;
  matchLevel: string;
  matchType: 'exact' | 'fuzzy' | 'synonym' | 'keyword' | 'substring' | 'partial';
  confidence: 'VERY HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'VERY LOW';
  reason: string;
  fuzzyDistance?: number;
  brandMatch?: boolean | null;
}

export interface SearchResult {
  query: string;
  topMatch: MatchResult | null;
  alternativeMatches: MatchResult[];
  totalMatches: number;
  searchLevel: number;
  suggestion?: string; // Learned suggestion from feedback
}

/**
 * Normalize text for better matching
 */
function normalizeItemName(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Remove unit suffixes
    .replace(/\s*-\s*(m|m2|m3|m²|m³|kg|ton|unit|bag|ea|each|nr|no|sum|pc\s+sum|provisional\s+sum|month)\s*$/i, '')
    .replace(/\s*\((m|m2|m3|m²|m³|kg|ton|unit|bag|ea|each|nr|no)\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate confidence level from score
 */
function getConfidenceLevel(score: number): 'VERY HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'VERY LOW' {
  if (score >= 90) return 'VERY HIGH';
  if (score >= 75) return 'HIGH';
  if (score >= 60) return 'MEDIUM';
  if (score >= 40) return 'LOW';
  return 'VERY LOW';
}

/**
 * LEVEL 1: Exact Match with Fuzzy Tolerance
 * Matches exact strings or very close fuzzy matches (≤2 char difference)
 */
function tryExactMatch(searchText: string, catalogItems: SupplierPrice[]): MatchResult | null {
  const searchLower = searchText.toLowerCase().trim();
  const searchNormalized = normalizeItemName(searchText);
  const searchSynonym = normalizeWithSynonyms(searchText);
  
  for (const item of catalogItems) {
    const itemLower = item.itemName.toLowerCase().trim();
    const itemNormalized = normalizeItemName(item.itemName);
    const itemSynonym = normalizeWithSynonyms(item.itemName);
    
    // Perfect exact match
    if (itemLower === searchLower || itemNormalized === searchNormalized) {
      return {
        item,
        score: 100,
        matchLevel: 'Level 1 - Exact Match',
        matchType: 'exact',
        confidence: 'VERY HIGH',
        reason: 'Perfect string match'
      };
    }
    
    // Synonym match (e.g., "kerb" = "kerbing")
    if (areSynonyms(searchText, item.itemName) || searchSynonym === itemSynonym) {
      return {
        item,
        score: 100,
        matchLevel: 'Level 1 - Exact Match (Synonym)',
        matchType: 'synonym',
        confidence: 'VERY HIGH',
        reason: 'Match via construction synonyms (e.g., kerb=kerbing)'
      };
    }
    
    // Fuzzy match (typo tolerance: max 2 character difference, 85% similarity)
    if (isFuzzyMatch(searchLower, itemLower, 85, 2)) {
      const similarity = calculateSimilarity(searchLower, itemLower);
      return {
        item,
        score: Math.round(similarity),
        matchLevel: 'Level 1 - Fuzzy Match',
        matchType: 'fuzzy',
        confidence: similarity >= 90 ? 'VERY HIGH' : 'HIGH',
        reason: `Fuzzy match - likely typo corrected (${Math.round(similarity)}% similar)`,
        fuzzyDistance: 2
      };
    }
  }
  
  return null;
}

/**
 * LEVEL 2: Scored Matching with Brand Detection
 * Advanced scoring with normalization, keywords, and brand matching
 */
function tryScoredMatch(searchText: string, catalogItems: SupplierPrice[]): MatchResult[] {
  const results: MatchResult[] = [];
  const searchLower = searchText.toLowerCase();
  const searchNormalized = normalizeItemName(searchText);
  const searchBrand = detectBrand(searchText);
  const keywordWeights = getLearnedKeywordWeights();
  
  for (const item of catalogItems) {
    const itemLower = item.itemName.toLowerCase();
    const itemNormalized = normalizeItemName(item.itemName);
    let score = 0;
    let reason = '';
    
    // Normalized containment checks
    if (itemNormalized === searchNormalized) {
      score = 100;
      reason = 'Exact match after normalization';
    } else if (itemNormalized.includes(searchNormalized)) {
      score = 95;
      reason = 'Full search term found in item name';
    } else if (searchNormalized.includes(itemNormalized)) {
      score = 90;
      reason = 'Item name found in search term';
    } else if (itemLower.includes(searchLower)) {
      score = 90;
      reason = 'Substring match in item name';
    } else if (searchLower.includes(itemLower)) {
      score = 85;
      reason = 'Item name contained in search';
    } else {
      // Keyword matching with learned weights
      const searchWords = searchText.split(/[\s,\-()]+/).filter(w => w.length > 2);
      let exactKeywordMatches = 0;
      let partialKeywordMatches = 0;
      
      for (const word of searchWords) {
        const wordLower = word.toLowerCase();
        const weight = keywordWeights.get(wordLower) || 1.0;
        
        for (const keyword of item.keywords) {
          const keywordLower = keyword.toLowerCase();
          
          if (keywordLower === wordLower) {
            exactKeywordMatches += weight;
            break;
          } else if (keywordLower.includes(wordLower) || wordLower.includes(keywordLower)) {
            partialKeywordMatches += (weight * 0.5);
            break;
          }
        }
      }
      
      if (exactKeywordMatches > 0 && searchWords.length > 0) {
        const matchRatio = exactKeywordMatches / searchWords.length;
        score = 60 + (matchRatio * 30);
        reason = `${Math.round(exactKeywordMatches)}/${searchWords.length} exact keyword matches`;
      } else if (partialKeywordMatches > 0 && searchWords.length > 0) {
        const matchRatio = partialKeywordMatches / searchWords.length;
        score = 50 + (matchRatio * 40);
        reason = `${Math.round(partialKeywordMatches)}/${searchWords.length} partial keyword matches`;
      }
    }
    
    // Apply brand matching bonus/penalty
    if (score > 0) {
      const brandBonus = getBrandMatchBonus(searchText, item.itemName);
      const brandMatch = searchBrand && detectBrand(item.itemName);
      
      score += brandBonus;
      
      if (brandBonus > 0) {
        reason += ` + brand match (${searchBrand?.name})`;
      } else if (brandBonus < 0) {
        reason += ` - brand mismatch`;
      }
    }
    
    // Only include if above threshold
    if (score >= 55) {
      results.push({
        item,
        score: Math.min(100, Math.round(score)),
        matchLevel: 'Level 2 - Scored Match',
        matchType: 'keyword',
        confidence: getConfidenceLevel(score),
        reason,
        brandMatch: searchBrand && detectBrand(item.itemName) ? true : null
      });
    }
  }
  
  return results.sort((a, b) => b.score - a.score);
}

/**
 * LEVEL 3: Substring Search
 * Flexible matching across name, category, keywords, description
 */
function trySubstringMatch(searchText: string, catalogItems: SupplierPrice[]): MatchResult[] {
  const results: MatchResult[] = [];
  const searchLower = searchText.toLowerCase();
  
  for (const item of catalogItems) {
    const itemNameLower = item.itemName.toLowerCase();
    const categoryLower = item.category.toLowerCase();
    const descriptionLower = item.description.toLowerCase();
    
    let score = 30; // Base score
    const reasons: string[] = [];
    
    // Check various fields
    const nameMatch = itemNameLower.includes(searchLower) || searchLower.includes(itemNameLower);
    const categoryMatch = categoryLower.includes(searchLower);
    const descriptionMatch = descriptionLower.includes(searchLower);
    const keywordMatch = item.keywords.some(keyword => {
      const keywordLower = keyword.toLowerCase();
      return keywordLower.includes(searchLower) || searchLower.includes(keywordLower);
    });
    
    if (nameMatch) {
      score += 20;
      reasons.push('name match');
    }
    if (categoryMatch) {
      score += 10;
      reasons.push('category match');
    }
    if (keywordMatch) {
      score += 15;
      reasons.push('keyword match');
    }
    if (descriptionMatch) {
      score += 5;
      reasons.push('description match');
    }
    
    if (score > 30) {
      results.push({
        item,
        score,
        matchLevel: 'Level 3 - Substring Match',
        matchType: 'substring',
        confidence: getConfidenceLevel(score),
        reason: `Partial match: ${reasons.join(', ')}`
      });
    }
  }
  
  return results.sort((a, b) => b.score - a.score);
}

/**
 * LEVEL 4: Description Column Fallback
 * Use separate description field if available
 */
function tryDescriptionMatch(description: string, catalogItems: SupplierPrice[]): MatchResult[] {
  const results: MatchResult[] = [];
  const descLower = description.toLowerCase().trim();
  
  for (const item of catalogItems) {
    const itemNameLower = item.itemName.toLowerCase();
    const itemDescLower = item.description.toLowerCase();
    
    let score = 25; // Base score for description match
    const reasons: string[] = [];
    
    const nameMatch = itemNameLower.includes(descLower) || descLower.includes(itemNameLower);
    const descMatch = itemDescLower.includes(descLower);
    const keywordMatch = item.keywords.some(keyword =>
      keyword.toLowerCase().includes(descLower) || descLower.includes(keyword.toLowerCase())
    );
    
    if (nameMatch) {
      score += 15;
      reasons.push('name match from description');
    }
    if (descMatch) {
      score += 10;
      reasons.push('description match');
    }
    if (keywordMatch) {
      score += 10;
      reasons.push('keyword match');
    }
    
    if (score > 25) {
      results.push({
        item,
        score,
        matchLevel: 'Level 4 - Description Fallback',
        matchType: 'substring',
        confidence: getConfidenceLevel(score),
        reason: `Match using description field: ${reasons.join(', ')}`
      });
    }
  }
  
  return results.sort((a, b) => b.score - a.score);
}

/**
 * LEVEL 5: Word-by-Word Matching
 * Match at least 50% of significant words
 */
function tryWordMatch(searchText: string, catalogItems: SupplierPrice[]): MatchResult[] {
  const results: MatchResult[] = [];
  const searchWords = searchText.toLowerCase().split(/[\s,\-()]+/).filter(w => w.length > 3);
  
  if (searchWords.length === 0) return results;
  
  for (const item of catalogItems) {
    const itemText = `${item.itemName} ${item.description} ${item.keywords.join(' ')}`.toLowerCase();
    
    let matchCount = 0;
    const matchedWords: string[] = [];
    
    for (const word of searchWords) {
      if (itemText.includes(word)) {
        matchCount++;
        matchedWords.push(word);
      }
    }
    
    const matchRatio = matchCount / searchWords.length;
    
    // Need at least 50% word match
    if (matchRatio >= 0.5) {
      const score = 15 + (matchRatio * 20);
      
      results.push({
        item,
        score,
        matchLevel: 'Level 5 - Word-by-Word Match',
        matchType: 'partial',
        confidence: getConfidenceLevel(score),
        reason: `${matchCount}/${searchWords.length} words matched: ${matchedWords.join(', ')}`
      });
    }
  }
  
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Main Enhanced Search Function
 * Searches through all 5 levels with learning integration
 */
export function enhancedSearchCatalog(
  searchQuery: string,
  catalogItems: SupplierPrice[],
  description?: string
): SearchResult {
  console.log(`\n🔍 ENHANCED SEARCH: "${searchQuery}"`);
  
  // Check for learned suggestions first
  const suggestion = getSuggestedMatch(searchQuery);
  if (suggestion) {
    console.log(`💡 Learning suggestion: "${suggestion.suggestedMatch}" (${suggestion.confidence}% - ${suggestion.reason})`);
  }
  
  let allMatches: MatchResult[] = [];
  let searchLevel = 0;
  
  // LEVEL 1: Exact Match (with fuzzy tolerance)
  console.log('  📍 Level 1: Trying exact/fuzzy match...');
  const exactMatch = tryExactMatch(searchQuery, catalogItems);
  if (exactMatch) {
    console.log(`  ✅ Level 1 SUCCESS: "${exactMatch.item.itemName}" (score: ${exactMatch.score})`);
    allMatches = [exactMatch];
    searchLevel = 1;
  }
  
  // LEVEL 2: Scored Matching (with brands + learning)
  if (allMatches.length === 0) {
    console.log('  📍 Level 2: Trying scored match with brands...');
    const scoredMatches = tryScoredMatch(searchQuery, catalogItems);
    if (scoredMatches.length > 0) {
      console.log(`  ✅ Level 2 SUCCESS: Found ${scoredMatches.length} matches (top: ${scoredMatches[0].score})`);
      allMatches = scoredMatches;
      searchLevel = 2;
    }
  }
  
  // LEVEL 3: Substring Search
  if (allMatches.length === 0) {
    console.log('  📍 Level 3: Trying substring search...');
    const substringMatches = trySubstringMatch(searchQuery, catalogItems);
    if (substringMatches.length > 0) {
      console.log(`  ✅ Level 3 SUCCESS: Found ${substringMatches.length} matches`);
      allMatches = substringMatches;
      searchLevel = 3;
    }
  }
  
  // LEVEL 4: Description Fallback
  if (allMatches.length === 0 && description) {
    console.log('  📍 Level 4: Trying description fallback...');
    const descriptionMatches = tryDescriptionMatch(description, catalogItems);
    if (descriptionMatches.length > 0) {
      console.log(`  ✅ Level 4 SUCCESS: Found ${descriptionMatches.length} matches using description`);
      allMatches = descriptionMatches;
      searchLevel = 4;
    }
  }
  
  // LEVEL 5: Word-by-Word
  if (allMatches.length === 0) {
    console.log('  📍 Level 5: Trying word-by-word match...');
    const wordMatches = tryWordMatch(searchQuery, catalogItems);
    if (wordMatches.length > 0) {
      console.log(`  ✅ Level 5 SUCCESS: Found ${wordMatches.length} partial matches`);
      allMatches = wordMatches;
      searchLevel = 5;
    }
  }
  
  // Prepare results
  const topMatch = allMatches.length > 0 ? allMatches[0] : null;
  const alternativeMatches = allMatches.slice(1, 6); // Top 5 alternatives
  
  if (topMatch) {
    console.log(`\n🏆 TOP MATCH: "${topMatch.item.itemName}" from ${topMatch.item.supplier}`);
    console.log(`   Score: ${topMatch.score} | Confidence: ${topMatch.confidence} | ${topMatch.reason}`);
  } else {
    console.log(`\n❌ NO MATCHES FOUND after all 5 levels`);
  }
  
  return {
    query: searchQuery,
    topMatch,
    alternativeMatches,
    totalMatches: allMatches.length,
    searchLevel,
    suggestion: suggestion?.suggestedMatch
  };
}
