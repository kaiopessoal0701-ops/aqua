import { motion } from 'motion/react';
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Fish,
  FileText,
  Lock,
  LogOut,
  Settings,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Screen, Tank } from '../App';
import {
  MobileScreen,
  SecondaryButton,
  SurfaceCard,
} from './mobile-ui';

interface ProfileScreenProps {
  tanks: Tank[];
  onNavigate: (screen: Screen) => void;
}

const settingsItems = [
  { icon: Lock, label: 'Alterar Senha' },
  { icon: Bell, label: 'Historico de Alertas' },
  { icon: FileText, label: 'Termos de uso e Privacidade' },
];

function ProfileRow({
  icon: Icon,
  label,
  divider = true,
}: {
  icon: LucideIcon;
  label: string;
  divider?: boolean;
}) {
  return (
    <div
      className={[
        'flex items-center justify-between py-3',
        divider ? 'border-b border-[#e8eef9]' : '',
      ].join(' ')}
    >
      <div className="flex items-center gap-3 text-[#1d2538]">
        <Icon className="h-[18px] w-[18px] text-[#61718d]" />
        <span className="text-[14px] font-semibold">{label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-[#8ea0c2]" />
    </div>
  );
}

export default function ProfileScreen({ tanks, onNavigate }: ProfileScreenProps) {
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
        className="mt-2 text-center"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h1 className="text-[30px] font-extrabold tracking-[-0.07em] text-[#1d2538]">
          Meu Perfil
        </h1>

        <div className="mx-auto mt-4 flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(180deg,#31b1ff_0%,#4f73ff_100%)] shadow-[0_18px_36px_rgba(74,113,255,0.26)]">
          <UserRound className="h-11 w-11 text-white" />
        </div>

        <p className="mt-4 text-[22px] font-extrabold text-[#1d2538]">Nome do usuario</p>
        <p className="mt-1 text-[13px] font-medium text-[#8a97b2]">Produtor Rural</p>

        <SecondaryButton className="mx-auto mt-4 w-[132px] rounded-full text-[12px]">
          Editar Perfil
        </SecondaryButton>
      </motion.div>

      <motion.div
        className="mt-8 space-y-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.4 }}
      >
        <SurfaceCard className="px-4 py-3">
          <div className="flex items-center justify-between border-b border-[#e8eef9] pb-3">
            <div className="flex items-center gap-3 text-[#1d2538]">
              <Fish className="h-[18px] w-[18px] text-[#61718d]" />
              <span className="text-[14px] font-extrabold">Meus Tanques</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#8ea0c2]" />
          </div>

          <div className="pt-1">
            {tanks.map((tank, index) => (
              <div
                key={tank.id}
                className={[
                  'flex items-center justify-between py-3 text-[14px]',
                  index < tanks.length - 1 ? 'border-b border-[#eef3fb]' : '',
                ].join(' ')}
              >
                <span className="font-semibold text-[#1d2538]">{tank.name}</span>
                <span className="text-[12px] font-semibold text-[#7383a0]">
                  {tank.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="px-4 py-3">
          <div className="flex items-center justify-between border-b border-[#e8eef9] pb-3">
            <div className="flex items-center gap-3 text-[#1d2538]">
              <Settings className="h-[18px] w-[18px] text-[#61718d]" />
              <span className="text-[14px] font-extrabold">Configuracoes</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#8ea0c2]" />
          </div>

          <div className="pt-1">
            {settingsItems.map((item, index) => (
              <ProfileRow
                key={item.label}
                icon={item.icon}
                label={item.label}
                divider={index < settingsItems.length - 1}
              />
            ))}
          </div>
        </SurfaceCard>
      </motion.div>

      <motion.div
        className="mt-8 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.26 }}
      >
        <button
          onClick={() => onNavigate('login')}
          className="flex h-10 min-w-[86px] items-center justify-center gap-2 rounded-full bg-[#0f4ecd] px-6 text-[13px] font-semibold text-white shadow-[0_14px_28px_rgba(15,78,205,0.24)]"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </motion.div>
    </MobileScreen>
  );
}
