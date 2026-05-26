import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { BatteryFull, ChevronDown, SignalHigh, WifiHigh } from 'lucide-react';
import { cn } from './ui/utils';

export const partnerLogoUrl = `${import.meta.env.BASE_URL}ifs_logo.png`;

export const formLabelClassName =
  'mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#51607d]';

export const inputClassName =
  'h-12 w-full rounded-[12px] border border-[#84a4eb] bg-white px-4 text-[14px] font-semibold text-[#13213c] shadow-[0_8px_20px_rgba(79,120,211,0.12)] transition placeholder:font-medium placeholder:text-[#a0afcb] focus:border-[#1253d5] focus:outline-none focus:ring-4 focus:ring-[#1b56d71f]';

export const selectClassName = `${inputClassName} appearance-none pr-10`;

export const miniInputClassName =
  'h-11 w-full rounded-[12px] border border-[#84a4eb] bg-white px-3 text-[13px] font-semibold text-[#13213c] shadow-[0_8px_20px_rgba(79,120,211,0.12)] transition placeholder:text-[#a0afcb] focus:border-[#1253d5] focus:outline-none focus:ring-4 focus:ring-[#1b56d71f]';

interface MobileScreenProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function MobileScreen({
  children,
  className,
  contentClassName,
}: MobileScreenProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(87,132,255,0.22)_0,_rgba(228,238,255,0.82)_32%,_rgba(246,249,255,1)_66%,_rgba(240,244,250,1)_100%)] sm:px-6 sm:py-8">
      <div
        className={cn(
          'mx-auto flex min-h-screen max-w-[402px] flex-col bg-white sm:min-h-[844px] sm:overflow-hidden sm:rounded-[34px] sm:border sm:border-white/60 sm:shadow-[0_30px_90px_rgba(35,84,194,0.18)]',
          className,
        )}
      >
        <StatusBar />
        <div className={cn('flex-1 overflow-y-auto px-6 pb-8', contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function StatusBar() {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between bg-white px-5 pb-3 pt-4 text-[11px] font-semibold text-[#111827]">
      <div className="flex items-center gap-1.5">
        <SignalHigh className="h-3.5 w-3.5" strokeWidth={2.4} />
        <span className="text-[10px] font-medium tracking-normal text-[#25324d]">
          Service
        </span>
        <WifiHigh className="h-3.5 w-3.5" strokeWidth={2.4} />
      </div>
      <span className="text-[11px] font-semibold tracking-normal">19:02</span>
      <BatteryFull className="h-4 w-4" strokeWidth={2.2} />
    </div>
  );
}

interface LogoLockupProps {
  compact?: boolean;
  className?: string;
}

export function LogoLockup({ compact = false, className }: LogoLockupProps) {
  const markSize = compact ? 'h-14 w-12' : 'h-28 w-24';
  const wordmarkSize = compact
    ? 'text-[20px] tracking-[-0.07em]'
    : 'text-[32px] tracking-[-0.08em]';

  return (
    <div className={cn('flex flex-col items-center text-[#1656c8]', className)}>
      <AquafeedMark className={markSize} />
      <span className={cn('mt-2 font-extrabold uppercase leading-none', wordmarkSize)}>
        AQUAFEED
      </span>
    </div>
  );
}

export function AquafeedMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 88 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M57 6H32V37L57 62V87L43 73V108L21 86V18L39 2H67V24L57 34V6Z"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinejoin="round"
      />
      <path
        d="M57 10H69V24L57 34"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 56H53"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface ScreenTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export function ScreenTitle({
  title,
  subtitle,
  center = false,
  className,
}: ScreenTitleProps) {
  return (
    <div className={cn(center ? 'text-center' : 'text-left', className)}>
      <h1 className="text-[28px] font-extrabold uppercase tracking-[-0.07em] text-[#1d2538]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 text-[13px] font-medium text-[#7382a0]">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function PrimaryButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'h-[52px] w-full rounded-[14px] bg-[#0f4ecd] px-5 py-3 text-[14px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_14px_28px_rgba(15,78,205,0.28)] transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'h-12 w-full rounded-[14px] border border-[#cad7f3] bg-white px-5 text-[14px] font-semibold text-[#1755c7] shadow-[0_8px_24px_rgba(61,103,195,0.12)] transition hover:border-[#7e9ee8] active:scale-[0.98]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SurfaceCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-[22px] bg-white shadow-[0_14px_28px_rgba(37,78,184,0.14)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SelectArrow() {
  return (
    <ChevronDown
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#50607d]"
      strokeWidth={2.2}
    />
  );
}
