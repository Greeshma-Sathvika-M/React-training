import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const badgeClass = {
    Popular: 'badge-popular',
    New: 'badge-new',
    Premium: 'badge-premium',
    Sale: 'badge-sale',
  }[product.badge] || '';

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="card-image-link">
        <div className="card-emoji">{product.emoji}</div>
        {product.badge && (
          <span className={`badge ${badgeClass}`}>{product.badge}</span>
        )}
      </Link>
      <div className="card-body">
        <p className="card-category">{product.category}</p>
        <h3 className="card-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="card-price">${product.price.toLocaleString()}</p>
        <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}>
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
