import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Screen } from '../App';
import { LogoLockup, MobileScreen, partnerLogoUrl } from './mobile-ui';

interface LoginScreenProps {
  onNavigate: (screen: Screen) => void;
}

const socialButtons = [
  {
    id: 'google',
    label: 'Continue with Google',
    filled: false,
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09a6.98 6.98 0 0 1 0-4.18V7.07H2.18A11.94 11.94 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
        />
      </svg>
    ),
  },
  {
    id: 'apple',
    label: 'Continue with Apple',
    filled: false,
    icon: (
      <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    filled: true,
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.02 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24V7.9h-1.51c-1.49 0-1.95.93-1.95 1.89v2.28h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07Z" />
      </svg>
    ),
  },
];

function SocialButton({
  label,
  icon,
  filled,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  filled?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={[
        'flex h-[52px] w-full items-center justify-center gap-3 rounded-full px-6 shadow-[0_12px_24px_rgba(30,64,175,0.14)] transition',
        filled
          ? 'bg-[#2a5fda] text-white'
          : 'border border-[#d6deee] bg-white text-[#20293e]',
      ].join(' ')}
    >
      {icon}
      <span className="text-[14px] font-semibold">{label}</span>
    </motion.button>
  );
}

export default function LoginScreen({ onNavigate }: LoginScreenProps) {
  const handleLogin = () => {
    onNavigate('loading');

    window.setTimeout(() => {
      onNavigate('personalData');
    }, 1800);
  };

  return (
    <MobileScreen contentClassName="flex flex-col justify-between px-8 pb-8">
      <div className="pt-6" />

      <motion.div
        className="flex flex-1 flex-col items-center justify-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <LogoLockup className="mb-16" />

        <div className="w-full space-y-3">
          {socialButtons.map((button, index) => (
            <motion.div
              key={button.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.08 }}
            >
              <SocialButton {...button} onClick={handleLogin} />
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-8 text-center text-[11px] font-medium text-[#7a86a3]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
        >
          Nao tem uma conta?{' '}
          <button className="font-semibold text-[#1b57cf] underline underline-offset-2">
            Criar conta
          </button>
        </motion.p>
      </motion.div>

      <motion.div
        className="pb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
      >
        <p className="text-[13px] font-semibold text-[#1d2538]">Nossos parceiros</p>
        <div className="mt-4 flex justify-center">
          <div className="rounded-[20px] bg-white px-5 py-4 shadow-[0_14px_30px_rgba(51,88,170,0.12)]">
            <img
              src={partnerLogoUrl}
              alt="Instituto Federal de Sergipe"
              className="h-20 w-auto object-contain"
            />
          </div>
        </div>
      </motion.div>
    </MobileScreen>
  );
}
