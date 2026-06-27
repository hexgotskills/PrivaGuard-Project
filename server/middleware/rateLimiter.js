import rateLimit from 'express-rate-limit';

const handler = (req, res, next, options) => {
  res.status(options.statusCode).json({ error: 'Too many requests. Please wait a moment and try again.' });
};

export const privacyLensLimiter = rateLimit({
  windowMs: 60000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});

export const breachWatchLimiter = rateLimit({
  windowMs: 60000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});

export const shieldCheckLimiter = rateLimit({
  windowMs: 60000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});

export const metaCleanerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    error: 'Too many requests. File processing is resource-intensive — please wait a moment.'
  })
});

export const cookieInspectorLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    error: 'Too many requests. Please wait a moment and try again.'
  })
});
