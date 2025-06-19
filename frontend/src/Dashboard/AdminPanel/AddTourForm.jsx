import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  Spinner,
} from 'reactstrap'; // Assuming you are using reactstrap
import { AuthContext } from '../../contexts/AuthContext';
import BASE_URL from '../../utils/config';
import { toast } from 'react-toastify'; // For displaying notifications

const AddTourForm = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [tourData, setTourData] = useState({
    title: '',
    city: '',
    address: '',
    distance: 0,
    photo: '',
    desc: '',
    price: 0,
    maxGroupSize: 0,
    featured: false,
  });

  const handleChange = e => {
    const { id, value, type, checked } = e.target;
    setTourData(prev => ({
      ...prev,
      [id]:
        type === 'checkbox'
          ? checked
          : type === 'number'
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    if (!user || !token) {
      toast.error('Authentication required. Please log in.');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/tours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tourData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message || 'Failed to create tour. Please check the details.'
        );
      }

      setIsLoading(false);
      toast.success('Tour added successfully!');
      navigate('/admin/tours'); // Or wherever you list admin tours
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message || 'An unexpected error occurred.');
      console.error('Add Tour Error:', error);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <h3 className="mb-4">Add New Tour</h3>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={tourData.title}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  value={tourData.city}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  value={tourData.address}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <label htmlFor="distance">Distance (km)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="distance"
                      value={tourData.distance}
                      onChange={handleChange}
                      required
                      min="0"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label htmlFor="price">Price ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      value={tourData.price}
                      onChange={handleChange}
                      required
                      min="0"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <label htmlFor="maxGroupSize">Max Group Size</label>
                    <input
                      type="number"
                      className="form-control"
                      id="maxGroupSize"
                      value={tourData.maxGroupSize}
                      onChange={handleChange}
                      required
                      min="1"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="mt-4">
                    <label htmlFor="featured" className="me-3">
                      Featured Tour?
                    </label>
                    <input
                      type="checkbox"
                      id="featured"
                      checked={tourData.featured}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <label htmlFor="photo">Photo URL</label>
                <input
                  type="text"
                  className="form-control"
                  id="photo"
                  value={tourData.photo}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="desc">Description</label>
                <textarea
                  className="form-control"
                  id="desc"
                  rows="3"
                  value={tourData.desc}
                  onChange={handleChange}
                  required
                ></textarea>
              </FormGroup>
              <Button
                color="primary"
                type="submit"
                disabled={isLoading}
                className="mt-3"
              >
                {isLoading ? <Spinner size="sm" /> : 'Add Tour'}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AddTourForm;
