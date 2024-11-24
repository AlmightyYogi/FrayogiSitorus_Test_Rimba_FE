import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Modal } from 'react-bootstrap';
import { getSummary, deleteTransaction } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchSummary = async () => {
      try {
        const response = await getSummary();
        setSummary(response.data || []);
      } catch (error) {
        setError('Failed to load summary');
      }
    };

    fetchSummary();
  }, [navigate]);

  const handleShowModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  const handleShowDeleteModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedTransaction(null);
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      const response = await deleteTransaction(transactionId);
      if (response.success) {
        setSummary(summary.filter((transaction) => transaction.id !== transactionId));
        setShowDeleteModal(false);
      } else {
        setError('Failed to delete transaction');
      }
    } catch (error) {
      setError('Failed to delete transaction');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  };

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 0 }).format(number);
  };

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4 text-primary" style={{ marginTop: '70px' }}>Transaction Summary</h2>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <Row className="g-4">
        {summary.length > 0 ? (
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Invoice No</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((transaction, index) => (
                  <tr key={transaction.id}>
                    <td>{index + 1}</td>
                    <td>{transaction.invoiceNo}</td>
                    <td>{transaction.customer}</td>
                    <td>{formatDate(transaction.date)}</td>
                    <td>Rp. {formatCurrency(transaction.totalAmount)}</td>
                    <td>
                      <Button variant="info" onClick={() => handleShowModal(transaction)}>
                        View Details
                      </Button>
                    </td>
                    <td>
                      <Button variant="danger" onClick={() => handleShowDeleteModal(transaction)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        ) : (
          <Col className="text-center">
            <div className="alert alert-warning">No transactions available.</div>
          </Col>
        )}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <div>
              <h5>Invoice No: {selectedTransaction.invoiceNo}</h5>
              <p><strong>Customer:</strong> {selectedTransaction.customer}</p>
              <p><strong>Date:</strong> {formatDate(selectedTransaction.date)}</p>
              <p><strong>Transaction ID:</strong> {selectedTransaction.id}</p>
              <h6>Products:</h6>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Product Code</th>
                    <th>Product Name</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTransaction.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.productCode}</td>
                      <td>{product.productName}</td>
                      <td>Rp. {formatCurrency(product.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <p><strong>Total Amount:</strong> Rp. {formatCurrency(selectedTransaction.totalAmount)}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this transaction?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDeleteTransaction(selectedTransaction.id)}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
