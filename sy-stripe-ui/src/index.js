import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CheckoutPage from './CheckoutPage';
import Success from './Success';
import Customers from './Customers';
import CustomerDetails from './CustomerDetails';
import CancelPage from './CancelPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CheckoutPage />} />
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<CancelPage />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/customers/:id" element={<CustomerDetails />} />
    </Routes>
  </BrowserRouter>
);
