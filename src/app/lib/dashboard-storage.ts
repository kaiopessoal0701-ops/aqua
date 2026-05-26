import type { OfflineReading, Tank } from '../types/dashboard';

const DASHBOARD_CACHE_KEY = 'aquafeed:dashboard-cache:v1';
const OFFLINE_QUEUE_KEY = 'aquafeed:offline-queue:v1';
const LAST_UPDATED_KEY = 'aquafeed:last-updated:v1';
const CUSTOM_TANKS_KEY = 'aquafeed:custom-tanks:v1';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadCachedTanks() {
  return readJson<Tank[]>(DASHBOARD_CACHE_KEY, []);
}

export function saveDashboardCache(tanks: Tank[]) {
  writeJson(DASHBOARD_CACHE_KEY, tanks);
}

export function loadOfflineReadings() {
  return readJson<OfflineReading[]>(OFFLINE_QUEUE_KEY, []);
}

export function saveOfflineReadings(readings: OfflineReading[]) {
  writeJson(OFFLINE_QUEUE_KEY, readings);
}

export function enqueueOfflineReading(reading: OfflineReading) {
  const queue = [...loadOfflineReadings(), reading];
  saveOfflineReadings(queue);
  return queue;
}

export function loadLastUpdatedAt() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(LAST_UPDATED_KEY);
}

export function saveLastUpdatedAt(value: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(LAST_UPDATED_KEY, value);
}

export function loadCustomTanks() {
  return readJson<Tank[]>(CUSTOM_TANKS_KEY, []);
}

export function saveCustomTanks(tanks: Tank[]) {
  writeJson(CUSTOM_TANKS_KEY, tanks);
}
