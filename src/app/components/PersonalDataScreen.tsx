import { useState } from 'react';
import { motion } from 'motion/react';
import { Screen } from '../App';
import {
  LogoLockup,
  MobileScreen,
  PrimaryButton,
  ScreenTitle,
  SelectArrow,
  formLabelClassName,
  inputClassName,
  selectClassName,
} from './mobile-ui';

interface PersonalDataScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function PersonalDataScreen({ onNavigate }: PersonalDataScreenProps) {
  const [formData, setFormData] = useState({
    cpf: '',
    rg: '',
    phone: '',
    userType: '',
    gender: '',
  });

  const handleSubmit = () => {
    onNavigate('dashboard');
  };

  return (
    <MobileScreen contentClassName="px-8 pb-10">
      <motion.div
        className="flex flex-col items-center pt-4"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <LogoLockup compact />
      </motion.div>

      <motion.div
        className="mt-14"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
      >
        <ScreenTitle title="Dados pessoais" center />

        <div className="mt-10 space-y-5">
          <div>
            <label className={formLabelClassName}>CPF</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(event) => setFormData({ ...formData, cpf: event.target.value })}
              className={inputClassName}
            />
          </div>

          <div>
            <label className={formLabelClassName}>RG</label>
            <input
              type="text"
              placeholder="0.000.000-0"
              value={formData.rg}
              onChange={(event) => setFormData({ ...formData, rg: event.target.value })}
              className={inputClassName}
            />
          </div>

          <div>
            <label className={formLabelClassName}>Telefone</label>
            <input
              type="tel"
              placeholder="(00) 0 0000-0000"
              value={formData.phone}
              onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
              className={inputClassName}
            />
          </div>

          <div>
            <label className={formLabelClassName}>Tipo de usuario</label>
            <div className="relative">
              <select
                value={formData.userType}
                onChange={(event) =>
                  setFormData({ ...formData, userType: event.target.value })
                }
                className={selectClassName}
              >
                <option value="">Selecione</option>
                <option value="produtor">Produtor rural</option>
                <option value="tecnico">Tecnico</option>
                <option value="gestor">Gestor</option>
              </select>
              <SelectArrow />
            </div>
          </div>

          <div>
            <span className={formLabelClassName}>Genero</span>
            <div className="mt-1 flex items-center justify-center gap-7">
              {['Masculino', 'Feminino'].map((gender) => {
                const active = formData.gender === gender;

                return (
                  <label
                    key={gender}
                    className="flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-[#1d2538]"
                  >
                    <span
                      className={[
                        'flex h-4 w-4 items-center justify-center rounded-full border transition',
                        active ? 'border-[#1a56cf]' : 'border-[#9eb1d8]',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'h-2 w-2 rounded-full transition',
                          active ? 'bg-[#1a56cf]' : 'bg-transparent',
                        ].join(' ')}
                      />
                    </span>
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={active}
                      onChange={(event) =>
                        setFormData({ ...formData, gender: event.target.value })
                      }
                      className="sr-only"
                    />
                    {gender}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-6">
            <PrimaryButton
              onClick={handleSubmit}
              className="mx-auto block w-[78%]"
            >
              Continuar
            </PrimaryButton>
          </div>
        </div>
      </motion.div>
    </MobileScreen>
  );
}
