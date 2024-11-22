import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation(); // Dapatkan path URL saat ini

  // Daftar halaman tanpa navbar
  const noNavbarPaths = ['/login', '/register'];

  // Periksa apakah path saat ini termasuk dalam daftar
  if (noNavbarPaths.includes(location.pathname)) {
    return null; // Jangan render Navbar jika path cocok
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">Online Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/transactions">Transactions</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
