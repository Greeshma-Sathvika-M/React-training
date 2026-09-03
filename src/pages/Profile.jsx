import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const NAV_ITEMS = [
  { key: 'overview',  label: 'Overview' },
  { key: 'edit',      label: 'Edit Profile' },
  { key: 'address',   label: 'Address Book' },
  { key: 'orders',    label: 'Orders' },
  { key: 'password',  label: 'Change Password' },
];

/* ── helpers ──────────────────────────────────────────── */
function Avatar({ name }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return <div className="pf-avatar">{initials}</div>;
}

/* ── sub-sections ─────────────────────────────────────── */
function Overview({ user, setSection }) {
  return (
    <div className="pf-section">
      <div className="pf-overview-hero">
        <Avatar name={user.name} />
        <div>
          <h2 className="pf-name">{user.name}</h2>
          <p className="pf-email">{user.email}</p>
          <p className="pf-since">Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="pf-cards-grid">
        <button className="pf-card" onClick={() => setSection('edit')}>
          <span className="pf-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
          <span className="pf-card-label">Edit Profile</span>
          <span className="pf-card-desc">Update your name, email and phone</span>
        </button>

        <button className="pf-card" onClick={() => setSection('address')}>
          <span className="pf-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </span>
          <span className="pf-card-label">Address Book</span>
          <span className="pf-card-desc">Manage your saved addresses</span>
        </button>

        <button className="pf-card" onClick={() => setSection('orders')}>
          <span className="pf-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </span>
          <span className="pf-card-label">Orders</span>
          <span className="pf-card-desc">View your order history</span>
        </button>

        <button className="pf-card" onClick={() => setSection('password')}>
          <span className="pf-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
          <span className="pf-card-label">Security</span>
          <span className="pf-card-desc">Change your password</span>
        </button>
      </div>
    </div>
  );
}

function EditProfile({ user, updateProfile }) {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
      <h2 className="pf-section-title">Edit Profile</h2>
      {error && <div className="pf-error">{error}</div>}
      {success && <div className="pf-success">{success}</div>}
      <form className="pf-form" onSubmit={submit}>
        <div className="pf-field">
          <label>Full Name *</label>
          <input name="name" value={form.name} onChange={handle} placeholder="Jane Doe" />
        </div>
        <div className="pf-field">
          <label>Email Address *</label>
          <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" />
        </div>
        <div className="pf-field">
          <label>Phone Number</label>
          <input name="phone" value={form.phone} onChange={handle} placeholder="+1 555 000 0000" />
        </div>
        <button type="submit" className="pf-btn-primary">Save Changes</button>
      </form>
    </div>
  );
}

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
      <h2 className="pf-section-title">Address Book</h2>

      {hasAddress && (
        <div className="pf-address-card">
          <div className="pf-address-badge">Default</div>
          <p className="pf-address-line">{user.address}</p>
          <p className="pf-address-line">{user.city}{user.state ? `, ${user.state}` : ''} {user.zip}</p>
          <p className="pf-address-line">{user.country}</p>
        </div>
      )}

      {success && <div className="pf-success">{success}</div>}
      <h3 className="pf-sub-title">{hasAddress ? 'Update Address' : 'Add Address'}</h3>
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
            <label>State</label>
            <input name="state" value={form.state} onChange={handle} placeholder="NY" />
          </div>
        </div>
        <div className="pf-form-row">
          <div className="pf-field">
            <label>ZIP Code</label>
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
        <button type="submit" className="pf-btn-primary">Save Address</button>
      </form>
    </div>
  );
}

function Orders({ user }) {
  const orders = user.orders && user.orders.length > 0 ? user.orders : [];

  const statusClass = s => {
    if (s === 'Delivered')  return 'pf-badge pf-badge-green';
    if (s === 'Shipped')    return 'pf-badge pf-badge-blue';
    if (s === 'Processing') return 'pf-badge pf-badge-yellow';
    return 'pf-badge';
  };

  return (
    <div className="pf-section">
      <h2 className="pf-section-title">Order History</h2>
      {orders.length === 0 ? (
        <div className="pf-empty">
          <p>You haven't placed any orders yet.</p>
          <Link to="/shop" className="pf-btn-primary pf-btn-link">Start Shopping</Link>
        </div>
      ) : (
        <div className="pf-orders-list">
          {orders.map(o => (
            <div key={o.id} className="pf-order-row">
              <div className="pf-order-id">
                <span className="pf-order-label">Order</span>
                <span className="pf-order-num">{o.id}</span>
              </div>
              <div className="pf-order-date">
                <span className="pf-order-label">Placed</span>
                <span>{new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="pf-order-items">
                <span className="pf-order-label">Items</span>
                <span>{o.items}</span>
              </div>
              <div className="pf-order-total">
                <span className="pf-order-label">Total</span>
                <span>${o.total.toFixed(2)}</span>
              </div>
              <span className={statusClass(o.status)}>{o.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChangePassword({ user }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    setError(''); setSuccess('');
    // Verify current password against stored users
    const users = JSON.parse(localStorage.getItem('gmart_users') || '[]');
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
    // Save new password
    const idx = users.findIndex(u => u.id === user.id);
    users[idx].password = form.next;
    localStorage.setItem('gmart_users', JSON.stringify(users));
    setSuccess('Password changed successfully!');
    setForm({ current: '', next: '', confirm: '' });
  };

  return (
    <div className="pf-section">
      <h2 className="pf-section-title">Change Password</h2>
      {error && <div className="pf-error">{error}</div>}
      {success && <div className="pf-success">{success}</div>}
      <form className="pf-form" onSubmit={submit}>
        <div className="pf-field">
          <label>Current Password</label>
          <div className="pf-pw-wrap">
            <input name="current" type={show ? 'text' : 'password'} value={form.current} onChange={handle} placeholder="••••••••" />
            <button type="button" className="pw-toggle" onClick={() => setShow(v => !v)} aria-label="Toggle">
              {show ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="pf-field">
          <label>New Password</label>
          <input name="next" type="password" value={form.next} onChange={handle} placeholder="••••••••" />
        </div>
        <div className="pf-field">
          <label>Confirm New Password</label>
          <input name="confirm" type="password" value={form.confirm} onChange={handle} placeholder="••••••••" />
          {form.confirm && form.next !== form.confirm && (
            <span className="pf-field-err">Passwords don't match</span>
          )}
        </div>
        <button type="submit" className="pf-btn-primary">Update Password</button>
      </form>
    </div>
  );
}

/* ── Main Profile Page ────────────────────────────────── */
function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState('overview');
  const { updateProfile } = useAuth();

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="pf-page">
      <div className="pf-inner">
        {/* Sidebar */}
        <aside className="pf-sidebar">
          <div className="pf-sidebar-user">
            <Avatar name={user.name} />
            <div>
              <p className="pf-sb-name">{user.name}</p>
              <p className="pf-sb-email">{user.email}</p>
            </div>
          </div>
          <nav className="pf-sidebar-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                className={`pf-nav-item ${section === item.key ? 'active' : ''}`}
                onClick={() => setSection(item.key)}
              >
                {item.label}
              </button>
            ))}
            <button className="pf-nav-item pf-nav-logout" onClick={handleLogout}>
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="pf-content">
          {section === 'overview' && <Overview user={user} setSection={setSection} />}
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
