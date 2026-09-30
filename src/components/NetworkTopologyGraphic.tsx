import React, { useState } from 'react';
import { Facility, MedicineInventory, Ambulance } from '../types';
import { 
  Building2, 
  Layers, 
  Stethoscope, 
  Truck, 
  Pill, 
  Activity, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Info,
  Maximize2
} from 'lucide-react';
import { CardIconBadge } from './CardIconBadge';

interface NetworkTopologyGraphicProps {
  facilities: Facility[];
  onSelectFacility: (fac: Facility) => void;
  onNavigateTab: (tabId: string) => void;
}

export const NetworkTopologyGraphic: React.FC<NetworkTopologyGraphicProps> = ({
  facilities,
  onSelectFacility,
  onNavigateTab,
}) => {
  const [viewMode, setViewMode] = useState<'BEDS' | 'SUPPLY' | 'TRANSIT'>('BEDS');
  const [hoveredFacilityId, setHoveredFacilityId] = useState<string | null>(null);

  // Group facilities
  const districtHospitals = facilities.filter(f => f.type === 'DISTRICT_HOSPITAL');
  const chcs = facilities.filter(f => f.type === 'CHC');
  const phcs = facilities.filter(f => f.type === 'PHC');

  const selectedFac = facilities.find(f => f.id === hoveredFacilityId) || districtHospitals[0] || facilities[0];

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs p-4 sm:p-6 space-y-4">
      {/* Header with Visual Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <span>District Healthcare Network Topology</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                Interactive Grid
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Live visual coordination mesh across 3-tier tertiary, secondary, and rural primary care centers
            </p>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setViewMode('BEDS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'BEDS'
                ? 'bg-white text-emerald-950 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ICU & Bed Capacity
          </button>
          <button
            onClick={() => setViewMode('SUPPLY')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'SUPPLY'
                ? 'bg-white text-teal-950 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Medicine Conduits
          </button>
          <button
            onClick={() => setViewMode('TRANSIT')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'TRANSIT'
                ? 'bg-white text-sky-950 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            108 Transit Mesh
          </button>
        </div>
      </div>

      {/* Main Graphical Map & Live Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        
        {/* Left Column: High-Fidelity SVG Architectural Diagram */}
        <div className="lg:col-span-8 bg-gradient-to-b from-slate-50/70 via-emerald-50/20 to-teal-50/20 rounded-2xl border border-slate-200/80 p-3 sm:p-5 relative overflow-hidden">
          
          <svg viewBox="0 0 680 380" className="w-full h-auto drop-shadow-xs select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tertiaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="100%" stopColor="#065F46" />
              </linearGradient>
              <linearGradient id="chcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0D9488" />
                <stop offset="100%" stopColor="#0F766E" />
              </linearGradient>
              <linearGradient id="phcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0369A1" />
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connecting Conduits with Animated Flow */}
            <g stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6">
              {/* Central Hospital to CHCs */}
              <line x1="340" y1="90" x2="160" y2="190" stroke={viewMode === 'BEDS' ? '#10B981' : '#94A3B8'} strokeWidth={viewMode === 'BEDS' ? '2.5' : '1.5'} />
              <line x1="340" y1="90" x2="520" y2="190" stroke={viewMode === 'BEDS' ? '#10B981' : '#94A3B8'} strokeWidth={viewMode === 'BEDS' ? '2.5' : '1.5'} />
              {/* CHCs to PHCs */}
              <line x1="160" y1="190" x2="80" y2="300" stroke={viewMode === 'SUPPLY' ? '#0D9488' : '#CBD5E1'} strokeWidth={viewMode === 'SUPPLY' ? '2.5' : '1.5'} />
              <line x1="160" y1="190" x2="240" y2="300" stroke={viewMode === 'SUPPLY' ? '#0D9488' : '#CBD5E1'} strokeWidth={viewMode === 'SUPPLY' ? '2.5' : '1.5'} />
              <line x1="520" y1="190" x2="440" y2="300" stroke={viewMode === 'TRANSIT' ? '#0284C7' : '#CBD5E1'} strokeWidth={viewMode === 'TRANSIT' ? '2.5' : '1.5'} />
              <line x1="520" y1="190" x2="600" y2="300" stroke={viewMode === 'TRANSIT' ? '#0284C7' : '#CBD5E1'} strokeWidth={viewMode === 'TRANSIT' ? '2.5' : '1.5'} />
            </g>

            {/* Tier 1: Tertiary District Referral Hospital (Apex Node) */}
            <g 
              transform="translate(260, 45)" 
              className="cursor-pointer transition-all hover:scale-105"
              onMouseEnter={() => setHoveredFacilityId(districtHospitals[0]?.id || 'fac_dh_satara')}
              onClick={() => districtHospitals[0] && onSelectFacility(districtHospitals[0])}
            >
              <rect width="160" height="74" rx="16" fill="url(#tertiaryGrad)" stroke="#34D399" strokeWidth="2" filter="url(#softGlow)" />
              <path d="M24 26L36 32V46C36 54 30 60 24 62C18 60 12 54 12 46V32L24 26Z" fill="white" fillOpacity="0.25" />
              <path d="M24 34V46M18 40H30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <text x="44" y="32" fill="white" fontSize="12" fontWeight="bold" fontFamily="Segoe UI">District Hospital</text>
              <text x="44" y="46" fill="#A7F3D0" fontSize="10" fontFamily="Segoe UI">Tertiary Care · 280 Beds</text>
              <text x="44" y="58" fill="#FDE047" fontSize="10" fontWeight="bold" fontFamily="Segoe UI">7 ICU Bays · Pulmonology</text>
              <circle cx="145" cy="18" r="4.5" fill="#34D399">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* Tier 2: Community Health Centers (CHC Mid-Tier Nodes) */}
            {/* CHC-West */}
            <g 
              transform="translate(90, 160)" 
              className="cursor-pointer transition-all hover:scale-105"
              onMouseEnter={() => setHoveredFacilityId(chcs[0]?.id || 'fac_chc_koregaon')}
              onClick={() => chcs[0] && onSelectFacility(chcs[0])}
            >
              <rect width="140" height="66" rx="14" fill="white" stroke="#0D9488" strokeWidth="2" />
              <rect x="10" y="12" width="24" height="24" rx="6" fill="#CCFBF1" />
              <path d="M22 18V30M16 24H28" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
              <text x="40" y="26" fill="#134E4A" fontSize="11" fontWeight="bold" fontFamily="Segoe UI">CHC Koregaon</text>
              <text x="40" y="39" fill="#0F766E" fontSize="9.5" fontFamily="Segoe UI">Secondary · 30 Beds</text>
              <text x="40" y="50" fill="#0D9488" fontSize="9.5" fontFamily="Segoe UI">Cold Storage · Ready</text>
              <circle cx="125" cy="15" r="3.5" fill="#0D9488" />
            </g>

            {/* CHC-East */}
            <g 
              transform="translate(450, 160)" 
              className="cursor-pointer transition-all hover:scale-105"
              onMouseEnter={() => setHoveredFacilityId(chcs[1]?.id || 'fac_chc_karad')}
              onClick={() => chcs[1] && onSelectFacility(chcs[1])}
            >
              <rect width="140" height="66" rx="14" fill="white" stroke="#0D9488" strokeWidth="2" />
              <rect x="10" y="12" width="24" height="24" rx="6" fill="#CCFBF1" />
              <path d="M22 18V30M16 24H28" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
              <text x="40" y="26" fill="#134E4A" fontSize="11" fontWeight="bold" fontFamily="Segoe UI">CHC Karad</text>
              <text x="40" y="39" fill="#0F766E" fontSize="9.5" fontFamily="Segoe UI">Emergency · 25 Beds</text>
              <text x="40" y="50" fill="#0D9488" fontSize="9.5" fontFamily="Segoe UI">Oxygen Plant Online</text>
              <circle cx="125" cy="15" r="3.5" fill="#0D9488" />
            </g>

            {/* Tier 3: Primary Health Centers (PHC Grassroots Clinic Nodes) */}
            {/* PHC-A */}
            <g 
              transform="translate(20, 275)" 
              className="cursor-pointer transition-all hover:scale-105"
              onMouseEnter={() => setHoveredFacilityId(phcs[0]?.id || 'fac_phc_a')}
              onClick={() => phcs[0] && onSelectFacility(phcs[0])}
            >
              <rect width="120" height="64" rx="12" fill="white" stroke="#0284C7" strokeWidth="1.5" />
              <rect x="8" y="10" width="20" height="20" rx="5" fill="#E0F2FE" />
              <path d="M18 15V25M13 20H23" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
              <text x="34" y="23" fill="#0C4A6E" fontSize="10.5" fontWeight="bold" fontFamily="Segoe UI">PHC Ramnagar</text>
              <text x="34" y="35" fill="#0284C7" fontSize="9" fontFamily="Segoe UI">Rural Clinic · 6 Beds</text>
              <text x="34" y="47" fill="#E11D48" fontSize="9" fontWeight="bold" fontFamily="Segoe UI">⚡ ORS Stock Alert</text>
            </g>

            {/* PHC-B */}
            <g 
              transform="translate(180, 275)" 
              className="cursor-pointer transition-all hover:scale-105"
              onMouseEnter={() => setHoveredFacilityId(phcs[1]?.id || 'fac_phc_b')}
              onClick={() => phcs[1] && onSelectFacility(phcs[1])}
            >
              <rect width="120" height="64" rx="12" fill="white" stroke="#059669" strokeWidth="1.5" />
              <rect x="8" y="10" width="20" height="20" rx="5" fill="#ECFDF5" />
              <path d="M18 15V25M13 20H23" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
              <text x="34" y="23" fill="#065F46" fontSize="10.5" fontWeight="bold" fontFamily="Segoe UI">PHC Shirwal</text>
              <text x="34" y="35" fill="#059669" fontSize="9" fontFamily="Segoe UI">Rural Clinic · 8 Beds</text>
              <text x="34" y="47" fill="#166534" fontSize="9" fontWeight="bold" fontFamily="Segoe UI">✓ Surplus Medicine</text>
            </g>

            {/* PHC-C */}
            <g 
              transform="translate(380, 275)" 
              className="cursor-pointer transition-all hover:scale-105"
              onMouseEnter={() => setHoveredFacilityId(phcs[2]?.id || 'fac_phc_c')}
              onClick={() => phcs[2] && onSelectFacility(phcs[2])}
            >
              <rect width="120" height="64" rx="12" fill="white" stroke="#64748B" strokeWidth="1.5" />
              <rect x="8" y="10" width="20" height="20" rx="5" fill="#F1F5F9" />
              <path d="M18 15V25M13 20H23" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
              <text x="34" y="23" fill="#1E293B" fontSize="10.5" fontWeight="bold" fontFamily="Segoe UI">PHC Medha</text>
              <text x="34" y="35" fill="#64748B" fontSize="9" fontFamily="Segoe UI">Sub-center · 6 Beds</text>
              <text x="34" y="47" fill="#047857" fontSize="9" fontFamily="Segoe UI">Stable Operations</text>
            </g>

            {/* PHC-D */}
            <g 
              transform="translate(540, 275)" 
              className="cursor-pointer transition-all hover:scale-105"
              onMouseEnter={() => setHoveredFacilityId(phcs[3]?.id || 'fac_phc_d')}
              onClick={() => phcs[3] && onSelectFacility(phcs[3])}
            >
              <rect width="120" height="64" rx="12" fill="white" stroke="#64748B" strokeWidth="1.5" />
              <rect x="8" y="10" width="20" height="20" rx="5" fill="#F1F5F9" />
              <path d="M18 15V25M13 20H23" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
              <text x="34" y="23" fill="#1E293B" fontSize="10.5" fontWeight="bold" fontFamily="Segoe UI">PHC Patan</text>
              <text x="34" y="35" fill="#64748B" fontSize="9" fontFamily="Segoe UI">Sub-center · 6 Beds</text>
              <text x="34" y="47" fill="#047857" fontSize="9" fontFamily="Segoe UI">2G Sync Active</text>
            </g>

            {/* Live In-Transit Moving Packets */}
            {viewMode === 'TRANSIT' && (
              <g transform="translate(480, 230)">
                <circle cx="10" cy="10" r="12" fill="#EA580C" />
                <path d="M6 10H14M10 6L14 10L10 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <text x="26" y="14" fill="#C2410C" fontSize="9" fontWeight="bold" fontFamily="Segoe UI">ALS-108</text>
              </g>
            )}

            {viewMode === 'SUPPLY' && (
              <g transform="translate(140, 230)">
                <circle cx="10" cy="10" r="12" fill="#0D9488" />
                <path d="M7 10L10 13L15 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <text x="26" y="14" fill="#0F766E" fontSize="9" fontWeight="bold" fontFamily="Segoe UI">ORS Buffer (350u)</text>
              </g>
            )}
          </svg>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Tertiary Hospital</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> Secondary CHC</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> Primary Care PHC</span>
            </div>
            <span>Click any node to open care referral or supply allocation</span>
          </div>
        </div>

        {/* Right Column: Node Inspector & Telemetry Summary Card */}
        <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Node Telemetry Inspector
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              {selectedFac.freshness}
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
              {selectedFac.name}
            </h4>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>{selectedFac.type.replace('_', ' ')}</span>
              <span>·</span>
              <span>{selectedFac.district}</span>
              <span>·</span>
              <span>Conn: {selectedFac.connectivity}</span>
            </div>
          </div>

          {/* Key Resource Numbers */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-[11px]">Ready Beds</div>
              <div className="text-base font-bold text-emerald-800 tabular-nums font-mono mt-0.5">
                {selectedFac.capacity.ready} <span className="text-xs font-normal text-slate-400">/ {selectedFac.capacity.functional}</span>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <div className="text-slate-500 text-[11px]">ICU Capacity</div>
              <div className="text-base font-bold text-teal-800 tabular-nums font-mono mt-0.5">
                {selectedFac.capacity.icuReady} <span className="text-xs font-normal text-slate-400">/ {selectedFac.capacity.icuTotal}</span>
              </div>
            </div>
          </div>

          {/* Clinical Capabilities List */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-600">Verified Clinical Capabilities:</div>
            <div className="flex flex-wrap gap-1.5">
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${selectedFac.services?.oxygenPlant === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                {selectedFac.services?.oxygenPlant === 'AVAILABLE' ? '✓ Oxygen PSA' : 'No Oxygen'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${selectedFac.services?.icu === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                {selectedFac.services?.icu === 'AVAILABLE' ? '✓ ICU Available' : 'No ICU'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${selectedFac.services?.surgery === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                {selectedFac.services?.surgery === 'AVAILABLE' ? '✓ Surgery OT' : 'No Surgery'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${selectedFac.services?.specialistOnDuty === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                {selectedFac.services?.specialistOnDuty === 'AVAILABLE' ? '✓ Specialist on Duty' : 'No Specialist'}
              </span>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => {
                onSelectFacility(selectedFac);
                onNavigateTab('referral-care');
              }}
              className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-semibold rounded-xl text-xs transition-all shadow-2xs"
            >
              Request Care Match at Node
            </button>
            <button
              onClick={() => {
                onSelectFacility(selectedFac);
                onNavigateTab('supply-forecast');
              }}
              className="py-2 px-3 bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-all"
            >
              Stock View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
