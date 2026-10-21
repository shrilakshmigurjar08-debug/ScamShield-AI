import React, { useState } from 'react';
import { Shield, Cpu, Activity, History, Globe2, Bell, ChevronDown, CheckCircle, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  onOpenThreatIntel: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  onOpenThreatIntel,
  historyCount,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090e]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Logo */}
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-3 group focus:outline-none">
            {/* Logo Icon with Shield + AI Node */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-indigo-600/30 border border-cyan-500/40 shadow-[0_0_15px_rgba(56,189,248,0.25)] group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.45)] transition-all">
              <Shield className="w-5 h-5 text-cyan-400 transition-transform group-hover:scale-105" />
              <Cpu className="w-2.5 h-2.5 text-indigo-300 absolute inset-0 m-auto" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>

            {/* Brand Title */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white font-sans">
                  ScamShield
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase rounded bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase -mt-0.5">
                Unified Fraud Intelligence
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              Dashboard
            </button>

            <button
              onClick={onOpenThreatIntel}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors flex items-center gap-2"
            >
              <Globe2 className="w-4 h-4 text-slate-400" />
              Threat Intel
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            </button>

            <button
              onClick={onOpenHistory}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors flex items-center gap-2"
            >
              <History className="w-4 h-4 text-slate-400" />
              Scan History
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
                {historyCount}
              </span>
            </button>
          </nav>
        </div>

        {/* Right cluster: Live Status, Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* Live Engine Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ENGINE v4.8 ACTIVE</span>
            <span className="text-emerald-500/40">|</span>
            <span className="text-slate-400 text-[11px]">0-DAY RADAR ON</span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent hover:border-slate-800 transition"
              title="Threat Feeds & Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#07090e]" />
            </button>

            {/* Notifications Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/80 p-3 z-50 font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="text-xs font-mono font-semibold uppercase text-slate-300">
                    Live Threat Alerts
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">2 NEW</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
                    <div className="text-rose-400 font-medium">Chase Bank Phishing Wave</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      New Tycoon2FA cluster targeting US retail banking credentials.
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                    <div className="text-amber-400 font-medium">IRS Tax Season Smishing Surge</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      12,400 spoofed federal refund messages intercepted in last hour.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-850 transition"
            >
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 via-indigo-600 to-slate-800 flex items-center justify-center font-mono font-bold text-xs text-white shadow-inner">
                SG
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#07090e]" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200">
                  S. Gurjar
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  SecOps L3
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/80 p-3 z-50">
                <div className="pb-2 border-b border-slate-800 mb-2">
                  <div className="text-xs font-semibold text-white">Shrilakshmi Gurjar</div>
                  <div className="text-[11px] font-mono text-cyan-400">Lead Cyber Threat Analyst</div>
                  <div className="text-[10px] text-slate-400 mt-1">Clearance: TOP-SECRET // DEFCON-2</div>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-800/80">
                    <span>Threat Feed Telemetry</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-800/80">
                    <span>Active Sandbox Mode</span>
                    <span className="text-cyan-400 font-mono text-[10px]">Chromium Headless</span>
                  </div>
                  <a
                    href="https://cisa.gov"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-800/80 text-slate-400 hover:text-slate-200"
                  >
                    <span>CISA Advisory Feeds</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
