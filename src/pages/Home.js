import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const featured = products.filter(p => ['Popular', 'New', 'Premium'].includes(p.badge)).slice(0, 4);

function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">🐾 Your Trusted Pet Store</p>
          <h1>Find Your Perfect <span className="accent">Furry Friend</span></h1>
          <p className="hero-sub">
            Adopt, shop and spoil your pets — dogs, cats, birds, fish and accessories all in one place.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary">Shop Now</Link>
            <Link to="/about" className="btn btn-outline">Learn More</Link>
          </div>
        </div>
        <div className="hero-banner">
          <span className="hero-emoji">🐶</span>
          <span className="hero-emoji">🐱</span>
          <span className="hero-emoji">🦜</span>
          <span className="hero-emoji">🐠</span>
        </div>
      </section>

      {/* Stats bar */}
      <section className="stats-bar">
        <div className="stat"><strong>500+</strong><span>Happy Pets Adopted</span></div>
        <div className="stat"><strong>50+</strong><span>Breeds Available</span></div>
        <div className="stat"><strong>4.9★</strong><span>Customer Rating</span></div>
        <div className="stat"><strong>24/7</strong><span>Pet Support</span></div>
      </section>

      {/* Featured */}
      <section className="section">
        <div className="section-header">
          <h2>Featured Pets & Products</h2>
          <Link to="/shop" className="view-all">View All →</Link>
        </div>
        <div className="product-grid">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <h2>Browse by Category</h2>
        <div className="category-cards">
          {[
            { label: 'Dogs', emoji: '🐕', color: '#fff3e0' },
            { label: 'Cats', emoji: '🐈', color: '#f3e5f5' },
            { label: 'Birds', emoji: '🦜', color: '#e8f5e9' },
            { label: 'Fish', emoji: '🐠', color: '#e3f2fd' },
            { label: 'Accessories', emoji: '🧸', color: '#fce4ec' },
          ].map(c => (
            <Link key={c.label} to={`/shop?category=${c.label}`} className="category-card" style={{ background: c.color }}>
              <span className="cat-emoji">{c.emoji}</span>
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="cta-banner">
        <h2>🐾 Ready to give a pet a loving home?</h2>
        <p>Browse our full collection and find your perfect companion today.</p>
        <Link to="/shop" className="btn btn-primary">Explore All Pets</Link>
      </section>
    </div>
  );
}

export default Home;
