import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Copy,
  Check,
  Send,
  Download,
  CheckCircle,
  Clock,
  Terminal,
  Activity,
  ChevronDown,
  ChevronUp,
  Fingerprint,
} from 'lucide-react';
import type { ThreatResult, ThreatSeverity } from '../types/threat';
import { RiskGauge } from './RiskGauge';

interface ResultsInterfaceProps {
  result: ThreatResult;
  onOpenReportModal: () => void;
  onOpenExportModal: () => void;
  onWhitelist: () => void;
}

export const ResultsInterface: React.FC<ResultsInterfaceProps> = ({
  result,
  onOpenReportModal,
  onOpenExportModal,
  onWhitelist,
}) => {
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState<string | null>(result.evidence[0]?.id || null);
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'network' | 'ioc' | 'forensics'>('network');

  const handleCopyTarget = () => {
    navigator.clipboard.writeText(result.target);
    setCopiedTarget(true);
    setTimeout(() => setCopiedTarget(false), 2000);
  };

  const getSeverityBadge = (sev: ThreatSeverity) => {
    switch (sev) {
      case 'critical':
        return {
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
          dot: 'bg-rose-500 animate-pulse',
          icon: ShieldAlert,
          label: 'CRITICAL THREAT (CVSS 9.1)',
        };
      case 'high':
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-500',
          icon: AlertTriangle,
          label: 'HIGH SEVERITY (CVSS 7.8)',
        };
      default:
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
          dot: 'bg-emerald-500',
          icon: CheckCircle,
          label: 'CLEAN / BENIGN (CVSS 0.0)',
        };
    }
  };

  const badge = getSeverityBadge(result.severity);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Result Container with Dynamic Border Glow */}
      <div
        className={`rounded-2xl transition-all ${
          result.severity === 'critical'
            ? 'glass-danger-glow'
            : result.severity === 'safe'
            ? 'border border-emerald-500/30 bg-emerald-950/20'
            : 'glass-panel-glow'
        } p-4 sm:p-6 lg:p-8 relative overflow-hidden`}
      >
        {/* Top Header Banner: Threat Verdict & Meta */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Badge */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-semibold tracking-wide ${badge.bg}`}
              >
                <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                <span>{result.threatCategory}</span>
              </div>

              {/* Impersonated Brand (if any) */}
              {result.impersonatedBrand && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono text-slate-300">
                  <span className="text-slate-500">TARGET:</span>
                  <span className="text-rose-400 font-bold">{result.impersonatedBrand}</span>
                </div>
              )}

              {/* Scan ID & Time */}
              <span className="text-slate-500 text-xs font-mono">
                ID: {result.id} • {result.timestamp}
              </span>
            </div>

            {/* Target URL or Headline */}
            <div className="flex items-center gap-3 mt-1">
              <div className="text-lg sm:text-xl font-bold font-mono text-white break-all flex-1">
                {result.target}
              </div>
              <button
                onClick={handleCopyTarget}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition shrink-0"
                title="Copy Target Indicator"
              >
                {copiedTarget ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Metrics Cluster */}
          <div className="flex items-center gap-3 sm:gap-6 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs font-mono self-start lg:self-auto">
            <div>
              <div className="text-slate-500 uppercase text-[10px]">VERDICT TIME</div>
              <div className="text-cyan-400 font-bold flex items-center gap-1 text-sm">
                <Clock className="w-3.5 h-3.5" />
                {result.verdictTime}
              </div>
            </div>
            <div className="w-[1px] h-8 bg-slate-800" />
            <div>
              <div className="text-slate-500 uppercase text-[10px]">AI CONFIDENCE</div>
              <div className="text-slate-200 font-bold text-sm">
                {result.confidenceScore}%
              </div>
            </div>
            <div className="w-[1px] h-8 bg-slate-800" />
            <div>
              <div className="text-slate-500 uppercase text-[10px]">ENGINES MATCHED</div>
              <div
                className={`font-bold text-sm ${
                  result.telemetry.enginesFlagged > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {result.telemetry.enginesFlagged}/{result.telemetry.totalEngines}
              </div>
            </div>
          </div>
        </div>

        {/* Core Analysis Split Grid: Left (Gauge & Actions) / Right (Evidence Breakdown) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6">
          {/* Left Column (5 Cols): Risk Dial, Vector Bars, Action Buttons */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-slate-950/70 rounded-2xl p-6 border border-slate-800/80 flex flex-col items-center">
              {/* Circular Gauge */}
              <RiskGauge score={result.riskScore} severity={result.severity} size={200} />

              {/* Assessment Subtext */}
              <p className="mt-4 text-xs text-slate-300 text-center leading-relaxed">
                {result.summary}
              </p>

              {/* Threat Vector Score Breakdown Bars */}
              <div className="w-full mt-6 space-y-3 pt-4 border-t border-slate-800/80 font-mono text-xs">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold flex justify-between">
                  <span>Heuristic Vector Analysis</span>
                  <span className="text-cyan-400">SIGNALS</span>
                </div>

                {/* Domain Reputation Bar */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Domain Reputation Risk</span>
                    <span className="text-slate-200">{result.vectorScores.domainReputation}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-700"
                      style={{ width: `${result.vectorScores.domainReputation}%` }}
                    />
                  </div>
                </div>

                {/* NLP Coercion Bar */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">NLP Psychological Coercion</span>
                    <span className="text-slate-200">{result.vectorScores.nlpCoercion}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-700"
                      style={{ width: `${result.vectorScores.nlpCoercion}%` }}
                    />
                  </div>
                </div>

                {/* Network Cloaking Bar */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Network Cloaking / Evasion</span>
                    <span className="text-slate-200">{result.vectorScores.networkCloaking}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-700"
                      style={{ width: `${result.vectorScores.networkCloaking}%` }}
                    />
                  </div>
                </div>

                {/* Visual Similarity Bar */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Visual Brand Mimicry Match</span>
                    <span className="text-slate-200">{result.vectorScores.visualSimilarity}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-700"
                      style={{ width: `${result.vectorScores.visualSimilarity}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Cluster */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Incident Response Actions
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Report to Authorities Button */}
                <button
                  onClick={onOpenReportModal}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Send className="w-4 h-4" />
                  <span>Report to Authorities</span>
                </button>

                {/* Export PDF Report */}
                <button
                  onClick={onOpenExportModal}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Export Threat PDF</span>
                </button>
              </div>

              {/* Whitelist / False Positive action */}
              <button
                onClick={onWhitelist}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-950/60 hover:bg-slate-900 border border-slate-800/80 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Mark as False Positive / Whitelist Indicator</span>
              </button>
            </div>
          </div>

          {/* Right Column (7 Cols): Evidence Breakdown Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  Forensic Evidence Breakdown
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {result.evidence.length} Critical Vectors Identified
              </span>
            </div>

            {/* Evidence Cards Grid */}
            <div className="space-y-3">
              {result.evidence.map((item) => {
                const isExpanded = expandedEvidence === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border transition-all ${
                      item.severity === 'critical'
                        ? 'border-rose-500/30 bg-rose-950/20 hover:border-rose-500/50'
                        : item.severity === 'high'
                        ? 'border-amber-500/30 bg-amber-950/20 hover:border-amber-500/50'
                        : 'border-emerald-500/30 bg-emerald-950/20'
                    }`}
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => setExpandedEvidence(isExpanded ? null : item.id)}
                      className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 p-1.5 rounded-lg border ${
                            item.severity === 'critical'
                              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                              : item.severity === 'high'
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          }`}
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                item.severity === 'critical'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : item.severity === 'high'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-emerald-500/20 text-emerald-300'
                              }`}
                            >
                              {item.tag}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-slate-400 shrink-0 mt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {/* Expandable Technical Proof Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-800/80">
                        <div className="bg-slate-950/90 rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-1.5 border border-slate-800">
                          <div className="text-[10px] uppercase text-cyan-400 font-semibold flex items-center gap-1.5">
                            <Activity className="w-3 h-3 text-cyan-400" />
                            Technical Indicator Proof:
                          </div>
                          <div className="text-slate-300 break-all leading-normal">
                            {item.technicalDetail}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Technical Telemetry Inspector Drawer */}
            <div className="mt-4 rounded-xl bg-slate-950/80 border border-slate-800/90 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold uppercase text-slate-200">
                    Cryptographic & Network Telemetry
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono">
                  <button
                    onClick={() => setActiveTelemetryTab('network')}
                    className={`px-2 py-0.5 rounded ${
                      activeTelemetryTab === 'network'
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    NETWORK / ASN
                  </button>
                  <button
                    onClick={() => setActiveTelemetryTab('ioc')}
                    className={`px-2 py-0.5 rounded ${
                      activeTelemetryTab === 'ioc'
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    IOC HASHES
                  </button>
                  <button
                    onClick={() => setActiveTelemetryTab('forensics')}
                    className={`px-2 py-0.5 rounded ${
                      activeTelemetryTab === 'forensics'
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    MITRE ATT&CK
                  </button>
                </div>
              </div>

              <div className="pt-3 font-mono text-xs">
                {activeTelemetryTab === 'network' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Destination IP</span>
                      <span className="text-cyan-400 font-bold">{result.telemetry.ipAddress}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">ASN Organization</span>
                      <span>{result.telemetry.asn}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Domain Age</span>
                      <span className="text-rose-400 font-bold">{result.telemetry.domainAge}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Registrar</span>
                      <span>{result.telemetry.registrar}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">SSL Certificate</span>
                      <span>{result.telemetry.sslIssuer} ({result.telemetry.sslValidity})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Hosting Geo</span>
                      <span>{result.telemetry.country}</span>
                    </div>
                  </div>
                )}

                {activeTelemetryTab === 'ioc' && (
                  <div className="space-y-2 text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">SHA-256 Checksum</span>
                      <span className="text-cyan-400 break-all text-[11px]">
                        {result.telemetry.sha256}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Cloaking Hops</span>
                        <span>{result.telemetry.redirectHops} Hops (302 Redirect Cascade)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Fast-Flux Nameservers</span>
                        <span className="text-amber-400">ns1.bulletproof-dns.is</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTelemetryTab === 'forensics' && (
                  <div className="space-y-2 text-slate-300 text-[11px]">
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div>
                        <span className="text-cyan-400 font-bold mr-2">T1566.002</span>
                        <span>Spearphishing Link (Social Engineering Coercion)</span>
                      </div>
                      <span className="text-rose-400 font-bold">DETECTED</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div>
                        <span className="text-cyan-400 font-bold mr-2">T1056.001</span>
                        <span>Keylogging / DOM Input Interception Hook</span>
                      </div>
                      <span className="text-rose-400 font-bold">DETECTED</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div>
                        <span className="text-cyan-400 font-bold mr-2">T1071.001</span>
                        <span>Web Protocols C2 Exfiltration via Telegram Bot API</span>
                      </div>
                      <span className="text-rose-400 font-bold">DETECTED</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
