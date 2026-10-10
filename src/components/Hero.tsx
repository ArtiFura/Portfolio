import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SectionDivider } from './SectionDivider';
import { handleSpotlightMove } from '../utils/scrollManager';

interface HeroProps {
  onOpenEstimator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEstimator }) => {
  return (
    <section className="relative w-full overflow-hidden min-h-[calc(100vh-5rem)] flex flex-col justify-center pb-16 md:pb-20 bg-transparent" id="hero">
      {/* Section Divider */}
      <SectionDivider
        number="00"
        label="OVERVIEW"
        targetId="hero"
        nextId="about"
      />

      {/* Ambient breathing radial glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-[#e5c365]/10 rounded-full blur-[120px] pointer-events-none animate-ambient" />

      {/* Atmospheric architectural grid lines */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffe08d 1px, transparent 1px), linear-gradient(to bottom, #ffe08d 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">

        {/* Clean status line */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 mb-8 sm:mb-12 border-b border-[#4d4637]/30">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffe08d] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ffe08d]"></span>
            </span>
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#ffe08d] font-semibold font-mono">
              EST. 2026
            </span>
          </div>

          <span className="text-[11px] sm:text-xs font-mono text-[#99907e]">
            AVAILABLE FOR NEW PROJECTS
          </span>
        </div>

        {/* Main Editorial Hero Title & Proposition */}
        <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-end mb-12 sm:mb-16 md:mb-20">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-sans uppercase tracking-tight text-[#e5e2e3] leading-[1.08] sm:leading-[1.04] font-semibold">
              We Build <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe08d] via-[#e5c365] to-[#e5e2e3]">
                What Comes Next.
              </span>
            </h1>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-5 sm:gap-6">
            <p className="text-sm sm:text-base md:text-lg text-[#c6c6cf] leading-relaxed">
              We build modern digital products, robust software, and intelligent systems for ambitious teams.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
              <a
                href="#contact"
                className="btn-interactive inline-flex items-center justify-center bg-[#ffe08d] text-[#3d2f00] text-xs uppercase px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold whitespace-nowrap cursor-pointer shadow-md group"
              >
                <span>Start a Project</span>
                <ArrowRight size={15} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href="#work"
                className="btn-interactive inline-flex items-center justify-center bg-[#2a2a2b]/70 hover:bg-[#353436] text-[#e5e2e3] border border-[#4d4637]/40 hover:border-[#ffe08d]/80 hover:text-[#ffe08d] text-xs uppercase px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl whitespace-nowrap cursor-pointer group"
              >
                <span>View Work</span>
                <ArrowUpRight size={15} className="ml-1.5 text-[#ffe08d] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Metrics Bar / Stat Row */}
        <div
          onMouseMove={handleSpotlightMove}
          className="scroll-reveal delay-150 card-interactive spotlight-card grid grid-cols-2 md:grid-cols-4 bg-[#181819] border border-[#4d4637]/40 rounded-2xl divide-y md:divide-y-0 md:divide-x divide-[#4d4637]/30 overflow-hidden shadow-lg"
        >

          {/* Stat 1 */}
          <div className="p-4 sm:p-6 flex flex-col gap-1 group hover:bg-[#201f20] transition-all duration-300 cursor-default">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#99907e] group-hover:text-[#ffe08d] transition-colors">
                Services
              </span>
              <span className="w-1.5 h-1.5 bg-[#ffe08d]/60 group-hover:bg-[#ffe08d] group-hover:scale-125 transition-all"></span>
            </div>
            <span className="text-2xl xs:text-3xl md:text-[44px] leading-tight text-[#e5e2e3] font-semibold tracking-tight group-hover:text-[#ffe08d] transition-colors duration-300">
              06+
            </span>
            <span className="text-xs text-[#c6c6cf]">
              Core Capabilities
            </span>
          </div>

          {/* Stat 2 */}
          <div className="p-4 sm:p-6 flex flex-col gap-1 group hover:bg-[#201f20] transition-all duration-300 cursor-default">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#99907e] group-hover:text-[#ffe08d] transition-colors">
                Architecture
              </span>
              <span className="w-1.5 h-1.5 bg-[#ffe08d]/60 group-hover:bg-[#ffe08d] group-hover:scale-125 transition-all"></span>
            </div>
            <span className="text-2xl xs:text-3xl md:text-[44px] leading-tight text-[#ffe08d] font-semibold tracking-tight group-hover:brightness-110 transition-all duration-300">
              Modern
            </span>
            <span className="text-xs text-[#c6c6cf]">
              Cloud &amp; AI Native
            </span>
          </div>

          {/* Stat 3 */}
          <div className="p-4 sm:p-6 flex flex-col gap-1 group hover:bg-[#201f20] transition-all duration-300 cursor-default">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#99907e] group-hover:text-[#ffe08d] transition-colors">
                Location
              </span>
              <span className="w-1.5 h-1.5 bg-[#ffe08d]/60 group-hover:bg-[#ffe08d] group-hover:scale-125 transition-all"></span>
            </div>
            <span className="text-2xl xs:text-3xl md:text-[44px] leading-tight text-[#e5e2e3] font-semibold tracking-tight group-hover:text-[#ffe08d] transition-colors duration-300">
              India
            </span>
            <span className="text-xs text-[#c6c6cf]">
              Global Remote
            </span>
          </div>

          {/* Stat 4 */}
          <div className="p-4 sm:p-6 flex flex-col gap-1 group hover:bg-[#201f20] transition-all duration-300 cursor-default">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#99907e] group-hover:text-[#ffe08d] transition-colors">
                Reliability
              </span>
              <span className="w-1.5 h-1.5 bg-[#ffe08d]/60 group-hover:bg-[#ffe08d] group-hover:scale-125 transition-all"></span>
            </div>
            <span className="text-2xl xs:text-3xl md:text-[44px] leading-tight text-[#e5e2e3] font-semibold tracking-tight tabular-nums group-hover:text-[#ffe08d] transition-colors duration-300">
              100%
            </span>
            <span className="text-xs text-[#c6c6cf]">
              Delivery Commitment
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
