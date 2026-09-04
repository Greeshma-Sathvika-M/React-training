import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'gmart_users';
const SESSION_KEY = 'gmart_session';

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}
function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
  catch { return null; }
}
function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSession());

  const register = useCallback(({ name, email, password }) => {
    const users = loadUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
      orders: [],
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const session = { ...newUser };
    delete session.password;
    saveSession(session);
    setUser(session);
    return { ok: true };
  }, []);

  const login = useCallback(({ email, password }) => {
    const users = loadUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: 'Invalid email or password.' };
    const session = { ...found };
    delete session.password;
    saveSession(session);
    setUser(session);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx === -1) return { ok: false, error: 'User not found.' };
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
    const session = { ...users[idx] };
    delete session.password;
    saveSession(session);
    setUser(session);
    return { ok: true };
  }, [user]);

  const placeOrder = useCallback(({ items, total, shipping }) => {
    const order = {
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      date: new Date().toISOString(),
      status: 'Processing',
      total,
      items: items.length,
      itemDetails: items.map(i => ({
        id: i.id,
        title: i.title,
        thumbnail: i.thumbnail,
        price: i.price,
        qty: i.qty,
      })),
      shipping,
    };
    if (!user) return order; // guest checkout fallback
    const users = loadUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx].orders = [order, ...(users[idx].orders || [])];
      saveUsers(users);
      const session = { ...users[idx] };
      delete session.password;
      saveSession(session);
      setUser(session);
    }
    return order;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile, placeOrder }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
