/**
 * Enhanced Matching System Demo Component
 * Showcases the new PriceCheck-inspired features in Qilly
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, AlertCircle, TrendingUp, Lightbulb, Zap, Target, Lock } from 'lucide-react';
import { toast } from 'sonner';

// Import only what we need to avoid circular dependencies
import { enhancedSearchCatalog } from '@/utils/matching/enhancedItemMatcher';
import { getLearningStats } from '@/utils/matching/matchFeedback';
import type { MatchResult } from '@/utils/matching/enhancedItemMatcher';
import { allSupplierCatalogs } from '@/utils/supplierCatalog';

// Import tier access utilities
import type { SubscriptionTier } from '@/utils/tierAccess';

interface EnhancedMatchingDemoProps {
  contractorData?: any;
}

export function EnhancedMatchingDemo({ contractorData }: EnhancedMatchingDemoProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<{
    topMatch: MatchResult | null;
    alternativeMatches: MatchResult[];
    searchLevel: number;
    suggestion?: string;
  } | null>(null);
  
  // ✅ NEW: Check tier access for search functionality
  const contractorTier = (contractorData?.subscription_tier?.toLowerCase() || 'free') as SubscriptionTier;
  const isFreeTier = contractorTier === 'free';
  
  const [demoExamples] = useState([
    { query: 'Portlnd Cement 50kg', description: 'Typo: missing "a" in Portland' },
    { query: 'concrete kerb', description: 'Synonym: kerb = kerbing' },
    { query: 'PPC Cement', description: 'Brand: PPC detected' },
    { query: 'Steel reinforcing bars Y12', description: 'Keywords: steel, reinforcing, Y12' },
    { query: 'Contract sign boards', description: 'Recent addition to catalog' }
  ]);

  const handleSearch = () => {
    // ✅ NEW: Block FREE tier users
    if (isFreeTier) {
      toast.error('Item Matching is only available with paid accounts. Please upgrade to access this feature.');
      return;
    }
    
    if (!searchQuery.trim()) return;
    
    const searchResult = enhancedSearchCatalog(searchQuery, allSupplierCatalogs);
    setResults(searchResult);
  };

  const handleExampleClick = (example: string) => {
    // ✅ NEW: Block FREE tier users
    if (isFreeTier) {
      toast.error('Item Matching is only available with paid accounts. Please upgrade to access this feature.');
      return;
    }
    
    setSearchQuery(example);
    const searchResult = enhancedSearchCatalog(example, allSupplierCatalogs);
    setResults(searchResult);
  };

  const getConfidenceBadgeColor = (confidence: string) => {
    switch (confidence) {
      case 'VERY HIGH': return 'bg-green-500';
      case 'HIGH': return 'bg-blue-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-orange-500';
      case 'VERY LOW': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getMatchTypeIcon = (matchType: string) => {
    switch (matchType) {
      case 'exact': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'fuzzy': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'synonym': return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case 'keyword': return <Target className="w-4 h-4 text-orange-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const learningStats = getLearningStats();

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">🔍 Enhanced Item Matching System</h2>
        <p className="text-muted-foreground">
          Qilly's upgraded matching engine with fuzzy matching, synonyms, brand detection, and machine learning
        </p>
      </div>

      {/* FREE Tier Warning Banner */}
      {isFreeTier && (
        <Alert className="border-amber-500 bg-amber-50">
          <Lock className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <strong>Upgrade Required:</strong> Item Matching is only available with paid accounts. Please upgrade to PROFESSIONAL or higher to access this feature.
          </AlertDescription>
        </Alert>
      )}

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              Fuzzy Matching
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tolerates typos up to 2 characters. "Portlnd" → "Portland"
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              Synonyms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Understands construction terms. "kerb" = "kerbing", "m²" = "sqm"
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Brand Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Matches brands correctly. "PPC Cement" ≠ "Surecem Cement"
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Try the Enhanced Search</CardTitle>
          <CardDescription>
            Search for construction items and see the intelligent matching in action
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter item description (e.g., 'Portland Cement 50kg')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isFreeTier}
              className={isFreeTier ? 'opacity-60' : ''}
            />
            <Button 
              onClick={handleSearch}
              disabled={isFreeTier}
              className="relative"
            >
              {isFreeTier && <Lock className="w-4 h-4 mr-2" />}
              Search
            </Button>
          </div>

          {/* Example Queries */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {demoExamples.map((example, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleClick(example.query)}
                  disabled={isFreeTier}
                  className={`text-xs ${isFreeTier ? 'opacity-60' : ''}`}
                >
                  {isFreeTier && <Lock className="w-3 h-3 mr-1" />}
                  {example.query}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {results && !isFreeTier && (
            <div className="space-y-4 mt-6">
              {/* Learning Suggestion */}
              {results.suggestion && (
                <Alert className="border-blue-500 bg-blue-50">
                  <Lightbulb className="h-4 w-4 text-blue-500" />
                  <AlertDescription>
                    <strong>Learning Suggestion:</strong> Previously matched to "{results.suggestion}"
                  </AlertDescription>
                </Alert>
              )}

              {/* Top Match */}
              {results.topMatch ? (
                <Card className="border-2 border-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getMatchTypeIcon(results.topMatch.matchType)}
                        Top Match (Level {results.searchLevel})
                      </CardTitle>
                      <Badge className={getConfidenceBadgeColor(results.topMatch.confidence)}>
                        {results.topMatch.confidence}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {results.topMatch.matchLevel}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="font-semibold">{results.topMatch.item.itemName}</p>
                      <p className="text-sm text-muted-foreground">
                        Supplier: {results.topMatch.item.supplier} | 
                        Unit Price: R{results.topMatch.item.unitPrice.toFixed(2)}/{results.topMatch.item.unit}
                      </p>
                    </div>
                    <div className="bg-muted p-2 rounded text-xs">
                      <strong>Match Score:</strong> {results.topMatch.score}/100
                      <br />
                      <strong>Reason:</strong> {results.topMatch.reason}
                      {results.topMatch.fuzzyDistance !== undefined && (
                        <>
                          <br />
                          <strong>Typo Correction:</strong> {results.topMatch.fuzzyDistance} character(s) difference
                        </>
                      )}
                      {results.topMatch.brandMatch !== undefined && results.topMatch.brandMatch !== null && (
                        <>
                          <br />
                          <strong>Brand Match:</strong> {results.topMatch.brandMatch ? '✅ Yes' : '❌ No'}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No matches found after all 5 search levels. Try a different search term.
                  </AlertDescription>
                </Alert>
              )}

              {/* Alternative Matches */}
              {results.alternativeMatches.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Alternative Matches ({results.alternativeMatches.length})</h3>
                  <div className="space-y-2">
                    {results.alternativeMatches.map((match, i) => (
                      <Card key={i} className="border-blue-200">
                        <CardContent className="pt-3 pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {getMatchTypeIcon(match.matchType)}
                                <p className="font-medium text-sm">{match.item.itemName}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {match.item.supplier} - R{match.item.unitPrice.toFixed(2)}/{match.item.unit}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {match.reason}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge variant="outline" className="text-xs">
                                Score: {match.score}
                              </Badge>
                              <Badge className={`${getConfidenceBadgeColor(match.confidence)} text-xs`}>
                                {match.confidence}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Machine Learning Statistics</CardTitle>
          <CardDescription className="text-xs">
            System improves over time based on user corrections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{learningStats.totalCorrections}</p>
              <p className="text-xs text-muted-foreground">Total Corrections</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{learningStats.uniqueItems}</p>
              <p className="text-xs text-muted-foreground">Unique Items Learned</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {learningStats.avgConfidenceImprovement > 0 ? '+' : ''}
                {learningStats.avgConfidenceImprovement.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Avg Confidence Gain</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">5-Level Cascading Search Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">Level 1</Badge>
              <p><strong>Exact Match:</strong> Perfect string match + fuzzy tolerance (≤2 char diff, 85% similar) + synonym matching</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">Level 2</Badge>
              <p><strong>Scored Match:</strong> Advanced keyword scoring with brand detection and learned weights</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">Level 3</Badge>
              <p><strong>Substring Match:</strong> Flexible matching across name, category, keywords, description</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">Level 4</Badge>
              <p><strong>Description Fallback:</strong> Use separate description column if available</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">Level 5</Badge>
              <p><strong>Word-by-Word:</strong> Match ≥50% of significant words (more than 3 chars)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Qilly vs Traditional Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Feature</th>
                  <th className="text-center p-2">Traditional</th>
                  <th className="text-center p-2">Qilly Enhanced</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Typo Tolerance</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅ ±2 chars</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Synonym Matching</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅ 50+ terms</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Brand Detection</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅ Smart matching</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Learning from Corrections</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅ Continuous improvement</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Confidence Scoring</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅ 5 levels</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Match Rate</td>
                  <td className="text-center">95%</td>
                  <td className="text-center">98-99.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
