import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import { setupSwagger } from './utils/swagger.js';
import logger from './utils/logger.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import tripRoutes from './routes/tripRoutes.js';

const app = express();
const PORT = process.env.PORT || 3051;

// Improved MongoDB connection with retry logic
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // No longer needed in Mongoose 6+
      // useFindAndModify: false, // No longer needed in Mongoose 6+
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    // Retry connection after 5 seconds
    // setTimeout(connectDB, 5000); // Consider a more robust retry strategy or exit
    process.exit(1); // Exit if DB connection fails initially
  }
}

// Call the connectDB function to establish the connection
connectDB();

// Middleware for CORS
const allowedOrigins = [
  'https://voyageiq.vercel.app',
  'http://localhost:5173'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight requests for all routes

// Essential security headers
app.use(helmet());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: '10kb' })); // Limit request body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for compressing responses
app.use(compression());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 500 : 100, // Max requests per IP
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter); // Apply to all API routes

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/trips', tripRoutes);

// Swagger documentation setup
setupSwagger(app);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Middleware for handling 404 Not Found errors (must be after routes)
app.use(notFound);

// Global error handling middleware (must be the last middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  // Close server & exit process
  // server.close(() => { // Ensure server is defined if you use this
  //   process.exit(1);
  // });
  process.exit(1); // More abrupt, but ensures exit
});

// Handle SIGTERM signal (e.g., from Docker or PaaS)
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  // server.close(() => { // Ensure server is defined if you use this
  //   logger.info('💥 Process terminated!');
  // });
  process.exit(0); // Exit gracefully
});
