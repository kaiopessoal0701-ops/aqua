import type {
  DashboardSummary,
  OfflineReading,
  Tank,
  TankAlert,
  TankHistoryPoint,
  TankStatus,
} from '../types/dashboard';

const statusPriority: Record<TankStatus, number> = {
  critical: 0,
  warning: 1,
  ok: 2,
};

export function getTankStatus(
  tank: Pick<Tank, 'tempMin' | 'tempMax' | 'oxygenMin' | 'oxygenMax'>,
  temperature: number,
  oxygen: number,
): TankStatus {
  const severeTempGap = temperature < tank.tempMin - 2 || temperature > tank.tempMax + 2;
  const severeOxygenGap = oxygen < tank.oxygenMin - 1 || oxygen > tank.oxygenMax + 1;
  const outsideSafeRange =
    temperature < tank.tempMin ||
    temperature > tank.tempMax ||
    oxygen < tank.oxygenMin ||
    oxygen > tank.oxygenMax;

  if (severeTempGap || severeOxygenGap) {
    return 'critical';
  }

  if (outsideSafeRange) {
    return 'warning';
  }

  return 'ok';
}

export function formatClockTime(dateValue: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateValue));
}

export function createHistoryPoint(
  temperature: number,
  oxygen: number,
  recordedAt = new Date().toISOString(),
): TankHistoryPoint {
  return {
    time: formatClockTime(recordedAt),
    recordedAt,
    temp: Number(temperature.toFixed(1)),
    oxygen: Number(oxygen.toFixed(1)),
  };
}

export function createSeedHistory(
  temperature: number,
  oxygen: number,
  recordedAt = new Date().toISOString(),
) {
  const offsets = [
    { minutes: 45, temp: temperature - 1.1, oxygen: oxygen - 0.4 },
    { minutes: 30, temp: temperature - 0.7, oxygen: oxygen - 0.2 },
    { minutes: 15, temp: temperature - 0.3, oxygen: oxygen - 0.1 },
    { minutes: 0, temp: temperature, oxygen },
  ];

  return offsets.map((item) => {
    const date = new Date(recordedAt);
    date.setMinutes(date.getMinutes() - item.minutes);

    return createHistoryPoint(item.temp, item.oxygen, date.toISOString());
  });
}

export function applyReadingToTank(tank: Tank, reading: OfflineReading): Tank {
  const updatedAt = reading.recordedAt;

  return {
    ...tank,
    temperature: Number(reading.temperature.toFixed(1)),
    oxygen: Number(reading.oxygen.toFixed(1)),
    status: getTankStatus(tank, reading.temperature, reading.oxygen),
    updatedAt,
    history: [
      ...(tank.history.length ? tank.history : createSeedHistory(tank.temperature, tank.oxygen)),
      createHistoryPoint(reading.temperature, reading.oxygen, updatedAt),
    ].slice(-10),
  };
}

export function applyReadingToTanks(tanks: Tank[], reading: OfflineReading) {
  return tanks.map((tank) => {
    if (tank.id !== reading.tankId) {
      return tank;
    }

    return applyReadingToTank(tank, reading);
  });
}

export function buildDashboardSummary(tanks: Tank[]): DashboardSummary {
  const totalTanks = tanks.length;
  const warningTanks = tanks.filter((tank) => tank.status === 'warning').length;
  const criticalTanks = tanks.filter((tank) => tank.status === 'critical').length;

  const averageTemperature =
    totalTanks === 0
      ? 0
      : Number(
          (tanks.reduce((sum, tank) => sum + tank.temperature, 0) / totalTanks).toFixed(1),
        );

  const averageOxygen =
    totalTanks === 0
      ? 0
      : Number((tanks.reduce((sum, tank) => sum + tank.oxygen, 0) / totalTanks).toFixed(1));

  return {
    totalTanks,
    warningTanks,
    criticalTanks,
    averageTemperature,
    averageOxygen,
  };
}

function describeMetric(metric: 'temperature' | 'oxygen', current: number, min: number, max: number) {
  const unit = metric === 'temperature' ? 'C' : 'mg/L';
  const label = metric === 'temperature' ? 'Temperatura' : 'Oxigenio';

  if (current < min) {
    return `${label} abaixo do minimo (${current.toFixed(1)} ${unit} < ${min.toFixed(1)} ${unit}).`;
  }

  if (current > max) {
    return `${label} acima do maximo (${current.toFixed(1)} ${unit} > ${max.toFixed(1)} ${unit}).`;
  }

  return `${label} dentro da faixa segura.`;
}

export function buildTankAlerts(tanks: Tank[]): TankAlert[] {
  return tanks
    .filter((tank) => tank.status !== 'ok')
    .map((tank) => {
      const title =
        tank.status === 'critical'
          ? 'Acao imediata recomendada'
          : 'Tanque fora da faixa ideal';

      return {
        id: `${tank.id}-${tank.status}`,
        tankId: tank.id,
        tankName: tank.name,
        severity: tank.status,
        title,
        description: [
          describeMetric('temperature', tank.temperature, tank.tempMin, tank.tempMax),
          describeMetric('oxygen', tank.oxygen, tank.oxygenMin, tank.oxygenMax),
        ].join(' '),
      };
    });
}

export function sortTanksBySeverity(tanks: Tank[]) {
  return [...tanks].sort((left, right) => {
    const leftPriority = statusPriority[left.status];
    const rightPriority = statusPriority[right.status];

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return left.name.localeCompare(right.name, 'pt-BR');
  });
}

export function mergeRemoteAndLocalTanks(remoteTanks: Tank[], localTanks: Tank[]) {
  const tankMap = new Map(remoteTanks.map((tank) => [tank.id, tank]));

  for (const localTank of localTanks) {
    tankMap.set(localTank.id, localTank);
  }

  return sortTanksBySeverity([...tankMap.values()]);
}

export function upsertTankList(tanks: Tank[], nextTank: Tank) {
  const tankMap = new Map(tanks.map((tank) => [tank.id, tank]));
  tankMap.set(nextTank.id, nextTank);
  return sortTanksBySeverity([...tankMap.values()]);
}
