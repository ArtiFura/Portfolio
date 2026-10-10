import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Clock, ArrowRight, Check, Copy, RefreshCw } from 'lucide-react';
import { SectionDivider } from './SectionDivider';
import { handleSpotlightMove } from '../utils/scrollManager';

interface ContactProps {
  initialService?: string;
}

export const Contact: React.FC<ContactProps> = ({ initialService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    services: initialService ? [initialService] : [] as string[],
    timeline: '3-6 Months',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    referenceId: string;
    timestamp: string;
  } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (initialService && !formData.services.includes(initialService)) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, initialService],
      }));
    }
  }, [initialService]);

  const handleServiceToggle = (serviceName: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceName)
        ? prev.services.filter((s) => s !== serviceName)
        : [...prev.services, serviceName],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `AR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmissionReceipt({
        referenceId: generatedId,
        timestamp: new Date().toLocaleTimeString(),
      });
    }, 1200);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@artifura.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      services: [],
      timeline: '3-6 Months',
      message: '',
    });
    setSubmissionReceipt(null);
  };

  return (
    <section className="snap-section w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center pb-16 md:pb-24 bg-transparent relative" id="contact">
      {/* Section Divider */}
      <SectionDivider
        number="07"
        label="CONTACT"
        targetId="contact"
      />
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 w-full">

        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="text-xs uppercase tracking-wider text-[#ffe08d] font-semibold font-mono">
            07 / CONTACT
          </span>
          <span className="h-[1px] w-12 bg-[#ffe08d]/40"></span>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">

          {/* Left Column */}
          <div className="scroll-reveal lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] uppercase text-[#e5e2e3] font-semibold tracking-tight leading-tight mb-4 sm:mb-6">
                Let&apos;s Build Together.
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-[#c6c6cf] leading-relaxed mb-6 sm:mb-8">
                Have an idea, project, or question? Reach out to discuss timeline, feasibility, and next steps.
              </p>

              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Location Card */}
                <div
                  onMouseMove={handleSpotlightMove}
                  className="card-interactive spotlight-card p-4 rounded-xl bg-[#1c1b1c]/80 border border-[#4d4637]/30 flex items-start gap-3.5 sm:gap-4 group"
                >
                  <div className="p-2.5 rounded-lg bg-[#0e0e0f] border border-[#4d4637]/40 text-[#ffe08d] group-hover:border-[#ffe08d] transition-colors">
                    <MapPin size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#99907e]">
                      Location
                    </span>
                    <span className="text-sm md:text-base text-[#e5e2e3] font-medium">
                      Tamil Nadu, India
                    </span>
                    <span className="text-xs text-[#c6c6cf]">
                      Available Worldwide
                    </span>
                  </div>
                </div>

                {/* Email Card */}
                <div
                  onMouseMove={handleSpotlightMove}
                  className="card-interactive spotlight-card p-4 rounded-xl bg-[#1c1b1c]/80 border border-[#4d4637]/30 flex items-start gap-4 group"
                >
                  <div className="p-2.5 rounded-lg bg-[#0e0e0f] border border-[#4d4637]/40 text-[#ffe08d] group-hover:border-[#ffe08d] transition-colors">
                    <Mail size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#99907e]">
                      Email
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href="mailto:hello@artifura.com"
                        className="text-interactive text-sm md:text-base text-[#e5e2e3] hover:text-[#ffe08d] transition-colors font-mono"
                      >
                        hello@artifura.com
                      </a>
                      <button
                        onClick={handleCopyEmail}
                        className="btn-interactive p-1.5 rounded-md bg-[#0e0e0f] border border-[#4d4637]/40 text-[#99907e] hover:text-[#ffe08d] hover:border-[#ffe08d]/50 transition-colors"
                        title="Copy email address"
                      >
                        {copiedEmail ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Response Card */}
                <div
                  onMouseMove={handleSpotlightMove}
                  className="card-interactive spotlight-card p-4 rounded-xl bg-[#1c1b1c]/80 border border-[#4d4637]/30 flex items-start gap-4 group"
                >
                  <div className="p-2.5 rounded-lg bg-[#0e0e0f] border border-[#4d4637]/40 text-[#ffe08d] group-hover:border-[#ffe08d] transition-colors">
                    <Clock size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#99907e]">
                      Response
                    </span>
                    <span className="text-sm md:text-base text-[#c6c6cf]">
                      Within 24 hours
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div
            onMouseMove={handleSpotlightMove}
            className="scroll-reveal delay-150 lg:col-span-7 bg-[#1c1b1c] border border-[#4d4637]/30 rounded-xl p-5 sm:p-8 md:p-10 shadow-lg card-interactive spotlight-card"
          >

            {submissionReceipt ? (
              <div className="py-8 text-center space-y-5 animate-fadeIn">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#ffe08d]/10 border border-[#ffe08d]/40 flex items-center justify-center text-[#ffe08d]">
                  <Check size={28} />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-[#e5e2e3] tracking-tight mb-2">
                    Message Sent
                  </h3>
                  <p className="text-sm text-[#c6c6cf] max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#ffe08d]">{formData.name || 'there'}</strong>. We received your note and will get back to you within 24 hours.
                  </p>
                </div>

                <button
                  onClick={resetForm}
                  className="btn-interactive inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2a2a2b] hover:bg-[#353436] text-xs font-mono text-[#ffe08d]"
                >
                  <RefreshCw size={13} />
                  <span>Send Another Message</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6" id="artifura-contact-form">

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-name" className="text-xs uppercase font-mono tracking-wider text-[#99907e]">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Marcus Vance"
                      className="input-interactive w-full bg-[#0e0e0f] border border-[#4d4637]/40 rounded-lg px-4 py-3 text-base sm:text-sm text-[#e5e2e3] placeholder:text-[#99907e]/40"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="text-xs uppercase font-mono tracking-wider text-[#99907e]">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. marcus@company.com"
                      className="input-interactive w-full bg-[#0e0e0f] border border-[#4d4637]/40 rounded-lg px-4 py-3 text-base sm:text-sm text-[#e5e2e3] placeholder:text-[#99907e]/40"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-company" className="text-xs uppercase font-mono tracking-wider text-[#99907e]">
                    Company / Organization
                  </label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Vance Logistics Corp"
                    className="input-interactive w-full bg-[#0e0e0f] border border-[#4d4637]/40 rounded-lg px-4 py-3 text-base sm:text-sm text-[#e5e2e3] placeholder:text-[#99907e]/40"
                  />
                </div>

                {/* Services multi-select tags */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-[#99907e]">
                    Services Needed
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Web Development',
                      'Software Development',
                      'UI / UX Design',
                      'AI & Automation',
                      'Mobile Applications',
                      'Digital Solutions & Audits',
                    ].map((serviceName) => {
                      const isSelected = formData.services.includes(serviceName);
                      return (
                        <button
                          key={serviceName}
                          type="button"
                          onClick={() => handleServiceToggle(serviceName)}
                          className={`btn-interactive px-3 py-1.5 rounded-lg text-xs font-mono ${isSelected
                              ? 'bg-[#ffe08d] text-[#3d2f00] font-semibold shadow-sm border border-[#ffe08d]'
                              : 'bg-[#0e0e0f] text-[#c6c6cf] hover:text-[#e5e2e3] border border-[#4d4637]/40'
                            }`}
                        >
                          {serviceName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-xs uppercase font-mono tracking-wider text-[#99907e]">
                    Project Details *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project, timeline, or requirements..."
                    className="input-interactive w-full bg-[#0e0e0f] border border-[#4d4637]/40 rounded-lg px-4 py-3 text-base sm:text-sm text-[#e5e2e3] placeholder:text-[#99907e]/40 resize-none"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-interactive w-full bg-[#ffe08d] text-[#3d2f00] text-xs uppercase tracking-wider py-4 rounded-lg shadow-md flex items-center justify-center gap-2 font-semibold group cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin text-[#3d2f00]" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

