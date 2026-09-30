import React, { useState } from 'react';
import { 
  Play, 
  Check, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  HeartHandshake, 
  Database,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface ScenarioModalsProps {
  scenario1Open: boolean;
  onCloseScenario1: () => void;
  onApplyScenario1Step: (step: number) => void;
  scenario2Open: boolean;
  onCloseScenario2: () => void;
  onApplyScenario2Step: (step: number) => void;
}

export const SCENARIO_1_STEPS = [
  { step: 1, title: 'PHC-A Normal Initial Stock', desc: 'PHC-A maintains baseline ORS inventory at 410 sachets.' },
  { step: 2, title: 'Outbreak Patient Surge', desc: 'Monsoon gastroenteritis footfall increases consumption to 103 units/day.' },
  { step: 3, title: 'Forecast Service Alert', desc: 'Vertex ML predicts 7-day requirement of 720 units (range 640-810).' },
  { step: 4, title: 'Resilience Status → CRITICAL', desc: 'Days of Supply falls to 3.98 days. Replenishment gap hits 4.02 days.' },
  { step: 5, title: 'XAI Generates Explanation Packet', desc: 'SHAP factors attribute +45% outbreak footfall, +30% seasonality, +25% supply delay.' },
  { step: 6, title: 'Warehouse Lead-Time Checked', desc: 'Central Drug Store W1 requires 3 days; emergency transport needed.' },
  { step: 7, title: 'Nearby Safe Surplus Discovered', desc: 'PHC-B has 1,600 units (1,100 safety reserve = 500 transferable). PHC-C has 300 transferable.' },
  { step: 8, title: 'OR-Tools Optimizer Allocates Units', desc: 'Multi-source allocation plan: PHC-B transfers 450 units, PHC-C transfers 250 units.' },
  { step: 9, title: 'District Officer (CMO) Approves', desc: 'Officer reviews constraint safety and gives electronic authorization.' },
  { step: 10, title: 'ML-DSA-65 Quantum-Resistant Signature', desc: 'PQC signature token generated (0xMLDSA65_7bf8910a...) for dispatch.' },
  { step: 11, title: 'Logistics Shipment Dispatched', desc: '108 Logistics Unit takes custody with temperature and tamper monitoring.' },
  { step: 12, title: 'Receiving PHC-A Confirms Receipt', desc: 'Pharmacist logs 450 incoming units. Barcode scan reconciles serials.' },
  { step: 13, title: 'Inventory Reconciled', desc: 'Current stock rises to 860 sachets. Effective stock rises to 960.' },
  { step: 14, title: 'Resilience Status → STABLE', desc: 'Days of Supply reaches 8.3 days. Projected deficit falls to 0.' },
  { step: 15, title: 'Merkle Ledger Checkpointed', desc: 'Cryptographic hash recorded in immutable ledger block #14209.' },
];

export const SCENARIO_2_STEPS = [
  { step: 1, title: 'Doctor Opens Patient Referral', desc: 'Dr. Sunita Rao at PHC-A opens referral module.' },
  { step: 2, title: 'Zero-Friction Context Auto-Populates', desc: 'Clinician ID, PHC-A coordinates, and timestamp fill automatically.' },
  { step: 3, title: 'Clinician Specifies Critical Care Constraints', desc: 'Severe ARDS patient requires: ICU Bed + Pulmonologist + Oxygen.' },
  { step: 4, title: 'Care Availability Matcher Evaluates Network', desc: 'Formula evaluates Hospital A (0 beds), Hospital B (2 beds + specialist), Hospital C (no specialist).' },
  { step: 5, title: 'Hospital B Selected (Full Clinical Capability)', desc: 'Hospital B is selected despite 17 min ETA vs Hospital A’s 8 min (A has 0 beds).' },
  { step: 6, title: 'XAI Explains Destination Match', desc: 'Transparent reason provided: 100% Care Availability satisfaction.' },
  { step: 7, title: 'Hospital B Receiving Doctor Accepts', desc: 'Dr. Sunanda Mehta accepts referral electronically via secure notification.' },
  { step: 8, title: 'Atomic Bed Soft Hold Activated', desc: 'ICU Bed #4 enters 15-minute countdown hold. Double booking prevented.' },
  { step: 9, title: 'ALS Ambulance MH-12-EMS-1081 Dispatched', desc: 'Vehicle equipped with Hamilton T1 Transport Ventilator departs base.' },
  { step: 10, title: 'Digital Referral Packet Handed Over', desc: 'Vitals, blood gas, and IV fluids transferred digitally to paramedics.' },
  { step: 11, title: 'Live GPS ETA Transmitted', desc: 'Hospital B critical care team prepares resuscitation bay for arrival.' },
  { step: 12, title: 'Patient Arrives at Hospital B', desc: 'Direct admission to ICU Bed #4 without duplicate paperwork.' },
  { step: 13, title: 'Bed State Changes to OCCUPIED & Ledger Signed', desc: 'Admission verified and logged with ML-DSA signature in ledger block #14210.' },
];

export const ScenarioModals: React.FC<ScenarioModalsProps> = ({
  scenario1Open,
  onCloseScenario1,
  onApplyScenario1Step,
  scenario2Open,
  onCloseScenario2,
  onApplyScenario2Step,
}) => {
  const [s1CurrentStep, setS1CurrentStep] = useState(0);
  const [s2CurrentStep, setS2CurrentStep] = useState(0);

  return (
    <>
      {/* Demo Scenario 1 Modal */}
      {scenario1Open && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Demo Scenario 1: Medicine Shortage & Redistribution
                  </h3>
                  <p className="text-xs text-slate-500">
                    15-Stage End-to-End Simulation (Document Section 39)
                  </p>
                </div>
              </div>
              <button onClick={onCloseScenario1} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Step Focus */}
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-lg text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-900 text-sm font-mono">
                  Step {SCENARIO_1_STEPS[s1CurrentStep]?.step} of 15: {SCENARIO_1_STEPS[s1CurrentStep]?.title}
                </span>
                <span className="px-2 py-0.5 bg-white text-teal-800 rounded font-semibold text-[11px] border border-teal-200">
                  {Math.round(((s1CurrentStep + 1) / 15) * 100)}% Complete
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {SCENARIO_1_STEPS[s1CurrentStep]?.desc}
              </p>
            </div>

            {/* Step list scroller */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 border border-slate-200 rounded-lg p-2 divide-y divide-slate-100">
              {SCENARIO_1_STEPS.map((s, idx) => (
                <div
                  key={s.step}
                  onClick={() => {
                    setS1CurrentStep(idx);
                    onApplyScenario1Step(s.step);
                  }}
                  className={`p-2 rounded text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    s1CurrentStep === idx
                      ? 'bg-teal-600 text-white font-semibold'
                      : idx < s1CurrentStep
                      ? 'bg-slate-50 text-slate-600'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-mono">{s.step}.</span>
                    <span>{s.title}</span>
                  </div>
                  {idx < s1CurrentStep && <Check className="w-3.5 h-3.5 text-teal-600" />}
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setS1CurrentStep(0);
                  onApplyScenario1Step(1);
                }}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Scenario</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (s1CurrentStep > 0) {
                      const next = s1CurrentStep - 1;
                      setS1CurrentStep(next);
                      onApplyScenario1Step(SCENARIO_1_STEPS[next]!.step);
                    }
                  }}
                  disabled={s1CurrentStep === 0}
                  className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-40"
                >
                  Previous Step
                </button>

                <button
                  onClick={() => {
                    if (s1CurrentStep < SCENARIO_1_STEPS.length - 1) {
                      const next = s1CurrentStep + 1;
                      setS1CurrentStep(next);
                      onApplyScenario1Step(SCENARIO_1_STEPS[next]!.step);
                    } else {
                      onCloseScenario1();
                    }
                  }}
                  className="px-4 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors flex items-center gap-1"
                >
                  <span>{s1CurrentStep === SCENARIO_1_STEPS.length - 1 ? 'Finish & Close' : 'Execute Next Step'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Scenario 2 Modal */}
      {scenario2Open && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Demo Scenario 2: Emergency Patient Referral & Care Match
                  </h3>
                  <p className="text-xs text-slate-500">
                    13-Stage End-to-End Simulation (Document Section 40)
                  </p>
                </div>
              </div>
              <button onClick={onCloseScenario2} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Step Focus */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 text-sm font-mono">
                  Step {SCENARIO_2_STEPS[s2CurrentStep]?.step} of 13: {SCENARIO_2_STEPS[s2CurrentStep]?.title}
                </span>
                <span className="px-2 py-0.5 bg-white text-blue-800 rounded font-semibold text-[11px] border border-blue-200">
                  {Math.round(((s2CurrentStep + 1) / 13) * 100)}% Complete
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {SCENARIO_2_STEPS[s2CurrentStep]?.desc}
              </p>
            </div>

            {/* Step list scroller */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 border border-slate-200 rounded-lg p-2 divide-y divide-slate-100">
              {SCENARIO_2_STEPS.map((s, idx) => (
                <div
                  key={s.step}
                  onClick={() => {
                    setS2CurrentStep(idx);
                    onApplyScenario2Step(s.step);
                  }}
                  className={`p-2 rounded text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    s2CurrentStep === idx
                      ? 'bg-blue-600 text-white font-semibold'
                      : idx < s2CurrentStep
                      ? 'bg-slate-50 text-slate-600'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-mono">{s.step}.</span>
                    <span>{s.title}</span>
                  </div>
                  {idx < s2CurrentStep && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setS2CurrentStep(0);
                  onApplyScenario2Step(1);
                }}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Scenario</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (s2CurrentStep > 0) {
                      const next = s2CurrentStep - 1;
                      setS2CurrentStep(next);
                      onApplyScenario2Step(SCENARIO_2_STEPS[next]!.step);
                    }
                  }}
                  disabled={s2CurrentStep === 0}
                  className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-40"
                >
                  Previous Step
                </button>

                <button
                  onClick={() => {
                    if (s2CurrentStep < SCENARIO_2_STEPS.length - 1) {
                      const next = s2CurrentStep + 1;
                      setS2CurrentStep(next);
                      onApplyScenario2Step(SCENARIO_2_STEPS[next]!.step);
                    } else {
                      onCloseScenario2();
                    }
                  }}
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-1"
                >
                  <span>{s2CurrentStep === SCENARIO_2_STEPS.length - 1 ? 'Finish & Close' : 'Execute Next Step'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
