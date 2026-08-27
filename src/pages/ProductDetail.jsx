import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="pd-stars">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i} className="star filled">★</span>;
        if (i === full && half) return <span key={i} className="star half">★</span>;
        return <span key={i} className="star empty">★</span>;
      })}
      <span className="pd-rating-val">{rating}</span>
    </span>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://dummyjson.com/products/${id}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-skeleton-wrap">
          <div className="pd-skeleton-img" />
          <div className="pd-skeleton-info">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="pd-skeleton-line" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!product || product.message) {
    return (
      <div className="pd-page">
        <div className="pd-not-found">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/')} className="pd-back-btn">← Back to Home</button>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.thumbnail];
  const discount = Math.round(product.discountPercentage);
  const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);

  return (
    <div className="pd-page">
      <div className="pd-inner">
        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <button onClick={() => navigate('/')}>Home</button>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="pd-bc-current">{product.title}</span>
        </nav>

        <div className="pd-layout">
          {/* Gallery */}
          <div className="pd-gallery">
            <div className="pd-main-img-wrap">
              {discount > 0 && <span className="pd-discount-badge">-{discount}%</span>}
              <img src={images[activeImg]} alt={product.title} className="pd-main-img" />
            </div>
            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-thumb ${activeImg === i ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`${product.title} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pd-info">
            <p className="pd-category">{product.category}</p>
            <h1 className="pd-title">{product.title}</h1>
            <div className="pd-rating-row">
              <Stars rating={product.rating} />
              <span className="pd-reviews">({product.reviews?.length ?? 0} reviews)</span>
            </div>

            <div className="pd-price-row">
              <span className="pd-price">${product.price.toFixed(2)}</span>
              {discount > 0 && (
                <>
                  <span className="pd-original">${originalPrice}</span>
                  <span className="pd-discount-tag">-{discount}%</span>
                </>
              )}
            </div>

            <p className="pd-desc">{product.description}</p>

            <div className="pd-meta">
              <div className="pd-meta-item">
                <span className="pd-meta-label">Brand</span>
                <span className="pd-meta-val">{product.brand}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Stock</span>
                <span className={`pd-meta-val ${product.stock < 10 ? 'low-stock' : 'in-stock'}`}>
                  {product.stock < 10 ? `Only ${product.stock} left!` : `${product.stock} in stock`}
                </span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">SKU</span>
                <span className="pd-meta-val">{product.sku}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Warranty</span>
                <span className="pd-meta-val">{product.warrantyInformation}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Shipping</span>
                <span className="pd-meta-val">{product.shippingInformation}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Returns</span>
                <span className="pd-meta-val">{product.returnPolicy}</span>
              </div>
            </div>

            <div className="pd-actions">
              <button
                className={`pd-add-btn ${added ? 'added' : ''}`}
                onClick={handleAddToCart}
              >
                {added ? '✓ Added to Cart!' : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
              <button
                className="pd-buy-btn"
                onClick={() => { addToCart(product); navigate('/cart'); }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <div className="pd-reviews-section">
            <h3>Customer Reviews</h3>
            <div className="pd-reviews-grid">
              {product.reviews.map((r, i) => (
                <div key={i} className="pd-review-card">
                  <div className="pd-review-top">
                    <span className="pd-reviewer">{r.reviewerName}</span>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="pd-review-comment">{r.comment}</p>
                  <p className="pd-review-date">{new Date(r.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
