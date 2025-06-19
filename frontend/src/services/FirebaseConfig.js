import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserLocalPersistence,
  signInWithPopup
} from "firebase/auth";
import { getAnalytics, logEvent } from "firebase/analytics";

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDWPfYUSpj8NXoCJy4BIaLOI0Pg7hgeOhA",
  authDomain: "ai-trip-planner-d4f97.firebaseapp.com",
  projectId: "ai-trip-planner-d4f97",
  storageBucket: "ai-trip-planner-d4f97.firebasestorage.app",
  messagingSenderId: "936341815966",
  appId: "1:936341815966:web:f1fa517ba6d0d7f48d718f",
  measurementId: "G-ZQKWTW7Q4S",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics if not in development mode and window exists (browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Log custom events for analytics
export const logCustomEvent = (eventName, params = {}) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, params);
    } catch (error) {
      console.error("Analytics error:", error);
    }
  }
};

// Configure GoogleAuthProvider for better UX
googleProvider.setCustomParameters({
  prompt: 'select_account',  // Always prompt user to select their account
});

// Add scopes for additional Google user information
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Set persistence to LOCAL to maintain the user logged in
// even when the page is refreshed or closed
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Firebase persistence error:", error);
  });

// Handle Google sign in with improved error handling and debug info
export const signInWithGoogle = async () => {
  try {
    // Log debug info about the environment
    console.debug("Auth domain:", firebaseConfig.authDomain);
    console.debug("Project ID:", firebaseConfig.projectId);
    
    // Pre-flight check - make sure we can access the Google API
    const networkCheck = await checkNetworkConnectivity();
    if (!networkCheck.success) {
      return {
        success: false,
        error: 'network_error',
        message: `Network connectivity issue: ${networkCheck.reason}`
      };
    }
    
    // Use signInWithRedirect instead of popup if having issues
    const result = await signInWithPopup(auth, googleProvider);
    
    // Get user details
    const user = result.user;
    const userInfo = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      googleId: user.uid,
    };
    
    // Log successful login
    logCustomEvent('google_sign_in_success');
    
    return { success: true, user: userInfo };
  } catch (error) {
    console.error("Google sign in error:", error);
    
    // Enhanced error logging with more details
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    if (error.customData && error.customData.email) {
      console.error("Associated email:", error.customData.email);
    }
    
    logCustomEvent('google_sign_in_error', { 
      error_code: error.code,
      error_message: error.message 
    });
    
    // Special handling for configuration-not-found error
    if (error.code === 'auth/configuration-not-found') {
      return {
        success: false,
        error: error.code,
        message: "Google authentication is not properly configured. Please contact support with error: Firebase configuration not found."
      };
    }
    
    // Special handling for popup-blocked
    if (error.code === 'auth/popup-blocked') {
      return {
        success: false,
        error: error.code,
        message: "Login popup was blocked by your browser. Please allow popups for this site and try again."
      };
    }
    
    return { 
      success: false, 
      error: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

// Helper function to check network connectivity
async function checkNetworkConnectivity() {
  // First check if browser is online
  if (!navigator.onLine) {
    return { 
      success: false, 
      reason: 'Browser is offline. Please check your internet connection.' 
    };
  }
  
  // Try to reach Google APIs
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
      await fetch('https://accounts.google.com/gsi/status', { 
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return { success: true };
  } catch (error) {
    console.error("Network connectivity issue:", error);
    return { 
      success: false, 
      reason: 'Cannot reach Google authentication servers. Please check your firewall or internet connection.'
    };
  }
}

// Helper function for user-friendly error messages
export const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    // Popup related errors
    case 'auth/popup-closed-by-user':
      return 'Sign in canceled. You closed the login window.';
    case 'auth/popup-blocked':
      return 'Sign in failed. Please allow popups for this site.';
    case 'auth/cancelled-popup-request':
      return 'Sign in canceled.';
      
    // Account related errors
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email but with different sign-in credentials.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please check your email or register.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or reset your password.';
    
    // Configuration errors
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled. Please contact support.';
    case 'auth/invalid-credential':
      return 'Your login information is invalid. Please try again.';
    case 'auth/configuration-not-found':
      return 'Google authentication is not properly configured. Please try email login instead.';
    
    // Network related errors
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection and try again.';
    case 'auth/timeout':
      return 'Request timeout. Please try again.';
      
    // Custom errors
    case 'network_error':
      return 'Cannot connect to authentication service. Please check your internet connection.';
      
    // Default fallback
    default:
      return 'An error occurred during sign in. Please try again.';
  }
};
