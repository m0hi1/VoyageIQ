import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginImg from './../assets/images/login2.png';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import BASE_URL from '../utils/config';
import { signInWithGoogle, signInWithEmailPassword } from '../utils/firebase-auth';
import { logCustomEvent } from '../services/FirebaseConfig';
import AuthDiagnostic from '../components/ui/AuthDiagnostic';
import useValidation from '../hooks/useValidation';
import { loginSchema } from '../utils/validationSchema';
import { FormInput, FormButton, SocialButton } from '../components/forms';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleAuthError, setGoogleAuthError] = useState(null);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Using the new validation hook
  const { 
    errors, 
    touched, 
    isValid,
    validateField, 
    validateAll, 
    touchField 
  } = useValidation(loginSchema);

  const handleInput = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Mark field as touched and validate
    touchField(name);
    validateField(name, value);
  };

  // Google login handler with enhanced error reporting
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // Track login attempt
      logCustomEvent('google_login_attempt');
      console.log("Starting Google authentication...");
      
      // 1. Firebase Authentication using our enhanced function
      const result = await signInWithGoogle();
      console.log("Google auth result:", result);
      
      if (!result.success || !result.user) {
        // Display more user-friendly error message for configuration issues
        if (result.error === 'auth/configuration-not-found') {
          toast.error("Google login is temporarily unavailable. Please use email login or try again later.", {
            autoClose: 5000
          });
          console.error("Firebase Google auth not configured properly. Add Google as auth provider in Firebase console.");
          
          // Set the error for our diagnostic component
          setGoogleAuthError(result.error);
        } else {
          toast.error(result.message || "Google authentication failed. Please try again.");
        }
        setGoogleLoading(false);
        return;
      }
      
      const { user } = result;
      console.log("Successfully authenticated with Google. User:", user.email);

      // 2. Send the Google profile info to our backend
      toast.info("Connecting to your account...", { autoClose: 2000 });
      
      const response = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          googleId: user.uid, // Make sure we're using the correct Firebase UID
          photoURL: user.photoURL
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || "Failed to authenticate with server";
        
        // More descriptive error messages with improved UX
        if (response.status === 400) {
          throw new Error("Invalid account information. Please try again.");
        } else if (response.status === 409) {
          throw new Error("An account with this email already exists but is not linked to Google.");
        } else if (response.status === 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error(errorMsg);
        }
      }

      // 3. Update auth context with user info and token
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data.data,
          token: data.token,
        },
      });
      
      toast.success('Successfully logged in with Google!');
      
      // Navigate based on user role
      if (data.data && data.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Google login error:', error);
      logCustomEvent('google_login_error', { error_message: error.message });
      
      // More user-friendly error handling
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to login with Google. Please try again or use email login.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const logInHandler = async e => {
    e.preventDefault();
    setIsLoading(true);

    // Use our validation hook to validate all fields
    const validation = validateAll(formData);
    
    if (!validation.isValid) {
      // Show errors for all fields
      Object.keys(formData).forEach(field => touchField(field));
      
      // Show toast with the first error
      const firstError = Object.values(validation.errors)[0];
      toast.warn(firstError);
      
      setIsLoading(false);
      return;
    }

    try {
      // First authenticate with Firebase
      const firebaseResult = await signInWithEmailPassword(formData.email, formData.password);
      
      if (!firebaseResult.success) {
        toast.error(firebaseResult.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }
      
      // After Firebase authentication succeeds, authenticate with our backend
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firebaseUid: firebaseResult.user?.uid || null // Pass Firebase UID for linking accounts if needed
        }),
      });
      
      const backendResult = await response.json();

      if (response.ok) {
        // Successfully logged in with backend
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: backendResult.data, // contains user.role
            token: backendResult.token,
          },
        });
        
        toast.success(backendResult.message || 'Login successful!');

        // Use role from the user object for navigation
        if (backendResult.data && backendResult.data.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        // Backend authentication failed
        if (response.status === 404) {
          // User doesn't exist in MongoDB yet
          toast.error('User account not found. Please register first.');
        } else if (response.status === 401) {
          toast.error('Invalid credentials. Please check your email and password.');
        } else {
          toast.error(
            backendResult.message || 'Login failed. Please check your credentials.'
          );
        }
      }
    } catch (err) {
      console.error('Login error:', err); // Log the error for debugging
      toast.error(
        'Server not responding or network error. Please try again later.'
      );
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-lg md:max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center animate-fadeIn">
        {/* Login Photo */}
        <div className="hidden md:block">
          <img
            src={LoginImg}
            alt="Login Visual"
            className="mx-auto h-full w-full object-cover rounded-lg"
          />
        </div>

        {/* Login Form */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2 animate-fadeSlideDown">
              Welcome Back!
            </h2>
            <p className="text-sm sm:text-base text-slate-500 animate-fadeSlideUp">
              Login to continue your journey with VoyageIQ.
            </p>
          </div>

          <form onSubmit={logInHandler} className="space-y-5">            <FormInput
              type="email"
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInput}
              validation={{ errors, touched }}
              required={true}
              autoComplete="email"
            />            <FormInput
              type="password"
              name="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInput}
              validation={{ errors, touched }}
              required={true}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-start">
                {/* Remember me checkbox can be added here if needed */}
              </div>
              <Link
                to="/forgot-password" // Assuming you will create this route
                className="text-sm font-medium text-BaseColor hover:text-BHoverColor hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div>              <FormButton
                type="submit"
                text="Login"
                isLoading={isLoading}
                loadingText="Logging in..."
                className="my-3"
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-500">Or continue with</p>                <SocialButton 
                  provider="google" 
                  onClick={handleGoogleLogin} 
                  isLoading={googleLoading}
                />
                {/* AuthDiagnostic Component - Shows comprehensive diagnostic info */}
                {googleAuthError && <AuthDiagnostic error={googleAuthError} />}
                
                {/* Debug button for developers - only visible in development */}
                {import.meta.env.DEV && (
                  <button
                    type="button"
                    onClick={() => setGoogleAuthError('auth/configuration-not-found')}
                    className="mt-2 text-xs text-slate-500 hover:text-slate-700 underline"
                  >
                    Run Google Auth Diagnostic
                  </button>
                )}
              </div>
              <p className="text-sm text-center text-slate-600 mt-6">
                Don&apos;t have an account?{' '}
                <Link
                  className="font-medium text-BaseColor hover:text-BHoverColor hover:underline transition-colors duration-150 ease-in-out"
                  to="/register"
                >
                  Register here
                </Link>
              </p>
              {/* <p className="text-sm text-center text-slate-600 mt-2">
                Are you an Admin?{' '}
                <Link
                  className="font-medium text-BaseColor hover:text-BHoverColor hover:underline transition-colors duration-150 ease-in-out"
                  to="/admin/login"
                >
                  Admin Login
                </Link> */}
              {/* </p> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
