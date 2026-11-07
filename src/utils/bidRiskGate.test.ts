import { describe, expect, it } from 'vitest';
import { gateBidRecommendation } from './bidRiskGate';
import type { RiskSummary } from './tenderRisk';
const clear: RiskSummary={riskCount:0,totalExposure:0,weightedExposure:0,highRisks:0,blockingRisks:0};
describe('risk-aware Bid/No-Bid release gate',()=>{
 it('blocks BID when risk evidence is unavailable',()=>expect(gateBidRecommendation('BID',null)).toBe('INSUFFICIENT_DATA'));
 it('forces review for critical compliance risks',()=>expect(gateBidRecommendation('BID',{...clear,blockingRisks:1})).toBe('REVIEW'));
 it('does not override NO BID',()=>expect(gateBidRecommendation('NO_BID',{...clear,blockingRisks:1})).toBe('NO_BID'));
 it('permits indicative BID with verified non-blocking risks',()=>expect(gateBidRecommendation('BID',clear)).toBe('BID'));
});
