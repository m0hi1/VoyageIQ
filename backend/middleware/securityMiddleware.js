/**
 * Security middleware for protecting against common web vulnerabilities
 */

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';

/**
 * Configure security middleware for Express application
 * @param {Express} app - Express application
 * @param {Object} config - Application configuration
 */
export const configureSecurity = (app, config) => {
  // Set security HTTP headers using helmet
  app.use(helmet());

  // CORS configuration
  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (config.cors.allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  };
  
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); // Enable pre-flight requests

  // Rate limiting to prevent brute force and DoS attacks
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: config.isDevelopment ? 500 : 100, // Higher limit in development
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', generalLimiter);

  // More aggressive rate limiting for authentication routes
  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 requests per hour
    message: 'Too many login attempts, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/v1/auth/login', authLimiter);
  app.use('/api/v1/auth/forgot-password', authLimiter);

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // Data sanitization against XSS (Cross-site scripting)
  app.use(xss());

  // Prevent HTTP Parameter Pollution
  app.use(hpp({
    whitelist: [
      'duration',
      'price',
      'difficulty',
      'maxGroupSize'
    ]
  }));
};

export default configureSecurity;
