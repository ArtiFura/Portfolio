import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { SectionDivider } from './SectionDivider';
import { handleSpotlightMove } from '../utils/scrollManager';
import { LIFECYCLE_PHASES, LifecyclePhase, ClickOrigin } from '../data/artifuraData';
import { LifecyclePhaseModal } from './LifecyclePhaseModal';

export const Lifecycle: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<LifecyclePhase | null>(null);
  const [phaseOrigin, setPhaseOrigin] = useState<ClickOrigin | null>(null);

  const handleOpenPhase = (phase: LifecyclePhase, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPhaseOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    });
    setSelectedPhase(phase);
  };

  return (
    <section className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center pb-16 md:pb-24 bg-transparent relative" id="approach">
      {/* Section Divider */}
      <SectionDivider
        number="05"
        label="PROCESS"
        targetId="approach"
        nextId="network"
      />
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 w-full">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-16">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-[#ffe08d] font-semibold font-mono">
                05 / PROCESS
              </span>
              <span className="h-[1px] w-12 bg-[#ffe08d]/40"></span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-sans text-[#e5e2e3] font-semibold tracking-tight uppercase">
              How We Work
            </h2>
          </div>
          <p className="text-sm md:text-base text-[#c6c6cf] max-w-md">
            A clear four-stage delivery process from initial scoping to production launch.
          </p>
        </div>

        {/* 4-Step Horizontal Pipeline Grid */}
        <div className="cards-focus-group grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 py-2 sm:py-4">
          {LIFECYCLE_PHASES.map((phase) => {
            return (
              <div
                key={phase.number}
                onClick={(e) => handleOpenPhase(phase, e)}
                onMouseMove={handleSpotlightMove}
                className="card-focus-item card-interactive spotlight-card p-5 sm:p-6 md:p-7 bg-[#181819] border border-[#4d4637]/40 rounded-2xl flex flex-col justify-between cursor-pointer group hover:border-[#ffe08d]/80 hover:shadow-[0_12px_36px_rgba(255,224,141,0.18)] transition-all min-h-[340px] sm:min-h-[380px]"
              >
                <div>
                  {/* Top Row: Phase Number, Phase Label, and Click Arrow */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-mono font-bold text-[#ffe08d] group-hover:scale-105 transition-transform duration-300">
                      {phase.number}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#201f20] border border-[#4d4637]/30 text-[10px] uppercase tracking-widest text-[#99907e] font-mono group-hover:border-[#ffe08d]/50 group-hover:text-[#ffe08d] transition-colors">
                      <span>{phase.phase}</span>
                      <ArrowUpRight size={13} className="text-[#ffe08d] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl text-[#e5e2e3] font-semibold uppercase mb-3 group-hover:text-[#ffe08d] transition-colors duration-300">
                    {phase.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#c6c6cf] leading-relaxed mb-6">
                    {phase.description}
                  </p>

                  {/* Highlights preview */}
                  <div className="space-y-2 py-3 border-t border-[#4d4637]/25 text-xs text-[#c6c6cf]">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#ffe08d]">
                      <Clock size={12} className="shrink-0" />
                      <span>{phase.duration}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px] text-[#e5e2e3] line-clamp-2">
                      <CheckCircle size={12} className="text-[#ffe08d] shrink-0 mt-0.5" />
                      <span>{phase.deliverables[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-4 pt-3 border-t border-[#4d4637]/25 flex items-center justify-between text-xs text-[#ffe08d] font-mono">
                  <span className="text-[11px] text-[#99907e] uppercase group-hover:text-[#c6c6cf] transition-colors">
                    {phase.footerLabel}
                  </span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                    <span>Details</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean Process Strip */}
        <div className="mt-8 p-4 bg-[#0e0e0f] border border-[#4d4637]/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#99907e]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffe08d]"></span>
            <span>Transparent communication and milestone reviews at every stage.</span>
          </div>
          <span className="text-[#e5e2e3]">Structured Delivery</span>
        </div>

      </div>

      {/* Lifecycle Phase Deep Dive Modal with Origin Animation */}
      <LifecyclePhaseModal
        phase={selectedPhase}
        origin={phaseOrigin}
        onClose={() => {
          setSelectedPhase(null);
          setPhaseOrigin(null);
        }}
      />
    </section>
  );
};

