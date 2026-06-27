import express from 'express';
import axios from 'axios';
import { cookieInspectorLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
router.use(cookieInspectorLimiter);

const COOKIE_DB = {
  '_ga':         { name: 'Google Analytics',         company: 'Google',    category: 'Analytics',    purpose: 'Collects anonymous visitor statistics and tracks page views.',            duration: '2 years',   thirdParty: true  },
  '_gid':        { name: 'Google Analytics Session', company: 'Google',    category: 'Analytics',    purpose: 'Distinguishes between individual users in Google Analytics.',            duration: '24 hours',  thirdParty: true  },
  '_gat':        { name: 'GA Throttle',              company: 'Google',    category: 'Analytics',    purpose: 'Limits Google Analytics request rate.',                                  duration: '1 minute',  thirdParty: true  },
  '_ga_':        { name: 'Google Analytics 4',       company: 'Google',    category: 'Analytics',    purpose: 'Tracks session state in Google Analytics 4.',                           duration: '2 years',   thirdParty: true  },
  '_gcl_au':     { name: 'Google Ads Conversion',    company: 'Google',    category: 'Advertising',  purpose: 'Stores and tracks ad conversion data from Google Ads.',                 duration: '90 days',   thirdParty: true  },
  'IDE':         { name: 'Google DoubleClick',       company: 'Google',    category: 'Advertising',  purpose: 'Tracks user behavior across sites for targeted advertising.',            duration: '1 year',    thirdParty: true  },
  '_fbp':        { name: 'Meta Pixel',               company: 'Meta',      category: 'Advertising',  purpose: 'Measures ad performance and personalises ads across Meta platforms.',    duration: '90 days',   thirdParty: true  },
  '_fbc':        { name: 'Meta Click ID',            company: 'Meta',      category: 'Advertising',  purpose: 'Stores click data when arriving from a Facebook ad.',                   duration: '90 days',   thirdParty: true  },
  '_clck':       { name: 'Microsoft Clarity',        company: 'Microsoft', category: 'Analytics',    purpose: 'Tracks session across pages for Microsoft Clarity heatmaps.',           duration: '1 year',    thirdParty: true  },
  '_clsk':       { name: 'Clarity Session',          company: 'Microsoft', category: 'Analytics',    purpose: 'Connects page views within a single Microsoft Clarity session.',         duration: '1 day',     thirdParty: true  },
  '_hjid':       { name: 'Hotjar Identity',          company: 'Hotjar',    category: 'Analytics',    purpose: 'Assigns a unique ID to identify visitors across sessions.',              duration: '1 year',    thirdParty: true  },
  '_hjsession':  { name: 'Hotjar Session',           company: 'Hotjar',    category: 'Analytics',    purpose: 'Stores current Hotjar session data.',                                   duration: '30 minutes',thirdParty: true  },
  '_hjAbsoluteSessionInProgress': { name: 'Hotjar Active Session', company: 'Hotjar', category: 'Analytics', purpose: 'Detects the first pageview session for Hotjar sampling.',     duration: '30 minutes',thirdParty: true  },
  'ajs_user_id': { name: 'Segment Analytics',        company: 'Segment',   category: 'Analytics',    purpose: 'Identifies users across events in Segment analytics pipeline.',          duration: '1 year',    thirdParty: true  },
  '__stripe_mid':{ name: 'Stripe',                   company: 'Stripe',    category: 'Essential',    purpose: 'Fraud prevention and secure payment session management.',               duration: '1 year',    thirdParty: true  },
  '__stripe_sid':{ name: 'Stripe Session',           company: 'Stripe',    category: 'Essential',    purpose: 'Short-lived session cookie for Stripe payment flow.',                   duration: '30 minutes',thirdParty: true  },
  'session':     { name: 'Session Cookie',           company: null,        category: 'Essential',    purpose: 'Keeps you authenticated during your visit.',                            duration: 'Session',   thirdParty: false },
  'session_id':  { name: 'Session ID',               company: null,        category: 'Essential',    purpose: 'Maintains your login session on the server.',                           duration: 'Session',   thirdParty: false },
  'sessionid':   { name: 'Session ID',               company: null,        category: 'Essential',    purpose: 'Maintains your login session on the server.',                           duration: 'Session',   thirdParty: false },
  'csrftoken':   { name: 'CSRF Token',               company: null,        category: 'Essential',    purpose: 'Prevents cross-site request forgery attacks.',                          duration: 'Session',   thirdParty: false },
  '_csrf':       { name: 'CSRF Token',               company: null,        category: 'Essential',    purpose: 'Security token protecting form submissions.',                           duration: 'Session',   thirdParty: false },
  'remember_me': { name: 'Remember Me',              company: null,        category: 'Functional',   purpose: 'Keeps you logged in across browser sessions.',                          duration: '30 days',   thirdParty: false },
  'lang':        { name: 'Language Preference',      company: null,        category: 'Functional',   purpose: 'Remembers your preferred display language.',                            duration: '1 year',    thirdParty: false },
  'currency':    { name: 'Currency Preference',      company: null,        category: 'Functional',   purpose: 'Stores your preferred currency for pricing display.',                   duration: '1 year',    thirdParty: false },
  'theme':       { name: 'Theme Preference',         company: null,        category: 'Functional',   purpose: 'Remembers light or dark mode preference.',                              duration: '1 year',    thirdParty: false },
  'intercom-id': { name: 'Intercom',                 company: 'Intercom',  category: 'Functional',   purpose: 'Powers the live chat widget and identifies returning users.',           duration: '9 months',  thirdParty: true  }
};

function classifyUnknownCookie(name) {
  const n = name.toLowerCase();
  if (/session|auth|login|token|csrf|xsrf|secure|nonce/.test(n)) {
    return { category: 'Essential',   purpose: 'Manages session state or security.', duration: 'Session', thirdParty: false };
  }
  if (/lang|locale|currency|theme|pref|setting|country/.test(n)) {
    return { category: 'Functional',  purpose: 'Stores user preferences.', duration: '1 year', thirdParty: false };
  }
  if (/analytic|stat|track|visit|view|click|hit|metric|pixel/.test(n)) {
    return { category: 'Analytics',   purpose: 'Collects usage or analytics data.', duration: '1 year', thirdParty: true };
  }
  if (/ad|ads|advert|market|campaign|promo|retarget|convert|affiliate/.test(n)) {
    return { category: 'Advertising', purpose: 'Used for targeted advertising or campaign tracking.', duration: '90 days', thirdParty: true };
  }
  return { category: 'Unknown', purpose: 'Purpose could not be determined from the cookie name.', duration: 'Unknown', thirdParty: false };
}

const SCRIPT_SIGNATURES = [
  { pattern: /google-analytics\.com|gtag\.js|UA-\d+|G-[A-Z0-9]+/i, cookies: ['_ga', '_gid', '_gat'] },
  { pattern: /connect\.facebook\.net|fbevents\.js|fbq\(/i,           cookies: ['_fbp', '_fbc'] },
  { pattern: /clarity\.ms|microsoft clarity/i,                         cookies: ['_clck', '_clsk'] },
  { pattern: /static\.hotjar\.com|hj\(\s*window/i,                    cookies: ['_hjid', '_hjsession'] },
  { pattern: /googletagmanager\.com\/gtm/i,                            cookies: ['_gcl_au'] },
  { pattern: /doubleclick\.net/i,                                      cookies: ['IDE'] },
  { pattern: /cdn\.segment\.com/i,                                     cookies: ['ajs_user_id'] }
];

function parseCookieHeader(str) {
  const parts = str.split(';');
  const nameVal = parts[0].trim();
  const eqIdx = nameVal.indexOf('=');
  if (eqIdx < 0) return null;
  const name = nameVal.substring(0, eqIdx).trim();
  const attrs = {};
  parts.slice(1).forEach(part => {
    const [k, v] = part.split('=').map(s => s.trim());
    attrs[k.toLowerCase()] = v || true;
  });
  return { name, httpOnly: !!attrs['httponly'], secure: !!attrs['secure'], sameSite: attrs['samesite'] || 'None', maxAge: attrs['max-age'] ? parseInt(attrs['max-age']) : null, expires: attrs['expires'] || null };
}

function calcScore(cookies) {
  let score = 100;
  cookies.forEach(c => {
    if (c.category === 'Advertising') score -= 10;
    if (c.category === 'Analytics')   score -= 4;
    if (c.category === 'Unknown')      score -= 3;
    if (c.thirdParty)                  score -= 2;
    const longLived = c.maxAge > 365 * 24 * 3600 || /year|month/i.test(c.duration || '');
    if (longLived && c.category !== 'Essential') score -= 3;
  });
  const allEssential = cookies.every(c => c.category === 'Essential');
  if (allEssential && cookies.length > 0) score += 10;
  return Math.max(0, Math.min(100, Math.round(score)));
}

router.post('/', async (req, res, next) => {
  try {
    let { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required.' });
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;

    try { new URL(url); } catch { return res.status(400).json({ error: 'Please enter a valid URL.' }); }

    const hostname = new URL(url).hostname;
    if (/^(localhost|127\.|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname)) {
      return res.status(400).json({ error: 'Private or localhost URLs are not supported.' });
    }

    const reqConfig = {
      timeout: 12000,
      maxRedirects: 5,
      validateStatus: () => true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    };

    const response = await axios.get(url, reqConfig);
    const rawHeaders = response.headers;
    const html = typeof response.data === 'string' ? response.data : '';

    let setCookieHeaders = rawHeaders['set-cookie'] || [];
    if (!Array.isArray(setCookieHeaders)) setCookieHeaders = [setCookieHeaders];

    const seen = new Set();
    const cookies = [];

    setCookieHeaders.forEach(str => {
      const parsed = parseCookieHeader(str);
      if (!parsed || seen.has(parsed.name)) return;
      seen.add(parsed.name);

      const dbKey = Object.keys(COOKIE_DB).find(k =>
        parsed.name === k || parsed.name.startsWith(k + '_') || parsed.name.startsWith(k)
      );
      const dbEntry = dbKey ? COOKIE_DB[dbKey] : null;
      const classified = dbEntry || classifyUnknownCookie(parsed.name);

      cookies.push({
        name: parsed.name,
        source: 'header',
        category: classified.category,
        company: dbEntry?.company || null,
        displayName: dbEntry?.name || parsed.name,
        purpose: classified.purpose,
        duration: dbEntry?.duration || classified.duration,
        thirdParty: classified.thirdParty,
        httpOnly: parsed.httpOnly,
        secure: parsed.secure,
        sameSite: parsed.sameSite,
        maxAge: parsed.maxAge
      });
    });

    SCRIPT_SIGNATURES.forEach(sig => {
      if (sig.pattern.test(html)) {
        sig.cookies.forEach(cookieName => {
          if (seen.has(cookieName)) return;
          seen.add(cookieName);
          const db = COOKIE_DB[cookieName];
          if (!db) return;
          cookies.push({
            name: cookieName,
            source: 'script',
            category: db.category,
            company: db.company,
            displayName: db.name,
            purpose: db.purpose,
            duration: db.duration,
            thirdParty: db.thirdParty,
            httpOnly: false,
            secure: false,
            sameSite: 'Unknown',
            maxAge: null
          });
        });
      }
    });

    const summary = {
      total: cookies.length,
      essential:   cookies.filter(c => c.category === 'Essential').length,
      analytics:   cookies.filter(c => c.category === 'Analytics').length,
      advertising: cookies.filter(c => c.category === 'Advertising').length,
      functional:  cookies.filter(c => c.category === 'Functional').length,
      unknown:     cookies.filter(c => c.category === 'Unknown').length,
      thirdParty:  cookies.filter(c => c.thirdParty).length,
      longLived:   cookies.filter(c => {
        const t = c.maxAge;
        return (t && t > 365 * 24 * 3600) || /year/i.test(c.duration || '');
      }).length
    };

    const privacyScore = cookies.length === 0 ? null : calcScore(cookies);

    let verdict = 'No cookies detected in HTTP headers or known tracking scripts.';
    if (cookies.length > 0) {
      if (privacyScore >= 80) verdict = 'Good privacy posture. Mostly essential cookies with minimal tracking.';
      else if (privacyScore >= 60) verdict = 'Moderate tracking. This site uses analytics and some third-party cookies.';
      else if (privacyScore >= 40) verdict = 'Significant tracking detected. Advertising and analytics cookies are active.';
      else verdict = 'Heavy tracking. Multiple advertising and third-party cookies are collecting your data.';
    }

    return res.json({
      url,
      domain: hostname,
      privacyScore,
      cookies,
      summary,
      verdict,
      note: 'Results show cookies from HTTP response headers and detected tracking scripts. JavaScript-injected cookies may not appear here.'
    });

  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
        return res.status(504).json({ error: 'Request timed out. The site may be offline or blocking requests.' });
      }
      if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
        return res.status(504).json({ error: 'Unable to reach that URL. Please check it is correct and accessible.' });
      }
    }
    next(err);
  }
});

export default router;
