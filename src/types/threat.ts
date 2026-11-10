export type ThreatType = 'url' | 'message' | 'document';

export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'safe';

export interface EvidenceItem {
  id: string;
  title: string;
  category: 'Domain Intel' | 'NLP Heuristics' | 'Network Cloaking' | 'Brand Impersonation' | 'Payload Analysis';
  severity: ThreatSeverity;
  description: string;
  technicalDetail: string;
  tag: string;
}

export interface TelemetryData {
  ipAddress: string;
  asn: string;
  hostingProvider: string;
  country: string;
  countryCode: string;
  domainAge: string;
  registeredDate: string;
  registrar: string;
  sslIssuer: string;
  sslValidity: string;
  sha256: string;
  redirectHops: number;
  enginesFlagged: number;
  totalEngines: number;
}

export interface ThreatResult {
  id: string;
  target: string;
  targetType: ThreatType;
  timestamp: string;
  riskScore: number;
  severity: ThreatSeverity;
  threatCategory: string;
  impersonatedBrand?: string;
  confidenceScore: number;
  verdictTime: string;
  summary: string;
  evidence: EvidenceItem[];
  telemetry: TelemetryData;
  vectorScores: {
    domainReputation: number;
    nlpCoercion: number;
    networkCloaking: number;
    visualSimilarity: number;
  };
}

export interface ScanHistoryItem {
  id: string;
  target: string;
  targetType: ThreatType;
  riskScore: number;
  severity: ThreatSeverity;
  threatCategory: string;
  timestamp: string;
}

export interface ThreatFlag {
  title: string;
  description: string;
  status: 'danger' | 'safe' | 'warning';
}

export interface ThreatReport {
  id: string;
  target: string;
  type: ThreatType;
  riskScore: number;
  severity: 'critical' | 'safe';
  category: string;
  summary: string;
  domainAge: string;
  sslStatus: string;
  ipAddress: string;
  scanTime: string;
  flags: ThreatFlag[];
  recommendations: string[];
  createdAt?: string;
  userId?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User | null;
  token?: string;
  error?: string;
}
