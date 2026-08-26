import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">🐾 PawMart</span>
          <p>Your trusted home for healthy, happy pets.</p>
        </div>
        <div className="footer-links">
          <h4>Shop</h4>
          <Link to="/shop?category=Dogs">Dogs</Link>
          <Link to="/shop?category=Cats">Cats</Link>
          <Link to="/shop?category=Birds">Birds</Link>
          <Link to="/shop?category=Fish">Fish</Link>
          <Link to="/shop?category=Accessories">Accessories</Link>
        </div>
        <div className="footer-links">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-links">
          <h4>Help</h4>
          <Link to="/contact">Shipping Info</Link>
          <Link to="/contact">Returns</Link>
          <Link to="/contact">FAQ</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} PawMart. All rights reserved.</span>
        <span>Made with ❤️ for pets everywhere</span>
      </div>
    </footer>
  );
}

export default Footer;
