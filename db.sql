DROP DATABASE IF EXISTS db_fastFuel;

CREATE DATABASE db_fastFuel;

USE db_fastFuel;

-- USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    type ENUM('admin', 'normal') NOT NULL DEFAULT 'normal',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category ENUM(
        'desserts',
        'sides',
        'sandwiches',
        'beverages'
    ) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- SALES

CREATE TABLE sales (
  id INT AUTO_INCREMENT PRIMARY KEY,

  order_code CHAR(6) NOT NULL UNIQUE,
  user_id INT NULL,

  customer_name VARCHAR(80) NULL,
  customer_email VARCHAR(120) NULL,

  delivery_address JSON NULL,

  payment_method ENUM('card','apple_pay','google_pay','cash')
    NOT NULL DEFAULT 'card',

  payment_status ENUM('approved','pending','declined','refunded')
    NOT NULL DEFAULT 'approved',

  payment_ref VARCHAR(40) NULL,

  items JSON NOT NULL,
  items_snapshot JSON NOT NULL,

  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,

  tax_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0900,
  delivery_fee_base DECIMAL(10,2) NOT NULL DEFAULT 9.99,
  free_delivery_threshold DECIMAL(10,2) NOT NULL DEFAULT 30.00,

  status ENUM('received','in_progress','sent','completed')
    NOT NULL DEFAULT 'received',

  accepted_at DATETIME NULL,
  sent_at DATETIME NULL,
  received_confirmed_at DATETIME NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_sales_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL,

  INDEX idx_sales_status (status),
  INDEX idx_sales_user_status (user_id, status),
  INDEX idx_sales_created (created_at),
  INDEX idx_sales_order_code (order_code),
  INDEX idx_sales_customer_email (customer_email),
  INDEX idx_sales_payment_status (payment_status)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;


-- CONTACT US
CREATE TABLE contactUs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    order_code CHAR(6) NULL,
    phone VARCHAR(50) NULL,
    subject VARCHAR(255) NOT NULL,
    message VARCHAR(500) NOT NULL,
    replied TINYINT(1) NOT NULL DEFAULT 0,
    replied_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contact_order FOREIGN KEY (order_code) REFERENCES sales (order_code) ON DELETE SET NULL,
    INDEX idx_contact_email (email),
    INDEX idx_contact_replied (replied),
    INDEX idx_contact_order (order_code)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;