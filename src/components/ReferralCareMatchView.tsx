import React, { useState } from 'react';
import { 
  Facility, 
  ReferralPatient, 
  UserContext, 
  Ambulance, 
  BedState
} from '../types';
import { 
  evaluateCareAvailability, 
  CareMatchResult 
} from '../services/resilienceEngine';
import { 
  HeartHandshake, 
  Bed, 
  Truck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Stethoscope, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Timer, 
  XCircle,
  Activity,
  UserCheck
} from 'lucide-react';

interface ReferralCareMatchViewProps {
  facilities: Facility[];
  userContext: UserContext;
  ambulances: Ambulance[];
  activeReferrals: ReferralPatient[];
  onCreateReferral: (referral: ReferralPatient) => void;
  onUpdateReferralStatus: (refId: string, status: ReferralPatient['status'], bedState: BedState) => void;
}

export const ReferralCareMatchView: React.FC<ReferralCareMatchViewProps> = ({
  facilities,
  userContext,
  ambulances,
  activeReferrals,
  onCreateReferral,
  onUpdateReferralStatus,
}) => {
  // Referral Form State
  const [patientName, setPatientName] = useState('Rameshwar Gaikwad');
  const [patientAge, setPatientAge] = useState(58);
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [urgency, setUrgency] = useState<'CODE_RED' | 'CODE_YELLOW' | 'CODE_GREEN'>('CODE_RED');
  const [clinicalCondition, setClinicalCondition] = useState('Severe Acute Respiratory Distress Syndrome (ARDS) secondary to viral pneumonia. SpO2 78% on room air.');
  const [requiresIcu, setRequiresIcu] = useState(true);
  const [requiresSpecialist, setRequiresSpecialist] = useState(true);
  const [requiresOxygen, setRequiresOxygen] = useState(true);

  // Match evaluation state
  const [matchResults, setMatchResults] = useState<CareMatchResult[]>([]);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<CareMatchResult | null>(null);

  // Trigger care match evaluation
  const handleEvaluateCare = () => {
    const results = evaluateCareAvailability(
      facilities,
      urgency,
      requiresIcu,
      requiresSpecialist,
      requiresOxygen
    );
    setMatchResults(results);
    setHasEvaluated(true);
    // Find highest scoring capable facility
    const best = results.find(r => r.careAvailable);
    if (best) setSelectedDestination(best);
  };

  // Create referral and initiate soft hold
  const handleSubmitReferral = () => {
    if (!selectedDestination) return;

    const newRef: ReferralPatient = {
      id: `ref_${Date.now()}`,
      patientRef: `SS-PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: patientName,
      age: patientAge,
      gender,
      urgency,
      clinicalSummary: clinicalCondition,
      primaryCondition: 'Severe Acute ARDS with Respiratory Failure',
      requiredSpecialty: 'Pulmonology & Critical Care',
      requiredEquipment: ['ICU Bed', 'Transport Ventilator', 'High-Flow Oxygen'],
      referringDoctorId: userContext.userId,
      referringDoctorName: userContext.name,
      originFacilityId: userContext.facilityId,
      originFacilityName: userContext.facilityName,
      destinationFacilityId: selectedDestination.facility.id,
      destinationFacilityName: selectedDestination.facility.name,
      bedHoldStatus: 'SOFT_HOLD',
      holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assignedAmbulanceId: ambulances[0]?.vehicleNumber || 'MH-12-EMS-1081',
      ambulanceEtaMinutes: selectedDestination.etaMinutes,
      status: 'HELD',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    onCreateReferral(newRef);
  };

  return (
    <div className="space-y-6">
      {/* Header and Principle Box */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Care Availability & Patient Referral Engine
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Care Availability = Bed × Staff × Equipment × Required Service. Patients are never dispatched to empty beds without verified clinical capability.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 px-3 py-2 rounded-lg text-xs text-teal-900 font-medium">
            <UserCheck className="w-4 h-4 text-teal-700" />
            <span>Referring: <strong className="text-slate-900">{userContext.name}</strong> ({userContext.facilityName})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Clinical Referral Form & Care Match Evaluation */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-600" />
                Referral Packet Generation (Step 6-8)
              </h3>
              <span className="text-xs text-slate-500 font-mono">Session #{userContext.sessionId.slice(-6)}</span>
            </div>

            {/* Auto-populated Doctor & Facility Context */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
              <div>
                <div className="text-slate-500">Origin Facility</div>
                <div className="font-semibold text-slate-800">{userContext.facilityName}</div>
                <div className="text-[11px] text-slate-500">{userContext.district}, {userContext.state}</div>
              </div>
              <div>
                <div className="text-slate-500">Referring Clinician</div>
                <div className="font-semibold text-slate-800">{userContext.name}</div>
                <div className="text-[11px] text-slate-500">{userContext.professionalId}</div>
              </div>
            </div>

            {/* Patient Details */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Age & Gender</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(Number(e.target.value))}
                      className="w-16 bg-slate-50 border border-slate-300 rounded px-2 py-1.5 text-slate-900 font-mono"
                    />
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1.5 text-slate-900"
                    >
                      <option value="MALE">M</option>
                      <option value="FEMALE">F</option>
                      <option value="OTHER">O</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Urgency Selector */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Clinical Urgency Triaging</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CODE_RED', label: 'Code Red', desc: 'Resuscitation / Immediate', color: 'border-rose-300 text-rose-800 bg-rose-50' },
                    { id: 'CODE_YELLOW', label: 'Code Yellow', desc: 'Urgent Care (<30m)', color: 'border-amber-300 text-amber-800 bg-amber-50' },
                    { id: 'CODE_GREEN', label: 'Code Green', desc: 'Stable / Standard', color: 'border-emerald-300 text-emerald-800 bg-emerald-50' },
                  ].map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUrgency(u.id as any)}
                      className={`p-2 rounded text-left border transition-all ${
                        urgency === u.id ? `${u.color} ring-1 ring-offset-1 font-bold` : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-semibold text-xs">{u.label}</div>
                      <div className="text-[10px] text-slate-500">{u.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Condition summary */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Clinical Summary & Vitals</label>
                <textarea
                  rows={2}
                  value={clinicalCondition}
                  onChange={(e) => setClinicalCondition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:ring-1 focus:ring-teal-500 text-xs"
                />
              </div>

              {/* Essential Clinical Constraints / Care Components */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-800 text-xs">
                  Care Availability Constraints (All Mandatory):
                </div>
                <div className="flex flex-wrap gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={requiresIcu}
                      onChange={(e) => setRequiresIcu(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>ICU Bed Ready (Functional)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={requiresSpecialist}
                      onChange={(e) => setRequiresSpecialist(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Pulmonologist / Intensivist On Duty</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={requiresOxygen}
                      onChange={(e) => setRequiresOxygen(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>High-Flow Bulk O2 Operational</span>
                  </label>
                </div>
              </div>

              {/* Action Button: Evaluate Care Availability */}
              <button
                type="button"
                onClick={handleEvaluateCare}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-semibold rounded-md shadow-xs transition-colors min-h-[44px]"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Evaluate Care Availability Across Network</span>
              </button>
            </div>
          </div>

          {/* Care Match Evaluation Output (Matches Section 17 Exactly) */}
          {hasEvaluated && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Care Availability Evaluation Results
                </h3>
                <span className="text-xs text-slate-500">Section 17 Dilemma</span>
              </div>

              <div className="space-y-3">
                {matchResults.map((result) => {
                  const isSelected = selectedDestination?.facility.id === result.facility.id;
                  return (
                    <div
                      key={result.facility.id}
                      onClick={() => result.careAvailable && setSelectedDestination(result)}
                      className={`p-3.5 rounded-lg border transition-all min-h-[44px] ${
                        result.careAvailable
                          ? isSelected
                            ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500 cursor-pointer'
                            : 'border-slate-300 bg-white hover:border-emerald-400 cursor-pointer'
                          : 'border-slate-200 bg-slate-50/70 opacity-75 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">
                              {result.facility.name}
                            </h4>
                            {result.careAvailable ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                Care Ready (100%)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                Disqualified
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Transit ETA: <strong className="text-slate-800 font-mono">{result.etaMinutes} mins</strong> · {result.facility.district}
                          </div>
                        </div>

                        <div className="text-right text-xs">
                          <div className="font-mono text-slate-600">
                            ICU Ready: <strong className={result.hasBed ? 'text-emerald-700' : 'text-rose-700'}>{result.facility.capacity.icuReady}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Diagnostic Breakdown (2-col on phone, 4-col on tablet/desktop) */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                        <div className={`p-1.5 rounded text-center ${result.hasBed ? 'bg-emerald-50 text-emerald-800 font-medium' : 'bg-rose-50 text-rose-800'}`}>
                          Bed: {result.hasBed ? '✓ Ready' : '✗ 0 Beds'}
                        </div>
                        <div className={`p-1.5 rounded text-center ${result.hasStaff ? 'bg-emerald-50 text-emerald-800 font-medium' : 'bg-rose-50 text-rose-800'}`}>
                          Staff: {result.hasStaff ? '✓ Specialist' : '✗ No Specialist'}
                        </div>
                        <div className={`p-1.5 rounded text-center ${result.hasEquipment ? 'bg-emerald-50 text-emerald-800 font-medium' : 'bg-rose-50 text-rose-800'}`}>
                          O2: {result.hasEquipment ? '✓ Operational' : '✗ Off'}
                        </div>
                        <div className={`p-1.5 rounded text-center ${result.hasService ? 'bg-emerald-50 text-emerald-800 font-medium' : 'bg-rose-50 text-rose-800'}`}>
                          Service: {result.hasService ? '✓ Active' : '✗ Down'}
                        </div>
                      </div>

                      {/* Explainable Decision Note */}
                      <div className="mt-2 text-xs">
                        {result.careAvailable ? (
                          <div className="text-emerald-800 font-medium">
                            ✓ {result.matchReason}
                          </div>
                        ) : (
                          <div className="text-rose-700 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{result.disqualificationReason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Confirm Bed Hold & Dispatch Button */}
              {selectedDestination && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="bg-amber-50 border border-amber-200 rounded p-2.5 text-xs text-amber-900">
                    <strong>Digital Bed Hold Guarantee (Section 18):</strong> Reserving atomically will lock 1 ICU bed at <strong>{selectedDestination.facility.name}</strong> for 15 minutes, preventing competing referrals from double-booking.
                  </div>
                  <button
                    onClick={handleSubmitReferral}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-md shadow-xs transition-colors min-h-[44px]"
                  >
                    <Bed className="w-4 h-4 text-teal-400" />
                    <span>Initiate Digital Bed Hold & Dispatch ALS Ambulance</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Active Referral Chains & Bed Lifecycle State Machine */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-teal-600" />
                Active Referral & Reservation State Machine (Sections 18-20)
              </h3>
              <span className="text-xs text-teal-700 font-medium">{activeReferrals.length} In-Flight</span>
            </div>

            {/* Bed Lifecycle Reference Diagram */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Atomic Bed State Transitions:
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-700 overflow-x-auto pb-1">
                <span className="bg-white px-2 py-0.5 border rounded">READY</span>
                <span>→</span>
                <span className="bg-amber-50 px-2 py-0.5 border border-amber-200 text-amber-800 rounded font-semibold">SOFT HOLD</span>
                <span>→</span>
                <span className="bg-blue-50 px-2 py-0.5 border border-blue-200 text-blue-800 rounded">ACCEPTED</span>
                <span>→</span>
                <span className="bg-purple-50 px-2 py-0.5 border border-purple-200 text-purple-800 rounded">RESERVED</span>
                <span>→</span>
                <span className="bg-emerald-50 px-2 py-0.5 border border-emerald-200 text-emerald-800 rounded font-bold">OCCUPIED</span>
              </div>
            </div>

            {/* List of Active In-Flight Referrals */}
            {activeReferrals.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No active patient transfers currently in flight. Complete the evaluation on the left or run Demo Scenario 2 to simulate a transfer.
              </div>
            ) : (
              <div className="space-y-4">
                {activeReferrals.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-4 rounded-lg border border-slate-200 bg-white shadow-2xs space-y-3 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{ref.name}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-600 font-mono">{ref.patientRef}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            ref.urgency === 'CODE_RED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ref.urgency.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          Age {ref.age} / {ref.gender} · {ref.clinicalSummary}
                        </div>
                      </div>

                      {/* Soft hold countdown badge */}
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-1 rounded text-xs">
                          <Timer className="w-3.5 h-3.5 animate-pulse" />
                          <span>Hold lock until {ref.holdExpiresAt || '15 mins'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Routing Details */}
                    <div className="p-3 bg-slate-50 rounded border border-slate-200 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[11px] text-slate-500">Origin Node</div>
                        <div className="font-semibold text-slate-800">{ref.originFacilityName}</div>
                        <div className="text-[10px] text-slate-500">Dr: {ref.referringDoctorName}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">Destination (Matched)</div>
                        <div className="font-semibold text-teal-800">{ref.destinationFacilityName}</div>
                        <div className="text-[10px] text-teal-600 font-medium">Care Confirmed (ICU Bed + Pulmonologist)</div>
                      </div>
                    </div>

                    {/* Ambulance Coordination Details */}
                    <div className="flex items-center justify-between p-2.5 bg-blue-50/70 border border-blue-200 rounded text-blue-900">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-700" />
                        <div>
                          <div className="font-bold">Ambulance {ref.assignedAmbulanceId} (ALS Unit)</div>
                          <div className="text-[10px] text-blue-700">Equipped with Hamilton T1 Transport Ventilator & Defibrillator</div>
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-sm text-blue-900">
                        ETA {ref.ambulanceEtaMinutes} mins
                      </div>
                    </div>

                    {/* State Machine Transition Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-500">
                        Current Bed State: <strong className="text-slate-800">{ref.bedHoldStatus}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {ref.bedHoldStatus === 'SOFT_HOLD' && (
                          <button
                            onClick={() => onUpdateReferralStatus(ref.id, 'ACCEPTED', 'RESERVED')}
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded font-medium text-xs transition-colors"
                          >
                            Hospital Doctor Accept & Reserve
                          </button>
                        )}

                        {(ref.bedHoldStatus === 'RESERVED' || ref.bedHoldStatus === 'SOFT_HOLD') && (
                          <button
                            onClick={() => onUpdateReferralStatus(ref.id, 'ADMITTED', 'OCCUPIED')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs transition-colors"
                          >
                            Patient Arrived: Atomic Admit (OCCUPIED)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
