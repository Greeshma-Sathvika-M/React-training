import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import './ProductList.css';

const CATEGORY_TABS = [
  { key: 'all',           label: 'All Products' },
  { key: 'smartphones',   label: 'Phones' },
  { key: 'laptops',       label: 'Laptops' },
  { key: 'fragrances',    label: 'Beauty' },
  { key: 'furniture',     label: 'Furniture' },
  { key: 'groceries',     label: 'Groceries' },
];

const SORT_OPTIONS = [
  { key: 'rating',   label: 'Top Rated' },
  { key: 'price-lo', label: 'Price: Low' },
  { key: 'price-hi', label: 'Price: High' },
  { key: 'latest',   label: 'Newest' },
];

function ProductList() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('rating');

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=40&skip=0')
      .then(r => r.json())
      .then(data => {
        setAllProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  const displayed = [...filtered].sort((a, b) => {
    if (activeSort === 'rating')   return b.rating - a.rating;
    if (activeSort === 'price-lo') return a.price - b.price;
    if (activeSort === 'price-hi') return b.price - a.price;
    return b.id - a.id;
  }).slice(0, 12);

  return (
    <section className="product-list-section">
      <div className="pl-inner">
        {/* Section header */}
        <div className="pl-header">
          <div className="pl-title-group">
            <span className="pl-accent-bar" />
            <h2 className="pl-title">Featured Products</h2>
          </div>
          <div className="pl-sort-row">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                className={`pl-sort-btn ${activeSort === opt.key ? 'active' : ''}`}
                onClick={() => setActiveSort(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div className="pl-category-pills">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.key}
              className={`pl-pill ${activeCategory === tab.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(tab.key)}
            >
              {tab.label}
              {activeCategory === tab.key && (
                <span className="pl-pill-count">
                  {activeCategory === 'all'
                    ? allProducts.length
                    : allProducts.filter(p => p.category === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="pl-loading">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="pl-skeleton" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="pl-empty">
            <p>No products found in this category.</p>
            <button onClick={() => setActiveCategory('all')} className="pl-empty-btn">
              View All Products
            </button>
          </div>
        ) : (
          <div className="pl-grid">
            {displayed.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All */}
        <div className="pl-footer">
          <button
            className="pl-view-all-btn"
            onClick={() => navigate(
              activeCategory === 'all'
                ? '/shop'
                : `/shop?category=${activeCategory}`
            )}
          >
            View All{activeCategory !== 'all' ? ` ${CATEGORY_TABS.find(t => t.key === activeCategory)?.label}` : ''} Products
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductList;
