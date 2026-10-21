import { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Mail,
  FileText,
  UploadCloud,
  Copy,
  Check,
  Loader2,
  ArrowRight,
  Clock,
} from 'lucide-react';

// ==========================================
// 1. DUMMY DATA DEFINITIONS (STANDALONE MOCK)
// ==========================================

export interface ThreatFlag {
  title: string;
  description: string;
  status: 'danger' | 'safe' | 'warning';
}

export interface ThreatReport {
  id: string;
  target: string;
  type: 'url' | 'message' | 'document';
  riskScore: number;
  severity: 'critical' | 'safe';
  category: string;
  summary: string;
  domainAge: string;
  sslStatus: string;
  ipAddress: string;
  scanTime: string;
  flags: ThreatFlag[];
  recommendations: string[];
}

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
    sslStatus: 'Invalid / Hostname Mismatch (Let\'s Encrypt issued for different host)',
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

// ==========================================
// 2. MAIN STANDALONE COMPONENT
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState<'url' | 'message' | 'document'>('url');
  const [inputVal, setInputVal] = useState<string>('http://secure-update-paypal-login.com/auth');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [report, setReport] = useState<ThreatReport>(MOCK_REPORTS.phishing);
  const [copied, setCopied] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

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

  // Run simulated analysis with 1.2s timeout
  const handleAnalyze = () => {
    setIsScanning(true);
    setActionNotice(null);

    setTimeout(() => {
      // Determine if current input represents clean or phishing
      const isClean =
        inputVal.toLowerCase().includes('github.com') ||
        inputVal.toLowerCase().includes('google.com') ||
        (selectedFile && selectedFile.includes('clean'));

      const chosen = isClean ? MOCK_REPORTS.clean : MOCK_REPORTS.phishing;

      setReport({
        ...chosen,
        target:
          activeTab === 'document'
            ? selectedFile || 'invoice_oct2026.pdf'
            : inputVal.trim() || chosen.target,
        type: activeTab,
      });

      setIsScanning(false);
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-zinc-800">
      {/* Minimal Top Header */}
      <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
              <Shield className="w-4 h-4 text-zinc-100" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-zinc-100">ScamShield AI</span>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
                MVP v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Engine Ready</span>
            </div>
            <span className="text-zinc-700">|</span>
            <span>Standalone Demo Mode</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Page Title & Subhead */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Fraud & Threat Detection Platform
          </h1>
          <p className="text-sm text-zinc-400">
            Scan suspicious web URLs, emails, or file payloads for phishing indicators and credential harvesting threats.
          </p>
        </div>

        {/* Input & Scanner Section */}
        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-5 space-y-4">
          {/* Minimal Tab Bar */}
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <button
              onClick={() => {
                setActiveTab('url');
                setInputVal('http://secure-update-paypal-login.com/auth');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'url'
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
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
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
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
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Upload Document
            </button>

            {/* Quick-fill presentation helper */}
            <div className="ml-auto flex items-center gap-1.5 text-xs">
              <span className="text-zinc-500 font-mono text-[11px] hidden sm:inline">Presentation Samples:</span>
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
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 font-mono focus:outline-none focus:border-zinc-600 transition"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAnalyze();
                  }}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={isScanning || !inputVal.trim()}
                  className="px-5 py-2.5 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 active:bg-zinc-300 font-medium text-sm rounded-md transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
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
              <p className="text-[11px] text-zinc-500">
                Checks domain age, WHOIS integrity, SSL authority, and heuristic credential harvest patterns.
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
                placeholder="Paste SMS, phishing email body, or suspicious headers here..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-3 text-sm text-zinc-100 placeholder-zinc-500 font-mono focus:outline-none focus:border-zinc-600 transition resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 font-mono">
                  {inputVal.length} characters • NLP Coercion Filter
                </span>
                <button
                  onClick={handleAnalyze}
                  disabled={isScanning || !inputVal.trim()}
                  className="px-5 py-2 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-medium text-sm rounded-md transition flex items-center gap-2 cursor-pointer"
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
                className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 rounded-lg p-6 text-center cursor-pointer transition"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <UploadCloud className="w-6 h-6 text-zinc-400" />
                  <p className="text-xs font-medium text-zinc-300">
                    Click to select file or drag and drop
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    PDF, EML, DOCX, or executables up to 25MB
                  </p>
                </div>
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between p-3 rounded-md bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-zinc-400" />
                    <div>
                      <p className="text-xs font-medium text-zinc-200">{selectedFile}</p>
                      <p className="text-[11px] text-zinc-500 font-mono">Fake test file selected (1.2 MB)</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isScanning}
                    className="px-4 py-1.5 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-medium text-xs rounded-md transition flex items-center gap-1.5"
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
          <div className="p-3 rounded-md bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {actionNotice}
            </span>
            <button
              onClick={() => setActionNotice(null)}
              className="text-zinc-500 hover:text-zinc-300 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* RESULTS INTERFACE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-100">Analysis Verdict</h2>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Scan Duration: {report.scanTime}</span>
              <span>•</span>
              <span>ID: {report.id}</span>
            </div>
          </div>

          <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-6 space-y-6">
            {/* Top Metric & Target Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
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
                  <span className="text-xs font-mono text-zinc-500 uppercase">
                    [{report.type}]
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-zinc-200 break-all font-semibold">
                    {report.target}
                  </span>
                  <button
                    onClick={() => copyToClipboard(report.target)}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
                    title="Copy URL"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                  {report.summary}
                </p>
              </div>

              {/* Right: Human-Built Metric Card (No Heavy SVG Dials) */}
              <div className="p-4 rounded-md bg-zinc-950 border border-zinc-800 shrink-0 min-w-[200px] text-center md:text-right">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
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
                  <span className="text-zinc-500 font-mono text-sm">/ 100</span>
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
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Detected Evidence & Behavioral Indicators ({report.flags.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-md bg-zinc-950 border border-zinc-800/90 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
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
                    <p className="text-xs text-zinc-400 leading-normal">
                      {flag.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Metadata Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Domain & Network Telemetry
              </h3>
              <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[11px]">Domain Registration:</span>
                  <span className="text-zinc-200">{report.domainAge}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px]">SSL / TLS Certificate:</span>
                  <span className={report.severity === 'critical' ? 'text-red-400' : 'text-emerald-400'}>
                    {report.sslStatus}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px]">Resolved IP / Hosting ASN:</span>
                  <span className="text-zinc-300">{report.ipAddress}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px]">Incident Classification:</span>
                  <span className="text-zinc-300">{report.category}</span>
                </div>
              </div>
            </div>

            {/* Recommendations & Action Buttons */}
            <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-zinc-400 space-y-1">
                <span className="font-semibold text-zinc-300 block">Recommended Action:</span>
                <p className="text-[11px] text-zinc-400">{report.recommendations[0]}</p>
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
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition cursor-pointer"
                >
                  Whitelist
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition cursor-pointer"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-500 font-mono">
        ScamShield AI • Standalone Project Demo • No external backend required
      </footer>
    </div>
  );
}
