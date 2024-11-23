import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Alert, Modal } from 'react-bootstrap';
import { createTransaction, getProducts } from '../services/api';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  console.log("Token from localStorage:", token);

  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      console.log("Decoded token:", decoded);
      return decoded.id;
    } catch (error) {
      console.error('Invalid token format', error);
    }
  }
  return null;
};

const Transaction = () => {
  const [transactionData, setTransactionData] = useState({
    userId: '',
    productId: '',
    quantity: 1,
    totalAmount: 0,
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const userId = getUserIdFromToken();
    console.log("User ID from token:", userId);

    if (!userId) {
      setIsFormDisabled(true);
    } else {
      setTransactionData((prevData) => ({
        ...prevData,
        userId: userId,
      }));
      setIsFormDisabled(false);
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsResponse = await getProducts();
        const productsList = Array.isArray(productsResponse)
          ? productsResponse
          : productsResponse.products;

        if (Array.isArray(productsList) && productsList.length > 0) {
          setProducts(productsList);
          if (productsList.length > 0 && transactionData.productId === '') {
            const defaultProduct = productsList[0];
            const defaultTotalAmount = defaultProduct.price * transactionData.quantity;
            setTransactionData((prevData) => ({
              ...prevData,
              productId: defaultProduct.id,
              totalAmount: defaultTotalAmount,
            }));
          }
        } else {
          setError('No products available');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [transactionData.quantity]);

  useEffect(() => {
    const product = products.find((p) => p.id === parseInt(transactionData.productId));
    if (product) {
      const totalAmount = product.price * transactionData.quantity;
      setTransactionData((prevData) => ({
        ...prevData,
        totalAmount,
      }));
    }
  }, [transactionData.productId, transactionData.quantity, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value, 10) || 1;
    setTransactionData((prevData) => ({
      ...prevData,
      quantity,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTransaction(
        transactionData.userId,
        [transactionData.productId],
        transactionData.totalAmount
      );
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating transaction:', error);
      setError('Failed to create transaction');
    }
  };

  const handleCloseSuccessModal = () => setShowSuccessModal(false);

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4 text-primary" style={{ marginTop: '70px' }}>Create Transaction</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="justify-content-center">
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="productId" className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Control
                as="select"
                name="productId"
                value={transactionData.productId}
                onChange={handleChange}
                disabled={isFormDisabled}
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - Rp. {product.price}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="quantity" className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={transactionData.quantity}
                onChange={handleQuantityChange}
                min="1"
                disabled={isFormDisabled}
              />
            </Form.Group>

            <Form.Group controlId="totalAmount" className="mb-3">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                type="text"
                name="totalAmount"
                value={transactionData.totalAmount}
                readOnly
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={isFormDisabled} className="w-100">
              Submit Transaction
            </Button>
          </Form>
        </Col>
      </Row>

      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Transaction Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">Your transaction was successfully created!</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Transaction;
