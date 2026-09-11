import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface LogoProps {
  compact?: boolean;
  inverse?: boolean;
}

export default function Logo({ compact = false, inverse = false }: LogoProps) {
  const { language } = useApp();
  const titleColor = inverse ? 'text-white' : 'text-slate-900';
  const subtitleColor = inverse ? 'text-emerald-100/70' : 'text-slate-500';

  return (
    <Link to="/" className="group inline-flex items-center gap-2.5" aria-label="Sarkar Sathi home">
      <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" role="img" aria-label="Sarkar Sathi civic technology logo">
        <defs>
          <linearGradient id="sarkar-logo-shield" x1="8" y1="5" x2="40" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#046A38" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>
        </defs>
        <path d="M24 3 42 10v13c0 11.2-7.2 18.5-18 22C13.2 41.5 6 34.2 6 23V10L24 3Z" fill="url(#sarkar-logo-shield)" />
        <path d="M15.5 25.5c5.2-1.5 11.8-1.5 17 0M17 19.5c4.3-1.2 9.7-1.2 14 0M19 31.5c3.2-.9 6.8-.9 10 0" fill="none" stroke="#F59E0B" strokeLinecap="round" strokeWidth="1.8" />
        <path d="m24 11 1.7 4.1 4.3.4-3.3 2.8 1 4.2-3.7-2.2-3.7 2.2 1-4.2-3.3-2.8 4.3-.4L24 11Z" fill="#F59E0B" />
        <circle cx="14" cy="25.5" r="1.5" fill="#A7F3D0" /><circle cx="34" cy="25.5" r="1.5" fill="#A7F3D0" />
      </svg>
      {!compact && (
        <span className="min-w-0 text-left leading-tight">
          <span className={`block truncate text-base font-extrabold tracking-tight ${titleColor}`}>{language === 'ur' ? 'سرکار ساتھی' : 'Sarkar Sathi'}</span>
          <span className={`hidden text-[9px] font-semibold uppercase tracking-[0.12em] sm:block ${subtitleColor}`}>{language === 'ur' ? 'سرکاری خدمات کا رہنما • Qwen AI' : 'Gov Services Navigator · Qwen AI'}</span>
        </span>
      )}
    </Link>
  );
}
