import React, { useState } from 'react';
import {
  Globe,
  MessageSquare,
  FileText,
  Search,
  Sparkles,
  UploadCloud,
  FileCode,
  ShieldAlert,
  CheckCircle2,
  Sliders,
  Layers,
  ArrowRight,
} from 'lucide-react';
import type { ThreatType, ThreatResult } from '../types/threat';
import {
  PRIMARY_PHISHING_RESULT,
  MESSAGE_SCAM_RESULT,
  DOCUMENT_SCAM_RESULT,
  CLEAN_RESULT,
} from '../data/mockThreats';

interface HeroScannerProps {
  onScanTrigger: (target: string, type: ThreatType, mockResult: ThreatResult) => void;
  isScanning: boolean;
}

export const HeroScanner: React.FC<HeroScannerProps> = ({ onScanTrigger, isScanning }) => {
  const [activeTab, setActiveTab] = useState<ThreatType>('url');

  // Input states
  const [urlInput, setUrlInput] = useState(
    'https://secure-chase-auth92-verification.net/update-credentials'
  );
  const [messageInput, setMessageInput] = useState(
    'URGENT: Internal Revenue Service (IRS) Tax Case #US-98219. Your federal refund of $1,428.50 will be forfeited in 3 hours. Verify deposit SSN: https://irs-tax-refund-portal.me/gov-claim'
  );
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
    hash: string;
  } | null>({
    name: 'Q3_Financial_Audit_Executive_Summary.pdf.exe',
    size: '1.42 MB',
    type: 'application/x-msdownload',
    hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  });
  const [isDragging, setIsDragging] = useState(false);

  // Advanced toggles
  const [deepSandbox, setDeepSandbox] = useState(true);
  const [unmaskRedirects, setUnmaskRedirects] = useState(true);
  const [visionInspection, setVisionInspection] = useState(true);

  // Message preview mode (raw vs preview)
  const [messageMode, setMessageMode] = useState<'edit' | 'preview'>('edit');

  const handleRunScan = () => {
    if (isScanning) return;

    if (activeTab === 'url') {
      const isClean = urlInput.includes('github.com') || urlInput.includes('google.com');
      const result = isClean ? CLEAN_RESULT : PRIMARY_PHISHING_RESULT;
      onScanTrigger(urlInput || 'https://secure-chase-auth92-verification.net/update-credentials', 'url', {
        ...result,
        target: urlInput || result.target,
      });
    } else if (activeTab === 'message') {
      onScanTrigger(messageInput, 'message', {
        ...MESSAGE_SCAM_RESULT,
        target: messageInput,
      });
    } else {
      onScanTrigger(uploadedFile?.name || 'Q3_Financial_Audit_Executive_Summary.pdf.exe', 'document', {
        ...DOCUMENT_SCAM_RESULT,
        target: uploadedFile?.name || 'Q3_Financial_Audit_Executive_Summary.pdf.exe',
      });
    }
  };

  const loadSample = (type: 'phish' | 'clean' | 'sms' | 'doc') => {
    if (type === 'phish') {
      setActiveTab('url');
      setUrlInput('https://secure-chase-auth92-verification.net/update-credentials');
    } else if (type === 'clean') {
      setActiveTab('url');
      setUrlInput('https://github.com/torvalds/linux');
    } else if (type === 'sms') {
      setActiveTab('message');
      setMessageInput(
        'URGENT: Internal Revenue Service (IRS) Tax Case #US-98219. Your federal refund of $1,428.50 will be forfeited in 3 hours. Verify deposit SSN: https://irs-tax-refund-portal.me/gov-claim'
      );
    } else if (type === 'doc') {
      setActiveTab('document');
      setUploadedFile({
        name: 'Q3_Financial_Audit_Executive_Summary.pdf.exe',
        size: '1.42 MB',
        type: 'application/x-msdownload',
        hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      });
    }
  };

  return (
    <section className="relative pt-6 pb-4">
      {/* Hero Headline */}
      <div className="text-center max-w-3xl mx-auto mb-8 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>NEXT-GEN AI FRAUD & SOCIAL ENGINEERING DEFENSE</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Unified Autonomous{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
            Threat & Fraud Intelligence
          </span>
        </h1>

        <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
          Instantly detect zero-day phishing, credential harvesters, coercive smishing, and weaponized
          payloads using multi-vector NLP heuristics and neural vision verification.
        </p>

        {/* Quick Demo Previews Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 font-mono text-[11px]">QUICK SCENARIOS:</span>
          <button
            onClick={() => loadSample('phish')}
            className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            Chase Phishing (88/100)
          </button>
          <button
            onClick={() => loadSample('sms')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition flex items-center gap-1.5"
          >
            <MessageSquare className="w-3 h-3 text-amber-400" />
            IRS Smishing (94/100)
          </button>
          <button
            onClick={() => loadSample('doc')}
            className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 transition flex items-center gap-1.5"
          >
            <FileCode className="w-3 h-3 text-indigo-400" />
            Fake PDF Payload (96/100)
          </button>
          <button
            onClick={() => loadSample('clean')}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Clean Domain (3/100)
          </button>
        </div>
      </div>

      {/* Main Glassmorphic Tool Container */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-2xl glass-panel-glow p-2 sm:p-3 relative overflow-hidden">
          {/* Subtle top highlight */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          {/* Interactive Multi-Tab Bar */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-950/70 rounded-xl border border-slate-800/80 mb-3">
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'url'
                  ? 'bg-gradient-to-r from-cyan-900/60 to-blue-900/60 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Scan URL / Domain</span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-cyan-500/20 text-[10px] text-cyan-300 font-mono">
                WEB
              </span>
            </button>

            <button
              onClick={() => setActiveTab('message')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'message'
                  ? 'bg-gradient-to-r from-cyan-900/60 to-blue-900/60 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Analyze Message / Email</span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-cyan-500/20 text-[10px] text-cyan-300 font-mono">
                NLP
              </span>
            </button>

            <button
              onClick={() => setActiveTab('document')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'document'
                  ? 'bg-gradient-to-r from-cyan-900/60 to-blue-900/60 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Upload Document</span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-cyan-500/20 text-[10px] text-cyan-300 font-mono">
                IOC
              </span>
            </button>
          </div>

          {/* TAB 1: Scan URL */}
          {activeTab === 'url' && (
            <div className="p-3 sm:p-4 space-y-4">
              <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Globe className="w-5 h-5 text-cyan-400" />
                  </div>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Enter suspicious URL or host (e.g., https://secure-bank-login.com/auth)..."
                    className="w-full pl-12 pr-10 py-3.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRunScan();
                    }}
                  />
                  {urlInput && (
                    <button
                      onClick={() => setUrlInput('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 text-xs font-mono"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                {/* Glowing Analyze Button */}
                <button
                  onClick={handleRunScan}
                  disabled={isScanning || !urlInput.trim()}
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_35px_rgba(56,189,248,0.55)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>Analyze Threat</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>

              {/* URL Heuristic Options Checklist */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/60 text-xs">
                <div className="flex flex-wrap items-center gap-4 text-slate-400">
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
                    <input
                      type="checkbox"
                      checked={deepSandbox}
                      onChange={(e) => setDeepSandbox(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>Headless Sandbox Emulation</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
                    <input
                      type="checkbox"
                      checked={unmaskRedirects}
                      onChange={(e) => setUnmaskRedirects(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>Unmask 302/301 Hops</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
                    <input
                      type="checkbox"
                      checked={visionInspection}
                      onChange={(e) => setVisionInspection(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>Computer Vision Trademark Check</span>
                  </label>
                </div>

                <div className="text-[11px] font-mono text-slate-500">
                  Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Enter ↵</kbd>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Analyze Message / Email */}
          {activeTab === 'message' && (
            <div className="p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Paste SMS text, email body, or headers to parse NLP coercion signals</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setMessageMode('edit')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono ${
                      messageMode === 'edit'
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    RAW TEXT
                  </button>
                  <button
                    onClick={() => setMessageMode('preview')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono ${
                      messageMode === 'preview'
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    FORMATTED
                  </button>
                </div>
              </div>

              {messageMode === 'edit' ? (
                <textarea
                  rows={4}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Paste raw SMS message, phishing email text, or spoofed sender headers here..."
                  className="w-full p-3.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner resize-none"
                />
              ) : (
                <div className="w-full h-28 p-3.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-slate-200 text-xs sm:text-sm font-sans overflow-y-auto whitespace-pre-wrap">
                  {messageInput}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
                <div className="text-xs text-slate-400 font-mono">
                  Characters: <span className="text-cyan-400">{messageInput.length}</span> | NLP
                  Model: <span className="text-slate-300">ScamGuard-v4.8</span>
                </div>

                <button
                  onClick={handleRunScan}
                  disabled={isScanning || !messageInput.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition shadow-[0_0_20px_rgba(56,189,248,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>Execute NLP Analysis</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Upload Document */}
          {activeTab === 'document' && (
            <div className="p-3 sm:p-4 space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const f = e.dataTransfer.files[0];
                    setUploadedFile({
                      name: f.name,
                      size: `${(f.size / 1024 / 1024).toFixed(2)} MB`,
                      type: f.type || 'application/octet-stream',
                      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                    });
                  }
                }}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-950/30'
                    : 'border-slate-700/80 bg-slate-950/60 hover:border-cyan-500/50 hover:bg-slate-900/40'
                }`}
                onClick={() => {
                  // Simulate upload if clicked
                  setUploadedFile({
                    name: 'Q3_Financial_Audit_Executive_Summary.pdf.exe',
                    size: '1.42 MB',
                    type: 'application/x-msdownload',
                    hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                  });
                }}
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                    <UploadCloud className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      Drag & Drop suspicious file here, or{' '}
                      <span className="text-cyan-400 underline">browse workspace</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports EML, MSG, PDF, DOCX, XLSX, APK, DMG & PE Binaries (Max 50MB)
                    </p>
                  </div>

                  {/* Badges of supported extensions */}
                  <div className="flex items-center gap-1.5 flex-wrap justify-center mt-1">
                    {['.EML', '.MSG', '.PDF', '.DOCX', '.EXE', '.APK'].map((ext) => (
                      <span
                        key={ext}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
                      >
                        {ext}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Uploaded File Chip & Dissect Button */}
              {uploadedFile && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div className="text-left font-mono">
                      <div className="text-xs text-slate-200 font-bold truncate max-w-xs">
                        {uploadedFile.name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{uploadedFile.size}</span>
                        <span>•</span>
                        <span className="text-cyan-400 truncate max-w-[180px]">
                          SHA256: {uploadedFile.hash.slice(0, 16)}...
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleRunScan}
                    disabled={isScanning}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition shadow-[0_0_20px_rgba(56,189,248,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-slate-950" />
                    <span>Dissect Macro & Payload</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
