import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

const COUPONS = {
  SAVE10:    { type: 'percent',  value: 10,   label: '10% off' },
  WELCOME20: { type: 'percent',  value: 20,   label: '20% off' },
  FREESHIP:  { type: 'shipping', value: 0,    label: 'Free shipping' },
  FLAT5:     { type: 'flat',     value: 5,    label: '$5 off' },
};

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState(null); // { code, type, value, label }

  const addToCart = (product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    const def = COUPONS[code.toUpperCase()];
    if (!def) return { ok: false, error: 'Invalid coupon code.' };
    setCoupon({ code: code.toUpperCase(), ...def });
    return { ok: true, label: def.label };
  };

  const removeCoupon = () => setCoupon(null);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQty, clearCart,
      totalItems, totalPrice,
      coupon, applyCoupon, removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
