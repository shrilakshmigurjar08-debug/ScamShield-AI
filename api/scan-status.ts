import type { IncomingMessage, ServerResponse } from 'http';
import { supabase } from '../server/config/supabase';
import { threatCache } from '../server/utils/cache';

export default async function handler(req: IncomingMessage & { query?: any }, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const scanId = url.searchParams.get('id') || url.searchParams.get('scanId');

  if (!scanId) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing scan ID parameter' }));
    return;
  }

  // Check cache first
  const cached = threatCache.get(`scan_status:${scanId}`);
  if (cached) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'COMPLETED', data: cached }));
    return;
  }

  // Check Supabase if configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('scan_history')
        .select('*, scan_evidence(*)')
        .eq('id', scanId)
        .single();

      if (!error && data) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'COMPLETED', data }));
        return;
      }
    } catch {
      // Fall through
    }
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ status: 'NOT_FOUND', message: 'Scan record not found or expired' }));
}

