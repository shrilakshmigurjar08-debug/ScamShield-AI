-- ============================================================================
-- SCAMSHIELD AI: REAL-TIME THREAT INTELLIGENCE & FORENSICS SCHEMA
-- PostgreSQL / Supabase Schema Definition
-- ============================================================================

-- Enable pgcrypto / uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. TABLE: scan_history
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scan_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    target_url TEXT NOT NULL,
    normalized_url TEXT NOT NULL,
    domain TEXT NOT NULL,
    scan_type TEXT NOT NULL DEFAULT 'url' CHECK (scan_type IN ('url', 'message', 'document')),
    final_risk_score INTEGER NOT NULL CHECK (final_risk_score >= 0 AND final_risk_score <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('critical', 'high', 'medium', 'low', 'safe')),
    threat_category TEXT NOT NULL,
    impersonated_brand TEXT,
    confidence_score NUMERIC(5, 2) NOT NULL DEFAULT 95.0,
    verdict_time TEXT,
    summary TEXT,
    detection_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    threat_intelligence_summary JSONB DEFAULT '{}'::jsonb,
    ssl_summary JSONB DEFAULT '{}'::jsonb,
    domain_intelligence_summary JSONB DEFAULT '{}'::jsonb,
    content_inspection_summary JSONB DEFAULT '{}'::jsonb,
    telemetry JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for rapid lookup
CREATE INDEX IF NOT EXISTS idx_scan_history_domain ON scan_history(domain);
CREATE INDEX IF NOT EXISTS idx_scan_history_target_url ON scan_history(target_url);
CREATE INDEX IF NOT EXISTS idx_scan_history_user_id ON scan_history(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_risk_level ON scan_history(risk_level);
CREATE INDEX IF NOT EXISTS idx_scan_history_created_at ON scan_history(created_at DESC);

-- ----------------------------------------------------------------------------
-- 2. TABLE: scan_evidence
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scan_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID NOT NULL REFERENCES scan_history(id) ON DELETE CASCADE,
    evidence_code TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Domain Intel', 'NLP Heuristics', 'Network Cloaking', 'Brand Impersonation', 'Payload Analysis')),
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'safe', 'warning')),
    description TEXT NOT NULL,
    technical_detail TEXT,
    tag TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scan_evidence_scan_id ON scan_evidence(scan_id);
CREATE INDEX IF NOT EXISTS idx_scan_evidence_tag ON scan_evidence(tag);

-- ----------------------------------------------------------------------------
-- 3. TABLE: threat_intelligence_cache
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS threat_intelligence_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    indicator TEXT NOT NULL UNIQUE,
    indicator_type TEXT NOT NULL CHECK (indicator_type IN ('url', 'domain', 'ip', 'sha256')),
    source TEXT NOT NULL,
    verdict TEXT NOT NULL CHECK (verdict IN ('CLEAN', 'MALICIOUS', 'SUSPICIOUS', 'NOT_LISTED', 'UNKNOWN', 'SERVICE_UNAVAILABLE')),
    detection_engines_flagged INTEGER DEFAULT 0,
    total_engines INTEGER DEFAULT 0,
    raw_response JSONB DEFAULT '{}'::jsonb,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_threat_cache_indicator ON threat_intelligence_cache(indicator);
CREATE INDEX IF NOT EXISTS idx_threat_cache_expires_at ON threat_intelligence_cache(expires_at);

-- ----------------------------------------------------------------------------
-- 4. TABLE: brand_registry
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS brand_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    authoritative_domains TEXT[] NOT NULL DEFAULT '{}',
    approved_subdomains TEXT[] NOT NULL DEFAULT '{}',
    brand_keywords TEXT[] NOT NULL DEFAULT '{}',
    is_sovereign_authority BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brand_registry_keywords ON brand_registry USING GIN(brand_keywords);

-- ----------------------------------------------------------------------------
-- 5. TABLE: intelligence_feed_status
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS intelligence_feed_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feed_name TEXT NOT NULL UNIQUE,
    last_polled_at TIMESTAMPTZ,
    records_ingested INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'IDLE' CHECK (status IN ('IDLE', 'POLLING', 'SUCCESS', 'ERROR')),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_intelligence_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_feed_status ENABLE ROW LEVEL SECURITY;

-- Allow anonymous & authenticated users to read and insert scans
CREATE POLICY "Public Scans Read Policy" ON scan_history
    FOR SELECT USING (true);

CREATE POLICY "Public Scans Insert Policy" ON scan_history
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Evidence Read Policy" ON scan_evidence
    FOR SELECT USING (true);

CREATE POLICY "Public Evidence Insert Policy" ON scan_evidence
    FOR INSERT WITH CHECK (true);

-- Threat cache & brand registry read policies
CREATE POLICY "Cache Public Read Policy" ON threat_intelligence_cache
    FOR SELECT USING (true);

CREATE POLICY "Brand Registry Public Read Policy" ON brand_registry
    FOR SELECT USING (true);

CREATE POLICY "Feed Status Public Read Policy" ON intelligence_feed_status
    FOR SELECT USING (true);

-- Service role bypasses all policies automatically in Supabase

