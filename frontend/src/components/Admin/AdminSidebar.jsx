import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaUmbrellaBeach,
  FaBook,
  FaComments,
  FaSignOutAlt,
} from 'react-icons/fa';
// import { AuthContext } from '../../contexts/AuthContext'; // Import if logout is handled here

const AdminSidebar = () => {
  // const { dispatch } = useContext(AuthContext); // Uncomment if using for logout

  // const handleLogout = () => {
  //   dispatch({ type: 'LOGOUT' });
  //   // Additional cleanup or navigation if needed
  // };

  const navLinkClasses = ({ isActive }) =>
    isActive
      ? 'flex items-center px-4 py-3 text-white bg-BaseColor rounded-lg shadow-md'
      : 'flex items-center px-4 py-3 text-gray-700 hover:bg-gray-200 hover:text-BaseColor rounded-lg transition-colors duration-150';

  return (
    <aside className="w-64 bg-white shadow-lg p-4 space-y-2">
      <div className="text-center py-4 mb-4 border-b">
        <h1 className="text-2xl font-bold text-BaseColor">VoyageIQ Admin</h1>
      </div>
      <nav className="space-y-1">
        <NavLink to="/admin/dashboard" className={navLinkClasses}>
          <FaTachometerAlt className="mr-3" /> Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={navLinkClasses}>
          <FaUsers className="mr-3" /> Users
        </NavLink>
        <NavLink to="/admin/tours" className={navLinkClasses}>
          <FaUmbrellaBeach className="mr-3" /> Tours
        </NavLink>
        <NavLink to="/admin/bookings" className={navLinkClasses}>
          <FaBook className="mr-3" /> Bookings
        </NavLink>
        <NavLink to="/admin/reviews" className={navLinkClasses}>
          <FaComments className="mr-3" /> Reviews
        </NavLink>
        {/* Add other admin links here */}
      </nav>
      <div className="mt-auto pt-4 border-t">
        {/* <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors duration-150"
        >
          <FaSignOutAlt className="mr-3" /> Logout
        </button> */}
      </div>
    </aside>
  );
};

export default AdminSidebar;
