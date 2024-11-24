import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Card, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { getProducts, createProduct } from '../services/api';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ productName: '', description: '', price: '', quantity: '' });
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsFormDisabled(true);
    } else {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (!decodedToken || !decodedToken.id) {
          setIsFormDisabled(true);
        }
      } catch (error) {
        console.error('Error decoding token', error);
        setIsFormDisabled(true);
      }
    }

    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts();
      setProducts(data.data || []);
      setLoading(false);
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
    setNewProduct({ productName: '', description: '', price: '', quantity: '' });
    const data = await getProducts();
    setProducts(data.data || []);
    setShowModal(false);
    setShowSuccessModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseSuccessModal = () => setShowSuccessModal(false);

  return (
    <Container>
      <h2 className="text-center mb-4 text-primary" style={{ marginTop: '70px' }}>Products</h2>

      <div className="text-center mb-4">
        <Button variant="primary" onClick={handleShowModal} disabled={isFormDisabled}>
          Add New Product
        </Button>
      </div>

      <h3>Product List</h3>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="g-4">
          {products.length > 0 ? (
            products.map((product) => (
              <Col md={4} key={product.id}>
                <Card className="shadow-sm rounded-3">
                  <Card.Body>
                    <Card.Title className="text-success">{product.name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <Card.Text>
                      <strong>Quantity:</strong> {product.quantity}
                    </Card.Text>
                    <Card.Text>
                      <strong>Price:</strong> {formatPrice(product.price)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <Alert variant="warning">No products available.</Alert>
            </Col>
          )}
        </Row>
      )}

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
            <Form.Group controlId="productName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                name="productName" 
                value={newProduct.productName} 
                onChange={handleChange} 
                disabled={isFormDisabled}
                placeholder="Enter product name"
                required
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
                required
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
                required
              />
            </Form.Group>
            <Form.Group controlId="quantity" className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control 
                type="number" 
                name="quantity" 
                value={newProduct.quantity} 
                onChange={handleChange} 
                disabled={isFormDisabled}
                placeholder="Enter product quantity"
                required
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
