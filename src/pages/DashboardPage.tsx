import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { saveScanResult, getUserScanHistory } from '../services/db';
import type { ThreatReport } from '../types/threat';
import {
  Globe,
  Mail,
  FileText,
  UploadCloud,
  Copy,
  Check,
  Loader2,
  ArrowRight,
  Clock,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Database,
} from 'lucide-react';

const MOCK_REPORTS: Record<'phishing' | 'clean', ThreatReport> = {
  phishing: {
    id: 'SCAN-9201',
    target: 'http://secure-update-paypal-login.com/auth',
    type: 'url',
    riskScore: 92,
    severity: 'critical',
    category: 'Phishing / Credential Harvesting',
    summary:
      'High-confidence phishing site masquerading as PayPal. Detects deceptive domain structure, artificial urgency, and SSL certificate hostname mismatch.',
    domainAge: '2 days old (Registered Oct 18, 2026)',
    sslStatus: "Invalid / Hostname Mismatch (Let's Encrypt issued for different host)",
    ipAddress: '185.220.101.45 (HostKey B.V., Bulletproof Hosting)',
    scanTime: '1.2s',
    flags: [
      {
        title: 'Newly registered domain',
        description: 'Domain was provisioned less than 48 hours ago with WHOIS identity protection.',
        status: 'danger',
      },
      {
        title: 'Urgent credential request',
        description: 'NLP parsed aggressive coercion demanding immediate password and card verification.',
        status: 'danger',
      },
      {
        title: 'SSL Certificate mismatch',
        description: 'The site presents an untrusted certificate not signed for paypal.com.',
        status: 'danger',
      },
      {
        title: 'Hidden redirect found',
        description: 'Initial entry point cascades through a 302 proxy hop before landing on the login form.',
        status: 'danger',
      },
    ],
    recommendations: [
      'Do not submit login credentials, passwords, or personal details.',
      'Add domain to DNS / firewall sinkhole blocklist.',
      'Forward threat indicator to PayPal Fraud Desk (spoof@paypal.com).',
    ],
  },
  clean: {
    id: 'SCAN-1044',
    target: 'https://github.com/notifications',
    type: 'url',
    riskScore: 4,
    severity: 'safe',
    category: 'Verified Safe / Legitimate Infrastructure',
    summary:
      'Verified clean destination. Authentic Microsoft / GitHub enterprise infrastructure with extended validation security certificates.',
    domainAge: '17+ years (Registered Oct 2007)',
    sslStatus: 'Valid EV TLS (DigiCert High Assurance EV CA)',
    ipAddress: '140.82.121.4 (GitHub Inc., Anycast CDN)',
    scanTime: '0.9s',
    flags: [
      {
        title: 'Verified domain age > 10 yrs',
        description: 'Continuous 17-year operational reputation with verified ownership.',
        status: 'safe',
      },
      {
        title: 'Valid SSL Certificate',
        description: 'Cryptographically signed by DigiCert with strict HSTS preloading.',
        status: 'safe',
      },
      {
        title: 'No suspicious redirects',
        description: 'Clean direct HTTPS connection with zero unauthorized proxy hops.',
        status: 'safe',
      },
      {
        title: 'Clean Threat Feeds',
        description: 'Zero malicious indicators across 70+ threat intelligence feeds.',
        status: 'safe',
      },
    ],
    recommendations: [
      'No malicious behavior detected. Destination is safe for normal use.',
      'Always confirm address bar spelling before entering enterprise credentials.',
    ],
  },
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'url' | 'message' | 'document'>('url');
  const [inputVal, setInputVal] = useState<string>('http://secure-update-paypal-login.com/auth');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [report, setReport] = useState<ThreatReport>(MOCK_REPORTS.phishing);
  const [copied, setCopied] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [savedScans, setSavedScans] = useState<ThreatReport[]>([]);
  const [dbSaving, setDbSaving] = useState<boolean>(false);

  // Load existing scan history for current user from DB service
  useEffect(() => {
    if (user?.id) {
      getUserScanHistory(user.id).then((history) => {
        setSavedScans(history);
      });
    }
  }, [user?.id]);

  // Quick fill triggers for presentation demo
  const handleQuickFill = (type: 'phishing' | 'clean') => {
    if (activeTab === 'url') {
      setInputVal(MOCK_REPORTS[type].target);
    } else if (activeTab === 'message') {
      setInputVal(
        type === 'phishing'
          ? 'URGENT: Your PayPal account has been limited due to suspicious activity. Verify credentials now at http://secure-update-paypal-login.com/auth within 24 hours to prevent permanent suspension.'
          : 'GitHub Notification: Your pull request #482 was reviewed by @octocat and merged into main branch.'
      );
    } else {
      setSelectedFile(type === 'phishing' ? 'urgent_invoice_po9021.pdf.exe' : 'q3_report_clean.pdf');
    }
  };

  // Run simulated analysis with 1.2s timeout and persist result to DB
  const handleAnalyze = async () => {
    setIsScanning(true);
    setActionNotice(null);

    setTimeout(async () => {
      const isClean =
        inputVal.toLowerCase().includes('github.com') ||
        inputVal.toLowerCase().includes('google.com') ||
        (selectedFile && selectedFile.includes('clean'));

      const chosen = isClean ? MOCK_REPORTS.clean : MOCK_REPORTS.phishing;

      const newReport: ThreatReport = {
        ...chosen,
        id: `SCAN-${Math.floor(1000 + Math.random() * 9000)}`,
        target:
          activeTab === 'document'
            ? selectedFile || 'invoice_oct2026.pdf'
            : inputVal.trim() || chosen.target,
        type: activeTab,
      };

      setReport(newReport);
      setIsScanning(false);

      // Persist scan result to database service
      if (user?.id) {
        setDbSaving(true);
        try {
          const persisted = await saveScanResult(user.id, newReport);
          setSavedScans((prev) => [persisted, ...prev.filter((s) => s.id !== persisted.id)]);
        } catch (err) {
          console.error('Failed to persist scan to DB:', err);
        } finally {
          setDbSaving(false);
        }
      }
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-slate-800">
      {/* Navbar with authenticated user email & sign out */}
      <Navbar historyCount={savedScans.length} />

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Page Title & Subhead */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Fraud & Threat Detection Platform
            </h1>
            <p className="text-sm text-slate-400">
              Unified analysis engine for web URLs, smishing messages, and weaponized payload documents.
            </p>
          </div>

          {/* Database Synchronization Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 self-start sm:self-auto">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {dbSaving ? 'Syncing to DB...' : `DB Synced (${savedScans.length} Scans)`}
            </span>
          </div>
        </div>

        {/* Input & Scanner Section */}
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-sm">
          {/* Minimal Tab Bar */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 flex-wrap">
            <button
              onClick={() => {
                setActiveTab('url');
                setInputVal('http://secure-update-paypal-login.com/auth');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'url'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Scan URL
            </button>

            <button
              onClick={() => {
                setActiveTab('message');
                setInputVal(
                  'URGENT: Your PayPal account has been limited due to suspicious activity. Verify credentials now at http://secure-update-paypal-login.com/auth'
                );
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'message'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Analyze Message / Email
            </button>

            <button
              onClick={() => {
                setActiveTab('document');
                setSelectedFile('invoice_oct2026.pdf');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'document'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Upload Document
            </button>

            {/* Quick-fill presentation helpers */}
            <div className="ml-auto flex items-center gap-1.5 text-xs pt-1 sm:pt-0">
              <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">Demo Samples:</span>
              <button
                onClick={() => handleQuickFill('phishing')}
                className="px-2.5 py-1 rounded bg-red-950/40 text-red-300 border border-red-800/60 hover:bg-red-900/40 text-[11px] font-medium transition"
              >
                Load Phishing
              </button>
              <button
                onClick={() => handleQuickFill('clean')}
                className="px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/40 text-[11px] font-medium transition"
              >
                Load Safe
              </button>
            </div>
          </div>

          {/* TAB 1: URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Paste URL to inspect (e.g., http://secure-update-paypal-login.com/auth)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-slate-600 transition"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAnalyze();
                  }}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={isScanning || !inputVal.trim()}
                  className="px-5 py-2.5 bg-slate-100 text-slate-950 hover:bg-slate-200 active:bg-slate-300 font-medium text-sm rounded-md transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Cross-references DNS history, registrar WHOIS, TLS fingerprints, and NLP credential triggers.
              </p>
            </div>
          )}

          {/* TAB 2: Text/Email Input */}
          {activeTab === 'message' && (
            <div className="space-y-3">
              <textarea
                rows={3}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Paste SMS text, email body, or headers to parse NLP coercion signals..."
                className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-slate-600 transition resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  {inputVal.length} characters • NLP Social Engineering Parser
                </span>
                <button
                  onClick={handleAnalyze}
                  disabled={isScanning || !inputVal.trim()}
                  className="px-5 py-2 bg-slate-100 text-slate-950 hover:bg-slate-200 font-medium text-sm rounded-md transition flex items-center gap-2 cursor-pointer"
                >
                  {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{isScanning ? 'Analyzing...' : 'Analyze Message'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Document Upload Dropzone */}
          {activeTab === 'document' && (
            <div className="space-y-3">
              <div
                onClick={() => setSelectedFile('invoice_oct2026.pdf')}
                className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/60 rounded-lg p-6 text-center cursor-pointer transition"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <UploadCloud className="w-6 h-6 text-slate-400" />
                  <p className="text-xs font-medium text-slate-300">
                    Click to select file or drag and drop
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    PDF, EML, DOCX, or executables up to 25MB
                  </p>
                </div>
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between p-3 rounded-md bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-200">{selectedFile}</p>
                      <p className="text-[11px] text-slate-500 font-mono">Synthetic payload ready (1.2 MB)</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isScanning}
                    className="px-4 py-1.5 bg-slate-100 text-slate-950 hover:bg-slate-200 font-medium text-xs rounded-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {isScanning && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isScanning ? 'Inspecting...' : 'Scan File'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feedback Action Alert Notice */}
        {actionNotice && (
          <div className="p-3 rounded-md bg-slate-900 border border-slate-700 text-xs text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {actionNotice}
            </span>
            <button
              onClick={() => setActionNotice(null)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* RESULTS INTERFACE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-100">Analysis Verdict</h2>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Scan Duration: {report.scanTime}</span>
              <span>•</span>
              <span>ID: {report.id}</span>
            </div>
          </div>

          <div className="rounded-lg bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-sm">
            {/* Top Metric & Target Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              {/* Left Target Info */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border ${
                      report.severity === 'critical'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    {report.severity === 'critical' ? (
                      <ShieldAlert className="w-3.5 h-3.5" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    {report.category}
                  </span>
                  <span className="text-xs font-mono text-slate-500 uppercase">
                    [{report.type}]
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-slate-200 break-all font-semibold">
                    {report.target}
                  </span>
                  <button
                    onClick={() => copyToClipboard(report.target)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                    title="Copy URL"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  {report.summary}
                </p>
              </div>

              {/* Right: Human-Built Metric Card */}
              <div className="p-4 rounded-md bg-slate-950 border border-slate-800 shrink-0 min-w-[200px] text-center md:text-right">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
                  Threat Risk Score
                </span>
                <div className="flex items-baseline justify-center md:justify-end gap-1">
                  <span
                    className={`text-4xl font-extrabold font-mono tracking-tight ${
                      report.riskScore >= 70
                        ? 'text-red-400'
                        : report.riskScore >= 40
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {report.riskScore}
                  </span>
                  <span className="text-slate-500 font-mono text-sm">/ 100</span>
                </div>
                <div className="mt-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                      report.riskScore >= 70
                        ? 'text-red-400 bg-red-950/40 border border-red-800/60'
                        : 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/60'
                    }`}
                  >
                    {report.riskScore >= 70 ? 'Critical Threat Level' : 'Clean & Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Evidence Breakdown Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Detected Evidence & Behavioral Indicators ({report.flags.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-md bg-slate-950 border border-slate-800/90 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        {flag.status === 'danger' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                        {flag.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${
                          flag.status === 'danger'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {flag.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">
                      {flag.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Metadata Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Domain & Network Telemetry
              </h3>
              <div className="rounded-md border border-slate-800 bg-slate-950 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[11px]">Domain Registration:</span>
                  <span className="text-slate-200">{report.domainAge}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">SSL / TLS Certificate:</span>
                  <span className={report.severity === 'critical' ? 'text-red-400' : 'text-emerald-400'}>
                    {report.sslStatus}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Resolved IP / Hosting ASN:</span>
                  <span className="text-slate-300">{report.ipAddress}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Incident Classification:</span>
                  <span className="text-slate-300">{report.category}</span>
                </div>
              </div>
            </div>

            {/* Recommendations & Action Buttons */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300 block">Recommended Action:</span>
                <p className="text-[11px] text-slate-400">{report.recommendations[0]}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleAction('Threat reported to CERT / APWG database.')}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 hover:bg-red-500 text-white transition cursor-pointer"
                >
                  Report Threat
                </button>
                <button
                  onClick={() => handleAction('Added domain to local whitelist exception.')}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                >
                  Whitelist
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 font-mono">
        ScamShield AI Enterprise • Connected User: {user?.email} • Database Synced
      </footer>
    </div>
  );
};
