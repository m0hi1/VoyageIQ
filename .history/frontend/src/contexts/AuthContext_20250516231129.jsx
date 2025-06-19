import { createContext, useEffect, useReducer, useState } from 'react';
import { 
  getTokenFromLocalStorage, 
  getUserFromLocalStorage, 
  saveTokenToLocalStorage,
  saveUserToLocalStorage,
  clearAuthData 
} from '../utils/token';

/**
 * Initial authentication state
 * Reads user and token from localStorage on initialization
 */
const initial_state = {
  user: getUserFromLocalStorage(),
  token: getTokenFromLocalStorage(),
  loading: false,
  error: null,
  isAuthenticated: Boolean(getTokenFromLocalStorage() && !isTokenExpired(getTokenFromLocalStorage()))
};

export const AuthContext = createContext(initial_state);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        user: null,
        token: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user, // user object from backend
        token: action.payload.token, // token from backend
        // role is now part of action.payload.user
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
      };
    case 'UPDATE_USER': // For profile updates
      return {
        ...state, // Keep existing token and other state properties
        user: action.payload.user, // action.payload.user is the new, updated user object
        // role will be derived from action.payload.user.role
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initial_state);

  useEffect(() => {
    // Persist user object and token to localStorage
    // If user is null, stringify(null) is "null", which readUserFromLocalStorage handles.
    localStorage.setItem('user', JSON.stringify(state.user));
    // If token is null, it's stored as "null" string by some browsers or not at all.
    // Ensure we store it such that getItem('token') || null works as expected.
    if (state.token) {
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('token');
    }
    // No need to store role separately in localStorage if it's always derived
  }, [state.user, state.token]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        role: state.user?.role, // Derive role directly from the user object
        // error: state.error, // Removed as it's not part of the state
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
