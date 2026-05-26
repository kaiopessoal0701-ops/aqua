import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Screen, Tank } from '../App';
import type { DashboardDataOrigin, DashboardSummary, TankAlert } from '../types/dashboard';
import { AlertsPanel } from './dashboard/AlertsPanel';
import { ConnectionBanner } from './dashboard/ConnectionBanner';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { SummaryCards } from './dashboard/SummaryCards';
import {
  TankSortDirection,
  TankSortKey,
  TankStatusFilter,
  TankTable,
} from './dashboard/TankTable';
import { TankHistoryChart } from './dashboard/TankHistoryChart';
import { TankMetricsBarChart } from './dashboard/TankMetricsBarChart';
import { statusRank } from './dashboard/statusMeta';

interface DashboardScreenProps {
  alerts: TankAlert[];
  dataOrigin: DashboardDataOrigin;
  error: string | null;
  hasCachedData: boolean;
  isLoading: boolean;
  isOnline: boolean;
  isRefreshing: boolean;
  isSyncing: boolean;
  lastUpdatedAt: string | null;
  onNavigate: (screen: Screen) => void;
  onRefresh: () => void;
  pendingSyncCount: number;
  summary: DashboardSummary;
  tanks: Tank[];
}

function compareValues(left: Tank, right: Tank, sortKey: TankSortKey) {
  if (sortKey === 'name') {
    return left.name.localeCompare(right.name, 'pt-BR');
  }

  if (sortKey === 'temperature') {
    return left.temperature - right.temperature;
  }

  if (sortKey === 'oxygen') {
    return left.oxygen - right.oxygen;
  }

  if (sortKey === 'updatedAt') {
    return new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime();
  }

  return statusRank[left.status] - statusRank[right.status];
}

export default function DashboardScreen({
  alerts,
  dataOrigin,
  error,
  hasCachedData,
  isLoading,
  isOnline,
  isRefreshing,
  isSyncing,
  lastUpdatedAt,
  onNavigate,
  onRefresh,
  pendingSyncCount,
  summary,
  tanks,
}: DashboardScreenProps) {
  const [selectedTankId, setSelectedTankId] = useState(tanks[0]?.id ?? '');
  const [statusFilter, setStatusFilter] = useState<TankStatusFilter>('all');
  const [sortKey, setSortKey] = useState<TankSortKey>('status');
  const [sortDirection, setSortDirection] = useState<TankSortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTanks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return tanks.filter((tank) => {
      const matchesStatus = statusFilter === 'all' ? true : tank.status === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0
          ? true
          : [tank.name, tank.fishType, tank.location ?? '']
              .join(' ')
              .toLowerCase()
              .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter, tanks]);

  const sortedTanks = useMemo(() => {
    const sorted = [...filteredTanks].sort((left, right) => compareValues(left, right, sortKey));
    return sortDirection === 'asc' ? sorted : sorted.reverse();
  }, [filteredTanks, sortDirection, sortKey]);

  useEffect(() => {
    if (sortedTanks.some((tank) => tank.id === selectedTankId)) {
      return;
    }

    setSelectedTankId(sortedTanks[0]?.id ?? tanks[0]?.id ?? '');
  }, [selectedTankId, sortedTanks, tanks]);

  const selectedTank =
    sortedTanks.find((tank) => tank.id === selectedTankId) ??
    tanks.find((tank) => tank.id === selectedTankId) ??
    sortedTanks[0] ??
    tanks[0] ??
    null;

  const handleSortChange = (key: TankSortKey) => {
    if (sortKey === key) {
      setSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDirection('asc');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(30,87,214,0.22),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_28%),linear-gradient(180deg,#eef5ff_0%,#f9fbff_42%,#eff4fa_100%)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1320px]">
        <DashboardHeader
          dataOrigin={dataOrigin}
          isOnline={isOnline}
          isRefreshing={isRefreshing}
          lastUpdatedAt={lastUpdatedAt}
          onAddTank={() => onNavigate('addTank')}
          onOpenProfile={() => onNavigate('profile')}
          onRefresh={onRefresh}
          onRegisterReading={() => onNavigate('registerReading')}
        />

        <div className="mt-6 space-y-6">
          <ConnectionBanner
            dataOrigin={dataOrigin}
            error={error}
            hasCachedData={hasCachedData}
            isOnline={isOnline}
            isSyncing={isSyncing}
            pendingSyncCount={pendingSyncCount}
          />

          <SummaryCards summary={summary} />

          {isLoading ? (
            <div className="rounded-[26px] border border-white/70 bg-white/95 px-6 py-8 text-[15px] font-semibold text-[#5f739b] shadow-[0_18px_42px_rgba(25,77,175,0.08)]">
              Carregando dados do dashboard...
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.35 }}
            >
              <AlertsPanel alerts={alerts} onSelectTank={setSelectedTankId} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.35 }}
            >
              <TankHistoryChart tank={selectedTank} />
            </motion.div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.35 }}
            >
              <TankMetricsBarChart tank={selectedTank} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.35 }}
            >
              <TankTable
                onSearchTermChange={setSearchTerm}
                onSelectTank={setSelectedTankId}
                onSortChange={handleSortChange}
                onStatusFilterChange={setStatusFilter}
                searchTerm={searchTerm}
                selectedTankId={selectedTankId}
                sortDirection={sortDirection}
                sortKey={sortKey}
                statusFilter={statusFilter}
                tanks={sortedTanks}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
