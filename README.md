<img width="1909" height="1077" alt="image" src="https://github.com/user-attachments/assets/cfebcd76-8d12-4b3b-ab61-5bbd34f6b64c" /># G-Mart — React E-Commerce App

A fully functional e-commerce storefront built with **React**, powered by the [DummyJSON](https://dummyjson.com/) API.

---

## 🖥️ Pages & Features

### 🏠 Home
- Hero banner with promotions
- Popular Products grid (Top Rated / Best Selling / Latest tabs)
- Promo banner section
- Service highlights (Free Shipping, Refund, Support, Payment)

### 🛍️ Product Detail Page (PDP)
- **Route:** `/product/:id`
- **API:** `GET https://dummyjson.com/products/{id}`
- Breadcrumb navigation: Home › Shop › Category › Product
- Vertical thumbnail strip + large main image viewer
- Product title, star rating, review count, SKU
- Price with original strikethrough and discount % badge
- Stock status badge (In Stock / Low Stock)
- Quantity stepper (− / +)
- **Add to Cart** and **Add to Wishlist** buttons
- Service badges: Free Shipping · Easy Returns · Secure Payment
- Tabbed section: **Description · Additional Information · Reviews · Shipping & Returns**
- **You may also like** — related products from the same category




### 🏪 Shop
- Full product listing with search and category filter

### 🛒 Cart
- Add / remove items, quantity controls, order summary

### ❤️ Wishlist
- Save products for later

### 📦 Checkout & Order Success
- Order form flow with success confirmation

### 📝 Blog & 📞 Contact
- Static informational pages

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 16
- npm

### Install & Run

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Header.jsx / Header.css
│   ├── Footer.jsx / Footer.css
│   ├── Banner.jsx / Banner.css
│   ├── ProductCard.jsx / ProductCard.css
│   └── ProductList.jsx / ProductList.css
├── pages/
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── ProductDetail.jsx   ← PDP
│   ├── Cart.jsx
│   ├── Wishlist.jsx
│   ├── Checkout.jsx
│   ├── OrderSuccess.jsx
│   ├── Blog.jsx
│   └── Contact.jsx
├── context/
│   ├── CartContext.jsx
│   └── WishlistContext.jsx
└── App.jsx
```

---

## 🔌 API

All product data is fetched from [https://dummyjson.com](https://dummyjson.com).

| Endpoint | Used for |
|---|---|
| `GET /products?limit=12` | Home & Shop product listing |
| `GET /products/{id}` | Product Detail Page |
| `GET /products/category/{category}` | Related products on PDP |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Context API | Cart & Wishlist state |
| CSS Modules (plain CSS) | Styling |
| DummyJSON API | Mock product data |

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm start` | Run in development mode |
| `npm test` | Launch test runner |
| `npm run build` | Production build |
