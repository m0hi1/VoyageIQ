import { useContext, useEffect, useState } from 'react';
import { diagnoseGoogleAuthConfig } from '../../utils/firebase-auth';
import { AuthContext } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { testBackendConnection } from '../../utils/googleAuthHelper';

/**
 * A diagnostic component that runs when Google authentication fails
 * It provides helpful information to fix the authentication issue
 */
const AuthDiagnostic = ({ error }) => {
  const { user, token, dispatch } = useContext(AuthContext);
  const [diagnosticInfo, setDiagnosticInfo] = useState(null);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [localStorageToken, setLocalStorageToken] = useState(null);
  const [localStorageUser, setLocalStorageUser] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({ testing: false, result: null });
  
  // Run diagnostics when the component mounts
  useEffect(() => {
    const runDiagnostics = async () => {
      setIsRunningDiagnostic(true);
      try {
        const result = await diagnoseGoogleAuthConfig();
        setDiagnosticInfo(result);
      } catch (err) {
        console.error("Failed to run diagnostics:", err);
        setDiagnosticInfo({
          success: false,
          error: err.message
        });
      } finally {
        setIsRunningDiagnostic(false);
      }
    };
    
    if (error && error.includes('configuration')) {
      runDiagnostics();
    }
  }, [error]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserJson = localStorage.getItem('user');
    
    setLocalStorageToken(storedToken);
    
    try {
      if (storedUserJson) {
        const parsedUser = JSON.parse(storedUserJson);
        setLocalStorageUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      setLocalStorageUser(null);
    }
  }, []);
    // Test backend connection 
  const checkBackendConnection = async () => {
    try {
      const result = await testBackendConnection();
      if (result.success) {
        toast.success('Backend connection successful');
      } else {
        toast.error(`Backend connection failed: ${result.message}`);
      }
      return result;
    } catch (err) {
      toast.error('Connection test error');
      return { success: false, error: err.message };
    }
  };
  
  if (!error || !error.includes('configuration')) {
    return null;
  }
  
  return (
    <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200 shadow-sm">
      <h3 className="text-sm font-medium text-amber-800">Configuration Issue Detected</h3>
      
      {isRunningDiagnostic ? (
        <div className="flex items-center justify-center py-3">
          <svg className="animate-spin h-5 w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-xs text-amber-700">Diagnosing issue...</span>
        </div>
      ) : diagnosticInfo ? (
        <div className="mt-2">          <p className="text-xs text-slate-600 mb-2">
            Google authentication is not properly configured. Here&apos;s what we found:
          </p>
          
          {/* Display recommendations */}
          {diagnosticInfo.recommendations && (
            <ul className="text-xs text-slate-700 list-disc list-inside space-y-1">
              {diagnosticInfo.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          )}
            <div className="mt-2 pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-500">              
              <a 
                href="https://console.firebase.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Open Firebase Console
              </a> to configure Google authentication, or read our <a
                href="/FIREBASE_GOOGLE_AUTH_FIX.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >troubleshooting guide</a>.
            </p>
            
            <div className="mt-2 pt-2">
              <Button
                onClick={checkBackendConnection}
                variant="outline"
                size="sm"
              >
                Test Backend Connection
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-600 mt-1">
          Unable to diagnose the issue. Please check your Firebase configuration or contact support.
        </p>
      )}
    </div>
  );
};

export default AuthDiagnostic;
