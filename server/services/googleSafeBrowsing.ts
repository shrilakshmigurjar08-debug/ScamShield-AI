/**
 * Google Safe Browsing Lookup API v4 Client
 */

export interface GoogleSafeBrowsingResult {
  status: 'CLEAN' | 'MALICIOUS' | 'NOT_LISTED' | 'SERVICE_UNAVAILABLE';
  isThreat?: boolean;
  threatTypes: string[];
  platformTypes: string[];
  matchedUrl?: string;
}

export async function queryGoogleSafeBrowsing(targetUrl: string, apiKey?: string): Promise<GoogleSafeBrowsingResult> {
  const key = apiKey || process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  if (!key) {
    return {
      status: 'SERVICE_UNAVAILABLE',
      threatTypes: [],
      platformTypes: [],
    };
  }

  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${key}`;

  const requestBody = {
    client: {
      clientId: 'scamshield-ai-enterprise',
      clientVersion: '3.0.0',
    },
    threatInfo: {
      threatTypes: [
        'MALWARE',
        'SOCIAL_ENGINEERING',
        'UNWANTED_SOFTWARE',
        'POTENTIALLY_HARMFUL_APPLICATION',
      ],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [{ url: targetUrl }],
    },
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        status: 'SERVICE_UNAVAILABLE',
        threatTypes: [],
        platformTypes: [],
      };
    }

    const data: any = await res.json();
    const matches = data.matches || [];

    if (matches.length > 0) {
      const threatTypes = matches.map((m: any) => m.threatType);
      const platformTypes = matches.map((m: any) => m.platformType);
      return {
        status: 'MALICIOUS',
        isThreat: true,
        threatTypes,
        platformTypes,
        matchedUrl: matches[0].threat?.url,
      };
    }

    return {
      status: 'CLEAN',
      isThreat: false,
      threatTypes: [],
      platformTypes: [],
    };
  } catch (err) {
    return {
      status: 'SERVICE_UNAVAILABLE',
      isThreat: false,
      threatTypes: [],
      platformTypes: [],
    };
  }
}

export const checkGoogleSafeBrowsing = queryGoogleSafeBrowsing;
