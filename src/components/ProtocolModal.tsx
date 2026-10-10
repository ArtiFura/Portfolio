import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, Calculator, ArrowRight } from 'lucide-react';
import { setScrollPaused } from '../utils/scrollManager';

interface ProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEstimator: () => void;
}

export const ProtocolModal: React.FC<ProtocolModalProps> = ({ isOpen, onClose, onOpenEstimator }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

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
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain p-2.5 xs:p-3 sm:p-5 flex items-center justify-center bg-black/85 backdrop-blur-md animate-backdrop-fade"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Client Engagement Protocol"
    >
      <div 
        ref={dialogRef}
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        onWheel={handleDialogWheel}
        className="relative w-full max-w-lg my-auto flex flex-col max-h-[calc(100dvh-1.25rem)] xs:max-h-[calc(100dvh-2rem)] sm:max-h-[min(90vh,700px)] bg-[#1c1b1c] border border-[#ffe08d]/50 rounded-xl sm:rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.9)] overflow-hidden animate-popup-origin ring-1 ring-[#ffe08d]/20"
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
              Client Engagement Protocol
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
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain modal-scroll p-4 sm:p-6 space-y-4 text-sm text-[#c6c6cf]"
        >
          <div className="p-3.5 sm:p-4 bg-[#0e0e0f] rounded-lg border border-[#4d4637]/30 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between items-center text-[#e5e2e3]">
              <span className="text-[#99907e]">Status:</span>
              <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                <ShieldCheck size={14} /> Open for new projects
              </span>
            </div>
            <div className="flex justify-between items-center text-[#e5e2e3]">
              <span className="text-[#99907e]">Location:</span>
              <span>Tamil Nadu, India (Worldwide)</span>
            </div>
            <div className="flex justify-between items-center text-[#e5e2e3]">
              <span className="text-[#99907e]">Response Time:</span>
              <span className="text-[#ffe08d]">Within 24 hours</span>
            </div>
            <div className="flex justify-between items-center text-[#e5e2e3]">
              <span className="text-[#99907e]">Availability:</span>
              <span>Q1–Q2 2026</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#ffe08d] font-semibold mb-2">
              Confidentiality &amp; NDA
            </h4>
            <p className="text-xs leading-relaxed text-[#c6c6cf]">
              We work under mutual non-disclosure agreements with startups, growing companies, and established teams. All discussions and codebases remain strictly confidential with full intellectual property transfer upon delivery.
            </p>
          </div>
        </div>

        {/* Pinned Sticky Action Footer - Always 100% visible */}
        <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-2.5 px-4 sm:px-6 py-3 sm:py-3.5 border-t border-[#4d4637]/40 bg-[#131314]">
          <button
            onClick={() => {
              onClose();
              onOpenEstimator();
            }}
            className="btn-interactive w-full py-2.5 px-3 bg-[#2a2a2b] hover:bg-[#353436] border border-[#4d4637]/60 hover:border-[#ffe08d]/60 text-[#e5e2e3] rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 transition-colors"
          >
            <Calculator size={14} className="text-[#ffe08d]" />
            <span>Project Estimator</span>
          </button>

          <a
            href="#contact"
            onClick={onClose}
            className="btn-interactive w-full py-2.5 px-3 bg-[#ffe08d] hover:bg-[#ffe7a3] text-[#3d2f00] rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <span>Get in Touch</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
};
