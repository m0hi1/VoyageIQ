import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 * @param  {...any} inputs - Class names to merge
 * @returns {string} - Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Safely access nested object properties
 * @param {Object} obj - Object to access
 * @param {string} path - Path to property (e.g. 'user.address.city')
 * @param {any} defaultValue - Default value if property doesn't exist
 * @returns {any} - Property value or default
 */
export function getPropertySafely(obj, path, defaultValue = null) {
  if (!obj || !path) return defaultValue;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null || !Object.prototype.hasOwnProperty.call(result, key)) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result === undefined ? defaultValue : result;
}

/**
 * Generate a random string of specified length
 * @param {number} length - Length of string to generate
 * @returns {string} - Random string
 */
export function generateRandomString(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @param {number} maxLength - Maximum number of initials to return
 * @returns {string} - Initials
 */
export function getInitials(name, maxLength = 2) {
  if (!name) return '';
  
  return name
    .split(' ')
    .filter(part => part.length > 0)
    .slice(0, maxLength)
    .map(part => part[0].toUpperCase())
    .join('');
}

/**
 * Get image dimensions from a URL
 * @param {string} url - Image URL
 * @returns {Promise<{width: number, height: number}>} - Image dimensions
 */
export function getImageDimensions(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param {any} value - Value to check
 * @returns {boolean} - Whether the value is empty
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Convert file size in bytes to a human-readable format
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
