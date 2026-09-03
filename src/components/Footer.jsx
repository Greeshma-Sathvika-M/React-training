import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = e => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="site-footer">
      {/* Newsletter */}
      <div className="newsletter-bar">
        <div className="newsletter-inner">
          <div className="newsletter-text">
            <h3>Stay in the loop</h3>
            <p>Get the latest deals and arrivals straight to your inbox.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            {subscribed ? (
              <div className="newsletter-success">🎉 You're subscribed!</div>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
                <button type="submit">Subscribe</button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main footer links */}
      <div className="footer-main">
        <div className="footer-brand-col">
          <span className="footer-logo">G-Mart</span>
          <p>Your one-stop shop for premium gadgets, fashion, and home essentials — delivered fast.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.4z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff"/></svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/shop?category=smartphones">Phones & Tablets</Link>
          <Link to="/shop?category=laptops">Computers & Laptops</Link>
          <Link to="/shop?category=fragrances">Beauty</Link>
          <Link to="/shop?category=furniture">Home & Furniture</Link>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/profile">My Profile</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/login">Sign In</Link>
        </div>

        <div className="footer-col">
          <h4>Talk To Us</h4>
          <p className="footer-address">Find a location nearest you.</p>
          <p className="footer-phone">+1 800 G-MART</p>
          <p className="footer-email-link">support@gmart.com</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} G-Mart. All Rights Reserved.</span>
        <div className="payment-icons">
          <span className="pay-icon pay-paypal">PayPal</span>
          <span className="pay-icon pay-visa">VISA</span>
          <span className="pay-icon pay-mc">MC</span>
          <span className="pay-icon pay-stripe">stripe</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
