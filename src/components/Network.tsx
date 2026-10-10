import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { TARGET_AUDIENCES } from '../data/artifuraData';
import { SectionDivider } from './SectionDivider';
import { handleSpotlightMove } from '../utils/scrollManager';

interface NetworkProps {
  onOpenEstimator: () => void;
}

export const Network: React.FC<NetworkProps> = ({ onOpenEstimator }) => {
  const [hoveredAudience, setHoveredAudience] = useState<string | null>(null);
  const [selectedAudience, setSelectedAudience] = useState<string | null>('Businesses');

  const activeAudienceName = hoveredAudience || selectedAudience;
  const activeAudienceObj = TARGET_AUDIENCES.find((a) => a.label === activeAudienceName);

  return (
    <section className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center pb-16 md:pb-24 bg-transparent relative" id="network">
      {/* Section Divider */}
      <SectionDivider
        number="06"
        label="NETWORK"
        targetId="network"
        nextId="contact"
      />
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 text-center flex flex-col items-center w-full">

        {/* Network Tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs uppercase tracking-wider text-[#ffe08d] font-semibold font-mono">
            06 / NETWORK
          </span>
        </div>

        {/* Section Headline */}
        <h2 className="scroll-reveal text-2xl sm:text-4xl md:text-[44px] md:leading-[52px] font-sans text-[#e5e2e3] font-semibold tracking-tight uppercase max-w-3xl mb-3 sm:mb-4">
          We Partner With Ambitious Teams.
        </h2>

        {/* Subtitle */}
        <p className="scroll-reveal delay-75 text-sm sm:text-base md:text-lg text-[#c6c6cf] max-w-2xl mb-8 sm:mb-10">
          From early-stage startups to established organizations, we help build reliable digital products.
        </p>

        {/* Category Chips with Hover Detection */}
        <div className="cards-focus-group scroll-reveal delay-150 flex flex-wrap justify-center gap-2 sm:gap-2.5 max-w-3xl mb-6">
          {TARGET_AUDIENCES.map((item) => {
            const isActive = activeAudienceName === item.label;
            const isSelected = selectedAudience === item.label;

            return (
              <button
                key={item.label}
                onMouseEnter={() => setHoveredAudience(item.label)}
                onMouseLeave={() => setHoveredAudience(null)}
                onClick={() => setSelectedAudience(isSelected ? null : item.label)}
                className={`card-focus-item-sm btn-interactive px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs uppercase tracking-wider cursor-pointer transition-all duration-200 ${isActive
                    ? 'bg-[#ffe08d] text-[#3d2f00] font-bold shadow-[0_0_24px_rgba(255,224,141,0.45)] scale-105'
                    : 'bg-[#181819] border border-[#4d4637]/40 text-[#e5e2e3] hover:border-[#ffe08d]/80 hover:text-[#ffe08d] hover:bg-[#222122]'
                  }`}
                title={`${item.label}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Audience Detail Container */}
        <div className="w-full max-w-xl min-h-[140px] sm:min-h-[160px] mb-8 relative flex flex-col justify-center">
          {activeAudienceObj ? (
            <div
              key={activeAudienceObj.label}
              onMouseMove={handleSpotlightMove}
              className="card-interactive spotlight-card w-full p-4 sm:p-5 md:p-6 bg-[#181819] border border-[#ffe08d]/60 rounded-2xl flex flex-col justify-between text-center shadow-[0_16px_48px_rgba(0,0,0,0.7)] ring-1 ring-[#ffe08d]/25"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-[#ffe08d] font-mono font-bold">
                  {activeAudienceObj.label}
                </span>
              </div>

              <div className="flex items-center justify-center px-2 py-2">
                <p className="text-sm text-[#e5e2e3] leading-snug">
                  {activeAudienceObj.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#4d4637]/30 flex items-center justify-center">
                <button
                  onClick={onOpenEstimator}
                  className="btn-interactive inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#ffe08d]/10 hover:bg-[#ffe08d]/20 border border-[#ffe08d]/40 text-xs font-mono text-[#ffe08d] cursor-pointer"
                >
                  <span>Estimate Scope</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full p-5 sm:p-6 bg-[#181819]/50 border border-dashed border-[#4d4637]/40 rounded-2xl flex items-center justify-center text-center">
              <p className="text-xs font-mono text-[#99907e]">
                Select a category above to view details.
              </p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="scroll-reveal delay-225 pt-4 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#contact"
            className="text-interactive inline-flex items-center gap-2 text-xl md:text-2xl uppercase text-[#ffe08d] hover:text-[#e5c365] tracking-tight font-semibold group cursor-pointer"
          >
            <span>Start a Project</span>
            <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </a>

          <span className="text-[#4d4637] hidden sm:inline">|</span>

          <button
            onClick={onOpenEstimator}
            className="btn-interactive px-4 py-2 rounded-lg bg-[#181819] border border-[#4d4637]/40 hover:border-[#ffe08d]/60 text-xs uppercase font-mono tracking-wider text-[#99907e] hover:text-[#ffe08d]"
          >
            Project Estimator
          </button>
        </div>

      </div>
    </section>
  );
};

export default Network;
