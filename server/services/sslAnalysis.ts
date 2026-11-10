import tls from 'tls';

export interface SslAnalysisResult {
  status: 'VALID' | 'CERT_EXPIRED' | 'HOSTNAME_MISMATCH' | 'UNTRUSTED_CA' | 'NO_CERTIFICATE' | 'HANDSHAKE_TIMEOUT' | 'ERROR';
  valid: boolean;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  sans: string[];
  isDvAutomated: boolean;
  isExpired?: boolean;
  isSelfSigned?: boolean;
  hostnameMismatch?: boolean;
  protocol?: string;
  cipher?: string;
  error?: string;
}

export type SslTelemetry = SslAnalysisResult;

/**
 * Performs deep socket TLS certificate audit on port 443.
 */
export function auditTlsCertificate(hostname: string, port = 443): Promise<SslAnalysisResult> {
  return new Promise((resolve) => {
    let settled = false;
    const socket = tls.connect(
      {
        host: hostname,
        port,
        servername: hostname,
        timeout: 4500,
        rejectUnauthorized: false, // Inspect invalid certs to analyze fraud indicators
      },
      () => {
        if (settled) return;
        settled = true;
        const cert: any = socket.getPeerCertificate(true);
        const authorized = socket.authorized;
        const authError = socket.authorizationError;

        if (!cert || Object.keys(cert).length === 0) {
          socket.destroy();
          return resolve({
            status: 'NO_CERTIFICATE',
            valid: false,
            issuer: 'None / Plain Text HTTP',
            subject: 'None',
            validFrom: 'N/A',
            validTo: 'N/A',
            daysRemaining: 0,
            sans: [],
            isDvAutomated: false,
            error: 'No peer certificate returned on port 443',
          });
        }

        const validToDate = new Date(cert.valid_to);
        const daysRemaining = Math.round((validToDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const isExpired = daysRemaining <= 0 || authError === 'CERT_HAS_EXPIRED';
        const issuerName = cert.issuer?.O || cert.issuer?.CN || (typeof cert.issuer === 'string' ? cert.issuer : 'Generic CA');
        const subjectName = cert.subject?.CN || (typeof cert.subject === 'string' ? cert.subject : 'Unknown');
        const sans: string[] = cert.subjectaltname ? String(cert.subjectaltname).split(', ').map(s => s.replace(/^DNS:/, '')) : [];

        // Strict Hostname Matching Check
        const hostLower = hostname.toLowerCase();
        const matchesSubject = subjectName.toLowerCase() === hostLower ||
          (subjectName.startsWith('*.') && hostLower.endsWith(subjectName.slice(1)));
        const matchesSans = sans.some(s => s.toLowerCase() === hostLower || (s.startsWith('*.') && hostLower.endsWith(s.slice(1))));
        const isHostnameMismatch = !matchesSubject && !matchesSans;

        const isDvAutomated = /Let's Encrypt|cPanel|ZeroSSL|GoDaddy.*DV|Cloudflare.*DV/i.test(String(issuerName));

        let status: SslAnalysisResult['status'] = 'VALID';
        let errorMsg: string | undefined = undefined;

        if (isExpired) {
          status = 'CERT_EXPIRED';
          errorMsg = `CERT_HAS_EXPIRED (Expired on ${cert.valid_to})`;
        } else if (isHostnameMismatch) {
          status = 'HOSTNAME_MISMATCH';
          errorMsg = `ERR_TLS_CERT_ALTNAME_INVALID (Certificate signed for "${subjectName}", not "${hostname}")`;
        } else if (!authorized && authError) {
          status = 'UNTRUSTED_CA';
          errorMsg = String(authError);
        }

        const protocol = socket.getProtocol() || 'TLS';
        const cipherInfo = socket.getCipher();
        const cipher = cipherInfo ? `${cipherInfo.name} (${cipherInfo.version})` : 'TLS_AES_256_GCM_SHA384';
        const isSelfSigned = authError === 'DEPTH_ZERO_SELF_SIGNED_CERT' || authError === 'SELF_SIGNED_CERT_IN_CHAIN';

        socket.destroy();
        resolve({
          status,
          valid: Boolean(authorized) && !isExpired && !isHostnameMismatch,
          issuer: String(issuerName),
          subject: String(subjectName),
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          daysRemaining,
          sans,
          isDvAutomated,
          isExpired,
          isSelfSigned,
          hostnameMismatch: isHostnameMismatch,
          protocol,
          cipher,
          error: errorMsg,
        });
      }
    );

    socket.on('error', (err: any) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve({
        status: 'ERROR',
        valid: false,
        issuer: 'Connection Refused / Inactive SSL',
        subject: 'None',
        validFrom: 'N/A',
        validTo: 'N/A',
        daysRemaining: 0,
        sans: [],
        isDvAutomated: false,
        error: err.code || err.message,
      });
    });

    socket.on('timeout', () => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve({
        status: 'HANDSHAKE_TIMEOUT',
        valid: false,
        issuer: 'TLS Handshake Timeout',
        subject: 'None',
        validFrom: 'N/A',
        validTo: 'N/A',
        daysRemaining: 0,
        sans: [],
        isDvAutomated: false,
        error: 'TLS Handshake Timeout (Port 443 dropped connection)',
      });
    });
  });
}

export const inspectTlsCertificate = auditTlsCertificate;
