const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const config = require('../config/config');

/**
 * Configure CORS (Cross-Origin Resource Sharing)
 * 
 * Why CORS is important:
 * - Controls which domains can access your API
 * - Prevents unauthorized cross-origin requests
 * - Essential for frontend-backend communication
 * 
 * @returns {Function} CORS middleware
 */
const configureCors = () => {
  const rawOrigin = config.security.cors.origin || '';
  const allowAll = rawOrigin.trim() === '*';
  const allowedOrigins = allowAll
    ? []
    : rawOrigin.split(',').map(o => o.trim()).filter(Boolean);

  // Wildcard patterns (e.g. "*.vercel.app") from CORS_ORIGIN_PATTERNS env var
  const rawPatterns = process.env.CORS_ORIGIN_PATTERNS || '';
  const originPatterns = rawPatterns
    .split(',')
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => new RegExp('^' + p.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$'));

  const isOriginAllowed = (origin) => {
    if (allowedOrigins.includes(origin)) return true;
    return originPatterns.some(pattern => pattern.test(origin));
  };

  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      // Allow all origins if configured with *
      if (allowAll) return callback(null, true);
      if (isOriginAllowed(origin)) return callback(null, true);
      // Return false (block) instead of throwing — avoids hitting globalErrorHandler
      return callback(null, false);
    },
    // credentials only makes sense with specific origins, not wildcard
    credentials: !allowAll && config.security.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 204
  });
};

/**
 * Configure Helmet for Security Headers
 * 
 * Helmet sets various HTTP headers to secure Express apps:
 * - X-Content-Type-Options: nosniff (prevents MIME type sniffing)
 * - X-Frame-Options: DENY (prevents clickjacking)
 * - X-XSS-Protection: 1; mode=block (enables XSS filtering)
 * - And many more...
 * 
 * @returns {Function} Helmet middleware
 */
const configureHelmet = () => {
  return helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    // Cross-Origin Embedder Policy
    crossOriginEmbedderPolicy: config.server.isProduction,
    // Only enable HSTS in production with HTTPS
    hsts: config.server.isProduction ? {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    } : false
  });
};

/**
 * General Rate Limiting — DISABLED for debugging
 */
const generalRateLimit = (req, res, next) => next();

/**
 * Auth Rate Limiting — DISABLED for debugging
 * Replace with real rateLimit() when ready to re-enable
 */
const authRateLimit = (req, res, next) => next();

/**
 * Request Logging Middleware
 * 
 * Logs incoming requests for monitoring and debugging.
 * Only logs detailed info in development.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      console.error(`❌ ${req.method} ${req.originalUrl} - ${res.statusCode} - ${Date.now() - start}ms`);
    }
  });
  next();
};

/**
 * Security Headers Middleware
 * 
 * Additional custom security headers not covered by Helmet
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const additionalSecurityHeaders = (req, res, next) => {
  // Remove X-Powered-By header to hide Express
  res.removeHeader('X-Powered-By');
  
  // Add custom API version header
  res.setHeader('X-API-Version', '1.0');
  
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};

/**
 * Apply All Security Middlewares
 * 
 * This function applies all security middlewares to the Express app
 * in the correct order.
 * 
 * @param {Object} app - Express application instance
 */
const applySecurity = (app) => {
  app.use(requestLogger);
  app.use(configureCors());
  // Handle preflight requests that were blocked by CORS (origin returned false)
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS' && !res.getHeader('Access-Control-Allow-Origin')) {
      return res.status(403).json({ success: false, message: 'CORS: origin not allowed' });
    }
    next();
  });
  app.use(configureHelmet());
  app.use(additionalSecurityHeaders);
  app.use(generalRateLimit);
};

// Export middlewares and configuration function
module.exports = {
  applySecurity,
  authRateLimit,
  generalRateLimit,
  requestLogger
};