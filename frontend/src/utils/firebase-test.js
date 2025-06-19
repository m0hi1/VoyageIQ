// Firebase Configuration Test Utility
import { firebaseConfig, auth, googleProvider } from '../services/FirebaseConfig';
import { diagnoseGoogleAuthConfig } from './firebase-auth';

/**
 * Test Firebase configuration and connection
 * This script can be used to verify that Firebase is properly configured
 */
export const testFirebaseConnection = async () => {
  console.log('=== FIREBASE CONFIGURATION TEST ===');
  console.log('Testing Firebase configuration...');
  
  // Check if Firebase config exists
  const hasConfig = firebaseConfig && Object.keys(firebaseConfig).length > 0;
  console.log('Firebase config exists:', hasConfig);
  
  if (hasConfig) {
    // Log config details (excluding sensitive info)
    console.log('Project ID:', firebaseConfig.projectId);
    console.log('Auth Domain:', firebaseConfig.authDomain);
    console.log('API Key present:', !!firebaseConfig.apiKey);
    console.log('Measurement ID:', firebaseConfig.measurementId);
  }
  
  // Check Firebase Auth
  console.log('\nTesting Firebase Auth...');
  
  try {
    // Check if auth is initialized
    console.log('Auth initialized:', !!auth);
    console.log('Current user:', auth.currentUser ? 'Logged in' : 'Not logged in');
    
    // Check Google provider
    console.log('\nTesting Google Provider...');
    console.log('Google provider initialized:', !!googleProvider);
    
    // Run diagnostics
    console.log('\nRunning diagnostic checks...');
    const diagnostics = await diagnoseGoogleAuthConfig();
    console.log('Diagnostic results:', diagnostics);
    
    return {
      success: true,
      hasConfig,
      authInitialized: !!auth,
      googleProviderInitialized: !!googleProvider,
      diagnostics
    };
  } catch (error) {
    console.error('Firebase test failed:', error);
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
};
