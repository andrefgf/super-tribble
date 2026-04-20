import { Ad, AccountBenchmarks, DecisionOutput, PortfolioSummary, Decision, Confidence } from './types';

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function computeBaseScore(ad: Ad, benchmarks: AccountBenchmarks): number {
  const p = ad.performance;

  const roasNorm = clamp(p.roas / (benchmarks.medianRoas * 2), 0, 1);
  const cpaNorm = clamp(1 - (p.cpa / (benchmarks.medianCpa * 2)), 0, 1);
  const ctrNorm = clamp(p.ctr / (benchmarks.medianCtr * 2), 0, 1);
  const cvrNorm = clamp(p.cvr / (benchmarks.medianCvr * 2), 0, 1);

  return Math.round((roasNorm * 40 + cpaNorm * 30 + ctrNorm * 20 + cvrNorm * 10) * 100);
}

function computeTrendScore(ad: Ad): number {
  const p = ad.performance;
  const roasChange = p.prev_roas > 0 ? (p.roas - p.prev_roas) / p.prev_roas : 0;
  const ctrChange = p.prev_ctr > 0 ? (p.ctr - p.prev_ctr) / p.prev_ctr : 0;
  const cpcChange = p.prev_cpc > 0 ? (p.cpc - p.prev_cpc) / p.prev_cpc : 0;

  const raw = roasChange * 0.5 + ctrChange * 0.3 - cpcChange * 0.2;
  return clamp(Math.round(raw * 100), -100, 100);
}

function computeConfidence(ad: Ad): { value: number; label: Confidence } {
  const p = ad.performance;
  let value: number;
  if (p.conversions >= 10 && p.clicks >= 100) value = 1.0;
  else if (p.clicks >= 100) value = 0.6;
  else value = 0.3;

  const label: Confidence = value >= 0.8 ? 'HIGH' : value >= 0.5 ? 'MEDIUM' : 'LOW';
  return { value, label };
}

function detectFatigue(ad: Ad): boolean {
  return ad.performance.frequency > 3;
}

export function runDecisionEngine(ad: Ad, benchmarks: AccountBenchmarks): DecisionOutput {
  const p = ad.performance;
  const baseScore = computeBaseScore(ad, benchmarks);
  const trendScore = computeTrendScore(ad);
  const { value: confidenceValue, label: confidence } = computeConfidence(ad);
  const fatigue = detectFatigue(ad);

  const aboveBenchmark = p.roas > benchmarks.medianRoas;
  const wellBelowBenchmark = p.roas < benchmarks.medianRoas * 0.5;
  const positiveTrend = trendScore > 0;
  const sufficientSpend = p.spend > 500;
  const highCtrLowCvr = p.ctr > benchmarks.medianCtr && p.cvr < benchmarks.medianCvr * 0.7;
  const lowCtr = p.ctr < benchmarks.medianCtr * 0.6;
  const fallingCtr = p.ctr < p.prev_ctr * 0.75;
  const highCvrLowSpend = p.cvr > benchmarks.medianCvr * 1.3 && p.spend < 1000;

  let decision: Decision;
  let budgetSuggestion: string;
  let reasons: string[] = [];
  let fixDiagnosis: string | undefined;

  if (ad.daysRunning < 4) {
    decision = 'HOLD';
    budgetSuggestion = 'No change — in cooling period';
    reasons = ['Ad is less than 4 days old — not enough data'];
  } else if (aboveBenchmark && positiveTrend && confidenceValue >= 0.6) {
    decision = 'SCALE';
    const pct = trendScore > 30 ? '+50%' : '+30%';
    budgetSuggestion = pct;
    reasons = [
      `ROAS ${p.roas.toFixed(1)}x vs account median ${benchmarks.medianRoas.toFixed(1)}x`,
      `Positive trend (+${trendScore} momentum score)`,
      `${confidence} confidence based on ${p.conversions} conversions`,
    ];
    if (p.frequency < 2) reasons.push('Low frequency — room to scale');
  } else if (wellBelowBenchmark && sufficientSpend && confidenceValue >= 0.6) {
    decision = 'KILL';
    budgetSuggestion = '–100% (pause)';
    reasons = [
      `ROAS ${p.roas.toFixed(1)}x is below 50% of account median (${benchmarks.medianRoas.toFixed(1)}x)`,
      `€${p.spend.toLocaleString()} spent with insufficient return`,
      `${confidence} confidence — signal is reliable`,
    ];
    if (fatigue) reasons.push(`High frequency (${p.frequency.toFixed(1)}) — audience fatigued`);
    if (fallingCtr) reasons.push('CTR declining week-over-week');
  } else if (highCtrLowCvr || lowCtr || fallingCtr || highCvrLowSpend) {
    decision = 'FIX';
    budgetSuggestion = 'Hold spend pending fix';
    if (highCtrLowCvr) {
      fixDiagnosis = 'Landing page mismatch';
      reasons = [
        `CTR ${(p.ctr * 100).toFixed(2)}% is strong but CVR ${(p.cvr * 100).toFixed(2)}% is low`,
        'Clicks are not converting — audit landing page for message match',
        'Check page load speed and mobile UX',
      ];
    } else if (fallingCtr && fatigue) {
      fixDiagnosis = 'Creative fatigue';
      reasons = [
        `CTR dropped from ${(p.prev_ctr * 100).toFixed(2)}% to ${(p.ctr * 100).toFixed(2)}%`,
        `Frequency at ${p.frequency.toFixed(1)} — audience has seen this too many times`,
        'Refresh creative or rotate to new variant',
      ];
    } else if (lowCtr) {
      fixDiagnosis = 'Weak creative hook';
      reasons = [
        `CTR ${(p.ctr * 100).toFixed(2)}% is below account average — creative is not stopping the scroll`,
        'Test new hooks, headlines, or formats',
      ];
    } else {
      fixDiagnosis = 'Budget constrained winner';
      reasons = [
        `CVR ${(p.cvr * 100).toFixed(2)}% above benchmark but spend is low`,
        'Increase budget to capture full potential',
      ];
    }
  } else {
    decision = 'HOLD';
    budgetSuggestion = 'No change';
    reasons = [
      `ROAS ${p.roas.toFixed(1)}x near account median — no strong signal yet`,
      `Trend score ${trendScore > 0 ? '+' : ''}${trendScore} — momentum is neutral`,
      `Continue running to build confidence`,
    ];
  }

  const priority = (decision === 'SCALE' || decision === 'KILL') ? 'HIGH'
    : decision === 'FIX' ? 'MEDIUM' : 'LOW';

  return { ad, score: baseScore, trendScore, confidence, confidenceValue, decision, priority, budgetSuggestion, reasons, fixDiagnosis };
}

export function runPortfolio(decisions: DecisionOutput[]): PortfolioSummary {
  const totalSpend = decisions.reduce((s, d) => s + d.ad.performance.spend, 0);
  const totalRevenue = decisions.reduce((s, d) => s + d.ad.performance.revenue, 0);
  const overallRoas = totalRevenue / totalSpend;

  const winners = decisions.filter(d => d.decision === 'SCALE');
  const losers = decisions.filter(d => d.decision === 'KILL');
  const hold = decisions.filter(d => d.decision === 'HOLD' || d.decision === 'FIX');

  const spendOnWinners = winners.reduce((s, d) => s + d.ad.performance.spend, 0);
  const spendOnLosers = losers.reduce((s, d) => s + d.ad.performance.spend, 0);
  const spendOnHold = hold.reduce((s, d) => s + d.ad.performance.spend, 0);
  const reallocationAmount = Math.round(spendOnLosers * 0.65);

  return {
    totalSpend,
    totalRevenue,
    overallRoas,
    spendOnWinners,
    spendOnLosers,
    spendOnHold,
    decisions: {
      SCALE: winners.length,
      KILL: losers.length,
      HOLD: decisions.filter(d => d.decision === 'HOLD').length,
      FIX: decisions.filter(d => d.decision === 'FIX').length,
    },
    reallocationAmount,
    reallocationFrom: losers.map(d => d.ad.name),
    reallocationTo: winners.slice(0, 3).map(d => d.ad.name),
  };
}
