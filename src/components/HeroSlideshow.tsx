import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Truck, 
  Pill, 
  HeartHandshake, 
  Headphones, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Database,
  Building2,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  category: 'TITLE' | 'PROBLEM' | 'USE_CASES';
  actionLabel: string;
  actionTab: string;
  metrics: { label: string; value: string; detail: string }[];
  illustration: React.ReactNode;
}

interface HeroSlideshowProps {
  onNavigateTab: (tabId: string) => void;
  onSelectRole?: (role: any) => void;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ onNavigateTab }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const slides: HeroSlide[] = [
    {
      id: 'title-slide',
      category: 'TITLE',
      badge: 'SwasthyaSetu Resilience Grid 2.0',
      title: 'Decentralized Healthcare Operations & Tele-MANAS Grid',
      subtitle: 'Synchronizing 30 facilities, real-time bed capability matching, mathematical medicine redistribution, and post-quantum cryptographic audit ledgers across state districts.',
      actionLabel: 'Explore Live Operations',
      actionTab: 'live-state',
      metrics: [
        { label: 'Synchronized Units', value: '30 Nodes', detail: '20 PHCs, 5 CHCs, 3 Hospitals' },
        { label: 'PQC Quantum Security', value: 'ML-DSA-65', detail: 'NIST FIPS 204 Validated' },
        { label: 'Audit Provenance', value: '14,208 Blocks', detail: 'Zero crypto token overhead' },
      ],
      illustration: (
        <svg viewBox="0 0 540 320" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#0D9488" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="emeraldTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#065F46" />
            </linearGradient>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid Mesh */}
          <rect width="540" height="320" rx="20" fill="url(#gridGrad)" />
          <circle cx="270" cy="160" r="140" fill="url(#glow)" />

          {/* Interconnected Isometric Nodes and Conduits */}
          <g stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
            <line x1="120" y1="180" x2="270" y2="120" />
            <line x1="270" y1="120" x2="420" y2="170" />
            <line x1="270" y1="120" x2="270" y2="240" />
            <line x1="120" y1="180" x2="270" y2="240" />
            <line x1="420" y1="170" x2="270" y2="240" />
          </g>

          {/* Central Command Hub: Medical Shield */}
          <g transform="translate(230, 80)">
            <rect x="0" y="0" width="80" height="80" rx="20" fill="url(#emeraldTeal)" />
            <path d="M40 22L58 28V46C58 57 50 67 40 70C30 67 22 57 22 46V28L40 22Z" fill="white" fillOpacity="0.2" />
            {/* Medical Cross */}
            <path d="M40 32V52M30 42H50" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <circle cx="40" cy="42" r="28" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
          </g>

          {/* Peripheral Node 1: PHC Primary Health Center */}
          <g transform="translate(80, 150)">
            <rect width="80" height="64" rx="14" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="1.5" />
            <rect x="12" y="14" width="20" height="20" rx="6" fill="#ECFDF5" />
            <path d="M22 18V30M16 24H28" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
            <text x="38" y="26" fill="#065F46" fontSize="10" fontWeight="bold" fontFamily="Segoe UI">PHC-A</text>
            <text x="38" y="38" fill="#059669" fontSize="9" fontFamily="Segoe UI">Online 100%</text>
            <circle cx="68" cy="14" r="3.5" fill="#10B981" />
          </g>

          {/* Peripheral Node 2: District Referral Hospital */}
          <g transform="translate(380, 140)">
            <rect width="86" height="66" rx="14" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1.5" />
            <rect x="12" y="14" width="20" height="20" rx="6" fill="#F0F9FF" />
            <rect x="17" y="19" width="10" height="10" rx="2" fill="#0284C7" />
            <text x="38" y="26" fill="#0C4A6E" fontSize="10" fontWeight="bold" fontFamily="Segoe UI">Hospital</text>
            <text x="38" y="38" fill="#0284C7" fontSize="9" fontFamily="Segoe UI">12 Beds Ready</text>
            <circle cx="74" cy="14" r="3.5" fill="#0284C7" />
          </g>

          {/* Peripheral Node 3: Ambulance 108 Emergency Mobile Transport */}
          <g transform="translate(230, 220)">
            <rect width="84" height="60" rx="14" fill="#FFFFFF" stroke="#FED7AA" strokeWidth="1.5" />
            <path d="M16 34H36M22 28H30L34 34V42H16V34Z" fill="#FFF7ED" stroke="#EA580C" strokeWidth="1.5" />
            <circle cx="20" cy="42" r="3" fill="#EA580C" />
            <circle cx="30" cy="42" r="3" fill="#EA580C" />
            <text x="42" y="34" fill="#7C2D12" fontSize="10" fontWeight="bold" fontFamily="Segoe UI">ALS-108</text>
            <text x="42" y="46" fill="#EA580C" fontSize="9" fontFamily="Segoe UI">ETA 14 min</text>
          </g>

          {/* Live Data Packets (Pulsing Orbiters) */}
          <circle cx="195" cy="150" r="4.5" fill="#059669">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="345" cy="145" r="4.5" fill="#0284C7">
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      )
    },
    {
      id: 'problem-slide',
      category: 'PROBLEM',
      badge: 'The Section 17 Operational Dilemma',
      title: 'Resolving Blind Referrals & Rural Supply Depletions',
      subtitle: 'Critical patients frequently arrived at overloaded hospitals without available ICU beds, while rural PHCs exhausted life-saving medicines despite surplus stock sitting in nearby centers.',
      actionLabel: 'Inspect Care Match Engine',
      actionTab: 'referral-care',
      metrics: [
        { label: 'Blind Transfers Avoided', value: '100% Locked', detail: 'Zero patient turnaways' },
        { label: 'Hold Expiration Timer', value: '15 Minutes', detail: 'Auto-releases vacant capacity' },
        { label: 'Lead Time Buffer', value: '14-Day Reserve', detail: 'Mathematically enforced' },
      ],
      illustration: (
        <svg viewBox="0 0 540 320" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="probGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF1F2" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FEF3C7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          <rect width="540" height="320" rx="20" fill="url(#probGrad)" stroke="#FECDD3" strokeWidth="1" />

          {/* Left Column: Traditional Bottleneck (Red Alert) */}
          <g transform="translate(40, 40)">
            <rect width="210" height="240" rx="16" fill="#FFFFFF" stroke="#FDA4AF" strokeWidth="1.5" />
            <rect x="16" y="16" width="36" height="36" rx="10" fill="#FFE4E6" />
            <path d="M34 26V36M34 42H34.02" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
            <text x="60" y="32" fill="#9F1239" fontSize="13" fontWeight="bold" fontFamily="Segoe UI">The Blind Referral Risk</text>
            <text x="60" y="46" fill="#E11D48" fontSize="10" fontFamily="Segoe UI">Uncoordinated Dispatch</text>

            {/* Negative Scenario Graphic */}
            <g transform="translate(16, 68)">
              <rect width="178" height="52" rx="10" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="1" />
              <text x="12" y="22" fill="#881337" fontSize="10" fontWeight="bold" fontFamily="Segoe UI">Ambulance arriving blind</text>
              <text x="12" y="38" fill="#E11D48" fontSize="9" fontFamily="Segoe UI">❌ ICU Bed Full · Pulmonologist Off</text>
            </g>

            <g transform="translate(16, 130)">
              <rect width="178" height="52" rx="10" fill="#FEF2F2" />
              <text x="12" y="22" fill="#991B1B" fontSize="10" fontWeight="bold" fontFamily="Segoe UI">Stockout at Rural Clinic</text>
              <text x="12" y="38" fill="#DC2626" fontSize="9" fontFamily="Segoe UI">⚠️ Days of Supply: 1.2d (Lead time: 8d)</text>
            </g>

            <text x="16" y="210" fill="#64748B" fontSize="10" fontFamily="Segoe UI">Outcome: Delayed treatment & diversion</text>
          </g>

          {/* Transition Arrow */}
          <g transform="translate(258, 140)">
            <circle cx="12" cy="12" r="16" fill="#0D9488" />
            <path d="M8 12H16M16 12L12 8M16 12L12 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Right Column: SwasthyaSetu Solution (Green Safeguard) */}
          <g transform="translate(290, 40)">
            <rect width="210" height="240" rx="16" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="1.5" />
            <rect x="16" y="16" width="36" height="36" rx="10" fill="#ECFDF5" />
            <path d="M26 34L32 40L42 28" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <text x="60" y="32" fill="#065F46" fontSize="13" fontWeight="bold" fontFamily="Segoe UI">The Closed-Loop Fix</text>
            <text x="60" y="46" fill="#059669" fontSize="10" fontFamily="Segoe UI">Atomic Care Matching</text>

            <g transform="translate(16, 68)">
              <rect width="178" height="52" rx="10" fill="#ECFDF5" />
              <text x="12" y="22" fill="#065F46" fontSize="10" fontWeight="bold" fontFamily="Segoe UI">15-Min Soft Reservation</text>
              <text x="12" y="38" fill="#059669" fontSize="9" fontFamily="Segoe UI">✓ Bed + Doctor + Oxygen pre-locked</text>
            </g>

            <g transform="translate(16, 130)">
              <rect width="178" height="52" rx="10" fill="#F0FDF4" />
              <text x="12" y="22" fill="#166534" fontSize="10" fontWeight="bold" fontFamily="Segoe UI">OR-Tools Stock Redistribution</text>
              <text x="12" y="38" fill="#15803D" fontSize="9" fontFamily="Segoe UI">✓ Safe transfer from surplus PHC-B</text>
            </g>

            <text x="16" y="210" fill="#047857" fontSize="10" fontWeight="bold" fontFamily="Segoe UI">Outcome: 100% Care match guarantee</text>
          </g>
        </svg>
      )
    },
    {
      id: 'use-cases-slide',
      category: 'USE_CASES',
      badge: 'Unified Multi-Role Healthcare Workflows',
      title: 'Built for ASHA Workers, Doctors, and State Directors',
      subtitle: 'Tailored responsive workflows for every frontline clinician — with offline SQLite synchronization, Tele-MANAS emotional grounding, and explainable AI in Hindi, Marathi, and Tamil.',
      actionLabel: 'Launch Tele-MANAS Hub',
      actionTab: 'mental-health',
      metrics: [
        { label: 'Tele-MANAS Support', value: '14416 Ready', detail: 'Audio chimes + PHQ-9 scoring' },
        { label: 'Multilingual Gemini', value: '4 Languages', detail: 'Hindi, Marathi, Tamil, English' },
        { label: 'Offline Resilience', value: 'Full Local-First', detail: 'Syncs on reconnect' },
      ],
      illustration: (
        <svg viewBox="0 0 540 320" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="useCaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0FDF4" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
          </defs>

          <rect width="540" height="320" rx="20" fill="url(#useCaseGrad)" stroke="#E2E8F0" strokeWidth="1" />

          {/* 4 Interactive Feature Pillars */}
          <g transform="translate(30, 40)">
            {/* Box 1: Medical Officer Bed Coordination */}
            <g transform="translate(0, 0)">
              <rect width="225" height="105" rx="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="14" y="14" width="32" height="32" rx="8" fill="#EFF6FF" />
              <path d="M22 26V36M30 26V36M22 30H38V36" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
              <text x="56" y="28" fill="#1E293B" fontSize="12" fontWeight="bold" fontFamily="Segoe UI">1. Emergency Care Match</text>
              <text x="56" y="42" fill="#64748B" fontSize="10" fontFamily="Segoe UI">Doctor selects ICU + specialist</text>
              <text x="14" y="80" fill="#2563EB" fontSize="10" fontWeight="bold" fontFamily="Segoe UI">✓ Sub-second routing algorithms</text>
            </g>

            {/* Box 2: Pharmacist Supply Forecaster */}
            <g transform="translate(255, 0)">
              <rect width="225" height="105" rx="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="14" y="14" width="32" height="32" rx="8" fill="#FEF3C7" />
              <path d="M24 22L36 34M36 22L24 34" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
              <text x="56" y="28" fill="#1E293B" fontSize="12" fontWeight="bold" fontFamily="Segoe UI">2. Medicine Redistribution</text>
              <text x="56" y="42" fill="#64748B" fontSize="10" fontFamily="Segoe UI">Days of Supply (DoS) optimization</text>
              <text x="14" y="80" fill="#D97706" fontSize="10" fontWeight="bold" fontFamily="Segoe UI">✓ 14-day safety stocks protected</text>
            </g>

            {/* Box 3: Tele-MANAS Mental Health */}
            <g transform="translate(0, 125)">
              <rect width="225" height="105" rx="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="14" y="14" width="32" height="32" rx="8" fill="#ECFDF5" />
              <path d="M22 30C22 25 38 25 38 30V35C38 37 36 39 34 39H26C24 39 22 37 22 35V30Z" stroke="#059669" strokeWidth="2" />
              <text x="56" y="28" fill="#1E293B" fontSize="12" fontWeight="bold" fontFamily="Segoe UI">3. Tele-MANAS 14416</text>
              <text x="56" y="42" fill="#64748B" fontSize="10" fontFamily="Segoe UI">Distress triage & biofeedback</text>
              <text x="14" y="80" fill="#059669" fontSize="10" fontWeight="bold" fontFamily="Segoe UI">✓ 4-7-8 breathing & 528Hz chimes</text>
            </g>

            {/* Box 4: Multilingual XAI Reasoning */}
            <g transform="translate(255, 125)">
              <rect width="225" height="105" rx="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="14" y="14" width="32" height="32" rx="8" fill="#F3E8FF" />
              <path d="M26 24H34M24 30H36M28 36H32" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
              <text x="56" y="28" fill="#1E293B" fontSize="12" fontWeight="bold" fontFamily="Segoe UI">4. Multilingual Gemini XAI</text>
              <text x="56" y="42" fill="#64748B" fontSize="10" fontFamily="Segoe UI">Tool provenance & root cause</text>
              <text x="14" y="80" fill="#9333EA" fontSize="10" fontWeight="bold" fontFamily="Segoe UI">✓ Hindi, Marathi & Tamil output</text>
            </g>
          </g>
        </svg>
      )
    }
  ];

  // Auto-play timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      }, 7500);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const activeSlide = slides[currentSlideIndex];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className={`relative overflow-hidden bg-white border border-emerald-100/90 rounded-2xl shadow-xs transition-all ${
      isExpanded ? 'p-6 sm:p-8' : 'p-4 sm:p-6'
    }`}>
      {/* Top Presentation Bar */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Presentation & Architectural Overview
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-500 font-mono">
            Slide {currentSlideIndex + 1} of {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            title={isAutoPlaying ? 'Pause automatic slide rotation' : 'Start auto presentation'}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-emerald-800 bg-slate-50 hover:bg-emerald-50 rounded-lg transition-colors font-medium"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{isAutoPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title="Toggle presentation display size"
            className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Slide Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Editorial Information with Segoe UI Semibold Typography */}
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-md border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            {activeSlide.badge}
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 leading-tight" style={{ fontFamily: 'Segoe UI, Segoe UI Semibold, sans-serif' }}>
            {activeSlide.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
            {activeSlide.subtitle}
          </p>

          {/* Key Metrics / Evidence Ribbon */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {activeSlide.metrics.map((m, i) => (
              <div key={i} className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                <div className="text-[11px] text-slate-500 truncate">{m.label}</div>
                <div className="text-sm font-bold text-slate-900 font-mono tabular-nums mt-0.5">{m.value}</div>
                <div className="text-[10px] text-emerald-700 truncate mt-0.5">{m.detail}</div>
              </div>
            ))}
          </div>

          {/* Direct Slide Navigation & Primary CTA Button */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigateTab(activeSlide.actionTab)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-all min-h-[44px]"
            >
              <span>{activeSlide.actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Slide Navigation Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                aria-label="Previous Slide"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Slide"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: High-Fidelity Vector Graphical Illustration */}
        <div className="lg:col-span-6 bg-slate-50/50 p-2 sm:p-4 rounded-2xl border border-slate-100 flex items-center justify-center min-h-[260px] sm:min-h-[300px]">
          {activeSlide.illustration}
        </div>
      </div>

      {/* Slide Thumbnails & Progress Indicators */}
      <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-2 transition-all rounded-full ${
                idx === currentSlideIndex 
                  ? 'w-8 bg-emerald-600' 
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
              title={`Go to slide ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>

        <div className="text-[11px] text-slate-400 font-medium">
          Optimized for Segoe UI & high-dpi projection
        </div>
      </div>
    </div>
  );
};
