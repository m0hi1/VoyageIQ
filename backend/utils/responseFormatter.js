/**
 * Utility for formatting consistent API responses
 */

/**
 * Format a successful response
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted success response
 */
export const successResponse = (data = null, message = 'Success', statusCode = 200) => {
  return {
    status: 'success',
    statusCode,
    message,
    data,
  };
};

/**
 * Format a paginated response
 * @param {Array} data - Response data array
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} totalItems - Total number of items
 * @param {string} message - Success message
 * @returns {Object} Formatted paginated response
 */
export const paginatedResponse = (data, page, limit, totalItems, message = 'Success') => {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    status: 'success',
    statusCode: 200,
    message,
    data,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  };
};

/**
 * Format an error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} errors - Optional validation errors
 * @returns {Object} Formatted error response
 */
export const errorResponse = (message = 'An error occurred', statusCode = 500, errors = null) => {
  return {
    status: 'error',
    statusCode,
    message,
    ...(errors && { errors }),
  };
};

/**
 * Format a not found response
 * @param {string} resource - Name of the resource not found
 * @returns {Object} Formatted not found response
 */
export const notFoundResponse = (resource = 'Resource') => {
  return errorResponse(`${resource} not found`, 404);
};

/**
 * Format a validation error response
 * @param {Object} errors - Validation errors object
 * @returns {Object} Formatted validation error response
 */
export const validationErrorResponse = (errors) => {
  return errorResponse('Validation failed', 400, errors);
};

/**
 * Format an unauthorized response
 * @param {string} message - Error message
 * @returns {Object} Formatted unauthorized response
 */
export const unauthorizedResponse = (message = 'Unauthorized') => {
  return errorResponse(message, 401);
};

/**
 * Format a forbidden response
 * @param {string} message - Error message
 * @returns {Object} Formatted forbidden response
 */
export const forbiddenResponse = (message = 'Forbidden') => {
  return errorResponse(message, 403);
};
