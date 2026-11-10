import { validateSafePublicUrl } from '../utils/security';

export interface SafeInspectionResult {
  reachable: boolean;
  httpStatus?: number;
  finalUrl?: string;
  pageTitle?: string;
  metaDescription?: string;
  isParked: boolean;
  isParkedDomain?: boolean;
  hasLoginForm: boolean;
  hasCredentialHarvesting?: boolean;
  hasSuspiciousRedirect: boolean;
  hasExternalFormAction: boolean;
  externalFormDestinations: string[];
  redirectHops: number;
  error?: string;
}

export type InspectionTelemetry = SafeInspectionResult;

/**
 * Executes a controlled, SSRF-protected safe HTTP inspection of the target site.
 * Does NOT execute untrusted scripts or submit forms.
 */
export async function performSafeWebsiteInspection(
  targetUrl: string,
  initialHostname: string
): Promise<SafeInspectionResult> {
  const cleanTarget = targetUrl.startsWith('http://') || targetUrl.startsWith('https://')
    ? targetUrl
    : `http://${targetUrl}`;

  // 1. SSRF & Private IP Check before opening connection
  const ssrfCheck = await validateSafePublicUrl(cleanTarget);
  if (!ssrfCheck.safe) {
    return {
      reachable: false,
      isParked: false,
      hasLoginForm: false,
      hasSuspiciousRedirect: false,
      hasExternalFormAction: false,
      externalFormDestinations: [],
      redirectHops: 0,
      error: `SSRF Security Block: ${ssrfCheck.reason}`,
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(cleanTarget, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ScamShield-Bot/3.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(timeout);

    const finalUrl = res.url;
    let finalHost = initialHostname;
    try {
      finalHost = new URL(finalUrl).hostname.toLowerCase();
    } catch {}

    // Validate redirect destination against SSRF
    const redirectSsrf = await validateSafePublicUrl(finalUrl);
    if (!redirectSsrf.safe) {
      return {
        reachable: false,
        isParked: false,
        hasLoginForm: false,
        hasSuspiciousRedirect: true,
        hasExternalFormAction: false,
        externalFormDestinations: [],
        redirectHops: 2,
        error: `Redirected to forbidden private host: ${redirectSsrf.reason}`,
      };
    }

    const hasSuspiciousRedirect = finalHost !== initialHostname.toLowerCase() && 
      !finalHost.endsWith(`.${initialHostname.toLowerCase()}`) &&
      !initialHostname.toLowerCase().endsWith(`.${finalHost}`);

    const html = await res.text();
    
    // Extract Title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : '';

    // Extract Meta Description
    const metaMatch = html.match(/<meta[^>]*name=[\"']description[\"'][^>]*content=[\"']([^\"']*)[\"']/i);
    const metaDescription = metaMatch ? metaMatch[1].trim() : '';

    // Detect Parking / Coming Soon pages
    const isParked = /coming soon|buy this domain|domain for sale|parked|parking crew|sedoparking|dan\.com|hugedomains/i.test(pageTitle) ||
                     /this domain is coming soon|this domain is parked|domain is available for sale|traffic management/i.test(html.slice(0, 2000));

    // Detect Credential Input Fields
    const hasLoginForm = /type=[\"']password[\"']/i.test(html) || /name=[\"'](password|passwd|pin|cvv|otp)[\"']/i.test(html);

    // Form action destinations
    const formActions = [...html.matchAll(/<form[^>]*action=[\"']([^\"']*)[\"']/gi)].map(m => m[1]);
    const externalFormDestinations = formActions.filter(action => {
      try {
        const u = new URL(action, finalUrl);
        return u.hostname.toLowerCase() !== finalHost;
      } catch {
        return false;
      }
    });

    return {
      reachable: true,
      httpStatus: res.status,
      finalUrl,
      pageTitle,
      metaDescription,
      isParked,
      isParkedDomain: isParked,
      hasLoginForm,
      hasCredentialHarvesting: hasLoginForm,
      hasSuspiciousRedirect,
      hasExternalFormAction: externalFormDestinations.length > 0,
      externalFormDestinations,
      redirectHops: res.redirected ? 2 : 1,
    };
  } catch (err: any) {
    return {
      reachable: false,
      isParked: false,
      isParkedDomain: false,
      hasLoginForm: false,
      hasCredentialHarvesting: false,
      hasSuspiciousRedirect: false,
      hasExternalFormAction: false,
      externalFormDestinations: [],
      redirectHops: 0,
      error: err.name === 'AbortError' ? 'Sandbox HTTP connection timed out (4000ms)' : err.message,
    };
  }
}

export const inspectSafeContent = performSafeWebsiteInspection;
