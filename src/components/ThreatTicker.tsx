import React from 'react';
import { LIVE_THREAT_FEED } from '../data/mockThreats';
import { Radio, ShieldAlert } from 'lucide-react';

export const ThreatTicker: React.FC = () => {
  return (
    <div className="w-full bg-[#0a0e17] border-b border-slate-800/80 overflow-hidden py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
        {/* Ticker badge */}
        <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-slate-800 text-cyan-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-semibold tracking-wider text-[11px] uppercase flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-cyan-400" />
            LIVE ATTACK STREAM
          </span>
        </div>

        {/* Ticker items */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-6 px-4 text-slate-400 whitespace-nowrap">
          {LIVE_THREAT_FEED.map((item) => (
            <div key={item.id} className="inline-flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-bold">
                {item.region}
              </span>
              <span className="text-slate-200 font-medium">{item.brand}:</span>
              <span className="text-slate-400">{item.threat}</span>
              <span className="text-rose-400 text-[10px] flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-rose-500" />
                {item.status}
              </span>
              <span className="text-slate-600 text-[10px]">({item.time})</span>
              <span className="text-slate-700">|</span>
            </div>
          ))}
        </div>

        {/* Right Counter */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 pl-4 border-l border-slate-800 text-slate-400 text-[11px]">
          <span>THREATS MITIGATED TODAY:</span>
          <span className="text-cyan-400 font-bold font-mono">148,291</span>
        </div>
      </div>
    </div>
  );
};
