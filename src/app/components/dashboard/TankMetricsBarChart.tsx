import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Tank } from '../../types/dashboard';
import { SurfaceCard } from '../mobile-ui';

interface TankMetricsBarChartProps {
  tank: Tank | null;
}

export function TankMetricsBarChart({ tank }: TankMetricsBarChartProps) {
  if (!tank) {
    return (
      <SurfaceCard className="border border-white/70 bg-white/95 px-5 py-5">
        <p className="text-[15px] font-semibold text-[#61759b]">
          Selecione um tanque para comparar leituras atuais com as referencias.
        </p>
      </SurfaceCard>
    );
  }

  const chartData = [
    {
      metric: 'Temperatura',
      atual: tank.temperature,
      ideal: Number((((tank.tempMin + tank.tempMax) / 2)).toFixed(1)),
    },
    {
      metric: 'Oxigenio',
      atual: tank.oxygen,
      ideal: Number((((tank.oxygenMin + tank.oxygenMax) / 2)).toFixed(1)),
    },
  ];

  return (
    <SurfaceCard className="border border-white/70 bg-white/95 px-5 py-5">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6b80a8]">
          Grafico comparativo
        </p>
        <h2 className="mt-2 text-[24px] font-black tracking-[-0.06em] text-[#10213f]">
          Atual x referencia
        </h2>
        <p className="mt-2 text-[13px] font-medium text-[#61759b]">
          Referencia calculada pelo ponto medio da faixa segura configurada para o
          tanque selecionado.
        </p>
      </div>

      <div className="mt-6 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={12}>
            <CartesianGrid stroke="#e6edf9" strokeDasharray="4 4" />
            <XAxis
              dataKey="metric"
              tick={{ fill: '#5f739b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#5f739b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '18px',
                border: '1px solid #d5e3ff',
                boxShadow: '0 18px 38px rgba(33, 78, 176, 0.14)',
              }}
            />
            <Legend />
            <Bar dataKey="atual" name="Atual" radius={[10, 10, 0, 0]} fill="#2563eb" />
            <Bar dataKey="ideal" name="Referencia" radius={[10, 10, 0, 0]} fill="#7c9ce8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SurfaceCard>
  );
}
