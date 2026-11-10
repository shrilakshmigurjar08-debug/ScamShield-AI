import { NormalizedUrlData } from '../utils/urlNormalization';
import { BrandMatchResult } from './brandDetection';
import { SslTelemetry } from './sslAnalysis';
import { DomainTelemetry } from './domainIntelligence';
import { InspectionTelemetry } from './safeInspection';
import { ThreatIntelligenceReport } from './threatIntelligence';
import { EvidenceItem, TelemetryData, ThreatResult, ThreatSeverity } from '../../src/types/threat';
import { isTrustedAuthoritativeDomain } from '../config/trustedDomains';

export interface ComprehensiveEvidenceBundle {
  urlData: NormalizedUrlData;
  brandResult: BrandMatchResult;
  sslResult: SslTelemetry;
  domainResult: DomainTelemetry;
  contentResult: InspectionTelemetry;
  threatIntel: ThreatIntelligenceReport;
  scanTimeMs: number;
}

export function calculateComprehensiveVerdict(bundle: ComprehensiveEvidenceBundle): ThreatResult {
  const { urlData, brandResult, sslResult, domainResult, contentResult, threatIntel, scanTimeMs } = bundle;
  const host = urlData.hostname;
  const evidenceList: EvidenceItem[] = [];

  let domainReputationScore = 5;
  let visualSimilarityScore = 0;
  let networkCloakingScore = 5;
  let nlpCoercionScore = 0;

  let totalRiskScore = 10; // Baseline healthy score
  let primaryThreatFactor = 'Clean Network Signature';
  let hasCriticalFlag = false;
  let hasHighFlag = false;

  const isTrustedWhitelisted = isTrustedAuthoritativeDomain(host) && brandResult.isAuthoritativeClean;

  // --------------------------------------------------------------------------
  // 1. BRAND IMPERSONATION EVALUATION
  // --------------------------------------------------------------------------
  if (brandResult.isImpersonating && brandResult.brand) {
    visualSimilarityScore = Math.round(brandResult.similarityScore * 100);

    if (brandResult.brand.isSovereignAuthority) {
      hasCriticalFlag = true;
      totalRiskScore = Math.max(totalRiskScore, 98);
      primaryThreatFactor = `Sovereign Authority Impersonation (${brandResult.brand.name})`;
      evidenceList.push({
        id: 'EV-SOVEREIGN-SPOOF',
        title: `Critical: Sovereign Authority Impersonation (${brandResult.brand.name})`,
        category: 'Brand Impersonation',
        severity: 'critical',
        description: brandResult.reason || `Unauthorized domain impersonating ${brandResult.brand.name}.`,
        technicalDetail: `Technique: ${brandResult.squatType || 'Combosquatting'} | Authorized: ${brandResult.authoritativeDomain}`,
        tag: 'SOVEREIGN_SPOOF',
      });
    } else {
      hasCriticalFlag = true;
      totalRiskScore = Math.max(totalRiskScore, 85);
      primaryThreatFactor = `Brand Impersonation (${brandResult.brand.name})`;
      evidenceList.push({
        id: 'EV-BRAND-SPOOF',
        title: `Brand Impersonation: ${brandResult.brand.name} [${brandResult.squatType || 'Combosquatting'}]`,
        category: 'Brand Impersonation',
        severity: 'critical',
        description: brandResult.reason || `Unsanctioned domain mimicking ${brandResult.brand.name}.`,
        technicalDetail: `Target: ${brandResult.authoritativeDomain} | Similarity: ${Math.round(brandResult.similarityScore * 100)}%`,
        tag: 'BRAND_SPOOF',
      });
    }
  } else if (brandResult.isAuthoritativeClean) {
    evidenceList.push({
      id: 'EV-BRAND-CLEAN',
      title: `Verified Official Infrastructure: ${brandResult.brand?.name || host}`,
      category: 'Brand Impersonation',
      severity: 'safe',
      description: `Domain is verified authentic digital property for ${brandResult.brand?.name}.`,
      technicalDetail: `Authoritative Domain: ${brandResult.authoritativeDomain}`,
      tag: 'OFFICIAL_DOMAIN',
    });
  }

  // --------------------------------------------------------------------------
  // 2. SSL / TLS CRYPTOGRAPHIC AUDIT
  // --------------------------------------------------------------------------
  if (!sslResult.valid) {
    hasCriticalFlag = true;
    networkCloakingScore = Math.max(networkCloakingScore, 85);
    totalRiskScore = Math.max(totalRiskScore, 78);

    evidenceList.push({
      id: 'EV-SSL-INVALID',
      title: `Untrusted or Defective SSL/TLS: ${sslResult.error || 'Handshake Failure'}`,
      category: 'Domain Intel',
      severity: 'critical',
      description: `Cryptographic handshake failed: ${sslResult.error || 'Untrusted TLS certificate'}. Modern services strictly enforce valid TLS.`,
      technicalDetail: `Cipher: ${sslResult.cipher || 'NONE'} | Issuer: ${sslResult.issuer}`,
      tag: 'TLS_COMPROMISE',
    });
  } else if (sslResult.isSelfSigned) {
    hasHighFlag = true;
    networkCloakingScore = Math.max(networkCloakingScore, 75);
    totalRiskScore = Math.max(totalRiskScore, 72);

    evidenceList.push({
      id: 'EV-SSL-SELFSIGNED',
      title: 'Untrusted Self-Signed Certificate Authority',
      category: 'Domain Intel',
      severity: 'high',
      description: 'The certificate is self-signed without verifiable root CA chain trust.',
      technicalDetail: `Issuer: ${sslResult.issuer}`,
      tag: 'SELF_SIGNED_CERT',
    });
  } else if (sslResult.isExpired) {
    hasCriticalFlag = true;
    totalRiskScore = Math.max(totalRiskScore, 82);
    evidenceList.push({
      id: 'EV-SSL-EXPIRED',
      title: 'Expired TLS Certificate',
      category: 'Domain Intel',
      severity: 'critical',
      description: `Certificate validity expired on ${sslResult.validTo}. Indicates abandoned or rogue deployment.`,
      technicalDetail: `Valid To: ${sslResult.validTo}`,
      tag: 'CERT_EXPIRED',
    });
  } else if (sslResult.hostnameMismatch) {
    hasCriticalFlag = true;
    totalRiskScore = Math.max(totalRiskScore, 88);
    evidenceList.push({
      id: 'EV-SSL-MISMATCH',
      title: 'TLS Certificate Hostname Mismatch (Rogue Domain)',
      category: 'Domain Intel',
      severity: 'critical',
      description: `Certificate CN/SAN does not match the requested hostname "${host}". Frequently indicates traffic hijacking.`,
      technicalDetail: `Subject: ${sslResult.subject}`,
      tag: 'HOSTNAME_MISMATCH',
    });
  } else {
    evidenceList.push({
      id: 'EV-SSL-VALID',
      title: 'Cryptographic TLS Handshake Verified',
      category: 'Domain Intel',
      severity: 'safe',
      description: `Valid TLS certificate issued by ${sslResult.issuer}. Expires in ${sslResult.daysRemaining} days.`,
      technicalDetail: `Protocol: ${sslResult.protocol} | Cipher: ${sslResult.cipher}`,
      tag: 'TLS_VERIFIED',
    });
  }

  // Cleartext HTTP check
  if (urlData.protocol === 'http:' && !isTrustedWhitelisted) {
    hasHighFlag = true;
    totalRiskScore = Math.max(totalRiskScore, 75);
    evidenceList.push({
      id: 'EV-PLAINTEXT-HTTP',
      title: 'Insecure Cleartext Protocol (Port 80 HTTP)',
      category: 'Domain Intel',
      severity: 'high',
      description: 'Communication is transmitted unencrypted over cleartext HTTP. Susceptible to eavesdropping and MITM tampering.',
      technicalDetail: 'Protocol: http: / Port 80',
      tag: 'CLEARTEXT_TRAFFIC',
    });
  }

  // --------------------------------------------------------------------------
  // 3. DOMAIN INTELLIGENCE & INFRASTRUCTURE
  // --------------------------------------------------------------------------
  if (domainResult.isDeadRecord) {
    hasCriticalFlag = true;
    domainReputationScore = Math.max(domainReputationScore, 90);
    totalRiskScore = Math.max(totalRiskScore, 85);
    evidenceList.push({
      id: 'EV-DNS-DEAD',
      title: 'NXDOMAIN / Burner Infrastructure (DNS Resolution Failure)',
      category: 'Domain Intel',
      severity: 'critical',
      description: `Domain "${host}" does not resolve to an active DNS A record (ENOTFOUND / NXDOMAIN). Typical of burned, taken-down, or disposable phishing lures.`,
      technicalDetail: `Status: ${domainResult.domainStatus.join(', ') || 'NXDOMAIN'}`,
      tag: 'BURNER_DOMAIN',
    });
  } else if (domainResult.ageDays !== undefined && domainResult.ageDays < 15 && !isTrustedWhitelisted) {
    hasCriticalFlag = true;
    domainReputationScore = Math.max(domainReputationScore, 85);
    totalRiskScore = Math.max(totalRiskScore, 80);
    evidenceList.push({
      id: 'EV-DOMAIN-NEWBORN',
      title: `Newly Provisioned Zero-Day Infrastructure (${domainResult.ageDays} days old)`,
      category: 'Domain Intel',
      severity: 'critical',
      description: `Domain was registered within the past ${domainResult.ageDays} days. Newly registered domains are disproportionately used for disposable fraud campaigns.`,
      technicalDetail: `Registered: ${domainResult.createdDate || 'Recent'} | Registrar: ${domainResult.registrar || 'Protected'}`,
      tag: 'NEWLY_REGISTERED',
    });
  } else if (domainResult.ageDays !== undefined && domainResult.ageDays < 60 && !isTrustedWhitelisted) {
    hasHighFlag = true;
    domainReputationScore = Math.max(domainReputationScore, 65);
    totalRiskScore = Math.max(totalRiskScore, 55);
    evidenceList.push({
      id: 'EV-DOMAIN-YOUNG',
      title: `Low Domain Age / Tenure (${domainResult.ageDays} days)`,
      category: 'Domain Intel',
      severity: 'high',
      description: `Domain registration tenure is under 60 days. Exercise heightened vigilance.`,
      technicalDetail: `Created: ${domainResult.createdDate || 'Recent'}`,
      tag: 'LOW_TENURE',
    });
  }

  // Risky TLD check
  if (domainResult.tldRisky && !isTrustedWhitelisted) {
    hasHighFlag = true;
    domainReputationScore = Math.max(domainReputationScore, 70);
    totalRiskScore = Math.max(totalRiskScore, 58);
    evidenceList.push({
      id: 'EV-TLD-RISK',
      title: `High-Risk Top-Level Domain (.${urlData.publicSuffix})`,
      category: 'Domain Intel',
      severity: 'high',
      description: `The .${urlData.publicSuffix} TLD has documented high prevalence of cybersquatting, disposable redirectors, and phishing campaigns due to cheap or unverified registration policies.`,
      technicalDetail: `Public Suffix: .${urlData.publicSuffix}`,
      tag: 'RISKY_TLD',
    });
  }

  // --------------------------------------------------------------------------
  // 4. CONTENT & SAFE INSPECTION HEURISTICS
  // --------------------------------------------------------------------------
  if (contentResult.isParkedDomain && !isTrustedWhitelisted) {
    hasHighFlag = true;
    totalRiskScore = Math.max(totalRiskScore, 65);
    evidenceList.push({
      id: 'EV-CONTENT-PARKED',
      title: 'Parked / Monetized Domain Placeholder',
      category: 'Network Cloaking',
      severity: 'high',
      description: 'Domain hosts a monetization parking page or ad-portal without legitimate business content.',
      technicalDetail: `Title: "${contentResult.pageTitle || 'N/A'}"`,
      tag: 'PARKED_DOMAIN',
    });
  }

  if (contentResult.hasCredentialHarvesting && !isTrustedWhitelisted) {
    hasCriticalFlag = true;
    nlpCoercionScore = Math.max(nlpCoercionScore, 90);
    totalRiskScore = Math.max(totalRiskScore, 90);
    evidenceList.push({
      id: 'EV-FORM-HARVEST',
      title: 'Credential Harvesting Vector (Password / Auth Form)',
      category: 'Payload Analysis',
      severity: 'critical',
      description: 'Target page contains interactive password input or login authentication forms on an unverified third-party host.',
      technicalDetail: 'Active <input type="password"> or login destination detected',
      tag: 'CREDENTIAL_HARVEST',
    });
  }

  // --------------------------------------------------------------------------
  // 5. THREAT INTELLIGENCE AGGREGATION (VT, GSB, PHISHTANK, OPENPHISH, URLHAUS)
  // --------------------------------------------------------------------------
  if (threatIntel.aggregatedVerdict === 'MALICIOUS') {
    hasCriticalFlag = true;
    totalRiskScore = Math.max(totalRiskScore, 95);
    primaryThreatFactor = 'Threat Intelligence Feeds Positive Match';
    evidenceList.push({
      id: 'EV-INTEL-MALICIOUS',
      title: `Global Threat Intelligence Hit (${threatIntel.detectionEnginesFlagged} Engines Flagged)`,
      category: 'Domain Intel',
      severity: 'critical',
      description: threatIntel.threatDetails.join(' | ') || 'Flagged by external threat intelligence providers.',
      technicalDetail: `VirusTotal positives: ${threatIntel.virusTotal.positives} | GSB: ${threatIntel.googleSafeBrowsing.status} | Phish: ${threatIntel.phishingFeeds.status}`,
      tag: 'INTEL_MALICIOUS',
    });
  } else if (threatIntel.aggregatedVerdict === 'SUSPICIOUS') {
    hasHighFlag = true;
    totalRiskScore = Math.max(totalRiskScore, 65);
    evidenceList.push({
      id: 'EV-INTEL-SUSPICIOUS',
      title: 'Elevated Threat Vendor Suspicion',
      category: 'Domain Intel',
      severity: 'high',
      description: threatIntel.threatDetails.join(' | ') || 'Flagged with suspicious reputation indicators.',
      technicalDetail: `Engines flagged: ${threatIntel.detectionEnginesFlagged}`,
      tag: 'INTEL_SUSPICIOUS',
    });
  }

  // --------------------------------------------------------------------------
  // 6. ZERO-CONTRADICTION CALIBRATION & SEVERITY ENFORCEMENT
  // --------------------------------------------------------------------------
  let finalSeverity: ThreatSeverity = 'safe';
  let threatCategory = 'Clean & Verified Infrastructure';

  if (isTrustedWhitelisted && !hasCriticalFlag) {
    totalRiskScore = Math.min(totalRiskScore, 8);
    finalSeverity = 'safe';
    threatCategory = 'Clean & Verified Infrastructure';
  } else if (hasCriticalFlag || totalRiskScore >= 70) {
    totalRiskScore = Math.min(Math.max(totalRiskScore, 75), 99);
    finalSeverity = 'critical';

    if (brandResult.isImpersonating && brandResult.brand?.isSovereignAuthority) {
      threatCategory = 'Sovereign Regulatory Impersonation Scam';
    } else if (brandResult.isImpersonating) {
      threatCategory = `${brandResult.brand?.name || 'Brand'} Impersonation Phishing`;
    } else if (threatIntel.aggregatedVerdict === 'MALICIOUS') {
      threatCategory = 'Confirmed Phishing / Malware Infrastructure';
    } else if (domainResult.isDeadRecord) {
      threatCategory = 'Burner Phishing Infrastructure (NXDOMAIN)';
    } else if (!sslResult.valid || sslResult.isExpired) {
      threatCategory = 'Compromised / Deceptive TLS Infrastructure';
    } else if (contentResult.hasCredentialHarvesting) {
      threatCategory = 'Credential Harvesting Vector';
    } else {
      threatCategory = 'Deceptive Phishing / Fraud Host';
    }
  } else if (hasHighFlag || totalRiskScore >= 40) {
    totalRiskScore = Math.min(Math.max(totalRiskScore, 42), 68);
    finalSeverity = 'high';
    threatCategory = 'Suspicious High-Risk Domain';
  } else if (totalRiskScore >= 20) {
    totalRiskScore = Math.min(Math.max(totalRiskScore, 20), 38);
    finalSeverity = 'medium';
    threatCategory = 'Unverified Low-Tenure Domain';
  } else {
    totalRiskScore = Math.min(totalRiskScore, 15);
    finalSeverity = 'safe';
    threatCategory = 'Clean & Verified Infrastructure';
  }

  // Strict Zero-Contradiction Rule Assertion:
  // If ANY critical flag exists, severity CANNOT be safe or medium!
  if (hasCriticalFlag && (finalSeverity === 'safe' || finalSeverity === 'medium')) {
    finalSeverity = 'critical';
    totalRiskScore = Math.max(totalRiskScore, 80);
  }

  const confidenceScore = brandResult.isImpersonating
    ? 98
    : sslResult.valid && domainResult.resolvedIps.length > 0
    ? 96
    : 92;

  const summary = finalSeverity === 'critical'
    ? `Critical Threat Detected: ${threatCategory} targeting "${host}". Forensics identified ${primaryThreatFactor} alongside anomalous infrastructure indicators.`
    : finalSeverity === 'high'
    ? `Elevated Risk: Forensics flagged multiple risk vectors for "${host}". Practice heightened caution.`
    : finalSeverity === 'medium'
    ? `Moderate Risk: Domain "${host}" displays unverified telemetry or low tenure. No active campaign matches found.`
    : `Authentic Infrastructure Verified: Domain "${host}" passed cryptographic TLS, DNS telemetry, and brand authentication checks.`;

  const telemetry: TelemetryData = {
    ipAddress: domainResult.resolvedIps[0] || 'Unresolved (NXDOMAIN)',
    asn: domainResult.asn || 'AS-DYNAMIC',
    hostingProvider: domainResult.hostingProvider || 'Standard Cloud / CDN',
    country: domainResult.country || 'Global',
    countryCode: domainResult.countryCode || 'GL',
    domainAge: domainResult.ageDays !== undefined ? `${domainResult.ageDays} days` : 'Lookup Inconclusive / Protected Privacy',
    registeredDate: domainResult.createdDate || 'Protected / Redacted',
    registrar: domainResult.registrar || 'Protected / Redacted',
    sslIssuer: sslResult.valid ? sslResult.issuer : `Untrusted / ${sslResult.error || 'No TLS'}`,
    sslValidity: sslResult.valid ? `Valid (${sslResult.daysRemaining}d left)` : 'Invalid / Insecure',
    sha256: domainResult.sha256 || 'N/A',
    redirectHops: contentResult.redirectHops || 0,
    enginesFlagged: threatIntel.detectionEnginesFlagged,
    totalEngines: threatIntel.totalDetectionEngines,
  };

  return {
    id: `SCAN-${Math.floor(1000 + Math.random() * 9000)}`,
    target: host,
    targetType: 'url',
    timestamp: new Date().toISOString(),
    riskScore: totalRiskScore,
    severity: finalSeverity,
    threatCategory,
    impersonatedBrand: brandResult.brand?.name,
    confidenceScore,
    verdictTime: `${(scanTimeMs / 1000).toFixed(2)}s`,
    summary,
    evidence: evidenceList,
    telemetry,
    vectorScores: {
      domainReputation: domainReputationScore,
      nlpCoercion: nlpCoercionScore,
      networkCloaking: networkCloakingScore,
      visualSimilarity: visualSimilarityScore,
    },
  };
}

