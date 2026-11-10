/**
 * Abuse.ch URLhaus API Client
 */

export interface UrlHausResult {
  status: 'MALICIOUS' | 'NOT_LISTED' | 'SERVICE_UNAVAILABLE';
  isMalicious?: boolean;
  threat?: string;
  threatType?: string;
  urlStatus?: string;
  reporter?: string;
  tags?: string[];
  dateAdded?: string;
}

export async function queryUrlHaus(targetUrl: string): Promise<UrlHausResult> {
  const endpoint = 'https://urlhaus-api.abuse.ch/v1/url/';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const form = new URLSearchParams();
    form.append('url', targetUrl);

    const res = await fetch(endpoint, {
      method: 'POST',
      signal: controller.signal,
      body: form,
      headers: { 'User-Agent': 'ScamShield-AI-Lookup/3.0' },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { status: 'SERVICE_UNAVAILABLE' };
    }

    const data: any = await res.json();

    if (data.query_status === 'ok') {
      return {
        status: 'MALICIOUS',
        isMalicious: true,
        threat: data.threat,
        threatType: data.threat,
        reporter: data.reporter,
        urlStatus: data.url_status,
        tags: data.tags || [],
        dateAdded: data.date_added,
      };
    }

    if (data.query_status === 'no_results') {
      return { status: 'NOT_LISTED', isMalicious: false };
    }

    return { status: 'SERVICE_UNAVAILABLE', isMalicious: false };
  } catch {
    return { status: 'SERVICE_UNAVAILABLE', isMalicious: false };
  }
}

export const checkUrlHaus = queryUrlHaus;
