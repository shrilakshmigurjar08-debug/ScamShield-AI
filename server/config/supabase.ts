import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ThreatResult } from '../../src/types/threat';
import { createLogger } from '../utils/logger';

const logger = createLogger('supabase');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    logger.info('Supabase client initialized successfully', { url: SUPABASE_URL });
  } catch (error: any) {
    logger.warn('Failed to initialize Supabase client; running in offline/local fallback mode', {
      error: error.message,
    });
  }
} else {
  logger.info('Supabase credentials not configured. Running in local/in-memory mode.');
}

export const supabase = supabaseInstance;

/**
 * Saves a completed scan report into Supabase scan_history and scan_evidence.
 * Gracefully degrades without throwing if Supabase is offline or unconfigured.
 */
export async function persistScanResult(result: ThreatResult, userId?: string): Promise<string | null> {
  if (!supabase) {
    logger.debug('Skipping Supabase persistence (client uninitialized)');
    return null;
  }

  try {
    const { data: scanData, error: scanError } = await supabase
      .from('scan_history')
      .insert({
        user_id: userId || null,
        target_url: result.target,
        normalized_url: result.target,
        domain: result.target,
        scan_type: result.targetType,
        final_risk_score: result.riskScore,
        risk_level: result.severity,
        threat_category: result.threatCategory,
        impersonated_brand: result.impersonatedBrand || null,
        confidence_score: result.confidenceScore,
        verdict_time: result.verdictTime,
        summary: result.summary,
        detection_breakdown: result.vectorScores,
        telemetry: result.telemetry,
      })
      .select('id')
      .single();

    if (scanError) {
      logger.warn('Failed to insert scan record into Supabase', { error: scanError.message });
      return null;
    }

    const scanId = scanData?.id;

    if (scanId && result.evidence.length > 0) {
      const evidenceRows = result.evidence.map(e => ({
        scan_id: scanId,
        evidence_code: e.id,
        title: e.title,
        category: e.category,
        severity: e.severity,
        description: e.description,
        technical_detail: e.technicalDetail,
        tag: e.tag,
      }));

      const { error: evidenceError } = await supabase.from('scan_evidence').insert(evidenceRows);
      if (evidenceError) {
        logger.warn('Failed to insert scan evidence into Supabase', { error: evidenceError.message });
      }
    }

    return scanId;
  } catch (error: any) {
    logger.warn('Exception during Supabase scan persistence', { error: error.message });
    return null;
  }
}

/**
 * Retrieves past scans from Supabase.
 */
export async function fetchRecentScans(limit: number = 20): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('scan_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.warn('Failed to fetch recent scans from Supabase', { error: error.message });
      return [];
    }
    return data || [];
  } catch (error: any) {
    logger.warn('Exception fetching recent scans', { error: error.message });
    return [];
  }
}

