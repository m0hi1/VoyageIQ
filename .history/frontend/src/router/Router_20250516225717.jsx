import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import AdminRoute from '../components/ui/AdminRoute';

// Loading component for Suspense fallback
const Loader = () => (
  <div className="flex items-center justify-center h-[calc(100vh-80px)]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

// Public Pages - Eagerly loaded for fast initial render
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import Tours from '../pages/Tours';
import TourDetails from '../pages/TourDetails';
import ForgotPassword from '../pages/ForgotPassword';

// Lazily loaded components - Loaded on demand to improve initial load time
const SearchResultList = lazy(() => import('../pages/SearchResultList'));
const About = lazy(() => import('../pages/About'));
const AboutUs = lazy(() => import('../pages/AboutUs'));
const ContactUs = lazy(() => import('../pages/ContactUs'));
const Privacy = lazy(() => import('../pages/Privacy'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const AdminLogin = lazy(() => import('../pages/AdminLogin'));
const Booked = lazy(() => import('../pages/Booked'));

// User Account Pages
const MyAccount = lazy(() => import('../Dashboard/UserAccount/MyAccount'));

// Trip Creator Pages  
const CreateTrip = lazy(() => import('../create-trip/index'));
const ViewTrip = lazy(() => import('../view-trip/[tripId]/index'));

// Admin Dashboard Pages
const AdminLayout = lazy(() => import('../pages/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const ManageUsers = lazy(() => import('../pages/Admin/ManageUsers'));
const ManageTours = lazy(() => import('../pages/Admin/ManageTours'));
const ManageBookings = lazy(() => import('../pages/Admin/ManageBookings'));
const ManageReviews = lazy(() => import('../pages/Admin/ManageReviews'));

// Admin Tour Management
const Bookings = lazy(() => import('../Dashboard/AdminPanel/Bookings'));
const AdminTours = lazy(() => import('../Dashboard/AdminPanel/AdminTours'));
const CreateTours = lazy(() => import('../Dashboard/AdminPanel/CreateTours'));
const UpdateTours = lazy(() => import('../Dashboard/AdminPanel/UpdateTour'));
const AddTourForm = lazy(() => import('../Dashboard/AdminPanel/AddTourForm'));

/**
 * Main router component that defines application routes
 * Uses React Router v6 for routing
 * Implements route protection for authenticated and admin routes
 */
const Router = () => {
  return (
    <Routes>
      {/* Public Routes - Accessible to all users */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Lazy-loaded public routes */}
      <Route path="/about" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <About />
        </Suspense>
      } />
      <Route path="/about-us" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <AboutUs />
        </Suspense>
      } />
      <Route path="/contact" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <ContactUs />
        </Suspense>
      } />
      <Route path="/privacy-policy" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <Privacy />
        </Suspense>
      } />
      <Route path="/reset-password/:token" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <ResetPassword />
        </Suspense>
      } />
      <Route path="/tours/search" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <SearchResultList />
        </Suspense>
      } />
      
      {/* Protected User Routes - Require authentication */}
      <Route path="/my-account" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <ProtectedRoute component={MyAccount} />
        </Suspense>
      } />
      <Route path="/booked" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <ProtectedRoute component={Booked} />
        </Suspense>
      } />
      <Route path="/AiTrip" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <ProtectedRoute component={CreateTrip} />
        </Suspense>
      } />
      <Route path="/view-trip/:tripId" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <ProtectedRoute component={ViewTrip} />
        </Suspense>
      } />
      
      {/* Admin Authentication Route */}
      <Route path="/admin/login" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <AdminLogin />
        </Suspense>
      } />
      
      {/* Admin Panel Routes - Require admin role */}
      <Route path="/admin" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <AdminRoute component={AdminLayout} />
        </Suspense>
      }>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="tours" element={<ManageTours />} />
        <Route path="tours/add" element={<AddTourForm />} />
        <Route path="tours/update/:id" element={<UpdateTours />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="reviews" element={<ManageReviews />} />
      </Route>
      
      {/* Admin Direct Routes - Legacy paths that should be protected */}
      <Route path="/all-booking" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <AdminRoute component={Bookings} />
        </Suspense>
      } />
      <Route path="/all-tours" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <AdminRoute component={AdminTours} />
        </Suspense>
      } />
      <Route path="/update-tour/:id" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <AdminRoute component={UpdateTours} />
        </Suspense>
      } />
      <Route path="/create" element={
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <AdminRoute component={CreateTours} />
        </Suspense>
      } />
      
      {/* 404 - Not Found Route (must be last) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
