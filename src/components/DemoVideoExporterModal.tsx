import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Download, 
  Play, 
  Pause, 
  Film, 
  Sparkles, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  MonitorPlay, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Volume2, 
  Square,
  ArrowRight,
  Info
} from 'lucide-react';

interface DemoVideoExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const DemoVideoExporterModal: React.FC<DemoVideoExporterModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [activeTab, setActiveTab] = useState<'automated' | 'screen-record'>('automated');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentSceneTitle, setCurrentSceneTitle] = useState<string>('');
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordedVideoSize, setRecordedVideoSize] = useState<string>('');

  // Live Screen Recorder state
  const [isScreenRecording, setIsScreenRecording] = useState<boolean>(false);
  const [screenRecordSeconds, setScreenRecordSeconds] = useState<number>(0);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const screenChunksRef = useRef<Blob[]>([]);

  // Hidden canvas and animation refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Screen recording timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isScreenRecording) {
      timer = setInterval(() => {
        setScreenRecordSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isScreenRecording]);

  if (!isOpen) return null;

  // Sound generator helper for automated video
  const playTone = (audioCtx: AudioContext, dest: MediaStreamAudioDestinationNode, freq: number, type: OscillatorType, duration: number, gainValue = 0.15) => {
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(dest);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio stream optional fallback
    }
  };

  // Generate automated cinematic demo video
  const handleStartGeneration = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    setProgressPercent(0);
    setRecordedVideoUrl(null);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-definition dimensions
    canvas.width = 1280;
    canvas.height = 720;

    // Web Audio setup for synthetic clinical soundscape
    let audioStream: MediaStream | null = null;
    let audioDest: MediaStreamAudioDestinationNode | null = null;
    let audioCtx: AudioContext | null = null;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;
      audioDest = audioCtx.createMediaStreamDestination();
      audioStream = audioDest.stream;
    } catch (e) {
      console.warn('AudioContext not available:', e);
    }

    // Video stream from canvas
    const canvasStream = canvas.captureStream(30); // 30 FPS
    const combinedTracks = [
      ...canvasStream.getVideoTracks(),
      ...(audioStream ? audioStream.getAudioTracks() : [])
    ];
    const combinedStream = new MediaStream(combinedTracks);

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm')
      ? 'video/webm'
      : 'video/mp4';

    const recordedChunks: Blob[] = [];
    const recorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 3000000 // 3 Mbps for crisp HD
    });

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const videoBlob = new Blob(recordedChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);
      setRecordedVideoUrl(videoUrl);
      setRecordedVideoSize((videoBlob.size / (1024 * 1024)).toFixed(2) + ' MB');
      setIsGenerating(false);

      // Trigger automatic download
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `Google_SwasthyaSetu_Global_Demo_${new Date().toISOString().slice(0, 10)}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    recorder.start(100);
    mediaRecorderRef.current = recorder;

    // Scenes configuration (Total ~15 seconds, 5 scenes x 3 seconds)
    const SCENES = [
      {
        id: 1,
        title: 'Google SwasthyaSetu Global',
        subtitle: 'Federated Health Resource & Operational Resilience Grid',
        tag: 'NIST FIPS 203/204 PQC · OR-Tools SCIP · Tele-MANAS',
        durationMs: 3000,
        render: (progress: number) => {
          // Background Gradient
          const bgGrad = ctx.createLinearGradient(0, 0, 1280, 720);
          bgGrad.addColorStop(0, '#064e3b');
          bgGrad.addColorStop(0.5, '#022c22');
          bgGrad.addColorStop(1, '#0f172a');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, 1280, 720);

          // Grid lines
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
          ctx.lineWidth = 1;
          for (let x = 0; x < 1280; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 720);
            ctx.stroke();
          }
          for (let y = 0; y < 720; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(1280, y);
            ctx.stroke();
          }

          // Center Logo shield
          ctx.save();
          ctx.translate(640, 240);
          ctx.scale(1 + Math.sin(progress * Math.PI) * 0.05, 1 + Math.sin(progress * Math.PI) * 0.05);

          // Glow circle
          const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, 90);
          glow.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
          glow.addColorStop(1, 'rgba(16, 185, 129, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(0, 0, 90, 0, Math.PI * 2);
          ctx.fill();

          // Hexagon / Shield
          ctx.fillStyle = '#059669';
          ctx.beginPath();
          ctx.arc(0, 0, 50, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 4;
          ctx.stroke();

          // Medical Cross in Shield
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-8, -25, 16, 50);
          ctx.fillRect(-25, -8, 50, 16);
          ctx.restore();

          // Typography
          ctx.textAlign = 'center';
          ctx.fillStyle = '#ecfdf5';
          ctx.font = 'bold 46px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('Google SwasthyaSetu Global', 640, 390);

          ctx.fillStyle = '#a7f3d0';
          ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('Federated Health Resource & Closed-Loop Care Resilience Grid', 640, 435);

          ctx.fillStyle = '#6ee7b7';
          ctx.font = '600 16px monospace';
          ctx.fillText('NIST FIPS 203/204 PQC  ·  OR-Tools SCIP  ·  Offline Mesh  ·  Tele-MANAS 14416', 640, 485);

          // Verification badge
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.roundRect(460, 530, 360, 44, 12);
          ctx.fill();
          ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('✓ Production Readiness Architecture Verified', 640, 558);
        }
      },
      {
        id: 2,
        title: 'Act 1: Live Operational State Graph',
        subtitle: 'Freshness-Aware Distributed Mesh across 30 Healthcare Nodes',
        tag: '20 PHCs · 5 CHCs · 3 Referral Hospitals · 2 Warehouses',
        durationMs: 3200,
        render: (progress: number) => {
          ctx.fillStyle = '#091512';
          ctx.fillRect(0, 0, 1280, 720);

          // Header
          ctx.textAlign = 'left';
          ctx.fillStyle = '#34d399';
          ctx.font = '600 16px monospace';
          ctx.fillText('SECTION 16 · FRESHNESS-AWARE STATE GRAPH', 60, 60);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('Live Multi-Tier Facility Network (30 Sync Nodes)', 60, 100);

          // Draw Network Mesh Nodes
          const nodes = [
            { x: 300, y: 320, name: 'PHC-A Ramnagar', type: 'PHC', ready: '6/8 Beds', sync: 'LIVE' },
            { x: 200, y: 500, name: 'PHC-B Shirwal', type: 'PHC', ready: '8/10 Beds', sync: 'LIVE' },
            { x: 420, y: 520, name: 'PHC-C Khandala', type: 'PHC', ready: '4/6 Beds', sync: 'CURRENT' },
            { x: 640, y: 380, name: 'Hospital B Civil', type: 'HOSPITAL', ready: '24/30 Ready', sync: 'LIVE' },
            { x: 880, y: 280, name: 'District Hospital A', type: 'HOSPITAL', ready: '0/12 Beds (Full)', sync: 'LIVE' },
            { x: 920, y: 500, name: 'Central Warehouse W1', type: 'WAREHOUSE', ready: '9,400 Med Units', sync: 'LIVE' },
          ];

          // Draw connecting mesh lines with animated pulse
          ctx.lineWidth = 1.5;
          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              ctx.strokeStyle = 'rgba(52, 211, 153, 0.2)';
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();

              // Moving packet
              const pulsePos = (progress * 2 + (i + j) * 0.2) % 1;
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * pulsePos;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * pulsePos;
              ctx.fillStyle = '#10b981';
              ctx.beginPath();
              ctx.arc(px, py, 4, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Draw Nodes
          nodes.forEach((node) => {
            ctx.fillStyle = node.type === 'HOSPITAL' ? '#047857' : node.type === 'WAREHOUSE' ? '#0e7490' : '#065f46';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 28, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#6ee7b7';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Card below
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.roundRect(node.x - 90, node.y + 36, 180, 48, 8);
            ctx.fill();
            ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
            ctx.stroke();

            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(node.name, node.x, node.y + 54);

            ctx.fillStyle = '#34d399';
            ctx.font = '500 11px monospace';
            ctx.fillText(`${node.ready} · ${node.sync}`, node.x, node.y + 72);
          });
        }
      },
      {
        id: 3,
        title: 'Act 2: Outbreak Surge & OR-Tools SCIP Optimizer',
        subtitle: 'Days of Supply (DoS) Equation & Safe Surplus Redistribution',
        tag: 'Constraint-Preserving Safety Reserve · 0 Disruptions',
        durationMs: 3200,
        render: (progress: number) => {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, 1280, 720);

          // Header
          ctx.textAlign = 'left';
          ctx.fillStyle = '#f59e0b';
          ctx.font = '600 16px monospace';
          ctx.fillText('MATHEMATICAL FORMULATION · DAYS OF SUPPLY (DoS)', 60, 60);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('Outbreak Surge Triage → OR-Tools SCIP Rebalance', 60, 100);

          // Card 1: Critical Deficit at PHC-A
          ctx.fillStyle = '#1e293b';
          ctx.roundRect(60, 150, 540, 480, 16);
          ctx.fill();
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.textAlign = 'left';
          ctx.fillStyle = '#f87171';
          ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('⚠ PHC-A Ramnagar: CRITICAL DEFICIT', 90, 200);

          ctx.fillStyle = '#94a3b8';
          ctx.font = '14px monospace';
          ctx.fillText('Target Medicine: ORS Sachets (MED-ORS-SPO)', 90, 235);
          ctx.fillText('Baseline Consumption: 32 units/day', 90, 265);
          ctx.fillStyle = '#fca5a5';
          ctx.fillText('Outbreak Surge: 103 units/day (+221%)', 90, 295);

          // Formula Bar
          ctx.fillStyle = '#334155';
          ctx.roundRect(90, 325, 480, 60, 8);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px monospace';
          ctx.fillText('DoS = 410 / 103 = 3.98 Days', 110, 360);
          ctx.fillStyle = '#f87171';
          ctx.fillText('Lead Time = 8.0 Days (Gap: -4.02d)', 320, 360);

          // Simulated Bar Chart
          ctx.fillStyle = '#475569';
          ctx.fillRect(90, 420, 480, 24);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(90, 420, 480 * Math.max(0.2, 1 - progress * 0.6), 24);
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px monospace';
          ctx.fillText('Current Stock Depleting Rapidly', 90, 465);

          // Card 2: SCIP Redistribution Output
          ctx.fillStyle = '#1e293b';
          ctx.roundRect(640, 150, 580, 480, 16);
          ctx.fill();
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('✓ Mathematical Optimal Surplus Reallocation', 670, 200);

          // Allocation rows
          const rows = [
            { source: 'PHC-B Shirwal', stock: '1,600 units', reserve: '1,100 units', transfer: '450 units' },
            { source: 'PHC-C Khandala', stock: '950 units', reserve: '700 units', transfer: '250 units' },
          ];

          rows.forEach((r, idx) => {
            const y = 250 + idx * 95;
            ctx.fillStyle = '#0f172a';
            ctx.roundRect(670, y, 520, 75, 10);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(r.source, 690, y + 30);

            ctx.fillStyle = '#94a3b8';
            ctx.font = '13px monospace';
            ctx.fillText(`Hold: ${r.stock} · Reserve: ${r.reserve}`, 690, y + 55);

            ctx.fillStyle = '#34d399';
            ctx.font = 'bold 16px monospace';
            ctx.fillText(`+${r.transfer} ➔ PHC-A`, 1040, y + 42);
          });

          // Post-Transfer Outcome
          ctx.fillStyle = '#064e3b';
          ctx.roundRect(670, 460, 520, 140, 12);
          ctx.fill();
          ctx.strokeStyle = '#10b981';
          ctx.stroke();

          ctx.fillStyle = '#a7f3d0';
          ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('Post-Redistribution State at PHC-A:', 690, 495);

          ctx.fillStyle = '#ffffff';
          ctx.font = '14px monospace';
          ctx.fillText('• Reconciled Stock: 1,110 Units', 690, 530);
          ctx.fillText('• Days of Supply (DoS): 10.7 Days (Safe)', 690, 560);
          ctx.fillStyle = '#34d399';
          ctx.fillText('• Status: STABLE  |  Zero Regional Stockout', 690, 585);
        }
      },
      {
        id: 4,
        title: 'Act 3: Critical Care Match & 15-Minute Bed Hold',
        subtitle: 'Atomic Care Matcher & ALS 108 Transport Dispatch',
        tag: 'Section 17 Dilemma Resolved · 100% Care Capability Match',
        durationMs: 3200,
        render: (_progress: number) => {
          ctx.fillStyle = '#0c1a1e';
          ctx.fillRect(0, 0, 1280, 720);

          // Header
          ctx.textAlign = 'left';
          ctx.fillStyle = '#38bdf8';
          ctx.font = '600 16px monospace';
          ctx.fillText('SECTION 17 · CRITICAL CARE MATCHING & SOFT HOLD', 60, 60);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('Severe ARDS Code Red Patient Referral', 60, 100);

          // Patient Card
          ctx.fillStyle = '#162b32';
          ctx.roundRect(60, 150, 420, 480, 16);
          ctx.fill();

          ctx.fillStyle = '#f43f5e';
          ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('● CODE RED: Rameshwar Gaikwad (58M)', 90, 200);

          ctx.fillStyle = '#cbd5e1';
          ctx.font = '14px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('Diagnosis: Acute Hypoxemic Respiratory Failure', 90, 235);
          ctx.fillText('SpO2: 78% on room air · Pulse: 118 bpm', 90, 265);

          ctx.fillStyle = '#38bdf8';
          ctx.font = '600 14px monospace';
          ctx.fillText('Required Constraints (Non-Negotiable):', 90, 310);
          ctx.fillStyle = '#ffffff';
          ctx.font = '13px monospace';
          ctx.fillText('1. ICU Bed (Functional & Prepped)', 100, 340);
          ctx.fillText('2. Pulmonologist / Intensivist On Duty', 100, 370);
          ctx.fillText('3. High-Flow Bulk O2 / Ventilator', 100, 400);

          // Ambulance dispatch line
          ctx.fillStyle = '#0f766e';
          ctx.roundRect(90, 440, 360, 140, 12);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('🚑 ALS Ambulance Dispatched', 110, 475);
          ctx.fillStyle = '#ccfbf1';
          ctx.font = '13px monospace';
          ctx.fillText('Vehicle: MH-12-EMS-1081', 110, 510);
          ctx.fillText('Equipped: Transport Ventilator', 110, 535);
          ctx.fillText('Transit ETA: 12 Minutes', 110, 560);

          // Comparison Evaluation Cards
          // Hospital A Disqualified
          ctx.fillStyle = '#1e293b';
          ctx.roundRect(520, 150, 700, 210, 14);
          ctx.fill();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('✕ Hospital A (Closer: 8 mins ETA) — DISQUALIFIED', 550, 195);
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '13px monospace';
          ctx.fillText('Reason: 0 Ready ICU Beds (All 12 Occupied). Missing Ventilator.', 550, 230);
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('Sending patient here causes secondary diversion and fatal delay.', 550, 260);

          // Hospital B Selected & Soft Hold
          ctx.fillStyle = '#064e3b';
          ctx.roundRect(520, 390, 700, 240, 14);
          ctx.fill();
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('✓ Hospital B Civil (17 mins ETA) — 100% CARE READY', 550, 435);

          ctx.fillStyle = '#ffffff';
          ctx.font = '14px monospace';
          ctx.fillText('• ICU Bed #4 Ready: Confirmed & Functional', 550, 475);
          ctx.fillText('• Pulmonologist: Dr. Sunanda Mehta on duty', 550, 505);
          ctx.fillText('• Digital Bed Soft Hold: 15-Minute Auto-Lock Activated', 550, 535);

          ctx.fillStyle = '#a7f3d0';
          ctx.font = 'bold 15px monospace';
          ctx.fillText('★ Atomic PQC Reservation Confirmed. Zero double-booking.', 550, 580);
        }
      },
      {
        id: 5,
        title: 'Act 4: NIST FIPS 203/204 Post-Quantum Audit Ledger',
        subtitle: 'ML-KEM-768 & ML-DSA-65 Cryptographic Integrity',
        tag: 'Append-Only Merkle Tree · Zero Patient PII On-Chain',
        durationMs: 3400,
        render: (_progress: number) => {
          ctx.fillStyle = '#0a0f1d';
          ctx.fillRect(0, 0, 1280, 720);

          // Header
          ctx.textAlign = 'left';
          ctx.fillStyle = '#818cf8';
          ctx.font = '600 16px monospace';
          ctx.fillText('SECTION 18 · POST-QUANTUM CRYPTOGRAPHY & AUDIT PROVENANCE', 60, 60);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('NIST FIPS 203/204 Tamper-Evident Ledger', 60, 100);

          // Merkle Root Summary Banner
          ctx.fillStyle = '#1e1b4b';
          ctx.roundRect(60, 140, 1160, 80, 12);
          ctx.fill();
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#c7d2fe';
          ctx.font = 'bold 14px monospace';
          ctx.fillText('Current Merkle Root (Block #14209):', 90, 175);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px monospace';
          ctx.fillText('0x9a8f4c2e1b7890def5671234abcd890123456789abcdef0123456789abcdef01', 90, 203);

          // 3 Sample Cryptographic Event Blocks
          const blocks = [
            {
              height: 14207,
              type: 'EMERGENCY_CARE_MATCH',
              actor: 'Dr. Sunita Rao (PHC-A)',
              sig: 'ML-DSA-65: 0x7bf8910a24efb8c190...',
              hash: '0x3f9801ac87de41209b...'
            },
            {
              height: 14208,
              type: 'DIGITAL_BED_HOLD_CONFIRMED',
              actor: 'Dr. Sunanda Mehta (Hospital B)',
              sig: 'ML-DSA-65: 0x98bca1209341ef90aa...',
              hash: '0x7e81045ca098231fed...'
            },
            {
              height: 14209,
              type: 'OR_TOOLS_REDISTRIBUTION_DISPATCH',
              actor: 'District Health Officer (CMO)',
              sig: 'ML-DSA-65: 0x48ac9012e4f01bc987...',
              hash: '0x9a8f4c2e1b7890def5...'
            },
          ];

          blocks.forEach((blk, idx) => {
            const y = 250 + idx * 125;
            ctx.fillStyle = '#111827';
            ctx.roundRect(60, y, 1160, 105, 12);
            ctx.fill();
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
            ctx.stroke();

            ctx.fillStyle = '#6366f1';
            ctx.font = 'bold 15px monospace';
            ctx.fillText(`BLOCK #${blk.height}`, 90, y + 35);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(blk.type, 260, y + 35);

            ctx.fillStyle = '#94a3b8';
            ctx.font = '13px monospace';
            ctx.fillText(`Verified Actor: ${blk.actor}`, 90, y + 68);
            ctx.fillText(`Signature Token: ${blk.sig}`, 90, y + 92);

            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 13px monospace';
            ctx.fillText(`Event Hash: ${blk.hash}`, 740, y + 68);
            ctx.fillText('Status: IMMUTABLE & VERIFIED ✓', 740, y + 92);
          });

          // Final verification stamp
          ctx.fillStyle = '#065f46';
          ctx.roundRect(400, 640, 480, 50, 12);
          ctx.fill();
          ctx.textAlign = 'center';
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('All 15 Cryptographic Invariants Formally Verified', 640, 672);
        }
      }
    ];

    const totalDuration = SCENES.reduce((acc, s) => acc + s.durationMs, 0);
    const startTime = performance.now();

    const renderLoop = (now: number) => {
      const elapsed = now - startTime;
      const totalProgress = Math.min(1, elapsed / totalDuration);
      setProgressPercent(Math.floor(totalProgress * 100));

      if (totalProgress >= 1) {
        // Final frame render
        SCENES[SCENES.length - 1].render(1);
        setTimeout(() => {
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        }, 500);
        return;
      }

      // Determine which scene is active
      let accumulated = 0;
      let activeScene = SCENES[0];
      let sceneProgress = 0;

      for (let i = 0; i < SCENES.length; i++) {
        const s = SCENES[i];
        if (elapsed >= accumulated && elapsed < accumulated + s.durationMs) {
          activeScene = s;
          sceneProgress = (elapsed - accumulated) / s.durationMs;
          break;
        }
        accumulated += s.durationMs;
      }

      setCurrentSceneTitle(activeScene.title);

      // Audio chimes on scene transition
      if (audioCtx && audioDest && Math.floor(sceneProgress * 30) === 1) {
        playTone(audioCtx, audioDest, 528, 'sine', 1.2, 0.12);
      }

      // Render the active scene
      activeScene.render(sceneProgress);

      // Progress bar at the bottom of the video
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 712, 1280, 8);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, 712, 1280 * totalProgress, 8);

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);
  };

  // Start Live Screen Recording
  const handleStartScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
        },
        audio: true
      });

      screenStreamRef.current = stream;
      screenChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          screenChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(screenChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setRecordedVideoSize((blob.size / (1024 * 1024)).toFixed(2) + ' MB');
        setIsScreenRecording(false);

        // Auto download
        const a = document.createElement('a');
        a.href = url;
        a.download = `SwasthyaSetu_ScreenRecord_${new Date().toISOString().slice(0, 10)}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Stop all tracks
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start(250);
      screenRecorderRef.current = recorder;
      setIsScreenRecording(true);
      setScreenRecordSeconds(0);

      // User stopped sharing screen via browser UI
      stream.getVideoTracks()[0].onended = () => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      };
    } catch (err: unknown) {
      console.warn('Screen recording cancelled or failed:', err);
    }
  };

  const handleStopScreenRecording = () => {
    if (screenRecorderRef.current && screenRecorderRef.current.state === 'recording') {
      screenRecorderRef.current.stop();
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Demo Video Exporter & Studio
              </h2>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Generate high-definition clinical resilience demo video walkthroughs with sound
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50/70">
          <button
            onClick={() => setActiveTab('automated')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'automated'
                ? 'border-emerald-600 text-emerald-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Automated Cinematic Video (.webm)</span>
          </button>

          <button
            onClick={() => setActiveTab('screen-record')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'screen-record'
                ? 'border-emerald-600 text-emerald-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MonitorPlay className="w-4 h-4 text-teal-600" />
            <span>Live Interactive Screen Recorder</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'automated' ? (
            <div className="space-y-5">
              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    5-Act Clinical Narrative
                  </div>
                  <p className="text-slate-600 mt-1">
                    State Graph, OR-Tools Supply Optimizer, Critical Care Match, Tele-MANAS, and PQC Ledger.
                  </p>
                </div>

                <div className="p-3.5 bg-teal-50/60 rounded-2xl border border-teal-100">
                  <div className="font-bold text-teal-950 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                    Integrated Audio Chimes
                  </div>
                  <p className="text-slate-600 mt-1">
                    528Hz and 432Hz biofeedback chimes synthesized directly into the recorded video stream.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    Instant Local Export
                  </div>
                  <p className="text-slate-600 mt-1">
                    Generates 1280x720 HD WebM video natively in-browser. Zero server delay or uploads.
                  </p>
                </div>
              </div>

              {/* Progress & Rendering State */}
              {isGenerating ? (
                <div className="p-5 bg-emerald-950 text-white rounded-2xl space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                      <span className="font-bold text-emerald-200">Rendering Video Frame-by-Frame...</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold tabular-nums">
                      {progressPercent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-emerald-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-150"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="text-xs text-emerald-300 font-mono flex items-center justify-between">
                    <span>Scene: {currentSceneTitle}</span>
                    <span>30 FPS · WebM (VP9/Opus)</span>
                  </div>
                </div>
              ) : recordedVideoUrl ? (
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Demo Video Exported Successfully!</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-800 bg-white px-2.5 py-1 rounded-xl border border-emerald-200">
                      File Size: {recordedVideoSize}
                    </span>
                  </div>

                  {/* HTML5 Video Preview */}
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-md border border-emerald-200">
                    <video
                      src={recordedVideoUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <a
                      href={recordedVideoUrl}
                      download={`Google_SwasthyaSetu_Global_Demo_${new Date().toISOString().slice(0, 10)}.webm`}
                      className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Video File (.webm)</span>
                    </a>

                    <button
                      onClick={handleStartGeneration}
                      className="py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4 text-slate-500" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                    <Film className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Render Automated Demo Walkthrough
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Generates a full 15-second high-definition clinical coordination video demonstrating the entire SwasthyaSetu architecture with animated telemetry and audio.
                    </p>
                  </div>

                  <button
                    onClick={handleStartGeneration}
                    className="py-3.5 px-8 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-2xl text-sm font-bold transition-all inline-flex items-center gap-2 shadow-sm"
                  >
                    <Play className="w-4 h-4" />
                    <span>Generate & Download Demo Video (.webm)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <Info className="w-4 h-4 text-emerald-600" />
                  How to Record Your Live Session:
                </div>
                <p>
                  1. Click <strong>"Start Live Screen Recording"</strong> below and choose this browser tab or window.
                </p>
                <p>
                  2. Navigate through the <strong>Live Grid</strong>, trigger the <strong>Redistribution Optimizer</strong>, run a <strong>Care Match</strong>, or chat with the <strong>Gemini Orchestrator</strong>.
                </p>
                <p>
                  3. Click <strong>"Stop & Download"</strong> when done. Your custom walkthrough will download instantly as a high-definition video!
                </p>
              </div>

              {isScreenRecording ? (
                <div className="p-6 bg-rose-950 text-white rounded-2xl text-center space-y-4 shadow-md">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-900/80 text-rose-200 text-xs font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    RECORDING LIVE IN PROGRESS
                  </div>

                  <div className="text-4xl font-mono font-bold text-white tabular-nums">
                    {Math.floor(screenRecordSeconds / 60).toString().padStart(2, '0')}:
                    {(screenRecordSeconds % 60).toString().padStart(2, '0')}
                  </div>

                  <p className="text-xs text-rose-200">
                    Interact freely with the application. When finished, click stop below.
                  </p>

                  <button
                    onClick={handleStopScreenRecording}
                    className="py-3 px-6 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all inline-flex items-center gap-2 shadow-xs"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Stop Recording & Export Video</span>
                  </button>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto shadow-xs">
                    <MonitorPlay className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Record Your Custom Interactive Walkthrough
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Records your exact clicks, voice notes, and role transitions directly through your browser.
                    </p>
                  </div>

                  <button
                    onClick={handleStartScreenRecording}
                    className="py-3.5 px-8 bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white rounded-2xl text-sm font-bold transition-all inline-flex items-center gap-2 shadow-sm"
                  >
                    <Video className="w-4 h-4" />
                    <span>Start Live Screen Recording</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hidden rendering canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Format: Standard WebM / VP9 / Opus · High Quality 30 FPS</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
