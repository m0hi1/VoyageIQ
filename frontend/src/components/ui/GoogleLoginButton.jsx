// Login component with Google authentication for trip creation
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { handleGoogleLogin, testBackendConnection } from '../../utils/googleAuthHelper';

export default function LoginButton({ onLoginSuccess, dispatch }) {
  const [isLoading, setIsLoading] = useState(false);
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      toast.info('Signing in...');
      
      try {
        // Test connection before proceeding with authentication
        const connectionTest = await testBackendConnection();
        
        if (!connectionTest.success) {
          toast.error(`Connection error: ${connectionTest.message}`);
          console.error('Connection test failed:', connectionTest);
          return;
        }
        
        console.log('Connection test successful, proceeding with Google login');
        
        await handleGoogleLogin(
          tokenResponse, 
          dispatch,
          // Success callback
          (userData, token) => {
            toast.success('Signed in successfully!');
            console.log('Authentication successful, user logged in');
            
            if (typeof onLoginSuccess === 'function') {
              onLoginSuccess(userData, token);
            }
          },
          // Error callback
          (errorMessage) => {
            toast.error(errorMessage || 'Authentication failed. Please try again.');
          }
        );
      } catch (error) {
        console.error('Unexpected error during login process:', error);
        toast.error('An unexpected error occurred. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    },
  });

  return (
    <Button
      onClick={loginWithGoogle}
      disabled={isLoading}
      className="w-full bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition flex items-center justify-center gap-3 py-6 rounded-xl shadow-sm"
    >
      <FcGoogle className="h-6 w-6" />
      <span className="text-base font-medium">
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </span>
    </Button>
  );
}
