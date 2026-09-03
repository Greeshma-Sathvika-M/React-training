import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login'); // 'login' | 'register'

  /* ── Login state ─────────────────────────────────── */
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);

  /* ── Register state ──────────────────────────────── */
  const [regData, setRegData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [regError, setRegError] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // Already logged in — go to profile
  if (user) {
    navigate('/profile', { replace: true });
    return null;
  }

  const handleLoginChange = e =>
    setLoginData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleRegChange = e =>
    setRegData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleLogin = e => {
    e.preventDefault();
    setLoginError('');
    if (!loginData.email || !loginData.password) {
      setLoginError('Please fill in all fields.');
      return;
    }
    const result = login(loginData);
    if (!result.ok) { setLoginError(result.error); return; }
    navigate('/profile');
  };

  const handleRegister = e => {
    e.preventDefault();
    setRegError('');
    if (!regData.name || !regData.email || !regData.password || !regData.confirm) {
      setRegError('Please fill in all fields.');
      return;
    }
    if (regData.password.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }
    if (regData.password !== regData.confirm) {
      setRegError('Passwords do not match.');
      return;
    }
    const result = register({ name: regData.name, email: regData.email, password: regData.password });
    if (!result.ok) { setRegError(result.error); return; }
    setRegSuccess(true);
    setTimeout(() => navigate('/profile'), 900);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <Link to="/" className="auth-logo">G-Mart</Link>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setLoginError(''); }}
          >Sign In</button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setRegError(''); }}
          >Create Account</button>
        </div>

        {/* ── Login Form ──────────────────────────────── */}
        {tab === 'login' && (
          <form className="auth-form" onSubmit={handleLogin} noValidate>
            <h2 className="auth-heading">Welcome back</h2>
            <p className="auth-sub">Sign in to your G-Mart account</p>

            {loginError && <div className="auth-error">{loginError}</div>}

            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={loginData.email}
                onChange={handleLoginChange}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <div className="auth-pw-wrap">
                <input
                  id="login-password"
                  name="password"
                  type={showLoginPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowLoginPw(v => !v)} aria-label="Toggle password">
                  {showLoginPw ? (
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

            <button type="submit" className="auth-btn-primary">Sign In</button>

            <p className="auth-switch">
              Don't have an account?{' '}
              <button type="button" className="auth-link-btn" onClick={() => setTab('register')}>
                Create one
              </button>
            </p>
          </form>
        )}

        {/* ── Register Form ────────────────────────────── */}
        {tab === 'register' && (
          <form className="auth-form" onSubmit={handleRegister} noValidate>
            <h2 className="auth-heading">Create account</h2>
            <p className="auth-sub">Join G-Mart and start shopping</p>

            {regError && <div className="auth-error">{regError}</div>}
            {regSuccess && <div className="auth-success">Account created! Redirecting…</div>}

            <div className="auth-field">
              <label htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                value={regData.name}
                onChange={handleRegChange}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={regData.email}
                onChange={handleRegChange}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="reg-password">Password <span className="auth-hint">(min 6 chars)</span></label>
              <div className="auth-pw-wrap">
                <input
                  id="reg-password"
                  name="password"
                  type={showRegPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={regData.password}
                  onChange={handleRegChange}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowRegPw(v => !v)} aria-label="Toggle password">
                  {showRegPw ? (
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

            {regData.password.length > 0 && (
              <div className="auth-strength">
                <div className={`auth-strength-bar s${Math.min(4, Math.floor(regData.password.length / 2))}`} />
                <span>{regData.password.length < 6 ? 'Too short' : regData.password.length < 10 ? 'Fair' : 'Strong'}</span>
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="reg-confirm">Confirm password</label>
              <input
                id="reg-confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={regData.confirm}
                onChange={handleRegChange}
              />
              {regData.confirm && regData.password !== regData.confirm && (
                <span className="auth-field-err">Passwords don't match</span>
              )}
            </div>

            <button type="submit" className="auth-btn-primary" disabled={regSuccess}>
              {regSuccess ? 'Account created!' : 'Create Account'}
            </button>

            <p className="auth-switch">
              Already have an account?{' '}
              <button type="button" className="auth-link-btn" onClick={() => setTab('login')}>
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
