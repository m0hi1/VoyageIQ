/**
 * Central configuration for the backend application
 * Loads and validates environment variables, and exports a single config object
 */

import dotenv from 'dotenv';
import Joi from 'joi';

// Load environment variables
dotenv.config();

// Define validation schema for environment variables
const envSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3050),
    MONGO_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('90d'),
    JWT_COOKIE_EXPIRES_IN: Joi.number().default(90),
    CLIENT_URL: Joi.string().default('http://localhost:5173')
  })
  .unknown(); // Allow unknown keys

// Validate environment variables
const { value: envVars, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Create a unified config object
const config = {
  env: envVars.NODE_ENV,
  isProduction: envVars.NODE_ENV === 'production',
  isDevelopment: envVars.NODE_ENV === 'development',
  isTest: envVars.NODE_ENV === 'test',
  port: envVars.PORT,
  mongo: {
    url: envVars.MONGO_URL,
    options: {
      // MongoDB connection options if needed
    }
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
    cookieExpiresIn: envVars.JWT_COOKIE_EXPIRES_IN
  },
  client: {
    url: envVars.CLIENT_URL
  },
  cors: {
    allowedOrigins: [
      envVars.CLIENT_URL,
      'https://voyageiq.vercel.app',
      'http://localhost:5173',
      'http://localhost'
    ]
  }
};

export default config;
