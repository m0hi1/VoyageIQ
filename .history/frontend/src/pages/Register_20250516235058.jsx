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
import { FormInput, FormButton, SocialButton } from '../components/forms';

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

          <form onSubmit={registerHandler} className="space-y-4">            {/* Username */}
            <FormInput
              type="text"
              name="username"
              label="Username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleInput}
              validation={{ errors, touched }}
              required={true}
            />

            {/* Email */}
            <FormInput
              type="email"
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInput}
              validation={{ errors, touched }}
              required={true}
              autoComplete="email"
            />

            {/* Password */}
            <FormInput
              type="password"
              name="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInput}
              validation={{ errors, touched }}
              required={true}
              autoComplete="new-password"
            />

            {/* Submit Button */}
            <div>              <FormButton
                type="submit"
                text="Register"
                isLoading={isLoading}
                loadingText="Registering..."
                className="mt-4"
              />

              <div className="mt-4 text-center">
                <p className="text-sm text-slate-500">Or register with</p>                <SocialButton 
                  provider="google" 
                  onClick={handleGoogleSignup} 
                  isLoading={googleLoading} 
                />
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
