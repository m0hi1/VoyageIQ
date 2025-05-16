import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import config from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import { setupSwagger } from './utils/swagger.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import tripRoutes from './routes/tripRoutes.js';

/**
 * Initialize Express application with middleware and routes
 * @returns {Express} Configured Express application
 */
const createApp = () => {
  const app = express();
    // CORS configuration from central config
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
  app.options('*', cors(corsOptions)); // Enable pre-flight requests for all routes

  // Security headers
  app.use(helmet());

  // Parse request bodies
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  
  // Parse cookies
  app.use(cookieParser());
  
  // Compress responses
  app.use(compression());
  
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'development' ? 500 : 100,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  app.use('/api', limiter);
  
  // API routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/tours', tourRoutes);
  app.use('/api/v1/reviews', reviewRoutes);
  app.use('/api/v1/bookings', bookingRoutes);
  app.use('/api/v1/trips', tripRoutes);
  
  // Swagger API documentation
  setupSwagger(app);
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
  });
  
  // Error handling
  app.use(notFound); // 404 handler
  app.use(errorHandler); // Global error handler
  
  return app;
};

export default createApp;
