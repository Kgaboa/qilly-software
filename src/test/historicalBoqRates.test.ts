import { describe, expect, it } from 'vitest';
import { scoreHistoricalDescription } from '@/utils/historicalBoqRates';

describe('historical BOQ matching controls', () => {
  it('accepts an exact generic activity description', () => {
    expect(scoreHistoricalDescription('Flagmen', 'Flagmen')).toBe(100);
  });

  it('accepts a fully specified equivalent pipe description', () => {
    expect(scoreHistoricalDescription(
      'Supply and deliver 110 mm class 12 uPVC pressure pipe',
      'uPVC pipe 110mm Class 12',
    )).toBeGreaterThanOrEqual(85);
  });

  it('rejects the wrong diameter', () => {
    expect(scoreHistoricalDescription(
      'Supply 160mm class 12 uPVC pipe',
      'uPVC pipe 110mm Class 12',
    )).toBe(0);
  });

  it('rejects the wrong pressure class', () => {
    expect(scoreHistoricalDescription(
      'Supply 110mm class 9 uPVC pipe',
      'uPVC pipe 110mm Class 12',
    )).toBe(0);
  });

  it('does not auto-match an underspecified generic pipe', () => {
    expect(scoreHistoricalDescription('PVC pipe', 'uPVC pipe 110mm Class 12')).toBe(0);
  });

  it('rejects a fitting type mismatch', () => {
    expect(scoreHistoricalDescription('110mm gate valve', 'cast iron end cap 110mm')).toBe(0);
  });

  it('rejects a contextless sub-item even when its words overlap', () => {
    expect(scoreHistoricalDescription(
      'Excavate hard material from trench',
      'Exceeding 1.5m and up to 3.0m',
    )).toBe(0);
  });
});
