import React from 'react';
import { 
  Activity, 
  Pill, 
  HeartHandshake, 
  Truck, 
  Sparkles, 
  ShieldCheck,
  Heart
} from 'lucide-react';

interface FlutterBottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  pendingSyncCount: number;
}

export const FlutterBottomNav: React.FC<FlutterBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  pendingSyncCount,
}) => {
  const navItems = [
    {
      id: 'live-state',
      label: 'Live Grid',
      icon: Activity,
    },
    {
      id: 'supply-forecast',
      label: 'Supply & DoS',
      icon: Pill,
    },
    {
      id: 'referral-care',
      label: 'Care Match',
      icon: HeartHandshake,
    },
    {
      id: 'mental-health',
      label: 'Mind & Care',
      icon: Heart,
    },
    {
      id: 'ambulance-fleet',
      label: 'Fleet 108',
      icon: Truck,
    },
    {
      id: 'gemini-xai',
      label: 'Gemini XAI',
      icon: Sparkles,
    },
    {
      id: 'pqc-ledger',
      label: 'PQC Ledger',
      icon: ShieldCheck,
      badge: pendingSyncCount > 0 ? `${pendingSyncCount}` : undefined,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100 shadow-lg md:hidden"
    >
      <div className="flex items-center justify-around h-16 max-w-xl mx-auto px-1 safe-area-bottom overflow-x-auto scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] py-1 px-1 transition-all active:scale-95 shrink-0 ${
                isActive ? 'text-emerald-800' : 'text-slate-500 hover:text-emerald-800'
              }`}
            >
              {/* Flutter Material 3 active indicator pill */}
              <div 
                className={`relative px-2.5 py-1 rounded-full transition-all ${
                  isActive ? 'bg-emerald-100 text-emerald-900 shadow-2xs' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 px-1 min-w-[16px] h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] sm:text-[10px] tracking-tight mt-0.5 truncate max-w-[58px] ${
                isActive ? 'font-bold text-emerald-950' : 'font-medium text-slate-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
