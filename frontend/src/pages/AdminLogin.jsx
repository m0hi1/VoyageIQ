import React, { useState, useContext } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  Alert,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import BASE_URL from '../utils/config'; // Changed from named to default import

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
    setError(null); // Clear error on change
  };

  const handleClick = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!credentials.email || !credentials.password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(
          result.message || 'Login failed. Please check your credentials.'
        );
        setLoading(false);
        return;
      }

      if (result.data.role !== 'admin') {
        setError('Access denied. Only admins can log in here.');
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: { message: 'Access denied. Only admins can log in here.' },
        });
        setLoading(false);
        // Optionally, redirect non-admins away or clear their partial login attempt
        // navigate("/login");
        return;
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: result.data,
        token: result.token,
      });
      setLoading(false);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: { message: err.message || 'Something went wrong.' },
      });
      setLoading(false);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-center">
              <div className="login__form">
                {/* Placeholder for an admin-specific logo or image if desired */}
                <h2>Admin Login</h2>
                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      required
                      id="email"
                      onChange={handleChange}
                      value={credentials.email}
                    />
                  </FormGroup>
                  <FormGroup className="mt-3">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      required
                      id="password"
                      onChange={handleChange}
                      value={credentials.password}
                    />
                  </FormGroup>
                  {error && (
                    <Alert variant="danger" className="mt-3">
                      {error}
                    </Alert>
                  )}
                  <Button
                    className="btn secondary__btn auth__btn mt-4"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Logging In...' : 'Login'}
                  </Button>
                </Form>
                <p className="mt-3">
                  Not an admin? <Link to="/login">User Login</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AdminLogin;
