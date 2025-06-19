import React, { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import BASE_URL from '../../utils/config';
import { toast } from 'react-toastify';
import UserFormModal from '../../components/Admin/UserFormModal'; // Import the modal

// A simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-BaseColor"></div>
  </div>
);

// An error message component
const ErrorDisplay = ({ message }) => (
  <div className="text-center py-10">
    <p className="text-red-600 text-lg">Error fetching users:</p>
    <p className="text-gray-700">{message || 'Could not load user data.'}</p>
  </div>
);

const ManageUsers = () => {
  // Fetching users
  const {
    apiData: usersData,
    loading,
    error,
    refetch: refetchUsers, // Use refetch to get the latest user list after add/edit
  } = useFetch(`${BASE_URL}/users`);
  const [users, setUsers] = useState([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUserForEdit, setCurrentUserForEdit] = useState(null);

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleAddUserClick = () => {
    setIsEditMode(false);
    setCurrentUserForEdit(null);
    toggleModal();
  };

  const handleEditUserClick = user => {
    setIsEditMode(true);
    setCurrentUserForEdit(user);
    toggleModal();
  };

  const handleSaveUser = async () => {
    // Removed savedUserData parameter
    // Option 1: Refetch the entire list (simpler, ensures data consistency)
    refetchUsers();
    // Option 2: Update local state (more responsive, but might get out of sync if other admins are making changes)
    // if (isEditMode) {
    //   setUsers(prevUsers => prevUsers.map(user => (user._id === savedUserData._id ? savedUserData : user)));
    // } else {
    //   setUsers(prevUsers => [savedUserData, ...prevUsers]); // Add new user to the beginning
    // }
    // toast.success(`User ${isEditMode ? 'updated' : 'added'} successfully locally.`); // If using local update
  };

  const handleDeleteUser = async userId => {
    if (
      !window.confirm(
        'Are you sure you want to delete this user? This action cannot be undone.'
      )
    ) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete user.');
      }
      toast.success('User deleted successfully!');
      // Refetch users list or filter out the deleted user locally
      // Using refetch for consistency after delete as well
      refetchUsers();
      // setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (err) {
      toast.error(err.message || 'Error deleting user.');
      console.error('Delete user error:', err);
    }
  };

  if (loading && !usersData) {
    // Show loading spinner only on initial load
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Manage Users</h2>
        <button
          onClick={handleAddUserClick} // Updated onClick handler
          className="bg-BaseColor text-white px-6 py-2 rounded-lg hover:bg-BHoverColor transition duration-150 ease-in-out shadow focus:outline-none focus:ring-2 focus:ring-BaseColor focus:ring-opacity-50"
        >
          Add New User
        </button>
      </div>
      {loading && <LoadingSpinner />}{' '}
      {/* Show spinner during refetch operations */}
      {!loading && users && users.length > 0 ? (
        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Username
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs"
                    title={user._id}
                  >
                    {user._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditUserClick(user)} // Updated onClick handler
                      className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-700 text-lg">No users found.</p>
          <p className="text-gray-500">
            Click &ldquo;Add New User&rdquo; to create the first user.
          </p>
        </div>
      )}
      <UserFormModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        currentUser={currentUserForEdit}
        onSave={handleSaveUser}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default ManageUsers;
