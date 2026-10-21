import React, { useEffect, useState } from 'react';
import { Shield, Radio, Cpu, Network, FileSearch, CheckCircle2 } from 'lucide-react';

interface ScanAnimationProps {
  target: string;
  onComplete: () => void;
}

const SCAN_STAGES = [
  {
    icon: Network,
    label: 'Network & DNS Telemetry',
    detail: 'Deobfuscating protocol & recursive 302/301 redirect unmasking...',
  },
  {
    icon: Radio,
    label: 'Global Threat Intelligence',
    detail: 'Cross-referencing 72 feeds (CISA, AlienVault OTX, PhishTank, Spamhaus)...',
  },
  {
    icon: Cpu,
    label: 'NLP Heuristics & Social Engineering',
    detail: 'Analyzing semantic urgency vectors, coercion patterns, and psychological lures...',
  },
  {
    icon: FileSearch,
    label: 'Computer Vision & DOM Fingerprint',
    detail: 'Comparing trademarked UI assets, favicon hashes, and spoofed bank CSS...',
  },
  {
    icon: Shield,
    label: 'Verdict & Risk Synthesis',
    detail: 'Synthesizing CVSS risk attribution & generating cryptographic verdict report...',
  },
];

export const ScanAnimation: React.FC<ScanAnimationProps> = ({ target, onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const totalDuration = 2400; // 2.4 seconds of high-tech scanning
    const stageInterval = totalDuration / SCAN_STAGES.length;

    const stageTimer = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < SCAN_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stageInterval);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return Math.min(100, prev + Math.floor(Math.random() * 8) + 4);
      });
    }, 100);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, totalDuration + 200);

    return () => {
      clearInterval(stageTimer);
      clearInterval(progressTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel-glow p-8 md:p-12 my-6">
      {/* Background ambient grid & lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto text-center">
        {/* Holographic Radar Scanner Display */}
        <div className="relative w-44 h-44 mb-8 flex items-center justify-center">
          {/* Outer Pulsing Rings */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-25" />
          <div className="absolute inset-3 rounded-full border border-dashed border-cyan-400/40 animate-spin [animation-duration:15s]" />
          <div className="absolute inset-8 rounded-full border border-cyan-500/20" />
          <div className="absolute inset-14 rounded-full border border-cyan-400/30" />

          {/* Grid crosshairs */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-cyan-500/30" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-cyan-500/30" />

          {/* Rotating Radar Sweep Cone */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="w-full h-full animate-radar origin-center"
              style={{
                background:
                  'conic-gradient(from 0deg, rgba(56, 189, 248, 0.45) 0deg, rgba(56, 189, 248, 0.05) 45deg, transparent 75deg)',
              }}
            />
          </div>

          {/* Center glowing node */}
          <div className="relative z-10 w-12 h-12 rounded-xl bg-slate-900/90 border border-cyan-400/60 shadow-[0_0_20px_rgba(56,189,248,0.5)] flex items-center justify-center">
            <Shield className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>

          {/* Target blips */}
          <div className="absolute top-8 right-10 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <div className="absolute bottom-10 left-12 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        {/* Status Headings */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          AUTONOMOUS NEURAL ENGINE SCANNING TARGET
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
          Executing Heuristic Deep Inspection
        </h3>

        <div className="w-full max-w-lg bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-1.5 mb-6 text-xs font-mono text-slate-300 truncate">
          <span className="text-cyan-400">Target:</span> {target}
        </div>

        {/* Progress Bar with Glow */}
        <div className="w-full max-w-md mb-6">
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Pipeline Progress
            </span>
            <span className="text-cyan-400 font-bold">{Math.min(progress, 100)}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/70">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-150 shadow-[0_0_12px_rgba(56,189,248,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Telemetry Stage Stream */}
        <div className="w-full max-w-lg bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-left font-mono text-xs space-y-2.5">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800/80 pb-1.5 flex justify-between">
            <span>Scan Diagnostic Sequence</span>
            <span className="text-cyan-400">STAGE {currentStage + 1} OF 5</span>
          </div>

          {SCAN_STAGES.map((stage, idx) => {
            const isDone = idx < currentStage;
            const isCurrent = idx === currentStage;
            const Icon = stage.icon;

            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 transition-all duration-300 ${
                  isCurrent
                    ? 'text-cyan-300 font-medium'
                    : isDone
                    ? 'text-slate-400'
                    : 'text-slate-600 opacity-40'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Icon className="w-3.5 h-3.5 text-cyan-400 animate-spin [animation-duration:3s]" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                  )}
                </div>
                <div className="flex-1 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{stage.label}</span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] animate-pulse">
                        ANALYZING
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{stage.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
