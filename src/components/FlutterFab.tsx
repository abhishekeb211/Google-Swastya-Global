import React, { useState } from 'react';
import { 
  Zap, 
  X, 
  Pill, 
  HeartHandshake, 
  Database, 
  Sparkles, 
  Play, 
  ChevronUp
} from 'lucide-react';

interface FlutterFabProps {
  onLaunchScenario1: () => void;
  onLaunchScenario2: () => void;
  onOpenSync: () => void;
  onOpenGemini: () => void;
  onOpenMentalHealth?: () => void;
  pendingSyncCount: number;
}

export const FlutterFab: React.FC<FlutterFabProps> = ({
  onLaunchScenario1,
  onLaunchScenario2,
  onOpenSync,
  onOpenGemini,
  onOpenMentalHealth,
  pendingSyncCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6">
      {/* Speed Dial Menu Sheet */}
      {isOpen && (
        <div 
          className="mb-3 space-y-2.5 animate-in slide-in-from-bottom-5 fade-in duration-200"
        >
          <button
            onClick={() => {
              setIsOpen(false);
              onLaunchScenario1();
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-emerald-950 rounded-2xl shadow-lg border border-emerald-100 hover:bg-emerald-50/50 transition-all text-xs font-semibold w-full justify-start active:scale-95 min-h-[44px]"
          >
            <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Pill className="w-4 h-4" />
            </div>
            <span>Scenario 1: Medicine Shortage</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onLaunchScenario2();
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-emerald-950 rounded-2xl shadow-lg border border-emerald-100 hover:bg-emerald-50/50 transition-all text-xs font-semibold w-full justify-start active:scale-95 min-h-[44px]"
          >
            <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span>Scenario 2: Patient Transfer</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenGemini();
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-emerald-950 rounded-2xl shadow-lg border border-emerald-100 hover:bg-emerald-50/50 transition-all text-xs font-semibold w-full justify-start active:scale-95 min-h-[44px]"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Gemini AI Orchestrator</span>
          </button>

          {onOpenMentalHealth && (
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenMentalHealth();
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-emerald-950 rounded-2xl shadow-lg border border-emerald-100 hover:bg-emerald-50/50 transition-all text-xs font-semibold w-full justify-start active:scale-95 min-h-[44px]"
            >
              <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span>Mind & Calming Pacer (14416)</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenSync();
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-emerald-950 rounded-2xl shadow-lg border border-emerald-100 hover:bg-emerald-50/50 transition-all text-xs font-semibold w-full justify-start active:scale-95 min-h-[44px]"
          >
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between flex-1">
              <span>Offline Sync Gateway</span>
              {pendingSyncCount > 0 && (
                <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px]">
                  {pendingSyncCount}
                </span>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Primary Floating Action Button (Flutter style) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick Actions Floating Button"
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all active:scale-90 ${
          isOpen
            ? 'bg-slate-800 text-white rotate-90'
            : 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-emerald-800/20'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Zap className="w-6 h-6 fill-current" />
            {pendingSyncCount > 0 && (
              <span className="absolute -top-2 -right-2 w-3 h-3 bg-amber-400 rounded-full ring-2 ring-white"></span>
            )}
          </div>
        )}
      </button>
    </div>
  );
};
