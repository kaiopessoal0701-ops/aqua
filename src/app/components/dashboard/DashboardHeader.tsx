import { Activity, RefreshCcw, UserRound, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';
import { PrimaryButton, SecondaryButton } from '../mobile-ui';
import type { DashboardDataOrigin } from '../../types/dashboard';

interface DashboardHeaderProps {
  dataOrigin: DashboardDataOrigin;
  isOnline: boolean;
  isRefreshing: boolean;
  lastUpdatedAt: string | null;
  onAddTank: () => void;
  onOpenProfile: () => void;
  onRefresh: () => void;
  onRegisterReading: () => void;
}

function formatLastUpdated(lastUpdatedAt: string | null) {
  if (!lastUpdatedAt) {
    return 'Aguardando primeira sincronizacao';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(lastUpdatedAt));
}

function dataOriginLabel(dataOrigin: DashboardDataOrigin) {
  if (dataOrigin === 'api') {
    return 'Fonte: API';
  }

  if (dataOrigin === 'cache') {
    return 'Fonte: Cache local';
  }

  return 'Fonte: Mock local';
}

export function DashboardHeader({
  dataOrigin,
  isOnline,
  isRefreshing,
  lastUpdatedAt,
  onAddTank,
  onOpenProfile,
  onRefresh,
  onRegisterReading,
}: DashboardHeaderProps) {
  return (
    <motion.div
      className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/85 px-4 py-2 text-[12px] font-semibold text-[#1d3f86] shadow-[0_10px_25px_rgba(28,76,181,0.10)]">
            <Activity className="h-4 w-4" />
            Dashboard de monitoramento
          </span>

          <span
            className={[
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold shadow-[0_10px_25px_rgba(28,76,181,0.10)]',
              isOnline ? 'bg-[#ddf7e8] text-[#166534]' : 'bg-[#ffe5bf] text-[#9a6700]',
            ].join(' ')}
          >
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isOnline ? 'Conexao ativa' : 'Sem conexao'}
          </span>

          <span className="inline-flex items-center rounded-full bg-[#e9f0ff] px-4 py-2 text-[12px] font-semibold text-[#365cb3]">
            {dataOriginLabel(dataOrigin)}
          </span>
        </div>

        <h1 className="mt-5 text-[32px] font-black tracking-[-0.08em] text-[#10213f] sm:text-[42px]">
          AquaFeed
        </h1>
        <p className="mt-2 max-w-[720px] text-[14px] font-medium text-[#5f739b] sm:text-[15px]">
          Monitore tanques em tempo real, visualize alertas criticos e continue
          registrando leituras mesmo sem internet.
        </p>
        <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#5370ac]">
          Ultima atualizacao: {formatLastUpdated(lastUpdatedAt)}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] border border-[#c9d8fb] bg-white px-5 text-[14px] font-semibold text-[#1b4cc7] shadow-[0_14px_28px_rgba(21,70,180,0.10)] transition hover:border-[#93afea] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isRefreshing}
        >
          <RefreshCcw className={['h-4 w-4', isRefreshing ? 'animate-spin' : ''].join(' ')} />
          {isRefreshing ? 'Atualizando...' : 'Atualizar dados'}
        </button>

        <PrimaryButton onClick={onRegisterReading} className="min-w-[185px] sm:w-auto">
          Registrar leitura
        </PrimaryButton>

        <SecondaryButton onClick={onAddTank} className="min-w-[170px] sm:w-auto">
          Adicionar tanque
        </SecondaryButton>

        <button
          type="button"
          onClick={onOpenProfile}
          className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] border border-transparent bg-[#12347f] px-5 text-[14px] font-semibold text-white shadow-[0_14px_28px_rgba(18,52,127,0.22)] transition hover:brightness-105"
        >
          <UserRound className="h-4 w-4" />
          Perfil
        </button>
      </div>
    </motion.div>
  );
}
