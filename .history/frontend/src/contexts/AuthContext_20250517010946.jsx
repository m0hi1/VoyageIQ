import { createContext, useEffect, useReducer, useState } from 'react';
import { getUserFromLocalStorage, getTokenFromLocalStorage, saveUserToLocalStorage, saveTokenToLocalStorage, clearAuthData } from '../utils/token';

/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 */

// Read user from localStorage when initializing context
const readUserFromLocalStorage = () => {
  return getUserFromLocalStorage();
};

// Initial state for the authentication context
const initial_state = {
  user: readUserFromLocalStorage(),
  token: getTokenFromLocalStorage() || null,
  loading: false,
  error: null,
};

// Create context with initial state
export const AuthContext = createContext(initial_state);

/**
 * Auth reducer for handling authentication state changes
 * @param {Object} state - Current state
 * @param {Object} action - Action to perform
 * @returns {Object} - New state
 */
const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload.user,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

/**
 * Auth Context Provider component
 * Manages authentication state and provides it to child components
 */
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initial_state);
  const [currentUser, setCurrentUser] = useState(state.user);
  const [loading, setLoading] = useState(false);

  // Update local storage when authentication state changes
  useEffect(() => {
    if (state.user) {
      saveUserToLocalStorage(state.user);
      setCurrentUser(state.user);
    } else {
      clearAuthData();
      setCurrentUser(null);
    }

    if (state.token) {
      saveTokenToLocalStorage(state.token);
    }

    setLoading(false);
  }, [state.user, state.token]);

  /**
   * Check if the user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean} - Whether user has the role
   */
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  /**
   * Check if the user is authenticated
   * @returns {boolean} - Whether user is authenticated
   */
  const isAuthenticated = () => {
    return !!state.token && !!state.user;
  };

  /**
   * Check if the user is an admin
   * @returns {boolean} - Whether user is an admin
   */
  const isAdmin = () => {
    return hasRole('admin');
  };
  // Context value with state and helper methods
  const contextValue = {
    ...state,
    currentUser, // Keeping for backward compatibility
    loading,
    dispatch,
    hasRole,
    isAuthenticated,
    isAdmin,
    role: state.user?.role || null, // Explicitly expose role for easier access
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
