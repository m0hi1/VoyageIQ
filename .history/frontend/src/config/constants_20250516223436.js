/**
 * Config file for frontend environment variables and constants
 */

// API base URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3050/api/v1';

// Auth related constants
export const AUTH_TOKEN_KEY = 'voyageiq_auth_token';
export const USER_INFO_KEY = 'voyageiq_user';

// App constants
export const APP_NAME = 'VoyageIQ';
export const COPYRIGHT_YEAR = new Date().getFullYear();

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 1;

// Image paths and placeholders
export const DEFAULT_USER_AVATAR = '/user.png';
export const DEFAULT_TOUR_IMAGE = '/trip-placeholder.webp';

// Timeouts
export const TOAST_AUTO_CLOSE_MS = 5000;
export const SEARCH_DEBOUNCE_MS = 500;

// Feature flags
export const FEATURES = {
  ENABLE_AI_TRIP: true,
  ENABLE_REVIEWS: true,
  ENABLE_SOCIAL_LOGIN: true,
};

// Social media links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/voyageiq',
  TWITTER: 'https://twitter.com/voyageiq',
  INSTAGRAM: 'https://instagram.com/voyageiq',
};
