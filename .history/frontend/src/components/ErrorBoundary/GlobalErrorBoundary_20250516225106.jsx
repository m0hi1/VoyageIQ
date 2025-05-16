import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Global Error Boundary component
 * Catches JavaScript errors in child component tree
 * Displays fallback UI instead of crashing
 */
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI in the next render
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by GlobalErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You can also log to a monitoring service like Sentry
    // If you're using Sentry, you would call: 
    // Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-gray-50">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
            
            <div className="mb-5">
              <p className="text-gray-700 mb-4">
                We've encountered an unexpected error. Our team has been notified.
              </p>
              
              {this.props.showActionButtons && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
                    onClick={() => window.location.reload()}
                  >
                    Reload Page
                  </button>
                  
                  <Link
                    to="/"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                  >
                    Go to Homepage
                  </Link>
                </div>
              )}
            </div>
            

            {this.props.showDetails && import.meta.env.NODE_ENV !== 'production' && (
              <details className="text-left p-3 bg-gray-100 rounded mt-5">
                <summary className="cursor-pointer font-medium mb-2">
                  Error Details (Development Only)
                </summary>
                <p className="text-red-500 mb-2">
                  {this.state.error?.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-xs overflow-auto p-2 bg-gray-200 rounded">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;

  }}

GlobalErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  showActionButtons: PropTypes.bool,
  showDetails: PropTypes.bool
};

GlobalErrorBoundary.defaultProps = {
  showActionButtons: true,
  showDetails: true
};

export default GlobalErrorBoundary;
