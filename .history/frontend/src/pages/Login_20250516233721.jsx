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

          <form onSubmit={logInHandler} className="space-y-5">
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent transition-all duration-200 shadow-sm placeholder-slate-400 
                ${touched.email && errors.email 
                  ? 'border-red-500 bg-red-50' 
                  : touched.email && !errors.email 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-slate-300'}`}
                value={formData.email}
                onChange={handleInput}
                autoComplete="email"
              />
              {touched.email && !errors.email && (
                <div className="absolute right-3 top-9 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent transition-shadow duration-150 ease-in-out shadow-sm placeholder-slate-400
                ${touched.password && errors.password 
                  ? 'border-red-500' 
                  : touched.password && !errors.password
                    ? 'border-green-500' 
                    : 'border-slate-300'}`}
                value={formData.password}
                onChange={handleInput}
                autoComplete="current-password"
              />
              {touched.password && errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

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

            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 my-3 border border-transparent text-base font-semibold rounded-lg shadow-md text-white bg-BaseColor hover:bg-BHoverColor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-BaseColor disabled:opacity-60 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-500">Or continue with</p>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full mt-2 py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-BaseColor transition-all duration-150 ease-in-out flex items-center justify-center"
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.56,12.25C22.56,11.47 22.49,10.72 22.36,10H12V14.26H17.94C17.71,15.63 16.95,16.82 15.82,17.56V20.18H19.45C21.45,18.37 22.56,15.54 22.56,12.25Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12,23C14.97,23 17.45,22.04 19.45,20.18L15.82,17.56C14.83,18.22 13.53,18.62 12,18.62C9.31,18.62 7.02,16.88 6.19,14.54H2.44V17.21C4.44,20.69 7.96,23 12,23Z"
                          fill="#34A853"
                        />
                        <path
                          d="M6.19,14.54C5.96,13.82 5.82,13.06 5.82,12.25C5.82,11.44 5.96,10.68 6.19,9.96V7.29H2.44C1.5,8.99 1,10.56 1,12.25C1,13.94 1.5,15.51 2.44,17.21L6.19,14.54Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12,5.88C13.68,5.88 15.11,6.46 16.21,7.48L19.52,4.39C17.45,2.59 14.97,1.5 12,1.5C7.96,1.5 4.44,3.81 2.44,7.29L6.19,9.96C7.02,7.62 9.31,5.88 12,5.88Z"
                          fill="#EA4335"
                        />
                      </svg>
                      Login with Google
                    </>
                  )}
                </button>
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
