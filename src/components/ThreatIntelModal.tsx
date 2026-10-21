import React from 'react';
import { X, Globe2, AlertOctagon, Activity } from 'lucide-react';

interface ThreatIntelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GLOBAL_CAMPAIGNS = [
  {
    name: 'Tycoon 2FA Phishing-as-a-Service',
    origin: 'Eastern Europe / Bulletproof Hosting',
    target: 'Microsoft 365, Google Workspace, US Banking',
    volume: '2.4M probes / day',
    severity: 'CRITICAL',
    vector: 'Reverse proxy evilginx session hijacking',
  },
  {
    name: 'IRS/HMRC Direct Smishing Surge',
    origin: 'Southeast Asia VOIP Gateways',
    target: 'Retail Taxpayers (US, UK, CA)',
    volume: '680K SMS / day',
    severity: 'HIGH',
    vector: 'Spoofed federal shortcodes & lookalike .me TLDs',
  },
  {
    name: 'Quishing (QR Code Phishing) Wave',
    origin: 'Multi-Region Distributed',
    target: 'Enterprise Finance & HR Portals',
    volume: '410K messages / day',
    severity: 'HIGH',
    vector: 'SVG-embedded QR codes bypassing OCR filters',
  },
  {
    name: 'Double-Extension Executable Drop',
    origin: 'Unknown Cybercrime Cartel',
    target: 'Executive Accounting Teams',
    volume: '120K binaries / day',
    severity: 'CRITICAL',
    vector: 'Right-to-Left Override (RLO) + Cobalt Strike beacon',
  },
];

export const ThreatIntelModal: React.FC<ThreatIntelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white font-mono">
                Global Threat Intelligence Radar
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Real-Time Scam Syndicates & Autonomous Honeypot Feeds
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

        {/* Global Metrics Row */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/50 border-b border-slate-800 font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Active Phishing Hubs</span>
            <span className="text-rose-400 font-bold text-base">4,912 Live</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Smishing Gateways</span>
            <span className="text-amber-400 font-bold text-base">182 Nodes</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">0-Day Honeypot Hits</span>
            <span className="text-cyan-400 font-bold text-base">89,420 / hr</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Mean Detection Latency</span>
            <span className="text-emerald-400 font-bold text-base">280 ms</span>
          </div>
        </div>

        {/* Campaign List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>ACTIVE GLOBAL THREAT SYNDICATES</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> SYNCED WITH CISA & APWG
            </span>
          </div>

          {GLOBAL_CAMPAIGNS.map((camp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertOctagon
                    className={`w-4 h-4 ${
                      camp.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                    }`}
                  />
                  <h4 className="text-sm font-bold text-white">{camp.name}</h4>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    camp.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {camp.severity}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-300 pt-1">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Infrastructure</span>
                  <span>{camp.origin}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Target Vector</span>
                  <span className="text-slate-300">{camp.target}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Volume</span>
                  <span className="text-cyan-400">{camp.volume}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                <span className="text-slate-500">Attack Vector: </span>
                {camp.vector}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
