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
  pendingSyncCount: number;
}

export const FlutterFab: React.FC<FlutterFabProps> = ({
  onLaunchScenario1,
  onLaunchScenario2,
  onOpenSync,
  onOpenGemini,
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
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 hover:bg-slate-50 transition-all text-xs font-semibold w-full justify-start active:scale-95 min-h-[44px]"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
              <Pill className="w-4 h-4" />
            </div>
            <span>Scenario 1: Medicine Shortage</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onLaunchScenario2();
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 hover:bg-slate-50 transition-all text-xs font-semibold w-full justify-start active:scale-95 min-h-[44px]"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span>Scenario 2: Patient Transfer</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenGemini();
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 hover:bg-slate-50 transition-all text-xs font-semibold w-full justify-start active:scale-95 min-h-[44px]"
          >
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Gemini AI Orchestrator</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenSync();
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 hover:bg-slate-50 transition-all text-xs font-semibold w-full justify-start active:scale-95 min-h-[44px]"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between flex-1">
              <span>Offline Sync Gateway</span>
              {pendingSyncCount > 0 && (
                <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded text-[10px]">
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
            : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-700/20'
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
