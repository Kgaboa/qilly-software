import type { BidRecommendation } from './bidDecision';
import type { RiskSummary } from './tenderRisk';

/** Risk evidence is mandatory before an indicative BID recommendation. */
export function gateBidRecommendation(
 recommendation: BidRecommendation,
 risks: RiskSummary | null,
): BidRecommendation {
 if (!risks) return 'INSUFFICIENT_DATA';
 if (risks.blockingRisks > 0 && recommendation === 'BID') return 'REVIEW';
 return recommendation;
}
