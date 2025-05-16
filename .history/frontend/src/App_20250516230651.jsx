import { BrowserRouter as Router } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout/Layout';
import GlobalErrorBoundary from './components/ErrorBoundary/GlobalErrorBoundary';
import ToastNotifications from './components/ui/ToastNotifications';
import RouterComponent from './router/Router';
import './App.css';

// Lazy-loaded loading component 
const LoadingFallback = lazy(() => import('./components/ui/LoadingFallback'));

/**
 * Root application component
 * Sets up:
 * - Global error boundary
 * - Router
 * - Authentication provider
 * - Toast notifications
 * - Main layout with routing
 */
function App() {
  return (
    <GlobalErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <ToastNotifications position="top-right" />
          <Layout>
            <RouterComponent />
          </Layout>
        </Suspense>
      </Router>
    </GlobalErrorBoundary>
  );
}

export default App;
