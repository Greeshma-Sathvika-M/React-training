import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './OrderSuccess.css';

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const orderId = order?.id || 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1>Order Placed Successfully!</h1>
        <p className="success-sub">Thank you for your purchase. Your order details have been saved to your account profile.</p>
        
        <div className="success-order-id">
          <div>Order ID: <strong>{orderId}</strong></div>
          {order?.total && (
            <div style={{ marginTop: '4px', fontSize: '0.85rem', color: '#15803d' }}>
              Amount: <strong>${order.total.toFixed(2)}</strong> ({order.items} items)
            </div>
          )}
          {order?.paymentDetails?.type && (
            <div style={{ marginTop: '4px', fontSize: '0.82rem', color: '#0369a1' }}>
              Payment: <strong>{order.paymentDetails.type}</strong>
            </div>
          )}
        </div>
        
        <p className="success-info">You can view your order tracking and receipt in your profile.</p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/profile" className="success-btn" style={{ background: '#2563eb', textDecoration: 'none' }}>
            View Order in Profile
          </Link>
          <button className="success-btn" style={{ background: '#0f172a' }} onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
