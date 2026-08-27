import React, { useState } from 'react';
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = e => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="site-footer">
      {/* Newsletter */}
      <div className="newsletter-bar">
        <div className="newsletter-inner">
          <div className="newsletter-text">
            <h3>Subscribe for Latest Trends &amp; Offers</h3>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your Email"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Main footer links */}
      <div className="footer-main">
        <div className="footer-brand-col">
          <span className="footer-logo">◈ LOGO</span>
          <p>The home and elements needed to create beautiful products.</p>
          <div className="social-links">
            <a href="#f" aria-label="Facebook">f</a>
            <a href="#t" aria-label="Twitter">t</a>
            <a href="#in" aria-label="LinkedIn">in</a>
            <a href="#yt" aria-label="YouTube">▶</a>
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
          <a href="#d">Discounts</a>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <a href="#f">FAQs</a>
          <a href="#r">Reviews</a>
          <a href="#contact">Contact Us</a>
          <a href="#s">Shipping</a>
          <a href="#re">Returns</a>
        </div>

        <div className="footer-col">
          <h4>Talk To Us</h4>
          <p className="footer-address">Find a location nearest you. See <a href="#s">Our Stores</a></p>
          <p className="footer-phone">+624 423 26 72</p>
          <p className="footer-email-link">support@harry.com</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} LOGO. All Rights Reserved.</span>
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
