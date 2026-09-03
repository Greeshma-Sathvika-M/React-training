import React from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import ProductList from '../components/ProductList';
import './Home.css';

const SERVICES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: 'Free Shipping',
    desc: 'On all orders over $120',
    color: '#ede9fe',
    iconColor: '#7c3aed',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: '30-Day Returns',
    desc: 'Hassle-free return policy',
    color: '#dbeafe',
    iconColor: '#2563eb',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 12 19.79 19.79 0 0 1 1.15 3.18 2 2 0 0 1 3.12 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
      </svg>
    ),
    title: '24/7 Support',
    desc: 'Always here to help you',
    color: '#d1fae5',
    iconColor: '#059669',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    title: 'Secure Payment',
    desc: 'All major cards accepted',
    color: '#fef9c3',
    iconColor: '#d97706',
  },
];

function Home() {
  return (
    <div className="home-page">
      {/* Hero + Categories */}
      <Banner />

      {/* Products by Category */}
      <ProductList />

      {/* Promo Banner */}
      <section className="promo-banner-section">
        <div className="promo-inner">
          <div className="promo-glow" />
          <div className="promo-content">
            <p className="promo-eyebrow">Limited Time Offer</p>
            <h2 className="promo-title">Up to 32% off<br />on Premium Tech</h2>
            <p className="promo-sub">Exclusive deals on top-rated products — while stocks last.</p>
            <Link to="/shop" className="promo-btn">
              Shop the Sale
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>
          <div className="promo-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80"
              alt="Sale products"
              className="promo-img"
            />
          </div>
        </div>
      </section>

      {/* Service highlights */}
      <section className="services-section">
        <div className="services-inner">
          {SERVICES.map(s => (
            <div
              key={s.title}
              className="service-item"
              style={{ '--svc-bg': s.color, '--svc-icon': s.iconColor }}
            >
              <span className="service-icon">{s.icon}</span>
              <div>
                <p className="service-title">{s.title}</p>
                <p className="service-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
