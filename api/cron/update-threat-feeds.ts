import type { IncomingMessage, ServerResponse } from 'http';
import { supabase } from '../../server/config/supabase';
import { createLogger } from '../../server/utils/logger';

const logger = createLogger('cron-threat-feeds');

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');

  const authHeader = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Unauthorized cron trigger' }));
    return;
  }

  logger.info('Scheduled cron execution: Synchronizing live threat feeds');

  try {
    let feedsUpdated = 0;
    const now = new Date().toISOString();

    // Ingest OpenPhish feed preview
    const openPhishRes = await fetch('https://openphish.com/feed.txt', {
      headers: { 'User-Agent': 'ScamShield-AI-Cron/1.0' },
    });

    if (openPhishRes.ok) {
      const text = await openPhishRes.text();
      const urls = text.split('\n').filter(Boolean);
      feedsUpdated += urls.length;

      if (supabase) {
        await supabase.from('intelligence_feed_status').upsert(
          {
            feed_name: 'OpenPhish Community Feed',
            last_polled_at: now,
            records_ingested: urls.length,
            status: 'SUCCESS',
            updated_at: now,
          },
          { onConflict: 'feed_name' }
        );
      }
    }

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        success: true,
        message: 'Threat intelligence feeds successfully synchronized',
        indicatorsIngested: feedsUpdated,
        timestamp: now,
      })
    );
  } catch (error: any) {
    logger.error('Failed to update threat feeds during cron trigger', { error: error.message });
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        success: false,
        error: error.message,
      })
    );
  }
}

