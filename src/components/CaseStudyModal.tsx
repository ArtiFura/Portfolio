import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, CheckCircle2, Server } from 'lucide-react';
import { CaseStudy, ClickOrigin } from '../data/artifuraData';
import { setScrollPaused } from '../utils/scrollManager';

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  origin?: ClickOrigin | null;
  onClose: () => void;
  onInquire: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  caseStudy,
  origin,
  onClose,
  onInquire,
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

  // Lock background scroll, handle Escape key, and isolate wheel/touch events from page scrollers
  useEffect(() => {
    if (!caseStudy) return;
    setScrollPaused(true);
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    // Isolate native wheel and touch events so Lenis/SnapNavigator on window never intercept modal scrolling
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
  }, [caseStudy, onClose]);

  if (!caseStudy) return null;
  if (typeof document === 'undefined') return null;

  // Forward wheel scrolling from header or footer to the scrollable content body
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
      aria-label={caseStudy.title}
    >
      <div 
        ref={dialogRef}
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        style={originStyle}
        onWheel={handleDialogWheel}
        className="relative w-full max-w-3xl my-auto flex flex-col max-h-[calc(100dvh-1.25rem)] xs:max-h-[calc(100dvh-2rem)] sm:max-h-[min(90vh,840px)] bg-[#1c1b1c] border border-[#ffe08d]/50 rounded-xl sm:rounded-2xl shadow-[0_24px_85px_rgba(0,0,0,0.95)] overflow-hidden animate-popup-origin ring-1 ring-[#ffe08d]/20"
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
              Case Study: {caseStudy.tag}
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
          {/* Title & summary */}
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#e5e2e3] tracking-tight mb-2">
              {caseStudy.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-[#c6c6cf] leading-relaxed">
              {caseStudy.description}
            </p>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 py-2.5 sm:py-3 border-y border-[#4d4637]/30">
            {caseStudy.metrics.map((metric, i) => (
              <div key={i} className="card-interactive p-3 sm:p-3.5 bg-[#0e0e0f] rounded-lg border border-[#4d4637]/30 hover:border-[#ffe08d]/40">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#99907e] block">
                  {metric.label}
                </span>
                <span className="text-lg sm:text-xl md:text-2xl font-mono font-bold text-[#ffe08d] my-0.5 sm:my-1 block">
                  {metric.value}
                </span>
                <span className="text-[11px] text-[#c6c6cf] leading-tight block">
                  {metric.detail}
                </span>
              </div>
            ))}
          </div>

          {/* Problem & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="card-interactive p-3.5 sm:p-4 bg-[#131314] rounded-lg border border-[#4d4637]/30 space-y-1.5 hover:border-[#ffe08d]/40">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#ffb4ab] font-semibold flex items-center gap-1.5">
                Problem
              </span>
              <p className="text-xs text-[#c6c6cf] leading-relaxed">
                {caseStudy.problem}
              </p>
            </div>

            <div className="card-interactive p-3.5 sm:p-4 bg-[#131314] rounded-lg border border-[#ffe08d]/30 space-y-1.5 hover:border-[#ffe08d]/50">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#ffe08d] font-semibold flex items-center gap-1.5">
                Solution
              </span>
              <p className="text-xs text-[#c6c6cf] leading-relaxed">
                {caseStudy.solution}
              </p>
            </div>
          </div>

          {/* Architecture Specification */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#ffe08d] font-semibold">
              Tech Stack &amp; Architecture
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {caseStudy.architecture.map((item, idx) => (
                <div key={idx} className="card-interactive flex items-start gap-2.5 p-2.5 bg-[#0e0e0f] rounded-lg border border-[#4d4637]/25 text-xs text-[#e5e2e3] hover:border-[#ffe08d]/40">
                  <Server size={14} className="text-[#ffe08d] shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Production Results */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#ffe08d] font-semibold">
              Key Results
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {caseStudy.results.map((res, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-[#0e0e0f]/60 rounded border border-[#4d4637]/20 text-xs text-[#c6c6cf]">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span className="leading-snug">{res}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pinned Sticky Footer - Always 100% visible */}
        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-3.5 border-t border-[#4d4637]/40 bg-[#131314]">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {caseStudy.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded bg-[#0e0e0f] border border-[#4d4637]/40 text-[#ffe08d] text-[10px] sm:text-xs">
                {tag}
              </span>
            ))}
          </div>

          <button
            onClick={() => {
              onClose();
              onInquire();
            }}
            className="btn-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ffe08d] text-[#3d2f00] text-xs uppercase px-5 py-2.5 sm:py-3 rounded-lg font-semibold tracking-wider cursor-pointer shadow-md hover:bg-[#ffe7a3] transition-colors shrink-0"
          >
            <span>Start a Project</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
