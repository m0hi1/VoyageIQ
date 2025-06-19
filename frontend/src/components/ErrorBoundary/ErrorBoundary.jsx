import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
    // Example: logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Oops! Something went wrong.
            </h1>
            <p className="text-gray-700 mb-2">
              We encountered an error and our team has been notified. Please try
              refreshing the page or contact support if the problem persists.
            </p>
            {this.props.fallbackMessage && (
              <p className="text-sm text-gray-500 mt-4">
                {this.props.fallbackMessage}
              </p>
            )}
            {import.meta.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left bg-gray-100 p-3 rounded">
                <summary className="cursor-pointer font-semibold text-gray-600">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-red-500 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallbackMessage: PropTypes.string,
};

export default ErrorBoundary;
