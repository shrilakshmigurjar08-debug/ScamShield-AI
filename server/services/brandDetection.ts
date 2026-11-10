import { NormalizedUrlData } from '../utils/urlNormalization';

export interface BrandTarget {
  name: string;
  category: 'Sovereign / Central Bank' | 'E-Commerce' | 'Financial & UPI' | 'Job / Recruitment' | 'Tech & Cloud' | 'Logistics' | 'Social & Messaging';
  authoritativeDomains: string[];
  keywords: string[];
  isSovereignAuthority?: boolean;
}

export const VERIFIED_BRAND_DATABASE: BrandTarget[] = [
  // Sovereign & Central Banking Regulatory Authorities (Zero Tolerance)
  {
    name: 'Reserve Bank of India (RBI)',
    category: 'Sovereign / Central Bank',
    authoritativeDomains: ['rbi.org.in'],
    keywords: ['rbi'],
    isSovereignAuthority: true,
  },
  {
    name: 'Securities and Exchange Board of India (SEBI)',
    category: 'Sovereign / Central Bank',
    authoritativeDomains: ['sebi.gov.in'],
    keywords: ['sebi'],
    isSovereignAuthority: true,
  },
  {
    name: 'Income Tax Department (India)',
    category: 'Sovereign / Central Bank',
    authoritativeDomains: ['incometax.gov.in', 'incometaxindia.gov.in'],
    keywords: ['incometax', 'incometaxindia'],
    isSovereignAuthority: true,
  },
  {
    name: 'UIDAI / Aadhaar',
    category: 'Sovereign / Central Bank',
    authoritativeDomains: ['uidai.gov.in', 'myaadhaar.uidai.gov.in'],
    keywords: ['uidai', 'eaadhaar', 'myaadhaar'],
    isSovereignAuthority: true,
  },
  {
    name: 'EPFO (Employees Provident Fund India)',
    category: 'Sovereign / Central Bank',
    authoritativeDomains: ['epfindia.gov.in'],
    keywords: ['epfindia', 'epfo'],
    isSovereignAuthority: true,
  },
  {
    name: 'National Payments Corporation of India (NPCI / UPI)',
    category: 'Sovereign / Central Bank',
    authoritativeDomains: ['npci.org.in'],
    keywords: ['npci'],
    isSovereignAuthority: true,
  },
  {
    name: 'Internal Revenue Service (IRS)',
    category: 'Sovereign / Central Bank',
    authoritativeDomains: ['irs.gov'],
    keywords: ['irs'],
    isSovereignAuthority: true,
  },
  {
    name: 'Government of India (National Portal)',
    category: 'Sovereign / Central Bank',
    authoritativeDomains: ['india.gov.in', 'mygov.in', 'gov.in', 'nic.in'],
    keywords: ['govin', 'mygov', 'nationalportal'],
    isSovereignAuthority: true,
  },
  {
    name: 'IRCTC (Indian Railway Catering and Tourism Corporation)',
    category: 'Sovereign / Central Bank',
    authoritativeDomains: ['irctc.co.in', 'irctctourism.com'],
    keywords: ['irctc'],
    isSovereignAuthority: true,
  },
  {
    name: 'U.S. Securities and Exchange Commission (SEC)',
    category: 'Sovereign / Central Bank',
    authoritativeDomains: ['sec.gov'],
    keywords: ['secgov', 'ussec'],
    isSovereignAuthority: true,
  },

  // E-Commerce & Retail
  {
    name: 'Flipkart',
    category: 'E-Commerce',
    authoritativeDomains: ['flipkart.com'],
    keywords: ['flipkart'],
  },
  {
    name: 'Amazon',
    category: 'E-Commerce',
    authoritativeDomains: ['amazon.com', 'amazon.in', 'amazon.co.uk', 'aws.amazon.com', 'primevideo.com'],
    keywords: ['amazon'],
  },
  {
    name: 'Myntra',
    category: 'E-Commerce',
    authoritativeDomains: ['myntra.com'],
    keywords: ['myntra'],
  },
  {
    name: 'Meesho',
    category: 'E-Commerce',
    authoritativeDomains: ['meesho.com'],
    keywords: ['meesho'],
  },
  {
    name: 'AliExpress / Alibaba',
    category: 'E-Commerce',
    authoritativeDomains: ['aliexpress.com', 'alibaba.com'],
    keywords: ['aliexpress', 'alibaba'],
  },

  // Banking, UPI & Fintech
  {
    name: 'State Bank of India (SBI)',
    category: 'Financial & UPI',
    authoritativeDomains: ['onlinesbi.sbi', 'sbi.co.in'],
    keywords: ['onlinesbi', 'sbi', 'sbibank', 'state bank of india'],
  },
  {
    name: 'HDFC Bank',
    category: 'Financial & UPI',
    authoritativeDomains: ['hdfcbank.com'],
    keywords: ['hdfc', 'hdfcbank'],
  },
  {
    name: 'ICICI Bank',
    category: 'Financial & UPI',
    authoritativeDomains: ['icicibank.com'],
    keywords: ['icici', 'icicibank'],
  },
  {
    name: 'Axis Bank',
    category: 'Financial & UPI',
    authoritativeDomains: ['axisbank.com'],
    keywords: ['axisbank'],
  },
  {
    name: 'Paytm',
    category: 'Financial & UPI',
    authoritativeDomains: ['paytm.com', 'paytmbank.com'],
    keywords: ['paytm'],
  },
  {
    name: 'PhonePe',
    category: 'Financial & UPI',
    authoritativeDomains: ['phonepe.com'],
    keywords: ['phonepe'],
  },
  {
    name: 'PayPal',
    category: 'Financial & UPI',
    authoritativeDomains: ['paypal.com', 'paypal-communication.com'],
    keywords: ['paypal'],
  },
  {
    name: 'Chase Bank',
    category: 'Financial & UPI',
    authoritativeDomains: ['chase.com', 'jpmorganchase.com'],
    keywords: ['chase', 'chasebank'],
  },

  // Employment & Career
  {
    name: 'Naukri.com (Info Edge)',
    category: 'Job / Recruitment',
    authoritativeDomains: ['naukri.com', 'infoedge.in'],
    keywords: ['naukri'],
  },
  {
    name: 'LinkedIn',
    category: 'Job / Recruitment',
    authoritativeDomains: ['linkedin.com', 'licdn.com'],
    keywords: ['linkedin'],
  },
  {
    name: 'Indeed',
    category: 'Job / Recruitment',
    authoritativeDomains: ['indeed.com'],
    keywords: ['indeed'],
  },

  // Big Tech, Cloud & Media
  {
    name: 'Google',
    category: 'Tech & Cloud',
    authoritativeDomains: ['google.com', 'google.co.in', 'gmail.com', 'youtube.com'],
    keywords: ['google', 'gmail', 'youtube'],
  },
  {
    name: 'Microsoft',
    category: 'Tech & Cloud',
    authoritativeDomains: ['microsoft.com', 'office.com', 'live.com', 'outlook.com', 'azure.com'],
    keywords: ['microsoft', 'office365', 'outlook'],
  },
  {
    name: 'Apple',
    category: 'Tech & Cloud',
    authoritativeDomains: ['apple.com', 'icloud.com'],
    keywords: ['apple', 'icloud'],
  },
  {
    name: 'Netflix',
    category: 'Tech & Cloud',
    authoritativeDomains: ['netflix.com'],
    keywords: ['netflix'],
  },
  {
    name: 'Instagram',
    category: 'Social & Messaging',
    authoritativeDomains: ['instagram.com', 'cdninstagram.com'],
    keywords: ['instagram', 'insta'],
  },
  {
    name: 'Facebook',
    category: 'Social & Messaging',
    authoritativeDomains: ['facebook.com', 'fb.com', 'messenger.com'],
    keywords: ['facebook', 'fblogin'],
  },
  {
    name: 'WhatsApp',
    category: 'Social & Messaging',
    authoritativeDomains: ['whatsapp.com', 'api.whatsapp.com', 'web.whatsapp.com'],
    keywords: ['whatsapp', 'wa.me'],
  },
  {
    name: 'Telegram',
    category: 'Social & Messaging',
    authoritativeDomains: ['telegram.org', 't.me'],
    keywords: ['telegram'],
  },
];

// Jaro-Winkler Similarity Metric
export function jaroWinklerSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1.0;
  const len1 = s1.length;
  const len2 = s2.length;
  if (len1 === 0 || len2 === 0) return 0.0;

  const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
  const s1Matches = new Array(len1).fill(false);
  const s2Matches = new Array(len2).fill(false);

  let matches = 0;
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, len2);
    for (let j = start; j < end; j++) {
      if (s2Matches[j]) continue;
      if (s1[i] !== s2[j]) continue;
      s1Matches[i] = true;
      s2Matches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0.0;

  let k = 0;
  let transpositions = 0;
  for (let i = 0; i < len1; i++) {
    if (!s1Matches[i]) continue;
    while (!s2Matches[k]) k++;
    if (s1[i] !== s2[k]) transpositions++;
    k++;
  }

  const m = matches;
  const jaro = (m / len1 + m / len2 + (m - transpositions / 2) / m) / 3;

  // Winkler prefix scaling (up to 4 chars)
  let p = 0;
  for (let i = 0; i < Math.min(4, Math.min(len1, len2)); i++) {
    if (s1[i] === s2[i]) p++;
    else break;
  }

  return Number((jaro + p * 0.1 * (1 - jaro)).toFixed(3));
}

// Levenshtein Metric
export function calculateLevenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Homoglyph Detection Table (Cyrillic, Greek, Numbers -> Latin)
const HOMOGLYPH_MAP: Record<string, string> = {
  '0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's', '8': 'b',
  'а': 'a', 'с': 'c', 'е': 'e', 'о': 'o', 'р': 'p', 'х': 'x', 'у': 'y',
  'і': 'i', 'ј': 'j', 'ѕ': 's', 'ԁ': 'd', 'ԛ': 'q', 'ԝ': 'w',
};

export function normalizeHomoglyphs(str: string): string {
  let out = '';
  for (const ch of str) {
    out += HOMOGLYPH_MAP[ch] || ch;
  }
  return out;
}

export interface BrandMatchResult {
  isImpersonating: boolean;
  isAuthoritativeClean: boolean;
  brand?: BrandTarget;
  squatType?: 'TLD Squatting' | 'Combosquatting' | 'Typosquatting' | 'Homoglyph / Punycode Attack' | 'Subdomain Spoofing';
  similarityScore: number;
  authoritativeDomain?: string;
  reason?: string;
}

/**
 * Executes advanced brand impersonation detection.
 */
export function evaluateBrandImpersonation(urlData: NormalizedUrlData): BrandMatchResult {
  const host = urlData.hostname;
  const registrableDomain = urlData.domain;
  const sld = registrableDomain.slice(0, registrableDomain.lastIndexOf('.')) || registrableDomain;
  const normalizedSld = normalizeHomoglyphs(sld);

  // 1. Authoritative Platform Exemption
  for (const brand of VERIFIED_BRAND_DATABASE) {
    const isAuthentic = brand.authoritativeDomains.some(auth => host === auth || host.endsWith(`.${auth}`));
    if (isAuthentic) {
      return {
        isImpersonating: false,
        isAuthoritativeClean: true,
        brand,
        similarityScore: 1.0,
        authoritativeDomain: brand.authoritativeDomains[0],
      };
    }
  }

  // 2. Sovereign / Regulatory Authority Impersonation Check (e.g. rbi.org, sebi-claim.net)
  for (const gov of VERIFIED_BRAND_DATABASE.filter(b => b.isSovereignAuthority)) {
    const matchedKw = gov.keywords.find(k => sld === k || sld.includes(k) || normalizedSld.includes(k));
    if (matchedKw) {
      return {
        isImpersonating: true,
        isAuthoritativeClean: false,
        brand: gov,
        squatType: sld === matchedKw ? 'TLD Squatting' : 'Combosquatting',
        similarityScore: 0.98,
        authoritativeDomain: gov.authoritativeDomains[0],
        reason: `Target domain "${registrableDomain}" misappropriates the official identifier of "${gov.name}". Sovereign regulatory bodies operate exclusively on authorized sovereign domains (${gov.authoritativeDomains[0]}).`,
      };
    }
  }

  // 3. Commercial Brand Check
  for (const brand of VERIFIED_BRAND_DATABASE.filter(b => !b.isSovereignAuthority)) {
    for (const kw of brand.keywords) {
      // Exact SLD match on alternate TLD (e.g. flipkart.biz, paytm.top)
      if (sld === kw || normalizedSld === kw) {
        return {
          isImpersonating: true,
          isAuthoritativeClean: false,
          brand,
          squatType: 'TLD Squatting',
          similarityScore: 0.99,
          authoritativeDomain: brand.authoritativeDomains[0],
          reason: `Unauthorized TLD clone: "${registrableDomain}" registers trademark "${brand.name}" under an alternate public suffix (.${urlData.publicSuffix}). Authentic: ${brand.authoritativeDomains[0]}.`,
        };
      }

      // Combosquatting: brand keyword + hyphen or bait word (e.g. naukri-job.com, paypal-update.com)
      if (sld.includes(kw) || normalizedSld.includes(kw)) {
        return {
          isImpersonating: true,
          isAuthoritativeClean: false,
          brand,
          squatType: 'Combosquatting',
          similarityScore: 0.92,
          authoritativeDomain: brand.authoritativeDomains[0],
          reason: `Combosquatting detected: "${registrableDomain}" embeds the trademark "${brand.name}" alongside unauthorized keywords to deceptively mimic the authentic service (${brand.authoritativeDomains[0]}).`,
        };
      }

      // Typosquatting (Levenshtein distance <= 2 or Jaro-Winkler >= 0.88)
      if (sld.length >= 5 && kw.length >= 5) {
        const lev = calculateLevenshtein(sld, kw);
        const jaro = jaroWinklerSimilarity(sld, kw);

        if (lev === 1 || (lev === 2 && sld.length >= 7) || jaro >= 0.89) {
          return {
            isImpersonating: true,
            isAuthoritativeClean: false,
            brand,
            squatType: 'Typosquatting',
            similarityScore: jaro,
            authoritativeDomain: brand.authoritativeDomains[0],
            reason: `Visual typosquatting detected: "${sld}" is a deceptive visual misspelling of "${kw}" (Levenshtein distance: ${lev}, Jaro-Winkler: ${jaro}). Official domain: ${brand.authoritativeDomains[0]}.`,
          };
        }
      }

      // Subdomain spoofing: brand keyword in subdomain of third-party domain (e.g. flipkart.com.attacker.com)
      if (urlData.subdomain) {
        const subParts = urlData.subdomain.split('.');
        if (subParts.some(p => p === kw || p.includes(kw))) {
          return {
            isImpersonating: true,
            isAuthoritativeClean: false,
            brand,
            squatType: 'Subdomain Spoofing',
            similarityScore: 0.95,
            authoritativeDomain: brand.authoritativeDomains[0],
            reason: `Subdomain spoofing: The subdomain "${urlData.subdomain}" mimics "${brand.name}" while the actual root domain belongs to third-party host "${registrableDomain}".`,
          };
        }
      }
    }
  }

  return {
    isImpersonating: false,
    isAuthoritativeClean: false,
    similarityScore: 0.0,
  };
}
