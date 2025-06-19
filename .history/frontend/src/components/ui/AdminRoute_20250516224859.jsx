import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Higher-order component for admin-only routes
 * @param {Object} props - Component props
 * @param {React.Component} props.component - Component to render if user is admin
 * @returns {React.Component} - Admin route component
 */
const AdminRoute = ({ component: Component }) => {
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

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated but not admin, redirect to unauthorized page
  if (currentUser.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and admin, render the protected component
  return <Component />;
};

AdminRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default AdminRoute;
