import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  Spinner,
} from 'reactstrap';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import BASE_URL from '../utils/config';

const ResetPassword = () => {
  const { token: resetToken } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const [passwords, setPasswords] = useState({
    password: '',
    passwordConfirm: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setPasswords(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (passwords.password !== passwords.passwordConfirm) {
      setError('Passwords do not match.');
      setIsLoading(false);
      toast.error('Passwords do not match.');
      return;
    }
    if (passwords.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password/${resetToken}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: passwords.password,
          passwordConfirm: passwords.passwordConfirm,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to reset password.');
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: result.data,
          token: result.token,
        },
      });

      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(result.data));
      localStorage.setItem('token', result.token);

      toast.success(
        result.message || 'Password reset successfully! You are now logged in.'
      );
      setIsLoading(false);
      navigate('/home'); // Redirect to home or dashboard after successful reset and login
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'An error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__form">
                <h2>Reset Your Password</h2>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <input
                      type="password"
                      placeholder="New Password"
                      required
                      id="password"
                      value={passwords.password}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      required
                      id="passwordConfirm"
                      value={passwords.passwordConfirm}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </FormGroup>
                  <Button
                    className="btn secondary__btn auth__btn"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner size="sm" /> : 'Reset Password'}
                  </Button>
                </Form>
                {error && <p className="text-danger mt-3">{error}</p>}
              </div>
              <div className="login__img">
                <img src="/login.png" alt="Reset Password Visual" />{' '}
                {/* Or a more relevant image */}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ResetPassword;
