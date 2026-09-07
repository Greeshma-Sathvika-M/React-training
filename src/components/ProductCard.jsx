import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

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
    <>
      <style>{`
        .pcard {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }
        .pcard:hover {
          box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04);
          transform: translateY(-4px);
          border-color: #cbd5e1;
        }
        .pcard-img-wrap {
          position: relative;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          height: 200px;
          overflow: hidden;
        }
        .pcard-img {
          max-width: 100%;
          max-height: 155px;
          object-fit: contain;
          display: block;
          transition: transform 0.3s ease;
        }
        .pcard:hover .pcard-img {
          transform: scale(1.06);
        }
        .pcard-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #ef4444;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 6px;
          z-index: 1;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
        }
        .pcard-wish-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(4px);
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0.85;
          transition: all 0.2s ease;
          z-index: 2;
          color: #94a3b8;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }
        .pcard:hover .pcard-wish-btn {
          opacity: 1;
        }
        .pcard-wish-btn:hover {
          color: #ef4444;
          border-color: #fca5a5;
          transform: scale(1.1);
        }
        .pcard-wish-btn.active {
          color: #ef4444;
          border-color: #fca5a5;
          background: #fef2f2;
          opacity: 1;
        }
        .pcard-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .stars {
          display: flex;
          gap: 2px;
        }
        .star {
          font-size: 0.92rem;
          line-height: 1;
        }
        .star.filled { color: #f59e0b; }
        .star.half   { color: #f59e0b; opacity: 0.6; }
        .star.empty  { color: #e2e8f0; }

        .pcard-name {
          margin: 2px 0 0;
          font-size: 0.92rem;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        .pcard-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-top: 4px;
        }
        .pcard-price {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
        }
        .pcard-add-btn {
          margin-top: 10px;
          padding: 9px 0;
          background: #0f172a;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .pcard-add-btn:hover {
          background: #2563eb;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .pcard-add-btn.added {
          background: #16a34a;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
        }
      `}</style>
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
          <button
            className={`pcard-wish-btn ${wishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
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
            {added ? '✓ Added to Cart' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductCard;
