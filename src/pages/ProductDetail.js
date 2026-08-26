import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="page not-found">
        <h1>404</h1>
        <p>Product not found.</p>
        <Link to="/shop">← Back to Shop</Link>
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="detail-page">
      <Link to="/shop" className="back-link">← Back to Shop</Link>

      <div className="detail-card">
        <div className="detail-emoji-wrap">
          <span className="detail-emoji">{product.emoji}</span>
          {product.badge && <span className={`badge badge-${product.badge.toLowerCase()}`}>{product.badge}</span>}
        </div>

        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="detail-price">${product.price.toLocaleString()}</p>
          <p className="detail-desc">{product.description}</p>

          {(product.age || product.gender) && (
            <div className="detail-meta">
              {product.age && <div className="meta-pill">🎂 Age: {product.age}</div>}
              {product.gender && <div className="meta-pill">⚥ Gender: {product.gender}</div>}
              <div className="meta-pill">📦 In Stock</div>
            </div>
          )}

          <div className="detail-actions">
            <button className="btn btn-primary" onClick={handleAdd}>
              🛒 Add to Cart
            </button>
            <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2>You May Also Like</h2>
          </div>
          <div className="product-grid">
            {related.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="product-card">
                <div className="card-emoji">{p.emoji}</div>
                <div className="card-body">
                  <p className="card-category">{p.category}</p>
                  <h3 className="card-name">{p.name}</h3>
                  <p className="card-price">${p.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
