import React from 'react';
import { ArrowUp } from 'lucide-react';
import { smoothScrollTo } from '../utils/scrollManager';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    smoothScrollTo(0, { offset: 0 });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const offset = targetId === 'home' ? 0 : -80;
    smoothScrollTo(targetId === 'home' ? 0 : '#' + targetId, { offset });
  };

  return (
    <footer id="footer" className="w-full bg-transparent border-t border-[#4d4637]/30 py-10 sm:py-16 relative">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">

        {/* Top Tier */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sm:gap-8 pb-8 sm:pb-12 border-b border-[#4d4637]/20">
          <div className="flex flex-col gap-1">
            <span
              onClick={scrollToTop}
              className="text-interactive text-2xl font-sans uppercase tracking-tight text-[#e5e2e3] font-semibold hover:text-[#ffe08d] cursor-pointer"
            >
              ARTIFURA
            </span>
            <span className="text-xs text-[#c6c6cf]">
              Software &amp; Digital Products
            </span>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8">
            {[
              { label: 'Home', href: '#home' },
              { label: 'About', href: '#about' },
              { label: 'Services', href: '#services' },
              { label: 'Stack', href: '#stack' },
              { label: 'Work', href: '#work' },
              { label: 'Contact', href: '#contact' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="nav-link text-xs uppercase tracking-wider text-[#c6c6cf] hover:text-[#ffe08d] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Tier */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 sm:pt-8 text-xs text-[#99907e] font-mono">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffe08d] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ffe08d]"></span>
            </span>
            <span className="text-[11px] sm:text-xs">© 2026 ARTIFURA. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex items-center gap-6 self-end sm:self-auto">
            <button
              onClick={scrollToTop}
              className="btn-interactive p-2.5 rounded-lg bg-[#1c1b1c] hover:bg-[#2a2a2b] border border-[#4d4637]/40 hover:border-[#ffe08d]/60 text-[#c6c6cf] hover:text-[#ffe08d] cursor-pointer shadow-md"
              title="Scroll to top"
              aria-label="Scroll to top of page"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
