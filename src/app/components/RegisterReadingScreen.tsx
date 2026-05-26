import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Screen, Tank } from '../App';
import {
  MobileScreen,
  PrimaryButton,
  ScreenTitle,
  SelectArrow,
  SurfaceCard,
  formLabelClassName,
  inputClassName,
  selectClassName,
} from './mobile-ui';

interface RegisterReadingScreenProps {
  tanks: Tank[];
  isOnline: boolean;
  onNavigate: (screen: Screen) => void;
  onUpdateReading: (tankId: string, temperature: number, oxygen: number) => Promise<void>;
  pendingSyncCount: number;
}

export default function RegisterReadingScreen({
  tanks,
  isOnline,
  onNavigate,
  onUpdateReading,
  pendingSyncCount,
}: RegisterReadingScreenProps) {
  const [selectedTank, setSelectedTank] = useState('');
  const [temperature, setTemperature] = useState('');
  const [oxygen, setOxygen] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTankData = useMemo(
    () => tanks.find((tank) => tank.id === selectedTank),
    [selectedTank, tanks],
  );

  const handleSubmit = async () => {
    if (!selectedTank || !temperature || !oxygen) {
      return;
    }

    setIsSubmitting(true);
    await onUpdateReading(selectedTank, Number(temperature), Number(oxygen));
    setIsSubmitting(false);
    onNavigate('dashboard');
  };

  return (
    <MobileScreen contentClassName="px-6 pb-10">
      <motion.div
        className="flex items-center pt-2"
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
      >
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#1d2538]"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </motion.div>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <ScreenTitle
          title="Registrar leitura"
          subtitle="Atualize temperatura e oxigenio do tanque selecionado."
        />

        <div className="mt-9 space-y-5">
          <SurfaceCard className="border border-[#dbe6fb] bg-[#f7fbff] px-4 py-4">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-[#1d2538]">
              Status da sincronizacao
            </p>
            <p className="mt-2 text-[13px] font-medium text-[#627392]">
              {isOnline
                ? pendingSyncCount > 0
                  ? `${pendingSyncCount} leitura(s) ainda aguardando envio para a API.`
                  : 'Conexao ativa. Novas leituras tentarao ser enviadas imediatamente.'
                : 'Sem internet. A leitura sera salva no navegador e sincronizada depois.'}
            </p>
          </SurfaceCard>

          <div>
            <label className={formLabelClassName}>Selecionar tanque</label>
            <div className="relative">
              <select
                value={selectedTank}
                onChange={(event) => setSelectedTank(event.target.value)}
                className={selectClassName}
              >
                <option value="">Selecione um tanque</option>
                {tanks.map((tank) => (
                  <option key={tank.id} value={tank.id}>
                    {tank.name}
                  </option>
                ))}
              </select>
              <SelectArrow />
            </div>
          </div>

          <div>
            <label className={formLabelClassName}>Temperatura °C</label>
            <input
              type="number"
              step="0.1"
              placeholder="0.0"
              value={temperature}
              onChange={(event) => setTemperature(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div>
            <label className={formLabelClassName}>Oxigenio (mg/L)</label>
            <input
              type="number"
              step="0.1"
              placeholder="0.0"
              value={oxygen}
              onChange={(event) => setOxygen(event.target.value)}
              className={inputClassName}
            />
          </div>

          {selectedTankData ? (
            <SurfaceCard className="mt-2 px-4 py-4">
              <p className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-[#1d2538]">
                {selectedTankData.name}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4 text-[13px]">
                <div>
                  <p className="font-semibold text-[#6c7c97]">Faixa de temperatura</p>
                  <p className="mt-1 font-extrabold text-[#1d2538]">
                    {selectedTankData.tempMin}°C - {selectedTankData.tempMax}°C
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#6c7c97]">Faixa de oxigenio</p>
                  <p className="mt-1 font-extrabold text-[#1d2538]">
                    {selectedTankData.oxygenMin} - {selectedTankData.oxygenMax} mg/L
                  </p>
                </div>
              </div>
            </SurfaceCard>
          ) : null}

          <div className="pt-8">
            <PrimaryButton
              onClick={handleSubmit}
              disabled={!selectedTank || !temperature || !oxygen || isSubmitting}
              className="mx-auto block w-[72%]"
            >
              {isSubmitting ? 'Salvando...' : 'Registrar leitura'}
            </PrimaryButton>
          </div>
        </div>
      </motion.div>
    </MobileScreen>
  );
}
