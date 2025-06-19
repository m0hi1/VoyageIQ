import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Admin Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Stats Cards - Replace with real data later */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-BaseColor mt-2">120</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">Total Tours</h3>
          <p className="text-3xl font-bold text-BaseColor mt-2">45</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">
            Total Bookings
          </h3>
          <p className="text-3xl font-bold text-BaseColor mt-2">300</p>
        </div>
      </div>
      <p className="mt-6 text-gray-600">
        Welcome to the admin panel. Use the sidebar to navigate and manage
        different aspects of the application.
      </p>
    </div>
  );
};

export default AdminDashboard;
