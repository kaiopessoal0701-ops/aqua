import { useEffect, useMemo, useState } from 'react';
import { fetchDashboardTanks, submitReadingToApi } from '../lib/dashboard-api';
import {
  applyReadingToTanks,
  buildDashboardSummary,
  buildTankAlerts,
  createSeedHistory,
  getTankStatus,
  mergeRemoteAndLocalTanks,
  sortTanksBySeverity,
  upsertTankList,
} from '../lib/dashboard-status';
import {
  enqueueOfflineReading,
  loadCachedTanks,
  loadCustomTanks,
  loadLastUpdatedAt,
  loadOfflineReadings,
  saveCustomTanks,
  saveDashboardCache,
  saveLastUpdatedAt,
  saveOfflineReadings,
} from '../lib/dashboard-storage';
import { mockDashboardTanks } from '../mock/mockDashboard';
import type { DashboardDataOrigin, OfflineReading, Tank } from '../types/dashboard';
import { useNetworkStatus } from './useNetworkStatus';

const AUTO_REFRESH_MS = Number(import.meta.env.VITE_DASHBOARD_REFRESH_MS ?? 60000);

function generateId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

export function useDashboardData() {
  const cachedTanks = loadCachedTanks();
  const localTanks = loadCustomTanks();
  const initialTanks = cachedTanks.length
    ? cachedTanks
    : mergeRemoteAndLocalTanks(mockDashboardTanks, localTanks);

  const [tanks, setTanks] = useState<Tank[]>(sortTanksBySeverity(initialTanks));
  const [customTanks, setCustomTanks] = useState<Tank[]>(localTanks);
  const [isLoading, setIsLoading] = useState(cachedTanks.length === 0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(loadLastUpdatedAt());
  const [pendingSyncCount, setPendingSyncCount] = useState(loadOfflineReadings().length);
  const [dataOrigin, setDataOrigin] = useState<DashboardDataOrigin>(
    cachedTanks.length ? 'cache' : 'mock',
  );
  const [hasCachedData, setHasCachedData] = useState(cachedTanks.length > 0);

  const isOnline = useNetworkStatus();

  const persistDashboard = (nextTanks: Tank[], updatedAt = new Date().toISOString()) => {
    const orderedTanks = sortTanksBySeverity(nextTanks);
    setTanks(orderedTanks);
    saveDashboardCache(orderedTanks);
    saveLastUpdatedAt(updatedAt);
    setLastUpdatedAt(updatedAt);
    setHasCachedData(true);
  };

  const refreshDashboard = async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;

    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const remoteTanks = await fetchDashboardTanks();
      const mergedTanks = mergeRemoteAndLocalTanks(remoteTanks, customTanks);
      persistDashboard(mergedTanks);
      setError(null);
      setDataOrigin('api');
    } catch {
      if (hasCachedData) {
        setError('API indisponivel no momento. Exibindo o cache local.');
        setDataOrigin('cache');
      } else {
        const fallbackTanks = mergeRemoteAndLocalTanks(mockDashboardTanks, customTanks);
        persistDashboard(fallbackTanks);
        setError('Nao foi possivel carregar a API. Exibindo dados iniciais.');
        setDataOrigin('mock');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const syncPendingReadings = async () => {
    if (!isOnline) {
      return;
    }

    const queuedReadings = loadOfflineReadings();

    if (!queuedReadings.length) {
      return;
    }

    setIsSyncing(true);

    const failedReadings: OfflineReading[] = [];

    for (const reading of queuedReadings) {
      try {
        await submitReadingToApi(reading);
      } catch {
        failedReadings.push(reading);
      }
    }

    saveOfflineReadings(failedReadings);
    setPendingSyncCount(failedReadings.length);
    setIsSyncing(false);

    if (failedReadings.length === 0) {
      setError(null);
      await refreshDashboard({ silent: true });
      return;
    }

    setError('Algumas leituras seguem pendentes de sincronizacao.');
  };

  useEffect(() => {
    refreshDashboard({ silent: cachedTanks.length > 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isOnline) {
      return;
    }

    syncPendingReadings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  useEffect(() => {
    if (!isOnline) {
      return;
    }

    const interval = window.setInterval(() => {
      refreshDashboard({ silent: true });
    }, AUTO_REFRESH_MS);

    return () => window.clearInterval(interval);
  }, [customTanks, isOnline]);

  const registerReading = async (tankId: string, temperature: number, oxygen: number) => {
    const targetTank = tanks.find((tank) => tank.id === tankId);

    if (!targetTank) {
      return;
    }

    const reading: OfflineReading = {
      id: generateId('reading'),
      tankId,
      tankName: targetTank.name,
      temperature,
      oxygen,
      recordedAt: new Date().toISOString(),
    };

    const nextTanks = applyReadingToTanks(tanks, reading);
    persistDashboard(nextTanks, reading.recordedAt);

    if (!isOnline) {
      const queue = enqueueOfflineReading(reading);
      setPendingSyncCount(queue.length);
      setError('Sem conexao. Leitura salva localmente e adicionada a fila de sincronizacao.');
      return;
    }

    try {
      await submitReadingToApi(reading);
      setError(null);
      await refreshDashboard({ silent: true });
    } catch {
      const queue = enqueueOfflineReading(reading);
      setPendingSyncCount(queue.length);
      setError('API indisponivel. Leitura salva localmente e adicionada a fila de sincronizacao.');
    }
  };

  const addTank = (tank: Tank) => {
    const updatedAt = tank.updatedAt || new Date().toISOString();
    const normalizedTank: Tank = {
      ...tank,
      updatedAt,
      status: getTankStatus(tank, tank.temperature, tank.oxygen),
      history: tank.history.length
        ? tank.history
        : createSeedHistory(tank.temperature, tank.oxygen, updatedAt),
    };

    const nextCustomTanks = upsertTankList(customTanks, normalizedTank);
    const nextDashboard = upsertTankList(tanks, normalizedTank);

    setCustomTanks(nextCustomTanks);
    saveCustomTanks(nextCustomTanks);
    persistDashboard(nextDashboard, updatedAt);
  };

  const summary = useMemo(() => buildDashboardSummary(tanks), [tanks]);
  const alerts = useMemo(() => buildTankAlerts(tanks), [tanks]);

  return {
    alerts,
    addTank,
    dataOrigin,
    error,
    hasCachedData,
    isLoading,
    isOnline,
    isRefreshing,
    isSyncing,
    lastUpdatedAt,
    pendingSyncCount,
    refreshDashboard,
    registerReading,
    summary,
    tanks,
  };
}
