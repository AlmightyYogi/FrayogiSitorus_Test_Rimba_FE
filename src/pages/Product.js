import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Card, Form, Modal, Alert } from 'react-bootstrap';
import { getProducts, createProduct } from '../services/api';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '' });
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsFormDisabled(true);
    } else {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      // const userId = decodedToken.id; // REMOVE this line, as it's not used
    }

    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProduct(newProduct);
    setNewProduct({ name: '', description: '', price: '' });
    const data = await getProducts();
    setProducts(data.products);
    setShowModal(false);
    setShowSuccessModal(true);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseSuccessModal = () => setShowSuccessModal(false);

  return (
    <Container>
      <h2 className="text-center mb-4 text-primary" style={{ marginTop: '70px' }}>Products</h2>
      
      <div className="text-center mb-4">
        <Button variant="primary" onClick={handleShowModal}>
          Add New Product
        </Button>
      </div>

      <h3>Product List</h3>
      <Row className="g-4">
        {products.map((product) => (
          <Col md={4} key={product.id}>
            <Card className="shadow-sm rounded-3">
              <Card.Body>
                <Card.Title className="text-success">{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>
                  <strong>Price:</strong> Rp.{product.price}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">
            Product added successfully!
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={newProduct.name} 
                onChange={handleChange} 
                disabled={isFormDisabled}
                placeholder="Enter product name"
              />
            </Form.Group>
            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                type="text" 
                name="description" 
                value={newProduct.description} 
                onChange={handleChange} 
                disabled={isFormDisabled}
                placeholder="Enter product description"
              />
            </Form.Group>
            <Form.Group controlId="price" className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control 
                type="number" 
                name="price" 
                value={newProduct.price} 
                onChange={handleChange} 
                disabled={isFormDisabled}
                placeholder="Enter product price"
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isFormDisabled} className="w-100">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Product;
