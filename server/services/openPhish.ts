/**
 * OpenPhish Global Phishing Feed Client & Cache
 */

let cachedOpenPhishUrls: Set<string> = new Set();
let lastFeedFetch = 0;
const FEED_TTL = 15 * 60 * 1000; // 15 mins

export interface OpenPhishResult {
  status: 'MALICIOUS' | 'NOT_LISTED' | 'SERVICE_UNAVAILABLE';
  isPhishing: boolean;
  feedLastUpdated?: string;
  details?: string;
}

export async function queryOpenPhish(targetUrl: string): Promise<OpenPhishResult> {
  const now = Date.now();
  const cleanUrl = targetUrl.toLowerCase().trim().replace(/\/$/, '');

  // Fetch / Refresh Feed
  if (now - lastFeedFetch > FEED_TTL || cachedOpenPhishUrls.size === 0) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4500);

      const res = await fetch('https://openphish.com/feed.txt', {
        signal: controller.signal,
        headers: { 'User-Agent': 'ScamShield-AI-Feed/3.0' },
      });
      clearTimeout(timeout);

      if (res.ok) {
        const text = await res.text();
        const urls = text.split('\n').map(u => u.trim().toLowerCase()).filter(Boolean);
        cachedOpenPhishUrls = new Set(urls);
        lastFeedFetch = now;
      }
    } catch {
      // If network fails, retain cached entries
    }
  }

  if (cachedOpenPhishUrls.size === 0) {
    return { status: 'SERVICE_UNAVAILABLE', isPhishing: false };
  }

  // Exact match or domain containment match
  let matched = cachedOpenPhishUrls.has(cleanUrl);
  if (!matched) {
    try {
      const host = new URL(cleanUrl.startsWith('http') ? cleanUrl : `http://${cleanUrl}`).hostname;
      for (const flagged of cachedOpenPhishUrls) {
        if (flagged.includes(host)) {
          matched = true;
          break;
        }
      }
    } catch {}
  }

  return {
    status: matched ? 'MALICIOUS' : 'NOT_LISTED',
    isPhishing: matched,
    feedLastUpdated: new Date(lastFeedFetch).toISOString(),
    details: matched ? `Identified in active OpenPhish zero-day phishing telemetry` : undefined,
  };
}

export const checkOpenPhishFeed = queryOpenPhish;
