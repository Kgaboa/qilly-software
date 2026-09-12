/**
 * Levenshtein Distance Algorithm
 * Calculates the minimum number of single-character edits (insertions, deletions, substitutions)
 * needed to change one string into another.
 * 
 * Used for fuzzy matching to handle typos and spelling variations.
 */

export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  
  // Create a 2D array for dynamic programming
  const dp: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));
  
  // Initialize first column (deletions)
  for (let i = 0; i <= len1; i++) {
    dp[i][0] = i;
  }
  
  // Initialize first row (insertions)
  for (let j = 0; j <= len2; j++) {
    dp[0][j] = j;
  }
  
  // Fill the dp table
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        // Characters match, no operation needed
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        // Take minimum of: insert, delete, substitute
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }
  
  return dp[len1][len2];
}

/**
 * Calculate similarity percentage between two strings (0-100)
 * Based on Levenshtein distance
 */
export function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  
  if (maxLength === 0) return 100;
  
  const similarity = (1 - distance / maxLength) * 100;
  return Math.max(0, Math.min(100, similarity));
}

/**
 * Check if two strings are similar enough to be considered a fuzzy match
 * @param str1 First string
 * @param str2 Second string
 * @param threshold Minimum similarity percentage (default: 85)
 * @param maxDistance Maximum allowed character differences (default: 2)
 * @returns True if strings are similar enough
 */
export function isFuzzyMatch(
  str1: string, 
  str2: string, 
  threshold: number = 85,
  maxDistance: number = 2
): boolean {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const similarity = calculateSimilarity(str1, str2);
  
  return distance <= maxDistance && similarity >= threshold;
}

/**
 * Find the best fuzzy match from a list of candidates
 * @returns Object with best match and similarity score, or null if no good match
 */
export function findBestFuzzyMatch(
  search: string,
  candidates: string[],
  threshold: number = 85
): { match: string; similarity: number; distance: number } | null {
  let bestMatch: string | null = null;
  let bestSimilarity = 0;
  let bestDistance = Infinity;
  
  for (const candidate of candidates) {
    const distance = levenshteinDistance(search.toLowerCase(), candidate.toLowerCase());
    const similarity = calculateSimilarity(search, candidate);
    
    if (similarity >= threshold && similarity > bestSimilarity) {
      bestMatch = candidate;
      bestSimilarity = similarity;
      bestDistance = distance;
    }
  }
  
  if (bestMatch) {
    return { match: bestMatch, similarity: bestSimilarity, distance: bestDistance };
  }
  
  return null;
}
