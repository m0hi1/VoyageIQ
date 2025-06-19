/**
 * Helper functions for Google Authentication specifically for trip creation
 */
import axios from 'axios';
import BASE_URL from './config';

/**
 * Process Google login response and authenticate with backend
 * @param {Object} tokenResponse - Response from Google OAuth
 * @param {Function} dispatch - Auth context dispatch function
 * @param {Function} onSuccess - Callback on successful authentication
 * @param {Function} onError - Callback on authentication error
 */
export const handleGoogleLogin = async (tokenResponse, dispatch, onSuccess, onError) => {
  try {
    console.log('Starting Google authentication process...');
    
    // 1. Validate access token
    if (!tokenResponse || !tokenResponse.access_token) {
      throw new Error('Invalid token response from Google');
    }
    
    // 2. Get user info from Google
    const userInfoResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      }
    );
    
    console.log('Google user info retrieved successfully');
      // 3. Log the backend URL being used to help with debugging
    console.log('Backend URL for authentication:', BASE_URL);
    
    // 4. Authenticate with our backend
    const googleAuthResponse = await axios.post(
      `${BASE_URL}/auth/google`,  // Note: BASE_URL already contains /api/v1 prefix
      {
        email: userInfoResponse.data.email,
        name: userInfoResponse.data.name,
        googleId: userInfoResponse.data.id,
        photoURL: userInfoResponse.data.picture,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true // Important for cookie handling
      }
    );
    
    console.log('Backend authentication response received:', googleAuthResponse.status);
    
    // 5. Validate server response
    if (!googleAuthResponse.data || !googleAuthResponse.data.token) {
      throw new Error('Invalid server response. Authentication failed.');
    }
    
    // 6. Extract user data and token
    const { data: userData = {}, token } = googleAuthResponse.data;
    
    // 7. Update authentication context
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        user: userData,
        token,
      },
    });
    
    // 8. Store authentication data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('Authentication successful, auth state updated');
    
    // 9. Call success callback
    if (typeof onSuccess === 'function') {
      onSuccess(userData, token);
    }
    
  } catch (error) {
    console.error('Google authentication error:', error);
    
    // Handle different error scenarios
    let errorMessage = 'Authentication failed. Please try again.';
    
    if (error.response) {
      console.error('Server error response:', error.response.data);
      errorMessage = error.response.data?.message || 'Server error during authentication';
    } else if (error.request) {
      console.error('No response received from server');
      errorMessage = 'Server not responding. Please check your connection.';
    } else {
      console.error('Error setting up request:', error.message);
      errorMessage = error.message;
    }
    
    // Call error callback
    if (typeof onError === 'function') {
      onError(errorMessage);
    }
  }
};

/**
 * Test the backend connection to verify if Google auth will work
 * @returns {Promise<{success: boolean, message: string}>} Connection test result
 */
export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection to:', `${BASE_URL}/auth/status`);
    
    // Try HEAD request first (faster, less data)
    const response = await axios.head(`${BASE_URL}/auth/status`);
    
    console.log('Backend connection successful:', response.status);
    return {
      success: true,
      message: 'Connected to server successfully',
      status: response.status
    };
  } catch (error) {
    console.error('Backend connection test failed:', error);
    
    // Try one more time with GET request which might work if HEAD is not supported
    try {
      console.log('Retrying with GET request');
      const getResponse = await axios.get(`${BASE_URL}/auth/status`);
      
      console.log('Backend GET connection successful:', getResponse.status);
      return {
        success: true,
        message: 'Connected to server successfully with GET',
        status: getResponse.status
      };
    } catch (retryError) {
      console.error('Backend retry connection failed:', retryError);
      
      let errorMessage = 'Cannot connect to server';
      
      // Extract detailed error information
      if (retryError.response) {
        // Server responded with error status
        errorMessage = `Server returned error: ${retryError.response.status}`;
      } else if (retryError.request) {
        // No response received
        errorMessage = 'No response from server. Check your network connection.';
      } else {
        // Error in setting up the request
        errorMessage = `Request error: ${retryError.message}`;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: retryError
      };
    }
  }
};
