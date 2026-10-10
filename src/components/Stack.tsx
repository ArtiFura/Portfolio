import React, { useState } from 'react';
import { Info, X, Check } from 'lucide-react';
import { SectionDivider } from './SectionDivider';
import { handleSpotlightMove } from '../utils/scrollManager';
import { TECH_STACK, TechItem } from '../data/artifuraData';

export const Stack: React.FC = () => {
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(TECH_STACK[0]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Languages', 'Frameworks', 'Cloud & Infra', 'Data & AI'];

  const filteredTech = activeCategory === 'All'
    ? TECH_STACK
    : TECH_STACK.filter((t) => t.category === activeCategory);

  const activeTech = hoveredTech || selectedTech;

  return (
    <section className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center pb-16 md:pb-20 bg-transparent overflow-hidden relative" id="stack">
      {/* Section Divider */}
      <SectionDivider
        number="03"
        label="STACK"
        targetId="stack"
        nextId="work"
      />

      {/* Section Header */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-[#ffe08d] font-semibold font-mono">
            03 / STACK
          </span>
          <span className="h-[1px] w-8 bg-[#ffe08d]/40"></span>
          <span className="text-[11px] uppercase tracking-widest text-[#99907e] font-mono">
            Technologies
          </span>
        </div>
        <p className="text-xs uppercase tracking-widest text-[#c6c6cf] font-mono">
          Modern technologies for web, mobile, and cloud software.
        </p>
      </div>

      {/* Infinite horizontal ticker strip with hover inspection */}
      <div className="relative w-full overflow-hidden py-3 sm:py-4 bg-[#0e0e0f] border-y border-[#4d4637]/30 group">
        <div className="animate-marquee-infinite group-hover:[animation-play-state:paused] text-[#c6c6cf] text-xs uppercase tracking-widest select-none">
          <div className="flex items-center gap-6 sm:gap-8 md:gap-10 shrink-0 pr-6 sm:pr-8 md:pr-10">
            {TECH_STACK.map((tech) => (
              <React.Fragment key={tech.name}>
                <span
                  onMouseEnter={() => setHoveredTech(tech)}
                  onMouseLeave={() => setHoveredTech(null)}
                  onClick={() => setSelectedTech(selectedTech?.name === tech.name ? null : tech)}
                  className={`transition-all duration-200 cursor-pointer font-medium hover:underline underline-offset-4 ${activeTech?.name === tech.name ? 'text-[#ffe08d] font-bold scale-105' : 'hover:text-[#ffe08d]'
                    }`}
                  title={`${tech.name} (${tech.category})`}
                >
                  {tech.name}
                </span>
                <span className="text-[#ffe08d]">•</span>
              </React.Fragment>
            ))}
          </div>

          {/* Loop duplicate */}
          <div aria-hidden="true" className="flex items-center gap-6 sm:gap-8 md:gap-10 shrink-0 pr-6 sm:pr-8 md:pr-10">
            {TECH_STACK.map((tech) => (
              <React.Fragment key={`${tech.name}-dup`}>
                <span
                  onMouseEnter={() => setHoveredTech(tech)}
                  onMouseLeave={() => setHoveredTech(null)}
                  onClick={() => setSelectedTech(selectedTech?.name === tech.name ? null : tech)}
                  className={`transition-all duration-200 cursor-pointer font-medium hover:underline underline-offset-4 ${activeTech?.name === tech.name ? 'text-[#ffe08d] font-bold scale-105' : 'hover:text-[#ffe08d]'
                    }`}
                >
                  {tech.name}
                </span>
                <span className="text-[#ffe08d]">•</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Technology Inspector */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mt-8 sm:mt-10">
        <div
          onMouseMove={handleSpotlightMove}
          className="scroll-reveal card-interactive spotlight-card p-4 sm:p-6 bg-[#181819] border border-[#4d4637]/40 rounded-2xl space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-[#ffe08d]" />
              <span className="text-xs uppercase font-mono tracking-wider text-[#e5e2e3] font-semibold">
                Technology Stack
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`btn-interactive px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-mono cursor-pointer ${activeCategory === cat
                      ? 'bg-[#ffe08d] text-[#3d2f00] font-semibold shadow-[0_0_12px_rgba(255,224,141,0.35)]'
                      : 'bg-[#0e0e0f] text-[#c6c6cf] hover:text-[#e5e2e3] border border-[#4d4637]/40 hover:border-[#ffe08d]/50'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Technology Nodes Grid */}
          <div className="cards-focus-group grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5 pt-2">
            {filteredTech.map((tech) => {
              const isActive = activeTech?.name === tech.name;
              const isSelected = selectedTech?.name === tech.name;

              return (
                <button
                  key={tech.name}
                  onMouseEnter={() => setHoveredTech(tech)}
                  onMouseLeave={() => setHoveredTech(null)}
                  onClick={() => setSelectedTech(isSelected ? null : tech)}
                  className={`card-focus-item-sm btn-interactive p-2.5 sm:p-3 text-left rounded-xl border text-xs font-mono flex flex-col justify-between min-h-[72px] sm:h-20 cursor-pointer transition-all duration-200 ${isActive
                      ? 'bg-[#252425] border-[#ffe08d] text-[#ffe08d] shadow-[0_0_18px_rgba(255,224,141,0.3)] scale-[1.02]'
                      : 'bg-[#0e0e0f] border-[#4d4637]/30 text-[#e5e2e3] hover:border-[#ffe08d]/60 hover:bg-[#1a191a]'
                    }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="font-semibold truncate">{tech.name}</span>
                    <span className="text-[9px] text-[#99907e] uppercase shrink-0 ml-1">{tech.category}</span>
                  </div>
                  <span className="text-[10px] text-[#99907e] truncate w-full">
                    {tech.role}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Details Stance Card Area */}
          <div className="mt-5 w-full min-h-[140px] relative flex flex-col justify-center">
            {activeTech ? (
              <div
                key={activeTech.name}
                className="w-full p-4 sm:p-5 bg-[#0e0e0f] border border-[#ffe08d]/60 rounded-xl flex flex-col justify-between gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.7)] ring-1 ring-[#ffe08d]/25"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base md:text-lg font-semibold text-[#ffe08d] font-mono">
                      {activeTech.name}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#2a2a2b] text-[#c6c6cf] border border-[#4d4637]/40">
                      {activeTech.category}
                    </span>
                  </div>

                  {selectedTech && (
                    <button
                      onClick={() => setSelectedTech(null)}
                      className="btn-interactive p-1.5 rounded-lg bg-[#1a191a] hover:bg-[#252425] border border-[#4d4637]/40 hover:border-[#ffe08d]/60 text-[#99907e] hover:text-[#ffe08d] transition-colors shrink-0 cursor-pointer"
                      aria-label="Dismiss detail"
                      title="Clear selection"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-lg bg-[#141415] border border-[#4d4637]/30 flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-[#99907e] font-mono block mb-1">
                      Role in Stack:
                    </span>
                    <span className="text-[#e5e2e3] font-medium leading-snug">
                      {activeTech.role}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#141415] border border-[#4d4637]/30 flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-[#99907e] font-mono block mb-1">
                      Application:
                    </span>
                    <span className="text-[#c6c6cf] leading-snug">
                      {activeTech.provenance}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full p-4 sm:p-5 bg-[#0e0e0f]/80 border border-dashed border-[#4d4637]/40 rounded-xl flex items-center justify-center text-xs font-mono text-[#99907e]">
                <span>Select any technology above to view details.</span>
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  );
};
