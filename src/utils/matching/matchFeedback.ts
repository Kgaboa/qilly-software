/**
 * Match Feedback and Learning System
 * Stores user corrections to improve future matching accuracy
 * 
 * When a QS manually corrects a match, we learn from it:
 * - Store the correction for future reference
 * - Update keyword weights
 * - Build custom synonym mappings
 * - Improve scoring algorithm over time
 */

export interface MatchCorrection {
  id: string;
  boqItem: string;              // Original BOQ item description
  wrongMatch: string | null;    // What the system incorrectly matched (null if no match)
  correctMatch: string;         // What the QS selected as correct
  wrongScore?: number;          // Score of the wrong match
  correctScore?: number;        // Score the correct match should have had
  timestamp: Date;
  userId?: string;
  projectId?: string;
  category?: string;
}

export interface MatchSuggestion {
  boqItem: string;
  suggestedMatch: string;
  confidence: number;
  reason: string;  // Why this suggestion was made
}

// In-memory storage (in production, this would be a database)
class MatchFeedbackStore {
  private corrections: MatchCorrection[] = [];
  private suggestionCache: Map<string, MatchSuggestion> = new Map();
  
  /**
   * Record a match correction
   */
  addCorrection(correction: Omit<MatchCorrection, 'id' | 'timestamp'>): void {
    const newCorrection: MatchCorrection = {
      ...correction,
      id: this.generateId(),
      timestamp: new Date()
    };
    
    this.corrections.push(newCorrection);
    
    // Update suggestion cache
    this.updateSuggestionCache(newCorrection);
    
    console.log(`📝 Recorded correction: "${correction.boqItem}" → "${correction.correctMatch}"`);
  }
  
  /**
   * Get all corrections for a specific BOQ item
   */
  getCorrectionsForItem(boqItem: string): MatchCorrection[] {
    const normalized = boqItem.toLowerCase().trim();
    return this.corrections.filter(c => 
      c.boqItem.toLowerCase().trim() === normalized
    );
  }
  
  /**
   * Get a suggested match based on historical corrections
   */
  getSuggestion(boqItem: string): MatchSuggestion | null {
    const normalized = boqItem.toLowerCase().trim();
    
    // Check cache first
    if (this.suggestionCache.has(normalized)) {
      return this.suggestionCache.get(normalized) || null;
    }
    
    // Check for exact match in corrections
    const exactCorrection = this.corrections.find(c => 
      c.boqItem.toLowerCase().trim() === normalized
    );
    
    if (exactCorrection) {
      return {
        boqItem,
        suggestedMatch: exactCorrection.correctMatch,
        confidence: 95,
        reason: 'Previously corrected by user'
      };
    }
    
    // Check for similar items (fuzzy match)
    const similarCorrections = this.findSimilarCorrections(boqItem);
    if (similarCorrections.length > 0) {
      // If multiple similar items all corrected to same match, high confidence
      const matchCounts = new Map<string, number>();
      for (const correction of similarCorrections) {
        const count = matchCounts.get(correction.correctMatch) || 0;
        matchCounts.set(correction.correctMatch, count + 1);
      }
      
      const mostCommon = Array.from(matchCounts.entries())
        .sort((a, b) => b[1] - a[1])[0];
      
      if (mostCommon && mostCommon[1] > 1) {
        return {
          boqItem,
          suggestedMatch: mostCommon[0],
          confidence: 70 + (mostCommon[1] * 5),
          reason: `${mostCommon[1]} similar items matched to this`
        };
      }
    }
    
    return null;
  }
  
  /**
   * Get frequently corrected wrong matches
   * This helps identify systematic matching issues
   */
  getFrequentWrongMatches(): Array<{ wrong: string; correct: string; count: number }> {
    const pairs = new Map<string, { correct: string; count: number }>();
    
    for (const correction of this.corrections) {
      if (correction.wrongMatch) {
        const key = `${correction.wrongMatch}→${correction.correctMatch}`;
        const existing = pairs.get(key);
        if (existing) {
          existing.count++;
        } else {
          pairs.set(key, { correct: correction.correctMatch, count: 1 });
        }
      }
    }
    
    return Array.from(pairs.entries())
      .map(([wrong, data]) => ({
        wrong: wrong.split('→')[0],
        correct: data.correct,
        count: data.count
      }))
      .sort((a, b) => b.count - a.count);
  }
  
  /**
   * Calculate keyword importance weights based on corrections
   */
  getKeywordWeights(): Map<string, number> {
    const weights = new Map<string, number>();
    
    for (const correction of this.corrections) {
      // Extract keywords from correct match
      const keywords = this.extractKeywords(correction.correctMatch);
      
      for (const keyword of keywords) {
        const current = weights.get(keyword) || 1.0;
        weights.set(keyword, current + 0.05); // Increase weight by 5%
      }
    }
    
    return weights;
  }
  
  /**
   * Get statistics about corrections
   */
  getStats(): {
    totalCorrections: number;
    uniqueItems: number;
    avgConfidenceImprovement: number;
  } {
    const uniqueItems = new Set(this.corrections.map(c => c.boqItem)).size;
    
    const confidenceImprovements = this.corrections
      .filter(c => c.wrongScore !== undefined && c.correctScore !== undefined)
      .map(c => (c.correctScore || 0) - (c.wrongScore || 0));
    
    const avgImprovement = confidenceImprovements.length > 0
      ? confidenceImprovements.reduce((a, b) => a + b, 0) / confidenceImprovements.length
      : 0;
    
    return {
      totalCorrections: this.corrections.length,
      uniqueItems,
      avgConfidenceImprovement: avgImprovement
    };
  }
  
  /**
   * Clear all corrections (for testing or reset)
   */
  clear(): void {
    this.corrections = [];
    this.suggestionCache.clear();
  }
  
  /**
   * Export corrections for backup or analysis
   */
  export(): MatchCorrection[] {
    return [...this.corrections];
  }
  
  /**
   * Import corrections from backup
   */
  import(corrections: MatchCorrection[]): void {
    this.corrections = [...corrections];
    this.rebuildCache();
  }
  
  // Private helper methods
  
  private generateId(): string {
    return `correction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private updateSuggestionCache(correction: MatchCorrection): void {
    const normalized = correction.boqItem.toLowerCase().trim();
    this.suggestionCache.set(normalized, {
      boqItem: correction.boqItem,
      suggestedMatch: correction.correctMatch,
      confidence: 95,
      reason: 'Previously corrected by user'
    });
  }
  
  private findSimilarCorrections(boqItem: string): MatchCorrection[] {
    const normalized = boqItem.toLowerCase().trim();
    const words = new Set(normalized.split(/\s+/).filter(w => w.length > 3));
    
    return this.corrections.filter(c => {
      const correctionWords = new Set(
        c.boqItem.toLowerCase().trim().split(/\s+/).filter(w => w.length > 3)
      );
      
      // Calculate word overlap
      const overlap = Array.from(words).filter(w => correctionWords.has(w)).length;
      const totalWords = Math.max(words.size, correctionWords.size);
      
      // At least 50% word overlap
      return totalWords > 0 && overlap / totalWords >= 0.5;
    });
  }
  
  private extractKeywords(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[\s,\-()]+/)
      .filter(w => w.length > 2);
  }
  
  private rebuildCache(): void {
    this.suggestionCache.clear();
    for (const correction of this.corrections) {
      this.updateSuggestionCache(correction);
    }
  }
}

// Export singleton instance
export const matchFeedbackStore = new MatchFeedbackStore();

/**
 * Record a match correction
 */
export function recordCorrection(
  boqItem: string,
  correctMatch: string,
  wrongMatch?: string | null,
  options?: {
    wrongScore?: number;
    correctScore?: number;
    userId?: string;
    projectId?: string;
    category?: string;
  }
): void {
  matchFeedbackStore.addCorrection({
    boqItem,
    wrongMatch: wrongMatch || null,
    correctMatch,
    ...options
  });
}

/**
 * Get a suggested match for an item based on learning
 */
export function getSuggestedMatch(boqItem: string): MatchSuggestion | null {
  return matchFeedbackStore.getSuggestion(boqItem);
}

/**
 * Get learning statistics
 */
export function getLearningStats() {
  return matchFeedbackStore.getStats();
}

/**
 * Get keyword importance weights for scoring
 */
export function getLearnedKeywordWeights(): Map<string, number> {
  return matchFeedbackStore.getKeywordWeights();
}
