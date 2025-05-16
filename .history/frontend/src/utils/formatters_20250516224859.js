/**
 * Utility functions for formatting data in the frontend
 */

/**
 * Format a date using Intl.DateTimeFormat
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};

/**
 * Format a date in a relative way (e.g., "2 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeDate = (date) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    
    const now = new Date();
    const diffInSeconds = Math.floor((dateObj - now) / 1000);
    
    // Convert to appropriate unit
    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(diffInSeconds, 'second');
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (Math.abs(diffInMinutes) < 60) {
      return rtf.format(diffInMinutes, 'minute');
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) {
      return rtf.format(diffInHours, 'hour');
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (Math.abs(diffInDays) < 30) {
      return rtf.format(diffInDays, 'day');
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (Math.abs(diffInMonths) < 12) {
      return rtf.format(diffInMonths, 'month');
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return rtf.format(diffInYears, 'year');
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return String(date);
  }
};

/**
 * Format a price with currency symbol
 * @param {number} price - Price to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'USD') => {
  if (price === null || price === undefined) return 'N/A';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  } catch (error) {
    console.error('Error formatting price:', error);
    return `${price}`;
  }
};

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format a phone number to a readable format
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phoneNumber;
};

/**
 * Format a file size in bytes to human-readable format
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
