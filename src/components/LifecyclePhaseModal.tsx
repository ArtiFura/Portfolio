import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, Clock, ShieldCheck, FileText, ArrowRight, Sparkles, Users } from 'lucide-react';
import { LifecyclePhase, ClickOrigin } from '../data/artifuraData';
import { setScrollPaused, smoothScrollTo } from '../utils/scrollManager';

interface LifecyclePhaseModalProps {
  phase: LifecyclePhase | null;
  origin?: ClickOrigin | null;
  onClose: () => void;
}

export const LifecyclePhaseModal: React.FC<LifecyclePhaseModalProps> = ({
  phase,
  origin,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollBodyRef = useRef<HTMLDivElement>(null);

  // Compute origin translation offset relative to viewport center
  const originStyle = useMemo(() => {
    if (!origin || typeof window === 'undefined') {
      return {
        '--origin-dx': '0px',
        '--origin-dy': '0px',
      } as React.CSSProperties;
    }
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    return {
      '--origin-dx': `${Math.round(origin.x - centerX)}px`,
      '--origin-dy': `${Math.round(origin.y - centerY)}px`,
    } as React.CSSProperties;
  }, [origin]);

  // Lock scroll, handle Escape key, and isolate native wheel/touch events
  useEffect(() => {
    if (!phase) return;
    setScrollPaused(true);
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    const dialogEl = dialogRef.current;
    const stopPropagationNative = (e: Event) => {
      e.stopPropagation();
    };

    if (dialogEl) {
      dialogEl.addEventListener('wheel', stopPropagationNative, { passive: true });
      dialogEl.addEventListener('touchmove', stopPropagationNative, { passive: true });
    }

    return () => {
      setScrollPaused(false);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      if (dialogEl) {
        dialogEl.removeEventListener('wheel', stopPropagationNative);
        dialogEl.removeEventListener('touchmove', stopPropagationNative);
      }
    };
  }, [phase, onClose]);

  if (!phase) return null;
  if (typeof document === 'undefined') return null;

  const handleInquireStage = () => {
    onClose();
    smoothScrollTo('#contact', { offset: -80 });
  };

  const handleDialogWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (scrollBodyRef.current && !scrollBodyRef.current.contains(e.target as Node)) {
      scrollBodyRef.current.scrollTop += e.deltaY;
    }
  };

  return createPortal(
    <div 
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain p-2.5 xs:p-3 sm:p-5 md:p-6 flex items-center justify-center bg-black/85 backdrop-blur-md animate-backdrop-fade"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={phase.title}
    >
      <div 
        ref={dialogRef}
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        style={originStyle}
        onWheel={handleDialogWheel}
        className="relative w-full max-w-2xl my-auto flex flex-col max-h-[calc(100dvh-1.25rem)] xs:max-h-[calc(100dvh-2rem)] sm:max-h-[min(90vh,820px)] bg-[#1c1b1c] border border-[#ffe08d]/50 rounded-xl sm:rounded-2xl shadow-[0_24px_85px_rgba(0,0,0,0.95)] overflow-hidden animate-popup-origin ring-1 ring-[#ffe08d]/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Sticky Header - Always 100% visible */}
        <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 border-b border-[#4d4637]/40 bg-[#131314]">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffe08d] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffe08d]"></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#ffe08d] font-semibold truncate">
              Process // {phase.title}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="btn-interactive p-1.5 rounded-lg text-[#c6c6cf] hover:text-[#ffe08d] hover:bg-[#2a2a2b] cursor-pointer shrink-0 transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body with Custom Scrollbar & Lenis Isolation */}
        <div 
          ref={scrollBodyRef}
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain modal-scroll p-4 sm:p-6 md:p-7 space-y-4 sm:space-y-5"
        >
          {/* Phase Title & Description */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ffe08d] mb-1">
              <span>STAGE {phase.number}</span>
              <span>•</span>
              <span className="text-[#99907e] uppercase">{phase.footerLabel}</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#e5e2e3] tracking-tight mb-2">
              {phase.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-[#c6c6cf] leading-relaxed">
              {phase.description}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 py-2.5 sm:py-3 border-y border-[#4d4637]/30 text-xs font-mono">
            <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-lg bg-[#0e0e0f] border border-[#4d4637]/30">
              <Clock size={16} className="text-[#ffe08d] shrink-0" />
              <div>
                <span className="text-[#99907e] block text-[10px] uppercase">Timeline:</span>
                <span className="text-[#ffe08d] font-semibold">{phase.duration}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-lg bg-[#0e0e0f] border border-[#4d4637]/30">
              <Users size={16} className="text-[#ffe08d] shrink-0" />
              <div>
                <span className="text-[#99907e] block text-[10px] uppercase">Team:</span>
                <span className="text-[#e5e2e3] font-semibold">{phase.squadFocus || 'Dedicated Team'}</span>
              </div>
            </div>
          </div>

          {/* Key Deliverables */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#ffe08d] font-semibold mb-2.5 font-mono flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#ffe08d]" />
              Key Deliverables
            </h4>
            <div className="space-y-2">
              {phase.deliverables.map((item, idx) => (
                <div key={idx} className="card-interactive flex items-start gap-2.5 p-2.5 sm:p-3 rounded-lg bg-[#0e0e0f] border border-[#4d4637]/30 hover:border-[#ffe08d]/40">
                  <CheckCircle size={15} className="text-[#ffe08d] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#e5e2e3] leading-normal">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Milestone Artifact */}
          <div className="card-interactive p-3.5 sm:p-4 rounded-xl bg-[#131314] border border-[#ffe08d]/40 flex items-start gap-3 shadow-md">
            <div className="p-2 rounded-lg bg-[#ffe08d]/10 border border-[#ffe08d]/30 text-[#ffe08d] shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#99907e] block">
                Main Milestone:
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#ffe08d] font-mono block mb-1">
                {phase.keyArtifact}
              </span>
              <p className="text-xs text-[#c6c6cf]">
                {phase.methodology || 'Tested, documented, and ready for production with full client ownership.'}
              </p>
            </div>
          </div>

          {/* Quality Criteria */}
          {phase.governanceGates && phase.governanceGates.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#ffe08d] font-semibold mb-2 font-mono flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                Quality Criteria
              </h4>
              <div className="p-3 sm:p-3.5 rounded-lg bg-[#0e0e0f] border border-[#4d4637]/30 space-y-1.5 text-xs text-[#c6c6cf]">
                {phase.governanceGates.map((gate, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#ffe08d] font-mono shrink-0">0{i + 1}.</span>
                    <span>{gate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pinned Sticky Footer - Always 100% visible */}
        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-3.5 border-t border-[#4d4637]/40 bg-[#131314]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#99907e]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Quality Assured</span>
          </div>

          <button
            onClick={handleInquireStage}
            className="btn-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ffe08d] text-[#3d2f00] text-xs uppercase px-5 py-2.5 sm:py-3 rounded-lg font-semibold tracking-wider cursor-pointer shadow-md hover:bg-[#ffe7a3] transition-colors shrink-0"
          >
            <span>Discuss This Stage</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
