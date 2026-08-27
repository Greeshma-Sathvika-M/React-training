import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

function OrderSuccess() {
  const navigate = useNavigate();
  const orderId = Math.random().toString(36).slice(2, 10).toUpperCase();

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1>Order Placed!</h1>
        <p className="success-sub">Thank you for your purchase. Your order has been confirmed.</p>
        <div className="success-order-id">
          Order ID: <strong>#{orderId}</strong>
        </div>
        <p className="success-info">A confirmation email will be sent to your inbox shortly.</p>
        <button className="success-btn" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;
