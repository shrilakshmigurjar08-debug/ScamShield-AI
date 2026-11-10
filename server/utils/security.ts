import net from 'net';
import dns from 'dns';

/**
 * Checks if an IPv4 address is in a private, loopback, or cloud metadata range.
 */
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return true; // Malformed IP treated as dangerous
  }

  const [a, b] = parts;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;
  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;
  // 10.0.0.0/8 (Private)
  if (a === 10) return true;
  // 172.16.0.0/12 (Private)
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.168.0.0/16 (Private)
  if (a === 192 && b === 168) return true;
  // 169.254.0.0/16 (Link-local & AWS/GCP Metadata 169.254.169.254)
  if (a === 169 && b === 254) return true;
  // 100.64.0.0/10 (Carrier-grade NAT)
  if (a === 100 && b >= 64 && b <= 127) return true;
  // 198.18.0.0/15 (Benchmarking)
  if (a === 198 && (b === 18 || b === 19)) return true;
  // 224.0.0.0/4 (Multicast)
  if (a >= 224) return true;

  return false;
}

/**
 * Checks if an IPv6 address is loopback, unique local, or link-local.
 */
function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  // ::1 loopback
  if (normalized === '::1' || normalized === '0:0:0:0:0:0:0:1') return true;
  // fc00::/7 (Unique local address)
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
  // fe80::/10 (Link-local unicast)
  if (normalized.startsWith('fe8') || normalized.startsWith('fe9') || normalized.startsWith('fea') || normalized.startsWith('feb')) return true;
  // IPv4 mapped IPv6 (::ffff:127.0.0.1)
  if (normalized.includes('::ffff:')) {
    const v4 = normalized.split('::ffff:')[1];
    if (v4 && net.isIPv4(v4)) return isPrivateIPv4(v4);
  }
  return false;
}

/**
 * Validate that an IP address is a safe public routable destination.
 */
export function isSafePublicIP(ip: string): boolean {
  if (net.isIPv4(ip)) {
    return !isPrivateIPv4(ip);
  }
  if (net.isIPv6(ip)) {
    return !isPrivateIPv6(ip);
  }
  return false;
}

/**
 * Validates a target URL against SSRF attacks, private networks, and invalid schemes.
 */
export async function validateSafePublicUrl(targetUrl: string): Promise<{
  safe: boolean;
  hostname: string;
  resolvedIp?: string;
  reason?: string;
}> {
  let parsed: URL;
  try {
    const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(targetUrl) || targetUrl.startsWith('javascript:');
    const raw = hasScheme ? targetUrl : `http://${targetUrl}`;
    parsed = new URL(raw);
  } catch {
    return { safe: false, hostname: '', reason: 'Invalid URL structure' };
  }

  // 1. Scheme Validation
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { safe: false, hostname: parsed.hostname, reason: `Forbidden scheme: ${parsed.protocol}` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 2. Reject localhost literals
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal')
  ) {
    return { safe: false, hostname, reason: 'Access to loopback/local domains is forbidden' };
  }

  // 3. If hostname is a raw IP literal
  if (net.isIP(hostname)) {
    if (!isSafePublicIP(hostname)) {
      return { safe: false, hostname, reason: `Private/internal IP access blocked (${hostname})` };
    }
    return { safe: true, hostname, resolvedIp: hostname };
  }

  // 4. DNS Rebinding & Public IP resolution check
  try {
    const addresses = await dns.promises.resolve4(hostname);
    if (!addresses || addresses.length === 0) {
      return { safe: false, hostname, reason: 'Domain does not resolve to an active IPv4 address' };
    }

    const firstIp = addresses[0];
    if (!isSafePublicIP(firstIp)) {
      return { safe: false, hostname, resolvedIp: firstIp, reason: `Resolved IP ${firstIp} belongs to a private network` };
    }

    return { safe: true, hostname, resolvedIp: firstIp };
  } catch (err: any) {
    // If DNS failed (NXDOMAIN), it's not a private SSRF, but inoperative
    return { safe: true, hostname, reason: `DNS resolution returned ${err.code || err.message}` };
  }
}

export const isTargetSafeFromSsrf = validateSafePublicUrl;
