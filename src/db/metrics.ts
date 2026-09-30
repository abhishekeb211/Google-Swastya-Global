import { db } from './index.ts';
import { 
  systemPerformanceMetrics, 
  syntheticScenarios, 
  systemAuditLogs 
} from './schema.ts';
import { desc } from 'drizzle-orm';

// Record a new performance benchmark (emergency critical vs normal cases)
export async function recordPerformanceMetric(data: {
  scenarioType: string;
  caseUrgency: string;
  latencyMs: number;
  bedHoldLatencyMs?: number;
  pqcSignLatencyMs?: number;
  pqcAlgorithm?: string;
  throughputQps?: number;
  status: string;
  details?: string;
}) {
  try {
    const result = await db
      .insert(systemPerformanceMetrics)
      .values(data)
      .returning();
    return result[0];
  } catch (error) {
    console.error('Failed to record performance metric in Cloud SQL:', error);
    throw new Error('Database operation failed: recordPerformanceMetric', { cause: error });
  }
}

// Get recent performance metrics
export async function getRecentPerformanceMetrics(limit = 50) {
  try {
    return await db
      .select()
      .from(systemPerformanceMetrics)
      .orderBy(desc(systemPerformanceMetrics.timestamp))
      .limit(limit);
  } catch (error) {
    console.error('Failed to get performance metrics from Cloud SQL:', error);
    throw new Error('Database operation failed: getRecentPerformanceMetrics', { cause: error });
  }
}

// Record a synthetic scenario run (e.g. Mass Casualty, Stroke Protocol, Normal Test)
export async function recordSyntheticScenario(data: {
  scenarioId: string;
  title: string;
  category: string;
  patientCount: number;
  criticalCount: number;
  simulatedDurationSec: number;
  resourceAllocated?: string;
  outcomes?: string;
}) {
  try {
    const result = await db
      .insert(syntheticScenarios)
      .values(data)
      .returning();
    return result[0];
  } catch (error) {
    console.error('Failed to record synthetic scenario in Cloud SQL:', error);
    throw new Error('Database operation failed: recordSyntheticScenario', { cause: error });
  }
}

// Get all synthetic scenarios
export async function getSyntheticScenarios(limit = 30) {
  try {
    return await db
      .select()
      .from(syntheticScenarios)
      .orderBy(desc(syntheticScenarios.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('Failed to get synthetic scenarios from Cloud SQL:', error);
    throw new Error('Database operation failed: getSyntheticScenarios', { cause: error });
  }
}

// Record an immutable system audit log event
export async function recordSystemAuditLog(data: {
  logId: string;
  actionType: string;
  actor: string;
  facility?: string;
  severity: string;
  blockHeight?: number;
  eventHash?: string;
  pqcSignature?: string;
  actionSummary: string;
  performanceDelta?: string;
  metadata?: string;
}) {
  try {
    const result = await db
      .insert(systemAuditLogs)
      .values(data)
      .returning();
    return result[0];
  } catch (error) {
    console.error('Failed to record audit log in Cloud SQL:', error);
    throw new Error('Database operation failed: recordSystemAuditLog', { cause: error });
  }
}

// Get recent audit logs
export async function getSystemAuditLogs(limit = 100) {
  try {
    return await db
      .select()
      .from(systemAuditLogs)
      .orderBy(desc(systemAuditLogs.timestamp))
      .limit(limit);
  } catch (error) {
    console.error('Failed to get system audit logs from Cloud SQL:', error);
    throw new Error('Database operation failed: getSystemAuditLogs', { cause: error });
  }
}
