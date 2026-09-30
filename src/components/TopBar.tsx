import React from 'react';
import { UserContext, UserRole } from '../types';
import { ROLE_PROFILES } from '../data/mockDatabase';
import { 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  Play, 
  RotateCcw, 
  UserCheck, 
  ChevronDown,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Bot
} from 'lucide-react';

export type DeviceMode = 'fluid' | 'mobile' | 'tablet' | 'desktop';

interface TopBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userContext: UserContext;
  setUserContext: (ctx: UserContext) => void;
  networkStatus: 'ONLINE' | '2G_EDGE' | 'OFFLINE';
  setNetworkStatus: (status: 'ONLINE' | '2G_EDGE' | 'OFFLINE') => void;
  pendingSyncCount: number;
  openSyncModal: () => void;
  onLaunchScenario1: () => void;
  onLaunchScenario2: () => void;
  onResetDemo: () => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  openAgenticSentinel?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  setCurrentTab,
  userContext,
  setUserContext,
  networkStatus,
  setNetworkStatus,
  pendingSyncCount,
  openSyncModal,
  onLaunchScenario1,
  onLaunchScenario2,
  onResetDemo,
  deviceMode,
  setDeviceMode,
  openAgenticSentinel,
}) => {
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);
  const [showScenarioMenu, setShowScenarioMenu] = React.useState(false);

  const navLinks = [
    { id: 'live-state', label: 'Facilities' },
    { id: 'network-map', label: 'Network Map' },
    { id: 'referral-care', label: 'Care Match' },
    { id: 'supply-forecast', label: 'Supply Chain' },
    { id: 'mental-health', label: 'Mental Health' },
    { id: 'ambulance-fleet', label: 'Ambulance 108' },
    { id: 'cloudsql-analytics', label: 'Cloud SQL' },
    { id: 'pqc-ledger', label: 'Audit Ledger' },
  ];

  const handleRoleChange = (roleKey: UserRole) => {
    const profile = ROLE_PROFILES[roleKey];
    if (profile) {
      setUserContext({
        ...userContext,
        ...profile,
        role: roleKey,
      } as UserContext);
    }
    setShowRoleMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-2xs">
      {/* Top Bar 3-Zone Contract with Responsive Scaling */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <button 
            onClick={() => setCurrentTab('live-state')}
            className="text-left font-bold text-base sm:text-lg tracking-tight text-emerald-950 hover:text-emerald-700 transition-colors"
          >
            SwasthyaSetu <span className="text-emerald-700 font-semibold text-xs sm:text-sm tracking-normal">Global</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links for Tablet / Desktop */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs sm:text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setCurrentTab(link.id)}
              className={`whitespace-nowrap transition-colors py-1 ${
                currentTab === link.id
                  ? 'text-emerald-800 font-bold border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary operational actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Flutter Cross-Device Viewport Switcher */}
          <div className="hidden xl:flex items-center gap-0.5 p-1 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs">
            <button
              onClick={() => setDeviceMode('fluid')}
              title="Responsive Fluid Layout (Full Screen)"
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
                deviceMode === 'fluid' ? 'bg-white text-emerald-950 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="text-[11px]">Fluid</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              title="Flutter Smartphone Viewport (390px)"
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
                deviceMode === 'mobile' ? 'bg-white text-emerald-800 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px]">Mobile</span>
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              title="Tablet / iPad Viewport (768px)"
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
                deviceMode === 'tablet' ? 'bg-white text-emerald-800 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="text-[11px]">Tablet</span>
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              title="Desktop Standard (1280px)"
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
                deviceMode === 'desktop' ? 'bg-white text-emerald-950 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[11px]">Desktop</span>
            </button>
          </div>

          {/* Network state toggle (Min touch height 44px on mobile) */}
          <button
            onClick={() => {
              if (networkStatus === 'ONLINE') setNetworkStatus('2G_EDGE');
              else if (networkStatus === '2G_EDGE') setNetworkStatus('OFFLINE');
              else setNetworkStatus('ONLINE');
            }}
            title="Toggle Network (Online / 2G / Offline)"
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs font-medium rounded-xl border min-h-[38px] sm:min-h-[36px] transition-colors ${
              networkStatus === 'ONLINE'
                ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200'
                : networkStatus === '2G_EDGE'
                ? 'bg-amber-50/90 text-amber-800 border-amber-200'
                : 'bg-rose-50/90 text-rose-800 border-rose-200'
            }`}
          >
            {networkStatus === 'OFFLINE' ? (
              <WifiOff className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Wifi className="w-3.5 h-3.5 shrink-0" />
            )}
            <span className="tabular-nums hidden sm:inline">
              {networkStatus === 'ONLINE' ? 'Mesh Online' : networkStatus === '2G_EDGE' ? '2G / Edge' : 'Offline'}
            </span>
            {pendingSyncCount > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded-full text-[10px] font-bold">
                {pendingSyncCount}
              </span>
            )}
          </button>

          {/* Agentic AI Sentinel & Daily Flow Healer */}
          {openAgenticSentinel && (
            <button
              onClick={openAgenticSentinel}
              title="Daily Automated Resilience Cron Active: Monitored by Sentinel-108 (Daily at 04:00 AM IST)"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/90 rounded-xl transition-all shadow-2xs min-h-[38px] sm:min-h-[36px] active:scale-95"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-700 animate-pulse shrink-0" />
              <span className="hidden sm:inline">Daily Auto-Heal</span>
              <span className="hidden lg:inline text-[10px] font-mono text-emerald-700 font-normal">· Daily 04:00</span>
            </button>
          )}

          {/* Role Context Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 bg-emerald-50/50 border border-emerald-100 rounded-xl hover:bg-emerald-50 transition-colors min-h-[38px] sm:min-h-[36px]"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate max-w-[80px] sm:max-w-[120px]">{userContext.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-emerald-100 shadow-xl py-2 z-50 text-xs">
                <div className="px-3.5 py-1.5 border-b border-slate-100">
                  <div className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                    Context-Aware Role Switcher
                  </div>
                  <div className="text-slate-600 text-[11px] mt-0.5 truncate">
                    Facility: <span className="font-medium text-slate-800">{userContext.facilityName}</span>
                  </div>
                </div>
                {Object.keys(ROLE_PROFILES).map((rk) => {
                  const roleKey = rk as UserRole;
                  const profile = ROLE_PROFILES[roleKey]!;
                  const isCurrent = userContext.role === roleKey;
                  return (
                    <button
                      key={roleKey}
                      onClick={() => handleRoleChange(roleKey)}
                      className={`w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/60 flex items-start justify-between min-h-[44px] ${
                        isCurrent ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{profile.name}</div>
                        <div className="text-[11px] text-slate-500">{roleKey.replace(/_/g, ' ')} · {profile.facilityName}</div>
                      </div>
                      {isCurrent && <span className="text-emerald-600 font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Scenario Runner Menu */}
          <div className="relative">
            <button
              onClick={() => setShowScenarioMenu(!showScenarioMenu)}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all shadow-xs min-h-[38px] sm:min-h-[36px]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Scenarios</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showScenarioMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-emerald-100 shadow-xl py-2 z-50 text-xs">
                <div className="px-3.5 py-1.5 border-b border-slate-100 text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                  Document Test Scenarios (Sections 39-40)
                </div>
                <button
                  onClick={() => {
                    setShowScenarioMenu(false);
                    onLaunchScenario1();
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/60 transition-colors border-b border-slate-50 min-h-[44px]"
                >
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    Demo Scenario 1: Medicine Shortage
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    PHC-A shortage → Forecast → Donor surplus discovery → Optimizer → PQC sign.
                  </p>
                </button>

                <button
                  onClick={() => {
                    setShowScenarioMenu(false);
                    onLaunchScenario2();
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/60 transition-colors border-b border-slate-50 min-h-[44px]"
                >
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                    Demo Scenario 2: Patient Transfer
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Severe ARDS referral → Care Availability matching → Bed Soft Hold → ALS dispatch.
                  </p>
                </button>

                <button
                  onClick={() => {
                    setShowScenarioMenu(false);
                    onResetDemo();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-600 flex items-center gap-2 min-h-[44px]"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset State to Initial</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
