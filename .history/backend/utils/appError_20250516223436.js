/**
 * Custom API error class for consistent error responses
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Used to distinguish from programming or unexpected errors
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
