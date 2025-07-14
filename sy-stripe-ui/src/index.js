import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import CheckoutPage from './CheckoutPage';
import Success from './Success';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  </BrowserRouter>
);
