import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

const TABS = ['Top Rated', 'Best Selling', 'Latest Products'];

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Top Rated');

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=12&skip=0')
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const displayed = [...products].sort((a, b) => {
    if (activeTab === 'Top Rated') return b.rating - a.rating;
    if (activeTab === 'Best Selling') return b.stock - a.stock;
    return b.id - a.id;
  });

  return (
    <section className="product-list-section">
      <div className="pl-inner">
        {/* Section header */}
        <div className="pl-header">
          <h2 className="pl-title">
            <span className="pl-accent-bar" />
            Popular Products
          </h2>
          <div className="pl-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`pl-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="pl-loading">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="pl-skeleton" />
            ))}
          </div>
        ) : (
          <div className="pl-grid">
            {displayed.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductList;
