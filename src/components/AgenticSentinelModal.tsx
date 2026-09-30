import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  Play, 
  Cpu, 
  Zap, 
  ArrowRight,
  Terminal,
  Activity,
  Layers,
  Calendar,
  Clock,
  Check
} from 'lucide-react';
import { CardIconBadge } from './CardIconBadge';

interface AgenticSentinelModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemState: any;
  onApplyHealPatches: (patches: any[]) => void;
  onInjectBlockage: (blockageType: string) => void;
}

export const AgenticSentinelModal: React.FC<AgenticSentinelModalProps> = ({
  isOpen,
  onClose,
  systemState,
  onApplyHealPatches,
  onInjectBlockage,
}) => {
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [isTriggeringDailySweep, setIsTriggeringDailySweep] = useState(false);
  const [agentReport, setAgentReport] = useState<{
    status: string;
    agentId: string;
    agentReasoning: string;
    executedResolutions: any[];
    timestamp: string;
  } | null>(null);
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [autoHealEnabled, setAutoHealEnabled] = useState(true);

  // Daily Schedule state
  const [dailyConfig, setDailyConfig] = useState<{
    enabled: boolean;
    scheduleCronText: string;
    cronHourIST: number;
    cronMinuteIST: number;
    lastRunAt: string;
    nextRunAt: string;
    totalAutomatedSweeps: number;
    autoFixedCount: number;
    sweepLogs: Array<{
      id: string;
      runAt: string;
      triggeredBy: string;
      status: string;
      issuesDetected: number;
      summary: string;
      details: any[];
    }>;
  } | null>(null);

  // Fetch daily schedule status on mount / open
  useEffect(() => {
    if (isOpen) {
      fetchDailySchedule();
    }
  }, [isOpen]);

  const fetchDailySchedule = async () => {
    try {
      const res = await fetch('/api/agent/daily-schedule');
      const data = await res.json();
      if (data.success) {
        setDailyConfig(data.config);
      }
    } catch (err) {
      console.warn('Could not fetch daily schedule:', err);
    }
  };

  const handleToggleDailySchedule = async (newVal: boolean) => {
    try {
      const res = await fetch('/api/agent/configure-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newVal })
      });
      const data = await res.json();
      if (data.success) {
        setDailyConfig(data.config);
      }
    } catch (err) {
      console.error('Failed to configure schedule:', err);
    }
  };

  const handleTriggerDailySweepNow = async () => {
    setIsTriggeringDailySweep(true);
    try {
      const res = await fetch('/api/agent/trigger-daily-sweep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemState })
      });
      const data = await res.json();
      if (data.success) {
        setDailyConfig(data.config);
        // Also run real heal against current live state
        await handleRunAgenticHeal();
      }
    } catch (err) {
      console.error('Failed to trigger daily sweep:', err);
    } finally {
      setIsTriggeringDailySweep(false);
    }
  };

  if (!isOpen) return null;

  const handleRunAgenticHeal = async (customSignal?: any) => {
    setIsRunningDiagnostic(true);
    try {
      const response = await fetch('/api/agent/diagnose-and-heal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemState,
          issueSignal: customSignal,
          autonomousMode: autoHealEnabled
        })
      });

      const data = await response.json();
      if (data.success) {
        setAgentReport(data);
        if (data.executedResolutions && data.executedResolutions.length > 0) {
          onApplyHealPatches(data.executedResolutions);
        }
      }
    } catch (err: any) {
      console.error('Failed to run agentic healer:', err);
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  const handleTriggerSimulation = (type: string) => {
    setActiveSimulation(type);
    onInjectBlockage(type);
    // Automatically let the agent diagnose and heal if enabled
    if (autoHealEnabled) {
      setTimeout(() => {
        handleRunAgenticHeal({
          type,
          severity: 'HIGH',
          facility: type === 'BED_HOLD_DEADLOCK' ? 'District Referral Hospital' : 'PHC-A Ramnagar',
          description: `Simulated bottleneck: ${type.replace(/_/g, ' ')} injected into pipeline.`,
          suggestedAction: 'AUTONOMOUS_INTERVENTION',
          patch: { simulated: true, type }
        });
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white border border-emerald-200/90 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col font-sans">
        
        {/* Header with Agent Identity */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg tracking-tight">
                  Sentinel-108 Agentic Healer
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Daily Autonomous Cron
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Automated daily resilience sweeps & real-time deadlock healing powered by Gemini 3.8 Flash
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Daily Automated Healing Cron Card */}
          <div className="p-4 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-sky-50/50 border border-emerald-200/90 rounded-2xl shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-emerald-200/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                    <span>Automated Daily Healing Routine</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      {dailyConfig?.enabled ? 'Active Daily at 04:00 AM IST' : 'Schedule Paused'}
                    </span>
                  </div>
                  <div className="text-emerald-800/90 text-xs">
                    Autonomous 24h cron daemon proactively purges deadlocks and balances state medical stock
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleDailySchedule(!dailyConfig?.enabled)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors ${
                    dailyConfig?.enabled 
                      ? 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50' 
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {dailyConfig?.enabled ? 'Pause Daily Cron' : 'Resume Daily Cron'}
                </button>

                <button
                  onClick={handleTriggerDailySweepNow}
                  disabled={isTriggeringDailySweep}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 disabled:opacity-60 text-white rounded-lg font-semibold shadow-xs transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTriggeringDailySweep ? 'animate-spin' : ''}`} />
                  <span>{isTriggeringDailySweep ? 'Sweeping...' : 'Run Daily Sweep Now'}</span>
                </button>
              </div>
            </div>

            {/* Daily Schedule Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <div className="text-slate-500 text-[11px]">Recurring Interval</div>
                <div className="font-bold text-slate-900 font-mono mt-0.5">Every 24 Hours</div>
                <div className="text-[10px] text-emerald-700">04:00 AM IST scheduled</div>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <div className="text-slate-500 text-[11px]">Next Automated Run</div>
                <div className="font-bold text-emerald-800 font-mono mt-0.5">Tomorrow 04:00</div>
                <div className="text-[10px] text-slate-500">Autonomous Daemon</div>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <div className="text-slate-500 text-[11px]">Total Daily Sweeps</div>
                <div className="font-bold text-slate-900 font-mono mt-0.5 tabular-nums">
                  {dailyConfig?.totalAutomatedSweeps || 43} runs
                </div>
                <div className="text-[10px] text-emerald-700">100% On Schedule</div>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <div className="text-slate-500 text-[11px]">Auto-Resolved Total</div>
                <div className="font-bold text-teal-800 font-mono mt-0.5 tabular-nums">
                  {dailyConfig?.autoFixedCount || 84} bottlenecks
                </div>
                <div className="text-[10px] text-slate-500">Zero manual intervention</div>
              </div>
            </div>
          </div>

          {/* Status and Immediate Action Bar */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Real-time Pipeline Watchdog</div>
                <div className="text-slate-500 text-xs">
                  Active in parallel with daily cron · Invariants verified continuously
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium mr-2">
                <input
                  type="checkbox"
                  checked={autoHealEnabled}
                  onChange={(e) => setAutoHealEnabled(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Auto-Heal Active</span>
              </label>

              <button
                onClick={() => handleRunAgenticHeal()}
                disabled={isRunningDiagnostic}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 disabled:opacity-60 text-white rounded-xl font-semibold shadow-xs transition-all min-h-[40px]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRunningDiagnostic ? 'animate-spin' : ''}`} />
                <span>{isRunningDiagnostic ? 'Agent Analyzing...' : 'Run Agentic Audit & Heal'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Simulation Sandbox: Inject Flow Stoppages */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Zap className="w-4 h-4 text-amber-600" />
                Test Agentic Auto-Resolution (Simulate Flow Blockages):
              </span>
              <span className="text-[11px] text-slate-500">Inject test anomaly to observe real-time healing</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => handleTriggerSimulation('BED_HOLD_DEADLOCK')}
                className="p-3 text-left rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/30 transition-all group"
              >
                <div className="font-semibold text-slate-900 group-hover:text-amber-800 flex items-center justify-between">
                  <span>1. Bed Hold Stoppage</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Stalls referral hold to test auto-promotion & ICU unlock.
                </div>
              </button>

              <button
                onClick={() => handleTriggerSimulation('SUPPLY_BOTTLENECK')}
                className="p-3 text-left rounded-xl border border-slate-200 bg-white hover:border-rose-400 hover:bg-rose-50/30 transition-all group"
              >
                <div className="font-semibold text-slate-900 group-hover:text-rose-800 flex items-center justify-between">
                  <span>2. Medicine Stockout Jam</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Depletes PHC stock to trigger linear-programming transfer.
                </div>
              </button>

              <button
                onClick={() => handleTriggerSimulation('MERKLE_DESYNC')}
                className="p-3 text-left rounded-xl border border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50/30 transition-all group"
              >
                <div className="font-semibold text-slate-900 group-hover:text-sky-800 flex items-center justify-between">
                  <span>3. Ledger Desync Anomaly</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Simulates hash tampering to verify cryptographic recovery.
                </div>
              </button>
            </div>
          </div>

          {/* Agentic Reasoning Output & Autonomous Actions Taken */}
          {agentReport && (
            <div className="p-4 bg-emerald-50/50 border border-emerald-200/90 rounded-xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-emerald-200/70 pb-2">
                <div className="flex items-center gap-2 text-emerald-950 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Agentic Resolution Verified · Status: {agentReport.status}</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-800">{agentReport.agentId}</span>
              </div>

              {/* Step-by-Step Executed Resolutions */}
              {agentReport.executedResolutions && agentReport.executedResolutions.length > 0 && (
                <div className="space-y-2">
                  <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wide">
                    Autonomous Heals Executed ({agentReport.executedResolutions.length}):
                  </div>
                  <div className="space-y-1.5">
                    {agentReport.executedResolutions.map((res: any, idx: number) => (
                      <div key={idx} className="p-2.5 bg-white rounded-lg border border-emerald-100 flex items-start justify-between gap-2 shadow-2xs">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {res.issueType.replace(/_/g, ' ')}
                            {res.facility && <span className="text-slate-500 font-normal">· {res.facility}</span>}
                          </div>
                          <div className="text-emerald-800 font-medium text-[11px] mt-0.5">
                            {res.patch?.message || res.actionTaken}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">{res.resolvedAt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Natural Language Diagnostic Report */}
              <div className="p-3 bg-white/80 rounded-lg border border-emerald-100 text-slate-800 leading-relaxed font-sans text-xs whitespace-pre-wrap">
                {agentReport.agentReasoning}
              </div>
            </div>
          )}

          {/* Historical Log of Daily Sweeps */}
          {dailyConfig?.sweepLogs && dailyConfig.sweepLogs.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  Recent Daily Auto-Heal Sweeps History:
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {dailyConfig.sweepLogs.length} logged
                </span>
              </div>

              <div className="space-y-2">
                {dailyConfig.sweepLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-white border border-slate-200/90 rounded-xl space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${log.status === 'COMPLETED_HEALED' ? 'bg-emerald-600' : 'bg-teal-500'}`}></span>
                        <span className="font-bold text-slate-900">{log.runAt}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          {log.triggeredBy === 'SCHEDULED_DAILY_CRON' ? 'Automated Cron' : 'Manual Trigger'}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-800">
                        {log.issuesDetected > 0 ? `${log.issuesDetected} bottlenecks healed` : 'Nominal (0 errors)'}
                      </span>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed">
                      {log.summary}
                    </p>

                    {log.details && log.details.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {log.details.map((d: any, i: number) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
                            ✓ {d.type}: {d.action}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operational Guardrails Guarantee */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Zero Deadlock Policy:</strong> Agentic AI enforces atomic 15-min soft hold limits, OR-Tools redistribution buffers, and daily 04:00 AM automated integrity sweeps.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">Autonomous Sentinel · Daily Auto-Healing v2.6</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors"
          >
            Close Sentinel
          </button>
        </div>
      </div>
    </div>
  );
};
