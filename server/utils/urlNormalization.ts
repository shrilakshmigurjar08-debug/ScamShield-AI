import { parse } from 'tldts';

export interface NormalizedUrlData {
  originalUrl: string;
  normalizedUrl: string;
  canonicalUrl: string;
  protocol: string;
  hostname: string;
  port?: string;
  subdomain: string;
  domain: string; // Registrable domain (e.g., "naukri-job.com" or "rbi.org.in")
  publicSuffix: string; // e.g., "com", "org.in", "gov.in"
  path: string;
  query: string;
  isPunycode: boolean;
  unicodeHostname: string;
}

/**
 * Normalizes URL and performs strict Public Suffix List (PSL) domain decomposition.
 */
export function normalizeAndDecomposeUrl(rawUrl: string): NormalizedUrlData {
  let raw = rawUrl.trim();
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
    raw = `http://${raw}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`Cannot parse URL: "${rawUrl}"`);
  }

  const protocol = parsed.protocol.toLowerCase();
  const rawHostname = parsed.hostname.toLowerCase();
  const isPunycode = rawHostname.startsWith('xn--') || rawHostname.includes('.xn--');

  // Convert Punycode to Unicode if applicable
  let unicodeHostname = rawHostname;
  try {
    unicodeHostname = new URL(`http://${rawHostname}`).hostname;
  } catch {}

  // Parse using Public Suffix List via tldts
  const tldResult = parse(rawHostname, { allowPrivateDomains: false });
  const domain = tldResult.domain || rawHostname;
  const subdomain = tldResult.subdomain || '';
  const publicSuffix = tldResult.publicSuffix || '';

  // Canonical normalized URL (strip default ports, normalize lowercase host)
  const portPart = (parsed.port === '80' && protocol === 'http:') || (parsed.port === '443' && protocol === 'https:') || !parsed.port
    ? '' 
    : `:${parsed.port}`;
  
  const normalizedUrl = `${protocol}//${rawHostname}${portPart}${parsed.pathname}${parsed.search}`;

  return {
    originalUrl: rawUrl,
    normalizedUrl,
    canonicalUrl: normalizedUrl,
    protocol,
    hostname: rawHostname,
    port: parsed.port || undefined,
    subdomain,
    domain,
    publicSuffix,
    path: parsed.pathname,
    query: parsed.search,
    isPunycode,
    unicodeHostname,
  };
}

export const normalizeAndParseUrl = normalizeAndDecomposeUrl;
