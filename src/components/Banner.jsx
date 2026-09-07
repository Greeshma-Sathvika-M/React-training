import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const DEALS = [
  {
    id: 1,
    tag: 'MEGA DEAL OF THE WEEK',
    title: 'Sony WH-1000XM5 Noise Canceling Headphones',
    desc: 'Immerse in pure acoustics with industry-leading noise cancellation & 30hr battery.',
    price: '$299.99',
    originalPrice: '$399.99',
    discount: '25% OFF',
    promoCode: 'SAVE10',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80',
    theme: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
    accent: '#818cf8',
    categoryLink: '/shop?category=laptops',
  },
  {
    id: 2,
    tag: 'LIMITED TIME OFFER',
    title: 'Apple Watch Ultra 2 Titanium Case',
    desc: 'Rugged and capable, crafted for endurance athletes, outdoor adventurers, & watersports.',
    price: '$679.00',
    originalPrice: '$799.00',
    discount: '15% OFF',
    promoCode: 'SAVE10',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80',
    theme: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
    accent: '#34d399',
    categoryLink: '/shop?category=smartphones',
  },
  {
    id: 3,
    tag: 'BESTSELLER SPECIAL',
    title: 'MacBook Pro 16" M3 Max Liquid Retina XDR',
    desc: 'The ultimate pro laptop with blistering performance and mind-blowing battery endurance.',
    price: '$1,999.00',
    originalPrice: '$2,499.00',
    discount: '20% OFF',
    promoCode: 'SAVE10',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&q=80',
    theme: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    accent: '#38bdf8',
    categoryLink: '/shop?category=laptops',
  },
  {
    id: 4,
    tag: 'GAMING FLASH DEAL',
    title: 'PlayStation 5 DualSense Wireless Controller',
    desc: 'Feel dynamic adaptive triggers and ultra-responsive haptic feedback on your fingertips.',
    price: '$54.99',
    originalPrice: '$74.99',
    discount: '26% OFF',
    promoCode: 'SAVE10',
    img: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=700&q=80',
    theme: 'linear-gradient(135deg, #701a75 0%, #86198f 50%, #a21caf 100%)',
    accent: '#f472b6',
    categoryLink: '/shop?category=smartphones',
  },
  {
    id: 5,
    tag: 'MOBILE FLAGSHIP',
    title: 'Samsung Galaxy S24 Ultra 5G AI Smartphone',
    desc: '200MP camera with revolutionary Galaxy AI photo enhancement and Titanium build.',
    price: '$1,099.99',
    originalPrice: '$1,299.99',
    discount: '15% OFF',
    promoCode: 'SAVE10',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&q=80',
    theme: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
    accent: '#60a5fa',
    categoryLink: '/shop?category=smartphones',
  },
];

const CATEGORIES = [
  {
    label: 'Cell Phone & Tablets',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
    bg: '#eff6ff',
    count: '120+ Products',
    link: '/shop',
  },
  {
    label: 'Game & Video',
    img: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=300&q=80',
    bg: '#fdf4ff',
    count: '80+ Products',
    link: '/shop',
  },
  {
    label: 'Sport Watches',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80',
    bg: '#ecfdf5',
    count: '45+ Products',
    link: '/shop',
  },
  {
    label: 'Computers & Laptop',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80',
    bg: '#fff7ed',
    count: '95+ Products',
    link: '/shop',
  },
];

function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % DEALS.length);
      }, 3000); // changes every 3 seconds automatically
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const deal = DEALS[currentSlide];

  return (
    <>
      <style>{`
        .banner-wrapper {
          background: #f8fafc;
          padding-top: 24px;
        }

        /* ── Hero Slideshow ── */
        .hero-slider-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
        }

        .hero-slide {
          background: ${deal.theme};
          border-radius: 24px;
          padding: 50px 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 440px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.25);
          transition: background 0.6s ease;
        }

        .hero-slide-bg-deco {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%);
          right: -100px;
          bottom: -150px;
          pointer-events: none;
        }

        .hero-content {
          max-width: 580px;
          z-index: 2;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .hero-tag-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero-tag {
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(8px);
          padding: 6px 14px;
          border-radius: 999px;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .hero-discount-pill {
          background: #ef4444;
          color: #fff;
          font-weight: 800;
          font-size: 0.8rem;
          padding: 4px 12px;
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .hero-title {
          font-size: clamp(2rem, 3.6vw, 2.75rem);
          font-weight: 900;
          line-height: 1.15;
          margin: 0;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .hero-desc {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.55;
          margin: 0;
          max-width: 490px;
        }

        .hero-price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-top: 4px;
        }

        .hero-current-price {
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
        }

        .hero-old-price {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: line-through;
        }

        .hero-actions-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 30px;
          background: #fff;
          color: #0f172a;
          font-size: 0.95rem;
          font-weight: 800;
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        }

        .hero-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
          background: #f8fafc;
        }

        .hero-promo-coupon {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(8px);
          border: 1px dashed rgba(255, 255, 255, 0.5);
          border-radius: 12px;
          padding: 8px 16px;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .hero-promo-coupon:hover {
          background: rgba(0, 0, 0, 0.5);
          border-color: #fff;
        }

        .promo-code-badge {
          font-family: monospace;
          font-size: 1rem;
          font-weight: 800;
          color: #fbbf24;
          letter-spacing: 0.05em;
        }

        .promo-copy-hint {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.15);
          padding: 3px 8px;
          border-radius: 6px;
        }

        .hero-image-wrap {
          flex-shrink: 0;
          width: 380px;
          height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px;
          box-shadow: 0 16px 36px rgba(0,0,0,0.3);
          transition: transform 0.4s ease;
        }

        .hero-slide:hover .hero-img {
          transform: scale(1.03) rotate(-1deg);
        }

        /* ── Slider Navigation & Dots ── */
        .slider-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 18px;
          padding: 0 4px;
        }

        .slider-dots {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .slider-dot {
          height: 8px;
          width: 24px;
          border-radius: 4px;
          background: #cbd5e1;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .slider-dot.active {
          width: 48px;
          background: #2563eb;
        }

        .slider-arrows {
          display: flex;
          gap: 10px;
        }

        .slider-arrow-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #fff;
          border: 1px solid #e2e8f0;
          color: #334155;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .slider-arrow-btn:hover {
          background: #2563eb;
          color: #fff;
          border-color: #2563eb;
        }

        .slider-timer-bar-wrap {
          width: 100%;
          height: 3px;
          background: rgba(226, 232, 240, 0.8);
          border-radius: 3px;
          margin-top: 12px;
          overflow: hidden;
        }

        .slider-timer-bar {
          height: 100%;
          background: #2563eb;
          width: 0%;
          animation: slideTimer 3s linear infinite;
        }

        @keyframes slideTimer {
          from { width: 0%; }
          to { width: 100%; }
        }

        /* ── Category Tiles ── */
        .category-tiles {
          max-width: 1280px;
          margin: 0 auto;
          padding: 44px 24px 20px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .cat-tile {
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 20px 20px;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #e2e8f0;
          background: #fff;
        }

        .cat-tile:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 28px -4px rgba(0, 0, 0, 0.08);
          border-color: #cbd5e1;
        }

        .cat-tile-img-box {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .cat-tile:hover .cat-tile-img-box {
          transform: scale(1.08);
        }

        .cat-tile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cat-tile-label {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin-bottom: 4px;
        }

        .cat-tile-count {
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748b;
        }

        /* ── Responsive ── */
        @media (max-width: 992px) {
          .category-tiles { grid-template-columns: repeat(2, 1fr); }
          .hero-slide { padding: 40px 32px; min-height: 400px; }
          .hero-image-wrap { width: 280px; height: 260px; }
        }

        @media (max-width: 768px) {
          .hero-slide { flex-direction: column; text-align: center; padding: 36px 24px; gap: 24px; }
          .hero-content { align-items: center; }
          .hero-actions-row { justify-content: center; }
          .hero-price-row { justify-content: center; }
          .hero-image-wrap { width: 100%; height: 240px; }
          .category-tiles { grid-template-columns: repeat(2, 1fr); gap: 14px; padding: 28px 16px 10px; }
        }
      `}</style>
      <div className="banner-wrapper">
        {/* Hero Slideshow */}
        <section
          className="hero-slider-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="hero-slide">
            <div className="hero-slide-bg-deco" />
            <div className="hero-content">
              <div className="hero-tag-row">
                <span className="hero-tag">{deal.tag}</span>
                <span className="hero-discount-pill">{deal.discount}</span>
              </div>
              <h1 className="hero-title">{deal.title}</h1>
              <p className="hero-desc">{deal.desc}</p>
              
              <div className="hero-price-row">
                <span className="hero-current-price">{deal.price}</span>
                <span className="hero-old-price">{deal.originalPrice}</span>
              </div>

              <div className="hero-actions-row">
                <Link to="/shop" className="hero-cta">
                  Shop Now →
                </Link>

                <div
                  className="hero-promo-coupon"
                  onClick={(e) => handleCopyCode(deal.promoCode, e)}
                  title="Click to copy promo code for 10% OFF"
                >
                  <span>🎟️ Promo:</span>
                  <span className="promo-code-badge">{deal.promoCode}</span>
                  <span className="promo-copy-hint">
                    {copiedCode ? '✓ Copied (10% OFF)!' : 'Copy Code'}
                  </span>
                </div>
              </div>
            </div>

            <div className="hero-image-wrap">
              <img
                src={deal.img}
                alt={deal.title}
                className="hero-img"
              />
            </div>
          </div>

          {/* Slider timer progress indicator */}
          <div className="slider-timer-bar-wrap">
            <div key={currentSlide} className="slider-timer-bar" />
          </div>

          {/* Controls */}
          <div className="slider-controls">
            <div className="slider-dots">
              {DEALS.map((_, idx) => (
                <button
                  key={idx}
                  className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="slider-arrows">
              <button
                className="slider-arrow-btn"
                onClick={() => setCurrentSlide(prev => (prev - 1 + DEALS.length) % DEALS.length)}
                aria-label="Previous Slide"
              >
                ❮
              </button>
              <button
                className="slider-arrow-btn"
                onClick={() => setCurrentSlide(prev => (prev + 1) % DEALS.length)}
                aria-label="Next Slide"
              >
                ❯
              </button>
            </div>
          </div>
        </section>

        {/* Category Tiles */}
        <section className="category-tiles">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.label}
              to={cat.link}
              className="cat-tile"
            >
              <div className="cat-tile-img-box" style={{ background: cat.bg }}>
                <img src={cat.img} alt={cat.label} className="cat-tile-img" />
              </div>
              <span className="cat-tile-label">{cat.label}</span>
              <span className="cat-tile-count">{cat.count}</span>
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}

export default Banner;
