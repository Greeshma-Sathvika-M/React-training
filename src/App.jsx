import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Headers/Header';
import Footer from './components/Footers/Footer';
import Home from './pages/Hom/Home';
import Shop from './pages/Shop/Shop';
import Cart from './pages/Carts/Cart';
import Wishlist from './pages/Wishlist/Wishlist';
import ProductDetail from './pages/Product/ProductDetail';
import Checkout from './pages/Checkouts/Checkout';
import OrderSuccess from './pages/Order/OrderSuccess';
import Blog from './pages/Blogs/Blog';
import Contact from './pages/Contacts/Contact';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
                <Route path="/login"         element={<Login />} />
                <Route path="/profile"       element={<Profile />} />
              </Routes>
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
