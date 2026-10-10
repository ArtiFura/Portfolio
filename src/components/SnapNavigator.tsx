import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronUp, ChevronDown, Lock, Unlock } from 'lucide-react';
import { smoothScrollTo } from '../utils/scrollManager';

export interface SectionItem {
  id: string;
  number: string;
  name: string;
}

export const SECTIONS: SectionItem[] = [
  { id: 'home', number: '—', name: 'Home' },
  { id: 'hero', number: '00', name: 'Overview' },
  { id: 'about', number: '01', name: 'About' },
  { id: 'services', number: '02', name: 'Services' },
  { id: 'stack', number: '03', name: 'Stack' },
  { id: 'work', number: '04', name: 'Work' },
  { id: 'approach', number: '05', name: 'Process' },
  { id: 'network', number: '06', name: 'Network' },
  { id: 'contact', number: '07', name: 'Contact' },
];

interface SnapNavigatorProps {
  isModalOpen?: boolean;
  activeSectionId?: string;
  isVisible?: boolean;
}

export const SnapNavigator: React.FC<SnapNavigatorProps> = ({
  isModalOpen = false,
  activeSectionId: propActiveSectionId,
  isVisible = true,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(propActiveSectionId || 'home');
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const isTransitioningRef = useRef<boolean>(false);
  const lastWheelTimeRef = useRef<number>(0);

  // Sync active section from props if provided and valid
  useEffect(() => {
    if (propActiveSectionId && SECTIONS.some((s) => s.id === propActiveSectionId)) {
      setActiveSectionId(propActiveSectionId);
    }
  }, [propActiveSectionId]);

  // Sync snap class with html element
  useEffect(() => {
    const html = document.documentElement;
    if (snapEnabled) {
      html.classList.add('snap-enabled');
    } else {
      html.classList.remove('snap-enabled');
    }
    return () => {
      html.classList.remove('snap-enabled');
    };
  }, [snapEnabled]);

  // Track active section via scroll position as fallback
  useEffect(() => {
    if (propActiveSectionId) return; // Prop takes precedence

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headerOffset = 120;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = document.getElementById(SECTIONS[i].id);
        if (section) {
          const top = section.offsetTop - headerOffset;
          if (scrollY >= top) {
            setActiveSectionId(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [propActiveSectionId]);

  // Smooth scroll to section with momentum
  const scrollToSection = useCallback((targetId: string) => {
    isTransitioningRef.current = true;
    setActiveSectionId(targetId);

    const offset = targetId === 'home' ? 0 : -80;
    smoothScrollTo('#' + targetId, {
      offset,
      duration: 1.15,
      onComplete: () => {
        isTransitioningRef.current = false;
      },
    });

    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 800);
  }, []);

  const currentIndex = SECTIONS.findIndex((s) => s.id === activeSectionId);

  const goToNextSection = useCallback(() => {
    if (currentIndex < SECTIONS.length - 1) {
      scrollToSection(SECTIONS[currentIndex + 1].id);
    }
  }, [currentIndex, scrollToSection]);

  const goToPrevSection = useCallback(() => {
    if (currentIndex > 0) {
      scrollToSection(SECTIONS[currentIndex - 1].id);
    }
  }, [currentIndex, scrollToSection]);

  // Keyboard navigation (ArrowDown / ArrowUp / PageDown / PageUp)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isAnyModalOpen = isModalOpen || (typeof document !== 'undefined' && document.body.style.overflow === 'hidden');
      if (isAnyModalOpen) return;

      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (currentIndex < SECTIONS.length - 1) {
          e.preventDefault();
          goToNextSection();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrevSection();
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection('home');
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSection(SECTIONS[SECTIONS.length - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, goToNextSection, goToPrevSection, scrollToSection]);

  // Enhanced mouse wheel handling for section snap
  useEffect(() => {
    if (!snapEnabled) return;

    const handleWheel = (e: WheelEvent) => {
      // 1. Immediately bypass if any modal is active or body scroll is paused
      if (isModalOpen || (typeof document !== 'undefined' && document.body.style.overflow === 'hidden')) {
        return;
      }

      // 2. Immediately bypass if wheel target is inside any modal or popup container
      const targetElement = e.target as HTMLElement | null;
      if (targetElement?.closest?.('[data-lenis-prevent], [role="dialog"], .modal-scroll')) {
        return;
      }

      // Don't intercept if modifier keys pressed (like zoom)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Allow natural scroll inside elements with their own scrollbars
      let targetNode = e.target as HTMLElement | null;
      while (targetNode && targetNode !== document.body) {
        if (targetNode.scrollHeight > targetNode.clientHeight) {
          const overflowY = window.getComputedStyle(targetNode).overflowY;
          if (overflowY === 'auto' || overflowY === 'scroll') {
            return;
          }
        }
        targetNode = targetNode.parentElement;
      }

      const now = Date.now();
      // Debounce rapid continuous wheel events
      if (now - lastWheelTimeRef.current < 650) {
        return;
      }

      const currentElem = document.getElementById(activeSectionId);
      const isTallSection = currentElem && currentElem.clientHeight > window.innerHeight * 1.35;

      // If in a very tall section (e.g. Work with 3 case studies), allow internal scrolling
      if (isTallSection && currentElem) {
        const rect = currentElem.getBoundingClientRect();
        const headerHeight = 80;
        const atSectionTop = rect.top >= headerHeight - 15;
        const atSectionBottom = rect.bottom <= window.innerHeight + 15;

        if (e.deltaY > 0 && !atSectionBottom) {
          return; // Let user scroll inside the section down
        }
        if (e.deltaY < 0 && !atSectionTop) {
          return; // Let user scroll inside the section up
        }
      }

      // Strong deliberate wheel gesture
      if (Math.abs(e.deltaY) > 28) {
        if (e.deltaY > 0 && currentIndex < SECTIONS.length - 1) {
          e.preventDefault();
          lastWheelTimeRef.current = now;
          goToNextSection();
        } else if (e.deltaY < 0 && currentIndex > 0) {
          e.preventDefault();
          lastWheelTimeRef.current = now;
          goToPrevSection();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [snapEnabled, isModalOpen, activeSectionId, currentIndex, goToNextSection, goToPrevSection]);

  return (
    <aside
      aria-label="Section Snap Navigator"
      className={`fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible
          ? 'translate-x-0 opacity-100 pointer-events-auto'
          : 'translate-x-12 opacity-0 pointer-events-none'
        }`}
    >
      <div className="flex flex-col items-center p-2 rounded-2xl bg-[#0e0e0f]/90 backdrop-blur-xl border border-[#4d4637]/50 shadow-[0_8px_32px_rgba(0,0,0,0.85)] gap-3">

        {/* Jump Prev Button */}
        <button
          onClick={goToPrevSection}
          disabled={currentIndex === 0}
          className="btn-interactive p-1.5 rounded-lg text-[#99907e] hover:text-[#ffe08d] hover:bg-[#201f20] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#99907e] cursor-pointer"
          title="Snap to Previous Section (Up Arrow)"
          aria-label="Previous section"
        >
          <ChevronUp size={16} />
        </button>

        {/* Section Dots List */}
        <div className="flex flex-col items-center gap-2.5 my-1">
          {SECTIONS.map((sec) => {
            const isActive = sec.id === activeSectionId;
            const isHovered = sec.id === hoveredSection;

            return (
              <div
                key={sec.id}
                className="relative flex items-center justify-center group"
                onMouseEnter={() => setHoveredSection(sec.id)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                {/* Interactive Dot */}
                <button
                  onClick={() => scrollToSection(sec.id)}
                  aria-label={`Jump to ${sec.name} section`}
                  aria-current={isActive ? 'step' : undefined}
                  className={`transition-all duration-300 rounded-full flex items-center justify-center cursor-pointer ${isActive
                    ? 'w-3 h-3 bg-[#ffe08d] shadow-[0_0_12px_#ffe08d] ring-4 ring-[#ffe08d]/20 scale-110'
                    : 'w-2 h-2 bg-[#4d4637] hover:bg-[#ffe08d]/80 hover:scale-125'
                    }`}
                />

                {/* Hover Flyout Tooltip (Left side) */}
                <div
                  className={`absolute right-7 pointer-events-none transition-all duration-200 z-50 ${isHovered
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2'
                    }`}
                >
                  <div className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#0e0e0f] border border-[#ffe08d]/60 shadow-[0_4px_16px_rgba(0,0,0,0.8)] flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#ffe08d]">
                      {sec.number}
                    </span>
                    <span className="font-sans text-xs font-semibold text-[#e5e2e3]">
                      {sec.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Jump Next Button */}
        <button
          onClick={goToNextSection}
          disabled={currentIndex === SECTIONS.length - 1}
          className="btn-interactive p-1.5 rounded-lg text-[#99907e] hover:text-[#ffe08d] hover:bg-[#201f20] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#99907e] cursor-pointer"
          title="Snap to Next Section (Down Arrow)"
          aria-label="Next section"
        >
          <ChevronDown size={16} />
        </button>

        {/* Divider */}
        <span className="w-4 h-[1px] bg-[#4d4637]/50" />

        {/* Snap Toggle Switch */}
        <button
          onClick={() => setSnapEnabled((prev) => !prev)}
          className={`btn-interactive p-1.5 rounded-lg cursor-pointer ${snapEnabled
            ? 'text-[#ffe08d] bg-[#ffe08d]/10 hover:bg-[#ffe08d]/20 border border-[#ffe08d]/30'
            : 'text-[#99907e] hover:text-[#e5e2e3] bg-transparent'
            }`}
          title={snapEnabled ? 'Snap Scrolling: Enabled (Click to switch to free scroll)' : 'Snap Scrolling: Disabled (Click to enable)'}
          aria-label={snapEnabled ? 'Disable snap scrolling' : 'Enable snap scrolling'}
        >
          {snapEnabled ? <Lock size={13} /> : <Unlock size={13} />}
        </button>

        {/* Current Index Badge */}
        <div className="text-[9px] font-mono text-[#99907e] font-semibold tabular-nums mt-0.5">
          {SECTIONS[currentIndex]?.number || '00'}/{SECTIONS[SECTIONS.length - 1].number}
        </div>

      </div>
    </aside>
  );
};
