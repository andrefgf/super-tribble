'use client';

import { useEffect, useState } from 'react';
import type { Ad, AccountBenchmarks } from '@/lib/types';
import { ads as seedAds, benchmarks as seedBenchmarks } from '@/lib/seed';

export interface DataSource {
  source: 'csv_upload' | 'seed';
  ads: Ad[];
  benchmarks: AccountBenchmarks;
  uploadedAt: string | null;
}

const STORAGE_KEY = 'lumiere_demo_data';

interface StoredData {
  ads: Ad[];
  benchmarks: AccountBenchmarks;
  uploadedAt: string;
}

/** Persist CSV upload data to sessionStorage */
export function persistUpload(ads: Ad[], benchmarks: AccountBenchmarks): void {
  try {
    const payload: StoredData = { ads, benchmarks, uploadedAt: new Date().toISOString() };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage unavailable (SSR, incognito quota, etc.) — fail silently
  }
}

/** Clear persisted upload data */
export function clearUpload(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

/** Read persisted upload data (returns null if none) */
export function getUploadedData(): { ads: Ad[]; benchmarks: AccountBenchmarks } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: StoredData = JSON.parse(raw);
    if (!parsed.ads?.length) return null;
    return { ads: parsed.ads, benchmarks: parsed.benchmarks };
  } catch {
    return null;
  }
}

/**
 * React hook: returns the active data source (CSV upload or seed).
 * Initialises with seed data (SSR-safe), then checks sessionStorage on mount.
 */
export function useDataSource(): DataSource {
  const [dataSource, setDataSource] = useState<DataSource>({
    source: 'seed',
    ads: seedAds,
    benchmarks: seedBenchmarks,
    uploadedAt: null,
  });

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: StoredData = JSON.parse(raw);
      if (!parsed.ads?.length) return;
      setDataSource({
        source: 'csv_upload',
        ads: parsed.ads,
        benchmarks: parsed.benchmarks,
        uploadedAt: parsed.uploadedAt,
      });
    } catch { /* ignore */ }
  }, []);

  return dataSource;
}
