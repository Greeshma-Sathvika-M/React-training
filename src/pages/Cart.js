import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="page empty-cart">
        <span className="empty-cart-icon">🛒</span>
        <h1>Your cart is empty</h1>
        <p className="muted">Looks like you haven't added any pets or accessories yet.</p>
        <Link to="/shop" className="btn btn-primary">Browse the Shop</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>🛒 Your Cart</h1>
        <p className="muted">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-emoji">{item.emoji}</div>
              <div className="cart-item-info">
                <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                <p className="cart-item-category muted">{item.category}</p>
                <p className="cart-item-price">${item.price.toLocaleString()}</p>
              </div>
              <div className="cart-item-controls">
                <button
                  className="qty-btn"
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  disabled={item.qty <= 1}
                >−</button>
                <span className="qty-value">{item.qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateQty(item.id, item.qty + 1)}
                >+</button>
              </div>
              <div className="cart-item-total">
                ${(item.price * item.qty).toLocaleString()}
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(item.id)} aria-label="Remove">✕</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="text-green">Free</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
          <button className="btn btn-primary w-full" onClick={() => alert('Checkout coming soon! 🐾')}>
            Proceed to Checkout
          </button>
          <Link to="/shop" className="btn btn-outline w-full" style={{ marginTop: '10px', textAlign: 'center' }}>
            Continue Shopping
          </Link>
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
