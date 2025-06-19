// Comprehensive Firebase Authentication Utility Functions
import { 
  auth,
  signInWithGoogle as firebaseSignInWithGoogle,
  getAuthErrorMessage,
  logCustomEvent,
  firebaseConfig
} from "../services/FirebaseConfig";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  GoogleAuthProvider
} from "firebase/auth";

/**
 * Get the current user token
 * @returns {Promise<string|null>} The user's ID token or null if not authenticated
 */
export const getToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

/**
 * Get current authenticated user
 * @returns {Object|null} The current user object or null if not authenticated
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Clear token and logout the user from Firebase
 * @returns {Promise<void>}
 */
export const clearToken = async () => {
  logCustomEvent('user_signed_out');
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { 
      success: false,
      error: error.code || 'unknown_error',
      message: getAuthErrorMessage(error.code || 'unknown_error')
    };
  }
};

/**
 * Listen to authentication state changes
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};

/**
 * Sign in with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Authentication result object
 */
export const signInWithEmailPassword = async (email, password) => {
  try {
    logCustomEvent('email_signin_attempt');
    const result = await signInWithEmailAndPassword(auth, email, password);
    logCustomEvent('email_signin_success');
    return { 
      success: true, 
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      }
    };
  } catch (error) {
    console.error("Email sign in error:", error);
    logCustomEvent('email_signin_error', { error_code: error.code });
    return { 
      success: false, 
      error: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Create user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} displayName - User's display name
 * @returns {Promise<Object>} Registration result object
 */
export const createUserWithEmail = async (email, password, displayName) => {
  try {
    logCustomEvent('email_signup_attempt');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    
    logCustomEvent('email_signup_success');
    return { 
      success: true, 
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || displayName,
        photoURL: result.user.photoURL
      }
    };
  } catch (error) {
    console.error("Email sign up error:", error);
    logCustomEvent('email_signup_error', { error_code: error.code });
    return { 
      success: false, 
      error: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Sign in with Google
 * @returns {Promise<Object>} Authentication result object
 */
export const signInWithGoogle = async () => {
  try {
    logCustomEvent('google_signin_attempt');
    return await firebaseSignInWithGoogle();
  } catch (error) {
    console.error("Google sign in error:", error);
    return {
      success: false,
      error: error.code || 'unknown_error',
      message: getAuthErrorMessage(error.code || 'unknown_error')
    };
  }
};

/**
 * Register a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} displayName - User's display name
 * @returns {Promise<Object>} Registration result object
 */
export const registerWithEmailPassword = async (email, password, displayName) => {
  try {
    logCustomEvent('email_signup_attempt');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user profile with display name if provided
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    
    logCustomEvent('email_signup_success');
    return { 
      success: true, 
      user: result.user 
    };
  } catch (error) {
    console.error("Email registration error:", error);
    logCustomEvent('email_signup_error', { error_code: error.code });
    return { 
      success: false, 
      error: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email
 * @returns {Promise<Object>} Result object
 */
export const resetPassword = async (email) => {
  try {
    logCustomEvent('password_reset_attempt');
    await sendPasswordResetEmail(auth, email);
    logCustomEvent('password_reset_email_sent');
    return { 
      success: true
    };
  } catch (error) {
    console.error("Password reset error:", error);
    logCustomEvent('password_reset_error', { error_code: error.code });
    return { 
      success: false, 
      error: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Diagnose Google Authentication configuration issues
 * @returns {Promise<Object>} Diagnostic information
 */
export const diagnoseGoogleAuthConfig = async () => {
  try {
    const diagnostics = {
      firebaseConfigured: true,
      authDomain: firebaseConfig.authDomain || 'not set',
      projectId: firebaseConfig.projectId || 'not set',
      apiKey: firebaseConfig.apiKey ? 'present' : 'missing',
      provider: 'google.com',
      authProviderEnabled: false,
      browserSupport: checkBrowserSupport(),
      errorMessages: []
    };

    // Create a temporary Google provider to check configuration
    const provider = new GoogleAuthProvider();
    
    try {
      // Just check if we can initialize the provider correctly
      provider.setCustomParameters({ prompt: 'select_account' });
      diagnostics.providerInitialized = true;
    } catch (error) {
      diagnostics.providerInitialized = false;
      diagnostics.errorMessages.push(`Provider initialization error: ${error.message}`);
    }

    // Log diagnostics
    console.log("Firebase Google Auth Diagnostics:", diagnostics);
    
    // Add customized recommendations based on diagnostics
    const recommendations = [
      "Ensure Google is enabled as a sign-in provider in Firebase Console",
      `Check that the authDomain (${diagnostics.authDomain}) is properly configured`,
      "Verify OAuth Client ID and Secret are set in Firebase Console",
      "See FIREBASE_GOOGLE_AUTH_FIX.md for detailed instructions"
    ];
    
    if (!diagnostics.browserSupport.fullSupport) {
      recommendations.push(`Browser compatibility issue: ${diagnostics.browserSupport.reason}`);
    }
    
    return {
      success: true,
      diagnostics,
      recommendations
    };
  } catch (error) {
    console.error("Failed to diagnose Google auth configuration:", error);
    return {
      success: false,
      error: error.message,
      errorCode: error.code || 'unknown'
    };
  }
};

/**
 * Check browser support for modern features needed by Firebase
 * @returns {Object} Browser support information
 */
const checkBrowserSupport = () => {
  const result = {
    fullSupport: true,
    reason: '',
    details: {}
  };
  
  // Check for indexedDB (needed for persistence)
  result.details.indexedDB = !!window.indexedDB;
  if (!result.details.indexedDB) {
    result.fullSupport = false;
    result.reason = 'IndexedDB not supported';
  }
  
  // Check for Web Crypto API (needed for secure token handling)
  result.details.webCrypto = !!(window.crypto && window.crypto.subtle);
  if (!result.details.webCrypto) {
    result.fullSupport = false;
    result.reason = 'Web Crypto API not supported';
  }
  
  // Check for localStorage (needed for token storage)
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    result.details.localStorage = true;
  } catch (e) {
    result.details.localStorage = false;
    result.fullSupport = false;
    result.reason = 'localStorage not available';
  }
  
  return result;
};
