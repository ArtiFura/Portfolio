import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import Intro from './components/Intro';
import About from './components/About';
import SystemInterlude from './components/SystemInterlude';
import Philosophy from './components/Philosophy';
import WhatWeDo from './components/WhatWeDo';
import Contact from './components/Contact';
import PerfDiagnostic from './components/PerfDiagnostic';
import ParticleField from './components/ParticleField';
import { initMomentumScroll } from './utils/momentumScroll';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    // 1. Initialize physical momentum scrolling layer
    const cleanupMomentum = initMomentumScroll();

    // 2. Refresh ScrollTrigger once DOM layout settles
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      cleanupMomentum();
    };
  }, []);

  return (
    <div className="app-container" id="top">
      {/* Living Atmospheric Background Field */}
      <ParticleField />

      {/* Precision Micro-Instruments */}
      <CustomCursor />
      <ScrollProgress />
      <Navigation />
      <PerfDiagnostic />

      {/* Structured Choreographed Studio Experiences */}
      <main id="main-content">
        <Intro />
        <About />
        <SystemInterlude />
        <Philosophy />
        <WhatWeDo />
        <Contact />
      </main>
    </div>
  );
}
