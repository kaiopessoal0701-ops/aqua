import type { TankStatus } from '../../types/dashboard';

export const statusMeta = {
  ok: {
    label: 'Estavel',
    badgeClass: 'bg-[#ddf7e8] text-[#166534]',
    dotClassName: 'bg-[#16a34a]',
    chartColor: '#16a34a',
  },
  warning: {
    label: 'Atencao',
    badgeClass: 'bg-[#fff4cf] text-[#9a6700]',
    dotClassName: 'bg-[#e0a106]',
    chartColor: '#e0a106',
  },
  critical: {
    label: 'Critico',
    badgeClass: 'bg-[#ffe1e1] text-[#b91c1c]',
    dotClassName: 'bg-[#dc2626]',
    chartColor: '#dc2626',
  },
} satisfies Record<
  TankStatus,
  {
    label: string;
    badgeClass: string;
    dotClassName: string;
    chartColor: string;
  }
>;

export const statusRank = {
  critical: 0,
  warning: 1,
  ok: 2,
} satisfies Record<TankStatus, number>;
