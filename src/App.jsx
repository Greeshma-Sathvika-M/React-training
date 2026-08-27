import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <div className="app-shell">
            <Header />
            <Routes>
              <Route path="/"              element={<Home />} />
              <Route path="/shop"          element={<Shop />} />
              <Route path="/product/:id"   element={<ProductDetail />} />
              <Route path="/cart"          element={<Cart />} />
              <Route path="/wishlist"      element={<Wishlist />} />
              <Route path="/checkout"      element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/blog"          element={<Blog />} />
              <Route path="/contact"       element={<Contact />} />
            </Routes>
            <Footer />
          </div>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
