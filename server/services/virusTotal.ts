/**
 * VirusTotal API v3 Threat Intelligence Client
 */

export interface VirusTotalResult {
  status: 'CLEAN' | 'MALICIOUS' | 'SUSPICIOUS' | 'NOT_LISTED' | 'SERVICE_UNAVAILABLE';
  flaggedCount: number;
  totalEngines: number;
  maliciousCount: number;
  suspiciousCount: number;
  harmlessCount: number;
  categories: Record<string, string>;
  lastAnalysisDate?: string;
  reputationScore?: number;
}

export async function queryVirusTotal(urlOrHash: string, apiKey?: string): Promise<VirusTotalResult> {
  const key = apiKey || process.env.VIRUSTOTAL_API_KEY;
  if (!key) {
    return {
      status: 'SERVICE_UNAVAILABLE',
      flaggedCount: 0,
      totalEngines: 0,
      maliciousCount: 0,
      suspiciousCount: 0,
      harmlessCount: 0,
      categories: {},
    };
  }

  try {
    const isUrl = urlOrHash.startsWith('http') || urlOrHash.includes('.');
    // Base64URL identifier without padding
    const urlId = Buffer.from(urlOrHash).toString('base64url');
    const endpoint = isUrl
      ? `https://www.virustotal.com/api/v3/urls/${urlId}`
      : `https://www.virustotal.com/api/v3/files/${urlOrHash}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        'x-apikey': key,
        'Accept': 'application/json',
      },
    });
    clearTimeout(timeout);

    if (res.status === 404) {
      return {
        status: 'NOT_LISTED',
        flaggedCount: 0,
        totalEngines: 0,
        maliciousCount: 0,
        suspiciousCount: 0,
        harmlessCount: 0,
        categories: {},
      };
    }

    if (!res.ok) {
      return {
        status: 'SERVICE_UNAVAILABLE',
        flaggedCount: 0,
        totalEngines: 0,
        maliciousCount: 0,
        suspiciousCount: 0,
        harmlessCount: 0,
        categories: {},
      };
    }

    const data: any = await res.json();
    const stats = data.data?.attributes?.last_analysis_stats || {};
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const harmless = (stats.harmless || 0) + (stats.undetected || 0);
    const total = Object.values(stats).reduce((a: any, b: any) => a + b, 0) as number;
    const flagged = malicious + suspicious;

    const results = data.data?.attributes?.last_analysis_results || {};
    const categories: Record<string, string> = {};
    for (const [vendor, vData] of Object.entries<any>(results)) {
      if (vData.category === 'malicious' || vData.category === 'suspicious') {
        categories[vendor] = vData.result || vData.category;
      }
    }

    let status: VirusTotalResult['status'] = 'CLEAN';
    if (malicious >= 3 || flagged >= 5) {
      status = 'MALICIOUS';
    } else if (flagged > 0) {
      status = 'SUSPICIOUS';
    }

    return {
      status,
      flaggedCount: flagged,
      totalEngines: total || 72,
      maliciousCount: malicious,
      suspiciousCount: suspicious,
      harmlessCount: harmless,
      categories,
      lastAnalysisDate: data.data?.attributes?.last_analysis_date
        ? new Date(data.data.attributes.last_analysis_date * 1000).toISOString()
        : undefined,
      reputationScore: data.data?.attributes?.reputation,
    };
  } catch (err) {
    return {
      status: 'SERVICE_UNAVAILABLE',
      flaggedCount: 0,
      totalEngines: 0,
      maliciousCount: 0,
      suspiciousCount: 0,
      harmlessCount: 0,
      categories: {},
    };
  }
}

