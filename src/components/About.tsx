import React from 'react';
import { CheckCircle2, Calendar, Zap, Terminal } from 'lucide-react';
import { SectionDivider } from './SectionDivider';
import { handleSpotlightMove } from '../utils/scrollManager';

export const About: React.FC = () => {
  return (
    <section className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center pb-16 md:pb-24 bg-transparent relative" id="about">
      {/* Section Divider */}
      <SectionDivider
        number="01"
        label="ABOUT"
        targetId="about"
        nextId="services"
      />
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 w-full">

        {/* Section Label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs uppercase tracking-wider text-[#ffe08d] font-semibold font-mono">
            01 / ABOUT
          </span>
          <span className="h-[1px] w-12 bg-[#ffe08d]/40"></span>
        </div>

        {/* Large Editorial Statement */}
        <div className="scroll-reveal max-w-4xl mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-4xl md:text-[48px] md:leading-[56px] text-[#e5e2e3] font-medium tracking-tight leading-snug">
            “Technology should make things simpler, not more complicated.”
          </h2>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">

          {/* Left Column */}
          <div className="scroll-reveal delay-75 lg:col-span-5 flex flex-col gap-6">
            <p className="text-base md:text-lg text-[#c6c6cf] leading-relaxed">
              We design and build clean, scalable digital products focused on usability, speed, and real business results.
            </p>

            <div
              onMouseMove={handleSpotlightMove}
              className="card-interactive spotlight-card p-5 sm:p-6 bg-[#0e0e0f] border border-[#4d4637]/40 rounded-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#ffe08d]/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

              <div className="flex items-center gap-3 mb-3 relative z-10">
                <CheckCircle2 size={20} className="text-[#ffe08d]" />
                <span className="text-xs uppercase tracking-wider text-[#e5e2e3] font-semibold">
                  Engineering Principles
                </span>
              </div>

              <p className="text-xs md:text-sm text-[#c6c6cf] relative z-10 leading-relaxed">
                We eliminate technical bloat. Every line of code, cloud configuration, and interface detail is built with clarity and intention.
              </p>
            </div>
          </div>

          {/* Right Column Cards */}
          <div className="cards-focus-group lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 py-2 sm:py-3">

            {/* Card 1 */}
            <div
              onMouseMove={handleSpotlightMove}
              className="card-focus-item card-interactive spotlight-card p-5 sm:p-6 bg-[#181819] border border-[#4d4637]/40 rounded-xl flex flex-col justify-between h-full group"
            >
              <div className="flex flex-col gap-3 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-[#2a2a2b] flex items-center justify-center text-[#ffe08d] mb-1 group-hover:bg-[#ffe08d] group-hover:text-[#3d2f00] transition-all duration-300">
                  <Calendar size={18} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ffe08d] font-semibold">
                  EST. 2026
                </span>
                <h3 className="text-lg leading-snug text-[#e5e2e3] font-semibold group-hover:text-[#ffe08d] transition-colors duration-300">
                  Global Reach
                </h3>
              </div>
              <p className="text-xs text-[#c6c6cf] mt-4 leading-relaxed relative z-10">
                Based in India, building software for clients worldwide.
              </p>
            </div>

            {/* Card 2 */}
            <div
              onMouseMove={handleSpotlightMove}
              className="card-focus-item card-interactive spotlight-card p-5 sm:p-6 bg-[#181819] border border-[#4d4637]/40 rounded-xl flex flex-col justify-between h-full group"
            >
              <div className="flex flex-col gap-3 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-[#2a2a2b] flex items-center justify-center text-[#ffe08d] mb-1 group-hover:bg-[#ffe08d] group-hover:text-[#3d2f00] transition-all duration-300">
                  <Zap size={18} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ffe08d] font-semibold">
                  APPROACH
                </span>
                <h3 className="text-lg leading-snug text-[#e5e2e3] font-semibold group-hover:text-[#ffe08d] transition-colors duration-300">
                  Simple &amp; Scalable
                </h3>
              </div>
              <p className="text-xs text-[#c6c6cf] mt-4 leading-relaxed relative z-10">
                Clean architecture, reliable code, and zero unnecessary complexity.
              </p>
            </div>

            {/* Card 3 */}
            <div
              onMouseMove={handleSpotlightMove}
              className="card-focus-item card-interactive spotlight-card p-5 sm:p-6 bg-[#181819] border border-[#4d4637]/40 rounded-xl flex flex-col justify-between h-full group"
            >
              <div className="flex flex-col gap-3 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-[#2a2a2b] flex items-center justify-center text-[#ffe08d] mb-1 group-hover:bg-[#ffe08d] group-hover:text-[#3d2f00] transition-all duration-300">
                  <Terminal size={18} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ffe08d] font-semibold">
                  CAPABILITIES
                </span>
                <h3 className="text-lg leading-snug text-[#e5e2e3] font-semibold group-hover:text-[#ffe08d] transition-colors duration-300">
                  Full-Stack Focus
                </h3>
              </div>
              <p className="text-xs text-[#c6c6cf] mt-4 leading-relaxed relative z-10">
                Web apps, mobile solutions, UI/UX design, and AI automation.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
