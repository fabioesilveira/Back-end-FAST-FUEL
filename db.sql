CREATE DATABASE db_fastFuel;

USE db_fastFuel;

CREATE TABLE users (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `fullName` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NUll,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NUll,
    `type` ENUM('admin', 'normal')
);

CREATE TABLE products (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(4, 2) NOT NULL,
    `category` ENUM('desserts', 'sides', 'sandwiches', 'beverages'),
    `image` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL
);

CREATE TABLE sales (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `status` ENUM('accept', 'deny', 'pendent'),
    `data` DATETIME DEFAULT NOW(),
    `user_id` INT NOT NULL,
    `items` JSON NOT NULL,
    `total` DECIMAL(8, 2) NOT NULL,

    CONSTRAINT fk_sales_users
      FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);

CREATE TABLE contactUs (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `orderNumber` INT DEFAULT 0,
    `phone` VARCHAR(255) DEFAULT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `message` VARCHAR(300) 
);


 
