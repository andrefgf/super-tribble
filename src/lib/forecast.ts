import type { DecisionOutput, AccountBenchmarks } from '@/lib/types';

export interface Forecast {
  upliftEur: number;
  daysProjected: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  breakdown: {
    wasteRecovered: number;
    reallocationRevenue: number;
    scaleBoost: number;
  };
  hasKills: boolean;
  hasScales: boolean;
  isHealthy: boolean;
}

/**
 * Compute a 30-day revenue uplift forecast from a list of decisions.
 *
 * Logic:
 * - Kill losers  → recover wasted spend (65% of it is reallocatable after platform lag)
 * - Reallocate to winners → freed spend × average winner ROAS (capped at 8×)
 * - Scale winners 30% → incremental spend × their ROAS
 * - ROAS cap of 8× prevents insane projections on sparse data
 * - Round to nearest €100 for display credibility
 */
export function computeForecast(
  decisions: DecisionOutput[],
  daysOfData: number,
  _benchmarks: AccountBenchmarks,
): Forecast {
  const kills  = decisions.filter(d => d.decision === 'KILL');
  const scales = decisions.filter(d => d.decision === 'SCALE');

  const hasKills  = kills.length > 0;
  const hasScales = scales.length > 0;

  // ── Confidence ───────────────────────────────────────────────────
  const totalConversions = decisions.reduce(
    (s, d) => s + d.ad.performance.conversions, 0,
  );
  let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (daysOfData >= 14 && totalConversions >= 20) confidence = 'MEDIUM';
  if (daysOfData >= 21 && totalConversions >= 50) confidence = 'HIGH';

  // ── Kill savings → reallocation ───────────────────────────────────
  const loserSpend = kills.reduce((s, d) => s + d.ad.performance.spend, 0);
  // 65% rule: account for budget system lag / transition period
  const wasteRecovered = loserSpend * 0.65;

  const winnerSpend = scales.reduce((s, d) => s + d.ad.performance.spend, 0);
  const avgWinnerRoas =
    winnerSpend > 0
      ? scales.reduce((s, d) => s + d.ad.performance.roas * d.ad.performance.spend, 0) /
        winnerSpend
      : 3; // sensible fallback

  const cappedWinnerRoas = Math.min(avgWinnerRoas, 8);
  const reallocationRevenue = wasteRecovered * cappedWinnerRoas;

  // ── Scale boost: 30% more budget on winners ────────────────────────
  const scaleBoost = scales.reduce((s, d) => {
    const incrementalSpend = d.ad.performance.spend * 0.30;
    const cappedRoas = Math.min(d.ad.performance.roas, 8);
    return s + incrementalSpend * cappedRoas;
  }, 0);

  // ── Extrapolate from data window to 30 days ────────────────────────
  const scaleFactor = Math.min(30 / Math.max(daysOfData, 7), 4);

  const wasteRecoveredFinal     = round100(wasteRecovered     * scaleFactor);
  const reallocationRevenueFinal = round100(reallocationRevenue * scaleFactor);
  const scaleBoostFinal          = round100(scaleBoost          * scaleFactor);

  const upliftEur = wasteRecoveredFinal + reallocationRevenueFinal + scaleBoostFinal;

  // ── Healthy account: no kills, all above median ─────────────────────
  const isHealthy =
    !hasKills &&
    !hasScales &&
    decisions.every(d => d.decision === 'HOLD' || d.decision === 'FIX');

  return {
    upliftEur: Math.max(upliftEur, 0),
    daysProjected: 30,
    confidence,
    breakdown: {
      wasteRecovered:      wasteRecoveredFinal,
      reallocationRevenue: reallocationRevenueFinal,
      scaleBoost:          scaleBoostFinal,
    },
    hasKills,
    hasScales,
    isHealthy,
  };
}

function round100(n: number): number {
  return Math.round(n / 100) * 100;
}
