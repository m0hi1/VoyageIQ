import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * Higher-order component for protected routes that require authentication
 * @param {Object} props - Component props
 * @param {React.Component} props.component - Component to render if authenticated
 * @returns {React.Component} - Protected route component
 */
const ProtectedRoute = ({ component: Component }) => {
  const { currentUser, loading } = useContext(AuthContext);
  const location = useLocation();

  // While checking authentication status, show a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected component
  return <Component />;
};

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;
