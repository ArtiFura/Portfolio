import React from 'react';
import { ChevronDown } from 'lucide-react';
import { smoothScrollTo } from '../utils/scrollManager';

interface SectionDividerProps {
  number: string;
  label: string;
  subtitle?: string;
  targetId?: string;
  nextId?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  number,
  label,
  subtitle,
  targetId,
  nextId,
}) => {
  const handleScrollToTarget = () => {
    const id = nextId || targetId;
    if (id) {
      smoothScrollTo('#' + id, { offset: -80 });
    }
  };

  return (
    <div className="relative w-full py-6 sm:py-8 md:py-10 bg-transparent select-none overflow-hidden z-20">
      {/* Background ambient glow pulse behind divider */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-r from-transparent via-[#ffe08d]/15 to-transparent blur-md pointer-events-none" />

      {/* Main Divider Line */}
      <div className="relative max-w-[1440px] mx-auto px-2 xs:px-4 sm:px-8 lg:px-12 flex items-center justify-between">

        {/* Left Track Line */}
        <div className="flex-1 flex items-center min-w-[12px]">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ffe08d]/60 to-[#ffe08d] shadow-[0_0_12px_rgba(255,224,141,0.5)]" />
        </div>

        {/* Center Node / Badge */}
        <div
          onClick={handleScrollToTarget}
          role="button"
          tabIndex={0}
          title={nextId ? `Go to ${nextId.toUpperCase()}` : `Section ${number}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleScrollToTarget();
            }
          }}
          className="mx-1.5 xs:mx-3 sm:mx-6 shrink-0 group flex items-center gap-1.5 xs:gap-2 sm:gap-3 px-2.5 xs:px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-[#0e0e0f] border-2 border-[#ffe08d]/80 hover:border-[#ffe08d] shadow-[0_0_24px_rgba(255,224,141,0.3),0_4px_20px_rgba(0,0,0,0.9)] transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
        >
          {/* Glowing Indicator */}
          <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffe08d] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 sm:h-2 w-1.5 sm:w-2 bg-[#ffe08d] shadow-[0_0_8px_#ffe08d]" />
          </span>

          {/* Section Number */}
          <span className="text-[11px] sm:text-sm font-mono font-bold text-[#ffe08d] tracking-wider">
            {number}
          </span>

          <span className="h-3 sm:h-3.5 w-[1px] bg-[#ffe08d]/40" />

          {/* Section Label */}
          <span className="text-[11px] sm:text-sm font-sans font-bold text-[#e5e2e3] group-hover:text-[#ffe08d] tracking-wider uppercase transition-colors">
            {label}
          </span>

          {/* Optional Subtitle */}
          {subtitle && (
            <>
              <span className="hidden md:inline h-3.5 w-[1px] bg-[#4d4637]/60" />
              <span className="hidden md:inline text-[11px] font-mono text-[#99907e] tracking-wider">
                {subtitle}
              </span>
            </>
          )}

          {/* Interactive Chevron */}
          <ChevronDown
            size={13}
            className="text-[#ffe08d] group-hover:translate-y-0.5 transition-transform duration-300 ml-0.5"
          />
        </div>

        {/* Right Track Line */}
        <div className="flex-1 flex items-center min-w-[12px]">
          <div className="h-[2px] w-full bg-gradient-to-r from-[#ffe08d] via-[#ffe08d]/60 to-transparent shadow-[0_0_12px_rgba(255,224,141,0.5)]" />
        </div>

      </div>
    </div>
  );
};
