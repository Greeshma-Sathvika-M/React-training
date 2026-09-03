import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Shop.css';

const CAT_META = [
  { key: 'All',             label: 'All',          emoji: '✦' },
  { key: 'smartphones',     label: 'Phones',        emoji: '📱' },
  { key: 'laptops',         label: 'Laptops',       emoji: '💻' },
  { key: 'fragrances',      label: 'Beauty',        emoji: '✨' },
  { key: 'skincare',        label: 'Skincare',      emoji: '🧴' },
  { key: 'groceries',       label: 'Groceries',     emoji: '🛒' },
  { key: 'home-decoration', label: 'Decor',         emoji: '🏠' },
  { key: 'furniture',       label: 'Furniture',     emoji: '🛋️' },
  { key: 'tops',            label: 'Tops',          emoji: '👕' },
  { key: 'womens-dresses',  label: 'Dresses',       emoji: '👗' },
  { key: 'mens-watches',    label: 'Watches',       emoji: '⌚' },
  { key: 'sunglasses',      label: 'Sunglasses',    emoji: '🕶️' },
  { key: 'automotive',      label: 'Automotive',    emoji: '🚗' },
];

const SORT_OPTIONS = [
  { key: 'default',    label: 'Featured' },
  { key: 'price-asc',  label: 'Cheapest' },
  { key: 'price-desc', label: 'Priciest' },
  { key: 'rating',     label: 'Top Rated' },
];

function Stars({ rating }) {
  return (
    <span className="s-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`s-star ${i < Math.round(rating) ? 'on' : ''}`}>★</span>
      ))}
    </span>
  );
}

function Shop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, addToCart, updateQty, removeFromCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const filterBarRef = useRef(null);

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [viewMode, setViewMode]     = useState('mosaic'); // 'mosaic' | 'list'
  const [searchOpen, setSearchOpen] = useState(false);
  const PER_PAGE = 12;

  const category = searchParams.get('category') || 'All';
  const q        = searchParams.get('q')        || '';
  const sort     = searchParams.get('sort')     || 'default';
  const [search, setSearch] = useState(q);

  useEffect(() => {
    setLoading(true);
    const skip = (page - 1) * PER_PAGE;
    let url;
    if (q) {
      url = `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}&limit=${PER_PAGE}&skip=${skip}`;
    } else if (category !== 'All') {
      url = `https://dummyjson.com/products/category/${category}?limit=${PER_PAGE}&skip=${skip}`;
    } else {
      url = `https://dummyjson.com/products?limit=${PER_PAGE}&skip=${skip}`;
    }
    fetch(url)
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setTotal(data.total || 0); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category, q, page]);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc')  return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'rating')     return b.rating - a.rating;
    return 0;
  });

  const handleSearch = e => {
    e.preventDefault();
    setPage(1);
    setSearchOpen(false);
    setSearchParams(search.trim() ? { q: search.trim() } : {});
  };

  const handleCategory = cat => {
    setPage(1);
    setSearch('');
    setSearchParams(cat === 'All' ? {} : { category: cat });
  };

  const handleSort = key => {
    setSearchParams(prev => {
      const p = Object.fromEntries(prev);
      p.sort = key;
      return p;
    });
  };

  const cartQty = id => (items.find(i => i.id === id) || {}).qty || 0;

  const handleAdd      = (e, product) => { e.stopPropagation(); addToCart(product); };
  const handleIncrease = (e, product) => { e.stopPropagation(); addToCart(product); };
  const handleDecrease = (e, id) => {
    e.stopPropagation();
    const qty = cartQty(id);
    qty <= 1 ? removeFromCart(id) : updateQty(id, qty - 1);
  };

  const totalPages = Math.ceil(total / PER_PAGE);
  const activeCatMeta = CAT_META.find(c => c.key === category) || CAT_META[0];

  // Mosaic pattern: positions 0,3,8,11 are "featured" (larger)
  const FEATURED_IDX = new Set([0, 3, 8, 11]);

  return (
    <div className="shop-page">

      {/* ── Sticky Command Bar ────────────────────── */}
      <div className="shop-command-bar" ref={filterBarRef}>
        <div className="shop-command-inner">

          {/* Left: page title + count */}
          <div className="shop-cmd-left">
            <span className="shop-cmd-emoji">{activeCatMeta.emoji}</span>
            <div>
              <h1 className="shop-cmd-title">
                {category === 'All' ? 'All Products' : activeCatMeta.label}
              </h1>
              {!loading && (
                <span className="shop-cmd-count">{total} items</span>
              )}
            </div>
          </div>

          {/* Centre: horizontal category pills (scrollable) */}
          <div className="shop-cat-pills-wrap">
            <div className="shop-cat-pills">
              {CAT_META.map(c => (
                <button
                  key={c.key}
                  className={`shop-cat-pill ${category === c.key ? 'active' : ''}`}
                  onClick={() => handleCategory(c.key)}
                >
                  <span className="pill-emoji">{c.emoji}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: tools */}
          <div className="shop-cmd-tools">
            {/* Search toggle */}
            <button
              className={`cmd-tool-btn ${searchOpen ? 'active' : ''}`}
              onClick={() => setSearchOpen(v => !v)}
              aria-label="Search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Sort dropdown */}
            <div className="cmd-sort-wrap">
              <select
                className="cmd-sort"
                value={sort}
                onChange={e => handleSort(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
              <svg className="cmd-sort-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>

            {/* View toggle */}
            <div className="cmd-view-toggle">
              <button
                className={`cmd-view-btn ${viewMode === 'mosaic' ? 'active' : ''}`}
                onClick={() => setViewMode('mosaic')}
                aria-label="Mosaic view"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="0" y="0" width="7" height="7" rx="1"/>
                  <rect x="9" y="0" width="7" height="7" rx="1"/>
                  <rect x="0" y="9" width="7" height="7" rx="1"/>
                  <rect x="9" y="9" width="7" height="7" rx="1"/>
                </svg>
              </button>
              <button
                className={`cmd-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="0" y="1" width="16" height="2.5" rx="1"/>
                  <rect x="0" y="6.5" width="16" height="2.5" rx="1"/>
                  <rect x="0" y="12" width="16" height="2.5" rx="1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search expand panel */}
        {searchOpen && (
          <div className="shop-search-panel">
            <form className="shop-search-form" onSubmit={handleSearch}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search in ${activeCatMeta.label}…`}
              />
              {search && (
                <button type="button" className="search-clear" onClick={() => { setSearch(''); setSearchParams({}); }}>
                  ✕
                </button>
              )}
              <button type="submit" className="search-submit">Go</button>
            </form>
            {q && <p className="search-active-query">Results for <strong>"{q}"</strong></p>}
          </div>
        )}
      </div>

      {/* ── Products Area ──────────────────────────── */}
      <div className="shop-inner">
        {loading ? (
          <div className={`shop-grid shop-grid--${viewMode}`}>
            {Array.from({ length: PER_PAGE }).map((_, i) => (
              <div key={i} className={`shop-skeleton ${viewMode === 'mosaic' && FEATURED_IDX.has(i) ? 'featured' : ''}`} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="shop-empty">
            <div className="shop-empty-icon">✦</div>
            <h3>Nothing found</h3>
            <p>Try a different search or browse all products.</p>
            <button className="shop-empty-btn" onClick={() => { setSearch(''); setSearchParams({}); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className={`shop-grid shop-grid--${viewMode}`}>
              {sorted.map((product, idx) => {
                const qty     = cartQty(product.id);
                const inCart  = qty > 0;
                const isFeat  = viewMode === 'mosaic' && FEATURED_IDX.has(idx % 12);
                const wished  = isWishlisted(product.id);

                return (
                  <div
                    key={product.id}
                    className={`shop-card ${isFeat ? 'shop-card--featured' : ''} ${viewMode === 'list' ? 'shop-card--list' : ''}`}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Image zone */}
                    <div className="shop-card-img-zone">
                      {product.discountPercentage > 10 && (
                        <span className="shop-card-badge">−{Math.round(product.discountPercentage)}%</span>
                      )}
                      <img src={product.thumbnail} alt={product.title} loading="lazy" />
                      <button
                        className={`shop-wish-btn ${wished ? 'active' : ''}`}
                        onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
                        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </button>

                      {/* Rating pill overlaid on image for featured cards */}
                      {isFeat && (
                        <div className="shop-card-rating-pill">
                          <span className="rp-star">★</span>
                          {product.rating}
                        </div>
                      )}
                    </div>

                    {/* Info zone */}
                    <div className="shop-card-info">
                      <span className="shop-card-cat">{product.category}</span>
                      {!isFeat && <Stars rating={product.rating} />}
                      <p className="shop-card-name">{product.title}</p>

                      <div className="shop-card-bottom">
                        <div className="shop-card-price-block">
                          <span className="shop-card-price">${product.price.toFixed(2)}</span>
                          {product.discountPercentage > 0 && (
                            <span className="shop-card-orig">${(product.price / (1 - product.discountPercentage / 100)).toFixed(0)}</span>
                          )}
                        </div>

                        {/* Cart control */}
                        <div className="shop-cart-ctrl" onClick={e => e.stopPropagation()}>
                          {inCart ? (
                            <div className="shop-qty-stepper">
                              <button className="shop-qty-btn" onClick={e => handleDecrease(e, product.id)}>−</button>
                              <span className="shop-qty-val">{qty}</span>
                              <button className="shop-qty-btn" onClick={e => handleIncrease(e, product)}>+</button>
                            </div>
                          ) : (
                            <button className="shop-add-btn" onClick={e => handleAdd(e, product)}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                              </svg>
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="shop-pagination">
                <button className="pg-btn pg-arrow" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <div className="pg-numbers">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const pg = i + 1;
                    return (
                      <button key={pg} className={`pg-btn ${page === pg ? 'active' : ''}`} onClick={() => setPage(pg)}>{pg}</button>
                    );
                  })}
                </div>
                <button className="pg-btn pg-arrow" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Shop;
