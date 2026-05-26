export type TankStatus = 'ok' | 'warning' | 'critical';

export interface TankHistoryPoint {
  time: string;
  recordedAt: string;
  temp: number;
  oxygen: number;
}

export interface Tank {
  id: string;
  name: string;
  fishType: string;
  location?: string;
  temperature: number;
  oxygen: number;
  status: TankStatus;
  tempMin: number;
  tempMax: number;
  oxygenMin: number;
  oxygenMax: number;
  updatedAt: string;
  history: TankHistoryPoint[];
}

export interface DashboardSummary {
  totalTanks: number;
  warningTanks: number;
  criticalTanks: number;
  averageTemperature: number;
  averageOxygen: number;
}

export interface TankAlert {
  id: string;
  tankId: string;
  tankName: string;
  severity: Exclude<TankStatus, 'ok'>;
  title: string;
  description: string;
}

export interface OfflineReading {
  id: string;
  tankId: string;
  tankName?: string;
  temperature: number;
  oxygen: number;
  recordedAt: string;
}

export type DashboardDataOrigin = 'api' | 'cache' | 'mock';
