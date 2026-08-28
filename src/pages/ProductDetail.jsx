import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductDetail.css';

/* ── Star renderer ──────────────────────────────────────── */
function Stars({ rating, size = 'md' }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className={`pd-stars pd-stars--${size}`} aria-label={`${rating} stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full)            return <span key={i} className="pd-star filled">★</span>;
        if (i === full && half)  return <span key={i} className="pd-star half">★</span>;
        return                          <span key={i} className="pd-star empty">★</span>;
      })}
    </span>
  );
}

/* ── Related product mini-card ─────────────────────────── */
function RelatedCard({ product }) {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  return (
    <div className="pd-rel-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="pd-rel-img-wrap">
        <img src={product.thumbnail} alt={product.title} />
        <button
          className={`pd-rel-wish ${wishlisted ? 'active' : ''}`}
          onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
          aria-label="Wishlist"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <p className="pd-rel-name">{product.title}</p>
      <p className="pd-rel-price">${product.price.toFixed(2)}</p>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────── */
function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [related, setRelated]       = useState([]);
  const [activeImg, setActiveImg]   = useState(0);
  const [qty, setQty]               = useState(1);
  const [added, setAdded]           = useState(false);
  const [activeTab, setActiveTab]   = useState('description');
  const thumbsRef                   = useRef(null);

  /* fetch product */
  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    setQty(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetch(`https://dummyjson.com/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
        /* fetch related by category */
        if (data.category) {
          fetch(`https://dummyjson.com/products/category/${encodeURIComponent(data.category)}?limit=5`)
            .then(r => r.json())
            .then(d => setRelated((d.products || []).filter(p => p.id !== data.id).slice(0, 4)));
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const wishlisted = product ? isWishlisted(product.id) : false;

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="pdp-page">
        <div className="pdp-inner">
          <div className="pdp-skeleton-bc" />
          <div className="pdp-skeleton-layout">
            <div className="pdp-skeleton-thumbcol">
              {[...Array(4)].map((_, i) => <div key={i} className="pdp-skel-thumb" />)}
            </div>
            <div className="pdp-skeleton-main-img" />
            <div className="pdp-skeleton-info">
              {[...Array(6)].map((_, i) => <div key={i} className="pdp-skel-line" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!product || product.message) {
    return (
      <div className="pdp-page">
        <div className="pdp-not-found">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/')} className="pdp-back-btn">← Back to Home</button>
        </div>
      </div>
    );
  }

  const images      = product.images?.length ? product.images : [product.thumbnail];
  const discount    = Math.round(product.discountPercentage || 0);
  const origPrice   = discount > 0
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;
  const TABS = [
    { key: 'description',  label: 'Description' },
    { key: 'additional',   label: 'Additional Information' },
    { key: 'reviews',      label: `Reviews (${product.reviews?.length ?? 0})` },
    { key: 'shipping',     label: 'Shipping & Returns' },
  ];

  return (
    <div className="pdp-page">
      <div className="pdp-inner">

        {/* ── Breadcrumb ── */}
        <nav className="pdp-breadcrumb" aria-label="breadcrumb">
          <button onClick={() => navigate('/')}>Home</button>
          <span className="pdp-bc-sep">›</span>
          <button onClick={() => navigate('/shop')}>Shop</button>
          <span className="pdp-bc-sep">›</span>
          <span className="pdp-bc-cat">{product.category}</span>
          <span className="pdp-bc-sep">›</span>
          <span className="pdp-bc-cur">{product.title}</span>
        </nav>

        {/* ── Product layout ── */}
        <div className="pdp-layout">

          {/* Left: vertical thumbnails */}
          <div className="pdp-thumbcol" ref={thumbsRef}>
            {images.map((img, i) => (
              <button
                key={i}
                className={`pdp-thumb ${activeImg === i ? 'active' : ''}`}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
              >
                <img src={img} alt={`${product.title} ${i + 1}`} />
              </button>
            ))}
          </div>

          {/* Centre: main image */}
          <div className="pdp-main-col">
            <div className="pdp-main-img-wrap">
              {discount > 0 && <span className="pdp-badge-new">NEW</span>}
              <img
                src={images[activeImg]}
                alt={product.title}
                className="pdp-main-img"
              />
            </div>
          </div>

          {/* Right: product info */}
          <div className="pdp-info-col">

            <h1 className="pdp-title">{product.title}</h1>

            {/* Rating row */}
            <div className="pdp-rating-row">
              <Stars rating={product.rating} />
              <span className="pdp-rating-num">{product.rating}</span>
              <span className="pdp-divider">|</span>
              <span className="pdp-review-count">{product.reviews?.length ?? 0} reviews</span>
              <span className="pdp-divider">|</span>
              <span className="pdp-sku">SKU: {product.sku || `PRD-${product.id}`}</span>
            </div>

            {/* Price */}
            <div className="pdp-price-row">
              <span className="pdp-price">${product.price.toFixed(2)}</span>
              {origPrice && (
                <>
                  <span className="pdp-orig">${origPrice}</span>
                  <span className="pdp-disc-tag">-{discount}%</span>
                </>
              )}
            </div>

            <p className="pdp-desc">{product.description}</p>

            <hr className="pdp-divider-line" />

            {/* Stock status */}
            <div className="pdp-stock-row">
              <span className={`pdp-stock-badge ${product.stock < 10 ? 'low' : 'in'}`}>
                {product.stock < 10 ? `⚠ Only ${product.stock} left` : '✓ In Stock'}
              </span>
              {product.brand && (
                <span className="pdp-brand">Brand: <strong>{product.brand}</strong></span>
              )}
            </div>

            {/* Quantity + Actions */}
            <div className="pdp-qty-row">
              <div className="pdp-qty-ctrl">
                <button
                  className="pdp-qty-btn"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >−</button>
                <span className="pdp-qty-val">{qty}</span>
                <button
                  className="pdp-qty-btn"
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                >+</button>
              </div>

              <button
                className={`pdp-add-btn ${added ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {added ? (
                  '✓ Added to Cart!'
                ) : (
                  <>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>

              <button
                className={`pdp-wish-btn ${wishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Service badges */}
            <div className="pdp-badges">
              <div className="pdp-badge-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                <div>
                  <p className="pdp-badge-title">Free Shipping</p>
                  <p className="pdp-badge-sub">On orders over $50</p>
                </div>
              </div>
              <div className="pdp-badge-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                <div>
                  <p className="pdp-badge-title">Easy Returns</p>
                  <p className="pdp-badge-sub">30 days return policy</p>
                </div>
              </div>
              <div className="pdp-badge-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <div>
                  <p className="pdp-badge-title">Secure Payment</p>
                  <p className="pdp-badge-sub">100% secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs section ── */}
        <div className="pdp-tabs-section">
          <div className="pdp-tabs-nav">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`pdp-tab-btn ${activeTab === t.key ? 'active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pdp-tab-body">
            {activeTab === 'description' && (
              <div className="pdp-tab-desc">
                <p>{product.description}</p>
                <ul className="pdp-feat-list">
                  {product.tags?.map(tag => (
                    <li key={tag}><span className="pdp-feat-dot" />{tag}</li>
                  ))}
                  {product.warrantyInformation && (
                    <li><span className="pdp-feat-dot" />Warranty: {product.warrantyInformation}</li>
                  )}
                  {product.weight && (
                    <li><span className="pdp-feat-dot" />Weight: {product.weight}kg</li>
                  )}
                </ul>
              </div>
            )}

            {activeTab === 'additional' && (
              <table className="pdp-info-table">
                <tbody>
                  {[
                    ['Brand',           product.brand],
                    ['Category',        product.category],
                    ['SKU',             product.sku || `PRD-${product.id}`],
                    ['Weight',          product.weight ? `${product.weight} kg` : '—'],
                    ['Dimensions (W)',  product.dimensions?.width  ? `${product.dimensions.width} cm`  : '—'],
                    ['Dimensions (H)',  product.dimensions?.height ? `${product.dimensions.height} cm` : '—'],
                    ['Dimensions (D)',  product.dimensions?.depth  ? `${product.dimensions.depth} cm`  : '—'],
                    ['Minimum Order',   product.minimumOrderQuantity ?? 1],
                    ['Availability',    product.availabilityStatus || (product.stock > 0 ? 'In Stock' : 'Out of Stock')],
                    ['Warranty',        product.warrantyInformation || '—'],
                  ].map(([label, val]) => (
                    <tr key={label}>
                      <th>{label}</th>
                      <td>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'reviews' && (
              <div className="pdp-reviews-wrap">
                {product.reviews?.length > 0 ? (
                  <div className="pdp-reviews-grid">
                    {product.reviews.map((r, i) => (
                      <div key={i} className="pdp-review-card">
                        <div className="pdp-review-top">
                          <span className="pdp-reviewer">{r.reviewerName}</span>
                          <Stars rating={r.rating} size="sm" />
                        </div>
                        <p className="pdp-review-comment">{r.comment}</p>
                        <p className="pdp-review-date">{new Date(r.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="pdp-no-reviews">No reviews yet.</p>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="pdp-tab-desc">
                <p><strong>Shipping:</strong> {product.shippingInformation || 'Ships within 3–5 business days.'}</p>
                <p><strong>Returns:</strong> {product.returnPolicy || '30-day hassle-free returns.'}</p>
                <p>For international orders, duties and taxes may apply. Please check your local regulations before placing an order.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="pdp-related">
            <div className="pdp-related-header">
              <h3>You may also like</h3>
              <button className="pdp-view-all" onClick={() => navigate('/shop')}>View all</button>
            </div>
            <div className="pdp-related-grid">
              {related.map(p => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductDetail;
