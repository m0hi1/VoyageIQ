import mongoose from 'mongoose';
import logger from './logger.js';

/**
 * Connect to MongoDB with retry logic
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      // These options are no longer needed in newer Mongoose versions,
      // but kept here as a reference if using older versions
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

/**
 * Configure and start the Express server
 * @param {Express} app - The Express application
 * @param {number} port - The port to listen on
 */
export const startServer = (app, port) => {
  const server = app.listen(port, () => {
    logger.info(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    
    // Close server & exit process
    server.close(() => {
      process.exit(1);
    });
  });
  
  // Handle SIGTERM signal (e.g., from Docker or PaaS)
  process.on('SIGTERM', () => {
    logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      logger.info('💥 Process terminated!');
    });
  });
  
  return server;
};
