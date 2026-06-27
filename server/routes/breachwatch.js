import express from 'express';
import { XposedOrNot } from 'xposedornot';
import { breachWatchLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const xon = new XposedOrNot({
  timeout: 15000,
  retries: 3
});

router.post('/', breachWatchLimiter, async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const result = await xon.getBreachAnalytics(email);

    if (result.found === false) {
      return res.status(200).json({
        breaches: [],
        totalBreaches: 0,
        riskLevel: "Clean",
        message: "Good news — this email address has not appeared in any known data breaches."
      });
    }

    const exposedBreaches = result.analytics?.ExposedBreaches?.breaches_details || [];

    const processedBreaches = exposedBreaches.map(breach => {
      const dataTypes = typeof breach.xposed_data === 'string' ? breach.xposed_data.split(';').map(s => s.trim()).filter(Boolean) : [];
      const passwordRisk = breach.password_risk || 'unknown';
      let severity = 'low';

      const highSeverityTypes = ['Passwords', 'Credit cards', 'Banking details', 'Financial data', 'Social security numbers', 'Partial credit card data'];
      const mediumSeverityTypes = ['Email addresses', 'Phone numbers', 'Physical addresses', 'Dates of birth', 'IP addresses'];

      if (dataTypes.some(type => highSeverityTypes.includes(type)) || passwordRisk === 'easytocrack' || passwordRisk === 'plaintext') {
        severity = 'high';
      } else if (dataTypes.some(type => mediumSeverityTypes.includes(type))) {
        severity = 'medium';
      }

      let passwordRiskLabel = 'Password storage method unknown';
      if (passwordRisk === 'easytocrack') passwordRiskLabel = 'Weak hash — easily cracked';
      else if (passwordRisk === 'plaintext') passwordRiskLabel = 'Exposed as plaintext';
      else if (passwordRisk === 'stronghash') passwordRiskLabel = 'Strong hash — low cracking risk';

      let remediationSteps = [];
      if (severity === 'high') {
        remediationSteps = [
          "Change your password on this site immediately and do not reuse it anywhere else",
          "Check every site where you used the same password and change those too",
          "Enable two-factor authentication on this account and your email account",
          "Monitor your financial accounts and credit report for suspicious activity"
        ];
      } else if (severity === 'medium') {
        remediationSteps = [
          "Consider changing your password on this site as a precaution",
          "Enable two-factor authentication if the site supports it",
          "Be alert for phishing emails that reference your exposed personal details"
        ];
      } else if (severity === 'low') {
        remediationSteps = [
          "No urgent action required, but stay alert for unusual account activity",
          "Enabling two-factor authentication is always a good security measure"
        ];
      }

      return {
        name: breach.breach,
        breachDate: breach.xposed_date,
        domain: breach.domain,
        dataTypes: dataTypes,
        recordCount: breach.xposed_records,
        description: breach.details,
        industry: breach.industry,
        passwordRisk: passwordRisk,
        verified: breach.verified === 'Yes' || breach.verified === true,
        logo: breach.logo,
        severity,
        passwordRiskLabel,
        remediationSteps
      };
    });

    processedBreaches.sort((a, b) => new Date(b.breachDate) - new Date(a.breachDate));

    let riskLevel = 'Low';
    if (processedBreaches.some(b => b.severity === 'high')) {
      riskLevel = 'Critical';
    } else if (processedBreaches.some(b => b.severity === 'medium')) {
      riskLevel = 'Elevated';
    }

    return res.status(200).json({
      breaches: processedBreaches,
      totalBreaches: processedBreaches.length,
      riskLevel,
      message: `Found ${processedBreaches.length} breach(es). Your data has been exposed in ${processedBreaches.length} known data breach(es).`
    });

  } catch (error) {
    if (error.name === 'RateLimitError') {
      return res.status(429).json({ error: 'Breach database rate limit reached. Please wait a few seconds and try again.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid email address format.' });
    }
    if (error.name === 'NetworkError' || error.name === 'TimeoutError') {
      return res.status(504).json({ error: 'Unable to reach the breach database. Please try again.' });
    }
    next(error);
  }
});

export default router;
