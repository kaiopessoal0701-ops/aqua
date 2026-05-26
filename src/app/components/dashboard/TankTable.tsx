import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import type { Tank } from '../../types/dashboard';
import { statusMeta } from './statusMeta';

export type TankStatusFilter = 'all' | Tank['status'];
export type TankSortKey = 'name' | 'temperature' | 'oxygen' | 'status' | 'updatedAt';
export type TankSortDirection = 'asc' | 'desc';

interface TankTableProps {
  onSearchTermChange: (value: string) => void;
  onSelectTank: (tankId: string) => void;
  onSortChange: (key: TankSortKey) => void;
  onStatusFilterChange: (value: TankStatusFilter) => void;
  searchTerm: string;
  selectedTankId: string;
  sortDirection: TankSortDirection;
  sortKey: TankSortKey;
  statusFilter: TankStatusFilter;
  tanks: Tank[];
}

function formatUpdatedAt(updatedAt: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(updatedAt));
}

function SortButton({
  active,
  direction,
  label,
  onClick,
}: {
  active: boolean;
  direction: TankSortDirection;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-left text-[12px] font-bold uppercase tracking-[0.12em] text-[#5671a6]"
    >
      {label}
      {active ? (
        direction === 'asc' ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" />
        )
      ) : null}
    </button>
  );
}

export function TankTable({
  onSearchTermChange,
  onSelectTank,
  onSortChange,
  onStatusFilterChange,
  searchTerm,
  selectedTankId,
  sortDirection,
  sortKey,
  statusFilter,
  tanks,
}: TankTableProps) {
  return (
    <div className="rounded-[26px] border border-white/70 bg-white/95 px-5 py-5 shadow-[0_18px_42px_rgba(25,77,175,0.10)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6b80a8]">
            Tabela interativa
          </p>
          <h2 className="mt-2 text-[24px] font-black tracking-[-0.06em] text-[#10213f]">
            Tanques monitorados
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <label className="relative block min-w-[260px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b80a8]" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Buscar por nome ou especie"
              className="h-12 w-full rounded-[14px] border border-[#d4e0f8] bg-[#f9fbff] pl-11 pr-4 text-[14px] font-medium text-[#10213f] outline-none transition focus:border-[#7da0ef] focus:bg-white"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {(['all', 'ok', 'warning', 'critical'] as const).map((filterValue) => {
              const active = statusFilter === filterValue;
              const label =
                filterValue === 'all'
                  ? 'Todos'
                  : filterValue === 'ok'
                    ? 'Estaveis'
                    : filterValue === 'warning'
                      ? 'Atencao'
                      : 'Criticos';

              return (
                <button
                  key={filterValue}
                  type="button"
                  onClick={() => onStatusFilterChange(filterValue)}
                  className={[
                    'rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition',
                    active
                      ? 'bg-[#0f4ecd] text-white shadow-[0_12px_24px_rgba(15,78,205,0.22)]'
                      : 'bg-[#edf3ff] text-[#24447e]',
                  ].join(' ')}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr>
              <th className="px-3 pb-1 text-left">
                <SortButton
                  active={sortKey === 'name'}
                  direction={sortDirection}
                  label="Tanque"
                  onClick={() => onSortChange('name')}
                />
              </th>
              <th className="px-3 pb-1 text-left">
                <SortButton
                  active={sortKey === 'temperature'}
                  direction={sortDirection}
                  label="Temperatura"
                  onClick={() => onSortChange('temperature')}
                />
              </th>
              <th className="px-3 pb-1 text-left">
                <SortButton
                  active={sortKey === 'oxygen'}
                  direction={sortDirection}
                  label="Oxigenio"
                  onClick={() => onSortChange('oxygen')}
                />
              </th>
              <th className="px-3 pb-1 text-left">
                <SortButton
                  active={sortKey === 'status'}
                  direction={sortDirection}
                  label="Status"
                  onClick={() => onSortChange('status')}
                />
              </th>
              <th className="px-3 pb-1 text-left">
                <SortButton
                  active={sortKey === 'updatedAt'}
                  direction={sortDirection}
                  label="Atualizado em"
                  onClick={() => onSortChange('updatedAt')}
                />
              </th>
            </tr>
          </thead>

          <tbody>
            {tanks.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="rounded-[18px] border border-dashed border-[#d7e3fb] bg-[#f8fbff] px-4 py-10 text-center text-[14px] font-medium text-[#61759b]"
                >
                  Nenhum tanque encontrado para os filtros atuais.
                </td>
              </tr>
            ) : (
              tanks.map((tank) => {
                const meta = statusMeta[tank.status];
                const selected = tank.id === selectedTankId;

                return (
                  <tr
                    key={tank.id}
                    className={[
                      'cursor-pointer transition',
                      selected ? 'scale-[1.01]' : '',
                    ].join(' ')}
                    onClick={() => onSelectTank(tank.id)}
                  >
                    <td className="rounded-l-[20px] border-y border-l border-[#e6eefc] bg-[#fbfdff] px-3 py-4">
                      <div>
                        <p className="text-[14px] font-extrabold text-[#10213f]">{tank.name}</p>
                        <p className="mt-1 text-[12px] font-medium text-[#61759b]">
                          {tank.fishType}
                          {tank.location ? ` • ${tank.location}` : ''}
                        </p>
                      </div>
                    </td>
                    <td className="border-y border-[#e6eefc] bg-[#fbfdff] px-3 py-4 text-[14px] font-bold text-[#16315f]">
                      {tank.temperature.toFixed(1)} C
                    </td>
                    <td className="border-y border-[#e6eefc] bg-[#fbfdff] px-3 py-4 text-[14px] font-bold text-[#16315f]">
                      {tank.oxygen.toFixed(1)} mg/L
                    </td>
                    <td className="border-y border-[#e6eefc] bg-[#fbfdff] px-3 py-4">
                      <span
                        className={[
                          'inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]',
                          meta.badgeClass,
                        ].join(' ')}
                      >
                        <span
                          className={['h-2.5 w-2.5 rounded-full', meta.dotClassName].join(' ')}
                        />
                        {meta.label}
                      </span>
                    </td>
                    <td className="rounded-r-[20px] border-y border-r border-[#e6eefc] bg-[#fbfdff] px-3 py-4 text-[13px] font-semibold text-[#61759b]">
                      {formatUpdatedAt(tank.updatedAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
