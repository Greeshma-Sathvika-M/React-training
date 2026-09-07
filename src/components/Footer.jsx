import React, { useState } from 'react';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = e => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <>
      <style>{`
        .site-footer {
          background: #0f172a;
          color: #94a3b8;
          border-top: 1px solid #1e293b;
          margin-top: 40px;
        }
        .newsletter-bar {
          border-bottom: 1px solid #1e293b;
          padding: 48px 24px;
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
        }
        .newsletter-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }
        .newsletter-text h3 {
          margin: 0 0 6px;
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .newsletter-text p {
          margin: 0;
          color: #94a3b8;
          font-size: 0.95rem;
        }
        .newsletter-form {
          display: flex;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 12px;
          overflow: hidden;
          min-width: 360px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
          transition: border-color 0.2s ease;
        }
        .newsletter-form:focus-within {
          border-color: #3b82f6;
        }
        .newsletter-form input {
          border: none;
          outline: none;
          padding: 14px 18px;
          font-size: 0.92rem;
          flex: 1;
          background: transparent;
          color: #f8fafc;
        }
        .newsletter-form input::placeholder {
          color: #64748b;
        }
        .newsletter-form button {
          background: #2563eb;
          color: #fff;
          border: none;
          padding: 14px 26px;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s ease;
        }
        .newsletter-form button:hover {
          background: #1d4ed8;
        }
        .footer-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 56px 24px 44px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1.3fr;
          gap: 40px;
        }
        .footer-logo {
          font-size: 1.35rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }
        .footer-logo-box {
          background: #2563eb;
          color: #fff;
          border-radius: 8px;
          width: 30px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }
        .footer-brand-col p {
          font-size: 0.9rem;
          color: #94a3b8;
          line-height: 1.65;
          margin: 0 0 20px;
        }
        .social-links {
          display: flex;
          gap: 10px;
        }
        .social-links a {
          width: 36px;
          height: 36px;
          border: 1px solid #334155;
          border-radius: 8px;
          background: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 700;
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .social-links a:hover {
          background: #2563eb;
          color: #fff;
          border-color: #2563eb;
          transform: translateY(-2px);
        }
        .footer-col h4 {
          font-size: 0.88rem;
          font-weight: 700;
          color: #f8fafc;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0 0 18px;
        }
        .footer-col a,
        .footer-col p {
          display: block;
          font-size: 0.9rem;
          color: #94a3b8;
          text-decoration: none;
          margin-bottom: 10px;
          line-height: 1.5;
          transition: color 0.15s ease;
        }
        .footer-col a:hover {
          color: #60a5fa;
        }
        .footer-address {
          margin-bottom: 10px;
        }
        .footer-address a {
          display: inline;
          color: #60a5fa;
        }
        .footer-phone {
          font-weight: 700;
          color: #fff !important;
          font-size: 1.1rem !important;
          margin-top: 12px;
        }
        .footer-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px;
          border-top: 1px solid #1e293b;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #64748b;
          flex-wrap: wrap;
          gap: 16px;
        }
        .payment-icons {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .pay-icon {
          padding: 4px 10px;
          border: 1px solid #334155;
          background: #1e293b;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #cbd5e1;
        }
        .pay-paypal { color: #60a5fa; }
        .pay-visa   { color: #93c5fd; }
        .pay-mc     { color: #f87171; }
        .pay-stripe { color: #a78bfa; }
        @media (max-width: 1024px) {
          .footer-main { grid-template-columns: 1fr 1fr 1fr; }
          .footer-brand-col { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .footer-main { grid-template-columns: 1fr; padding: 36px 20px; }
          .newsletter-form { min-width: unset; width: 100%; }
          .newsletter-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
      <footer className="site-footer">
        {/* Newsletter */}
        <div className="newsletter-bar">
          <div className="newsletter-inner">
            <div className="newsletter-text">
              <h3>Subscribe for Latest Trends &amp; Deals</h3>
              <p>Get instant discount codes, flash sales and curated tech picks.</p>
            </div>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your Email"
                required
              />
              <button type="submit">{subscribed ? '✓ Subscribed!' : 'Subscribe'}</button>
            </form>
          </div>
        </div>

        {/* Main footer links */}
        <div className="footer-main">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <span className="footer-logo-box">G</span>
              <span>G-Mart</span>
            </div>
            <p>Your one-stop premium destination for state-of-the-art tech gadgets, electronics, and lifestyle essentials.</p>
            <div className="social-links">
              <a href="#f" aria-label="Facebook">FB</a>
              <a href="#t" aria-label="Twitter">X</a>
              <a href="#in" aria-label="LinkedIn">IN</a>
              <a href="#yt" aria-label="YouTube">YT</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <a href="#about">About us</a>
            <a href="#c">Careers</a>
            <a href="#s">Store Locations</a>
            <a href="#b">Our Blog</a>
            <a href="#r">Reviews</a>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <a href="#g">Game &amp; Video</a>
            <a href="#p">Phone &amp; Tablets</a>
            <a href="#c">Computers &amp; Laptop</a>
            <a href="#w">Sport Watches</a>
            <a href="#d">Discount Deals</a>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <a href="#f">FAQs</a>
            <a href="#r">Reviews</a>
            <a href="#contact">Contact Us</a>
            <a href="#s">Shipping Info</a>
            <a href="#re">Returns &amp; Warranty</a>
          </div>

          <div className="footer-col">
            <h4>Talk To Us</h4>
            <p className="footer-address">Find a location nearest you. See <a href="#s">Our Stores</a></p>
            <p className="footer-phone">+1 (800) 423-2672</p>
            <p className="footer-email-link">support@gmart.com</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} G-Mart Inc. All Rights Reserved.</span>
          <div className="payment-icons">
            <span className="pay-icon pay-paypal">PayPal</span>
            <span className="pay-icon pay-visa">VISA</span>
            <span className="pay-icon pay-mc">MasterCard</span>
            <span className="pay-icon pay-stripe">Stripe</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
