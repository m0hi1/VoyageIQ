import logger from '../utils/logger.js';
import config from '../config/index.js';

// Handle specific mongoose/DB errors
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return { status: 400, message };
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return { status: 400, message };
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return { status: 400, message };
};

const handleJWTError = () => {
  return { status: 401, message: 'Invalid token. Please log in again!' };
};

const handleJWTExpiredError = () => {
  return { status: 401, message: 'Your token has expired! Please log in again.' };
};

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Default status code
  let statusCode = err.statusCode || res.statusCode;
  if (statusCode === 200) statusCode = 500;
  
  // Default error object
  let errorResponse = {
    status: err.status || 'error',
    message: err.message || 'Something went wrong',
    ...(config.isDevelopment && { stack: err.stack })
  };
  
  // Log errors
  if (statusCode >= 500) {
    logger.error(`💥 ERROR: ${err}`);
    config.isDevelopment && logger.error(err.stack);
  } else {
    logger.warn(`⚠️ REQUEST ERROR: ${err.message}`);
  }

  // Handle specific error types
  if (err.name === 'CastError') {
    const { status, message } = handleCastErrorDB(err);
    statusCode = status;
    errorResponse.message = message;
  }
  if (err.code === 11000) {
    const { status, message } = handleDuplicateFieldsDB(err);
    statusCode = status;
    errorResponse.message = message;
  }
  if (err.name === 'ValidationError') {
    const { status, message } = handleValidationErrorDB(err);
    statusCode = status;
    errorResponse.message = message;
  }
  if (err.name === 'JsonWebTokenError') {
    const { status, message } = handleJWTError();
    statusCode = status;
    errorResponse.message = message;
  }
  if (err.name === 'TokenExpiredError') {
    const { status, message } = handleJWTExpiredError();
    statusCode = status;
    errorResponse.message = message;
  }

  // Send response
  res.status(statusCode).json(errorResponse);
};
