import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity,
  Gauge,
  Cpu,
  Layers,
  Clock,
  Minimize2,
  Maximize2,
  RotateCcw,
  X,
  Zap,
  TrendingDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface MetricsState {
  fps: number;
  minFps: number;
  maxFps: number;
  frameTime: number; // in ms
  domNodes: number;
  memoryUsed: number | null; // in MB
  memoryTotal: number | null; // in MB
  pageLoadTime: number | null; // in ms
  isScrolling: boolean;
  history: number[];
}

export const PerformanceMetrics: React.FC = () => {
  // HUD display modes: 'expanded' (full card), 'compact' (mini pill), 'hidden' (launcher button)
  const [mode, setMode] = useState<'expanded' | 'compact' | 'hidden'>('expanded');

  const [metrics, setMetrics] = useState<MetricsState>({
    fps: 60,
    minFps: 60,
    maxFps: 60,
    frameTime: 16.6,
    domNodes: 0,
    memoryUsed: null,
    memoryTotal: null,
    pageLoadTime: null,
    isScrolling: false,
    history: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const historyRef = useRef<number[]>([60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60]);
  const minFpsRef = useRef(60);
  const maxFpsRef = useRef(60);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  // Reset Min / Max statistics
  const resetStats = useCallback(() => {
    minFpsRef.current = metrics.fps;
    maxFpsRef.current = metrics.fps;
    historyRef.current = Array(16).fill(metrics.fps);
    setMetrics((prev) => ({
      ...prev,
      minFps: prev.fps,
      maxFps: prev.fps,
      history: Array(16).fill(prev.fps),
    }));
  }, [metrics.fps]);

  // Track scrolling status
  useEffect(() => {
    const handleScroll = () => {
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Main measurement loop
  useEffect(() => {
    let rafId: number;

    // Detect page load timing
    const checkNavigationTiming = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navEntries.length > 0) {
          const nav = navEntries[0];
          const duration = Math.round(
            nav.loadEventEnd > 0 ? nav.loadEventEnd : (nav.domContentLoadedEventEnd || nav.responseEnd || 0)
          );
          if (duration > 0) {
            setMetrics((prev) => ({ ...prev, pageLoadTime: duration }));
          }
        }
      }
    };

    checkNavigationTiming();
    window.addEventListener('load', checkNavigationTiming);

    let lastDomCheck = 0;

    const tick = (currentTime: number) => {
      frameCountRef.current++;
      const elapsed = currentTime - lastTimeRef.current;

      // Sample every 400ms for accurate and responsive updates without UI jank
      if (elapsed >= 400) {
        const calculatedFps = Math.min(144, Math.max(1, Math.round((frameCountRef.current * 1000) / elapsed)));
        const frameTime = Number((elapsed / frameCountRef.current).toFixed(1));

        // Update min and max
        if (calculatedFps < minFpsRef.current && calculatedFps > 5) {
          minFpsRef.current = calculatedFps;
        }
        if (calculatedFps > maxFpsRef.current) {
          maxFpsRef.current = calculatedFps;
        }

        // Maintain 16-point history
        historyRef.current = [...historyRef.current.slice(1), calculatedFps];

        // Sample memory (Chromium specific)
        let memUsed: number | null = null;
        let memTotal: number | null = null;
        const perf = window.performance as Performance & { memory?: PerformanceMemory };
        if (perf.memory) {
          memUsed = Math.round(perf.memory.usedJSHeapSize / (1024 * 1024));
          memTotal = Math.round(perf.memory.totalJSHeapSize / (1024 * 1024));
        }

        // Sample DOM elements every ~1.2s
        let domCount = metrics.domNodes;
        if (currentTime - lastDomCheck > 1200) {
          domCount = document.getElementsByTagName('*').length;
          lastDomCheck = currentTime;
        }

        setMetrics((prev) => ({
          ...prev,
          fps: calculatedFps,
          minFps: minFpsRef.current,
          maxFps: maxFpsRef.current,
          frameTime,
          domNodes: domCount || prev.domNodes,
          memoryUsed: memUsed,
          memoryTotal: memTotal,
          isScrolling: isScrollingRef.current,
          history: [...historyRef.current],
        }));

        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('load', checkNavigationTiming);
    };
  }, []);

  // Performance status tier
  const getFpsStatus = (fps: number) => {
    if (fps >= 55) return { color: '#4ade80', label: 'Optimal', bg: 'rgba(74, 222, 128, 0.12)' };
    if (fps >= 30) return { color: '#facc15', label: 'Moderate', bg: 'rgba(250, 204, 21, 0.12)' };
    return { color: '#f87171', label: 'Lag Detected', bg: 'rgba(248, 113, 113, 0.15)' };
  };

  const status = getFpsStatus(metrics.fps);

  // Hidden Mode Launcher
  if (mode === 'hidden') {
    return (
      <button
        onClick={() => setMode('expanded')}
        className="fixed bottom-4 left-4 z-50 p-2.5 rounded-xl bg-[#0e0e11]/90 backdrop-blur-md border border-[#4d4637]/60 text-[#ffe08d] shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:bg-[#1a1a20] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 group"
        title="Open Performance Metrics"
        aria-label="Open Performance Metrics"
      >
        <Gauge size={16} className="text-[#ffe08d] group-hover:rotate-45 transition-transform duration-300" />
        <span className="font-mono text-xs font-semibold text-[#e5e2e3]">
          {metrics.fps} <span className="text-[#99907e]">FPS</span>
        </span>
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: status.color }}
        />
      </button>
    );
  }

  // Compact Mini Pill Mode
  if (mode === 'compact') {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center select-none animate-fadeIn">
        <div
          onClick={() => setMode('expanded')}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#0c0c0e]/95 backdrop-blur-xl border border-[#4d4637]/70 shadow-[0_8px_30px_rgba(0,0,0,0.8)] cursor-pointer hover:border-[#ffe08d]/70 transition-all duration-200 group"
          title="Click to expand performance panel"
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: status.color, color: status.color }}
          />
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-xs font-bold text-[#e5e2e3] group-hover:text-[#ffe08d] transition-colors">
              {metrics.fps}
            </span>
            <span className="text-[10px] text-[#99907e]">FPS</span>
          </div>
          <span className="text-[#4d4637] text-xs">|</span>
          <span className="font-mono text-[10px] text-[#c4c7c5]">
            {metrics.frameTime}ms
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMode('expanded');
            }}
            className="text-[#99907e] hover:text-[#ffe08d] transition-colors p-0.5 rounded cursor-pointer"
            aria-label="Expand metrics"
          >
            <ChevronUp size={13} />
          </button>
        </div>
      </div>
    );
  }

  // Expanded HUD Window
  return (
    <div
      className="fixed bottom-4 left-4 z-50 w-72 rounded-xl bg-[#0c0c0e]/95 backdrop-blur-2xl border border-[#4d4637]/70 shadow-[0_16px_40px_rgba(0,0,0,0.85)] text-[#e5e2e3] select-none overflow-hidden transition-all duration-300 font-sans"
      role="region"
      aria-label="Performance HUD"
    >
      {/* Window Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#2a2824] bg-[#121215]/80">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: status.color, color: status.color }}
          />
          <div className="flex items-center gap-1.5">
            <Gauge size={13} className="text-[#ffe08d]" />
            <span className="font-mono text-[11px] font-bold tracking-wider text-[#e5e2e3]">
              PERF METRICS
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={resetStats}
            className="p-1 text-[#99907e] hover:text-[#ffe08d] hover:bg-[#201f20] rounded transition-colors cursor-pointer"
            title="Reset min/max statistics"
            aria-label="Reset statistics"
          >
            <RotateCcw size={12} />
          </button>
          <button
            onClick={() => setMode('compact')}
            className="p-1 text-[#99907e] hover:text-[#ffe08d] hover:bg-[#201f20] rounded transition-colors cursor-pointer"
            title="Minimize to pill"
            aria-label="Minimize"
          >
            <Minimize2 size={12} />
          </button>
          <button
            onClick={() => setMode('hidden')}
            className="p-1 text-[#99907e] hover:text-[#f87171] hover:bg-[#201f20] rounded transition-colors cursor-pointer"
            title="Close HUD"
            aria-label="Close"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Top Hero: Live FPS & Frame Time */}
        <div className="flex items-end justify-between bg-[#151518]/90 p-2.5 rounded-lg border border-[#2a2824]">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#99907e] mb-0.5 flex items-center gap-1.5">
              <span>Frame Rate</span>
              {metrics.isScrolling && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-[#ffe08d]/10 text-[#ffe08d] font-sans">
                  scrolling
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ color: status.color }}
              >
                {metrics.fps}
              </span>
              <span className="text-xs text-[#99907e]">FPS</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#99907e] mb-0.5">
              Frame Latency
            </div>
            <div className="font-mono text-sm font-semibold text-[#c4c7c5]">
              {metrics.frameTime} <span className="text-[10px] text-[#99907e]">ms</span>
            </div>
          </div>
        </div>

        {/* Live FPS Sparkline Graph */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#99907e]">
            <span>Live Stability (60Hz target)</span>
            <span className="text-[#c4c7c5]">
              Min: <span className="text-[#facc15]">{metrics.minFps}</span> | Max: <span className="text-[#4ade80]">{metrics.maxFps}</span>
            </span>
          </div>

          {/* SVG Sparkline */}
          <div className="h-8 w-full bg-[#141416] rounded border border-[#222225] p-1 flex items-end gap-1">
            {metrics.history.map((val, idx) => {
              // height percentage based on max 60 or 120 fps
              const target = Math.max(60, metrics.maxFps);
              const heightPct = Math.max(8, Math.min(100, Math.round((val / target) * 100)));
              const barColor = val >= 55 ? '#4ade80' : val >= 30 ? '#facc15' : '#f87171';

              return (
                <div
                  key={idx}
                  className="flex-1 rounded-xs transition-all duration-300"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: barColor,
                    opacity: idx === metrics.history.length - 1 ? 1 : 0.45 + (idx / metrics.history.length) * 0.5,
                  }}
                  title={`${val} FPS`}
                />
              );
            })}
          </div>
        </div>

        {/* Essential Performance Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          {/* JS Heap Memory */}
          <div className="p-2 rounded-lg bg-[#141417]/80 border border-[#222225] flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[#99907e] text-[10px]">
              <Cpu size={12} className="text-[#ffe08d]" />
              <span>JS Heap</span>
            </div>
            <div className="mt-1 font-semibold text-[#e5e2e3]">
              {metrics.memoryUsed !== null ? (
                <>
                  <span>{metrics.memoryUsed}</span>
                  <span className="text-[10px] text-[#99907e] font-normal"> / {metrics.memoryTotal} MB</span>
                </>
              ) : (
                <span className="text-[10px] text-[#99907e]">Protected</span>
              )}
            </div>
          </div>

          {/* DOM Elements */}
          <div className="p-2 rounded-lg bg-[#141417]/80 border border-[#222225] flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[#99907e] text-[10px]">
              <Layers size={12} className="text-[#ffe08d]" />
              <span>DOM Elements</span>
            </div>
            <div className="mt-1 font-semibold text-[#e5e2e3]">
              {metrics.domNodes > 0 ? (
                <>
                  <span>{metrics.domNodes}</span>
                  <span className="text-[10px] text-[#99907e] font-normal"> nodes</span>
                </>
              ) : (
                <span className="text-[10px] text-[#99907e]">Counting...</span>
              )}
            </div>
          </div>

          {/* Page Load Duration */}
          <div className="p-2 rounded-lg bg-[#141417]/80 border border-[#222225] flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[#99907e] text-[10px]">
              <Clock size={12} className="text-[#ffe08d]" />
              <span>Page Load</span>
            </div>
            <div className="mt-1 font-semibold text-[#e5e2e3]">
              {metrics.pageLoadTime !== null ? (
                <>
                  <span>{metrics.pageLoadTime}</span>
                  <span className="text-[10px] text-[#99907e] font-normal"> ms</span>
                </>
              ) : (
                <span className="text-[10px] text-[#99907e]">Ready</span>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="p-2 rounded-lg bg-[#141417]/80 border border-[#222225] flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[#99907e] text-[10px]">
              <Activity size={12} className="text-[#ffe08d]" />
              <span>Status</span>
            </div>
            <div
              className="mt-1 font-semibold text-[11px] truncate flex items-center gap-1"
              style={{ color: status.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
              <span>{status.label}</span>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="flex items-center justify-between text-[9px] font-mono text-[#666055] pt-0.5 border-t border-[#1e1e22]">
          <span>ARTIFURA ENGINE</span>
          <span className="text-[#99907e]">
            {metrics.fps >= 55 ? '16.6ms / frame budget' : 'frame drop warning'}
          </span>
        </div>
      </div>
    </div>
  );
};
