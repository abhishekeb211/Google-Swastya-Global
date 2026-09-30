import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table authenticated via Firebase Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role'),
  facilityId: text('facility_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// System Performance Metrics table: records execution latency, PQC signature speed, throughput
export const systemPerformanceMetrics = pgTable('system_performance_metrics', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').defaultNow(),
  scenarioType: text('scenario_type').notNull(), // EMERGENCY_CRITICAL_TRAUMA, NORMAL_TEST, MASS_CASUALTY, STOCKOUT_SURGE
  caseUrgency: text('case_urgency').notNull(), // CODE_RED, CODE_YELLOW, CODE_GREEN
  latencyMs: integer('latency_ms').notNull(), // Dispatch / matching latency
  bedHoldLatencyMs: integer('bed_hold_latency_ms'), // Atomic reservation lock time
  pqcSignLatencyMs: integer('pqc_sign_latency_ms'), // Post-quantum signature verification time
  pqcAlgorithm: text('pqc_algorithm').default('ML-DSA-65'),
  throughputQps: integer('throughput_qps').default(120),
  status: text('status').notNull(), // OPTIMAL, HEALED, RESOLVED, CONGESTED
  details: text('details'), // JSON string with system diagnostics
});

// Synthetic Scenarios & Custom Data Generation table
export const syntheticScenarios = pgTable('synthetic_scenarios', {
  id: serial('id').primaryKey(),
  scenarioId: text('scenario_id').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(), // EMERGENCY_CRITICAL, NORMAL_TEST, RESILIENCE_SWEEP
  patientCount: integer('patient_count').notNull(),
  criticalCount: integer('critical_count').notNull(),
  simulatedDurationSec: integer('simulated_duration_sec').notNull(),
  resourceAllocated: text('resource_allocated'), // JSON summary of beds & medicines allocated
  outcomes: text('outcomes'), // JSON summary of survival rate & turnaround
  createdAt: timestamp('created_at').defaultNow(),
});

// System Audit Logs: Full tamper-evident audit record of every state action
export const systemAuditLogs = pgTable('system_audit_logs', {
  id: serial('id').primaryKey(),
  logId: text('log_id').notNull().unique(),
  timestamp: timestamp('timestamp').defaultNow(),
  actionType: text('action_type').notNull(), // BED_HELD, STOCK_DISPATCHED, AGENT_HEAL, EMERGENCY_DISPATCH
  actor: text('actor').notNull(),
  facility: text('facility'),
  severity: text('severity').notNull(), // CRITICAL, WARNING, INFO
  blockHeight: integer('block_height'),
  eventHash: text('event_hash'),
  pqcSignature: text('pqc_signature'),
  actionSummary: text('action_summary').notNull(),
  performanceDelta: text('performance_delta'), // Latency impact
  metadata: text('metadata'), // JSON data payload
});
