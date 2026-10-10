import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, Clock, Users, ArrowRight } from 'lucide-react';
import { Capability, ClickOrigin } from '../data/artifuraData';
import { setScrollPaused } from '../utils/scrollManager';

interface CapabilityModalProps {
  capability: Capability | null;
  origin?: ClickOrigin | null;
  onClose: () => void;
  onSelectService: (serviceTitle: string) => void;
}

export const CapabilityModal: React.FC<CapabilityModalProps> = ({
  capability,
  origin,
  onClose,
  onSelectService,
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
    if (!capability) return;
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
  }, [capability, onClose]);

  if (!capability) return null;
  if (typeof document === 'undefined') return null;

  const handleInquire = () => {
    onSelectService(capability.title);
    onClose();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
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
      aria-label={capability.title}
    >
      <div 
        ref={dialogRef}
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        style={originStyle}
        onWheel={handleDialogWheel}
        className="relative w-full max-w-2xl my-auto flex flex-col max-h-[calc(100dvh-1.25rem)] xs:max-h-[calc(100dvh-2rem)] sm:max-h-[min(90vh,820px)] bg-[#1c1b1c] border border-[#ffe08d]/50 rounded-xl sm:rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.95)] overflow-hidden animate-popup-origin ring-1 ring-[#ffe08d]/20"
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
              {capability.category}
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
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#e5e2e3] tracking-tight mb-2">
              {capability.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-[#c6c6cf] leading-relaxed">
              {capability.description}
            </p>
          </div>

          {/* Quick specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 py-2.5 sm:py-3 border-y border-[#4d4637]/30 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#e5e2e3]">
              <Clock size={15} className="text-[#ffe08d] shrink-0" />
              <span className="text-[#99907e]">Timeline:</span>
              <span className="text-[#ffe08d] font-semibold">{capability.timeline}</span>
            </div>
            <div className="flex items-center gap-2 text-[#e5e2e3]">
              <Users size={15} className="text-[#ffe08d] shrink-0" />
              <span className="text-[#99907e]">Team:</span>
              <span>Dedicated Squad</span>
            </div>
          </div>

          {/* Core Deliverables */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#ffe08d] font-semibold mb-2.5 font-mono">
              Key Deliverables
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {capability.deliverables.map((item, idx) => (
                <div key={idx} className="card-interactive flex items-start gap-2.5 p-2.5 sm:p-3 rounded-lg bg-[#0e0e0f] border border-[#4d4637]/30 hover:border-[#ffe08d]/40">
                  <CheckCircle size={15} className="text-[#ffe08d] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#e5e2e3] leading-normal">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Architectural Approach */}
          <div className="card-interactive p-3.5 sm:p-4 rounded-lg bg-[#131314] border border-[#4d4637]/40 space-y-1.5 hover:border-[#ffe08d]/40">
            <h4 className="text-xs uppercase tracking-widest text-[#ffe08d] font-semibold font-mono">
              Our Approach
            </h4>
            <p className="text-xs text-[#c6c6cf] leading-relaxed">
              {capability.architectureDetails}
            </p>
          </div>

          {/* Ideal for */}
          <div className="p-3 bg-[#0e0e0f]/60 rounded-lg border border-[#4d4637]/20">
            <span className="text-[10px] sm:text-xs text-[#99907e] uppercase tracking-wider font-mono block mb-1">
              Best For:
            </span>
            <p className="text-xs text-[#e5e2e3]">
              {capability.idealFor}
            </p>
          </div>
        </div>

        {/* Pinned Sticky Footer - Always 100% visible */}
        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-3.5 border-t border-[#4d4637]/40 bg-[#131314]">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[#99907e]">
            <span className="text-[#ffe08d]">{capability.tags.join(' • ')}</span>
          </div>

          <button
            onClick={handleInquire}
            className="btn-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ffe08d] text-[#3d2f00] text-xs uppercase px-5 py-2.5 sm:py-3 rounded-lg font-semibold tracking-wider cursor-pointer shadow-md hover:bg-[#ffe7a3] transition-colors shrink-0"
          >
            <span>Get in Touch</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
