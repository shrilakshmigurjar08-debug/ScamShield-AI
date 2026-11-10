import { queryVirusTotal, VirusTotalAnalysis } from './virusTotal';
import { checkGoogleSafeBrowsing, GoogleSafeBrowsingResult } from './googleSafeBrowsing';
import { evaluatePhishingFeeds, PhishingFeedAggregateResult } from './phishingDetection';
import { threatCache } from '../utils/cache';
import { createLogger } from '../utils/logger';

const logger = createLogger('threatIntelligence');

export interface ThreatIntelligenceReport {
  timestamp: string;
  targetUrl: string;
  cached: boolean;
  virusTotal: VirusTotalAnalysis;
  googleSafeBrowsing: GoogleSafeBrowsingResult;
  phishingFeeds: PhishingFeedAggregateResult;
  aggregatedVerdict: 'MALICIOUS' | 'SUSPICIOUS' | 'CLEAN' | 'UNKNOWN';
  detectionEnginesFlagged: number;
  totalDetectionEngines: number;
  threatDetails: string[];
}

export async function aggregateThreatIntelligence(
  targetUrl: string,
  vtApiKey?: string,
  gsbApiKey?: string
): Promise<ThreatIntelligenceReport> {
  const cacheKey = `threat_intel:${targetUrl}`;
  const cached = threatCache.get<ThreatIntelligenceReport>(cacheKey);
  if (cached) {
    logger.debug('Returning cached threat intelligence report', { targetUrl });
    return { ...cached, cached: true };
  }

  logger.info('Executing live multi-source threat intelligence lookup', { targetUrl });

  const [vtResult, gsbResult, phishResult] = await Promise.all([
    queryVirusTotal(targetUrl, vtApiKey),
    checkGoogleSafeBrowsing(targetUrl, gsbApiKey),
    evaluatePhishingFeeds(targetUrl),
  ]);

  let totalEngines = 72; // Baseline industry benchmark for aggregated VT + GSB + community engines
  let enginesFlagged = 0;
  const threatDetails: string[] = [];

  // VirusTotal evaluation
  if (vtResult.status === 'MALICIOUS' || vtResult.status === 'SUSPICIOUS') {
    enginesFlagged += vtResult.positives;
    totalEngines = Math.max(totalEngines, vtResult.total);
    if (vtResult.positives > 0) {
      threatDetails.push(`VirusTotal: ${vtResult.positives}/${vtResult.total} security vendors flagged this destination`);
    }
  }

  // Google Safe Browsing evaluation
  if (gsbResult.isThreat) {
    enginesFlagged += 1;
    threatDetails.push(`Google Safe Browsing: Identified as ${gsbResult.threatTypes.join(', ')}`);
  }

  // Live Phishing Feeds evaluation (OpenPhish / URLhaus / PhishTank)
  if (phishResult.isPhishing) {
    enginesFlagged += phishResult.sourcesFlagged.length;
    threatDetails.push(...phishResult.details);
  }

  let aggregatedVerdict: 'MALICIOUS' | 'SUSPICIOUS' | 'CLEAN' | 'UNKNOWN' = 'CLEAN';
  if (vtResult.status === 'MALICIOUS' || gsbResult.isThreat || phishResult.isPhishing) {
    aggregatedVerdict = 'MALICIOUS';
  } else if (vtResult.status === 'SUSPICIOUS' || vtResult.positives > 0) {
    aggregatedVerdict = 'SUSPICIOUS';
  } else if (
    vtResult.status === 'SERVICE_UNAVAILABLE' &&
    gsbResult.status === 'SERVICE_UNAVAILABLE' &&
    phishResult.sourcesFlagged.length === 0
  ) {
    aggregatedVerdict = 'UNKNOWN';
  }

  const report: ThreatIntelligenceReport = {
    timestamp: new Date().toISOString(),
    targetUrl,
    cached: false,
    virusTotal: vtResult,
    googleSafeBrowsing: gsbResult,
    phishingFeeds: phishResult,
    aggregatedVerdict,
    detectionEnginesFlagged: enginesFlagged,
    totalDetectionEngines: totalEngines,
    threatDetails,
  };

  // Cache for 15 minutes
  threatCache.set(cacheKey, report, 900);
  return report;
}

