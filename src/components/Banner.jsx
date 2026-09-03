import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Banner.css';

const CATEGORIES = [
  {
    key: 'smartphones',
    label: 'Phones & Tablets',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
    color: '#ede9fe',
    accent: '#7c3aed',
  },
  {
    key: 'laptops',
    label: 'Computers & Laptops',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80',
    color: '#dbeafe',
    accent: '#2563eb',
  },
  {
    key: 'fragrances',
    label: 'Beauty & Fragrance',
    img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300&q=80',
    color: '#fce7f3',
    accent: '#db2777',
  },
  {
    key: 'furniture',
    label: 'Home & Furniture',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80',
    color: '#d1fae5',
    accent: '#059669',
  },
];

function Banner() {
  const navigate = useNavigate();

  return (
    <div className="banner-wrapper">
      {/* ── Hero ────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />

        <div className="hero-content">
          <span className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            New Season Arrivals
          </span>
          <h1 className="hero-title">
            Discover<br />
            <span className="hero-title-accent">Tomorrow's</span><br />
            Essentials
          </h1>
          <p className="hero-subtitle">
            Curated gadgets, fashion & home goods — delivered to your door.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="hero-cta-primary">
              Shop Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
            <Link to="/shop" className="hero-cta-ghost">View All Deals</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>12K+</strong><span>Products</span></div>
            <div className="hero-stat-div" />
            <div className="hero-stat"><strong>98%</strong><span>Satisfaction</span></div>
            <div className="hero-stat-div" />
            <div className="hero-stat"><strong>Free</strong><span>Shipping $120+</span></div>
          </div>
        </div>

        <div className="hero-image-wrap">
          <div className="hero-image-ring" />
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
            alt="Featured product"
            className="hero-img"
          />
        </div>
      </section>

      {/* ── Category Tiles ───────────────────────────── */}
      <section className="category-tiles-section">
        <div className="category-tiles-header">
          <h2 className="category-tiles-title">Shop by Category</h2>
          <Link to="/shop" className="category-see-all">See All →</Link>
        </div>
        <div className="category-tiles">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className="cat-tile"
              style={{ '--cat-color': cat.color, '--cat-accent': cat.accent }}
              onClick={() => navigate(`/shop?category=${cat.key}`)}
              aria-label={`Browse ${cat.label}`}
            >
              <div className="cat-tile-img-wrap">
                <img src={cat.img} alt={cat.label} className="cat-tile-img" />
              </div>
              <span className="cat-tile-label">{cat.label}</span>
              <span className="cat-tile-arrow">→</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Banner;
