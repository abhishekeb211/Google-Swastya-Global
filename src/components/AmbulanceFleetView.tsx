import React from 'react';
import { Ambulance, ReferralPatient } from '../types';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Activity, 
  Gauge, 
  ShieldCheck, 
  Clock, 
  Navigation,
  FileText
} from 'lucide-react';

interface AmbulanceFleetViewProps {
  ambulances: Ambulance[];
  activeReferrals: ReferralPatient[];
  onSimulateProgress: (ambId: string) => void;
}

export const AmbulanceFleetView: React.FC<AmbulanceFleetViewProps> = ({
  ambulances,
  activeReferrals,
  onSimulateProgress,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Emergency Medical Transport & Ambulance Coordination
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Integrated ALS/BLS dispatch connected atomically to hospital bed reservation and electronic referral packets.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              3 Units Active
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600 font-medium">108 State Emergency Network</span>
          </div>
        </div>
      </div>

      {/* Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ambulances.map((amb) => {
          const assignedRef = activeReferrals.find(r => r.assignedAmbulanceId === amb.vehicleNumber || amb.id === 'amb_als_01');

          return (
            <div
              key={amb.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold tracking-tight ${
                      amb.type === 'ALS' ? 'text-rose-700' : 'text-sky-700'
                    }`}>
                      {amb.type} Emergency
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                      {amb.vehicleNumber}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Base: {amb.baseLocation}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-medium">Status</div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {amb.status}
                  </span>
                </div>
              </div>

              {/* Driver & Telemetry */}
              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500">Assigned Operator:</span>
                  <span className="font-semibold text-slate-900">{amb.driverName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> Contact:
                  </span>
                  <span className="font-mono text-emerald-800 font-medium tabular-nums">{amb.driverPhone}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-slate-400" /> GPS Telemetry:
                  </span>
                  <span className="font-mono text-slate-600 tabular-nums">{amb.currentLat.toFixed(4)}, {amb.currentLng.toFixed(4)}</span>
                </div>
              </div>

              {/* Equipment Inventory */}
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  On-Board Clinical Equipment:
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                  {amb.equipment.map((eq, i) => (
                    <React.Fragment key={i}>
                      <span>{eq}</span>
                      {i < amb.equipment.length - 1 && <span aria-hidden="true" className="text-slate-300">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Assigned Transfer Mission */}
              {assignedRef ? (
                <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs space-y-2.5">
                  <div className="flex items-center justify-between text-emerald-950 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                      Active Transfer Dispatch
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-900 tabular-nums">
                      ETA {amb.etaMinutes} min
                    </span>
                  </div>

                  <div className="text-xs text-slate-700">
                    Patient: <strong className="text-slate-900">{assignedRef.name}</strong> ({assignedRef.urgency.replace('_', ' ')})
                  </div>
                  <div className="text-xs text-slate-600">
                    Route: {assignedRef.originFacilityName} → {assignedRef.destinationFacilityName}
                  </div>

                  <button
                    onClick={() => onSimulateProgress(amb.id)}
                    className="w-full mt-2 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 min-h-[44px] shadow-2xs"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Advance GPS & Reduce ETA (-3 mins)</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl text-center text-xs text-slate-500">
                  Standby at base station. Ready for automatic assignment upon care match.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
