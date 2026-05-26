import type { ReactNode } from 'react';
import { AlertOctagon, Droplets, Fish, Thermometer } from 'lucide-react';
import type { DashboardSummary } from '../../types/dashboard';
import { SurfaceCard } from '../mobile-ui';

interface SummaryCardsProps {
  summary: DashboardSummary;
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
}) {
  return (
    <SurfaceCard className="h-full border border-white/70 bg-white/95 px-5 py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6b80a8]">
            {title}
          </p>
          <p className="mt-4 text-[30px] font-black tracking-[-0.08em] text-[#10213f]">
            {value}
          </p>
          <p className="mt-2 text-[13px] font-medium text-[#61759b]">{subtitle}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf3ff] text-[#1c53cb]">
          {icon}
        </div>
      </div>
    </SurfaceCard>
  );
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <SummaryCard
        title="Tanques"
        value={String(summary.totalTanks)}
        subtitle="Unidades monitoradas"
        icon={<Fish className="h-6 w-6" />}
      />
      <SummaryCard
        title="Criticos"
        value={String(summary.criticalTanks)}
        subtitle="Necessitam acao imediata"
        icon={<AlertOctagon className="h-6 w-6" />}
      />
      <SummaryCard
        title="Avisos"
        value={String(summary.warningTanks)}
        subtitle="Fora da faixa ideal"
        icon={<AlertOctagon className="h-6 w-6" />}
      />
      <SummaryCard
        title="Media temp."
        value={`${summary.averageTemperature.toFixed(1)} C`}
        subtitle="Temperatura media atual"
        icon={<Thermometer className="h-6 w-6" />}
      />
      <SummaryCard
        title="Media O2"
        value={`${summary.averageOxygen.toFixed(1)} mg/L`}
        subtitle="Oxigenio medio atual"
        icon={<Droplets className="h-6 w-6" />}
      />
    </div>
  );
}
