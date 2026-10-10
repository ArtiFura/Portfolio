import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Stack } from './components/Stack';
import { Work } from './components/Work';
import { Lifecycle } from './components/Lifecycle';
import { Network } from './components/Network';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ProtocolModal } from './components/ProtocolModal';
import { ProjectEstimatorModal } from './components/ProjectEstimatorModal';
import { SnapNavigator } from './components/SnapNavigator';
import { HomeIntro } from './components/HomeIntro';
import { BackgroundSystem } from './components/BackgroundSystem';
import { useSectionObserver } from './utils/useSectionObserver';
import { initScrollMomentum, setScrollPaused, smoothScrollTo, initScrollReveals, resetScrollToTop } from './utils/scrollManager';
import { hasIntroPlayed } from './components/ArtifuraIntro';
import { PerformanceMetrics } from './components/PerformanceMetrics';

export default function App() {
  const [isProtocolOpen, setIsProtocolOpen] = useState(false);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState<string>('');
  const [isIntroComplete, setIsIntroComplete] = useState<boolean>(() => hasIntroPlayed());

  const { activeSection, sectionProgressRef } = useSectionObserver();

  const handleSelectService = (serviceTitle: string) => {
    setSelectedServiceForInquiry(serviceTitle);
  };

  const handleApplyScope = (scopeSummary: string) => {
    // Fill the message with scope summary
    const messageInput = document.getElementById('contact-message') as HTMLTextAreaElement | null;
    if (messageInput) {
      messageInput.value = scopeSummary;
      // Trigger native input change event if necessary
      messageInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (window.location.hash && window.location.hash !== '#home') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    resetScrollToTop();

    initScrollMomentum();
    const cleanup = initScrollReveals();

    const handleWindowLoad = () => {
      resetScrollToTop();
    };

    window.addEventListener('pageshow', handleWindowLoad);
    window.addEventListener('load', handleWindowLoad);

    const rafId = requestAnimationFrame(() => {
      resetScrollToTop();
    });

    return () => {
      window.removeEventListener('pageshow', handleWindowLoad);
      window.removeEventListener('load', handleWindowLoad);
      cancelAnimationFrame(rafId);
      if (cleanup) cleanup();
    };
  }, []);

  useEffect(() => {
    setScrollPaused(isProtocolOpen || isEstimatorOpen);
  }, [isProtocolOpen, isEstimatorOpen]);

  useEffect(() => {
    const handleScrollCheck = () => {
      if (window.scrollY > 120 && !isIntroComplete) {
        setIsIntroComplete(true);
      }
    };
    window.addEventListener('scroll', handleScrollCheck, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollCheck);
  }, [isIntroComplete]);

  const handleInquireFromWork = () => {
    smoothScrollTo('#contact', { offset: -80 });
  };

  return (
    <div className="min-h-screen bg-[#0c0c0d] text-[#e5e2e3] font-sans selection:bg-[#ffe08d]/20 selection:text-[#ffe08d] relative">

      {/* SECTION-SPECIFIC INTERACTIVE BACKGROUND SYSTEM */}
      <BackgroundSystem
        activeSection={activeSection}
        sectionProgressRef={sectionProgressRef}
      />

      {/* Fixed Navigation Header */}
      <Header
        isVisible={isIntroComplete}
        activeSection={activeSection}
        onOpenProtocol={() => setIsProtocolOpen(true)}
        onOpenEstimator={() => setIsEstimatorOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="w-full bg-transparent relative z-10">

        {/* 00: Home / ARTIFURA Intro Section */}
        <HomeIntro
          onIntroComplete={() => setIsIntroComplete(true)}
        />

        {/* 01: Hero / We Build What Comes Next Section */}
        <Hero
          onOpenEstimator={() => setIsEstimatorOpen(true)}
        />

        {/* 02: About / Identity & Ethos Section */}
        <About />

        {/* 03: Engineered Capabilities Section */}
        <Services
          onSelectService={handleSelectService}
        />

        {/* 04: Stack / Engineering Arsenal Section */}
        <Stack />

        {/* 05: Work / Featured Deployments Section */}
        <Work
          onInquire={handleInquireFromWork}
        />

        {/* 06: How We Work / Execution Lifecycle Section */}
        <Lifecycle />

        {/* 07: Network / Partner Engagement Section */}
        <Network
          onOpenEstimator={() => setIsEstimatorOpen(true)}
        />

        {/* 08: Contact / Project Inquiry Section */}
        <Contact
          initialService={selectedServiceForInquiry}
        />

      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Section Snap Navigator HUD */}
      <SnapNavigator
        isVisible={isIntroComplete}
        isModalOpen={isProtocolOpen || isEstimatorOpen}
        activeSectionId={activeSection}
      />

      {/* Interactive Modals */}
      <ProtocolModal
        isOpen={isProtocolOpen}
        onClose={() => setIsProtocolOpen(false)}
        onOpenEstimator={() => setIsEstimatorOpen(true)}
      />

      <ProjectEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
        onApplyScope={handleApplyScope}
      />

      {/* Real-time Performance Metrics HUD (Bottom Left) */}
      <PerformanceMetrics />

    </div>
  );
}
