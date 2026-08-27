import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import './Wishlist.css';

function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-empty">
          <div className="wl-empty-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love by clicking the heart icon on any product.</p>
          <button className="wl-shop-btn" onClick={() => navigate('/shop')}>Browse Shop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-inner">
        <div className="wishlist-header">
          <h1>My Wishlist <span className="wl-count">({items.length})</span></h1>
          <button className="wl-shop-link" onClick={() => navigate('/shop')}>← Continue Shopping</button>
        </div>

        <div className="wishlist-grid">
          {items.map(product => (
            <div key={product.id} className="wl-card">
              <div className="wl-card-img-wrap" onClick={() => navigate(`/product/${product.id}`)}>
                <img src={product.thumbnail} alt={product.title} />
              </div>
              <div className="wl-card-body">
                <p className="wl-card-cat">{product.category}</p>
                <p className="wl-card-name" onClick={() => navigate(`/product/${product.id}`)}>{product.title}</p>
                <p className="wl-card-price">${product.price.toFixed(2)}</p>
                <div className="wl-card-actions">
                  <button
                    className="wl-add-btn"
                    onClick={() => { addToCart(product); removeFromWishlist(product.id); navigate('/cart'); }}
                  >
                    Move to Cart
                  </button>
                  <button
                    className="wl-remove-btn"
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="Remove from wishlist"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
