import React from 'react';
import './Banner.css';

const CATEGORIES = [
  {
    label: 'Cell Phone & Tablets',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
    bg: '#f5e6ff',
  },
  {
    label: 'Game & Video',
    img: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=300&q=80',
    bg: '#e6f0ff',
  },
  {
    label: 'Sport Watches',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80',
    bg: '#fff0e6',
  },
  {
    label: 'Computers & Laptop',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80',
    bg: '#e6fff0',
  },
];

function Banner() {
  return (
    <div className="banner-wrapper">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-eyebrow">Best Ear Headphones</p>
          <h1 className="hero-title">Find Best<br />Matley Sound.</h1>
          <a href="#shop" className="hero-cta">Shop Now →</a>
        </div>
        <div className="hero-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
            alt="Headphones"
            className="hero-img"
          />
        </div>
      </section>

      {/* Category Tiles */}
      <section className="category-tiles">
        {CATEGORIES.map(cat => (
          <a
            key={cat.label}
            href="#shop"
            className="cat-tile"
            style={{ background: cat.bg }}
          >
            <img src={cat.img} alt={cat.label} className="cat-tile-img" />
            <span className="cat-tile-label">{cat.label}</span>
          </a>
        ))}
      </section>
    </div>
  );
}

export default Banner;
