import { createHistoryPoint, getTankStatus, sortTanksBySeverity } from './dashboard-status';
import type { OfflineReading, Tank } from '../types/dashboard';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const DASHBOARD_ENDPOINT = import.meta.env.VITE_API_DASHBOARD_ENDPOINT ?? '/api/tanks';
const READINGS_ENDPOINT = import.meta.env.VITE_API_READINGS_ENDPOINT ?? '/api/readings';

type RemoteTank = {
  id?: string | number;
  name?: string;
  tankName?: string;
  fishType?: string;
  species?: string;
  location?: string;
  temperature?: string | number;
  oxygen?: string | number;
  status?: Tank['status'];
  tempMin?: string | number;
  tempMax?: string | number;
  oxygenMin?: string | number;
  oxygenMax?: string | number;
  updatedAt?: string;
  history?: Array<{
    time?: string;
    recordedAt?: string;
    temperature?: string | number;
    temp?: string | number;
    oxygen?: string | number;
  }>;
};

function buildUrl(endpoint: string) {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedEndpoint}` : normalizedEndpoint;
}

function toNumber(value: unknown, fallback: number) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function normalizeHistoryPoint(
  point: NonNullable<RemoteTank['history']>[number],
  fallbackRecordedAt: string,
) {
  const recordedAt = point.recordedAt ?? fallbackRecordedAt;
  return {
    time: point.time ?? new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(recordedAt)),
    recordedAt,
    temp: toNumber(point.temp ?? point.temperature, 0),
    oxygen: toNumber(point.oxygen, 0),
  };
}

function normalizeTank(rawTank: RemoteTank): Tank {
  const updatedAt = rawTank.updatedAt ?? new Date().toISOString();
  const temperature = toNumber(rawTank.temperature, 0);
  const oxygen = toNumber(rawTank.oxygen, 0);
  const tempMin = toNumber(rawTank.tempMin, 0);
  const tempMax = toNumber(rawTank.tempMax, tempMin + 1);
  const oxygenMin = toNumber(rawTank.oxygenMin, 0);
  const oxygenMax = toNumber(rawTank.oxygenMax, oxygenMin + 1);
  const history =
    Array.isArray(rawTank.history) && rawTank.history.length > 0
      ? rawTank.history.map((item) => normalizeHistoryPoint(item, updatedAt)).slice(-10)
      : [createHistoryPoint(temperature, oxygen, updatedAt)];

  return {
    id: String(rawTank.id ?? crypto.randomUUID()),
    name: rawTank.name ?? rawTank.tankName ?? 'Tanque sem nome',
    fishType: rawTank.fishType ?? rawTank.species ?? 'Especie nao informada',
    location: rawTank.location,
    temperature,
    oxygen,
    status:
      rawTank.status ?? getTankStatus({ tempMin, tempMax, oxygenMin, oxygenMax }, temperature, oxygen),
    tempMin,
    tempMax,
    oxygenMin,
    oxygenMax,
    updatedAt,
    history,
  };
}

function extractTankArray(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as { tanks?: unknown[]; data?: unknown[]; items?: unknown[] };
    return candidate.tanks ?? candidate.data ?? candidate.items ?? [];
  }

  return [];
}

export async function fetchDashboardTanks() {
  const response = await fetch(buildUrl(DASHBOARD_ENDPOINT), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao carregar dashboard: ${response.status}`);
  }

  const payload = await response.json();
  const tanks = extractTankArray(payload).map((item) => normalizeTank(item as RemoteTank));

  if (!tanks.length) {
    throw new Error('A API respondeu sem dados de tanques.');
  }

  return sortTanksBySeverity(tanks);
}

export async function submitReadingToApi(reading: OfflineReading) {
  const response = await fetch(buildUrl(READINGS_ENDPOINT), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      tankId: reading.tankId,
      temperature: reading.temperature,
      oxygen: reading.oxygen,
      recordedAt: reading.recordedAt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Falha ao enviar leitura: ${response.status}`);
  }
}
