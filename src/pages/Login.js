import React, { useState } from "react";
import { Button, Form, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.token);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData.email, formData.password);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail"
              required
              className="mb-3"
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="mb-3"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">Login</Button>
        </Form>
        <div className="text-center mt-3">
          <p>Don't have an account yet? <Link to="/register">Register now</Link></p>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
