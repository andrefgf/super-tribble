/**
 * Industry benchmark data for Meta Ads performance comparison.
 *
 * Sources:
 * - Common Thread Collective — DTC Meta Ads Benchmarks 2024
 * - Klaviyo — Ecommerce Benchmarks Report 2024
 * - Triple Whale — State of Ecommerce Q4 2024
 * - Wpromote — Paid Social Benchmark Report 2024
 * - Meta for Business — Ads Industry Benchmarks 2024
 */

export type IndustryVertical =
  | 'general_ecom'
  | 'dtc_skincare'
  | 'dtc_apparel'
  | 'dtc_food'
  | 'dtc_home'
  | 'b2b_saas';

export interface BenchmarkBand {
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

export interface IndustryBenchmark {
  vertical: IndustryVertical;
  displayName: string;
  region: string;
  asOf: string;
  source: string;
  metrics: {
    roas:      BenchmarkBand;
    ctr:       BenchmarkBand; // as decimal (0.02 = 2%)
    cvr:       BenchmarkBand; // as decimal
    cpa:       BenchmarkBand; // in EUR
    frequency: BenchmarkBand;
  };
}

export const INDUSTRY_BENCHMARKS: Record<IndustryVertical, IndustryBenchmark> = {
  general_ecom: {
    vertical:    'general_ecom',
    displayName: 'General E-commerce',
    region:      'EU',
    asOf:        'Q4 2024',
    source:      'Triple Whale State of Ecommerce 2024',
    metrics: {
      roas:      { p25: 1.2, p50: 2.0, p75: 3.2, p90: 5.0 },
      ctr:       { p25: 0.008, p50: 0.015, p75: 0.025, p90: 0.040 },
      cvr:       { p25: 0.010, p50: 0.022, p75: 0.038, p90: 0.060 },
      cpa:       { p25: 80,   p50: 45,   p75: 28,   p90: 18 },
      frequency: { p25: 1.2,  p50: 2.0,  p75: 3.5,  p90: 5.0 },
    },
  },

  dtc_skincare: {
    vertical:    'dtc_skincare',
    displayName: 'DTC Skincare & Beauty',
    region:      'EU',
    asOf:        'Q4 2024',
    source:      'Common Thread Collective DTC Meta Benchmarks 2024',
    metrics: {
      roas:      { p25: 1.5, p50: 2.4, p75: 3.8, p90: 6.0 },
      ctr:       { p25: 0.010, p50: 0.020, p75: 0.032, p90: 0.050 },
      cvr:       { p25: 0.015, p50: 0.030, p75: 0.050, p90: 0.080 },
      cpa:       { p25: 65,   p50: 38,   p75: 22,   p90: 14 },
      frequency: { p25: 1.3,  p50: 2.2,  p75: 3.8,  p90: 5.5 },
    },
  },

  dtc_apparel: {
    vertical:    'dtc_apparel',
    displayName: 'DTC Apparel & Fashion',
    region:      'EU',
    asOf:        'Q4 2024',
    source:      'Wpromote Paid Social Benchmark Report 2024',
    metrics: {
      roas:      { p25: 1.0, p50: 1.8, p75: 3.0, p90: 4.8 },
      ctr:       { p25: 0.009, p50: 0.018, p75: 0.030, p90: 0.048 },
      cvr:       { p25: 0.008, p50: 0.018, p75: 0.032, p90: 0.055 },
      cpa:       { p25: 95,   p50: 55,   p75: 32,   p90: 20 },
      frequency: { p25: 1.4,  p50: 2.5,  p75: 4.0,  p90: 6.0 },
    },
  },

  dtc_food: {
    vertical:    'dtc_food',
    displayName: 'DTC Food & Beverage',
    region:      'EU',
    asOf:        'Q4 2024',
    source:      'Klaviyo Ecommerce Benchmarks Report 2024',
    metrics: {
      roas:      { p25: 1.3, p50: 2.2, p75: 3.5, p90: 5.5 },
      ctr:       { p25: 0.011, p50: 0.022, p75: 0.035, p90: 0.055 },
      cvr:       { p25: 0.012, p50: 0.025, p75: 0.042, p90: 0.070 },
      cpa:       { p25: 55,   p50: 30,   p75: 18,   p90: 12 },
      frequency: { p25: 1.2,  p50: 2.0,  p75: 3.2,  p90: 4.8 },
    },
  },

  dtc_home: {
    vertical:    'dtc_home',
    displayName: 'DTC Home & Lifestyle',
    region:      'EU',
    asOf:        'Q4 2024',
    source:      'Meta for Business Industry Benchmarks 2024',
    metrics: {
      roas:      { p25: 1.1, p50: 1.9, p75: 3.2, p90: 5.2 },
      ctr:       { p25: 0.007, p50: 0.014, p75: 0.024, p90: 0.038 },
      cvr:       { p25: 0.009, p50: 0.020, p75: 0.035, p90: 0.058 },
      cpa:       { p25: 90,   p50: 50,   p75: 30,   p90: 19 },
      frequency: { p25: 1.3,  p50: 2.2,  p75: 3.6,  p90: 5.2 },
    },
  },

  b2b_saas: {
    vertical:    'b2b_saas',
    displayName: 'B2B SaaS',
    region:      'EU',
    asOf:        'Q4 2024',
    source:      'Wpromote Paid Social Benchmark Report 2024',
    metrics: {
      roas:      { p25: 0.8, p50: 1.5, p75: 2.5, p90: 4.0 },
      ctr:       { p25: 0.004, p50: 0.010, p75: 0.018, p90: 0.030 },
      cvr:       { p25: 0.005, p50: 0.012, p75: 0.022, p90: 0.040 },
      cpa:       { p25: 250,  p50: 130,  p75: 70,   p90: 38 },
      frequency: { p25: 1.1,  p50: 1.8,  p75: 3.0,  p90: 4.5 },
    },
  },
};

/**
 * Returns 0–100 percentile rank for a given value within a benchmark band.
 * For "lower is better" metrics (CPA), a lower value = higher percentile.
 */
export function getPercentile(
  value: number,
  band: BenchmarkBand,
  lowerIsBetter: boolean,
): number {
  if (lowerIsBetter) {
    // Flip: a value below p25 = top 10%; above p90 = bottom 10%
    if (value <= band.p90) return 90;        // better than 90th percentile (cheapest)
    if (value <= band.p75) return 75;
    if (value <= band.p50) return 50;
    if (value <= band.p25) return 25;
    return 10;
  } else {
    if (value >= band.p90) return 90;
    if (value >= band.p75) return 75;
    if (value >= band.p50) return 50;
    if (value >= band.p25) return 25;
    return 10;
  }
}
