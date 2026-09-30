import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Headphones, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  ShieldCheck, 
  ArrowRight,
  Wind,
  PhoneCall,
  Smile
} from 'lucide-react';
import { CardIconBadge } from './CardIconBadge';

interface TelemanasSanctuaryGraphicProps {
  onOpenTelemanas: () => void;
}

export const TelemanasSanctuaryGraphic: React.FC<TelemanasSanctuaryGraphicProps> = ({
  onOpenTelemanas,
}) => {
  const [breathingPhase, setBreathingPhase] = useState<'INHALE' | 'HOLD' | 'EXHALE'>('INHALE');
  const [breathCount, setBreathCount] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(true);

  // 4-7-8 breathing cycle timer
  useEffect(() => {
    if (!isBreathingActive) return;

    let timer: NodeJS.Timeout;
    if (breathCount > 1) {
      timer = setTimeout(() => {
        setBreathCount(prev => prev - 1);
      }, 1000);
    } else {
      if (breathingPhase === 'INHALE') {
        setBreathingPhase('HOLD');
        setBreathCount(7);
      } else if (breathingPhase === 'HOLD') {
        setBreathingPhase('EXHALE');
        setBreathCount(8);
      } else {
        setBreathingPhase('INHALE');
        setBreathCount(4);
      }
    }
    return () => clearTimeout(timer);
  }, [breathCount, breathingPhase, isBreathingActive]);

  return (
    <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-indigo-50/50 rounded-2xl border border-emerald-100 p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <span>Tele-MANAS Clinical Sanctuary (Toll-Free 14416)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                MoHFW Certified
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              National Mental Health Programme psychological first-aid & distress de-escalation for frontline medical workers
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTelemanas}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-xs transition-all self-start sm:self-auto min-h-[40px]"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Launch Tele-MANAS Triage Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Interactive Botanical Breathing Graphic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Interactive Botanical Breathing Mandala SVG */}
        <div className="lg:col-span-6 bg-white/90 rounded-2xl border border-emerald-100 p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden">
          
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            
            {/* Animated Pulsing Botanical Waves */}
            <svg viewBox="0 0 200 200" className="w-full h-full select-none" fill="none">
              <defs>
                <radialGradient id="lotusGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0D9488" stopOpacity="0.02" />
                </radialGradient>
              </defs>

              <circle cx="100" cy="100" r="90" fill="url(#lotusGlow)" />
              
              {/* Petals */}
              <g stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.6">
                <circle cx="100" cy="65" r="30" />
                <circle cx="100" cy="135" r="30" />
                <circle cx="65" cy="100" r="30" />
                <circle cx="135" cy="100" r="30" />
                <circle cx="75" cy="75" r="30" strokeDasharray="3 3" />
                <circle cx="125" cy="75" r="30" strokeDasharray="3 3" />
                <circle cx="75" cy="125" r="30" strokeDasharray="3 3" />
                <circle cx="125" cy="125" r="30" strokeDasharray="3 3" />
              </g>

              {/* Breathing Circle Ring */}
              <circle
                cx="100"
                cy="100"
                r="50"
                stroke="#059669"
                strokeWidth="4"
                strokeDasharray="314"
                strokeDashoffset={
                  breathingPhase === 'INHALE' 
                    ? 314 - ((4 - breathCount) / 4) * 314 
                    : breathingPhase === 'HOLD'
                    ? 0
                    : ((8 - breathCount) / 8) * 314
                }
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Inner Center Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                {breathingPhase}
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tabular-nums">
                {breathCount}s
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                4-7-8 Biofeedback
              </span>
            </div>
          </div>

          {/* Breathing Controls */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold transition-colors"
            >
              {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isBreathingActive ? 'Pause Breath Cycle' : 'Resume Breathing'}</span>
            </button>
            <span className="text-[11px] text-slate-400">
              Autonomic nervous system stabilization
            </span>
          </div>
        </div>

        {/* Right Column: Key Pillars of MoHFW Tele-MANAS */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-white/90 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2">
                <CardIconBadge icon={<Headphones className="w-4 h-4" />} variant="indigo" size="sm" />
                <div className="font-bold text-slate-900 text-xs">24/7 Multi-Lingual</div>
              </div>
              <p className="text-[11px] text-slate-600 mt-1.5">
                Counselling in Hindi, Marathi, Tamil & 20 regional Indian languages.
              </p>
            </div>

            <div className="p-3 bg-white/90 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2">
                <CardIconBadge icon={<Volume2 className="w-4 h-4" />} variant="teal" size="sm" />
                <div className="font-bold text-slate-900 text-xs">528Hz Solfeggio</div>
              </div>
              <p className="text-[11px] text-slate-600 mt-1.5">
                Acoustic frequency harmonic chimes tuned for acute cortisol reduction.
              </p>
            </div>
          </div>

          <div className="p-3 bg-white/90 rounded-xl border border-emerald-100 space-y-1.5">
            <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
              <span>Standardized Clinical Scales</span>
              <span className="text-emerald-700 font-mono text-[10px]">PHQ-9 & GAD-7 Validated</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Provides automated severity grading: Mild (0-4), Moderate (5-9), Severe (10-14), and Crisis (15+) with immediate psychiatric bed locking protocols.
            </p>
          </div>

          <div className="p-2.5 bg-emerald-100/60 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-950 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Confidentiality Guarantee:</strong> Zero PII logged. Encrypted audit tokens with ML-DSA-65 signatures.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
