import React, { useState } from 'react';
import { X, History, Search, ArrowRight } from 'lucide-react';
import type { ScanHistoryItem } from '../types/threat';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanHistoryItem[];
  onSelectScan: (item: ScanHistoryItem) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectScan,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'safe'>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'critical'
        ? item.severity === 'critical' || item.severity === 'high'
        : item.severity === 'safe';
    const matchesSearch =
      item.target.toLowerCase().includes(search.toLowerCase()) ||
      item.threatCategory.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono">
              Historical Scan Telemetry Log
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search targets, campaigns, or classifications..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 shrink-0 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded ${
                filter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
              }`}
            >
              ALL ({history.length})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-2.5 py-1 rounded ${
                filter === 'critical' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400'
              }`}
            >
              MALICIOUS
            </button>
            <button
              onClick={() => setFilter('safe')}
              className={`px-2.5 py-1 rounded ${
                filter === 'safe' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'
              }`}
            >
              SAFE
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">
              No scan records matching current criteria.
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectScan(item);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/60 transition cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 truncate">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      item.riskScore >= 75
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        : item.riskScore >= 40
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    <span className="font-mono font-bold text-xs">{item.riskScore}</span>
                  </div>

                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition truncate">
                      {item.target}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-500">
                      <span className="text-slate-400">{item.threatCategory}</span>
                      <span>•</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {item.targetType}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
