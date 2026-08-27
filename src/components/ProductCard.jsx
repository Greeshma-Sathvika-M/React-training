import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="stars" aria-label={`${rating} stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i} className="star filled">★</span>;
        if (i === full && half) return <span key={i} className="star half">★</span>;
        return <span key={i} className="star empty">★</span>;
      })}
    </span>
  );
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="pcard" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="pcard-img-wrap">
        {product.discountPercentage > 10 && (
          <span className="pcard-badge">-{Math.round(product.discountPercentage)}%</span>
        )}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="pcard-img"
          loading="lazy"
        />
        {/* Wishlist heart */}
        <button
          className={`pcard-wish-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Quick-add cart icon */}
        <button
          className={`pcard-quick-add ${added ? 'added' : ''}`}
          onClick={handleAdd}
          aria-label="Add to cart"
        >
          {added ? '✓' : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          )}
        </button>
      </div>
      <div className="pcard-body">
        <Stars rating={product.rating} />
        <p className="pcard-name">{product.title}</p>
        <div className="pcard-price-row">
          <span className="pcard-price">${product.price.toFixed(2)}</span>
        </div>
        <button
          className={`pcard-add-btn ${added ? 'added' : ''}`}
          onClick={handleAdd}
        >
          {added ? '✓ Added!' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
