import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Router from '../../router/Router';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'; // Corrected path
const Layout = () => {
  return (
    <div>
      <ErrorBoundary fallbackMessage="There was an issue loading the application.">
        <Header />
        <Router />
        <Footer />
      </ErrorBoundary>
    </div>
  );
};

export default Layout;
