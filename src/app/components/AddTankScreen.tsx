import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Screen, Tank } from '../App';
import { createSeedHistory, getTankStatus } from '../lib/dashboard-status';
import {
  MobileScreen,
  PrimaryButton,
  ScreenTitle,
  SelectArrow,
  formLabelClassName,
  inputClassName,
  miniInputClassName,
  selectClassName,
} from './mobile-ui';

interface AddTankScreenProps {
  onNavigate: (screen: Screen) => void;
  onAddTank: (tank: Tank) => void;
}

export default function AddTankScreen({ onNavigate, onAddTank }: AddTankScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    fishType: '',
    tempMin: '',
    tempMax: '',
    oxygenMin: '',
    oxygenMax: '',
  });

  const handleSubmit = () => {
    const tempMin = Number(formData.tempMin || 0);
    const tempMax = Number(formData.tempMax || tempMin + 2);
    const oxygenMin = Number(formData.oxygenMin || 0);
    const oxygenMax = Number(formData.oxygenMax || oxygenMin + 1);
    const temperature = Number(((tempMin + tempMax) / 2).toFixed(1));
    const oxygen = Number(((oxygenMin + oxygenMax) / 2).toFixed(1));
    const updatedAt = new Date().toISOString();

    onAddTank({
      id: Date.now().toString(),
      name: formData.name || `Tanque ${String(Date.now()).slice(-2)}`,
      fishType: formData.fishType || 'Tilapia',
      temperature,
      oxygen,
      status: getTankStatus({ tempMin, tempMax, oxygenMin, oxygenMax }, temperature, oxygen),
      tempMin,
      tempMax,
      oxygenMin,
      oxygenMax,
      updatedAt,
      history: createSeedHistory(temperature, oxygen, updatedAt),
    });

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
          title="Novo tanque"
          subtitle="Cadastre os limites ideais de temperatura e oxigenio."
        />

        <div className="mt-9 space-y-5">
          <div>
            <label className={formLabelClassName}>Nome do tanque</label>
            <input
              type="text"
              placeholder="Nome do Tanque"
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              className={inputClassName}
            />
          </div>

          <div>
            <label className={formLabelClassName}>Tipo de peixe</label>
            <div className="relative">
              <select
                value={formData.fishType}
                onChange={(event) =>
                  setFormData({ ...formData, fishType: event.target.value })
                }
                className={selectClassName}
              >
                <option value="">Tilapia, Pacu, etc</option>
                <option value="Tilapia">Tilapia</option>
                <option value="Pacu">Pacu</option>
                <option value="Tambaqui">Tambaqui</option>
                <option value="Pirarucu">Pirarucu</option>
              </select>
              <SelectArrow />
            </div>
          </div>

          <div>
            <span className={formLabelClassName}>Limites de temperatura</span>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold text-[#6f7c98]">
                  Min:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.tempMin}
                    onChange={(event) =>
                      setFormData({ ...formData, tempMin: event.target.value })
                    }
                    className={miniInputClassName}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#8ea0c2]">
                    °C
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold text-[#6f7c98]">
                  Max:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.tempMax}
                    onChange={(event) =>
                      setFormData({ ...formData, tempMax: event.target.value })
                    }
                    className={miniInputClassName}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#8ea0c2]">
                    °C
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className={formLabelClassName}>Limites de oxigenio</span>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold text-[#6f7c98]">
                  Min:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.oxygenMin}
                    onChange={(event) =>
                      setFormData({ ...formData, oxygenMin: event.target.value })
                    }
                    className={miniInputClassName}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#8ea0c2]">
                    mg/L
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold text-[#6f7c98]">
                  Max:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.oxygenMax}
                    onChange={(event) =>
                      setFormData({ ...formData, oxygenMax: event.target.value })
                    }
                    className={miniInputClassName}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#8ea0c2]">
                    mg/L
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <PrimaryButton onClick={handleSubmit} className="mx-auto block w-[72%]">
              Salvar tanque
            </PrimaryButton>
          </div>
        </div>
      </motion.div>
    </MobileScreen>
  );
}
