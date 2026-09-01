import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Cart.css';

function FreeShippingBar({ totalPrice, threshold = 120 }) {
  const pct = Math.min((totalPrice / threshold) * 100, 100);
  const remaining = (threshold - totalPrice).toFixed(2);
  if (totalPrice >= threshold) {
    return <p className="ship-bar-done">🎉 You've unlocked <strong>Free Shipping!</strong></p>;
  }
  return (
    <div className="ship-bar-wrap">
      <p className="ship-bar-label">Add <strong>${remaining}</strong> more for free shipping</p>
      <div className="ship-bar-track">
        <div className="ship-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function CouponBox({ coupon, applyCoupon, removeCoupon }) {
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState(null); // { ok, text }

  const handleApply = () => {
    if (!input.trim()) return;
    const res = applyCoupon(input.trim());
    setMsg(res.ok
      ? { ok: true, text: `✓ "${input.toUpperCase()}" applied — ${res.label}` }
      : { ok: false, text: res.error }
    );
    if (res.ok) setInput('');
  };

  const handleRemove = () => {
    removeCoupon();
    setMsg(null);
    setInput('');
  };

  if (coupon) {
    return (
      <div className="coupon-applied">
        <span className="coupon-tag">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {coupon.code} — {coupon.label}
        </span>
        <button className="coupon-remove" onClick={handleRemove}>Remove</button>
      </div>
    );
  }

  return (
    <div className="coupon-box">
      <div className="coupon-input-row">
        <input
          className="coupon-input"
          placeholder="Promo code"
          value={input}
          onChange={e => { setInput(e.target.value); setMsg(null); }}
          onKeyDown={e => e.key === 'Enter' && handleApply()}
        />
        <button className="coupon-apply-btn" onClick={handleApply}>Apply</button>
      </div>
      {msg && <p className={`coupon-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</p>}
    </div>
  );
}

function Cart() {
  const { items, removeFromCart, updateQty, totalItems, totalPrice, clearCart, coupon, applyCoupon, removeCoupon } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const [confirmClear, setConfirmClear] = useState(false);
  const [removing, setRemoving] = useState(new Set());

  const handleRemove = (id) => {
    setRemoving(prev => new Set(prev).add(id));
    setTimeout(() => {
      removeFromCart(id);
      setRemoving(prev => { const s = new Set(prev); s.delete(id); return s; });
    }, 280);
  };

  const handleSaveLater = (item) => {
    if (!isWishlisted(item.id)) toggleWishlist(item);
    handleRemove(item.id);
  };

  const handleClearCart = () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    clearCart();
    setConfirmClear(false);
  };

  // Pricing calculation
  const shippingBase = totalPrice > 120 ? 0 : 9.99;
  let discount = 0;
  let shippingFee = shippingBase;
  if (coupon) {
    if (coupon.type === 'percent') discount = totalPrice * (coupon.value / 100);
    else if (coupon.type === 'flat')    discount = Math.min(coupon.value, totalPrice);
    else if (coupon.type === 'shipping') shippingFee = 0;
  }
  const subtotalAfterDiscount = totalPrice - discount;
  const tax = subtotalAfterDiscount * 0.08;
  const orderTotal = subtotalAfterDiscount + shippingFee + tax;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn-primary-link">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-inner">
        {/* Header */}
        <div className="cart-header">
          <h1>Shopping Cart <span className="cart-count-badge">({totalItems})</span></h1>
          <div className="cart-header-actions">
            <Link to="/" className="continue-link">← Continue Shopping</Link>
            {confirmClear ? (
              <span className="clear-confirm">
                Sure?{' '}
                <button className="clear-yes" onClick={handleClearCart}>Yes, clear</button>
                {' / '}
                <button className="clear-no" onClick={() => setConfirmClear(false)}>Cancel</button>
              </span>
            ) : (
              <button className="clear-cart-btn" onClick={handleClearCart}>Clear Cart</button>
            )}
          </div>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div
                key={item.id}
                className={`cart-item${removing.has(item.id) ? ' removing' : ''}`}
              >
                <img src={item.thumbnail} alt={item.title} className="cart-item-img" />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.title}</p>
                  <p className="cart-item-brand">{item.brand}</p>
                  <p className="cart-item-unit">${item.price.toFixed(2)} each</p>
                  <div className="cart-item-actions">
                    <button
                      className="save-later-btn"
                      onClick={() => handleSaveLater(item)}
                    >
                      {isWishlisted(item.id) ? '♥ Saved' : '♡ Save for Later'}
                    </button>
                    <span className="action-sep">|</span>
                    <button
                      className="cart-item-remove-link"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="cart-item-qty">
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    disabled={item.qty <= 1}
                  >−</button>
                  <span className="qty-val">{item.qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                  >+</button>
                </div>
                <p className="cart-item-total">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <FreeShippingBar totalPrice={totalPrice} />

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount ({coupon.code})</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <span className="free-tag">FREE</span> : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <CouponBox coupon={coupon} applyCoupon={applyCoupon} removeCoupon={removeCoupon} />

            <button
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
