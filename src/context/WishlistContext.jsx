import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const WishlistContext = createContext(null);
const TOKEN_KEY       = 'gmart_token';

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {};
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  // ── Load wishlist from DB when a token exists ──────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    fetch('/api/wishlist', { headers: authHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.items) setItems(data.items); })
      .catch(() => {});
  }, []);

  // ── Toggle: add or remove ──────────────────────────────────────────────────
  const toggleWishlist = useCallback((product) => {
    const exists = items.some(i => i.id === product.id);
    if (exists) {
      setItems(prev => prev.filter(i => i.id !== product.id));
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        fetch(`/api/wishlist/${product.id}`, { method: 'DELETE', headers: authHeaders() }).catch(() => {});
      }
    } else {
      setItems(prev => [...prev, product]);
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        fetch('/api/wishlist', {
          method : 'POST',
          headers: authHeaders(),
          body   : JSON.stringify({ product }),
        }).catch(() => {});
      }
    }
  }, [items]);

  // ── Remove by id ───────────────────────────────────────────────────────────
  const removeFromWishlist = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetch(`/api/wishlist/${id}`, { method: 'DELETE', headers: authHeaders() }).catch(() => {});
    }
  }, []);

  const isWishlisted = useCallback((id) => items.some(i => i.id === id), [items]);

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
