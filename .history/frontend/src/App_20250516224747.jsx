import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import GlobalErrorBoundary from './components/ErrorBoundary/GlobalErrorBoundary';
import ToastNotifications from './components/ui/ToastNotifications';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

/**
 * Root application component
 * Sets up providers and global components
 */
function App() {
  return (
    <GlobalErrorBoundary>
      <Router>
        <AuthProvider>
          <ToastNotifications position="top-right" />
          <Layout />
        </AuthProvider>
      </Router>
    </GlobalErrorBoundary>
  );
}

export default App;
