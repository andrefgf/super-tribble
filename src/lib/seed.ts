import { Ad, AccountBenchmarks } from './types';

export const BRAND_NAME = 'Lumière';

export const benchmarks: AccountBenchmarks = {
  medianRoas: 2.4,
  medianCtr: 0.022,
  medianCvr: 0.031,
  medianCpa: 38,
};

export const ads: Ad[] = [
  {
    id: 'ad_01',
    name: 'Summer Glow — Video 30s',
    platform: 'meta',
    campaign: 'Prospecting — Summer',
    adGroup: 'Broad 25-44 Women',
    creative: { id: 'cr_01', name: 'Summer Glow 30s', type: 'video', thumbnail: '' },
    performance: {
      spend: 4200, revenue: 14700, impressions: 210000, clicks: 6300, conversions: 189,
      roas: 3.5, ctr: 0.030, cvr: 0.030, cpc: 0.67, cpa: 22,
      frequency: 1.8,
      prev_roas: 3.1, prev_ctr: 0.028, prev_cpc: 0.70,
    },
    daysRunning: 14,
  },
  {
    id: 'ad_02',
    name: 'Hydration Hero — Carousel',
    platform: 'meta',
    campaign: 'Retargeting — ATC',
    adGroup: 'Add to Cart 30d',
    creative: { id: 'cr_02', name: 'Hydration Hero Carousel', type: 'carousel', thumbnail: '' },
    performance: {
      spend: 1800, revenue: 7200, impressions: 95000, clicks: 2660, conversions: 120,
      roas: 4.0, ctr: 0.028, cvr: 0.045, cpc: 0.68, cpa: 15,
      frequency: 2.1,
      prev_roas: 3.6, prev_ctr: 0.025, prev_cpc: 0.71,
    },
    daysRunning: 21,
  },
  {
    id: 'ad_03',
    name: 'Founder Story — Video 60s',
    platform: 'meta',
    campaign: 'Prospecting — Summer',
    adGroup: 'Interest: Skincare',
    creative: { id: 'cr_03', name: 'Founder Story 60s', type: 'video', thumbnail: '' },
    performance: {
      spend: 3100, revenue: 3720, impressions: 180000, clicks: 2700, conversions: 28,
      roas: 1.2, ctr: 0.015, cvr: 0.010, cpc: 1.15, cpa: 110,
      frequency: 4.2,
      prev_roas: 1.8, prev_ctr: 0.021, prev_cpc: 0.98,
    },
    daysRunning: 30,
  },
  {
    id: 'ad_04',
    name: 'UGC Review — Video 15s',
    platform: 'meta',
    campaign: 'Prospecting — Always On',
    adGroup: 'Lookalike 1% Purchasers',
    creative: { id: 'cr_04', name: 'UGC Review 15s', type: 'video', thumbnail: '' },
    performance: {
      spend: 2600, revenue: 5720, impressions: 145000, clicks: 3770, conversions: 68,
      roas: 2.2, ctr: 0.026, cvr: 0.018, cpc: 0.69, cpa: 38,
      frequency: 2.5,
      prev_roas: 2.3, prev_ctr: 0.026, prev_cpc: 0.68,
    },
    daysRunning: 10,
  },
  {
    id: 'ad_05',
    name: 'Before/After — Static',
    platform: 'meta',
    campaign: 'Retargeting — Viewers',
    adGroup: 'Video Views 50% 14d',
    creative: { id: 'cr_05', name: 'Before/After Static', type: 'image', thumbnail: '' },
    performance: {
      spend: 890, revenue: 623, impressions: 67000, clicks: 670, conversions: 8,
      roas: 0.70, ctr: 0.010, cvr: 0.012, cpc: 1.33, cpa: 111,
      frequency: 5.8,
      prev_roas: 1.1, prev_ctr: 0.018, prev_cpc: 1.10,
    },
    daysRunning: 45,
  },
  {
    id: 'ad_06',
    name: 'Flash Sale — Static',
    platform: 'meta',
    campaign: 'Retargeting — ATC',
    adGroup: 'Add to Cart 7d',
    creative: { id: 'cr_06', name: 'Flash Sale Static', type: 'image', thumbnail: '' },
    performance: {
      spend: 420, revenue: 1680, impressions: 32000, clicks: 960, conversions: 42,
      roas: 4.0, ctr: 0.030, cvr: 0.044, cpc: 0.44, cpa: 10,
      frequency: 1.2,
      prev_roas: 2.1, prev_ctr: 0.022, prev_cpc: 0.60,
    },
    daysRunning: 5,
  },
];