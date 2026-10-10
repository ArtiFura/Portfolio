import React, { useState, useEffect } from 'react';
import { ArrowRight, Radio } from 'lucide-react';
import { CASE_STUDIES, CaseStudy, TELEMETRY_NODES, ClickOrigin } from '../data/artifuraData';
import { CaseStudyModal } from './CaseStudyModal';
import { SectionDivider } from './SectionDivider';
import { handleSpotlightMove } from '../utils/scrollManager';

interface WorkProps {
  onInquire: () => void;
}

export const Work: React.FC<WorkProps> = ({ onInquire }) => {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [caseStudyOrigin, setCaseStudyOrigin] = useState<ClickOrigin | null>(null);
  const [activeRegionIndex, setActiveRegionIndex] = useState(0);

  const handleOpenCaseStudy = (caseStudy: CaseStudy, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setCaseStudyOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    });
    setSelectedCaseStudy(caseStudy);
  };
  const [telemetryJitter, setTelemetryJitter] = useState({
    throughput: 48.2,
    latency: 1.42,
    nodes: 140,
  });

  const currentRegion = TELEMETRY_NODES[activeRegionIndex];

  // Subtle real-time heartbeat simulation for live telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryJitter((prev) => {
        const deltaLatency = (Math.random() * 0.08 - 0.04);
        const deltaThroughput = (Math.random() * 0.6 - 0.3);
        const baseLatency = activeRegionIndex === 0 ? 1.42 : activeRegionIndex === 1 ? 2.18 : 1.85;
        const baseThroughput = activeRegionIndex === 0 ? 48.2 : activeRegionIndex === 1 ? 74.6 : 39.8;

        return {
          throughput: Number((baseThroughput + deltaThroughput).toFixed(1)),
          latency: Number((baseLatency + deltaLatency).toFixed(2)),
          nodes: prev.nodes,
        };
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [activeRegionIndex]);

  return (
    <section className="snap-section w-full min-h-[calc(100vh-5rem)] pb-16 md:pb-24 bg-transparent relative" id="work">
      {/* Section Divider */}
      <SectionDivider
        number="04"
        label="WORK"
        targetId="work"
        nextId="approach"
      />
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 w-full">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-16 md:mb-20">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-[#ffe08d] font-semibold font-mono">
                04 / WORK
              </span>
              <span className="h-[1px] w-12 bg-[#ffe08d]/40"></span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-sans text-[#e5e2e3] font-semibold tracking-tight uppercase">
              Selected Work
            </h2>
          </div>
          <p className="text-sm md:text-base text-[#c6c6cf] max-w-md">
            Recent projects in web development, mobile applications, and cloud systems.
          </p>
        </div>

        {/* Projects Stack */}
        <div className="cards-focus-group flex flex-col gap-6 sm:gap-8 md:gap-12 py-2 sm:py-4">

          {/* Project 1: Aethel AI Analytics */}
          <div
            onMouseMove={handleSpotlightMove}
            className="card-focus-item-lg card-interactive spotlight-card bg-[#181819] border border-[#4d4637]/40 rounded-2xl overflow-hidden group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-7 relative bg-[#0e0e0f] overflow-hidden flex items-center justify-center p-4 lg:p-8">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1XCGEEgKHN3s5Qi9TTuLeowcLXcGyvtfpNJ67yOJdnKAjmmD_Qn4B_oRliQqVgiCra3W68GIHlD0dfjOoEB0mNcNBZRfTItWbwtQIZPPUeQRBu5QYkDKKshGFR1N2JeSec1XhGVZapVy18R1t4-w1yt1WCwrgpDgE9pBDgIH0qu_6qVxG0kLxwAbMBm8s2F0i9TKtJrv44vkzMmk1mtSdZhqQh982d-3R6PNZ9-k49J6mIxW21k8x4Eug"
                  alt="Aethel AI Analytics Platform on Desktop Display"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover rounded-lg shadow-xl border border-[#4d4637]/20 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] uppercase tracking-widest text-[#ffe08d] font-semibold font-mono">
                      WEB &amp; AI
                    </span>
                  </div>

                  <h3 className="text-2xl lg:text-3xl text-[#e5e2e3] font-semibold tracking-tight mb-3 group-hover:text-[#ffe08d] transition-colors duration-300">
                    Aethel AI Analytics
                  </h3>

                  <p className="text-sm text-[#c6c6cf] leading-relaxed mb-6">
                    Financial intelligence and forecasting platform with real-time market data streaming and risk simulation.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {['Next.js', 'Python', 'PyTorch', 'ClickHouse'].map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded bg-[#201f20] border border-[#4d4637]/30 text-xs font-mono text-[#c6c6cf] hover:border-[#ffe08d]/40 hover:text-[#e5e2e3] transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => handleOpenCaseStudy(CASE_STUDIES[0], e)}
                  className="btn-interactive inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#ffe08d] hover:text-[#e5c365] font-semibold group/link text-left w-fit"
                >
                  <span>View Case Study</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Project 2: LogiFlow Dispatch */}
          <div
            onMouseMove={handleSpotlightMove}
            className="card-focus-item-lg card-interactive spotlight-card bg-[#181819] border border-[#4d4637]/40 rounded-2xl overflow-hidden group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">

              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between order-2 lg:order-1">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] uppercase tracking-widest text-[#ffe08d] font-semibold font-mono">
                      MOBILE &amp; ROUTING
                    </span>
                  </div>

                  <h3 className="text-2xl lg:text-3xl text-[#e5e2e3] font-semibold tracking-tight mb-3 group-hover:text-[#ffe08d] transition-colors duration-300">
                    LogiFlow Dispatch
                  </h3>

                  <p className="text-sm text-[#c6c6cf] leading-relaxed mb-6">
                    Logistics routing and fleet management mobile app with dynamic driver dispatch and offline synchronization.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {['Flutter', 'Node.js', 'Maps API', 'Rust'].map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded bg-[#201f20] border border-[#4d4637]/30 text-xs font-mono text-[#c6c6cf] hover:border-[#ffe08d]/40 hover:text-[#e5e2e3] transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => handleOpenCaseStudy(CASE_STUDIES[1], e)}
                  className="btn-interactive inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#ffe08d] hover:text-[#e5c365] font-semibold group/link text-left w-fit"
                >
                  <span>View Case Study</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                </button>
              </div>

              <div className="lg:col-span-7 relative bg-[#0e0e0f] overflow-hidden flex items-center justify-center p-4 lg:p-8 order-1 lg:order-2">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1Wt3bW1G4EXNleWIhr1V3LEpyeC6WuJrWjeJTqMNAW5Tw4sVCSdmvZwMin3He9oFWrlNSjTsGfv1OHSh7ms6Vez7gQxRwdm_v1uLzOawAoSOMR2Hjqmv6lUcc5GvZdRVU6ms_fIS9lrBUGtYx0cu2nJqjuUhFMbaNKRpbehY7anKs6kHSjJgr8km0_ulto1hDB-vPVbjoFJ49tKFmPz0ZSND8HsYa-070Yr6X6yp-yQXqsasPu4W2GymbQ"
                  alt="LogiFlow Dispatch Mobile App Interface on Smartphone Desk Display"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover rounded-lg shadow-xl border border-[#4d4637]/20 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

            </div>
          </div>

          {/* Project 3: Kroma Cloud Engine */}
          <div
            onMouseMove={handleSpotlightMove}
            className="card-focus-item-lg card-interactive spotlight-card bg-[#181819] border border-[#4d4637]/40 rounded-2xl overflow-hidden group"
          >
            <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

              {/* Left Details */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-widest text-[#ffe08d] font-semibold font-mono">
                    CLOUD INFRASTRUCTURE
                  </span>
                  <span className="ml-2 px-2 py-0.5 rounded bg-[#ffe08d]/10 border border-[#ffe08d]/30 text-[10px] text-[#ffe08d] font-mono">
                    99.99% UPTIME
                  </span>
                </div>

                <h3 className="text-2xl lg:text-3xl text-[#e5e2e3] font-semibold tracking-tight group-hover:text-[#ffe08d] transition-colors duration-300">
                  Kroma Cloud Engine
                </h3>

                <p className="text-sm text-[#c6c6cf] leading-relaxed">
                  Distributed cloud infrastructure and asset pipeline built for high-throughput video and 3D rendering.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {['AWS', 'Docker', 'Rust', 'WebSockets'].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded bg-[#201f20] border border-[#4d4637]/30 text-xs font-mono text-[#c6c6cf] hover:border-[#ffe08d]/40 hover:text-[#e5e2e3] transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={(e) => handleOpenCaseStudy(CASE_STUDIES[2], e)}
                    className="btn-interactive inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#ffe08d] hover:text-[#e5c365] font-semibold group/link w-fit"
                  >
                    <span>View Case Study</span>
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Clean Architectural Metrics Card */}
              <div className="lg:col-span-6 p-6 bg-[#0e0e0f] border border-[#4d4637]/40 rounded-xl font-mono text-sm shadow-inner group-hover:border-[#ffe08d]/30 transition-colors duration-300">

                {/* Region Selector Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#4d4637]/30 text-[#99907e] text-xs">
                  <div className="flex items-center gap-2">
                    <Radio size={14} className="text-[#ffe08d]" />
                    <span>Region: {currentRegion.name}</span>
                  </div>
                  <span className="text-[#ffe08d] flex items-center gap-1.5 font-semibold">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Operational
                  </span>
                </div>

                {/* Region Selector Pills */}
                <div className="flex gap-1.5 mb-4">
                  {TELEMETRY_NODES.map((node, i) => (
                    <button
                      key={node.id}
                      onClick={() => setActiveRegionIndex(i)}
                      className={`btn-interactive px-2.5 py-1 rounded-md text-[10px] font-mono cursor-pointer ${activeRegionIndex === i
                        ? 'bg-[#ffe08d] text-[#3d2f00] font-semibold'
                        : 'bg-[#1c1b1c] text-[#99907e] hover:text-[#e5e2e3] border border-[#4d4637]/30'
                        }`}
                    >
                      {node.name}
                    </button>
                  ))}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#141415] border border-[#4d4637]/20">
                    <span className="text-[#99907e] block text-[10px] mb-1">Throughput</span>
                    <span className="text-[#ffe08d] font-semibold">{telemetryJitter.throughput} GB/s</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#141415] border border-[#4d4637]/20">
                    <span className="text-[#99907e] block text-[10px] mb-1">Latency</span>
                    <span className="text-[#ffe08d] font-semibold">{telemetryJitter.latency} ms</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#141415] border border-[#4d4637]/20">
                    <span className="text-[#99907e] block text-[10px] mb-1">Orchestration</span>
                    <span className="text-[#e5e2e3] truncate block">{currentRegion.orchestration}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#141415] border border-[#4d4637]/20">
                    <span className="text-[#99907e] block text-[10px] mb-1">Cluster Size</span>
                    <span className="text-[#e5e2e3]">{currentRegion.nodes}</span>
                  </div>
                </div>

                {/* Clean Status Line */}
                <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-[#99907e] border-t border-[#4d4637]/20">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    Zero-Downtime Rollout
                  </span>
                  <span>Multi-Region Active</span>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Case Study Deep Dive Modal */}
      <CaseStudyModal
        caseStudy={selectedCaseStudy}
        origin={caseStudyOrigin}
        onClose={() => {
          setSelectedCaseStudy(null);
          setCaseStudyOrigin(null);
        }}
        onInquire={onInquire}
      />
    </section>
  );
};
