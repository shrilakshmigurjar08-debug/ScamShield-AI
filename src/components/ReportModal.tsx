import React, { useState } from 'react';
import { X, ShieldAlert, Send, ExternalLink, Building, Lock } from 'lucide-react';
import type { ThreatResult } from '../types/threat';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ThreatResult;
  onSubmitReport: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  result,
  onSubmitReport,
}) => {
  const [reportingTo, setReportingTo] = useState({
    cert: true,
    apwg: true,
    google: true,
    registrar: true,
  });
  const [includeFullTelemetry, setIncludeFullTelemetry] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitReport();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-rose-950/40 p-6 overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Dispatch Threat Takedown & CERT Escalation
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Automated Incident Response Dispatcher • STIX 2.1 Schema
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Target Summary Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
            <div className="text-slate-500 text-[10px] uppercase">Malicious Target Indicator</div>
            <div className="text-rose-400 font-bold break-all">{result.target}</div>
            <div className="text-slate-400 text-[11px] pt-1 flex items-center gap-3">
              <span>Risk: <span className="text-rose-400 font-bold">{result.riskScore}/100</span></span>
              <span>•</span>
              <span>Category: <span className="text-slate-200">{result.threatCategory}</span></span>
              <span>•</span>
              <span>IP: <span className="text-cyan-400">{result.telemetry.ipAddress}</span></span>
            </div>
          </div>

          {/* Reporting Authorities Checkboxes */}
          <div>
            <label className="text-xs font-mono font-semibold uppercase text-slate-300 block mb-2">
              Select Intelligence Agencies & Abuse Desks
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs">
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-slate-200">US-CERT / CISA (Cybersecurity & Infrastructure Security)</div>
                    <div className="text-[11px] text-slate-400">Direct federal CIRT incident logging</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={reportingTo.cert}
                  onChange={(e) => setReportingTo({ ...reportingTo, cert: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <div>
                    <div className="font-semibold text-slate-200">Anti-Phishing Working Group (APWG)</div>
                    <div className="text-[11px] text-slate-400">Global eCrime exchange blacklist feed</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={reportingTo.apwg}
                  onChange={(e) => setReportingTo({ ...reportingTo, apwg: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-slate-200">Google Safe Browsing & Microsoft Defender</div>
                    <div className="text-[11px] text-slate-400">Browser red-screen warning trigger (protects 4B+ endpoints)</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={reportingTo.google}
                  onChange={(e) => setReportingTo({ ...reportingTo, google: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs">
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-slate-200">Registrar Abuse Desk ({result.telemetry.registrar})</div>
                    <div className="text-[11px] text-slate-400">Initiate immediate DNS suspension & domain revocation</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={reportingTo.registrar}
                  onChange={(e) => setReportingTo({ ...reportingTo, registrar: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
              </label>
            </div>
          </div>

          {/* Telemetry attachment toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeFullTelemetry}
                onChange={(e) => setIncludeFullTelemetry(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
              <span>Attach cryptographic evidence bundle (PCAP, DOM Keylogger AST, SHA-256)</span>
            </label>
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-750 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 transition shadow-lg shadow-rose-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Transmitting Payload...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Incident Dispatch</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
