const path   = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

const mysql = require('mysql2/promise');

const DB_NAME = process.env.DB_NAME || 'gmart';

const TABLES = [
  {
    name: 'users',
    sql: `
      CREATE TABLE IF NOT EXISTS users (
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
  {
    name: 'orders',
    sql: `
      CREATE TABLE IF NOT EXISTS orders (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        order_id        VARCHAR(40)    NOT NULL UNIQUE,
        user_id         INT            NOT NULL,
        status          VARCHAR(100)   NOT NULL,
        total           DECIMAL(10,2)  NOT NULL,
        payment_method  VARCHAR(30)    DEFAULT 'card',
        payment_details JSON,
        items_count     INT            DEFAULT 0,
        item_details    JSON,
        shipping        JSON,
        created_at      DATETIME       DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
  {
    name: 'wishlist',
    sql: `
      CREATE TABLE IF NOT EXISTS wishlist (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        user_id      INT          NOT NULL,
        product_id   INT          NOT NULL,
        product_data JSON,
        added_at     DATETIME     DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_user_product (user_id, product_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  },
];

async function setup() {
  // Connect WITHOUT specifying a database so we can create it
  const conn = await mysql.createConnection({
    host    : process.env.DB_HOST     || 'localhost',
    port    : parseInt(process.env.DB_PORT || '3306', 10),
    user    : process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    // 1. Create database
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`✅  Database "${DB_NAME}" created (or already exists).`);

    // 2. Switch to it
    await conn.query(`USE \`${DB_NAME}\`;`);

    // 3. Create tables
    for (const table of TABLES) {
      await conn.query(table.sql);
      console.log(`✅  Table "${table.name}" ready.`);
    }

    console.log('\n🎉  G-Mart database setup complete!');
    console.log('    You can now start the server with:  npm run server');
  } finally {
    await conn.end();
  }
}

setup().catch(err => {
  console.error('\n❌  Setup failed:', err.message);
  console.error('    Make sure XAMPP MySQL is running and config.env credentials are correct.\n');
  process.exit(1);
});
