import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap'; // Changed from reactstrap
import { toast } from 'react-toastify';
import BASE_URL from '../../utils/config';

const UserFormModal = ({ isOpen, toggle, currentUser, onSave, isEditMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    photo: '',
    role: 'user', // Default role
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        password: '', // Password is not pre-filled for editing for security; admin can set a new one if needed
        photo: currentUser.photo || '',
        role: currentUser.role || 'user',
      });
    } else {
      // Reset for add mode
      setFormData({
        username: '',
        email: '',
        password: '',
        photo: '',
        role: 'user',
      });
    }
  }, [isOpen, currentUser, isEditMode]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (
      !formData.username ||
      !formData.email ||
      (!isEditMode && !formData.password) ||
      !formData.role
    ) {
      toast.error(
        'Username, email, role, and password (for new users) are required.'
      );
      setIsLoading(false);
      return;
    }
    if (!isEditMode && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long for new users.');
      setIsLoading(false);
      return;
    }
    if (isEditMode && formData.password && formData.password.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    const endpoint = isEditMode
      ? `${BASE_URL}/users/${currentUser._id}`
      : `${BASE_URL}/users/admin-create`;
    const method = isEditMode ? 'PUT' : 'POST';
    const token = localStorage.getItem('token');

    // For PUT requests, if password is empty, don't send it in the payload
    const payload = { ...formData };
    if (isEditMode && !payload.password) {
      delete payload.password;
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to ${isEditMode ? 'update' : 'create'} user.`
        );
      }

      toast.success(`User ${isEditMode ? 'updated' : 'created'} successfully!`);
      onSave(result.data); // Pass the created/updated user data back
      toggle(); // Close modal
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message || 'An error occurred.');
      console.error('User form submission error:', error);
    }
  };

  return (
    <Modal show={isOpen} onHide={toggle} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditMode ? 'Edit User' : 'Add New User'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>
              {isEditMode ? 'New Password (optional)' : 'Password'}
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditMode} // Required only for new users
              disabled={isLoading}
              placeholder={
                isEditMode
                  ? 'Leave blank to keep current password'
                  : 'Min. 6 characters'
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="photo">
            <Form.Label>Photo URL (optional)</Form.Label>
            <Form.Control
              type="text"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select" // Changed from type="select"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggle} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Spinner
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : isEditMode ? (
              'Save Changes'
            ) : (
              'Create User'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
