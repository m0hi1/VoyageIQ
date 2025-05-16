import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterImg from '../assets/images/Signup2.png';
import { Link, useNavigate } from 'react-router-dom';
import BASE_URL from '../utils/config';
import { auth, googleProvider } from '../services/FirebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { AuthContext } from '../contexts/AuthContext';
import { createUserWithEmail } from '../utils/firebase-auth';
import useValidation from '../hooks/useValidation';
import { registerSchema } from '../utils/validationSchema';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    photo: '',
    role: 'user',
  });

  // Using the new validation hook
  const { 
    errors, 
    touched, 
    validateField, 
    validateAll, 
    touchField 
  } = useValidation(registerSchema);

  const handleInput = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Mark field as touched and validate
    touchField(name);
    validateField(name, value);
  };

  // Handle registration form submission
  const registerHandler = async e => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields
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
      // Create user with email/password in Firebase first
      const firebaseResult = await createUserWithEmail(formData.email, formData.password);
      
      if (!firebaseResult.success) {
        toast.error(firebaseResult.message || 'Registration failed');
        setIsLoading(false);
        return;
      }
      
      // Then register with our backend
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          photo: formData.photo || '',
          role: 'user',
          firebaseUid: firebaseResult.user?.uid
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store user info in auth context
        dispatch({ 
          type: 'LOGIN_SUCCESS',
          payload: {
            user: result.data,
            token: result.token,
          }, 
        });
        toast.success(result.message || 'Registration successful!');
        navigate('/');
      } else {
        // Handle specific error cases
        if (response.status === 400) {
          toast.error(result.message || 'Invalid registration data');
        } else if (response.status === 409) {
          toast.error('Email already exists. Please try to login instead.');
        } else {
          toast.error(result.message || 'Registration failed');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Server not responding. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Register with backend using Google profile info
      const response = await fetch(`${BASE_URL}/auth/google-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.displayName || user.email.split('@')[0],
          email: user.email,
          googleId: user.uid,
          photo: user.photoURL || '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If user already exists, redirect to login
        if (response.status === 409) {
          toast.info('Account already exists. Redirecting to login...');
          navigate('/login');
          return;
        }
        
        throw new Error(data.message || 'Failed to register with Google');
      }

      // Update context with user data
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data.data,
          token: data.token,
        },
      });
      
      toast.success('Successfully registered with Google!');
      navigate('/');
    } catch (error) {
      console.error('Google signup error:', error);
      toast.error(error.message || 'Failed to register with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-lg md:max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center animate-fadeIn">
        {/* Register Form */}
        <div className="flex flex-col justify-center space-y-6 order-2 md:order-1">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2 animate-fadeSlideDown">
              Create Account
            </h2>
            <p className="text-sm text-slate-500 animate-fadeSlideUp">
              Join VoyageIQ and plan your next adventure!
            </p>
          </div>

          <form onSubmit={registerHandler} className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="johndoe"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent transition-shadow duration-150 ease-in-out shadow-sm
                ${touched.username && errors.username 
                  ? 'border-red-500 bg-red-50' 
                  : touched.username && !errors.username 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-slate-300'}`}
                value={formData.username}
                onChange={handleInput}
              />
              {touched.username && errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent transition-all duration-200 shadow-sm
                ${touched.email && errors.email 
                  ? 'border-red-500 bg-red-50' 
                  : touched.email && !errors.email 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-slate-300'}`}
                value={formData.email}
                onChange={handleInput}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent transition-shadow duration-150 ease-in-out shadow-sm
                ${touched.password && errors.password 
                  ? 'border-red-500' 
                  : touched.password && !errors.password 
                    ? 'border-green-500' 
                    : 'border-slate-300'}`}
                value={formData.password}
                onChange={handleInput}
              />
              {touched.password && errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-BaseColor hover:bg-BHoverColor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-BaseColor disabled:opacity-60 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
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
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-slate-500">Or register with</p>
                <button
                  type="button"
                  onClick={handleGoogleSignup}
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
              </div>
              <p className="mt-6 text-sm text-center text-slate-600">
                Already have an account?{' '}
                <Link
                  className="font-medium text-BaseColor hover:text-BHoverColor hover:underline transition-colors duration-150"
                  to="/login"
                >
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
