/**
 * Whitelist of verified, highly-trusted sovereign, educational, and enterprise root domains.
 * These domains have established PKI trust and require rigorous proof of corporate/state identity.
 */
export const TRUSTED_ROOT_DOMAINS: Set<string> = new Set([
  // Sovereign / Government Public Suffixes
  'gov.in',
  'nic.in',
  'gov',
  'mil',
  'edu',
  'ac.in',
  'edu.in',
  
  // High-Trust Tech Infrastructure
  'google.com',
  'google.co.in',
  'gstatic.com',
  'googleapis.com',
  'microsoft.com',
  'apple.com',
  'github.com',
  'cloudflare.com',
  'amazonaws.com',
  
  // Authentic Financial / Central Banking Root Domains
  'rbi.org.in',
  'sebi.gov.in',
  'incometax.gov.in',
  'uidai.gov.in',
  'epfindia.gov.in',
  'npci.org.in',
  'onlinesbi.sbi',
  'hdfcbank.com',
  'icicibank.com',
  'axisbank.com',
  
  // Authentic Major E-Commerce & Job Platforms
  'flipkart.com',
  'amazon.com',
  'amazon.in',
  'naukri.com',
  'linkedin.com',
  'indeed.com',
]);

/**
 * Checks if a domain is an exact match or legitimate subdomain of a trusted root domain.
 */
export function isTrustedAuthoritativeDomain(hostname: string): boolean {
  const cleanHost = hostname.toLowerCase().trim();
  if (TRUSTED_ROOT_DOMAINS.has(cleanHost)) return true;
  for (const trusted of TRUSTED_ROOT_DOMAINS) {
    if (cleanHost.endsWith(`.${trusted}`)) {
      return true;
    }
  }
  return false;
}

