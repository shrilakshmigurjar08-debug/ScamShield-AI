import type { IncomingMessage, ServerResponse } from 'http';
import { normalizeAndParseUrl } from '../server/utils/urlNormalization';
import { isTargetSafeFromSsrf } from '../server/utils/security';
import { evaluateBrandImpersonation } from '../server/services/brandDetection';
import { inspectTlsCertificate } from '../server/services/sslAnalysis';
import { resolveDomainForensics } from '../server/services/domainIntelligence';
import { inspectSafeContent } from '../server/services/safeInspection';
import { aggregateThreatIntelligence } from '../server/services/threatIntelligence';
import { calculateComprehensiveVerdict } from '../server/services/riskScoring';
import { persistScanResult } from '../server/config/supabase';

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
    return;
  }

  const startTime = Date.now();

  try {
    // Read JSON body if not pre-parsed
    let body = req.body;
    if (!body) {
      body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
          try {
            resolve(data ? JSON.parse(data) : {});
          } catch (e) {
            reject(new Error('Invalid JSON payload'));
          }
        });
      });
    }

    const targetUrl = (body.url || body.targetUrl || '').trim();
    if (!targetUrl) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing required field: url' }));
      return;
    }

    // 1. SSRF & Security Validation
    const ssrfCheck = await isTargetSafeFromSsrf(targetUrl);
    if (!ssrfCheck.safe) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: 'Target URL violates security boundary policies',
        reason: ssrfCheck.reason,
      }));
      return;
    }

    // 2. Canonical URL Normalization
    const urlData = normalizeAndParseUrl(targetUrl);

    // 3. Parallel Live Forensics & Threat Intel Orchestration
    const [brandResult, sslResult, domainResult, contentResult, threatIntel] = await Promise.all([
      Promise.resolve(evaluateBrandImpersonation(urlData)),
      inspectTlsCertificate(urlData.hostname, urlData.port ? parseInt(urlData.port) : 443),
      resolveDomainForensics(urlData.hostname, urlData.domain),
      inspectSafeContent(urlData.canonicalUrl, urlData.hostname),
      aggregateThreatIntelligence(urlData.canonicalUrl, body.vtApiKey, body.gsbApiKey),
    ]);

    // 4. Zero-Contradiction Calibrated Scoring Engine
    const scanTimeMs = Date.now() - startTime;
    const verdictResult = calculateComprehensiveVerdict({
      urlData,
      brandResult,
      sslResult,
      domainResult,
      contentResult,
      threatIntel,
      scanTimeMs,
    });

    // 5. Supabase Persistence (Graceful fallback)
    await persistScanResult(verdictResult, body.userId);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(verdictResult));
  } catch (error: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'URL verification engine failure',
      details: error.message || 'Unknown runtime error',
    }));
  }
}

