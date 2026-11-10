# ScamShield AI 🛡️
### Real-Time Website Fraud Detection, Brand Forensics & Threat Intelligence Platform

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/Tests-13%2F13%20Passing-success.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)]()
[![Vercel](https://img.shields.io/badge/Vercel-Serverless%20Ready-black.svg)]()
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20RLS-emerald.svg)]()

**ScamShield AI** is an enterprise-grade cybersecurity platform that executes real-time digital forensics to detect zero-day phishing sites, brand impersonation scams, typosquatting lures, deceptive SMS/emails, and malicious file payloads.

Instead of relying on synthetic mock data or static keyword lists, ScamShield AI performs **active live network probes**: cryptographic socket TLS handshakes, recursive DNS resolution, authoritative RDAP registry audits, SSRF-protected content inspection, parallel global threat feed lookups, and generative AI deception reasoning.

---

## ⚡ Core Forensic Engines

### 1. Advanced Brand Impersonation & Combosquatting Engine
- **Algorithms**: Jaro-Winkler similarity, Levenshtein distance, Damerau-Levenshtein, homoglyph normalization, punycode decoding, and Public Suffix List (PSL) domain decomposition (`tldts`).
- **Combosquatting & TLD Squatting**: Flags trademark hijacking across alternative extensions (e.g., `flipkart.biz`, `naukri-job.com`, `paypal-verification.com`).
- **Sovereign & Regulatory Protection**: Zero-tolerance policy protecting sovereign authorities (*Reserve Bank of India, SEBI, Income Tax Department, UIDAI, EPFO, NPCI, Government of India, IRCTC, IRS, SEC*).

### 2. Cryptographic Socket TLS & SSL Audit
- Connects directly on port 443 with SNI to inspect the peer certificate.
- Detects expired certificates (e.g., `CERT_HAS_EXPIRED`), self-signed certificates without root CA chain trust, and hostname mismatches (`ERR_TLS_CERT_ALTNAME_INVALID`).

### 3. Recursive DNS & Authoritative RDAP Intelligence
- Resolves DNS `A`, `MX`, and `NS` records in real time.
- Queries authoritative regional registries (*Verisign, PIR .org, Identity Digital, Nic.biz*) to verify domain registration age and tenure.
- Automatically identifies disposable **burner domains** (`ENOTFOUND` / NXDOMAIN) and high-risk top-level domains (`.xyz`, `.top`, `.buzz`, `.click`).

### 4. Global Threat Intelligence Integration
Pings multiple real-time security providers in parallel:
- **VirusTotal API v3**: Aggregates detection telemetry across 70+ antivirus and cybersecurity engines.
- **Google Safe Browsing API v4**: Real-time malware, social engineering, and unwanted software matching.
- **OpenPhish Zero-Day Feed**: Community-curated real-time active phishing URL feed.
- **Abuse.ch URLhaus**: Verified malware URL distribution feeds.
- **PhishTank**: Community-verified phishing database lookup.

### 5. Safe Website Content Inspection with SSRF Protection
- **SSRF Defense**: Strictly blocks private IPv4/IPv6 ranges (RFC 1918, 127.0.0.0/8, 169.254.169.254 cloud metadata, link-local, multicast) and non-HTTP protocols before connection.
- **Safe Sandboxing**: Extracts page `<title>`, meta descriptions, detects parking/coming-soon placeholders, and flags unverified credential harvesting forms (`<input type="password">`) without executing untrusted JavaScript.

### 6. AI-Powered Semantic NLP Deception Analysis
- Integrated with **Google Gemini 1.5/2.5 Flash** for generative linguistic intent analysis.
- Flags psychological coercion, false deadlines ("account suspended within 24 hours"), and sensitive PII / OTP harvesting in emails and SMS messages.

### 7. Zero-Contradiction Calibrated Risk Scoring Matrix
- Transparent 0–100 risk score calibrated into 4 distinct severity tiers:
  - **Low / Safe** (`0–19`)
  - **Moderate** (`20–39`)
  - **High / Suspicious** (`40–69`)
  - **Critical / Malicious** (`70–100`)
- **Strict Zero-Contradiction Rule**: Under no condition can a domain with critical threat indicators (expired TLS cert, sovereign authority impersonation, phishing feed hit, or NXDOMAIN burner status) be marked as `safe` or display "Clean & Verified".

---

## 🛠️ Architecture & Tech Stack

```mermaid
flowchart TD
    Client["React 19 Frontend<br/>(Tailwind CSS v4 + Lucide)"] --> Proxy["Express / Vercel Serverless API"]
    Proxy --> SSRF["SSRF & Security Validation"]
    SSRF --> Engine["ScamShield Forensics Orchestrator"]
    
    subgraph Forensics Pipeline
        Engine --> TLS["Active Socket TLS Handshake"]
        Engine --> DNS["DNS & RDAP Registry (tldts)"]
        Engine --> Brand["Brand & Combosquatting Engine"]
        Engine --> Content["Safe HTTP Sandbox Inspector"]
        Engine --> Threat["Threat Intel (VT + GSB + OpenPhish + URLhaus)"]
        Engine --> AI["Google Gemini NLP Semantic Engine"]
    end
    
    Forensics Pipeline --> Scoring["Calibrated Zero-Contradiction Risk Scoring"]
    Scoring --> DB[("Supabase PostgreSQL<br/>(scan_history + scan_evidence)")]
    Scoring --> Response["Structured ThreatResult Payload"]
    Response --> Client
```

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, `tls`, `dns`, `tldts`, `@supabase/supabase-js`.
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) policies and UUID primary keys.
- **Deployment**: Vercel Serverless Functions (`api/verify-url.ts`, `api/scan-status.ts`, `api/cron/update-threat-feeds.ts`).

---

## 📦 Project Structure

```text
ScamShield-AI/
├── api/                             # Vercel Serverless Endpoints
│   ├── verify-url.ts                # Real-time URL forensics handler
│   ├── scan-status.ts               # Scan polling & retrieval
│   └── cron/
│       └── update-threat-feeds.ts   # Scheduled threat feed synchronization
├── server/                          # Modular Backend Forensics Architecture
│   ├── services/
│   │   ├── brandDetection.ts        # Jaro-Winkler, Levenshtein, combosquatting
│   │   ├── domainIntelligence.ts    # Recursive DNS & RDAP registry queries
│   │   ├── sslAnalysis.ts           # Deep socket TLS certificate audit
│   │   ├── safeInspection.ts        # Controlled SSRF-protected HTTP probe
│   │   ├── threatIntelligence.ts    # Multi-source threat intel aggregator
│   │   ├── virusTotal.ts            # VirusTotal API v3 client
│   │   ├── googleSafeBrowsing.ts    # Google Safe Browsing API v4 client
│   │   ├── openPhish.ts             # OpenPhish zero-day live feed client
│   │   ├── urlHaus.ts               # Abuse.ch URLhaus API client
│   │   ├── phishingDetection.ts     # Phishing feed aggregator
│   │   ├── aiTextAnalysis.ts        # Google Gemini NLP deception engine
│   │   └── riskScoring.ts           # Zero-contradiction calibrated risk scoring
│   ├── utils/
│   │   ├── security.ts              # SSRF protection, private IP / cloud metadata block
│   │   ├── urlNormalization.ts      # Public Suffix List (PSL) parsing & punycode
│   │   ├── cache.ts                 # High-performance TTL memory cache
│   │   └── logger.ts                # Structured forensic logger
│   └── config/
│       ├── brands.ts                # Verified brand registry
│       ├── trustedDomains.ts        # Trusted root domain whitelist
│       └── supabase.ts              # Supabase PostgreSQL client & offline fallback
├── src/                             # React 19 Client Dashboard
│   ├── components/                  # UI components (HeroScanner, ResultsInterface, etc.)
│   ├── types/threat.ts              # Canonical ThreatResult interfaces
│   └── App.tsx                      # Primary application entrypoint
├── supabase/
│   └── migrations/                  # PostgreSQL schema definitions & RLS policies
│       └── 20261110_init_scamshield_schema.sql
├── tests/
│   └── engine.test.ts               # Automated forensic regression test suite
├── vercel.json                      # Vercel deployment routing & cron jobs
└── server.ts                        # Local development Express server
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
```bash
git clone https://github.com/shrilakshmigurjar08-debug/ScamShield-AI.git
cd ScamShield-AI
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your API keys in `.env`:
```env
PORT=3001

# Threat Intelligence APIs (Optional - live socket & RDAP probes work without them)
VIRUSTOTAL_API_KEY=your_virustotal_key
GOOGLE_SAFE_BROWSING_API_KEY=your_google_safe_browsing_key

# AI Semantic NLP Deception Analysis
GEMINI_API_KEY=your_gemini_api_key

# Supabase PostgreSQL Database (Optional - runs in-memory if unconfigured)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key
SUPABASE_ANON_KEY=your_publishable_anon_key

# Security & Cron
CRON_SECRET=scamshield_secure_cron_secret
```

### 4. Database Setup (Supabase)
If using Supabase, copy the migration script from:
[`supabase/migrations/20261110_init_scamshield_schema.sql`](supabase/migrations/20261110_init_scamshield_schema.sql)
into your Supabase project's **SQL Editor** and click **Run**.

### 5. Running the Application
To run both the backend forensics engine and the React Vite frontend concurrently:
```bash
npm run dev:all
```
- **Frontend UI**: [http://localhost:5173](http://localhost:5173)
- **Backend Forensics API**: [http://127.0.0.1:3001](http://127.0.0.1:3001)

---

## 🧪 Automated Testing

ScamShield AI includes a forensic regression test suite verifying SSRF boundary protection, combosquatting, sovereign authority exemptions, TLS socket validation, and zero-contradiction scoring:

```bash
npm test
```

```text
🧪 Starting ScamShield AI Comprehensive Forensic Engine Test Suite...

  ✅ PASS: SSRF: Blocks loopback IPv4 (127.0.0.1)
  ✅ PASS: SSRF: Blocks AWS/Cloud metadata (169.254.169.254)
  ✅ PASS: SSRF: Blocks private RFC 1918 range (10.0.0.1)
  ✅ PASS: SSRF: Blocks invalid protocol schemes (file://, gopher://)
  ✅ PASS: URL Normalization: Strict Public Suffix parsing (naukri-job.com)
  ✅ PASS: URL Normalization: Handles multi-part suffixes (rbi.org.in)
  ✅ PASS: Brand Engine: Recognizes authentic domain (rbi.org.in)
  ✅ PASS: Brand Engine: Flags Sovereign Regulatory Spoofing (rbi.org)
  ✅ PASS: Brand Engine: Flags Combosquatting (www.naukri-job.com)
  ✅ PASS: Brand Engine: Flags TLD Squatting (flipkart.biz)
  ✅ PASS: Brand Engine: Subdomain spoofing detection (paypal.com.attacker.com)
  ✅ PASS: Risk Scoring: Strict Zero-Contradiction Rule Assertion
  ✅ PASS: AI NLP Analysis: Accurately flags urgency and PII harvesting

=========================================
Test Results: 13 passed, 0 failed
=========================================
```

---

## 🌐 API Reference

### 1. URL Forensic Verification
```http
POST /api/scan/url
Content-Type: application/json

{
  "url": "www.naukri-job.com"
}
```

**Response Payload**:
```json
{
  "id": "SCAN-4821",
  "target": "www.naukri-job.com",
  "targetType": "url",
  "timestamp": "2026-11-10T13:37:10.836Z",
  "riskScore": 85,
  "severity": "critical",
  "threatCategory": "Naukri.com (Info Edge) Impersonation Phishing",
  "impersonatedBrand": "Naukri.com (Info Edge)",
  "confidenceScore": 98,
  "verdictTime": "0.94s",
  "summary": "Critical Threat Detected: Naukri.com (Info Edge) Impersonation Phishing targeting \"www.naukri-job.com\".",
  "evidence": [
    {
      "id": "EV-BRAND-SPOOF",
      "title": "Brand Impersonation: Naukri.com (Info Edge) [Combosquatting]",
      "category": "Brand Impersonation",
      "severity": "critical",
      "description": "Combosquatting detected: \"naukri-job.com\" embeds trademark \"Naukri.com (Info Edge)\" alongside unauthorized keywords.",
      "technicalDetail": "Target: naukri.com | Similarity: 92%",
      "tag": "BRAND_SPOOF"
    }
  ],
  "telemetry": {
    "ipAddress": "76.223.105.230",
    "asn": "AS16509 Amazon.com, Inc.",
    "hostingProvider": "AWS Global Accelerator",
    "country": "United States",
    "domainAge": "216 days",
    "sslIssuer": "GoDaddy.com",
    "sslValidity": "Valid (162d left)",
    "enginesFlagged": 0,
    "totalEngines": 72
  }
}
```

### 2. AI Semantic Text / SMS Analysis
```http
POST /api/scan/text
Content-Type: application/json

{
  "text": "URGENT: Your SBI account has been suspended due to pending KYC verification. Verify credentials within 24 hours at http://sbi-kyc.com"
}
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
