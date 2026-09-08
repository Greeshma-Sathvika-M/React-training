# XAMPP MySQL Setup Guide for G-Mart

## Step 1 — Start XAMPP Services

1. Open the **XAMPP Control Panel**
2. Click **Start** next to **Apache**
3. Click **Start** next to **MySQL**

---

## Step 2 — Create the Database & Tables

1. Open your browser and go to: **http://localhost/phpmyadmin**
2. Click **New** in the left sidebar
3. Type `gmart` as the database name, select **utf8mb4_unicode_ci**, then click **Create**
4. Click the `gmart` database, then click the **SQL** tab
5. Paste the following SQL and click **Go**:

```sql
-- Users table
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120)  NOT NULL,
  email      VARCHAR(191)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  phone      VARCHAR(30)   DEFAULT '',
  address    VARCHAR(255)  DEFAULT '',
  city       VARCHAR(100)  DEFAULT '',
  state      VARCHAR(100)  DEFAULT '',
  zip        VARCHAR(20)   DEFAULT '',
  country    VARCHAR(10)   DEFAULT 'US',
  orders     JSON,
  created_at DATETIME      DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  order_id        VARCHAR(40)   NOT NULL UNIQUE,
  user_id         INT           NOT NULL,
  status          VARCHAR(100)  NOT NULL,
  total           DECIMAL(10,2) NOT NULL,
  payment_method  VARCHAR(30)   DEFAULT 'card',
  payment_details JSON,
  items_count     INT           DEFAULT 0,
  item_details    JSON,
  shipping        JSON,
  created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Wishlist table
CREATE TABLE wishlist (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT          NOT NULL,
  product_id   INT          NOT NULL,
  product_data JSON,
  added_at     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_product (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Step 3 — Configure the Server

Open **`server/config.env`** and set your values:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=         ← leave blank if XAMPP has no root password (default)
DB_NAME=gmart

JWT_SECRET=change_this_to_something_long_and_random
JWT_EXPIRES_IN=7d

PORT=5000
```

> ⚠️ If you set a MySQL root password in XAMPP, enter it in `DB_PASSWORD`.

---

## Step 4 — Run the Project

Open **two terminals** in the project folder, OR use the single `dev` command:

### Option A — single command (recommended)
```bash
npm run dev
```
This starts both the Express API server (port 5000) and the React app (port 3000) together.

### Option B — two terminals
**Terminal 1** — API server:
```bash
npm run server
```

**Terminal 2** — React app:
```bash
npm start
```

---

## Step 5 — Verify the Connection

Visit: **http://localhost:5000/api/health**

You should see:
```json
{ "status": "ok", "db": "connected" }
```

---

## API Endpoints Summary

| Method | Endpoint                  | Auth required | Description              |
|--------|---------------------------|---------------|--------------------------|
| POST   | /api/auth/register        | No            | Register new user        |
| POST   | /api/auth/login           | No            | Login                    |
| GET    | /api/auth/me              | Yes           | Get current user         |
| PUT    | /api/profile              | Yes           | Update profile fields    |
| PUT    | /api/profile/password     | Yes           | Change password          |
| POST   | /api/orders               | Yes           | Place order              |
| GET    | /api/orders               | Yes           | Get user's orders        |
| GET    | /api/wishlist             | Yes           | Get user's wishlist      |
| POST   | /api/wishlist             | Yes           | Add item to wishlist     |
| DELETE | /api/wishlist/:productId  | Yes           | Remove item from wishlist|
| GET    | /api/health               | No            | DB health check          |
