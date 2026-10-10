import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { smoothScrollTo, resetScrollToTop } from '../utils/scrollManager';
import { ArtifuraIntro, hasIntroPlayed, markIntroAsPlayed } from './ArtifuraIntro';

interface HomeIntroProps {
  onAutoTransition?: () => void;
  onIntroComplete?: () => void;
}

export const HomeIntro: React.FC<HomeIntroProps> = ({ onAutoTransition, onIntroComplete }) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isIntroComplete, setIsIntroComplete] = useState<boolean>(() => hasIntroPlayed());

  const handleProceed = () => {
    if (hasInteracted) return;
    setHasInteracted(true);
    markIntroAsPlayed();
    setIsIntroComplete(true);
    onIntroComplete?.();

    smoothScrollTo('#hero', { offset: -80, duration: 1.35 });
    onAutoTransition?.();
  };

  const handleIntroComplete = () => {
    setIsIntroComplete(true);
    markIntroAsPlayed();
    onIntroComplete?.();
    // User stays on home section with no forced timeout constraint
  };

  useEffect(() => {
    resetScrollToTop();
  }, []);

  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[640px] bg-transparent overflow-hidden select-none z-30 p-0 m-0"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[720px] h-[240px] sm:h-[380px] bg-[#ffe08d]/10 rounded-full blur-[80px] sm:blur-[140px] pointer-events-none animate-ambient" />

      {/* Atmospheric architectural blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffe08d 1px, transparent 1px), linear-gradient(to bottom, #ffe08d 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />

      {/* Reference Corner HUD Elements & Markings */}
      {/* Top-Left: ARTIFURA // TECHNOLOGY COMPANY */}
      <div className="absolute top-6 sm:top-8 left-6 sm:left-12 z-20 hidden xs:flex items-start gap-2.5 font-mono text-[10px] sm:text-xs text-[#a38c53] tracking-widest pointer-events-none select-none">
        <span className="w-3.5 sm:w-5 h-[1.5px] bg-[#a38c53] mt-1.5 shrink-0" />
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-[#ffe08d]/90">ARTIFURA //</span>
          <span className="text-[#887e6d] text-[9px] sm:text-[10px]">TECHNOLOGY COMPANY</span>
        </div>
      </div>

      {/* Top-Right: EST. 2026 */}
      <div className="absolute top-6 sm:top-8 right-6 sm:right-12 z-20 hidden xs:flex items-center gap-2.5 font-mono text-[10px] sm:text-xs text-[#887e6d] tracking-widest pointer-events-none select-none">
        <span className="w-3.5 sm:w-5 h-[1.5px] bg-[#a38c53] shrink-0" />
        <span>EST. 2026</span>
      </div>

      {/* Bottom-Left: IDEAS / TECHNOLOGY / CREATION / FUTURE */}
      <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 z-20 hidden md:flex items-start gap-2.5 font-mono text-[9px] sm:text-[10px] text-[#887e6d] tracking-widest leading-relaxed pointer-events-none select-none">
        <span className="w-3.5 sm:w-5 h-[1.5px] bg-[#a38c53] mt-1.5 shrink-0" />
        <div className="flex flex-col text-[9px] text-[#887e6d]">
          <span>IDEAS</span>
          <span>TECHNOLOGY</span>
          <span>CREATION</span>
          <span>FUTURE</span>
        </div>
      </div>

      {/* Bottom-Right: Reticle viewfinder HUD */}
      <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-12 z-20 hidden md:flex items-center gap-2.5 font-mono pointer-events-none select-none">
        <span className="w-10 sm:w-16 h-[1px] bg-[#a38c53]/60 shrink-0" />
        <div className="relative w-5 h-5 flex items-center justify-center border border-[#a38c53]/70 rounded-[2px]">
          <div className="w-1 h-1 bg-[#ffe08d] rounded-full" />
        </div>
      </div>

      {/* Atmospheric Faint Crosshair Reticles (+) Matching Reference */}
      <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden opacity-30">
        <span className="absolute top-[26%] left-[18%] font-mono text-xs text-[#ffe08d]/30">+</span>
        <span className="absolute top-[24%] right-[22%] font-mono text-xs text-[#ffe08d]/30">+</span>
        <span className="absolute bottom-[30%] left-[22%] font-mono text-xs text-[#ffe08d]/30">+</span>
        <span className="absolute bottom-[32%] right-[26%] font-mono text-xs text-[#ffe08d]/30">+</span>
      </div>

      {/* Centerpiece: Cinematic Physical Typographic Intro occupying the FULL viewport from top=0 */}
      <div className="absolute inset-0 z-20 w-full h-full">
        <ArtifuraIntro
          onIntroComplete={handleIntroComplete}
          className="w-full h-full"
        />
      </div>

      {/* Bottom Explore Trigger */}
      <div
        className={`absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2.5 transition-all duration-700 ${isIntroComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
      >
        <button
          onClick={handleProceed}
          className="btn-interactive px-5 py-2 rounded-full bg-[#181819]/90 backdrop-blur-sm border border-[#4d4637]/40 hover:border-[#ffe08d]/70 flex items-center gap-2 text-xs font-mono text-[#ffe08d] cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(255,224,141,0.2)] transition-all duration-300 group"
          aria-label="Explore Portfolio"
        >
          <span>EXPLORE</span>
          <ArrowDown size={13} className="group-hover:translate-y-0.5 transition-transform duration-200" />
        </button>
      </div>
    </section>
  );
};
