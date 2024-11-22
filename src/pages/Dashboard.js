import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getTransactions } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token from localStorage:", token);

    if (!token) {
      navigate('/login');
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.id;
    console.log("User ID from token:", userId);

    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        console.log("All Transactions:", data.transactions);

        const filteredTransactions = data.transactions.filter(
          (transaction) => transaction.userId === userId
        );

        const sortedTransactions = filteredTransactions.map((transaction, index) => ({
          ...transaction,
          displayOrder: index + 1
        }));

        setTransactions(sortedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError('Failed to load transactions');
      }
    };

    fetchTransactions();
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  };

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4 text-primary" style={{ marginTop: '70px' }}>Your Transaction History</h2>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <Row className="g-4">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <Col md={4} key={transaction.id}>
              <Card className="shadow-lg rounded-3" style={{ minHeight: '250px' }}>
                <Card.Body>
                  <Card.Title className="text-success">Transaction #{transaction.displayOrder}</Card.Title>
                  <Card.Text className="text-muted">
                    <strong>Total Amount:</strong> Rp.{transaction.totalAmount}
                  </Card.Text>
                  <Card.Text className="text-muted">
                    <strong>Date:</strong> {formatDate(transaction.date)}
                  </Card.Text>
                  <Card.Text>
                    <strong>Products:</strong> {transaction.Products?.map(product => product.name).join(', ')}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center">
            <div className="alert alert-warning">No transactions available.</div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Dashboard;
