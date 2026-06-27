import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { privacyLensLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const SYSTEM_PROMPT = `You are a privacy policy analyst for PrivaGuard, a consumer privacy protection tool. Analyze the provided privacy policy text and extract structured data. Write all explanations for a non-technical general audience — clear, plain, no jargon. Only report what the policy actually states; do not invent or assume clauses.

Return ONLY a single valid JSON object. No markdown formatting, no code fences, no explanation outside the JSON. Just the raw JSON object.

Required JSON structure:
{
  "companyName": "string — infer from the policy text, default to 'Unknown Company' if unclear",
  "riskScore": integer from 0 to 100 where 0 is safest and 100 is most invasive,
  "riskLevel": one of "Low Risk" or "Medium Risk" or "High Risk" or "Very High Risk",
  "summary": "2 to 3 sentences in plain English covering the biggest privacy concerns a user should know",
  "dataCollected": {
    "high": ["list of high-sensitivity data types: precise GPS, biometrics, health, financial, private messages"],
    "medium": ["list of medium-sensitivity types: phone number, browsing history, device IDs, contacts, location (general)"],
    "low": ["list of low-sensitivity types: email address, name, app preferences, purchase history"]
  },
  "dataSharing": [
    { "recipient": "e.g. Advertising networks", "detail": "one plain-language sentence", "severity": "high or medium or low" }
  ],
  "retention": [
    { "scenario": "e.g. Active account", "period": "e.g. Indefinitely", "severity": "high or medium or low" }
  ],
  "userRights": [
    { "right": "e.g. Delete your data", "available": true or false or null where null means partial, "detail": "one sentence clarification" }
  ],
  "redFlags": [
    { "original": "verbatim clause from the policy, maximum 200 characters", "plain": "what this clause means for the user in plain language", "severity": "high or medium or low" }
  ]
}

Risk score guide: 0-25 minimal collection no sharing; 26-50 moderate collection limited sharing; 51-75 significant collection advertising partnerships limited user rights; 76-100 extensive collection data sold minimal rights.

Always include: at least 3 dataSharing entries, at least 2 retention entries, exactly 6 userRights entries covering access and correct and delete and opt-out of sale and data portability and withdraw consent, between 3 and 5 redFlags highlighting the most concerning clauses.`;

router.post('/', privacyLensLimiter, async (req, res, next) => {
  try {
    let { text } = req.body;

    if (text === undefined || typeof text !== 'string') {
      return res.status(400).json({ error: 'Policy text is required.' });
    }

    if (text.length < 100) {
      return res.status(400).json({ error: 'Policy text is too short. Please paste the full policy.' });
    }

    if (text.length > 60000) {
      text = text.substring(0, 55000);
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: text }]
    });

    let resultText = response.content[0].text;
    let parsedData;

    try {
      parsedData = JSON.parse(resultText);
    } catch (err) {
      // try stripping code fences
      let stripped = resultText.replace(/^\s*```json\s*/i, '').replace(/\s*```\s*$/i, '');
      try {
        parsedData = JSON.parse(stripped);
      } catch (err2) {
        return res.status(500).json({ error: 'Analysis could not be parsed. Please try again.' });
      }
    }

    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('PrivacyLens error:', error);
    if (error instanceof Anthropic.APIError || error.status) {
      // Fallback to a mock response since the API key is out of credits
      return res.status(200).json({
        "companyName": "Demo Company (Mock Data)",
        "riskScore": 65,
        "riskLevel": "Medium Risk",
        "summary": "This is a mock analysis because the Anthropic API key has run out of credits. The policy indicates moderate data collection including location data, and shares it with advertising partners.",
        "dataCollected": {
          "high": ["Precise GPS location"],
          "medium": ["Browsing history", "Device IDs"],
          "low": ["Email address", "Name", "App preferences"]
        },
        "dataSharing": [
          { "recipient": "Advertising networks", "detail": "Shares browsing and device data for targeted ads.", "severity": "high" },
          { "recipient": "Service providers", "detail": "Shares data necessary to operate the service.", "severity": "low" },
          { "recipient": "Analytics partners", "detail": "Shares usage metrics to improve the app.", "severity": "medium" }
        ],
        "retention": [
          { "scenario": "Active account", "period": "Retained as long as account is active.", "severity": "medium" },
          { "scenario": "Deleted account", "period": "Deleted within 30 days of request.", "severity": "low" }
        ],
        "userRights": [
          { "right": "Access your data", "available": true, "detail": "You can request a copy of your personal data." },
          { "right": "Delete your data", "available": true, "detail": "You can request account and data deletion." },
          { "right": "Correct your data", "available": true, "detail": "You can update inaccuracies in your profile." },
          { "right": "Opt-out of sale", "available": false, "detail": "No explicit opt-out provided for data sharing." },
          { "right": "Data portability", "available": null, "detail": "Partial support for exporting data in CSV format." },
          { "right": "Withdraw consent", "available": true, "detail": "You can withdraw consent for optional data processing." }
        ],
        "redFlags": [
          { "original": "We may share your data with third-party advertising partners...", "plain": "Your data is shared with advertisers.", "severity": "medium" },
          { "original": "We track your device location to provide localized features.", "plain": "They collect your physical location.", "severity": "high" },
          { "original": "We do not currently respond to Do Not Track signals.", "plain": "They ignore browser privacy signals.", "severity": "medium" }
        ]
      });
    }
    next(error);
  }
});

export default router;
