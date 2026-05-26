import { AlertTriangle, CheckCircle2, CloudOff, RefreshCcw } from 'lucide-react';
import type { DashboardDataOrigin } from '../../types/dashboard';

interface ConnectionBannerProps {
  dataOrigin: DashboardDataOrigin;
  error: string | null;
  hasCachedData: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  pendingSyncCount: number;
}

export function ConnectionBanner({
  dataOrigin,
  error,
  hasCachedData,
  isOnline,
  isSyncing,
  pendingSyncCount,
}: ConnectionBannerProps) {
  if (!isOnline) {
    return (
      <div className="flex items-start gap-3 rounded-[20px] border border-[#ffd9a6] bg-[#fff5e6] px-5 py-4 text-[#8b5a00] shadow-[0_12px_24px_rgba(176,116,0,0.08)]">
        <CloudOff className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-[14px] font-extrabold">Modo offline ativo</p>
          <p className="mt-1 text-[13px] font-medium">
            Novas leituras serao salvas no navegador e sincronizadas assim que a
            conexao voltar.
          </p>
        </div>
      </div>
    );
  }

  if (pendingSyncCount > 0 || isSyncing) {
    return (
      <div className="flex items-start gap-3 rounded-[20px] border border-[#c7dbff] bg-[#edf4ff] px-5 py-4 text-[#1d4fb7] shadow-[0_12px_24px_rgba(35,88,184,0.08)]">
        <RefreshCcw className={['mt-0.5 h-5 w-5 shrink-0', isSyncing ? 'animate-spin' : ''].join(' ')} />
        <div>
          <p className="text-[14px] font-extrabold">
            {isSyncing ? 'Sincronizando leituras pendentes' : 'Fila de sincronizacao encontrada'}
          </p>
          <p className="mt-1 text-[13px] font-medium">
            {isSyncing
              ? 'As leituras offline estao sendo enviadas para a API agora.'
              : `${pendingSyncCount} leitura(s) aguardando envio para a API.`}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-[20px] border border-[#ffe0a6] bg-[#fff8e6] px-5 py-4 text-[#8b5a00] shadow-[0_12px_24px_rgba(176,116,0,0.08)]">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-[14px] font-extrabold">Atencao na sincronizacao</p>
          <p className="mt-1 text-[13px] font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (dataOrigin !== 'api' && hasCachedData) {
    return (
      <div className="flex items-start gap-3 rounded-[20px] border border-[#d5e3ff] bg-[#f5f9ff] px-5 py-4 text-[#345792] shadow-[0_12px_24px_rgba(35,88,184,0.06)]">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-[14px] font-extrabold">Dados locais carregados</p>
          <p className="mt-1 text-[13px] font-medium">
            O dashboard abriu com informacoes persistidas no navegador enquanto a
            API nao responde.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
