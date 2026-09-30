import React from 'react';
import { 
  Lock, 
  Eye, 
  CheckCircle2, 
  TrendingUp, 
  BrainCircuit, 
  HeartHandshake, 
  Cpu, 
  Bed, 
  FileCheck, 
  Truck, 
  DoorOpen, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export interface LoopStep {
  name: string;
  subsystem: string;
  icon: React.ReactNode;
  tabTarget: string;
  description: string;
}

interface MasterLoopBarProps {
  activeStepIndex: number;
  onSelectStep: (index: number) => void;
}

export const MASTER_STEPS: LoopStep[] = [
  { name: 'Authenticate', subsystem: 'Identity & Context', icon: <Lock className="w-3.5 h-3.5" />, tabTarget: 'live-state', description: 'Zero-friction role & facility session auto-population' },
  { name: 'Observe', subsystem: 'Live Health State', icon: <Eye className="w-3.5 h-3.5" />, tabTarget: 'live-state', description: 'Freshness-aware inventory, bed and service capability mesh' },
  { name: 'Validate', subsystem: 'Data Quality Intel', icon: <CheckCircle2 className="w-3.5 h-3.5" />, tabTarget: 'live-state', description: 'Detect negative stock, stale timestamps, anomalous jumps' },
  { name: 'Predict', subsystem: 'Forecast Service', icon: <TrendingUp className="w-3.5 h-3.5" />, tabTarget: 'supply-forecast', description: '24h, 7d, 14d, 30d demand forecast with Vertex AI ML' },
  { name: 'Explain', subsystem: 'XAI & Gemini', icon: <BrainCircuit className="w-3.5 h-3.5" />, tabTarget: 'gemini-xai', description: 'SHAP factors, confidence bands, transparent evidence packets' },
  { name: 'Match', subsystem: 'Care Availability', icon: <HeartHandshake className="w-3.5 h-3.5" />, tabTarget: 'referral-care', description: 'Care = Bed × Staff × Equipment × Required Service' },
  { name: 'Optimize', subsystem: 'OR-Tools Engine', icon: <Cpu className="w-3.5 h-3.5" />, tabTarget: 'supply-forecast', description: 'Safe surplus discovery respecting donor safety reserves' },
  { name: 'Reserve', subsystem: 'Digital Bed Hold', icon: <Bed className="w-3.5 h-3.5" />, tabTarget: 'referral-care', description: 'Soft hold lock with 15-minute expiration countdown' },
  { name: 'Approve', subsystem: 'Lightweight PQC', icon: <FileCheck className="w-3.5 h-3.5" />, tabTarget: 'pqc-ledger', description: 'Officer ML-DSA-65 post-quantum digital signature' },
  { name: 'Transfer', subsystem: 'Ambulance Fleet', icon: <Truck className="w-3.5 h-3.5" />, tabTarget: 'ambulance-fleet', description: 'ALS/BLS dispatch, live ETA, digital referral packet' },
  { name: 'Admit', subsystem: 'Admission Service', icon: <DoorOpen className="w-3.5 h-3.5" />, tabTarget: 'referral-care', description: 'Patient arrival handshake and bed state transition to OCCUPIED' },
  { name: 'Verify', subsystem: 'Crypto Agility', icon: <ShieldCheck className="w-3.5 h-3.5" />, tabTarget: 'pqc-ledger', description: 'Quantum-resistant signature verification and receipt' },
  { name: 'Audit', subsystem: 'Permissioned Ledger', icon: <BookOpen className="w-3.5 h-3.5" />, tabTarget: 'pqc-ledger', description: 'Append-only event chain, SHA-256 Merkle root verification' },
  { name: 'Learn', subsystem: 'Federated Mesh', icon: <Sparkles className="w-3.5 h-3.5" />, tabTarget: 'gemini-xai', description: 'Regional model weight aggregation without raw data sharing' },
];

export const MasterLoopBar: React.FC<MasterLoopBarProps> = ({
  activeStepIndex,
  onSelectStep,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-xs border-b border-emerald-100 py-2 sm:py-2.5 px-3 sm:px-6 lg:px-8 shadow-2xs">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="font-bold text-emerald-950 tracking-wide uppercase text-[11px] sm:text-xs shrink-0">
              Master Protocol
            </span>
            <span className="text-emerald-200 hidden sm:inline">·</span>
            <span className="text-slate-500 text-[11px] sm:text-xs truncate hidden sm:inline">
              Mindful Closed-Loop Coordination
            </span>
          </div>
          <div className="text-[11px] sm:text-xs text-emerald-800 font-medium shrink-0">
            Active: <span className="font-bold text-emerald-950">{MASTER_STEPS[activeStepIndex]?.name}</span>
          </div>
        </div>

        {/* Horizontal scrollable step ribbon with touch momentum */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 touch-pan-x scrollbar-none">
          {MASTER_STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            const isCompleted = idx < activeStepIndex;

            return (
              <React.Fragment key={step.name}>
                <button
                  onClick={() => onSelectStep(idx)}
                  title={`${step.name}: ${step.description}`}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border min-h-[36px] active:scale-95 ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs font-semibold'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100/60'
                      : 'bg-white text-slate-600 border-slate-200/80 hover:bg-emerald-50/50 hover:text-emerald-900'
                  }`}
                >
                  <span className={`${isActive ? 'text-white' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {step.icon}
                  </span>
                  <span>{step.name}</span>
                </button>

                {idx < MASTER_STEPS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-emerald-200 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
