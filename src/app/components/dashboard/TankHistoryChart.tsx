import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Tank } from '../../types/dashboard';
import { SurfaceCard } from '../mobile-ui';
import { statusMeta } from './statusMeta';

interface TankHistoryChartProps {
  tank: Tank | null;
}

export function TankHistoryChart({ tank }: TankHistoryChartProps) {
  if (!tank) {
    return (
      <SurfaceCard className="border border-white/70 bg-white/95 px-5 py-5">
        <p className="text-[15px] font-semibold text-[#61759b]">
          Selecione um tanque para visualizar o historico das leituras.
        </p>
      </SurfaceCard>
    );
  }

  const meta = statusMeta[tank.status];

  return (
    <SurfaceCard className="border border-white/70 bg-white/95 px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6b80a8]">
            Historico interativo
          </p>
          <h2 className="mt-2 text-[24px] font-black tracking-[-0.06em] text-[#10213f]">
            {tank.name}
          </h2>
          <p className="mt-2 text-[13px] font-medium text-[#61759b]">
            Faixa ideal: {tank.tempMin} C a {tank.tempMax} C e {tank.oxygenMin} a{' '}
            {tank.oxygenMax} mg/L
          </p>
        </div>

        <span
          className={[
            'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]',
            meta.badgeClass,
          ].join(' ')}
        >
          {meta.label}
        </span>
      </div>

      <div className="mt-6 h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={tank.history}>
            <CartesianGrid stroke="#e6edf9" strokeDasharray="4 4" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#5f739b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="temperature"
              tick={{ fill: '#5f739b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={38}
            />
            <YAxis
              yAxisId="oxygen"
              orientation="right"
              tick={{ fill: '#5f739b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={38}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '18px',
                border: '1px solid #d5e3ff',
                boxShadow: '0 18px 38px rgba(33, 78, 176, 0.14)',
              }}
            />
            <Legend />
            <Line
              yAxisId="temperature"
              type="monotone"
              dataKey="temp"
              name="Temperatura"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="oxygen"
              type="monotone"
              dataKey="oxygen"
              name="Oxigenio"
              stroke={meta.chartColor}
              strokeWidth={3}
              dot={{ r: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SurfaceCard>
  );
}
