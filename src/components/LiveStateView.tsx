import React, { useState } from 'react';
import { Facility, FacilityType, FreshnessStatus, CapabilityState } from '../types';
import { 
  Building2, 
  Search, 
  Activity, 
  MapPin, 
  Phone, 
  Check, 
  AlertTriangle, 
  X, 
  ShieldAlert, 
  Stethoscope, 
  Wind, 
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface LiveStateViewProps {
  facilities: Facility[];
  onSelectFacilityForReferral: (fac: Facility) => void;
  onSelectFacilityForStock: (fac: Facility) => void;
}

export const LiveStateView: React.FC<LiveStateViewProps> = ({
  facilities,
  onSelectFacilityForReferral,
  onSelectFacilityForStock,
}) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(facilities[0] || null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState<boolean>(false);

  const filteredFacilities = facilities.filter(f => {
    const matchesType = selectedType === 'ALL' || f.type === selectedType;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getFreshnessColor = (freshness: FreshnessStatus) => {
    switch (freshness) {
      case 'LIVE': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'CURRENT': return 'text-teal-700 bg-teal-50 border-teal-200';
      case 'AGING': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'STALE': return 'text-rose-700 bg-rose-50 border-rose-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const renderCapability = (state: CapabilityState, label: string) => {
    let icon = <Check className="w-3.5 h-3.5 text-emerald-600" />;
    let textClass = 'text-emerald-800';
    let bgClass = 'bg-emerald-50 border-emerald-200';

    if (state === 'LIMITED') {
      icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      textClass = 'text-amber-800';
      bgClass = 'bg-amber-50 border-amber-200';
    } else if (state === 'UNAVAILABLE') {
      icon = <X className="w-3.5 h-3.5 text-rose-600" />;
      textClass = 'text-rose-800';
      bgClass = 'bg-rose-50 border-rose-200';
    } else if (state === 'UNKNOWN') {
      icon = <Clock className="w-3.5 h-3.5 text-slate-500" />;
      textClass = 'text-slate-700';
      bgClass = 'bg-slate-50 border-slate-200';
    }

    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 text-xs border rounded ${bgClass} ${textClass}`}>
        {icon}
        <span className="font-medium">{label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Metrics */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Live Health Operational State Graph
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Freshness-aware coordination across 20 PHCs, 5 CHCs, 3 Referral Hospitals, and 2 Central Warehouses.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE (&lt;5m)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              <span>CURRENT (&lt;30m)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>AGING (&lt;2h)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>STALE (&gt;2h)</span>
            </div>
          </div>
        </div>

        {/* Aggregate Network Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-5 pt-5 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="text-slate-500">Registered Facilities</div>
            <div className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">30 Units</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">28 Mesh Synchronized</div>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="text-slate-500">Total Functional Beds</div>
            <div className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">582 Beds</div>
            <div className="text-[11px] text-slate-600 mt-0.5">50 Ready for Admission</div>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="text-slate-500">ICU Ready Capacity</div>
            <div className="text-lg font-bold text-teal-700 tabular-nums mt-0.5">7 Beds</div>
            <div className="text-[11px] text-slate-600 mt-0.5">Across 3 Hospitals</div>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="text-slate-500">Active Soft Holds</div>
            <div className="text-lg font-bold text-amber-700 tabular-nums mt-0.5">3 Enroute</div>
            <div className="text-[11px] text-amber-600 mt-0.5">15-min Lock Protected</div>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="text-slate-500">Data Quality Score</div>
            <div className="text-lg font-bold text-emerald-700 tabular-nums mt-0.5">98.4%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">0 Anomalies Detected</div>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="text-slate-500">PQC Signature Mesh</div>
            <div className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">ML-DSA-65</div>
            <div className="text-[11px] text-teal-700 mt-0.5">NIST FIPS-204 Valid</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Facilities Directory and Selected Facility Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Facilities List & Filters */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-lg">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search facility or district..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900"
              />
            </div>

            {/* Segmented Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto overflow-x-auto">
              {[
                { id: 'ALL', label: 'All Units' },
                { id: 'PHC', label: 'PHCs' },
                { id: 'CHC', label: 'CHCs' },
                { id: 'DISTRICT_HOSPITAL', label: 'Hospitals' },
                { id: 'WAREHOUSE', label: 'Depots' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    selectedType === tab.id
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Facilities */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredFacilities.map((fac) => {
              const isSelected = selectedFacility?.id === fac.id;
              return (
                <div
                  key={fac.id}
                  onClick={() => {
                    setSelectedFacility(fac);
                    setMobileSheetOpen(true);
                  }}
                  className={`p-4 bg-white rounded-2xl border cursor-pointer transition-all active:scale-[0.99] min-h-[44px] ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                      : 'border-slate-200/90 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {fac.name}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono tabular-nums">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            fac.freshness === 'LIVE' ? 'bg-emerald-500 animate-pulse' : 
                            fac.freshness === 'CURRENT' ? 'bg-teal-500' : 
                            fac.freshness === 'AGING' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}></span>
                          {fac.lastSyncTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{fac.type.replace('_', ' ')}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span>{fac.district}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span>Connectivity: {fac.connectivity}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-400">Ready Beds</div>
                      <div className="text-base font-bold text-emerald-800 tabular-nums">
                        {fac.capacity.ready} <span className="text-xs font-normal text-slate-400">/ {fac.capacity.functional}</span>
                      </div>
                      {fac.capacity.icuTotal > 0 && (
                        <div className="text-xs text-slate-500">
                          ICU Ready: <span className="font-semibold text-slate-900 tabular-nums">{fac.capacity.icuReady}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Service capability indicators */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <span className="text-slate-400 font-medium">Services:</span>
                    <span className={`inline-flex items-center gap-1 ${fac.services.icu === 'AVAILABLE' ? 'text-emerald-800 font-medium' : 'text-slate-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${fac.services.icu === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      ICU
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className={`inline-flex items-center gap-1 ${fac.services.emergency === 'AVAILABLE' ? 'text-emerald-800 font-medium' : 'text-slate-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${fac.services.emergency === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      Emergency
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className={`inline-flex items-center gap-1 ${fac.services.oxygenPlant === 'AVAILABLE' ? 'text-emerald-800 font-medium' : 'text-slate-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${fac.services.oxygenPlant === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      Oxygen Plant
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className={`inline-flex items-center gap-1 ${fac.services.specialistOnDuty === 'AVAILABLE' ? 'text-emerald-800 font-medium' : 'text-slate-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${fac.services.specialistOnDuty === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      Specialist
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Facility Operational Inspector (Desktop) */}
        <div className="hidden lg:block lg:col-span-5">
          {selectedFacility ? (
            <div className="bg-white border border-slate-200 rounded-lg p-5 sticky top-20 space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-semibold bg-teal-100 text-teal-800 rounded">
                      {selectedFacility.type.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getFreshnessColor(selectedFacility.freshness)}`}>
                      {selectedFacility.freshness}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedFacility.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedFacility.district}, {selectedFacility.state}</span>
                    <span className="text-slate-300">·</span>
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedFacility.contactNumber}</span>
                  </div>
                </div>
              </div>

              {/* Data Quality Intelligence Block */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-teal-600" />
                    Data Quality Intelligence
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium">
                    {selectedFacility.qualityStatus}
                  </span>
                </div>
                <p className="text-slate-600 mt-1.5 leading-relaxed">
                  Zero negative inventory anomalies detected. Telemetry synchronized {selectedFacility.lastSyncTime}. Verified against district cryptographic ledger.
                </p>
              </div>

              {/* Bed Capacity Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Bed Capacity Lifecycle
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                    <div className="text-slate-500 text-[11px]">Occupied</div>
                    <div className="text-base font-bold text-slate-800 tabular-nums">
                      {selectedFacility.capacity.occupied}
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                    <div className="text-slate-500 text-[11px]">Reserved</div>
                    <div className="text-base font-bold text-amber-700 tabular-nums">
                      {selectedFacility.capacity.reserved}
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                    <div className="text-slate-500 text-[11px]">Cleaning</div>
                    <div className="text-base font-bold text-slate-500 tabular-nums">
                      {selectedFacility.capacity.cleaning}
                    </div>
                  </div>
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded">
                    <div className="text-emerald-800 text-[11px] font-medium">READY</div>
                    <div className="text-base font-bold text-emerald-700 tabular-nums">
                      {selectedFacility.capacity.ready}
                    </div>
                  </div>
                </div>

                {selectedFacility.capacity.icuTotal > 0 && (
                  <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-teal-900">Critical Care / ICU Readiness</div>
                      <div className="text-teal-700 text-[11px]">
                        {selectedFacility.capacity.icuOccupied} occupied · {selectedFacility.capacity.icuReady} available now
                      </div>
                    </div>
                    <div className="text-xl font-bold text-teal-800 tabular-nums">
                      {selectedFacility.capacity.icuReady} <span className="text-xs font-normal">/ {selectedFacility.capacity.icuTotal}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Service Capabilities Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Clinical Service Capabilities
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {renderCapability(selectedFacility.services.icu, 'ICU Unit')}
                  {renderCapability(selectedFacility.services.emergency, 'Emergency 24x7')}
                  {renderCapability(selectedFacility.services.surgery, 'Surgery / OT')}
                  {renderCapability(selectedFacility.services.obstetrics, 'Obstetrics')}
                  {renderCapability(selectedFacility.services.laboratory, 'Lab Diagnostics')}
                  {renderCapability(selectedFacility.services.oxygenPlant, 'Bulk O2 Plant')}
                </div>

                {/* Specialist Callout */}
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    Specialist On-Duty Status:
                  </div>
                  <div className="mt-1 text-slate-700">
                    {selectedFacility.services.specialistName || 'No resident specialist on shift (Standard MO duty)'}
                  </div>
                  {selectedFacility.services.specialtyType && (
                    <div className="text-slate-500 text-[11px]">
                      Specialty: {selectedFacility.services.specialtyType}
                    </div>
                  )}
                </div>
              </div>

              {/* Primary Actions for This Facility */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => onSelectFacilityForReferral(selectedFacility)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-md transition-colors min-h-[44px]"
                >
                  <span>Initiate Patient Care Match at this Facility</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectFacilityForStock(selectedFacility)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs rounded-md transition-colors min-h-[44px]"
                >
                  <span>Inspect Medicine Inventory & Demand Forecast</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500">
              Select a facility on the left to inspect live operational state.
            </div>
          )}
        </div>

      </div>

      {/* Flutter Mobile Modal Bottom Sheet (showModalBottomSheet) */}
      {mobileSheetOpen && selectedFacility && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center lg:hidden">
          <div className="bg-white w-full max-h-[85vh] rounded-t-3xl border-t border-slate-200 shadow-2xl p-5 overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-200">
            {/* Drag Handle Bar */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 mb-2"></div>

            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-semibold bg-teal-100 text-teal-800 rounded">
                    {selectedFacility.type.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getFreshnessColor(selectedFacility.freshness)}`}>
                    {selectedFacility.freshness}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  {selectedFacility.name}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  {selectedFacility.district} · {selectedFacility.contactNumber}
                </div>
              </div>

              <button
                onClick={() => setMobileSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Bed Capacity Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Capacity Lifecycle
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 border rounded">
                  <div className="text-[10px] text-slate-500">Occupied</div>
                  <div className="font-bold text-slate-800 tabular-nums">{selectedFacility.capacity.occupied}</div>
                </div>
                <div className="p-2 bg-slate-50 border rounded">
                  <div className="text-[10px] text-slate-500">Reserved</div>
                  <div className="font-bold text-amber-700 tabular-nums">{selectedFacility.capacity.reserved}</div>
                </div>
                <div className="p-2 bg-slate-50 border rounded">
                  <div className="text-[10px] text-slate-500">Cleaning</div>
                  <div className="font-bold text-slate-500 tabular-nums">{selectedFacility.capacity.cleaning}</div>
                </div>
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded">
                  <div className="text-[10px] text-emerald-800 font-bold">READY</div>
                  <div className="font-bold text-emerald-700 tabular-nums">{selectedFacility.capacity.ready}</div>
                </div>
              </div>
            </div>

            {/* Mobile Actions (Anchor to bottom thumb zone) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileSheetOpen(false);
                  onSelectFacilityForReferral(selectedFacility);
                }}
                className="w-full py-3 px-4 bg-teal-600 active:bg-teal-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Initiate Care Match & Referral</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setMobileSheetOpen(false);
                  onSelectFacilityForStock(selectedFacility);
                }}
                className="w-full py-3 px-4 bg-slate-100 active:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl min-h-[44px]"
              >
                <span>View Medicine Inventory & Forecast</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
