import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import AdminRoute from '../components/ui/AdminRoute';

// Loading component for Suspense fallback
const Loader = () => (
  <div className="flex items-center justify-center h-[calc(100vh-80px)]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/AiTrip" element={<CreateTrip />} />
      <Route path="/view-trip/:tripId" element={<ViewTrip />} />
      <Route path="/my-account" element={<MyAccount />} />
      <Route path="/all-booking" element={<Bookings />} />
      <Route path="/all-tours" element={<AdminTours />} />
      <Route path="/update-tour/:id" element={<UpdateTours />} />
      <Route path="/create" element={<CreateTours />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />{' '}
      {/* Add route for AdminLogin */}
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />{' '}
      {/* Add route for ResetPassword */}
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/booked" element={<Booked />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/privacy-policy" element={<Privacy />} />
      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" />} />{' '}
        {/* Default to dashboard */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="tours" element={<ManageTours />} />
        <Route path="tours/add" element={<AddTourForm />} />{' '}
        {/* New route for adding tours */}
        <Route path="tours/update/:id" element={<UpdateTours />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="reviews" element={<ManageReviews />} />
        {/* Add other admin-specific routes here */}
      </Route>
      <Route path="*" element={<NotFound />} />{' '}
      {/* New route for Not Found - must be last */}
    </Routes>
  );
};

export default Router;
