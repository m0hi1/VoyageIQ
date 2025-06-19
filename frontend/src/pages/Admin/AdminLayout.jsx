import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import { AuthContext } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-BaseColor"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
