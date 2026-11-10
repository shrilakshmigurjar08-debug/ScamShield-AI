import assert from 'assert';
import { validateSafePublicUrl } from '../server/utils/security';
import { normalizeAndDecomposeUrl } from '../server/utils/urlNormalization';
import { evaluateBrandImpersonation } from '../server/services/brandDetection';
import { calculateComprehensiveVerdict } from '../server/services/riskScoring';
import { analyzeDeceptiveText } from '../server/services/aiTextAnalysis';

async function runTestSuite() {
  console.log('🧪 Starting ScamShield AI Comprehensive Forensic Engine Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    return Promise.resolve()
      .then(fn)
      .then(() => {
        console.log(`  ✅ PASS: ${name}`);
        passed++;
      })
      .catch((err) => {
        console.error(`  ❌ FAIL: ${name}`);
        console.error(`     ${err.message}`);
        failed++;
      });
  }

  // 1. SSRF Protection Tests
  await test('SSRF: Blocks loopback IPv4 (127.0.0.1)', async () => {
    const res = await validateSafePublicUrl('http://127.0.0.1:3000');
    assert.strictEqual(res.safe, false);
  });

  await test('SSRF: Blocks AWS/Cloud metadata (169.254.169.254)', async () => {
    const res = await validateSafePublicUrl('http://169.254.169.254/latest/meta-data');
    assert.strictEqual(res.safe, false);
  });

  await test('SSRF: Blocks private RFC 1918 range (10.0.0.1)', async () => {
    const res = await validateSafePublicUrl('http://10.0.0.1/admin');
    assert.strictEqual(res.safe, false);
  });

  await test('SSRF: Blocks invalid protocol schemes (file://, gopher://)', async () => {
    const res = await validateSafePublicUrl('file:///etc/passwd');
    assert.strictEqual(res.safe, false);
  });

  // 2. URL Normalization Tests
  await test('URL Normalization: Strict Public Suffix parsing (naukri-job.com)', () => {
    const data = normalizeAndDecomposeUrl('http://www.naukri-job.com/apply');
    assert.strictEqual(data.domain, 'naukri-job.com');
    assert.strictEqual(data.publicSuffix, 'com');
  });

  await test('URL Normalization: Handles multi-part suffixes (rbi.org.in)', () => {
    const data = normalizeAndDecomposeUrl('https://rbi.org.in/scripts');
    assert.strictEqual(data.domain, 'rbi.org.in');
    assert.strictEqual(data.publicSuffix, 'org.in');
  });

  // 3. Brand Impersonation & Typosquatting Engine Tests
  await test('Brand Engine: Recognizes authentic domain (rbi.org.in)', () => {
    const data = normalizeAndDecomposeUrl('https://rbi.org.in');
    const match = evaluateBrandImpersonation(data);
    assert.strictEqual(match.isAuthoritativeClean, true);
    assert.strictEqual(match.isImpersonating, false);
  });

  await test('Brand Engine: Flags Sovereign Regulatory Spoofing (rbi.org)', () => {
    const data = normalizeAndDecomposeUrl('http://rbi.org');
    const match = evaluateBrandImpersonation(data);
    assert.strictEqual(match.isImpersonating, true);
    assert.strictEqual(match.brand?.name, 'Reserve Bank of India (RBI)');
    assert.strictEqual(match.brand?.isSovereignAuthority, true);
  });

  await test('Brand Engine: Flags Combosquatting (www.naukri-job.com)', () => {
    const data = normalizeAndDecomposeUrl('http://www.naukri-job.com');
    const match = evaluateBrandImpersonation(data);
    assert.strictEqual(match.isImpersonating, true);
    assert.strictEqual(match.squatType, 'Combosquatting');
  });

  await test('Brand Engine: Flags TLD Squatting (flipkart.biz)', () => {
    const data = normalizeAndDecomposeUrl('https://flipkart.biz');
    const match = evaluateBrandImpersonation(data);
    assert.strictEqual(match.isImpersonating, true);
    assert.strictEqual(match.squatType, 'TLD Squatting');
  });

  await test('Brand Engine: Subdomain spoofing detection (paypal.com.attacker.com)', () => {
    const data = normalizeAndDecomposeUrl('http://paypal.com.attacker.com/login');
    const match = evaluateBrandImpersonation(data);
    assert.strictEqual(match.isImpersonating, true);
    assert.strictEqual(match.squatType, 'Subdomain Spoofing');
  });

  // 4. Zero-Contradiction Scoring Tests
  await test('Risk Scoring: Strict Zero-Contradiction Rule Assertion', () => {
    const urlData = normalizeAndDecomposeUrl('http://rbi.org');
    const verdict = calculateComprehensiveVerdict({
      urlData,
      brandResult: {
        isImpersonating: true,
        isAuthoritativeClean: false,
        brand: {
          name: 'Reserve Bank of India (RBI)',
          category: 'Sovereign / Central Bank',
          authoritativeDomains: ['rbi.org.in'],
          keywords: ['rbi'],
          isSovereignAuthority: true,
        },
        squatType: 'TLD Squatting',
        similarityScore: 0.98,
        authoritativeDomain: 'rbi.org.in',
      },
      sslResult: {
        status: 'CERT_EXPIRED',
        valid: false,
        isExpired: true,
        issuer: "Let's Encrypt",
        subject: 'rbi.org',
        validFrom: '2023-08-10',
        validTo: '2023-11-08',
        daysRemaining: -367,
        sans: ['rbi.org'],
        isDvAutomated: true,
      },
      domainResult: {
        isDeadRecord: false,
        domainStatus: ['ACTIVE_DNS'],
        ageDays: 8000,
        tldRisky: false,
        resolvedIps: ['172.104.251.198'],
        asn: 'AS63949 Linode',
        hostingProvider: 'Linode',
        country: 'United States',
        countryCode: 'US',
        sha256: 'abc123',
      },
      contentResult: {
        reachable: true,
        isParked: true,
        isParkedDomain: true,
        hasLoginForm: false,
        hasCredentialHarvesting: false,
        hasSuspiciousRedirect: false,
        hasExternalFormAction: false,
        externalFormDestinations: [],
        redirectHops: 0,
      },
      threatIntel: {
        timestamp: new Date().toISOString(),
        targetUrl: 'http://rbi.org',
        cached: false,
        virusTotal: { positives: 0, total: 72, scanDate: '', status: 'NOT_LISTED' },
        googleSafeBrowsing: { status: 'CLEAN', threatTypes: [], platformTypes: [] },
        phishingFeeds: { isPhishing: false, status: 'NOT_LISTED', sourcesFlagged: [], details: [] },
        aggregatedVerdict: 'CLEAN',
        detectionEnginesFlagged: 0,
        totalDetectionEngines: 72,
        threatDetails: [],
      },
      scanTimeMs: 450,
    });

    // Enforce Zero Contradictions
    assert.strictEqual(verdict.severity, 'critical', 'Severity MUST be critical due to sovereign spoofing');
    assert.ok(verdict.riskScore >= 95, `Risk score must be >= 95, was ${verdict.riskScore}`);
    assert.notStrictEqual(verdict.threatCategory, 'Clean & Verified Infrastructure');
  });

  // 5. AI NLP Deception Analysis Test
  await test('AI NLP Analysis: Accurately flags urgency and PII harvesting', async () => {
    const text = 'URGENT NOTICE: Your bank account will be suspended within 24 hours. Enter your password and OTP immediately to avoid penalties.';
    const result = await analyzeDeceptiveText({ text });
    assert.ok(result.riskScore >= 70, `Score must be >= 70, got ${result.riskScore}`);
    assert.strictEqual(result.severity, 'critical');
    assert.ok(result.evidence.some(e => e.id === 'EV-NLP-URGENCY'));
    assert.ok(result.evidence.some(e => e.id === 'EV-NLP-PII'));
  });

  console.log(`\n=========================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log(`=========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});

