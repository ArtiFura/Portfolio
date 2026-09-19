import React, { useState, useEffect } from 'react';
import '../styles/navigation.css';

const NAV_PAGES = [
  { id: 'top', label: 'HOME', num: '01' }
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('artifura-theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('artifura-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="nav-header" id="main-nav">
        <a href="#top" className="nav-brand" onClick={scrollToTop} aria-label="ARTIFURA Home">
          <span className="nav-brand-title">ARTIFURA</span>
        </a>

        {/* Action Group: Desktop Nav + Theme Switcher + Mobile Toggle */}
        <div className="nav-actions">
          {/* Desktop Navigation */}
          <nav aria-label="Primary Navigation">
            <ul className="nav-links-desktop">
              {NAV_PAGES.map((page) => (
                <li key={page.id} className="nav-item">
                  <a
                    href={`#${page.id}`}
                    className="nav-link active"
                    onClick={scrollToTop}
                  >
                    <span className="nav-link-dot"></span>
                    <span>{page.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Technical Instrument Theme Switcher Button */}
          <button
            type="button"
            className="nav-theme-btn"
            onClick={toggleTheme}
            aria-label={`Toggle visual theme. Currently ${theme === 'dark' ? 'Obsidian' : 'Alabaster'}`}
            title={`Switch to ${theme === 'dark' ? 'Alabaster (Light)' : 'Obsidian (Dark)'} theme`}
          >
            <span className="nav-theme-icon">{theme === 'dark' ? '◐' : '◑'}</span>
            <span className="nav-theme-label">{theme === 'dark' ? 'OBSIDIAN' : 'ALABASTER'}</span>
          </button>

          {/* Mobile Toggle Button */}
          <button
            type="button"
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '[ CLOSE ]' : '[ MENU ]'}
          </button>
        </div>

        {/* Scroll Progress Indicator Bar */}
        <div
          className="nav-progress-bar"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />
      </header>

      {/* Mobile Drawer Overlay */}
      <div className={`nav-mobile-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="nav-mobile-list">
          {NAV_PAGES.map((page) => (
            <li key={page.id}>
              <a
                href={`#${page.id}`}
                className="nav-mobile-link"
                onClick={scrollToTop}
              >
                <span className="nav-mobile-num">{page.num}</span>
                <span>{page.label}</span>
              </a>
            </li>
          ))}
          <li style={{ marginTop: '16px' }}>
            <button
              type="button"
              className="nav-theme-btn"
              style={{ fontSize: '0.85rem', padding: '10px 18px' }}
              onClick={toggleTheme}
              aria-label="Toggle visual theme"
            >
              <span className="nav-theme-icon">{theme === 'dark' ? '◐' : '◑'}</span>
              <span className="nav-theme-label">THEME: {theme === 'dark' ? 'OBSIDIAN' : 'ALABASTER'}</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
