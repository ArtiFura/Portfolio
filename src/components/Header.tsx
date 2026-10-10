import React, { useState, useEffect } from 'react';
import { ArrowRight, User, Menu, X } from 'lucide-react';
import { smoothScrollTo } from '../utils/scrollManager';
import { ArtifuraLogo } from './ArtifuraIntro';

interface HeaderProps {
  onOpenProtocol: () => void;
  onOpenEstimator: () => void;
  isVisible?: boolean;
  activeSection?: string;
}

const NAV_ITEMS = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'Stack', href: '#stack', id: 'stack' },
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'Lifecycle', href: '#approach', id: 'approach' },
  { label: 'Network', href: '#network', id: 'network' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export const Header: React.FC<HeaderProps> = ({
  onOpenProtocol,
  onOpenEstimator,
  isVisible = true,
  activeSection: propActiveSection,
}) => {
  const [internalActiveSection, setInternalActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const currentActiveSection = propActiveSection || internalActiveSection;

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const offset = targetId === 'home' ? 0 : -80;
    smoothScrollTo('#' + targetId, { offset });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-full opacity-0 pointer-events-none'
        } ${scrolled
          ? 'bg-[#0e0e0f]/90 backdrop-blur-xl border-b border-[#4d4637]/35 shadow-[0_4px_24px_rgba(0,0,0,0.6)]'
          : 'bg-[#0e0e0f]/80 backdrop-blur-md border-b border-[#4d4637]/20'
        }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 h-20 flex items-center justify-between gap-3 sm:gap-4">

        {/* Brand Zone */}
        <div className="flex items-center shrink-0">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center group py-2"
            aria-label="ARTIFURA Home"
          >
            <ArtifuraLogo className="text-xl sm:text-2xl" />
          </a>
        </div>

        {/* Nav Links */}
        <nav className="hidden xl:flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const isActive = currentActiveSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`nav-link text-xs uppercase tracking-wider font-semibold transition-colors duration-200 ${isActive ? 'active text-[#ffe08d]' : 'text-[#c6c6cf] hover:text-[#e5e2e3]'
                  }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Primary Actions Zone */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="btn-interactive hidden sm:inline-flex items-center justify-center bg-[#ffe08d] text-[#3d2f00] text-xs uppercase px-3.5 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg font-bold group whitespace-nowrap shadow-md cursor-pointer"
          >
            <span>Start a Project</span>
            <ArrowRight size={14} className="ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>

          {/* Client Protocol / Session Status Avatar */}
          <button
            onClick={onOpenProtocol}
            title="Client Protocol"
            className="btn-interactive hidden sm:flex w-8 h-8 rounded-full bg-[#ffe08d] items-center justify-center cursor-pointer shadow-md"
            aria-label="Open client protocol"
          >
            <User size={16} className="text-[#3d2f00]" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-interactive xl:hidden p-2 rounded-lg text-[#c6c6cf] hover:text-[#ffe08d] hover:bg-[#1a191a] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0e0e0f]/98 border-b border-[#4d4637]/40 px-5 sm:px-6 py-5 space-y-4">
          <div className="flex flex-col space-y-2.5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-interactive py-2 text-sm uppercase tracking-wider font-semibold ${currentActiveSection === item.id ? 'text-[#ffe08d]' : 'text-[#c6c6cf] hover:text-[#e5e2e3]'
                  }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#4d4637]/30 flex flex-col gap-2">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="btn-interactive w-full py-2.5 bg-[#ffe08d] text-[#3d2f00] text-xs uppercase tracking-wider font-bold rounded-lg text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Start a Project</span>
              <ArrowRight size={14} />
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEstimator();
              }}
              className="btn-interactive w-full py-2.5 bg-[#2a2a2b] hover:bg-[#353436] text-[#ffe08d] text-xs uppercase tracking-wider font-semibold rounded-lg text-center cursor-pointer"
            >
              Project Estimator
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProtocol();
              }}
              className="btn-interactive w-full py-2.5 bg-[#1c1b1c] text-[#c6c6cf] hover:text-[#e5e2e3] text-xs uppercase tracking-wider font-semibold rounded-lg text-center cursor-pointer border border-[#4d4637]/30"
            >
              Client Protocol
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
