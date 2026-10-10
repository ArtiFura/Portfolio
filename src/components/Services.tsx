import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Layers,
  Cpu,
  Layout,
  Brain,
  Smartphone,
  GitBranch,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Cloud,
  Database,
  Shield,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { CAPABILITIES, Capability, ClickOrigin } from '../data/artifuraData';
import { CapabilityModal } from './CapabilityModal';
import { SectionDivider } from './SectionDivider';
import { handleSpotlightMove } from '../utils/scrollManager';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null);
  const [clickOrigin, setClickOrigin] = useState<ClickOrigin | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetWidthRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);
  const targetXRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const touchDirectionLockedRef = useRef<'horizontal' | 'vertical' | null>(null);
  const dragStartXRef = useRef<number>(0);
  const dragStartTargetXRef = useRef<number>(0);
  const clickStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTimeRef = useRef<number>(performance.now());
  const isInitializedRef = useRef<boolean>(false);

  // Filter capabilities according to selected domain
  const filteredCapabilities = activeFilter === 'all'
    ? CAPABILITIES
    : CAPABILITIES.filter((cap) => {
      if (activeFilter === 'systems') {
        return cap.categoryType === 'architecture' || cap.categoryType === 'systems' || cap.categoryType === 'integration';
      }
      if (activeFilter === 'interfaces') {
        return cap.categoryType === 'interfaces' || cap.categoryType === 'platforms';
      }
      if (activeFilter === 'ai') {
        return cap.categoryType === 'ai' || cap.categoryType === 'data';
      }
      if (activeFilter === 'cloud') {
        return cap.categoryType === 'cloud' || cap.categoryType === 'security' || cap.categoryType === 'consulting';
      }
      return true;
    });

  // Ensure base set has at least 8 items so it always spans wider than any screen resolution
  let baseItems = [...filteredCapabilities];
  while (baseItems.length < 8) {
    baseItems = [...baseItems, ...filteredCapabilities];
  }

  // 3 identical sets: Set 0 (left buffer), Set 1 (active center set), Set 2 (right buffer)
  const loopItems = [...baseItems, ...baseItems, ...baseItems];

  // Map service IDs to corresponding modern icons
  const getIcon = (id: string) => {
    const iconClass = "text-[#c6c6cf] group-hover:text-[#ffe08d] group-hover:scale-110 transition-all duration-300";
    switch (id) {
      case 'web-dev':
        return <Layers className={iconClass} size={20} />;
      case 'software-dev':
        return <Cpu className={iconClass} size={20} />;
      case 'ui-ux':
        return <Layout className={iconClass} size={20} />;
      case 'ai-automation':
        return <Brain className={iconClass} size={20} />;
      case 'mobile-apps':
        return <Smartphone className={iconClass} size={20} />;
      case 'digital-solutions':
        return <GitBranch className={iconClass} size={20} />;
      case 'cloud-devops':
        return <Cloud className={iconClass} size={20} />;
      case 'data-pipelines':
        return <Database className={iconClass} size={20} />;
      case 'cyber-security':
        return <Shield className={iconClass} size={20} />;
      case 'api-integrations':
      default:
        return <Share2 className={iconClass} size={20} />;
    }
  };

  // Helper to get step size (card width + 24px gap)
  const getCardStep = useCallback((): number => {
    const cardEl = trackRef.current?.querySelector<HTMLElement>('.service-card');
    if (cardEl && cardEl.offsetWidth > 0) {
      return cardEl.offsetWidth + 24;
    }
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 768) return 444; // 420px + 24px
      if (window.innerWidth >= 640) return 404; // 380px + 24px
      return 304; // 280px + 24px
    }
    return 444;
  }, []);

  // IntersectionObserver to ONLY run RAF animation loop when Services section is visible
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: '100px 0px 100px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Compute set width and initialize position in Set 1 (middle set)
  const updateDimensions = useCallback(() => {
    const step = getCardStep();
    const setWidth = baseItems.length * step;
    singleSetWidthRef.current = setWidth;

    if (!isInitializedRef.current && setWidth > 0) {
      currentXRef.current = setWidth;
      targetXRef.current = setWidth;
      isInitializedRef.current = true;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(-${setWidth}px, 0, 0)`;
      }
    }
  }, [baseItems.length, getCardStep]);

  useEffect(() => {
    isInitializedRef.current = false;
    updateDimensions();
    const timer = setTimeout(updateDimensions, 50);
    window.addEventListener('resize', updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions, activeFilter]);

  // Main High-Performance GPU Composited Animation Loop
  // CRITICAL OPTIMIZATION: Only runs when the section is ACTUALLY visible in the viewport!
  useEffect(() => {
    if (!isVisible) return;

    let animId: number;
    lastTimeRef.current = performance.now();

    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;

    const tick = (now: number) => {
      if (document.hidden) {
        animId = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05); // Cap dt to prevent leap on tab switch
      lastTimeRef.current = now;

      const track = trackRef.current;
      const singleWidth = singleSetWidthRef.current;

      if (track && singleWidth > 0) {
        // 1. Constant automatic movement when not dragging and not hovered
        if (!isHovered && !isDraggingRef.current) {
          // Speed: 40-50 pixels per second - silky smooth, constant glide
          const speed = isMobileDevice ? 32 : 50;
          targetXRef.current -= speed * dt;
        }

        // 2. Smooth exponential lerp (provides physics ease when buttons are clicked)
        currentXRef.current += (targetXRef.current - currentXRef.current) * 0.14;

        // 3. Mathematical seamless wrap across the 3 identical sets
        while (currentXRef.current >= singleWidth * 2) {
          currentXRef.current -= singleWidth;
          targetXRef.current -= singleWidth;
        }
        while (currentXRef.current < singleWidth) {
          currentXRef.current += singleWidth;
          targetXRef.current += singleWidth;
        }

        // 4. Direct GPU compositor translate3d (zero layout reflow)
        track.style.transform = `translate3d(-${currentXRef.current}px, 0, 0)`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isVisible, isHovered]);

  // Next Arrow Button Click: slides forward to reveal next card
  const handleNext = () => {
    const step = getCardStep();
    targetXRef.current += step;
  };

  // Previous Arrow Button Click: slides backward to reveal previous card
  const handlePrev = () => {
    const step = getCardStep();
    targetXRef.current -= step;
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartTargetXRef.current = targetXRef.current;
    clickStartPosRef.current = { x: e.clientX, y: e.clientY };
  };

  // Touch Handlers with Direction Detection Lock (Prevents vertical scrolling from being blocked on mobile!)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    touchDirectionLockedRef.current = null;
    isDraggingRef.current = false;
    dragStartXRef.current = e.touches[0].clientX;
    dragStartTargetXRef.current = targetXRef.current;
    clickStartPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - dragStartXRef.current;
      targetXRef.current = dragStartTargetXRef.current - deltaX;
      currentXRef.current = targetXRef.current;
    };

    const handleGlobalMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const currentTouchX = e.touches[0].clientX;
      const currentTouchY = e.touches[0].clientY;
      const deltaX = currentTouchX - clickStartPosRef.current.x;
      const deltaY = currentTouchY - clickStartPosRef.current.y;

      // Direction lock: decide whether this is a page scroll (vertical) or carousel swipe (horizontal)
      if (touchDirectionLockedRef.current === null) {
        if (Math.abs(deltaY) > 7 && Math.abs(deltaY) > Math.abs(deltaX)) {
          touchDirectionLockedRef.current = 'vertical'; // User is scrolling page vertically - allow native scroll!
          return;
        }
        if (Math.abs(deltaX) > 7 && Math.abs(deltaX) >= Math.abs(deltaY)) {
          touchDirectionLockedRef.current = 'horizontal'; // User is swiping carousel horizontally
          isDraggingRef.current = true;
        }
      }

      if (touchDirectionLockedRef.current === 'horizontal' && isDraggingRef.current) {
        const moveDelta = currentTouchX - dragStartXRef.current;
        targetXRef.current = dragStartTargetXRef.current - moveDelta;
        currentXRef.current = targetXRef.current;
      }
    };

    const handleGlobalTouchEnd = () => {
      isDraggingRef.current = false;
      touchDirectionLockedRef.current = null;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
    window.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, []);

  // Card click detection (ignores accidental clicks when dragging)
  const handleCardClick = (capability: Capability, e: React.MouseEvent) => {
    const dist = Math.hypot(
      e.clientX - clickStartPosRef.current.x,
      e.clientY - clickStartPosRef.current.y
    );
    if (dist > 8) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setClickOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    });
    setSelectedCapability(capability);
  };

  return (
    <section 
      ref={sectionRef}
      className="snap-section w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center pb-16 md:pb-24 bg-transparent relative overflow-hidden select-none" 
      id="services"
    >
      {/* Section Divider */}
      <SectionDivider
        number="02"
        label="SERVICES"
        targetId="services"
        nextId="stack"
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full">

        {/* Section Header & Interactive Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-[#ffe08d] font-semibold font-mono">
                02 / SERVICES
              </span>
              <span className="h-[1px] w-12 bg-[#ffe08d]/40"></span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-sans text-[#e5e2e3] font-semibold tracking-tight uppercase">
              Services
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Previous Arrow Button */}
            <button
              onClick={handlePrev}
              className="btn-interactive w-11 h-11 rounded-xl bg-[#1c1b1c] border border-[#4d4637]/60 hover:border-[#ffe08d] text-[#ffe08d] flex items-center justify-center cursor-pointer shadow-md group active:scale-95"
              title="Previous Service"
              aria-label="Previous service"
            >
              <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
            </button>

            {/* Next Arrow Button */}
            <button
              onClick={handleNext}
              className="btn-interactive w-11 h-11 rounded-xl bg-[#ffe08d] hover:bg-[#e5c365] text-[#3d2f00] font-bold flex items-center justify-center cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(229,195,101,0.4)] group active:scale-95"
              title="Next Service"
              aria-label="Next service"
            >
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-3 border-b border-[#4d4637]/20">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'systems', label: 'Systems & Architecture' },
            { id: 'interfaces', label: 'Interfaces & Mobile' },
            { id: 'ai', label: 'AI & Data' },
            { id: 'cloud', label: 'Cloud & Security' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`btn-interactive px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider cursor-pointer ${activeFilter === filter.id
                  ? 'bg-[#ffe08d] text-[#3d2f00] font-semibold shadow-[0_0_16px_rgba(255,224,141,0.35)]'
                  : 'bg-[#1c1b1c] text-[#c6c6cf] hover:text-[#e5e2e3] border border-[#4d4637]/40 hover:border-[#ffe08d]/60 hover:bg-[#252425]'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

      </div>

      {/* Infinite Horizontal Carousel Strip with Cinematic Edge Masks */}
      <div className="relative w-full overflow-hidden py-4">

        {/* Left Gradient Edge Mask */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 bg-gradient-to-r from-[#0e0e0f] via-[#0e0e0f]/80 to-transparent z-20" />

        {/* Right Gradient Edge Mask */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 bg-gradient-to-l from-[#0e0e0f] via-[#0e0e0f]/80 to-transparent z-20" />

        {/* Continuous Horizontal Looping Track (GPU translate3d) */}
        <div className="w-full overflow-hidden py-3">
          <div
            ref={trackRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ willChange: 'transform' }}
            className="cards-focus-group flex gap-6 w-max px-8 sm:px-16 md:px-24 py-6 cursor-grab active:cursor-grabbing select-none"
          >
            {loopItems.map((capability, idx) => (
              <div
                key={`${capability.id}-${idx}`}
                onClick={(e) => handleCardClick(capability, e)}
                onMouseMove={handleSpotlightMove}
                className="service-card card-focus-item w-[280px] xs:w-[320px] sm:w-[380px] md:w-[420px] h-[410px] sm:h-[460px] shrink-0 flex flex-col justify-between p-6 sm:p-8 bg-[#181819] border border-[#4d4637]/40 rounded-2xl relative group overflow-hidden cursor-pointer card-interactive spotlight-card shadow-lg hover:border-[#ffe08d]/80 transition-all"
              >
                {/* Top Row: Category Tag, Icon, and Link Indicator */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#ffe08d] bg-[#ffe08d]/10 px-2.5 py-1 rounded-md border border-[#ffe08d]/25 group-hover:border-[#ffe08d]/60 transition-colors">
                      {capability.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-[#201f20] border border-[#4d4637]/30 group-hover:border-[#ffe08d]/50 group-hover:bg-[#2a2824] transition-all duration-300">
                        {getIcon(capability.id)}
                      </div>
                      <ArrowUpRight size={16} className="text-[#99907e] opacity-60 group-hover:opacity-100 group-hover:text-[#ffe08d] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Capability Title */}
                  <h3 className="text-xl md:text-2xl text-[#e5e2e3] font-semibold mb-3 group-hover:text-[#ffe08d] transition-colors duration-300 tracking-tight">
                    {capability.title}
                  </h3>

                  {/* Capability Description */}
                  <p className="text-xs sm:text-sm text-[#c6c6cf] leading-relaxed mb-4 line-clamp-3">
                    {capability.description}
                  </p>

                  {/* Deliverable Highlights Snippet */}
                  <div className="space-y-1.5 pt-2 border-t border-[#4d4637]/25 text-xs text-[#c6c6cf]">
                    {capability.deliverables.slice(0, 2).map((item, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-[#ffe08d] shrink-0 mt-0.5" />
                        <span className="text-[11px] text-[#e5e2e3] leading-snug line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Tags & Deep-dive trigger */}
                <div className="relative z-10 pt-4 border-t border-[#4d4637]/25 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-1.5 text-[#99907e] text-[11px] font-mono uppercase tracking-wider group-hover:text-[#c6c6cf] transition-colors">
                    {capability.tags.map((tag, i) => (
                      <React.Fragment key={tag}>
                        <span className="px-2 py-0.5 rounded bg-[#0e0e0f] border border-[#4d4637]/30 text-[#ffe08d]/90">
                          {tag}
                        </span>
                        {i < capability.tags.length - 1 && <span className="text-[#4d4637]">•</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="flex items-center justify-end text-xs font-mono text-[#ffe08d] group-hover:text-[#e5c365] transition-colors pt-1">
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Learn More →</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Deep-dive Capability Modal */}
      <CapabilityModal
        capability={selectedCapability}
        origin={clickOrigin}
        onClose={() => {
          setSelectedCapability(null);
          setClickOrigin(null);
        }}
        onSelectService={onSelectService}
      />
    </section>
  );
};
