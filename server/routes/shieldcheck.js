import express from 'express';
import axios from 'axios';
import { shieldCheckLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const HEADERS_DEF = [
  {
    key: 'content-security-policy',
    name: 'Content-Security-Policy',
    weight: 25,
    required: true,
    risk: 'Without CSP, attackers can inject and execute malicious scripts via XSS attacks, potentially stealing session cookies, redirecting users, or defacing the site.',
    whatItPrevents: 'Cross-Site Scripting (XSS), data injection, code injection attacks',
    recommended: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; frame-ancestors 'none';",
    code: {
      nginx: "add_header Content-Security-Policy \"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-ancestors 'none';\" always;",
      apache: "Header always set Content-Security-Policy \"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-ancestors 'none';\"",
      express: "app.use((req, res, next) => {\n  res.setHeader('Content-Security-Policy', \"default-src 'self'; script-src 'self'; frame-ancestors 'none';\");\n  next();\n});"
    }
  },
  {
    key: 'strict-transport-security',
    name: 'Strict-Transport-Security',
    weight: 25,
    required: true,
    risk: 'Without HSTS, network attackers can intercept and downgrade HTTPS connections to unencrypted HTTP, exposing session tokens, passwords, and sensitive data.',
    whatItPrevents: 'SSL stripping, man-in-the-middle attacks, protocol downgrade attacks',
    recommended: 'max-age=31536000; includeSubDomains; preload',
    code: {
      nginx: 'add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;',
      apache: 'Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"',
      express: "app.use((req, res, next) => {\n  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');\n  next();\n});"
    }
  },
  {
    key: 'x-frame-options',
    name: 'X-Frame-Options',
    weight: 15,
    required: true,
    risk: 'The site can be embedded in an invisible iframe and used to trick users into clicking hidden UI elements — for example, unknowingly authorising a bank transfer or account action.',
    whatItPrevents: 'Clickjacking attacks, UI redress attacks',
    recommended: 'DENY',
    code: {
      nginx: 'add_header X-Frame-Options "DENY" always;',
      apache: 'Header always set X-Frame-Options "DENY"',
      express: "app.use((req, res, next) => {\n  res.setHeader('X-Frame-Options', 'DENY');\n  next();\n});"
    }
  },
  {
    key: 'x-content-type-options',
    name: 'X-Content-Type-Options',
    weight: 15,
    required: true,
    risk: 'Browsers may misinterpret file types, allowing attackers to disguise a malicious script as an image or text file and execute it.',
    whatItPrevents: 'MIME type sniffing, content-type confusion attacks',
    recommended: 'nosniff',
    code: {
      nginx: 'add_header X-Content-Type-Options "nosniff" always;',
      apache: 'Header always set X-Content-Type-Options "nosniff"',
      express: "app.use((req, res, next) => {\n  res.setHeader('X-Content-Type-Options', 'nosniff');\n  next();\n});"
    }
  },
  {
    key: 'referrer-policy',
    name: 'Referrer-Policy',
    weight: 10,
    required: false,
    risk: 'Sensitive URL parameters such as session tokens or private query strings are leaked to external sites when users navigate away.',
    whatItPrevents: 'Sensitive URL leakage via the HTTP Referer header',
    recommended: 'strict-origin-when-cross-origin',
    code: {
      nginx: 'add_header Referrer-Policy "strict-origin-when-cross-origin" always;',
      apache: 'Header always set Referrer-Policy "strict-origin-when-cross-origin"',
      express: "app.use((req, res, next) => {\n  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');\n  next();\n});"
    }
  },
  {
    key: 'permissions-policy',
    name: 'Permissions-Policy',
    weight: 5,
    required: false,
    risk: 'Any JavaScript running on the page — including third-party advertising or analytics scripts — can access the camera, microphone, or geolocation without restriction.',
    whatItPrevents: 'Unauthorised access to browser APIs and device hardware features',
    recommended: 'camera=(), microphone=(), geolocation=(), payment=()',
    code: {
      nginx: 'add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;',
      apache: 'Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"',
      express: "app.use((req, res, next) => {\n  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');\n  next();\n});"
    }
  },
  {
    key: 'x-xss-protection',
    name: 'X-XSS-Protection',
    weight: 3,
    required: false,
    risk: 'Older browsers without built-in XSS filtering are more vulnerable to reflected XSS attacks. Modern browsers use CSP instead, but this header provides a safety net for legacy users.',
    whatItPrevents: 'Reflected XSS in legacy browsers (Internet Explorer, old Safari)',
    recommended: '1; mode=block',
    code: {
      nginx: 'add_header X-XSS-Protection "1; mode=block" always;',
      apache: 'Header always set X-XSS-Protection "1; mode=block"',
      express: "app.use((req, res, next) => {\n  res.setHeader('X-XSS-Protection', '1; mode=block');\n  next();\n});"
    }
  },
  {
    key: 'cross-origin-opener-policy',
    name: 'Cross-Origin-Opener-Policy',
    weight: 2,
    required: false,
    risk: 'Cross-origin scripts can access window properties and perform Spectre-style timing attacks to read memory across browser tabs.',
    whatItPrevents: 'Cross-origin information leakage, Spectre side-channel attacks',
    recommended: 'same-origin',
    code: {
      nginx: 'add_header Cross-Origin-Opener-Policy "same-origin" always;',
      apache: 'Header always set Cross-Origin-Opener-Policy "same-origin"',
      express: "app.use((req, res, next) => {\n  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');\n  next();\n});"
    }
  },
  {
    key: 'cross-origin-resource-policy',
    name: 'Cross-Origin-Resource-Policy',
    weight: 2,
    required: false,
    risk: 'Resources from this origin can be loaded by any external site, potentially enabling Spectre-style data exfiltration from authenticated responses.',
    whatItPrevents: 'Unauthorised cross-origin resource loading, Spectre-based data theft',
    recommended: 'same-origin',
    code: {
      nginx: 'add_header Cross-Origin-Resource-Policy "same-origin" always;',
      apache: 'Header always set Cross-Origin-Resource-Policy "same-origin"',
      express: "app.use((req, res, next) => {\n  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');\n  next();\n});"
    }
  },
  {
    key: 'cross-origin-embedder-policy',
    name: 'Cross-Origin-Embedder-Policy',
    weight: 2,
    required: false,
    risk: 'Resources embedded from other origins may not require CORS approval, enabling potential data exfiltration through cross-origin side-channel attacks.',
    whatItPrevents: 'Unauthorised cross-origin embedding, SharedArrayBuffer exploitation',
    recommended: 'require-corp',
    code: {
      nginx: 'add_header Cross-Origin-Embedder-Policy "require-corp" always;',
      apache: 'Header always set Cross-Origin-Embedder-Policy "require-corp"',
      express: "app.use((req, res, next) => {\n  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');\n  next();\n});"
    }
  }
];

function getGrade(score) {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  if (score >= 30) return 'D';
  return 'F';
}

function getSummary(grade) {
  const summaries = {
    'A+': 'This site has excellent security header coverage. It is well-protected against the most common web attacks.',
    'A':  'This site has strong security headers in place. Minor optional improvements are possible but overall posture is solid.',
    'B':  'This site has good security coverage but is missing some recommended headers. Consider adding the flagged ones for full protection.',
    'C':  'This site has partial security header coverage. Several important headers are absent, leaving meaningful attack surface exposed.',
    'D':  'This site has weak security header configuration. Multiple critical headers are missing, creating significant vulnerability.',
    'F':  'This site has no meaningful security headers. It is highly vulnerable to XSS, clickjacking, and other client-side attacks.'
  };
  return summaries[grade];
}

router.post('/', shieldCheckLimiter, async (req, res, next) => {
  try {
    let { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required.' });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Please enter a valid URL (e.g. https://example.com).' });
    }

    const hostname = parsedUrl.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname)) {
      return res.status(400).json({ error: 'Private and localhost URLs are not supported.' });
    }

    const axiosConfig = {
      timeout: 12000,
      maxRedirects: 5,
      validateStatus: () => true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    };

    let response;
    try {
      response = await axios.head(url, axiosConfig);
      if (Object.keys(response.headers).length < 3) {
        throw new Error('Too few headers in HEAD response');
      }
    } catch (e) {
      response = await axios.get(url, axiosConfig);
    }

    let score = 0;
    let headersPresent = 0;
    const finalHeaders = [];

    for (const def of HEADERS_DEF) {
      const headerValue = response.headers[def.key];
      const isPresent = !!headerValue;
      
      if (isPresent) {
        score += def.weight;
        headersPresent += 1;
      }
      
      finalHeaders.push({
        ...def,
        present: isPresent,
        currentValue: isPresent ? headerValue : null
      });
    }

    if (score > 100) score = 100;

    const grade = getGrade(score);
    const summary = getSummary(grade);

    const finalUrl = response.request?.res?.responseUrl || response.request?.responseURL || url;
    const ssl = finalUrl.startsWith('https://');

    return res.status(200).json({
      url: finalUrl,
      grade,
      score,
      ssl,
      httpStatus: response.status,
      headersPresent,
      headersTotal: HEADERS_DEF.length,
      summary,
      headers: finalHeaders
    });

  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(504).json({ error: 'Request timed out. The site may be offline or blocking automated requests.' });
    }
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(504).json({ error: 'Unable to reach that URL. Please check it is correct and accessible.' });
    }
    next(error);
  }
});

export default router;
