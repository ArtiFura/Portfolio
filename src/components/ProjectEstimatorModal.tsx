import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Calculator, ArrowRight, Check } from 'lucide-react';
import { setScrollPaused } from '../utils/scrollManager';

interface ProjectEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyScope: (scopeSummary: string) => void;
}

const PROJECT_TYPES = [
  { id: 'web', name: 'Web Platform', stack: 'React, Next.js, TypeScript, Node.js', baseWeeks: 6 },
  { id: 'backend', name: 'Backend & Systems', stack: 'Go, Node.js, PostgreSQL, Redis', baseWeeks: 8 },
  { id: 'uiux', name: 'UI / UX Design', stack: 'Figma, Design Systems, Prototypes', baseWeeks: 4 },
  { id: 'ai', name: 'AI & Automation', stack: 'LLMs, Pipelines, Workflows, APIs', baseWeeks: 6 },
  { id: 'mobile', name: 'Mobile App', stack: 'React Native, Flutter, iOS / Android', baseWeeks: 8 },
  { id: 'audit', name: 'Performance Audit', stack: 'Profiling, Code Review, Optimization', baseWeeks: 3 },
];

const SCALES = [
  { id: 'mvp', label: 'Startup / MVP', factor: 1, team: '1 Lead + 1 Engineer' },
  { id: 'scale', label: 'Growth / Scale-Up', factor: 1.4, team: '1 Lead + 2 Engineers' },
  { id: 'enterprise', label: 'Enterprise', factor: 1.8, team: 'Full Dedicated Squad' },
];

export const ProjectEstimatorModal: React.FC<ProjectEstimatorModalProps> = ({
  isOpen,
  onClose,
  onApplyScope,
}) => {
  const [selectedType, setSelectedType] = useState(PROJECT_TYPES[0]);
  const [selectedScale, setSelectedScale] = useState(SCALES[0]);
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

  const estimatedWeeks = Math.ceil(selectedType.baseWeeks * selectedScale.factor);
  const sprintCount = Math.ceil(estimatedWeeks / 2);

  const handleApply = () => {
    const summary = `Project Type: ${selectedType.name} (${selectedScale.label}). Estimated Duration: ~${estimatedWeeks} Weeks (${sprintCount} Sprints). Technologies: ${selectedType.stack}. Recommended Team: ${selectedScale.team}.`;
    onApplyScope(summary);
    onClose();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
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
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain p-2.5 xs:p-3 sm:p-5 flex items-center justify-center bg-black/85 backdrop-blur-md animate-backdrop-fade"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Project Scope Estimator"
    >
      <div 
        ref={dialogRef}
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        onWheel={handleDialogWheel}
        className="relative w-full max-w-2xl my-auto flex flex-col max-h-[calc(100dvh-1.25rem)] xs:max-h-[calc(100dvh-2rem)] sm:max-h-[min(90vh,820px)] bg-[#1c1b1c] border border-[#ffe08d]/50 rounded-xl sm:rounded-2xl shadow-[0_24px_85px_rgba(0,0,0,0.95)] overflow-hidden animate-popup-origin ring-1 ring-[#ffe08d]/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Sticky Header - Always 100% visible */}
        <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 border-b border-[#4d4637]/40 bg-[#131314]">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <Calculator size={16} className="text-[#ffe08d] shrink-0" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#ffe08d] font-semibold truncate">
              Project Scope Estimator
            </span>
          </div>
          <button 
            onClick={onClose}
            className="btn-interactive p-1.5 rounded-lg text-[#c6c6cf] hover:text-[#ffe08d] hover:bg-[#2a2a2b] cursor-pointer shrink-0 transition-colors"
            aria-label="Close estimator"
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
          {/* Step 1: Select Type */}
          <div>
            <label className="text-[11px] sm:text-xs uppercase font-mono tracking-wider text-[#99907e] block mb-2">
              1. Project Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PROJECT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type)}
                  className={`btn-interactive p-2.5 sm:p-3 text-left rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedType.id === type.id
                      ? 'bg-[#2a2a2b] border-[#ffe08d] text-[#ffe08d] shadow-[0_0_15px_rgba(255,224,141,0.25)]'
                      : 'bg-[#0e0e0f] border-[#4d4637]/30 text-[#e5e2e3] hover:border-[#ffe08d]/40'
                  }`}
                >
                  <div className="font-semibold text-xs sm:text-sm">{type.name}</div>
                  <div className="text-[10px] text-[#99907e] mt-0.5 sm:mt-1 font-mono truncate">{type.stack}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Scale */}
          <div>
            <label className="text-[11px] sm:text-xs uppercase font-mono tracking-wider text-[#99907e] block mb-2">
              2. Scale &amp; Scope
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SCALES.map((scale) => (
                <button
                  key={scale.id}
                  onClick={() => setSelectedScale(scale)}
                  className={`btn-interactive p-2.5 sm:p-3 text-left rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedScale.id === scale.id
                      ? 'bg-[#2a2a2b] border-[#ffe08d] text-[#ffe08d] shadow-[0_0_15px_rgba(255,224,141,0.25)]'
                      : 'bg-[#0e0e0f] border-[#4d4637]/30 text-[#e5e2e3] hover:border-[#ffe08d]/40'
                  }`}
                >
                  <div className="font-semibold text-xs sm:text-sm">{scale.label}</div>
                  <div className="text-[10px] text-[#99907e] mt-0.5 sm:mt-1 font-mono">{scale.team}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Calculated Output Matrix */}
          <div className="card-interactive p-3.5 sm:p-4 bg-[#0e0e0f] rounded-xl border border-[#ffe08d]/40 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#4d4637]/30 pb-2.5">
              <span className="text-[#99907e] uppercase text-[10px] sm:text-xs">Estimated Timeline:</span>
              <span className="text-[#ffe08d] text-sm sm:text-base font-bold">~{estimatedWeeks} Weeks ({sprintCount} Sprints)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-[#c6c6cf]">
              <div>
                <span className="text-[#99907e] block text-[10px] uppercase">Recommended Team:</span>
                <span className="text-[#e5e2e3] font-semibold">{selectedScale.team}</span>
              </div>
              <div>
                <span className="text-[#99907e] block text-[10px] uppercase">Technologies:</span>
                <span className="text-[#e5e2e3] truncate block">{selectedType.stack}</span>
              </div>
            </div>

            <div className="pt-1.5 flex items-center gap-2 text-[11px] text-emerald-400">
              <Check size={14} className="shrink-0" />
              <span className="leading-tight">Includes architecture setup, automated tests, deployment, and documentation.</span>
            </div>
          </div>
        </div>

        {/* Pinned Sticky Action Footer - Always 100% visible */}
        <div className="shrink-0 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 px-4 sm:px-6 py-3 sm:py-3.5 border-t border-[#4d4637]/40 bg-[#131314]">
          <button
            onClick={onClose}
            className="btn-interactive px-4 py-2 sm:py-2.5 rounded-lg text-xs font-mono text-[#99907e] hover:text-[#e5e2e3] cursor-pointer text-center transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="btn-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ffe08d] text-[#3d2f00] text-xs uppercase px-5 py-2.5 sm:py-3 rounded-lg font-semibold tracking-wider cursor-pointer shadow-md hover:bg-[#ffe7a3] transition-colors shrink-0"
          >
            <span>Apply to Message</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
