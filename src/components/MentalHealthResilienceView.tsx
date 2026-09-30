import React, { useState, useEffect } from 'react';
import { 
  TeleManasCallRecord, 
  MentalHealthBedRecord, 
  Phq9Screening, 
  MedicineInventory, 
  Facility, 
  UserContext,
  BedState
} from '../types';
import { soothingAudio, generateFhirPhq9Response } from '../services/soundAndInteroperability';
import { 
  Heart, 
  Headphones, 
  Bed, 
  ClipboardCheck, 
  Wind, 
  Pill, 
  PhoneCall, 
  AlertTriangle, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  FileCode, 
  ShieldCheck, 
  User, 
  Activity, 
  Clock, 
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Send,
  Sparkle
} from 'lucide-react';

interface MentalHealthResilienceViewProps {
  userContext: UserContext;
  facilities: Facility[];
  teleManasCalls: TeleManasCallRecord[];
  onUpdateTeleManasCall: (callId: string, updates: Partial<TeleManasCallRecord>) => void;
  mentalHealthBeds: MentalHealthBedRecord[];
  onUpdateBedState: (bedId: string, newState: BedState, patientName?: string) => void;
  psychotropicInventory: MedicineInventory[];
  onInitiateTransfer: (inv: MedicineInventory) => void;
  onReferToBed: (bed: MentalHealthBedRecord) => void;
}

export const MentalHealthResilienceView: React.FC<MentalHealthResilienceViewProps> = ({
  userContext,
  facilities,
  teleManasCalls,
  onUpdateTeleManasCall,
  mentalHealthBeds,
  onUpdateBedState,
  psychotropicInventory,
  onInitiateTransfer,
  onReferToBed,
}) => {
  const [activeTab, setActiveTab] = useState<'telemanas' | 'beds' | 'screening' | 'breathing' | 'meds'>('telemanas');

  // Audio state
  const [isRainPlaying, setIsRainPlaying] = useState<boolean>(false);
  const [chimeEnabled, setChimeEnabled] = useState<boolean>(true);

  // Active call modal state
  const [activeCallSession, setActiveCallSession] = useState<TeleManasCallRecord | null>(null);
  const [sessionTimer, setSessionTimer] = useState<number>(0);
  const [sessionNotes, setSessionNotes] = useState<string>('');

  // PHQ-9 interactive state
  const [phqPatientName, setPhqPatientName] = useState<string>('Pooja Kadam');
  const [phqPatientRef, setPhqPatientRef] = useState<string>('SS-PAT-2026-7782');
  const [phqAnswers, setPhqAnswers] = useState<number[]>([1, 2, 1, 1, 0, 1, 0, 0, 0]);
  const [fhirModalOpen, setFhirModalOpen] = useState<boolean>(false);
  const [fhirJsonOutput, setFhirJsonOutput] = useState<string>('');
  const [copiedFhir, setCopiedFhir] = useState<boolean>(false);

  // Breathing pacer state
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'INHALE' | 'HOLD' | 'EXHALE'>('INHALE');
  const [breathCount, setBreathCount] = useState<number>(4);
  const [breathTechnique, setBreathTechnique] = useState<'478' | 'box'>('478');
  const [completedCycles, setCompletedCycles] = useState<number>(0);

  // 4-7-8 Breathing Timer Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (breathTechnique === '478') {
              if (breathPhase === 'INHALE') {
                setBreathPhase('HOLD');
                if (chimeEnabled) soothingAudio.playCalmChime(528, 1.5);
                return 7;
              } else if (breathPhase === 'HOLD') {
                setBreathPhase('EXHALE');
                if (chimeEnabled) soothingAudio.playCalmChime(396, 2.5);
                return 8;
              } else {
                setBreathPhase('INHALE');
                setCompletedCycles((c) => c + 1);
                if (chimeEnabled) soothingAudio.playCalmChime(432, 2.0);
                return 4;
              }
            } else {
              // Box Breathing (4-4-4-4)
              if (breathPhase === 'INHALE') {
                setBreathPhase('HOLD');
                return 4;
              } else if (breathPhase === 'HOLD') {
                setBreathPhase('EXHALE');
                return 4;
              } else {
                setBreathPhase('INHALE');
                setCompletedCycles((c) => c + 1);
                return 4;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase, breathTechnique, chimeEnabled]);

  // Tele-MANAS in-call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCallSession) {
      interval = setInterval(() => {
        setSessionTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCallSession]);

  const handleToggleRain = () => {
    const next = !isRainPlaying;
    soothingAudio.toggleRainAmbience(next);
    setIsRainPlaying(next);
  };

  // PHQ-9 calculations
  const phqQuestions = [
    'Little interest or pleasure in doing things',
    'Feeling down, depressed, or hopeless',
    'Trouble falling or staying asleep, or sleeping too much',
    'Feeling tired or having little energy',
    'Poor appetite or overeating',
    'Feeling bad about yourself — or that you are a failure or let family down',
    'Trouble concentrating on things (reading, television, work)',
    'Moving or speaking so slowly that others noticed, or fidgety restlessness',
    'Thoughts that you would be better off dead, or of hurting yourself in some way',
  ];

  const totalPhqScore = phqAnswers.reduce((a, b) => a + b, 0);
  const isSuicideRisk = phqAnswers[8] > 0;

  const getPhqSeverity = (score: number) => {
    if (score <= 4) return { label: 'Minimal / None', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score <= 9) return { label: 'Mild Depression', color: 'text-teal-700 bg-teal-50 border-teal-200' };
    if (score <= 14) return { label: 'Moderate Depression', color: 'text-amber-800 bg-amber-50 border-amber-200' };
    if (score <= 19) return { label: 'Moderately Severe', color: 'text-orange-800 bg-orange-50 border-orange-200' };
    return { label: 'Severe Depression', color: 'text-rose-800 bg-rose-50 border-rose-200' };
  };

  const handleExportFhir = () => {
    const json = generateFhirPhq9Response({
      id: `phq-${Date.now()}`,
      patientRef: phqPatientRef,
      patientName: phqPatientName,
      totalScore: totalPhqScore,
      severity: getPhqSeverity(totalPhqScore).label,
      conductedBy: userContext.name,
      conductedAt: new Date().toLocaleDateString(),
      answers: phqAnswers,
    });
    setFhirJsonOutput(json);
    setFhirModalOpen(true);
  };

  const handleCopyFhir = () => {
    navigator.clipboard.writeText(fhirJsonOutput);
    setCopiedFhir(true);
    setTimeout(() => setCopiedFhir(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Mental Health Soothing Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-indigo-50/60 border border-emerald-100/80 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>National Mental Health Mission</span>
              <span aria-hidden="true" className="text-emerald-400">·</span>
              <span>Tele-MANAS 14416 Node</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950">
              Mental Health & Psychosocial Resilience Grid
            </h1>
            <p className="text-xs sm:text-sm text-emerald-800/90 leading-relaxed">
              District-wide psychiatric emergency bed coordination, live Tele-MANAS distress triage, standardized clinical depression & anxiety scoring, and grounding bio-feedback tools.
            </p>
          </div>

          {/* Quick Sound & Mindfulness Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 bg-white/80 backdrop-blur-xs p-2.5 rounded-2xl border border-emerald-100 shadow-2xs">
            <button
              onClick={handleToggleRain}
              title="Toggle calming rain / pink noise ambience"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isRainPlaying 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {isRainPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              <span>{isRainPlaying ? 'Calm Rain Playing' : 'Ambient Audio'}</span>
            </button>

            <button
              onClick={() => {
                soothingAudio.playCalmChime(432, 2.5);
              }}
              title="Test 432Hz harmonic soothing chime"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Peaceful Chime</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Health Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-emerald-200/50">
          <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">
            <div className="text-xs font-medium text-slate-500">Tele-MANAS Calls</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
              {teleManasCalls.filter(c => c.status === 'IN_CALL' || c.status === 'QUEUED').length} <span className="text-xs font-medium text-emerald-600">Active</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Toll-free 14416</div>
          </div>

          <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">
            <div className="text-xs font-medium text-slate-500">Psychiatric Beds</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
              {mentalHealthBeds.filter(b => b.state === 'READY' || b.state === 'VACANT').length} <span className="text-xs font-medium text-teal-600">Available</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across 3 Centers</div>
          </div>

          <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">
            <div className="text-xs font-medium text-slate-500">Psychotropic Medicines</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
              {psychotropicInventory.length} <span className="text-xs font-medium text-emerald-600">Tracked</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Sertraline, Olanzapine</div>
          </div>

          <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">
            <div className="text-xs font-medium text-slate-500">Staff Well-being</div>
            <div className="text-xl font-bold text-emerald-700 mt-0.5 tabular-nums">
              92.4% <span className="text-xs font-medium text-emerald-600">Optimal</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Shift load balanced</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-emerald-100">
        <button
          onClick={() => setActiveTab('telemanas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'telemanas'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Tele-MANAS 14416 Triage</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            activeTab === 'telemanas' ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {teleManasCalls.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('beds')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'beds'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>Psychiatric Beds & Calm Rooms</span>
        </button>

        <button
          onClick={() => setActiveTab('screening')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'screening'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Clinical PHQ-9 / GAD-7 Screening</span>
        </button>

        <button
          onClick={() => setActiveTab('breathing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'breathing'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Mindfulness & Breathing Pacer</span>
        </button>

        <button
          onClick={() => setActiveTab('meds')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            activeTab === 'meds'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Psychotropic Supply Grid</span>
        </button>
      </div>

      {/* TAB 1: Tele-MANAS (14416) Real-time Triage Console */}
      {activeTab === 'telemanas' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">National Tele-Mental Health Assistance and Networking (Tele-MANAS)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized helpline (14416) routing distress calls to District Mental Health Program counselors and emergency response teams.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live SIP Trunk Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teleManasCalls.map((call) => {
              const isUrgent = call.urgencyLevel === 'TIER_3_CRISIS_EMERGENCY';
              const isElevated = call.urgencyLevel === 'TIER_2_ELEVATED';

              return (
                <div 
                  key={call.callId}
                  className="bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-950">{call.callId}</span>
                          <span className="text-[11px] text-slate-400">· {call.timestamp}</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-800 mt-0.5">{call.callerDistrict}</div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight border ${
                        isUrgent 
                          ? 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
                          : isElevated
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {call.urgencyLevel.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Caller Category:</span>
                        <span className="font-medium text-slate-800">{call.callerAgeGroup}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Chief Distress:</span>
                        <span className="font-semibold text-emerald-900">{call.primaryConcern.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Assigned Counselor:</span>
                        <span className="font-medium text-slate-700">{call.assignedCounselor}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-100/50 italic">
                      "{call.recommendation}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        call.status === 'IN_CALL' ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'
                      }`}></span>
                      <span className="text-xs font-medium text-slate-600">
                        {call.status === 'IN_CALL' ? `In Session (${call.durationMinutes}m)` : call.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {call.status === 'IN_CALL' && (
                        <button
                          onClick={() => {
                            setActiveCallSession(call);
                            setSessionTimer(call.durationMinutes * 60);
                            setSessionNotes(call.recommendation);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Headphones className="w-3.5 h-3.5" />
                          <span>Console</span>
                        </button>
                      )}

                      {call.status === 'QUEUED' && (
                        <button
                          onClick={() => {
                            onUpdateTeleManasCall(call.callId, { status: 'IN_CALL', durationMinutes: 1 });
                            setActiveCallSession({ ...call, status: 'IN_CALL' });
                            setSessionTimer(60);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Connect</span>
                        </button>
                      )}

                      {isUrgent && !call.dispatchedMobileTeam && (
                        <button
                          onClick={() => {
                            onUpdateTeleManasCall(call.callId, { dispatchedMobileTeam: true });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Dispatch Team</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Psychiatric Beds & Sensory Calm Rooms */}
      {activeTab === 'beds' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">District Psychiatric Bed & Calm Room Registry</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time tracking of Psychiatric Intensive Care Units (PICU), De-Addiction beds, and Sensory De-escalation Calm Rooms.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Ready ({mentalHealthBeds.filter(b => b.state === 'READY').length})
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Occupied ({mentalHealthBeds.filter(b => b.state === 'OCCUPIED').length})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentalHealthBeds.map((bed) => {
              const isReady = bed.state === 'READY' || bed.state === 'VACANT';
              const isCalmRoom = bed.wardType === 'CALM_ROOM';

              return (
                <div 
                  key={bed.id}
                  className={`bg-white rounded-2xl p-4 border transition-all ${
                    isCalmRoom ? 'border-teal-200 bg-gradient-to-b from-teal-50/30 to-white' : 'border-emerald-100'
                  } shadow-2xs`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{bed.bedNumber}</span>
                        {isCalmRoom && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                            Sensory Calm
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{bed.facilityName}</div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold tracking-tight border ${
                      isReady 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {bed.state}
                    </span>
                  </div>

                  <div className="mt-3 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Ward:</span>
                      <span className="font-medium text-slate-800">{bed.wardType.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Psychiatrist:</span>
                      <span className="font-medium text-slate-700">{bed.doctorInCharge}</span>
                    </div>
                    {bed.patientName && (
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Admitted Patient:</span>
                        <span className="font-semibold text-slate-900">{bed.patientName} ({bed.patientAge}y)</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">Gender: {bed.genderReserved}</span>

                    <div className="flex items-center gap-2">
                      {isReady ? (
                        <button
                          onClick={() => {
                            const name = prompt('Enter Patient Name for Psychiatric Bed Hold:', 'Emergency Psych Referral');
                            if (name) {
                              onUpdateBedState(bed.id, 'OCCUPIED', name);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                        >
                          Admit Patient
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            onUpdateBedState(bed.id, 'READY');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                        >
                          Mark Discharged
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Standard Clinical PHQ-9 & GAD-7 Screening Calculator */}
      {activeTab === 'screening' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-emerald-100 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-semibold mb-1">
                <Sparkle className="w-3.5 h-3.5 text-emerald-600" />
                Validated Diagnostic Screener
              </div>
              <h2 className="text-lg font-bold text-slate-900">PHQ-9 (Patient Health Questionnaire - 9)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard evidence-based clinical depression assessment instrument compliant with ABDM and Tele-MANAS guidelines.
              </p>
            </div>

            {/* Live Score Display */}
            <div className="flex items-center gap-3 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80 shrink-0">
              <div className="text-right">
                <div className="text-[11px] font-semibold text-slate-500 uppercase">Score (0-27)</div>
                <div className="text-2xl font-black text-emerald-950 tabular-nums">{totalPhqScore} / 27</div>
              </div>
              <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${getPhqSeverity(totalPhqScore).color}`}>
                {getPhqSeverity(totalPhqScore).label}
              </div>
            </div>
          </div>

          {/* Patient Details Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Patient Name</label>
              <input
                type="text"
                value={phqPatientName}
                onChange={(e) => setPhqPatientName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">ABHA / Patient ID</label>
              <input
                type="text"
                value={phqPatientRef}
                onChange={(e) => setPhqPatientRef(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono font-medium focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Warning banner if suicide risk is triggered */}
          {isSuicideRisk && (
            <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-start gap-3 text-rose-900 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-rose-950">Suicidal Ideation Risk Flagged (Question 9 &gt; 0)</div>
                <div className="text-xs text-rose-800 leading-relaxed">
                  Immediate clinical safety protocol required: Keep patient under direct observation, initiate Tele-MANAS emergency psychiatric consultation, and prepare transfer to Hospital B Calm Room.
                </div>
              </div>
            </div>
          )}

          {/* The 9 questions */}
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Over the last 2 weeks, how often have you been bothered by any of the following problems?
            </div>

            <div className="space-y-3">
              {phqQuestions.map((q, qIdx) => (
                <div 
                  key={qIdx}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    phqAnswers[qIdx] > 0 ? 'bg-emerald-50/30 border-emerald-200' : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-800 flex-1">
                      <strong className="text-emerald-900 mr-1.5">{qIdx + 1}.</strong> {q}
                    </span>

                    <div className="grid grid-cols-4 gap-1.5 shrink-0 text-[11px]">
                      {[
                        { val: 0, label: 'Not at all' },
                        { val: 1, label: 'Several days' },
                        { val: 2, label: '> Half days' },
                        { val: 3, label: 'Nearly daily' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => {
                            const copy = [...phqAnswers];
                            copy[qIdx] = opt.val;
                            setPhqAnswers(copy);
                          }}
                          className={`px-2.5 py-1.5 rounded-xl font-medium transition-all text-center ${
                            phqAnswers[qIdx] === opt.val
                              ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar: FHIR Export & Referral creation */}
          <div className="pt-4 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Evaluator: <strong>{userContext.name}</strong> · Role: <span className="font-mono text-emerald-800">{userContext.role}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportFhir}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileCode className="w-4 h-4 text-emerald-700" />
                <span>Export HL7 FHIR R4 JSON</span>
              </button>

              <button
                onClick={() => {
                  alert(`Referral initiated for ${phqPatientName} with PHQ-9 score ${totalPhqScore} (${getPhqSeverity(totalPhqScore).label}). Tele-Psychiatrist assigned.`);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Submit to District Mental Health Registry</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Mindfulness & Guided Breathing Pacer (4-7-8 & Grounding) */}
      {activeTab === 'breathing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Visual Pacer */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-2xs flex flex-col items-center justify-center text-center">
            <div className="max-w-md space-y-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                <Wind className="w-3.5 h-3.5" />
                Parasympathetic Nervous System De-escalation
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {breathTechnique === '478' ? '4-7-8 Relaxing Breath Pacer' : 'Box Breathing (4-4-4-4)'}
              </h2>
              <p className="text-xs text-slate-500">
                Proven autonomic relaxation tool for calming acute patient agitation, panic episodes, or clinician shift burnout.
              </p>
            </div>

            {/* Animated Breathing Circle */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4 flex items-center justify-center">
              {/* Outer soft ambient halo */}
              <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                isBreathingActive && breathPhase === 'INHALE' 
                  ? 'scale-110 bg-emerald-100/60' 
                  : isBreathingActive && breathPhase === 'HOLD'
                  ? 'scale-105 bg-teal-100/60'
                  : 'scale-90 bg-slate-100/40'
              }`}></div>

              {/* Main circle */}
              <div className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-lg ${
                breathPhase === 'INHALE'
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white scale-105'
                  : breathPhase === 'HOLD'
                  ? 'bg-gradient-to-tr from-teal-500 to-cyan-500 text-white scale-100'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white scale-90'
              }`}>
                <span className="text-xs font-semibold uppercase tracking-widest text-emerald-100">
                  {isBreathingActive ? breathPhase : 'READY'}
                </span>
                <span className="text-5xl font-black tabular-nums my-1">
                  {isBreathingActive ? breathCount : '—'}
                </span>
                <span className="text-[11px] text-emerald-100 font-medium">
                  {breathPhase === 'INHALE' ? 'Inhale through nose' : breathPhase === 'HOLD' ? 'Hold peacefully' : 'Exhale through mouth'}
                </span>
              </div>
            </div>

            {/* Cycles counter */}
            <div className="text-xs text-slate-500 mb-6">
              Completed Breathing Cycles: <strong className="text-emerald-950 font-bold">{completedCycles}</strong>
            </div>

            {/* Breathing controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  if (!isBreathingActive && chimeEnabled) {
                    soothingAudio.playCalmChime(432, 2.0);
                  }
                  setIsBreathingActive(!isBreathingActive);
                }}
                className={`px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all ${
                  isBreathingActive 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isBreathingActive ? 'Pause Exercise' : 'Begin Pacing'}</span>
              </button>

              <button
                onClick={() => setChimeEnabled(!chimeEnabled)}
                className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  chimeEnabled ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-500'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{chimeEnabled ? 'Chime ON' : 'Chime Muted'}</span>
              </button>

              <button
                onClick={() => {
                  setBreathTechnique(t => t === '478' ? 'box' : '478');
                  setBreathPhase('INHALE');
                  setBreathCount(4);
                }}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
              >
                Mode: {breathTechnique === '478' ? '4-7-8 Dr. Weil' : 'Box 4-4-4-4'}
              </button>
            </div>
          </div>

          {/* Sensory Grounding Protocol (5-4-3-2-1) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-emerald-100 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-semibold mb-1">
                <Heart className="w-3.5 h-3.5 text-emerald-600" />
                Rapid Panic De-escalation
              </div>
              <h3 className="text-base font-bold text-slate-900">5-4-3-2-1 Grounding Protocol</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sensory grounding techniques guide a patient experiencing panic or dissociation back into the present moment.
              </p>

              <div className="space-y-2.5 mt-4 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">5</span>
                  <div>
                    <strong className="text-emerald-950">Acknowledge 5 things you can SEE</strong>
                    <div className="text-slate-600 mt-0.5">Notice colors, shadows, objects on the table, patterns on the floor.</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-teal-50/50 border border-teal-100 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                  <div>
                    <strong className="text-teal-950">Acknowledge 4 things you can TOUCH</strong>
                    <div className="text-slate-600 mt-0.5">The fabric of clothing, smooth edge of the chair, cool desktop surface.</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-cyan-50/50 border border-cyan-100 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-700 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <div>
                    <strong className="text-cyan-950">Acknowledge 3 things you can HEAR</strong>
                    <div className="text-slate-600 mt-0.5">Distant traffic, subtle rain ambience, rhythm of your own breath.</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <div>
                    <strong className="text-indigo-950">Acknowledge 2 things you can SMELL</strong>
                    <div className="text-slate-600 mt-0.5">Antiseptic clinical air, rain moisture, eucalyptus balm.</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-violet-50/50 border border-violet-100 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <div>
                    <strong className="text-violet-950">Acknowledge 1 positive thought about YOURSELF</strong>
                    <div className="text-slate-600 mt-0.5">"I am safe right now. My body is resilient. Help is here."</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>National Health Portal (NHP) Guidance</span>
              <span className="text-emerald-700 font-semibold">Self-Regulating</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Psychotropic Medicine Inventory & Resilience */}
      {activeTab === 'meds' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Psychotropic & Mental Health Essential Medicine Grid</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring Days of Supply (DoS), cold chain compliance, and Schedule H1 psychotropic reserve balance.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
              National List of Essential Medicines (NLEM) 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {psychotropicInventory.map((inv) => {
              const isAtRisk = inv.resilienceStatus === 'AT_RISK' || inv.resilienceStatus === 'CRITICAL';
              const isWatch = inv.resilienceStatus === 'WATCH';

              return (
                <div 
                  key={inv.id}
                  className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-mono font-bold text-emerald-900">{inv.medicineCode}</div>
                        <div className="text-sm font-bold text-slate-900 mt-0.5">{inv.medicineName}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isAtRisk ? 'bg-rose-50 text-rose-800 border-rose-200' : isWatch ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {inv.resilienceStatus}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                      Facility: <strong className="text-slate-800">{inv.facilityName}</strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-emerald-50/40 p-2 rounded-xl border border-emerald-100/60">
                        <span className="text-[11px] text-slate-500 block">Current Stock</span>
                        <strong className="text-base text-slate-900 font-bold">{inv.currentStock} {inv.unit}</strong>
                      </div>
                      <div className="bg-emerald-50/40 p-2 rounded-xl border border-emerald-100/60">
                        <span className="text-[11px] text-slate-500 block">Days of Supply</span>
                        <strong className="text-base text-emerald-800 font-bold">{inv.daysOfSupply} d</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Lead time: {inv.leadTimeDays}d</span>
                    <button
                      onClick={() => onInitiateTransfer(inv)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors"
                    >
                      <span>Propose Rebalance</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tele-MANAS Live Active Session Modal / Drawer */}
      {activeCallSession && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-200">Active Tele-Counseling Session</div>
                  <div className="text-base font-bold">{activeCallSession.callId} · {activeCallSession.callerDistrict}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-600/50">
                <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span className="font-mono text-xs font-bold tabular-nums">
                  {Math.floor(sessionTimer / 60).toString().padStart(2, '0')}:{(sessionTimer % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 space-y-1">
                <div className="font-semibold text-emerald-950">Tele-MANAS Level 2 Protocol Activated</div>
                <p className="text-emerald-800">
                  Counselor: {activeCallSession.assignedCounselor} · Primary concern: {activeCallSession.primaryConcern}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Counseling Session Notes</label>
                <textarea
                  rows={4}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-emerald-600"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onUpdateTeleManasCall(activeCallSession.callId, { 
                      status: 'RESOLVED_TELEPHONICALLY',
                      recommendation: sessionNotes 
                    });
                    setActiveCallSession(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors"
                >
                  Conclude & De-escalate
                </button>

                <button
                  onClick={() => {
                    onUpdateTeleManasCall(activeCallSession.callId, { 
                      status: 'REFERRED_TO_CHC',
                      dispatchedMobileTeam: true,
                      recommendation: `${sessionNotes} — Urgent referral to CHC Calm Room.`
                    });
                    setActiveCallSession(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs transition-colors"
                >
                  Transfer to District Calm Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FHIR JSON Export Modal */}
      {fhirModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">HL7 FHIR R4 QuestionnaireResponse (Interoperability Document)</span>
              </div>
              <button 
                onClick={() => setFhirModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Standard: LOINC 44249-1 · Ayushman Bharat Digital Mission (ABDM) Compatible</span>
                <button
                  onClick={handleCopyFhir}
                  className="flex items-center gap-1 text-emerald-700 font-semibold hover:text-emerald-800"
                >
                  {copiedFhir ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFhir ? 'Copied to Clipboard' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 text-emerald-400 p-4 rounded-2xl text-[11px] font-mono overflow-auto max-h-96">
                {fhirJsonOutput}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
