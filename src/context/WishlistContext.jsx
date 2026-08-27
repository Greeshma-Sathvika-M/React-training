import React, { createContext, useContext, useState } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  const toggleWishlist = (product) => {
    setItems(prev =>
      prev.find(i => i.id === product.id)
        ? prev.filter(i => i.id !== product.id)
        : [...prev, product]
    );
  };

  const removeFromWishlist = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const isWishlisted = (id) => items.some(i => i.id === id);

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
