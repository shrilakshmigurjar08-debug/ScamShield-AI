import { checkOpenPhishFeed, OpenPhishResult } from './openPhish';
import { checkUrlHaus, UrlHausResult } from './urlHaus';
import { createLogger } from '../utils/logger';

const logger = createLogger('phishingDetection');

export interface PhishingFeedAggregateResult {
  isPhishing: boolean;
  status: 'CLEAN' | 'MALICIOUS' | 'SUSPICIOUS' | 'NOT_LISTED' | 'SERVICE_UNAVAILABLE';
  sourcesFlagged: string[];
  details: string[];
  openPhish?: OpenPhishResult;
  urlHaus?: UrlHausResult;
}

/**
 * PhishTank API or community mirror verification
 */
export async function checkPhishTank(targetUrl: string): Promise<{ isListed: boolean; status: string; details?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    // PhishTank public verification endpoint (or community feed check)
    const response = await fetch('https://checkurl.phishtank.com/checkurl/', {
      method: 'POST',
      headers: {
        'User-Agent': 'phishtank/ScamShield-AI-1.0',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `url=${encodeURIComponent(targetUrl)}&format=json`,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { isListed: false, status: 'SERVICE_UNAVAILABLE' };
    }

    const data: any = await response.json();
    if (data?.results?.in_database && data?.results?.valid) {
      return {
        isListed: true,
        status: 'MALICIOUS',
        details: `PhishTank verified phishing target (ID: ${data.results.phish_id}, verified: ${data.results.verified})`,
      };
    }

    return { isListed: false, status: 'NOT_LISTED' };
  } catch (error: any) {
    logger.debug('PhishTank check non-blocking fail or timeout', { error: error.message });
    return { isListed: false, status: 'SERVICE_UNAVAILABLE' };
  }
}

/**
 * Aggregates all live zero-day phishing feeds: OpenPhish, URLhaus, and PhishTank.
 */
export async function evaluatePhishingFeeds(targetUrl: string): Promise<PhishingFeedAggregateResult> {
  const [openPhishRes, urlHausRes, phishTankRes] = await Promise.allSettled([
    checkOpenPhishFeed(targetUrl),
    checkUrlHaus(targetUrl),
    checkPhishTank(targetUrl),
  ]);

  const sourcesFlagged: string[] = [];
  const details: string[] = [];
  let isMalicious = false;

  if (openPhishRes.status === 'fulfilled' && openPhishRes.value.isPhishing) {
    isMalicious = true;
    sourcesFlagged.push('OpenPhish Zero-Day Feed');
    details.push(openPhishRes.value.details || 'Identified in OpenPhish real-time feed');
  }

  if (urlHausRes.status === 'fulfilled' && urlHausRes.value.isMalicious) {
    isMalicious = true;
    sourcesFlagged.push(`URLhaus (${urlHausRes.value.threatType || 'Malware'})`);
    if (urlHausRes.value.reporter) {
      details.push(`Reported by ${urlHausRes.value.reporter} with status: ${urlHausRes.value.status}`);
    }
  }

  if (phishTankRes.status === 'fulfilled' && phishTankRes.value.isListed) {
    isMalicious = true;
    sourcesFlagged.push('PhishTank Verified Phishing');
    if (phishTankRes.value.details) {
      details.push(phishTankRes.value.details);
    }
  }

  return {
    isPhishing: isMalicious,
    status: isMalicious ? 'MALICIOUS' : 'NOT_LISTED',
    sourcesFlagged,
    details,
    openPhish: openPhishRes.status === 'fulfilled' ? openPhishRes.value : undefined,
    urlHaus: urlHausRes.status === 'fulfilled' ? urlHausRes.value : undefined,
  };
}

