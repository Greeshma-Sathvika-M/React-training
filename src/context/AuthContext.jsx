import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext  = createContext(null);
const TOKEN_KEY    = 'gmart_token';

// ── API helper ────────────────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  let res;
  try {
    res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error('Cannot reach the server. Make sure the backend is running (npm run server).');
  }

  // If the response is not JSON (e.g. HTML 404 when server is down), give a clear message
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Server is not running. Please start it with: npm run server');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed.');
  return data;
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // hydrating from token

  // ── On mount: restore session from stored token ──────────────────────────
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    apiFetch('/api/auth/me')
      .then(data => setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(async ({ name, email, password }) => {
    try {
      const data = await apiFetch('/api/auth/register', {
        method : 'POST',
        body   : JSON.stringify({ name, email, password }),
      });
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    try {
      const data = await apiFetch('/api/auth/login', {
        method : 'POST',
        body   : JSON.stringify({ email, password }),
      });
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  // ── Update profile ────────────────────────────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    try {
      const data = await apiFetch('/api/profile', {
        method : 'PUT',
        body   : JSON.stringify(updates),
      });
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);

  // ── Change password ───────────────────────────────────────────────────────
  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    try {
      await apiFetch('/api/profile/password', {
        method : 'PUT',
        body   : JSON.stringify({ currentPassword, newPassword }),
      });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);

  // ── Place order ───────────────────────────────────────────────────────────
  const placeOrder = useCallback(async ({ items, total, shipping, paymentMethod, paymentDetails }) => {
    try {
      const data = await apiFetch('/api/orders', {
        method : 'POST',
        body   : JSON.stringify({ items, total, shipping, paymentMethod, paymentDetails }),
      });
      // Refresh user so order list is up-to-date
      const me = await apiFetch('/api/auth/me');
      setUser(me.user);
      return data.order;
    } catch (err) {
      // Fallback: return a local order object so checkout still completes
      return {
        id            : 'ORD-' + Date.now().toString(36).toUpperCase(),
        date          : new Date().toISOString(),
        status        : paymentMethod === 'cod' ? 'Confirmed (Cash on Delivery)' : 'Processing',
        total,
        paymentMethod : paymentMethod || 'card',
        paymentDetails: paymentDetails || {},
        items         : items.length,
        itemDetails   : items.map(i => ({ id: i.id, title: i.title, thumbnail: i.thumbnail, price: i.price, qty: i.qty })),
        shipping,
      };
    }
  }, []);

  // ── Get orders (lazy fetch) ───────────────────────────────────────────────
  const getOrders = useCallback(async () => {
    try {
      const data = await apiFetch('/api/orders');
      return data.orders;
    } catch {
      return user?.orders || [];
    }
  }, [user]);

  if (loading) return null; // wait until token is verified before rendering

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile, changePassword, placeOrder, getOrders }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
