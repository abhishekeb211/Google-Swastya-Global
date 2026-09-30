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

          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium">
              3 Units Active
            </span>
            <span className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded font-medium">
              108 State Emergency Network
            </span>
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
              className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                      amb.type === 'ALS' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {amb.type} UNIT
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {amb.vehicleNumber}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Base: {amb.baseLocation}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-500">Status</div>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                    {amb.status}
                  </span>
                </div>
              </div>

              {/* Driver & Telemetry */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500">Assigned Operator:</span>
                  <span className="font-semibold text-slate-900">{amb.driverName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Contact:
                  </span>
                  <span className="font-mono text-teal-700 font-medium">{amb.driverPhone}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Gauge className="w-3 h-3" /> GPS Telemetry:
                  </span>
                  <span className="font-mono text-slate-600">{amb.currentLat.toFixed(4)}, {amb.currentLng.toFixed(4)}</span>
                </div>
              </div>

              {/* Equipment Inventory */}
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  On-Board Clinical Equipment:
                </div>
                <div className="flex flex-wrap gap-1 text-[11px]">
                  {amb.equipment.map((eq, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assigned Transfer Mission */}
              {assignedRef ? (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between text-teal-900 font-semibold">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-teal-700" />
                      Active Transfer Dispatch
                    </span>
                    <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-teal-200">
                      ETA {amb.etaMinutes} min
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-700">
                    Patient: <strong>{assignedRef.name}</strong> ({assignedRef.urgency.replace('_', ' ')})
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Route: {assignedRef.originFacilityName} → {assignedRef.destinationFacilityName}
                  </div>

                  <button
                    onClick={() => onSimulateProgress(amb.id)}
                    className="w-full mt-2 py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Advance GPS & Reduce ETA (-3 mins)</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-center text-xs text-slate-500">
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
