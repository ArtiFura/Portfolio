import { useState, useEffect, useRef } from 'react';

export const SECTION_IDS = [
  'home',
  'hero',
  'about',
  'services',
  'stack',
  'work',
  'approach',
  'network',
  'contact',
  'footer',
] as const;

export type SectionId = typeof SECTION_IDS[number];

export interface SectionObserverResult {
  activeSection: SectionId;
  sectionProgressRef: React.MutableRefObject<number>;
  setActiveSection: (section: SectionId) => void;
}

/**
 * Custom hook to detect active section using IntersectionObserver with scroll fallback,
 * and maintains continuous section scroll progress in a ref for 60fps canvas animations.
 */
export function useSectionObserver(): SectionObserverResult {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const sectionProgressRef = useRef<number>(0);
  const activeSectionRef = useRef<SectionId>('home');

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use IntersectionObserver to detect which section is dominant in viewport
    const sectionElements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    if (!('IntersectionObserver' in window) || sectionElements.length === 0) {
      // Fallback scroll listener
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const scrollBottom = scrollY + viewportHeight;
        const docHeight = document.documentElement.scrollHeight;

        if (scrollBottom >= docHeight - 100) {
          if (activeSectionRef.current !== 'footer') {
            setActiveSection('footer');
          }
          return;
        }

        const headerOffset = 160;
        for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
          const el = document.getElementById(SECTION_IDS[i]);
          if (el) {
            const top = el.offsetTop - headerOffset;
            if (scrollY >= top) {
              if (activeSectionRef.current !== SECTION_IDS[i]) {
                setActiveSection(SECTION_IDS[i]);
              }
              break;
            }
          }
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }

    // High performance IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible sections with highest intersection ratio or top alignment
        let bestEntry: IntersectionObserverEntry | null = null;
        let maxVisibleHeight = 0;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            const visibleHeight = entry.intersectionRect.height;
            if (visibleHeight > maxVisibleHeight) {
              maxVisibleHeight = visibleHeight;
              bestEntry = entry;
            }
          }
        }

        const target = bestEntry ? (bestEntry.target as HTMLElement) : null;
        if (target && target.id) {
          const id = target.id as SectionId;
          if ((SECTION_IDS as readonly string[]).includes(id) && activeSectionRef.current !== id) {
            setActiveSection(id);
          }
        }
      },
      {
        threshold: [0.15, 0.35, 0.6, 0.85],
        rootMargin: '-10% 0px -25% 0px', // Bias towards center-top reading area
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    // Scroll listener specifically for:
    // 1. Footer boundary
    // 2. High-precision continuous sectionProgressRef calculation (zero React re-renders)
    const handleScrollMetrics = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollY + viewportHeight >= docHeight - 60) {
        if (activeSectionRef.current !== 'footer') {
          setActiveSection('footer');
        }
        sectionProgressRef.current = 1;
        return;
      }

      // Calculate progress of currently active section
      const activeEl = document.getElementById(activeSectionRef.current);
      if (activeEl) {
        const rect = activeEl.getBoundingClientRect();
        const totalHeight = rect.height;
        // Progress: 0 when top is entering/at top, 1 when section is ending
        const distanceScrolled = -rect.top + 80;
        const progress = Math.max(0, Math.min(1, distanceScrolled / Math.max(1, totalHeight)));
        sectionProgressRef.current = progress;
      }
    };

    window.addEventListener('scroll', handleScrollMetrics, { passive: true });
    handleScrollMetrics();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollMetrics);
    };
  }, []);

  return {
    activeSection,
    sectionProgressRef,
    setActiveSection,
  };
}
