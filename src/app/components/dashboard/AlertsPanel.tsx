import { AlertTriangle, ChevronRight, ShieldCheck } from 'lucide-react';
import type { TankAlert } from '../../types/dashboard';
import { SurfaceCard } from '../mobile-ui';
import { statusMeta } from './statusMeta';

interface AlertsPanelProps {
  alerts: TankAlert[];
  onSelectTank: (tankId: string) => void;
}

export function AlertsPanel({ alerts, onSelectTank }: AlertsPanelProps) {
  return (
    <SurfaceCard className="border border-white/70 bg-white/95 px-5 py-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6b80a8]">
            Alertas visuais
          </p>
          <h2 className="mt-2 text-[24px] font-black tracking-[-0.06em] text-[#10213f]">
            Prioridades do momento
          </h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf3ff] text-[#1c53cb]">
          <AlertTriangle className="h-6 w-6" />
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="mt-6 rounded-[18px] border border-dashed border-[#d8e4fb] bg-[#f8fbff] px-5 py-6 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-[#1ba25b]" />
          <p className="mt-3 text-[15px] font-bold text-[#16315f]">
            Nenhum alerta critico no momento
          </p>
          <p className="mt-2 text-[13px] font-medium text-[#61759b]">
            Todos os tanques estao dentro da faixa segura registrada.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {alerts.map((alert) => {
            const meta = statusMeta[alert.severity];

            return (
              <button
                key={alert.id}
                type="button"
                onClick={() => onSelectTank(alert.tankId)}
                className="flex w-full items-start justify-between gap-4 rounded-[18px] border border-[#e6eefc] bg-[#fbfdff] px-4 py-4 text-left transition hover:border-[#c8d9fb] hover:bg-[#f5f9ff]"
              >
                <div>
                  <span
                    className={[
                      'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]',
                      meta.badgeClass,
                    ].join(' ')}
                  >
                    {meta.label}
                  </span>
                  <p className="mt-3 text-[15px] font-extrabold text-[#10213f]">
                    {alert.tankName}
                  </p>
                  <p className="mt-1 text-[14px] font-semibold text-[#24447e]">
                    {alert.title}
                  </p>
                  <p className="mt-2 text-[13px] font-medium leading-6 text-[#61759b]">
                    {alert.description}
                  </p>
                </div>
                <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-[#88a0cc]" />
              </button>
            );
          })}
        </div>
      )}
    </SurfaceCard>
  );
}
