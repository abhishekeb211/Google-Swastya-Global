// SwasthyaSetu Resilience Grid 2.0 Types & Schemas

export type UserRole = 
  | 'PHC_HEALTH_WORKER' 
  | 'DOCTOR' 
  | 'PHARMACIST' 
  | 'BED_MANAGER' 
  | 'AMBULANCE_OPERATOR' 
  | 'DISTRICT_OFFICER' 
  | 'STATE_ADMIN';

export interface UserContext {
  userId: string;
  name: string;
  role: UserRole;
  professionalId: string;
  facilityId: string;
  facilityName: string;
  district: string;
  state: string;
  shift: string;
  permissions: string[];
  loginTime: string;
  sessionId: string;
  deviceId: string;
}

export type FreshnessStatus = 'LIVE' | 'CURRENT' | 'AGING' | 'STALE' | 'UNKNOWN';
export type DataQualityStatus = 'VALID' | 'VALID_WITH_WARNING' | 'STALE' | 'ANOMALOUS' | 'REJECTED';
export type FacilityType = 'PHC' | 'CHC' | 'DISTRICT_HOSPITAL' | 'SUB_DISTRICT_HOSPITAL' | 'WAREHOUSE';
export type CapabilityState = 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' | 'UNKNOWN';

export interface ServiceCapability {
  icu: CapabilityState;
  emergency: CapabilityState;
  surgery: CapabilityState;
  obstetrics: CapabilityState;
  laboratory: CapabilityState;
  radiology: CapabilityState;
  oxygenPlant: CapabilityState;
  specialistOnDuty: CapabilityState;
  specialistName?: string;
  specialtyType?: string;
}

export interface BedCapacity {
  functional: number;
  occupied: number;
  reserved: number;
  cleaning: number;
  ready: number;
  icuTotal: number;
  icuOccupied: number;
  icuReady: number;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  district: string;
  state: string;
  lat: number;
  lng: number;
  connectivity: 'ONLINE' | '2G_EDGE' | 'OFFLINE';
  lastSyncTime: string;
  freshness: FreshnessStatus;
  qualityStatus: DataQualityStatus;
  capacity: BedCapacity;
  services: ServiceCapability;
  contactNumber: string;
}

export type ResilienceStatus = 'STABLE' | 'WATCH' | 'AT_RISK' | 'CRITICAL';

export interface MedicineInventory {
  id: string;
  facilityId: string;
  facilityName: string;
  medicineCode: string;
  medicineName: string;
  category: string;
  unit: string;
  currentStock: number;
  reservedStock: number;
  incomingStock: number;
  forecastDailyDemand: number;
  expiryDate: string;
  leadTimeDays: number;
  // Computed resilience metrics
  effectiveStock: number;
  daysOfSupply: number;
  projectedDeficit7d: number;
  replenishmentGap: number;
  resilienceStatus: ResilienceStatus;
  lastUpdated: string;
}

export interface ForecastHorizon {
  horizon: '24h' | '7d' | '14d' | '30d';
  expectedDemand: number;
  confidenceLower: number;
  confidenceUpper: number;
  currentStock: number;
  incomingStock: number;
  projectedDeficit: number;
}

export interface XAiFactor {
  factor: string;
  impactPercentage: number;
  direction: 'UP' | 'DOWN';
  description: string;
}

export interface ExplanationPacket {
  recommendation: string;
  primaryReason: string;
  inputDataSummary: string;
  dataFreshness: FreshnessStatus;
  confidenceScore: number;
  shapFactors: XAiFactor[];
  alternativesConsidered: string[];
  modelVersion: string;
  policyVersion: string;
  generatedAt: string;
  pqcSignatureToken: string;
}

export interface RedistributionTransfer {
  id: string;
  fromFacilityId: string;
  fromFacilityName: string;
  toFacilityId: string;
  toFacilityName: string;
  medicineCode: string;
  medicineName: string;
  allocatedQuantity: number;
  donorInitialStock: number;
  donorSafetyReserve: number;
  donorTransferable: number;
  distanceKm: number;
  estimatedTransitHours: number;
  coldChainRequired: boolean;
  status: 'PROPOSED' | 'APPROVED' | 'IN_TRANSIT' | 'DELIVERED';
  approvedBy?: string;
  pqcApprovalSignature?: string;
}

export type BedState = 'OCCUPIED' | 'DISCHARGE_PENDING' | 'VACANT' | 'CLEANING' | 'READY' | 'SOFT_HOLD' | 'RESERVED';

export interface ReferralPatient {
  id: string;
  patientRef: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  urgency: 'CODE_RED' | 'CODE_YELLOW' | 'CODE_GREEN';
  clinicalSummary: string;
  primaryCondition: string;
  requiredSpecialty: string;
  requiredEquipment: string[];
  referringDoctorId: string;
  referringDoctorName: string;
  originFacilityId: string;
  originFacilityName: string;
  destinationFacilityId?: string;
  destinationFacilityName?: string;
  bedHoldStatus: BedState;
  holdExpiresAt?: string;
  assignedAmbulanceId?: string;
  ambulanceEtaMinutes?: number;
  status: 'DRAFT' | 'MATCHED' | 'HELD' | 'ACCEPTED' | 'IN_TRANSIT' | 'ADMITTED' | 'DECLINED';
  createdAt: string;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  type: 'ALS' | 'BLS' | 'PATIENT_TRANSPORT';
  equipment: string[];
  driverName: string;
  driverPhone: string;
  baseLocation: string;
  status: 'AVAILABLE' | 'DISPATCHED' | 'ON_SCENE' | 'TRANSPORTING' | 'MAINTENANCE';
  currentLat: number;
  currentLng: number;
  etaMinutes: number;
  assignedReferralId?: string;
}

export type CryptoProvider = 'CLASSICAL_RSA2048' | 'HYBRID_NIST_PQC' | 'PQC_ML_KEM_DSA';

export interface AuditLedgerEvent {
  eventId: string;
  blockHeight: number;
  eventType: 
    | 'STOCK_UPDATED' 
    | 'FORECAST_GENERATED' 
    | 'SHORTAGE_PREDICTED' 
    | 'TRANSFER_PROPOSED' 
    | 'TRANSFER_APPROVED' 
    | 'SHIPMENT_DISPATCHED' 
    | 'SHIPMENT_RECEIVED' 
    | 'REFERRAL_CREATED' 
    | 'CARE_MATCHED' 
    | 'BED_HELD' 
    | 'BED_RESERVED' 
    | 'AMBULANCE_ASSIGNED' 
    | 'PATIENT_DEPARTED' 
    | 'PATIENT_ARRIVED' 
    | 'ADMISSION_COMPLETED';
  actor: string;
  actorRole: UserRole;
  facility: string;
  timestamp: string;
  traceId: string;
  payloadSummary: string;
  cryptoAlgorithm: string;
  eventHash: string;
  previousHash: string;
  pqcSignature: string;
  verified: boolean;
}

export interface OfflineQueueItem {
  id: string;
  type: 'MEDICINE_ISSUED' | 'STOCK_RECEIVED' | 'REFERRAL_DRAFT' | 'BED_UPDATE';
  facilityId: string;
  timestamp: string;
  payload: any;
  status: 'PENDING_SYNC' | 'SYNCED' | 'CONFLICT_RESOLVED';
}
