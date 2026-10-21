import React from 'react';
import { X, Printer, ShieldCheck } from 'lucide-react';
import type { ThreatResult } from '../types/threat';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ThreatResult;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-bold text-white font-mono">
              SCAMSHIELD-FORENSIC-DOSSIER-#{result.id}.pdf
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Document Preview */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-950 font-sans text-slate-200">
          {/* Header Block */}
          <div className="border-b-2 border-cyan-500/50 pb-6 flex justify-between items-start">
            <div>
              <div className="text-2xl font-black tracking-tight text-white font-sans flex items-center gap-2">
                <span>SCAMSHIELD AI</span>
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  CLASSIFIED // SOC LEVEL 3
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Unified Autonomous Cyber Threat & Fraud Attribution Dossier
              </p>
            </div>
            <div className="text-right font-mono text-xs text-slate-400">
              <div>REPORT ID: {result.id}</div>
              <div>DATE: {result.timestamp}</div>
              <div className="text-rose-400 font-bold">STATUS: CONFIRMED MALICIOUS</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              1.0 Executive Intelligence Summary
            </h4>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <p>{result.summary}</p>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 block">RISK SCORE:</span>
                  <span className="text-rose-400 font-bold">{result.riskScore}/100</span>
                </div>
                <div>
                  <span className="text-slate-500 block">THREAT CLASS:</span>
                  <span className="text-slate-200">{result.threatCategory}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">TARGET ENTITY:</span>
                  <span className="text-slate-200">{result.impersonatedBrand || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">CONFIDENCE:</span>
                  <span className="text-cyan-400">{result.confidenceScore}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Indicators of Compromise (IOC) */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              2.0 Technical Indicators of Compromise (IOC)
            </h4>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Target Indicator:</span>
                <span className="text-rose-400 font-bold">{result.target}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Resolved IP Address:</span>
                <span className="text-cyan-400">{result.telemetry.ipAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">ASN Attribution:</span>
                <span className="text-slate-200">{result.telemetry.asn}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">SHA-256 Payload Hash:</span>
                <span className="text-slate-300 break-all text-[11px]">{result.telemetry.sha256}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Domain Provisioning:</span>
                <span className="text-slate-200">{result.telemetry.domainAge} ({result.telemetry.registrar})</span>
              </div>
            </div>
          </div>

          {/* Forensic Evidence Items */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              3.0 Heuristic & NLP Evidence Items
            </h4>
            <div className="space-y-2">
              {result.evidence.map((ev, i) => (
                <div key={ev.id} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-mono font-semibold text-slate-200 mb-1">
                    <span>3.{i + 1} {ev.title}</span>
                    <span className="text-rose-400 uppercase text-[10px]">{ev.tag}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{ev.description}</p>
                  <p className="text-cyan-400/90 font-mono text-[10px] mt-1.5 bg-slate-950 p-2 rounded">
                    Proof: {ev.technicalDetail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer certification */}
          <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-[11px] font-mono text-slate-500">
            <div>CONFIDENTIAL & PROPRIETARY // GENERATED BY SCAMSHIELD AI ENGINE</div>
            <div>VERIFIED BY SEC-OPS AUTONOMOUS DISPATCHER</div>
          </div>
        </div>
      </div>
    </div>
  );
};
