import React, { useState } from 'react';
import { OfflineQueueItem } from '../types';
import { 
  Wifi, 
  WifiOff, 
  RotateCw, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Database,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface OfflineSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  queue: OfflineQueueItem[];
  onTriggerSync: () => void;
  isSyncing: boolean;
  networkStatus: 'ONLINE' | '2G_EDGE' | 'OFFLINE';
  setNetworkStatus: (st: 'ONLINE' | '2G_EDGE' | 'OFFLINE') => void;
}

export const OfflineSyncModal: React.FC<OfflineSyncModalProps> = ({
  isOpen,
  onClose,
  queue,
  onTriggerSync,
  isSyncing,
  networkStatus,
  setNetworkStatus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                PHC Local Outbox & Sync Gateway
              </h3>
              <p className="text-xs text-slate-500">
                Section 35: Offline-First SQLite / IndexedDB Local Event Queue
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network Mode Switcher */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {networkStatus === 'OFFLINE' ? (
              <WifiOff className="w-4 h-4 text-rose-600" />
            ) : (
              <Wifi className="w-4 h-4 text-emerald-600" />
            )}
            <span className="font-semibold text-slate-800">
              Network Mesh Condition:
            </span>
          </div>

          <div className="flex gap-1">
            {(['ONLINE', '2G_EDGE', 'OFFLINE'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setNetworkStatus(mode)}
                className={`px-2.5 py-1 rounded font-medium text-xs transition-colors ${
                  networkStatus === mode
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'ONLINE' ? 'Broadband' : mode === '2G_EDGE' ? '2G / Edge' : 'Offline'}
              </button>
            ))}
          </div>
        </div>

        {/* Queued Items List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Pending Outbox Queue ({queue.length} events)</span>
            <span className="text-[11px] text-slate-400 font-mono">Store: local_sqlite_phc_a.db</span>
          </div>

          {queue.length === 0 ? (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs text-slate-500">
              All local records are synchronized with the district ledger mesh. Zero pending conflicts.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg max-h-56 overflow-y-auto">
              {queue.map((item) => (
                <div key={item.id} className="p-3 text-xs flex items-center justify-between bg-white hover:bg-slate-50">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {item.type.replace('_', ' ')}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      ID: {item.id} · Recorded {item.timestamp}
                    </div>
                  </div>

                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gateway Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            Idempotent reconciliation using cryptographic event traces.
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
            >
              Close
            </button>

            <button
              onClick={onTriggerSync}
              disabled={isSyncing || networkStatus === 'OFFLINE'}
              className="px-4 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSyncing ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synchronizing Mesh...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Execute Sync Gateway</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
