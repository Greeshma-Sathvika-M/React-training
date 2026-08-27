import React from 'react';
import Banner from '../components/Banner';
import ProductList from '../components/ProductList';
import './Home.css';

const SERVICES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: 'Free Shipping',
    desc: 'Free Shipping for orders over $120',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'Refund',
    desc: 'Within 30 days for an exchange',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 12 19.79 19.79 0 0 1 1.15 3.18 2 2 0 0 1 3.12 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
      </svg>
    ),
    title: 'Support',
    desc: '24 hours a day, 7 days a week',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    title: 'Payment',
    desc: 'Pay with Multiple Credit Cards',
  },
];

function Home() {
  return (
    <div className="home-page">
      {/* Hero + Categories */}
      <Banner />

      {/* Popular Products */}
      <ProductList />

      {/* Promo Banner */}
      <section className="promo-banner-section">
        <div className="promo-inner">
          <div className="promo-content">
            <p className="promo-eyebrow">Apple iPhone 12 Pro</p>
            <h2 className="promo-title">The wait is on:<br />iphon 12 max pro</h2>
            <p className="promo-sub">Last call for up to <strong>32% off!</strong></p>
            <a href="#shop" className="promo-btn">Buy Now →</a>
          </div>
          <div className="promo-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80"
              alt="iPhone 12 Pro"
              className="promo-img"
            />
          </div>
        </div>
      </section>

      {/* Service highlights */}
      <section className="services-section">
        <div className="services-inner">
          {SERVICES.map(s => (
            <div key={s.title} className="service-item">
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
