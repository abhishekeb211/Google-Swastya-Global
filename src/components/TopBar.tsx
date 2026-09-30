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
  Maximize2
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
}) => {
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);
  const [showScenarioMenu, setShowScenarioMenu] = React.useState(false);

  const navLinks = [
    { id: 'live-state', label: 'Live Grid' },
    { id: 'supply-forecast', label: 'Supply & Forecast' },
    { id: 'referral-care', label: 'Care Match' },
    { id: 'ambulance-fleet', label: 'Ambulance 108' },
    { id: 'gemini-xai', label: 'Gemini XAI' },
    { id: 'pqc-ledger', label: 'PQC Ledger' },
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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Bar 3-Zone Contract with Responsive Scaling */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <button 
            onClick={() => setCurrentTab('live-state')}
            className="text-left font-bold text-base sm:text-lg tracking-tight text-slate-900 hover:text-teal-700 transition-colors"
          >
            SwasthyaSetu <span className="text-teal-600 font-semibold text-xs sm:text-sm tracking-normal">Grid 2.0</span>
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
                  ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary operational actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Flutter Cross-Device Viewport Switcher */}
          <div className="hidden xl:flex items-center gap-0.5 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setDeviceMode('fluid')}
              title="Responsive Fluid Layout (Full Screen)"
              className={`p-1.5 rounded transition-all flex items-center gap-1 ${
                deviceMode === 'fluid' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="text-[11px]">Fluid</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              title="Flutter Smartphone Viewport (390px)"
              className={`p-1.5 rounded transition-all flex items-center gap-1 ${
                deviceMode === 'mobile' ? 'bg-white text-teal-800 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-[11px]">Mobile</span>
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              title="Tablet / iPad Viewport (768px)"
              className={`p-1.5 rounded transition-all flex items-center gap-1 ${
                deviceMode === 'tablet' ? 'bg-white text-teal-800 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="text-[11px]">Tablet</span>
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              title="Desktop Standard (1280px)"
              className={`p-1.5 rounded transition-all flex items-center gap-1 ${
                deviceMode === 'desktop' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
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
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-medium rounded-md border min-h-[38px] sm:min-h-[36px] transition-colors ${
              networkStatus === 'ONLINE'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : networkStatus === '2G_EDGE'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
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
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded text-[10px] font-bold">
                {pendingSyncCount}
              </span>
            )}
          </button>

          {/* Role Context Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors min-h-[38px] sm:min-h-[36px]"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate max-w-[80px] sm:max-w-[120px]">{userContext.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg border border-slate-200 shadow-xl py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
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
                      className={`w-full text-left px-3 py-2.5 hover:bg-slate-50 flex items-start justify-between min-h-[44px] ${
                        isCurrent ? 'bg-teal-50/70 text-teal-900 font-medium' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{profile.name}</div>
                        <div className="text-[11px] text-slate-500">{roleKey.replace(/_/g, ' ')} · {profile.facilityName}</div>
                      </div>
                      {isCurrent && <span className="text-teal-600 font-bold">✓</span>}
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
              className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-xs min-h-[38px] sm:min-h-[36px]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Run Scenarios</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showScenarioMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg border border-slate-200 shadow-xl py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Document Test Scenarios (Sections 39-40)
                </div>
                <button
                  onClick={() => {
                    setShowScenarioMenu(false);
                    onLaunchScenario1();
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-teal-50 transition-colors border-b border-slate-50 min-h-[44px]"
                >
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
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
                  className="w-full text-left px-3 py-2.5 hover:bg-teal-50 transition-colors border-b border-slate-50 min-h-[44px]"
                >
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
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
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-600 flex items-center gap-2 min-h-[44px]"
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
