import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

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
    <>
      <style>{`
        .product-list-section {
          background: #f8fafc;
          padding: 60px 0 70px;
        }
        .pl-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .pl-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 20px;
        }
        .pl-title-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pl-eyebrow {
          font-size: 0.82rem;
          font-weight: 700;
          color: #2563eb;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0;
        }
        .pl-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .pl-tabs {
          display: flex;
          background: #e2e8f0;
          padding: 4px;
          border-radius: 12px;
          gap: 4px;
        }
        .pl-tab {
          background: transparent;
          border: none;
          font-size: 0.88rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          padding: 8px 18px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .pl-tab:hover {
          color: #0f172a;
        }
        .pl-tab.active {
          color: #0f172a;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          font-weight: 700;
        }
        .pl-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }
        .pl-loading {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }
        .pl-skeleton {
          height: 320px;
          border-radius: 14px;
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 1024px) {
          .pl-grid, .pl-loading { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .pl-grid, .pl-loading { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .pl-grid, .pl-loading { grid-template-columns: 1fr; gap: 16px; }
          .pl-header { flex-direction: column; align-items: flex-start; }
          .pl-tabs { width: 100%; justify-content: space-between; }
        }
      `}</style>
      <section className="product-list-section">
        <div className="pl-inner">
          {/* Section header */}
          <div className="pl-header">
            <div className="pl-title-wrap">
              <span className="pl-eyebrow">Featured Collections</span>
              <h2 className="pl-title">Trending &amp; Popular Products</h2>
            </div>
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
    </>
  );
}

export default ProductList;
