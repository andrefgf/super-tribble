export type Platform = 'meta' | 'google' | 'tiktok';
export type Decision = 'SCALE' | 'HOLD' | 'KILL' | 'FIX';
export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Creative {
  id: string;
  name: string;
  type: 'video' | 'image' | 'carousel';
  thumbnail: string;
}

export interface AdPerformance {
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  conversions: number;
  // current window (last 7d)
  roas: number;
  ctr: number;
  cvr: number;
  cpc: number;
  cpa: number;
  frequency: number;
  // previous window (7-14d ago) for trend
  prev_roas: number;
  prev_ctr: number;
  prev_cpc: number;
}

export interface Ad {
  id: string;
  name: string;
  platform: Platform;
  campaign: string;
  adGroup: string;
  creative: Creative;
  performance: AdPerformance;
  daysRunning: number;
}

export interface AccountBenchmarks {
  medianRoas: number;
  medianCtr: number;
  medianCvr: number;
  medianCpa: number;
}

export interface DecisionOutput {
  ad: Ad;
  score: number;
  trendScore: number;
  confidence: Confidence;
  confidenceValue: number;
  decision: Decision;
  priority: Priority;
  budgetSuggestion: string;
  reasons: string[];
  fixDiagnosis?: string;
}

export interface PortfolioSummary {
  totalSpend: number;
  totalRevenue: number;
  overallRoas: number;
  spendOnWinners: number;
  spendOnLosers: number;
  spendOnHold: number;
  decisions: { SCALE: number; HOLD: number; KILL: number; FIX: number };
  reallocationAmount: number;
  reallocationFrom: string[];
  reallocationTo: string[];
}
