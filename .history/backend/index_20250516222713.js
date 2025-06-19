/**
 * Server entry point
 */
import dotenv from 'dotenv';
dotenv.config();

import logger from './utils/logger.js';
import { connectDB, startServer } from './utils/serverConfig.js';
import createApp from './app.js';

/**
 * Main server initialization function
 */
async function main() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Create Express app
    const app = createApp();
    
    // Start the server
    const PORT = process.env.PORT || 3050;
    startServer(app, PORT);
    
  } catch (error) {
    logger.error('Server initialization failed:', error);
    process.exit(1);
  }
}

// Start the application
main();
