<img width="1877" height="1075" alt="image" src="https://github.com/user-attachments/assets/d30f9820-e63b-41ac-b597-f27f49127bd6" />


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
- Add / remove items with **animated fade-out removal**
- Quantity stepper per item (− / +)
- **Save for Later** — moves any item to your Wishlist instantly
- **Clear Cart** with inline confirmation prompt (prevents accidental wipes)
- **Free-shipping progress bar** — animated gradient bar tracking progress toward the $120 free-shipping threshold
- **Promo / Coupon codes** — enter a code in the summary panel to unlock discounts:

  | Code | Effect |
  |---|---|
  | `SAVE10` | 10% off subtotal |
  | `WELCOME20` | 20% off subtotal |
  | `FREESHIP` | Free shipping |
  | `FLAT5` | $5 flat discount |

- **Discount line** shown in the order summary when a coupon is active
- Tax recalculated on the post-discount subtotal
- Sticky order summary sidebar on desktop

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
