import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Shop.css';

const CATEGORIES = ['All', 'smartphones', 'laptops', 'fragrances', 'skincare', 'groceries', 'home-decoration', 'furniture', 'tops', 'womens-dresses', 'womens-shoes', 'mens-shirts', 'mens-shoes', 'mens-watches', 'womens-watches', 'womens-bags', 'womens-jewellery', 'sunglasses', 'automotive', 'motorcycle', 'lighting'];

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
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const category = searchParams.get('category') || 'All';
  const q = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'default';

  const [search, setSearch] = useState(q);
  const [added, setAdded] = useState({});

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
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    return 0;
  });

  const handleSearch = e => {
    e.preventDefault();
    setPage(1);
    setSearchParams(search.trim() ? { q: search.trim() } : {});
  };

  const handleCategory = (cat) => {
    setPage(1);
    setSearch('');
    setSearchParams(cat === 'All' ? {} : { category: cat });
  };

  const handleAdd = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product.id]: false })), 1800);
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="shop-page">
      <div className="shop-inner">
        {/* Top bar */}
        <div className="shop-topbar">
          <div className="shop-topbar-left">
            <h1 className="shop-title">Shop</h1>
            {!loading && <span className="shop-count">{total} products</span>}
          </div>
          <div className="shop-topbar-right">
            <form className="shop-search-form" onSubmit={handleSearch}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
              />
              <button type="submit">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </form>
            <select
              className="shop-sort"
              value={sort}
              onChange={e => setSearchParams(prev => { const p = Object.fromEntries(prev); p.sort = e.target.value; return p; })}
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="shop-body">
          {/* Sidebar categories */}
          <aside className="shop-sidebar">
            <h3>Categories</h3>
            <ul className="shop-cats">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button
                    className={`shop-cat-btn ${category === cat ? 'active' : ''}`}
                    onClick={() => handleCategory(cat)}
                  >
                    {cat === 'All' ? 'All Products' : cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Grid */}
          <div className="shop-content">
            {loading ? (
              <div className="shop-grid">
                {Array.from({ length: PER_PAGE }).map((_, i) => <div key={i} className="shop-skeleton" />)}
              </div>
            ) : sorted.length === 0 ? (
              <div className="shop-empty">
                <p>No products found. Try a different search or category.</p>
              </div>
            ) : (
              <>
                <div className="shop-grid">
                  {sorted.map(product => (
                    <div key={product.id} className="shop-card" onClick={() => navigate(`/product/${product.id}`)}>
                      <div className="shop-card-img-wrap">
                        {product.discountPercentage > 10 && (
                          <span className="shop-card-badge">-{Math.round(product.discountPercentage)}%</span>
                        )}
                        <img src={product.thumbnail} alt={product.title} loading="lazy" />
                        <button
                          className={`shop-wish-btn ${isWishlisted(product.id) ? 'active' : ''}`}
                          onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
                          aria-label="Wishlist"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </button>
                      </div>
                      <div className="shop-card-body">
                        <p className="shop-card-cat">{product.category}</p>
                        <Stars rating={product.rating} />
                        <p className="shop-card-name">{product.title}</p>
                        <div className="shop-card-price-row">
                          <span className="shop-card-price">${product.price.toFixed(2)}</span>
                          {product.discountPercentage > 0 && (
                            <span className="shop-card-orig">${(product.price / (1 - product.discountPercentage / 100)).toFixed(0)}</span>
                          )}
                        </div>
                        <button
                          className={`shop-add-btn ${added[product.id] ? 'added' : ''}`}
                          onClick={e => handleAdd(e, product)}
                        >
                          {added[product.id] ? '✓ Added!' : '+ Add to Cart'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="shop-pagination">
                    <button className="pg-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹ Prev</button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const pg = i + 1;
                      return (
                        <button key={pg} className={`pg-btn ${page === pg ? 'active' : ''}`} onClick={() => setPage(pg)}>{pg}</button>
                      );
                    })}
                    <button className="pg-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next ›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
