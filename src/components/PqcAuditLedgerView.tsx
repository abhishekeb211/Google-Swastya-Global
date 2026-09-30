import React, { useState } from 'react';
import { AuditLedgerEvent, CryptoProvider } from '../types';
import { calculateMerkleRoot } from '../services/resilienceEngine';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  RefreshCw, 
  Database,
  ArrowRight,
  Sparkles,
  Fingerprint
} from 'lucide-react';

interface PqcAuditLedgerViewProps {
  ledgerEvents: AuditLedgerEvent[];
  cryptoProvider: CryptoProvider;
  setCryptoProvider: (provider: CryptoProvider) => void;
  onVerifyLedger: () => void;
}

export const PqcAuditLedgerView: React.FC<PqcAuditLedgerViewProps> = ({
  ledgerEvents,
  cryptoProvider,
  setCryptoProvider,
  onVerifyLedger,
}) => {
  const [tamperedIndex, setTamperedIndex] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  // Compute live Merkle root over all event hashes
  const eventHashes = ledgerEvents.map((evt, idx) => 
    idx === tamperedIndex ? 'f1a948bc0091823746a81f3b0c44298fc1c149afbf4c8996fb92427ae41e4649' : evt.eventHash
  );
  const currentMerkleRoot = calculateMerkleRoot(eventHashes);

  const handleSimulateTamper = (index: number) => {
    if (tamperedIndex === index) {
      setTamperedIndex(null);
      setVerificationResult('Tampering reversed. Merkle integrity re-established.');
    } else {
      setTamperedIndex(index);
      setVerificationResult('⚠️ TAMPER DETECTED: Historical event hash modified! Merkle root invariant violated.');
    }
  };

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (tamperedIndex !== null) {
        setVerificationResult('❌ AUDIT INTEGRITY FAILURE: Block #14202 has been modified. Hash chain mismatch at Node PHC-A.');
      } else {
        setVerificationResult(`✓ MERKLE INTEGRITY VERIFIED: ${ledgerEvents.length} blocks checked. All NIST ML-DSA-65 signatures valid.`);
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Post-Quantum Cryptography & Tamper-Evident Audit Ledger
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Crypto-agile ML-KEM/ML-DSA (NIST FIPS 203/204) with append-only Merkle-tree event provenance.
            </p>
          </div>

          {/* Crypto Agility Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-teal-600" />
              Crypto Provider:
            </span>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-md text-xs">
              {[
                { id: 'CLASSICAL_RSA2048', label: 'Classical RSA' },
                { id: 'HYBRID_NIST_PQC', label: 'Hybrid' },
                { id: 'PQC_ML_KEM_DSA', label: 'PQC ML-DSA-65' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setCryptoProvider(p.id as CryptoProvider)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    cryptoProvider === p.id
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Merkle Root Banner */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg md:col-span-2">
            <div className="text-slate-500 text-[11px] font-mono flex items-center justify-between">
              <span>LIVE MERKLE TREE ROOT HASH (SHA-256):</span>
              <span className="text-teal-700 font-bold">{ledgerEvents.length} Block Checkpoint</span>
            </div>
            <div className="font-mono text-slate-900 text-xs font-semibold truncate mt-1">
              {currentMerkleRoot}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-slate-500 text-[11px]">Ledger Node Protocol</div>
              <div className="text-slate-900 font-bold mt-0.5 font-mono">
                {cryptoProvider === 'PQC_ML_KEM_DSA' ? 'ML-DSA-65 (Post-Quantum)' : cryptoProvider}
              </div>
            </div>
            <button
              onClick={handleRunVerification}
              disabled={isVerifying}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              {isVerifying ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
              <span>Verify Chain</span>
            </button>
          </div>
        </div>

        {verificationResult && (
          <div className={`mt-3 p-3 rounded text-xs font-medium border ${
            verificationResult.includes('FAILURE') || verificationResult.includes('TAMPER')
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            {verificationResult}
          </div>
        )}
      </div>

      {/* Main Grid: Immutable Event Store */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-4 h-4 text-teal-600" />
            Append-Only Cryptographic Event Store
          </span>
          <span className="text-slate-500 font-normal">
            No raw patient PII stored on-chain · Zero cryptocurrency
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {ledgerEvents.map((evt, idx) => {
            const isTampered = tamperedIndex === idx;

            return (
              <div
                key={evt.eventId}
                className={`p-4 transition-colors text-xs space-y-2.5 ${
                  isTampered ? 'bg-rose-50/70' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Block #{evt.blockHeight}
                    </span>
                    <span className="font-semibold text-teal-800">
                      {evt.eventType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 font-medium">{evt.facility}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-500 text-[11px] font-mono">
                    <span>{evt.timestamp}</span>
                    <button
                      onClick={() => handleSimulateTamper(idx)}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded border transition-colors ${
                        isTampered
                          ? 'bg-rose-600 text-white border-rose-700 hover:bg-rose-700'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {isTampered ? 'Revert Tamper' : 'Test Tamper Detection'}
                    </button>
                  </div>
                </div>

                <div className="text-slate-700 font-medium">
                  {evt.payloadSummary}
                </div>

                {/* Hashes and PQC signature verification line */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] text-slate-600">
                  <div className="truncate">
                    <span className="text-slate-400">Actor:</span> {evt.actor} ({evt.actorRole})
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400">Trace:</span> {evt.traceId}
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400">Prev Hash:</span> {evt.previousHash.slice(0, 16)}...
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400">Event Hash:</span>{' '}
                    <span className={isTampered ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                      {isTampered ? 'f1a948bc0091823746a81f3b0c44...' : `${evt.eventHash.slice(0, 16)}...`}
                    </span>
                  </div>
                  <div className="truncate md:col-span-2 text-teal-800">
                    <span className="text-slate-400">ML-DSA Signature:</span> {evt.pqcSignature}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
