import { motion } from 'motion/react';
import { Screen } from '../App';
import { MobileScreen } from './mobile-ui';

interface LoadingScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function LoadingScreen({ onNavigate: _onNavigate }: LoadingScreenProps) {
  const dots = Array.from({ length: 12 });

  return (
    <MobileScreen contentClassName="flex items-center justify-center px-8">
      <div className="relative flex h-[280px] w-full items-center justify-center">
        <motion.div
          className="absolute h-36 w-36 rounded-full bg-[radial-gradient(circle,_rgba(65,116,229,0.18)_0,_rgba(65,116,229,0.02)_72%,_transparent_100%)] blur-md"
          animate={{ scale: [0.94, 1.08, 0.94], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="relative h-28 w-28"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
        >
          {dots.map((_, index) => {
            const angle = (index / dots.length) * Math.PI * 2;
            const x = Math.cos(angle) * 42;
            const y = Math.sin(angle) * 42;
            const opacity = 0.2 + index / dots.length / 1.1;

            return (
              <motion.span
                key={index}
                className="absolute left-1/2 top-1/2 h-4 w-4 rounded-full bg-[#1d56cf]"
                style={{
                  marginLeft: '-8px',
                  marginTop: '-8px',
                  opacity,
                }}
                animate={{
                  x: [x, x * 0.9, x],
                  y: [y, y * 0.9, y],
                  scale: [0.85, 1, 0.85],
                }}
                transition={{
                  duration: 1.3,
                  repeat: Infinity,
                  delay: index * 0.08,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </motion.div>
      </div>
    </MobileScreen>
  );
}
