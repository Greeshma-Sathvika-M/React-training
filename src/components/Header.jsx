import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { totalItems } = useCart();
  const { items: wishItems } = useWishlist();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const avatarInitials = user
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : null;

  const close = () => setMenuOpen(false);

  const handleSearch = e => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
    close();
  };

  return (
    <>
      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 200;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
        }
        .header-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 68px;
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .header-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 900;
          font-size: 1.1rem;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }
        .logo-text {
          font-size: 1.35rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        .logo-accent {
          color: #2563eb;
        }
        .header-nav {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
        }
        .header-nav a {
          font-size: 0.92rem;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 8px;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .header-nav a:hover {
          color: #0f172a;
          background: #f1f5f9;
        }
        .header-nav a.active {
          color: #2563eb;
          background: #eff6ff;
          font-weight: 700;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .header-search {
          display: flex;
          align-items: center;
          border: 1.5px solid #e2e8f0;
          border-radius: 999px;
          background: #f8fafc;
          transition: all 0.2s ease;
          padding: 2px 4px 2px 14px;
        }
        .header-search:focus-within {
          border-color: #2563eb;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }
        .header-search input {
          border: none;
          background: transparent;
          outline: none;
          padding: 7px 0;
          font-size: 0.88rem;
          color: #0f172a;
          width: 180px;
        }
        .header-search input::placeholder {
          color: #94a3b8;
        }
        .header-search button {
          background: #2563eb;
          border: none;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 6px;
          transition: background 0.15s ease;
        }
        .header-search button:hover {
          background: #1d4ed8;
        }
        .icon-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          width: 40px;
          height: 40px;
          color: #334155;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.18s ease;
          text-decoration: none;
        }
        .icon-btn:hover {
          background: #eff6ff;
          color: #2563eb;
          border-color: #bfdbfe;
          transform: translateY(-1px);
        }
        .header-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.02em;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
        }
        .cart-btn .cart-count,
        .wish-btn .wish-count {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: #fff;
          font-size: 0.65rem;
          font-weight: 800;
          min-width: 18px;
          height: 18px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 5px rgba(239, 68, 68, 0.4);
          border: 2px solid #fff;
        }
        .hamburger-btn {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        .hamburger-btn span {
          display: block;
          width: 22px;
          height: 2px;
          background: #1e293b;
          border-radius: 2px;
        }
        @media (max-width: 900px) {
          .hamburger-btn { display: flex; }
          .header-search { display: none; }
          .header-nav {
            display: none;
            position: absolute;
            top: 68px;
            left: 0; right: 0;
            background: #fff;
            flex-direction: column;
            padding: 16px 24px 24px;
            border-bottom: 1px solid #e2e8f0;
            gap: 6px;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
          }
          .header-nav.open { display: flex; }
          .header-nav a { width: 100%; padding: 12px 16px; }
        }
        @media (max-width: 480px) {
          .header-inner { gap: 12px; padding: 0 16px; }
        }
      `}</style>
      <header className="site-header">
        <div className="header-inner">
          {/* Logo */}
          <Link to="/" className="header-logo" onClick={close}>
            <div className="logo-icon-wrap">G</div>
            <span className="logo-text">G<span className="logo-accent">-Mart</span></span>
          </Link>

          {/* Nav */}
          <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" end onClick={close}>Home</NavLink>
            <NavLink to="/shop" onClick={close}>Shop</NavLink>
            <NavLink to="/blog" onClick={close}>Blog</NavLink>
            <NavLink to="/contact" onClick={close}>Contact</NavLink>
          </nav>

          {/* Right actions */}
          <div className="header-actions">
            <form className="header-search" onSubmit={handleSearch}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
              />
              <button type="submit" aria-label="Search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </form>

            <Link
              to={user ? '/profile' : '/login'}
              className="icon-btn account-btn"
              onClick={close}
              aria-label={user ? 'My Profile' : 'Sign In'}
            >
              {user ? (
                <span className="header-avatar">{avatarInitials}</span>
              ) : (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              )}
            </Link>

            <Link to="/wishlist" className="icon-btn wish-btn" aria-label="Wishlist">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishItems.length > 0 && <span className="wish-count">{wishItems.length}</span>}
            </Link>

            <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </Link>

            <button className="hamburger-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
