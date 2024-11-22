import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Product from './pages/Product';
import Transaction from './pages/Transaction';

const App = () => {
  return (
    <Router>
      {!['/login', '/register'].includes(window.location.pathname) && <NavBar />}
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Product />} />
        <Route path="/transactions" element={<Transaction />} />
      </Routes>
    </Router>
  );
};

export default App;
