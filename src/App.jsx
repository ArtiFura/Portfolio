import React, { useState, useEffect } from 'react';
import { useLenisScroll, getLenis } from './hooks/useLenisScroll';
import { useMousePosition } from './hooks/useMousePosition';

// Background & Environment
import ArchitecturalGrid from './components/Background/ArchitecturalGrid';
import OrbitalCanvas from './components/Background/OrbitalCanvas';
import HolographicEnvironment from './components/Holographic/HolographicEnvironment';
import HolographicFilter from './components/Holographic/HolographicFilter';
import PrecisionCursor from './components/Cursor/PrecisionCursor';

// Architectural Perimeter Navigation System (Pages 01–08)
import PerimeterNavigation from './components/Navigation/PerimeterNavigation';

// 8 Major Pages Contained World (Strict boundary at each Page end)
import ActivePageContainer from './components/Pages/ActivePageContainer';

import './styles/global.css';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize Lenis physical momentum scroll & velocity hook
  const { velocity: scrollVelocity } = useLenisScroll();
  const mousePos = useMousePosition();

  // Apply theme attribute to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectPage = (index) => {
    if (isTransitioning) return;

    // If clicking the currently active page, smoothly return to top
    if (index === activePageIndex) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.0 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    setActivePageIndex(index);
  };

  return (
    <div className="artifura-root" style={{ position: 'relative', width: '100%', minHeight: '100%' }}>
      {/* Velocity-Driven SVG Holographic Displacement Filter */}
      <HolographicFilter velocity={scrollVelocity} />

      {/* Atmospheric Micro-Noise Paper Texture */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Living Architectural Background Systems */}
      <ArchitecturalGrid />
      <HolographicEnvironment
        activePageIndex={activePageIndex}
        velocity={scrollVelocity}
        mousePos={mousePos}
        theme={theme}
      />
      <OrbitalCanvas velocity={scrollVelocity} mousePos={mousePos} />

      {/* Hardware-Accelerated Precision Reticle Cursor */}
      <PrecisionCursor mousePos={mousePos} />

      {/* Perimeter Viewport Navigation (Primary Switcher for the 8 Major Pages) */}
      <PerimeterNavigation
        activePageIndex={activePageIndex}
        currentTheme={theme}
        onToggleTheme={toggleTheme}
        onSelectPage={handleSelectPage}
      />

      {/* Contained Active Page World with Hard Scroll Boundary & End Indicator */}
      <ActivePageContainer
        activePageIndex={activePageIndex}
        onNavigatePage={handleSelectPage}
        onTransitionChange={setIsTransitioning}
        velocity={scrollVelocity}
      />
    </div>
  );
}
