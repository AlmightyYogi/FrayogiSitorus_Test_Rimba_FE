import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Alert, Modal } from 'react-bootstrap';
import { createTransaction, getProducts } from '../services/api';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.id;
    } catch (error) {
      console.error('Invalid token format:', error);
    }
  }
  return null;
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
};

const Transaction = () => {
  const [transactionData, setTransactionData] = useState({
    userId: '',
    customer: '',  // Add customer field
    productIds: [],
    quantity: 1,
    totalAmount: 0,
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsResponse = await getProducts();
      // console.log('Fetched products:', productsResponse);

      const productsList = productsResponse.data || [];

      if (Array.isArray(productsList) && productsList.length > 0) {
        setProducts(productsList);
        const defaultProduct = productsList[0];
        setTransactionData((prevData) => ({
          ...prevData,
          productIds: [defaultProduct.id],
          totalAmount: defaultProduct.price * prevData.quantity,
        }));
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

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setError('Invalid user session. Please log in again.');
      setIsFormDisabled(true);
      return;
    }
    setTransactionData((prevData) => ({ ...prevData, userId }));
    setIsFormDisabled(false);

    fetchProducts();
  }, []);

  useEffect(() => {
    const selectedProduct = products.find((p) => p.id === parseInt(transactionData.productIds[0]));
    if (selectedProduct) {
      const totalAmount = selectedProduct.price * transactionData.quantity;
      setTransactionData((prevData) => ({
        ...prevData,
        totalAmount,
      }));
    }
  }, [transactionData.quantity, transactionData.productIds, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare the products array for the request body
    const selectedProduct = products.find((p) => p.id === parseInt(transactionData.productIds[0]));
    const productsToSend = [
      {
        productCode: selectedProduct?.productCode || '',
        quantity: transactionData.quantity,
      },
    ];

    // Prepare the request body based on the expected API format
    const requestBody = {
      customer: transactionData.customer,  // Include the customer name
      product: productsToSend,  // Send the products in the correct format
    };

    try {
      await createTransaction(transactionData.userId, requestBody);
      setShowSuccessModal(true);

      setTransactionData((prevData) => ({
        ...prevData,
        productIds: [products[0]?.id || ''],
        quantity: 1,
        totalAmount: products[0]?.price || 0,
      }));

      fetchProducts();
    } catch (error) {
      console.error('Error creating transaction:', error);
      setError('Failed to create transaction');
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setError('');
  };

  return (
    <Container>
      <h2 className="text-center my-4">Create Transaction</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="customer" className="mb-3">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              value={transactionData.customer}
              onChange={(e) =>
                setTransactionData({
                  ...transactionData,
                  customer: e.target.value,
                })
              }
              disabled={isFormDisabled}
              placeholder="Enter customer name"
            />
          </Form.Group>

          <Form.Group controlId="productId" className="mb-3">
            <Form.Label>Select Product</Form.Label>
            <Form.Control
              as="select"
              value={transactionData.productIds[0] || ''}
              onChange={(e) =>
                setTransactionData({
                  ...transactionData,
                  productIds: [e.target.value],
                })
              }
              disabled={isFormDisabled}
            >
              <option value="" disabled>Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.productCode}) - {formatCurrency(product.price)}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="quantity" className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={transactionData.quantity}
              onChange={(e) =>
                setTransactionData({
                  ...transactionData,
                  quantity: parseInt(e.target.value),
                })
              }
              disabled={isFormDisabled}
            />
          </Form.Group>

          <Form.Group controlId="totalAmount" className="mb-3">
            <Form.Label>Total Amount</Form.Label>
            <Form.Control type="text" value={formatCurrency(transactionData.totalAmount)} readOnly />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isFormDisabled} className="w-100">
            Submit
          </Button>
        </Form>
      )}

      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Transaction Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">Your transaction has been successfully created!</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Transaction;
