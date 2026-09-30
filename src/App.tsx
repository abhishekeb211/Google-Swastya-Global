import React, { useState } from 'react';
import { 
  UserContext, 
  Facility, 
  MedicineInventory, 
  Ambulance, 
  AuditLedgerEvent, 
  ReferralPatient, 
  OfflineQueueItem, 
  RedistributionTransfer, 
  ExplanationPacket, 
  CryptoProvider,
  BedState
} from './types';
import { 
  INITIAL_USER_CONTEXT, 
  INITIAL_FACILITIES, 
  INITIAL_INVENTORY, 
  INITIAL_AMBULANCES, 
  INITIAL_LEDGER_EVENTS,
  INITIAL_TELEMANAS_CALLS,
  INITIAL_MENTAL_HEALTH_BEDS,
  INITIAL_MENTAL_HEALTH_INVENTORY
} from './data/mockDatabase';
import { 
  generateSha256, 
  generateCryptoSignature, 
  generateShortageExplanation 
} from './services/resilienceEngine';

import { TopBar, DeviceMode } from './components/TopBar';
import { MasterLoopBar } from './components/MasterLoopBar';
import { LiveStateView } from './components/LiveStateView';
import { SupplyForecastView } from './components/SupplyForecastView';
import { ReferralCareMatchView } from './components/ReferralCareMatchView';
import { MentalHealthResilienceView } from './components/MentalHealthResilienceView';
import { AmbulanceFleetView } from './components/AmbulanceFleetView';
import { GeminiOrchestratorView } from './components/GeminiOrchestratorView';
import { PqcAuditLedgerView } from './components/PqcAuditLedgerView';
import { OfflineSyncModal } from './components/OfflineSyncModal';
import { ScenarioModals } from './components/ScenarioModals';
import { FlutterBottomNav } from './components/FlutterBottomNav';
import { FlutterFab } from './components/FlutterFab';

export default function App() {
  // Navigation & Role Context
  const [currentTab, setCurrentTab] = useState<string>('live-state');
  const [activeLoopStep, setActiveLoopStep] = useState<number>(1);
  const [userContext, setUserContext] = useState<UserContext>(INITIAL_USER_CONTEXT);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('fluid');

  // Network condition & Offline Queue
  const [networkStatus, setNetworkStatus] = useState<'ONLINE' | '2G_EDGE' | 'OFFLINE'>('ONLINE');
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Primary Domain State
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [inventories, setInventories] = useState<MedicineInventory[]>([
    ...INITIAL_INVENTORY,
    ...INITIAL_MENTAL_HEALTH_INVENTORY
  ]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(INITIAL_AMBULANCES);
  const [ledgerEvents, setLedgerEvents] = useState<AuditLedgerEvent[]>(INITIAL_LEDGER_EVENTS);
  const [teleManasCalls, setTeleManasCalls] = useState(INITIAL_TELEMANAS_CALLS);
  const [mentalHealthBeds, setMentalHealthBeds] = useState(INITIAL_MENTAL_HEALTH_BEDS);
  const [psychotropicInventory, setPsychotropicInventory] = useState(INITIAL_MENTAL_HEALTH_INVENTORY);
  const [activeReferrals, setActiveReferrals] = useState<ReferralPatient[]>([
    {
      id: 'ref_init_01',
      patientRef: 'SS-PAT-2026-9041',
      name: 'Rameshwar Gaikwad',
      age: 58,
      gender: 'MALE',
      urgency: 'CODE_RED',
      clinicalSummary: 'Severe Acute ARDS with acute hypoxemic failure (SpO2 78%). Transport ventilator required.',
      primaryCondition: 'Acute ARDS with Respiratory Failure',
      requiredSpecialty: 'Pulmonology & Critical Care',
      requiredEquipment: ['ICU Bed', 'Transport Ventilator', 'High-Flow Oxygen'],
      referringDoctorId: 'usr_doc_9824',
      referringDoctorName: 'Dr. Sunita Rao',
      originFacilityId: 'fac_phc_a',
      originFacilityName: 'PHC-A Ramnagar',
      destinationFacilityId: 'fac_hosp_b',
      destinationFacilityName: 'Hospital B - Civil Multi-Specialty Hospital',
      bedHoldStatus: 'SOFT_HOLD',
      holdExpiresAt: '12:45 IST (15m countdown)',
      assignedAmbulanceId: 'MH-12-EMS-1081',
      ambulanceEtaMinutes: 12,
      status: 'HELD',
      createdAt: '12:30:15 IST',
    }
  ]);

  // Crypto agility & XAI inspection
  const [cryptoProvider, setCryptoProvider] = useState<CryptoProvider>('PQC_ML_KEM_DSA');
  const [activeExplanation, setActiveExplanation] = useState<ExplanationPacket | null>(null);

  // Guided scenario walkthrough modals
  const [scenario1Open, setScenario1Open] = useState(false);
  const [scenario2Open, setScenario2Open] = useState(false);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper to append tamper-evident ledger event
  const appendLedgerEvent = (
    eventType: AuditLedgerEvent['eventType'],
    summary: string,
    facilityName: string
  ) => {
    const prevBlock = ledgerEvents[ledgerEvents.length - 1];
    const prevHash = prevBlock ? prevBlock.eventHash : '0000000000000000000000000000000000000000000000000000000000000000';
    const rawPayload = `${eventType}|${userContext.name}|${facilityName}|${Date.now()}|${summary}`;
    const eventHash = generateSha256(rawPayload + prevHash);
    const pqcSignature = generateCryptoSignature(rawPayload, cryptoProvider);

    const newEvent: AuditLedgerEvent = {
      eventId: `evt_${Date.now()}`,
      blockHeight: (prevBlock ? prevBlock.blockHeight : 14200) + 1,
      eventType,
      actor: userContext.name,
      actorRole: userContext.role,
      facility: facilityName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      traceId: `tr_${Date.now().toString(16)}`,
      payloadSummary: summary,
      cryptoAlgorithm: cryptoProvider === 'PQC_ML_KEM_DSA' ? 'ML-DSA-65 (NIST FIPS 204)' : cryptoProvider,
      eventHash,
      previousHash: prevHash,
      pqcSignature,
      verified: true,
    };

    setLedgerEvents(prev => [...prev, newEvent]);
  };

  // Action: Approve Redistribution Transfer with PQC Signature
  const handleApproveTransfer = (transfer: RedistributionTransfer) => {
    // If offline, queue locally
    if (networkStatus === 'OFFLINE') {
      const queueItem: OfflineQueueItem = {
        id: `queue_${Date.now()}`,
        type: 'STOCK_RECEIVED',
        facilityId: transfer.toFacilityId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        payload: transfer,
        status: 'PENDING_SYNC',
      };
      setOfflineQueue(prev => [...prev, queueItem]);
      showToast(`PHC Offline: Transfer queued in local SQLite outbox (${offlineQueue.length + 1} pending).`);
      return;
    }

    // Update inventories: Target receives, donor stock reserved/reduced
    setInventories(prev => prev.map(inv => {
      if (inv.facilityId === transfer.toFacilityId && inv.medicineCode === transfer.medicineCode) {
        const newStock = inv.currentStock + transfer.allocatedQuantity;
        const newEffective = newStock + inv.incomingStock - inv.reservedStock;
        const newDos = Number((newStock / inv.forecastDailyDemand).toFixed(2));
        return {
          ...inv,
          currentStock: newStock,
          effectiveStock: newEffective,
          daysOfSupply: newDos,
          projectedDeficit7d: 0,
          replenishmentGap: Number((inv.leadTimeDays - newDos).toFixed(2)),
          resilienceStatus: 'STABLE',
          lastUpdated: 'Just now',
        };
      }
      if (inv.facilityId === transfer.fromFacilityId && inv.medicineCode === transfer.medicineCode) {
        const newStock = inv.currentStock - transfer.allocatedQuantity;
        const newEffective = newStock + inv.incomingStock - inv.reservedStock;
        const newDos = Number((newStock / inv.forecastDailyDemand).toFixed(2));
        return {
          ...inv,
          currentStock: newStock,
          effectiveStock: newEffective,
          daysOfSupply: newDos,
          lastUpdated: 'Just now',
        };
      }
      return inv;
    }));

    // Record ledger event
    appendLedgerEvent(
      'TRANSFER_APPROVED',
      `Transferred ${transfer.allocatedQuantity} units of ${transfer.medicineName} from ${transfer.fromFacilityName} to ${transfer.toFacilityName}. ML-DSA signature verified.`,
      transfer.toFacilityName
    );

    setActiveLoopStep(9); // Approve -> Transfer
    showToast(`Transfer approved with ML-DSA-65! ${transfer.allocatedQuantity} units en route.`);
  };

  // Action: Create Referral with Bed Soft Hold
  const handleCreateReferral = (newRef: ReferralPatient) => {
    setActiveReferrals(prev => [newRef, ...prev]);

    // Update hospital bed capacity
    setFacilities(prev => prev.map(f => {
      if (f.id === newRef.destinationFacilityId) {
        return {
          ...f,
          capacity: {
            ...f.capacity,
            icuReady: Math.max(0, f.capacity.icuReady - 1),
            reserved: f.capacity.reserved + 1,
          }
        };
      }
      return f;
    }));

    // Dispatch ambulance
    setAmbulances(prev => prev.map((amb, i) => {
      if (i === 0) {
        return {
          ...amb,
          status: 'DISPATCHED',
          assignedReferralId: newRef.id,
          etaMinutes: newRef.ambulanceEtaMinutes || 12,
        };
      }
      return amb;
    }));

    appendLedgerEvent(
      'BED_HELD',
      `Digital bed hold initiated for ${newRef.name} (${newRef.patientRef}) at ${newRef.destinationFacilityName}. 15-min soft lock active.`,
      newRef.destinationFacilityName || 'Hospital B'
    );

    setActiveLoopStep(7); // Reserve
    setCurrentTab('referral-care');
    showToast(`Bed Soft Hold active for ${newRef.name}. ALS Ambulance MH-12-EMS-1081 dispatched!`);
  };

  // Action: Update referral status (Doctor accept or atomic admit)
  const handleUpdateReferralStatus = (refId: string, status: ReferralPatient['status'], bedState: BedState) => {
    setActiveReferrals(prev => prev.map(r => {
      if (r.id === refId) {
        return {
          ...r,
          status,
          bedHoldStatus: bedState,
        };
      }
      return r;
    }));

    const targetRef = activeReferrals.find(r => r.id === refId);
    if (bedState === 'OCCUPIED' && targetRef) {
      setFacilities(prev => prev.map(f => {
        if (f.id === targetRef.destinationFacilityId) {
          return {
            ...f,
            capacity: {
              ...f.capacity,
              occupied: f.capacity.occupied + 1,
              reserved: Math.max(0, f.capacity.reserved - 1),
              icuOccupied: f.capacity.icuOccupied + 1,
            }
          };
        }
        return f;
      }));

      appendLedgerEvent(
        'ADMISSION_COMPLETED',
        `Patient ${targetRef.name} arrived at ${targetRef.destinationFacilityName}. ICU bed status transitioned to OCCUPIED. Handover complete.`,
        targetRef.destinationFacilityName || 'Hospital B'
      );

      setActiveLoopStep(10); // Admit
      showToast(`Patient ${targetRef.name} admitted to ICU Bed. State is now OCCUPIED.`);
    } else if (status === 'ACCEPTED' && targetRef) {
      appendLedgerEvent(
        'BED_RESERVED',
        `Hospital B receiving physician confirmed acceptance for ${targetRef.name}. Bed hold upgraded to RESERVED.`,
        targetRef.destinationFacilityName || 'Hospital B'
      );
      showToast('Referral accepted by receiving physician.');
    }
  };

  // Action: Simulate ambulance movement
  const handleSimulateAmbulanceProgress = (ambId: string) => {
    setAmbulances(prev => prev.map(a => {
      if (a.id === ambId) {
        const newEta = Math.max(0, a.etaMinutes - 3);
        return {
          ...a,
          etaMinutes: newEta,
          status: newEta === 0 ? 'ON_SCENE' : 'TRANSPORTING',
          currentLat: a.currentLat + 0.002,
          currentLng: a.currentLng + 0.002,
        };
      }
      return a;
    }));
    showToast('GPS Telemetry updated: ALS Ambulance advanced along transit corridor.');
  };

  // Action: Trigger offline sync gateway
  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setOfflineQueue([]);
      setIsSyncModalOpen(false);
      appendLedgerEvent(
        'STOCK_UPDATED',
        'PHC-A offline outbox synchronized with District Mesh Gateway. All cryptographic trace IDs reconciled.',
        'PHC-A Ramnagar'
      );
      showToast('Sync Gateway complete: All queued events integrated into District Ledger.');
    }, 800);
  };

  // Mental Health & Tele-MANAS Call updates
  const handleUpdateTeleManasCall = (callId: string, updates: Partial<typeof teleManasCalls[0]>) => {
    setTeleManasCalls(prev => prev.map(c => c.callId === callId ? { ...c, ...updates } : c));
    appendLedgerEvent(
      'CARE_MATCHED',
      `Tele-MANAS Call ${callId} updated. Status: ${updates.status || 'Updated'}. Protocol logged.`,
      'Tele-MANAS District Hub 14416'
    );
    showToast(`Tele-MANAS 14416: Call ${callId} updated.`);
  };

  // Psychiatric Bed State Transition
  const handleUpdateBedState = (bedId: string, newState: BedState, patientName?: string) => {
    setMentalHealthBeds(prev => prev.map(b => b.id === bedId ? { ...b, state: newState, patientName } : b));
    appendLedgerEvent(
      newState === 'OCCUPIED' ? 'BED_HELD' : 'BED_RESERVED',
      `Psychiatric Bed ${bedId} updated to ${newState}${patientName ? ` for ${patientName}` : ''}.`,
      'Hospital B Calm Room & Psych Unit'
    );
    showToast(`Psychiatric Bed ${bedId} transitioned to ${newState}.`);
  };

  // Guided Scenario Step Appliers
  const handleApplyScenario1Step = (stepNumber: number) => {
    if (stepNumber <= 4) {
      setCurrentTab('supply-forecast');
      setActiveLoopStep(3); // Predict
    } else if (stepNumber <= 8) {
      setCurrentTab('supply-forecast');
      setActiveLoopStep(6); // Optimize
    } else if (stepNumber <= 11) {
      setCurrentTab('pqc-ledger');
      setActiveLoopStep(8); // Approve
    } else {
      setCurrentTab('supply-forecast');
      setActiveLoopStep(13); // Learn / Complete
    }
  };

  const handleApplyScenario2Step = (stepNumber: number) => {
    if (stepNumber <= 6) {
      setCurrentTab('referral-care');
      setActiveLoopStep(5); // Match
    } else if (stepNumber <= 10) {
      setCurrentTab('ambulance-fleet');
      setActiveLoopStep(9); // Transfer
    } else {
      setCurrentTab('pqc-ledger');
      setActiveLoopStep(10); // Admit & Audit
    }
  };

  // Reset Demo State
  const handleResetDemo = () => {
    setFacilities(INITIAL_FACILITIES);
    setInventories(INITIAL_INVENTORY);
    setAmbulances(INITIAL_AMBULANCES);
    setLedgerEvents(INITIAL_LEDGER_EVENTS);
    setActiveLoopStep(1);
    setCurrentTab('live-state');
    showToast('All operational state reset to initial conditions.');
  };

  return (
    <div className="min-h-screen bg-[#FAFCFA] text-slate-800 flex flex-col font-sans">
      
      {/* Toast Notification (Soothing light card) */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-white/95 backdrop-blur-md text-emerald-950 px-4 py-3 rounded-2xl shadow-xl text-xs flex items-center gap-2.5 border border-emerald-200/90 animate-in slide-in-from-bottom-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Bar (3-Zone Contract, Single Wordmark, Context-Aware) */}
      <TopBar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userContext={userContext}
        setUserContext={setUserContext}
        networkStatus={networkStatus}
        setNetworkStatus={setNetworkStatus}
        pendingSyncCount={offlineQueue.length}
        openSyncModal={() => setIsSyncModalOpen(true)}
        onLaunchScenario1={() => setScenario1Open(true)}
        onLaunchScenario2={() => setScenario2Open(true)}
        onResetDemo={handleResetDemo}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
      />

      {/* Master Operating Loop Visual Ribbon */}
      <MasterLoopBar
        activeStepIndex={activeLoopStep}
        onSelectStep={(idx) => {
          setActiveLoopStep(idx);
          if (idx <= 2) setCurrentTab('live-state');
          else if (idx === 3 || idx === 6) setCurrentTab('supply-forecast');
          else if (idx === 4 || idx === 13) setCurrentTab('gemini-xai');
          else if (idx === 5 || idx === 7 || idx === 10) setCurrentTab('referral-care');
          else if (idx === 9) setCurrentTab('ambulance-fleet');
          else if (idx === 8 || idx === 11 || idx === 12) setCurrentTab('pqc-ledger');
        }}
      />

      {/* Main Viewport Workspace Container with Adaptive / Flutter Device Mode */}
      <div className={`flex-1 w-full transition-all ${deviceMode !== 'fluid' ? 'bg-[#F2F7F4]/70 py-2 sm:py-4' : ''}`}>
        <main className={`w-full transition-all pb-24 md:pb-8 ${
          deviceMode === 'mobile'
            ? 'max-w-[400px] mx-auto border-x border-emerald-100 shadow-xl bg-white min-h-[calc(100vh-140px)] px-3 py-4'
            : deviceMode === 'tablet'
            ? 'max-w-[768px] mx-auto border-x border-emerald-100 shadow-md bg-white min-h-[calc(100vh-140px)] px-4 py-5'
            : deviceMode === 'desktop'
            ? 'max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6'
            : 'max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6'
        }`}>
          {currentTab === 'live-state' && (
            <LiveStateView
              facilities={facilities}
              onSelectFacilityForReferral={(fac) => {
                setCurrentTab('referral-care');
              }}
              onSelectFacilityForStock={(fac) => {
                setCurrentTab('supply-forecast');
              }}
            />
          )}

          {currentTab === 'supply-forecast' && (
            <SupplyForecastView
              inventories={inventories}
              facilities={facilities}
              onApproveTransfer={handleApproveTransfer}
              onOpenXAiExplanation={(inv) => {
                setActiveExplanation(generateShortageExplanation(inv));
                setCurrentTab('gemini-xai');
              }}
              selectedFacilityId={userContext.facilityId}
            />
          )}

          {currentTab === 'referral-care' && (
            <ReferralCareMatchView
              facilities={facilities}
              userContext={userContext}
              ambulances={ambulances}
              activeReferrals={activeReferrals}
              onCreateReferral={handleCreateReferral}
              onUpdateReferralStatus={handleUpdateReferralStatus}
            />
          )}

          {currentTab === 'mental-health' && (
            <MentalHealthResilienceView
              userContext={userContext}
              facilities={facilities}
              teleManasCalls={teleManasCalls}
              onUpdateTeleManasCall={handleUpdateTeleManasCall}
              mentalHealthBeds={mentalHealthBeds}
              onUpdateBedState={handleUpdateBedState}
              psychotropicInventory={psychotropicInventory}
              onInitiateTransfer={(inv) => {
                setCurrentTab('supply-forecast');
                showToast(`Reviewing redistribution for ${inv.medicineName}`);
              }}
              onReferToBed={(bed) => {
                setCurrentTab('referral-care');
                showToast(`Care Match initiated for ${bed.bedNumber}`);
              }}
            />
          )}

          {currentTab === 'ambulance-fleet' && (
            <AmbulanceFleetView
              ambulances={ambulances}
              activeReferrals={activeReferrals}
              onSimulateProgress={handleSimulateAmbulanceProgress}
            />
          )}

          {currentTab === 'gemini-xai' && (
            <GeminiOrchestratorView
              userContext={userContext}
              inventories={inventories}
              facilities={facilities}
              activeExplanation={activeExplanation}
            />
          )}

          {currentTab === 'pqc-ledger' && (
            <PqcAuditLedgerView
              ledgerEvents={ledgerEvents}
              cryptoProvider={cryptoProvider}
              setCryptoProvider={setCryptoProvider}
              onVerifyLedger={() => {}}
            />
          )}
        </main>
      </div>

      {/* Flutter Floating Action Button (Speed Dial) */}
      <FlutterFab
        onLaunchScenario1={() => setScenario1Open(true)}
        onLaunchScenario2={() => setScenario2Open(true)}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onOpenGemini={() => setCurrentTab('gemini-xai')}
        onOpenMentalHealth={() => setCurrentTab('mental-health')}
        pendingSyncCount={offlineQueue.length}
      />

      {/* Flutter Bottom Navigation Bar for Mobile / Touch View */}
      <FlutterBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        pendingSyncCount={offlineQueue.length}
      />

      {/* Footer: Quiet attribution and cryptographic status */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Google SwasthyaSetu Global</span>
            <span>·</span>
            <span>Federated Healthcare Coordination Protocol</span>
            <span>·</span>
            <span>NIST FIPS 203/204 Post-Quantum Cryptography</span>
          </div>

          <div className="flex items-center gap-3">
            <span>District: <strong>{userContext.district}</strong></span>
            <span>·</span>
            <span>Active Session: <strong className="font-mono">{userContext.sessionId}</strong></span>
          </div>
        </div>
      </footer>

      {/* Offline Sync Gateway Modal */}
      <OfflineSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        queue={offlineQueue}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
        networkStatus={networkStatus}
        setNetworkStatus={setNetworkStatus}
      />

      {/* Guided Test Scenarios Modals */}
      <ScenarioModals
        scenario1Open={scenario1Open}
        onCloseScenario1={() => setScenario1Open(false)}
        onApplyScenario1Step={handleApplyScenario1Step}
        scenario2Open={scenario2Open}
        onCloseScenario2={() => setScenario2Open(false)}
        onApplyScenario2Step={handleApplyScenario2Step}
      />

    </div>
  );
}
