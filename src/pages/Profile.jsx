import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

/* ── Nav config with icons ──────────────────────────────── */
const NAV_ITEMS = [
  {
    key: 'overview', label: 'Overview',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    key: 'edit', label: 'Edit Profile',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
  },
  {
    key: 'address', label: 'Address Book',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    key: 'orders', label: 'My Orders',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    key: 'password', label: 'Security',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
];

/* ── EyeIcon helper ────────────────────────────────────── */
const EyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const EyeOn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

/* ── Avatar helper ─────────────────────────────────────── */
function Avatar({ name, size = 'md' }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return <div className={`pf-avatar pf-avatar-${size}`}>{initials}</div>;
}

/* ══════════════════════════════════════════════════════════
   OVERVIEW
   ══════════════════════════════════════════════════════════ */
function Overview({ user, setSection }) {
  const orderCount  = user.orders?.length ?? 0;
  const totalSpend  = (user.orders ?? []).reduce((s, o) => s + (o.total || 0), 0);
  const hasAddress  = !!(user.address && user.city);

  return (
    <div className="pf-section">
      {/* Hero banner */}
      <div className="pf-overview-hero">
        <div className="pf-hero-avatar-wrap">
          <Avatar name={user.name} size="lg" />
          <span className="pf-hero-avatar-ring" />
        </div>
        <div className="pf-hero-info">
          <h2 className="pf-name">{user.name}</h2>
          <p className="pf-email">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            {user.email}
          </p>
          {user.phone && (
            <p className="pf-phone">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.93 5.93l.96-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {user.phone}
            </p>
          )}
          <p className="pf-since">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button className="pf-edit-quick-btn" onClick={() => setSection('edit')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </button>
      </div>

      {/* Stats strip */}
      <div className="pf-stats-strip">
        <div className="pf-stat" onClick={() => setSection('orders')}>
          <span className="pf-stat-value">{orderCount}</span>
          <span className="pf-stat-label">Orders</span>
        </div>
        <div className="pf-stat-divider" />
        <div className="pf-stat">
          <span className="pf-stat-value">${totalSpend.toFixed(2)}</span>
          <span className="pf-stat-label">Total Spent</span>
        </div>
        <div className="pf-stat-divider" />
        <div className="pf-stat" onClick={() => setSection('address')}>
          <span className="pf-stat-value">{hasAddress ? 1 : 0}</span>
          <span className="pf-stat-label">Addresses</span>
        </div>
      </div>

      {/* Quick action cards */}
      <p className="pf-cards-heading">Quick Actions</p>
      <div className="pf-cards-grid">
        <button className="pf-card" onClick={() => setSection('edit')}>
          <span className="pf-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
          <span className="pf-card-label">Edit Profile</span>
          <span className="pf-card-desc">Update your name, email and phone</span>
          <span className="pf-card-arrow">→</span>
        </button>

        <button className="pf-card" onClick={() => setSection('address')}>
          <span className="pf-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </span>
          <span className="pf-card-label">Address Book</span>
          <span className="pf-card-desc">Manage your saved addresses</span>
          <span className="pf-card-arrow">→</span>
        </button>

        <button className="pf-card" onClick={() => setSection('orders')}>
          <span className="pf-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </span>
          <span className="pf-card-label">My Orders</span>
          <span className="pf-card-desc">
            {orderCount > 0 ? `${orderCount} order${orderCount > 1 ? 's' : ''} placed` : 'No orders yet'}
          </span>
          <span className="pf-card-arrow">→</span>
        </button>

        <button className="pf-card" onClick={() => setSection('password')}>
          <span className="pf-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
          <span className="pf-card-label">Security</span>
          <span className="pf-card-desc">Change your password</span>
          <span className="pf-card-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EDIT PROFILE
   ══════════════════════════════════════════════════════════ */
function EditProfile({ user, updateProfile }) {
  const [form, setForm] = useState({
    name:  user.name  || '',
    email: user.email || '',
    phone: user.phone || '',
  });
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name || !form.email) { setError('Name and email are required.'); return; }
    const result = updateProfile({ name: form.name, email: form.email, phone: form.phone });
    if (!result.ok) { setError(result.error); return; }
    setSuccess('Profile updated successfully!');
  };

  return (
    <div className="pf-section">
      <div className="pf-section-header">
        <h2 className="pf-section-title">Edit Profile</h2>
        <p className="pf-section-subtitle">Keep your personal details up to date</p>
      </div>

      {/* Avatar row */}
      <div className="pf-avatar-row">
        <Avatar name={form.name || user.name} size="xl" />
        <div className="pf-avatar-meta">
          <p className="pf-avatar-name">{form.name || user.name}</p>
          <p className="pf-avatar-hint">Your initials are auto-generated from your name</p>
        </div>
      </div>

      {error   && <div className="pf-error">{error}</div>}
      {success && <div className="pf-success">✓ {success}</div>}

      <form className="pf-form" onSubmit={submit}>
        <div className="pf-field">
          <label htmlFor="ep-name">Full Name <span className="pf-req">*</span></label>
          <input id="ep-name" name="name" value={form.name} onChange={handle} placeholder="Jane Doe" />
        </div>
        <div className="pf-field">
          <label htmlFor="ep-email">Email Address <span className="pf-req">*</span></label>
          <input id="ep-email" name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" />
        </div>
        <div className="pf-field">
          <label htmlFor="ep-phone">Phone Number <span className="pf-optional">(optional)</span></label>
          <input id="ep-phone" name="phone" value={form.phone} onChange={handle} placeholder="+1 555 000 0000" />
        </div>
        <div className="pf-form-actions">
          <button type="submit" className="pf-btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ADDRESS BOOK
   ══════════════════════════════════════════════════════════ */
function AddressBook({ user, updateProfile }) {
  const [form, setForm] = useState({
    address: user.address || '',
    city:    user.city    || '',
    state:   user.state   || '',
    zip:     user.zip     || '',
    country: user.country || 'US',
  });
  const [success, setSuccess] = useState('');

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const submit = e => {
    e.preventDefault();
    updateProfile(form);
    setSuccess('Address saved successfully!');
  };

  const hasAddress = user.address && user.city && user.zip;

  return (
    <div className="pf-section">
      <div className="pf-section-header">
        <h2 className="pf-section-title">Address Book</h2>
        <p className="pf-section-subtitle">Addresses are used for checkout and shipping</p>
      </div>

      {hasAddress && (
        <div className="pf-address-card">
          <div className="pf-address-card-top">
            <span className="pf-address-badge">Default</span>
            <span className="pf-address-type">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Home
            </span>
          </div>
          <p className="pf-address-line pf-address-street">{user.address}</p>
          <p className="pf-address-line">{user.city}{user.state ? `, ${user.state}` : ''} {user.zip}</p>
          <p className="pf-address-line pf-address-country">{user.country}</p>
        </div>
      )}

      {success && <div className="pf-success">✓ {success}</div>}
      <h3 className="pf-sub-title">{hasAddress ? 'Update Address' : 'Add a New Address'}</h3>
      <form className="pf-form" onSubmit={submit}>
        <div className="pf-field pf-full">
          <label>Street Address</label>
          <input name="address" value={form.address} onChange={handle} placeholder="123 Main Street" />
        </div>
        <div className="pf-form-row">
          <div className="pf-field">
            <label>City</label>
            <input name="city" value={form.city} onChange={handle} placeholder="New York" />
          </div>
          <div className="pf-field">
            <label>State / Province</label>
            <input name="state" value={form.state} onChange={handle} placeholder="NY" />
          </div>
        </div>
        <div className="pf-form-row">
          <div className="pf-field">
            <label>ZIP / Postal Code</label>
            <input name="zip" value={form.zip} onChange={handle} placeholder="10001" />
          </div>
          <div className="pf-field">
            <label>Country</label>
            <select name="country" value={form.country} onChange={handle}>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="IN">India</option>
            </select>
          </div>
        </div>
        <div className="pf-form-actions">
          <button type="submit" className="pf-btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Save Address
          </button>
        </div>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ORDERS
   ══════════════════════════════════════════════════════════ */
function Orders({ user }) {
  const orders = user.orders?.length > 0 ? [...user.orders].reverse() : [];

  const statusMeta = s => {
    if (s === 'Delivered')  return { cls: 'pf-badge-green',  icon: '✓' };
    if (s === 'Shipped')    return { cls: 'pf-badge-blue',   icon: '↗' };
    if (s === 'Processing') return { cls: 'pf-badge-yellow', icon: '⟳' };
    return { cls: '', icon: '' };
  };

  return (
    <div className="pf-section">
      <div className="pf-section-header">
        <h2 className="pf-section-title">Order History</h2>
        <p className="pf-section-subtitle">
          {orders.length > 0
            ? `${orders.length} order${orders.length > 1 ? 's' : ''} placed`
            : 'No orders yet'}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="pf-empty">
          <div className="pf-empty-icon">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <p className="pf-empty-text">You haven't placed any orders yet.</p>
          <p className="pf-empty-sub">Browse our shop and find something you love!</p>
          <Link to="/shop" className="pf-btn-primary pf-btn-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="pf-orders-list">
          {orders.map(o => {
            const { cls, icon } = statusMeta(o.status);
            return (
              <div key={o.id} className="pf-order-row">
                <div className="pf-order-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </div>
                <div className="pf-order-main">
                  <div className="pf-order-top-row">
                    <span className="pf-order-num">{o.id}</span>
                    <span className={`pf-badge ${cls}`}>{icon} {o.status}</span>
                  </div>
                  <div className="pf-order-meta-row">
                    <span className="pf-order-meta-item">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="pf-order-meta-dot">·</span>
                    <span className="pf-order-meta-item">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/>
                        <line x1="10" y1="12" x2="14" y2="12"/>
                      </svg>
                      {o.items} item{o.items !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="pf-order-total-col">
                  <span className="pf-order-total-val">${o.total.toFixed(2)}</span>
                  <span className="pf-order-total-label">Total</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CHANGE PASSWORD
   ══════════════════════════════════════════════════════════ */
function ChangePassword({ user }) {
  const [form, setForm]   = useState({ current: '', next: '', confirm: '' });
  const [show, setShow]   = useState({ current: false, next: false, confirm: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const toggleShow = field => setShow(p => ({ ...p, [field]: !p[field] }));

  const strength = pw => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 6)  s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9!@#$%^&*]/.test(pw)) s++;
    return s;
  };
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];
  const pwStrength = strength(form.next);

  const submit = e => {
    e.preventDefault();
    setError(''); setSuccess('');
    const users  = JSON.parse(localStorage.getItem('gmart_users') || '[]');
    const stored = users.find(u => u.id === user.id);
    if (!stored || stored.password !== form.current) {
      setError('Current password is incorrect.');
      return;
    }
    if (form.next.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (form.next !== form.confirm) {
      setError('New passwords do not match.');
      return;
    }
    const idx = users.findIndex(u => u.id === user.id);
    users[idx].password = form.next;
    localStorage.setItem('gmart_users', JSON.stringify(users));
    setSuccess('Password changed successfully!');
    setForm({ current: '', next: '', confirm: '' });
  };

  return (
    <div className="pf-section">
      <div className="pf-section-header">
        <h2 className="pf-section-title">Change Password</h2>
        <p className="pf-section-subtitle">Use a strong password you don't use elsewhere</p>
      </div>

      {error   && <div className="pf-error">{error}</div>}
      {success && <div className="pf-success">✓ {success}</div>}

      <form className="pf-form" onSubmit={submit}>
        {/* Current password */}
        <div className="pf-field">
          <label>Current Password</label>
          <div className="pf-pw-wrap">
            <input
              name="current"
              type={show.current ? 'text' : 'password'}
              value={form.current}
              onChange={handle}
              placeholder="Enter current password"
            />
            <button type="button" className="pw-toggle" onClick={() => toggleShow('current')} aria-label="Toggle">
              {show.current ? <EyeOff /> : <EyeOn />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div className="pf-field">
          <label>New Password</label>
          <div className="pf-pw-wrap">
            <input
              name="next"
              type={show.next ? 'text' : 'password'}
              value={form.next}
              onChange={handle}
              placeholder="At least 6 characters"
            />
            <button type="button" className="pw-toggle" onClick={() => toggleShow('next')} aria-label="Toggle">
              {show.next ? <EyeOff /> : <EyeOn />}
            </button>
          </div>
          {form.next.length > 0 && (
            <div className="pf-pw-strength">
              <div className="pf-pw-strength-bars">
                {[1,2,3,4].map(i => (
                  <div
                    key={i}
                    className="pf-pw-bar"
                    style={{ background: pwStrength >= i ? strengthColor[pwStrength] : '#e5e7eb' }}
                  />
                ))}
              </div>
              <span className="pf-pw-strength-label" style={{ color: strengthColor[pwStrength] }}>
                {strengthLabel[pwStrength]}
              </span>
            </div>
          )}
        </div>

        {/* Confirm */}
        <div className="pf-field">
          <label>Confirm New Password</label>
          <div className="pf-pw-wrap">
            <input
              name="confirm"
              type={show.confirm ? 'text' : 'password'}
              value={form.confirm}
              onChange={handle}
              placeholder="Repeat new password"
            />
            <button type="button" className="pw-toggle" onClick={() => toggleShow('confirm')} aria-label="Toggle">
              {show.confirm ? <EyeOff /> : <EyeOn />}
            </button>
          </div>
          {form.confirm && form.next !== form.confirm && (
            <span className="pf-field-err">Passwords don't match</span>
          )}
          {form.confirm && form.next === form.confirm && form.confirm.length >= 6 && (
            <span className="pf-field-ok">✓ Passwords match</span>
          )}
        </div>

        <div className="pf-form-actions">
          <button type="submit" className="pf-btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PROFILE PAGE
   ══════════════════════════════════════════════════════════ */
function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState('overview');

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const orderCount = user.orders?.length ?? 0;

  return (
    <div className="pf-page">
      <div className="pf-inner">

        {/* ── Sidebar ────────────────────────────────── */}
        <aside className="pf-sidebar">
          {/* User identity block */}
          <div className="pf-sidebar-user">
            <Avatar name={user.name} size="md" />
            <div className="pf-sb-info">
              <p className="pf-sb-name">{user.name}</p>
              <p className="pf-sb-email">{user.email}</p>
              {orderCount > 0 && (
                <span className="pf-sb-orders-pill">{orderCount} order{orderCount > 1 ? 's' : ''}</span>
              )}
            </div>
          </div>

          {/* Nav */}
          <nav className="pf-sidebar-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                className={`pf-nav-item ${section === item.key ? 'active' : ''}`}
                onClick={() => setSection(item.key)}
              >
                <span className="pf-nav-icon">{item.icon}</span>
                <span className="pf-nav-label">{item.label}</span>
                {item.key === 'orders' && orderCount > 0 && (
                  <span className="pf-nav-badge">{orderCount}</span>
                )}
              </button>
            ))}
            <div className="pf-nav-divider" />
            <button className="pf-nav-item pf-nav-logout" onClick={handleLogout}>
              <span className="pf-nav-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </span>
              <span className="pf-nav-label">Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* ── Content ────────────────────────────────── */}
        <main className="pf-content">
          {section === 'overview' && <Overview  user={user} setSection={setSection} />}
          {section === 'edit'     && <EditProfile user={user} updateProfile={updateProfile} />}
          {section === 'address'  && <AddressBook user={user} updateProfile={updateProfile} />}
          {section === 'orders'   && <Orders user={user} />}
          {section === 'password' && <ChangePassword user={user} />}
        </main>

      </div>
    </div>
  );
}

export default Profile;
